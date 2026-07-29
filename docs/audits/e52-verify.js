// e52-verify.js — renderTopbarStats() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L582-593 (renderTopbarStats — E1 chrome).
// Called from init() before build() so the user never sees the hardcoded
// "11" / "28" placeholders. The function is intentionally minimal — it
// just writes getCounts().nodes and getCounts().edges into the two
// stat-* spans, gracefully degrading if either DOM element is absent.
//
// Invariants (4 sub-checks):
//   1a. getCounts() returns a numeric .nodes field (≥ 0, integer)
//   1b. getCounts() returns a numeric .edges field (≥ 0, integer)
//   1c. When #stat-nodes exists, its textContent equals getCounts().nodes
//   1d. When #stat-edges exists, its textContent equals getCounts().edges
//
// 4 mutants × 1 target fixture each + 5 controls (fixtures × healthy) =
// 4 + 5 = 9 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — minimal DOM stub + getCounts() override.
// ============================================================
var statNodes = null;  // object {textContent: string} or null
var statEdges = null;
var counts    = { nodes: 11, edges: 28 };

function makeHealthyCounts() {
  return { nodes: 11, edges: 28 };
}

function setStatNodes(v) { statNodes = v; }
function getStatNodes()  { return statNodes; }
function setStatEdges(v) { statEdges = v; }
function getStatEdges()  { return statEdges; }
function setCounts(v)    { counts = v; }
function getCounts()     { return counts; }

function resetEnv() {
  statNodes = { textContent: '' };
  statEdges = { textContent: '' };
  counts    = makeHealthyCounts();
}

// ============================================================
// Mock document.getElementById — returns our stubs by id, else null.
// ============================================================
global.document = {
  getElementById: function (id) {
    if (id === 'stat-nodes') return statNodes;
    if (id === 'stat-edges') return statEdges;
    return null;
  }
};

// ============================================================
// Mirror — renderTopbarStats() (HEALTHY)
// ============================================================
function healthyRenderTopbarStats() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 1a. counts.nodes numeric
  if (typeof counts.nodes !== 'number' || !isFinite(counts.nodes) ||
      counts.nodes < 0 || Math.floor(counts.nodes) !== counts.nodes) {
    fail('getCounts().nodes must be a non-negative integer (got ' +
         (typeof counts.nodes === 'number' ? counts.nodes : typeof counts.nodes) + ')');
  }

  // 1b. counts.edges numeric
  if (typeof counts.edges !== 'number' || !isFinite(counts.edges) ||
      counts.edges < 0 || Math.floor(counts.edges) !== counts.edges) {
    fail('getCounts().edges must be a non-negative integer (got ' +
         (typeof counts.edges === 'number' ? counts.edges : typeof counts.edges) + ')');
  }

  // 1c/1d. Write to DOM (gracefully degrade when null)
  try {
    var sNodes = document.getElementById('stat-nodes');
    if (sNodes) sNodes.textContent = counts.nodes;
    var sEdges = document.getElementById('stat-edges');
    if (sEdges) sEdges.textContent = counts.edges;
  } catch (e) { fail('renderTopbarStats body threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — factory pattern. 4 flags total.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderTopbarStats();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    if (!opts.dropInv1a) {
      if (typeof counts.nodes !== 'number' || !isFinite(counts.nodes) ||
          counts.nodes < 0 || Math.floor(counts.nodes) !== counts.nodes) {
        fail('getCounts().nodes must be a non-negative integer (got ' +
             (typeof counts.nodes === 'number' ? counts.nodes : typeof counts.nodes) + ')');
      }
    }
    if (!opts.dropInv1b) {
      if (typeof counts.edges !== 'number' || !isFinite(counts.edges) ||
          counts.edges < 0 || Math.floor(counts.edges) !== counts.edges) {
        fail('getCounts().edges must be a non-negative integer (got ' +
             (typeof counts.edges === 'number' ? counts.edges : typeof counts.edges) + ')');
      }
    }
    if (!opts.dropInv1c || !opts.dropInv1d) {
      try {
        var sNodes = document.getElementById('stat-nodes');
        if (sNodes && !opts.dropInv1c) sNodes.textContent = counts.nodes;
        var sEdges = document.getElementById('stat-edges');
        if (sEdges && !opts.dropInv1d) sEdges.textContent = counts.edges;
      } catch (e) { fail('renderTopbarStats body threw: ' + e.message); }
    }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'counts.nodes numeric check (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'counts.edges numeric check (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: '#stat-nodes write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: '#stat-edges write (1d)' }
];

// ============================================================
// Fixtures — sourced from e52-fixtures.js via factory + deps
// ============================================================
var fx = require('./e52-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv:     resetEnv,
  setStatNodes: setStatNodes,
  getStatNodes: getStatNodes,
  setStatEdges: setStatEdges,
  getStatEdges: getStatEdges,
  setCounts:    setCounts,
  getCounts:    getCounts
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E52 — renderTopbarStats() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderTopbarStats, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyRenderTopbarStats);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderTopbarStats) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
