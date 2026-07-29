// e63-fixtures.js — per-function probes for E63 hideTooltip
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operations and OVERWRITES the
// sentinel. The broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// hideTooltip is the mouse-leave handler — counters showTooltip (E62) by
// setting the tooltip's style.display back to 'none'. The function takes no
// arguments: no event, no node. It calls _getTooltip() to retrieve the
// cached tooltip, guards against null, then writes 'none' to style.display.
//
// Topology:
//   No event / node arguments.
//   Lazy-created tooltip stub. After hideTooltip: style.display = 'none'.
//
// Fixtures (F0..F2):
//   F0 — healthy control: tooltip created/appended, hideTooltip called,
//        verify display='none' (the write happened). Tooltip was visited
//        via _getTooltip().
//   F1 — dropInv1a (_getTooltip + null guard drop): tooltip should exist
//        AND have display='none'. T1 short-circuits the function — tooltip
//        is never created (lazy _getTooltip never called).
//   F2 — dropInv1b (style.display write drop): pre-seed display='STALE_D'.
//        Healthy overwrites to 'none'. T2 leaves sentinel.
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: tooltip retrieved, null guard passes, display
  // overwritten to 'none'. Tooklit exists after call.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt || !tt._appendedToBody) {
      issues.push('F0 tooltip-missing violated — expected tooltip to be created and appended, but _appendedToBody=' + JSON.stringify(tt && tt._appendedToBody));
      return issues;
    }
    if (tt.style.display !== 'none') {
      issues.push('F0 style.display violated — expected "none", got ' + JSON.stringify(tt.style.display));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (_getTooltip + null guard drop): after resetEnv(),
  // _tooltipEl is null. T1 returns immediately without calling _getTooltip.
  // Healthy creates the tooltip (via _getTooltip lazy init) → tooltip
  // exists. Detection: getTooltip() === null after call → issue.
  // ============================================================
  function runF1_tooltipNotRetrieved(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) {
      issues.push('F1 _getTooltip-retrieval violated — expected tooltip to be retrieved after call, got null (1a dropped — T1)');
      return issues;
    }
    if (tt.style.display !== 'none') {
      issues.push('F1 style.display violated — expected "none", got ' + JSON.stringify(tt.style.display));
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (style.display write drop): pre-seed display='STALE_D'.
  // Healthy calls _getTooltip (already cached) and overwrites display='none'.
  // T2 (which calls _getTooltip but skips the write) leaves sentinel.
  // ============================================================
  function runF2_styleDisplayDropped(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.style.display = 'STALE_D';
    renderFn();
    if (tt.style.display === 'STALE_D') {
      issues.push('F2 style.display-write violated — expected "none", got STALE_D (style.display write dropped — T2)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,         target_id: null },
    { id: 'F1', fn: runF1_tooltipNotRetrieved,   target_id: 'T1' },
    { id: 'F2', fn: runF2_styleDisplayDropped,   target_id: 'T2' }
  ];
};
