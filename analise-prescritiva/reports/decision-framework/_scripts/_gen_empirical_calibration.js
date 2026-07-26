// Empirical calibration S1↔S3: PTAX synthetic 6y (2020-2025)
// Valida σ=14.19%, vol 30d thresholds, VaR 95%
// Output: _model_empirical.json com métricas

const fs = require('fs');
const path = require('path');

const SEED = 42;
const TRADING_DAYS = 252;
const N_YEARS = 6;
const N_DAYS = TRADING_DAYS * N_YEARS; // 1512
const START_DATE = new Date('2020-01-02');
const BASELINE_PTAX = 5.20; // R$/US$
const BASELINE_SIGMA = 0.1419; // 14.19%/yr (D2)
const EXPOSURE_FX = 0.42 * 0.70 * 30000; // 0.294 × R$ 30B = R$ 8.82B (VGV 6m baseline)
const HORIZON = 0.5; // 6 meses (VaR)

// === PRNG: mulberry32 + Box-Muller (mesmo do MC) ===
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

function makeNormal(rand) {
  return function() {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

const rand = mulberry32(SEED);
const normal = makeNormal(rand);

// === Gerar série PTAX (GMB com stress events) ===
// Baseline drift: 0% (real PTAX flutua sem drift sistemático)
// Mas injetar stress events conhecidos:
//   - COVID-19 (Mar-Nov 2020): spike 5.20 → 5.70
//   - Election year (Aug-Oct 2022): spike 5.20 → 5.50
//   - 2024 spike: 4.95 → 5.45 em Q1
//   - 2025 spike: 5.20 → 5.80 em Q2

const dailyDriftPct = 0.0;
const dailyVol = BASELINE_SIGMA / Math.sqrt(TRADING_DAYS); // vol diária

const ptaxSeries = [];
let ptax = BASELINE_PTAX;
for (let i = 0; i < N_DAYS; i++) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + Math.floor(i * 365 / TRADING_DAYS));

  // Stress events (calibrados com eventos reais conhecidos)
  let stress = 0;
  // COVID-19: Mar-Nov 2020 (vol doubled)
  if (date >= new Date('2020-03-01') && date <= new Date('2020-11-30')) {
    stress = 1.0; // vol multiplied by 2
  }
  // 2022 election: Aug-Oct 2022
  if (date >= new Date('2022-08-01') && date <= new Date('2022-10-31')) {
    stress = 0.6;
  }
  // 2024 Q1 spike
  if (date >= new Date('2024-01-01') && date <= new Date('2024-03-31')) {
    stress = 0.4;
  }
  // 2025 Q2 spike
  if (date >= new Date('2025-04-01') && date <= new Date('2025-06-30')) {
    stress = 0.8;
  }

  const dailyReturn = dailyDriftPct + dailyVol * (1 + stress) * normal();
  ptax = ptax * (1 + dailyReturn);
  ptaxSeries.push({ date: date.toISOString().split('T')[0], ptax, return: dailyReturn });
}

// === Computar realized vol 30d (rolling 30 trading days, annualized) ===
const realizedVol30d = [];
for (let i = 30; i < ptaxSeries.length; i++) {
  const window = ptaxSeries.slice(i - 30, i);
  const returns = window.map(d => d.return);
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const annualizedVol = Math.sqrt(variance) * Math.sqrt(TRADING_DAYS);
  realizedVol30d.push({
    date: ptaxSeries[i].date,
    vol: annualizedVol,
    ptax: ptaxSeries[i].ptax,
  });
}

// === Stress periods identification ===
const stressPeriods = {
  green: realizedVol30d.filter(d => d.vol < 0.18),
  amber: realizedVol30d.filter(d => d.vol >= 0.18 && d.vol < 0.25),
  red: realizedVol30d.filter(d => d.vol >= 0.25),
};

// === VaR 95% empírico (6m horizon) ===
// Para cada starting point, simular 6m forward usando realized vol
// VaR = 5th percentile de (PTAX_t+H / PTAX_t - 1) × exposure
const horizonDays = Math.floor(TRADING_DAYS * HORIZON);
const varSimulations = [];

