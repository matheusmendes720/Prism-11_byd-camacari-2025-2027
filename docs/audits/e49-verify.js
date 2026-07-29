// e49_verify.js — validateDataLayer() chrome hook invariant (subset 4)
//
// Mirrors D3-PITCH-GRAPH.html L759-790 + L792-852 + L854-898 (validateDataLayer
// — invariants 11, 12, 13).
//
// validateDataLayer() has a multi-invariant contract returning {ok, issues}.
// E46 covered invariants 1, 2, 7, 8 (simplest data checks).
// E47 covered invariants 3, 5, 6 (ID uniqueness + DOM button sync).
// E48 covered invariants 4, 9, 10 (sub-camada + counts sanity).
// E49 covers invariants 11, 12, 13 (round-trip coherence + registries):
//
//  11. STATUS_THRESHOLDS round-trip — every dimData[k].status must equal
//      STATUS_THRESHOLDS.status(dimData[k].score) under the active rule.
//      Plus localStorage `d3:status_threshold` ∈ {legacy, authoritative}
//      or absent. Distinct from invariant #8 (valid enum) — this one
//      enforces coherence. Mirrors L759-790.
//  12. governanceAudit[] — array of ≥ 4 entries, each with required
//      fields (id/label/r/ntype/name), the 4 canvas-layer IDs (GOV-AUDIT,
//      GOV-SIGNOFF, GOV-RACI, GOV-COMPL) all present (no dups, no
//      missing), and GOV-RACI.raciLink mentions personas_workflow[].
//      Mirrors L792-852.
//  13. triggerRegistry{} — non-array object with ≥ 5 keys, each with
//      required fields (ntype/label/name/cadence), cadence ∈ enum,
//      the 5 expected IDs (T-AMBER/T-S7/T-HYST/T-5D/T-Li) all present.
//      Mirrors L854-898.
//
// 16 mutants × 18 probe fixtures + 18 controls + 1 healthy = 35 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var dimData = {};
var STATUS_THRESHOLDS = {
  active: 'authoritative',
  // Simple authoritative rule: score >= 80 = green, >= 65 = amber, else red
  status: function (s) {
    if (typeof s !== 'number') return null;
    if (s >= 80) return 'green';
    if (s >= 65) return 'amber';
    return 'red';
  }
};
var STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red' };
var governanceAudit = [];
var triggerRegistry = {};

// localStorage mock with reset
var _localStorageStore = {};
var localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(_localStorageStore, k) ? _localStorageStore[k] : null; },
  setItem: function (k, v) { _localStorageStore[k] = String(v); },
  removeItem: function (k) { delete _localStorageStore[k]; },
  clear: function () { _localStorageStore = {}; }
};

// personas_workflow used by GOV-RACI cross-link invariant 12
var personas_workflow = [];

function resetEnv() {
  dimData = {
    S1: { score: 80, status: 'green' },
    S2: { score: 70, status: 'amber' },
    S3: { score: 50, status: 'red' }
  };
  STATUS_THRESHOLDS = {
    active: 'authoritative',
    status: function (s) {
      if (typeof s !== 'number') return null;
      if (s >= 80) return 'green';
      if (s >= 65) return 'amber';
      return 'red';
    }
  };
  governanceAudit = [];
  triggerRegistry = {};
  personas_workflow = [];
  _localStorageStore = {};
}

// Build a healthy governanceAudit (4 required IDs).
function makeHealthyGovernanceAudit() {
  return [
    { id: 'GOV-AUDIT',   label: 'Audit',     r: 22, ntype: 'audit',    name: 'Audit layer' },
    { id: 'GOV-SIGNOFF', label: 'Signoff',   r: 22, ntype: 'signoff',  name: 'Signoff layer', raciLink: '' },
    { id: 'GOV-RACI',    label: 'RACI',      r: 22, ntype: 'raci',     name: 'RACI layer', raciLink: 'personas_workflow[17]' },
    { id: 'GOV-COMPL',   label: 'Compliance',r: 22, ntype: 'compl',    name: 'Compliance layer' }
  ];
}

