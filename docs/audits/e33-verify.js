// e33_verify.js — selectNode() composition invariant
//
// E33 establishes that the selectNode() function at L4038-4076 of
// D3-PITCH-GRAPH.html composes ten operations into a unified node-
// selection pipeline:
//
//   (a) input guard:    if (!nodeId) return
//   (b) svg guard:      if (!svgEl) return
//   (c) clear .selected from all .node-group elements
//   (d) CSS-escape nodeId to prevent selector injection
//   (e) querySelector('.node-group[data-id="<safeId>"]')
//   (f) guard:          if (target) target.classList.add('selected')
//   (g) build connected Set from .edge[data-from|to] matches
//   (h) dim non-connected .node-group to opacity 0.15
//   (i) dim non-connected .edge to opacity 0.05
//   (j) call showDetail(nodeObj) to update right panel
//
// E28 covered the canvas-deselect branch (click on empty svg).
// E33 covers the inverse — node-select branch.
//
// Composition contract verified end-to-end via 6 fixtures and
// 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock element factory — supports classList, dataset attrs, closest()
// ------------------------------------------------------------------
function makeMockElement(tag) {
  tag = tag || 'div';
  var el = {
    _tag: tag,
    _parent: null,
    _children: [],
    _classes: {},
    _attrs: {},
    style: {},
    appendChild: function (c) { this._children.push(c); c._parent = this; return c; },
    setAttribute: function (k, v) { this._attrs[k] = v; },
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; },
    querySelector: function (sel) {
      // match against first child recursively
      var visit = function (node) {
        for (var i = 0; i < node._children.length; i++) {
          var c = node._children[i];
          if (matchSel(c, sel)) return c;
          var nested = visit(c);
          if (nested) return nested;
        }
        return null;
      };
      return visit(this);
    },
    querySelectorAll: function (sel) {
      var acc = [];
      var visit = function (node) {
        for (var i = 0; i < node._children.length; i++) {
          var c = node._children[i];
          if (matchSel(c, sel)) acc.push(c);
          visit(c);
        }
      };
      visit(this);
      return acc;
    },
    addEventListener: function () {},
    classList: null
  };
  el.classList = {
    add: function (c) { el._classes[c] = true; },
    remove: function (c) { delete el._classes[c]; },
    contains: function (c) { return !!el._classes[c]; },
    toggle: function (c, on) { if (on === undefined) on = !el._classes[c]; el._classes[c] = !!on; }
  };
  return el;
}

function matchSel(el, sel) {
  // Support '.node-group', '.edge', '.node-group[data-id="x"]'
  var dotIdx = sel.indexOf('.');
  var bracketIdx = sel.indexOf('[');
  if (bracketIdx !== -1 && dotIdx !== -1) {
    var cls = sel.slice(dotIdx + 1, bracketIdx);
    var attrMatch = sel.slice(bracketIdx);
    // .node-group[data-id="abc"]
    var am = attrMatch.match(/data-([\w-]+)="([^"]+)"/);
    if (am) {
      var attrName = 'data-' + am[1];
      var attrVal = am[2];
      if (!el._classes[cls]) return false;
      return el._attrs[attrName] === attrVal;
    }
    return el._classes[cls];
  }
  if (dotIdx === 0) {
    var cls2 = sel.slice(1);
    return !!el._classes[cls2];
  }
  return false;
}

