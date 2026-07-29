// e71-fixtures.js — per-function probes for E71 statusColor
//
// Inverted mutant-detection: each fixture pre-seeds `s` with a sentinel
// status string. The healthy mirror returns the matching COLORS value.
// The broken mutant drops a ternary branch → returns the wrong color.
// Fixture compares actual vs expected → reports issue → runner says
// PASS (BASELINE) or FAIL (REPAIRED).
//
// statusColor(s) maps a status string to its color hex. Source:
//   L3139: function statusColor(s) { return s===STATUS.GREEN?COLORS.green :
//                            s===STATUS.AMBER?COLORS.amber :
//                            COLORS.red;}
//
// Topology (3 sub-checks):
//   1a. STATUS.GREEN branch: returns COLORS.green.
//   1b. STATUS.AMBER branch: returns COLORS.amber.
//   1c. fallback (RED):       returns COLORS.red.
//
// Fixtures (F0..F3):
//   F0 — healthy control: cycle through all 3 statuses, healthy returns
//        the right color for each.
//   F1 — dropInv1a (GREEN branch drop): s=STATUS.GREEN. Healthy → green.
//        T1 → falls through to amber?red? depending on exact drop.
//   F2 — dropInv1b (AMBER branch drop): s=STATUS.AMBER. Healthy → amber.
//        T2 → falls through to red.
//   F3 — dropInv1c (RED fallback drop): s=STATUS.RED. Healthy → red.
//        T3 → returns undefined/no-fallback (or last valid value).
//
// 3 mutants × 1 target fixture + 3 controls (fixtures × healthy) = 6 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  function assertColor(fixtureId, opLabel, expected, actual) {
    if (actual !== expected) {
      return [fixtureId + ' ' + opLabel + ' violated — expected ' + expected + ', got ' + actual];
    }
    return [];
  }

  // ============================================================
  // F0 — healthy control. Cycle through all 3 statuses; each returns
  // its correct color.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var issues = [];

    deps.setS('green');
    var gotGreen = renderFn();
    if (gotGreen !== deps.getColors().green) {
      issues.push('F0 STATUS.GREEN violated — expected ' + deps.getColors().green + ', got ' + gotGreen);
    }
    deps.setS('amber');
    var gotAmber = renderFn();
    if (gotAmber !== deps.getColors().amber) {
      issues.push('F0 STATUS.AMBER violated — expected ' + deps.getColors().amber + ', got ' + gotAmber);
    }
    deps.setS('red');
    var gotRed = renderFn();
    if (gotRed !== deps.getColors().red) {
      issues.push('F0 STATUS.RED violated — expected ' + deps.getColors().red + ', got ' + gotRed);
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (GREEN branch drop). s='green'. Healthy → COLORS.green.
  // T1 → since s!==STATUS.GREEN short-circuits to amber check, s===amber
  //      is false, falls through to COLORS.red. 1 issue: expected green, got red.
  // (T1 returns COLORS.red — wrong color for a GREEN status.)
  // ============================================================
  function runF1_greenBranchDropped(renderFn) {
    deps.resetEnv();
    deps.setS('green');
    var got = renderFn();
    return assertColor('F1', 'STATUS.GREEN branch violated', deps.getColors().green, got);
  }

  // ============================================================
  // F2 — dropInv1b (AMBER branch drop). s='amber'. Healthy → COLORS.amber.
  // T2 → since s!==STATUS.GREEN and s!==STATUS.AMBER (amber branch
  //      dropped), falls through to COLORS.red. 1 issue: expected amber, got red.
  // ============================================================
  function runF2_amberBranchDropped(renderFn) {
    deps.resetEnv();
    deps.setS('amber');
    var got = renderFn();
    return assertColor('F2', 'STATUS.AMBER branch violated', deps.getColors().amber, got);
  }

  // ============================================================
  // F3 — dropInv1c (RED fallback drop). s='red'. Healthy → COLORS.red.
  // T3 → red fallback dropped, returns undefined. 1 issue: expected red, got undefined.
  // ============================================================
  function runF3_redFallbackDropped(renderFn) {
    deps.resetEnv();
    deps.setS('red');
    var got = renderFn();
    return assertColor('F3', 'STATUS.RED fallback violated', deps.getColors().red, got);
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,            target_id: null },
    { id: 'F1', fn: runF1_greenBranchDropped,        target_id: 'T1' },
    { id: 'F2', fn: runF2_amberBranchDropped,        target_id: 'T2' },
    { id: 'F3', fn: runF3_redFallbackDropped,        target_id: 'T3' }
  ];
};