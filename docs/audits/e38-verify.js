// e38_verify.js — init() pre-paint hooks cluster invariant
// Mirrors D3-PITCH-GRAPH.html L4296-4349 (init orchestrator).
//
// init() has 7 contract surfaces:
//   (1) !svg guard              — L4300-4303
//   (2) typeof guards           — L4306,4311,4314,4317,4320,4323,4326 (×7)
//   (3) requestAnimationFrame   — L4328 (defers build until layout computed)
//   (4) ResizeObserver          — L4333-4343 (rebuilds on SVG resize)
//   (5) window.load fallback    — L4361-4366 (rebuilds if SVG sized late)
//   (6) DOMContentLoaded        — L4355-4359 (dispatch based on readyState)
//   (7) outer try/catch         — L4299,4346 (containment of sub-hook errors)
//
// Per-function grouping: each mutant targets ONE contract; each fixture
// probes ONE contract. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 1 control × 7 fixtures (control
// runs against all healthy probes) = 7 + 7 = 14 reports.
//
// Inverted mutant-detection: probes push issues when broken code LEAVES
// state unchanged (correct behavior omitted).

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var mockSvg = {
  clientWidth: 800, clientHeight: 600, _observed: false,
  observe: function (target) { mockSvg._observed = true; return null; }
};

// Call log spies
var callLog = {
  hooks: {}, build: 0, rAF: 0, RO_constructed: 0,
  RO_observed: 0, window_listeners: [], document_listeners: [],
  console: { errors: [], logs: [], warns: [] }
};

// Mirror console object — capture but don't override global console.
var mockConsole = {
  error: function () { callLog.console.errors.push(Array.from(arguments)); },
  log: function () { callLog.console.logs.push(Array.from(arguments)); },
  warn: function () { callLog.console.warns.push(Array.from(arguments)); }
};

function spyHook(name) {
  return function () { callLog.hooks[name] = (callLog.hooks[name] || 0) + 1; };
}

function resetCallLog() {
  callLog.hooks = {};
  callLog.build = 0;
  callLog.rAF = 0;
  callLog.RO_constructed = 0;
  callLog.RO_observed = 0;
  callLog.window_listeners = [];
  callLog.document_listeners = [];
  callLog.console = { errors: [], logs: [], warns: [] };
}

// Chrome functions (healthy defaults — individual fixtures override as needed)
var renderTopbarStats = spyHook('renderTopbarStats');
var renderGlossary = spyHook('renderGlossary');
var renderTourSelectorCount = spyHook('renderTourSelectorCount');
var renderBuildStamp = spyHook('renderBuildStamp');
var renderCanvasLabels = spyHook('renderCanvasLabels');
var renderBottomBar = spyHook('renderBottomBar');
var validateDataLayer = spyHook('validateDataLayer');

function build() { callLog.build += 1; }

// Mock rAF — captures callback, does NOT invoke immediately.
var _rAFCallback = null;
function requestAnimationFrame(fn) {
  callLog.rAF += 1;
  _rAFCallback = fn;
}

function fireRAF() {
  if (_rAFCallback) {
    var cb = _rAFCallback;
    _rAFCallback = null;
    cb();
  }
}

// Mock ResizeObserver — observe() records, the callback can be fired manually.
var _roCallback = null;
function ResizeObserver(cb) {
  callLog.RO_constructed += 1;
  _roCallback = cb;
  this.observe = function (target) {
    callLog.RO_observed += 1;
    if (target && target.observe) target.observe();
    return null;
  };
  this.disconnect = function () { return null; };
}

function fireResize(width, height) {
  if (_roCallback) _roCallback([{ contentRect: { width: width, height: height } }]);
}

// Mock window + document
var mockWindow = {
  addEventListener: function (evt, fn) { callLog.window_listeners.push({ evt: evt, fn: fn }); },
  __readyState: 'complete'
};
var mockDocument = {
  readyState: 'complete',
  addEventListener: function (evt, fn) { callLog.document_listeners.push({ evt: evt, fn: fn }); }
};