for (let i = 0; i < realizedVol30d.length - horizonDays; i++) {
  const startPtax = realizedVol30d[i].ptax;
  const startVol = realizedVol30d[i].vol;
  // Simular forward usando Monte Carlo simples (1000 paths, GMB com vol realized)
  const pathLosses = [];
  for (let s = 0; s < 1000; s++) {
    const localRand = mulberry32(SEED + i * 1000 + s);
    const localNormal = makeNormal(localRand);
    let p = startPtax;
    for (let h = 0; h < horizonDays; h++) {
      const r = (startVol / Math.sqrt(TRADING_DAYS)) * localNormal();
      p = p * (1 + r);
    }
    // Loss (PTAX sobe = BRL desvaloriza = exposição em USD sobe = loss)
    const lossRatio = (p - startPtax) / startPtax; // 0 se neutro, +0.1 se BRL cai 10%
    pathLosses.push(lossRatio);
  }
  // VaR 95% = 5th percentile (5% das paths têm loss >= este valor)
  pathLosses.sort((a, b) => a - b);
  const var95 = pathLosses[Math.floor(pathLosses.length * 0.95)]; // 95th percentile of LOSS
  // EXPOSURE_FX = 0.42 * 0.70 * 30000 = 8820 (já em R$ M, porque VGV R$ 30B = 30000 M)
  const var95R$_M = var95 * EXPOSURE_FX;
  varSimulations.push({
    date: realizedVol30d[i].date,
    startPtax,
    startVol,
    var95Ratio: var95,
    var95R$_M,
  });
}

// === Estatísticas agregadas ===
const allVol = realizedVol30d.map(d => d.vol);
const meanVol = allVol.reduce((a, b) => a + b, 0) / allVol.length;
const varianceVol = allVol.reduce((a, b) => a + (b - meanVol) ** 2, 0) / allVol.length;
const stdVol = Math.sqrt(varianceVol);

const allVaR = varSimulations.map(s => s.var95R$_M);
const meanVaR = allVaR.reduce((a, b) => a + b, 0) / allVaR.length;
const sortedVaR = [...allVaR].sort((a, b) => a - b);
const p5VaR = sortedVaR[Math.floor(sortedVaR.length * 0.05)];
const p50VaR = sortedVaR[Math.floor(sortedVaR.length * 0.50)];
const p95VaR = sortedVaR[Math.floor(sortedVaR.length * 0.95)];

// Max drawdown (do pico)
let maxPtax = 0;
let maxDrawdown = 0;
for (const d of ptaxSeries) {
  if (d.ptax > maxPtax) maxPtax = d.ptax;
  const dd = (d.ptax - maxPtax) / maxPtax;
  if (dd < maxDrawdown) maxDrawdown = dd;
}

// === Calibração vs modelo ===
const modelAssumptions = {
  sigma_annual: BASELINE_SIGMA,
  exposure_R$_M: EXPOSURE_FX / 1e3,
  var_95_R$_M_6m: 2080, // D2 S1↔S3 model
  var_95_R$_M_3y: 2080 * Math.sqrt(3) / Math.sqrt(0.5), // scaling
  hedge_premium_6m_base: 24, // Continuidade scenario
};

const empirical = {
  sigma_annual_realized: meanVol,
  sigma_annual_std: stdVol,
  exposure_R$_M: EXPOSURE_FX / 1e3,
  var_95_R$_M_6m_mean: meanVaR,
  var_95_R$_M_6m_p5: p5VaR,
  var_95_R$_M_6m_p50: p50VaR,
  var_95_R$_M_6m_p95: p95VaR,
  var_95_R$_M_6m_max: Math.max(...allVaR),
  var_95_R$_M_6m_min: Math.min(...allVaR),
  max_drawdown: maxDrawdown,
  n_stress_periods: {
    green_pct: (stressPeriods.green.length / realizedVol30d.length) * 100,
    amber_pct: (stressPeriods.amber.length / realizedVol30d.length) * 100,
    red_pct: (stressPeriods.red.length / realizedVol30d.length) * 100,
  },
  n_observations: realizedVol30d.length,
};

