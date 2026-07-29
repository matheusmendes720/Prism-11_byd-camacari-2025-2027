// e69-verify.js — getTourSteps() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3134-3137 (getTourSteps — source-of-truth
// lookup for the active tour's step array). Returns the steps belonging to
// the tour whose id matches the global currentTourId, or [] when no tour
// matches.
//
// Invariants (2 sub-checks):
//   1a. tours.find(...) call: looks up the matching tour in the catalog.
//       Without this, the function returns undefined and any caller
//       iterating over the result crashes on undefined.length / forEach.
//   1b. ternary t ? t.steps : []: extracts the steps array OR returns
//       the empty-array fallback. Without this, the function returns the
//       tour object itself (truthy) — callers expecting an array
//       silently iterate over `{id, label, steps}` and the tour UI breaks.
//
// Inverted mutant pattern: each fixture pre-seeds the tours catalog and
// currentTourId with sentinel values. Healthy code returns the steps
// array. Broken mutant drops the operation → returns undefined or the
// tour object → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tours catalog + current-tour selector
// ============================================================

var tours = [];
var currentTourId = '';

function getTours() { return tours; }
function setTours(arr) { tours = arr; }
function getCurrentTourId() { return currentTourId; }
function setCurrentTourId(id) { currentTourId = id; }

function resetEnv() {
  tours = [];
  currentTourId = '';
}

// ============================================================
// Mirror — getTourSteps() (HEALTHY, simplified)
//
// Faithful to L3134-3137 invariants for the 2 sub-checks above.
// ============================================================
function healthyGetTourSteps() {
  var t = tours.find(function (t) { return t.id === currentTourId; });
  return t ? t.steps : [];
}

// ============================================================
// Broken mutants — 2 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyGetTourSteps() so the test
// runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyGetTourSteps();

    if (!opts.dropInv1a) {
      var t = tours.find(function (t) { return t.id === currentTourId; });
    }
    if (!opts.dropInv1b) {
      return t ? t.steps : [];
    } else {
      return t;
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'tours.find call (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'ternary extract (1b)' }
];

// ============================================================
// Fixtures — sourced from e69-fixtures.js via factory + deps
// ============================================================
var fx = require('./e69-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTours: getTours,
  setTours: setTours,
  getCurrentTourId: getCurrentTourId,
  setCurrentTourId: setCurrentTourId
});

var healthyWrappedGetTourSteps = function () {
  return healthyGetTourSteps();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E69 — getTourSteps() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-getTourSteps, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedGetTourSteps);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy getTourSteps) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);