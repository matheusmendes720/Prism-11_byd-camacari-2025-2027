// e89-verify.js — selectNode() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4038-4076 (selectNode — click handler
// for graph nodes: removes 'selected' from all .node-group, adds to
// target, dims non-neighbours via opacity, brightens edges).
//
// Invariants (4 sub-checks):
//   1a. selected class: classList.add('selected') on target node.
//   1b. node dimming: non-selected nodes get opacity=0.15.
//   1c. node brighten: selected node gets opacity=1.
//   1d. edge brighten: edges incident to selected node get opacity=1.
//
// Inverted mutant pattern: fixture seeds a mock SVG with a 3-node graph
// (A--B--C), calls selectNode('B'). Healthy: B gets selected+opacity=1,
// A+C dim to 0.15. Broken mutant drops classList.add or opacity set →
// sentinel state preserved → fixture detects.
//
// Note: source has try/catch — errors are swallowed. Let throws propagate
// only for truly broken invariants (bad mock setup, etc.).
//
// 2 mutants × 1 target fixture + 3 controls = 5 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — SVG with .node-group and .edge elements.
// ============================================================

var _nodes = [];   // [{id, hasSelected, opacity, style}]
var _edges = [];   // [{from, to, opacity, style}]
var mockSvg = null; // re-created by makeMockSvg inside seedGraph

function seedGraph(cfg) {
  _nodes = cfg.nodes.map(function (id) {
    return { id: id, _hasSelected: false, _opacity: '', style: {} };
  });
  _edges = cfg.edges.map(function (pair) {
    return { from: pair[0], to: pair[1], _opacity: '', style: {} };
  });
  // Re-create mockSvg so its querySelectorAll closures capture the NEW
  // _nodes / _edges arrays — fixes stale-closure bug where mocks pointed
  // to a previous seed's node objects.
  mockSvg = makeMockSvg();
}

function getSnapshot() {
  return {
    nodes: _nodes.map(function (n) {
      return { id: n.id, hasSelected: n._hasSelected, opacity: n._opacity };
    }),
    edges: _edges.map(function (e) {
      return { from: e.from, to: e.to, opacity: e._opacity };
    })
  };
}

function resetEnv() {
  _nodes = [];
  _edges = [];
  mockSvg = null;
}

// Build mock SVG element with querySelectorAll.
function makeMockSvg() {
  return {
    _isSvg: true,
    querySelectorAll: function (sel) {
      if (sel === '.node-group') {
        return _nodes.map(function (n) {
          return {
            _nodeId: n.id,
            _selected: false,
            _opacity: '',
            classList: {
              remove: function (cls) {
                if (cls === 'selected') n._hasSelected = false;
              },
              add: function (cls) {
                if (cls === 'selected') n._hasSelected = true;
              },
              contains: function (cls) {
                return cls === 'selected' ? n._hasSelected : false;
              }
            },
            getAttribute: function (a) {
              return a === 'data-id' ? n.id : null;
            },
            style: {
              get opacity() { return n._opacity; },
              set opacity(v) { n._opacity = v; }
            }
          };
        });
      }
      if (sel === '.edge') {
        return _edges.map(function (e) {
          return {
            _from: e.from, _to: e.to,
            getAttribute: function (a) {
              if (a === 'data-from') return e.from;
              if (a === 'data-to') return e.to;
              return null;
            },
            style: {
              get opacity() { return e._opacity; },
              set opacity(v) { e._opacity = v; }
            }
          };
        });
      }
      if (sel === '.node-group.selected') {
        return _nodes.filter(function (n) { return n._hasSelected; })
          .map(function (n) {
            return {
              _nodeId: n.id,
              getAttribute: function (a) { return a === 'data-id' ? n.id : null; },
              classList: { remove: function () {} }
            };
          });
      }
      return [];
    },
    querySelector: function (sel) {
      // Return the SAME mock object that querySelectorAll already built for
      // this node, so that classList.add('selected') on the querySelector
      // result actually updates n._hasSelected in the _nodes array.
      var m = sel.match(/^\.node-group\[data-id="([^"]+)"\]$/);
      if (m) {
        var nid = m[1];
        var n = _nodes.find(function (x) { return x.id === nid; });
        if (!n) return null;
        // Build and cache the mock on first use; reuse it on every call so
        // that modifications (classList.add, style.opacity) land in _nodes.
        if (!n._mock) {
          n._mock = {
            _nodeId: n.id,
            classList: {
              remove: function () {},
              add: function (cls) { if (cls === 'selected') n._hasSelected = true; }
            },
            getAttribute: function (a) { return a === 'data-id' ? n.id : null; },
            style: {
              get opacity() { return n._opacity; },
              set opacity(v) { n._opacity = v; }
            }
          };
        }
        return n._mock;
      }
      return null;
    },
    getElementById: function (id) {
      if (id === 'main-svg') return makeMockSvg();
      return null;
    }
  };
}

