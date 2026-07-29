// e59-fixtures.js — per-function probes for E59 highlightConnections
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operation and OVERWRITES the
// sentinel with the expected post-call value. The broken mutant drops the
// operation → sentinel survives → fixture reports issue → runner says
// PASS (BASELINE) or FAIL (REPAIRED).
//
// Topology (mirrored from E58 for continuity):
//   Edges:    A-B (connected), A-C (connected), B-C (not connected)
//   Labels:   A-B (connected), A-C (connected), B-C (not connected)
//   nodeId = 'A' → lit = (src===A || dst===A).
//   Connected edges/labels: opacity '1' / '0.85', strokeWidth '2.5'.
//   Unconnected:             opacity '0.15' / '0', strokeWidth '1'.
//
// Fixtures (F0..F4):
//   F0 — healthy control: NO pre-seed. Check final state matches the
//        expected post-call values for A-B, A-C (connected) and B-C
//        (not connected) on edge.opacity, edge.strokeWidth, label.opacity.
//   F1 — predicate broken (lit = false default): connected edges A-B, A-C
//        pre-seeded opacity = 'STALE_LIT'. Healthy overwrites to '1'. T1
//        (drop 1a → lit always false) writes '0.15' to both → 2 issues.
//   F2 — edge opacity write drop: all 3 edges pre-seeded
//        opacity = 'STALE_EO'. Healthy overwrites to '1', '1', '0.15'.
//        T2 (drop 1b) leaves all three at 'STALE_EO' → 3 issues.
//   F3 — edge strokeWidth write drop: all 3 edges pre-seeded
//        strokeWidth = 'STALE_SW'. Healthy overwrites to '2.5', '2.5', '1'.
//        T3 (drop 1c) leaves all three at 'STALE_SW' → 3 issues.
//   F4 — edge-label opacity write drop: all 3 labels pre-seeded
//        opacity = 'STALE_LO'. Healthy overwrites to '0.85', '0.85', '0'.
//        T4 (drop 1d) leaves all three at 'STALE_LO' → 3 issues.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 op groups perform correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];

    // Edge opacity
    var ab = deps.getEdge(0);
    var ac = deps.getEdge(1);
    var bc = deps.getEdge(2);
    if (ab.style.opacity !== '1')   issues.push('F0 edge-opacity (A-B connected) violated — expected "1", got ' + JSON.stringify(ab.style.opacity));
    if (ac.style.opacity !== '1')   issues.push('F0 edge-opacity (A-C connected) violated — expected "1", got ' + JSON.stringify(ac.style.opacity));
    if (bc.style.opacity !== '0.15') issues.push('F0 edge-opacity (B-C not connected) violated — expected "0.15", got ' + JSON.stringify(bc.style.opacity));

    // Edge strokeWidth
    if (ab.style.strokeWidth !== '2.5') issues.push('F0 edge-strokeWidth (A-B) violated — expected "2.5", got ' + JSON.stringify(ab.style.strokeWidth));
    if (ac.style.strokeWidth !== '2.5') issues.push('F0 edge-strokeWidth (A-C) violated — expected "2.5", got ' + JSON.stringify(ac.style.strokeWidth));
    if (bc.style.strokeWidth !== '1')   issues.push('F0 edge-strokeWidth (B-C) violated — expected "1", got ' + JSON.stringify(bc.style.strokeWidth));

    // Edge-label opacity
    var lab = deps.getEdgeLabel(0);
    var lac = deps.getEdgeLabel(1);
    var lbc = deps.getEdgeLabel(2);
    if (lab.style.opacity !== '0.85') issues.push('F0 label-opacity (A-B connected) violated — expected "0.85", got ' + JSON.stringify(lab.style.opacity));
    if (lac.style.opacity !== '0.85') issues.push('F0 label-opacity (A-C connected) violated — expected "0.85", got ' + JSON.stringify(lac.style.opacity));
    if (lbc.style.opacity !== '0')    issues.push('F0 label-opacity (B-C not connected) violated — expected "0", got ' + JSON.stringify(lbc.style.opacity));

    return issues;
  }

  // ============================================================
  // F1 — Connected-edge A-B, A-C pre-seeded opacity='STALE_LIT' → T1 (drop 1a).
  // With predicate dropped (lit always false), A-B and A-C write '0.15'
  // instead of '1'. Detection: 2 issues.
  // ============================================================
  function runF1_predicateBroken(renderFn) {
    deps.resetEnv();
    var ab = deps.getEdge(0);
    var ac = deps.getEdge(1);
    ab.style.opacity = 'STALE_LIT';
    ac.style.opacity = 'STALE_LIT';
    renderFn();
    var issues = [];
    if (ab.style.opacity !== '1') {
      issues.push('F1 predicate-violated — A-B (connected edge) expected "1", got ' + JSON.stringify(ab.style.opacity) + ' (lit predicate dropped — T1)');
    }
    if (ac.style.opacity !== '1') {
      issues.push('F1 predicate-violated — A-C (connected edge) expected "1", got ' + JSON.stringify(ac.style.opacity) + ' (lit predicate dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — All 3 edges pre-seeded opacity='STALE_EO' → T2 (drop 1b).
  // Healthy overwrites to '1' (A-B, A-C) and '0.15' (B-C).
  // T2 leaves all three at 'STALE_EO' → 3 issues.
  // ============================================================
  function runF2_edgeOpacityDropped(renderFn) {
    deps.resetEnv();
    var ab = deps.getEdge(0);
    var ac = deps.getEdge(1);
    var bc = deps.getEdge(2);
    ab.style.opacity = 'STALE_EO';
    ac.style.opacity = 'STALE_EO';
    bc.style.opacity = 'STALE_EO';
    renderFn();
    var issues = [];
    if (ab.style.opacity !== '1')   issues.push('F2 edge-opacity-write violated — A-B expected "1", got ' + JSON.stringify(ab.style.opacity) + ' (edge opacity write dropped — T2)');
    if (ac.style.opacity !== '1')   issues.push('F2 edge-opacity-write violated — A-C expected "1", got ' + JSON.stringify(ac.style.opacity) + ' (edge opacity write dropped — T2)');
    if (bc.style.opacity !== '0.15') issues.push('F2 edge-opacity-write violated — B-C expected "0.15", got ' + JSON.stringify(bc.style.opacity) + ' (edge opacity write dropped — T2)');
    return issues;
  }

  // ============================================================
  // F3 — All 3 edges pre-seeded strokeWidth='STALE_SW' → T3 (drop 1c).
  // Healthy writes '2.5' (A-B, A-C) and '1' (B-C).
  // T3 leaves all three at 'STALE_SW' → 3 issues.
  // ============================================================
  function runF3_edgeStrokeWidthDropped(renderFn) {
    deps.resetEnv();
    var ab = deps.getEdge(0);
    var ac = deps.getEdge(1);
    var bc = deps.getEdge(2);
    ab.style.strokeWidth = 'STALE_SW';
    ac.style.strokeWidth = 'STALE_SW';
    bc.style.strokeWidth = 'STALE_SW';
    renderFn();
    var issues = [];
    if (ab.style.strokeWidth !== '2.5') issues.push('F3 strokeWidth-write violated — A-B expected "2.5", got ' + JSON.stringify(ab.style.strokeWidth) + ' (strokeWidth write dropped — T3)');
    if (ac.style.strokeWidth !== '2.5') issues.push('F3 strokeWidth-write violated — A-C expected "2.5", got ' + JSON.stringify(ac.style.strokeWidth) + ' (strokeWidth write dropped — T3)');
    if (bc.style.strokeWidth !== '1')   issues.push('F3 strokeWidth-write violated — B-C expected "1", got ' + JSON.stringify(bc.style.strokeWidth) + ' (strokeWidth write dropped — T3)');
    return issues;
  }

  // ============================================================
  // F4 — All 3 edge-labels pre-seeded opacity='STALE_LO' → T4 (drop 1d).
  // Healthy writes '0.85' (A-B, A-C) and '0' (B-C).
  // T4 leaves all three labels at 'STALE_LO' → 3 issues.
  // ============================================================
  function runF4_labelOpacityDropped(renderFn) {
    deps.resetEnv();
    var lab = deps.getEdgeLabel(0);
    var lac = deps.getEdgeLabel(1);
    var lbc = deps.getEdgeLabel(2);
    lab.style.opacity = 'STALE_LO';
    lac.style.opacity = 'STALE_LO';
    lbc.style.opacity = 'STALE_LO';
    renderFn();
    var issues = [];
    if (lab.style.opacity !== '0.85') issues.push('F4 label-opacity-write violated — A-B expected "0.85", got ' + JSON.stringify(lab.style.opacity) + ' (label opacity write dropped — T4)');
    if (lac.style.opacity !== '0.85') issues.push('F4 label-opacity-write violated — A-C expected "0.85", got ' + JSON.stringify(lac.style.opacity) + ' (label opacity write dropped — T4)');
    if (lbc.style.opacity !== '0')    issues.push('F4 label-opacity-write violated — B-C expected "0", got ' + JSON.stringify(lbc.style.opacity) + ' (label opacity write dropped — T4)');
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,             target_id: null },
    { id: 'F1', fn: runF1_predicateBroken,            target_id: 'T1' },
    { id: 'F2', fn: runF2_edgeOpacityDropped,         target_id: 'T2' },
    { id: 'F3', fn: runF3_edgeStrokeWidthDropped,     target_id: 'T3' },
    { id: 'F4', fn: runF4_labelOpacityDropped,        target_id: 'T4' }
  ];
};
