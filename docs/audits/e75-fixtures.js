// e75-fixtures.js — per-function probes for E75 zoom trio
//
// Inverted mutant-detection: each fixture pre-seeds zoom state
// (zoomScale, zoomTx, zoomTy) and a `mockApplyZoom` sentinel. The
// healthy mirror mutates the state and emits a transform string via
// the mock. The broken mutant drops a mutation → state stays at
// sentinel → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// Source — D3-PITCH-GRAPH.html L3881-3889:
//   function applyZoom() {
//     const root = svg.querySelector('#root-transform');
//     if (root) {
//       root.setAttribute('transform',
//         `translate(${zoomTx},${zoomTy}) scale(${zoomScale})`);
//     }
//   }
//   function zoomIn()  { zoomScale = Math.min(zoomScale * 1.25, 3); applyZoom(); }
//   function zoomOut() { zoomScale = Math.max(zoomScale / 1.25, 0.3); applyZoom(); }
//   function zoomFit() { zoomScale = 1; zoomTx = 0; zoomTy = 0; applyZoom(); }
//
// Topology (3 functions, each verified independently):
//   1a. zoomIn: multiplies zoomScale by 1.25, capped at 3.
//   1b. zoomOut: divides zoomScale by 1.25, floored at 0.3.
//   1c. zoomFit: resets zoomScale=1, zoomTx=0, zoomTy=0.
//
// Fixtures (F0..F3):
//   F0 — healthy control: cycles through all three functions.
//   F1 — dropInv1a (zoomIn × 1.25 drop). Healthy → zoomScale = 1.25.
//        T1 → zoomScale stays at 1.
//   F2 — dropInv1b (zoomOut / 1.25 drop). Healthy → zoomScale = 0.8.
//        T2 → zoomScale stays at 1.
//   F3 — dropInv1c (zoomFit reset triple drop). Healthy → all three
//        reset to defaults. T3 → state unchanged.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. Cycle through all three functions.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var issues = [];

    // zoomIn: scale should rise from 1 to 1.25
    deps.setScale(1); deps.setTx(0); deps.setTy(0);
    deps.setMode('zoomIn');
    renderFn();
    if (deps.getScale() !== 1.25) {
      issues.push('F0 zoomIn violated — expected scale=1.25, got ' + deps.getScale());
    }

    // zoomOut: scale should fall from 1.25 to 1.0
    deps.setMode('zoomOut');
    renderFn();
    var scaleAfterOut = deps.getScale();
    if (Math.abs(scaleAfterOut - 1.0) > 1e-9) {
      issues.push('F0 zoomOut violated — expected scale=1.0, got ' + scaleAfterOut);
    }

    // zoomFit: state should reset to (1, 0, 0)
    deps.setScale(2); deps.setTx(50); deps.setTy(-30);
    deps.setMode('zoomFit');
    renderFn();
    if (deps.getScale() !== 1 || deps.getTx() !== 0 || deps.getTy() !== 0) {
      issues.push('F0 zoomFit violated — expected (1,0,0), got (' +
        deps.getScale() + ',' + deps.getTx() + ',' + deps.getTy() + ')');
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (zoomIn × 1.25 drop). Healthy → scale=1.25.
  // T1 → scale stays at 1.
  // ============================================================
  function runF1_zoomInDropped(renderFn) {
    deps.resetEnv();
    deps.setScale(1); deps.setTx(0); deps.setTy(0);
    deps.setMode('zoomIn');
    renderFn();
    if (deps.getScale() !== 1.25) {
      return ['F1 zoomIn × 1.25 violated — expected scale=1.25, got ' + deps.getScale()];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (zoomOut / 1.25 drop). Healthy → scale=1.0.
  // T2 → scale stays at 1.
  // ============================================================
  function runF2_zoomOutDropped(renderFn) {
    deps.resetEnv();
    deps.setScale(1.25); deps.setTx(0); deps.setTy(0);
    deps.setMode('zoomOut');
    renderFn();
    var scale = deps.getScale();
    if (Math.abs(scale - 1.0) > 1e-9) {
      return ['F2 zoomOut / 1.25 violated — expected scale=1.0, got ' + scale];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (zoomFit reset triple drop). Healthy → (1,0,0).
  // T3 → state unchanged.
  // ============================================================
  function runF3_zoomFitDropped(renderFn) {
    deps.resetEnv();
    deps.setScale(2); deps.setTx(50); deps.setTy(-30);
    deps.setMode('zoomFit');
    renderFn();
    if (deps.getScale() !== 1 || deps.getTx() !== 0 || deps.getTy() !== 0) {
      return ['F3 zoomFit reset violated — expected (1,0,0), got (' +
        deps.getScale() + ',' + deps.getTx() + ',' + deps.getTy() + ')'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,     target_id: null },
    { id: 'F1', fn: runF1_zoomInDropped,      target_id: 'T1' },
    { id: 'F2', fn: runF2_zoomOutDropped,     target_id: 'T2' },
    { id: 'F3', fn: runF3_zoomFitDropped,     target_id: 'T3' }
  ];
};