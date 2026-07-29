// e82-fixtures.js — per-function probes for E82 statusThresholdInit
//
// Inverted mutant-detection: each fixture pre-seeds mockLocalStorage,
// STATUS_THRESHOLDS, dimData, and a repaint counter. Healthy version
// reads localStorage safely → validates stored value → mutates active
// via direct mutator → ALWAYS reclassifies dimData → repaints canvas
// legend. Broken mutant drops a sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L1534-1564:
//   function statusThresholdInit() {
//     try {
//       let stored = null;
//       try {
//         if (typeof localStorage !== 'undefined') {
//           stored = localStorage.getItem('d3:status_threshold');
//         }
//       } catch (e) { /* private mode etc */ }
//       if (stored === 'legacy' || stored === 'authoritative') {
//         STATUS_THRESHOLDS.active = stored;
//       }
//       if (typeof dimData === 'object' && dimData) {
//         Object.keys(dimData).forEach(function (k) {
//           const d = dimData[k];
//           if (d && typeof d.score === 'number') {
//             const s = STATUS_THRESHOLDS.status(d.score);
//             if (s) d.status = s;
//           }
//         });
//       }
//       if (typeof renderCanvasLegend === 'function') renderCanvasLegend();
//     } catch (e) { console.warn(...); }
//   }
//
// Topology (4 sub-checks):
//   1a. try/catch net: wraps the whole body (and inner localStorage read).
//   1b. stored value validation: only 'legacy' | 'authoritative' allowed.
//   1c. STATUS_THRESHOLDS.active = stored (direct mutator).
//   1d. dimData reclassification: ALWAYS runs regardless of stored.
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 cases.
//        (a) stored=null → active stays 'legacy', reclassify still runs,
//            repaint called.
//        (b) stored='authoritative' → active flips to 'authoritative',
//            reclassify runs, repaint called.
//        (c) stored='garbage' → active stays 'legacy' (rejected),
//            reclassify still runs, repaint called.
//        (d) score=70 with active='authoritative' → status='AMBER'.
//   F1 — dropInv1a (try/catch net). STATUS_THRESHOLDS.status throws on
//        call. Healthy → caught. T1 → throws to caller.
//   F2 — dropInv1b (stored value validation). stored='garbage' →
//        healthy rejects. T2 → sets STATUS_THRESHOLDS.active='garbage'.
//   F3 — dropInv1c (active mutation). stored='authoritative' →
//        healthy flips. T3 → leaves active='legacy'.
//   F4 — dropInv1d (dimData reclassification). score=70 →
//        healthy sets status='AMBER'. T4 → leaves status undefined.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) stored=null → active stays 'legacy', reclassify still runs, repaint called.
    deps.resetEnv();
    deps.setStored(null);
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
    renderFn();
    if (deps.getStatusThresholds().active !== 'legacy') {
      issues.push('F0 (a) stored=null — expected active="legacy", got "' + deps.getStatusThresholds().active + '"');
    }
    if (deps.getRepaintCounts().canvas !== 1) {
      issues.push('F0 (a) repaint — expected 1, got ' + deps.getRepaintCounts().canvas);
    }

    // (b) stored='authoritative' → active flips + reclassify + repaint.
    deps.resetEnv();
    deps.setStored('authoritative');
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
    renderFn();
    if (deps.getStatusThresholds().active !== 'authoritative') {
      issues.push('F0 (b) stored=authoritative — expected active="authoritative", got "' + deps.getStatusThresholds().active + '"');
    }
    if (deps.getRepaintCounts().canvas !== 1) {
      issues.push('F0 (b) repaint — expected 1, got ' + deps.getRepaintCounts().canvas);
    }

    // (c) stored='garbage' → active stays 'legacy' (rejected), reclassify still runs.
    deps.resetEnv();
    deps.setStored('garbage');
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
    deps.setDimData({ s1: { score: 70 } });
    renderFn();
    if (deps.getStatusThresholds().active !== 'legacy') {
      issues.push('F0 (c) stored=garbage — expected active="legacy", got "' + deps.getStatusThresholds().active + '"');
    }
    if (deps.getRepaintCounts().canvas !== 1) {
      issues.push('F0 (c) repaint — expected 1, got ' + deps.getRepaintCounts().canvas);
    }

    // (d) score=70 with active='authoritative' → status='AMBER'.
    deps.resetEnv();
    deps.setStored(null);
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
    renderFn();
    var dd = deps.getDimData();
    if (dd.s1.status !== 'AMBER') {
      issues.push('F0 (d) reclassify score=70 — expected "AMBER", got "' + dd.s1.status + '"');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (try/catch net). renderCanvasLegend throws.
  // We throw from renderCanvasLegend (which lives OUTSIDE any
  // inner try/catch net in healthy statusThresholdInit) so the
  // outer try/catch net is what distinguishes healthy from broken.
  // ============================================================
  function runF1_tryCatchNetDropped(renderFn) {
    deps.resetEnv();
    deps.setStored(null);
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    if (typeof deps.setRenderCanvasLegend === 'function') {
      deps.setRenderCanvasLegend(function () { throw new Error('mock renderCanvasLegend throw'); });
    }
    var threw = false;
    try { renderFn(); } catch (e) { threw = true; }
    if (typeof deps.setRenderCanvasLegend === 'function') {
      deps.setRenderCanvasLegend(null);  // restore default
    }
    if (threw) {
      return ['F1 try/catch net drop detected — broken threw out of statusThresholdInit (healthy catches renderCanvasLegend throw)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (stored value validation). stored='garbage'.
  // ============================================================
  function runF2_storedValueValidationDropped(renderFn) {
    deps.resetEnv();
    deps.setStored('garbage');
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn();
    if (deps.getStatusThresholds().active === 'garbage') {
      return ['F2 stored value validation drop detected — broken set STATUS_THRESHOLDS.active="garbage" (healthy rejects non-legacy/authoritative)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (active mutation). stored='authoritative'.
  // ============================================================
  function runF3_activeMutationDropped(renderFn) {
    deps.resetEnv();
    deps.setStored('authoritative');
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy',
      status: function (s) { return 'AMBER'; }
    });
    deps.setDimData({});
    renderFn();
    if (deps.getStatusThresholds().active === 'legacy') {
      return ['F3 active mutation drop detected — broken left STATUS_THRESHOLDS.active="legacy" (healthy flips to "authoritative")'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (dimData reclassification). score=70.
  // ============================================================
  function runF4_dimDataReclassifyDropped(renderFn) {
    deps.resetEnv();
    deps.setStored(null);
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
    renderFn();
    var dd = deps.getDimData();
    if (typeof dd.s1.status === 'undefined') {
      return ['F4 dimData reclassification drop detected — broken left s1.status undefined (healthy sets "AMBER")'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_tryCatchNetDropped,            target_id: 'T1' },
    { id: 'F2', fn: runF2_storedValueValidationDropped,  target_id: 'T2' },
    { id: 'F3', fn: runF3_activeMutationDropped,         target_id: 'T3' },
    { id: 'F4', fn: runF4_dimDataReclassifyDropped,      target_id: 'T4' }
  ];
};