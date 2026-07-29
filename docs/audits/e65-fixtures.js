// e65-fixtures.js — per-function probes for E65 restartTour
//
// Inverted mutant-detection: each fixture PRE-SEEDS the tour-state tracker
// and showTourStep call counter with sentinel values. The healthy mirror
// performs the operations and OVERWRITES the sentinel. The broken mutant
// drops the operation → sentinel survives → fixture reports issue → runner
// says PASS (BASELINE) or FAIL (REPAIRED).
//
// restartTour resets the tour to step 0 and re-runs the step renderer so
// the user can replay the walkthrough from scratch. State mutation only —
// no event args, no node payload.
//
// Topology (mirrors L3869-3872):
//   1. tourIdx = 0  (reset position to step 0)
//   2. showTourStep()  (re-render the active step)
//
// Fixtures (F0..F2):
//   F0 — healthy control: tourIdx reset to 0 (was 5); showTourStep called
//        exactly once (counter went from 0 to 1).
//   F1 — dropInv1a (tourIdx=0 drop): pre-seed tourIdx=5. Healthy flips to
//        0. T1 leaves tourIdx=5 → 1 issue.
//   F2 — dropInv1b (showTourStep call drop): pre-seed callCounter=0. After
//        healthy: callCounter=1. After T2: callCounter=0 → 1 issue.
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: both invariants execute correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(5);
    renderFn();
    var issues = [];

    if (deps.getTourIdx() !== 0) {
      issues.push('F0 tourIdx violated — expected 0, got ' + JSON.stringify(deps.getTourIdx()));
    }
    if (deps.getShowTourStepCalls() !== 1) {
      issues.push('F0 showTourStep-call violated — expected 1 call, got ' + JSON.stringify(deps.getShowTourStepCalls()));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (tourIdx=0 drop): pre-seed tourIdx=5.
  // Healthy flips to 0. T1 leaves tourIdx=5 → 1 issue.
  // ============================================================
  function runF1_tourIdxDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(5);
    renderFn();
    var issues = [];
    if (deps.getTourIdx() !== 0) {
      issues.push('F1 tourIdx violated — expected 0, got ' + JSON.stringify(deps.getTourIdx()) + ' (tourIdx=0 write dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (showTourStep call drop): counter pre-seeded 0.
  // Healthy increments to 1. T2 leaves at 0 → 1 issue.
  // ============================================================
  function runF2_showTourStepDropped(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];
    if (deps.getShowTourStepCalls() !== 1) {
      issues.push('F2 showTourStep-call violated — expected 1 call, got ' + JSON.stringify(deps.getShowTourStepCalls()) + ' (showTourStep call dropped — T2)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                 target_id: null },
    { id: 'F1', fn: runF1_tourIdxDropped,                 target_id: 'T1' },
    { id: 'F2', fn: runF2_showTourStepDropped,            target_id: 'T2' }
  ];
};