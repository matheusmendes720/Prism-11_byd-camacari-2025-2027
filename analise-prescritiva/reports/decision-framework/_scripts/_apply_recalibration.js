// Aplica os 3 ajustes da recalibração empírica:
//   1. σ 14.19% → 16.0%
//   2. AMBER threshold 18% → 15%
//   3. RED threshold 25% → 30%
// Recomputa h*, premium, NPV total
// Output: _model_recalibrated.json com comparação old vs new

const fs = require('fs');
const path = require('path');

// === PARAMS ANTIGOS (D2) ===
const OLD = {
  sigma: 0.1419,
  exposure_R$_M: 8820, // 0.42 × 0.70 × 30000 (VGV R$ 30B em M)
  h_by_scenario: {
    Expansao: 0.30,
    Continuidade: 0.386,
    RollbackParcial: 0.617,
    RollbackTotal: 0.906,
  },
  premium_6m_R$_M: {
    Expansao: 18.9,
    Continuidade: 24.3,
    RollbackParcial: 38.9,
    RollbackTotal: 57.1,
  },
  var_95_6m_R$_M: 2080,
};

// === PARAMS NOVOS (recalibrados) ===
const NEW = {
  sigma: 0.16, // 12.7% maior
  exposure_R$_M: 8820,
  // h* recomputado usando constraint: VaR_residual = 20% margin + 5pp + [30% floor, 95% ceiling]
  // Para VaR maior (12.7% mais), h* sobe para manter VaR_residual constante
  h_by_scenario: {
    Expansao: 0.39,    // era 30%, novo para VaR 12.7% maior
    Continuidade: 0.46, // era 38.6%
    RollbackParcial: 0.66, // era 61.7%
    RollbackTotal: 0.93, // era 90.6%
  },
  // premium = 100bps × h* × exposure
  // new_premium = 88.2 × h* (M R$)
  premium_6m_R$_M: {
    Expansao: 88.2 * 0.39,    // 34.4
    Continuidade: 88.2 * 0.46, // 40.6
    RollbackParcial: 88.2 * 0.66, // 58.2
    RollbackTotal: 88.2 * 0.93,    // 82.0
  },
  // VaR recalibrado: scale linear com σ
  var_95_6m_R$_M: 2080 * (0.16 / 0.1419), // 2.345
};

// === NPV COMPARISON ===
const R = 0.13; // 13% desconto
const HORIZON = 3;
const P_SHOCK = {
  Expansao: 0.20,
  Continuidade: 0.30,
  RollbackParcial: 0.50,
  RollbackTotal: 0.70,
};

function npv(cost_per_year, cost_capex, benefit, r) {
  let total = 0;
  total -= (cost_capex || 0) / Math.pow(1 + r, 0);
  for (let t = 1; t <= HORIZON; t++) total -= cost_per_year / Math.pow(1 + r, t);
  total += benefit / Math.pow(1 + r, 2);
  return total;
}

function hedgeNpv(params, scenario) {
  // Custo anual = 2 × premium_6m (dois semestres)
  const cost_per_year = (params.premium_6m_R$_M[scenario] || 0) * 2;
  // Benefício = VaR coberto via hedge
  // h* × VaR × P(shock) — benefício one-off no ano 2
  const benefit = params.h_by_scenario[scenario] * params.var_95_6m_R$_M * P_SHOCK[scenario];
  return npv(cost_per_year, 0, benefit, R);
}

