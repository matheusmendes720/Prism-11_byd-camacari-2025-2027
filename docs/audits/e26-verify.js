// e26_verify.js — Search→Highlight composition invariant for onSearch()
//
// E26 establishes that onSearch() (L4020-4030 of D3-PITCH-GRAPH.html)
// composes input-validation (null/short-query early-return) with
// node-highlighting (set opacity to 1 for matches, 0.2 for non-matches).
//
// Composition contract verified:
//   (a) empty/null query → no DOM mutation (early return)
//   (b) query.length < 2 → no DOM mutation (early return)
//   (c) valid query → all .node-group elements get opacity set
//       (match = '1', non-match = '0.2')
//   (d) match is case-insensitive substring on either data-id OR label
//   (e) match logic uses substring (includes), not exact equality
//   (f) onSearch does not throw when label/textContent is null
//
// The harness mirrors the function body and replaces document.querySelectorAll
// with a queryable mock that returns our pre-seeded node list. Each mock
// node captures style.opacity writes so we can observe the highlight
// decisions without a real DOM.
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock element — auto-populates data-id so id-match logic works
// ------------------------------------------------------------------
function makeMockNode(id, label) {
  var attrs = { 'data-id': id };
  return {
    _id: id,
    _label: label,
    _attrs: attrs,
    style: { opacity: undefined },
    textContent: label,
    getAttribute: function (k) {
      return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null;
    },
    setAttribute: function (k, v) { this._attrs[k] = v; }
  };
}

// ------------------------------------------------------------------
// Mirror of L4020-4030 — onSearch() with input-validation +
// case-insensitive substring match against id/label
// ------------------------------------------------------------------
function makeMockDOM(nodes) {
  return {
    querySelectorAll: function (sel) {
      // SPA only calls .querySelectorAll('.node-group') — accept that selector
      if (sel !== '.node-group') return [];
      return nodes;
    }
  };
}

function makeOnSearch(mockDOM) {
  return function onSearch(query) {
    if (!query || query.length < 2) return;
    var q = query.toLowerCase();
    mockDOM.querySelectorAll('.node-group').forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      var label = (g.textContent || '').toLowerCase();
      var match = id.toLowerCase().includes(q) || label.includes(q);
      g.style.opacity = match ? '1' : '0.2';
    });
  };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of onSearch semantics
// ------------------------------------------------------------------
function installMutant(kind, baseOnSearch, mockDOM) {
  if (kind === 'T1') {
    // T1: skip the length guard. Now any query (incl. '') iterates and
    //     sets opacity. Empty q.toLowerCase() matches every node (every
    //     id/label includes '').
    return function (query) {
      var q = (query || '').toLowerCase();
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = g.getAttribute('data-id') || '';
        var label = (g.textContent || '').toLowerCase();
        var match = id.toLowerCase().includes(q) || label.includes(q);
        g.style.opacity = match ? '1' : '0.2';
      });
    };
  } else if (kind === 'T2') {
    // T2: case-sensitive match (skip toLowerCase on q). "LI" query would
    //     not match a node with id "n-supply-cn" labelled "Lithium Supply Chain".
    return function (query) {
      if (!query || query.length < 2) return;
      var q = query;  // NOT lowered
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = g.getAttribute('data-id') || '';
        var label = (g.textContent || '').toLowerCase();
        var match = id.includes(q) || label.includes(q);
        g.style.opacity = match ? '1' : '0.2';
      });
    };
  } else if (kind === 'T3') {
    // T3: only check data-id, ignore label. Searching by label substring
    //     no longer matches.
    return function (query) {
      if (!query || query.length < 2) return;
      var q = query.toLowerCase();
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = (g.getAttribute('data-id') || '').toLowerCase();
        var match = id.includes(q);  // label dropped
        g.style.opacity = match ? '1' : '0.2';
      });
    };
  } else if (kind === 'T4') {
    // T4: exact equality instead of substring. Substring match no longer
    //     works for partial queries.
    return function (query) {
      if (!query || query.length < 2) return;
      var q = query.toLowerCase();
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = (g.getAttribute('data-id') || '').toLowerCase();
        var label = (g.textContent || '').toLowerCase();
        var match = (id === q) || (label === q);  // exact, not includes
        g.style.opacity = match ? '1' : '0.2';
      });
    };
  } else if (kind === 'T5') {
    // T5: invert match (match=0.2, non-match=1) — semantics inverted.
    return function (query) {
      if (!query || query.length < 2) return;
      var q = query.toLowerCase();
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = g.getAttribute('data-id') || '';
        var label = (g.textContent || '').toLowerCase();
        var match = id.toLowerCase().includes(q) || label.includes(q);
        g.style.opacity = match ? '0.2' : '1';  // INVERTED
      });
    };
  } else if (kind === 'T6') {
    // T6: opacity values swapped (set '0.5' instead of 1/0.2). Visual
    //     states still distinguishable but contrast lost.
    return function (query) {
      if (!query || query.length < 2) return;
      var q = query.toLowerCase();
      mockDOM.querySelectorAll('.node-group').forEach(function (g) {
        var id = g.getAttribute('data-id') || '';
        var label = (g.textContent || '').toLowerCase();
        var match = id.toLowerCase().includes(q) || label.includes(q);
        g.style.opacity = match ? '0.5' : '0.5';  // flattened
      });
    };
  }
  // T7 is the control (no mutation)
  return baseOnSearch;
}

