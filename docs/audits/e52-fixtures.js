// e52-fixtures.js — per-function probes for E52 renderTopbarStats
//
// Module pattern: exports `makeFixtures(deps)` returning the ALL_FIXTURES array.
// Each fixture is a closure that captures `deps`, so it can mutate host
// globals (statNodes, statEdges, counts) via the setter functions supplied
// by the host.
//
// Fixtures (F0..F4):
//   F0 — healthy control (both DOM elements present, healthy counts)
//   F1 — counts.nodes = 'foo' (non-numeric) → T1 (drop 1a)
//   F2 — counts.edges = null (non-numeric) → T2 (drop 1b)
//   F3 — #stat-nodes is a getter-only stub (textContent setter throws) → T3 (drop 1c)
//        Healthy: attempts write → setter throws → caught by try/catch → ok=false
//        Broken (drop 1c): skips write → no throw → ok=true
//        Distinguishes healthy from broken on the WRITE step.
//   F4 — #stat-edges is a getter-only stub → T4 (drop 1d)
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // Helper — getter-only stub whose textContent setter throws.
  // Mirrors a defensive-mode DOM where writes fail loudly (e.g.,
  // strict-mode proxy or read-only element). The renderTopbarStats
  // try/catch MUST convert that failure into an issue, not swallow it.
  // ============================================================
  function makeThrowingStub() {
    var stub = {};
    Object.defineProperty(stub, 'textContent', {
      get: function () { return ''; },
      set: function () { throw new TypeError('textContent setter is read-only'); },
      configurable: true,
      enumerable: true
    });
    return stub;
  }

  // ============================================================
  // F0 — healthy control
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var result = renderFn();
    var issues = [];
    if (!result.ok) {
      issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
    }
    if (deps.getStatNodes().textContent !== 11) {
      issues.push('F0 healthy-control violated — expected statNodes.textContent=11, got ' + JSON.stringify(deps.getStatNodes().textContent));
    }
    if (deps.getStatEdges().textContent !== 28) {
      issues.push('F0 healthy-control violated — expected statEdges.textContent=28, got ' + JSON.stringify(deps.getStatEdges().textContent));
    }
    return issues;
  }

  // ============================================================
  // F1 — counts.nodes = 'foo' (non-numeric) → T1 (drop 1a)
  // ============================================================
  function runF1_countsNodesNotNumeric(renderFn) {
    deps.resetEnv();
    var c = deps.getCounts();
    c.nodes = 'foo';
    deps.setCounts(c);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F1 counts.nodes-non-numeric violated — expected ok=false (counts.nodes="foo"), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F2 — counts.edges = null → T2 (drop 1b)
  // ============================================================
  function runF2_countsEdgesNull(renderFn) {
    deps.resetEnv();
    var c = deps.getCounts();
    c.edges = null;
    deps.setCounts(c);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F2 counts.edges-null violated — expected ok=false (counts.edges=null), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F3 — #stat-nodes is a getter-only stub (setter throws) → T3 (drop 1c)
  // Healthy code attempts the write, which throws → caught → ok=false.
  // Broken T3 skips the write → no throw → ok=true.
  // ============================================================
  function runF3_statNodesThrowsOnWrite(renderFn) {
    deps.resetEnv();
    deps.setStatNodes(makeThrowingStub());
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F3 stat-nodes-throwing-stub violated — expected ok=false (write should throw and be caught), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F4 — #stat-edges is a getter-only stub → T4 (drop 1d)
  // ============================================================
  function runF4_statEdgesThrowsOnWrite(renderFn) {
    deps.resetEnv();
    deps.setStatEdges(makeThrowingStub());
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F4 stat-edges-throwing-stub violated — expected ok=false (write should throw and be caught), got ok=true');
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,             target_id: null },
    { id: 'F1', fn: runF1_countsNodesNotNumeric,      target_id: 'T1' },
    { id: 'F2', fn: runF2_countsEdgesNull,             target_id: 'T2' },
    { id: 'F3', fn: runF3_statNodesThrowsOnWrite,      target_id: 'T3' },
    { id: 'F4', fn: runF4_statEdgesThrowsOnWrite,      target_id: 'T4' }
  ];
};
