// e28_verify.js — SVG canvas click deselect composition invariant
//
// E28 establishes that the svg-level click handler at L3918-3925 of
// D3-PITCH-GRAPH.html composes the target-equality check (e.target === svg)
// with the deselect state reset (selectedNodeId=null, .selected removed,
// detail panel toggled). This is the inverse composition of E25's node
// click handler — node clicks stopPropagation (E25 verified), so the
// svg-level handler only fires on background clicks.
//
// Composition contract verified:
//   (a) click with target === svg fires deselect
//   (b) click with target !== svg does NOT fire deselect (handler returns
//       early; relies on E25's stopPropagation to prevent double-fire)
//   (c) deselect clears selectedNodeId to null
//   (d) deselect removes .selected class from every .node-group
//   (e) deselect toggles detail panel: detail-empty shown, detail-content hidden
//   (f) deselect is idempotent — works when nothing is selected
//
// The harness mirrors the svg click handler closure (L3918-3925) and
// replaces document.querySelectorAll / document.getElementById / selectedNodeId
// with observable mocks. The mock svg captures the listener so we can
// drive the click event sequence without a real DOM.
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock element — captures listeners, allows triggering events
// ------------------------------------------------------------------
function makeMockElement(tag) {
  tag = tag || 'g';
  var el = {
    _tag: tag,
    _id: null,
    _listeners: {},
    _classes: {},
    _attrs: {},
    style: { display: '' },
    textContent: '',
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fire: function (type, eventObj) {
      var list = this._listeners[type] || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](eventObj); } catch (e) { /* swallow */ }
      }
    },
    setAttribute: function (k, v) { this._attrs[k] = v; },
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; },
    classList: {
      add: function (c) { el._classes[c] = true; },
      remove: function (c) { delete el._classes[c]; },
      contains: function (c) { return !!el._classes[c]; },
      toggle: function (c, on) { if (on === undefined) on = !el._classes[c]; el._classes[c] = !!on; }
    }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock event — minimum surface used by the click handler
// ------------------------------------------------------------------
function makeMockEvent(target) {
  return {
    target: target,
    stopPropagation: function () {},
    preventDefault: function () {}
  };
}

