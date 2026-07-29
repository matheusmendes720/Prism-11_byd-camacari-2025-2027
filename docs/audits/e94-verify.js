// e94-verify.js — hideTooltip() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4246-4253 (hideTooltip —
// sets tooltip display='none').
//
// Invariants (1 sub-check):
//   1a. tooltip display = 'none'.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — shared tooltip singleton
// ============================================================

var _tooltipEl = null;
var _tooltipDisplay = 'none';

function resetEnv() {
  _tooltipEl = null;
  _tooltipDisplay = 'none';
}

function getTooltipEl() {
  if (_tooltipEl && _tooltipEl._isConnected) return _tooltipEl;
  _tooltipEl = {
    _isConnected: true,
    id: 'd3-node-tooltip',
    style: {
      _display: 'none',
      get display() { return this._display; },
      set display(v) { this._display = v; _tooltipDisplay = v; },
      left: '0px',
      top: '0px'
    },
    innerHTML: ''
  };
  return _tooltipEl;
}

function getSnapshot() {
  return {
    tooltipDisplay: _tooltipDisplay
  };
}

global.document = {
  createElement: function () { return {}; },
  body: { appendChild: function () {} }
};

// ============================================================
// Healthy hideTooltip (L4246-4253)
// ============================================================
function healthyHideTooltip() {
  try {
    var tt = getTooltipEl();
    if (tt) tt.style.display = 'none';
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Broken mutant — does NOT set display='none'
// ============================================================
function brokenHideTooltip() {
  if (MIRROR_REPAIRED) return healthyHideTooltip();
  try {
    var tt = getTooltipEl();
    // T1: display assignment is simply absent — tooltip stays whatever it was.
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e94-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getSnapshot: getSnapshot
});

var MUTANTS = [
  { id: 'T1', fn: brokenHideTooltip, target: 'F0', drop: 'display=none (1a)' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E94 — hideTooltip() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Mutant detection: direct custom check ---
// Set tooltip to visible (display='block'), call broken hideTooltip,
// which will NOT change it back to 'none'. Fixture should catch this.
MUTANTS.forEach(function (mutant) {
  resetEnv();
  // Simulate tooltip was showing
  var tt = getTooltipEl();
  tt.style.display = 'block';  // Now visible
  // Call the broken function
  mutant.fn();
  // Check: display should be 'none' but broken didn't change it → stays 'block'
  var snap = getSnapshot();
  var issues = [];
  if (snap.tooltipDisplay !== 'none') {
    issues.push('T1 mutant: tooltip display should be none, got ' + snap.tooltipDisplay);
  }
  totalReports++;
  var detected = issues.length > 0;
  var pass = MIRROR_REPAIRED ? !detected : detected;
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (broken-hideTooltip, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + issues.length);
  if (!pass && detected) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyHideTooltip);
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
