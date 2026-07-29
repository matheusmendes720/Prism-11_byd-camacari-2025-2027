// e70-verify.js — init() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4296-4349 (init — SPA bootstrap
// orchestrator). Guards on the SVG element, fires seven chrome
// renderers to populate static chrome before first paint, validates
// the data layer, then defers build() via requestAnimationFrame so
// layout is computed.
//
// Invariants (9 sub-checks):
//   1a. svg guard (if !svg return) — prevents running renderers when
//       SVG is missing.
//   1b. renderTopbarStats() — populates top-bar stats.
//   1c. renderGlossary() — rebuilds sidebar glossary block.
//   1d. renderTourSelectorCount() — populates tour-selector heading.
//   1e. renderBuildStamp() — populates #build-stamp from JSON_ENVELOPE.
//   1f. renderCanvasLabels() — populates #layer-label + #graph-title.
//   1g. renderBottomBar() — populates .bottom-bar status chips.
//   1h. validateDataLayer() — runs schema/ID/count invariants.
//   1i. requestAnimationFrame(deferred build) — defers build + resize
//       listener + ResizeObserver + console.log to next frame.
//
// Inverted mutant pattern: each fixture pre-seeds the corresponding
// counter to 0 (or rAF registry to empty). Healthy init() runs every
// step → counter reaches 1. Broken mutant drops the step → counter
// stays at 0 → fixture reports issue → runner says PASS (BASELINE)
// or FAIL (REPAIRED).
//
// 9 mutants × 1 target fixture + 9 controls (fixtures × healthy) = 18 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — DOM, rAF, ResizeObserver, delegate counters
// ============================================================

var svg = null;                              // truthy when set, null when missing
var requestAnimationFrameCalls = 0;
var requestAnimationFrameCallbacks = [];     // registered callback registry
var resizeListenerCalls = 0;
var resizeObserverInstance = null;
var resizeObserverObserveCalls = 0;
var buildCalls = 0;

var renderTopbarStatsCalls = 0;
var renderGlossaryCalls = 0;
var renderTourSelectorCountCalls = 0;
var renderBuildStampCalls = 0;
var renderCanvasLabelsCalls = 0;
var renderBottomBarCalls = 0;
var validateDataLayerCalls = 0;

function getSvg() { return svg; }
function setSvg(s) { svg = s.present ? {} : null; }

function getRequestAnimationFrameCalls() { return requestAnimationFrameCalls; }
function getRequestAnimationFrameCallbackCount() { return requestAnimationFrameCallbacks.length; }
function wasRequestAnimationFrameCalled() { return requestAnimationFrameCalls >= 1; }

function getRenderTopbarStatsCalls() { return renderTopbarStatsCalls; }
function wasRenderTopbarStatsCalled() { return renderTopbarStatsCalls >= 1; }
function getRenderGlossaryCalls() { return renderGlossaryCalls; }
function wasRenderGlossaryCalled() { return renderGlossaryCalls >= 1; }
function getRenderTourSelectorCountCalls() { return renderTourSelectorCountCalls; }
function wasRenderTourSelectorCountCalled() { return renderTourSelectorCountCalls >= 1; }
function getRenderBuildStampCalls() { return renderBuildStampCalls; }
function wasRenderBuildStampCalled() { return renderBuildStampCalls >= 1; }
function getRenderCanvasLabelsCalls() { return renderCanvasLabelsCalls; }
function wasRenderCanvasLabelsCalled() { return renderCanvasLabelsCalls >= 1; }
function getRenderBottomBarCalls() { return renderBottomBarCalls; }
function wasRenderBottomBarCalled() { return renderBottomBarCalls >= 1; }
function getValidateDataLayerCalls() { return validateDataLayerCalls; }
function wasValidateDataLayerCalled() { return validateDataLayerCalls >= 1; }

function resetEnv() {
  svg = null;
  requestAnimationFrameCalls = 0;
  requestAnimationFrameCallbacks = [];
  resizeListenerCalls = 0;
  resizeObserverInstance = null;
  resizeObserverObserveCalls = 0;
  buildCalls = 0;
  renderTopbarStatsCalls = 0;
  renderGlossaryCalls = 0;
  renderTourSelectorCountCalls = 0;
  renderBuildStampCalls = 0;
  renderCanvasLabelsCalls = 0;
  renderBottomBarCalls = 0;
  validateDataLayerCalls = 0;
}

// ============================================================
// Mock delegates + DOM/rAF shims
// ============================================================
function renderTopbarStats()       { renderTopbarStatsCalls++; }
function renderGlossary()          { renderGlossaryCalls++; }
function renderTourSelectorCount() { renderTourSelectorCountCalls++; }
function renderBuildStamp()        { renderBuildStampCalls++; }
function renderCanvasLabels()      { renderCanvasLabelsCalls++; }
function renderBottomBar()         { renderBottomBarCalls++; }
function validateDataLayer()       { validateDataLayerCalls++; }
function build()                   { buildCalls++; }

