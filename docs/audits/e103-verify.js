// e103-verify.js — validateDataLayer() invariant harness
//
// Mirrors D3-PITCH-GRAPH.html L608-1267 (validateDataLayer —
// runs 18 sub-invariant checks, returns {ok, issues: string[]}).
//
// Invariant 8 (targeted):
//   dimData[k].status must be in {green, amber, red}.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment (minimal stubs — validateDataLayer reads globals)
// ============================================================

var _issues = [];

function resetEnv() {
  _issues = [];
}

function getSnapshot() {
  return { issues: _issues.slice() };
}

var mockEnvelope = {
  schema_version: 1,
  meta_version: '1.0',
  build_date: '2026-07-27'
};

global.JSON_ENVELOPE = mockEnvelope;
global.SVG_ID_TO_LAYER = {
  S: 'signal', D: 'data', A: 'action', C: 'coupling',
  FW: 'framework', DC: 'decision', G: 'gov', LE: 'learning',
  OUT: 'outcome', T: 'trigger', GOV: 'gov'
};
global.SVG_ID_GENERATOR = {
  data: function (k) { return 'D-' + k; },
  decision: function (k) { return 'DC-' + k; },
  action: function (k) { return 'A-' + k; },
  frameworkGate: function (k) { return 'FW-G' + k; },
  frameworkPersona: function (k) { return 'FW-P' + k; },
  coupling: function (i) { return 'C-' + i; }
};
global.LAYER_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
global.VIEW_IDS = ['overview', 'signals', 'decisions', 'actions'];
global.STATUS_THRESHOLDS = {
  active: 'authoritative',
  status: function (score) {
    if (score >= 65) return 'green';
    if (score >= 50) return 'amber';
    return 'red';
  }
};
global.dimData = {
  S1: { status: 'green', score: 80 },
  S2: { status: 'amber', score: 60 },
  S3: { status: 'red', score: 30 }
};
global.dataNodes = { S1: {}, S2: {}, S3: {} };
global.decisionTrees = {
  DT_S3: { branches: [] },
  DT_S6: { branches: [] },
  DT_S7: { branches: [] }
};
global.actions = {
  A_E1: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
  A_E2: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
  A_E3: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
  A_E4: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
  A_E5: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' }
};
global.gates = {};
global.personas = {};
global.personas_workflow = {
  P_CONSELHO:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_CEO:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_CFO:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_CSO:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_COO:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_CMO:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_RISK:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_HEAD_PROC:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_HEAD_ESG:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_HEAD_STR:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_HEAD_SUPPLY:{ category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_HEAD_GOV:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_TREASURY:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_GOV:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_BOARD:      { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_ENG:        { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
  P_ANALYST:    { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' }
};
global.couplings = [{ id: 'C-0' }];
global.tours = [{
  id: 'tour-0', name: 'Tour', duration: '30 s',
  description: 'A tour description',
  steps: [{ title: 'Step', desc: 'A step' }]
}];
global.triggerRegistry = {
  'T-AMBER': { ntype: 'trigger', label: 'Amber', name: 'T-Amber', cadence: 'intraday' },
  'T-S7':    { ntype: 'trigger', label: 'S7',    name: 'T-S7',    cadence: 'real-time' },
  'T-HYST':  { ntype: 'trigger', label: 'Hyst',  name: 'T-HYST',  cadence: 'continuous' },
  'T-5D':    { ntype: 'trigger', label: '5D',    name: 'T-5D',    cadence: 'every 5d' },
  'T-Li':    { ntype: 'trigger', label: 'Li',    name: 'T-Li',    cadence: 'weekly' }
};
global.outcomeRegistry = {
  'OUT_S3_1': { ntype: 'outcome', label: 'O1', name: 'OUT_S3_1', parentDT: 'DT_S3', probability: 0.3 },
  'OUT_S3_2': { ntype: 'outcome', label: 'O2', name: 'OUT_S3_2', parentDT: 'DT_S3', probability: 0.4 },
  'OUT_S3_3': { ntype: 'outcome', label: 'O3', name: 'OUT_S3_3', parentDT: 'DT_S3', probability: 0.3 },
  'OUT_S6_1': { ntype: 'outcome', label: 'O4', name: 'OUT_S6_1', parentDT: 'DT_S6', probability: 0.5 },
  'OUT_S6_2': { ntype: 'outcome', label: 'O5', name: 'OUT_S6_2', parentDT: 'DT_S6', probability: 0.3 },
  'OUT_S6_3': { ntype: 'outcome', label: 'O6', name: 'OUT_S6_3', parentDT: 'DT_S6', probability: 0.2 },
  'OUT_S7_1': { ntype: 'outcome', label: 'O7', name: 'OUT_S7_1', parentDT: 'DT_S7', probability: 0.6 },
  'OUT_S7_2': { ntype: 'outcome', label: 'O8', name: 'OUT_S7_2', parentDT: 'DT_S7', probability: 0.4 }
};
global.learningEvents = {
  'LE_S1':   { ntype: 'learning', label: 'L1',  name: 'LE_S1',   method: 'stress',       summary: 'S1 stress test event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_S2':   { ntype: 'learning', label: 'L2',  name: 'LE_S2',   method: 'stress',       summary: 'S2 stress test event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_S3':   { ntype: 'learning', label: 'L3',  name: 'LE_S3',   method: 'stress',       summary: 'S3 stress test event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_S4':   { ntype: 'learning', label: 'L4',  name: 'LE_S4',   method: 'stress',       summary: 'S4 stress test event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_S5':   { ntype: 'learning', label: 'L5',  name: 'LE_S5',   method: 'stress',       summary: 'S5 stress test event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_BT':   { ntype: 'learning', label: 'BT',  name: 'LE_BT',   method: 'backtest',     summary: 'Backtest result event',        trigger: 't', owner: 'o', kpi: 'k' },
  'LE_REC':  { ntype: 'learning', label: 'RC',  name: 'LE_REC',  method: 'recalibration', summary: 'Recalibration event',         trigger: 't', owner: 'o', kpi: 'k' },
  'LE_DRIFT':{ ntype: 'learning', label: 'DR',  name: 'LE_DRIFT',method: 'drift',         summary: 'Drift detected event',        trigger: 't', owner: 'o', kpi: 'k' }
};
global.ID_PREFIXES = [
  { prefix: 'S',   owner: 'signal',     generator: 'data',           layer: 'signal' },
  { prefix: 'D',   owner: 'data',       generator: 'data',           layer: 'data' },
  { prefix: 'DC',  owner: 'decision',   generator: 'decision',       layer: 'decision' },
  { prefix: 'A',   owner: 'action',     generator: 'action',         layer: 'action' },
  { prefix: 'FW',  owner: 'framework',  generator: 'frameworkGate',   layer: 'framework' },
  { prefix: 'C',   owner: 'coupling',   generator: 'coupling',       layer: 'coupling' },
  { prefix: 'GOV', owner: 'gov',        generator: 'governance',     layer: 'gov' },
  { prefix: 'LE',  owner: 'learning',  generator: 'learning',       layer: 'learning' },
  { prefix: 'OUT', owner: 'outcome',   generator: 'outcome',         layer: 'outcome' },
  { prefix: 'T',   owner: 'trigger',   generator: 'trigger',         layer: 'trigger' },
  { prefix: 'G',   owner: 'gov',        generator: 'governance',     layer: 'gov' }
];
global.governanceAudit = [
  { id: 'GOV-AUDIT',   label: 'Audit',   r: 10, ntype: 'gov', name: 'Audit' },
  { id: 'GOV-SIGNOFF', label: 'SignOff', r: 11, ntype: 'gov', name: 'SignOff' },
  { id: 'GOV-RACI',    label: 'RACI',    r: 12, ntype: 'gov', name: 'RACI',   raciLink: 'see personas_workflow' },
  { id: 'GOV-COMPL',   label: 'Compl',   r: 13, ntype: 'gov', name: 'Compl' }
];
global.document = { querySelectorAll: function () { return []; } };
global.localStorage = { getItem: function () { return null; } };
global.window = {};

// ============================================================
// Healthy validateDataLayer — mirrors L608-1267
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  try {
    var allowedStatuses = { green: true, amber: true, red: true };
    var validNtypes = { signal: true, data: true, action: true, coupling: true,
      framework: true, decision: true, gov: true, learning: true,
      outcome: true, trigger: true };
    var validCategories = { strategic: true, framework: true, workflow: true, meta: true };

    // Invariant 1 — JSON_ENVELOPE
    if (!JSON_ENVELOPE || typeof JSON_ENVELOPE.schema_version === 'undefined') {
      issues.push('E1: JSON_ENVELOPE missing schema_version');
    }

    // Invariant 2 — dimData
    if (!dimData) { issues.push('E2: dimData missing'); }
    else {
      for (var k in dimData) {
        if (!dimData[k] || typeof dimData[k].status === 'undefined') {
          issues.push('E2: dimData[' + k + '] missing status');
        } else if (!allowedStatuses[dimData[k].status]) {
          issues.push('E2: dimData[' + k + '].status="' + dimData[k].status + '" not in {green,amber,red}');
        }
      }
    }

    // Invariant 3 — dataNodes
    if (!dataNodes) { issues.push('E3: dataNodes missing'); }

    // Invariant 4 — decisionTrees
    if (!decisionTrees) { issues.push('E4: decisionTrees missing'); }
    else {
      for (var dt in decisionTrees) {
        if (!decisionTrees[dt] || !Array.isArray(decisionTrees[dt].branches)) {
          issues.push('E4: decisionTrees[' + dt + '] missing branches array');
        }
      }
    }

    // Invariant 5 — DOM IDs
    var _sel = typeof document !== 'undefined' && document.querySelectorAll
      ? document.querySelectorAll('[id]')
      : [];
    var ids = [];
    for (var ii = 0; ii < _sel.length; ii++) ids.push(_sel[ii].id);

    // Invariant 6 — actions A_E1..A_E5
    for (var aei = 1; aei <= 5; aei++) {
      var aek = 'A_E' + aei;
      if (!actions[aek]) issues.push('E6: actions.' + aek + ' missing');
      else {
        if (!actions[aek].category || !validCategories[actions[aek].category]) {
          issues.push('E6: actions.' + aek + ' invalid category');
        }
      }
    }

    // Invariant 7 — gates
    // (skipped — gates can be empty)

    // Invariant 8 — dimData statuses
    // Already covered in E2 above

    // Invariant 9 — Estratégica: actions A_E1..A_E5 with category='strategic' + executiveSummary >= 20
    try {
      var expectedKeys = ['A_E1', 'A_E2', 'A_E3', 'A_E4', 'A_E5'];
      expectedKeys.forEach(function (id) {
        var e = (typeof actions === 'object' && actions !== null) ? actions[id] : null;
        if (!e) { issues.push('E9: actions.' + id + ' missing'); return; }
        if (e.category !== 'strategic') issues.push('E9: actions.' + id + '.category !== "strategic"');
        if (typeof e.executiveSummary !== 'string' || e.executiveSummary.trim().length < 20) issues.push('E9: actions.' + id + '.executiveSummary too short');
      });
    } catch (e) { issues.push('E9: threw: ' + e.message); }

    // Invariant 10 — Workflow RACI: personas_workflow P_* with category='workflow' + desc >= 20
    try {
      var expectedWF = ['P_CONSELHO','P_CEO','P_CFO','P_CSO','P_COO','P_CMO',
        'P_RISK','P_HEAD_PROC','P_HEAD_ESG','P_HEAD_STR','P_HEAD_SUPPLY',
        'P_HEAD_GOV','P_TREASURY','P_GOV','P_BOARD','P_ENG','P_ANALYST'];
      expectedWF.forEach(function (id) {
        var e = (typeof personas_workflow === 'object' && personas_workflow !== null) ? personas_workflow[id] : null;
        if (!e) { issues.push('E10: personas_workflow.' + id + ' missing'); return; }
        if (e.category !== 'workflow') issues.push('E10: personas_workflow.' + id + '.category !== "workflow"');
        if (typeof e.desc !== 'string' || e.desc.trim().length < 20) issues.push('E10: personas_workflow.' + id + '.desc too short');
      });
    } catch (e) { issues.push('E10: threw: ' + e.message); }

    // Invariant 11 — couplings
    if (!couplings || couplings.length === 0) issues.push('E11: couplings empty');

    // Invariant 12 — tours
    if (!tours || tours.length === 0) issues.push('E12: tours empty');

    // Invariant 13 — triggerRegistry
    var triggerKeys = ['T-AMBER', 'T-S7', 'T-HYST', 'T-5D', 'T-Li'];
    for (var ti = 0; ti < triggerKeys.length; ti++) {
      if (!triggerRegistry[triggerKeys[ti]]) {
        issues.push('E13: triggerRegistry missing "' + triggerKeys[ti] + '"');
      }
    }

    // Invariant 14 — outcomeRegistry
    var outcomeKeys = ['OUT_S3_1', 'OUT_S3_2', 'OUT_S3_3', 'OUT_S6_1', 'OUT_S6_2', 'OUT_S6_3', 'OUT_S7_1', 'OUT_S7_2'];
    for (var oi = 0; oi < outcomeKeys.length; oi++) {
      if (!outcomeRegistry[outcomeKeys[oi]]) {
        issues.push('E14: outcomeRegistry missing "' + outcomeKeys[oi] + '"');
      }
    }

    // Invariant 15 — learningEvents
    var leKeys = ['LE_S1', 'LE_S2', 'LE_S3', 'LE_S4', 'LE_S5', 'LE_BT', 'LE_REC', 'LE_DRIFT'];
    for (var li = 0; li < leKeys.length; li++) {
      if (!learningEvents[leKeys[li]]) {
        issues.push('E15: learningEvents missing "' + leKeys[li] + '"');
      }
    }

    // Invariant 16 — ID_PREFIXES × sub-checks
    for (var pi = 0; pi < ID_PREFIXES.length; pi++) {
      var p = ID_PREFIXES[pi];
      if (!p.prefix) issues.push('E16: ID_PREFIXES[' + pi + '] missing prefix');
      if (!p.owner)  issues.push('E16: ID_PREFIXES[' + pi + '] missing owner');
      if (!p.layer)  issues.push('E16: ID_PREFIXES[' + pi + '] missing layer');
      if (!p.generator) issues.push('E16: ID_PREFIXES[' + pi + '] missing generator');
    }

    // Invariant 17 — tours schema (skipped in Node — needs DOM)

    // Invariant 18 — governanceAudit
    if (!governanceAudit || governanceAudit.length < 4) {
      issues.push('E18: governanceAudit count=' + (governanceAudit ? governanceAudit.length : 0) + ' (want >=4)');
    }

  } catch (e) {
    issues.push('E0: validateDataLayer threw: ' + e.message);
  }

  global.__d3_validation = { ok: issues.length === 0, issues: issues };
  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutant — T1: dimData S2 has invalid status 'invalid!'
// (breaks invariant 8 / E2, which checks dimData[k].status)
// ============================================================
function brokenValidateDataLayer() {
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();

  // Corrupt dimData S2 — invariant 8 will flag it
  global.dimData.S2 = { status: 'invalid!', score: 60 };

  return healthyValidateDataLayer();
}

var MUTANTS = [
  { id: 'T1', fn: brokenValidateDataLayer, target: 'F0', drop: 'dimData.S2 status (invariant 8/E2)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e103-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({ resetEnv: resetEnv });

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E103 — validateDataLayer() invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
  resetEnv();
  var mutantIssues = [];
  var fix = ALL_FIXTURES.find(function (f) { return f.id === mutant.target; });
  if (fix) {
    // F0 sets healthy dimData; broken fn corrupts S2 before calling validateDataLayer
    var issues = fix.fn(mutant.fn);
    mutantIssues = mutantIssues.concat(issues);
  }
  totalReports++;
  var detected = mutantIssues.length > 0;
  var pass = MIRROR_REPAIRED ? !detected : detected;
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (brokenValidateDataLayer, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  // Skip broken fixtures — only healthy controls belong in the control group
  if (fix.id === 'F1') return;
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
