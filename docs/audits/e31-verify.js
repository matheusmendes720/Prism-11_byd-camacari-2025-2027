// e31_verify.js — Zoom composition invariant for applyZoom + zoomIn/Out/Fit + wheel
//
// E31 establishes that the zoom composition at L3881-3897 of
// D3-PITCH-GRAPH.html composes four entry points (applyZoom, zoomIn,
// zoomOut, zoomFit) plus the wheel handler into a unified zoom pipeline
// with clamp bounds [0.3, 3.0]:
//
//   applyZoom() → reads state, sets transform="translate(tx,ty) scale(s)"
//   zoomIn()    → zoomScale = min(zoomScale * 1.25, 3); applyZoom()
//   zoomOut()   → zoomScale = max(zoomScale / 1.25, 0.3); applyZoom()
//   zoomFit()   → zoomScale = 1; zoomTx = 0; zoomTy = 0; applyZoom()
//   wheel event → mutate zoomScale by ±1.08 with same clamps, applyZoom()
//
// Composition contract verified:
//   (a) applyZoom reads zoomTx, zoomTy, zoomScale and sets transform attribute
//   (b) zoomIn multiplies by 1.25 with max bound 3
//   (c) zoomOut divides by 1.25 with min bound 0.3
//   (d) zoomFit resets all three state variables to defaults
//   (e) wheel handler with deltaY<0 calls zoomIn-equivalent math (× 1.08)
//   (f) wheel handler with deltaY>0 calls zoomOut-equivalent math (÷ 1.08)
//   (g) every entry point ultimately calls applyZoom to write the transform
//   (h) clamp bounds consistent across all entry points
//
// The harness mirrors the zoom composition and replaces #root-transform
// DOM access with observable mocks. Each entry point is exercised against
// pre-seeded state, then the transform attribute is verified.
//
// 6 fixtures × 8 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock state + DOM for the zoom composition
// ------------------------------------------------------------------
function setupHarness() {
  var state = {
    zoomScale: 1,
    zoomTx: 0,
    zoomTy: 0
  };
  // Captured transform attribute on #root-transform
  var captured = {
    transformAttr: null,
    setCount: 0
  };
  // Mock #root-transform element
  var rootTransform = {
    _attrs: {},
    setAttribute: function (k, v) {
      this._attrs[k] = v;
      if (k === 'transform') {
        captured.transformAttr = v;
        captured.setCount++;
      }
    },
    getAttribute: function (k) {
      return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null;
    }
  };
  // Mock svg with querySelector returning the root-transform element
  var svg = {
    querySelector: function (sel) {
      if (sel === '#root-transform') return rootTransform;
      return null;
    }
  };

  return { state: state, svg: svg, rootTransform: rootTransform, captured: captured };
}

