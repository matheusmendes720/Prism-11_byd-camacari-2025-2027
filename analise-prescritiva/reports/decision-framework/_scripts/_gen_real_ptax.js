// Fetch BCB SGS PTAX data 2015-2025 (10 anos, real) e processa métricas
// Output: _model_empirical_real.json

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial=01/07/2015&dataFinal=01/07/2025';
const TRADING_DAYS = 252;
const SEED = 42;
const HORIZON = 0.5; // 6m VaR

// PRNG: mulberry32 + Box-Muller
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

// === FETCH BCB DATA ===
function fetchBcbData() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`parse fail: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// === PROCESS ===
async function main() {
  console.log('Fetching BCB SGS PTAX data (2015-07 to 2025-07)...');
  const raw = await fetchBcbData();
  console.log(`  Got ${raw.length} daily observations`);

  // Save raw to file
  const rawPath = path.join(__dirname, '_bcb_ptax_raw.json');
  fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2));
  console.log(`  Saved to ${rawPath}`);

  // Parse: {data: "DD/MM/YYYY", valor: "X.XXXX"}
  const series = raw.map(d => ({
    date: d.data.split('/').reverse().join('-'), // YYYY-MM-DD
    ptax: parseFloat(d.valor),
  })).filter(d => !isNaN(d.ptax));

  console.log(`  Valid observations: ${series.length}`);
  console.log(`  Period: ${series[0].date} to ${series[series.length-1].date}`);
  console.log(`  Start: R$ ${series[0].ptax}, End: R$ ${series[series.length-1].ptax}`);

  // Compute daily returns
  for (let i = 1; i < series.length; i++) {
    series[i].return = (series[i].ptax - series[i-1].ptax) / series[i-1].ptax;
  }

  // === Vol 30d rolling ===
  const vol30d = [];
  for (let i = 30; i < series.length; i++) {
    const window = series.slice(i - 30, i);
    const returns = window.map(d => d.return);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
    vol30d.push({
      date: series[i].date,
      vol: Math.sqrt(variance) * Math.sqrt(TRADING_DAYS),
      ptax: series[i].ptax,
    });
  }

  // === σ realized annual ===
  const allReturns = series.slice(1).map(d => d.return);
  const meanRet = allReturns.reduce((a, b) => a + b, 0) / allReturns.length;
  const varRet = allReturns.reduce((a, b) => a + (b - meanRet) ** 2, 0) / allReturns.length;
  const sigmaAnnual = Math.sqrt(varRet) * Math.sqrt(TRADING_DAYS);

  // === Stress frequency ===
  const vol30d_clean = vol30d.filter(d => !isNaN(d.vol) && isFinite(d.vol));
  const stressFreq = {
    green_pct: vol30d_clean.filter(d => d.vol < 0.15).length / vol30d_clean.length * 100,
    amber_pct: vol30d_clean.filter(d => d.vol >= 0.15 && d.vol < 0.30).length / vol30d_clean.length * 100,
    red_pct: vol30d_clean.filter(d => d.vol >= 0.30).length / vol30d_clean.length * 100,
    n_clean: vol30d_clean.length,
    n_total: vol30d.length,
  };

  // === VaR 95% 6m (MC) ===
  // Para cada starting point, simular forward 6m usando vol realized
  const exposure_R$_M = 0.42 * 0.70 * 30000; // R$ 8.82B (já em M, sem dividir)
  const horizonDays = Math.floor(TRADING_DAYS * HORIZON);

  const varSimulations = [];
  // Subset: every 21 trading days (monthly) to save compute
  for (let i = 0; i < vol30d.length - horizonDays; i += 21) {
    const startPtax = vol30d[i].ptax;
    const startVol = vol30d[i].vol;
    const pathLosses = [];
    for (let s = 0; s < 1000; s++) {
      const localRand = mulberry32(SEED + i * 1000 + s);
      const localNormal = makeNormal(localRand);
      let p = startPtax;
      for (let h = 0; h < horizonDays; h++) {
        const r = (startVol / Math.sqrt(TRADING_DAYS)) * localNormal();
        p = p * (1 + r);
      }
      const lossRatio = Math.max(0, (p - startPtax) / startPtax);
      pathLosses.push(lossRatio);
    }
    pathLosses.sort((a, b) => a - b);
    const var95 = pathLosses[Math.floor(pathLosses.length * 0.95)];
    const var95R$_M = var95 * exposure_R$_M; // já em M
    varSimulations.push({ date: vol30d[i].date, startPtax, startVol, var95, var95R$_M });
  }

  // === Stats ===
  function stats(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    return {
      mean,
      p5: sorted[Math.floor(n * 0.05)],
      p25: sorted[Math.floor(n * 0.25)],
      p50: sorted[Math.floor(n * 0.50)],
      p75: sorted[Math.floor(n * 0.75)],
      p95: sorted[Math.floor(n * 0.95)],
      p99: sorted[Math.floor(n * 0.99)],
      min: sorted[0],
      max: sorted[n - 1],
    };
  }

  const allVar = varSimulations.map(s => s.var95R$_M);
  const varStats = stats(allVar);

  // === Max drawdown ===
  let maxPtax = 0;
  let maxDrawdown = 0;
  for (const d of series) {
    if (d.ptax > maxPtax) maxPtax = d.ptax;
    const dd = (d.ptax - maxPtax) / maxPtax;
    if (dd < maxDrawdown) maxDrawdown = dd;
  }

  // === Recompute h* for new σ ===
  // Same as apply_recalibration.js
  const R = 0.13;
  const HORIZON3Y = 3;
  const P_SHOCK = { Expansao: 0.20, Continuidade: 0.30, RollbackParcial: 0.50, RollbackTotal: 0.70 };
  const baselineSigma = 0.1419;

  const oldParams = {
    sigma: baselineSigma,
    exposure_R$_M,
    h_by_scenario: { Expansao: 0.30, Continuidade: 0.386, RollbackParcial: 0.617, RollbackTotal: 0.906 },
    premium_6m_R$_M: { Expansao: 18.9, Continuidade: 24.3, RollbackParcial: 38.9, RollbackTotal: 57.1 },
    var_95_6m_R$_M: 2080,
  };
  // New params: σ = sigmaAnnual (calibrated), VaR = P95
  const newSigma = sigmaAnnual;
  const newVar = Math.round(varStats.p95);
  // Scale h* proportionally to VaR change
  const hScale = (newVar / oldParams.var_95_6m_R$_M) * (newSigma / baselineSigma);
  const newParams = {
    sigma: newSigma,
    exposure_R$_M,
    var_95_6m_R$_M: newVar,
    h_by_scenario: {
      Expansao: Math.min(0.95, Math.max(0.30, 0.30 * hScale)),
      Continuidade: Math.min(0.95, Math.max(0.30, 0.386 * hScale)),
      RollbackParcial: Math.min(0.95, Math.max(0.30, 0.617 * hScale)),
      RollbackTotal: Math.min(0.95, Math.max(0.30, 0.906 * hScale)),
    },
  };
  newParams.premium_6m_R$_M = {};
  for (const scen of Object.keys(newParams.h_by_scenario)) {
    newParams.premium_6m_R$_M[scen] = 0.01 * newParams.h_by_scenario[scen] * exposure_R$_M;
  }

  function npv(cost_per_year, benefit, r) {
    let total = 0;
    for (let t = 1; t <= HORIZON3Y; t++) total -= cost_per_year / Math.pow(1 + r, t);
    total += benefit / Math.pow(1 + r, 2);
    return total;
  }

  function hedgeNpv(params, scenario) {
    const cost = params.premium_6m_R$_M[scenario] * 2;
    const benefit = params.h_by_scenario[scenario] * params.var_95_6m_R$_M * P_SHOCK[scenario];
    return npv(cost, benefit, R);
  }

  const npvOld = {};
  const npvNew = {};
  for (const scen of Object.keys(P_SHOCK)) {
    npvOld[scen] = hedgeNpv(oldParams, scen);
    npvNew[scen] = hedgeNpv(newParams, scen);
  }

  // === Output JSON ===
  const out = {
    source: 'BCB SGS API (sgs.10813) — 2015-07 to 2025-07',
    n_observations: series.length,
    period: { start: series[0].date, end: series[series.length-1].date },
    start_ptax: series[0].ptax,
    end_ptax: series[series.length-1].ptax,
    max_ptax: Math.max(...series.map(d => d.ptax)),
    min_ptax: Math.min(...series.map(d => d.ptax)),
    max_drawdown: maxDrawdown,
    sigma_annual_realized: sigmaAnnual,
    vol_30d_summary: {
      mean: vol30d_clean.reduce((a, b) => a + b.vol, 0) / vol30d_clean.length,
      max: vol30d_clean.length > 0 ? Math.max(...vol30d_clean.map(d => d.vol)) : null,
      min: vol30d_clean.length > 0 ? Math.min(...vol30d_clean.map(d => d.vol)) : null,
      n_clean: vol30d_clean.length,
    },
    stress_frequency: {
      green_pct: stressFreq.green_pct.toFixed(1),
      amber_pct: stressFreq.amber_pct.toFixed(1),
      red_pct: stressFreq.red_pct.toFixed(1),
      n_observations: vol30d.length,
    },
    var_95_6m_real: varStats,
    model_d2: {
      sigma: baselineSigma,
      var_95_6m: 2080,
    },
    recalibration: {
      old_sigma: baselineSigma,
      new_sigma: newSigma,
      old_var: 2080,
      new_var: newVar,
      sigma_change_pct: ((newSigma / baselineSigma - 1) * 100).toFixed(1),
      var_change_pct: ((newVar / 2080 - 1) * 100).toFixed(1),
    },
    h_by_scenario: {
      old: oldParams.h_by_scenario,
      new: newParams.h_by_scenario,
    },
    npv_by_scenario: {
      old: Object.fromEntries(Object.entries(npvOld).map(([k, v]) => [k, Math.round(v)])),
      new: Object.fromEntries(Object.entries(npvNew).map(([k, v]) => [k, Math.round(v)])),
    },
  };

  const outPath = path.join(__dirname, '_model_empirical_real.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nReal BCB empirical model written to ${outPath}`);

  console.log(`\n=== REAL BCB PTAX 2015-07 to 2025-07 (10y) ===`);
  console.log(`  N observations:        ${out.n_observations}`);
  console.log(`  Period:                ${out.period.start} to ${out.period.end}`);
  console.log(`  Start PTAX:            R$ ${out.start_ptax.toFixed(4)}`);
  console.log(`  End PTAX:              R$ ${out.end_ptax.toFixed(4)}`);
  console.log(`  Max PTAX:              R$ ${out.max_ptax.toFixed(4)}`);
  console.log(`  Min PTAX:              R$ ${out.min_ptax.toFixed(4)}`);
  console.log(`  Max drawdown:          ${(out.max_drawdown * 100).toFixed(2)}%`);
  console.log(`  σ annual realized:     ${(sigmaAnnual * 100).toFixed(2)}% (D2 model: 14.19%)`);
  console.log(`  Vol 30d max:           ${(out.vol_30d_summary.max * 100).toFixed(2)}%`);
  console.log(`  Stress freq GREEN:     ${out.stress_frequency.green_pct}% (target 70%)`);
  console.log(`  Stress freq AMBER:     ${out.stress_frequency.amber_pct}% (target 25%)`);
  console.log(`  Stress freq RED:       ${out.stress_frequency.red_pct}% (target 5%)`);
  console.log(`  VaR 95% 6m mean:       R$ ${varStats.mean.toFixed(0)}M`);
  console.log(`  VaR 95% 6m P5:         R$ ${varStats.p5.toFixed(0)}M`);
  console.log(`  VaR 95% 6m P50:        R$ ${varStats.p50.toFixed(0)}M`);
  console.log(`  VaR 95% 6m P95:        R$ ${varStats.p95.toFixed(0)}M`);

  console.log(`\n=== Recalibration recommendation ===`);
  console.log(`  σ: ${(baselineSigma*100).toFixed(2)}% → ${(newSigma*100).toFixed(2)}% (${out.recalibration.sigma_change_pct}%)`);
  console.log(`  VaR 95% 6m: R$ 2.080M → R$ ${newVar}M (${out.recalibration.var_change_pct}%)`);

  console.log(`\n=== h* by scenario (old → new) ===`);
  for (const scen of Object.keys(newParams.h_by_scenario)) {
    console.log(`  ${scen}: ${(oldParams.h_by_scenario[scen]*100).toFixed(1)}% → ${(newParams.h_by_scenario[scen]*100).toFixed(1)}%`);
  }
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
