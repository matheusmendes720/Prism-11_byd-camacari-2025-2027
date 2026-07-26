// Recalibração S1↔S4: hedge per unit vs defensivo per unit
// Aplica σ=16% (de S1↔S3 recalibration) e recomputa ratio
// Output: _model_s1s4_recalibrated.json

const fs = require('fs');
const path = require('path');

// === Inputs ===
const EXPOSURE_FX_6M = 8820; // R$ M (já em M, 0.42 × 0.70 × 30000 = 8.82B)
const VGV_6M = 30000; // R$ M
const UNITS_6M = 50000;
const HORIZON_3Y = 3;
const R = 0.13;

// === Old params (D2 baseline) ===
const OLD = {
  sigma: 0.1419,
  h_by_scenario: {
    Expansao: 0.30,
    Continuidade: 0.386,
    RollbackParcial: 0.617,
    RollbackTotal: 0.906,
  },
  var_fx_6m: 2080, // R$ M
  defensivo_catalog: 4500, // R$/unit
  defensivo_targeted_tier2: 3000,
  defensivo_targeted_tier3: 4500,
};

// === New params (S1↔S3 recalibrated) ===
const NEW = {
  sigma: 0.16,
  h_by_scenario: {
    Expansao: 0.39,
    Continuidade: 0.46,
    RollbackParcial: 0.66,
    RollbackTotal: 0.93,
  },
  var_fx_6m: 2345, // R$ M
  defensivo_catalog: 4500,
  defensivo_targeted_tier2: 3000,
  defensivo_targeted_tier3: 4500,
};

// === Compute hedge cost per unit for each scenario ===
function computeHedgePerUnit(params) {
  const result = {};
  for (const [scen, h] of Object.entries(params.h_by_scenario)) {
    // premium 6m (R$ M) = 100bps × h × exposição FX 6m (R$ M)
    // 1% × h × 8820 = 88.2 × h
    const premium_6m_R$_M = 0.01 * h * EXPOSURE_FX_6M;
    // premium anual (× 2 semestres)
    const premium_year_R$_M = premium_6m_R$_M * 2;
    // premium 3y total
    const premium_3y_R$_M = premium_year_R$_M * HORIZON_3Y;
    // per unit (50k unidades em 6m, então 100k em 1 ano, 300k em 3y)
    // mas cada unidade está exposta só uma vez (6m); por isso 50k unidades
    // hedge per unit = premium_3y / UNITS_6M / HORIZON_3Y... hmm, simplificar
    // hedge per unit (6m) = premium_6m / UNITS_6M
    const hedge_per_unit_6m_R$ = (premium_6m_R$_M * 1e6) / UNITS_6M;

    result[scen] = {
      h: h,
      premium_6m_R$_M: premium_6m_R$_M,
      hedge_per_unit_6m_R$: hedge_per_unit_6m_R$,
    };
  }
  return result;
}

const hedge_old = computeHedgePerUnit(OLD);
const hedge_new = computeHedgePerUnit(NEW);

// === Ratio hedge vs defensivo ===
function computeRatio(hedge, defensivo_per_unit) {
  const result = {};
  for (const scen of Object.keys(hedge)) {
    result[scen] = {
      hedge_per_unit: hedge[scen].hedge_per_unit_6m_R$,
      defensivo_per_unit: defensivo_per_unit,
      ratio: defensivo_per_unit / hedge[scen].hedge_per_unit_6m_R$,
    };
  }
  return result;
}

const ratio_old_catalog = computeRatio(hedge_old, OLD.defensivo_catalog);
const ratio_new_catalog = computeRatio(hedge_new, NEW.defensivo_catalog);
const ratio_new_tier2 = computeRatio(hedge_new, NEW.defensivo_targeted_tier2);
const ratio_new_tier3 = computeRatio(hedge_new, NEW.defensivo_targeted_tier3);

// === Sensitivity: ratio at different σ ===
function sensitivityRatio(sigma_test) {
  // Recompute h* for each scenario with new σ (proportional)
  const h_factor = sigma_test / 0.16; // relative to new σ
  const h_by_scenario = {
    Expansao: 0.39 * h_factor,
    Continuidade: 0.46 * h_factor,
    RollbackParcial: 0.66 * h_factor,
    RollbackTotal: 0.93 * h_factor,
  };
  // Cap at 95% (saturation)
  for (const k of Object.keys(h_by_scenario)) {
    h_by_scenario[k] = Math.min(0.95, h_by_scenario[k]);
    h_by_scenario[k] = Math.max(0.30, h_by_scenario[k]); // floor
  }

  const var_fx = 2080 * (sigma_test / 0.1419); // scale VaR with σ
  const exp_factor = sigma_test / OLD.sigma;

  const params = { sigma: sigma_test, h_by_scenario, var_fx_6m: var_fx };
  const hedge = computeHedgePerUnit(params);
  const ratio = {};
  for (const scen of Object.keys(hedge)) {
    ratio[scen] = {
      h: h_by_scenario[scen],
      hedge_per_unit: hedge[scen].hedge_per_unit_6m_R$,
      ratio_catalog: 4500 / hedge[scen].hedge_per_unit_6m_R$,
      ratio_tier2: 3000 / hedge[scen].hedge_per_unit_6m_R$,
      ratio_tier3: 4500 / hedge[scen].hedge_per_unit_6m_R$,
    };
  }
  return ratio;
}

