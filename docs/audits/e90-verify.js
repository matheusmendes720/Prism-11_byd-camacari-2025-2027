// e90-verify.js — highlightConnections() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4079-4101 (highlightConnections —
// hover-in handler: sets edge strokeWidth, opacity, and edge-label
// opacity based on whether each edge is incident to nodeId).
//
// Invariants (3 sub-checks):
//   1a. strokeWidth: connected edges get '2.5', disconnected get '1'.
//   1b. edge opacity: connected edges get '1', disconnected get '0.15'.
//   1c. edge-label opacity: connected edges get '0.85', disconnected get '0'.
//
// Inverted mutant pattern: fixture seeds a mock SVG with a 3-edge graph
// (A-B, B-C, C-D), calls highlightConnections('B'). Healthy: A-B and
// B-C get strokeWidth=2.5, opacity=1, labelOpacity=0.85; C-D gets
// strokeWidth=1, opacity=0.15, labelOpacity=0. Broken mutant drops a
// sub-check → sentinel state preserved → fixture detects.
//
// Note: source has try/catch — errors are swallowed. Let throws propagate
// only for truly broken invariants (bad mock setup, etc.).
//
// 2 mutants × 1 target fixture + 1 control = 3 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — SVG with .edge and text.edge-label.
// ============================================================

var _edges = [];   // [{from, to, _strokeWidth, _opacity, _labelOpacity}]
var mockSvg = null;

function seedGraph(cfg) {
  _edges = cfg.edges.map(function (pair) {
    return {
      from: pair[0], to: pair[1],
      _strokeWidth: '', _opacity: '', _labelOpacity: ''
    };
  });
  mockSvg = makeMockSvg();
}

function getSnapshot() {
  return {
    edges: _edges.map(function (e) {
      return {
        from: e.from, to: e.to,
        strokeWidth: e._strokeWidth,
        opacity: e._opacity,
        labelOpacity: e._labelOpacity
      };
    })
  };
}

function resetEnv() {
  _edges = [];
  mockSvg = null;
}

function makeMockSvg() {
  return {
    _isSvg: true,
    querySelectorAll: function (sel) {
      if (sel === '.edge') {
        return _edges.map(function (e) {
          var edge = { _from: e.from, _to: e.to };
          edge.getAttribute = function (a) {
            if (a === 'data-from') return e.from;
            if (a === 'data-to') return e.to;
            return null;
          };
          Object.defineProperty(edge, 'style', {
            get: function () {
              return {
                get strokeWidth() { return e._strokeWidth; },
                set strokeWidth(v) { e._strokeWidth = v; },
                get opacity() { return e._opacity; },
                set opacity(v) { e._opacity = v; }
              };
            }
          });
          return edge;
        });
      }
      if (sel === 'text.edge-label') {
        return _edges.map(function (e) {
          var label = { _from: e.from, _to: e.to };
          label.getAttribute = function (a) {
            if (a === 'data-from') return e.from;
            if (a === 'data-to') return e.to;
            return null;
          };
          Object.defineProperty(label, 'style', {
            get: function () {
              return {
                get opacity() { return e._labelOpacity; },
                set opacity(v) { e._labelOpacity = v; }
              };
            }
          });
          return label;
        });
      }
      return [];
    },
    getElementById: function (id) {
      if (id === 'main-svg') return mockSvg;
      return null;
    }
  };
}

global.document = {
  getElementById: function (id) {
    if (id === 'main-svg') return mockSvg;
    return null;
  }
};

// ============================================================
// Mirror — highlightConnections() (HEALTHY, faithful to L4079-4101)
// ============================================================
function healthyHighlightConnections(nodeId) {
  if (!nodeId) return;
  var svgEl = document.getElementById('main-svg');
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
}

// ============================================================
// Broken mutants — drop individual sub-checks.
// T1: drop strokeWidth and opacity changes (edges stay at '').
// T2: drop edge-label opacity changes (labels stay at '').
// ============================================================
function makeBF(opts) {
  return function (nodeId) {
    if (MIRROR_REPAIRED) return healthyHighlightConnections(nodeId);
    if (!nodeId) return;
    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      var lit = (src === nodeId || dst === nodeId);
      // T1: drop strokeWidth and opacity.
      if (!opts.dropStrokeWidth) {
        edge.style.strokeWidth = lit ? '2.5' : '1';
      }
      if (!opts.dropOpacity) {
        edge.style.opacity = lit ? '1' : '0.15';
      }
    });
    svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
      var src = label.getAttribute('data-from') || '';
      var dst = label.getAttribute('data-to') || '';
      var lit = (src === nodeId || dst === nodeId);
      // T2: drop label opacity.
      if (!opts.dropLabelOpacity) {
        label.style.opacity = lit ? '0.85' : '0';
      }
    });
  };
}

var MUTANTS = [
  // T1 drops strokeWidth → targets F0 which expects strokeWidth='2.5'.
  { id: 'T1', fn: makeBF({ dropStrokeWidth: true, dropOpacity: false, dropLabelOpacity: false }), target: 'F0', drop: 'strokeWidth (1a)' },
  // T2 drops edge-label opacity → targets F0 which expects labelOpacity='0.85'.
  { id: 'T2', fn: makeBF({ dropStrokeWidth: false, dropOpacity: false, dropLabelOpacity: true }), target: 'F0', drop: 'edge-label opacity (1c)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e90-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  seedGraph: seedGraph,
  getSnapshot: getSnapshot
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E90 — highlightConnections() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

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

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyHighlightConnections);
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
