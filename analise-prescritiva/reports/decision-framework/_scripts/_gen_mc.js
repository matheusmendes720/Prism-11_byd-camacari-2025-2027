// MC multivariado: 4 vars x 4 scenarios x 10k runs
// PRNG: mulberry32 + Box-Muller (reprodutibilidade)
// Co-dependencies: Cholesky decomposition
// Output: _model_mc.json com distribuicao, percentis, tornado co-deps

const fs = require('fs');
const path = require('path');

const R = 0.13;
const HORIZON = 3;
const N_RUNS = 10000;
const SEED = 42;

const SCENARIOS = {
  Expansao: { vie: 0.25, p_shock: 0.20 },
  Continuidade: { vie: 0.18, p_shock: 0.30 },
  RollbackParcial: { vie: 0.10, p_shock: 0.50 },
  RollbackTotal: { vie: 0.00, p_shock: 0.70 },
};

const HEDGE = { cost_per_year: { Expansao: 37.8, Continuidade: 48.6, RollbackParcial: 77.8, RollbackTotal: 114.2 } };
const DUAL = { cost_capex: { Expansao: 280, Continuidade: 280, RollbackParcial: 280, RollbackTotal: 280 }, cost_per_year: { Expansao: 80, Continuidade: 80, RollbackParcial: 80, RollbackTotal: 80 } };
const ADVOCACY = { cost_per_year: { Expansao: 12, Continuidade: 12, RollbackParcial: 12, RollbackTotal: 12 } };
const DEFENSIVO = { cost_per_year: { Expansao: 45, Continuidade: 45, RollbackParcial: 30, RollbackTotal: 15 } };
const PARTNERSHIPS = { cost_capex: { Expansao: 30, Continuidade: 30, RollbackParcial: 30, RollbackTotal: 30 }, cost_per_year: { Expansao: 5, Continuidade: 5, RollbackParcial: 5, RollbackTotal: 5 } };
const FRAMEWORK = { cost_per_year: { Expansao: 1, Continuidade: 1, RollbackParcial: 1, RollbackTotal: 1 } };

const VAR_FX_BASE = 2080;
const VAR_SUPPLY_BASE = 5180;

