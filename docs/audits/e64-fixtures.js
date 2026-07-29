// e64-fixtures.js — per-function probes for E64 endTour
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operations and OVERWRITES the
// sentinel. The broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// endTour is the chrome-only stub that hides the tour overlay and resets
// per-node 'tour-target' highlighting when the user ends the tour early or
// finishes the last step. State mutations only — no event args, no node
// payload.
//
// Topology (mirrors L3863-3868):
//   1. tourActive = false  (global state — fixture-side tracker)
//   2. #tour-overlay  →  remove 'visible' class
//   3. #tour-progress →  remove 'visible' class
//   4. all .node-group → remove 'tour-target' class (foreach)
//
// Fixtures (F0..F4):
//   F0 — healthy control: tourActive=false after call; #tour-overlay and
//        #tour-progress no longer have 'visible'; 3 .node-group stubs all
//        had 'tour-target' and now have it removed.
//   F1 — dropInv1a (tourActive=false drop): pre-seed tourActive=true.
//        Healthy flips to false. T1 leaves at true → 1 issue.
//   F2 — dropInv1b (#tour-overlay 'visible' remove drop): pre-seed
//        overlay.classes=['visible','other']. Healthy removes 'visible'.
//        T2 leaves 'visible' in classes → 1 issue.
//   F3 — dropInv1c (#tour-progress 'visible' remove drop): same pattern.
//   F4 — dropInv1d (.node-group 'tour-target' remove drop): pre-seed 3
//        node-group stubs all with classes=['tour-target']. Healthy
//        removes from all 3. T4 leaves all 3 with 'tour-target' → 3
//        issues (one per stub).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 invariant groups execute correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    // Pre-seed: tourActive is initially false in resetEnv; overlay + progress
    // have 'visible' class; 3 node-group stubs have 'tour-target' class.
    deps.setOverlayClass('visible');
    deps.setProgressClass('visible');
    deps.addNodeGroupStubs(3);
    renderFn();
    var issues = [];

    if (deps.getTourActive() !== false) {
      issues.push('F0 tourActive violated — expected false, got ' + JSON.stringify(deps.getTourActive()));
    }
    if (deps.getOverlayClasses().indexOf('visible') >= 0) {
      issues.push('F0 overlay-class violated — expected "visible" removed, got ' + JSON.stringify(deps.getOverlayClasses()));
    }
    if (deps.getProgressClasses().indexOf('visible') >= 0) {
      issues.push('F0 progress-class violated — expected "visible" removed, got ' + JSON.stringify(deps.getProgressClasses()));
    }
    var nodeStubs = deps.getNodeGroupStubs();
    for (var i = 0; i < nodeStubs.length; i++) {
      if (nodeStubs[i].classList.classes.indexOf('tour-target') >= 0) {
        issues.push('F0 node-group-' + i + ' tour-target violated — expected removed, got ' + JSON.stringify(nodeStubs[i].classList.classes));
      }
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (tourActive=false drop): pre-seed tourActive=true.
  // Healthy flips to false. T1 leaves at true → 1 issue.
  // ============================================================
  function runF1_tourActiveDropped(renderFn) {
    deps.resetEnv();
    deps.setTourActive(true);
    renderFn();
    var issues = [];
    if (deps.getTourActive() !== false) {
      issues.push('F1 tourActive violated — expected false, got ' + JSON.stringify(deps.getTourActive()) + ' (tourActive=false write dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (#tour-overlay 'visible' remove drop): pre-seed
  // overlay.classes=['visible','other']. Healthy removes 'visible'.
  // T2 leaves 'visible' in classes → 1 issue.
  // ============================================================
  function runF2_overlayVisibleDropped(renderFn) {
    deps.resetEnv();
    deps.setOverlayClass('visible');
    renderFn();
    var issues = [];
    if (deps.getOverlayClasses().indexOf('visible') >= 0) {
      issues.push('F2 overlay-visible violated — expected "visible" removed, got ' + JSON.stringify(deps.getOverlayClasses()) + ' (overlay visible-class remove dropped — T2)');
    }
    return issues;
  }

  // ============================================================
  // F3 — dropInv1c (#tour-progress 'visible' remove drop): same pattern.
  // ============================================================
  function runF3_progressVisibleDropped(renderFn) {
    deps.resetEnv();
    deps.setProgressClass('visible');
    renderFn();
    var issues = [];
    if (deps.getProgressClasses().indexOf('visible') >= 0) {
      issues.push('F3 progress-visible violated — expected "visible" removed, got ' + JSON.stringify(deps.getProgressClasses()) + ' (progress visible-class remove dropped — T3)');
    }
    return issues;
  }

  // ============================================================
  // F4 — dropInv1d (.node-group 'tour-target' remove drop): pre-seed 3
  // node-group stubs with classes=['tour-target']. Healthy removes
  // from all. T4 leaves all 3 → 3 issues (one per stub).
  // ============================================================
  function runF4_nodeGroupTargetDropped(renderFn) {
    deps.resetEnv();
    deps.addNodeGroupStubs(3);
    renderFn();
    var issues = [];
    var nodeStubs = deps.getNodeGroupStubs();
    for (var i = 0; i < nodeStubs.length; i++) {
      if (nodeStubs[i].classList.classes.indexOf('tour-target') >= 0) {
        issues.push('F4 node-group-' + i + ' tour-target violated — expected removed, got ' + JSON.stringify(nodeStubs[i].classList.classes) + ' (node-group tour-target remove dropped — T4)');
      }
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                 target_id: null },
    { id: 'F1', fn: runF1_tourActiveDropped,             target_id: 'T1' },
    { id: 'F2', fn: runF2_overlayVisibleDropped,         target_id: 'T2' },
    { id: 'F3', fn: runF3_progressVisibleDropped,        target_id: 'T3' },
    { id: 'F4', fn: runF4_nodeGroupTargetDropped,        target_id: 'T4' }
  ];
};