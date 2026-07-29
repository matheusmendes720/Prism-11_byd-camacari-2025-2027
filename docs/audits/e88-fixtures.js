// e88-fixtures.js — per-function probes for E88 updateViewButtons
//
// Inverted mutant-detection: each fixture pre-seeds currentView and a
// mock document.querySelectorAll('.view-btn') that returns a fixed list
// of buttons whose classList.toggle is captured. Healthy version:
// iterates all view-btn elements, toggles 'active' to true iff
// data-view === currentView (removing it from all others). Broken
// mutant drops the entire classList.toggle call → all buttons stay
// at their seeded _active=false state → detection.
//
// Source — D3-PITCH-GRAPH.html L3976-3978 (updateViewButtons).
//
// Topology (1 invariant):
//   1a. active toggle: classList.toggle('active', data-view===currentView).
//
// Fixtures (F0..F1):
//   F0 — healthy control: 3 views × buttons verifying correct active state.
//   F1 — dropInv1 (toggle dropped). toggleCount stays 0 on all buttons.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 3 views, verify correct active mapping.
  // ============================================================
  function runF0_healthyControl(updateFn) {
    var issues = [];
    var views = ['overview', 'flow', 'drill'];
    var allLayers = ['overview', 'flow', 'drill'];

    views.forEach(function (currentView) {
      deps.resetEnv();
      deps.setCurrentView(currentView);
      deps.seedButtons(allLayers);
      updateFn();
      deps.snapshotCaptured();

      deps.getCaptured().forEach(function (rec) {
        var shouldBeActive = (rec.view === currentView);
        if (rec.active !== shouldBeActive) {
          issues.push('F0 view=' + currentView + ' — button data-view="' + rec.view +
            '" expected active=' + shouldBeActive + ', got ' + rec.active);
        }
      });
    });

    return issues;
  }

  // ============================================================
  // F1 — dropInv1. No classList.toggle at all — all stay _active=false.
  // ============================================================
  function runF1_toggleDropped(updateFn) {
    deps.resetEnv();
    deps.setCurrentView('flow');
    deps.seedButtons(['overview', 'flow', 'drill']);
    updateFn();
    deps.snapshotCaptured();

    var captured = deps.getCaptured();
    if (captured.length === 0) return ['F1 — seedButtons produced no buttons'];

    var toggleSeen = false;
    captured.forEach(function (rec) { if (rec.toggleCount > 0) toggleSeen = true; });
    if (!toggleSeen) {
      return ['F1 toggle drop detected — broken did NOT call classList.toggle on any button (healthy toggles active for the matching view)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null },
    { id: 'F1', fn: runF1_toggleDropped, target_id: 'T1' }
  ];
};
