// e58-fixtures.js — per-function probes for E58 selectNode
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operation and OVERWRITES the
// sentinel. The broken mutant drops the operation → sentinel survives
// → fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// Topology:
//   Nodes: A (selected), B, C, D (isolated)
//   Edges: A-B, B-C, A-C
//   Selecting A → connected = {A, B, C}; D is not connected → opacity 0.15.
//   Edge opacities: A-B, A-C connected → '1'; B-C shared (only via A or C
//   but src=B/dst=C, neither equals A, so for selectNode(A) the predicate
//   is (src===A || dst===A) which fails for B-C) → '0.05'.
//
// Fixtures (F0..F4):
//   F0 — healthy control: A.classList contains 'selected'; B,C connected →
//        opacity '1'; D isolated → '0.15'; edge A-B,A-C opacity '1';
//        B-C opacity '0.05'; showDetail called once with A.
//   F1 — F1a evidence: B pre-seeded with class 'selected' (a stale selection
//        from a prior click). Healthy clears all .selected then adds to A
//        only → B's class no longer contains 'selected' AND A's class
//        contains 'selected'. T1 (drop 1a) doesn't clear/add → B still
//        has 'selected' AND A doesn't → 2 issues.
//   F2 — Connected set build: A,B,C pre-seeded with opacity='OLD_CONN'.
//        D pre-seeded opacity='OLD_ISO'. Healthy writes '1' to A,B,C and
//        '0.15' to D. T2 (drop 1b — connected set always = {nodeId}) →
//        only A gets '1', B and C get '0.15' (not connected) and D also
//        gets '0.15'. The 1a 'OLD_CONN' on B and C survives, and D's
//        'OLD_ISO' gets overwritten with '0.15' (which the fixture accepts,
//        but B and C issues raise 2).
//   F3 — Node opacity write: A,B,C,D all pre-seeded with opacity='STALE_N'.
//        Healthy writes '1' to A,B,C and '0.15' to D. T3 (drop 1c) leaves
//        all four with 'STALE_N' → 4 issues.
//   F4 — Edge opacity write: A-B, A-C, B-C pre-seeded with
//        opacity='STALE_E'. Healthy writes '1' to A-B,A-C and '0.05' to
//        B-C. T4 (drop 1d) leaves all three with 'STALE_E' → 3 issues.
//   (NOTE: the detail panel delegation (showDetail) is exercised by F0
//    as a wiring smoke; the 4 invariants above are the actual SUT.)
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 op groups perform correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    // Set nodesRendered so showDetail delegation fires.
    deps.setNodesRendered([{ id: 'A', name: 'Node A' }]);
    renderFn();
    var issues = [];

    // 1a evidence: A has .selected
    var a = deps.getNodeGroup(0);
    if (!a.classList.contains('selected')) {
      issues.push('F0 selection-add violated — expected A.classList to contain "selected"');
    }

    // 1c evidence: A,B,C opacity '1'; D opacity '0.15'
    var b = deps.getNodeGroup(1);
    var c = deps.getNodeGroup(2);
    var d = deps.getNodeGroup(3);
    if (a.style.opacity !== '1')    issues.push('F0 node-opacity (A connected) violated — expected "1", got ' + JSON.stringify(a.style.opacity));
    if (b.style.opacity !== '1')    issues.push('F0 node-opacity (B connected via A-B) violated — expected "1", got ' + JSON.stringify(b.style.opacity));
    if (c.style.opacity !== '1')    issues.push('F0 node-opacity (C connected via A-C) violated — expected "1", got ' + JSON.stringify(c.style.opacity));
    if (d.style.opacity !== '0.15') issues.push('F0 node-opacity (D isolated) violated — expected "0.15", got ' + JSON.stringify(d.style.opacity));

    // 1d evidence: A-B, A-C opacity '1'; B-C opacity '0.05' (B-C is not
    // incident to A)
    var ab = deps.getEdge(0);
    var bc = deps.getEdge(1);
    var ac = deps.getEdge(2);
    if (ab.style.opacity !== '1')   issues.push('F0 edge-opacity (A-B connected) violated — expected "1", got ' + JSON.stringify(ab.style.opacity));
    if (ac.style.opacity !== '1')   issues.push('F0 edge-opacity (A-C connected) violated — expected "1", got ' + JSON.stringify(ac.style.opacity));
    if (bc.style.opacity !== '0.05') issues.push('F0 edge-opacity (B-C not incident to A) violated — expected "0.05", got ' + JSON.stringify(bc.style.opacity));

    // Wiring smoke: showDetail called once with A
    if (deps.getShowDetailCallCount() !== 1) {
      issues.push('F0 showDetail-wiring violated — expected callCount=1, got ' + JSON.stringify(deps.getShowDetailCallCount()));
    }
    var last = deps.getLastShowDetailNode();
    if (!last || last.id !== 'A') {
      issues.push('F0 showDetail-target violated — expected last node id="A", got ' + JSON.stringify(last && last.id));
    }
    return issues;
  }

  // ============================================================
  // F1 — B pre-seeded with class 'selected' → T1 (drop 1a)
  // Healthy clears all .selected then adds to A only. Broken T1 leaves
  // B's class alone AND never adds to A. Detection: B's class still has
  // 'selected' AND A's class doesn't.
  // ============================================================
  function runF1_selectionCycleDropped(renderFn) {
    deps.resetEnv();
    var a = deps.getNodeGroup(0);
    var b = deps.getNodeGroup(1);
    // Simulate prior selection: B had .selected. Healthy should clear it.
    b.classList.add('selected');
    renderFn();
    var issues = [];
    if (b.classList.contains('selected')) {
      issues.push('F1 selection-clear violated — expected B.classList to NOT contain "selected" (cleared by selectNode), but it still does (selection cycle dropped — T1)');
    }
    if (!a.classList.contains('selected')) {
      issues.push('F1 selection-add violated — expected A.classList to contain "selected" (added by selectNode), but it does not (selection cycle dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — Connected set build: A,B,C pre-seeded opacity 'OLD_CONN',
  // D pre-seeded 'OLD_ISO'. T1 only iterates connected={A} so only A
  // gets overwritten; B,C,D retain sentinels. T2 (drop 1b) connected
  // set stays {A} → B,C,D's pre-seeded values remain (or D gets 0.15
  // from 1c; either way B and C retain OLD_CONN).
  //
  // We rely on 1c still running, so:
  //   - A: written '1' by both healthy and T2 (T2's 1c iterates with
  //     connected={A}, so A gets '1' anyway — passes)
  //   - B: healthy writes '1'; T2 writes '0.15' but pre-seeded is
  //     'OLD_CONN' which gets overwritten to '0.15'. Wait — pre-seeded
  //     'OLD_CONN' is overwritten by T2's 1c → '0.15' (not OLD_CONN).
  //     We need to detect T2 via a different sentinel strategy.
  //
  // Better: pre-seed B,C with '1' (the expected healthy value). T2 with
  // connected={A} writes '0.15' to B,C (since not in connected). Healthy
  // leaves '1'. Detection: B,C expected '1', got '0.15' → 2 issues.
  // D: pre-seed '0.15' (expected). Both healthy and T2 write '0.15'.
  //   Indistinguishable — but T2 already raises 2 issues from B,C.
  // ============================================================
  function runF2_connectedSetMissing(renderFn) {
    deps.resetEnv();
    var a = deps.getNodeGroup(0);
    var b = deps.getNodeGroup(1);
    var c = deps.getNodeGroup(2);
    var d = deps.getNodeGroup(3);
    a.style.opacity = '1';
    b.style.opacity = '1';     // pre-seed expected healthy value
    c.style.opacity = '1';     // pre-seed expected healthy value
    d.style.opacity = '0.15';
    renderFn();
    var issues = [];
    if (b.style.opacity !== '1') {
      issues.push('F2 connected-set violated — B (connected via A-B) expected "1", got ' + JSON.stringify(b.style.opacity) + ' (connected set build dropped — T2)');
    }
    if (c.style.opacity !== '1') {
      issues.push('F2 connected-set violated — C (connected via A-C) expected "1", got ' + JSON.stringify(c.style.opacity) + ' (connected set build dropped — T2)');
    }
    return issues;
  }

  // ============================================================
  // F3 — Node opacity write: A,B,C,D all pre-seeded 'STALE_N' → T3 (drop 1c).
  // Healthy writes '1' to A,B,C and '0.15' to D. T3 leaves all four
  // with 'STALE_N' → 4 issues.
  // ============================================================
  function runF3_nodeOpacityNotWritten(renderFn) {
    deps.resetEnv();
    var a = deps.getNodeGroup(0);
    var b = deps.getNodeGroup(1);
    var c = deps.getNodeGroup(2);
    var d = deps.getNodeGroup(3);
    a.style.opacity = 'STALE_N';
    b.style.opacity = 'STALE_N';
    c.style.opacity = 'STALE_N';
    d.style.opacity = 'STALE_N';
    renderFn();
    var issues = [];
    if (a.style.opacity !== '1')    issues.push('F3 node-opacity-write violated — A expected "1", got ' + JSON.stringify(a.style.opacity) + ' (node opacity write dropped — T3)');
    if (b.style.opacity !== '1')    issues.push('F3 node-opacity-write violated — B expected "1", got ' + JSON.stringify(b.style.opacity) + ' (node opacity write dropped — T3)');
    if (c.style.opacity !== '1')    issues.push('F3 node-opacity-write violated — C expected "1", got ' + JSON.stringify(c.style.opacity) + ' (node opacity write dropped — T3)');
    if (d.style.opacity !== '0.15') issues.push('F3 node-opacity-write violated — D expected "0.15", got ' + JSON.stringify(d.style.opacity) + ' (node opacity write dropped — T3)');
    return issues;
  }

  // ============================================================
  // F4 — Edge opacity write: A-B, A-C, B-C pre-seeded 'STALE_E' → T4 (drop 1d).
  // Healthy writes '1' to A-B,A-C and '0.05' to B-C. T4 leaves all three
  // with 'STALE_E' → 3 issues.
  // ============================================================
  function runF4_edgeOpacityNotWritten(renderFn) {
    deps.resetEnv();
    var ab = deps.getEdge(0);
    var bc = deps.getEdge(1);
    var ac = deps.getEdge(2);
    ab.style.opacity = 'STALE_E';
    bc.style.opacity = 'STALE_E';
    ac.style.opacity = 'STALE_E';
    renderFn();
    var issues = [];
    if (ab.style.opacity !== '1')   issues.push('F4 edge-opacity-write violated — A-B expected "1", got ' + JSON.stringify(ab.style.opacity) + ' (edge opacity write dropped — T4)');
    if (ac.style.opacity !== '1')   issues.push('F4 edge-opacity-write violated — A-C expected "1", got ' + JSON.stringify(ac.style.opacity) + ' (edge opacity write dropped — T4)');
    if (bc.style.opacity !== '0.05') issues.push('F4 edge-opacity-write violated — B-C (not incident to A) expected "0.05", got ' + JSON.stringify(bc.style.opacity) + ' (edge opacity write dropped — T4)');
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,             target_id: null },
    { id: 'F1', fn: runF1_selectionCycleDropped,      target_id: 'T1' },
    { id: 'F2', fn: runF2_connectedSetMissing,        target_id: 'T2' },
    { id: 'F3', fn: runF3_nodeOpacityNotWritten,      target_id: 'T3' },
    { id: 'F4', fn: runF4_edgeOpacityNotWritten,      target_id: 'T4' }
  ];
};
