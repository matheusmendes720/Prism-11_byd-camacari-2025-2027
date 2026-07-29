// e55-fixtures.js — per-function probes for E55 showTourStep
//
// Inverted mutant-detection: each fixture PRE-SEEDS the DOM stubs with a
// sentinel value. The healthy mirror performs the operation and OVERWRITES
// the sentinel with the step's value. The broken mutant drops the operation
// → sentinel survives in the stub → fixture reports issue → runner says PASS.
//
// Fixtures (F0..F4):
//   F0 — healthy control (all 4 op groups complete, no sentinel survives).
//   F1 — #tour-progress-bar.innerHTML + #tour-step.textContent pre-seeded
//        with OLD_* → T1 (drop 1a). Healthy OVERWRITES; broken leaves OLD_*.
//   F2 — #tour-title/#tour-desc/#tour-hint/#tour-duration pre-seeded with
//        OLD_* → T2 (drop 1b). Healthy OVERWRITES; broken leaves OLD_*.
//   F3 — #tour-narration/{display, textContent} and #tour-action/{display,
//        textContent} pre-seeded with OLD_* → T3 (drop 1c). Healthy sets
//        display from step.{narration,action} and writes text; broken
//        leaves OLD_*.
//   F4 — tourIdx at last step + action_set present + #tour-restart.display
//        pre-seeded 'none' → T4 (drop 1d). Healthy sets display to
//        'inline-block'; broken leaves 'none'.
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 op groups perform their writes.
  // Verifies that with tourIdx=0 of 2, the step counter, title, etc.
  // match the step's fields.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var result = renderFn();
    var issues = [];

    var bar = deps.getProgressBar();
    var step = deps.getTourStep();
    var restart = deps.getRestart();

    // 1a evidence: bar.innerHTML contains a "current" dot for tourIdx=0
    if (!bar.innerHTML || bar.innerHTML.indexOf('current') === -1) {
      issues.push('F0 progress-bar violated — expected innerHTML to contain "current" marker, got ' + JSON.stringify(bar.innerHTML));
    }
    // 1a evidence: step counter mentions PASSO
    var stepCounter = deps.getStepCounter().textContent;
    if (stepCounter.indexOf('PASSO') === -1) {
      issues.push('F0 step-counter violated — expected "PASSO …", got ' + JSON.stringify(stepCounter));
    }
    // 1b evidence: title and desc textContents match step fields
    if (deps.getTitle().textContent !== step.title) {
      issues.push('F0 title violated — expected ' + JSON.stringify(step.title) + ', got ' + JSON.stringify(deps.getTitle().textContent));
    }
    if (deps.getDesc().textContent !== step.desc) {
      issues.push('F0 desc violated — expected ' + JSON.stringify(step.desc) + ', got ' + JSON.stringify(deps.getDesc().textContent));
    }
    // 1c evidence: with step.narration present, narration.display === 'block'
    //  and textContent === step.narration
    var narration = deps.getNarration();
    if (step.narration && narration.style.display !== 'block') {
      issues.push('F0 narration-display violated — expected "block", got ' + JSON.stringify(narration.style.display));
    }
    if (step.narration && narration.textContent !== step.narration) {
      issues.push('F0 narration-text violated — expected ' + JSON.stringify(step.narration) + ', got ' + JSON.stringify(narration.textContent));
    }
    var action = deps.getAction();
    if (step.action && action.style.display !== 'flex') {
      issues.push('F0 action-display violated — expected "flex", got ' + JSON.stringify(action.style.display));
    }
    if (step.action && action.textContent !== step.action) {
      issues.push('F0 action-text violated — expected ' + JSON.stringify(step.action) + ', got ' + JSON.stringify(action.textContent));
    }
    // 1d evidence: tourIdx=0, restart.display === 'none' (not last step)
    if (restart.style.display !== 'none') {
      issues.push('F0 restart-display violated — expected "none" for tourIdx=0, got ' + JSON.stringify(restart.style.display));
    }

    return issues;
  }

  // ============================================================
  // F1 — #tour-progress-bar.innerHTML + #tour-step.textContent pre-seeded
  // with OLD_* → T1 (drop 1a)
  // Healthy OVERWRITES with bar.innerHTML = progress dots and step counter.
  // Broken T1 leaves OLD_BAR / OLD_STEP.
  // ============================================================
  function runF1_progressDotsStale(renderFn) {
    deps.resetEnv();
    deps.getProgressBar().innerHTML = 'OLD_BAR';
    deps.getStepCounter().textContent = 'OLD_STEP';
    renderFn();
    var after = {
      bar: deps.getProgressBar().innerHTML,
      step: deps.getStepCounter().textContent
    };
    var issues = [];
    if (after.bar === 'OLD_BAR') {
      issues.push('F1 progress-bar-sentinel violated — expected healthy overwrite (contains progress dots), still OLD_BAR');
    }
    if (after.step === 'OLD_STEP') {
      issues.push('F1 step-counter-sentinel violated — expected healthy overwrite (PASSO 1 DE 2 …), still OLD_STEP');
    }
    return issues;
  }

  // ============================================================
  // F2 — title/desc/hint/duration pre-seeded OLD_* → T2 (drop 1b)
  // Healthy OVERWRITES. Broken T2 leaves all OLD_*.
  // ============================================================
  function runF2_titleDescHintDurationStale(renderFn) {
    deps.resetEnv();
    deps.getTitle().textContent     = 'OLD_TITLE';
    deps.getDesc().textContent      = 'OLD_DESC';
    deps.getHint().textContent      = 'OLD_HINT';
    deps.getDuration().textContent  = 'OLD_DURATION';
    renderFn();
    var after = {
      title:    deps.getTitle().textContent,
      desc:     deps.getDesc().textContent,
      hint:     deps.getHint().textContent,
      duration: deps.getDuration().textContent
    };
    var issues = [];
    if (after.title === 'OLD_TITLE') {
      issues.push('F2 title-sentinel violated — expected healthy overwrite, still OLD_TITLE');
    }
    if (after.desc === 'OLD_DESC') {
      issues.push('F2 desc-sentinel violated — expected healthy overwrite, still OLD_DESC');
    }
    if (after.hint === 'OLD_HINT') {
      issues.push('F2 hint-sentinel violated — expected healthy overwrite, still OLD_HINT');
    }
    if (after.duration === 'OLD_DURATION') {
      issues.push('F2 duration-sentinel violated — expected healthy overwrite, still OLD_DURATION');
    }
    return issues;
  }

  // ============================================================
  // F3 — narration/action display + text pre-seeded OLD_* → T3 (drop 1c)
  // Healthy sets display from step.{narration,action} and writes text.
  // Broken T3 leaves all OLD_*.
  // ============================================================
  function runF3_narrationActionStale(renderFn) {
    deps.resetEnv();
    var narration = deps.getNarration();
    narration.style.display = 'block';
    narration.textContent   = 'OLD_NARRATION';
    var action = deps.getAction();
    action.style.display    = 'flex';
    action.textContent      = 'OLD_ACTION';
    renderFn();
    var step = deps.getTourStep();
    var issues = [];
    var narAfter = deps.getNarration();
    var actAfter = deps.getAction();
    if (step.narration && narAfter.textContent === 'OLD_NARRATION') {
      issues.push('F3 narration-text-sentinel violated — expected overwrite to step.narration=' + JSON.stringify(step.narration) + ', still OLD_NARRATION');
    }
    if (step.action && actAfter.textContent === 'OLD_ACTION') {
      issues.push('F3 action-text-sentinel violated — expected overwrite to step.action=' + JSON.stringify(step.action) + ', still OLD_ACTION');
    }
    return issues;
  }

  // ============================================================
  // F4 — tourIdx set to last index, action_set present, restart.display
  // pre-seeded 'none' → T4 (drop 1d).
  // Healthy sets restart.display to 'inline-block' (last step). Broken T4
  // leaves 'none'.
  // ============================================================
  function runF4_restartVisibilityStale(renderFn) {
    deps.resetEnv();
    deps.setTourIdx(deps.getTourSteps().length - 1);
    deps.getRestart().style.display = 'none';
    renderFn();
    var after = deps.getRestart().style.display;
    var issues = [];
    if (after === 'none') {
      issues.push('F4 restart-visibility-sentinel violated — expected "inline-block" (last step), still "none"');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                       target_id: null },
    { id: 'F1', fn: runF1_progressDotsStale,                      target_id: 'T1' },
    { id: 'F2', fn: runF2_titleDescHintDurationStale,            target_id: 'T2' },
    { id: 'F3', fn: runF3_narrationActionStale,                   target_id: 'T3' },
    { id: 'F4', fn: runF4_restartVisibilityStale,                target_id: 'T4' }
  ];
};
