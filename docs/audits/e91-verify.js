// e91-verify.js — unhighlightConnections() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4104-4127 (unhighlightConnections —
// hover-out handler: resets all edge styles to '', edge-label opacity to 0,
// and removes 'selected' class from all .node-group).
//
// Invariants (4 sub-checks):
//   1a. strokeWidth: '' for all edges.
//   1b. edge opacity: '' for all edges.
//   1c. edge-label opacity: '0' for all labels.
//   1d. node selected class: removed from all .node-group.
//
// Pre-condition setup: highlightConnections('B') is called first to put
// edges in a non-default state (lit edges strokeWidth='2.5', etc.).
// Then unhighlightConnections resets everything. Broken mutant drops
// a reset sub-check → sentinel state preserved → fixture detects.
//
// Note: source has try/catch — errors are swallowed. Let throws propagate
// only for truly broken invariants (bad mock setup, etc.).
//
// 1 mutant × 1 target fixture + 2 controls = 3 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — SVG with .edge, text.edge-label, .node-group.
// ============================================================

var _nodes = [];  // [{id, _hasSelected}]
var _edges = [];  // [{from, to, _strokeWidth, _opacity, _labelOpacity}]
var mockSvg = null;

function seedGraph(cfg) {
  _nodes = cfg.nodes.map(function (id) {
    return { id: id, _hasSelected: false };
  });
  _edges = cfg.edges.map(function (pair) {
    return {
      from: pair[0], to: pair[1],
      _strokeWidth: '', _opacity: '', _labelOpacity: ''
    };
  });
  // Pre-select the seeded node if requested (simulates prior selectNode call).
  if (cfg.seedNodeSelected) {
    var sel = _nodes.find(function (n) { return n.id === cfg.seedNodeSelected; });
    if (sel) sel._hasSelected = true;
  }
  mockSvg = makeMockSvg();
}

function getSnapshot() {
  return {
    nodes: _nodes.map(function (n) {
      return { id: n.id, hasSelected: n._hasSelected };
    }),
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
  _nodes = [];
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
      if (sel === '.node-group') {
        return _nodes.map(function (n) {
          var node = { _nodeId: n.id, _nodeOpacity: '' };
          node.getAttribute = function (a) { return a === 'data-id' ? n.id : null; };
          node.classList = {
            remove: function (cls) { if (cls === 'selected') n._hasSelected = false; },
            add: function (cls) { if (cls === 'selected') n._hasSelected = true; }
          };
          Object.defineProperty(node, 'style', {
            get: function () {
              return {
                get opacity() { return n._nodeOpacity; },
                set opacity(v) { n._nodeOpacity = v; }
              };
            }
          });
          return node;
        });
      }
      return [];
    },
    querySelector: function (sel) {
      if (sel === '.node-group.selected') {
        var selected = _nodes.filter(function (n) { return n._hasSelected; });
        if (selected.length === 0) return null;
        var n = selected[0];
        var node = { _nodeId: n.id };
        node.getAttribute = function (a) { return a === 'data-id' ? n.id : null; };
        node.classList = {
          remove: function (cls) { if (cls === 'selected') n._hasSelected = false; }
        };
        return node;
      }
      return null;
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
// Mirror — highlightConnections() (HEALTHY, for fixture setup only)
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
// Mirror — unhighlightConnections() (HEALTHY, faithful to L4104-4127)
// ============================================================
function healthyUnhighlightConnections() {
  var svgEl = document.getElementById('main-svg');
  if (!svgEl) return;
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    edge.style.opacity = '';
    edge.style.strokeWidth = '';
  });
  svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
    label.style.opacity = '0';
  });
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
// Broken mutant — drop strokeWidth reset in unhighlightConnections.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUnhighlightConnections();
    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;
    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      // T1: drop strokeWidth reset (opacity is still reset).
      edge.style.opacity = '';
      if (!opts.dropStrokeWidth) {
        edge.style.strokeWidth = '';
      }
    });
    svgEl.querySelectorAll('text.edge-label').forEach(function (label) {
      label.style.opacity = '0';
    });
    var selected = svgEl.querySelector('.node-group.selected');
    if (selected) {
      svgEl.querySelectorAll('.node-group').forEach(function (g) {
        g.style.opacity = '';
        g.classList.remove('selected');
      });
    }
  };
}

var MUTANTS = [
  // T1 drops strokeWidth reset in unhighlightConnections → targets F1.
  { id: 'T1', fn: makeBF({ dropStrokeWidth: true }), target: 'F1', drop: 'strokeWidth reset (1a)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e91-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  seedGraph: seedGraph,
  getSnapshot: getSnapshot,
  highlightConnections: healthyHighlightConnections
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E91 — unhighlightConnections() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-unhighlightConnections, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  if (fix.control_skip) {
    console.log('[SKIP] ' + fix.id + ' (control × healthy unhighlightConnections) — control_skip=true, excluded from control run');
    return;
  }
  resetEnv();
  var issues = fix.fn(healthyUnhighlightConnections);
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
