// e45_verify.js — computeCompositeScore() helper invariant
// Mirrors D3-PITCH-GRAPH.html L1350-1371 (computeCompositeScore — E7 helper).
//
// computeCompositeScore() has a pure-data contract (no DOM, returns number|null):
//   weighted average: Σ(score_d × weight_d) / Σ(weight_d)
//   over dimData entries where score AND weight are both numbers.
//   Returns null when dimData is invalid OR when no dimension has a numeric
//   score/weight pair (den === 0). D3 v2.0.1 weights (sum = 1.00):
//     S1:0.18 S2:0.16 S3:0.18 S4:0.16 S5:0.10 S6:0.10 S7:0.05 S8:0.08
//     S9:0.04 S10:0.05 S11:0.05
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

// Standard D3 v2.0.1 weights (sum = 1.00)
var D3_WEIGHTS = {
  S1: 0.18, S2: 0.16, S3: 0.18, S4: 0.16, S5: 0.10,
  S6: 0.10, S7: 0.05, S8: 0.08, S9: 0.04, S10: 0.05, S11: 0.05
};

// ============================================================
// Mirror — computeCompositeScore() L1350-1371 (HEALTHY)
// ============================================================
function healthyComputeCompositeScore() {
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s * w;
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_computeCompositeScore() {
  // T1: drop the entire body (always return 0).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  return 0;
}

function brokenT2_computeCompositeScore() {
  // T2: drop the den guard — return num even when no weights (could be NaN/0).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s * w;
      den += w;
    });
    // Drop `if (den === 0) return null;`
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

