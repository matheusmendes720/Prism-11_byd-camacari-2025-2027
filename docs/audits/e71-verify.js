// e71-verify.js — statusColor(s) chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3139 (statusColor — maps a status
// string to its hex color). Used by every chrome element that paints
// a status pill.
//
// Invariants (3 sub-checks):
//   1a. STATUS.GREEN branch: returns COLORS.green.
//   1b. STATUS.AMBER branch: returns COLORS.amber.
//   1c. RED fallback:        returns COLORS.red.
//
// Inverted mutant pattern: each fixture pre-seeds `s` with a status
// string. Healthy code returns the matching color. Broken mutant
// drops a branch → returns the wrong color → fixture reports issue
// → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 3 mutants × 1 target fixture + 3 controls (fixtures × healthy) = 6 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — status enum + color palette
// ============================================================
var STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red' };
var COLORS = { green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

var s = '';
function getS() { return s; }
function setS(v) { s = v; }
function getColors() { return COLORS; }

function resetEnv() { s = ''; }

// ============================================================
// Mirror — statusColor() (HEALTHY, simplified)
//
// Faithful to L3139 invariants for the 3 sub-checks above.
// ============================================================
function healthyStatusColor() {
  return s === STATUS.GREEN ? COLORS.green
       : s === STATUS.AMBER ? COLORS.amber
       : COLORS.red;
}

// ============================================================
// Broken mutants — 3 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyStatusColor() so the test
// runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyStatusColor();

    if (opts.dropInv1a) {
      // GREEN branch dropped: skip the GREEN check entirely.
      if (false) return COLORS.green;
    } else {
      if (s === STATUS.GREEN) return COLORS.green;
    }
    if (opts.dropInv1b) {
      // AMBER branch dropped: skip the AMBER check entirely.
      if (false) return COLORS.amber;
    } else {
      if (s === STATUS.AMBER) return COLORS.amber;
    }
    if (opts.dropInv1c) {
      // RED fallback dropped: return undefined instead of COLORS.red.
      return undefined;
    } else {
      return COLORS.red;
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'GREEN branch (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'AMBER branch (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'RED fallback (1c)' }
];

// ============================================================
// Fixtures — sourced from e71-fixtures.js via factory + deps
// ============================================================
var fx = require('./e71-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setS: setS,
  getS: getS,
  getColors: getColors
});

var healthyWrappedStatusColor = function () {
  return healthyStatusColor();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E71 — statusColor() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-statusColor, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedStatusColor);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy statusColor) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);