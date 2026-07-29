// e58-verify.js — selectNode() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4038-4076 (selectNode — chrome-only stub).
// Click handler that highlights the selected node and dims non-neighbours.
// Resolves .node-group[data-id="<nodeId>"], walks all .edge elements to
// build a connected set, then writes opacities to nodes and edges.
//
// Invariants (4 sub-checks):
//   1a. Selection cycle: clear .selected on all .node-group, then add
//       .selected to the target node-group.
//   1b. Connected set: walk all .edge elements and collect ids where
//       (src === nodeId || dst === nodeId); result is {nodeId, src, dst}*.
//   1c. Node opacity write: connected → '1', not connected → '0.15'.
//   1d. Edge opacity write: connected → '1', not connected → '0.05'.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with
// expected value. Broken mutant drops the write → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// svgEl is mocked via getElementById('main-svg'). The qsaMap is mutated
// in-place by resetEnv() so the lazy querySelectorAll lookup always sees
// the live stubs (mirrors the E56 in-place elementMap pattern).
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — svgEl + nodeGroups + edges + showDetail counter
// ============================================================

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

function makeEdgeStub(from, to) {
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
    _nodeGroups: null,
    _edges: null,
    querySelectorAll: function (selector) {
      if (selector === '.node-group') return this._nodeGroups || [];
      if (selector === '.edge')       return this._edges || [];
      return [];
    },
    querySelector: function (selector) {
      // Only used for the target node lookup: .node-group[data-id="<id>"]
      var m = selector.match(/^\.node-group\[data-id="(.+?)"\]$/);
      if (m) {
        var target = m[1];
        return (this._nodeGroups || []).find(function (g) { return g._dataId === target; }) || null;
      }
      return null;
    }
  };
}

var svgEl = null;
var nodeGroups = null;
var edges = null;
var showDetailCallCount = 0;
var lastShowDetailNode = null;

function getSvgEl()                  { return svgEl; }
function getNodeGroup(i)             { return nodeGroups[i]; }
function getNodeId(i)                { return nodeGroups[i]._dataId; }
function getEdge(i)                  { return edges[i]; }
function getEdgeFrom(i)              { return edges[i]._from; }
function getEdgeTo(i)                { return edges[i]._to; }
function getShowDetailCallCount()    { return showDetailCallCount; }
function getLastShowDetailNode()     { return lastShowDetailNode; }
function setShowDetailCallCount(v)   { showDetailCallCount = v; lastShowDetailNode = null; }

// In-place qsaMap. svgEl is itself stored here; resetEnv() mutates the
// field on the same svgEl reference (mirrors the E56 in-place elementMap
// pattern).
var elementMap = { 'main-svg': null };

function resetEnv() {
  // Topology: A - B - C with A-C direct edge; D isolated.
  //   A (selected) - B - C, and A - C
  //   D (isolated)
  nodeGroups = [
    makeNodeStub('A'),
    makeNodeStub('B'),
    makeNodeStub('C'),
    makeNodeStub('D')
  ];
  edges = [
    makeEdgeStub('A', 'B'),
    makeEdgeStub('B', 'C'),
    makeEdgeStub('A', 'C')
  ];
  svgEl = makeSvgStub();
  svgEl._nodeGroups = nodeGroups;
  svgEl._edges = edges;
  elementMap['main-svg'] = svgEl;

  showDetailCallCount = 0;
  lastShowDetailNode = null;
}

global.document = {
  getElementById: function (id) { return elementMap[id] || null; }
};

// Mock nodesRendered (global, set by build(); selectNode reads it for
// detail panel delegation).
var nodesRendered = null;

function setNodesRendered(arr) { nodesRendered = arr; }

// Mock showDetail — invoked by selectNode when a node object is found.
function showDetail(node) {
  showDetailCallCount++;
  lastShowDetailNode = node;
}