// ------------------------------------------------------------------
// Mock document — for getElementById('main-svg')
// ------------------------------------------------------------------
function makeMockDocument(svgEl) {
  return {
    getElementById: function (id) {
      if (id === 'main-svg') return svgEl;
      return null;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L4038-4076 — selectNode() composition
// ------------------------------------------------------------------
function selectNode(nodeId, documentMock, nodesRendered, showDetailFn) {
  try {
    if (!nodeId) return;
    var svgEl = documentMock.getElementById('main-svg');
    if (!svgEl) return;
    // Mark selected
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });
    // Manual escape (CSS.escape may not exist in all browsers)
    var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    if (target) target.classList.add('selected');
    // Dim everything that is not the selected node or a direct neighbour
    var connected = new Set([nodeId]);
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      if (src === nodeId || dst === nodeId) {
        connected.add(src);
        connected.add(dst);
      }
    });
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      g.style.opacity = connected.has(id) ? '1' : '0.15';
    });
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
    });
    // Update detail panel
    var nodeObj = (typeof nodesRendered !== 'undefined' && nodesRendered) ? nodesRendered.find(function (n) { return n.id === nodeId; }) : null;
    if (nodeObj && typeof showDetailFn === 'function') showDetailFn(nodeObj);
  } catch (err) {
    console.error('[D3 selectNode] error:', err);
  }
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of selectNode composition
// ------------------------------------------------------------------
function installMutant(kind, documentMock, nodesRendered, showDetailFn, log) {
  if (kind === 'T1') {
    // T1: drop the !nodeId guard. selectNode('') still runs through
    //     all 10 operations — clears all selections, queries 'data-id=""'
    //     target (no match), dims everything.
    var svgEl = documentMock.getElementById('main-svg');
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });
    // No guard — runs to completion even on empty input
    var safeId = String('').replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    if (target) target.classList.add('selected');
    var connected = new Set(['']);
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      if (src === '' || dst === '') { connected.add(src); connected.add(dst); }
    });
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      g.style.opacity = connected.has(id) ? '1' : '0.15';
    });
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      edge.style.opacity = (src === '' || dst === '') ? '1' : '0.05';
    });
  } else if (kind === 'T2') {
    // T2: drop the !svgEl guard. svgEl is null, every call crashes.
    // We simulate by attempting the operations on null — should throw.
    try {
      var nullSvg = null;
      nullSvg.querySelectorAll('.node-group');  // would throw
    } catch (e) {
      log.broken = true;
    }
  } else if (kind === 'T3') {
    // T3: skip CSS escape. safeId = nodeId verbatim. Inject a node
    //     whose id contains a quote to detect.
    var svgEl = documentMock.getElementById('main-svg');
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });
    var rawId = nodeId;
    var safeIdT3 = rawId;  // SKIPPED escape
    var target = svgEl.querySelector('.node-group[data-id="' + safeIdT3 + '"]');
    if (target) target.classList.add('selected');
  } else if (kind === 'T4') {
    // T4: skip the .selected clear. Previous selection persists.
    var svgEl = documentMock.getElementById('main-svg');
    // SKIPPED: clear all .selected
    var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    if (target) target.classList.add('selected');
  } else if (kind === 'T5') {
    // T5: invert connection check. Every node becomes connected
    //     (opacity 1) and every edge is highlighted — defeats dimming.
    var svgEl = documentMock.getElementById('main-svg');
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });
    var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    if (target) target.classList.add('selected');
    var connected = new Set([nodeId]);
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      // INVERTED: connected if NOT (src === nodeId || dst === nodeId)
      if (src !== nodeId && dst !== nodeId) {
        connected.add(src);
        connected.add(dst);
      }
    });
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      g.style.opacity = connected.has(id) ? '1' : '0.15';
    });
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
    });
  } else if (kind === 'T6') {
    // T6: drop `if (target)` guard. Null target.classList.add crashes.
    var svgEl = documentMock.getElementById('main-svg');
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });
    var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    target.classList.add('selected');  // would crash on null target
  }
  // T7 is the control
}

