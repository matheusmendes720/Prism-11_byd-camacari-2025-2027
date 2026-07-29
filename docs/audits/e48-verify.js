// e48_verify.js — validateDataLayer() chrome hook invariant (subset 3)
//
// Mirrors D3-PITCH-GRAPH.html L667-676 + L707-728 + L730-757
// (validateDataLayer — invariants 4, 9, 10).
//
// validateDataLayer() has a multi-invariant contract returning {ok, issues}.
// E46 covered invariants 1, 2, 7, 8 (simplest data checks).
// E47 covered invariants 3, 5, 6 (ID uniqueness + DOM button sync).
// E48 covers invariants 4, 9, 10 (sub-camada + counts sanity):
//
//   4. getCounts() returns non-negative finite integers for every field.
//      Mirrors L667-676: Object.keys(c).forEach checks typeof === 'number'
//      AND v >= 0 AND isFinite(v).
//   9. Estratégica sub-camada — exactly 5 entries A_E1..A_E5 with
//      category='strategic' + non-empty executiveSummary (≥ 20 chars).
//      Mirrors L707-728.
//  10. Workflow RACI sub-camada — exactly 17 entries P_CONSELHO..P_ANALYST
//      with category='workflow' + non-empty desc (≥ 20 chars).
//      Mirrors L730-757.
//
// Per-function grouping: each mutant targets ONE contract surface; each
// fixture probes ONE specific break that ONLY that surface catches.
// Pair-wise: mutant T_i should PASS (undetected) when run against its
// targeted fixture F_i; healthy should FAIL (detected).
//
// 14 mutants × 14 probe fixtures + 14 controls = 42 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var ACTIONS = {};                 // invariant 9 source
var PERSONAS_WORKFLOW = {};       // invariant 10 source
var STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red' };

// Override hook so tests can swap getCounts() implementation per-fixture.
var getCounts = function () { return { dims: 11, actions: 31, gates: 7, personas: 5, couplings: 5, tours: 4 }; };

function resetEnv() {
  ACTIONS = {};
  PERSONAS_WORKFLOW = {};
  getCounts = function () { return { dims: 11, actions: 31, gates: 7, personas: 5, couplings: 5, tours: 4 }; };
}

// Build a healthy Estratégica sub-camada (5 entries).
function makeHealthyActions() {
  var obj = {};
  ['A_E1', 'A_E2', 'A_E3', 'A_E4', 'A_E5'].forEach(function (id) {
    obj[id] = { category: 'strategic', executiveSummary: 'Estratégica action ' + id + ' summary long enough' };
  });
  return obj;
}

// Build a healthy Workflow RACI roster (17 entries).
function makeHealthyPersonasWorkflow() {
  var ids = [
    'P_CONSELHO', 'P_CEO', 'P_CFO', 'P_CSO', 'P_COO', 'P_CMO',
    'P_RISK', 'P_HEAD_PROC', 'P_HEAD_ESG', 'P_HEAD_STR',
    'P_HEAD_SUPPLY', 'P_HEAD_GOV', 'P_TREASURY', 'P_GOV',
    'P_BOARD', 'P_ENG', 'P_ANALYST'
  ];
  var obj = { length: ids.length };
  ids.forEach(function (id) {
    obj[id] = { category: 'workflow', desc: 'Workflow persona ' + id + ' role desc long enough' };
  });
  return obj;
}

