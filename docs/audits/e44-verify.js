// e44_verify.js — countRedDims() helper invariant
// Mirrors D3-PITCH-GRAPH.html L1376-1388 (countRedDims — E7 helper).
//
// countRedDims() has a pure-data contract (no DOM, returns number|null):
//   n = count of dimData[k] entries whose status === STATUS.RED
//   null when dimData missing/invalid
//
// Per-function grouping: each mutant targets ONE contract surface; each fixture
// probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 7 controls = 14 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red' };
var dimData = {};

function resetEnv() {
  dimData = {};
}

// ============================================================
// Mirror — countRedDims() L1376-1388 (HEALTHY)
// ============================================================
function healthyCountRedDims() {
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.RED) n++;
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_countRedDims() {
  // T1: drop entire body (always return 0).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  return 0;
}

function brokenT2_countRedDims() {
  // T2: drop `dimData[k] &&` truthy check (throws on null entries, caught → null).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k].status === STATUS.RED) n++;
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

function brokenT3_countRedDims() {
  // T3: drop `&& dimData[k].status === STATUS.RED` (count all entries regardless of status).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k]) n++;
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

function brokenT4_countRedDims() {
  // T4: replace STATUS.RED with STATUS.GREEN (counts greens instead of reds).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.GREEN) n++;
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

function brokenT5_countRedDims() {
  // T5: drop `n++` (always returns 0).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.RED) {
        // Drop n++ — do nothing
      }
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

function brokenT6_countRedDims() {
  // T6: drop `var n = 0` initialization (n is undefined → n++ = NaN).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n;  // undefined
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.RED) n++;
    });
    return n;
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

function brokenT7_countRedDims() {
  // T7: drop `return n` (function falls off → returns undefined).
  if (MIRROR_REPAIRED) return healthyCountRedDims();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var n = 0;
    Object.keys(dimData).forEach(function (k) {
      if (dimData[k] && dimData[k].status === STATUS.RED) n++;
    });
    // Drop return n — function returns undefined
  } catch (e) {
    console.warn('[D3 E7] countRedDims failed:', e);
    return null;
  }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_countThreeReds(renderFn) {
  // F1: dimData with 3 REDs → returns 3 (probes T1 which always returns 0).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F1 count-three-reds violated — expected 3 REDs, got ' + JSON.stringify(result));
  }
  return issues;
}

function runF2_countWithNullEntries(renderFn) {
  // F2: dimData with 1 null + 3 REDs → returns 3 (probes T2 which throws on null → null).
  resetEnv();
  dimData = {
    a: null,
    b: { status: STATUS.RED },
    c: { status: STATUS.RED },
    d: { status: STATUS.RED }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F2 count-with-null-entries violated — expected 3 REDs (skipping null), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF3_countOnlyRedsAmongOthers(renderFn) {
  // F3: dimData with 3 REDs + 2 GREENs → returns 3 (probes T3 which counts all → 5).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED },
    d: { status: STATUS.GREEN },
    e: { status: STATUS.GREEN }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F3 count-only-reds-among-others violated — expected 3 REDs (not 5), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF4_countGreensNotReds(renderFn) {
  // F4: dimData with 3 REDs + 2 GREENs → returns 3 (probes T4 STATUS.GREEN which gives 2).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED },
    d: { status: STATUS.GREEN },
    e: { status: STATUS.GREEN }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F4 count-greens-not-reds violated — expected 3 REDs (not 2 greens), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF5_countNoIncrement(renderFn) {
  // F5: dimData with 3 REDs → returns 3 (probes T5 drop n++ which gives 0).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F5 count-no-increment violated — expected 3 REDs (not 0), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF6_countUninitialized(renderFn) {
  // F6: dimData with 3 REDs → returns 3 (probes T6 uninitialized n which gives NaN).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F6 count-uninitialized violated — expected 3 REDs (not NaN), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF7_countNoReturn(renderFn) {
  // F7: dimData with 3 REDs → returns 3 (probes T7 drop return which gives undefined).
  resetEnv();
  dimData = {
    a: { status: STATUS.RED },
    b: { status: STATUS.RED },
    c: { status: STATUS.RED }
  };
  var result = renderFn();
  var issues = [];
  if (result !== 3) {
    issues.push('F7 count-no-return violated — expected 3 REDs (not undefined), got ' + JSON.stringify(result));
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_countRedDims, target: 'F1', drop: 'entire body (return 0)' },
  { id: 'T2', fn: brokenT2_countRedDims, target: 'F2', drop: 'dimData[k] truthy check' },
  { id: 'T3', fn: brokenT3_countRedDims, target: 'F3', drop: 'status === STATUS.RED filter' },
  { id: 'T4', fn: brokenT4_countRedDims, target: 'F4', drop: 'STATUS.RED (replaced with STATUS.GREEN)' },
  { id: 'T5', fn: brokenT5_countRedDims, target: 'F5', drop: 'n++ increment' },
  { id: 'T6', fn: brokenT6_countRedDims, target: 'F6', drop: 'var n = 0 initialization' },
  { id: 'T7', fn: brokenT7_countRedDims, target: 'F7', drop: 'return n' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_countThreeReds,             target_id: 'T1' },
  { id: 'F2', fn: runF2_countWithNullEntries,       target_id: 'T2' },
  { id: 'F3', fn: runF3_countOnlyRedsAmongOthers,   target_id: 'T3' },
  { id: 'F4', fn: runF4_countGreensNotReds,         target_id: 'T4' },
  { id: 'F5', fn: runF5_countNoIncrement,           target_id: 'T5' },
  { id: 'F6', fn: runF6_countUninitialized,         target_id: 'T6' },
  { id: 'F7', fn: runF7_countNoReturn,              target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E44 — countRedDims() helper invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-countRedDims, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyCountRedDims);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy countRedDims) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);