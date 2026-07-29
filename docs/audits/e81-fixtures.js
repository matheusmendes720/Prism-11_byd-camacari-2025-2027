// e81-fixtures.js — per-function probes for E81 statusThresholdToggle
//
// Inverted mutant-detection: each fixture pre-seeds STATUS_THRESHOLDS,
// dimData, mockLocalStorage, and repaint flags. Healthy version
// validates input → idempotency guard → mutate active → persist →
// reclassify dimData → repaint 4 dependents. Broken mutant drops a
// sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L1482-1528:
//   function statusThresholdToggle(value) {
//     try {
//       if (value !== 'legacy' && value !== 'authoritative') {
//         console.warn(...); return;
//       }
//       if (STATUS_THRESHOLDS.active === value) return; // idempotent
//       STATUS_THRESHOLDS.active = value;
//
//       try { localStorage.setItem('d3:status_threshold', value); }
//       catch (e) { console.warn(...); }
//
//       try {
//         if (typeof dimData === 'object' && dimData) {
//           Object.keys(dimData).forEach(function (k) {
//             const d = dimData[k];
//             if (d && typeof d.score === 'number') {
//               const s = STATUS_THRESHOLDS.status(d.score);
//               if (s) d.status = s;
//             }
//           });
//         }
//       } catch (e) { console.warn(...); }
//
//       renderCanvasLegend(); renderGlossary(); renderBottomBar(); build();
//     } catch (e) { console.warn(...); }
//   }
//
// Topology (4 sub-checks):
//   1a. validate input: only 'legacy' | 'authoritative'.
//   1b. idempotent guard: skip when active === value.
//   1c. STATUS_THRESHOLDS.active mutation.
//   1d. dimData reclassification (status from STATUS_THRESHOLDS.status(score)).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 cases.
//        (a) garbage input → no state change.
//        (b) legacy→authoritative → active changes, dimData reclassified,
//            repaint called once.
//        (c) same-value (legacy→legacy) → no repaint, no reclassify
//            (idempotent).
//        (d) score=70 with active=authoritative → status='AMBER'.
//   F1 — dropInv1a (validate input drop). 'garbage' → healthy no-op,
//        T1 sets STATUS_THRESHOLDS.active='garbage' and reclassifies.
//   F2 — dropInv1b (idempotent guard drop). legacy→legacy: healthy
//        no-op; T2 still reclassifies + repaints (calls visible).
//   F3 — dropInv1c (active mutation drop). legacy→authoritative:
//        healthy flips active; T3 keeps active='legacy'.
//   F4 — dropInv1d (dimData reclassification drop). score=70 active
//        authoritative: healthy sets status='AMBER'; T4 leaves
//        status untouched.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) garbage input → no state change.
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) {
        if (s >= 70) return 'GREEN';
        if (s >= 50) return 'AMBER';
        return 'RED';
      }
    });
    deps.setDimData({});
    renderFn('garbage');
    if (deps.getStatusThresholds().active !== 'legacy') {
      issues.push('F0 (a) garbage input — expected active to remain "legacy", got "' + deps.getStatusThresholds().active + '"');
    }

    // (b) legacy→authoritative → active flips + 4 repaints.
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) {
        if (s >= 80) return 'GREEN';
        if (s >= 65) return 'AMBER';
        return 'RED';
      }
    });
    deps.setDimData({});
    renderFn('authoritative');
    if (deps.getStatusThresholds().active !== 'authoritative') {
      issues.push('F0 (b) active flip — expected "authoritative", got "' + deps.getStatusThresholds().active + '"');
    }
    var r = deps.getRepaintCounts();
    if (r.canvas !== 1 || r.glossary !== 1 || r.bottom !== 1 || r.build !== 1) {
      issues.push('F0 (b) repaint counts — expected 1/1/1/1, got ' + r.canvas + '/' + r.glossary + '/' + r.bottom + '/' + r.build);
    }

    // (c) legacy→legacy (idempotent) → no repaint, no mutation.
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn('legacy');
    var r2 = deps.getRepaintCounts();
    if (r2.canvas !== 0 || r2.glossary !== 0 || r2.bottom !== 0 || r2.build !== 0) {
      issues.push('F0 (c) idempotent — expected 0/0/0/0, got ' + r2.canvas + '/' + r2.glossary + '/' + r2.bottom + '/' + r2.build);
    }

    // (d) score=70 active=authoritative → status='AMBER' (65 ≤ 70 < 80).
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'authoritative',
      status: function (s) {
        if (s >= 80) return 'GREEN';
        if (s >= 65) return 'AMBER';
        return 'RED';
      }
    });
    deps.setDimData({ s1: { score: 70 } });
    renderFn('legacy');
    var dd = deps.getDimData();
    if (dd.s1.status !== 'AMBER') {
      issues.push('F0 (d) reclassify score=70 — expected "AMBER", got "' + dd.s1.status + '"');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (validate input drop). 'garbage' input.
  // Healthy → no-op. T1 → sets active='garbage' + repaints.
  // ============================================================
  function runF1_validateInputDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn('garbage');
    if (deps.getStatusThresholds().active === 'garbage') {
      return ['F1 validate input drop detected — broken set STATUS_THRESHOLDS.active="garbage" (healthy rejects non-legacy/authoritative)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (idempotent guard drop). legacy→legacy.
  // Healthy → 0 repaints. T2 → still repaints.
  // ============================================================
  function runF2_idempotentGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn('legacy');
    var r = deps.getRepaintCounts();
    if (r.canvas > 0 || r.glossary > 0 || r.bottom > 0 || r.build > 0) {
      return ['F2 idempotent guard drop detected — broken repainted ' + r.canvas + '/' + r.glossary + '/' + r.bottom + '/' + r.build + ' times on legacy→legacy (healthy = 0/0/0/0)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (active mutation drop). legacy→authoritative.
  // Healthy → active='authoritative'. T3 → active='legacy'.
  // ============================================================
  function runF3_activeMutationDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn('authoritative');
    if (deps.getStatusThresholds().active === 'legacy') {
      return ['F3 active mutation drop detected — broken left STATUS_THRESHOLDS.active="legacy" (healthy flips to "authoritative")'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (dimData reclassification drop). score=70.
  // Healthy → status='AMBER'. T4 → status untouched (undefined).
  // ============================================================
  function runF4_dimDataReclassifyDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'authoritative',
      status: function (s) {
        if (s >= 80) return 'GREEN';
        if (s >= 65) return 'AMBER';
        return 'RED';
      }
    });
    deps.setDimData({ s1: { score: 70 } });
    renderFn('legacy');
    var dd = deps.getDimData();
    if (typeof dd.s1.status === 'undefined') {
      return ['F4 dimData reclassification drop detected — broken left s1.status undefined (healthy sets "AMBER")'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_validateInputDropped,          target_id: 'T1' },
    { id: 'F2', fn: runF2_idempotentGuardDropped,        target_id: 'T2' },
    { id: 'F3', fn: runF3_activeMutationDropped,         target_id: 'T3' },
    { id: 'F4', fn: runF4_dimDataReclassifyDropped,      target_id: 'T4' }
  ];
};
