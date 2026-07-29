// e73-verify.js — statusClass(s) chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3147 (statusClass — maps a status
// string to its CSS class name).
//
// Invariants (3 sub-checks):
//   1a. STATUS.GREEN branch: returns 'green'.
//   1b. STATUS.AMBER branch: returns 'amber'.
//   1c. RED fallback:        returns 'red'.
//
// Inverted mutant pattern: each fixture pre-seeds `s` with a status
// string. Healthy code returns the matching class name. Broken mutant
// drops a branch → returns the wrong class → fixture reports issue
// → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 3 mutants × 1 target fixture + 3 controls (fixtures × healthy) = 6 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — status enum (STATUS.GREEN/AMBER/RED are strings)
// ============================================================
var STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red' };

var s = '';
function getS() { return s; }
function setS(v) { s = v; }

function resetEnv() { s = ''; }

// ============================================================
// Mirror — statusClass() (HEALTHY, faithful to L3147)
// ============================================================
function healthyStatusClass() {
  return s === STATUS.GREEN ? 'green'
       : s === STATUS.AMBER ? 'amber'
       : 'red';
}

// ============================================================
// Broken mutants — 3 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyStatusClass();

    if (opts.dropInv1a) {
      if (false) return 'green';
    } else {
      if (s === STATUS.GREEN) return 'green';
    }
    if (opts.dropInv1b) {
      if (false) return 'amber';
    } else {
      if (s === STATUS.AMBER) return 'amber';
    }
    if (opts.dropInv1c) {
      return undefined;
    } else {
      return 'red';
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'GREEN branch (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'AMBER branch (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'RED fallback (1c)' }
];

// ============================================================
// Fixtures — sourced from e73-fixtures.js
// ============================================================
var fx = require('./e73-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setS: setS,
  getS: getS
});

var healthyWrappedStatusClass = function () {
  return healthyStatusClass();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E73 — statusClass() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-statusClass, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedStatusClass);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy statusClass) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);