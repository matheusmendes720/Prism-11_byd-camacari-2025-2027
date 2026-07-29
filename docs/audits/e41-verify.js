// e41_verify.js — renderBuildStamp() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L1295-1308 (renderBuildStamp — E5 chrome).
//
// renderBuildStamp() has 1 sub-render contract guarded by try/catch:
//   (1) build-stamp — "build <git_commit> · <build_date> · <bytes.toLocaleString('en-US')> bytes"
//
// Per-function grouping: each mutant targets ONE contract surface; each fixture
// probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 7 controls = 14 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var mockBytesCount = 12345;

var mockDocument = {
  _els: {},
  getElementById: function (id) {
    if (!this._els[id]) this._els[id] = { textContent: '' };
    return this._els[id];
  },
  reset: function () { this._els = {}; },
  documentElement: {
    get outerHTML() { return 'a'.repeat(mockBytesCount); }
  }
};

var healthyEnvelope = {
  schema_version: 2,
  meta_version: 'v2.0.1',
  build_date: '2026-07-27',
  git_commit: 'a540340'
};

function resetEnv() {
  mockDocument.reset();
  mockBytesCount = 12345;
  JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));
}

// ============================================================
// Mirror — renderBuildStamp() L1295-1308 (HEALTHY)
// ============================================================
function healthyRenderBuildStamp() {
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    el.textContent =
      'build ' + JSON_ENVELOPE.git_commit +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + fmt + ' bytes';
  } catch (e) {
    console.warn('[D3 E5] renderBuildStamp failed:', e);
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_renderBuildStamp() {
  // T1: drop the entire build-stamp sub-render (element never populated).
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  // No-op
}

function brokenT2_renderBuildStamp() {
  // T2: drop the 'build ' prefix.
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    el.textContent =
      JSON_ENVELOPE.git_commit +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + fmt + ' bytes';
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

function brokenT3_renderBuildStamp() {
  // T3: drop the git_commit interpolation.
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    el.textContent =
      'build ' +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + fmt + ' bytes';
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

function brokenT4_renderBuildStamp() {
  // T4: drop the build_date interpolation.
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    el.textContent =
      'build ' + JSON_ENVELOPE.git_commit +
      ' · ' + fmt + ' bytes';
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

function brokenT5_renderBuildStamp() {
  // T5: drop the ' bytes' suffix.
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    el.textContent =
      'build ' + JSON_ENVELOPE.git_commit +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + fmt;
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

function brokenT6_renderBuildStamp() {
  // T6: drop the toLocaleString formattering (use raw bytes).
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    var el = mockDocument.getElementById('build-stamp');
    if (!el) return;
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    el.textContent =
      'build ' + JSON_ENVELOPE.git_commit +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + bytes + ' bytes';
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

function brokenT7_renderBuildStamp() {
  // T7: drop the !el return guard (would throw if el missing).
  if (MIRROR_REPAIRED) return healthyRenderBuildStamp();
  try {
    // Skip getElementById call — el will be undefined
    var bytes = (mockDocument.documentElement.outerHTML || '').length;
    var fmt = bytes.toLocaleString('en-US');
    var el = { textContent: '' };
    el.textContent =
      'build ' + JSON_ENVELOPE.git_commit +
      ' · ' + JSON_ENVELOPE.build_date +
      ' · ' + fmt + ' bytes';
  } catch (e) { console.warn('[D3 E5] renderBuildStamp failed:', e); }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_stampPopulated(renderFn) {
  // F1: build-stamp element populated (not empty).
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F1 stamp-populated violated — #build-stamp element never created');
  } else if (!el.textContent || el.textContent.length === 0) {
    issues.push('F1 stamp-populated violated — #build-stamp textContent is empty');
  }
  return issues;
}

function runF2_stampBuildPrefix(renderFn) {
  // F2: textContent starts with "build ".
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F2 stamp-build-prefix violated — #build-stamp element never created');
  } else if (el.textContent.indexOf('build ') !== 0) {
    issues.push('F2 stamp-build-prefix violated — expected text starting with "build ", got "' + el.textContent + '"');
  }
  return issues;
}

function runF3_stampGitCommit(renderFn) {
  // F3: textContent contains git_commit ("a540340").
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F3 stamp-git-commit violated — #build-stamp element never created');
  } else if (el.textContent.indexOf('a540340') === -1) {
    issues.push('F3 stamp-git-commit violated — expected text to contain "a540340", got "' + el.textContent + '"');
  }
  return issues;
}

function runF4_stampBuildDate(renderFn) {
  // F4: textContent contains build_date ("2026-07-27").
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F4 stamp-build-date violated — #build-stamp element never created');
  } else if (el.textContent.indexOf('2026-07-27') === -1) {
    issues.push('F4 stamp-build-date violated — expected text to contain "2026-07-27", got "' + el.textContent + '"');
  }
  return issues;
}

function runF5_stampBytesSuffix(renderFn) {
  // F5: textContent ends with " bytes".
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F5 stamp-bytes-suffix violated — #build-stamp element never created');
  } else if (el.textContent.indexOf(' bytes') !== el.textContent.length - 6) {
    issues.push('F5 stamp-bytes-suffix violated — expected text to end with " bytes", got "' + el.textContent + '"');
  }
  return issues;
}

function runF6_stampFormattedBytes(renderFn) {
  // F6: textContent contains formatted bytes "12,345" (locale-formatted with comma).
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  if (!el) {
    issues.push('F6 stamp-formatted-bytes violated — #build-stamp element never created');
  } else if (el.textContent.indexOf('12,345') === -1) {
    issues.push('F6 stamp-formatted-bytes violated — expected text to contain "12,345", got "' + el.textContent + '"');
  }
  return issues;
}

function runF7_stampFullShape(renderFn) {
  // F7: textContent matches the canonical full shape exactly.
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['build-stamp'];
  var expected = 'build a540340 · 2026-07-27 · 12,345 bytes';
  if (!el) {
    issues.push('F7 stamp-full-shape violated — #build-stamp element never created');
  } else if (el.textContent !== expected) {
    issues.push('F7 stamp-full-shape violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_renderBuildStamp, target: 'F1', drop: 'build-stamp sub-render' },
  { id: 'T2', fn: brokenT2_renderBuildStamp, target: 'F2', drop: "'build ' prefix" },
  { id: 'T3', fn: brokenT3_renderBuildStamp, target: 'F3', drop: 'git_commit interpolation' },
  { id: 'T4', fn: brokenT4_renderBuildStamp, target: 'F4', drop: 'build_date interpolation' },
  { id: 'T5', fn: brokenT5_renderBuildStamp, target: 'F5', drop: "' bytes' suffix" },
  { id: 'T6', fn: brokenT6_renderBuildStamp, target: 'F6', drop: 'toLocaleString formattering' },
  { id: 'T7', fn: brokenT7_renderBuildStamp, target: 'F7', drop: '!el return guard' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_stampPopulated,        target_id: 'T1' },
  { id: 'F2', fn: runF2_stampBuildPrefix,       target_id: 'T2' },
  { id: 'F3', fn: runF3_stampGitCommit,         target_id: 'T3' },
  { id: 'F4', fn: runF4_stampBuildDate,         target_id: 'T4' },
  { id: 'F5', fn: runF5_stampBytesSuffix,       target_id: 'T5' },
  { id: 'F6', fn: runF6_stampFormattedBytes,    target_id: 'T6' },
  { id: 'F7', fn: runF7_stampFullShape,         target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));

var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E41 — renderBuildStamp() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderBuildStamp, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var args = [healthyRenderBuildStamp];
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderBuildStamp) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);