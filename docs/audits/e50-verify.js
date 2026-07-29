// e50-verify.js — validateDataLayer() chrome hook invariant (subset 5)
//
// Mirrors D3-PITCH-GRAPH.html L900-1004 (validateDataLayer — E8 chrome,
// invariants 14, 15 — outcomeRegistry + learningEvents).
//
//   14. outcomeRegistry{} — non-null object, not array. Object.keys() scan
//       validates each entry has all requiredOutcomeFields = ['ntype',
//       'label', 'name', 'parentDT', 'probability'] AND o.parentDT ∈
//       allowedParentDTs = ['DT_S3', 'DT_S6', 'DT_S7']. All requiredOutcomeIds
//       = ['OUT_S3_1','OUT_S3_2','OUT_S3_3','OUT_S6_1','OUT_S6_2','OUT_S6_3',
//          'OUT_S7_1','OUT_S7_2'] must be present.
//   15. learningEvents{} — symmetric: non-null object, not array. Scan
//       validates requiredLearningFields = ['ntype','label','name','method',
//       'summary','trigger','owner','kpi'], method ∈ allowedMethods =
//       ['stress','backtest','recalibration','drift'], summary length ≥ 8.
//       All requiredLearningIds = ['LE_S1','LE_S2','LE_S3','LE_S4','LE_S5',
//          'LE_BT','LE_REC','LE_DRIFT'] must be present.
//
// Per-function grouping: each mutant targets ONE contract surface; each
// fixture probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 9 mutants × 1 target fixture each + 12 controls (fixtures × healthy) = 21 reports.
// (F2, F7 retained as controls — they probe the array-vs-object case for
// healthy code; their target mutants T2, T8 are subsumed, see OMITTED block.)
//
// OMITTED mutants (logically subsumed):
//   T2 (dropOutcomeTypeCheck) — subsumed by T6. When outcomeRegistry is
//      null/undefined/non-object/array, the type guard fires; but the
//      required-IDs check ALSO fires because Object.keys of any non-object
//      is []. T2 cannot be defeated by a type-related fixture.
//      (F2 retained as control — proves healthy code still catches the array
//      case end-to-end, even though no broken-mutant probe exists for it.)
//   T5 (dropOutcomeDuplicateIds) — STRUCTURALLY UNREACHABLE for object-
//      keyed registries (Object.keys always unique in JS).
//   T8 (dropLETypeCheck) — subsumed by T13 (same reasoning as T2/T6).
//   T12 (dropLEDuplicateIds) — STRUCTURALLY UNREACHABLE (same as T5).
//
// Result: 9 active mutants (T1, T3, T4, T6, T7, T9, T10, T11, T13) × 9
//         target fixtures (F1, F3, F4, F5, F6, F8, F9, F10, F11) + 12 controls
//         (F0..F11 × healthy) = 9 + 12 = 21 reports.
//         F2, F7 retained as controls even though they no longer have a
//         broken-mutant target — they still probe that healthy code catches
//         the array case (a defensive control surface worth preserving).

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var outcomeRegistry = {};
var learningEvents = {};

var REQUIRED_OUTCOME_FIELDS = ['ntype', 'label', 'name', 'parentDT', 'probability'];
var REQUIRED_OUTCOME_IDS    = ['OUT_S3_1','OUT_S3_2','OUT_S3_3','OUT_S6_1','OUT_S6_2','OUT_S6_3','OUT_S7_1','OUT_S7_2'];
var ALLOWED_PARENT_DTS      = ['DT_S3','DT_S6','DT_S7'];

var REQUIRED_LEARNING_FIELDS = ['ntype','label','name','method','summary','trigger','owner','kpi'];
var REQUIRED_LEARNING_IDS    = ['LE_S1','LE_S2','LE_S3','LE_S4','LE_S5','LE_BT','LE_REC','LE_DRIFT'];
var ALLOWED_LE_METHODS       = ['stress','backtest','recalibration','drift'];
var LE_SUMMARY_MIN           = 8;

function resetEnv() {
  outcomeRegistry = makeHealthyOutcomeRegistry();
  learningEvents  = makeHealthyLearningEvents();
}

