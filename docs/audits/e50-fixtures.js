// e50-fixtures.js — per-function probes for E50 validateDataLayer (subset 5)
//
// Module pattern: exports `makeFixtures(deps)` returning the ALL_FIXTURES array.
// Each fixture is a closure that captures `deps`, so it can mutate host
// globals (outcomeRegistry, learningEvents) via the setter functions supplied
// by the host. The host (e50-verify.js) defines those setters against its
// module-scope `var` bindings — which means fixture mutations propagate to
// the runner, healthyValidateDataLayer, and mutants.
//
// Fixtures (F0..F11):
//   F0  — healthy control (probes that healthy state passes)
//   F1  — outcomeRegistry with bad parentDT (probes inv-14 scan drops) → T1
//   F2  — outcomeRegistry is array (probes inv-14 type guard) — CONTROL ONLY
//         (T2 logically subsumed by T6; type-guard dropping alone cannot
//         defeat the required-IDs check. F2 retained as control to verify
//         that healthy code catches the array case end-to-end.)
//   F3  — outcomeRegistry entry missing required field → T3
//   F4  — outcomeRegistry entry with parentDT='DT_S4' (not in enum) → T4
//   F5  — outcomeRegistry missing required canvas-layer id OUT_S3_1 → T6
//   F6  — learningEvents with bad method → T7
//   F7  — learningEvents is array — CONTROL ONLY (T8 logically subsumed by T13)
//   F8  — learningEvents entry missing required field → T9
//   F9  — learningEvents entry with method='monte-carlo' (not in enum) → T10
//   F10 — learningEvents entry with summary='short' (length=5, below 8-char floor) → T11
//   F11 — learningEvents missing required id LE_S1 → T13
//
// Note on structurally unreachable mutants:
//   T5 (dropOutcomeDuplicateIds) — Object.keys(reg) returns unique keys
//   T12 (dropLEDuplicateIds)     — in JS, so the dup check never fires for
//                                  object-keyed registries. OMITTED.
'use strict';

