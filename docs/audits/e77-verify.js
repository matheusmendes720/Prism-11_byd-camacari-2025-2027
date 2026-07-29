// e77-verify.js — computeCompositeScore() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1350-1371 (computeCompositeScore —
// weighted average across dimData entries; returns null if no
// qualifying dimension).
//
// Invariants (4 sub-checks):
//   1a. validate dimData: typeof === 'object' AND truthy.
//   1b. score/weight null guard: skip entries missing numeric
//       score or weight.
//   1c. den === 0 guard: return null when no qualifying entries.
//   1d. weighted return: num/den.
//
// Sub-check 1a covers BOTH the `if (typeof … || !dimData)` gate and
// the surrounding try/catch (they are the validate safety net —
// dropping 1a exposes the inner iteration to null/undefined). T1's
// broken body therefore has NO try/catch around the iteration.
//
// Inverted mutant pattern: each fixture pre-seeds dimData. Healthy
// version computes weighted average correctly. Broken mutant drops
// a sub-check → distinct sentinel (or throws). Fixture reports
// issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 9 reports.

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
    // silence: e77 doesn't depend on console.warn
  }
}

// ============================================================
// Mirror — computeCompositeScore() (HEALTHY, faithful to L1350-1371)
// ============================================================
function healthyComputeCompositeScore() {
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s * w;
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    return null;
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyComputeCompositeScore();

    var num = 0, den = 0;

    // 1a: validate gate drop (including the try/catch safety net).
    if (opts.dropInv1a) {
      // No validate, no try/catch. Iteration runs bare. Object.keys
      // throws on null.
      Object.keys(dimData).forEach(function (k) {
        var d = dimData[k];
        if (!d) return;
        var s = (typeof d.score === 'number') ? d.score : null;
        var w = (typeof d.weight === 'number') ? d.weight : null;
        if (!opts.dropInv1b && (s === null || w === null)) return;
        num += s * w;
        den += w;
      });
      if (!opts.dropInv1c && den === 0) return null;
      return opts.dropInv1d ? num : num / den;
    }

    // Healthy path — matches source.
    try {
      if (typeof dimData !== 'object' || !dimData) return null;
      Object.keys(dimData).forEach(function (k) {
        var d = dimData[k];
        if (!d) return;
        var s = (typeof d.score === 'number') ? d.score : null;
        var w = (typeof d.weight === 'number') ? d.weight : null;
        if (!opts.dropInv1b && (s === null || w === null)) return;
        num += s * w;
        den += w;
      });
      if (!opts.dropInv1c && den === 0) return null;
      return opts.dropInv1d ? num : num / den;
    } catch (e) {
      return null;
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'validate gate (1a — incl. try/catch net)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'score/weight null guard (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'den=0 guard (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'weighted return (1d)' }
];

// ============================================================
// Fixtures — sourced from e77-fixtures.js
// ============================================================
var fx = require('./e77-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setDimData: setDimData, getDimData: getDimData
});

var healthyWrappedRender = function () {
  return healthyComputeCompositeScore();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E77 — computeCompositeScore() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-computeCompositeScore, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy computeCompositeScore) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);