// e92-fixtures.js — per-function probes for E92 showDetail
//
// showDetail(n) populates the right-side detail panel. Invariants:
//   1a. #detail-empty gets display:none.
//   1b. #detail-content gets display:block.
//   1c. #detail-content.innerHTML is set (non-empty string).
//
// Source — D3-PITCH-GRAPH.html L4132-4195 (showDetail).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. showDetail(node) should hide empty,
  //       show content, and populate innerHTML.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    // Seed a minimal node — showDetail reads n.name, n.id, etc.
    var node = { id: 'S1', name: 'FX Test', ntype: 'signal', status: 'amber', score: 65 };
    deps.setRichBodyOverride({}); // getRichBody returns {}
    fn(node);
    var snap = deps.getSnapshot();

    // 1a. detail-empty display should be 'none'.
    if (snap.detailEmptyDisplay !== 'none') {
      issues.push('F0 1a — #detail-empty display should be none, got ' + snap.detailEmptyDisplay);
    }

    // 1b. detail-content display should be 'block'.
    if (snap.detailContentDisplay !== 'block') {
      issues.push('F0 1b — #detail-content display should be block, got ' + snap.detailContentDisplay);
    }

    // 1c. detail-content innerHTML should be set.
    if (!snap.detailContentHTML || snap.detailContentHTML.length === 0) {
      issues.push('F0 1c — #detail-content innerHTML should be non-empty, got ' + JSON.stringify(snap.detailContentHTML));
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
