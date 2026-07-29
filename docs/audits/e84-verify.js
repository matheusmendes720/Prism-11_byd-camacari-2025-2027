// e84-verify.js — escapeHtml() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1675-1683 (escapeHtml — null/undefined
// guard, then 5 chained .replace() to swap & < > " ' for their
// HTML entity equivalents).
//
// Invariants (4 sub-checks):
//   1a. null/undefined guard: empty string on s == null.
//   1b. & replacement: '&' → '&amp;'.
//   1c. < replacement: '<' → '&lt;'.
//   1d. > replacement: '>' → '&gt;'.
// (1e "&quot;") and (1f "&#39;") are also covered by F0 (d).
//
// Inverted mutant pattern: each fixture passes a single string to the
// renderFn. Healthy: null/undefined → ''; otherwise apply 5 chained
// .replace(). Broken mutant drops a sub-check → distinct output string.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. Plus F0 has
// 4 sub-cases (treated as one report) = 9 reports total.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// (No mock environment — escapeHtml is pure, takes a string,
// returns a string. No DOM, no globals.)
// ============================================================

// ============================================================
// Mirror — escapeHtml() (HEALTHY, faithful to L1675-1683)
// ============================================================
function healthyEscapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// Broken mutants — 4 boolean flags.
// dropInv1a: no null guard. String(null) returns "null".
// dropInv1b: no & replacement.
// dropInv1c: no < replacement.
// dropInv1d: no > replacement.
// ============================================================
function makeBF(opts) {
  return function (s) {
    if (MIRROR_REPAIRED) return healthyEscapeHtml(s);

    if (opts.dropInv1a) {
      // No null guard — fall through to String(s).
    } else {
      if (s == null) return '';
    }
    var out = String(s);
    if (!opts.dropInv1b) out = out.replace(/&/g, '&amp;');
    if (!opts.dropInv1c) out = out.replace(/</g, '&lt;');
    if (!opts.dropInv1d) out = out.replace(/>/g, '&gt;');
    out = out.replace(/"/g, '&quot;');
    out = out.replace(/'/g, '&#39;');
    return out;
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'null guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: '& replacement (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: '< replacement (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: '> replacement (1d)' }
];

// ============================================================
// Fixtures — sourced from e84-fixtures.js
// ============================================================
var fx = require('./e84-fixtures.js');
// escapeHtml is pure; no deps needed — pass empty object.
var ALL_FIXTURES = fx.makeFixtures({});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E84 — escapeHtml() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-escapeHtml, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  var issues = fix.fn(healthyEscapeHtml);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy escapeHtml) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
