// e83-verify.js — renderTourSelectorCount() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1569-1578 (renderTourSelectorCount —
// reads the tour-selector-count element, picks tours.length with
// fallback 0, writes String(n) into el.textContent).
//
// Invariants (4 sub-checks):
//   1a. try/catch net: wraps the whole body (single try/catch — no
//       outer escape hatch like renderCanvasLegend).
//   1b. el null guard: skip when no element in DOM.
//   1c. tours.length fallback: 0 when tours undefined/empty.
//   1d. el.textContent write: write String(n).
//
// Inverted mutant pattern: each fixture pre-seeds mockDocument
// (getElementById), a mockEl with settable textContent, a tours[]
// global, and a warn counter. Healthy version: catch safely → early
// return on null → pick tours.length (fallback 0) → write String(n).
// Broken mutant drops a sub-check → distinct observable state.
//
// Detection channels:
//   F1 (dropInv1a — try/catch net) — caller-level try/catch on renderFn
//        sees throw propagation. textContent setter throws → healthy
//        catches (warn logged, no escape), T1 propagates (threw=true).
//   F2 (dropInv1b — el null guard) — warn count. el=null → healthy
//        returns early (warn=0), T2 reads null.textContent (warn=1).
//   F3 (dropInv1c — tours.length fallback) — warn count. tours=undefined
//        → healthy picks 0 (warn=0), T3 reads undefined.length (warn=1).
//   F4 (dropInv1d — textContent write) — textContent side effect.
//        tours=[a,b] → healthy writes '2', T4 leaves ''.
//
// Note: because the entire body is INSIDE the single try/catch (no
// renderCanvasLegend-style escape hatch like e82), dropInv1b and
// dropInv1c detection requires the wrapper to also call mockConsoleWarn
// — otherwise throws get swallowed silently with no observable side
// effect. The body wrapper below mirrors healthy's console.warn by
// incrementing warnCount.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. Plus F0 has
// 4 sub-cases (treated as one report) = 9 reports total.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tours[], mockDocument.getElementById, mockEl,
// warn counter, mockConsoleWarn.
// ============================================================
var TOURS;
var mockGetElementById = function (id) {
  if (id === 'tour-selector-count') return createMockEl();
  return null;
};
function createMockEl() {
  return { _textContent: '', get textContent() { return this._textContent; }, set textContent(v) { this._textContent = v; } };
}
var _mockEl = null;
function getMockEl() { return _mockEl; }
function setTours(v) {
  TOURS = v;
  if (typeof global !== 'undefined') global.tours = v;
}
function getTours() { return TOURS; }
function setGetElementById(fn) { mockGetElementById = fn; }
function getGetElementById() { return mockGetElementById; }
function createMockElFactory() {
  _mockEl = createMockEl();
  return _mockEl;
}

var warnCount = 0;
function setWarnCount(v) { warnCount = v; }
function getWarnCount() { return warnCount; }
function mockConsoleWarn(msg, err) { warnCount++; }

function resetEnv() {
  TOURS = undefined;
  mockGetElementById = function (id) {
    if (id === 'tour-selector-count') return createMockElFactory();
    return null;
  };
  _mockEl = null;
  warnCount = 0;
}

// ============================================================
// Mirror — renderTourSelectorCount() (HEALTHY, faithful to L1569-1578)
// ============================================================
function healthyRenderTourSelectorCount() {
  try {
    var el = document.getElementById('tour-selector-count');
    if (!el) return;
    var n = (typeof tours !== 'undefined' && tours.length) || 0;
    el.textContent = String(n);
  } catch (e) {
    mockConsoleWarn('[D3 E4] renderTourSelectorCount failed:', e);
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// dropInv1a: no outer try/catch net (throws propagate).
// dropInv1b: no el null guard.
// dropInv1c: no tours.length fallback (drop typeof guard).
// dropInv1d: no el.textContent write.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();

    function body() {
      var el = document.getElementById('tour-selector-count');
      if (!opts.dropInv1b) {
        if (!el) return;
      }
      // else: no null guard — proceed even when el is null.
      var n;
      if (opts.dropInv1c) {
        // No typeof guard — straight tours.length, throws if undefined.
        n = tours.length;
      } else {
        n = (typeof tours !== 'undefined' && tours.length) || 0;
      }
      if (!opts.dropInv1d) {
        el.textContent = String(n);
      }
    }

    if (opts.dropInv1a) {
      body();  // No outer try/catch net — throws propagate.
    } else {
      try { body(); } catch (e) { mockConsoleWarn('[D3 E4] simulated', e); }
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'try/catch net (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'el null guard (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'tours.length fallback (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'textContent write (1d)' }
];

// ============================================================
// Fixtures — sourced from e83-fixtures.js
// ============================================================
var fx = require('./e83-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setTours: setTours, getTours: getTours,
  setGetElementById: setGetElementById,
  createMockEl: createMockElFactory,
  getMockEl: getMockEl,
  getWarnCount: getWarnCount,
  setWarnCount: setWarnCount
});

// ============================================================
// Mock document.getElementById routing — fixture-installed overrides
// are checked first; fall back to default factory.
// ============================================================
function documentShim(id) {
  if (typeof mockGetElementById === 'function') return mockGetElementById(id);
  return null;
}
global.document = { getElementById: documentShim };
global.tours = undefined;

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E83 — renderTourSelectorCount() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
  resetEnv();
  global.tours = TOURS;
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderTourSelectorCount, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  global.tours = TOURS;
  var issues = fix.fn(function () {
    // Re-bind global.tours to the freshly-set TOURS before each
    // healthy renderFn invocation — F0 sub-cases change TOURS via
    // setTours() and we need the healthy code to read the latest.
    global.tours = TOURS;
    healthyRenderTourSelectorCount();
  });
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderTourSelectorCount) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);