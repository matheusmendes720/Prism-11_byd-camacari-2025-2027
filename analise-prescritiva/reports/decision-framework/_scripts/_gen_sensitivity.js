// Sensitivity model: 10 decision questions x 4 scenarios
// Para cada pergunta: re-roda NPV com parametros shiftados
// Output: _model_sensitivity.json com deltas + tipping points

const fs = require('fs');
const path = require('path');

const R = 0.13;
const HORIZON = 3;

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

const SCENARIO_WORSEN = { Expansao: 'Continuidade', Continuidade: 'RollbackParcial', RollbackParcial: 'RollbackTotal', RollbackTotal: 'RollbackTotal' };

function npv(cost_per_year, cost_capex, benefit, r) {
  let total = 0;
  total -= (cost_capex || 0) / Math.pow(1 + r, 0);
  for (let t = 1; t <= HORIZON; t++) total -= cost_per_year / Math.pow(1 + r, t);
  total += benefit / Math.pow(1 + r, 2);
  return total;
}

function totalNpv(scenario, params) {
  const r = params.r || R;
  const varFx = params.varFx || VAR_FX_BASE;
  const varSupply = params.varSupply || VAR_SUPPLY_BASE;
  const marginMult = params.margin_mult || 1.0;
  const p = SCENARIOS[scenario].p_shock;

  const hedgeBenefit = 0.30 * varFx * p;
  const dualBenefit = varSupply * p;
  const advocacyBenefit = 75 * p;
  const demandAdj = params.demand || 1.0;
  const defMargin = (scenario === 'Expansao' ? 90000 : scenario === 'Continuidade' ? 69000 : scenario === 'RollbackParcial' ? 45000 : 15000);
  const defensivoBenefit = 5000 * demandAdj * marginMult * defMargin / 1e6 * p;
  const partnershipBenefit = 150 * p;
  const frameworkBase = (params.bridgeAvailable === false) ? 350 : 700;
  const frameworkBenefit = frameworkBase * (scenario === 'Expansao' ? 0.5 : scenario === 'Continuidade' ? 0.8 : scenario === 'RollbackParcial' ? 0.8 : 0.9);

  return (
    npv(HEDGE.cost_per_year[scenario], 0, hedgeBenefit, r) +
    npv(DUAL.cost_per_year[scenario], DUAL.cost_capex[scenario], dualBenefit, r) +
    npv(ADVOCACY.cost_per_year[scenario], 0, advocacyBenefit, r) +
    npv(DEFENSIVO.cost_per_year[scenario], 0, defensivoBenefit, r) +
    npv(PARTNERSHIPS.cost_per_year[scenario], PARTNERSHIPS.cost_capex[scenario], partnershipBenefit, r) +
    npv(FRAMEWORK.cost_per_year[scenario], 0, frameworkBenefit, r)
  );
}

const questions = [
  { id: 1, name: 'PTAX +20%', description: 'BRL desvaloriza 20% (5.20 -> 6.24). Stress cambial.', apply: () => ({ varFx: VAR_FX_BASE * 1.20 }) },
  { id: 2, name: 'PTAX -10%', description: 'BRL valoriza 10% (5.20 -> 4.68). Alivio cambial.', apply: () => ({ varFx: VAR_FX_BASE * 0.90 }) },
  { id: 3, name: 'BNDES funding -10pp', description: 'ViE cai 10pp em todos os cenarios (categoria pior).', apply: () => ({}), shiftScenario: true },
  { id: 4, name: 'Litio +50%', description: 'Preco do litio sobe 50% (US$15k -> US$22.5k/t). Comprime margens BOM.', apply: () => ({ margin_mult: 0.85 }) },
  { id: 5, name: 'Litio -30%', description: 'Preco do litio cai 30% (US$15k -> US$10.5k/t). Alivio de supply.', apply: () => ({ varSupply: VAR_SUPPLY_BASE * 0.70 }) },
  { id: 6, name: 'Demand EV Brasil -15%', description: 'Vendas EV caem 15% vs baseline. Volume de BYD tambem cai.', apply: () => ({ demand: 0.85 }) },
  { id: 7, name: 'IPCA +3pp', description: 'IPCA sobe 4.5% -> 7.5%. Taxa de desconto nominal sobe para ~16%.', apply: () => ({ r: 0.16 }) },
  { id: 8, name: 'Tesla Model 2 antecipado 6m', description: 'Tesla Model 2 entra Q3 2026 em vez de Q1 2027. Defensivo ativado antes.', apply: () => ({ demand: 0.92 }) },
  { id: 9, name: 'FX shock conjunto', description: 'PTAX +15% + litio +30% simultaneo. Compound stress.', apply: () => ({ varFx: VAR_FX_BASE * 1.15, varSupply: VAR_SUPPLY_BASE * 1.20 }) },
  { id: 10, name: 'Aprovacao R$ 800M atrasada', description: 'Board global atrasa aprovacao do bridge financing 6m. Plano B indisponivel.', apply: () => ({ bridgeAvailable: false }) },
];

const baseline = {};
for (const scen of Object.keys(SCENARIOS)) baseline[scen] = totalNpv(scen, { bridgeAvailable: true });

const results = questions.map((q) => {
  const perturbed = {};
  for (const scen of Object.keys(SCENARIOS)) {
    let computeScen = scen;
    const extraParams = q.apply ? q.apply() : {};
    if (q.shiftScenario) computeScen = SCENARIO_WORSEN[scen];
    perturbed[scen] = totalNpv(computeScen, extraParams);
  }
  return {
    id: q.id,
    name: q.name,
    description: q.description,
    baseline,
    perturbed,
    delta_by_scenario: Object.fromEntries(Object.keys(SCENARIOS).map((s) => [s, perturbed[s] - baseline[s]])),
    total_delta: Object.values(perturbed).reduce((a, b) => a + b, 0) - Object.values(baseline).reduce((a, b) => a + b, 0),
  };
});

const tornado = [...results].sort((a, b) => Math.abs(b.total_delta) - Math.abs(a.total_delta));
const out = {
  baseline_by_scenario: baseline,
  baseline_total: Object.values(baseline).reduce((a, b) => a + b, 0),
  questions: results,
  tornado_ranking: tornado.map((q, i) => ({ rank: i + 1, name: q.name, total_delta: q.total_delta })),
};

const outPath = path.join(__dirname, '_model_sensitivity.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Sensitivity model written to ${outPath}`);
console.log('\n=== Baseline NPV (R$ M) ===');
for (const [scen, v] of Object.entries(baseline)) console.log(`  ${scen}: R$ ${v.toFixed(0)}M`);
console.log(`  TOTAL: R$ ${out.baseline_total.toFixed(0)}M`);
console.log('\n=== Tornado ranking ===');
for (const t of tornado) {
  const sign = t.total_delta > 0 ? '+' : '';
  console.log(`  #${t.tornado_ranking?.rank} ${t.name}: ${sign}R$ ${t.total_delta.toFixed(0)}M`);
}