// === PRNG: mulberry32 ===
function mulberry32(seed) {
  let a = seed | 0;
  return function() {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller para normal standard
function makeNormal(rand) {
  return function() {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

// === VARIAVEIS E DISTRIBUICOES ===
// 4 vars em 3yr cumulative horizon
const VARS = {
  ptax: {
    name: 'PTAX',
    unit: 'R$/US$',
    mu_log: Math.log(5.20),
    sigma_log: 0.30,  // ~30% em 3y (vs anual 14.19%)
    description: 'Câmbio BRL/USD em 3 anos',
  },
  litio: {
    name: 'Lítio',
    unit: 'US$/t',
    mu_log: Math.log(15000),
    sigma_log: 0.70,  // ~70% em 3y (vs anual 35%)
    description: 'Preço carbonato de lítio em 3 anos',
  },
  demand: {
    name: 'Demand EV',
    unit: 'k unidades/ano',
    mu_log: Math.log(80),
    sigma_log: 0.40,  // ~40% em 3y (vs anual 20%)
    description: 'Vendas anuais EV Brasil em 3 anos',
  },
  ipca: {
    name: 'IPCA',
    unit: '%',
    mu: 4.5,
    sigma: 1.5,
    description: 'Inflação 12m acumulada em 3 anos',
  },
};

// === CORRELACOES (do D2 S6 IRF/FEVD) ===
// Indices: 0=ptax, 1=litio, 2=demand, 3=ipca
// ρ matrix (simetrica)
const RHO = [
  [1.0,  0.3, -0.1, 0.5],  // ptax: positivo vs litio, ipca; negativo vs demand
  [0.3,  1.0, -0.2, 0.2],  // litio: positivo vs ptax, ipca; negativo vs demand
  [-0.1, -0.2, 1.0, -0.3], // demand: negativo vs ptax, litio, ipca
  [0.5,  0.2, -0.3, 1.0],  // ipca: positivo vs ptax, litio; negativo vs demand
];

// Cholesky decomposition: RHO = L * L^T
function cholesky(matrix) {
  const n = matrix.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) {
        L[i][j] = Math.sqrt(matrix[i][i] - sum);
      } else {
        L[i][j] = (matrix[i][j] - sum) / L[j][j];
      }
    }
  }
  return L;
}

const L = cholesky(RHO);

// === NPV function (igual ao sensitivity) ===
function npv(cost_per_year, cost_capex, benefit, r) {
  let total = 0;
  total -= (cost_capex || 0) / Math.pow(1 + r, 0);
  for (let t = 1; t <= HORIZON; t++) total -= cost_per_year / Math.pow(1 + r, t);
  total += benefit / Math.pow(1 + r, 2);
  return total;
}

function totalNpv(scenario, ptaxFactor, litioFactor, demandFactor, rAdj) {
  const varFx = VAR_FX_BASE * ptaxFactor;
  const varSupply = VAR_SUPPLY_BASE * litioFactor;
  const p = SCENARIOS[scenario].p_shock;
  const r = R + rAdj; // 13% + ajuste IPCA

  const hedgeBenefit = 0.30 * varFx * p;
  const dualBenefit = varSupply * p;
  const advocacyBenefit = 75 * p;
  const defMargin = (scenario === 'Expansao' ? 90000 : scenario === 'Continuidade' ? 69000 : scenario === 'RollbackParcial' ? 45000 : 15000);
  const defensivoBenefit = 5000 * demandFactor * defMargin / 1e6 * p;
  const partnershipBenefit = 150 * p;
  const frameworkBenefit = 700 * (scenario === 'Expansao' ? 0.5 : scenario === 'Continuidade' ? 0.8 : scenario === 'RollbackParcial' ? 0.8 : 0.9);

  return (
    npv(HEDGE.cost_per_year[scenario], 0, hedgeBenefit, r) +
    npv(DUAL.cost_per_year[scenario], DUAL.cost_capex[scenario], dualBenefit, r) +
    npv(ADVOCACY.cost_per_year[scenario], 0, advocacyBenefit, r) +
    npv(DEFENSIVO.cost_per_year[scenario], 0, defensivoBenefit, r) +
    npv(PARTNERSHIPS.cost_per_year[scenario], PARTNERSHIPS.cost_capex[scenario], partnershipBenefit, r) +
    npv(FRAMEWORK.cost_per_year[scenario], 0, frameworkBenefit, r)
  );
}

// === MC LOOP ===
const rand = mulberry32(SEED);
const normal = makeNormal(rand);

const samples = { ptax: [], litio: [], demand: [], ipca: [] };
const npvByRunByScenario = {
  Expansao: [], Continuidade: [], RollbackParcial: [], RollbackTotal: [],
};
const totalByRun = [];

for (let run = 0; run < N_RUNS; run++) {
  // Sample 4 independent N(0,1)
  const z = [normal(), normal(), normal(), normal()];
  // Apply Cholesky to get correlated normals
  const correlated = [0, 1, 2, 3].map((i) => L[i].reduce((sum, ljk, k) => sum + ljk * z[k], 0));
  // Transform to marginals
  // ptax: lognormal
  const ptax = Math.exp(VARS.ptax.mu_log + VARS.ptax.sigma_log * correlated[0]);
  const ptaxFactor = ptax / 5.20; // factor vs baseline 5.20
  // litio: lognormal
  const litio = Math.exp(VARS.litio.mu_log + VARS.litio.sigma_log * correlated[1]);
  const litioFactor = litio / 15000;
  // demand: lognormal
  const demand = Math.exp(VARS.demand.mu_log + VARS.demand.sigma_log * correlated[2]);
  const demandFactor = demand / 80;
  // ipca: normal — ajusta taxa de desconto
  const ipca = VARS.ipca.mu + VARS.ipca.sigma * correlated[3];
  const rAdj = Math.max(0, (ipca - 4.5) * 0.01); // cada 1pp IPCA acima de 4.5% = +1pp nominal

  samples.ptax.push(ptax);
  samples.litio.push(litio);
  samples.demand.push(demand);
  samples.ipca.push(ipca);

  let total = 0;
  for (const scen of Object.keys(SCENARIOS)) {
    const npv = totalNpv(scen, ptaxFactor, litioFactor, demandFactor, rAdj);
    npvByRunByScenario[scen].push(npv);
    total += npv;
  }
  totalByRun.push(total);
}

// === ESTATISTICAS ===
function stats(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  return {
    mean, std,
    min: sorted[0],
    p5: sorted[Math.floor(n * 0.05)],
    p25: sorted[Math.floor(n * 0.25)],
    p50: sorted[Math.floor(n * 0.50)],
    p75: sorted[Math.floor(n * 0.75)],
    p95: sorted[Math.floor(n * 0.95)],
    p99: sorted[Math.floor(n * 0.99)],
    max: sorted[n - 1],
  };
}

const totalStats = stats(totalByRun);
const perScenarioStats = {};
for (const scen of Object.keys(SCENARIOS)) {
  perScenarioStats[scen] = stats(npvByRunByScenario[scen]);
}

// === TORNADO CO-DEPS ===
// Para cada variavel, calcular correlacao com totalByRun
function correlation(x, y) {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dxi = x[i] - mx;
    const dyi = y[i] - my;
    num += dxi * dyi;
    dx2 += dxi * dxi;
    dy2 += dyi * dyi;
  }
  return num / Math.sqrt(dx2 * dy2);
}

