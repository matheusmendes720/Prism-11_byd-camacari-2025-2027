// e65-verify.js — restartTour() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3869-3872 (restartTour — chrome-only stub).
// Resets the tour position to step 0 and re-renders the active step so the
// user can replay the walkthrough from scratch.
//
// Invariants (2 sub-checks):
//   1a. tourIdx = 0 (resets the global position tracker to step 0).
//   1b. showTourStep() call (re-renders the active step DOM).
//
// Inverted mutant pattern: each fixture pre-seeds state with sentinel
// values. Healthy code performs the operation → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// Both targets are tracked via in-place trackers (mirroring E56-E64):
//   - tourIdx (global counter)
//   - showTourStep call counter (incremented on each call)
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tour-state tracker + showTourStep counter
// ============================================================

var tourIdx = 0;
var showTourStepCalls = 0;

function getTourIdx() { return tourIdx; }
function setTourIdx(v) { tourIdx = v; }

function getShowTourStepCalls() { return showTourStepCalls; }

function healthyShowTourStep() {
  showTourStepCalls++;
}

function resetEnv() {
  tourIdx = 0;
  showTourStepCalls = 0;
}

// ============================================================
// Mirror — restartTour() (HEALTHY, simplified)
//
// Faithful to L3869-3872 invariants for the 2 sub-checks above.
// ============================================================
function healthyRestartTour() {
  tourIdx = 0;
  healthyShowTourStep();
}

// ============================================================
// Broken mutants — 2 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyRestartTour() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRestartTour();

    if (!opts.dropInv1a) tourIdx = 0;
    if (!opts.dropInv1b) healthyShowTourStep();
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'tourIdx=0 (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'showTourStep() call (1b)' }
];

// ============================================================
// Fixtures — sourced from e65-fixtures.js via factory + deps
// ============================================================
var fx = require('./e65-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTourIdx: getTourIdx,
  setTourIdx: setTourIdx,
  getShowTourStepCalls: getShowTourStepCalls
});

var healthyWrappedRestartTour = function () {
  return healthyRestartTour();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E65 — restartTour() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-restartTour, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedRestartTour);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy restartTour) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);