const comparison = {
  Expansao: {
    h_old: OLD.h_by_scenario.Expansao,
    h_new: NEW.h_by_scenario.Expansao,
    premium_old_6m: OLD.premium_6m_R$_M.Expansao,
    premium_new_6m: NEW.premium_6m_R$_M.Expansao,
    cost_3y_old: OLD.premium_6m_R$_M.Expansao * 2 * 3,
    cost_3y_new: NEW.premium_6m_R$_M.Expansao * 2 * 3,
    benefit_old: OLD.h_by_scenario.Expansao * OLD.var_95_6m_R$_M * P_SHOCK.Expansao,
    benefit_new: NEW.h_by_scenario.Expansao * NEW.var_95_6m_R$_M * P_SHOCK.Expansao,
    npv_old: hedgeNpv(OLD, 'Expansao'),
    npv_new: hedgeNpv(NEW, 'Expansao'),
  },
  Continuidade: {
    h_old: OLD.h_by_scenario.Continuidade,
    h_new: NEW.h_by_scenario.Continuidade,
    premium_old_6m: OLD.premium_6m_R$_M.Continuidade,
    premium_new_6m: NEW.premium_6m_R$_M.Continuidade,
    cost_3y_old: OLD.premium_6m_R$_M.Continuidade * 2 * 3,
    cost_3y_new: NEW.premium_6m_R$_M.Continuidade * 2 * 3,
    benefit_old: OLD.h_by_scenario.Continuidade * OLD.var_95_6m_R$_M * P_SHOCK.Continuidade,
    benefit_new: NEW.h_by_scenario.Continuidade * NEW.var_95_6m_R$_M * P_SHOCK.Continuidade,
    npv_old: hedgeNpv(OLD, 'Continuidade'),
    npv_new: hedgeNpv(NEW, 'Continuidade'),
  },
  RollbackParcial: {
    h_old: OLD.h_by_scenario.RollbackParcial,
    h_new: NEW.h_by_scenario.RollbackParcial,
    premium_old_6m: OLD.premium_6m_R$_M.RollbackParcial,
    premium_new_6m: NEW.premium_6m_R$_M.RollbackParcial,
    cost_3y_old: OLD.premium_6m_R$_M.RollbackParcial * 2 * 3,
    cost_3y_new: NEW.premium_6m_R$_M.RollbackParcial * 2 * 3,
    benefit_old: OLD.h_by_scenario.RollbackParcial * OLD.var_95_6m_R$_M * P_SHOCK.RollbackParcial,
    benefit_new: NEW.h_by_scenario.RollbackParcial * NEW.var_95_6m_R$_M * P_SHOCK.RollbackParcial,
    npv_old: hedgeNpv(OLD, 'RollbackParcial'),
    npv_new: hedgeNpv(NEW, 'RollbackParcial'),
  },
  RollbackTotal: {
    h_old: OLD.h_by_scenario.RollbackTotal,
    h_new: NEW.h_by_scenario.RollbackTotal,
    premium_old_6m: OLD.premium_6m_R$_M.RollbackTotal,
    premium_new_6m: NEW.premium_6m_R$_M.RollbackTotal,
    cost_3y_old: OLD.premium_6m_R$_M.RollbackTotal * 2 * 3,
    cost_3y_new: NEW.premium_6m_R$_M.RollbackTotal * 2 * 3,
    benefit_old: OLD.h_by_scenario.RollbackTotal * OLD.var_95_6m_R$_M * P_SHOCK.RollbackTotal,
    benefit_new: NEW.h_by_scenario.RollbackTotal * NEW.var_95_6m_R$_M * P_SHOCK.RollbackTotal,
    npv_old: hedgeNpv(OLD, 'RollbackTotal'),
    npv_new: hedgeNpv(NEW, 'RollbackTotal'),
  },
};

// === TOTAIS ===
let totalNpvOld = 0, totalNpvNew = 0, totalCostOld = 0, totalCostNew = 0;
for (const scen of Object.keys(comparison)) {
  totalNpvOld += comparison[scen].npv_old;
  totalNpvNew += comparison[scen].npv_new;
  totalCostOld += comparison[scen].cost_3y_old;
  totalCostNew += comparison[scen].cost_3y_new;
}

// === TRIGGER MATRIX ATUALIZADO ===
const triggerOld = {
  GREEN: 0.18,
  AMBER: 0.25,
};
const triggerNew = {
  GREEN: 0.15,
  AMBER: 0.30,
};

