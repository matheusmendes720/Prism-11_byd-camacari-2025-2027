// e102-fixtures.js — per-function probes for E102 renderBottomBar
//
// renderBottomBar() sets four bottom-bar chips:
//   bottom-backtesting, bottom-composite, bottom-red-count, bottom-version.
// Invariants (for bottom-version):
//   1a. #bottom-version textContent includes 'D3'.
//   1b. #bottom-version textContent includes JSON_ENVELOPE.meta_version.
//
// Source — D3-PITCH-GRAPH.html L1394-1431 (renderBottomBar).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. renderBottomBar() should set bottom-version.
  // ============================================================
  function runF0_healthyControl(fn) {
    var issues = [];

    deps.resetEnv();
    fn();
    var snap = deps.getSnapshot();

    // 1a. bottom-version should include 'D3'
    if (!snap.versionText || snap.versionText.indexOf('D3') === -1) {
      issues.push('F0 1a — bottom-version should include "D3"');
    }

    // 1b. bottom-version should include meta_version
    if (!snap.versionText || snap.versionText.indexOf(mockMetaVersion) === -1) {
      issues.push('F0 1b — bottom-version should include meta_version "' + mockMetaVersion + '"');
    }

    return issues;
  }

  var mockMetaVersion = '1.0';

  return [
    { id: 'F0', fn: runF0_healthyControl, target_id: null }
  ];
};
