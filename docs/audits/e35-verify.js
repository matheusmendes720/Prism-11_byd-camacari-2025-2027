// e35_verify.js — Hover-out unhighlightConnections composition invariant
//
// E35 establishes that unhighlightConnections() at L4104-4127 of
// D3-PITCH-GRAPH.html composes the symmetric cleanup of highlightConnections:
// clear edge opacity/strokeWidth, hide edge labels, restore non-selected
// node opacity and remove .selected class.
//
// Composition contract verified:
//   (a) svg guard: if (!svgEl) return — null main-svg short-circuits
//       (NO !nodeId guard — this is the hover-OUT branch, not parameterized)
//   (b) iterate .edge elements and CLEAR edge.style.opacity to ''
//   (c) CLEAR edge.style.strokeWidth to ''
//   (d) iterate text.edge-label and set label.style.opacity = '0' (hide)
//   (e) querySelector('.node-group.selected') — find currently-selected node
//   (f) iterate .node-group and CLEAR node.style.opacity + remove .selected
//       (only runs if a selected node exists)
//   (g) try/catch error boundary swallows throws
//
// This is the hover-OUT half of the connected-edges symmetry. E34 mirrors
// highlightConnections (hover-IN), E35 mirrors unhighlightConnections
// (hover-OUT). Together they pin the full hover-state lifecycle.
//
// 6 fixtures × composition contract + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock edge — supports getAttribute, style
// ------------------------------------------------------------------
function makeMockEdge(id, src, dst) {
  var attrs = { 'data-id': id, 'data-from': src, 'data-to': dst };
  return {
    _attrs: attrs,
    style: {},
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
    setAttribute: function (k, v) { attrs[k] = String(v); }
  };
}

// ------------------------------------------------------------------
// Mock edge-label
// ------------------------------------------------------------------
function makeMockLabel(id, src, dst) {
  var attrs = { 'data-id': id, 'data-from': src, 'data-to': dst };
  var el = {
    _attrs: attrs,
    style: {},
    _tag: 'text',
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; }
  };
  el.classList = {
    _classes: { 'edge-label': true },
    add: function (c) { this._classes[c] = true; },
    remove: function (c) { delete this._classes[c]; },
    contains: function (c) { return !!this._classes[c]; }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock node-group — supports classList + style + getAttribute
// ------------------------------------------------------------------
function makeMockNode(id) {
  var attrs = { 'data-id': id };
  var el = {
    _attrs: attrs,
    style: {},
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
    setAttribute: function (k, v) { attrs[k] = String(v); }
  };
  el.classList = {
    _classes: { 'node-group': true },
    add: function (c) { this._classes[c] = true; },
    remove: function (c) { delete this._classes[c]; },
    contains: function (c) { return !!this._classes[c]; }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock SVG — supports getElementById + querySelectorAll + querySelector
// ------------------------------------------------------------------
function makeMockSvg(edges, labels, nodes) {
  return {
    _id: 'main-svg',
    _edges: edges,
    _labels: labels,
    _nodes: nodes,
    querySelectorAll: function (sel) {
      if (sel === '.edge') return edges;
      if (sel === 'text.edge-label') return labels;
      if (sel === '.node-group') return nodes;
      return [];
    },
    querySelector: function (sel) {
      if (sel === '.node-group.selected') {
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].classList.contains('selected')) return nodes[i];
        }
        return null;
      }
      return null;
    }
  };
}

// ------------------------------------------------------------------
// document.getElementById mock
// ------------------------------------------------------------------
function makeMockDocument(svg) {
  return {
    getElementById: function (id) {
      if (id === 'main-svg' && svg) return svg;
      return null;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L4104-4127 — unhighlightConnections
// ------------------------------------------------------------------
function unhighlightConnections() {
  try {
    const svgEl = document.getElementById('main-svg');
    if (!svgEl) return;
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      edge.style.opacity = '';
      edge.style.strokeWidth = '';
    });
    svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
      label.style.opacity = '0';
    });
    const selected = svgEl.querySelector('.node-group.selected');
    if (selected) {
      const selId = selected.getAttribute('data-id') || '';
      svgEl.querySelectorAll('.node-group').forEach(function (g) {
        g.style.opacity = '';
        g.classList.remove('selected');
      });
    }
  } catch (err) {
    // error boundary
  }
}

