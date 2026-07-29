// e56-verify.js — showTourSelector() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4007-4019 (showTourSelector — chrome-only stub).
// Resolves a tour by canonical ID (defaultTourId) then falls back to first
// entry, sets currentTourId/tourIdx, sets #tour-overlay display to 'flex',
// and invokes showTourStep().
//
// Invariants (4 sub-checks):
//   1a. Tour resolution (defaultTourId lookup > first entry fallback chain).
//   1b. State mutation: currentTourId = tour.id, tourIdx = 0.
//   1c. #tour-overlay.style.display = 'flex' write.
//   1d. showTourStep() invocation (rendering call).
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs or state with
// sentinel values. Healthy mirror performs the operation → sentinel gets
// overwritten. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — DOM stubs + tours + selector state + helpers
//
// elementMap is mutated in-place by resetEnv() so the lazy
// document.getElementById lookup always sees the live overlay reference.
// ============================================================

function makeOverlayStub() {
  return { style: { display: '' } };
}

var overlay = null;
var tours = null;
var currentTourId = null;
var tourIdx = 0;
var showTourStepCallCount = 0;

// Module-scoped defaultTourId. Declared with `var` so `typeof defaultTourId`
// is 'undefined' by default. Setting `defaultTourId = 'X'` (no var) in the
// fixture creates a global property and the mirror's bare identifier
// resolution chain sees it as defined.
var defaultTourId;

function getOverlay()                  { return overlay; }
function getTours()                    { return tours; }
function getFirstTourId()              { return tours[0].id; }
function getSecondTourId()             { return tours[1].id; }
function getSelectorState()            { return { currentTourId: currentTourId, tourIdx: tourIdx }; }
function setSelectorState(s)           { currentTourId = s.currentTourId; tourIdx = s.tourIdx; }
function setDefaultTourId(v)          { defaultTourId = v; }
function clearDefaultTourId()          { defaultTourId = undefined; }
function getShowTourStepCallCount()    { return showTourStepCallCount; }
function setShowTourStepCallCount(v)   { showTourStepCallCount = v; }

function makeHealthyTours() {
  return [
    { id: 'tour-fundamentos', name: 'Fundamentos', steps: [
      { title: 'Visão geral', desc: 'Visão geral do framework D3.' },
      { title: 'Dimensões',   desc: 'As 11 dimensões do framework.' }
    ] },
    { id: 'tour-decisao', name: 'Decisão', steps: [
      { title: 'Inversão', desc: 'Decisão de inversão.' }
    ] }
  ];
}

// In-place elementMap (declared once, mutated by resetEnv).
var elementMap = { 'tour-overlay': null };

function resetEnv() {
  overlay = makeOverlayStub();
  overlay.style.display = 'none';
  // Update elementMap in place — no reassignment needed.
  elementMap['tour-overlay'] = overlay;

  tours = makeHealthyTours();
  // Simulate prior state — showTourSelector should reset these.
  currentTourId = 'stale-prev';
  tourIdx = 99;

  showTourStepCallCount = 0;
  clearDefaultTourId();
}

// Mock document.getElementById — keyed by element id (lazy lookup).
global.document = {
  getElementById: function (id) { return elementMap[id] || null; },
  querySelectorAll: function (_selector) { return []; }
};

// Mock showTourStep — counter that increments when invoked.
function showTourStep() {
  showTourStepCallCount++;
}

// ============================================================
// Mirror — showTourSelector() (HEALTHY, simplified)
//
// Faithful to L4007-4019 invariants for the 4 sub-checks above. Resolves
// the tour by canonical ID first, then falls back to first entry; sets
// state; sets overlay display; invokes showTourStep().
// ============================================================
function healthyShowTourSelector() {
  var tour = (typeof defaultTourId !== 'undefined' && tours.find(function (t) { return t.id === defaultTourId; }))
            || (tours && tours[0]);
  if (tour) {
    currentTourId = tour.id;
    tourIdx = 0;
    document.getElementById('tour-overlay').style.display = 'flex';
    showTourStep();
  }
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyShowTourSelector();

    var tour = (typeof defaultTourId !== 'undefined' && tours.find(function (t) { return t.id === defaultTourId; }))
              || (tours && tours[0]);
    if (tour) {
      if (!opts.dropInv1b) {
        currentTourId = tour.id;
        tourIdx = 0;
      }
      if (!opts.dropInv1c) {
        document.getElementById('tour-overlay').style.display = 'flex';
      }
      if (!opts.dropInv1d) {
        showTourStep();
      }
    }
  };
}

// T1 drops the defaultTourId lookup branch — always uses first entry.
function makeBF1a() {
  return function () {
    if (MIRROR_REPAIRED) return healthyShowTourSelector();
    var tour = tours[0];
    if (tour) {
      currentTourId = tour.id;
      tourIdx = 0;
      document.getElementById('tour-overlay').style.display = 'flex';
      showTourStep();
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF1a(),                           target: 'F1', drop: 'defaultTourId lookup branch (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }),          target: 'F2', drop: 'state mutation (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }),          target: 'F3', drop: 'overlay display write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }),          target: 'F4', drop: 'showTourStep invocation (1d)' }
];

// ============================================================
// Fixtures — sourced from e56-fixtures.js via factory + deps
// ============================================================
var fx = require('./e56-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getOverlay: getOverlay,
  getFirstTourId: getFirstTourId,
  getSecondTourId: getSecondTourId,
  getSelectorState: getSelectorState,
  setSelectorState: setSelectorState,
  setDefaultTourId: setDefaultTourId,
  getShowTourStepCallCount: getShowTourStepCallCount,
  setShowTourStepCallCount: setShowTourStepCallCount
});

// Wrap each fixture so resetEnv is called BEFORE the rendering pass. The
// runner no longer needs to call resetEnv() per-mutant.
var healthyWrappedShowTourSelector = function () {
  return healthyShowTourSelector();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E56 — showTourSelector() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-showTourSelector, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedShowTourSelector);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy showTourSelector) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
