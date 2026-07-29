// e56-fixtures.js — per-function probes for E56 showTourSelector
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs or state with
// sentinel values. The healthy mirror performs the operation and OVERWRITES
// the sentinel. The broken mutant drops the operation → sentinel survives
// → fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// Fixtures (F0..F4):
//   F0 — healthy control: state resolved cleanly, overlay visible, showTourStep
//        invoked (all 4 invariants complete).
//   F1 — defaultTourId points to the second entry → T1 (drop 1a — defaultTourId
//        lookup branch). Healthy picks second entry; broken falls through to
//        first, currentTourId ends up wrong.
//   F2 — pre-set currentTourId = 'stale-id', tourIdx = 99 → T2 (drop 1b — state
//        reset). Healthy overwrites both; broken leaves stale.
//   F3 — pre-set #tour-overlay.style.display = 'OLD_NONE' → T3 (drop 1c — overlay
//        display write). Healthy OVERWRITES to 'flex'; broken leaves 'OLD_NONE'.
//   F4 — showTourStep counter reset to 0 → T4 (drop 1d — showTourStep
//        invocation). Healthy increments to 1+; broken stays 0.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control (defaultTourId undefined → first entry selected).
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var result = renderFn();
    var issues = [];

    var stateAfter = deps.getSelectorState();
    var overlay = deps.getOverlay();
    var counter = deps.getShowTourStepCallCount();

    // 1a evidence: tour resolved → currentTourId === tours[0].id
    var firstId = deps.getFirstTourId();
    if (stateAfter.currentTourId !== firstId) {
      issues.push('F0 tour-resolution violated — expected currentTourId=' + JSON.stringify(firstId) + ', got ' + JSON.stringify(stateAfter.currentTourId));
    }
    // 1b evidence: tourIdx reset to 0
    if (stateAfter.tourIdx !== 0) {
      issues.push('F0 tourIdx-reset violated — expected 0, got ' + JSON.stringify(stateAfter.tourIdx));
    }
    // 1c evidence: overlay display = 'flex'
    if (overlay.style.display !== 'flex') {
      issues.push('F0 overlay-display violated — expected "flex", got ' + JSON.stringify(overlay.style.display));
    }
    // 1d evidence: showTourStep invoked at least once
    if (counter < 1) {
      issues.push('F0 showTourStep-invocation violated — expected callCount >= 1, got ' + JSON.stringify(counter));
    }
    return issues;
  }

  // ============================================================
  // F1 — defaultTourId points to second entry → T1 (drop 1a)
  // Healthy picks second entry. Broken T1 falls through to first, ends up
  // with currentTourId = first entry's id.
  // ============================================================
  function runF1_defaultTourIdMismatch(renderFn) {
    deps.resetEnv();
    var secondId = deps.getSecondTourId();
    // Globally define defaultTourId (matching the mirror's bare-identifier
    // resolution chain in Node).
    deps.setDefaultTourId(secondId);
    renderFn();
    var issues = [];
    var stateAfter = deps.getSelectorState();
    if (stateAfter.currentTourId !== secondId) {
      issues.push('F1 defaultTourId-resolution violated — expected currentTourId=' + JSON.stringify(secondId) + ' (mirror picks defaultTourId match), got ' + JSON.stringify(stateAfter.currentTourId));
    }
    return issues;
  }

  // ============================================================
  // F2 — pre-set currentTourId = 'stale-id', tourIdx = 99 → T2 (drop 1b)
  // Healthy OVERWRITES both. Broken T2 leaves stale.
  // ============================================================
  function runF2_stateNotReset(renderFn) {
    deps.resetEnv();
    deps.setSelectorState({ currentTourId: 'stale-id', tourIdx: 99 });
    renderFn();
    var issues = [];
    var after = deps.getSelectorState();
    if (after.currentTourId === 'stale-id') {
      issues.push('F2 currentTourId-reset violated — expected overwrite to resolved tour.id, still "stale-id"');
    }
    if (after.tourIdx === 99) {
      issues.push('F2 tourIdx-reset violated — expected overwrite to 0, still 99');
    }
    return issues;
  }

  // ============================================================
  // F3 — pre-set #tour-overlay.style.display = 'OLD_NONE' → T3 (drop 1c)
  // Healthy OVERWRITES to 'flex'. Broken T3 leaves 'OLD_NONE'.
  // ============================================================
  function runF3_overlayHiddenAfterCall(renderFn) {
    deps.resetEnv();
    deps.getOverlay().style.display = 'OLD_NONE';
    renderFn();
    var issues = [];
    var overlayAfter = deps.getOverlay();
    if (overlayAfter.style.display === 'OLD_NONE') {
      issues.push('F3 overlay-display-sentinel violated — expected overwrite to "flex", still "OLD_NONE"');
    }
    return issues;
  }

  // ============================================================
  // F4 — showTourStep counter reset to 0 → T4 (drop 1d)
  // Healthy increments to >= 1. Broken T4 stays 0.
  // ============================================================
  function runF4_showTourStepNotCalled(renderFn) {
    deps.resetEnv();
    deps.setShowTourStepCallCount(0);
    renderFn();
    var issues = [];
    var counter = deps.getShowTourStepCallCount();
    if (counter < 1) {
      issues.push('F4 showTourStep-invocation violated — expected callCount >= 1, got ' + JSON.stringify(counter));
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                 target_id: null },
    { id: 'F1', fn: runF1_defaultTourIdMismatch,          target_id: 'T1' },
    { id: 'F2', fn: runF2_stateNotReset,                  target_id: 'T2' },
    { id: 'F3', fn: runF3_overlayHiddenAfterCall,         target_id: 'T3' },
    { id: 'F4', fn: runF4_showTourStepNotCalled,          target_id: 'T4' }
  ];
};
