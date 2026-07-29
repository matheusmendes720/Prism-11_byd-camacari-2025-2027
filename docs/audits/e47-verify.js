// e47_verify.js — validateDataLayer() chrome hook invariant (subset 2)
// Mirrors D3-PITCH-GRAPH.html L633-688 (validateDataLayer — E8 chrome, invariants 3, 5, 6).
//
// validateDataLayer() has a multi-invariant contract returning {ok, issues}.
// E46 covered invariants 1, 2, 7, 8 (the simplest data checks).
// E47 covers invariants 3, 5, 6 (ID uniqueness + DOM button sync):
//
//   3. SVG IDs are unique across 7 source dicts (dimData, dataNodes,
//      decisionTrees, actions, gates, personas, couplings, tours).
//      duplicate detection via `seen` map; failures push to `dup[]`.
//   5. document.querySelectorAll('.layer-btn[data-layer]').length === LAYER_IDS.length
//   6. document.querySelectorAll('.view-btn[data-view]').length === VIEW_IDS.length
//
// Per-function grouping: each mutant targets ONE contract surface; each fixture
// probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 8 controls = 15 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var SVG_ID_GENERATOR = {
  data: function (k) { return 'D-' + k; },
  decision: function (k) { return 'DC-' + k; },
  action: function (i) { return 'A-' + i; },
  frameworkGate: function (i) { return 'FW-G' + i; },
  frameworkPersona: function (i) { return 'FW-P' + i; },
  coupling: function (i) { return 'CPL-' + i; }
};

var dimData = {};
var dataNodes = {};
var decisionTrees = {};
var actions = {};
var gates = {};
var personas = {};
var couplings = [];
var tours = [];

var mockDocument = {
  _layerBtns: 0,
  _viewBtns: 0,
  querySelectorAll: function (sel) {
    if (sel === '.layer-btn[data-layer]') return { length: this._layerBtns, _sel: sel };
    if (sel === '.view-btn[data-view]')   return { length: this._viewBtns,  _sel: sel };
    return { length: 0, _sel: sel };
  },
  reset: function () { this._layerBtns = 0; this._viewBtns = 0; }
};

var LAYER_IDS = ['L1', 'L2', 'L3', 'L4', 'L5'];
var VIEW_IDS  = ['V1', 'V2', 'V3'];

function resetEnv() {
  dimData = {}; dataNodes = {}; decisionTrees = {}; actions = {};
  gates = {}; personas = {}; couplings = []; tours = [];
  mockDocument.reset();
  mockDocument._layerBtns = LAYER_IDS.length;
  mockDocument._viewBtns  = VIEW_IDS.length;
}

