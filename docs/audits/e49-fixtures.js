// e49-fixtures.js — per-function probes for E49 validateDataLayer (subset 4)
//
// Module pattern: exports `makeFixtures(deps)` returning the ALL_FIXTURES array.
// Each fixture is a closure that captures `deps`, so it can mutate host
// globals (dimData, governanceAudit, triggerRegistry, personas_workflow,
// localStorage, STATUS_THRESHOLDS) via the setter functions supplied by the
// host. The host (e49-verify.js) defines those setters against its module-
// scope `var` bindings — which means fixture mutations propagate to the
// runner, healthyValidateDataLayer, and mutants.
//
// Fixtures (F0..F18):
//   F0  — healthy control (probes that healthy state passes)
//   F1  — localStorage has invalid stored value
//   F2  — stored-value probe (alternate lens for F1)
//   F3  — dimData.S3.status='green' but score=50 (desync)
//   F4  — desync comparison probe (alternate lens for F3)
//   F5  — STATUS_THRESHOLDS.status is null (not callable)
//   F6  — governanceAudit empty array (length=0)
//   F7  — governanceAudit is not an array
//   F8  — governanceAudit length=3 (<4) — note: also fails required-IDs check
//   F9  — governanceAudit entry missing required field
//   F10 — governanceAudit has duplicate id
//   F11 — governanceAudit missing required canvas-layer id (GOV-COMPL)
//   F12 — GOV-RACI.raciLink does not mention personas_workflow
//   F13 — triggerRegistry empty object
//   F14 — triggerRegistry is array
//   F15 — triggerRegistry length=4 (<5) — also fails required-IDs check
//   F16 — triggerRegistry entry missing required field (T-5D no cadence)
//   F17 — triggerRegistry has invalid cadence enum value
//   F18 — triggerRegistry missing required id (T-Li)
'use strict';

