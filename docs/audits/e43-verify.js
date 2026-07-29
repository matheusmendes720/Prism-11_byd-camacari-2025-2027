// e43_verify.js — renderTourSelectorCount() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L1569-1578 (renderTourSelectorCount — E4 chrome).
//
// renderTourSelectorCount() has 1 sub-render contract guarded by try/catch:
//   (1) tour-selector-count — textContent = String((typeof tours !== 'undefined' && tours.length) || 0)
//
// Per-function grouping: each mutant targets ONE contract surface; each fixture
// probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 7 controls = 14 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var mockDocument = {
  _els: {},
  getElementById: function (id) {
    if (!this._els[id]) this._els[id] = { textContent: '' };
    return this._els[id];
  },
  reset: function () { this._els = {}; }
};

var tours = [];  // reset per-fixture

function resetEnv() {
  mockDocument.reset();
  tours = [];
}

// ============================================================
// Mirror — renderTourSelectorCount() L1569-1578 (HEALTHY)
// ============================================================
function healthyRenderTourSelectorCount() {
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = (typeof tours !== 'undefined' && tours.length) || 0;
    el.textContent = String(n);
  } catch (e) {
    console.warn('[D3 E4] renderTourSelectorCount failed:', e);
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_renderTourSelectorCount() {
  // T1: drop the entire tour-selector-count sub-render (element never populated).
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  // No-op
}

function brokenT2_renderTourSelectorCount() {
  // T2: drop `&& tours.length` — textContent becomes "true"/"false".
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = (typeof tours !== 'undefined') || 0;
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

function brokenT3_renderTourSelectorCount() {
  // T3: drop `|| 0` fallback — textContent = String(undefined) = "undefined" when tours is undefined.
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = (typeof tours !== 'undefined' && tours.length);
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

function brokenT4_renderTourSelectorCount() {
  // T4: hardcode n = 0 (drop tours.length lookup entirely).
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = 0;
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

function brokenT5_renderTourSelectorCount() {
  // T5: drop `typeof tours !== 'undefined'` guard — throws if tours undefined, caught silently.
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = (tours.length) || 0;
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

function brokenT6_renderTourSelectorCount() {
  // T6: drop `if (!el) return;` guard AND skip getElementById (textContent never set on mock element).
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    // Skip getElementById — local el, mockDocument._els never populated
    var n = (typeof tours !== 'undefined' && tours.length) || 0;
    var el = { textContent: '' };
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

function brokenT7_renderTourSelectorCount() {
  // T7: hardcode n = 99 (drop tours.length lookup, always reports 99).
  if (MIRROR_REPAIRED) return healthyRenderTourSelectorCount();
  try {
    var el = mockDocument.getElementById('tour-selector-count');
    if (!el) return;
    var n = 99;
    el.textContent = String(n);
  } catch (e) { console.warn('[D3 E4] renderTourSelectorCount failed:', e); }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_countPopulated(renderFn) {
  // F1: tour-selector-count element populated (not empty).
  resetEnv();
  tours = ['tour-a', 'tour-b', 'tour-c'];
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F1 count-populated violated — #tour-selector-count element never created');
  } else if (!el.textContent || el.textContent.length === 0) {
    issues.push('F1 count-populated violated — #tour-selector-count textContent is empty');
  }
  return issues;
}

function runF2_countFromArray(renderFn) {
  // F2: tours=[a,b,c] → textContent === "3" (probes T2 which gives "true").
  resetEnv();
  tours = ['tour-a', 'tour-b', 'tour-c'];
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F2 count-from-array violated — #tour-selector-count element never created');
  } else if (el.textContent !== '3') {
    issues.push('F2 count-from-array violated — expected textContent === "3", got "' + el.textContent + '"');
  }
  return issues;
}

function runF3_countWhenUndefined(renderFn) {
  // F3: tours=undefined → textContent === "0" (probes T3 which gives "undefined").
  resetEnv();
  tours = undefined;
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F3 count-when-undefined violated — #tour-selector-count element never created');
  } else if (el.textContent !== '0') {
    issues.push('F3 count-when-undefined violated — expected textContent === "0", got "' + el.textContent + '"');
  }
  return issues;
}

function runF4_countHardcodedZero(renderFn) {
  // F4: tours=[a,b,c] → textContent === "3" (probes T4 hardcoded n=0 which gives "0").
  resetEnv();
  tours = ['tour-a', 'tour-b', 'tour-c'];
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F4 count-hardcoded-zero violated — #tour-selector-count element never created');
  } else if (el.textContent !== '3') {
    issues.push('F4 count-hardcoded-zero violated — expected textContent === "3", got "' + el.textContent + '"');
  }
  return issues;
}

function runF5_countWithoutTypeofGuard(renderFn) {
  // F5: tours=undefined → textContent === "0" (probes T5 which throws silently → never sets textContent).
  resetEnv();
  tours = undefined;
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F5 count-without-typeof-guard violated — #tour-selector-count element never created');
  } else if (el.textContent !== '0') {
    issues.push('F5 count-without-typeof-guard violated — expected textContent === "0", got "' + el.textContent + '"');
  }
  return issues;
}

function runF6_countWithGuardDropped(renderFn) {
  // F6: tours=[a,b,c] → textContent populated (probes T6 which never sets mock element textContent).
  resetEnv();
  tours = ['tour-a', 'tour-b', 'tour-c'];
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F6 count-with-guard-dropped violated — #tour-selector-count element never created');
  } else if (!el.textContent || el.textContent.length === 0) {
    issues.push('F6 count-with-guard-dropped violated — #tour-selector-count textContent is empty (mock element bypassed)');
  }
  return issues;
}

function runF7_countExactFive(renderFn) {
  // F7: tours=[a,b,c,d,e] → textContent === "5" (probes T7 hardcoded n=99 which gives "99").
  resetEnv();
  tours = ['tour-a', 'tour-b', 'tour-c', 'tour-d', 'tour-e'];
  renderFn();
  var issues = [];
  var el = mockDocument._els['tour-selector-count'];
  if (!el) {
    issues.push('F7 count-exact-five violated — #tour-selector-count element never created');
  } else if (el.textContent !== '5') {
    issues.push('F7 count-exact-five violated — expected textContent === "5", got "' + el.textContent + '"');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_renderTourSelectorCount, target: 'F1', drop: 'tour-selector-count sub-render' },
  { id: 'T2', fn: brokenT2_renderTourSelectorCount, target: 'F2', drop: '&& tours.length lookup' },
  { id: 'T3', fn: brokenT3_renderTourSelectorCount, target: 'F3', drop: '|| 0 fallback' },
  { id: 'T4', fn: brokenT4_renderTourSelectorCount, target: 'F4', drop: 'tours.length lookup (hardcoded n=0)' },
  { id: 'T5', fn: brokenT5_renderTourSelectorCount, target: 'F5', drop: 'typeof tours !== "undefined" guard' },
  { id: 'T6', fn: brokenT6_renderTourSelectorCount, target: 'F6', drop: '!el return guard' },
  { id: 'T7', fn: brokenT7_renderTourSelectorCount, target: 'F7', drop: 'tours.length lookup (hardcoded n=99)' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_countPopulated,          target_id: 'T1' },
  { id: 'F2', fn: runF2_countFromArray,          target_id: 'T2' },
  { id: 'F3', fn: runF3_countWhenUndefined,      target_id: 'T3' },
  { id: 'F4', fn: runF4_countHardcodedZero,      target_id: 'T4' },
  { id: 'F5', fn: runF5_countWithoutTypeofGuard, target_id: 'T5' },
  { id: 'F6', fn: runF6_countWithGuardDropped,   target_id: 'T6' },
  { id: 'F7', fn: runF7_countExactFive,          target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E43 — renderTourSelectorCount() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv();
  var mutantIssues = [];
  var fix = ALL_FIXTURES.find(function (f) { return f.id === mutant.target; });
  if (fix) {
    var args = [mutant.fn];
    var issues = fix.fn.apply(null, args);
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderTourSelectorCount, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var args = [healthyRenderTourSelectorCount];
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderTourSelectorCount) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);