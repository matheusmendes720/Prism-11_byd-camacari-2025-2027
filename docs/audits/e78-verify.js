// e78-verify.js — countRedDims() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1376-1388 (countRedDims — counts
// dimData entries whose .status === STATUS.RED; returns null if
// dimData itself is not a valid object).
//
// Invariants (4 sub-checks):
//   1a. validate dimData: typeof === 'object' AND truthy.
//   1b. per-dim null guard: skip entries missing truthy value before
//       reading .status.
//   1c. STATUS.RED exact match: compare === STATUS.RED, not truthy.
//   1d. counter increment: n++ when condition fires.
//
// Sub-check 1a covers BOTH the `if (typeof … || !dimData)` gate and
// the surrounding try/catch (they are the validate safety net).
// T1's broken body therefore has NO try/catch around the iteration.
//
// Inverted mutant pattern: each fixture pre-seeds dimData. Healthy
// version returns the count of RED entries. Broken mutant drops a
// sub-check → distinct sentinel (or throws). Fixture reports issue →
// runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — dimData (closure-level)
// ============================================================
var dimData = {};

function getDimData() { return dimData; }
function setDimData(v) { dimData = v; }
function resetEnv() {
  dimData = {};
  if (typeof console !== 'undefined' && console.warn) {
    // silence: e78 doesn't depend on console.warn
  }
}

// Mirror the source STATUS constants (RED/AMBER/GREEN) used by the
// in-page compare. Only RED matters for countRedDims.
var STATUS = { RED: 'RED', AMBER: 'AMBER', GREEN: 'GREEN' };

// ============================================================
// Mirror — countRedDims() (HEALTHY, faithful to L1376-1388)
// ============================================================
function healthyCountRedDims() {
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.RED) n++;
    });
    return n;
  } catch (e) {
    return null;
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyCountRedDims();

    var n = 0;

    // 1a: validate gate drop (including the try/catch safety net).
    if (opts.dropInv1a) {
      // No validate, no try/catch. Iteration runs bare. Object.keys
      // throws on null.
      Object.keys(dimData).forEach(function (k) {
        var d = dimData[k];
        if (opts.dropInv1b) {
          // No per-dim truthy guard — reads d.status directly (throws on null).
          if (d.status === STATUS.RED) n++;
        } else {
          if (d && d.status === STATUS.RED) n++;
        }
      });
      if (opts.dropInv1d) return 0;
      return n;
    }

    // Healthy path — matches source.
    try {
      if (typeof dimData !== 'object' || !dimData) return null;
      Object.keys(dimData).forEach(function (k) {
        var d = dimData[k];
        if (opts.dropInv1b) {
          if (d.status === STATUS.RED) n++;
        } else {
          if (d && d.status === STATUS.RED) n++;
        }
      });
      if (opts.dropInv1d) return 0;
      return n;
    } catch (e) {
      return null;
    }
  };
}

// T3's broken behavior: STATUS.RED exact match replaced by truthy
// check on status. We need a separate branch because the shared
// makeBF above already toggles the per-dim guard via 1b. For 1c we
// want truthy-on-status regardless of 1b.
function makeBF_1c() {
  return function () {
    if (MIRROR_REPAIRED) return healthyCountRedDims();
    try {
      if (typeof dimData !== 'object' || !dimData) return null;
      var n = 0;
      Object.keys(dimData).forEach(function (k) {
        var d = dimData[k];
        if (d && d.status) n++;  // truthy check on status (drops exact RED match)
      });
      return n;
    } catch (e) {
      return null;
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'validate gate (1a — incl. try/catch net)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'per-dim null guard (1b)' },
  { id: 'T3', fn: makeBF_1c(),                 target: 'F3', drop: 'STATUS.RED exact match (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'counter increment (1d)' }
];

// ============================================================
// Fixtures — sourced from e78-fixtures.js
// ============================================================
var fx = require('./e78-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setDimData: setDimData, getDimData: getDimData
});

var healthyWrappedRender = function () {
  return healthyCountRedDims();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E78 — countRedDims() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-countRedDims, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy countRedDims) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
