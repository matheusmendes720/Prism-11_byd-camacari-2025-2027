// e60-verify.js — unhighlightConnections() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4104-4127 (unhighlightConnections — chrome-only
// stub). Hover-out / click-outside handler that restores default opacities on
// edges and edge-labels, and — when a node is currently .selected — also
// clears the .selected class on every node-group and restores node opacities.
//
// Invariants (4 sub-checks):
//   1a. Edge clear: write style.opacity = '' AND style.strokeWidth = '' on
//       every .edge element.
//   1b. Label reset: write style.opacity = '0' on every text.edge-label
//       element (explicit '0' reset, not '').
//   1c. Selection clear: when any .node-group.selected exists, remove
//       'selected' from every .node-group.
//   1d. Node opacity restore: when any .node-group.selected exists, write
//       style.opacity = '' on every .node-group.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the reset → sentinel overwritten with expected
// post-call value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// svgEl is mocked via getElementById('main-svg'). The qsaMap-style lookup
// is mutated in-place by resetEnv() so the lazy querySelectorAll always
// sees the live stubs (mirrors the E56/E57/E58/E59 in-place elementMap
// pattern).
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — svgEl + edges + edge-labels + node-groups
// ============================================================

function makeEdgeStub(from, to) {
  return {
    _from: from,
    _to: to,
    getAttribute: function (name) {
      if (name === 'data-from') return from;
      if (name === 'data-to')   return to;
      return '';
    },
    style: { opacity: '', strokeWidth: '' }
  };
}

function makeEdgeLabelStub(from, to) {
  return {
    _from: from,
    _to: to,
    getAttribute: function (name) {
      if (name === 'data-from') return from;
      if (name === 'data-to')   return to;
      return '';
    },
    style: { opacity: '' }
  };
}

function makeNodeStub(id) {
  return {
    _dataId: id,
    getAttribute: function (name) {
      if (name === 'data-id') return id;
      return '';
    },
    classList: {
      _classes: [],
      add: function (cls) { if (this._classes.indexOf(cls) < 0) this._classes.push(cls); },
      remove: function (cls) { this._classes = this._classes.filter(function (c) { return c !== cls; }); },
      contains: function (cls) { return this._classes.indexOf(cls) >= 0; }
    },
    style: { opacity: '' }
  };
}

function makeSvgStub() {
  return {
    _edges: null,
    _labels: null,
    _nodeGroups: null,
    querySelectorAll: function (selector) {
      if (selector === '.edge')          return this._edges || [];
      if (selector === 'text.edge-label') return this._labels || [];
      if (selector === '.node-group')     return this._nodeGroups || [];
      return [];
    },
    querySelector: function (selector) {
      // Source uses querySelector('.node-group.selected') — return the first
      // .node-group whose classList contains 'selected', or null.
      if (selector === '.node-group.selected') {
        var groups = this._nodeGroups || [];
        for (var i = 0; i < groups.length; i++) {
          if (groups[i].classList.contains('selected')) return groups[i];
        }
        return null;
      }
      return null;
    }
  };
}

var svgEl = null;
var edges = null;
var edgeLabels = null;
var nodeGroups = null;

function getEdge(i)      { return edges[i]; }
function getEdgeLabel(i) { return edgeLabels[i]; }
function getNodeGroup(i) { return nodeGroups[i]; }

// In-place elementMap (declared once, mutated by resetEnv).
var elementMap = { 'main-svg': null };

function resetEnv() {
  // Topology mirrors E58/E59: A-B, A-C, B-C edges + labels; A,B,C,D nodes.
  edges = [
    makeEdgeStub('A', 'B'),
    makeEdgeStub('A', 'C'),
    makeEdgeStub('B', 'C')
  ];
  edgeLabels = [
    makeEdgeLabelStub('A', 'B'),
    makeEdgeLabelStub('A', 'C'),
    makeEdgeLabelStub('B', 'C')
  ];
  nodeGroups = [
    makeNodeStub('A'),
    makeNodeStub('B'),
    makeNodeStub('C'),
    makeNodeStub('D')
  ];
  svgEl = makeSvgStub();
  svgEl._edges = edges;
  svgEl._labels = edgeLabels;
  svgEl._nodeGroups = nodeGroups;
  elementMap['main-svg'] = svgEl;
}

global.document = {
  getElementById: function (id) { return elementMap[id] || null; }
};

// ============================================================
// Mirror — unhighlightConnections() (HEALTHY, simplified)
//
// Faithful to L4104-4127 invariants for the 4 sub-checks above. The
// try/catch wrapper is elided since the fixture surface already provides
// the synchronous mocks. The unhandled arrow-function in the source
// (g => { ... }) is rendered as a regular function for the mirror.
// ============================================================
function healthyUnhighlightConnections() {
  var svgEl = document.getElementById('main-svg');
  if (!svgEl) return;

  // 1a. Edge clear
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    edge.style.opacity = '';
    edge.style.strokeWidth = '';
  });

  // 1b. Label reset (always writes '0' — explicit off)
  svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
    label.style.opacity = '0';
  });

  // 1c/1d. Conditional branch — only runs when a .node-group.selected
  // exists. Walks every .node-group, clears .selected class and restores
  // opacity to ''.
  var selected = svgEl.querySelector('.node-group.selected');
  if (selected) {
    var selId = selected.getAttribute('data-id') || '';
    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.style.opacity = '';
      g.classList.remove('selected');
    });
  }
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyUnhighlightConnections() so
// the test runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUnhighlightConnections();

    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;

    // 1a. Edge clear
    if (!opts.dropInv1a) {
      svgEl.querySelectorAll('.edge').forEach(function (edge) {
        edge.style.opacity = '';
        edge.style.strokeWidth = '';
      });
    }

    // 1b. Label reset
    if (!opts.dropInv1b) {
      svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
        label.style.opacity = '0';
      });
    }

    // 1c/1d. Conditional branch
    var selected = svgEl.querySelector('.node-group.selected');
    if (selected) {
      var selId = selected.getAttribute('data-id') || '';
      svgEl.querySelectorAll('.node-group').forEach(function (g) {
        if (!opts.dropInv1d) g.style.opacity = '';
        if (!opts.dropInv1c) g.classList.remove('selected');
      });
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'edge clear (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'label opacity write (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'selected class clear (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'node opacity restore (1d)' }
];

// ============================================================
// Fixtures — sourced from e60-fixtures.js via factory + deps
// ============================================================
var fx = require('./e60-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getEdge: getEdge,
  getEdgeLabel: getEdgeLabel,
  getNodeGroup: getNodeGroup
});

var healthyWrappedUnhighlightConnections = function () {
  return healthyUnhighlightConnections();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E60 — unhighlightConnections() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv();
  var mutantIssues = [];
  var fix = ALL_FIXTURES.find(function (f) { return f.id === mutant.target; });
  if (fix) {
    var issues = fix.fn(mutant.fn);
    mutantIssues = mutantIssues.concat(issues);
  }
  totalReports++;
  var detected = mutantIssues.length > 0;
  var pass = MIRROR_REPAIRED ? !detected : detected;
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (broken-unhighlightConnections, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedUnhighlightConnections);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy unhighlightConnections) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
