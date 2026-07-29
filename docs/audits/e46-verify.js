// e46_verify.js — validateDataLayer() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L608-619 (validateDataLayer — E8 chrome).
//
// validateDataLayer() has a multi-invariant contract returning {ok, issues}:
//   1. JSON_ENVELOPE.schema_version is a number ≥ 1
//   2. SVG_ID_TO_LAYER keys ⊆ SVG_ID_GENERATOR keys (factory coverage)
//   3. SVG IDs unique across 7 source dicts (data/dataNodes/decisionTrees/
//      actions/gates/personas/couplings/tours)
//   4. getCounts() returns non-negative numbers for every field
//   5. .layer-btn[data-layer] count == LAYER_IDS.length
//   6. .view-btn[data-view] count == VIEW_IDS.length
//   7. STATUS_THRESHOLDS.active ∈ {'legacy', 'authoritative'}
//   8. dimData[k].status ∈ {green, amber, red}
//   9. Estratégica sub-camada — 5 entries A_E1..A_E5 with category='strategic'
//  10. Workflow RACI — 17 entries P_CONSELHO..P_ANALYST
//  11. STATUS_THRESHOLDS round-trip (status matches score under active rule)
//  12. governanceAudit[] array ≥ 4 entries with required schema
//
// This E46 harness targets invariants 1, 2, 7, 8 (the simplest, most isolated
// data-validation checks). The complex ones (3, 5, 6, 9-12) require deep mock
// envs beyond the 500-line limit. Per-function grouping: each mutant drops
// ONE contract surface; each fixture probes ONE invariant.
//
// 7 mutants × 7 fixtures (per-function) + 7 controls = 14 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var JSON_ENVELOPE = { schema_version: 2 };
var SVG_ID_TO_LAYER = {};
var SVG_ID_GENERATOR = {};
var dimData = {};
var STATUS_THRESHOLDS = { active: 'authoritative' };
var failMessages = [];
var failCount = 0;

function resetEnv() {
  JSON_ENVELOPE = { schema_version: 2 };
  SVG_ID_TO_LAYER = {};
  SVG_ID_GENERATOR = {};
  dimData = {};
  STATUS_THRESHOLDS = { active: 'authoritative' };
  failMessages = [];
}