// ============================================================
// Mirror — validateDataLayer() L667-676 + L707-728 + L730-757 (HEALTHY)
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 4. getCounts() sanity
  try {
    var c = getCounts();
    Object.keys(c).forEach(function (k) {
      var v = c[k];
      if (typeof v !== 'number' || v < 0 || !isFinite(v)) {
        fail('getCounts().' + k + ' is not a non-negative number: ' + v);
      }
    });
  } catch (e) { fail('getCounts() threw: ' + e.message); }

  // 9. Estratégica sub-camada
  try {
    var expected = ['A_E1', 'A_E2', 'A_E3', 'A_E4', 'A_E5'];
    expected.forEach(function (id) {
      var e = (typeof ACTIONS === 'object' && ACTIONS !== null) ? ACTIONS[id] : null;
      if (!e) {
        fail('actions.' + id + ' missing (Estratégica sub-camada must have 5 entries)');
        return;
      }
      if (e.category !== 'strategic') {
        fail('actions.' + id + '.category !== "strategic": ' + e.category);
      }
      if (typeof e.executiveSummary !== 'string' || e.executiveSummary.trim().length < 20) {
        fail('actions.' + id + '.executiveSummary missing or too short (≥ 20 chars)');
      }
    });
  } catch (e) { fail('Estratégica sub-camada scan threw: ' + e.message); }

  // 10. Workflow RACI sub-camada
  try {
    var expectedWF = [
      'P_CONSELHO', 'P_CEO', 'P_CFO', 'P_CSO', 'P_COO', 'P_CMO',
      'P_RISK', 'P_HEAD_PROC', 'P_HEAD_ESG', 'P_HEAD_STR',
      'P_HEAD_SUPPLY', 'P_HEAD_GOV', 'P_TREASURY', 'P_GOV',
      'P_BOARD', 'P_ENG', 'P_ANALYST'
    ];
    expectedWF.forEach(function (id) {
      var e = (typeof PERSONAS_WORKFLOW === 'object' && PERSONAS_WORKFLOW !== null) ? PERSONAS_WORKFLOW[id] : null;
      if (!e) {
        fail('personas_workflow.' + id + ' missing (Workflow RACI must have 17 entries)');
        return;
      }
      if (e.category !== 'workflow') {
        fail('personas_workflow.' + id + '.category !== "workflow": ' + e.category);
      }
      if (typeof e.desc !== 'string' || e.desc.trim().length < 20) {
        fail('personas_workflow.' + id + '.desc missing or too short (≥ 20 chars)');
      }
    });
  } catch (e) { fail('Workflow RACI scan threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — factory pattern. Each broken body is built from flags.
// Invariant 4:  { dropCountsScan, dropTypeCheck, dropNegCheck, dropFiniteCheck }
// Invariant 9:  { dropActionsScan, dropExistence, dropCategory, dropExecSummary, dropExecLength }
// Invariant 10: { dropRACIScan, dropWFExistence, dropWFCategory, dropWFDesc, dropWFDescLength }
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyValidateDataLayer();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    // 4. getCounts() sanity
    try {
      var c = getCounts();
      if (!opts.dropCountsScan) {
        Object.keys(c).forEach(function (k) {
          var v = c[k];
          var badType = (opts.dropTypeCheck) ? false : (typeof v !== 'number');
          var badNeg  = (opts.dropNegCheck)  ? false : (v < 0);
          var badFin  = (opts.dropFiniteCheck) ? false : (!isFinite(v));
          if (badType || badNeg || badFin) {
            fail('getCounts().' + k + ' is not a non-negative number: ' + v);
          }
        });
      }
    } catch (e) { fail('getCounts() threw: ' + e.message); }

    // 9. Estratégica sub-camada
    try {
      if (!opts.dropActionsScan) {
        var expected = ['A_E1', 'A_E2', 'A_E3', 'A_E4', 'A_E5'];
        expected.forEach(function (id) {
          var e = (typeof ACTIONS === 'object' && ACTIONS !== null) ? ACTIONS[id] : null;
          if (!opts.dropExistence && !e) {
            fail('actions.' + id + ' missing (Estratégica sub-camada must have 5 entries)');
            return;
          }
          if (!opts.dropCategory && e && e.category !== 'strategic') {
            fail('actions.' + id + '.category !== "strategic": ' + e.category);
          }
          if (!opts.dropExecSummary && e && (typeof e.executiveSummary !== 'string' || (opts.dropExecLength ? false : e.executiveSummary.trim().length < 20))) {
            fail('actions.' + id + '.executiveSummary missing or too short (≥ 20 chars)');
          }
        });
      }
    } catch (e) { fail('Estratégica sub-camada scan threw: ' + e.message); }

    // 10. Workflow RACI sub-camada
    try {
      if (!opts.dropRACIScan) {
        var expectedWF = [
          'P_CONSELHO', 'P_CEO', 'P_CFO', 'P_CSO', 'P_COO', 'P_CMO',
          'P_RISK', 'P_HEAD_PROC', 'P_HEAD_ESG', 'P_HEAD_STR',
          'P_HEAD_SUPPLY', 'P_HEAD_GOV', 'P_TREASURY', 'P_GOV',
          'P_BOARD', 'P_ENG', 'P_ANALYST'
        ];
        expectedWF.forEach(function (id) {
          var e = (typeof PERSONAS_WORKFLOW === 'object' && PERSONAS_WORKFLOW !== null) ? PERSONAS_WORKFLOW[id] : null;
          if (!opts.dropWFExistence && !e) {
            fail('personas_workflow.' + id + ' missing (Workflow RACI must have 17 entries)');
            return;
          }
          if (!opts.dropWFCategory && e && e.category !== 'workflow') {
            fail('personas_workflow.' + id + '.category !== "workflow": ' + e.category);
          }
          if (!opts.dropWFDesc && e && (typeof e.desc !== 'string' || (opts.dropWFDescLength ? false : e.desc.trim().length < 20))) {
            fail('personas_workflow.' + id + '.desc missing or too short (≥ 20 chars)');
          }
        });
      }
    } catch (e) { fail('Workflow RACI scan threw: ' + e.message); }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  // Invariant 4 — getCounts() sanity
  { id: 'T1',  fn: makeBF({ dropCountsScan: true }),   target: 'F1', drop: 'inv-4: drop entire getCounts scan' },
  { id: 'T2',  fn: makeBF({ dropTypeCheck: true }),    target: 'F2', drop: 'inv-4: drop typeof === number check' },
  { id: 'T3',  fn: makeBF({ dropNegCheck: true }),     target: 'F3', drop: 'inv-4: drop v < 0 check' },
  { id: 'T4',  fn: makeBF({ dropFiniteCheck: true }),  target: 'F4', drop: 'inv-4: drop isFinite check' },
  // Invariant 9 — Estratégica sub-camada
  { id: 'T5',  fn: makeBF({ dropActionsScan: true }),  target: 'F5', drop: 'inv-9: drop entire Estratégica scan' },
  { id: 'T6',  fn: makeBF({ dropExistence: true }),    target: 'F6', drop: 'inv-9: drop !e existence check' },
  { id: 'T7',  fn: makeBF({ dropCategory: true }),     target: 'F7', drop: 'inv-9: drop category=strategic check' },
  { id: 'T8',  fn: makeBF({ dropExecSummary: true }),  target: 'F8', drop: 'inv-9: drop executiveSummary typeof check' },
  { id: 'T9',  fn: makeBF({ dropExecLength: true }),   target: 'F9', drop: 'inv-9: drop executiveSummary length ≥ 20 check' },
  // Invariant 10 — Workflow RACI sub-camada
  { id: 'T10', fn: makeBF({ dropRACIScan: true }),     target: 'F10', drop: 'inv-10: drop entire RACI scan' },
  { id: 'T11', fn: makeBF({ dropWFExistence: true }),  target: 'F11', drop: 'inv-10: drop !e existence check' },
  { id: 'T12', fn: makeBF({ dropWFCategory: true }),   target: 'F12', drop: 'inv-10: drop category=workflow check' },
  { id: 'T13', fn: makeBF({ dropWFDesc: true }),       target: 'F13', drop: 'inv-10: drop desc typeof check' },
  { id: 'T14', fn: makeBF({ dropWFDescLength: true }), target: 'F14', drop: 'inv-10: drop desc length ≥ 20 check' }
];

// ============================================================
// Fixtures (per-function probes) — each probes ONE specific break
// ============================================================
// --- getCounts() invariants (T1-T4) ---
function runF1_countsInvalidNaN(renderFn) {
  // F1: getCounts returns NaN on one field — healthy !isFinite fails; T1 (drop entire scan) misses.
  //     Note: T4 (drop isFinite) also misses, but T2/T3 still catch via type/<0.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  getCounts = function () { return { dims: 11, actions: 31, gates: NaN, personas: 5, couplings: 5, tours: 4 }; };
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F1 counts-NaN violated — expected ok=false (gates=NaN), got ok=true');
  }
  return issues;
}

