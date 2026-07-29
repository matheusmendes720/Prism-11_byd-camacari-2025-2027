// e87-verify.js — updateLayerButtons() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3964-3975 (updateLayerButtons — sets
// .active class on .layer-btn elements matching currentLayer, and
// when layerActive=false (currentView not 'overview' or 'flow'),
// disables the buttons and dims them with opacity 0.4 / cursor
// not-allowed / guidance title).
//
// Invariants (5 sub-checks):
//   1a. active toggle: classList.toggle('active', data-layer===currentLayer).
//   1b. disabled: btn.disabled = !layerActive.
//   1c. opacity: '1' when layerActive, '0.4' otherwise.
//   1d. cursor: 'pointer' when layerActive, 'not-allowed' otherwise.
//   1e. title: '' when layerActive, 'Layers apply only to
//       Overview / Flow views' otherwise.
//
// Inverted mutant pattern: fixtures pre-seed a mock querySelectorAll
// that returns a fixed list of buttons; the harness captures into
// module-level globals (active, disabled, opacity, cursor, title,
// toggleCount). Healthy: iterate → toggle → set disabled/opacity/
// cursor/title. Broken mutant drops a sub-check → distinct
// observable state.
//
// Note: there is no try/catch net in the source — let throws
// propagate. Detection is direct: a side-effect that simply isn't
// there. No warn-count gymnastics needed.
//
// 5 mutants × 1 target fixture + 5 controls = 10 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — querySelectorAll + captured state.
// ============================================================

var _currentLayer = 'data';
var _currentView = 'overview';
var _buttons = [];
var _captured = [];

function setCurrentLayer(v) { _currentLayer = v; currentLayer = v; }
function setCurrentView(v) { _currentView = v; currentView = v; }
function getCurrentLayer() { return _currentLayer; }
function getCurrentView() { return _currentView; }

function seedButtons(layers) {
  _buttons = layers.map(function (layer) {
    // Use var hoisting so the toggle closure can capture `btn` by
    // reference (not by value). When classList.toggle is called as
    // `btn.classList.toggle(...)`, `this` inside the function is
    // `btn.classList`, so `this._toggleCount++` would mutate the
    // classList object, not the button. The closure-captured `btn`
    // is the underlying button object — updated each toggle call.
    var btn = {
      _layer: layer,
      _toggleCount: 0,
      _active: false,
      _disabled: false,
      _title: '',
      style: {}
    };
    btn.classList = {
      toggle: function (cls, on) {
        btn._toggleCount++;
        btn._active = !!on;
      }
    };
    btn.getAttribute = function (attr) {
      return attr === 'data-layer' ? btn._layer : null;
    };
    Object.defineProperty(btn, 'disabled', {
      get: function () { return btn._disabled; },
      set: function (v) { btn._disabled = v; },
      configurable: true
    });
    Object.defineProperty(btn, 'title', {
      get: function () { return btn._title; },
      set: function (v) { btn._title = v; },
      configurable: true
    });
    return btn;
  });
}

function snapshotCaptured() {
  _captured = _buttons.map(function (b) {
    return {
      layer: b._layer,
      active: !!b._active,
      toggleCount: b._toggleCount,
      disabled: !!b._disabled,
      opacity: b.style.opacity,
      cursor: b.style.cursor,
      title: b._title
    };
  });
}

function getCaptured() { return _captured; }

function resetEnv() {
  _currentLayer = 'data';
  _currentView = 'overview';
  _buttons = [];
  _captured = [];
}

function mockQuerySelectorAll(selector) {
  if (selector !== '.layer-btn') return [];
  return _buttons;
}

global.document = {
  querySelectorAll: mockQuerySelectorAll
};

// ============================================================
// Module-scope mirror of currentLayer / currentView (source uses
// closure refs; tests run outside the source module so we need
// vars the mirror's lexical scope can read).
// ============================================================
var currentLayer = 'data';
var currentView = 'overview';

// ============================================================
// Mirror — updateLayerButtons() (HEALTHY, faithful to L3964-3975)
// ============================================================
function healthyUpdateLayerButtons() {
  const layerActive = (currentView === 'overview' || currentView === 'flow');
  document.querySelectorAll('.layer-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-layer') === currentLayer;
    btn.classList.toggle('active', isActive);
    btn.disabled = !layerActive;
    btn.style.opacity = layerActive ? '1' : '0.4';
    btn.style.cursor = layerActive ? 'pointer' : 'not-allowed';
    btn.title = layerActive ? '' : 'Layers apply only to Overview / Flow views';
  });
}

// ============================================================
// Broken mutants — 5 boolean flags.
// dropInv1a: no classList.toggle call.
// dropInv1b: no btn.disabled assignment.
// dropInv1c: no btn.style.opacity assignment.
// dropInv1d: no btn.style.cursor assignment.
// dropInv1e: no btn.title assignment.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUpdateLayerButtons();
    const layerActive = (currentView === 'overview' || currentView === 'flow');
    document.querySelectorAll('.layer-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-layer') === currentLayer;
      if (!opts.dropInv1a) {
        btn.classList.toggle('active', isActive);
      }
      if (!opts.dropInv1b) {
        btn.disabled = !layerActive;
      }
      if (!opts.dropInv1c) {
        btn.style.opacity = layerActive ? '1' : '0.4';
      }
      if (!opts.dropInv1d) {
        btn.style.cursor = layerActive ? 'pointer' : 'not-allowed';
      }
      if (!opts.dropInv1e) {
        btn.title = layerActive ? '' : 'Layers apply only to Overview / Flow views';
      }
    });
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'active toggle (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'disabled assignment (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'opacity assignment (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'cursor assignment (1d)' },
  { id: 'T5', fn: makeBF({ dropInv1e: true }), target: 'F5', drop: 'title assignment (1e)' }
];

// ============================================================
// Fixtures — sourced from e87-fixtures.js
// ============================================================
var fx = require('./e87-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setCurrentLayer: setCurrentLayer,
  setCurrentView: setCurrentView,
  seedButtons: seedButtons,
  snapshotCaptured: snapshotCaptured,
  getCaptured: getCaptured
});

// ============================================================
// Runner — snapshots captured after every call.
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E87 — updateLayerButtons() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

function runAndSnapshot(updateFn) {
  resetEnv();
  updateFn();
  snapshotCaptured();
}

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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-updateLayerButtons, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  // Fixture handles its own resetEnv/seed/snapshot — pass the
  // healthy fn directly.
  var issues = fix.fn(healthyUpdateLayerButtons);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy updateLayerButtons) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);