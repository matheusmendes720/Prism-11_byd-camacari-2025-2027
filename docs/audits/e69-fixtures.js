// e69-fixtures.js — per-function probes for E69 getTourSteps
//
// Inverted mutant-detection: each fixture pre-seeds the tours catalog and
// the currentTourId selector with sentinel values. The healthy mirror
// performs the operations and returns the expected array. The broken
// mutant drops the operation → sentinel/wrong-type survives → fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// getTourSteps is the source-of-truth for the current tour's step array.
// Called by updateTourCounter (E68) before re-rendering. Two ops:
//
//   1a. tours.find(t => t.id === currentTourId)  (catalog lookup)
//   1b. return t ? t.steps : []                   (extract OR fallback)
//
// If 1a dropped, the function returns undefined (no lookup happened) —
// caller would crash on .length / forEach.
//
// If 1b dropped, the function returns the tour OBJECT (truthy t) instead
// of its steps array — caller would iterate over id/label instead of
// step content.
//
// Fixtures (F0..F2):
//   F0 — healthy control (matched): currentTourId='tour-a', tours has
//        matching entry with steps=[s0,s1,s2]. Returns [s0,s1,s2].
//   F1 — dropInv1a: same setup. T1 returns undefined. Healthy → 3-elem
//        array. 1 issue.
//   F2 — dropInv1b: same setup. T2 returns tour object (not array).
//        Healthy → 3-elem array. 1 issue.
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control (matched tour): tours has the active tour with
  // steps=[s0,s1,s2]. currentTourId='tour-a' → returns steps.
  // ============================================================
  function runF0_matchedHealthyControl(renderFn) {
    deps.resetEnv();
    deps.setTours([
      { id: 'tour-a', label: 'Onboarding', steps: [{ id: 's0' }, { id: 's1' }, { id: 's2' }] }
    ]);
    deps.setCurrentTourId('tour-a');
    var ret = renderFn();
    var issues = [];

    if (!Array.isArray(ret)) {
      issues.push('F0 ret violated — expected array, got ' + (ret === undefined ? 'undefined' : typeof ret) + ' (' + JSON.stringify(ret) + ')');
    } else if (ret.length !== 3) {
      issues.push('F0 ret.length violated — expected 3, got ' + ret.length);
    } else if (ret[0].id !== 's0' || ret[1].id !== 's1' || ret[2].id !== 's2') {
      issues.push('F0 ret contents violated — expected [s0, s1, s2], got ' + JSON.stringify(ret));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (find call drop): same setup as F0. T1 returns
  // undefined (no lookup happened). Healthy → 3-elem array.
  // ============================================================
  function runF1_findDropped(renderFn) {
    deps.resetEnv();
    deps.setTours([
      { id: 'tour-a', label: 'Onboarding', steps: [{ id: 's0' }, { id: 's1' }, { id: 's2' }] }
    ]);
    deps.setCurrentTourId('tour-a');
    var ret = renderFn();
    var issues = [];

    if (!Array.isArray(ret)) {
      issues.push('F1 ret violated — expected array (find call succeeded), got ' + (ret === undefined ? 'undefined' : typeof ret) + ' (find call dropped — T1)');
    } else if (ret.length !== 3) {
      issues.push('F1 ret.length violated — expected 3, got ' + ret.length + ' (find call dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (ternary extract drop): same setup as F0. T2 returns
  // the tour object (truthy t), NOT t.steps. Healthy → 3-elem array.
  // ============================================================
  function runF2_ternaryDropped(renderFn) {
    deps.resetEnv();
    deps.setTours([
      { id: 'tour-a', label: 'Onboarding', steps: [{ id: 's0' }, { id: 's1' }, { id: 's2' }] }
    ]);
    deps.setCurrentTourId('tour-a');
    var ret = renderFn();
    var issues = [];

    if (!Array.isArray(ret)) {
      issues.push('F2 ret violated — expected array (t.steps extracted via ternary), got ' + typeof ret + ' (' + JSON.stringify(ret) + ') (ternary extract dropped — T2)');
    } else if (ret.length !== 3) {
      issues.push('F2 ret.length violated — expected 3, got ' + ret.length + ' (ternary extract dropped — T2)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_matchedHealthyControl, target_id: null },
    { id: 'F1', fn: runF1_findDropped,          target_id: 'T1' },
    { id: 'F2', fn: runF2_ternaryDropped,       target_id: 'T2' }
  ];
};