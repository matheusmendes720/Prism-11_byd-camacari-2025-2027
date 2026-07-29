// e91-fixtures.js — per-function probes for E91 unhighlightConnections
//
// Inverted mutant-detection: fixture seeds a mock SVG with a known graph
// (A-B, B-C, C-D), calls highlightConnections('B') then unhighlightConnections().
// Healthy: after highlightConnections('B'), lit edges have strokeWidth=2.5,
// labelOpacity=0.85. After unhighlightConnections(), ALL edges have
// strokeWidth='', opacity='', labelOpacity='0'. Broken mutant drops a
// sub-check in unhighlightConnections → sentinel state preserved → detection.
//
// Source — D3-PITCH-GRAPH.html L4104-4127 (unhighlightConnections).
//
// Sub-checks (all reset by unhighlightConnections):
//   1a. strokeWidth: '' for all edges.
//   1b. edge opacity: '' for all edges.
//   1c. edge-label opacity: '0' for all labels.
//   1d. node selected class: removed from all .node-group.
//
// Fixtures (F0..F1):
//   F0 — healthy control: verify all 4 sub-checks after hl→unhl sequence.
//   F1 — dropStrokeWidth mutant: strokeWidth stays at '2.5' after unhl.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. After highlightConnections('B') then
  //       unhighlightConnections(), all edges should be reset.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    // 3-edge graph: A-B, B-C, C-D.
    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['B', 'C'], ['C', 'D']],
      seedNodeSelected: 'B'  // pre-select B so unhighlightConnections has something to clean up
    });

    // Simulate the full hover sequence: highlight → unhighlight.
    deps.highlightConnections('B');
    fn(); // unhighlightConnections
    var snap = deps.getSnapshot();

    // 1a. strokeWidth: '' for all edges.
    snap.edges.forEach(function (e) {
      if (e.strokeWidth !== '') {
        issues.push('F0 1a — ' + e.from + '-' + e.to + ' strokeWidth should be empty, got ' + e.strokeWidth);
      }
    });

    // 1b. edge opacity: '' for all edges.
    snap.edges.forEach(function (e) {
      if (e.opacity !== '') {
        issues.push('F0 1b — ' + e.from + '-' + e.to + ' opacity should be empty, got ' + e.opacity);
      }
    });

    // 1c. edge-label opacity: '0' for all labels.
    snap.edges.forEach(function (e) {
      if (e.labelOpacity !== '0') {
        issues.push('F0 1c — ' + e.from + '-' + e.to + ' labelOpacity should be 0, got ' + e.labelOpacity);
      }
    });

    // 1d. node selected class: removed from all.
    snap.nodes.forEach(function (n) {
      if (n.hasSelected) {
        issues.push('F0 1d — node ' + n.id + ' should NOT have selected class, but hasSelected=true');
      }
    });

    return issues;
  }

  // ============================================================
  // F1 — dropStrokeWidth mutant: unhighlightConnections does NOT
  // reset strokeWidth. Lit edges (A-B, B-C) stay at strokeWidth='2.5'.
  // ============================================================
  function runF1_dropStrokeWidth(fn) {
    var issues = [];

    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['B', 'C'], ['C', 'D']],
      seedNodeSelected: 'B'
    });

    deps.highlightConnections('B');
    fn(); // unhighlightConnections (broken — drops strokeWidth reset)
    var snap = deps.getSnapshot();

    // A-B and B-C should be '' but mutant leaves them at '2.5'.
    var abEdge = snap.edges.find(function (e) { return e.from === 'A' && e.to === 'B'; });
    var bcEdge = snap.edges.find(function (e) { return e.from === 'B' && e.to === 'C'; });

    if (abEdge && abEdge.strokeWidth === '2.5') {
      issues.push('F1 1a — A-B strokeWidth should NOT be 2.5 (mutant preserved sentinel), got ' + abEdge.strokeWidth);
    }
    if (bcEdge && bcEdge.strokeWidth === '2.5') {
      issues.push('F1 1a — B-C strokeWidth should NOT be 2.5 (mutant preserved sentinel), got ' + bcEdge.strokeWidth);
    }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,      target_id: null },
    { id: 'F1', fn: runF1_dropStrokeWidth, target_id: 'T1', control_skip: true }
  ];
};
