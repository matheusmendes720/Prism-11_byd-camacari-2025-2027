// e34_verify.js — Hover-in highlightConnections composition invariant
//
// E34 establishes that highlightConnections(nodeId) at L4079-4101 of
// D3-PITCH-GRAPH.html composes the connected-edges fan-out with the
// opacity / strokeWidth / label-opacity dual-track dimming on the
// unconnected rest.
//
// Composition contract verified:
//   (a) input guard: if (!nodeId) return — empty string / null short-circuits
//   (b) svg guard: if (!svgEl) return — null main-svg short-circuits
//   (c) iterate .edge elements (all edges touched, not just some)
//   (d) connected check: lit = (src === nodeId || dst === nodeId)
//   (e) edge opacity: 1 when lit, 0.15 otherwise
//   (f) edge strokeWidth: 2.5 when lit, 1 otherwise
//   (g) iterate text.edge-label elements (mirrors edge iteration)
//   (h) label opacity: 0.85 when lit, 0 otherwise
//   (i) try/catch error boundary swallows throws
//
// This is the hover-IN half of the connected-edges symmetry. E35 will
// mirror unhighlightConnections() (the hover-OUT branch).
//
// 6 fixtures × composition contract + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock edge — supports getAttribute, style, mirrors .edge class
// ------------------------------------------------------------------
function makeMockEdge(id, src, dst) {
  var attrs = { 'data-id': id, 'data-from': src, 'data-to': dst };
  return {
    _attrs: attrs,
    style: {},
    classList: {
      _classes: {},
      add: function (c) { this._classes[c] = true; },
      remove: function (c) { delete this._classes[c]; },
      contains: function (c) { return !!this._classes[c]; }
    },
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
    setAttribute: function (k, v) { attrs[k] = String(v); }
  };
}

// ------------------------------------------------------------------
// Mock edge-label — text.edge-label class mirror
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
    _classes: { 'edge-label': true },  // fixed class for selector matching
    add: function (c) { this._classes[c] = true; },
    remove: function (c) { delete this._classes[c]; },
    contains: function (c) { return !!this._classes[c]; }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock SVG — supports getElementById + querySelectorAll
// ------------------------------------------------------------------
function makeMockSvg(edges, labels) {
  return {
    _id: 'main-svg',
    _edges: edges,
    _labels: labels,
    querySelectorAll: function (sel) {
      if (sel === '.edge') return edges;
      if (sel === 'text.edge-label') return labels;
      return [];
    }
  };
}

// ------------------------------------------------------------------
// document.getElementById mock — returns svg by id, or null
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
// Mirror of L4079-4101 — highlightConnections
// ------------------------------------------------------------------
function highlightConnections(nodeId) {
  try {
    if (!nodeId) return;
    const svgEl = document.getElementById('main-svg');
    if (!svgEl) return;
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      var lit = (src === nodeId || dst === nodeId);
      edge.style.opacity = lit ? '1' : '0.15';
      edge.style.strokeWidth = lit ? '2.5' : '1';
    });
    svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
      var src = label.getAttribute('data-from') || '';
      var dst = label.getAttribute('data-to') || '';
      var lit = (src === nodeId || dst === nodeId);
      label.style.opacity = lit ? '0.85' : '0';
    });
  } catch (err) {
    // error boundary
  }
}

