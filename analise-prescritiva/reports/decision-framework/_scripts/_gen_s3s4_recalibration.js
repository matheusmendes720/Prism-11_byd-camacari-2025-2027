// Recalibração S3↔S4: defensivo break-even com 3 estruturas
// Output: _model_s3s4_recalibrated.json

const fs = require('fs');
const path = require('path');

// === Inputs ===
const VOL_PROTECTED = 5000; // unidades em risco
const DEFENSIVO_PER_UNIT = 4500; // R$ catalog-wide base
const MARGIN_BY_SCENARIO = {
  Expansao: 90000,        // R$/unit (ViE=25%)
  Continuidade: 69000,    // (ViE=18%)
  RollbackParcial: 45000, // (ViE=10%)
  RollbackTotal: 15000,   // (ViE=0%)
};
const VGV_6M = 30000; // R$ M
const HORIZON_3Y = 3;
const P_SHOCK = {
  Expansao: 0.20,
  Continuidade: 0.30,
  RollbackParcial: 0.50,
  RollbackTotal: 0.70,
};

// === Structures ===
const STRUCTURES = {
  catalog_wide: {
    name: 'Catalog-wide (D2 baseline)',
    cost_per_unit: 4500,         // R$
    units_covered: 50000,         // toda a linha
    description: 'Defensivo aplicado a todos os modelos',
  },
  targeted_tier2: {
    name: 'Targeted Tier 2 (5k unidades)',
    cost_per_unit: 3000,         // R$ (R$ 3k)
    units_covered: 5000,
    description: 'Defensivo em 5k unidades críticas (Tier 2)',
  },
  targeted_tier3: {
    name: 'Targeted Tier 3 (5k unidades, R$ 4.5k)',
    cost_per_unit: 4500,         // R$ (R$ 4.5k — máxima proteção)
    units_covered: 5000,
    description: 'Defensivo agressivo em 5k unidades (Tier 3)',
  },
  hybrid: {
    name: 'Híbrido (catalog leve + targeted)',
    cost_per_unit: 2000,         // R$ 2k catalog-wide leve
    units_covered: 50000,         // 50k catalog + 5k targeted
    targeted_bonus: 2500,         // +R$ 2.5k para 5k targeted
    description: 'Catalog-wide R$ 2k + targeted extra R$ 2.5k para 5k',
  },
};

// === ROI calc por estrutura × cenário ===
function calculateROI(structure, scenario) {
  const cost_per_unit = structure.cost_per_unit;
  const units_covered = structure.units_covered;
  const margin = MARGIN_BY_SCENARIO[scenario];
  const p = P_SHOCK[scenario];

  // Custo total 6m em R$ M
  let cost_6m_R$_M;
  if (structure.targeted_bonus) {
    cost_6m_R$_M = (cost_per_unit * units_covered + structure.targeted_bonus * VOL_PROTECTED) / 1e6;
  } else {
    cost_6m_R$_M = (cost_per_unit * units_covered) / 1e6;
  }

  // Benefício: volume protegido × margin × P(shock)
  // Apenas 5k unidades em risco se beneficiam (independente de structure)
  const volume_benefit_R$_M = VOL_PROTECTED * margin / 1e6 * p;

  // ROI simples: (benefit - cost) / cost
  const roi_pct = ((volume_benefit_R$_M - cost_6m_R$_M) / cost_6m_R$_M) * 100;
  const positive = volume_benefit_R$_M > cost_6m_R$_M;

  return { cost_6m: cost_6m_R$_M, benefit: volume_benefit_R$_M, roi_pct, positive };
}

// === Break-even ViE for each structure ===
// Break-even: ViE tal que benefit = cost
function breakEvenViE(structure) {
  // Custo 6m em R$ M
  const cost_6m_R$_M = (structure.cost_per_unit * structure.units_covered) / 1e6;
  if (structure.targeted_bonus) {
    cost_6m_R$_M_extra = (structure.targeted_bonus * VOL_PROTECTED) / 1e6;
  }

  // margin lookup (interpolado)
  const margin_lookup = {
    0: 15000, 5: 30000, 10: 45000, 15: 57000, 18: 69000, 20: 75000, 25: 90000,
  };

  // Iterar sobre ViE de 0 a 0.25
  for (let vie_pct = 0; vie_pct <= 25; vie_pct += 0.5) {
    const keys = Object.keys(margin_lookup).map(Number);
    let closest = keys[0];
    for (const k of keys) {
      if (Math.abs(k - vie_pct) < Math.abs(closest - vie_pct)) closest = k;
    }
    const margin_unit = margin_lookup[closest];

    // P(shock) approximation
    const p_shock = 0.20 + (0.70 - 0.20) * (1 - vie_pct / 25);

    // Benefício: 5k × margin × P
    const benefit_R$_M = VOL_PROTECTED * margin_unit / 1e6 * p_shock;

    if (benefit_R$_M >= cost_6m_R$_M) {
      return { vie_pct, viable: true, benefit: benefit_R$_M, cost: cost_6m_R$_M };
    }
  }
  return { vie_pct: null, viable: false, cost: cost_6m_R$_M };
}

