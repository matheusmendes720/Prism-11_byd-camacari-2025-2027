// e95-fixtures.js — per-function probes for E95 showTourSelector
//
// showTourSelector() starts the tour modal.
// Invariants:
//   1a. tour-overlay display = 'flex'.
//   1b. currentTourId is set.
//   1c. showTourStep was called (track via call counter).
//
// Source — D3-PITCH-GRAPH.html L4007-4019 (showTourSelector).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. showTourSelector() should show tour overlay.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    fn();
    var snap = deps.getSnapshot();

    // 1a. tour-overlay display should be 'flex'.
    if (snap.tourOverlayDisplay !== 'flex') {
      issues.push('F0 1a — tour-overlay display should be flex, got ' + snap.tourOverlayDisplay);
    }

    // 1b. currentTourId should be set.
    if (!snap.currentTourId) {
      issues.push('F0 1b — currentTourId should be set, got ' + JSON.stringify(snap.currentTourId));
    }

    // 1c. showTourStep call count > 0.
    if (snap.showTourStepCalls === 0) {
      issues.push('F0 1c — showTourStep should be called at least once, got ' + snap.showTourStepCalls);
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