function makeHealthyOutcomeRegistry() {
  var reg = {};
  // 8 outcomes distributed across 3 decision trees (DT_S3, DT_S6, DT_S7).
  var seeds = [
    ['OUT_S3_1', 'DT_S3', 'P1'],
    ['OUT_S3_2', 'DT_S3', 'P2'],
    ['OUT_S3_3', 'DT_S3', 'P3'],
    ['OUT_S6_1', 'DT_S6', 'P4'],
    ['OUT_S6_2', 'DT_S6', 'P5'],
    ['OUT_S6_3', 'DT_S6', 'P6'],
    ['OUT_S7_1', 'DT_S7', 'P7'],
    ['OUT_S7_2', 'DT_S7', 'P8']
  ];
  seeds.forEach(function (s) {
    var oid = s[0], pdt = s[1], prob = s[2];
    reg[oid] = {
      ntype: 'outcome',
      label: 'L-' + oid,
      name:  'Outcome ' + oid,
      summary: 'Summary for outcome ' + oid + ' — covers canvas-layer ' + pdt,
      parentDT: pdt,
      probability: prob,
      trigger: 'TRIG-' + oid,
      condition: 'COND-' + oid,
      action: 'ACT-' + oid,
      owner: 'OWN-' + oid,
      kpi: 'KPI-' + oid,
      cost: 'R$1M',
      riskIfIgnored: 'RISK-' + oid
    };
  });
  return reg;
}

function makeHealthyLearningEvents() {
  var le = {};
  var seeds = [
    ['LE_S1',   'stress',       'Stress test LE_S1 covers D2 vulnerabilidad macro'],
    ['LE_S2',   'stress',       'Stress test LE_S2 covers D3 dimension S2 calibragem'],
    ['LE_S3',   'stress',       'Stress test LE_S3 covers D3 decision tree S3'],
    ['LE_S4',   'stress',       'Stress test LE_S4 covers D3 dimension S4 couplings'],
    ['LE_S5',   'stress',       'Stress test LE_S5 covers D3 dimension S5 governance'],
    ['LE_BT',   'backtest',     'Backtest LE_BT validates historical GARCH PTAX'],
    ['LE_REC',  'recalibration','Recalibration LE_REC refreshes HHI thresholds'],
    ['LE_DRIFT','drift',        'Drift detection LE_DRIFT catches drift in PSD regime']
  ];
  seeds.forEach(function (s) {
    var lid = s[0], method = s[1], summary = s[2];
    le[lid] = {
      ntype: 'learning',
      label: 'L-' + lid,
      name:  'Learning event ' + lid,
      method: method,
      summary: summary,
      trigger: 'TRIG-' + lid,
      condition: 'COND-' + lid,
      outcome: 'OUT-' + lid,
      owner: 'OWN-' + lid,
      kpi: 'KPI-' + lid,
      cost: 'R$500k',
      riskIfIgnored: 'RISK-' + lid
    };
  });
  return le;
}

function setOutcomeRegistry(v) { outcomeRegistry = v; }
function getOutcomeRegistry() { return outcomeRegistry; }
function setLearningEvents(v)  { learningEvents = v; }
function getLearningEvents()  { return learningEvents; }

function corruptOutcomeEntry(oid, patch) {
  if (!outcomeRegistry || !outcomeRegistry[oid]) return;
  Object.keys(patch).forEach(function (k) { outcomeRegistry[oid][k] = patch[k]; });
}
function corruptLearningEntry(lid, patch) {
  if (!learningEvents || !learningEvents[lid]) return;
  Object.keys(patch).forEach(function (k) { learningEvents[lid][k] = patch[k]; });
}

