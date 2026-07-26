// NPV model para D3 v0.4 — 6 prescrições × 4 cenários × 3 anos
// Output: _model_npv.json com tabela NPV por prescrição/cenário
//
// Parâmetros globais:
//   r = 13% nominal (NTN-B 10y ~11% + spread 200bps soberano)
//   horizonte = 3 anos (2025-2027)
//   P(shock) = 30% em 3 anos (histórico FX + supply)
//
// Para cada prescrição:
//   cost_ano[cenario] = custo anual ajustado por cenário
//   benefit_oneoff[cenario] = VaR evitado (one-off, P-ponderado)
//   npv[cenario] = soma fluxos descontados

const fs = require('fs');
const path = require('path');

const R = 0.13; // 13% nominal discount rate (NTN-B 10y + 200bps)
const HORIZON = 3; // anos
const P_SHOCK = 0.30; // probabilidade de materialização do shock em 3 anos
const P_SHOCK_RED = 0.60; // probabilidade em RED (recesso = choques mais prováveis)

// Cenários S3
const SCENARIOS = {
  Expansao: { vie: 0.25, p_shock: 0.20, label: 'Expansão (ViE=25%)' },
  Continuidade: { vie: 0.18, p_shock: 0.30, label: 'Continuidade (ViE=18%)' },
  RollbackParcial: { vie: 0.10, p_shock: 0.50, label: 'Rollback Parcial (ViE=10%)' },
  RollbackTotal: { vie: 0.00, p_shock: 0.70, label: 'Rollback Total (ViE=0%)' },
};

// === PRESCRIÇÃO 1: HEDGE FX (S1) ===
// Custo anual = premium 100bps × exposição × h* (do S1↔S3)
// Expansão: h* = 30% × premium 6m = R$ 18.9M → 37.8M/ano
// Continuidade: h* = 38.6% × R$ 24.3M → 48.6M/ano
// RB Parcial: h* = 61.7% × R$ 38.9M → 77.8M/ano
// RB Total: h* = 90.6% × R$ 57.1M → 114.2M/ano
// Benefício: VaR FX 6m R$ 2.08B (cenário base) × h* × P(shock)
const hedge = {
  name: 'Hedge FX (S1)',
  cost_per_year: {
    Expansao: 37.8,
    Continuidade: 48.6,
    RollbackParcial: 77.8,
    RollbackTotal: 114.2,
  },
  benefit_oneoff: {
    // VaR = h* × VaR_total × P(shock cenário)
    Expansao: 0.30 * 2080 * 0.20,    // = 124.8M
    Continuidade: 0.386 * 2080 * 0.30, // = 240.7M
    RollbackParcial: 0.617 * 2080 * 0.50, // = 641.7M
    RollbackTotal: 0.906 * 2080 * 0.70, // = 1318.7M
  },
  benefit_note: 'VaR FX 6m = R$ 2.08B; benefício = h* × VaR × P(shock cenário)',
};

// === PRESCRIÇÃO 2: DUAL-SOURCING (S2) ===
// Custo: R$ 280M capex (ano 1) + R$ 80M/ano operacional
// Benefício: VaR supply 6m R$ 5.18B × P(shock cenário)
const dualSourcing = {
  name: 'Dual-sourcing (S2)',
  cost_per_year: {
    Expansao: 80,        // só opex (capex já feito)
    Continuidade: 80,
    RollbackParcial: 80,
    RollbackTotal: 80,
  },
  cost_capex: {
    Expansao: 280,       // ano 1
    Continuidade: 280,
    RollbackParcial: 280,
    RollbackTotal: 280,
  },
  benefit_oneoff: {
    Expansao: 5180 * 0.20,        // = 1036M
    Continuidade: 5180 * 0.30,    // = 1554M
    RollbackParcial: 5180 * 0.50, // = 2590M
    RollbackTotal: 5180 * 0.70,   // = 3626M
  },
  benefit_note: 'VaR supply 6m = R$ 5.18B; benefício = VaR × P(shock cenário)',
};

