// e87-fixtures.js — per-function probes for E87 updateLayerButtons
//
// Inverted mutant-detection: each fixture pre-seeds a currentLayer
// and currentView, then mocks document.querySelectorAll('.layer-btn')
// to return a fixed list of buttons whose .classList.toggle,
// .disabled, .style.opacity/cursor, and .title are captured into
// module-level globals. Healthy version: iterates, sets active
// class when data-layer === currentLayer, then sets disabled /
// opacity / cursor / title based on (currentView === 'overview' ||
// currentView === 'flow'). Broken mutant drops a sub-check →
// distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L3964-3975 (updateLayerButtons).
//
// Topology (5 sub-checks):
//   1a. active toggle: toggle 'active' iff data-layer===currentLayer.
//   1b. disabled: btn.disabled = !layerActive.
//   1c. opacity: 1 when layerActive, 0.4 otherwise.
//   1d. cursor: 'pointer' when layerActive, 'not-allowed' otherwise.
//   1e. title: '' when layerActive, 'Layers apply only to
//       Overview / Flow views' otherwise.
//
// Fixtures (F0..F5):
//   F0 — healthy control: 5 cases × 2 views (overview, flow, drill).
//   F1 — dropInv1a (active toggle). No classList.toggle on buttons.
//   F2 — dropInv1b (disabled). disabled stays default (false) when
//        layerActive=false (drill view).
//   F3 — dropInv1c (opacity). opacity stays default ('') when
//        layerActive=false.
//   F4 — dropInv1d (cursor). cursor stays default ('').
//   F5 — dropInv1e (title). title stays default ('').

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 5 invariants × 2 views.
  // ============================================================
  function runF0_healthyControl(updateFn) {
    var issues = [];

    // ---------- view=overview (layerActive=true) ----------
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('overview');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    // active toggle: data-layer='d2' should be active.
    var foundD2 = false;
    deps.getCaptured().forEach(function (rec) {
      if (rec.layer === 'd2' && rec.active) foundD2 = true;
      if (rec.layer !== 'd2' && rec.active) {
        issues.push("F0 overview active — layer '" + rec.layer + "' should NOT be active when currentLayer='d2'");
      }
    });
    if (!foundD2) {
      issues.push("F0 overview active — 'd2' button should be active when currentLayer='d2'");
    }

    // disabled=false for all buttons in overview.
    deps.getCaptured().forEach(function (rec) {
      if (rec.disabled !== false) {
        issues.push('F0 overview disabled — layer ' + rec.layer + ' expected disabled=false, got ' + rec.disabled);
      }
    });

    // opacity='1' for all.
    deps.getCaptured().forEach(function (rec) {
      if (rec.opacity !== '1') {
        issues.push('F0 overview opacity — layer ' + rec.layer + ' expected opacity="1", got "' + rec.opacity + '"');
      }
    });

    // cursor='pointer'.
    deps.getCaptured().forEach(function (rec) {
      if (rec.cursor !== 'pointer') {
        issues.push('F0 overview cursor — layer ' + rec.layer + ' expected cursor="pointer", got "' + rec.cursor + '"');
      }
    });

    // title=''.
    deps.getCaptured().forEach(function (rec) {
      if (rec.title !== '') {
        issues.push('F0 overview title — layer ' + rec.layer + ' expected title="", got "' + rec.title + '"');
      }
    });

    // ---------- view=drill (layerActive=false) ----------
    deps.resetEnv();
    deps.setCurrentLayer('data');
    deps.setCurrentView('drill');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    // disabled=true.
    deps.getCaptured().forEach(function (rec) {
      if (rec.disabled !== true) {
        issues.push('F0 drill disabled — layer ' + rec.layer + ' expected disabled=true, got ' + rec.disabled);
      }
    });

    // opacity='0.4'.
    deps.getCaptured().forEach(function (rec) {
      if (rec.opacity !== '0.4') {
        issues.push('F0 drill opacity — layer ' + rec.layer + ' expected opacity="0.4", got "' + rec.opacity + '"');
      }
    });

    // cursor='not-allowed'.
    deps.getCaptured().forEach(function (rec) {
      if (rec.cursor !== 'not-allowed') {
        issues.push('F0 drill cursor — layer ' + rec.layer + ' expected cursor="not-allowed", got "' + rec.cursor + '"');
      }
    });

    // title='Layers apply only to Overview / Flow views'.
    deps.getCaptured().forEach(function (rec) {
      if (rec.title !== 'Layers apply only to Overview / Flow views') {
        issues.push('F0 drill title — layer ' + rec.layer + ' expected title="Layers apply only to Overview / Flow views", got "' + rec.title + '"');
      }
    });

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (active toggle). buttons never get classList.toggle.
  // ============================================================
  function runF1_activeToggleDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('overview');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    if (captured.length === 0) return ['F1 — seedButtons produced no buttons'];

    var toggleSeen = false;
    captured.forEach(function (rec) { if (rec.toggleCount > 0) toggleSeen = true; });
    if (!toggleSeen) {
      return ['F1 active toggle drop detected — broken did NOT call classList.toggle on any button (healthy toggles active for the matching layer)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (disabled). drill view should set disabled=true.
  // ============================================================
  function runF2_disabledDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('drill');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    var sawTrueDisabled = false;
    captured.forEach(function (rec) { if (rec.disabled === true) sawTrueDisabled = true; });
    if (!sawTrueDisabled) {
      return ['F2 disabled drop detected — broken left disabled=false on drill view (healthy sets disabled=true when layerActive=false)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (opacity). drill view should set opacity='0.4'.
  // ============================================================
  function runF3_opacityDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('drill');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    var sawPointFour = false;
    captured.forEach(function (rec) { if (rec.opacity === '0.4') sawPointFour = true; });
    if (!sawPointFour) {
      return ['F3 opacity drop detected — broken did NOT set opacity="0.4" on drill view (healthy sets opacity=0.4 when layerActive=false)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (cursor). drill view should set cursor='not-allowed'.
  // ============================================================
  function runF4_cursorDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('drill');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    var sawNotAllowed = false;
    captured.forEach(function (rec) { if (rec.cursor === 'not-allowed') sawNotAllowed = true; });
    if (!sawNotAllowed) {
      return ['F4 cursor drop detected — broken did NOT set cursor="not-allowed" on drill view (healthy sets cursor=not-allowed when layerActive=false)'];
    }
    return [];
  }

  // ============================================================
  // F5 — dropInv1e (title). drill view should set title to guidance string.
  // ============================================================
  function runF5_titleDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentLayer('d2');
    deps.setCurrentView('drill');
    deps.seedButtons(['d1', 'd2', 'd3']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    var sawTitle = false;
    captured.forEach(function (rec) { if (rec.title === 'Layers apply only to Overview / Flow views') sawTitle = true; });
    if (!sawTitle) {
      return ['F5 title drop detected — broken did NOT set the guidance title on drill view (healthy sets "Layers apply only to Overview / Flow views" when layerActive=false)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,           target_id: null },
    { id: 'F1', fn: runF1_activeToggleDropped,     target_id: 'T1' },
    { id: 'F2', fn: runF2_disabledDropped,         target_id: 'T2' },
    { id: 'F3', fn: runF3_opacityDropped,          target_id: 'T3' },
    { id: 'F4', fn: runF4_cursorDropped,           target_id: 'T4' },
    { id: 'F5', fn: runF5_titleDropped,            target_id: 'T5' }
  ];
};