function brokenT3_computeCompositeScore() {
  // T3: skip the score type check (treats NaN/non-numbers as 0 → wrong avg).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = d.score;  // no type check
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s * w;
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

function brokenT4_computeCompositeScore() {
  // T4: skip the weight type check (treats NaN/non-numbers as 0 → wrong den).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = d.weight;  // no type check
      if (s === null || w === null) return;
      num += s * w;
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

function brokenT5_computeCompositeScore() {
  // T5: drop `num += s * w` (always returns 0 from numerator).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      // Drop num += s * w
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

function brokenT6_computeCompositeScore() {
  // T6: drop `den += w` (den stays 0 → den===0 guard catches it → returns null).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s * w;
      // Drop den += w
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

function brokenT7_computeCompositeScore() {
  // T7: replace weighted average with simple mean (drop weight from numerator).
  if (MIRROR_REPAIRED) return healthyComputeCompositeScore();
  try {
    if (typeof dimData !== 'object' || !dimData) return null;
    var num = 0, den = 0;
    Object.keys(dimData).forEach(function (k) {
      var d = dimData[k];
      if (!d) return;
      var s = (typeof d.score === 'number') ? d.score : null;
      var w = (typeof d.weight === 'number') ? d.weight : null;
      if (s === null || w === null) return;
      num += s;  // drop multiplication by w
      den += w;
    });
    if (den === 0) return null;
    return num / den;
  } catch (e) {
    console.warn('[D3 E7] computeCompositeScore failed:', e);
    return null;
  }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_returnsNullWhenNoData(renderFn) {
  // F1: dimData={} → returns null (probes T1 which returns 0).
  resetEnv();
  dimData = {};
  var result = renderFn();
  var issues = [];
  if (result !== null) {
    issues.push('F1 null-when-no-data violated — expected null, got ' + JSON.stringify(result));
  }
  return issues;
}

function runF2_returnsNullWhenDenZero(renderFn) {
  // F2: dimData with valid score but missing weight → den stays 0 → returns null
  //     (probes T2 which would return NaN from 0/0).
  resetEnv();
  dimData = {
    S1: { score: 80, status: STATUS.GREEN }  // weight missing → s OK, w null → skipped → den=0
  };
  var result = renderFn();
  var issues = [];
  if (result !== null) {
    issues.push('F2 null-when-den-zero violated — expected null (no weights), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF3_skipsNonNumericScores(renderFn) {
  // F3: dimData with 1 numeric + 1 string score → only the numeric contributes
  //     (probes T3 which treats strings as 0 → wrong avg).
  resetEnv();
  dimData = {
    S1: { score: 80, weight: 0.5 },
    S2: { score: 'foo', weight: 0.5 }  // non-numeric score → skipped
  };
  var result = renderFn();
  // Expected: only S1 contributes: (80*0.5)/0.5 = 80
  // T3 path: treats 'foo' as 0 → num = 80*0.5 = 40, den = 1.0 → 40
  var issues = [];
  if (result !== 80) {
    issues.push('F3 skips-non-numeric-scores violated — expected 80 (S1 only), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF4_skipsNonNumericWeights(renderFn) {
  // F4: dimData with 1 numeric weight + 1 string weight → only numeric contributes
  //     (probes T4 which treats strings as 0 → wrong den).
  resetEnv();
  dimData = {
    S1: { score: 80, weight: 1.0 },
    S2: { score: 60, weight: 'bar' }  // non-numeric weight → skipped
  };
  var result = renderFn();
  // Expected: only S1 contributes: (80*1.0)/1.0 = 80
  // T4 path: treats 'bar' as 0 → skipped due to w === null check (typeof 'number' fails → w=null → skipped). Same path as healthy.
  var issues = [];
  if (result !== 80) {
    issues.push('F4 skips-non-numeric-weights violated — expected 80 (S1 only), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF5_weightedAverageExact(renderFn) {
  // F5: 3 dimensions with known weights/scores → exact weighted avg
  //     (probes T5 which drops num += s*w → returns 0).
  resetEnv();
  dimData = {
    S1: { score: 80, weight: 0.5 },
    S2: { score: 60, weight: 0.3 },
    S3: { score: 100, weight: 0.2 }
  };
  // Expected: (80*0.5 + 60*0.3 + 100*0.2) / (0.5 + 0.3 + 0.2) = (40 + 18 + 20) / 1.0 = 78
  var result = renderFn();
  var issues = [];
  if (result !== 78) {
    issues.push('F5 weighted-average-exact violated — expected 78, got ' + JSON.stringify(result));
  }
  return issues;
}

function runF6_d3WeightsV201SumTo100(renderFn) {
  // F6: All 11 dims with D3 v2.0.1 weights (sum=1.00) and uniform score=80 → ≈ 80
  //     (probes T6 which drops den += w → den=0 → returns null even with all data).
  //     Floating-point: weighted sum Σ(0.18 + 0.16 + ...) accumulates FP drift, so
  //     result is 79.99999999999999 not exactly 80. Use approx-equal tolerance.
  resetEnv();
  dimData = {
    S1: { score: 80, weight: D3_WEIGHTS.S1, status: STATUS.GREEN },
    S2: { score: 80, weight: D3_WEIGHTS.S2, status: STATUS.GREEN },
    S3: { score: 80, weight: D3_WEIGHTS.S3, status: STATUS.GREEN },
    S4: { score: 80, weight: D3_WEIGHTS.S4, status: STATUS.GREEN },
    S5: { score: 80, weight: D3_WEIGHTS.S5, status: STATUS.GREEN },
    S6: { score: 80, weight: D3_WEIGHTS.S6, status: STATUS.GREEN },
    S7: { score: 80, weight: D3_WEIGHTS.S7, status: STATUS.GREEN },
    S8: { score: 80, weight: D3_WEIGHTS.S8, status: STATUS.GREEN },
    S9: { score: 80, weight: D3_WEIGHTS.S9, status: STATUS.GREEN },
    S10: { score: 80, weight: D3_WEIGHTS.S10, status: STATUS.GREEN },
    S11: { score: 80, weight: D3_WEIGHTS.S11, status: STATUS.GREEN }
  };
  // All scores 80 → weighted avg ≈ 80 (FP drift tolerance)
  var result = renderFn();
  var issues = [];
  if (Math.abs(result - 80) > 1e-9) {
    issues.push('F6 d3-weights-v201-uniform violated — expected ≈ 80 (all scores 80, ±1e-9), got ' + JSON.stringify(result));
  }
  return issues;
}

function runF7_simpleMeanNotWeighted(renderFn) {
  // F7: 3 dims with different scores & weights → weighted != simple mean
  //     (probes T7 which returns simple mean — drops multiplication by w).
  resetEnv();
  dimData = {
    S1: { score: 100, weight: 0.8 },  // high score, high weight
    S2: { score: 0,   weight: 0.1 },  // low score, low weight
    S3: { score: 50,  weight: 0.1 }
  };
  // Weighted: (100*0.8 + 0*0.1 + 50*0.1) / 1.0 = 85
  // Simple mean: (100 + 0 + 50) / 1.0 = 50  (different!)
  var result = renderFn();
  var issues = [];
  if (result !== 85) {
    issues.push('F7 simple-mean-not-weighted violated — expected 85 (weighted), got ' + JSON.stringify(result));
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_computeCompositeScore, target: 'F1', drop: 'entire body (return 0)' },
  { id: 'T2', fn: brokenT2_computeCompositeScore, target: 'F2', drop: 'den === 0 null guard' },
  { id: 'T3', fn: brokenT3_computeCompositeScore, target: 'F3', drop: 'typeof d.score === number check' },
  { id: 'T4', fn: brokenT4_computeCompositeScore, target: 'F4', drop: 'typeof d.weight === number check' },
  { id: 'T5', fn: brokenT5_computeCompositeScore, target: 'F5', drop: 'num += s * w accumulation' },
  { id: 'T6', fn: brokenT6_computeCompositeScore, target: 'F6', drop: 'den += w accumulation' },
  { id: 'T7', fn: brokenT7_computeCompositeScore, target: 'F7', drop: 'weight from numerator (simple mean)' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_returnsNullWhenNoData,     target_id: 'T1' },
  { id: 'F2', fn: runF2_returnsNullWhenDenZero,   target_id: 'T2' },
  { id: 'F3', fn: runF3_skipsNonNumericScores,    target_id: 'T3' },
  { id: 'F4', fn: runF4_skipsNonNumericWeights,   target_id: 'T4' },
  { id: 'F5', fn: runF5_weightedAverageExact,     target_id: 'T5' },
  { id: 'F6', fn: runF6_d3WeightsV201SumTo100,     target_id: 'T6' },
  { id: 'F7', fn: runF7_simpleMeanNotWeighted,    target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E45 — computeCompositeScore() helper invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-computeCompositeScore, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyComputeCompositeScore);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy computeCompositeScore) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);