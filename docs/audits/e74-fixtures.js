// e74-fixtures.js — per-function probes for E74 viewLabel
//
// Inverted mutant-detection: each fixture pre-seeds `v` with a view
// key. The healthy mirror returns the matching pt-br label, or `v`
// verbatim for unknown keys. The broken mutant drops a key mapping
// → falls through to fallback (returns `v` for known keys) → fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// viewLabel(v) maps a view key to its pt-br label. Source:
//   L3404-3406:
//     function viewLabel(v) {
//       return {overview:'Visão geral', 'red-flags':'Alertas vermelhos',
//               couplings:'Conexões entre frentes', gates:'Travas de aprovação',
//               personas:'Pessoas-chave', flow:'Caminho do sinal à ação',
//               risk:'Caderno de riscos', timeline:'Cronograma 18 meses',
//               scenario:'Cenários políticos',
//               cascade:'Como uma crise vira desastre'}[v] || v;
//     }
//
// Topology (11 keys + fallback = 12 sub-checks). Targeting 4
// representative ones:
//   1a. 'red-flags' → 'Alertas vermelhos'  (hyphenated key, hardest)
//   1b. 'risk'      → 'Caderno de riscos'
//   1c. 'gates'     → 'Travas de aprovação'
//   1d. fallback (unknown key 'unknown-x') → returns 'unknown-x' verbatim.
//
// Fixtures (F0..F4):
//   F0 — healthy control: cycle through 4 keys.
//   F1 — dropInv1a ('red-flags' mapping drop). Healthy → 'Alertas vermelhos'.
//        T1 → falls through, returns 'red-flags' verbatim.
//   F2 — dropInv1b ('risk' mapping drop). Healthy → 'Caderno de riscos'.
//        T2 → returns 'risk' verbatim.
//   F3 — dropInv1c ('gates' mapping drop). Healthy → 'Travas de aprovação'.
//        T3 → returns 'gates' verbatim.
//   F4 — dropInv1d (fallback drop — `|| v` default removed).
//        Healthy → returns 'unknown-x' verbatim. T4 → returns undefined.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  function assertLabel(fixtureId, opLabel, expected, actual) {
    if (actual !== expected) {
      return [fixtureId + ' ' + opLabel + ' violated — expected "' + expected + '", got "' + actual + '"'];
    }
    return [];
  }

  // ============================================================
  // F0 — healthy control. 4 keys.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var issues = [];

    deps.setV('red-flags');
    var got1 = renderFn();
    if (got1 !== 'Alertas vermelhos') {
      issues.push('F0 red-flags violated — expected "Alertas vermelhos", got "' + got1 + '"');
    }
    deps.setV('risk');
    var got2 = renderFn();
    if (got2 !== 'Caderno de riscos') {
      issues.push('F0 risk violated — expected "Caderno de riscos", got "' + got2 + '"');
    }
    deps.setV('gates');
    var got3 = renderFn();
    if (got3 !== 'Travas de aprovação') {
      issues.push('F0 gates violated — expected "Travas de aprovação", got "' + got3 + '"');
    }
    deps.setV('unknown-x');
    var got4 = renderFn();
    if (got4 !== 'unknown-x') {
      issues.push('F0 fallback violated — expected "unknown-x", got "' + got4 + '"');
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a ('red-flags' mapping drop). Healthy → 'Alertas vermelhos'.
  // T1 → returns 'red-flags' verbatim.
  // ============================================================
  function runF1_redFlagsDropped(renderFn) {
    deps.resetEnv();
    deps.setV('red-flags');
    var got = renderFn();
    return assertLabel('F1', "'red-flags' mapping violated", 'Alertas vermelhos', got);
  }

  // ============================================================
  // F2 — dropInv1b ('risk' mapping drop). Healthy → 'Caderno de riscos'.
  // T2 → returns 'risk' verbatim.
  // ============================================================
  function runF2_riskDropped(renderFn) {
    deps.resetEnv();
    deps.setV('risk');
    var got = renderFn();
    return assertLabel('F2', "'risk' mapping violated", 'Caderno de riscos', got);
  }

  // ============================================================
  // F3 — dropInv1c ('gates' mapping drop). Healthy → 'Travas de aprovação'.
  // T3 → returns 'gates' verbatim.
  // ============================================================
  function runF3_gatesDropped(renderFn) {
    deps.resetEnv();
    deps.setV('gates');
    var got = renderFn();
    return assertLabel('F3', "'gates' mapping violated", 'Travas de aprovação', got);
  }

  // ============================================================
  // F4 — dropInv1d (fallback `|| v` drop). Healthy → returns 'unknown-x'.
  // T4 → returns undefined.
  // ============================================================
  function runF4_fallbackDropped(renderFn) {
    deps.resetEnv();
    deps.setV('unknown-x');
    var got = renderFn();
    return assertLabel('F4', 'fallback (|| v) violated', 'unknown-x', got);
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,         target_id: null },
    { id: 'F1', fn: runF1_redFlagsDropped,        target_id: 'T1' },
    { id: 'F2', fn: runF2_riskDropped,            target_id: 'T2' },
    { id: 'F3', fn: runF3_gatesDropped,           target_id: 'T3' },
    { id: 'F4', fn: runF4_fallbackDropped,        target_id: 'T4' }
  ];
};