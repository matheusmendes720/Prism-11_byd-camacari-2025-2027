// e67-verify.js — tourPrev() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3860-3861 (tourPrev — chrome-only stub).
// Rewinds the tour by one step. At the start (tourIdx=0) it does nothing.
// This is the symmetric counterpart to tourNext (E66).
//
// Invariants (4 sub-checks):
//   1a. Bounds check (tourIdx > 0): guards the rewind. If dropped, the
//       tour over-rewinds into negative indices AND delegate calls fire
//       when they shouldn't.
//   1b. tourIdx-- (rewind position): decrements the global tour index.
//   1c. showTourStep() call (re-render the active step DOM).
//   1d. updateTourCounter() call (refresh the progress counter).
//
// Inverted mutant pattern: each fixture pre-seeds state with sentinel
// values. Healthy code performs the operation → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// State tracked via in-place trackers:
//   - tourIdx (global counter)
//   - showTourStep call counter
//   - updateTourCounter call counter
// tourSteps is not needed here — the bounds check is tourIdx > 0.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tour-state + delegate call counters
// ============================================================

var tourIdx = 0;
var showTourStepCalls = 0;
var updateTourCounterCalls = 0;

function getTourIdx() { return tourIdx; }
function setTourIdx(v) { tourIdx = v; }

function getShowTourStepCalls() { return showTourStepCalls; }
function getUpdateTourCounterCalls() { return updateTourCounterCalls; }

function healthyShowTourStep() {
  showTourStepCalls++;
}

function healthyUpdateTourCounter() {
  updateTourCounterCalls++;
}

function resetEnv() {
  tourIdx = 0;
  showTourStepCalls = 0;
  updateTourCounterCalls = 0;
}

// ============================================================
// Mirror — tourPrev() (HEALTHY, simplified)
//
// Faithful to L3860-3861 invariants for the 4 sub-checks above.
// ============================================================
function healthyTourPrev() {
  if (tourIdx > 0) {
    tourIdx--;
    healthyShowTourStep();
    healthyUpdateTourCounter();
  }
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyTourPrev() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyTourPrev();

    // Bounds check (1a). When dropped, the if-branch always fires — the
    // guard is unreachable.
    var takeIfBranch = opts.dropInv1a ? true : (tourIdx > 0);
    if (takeIfBranch) {
      if (!opts.dropInv1b) tourIdx--;
      if (!opts.dropInv1c) healthyShowTourStep();
      if (!opts.dropInv1d) healthyUpdateTourCounter();
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'bounds check (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'tourIdx-- (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'showTourStep() call (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'updateTourCounter() call (1d)' }
];

// ============================================================
// Fixtures — sourced from e67-fixtures.js via factory + deps
// ============================================================
var fx = require('./e67-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTourIdx: getTourIdx,
  setTourIdx: setTourIdx,
  getShowTourStepCalls: getShowTourStepCalls,
  getUpdateTourCounterCalls: getUpdateTourCounterCalls
});

var healthyWrappedTourPrev = function () {
  return healthyTourPrev();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E67 — tourPrev() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-tourPrev, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedTourPrev);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy tourPrev) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);