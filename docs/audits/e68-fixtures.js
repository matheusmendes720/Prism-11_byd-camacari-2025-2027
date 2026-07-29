// e68-fixtures.js — per-function probes for E68 updateTourCounter
//
// Inverted mutant-detection: each fixture PRE-SEEDS the tourSteps tracker,
// the tourIdx counter, and the textContent sink with sentinel values. The
// healthy mirror performs the operations and OVERWRITES the sentinel. The
// broken mutant drops the operation → sentinel survives → fixture reports
// issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// updateTourCounter refreshes the tour progress counter in the DOM.
// State mutation (tourSteps refresh) + DOM write (textContent assignment).
//
// Topology (mirrors L3873-3876):
//   function updateTourCounter() {
//     1a. tourSteps = getTourSteps();        (refresh from source-of-truth)
//     1b. document.getElementById('tour-step-count').textContent =
//           (tourIdx+1) + ' / ' + tourSteps.length;
//   }
//
// Fixtures (F0..F2):
//   F0 — healthy control (tourIdx=1, getTourSteps returns length=3):
//        tourSteps becomes length-3 array (refreshed), textContent='2 / 3'.
//   F1 — dropInv1a (getTourSteps call drop): pre-seed tourSteps to length-5
//        array. Healthy → tourSteps refreshed to length-3 AND textContent
//        becomes '2 / 3'. T1 → tourSteps stays length-5 AND textContent
//        becomes '2 / 5' → both invariants violated (2 issues).
//   F2 — dropInv1b (textContent assignment drop): textContent pre-seeded to
//        'PLACEHOLDER'. Healthy → textContent='2 / 3'. T2 → stays
//        'PLACEHOLDER' → 1 issue.
//
// 2 mutants × 1 target fixture + 2 controls (fixtures × healthy) = 4 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control (tourIdx=1, getTourSteps returns length=3).
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    renderFn();
    var issues = [];

    var freshTourSteps = deps.getTourStepsReturn();
    if (deps.getTourSteps() !== freshTourSteps) {
      issues.push('F0 tourSteps violated — expected fresh array reference, got ' + JSON.stringify(deps.getTourSteps()));
    }
    if (deps.getTourSteps().length !== 3) {
      issues.push('F0 tourSteps.length violated — expected 3, got ' + deps.getTourSteps().length);
    }
    if (deps.getTourStepCountTextContent() !== '2 / 3') {
      issues.push('F0 textContent violated — expected "2 / 3", got ' + JSON.stringify(deps.getTourStepCountTextContent()));
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (getTourSteps call drop): pre-seed tourSteps to
  // length-5 array. Healthy → refreshed to length-3, textContent='2 / 3'.
  // T1 → tourSteps stays length-5, textContent='2 / 5'.
  // ============================================================
  function runF1_getTourStepsDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    deps.setTourSteps([{}, {}, {}, {}, {}]); // pre-seed stale length-5 array
    var preCallTourSteps = deps.getTourSteps();
    renderFn();
    var issues = [];

    if (deps.getTourSteps() === preCallTourSteps) {
      issues.push('F1 tourSteps violated — expected fresh reference (getTourSteps call dropped — T1), got same reference ' + JSON.stringify(preCallTourSteps));
    }
    if (deps.getTourSteps().length !== 3) {
      issues.push('F1 tourSteps.length violated — expected 3 (refreshed), got ' + deps.getTourSteps().length + ' (getTourSteps call dropped — T1)');
    }
    if (deps.getTourStepCountTextContent() !== '2 / 3') {
      issues.push('F1 textContent violated — expected "2 / 3" (refreshed tourSteps length), got ' + JSON.stringify(deps.getTourStepCountTextContent()) + ' (getTourSteps call dropped — T1)');
    }
    return issues;
  }

  // ============================================================
  // F2 — dropInv1b (textContent assignment drop): textContent pre-seeded
  // to 'PLACEHOLDER'. Healthy → textContent='2 / 3'. T2 → stays
  // 'PLACEHOLDER' → 1 issue.
  // ============================================================
  function runF2_textContentAssignmentDropped(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(1);
    deps.setTourStepCountTextContent('PLACEHOLDER');
    renderFn();
    var issues = [];

    if (deps.getTourStepCountTextContent() !== '2 / 3') {
      issues.push('F2 textContent violated — expected "2 / 3", got ' + JSON.stringify(deps.getTourStepCountTextContent()) + ' (textContent assignment dropped — T2)');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                        target_id: null },
    { id: 'F1', fn: runF1_getTourStepsDropped,                  target_id: 'T1' },
    { id: 'F2', fn: runF2_textContentAssignmentDropped,         target_id: 'T2' }
  ];
};