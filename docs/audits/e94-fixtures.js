// e94-fixtures.js — per-function probes for E94 hideTooltip
//
// hideTooltip() hides the tooltip element.
// Invariants:
//   1a. tooltip display = 'none'.
//
// Source — D3-PITCH-GRAPH.html L4246-4253 (hideTooltip).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. hideTooltip() should set tooltip display='none'.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    fn();
    var snap = deps.getSnapshot();

    // 1a. tooltip display should be 'none'.
    if (snap.tooltipDisplay !== 'none') {
      issues.push('F0 1a — tooltip display should be none, got ' + snap.tooltipDisplay);
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
