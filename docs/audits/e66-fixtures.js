// e66-fixtures.js — per-function probes for E66 tourNext
//
// Inverted mutant-detection: each fixture PRE-SEEDS the tour-state tracker
// and the dependent function call counters with sentinel values. The
// healthy mirror performs the operations and OVERWRITES the sentinel.
// The broken mutant drops the operation → sentinel survives → fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// tourNext advances the tour one step. At the end of the tour it triggers
// endTour() instead. State mutation + 2 delegate calls + conditional else.
//
// Topology (mirrors L3856-3859):
//   if (tourIdx < tourSteps.length - 1) {
//     1a. tourIdx++             (advance position)
//     1b. showTourStep()        (re-render the active step)
//     1c. updateTourCounter()   (refresh the progress counter)
//   } else {
//     1d. endTour()             (cleanup overlay + highlighting)
//   }
//
// Fixtures (F0..F5):
//   F0 — healthy control from middle (tourIdx=1, length=3): tourIdx=2,
//        showTourStep=1, updateTourCounter=1, endTour=0.
//   F1 — dropInv1a (bounds check drop): pre-seed tourIdx=2 (at end). Healthy
//        takes else branch → endTour=1. T1 always takes if branch → endTour=0
//        AND tourIdx would over-increment to 3.
//   F2 — dropInv1b (tourIdx++ drop): pre-seed tourIdx=1. Healthy flips to 2.
//        T2 leaves at 1 → 1 issue.
//   F3 — dropInv1c (showTourStep call drop): counter pre-seeded 0. Healthy
//        → 1. T2 leaves at 0 → 1 issue.
//   F4 — dropInv1d (updateTourCounter call drop): counter pre-seeded 0.
//        Healthy → 1. T4 leaves at 0 → 1 issue.
//   F5 — dropInv1e (else-branch endTour drop): pre-seed tourIdx=2 (at end).
//        Healthy → endTour=1. T5 → endTour=0 → 1 issue.
//
// 5 mutants × 1 target fixture + 5 controls (fixtures × healthy) = 10 reports.
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

    if (deps.getTourIdx() !== 2) {
      issues.push('F0 tourIdx violated — expected 2, got ' + JSON.stringify(deps.getTourIdx()));
    }
    if (deps.getShowTourStepCalls() !== 1) {
      issues.push('F0 showTourStep-call violated — expected 1 call, got ' + JSON.stringify(deps.getShowTourStepCalls()));
    }
    if (deps.getUpdateTourCounterCalls() !== 1) {
      issues.push('F0 updateTourCounter-call violated — expected 1 call, got ' + JSON.stringify(deps.getUpdateTourCounterCalls()));
    }
    if (deps.getEndTourCalls() !== 0) {
      issues.push('F0 endTour-call violated — expected 0 calls (middle position, no end), got ' + JSON.stringify(deps.getEndTourCalls()));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (bounds check drop): pre-seed tourIdx=2 (at end).
  // Healthy takes else branch → endTour=1. T1 always takes if branch →
  // endTour=0 AND tourIdx over-increments to 3.
  // ============================================================
  function runF1_boundsCheckDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(2);
    renderFn();
    var issues = [];
    if (deps.getEndTourCalls() !== 1) {
      issues.push('F1 endTour-call violated — expected 1 call (else branch), got ' + JSON.stringify(deps.getEndTourCalls()) + ' (bounds check dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (tourIdx++ drop): pre-seed tourIdx=1. Healthy → 2.
  // T2 leaves at 1 → 1 issue.
  // ============================================================
  function runF2_tourIdxAdvanceDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];
    if (deps.getTourIdx() !== 2) {
      issues.push('F2 tourIdx violated — expected 2, got ' + JSON.stringify(deps.getTourIdx()) + ' (tourIdx++ write dropped — T2)');
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

  // ============================================================
  // F5 — dropInv1e (else-branch endTour drop): pre-seed tourIdx=2 (at end).
  // Healthy → endTour=1. T5 → endTour=0 → 1 issue.
  // ============================================================
  function runF5_elseBranchEndTourDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(2);
    renderFn();
    var issues = [];
    if (deps.getEndTourCalls() !== 1) {
      issues.push('F5 endTour-call violated — expected 1 call (at end of tour), got ' + JSON.stringify(deps.getEndTourCalls()) + ' (else-branch endTour call dropped — T5)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControlFromMiddle,        target_id: null },
    { id: 'F1', fn: runF1_boundsCheckDropped,             target_id: 'T1' },
    { id: 'F2', fn: runF2_tourIdxAdvanceDropped,          target_id: 'T2' },
    { id: 'F3', fn: runF3_showTourStepDropped,            target_id: 'T3' },
    { id: 'F4', fn: runF4_updateTourCounterDropped,       target_id: 'T4' },
    { id: 'F5', fn: runF5_elseBranchEndTourDropped,       target_id: 'T5' }
  ];
};