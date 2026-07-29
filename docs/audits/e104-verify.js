// e104-verify.js — init() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4296-4349 (init — orchestrates 8 chrome hooks
// then calls build() via rAF).
//
// Invariants (9 sub-checks, targeting renderTopbarStats call):
//   A. renderTopbarStats must be called.
//   B. renderGlossary must be called.
//   C. renderTourSelectorCount must be called.
//   D. renderBuildStamp must be called.
//   E. renderCanvasLabels must be called.
//   F. renderBottomBar must be called.
//   G. validateDataLayer must be called.
//   H. build must be scheduled via rAF.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Healthy init (L4296-4349)
// ============================================================
function healthyInit() {
  try {
    if (!svg) {
      console.error('[D3 init] svg element not found');
      return;
    }
    if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    requestAnimationFrame(function () {
      build();
      window.addEventListener('resize', function () { build(); });
      if (typeof ResizeObserver !== 'undefined') {
        try {
          var ro = new ResizeObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
              var r = entries[i].contentRect;
              if (r.width > 0 && r.height > 0) build();
            }
          });
          ro.observe(svg);
        } catch (e) { /* ResizeObserver unavailable */ }
      }
      console.log('[D3 init] ready — svg', svg.clientWidth, 'x', svg.clientHeight);
    });
  } catch (err) {
    console.error('[D3 init] error:', err);
  }
}

// ============================================================
// Broken mutant — drops renderTopbarStats call (hook A)
// ============================================================
function brokenInit() {
  if (MIRROR_REPAIRED) return healthyInit();
  try {
    if (!svg) {
      console.error('[D3 init] svg element not found');
      return;
    }
    // T1: drop renderTopbarStats call
    // if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    requestAnimationFrame(function () {
      build();
      window.addEventListener('resize', function () { build(); });
      if (typeof ResizeObserver !== 'undefined') {
        try {
          var ro = new ResizeObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
              var r = entries[i].contentRect;
              if (r.width > 0 && r.height > 0) build();
            }
          });
          ro.observe(svg);
        } catch (e) { /* ResizeObserver unavailable */ }
      }
      console.log('[D3 init] ready — svg', svg.clientWidth, 'x', svg.clientHeight);
    });
  } catch (err) {
    console.error('[D3 init] error:', err);
  }
}

var MUTANTS = [
  { id: 'T1', fn: brokenInit, target: 'F0', drop: 'renderTopbarStats call (invariant A)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e104-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: function () {
    global.__hookCalls = {};
  },
  getSnapshot: function () {
    return { hooks: Object.keys(global.__hookCalls) };
  }
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E104 — init() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (brokenInit, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  // Skip broken fixtures — only healthy controls belong in the control group
  if (fix.id === 'F1') return;
  var issues = fix.fn(healthyInit);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy init) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
