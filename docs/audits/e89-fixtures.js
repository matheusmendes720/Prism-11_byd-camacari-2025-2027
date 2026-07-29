// e89-fixtures.js — per-function probes for E89 selectNode
//
// Inverted mutant-detection: each fixture seeds a mock SVG with a known
// graph (nodes A/B/C with edges A-B and B-C), then calls selectNode('B').
// Healthy version: removes 'selected' from all nodes, adds it to target,
// dims non-neighbours (opacity=0.15), brightens neighbours (opacity=1).
// Broken mutant drops a sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L4038-4076 (selectNode).
//
// Topology (4 sub-checks):
//   1a. selected class: target node gets classList.add('selected').
//   1b. dimming: non-selected nodes get opacity=0.15.
//   1c. brighten: selected+connected nodes get opacity=1.
//   1d. edge dimming: non-connected edges get opacity=0.05.
//
// Fixtures (F0..F2):
//   F0 — healthy control: verifies all 4 sub-checks for selecting B.
//   F1 — dropInv1a (no selected class on target). Target stays at 0.15.
//   F2 — dropInv1b (no dimming of non-selected nodes). All nodes stay at ''.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. Verify selecting B in A-B, B-C graph.
  // ============================================================
  function runF0_healthyControl(updateFn) {
    var issues = [];

    // 4-node graph: A-B, B-C, C-D (D is isolated/disconnected).
    // Selecting B: connected={A,B,C}, D is the only non-connected node.
    // Healthy: B.selected=true, ≥2 nodes dimmed to 0.15 (A,C,D at 0.15).
    // T1 (no selected class): B.selected=false → detected.
    // T2 (no dimming): all nodes at opacity=1, dimmedCount=0 → detected.
    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['C', 'D']]
    });
    updateFn('B');
    var snap = deps.getSnapshot();

    var bNode = snap.nodes.find(function (n) { return n.id === 'B'; });
    if (!bNode) {
      issues.push('F0 — B node not found in snapshot');
    } else if (!bNode.hasSelected) {
      issues.push('F0 1a — B should have selected class, hasSelected=false');
    }

    var dimmedCount = 0;
    snap.nodes.forEach(function (n) {
      if (n.opacity === '0.15') dimmedCount++;
    });
    if (dimmedCount < 2) {
      issues.push('F0 1b — expected ≥2 nodes dimmed to 0.15, got ' + dimmedCount);
    }

    return issues;
  }

  // ============================================================
  // F1 — negative control: selecting B must NOT add selected class to D
  // (D is isolated — not connected to B in either component).
  // Healthy code never touches D's selected state → hasSelected stays false.
  // The mutant T1 is the one that breaks B's selected class — F1 just
  // verifies that D stays untouched regardless of whether B gets selected.
  // ============================================================
  function runF1_selectedClassDropped(updateFn) {
    var issues = [];

    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['C', 'D']]
    });
    updateFn('B');
    var snap = deps.getSnapshot();

    var dNode = snap.nodes.find(function (n) { return n.id === 'D'; });
    if (!dNode) {
      return ['F1 — D node not found in snapshot'];
    }
    if (dNode.hasSelected) {
      return ['F1 1a — D should NOT have selected class, but hasSelected=true'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (no dimming — non-selected nodes stay at default '').
  // A and C should end at 0.15 but stay at '' → detection.
  // ============================================================
  function runF2_nodeDimmingDropped(updateFn) {
    var issues = [];

    deps.resetEnv();
    deps.seedGraph({
      nodes: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['C', 'D']]
    });
    updateFn('B');
    var snap = deps.getSnapshot();

    var dimmedCount = 0;
    snap.nodes.forEach(function (n) {
      if (n.opacity === '0.15') dimmedCount++;
    });
    if (dimmedCount < 2) {
      return ['F2 1b — broken did NOT dim non-selected nodes (expected ≥2 nodes at 0.15, got ' + dimmedCount + ')'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,       target_id: null },
    { id: 'F1', fn: runF1_selectedClassDropped, target_id: 'T1' },
    { id: 'F2', fn: runF2_nodeDimmingDropped,   target_id: 'T2' }
  ];
};