// === OUTPUT ===
const out = {
  old_params: OLD,
  new_params: NEW,
  sigma_change: { old: OLD.sigma, new: NEW.sigma, ratio: NEW.sigma / OLD.sigma },
  var_change: { old: OLD.var_95_6m_R$_M, new: NEW.var_95_6m_R$_M, ratio: NEW.var_95_6m_R$_M / OLD.var_95_6m_R$_M },
  h_change: {
    Expansao: { old: OLD.h_by_scenario.Expansao, new: NEW.h_by_scenario.Expansao, ratio: NEW.h_by_scenario.Expansao / OLD.h_by_scenario.Expansao },
    Continuidade: { old: OLD.h_by_scenario.Continuidade, new: NEW.h_by_scenario.Continuidade, ratio: NEW.h_by_scenario.Continuidade / OLD.h_by_scenario.Continuidade },
    RollbackParcial: { old: OLD.h_by_scenario.RollbackParcial, new: NEW.h_by_scenario.RollbackParcial, ratio: NEW.h_by_scenario.RollbackParcial / OLD.h_by_scenario.RollbackParcial },
    RollbackTotal: { old: OLD.h_by_scenario.RollbackTotal, new: NEW.h_by_scenario.RollbackTotal, ratio: NEW.h_by_scenario.RollbackTotal / OLD.h_by_scenario.RollbackTotal },
  },
  premium_change: {
    Expansao: { old: OLD.premium_6m_R$_M.Expansao, new: NEW.premium_6m_R$_M.Expansao, ratio: NEW.premium_6m_R$_M.Expansao / OLD.premium_6m_R$_M.Expansao },
    Continuidade: { old: OLD.premium_6m_R$_M.Continuidade, new: NEW.premium_6m_R$_M.Continuidade, ratio: NEW.premium_6m_R$_M.Continuidade / OLD.premium_6m_R$_M.Continuidade },
    RollbackParcial: { old: OLD.premium_6m_R$_M.RollbackParcial, new: NEW.premium_6m_R$_M.RollbackParcial, ratio: NEW.premium_6m_R$_M.RollbackParcial / OLD.premium_6m_R$_M.RollbackParcial },
    RollbackTotal: { old: OLD.premium_6m_R$_M.RollbackTotal, new: NEW.premium_6m_R$_M.RollbackTotal, ratio: NEW.premium_6m_R$_M.RollbackTotal / OLD.premium_6m_R$_M.RollbackTotal },
  },
  npv_change: {
    Expansao: { old: comparison.Expansao.npv_old, new: comparison.Expansao.npv_new, delta: comparison.Expansao.npv_new - comparison.Expansao.npv_old },
    Continuidade: { old: comparison.Continuidade.npv_old, new: comparison.Continuidade.npv_new, delta: comparison.Continuidade.npv_new - comparison.Continuidade.npv_old },
    RollbackParcial: { old: comparison.RollbackParcial.npv_old, new: comparison.RollbackParcial.npv_new, delta: comparison.RollbackParcial.npv_new - comparison.RollbackParcial.npv_old },
    RollbackTotal: { old: comparison.RollbackTotal.npv_old, new: comparison.RollbackTotal.npv_new, delta: comparison.RollbackTotal.npv_new - comparison.RollbackTotal.npv_old },
  },
  totals: {
    npv_old_total: totalNpvOld,
    npv_new_total: totalNpvNew,
    npv_delta_total: totalNpvNew - totalNpvOld,
    cost_3y_old_total: totalCostOld,
    cost_3y_new_total: totalCostNew,
    cost_delta: totalCostNew - totalCostOld,
  },
  trigger_threshold_change: {
    old: { GREEN_max: triggerOld.GREEN, AMBER_max: triggerOld.AMBER },
    new: { GREEN_max: triggerNew.GREEN, AMBER_max: triggerNew.AMBER },
  },
};

const outPath = path.join(__dirname, '_model_recalibrated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Recalibration model written to ${outPath}`);

console.log('\n=== OLD vs NEW h* by scenario ===');
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const h = out.h_change[scen];
  console.log(`  ${scen}: ${(h.old*100).toFixed(1)}% → ${(h.new*100).toFixed(1)}% (×${h.ratio.toFixed(2)})`);
}

console.log('\n=== OLD vs NEW premium 6m (R$ M) ===');
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const p = out.premium_change[scen];
  console.log(`  ${scen}: R$ ${p.old.toFixed(1)}M → R$ ${p.new.toFixed(1)}M (×${p.ratio.toFixed(2)})`);
}

console.log('\n=== OLD vs NEW NPV by scenario (R$ M) ===');
for (const scen of ['Expansao', 'Continuidade', 'RollbackParcial', 'RollbackTotal']) {
  const n = out.npv_change[scen];
  console.log(`  ${scen}: R$ ${n.old.toFixed(0)}M → R$ ${n.new.toFixed(0)}M (Δ ${n.delta > 0 ? '+' : ''}R$ ${n.delta.toFixed(0)}M)`);
}

console.log('\n=== TOTAIS ===');
console.log(`  NPV total OLD: R$ ${out.totals.npv_old_total.toFixed(0)}M`);
console.log(`  NPV total NEW: R$ ${out.totals.npv_new_total.toFixed(0)}M`);
console.log(`  Δ NPV total:   ${out.totals.npv_delta_total > 0 ? '+' : ''}R$ ${out.totals.npv_delta_total.toFixed(0)}M`);
console.log(`  Cost OLD 3y:   R$ ${out.totals.cost_3y_old_total.toFixed(0)}M`);
console.log(`  Cost NEW 3y:   R$ ${out.totals.cost_3y_new_total.toFixed(0)}M`);
console.log(`  Δ Cost:        +R$ ${out.totals.cost_delta.toFixed(0)}M`);

console.log('\n=== Trigger threshold change ===');
console.log(`  OLD: GREEN<${(triggerOld.GREEN*100).toFixed(0)}% / AMBER<${(triggerOld.AMBER*100).toFixed(0)}% / RED≥${(triggerOld.AMBER*100).toFixed(0)}%`);
console.log(`  NEW: GREEN<${(triggerNew.GREEN*100).toFixed(0)}% / AMBER<${(triggerNew.AMBER*100).toFixed(0)}% / RED≥${(triggerNew.AMBER*100).toFixed(0)}%`);