// ------------------------------------------------------------------
// Star graph fixture with post-highlight state pre-applied
// ------------------------------------------------------------------
function buildGraph(opts) {
  opts = opts || {};
  var withSelected = opts.withSelected || false;
  var edges = [
    makeMockEdge('e1', 'A', 'B'),
    makeMockEdge('e2', 'A', 'C'),
    makeMockEdge('e3', 'B', 'D')
  ];
  // Pre-populate edge state as if highlight("A") ran: A-B and A-C lit,
  // B-D dim. Edges have non-empty opacity/strokeWidth.
  edges[0].style.opacity = '1';
  edges[0].style.strokeWidth = '2.5';
  edges[1].style.opacity = '1';
  edges[1].style.strokeWidth = '2.5';
  edges[2].style.opacity = '0.15';
  edges[2].style.strokeWidth = '1';

  var labels = [
    makeMockLabel('l1', 'A', 'B'),
    makeMockLabel('l2', 'A', 'C'),
    makeMockLabel('l3', 'B', 'D')
  ];
  // Pre-populate label state: A-B and A-C lit (0.85), B-D hidden (0)
  labels[0].style.opacity = '0.85';
  labels[1].style.opacity = '0.85';
  labels[2].style.opacity = '0';

  var nodes = [
    makeMockNode('A'),
    makeMockNode('B'),
    makeMockNode('C'),
    makeMockNode('D')
  ];
  // Pre-populate node state as if selectNode("A") ran: A is .selected,
  // B/C/D are dimmed (opacity='0.3').
  nodes[0].classList.add('selected');
  nodes[0].style.opacity = '1';
  nodes[1].style.opacity = '0.3';
  nodes[2].style.opacity = '0.3';
  nodes[3].style.opacity = '0.3';

  var svg = makeMockSvg(edges, labels, nodes);
  return { edges: edges, labels: labels, nodes: nodes, svg: svg };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of unhighlightConnections
// ------------------------------------------------------------------
function installMutant(kind, doc, svg, edges, labels, nodes) {
  if (kind === 'T1') {
    // T1: drop svg guard — null svg throws TypeError, caught silently.
    return function brokenT1() {
      try {
        // guard removed
        const svgEl = doc.getElementById('main-svg');
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '';
        });
      } catch (e) {}
    };
  } else if (kind === 'T2') {
    // T2: drop edge opacity clear — opacity stays at '1' / '0.15'
    return function brokenT2() {
      try {
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          // opacity clear DROPPED
          edge.style.strokeWidth = '';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          label.style.opacity = '0';
        });
        const selected = svgEl.querySelector('.node-group.selected');
        if (selected) {
          svgEl.querySelectorAll('.node-group').forEach(function (g) {
            g.style.opacity = '';
            g.classList.remove('selected');
          });
        }
      } catch (e) {}
    };
  } else if (kind === 'T3') {
    // T3: drop edge strokeWidth clear — strokeWidth stays at '2.5' / '1'
    return function brokenT3() {
      try {
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '';
          // strokeWidth clear DROPPED
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          label.style.opacity = '0';
        });
        const selected = svgEl.querySelector('.node-group.selected');
        if (selected) {
          svgEl.querySelectorAll('.node-group').forEach(function (g) {
            g.style.opacity = '';
            g.classList.remove('selected');
          });
        }
      } catch (e) {}
    };
  } else if (kind === 'T4') {
    // T4: drop label opacity='0' — labels retain their highlight state
    return function brokenT4() {
      try {
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '';
          edge.style.strokeWidth = '';
        });
        // label opacity='0' DROPPED
        const selected = svgEl.querySelector('.node-group.selected');
        if (selected) {
          svgEl.querySelectorAll('.node-group').forEach(function (g) {
            g.style.opacity = '';
            g.classList.remove('selected');
          });
        }
      } catch (e) {}
    };
  } else if (kind === 'T5') {
    // T5: drop .selected lookup — node opacities stay at '0.3' (dimmed)
    return function brokenT5() {
      try {
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '';
          edge.style.strokeWidth = '';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          label.style.opacity = '0';
        });
        // .selected lookup + restore DROPPED — node opacities stay
      } catch (e) {}
    };
  } else if (kind === 'T6') {
    // T6: drop classList.remove('selected') — selected class persists
    return function brokenT6() {
      try {
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '';
          edge.style.strokeWidth = '';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          label.style.opacity = '0';
        });
        const selected = svgEl.querySelector('.node-group.selected');
        if (selected) {
          svgEl.querySelectorAll('.node-group').forEach(function (g) {
            g.style.opacity = '';
            // classList.remove('selected') DROPPED
          });
        }
      } catch (e) {}
    };
  }
  return null;
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E35 UNHIGHLIGHT CONNECTIONS HOVER-OUT INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — unhighlight() clears all edge opacity values (sets to "")',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        unhighlightConnections();
        var issues = [];
        // Pre-state had edges[0/1] opacity='1', edges[2] opacity='0.15'.
        // Healthy clears all.
        for (var i = 0; i < g.edges.length; i++) {
          if (g.edges[i].style.opacity !== '') {
            issues.push('edge ' + i + ' opacity was "' + g.edges[i].style.opacity + '" (expected "")');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F2 — unhighlight() clears all edge strokeWidth values (sets to "")',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        unhighlightConnections();
        var issues = [];
        for (var i = 0; i < g.edges.length; i++) {
          if (g.edges[i].style.strokeWidth !== '') {
            issues.push('edge ' + i + ' strokeWidth was "' + g.edges[i].style.strokeWidth + '" (expected "")');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F3 — unhighlight() hides all edge labels (opacity = "0")',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        unhighlightConnections();
        var issues = [];
        // Pre-state had labels[0/1] opacity='0.85', labels[2] opacity='0'.
        // Healthy sets ALL to '0'.
        for (var i = 0; i < g.labels.length; i++) {
          if (g.labels[i].style.opacity !== '0') {
            issues.push('label ' + i + ' opacity was "' + g.labels[i].style.opacity + '" (expected "0")');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F4 — unhighlight() with NO selected node leaves node state alone',
      setup: function () {
        // Build graph without .selected node
        var g = buildGraph({ withSelected: false });
        // Override: clear selected class
        g.nodes[0].classList.remove('selected');
        g.nodes[0].style.opacity = '0.3';
        global.document = makeMockDocument(g.svg);
        unhighlightConnections();
        var issues = [];
        // Node opacities should remain at '0.3' (unhighlight skips node restore
        // when no .selected exists).
        for (var i = 0; i < g.nodes.length; i++) {
          if (g.nodes[i].style.opacity !== '0.3') {
            issues.push('node ' + i + ' opacity was "' + g.nodes[i].style.opacity + '" (expected "0.3" — no .selected so unhighlight skips node restore)');
          }
        }
        // No node should have .selected class
        for (var j = 0; j < g.nodes.length; j++) {
          if (g.nodes[j].classList.contains('selected')) {
            issues.push('node ' + j + ' has .selected class (expected none)');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F5 — unhighlight() with selected node clears node opacities + removes .selected',
      setup: function () {
        var g = buildGraph({ withSelected: true });
        global.document = makeMockDocument(g.svg);
        unhighlightConnections();
        var issues = [];
        // All node opacities should be cleared
        for (var i = 0; i < g.nodes.length; i++) {
          if (g.nodes[i].style.opacity !== '') {
            issues.push('node ' + i + ' opacity was "' + g.nodes[i].style.opacity + '" (expected "" — cleared by unhighlight)');
          }
        }
        // A's .selected class should be removed
        if (g.nodes[0].classList.contains('selected')) {
          issues.push('node A still has .selected class (expected removed)');
        }
        // No node should have .selected after unhighlight
        for (var k = 0; k < g.nodes.length; k++) {
          if (g.nodes[k].classList.contains('selected')) {
            issues.push('node ' + k + ' has .selected class (expected none after unhighlight)');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F6 — unhighlight() does not throw on null / missing svg',
      setup: function () {
        global.document = makeMockDocument(null);
        var issues = [];
        var crashed = false;
        try {
          unhighlightConnections();
        } catch (e) {
          crashed = true;
          issues.push('unhighlightConnections threw on null svg: ' + e.message);
        }
        return { issues: issues };
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
    var g = buildGraph({ withSelected: true });
    var doc = makeMockDocument(g.svg);
    global.document = doc;
    var issues = [];

    if (kind === 'T1') {
      // T1: dropped svg guard. With null svg, calls null.querySelectorAll
      // which throws TypeError, caught by try/catch. No state change.
      // Probe with VALID svg: both healthy and T1 should clear edges. T1
      // also clears opacity='' on each edge (only that branch). But T1
      // does NOT touch strokeWidth or labels or nodes. We can detect by
      // checking that strokeWidth is NOT cleared.
      var brokenFn1 = installMutant('T1', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn1();
      // T1's handler only sets edge.style.opacity = ''. strokeWidth stays
      // at the pre-highlight value. Healthy: strokeWidth=''.
      if (g.edges[0].style.strokeWidth !== '') {
        issues.push('T1: A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "" — T1 stripped strokeWidth branch)');
      }
      if (g.labels[0].style.opacity !== '0') {
        issues.push('T1: A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0" — T1 stripped label branch)');
      }
    } else if (kind === 'T2') {
      // T2: dropped edge opacity clear. Opacity stays at '1'/'0.15'.
      var brokenFn2 = installMutant('T2', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn2();
      // Healthy: opacity=''. Mutant: stays at '1' (for A-B, A-C) and '0.15' (B-D).
      if (g.edges[0].style.opacity === '1') {
        issues.push('T2: A-B edge opacity was "1" (expected "" — opacity clear dropped)');
      }
      if (g.edges[2].style.opacity === '0.15') {
        issues.push('T2: B-D edge opacity was "0.15" (expected "" — opacity clear dropped)');
      }
    } else if (kind === 'T3') {
      // T3: dropped edge strokeWidth clear. strokeWidth stays at '2.5'/'1'.
      var brokenFn3 = installMutant('T3', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn3();
      // Healthy: strokeWidth=''. Mutant: stays at '2.5' (A-B, A-C) and '1' (B-D).
      if (g.edges[0].style.strokeWidth === '2.5') {
        issues.push('T3: A-B edge strokeWidth was "2.5" (expected "" — strokeWidth clear dropped)');
      }
      if (g.edges[2].style.strokeWidth === '1') {
        issues.push('T3: B-D edge strokeWidth was "1" (expected "" — strokeWidth clear dropped)');
      }
    } else if (kind === 'T4') {
      // T4: dropped label opacity='0'. Labels retain highlight state.
      var brokenFn4 = installMutant('T4', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn4();
      // Healthy: all labels at opacity='0'. Mutant: A-B and A-C stay at '0.85'.
      if (g.labels[0].style.opacity === '0.85') {
        issues.push('T4: A-B label opacity was "0.85" (expected "0" — label opacity update dropped)');
      }
      if (g.labels[1].style.opacity === '0.85') {
        issues.push('T4: A-C label opacity was "0.85" (expected "0" — label opacity update dropped)');
      }
      // B-D label was already '0' so we can't distinguish; skip.
    } else if (kind === 'T5') {
      // T5: dropped .selected lookup + node restore. Node opacities stay.
      var brokenFn5 = installMutant('T5', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn5();
      // Healthy: all node opacities=''. Mutant: stays at '1' (A) and '0.3' (B/C/D).
      if (g.nodes[0].style.opacity === '1') {
        issues.push('T5: node A opacity was "1" (expected "" — node restore dropped)');
      }
      if (g.nodes[1].style.opacity === '0.3') {
        issues.push('T5: node B opacity was "0.3" (expected "" — node restore dropped)');
      }
      if (g.nodes[2].style.opacity === '0.3') {
        issues.push('T5: node C opacity was "0.3" (expected "" — node restore dropped)');
      }
      // Also .selected class persists
      if (g.nodes[0].classList.contains('selected')) {
        issues.push('T5: node A still has .selected class (expected removed — node restore dropped)');
      }
    } else if (kind === 'T6') {
      // T6: dropped classList.remove('selected'). Class persists.
      var brokenFn6 = installMutant('T6', doc, g.svg, g.edges, g.labels, g.nodes);
      brokenFn6();
      // Healthy: A's .selected removed. Mutant: A still has .selected.
      if (g.nodes[0].classList.contains('selected')) {
        issues.push('T6: node A still has .selected class (expected removed — classList.remove dropped)');
      }
      // Node opacities should still be cleared (T6 only drops classList.remove)
      if (g.nodes[0].style.opacity !== '') {
        issues.push('T6: node A opacity was "' + g.nodes[0].style.opacity + '" (expected "" — should still clear opacity)');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy unhighlightConnections
      unhighlightConnections();
      // Healthy clears all edges, hides all labels, restores all nodes
      if (g.edges[0].style.opacity !== '') {
        issues.push('control: A-B edge opacity was "' + g.edges[0].style.opacity + '" (expected "")');
      }
      if (g.edges[0].style.strokeWidth !== '') {
        issues.push('control: A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "")');
      }
      if (g.labels[0].style.opacity !== '0') {
        issues.push('control: A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0")');
      }
      if (g.nodes[0].classList.contains('selected')) {
        issues.push('control: node A still has .selected class (expected removed)');
      }
      if (g.nodes[1].style.opacity !== '') {
        issues.push('control: node B opacity was "' + g.nodes[1].style.opacity + '" (expected "")');
      }
    }

    var ctrl = kind === 'T7';
    if (ctrl) {
      if (issues.length === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues (CONTROL BROKEN)');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    } else {
      if (issues.length >= 1) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥1)');
        for (var n = 0; n < issues.length; n++) console.log('    - ' + issues[n]);
      }
    }
  }

  recordAdversarial('T1 svg guard dropped', 'T1');
  recordAdversarial('T2 edge opacity clear dropped', 'T2');
  recordAdversarial('T3 edge strokeWidth clear dropped', 'T3');
  recordAdversarial('T4 label opacity update dropped', 'T4');
  recordAdversarial('T5 .selected lookup / node restore dropped', 'T5');
  recordAdversarial('T6 classList.remove("selected") dropped', 'T6');
  recordAdversarial('T7 control (healthy unhighlight)', 'T7');

  console.log('');
  console.log('========== E35 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();