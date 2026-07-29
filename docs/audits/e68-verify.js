// e68-verify.js — updateTourCounter() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3873-3876 (updateTourCounter — chrome-only
// stub). Refreshes the tour progress counter in the DOM. Calls
// getTourSteps() to re-sync the global tourSteps array with the
// source-of-truth (which may have grown), then writes "(tourIdx+1) / N"
// to the #tour-step-count element's textContent.
//
// Invariants (2 sub-checks):
//   1a. getTourSteps() call: refreshes the global tourSteps array each
//       call. Without this, a freshly-added step would not show in the
//       counter until something else triggers the refresh.
//   1b. textContent assignment: writes the formatted string to the DOM.
//       Without this, the counter element would never update.
//
// Inverted mutant pattern: each fixture pre-seeds state with sentinel
// values. Healthy code performs the operation → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// Mock env: tourSteps (mutable), tourIdx (mutable), getTourSteps() returns
// fixed-length-3 array, getElementById('tour-step-count') returns element
// stub with textContent property.
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tour-state + DOM stubs
// ============================================================

var tourSteps = [];                    // mutable global, pre-seeded per fixture
var tourIdx = 0;                       // mutable global
var getTourStepsReturnValue = [{}, {}, {}]; // fixed-length mock source
var tourStepCountElement = { textContent: '' }; // element stub

function getTourSteps() {
  return getTourStepsReturnValue;
}

function getTourStepsReturn() {
  return getTourStepsReturnValue;
}

function getTourStepsFromGlobal() {
  return tourSteps;
}

function setTourSteps(arr) {
  tourSteps = arr;
}

function getTourIdx() { return tourIdx; }
function setTourIdx(v) { tourIdx = v; }

function getTourStepCountTextContent() { return tourStepCountElement.textContent; }
function setTourStepCountTextContent(v) { tourStepCountElement.textContent = v; }

function documentGetElementById(id) {
  if (id === 'tour-step-count') return tourStepCountElement;
  return null;
}

function resetEnv() {
  tourSteps = [];
  tourIdx = 0;
  tourStepCountElement.textContent = '';
}

// ============================================================
// Mirror — updateTourCounter() (HEALTHY, simplified)
//
// Faithful to L3873-3876 invariants for the 2 sub-checks above.
// ============================================================
function healthyUpdateTourCounter() {
  tourSteps = getTourSteps();
  documentGetElementById('tour-step-count').textContent = (tourIdx + 1) + ' / ' + tourSteps.length;
}

// ============================================================
// Broken mutants — 2 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyUpdateTourCounter() so the
// test runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUpdateTourCounter();

    if (!opts.dropInv1a) tourSteps = getTourSteps();
    if (!opts.dropInv1b) {
      documentGetElementById('tour-step-count').textContent = (tourIdx + 1) + ' / ' + tourSteps.length;
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'getTourSteps() call (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'textContent assignment (1b)' }
];

// ============================================================
// Fixtures — sourced from e68-fixtures.js via factory + deps
// ============================================================
var fx = require('./e68-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTourIdx: getTourIdx,
  setTourIdx: setTourIdx,
  getTourSteps: getTourStepsFromGlobal,
  setTourSteps: setTourSteps,
  getTourStepsReturn: getTourStepsReturn,
  getTourStepCountTextContent: getTourStepCountTextContent,
  setTourStepCountTextContent: setTourStepCountTextContent
});

var healthyWrappedUpdateTourCounter = function () {
  return healthyUpdateTourCounter();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E68 — updateTourCounter() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-updateTourCounter, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedUpdateTourCounter);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy updateTourCounter) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);