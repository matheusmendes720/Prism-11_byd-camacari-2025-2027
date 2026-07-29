// e90-fixtures.js — per-function probes for E90 highlightConnections
//
// Inverted mutant-detection: fixture seeds a mock SVG with a known graph
// (A-B, B-C, C-D), calls highlightConnections('B'). Healthy version:
// connected edges (A-B, B-C) get strokeWidth=2.5, opacity=1, label opacity=0.85;
// disconnected edge (C-D) gets strokeWidth=1, opacity=0.15, label opacity=0.
// Broken mutant drops a sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L4079-4101 (highlightConnections).
//
// Sub-checks:
//   1a. strokeWidth: connected edges get '2.5', disconnected get '1'.
//   1b. edge opacity: connected edges get '1', disconnected get '0.15'.
//   1c. edge-label opacity: connected edges get '0.85', disconnected get '0'.
//
// Fixtures (F0):
//   F0 — healthy control: verify all 3 sub-checks for highlightConnections('B').

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. Verify highlightConnections('B') in
  //       A-B, B-C, C-D graph (B connected to A+B, disconnected from C+D).
  // ============================================================
  function runF0_healthyControl(hlFn) {
    var issues = [];

    // 4-node graph: A-B, B-C, C-D (D is isolated from B).
    // highlightConnections('B'): A-B and B-C are lit, C-D is dim.
    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['B', 'C'], ['C', 'D']]
    });
    hlFn('B');
    var snap = deps.getSnapshot();

    // 1a. strokeWidth: A-B and B-C should be '2.5', C-D should be '1'.
    var abEdge = snap.edges.find(function (e) { return e.from === 'A' && e.to === 'B'; });
    var bcEdge = snap.edges.find(function (e) { return e.from === 'B' && e.to === 'C'; });
    var cdEdge = snap.edges.find(function (e) { return e.from === 'C' && e.to === 'D'; });

    if (!abEdge) { issues.push('F0 — A-B edge not found'); }
    else if (abEdge.strokeWidth !== '2.5') { issues.push('F0 1a — A-B strokeWidth should be 2.5, got ' + abEdge.strokeWidth); }

    if (!bcEdge) { issues.push('F0 — B-C edge not found'); }
    else if (bcEdge.strokeWidth !== '2.5') { issues.push('F0 1a — B-C strokeWidth should be 2.5, got ' + bcEdge.strokeWidth); }

    if (!cdEdge) { issues.push('F0 — C-D edge not found'); }
    else if (cdEdge.strokeWidth !== '1') { issues.push('F0 1a — C-D strokeWidth should be 1, got ' + cdEdge.strokeWidth); }

    // 1b. edge opacity: A-B, B-C → '1', C-D → '0.15'.
    if (abEdge && abEdge.opacity !== '1') { issues.push('F0 1b — A-B opacity should be 1, got ' + abEdge.opacity); }
    if (bcEdge && bcEdge.opacity !== '1') { issues.push('F0 1b — B-C opacity should be 1, got ' + bcEdge.opacity); }
    if (cdEdge && cdEdge.opacity !== '0.15') { issues.push('F0 1b — C-D opacity should be 0.15, got ' + cdEdge.opacity); }

    // 1c. edge-label opacity: A-B, B-C → '0.85', C-D → '0'.
    if (abEdge && abEdge.labelOpacity !== '0.85') { issues.push('F0 1c — A-B labelOpacity should be 0.85, got ' + abEdge.labelOpacity); }
    if (bcEdge && bcEdge.labelOpacity !== '0.85') { issues.push('F0 1c — B-C labelOpacity should be 0.85, got ' + bcEdge.labelOpacity); }
    if (cdEdge && cdEdge.labelOpacity !== '0') { issues.push('F0 1c — C-D labelOpacity should be 0, got ' + cdEdge.labelOpacity); }

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
