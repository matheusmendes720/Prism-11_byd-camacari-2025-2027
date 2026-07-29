// e61-verify.js — moveTooltip() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4233-4244 (moveTooltip — chrome-only stub).
// The mouse-move handler that re-positions the tooltip element by writing
// style.left / style.top with a +14px offset from the event clientX/Y.
//
// Invariants (4 sub-checks):
//   1a. _getTooltip() invocation + display guard: tooltip retrieved (lazy
//       create on first call), and the function bails early when the
//       tooltip's style.display is 'none'.
//   1b. Coordinate calc: x = (event.clientX || 0) + 14 and
//       y = (event.clientY || 0) + 14.
//   1c. style.left write: tt.style.left = x + 'px'.
//   1d. style.top write:  tt.style.top  = y + 'px'.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// The tooltip element is created lazily via _getTooltip() which calls
// document.createElement('div') + document.body.appendChild(). Both are
// mocked via the in-place elementMap pattern (mirroring E56-E60).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tooltip stub + createElement + body.appendChild
// ============================================================

function makeTooltipStub() {
  return {
    id: '',
    cssText: '',
    innerHTML: '',
    isConnected: false,
    _appendedToBody: false,
    style: {
      cssText: '',
      display: '',
      left: '',
      top: ''
    }
  };
}

var _tooltipEl = null;
var CURRENT_EVENT = null;

function makeEvent(clientX, clientY) {
  CURRENT_EVENT = { clientX: clientX, clientY: clientY };
}

function getTooltip() { return _tooltipEl; }

function resetEnv() {
  _tooltipEl = null;
  CURRENT_EVENT = null;
}

global.document = {
  createElement: function (tag) {
    if (tag === 'div') return makeTooltipStub();
    return null;
  },
  body: {
    appendChild: function (el) {
      el._appendedToBody = true;
      el.isConnected = true;
    }
  }
};

// _getTooltip mirror — lazy create + append on first call, return cached
// after. Mirrors the source pattern at L4199-4209.
function _getTooltip() {
  if (!_tooltipEl || !_tooltipEl.isConnected) {
    _tooltipEl = document.createElement('div');
    _tooltipEl.id = 'd3-node-tooltip';
    _tooltipEl.style.cssText = 'position:fixed;z-index:9999;...';
    document.body.appendChild(_tooltipEl);
  }
  return _tooltipEl;
}

// ============================================================
// Mirror — moveTooltip() (HEALTHY, simplified)
//
// Faithful to L4233-4244 invariants for the 4 sub-checks above. The
// try/catch wrapper is elided since the fixture surface already provides
// synchronous mocks with no error paths.
// ============================================================
function healthyMoveTooltip() {
  var tt = _getTooltip();
  if (!tt || tt.style.display === 'none') return;
  var event = CURRENT_EVENT;
  var x = (event.clientX || 0) + 14;
  var y = (event.clientY || 0) + 14;
  tt.style.left = x + 'px';
  tt.style.top  = y + 'px';
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyMoveTooltip() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyMoveTooltip();

    if (opts.dropInv1a) {
      // Drop _getTooltip + display guard → function is a no-op (tt undefined
      // would crash anyway; we skip the entire body to make the failure
      // mode explicit).
      return;
    }
    var tt = _getTooltip();
    if (!tt || tt.style.display === 'none') return;
    var event = CURRENT_EVENT;
    var x = (!opts.dropInv1b) ? ((event.clientX || 0) + 14) : (event.clientX || 0);
    var y = (!opts.dropInv1b) ? ((event.clientY || 0) + 14) : (event.clientY || 0);
    if (!opts.dropInv1c) tt.style.left = x + 'px';
    if (!opts.dropInv1d) tt.style.top  = y + 'px';
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: '_getTooltip + display guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: '+14 offset (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'style.left write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'style.top write (1d)' }
];

// ============================================================
// Fixtures — sourced from e61-fixtures.js via factory + deps
// ============================================================
var fx = require('./e61-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  makeEvent: makeEvent,
  getTooltip: getTooltip
});

var healthyWrappedMoveTooltip = function () {
  return healthyMoveTooltip();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E61 — moveTooltip() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-moveTooltip, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedMoveTooltip);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy moveTooltip) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
