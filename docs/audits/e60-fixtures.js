// e60-fixtures.js — per-function probes for E60 unhighlightConnections
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values simulating a prior state (post-highlightConnections / post-selectNode
// call). The healthy mirror performs the reset operations and OVERWRITES the
// sentinel with the expected post-call value. The broken mutant drops an
// operation → sentinel survives → fixture reports issue → runner says
// PASS (BASELINE) or FAIL (REPAIRED).
//
// Topology (mirrors E59 + E58 for continuity):
//   Edges:    A-B, A-C, B-C
//   Labels:   A-B, A-C, B-C
//   Nodes:    A (was selected), B, C, D (isolated; not affected by selectNode
//             but always iterated by the restore loop)
//
//   Pre-call state (simulates a prior selectNode('A') call):
//     edges[0..2].style.opacity = '1'/'1'/'0.05'
//     edges[0..2].style.strokeWidth = '2.5'/'2.5'/'1'
//     labels[0..2].style.opacity = '0.85'/'0.85'/'0'
//     nodeGroups[A].classList ⊇ {'selected'}, opacity = '1'
//     nodeGroups[B,C,D].opacity = '0.15' (dimmed by selectNode)
//
//   Expected post-call state (healthy unhighlightConnections):
//     edges[0..2].style.opacity = '' / '' / ''
//     edges[0..2].style.strokeWidth = '' / '' / ''
//     labels[0..2].style.opacity = '0' / '0' / '0'  (always '0' — explicit reset)
//     nodeGroups[*].classList ∌ 'selected'
//     nodeGroups[*].style.opacity = '' / '' / '' / ''
//
// Fixtures (F0..F4):
//   F0 — healthy control: pre-seed with the prior-selectNode state. Verify
//        all 4 invariants: edges cleared, labels reset to '0', no .selected
//        on any node, all node opacities cleared.
//   F1 — dropInv1a (edge opacity + strokeWidth clear drop): all 3 edges
//        pre-seeded with sentinel STALE_EO/STALE_SW. Healthy overwrites
//        both fields with ''. T1 (drop 1a) leaves both at sentinel → 6
//        issues (3 edges × 2 properties).
//   F2 — dropInv1b (label opacity write drop): all 3 labels pre-seeded
//        with STALE_LO. Healthy writes '0' to each. T2 leaves all 3
//        at sentinel → 3 issues.
//   F3 — dropInv1c (.selected class clear drop): node A pre-seeded with
//        .selected class. Healthy removes from all nodes; T3 leaves A
//        with .selected → 1 issue.
//   F4 — dropInv1d (node opacity restore drop): all 4 nodes pre-seeded
//        with STALE_N. Healthy writes '' to each. T4 leaves all 4
//        at sentinel → 4 issues.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 invariant groups execute correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    // Pre-seed prior-selectNode state. Edge opacities '1','1','0.05'
    // (matches E58's expected post-selectNode state). Node opacities
    // '1','1','1','0.15' (A,B,C connected, D isolated). Node A has
    // .selected class.
    var ab = deps.getEdge(0);
    var bc = deps.getEdge(1);
    var ac = deps.getEdge(2);
    ab.style.opacity = '1';       ab.style.strokeWidth = '2.5';
    bc.style.opacity = '0.05';    bc.style.strokeWidth = '1';
    ac.style.opacity = '1';       ac.style.strokeWidth = '2.5';

    var lab = deps.getEdgeLabel(0);
    var lbc = deps.getEdgeLabel(1);
    var lac = deps.getEdgeLabel(2);
    lab.style.opacity = '0.85';
    lbc.style.opacity = '0';
    lac.style.opacity = '0.85';

    var nA = deps.getNodeGroup(0);
    var nB = deps.getNodeGroup(1);
    var nC = deps.getNodeGroup(2);
    var nD = deps.getNodeGroup(3);
    nA.classList.add('selected');
    nA.style.opacity = '1';
    nB.style.opacity = '1';
    nC.style.opacity = '1';
    nD.style.opacity = '0.15';

    renderFn();
    var issues = [];

    // 1a evidence: edges cleared
    if (ab.style.opacity !== '')      issues.push('F0 edge-opacity-clear violated — A-B expected "", got ' + JSON.stringify(ab.style.opacity));
    if (ac.style.opacity !== '')      issues.push('F0 edge-opacity-clear violated — A-C expected "", got ' + JSON.stringify(ac.style.opacity));
    if (bc.style.opacity !== '')      issues.push('F0 edge-opacity-clear violated — B-C expected "", got ' + JSON.stringify(bc.style.opacity));
    if (ab.style.strokeWidth !== '')  issues.push('F0 edge-strokeWidth-clear violated — A-B expected "", got ' + JSON.stringify(ab.style.strokeWidth));
    if (ac.style.strokeWidth !== '')  issues.push('F0 edge-strokeWidth-clear violated — A-C expected "", got ' + JSON.stringify(ac.style.strokeWidth));
    if (bc.style.strokeWidth !== '')  issues.push('F0 edge-strokeWidth-clear violated — B-C expected "", got ' + JSON.stringify(bc.style.strokeWidth));

    // 1b evidence: labels reset to '0'
    if (lab.style.opacity !== '0')   issues.push('F0 label-opacity-reset violated — A-B expected "0", got ' + JSON.stringify(lab.style.opacity));
    if (lac.style.opacity !== '0')   issues.push('F0 label-opacity-reset violated — A-C expected "0", got ' + JSON.stringify(lac.style.opacity));
    if (lbc.style.opacity !== '0')   issues.push('F0 label-opacity-reset violated — B-C expected "0", got ' + JSON.stringify(lbc.style.opacity));

    // 1c evidence: no node has .selected class
    if (nA.classList.contains('selected')) issues.push('F0 selection-clear violated — A.classList still contains "selected"');
    if (nB.classList.contains('selected')) issues.push('F0 selection-clear violated — B.classList still contains "selected"');
    if (nC.classList.contains('selected')) issues.push('F0 selection-clear violated — C.classList still contains "selected"');

    // 1d evidence: all node opacities cleared
    if (nA.style.opacity !== '') issues.push('F0 node-opacity-restore violated — A expected "", got ' + JSON.stringify(nA.style.opacity));
    if (nB.style.opacity !== '') issues.push('F0 node-opacity-restore violated — B expected "", got ' + JSON.stringify(nB.style.opacity));
    if (nC.style.opacity !== '') issues.push('F0 node-opacity-restore violated — C expected "", got ' + JSON.stringify(nC.style.opacity));
    if (nD.style.opacity !== '') issues.push('F0 node-opacity-restore violated — D expected "", got ' + JSON.stringify(nD.style.opacity));

    return issues;
  }

  // ============================================================
  // F1 — All 3 edges pre-seeded with STALE_EO + STALE_SW → T1 (drop 1a).
  // Healthy overwrites opacity='' and strokeWidth='' on every edge.
  // T1 leaves all 6 properties at sentinel → 6 issues.
  // ============================================================
  function runF1_edgeClearDropped(renderFn) {
    deps.resetEnv();
    var ab = deps.getEdge(0);
    var bc = deps.getEdge(1);
    var ac = deps.getEdge(2);
    ab.style.opacity = 'STALE_EO';      ab.style.strokeWidth = 'STALE_SW';
    bc.style.opacity = 'STALE_EO';      bc.style.strokeWidth = 'STALE_SW';
    ac.style.opacity = 'STALE_EO';      ac.style.strokeWidth = 'STALE_SW';
    // Need a .node-group.selected so the conditional branch (1c/1d) runs
    // and the function returns the full unhighlight behaviour. T1 only
    // drops 1a so 1c/1d must still execute.
    deps.getNodeGroup(0).classList.add('selected');
    renderFn();
    var issues = [];
    if (ab.style.opacity !== '')      issues.push('F1 edge-clear violated — A-B opacity expected "", got ' + JSON.stringify(ab.style.opacity) + ' (edge clear dropped — T1)');
    if (ac.style.opacity !== '')      issues.push('F1 edge-clear violated — A-C opacity expected "", got ' + JSON.stringify(ac.style.opacity) + ' (edge clear dropped — T1)');
    if (bc.style.opacity !== '')      issues.push('F1 edge-clear violated — B-C opacity expected "", got ' + JSON.stringify(bc.style.opacity) + ' (edge clear dropped — T1)');
    if (ab.style.strokeWidth !== '')  issues.push('F1 edge-clear violated — A-B strokeWidth expected "", got ' + JSON.stringify(ab.style.strokeWidth) + ' (edge clear dropped — T1)');
    if (ac.style.strokeWidth !== '')  issues.push('F1 edge-clear violated — A-C strokeWidth expected "", got ' + JSON.stringify(ac.style.strokeWidth) + ' (edge clear dropped — T1)');
    if (bc.style.strokeWidth !== '')  issues.push('F1 edge-clear violated — B-C strokeWidth expected "", got ' + JSON.stringify(bc.style.strokeWidth) + ' (edge clear dropped — T1)');
    return issues;
  }

  // ============================================================
  // F2 — All 3 labels pre-seeded with STALE_LO → T2 (drop 1b).
  // Healthy writes '0' to each label. T2 leaves all 3 at sentinel → 3
  // issues.
  // ============================================================
  function runF2_labelOpacityDropped(renderFn) {
    deps.resetEnv();
    var lab = deps.getEdgeLabel(0);
    var lbc = deps.getEdgeLabel(1);
    var lac = deps.getEdgeLabel(2);
    lab.style.opacity = 'STALE_LO';
    lbc.style.opacity = 'STALE_LO';
    lac.style.opacity = 'STALE_LO';
    deps.getNodeGroup(0).classList.add('selected');
    renderFn();
    var issues = [];
    if (lab.style.opacity !== '0')   issues.push('F2 label-opacity-reset violated — A-B expected "0", got ' + JSON.stringify(lab.style.opacity) + ' (label opacity write dropped — T2)');
    if (lac.style.opacity !== '0')   issues.push('F2 label-opacity-reset violated — A-C expected "0", got ' + JSON.stringify(lac.style.opacity) + ' (label opacity write dropped — T2)');
    if (lbc.style.opacity !== '0')   issues.push('F2 label-opacity-reset violated — B-C expected "0", got ' + JSON.stringify(lbc.style.opacity) + ' (label opacity write dropped — T2)');
    return issues;
  }

  // ============================================================
  // F3 — Node A pre-seeded with .selected class → T3 (drop 1c).
  // Healthy removes .selected from all nodes. T3 leaves A's class
  // alone → 1 issue.
  // ============================================================
  function runF3_selectionClassNotCleared(renderFn) {
    deps.resetEnv();
    var nA = deps.getNodeGroup(0);
    nA.classList.add('selected');
    renderFn();
    var issues = [];
    if (nA.classList.contains('selected')) {
      issues.push('F3 selection-clear violated — A.classList still contains "selected" (selection class clear dropped — T3)');
    }
    return issues;
  }

  // ============================================================
  // F4 — All 4 nodes pre-seeded with STALE_N → T4 (drop 1d).
  // Healthy writes '' to each. T4 leaves all 4 at sentinel → 4 issues.
  // ============================================================
  function runF4_nodeOpacityNotRestored(renderFn) {
    deps.resetEnv();
    var nA = deps.getNodeGroup(0);
    var nB = deps.getNodeGroup(1);
    var nC = deps.getNodeGroup(2);
    var nD = deps.getNodeGroup(3);
    nA.style.opacity = 'STALE_N';
    nB.style.opacity = 'STALE_N';
    nC.style.opacity = 'STALE_N';
    nD.style.opacity = 'STALE_N';
    nA.classList.add('selected');  // ensure conditional branch runs
    renderFn();
    var issues = [];
    if (nA.style.opacity !== '') issues.push('F4 node-opacity-restore violated — A expected "", got ' + JSON.stringify(nA.style.opacity) + ' (node opacity restore dropped — T4)');
    if (nB.style.opacity !== '') issues.push('F4 node-opacity-restore violated — B expected "", got ' + JSON.stringify(nB.style.opacity) + ' (node opacity restore dropped — T4)');
    if (nC.style.opacity !== '') issues.push('F4 node-opacity-restore violated — C expected "", got ' + JSON.stringify(nC.style.opacity) + ' (node opacity restore dropped — T4)');
    if (nD.style.opacity !== '') issues.push('F4 node-opacity-restore violated — D expected "", got ' + JSON.stringify(nD.style.opacity) + ' (node opacity restore dropped — T4)');
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                 target_id: null },
    { id: 'F1', fn: runF1_edgeClearDropped,               target_id: 'T1' },
    { id: 'F2', fn: runF2_labelOpacityDropped,            target_id: 'T2' },
    { id: 'F3', fn: runF3_selectionClassNotCleared,       target_id: 'T3' },
    { id: 'F4', fn: runF4_nodeOpacityNotRestored,         target_id: 'T4' }
  ];
};