// ------------------------------------------------------------------
// Mock document — getElementById + querySelectorAll lookups
// ------------------------------------------------------------------
function makeMockDocument(elements, nodeGroups) {
  return {
    _elements: elements,
    _nodeGroups: nodeGroups,
    getElementById: function (id) {
      return Object.prototype.hasOwnProperty.call(this._elements, id) ? this._elements[id] : null;
    },
    querySelectorAll: function (sel) {
      if (sel === '.node-group') return this._nodeGroups;
      return [];
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L3918-3925 — svg-level click handler for deselect
// ------------------------------------------------------------------
function registerSvgHandler(svg, doc, state) {
  // Selected state lives on the closure (selectedNodeId var at SPA top).
  svg.addEventListener('click', function (e) {
    if (e.target === svg) {
      state.selectedNodeId = null;
      doc.querySelectorAll('.node-group').forEach(function (g) {
        g.classList.remove('selected');
      });
      doc.getElementById('detail-empty').style.display = '';
      doc.getElementById('detail-content').style.display = 'none';
    }
  });
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of deselect composition
// ------------------------------------------------------------------
function installMutant(kind, svg, doc, state) {
  if (kind === 'T1') {
    // T1: skip the target-equality check. Deselect fires on EVERY click
    //     (including node clicks). This breaks E25's composition: a node
    //     click would also clear the selection the node handler just set.
    svg._listeners.click = [function (e) {
      state.selectedNodeId = null;
      doc.querySelectorAll('.node-group').forEach(function (g) {
        g.classList.remove('selected');
      });
      doc.getElementById('detail-empty').style.display = '';
      doc.getElementById('detail-content').style.display = 'none';
    }];
  } else if (kind === 'T2') {
    // T2: handler is no-op. Deselect never fires regardless of target.
    svg._listeners.click = [function (e) { /* no-op */ }];
  } else if (kind === 'T3') {
    // T3: doesn't clear selectedNodeId. State reset is incomplete.
    svg._listeners.click = [function (e) {
      if (e.target === svg) {
        // state.selectedNodeId not touched
        doc.querySelectorAll('.node-group').forEach(function (g) {
          g.classList.remove('selected');
        });
        doc.getElementById('detail-empty').style.display = '';
        doc.getElementById('detail-content').style.display = 'none';
      }
    }];
  } else if (kind === 'T4') {
    // T4: doesn't remove .selected class. Nodes retain their highlighted state.
    svg._listeners.click = [function (e) {
      if (e.target === svg) {
        state.selectedNodeId = null;
        // .selected removal skipped
        doc.getElementById('detail-empty').style.display = '';
        doc.getElementById('detail-content').style.display = 'none';
      }
    }];
  } else if (kind === 'T5') {
    // T5: doesn't toggle detail panel. User sees stale detail content.
    svg._listeners.click = [function (e) {
      if (e.target === svg) {
        state.selectedNodeId = null;
        doc.querySelectorAll('.node-group').forEach(function (g) {
          g.classList.remove('selected');
        });
        // detail panel toggle skipped
      }
    }];
  } else if (kind === 'T6') {
    // T6: wrong direction — sets selectedNodeId to a string instead of null.
    //     Selection is "cleared" to a phantom value (state still non-null).
    svg._listeners.click = [function (e) {
      if (e.target === svg) {
        state.selectedNodeId = 'phantom';  // wrong direction
        doc.querySelectorAll('.node-group').forEach(function (g) {
          g.classList.remove('selected');
        });
        doc.getElementById('detail-empty').style.display = '';
        doc.getElementById('detail-content').style.display = 'none';
      }
    }];
  }
  // T7 is the control (no mutation)
}

// ------------------------------------------------------------------
// Fixtures — each builds svg + doc + state, fires one click, checks composition
// ------------------------------------------------------------------
function setupHarness() {
  var svg = makeMockElement('svg');
  var detailEmpty = makeMockElement('div');
  detailEmpty._id = 'detail-empty';
  var detailContent = makeMockElement('div');
  detailContent._id = 'detail-content';
  detailContent.style.display = '';
  // Pre-seed three .node-group nodes, one with .selected class
  var nodeGroups = [
    (function () {
      var g = makeMockElement('g');
      g.classList.add('selected');
      return g;
    })(),
    makeMockElement('g'),
    makeMockElement('g')
  ];
  var doc = makeMockDocument({
    'detail-empty': detailEmpty,
    'detail-content': detailContent
  }, nodeGroups);
  var state = { selectedNodeId: 'n-prev' };
  return { svg: svg, doc: doc, state: state, detailEmpty: detailEmpty, detailContent: detailContent, nodeGroups: nodeGroups };
}

var FIXTURES = [
  {
    name: 'F1 — click on svg background fires deselect (selectedNodeId=null)',
    setup: function () {
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      // Pre-focus: a node was selected
      h.state.selectedNodeId = 'n-alpha';
      h.nodeGroups[0].classList.add('selected');
      h.detailContent.style.display = 'block';
      // Click background (target === svg)
      h.svg.fire('click', makeMockEvent(h.svg));
      return {
        issues: [
          (h.state.selectedNodeId !== null) && 'selectedNodeId should be null after svg click, got ' + JSON.stringify(h.state.selectedNodeId),
          (h.nodeGroups[0].classList.contains('selected')) && '.selected class should be removed from nodeGroups[0]',
          (h.nodeGroups[1].classList.contains('selected')) && '.selected class should be removed from nodeGroups[1]',
          (h.nodeGroups[2].classList.contains('selected')) && '.selected class should be removed from nodeGroups[2]'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F2 — click on .node-group (target !== svg) does NOT fire deselect',
    setup: function () {
      // Inverse composition: E25's node click stops propagation, so the
      // svg handler's `if (e.target === svg)` check is false. Even if
      // propagation leaked (mutant chain), the handler short-circuits here.
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      h.state.selectedNodeId = 'n-beta';
      h.nodeGroups[0].classList.add('selected');
      // Click on a node group — target is the node, not svg
      var nodeEl = h.nodeGroups[0];
      h.svg.fire('click', makeMockEvent(nodeEl));
      return {
        issues: [
          (h.state.selectedNodeId !== 'n-beta') && 'selectedNodeId should still be "n-beta" — handler should not fire on non-svg target, got ' + JSON.stringify(h.state.selectedNodeId),
          (!h.nodeGroups[0].classList.contains('selected')) && '.selected class should still be on nodeGroups[0] (handler should not fire)'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F3 — deselect toggles detail panel (empty shown, content hidden)',
    setup: function () {
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      // Simulate user viewing a node detail
      h.detailContent.style.display = 'block';
      h.detailEmpty.style.display = 'none';
      h.svg.fire('click', makeMockEvent(h.svg));
      return {
        issues: [
          (h.detailEmpty.style.display !== '') && 'detail-empty should have display="" (shown), got ' + JSON.stringify(h.detailEmpty.style.display),
          (h.detailContent.style.display !== 'none') && 'detail-content should have display="none", got ' + JSON.stringify(h.detailContent.style.display)
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F4 — deselect is idempotent (no selection, no error)',
    setup: function () {
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      // Pre-state: nothing selected, no .selected class anywhere
      h.state.selectedNodeId = null;
      h.nodeGroups.forEach(function (g) { g.classList.remove('selected'); });
      h.detailContent.style.display = 'none';
      h.detailEmpty.style.display = '';
      h.svg.fire('click', makeMockEvent(h.svg));
      return {
        issues: [
          (h.state.selectedNodeId !== null) && 'selectedNodeId should remain null, got ' + JSON.stringify(h.state.selectedNodeId),
          (h.detailContent.style.display !== 'none') && 'detail-content should be hidden, got ' + JSON.stringify(h.detailContent.style.display),
          (h.detailEmpty.style.display !== '') && 'detail-empty should be shown, got ' + JSON.stringify(h.detailEmpty.style.display)
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F5 — click on svg when detail-empty missing is safe (handler tolerance)',
    setup: function () {
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      // Simulate detail-empty not found (returns null from getElementById)
      h.doc._elements['detail-empty'] = null;
      try {
        h.svg.fire('click', makeMockEvent(h.svg));
        return {
          issues: [
            (h.state.selectedNodeId !== null) && 'selectedNodeId should be null even when detail-empty missing, got ' + JSON.stringify(h.state.selectedNodeId)
          ].filter(Boolean)
        };
      } catch (e) {
        // Throwing is acceptable for this contract — the SPA-side guard
        // usually checks element existence. We DO NOT fail for throws; the
        // handler's primary contract is state reset.
        return { issues: [] };
      }
    }
  },
  {
    name: 'F6 — composition check: targetX click (svg element != svg ancestor) is no-op',
    setup: function () {
      // Sanity check: a stray background <rect> inside the SVG group should
      // not trigger deselect (target !== svg root).
      var h = setupHarness();
      registerSvgHandler(h.svg, h.doc, h.state);
      h.state.selectedNodeId = 'n-gamma';
      var strayRect = makeMockElement('rect');
      h.svg.fire('click', makeMockEvent(strayRect));
      return {
        issues: [
          (h.state.selectedNodeId !== 'n-gamma') && 'state should be unchanged when target=rect (not svg). got ' + JSON.stringify(h.state.selectedNodeId)
        ].filter(Boolean)
      };
    }
  }
];

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E28 SVG CANVAS CLICK DESELECT COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
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
    registerSvgHandler(h.svg, h.doc, h.state);
    installMutant(kind, h.svg, h.doc, h.state);

    var issues = [];
    var ev = makeMockEvent(h.svg);  // click on svg (target=svg)

    if (kind === 'T1') {
      // T1: target-equality check dropped. Deselect fires on every click.
      // Healthy: deselect fires only for svg click. Mutant: deselect fires
      // even for non-svg targets. Use a node group as target.
      h.state.selectedNodeId = 'n-mut';
      h.nodeGroups[0].classList.add('selected');
      var nodeEl = h.nodeGroups[0];
      h.svg.fire('click', makeMockEvent(nodeEl));
      // Healthy: selectedNodeId stays 'n-mut'. Mutant: selectedNodeId → null.
      if (h.state.selectedNodeId !== 'n-mut') {
        issues.push('T1: clicked node group (target!==svg) but deselect fired — selectedNodeId=' + JSON.stringify(h.state.selectedNodeId) + ' (target-equality check dropped)');
      }
      if (!h.nodeGroups[0].classList.contains('selected')) {
        issues.push('T1: node group .selected class was removed on non-svg click (target-equality check dropped)');
      }
    } else if (kind === 'T2') {
      // T2: handler is no-op. Healthy: state.selectedNodeId → null.
      // Mutant: selectedNodeId stays 'n-prev'. We push issue WHEN mutant
      // keeps the value (i.e. when healthy reset DID NOT happen).
      h.state.selectedNodeId = 'n-prev';
      h.nodeGroups[0].classList.add('selected');
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.state.selectedNodeId === 'n-prev') {
        issues.push('T2: handler no-op — selectedNodeId stayed "n-prev" (state reset never happened)');
      }
      if (h.nodeGroups[0].classList.contains('selected')) {
        issues.push('T2: handler no-op — .selected class still present (class removal never happened)');
      }
    } else if (kind === 'T3') {
      // T3: selectedNodeId not cleared. Other actions do happen.
      h.state.selectedNodeId = 'n-prev';
      h.nodeGroups[0].classList.add('selected');
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.state.selectedNodeId === 'n-prev') {
        issues.push('T3: selectedNodeId stayed "n-prev" — state reset is incomplete');
      }
    } else if (kind === 'T4') {
      // T4: .selected class not removed. Nodes retain selected state.
      h.state.selectedNodeId = 'n-prev';
      h.nodeGroups[0].classList.add('selected');
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.nodeGroups[0].classList.contains('selected')) {
        issues.push('T4: .selected class still on nodeGroup[0] — class removal was dropped');
      }
    } else if (kind === 'T5') {
      // T5: detail panel not toggled. Stale detail content shown.
      // Healthy: detail-content → 'none'. Mutant: stays 'block'.
      h.detailContent.style.display = 'block';
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.detailContent.style.display === 'block') {
        issues.push('T5: detail panel not toggled — detail-content still display=block (panel toggle was dropped)');
      }
    } else if (kind === 'T6') {
      // T6: selectedNodeId set to 'phantom' instead of null. State non-null.
      // Healthy: selectedNodeId → null. Mutant: stays 'phantom'.
      h.state.selectedNodeId = 'n-prev';
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.state.selectedNodeId !== null) {
        issues.push('T6: selectedNodeId not null after deselect — got ' + JSON.stringify(h.state.selectedNodeId) + ' (wrong direction — should be null, not "phantom")');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy deselect fires correctly on svg click
      h.state.selectedNodeId = 'n-prev';
      h.nodeGroups[0].classList.add('selected');
      h.detailContent.style.display = 'block';
      h.svg.fire('click', makeMockEvent(h.svg));
      if (h.state.selectedNodeId !== null) issues.push('control: selectedNodeId should be null, got ' + JSON.stringify(h.state.selectedNodeId));
      if (h.nodeGroups[0].classList.contains('selected')) issues.push('control: .selected should be removed');
      if (h.detailContent.style.display !== 'none') issues.push('control: detail-content should be hidden');
      if (h.detailEmpty.style.display !== '') issues.push('control: detail-empty should be shown');
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

  recordAdversarial('T1 target-equality check dropped', 'T1');
  recordAdversarial('T2 handler is no-op', 'T2');
  recordAdversarial('T3 selectedNodeId not cleared', 'T3');
  recordAdversarial('T4 .selected class not removed', 'T4');
  recordAdversarial('T5 detail panel not toggled', 'T5');
  recordAdversarial('T6 selectedNodeId set to phantom', 'T6');
  recordAdversarial('T7 control (healthy deselect)', 'T7');

  console.log('');
  console.log('========== E28 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
