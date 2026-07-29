// e80-verify.js — renderCanvasLegend() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1460-1476 (renderCanvasLegend — reads
// STATUS_THRESHOLDS[STATUS_THRESHOLDS.active] and writes 4-segment
// legend into #graph-legend.innerHTML).
//
// Invariants (4 sub-checks):
//   1a. try/catch net: wraps the whole body.
//   1b. active threshold: read STATUS_THRESHOLDS[active], NOT a
//       hardcoded constant.
//   1c. green segment: 'Verde: ≥ ' + g.
//   1d. amber range upper bound: (g - 1) (NOT a hardcoded constant).
//
// Inverted mutant pattern: each fixture pre-seeds STATUS_THRESHOLDS
// and a mock DOM. Healthy version writes the right innerHTML. Broken
// mutant drops a sub-check → distinct innerHTML or throws. Fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — STATUS_THRESHOLDS, mockDocument
// ============================================================
var STATUS_THRESHOLDS = {
  legacy: { green: 70, amber: 50 },
  authoritative: { green: 80, amber: 65 },
  active: 'legacy'
};
var throwOnGetElementById = false;
var mockEls = {};

function getStatusThresholds() { return STATUS_THRESHOLDS; }
function setStatusThresholds(v) {
  STATUS_THRESHOLDS = {
    legacy: v.legacy,
    authoritative: v.authoritative,
    active: v.active
  };
}
function getThrowOnGetElementById() { return throwOnGetElementById; }
function setThrowOnGetElementById(b) { throwOnGetElementById = !!b; }
function getMockEl(id) { return mockEls[id]; }

function resetEnv() {
  STATUS_THRESHOLDS = {
    legacy: { green: 70, amber: 50 },
    authoritative: { green: 80, amber: 65 },
    active: 'legacy'
  };
  throwOnGetElementById = false;
  mockEls = {
    'graph-legend': { id: 'graph-legend', innerHTML: '' }
  };
}

var mockDocument = {
  getElementById: function (id) {
    if (throwOnGetElementById) throw new Error('mock DOM failure');
    return mockEls[id];
  }
};

// ============================================================
// Mirror — renderCanvasLegend() (HEALTHY, faithful to L1460-1476)
// ============================================================
function healthyRenderCanvasLegend() {
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) {
    // swallow (matches source console.warn)
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();

    try {
      var root = mockDocument.getElementById('graph-legend');
      if (!root) return;
      var t, g, a;
      if (opts.dropInv1b) {
        // Hardcoded legacy 70/50, ignoring STATUS_THRESHOLDS.active.
        t = STATUS_THRESHOLDS.legacy;
        g = 70;
        a = 50;
      } else {
        t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
        g = t.green;
        a = t.amber;
      }
      var greenSeg = opts.dropInv1c
        ? ''
        : '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>';
      var amberUpper = opts.dropInv1d ? 99 : (g - 1);
      var html =
        greenSeg +
        '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + amberUpper + '</div>' +
        '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
        '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
      root.innerHTML = html;
    } catch (e) {
      if (opts.dropInv1a) throw e;  // T1: try/catch net drop → rethrow
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'try/catch net (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'active threshold read (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'green segment (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'amber upper bound (1d)' }
];

// ============================================================
// Fixtures — sourced from e80-fixtures.js
// ============================================================
var fx = require('./e80-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setStatusThresholds: setStatusThresholds, getStatusThresholds: getStatusThresholds,
  setThrowOnGetElementById: setThrowOnGetElementById,
  getMockEl: getMockEl
});

var healthyWrappedRender = function () {
  return healthyRenderCanvasLegend();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E80 — renderCanvasLegend() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderCanvasLegend, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderCanvasLegend) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