function fireWindowLoad() {
  callLog.window_listeners.forEach(function (l) {
    if (l.evt === 'load') l.fn();
  });
}
function fireDOMContentLoaded() {
  callLog.document_listeners.forEach(function (l) {
    if (l.evt === 'DOMContentLoaded') l.fn();
  });
}

// Mock console — use mockConsole object (not overriding global console).
var _origConsole = mockConsole;

// ============================================================
// Reset state between fixtures
// ============================================================
function resetEnv() {
  resetCallLog();
  _rAFCallback = null;
  _roCallback = null;
  mockSvg.clientWidth = 800;
  mockSvg.clientHeight = 600;
  mockSvg._observed = false;
  mockWindow.__readyState = 'complete';
  mockWindow.__d3InitFired = undefined;
  mockDocument.readyState = 'complete';
  // Restore chrome hooks to healthy defaults
  renderTopbarStats = spyHook('renderTopbarStats');
  renderGlossary = spyHook('renderGlossary');
  renderTourSelectorCount = spyHook('renderTourSelectorCount');
  renderBuildStamp = spyHook('renderBuildStamp');
  renderCanvasLabels = spyHook('renderCanvasLabels');
  renderBottomBar = spyHook('renderBottomBar');
  validateDataLayer = spyHook('validateDataLayer');
}

// ============================================================
// Mirror — init() L4296-4349 (HEALTHY)
// ============================================================
function healthyInit() {
  try {
    if (!svg) {
      _origConsole.error('[D3 init] svg element not found');
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
      mockWindow.addEventListener('resize', function () { build(); });
      if (typeof ResizeObserver !== 'undefined') {
        try {
          var ro = new ResizeObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
              var r = entries[i].contentRect;
              if (r.width > 0 && r.height > 0) build();
            }
          });
          ro.observe(svg);
        } catch (e) { /* ignore */ }
      }
      _origConsole.log('[D3 init] ready');
    });
  } catch (err) {
    _origConsole.error('[D3 init] error:', err);
  }
}

// ============================================================
// Mirror — boot dispatcher L4353-4367 (HEALTHY)
// Exposed separately so fixtures can probe dispatch logic.
// ============================================================
function healthyBootDispatcher() {
  if (typeof mockWindow.__d3InitFired === 'undefined') {
    mockWindow.__d3InitFired = true;
    if (mockDocument.readyState === 'loading') {
      mockDocument.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    mockWindow.addEventListener('load', function () {
      if (svg && svg.clientWidth > 0 && svg.clientHeight > 0) {
        build();
      }
    });
  }
}

// ============================================================
// Broken mutants
// ============================================================
// Alias `init` to healthyInit so dispatcher functions can call init() by name
// (the broken dispatcher mutants only test dispatcher logic; init is healthy).
var init = healthyInit;

function brokenT1_init() {
  // T1: drop !svg guard. If svg missing, init proceeds and the rAF callback
  //     accesses svg.clientWidth, throwing ReferenceError or TypeError.
  if (MIRROR_REPAIRED) return healthyInit();
  try {
    // !svg guard DROPPED — fall through regardless
    if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    requestAnimationFrame(function () {
      build();
      mockWindow.addEventListener('resize', function () { build(); });
    });
  } catch (err) { _origConsole.error('[D3 init] error:', err); }
}

function brokenT2_init() {
  // T2: drop ALL 7 typeof guards. If any chrome fn is missing, calling it
  //     throws TypeError; outer try/catch contains it but the chain breaks.
  if (MIRROR_REPAIRED) return healthyInit();
  try {
    if (!svg) { _origConsole.error('[D3 init] svg element not found'); return; }
    renderTopbarStats();            // typeof guard dropped
    renderGlossary();               // typeof guard dropped
    renderTourSelectorCount();      // typeof guard dropped
    renderBuildStamp();             // typeof guard dropped
    renderCanvasLabels();           // typeof guard dropped
    renderBottomBar();              // typeof guard dropped
    validateDataLayer();            // typeof guard dropped
    requestAnimationFrame(function () {
      build();
      mockWindow.addEventListener('resize', function () { build(); });
    });
  } catch (err) { _origConsole.error('[D3 init] error:', err); }
}

function brokenT3_init() {
  // T3: drop outer try/catch. A throwing sub-hook propagates up to the
  //     caller. init() either throws OR hangs incomplete.
  if (MIRROR_REPAIRED) return healthyInit();
  if (!svg) { _origConsole.error('[D3 init] svg element not found'); return; }
  // outer try/catch DROPPED — no containment
  if (typeof renderTopbarStats === 'function') renderTopbarStats();
  if (typeof renderGlossary === 'function') renderGlossary();
  if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
  if (typeof renderBuildStamp === 'function') renderBuildStamp();
  if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
  if (typeof renderBottomBar === 'function') renderBottomBar();
  if (typeof validateDataLayer === 'function') validateDataLayer();
  requestAnimationFrame(function () {
    build();
    mockWindow.addEventListener('resize', function () { build(); });
  });
}

function brokenT4_init() {
  // T4: drop requestAnimationFrame. build() runs synchronously — layout
  //     may not be computed yet, SVG could be 0×0.
  if (MIRROR_REPAIRED) return healthyInit();
  try {
    if (!svg) { _origConsole.error('[D3 init] svg element not found'); return; }
    if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    // rAF DROPPED — build runs synchronously
    build();
    mockWindow.addEventListener('resize', function () { build(); });
    if (typeof ResizeObserver !== 'undefined') {
      try {
        var ro = new ResizeObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            var r = entries[i].contentRect;
            if (r.width > 0 && r.height > 0) build();
          }
        });
        ro.observe(svg);
      } catch (e) { /* ignore */ }
    }
  } catch (err) { _origConsole.error('[D3 init] error:', err); }
}

