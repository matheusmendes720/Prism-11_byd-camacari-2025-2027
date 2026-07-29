// e104-fixtures.js — per-function probes for E104 init
//
// init() (L4296-4349) orchestrates 8 chrome hooks then calls build() via rAF.
// Invariants:
//   A. svg element must exist (or init exits early without calling any hooks).
//   B. renderTopbarStats must be called.
//   C. renderGlossary must be called.
//   D. renderTourSelectorCount must be called.
//   E. renderBuildStamp must be called.
//   F. renderCanvasLabels must be called.
//   G. renderBottomBar must be called.
//   H. validateDataLayer must be called.
//   I. build must be scheduled via rAF.
//
// Source — D3-PITCH-GRAPH.html L4296-4349.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy. init() should call all hooks and schedule build.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    // Set up DOM stubs
    global.svg = { clientWidth: 800, clientHeight: 600 };
    global.document = { querySelectorAll: function () { return []; } };
    global.window = { __d3InitFired: undefined, addEventListener: function () {} };
    global.localStorage = { getItem: function () { return null; } };

    // Mock chrome hooks (tracked)
    global.__hookCalls = {};
    global.renderTopbarStats = function () { global.__hookCalls['renderTopbarStats'] = true; };
    global.renderGlossary = function () { global.__hookCalls['renderGlossary'] = true; };
    global.renderTourSelectorCount = function () { global.__hookCalls['renderTourSelectorCount'] = true; };
    global.renderBuildStamp = function () { global.__hookCalls['renderBuildStamp'] = true; };
    global.renderCanvasLabels = function () { global.__hookCalls['renderCanvasLabels'] = true; };
    global.renderBottomBar = function () { global.__hookCalls['renderBottomBar'] = true; };
    global.validateDataLayer = function () { global.__hookCalls['validateDataLayer'] = true; };
    global.build = function () { global.__hookCalls['build'] = true; };

    // Mock rAF to run immediately
    global.requestAnimationFrame = function (cb) { cb(); return 1; };

    // Mock ResizeObserver
    global.ResizeObserver = function () {};
    global.ResizeObserver.prototype.observe = function () {};

    deps.resetEnv();
    fn();

    // Verify all hooks were called
    var hooks = ['renderTopbarStats','renderGlossary','renderTourSelectorCount',
      'renderBuildStamp','renderCanvasLabels','renderBottomBar','validateDataLayer'];
    hooks.forEach(function (h) {
      if (!global.__hookCalls[h]) issues.push('F0 ' + h + ' was NOT called');
    });
    if (!global.__hookCalls['build']) issues.push('F0 build was NOT called via rAF');

    return issues;
  }

  // ============================================================
  // F1 — svg missing. init() returns early without calling any hooks.
  // ============================================================
  function runF1_svgMissing(fn) {
    var issues = [];

    global.svg = null;  // missing — init exits early
    global.document = { querySelectorAll: function () { return []; } };
    global.window = { __d3InitFired: undefined };
    global.localStorage = { getItem: function () { return null; } };

    global.__hookCalls = {};
    global.renderTopbarStats = function () { global.__hookCalls['renderTopbarStats'] = true; };
    global.renderGlossary = function () { global.__hookCalls['renderGlossary'] = true; };
    global.renderTourSelectorCount = function () { global.__hookCalls['renderTourSelectorCount'] = true; };
    global.renderBuildStamp = function () { global.__hookCalls['renderBuildStamp'] = true; };
    global.renderCanvasLabels = function () { global.__hookCalls['renderBottomBar'] = true; };
    global.renderBottomBar = function () { global.__hookCalls['renderBottomBar'] = true; };
    global.validateDataLayer = function () { global.__hookCalls['validateDataLayer'] = true; };
    global.build = function () { global.__hookCalls['build'] = true; };

    global.requestAnimationFrame = function (cb) { cb(); return 1; };
    global.ResizeObserver = function () {};
    global.ResizeObserver.prototype.observe = function () {};

    deps.resetEnv();
    fn();

    // When svg is missing, no hooks should be called
    var hooks = ['renderTopbarStats','renderGlossary','renderTourSelectorCount',
      'renderBuildStamp','renderCanvasLabels','renderBottomBar','validateDataLayer'];
    hooks.forEach(function (h) {
      if (global.__hookCalls[h]) issues.push('F1 ' + h + ' was called even though svg is null');
    });
    if (global.__hookCalls['build']) issues.push('F1 build was called even though svg is null');

    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null },
    { id: 'F1', fn: runF1_svgMissing,       target_id: null }
  ];
};