function runF2_countsNonNumericString(renderFn) {
  // F2: getCounts returns string on one field. typeof check fails. typeof '5' !== 'number'.
  //     '5' < 0 = NaN comparison = false. isFinite('5') = true (coerces). So ONLY type check catches.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  getCounts = function () { return { dims: 11, actions: 31, gates: '5', personas: 5, couplings: 5, tours: 4 }; };
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F2 counts-non-numeric-string violated — expected ok=false (gates="5" non-number), got ok=true');
  }
  return issues;
}

function runF3_countsNegative(renderFn) {
  // F3: getCounts returns negative. typeof number ✓. v<0 ✓. isFinite(-5) ✓. Only <0 catches.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  getCounts = function () { return { dims: 11, actions: 31, gates: 7, personas: -2, couplings: 5, tours: 4 }; };
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F3 counts-negative violated — expected ok=false (personas=-2), got ok=true');
  }
  return issues;
}

function runF4_countsInfinity(renderFn) {
  // F4: getCounts returns Infinity. typeof number ✓. Infinity < 0 false. isFinite(Infinity) false.
  //     Only !isFinite catches.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  getCounts = function () { return { dims: 11, actions: 31, gates: 7, personas: 5, couplings: Infinity, tours: 4 }; };
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F4 counts-Infinity violated — expected ok=false (couplings=Infinity), got ok=true');
  }
  return issues;
}