// === PRESCRIÇÃO 3: ADVOCACY BNDES (S3) ===
// Custo: R$ 12M/ano (advocacy baseline)
// Benefício: preservar ViE em +5pp = R$ 200M NPV incremental de margem
const advocacy = {
  name: 'Advocacy BNDES (S3)',
  cost_per_year: {
    Expansao: 12,
    Continuidade: 12,
    RollbackParcial: 12,
    RollbackTotal: 12,
  },
  benefit_oneoff: {
    // Benefício = preservar ViE em +5pp × VGV × margem × P(shock)
    // VGV 6m R$ 30B × 5% margem = R$ 1.5B; +5pp ViE = R$ 75M
    Expansao: 75 * 0.20,        // = 15M
    Continuidade: 75 * 0.30,    // = 22.5M
    RollbackParcial: 75 * 0.50, // = 37.5M
    RollbackTotal: 75 * 0.70,   // = 52.5M
  },
  benefit_note: 'Preservar ViE +5pp = R$ 75M margem incremental; × P(shock cenário)',
};

// === PRESCRIÇÃO 4: DEFENSIVO TARGETED (S4) ===
// Custo: R$ 22.5M/6m = R$ 45M/ano (Tier 3, 5k unidades)
// Benefício: 5k unidades × R$ 15k margin (cenário médio) = R$ 75M
// Variável por cenário: margem/unit depende do S3
const defensivo = {
  name: 'Defensivo targeted (S4)',
  cost_per_year: {
    Expansao: 45,    // Tier 3 base
    Continuidade: 45,
    RollbackParcial: 30, // Tier 2 (R$ 15M/6m = R$ 30M/ano)
    RollbackTotal: 15,  // Tier 1 (R$ 7.5M/6m = R$ 15M/ano)
  },
  benefit_oneoff: {
    // 5k unidades × margin_per_unit × P(shock cenário)
    // margin_per_unit: R$ 90k (Exp), R$ 69k (Cont), R$ 45k (RB Parcial), R$ 15k (RB Total)
    Expansao: 5000 * 90000 / 1e6 * 0.20,        // = 90M
    Continuidade: 5000 * 69000 / 1e6 * 0.30,    // = 103.5M
    RollbackParcial: 5000 * 45000 / 1e6 * 0.50, // = 112.5M
    RollbackTotal: 5000 * 15000 / 1e6 * 0.70,   // = 52.5M
  },
  benefit_note: '5k unidades × margin_per_unit(S3) × P(shock); tier system S3↔S4',
};

// === PRESCRIÇÃO 5: PARTNERSHIPS (S5) ===
// Custo: R$ 30M capex (avaliação + contratos) + R$ 5M/ano manutenção
// Benefício: resiliência = evitar disruption 6m = R$ 150M (proxy)
const partnerships = {
  name: 'Partnerships (S5)',
  cost_per_year: {
    Expansao: 5,
    Continuidade: 5,
    RollbackParcial: 5,
    RollbackTotal: 5,
  },
  cost_capex: {
    Expansao: 30,
    Continuidade: 30,
    RollbackParcial: 30,
    RollbackTotal: 30,
  },
  benefit_oneoff: {
    // Resiliência: evitar disruption 6m = R$ 150M (proxy)
    Expansao: 150 * 0.20,        // = 30M
    Continuidade: 150 * 0.30,    // = 45M
    RollbackParcial: 150 * 0.50, // = 75M
    RollbackTotal: 150 * 0.70,   // = 105M
  },
  benefit_note: 'Resiliência = R$ 150M (evitar disruption 6m, proxy); × P(shock cenário)',
};

