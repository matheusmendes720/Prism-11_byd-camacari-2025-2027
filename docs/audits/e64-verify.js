// e64-verify.js — endTour() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3863-3868 (endTour — chrome-only stub).
// Resets tour-active state, hides the tour overlay + progress bar, and
// removes per-node 'tour-target' class from all .node-group elements.
//
// Invariants (4 sub-checks):
//   1a. tourActive = false (global state mutation — flips to false so
//       tour UI re-enables and other chrome handlers can react).
//   1b. #tour-overlay  → remove 'visible' class (hides overlay).
//   1c. #tour-progress → remove 'visible' class (hides progress bar).
//   1d. all .node-group → remove 'tour-target' class (clears highlighting).
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the operation → sentinel overwritten. Broken
// mutant drops the operation → sentinel survives → fixture reports issue →
// runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// All four targets are tracked via in-place elementMap / state trackers
// (mirroring E56-E63). The fixture surface provides:
//   - tourActive tracker (global)
//   - overlay classList stub (id='tour-overlay')
//   - progress classList stub (id='tour-progress')
//   - 3 .node-group classList stubs (pre-seeded by fixture)
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tour-state tracker + DOM stubs
// ============================================================

var tourActive = false;

function getTourActive() { return tourActive; }
function setTourActive(v) { tourActive = v; }

function makeClassListStub(initialClasses) {
  var classes = (initialClasses || []).slice();
  return {
    classes: classes,
    add: function (cls) { if (classes.indexOf(cls) < 0) classes.push(cls); },
    remove: function (cls) {
      var idx = classes.indexOf(cls);
      if (idx >= 0) classes.splice(idx, 1);
    },
    contains: function (cls) { return classes.indexOf(cls) >= 0; }
  };
}

function makeElementStub(id, initialClasses) {
  return { id: id, classList: makeClassListStub(initialClasses) };
}

var overlayEl = makeElementStub('tour-overlay', []);
var progressEl = makeElementStub('tour-progress', []);
var nodeGroupStubs = [];

function getOverlayClasses()   { return overlayEl.classList.classes; }
function getProgressClasses()  { return progressEl.classList.classes; }
function setOverlayClass(cls)  { overlayEl.classList.add(cls); }
function setProgressClass(cls) { progressEl.classList.add(cls); }

function getNodeGroupStubs() { return nodeGroupStubs; }

function addNodeGroupStubs(n) {
  for (var i = 0; i < n; i++) {
    nodeGroupStubs.push(makeElementStub('node-group-' + i, ['tour-target']));
  }
}

function resetEnv() {
  tourActive = false;
  overlayEl = makeElementStub('tour-overlay', []);
  progressEl = makeElementStub('tour-progress', []);
  nodeGroupStubs = [];
}

global.document = {
  getElementById: function (id) {
    if (id === 'tour-overlay')  return overlayEl;
    if (id === 'tour-progress') return progressEl;
    return null;
  },
  querySelectorAll: function (selector) {
    if (selector === '.node-group') return nodeGroupStubs;
    return [];
  }
};

// ============================================================
// Mirror — endTour() (HEALTHY, simplified)
//
// Faithful to L3863-3868 invariants for the 4 sub-checks above.
// ============================================================
function healthyEndTour() {
  tourActive = false;
  document.getElementById('tour-overlay').classList.remove('visible');
  document.getElementById('tour-progress').classList.remove('visible');
  document.querySelectorAll('.node-group').forEach(function (g) {
    g.classList.remove('tour-target');
  });
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyEndTour() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyEndTour();

    if (!opts.dropInv1a) tourActive = false;
    if (!opts.dropInv1b) document.getElementById('tour-overlay').classList.remove('visible');
    if (!opts.dropInv1c) document.getElementById('tour-progress').classList.remove('visible');
    if (!opts.dropInv1d) {
      document.querySelectorAll('.node-group').forEach(function (g) {
        g.classList.remove('tour-target');
      });
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'tourActive=false (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'overlay visible remove (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'progress visible remove (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'node-group tour-target remove (1d)' }
];

// ============================================================
// Fixtures — sourced from e64-fixtures.js via factory + deps
// ============================================================
var fx = require('./e64-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTourActive: getTourActive,
  setTourActive: setTourActive,
  getOverlayClasses: getOverlayClasses,
  setOverlayClass: setOverlayClass,
  getProgressClasses: getProgressClasses,
  setProgressClass: setProgressClass,
  addNodeGroupStubs: addNodeGroupStubs,
  getNodeGroupStubs: getNodeGroupStubs
});

var healthyWrappedEndTour = function () {
  return healthyEndTour();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E64 — endTour() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-endTour, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedEndTour);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy endTour) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);