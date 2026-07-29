// e103-fixtures.js — per-function probes for E103 validateDataLayer
//
// validateDataLayer() (L608-1267) runs 18 sub-invariant checks and returns
// {ok: bool, issues: string[]}.
//
// Invariant 8 (targeted):
//   dimData[k].status must be in {green, amber, red}.
//   A broken validator that removes the `allowed` guard will surface invalid
//   statuses that would otherwise silently pass.
//
// Source — D3-PITCH-GRAPH.html L698-705 (invariant 8).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. validateDataLayer() with valid statuses → 0 issues.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    // Stub all globals that validateDataLayer reads
    global.JSON_ENVELOPE = { schema_version: 1 };
    global.SVG_ID_TO_LAYER = { S: 'signal', D: 'data', A: 'action', C: 'coupling',
      FW: 'framework', DC: 'decision', G: 'gov', LE: 'learning', OUT: 'outcome',
      T: 'trigger', GOV: 'gov' };
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
      S3: { status: 'red',   score: 30 }
    };
    global.dataNodes    = { S1: {}, S2: {}, S3: {} };
    global.decisionTrees = { DT_S3: { branches: [] }, DT_S6: { branches: [] }, DT_S7: { branches: [] } };
    global.actions = { A_E1: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E2: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E3: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E4: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E5: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' } };
    global.gates = {};
    global.personas = {};
    global.personas_workflow = {
      P_CONSELHO: { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CEO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CFO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CSO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_COO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CMO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_RISK:      { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_PROC: { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_ESG:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_STR:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_SUPPLY:{ category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_GOV:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_TREASURY:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_GOV:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_BOARD:     { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_ENG:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_ANALYST:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' }
    };
    global.couplings = [{ id: 'C-0' }];
    global.tours = [{ id: 'tour-0', name: 'Tour', duration: '30 s',
      description: 'A tour description', steps: [{ title: 'Step', desc: 'A step' }] }];
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
      'LE_S1': { ntype: 'learning', label: 'L1', name: 'LE_S1', method: 'stress', summary: 'S1 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S2': { ntype: 'learning', label: 'L2', name: 'LE_S2', method: 'stress', summary: 'S2 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S3': { ntype: 'learning', label: 'L3', name: 'LE_S3', method: 'stress', summary: 'S3 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S4': { ntype: 'learning', label: 'L4', name: 'LE_S4', method: 'stress', summary: 'S4 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S5': { ntype: 'learning', label: 'L5', name: 'LE_S5', method: 'stress', summary: 'S5 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_BT': { ntype: 'learning', label: 'BT', name: 'LE_BT', method: 'backtest', summary: 'Backtest result event recorded here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_REC':{ ntype: 'learning', label: 'RC', name: 'LE_REC', method: 'recalibration', summary: 'Recalibration event applied successfully', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_DRIFT':{ ntype: 'learning', label: 'DR', name: 'LE_DRIFT', method: 'drift', summary: 'Drift detected and handled appropriately', trigger: 't', owner: 'o', kpi: 'k' }
    };
    global.ID_PREFIXES = [
      { prefix: 'S',  owner: 'signal',     generator: 'data',               layer: 'signal' },
      { prefix: 'D',  owner: 'data',       generator: 'data',               layer: 'data' },
      { prefix: 'DC', owner: 'decision',   generator: 'decision',           layer: 'decision' },
      { prefix: 'A',  owner: 'action',     generator: 'action',             layer: 'action' },
      { prefix: 'FW', owner: 'framework',  generator: 'frameworkGate',      layer: 'framework' },
      { prefix: 'C',  owner: 'coupling',   generator: 'coupling',           layer: 'coupling' },
      { prefix: 'GOV',owner: 'gov',        generator: 'governance',         layer: 'gov' },
      { prefix: 'LE', owner: 'learning',  generator: 'learning',          layer: 'learning' },
      { prefix: 'OUT',owner: 'outcome',   generator: 'outcome',            layer: 'outcome' },
      { prefix: 'T',  owner: 'trigger',   generator: 'trigger',            layer: 'trigger' },
      { prefix: 'G',  owner: 'gov',       generator: 'governance',         layer: 'gov' }
    ];
    global.governanceAudit = [
      { id: 'GOV-AUDIT',  label: 'Audit',  r: 10, ntype: 'gov', name: 'Audit' },
      { id: 'GOV-SIGNOFF', label: 'SignOff', r: 11, ntype: 'gov', name: 'SignOff' },
      { id: 'GOV-RACI',   label: 'RACI',   r: 12, ntype: 'gov', name: 'RACI',   raciLink: 'see personas_workflow' },
      { id: 'GOV-COMPL',  label: 'Compl',   r: 13, ntype: 'gov', name: 'Compl' }
    ];

    // Stub DOM (querySelectorAll used by invariant 5)
    global.document = {
      querySelectorAll: function () { return []; }
    };
    global.localStorage = { getItem: function () { return null; } };
    global.window = {};

    deps.resetEnv();
    var result = fn();
    return result.issues;
  }

  // ============================================================
  // F1 — broken control. dimData has an invalid status 'invalid'.
  // validateDataLayer() should return issues (invariant 8 violated).
  // ============================================================
  function runF1_brokenControl(fn) {
    // Start from healthy state then corrupt dimData
    global.JSON_ENVELOPE = { schema_version: 1 };
    global.SVG_ID_TO_LAYER = { S: 'signal', D: 'data', A: 'action', C: 'coupling',
      FW: 'framework', DC: 'decision', G: 'gov', LE: 'learning', OUT: 'outcome',
      T: 'trigger', GOV: 'gov' };
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
    // T1 mutant: dimData with invalid status — breaks invariant 8
    global.dimData = {
      S1: { status: 'green',    score: 80 },
      S2: { status: 'invalid!', score: 60 },  // <- invalid status
      S3: { status: 'red',      score: 30 }
    };
    global.dataNodes    = { S1: {}, S2: {}, S3: {} };
    global.decisionTrees = { DT_S3: { branches: [] }, DT_S6: { branches: [] }, DT_S7: { branches: [] } };
    global.actions = { A_E1: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E2: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E3: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E4: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' },
                       A_E5: { category: 'strategic', executiveSummary: 'Lorem ipsum dolor sit amet cons' } };
    global.gates = {};
    global.personas = {};
    global.personas_workflow = {
      P_CONSELHO: { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CEO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CFO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CSO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_COO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_CMO:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_RISK:      { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_PROC: { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_ESG:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_STR:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_SUPPLY:{ category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_HEAD_GOV:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_TREASURY:  { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_GOV:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_BOARD:     { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_ENG:       { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' },
      P_ANALYST:   { category: 'workflow', desc: 'Lorem ipsum dolor sit amet consul' }
    };
    global.couplings = [{ id: 'C-0' }];
    global.tours = [{ id: 'tour-0', name: 'Tour', duration: '30 s',
      description: 'A tour description', steps: [{ title: 'Step', desc: 'A step' }] }];
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
      'LE_S1': { ntype: 'learning', label: 'L1', name: 'LE_S1', method: 'stress', summary: 'S1 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S2': { ntype: 'learning', label: 'L2', name: 'LE_S2', method: 'stress', summary: 'S2 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S3': { ntype: 'learning', label: 'L3', name: 'LE_S3', method: 'stress', summary: 'S3 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S4': { ntype: 'learning', label: 'L4', name: 'LE_S4', method: 'stress', summary: 'S4 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_S5': { ntype: 'learning', label: 'L5', name: 'LE_S5', method: 'stress', summary: 'S5 stress test event that happened here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_BT': { ntype: 'learning', label: 'BT', name: 'LE_BT', method: 'backtest', summary: 'Backtest result event recorded here', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_REC':{ ntype: 'learning', label: 'RC', name: 'LE_REC', method: 'recalibration', summary: 'Recalibration event applied successfully', trigger: 't', owner: 'o', kpi: 'k' },
      'LE_DRIFT':{ ntype: 'learning', label: 'DR', name: 'LE_DRIFT', method: 'drift', summary: 'Drift detected and handled appropriately', trigger: 't', owner: 'o', kpi: 'k' }
    };
    global.ID_PREFIXES = [
      { prefix: 'S',  owner: 'signal',     generator: 'data',               layer: 'signal' },
      { prefix: 'D',  owner: 'data',       generator: 'data',               layer: 'data' },
      { prefix: 'DC', owner: 'decision',   generator: 'decision',           layer: 'decision' },
      { prefix: 'A',  owner: 'action',     generator: 'action',             layer: 'action' },
      { prefix: 'FW', owner: 'framework',  generator: 'frameworkGate',      layer: 'framework' },
      { prefix: 'C',  owner: 'coupling',   generator: 'coupling',           layer: 'coupling' },
      { prefix: 'GOV',owner: 'gov',        generator: 'governance',         layer: 'gov' },
      { prefix: 'LE', owner: 'learning',  generator: 'learning',          layer: 'learning' },
      { prefix: 'OUT',owner: 'outcome',   generator: 'outcome',            layer: 'outcome' },
      { prefix: 'T',  owner: 'trigger',   generator: 'trigger',            layer: 'trigger' },
      { prefix: 'G',  owner: 'gov',       generator: 'governance',         layer: 'gov' }
    ];
    global.governanceAudit = [
      { id: 'GOV-AUDIT',  label: 'Audit',  r: 10, ntype: 'gov', name: 'Audit' },
      { id: 'GOV-SIGNOFF', label: 'SignOff', r: 11, ntype: 'gov', name: 'SignOff' },
      { id: 'GOV-RACI',   label: 'RACI',   r: 12, ntype: 'gov', name: 'RACI',   raciLink: 'see personas_workflow' },
      { id: 'GOV-COMPL',  label: 'Compl',   r: 13, ntype: 'gov', name: 'Compl' }
    ];
    global.document = { querySelectorAll: function () { return []; } };
    global.localStorage = { getItem: function () { return null; } };
    global.window = {};

    deps.resetEnv();
    var result = fn();
    return result.issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null },
    { id: 'F1', fn: runF1_brokenControl,  target_id: null }
  ];
};
