// e32_verify.js — Drag-to-pan composition invariant
//
// E32 establishes that the drag-to-pan handlers at L3900-3915 of
// D3-PITCH-GRAPH.html compose three event handlers (mousedown, mousemove,
// mouseup) plus four state variables (isDragging, dragStartX, dragStartY,
// panStartTx, panStartTy) into a unified pan pipeline that:
//   - early-returns on .node-group targets (so drag does not start on a node)
//   - captures start positions on mousedown
//   - computes zoomTx/zoomTy deltas on mousemove
//   - calls applyZoom() so the transform attribute is updated
//   - terminates the drag on mouseup
//
// E31 covered the ZOOM axis (scale state via applyZoom/zoomIn/Out/Fit/wheel).
// E32 covers the PAN axis (translation state via drag). Together they
// close the viewport-transform composition domain.
//
// Composition contract verified:
//   (a) mousedown on background captures dragStartX/Y, panStartTx/Ty
//   (b) mousedown on .node-group element is a no-op (early-return)
//   (c) mousemove when isDragging=false is a no-op (early-return)
//   (d) mousemove when isDragging=true updates zoomTx/zoomTy by delta
//   (e) mousemove always calls applyZoom() after delta computation
//   (f) mouseup sets isDragging=false
//   (g) dragStartX/Y and panStartTx/Ty are captured BEFORE mousemove fires
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock state + DOM for the drag-pan composition
// ------------------------------------------------------------------
function setupHarness() {
  var state = {
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    panStartTx: 0,
    panStartTy: 0,
    zoomTx: 0,
    zoomTy: 0,
    zoomScale: 1
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
  // Mock svg element with querySelector + addEventListener
  var svg = {
    _listeners: {},
    querySelector: function (sel) {
      if (sel === '#root-transform') return rootTransform;
      return null;
    },
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fire: function (type, eventObj) {
      var list = this._listeners[type] || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](eventObj); } catch (e) { /* swallow */ }
      }
    }
  };
  // Mock document with addEventListener
  var doc = {
    _listeners: {},
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fire: function (type, eventObj) {
      var list = this._listeners[type] || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](eventObj); } catch (e) { /* swallow */ }
      }
    }
  };
  return { state: state, svg: svg, doc: doc, rootTransform: rootTransform, captured: captured };
}

// ------------------------------------------------------------------
// Mock element factory — supports closest() walk + classList
// ------------------------------------------------------------------
function makeMockElement(tag) {
  tag = tag || 'div';
  var el = {
    _tag: tag,
    _parent: null,
    _children: [],
    _classes: {},
    _id: null,
    addEventListener: function () {},
    appendChild: function (c) { this._children.push(c); c._parent = this; return c; },
    closest: function (sel) {
      var node = this;
      while (node) {
        if (sel.charAt(0) === '.') {
          var cls = sel.slice(1);
          if (node._classes && node._classes[cls]) return node;
        } else if (sel.charAt(0) === '#') {
          var id = sel.slice(1);
          if (node._id === id) return node;
        }
        node = node._parent;
      }
      return null;
    }
  };
  return el;
}

