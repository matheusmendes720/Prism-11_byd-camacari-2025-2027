// e54-verify.js — computePositions() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3411-3523 (computePositions — layout core).
// Mutates node.x/y AND link.x1/y1/x2/y2 in-place. No DOM writes; pure geometry.
//
// Invariants (4 sub-checks):
//   1a. Composite node placed at center (cx, cy)
//   1b. Dim nodes placed on inner ring of radius R (cos/sin mapping)
//   1c. Gate nodes placed at x=80 (left rail) with vertical stacking
//   1d. Link endpoints updated from actual node positions (link.x1==n1.x, etc.)
//
// Inverted mutant pattern: each fixture corrupts ONE step into a throwing
// stub or omits the assignment. Healthy code performs the operation → no
// state corruption. Broken mutant drops the operation → state stays at the
// pre-compute default (NaN/0) → fixture reports issue → runner says PASS.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — width/height + nodes/links arrays.
// ============================================================
var MOCK_W = 1200;
var MOCK_H = 800;

function W() { return MOCK_W; }
function H() { return MOCK_H; }

function makeHealthyNodes() {
  return [
    { id: 'composite', ntype: 'composite' },
    { id: 'S1', ntype: 'dim' },
    { id: 'S2', ntype: 'dim' },
    { id: 'S3', ntype: 'dim' },
    { id: 'G0', ntype: 'gate' },
    { id: 'G1', ntype: 'gate' }
  ];
}

function makeHealthyLinks() {
  return [
    { id: 'c1', from: 'S1', to: 'S2' },
    { id: 'c2', from: 'S2', to: 'S3' }
  ];
}

var nodes = null;
var links = null;

function setNodes(v) { nodes = v; }
function getNodes()  { return nodes; }
function setLinks(v) { links = v; }
function getLinks()  { return links; }

function resetEnv() {
  nodes = makeHealthyNodes();
  links = makeHealthyLinks();
}

// ============================================================
// Mirror — computePositions() (HEALTHY, simplified)
//
// Faithful to L3411-3523 invariants for the 4 sub-checks above. Skips
// persona/risk/trigger/learning/milestone/scenario/other branches since
// those are exercised by other audit chains (E55/E56 etc.).
// ============================================================
function healthyComputePositions() {
  var w = W(), h = H();
  var cx = w / 2, cy = h / 2;
  var R = Math.min(w, h) * 0.40;
  if (!isFinite(R) || R < 50) R = 360;
  if (!isFinite(cx)) cx = 600;
  if (!isFinite(cy)) cy = 400;

  // 1a. Composite at center
  var comp = nodes.find(function (n) { return n.ntype === 'composite'; });
  if (comp) { comp.x = cx; comp.y = cy; }

  // 1b. Dim nodes on inner ring
  var dims = nodes.filter(function (n) { return n.ntype === 'dim'; });
  if (dims.length) {
    dims.forEach(function (n, i) {
      var angle = (2 * Math.PI * i / dims.length) - Math.PI / 2;
      n.x = cx + R * Math.cos(angle);
      n.y = cy + R * Math.sin(angle);
    });
  }

  // 1c. Gates on left rail
  var gates = nodes.filter(function (n) { return n.ntype === 'gate'; });
  if (gates.length) {
    gates.forEach(function (n, i) {
      var mid = (gates.length - 1) / 2;
      n.x = 80;
      n.y = cy + (i - mid) * 70;
    });
  }

  // 1d. Link endpoints from actual node positions
  links.forEach(function (l) {
    var n1 = nodes.find(function (n) { return n.id === l.from; });
    var n2 = nodes.find(function (n) { return n.id === l.to; });
    if (n1 && isFinite(n1.x) && isFinite(n1.y)) { l.x1 = n1.x; l.y1 = n1.y; }
    if (n2 && isFinite(n2.x) && isFinite(n2.y)) { l.x2 = n2.x; l.y2 = n2.y; }
  });

  return { ok: true };
}

// ============================================================
// Broken mutants — 4 flags total. When MIRROR_REPAIRED=true, delegate.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyComputePositions();

    var w = W(), h = H();
    var cx = w / 2, cy = h / 2;
    var R = Math.min(w, h) * 0.40;
    if (!isFinite(R) || R < 50) R = 360;
    if (!isFinite(cx)) cx = 600;
    if (!isFinite(cy)) cy = 400;

    if (!opts.dropInv1a) {
      var comp = nodes.find(function (n) { return n.ntype === 'composite'; });
      if (comp) { comp.x = cx; comp.y = cy; }
    }
    if (!opts.dropInv1b) {
      var dims = nodes.filter(function (n) { return n.ntype === 'dim'; });
      if (dims.length) {
        dims.forEach(function (n, i) {
          var angle = (2 * Math.PI * i / dims.length) - Math.PI / 2;
          n.x = cx + R * Math.cos(angle);
          n.y = cy + R * Math.sin(angle);
        });
      }
    }
    if (!opts.dropInv1c) {
      var gates = nodes.filter(function (n) { return n.ntype === 'gate'; });
      if (gates.length) {
        gates.forEach(function (n, i) {
          var mid = (gates.length - 1) / 2;
          n.x = 80;
          n.y = cy + (i - mid) * 70;
        });
      }
    }
    if (!opts.dropInv1d) {
      links.forEach(function (l) {
        var n1 = nodes.find(function (n) { return n.id === l.from; });
        var n2 = nodes.find(function (n) { return n.id === l.to; });
        if (n1 && isFinite(n1.x) && isFinite(n1.y)) { l.x1 = n1.x; l.y1 = n1.y; }
        if (n2 && isFinite(n2.x) && isFinite(n2.y)) { l.x2 = n2.x; l.y2 = n2.y; }
      });
    }

    return { ok: true };
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'composite center placement (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'dim radial placement (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'gate left rail placement (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'link endpoint sync (1d)' }
];

// ============================================================
// Fixtures — sourced from e54-fixtures.js via factory + deps
// ============================================================
var fx = require('./e54-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setNodes: setNodes,
  getNodes: getNodes,
  setLinks: setLinks,
  getLinks: getLinks
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E54 — computePositions() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-computePositions, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyComputePositions);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy computePositions) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);