// ============================================================
// Mirror — validateDataLayer() L608-619 (HEALTHY subset)
//   Covers invariants 1 (schema_version), 2 (ID prefix coverage),
//   7 (threshold active), 8 (dimData status enum).
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 1. Schema version
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    if (typeof sv !== 'number' || sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }

  // 2. ID prefix coverage (forward: SVG_ID_TO_LAYER ⊆ SVG_ID_GENERATOR)
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }

  // 7. Threshold source-of-truth
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }

  // 8. dimData statuses are valid enum values
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_validateDataLayer() {
  // T1: drop schema_version check entirely.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

function brokenT2_validateDataLayer() {
  // T2: drop ID prefix coverage check.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    if (typeof sv !== 'number' || sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  // Drop ID prefix coverage
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

function brokenT3_validateDataLayer() {
  // T3: drop STATUS_THRESHOLDS.active enum check.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    if (typeof sv !== 'number' || sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  // Drop threshold check
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

function brokenT4_validateDataLayer() {
  // T4: drop dimData status enum check.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    if (typeof sv !== 'number' || sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  // Drop dimData status enum check
  return { ok: issues.length === 0, issues: issues };
}

function brokenT5_validateDataLayer() {
  // T5: skip `typeof sv === 'number'` check — string "2" would pass.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    // Drop typeof sv === 'number' guard — only check sv < 1
    if (sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

function brokenT6_validateDataLayer() {
  // T6: skip `sv < 1` check — only typeof check, sv=0 passes.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    // Drop sv < 1 check
    if (typeof sv !== 'number') {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k] && dimData[k].status;
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

function brokenT7_validateDataLayer() {
  // T7: drop the `dimData[k] &&` truthy check — throws on null entries, caught → caught by outer try/catch.
  if (MIRROR_REPAIRED) return healthyValidateDataLayer();
  var issues = [];
  function fail(msg) { issues.push(msg); }
  try {
    var sv = JSON_ENVELOPE && JSON_ENVELOPE.schema_version;
    if (typeof sv !== 'number' || sv < 1) {
      fail('JSON_ENVELOPE.schema_version missing or invalid: ' + sv);
    }
  } catch (e) { fail('JSON_ENVELOPE access threw: ' + e.message); }
  try {
    Object.keys(SVG_ID_TO_LAYER).forEach(function (p) {
      if (typeof SVG_ID_GENERATOR[p] !== 'function') {
        fail('SVG_ID_TO_LAYER has prefix "' + p + '" but SVG_ID_GENERATOR has no factory');
      }
    });
  } catch (e) { fail('SVG_ID_* enumeration threw: ' + e.message); }
  try {
    var st = STATUS_THRESHOLDS && STATUS_THRESHOLDS.active;
    if (st !== 'legacy' && st !== 'authoritative') {
      fail('STATUS_THRESHOLDS.active is not legacy|authoritative: ' + st);
    }
  } catch (e) { fail('STATUS_THRESHOLDS access threw: ' + e.message); }
  try {
    var allowed = { green: 1, amber: 1, red: 1 };
    Object.keys(dimData || {}).forEach(function (k) {
      var s = dimData[k].status;  // Drop truthy check — throws on null/undefined entries
      if (!allowed[s]) fail('dimData.' + k + '.status not in {green,amber,red}: ' + s);
    });
  } catch (e) { fail('dimData status scan threw: ' + e.message); }
  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_schemaVersionMissing(renderFn) {
  // F1: JSON_ENVELOPE.schema_version = 0 → issues include "schema_version missing or invalid".
  resetEnv();
  JSON_ENVELOPE.schema_version = 0;
  var result = renderFn();
  var issues = [];
  var ok = true;
  if (result.ok) {
    issues.push('F1 schema-version-missing violated — expected ok=false (schema_version=0 invalid), got ok=true');
    ok = false;
  }
  if (result.issues.length === 0 || result.issues[0].indexOf('schema_version') === -1) {
    issues.push('F1 schema-version-missing violated — expected issues[0] to mention "schema_version", got: ' + JSON.stringify(result.issues));
    ok = false;
  }
  return issues;
}

function runF2_idPrefixMissing(renderFn) {
  // F2: SVG_ID_TO_LAYER has key "orphan" but SVG_ID_GENERATOR has no factory for it → fail.
  resetEnv();
  SVG_ID_TO_LAYER = { orphan: 1 };
  SVG_ID_GENERATOR = {};
  var result = renderFn();
  var issues = [];
  var hit = result.issues.some(function (m) { return m.indexOf('orphan') !== -1; });
  if (!hit) {
    issues.push('F2 id-prefix-missing violated — expected issues to mention "orphan" prefix, got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

function runF3_thresholdInvalid(renderFn) {
  // F3: STATUS_THRESHOLDS.active = "bogus" → fail.
  resetEnv();
  STATUS_THRESHOLDS.active = 'bogus';
  var result = renderFn();
  var issues = [];
  var hit = result.issues.some(function (m) { return m.indexOf('STATUS_THRESHOLDS.active') !== -1; });
  if (!hit) {
    issues.push('F3 threshold-invalid violated — expected issues to mention "STATUS_THRESHOLDS.active", got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

function runF4_dimStatusBogus(renderFn) {
  // F4: dimData has entry with status "purple" → fail.
  resetEnv();
  dimData = { S1: { status: 'purple' } };
  var result = renderFn();
  var issues = [];
  var hit = result.issues.some(function (m) { return m.indexOf('purple') !== -1; });
  if (!hit) {
    issues.push('F4 dim-status-bogus violated — expected issues to mention "purple", got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

function runF5_schemaString(renderFn) {
  // F5: JSON_ENVELOPE.schema_version = "2" (string) → fail (typeof check).
  resetEnv();
  JSON_ENVELOPE.schema_version = '2';
  var result = renderFn();
  var issues = [];
  var hit = result.issues.some(function (m) { return m.indexOf('schema_version') !== -1; });
  if (!hit) {
    issues.push('F5 schema-string violated — expected issues to mention "schema_version" (string not number), got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

function runF6_schemaZero(renderFn) {
  // F6: JSON_ENVELOPE.schema_version = 0 → fail (sv < 1 check).
  resetEnv();
  JSON_ENVELOPE.schema_version = 0;
  var result = renderFn();
  var issues = [];
  var hit = result.issues.some(function (m) { return m.indexOf('schema_version') !== -1; });
  if (!hit) {
    issues.push('F6 schema-zero violated — expected issues to mention "schema_version" (zero < 1), got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

function runF7_dimNullEntry(renderFn) {
  // F7: dimData has null entry → fail (truthy check dropped in T7).
  resetEnv();
  dimData = { S1: null };
  var result = renderFn();
  var issues = [];
  // Healthy should NOT crash; null entries are skipped (status === undefined → fail)
  // Actually: with healthy code, null entry → s = dimData[k] && dimData[k].status = null → falsy → allowed[null] = undefined → fail
  // So healthy DOES fail with "status not in {green,amber,red}: null"
  var hit = result.issues.some(function (m) { return m.indexOf('status not in') !== -1; });
  if (!hit) {
    issues.push('F7 dim-null-entry violated — expected issues to mention "status not in" (null entry flagged), got: ' + JSON.stringify(result.issues));
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_validateDataLayer, target: 'F1', drop: 'schema_version check' },
  { id: 'T2', fn: brokenT2_validateDataLayer, target: 'F2', drop: 'ID prefix coverage check' },
  { id: 'T3', fn: brokenT3_validateDataLayer, target: 'F3', drop: 'STATUS_THRESHOLDS.active enum check' },
  { id: 'T4', fn: brokenT4_validateDataLayer, target: 'F4', drop: 'dimData status enum check' },
  { id: 'T5', fn: brokenT5_validateDataLayer, target: 'F5', drop: 'typeof sv === number guard' },
  { id: 'T6', fn: brokenT6_validateDataLayer, target: 'F6', drop: 'sv < 1 guard' },
  { id: 'T7', fn: brokenT7_validateDataLayer, target: 'F7', drop: 'dimData[k] truthy check' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_schemaVersionMissing,  target_id: 'T1' },
  { id: 'F2', fn: runF2_idPrefixMissing,       target_id: 'T2' },
  { id: 'F3', fn: runF3_thresholdInvalid,      target_id: 'T3' },
  { id: 'F4', fn: runF4_dimStatusBogus,         target_id: 'T4' },
  { id: 'F5', fn: runF5_schemaString,           target_id: 'T5' },
  { id: 'F6', fn: runF6_schemaZero,             target_id: 'T6' },
  { id: 'F7', fn: runF7_dimNullEntry,           target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E46 — validateDataLayer() chrome hook invariant ===');
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
  var pass;
  if (MIRROR_REPAIRED) {
    pass = !detected;
  } else {
    pass = detected;
  }
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