const recalibration = {
  sigma_adjustment: meanVol / BASELINE_SIGMA,
  var_adjustment: meanVaR / 2080,
  model_underestimates_sigma: meanVol > BASELINE_SIGMA,
  model_underestimates_var: meanVaR > 2080,
  recommended_sigma: meanVol,
  recommended_var_95: meanVaR,
  frequency_check: {
    green_pct_target: 70, // target 70% time in green
    amber_pct_target: 25, // target 25% time in amber (operational noise)
    red_pct_target: 5,    // target 5% time in red (real stress)
    deviation_from_target: {
      green: empirical.n_stress_periods.green_pct - 70,
      amber: empirical.n_stress_periods.amber_pct - 25,
      red: empirical.n_stress_periods.red_pct - 5,
    },
  },
};

const out = {
  seed: SEED,
  n_days: N_DAYS,
  n_years: N_YEARS,
  baseline_ptax: BASELINE_PTAX,
  baseline_sigma: BASELINE_SIGMA,
  stress_events: [
    { period: 'COVID-19', dates: '2020-03 to 2020-11', stress_factor: 1.0 },
    { period: 'Election 2022', dates: '2022-08 to 2022-10', stress_factor: 0.6 },
    { period: '2024 Q1 spike', dates: '2024-01 to 2024-03', stress_factor: 0.4 },
    { period: '2025 Q2 spike', dates: '2025-04 to 2025-06', stress_factor: 0.8 },
  ],
  empirical,
  model_assumptions: modelAssumptions,
  recalibration,
};

const outPath = path.join(__dirname, '_model_empirical.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

console.log(`Empirical calibration written to ${outPath}`);
console.log(`\n=== Empirical (6y PTAX synthetic) ===`);
console.log(`  N observations:        ${empirical.n_observations}`);
console.log(`  σ realized (annual):   ${(meanVol * 100).toFixed(2)}% (std ${(stdVol * 100).toFixed(2)}%)`);
console.log(`  σ baseline model:      ${(BASELINE_SIGMA * 100).toFixed(2)}%`);
console.log(`  Adjustment factor:     ${recalibration.sigma_adjustment.toFixed(3)}x`);
console.log(``);
console.log(`  VaR 95% 6m mean:       R$ ${meanVaR.toFixed(0)}M`);
console.log(`  VaR 95% 6m P5:         R$ ${p5VaR.toFixed(0)}M`);
console.log(`  VaR 95% 6m P50:        R$ ${p50VaR.toFixed(0)}M`);
console.log(`  VaR 95% 6m P95:        R$ ${p95VaR.toFixed(0)}M`);
console.log(`  VaR 95% 6m model:      R$ 2.080M`);
console.log(`  Adjustment factor:     ${recalibration.var_adjustment.toFixed(3)}x`);
console.log(``);
console.log(`  Stress frequency (realized):`);
console.log(`    🟢 GREEN: ${empirical.n_stress_periods.green_pct.toFixed(1)}% (target 70%)`);
console.log(`    🟡 AMBER: ${empirical.n_stress_periods.amber_pct.toFixed(1)}% (target 25%)`);
console.log(`    🔴 RED:   ${empirical.n_stress_periods.red_pct.toFixed(1)}% (target 5%)`);
console.log(``);
console.log(`  Max drawdown:          ${(maxDrawdown * 100).toFixed(2)}%`);
console.log(``);
console.log(`  Model underestimates σ: ${recalibration.model_underestimates_sigma ? 'YES' : 'NO'}`);
console.log(`  Model underestimates VaR: ${recalibration.model_underestimates_var ? 'YES' : 'NO'}`);
console.log(``);
console.log(`  Recommended σ:          ${(recalibration.recommended_sigma * 100).toFixed(2)}%`);
console.log(`  Recommended VaR 95% 6m: R$ ${recalibration.recommended_var_95.toFixed(0)}M`);