// ============================================================
// Mirror — selectNode() (HEALTHY, simplified)
//
// Faithful to L4038-4076 invariants for the 4 sub-checks above. The
// try/catch wrapper is elided since the fixture surface already provides
// the synchronous mocks. nodesRendered is the global lookup table for the
// detail panel delegation.
// ============================================================
function healthySelectNode(nodeId) {
  if (!nodeId) return;
  var svgEl = document.getElementById('main-svg');
  if (!svgEl) return;

  // 1a. Selection cycle — clear, then add to target
  svgEl.querySelectorAll('.node-group').forEach(function (g) {
    g.classList.remove('selected');
  });
  var target = svgEl.querySelector('.node-group[data-id="' + nodeId + '"]');
  if (target) target.classList.add('selected');

  // 1b. Connected set build
  var connected = new Set([nodeId]);
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    var src = edge.getAttribute('data-from') || '';
    var dst = edge.getAttribute('data-to')   || '';
    if (src === nodeId || dst === nodeId) {
      connected.add(src);
      connected.add(dst);
    }
  });

  // 1c. Node opacity write
  svgEl.querySelectorAll('.node-group').forEach(function (g) {
    var id = g.getAttribute('data-id') || '';
    g.style.opacity = connected.has(id) ? '1' : '0.15';
  });

  // 1d. Edge opacity write
  svgEl.querySelectorAll('.edge').forEach(function (edge) {
    var src = edge.getAttribute('data-from') || '';
    var dst = edge.getAttribute('data-to')   || '';
    edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
  });

  // Detail panel delegation (out-of-band, not in the 4 invariants but
  // exercised by the F0 control to confirm wiring).
  var nodeObj = (typeof nodesRendered !== 'undefined' && nodesRendered) ? nodesRendered.find(function (n) { return n.id === nodeId; }) : null;
  if (nodeObj && typeof showDetail === 'function') showDetail(nodeObj);
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthySelectNode(nodeId) so the test
// runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthySelectNode(CURRENT_NODE_ID);

    var nodeId = CURRENT_NODE_ID;
    if (!nodeId) return;
    var svgEl = document.getElementById('main-svg');
    if (!svgEl) return;

    // 1a. Selection cycle
    if (!opts.dropInv1a) {
      svgEl.querySelectorAll('.node-group').forEach(function (g) {
        g.classList.remove('selected');
      });
      var target = svgEl.querySelector('.node-group[data-id="' + nodeId + '"]');
      if (target) target.classList.add('selected');
    }

    // 1b. Connected set build
    var connected = new Set([nodeId]);
    if (!opts.dropInv1b) {
      svgEl.querySelectorAll('.edge').forEach(function (edge) {
        var src = edge.getAttribute('data-from') || '';
        var dst = edge.getAttribute('data-to')   || '';
        if (src === nodeId || dst === nodeId) {
          connected.add(src);
          connected.add(dst);
        }
      });
    }

    // 1c. Node opacity write
    if (!opts.dropInv1c) {
      svgEl.querySelectorAll('.node-group').forEach(function (g) {
        var id = g.getAttribute('data-id') || '';
        g.style.opacity = connected.has(id) ? '1' : '0.15';
      });
    }

    // 1d. Edge opacity write
    if (!opts.dropInv1d) {
      svgEl.querySelectorAll('.edge').forEach(function (edge) {
        var src = edge.getAttribute('data-from') || '';
        var dst = edge.getAttribute('data-to')   || '';
        edge.style.opacity = (src === nodeId || dst === nodeId) ? '1' : '0.05';
      });
    }

    // Detail panel delegation (still runs — the F0 control confirms it).
    var nodeObj = (typeof nodesRendered !== 'undefined' && nodesRendered) ? nodesRendered.find(function (n) { return n.id === nodeId; }) : null;
    if (nodeObj && typeof showDetail === 'function') showDetail(nodeObj);
  };
}

var CURRENT_NODE_ID = 'A';

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'selection cycle (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'connected set build (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'node opacity write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'edge opacity write (1d)' }
];

// ============================================================
// Fixtures — sourced from e58-fixtures.js via factory + deps
// ============================================================
var fx = require('./e58-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setNodesRendered: setNodesRendered,
  getNodeId: getNodeId,
  getNodeGroup: getNodeGroup,
  getEdge: getEdge,
  getEdgeFrom: getEdgeFrom,
  getEdgeTo: getEdgeTo,
  getShowDetailCallCount: getShowDetailCallCount,
  getLastShowDetailNode: getLastShowDetailNode,
  setShowDetailCallCount: setShowDetailCallCount
});

var healthyWrappedSelectNode = function () {
  return healthySelectNode(CURRENT_NODE_ID);
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E58 — selectNode() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-selectNode, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedSelectNode);
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