// Build a healthy triggerRegistry (5 required IDs).
function makeHealthyTriggerRegistry() {
  return {
    'T-AMBER': { ntype: 'trigger', label: 'AMBER',   name: 'AMBER trigger', cadence: 'intraday' },
    'T-S7':    { ntype: 'trigger', label: 'S7',      name: 'S7 trigger',    cadence: 'real-time' },
    'T-HYST':  { ntype: 'trigger', label: 'HYST',    name: 'Hysteresis',    cadence: 'continuous' },
    'T-5D':    { ntype: 'trigger', label: '5D',      name: '5-day refresh', cadence: 'every 5d' },
    'T-Li':    { ntype: 'trigger', label: 'Li',      name: 'Lithium',       cadence: 'weekly' }
  };
}

// Build healthy personas_workflow (17 entries — needed by inv-12 raciLink check).
function makeHealthyPersonasWorkflow() {
  var arr = [];
  for (var i = 0; i < 17; i++) arr.push({ id: 'P_' + i, role: 'role-' + i });
  return arr;
}

// ============================================================
// Mirror — validateDataLayer() (subset: invariants 11, 12, 13) (HEALTHY)
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 11. STATUS_THRESHOLDS round-trip + localStorage guard
  try {
    var allowedStored = { legacy: 1, authoritative: 1 };
    var stored = null;
    try { stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('d3:status_threshold') : null; } catch (e) { /* SSR / private mode — treat as absent */ }
    if (stored !== null && !allowedStored[stored]) {
      fail('localStorage d3:status_threshold has invalid value: ' + stored + ' (expected legacy|authoritative or absent)');
    }
    if (typeof STATUS_THRESHOLDS === 'object' && STATUS_THRESHOLDS !== null && typeof STATUS_THRESHOLDS.status === 'function') {
      Object.keys(dimData || {}).forEach(function (k) {
        var node = dimData[k];
        if (!node) return;
        var score = node.score;
        var actual = node.status;
        var expected = STATUS_THRESHOLDS.status(score);
        if (actual !== expected) {
          fail('dimData.' + k + '.status desync (actual=' + actual + ' but STATUS_THRESHOLDS.status(' + score + ') under ' + STATUS_THRESHOLDS.active + ' returns ' + expected + ')');
        }
      });
    } else {
      fail('STATUS_THRESHOLDS.status is not callable — round-trip invariant skipped');
    }
  } catch (e) { fail('STATUS_THRESHOLDS round-trip threw: ' + e.message); }

  // 12. governanceAudit[] array + schema + ID coverage + GOV-RACI cross-link
  try {
    if (typeof governanceAudit !== 'object' || governanceAudit === null || !Array.isArray(governanceAudit)) {
      fail('governanceAudit must be an array (got ' + (typeof governanceAudit) + ')');
    } else {
      if (governanceAudit.length < 4) {
        fail('governanceAudit.length=' + governanceAudit.length + ' is below expected ≥ 4 (GOV-AUDIT/SIGNOFF/RACI/COMPL)');
      }
      var required = ['id', 'label', 'r', 'ntype', 'name'];
      var requiredIds = ['GOV-AUDIT', 'GOV-SIGNOFF', 'GOV-RACI', 'GOV-COMPL'];
      var seenIds = {};
      governanceAudit.forEach(function (entry, idx) {
        if (!entry || typeof entry !== 'object') {
          fail('governanceAudit[' + idx + '] is not an object');
          return;
        }
        required.forEach(function (k) {
          if (typeof entry[k] === 'undefined' || entry[k] === null || entry[k] === '') {
            fail('governanceAudit[' + idx + '] missing required field "' + k + '"');
          }
        });
        if (entry.id) {
          if (seenIds[entry.id]) {
            fail('governanceAudit has duplicate id: ' + entry.id);
          }
          seenIds[entry.id] = (seenIds[entry.id] || 0) + 1;
        }
      });
      requiredIds.forEach(function (rid) {
        if (!seenIds[rid]) {
          fail('governanceAudit is missing required canvas-layer id: ' + rid);
        }
      });
      // GOV-RACI must cross-link to personas_workflow[] roster.
      try {
        var raciEntry = governanceAudit.find(function (e) { return e && e.id === 'GOV-RACI'; });
        if (raciEntry && typeof raciEntry.raciLink === 'string') {
          var link = raciEntry.raciLink;
          var mentionsWorkflow = link.indexOf('personas_workflow') !== -1;
          if (!mentionsWorkflow) {
            fail('GOV-RACI.raciLink does not mention personas_workflow[]: "' + link + '"');
          }
          var pw = (typeof personas_workflow !== 'undefined' && Array.isArray(personas_workflow)) ? personas_workflow : null;
          if (!pw || pw.length < 17) {
            fail('GOV-RACI cross-link expects personas_workflow[].length ≥ 17, found ' + (pw ? pw.length : 'undefined'));
          }
        } else if (raciEntry) {
          fail('GOV-RACI exists but raciLink is not a string — cross-link invariant skipped');
        }
      } catch (e) { fail('GOV-RACI cross-link check threw: ' + e.message); }
    }
  } catch (e) { fail('governanceAudit invariant threw: ' + e.message); }

  // 13. triggerRegistry{} object + schema + cadence enum + ID coverage
  try {
    if (typeof triggerRegistry !== 'object' || triggerRegistry === null || Array.isArray(triggerRegistry)) {
      fail('triggerRegistry must be an object (got ' + (typeof triggerRegistry) + ')');
    } else {
      var triggerIds = Object.keys(triggerRegistry);
      if (triggerIds.length < 5) {
        fail('triggerRegistry.length=' + triggerIds.length + ' is below expected ≥ 5 (T-AMBER/T-S7/T-HYST/T-5D/T-Li)');
      }
      var requiredTriggerFields = ['ntype', 'label', 'name', 'cadence'];
      var requiredTriggerIds = ['T-AMBER', 'T-S7', 'T-HYST', 'T-5D', 'T-Li'];
      var allowedCadences = ['intraday', 'real-time', 'continuous', 'every 5d', 'weekly'];
      var seenTriggerIds = {};
      triggerIds.forEach(function (tid) {
        var entry = triggerRegistry[tid];
        if (!entry || typeof entry !== 'object') {
          fail('triggerRegistry[' + tid + '] is not an object');
          return;
        }
        requiredTriggerFields.forEach(function (k) {
          if (typeof entry[k] === 'undefined' || entry[k] === null || entry[k] === '') {
            fail('triggerRegistry[' + tid + '] missing required field "' + k + '"');
          }
        });
        if (entry.cadence && allowedCadences.indexOf(entry.cadence) === -1) {
          fail('triggerRegistry[' + tid + '].cadence="' + entry.cadence + '" is not in allowed enum: [' + allowedCadences.join(', ') + ']');
        }
        if (seenTriggerIds[tid]) fail('triggerRegistry has duplicate id: ' + tid);
        seenTriggerIds[tid] = (seenTriggerIds[tid] || 0) + 1;
      });
      requiredTriggerIds.forEach(function (rid) {
        if (!seenTriggerIds[rid]) fail('triggerRegistry is missing required id: ' + rid);
      });
    }
  } catch (e) { fail('triggerRegistry invariant threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — factory pattern.
// Invariant 11: { dropRTScan, dropStoredCheck, dropReclassifyLoop, dropDesyncCheck, dropCallableGuard }
// Invariant 12: { dropGAScan, dropGAArrayCheck, dropGALengthCheck, dropGARequiredFields, dropGADuplicateIds, dropGARequiredIds, dropGARaciCrossLink }
// Invariant 13: { dropTRScan, dropTRTypeCheck, dropTRLengthCheck, dropTRRequiredFields, dropTRCadence, dropTRDuplicateIds, dropTRRequiredIds }
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyValidateDataLayer();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    // 11. STATUS_THRESHOLDS round-trip + localStorage guard
    if (!opts.dropRTScan) {
      try {
        var allowedStored = { legacy: 1, authoritative: 1 };
        var stored = null;
        try { stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('d3:status_threshold') : null; } catch (e) { /* SSR */ }
        if (!opts.dropStoredCheck && stored !== null && !allowedStored[stored]) {
          fail('localStorage d3:status_threshold has invalid value: ' + stored + ' (expected legacy|authoritative or absent)');
        }
        if (opts.dropCallableGuard) {
          // Drop the callable guard — pretend it's not callable
          if (typeof STATUS_THRESHOLDS === 'object' && STATUS_THRESHOLDS !== null) {
            // Do nothing (would have errored but we'll skip the reclassify loop too)
          } else if (typeof STATUS_THRESHOLDS.status === 'function') {
            if (!opts.dropReclassifyLoop) {
              Object.keys(dimData || {}).forEach(function (k) {
                var node = dimData[k];
                if (!node) return;
                var score = node.score;
                var actual = node.status;
                if (!opts.dropDesyncCheck) {
                  var expected = STATUS_THRESHOLDS.status(score);
                  if (actual !== expected) {
                    fail('dimData.' + k + '.status desync (actual=' + actual + ' but STATUS_THRESHOLDS.status(' + score + ') under ' + STATUS_THRESHOLDS.active + ' returns ' + expected + ')');
                  }
                }
              });
            }
          }
        } else if (typeof STATUS_THRESHOLDS === 'object' && STATUS_THRESHOLDS !== null && typeof STATUS_THRESHOLDS.status === 'function') {
          if (!opts.dropReclassifyLoop) {
            Object.keys(dimData || {}).forEach(function (k) {
              var node = dimData[k];
              if (!node) return;
              var score = node.score;
              var actual = node.status;
              if (!opts.dropDesyncCheck) {
                var expected = STATUS_THRESHOLDS.status(score);
                if (actual !== expected) {
                  fail('dimData.' + k + '.status desync (actual=' + actual + ' but STATUS_THRESHOLDS.status(' + score + ') under ' + STATUS_THRESHOLDS.active + ' returns ' + expected + ')');
                }
              }
            });
          }
        } else {
          fail('STATUS_THRESHOLDS.status is not callable — round-trip invariant skipped');
        }
      } catch (e) { fail('STATUS_THRESHOLDS round-trip threw: ' + e.message); }
    }

    // 12. governanceAudit[]
    if (!opts.dropGAScan) {
      try {
        if (opts.dropGAArrayCheck) {
          // Pretend it's OK to be a non-array
        } else if (typeof governanceAudit !== 'object' || governanceAudit === null || !Array.isArray(governanceAudit)) {
          fail('governanceAudit must be an array (got ' + (typeof governanceAudit) + ')');
        } else {
          if (!opts.dropGALengthCheck && governanceAudit.length < 4) {
            fail('governanceAudit.length=' + governanceAudit.length + ' is below expected ≥ 4 (GOV-AUDIT/SIGNOFF/RACI/COMPL)');
          }
          var ga_required = ['id', 'label', 'r', 'ntype', 'name'];
          var ga_requiredIds = ['GOV-AUDIT', 'GOV-SIGNOFF', 'GOV-RACI', 'GOV-COMPL'];
          var ga_seenIds = {};
          governanceAudit.forEach(function (entry, idx) {
            if (!entry || typeof entry !== 'object') {
              fail('governanceAudit[' + idx + '] is not an object');
              return;
            }
            if (!opts.dropGARequiredFields) {
              ga_required.forEach(function (k) {
                if (typeof entry[k] === 'undefined' || entry[k] === null || entry[k] === '') {
                  fail('governanceAudit[' + idx + '] missing required field "' + k + '"');
                }
              });
            }
            if (!opts.dropGADuplicateIds && entry.id) {
              if (ga_seenIds[entry.id]) {
                fail('governanceAudit has duplicate id: ' + entry.id);
              }
              ga_seenIds[entry.id] = (ga_seenIds[entry.id] || 0) + 1;
            } else if (entry.id) {
              ga_seenIds[entry.id] = (ga_seenIds[entry.id] || 0) + 1;
            }
          });
          if (!opts.dropGARequiredIds) {
            ga_requiredIds.forEach(function (rid) {
              if (!ga_seenIds[rid]) {
                fail('governanceAudit is missing required canvas-layer id: ' + rid);
              }
            });
          }
          // GOV-RACI cross-link
          if (!opts.dropGARaciCrossLink) {
            try {
              var raciEntry = governanceAudit.find(function (e) { return e && e.id === 'GOV-RACI'; });
              if (raciEntry && typeof raciEntry.raciLink === 'string') {
                var link = raciEntry.raciLink;
                var mentionsWorkflow = link.indexOf('personas_workflow') !== -1;
                if (!mentionsWorkflow) {
                  fail('GOV-RACI.raciLink does not mention personas_workflow[]: "' + link + '"');
                }
                var pw = (typeof personas_workflow !== 'undefined' && Array.isArray(personas_workflow)) ? personas_workflow : null;
                if (!pw || pw.length < 17) {
                  fail('GOV-RACI cross-link expects personas_workflow[].length ≥ 17, found ' + (pw ? pw.length : 'undefined'));
                }
              } else if (raciEntry) {
                fail('GOV-RACI exists but raciLink is not a string — cross-link invariant skipped');
              }
            } catch (e) { fail('GOV-RACI cross-link check threw: ' + e.message); }
          }
        }
      } catch (e) { fail('governanceAudit invariant threw: ' + e.message); }
    }

    // 13. triggerRegistry{}
    if (!opts.dropTRScan) {
      try {
        if (opts.dropTRTypeCheck) {
          // pretend it's OK
        } else if (typeof triggerRegistry !== 'object' || triggerRegistry === null || Array.isArray(triggerRegistry)) {
          fail('triggerRegistry must be an object (got ' + (typeof triggerRegistry) + ')');
        } else {
          var tr_triggerIds = Object.keys(triggerRegistry);
          if (!opts.dropTRLengthCheck && tr_triggerIds.length < 5) {
            fail('triggerRegistry.length=' + tr_triggerIds.length + ' is below expected ≥ 5 (T-AMBER/T-S7/T-HYST/T-5D/T-Li)');
          }
          var tr_requiredFields = ['ntype', 'label', 'name', 'cadence'];
          var tr_requiredTriggerIds = ['T-AMBER', 'T-S7', 'T-HYST', 'T-5D', 'T-Li'];
          var tr_allowedCadences = ['intraday', 'real-time', 'continuous', 'every 5d', 'weekly'];
          var tr_seenTriggerIds = {};
          tr_triggerIds.forEach(function (tid) {
            var entry = triggerRegistry[tid];
            if (!entry || typeof entry !== 'object') {
              fail('triggerRegistry[' + tid + '] is not an object');
              return;
            }
            if (!opts.dropTRRequiredFields) {
              tr_requiredFields.forEach(function (k) {
                if (typeof entry[k] === 'undefined' || entry[k] === null || entry[k] === '') {
                  fail('triggerRegistry[' + tid + '] missing required field "' + k + '"');
                }
              });
            }
            if (!opts.dropTRCadence && entry.cadence && tr_allowedCadences.indexOf(entry.cadence) === -1) {
              fail('triggerRegistry[' + tid + '].cadence="' + entry.cadence + '" is not in allowed enum: [' + tr_allowedCadences.join(', ') + ']');
            }
            if (!opts.dropTRDuplicateIds && tr_seenTriggerIds[tid]) {
              fail('triggerRegistry has duplicate id: ' + tid);
            }
            tr_seenTriggerIds[tid] = (tr_seenTriggerIds[tid] || 0) + 1;
          });
          if (!opts.dropTRRequiredIds) {
            tr_requiredTriggerIds.forEach(function (rid) {
              if (!tr_seenTriggerIds[rid]) fail('triggerRegistry is missing required id: ' + rid);
            });
          }
        }
      } catch (e) { fail('triggerRegistry invariant threw: ' + e.message); }
    }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  // Invariant 11 — STATUS_THRESHOLDS round-trip
  { id: 'T1',  fn: makeBF({ dropRTScan: true }),         target: 'F1',  drop: 'inv-11: drop entire round-trip scan' },
  { id: 'T2',  fn: makeBF({ dropStoredCheck: true }),    target: 'F2',  drop: 'inv-11: drop localStorage stored-value check' },
  { id: 'T3',  fn: makeBF({ dropReclassifyLoop: true }), target: 'F3',  drop: 'inv-11: drop dimData reclassify loop' },
  { id: 'T4',  fn: makeBF({ dropDesyncCheck: true }),    target: 'F4',  drop: 'inv-11: drop actual !== expected comparison' },
  { id: 'T5',  fn: makeBF({ dropCallableGuard: true }),  target: 'F5',  drop: 'inv-11: drop STATUS_THRESHOLDS.status callable guard' },
  // Invariant 12 — governanceAudit[]
  { id: 'T6',  fn: makeBF({ dropGAScan: true }),          target: 'F6',  drop: 'inv-12: drop entire governanceAudit scan' },
  { id: 'T7',  fn: makeBF({ dropGAArrayCheck: true }),    target: 'F7',  drop: 'inv-12: drop Array.isArray check' },
  // T8 (drop length ≥ 4 check) intentionally omitted: with 4 required IDs enforced,
  // length < 4 implies missing required IDs, so length check is logically subsumed by
  // required-IDs check. Cannot be isolated by any fixture data.
  { id: 'T9',  fn: makeBF({ dropGARequiredFields: true }),target: 'F9',  drop: 'inv-12: drop required fields loop' },
  { id: 'T10', fn: makeBF({ dropGADuplicateIds: true }),  target: 'F10', drop: 'inv-12: drop duplicate IDs check' },
  { id: 'T11', fn: makeBF({ dropGARequiredIds: true }),   target: 'F11', drop: 'inv-12: drop required canvas-layer IDs check' },
  { id: 'T12', fn: makeBF({ dropGARaciCrossLink: true }), target: 'F12', drop: 'inv-12: drop GOV-RACI raciLink cross-link check' },
  // Invariant 13 — triggerRegistry{}
  { id: 'T13', fn: makeBF({ dropTRScan: true }),           target: 'F13', drop: 'inv-13: drop entire triggerRegistry scan' },
  { id: 'T14', fn: makeBF({ dropTRTypeCheck: true }),      target: 'F14', drop: 'inv-13: drop type guard' },
  // T15 (drop length ≥ 5 check) intentionally omitted: with 5 required IDs enforced,
  // length < 5 implies missing required IDs, so length check is logically subsumed by
  // required-IDs check. Cannot be isolated by any fixture data.
  { id: 'T16', fn: makeBF({ dropTRRequiredFields: true }), target: 'F16', drop: 'inv-13: drop required fields loop' },
  { id: 'T17', fn: makeBF({ dropTRCadence: true }),        target: 'F17', drop: 'inv-13: drop cadence enum check' },
  { id: 'T18', fn: makeBF({ dropTRRequiredIds: true }),    target: 'F18', drop: 'inv-13: drop required IDs presence check' }
];

// ============================================================
// Fixtures module — split out to e49-fixtures.js per 500-line directive.
// The factory takes `deps` (setter/getter wrappers around module-scope vars)
// because Node.js require() creates a separate scope per module — globals
// defined here are NOT visible to the fixtures module. Setters rebind the
// host's `var` bindings; getters expose the current value so fixtures can
// read fresh state set by other fixtures.
// ============================================================
var fx = require('./e49-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setDimData:         function (v) { dimData = v; },
  getDimData:         function () { return dimData; },
  setGovernanceAudit: function (v) { governanceAudit = v; },
  getGovernanceAudit: function () { return governanceAudit; },
  setTriggerRegistry: function (v) { triggerRegistry = v; },
  getTriggerRegistry: function () { return triggerRegistry; },
  setPersonasWorkflow:function (v) { personas_workflow = v; },
  getPersonasWorkflow:function () { return personas_workflow; },
  setSTATUS_THRESHOLDS:function (v) { STATUS_THRESHOLDS = v; },
  getSTATUS_THRESHOLDS:function () { return STATUS_THRESHOLDS; },
  setLocalStorageItem:function (k, v) { _localStorageStore[k] = String(v); },
  makeHealthyGovernanceAudit: makeHealthyGovernanceAudit,
  makeHealthyTriggerRegistry: makeHealthyTriggerRegistry,
  makeHealthyPersonasWorkflow: makeHealthyPersonasWorkflow
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E49 — validateDataLayer() chrome hook invariant (subset 4) ===');
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