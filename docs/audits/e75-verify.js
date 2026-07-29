// e75-verify.js — zoom trio (zoomIn/zoomOut/zoomFit) chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3881-3889 (applyZoom + zoomIn/zoomOut/zoomFit).
//
// Invariants (3 sub-checks):
//   1a. zoomIn:  zoomScale = Math.min(zoomScale * 1.25, 3); applyZoom().
//   1b. zoomOut: zoomScale = Math.max(zoomScale / 1.25, 0.3); applyZoom().
//   1c. zoomFit: zoomScale = 1; zoomTx = 0; zoomTy = 0; applyZoom().
//
// Inverted mutant pattern: each fixture pre-seeds zoom state. Healthy
// trio mutates the state correctly. Broken mutant drops a mutation →
// state stays at sentinel → fixture reports issue → runner says PASS
// (BASELINE) or FAIL (REPAIRED).
//
// 3 mutants × 1 target fixture + 3 controls (fixtures × healthy) = 6 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — zoom state + mode flag + applyZoom stub
// ============================================================
var zoomScale = 1, zoomTx = 0, zoomTy = 0;
var mode = '';

function getScale() { return zoomScale; }
function setScale(v) { zoomScale = v; }
function getTx() { return zoomTx; }
function setTx(v) { zoomTx = v; }
function getTy() { return zoomTy; }
function setTy(v) { zoomTy = v; }
function getMode() { return mode; }
function setMode(v) { mode = v; }

function resetEnv() {
  zoomScale = 1; zoomTx = 0; zoomTy = 0; mode = '';
}

// applyZoom stub — emits the transform string the source would write.
function applyZoom() {
  return 'translate(' + zoomTx + ',' + zoomTy + ') scale(' + zoomScale + ')';
}

// ============================================================
// Mirror — zoom trio (HEALTHY, faithful to L3881-3889)
// ============================================================
function healthyRender() {
  if (mode === 'zoomIn') {
    zoomScale = Math.min(zoomScale * 1.25, 3);
  } else if (mode === 'zoomOut') {
    zoomScale = Math.max(zoomScale / 1.25, 0.3);
  } else if (mode === 'zoomFit') {
    zoomScale = 1; zoomTx = 0; zoomTy = 0;
  }
  applyZoom();
}

// ============================================================
// Broken mutants — 3 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRender();

    if (mode === 'zoomIn') {
      if (!opts.dropInv1a) {
        zoomScale = Math.min(zoomScale * 1.25, 3);
      }
      // else: dropInv1a — scale unchanged
    } else if (mode === 'zoomOut') {
      if (!opts.dropInv1b) {
        zoomScale = Math.max(zoomScale / 1.25, 0.3);
      }
      // else: dropInv1b — scale unchanged
    } else if (mode === 'zoomFit') {
      if (!opts.dropInv1c) {
        zoomScale = 1; zoomTx = 0; zoomTy = 0;
      }
      // else: dropInv1c — state unchanged
    }
    applyZoom();
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'zoomIn × 1.25 (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'zoomOut / 1.25 (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'zoomFit reset triple (1c)' }
];

// ============================================================
// Fixtures — sourced from e75-fixtures.js
// ============================================================
var fx = require('./e75-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setScale: setScale, getScale: getScale,
  setTx: setTx,         getTx: getTx,
  setTy: setTy,         getTy: getTy,
  setMode: setMode,     getMode: getMode
});

var healthyWrappedRender = function () {
  return healthyRender();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E75 — zoom trio (zoomIn/zoomOut/zoomFit) chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-zoom, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy zoom) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);