// --- Estratégica invariants (T5-T9) ---
function runF5_estrategicaMissingEntry(renderFn) {
  // F5: A_E3 missing. Healthy: !e fails. T5 (drop scan) misses. T6 (drop existence) also misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  delete ACTIONS.A_E3;
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F5 estrategica-missing violated — expected ok=false (A_E3 missing), got ok=true');
  }
  return issues;
}

function runF6_estrategicaMissingEntryExistenceProbe(renderFn) {
  // F6: same as F5 — A_E3 missing. Probe specifically for dropExistence.
  resetEnv();
  ACTIONS = makeHealthyActions();
  delete ACTIONS.A_E3;
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F6 estrategica-missing-existence violated — expected ok=false (A_E3 missing), got ok=true');
  }
  return issues;
}

function runF7_estrategicaWrongCategory(renderFn) {
  // F7: A_E3 has wrong category. Existence ✓, category check fails. Only dropCategory misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  ACTIONS.A_E3.category = 'tactical';
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F7 estrategica-wrong-category violated — expected ok=false (A_E3.category="tactical"), got ok=true');
  }
  return issues;
}

function runF8_estrategicaExecSummaryNotString(renderFn) {
  // F8: A_E3 has non-string execSummary. typeof check fails. Only dropExecSummary misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  ACTIONS.A_E3.executiveSummary = 42;  // number, not string
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F8 estrategica-exec-not-string violated — expected ok=false (A_E3.executiveSummary=42), got ok=true');
  }
  return issues;
}

function runF9_estrategicaExecSummaryTooShort(renderFn) {
  // F9: A_E3 has short execSummary. typeof string ✓, length<20 ✗. Only dropExecLength misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  ACTIONS.A_E3.executiveSummary = 'short';
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F9 estrategica-exec-too-short violated — expected ok=false (A_E3.executiveSummary="short"), got ok=true');
  }
  return issues;
}