// ============================================================
// Mirror — validateDataLayer() L633-688 (subset: invariants 3, 5, 6) (HEALTHY)
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 3. ID uniqueness across the 7 source dictionaries
  try {
    var seen = Object.create(null);
    var dup = [];
    function scan(dict, prefixKey) {
      if (!dict || typeof dict !== 'object') return;
      Object.keys(dict).forEach(function (k) {
        var id;
        try {
          id = (typeof SVG_ID_GENERATOR[prefixKey] === 'function')
            ? SVG_ID_GENERATOR[prefixKey](k)
            : k;
        } catch (e) { return; }
        if (seen[id]) dup.push(id); else seen[id] = true;
      });
    }
    scan(dimData,       'data');
    scan(dataNodes,     'data');
    scan(decisionTrees, 'decision');
    scan(actions,       'action');
    scan(gates,         'frameworkGate');
    scan(personas,      'frameworkPersona');
    if (Array.isArray(couplings)) couplings.forEach(function (_, i) {
      var id = SVG_ID_GENERATOR.coupling(i);
      if (seen[id]) dup.push(id); else seen[id] = true;
    });
    if (Array.isArray(tours)) tours.forEach(function (_, i) {
      var id = 'tour-' + i;
      if (seen[id]) dup.push(id); else seen[id] = true;
    });
    if (dup.length) fail('Duplicate SVG IDs across dicts: ' + dup.join(', '));
  } catch (e) { fail('ID-uniqueness scan threw: ' + e.message); }

  // 5 & 6. DOM layer/view button sync
  try {
    var layerBtns = mockDocument.querySelectorAll('.layer-btn[data-layer]');
    if (layerBtns.length !== LAYER_IDS.length) {
      fail('layer-btn count (' + layerBtns.length + ') != LAYER_IDS.length (' + LAYER_IDS.length + ')');
    }
    var viewBtns = mockDocument.querySelectorAll('.view-btn[data-view]');
    if (viewBtns.length !== VIEW_IDS.length) {
      fail('view-btn count (' + viewBtns.length + ') != VIEW_IDS.length (' + VIEW_IDS.length + ')');
    }
  } catch (e) { fail('DOM layer/view sync threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — factory pattern.
// Each broken body is built from flags { dropScan, dropFailOnDup, dropCouplings,
// dropTours, dropLayerCheck, dropViewCheck, invertComparison }.
// COMPONENT drops entirely become missing blocks; COMPARISON drops invert !== → ===.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyValidateDataLayer();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    // 3. ID uniqueness scan
    if (!opts.dropScan) {
      try {
        var seen = Object.create(null);
        var dup = [];
        function scan(dict, prefixKey) {
          if (!dict || typeof dict !== 'object') return;
          Object.keys(dict).forEach(function (k) {
            var id;
            try {
              id = (typeof SVG_ID_GENERATOR[prefixKey] === 'function')
                ? SVG_ID_GENERATOR[prefixKey](k)
                : k;
            } catch (e) { return; }
            if (seen[id]) dup.push(id); else seen[id] = true;
          });
        }
        scan(dimData,       'data');
        scan(dataNodes,     'data');
        scan(decisionTrees, 'decision');
        scan(actions,       'action');
        scan(gates,         'frameworkGate');
        scan(personas,      'frameworkPersona');
        if (!opts.dropCouplings && Array.isArray(couplings)) couplings.forEach(function (_, i) {
          var id = SVG_ID_GENERATOR.coupling(i);
          if (seen[id]) dup.push(id); else seen[id] = true;
        });
        if (!opts.dropTours && Array.isArray(tours)) tours.forEach(function (_, i) {
          var id = 'tour-' + i;
          if (seen[id]) dup.push(id); else seen[id] = true;
        });
        if (!opts.dropFailOnDup && dup.length) fail('Duplicate SVG IDs across dicts: ' + dup.join(', '));
      } catch (e) { fail('ID-uniqueness scan threw: ' + e.message); }
    }

    // 5 & 6. DOM layer/view sync
    try {
      var layerBtns = mockDocument.querySelectorAll('.layer-btn[data-layer]');
      if (!opts.dropLayerCheck) {
        if (opts.invertComparison) {
          if (layerBtns.length === LAYER_IDS.length) {
            fail('layer-btn count (' + layerBtns.length + ') == LAYER_IDS.length (' + LAYER_IDS.length + ') [INVERTED]');
          }
        } else if (layerBtns.length !== LAYER_IDS.length) {
          fail('layer-btn count (' + layerBtns.length + ') != LAYER_IDS.length (' + LAYER_IDS.length + ')');
        }
      }
      var viewBtns = mockDocument.querySelectorAll('.view-btn[data-view]');
      if (!opts.dropViewCheck) {
        if (opts.invertComparison) {
          if (viewBtns.length === VIEW_IDS.length) {
            fail('view-btn count (' + viewBtns.length + ') == VIEW_IDS.length (' + VIEW_IDS.length + ') [INVERTED]');
          }
        } else if (viewBtns.length !== VIEW_IDS.length) {
          fail('view-btn count (' + viewBtns.length + ') != VIEW_IDS.length (' + VIEW_IDS.length + ')');
        }
      }
    } catch (e) { fail('DOM layer/view sync threw: ' + e.message); }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropScan: true }),       target: 'F1b', drop: 'ID uniqueness scan entirely' },
  { id: 'T2', fn: makeBF({ dropFailOnDup: true }),  target: 'F2',  drop: 'if (dup.length) fail(...)' },
  { id: 'T3', fn: makeBF({ dropCouplings: true }),  target: 'F3',  drop: 'couplings loop in scan' },
  { id: 'T4', fn: makeBF({ dropTours: true }),      target: 'F4',  drop: 'tours loop in scan' },
  { id: 'T5', fn: makeBF({ dropLayerCheck: true }), target: 'F5',  drop: 'layer-btn count check' },
  { id: 'T6', fn: makeBF({ dropViewCheck: true }),  target: 'F6',  drop: 'view-btn count check' },
  { id: 'T7', fn: makeBF({ invertComparison: true }),target: 'F7', drop: 'inverted !== → === (always false)' }
];

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_uniqueIDsNoDups(renderFn) {
  resetEnv();
  dimData = { S1: {}, S2: {}, S3: {} };
  dataNodes = { N1: {}, N2: {} };
  decisionTrees = { T1: {}, T2: {} };
  actions = { a1: {}, a2: {} };
  gates = { g1: {} };
  personas = { p1: {} };
  couplings = [{}, {}];
  tours = [{}, {}];
  var result = renderFn();
  var issues = [];
  if (!result.ok) {
    issues.push('F1 unique-IDs-no-dups violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
  }
  return issues;
}

function runF1b_dupIDsDetectedT1(renderFn) {
  resetEnv();
  dimData = { S1: {} };
  dataNodes = { S1: {} };  // both produce 'D-S1' (collision)
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F1b dup-IDs-detected-T1 violated — expected ok=false (D-S1 collides), got ok=true');
  }
  return issues;
}