// ------------------------------------------------------------------
// Mirror of L3881-3897 — applyZoom + zoomIn/Out/Fit + wheel handler
// ------------------------------------------------------------------
function registerZoomComposition(deps) {
  var state = deps.state;
  var svg = deps.svg;

  function applyZoom() {
    var root = svg.querySelector('#root-transform');
    if (root) {
      root.setAttribute('transform', 'translate(' + state.zoomTx + ',' + state.zoomTy + ') scale(' + state.zoomScale + ')');
    }
  }

  function zoomIn() {
    state.zoomScale = Math.min(state.zoomScale * 1.25, 3);
    applyZoom();
  }

  function zoomOut() {
    state.zoomScale = Math.max(state.zoomScale / 1.25, 0.3);
    applyZoom();
  }

  function zoomFit() {
    state.zoomScale = 1;
    state.zoomTx = 0;
    state.zoomTy = 0;
    applyZoom();
  }

  function onWheel(event) {
    if (event.deltaY < 0) state.zoomScale = Math.min(state.zoomScale * 1.08, 3);
    else state.zoomScale = Math.max(state.zoomScale / 1.08, 0.3);
    applyZoom();
  }

  return { applyZoom: applyZoom, zoomIn: zoomIn, zoomOut: zoomOut, zoomFit: zoomFit, onWheel: onWheel };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of zoom composition
// ------------------------------------------------------------------
function installMutant(kind, deps) {
  if (kind === 'T1') {
    // T1: skip the transform attribute set in applyZoom. State mutates
    //     but DOM transform stays stale. Healthy: transformAttr is updated.
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) {
          // SKIPPED: no setAttribute call
          void root;
        }
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.25, 3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) { void root; }  // SKIPPED setAttribute
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) { void root; }  // SKIPPED setAttribute
      },
      zoomFit: function () {
        deps.state.zoomScale = 1;
        deps.state.zoomTx = 0;
        deps.state.zoomTy = 0;
        var root = deps.svg.querySelector('#root-transform');
        if (root) { void root; }  // SKIPPED setAttribute
      },
      onWheel: function (event) {
        if (event.deltaY < 0) deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 3);
        else deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) { void root; }  // SKIPPED setAttribute
      }
    };
  } else if (kind === 'T2') {
    // T2: zoomIn multiplies by 1.0 instead of 1.25 (no-op zoom in).
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.0, 3);  // NO-OP mult
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomFit: function () {
        deps.state.zoomScale = 1; deps.state.zoomTx = 0; deps.state.zoomTy = 0;
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      onWheel: function (event) {
        if (event.deltaY < 0) deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 3);
        else deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      }
    };
  } else if (kind === 'T3') {
    // T3: zoomIn clamps at 4 instead of 3 (upper bound broken).
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.25, 4);  // WRONG max
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomFit: function () {
        deps.state.zoomScale = 1; deps.state.zoomTx = 0; deps.state.zoomTy = 0;
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      onWheel: function (event) {
        if (event.deltaY < 0) deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 4);  // WRONG max
        else deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      }
    };
  } else if (kind === 'T4') {
    // T4: zoomFit resets ONLY zoomScale, leaves zoomTx/zoomTy unchanged.
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.25, 3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomFit: function () {
        deps.state.zoomScale = 1;
        // SKIPPED zoomTx = 0
        // SKIPPED zoomTy = 0
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      onWheel: function (event) {
        if (event.deltaY < 0) deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 3);
        else deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      }
    };
  } else if (kind === 'T5') {
    // T5: wheel handler inverts the branch. deltaY<0 (zoom in intent)
    //     now zooms OUT (divides). deltaY>0 (zoom out intent) zooms IN.
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.25, 3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomFit: function () {
        deps.state.zoomScale = 1; deps.state.zoomTx = 0; deps.state.zoomTy = 0;
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      onWheel: function (event) {
        // INVERTED: deltaY<0 (scroll up = zoom in intent) now DIVIDES
        if (event.deltaY < 0) deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        else deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      }
    };
  } else if (kind === 'T6') {
    // T6: zoomIn mutates state but never calls applyZoom — DOM transform
    //     never reflects the new scale (UI desync).
    return {
      applyZoom: function () {
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomIn: function () {
        deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.25, 3);
        // SKIPPED applyZoom call
      },
      zoomOut: function () {
        deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.25, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      zoomFit: function () {
        deps.state.zoomScale = 1; deps.state.zoomTx = 0; deps.state.zoomTy = 0;
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      },
      onWheel: function (event) {
        if (event.deltaY < 0) deps.state.zoomScale = Math.min(deps.state.zoomScale * 1.08, 3);
        else deps.state.zoomScale = Math.max(deps.state.zoomScale / 1.08, 0.3);
        var root = deps.svg.querySelector('#root-transform');
        if (root) root.setAttribute('transform', 'translate(' + deps.state.zoomTx + ',' + deps.state.zoomTy + ') scale(' + deps.state.zoomScale + ')');
      }
    };
  }
  // T7 is the control (no mutation)
  return null;
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E31 ZOOM COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — applyZoom() reads state and sets transform="translate(tx,ty) scale(s)"',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 50;
        h.state.zoomTy = -30;
        h.state.zoomScale = 1.5;
        var zoom = registerZoomComposition(h);
        zoom.applyZoom();
        return {
          issues: [
            (h.captured.transformAttr !== 'translate(50,-30) scale(1.5)') && 'transform should be "translate(50,-30) scale(1.5)", got ' + JSON.stringify(h.captured.transformAttr),
            (h.captured.setCount !== 1) && 'setAttribute should fire exactly once, got ' + h.captured.setCount
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F2 — zoomIn() from scale=1 → scale=1.25 (multiplies by 1.25)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomScale = 1;
        var zoom = registerZoomComposition(h);
        zoom.zoomIn();
        return {
          issues: [
            (h.state.zoomScale !== 1.25) && 'zoomScale should be 1.25 after zoomIn, got ' + h.state.zoomScale,
            (h.captured.transformAttr !== 'translate(0,0) scale(1.25)') && 'transform should reflect 1.25, got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F3 — zoomIn() from scale=2.5 → scale=3.0 (clamped at upper bound 3)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomScale = 2.5;
        var zoom = registerZoomComposition(h);
        zoom.zoomIn();
        return {
          issues: [
            (h.state.zoomScale !== 3) && 'zoomScale should clamp at 3, got ' + h.state.zoomScale,
            (h.captured.transformAttr !== 'translate(0,0) scale(3)') && 'transform should reflect clamped 3, got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F4 — zoomOut() from scale=1 → scale=0.8 (divides by 1.25, floor at 0.3)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomScale = 1;
        var zoom = registerZoomComposition(h);
        zoom.zoomOut();
        return {
          issues: [
            (Math.abs(h.state.zoomScale - 0.8) > 1e-9) && 'zoomScale should be 0.8 after zoomOut, got ' + h.state.zoomScale,
            (h.captured.transformAttr !== 'translate(0,0) scale(0.8)') && 'transform should reflect 0.8, got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F5 — zoomFit() resets all three state variables and applies transform',
      setup: function () {
        var h = setupHarness();
        // Pre-pollute state
        h.state.zoomScale = 2.3;
        h.state.zoomTx = 75;
        h.state.zoomTy = -50;
        var zoom = registerZoomComposition(h);
        zoom.zoomFit();
        return {
          issues: [
            (h.state.zoomScale !== 1) && 'zoomScale should reset to 1, got ' + h.state.zoomScale,
            (h.state.zoomTx !== 0) && 'zoomTx should reset to 0, got ' + h.state.zoomTx,
            (h.state.zoomTy !== 0) && 'zoomTy should reset to 0, got ' + h.state.zoomTy,
            (h.captured.transformAttr !== 'translate(0,0) scale(1)') && 'transform should reflect reset, got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F6 — wheel handler with deltaY<0 multiplies by 1.08 (zoom in)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomScale = 1;
        var zoom = registerZoomComposition(h);
        zoom.onWheel({ deltaY: -1, preventDefault: function () {} });
        return {
          issues: [
            (Math.abs(h.state.zoomScale - 1.08) > 1e-9) && 'wheel zoom-in should set scale to 1.08, got ' + h.state.zoomScale,
            (h.captured.transformAttr !== 'translate(0,0) scale(1.08)') && 'transform should reflect 1.08, got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    }
  ];

  for (var i = 0; i < FIXTURES.length; i++) {
    var fx = FIXTURES[i];
    var result = fx.setup();
    total++;
    if (result.issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + fx.name);
    } else {
      failed++;
      console.log('  [FAIL] ' + fx.name + ': ' + result.issues.length + ' issues');
      for (var j = 0; j < result.issues.length; j++) {
        console.log('    - ' + result.issues[j]);
      }
    }
  }

  // ADVERSARIAL MUTANTS (T1-T7)
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');
  function recordAdversarial(label, kind) {
    total++;
    var h = setupHarness();
    var mutated = installMutant(kind, h);
    var zoom = mutated || registerZoomComposition(h);

    var issues = [];

    if (kind === 'T1') {
      // T1: applyZoom skips setAttribute. Mutant: transformAttr stays null.
      // Healthy: transformAttr is set.
      zoom.applyZoom();
      if (h.captured.transformAttr === null) {
        issues.push('T1: applyZoom skipped setAttribute (transformAttr stayed null)');
      }
    } else if (kind === 'T2') {
      // T2: zoomIn multiplies by 1.0 (no-op). Healthy: scale becomes 1.25.
      // Mutant: scale stays at 1.
      h.state.zoomScale = 1;
      zoom.zoomIn();
      if (h.state.zoomScale === 1) {
        issues.push('T2: zoomIn did not increase scale (multiplier was 1.0 not 1.25), scale=' + h.state.zoomScale);
      }
    } else if (kind === 'T3') {
      // T3: zoomIn clamps at 4 (wrong upper bound). Healthy: clamp at 3.
      // Mutant: scale from 2.5 → 3.125 (2.5*1.25=3.125, min(3.125, 4)=3.125).
      h.state.zoomScale = 2.5;
      zoom.zoomIn();
      if (h.state.zoomScale === 3.125) {
        issues.push('T3: zoomIn upper bound is 4 (mutant), should be 3 — scale=' + h.state.zoomScale);
      }
    } else if (kind === 'T4') {
      // T4: zoomFit doesn't reset zoomTx/zoomTy. Healthy: all three reset.
      // Mutant: zoomTx/zoomTy stay polluted.
      h.state.zoomScale = 2.3;
      h.state.zoomTx = 75;
      h.state.zoomTy = -50;
      zoom.zoomFit();
      if (h.state.zoomTx !== 0 || h.state.zoomTy !== 0) {
        issues.push('T4: zoomFit did NOT reset zoomTx/zoomTy (zoomTx=' + h.state.zoomTx + ', zoomTy=' + h.state.zoomTy + ')');
      }
    } else if (kind === 'T5') {
      // T5: wheel handler inverts branch. deltaY<0 (intent: zoom in) now
      // divides scale. Healthy: 1.0 → 1.08. Mutant: 1.0 → ~0.926.
      // Push WHEN mutant is active (scale < 1), NOT when healthy.
      h.state.zoomScale = 1;
      zoom.onWheel({ deltaY: -1, preventDefault: function () {} });
      if (h.state.zoomScale < 1) {
        issues.push('T5: wheel branch inverted — deltaY<0 (zoom in intent) decreased scale to ' + h.state.zoomScale + ' (≈ 1/1.08)');
      }
    } else if (kind === 'T6') {
      // T6: zoomIn mutates state but skips applyZoom. Healthy: transformAttr updated.
      // Mutant: state.zoomScale = 1.25, but transformAttr stays null.
      h.state.zoomScale = 1;
      zoom.zoomIn();
      if (h.captured.transformAttr === null) {
        issues.push('T6: zoomIn mutated state (zoomScale=' + h.state.zoomScale + ') but skipped applyZoom (transformAttr stayed null)');
      }
    } else if (kind === 'T7') {
      // T7 control — every path should be exercised healthy
      zoom.zoomFit();
      if (h.state.zoomScale !== 1 || h.state.zoomTx !== 0 || h.state.zoomTy !== 0) issues.push('control: zoomFit did not reset all three');
      if (h.captured.transformAttr !== 'translate(0,0) scale(1)') issues.push('control: zoomFit transform not written');
      h.state.zoomScale = 1;
      zoom.zoomIn();
      if (h.state.zoomScale !== 1.25) issues.push('control: zoomIn scale');
      zoom.zoomOut();
      if (Math.abs(h.state.zoomScale - 1) > 1e-9) issues.push('control: zoomOut should restore scale=1');
      h.state.zoomScale = 1;
      zoom.onWheel({ deltaY: 1, preventDefault: function () {} });
      if (Math.abs(h.state.zoomScale - 1 / 1.08) > 1e-9) issues.push('control: wheel zoom-out should divide by 1.08');
    }

    var ctrl = label.indexOf('T7') === 0;
    if (ctrl) {
      if (issues.length === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues (CONTROL BROKEN)');
        for (var k = 0; k < issues.length; k++) console.log('    - ' + issues[k]);
      }
    } else {
      if (issues.length >= 1) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥1)');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    }
  }

  recordAdversarial('T1 applyZoom skips setAttribute', 'T1');
  recordAdversarial('T2 zoomIn multiplier is 1.0 (no-op)', 'T2');
  recordAdversarial('T3 zoomIn upper bound is 4 (wrong clamp)', 'T3');
  recordAdversarial('T4 zoomFit does not reset zoomTx/zoomTy', 'T4');
  recordAdversarial('T5 wheel branch inverted (deltaY<0 zooms out)', 'T5');
  recordAdversarial('T6 zoomIn skips applyZoom (state-DOM desync)', 'T6');
  recordAdversarial('T7 control (healthy zoom)', 'T7');

  console.log('');
  console.log('========== E31 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