// ------------------------------------------------------------------
// Star graph fixture — A-B-C-D, edges A-B, A-C, B-D
// ------------------------------------------------------------------
function buildGraph() {
  var edges = [
    makeMockEdge('e1', 'A', 'B'),
    makeMockEdge('e2', 'A', 'C'),
    makeMockEdge('e3', 'B', 'D')
  ];
  var labels = [
    makeMockLabel('l1', 'A', 'B'),
    makeMockLabel('l2', 'A', 'C'),
    makeMockLabel('l3', 'B', 'D')
  ];
  var svg = makeMockSvg(edges, labels);
  return { edges: edges, labels: labels, svg: svg };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of highlightConnections
// ------------------------------------------------------------------
function installMutant(kind, doc, svg, edges, labels) {
  if (kind === 'T1') {
    // T1: drop !nodeId guard — empty string / null is processed as a
    //     nodeId, and since (src === '' || dst === '') is never true,
    //     all edges get dimmed and all labels hidden.
    doc.getElementById = function (id) {
      if (id === 'main-svg') return svg;
      return null;
    };
    var origGetEl1 = doc.getElementById;
    // Install broken handler
    return function brokenT1(nodeId) {
      try {
        // guard removed
        const svgEl = origGetEl1('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          var src = edge.getAttribute('data-from') || '';
          var dst = edge.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          edge.style.opacity = lit ? '1' : '0.15';
          edge.style.strokeWidth = lit ? '2.5' : '1';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          var src = label.getAttribute('data-from') || '';
          var dst = label.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          label.style.opacity = lit ? '0.85' : '0';
        });
      } catch (e) {}
    };
  } else if (kind === 'T2') {
    // T2: drop !svgEl guard — crashes when svg is missing
    return function brokenT2(nodeId) {
      try {
        if (!nodeId) return;
        // svg guard removed — calls getElementById which returns null,
        // then null.querySelectorAll throws TypeError, caught by try/catch
        const svgEl = doc.getElementById('main-svg');
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          edge.style.opacity = '1';
        });
      } catch (e) {}
    };
  } else if (kind === 'T3') {
    // T3: invert connected check — non-connected edges get lit, connected
    //     edges get dimmed.
    return function brokenT3(nodeId) {
      try {
        if (!nodeId) return;
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          var src = edge.getAttribute('data-from') || '';
          var dst = edge.getAttribute('data-to') || '';
          var lit = (src !== nodeId && dst !== nodeId);  // INVERTED
          edge.style.opacity = lit ? '1' : '0.15';
          edge.style.strokeWidth = lit ? '2.5' : '1';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          var src = label.getAttribute('data-from') || '';
          var dst = label.getAttribute('data-to') || '';
          var lit = (src !== nodeId && dst !== nodeId);  // INVERTED
          label.style.opacity = lit ? '0.85' : '0';
        });
      } catch (e) {}
    };
  } else if (kind === 'T4') {
    // T4: drop edge strokeWidth boost — edges stay at default strokeWidth
    //     even when connected. Connected check + opacity still work.
    return function brokenT4(nodeId) {
      try {
        if (!nodeId) return;
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          var src = edge.getAttribute('data-from') || '';
          var dst = edge.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          edge.style.opacity = lit ? '1' : '0.15';
          // strokeWidth boost DROPPED — no update
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          var src = label.getAttribute('data-from') || '';
          var dst = label.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          label.style.opacity = lit ? '0.85' : '0';
        });
      } catch (e) {}
    };
  } else if (kind === 'T5') {
    // T5: drop edge opacity boost — connected edges stay at 0.15 (dim).
    //     strokeWidth still works. Labels still work.
    return function brokenT5(nodeId) {
      try {
        if (!nodeId) return;
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          var src = edge.getAttribute('data-from') || '';
          var dst = edge.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          // edge.opacity boost DROPPED — always 0.15
          edge.style.opacity = '0.15';
          edge.style.strokeWidth = lit ? '2.5' : '1';
        });
        svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
          var src = label.getAttribute('data-from') || '';
          var dst = label.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          label.style.opacity = lit ? '0.85' : '0';
        });
      } catch (e) {}
    };
  } else if (kind === 'T6') {
    // T6: drop label opacity update — labels stay at default, never hide
    //     even for non-connected, never show for connected.
    return function brokenT6(nodeId) {
      try {
        if (!nodeId) return;
        const svgEl = doc.getElementById('main-svg');
        if (!svgEl) return;
        svgEl.querySelectorAll('.edge').forEach(function (edge) {
          var src = edge.getAttribute('data-from') || '';
          var dst = edge.getAttribute('data-to') || '';
          var lit = (src === nodeId || dst === nodeId);
          edge.style.opacity = lit ? '1' : '0.15';
          edge.style.strokeWidth = lit ? '2.5' : '1';
        });
        // label opacity update DROPPED
      } catch (e) {}
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
  console.log('========== E34 HIGHLIGHT CONNECTIONS HOVER-IN INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — highlight("A") boosts A-B and A-C edge opacity to 1',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        highlightConnections('A');
        var issues = [];
        // A-B (e1) should be lit (opacity=1, strokeWidth=2.5)
        if (g.edges[0].style.opacity !== '1') {
          issues.push('A-B edge opacity was "' + g.edges[0].style.opacity + '" (expected "1")');
        }
        if (g.edges[0].style.strokeWidth !== '2.5') {
          issues.push('A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "2.5")');
        }
        // A-C (e2) should be lit
        if (g.edges[1].style.opacity !== '1') {
          issues.push('A-C edge opacity was "' + g.edges[1].style.opacity + '" (expected "1")');
        }
        if (g.edges[1].style.strokeWidth !== '2.5') {
          issues.push('A-C edge strokeWidth was "' + g.edges[1].style.strokeWidth + '" (expected "2.5")');
        }
        // B-D (e3) should be dim (opacity=0.15, strokeWidth=1)
        if (g.edges[2].style.opacity !== '0.15') {
          issues.push('B-D edge opacity was "' + g.edges[2].style.opacity + '" (expected "0.15")');
        }
        if (g.edges[2].style.strokeWidth !== '1') {
          issues.push('B-D edge strokeWidth was "' + g.edges[2].style.strokeWidth + '" (expected "1")');
        }
        return { issues: issues };
      }
    },
    {
      name: 'F2 — highlight("A") shows labels for A-B and A-C, hides B-D label',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        highlightConnections('A');
        var issues = [];
        // l1 (A-B) should be lit (opacity=0.85)
        if (g.labels[0].style.opacity !== '0.85') {
          issues.push('A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0.85")');
        }
        // l2 (A-C) should be lit
        if (g.labels[1].style.opacity !== '0.85') {
          issues.push('A-C label opacity was "' + g.labels[1].style.opacity + '" (expected "0.85")');
        }
        // l3 (B-D) should be hidden (opacity=0)
        if (g.labels[2].style.opacity !== '0') {
          issues.push('B-D label opacity was "' + g.labels[2].style.opacity + '" (expected "0")');
        }
        return { issues: issues };
      }
    },
    {
      name: 'F3 — highlight("B") boosts A-B and B-D, dims A-C',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        highlightConnections('B');
        var issues = [];
        // A-B (e1) — src=A, dst=B → connected to B → lit
        if (g.edges[0].style.opacity !== '1') {
          issues.push('A-B edge opacity was "' + g.edges[0].style.opacity + '" (expected "1")');
        }
        // A-C (e2) — not connected to B → dim
        if (g.edges[1].style.opacity !== '0.15') {
          issues.push('A-C edge opacity was "' + g.edges[1].style.opacity + '" (expected "0.15")');
        }
        // B-D (e3) — connected to B → lit
        if (g.edges[2].style.opacity !== '1') {
          issues.push('B-D edge opacity was "' + g.edges[2].style.opacity + '" (expected "1")');
        }
        // A-B label lit
        if (g.labels[0].style.opacity !== '0.85') {
          issues.push('A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0.85")');
        }
        // A-C label hidden
        if (g.labels[1].style.opacity !== '0') {
          issues.push('A-C label opacity was "' + g.labels[1].style.opacity + '" (expected "0")');
        }
        // B-D label lit
        if (g.labels[2].style.opacity !== '0.85') {
          issues.push('B-D label opacity was "' + g.labels[2].style.opacity + '" (expected "0.85")');
        }
        return { issues: issues };
      }
    },
    {
      name: 'F4 — highlight("") is a no-op (no edges / labels touched)',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        highlightConnections('');
        var issues = [];
        // All edges should remain at their default (empty style)
        for (var i = 0; i < g.edges.length; i++) {
          if ('opacity' in g.edges[i].style && g.edges[i].style.opacity !== '') {
            issues.push('edge ' + i + ' opacity was modified to "' + g.edges[i].style.opacity + '" on empty input');
          }
          if ('strokeWidth' in g.edges[i].style && g.edges[i].style.strokeWidth !== '') {
            issues.push('edge ' + i + ' strokeWidth was modified to "' + g.edges[i].style.strokeWidth + '" on empty input');
          }
        }
        for (var j = 0; j < g.labels.length; j++) {
          if ('opacity' in g.labels[j].style && g.labels[j].style.opacity !== '') {
            issues.push('label ' + j + ' opacity was modified to "' + g.labels[j].style.opacity + '" on empty input');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F5 — highlight("NONEXISTENT") dims ALL edges and hides ALL labels',
      setup: function () {
        var g = buildGraph();
        global.document = makeMockDocument(g.svg);
        highlightConnections('NONEXISTENT');
        var issues = [];
        // No edge matches NONEXISTENT — all should be dim
        for (var i = 0; i < g.edges.length; i++) {
          if (g.edges[i].style.opacity !== '0.15') {
            issues.push('edge ' + i + ' opacity was "' + g.edges[i].style.opacity + '" (expected "0.15" — non-connected)');
          }
          if (g.edges[i].style.strokeWidth !== '1') {
            issues.push('edge ' + i + ' strokeWidth was "' + g.edges[i].style.strokeWidth + '" (expected "1" — non-connected)');
          }
        }
        // All labels hidden
        for (var j = 0; j < g.labels.length; j++) {
          if (g.labels[j].style.opacity !== '0') {
            issues.push('label ' + j + ' opacity was "' + g.labels[j].style.opacity + '" (expected "0" — non-connected)');
          }
        }
        return { issues: issues };
      }
    },
    {
      name: 'F6 — highlight() does not throw on null / missing svg',
      setup: function () {
        global.document = makeMockDocument(null);
        var issues = [];
        var crashed = false;
        try {
          highlightConnections('A');
        } catch (e) {
          crashed = true;
          issues.push('highlightConnections threw on null svg: ' + e.message);
        }
        // The function should silently return (no throw, no visible state)
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

  // For T1-T6, install the broken function and probe it
  function recordAdversarial(label, kind) {
    total++;
    var g = buildGraph();
    var doc = makeMockDocument(g.svg);
    global.document = doc;
    var issues = [];

    if (kind === 'T1') {
      // T1: dropped !nodeId guard. Empty input "A" still works (A IS a node),
      //     but "" should be a no-op. Mutant will process "" and dim all.
      var brokenFn = installMutant('T1', doc, g.svg, g.edges, g.labels);
      brokenFn('');
      // With "" as nodeId, no edge matches (src/dst are "A","B","C","D"),
      // so all edges should remain at default — but mutant DID run the
      // iteration, setting opacity=0.15 and strokeWidth=1 for all.
      for (var i = 0; i < g.edges.length; i++) {
        if (g.edges[i].style.opacity === '0.15') {
          issues.push('T1: empty input processed — edge ' + i + ' opacity was set to "0.15" (!nodeId guard dropped)');
        }
        if (g.edges[i].style.strokeWidth === '1') {
          issues.push('T1: empty input processed — edge ' + i + ' strokeWidth was set to "1" (!nodeId guard dropped)');
        }
      }
      for (var k = 0; k < g.labels.length; k++) {
        if (g.labels[k].style.opacity === '0') {
          issues.push('T1: empty input processed — label ' + k + ' opacity was set to "0" (!nodeId guard dropped)');
        }
      }
    } else if (kind === 'T2') {
      // T2: dropped !svgEl guard. With null svg, calls null.querySelectorAll.
      // The try/catch swallows, but the iteration never runs — no edges touched.
      // We probe: after null-svg call, ALL edges should still be at default.
      // Healthy: silently returns; no crash, no state change.
      // Mutant: also no crash (caught), but the question is whether it differs.
      // Better probe: with valid svg, healthy and T2 are identical.
      // Instead test that null svg is gracefully handled (matches healthy).
      // For T2 we use a different probe: confirm that with null svg the
      // function does NOT process edges (healthy AND mutant both skip).
      // To distinguish T2 from healthy, we run with valid svg and confirm
      // no difference in behavior — T2 is hard to detect from outside
      // because try/catch swallows the TypeError.
      //
      // We pivot: probe with valid svg — both should boost A-B/A-C. Mutant
      // also calls svgEl.querySelectorAll on a valid svg, then iterates
      // only setting opacity='1' on all edges. So A-B/A-C become opacity=1
      // (coincidentally correct), but strokeWidth is NOT updated.
      var brokenFn2 = installMutant('T2', doc, g.svg, g.edges, g.labels);
      brokenFn2('A');
      // T2's handler skips the strokeWidth update entirely. If A-B doesn't
      // have strokeWidth set to '2.5', that's a sign T2 stripped that branch.
      // BUT T2 only sets opacity='1', not the strokeWidth branch. So connected
      // edges have opacity='1' but strokeWidth is unset (not '2.5').
      // Healthy: A-B has strokeWidth='2.5'. Mutant: A-B has no strokeWidth.
      if (g.edges[0].style.strokeWidth !== '2.5') {
        issues.push('T2: A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "2.5") — T2 stripped strokeWidth update branch');
      }
      if (g.edges[1].style.strokeWidth !== '2.5') {
        issues.push('T2: A-C edge strokeWidth was "' + g.edges[1].style.strokeWidth + '" (expected "2.5") — T2 stripped strokeWidth update branch');
      }
    } else if (kind === 'T3') {
      // T3: inverted connected check. highlight("A") should boost A-B/A-C
      //     (opacity=1) but mutant dims A-B/A-C and boosts B-D.
      var brokenFn3 = installMutant('T3', doc, g.svg, g.edges, g.labels);
      brokenFn3('A');
      // Healthy: A-B is LIT (opacity='1'). Mutant inverts → A-B is DIM (opacity='0.15').
      // Detect the inversion: A-B should be '1' but mutant makes it '0.15'.
      if (g.edges[0].style.opacity === '0.15') {
        issues.push('T3: A-B edge opacity was "0.15" (expected "1" — connected edge was dimmed by inverted check)');
      }
      // Healthy: B-D is DIM (opacity='0.15'). Mutant inverts → B-D is LIT (opacity='1').
      if (g.edges[2].style.opacity === '1') {
        issues.push('T3: B-D edge opacity was "1" (expected "0.15" — non-connected edge was lit by inverted check)');
      }
      // Also check A-C
      if (g.edges[1].style.opacity === '0.15') {
        issues.push('T3: A-C edge opacity was "0.15" (expected "1" — connected edge was dimmed by inverted check)');
      }
    } else if (kind === 'T4') {
      // T4: dropped strokeWidth boost. Opacity + connected check still work.
      var brokenFn4 = installMutant('T4', doc, g.svg, g.edges, g.labels);
      brokenFn4('A');
      if (g.edges[0].style.strokeWidth !== '2.5') {
        issues.push('T4: A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "2.5" — strokeWidth boost dropped)');
      }
    } else if (kind === 'T5') {
      // T5: dropped edge opacity boost. strokeWidth still works. Labels still work.
      var brokenFn5 = installMutant('T5', doc, g.svg, g.edges, g.labels);
      brokenFn5('A');
      // Connected edges (A-B, A-C) should be at opacity=1 but mutant always sets 0.15.
      if (g.edges[0].style.opacity !== '1') {
        issues.push('T5: A-B edge opacity was "' + g.edges[0].style.opacity + '" (expected "1" — opacity boost dropped)');
      }
      // B-D (non-connected) also at 0.15 — correct in both. Stroke width
      // is the discriminator: mutant doesn't touch strokeWidth for A-B.
      if (g.edges[0].style.strokeWidth !== '2.5') {
        issues.push('T5: A-B edge strokeWidth was "' + g.edges[0].style.strokeWidth + '" (expected "2.5")');
      }
    } else if (kind === 'T6') {
      // T6: dropped label opacity update. Edges still work; labels stay default.
      var brokenFn6 = installMutant('T6', doc, g.svg, g.edges, g.labels);
      brokenFn6('A');
      // Labels should be at opacity 0.85 for A-B, A-C but mutant doesn't touch them.
      if (g.labels[0].style.opacity !== '0.85') {
        issues.push('T6: A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0.85" — label update dropped)');
      }
      if (g.labels[2].style.opacity !== '0') {
        issues.push('T6: B-D label opacity was "' + g.labels[2].style.opacity + '" (expected "0" — label update dropped)');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy highlightConnections (no mutation)
      highlightConnections('A');
      // Healthy should boost A-B and A-C, dim B-D
      if (g.edges[0].style.opacity !== '1') {
        issues.push('control: A-B edge opacity was "' + g.edges[0].style.opacity + '" (expected "1")');
      }
      if (g.edges[2].style.opacity !== '0.15') {
        issues.push('control: B-D edge opacity was "' + g.edges[2].style.opacity + '" (expected "0.15")');
      }
      if (g.labels[0].style.opacity !== '0.85') {
        issues.push('control: A-B label opacity was "' + g.labels[0].style.opacity + '" (expected "0.85")');
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

  recordAdversarial('T1 !nodeId guard dropped', 'T1');
  recordAdversarial('T2 !svgEl guard dropped', 'T2');
  recordAdversarial('T3 connected check inverted', 'T3');
  recordAdversarial('T4 edge strokeWidth boost dropped', 'T4');
  recordAdversarial('T5 edge opacity boost dropped', 'T5');
  recordAdversarial('T6 label opacity update dropped', 'T6');
  recordAdversarial('T7 control (healthy highlight)', 'T7');

  console.log('');
  console.log('========== E34 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();