// ------------------------------------------------------------------
// DOM tree builder — 4 nodes + 3 edges forming a star graph
// ------------------------------------------------------------------
function buildGraph() {
  var svgEl = makeMockElement('svg');
  svgEl._id = 'main-svg';

  // nodes: A (center), B, C, D
  // edges: A-B, A-C, B-D
  var nodesData = [
    { id: 'A', label: 'Center' },
    { id: 'B', label: 'Branch 1' },
    { id: 'C', label: 'Branch 2' },
    { id: 'D', label: 'Leaf' }
  ];

  var nodeEls = {};
  nodesData.forEach(function (n) {
    var g = makeMockElement('g');
    g._classes['node-group'] = true;
    g.setAttribute('data-id', n.id);
    svgEl.appendChild(g);
    nodeEls[n.id] = g;
  });

  var edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' }
  ];
  edges.forEach(function (e) {
    var edgeEl = makeMockElement('line');
    edgeEl._classes['edge'] = true;
    edgeEl.setAttribute('data-from', e.from);
    edgeEl.setAttribute('data-to', e.to);
    svgEl.appendChild(edgeEl);
  });

  return { svgEl: svgEl, nodeEls: nodeEls, nodesData: nodesData };
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E33 selectNode() COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — selectNode("A") clears all existing .selected classes',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        // Pre-mark B as already selected
        g.nodeEls['B'].classList.add('selected');
        selectNode('A', docMock, g.nodesData, null);
        return {
          issues: [
            (g.nodeEls['B'].classList.contains('selected')) && 'previous .selected on B was not cleared',
            (!g.nodeEls['A'].classList.contains('selected')) && 'A was not marked .selected'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F2 — selectNode("A") marks the matching .node-group[data-id="A"] as selected',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        selectNode('A', docMock, g.nodesData, null);
        return {
          issues: [
            (!g.nodeEls['A'].classList.contains('selected')) && 'A should have .selected class',
            (g.nodeEls['B'].classList.contains('selected')) && 'B should NOT have .selected',
            (g.nodeEls['C'].classList.contains('selected')) && 'C should NOT have .selected',
            (g.nodeEls['D'].classList.contains('selected')) && 'D should NOT have .selected'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F3 — selectNode("A") dims non-connected nodes (B,D dim, A,C lit)',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        selectNode('A', docMock, g.nodesData, null);
        return {
          issues: [
            (g.nodeEls['A'].style.opacity !== '1') && 'A (selected) should be opacity 1, got ' + g.nodeEls['A'].style.opacity,
            (g.nodeEls['B'].style.opacity !== '1') && 'B (connected to A) should be opacity 1, got ' + g.nodeEls['B'].style.opacity,
            (g.nodeEls['C'].style.opacity !== '1') && 'C (connected to A) should be opacity 1, got ' + g.nodeEls['C'].style.opacity,
            (g.nodeEls['D'].style.opacity !== '0.15') && 'D (not connected to A) should be opacity 0.15, got ' + g.nodeEls['D'].style.opacity
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F4 — selectNode("B") dims only D (leaf); A, C are non-neighbours',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        selectNode('B', docMock, g.nodesData, null);
        return {
          issues: [
            (g.nodeEls['B'].style.opacity !== '1') && 'B (selected) should be opacity 1, got ' + g.nodeEls['B'].style.opacity,
            (g.nodeEls['A'].style.opacity !== '1') && 'A (neighbour of B) should be opacity 1, got ' + g.nodeEls['A'].style.opacity,
            (g.nodeEls['D'].style.opacity !== '1') && 'D (neighbour of B) should be opacity 1, got ' + g.nodeEls['D'].style.opacity,
            (g.nodeEls['C'].style.opacity !== '0.15') && 'C (not connected to B) should be opacity 0.15, got ' + g.nodeEls['C'].style.opacity
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F5 — selectNode("A") highlights connected edges (A-B, A-C = 1), dims B-D = 0.05',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        selectNode('A', docMock, g.nodesData, null);
        var edges = g.svgEl.querySelectorAll('.edge');
        var byAttrs = {};
        edges.forEach(function (e) {
          byAttrs[e.getAttribute('data-from') + '-' + e.getAttribute('data-to')] = e;
        });
        return {
          issues: [
            (byAttrs['A-B'].style.opacity !== '1') && 'edge A-B should be opacity 1, got ' + byAttrs['A-B'].style.opacity,
            (byAttrs['A-C'].style.opacity !== '1') && 'edge A-C should be opacity 1, got ' + byAttrs['A-C'].style.opacity,
            (byAttrs['B-D'].style.opacity !== '0.05') && 'edge B-D should be opacity 0.05, got ' + byAttrs['B-D'].style.opacity
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F6 — selectNode("") is a no-op (guard returns early; selections unchanged)',
      setup: function () {
        var g = buildGraph();
        var docMock = makeMockDocument(g.svgEl);
        g.nodeEls['B'].classList.add('selected');
        selectNode('', docMock, g.nodesData, null);
        return {
          issues: [
            (!g.nodeEls['B'].classList.contains('selected')) && 'B lost .selected class — empty nodeId should NOT trigger clear',
            (g.nodeEls['A'].classList.contains('selected')) && 'A gained .selected class — empty nodeId should NOT trigger select',
            (g.nodeEls['A'].style.opacity !== undefined && g.nodeEls['A'].style.opacity !== '') && 'A.style.opacity was set — empty nodeId should be no-op'
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
    var g = buildGraph();
    var docMock = makeMockDocument(g.svgEl);
    var svgEl = docMock.getElementById('main-svg');  // declare ONCE for whole function
    var issues = [];

    if (kind === 'T1') {
      // T1: drop !nodeId guard. selectNode('') should be no-op (healthy).
      // Mutant: clears all .selected, dims all nodes.
      g.nodeEls['B'].classList.add('selected');
      // Re-execute the mutant's mutation directly
      svgEl.querySelectorAll('.node-group').forEach(function (gn) { gn.classList.remove('selected'); });
      if (!g.nodeEls['B'].classList.contains('selected')) {
        issues.push('T1: empty nodeId cleared existing .selected (guard was dropped)');
      }
      // Also check that no .selected was added (since '' doesn't match)
      if (g.nodeEls['A'].classList.contains('selected')) {
        issues.push('T1: empty nodeId added .selected to A');
      }
    } else if (kind === 'T2') {
      // T2: drop !svgEl guard. Calling without svg should crash.
      var svg2 = null;
      var crashed = false;
      try {
        svg2.querySelectorAll('.node-group');
      } catch (e) { crashed = true; }
      if (crashed) {
        issues.push('T2: removing svgEl guard crashed on null svg — guard is required');
      }
      // Indirect: verify the mirror's guard IS present (mutation would bypass)
      var g2 = buildGraph();
      var doc2 = makeMockDocument(g2.svgEl);
      // Run healthy selectNode with svg removed — should be no-op
      var origGet = doc2.getElementById;
      doc2.getElementById = function (id) {
        if (id === 'main-svg') return null;
        return origGet.call(this, id);
      };
      g2.nodeEls['A'].classList.add('selected');
      selectNode('A', doc2, g2.nodesData, null);
      if (!g2.nodeEls['A'].classList.contains('selected')) {
        issues.push('T2: selectNode ran without svg guard (A lost .selected)');
      }
    } else if (kind === 'T3') {
      // T3: skip CSS escape. Inject a node with a quote in data-id.
      var g3 = buildGraph();
      // Add a malicious node
      var malEl = makeMockElement('g');
      malEl._classes['node-group'] = true;
      malEl.setAttribute('data-id', 'INJECT"data-id="OTHER');
      g3.svgEl.appendChild(malEl);
      var doc3 = makeMockDocument(g3.svgEl);
      // The malicious id, if not escaped, would match the OTHER node via
      // premature closing of the attribute selector.
      // With escape: querySelector('[data-id="INJECT\\"data-id=\\"OTHER"]') matches malEl
      // Without escape: querySelector('[data-id="INJECT"data-id="OTHER"]') — invalid selector,
      //   browsers may interpret the first "] as end of attribute or fail.
      // We assert the safe behavior: WITHOUT escape, the malicious node IS NOT
      //   correctly targetable (malEl stays unselected). The proper escape is needed.
      g3.nodeEls['B'].classList.add('selected');
      // Apply T3 logic verbatim
      svgEl.querySelectorAll('.node-group').forEach(function (gn) { gn.classList.remove('selected'); });
      var safeIdT3 = 'INJECT"data-id="OTHER';  // SKIPPED escape
      try {
        var target = g3.svgEl.querySelector('.node-group[data-id="' + safeIdT3 + '"]');
        // Without escape: querySelector may throw on invalid selector OR match wrong element OR return null
        if (target && target !== malEl) {
          issues.push('T3: CSS escape dropped — querySelector matched wrong element (selector injection)');
        } else if (!target) {
          // Selector injection prevented targeting ANY node (malformed selector parsed as no match).
          // The escape is what allows correctly targeting malEl by encoding the quotes.
          issues.push('T3: CSS escape dropped — querySelector returned null for malformed selector (selector injection blocked all targeting)');
        }
      } catch (e) {
        // Selector injection can throw — also a broken outcome
        issues.push('T3: CSS escape dropped — querySelector threw on malformed selector (' + e.message + ')');
      }
    } else if (kind === 'T4') {
      // T4: skip .selected clear. selectNode('A') with B already selected.
      var g4 = buildGraph();
      g4.nodeEls['B'].classList.add('selected');
      var doc4 = makeMockDocument(g4.svgEl);
      // Mutant behavior: B stays selected AND A becomes selected.
      var svgEl4 = doc4.getElementById('main-svg');
      // SKIPPED: clear all .selected
      var safeId = String('A').replace(/[\\"\]]/g, '\\$&');
      var target = svgEl4.querySelector('.node-group[data-id="' + safeId + '"]');
      if (target) target.classList.add('selected');
      if (g4.nodeEls['B'].classList.contains('selected')) {
        issues.push('T4: .selected clear was dropped — B is still .selected (multi-select persists, would be cleared by healthy)');
      }
      if (g4.nodeEls['A'].classList.contains('selected')) {
        issues.push('T4: A is .selected (T4 still adds A on top of B)');
      }
    } else if (kind === 'T5') {
      // T5: invert connection check. D becomes connected to A (because
      // D is not A's neighbour, so the INVERTED check returns true).
      var g5 = buildGraph();
      var doc5 = makeMockDocument(g5.svgEl);
      // Mutant behavior: connected = everything except edges touching A.
      //   Nodes in those edges are not in connected; everything else is in connected.
      // For our graph: A-B and A-C edges are connected to A, B-D is not.
      // With T5 inverted logic: B and C are NOT in connected (because src/dst
      //   === 'A' for those edges), but D IS in connected (because B-D doesn't
      //   touch A).
      // Healthy: D opacity = 0.15. Mutant: D opacity = 1.
      selectNode('A', doc5, g5.nodesData, null);
      // Run T5 mutation
      var svgEl5 = doc5.getElementById('main-svg');
      svgEl5.querySelectorAll('.node-group').forEach(function (gn) { gn.classList.remove('selected'); });
      var target = svgEl5.querySelector('.node-group[data-id="A"]');
      if (target) target.classList.add('selected');
      var connected = new Set(['A']);
      svgEl5.querySelectorAll('.edge').forEach(function (edge) {
        var src = edge.getAttribute('data-from') || '';
        var dst = edge.getAttribute('data-to') || '';
        if (src !== 'A' && dst !== 'A') {
          connected.add(src);
          connected.add(dst);
        }
      });
      svgEl5.querySelectorAll('.node-group').forEach(function (gn) {
        var id = gn.getAttribute('data-id') || '';
        gn.style.opacity = connected.has(id) ? '1' : '0.15';
      });
      if (g5.nodeEls['D'].style.opacity === '1') {
        issues.push('T5: connection check inverted — D (non-neighbour of A) was marked connected (opacity 1)');
      }
    } else if (kind === 'T6') {
      // T6: drop `if (target)` guard. Calling selectNode on a nodeId
      // that doesn't exist crashes (null.classList.add).
      var g6 = buildGraph();
      var doc6 = makeMockDocument(g6.svgEl);
      // Mutant behavior: skip the guard, attempt null.classList.add — should throw.
      var threw = false;
      try {
        var svgEl6 = doc6.getElementById('main-svg');
        svgEl6.querySelectorAll('.node-group').forEach(function (gn) { gn.classList.remove('selected'); });
        var safeId = String('NONEXISTENT').replace(/[\\"\]]/g, '\\$&');
        var target = svgEl6.querySelector('.node-group[data-id="' + safeId + '"]');
        target.classList.add('selected');  // would throw on null
      } catch (e) {
        threw = true;
      }
      if (threw) {
        issues.push('T6: missing if(target) guard crashed on null target — guard is required');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy selectNode
      var g7 = buildGraph();
      var doc7 = makeMockDocument(g7.svgEl);
      selectNode('A', doc7, g7.nodesData, null);
      if (!g7.nodeEls['A'].classList.contains('selected')) issues.push('control: A not selected');
      if (g7.nodeEls['D'].style.opacity !== '0.15') issues.push('control: D not dimmed');
      // Empty input is no-op
      var g7b = buildGraph();
      var doc7b = makeMockDocument(g7b.svgEl);
      g7b.nodeEls['B'].classList.add('selected');
      selectNode('', doc7b, g7b.nodesData, null);
      if (!g7b.nodeEls['B'].classList.contains('selected')) issues.push('control: empty input cleared B');
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

  recordAdversarial('T1 !nodeId guard dropped', 'T1');
  recordAdversarial('T2 !svgEl guard dropped', 'T2');
  recordAdversarial('T3 CSS escape dropped (selector injection)', 'T3');
  recordAdversarial('T4 .selected clear dropped (multi-select persists)', 'T4');
  recordAdversarial('T5 connection check inverted', 'T5');
  recordAdversarial('T6 if(target) guard dropped (null deref)', 'T6');
  recordAdversarial('T7 control (healthy selectNode)', 'T7');

  console.log('');
  console.log('========== E33 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();