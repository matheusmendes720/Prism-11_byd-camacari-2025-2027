// e53-verify.js — renderGlossary() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1755-1811 (renderGlossary — E2 chrome).
// Renders 4 blocks into #glossary-root:
//   Block 1     — layers prose (glossaryTexts.layers.forEach)
//   Block 2     — status legend (glossaryTexts.statuses.forEach)
//   Block 2.5   — threshold toggle (legacy/authoritative)
//   Block 3     — node types (glossaryTexts.types.forEach)
// Plus a final root.innerHTML = html assignment.
//
// Invariants (4 sub-checks — one per major operation):
//   1a. glossaryTexts.layers.forEach completes without throwing
//   1b. glossaryTexts.statuses.forEach completes without throwing
//   1c. glossaryTexts.types.forEach completes without throwing
//   1d. root.innerHTML = html write completes without throwing
//
// Inverted mutant pattern: each fixture corrupts ONE step into a throwing
// stub. Healthy renderFn detects the throw → ok=false. Broken mutant drops
// that step → no throw → ok=true → fixture reports issue → PASS.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — glossaryTexts + DOM stub + counters
// ============================================================
var glossaryTexts = makeHealthyGlossaryTexts();
var glossaryRoot  = null;        // {innerHTML: string} — null = absent
var lastInnerHTML = null;        // captured write for inspection

function makeHealthyGlossaryTexts() {
  return {
    layers: [
      { label: 'L1', role: 'r1', layer: 'framework', summary: function() { return 's1'; } },
      { label: 'L2', role: 'r2', layer: 'decisions', summary: function() { return 's2'; } }
    ],
    statuses: [
      { label: 'GREEN', css: '--green', ranges: [
        { source: 'active',       label: 'green-active' },
        { source: 'authoritative', label: 'green-auth'  }
      ]}
    ],
    types: [
      { label: 'TYPE_A', shape: 'circle', css: '--blue',  count: 11 },
      { label: 'TYPE_B', shape: 'square', css: '--amber', count: 28 }
    ]
  };
}

function makeHealthyRoot() {
  return { innerHTML: '' };
}

function setGlossaryTexts(v) { glossaryTexts = v; }
function getGlossaryTexts()  { return glossaryTexts; }
function setGlossaryRoot(v)  { glossaryRoot = v; }
function getGlossaryRoot()   { return glossaryRoot; }
function getLastInnerHTML()  { return lastInnerHTML; }

function resetEnv() {
  glossaryTexts = makeHealthyGlossaryTexts();
  glossaryRoot  = makeHealthyRoot();
  lastInnerHTML = null;
}

// ============================================================
// Mock document.getElementById — returns our stub or null.
// ============================================================
global.document = {
  getElementById: function (id) {
    if (id === 'glossary-root') return glossaryRoot;
    return null;
  }
};

// ============================================================
// Mirror — renderGlossary() (HEALTHY, simplified)
//
// Replicates the structural invariant surface: each of the 3 forEach
// blocks + the final innerHTML write. Skips HTML-string assembly since
// we only care whether the operations COMPLETED, not the rendered shape.
// (For escapeHtml / PALETTE_TOKENS / STATUS_THRESHOLDS invariants, those
// are exercised by other audit chains.)
// ============================================================
function healthyRenderGlossary() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  if (typeof glossaryTexts === 'undefined' || glossaryTexts === null) {
    fail('glossaryTexts is undefined/null');
    return { ok: false, issues: issues };
  }

  try {
    var root = document.getElementById('glossary-root');
    if (root) {
      // Block 1 — layers prose
      glossaryTexts.layers.forEach(function () {});
      // Block 2 — status legend
      glossaryTexts.statuses.forEach(function () {});
      // Block 2.5 — threshold toggle (literal HTML, no forEach)
      // Block 3 — node types
      glossaryTexts.types.forEach(function () {});
      // Final write
      root.innerHTML = '<rendered>';
      lastInnerHTML = root.innerHTML;
    }
  } catch (e) {
    fail('renderGlossary body threw: ' + e.message);
  }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
// Broken mutants — 4 flags total (one per operation).
// When MIRROR_REPAIRED=true, delegate to healthy.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderGlossary();

    var issues = [];
    function fail(msg) { issues.push(msg); }

    if (typeof glossaryTexts === 'undefined' || glossaryTexts === null) {
      fail('glossaryTexts is undefined/null');
      return { ok: false, issues: issues };
    }

    try {
      var root = document.getElementById('glossary-root');
      if (root) {
        if (!opts.dropInv1a) glossaryTexts.layers.forEach(function () {});
        if (!opts.dropInv1b) glossaryTexts.statuses.forEach(function () {});
        if (!opts.dropInv1c) glossaryTexts.types.forEach(function () {});
        if (!opts.dropInv1d) {
          root.innerHTML = '<rendered>';
          lastInnerHTML = root.innerHTML;
        }
      }
    } catch (e) {
      fail('renderGlossary body threw: ' + e.message);
    }

    return { ok: issues.length === 0, issues: issues };
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'glossaryTexts.layers.forEach (1a — Block 1)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'glossaryTexts.statuses.forEach (1b — Block 2)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'glossaryTexts.types.forEach (1c — Block 3)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'root.innerHTML = html (1d — final write)' }
];

// ============================================================
// Fixtures — sourced from e53-fixtures.js via factory + deps
// ============================================================
var fx = require('./e53-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv:         resetEnv,
  setGlossaryTexts: setGlossaryTexts,
  getGlossaryTexts: getGlossaryTexts,
  setGlossaryRoot:  setGlossaryRoot,
  getGlossaryRoot:  getGlossaryRoot,
  getLastInnerHTML: getLastInnerHTML
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E53 — renderGlossary() chrome hook invariant ===');
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
  var pass = MIRROR_REPAIRED ? !detected : detected;
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderGlossary, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyRenderGlossary);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderGlossary) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