// --- RACI invariants (T10-T14) ---
function runF10_raciMissingEntry(renderFn) {
  // F10: P_CEO missing. Healthy: !e fails. T10 (drop scan) misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  delete PERSONAS_WORKFLOW.P_CEO;
  PERSONAS_WORKFLOW.length = 16;
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F10 raci-missing violated — expected ok=false (P_CEO missing), got ok=true');
  }
  return issues;
}

function runF11_raciMissingEntryExistenceProbe(renderFn) {
  // F11: same as F10 — P_CEO missing. Probe specifically for dropWFExistence.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  delete PERSONAS_WORKFLOW.P_CEO;
  PERSONAS_WORKFLOW.length = 16;
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F11 raci-missing-existence violated — expected ok=false (P_CEO missing), got ok=true');
  }
  return issues;
}

function runF12_raciWrongCategory(renderFn) {
  // F12: P_CEO has wrong category. Existence ✓, category check fails. Only dropWFCategory misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  PERSONAS_WORKFLOW.P_CEO.category = 'tactical';
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F12 raci-wrong-category violated — expected ok=false (P_CEO.category="tactical"), got ok=true');
  }
  return issues;
}

function runF13_raciDescNotString(renderFn) {
  // F13: P_CEO has non-string desc. typeof check fails. Only dropWFDesc misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  PERSONAS_WORKFLOW.P_CEO.desc = 99;  // number, not string
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F13 raci-desc-not-string violated — expected ok=false (P_CEO.desc=99), got ok=true');
  }
  return issues;
}

function runF14_raciDescTooShort(renderFn) {
  // F14: P_CEO has short desc. typeof string ✓, length<20 ✗. Only dropWFDescLength misses.
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  PERSONAS_WORKFLOW.P_CEO.desc = 'short';
  var result = renderFn();
  var issues = [];
  if (result.ok) {
    issues.push('F14 raci-desc-too-short violated — expected ok=false (P_CEO.desc="short"), got ok=true');
  }
  return issues;
}

// --- Healthy control (all data valid → ok=true) ---
function runF0_healthyControl(renderFn) {
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
  var result = renderFn();
  var issues = [];
  if (!result.ok) {
    issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
  }
  return issues;
}

var ALL_FIXTURES = [
  { id: 'F0',  fn: runF0_healthyControl,                              target_id: null },
  { id: 'F1',  fn: runF1_countsInvalidNaN,                            target_id: 'T1' },
  { id: 'F2',  fn: runF2_countsNonNumericString,                      target_id: 'T2' },
  { id: 'F3',  fn: runF3_countsNegative,                              target_id: 'T3' },
  { id: 'F4',  fn: runF4_countsInfinity,                              target_id: 'T4' },
  { id: 'F5',  fn: runF5_estrategicaMissingEntry,                     target_id: 'T5' },
  { id: 'F6',  fn: runF6_estrategicaMissingEntryExistenceProbe,       target_id: 'T6' },
  { id: 'F7',  fn: runF7_estrategicaWrongCategory,                    target_id: 'T7' },
  { id: 'F8',  fn: runF8_estrategicaExecSummaryNotString,             target_id: 'T8' },
  { id: 'F9',  fn: runF9_estrategicaExecSummaryTooShort,              target_id: 'T9' },
  { id: 'F10', fn: runF10_raciMissingEntry,                           target_id: 'T10' },
  { id: 'F11', fn: runF11_raciMissingEntryExistenceProbe,             target_id: 'T11' },
  { id: 'F12', fn: runF12_raciWrongCategory,                          target_id: 'T12' },
  { id: 'F13', fn: runF13_raciDescNotString,                          target_id: 'T13' },
  { id: 'F14', fn: runF14_raciDescTooShort,                           target_id: 'T14' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E48 — validateDataLayer() chrome hook invariant (subset 3) ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv();
  ACTIONS = makeHealthyActions();
  PERSONAS_WORKFLOW = makeHealthyPersonasWorkflow();
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