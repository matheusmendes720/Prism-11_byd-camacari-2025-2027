// e76-fixtures.js — per-function probes for E76 updateLayerButtons
//
// Inverted mutant-detection: each fixture pre-seeds currentView +
// currentLayer and a sentinel `mockBtns` array. The healthy mirror
// mutates the buttons (active class, disabled, opacity, cursor,
// title). The broken mutant drops a mutation → state stays at
// sentinel → fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// Source — D3-PITCH-GRAPH.html L3964-3975:
//   function updateLayerButtons() {
//     const layerActive = (currentView === 'overview' || currentView === 'flow');
//     document.querySelectorAll('.layer-btn').forEach(btn => {
//       const isActive = btn.getAttribute('data-layer') === currentLayer;
//       btn.classList.toggle('active', isActive);
//       btn.disabled = !layerActive;
//       btn.style.opacity = layerActive ? '1' : '0.4';
//       btn.style.cursor = layerActive ? 'pointer' : 'not-allowed';
//       btn.title = layerActive ? '' : 'Layers apply only to Overview / Flow views';
//     });
//   }
//
// Topology (4 sub-checks):
//   1a. layerActive gate: true when currentView ∈ {overview, flow},
//       false otherwise.
//   1b. 'active' class toggle: btn.classList.toggle('active', isActive),
//       where isActive = (btn.dataset.layer === currentLayer).
//   1c. disabled property: btn.disabled = !layerActive.
//   1d. opacity/cursor/title triple: bulk per-button.
//
// Fixtures (F0..F4):
//   F0 — healthy control: cycles through 2 views (overview, macro).
//   F1 — dropInv1a (layerActive gate drop → constant false).
//        Healthy for currentView='overview' → all btn.disabled=false.
//        T1 → all btn.disabled=true.
//   F2 — dropInv1b (active class toggle drop).
//        Healthy → macroBtn has 'active', microBtn does not.
//        T2 → neither has 'active'.
//   F3 — dropInv1c (disabled prop drop → constant true).
//        Healthy for currentView='overview' → all btn.disabled=false.
//        T3 → all btn.disabled=true.
//   F4 — dropInv1d (opacity/cursor/title triple drop → inert values).
//        Healthy for currentView='overview' → opacity='1', cursor='pointer',
//        title=''. T4 → opacity='0.4', cursor='not-allowed', title set.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. Both views.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // currentView='overview', currentLayer='macro'
    deps.resetEnv();
    deps.setView('overview'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }, { layer: 'micro' }]);
    renderFn();
    var btns1 = deps.getMockBtns();
    if (btns1[0].disabled !== false) {
      issues.push('F0 (overview) btn0.disabled violated — expected false, got ' + btns1[0].disabled);
    }
    if (btns1[0].style.opacity !== '1') {
      issues.push('F0 (overview) btn0.opacity violated — expected "1", got "' + btns1[0].style.opacity + '"');
    }
    if (btns1[0].style.cursor !== 'pointer') {
      issues.push('F0 (overview) btn0.cursor violated — expected "pointer", got "' + btns1[0].style.cursor + '"');
    }
    if (btns1[0].title !== '') {
      issues.push('F0 (overview) btn0.title violated — expected "", got "' + btns1[0].title + '"');
    }
    if (!btns1[0].classes.has('active')) {
      issues.push('F0 (overview) btn0.active class missing — macro layer should match');
    }
    if (btns1[1].classes.has('active')) {
      issues.push('F0 (overview) btn1.active class wrongly set — micro layer should not match');
    }

    // currentView='macro' (NOT in {overview, flow})
    deps.resetEnv();
    deps.setView('macro'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }]);
    renderFn();
    var btns2 = deps.getMockBtns();
    if (btns2[0].disabled !== true) {
      issues.push('F0 (macro view) btn0.disabled violated — expected true, got ' + btns2[0].disabled);
    }
    if (btns2[0].style.opacity !== '0.4') {
      issues.push('F0 (macro view) btn0.opacity violated — expected "0.4", got "' + btns2[0].style.opacity + '"');
    }
    if (btns2[0].title !== 'Layers apply only to Overview / Flow views') {
      issues.push('F0 (macro view) btn0.title violated — expected gate text, got "' + btns2[0].title + '"');
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (layerActive gate drop → constant false).
  // currentView='overview', healthy → disabled=false. T1 → disabled=true.
  // ============================================================
  function runF1_layerActiveGateDropped(renderFn) {
    deps.resetEnv();
    deps.setView('overview'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }]);
    renderFn();
    var btns = deps.getMockBtns();
    if (btns[0].disabled !== false) {
      return ['F1 layerActive gate drop violated — expected btn.disabled=false (overview active), got ' + btns[0].disabled];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b ('active' class toggle drop).
  // Healthy → macroBtn has 'active', microBtn does not.
  // T2 → neither has 'active'.
  // ============================================================
  function runF2_activeClassDropped(renderFn) {
    deps.resetEnv();
    deps.setView('overview'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }, { layer: 'micro' }]);
    renderFn();
    var btns = deps.getMockBtns();
    if (!btns[0].classes.has('active')) {
      return ['F2 active class toggle drop violated — btn0 (macro) should have "active" class'];
    }
    if (btns[1].classes.has('active')) {
      return ['F2 active class toggle drop violated — btn1 (micro) should NOT have "active" class'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (disabled prop drop → constant true).
  // currentView='overview', healthy → disabled=false. T3 → disabled=true.
  // ============================================================
  function runF3_disabledDropped(renderFn) {
    deps.resetEnv();
    deps.setView('overview'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }]);
    renderFn();
    var btns = deps.getMockBtns();
    if (btns[0].disabled !== false) {
      return ['F3 disabled prop drop violated — expected btn.disabled=false (overview active), got ' + btns[0].disabled];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (opacity/cursor/title triple drop → inert values).
  // currentView='overview'. Healthy → opacity='1', cursor='pointer',
  // title=''. T4 → opacity='0.4', cursor='not-allowed', title='Layers apply...'.
  // ============================================================
  function runF4_visualTripleDropped(renderFn) {
    deps.resetEnv();
    deps.setView('overview'); deps.setLayer('macro');
    deps.setMockBtns([{ layer: 'macro' }]);
    renderFn();
    var btns = deps.getMockBtns();
    if (btns[0].style.opacity !== '1') {
      return ['F4 opacity drop violated — expected "1", got "' + btns[0].style.opacity + '"'];
    }
    if (btns[0].style.cursor !== 'pointer') {
      return ['F4 cursor drop violated — expected "pointer", got "' + btns[0].style.cursor + '"'];
    }
    if (btns[0].title !== '') {
      return ['F4 title drop violated — expected "", got "' + btns[0].title + '"'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,         target_id: null },
    { id: 'F1', fn: runF1_layerActiveGateDropped, target_id: 'T1' },
    { id: 'F2', fn: runF2_activeClassDropped,     target_id: 'T2' },
    { id: 'F3', fn: runF3_disabledDropped,        target_id: 'T3' },
    { id: 'F4', fn: runF4_visualTripleDropped,    target_id: 'T4' }
  ];
};