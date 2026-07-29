// e54-fixtures.js — per-function probes for E54 computePositions
//
// Inverted mutant-detection: each fixture MUTATES the env into a state
// where the broken mutant would LEAVE it unchanged (or pre-compute wrong
// values). The healthy mirror performs all 4 operations → env reaches the
// expected post-compute state → fixture passes.
// Broken mutant drops ONE operation → env stays at pre-compute defaults
// (or partial state) → fixture reports issue → PASS.
//
// Fixtures (F0..F4):
//   F0 — healthy control (composite at center, dims radial, gates at x=80,
//        links synced). Verifies the full pipeline.
//   F1 — pre-seed composite.x = -999 → T1 (drop 1a): healthy OVERWRITES it
//        to (cx, cy); broken T1 leaves it at -999
//   F2 — pre-seed dim nodes with NaN coords → T2 (drop 1b): healthy assigns
//        cos/sin coords; broken T2 leaves NaN
//   F3 — pre-seed gate nodes with NaN coords → T3 (drop 1c): healthy assigns
//        x=80 + y stacking; broken T3 leaves NaN
//   F4 — pre-seed links with NaN endpoints → T4 (drop 1d): healthy syncs to
//        node coords; broken T4 leaves NaN
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 ops complete correctly.
  // ============================================================
  function runF0_healthyControl(computeFn) {
    deps.resetEnv();
    var result = computeFn();
    var issues = [];

    var nodes = deps.getNodes();
    var links = deps.getLinks();
    var w = 1200, h = 800;
    var cx = w / 2, cy = h / 2;
    var R = Math.min(w, h) * 0.40;

    // 1a: composite at (cx, cy)
    var comp = nodes.find(function (n) { return n.id === 'composite'; });
    if (!comp || comp.x !== cx || comp.y !== cy) {
      issues.push('F0 composite placement violated — expected (' + cx + ',' + cy + '), got ' + JSON.stringify(comp));
    }

    // 1b: dim nodes have finite radial coords
    var dims = nodes.filter(function (n) { return n.ntype === 'dim'; });
    var badDims = dims.filter(function (n) { return !isFinite(n.x) || !isFinite(n.y); });
    if (badDims.length) {
      issues.push('F0 dim radial coords violated — expected finite coords, got NaN on ' + badDims.length + ' dims');
    }

    // 1c: gates at x=80
    var gates = nodes.filter(function (n) { return n.ntype === 'gate'; });
    var badGates = gates.filter(function (n) { return n.x !== 80; });
    if (badGates.length) {
      issues.push('F0 gate left-rail placement violated — expected x=80, got bad x on ' + badGates.length + ' gates');
    }

    // 1d: links have finite endpoints matching node positions
    var badLinks = links.filter(function (l) {
      return !isFinite(l.x1) || !isFinite(l.y1) || !isFinite(l.x2) || !isFinite(l.y2);
    });
    if (badLinks.length) {
      issues.push('F0 link endpoint sync violated — expected finite endpoints, got NaN on ' + badLinks.length + ' links');
    }

    return issues;
  }

  // ============================================================
  // F1 — pre-seed composite with bogus x → T1 (drop 1a)
  // Healthy OVERWRITES to (cx, cy). Broken T1 leaves it at -999.
  // ============================================================
  function runF1_compositeNotAtCenter(computeFn) {
    deps.resetEnv();
    var nodes = deps.getNodes();
    var comp = nodes.find(function (n) { return n.id === 'composite'; });
    comp.x = -999;
    comp.y = -999;
    deps.setNodes(nodes);
    computeFn();
    var after = deps.getNodes();
    var compAfter = after.find(function (n) { return n.id === 'composite'; });
    var issues = [];
    if (compAfter.x !== 600 || compAfter.y !== 400) {
      issues.push('F1 composite-center violated — expected (600,400), got (' + compAfter.x + ',' + compAfter.y + ')');
    }
    return issues;
  }

  // ============================================================
  // F2 — pre-seed dim nodes with NaN coords → T2 (drop 1b)
  // Healthy assigns cos/sin. Broken T2 leaves NaN.
  // ============================================================
  function runF2_dimsNotRadial(computeFn) {
    deps.resetEnv();
    var nodes = deps.getNodes();
    nodes.forEach(function (n) {
      if (n.ntype === 'dim') { n.x = NaN; n.y = NaN; }
    });
    deps.setNodes(nodes);
    computeFn();
    var after = deps.getNodes();
    var dims = after.filter(function (n) { return n.ntype === 'dim'; });
    var badDims = dims.filter(function (n) { return !isFinite(n.x) || !isFinite(n.y); });
    var issues = [];
    if (badDims.length) {
      issues.push('F2 dim-radial violated — expected finite coords, got NaN on ' + badDims.length + ' dims');
    }
    return issues;
  }

  // ============================================================
  // F3 — pre-seed gate nodes with NaN coords → T3 (drop 1c)
  // Healthy assigns x=80 + y stacking. Broken T3 leaves NaN.
  // ============================================================
  function runF3_gatesNotOnLeftRail(computeFn) {
    deps.resetEnv();
    var nodes = deps.getNodes();
    nodes.forEach(function (n) {
      if (n.ntype === 'gate') { n.x = NaN; n.y = NaN; }
    });
    deps.setNodes(nodes);
    computeFn();
    var after = deps.getNodes();
    var gates = after.filter(function (n) { return n.ntype === 'gate'; });
    var badGates = gates.filter(function (n) { return n.x !== 80; });
    var issues = [];
    if (badGates.length) {
      issues.push('F3 gate-left-rail violated — expected x=80, got ' + JSON.stringify(badGates.map(function (g) { return { id: g.id, x: g.x }; })));
    }
    return issues;
  }

  // ============================================================
  // F4 — pre-seed links with NaN endpoints → T4 (drop 1d)
  // Healthy syncs to node coords. Broken T4 leaves NaN.
  // ============================================================
  function runF4_linksNotSynced(computeFn) {
    deps.resetEnv();
    var links = deps.getLinks();
    links.forEach(function (l) {
      l.x1 = NaN; l.y1 = NaN; l.x2 = NaN; l.y2 = NaN;
    });
    deps.setLinks(links);
    computeFn();
    var after = deps.getLinks();
    var badLinks = after.filter(function (l) {
      return !isFinite(l.x1) || !isFinite(l.y1) || !isFinite(l.x2) || !isFinite(l.y2);
    });
    var issues = [];
    if (badLinks.length) {
      issues.push('F4 link-sync violated — expected finite endpoints, got NaN on ' + badLinks.length + ' links');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,           target_id: null },
    { id: 'F1', fn: runF1_compositeNotAtCenter,     target_id: 'T1' },
    { id: 'F2', fn: runF2_dimsNotRadial,            target_id: 'T2' },
    { id: 'F3', fn: runF3_gatesNotOnLeftRail,       target_id: 'T3' },
    { id: 'F4', fn: runF4_linksNotSynced,            target_id: 'T4' }
  ];
};