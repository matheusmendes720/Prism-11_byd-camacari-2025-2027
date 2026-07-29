// e77-fixtures.js — per-function probes for E77 computeCompositeScore
//
// Inverted mutant-detection: each fixture pre-seeds dimData. The
// healthy mirror computes weighted average across qualifying dimData
// entries:
//   num = Σ(score_d × weight_d),  den = Σ(weight_d)
//   return den === 0 ? null : num / den
// Broken mutant drops one of 4 sub-checks → distinct sentinel.
// Fixture reports issue → runner says PASS (BASELINE) or FAIL
// (REPAIRED).
//
// Source — D3-PITCH-GRAPH.html L1350-1371:
//   function computeCompositeScore() {
//     try {
//       if (typeof dimData !== 'object' || !dimData) return null;
//       let num = 0, den = 0;
//       Object.keys(dimData).forEach(function (k) {
//         const d = dimData[k];
//         if (!d) return;
//         const s = (typeof d.score === 'number') ? d.score : null;
//         const w = (typeof d.weight === 'number') ? d.weight : null;
//         if (s === null || w === null) return;
//         num += s * w;
//         den += w;
//       });
//       if (den === 0) return null;
//       return num / den;
//     } catch (e) {
//       console.warn('[D3 E7] computeCompositeScore failed:', e);
//       return null;
//     }
//   }
//
// Topology (4 sub-checks):
//   1a. validate dimData: typeof === 'object' AND truthy.
//   1b. score/weight null guard: skip entries missing numeric score
//       or weight.
//   1c. den === 0 guard: return null when no qualifying entries.
//   1d. weighted return: num/den (weights summing ≠ 1 in test data to
//       distinguish from the unweighted sum).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 3 cases.
//        (a) full dimData {s1:60/0.5, s2:70/0.3, s3:80/0.2} (weights
//            sum to 1.0) → expect 67.
//        (b) empty dimData {} → expect null (den===0).
//        (c) dimension with no score/weight → skipped; remaining
//            entries determine the avg.
//   F1 — dropInv1a (validate gate drop, including the try/catch
//        safety net). dimData=null. Healthy → null. T1 → throws
//        on Object.keys(null). Fixture catches throw.
//   F2 — dropInv1b (score/weight null guard drop). dimData = {good
//        + score='foo' bad}. Healthy skips bad → num=60, den=1,
//        returns 60. T2 proceeds for bad → s=null, w=1, num += 0
//        (null*1), den += 1, total num=60, den=2, returns 30.
//   F3 — dropInv1c (den=0 guard drop). dimData with no qualifying
//        entries. Healthy → null. T3 → 0/0 = NaN.
//   F4 — dropInv1d (weighted return drop). dimData weights summing
//        to 3 (≠ 1). Healthy → num/den = 70. T4 → num = 210 (sum).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 3 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) full dimData with weights summing to 1: 60×0.5 + 70×0.3 +
    //     80×0.2 = 67.
    deps.resetEnv();
    deps.setDimData({
      s1: { score: 60, weight: 0.5 },
      s2: { score: 70, weight: 0.3 },
      s3: { score: 80, weight: 0.2 }
    });
    var r1 = renderFn();
    if (Math.abs(r1 - 67) > 0.001) {
      issues.push('F0 (a) full dimData — expected 67, got ' + r1);
    }

    // (b) empty dimData → den===0 → null.
    deps.resetEnv();
    deps.setDimData({});
    var r2 = renderFn();
    if (r2 !== null) {
      issues.push('F0 (b) empty dimData — expected null, got ' + r2);
    }

    // (c) mixed: s1 missing weight, s2 with full, s3 null → expect 70.
    deps.resetEnv();
    deps.setDimData({
      s1: { score: 60 },                     // no weight — skip
      s2: { score: 70, weight: 1.0 },        // only qualifier
      s3: null
    });
    var r3 = renderFn();
    if (Math.abs(r3 - 70) > 0.001) {
      issues.push('F0 (c) mixed entries — expected 70 (only s2 qualifies), got ' + r3);
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (validate gate drop + try/catch safety net).
  // dimData=null. Healthy → null. T1 → throws.
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
  // F2 — dropInv1b (score/weight null guard drop → bad entry
  // pollutes accumulator). dimData = {good:60/1, bad:'foo'/1}.
  // Healthy → 60 (skips bad). T2 → 30 (bad adds to den without
  // contributing to num, shifting the average).
  // ============================================================
  function runF2_scoreWeightGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      good: { score: 60, weight: 1 },
      bad:  { score: 'foo', weight: 1 }
    });
    var r = renderFn();
    if (r === 30) {
      return ['F2 score/weight null guard drop detected — broken polluted accumulator (returned 30 instead of 60)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (den=0 guard drop → proceeds to 0/0).
  // dimData with no qualifying entries. Healthy → null. T3 → NaN.
  // ============================================================
  function runF3_denZeroGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      s1: { score: 50 },          // no weight — skipped
      s2: { weight: 0.5 },        // no score — skipped
      s3: null                    // skipped by per-dim guard
    });
    var r = renderFn();
    if (Number.isNaN(r)) {
      return ['F3 den=0 guard drop detected — healthy returns null, broken returned NaN'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (weighted return drop → returns num instead).
  // dimData with weights summing to 3 (≠ 1). Healthy → 210/3 = 70.
  // T4 → returns num = 210 (the unweighted sum).
  // ============================================================
  function runF4_weightedReturnDropped(renderFn) {
    deps.resetEnv();
    deps.setDimData({
      s1: { score: 60, weight: 1 },
      s2: { score: 70, weight: 1 },
      s3: { score: 80, weight: 1 }
    });
    var r = renderFn();
    if (r === 210) {
      return ['F4 weighted return drop detected — broken returned unweighted sum 210 (healthy = num/den = 70)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_validateGateDropped,           target_id: 'T1' },
    { id: 'F2', fn: runF2_scoreWeightGuardDropped,       target_id: 'T2' },
    { id: 'F3', fn: runF3_denZeroGuardDropped,           target_id: 'T3' },
    { id: 'F4', fn: runF4_weightedReturnDropped,         target_id: 'T4' }
  ];
};