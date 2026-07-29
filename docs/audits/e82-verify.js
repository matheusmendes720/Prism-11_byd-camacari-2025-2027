// e82-verify.js — statusThresholdInit() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1534-1564 (statusThresholdInit — reads
// localStorage safely, validates stored value, mutates
// STATUS_THRESHOLDS.active via direct mutator, ALWAYS reclassifies
// dimData, repaints canvas legend).
//
// Invariants (4 sub-checks):
//   1a. try/catch net: wraps the whole body (and inner localStorage read).
//   1b. stored value validation: only 'legacy' | 'authoritative' allowed.
//   1c. STATUS_THRESHOLDS.active = stored (direct mutator, no repaint cascade).
//   1d. dimData reclassification: ALWAYS runs regardless of stored value.
//
// Inverted mutant pattern: each fixture pre-seeds mockLocalStorage,
// STATUS_THRESHOLDS, dimData, and zeroed repaint counter. Healthy
// version: read safely → validate → mutate active → reclassify →
// repaint. Broken mutant drops a sub-check → distinct observable state.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. Plus F0 has
// 4 sub-cases (treated as one report) = 9 reports total.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — stored value, mockLocalStorage,
// STATUS_THRESHOLDS, dimData, repaint counter.
// ============================================================
var STORED = null;
var mockLocalStorage = {
  _store: {},
  setItem: function (k, v) { this._store[k] = v; },
  getItem: function (k) { return this._store[k]; }
};
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
var repaintCounts = { canvas: 0 };

function getStored() { return STORED; }
function setStored(v) {
  STORED = v;
  mockLocalStorage._store = {};
  if (v != null) mockLocalStorage._store['d3:status_threshold'] = v;
}
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
  STORED = null;
  mockLocalStorage = { _store: {}, setItem: function (k, v) { this._store[k] = v; }, getItem: function (k) { return this._store[k]; } };
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
  repaintCounts = { canvas: 0 };
  renderCanvasLegendOverride = null;
}

function mockRenderCanvasLegend() { repaintCounts.canvas++; }
var renderCanvasLegendOverride = null;
function setRenderCanvasLegendOverride(fn) { renderCanvasLegendOverride = fn; }

// Use override if set, else fall back to mockRenderCanvasLegend.
function effectiveRenderCanvasLegend() {
  return renderCanvasLegendOverride || mockRenderCanvasLegend;
}

// ============================================================
// Mirror — statusThresholdInit() (HEALTHY, faithful to L1534-1564)
// ============================================================
function healthyStatusThresholdInit() {
  try {
    var stored = null;
    try {
      if (typeof mockLocalStorage !== 'undefined' && mockLocalStorage) {
        stored = mockLocalStorage.getItem('d3:status_threshold');
      }
    } catch (e) { /* private mode etc — fall back to default */ }
    if (stored === 'legacy' || stored === 'authoritative') {
      // Use the direct mutator to avoid the repaint cascade in
      // statusThresholdToggle() — we are about to repaint from init().
      STATUS_THRESHOLDS.active = stored;
    }
    // Always reclassify dimData on boot so the data matches the active
    // range regardless of how it was loaded.
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
    if (typeof renderCanvasLegendOverride === 'function') {
      renderCanvasLegendOverride();
    } else if (typeof mockRenderCanvasLegend === 'function') {
      mockRenderCanvasLegend();
    }
  } catch (e) {
    // console.warn omitted
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyStatusThresholdInit();

    function body() {
      var stored = null;
      try {
        if (typeof mockLocalStorage !== 'undefined' && mockLocalStorage) {
          stored = mockLocalStorage.getItem('d3:status_threshold');
        }
      } catch (e) { /* swallow */ }

      if (opts.dropInv1b) {
        // No validation — accept any non-null stored value.
        if (stored != null && !opts.dropInv1c) {
          STATUS_THRESHOLDS.active = stored;
        }
      } else {
        if (stored === 'legacy' || stored === 'authoritative') {
          if (!opts.dropInv1c) {
            STATUS_THRESHOLDS.active = stored;
          }
        }
      }

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

      if (typeof renderCanvasLegendOverride === 'function') {
        renderCanvasLegendOverride();
      } else if (typeof mockRenderCanvasLegend === 'function') {
        mockRenderCanvasLegend();
      }
    }

    if (opts.dropInv1a) {
      body();  // No outer try/catch net — throws propagate.
    } else {
      try { body(); } catch (e) { /* swallow */ }
    }
  };
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyStatusThresholdInit();

    function body() {
      var stored = null;
      try {
        if (typeof mockLocalStorage !== 'undefined' && mockLocalStorage) {
          stored = mockLocalStorage.getItem('d3:status_threshold');
        }
      } catch (e) { /* swallow */ }

      if (opts.dropInv1b) {
        // No validation — accept any non-null stored value.
        if (stored != null && !opts.dropInv1c) {
          STATUS_THRESHOLDS.active = stored;
        }
      } else {
        if (stored === 'legacy' || stored === 'authoritative') {
          if (!opts.dropInv1c) {
            STATUS_THRESHOLDS.active = stored;
          }
        }
      }

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

      if (typeof renderCanvasLegendOverride === 'function') {
        renderCanvasLegendOverride();
      } else if (typeof mockRenderCanvasLegend === 'function') {
        mockRenderCanvasLegend();
      }
    }

    if (opts.dropInv1a) {
      body();  // No outer try/catch net — throws propagate.
    } else {
      try { body(); } catch (e) { /* swallow */ }
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'try/catch net (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'stored value validation (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'active mutation (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'dimData reclassification (1d)' }
];

// ============================================================
// Fixtures — sourced from e82-fixtures.js
// ============================================================
var fx = require('./e82-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setStored: setStored, getStored: getStored,
  setStatusThresholds: setStatusThresholds, getStatusThresholds: getStatusThresholds,
  setDimData: setDimData, getDimData: getDimData,
  getRepaintCounts: getRepaintCounts,
  setRenderCanvasLegend: setRenderCanvasLegendOverride
});

var healthyWrappedRender = function () {
  return healthyStatusThresholdInit();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E82 — statusThresholdInit() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-statusThresholdInit, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
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
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy statusThresholdInit) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);