// e95-verify.js — showTourSelector() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4007-4019 (showTourSelector —
// shows tour modal and starts the tour).
//
// Invariants (3 sub-checks):
//   1a. tour-overlay display = 'flex'.
//   1b. currentTourId is set.
//   1c. showTourStep was called (call counter).
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================

var _tourOverlayDisplay = '';
var _currentTourId = null;
var _showTourStepCalls = 0;

function resetEnv() {
  _tourOverlayDisplay = '';
  _currentTourId = null;
  _showTourStepCalls = 0;
}

function getSnapshot() {
  return {
    tourOverlayDisplay: _tourOverlayDisplay,
    currentTourId: _currentTourId,
    showTourStepCalls: _showTourStepCalls
  };
}

// Mock DOM element for tour-overlay
var mockTourOverlay = {
  style: {
    get display() { return _tourOverlayDisplay; },
    set display(v) { _tourOverlayDisplay = v; }
  }
};

global.document = {
  getElementById: function (id) {
    if (id === 'tour-overlay') return mockTourOverlay;
    return null;
  }
};

// ============================================================
// Data stubs
// ============================================================

var tours = [
  { id: 't1', label: 'Tour 1' },
  { id: 't2', label: 'Tour 2' }
];
var defaultTourId = 't1';
var tourIdx = 0;

// ============================================================
// Healthy showTourSelector (L4007-4019)
// ============================================================
function healthyShowTourSelector() {
  try {
    var tour = (typeof defaultTourId !== 'undefined' && tours.find(function (t) { return t.id === defaultTourId; }))
              || (tours && tours[0]);
    if (tour) {
      // Module-level vars — we simulate via globals
      global._setCurrentTourId(tour.id);
      global._setTourIdx(0);
      var overlay = document.getElementById('tour-overlay');
      if (overlay) overlay.style.display = 'flex';
      global._callShowTourStep();
    }
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Broken mutant — does NOT set display='flex'
// ============================================================
function brokenShowTourSelector() {
  if (MIRROR_REPAIRED) return healthyShowTourSelector();
  try {
    var tour = (typeof defaultTourId !== 'undefined' && tours.find(function (t) { return t.id === defaultTourId; }))
              || (tours && tours[0]);
    if (tour) {
      global._setCurrentTourId(tour.id);
      global._setTourIdx(0);
      var overlay = document.getElementById('tour-overlay');
      // T1: drop overlay display='flex' — tour overlay stays hidden.
      // if (overlay) overlay.style.display = 'flex';
      global._callShowTourStep();
    }
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Global state setters (used by both healthy and broken)
// ============================================================
global._setCurrentTourId = function (id) { _currentTourId = id; };
global._setTourIdx = function (i) { tourIdx = i; };
global._callShowTourStep = function () { _showTourStepCalls++; };

var MUTANTS = [
  { id: 'T1', fn: brokenShowTourSelector, target: 'F0', drop: 'overlay display=flex (1a)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e95-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getSnapshot: getSnapshot
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E95 — showTourSelector() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

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

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyShowTourSelector);
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
