// e88-verify.js — updateViewButtons() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3976-3978 (updateViewButtons — toggles
// 'active' class on each .view-btn to true iff the button's data-view
// attribute equals currentView, removing it from all others).
//
// Invariant (1 sub-check):
//   1a. active toggle: classList.toggle('active', data-view===currentView).
//
// Inverted mutant pattern: fixture pre-seeds currentView and a mock
// querySelectorAll that returns buttons whose classList.toggle captures
// toggleCount and _active into a module-level global. Healthy version:
// iterate all buttons, toggle('active',true) for the matching one,
// toggle('active',false) for all others. Broken mutant drops the entire
// toggle call → all buttons stay at seeded _active=false → detection.
//
// Note: there is no try/catch net in the source — let throws propagate.
// Detection is direct: a side-effect that simply isn't there.
//
// 1 mutant × 1 target fixture + 2 controls = 3 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — querySelectorAll + captured state.
// ============================================================

var _currentView = 'overview';
var _buttons = [];
var _captured = [];

function setCurrentView(v) { _currentView = v; currentView = v; }
function getCurrentView() { return _currentView; }

function seedButtons(views) {
  _buttons = views.map(function (view) {
    // Use a var hoisted in the outer scope so the classList.toggle
    // closure captures `btn` by reference. This mirrors E87's fix —
    // without this, `this` inside toggle() would be btn.classList,
    // not btn, so _active never updates.
    var btn = {
      _view: view,
      _toggleCount: 0,
      _active: false,
      style: {}
    };
    btn.classList = {
      toggle: function (cls, on) {
        btn._toggleCount++;
        btn._active = !!on;
      }
    };
    btn.getAttribute = function (attr) {
      return attr === 'data-view' ? btn._view : null;
    };
    return btn;
  });
}

function snapshotCaptured() {
  _captured = _buttons.map(function (b) {
    return {
      view: b._view,
      active: !!b._active,
      toggleCount: b._toggleCount
    };
  });
}

function getCaptured() { return _captured; }

function resetEnv() {
  _currentView = 'overview';
  _buttons = [];
  _captured = [];
}

function mockQuerySelectorAll(selector) {
  if (selector !== '.view-btn') return [];
  return _buttons;
}

global.document = {
  querySelectorAll: mockQuerySelectorAll
};

// ============================================================
// Module-scope mirror of currentView (source uses closure ref).
// ============================================================
var currentView = 'overview';

// ============================================================
// Mirror — updateViewButtons() (HEALTHY, faithful to L3976-3978)
// ============================================================
function healthyUpdateViewButtons() {
  document.querySelectorAll('.view-btn').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-view') === currentView)
  );
}

// ============================================================
// Broken mutant — 1 boolean flag.
// dropInv1: no classList.toggle at all.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUpdateViewButtons();
    document.querySelectorAll('.view-btn').forEach(b => {
      if (!opts.dropInv1) {
        b.classList.toggle('active', b.getAttribute('data-view') === currentView);
      }
    });
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1: true }), target: 'F1', drop: 'classList.toggle (1a)' }
];

// ============================================================
// Fixtures — sourced from e88-fixtures.js
// ============================================================
var fx = require('./e88-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setCurrentView: setCurrentView,
  seedButtons: seedButtons,
  snapshotCaptured: snapshotCaptured,
  getCaptured: getCaptured
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E88 — updateViewButtons() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-updateViewButtons, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  var issues = fix.fn(healthyUpdateViewButtons);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy updateViewButtons) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