const correlations = {
  ptax: correlation(samples.ptax, totalByRun),
  litio: correlation(samples.litio, totalByRun),
  demand: correlation(samples.demand, totalByRun),
  ipca: correlation(samples.ipca, totalByRun),
};

// === HISTOGRAM (20 bins) ===
function histogram(arr, nBins) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const width = (max - min) / nBins;
  const bins = Array.from({ length: nBins }, (_, i) => ({
    from: min + i * width,
    to: min + (i + 1) * width,
    count: 0,
  }));
  for (const v of arr) {
    let idx = Math.floor((v - min) / width);
    if (idx >= nBins) idx = nBins - 1;
    bins[idx].count++;
  }
  return bins;
}

const histogramData = histogram(totalByRun, 20);

// === OUTPUT ===
const out = {
  params: {
    n_runs: N_RUNS,
    seed: SEED,
    prng: 'mulberry32 + Box-Muller',
    horizon_years: HORIZON,
    baseline_r: R,
  },
  variables: VARS,
  correlations_matrix: RHO,
  cholesky_L: L,
  total_stats: totalStats,
  per_scenario_stats: perScenarioStats,
  variable_correlations_with_total: correlations,
  histogram: histogramData,
  baseline_for_comparison: {
    Expansao: 552, Continuidade: 1216, RollbackParcial: 2538, RollbackTotal: 3896,
    total: 8202,
    note: 'Baseline deterministic NPV do modelo principal (sessão 1)',
  },
};

const outPath = path.join(__dirname, '_model_mc.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`MC model written to ${outPath}`);
console.log(`\n=== Total NPV across ${N_RUNS} runs (R$ M) ===`);
console.log(`  mean:  R$ ${totalStats.mean.toFixed(0)}M`);
console.log(`  std:   R$ ${totalStats.std.toFixed(0)}M`);
console.log(`  P5:    R$ ${totalStats.p5.toFixed(0)}M`);
console.log(`  P50:   R$ ${totalStats.p50.toFixed(0)}M`);
console.log(`  P95:   R$ ${totalStats.p95.toFixed(0)}M`);
console.log(`  P99:   R$ ${totalStats.p99.toFixed(0)}M`);
console.log(`  min:   R$ ${totalStats.min.toFixed(0)}M`);
console.log(`  max:   R$ ${totalStats.max.toFixed(0)}M`);

console.log(`\n=== Variable correlations with total NPV ===`);
for (const [k, v] of Object.entries(correlations)) {
  console.log(`  ${k}: ρ = ${v.toFixed(3)}`);
}

console.log(`\n=== Per-scenario stats (R$ M) ===`);
for (const [scen, s] of Object.entries(perScenarioStats)) {
  console.log(`  ${scen}: mean R$ ${s.mean.toFixed(0)}M | P5 R$ ${s.p5.toFixed(0)}M | P95 R$ ${s.p95.toFixed(0)}M`);
}