module.exports.makeFixtures = function (deps) {
  // --- Invariant 14 — outcomeRegistry{} ---
  function runF1_outcomeRegistryBadParentDT(renderFn) {
    deps.resetEnv();
    deps.setOutcomeRegistry(deps.makeHealthyOutcomeRegistry());
    // Corrupt parentDT on OUT_S3_1 to force a fail — if the scan is dropped,
    // the corruption goes undetected. Healthy should catch it.
    deps.corruptOutcomeEntry('OUT_S3_1', { parentDT: 'DT_INVALID' });
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F1 outcomeRegistry-bad-parentDT violated — expected ok=false (parentDT=DT_INVALID on OUT_S3_1), got ok=true');
    return issues;
  }

  function runF2_outcomeRegistryIsArray(renderFn) {
    deps.resetEnv();
    deps.setOutcomeRegistry([]);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F2 outcomeRegistry-not-object violated — expected ok=false (got array), got ok=true');
    return issues;
  }

  function runF3_outcomeRegistryMissingField(renderFn) {
    deps.resetEnv();
    var reg = deps.makeHealthyOutcomeRegistry();
    // Drop required field 'probability' on OUT_S3_1.
    reg.OUT_S3_1.probability = '';
    deps.setOutcomeRegistry(reg);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F3 outcomeRegistry-missing-field violated — expected ok=false (OUT_S3_1.probability empty), got ok=true');
    return issues;
  }

  function runF4_outcomeRegistryBadParentDTEnum(renderFn) {
    deps.resetEnv();
    var reg = deps.makeHealthyOutcomeRegistry();
    reg.OUT_S6_1.parentDT = 'DT_S4';  // DT_S4 not in {DT_S3, DT_S6, DT_S7}
    deps.setOutcomeRegistry(reg);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F4 outcomeRegistry-parentDT-not-in-enum violated — expected ok=false (OUT_S6_1.parentDT=DT_S4), got ok=true');
    return issues;
  }

  function runF5_outcomeRegistryMissingRequiredId(renderFn) {
    deps.resetEnv();
    var reg = deps.makeHealthyOutcomeRegistry();
    // Rename OUT_S3_1 → OUT_S3_1_RENAMED so it doesn't count toward required-IDs.
    var renamed = reg.OUT_S3_1;
    delete reg.OUT_S3_1;
    reg.OUT_S3_1_RENAMED = renamed;
    deps.setOutcomeRegistry(reg);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F5 outcomeRegistry-missing-required-id violated — expected ok=false (OUT_S3_1 missing), got ok=true');
    return issues;
  }

  // --- Invariant 15 — learningEvents{} ---
  function runF6_learningEventsBadMethod(renderFn) {
    deps.resetEnv();
    deps.setLearningEvents(deps.makeHealthyLearningEvents());
    deps.corruptLearningEntry('LE_S1', { method: 'stress' });  // sanity seed
    deps.corruptLearningEntry('LE_S1', { method: 'totallybad' });  // override
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F6 learningEvents-bad-method violated — expected ok=false (LE_S1.method=totallybad), got ok=true');
    return issues;
  }

  function runF7_learningEventsIsArray(renderFn) {
    deps.resetEnv();
    deps.setLearningEvents([]);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F7 learningEvents-not-object violated — expected ok=false (got array), got ok=true');
    return issues;
  }

  function runF8_learningEventsMissingField(renderFn) {
    deps.resetEnv();
    var le = deps.makeHealthyLearningEvents();
    // Drop required field 'kpi' on LE_S1.
    le.LE_S1.kpi = '';
    deps.setLearningEvents(le);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F8 learningEvents-missing-field violated — expected ok=false (LE_S1.kpi empty), got ok=true');
    return issues;
  }

  function runF9_learningEventsBadMethodEnum(renderFn) {
    deps.resetEnv();
    var le = deps.makeHealthyLearningEvents();
    le.LE_BT.method = 'monte-carlo';  // not in {stress, backtest, recalibration, drift}
    deps.setLearningEvents(le);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F9 learningEvents-method-not-in-enum violated — expected ok=false (LE_BT.method=monte-carlo), got ok=true');
    return issues;
  }

  function runF10_learningEventsShortSummary(renderFn) {
    deps.resetEnv();
    var le = deps.makeHealthyLearningEvents();
    le.LE_REC.summary = 'short';  // length=5, below 8-char floor
    deps.setLearningEvents(le);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F10 learningEvents-summary-too-short violated — expected ok=false (LE_REC.summary length=5), got ok=true');
    return issues;
  }

  function runF11_learningEventsMissingRequiredId(renderFn) {
    deps.resetEnv();
    var le = deps.makeHealthyLearningEvents();
    // Rename LE_S1 → LE_S1_RENAMED so it doesn't count toward required-IDs.
    var renamed = le.LE_S1;
    delete le.LE_S1;
    le.LE_S1_RENAMED = renamed;
    deps.setLearningEvents(le);
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F11 learningEvents-missing-required-id violated — expected ok=false (LE_S1 missing), got ok=true');
    return issues;
  }

  // --- Healthy control ---
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.setOutcomeRegistry(deps.makeHealthyOutcomeRegistry());
    deps.setLearningEvents(deps.makeHealthyLearningEvents());
    var result = renderFn();
    var issues = [];
    if (!result.ok) issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
    return issues;
  }

  return [
    { id: 'F0',  fn: runF0_healthyControl,                       target_id: null },
    { id: 'F1',  fn: runF1_outcomeRegistryBadParentDT,            target_id: 'T1' },
    { id: 'F2',  fn: runF2_outcomeRegistryIsArray,                target_id: null },
    { id: 'F3',  fn: runF3_outcomeRegistryMissingField,           target_id: 'T3' },
    { id: 'F4',  fn: runF4_outcomeRegistryBadParentDTEnum,        target_id: 'T4' },
    { id: 'F5',  fn: runF5_outcomeRegistryMissingRequiredId,      target_id: 'T6' },
    { id: 'F6',  fn: runF6_learningEventsBadMethod,                target_id: 'T7' },
    { id: 'F7',  fn: runF7_learningEventsIsArray,                 target_id: null },
    { id: 'F8',  fn: runF8_learningEventsMissingField,             target_id: 'T9' },
    { id: 'F9',  fn: runF9_learningEventsBadMethodEnum,            target_id: 'T10' },
    { id: 'F10', fn: runF10_learningEventsShortSummary,            target_id: 'T11' },
    { id: 'F11', fn: runF11_learningEventsMissingRequiredId,       target_id: 'T13' }
  ];
};
