// Recalibração S1↔S2: VaR supply realized vs VaR baseline R$ 5.18B
// 7 supply disruption events sintéticos calibrados 2015-2025
// Output: _model_s1s2_recalibrated.json com VaR realized + weight FX:supply

const fs = require('fs');
const path = require('path');

// === VaR baseline (D2) ===
const VAR_FX_OLD = 2080; // R$ M, 6m
const VAR_SUPPLY_OLD = 5180; // R$ M, 6m
const VAR_FX_NEW = 2345; // R$ M, 6m (já recalibrado em S1↔S3)
const WEIGHT_OLD = VAR_FX_OLD / VAR_SUPPLY_OLD; // 1:2.49

// === Supply events calibrados (2015-2025) ===
// Cada evento: start_year, duration_months, magnitude (% disruption), lítio_price_impact
const SUPPLY_EVENTS = [
  { name: 'Pre-2015 baseline', start: 2015, duration_months: 12, magnitude: 0.0, lit_price_impact: 0.0, is_crisis: false },
  { name: 'Lítio spike 2015-16 (China EV boom)', start: 2015.5, duration_months: 18, magnitude: 0.15, lit_price_impact: 0.50, is_crisis: false },
  { name: 'Fukushima recovery supply chain', start: 2016, duration_months: 6, magnitude: 0.10, lit_price_impact: 0.0, is_crisis: false },
  { name: 'Lítio spike 2018 (cobalt crisis)', start: 2018, duration_months: 12, magnitude: 0.20, lit_price_impact: 1.00, is_crisis: false },
  { name: 'COVID-19 2020', start: 2020, duration_months: 9, magnitude: 0.30, lit_price_impact: 0.40, is_crisis: true },
  { name: 'Semiconductor crisis 2021-22', start: 2021, duration_months: 18, magnitude: 0.25, lit_price_impact: 2.00, is_crisis: true },
  { name: 'Lítio normalization 2023', start: 2023, duration_months: 12, magnitude: 0.05, lit_price_impact: -0.40, is_crisis: false },
  { name: 'Post-2023 normal', start: 2024, duration_months: 24, magnitude: 0.0, lit_price_impact: -0.20, is_crisis: false },
];

// === Compute realized VaR supply for each event ===
function computeSupplyVar(event) {
  // VaR supply = magnitude × exposure × duration_factor
  // exposure baseline: R$ 30B VGV 6m × supply_chain_share 0.30 = R$ 9B (worst case)
  // adjusted: only relevant fraction of supply chain is BYD's
  const BYD_SUPPLY_SHARE = 0.42; // 42% of BOM is supply-chain (CATL batteries, lithium, etc.)
  const EXPOSURE_SUPPLY_6M = 0.42 * 0.30 * 30000; // = R$ 3.78B (smaller than total supply VaR R$ 5.18B)

  // VaR realized = magnitude × exposure × duration_factor
  // duration_factor scales 6m VaR: 1.0 for 6m events, 2.0 for 12m events
  const duration_factor = event.duration_months / 6;
  const var_realized = event.magnitude * EXPOSURE_SUPPLY_6M * duration_factor;

  return {
    var_realized: var_realized,
    var_pct_of_old: (var_realized / VAR_SUPPLY_OLD) * 100,
  };
}

// === Process events ===
const processedEvents = SUPPLY_EVENTS.map(e => ({
  ...e,
  ...computeSupplyVar(e),
}));

// === VaR supply empirical (P95 worst event in 6m window) ===
// Para 6m VaR, é o P95 do VaR realized entre todos os eventos (rolling 6m window)
const allVars = processedEvents.map(e => e.var_realized);
allVars.sort((a, b) => a - b);
const p50_var = allVars[Math.floor(allVars.length * 0.5)];
const p75_var = allVars[Math.floor(allVars.length * 0.75)];
const p95_var = allVars[Math.floor(allVars.length * 0.95)];
const max_var = Math.max(...allVars);
const mean_var = allVars.reduce((a, b) => a + b, 0) / allVars.length;

// === Crisis VaR (max 6m rolling) ===
const crisisEvents = processedEvents.filter(e => e.is_crisis);
const crisis_var = crisisEvents.reduce((sum, e) => sum + e.var_realized, 0) / crisisEvents.length;
const crisis_var_max = Math.max(...crisisEvents.map(e => e.var_realized));

// === Recommended VaR supply recalibration ===
// Heurística: P95 var entre todos os eventos (rolling 6m)
const VAR_SUPPLY_NEW = p95_var; // 95th percentile of realized VaR
const WEIGHT_NEW = VAR_FX_NEW / VAR_SUPPLY_NEW;

