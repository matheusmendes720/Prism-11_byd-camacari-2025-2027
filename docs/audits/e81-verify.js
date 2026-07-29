// e81-verify.js — statusThresholdToggle(value) chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1482-1528 (statusThresholdToggle — validates
// input, idempotency guard, mutates STATUS_THRESHOLDS.active, persists to
// localStorage, reclassifies dimData entries, repaints 4 dependents).
//
// Invariants (4 sub-checks):
//   1a. validate input: only 'legacy' | 'authoritative' allowed.
//   1b. idempotent guard: skip when STATUS_THRESHOLDS.active === value.
//   1c. STATUS_THRESHOLDS.active mutation: flips to new value.
//   1d. dimData reclassification: writes STATUS_THRESHOLDS.status(score)
//       into d.status for every entry with a numeric score.
//
// Inverted mutant pattern: each fixture pre-seeds STATUS_THRESHOLDS,
// dimData, mockLocalStorage, and zeroed repaint counters. Healthy version
// validates input → idempotency guard → mutate active → persist →
// reclassify dimData → repaint 4 dependents. Broken mutant drops a
// sub-check → distinct observable state.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. We add 1
// additional control case inside F0 (4 sub-cases) so totals = 9 reports:
//   BASELINE:  4/4 mutants detected + 5/5 healthy controls = 9 PASS.
//   REPAIRED:  0/4 mutants detected + 5/5 healthy controls = 9 PASS.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — STATUS_THRESHOLDS, dimData, mockLocalStorage,
// repaint counters.
// ============================================================
var STATUS_THRESHOLDS = {
  legacy: { green: 70, amber: 50 },
  authoritative: { green: 80, amber: 65 },
  active: 'legacy',
  status: function (s) {
    if (s >= 80) return 'GREEN';
    if (s >= 65) return 'AMBER';
    return 'RED';
  }
};
var dimData = {};
var mockLocalStorage = {
  _store: {},
  setItem: function (k, v) { this._store[k] = v; },
  getItem: function (k) { return this._store[k]; }
};
var repaintCounts = { canvas: 0, glossary: 0, bottom: 0, build: 0 };

function getStatusThresholds() { return STATUS_THRESHOLDS; }
function setStatusThresholds(v) {
  STATUS_THRESHOLDS = {
    legacy: v.legacy,
    authoritative: v.authoritative,
    active: v.active,
    status: v.status
  };
}
function getDimData() { return dimData; }
function setDimData(v) { dimData = v; }
function getRepaintCounts() { return repaintCounts; }

function resetEnv() {
  STATUS_THRESHOLDS = {
    legacy: { green: 70, amber: 50 },
    authoritative: { green: 80, amber: 65 },
    active: 'legacy',
    status: function (s) {
      if (s >= 80) return 'GREEN';
      if (s >= 65) return 'AMBER';
      return 'RED';
    }
  };
  dimData = {};
  mockLocalStorage = { _store: {}, setItem: function (k, v) { this._store[k] = v; }, getItem: function (k) { return this._store[k]; } };
  repaintCounts = { canvas: 0, glossary: 0, bottom: 0, build: 0 };
}

function mockRenderCanvasLegend() { repaintCounts.canvas++; }
function mockRenderGlossary() { repaintCounts.glossary++; }
function mockRenderBottomBar() { repaintCounts.bottom++; }
function mockBuild() { repaintCounts.build++; }

// ============================================================
// Mirror — statusThresholdToggle(value) (HEALTHY, faithful to L1482-1528)
// ============================================================
function healthyStatusThresholdToggle(value) {
  try {
    if (value !== 'legacy' && value !== 'authoritative') {
      // console.warn omitted
      return;
    }
    if (STATUS_THRESHOLDS.active === value) return; // idempotent
    STATUS_THRESHOLDS.active = value;

    // Persist to localStorage (best-effort)
    try {
      if (typeof mockLocalStorage !== 'undefined' && mockLocalStorage) {
        mockLocalStorage.setItem('d3:status_threshold', value);
      }
    } catch (e) { /* swallow */ }

    // Re-classify S1..S11
    try {
      if (typeof dimData === 'object' && dimData) {
        Object.keys(dimData).forEach(function (k) {
          var d = dimData[k];
          if (d && typeof d.score === 'number') {
            var s = STATUS_THRESHOLDS.status(d.score);
            if (s) d.status = s;
          }
        });
      }
    } catch (e) { /* swallow */ }

    // Repaint order matters: legend → glossary → bottom-bar → build
    if (typeof mockRenderCanvasLegend === 'function') mockRenderCanvasLegend();
    if (typeof mockRenderGlossary === 'function') mockRenderGlossary();
    if (typeof mockRenderBottomBar === 'function') mockRenderBottomBar();
    if (typeof mockBuild === 'function') mockBuild();
  } catch (e) {
    // console.warn omitted
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function (value) {
    if (MIRROR_REPAIRED) return healthyStatusThresholdToggle(value);

    try {
      // 1a. validate input — drop: skip the legacy/authoritative gate.
      if (!opts.dropInv1a) {
        if (value !== 'legacy' && value !== 'authoritative') return;
      }

      // 1b. idempotent guard — drop: skip the active === value early return.
      if (!opts.dropInv1b) {
        if (STATUS_THRESHOLDS.active === value) return;
      }

      // 1c. active mutation — drop: skip STATUS_THRESHOLDS.active = value.
      if (!opts.dropInv1c) {
        STATUS_THRESHOLDS.active = value;
      }

      // localStorage persist (kept for both healthy and broken — not under test).
      try {
        if (typeof mockLocalStorage !== 'undefined' && mockLocalStorage) {
          mockLocalStorage.setItem('d3:status_threshold', value);
        }
      } catch (e) { /* swallow */ }

      // 1d. dimData reclassification — drop: skip the forEach block.
      if (!opts.dropInv1d) {
        try {
          if (typeof dimData === 'object' && dimData) {
            Object.keys(dimData).forEach(function (k) {
              var d = dimData[k];
              if (d && typeof d.score === 'number') {
                var s = STATUS_THRESHOLDS.status(d.score);
                if (s) d.status = s;
              }
            });
          }
        } catch (e) { /* swallow */ }
      }

      // Repaint order matters: legend → glossary → bottom-bar → build
      if (typeof mockRenderCanvasLegend === 'function') mockRenderCanvasLegend();
      if (typeof mockRenderGlossary === 'function') mockRenderGlossary();
      if (typeof mockRenderBottomBar === 'function') mockRenderBottomBar();
      if (typeof mockBuild === 'function') mockBuild();
    } catch (e) {
      // 1a try/catch net is the outer wrapper itself — the only drop we
      // would test by forcing a throw, but for statusThresholdToggle the
      // try/catch net IS the outer block; a mutant that drops it would
      // rethrow caught exceptions. We don't exercise that here; the 4
      // covered invariants are validated by F1-F4 below.
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'validate input (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'idempotent guard (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'active mutation (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'dimData reclassification (1d)' }
];

// ============================================================
// Fixtures — sourced from e81-fixtures.js
// ============================================================
var fx = require('./e81-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setStatusThresholds: setStatusThresholds, getStatusThresholds: getStatusThresholds,
  setDimData: setDimData, getDimData: getDimData,
  getRepaintCounts: getRepaintCounts
});

var healthyWrappedRender = function (v) {
  return healthyStatusThresholdToggle(v);
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E81 — statusThresholdToggle(value) chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-statusThresholdToggle, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy statusThresholdToggle) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);