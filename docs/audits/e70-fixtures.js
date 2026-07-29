// e70-fixtures.js — per-function probes for E70 init
//
// Inverted mutant-detection: each fixture pre-seeds the DOM/RAF/build
// environment with sentinel values. The healthy mirror performs every
// init step and OVERWRITES sentinels. The broken mutant drops a step
// → sentinel survives → fixture reports issue → runner says PASS
// (BASELINE) or FAIL (REPAIRED).
//
// init() is the SPA bootstrap orchestrator. It guards on `svg`, runs
// seven chrome renderers to populate the static chrome before the first
// paint, validates the data layer, then defers build() via
// requestAnimationFrame so layout is computed.
//
// Topology (mirrors L4296-4349):
//   function init() {
//     try {
//       1a. if (!svg) { console.error; return; }        (svg guard)
//       1b. renderTopbarStats();                        (delegate call 1)
//       1c. renderGlossary();                           (delegate call 2)
//       1d. renderTourSelectorCount();                  (delegate call 3)
//       1e. renderBuildStamp();                         (delegate call 4)
//       1f. renderCanvasLabels();                       (delegate call 5)
//       1g. renderBottomBar();                          (delegate call 6)
//       1h. validateDataLayer();                        (delegate call 7)
//       1i. requestAnimationFrame(function(){           (deferred build +
//            build();                                   resize listener +
//            window.addEventListener('resize', ...);    ResizeObserver +
//            ResizeObserver;                            console.log)
//            console.log;
//          });
//     } catch (err) { console.error; }
//   }
//
// 9 invariants. Per-mutant fixtures pre-seed the corresponding counter
// to a sentinel (0) and assert the delegate ran at least once. The rAF
// fixture pre-seeds requestAnimationFrameCalls=0 AND a registered
// callback sentinel; the healthy init() fires rAF and registers a
// callback; the broken mutant skips rAF entirely.
//
// Fixtures (F0..F9):
//   F0 — healthy control: svg present, every delegate defined. All
//        counters reach 1 after init, rAF registered.
//   F1 — dropInv1a (svg guard drop): svg present, but with the guard
//        dropped, no return happens. Healthy still runs all delegates
//        (since svg IS truthy). Test: rAF should still fire (1 issue if
//        the broken mutant somehow returns early before rAF).
//   F2 — dropInv1b (renderTopbarStats drop): counter=0. Healthy → 1.
//   F3 — dropInv1c (renderGlossary drop): counter=0. Healthy → 1.
//   F4 — dropInv1d (renderTourSelectorCount drop): counter=0. Healthy → 1.
//   F5 — dropInv1e (renderBuildStamp drop): counter=0. Healthy → 1.
//   F6 — dropInv1f (renderCanvasLabels drop): counter=0. Healthy → 1.
//   F7 — dropInv1g (renderBottomBar drop): counter=0. Healthy → 1.
//   F8 — dropInv1h (validateDataLayer drop): counter=0. Healthy → 1.
//   F9 — dropInv1i (requestAnimationFrame drop): rAF call counter=0,
//        callback registry empty. Healthy → rAF called + callback
//        registered. 1 issue.
//
// 9 mutants × 1 target fixture + 9 controls (fixtures × healthy) = 18 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  function assertCounterGE(fixtureId, opLabel, counter, threshold) {
    if (counter < threshold) {
      return [fixtureId + ' ' + opLabel + ' violated — expected >= ' + threshold + ' call(s), got ' + counter];
    }
    return [];
  }

  // ============================================================
  // F0 — healthy control. All delegates fire, rAF registered, svg ok.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    var issues = [];

    if (!deps.wasRenderTopbarStatsCalled())      issues.push('F0 renderTopbarStats violated — counter=' + deps.getRenderTopbarStatsCalls());
    if (!deps.wasRenderGlossaryCalled())         issues.push('F0 renderGlossary violated — counter=' + deps.getRenderGlossaryCalls());
    if (!deps.wasRenderTourSelectorCountCalled())issues.push('F0 renderTourSelectorCount violated — counter=' + deps.getRenderTourSelectorCountCalls());
    if (!deps.wasRenderBuildStampCalled())       issues.push('F0 renderBuildStamp violated — counter=' + deps.getRenderBuildStampCalls());
    if (!deps.wasRenderCanvasLabelsCalled())     issues.push('F0 renderCanvasLabels violated — counter=' + deps.getRenderCanvasLabelsCalls());
    if (!deps.wasRenderBottomBarCalled())        issues.push('F0 renderBottomBar violated — counter=' + deps.getRenderBottomBarCalls());
    if (!deps.wasValidateDataLayerCalled())      issues.push('F0 validateDataLayer violated — counter=' + deps.getValidateDataLayerCalls());
    if (!deps.wasRequestAnimationFrameCalled())  issues.push('F0 requestAnimationFrame violated — counter=' + deps.getRequestAnimationFrameCalls());
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (svg guard drop). svg is NULL. Healthy init()
  // returns early on the guard, rAF never fires. T1 (guard dropped)
  // proceeds, rAF fires. 1 issue: rAF was called when it should be 0.
  // ============================================================
  function runF1_svgGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: false });
    renderFn();
    var issues = [];

    if (deps.wasRequestAnimationFrameCalled()) {
      issues.push('F1 svg guard violated — svg=null but rAF was fired (counter=' + deps.getRequestAnimationFrameCalls() + ') — svg guard dropped — T1');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (renderTopbarStats drop). Healthy → counter=1.
  // T1 → counter=0. 1 issue.
  // ============================================================
  function runF2_renderTopbarStatsDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F2', 'renderTopbarStats violated — counter=' + deps.getRenderTopbarStatsCalls() + ' (renderTopbarStats call dropped — T2)', deps.getRenderTopbarStatsCalls(), 1);
  }

  // ============================================================
  // F3 — dropInv1c (renderGlossary drop).
  // ============================================================
  function runF3_renderGlossaryDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F3', 'renderGlossary violated — counter=' + deps.getRenderGlossaryCalls() + ' (renderGlossary call dropped — T3)', deps.getRenderGlossaryCalls(), 1);
  }

  // ============================================================
  // F4 — dropInv1d (renderTourSelectorCount drop).
  // ============================================================
  function runF4_renderTourSelectorCountDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F4', 'renderTourSelectorCount violated — counter=' + deps.getRenderTourSelectorCountCalls() + ' (renderTourSelectorCount call dropped — T4)', deps.getRenderTourSelectorCountCalls(), 1);
  }

  // ============================================================
  // F5 — dropInv1e (renderBuildStamp drop).
  // ============================================================
  function runF5_renderBuildStampDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F5', 'renderBuildStamp violated — counter=' + deps.getRenderBuildStampCalls() + ' (renderBuildStamp call dropped — T5)', deps.getRenderBuildStampCalls(), 1);
  }

  // ============================================================
  // F6 — dropInv1f (renderCanvasLabels drop).
  // ============================================================
  function runF6_renderCanvasLabelsDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F6', 'renderCanvasLabels violated — counter=' + deps.getRenderCanvasLabelsCalls() + ' (renderCanvasLabels call dropped — T6)', deps.getRenderCanvasLabelsCalls(), 1);
  }

  // ============================================================
  // F7 — dropInv1g (renderBottomBar drop).
  // ============================================================
  function runF7_renderBottomBarDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F7', 'renderBottomBar violated — counter=' + deps.getRenderBottomBarCalls() + ' (renderBottomBar call dropped — T7)', deps.getRenderBottomBarCalls(), 1);
  }

  // ============================================================
  // F8 — dropInv1h (validateDataLayer drop).
  // ============================================================
  function runF8_validateDataLayerDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    return assertCounterGE('F8', 'validateDataLayer violated — counter=' + deps.getValidateDataLayerCalls() + ' (validateDataLayer call dropped — T8)', deps.getValidateDataLayerCalls(), 1);
  }

  // ============================================================
  // F9 — dropInv1i (requestAnimationFrame drop). Healthy → rAF fired
  // AND a callback registered. T1 → counter=0, no callbacks registered.
  // 1 issue.
  // ============================================================
  function runF9_requestAnimationFrameDropped(renderFn) {
    deps.resetEnv();
    deps.setSvg({ present: true });
    renderFn();
    var issues = [];

    if (deps.getRequestAnimationFrameCalls() < 1) {
      issues.push('F9 requestAnimationFrame violated — expected >= 1 call, got ' + deps.getRequestAnimationFrameCalls() + ' (requestAnimationFrame call dropped — T9)');
    }
    if (deps.getRequestAnimationFrameCallbackCount() < 1) {
      issues.push('F9 rAF callback violated — expected >= 1 registered callback, got ' + deps.getRequestAnimationFrameCallbackCount() + ' (rAF callback registration dropped — T9)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                        target_id: null },
    { id: 'F1', fn: runF1_svgGuardDropped,                       target_id: 'T1' },
    { id: 'F2', fn: runF2_renderTopbarStatsDropped,             target_id: 'T2' },
    { id: 'F3', fn: runF3_renderGlossaryDropped,                target_id: 'T3' },
    { id: 'F4', fn: runF4_renderTourSelectorCountDropped,       target_id: 'T4' },
    { id: 'F5', fn: runF5_renderBuildStampDropped,              target_id: 'T5' },
    { id: 'F6', fn: runF6_renderCanvasLabelsDropped,            target_id: 'T6' },
    { id: 'F7', fn: runF7_renderBottomBarDropped,               target_id: 'T7' },
    { id: 'F8', fn: runF8_validateDataLayerDropped,             target_id: 'T8' },
    { id: 'F9', fn: runF9_requestAnimationFrameDropped,         target_id: 'T9' }
  ];
};