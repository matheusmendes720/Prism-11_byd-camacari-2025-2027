// e24_verify.js — selectNode() entry-point contract invariant
//
// E24 establishes that selectNode(nodeId) (L3647-3685 of D3-PITCH-GRAPH.html)
// produces consistent state-management side-effects for every canonical node
// fixture. The harness mirrors selectNode()'s DOM mutations against a mock SVG
// (a list of mock nodes/edges) and captures the resulting state in a closure.
//
// Invariants tested per fixture:
//   (a) Falsy/undefined/empty nodeId → no-op (no DOM mutations, no showDetail call)
//   (b) Single 'selected' class across node-groups (no stale state on re-selection)
//   (c) Connected nodes (selected + neighbours) have opacity 1
//   (d) Non-connected nodes have opacity 0.15
//   (e) Connected edges have opacity 1
//   (f) Non-connected edges have opacity 0.05
//   (g) showDetail called with matching nodeObj ONLY when node exists in nodesRendered
//   (h) Try/catch swallows errors (no exception escapes)
//
// 7 adversarial mutants target individual failure modes.
// MIRROR_REPAIRED flag toggled by --repaired argv (skips injected bugs).

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// DOM MOCK: mock SVG element + mock nodes/edges
// ------------------------------------------------------------------
function makeMockNode(id) {
  var classes = {};
  var styles = {};
  var node = {
    _id: id,
    getAttribute: function(name) {
      if (name === 'data-id') return id;
      return '';
    },
    classList: {
      remove: function(c) { delete classes[c]; },
      add: function(c) { classes[c] = true; },
      contains: function(c) { return !!classes[c]; }
    },
    style: {},
    _classes: classes,
    _styles: styles
  };
  // simple style assignment support (g.style.opacity = '0.15')
  Object.defineProperty(node.style, 'opacity', {
    get: function() { return styles.opacity || ''; },
    set: function(v) { styles.opacity = String(v); },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(node.style, 'strokeWidth', {
    get: function() { return styles.strokeWidth || ''; },
    set: function(v) { styles.strokeWidth = String(v); },
    enumerable: true,
    configurable: true
  });
  return node;
}

function makeMockEdge(src, dst) {
  var styles = {};
  var edge = {
    _from: src,
    _to: dst,
    getAttribute: function(name) {
      if (name === 'data-from') return src;
      if (name === 'data-to') return dst;
      return '';
    },
    style: {},
    _styles: styles
  };
  Object.defineProperty(edge.style, 'opacity', {
    get: function() { return styles.opacity || ''; },
    set: function(v) { styles.opacity = String(v); },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(edge.style, 'strokeWidth', {
    get: function() { return styles.strokeWidth || ''; },
    set: function(v) { styles.strokeWidth = String(v); },
    enumerable: true,
    configurable: true
  });
  return edge;
}

function makeMockSvg(nodes, edges, opts) {
  opts = opts || {};
  return {
    id: 'main-svg',
    querySelectorAll: function(sel) {
      if (opts.querySelectorAllThrows) throw new Error('mock svg failure');
      if (sel === '.node-group') return nodes;
      if (sel === '.edge') return edges;
      return [];
    },
    querySelector: function(sel) {
      if (opts.querySelectorThrows) throw new Error('mock svg failure');
      // .node-group[data-id="<id>"] — supports escaped id chars too
      var m = sel.match(/^\.node-group\[data-id="(.*)"\]$/);
      if (m) {
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].getAttribute('data-id') === m[1]) return nodes[i];
        }
      }
      // .node-group.selected
      if (sel === '.node-group.selected') {
        for (var j = 0; j < nodes.length; j++) {
          if (nodes[j].classList.contains('selected')) return nodes[j];
        }
      }
      return null;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of selectNode() — captures mutations in a closure state
// Captures: { selectedIds[], lastShowDetailArg, dimmedNodeCount,
//            connectedEdgeCount, dimmedEdgeCount, crashed, errorMsg, ops }
// ------------------------------------------------------------------
function makeSelectNode(options) {
  options = options || {};
  var captured = {
    selectedIds: [],          // ids of nodes that have class 'selected' (at return time)
    lastShowDetailArg: null,  // last argument passed to showDetail
    showDetailCallCount: 0,
    dimmedNodeCount: 0,       // nodes with opacity === '0.15'
    brightNodeCount: 0,       // nodes with opacity === '1'
    brightEdgeCount: 0,       // edges with opacity === '1'
    dimmedEdgeCount: 0,       // edges with opacity === '0.05'
    crashed: false,
    errorMsg: null,
    ops: 0                    // total mutation events
  };

  function recordMutation(nodeOrEdge, prop, val) {
    captured.ops++;
  }

  function selectNode(nodeId, ctx) {
    // reset for each call (single call semantics — caller copies if needed)
    captured.selectedIds = [];
    captured.dimmedNodeCount = 0;
    captured.brightNodeCount = 0;
    captured.brightEdgeCount = 0;
    captured.dimmedEdgeCount = 0;
    captured.lastShowDetailArg = 'unset';
    captured.showDetailCallCount = 0;
    captured.crashed = false;
    captured.errorMsg = null;
    captured.ops = 0;

    function tryBlock() {
      // Guard 1: null/undefined/empty
      if (!MIRROR_REPAIRED && options.skipNullGuard) {
        // skip the guard entirely
      } else {
        if (!nodeId) return;
      }
      var svgEl = (typeof ctx.getElementById === 'function') ? ctx.getElementById('main-svg') : null;
      // Guard 2: missing svg
      if (!MIRROR_REPAIRED && options.skipSvgGuard) {
        // skip the guard entirely
      } else {
        if (!svgEl) return;
      }

      // loop A: clear 'selected' across all nodes
      if (!MIRROR_REPAIRED && options.skipDeselectLoop) {
        // skip the deselect sweep
      } else {
        svgEl.querySelectorAll('.node-group').forEach(function(g) {
          g.classList.remove('selected');
          recordMutation(g, 'class', 'remove:selected');
        });
      }

      // Manual CSS escape
      var safeId = String(nodeId).replace(/[\\"\]]/g, '\\$&');
      var target = svgEl.querySelector('.node-group[data-id="' + safeId + '"]');
      if (target) {
        target.classList.add('selected');
        recordMutation(target, 'class', 'add:selected');
      }

      // loop B: build connected set from edges
      var connected = new Set([nodeId]);
      svgEl.querySelectorAll('.edge').forEach(function(edge) {
        var src = edge.getAttribute('data-from') || '';
        var dst = edge.getAttribute('data-to') || '';
        if (src === nodeId || dst === nodeId) {
          connected.add(src);
          connected.add(dst);
        }
      });

      // loop C: dim nodes
      svgEl.querySelectorAll('.node-group').forEach(function(g) {
        var id = g.getAttribute('data-id') || '';
        var lit = connected.has(id);
        var opacityVal = (MIRROR_REPAIRED || !options.wrongNonConnectedOpacity)
          ? (lit ? '1' : '0.15')
          : (lit ? '1' : '0.5');
        g.style.opacity = opacityVal;
        recordMutation(g, 'opacity', opacityVal);
      });

      // loop D: dim edges
      svgEl.querySelectorAll('.edge').forEach(function(edge) {
        var src = edge.getAttribute('data-from') || '';
        var dst = edge.getAttribute('data-to') || '';
        var lit = (src === nodeId || dst === nodeId);
        edge.style.opacity = lit ? '1' : '0.05';
        recordMutation(edge, 'opacity', lit ? '1' : '0.05');
      });

      // showDetail call
      var nodesRendered = ctx.nodesRendered || [];
      var nodeObj = (typeof nodesRendered !== 'undefined' && nodesRendered)
        ? nodesRendered.find(function(n) { return n.id === nodeId; })
        : null;

      if (!MIRROR_REPAIRED && options.skipShowDetailCall) {
        // skip showDetail invocation entirely
      } else if (!MIRROR_REPAIRED && options.showDetailAlwaysCalled) {
        // call showDetail regardless of nodeObj presence (BUG)
        if (typeof ctx.showDetail === 'function') {
          ctx.showDetail(nodeObj);
        }
        captured.showDetailCallCount++;
        captured.lastShowDetailArg = nodeObj;
      } else {
        if (nodeObj && typeof ctx.showDetail === 'function') {
          ctx.showDetail(nodeObj);
        }
        if (nodeObj && typeof ctx.showDetail === 'function') {
          captured.showDetailCallCount++;
          captured.lastShowDetailArg = nodeObj;
        }
      }
    }

    if (MIRROR_REPAIRED && options.skipTryCatch) {
      // when try/catch is removed AND we're in repaired mode... rare combo. ignore.
      tryBlock();
    } else if (!MIRROR_REPAIRED && options.skipTryCatch) {
      // skip try/catch — exceptions propagate
      tryBlock();
    } else {
      try {
        tryBlock();
      } catch (err) {
        captured.crashed = true;
        captured.errorMsg = err && err.message;
      }
    }
  }

  return {
    selectNode: selectNode,
    getCaptured: function() {
      // populate selection summary
      var captured2 = JSON.parse(JSON.stringify({
        selectedIds: captured.selectedIds,
        lastShowDetailArg: captured.lastShowDetailArg,
        showDetailCallCount: captured.showDetailCallCount,
        dimmedNodeCount: captured.dimmedNodeCount,
        brightNodeCount: captured.brightNodeCount,
        brightEdgeCount: captured.brightEdgeCount,
        dimmedEdgeCount: captured.dimmedEdgeCount,
        crashed: captured.crashed,
        errorMsg: captured.errorMsg,
        ops: captured.ops
      }));
      return captured2;
    },
    internalState: captured  // live ref for callers that need post-call introspection
  };
}

// Mock showDetail that records its argument in the closure
function makeMockShowDetail() {
  var lastArg = 'unset';
  var callCount = 0;
  return {
    fn: function(arg) {
      lastArg = arg;
      callCount++;
    },
    getLastArg: function() { return lastArg; },
    getCallCount: function() { return callCount; }
  };
}

// ------------------------------------------------------------------
// Build a fixture graph (nodes + edges + nodesRendered)
// ------------------------------------------------------------------
function makeGraphFixture() {
  // A-B-C triangle, plus an isolated D
  var nodeA = makeMockNode('A');
  var nodeB = makeMockNode('B');
  var nodeC = makeMockNode('C');
  var nodeD = makeMockNode('D');

  var edgeAB = makeMockEdge('A', 'B');
  var edgeBC = makeMockEdge('B', 'C');
  var edgeXY = makeMockEdge('X', 'Y');  // fully orphan edge (X,Y not in nodes)

  return {
    nodes: [nodeA, nodeB, nodeC, nodeD],
    edges: [edgeAB, edgeBC, edgeXY],
    nodesRendered: [
      { id: 'A', label: 'node A' },
      { id: 'B', label: 'node B' },
      { id: 'C', label: 'node C' },
      { id: 'D', label: 'node D' }
    ],
    nodeById: { A: nodeA, B: nodeB, C: nodeC, D: nodeD }
  };
}

function buildContext(graph) {
  var showDetailMock = makeMockShowDetail();
  return {
    ctx: {
      getElementById: function(id) {
        if (id === 'main-svg') return graph.svg;
        return null;
      },
      nodesRendered: graph.nodesRendered,
      showDetail: function(arg) {
        showDetailMock.fn(arg);
        // sync into captured.lastShowDetailArg via closure — but mirror reads
        // from the mock directly. we'll re-read below.
        // (mirror uses ctx.showDetail directly; we capture via mockSideEffect)
      }
    },
    graph: graph,
    showDetailMock: showDetailMock
  };
}

// ------------------------------------------------------------------
// E24 validator — 8 properties per fixture
// ------------------------------------------------------------------
function validateE24(state, opts) {
  opts = opts || {};
  var issues = [];

  // (a) Falsy/undefined/empty nodeId → no-op (no DOM mutations)
  if (opts.expectNoOp) {
    if (state.ops > 0) {
      issues.push({ kind: 'no-op-failed', message: 'falsy input must be no-op but ops=' + state.ops });
    }
    if (state.showDetailCallCount !== 0) {
      issues.push({ kind: 'no-op-failed', message: 'falsy input must not call showDetail (calls=' + state.showDetailCallCount + ')' });
    }
    return issues;  // no-op test only checks ops/calls
  }

  // (b) Single 'selected' class (no stale)
  if (state.selectedIds.length > 1) {
    issues.push({ kind: 'multi-selected', message: 'multiple nodes carry .selected: ' + state.selectedIds.join(','), count: state.selectedIds.length });
  }
  if (opts.expectSelectedId && state.selectedIds.indexOf(opts.expectSelectedId) < 0) {
    issues.push({ kind: 'wrong-selection', message: 'expected selected=' + opts.expectSelectedId + ', got ' + JSON.stringify(state.selectedIds) });
  }

  // (c+d) Nodes: connected=1, others=0.15
  if (opts.expectedBrightNodeIds && opts.expectedBrightNodeIds.length !== state.brightNodeCount) {
    issues.push({ kind: 'wrong-bright-nodes', message: 'expected ' + opts.expectedBrightNodeIds.length + ' bright nodes, got ' + state.brightNodeCount });
  }
  if (opts.expectedDimmedNodeIds) {
    var actualDim = state.dimmedNodeCount;
    var expDim = opts.expectedDimmedNodeIds.length;
    if (actualDim !== expDim) {
      issues.push({ kind: 'wrong-dimmed-nodes', message: 'expected ' + expDim + ' dimmed nodes, got ' + actualDim });
    }
  }
  if (opts.expectedNonConnectedOpacity && state.dimmedNodeCount > 0) {
    // check no node has opacity other than 0.15 in non-connected set
    if (opts.expectedNonConnectedOpacity !== '0.15' && state.dimmedNodeCount > 0) {
      issues.push({ kind: 'wrong-opacity-value', message: 'expected non-connected opacity ' + opts.expectedNonConnectedOpacity + ', validator observes dimmed set', value: opts.expectedNonConnectedOpacity });
    }
  }

  // (e+f) Edges: connected=1, others=0.05
  if (opts.expectedBrightEdgeCount !== undefined && opts.expectedBrightEdgeCount !== state.brightEdgeCount) {
    issues.push({ kind: 'wrong-bright-edges', message: 'expected ' + opts.expectedBrightEdgeCount + ' bright edges, got ' + state.brightEdgeCount });
  }
  if (opts.expectedDimmedEdgeCount !== undefined && opts.expectedDimmedEdgeCount !== state.dimmedEdgeCount) {
    issues.push({ kind: 'wrong-dimmed-edges', message: 'expected ' + opts.expectedDimmedEdgeCount + ' dimmed edges, got ' + state.dimmedEdgeCount });
  }

  // (g) showDetail — called iff nodeId is in nodesRendered
  if (opts.expectShowDetailCalled === true) {
    if (state.showDetailCallCount !== 1) {
      issues.push({ kind: 'showdetail-not-called', message: 'showDetail should be called once, got ' + state.showDetailCallCount });
    }
    if (opts.expectedShowDetailId && state.lastShowDetailArg !== 'unset') {
      var argId = (state.lastShowDetailArg && typeof state.lastShowDetailArg === 'object') ? state.lastShowDetailArg.id : state.lastShowDetailArg;
      if (argId !== opts.expectedShowDetailId) {
        issues.push({ kind: 'showdetail-wrong-arg', message: 'showDetail called with ' + JSON.stringify(argId) + ' expected ' + opts.expectedShowDetailId });
      }
    }
  } else if (opts.expectShowDetailCalled === false) {
    if (state.showDetailCallCount !== 0) {
      issues.push({ kind: 'showdetail-called-when-absent', message: 'showDetail was called but should not (node not in nodesRendered)' });
    }
  }

  // (h) Try/catch swallows
  if (state.crashed) {
    issues.push({ kind: 'exception-leaked', message: 'exception escaped try/catch: ' + state.errorMsg });
  }

  return issues;
}

// ------------------------------------------------------------------
// Helper: post-call introspection — read mock state to fill captured.* fields
// ------------------------------------------------------------------
function postCallSnapshot(mirrorResult, graph, calledNodeId) {
  var captured = mirrorResult.internalState;
  var mockDetail = mirrorResult._mockDetail;

  // sync from mockShowDetail to captured (since mirror reads ctx.showDetail directly).
  // NOTE: only sync lastShowDetailArg — showDetailCallCount is the per-call counter
  // tracked inside the mirror, which is reset on entry to selectNode(). Overwriting
  // it from mockDetail.getCallCount() (cumulative across calls) breaks F4 re-selection.
  if (mockDetail) {
    captured.lastShowDetailArg = mockDetail.getLastArg();
  }

  // scan nodes for selection
  var selectedIds = [];
  for (var i = 0; i < graph.nodes.length; i++) {
    if (graph.nodes[i].classList.contains('selected')) {
      selectedIds.push(graph.nodes[i]._id);
    }
  }
  captured.selectedIds = selectedIds;

  // scan node opacities
  var bright = 0, dim = 0;
  for (var n = 0; n < graph.nodes.length; n++) {
    var no = graph.nodes[n]._styles.opacity || '';
    if (no === '1') bright++;
    else if (no === '0.15') dim++;
  }
  captured.brightNodeCount = bright;
  captured.dimmedNodeCount = dim;

  // scan edge opacities
  var brightE = 0, dimE = 0;
  for (var e = 0; e < graph.edges.length; e++) {
    var eo = graph.edges[e]._styles.opacity || '';
    if (eo === '1') brightE++;
    else if (eo === '0.05') dimE++;
  }
  captured.brightEdgeCount = brightE;
  captured.dimmedEdgeCount = dimE;

  return mirrorResult.getCaptured();
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;

  console.log('========== E24 selectNode() ENTRY-POINT INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // ----- BASELINE: canonical healthy fixtures -----
  console.log('--- BASELINE: 6 canonical healthy fixtures ---');

  // Fixture 1: selectNode('A') — A is connected to B via edgeAB → A,B bright
  function runFixture1() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    return { state: postCallSnapshot(mirror, graph, 'A'), graph: graph };
  }
  recordFixture('F1 selectNode(\'A\') → A,B bright; C,D dim', runFixture1, {
    expectSelectedId: 'A',
    expectedBrightNodeIds: ['A', 'B'],
    expectedDimmedNodeIds: ['C', 'D'],
    expectedBrightEdgeCount: 1,
    expectedDimmedEdgeCount: 2,
    expectShowDetailCalled: true,
    expectedShowDetailId: 'A'
  });

  // Fixture 2: selectNode('C') — C connected to B → B,C bright
  function runFixture2() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('C', built.ctx);
    return { state: postCallSnapshot(mirror, graph, 'C'), graph: graph };
  }
  recordFixture('F2 selectNode(\'C\') → B,C bright; A,D dim', runFixture2, {
    expectSelectedId: 'C',
    expectedBrightNodeIds: ['B', 'C'],
    expectedDimmedNodeIds: ['A', 'D'],
    expectedBrightEdgeCount: 1,
    expectedDimmedEdgeCount: 2,
    expectShowDetailCalled: true,
    expectedShowDetailId: 'C'
  });

  // Fixture 3: selectNode('D') — D is isolated → only D bright
  function runFixture3() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('D', built.ctx);
    return { state: postCallSnapshot(mirror, graph, 'D'), graph: graph };
  }
  recordFixture('F3 selectNode(\'D\') isolated → only D bright; rest dim', runFixture3, {
    expectSelectedId: 'D',
    expectedBrightNodeIds: ['D'],
    expectedDimmedNodeIds: ['A', 'B', 'C'],
    expectedBrightEdgeCount: 0,
    expectedDimmedEdgeCount: 3,
    expectShowDetailCalled: true,
    expectedShowDetailId: 'D'
  });

  // Fixture 4: re-selection — call twice with different ids, only second selected
  function runFixture4() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    mirror.selectNode('C', built.ctx);
    return { state: postCallSnapshot(mirror, graph, 'C'), graph: graph };
  }
  recordFixture('F4 re-selection (A then C) → only C selected', runFixture4, {
    expectSelectedId: 'C',
    expectedBrightNodeIds: ['B', 'C'],
    expectedDimmedNodeIds: ['A', 'D'],
    expectedBrightEdgeCount: 1,
    expectedDimmedEdgeCount: 2,
    expectShowDetailCalled: true,
    expectedShowDetailId: 'C'
  });

  // Fixture 5: unknown nodeId → no selection, no showDetail
  function runFixture5() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('Z', built.ctx);  // not in nodesRendered
    return { state: postCallSnapshot(mirror, graph, 'Z'), graph: graph };
  }
  recordFixture('F5 selectNode(\'Z\') unknown → no selection, no showDetail', runFixture5, {
    expectShowDetailCalled: false
    // No selection expected, no specific node validation
  });

  // Fixture 6: null nodeId → no-op
  function runFixture6() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode(null, built.ctx);
    return { state: postCallSnapshot(mirror, graph, null), graph: graph };
  }
  recordFixture('F6 selectNode(null) → no-op', runFixture6, {
    expectNoOp: true
  });

  function recordFixture(label, runFn, opts) {
    total++;
    var result = runFn();
    var issues = validateE24(result.state, opts);
    if (issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + label + ': 0 issues');
    } else {
      failed++;
      console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues');
      for (var i = 0; i < issues.length; i++) {
        console.log('    - ' + issues[i].kind + ': ' + issues[i].message);
      }
    }
  }

  // ----- ADVERSARIAL MUTANTS (T1-T7) -----
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');

  function recordAdversarial(label, fn, expectedMinCount) {
    expectedMinCount = expectedMinCount || 1;
    total++;
    var issues = fn();
    var c = issues.length;
    var ctrl = label.indexOf('T7') === 0;
    if (ctrl) {
      if (c === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + c + ' issues (CONTROL BROKEN)');
        for (var i = 0; i < issues.length; i++) {
          console.log('    - ' + issues[i].kind + ': ' + issues[i].message);
        }
      }
    } else {
      if (c >= expectedMinCount) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + c + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + c + ' issues caught (expected ≥' + expectedMinCount + ')');
        for (var k = 0; k < issues.length; k++) {
          console.log('    - ' + issues[k].kind + ': ' + issues[k].message);
        }
      }
    }
  }

  // T1: skipNullGuard — null input causes DOM mutation instead of early return
  recordAdversarial('T1 skipNullGuard (null dims everything)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({ skipNullGuard: true });
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode(null, built.ctx);
    var state = postCallSnapshot(mirror, graph, null);
    return validateE24(state, { expectNoOp: true });
  }, 1);

  // T2: skipDeselectLoop — re-selecting leaves BOTH selected
  recordAdversarial('T2 skipDeselectLoop (re-select leaves both)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({ skipDeselectLoop: true });
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    mirror.selectNode('C', built.ctx);
    var state = postCallSnapshot(mirror, graph, 'C');
    // After T2 mutation, both A and C have .selected class
    return validateE24(state, { expectSelectedId: 'C' });
  }, 1);

  // T3: skipShowDetailCall — panel doesn't update when node is found
  recordAdversarial('T3 skipShowDetailCall (no panel update)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({ skipShowDetailCall: true });
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    var state = postCallSnapshot(mirror, graph, 'A');
    return validateE24(state, {
      expectShowDetailCalled: true,
      expectedShowDetailId: 'A'
    });
  }, 1);

  // T4: wrongNonConnectedOpacity — non-connected nodes at wrong value (0.5)
  recordAdversarial('T4 wrongNonConnectedOpacity (uses 0.5 instead of 0.15)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({ wrongNonConnectedOpacity: true });
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    var state = postCallSnapshot(mirror, graph, 'A');
    // After T4 mutation, non-connected nodes have opacity '0.5' instead of '0.15'.
    // Our scanner only counts nodes whose opacity EXACTLY matches '0.15'; '0.5' goes uncounted.
    // So state.dimmedNodeCount = 0 (instead of expected 2), and state.brightNodeCount = expected+2 = bright=1+2 = 3 (A,B are bright normally, plus the 'dimmed' ones that were set to 0.5).
    // Wait — T4 bug: lit nodes still get '1' (correctly); non-lit nodes get '0.5' (wrong).
    // Scanner: bright=2 (A,B), dim=0 (no nodes have 0.15). Expected: bright=2, dim=2.
    // → wrong-dimmed-nodes issue
    return validateE24(state, {
      expectedBrightNodeIds: ['A', 'B'],
      expectedDimmedNodeIds: ['C', 'D']
    });
  }, 1);

  // T5: showDetailAlwaysCalled — showDetail called even when nodeId absent
  recordAdversarial('T5 showDetailAlwaysCalled (panel called for unknown node)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({ showDetailAlwaysCalled: true });
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('Z', built.ctx);  // not in nodesRendered
    var state = postCallSnapshot(mirror, graph, 'Z');
    return validateE24(state, { expectShowDetailCalled: false });
  }, 1);

  // T6: skipTryCatch — exception propagates from mock svg failure
  recordAdversarial('T6 skipTryCatch (exception leaks)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges, { querySelectorAllThrows: true });
    var built = buildContext(graph);
    var mirror = makeSelectNode({ skipTryCatch: true });
    mirror._mockDetail = built.showDetailMock;
    var threw = false;
    try {
      mirror.selectNode('A', built.ctx);
    } catch (e) {
      threw = true;
    }
    var state = postCallSnapshot(mirror, graph, 'A');
    var issues = [];
    // With skipTryCatch=true (mutant), the exception should leak. The validator
    // detects the mutant by CATCHING the leak: it must raise an issue when the
    // exception escaped (otherwise the test cannot tell the broken source from
    // the healthy one).
    if (threw) {
      issues.push({ kind: 'exception-leaked', message: 'exception leaked when try/catch should have caught it (skipTryCatch mutant active)' });
    }
    if (!state.crashed && threw) {
      issues.push({ kind: 'crashed-flag-set-incorrectly', message: 'state.crashed should be false since the exception leaked through (try/catch absent)' });
    }
    return issues;
  }, 1);

  // T7: control (clean) — same as F1 but with repair disabled and T7 sentinel
  recordAdversarial('T7 control (clean healthy input)', function() {
    var graph = makeGraphFixture();
    graph.svg = makeMockSvg(graph.nodes, graph.edges);
    var built = buildContext(graph);
    var mirror = makeSelectNode({});
    mirror._mockDetail = built.showDetailMock;
    mirror.selectNode('A', built.ctx);
    var state = postCallSnapshot(mirror, graph, 'A');
    return validateE24(state, {
      expectSelectedId: 'A',
      expectedBrightNodeIds: ['A', 'B'],
      expectedDimmedNodeIds: ['C', 'D'],
      expectedBrightEdgeCount: 1,
      expectedDimmedEdgeCount: 2,
      expectShowDetailCalled: true,
      expectedShowDetailId: 'A'
    });
  });

  console.log('');
  console.log('========== E24 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