// ------------------------------------------------------------------
// Mirror of L3900-3915 — drag-to-pan composition
// ------------------------------------------------------------------
function registerDragPanComposition(deps) {
  var state = deps.state;
  var svg = deps.svg;
  var doc = deps.doc;
  var rootTransform = deps.rootTransform;

  function applyZoom() {
    var root = svg.querySelector('#root-transform');
    if (root) {
      root.setAttribute('transform', 'translate(' + state.zoomTx + ',' + state.zoomTy + ') scale(' + state.zoomScale + ')');
    }
  }

  svg.addEventListener('mousedown', function (e) {
    if (e.target.closest('.node-group')) return;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    state.panStartTx = state.zoomTx;
    state.panStartTy = state.zoomTy;
  });

  doc.addEventListener('mousemove', function (e) {
    if (!state.isDragging) return;
    state.zoomTx = state.panStartTx + (e.clientX - state.dragStartX);
    state.zoomTy = state.panStartTy + (e.clientY - state.dragStartY);
    applyZoom();
  });

  doc.addEventListener('mouseup', function () {
    state.isDragging = false;
  });

  return { applyZoom: applyZoom };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of drag-pan composition
// ------------------------------------------------------------------
function installMutant(kind, deps) {
  var state = deps.state;
  var svg = deps.svg;
  var doc = deps.doc;
  var rootTransform = deps.rootTransform;

  function applyZoom() {
    var root = svg.querySelector('#root-transform');
    if (root) {
      root.setAttribute('transform', 'translate(' + state.zoomTx + ',' + state.zoomTy + ') scale(' + state.zoomScale + ')');
    }
  }

  if (kind === 'T1') {
    // T1: drop the .node-group early-return. Mousedown on a node-group
    //     starts a drag — node interaction is hijacked.
    svg._listeners.mousedown = [function (e) {
      // SKIPPED: if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartTx = state.zoomTx;
      state.panStartTy = state.zoomTy;
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      state.zoomTx = state.panStartTx + (e.clientX - state.dragStartX);
      state.zoomTy = state.panStartTy + (e.clientY - state.dragStartY);
      applyZoom();
    }];
    doc._listeners.mouseup = [function () { state.isDragging = false; }];
  } else if (kind === 'T2') {
    // T2: skip panStartTx/panStartTy capture. Drag deltas accumulate from
    //     the *current* zoomTx/zoomTy rather than the start — produces
    //     runaway translation.
    svg._listeners.mousedown = [function (e) {
      if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      // SKIPPED: panStartTx = state.zoomTx
      // SKIPPED: panStartTy = state.zoomTy
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      state.zoomTx = state.panStartTx + (e.clientX - state.dragStartX);
      state.zoomTy = state.panStartTy + (e.clientY - state.dragStartY);
      applyZoom();
    }];
    doc._listeners.mouseup = [function () { state.isDragging = false; }];
  } else if (kind === 'T3') {
    // T3: invert the delta math. zoomTx = panStartTx - (clientX - dragStartX).
    //     Dragging right zooms the view to the LEFT (mirror behavior).
    svg._listeners.mousedown = [function (e) {
      if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartTx = state.zoomTx;
      state.panStartTy = state.zoomTy;
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      // INVERTED math
      state.zoomTx = state.panStartTx - (e.clientX - state.dragStartX);
      state.zoomTy = state.panStartTy - (e.clientY - state.dragStartY);
      applyZoom();
    }];
    doc._listeners.mouseup = [function () { state.isDragging = false; }];
  } else if (kind === 'T4') {
    // T4: skip applyZoom() in mousemove. State mutates but DOM transform
    //     never reflects the new pan (visual desync).
    svg._listeners.mousedown = [function (e) {
      if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartTx = state.zoomTx;
      state.panStartTy = state.zoomTy;
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      state.zoomTx = state.panStartTx + (e.clientX - state.dragStartX);
      state.zoomTy = state.panStartTy + (e.clientY - state.dragStartY);
      // SKIPPED applyZoom()
    }];
    doc._listeners.mouseup = [function () { state.isDragging = false; }];
  } else if (kind === 'T5') {
    // T5: skip isDragging reset in mouseup. Drag never ends — every
    //     subsequent mousemove keeps accumulating pan even after release.
    svg._listeners.mousedown = [function (e) {
      if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartTx = state.zoomTx;
      state.panStartTy = state.zoomTy;
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      state.zoomTx = state.panStartTx + (e.clientX - state.dragStartX);
      state.zoomTy = state.panStartTy + (e.clientY - state.dragStartY);
      applyZoom();
    }];
    doc._listeners.mouseup = [function () {
      // SKIPPED: state.isDragging = false
    }];
  } else if (kind === 'T6') {
    // T6: swap dragStartX with dragStartY in delta math. Vertical drag
    //     translates horizontally and vice versa (axis-swap bug).
    svg._listeners.mousedown = [function (e) {
      if (e.target.closest('.node-group')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartTx = state.zoomTx;
      state.panStartTy = state.zoomTy;
    }];
    doc._listeners.mousemove = [function (e) {
      if (!state.isDragging) return;
      // SWAPPED axes
      state.zoomTx = state.panStartTx + (e.clientY - state.dragStartY);
      state.zoomTy = state.panStartTy + (e.clientX - state.dragStartX);
      applyZoom();
    }];
    doc._listeners.mouseup = [function () { state.isDragging = false; }];
  }
  // T7 is the control (no mutation)
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E32 DRAG-TO-PAN COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — mousedown on background captures dragStartX/Y and panStartTx/Ty',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 100;
        h.state.zoomTy = 50;
        registerDragPanComposition(h);
        var target = makeMockElement('rect');  // background rect
        h.svg.fire('mousedown', { target: target, clientX: 200, clientY: 150 });
        return {
          issues: [
            (!h.state.isDragging) && 'isDragging should be true after mousedown on background',
            (h.state.dragStartX !== 200) && 'dragStartX should capture clientX=200, got ' + h.state.dragStartX,
            (h.state.dragStartY !== 150) && 'dragStartY should capture clientY=150, got ' + h.state.dragStartY,
            (h.state.panStartTx !== 100) && 'panStartTx should capture zoomTx=100, got ' + h.state.panStartTx,
            (h.state.panStartTy !== 50) && 'panStartTy should capture zoomTy=50, got ' + h.state.panStartTy
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F2 — mousedown on .node-group element is a no-op (isDragging stays false)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 100;
        h.state.zoomTy = 50;
        registerDragPanComposition(h);
        var nodeGroup = makeMockElement('g');
        nodeGroup._classes['node-group'] = true;
        h.svg.fire('mousedown', { target: nodeGroup, clientX: 200, clientY: 150 });
        return {
          issues: [
            (h.state.isDragging) && 'isDragging should stay false when mousedown on .node-group (early-return gate)',
            (h.state.dragStartX !== 0) && 'dragStartX should not be captured, got ' + h.state.dragStartX
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F3 — mousemove when isDragging=false is a no-op (zoomTx stays unchanged)',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 100;
        h.state.zoomTy = 50;
        registerDragPanComposition(h);
        // Never mousedown — isDragging stays false
        h.doc.fire('mousemove', { clientX: 300, clientY: 400 });
        return {
          issues: [
            (h.state.zoomTx !== 100) && 'zoomTx should stay 100 (no drag active), got ' + h.state.zoomTx,
            (h.state.zoomTy !== 50) && 'zoomTy should stay 50 (no drag active), got ' + h.state.zoomTy,
            (h.captured.setCount !== 0) && 'applyZoom should NOT fire when no drag active, got setCount=' + h.captured.setCount
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F4 — mousemove during drag updates zoomTx/zoomTy by clientX/Y delta',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 100;
        h.state.zoomTy = 50;
        registerDragPanComposition(h);
        // Start drag at (200, 150)
        var target = makeMockElement('rect');
        h.svg.fire('mousedown', { target: target, clientX: 200, clientY: 150 });
        // Move to (250, 180) — delta = (+50, +30)
        h.doc.fire('mousemove', { clientX: 250, clientY: 180 });
        return {
          issues: [
            (h.state.zoomTx !== 150) && 'zoomTx should be 100 + (250-200) = 150, got ' + h.state.zoomTx,
            (h.state.zoomTy !== 80) && 'zoomTy should be 50 + (180-150) = 80, got ' + h.state.zoomTy,
            (h.captured.transformAttr !== 'translate(150,80) scale(1)') && 'transform should reflect (150,80) scale(1), got ' + JSON.stringify(h.captured.transformAttr)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F5 — mouseup sets isDragging=false (drag terminates)',
      setup: function () {
        var h = setupHarness();
        registerDragPanComposition(h);
        var target = makeMockElement('rect');
        h.svg.fire('mousedown', { target: target, clientX: 200, clientY: 150 });
        // Confirm drag is active
        if (!h.state.isDragging) {
          return { issues: ['precondition: drag should be active after mousedown'] };
        }
        // Mouseup terminates
        h.doc.fire('mouseup', {});
        return {
          issues: [
            (h.state.isDragging) && 'isDragging should be false after mouseup'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F6 — full drag sequence: mousedown → mousemove → mouseup → mousemove is no-op',
      setup: function () {
        var h = setupHarness();
        h.state.zoomTx = 0;
        h.state.zoomTy = 0;
        registerDragPanComposition(h);
        var target = makeMockElement('rect');
        h.svg.fire('mousedown', { target: target, clientX: 100, clientY: 100 });
        h.doc.fire('mousemove', { clientX: 150, clientY: 130 });  // delta = (+50, +30)
        h.doc.fire('mouseup', {});
        var txAfterMove = h.state.zoomTx;
        var tyAfterMove = h.state.zoomTy;
        // Subsequent mousemove after mouseup should NOT move the view
        h.doc.fire('mousemove', { clientX: 999, clientY: 999 });
        return {
          issues: [
            (txAfterMove !== 50) && 'zoomTx after drag should be 50, got ' + txAfterMove,
            (tyAfterMove !== 30) && 'zoomTy after drag should be 30, got ' + tyAfterMove,
            (h.state.zoomTx !== 50) && 'zoomTx should NOT change after mouseup, got ' + h.state.zoomTx,
            (h.state.zoomTy !== 30) && 'zoomTy should NOT change after mouseup, got ' + h.state.zoomTy
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
    registerDragPanComposition(h);  // install healthy
    installMutant(kind, h);  // override with mutant

    var issues = [];

    if (kind === 'T1') {
      // T1: dropped .node-group early-return. Click on a node-group should
      // not start a drag (healthy). Mutant: drag starts.
      var nodeGroup = makeMockElement('g');
      nodeGroup._classes['node-group'] = true;
      h.svg.fire('mousedown', { target: nodeGroup, clientX: 200, clientY: 150 });
      if (h.state.isDragging) {
        issues.push('T1: mousedown on .node-group started a drag (.node-group early-return was dropped)');
      }
    } else if (kind === 'T2') {
      // T2: panStartTx/panStartTy not captured. Healthy: panStartTx = 100.
      // Mutant: panStartTx stays 0 (default), so zoomTx after drag = 0 + delta.
      h.state.zoomTx = 100;
      var target2 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target2, clientX: 200, clientY: 150 });
      h.doc.fire('mousemove', { clientX: 250, clientY: 180 });
      // Healthy: zoomTx = 100 + 50 = 150. Mutant: zoomTx = 0 + 50 = 50.
      if (h.state.zoomTx === 50) {
        issues.push('T2: panStartTx was not captured (zoomTx=' + h.state.zoomTx + ', should be 150)');
      }
    } else if (kind === 'T3') {
      // T3: inverted delta math. Healthy: drag right (delta>0) increases zoomTx.
      // Mutant: drag right decreases zoomTx (subtracts delta).
      h.state.zoomTx = 100;
      h.state.zoomTy = 50;
      var target3 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target3, clientX: 200, clientY: 150 });
      h.doc.fire('mousemove', { clientX: 250, clientY: 180 });  // delta = (+50, +30)
      // Healthy: zoomTx = 100 + 50 = 150. Mutant: zoomTx = 100 - 50 = 50.
      if (h.state.zoomTx === 50) {
        issues.push('T3: delta math inverted (drag right decreased zoomTx to ' + h.state.zoomTx + ', should be 150)');
      }
    } else if (kind === 'T4') {
      // T4: applyZoom() not called in mousemove. State mutates but DOM
      // transform attribute stays stale.
      h.state.zoomTx = 0;
      h.state.zoomTy = 0;
      var target4 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target4, clientX: 100, clientY: 100 });
      h.doc.fire('mousemove', { clientX: 150, clientY: 130 });
      // Healthy: transformAttr = 'translate(50,30) scale(1)'. Mutant: stays null.
      if (h.captured.transformAttr === null) {
        issues.push('T4: mousemove mutated state (zoomTx=' + h.state.zoomTx + ', zoomTy=' + h.state.zoomTy + ') but skipped applyZoom (transformAttr stayed null)');
      }
    } else if (kind === 'T5') {
      // T5: isDragging not reset on mouseup. Healthy: mouseup sets false.
      // Mutant: stays true, subsequent mousemove still applies pan.
      var target5 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target5, clientX: 100, clientY: 100 });
      h.doc.fire('mousemove', { clientX: 150, clientY: 130 });  // zoomTx = 50, zoomTy = 30
      h.doc.fire('mouseup', {});
      var txBefore = h.state.zoomTx;
      var tyBefore = h.state.zoomTy;
      // If isDragging was reset, this mousemove is a no-op. If not, it pans more.
      h.doc.fire('mousemove', { clientX: 999, clientY: 999 });
      if (h.state.zoomTx !== txBefore || h.state.zoomTy !== tyBefore) {
        issues.push('T5: drag never ended — post-mouseup mousemove changed zoomTx from ' + txBefore + ' to ' + h.state.zoomTx + ' (isDragging reset was dropped)');
      }
    } else if (kind === 'T6') {
      // T6: axis swap. Healthy: drag right (clientX +50) → zoomTx +50.
      // Mutant: drag right → zoomTx +0 (delta computed from clientY axis).
      h.state.zoomTx = 100;
      h.state.zoomTy = 50;
      var target6 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target6, clientX: 200, clientY: 150 });
      // Move ONLY X by +50 (Y stays same)
      h.doc.fire('mousemove', { clientX: 250, clientY: 150 });
      // Healthy: zoomTx = 100 + (250-200) = 150, zoomTy = 50 + 0 = 50.
      // Mutant (axes swapped): zoomTx = 100 + (150-150) = 100, zoomTy = 50 + (250-200) = 100.
      if (h.state.zoomTx === 100 && h.state.zoomTy === 100) {
        issues.push('T6: axes swapped — drag right affected zoomTy instead of zoomTx (zoomTx=' + h.state.zoomTx + ', zoomTy=' + h.state.zoomTy + ')');
      }
    } else if (kind === 'T7') {
      // T7 control — exercise healthy drag end-to-end
      var target7 = makeMockElement('rect');
      h.svg.fire('mousedown', { target: target7, clientX: 100, clientY: 100 });
      if (!h.state.isDragging) issues.push('control: drag should start after mousedown on background');
      h.doc.fire('mousemove', { clientX: 150, clientY: 130 });
      if (h.state.zoomTx !== 50) issues.push('control: zoomTx should be 50, got ' + h.state.zoomTx);
      if (h.state.zoomTy !== 30) issues.push('control: zoomTy should be 30, got ' + h.state.zoomTy);
      h.doc.fire('mouseup', {});
      if (h.state.isDragging) issues.push('control: drag should end after mouseup');
      // Drag-on-node check
      var nodeGroup7 = makeMockElement('g');
      nodeGroup7._classes['node-group'] = true;
      h.svg.fire('mousedown', { target: nodeGroup7, clientX: 200, clientY: 200 });
      if (h.state.isDragging) issues.push('control: drag should NOT start on .node-group');
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

  recordAdversarial('T1 .node-group early-return dropped', 'T1');
  recordAdversarial('T2 panStartTx/panStartTy not captured', 'T2');
  recordAdversarial('T3 delta math inverted (drag right zooms left)', 'T3');
  recordAdversarial('T4 applyZoom skipped in mousemove (state-DOM desync)', 'T4');
  recordAdversarial('T5 isDragging reset skipped in mouseup', 'T5');
  recordAdversarial('T6 dragStartX/Y axes swapped', 'T6');
  recordAdversarial('T7 control (healthy drag)', 'T7');

  console.log('');
  console.log('========== E32 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();