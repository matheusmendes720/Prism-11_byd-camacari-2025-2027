// e72-fixtures.js — per-function probes for E72 hexToRgba
//
// Inverted mutant-detection: each fixture pre-seeds `hex` (and
// optionally `alpha`) with a sentinel. The healthy mirror parses the
// hex digits and returns the expected rgba string. The broken mutant
// drops an op → returns malformed/incorrect rgba string → fixture
// reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// hexToRgba(hex, alpha) converts a '#RRGGBB' hex string to a
// 'rgba(R,G,B,A)' string. Source:
//   L3139-3145:
//     function hexToRgba(hex, alpha) {
//       if (!hex || hex[0] !== '#') return 'rgba(255,255,255,' + (alpha||1) + ')';
//       var r = parseInt(hex.slice(1,3), 16);
//       var g = parseInt(hex.slice(3,5), 16);
//       var b = parseInt(hex.slice(5,7), 16);
//       return 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha||1) + ')';
//     }
//
// Topology (5 sub-checks):
//   1a. guard: !hex || hex[0] !== '#' → returns 'rgba(255,255,255,A)' fallback.
//   1b. r = parseInt(hex.slice(1,3), 16)  — first byte (red).
//   1c. g = parseInt(hex.slice(3,5), 16)  — second byte (green).
//   1d. b = parseInt(hex.slice(5,7), 16)  — third byte (blue).
//   1e. format: 'rgba(R,G,B,A)'.
//
// Fixtures (F0..F5):
//   F0 — healthy control: cycle through 3 hex inputs, verify rgba output.
//   F1 — dropInv1a (guard drop): hex with NO '#' prefix.
//        Healthy → white fallback. T1 → returns malformed rgba.
//   F2 — dropInv1b (r slice drop): hex='#10b981'. Healthy → r=16.
//        T2 → r=NaN (or wrong value).
//   F3 — dropInv1c (g slice drop): hex='#10b981'. Healthy → g=185.
//        T3 → g=NaN.
//   F4 — dropInv1d (b slice drop): hex='#10b981'. Healthy → b=129.
//        T4 → b=NaN.
//   F5 — dropInv1e (alpha default drop): hex valid, alpha=undefined.
//        Healthy → 'rgba(16,185,129,1)'. T5 → 'rgba(16,185,129,undefined)'
//        (since alpha||1 fallback dropped).
//
// 5 mutants × 1 target fixture + 5 controls (fixtures × healthy) = 10 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  function assertRgba(fixtureId, opLabel, expected, actual) {
    if (actual !== expected) {
      return [fixtureId + ' ' + opLabel + ' violated — expected "' + expected + '", got "' + actual + '"'];
    }
    return [];
  }

  // ============================================================
  // F0 — healthy control. Cycle through 3 hex inputs.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var issues = [];

    deps.setHex('#10b981'); deps.setAlpha(0.5);
    var got1 = renderFn();
    if (got1 !== 'rgba(16,185,129,0.5)') {
      issues.push('F0 hex=#10b981 alpha=0.5 violated — expected "rgba(16,185,129,0.5)", got "' + got1 + '"');
    }
    deps.setHex('#f59e0b'); deps.setAlpha(1);
    var got2 = renderFn();
    if (got2 !== 'rgba(245,158,11,1)') {
      issues.push('F0 hex=#f59e0b alpha=1 violated — expected "rgba(245,158,11,1)", got "' + got2 + '"');
    }
    deps.setHex('#ef4444'); deps.setAlpha(undefined);
    var got3 = renderFn();
    if (got3 !== 'rgba(239,68,68,1)') {
      issues.push('F0 hex=#ef4444 alpha=undefined violated — expected "rgba(239,68,68,1)", got "' + got3 + '"');
    }
    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (guard drop). hex='10b981' (no '#').
  // Healthy → 'rgba(255,255,255,A)' white fallback. T1 → parses '10b981'
  // starting from index 0, slice(1,3)='0b', parseInt(0b,16)=11 etc.
  // Wrong output.
  // ============================================================
  function runF1_guardDropped(renderFn) {
    deps.resetEnv();
    deps.setHex('10b981'); deps.setAlpha(0.7);
    var got = renderFn();
    return assertRgba('F1', 'guard (no-# prefix) violated — expected white fallback',
      'rgba(255,255,255,0.7)', got);
  }

  // ============================================================
  // F2 — dropInv1b (r slice drop). hex='#10b981'.
  // Healthy → r=16. T2 → r=NaN (parseInt drops → undefined).
  // ============================================================
  function runF2_redSliceDropped(renderFn) {
    deps.resetEnv();
    deps.setHex('#10b981'); deps.setAlpha(1);
    var got = renderFn();
    var expected = 'rgba(16,185,129,1)';
    var naive = got.replace('NaN', 'XXX');
    if (got !== expected) {
      return ['F2 red byte slice violated — expected "' + expected + '", got "' + got + '" (r slice dropped — T2)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (g slice drop). hex='#10b981'.
  // Healthy → g=185. T3 → g=NaN.
  // ============================================================
  function runF3_greenSliceDropped(renderFn) {
    deps.resetEnv();
    deps.setHex('#10b981'); deps.setAlpha(1);
    var got = renderFn();
    if (got.indexOf('NaN') !== -1 || got !== 'rgba(16,185,129,1)') {
      return ['F3 green byte slice violated — expected "rgba(16,185,129,1)", got "' + got + '" (g slice dropped — T3)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (b slice drop). hex='#10b981'.
  // Healthy → b=129. T4 → b=NaN.
  // ============================================================
  function runF4_blueSliceDropped(renderFn) {
    deps.resetEnv();
    deps.setHex('#10b981'); deps.setAlpha(1);
    var got = renderFn();
    if (got !== 'rgba(16,185,129,1)') {
      return ['F4 blue byte slice violated — expected "rgba(16,185,129,1)", got "' + got + '" (b slice dropped — T4)'];
    }
    return [];
  }

  // ============================================================
  // F5 — dropInv1e (alpha default drop). hex='#10b981' alpha=undefined.
  // Healthy → 'rgba(16,185,129,1)' (alpha||1=1 fallback).
  // T5 → 'rgba(16,185,129,undefined)' (alpha||1 fallback dropped).
  // ============================================================
  function runF5_alphaDefaultDropped(renderFn) {
    deps.resetEnv();
    deps.setHex('#10b981'); deps.setAlpha(undefined);
    var got = renderFn();
    return assertRgba('F5', 'alpha default fallback violated',
      'rgba(16,185,129,1)', got);
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,       target_id: null },
    { id: 'F1', fn: runF1_guardDropped,         target_id: 'T1' },
    { id: 'F2', fn: runF2_redSliceDropped,      target_id: 'T2' },
    { id: 'F3', fn: runF3_greenSliceDropped,    target_id: 'T3' },
    { id: 'F4', fn: runF4_blueSliceDropped,     target_id: 'T4' },
    { id: 'F5', fn: runF5_alphaDefaultDropped,  target_id: 'T5' }
  ];
};