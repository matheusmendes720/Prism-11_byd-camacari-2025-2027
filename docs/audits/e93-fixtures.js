// e93-fixtures.js — per-function probes for E93 showTooltip
//
// showTooltip(event, node) shows a tooltip near the mouse cursor.
// Invariants:
//   1a. tooltip element display = 'block'.
//   1b. tooltip element innerHTML is non-empty.
//
// Source — D3-PITCH-GRAPH.html L4211-4231 (showTooltip).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. showTooltip(event, node) should show
  //       tooltip with node info.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    var node = { id: 'S1', label: 'FX Signal', ntype: 'signal', status: 'amber', score: 65 };
    var event = { clientX: 100, clientY: 200 };
    fn(event, node);
    var snap = deps.getSnapshot();

    // 1a. tooltip display should be 'block'.
    if (snap.tooltipDisplay !== 'block') {
      issues.push('F0 1a — tooltip display should be block, got ' + snap.tooltipDisplay);
    }

    // 1b. tooltip innerHTML should be non-empty.
    if (!snap.tooltipHTML || snap.tooltipHTML.length === 0) {
      issues.push('F0 1b — tooltip innerHTML should be non-empty, got ' + JSON.stringify(snap.tooltipHTML));
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
