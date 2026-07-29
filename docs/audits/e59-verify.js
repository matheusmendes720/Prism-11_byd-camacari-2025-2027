// e59-verify.js — highlightConnections() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4079-4101 (highlightConnections — chrome-only
// stub). Hover-in handler that lights the edges incident to a node and
// dims the rest. Operates on two parallel collections: .edge elements
// (write opacity + strokeWidth) and text.edge-label elements (write
// opacity). No node-group mutation.
//
// Invariants (4 sub-checks):
//   1a. Lit predicate: connected = (src === nodeId || dst === nodeId)
//       applied per edge AND per label.
//   1b. Edge opacity write: connected → '1', not → '0.15'.
//   1c. Edge strokeWidth write: connected → '2.5', not → '1'.
//   1d. Edge-label opacity write: connected → '0.85', not → '0'.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with
// expected value. Broken mutant drops the write → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// svgEl is mocked via getElementById('main-svg'). The qsaMap-style lookup
// is mutated in-place by resetEnv() so the lazy querySelectorAll always
// sees the live stubs (mirrors the E56/E57/E58 in-place elementMap pattern).
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — svgEl + edges + edge-labels
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

function makeSvgStub() {
  return {
    _edges: null,
    _labels: null,
    querySelectorAll: function (selector) {
      if (selector === '.edge')           return this._edges || [];
      if (selector === 'text.edge-label') return this._labels || [];
      return [];
    }
  };
}

var svgEl = null;
var edges = null;
var edgeLabels = null;

function getSvgEl()        { return svgEl; }
function getEdge(i)        { return edges[i]; }
function getEdgeFrom(i)    { return edges[i]._from; }
function getEdgeTo(i)      { return edges[i]._to; }
function getEdgeLabel(i)   { return edgeLabels[i]; }

// In-place elementMap (declared once, mutated by resetEnv).
var elementMap = { 'main-svg': null };

function resetEnv() {
  // Topology: A-B, A-C (both incident to A); B-C (NOT incident).
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
  svgEl = makeSvgStub();
  svgEl._edges = edges;
  svgEl._labels = edgeLabels;
  elementMap['main-svg'] = svgEl;
}

global.document = {
  getElementById: function (id) { return elementMap[id] || null; }
};

// ============================================================
// Mirror — highlightConnections() (HEALTHY, simplified)
//
// Faithful to L4079-4101 invariants for the 4 sub-checks above. Lit
// predicate is computed identically in the .edge loop and the
// text.edge-label loop (each query reads its own data-from/data-to).
// ============================================================
function healthyHighlightConnections(nodeId) {
  if (!nodeId) return;
  var svgEl = document.getElementById('main-svg');
  if (!svgEl) return;

  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    var src = edge.getAttribute('data-from') || '';
    var dst = edge.getAttribute('data-to')   || '';
    var lit = (src === nodeId || dst === nodeId);
    edge.style.opacity     = lit ? '1' : '0.15';
    edge.style.strokeWidth = lit ? '2.5' : '1';
  });

  svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
    var src = label.getAttribute('data-from') || '';
    var dst = label.getAttribute('data-to')   || '';
    var lit = (src === nodeId || dst === nodeId);
    label.style.opacity = lit ? '0.85' : '0';
  });
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// dropInv1a defaults lit to false (predicate is skipped) so the
// "lit always false" path is unambiguously distinct from healthy's
// "lit === (predicate)".
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyHighlightConnections(CURRENT_NODE_ID);

    var nodeId = CURRENT_NODE_ID;
    if (!nodeId) return;
    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;

    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to')   || '';
      var lit = (!opts.dropInv1a) ? (src === nodeId || dst === nodeId) : false;
      if (!opts.dropInv1b) edge.style.opacity     = lit ? '1' : '0.15';
      if (!opts.dropInv1c) edge.style.strokeWidth = lit ? '2.5' : '1';
    });

    svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
      var src = label.getAttribute('data-from') || '';
      var dst = label.getAttribute('data-to')   || '';
      var lit = (!opts.dropInv1a) ? (src === nodeId || dst === nodeId) : false;
      if (!opts.dropInv1d) label.style.opacity = lit ? '0.85' : '0';
    });
  };
}

var CURRENT_NODE_ID = 'A';

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'lit predicate (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'edge opacity write (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'edge strokeWidth write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'label opacity write (1d)' }
];

// ============================================================
// Fixtures — sourced from e59-fixtures.js via factory + deps
// ============================================================
var fx = require('./e59-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getEdge: getEdge,
  getEdgeLabel: getEdgeLabel
});

var healthyWrappedHighlightConnections = function () {
  return healthyHighlightConnections(CURRENT_NODE_ID);
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E59 — highlightConnections() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-highlightConnections, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedHighlightConnections);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy highlightConnections) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
