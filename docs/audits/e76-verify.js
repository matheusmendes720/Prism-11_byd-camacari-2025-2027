// e76-verify.js — updateLayerButtons() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3964-3975 (updateLayerButtons — toggles
// .layer-btn DOM state for current view + current layer).
//
// Invariants (4 sub-checks):
//   1a. layerActive gate: true when currentView ∈ {overview, flow}.
//   1b. 'active' class toggle: matches data-layer === currentLayer.
//   1c. disabled property: btn.disabled = !layerActive.
//   1d. opacity/cursor/title triple: bulk per-button.
//
// Inverted mutant pattern: each fixture pre-seeds currentView,
// currentLayer, and a mockBtns array. Healthy version mutates buttons
// correctly. Broken mutant drops a mutation → button state stays at
// sentinel → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — currentView, currentLayer, mockBtns
// ============================================================
var currentView = '', currentLayer = '';
var mockBtns = [];

function getView() { return currentView; }
function setView(v) { currentView = v; }
function getLayer() { return currentLayer; }
function setLayer(v) { currentLayer = v; }
function getMockBtns() { return mockBtns; }
function setMockBtns(specs) {
  mockBtns = specs.map(function (spec) {
    return {
      layer: spec.layer,
      classes: new Set(),
      disabled: false,
      style: { opacity: '', cursor: '' },
      title: '',
      getAttribute: function (name) {
        if (name === 'data-layer') return this.layer;
        return null;
      },
      classList: {
        toggle: function (cls, force) {
          if (force) this._owner.classes.add(cls);
          else this._owner.classes.delete(cls);
        }.bind({ _owner: null })
      }
    };
  });
  // re-bind classList.toggle to the right owner
  mockBtns.forEach(function (b) {
    b.classList.toggle = function (cls, force) {
      if (force) b.classes.add(cls);
      else b.classes.delete(cls);
    };
  });
}

function resetEnv() {
  currentView = ''; currentLayer = ''; mockBtns = [];
}

// ============================================================
// Mock DOM
// ============================================================
function mockQuerySelectorAll() { return mockBtns; }
function mockForEach(cb) { mockBtns.forEach(cb); }

// ============================================================
// Mirror — updateLayerButtons() (HEALTHY, faithful to L3964-3975)
// ============================================================
function healthyUpdateLayerButtons() {
  var layerActive = (currentView === 'overview' || currentView === 'flow');
  mockForEach(function (btn) {
    var isActive = btn.getAttribute('data-layer') === currentLayer;
    btn.classList.toggle('active', isActive);
    btn.disabled = !layerActive;
    btn.style.opacity = layerActive ? '1' : '0.4';
    btn.style.cursor = layerActive ? 'pointer' : 'not-allowed';
    btn.title = layerActive ? '' : 'Layers apply only to Overview / Flow views';
  });
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyUpdateLayerButtons();

    var layerActive;
    if (opts.dropInv1a) {
      layerActive = false; // gate drop → constant false
    } else {
      layerActive = (currentView === 'overview' || currentView === 'flow');
    }

    mockForEach(function (btn) {
      var isActive;
      if (opts.dropInv1b) {
        isActive = false; // active class toggle drop
      } else {
        isActive = btn.getAttribute('data-layer') === currentLayer;
      }
      btn.classList.toggle('active', isActive);

      if (opts.dropInv1c) {
        btn.disabled = true; // disabled prop drop → constant true
      } else {
        btn.disabled = !layerActive;
      }

      if (opts.dropInv1d) {
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        btn.title = 'Layers apply only to Overview / Flow views';
      } else {
        btn.style.opacity = layerActive ? '1' : '0.4';
        btn.style.cursor = layerActive ? 'pointer' : 'not-allowed';
        btn.title = layerActive ? '' : 'Layers apply only to Overview / Flow views';
      }
    });
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'layerActive gate (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: "'active' class toggle (1b)" },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'disabled prop (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'opacity/cursor/title triple (1d)' }
];

// ============================================================
// Fixtures — sourced from e76-fixtures.js
// ============================================================
var fx = require('./e76-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setView: setView, getView: getView,
  setLayer: setLayer, getLayer: getLayer,
  setMockBtns: setMockBtns, getMockBtns: getMockBtns
});

var healthyWrappedRender = function () {
  return healthyUpdateLayerButtons();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E76 — updateLayerButtons() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-updateLayerButtons, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedRender);
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