function mockRequestAnimationFrame(cb) {
  requestAnimationFrameCalls++;
  requestAnimationFrameCallbacks.push(cb);
}

function mockResizeObserver(cb) {
  this.observe = function (target) { resizeObserverObserveCalls++; };
}

var mockWindow = {
  addEventListener: function (evt, cb) { if (evt === 'resize') resizeListenerCalls++; }
};
var mockDocument = {};

// ============================================================
// Mirror — init() (HEALTHY, simplified)
//
// Faithful to L4296-4349 invariants for the 9 sub-checks above.
// ============================================================
function healthyInit() {
  try {
    if (!svg) {
      // (console.error omitted — not under test)
      return;
    }
    if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    mockRequestAnimationFrame(function () {
      build();
      mockWindow.addEventListener('resize', function () { build(); });
      try {
        var ro = new mockResizeObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            var r = entries[i].contentRect;
            if (r.width > 0 && r.height > 0) build();
          }
        });
        ro.observe(svg);
      } catch (e) { /* ignore */ }
    });
  } catch (err) {
    // (console.error omitted)
  }
}

// ============================================================
// Broken mutants — 9 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyInit() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyInit();

    try {
      if (!opts.dropInv1a) {
        if (!svg) { return; }
      }
      if (!opts.dropInv1b) renderTopbarStats();
      if (!opts.dropInv1c) renderGlossary();
      if (!opts.dropInv1d) renderTourSelectorCount();
      if (!opts.dropInv1e) renderBuildStamp();
      if (!opts.dropInv1f) renderCanvasLabels();
      if (!opts.dropInv1g) renderBottomBar();
      if (!opts.dropInv1h) validateDataLayer();
      if (!opts.dropInv1i) {
        mockRequestAnimationFrame(function () {
          build();
          mockWindow.addEventListener('resize', function () { build(); });
          try {
            var ro = new mockResizeObserver(function (entries) {
              for (var i = 0; i < entries.length; i++) {
                var r = entries[i].contentRect;
                if (r.width > 0 && r.height > 0) build();
              }
            });
            ro.observe(svg);
          } catch (e) { /* ignore */ }
        });
      }
    } catch (err) {
      // ignore
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'svg guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'renderTopbarStats call (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'renderGlossary call (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'renderTourSelectorCount call (1d)' },
  { id: 'T5', fn: makeBF({ dropInv1e: true }), target: 'F5', drop: 'renderBuildStamp call (1e)' },
  { id: 'T6', fn: makeBF({ dropInv1f: true }), target: 'F6', drop: 'renderCanvasLabels call (1f)' },
  { id: 'T7', fn: makeBF({ dropInv1g: true }), target: 'F7', drop: 'renderBottomBar call (1g)' },
  { id: 'T8', fn: makeBF({ dropInv1h: true }), target: 'F8', drop: 'validateDataLayer call (1h)' },
  { id: 'T9', fn: makeBF({ dropInv1i: true }), target: 'F9', drop: 'requestAnimationFrame call (1i)' }
];

// ============================================================
// Fixtures — sourced from e70-fixtures.js via factory + deps
// ============================================================
var fx = require('./e70-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setSvg: setSvg,
  getRenderTopbarStatsCalls: getRenderTopbarStatsCalls,
  wasRenderTopbarStatsCalled: wasRenderTopbarStatsCalled,
  getRenderGlossaryCalls: getRenderGlossaryCalls,
  wasRenderGlossaryCalled: wasRenderGlossaryCalled,
  getRenderTourSelectorCountCalls: getRenderTourSelectorCountCalls,
  wasRenderTourSelectorCountCalled: wasRenderTourSelectorCountCalled,
  getRenderBuildStampCalls: getRenderBuildStampCalls,
  wasRenderBuildStampCalled: wasRenderBuildStampCalled,
  getRenderCanvasLabelsCalls: getRenderCanvasLabelsCalls,
  wasRenderCanvasLabelsCalled: wasRenderCanvasLabelsCalled,
  getRenderBottomBarCalls: getRenderBottomBarCalls,
  wasRenderBottomBarCalled: wasRenderBottomBarCalled,
  getValidateDataLayerCalls: getValidateDataLayerCalls,
  wasValidateDataLayerCalled: wasValidateDataLayerCalled,
  getRequestAnimationFrameCalls: getRequestAnimationFrameCalls,
  wasRequestAnimationFrameCalled: wasRequestAnimationFrameCalled,
  getRequestAnimationFrameCallbackCount: getRequestAnimationFrameCallbackCount
});

var healthyWrappedInit = function () {
  return healthyInit();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E70 — init() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-init, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedInit);
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