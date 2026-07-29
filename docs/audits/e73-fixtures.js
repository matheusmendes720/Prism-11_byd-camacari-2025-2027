// e73-fixtures.js — per-function probes for E73 statusClass
//
// Inverted mutant-detection: each fixture pre-seeds `s` with a sentinel
// status string. The healthy mirror returns the matching CSS class
// name. The broken mutant drops a ternary branch → returns the wrong
// class → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// statusClass(s) maps a status string to its CSS class name. Source:
//   L3147: function statusClass(s) { return s===STATUS.GREEN?'green' :
//                            s===STATUS.AMBER?'amber' :
//                            'red';}
//
// Topology (3 sub-checks):
//   1a. STATUS.GREEN branch: returns 'green'.
//   1b. STATUS.AMBER branch: returns 'amber'.
//   1c. fallback (RED):       returns 'red'.
//
// Fixtures (F0..F3):
//   F0 — healthy control: cycle through all 3 statuses.
//   F1 — dropInv1a (GREEN branch drop): s=STATUS.GREEN. Healthy → 'green'.
//        T1 → falls through to 'red'.
//   F2 — dropInv1b (AMBER branch drop): s=STATUS.AMBER. Healthy → 'amber'.
//        T2 → falls through to 'red'.
//   F3 — dropInv1c (RED fallback drop): s=STATUS.RED. Healthy → 'red'.
//        T3 → returns undefined.
//
// 3 mutants × 1 target fixture + 3 controls (fixtures × healthy) = 6 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  function assertClass(fixtureId, opLabel, expected, actual) {
    if (actual !== expected) {
      return [fixtureId + ' ' + opLabel + ' violated — expected "' + expected + '", got "' + actual + '"'];
    }
    return [];
  }

  // ============================================================
  // F0 — healthy control.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var issues = [];

    deps.setS('green');
    var gotGreen = renderFn();
    if (gotGreen !== 'green') {
      issues.push('F0 STATUS.GREEN violated — expected "green", got "' + gotGreen + '"');
    }
    deps.setS('amber');
    var gotAmber = renderFn();
    if (gotAmber !== 'amber') {
      issues.push('F0 STATUS.AMBER violated — expected "amber", got "' + gotAmber + '"');
    }
    deps.setS('red');
    var gotRed = renderFn();
    if (gotRed !== 'red') {
      issues.push('F0 STATUS.RED violated — expected "red", got "' + gotRed + '"');
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (GREEN branch drop). s='green'. Healthy → 'green'.
  // T1 → falls through to 'red'.
  // ============================================================
  function runF1_greenBranchDropped(renderFn) {
    deps.resetEnv();
    deps.setS('green');
    var got = renderFn();
    return assertClass('F1', 'STATUS.GREEN branch violated', 'green', got);
  }

  // ============================================================
  // F2 — dropInv1b (AMBER branch drop). s='amber'. Healthy → 'amber'.
  // T2 → falls through to 'red'.
  // ============================================================
  function runF2_amberBranchDropped(renderFn) {
    deps.resetEnv();
    deps.setS('amber');
    var got = renderFn();
    return assertClass('F2', 'STATUS.AMBER branch violated', 'amber', got);
  }

  // ============================================================
  // F3 — dropInv1c (RED fallback drop). s='red'. Healthy → 'red'.
  // T3 → returns undefined.
  // ============================================================
  function runF3_redFallbackDropped(renderFn) {
    deps.resetEnv();
    deps.setS('red');
    var got = renderFn();
    return assertClass('F3', 'STATUS.RED fallback violated', 'red', got);
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,            target_id: null },
    { id: 'F1', fn: runF1_greenBranchDropped,        target_id: 'T1' },
    { id: 'F2', fn: runF2_amberBranchDropped,        target_id: 'T2' },
    { id: 'F3', fn: runF3_redFallbackDropped,        target_id: 'T3' }
  ];
};