// === PRESCRIÇÃO 6: FRAMEWORK D3 ===
// Custo: R$ 3.0M total (Phase 1-3, Q3 2026-Q1 2027)
// Benefício: R$ 700M-1bi economizado em 3 anos (D3 vs D2)
//           = R$ 233-330M/ano × 3 anos
// Custo de oportunidade: framework viabiliza 1-5 prescrições acima
const framework = {
  name: 'Framework D3',
  cost_per_year: {
    Expansao: 1.0,   // 1.0M/ano (3M total / 3 anos)
    Continuidade: 1.0,
    RollbackParcial: 1.0,
    RollbackTotal: 1.0,
  },
  cost_capex: {
    Expansao: 0,  // já em opex
    Continuidade: 0,
    RollbackParcial: 0,
    RollbackTotal: 0,
  },
  benefit_oneoff: {
    // R$ 233M/ano × 3 anos / cenário factor
    // Fator: maior em cenários estresse (framework mais valioso)
    Expansao: 700 * 0.50,        // = 350M
    Continuidade: 700 * 0.80,    // = 560M
    RollbackParcial: 1000 * 0.80, // = 800M
    RollbackTotal: 1000 * 0.90,  // = 900M
  },
  benefit_note: 'Economia D3 vs D2 = R$ 700M-1bi/3y; framework viabiliza 5 prescrições',
};

// === CÁLCULO NPV ===
function npv(cost_per_year, cost_capex, benefit, scenario) {
  // Fluxos: ano 0 (capex) + 3 anos de opex
  // Benefício: one-off no ano 2 (materialização do shock)
  let total = 0;
  // Ano 0: capex
  total -= (cost_capex || 0) / Math.pow(1 + R, 0);
  // Anos 1, 2, 3: opex
  for (let t = 1; t <= HORIZON; t++) {
    total -= cost_per_year / Math.pow(1 + R, t);
  }
  // Benefício no ano 2 (mid-horizon)
  total += benefit / Math.pow(1 + R, 2);
  return total;
}

const prescriptions = [hedge, dualSourcing, advocacy, defensivo, partnerships, framework];

const result = {
  params: {
    r: R,
    horizon: HORIZON,
    p_shock_base: P_SHOCK,
    discount_note: 'NTN-B 10y (~11%) + 200bps spread soberano = 13% nominal',
  },
  scenarios: SCENARIOS,
  npv_table: {},
  summary: {
    total_npv_by_scenario: {},
    best_prescription: {},
  },
};

for (const scen of Object.keys(SCENARIOS)) {
  result.npv_table[scen] = {};
  let total = 0;
  for (const presc of prescriptions) {
    const cost_py = presc.cost_per_year[scen];
    const cost_capex = presc.cost_capex ? presc.cost_capex[scen] : 0;
    const benefit = presc.benefit_oneoff[scen];
    const npv_val = npv(cost_py, cost_capex, benefit, scen);
    const roi = ((benefit - (cost_py * HORIZON + (cost_capex || 0))) / (cost_py * HORIZON + (cost_capex || 0))) * 100;
    result.npv_table[scen][presc.name] = {
      cost_3y_total: cost_py * HORIZON + (cost_capex || 0),
      benefit: benefit,
      npv: npv_val,
      roi_pct: roi,
      note: presc.benefit_note,
    };
    total += npv_val;
  }
  result.summary.total_npv_by_scenario[scen] = total;
}

// Best prescription by NPV per R$ invested (ROI)
for (const scen of Object.keys(SCENARIOS)) {
  let best = null;
  let best_roi = -Infinity;
  for (const presc of prescriptions) {
    const row = result.npv_table[scen][presc.name];
    if (row.roi_pct > best_roi) {
      best_roi = row.roi_pct;
      best = presc.name;
    }
  }
  result.summary.best_prescription[scen] = { name: best, roi: best_roi };
}

const outPath = path.join(__dirname, '_model_npv.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`NPV model written to ${outPath}`);
console.log('\n=== NPV by scenario (R$ M) ===');
for (const scen of Object.keys(SCENARIOS)) {
  console.log(`\n${SCENARIOS[scen].label}:`);
  for (const p of prescriptions) {
    const r = result.npv_table[scen][p.name];
    console.log(`  ${p.name}: cost 3y R$${r.cost_3y_total.toFixed(0)}M | benefit R$${r.benefit.toFixed(0)}M | NPV R$${r.npv.toFixed(0)}M | ROI ${r.roi_pct.toFixed(0)}%`);
  }
  console.log(`  TOTAL NPV: R$${result.summary.total_npv_by_scenario[scen].toFixed(0)}M`);
  console.log(`  BEST: ${result.summary.best_prescription[scen].name} (ROI ${result.summary.best_prescription[scen].roi.toFixed(0)}%)`);
}