// mockSvg is set to null at module level; seedGraph() re-creates it
// fresh each time so closures always capture the current _nodes array.

// nodesRendered mirror for showDetail call.
// Must be a true global so that "typeof nodesRendered !== 'undefined'" in
// the source (L4071) resolves to true inside healthySelectNode().
global.nodesRendered = [
  { id: 'A', name: 'Node A' },
  { id: 'B', name: 'Node B' },
  { id: 'C', name: 'Node C' }
];

// Module-scope mirror.
var currentView = 'overview';

global.document = {
  getElementById: function (id) {
    if (id === 'main-svg') return mockSvg;
    return null;
  }
};

// ============================================================
// Mirror — selectNode() (HEALTHY, faithful to L4038-4076)
//
// Handles: remove selected from all, add to target, dim/brighten
// nodes and edges, call showDetail.
// ============================================================
function healthySelectNode(nodeId) {
  if (!nodeId) return;
  var svgEl = document.getElementById('main-svg');
  if (!svgEl) return;

  // 1. Remove selected from all node-groups.
  svgEl.querySelectorAll('.node-group').forEach(function (g) {
    g.classList.remove('selected');
  });

  // 2. Add selected to target.
  var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
  var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
  if (target) target.classList.add('selected');

  // 3. Find connected node IDs (neighbours via edges).
  var connected = new Set([nodeId]);
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    var src = edge.getAttribute('data-from') || '';
    var dst = edge.getAttribute('data-to') || '';
    if (src === nodeId || dst === nodeId) {
      connected.add(src);
      connected.add(dst);
    }
  });

  // 4. Set node opacity: 1 for connected, 0.15 for rest.
  svgEl.querySelectorAll('.node-group').forEach(function (g) {
    var id = g.getAttribute('data-id') || '';
    g.style.opacity = connected.has(id) ? '1' : '0.15';
  });

  // 5. Set edge opacity: 1 for edges incident to nodeId, 0.05 for rest.
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    var src = edge.getAttribute('data-from') || '';
    var dst = edge.getAttribute('data-to') || '';
    edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
  });

  // 6. showDetail call (no-op in fixture — just check it doesn't throw).
  var nodeObj = nodesRendered.find(function (n) { return n.id === nodeId; });
  if (nodeObj && typeof showDetail === 'function') {
    try { showDetail(nodeObj); } catch (e) {}
  }
}

// showDetail stub — must not throw in healthy or broken runs.
function showDetail(n) {}

// ============================================================
// Broken mutants — 2 boolean flags.
// T1 dropInv1a: no classList.add('selected') on target.
// T2 dropInv1b: no opacity dimming on non-connected nodes.
// ============================================================
function makeBF(opts) {
  return function (nodeId) {
    if (MIRROR_REPAIRED) return healthySelectNode(nodeId);
    if (!nodeId) return;
    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;

    svgEl.querySelectorAll('.node-group').forEach(function (g) {
      g.classList.remove('selected');
    });

    // T1: drop classList.add('selected') on target.
    var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
    var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
    if (target && !opts.dropInv1a) {
      target.classList.add('selected');
    }

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
      // T2: drop the dimming (0.15) setting.
      if (!opts.dropInv1b) {
        g.style.opacity = connected.has(id) ? '1' : '0.15';
      }
    });

    svgEl.querySelectorAll('.edge').forEach(function (edge) {
      var src = edge.getAttribute('data-from') || '';
      var dst = edge.getAttribute('data-to') || '';
      edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
    });

    var nodeObj = nodesRendered.find(function (n) { return n.id === nodeId; });
    if (nodeObj && typeof showDetail === 'function') {
      try { showDetail(nodeObj); } catch (e) {}
    }
  };
}

var MUTANTS = [
  // T1 drops classList.add('selected') → targets F0 which expects hasSelected=true.
  { id: 'T1', fn: makeBF({ dropInv1a: true, dropInv1b: false }), target: 'F0', drop: 'classList.add selected (1a)' },
  // T2 drops node dimming (opacity=0.15) → targets F2 which expects ≥2 dimmed nodes.
  { id: 'T2', fn: makeBF({ dropInv1a: false, dropInv1b: true }), target: 'F2', drop: 'node dimming opacity=0.15 (1b)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e89-fixtures.js');
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

console.log('=== E89 — selectNode() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-selectNode, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthySelectNode);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy selectNode) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
