// e53-fixtures.js — per-function probes for E53 renderGlossary
//
// Mirrors the E52 throwing-stub pattern. Each fixture corrupts ONE step
// into a throwing stub. Healthy renderFn detects the throw → ok=false.
// Broken mutant drops that step → no throw → ok=true → fixture reports
// issue → runner says PASS.
//
// Fixtures (F0..F4):
//   F0 — healthy control (all 4 operations complete, innerHTML populated)
//   F1 — glossaryTexts.layers is a throwing stub → T1 (drop 1a)
//   F2 — glossaryTexts.statuses is a throwing stub → T2 (drop 1b)
//   F3 — glossaryTexts.types is a throwing stub → T3 (drop 1c)
//   F4 — #glossary-root is a throwing innerHTML stub → T4 (drop 1d)
//
// Throwing-stub details:
//   For F1/F2/F3 we wrap each glossaryTexts sub-array in a proxy-like
//   object whose forEach throws TypeError. Healthy tries to call it →
//   throws → caught by try/catch → ok=false. Broken T1 (drops 1a) skips
//   the call → no throw → ok=true.
//   For F4 we make #glossary-root a stub whose innerHTML setter throws.
//   Healthy tries to write → throws → caught → ok=false. Broken T4
//   skips the write → ok=true.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // Helper — throwing array wrapper. Looks like an array (has length,
  // forEach) but forEach throws on call. Mirrors a defensive-mode
  // glossaryTexts where a sub-array is read-only.
  // ============================================================
  function makeThrowingArray(label) {
    return {
      length: 0,
      forEach: function () {
        throw new TypeError(label + '.forEach is read-only');
      }
    };
  }

  // ============================================================
  // Helper — getter-only stub whose innerHTML setter throws TypeError.
  // Mirrors a defensive-mode DOM where writes fail loudly.
  // ============================================================
  function makeThrowingRootStub() {
    var stub = {};
    Object.defineProperty(stub, 'innerHTML', {
      get: function () { return ''; },
      set: function () { throw new TypeError('innerHTML setter is read-only'); },
      configurable: true,
      enumerable: true
    });
    return stub;
  }

  // ============================================================
  // F0 — healthy control
  //   Mirror runs all 4 operations cleanly, innerHTML ends up populated.
  //   Verifies F0 reads its own EXPECTED innerHTML.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var result = renderFn();
    var issues = [];
    if (!result.ok) {
      issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
    }
    if (deps.getLastInnerHTML() !== '<rendered>') {
      issues.push('F0 healthy-control violated — expected lastInnerHTML="<rendered>", got ' + JSON.stringify(deps.getLastInnerHTML()));
    }
    return issues;
  }

  // ============================================================
  // F1 — glossaryTexts.layers is a throwing stub → T1 (drop 1a)
  // ============================================================
  function runF1_layersForEachThrows(renderFn) {
    deps.resetEnv();
    var gt = deps.getGlossaryTexts();
    gt.layers = makeThrowingArray('glossaryTexts.layers');
    deps.setGlossaryTexts(gt);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F1 layers.forEach-throwing violated — expected ok=false (throw should be caught), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F2 — glossaryTexts.statuses is a throwing stub → T2 (drop 1b)
  // ============================================================
  function runF2_statusesForEachThrows(renderFn) {
    deps.resetEnv();
    var gt = deps.getGlossaryTexts();
    gt.statuses = makeThrowingArray('glossaryTexts.statuses');
    deps.setGlossaryTexts(gt);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F2 statuses.forEach-throwing violated — expected ok=false (throw should be caught), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F3 — glossaryTexts.types is a throwing stub → T3 (drop 1c)
  // ============================================================
  function runF3_typesForEachThrows(renderFn) {
    deps.resetEnv();
    var gt = deps.getGlossaryTexts();
    gt.types = makeThrowingArray('glossaryTexts.types');
    deps.setGlossaryTexts(gt);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F3 types.forEach-throwing violated — expected ok=false (throw should be caught), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F4 — #glossary-root is a throwing innerHTML stub → T4 (drop 1d)
  // ============================================================
  function runF4_rootInnerHTMLThrows(renderFn) {
    deps.resetEnv();
    deps.setGlossaryRoot(makeThrowingRootStub());
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F4 root.innerHTML-throwing violated — expected ok=false (write should throw and be caught), got ok=true');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,        target_id: null },
    { id: 'F1', fn: runF1_layersForEachThrows,   target_id: 'T1' },
    { id: 'F2', fn: runF2_statusesForEachThrows, target_id: 'T2' },
    { id: 'F3', fn: runF3_typesForEachThrows,    target_id: 'T3' },
    { id: 'F4', fn: runF4_rootInnerHTMLThrows,   target_id: 'T4' }
  ];
};