// === Sensitivity: stress-conditional VaR (4 regimes) ===
const regimes = {
  calm: { count: 0, var: 0 },         // non-crisis, low magnitude
  normal: { count: 0, var: 0 },       // non-crisis, moderate magnitude
  stress: { count: 0, var: 0 },      // crisis, moderate magnitude
  crisis: { count: 0, var: 0 },      // crisis, high magnitude
};
for (const e of processedEvents) {
  let regime;
  if (e.magnitude < 0.05) regime = 'calm';
  else if (e.magnitude < 0.15) regime = 'normal';
  else if (e.magnitude < 0.25) regime = 'stress';
  else regime = 'crisis';
  regimes[regime].count++;
  regimes[regime].var += e.var_realized;
}
for (const r of Object.keys(regimes)) {
  if (regimes[r].count > 0) regimes[r].var /= regimes[r].count;
}

// === Output ===
const out = {
  baseline_model: {
    var_fx_6m_R$_M: VAR_FX_OLD,
    var_supply_6m_R$_M: VAR_SUPPLY_OLD,
    weight_fx_supply: `1:${(VAR_SUPPLY_OLD / VAR_FX_OLD).toFixed(2)}`,
  },
  recalibrated: {
    var_fx_6m_R$_M: VAR_FX_NEW, // já atualizado de S1↔S3
    var_supply_6m_R$_M: Math.round(VAR_SUPPLY_NEW),
    weight_fx_supply: `1:${(VAR_SUPPLY_NEW / VAR_FX_NEW).toFixed(2)}`,
  },
  events: processedEvents,
  empirical_summary: {
    mean_var_R$_M: Math.round(mean_var),
    p50_var_R$_M: Math.round(p50_var),
    p75_var_R$_M: Math.round(p75_var),
    p95_var_R$_M: Math.round(p95_var),
    max_var_R$_M: Math.round(max_var),
    crisis_var_avg_R$_M: Math.round(crisis_var),
    crisis_var_max_R$_M: Math.round(crisis_var_max),
  },
  stress_conditional_var: {
    calm_R$_M: Math.round(regimes.calm.var),
    normal_R$_M: Math.round(regimes.normal.var),
    stress_R$_M: Math.round(regimes.stress.var),
    crisis_R$_M: Math.round(regimes.crisis.var),
    n_events: { calm: regimes.calm.count, normal: regimes.normal.count, stress: regimes.stress.count, crisis: regimes.crisis.count },
  },
  changes: {
    var_supply_change_R$_M: Math.round(VAR_SUPPLY_NEW - VAR_SUPPLY_OLD),
    var_supply_change_pct: ((VAR_SUPPLY_NEW / VAR_SUPPLY_OLD - 1) * 100).toFixed(1),
    weight_change: WEIGHT_OLD === WEIGHT_NEW ? 'unchanged' : 'changed',
    weight_old_decimal: WEIGHT_OLD,
    weight_new_decimal: WEIGHT_NEW,
  },
};

const outPath = path.join(__dirname, '_model_s1s2_recalibrated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`S1↔S2 recalibration model written to ${outPath}`);

console.log(`\n=== Baseline vs Recalibrated ===`);
console.log(`  VaR FX 6m:           R$ ${VAR_FX_OLD}M → R$ ${VAR_FX_NEW}M (+${((VAR_FX_NEW/VAR_FX_OLD-1)*100).toFixed(1)}%)`);
console.log(`  VaR Supply 6m:       R$ ${VAR_SUPPLY_OLD}M → R$ ${Math.round(VAR_SUPPLY_NEW)}M (${out.changes.var_supply_change_pct}%)`);
console.log(`  Weight FX:supply:    1:${(VAR_SUPPLY_OLD/VAR_FX_OLD).toFixed(2)} → 1:${(VAR_SUPPLY_NEW/VAR_FX_NEW).toFixed(2)}`);

console.log(`\n=== Empirical VaR distribution ===`);
console.log(`  Mean:               R$ ${Math.round(mean_var)}M`);
console.log(`  P50:                R$ ${Math.round(p50_var)}M`);
console.log(`  P75:                R$ ${Math.round(p75_var)}M`);
console.log(`  P95 (recommended):  R$ ${Math.round(p95_var)}M`);
console.log(`  Max:                R$ ${Math.round(max_var)}M`);
console.log(`  Crisis avg:         R$ ${Math.round(crisis_var)}M`);
console.log(`  Crisis max:         R$ ${Math.round(crisis_var_max)}M`);

console.log(`\n=== Stress-conditional VaR ===`);
for (const r of ['calm', 'normal', 'stress', 'crisis']) {
  console.log(`  ${r.padEnd(8)} (n=${regimes[r].count}): R$ ${Math.round(regimes[r].var)}M`);
}
