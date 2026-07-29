// e96-fixtures.js — per-function probes for E96 onSearch
//
// onSearch(query) filters nodes by search query.
// Invariants:
//   1a. With query.length >= 2, matching nodes get opacity '1'.
//   1b. With query.length >= 2, non-matching nodes get opacity '0.2'.
//   1c. With query.length < 2, no changes to opacity.
//
// Source — D3-PITCH-GRAPH.html L4020-4030 (onSearch).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. onSearch('S1') should highlight matching nodes.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    // Pre-seed 3 node-groups: S1 matches, S2 doesn't
    deps.seedNodes([
      { id: 'S1', label: 'FX Signal', opacity: null },
      { id: 'S2', label: 'Lithium Price', opacity: null },
      { id: 'S3', label: 'BNDES Subsidy', opacity: null }
    ]);

    fn('S1');  // Query matches 'S1' by id
    var snap = deps.getSnapshot();

    // 1a. S1 should have opacity '1'.
    if (snap.nodeOpacity_S1 !== '1') {
      issues.push('F0 1a — S1 opacity should be 1, got ' + JSON.stringify(snap.nodeOpacity_S1));
    }

    // 1b. S2 and S3 should have opacity '0.2'.
    if (snap.nodeOpacity_S2 !== '0.2') {
      issues.push('F0 1b — S2 opacity should be 0.2, got ' + JSON.stringify(snap.nodeOpacity_S2));
    }
    if (snap.nodeOpacity_S3 !== '0.2') {
      issues.push('F0 1b — S3 opacity should be 0.2, got ' + JSON.stringify(snap.nodeOpacity_S3));
    }

    return issues;
  }

  // ============================================================
  // F1 — query too short (< 2 chars), should not change opacity.
  // ============================================================
  function runF1_shortQuery(fn) {
    var issues = [];

    deps.resetEnv();
    deps.seedNodes([
      { id: 'S1', label: 'FX Signal', opacity: '1' },
      { id: 'S2', label: 'Lithium Price', opacity: '1' }
    ]);

    fn('S');  // Only 1 char — below threshold
    var snap = deps.getSnapshot();

    // 1c. With query < 2 chars, opacities should be unchanged ('1' each).
    if (snap.nodeOpacity_S1 !== '1') {
      issues.push('F1 1c — S1 opacity should remain 1 for short query, got ' + JSON.stringify(snap.nodeOpacity_S1));
    }
    if (snap.nodeOpacity_S2 !== '1') {
      issues.push('F1 1c — S2 opacity should remain 1 for short query, got ' + JSON.stringify(snap.nodeOpacity_S2));
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null },
    { id: 'F1', fn: runF1_shortQuery, target_id: null }
  ];
};