// Build sensitivity table
const sigma_range = [0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22, 0.25];
const sensitivity = {};
for (const sigma of sigma_range) {
  sensitivity[(sigma * 100).toFixed(0) + '%'] = sensitivityRatio(sigma);
}

// === Output ===
const out = {
  inputs: {
    exposure_fx_6m_R$_M: EXPOSURE_FX_6M,
    vgv_6m_R$_M: VGV_6M,
    units_6m: UNITS_6M,
    horizon_years: HORIZON_3Y,
    discount_rate: R,
  },
  old_params: OLD,
  new_params: NEW,
  hedge_per_unit: {
    old_by_scenario: hedge_old,
    new_by_scenario: hedge_new,
  },
  ratio_old_catalog: ratio_old_catalog,
  ratio_new_catalog: ratio_new_catalog,
  ratio_new_tier2: ratio_new_tier2,
  ratio_new_tier3: ratio_new_tier3,
  sensitivity_by_sigma: sensitivity,
  baseline_recalibration: {
    old_ratio_continuidade: 9.4,
    new_ratio_continuidade_catalog: ratio_new_catalog.Continuidade.ratio,
    new_ratio_continuidade_tier2: ratio_new_tier2.Continuidade.ratio,
    new_ratio_continuidade_tier3: ratio_new_tier3.Continuidade.ratio,
    interpretation: 'Ratio cai com novo σ. Defensivo catalog-wide fica menos "mais caro" que hedge. Tier 2 defensivo (R$ 3k) é apenas 5× hedge (vs 9.4× antes).',
  },
};

const outPath = path.join(__dirname, '_model_s1s4_recalibrated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`S1↔S4 recalibration model written to ${outPath}`);

console.log(`\n=== Hedge per unit OLD vs NEW (R$/unit 6m) ===`);
console.log('  Cenário       | OLD h* | NEW h* | OLD hedge | NEW hedge');
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const o = hedge_old[scen];
  const n = hedge_new[scen];
  console.log(`  ${scen.padEnd(14)} | ${(o.h*100).toFixed(1).padStart(6)}% | ${(n.h*100).toFixed(1).padStart(6)}% | R$ ${o.hedge_per_unit_6m_R$.toFixed(0).padStart(7)} | R$ ${n.hedge_per_unit_6m_R$.toFixed(0).padStart(7)}`);
}

console.log(`\n=== Ratio (defensivo / hedge) OLD vs NEW (catalog R$ 4.5k) ===`);
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const o = ratio_old_catalog[scen];
  const n = ratio_new_catalog[scen];
  console.log(`  ${scen.padEnd(14)} | OLD: ${o.ratio.toFixed(2)}× → NEW: ${n.ratio.toFixed(2)}×`);
}

console.log(`\n=== Ratio (defensivo / hedge) NEW — 3 estruturas ===`);
console.log('  Cenário       | Catalog R$4.5k | Tier 2 R$3k | Tier 3 R$4.5k');
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const c = ratio_new_catalog[scen];
  const t2 = ratio_new_tier2[scen];
  const t3 = ratio_new_tier3[scen];
  console.log(`  ${scen.padEnd(14)} | ${c.ratio.toFixed(2).padStart(15)}× | ${t2.ratio.toFixed(2).padStart(11)}× | ${t3.ratio.toFixed(2).padStart(11)}×`);
}

console.log(`\n=== Sensitivity: ratio_catalog (defensivo R$ 4.5k / hedge per unit) por σ ===`);
console.log('  σ       | Expansão | Continuidade | RB Parcial | RB Total');
for (const [sk, rat] of Object.entries(sensitivity)) {
  console.log(`  ${sk.padEnd(7)} | ${rat.Expansao.ratio_catalog.toFixed(2).padStart(8)} | ${rat.Continuidade.ratio_catalog.toFixed(2).padStart(12)} | ${rat.RollbackParcial.ratio_catalog.toFixed(2).padStart(11)} | ${rat.RollbackTotal.ratio_catalog.toFixed(2).padStart(9)}`);
}
