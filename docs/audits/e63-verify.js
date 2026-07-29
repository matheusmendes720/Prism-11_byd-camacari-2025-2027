// e63-verify.js — hideTooltip() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4246-4253 (hideTooltip — chrome-only stub).
// The mouse-leave handler that hides the tooltip element by writing
// style.display='none' on the lazily-created/retrieved tooltip stub.
//
// Invariants (2 sub-checks):
//   1a. _getTooltip() invocation + null guard: function calls _getTooltip
//       to retrieve the cached tooltip element, and bails when null.
//   1b. style.display='none' write: writes 'none' to tt.style.display.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// The tooltip element is created lazily via _getTooltip() which calls
// document.createElement('div') + document.body.appendChild(). Both are
// mocked via the in-place elementMap pattern (mirroring E56-E62).
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.

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

function getTooltip() { return _tooltipEl; }

function resetEnv() {
  _tooltipEl = null;
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
// Mirror — hideTooltip() (HEALTHY, simplified)
//
// Faithful to L4246-4253 invariants for the 2 sub-checks above. The
// try/catch wrapper and silent error block are elided since the fixture
// surface already provides synchronous mocks with no error paths.
// ============================================================
function healthyHideTooltip() {
  var tt = _getTooltip();
  if (!tt) return;
  tt.style.display = 'none';
}

// ============================================================
// Broken mutants — 2 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyHideTooltip() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyHideTooltip();

    if (opts.dropInv1a) {
      // Drop _getTooltip + null guard → function is a complete no-op.
      return;
    }
    var tt = _getTooltip();
    if (!tt) return;
    if (!opts.dropInv1b) tt.style.display = 'none';
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: '_getTooltip + null guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'style.display=none write (1b)' }
];

// ============================================================
// Fixtures — sourced from e63-fixtures.js via factory + deps
// ============================================================
var fx = require('./e63-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getTooltip: getTooltip
});

var healthyWrappedHideTooltip = function () {
  return healthyHideTooltip();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E63 — hideTooltip() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-hideTooltip, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedHideTooltip);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy hideTooltip) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