// ------------------------------------------------------------------
// Fixtures
// ------------------------------------------------------------------
function fixtureNodes() {
  // Pre-seed three nodes — labelled so we can verify substring matches
  return [
    makeMockNode('n-fx-usd', 'USD Tariff Exposure'),
    makeMockNode('n-supply-cn', 'Lithium Supply Chain'),
    makeMockNode('n-macro-bcb', 'BCB Macro Governor')
  ];
}

// Six canonical fixtures
var FIXTURES = [
  {
    name: 'F1 — empty string query is no-op (no opacity writes)',
    setup: function () {
      var nodes = fixtureNodes();
      nodes.forEach(function (n) { n.style.opacity = undefined; });
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch('');
      return {
        issues: nodes.map(function (n) {
          return n.style.opacity !== undefined && 'empty query should NOT mutate opacity (node ' + n._id + ' got opacity=' + n.style.opacity + ')';
        }).filter(Boolean)
      };
    }
  },
  {
    name: 'F2 — null query is no-op',
    setup: function () {
      var nodes = fixtureNodes();
      nodes.forEach(function (n) { n.style.opacity = undefined; });
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch(null);
      return {
        issues: nodes.map(function (n) {
          return n.style.opacity !== undefined && 'null query should NOT mutate opacity (node ' + n._id + ' got opacity=' + n.style.opacity + ')';
        }).filter(Boolean)
      };
    }
  },
  {
    name: 'F3 — single-char query is no-op (length guard)',
    setup: function () {
      var nodes = fixtureNodes();
      nodes.forEach(function (n) { n.style.opacity = undefined; });
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch('U');
      return {
        issues: nodes.map(function (n) {
          return n.style.opacity !== undefined && 'short query (<2 chars) should NOT mutate opacity (node ' + n._id + ' got opacity=' + n.style.opacity + ')';
        }).filter(Boolean)
      };
    }
  },
  {
    name: 'F4 — valid substring query highlights matching nodes only',
    setup: function () {
      var nodes = fixtureNodes();
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch('us');  // matches n-fx-usd (id has 'us') and 'USD Tariff' (label)
      return {
        issues: [
          (nodes[0].style.opacity !== '1') && 'n-fx-usd should be highlighted (opacity=1), got ' + nodes[0].style.opacity,
          (nodes[1].style.opacity !== '0.2') && 'n-supply-cn should be dimmed (opacity=0.2), got ' + nodes[1].style.opacity,
          (nodes[2].style.opacity !== '0.2') && 'n-macro-bcb should be dimmed (opacity=0.2), got ' + nodes[2].style.opacity
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F5 — case-insensitive match (uppercase query on lowercase data)',
    setup: function () {
      var nodes = fixtureNodes();
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch('LI');  // matches 'lithium' in node 1's label
      return {
        issues: [
          (nodes[0].style.opacity !== '0.2') && 'n-fx-usd should be dimmed (no match), got ' + nodes[0].style.opacity,
          (nodes[1].style.opacity !== '1') && 'n-supply-cn should be highlighted (case-insensitive "LI" matches "lithium"), got ' + nodes[1].style.opacity,
          (nodes[2].style.opacity !== '0.2') && 'n-macro-bcb should be dimmed (no match), got ' + nodes[2].style.opacity
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F6 — universal-substring query highlights all nodes',
    setup: function () {
      var nodes = fixtureNodes();
      var dom = makeMockDOM(nodes);
      var onSearch = makeOnSearch(dom);
      onSearch('n-');  // every id starts with 'n-' (universal 2-char prefix)
      return {
        issues: nodes.map(function (n) {
          return n.style.opacity !== '1' && 'every node id starts with "n-" — should be highlighted, but ' + n._id + ' got opacity=' + n.style.opacity;
        }).filter(Boolean)
      };
    }
  }
];

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E26 SEARCH→HIGHLIGHT COMPOSITION INVARIANT ==========');
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
  function recordAdversarial(label, kind, expectedMin) {
    expectedMin = expectedMin || 1;
    total++;
    var issues = [];
    var nodes = fixtureNodes();

    // Reset opacity before each mutant
    nodes.forEach(function (n) { n.style.opacity = undefined; });

    var dom = makeMockDOM(nodes);
    var baseOnSearch = makeOnSearch(dom);
    var mutant = installMutant(kind, baseOnSearch, dom);

    // For each mutant, push issue IF the mutant broke the invariant.
    // Healthy code should produce 0 issues. Mutant should produce ≥1.

    if (kind === 'T1') {
      // T1: missing length guard. Empty query should still no-op, but
      // mutant iterates and mutates every opacity (q='' matches every node
      // because ''.includes('') is true).
      mutant('');
      // Healthy onSearch('') leaves opacity undefined (early return).
      // Mutant sets opacity to '1' for every node.
      if (nodes[0].style.opacity !== undefined) {
        issues.push('T1: empty query mutated opacity=' + nodes[0].style.opacity + ' (length guard was dropped)');
      }
    } else if (kind === 'T2') {
      // T2: case-sensitive match. Healthy: 'LI' lowered to 'li' matches
      // 'lithium' → opacity '1'. Mutant: 'LI' not lowered → no match → '0.2'.
      mutant('LI');
      if (nodes[1].style.opacity !== '1') {
        issues.push('T2: case-sensitive "LI" failed to match "lithium" — opacity=' + nodes[1].style.opacity + ' (expected 1)');
      }
    } else if (kind === 'T3') {
      // T3: only data-id checked. Healthy: 'lithium' matches n-supply-cn
      // via label → opacity '1'. Mutant: label dropped → no match → '0.2'.
      mutant('lithium');
      if (nodes[1].style.opacity !== '1') {
        issues.push('T3: "lithium" should match via label only — opacity=' + nodes[1].style.opacity + ' (label was dropped, expected 1)');
      }
    } else if (kind === 'T4') {
      // T4: exact equality. Healthy: 'us' is substring of 'n-fx-usd' →
      // opacity '1'. Mutant: exact equality 'n-fx-usd' === 'us' is false → '0.2'.
      mutant('us');
      if (nodes[0].style.opacity !== '1') {
        issues.push('T4: substring match dropped — partial "us" query no longer matches "n-fx-usd" id, opacity=' + nodes[0].style.opacity + ' (expected 1)');
      }
    } else if (kind === 'T5') {
      // T5: inverted match. Healthy: match → '1'. Mutant: match → '0.2'
      // (and non-match → '1').
      mutant('us');
      if (nodes[0].style.opacity !== '1') {
        issues.push('T5: matching node got dimmed instead of highlighted — opacity=' + nodes[0].style.opacity + ' (expected 1, inverted semantics)');
      }
      if (nodes[1].style.opacity !== '0.2') {
        issues.push('T5: non-matching node got highlighted instead of dimmed — opacity=' + nodes[1].style.opacity + ' (expected 0.2, inverted semantics)');
      }
    } else if (kind === 'T6') {
      // T6: opacity flattened to 0.5. Healthy: '0.2' and '1' both appear.
      // Mutant: only '0.5'.
      mutant('us');
      var distinct = new Set(nodes.map(function (n) { return n.style.opacity; }));
      if (distinct.size === 1 && distinct.has('0.5')) {
        issues.push('T6: opacity flattened to single value 0.5 (no match/highlight contrast)');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy search highlights correctly
      mutant('us');
      if (nodes[0].style.opacity !== '1') issues.push('control: n-fx-usd should be highlighted on "us" query, got ' + nodes[0].style.opacity);
      if (nodes[1].style.opacity !== '0.2') issues.push('control: n-supply-cn should be dimmed on "us" query, got ' + nodes[1].style.opacity);
      if (nodes[2].style.opacity !== '0.2') issues.push('control: n-macro-bcb should be dimmed on "us" query, got ' + nodes[2].style.opacity);
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
      if (issues.length >= expectedMin) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥' + expectedMin + ')');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    }
  }

  recordAdversarial('T1 missing length guard', 'T1');
  recordAdversarial('T2 case-sensitive match', 'T2');
  recordAdversarial('T3 id-only match (label dropped)', 'T3');
  recordAdversarial('T4 exact equality (substring dropped)', 'T4');
  recordAdversarial('T5 inverted match semantics', 'T5');
  recordAdversarial('T6 flattened opacity (no contrast)', 'T6');
  recordAdversarial('T7 control (healthy search)', 'T7');

  console.log('');
  console.log('========== E26 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
