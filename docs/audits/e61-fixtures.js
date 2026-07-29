// e61-fixtures.js — per-function probes for E61 moveTooltip
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operations and OVERWRITES the
// sentinel. The broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// moveTooltip reads the lazily-created tooltip element via _getTooltip(),
// bails if the tooltip is null or its style.display is 'none', then writes
// style.left and style.top with a +14px offset from the event clientX/Y.
//
// Topology:
//   Event: { clientX: 100, clientY: 200 }
//   Expected healthy output:
//     tooltip.style.left  = '114px'  (= 100 + 14)
//     tooltip.style.top   = '214px'  (= 200 + 14)
//
// Fixtures (F0..F4):
//   F0 — healthy control: tooltip created (style.display='block'), event
//        clientX=100,clientY=200. Verify left='114px' and top='214px'.
//   F1 — dropInv1a (_getTooltip + display guard drop): tooltip not appended
//        (T1 returns early when tt undefined). Detection: tooltip not in
//        body, no left/top writes.
//   F2 — dropInv1b (+14 offset drop): tooltip created with display='block',
//        event clientX=100,clientY=200. T2 writes left='100px' (no +14) and
//        top='200px'. Detection: left != '114px', top != '214px' → 2 issues.
//   F3 — dropInv1c (style.left write drop): tooltip created with display='block',
//        style.left pre-seeded with STALE_L. Healthy writes '114px'. T3
//        leaves it at STALE_L → 1 issue.
//   F4 — dropInv1d (style.top write drop): style.top pre-seeded with
//        STALE_T. Healthy writes '214px'. T4 leaves it at STALE_T → 1
//        issue.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: tooltip retrieved, display guard passes,
  // x/y calc correct, both style.left and style.top written with +14.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    renderFn();
    var issues = [];

    var tt = deps.getTooltip();
    if (!tt || !tt._appendedToBody) {
      issues.push('F0 tooltip-missing violated — expected tooltip to be created and appended to body, but _appendedToBody=' + JSON.stringify(tt && tt._appendedToBody));
      return issues;
    }
    if (tt.id !== 'd3-node-tooltip') {
      issues.push('F0 tooltip-id violated — expected id="d3-node-tooltip", got ' + JSON.stringify(tt.id));
    }
    if (tt.style.left !== '114px') issues.push('F0 style.left violated — expected "114px", got ' + JSON.stringify(tt.style.left));
    if (tt.style.top  !== '214px') issues.push('F0 style.top violated — expected "214px", got ' + JSON.stringify(tt.style.top));
    return issues;
  }

  // ============================================================
  // F1 — Drop _getTooltip + display guard (T1 dropInv1a): tooltip should
  // be created/appended AND have correct left/top. T1 returns early —
  // tooltip is never created. Healthy creates it and writes both
  // coordinates.
  // ============================================================
  function runF1_tooltipNeverCreated(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt || !tt._appendedToBody) {
      issues.push('F1 tooltip-creation violated — expected tooltip to be created and appended to body (1a dropped — T1)');
    }
    // Regression check: when tooltip exists, left/top must match the +14
    // offset. Healthy satisfies both; T1 (which bails before writes) has
    // no tooltip at all so the earlier check fires and these are skipped.
    if (tt) {
      if (tt.style.left !== '114px') issues.push('F1 style.left violated — expected "114px", got ' + JSON.stringify(tt.style.left));
      if (tt.style.top  !== '214px') issues.push('F1 style.top violated — expected "214px", got ' + JSON.stringify(tt.style.top));
    }
    return issues;
  }

  // ============================================================
  // F2 — Drop +14 offset (T2 dropInv1b): tooltip created, display='block',
  // but x = clientX (100) and y = clientY (200) without offset.
  // Detection: left != '114px' and top != '214px'.
  // ============================================================
  function runF2_offsetDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    if (tt.style.left !== '114px') {
      issues.push('F2 +14-offset violated — left expected "114px" (= 100 + 14), got ' + JSON.stringify(tt.style.left) + ' (+14 offset dropped — T2)');
    }
    if (tt.style.top !== '214px') {
      issues.push('F2 +14-offset violated — top expected "214px" (= 200 + 14), got ' + JSON.stringify(tt.style.top) + ' (+14 offset dropped — T2)');
    }
    return issues;
  }

  // ============================================================
  // F3 — Drop style.left write (T3 dropInv1c): style.left pre-seeded with
  // STALE_L. Healthy overwrites to '114px'. T3 leaves it at STALE_L.
  // ============================================================
  function runF3_styleLeftDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.style.left = 'STALE_L';
    renderFn();
    if (tt.style.left !== '114px') {
      issues.push('F3 style.left-write violated — expected "114px", got ' + JSON.stringify(tt.style.left) + ' (style.left write dropped — T3)');
    }
    return issues;
  }

  // ============================================================
  // F4 — Drop style.top write (T4 dropInv1d): style.top pre-seeded with
  // STALE_T. Healthy overwrites to '214px'. T4 leaves it at STALE_T.
  // ============================================================
  function runF4_styleTopDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.style.top = 'STALE_T';
    renderFn();
    if (tt.style.top !== '214px') {
      issues.push('F4 style.top-write violated — expected "214px", got ' + JSON.stringify(tt.style.top) + ' (style.top write dropped — T4)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,         target_id: null },
    { id: 'F1', fn: runF1_tooltipNeverCreated,    target_id: 'T1' },
    { id: 'F2', fn: runF2_offsetDropped,          target_id: 'T2' },
    { id: 'F3', fn: runF3_styleLeftDropped,       target_id: 'T3' },
    { id: 'F4', fn: runF4_styleTopDropped,        target_id: 'T4' }
  ];
};
