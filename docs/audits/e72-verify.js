// e72-verify.js — hexToRgba() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3139-3145 (hexToRgba — converts
// '#RRGGBB' hex string + alpha to 'rgba(R,G,B,A)' string).
//
// Invariants (5 sub-checks):
//   1a. guard: !hex || hex[0] !== '#' → 'rgba(255,255,255,A)' fallback.
//   1b. r = parseInt(hex.slice(1,3), 16) — first byte.
//   1c. g = parseInt(hex.slice(3,5), 16) — second byte.
//   1d. b = parseInt(hex.slice(5,7), 16) — third byte.
//   1e. alpha default: alpha||1 → 1 when alpha=undefined.
//
// Inverted mutant pattern: each fixture pre-seeds `hex`/`alpha`
// with a known input. Healthy code parses and returns the expected
// rgba string. Broken mutant drops an op → returns malformed/NaN
// output → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// 5 mutants × 1 target fixture + 5 controls (fixtures × healthy) = 10 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — hex string + alpha float
// ============================================================
var hex = '';
var alpha = 1;
function getHex() { return hex; }
function setHex(v) { hex = v; }
function getAlpha() { return alpha; }
function setAlpha(v) { alpha = v; }

function resetEnv() { hex = ''; alpha = 1; }

// ============================================================
// Mirror — hexToRgba() (HEALTHY, faithful to L3139-3145)
//
// ============================================================
function healthyHexToRgba() {
  if (!hex || hex[0] !== '#') return 'rgba(255,255,255,' + (alpha||1) + ')';
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha||1) + ')';
}

// ============================================================
// Broken mutants — 5 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyHexToRgba() so the test
// runs against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyHexToRgba();

    if (opts.dropInv1a) {
      // Guard dropped: skip the !hex/!prefix check.
      if (false) return 'rgba(255,255,255,' + (alpha||1) + ')';
    } else {
      if (!hex || hex[0] !== '#') return 'rgba(255,255,255,' + (alpha||1) + ')';
    }
    if (opts.dropInv1b) {
      // r slice dropped: r = NaN.
      var r;
    } else {
      var r = parseInt(hex.slice(1,3), 16);
    }
    if (opts.dropInv1c) {
      // g slice dropped: g = NaN.
      var g;
    } else {
      var g = parseInt(hex.slice(3,5), 16);
    }
    if (opts.dropInv1d) {
      // b slice dropped: b = NaN.
      var b;
    } else {
      var b = parseInt(hex.slice(5,7), 16);
    }
    var aVal;
    if (opts.dropInv1e) {
      // alpha default dropped: alpha used raw (undefined → 'undefined').
      aVal = alpha;
    } else {
      aVal = (alpha||1);
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + aVal + ')';
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'r slice (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'g slice (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'b slice (1d)' },
  { id: 'T5', fn: makeBF({ dropInv1e: true }), target: 'F5', drop: 'alpha default (1e)' }
];

// ============================================================
// Fixtures — sourced from e72-fixtures.js via factory + deps
// ============================================================
var fx = require('./e72-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setHex: setHex,
  getHex: getHex,
  setAlpha: setAlpha,
  getAlpha: getAlpha
});

var healthyWrappedHexToRgba = function () {
  return healthyHexToRgba();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E72 — hexToRgba() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-hexToRgba, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedHexToRgba);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy hexToRgba) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);