module.exports.makeFixtures = function (deps) {
  // --- Invariant 11 — STATUS_THRESHOLDS round-trip ---
  function runF1_localStorageInvalid(renderFn) {
    deps.resetEnv();
    deps.setLocalStorageItem('d3:status_threshold', 'garbage-value');
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F1 localStorage-invalid violated — expected ok=false (stored="garbage-value"), got ok=true');
    return issues;
  }

  function runF2_localStorageStoredValueProbe(renderFn) {
    deps.resetEnv();
    deps.setLocalStorageItem('d3:status_threshold', 'garbage-value');
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F2 stored-value violated — expected ok=false (stored="garbage-value"), got ok=true');
    return issues;
  }

  function runF3_dimDataStatusDesync(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      S1: { score: 80, status: 'green' },
      S2: { score: 70, status: 'amber' },
      S3: { score: 50, status: 'green' }
    });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F3 dimData-status-desync violated — expected ok=false (S3 status=green but score=50), got ok=true');
    return issues;
  }

  function runF4_desyncCheckProbe(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      S1: { score: 80, status: 'green' },
      S2: { score: 70, status: 'amber' },
      S3: { score: 50, status: 'green' }
    });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F4 desync-comparison violated — expected ok=false (S3 desync), got ok=true');
    return issues;
  }

  function runF5_statusNotCallable(renderFn) {
    deps.resetEnv();
    // Set status function to null to simulate "not callable" — this triggers
    // the "STATUS_THRESHOLDS.status is not callable — round-trip invariant skipped"
    // failure in healthyValidateDataLayer.
    var st = deps.getSTATUS_THRESHOLDS();
    deps.setSTATUS_THRESHOLDS({ active: st.active, status: null });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F5 status-not-callable violated — expected ok=false (skipped message), got ok=true');
    return issues;
  }

  // --- Invariant 12 — governanceAudit[] ---
  function runF6_governanceAuditMissingAll(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F6 governanceAudit-empty violated — expected ok=false (length=0), got ok=true');
    return issues;
  }

  function runF7_governanceAuditNotArray(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit({ not: 'an array' });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F7 governanceAudit-not-array violated — expected ok=false (got object), got ok=true');
    return issues;
  }

  function runF8_governanceAuditTooShort(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([
      { id: 'GOV-AUDIT',   label: 'A', r: 22, ntype: 'audit',   name: 'A' },
      { id: 'GOV-SIGNOFF', label: 'B', r: 22, ntype: 'signoff', name: 'B' },
      { id: 'GOV-RACI',    label: 'C', r: 22, ntype: 'raci',    name: 'C', raciLink: 'personas_workflow[17]' }
    ]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F8 governanceAudit-too-short violated — expected ok=false (length=3), got ok=true');
    return issues;
  }

  function runF9_governanceAuditMissingField(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([
      { id: 'GOV-AUDIT',   r: 22, ntype: 'audit', name: 'Audit' }, // missing label
      { id: 'GOV-SIGNOFF', label: 'S', r: 22, ntype: 'signoff', name: 'S' },
      { id: 'GOV-RACI',    label: 'R', r: 22, ntype: 'raci', name: 'R', raciLink: 'personas_workflow[17]' },
      { id: 'GOV-COMPL',   label: 'C', r: 22, ntype: 'compl', name: 'C' }
    ]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F9 governanceAudit-missing-field violated — expected ok=false (GOV-AUDIT.label missing), got ok=true');
    return issues;
  }

  function runF10_governanceAuditDuplicateId(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([
      { id: 'GOV-AUDIT',   label: 'A', r: 22, ntype: 'audit', name: 'A' },
      { id: 'GOV-AUDIT',   label: 'A2', r: 22, ntype: 'audit', name: 'A2' }, // dup
      { id: 'GOV-SIGNOFF', label: 'S', r: 22, ntype: 'signoff', name: 'S' },
      { id: 'GOV-RACI',    label: 'R', r: 22, ntype: 'raci', name: 'R', raciLink: 'personas_workflow[17]' },
      { id: 'GOV-COMPL',   label: 'C', r: 22, ntype: 'compl', name: 'C' }
    ]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F10 governanceAudit-dup-id violated — expected ok=false (dup "GOV-AUDIT"), got ok=true');
    return issues;
  }

  function runF11_governanceAuditMissingRequiredId(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([
      { id: 'GOV-AUDIT',   label: 'A', r: 22, ntype: 'audit', name: 'A' },
      { id: 'GOV-SIGNOFF', label: 'S', r: 22, ntype: 'signoff', name: 'S' },
      { id: 'GOV-RACI',    label: 'R', r: 22, ntype: 'raci', name: 'R', raciLink: 'personas_workflow[17]' },
      { id: 'GOV-EXTRA',   label: 'X', r: 22, ntype: 'extra', name: 'X' } // GOV-COMPL missing
    ]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F11 governanceAudit-missing-required-id violated — expected ok=false (GOV-COMPL missing), got ok=true');
    return issues;
  }

  function runF12_governanceAuditRaciLinkMissingWorkflow(renderFn) {
    deps.resetEnv();
    deps.setGovernanceAudit([
      { id: 'GOV-AUDIT',   label: 'A', r: 22, ntype: 'audit', name: 'A' },
      { id: 'GOV-SIGNOFF', label: 'S', r: 22, ntype: 'signoff', name: 'S' },
      { id: 'GOV-RACI',    label: 'R', r: 22, ntype: 'raci', name: 'R', raciLink: 'just some text' }, // missing personas_workflow
      { id: 'GOV-COMPL',   label: 'C', r: 22, ntype: 'compl', name: 'C' }
    ]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F12 governanceAudit-raciLink-no-workflow violated — expected ok=false (link missing personas_workflow), got ok=true');
    return issues;
  }

  // --- Invariant 13 — triggerRegistry{} ---
  function runF13_triggerRegistryEmpty(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry({});
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F13 triggerRegistry-empty violated — expected ok=false (length=0), got ok=true');
    return issues;
  }

  function runF14_triggerRegistryIsArray(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry([]);
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F14 triggerRegistry-not-object violated — expected ok=false (got array), got ok=true');
    return issues;
  }

  function runF15_triggerRegistryTooShort(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry({
      'T-AMBER': { ntype: 'trigger', label: 'AMBER', name: 'AMBER', cadence: 'intraday' },
      'T-S7':    { ntype: 'trigger', label: 'S7',    name: 'S7',    cadence: 'real-time' },
      'T-HYST':  { ntype: 'trigger', label: 'HYST',  name: 'HYST',  cadence: 'continuous' },
      'T-5D':    { ntype: 'trigger', label: '5D',    name: '5D',    cadence: 'every 5d' }
    });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F15 triggerRegistry-too-short violated — expected ok=false (length=4), got ok=true');
    return issues;
  }

  function runF16_triggerRegistryMissingField(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry({
      'T-AMBER': { ntype: 'trigger', label: 'AMBER', name: 'AMBER', cadence: 'intraday' },
      'T-S7':    { ntype: 'trigger', label: 'S7',    name: 'S7',    cadence: 'real-time' },
      'T-HYST':  { ntype: 'trigger', label: 'HYST',  name: 'HYST',  cadence: 'continuous' },
      'T-5D':    { ntype: 'trigger', label: '5D',    name: '5D' }, // missing cadence
      'T-Li':    { ntype: 'trigger', label: 'Li',    name: 'Li',    cadence: 'weekly' }
    });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F16 triggerRegistry-missing-field violated — expected ok=false (T-5D missing cadence), got ok=true');
    return issues;
  }

  function runF17_triggerRegistryBadCadence(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry({
      'T-AMBER': { ntype: 'trigger', label: 'AMBER', name: 'AMBER', cadence: 'intraday' },
      'T-S7':    { ntype: 'trigger', label: 'S7',    name: 'S7',    cadence: 'real-time' },
      'T-HYST':  { ntype: 'trigger', label: 'HYST',  name: 'HYST',  cadence: 'continuous' },
      'T-5D':    { ntype: 'trigger', label: '5D',    name: '5D',    cadence: 'every 5d' },
      'T-Li':    { ntype: 'trigger', label: 'Li',    name: 'Li',    cadence: 'biyearly' } // not in enum
    });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F17 triggerRegistry-bad-cadence violated — expected ok=false (T-Li cadence="biyearly"), got ok=true');
    return issues;
  }

  function runF18_triggerRegistryMissingRequiredId(renderFn) {
    deps.resetEnv();
    deps.setTriggerRegistry({
      'T-AMBER': { ntype: 'trigger', label: 'AMBER', name: 'AMBER', cadence: 'intraday' },
      'T-S7':    { ntype: 'trigger', label: 'S7',    name: 'S7',    cadence: 'real-time' },
      'T-HYST':  { ntype: 'trigger', label: 'HYST',  name: 'HYST',  cadence: 'continuous' },
      'T-5D':    { ntype: 'trigger', label: '5D',    name: '5D',    cadence: 'every 5d' },
      'T-EXTRA': { ntype: 'trigger', label: 'X',     name: 'X',     cadence: 'weekly' } // T-Li missing
    });
    deps.setDimData({ S1: { score: 80, status: 'green' }, S2: { score: 70, status: 'amber' }, S3: { score: 50, status: 'red' } });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (result.ok) issues.push('F18 triggerRegistry-missing-required-id violated — expected ok=false (T-Li missing), got ok=true');
    return issues;
  }

  // --- Healthy control ---
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      S1: { score: 80, status: 'green' },
      S2: { score: 70, status: 'amber' },
      S3: { score: 50, status: 'red' }
    });
    deps.setGovernanceAudit(deps.makeHealthyGovernanceAudit());
    deps.setTriggerRegistry(deps.makeHealthyTriggerRegistry());
    deps.setPersonasWorkflow(deps.makeHealthyPersonasWorkflow());
    deps.setLocalStorageItem('d3:status_threshold', 'authoritative');
    var result = renderFn();
    var issues = [];
    if (!result.ok) issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
    return issues;
  }

  return [
    { id: 'F0',  fn: runF0_healthyControl,                              target_id: null },
    { id: 'F1',  fn: runF1_localStorageInvalid,                         target_id: 'T1' },
    { id: 'F2',  fn: runF2_localStorageStoredValueProbe,                target_id: 'T2' },
    { id: 'F3',  fn: runF3_dimDataStatusDesync,                         target_id: 'T3' },
    { id: 'F4',  fn: runF4_desyncCheckProbe,                            target_id: 'T4' },
    { id: 'F5',  fn: runF5_statusNotCallable,                           target_id: 'T5' },
    { id: 'F6',  fn: runF6_governanceAuditMissingAll,                   target_id: 'T6' },
    { id: 'F7',  fn: runF7_governanceAuditNotArray,                     target_id: 'T7' },
    { id: 'F8',  fn: runF8_governanceAuditTooShort,                     target_id: 'T8' },
    { id: 'F9',  fn: runF9_governanceAuditMissingField,                 target_id: 'T9' },
    { id: 'F10', fn: runF10_governanceAuditDuplicateId,                 target_id: 'T10' },
    { id: 'F11', fn: runF11_governanceAuditMissingRequiredId,           target_id: 'T11' },
    { id: 'F12', fn: runF12_governanceAuditRaciLinkMissingWorkflow,     target_id: 'T12' },
    { id: 'F13', fn: runF13_triggerRegistryEmpty,                       target_id: 'T13' },
    { id: 'F14', fn: runF14_triggerRegistryIsArray,                     target_id: 'T14' },
    { id: 'F15', fn: runF15_triggerRegistryTooShort,                    target_id: 'T15' },
    { id: 'F16', fn: runF16_triggerRegistryMissingField,                target_id: 'T16' },
    { id: 'F17', fn: runF17_triggerRegistryBadCadence,                  target_id: 'T17' },
    { id: 'F18', fn: runF18_triggerRegistryMissingRequiredId,           target_id: 'T18' }
  ];
};