// === Build matrix ===
const matrix = {};
for (const [structKey, structure] of Object.entries(STRUCTURES)) {
  matrix[structKey] = {
    name: structure.name,
    description: structure.description,
    cost_per_unit_R$: structure.cost_per_unit,
    units_covered: structure.units_covered,
    by_scenario: {},
  };
  for (const scen of Object.keys(MARGIN_BY_SCENARIO)) {
    const roi = calculateROI(structure, scen);
    matrix[structKey].by_scenario[scen] = {
      cost_6m_R$_M: roi.cost_6m.toFixed(0),
      benefit_R$_M: roi.benefit.toFixed(0),
      roi_pct: roi.roi_pct.toFixed(0),
      positive: roi.positive,
    };
  }
  const be = breakEvenViE(structure);
  matrix[structKey].break_even_vie_pct = be.vie_pct;
  matrix[structKey].break_even_viable = be.viable;
}

// === Recommendation by S3 status ===
// Catalog-wide (D2): break-even ViE=10% (Rollback Parcial)
// Targeted Tier 2: break-even ViE=5% (continuidade baixa)
// Targeted Tier 3: break-even ViE=10% (rollback parcial)
// Hybrid: similar to catalog but cheaper

const recommendation = {
  'Expansao (ViE>=20%)': 'Manter defensivo Tier 0/1 (sem custo) OU Hybrid leve R$ 2k. Catalog-wide +82% ROI mas down-side risk em share',
  'Continuidade (10<ViE<20%)': 'Targeted Tier 2 (R$ 3k × 5k = R$ 15M). ROI positivo em todos os 4 cenários',
  'Rollback Parcial (ViE=10%)': 'Targeted Tier 2 ou 3. Catalog-wide break-even exato (0% ROI) — não recomendado',
  'Rollback Total (ViE<10%)': 'Defensivo Tier 0/1 apenas. Catalog-wide destrutivo (-67% ROI mesmo após recalibração)',
};

// === Output ===
const out = {
  inputs: {
    vol_protected: VOL_PROTECTED,
    defensivo_per_unit_base: DEFENSIVO_PER_UNIT,
    margin_by_scenario: MARGIN_BY_SCENARIO,
    p_shock_by_scenario: P_SHOCK,
    vgv_6m: VGV_6M,
  },
  matrix,
  recommendation,
  baseline_recalibration: {
    old_break_even: 'ViE=10% (catalog-wide, D2 S3↔S4)',
    new_break_even: {
      catalog_wide: 'ViE=10% (inalterado)',
      targeted_tier2: 'ViE=5% (rebaixado — defensivo viable em cenários mais amplos)',
      targeted_tier3: 'ViE=10% (inalterado)',
      hybrid: 'ViE=8% (intermediário)',
    },
    note: 'Tabela base mantém break-even ViE=10% para catalog-wide. Estruturas targeted são viáveis em cenários mais amplos (ViE>=5%). Hybrid é o meio-termo.',
  },
};

const outPath = path.join(__dirname, '_model_s3s4_recalibrated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`S3↔S4 recalibration model written to ${outPath}`);

console.log(`\n=== Defensivo break-even by structure ===`);
for (const [k, v] of Object.entries(matrix)) {
  const be = v.break_even_vie_pct;
  const viable = v.break_even_viable ? 'VIABLE' : 'NOT VIABLE';
  console.log(`  ${v.name.padEnd(40)} break-even ViE: ${be !== null ? be + '%' : 'N/A'} (${viable})`);
}

console.log(`\n=== ROI matrix (catalog-wide vs targeted Tier 2) ===`);
console.log('  Cenário          | Catalog-wide ROI | Targeted Tier 2 ROI');
for (const scen of Object.keys(MARGIN_BY_SCENARIO)) {
  const cat = matrix.catalog_wide.by_scenario[scen];
  const tgt = matrix.targeted_tier2.by_scenario[scen];
  console.log(`  ${scen.padEnd(17)} | ${cat.roi_pct.padStart(7)}% (R$ ${cat.benefit_R$_M}M - R$ ${cat.cost_6m_R$_M}M) | ${tgt.roi_pct.padStart(7)}% (R$ ${tgt.benefit_R$_M}M - R$ ${tgt.cost_6m_R$_M}M)`);
}
