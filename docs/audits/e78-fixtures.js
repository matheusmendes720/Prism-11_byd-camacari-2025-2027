// e78-fixtures.js — per-function probes for E78 countRedDims
//
// Inverted mutant-detection: each fixture pre-seeds dimData. The
// healthy mirror counts dimData entries whose .status === STATUS.RED.
//   return typeof dimData !== 'object' || !dimData ? null :
//          Object.keys(dimData).reduce((n,k) =>
//            (dimData[k] && dimData[k].status === STATUS.RED) ? n+1 : n, 0)
// Broken mutant drops one of 4 sub-checks → distinct sentinel (or
// throws). Fixture reports issue → runner says PASS (BASELINE) or
// FAIL (REPAIRED).
//
// Source — D3-PITCH-GRAPH.html L1376-1388:
//   function countRedDims() {
//     try {
//       if (typeof dimData !== 'object' || !dimData) return null;
//       let n = 0;
//       Object.keys(dimData).forEach(function (k) {
//         if (dimData[k] && dimData[k].status === STATUS.RED) n++;
//       });
//       return n;
//     } catch (e) {
//       console.warn('[D3 E7] countRedDims failed:', e);
//       return null;
//     }
//   }
//
// Topology (4 sub-checks):
//   1a. validate dimData: typeof === 'object' AND truthy (with try/catch
//       net as the safety wrapper).
//   1b. per-dim null guard: skip entries that are null/undefined before
//       reading .status.
//   1c. STATUS.RED exact match: use === STATUS.RED, not truthy check.
//   1d. counter increment: n++ when condition fires (not constant 0).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 3 cases.
//        (a) all RED (3/3) → expect 3.
//        (b) empty dimData → expect 0.
//        (c) mix RED + AMBER + GREEN + null → expect 2 (only REDs
//            count, null/AMBER/GREEN ignored).
//   F1 — dropInv1a (validate gate + try/catch net). dimData=null.
//        Healthy → null. T1 → throws on Object.keys(null). Fixture
//        catches throw.
//   F2 — dropInv1b (per-dim null guard). dimData = {good:RED,
//        bad:null}. Healthy → 1 (skips bad). T2 → throws on
//        bad.status, caught → returns null.
//   F3 — dropInv1c (STATUS.RED exact match). dimData = {a:RED,
//        b:'AMBER', c:'GREEN'}. Healthy → 1. T3 → truthy check
//        counts all → 3.
//   F4 — dropInv1d (counter increment). dimData = {a:RED, b:RED}.
//        Healthy → 2. T4 → constant 0 → 0.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 3 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) all 3 entries RED → expect 3.
    deps.resetEnv();
    deps.setDimData({
      s1: { status: 'RED' },
      s2: { status: 'RED' },
      s3: { status: 'RED' }
    });
    var r1 = renderFn();
    if (r1 !== 3) {
      issues.push('F0 (a) all RED — expected 3, got ' + r1);
    }

    // (b) empty dimData → 0 (no entries to count).
    deps.resetEnv();
    deps.setDimData({});
    var r2 = renderFn();
    if (r2 !== 0) {
      issues.push('F0 (b) empty dimData — expected 0, got ' + r2);
    }

    // (c) mixed: RED, AMBER, GREEN, null → expect 2.
    deps.resetEnv();
    deps.setDimData({
      s1: { status: 'RED' },
      s2: { status: 'AMBER' },
      s3: { status: 'GREEN' },
      s4: null,
      s5: { status: 'RED' }
    });
    var r3 = renderFn();
    if (r3 !== 2) {
      issues.push('F0 (c) mixed statuses — expected 2 (only REDs), got ' + r3);
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (validate gate drop + try/catch net).
  // dimData=null. Healthy → null. T1 → throws on Object.keys(null).
  // ============================================================
  function runF1_validateGateDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData(null);
    var threw = false;
    try {
      renderFn();
    } catch (e) {
      threw = true;
    }
    if (threw) {
      return ['F1 validate gate drop detected — broken version threw on null dimData (healthy returns null)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (per-dim null guard drop → reads .status on null).
  // dimData = {good:RED, bad:null}. Healthy → 1 (skips bad). T2 →
  // null.status throws → caught → returns null.
  // ============================================================
  function runF2_perDimNullGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      good: { status: 'RED' },
      bad: null
    });
    var r = renderFn();
    if (r === null) {
      return ['F2 per-dim null guard drop detected — broken threw on null[k].status, returned null (healthy = 1)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (STATUS.RED exact match → falls back to truthy).
  // dimData = {a:RED, b:'AMBER', c:'GREEN'}. Healthy → 1. T3 → 3.
  // ============================================================
  function runF3_statusExactMatchDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      a: { status: 'RED' },
      b: { status: 'AMBER' },
      c: { status: 'GREEN' }
    });
    var r = renderFn();
    if (r === 3) {
      return ['F3 STATUS.RED exact match drop detected — broken counted all truthy statuses (returned 3, healthy = 1)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (counter increment drop → constant 0).
  // dimData = {a:RED, b:RED}. Healthy → 2. T4 → 0.
  // ============================================================
  function runF4_counterIncrementDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      a: { status: 'RED' },
      b: { status: 'RED' }
    });
    var r = renderFn();
    if (r === 0) {
      return ['F4 counter increment drop detected — broken returned constant 0 (healthy = 2)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_validateGateDropped,           target_id: 'T1' },
    { id: 'F2', fn: runF2_perDimNullGuardDropped,        target_id: 'T2' },
    { id: 'F3', fn: runF3_statusExactMatchDropped,       target_id: 'T3' },
    { id: 'F4', fn: runF4_counterIncrementDropped,       target_id: 'T4' }
  ];
};
