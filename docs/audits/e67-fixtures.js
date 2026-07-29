// e67-fixtures.js — per-function probes for E67 tourPrev
//
// Inverted mutant-detection: each fixture PRE-SEEDS the tour-state tracker
// and the dependent function call counters with sentinel values. The
// healthy mirror performs the operations and OVERWRITES the sentinel.
// The broken mutant drops the operation → sentinel survives → fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// tourPrev moves the tour backward by one step. At the start of the tour
// (tourIdx=0) it does nothing. State mutation + 2 delegate calls in a
// guarded if-branch.
//
// Topology (mirrors L3860-3861):
//   if (tourIdx > 0) {
//     1a. tourIdx--             (rewind position)
//     1b. showTourStep()        (re-render the active step)
//     1c. updateTourCounter()   (refresh the progress counter)
//   }
//
// Fixtures (F0..F4):
//   F0 — healthy control from middle (tourIdx=1, length=3): tourIdx=0,
//        showTourStep=1, updateTourCounter=1.
//   F1 — dropInv1a (bounds check drop): pre-seed tourIdx=0 (at start). Healthy
//        takes no action. T1 always takes if branch → tourIdx=-1 AND calls
//        showTourStep+updateTourCounter when they shouldn't fire.
//   F2 — dropInv1b (tourIdx-- drop): pre-seed tourIdx=1. Healthy → 0. T2 → 1.
//   F3 — dropInv1c (showTourStep call drop): counter pre-seeded 0. Healthy → 1.
//        T3 → 0.
//   F4 — dropInv1d (updateTourCounter call drop): counter pre-seeded 0.
//        Healthy → 1. T4 → 0.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control from middle (tourIdx=1, length=3).
  // ============================================================
  function runF0_healthyControlFromMiddle(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];

    if (deps.getTourIdx() !== 0) {
      issues.push('F0 tourIdx violated — expected 0, got ' + JSON.stringify(deps.getTourIdx()));
    }
    if (deps.getShowTourStepCalls() !== 1) {
      issues.push('F0 showTourStep-call violated — expected 1 call, got ' + JSON.stringify(deps.getShowTourStepCalls()));
    }
    if (deps.getUpdateTourCounterCalls() !== 1) {
      issues.push('F0 updateTourCounter-call violated — expected 1 call, got ' + JSON.stringify(deps.getUpdateTourCounterCalls()));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (bounds check drop): pre-seed tourIdx=0 (at start).
  // Healthy takes NO action. T1 always takes if branch → tourIdx=-1,
  // showTourStep=1, updateTourCounter=1 → 3 issues expected.
  // ============================================================
  function runF1_boundsCheckDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(0);
    renderFn();
    var issues = [];
    if (deps.getTourIdx() !== 0) {
      issues.push('F1 tourIdx violated — expected 0 (no-op at start), got ' + JSON.stringify(deps.getTourIdx()) + ' (bounds check dropped — T1)');
    }
    if (deps.getShowTourStepCalls() !== 0) {
      issues.push('F1 showTourStep-call violated — expected 0 calls (no-op at start), got ' + JSON.stringify(deps.getShowTourStepCalls()) + ' (bounds check dropped — T1)');
    }
    if (deps.getUpdateTourCounterCalls() !== 0) {
      issues.push('F1 updateTourCounter-call violated — expected 0 calls (no-op at start), got ' + JSON.stringify(deps.getUpdateTourCounterCalls()) + ' (bounds check dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (tourIdx-- drop): pre-seed tourIdx=1. Healthy → 0.
  // T2 leaves at 1 → 1 issue.
  // ============================================================
  function runF2_tourIdxRewindDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];
    if (deps.getTourIdx() !== 0) {
      issues.push('F2 tourIdx violated — expected 0, got ' + JSON.stringify(deps.getTourIdx()) + ' (tourIdx-- write dropped — T2)');
    }
    return issues;
  }

  // ============================================================
  // F3 — dropInv1c (showTourStep call drop): counter pre-seeded 0.
  // Healthy → 1. T3 leaves at 0 → 1 issue.
  // ============================================================
  function runF3_showTourStepDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];
    if (deps.getShowTourStepCalls() !== 1) {
      issues.push('F3 showTourStep-call violated — expected 1 call, got ' + JSON.stringify(deps.getShowTourStepCalls()) + ' (showTourStep call dropped — T3)');
    }
    return issues;
  }

  // ============================================================
  // F4 — dropInv1d (updateTourCounter call drop): counter pre-seeded 0.
  // Healthy → 1. T4 leaves at 0 → 1 issue.
  // ============================================================
  function runF4_updateTourCounterDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];
    if (deps.getUpdateTourCounterCalls() !== 1) {
      issues.push('F4 updateTourCounter-call violated — expected 1 call, got ' + JSON.stringify(deps.getUpdateTourCounterCalls()) + ' (updateTourCounter call dropped — T4)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControlFromMiddle,        target_id: null },
    { id: 'F1', fn: runF1_boundsCheckDropped,             target_id: 'T1' },
    { id: 'F2', fn: runF2_tourIdxRewindDropped,           target_id: 'T2' },
    { id: 'F3', fn: runF3_showTourStepDropped,            target_id: 'T3' },
    { id: 'F4', fn: runF4_updateTourCounterDropped,       target_id: 'T4' }
  ];
};