function brokenT5_init() {
  // T5: drop ResizeObserver registration entirely.
  if (MIRROR_REPAIRED) return healthyInit();
  try {
    if (!svg) { _origConsole.error('[D3 init] svg element not found'); return; }
    if (typeof renderTopbarStats === 'function') renderTopbarStats();
    if (typeof renderGlossary === 'function') renderGlossary();
    if (typeof renderTourSelectorCount === 'function') renderTourSelectorCount();
    if (typeof renderBuildStamp === 'function') renderBuildStamp();
    if (typeof renderCanvasLabels === 'function') renderCanvasLabels();
    if (typeof renderBottomBar === 'function') renderBottomBar();
    if (typeof validateDataLayer === 'function') validateDataLayer();
    requestAnimationFrame(function () {
      build();
      mockWindow.addEventListener('resize', function () { build(); });
      // ResizeObserver registration DROPPED
    });
  } catch (err) { _origConsole.error('[D3 init] error:', err); }
}

function brokenT6_dispatcher() {
  // T6: drop window.load fallback's `svg && svg.clientWidth > 0 && svg.clientHeight > 0`
  //     guard. If window.load fires before SVG is sized, build() runs on 0×0 SVG.
  if (MIRROR_REPAIRED) return healthyBootDispatcher();
  if (typeof mockWindow.__d3InitFired === 'undefined') {
    mockWindow.__d3InitFired = true;
    if (mockDocument.readyState === 'loading') {
      mockDocument.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    // Guard DROPPED — build() runs unconditionally on load
    mockWindow.addEventListener('load', function () {
      build();
    });
  }
}

function brokenT7_dispatcher() {
  // T7: drop DOMContentLoaded dispatch. Always call init() immediately
  //     regardless of readyState. If document is still 'loading', init
  //     fires before the DOM is ready.
  if (MIRROR_REPAIRED) return healthyBootDispatcher();
  if (typeof mockWindow.__d3InitFired === 'undefined') {
    mockWindow.__d3InitFired = true;
    // DOMContentLoaded dispatch DROPPED — always immediate
    init();
    mockWindow.addEventListener('load', function () {
      if (svg && svg.clientWidth > 0 && svg.clientHeight > 0) {
        build();
      }
    });
  }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_typeofGuardSafety(initFn) {
  // F1: typeof guards must protect against missing chrome functions.
  // Setup: erase renderTopbarStats so it is undefined.
  // Healthy init: typeof guard short-circuits the call, no TypeError.
  // T2 broken (guards dropped): renderTopbarStats() throws TypeError,
  //   caught by try/catch — but renderGlossary etc. never run.
  resetEnv();
  renderTopbarStats = undefined;
  initFn();
  var issues = [];
  // Healthy: renderGlossary still called (since TTS threw and was caught,
  // but in healthy path it was never called because typeof guard skipped it).
  // The healthy probe: renderGlossary IS called (we verify the chain didn't
  // break even with a missing TTS).
  if ((callLog.hooks.renderGlossary || 0) === 0) {
    issues.push('F1 typeof-guard violated — renderGlossary never invoked (chain broke on missing renderTopbarStats)');
  }
  return issues;
}

function runF2_rAFDefer(initFn) {
  // F2: requestAnimationFrame must defer build() — build not called synchronously,
  //     rAF scheduled with a callback.
  // Healthy: rAF called once, build NOT called yet.
  // T4 broken: build called synchronously (rAF dropped).
  resetEnv();
  initFn();
  var issues = [];
  if (callLog.rAF === 0) {
    issues.push('F2 rAF-defer violated — requestAnimationFrame never called (no defer)');
  }
  if (callLog.build > 0) {
    issues.push('F2 rAF-defer violated — build() ran synchronously (' + callLog.build + '× before rAF callback)');
  }
  return issues;
}

function runF3_svgGuard(initFn) {
  // F3: !svg guard must prevent hooks from running when svg is missing.
  // Healthy: init returns early, no hooks called, no rAF scheduled.
  // T1 broken (guard dropped): hooks called even with svg=null.
  resetEnv();
  svg = null;
  initFn();
  var issues = [];
  var hookCount = Object.keys(callLog.hooks).reduce(function (sum, k) { return sum + (callLog.hooks[k] || 0); }, 0);
  if (hookCount > 0) {
    issues.push('F3 !svg-guard violated — hooks invoked (' + hookCount + '× total) despite svg=null');
  }
  if (callLog.rAF > 0) {
    issues.push('F3 !svg-guard violated — requestAnimationFrame scheduled despite svg=null');
  }
  svg = mockSvg;     // restore
  return issues;
}

function runF4_tryCatchContainment(initFn) {
  // F4: outer try/catch must contain sub-hook errors so init() returns to caller.
  // Setup: renderTopbarStats throws.
  // Healthy: throw caught by try/catch, init() returns normally without propagating.
  // T3 broken (try/catch dropped): throw propagates to caller.
  // Note: in BOTH cases, renderGlossary won't be called (the throw aborts
  // execution regardless of try/catch — the catch only prevents propagation).
  resetEnv();
  renderTopbarStats = function () { throw new Error('TTS exploded'); };
  var threwToCaller = false;
  try { initFn(); } catch (e) { threwToCaller = true; }
  var issues = [];
  if (threwToCaller) {
    issues.push('F4 try/catch violated — sub-hook error propagated to caller (no containment)');
  }
  return issues;
}

function runF5_resizeObserver(initFn) {
  // F5: ResizeObserver must be constructed and observe(svg) called.
  // Healthy: RO constructed, observe called.
  // T5 broken: no RO construction.
  resetEnv();
  initFn();
  fireRAF();
  var issues = [];
  if (callLog.RO_constructed === 0) {
    issues.push('F5 ResizeObserver violated — ResizeObserver never constructed');
  }
  if (callLog.RO_observed === 0) {
    issues.push('F5 ResizeObserver violated — ResizeObserver.observe(svg) never called');
  }
  return issues;
}

function runF6_windowLoadFallback(dispatcherFn) {
  // F6: window.load fallback must rebuild ONLY if SVG actually sized.
  // Healthy: when svg is 0×0, build NOT called on load; when svg sized, build called.
  // T6 broken: build called regardless of svg dimensions.
  resetEnv();
  mockSvg.clientWidth = 0;
  mockSvg.clientHeight = 0;
  dispatcherFn();
  // Fire window.load — should NOT call build() because svg is 0×0.
  fireWindowLoad();
  var issues = [];
  if (callLog.build > 0) {
    issues.push('F6 window-load-fallback violated — build() called on load with svg=0×0 (size guard dropped)');
  }
  return issues;
}

function runF7_domContentLoadedDispatch(dispatcherFn) {
  // F7: when document.readyState='loading', dispatch must register DOMContentLoaded
  //     listener; when 'complete', init must fire immediately.
  // Healthy: with readyState='loading', document.addEventListener called for DOMContentLoaded;
  //          with readyState='complete', init runs synchronously.
  // T7 broken (dispatch dropped): always calls init immediately.
  resetEnv();
  mockDocument.readyState = 'loading';
  dispatcherFn();
  var issues = [];
  var hasDCListener = callLog.document_listeners.some(function (l) { return l.evt === 'DOMContentLoaded'; });
  if (!hasDCListener) {
    issues.push('F7 DOMContentLoaded-dispatch violated — no DOMContentLoaded listener registered (dispatch dropped)');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// Each mutant targets ONE fixture; control runs against all 7.
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_init,          kind: 'broken',  target: 'F3', drop: '!svg guard',            scope: 'init' },
  { id: 'T2', fn: brokenT2_init,          kind: 'broken',  target: 'F1', drop: 'typeof guards (×7)',    scope: 'init' },
  { id: 'T3', fn: brokenT3_init,          kind: 'broken',  target: 'F4', drop: 'outer try/catch',       scope: 'init' },
  { id: 'T4', fn: brokenT4_init,          kind: 'broken',  target: 'F2', drop: 'requestAnimationFrame', scope: 'init' },
  { id: 'T5', fn: brokenT5_init,          kind: 'broken',  target: 'F5', drop: 'ResizeObserver',        scope: 'init' },
  { id: 'T6', fn: brokenT6_dispatcher,    kind: 'broken',  target: 'F6', drop: 'window.load size guard', scope: 'dispatcher' },
  { id: 'T7', fn: brokenT7_dispatcher,    kind: 'broken',  target: 'F7', drop: 'DOMContentLoaded dispatch', scope: 'dispatcher' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_typeofGuardSafety,          target: 'init',        target_id: 'T2' },
  { id: 'F2', fn: runF2_rAFDefer,                    target: 'init',        target_id: 'T4' },
  { id: 'F3', fn: runF3_svgGuard,                    target: 'init',        target_id: 'T1' },
  { id: 'F4', fn: runF4_tryCatchContainment,         target: 'init',        target_id: 'T3' },
  { id: 'F5', fn: runF5_resizeObserver,              target: 'init',        target_id: 'T5' },
  { id: 'F6', fn: runF6_windowLoadFallback,          target: 'dispatcher',  target_id: 'T6' },
  { id: 'F7', fn: runF7_domContentLoadedDispatch,    target: 'dispatcher',  target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var svg = mockSvg;     // default — fixtures override

var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E38 — init() pre-paint hooks cluster invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv();
  svg = mockSvg;
  var mutantIssues = [];
  // Each mutant runs against ONLY its target fixture.
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
    pass = detected;     // broken mutants should trigger probes
  }
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  var roleLabel = mutant.scope === 'init' ? 'broken-init' : 'broken-dispatcher';
  console.log('[' + marker + '] ' + mutant.id + ' (' + roleLabel + ', target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && mutantIssues.length === 0) {
    console.log('         - ' + fix.id + ': invariant held (no issue)');
  }
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
svg = mockSvg;
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  svg = mockSvg;
  var healthyFn = (fix.target === 'init') ? healthyInit : healthyBootDispatcher;
  var args = [healthyFn];
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy ' + fix.target + ') — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);