// e62-fixtures.js — per-function probes for E62 showTooltip
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs with sentinel
// values. The healthy mirror performs the operations and OVERWRITES the
// sentinel. The broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// showTooltip is the entry-point mouse-enter handler that creates/retrieves
// the tooltip element, builds an innerHTML payload from the node's fields
// (label, id, ntype, status, score, description), sets style.display='block',
// and delegates to moveTooltip for positioning.
//
// Test node (mirrors a typical D2 dimension entry):
//   {
//     id: 'D-PTAX',
//     label: 'PTAX Vol',
//     ntype: 'data',
//     status: 'GREEN',
//     score: 78,
//     description: 'Câmbio stress'
//   }
// Event: { clientX: 100, clientY: 200 } → after +14 offset: left='114px', top='214px'.
//
// Expected healthy innerHTML contains:
//   'PTAX Vol' (label), 'D-PTAX' (id), 'data' (ntype),
//   'GREEN' (status), '78/100' (score formatted), 'Câmbio stress' (description).
//
// Fixtures (F0..F4):
//   F0 — healthy control: tooltip created/appended, innerHTML contains all 6
//        expected substrings, display='block', left='114px', top='214px'.
//   F1 — dropInv1a (node guard + _getTooltip): tooltip should be created AND
//        have correct content/position. T1 bails early — tooltip never
//        created → 1 issue (PASS in BASELINE).
//   F2 — dropInv1b (innerHTML write): pre-seed innerHTML with STALE_HTML.
//        Healthy overwrites with the composition. T2 leaves it at sentinel.
//        Detection: innerHTML === 'STALE_HTML' → 1 issue.
//   F3 — dropInv1c (style.display write): pre-seed display with STALE_D.
//        Healthy overwrites to 'block'. T3 leaves sentinel.
//        Detection: display === 'STALE_D' → 1 issue.
//   F4 — dropInv1d (moveTooltip call): pre-seed left/top with STALE_L/STALE_T.
//        Healthy calls moveTooltip which writes '114px'/'214px'. T4 leaves
//        sentinels. Detection: 2 issues (left + top).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 invariant groups execute correctly.
  // Checks: tooltip created/appended, innerHTML contains all 6 expected
  // substrings (label, id, ntype, status, score, description), display
  // = 'block', left='114px', top='214px'.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    deps.setNode({
      id: 'D-PTAX',
      label: 'PTAX Vol',
      ntype: 'data',
      status: 'GREEN',
      score: 78,
      description: 'Câmbio stress'
    });
    renderFn();
    var issues = [];

    var tt = deps.getTooltip();
    if (!tt || !tt._appendedToBody) {
      issues.push('F0 tooltip-missing violated — expected tooltip to be created and appended, but _appendedToBody=' + JSON.stringify(tt && tt._appendedToBody));
      return issues;
    }
    if (tt.id !== 'd3-node-tooltip') {
      issues.push('F0 tooltip-id violated — expected id="d3-node-tooltip", got ' + JSON.stringify(tt.id));
    }

    // 1b evidence: innerHTML composition contains all 6 expected substrings.
    if (tt.innerHTML.indexOf('PTAX Vol') < 0)       issues.push('F0 innerHTML-label violated — expected substring "PTAX Vol", got ' + JSON.stringify(tt.innerHTML));
    if (tt.innerHTML.indexOf('D-PTAX') < 0)         issues.push('F0 innerHTML-id violated — expected substring "D-PTAX", got ' + JSON.stringify(tt.innerHTML));
    if (tt.innerHTML.indexOf('data') < 0)           issues.push('F0 innerHTML-ntype violated — expected substring "data", got ' + JSON.stringify(tt.innerHTML));
    if (tt.innerHTML.indexOf('GREEN') < 0)          issues.push('F0 innerHTML-status violated — expected substring "GREEN", got ' + JSON.stringify(tt.innerHTML));
    if (tt.innerHTML.indexOf('78/100') < 0)         issues.push('F0 innerHTML-score violated — expected substring "78/100", got ' + JSON.stringify(tt.innerHTML));
    if (tt.innerHTML.indexOf('Câmbio stress') < 0)  issues.push('F0 innerHTML-description violated — expected substring "Câmbio stress", got ' + JSON.stringify(tt.innerHTML));

    // 1c evidence: display='block'
    if (tt.style.display !== 'block') issues.push('F0 style.display violated — expected "block", got ' + JSON.stringify(tt.style.display));

    // 1d evidence: moveTooltip delegation wrote left='114px' and top='214px'
    if (tt.style.left !== '114px') issues.push('F0 style.left violated — expected "114px", got ' + JSON.stringify(tt.style.left));
    if (tt.style.top  !== '214px') issues.push('F0 style.top violated — expected "214px", got ' + JSON.stringify(tt.style.top));
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (node guard + _getTooltip): tooltip should be created
  // AND have correct content/position. T1 bails early — tooltip never
  // created. Healthy creates it and writes the full payload.
  // ============================================================
  function runF1_tooltipNeverCreated(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    deps.setNode({
      id: 'D-PTAX', label: 'PTAX Vol', ntype: 'data',
      status: 'GREEN', score: 78, description: 'Câmbio stress'
    });
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt || !tt._appendedToBody) {
      issues.push('F1 tooltip-creation violated — expected tooltip to be created and appended to body (1a dropped — T1)');
    }
    // Regression check: when tooltip exists, it must have correct payload +
    // position. Healthy satisfies both; T1 bails before writes so no tooltip
    // exists and these are skipped.
    if (tt) {
      if (tt.innerHTML.indexOf('PTAX Vol') < 0)  issues.push('F1 innerHTML-label violated — expected "PTAX Vol"');
      if (tt.style.display !== 'block')         issues.push('F1 style.display violated — expected "block", got ' + JSON.stringify(tt.style.display));
      if (tt.style.left !== '114px')            issues.push('F1 style.left violated — expected "114px", got ' + JSON.stringify(tt.style.left));
      if (tt.style.top  !== '214px')            issues.push('F1 style.top violated — expected "214px", got ' + JSON.stringify(tt.style.top));
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (innerHTML write): pre-seed innerHTML with STALE_HTML.
  // Healthy overwrites with the HTML composition. T2 leaves it at sentinel.
  // ============================================================
  function runF2_innerHTMLDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    deps.setNode({
      id: 'D-PTAX', label: 'PTAX Vol', ntype: 'data',
      status: 'GREEN', score: 78, description: 'Câmbio stress'
    });
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.innerHTML = 'STALE_HTML';
    renderFn();
    if (tt.innerHTML === 'STALE_HTML') {
      issues.push('F2 innerHTML-write violated — expected healthy HTML composition, got STALE_HTML (innerHTML write dropped — T2)');
    }
    return issues;
  }

  // ============================================================
  // F3 — dropInv1c (style.display write): pre-seed display with STALE_D.
  // Healthy overwrites to 'block'. T3 leaves sentinel.
  // ============================================================
  function runF3_styleDisplayDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    deps.setNode({
      id: 'D-PTAX', label: 'PTAX Vol', ntype: 'data',
      status: 'GREEN', score: 78, description: 'Câmbio stress'
    });
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.style.display = 'STALE_D';
    renderFn();
    if (tt.style.display === 'STALE_D') {
      issues.push('F3 style.display-write violated — expected "block", got STALE_D (style.display write dropped — T3)');
    }
    return issues;
  }

  // ============================================================
  // F4 — dropInv1d (moveTooltip call): pre-seed left/top with sentinels.
  // Healthy calls moveTooltip which writes '114px'/'214px'. T4 leaves
  // sentinels (because moveTooltip is never invoked from showTooltip).
  // ============================================================
  function runF4_moveTooltipDropped(renderFn) {
    deps.resetEnv();
    deps.makeEvent(100, 200);
    deps.setNode({
      id: 'D-PTAX', label: 'PTAX Vol', ntype: 'data',
      status: 'GREEN', score: 78, description: 'Câmbio stress'
    });
    renderFn();
    var issues = [];
    var tt = deps.getTooltip();
    if (!tt) return issues;
    tt.style.left = 'STALE_L';
    tt.style.top  = 'STALE_T';
    renderFn();
    if (tt.style.left === 'STALE_L') {
      issues.push('F4 style.left-write violated — expected "114px", got STALE_L (moveTooltip call dropped — T4)');
    }
    if (tt.style.top === 'STALE_T') {
      issues.push('F4 style.top-write violated — expected "214px", got STALE_T (moveTooltip call dropped — T4)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,            target_id: null },
    { id: 'F1', fn: runF1_tooltipNeverCreated,      target_id: 'T1' },
    { id: 'F2', fn: runF2_innerHTMLDropped,          target_id: 'T2' },
    { id: 'F3', fn: runF3_styleDisplayDropped,      target_id: 'T3' },
    { id: 'F4', fn: runF4_moveTooltipDropped,        target_id: 'T4' }
  ];
};