function runF2_dupIDsDetected(renderFn) {
  resetEnv();
  dimData = { S1: {} };
  dataNodes = { S1: {} };  // D-S1 collision
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F2 dup-IDs-detected violated — expected ok=false (duplicate "D-S1" exists), got ok=true');
  }
  return issues;
}

function runF3_couplingsDupDetected(renderFn) {
  resetEnv();
  // Override SVG_ID_GENERATOR.data so dataNodes key '0' generates 'CPL-0',
  // colliding with coupling(0) = 'CPL-0'.
  var origDataFn = SVG_ID_GENERATOR.data;
  SVG_ID_GENERATOR.data = function (k) { return 'CPL-' + k; };
  dataNodes = { 0: {} };
  couplings = [{}];
  var result = renderFn();
  SVG_ID_GENERATOR.data = origDataFn;
  var issues = [];
  if (result.ok) {
    issues.push('F3 couplings-dup-detected violated — expected ok=false (CPL-0 collides via override), got ok=true');
  }
  return issues;
}

function runF4_toursDupDetected(renderFn) {
  resetEnv();
  // Override SVG_ID_GENERATOR.data so dimData key '0' generates 'tour-0',
  // colliding with tours[0] = 'tour-0'.
  var origDataFn = SVG_ID_GENERATOR.data;
  SVG_ID_GENERATOR.data = function (k) { return 'tour-' + k; };
  dimData = { 0: {} };
  tours = [{}];
  var result = renderFn();
  SVG_ID_GENERATOR.data = origDataFn;
  var issues = [];
  if (result.ok) {
    issues.push('F4 tours-dup-detected violated — expected ok=false (tour-0 collides), got ok=true');
  }
  return issues;
}

function runF5_layerBtnMismatchDetected(renderFn) {
  resetEnv();
  mockDocument._layerBtns = 4;  // mismatch (LAYER_IDS.length = 5)
  mockDocument._viewBtns  = 3;
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F5 layer-btn-mismatch-detected violated — expected ok=false (count 4 != 5), got ok=true');
  }
  return issues;
}

function runF6_viewBtnMismatchDetected(renderFn) {
  resetEnv();
  mockDocument._layerBtns = 5;
  mockDocument._viewBtns  = 7;  // mismatch (VIEW_IDS.length = 3)
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F6 view-btn-mismatch-detected violated — expected ok=false (count 7 != 3), got ok=true');
  }
  return issues;
}

function runF7_countsMatchT7Fails(renderFn) {
  resetEnv();
  mockDocument._layerBtns = 5;  // matches LAYER_IDS.length = 5
  mockDocument._viewBtns  = 3;  // matches VIEW_IDS.length = 3
  var result = renderFn();
  var issues = [];
  if (!result.ok) {
    issues.push('F7 counts-match-T7-fails violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
  }
  return issues;
}

var ALL_FIXTURES = [
  { id: 'F1',  fn: runF1_uniqueIDsNoDups,          target_id: null },
  { id: 'F1b', fn: runF1b_dupIDsDetectedT1,        target_id: 'T1' },
  { id: 'F2',  fn: runF2_dupIDsDetected,           target_id: 'T2' },
  { id: 'F3',  fn: runF3_couplingsDupDetected,     target_id: 'T3' },
  { id: 'F4',  fn: runF4_toursDupDetected,         target_id: 'T4' },
  { id: 'F5',  fn: runF5_layerBtnMismatchDetected, target_id: 'T5' },
  { id: 'F6',  fn: runF6_viewBtnMismatchDetected,  target_id: 'T6' },
  { id: 'F7',  fn: runF7_countsMatchT7Fails,       target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E47 — validateDataLayer() chrome hook invariant (subset 2) ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-validateDataLayer, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyValidateDataLayer);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy validateDataLayer) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
