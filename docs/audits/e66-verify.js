// e66-verify.js — tourNext() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3856-3859 (tourNext — chrome-only stub).
// Advances the tour by one step. At the last step, instead of advancing
// it triggers endTour() to clean up the overlay and per-node highlighting.
//
// Invariants (5 sub-checks):
//   1a. Bounds check (tourIdx < tourSteps.length - 1): decides whether to
//       advance or end the tour. If dropped, the else-branch (endTour) is
//       never taken — the tour over-advances indefinitely.
//   1b. tourIdx++ (advance position): increments the global tour index.
//   1c. showTourStep() call (re-render the active step DOM).
//   1d. updateTourCounter() call (refresh the progress counter).
//   1e. else-branch endTour() call (cleanup at last step).
//
// Inverted mutant pattern: each fixture pre-seeds state with sentinel
// values. Healthy code performs the operation → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// State tracked via in-place trackers (mirroring E56-E65):
//   - tourIdx (global counter)
//   - showTourStep call counter
//   - updateTourCounter call counter
//   - endTour call counter
// tourSteps is a fixed-length mock array (length=3 → max valid idx=2).
//
// 5 mutants × 1 target fixture + 5 controls (fixtures × healthy) = 10 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tour-state + delegate call counters
// ============================================================

var tourSteps = [{}, {}, {}]; // length=3, max valid idx=2
var tourIdx = 0;
var showTourStepCalls = 0;
var updateTourCounterCalls = 0;
var endTourCalls = 0;

function getTourIdx() { return tourIdx; }
function setTourIdx(v) { tourIdx = v; }

function getShowTourStepCalls() { return showTourStepCalls; }
function getUpdateTourCounterCalls() { return updateTourCounterCalls; }
function getEndTourCalls() { return endTourCalls; }

function healthyShowTourStep() {
  showTourStepCalls++;
}

function healthyUpdateTourCounter() {
  updateTourCounterCalls++;
}

function healthyEndTour() {
  endTourCalls++;
}

function resetEnv() {
  tourIdx = 0;
  showTourStepCalls = 0;
  updateTourCounterCalls = 0;
  endTourCalls = 0;
}

// ============================================================
// Mirror — tourNext() (HEALTHY, simplified)
//
// Faithful to L3856-3859 invariants for the 5 sub-checks above.
// ============================================================
function healthyTourNext() {
  if (tourIdx < tourSteps.length - 1) {
    tourIdx++;
    healthyShowTourStep();
    healthyUpdateTourCounter();
  } else {
    healthyEndTour();
  }
}

// ============================================================
// Broken mutants — 5 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyTourNext() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyTourNext();

    // Bounds check (1a). When dropped, the if-branch always fires — the
    // else-branch (endTour) is unreachable.
    var takeIfBranch = opts.dropInv1a ? true : (tourIdx < tourSteps.length - 1);
    if (takeIfBranch) {
      if (!opts.dropInv1b) tourIdx++;
      if (!opts.dropInv1c) healthyShowTourStep();
      if (!opts.dropInv1d) healthyUpdateTourCounter();
    } else {
      if (!opts.dropInv1e) healthyEndTour();
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'bounds check (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'tourIdx++ (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'showTourStep() call (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'updateTourCounter() call (1d)' },
  { id: 'T5', fn: makeBF({ dropInv1e: true }), target: 'F5', drop: 'else-branch endTour() call (1e)' }
];

// ============================================================
// Fixtures — sourced from e66-fixtures.js via factory + deps
// ============================================================
var fx = require('./e66-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTourIdx: getTourIdx,
  setTourIdx: setTourIdx,
  getShowTourStepCalls: getShowTourStepCalls,
  getUpdateTourCounterCalls: getUpdateTourCounterCalls,
  getEndTourCalls: getEndTourCalls
});

var healthyWrappedTourNext = function () {
  return healthyTourNext();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E66 — tourNext() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-tourNext, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedTourNext);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy tourNext) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);