// ============================================================
// Mirror — validateDataLayer() subset: invariants 14, 15 (HEALTHY)
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 14. outcomeRegistry{}
  try {
    var seenOutcomeIds = Object.create(null);
    var outcomeIdDups = [];
    var inv14ok = true;
    if (!outcomeRegistry || typeof outcomeRegistry !== 'object' || Array.isArray(outcomeRegistry)) {
      fail('outcomeRegistry missing or not object');
      inv14ok = false;
    } else {
      Object.keys(outcomeRegistry).forEach(function (oid) {
        var o = outcomeRegistry[oid];
        if (!o || typeof o !== 'object') return;
        var missO = REQUIRED_OUTCOME_FIELDS.filter(function (f) { return !o[f] || String(o[f]).length === 0; });
        if (missO.length) {
          fail('outcomeRegistry[' + oid + '] missing required fields: ' + missO.join(','));
          inv14ok = false;
        }
        if (ALLOWED_PARENT_DTS.indexOf(o.parentDT) < 0) {
          fail('outcomeRegistry[' + oid + '].parentDT ' + JSON.stringify(o.parentDT) + ' not in ' + JSON.stringify(ALLOWED_PARENT_DTS));
          inv14ok = false;
        }
        if (seenOutcomeIds[oid]) outcomeIdDups.push(oid);
        seenOutcomeIds[oid] = true;
      });
      if (outcomeIdDups.length) {
        fail('outcomeRegistry duplicate ids: ' + outcomeIdDups.join(','));
        inv14ok = false;
      }
      var missOutcomeIds = REQUIRED_OUTCOME_IDS.filter(function (id) { return !seenOutcomeIds[id]; });
      if (missOutcomeIds.length) {
        fail('outcomeRegistry missing required ids: ' + missOutcomeIds.join(','));
        inv14ok = false;
      }
    }
  } catch (e) { fail('inv-14 outcomeRegistry scan threw: ' + e.message); }

  // 15. learningEvents{}
  try {
    var seenLearningIds = Object.create(null);
    var learningIdDups = [];
    var inv15ok = true;
    if (!learningEvents || typeof learningEvents !== 'object' || Array.isArray(learningEvents)) {
      fail('learningEvents missing or not object');
      inv15ok = false;
    } else {
      Object.keys(learningEvents).forEach(function (lid) {
        var l = learningEvents[lid];
        if (!l || typeof l !== 'object') return;
        var missL = REQUIRED_LEARNING_FIELDS.filter(function (f) { return !l[f] || String(l[f]).length === 0; });
        if (missL.length) {
          fail('learningEvents[' + lid + '] missing required fields: ' + missL.join(','));
          inv15ok = false;
        }
        if (ALLOWED_LE_METHODS.indexOf(l.method) < 0) {
          fail('learningEvents[' + lid + '].method ' + JSON.stringify(l.method) + ' not in ' + JSON.stringify(ALLOWED_LE_METHODS));
          inv15ok = false;
        }
        if (typeof l.summary !== 'string' || l.summary.length < LE_SUMMARY_MIN) {
          fail('learningEvents[' + lid + '].summary length ' + (l.summary ? l.summary.length : 0) + ' < ' + LE_SUMMARY_MIN);
          inv15ok = false;
        }
        if (seenLearningIds[lid]) learningIdDups.push(lid);
        seenLearningIds[lid] = true;
      });
      if (learningIdDups.length) {
        fail('learningEvents duplicate ids: ' + learningIdDups.join(','));
        inv15ok = false;
      }
      var missLearningIds = REQUIRED_LEARNING_IDS.filter(function (id) { return !seenLearningIds[id]; });
      if (missLearningIds.length) {
        fail('learningEvents missing required ids: ' + missLearningIds.join(','));
        inv15ok = false;
      }
    }
  } catch (e) { fail('inv-15 learningEvents scan threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — factory pattern.
// Each broken body is built from boolean flags; when MIRROR_REPAIRED is
// true, the factory falls through to healthyValidateDataLayer().
// 13 flags total (5 outcome + 6 learning + 2 dead-code-but-defensive).
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyValidateDataLayer();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    // 14. outcomeRegistry{}
    if (!opts.dropOutcomeScan) {
      try {
        var seenOutcomeIds = Object.create(null);
        var outcomeIdDups = [];
        if (!opts.dropOutcomeTypeCheck &&
            (!outcomeRegistry || typeof outcomeRegistry !== 'object' || Array.isArray(outcomeRegistry))) {
          fail('outcomeRegistry missing or not object');
        } else {
          Object.keys(outcomeRegistry).forEach(function (oid) {
            var o = outcomeRegistry[oid];
            if (!o || typeof o !== 'object') return;
            if (!opts.dropOutcomeRequiredFields) {
              var missO = REQUIRED_OUTCOME_FIELDS.filter(function (f) { return !o[f] || String(o[f]).length === 0; });
              if (missO.length) fail('outcomeRegistry[' + oid + '] missing required fields: ' + missO.join(','));
            }
            if (!opts.dropOutcomeParentDT && ALLOWED_PARENT_DTS.indexOf(o.parentDT) < 0) {
              fail('outcomeRegistry[' + oid + '].parentDT ' + JSON.stringify(o.parentDT) + ' not in ' + JSON.stringify(ALLOWED_PARENT_DTS));
            }
            if (!opts.dropOutcomeDuplicateIds && seenOutcomeIds[oid]) outcomeIdDups.push(oid);
            seenOutcomeIds[oid] = true;
          });
          if (!opts.dropOutcomeDuplicateIds && outcomeIdDups.length) {
            fail('outcomeRegistry duplicate ids: ' + outcomeIdDups.join(','));
          }
          if (!opts.dropOutcomeRequiredIds) {
            var missOutcomeIds = REQUIRED_OUTCOME_IDS.filter(function (id) { return !seenOutcomeIds[id]; });
            if (missOutcomeIds.length) fail('outcomeRegistry missing required ids: ' + missOutcomeIds.join(','));
          }
        }
      } catch (e) { fail('inv-14 outcomeRegistry scan threw: ' + e.message); }
    }

    // 15. learningEvents{}
    if (!opts.dropLEScan) {
      try {
        var seenLearningIds = Object.create(null);
        var learningIdDups = [];
        if (!opts.dropLETypeCheck &&
            (!learningEvents || typeof learningEvents !== 'object' || Array.isArray(learningEvents))) {
          fail('learningEvents missing or not object');
        } else {
          Object.keys(learningEvents).forEach(function (lid) {
            var l = learningEvents[lid];
            if (!l || typeof l !== 'object') return;
            if (!opts.dropLERequiredFields) {
              var missL = REQUIRED_LEARNING_FIELDS.filter(function (f) { return !l[f] || String(l[f]).length === 0; });
              if (missL.length) fail('learningEvents[' + lid + '] missing required fields: ' + missL.join(','));
            }
            if (!opts.dropLEMethod && ALLOWED_LE_METHODS.indexOf(l.method) < 0) {
              fail('learningEvents[' + lid + '].method ' + JSON.stringify(l.method) + ' not in ' + JSON.stringify(ALLOWED_LE_METHODS));
            }
            if (!opts.dropLESummaryLength &&
                (typeof l.summary !== 'string' || l.summary.length < LE_SUMMARY_MIN)) {
              fail('learningEvents[' + lid + '].summary length ' + (l.summary ? l.summary.length : 0) + ' < ' + LE_SUMMARY_MIN);
            }
            if (!opts.dropLEDuplicateIds && seenLearningIds[lid]) learningIdDups.push(lid);
            seenLearningIds[lid] = true;
          });
          if (!opts.dropLEDuplicateIds && learningIdDups.length) {
            fail('learningEvents duplicate ids: ' + learningIdDups.join(','));
          }
          if (!opts.dropLERequiredIds) {
            var missLearningIds = REQUIRED_LEARNING_IDS.filter(function (id) { return !seenLearningIds[id]; });
            if (missLearningIds.length) fail('learningEvents missing required ids: ' + missLearningIds.join(','));
          }
        }
      } catch (e) { fail('inv-15 learningEvents scan threw: ' + e.message); }
    }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  { id: 'T1',  fn: makeBF({ dropOutcomeScan:         true }), target: 'F1',  drop: 'inv-14 outcomeRegistry scan entirely' },
  { id: 'T3',  fn: makeBF({ dropOutcomeRequiredFields:true}),target: 'F3',  drop: 'outcomeRegistry required-fields check' },
  { id: 'T4',  fn: makeBF({ dropOutcomeParentDT:     true }), target: 'F4',  drop: 'outcomeRegistry parentDT enum check' },
  { id: 'T6',  fn: makeBF({ dropOutcomeRequiredIds:  true }), target: 'F5',  drop: 'outcomeRegistry required-IDs check' },
  { id: 'T7',  fn: makeBF({ dropLEScan:              true }), target: 'F6',  drop: 'inv-15 learningEvents scan entirely' },
  { id: 'T9',  fn: makeBF({ dropLERequiredFields:    true }), target: 'F8',  drop: 'learningEvents required-fields check' },
  { id: 'T10', fn: makeBF({ dropLEMethod:            true }), target: 'F9',  drop: 'learningEvents method enum check' },
  { id: 'T11', fn: makeBF({ dropLESummaryLength:     true }), target: 'F10', drop: 'learningEvents summary length check' },
  { id: 'T13', fn: makeBF({ dropLERequiredIds:       true }), target: 'F11', drop: 'learningEvents required-IDs check' }
];

// ============================================================
// Fixtures — sourced from e50-fixtures.js via factory + deps
// ============================================================
var fx = require('./e50-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv:                 resetEnv,
  setOutcomeRegistry:       setOutcomeRegistry,
  getOutcomeRegistry:       getOutcomeRegistry,
  setLearningEvents:        setLearningEvents,
  getLearningEvents:        getLearningEvents,
  makeHealthyOutcomeRegistry: makeHealthyOutcomeRegistry,
  makeHealthyLearningEvents:  makeHealthyLearningEvents,
  corruptOutcomeEntry:      corruptOutcomeEntry,
  corruptLearningEntry:     corruptLearningEntry
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E50 — validateDataLayer() chrome hook invariant (subset 5) ===');
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