// e80-fixtures.js — per-function probes for E80 renderCanvasLegend
//
// Inverted mutant-detection: each fixture pre-seeds STATUS_THRESHOLDS
// and a mock DOM. Healthy version reads
// STATUS_THRESHOLDS[STATUS_THRESHOLDS.active] and writes a 4-segment
// legend into #graph-legend.innerHTML. Broken mutant drops a sub-check
// → distinct innerHTML or throws.
//
// Source — D3-PITCH-GRAPH.html L1460-1476:
//   function renderCanvasLegend() {
//     try {
//       const root = document.getElementById('graph-legend');
//       if (!root) return;
//       const t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
//       const g = t.green;
//       const a = t.amber;
//       const html =
//         '<div class="g"><div class="dot" ...></div>Verde: ≥ ' + g + '</div>' +
//         '<div class="g"><div class="dot" ...></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
//         '<div class="g"><div class="dot" ...></div>Vermelho: &lt; ' + a + '</div>' +
//         '<div class="g" ...><div class="dot" ...></div>Coupling</div>';
//       root.innerHTML = html;
//     } catch (e) { console.warn(...); }
//   }
//
// Topology (4 sub-checks):
//   1a. try/catch net + DOM lookup gate.
//   1b. active thresholds: read STATUS_THRESHOLDS[STATUS_THRESHOLDS.active]
//       (NOT a hardcoded 70/50).
//   1c. green segment: 'Verde: ≥ ' + g.
//   1d. amber range upper bound: (g - 1) (not hardcoded).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 3 cases.
//        (a) legacy (70/50) → contains "Verde: ≥ 70" and
//            "Amarelo: 50–69".
//        (b) authoritative (80/65) → "Verde: ≥ 80" and "Amarelo: 65–79".
//        (c) 4 segments present (green, amber, red, coupling).
//   F1 — dropInv1a (try/catch net). mock DOM throws. Healthy →
//        caught, returns normally. T1 → throws to caller.
//   F2 — dropInv1b (active threshold read drop → hardcoded 70/50).
//        Fixture: set active='authoritative' (80/65). Healthy reads
//        80/65. T2 reads 70/50 → innerHTML contains "Verde: ≥ 70".
//   F3 — dropInv1c (green segment drop → only 3 segments). Healthy
//        has 4 "class=\"g\"" divs. T3 has 3.
//   F4 — dropInv1d (g-1 amber upper bound drop → hardcoded).
//        Fixture: legacy 70/50 → "Amarelo: 50–69". T4 writes
//        "Amarelo: 50–99" (hardcoded upper bound).

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 3 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) legacy (70/50).
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy'
    });
    renderFn();
    var root = deps.getMockEl('graph-legend');
    if (root.innerHTML.indexOf('Verde: ≥ 70') === -1) {
      issues.push('F0 (a) legacy green — expected "Verde: ≥ 70" in innerHTML, got: ' + root.innerHTML.substring(0, 200));
    }
    if (root.innerHTML.indexOf('Amarelo: 50–69') === -1) {
      issues.push('F0 (a) legacy amber — expected "Amarelo: 50–69" in innerHTML');
    }

    // (b) authoritative (80/65).
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'authoritative'
    });
    renderFn();
    root = deps.getMockEl('graph-legend');
    if (root.innerHTML.indexOf('Verde: ≥ 80') === -1) {
      issues.push('F0 (b) authoritative green — expected "Verde: ≥ 80"');
    }
    if (root.innerHTML.indexOf('Amarelo: 65–79') === -1) {
      issues.push('F0 (b) authoritative amber — expected "Amarelo: 65–79"');
    }

    // (c) 4 segments.
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy'
    });
    renderFn();
    root = deps.getMockEl('graph-legend');
    var segCount = (root.innerHTML.match(/class="g"/g) || []).length;
    if (segCount !== 4) {
      issues.push('F0 (c) segment count — expected 4 segments, got ' + segCount);
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (try/catch net). mock DOM throws.
  // ============================================================
  function runF1_tryCatchNetDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy'
    });
    deps.setThrowOnGetElementById(true);
    var threw = false;
    try { renderFn(); } catch (e) { threw = true; }
    deps.setThrowOnGetElementById(false);
    if (threw) {
      return ['F1 try/catch net drop detected — broken threw out of renderCanvasLegend (healthy catches DOM error)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (active threshold read → hardcoded 70/50).
  // Active is 'authoritative' (80/65) but broken writes 70/50.
  // ============================================================
  function runF2_activeThresholdDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'authoritative'
    });
    renderFn();
    var root = deps.getMockEl('graph-legend');
    if (root.innerHTML.indexOf('Verde: ≥ 70') !== -1) {
      return ['F2 active threshold drop detected — broken used hardcoded legacy 70 while active is authoritative 80'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (green segment drop). T3 has only 3 segments.
  // Healthy has 4 (green + amber + red + coupling).
  // ============================================================
  function runF3_greenSegmentDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy'
    });
    renderFn();
    var root = deps.getMockEl('graph-legend');
    var segCount = (root.innerHTML.match(/class="g"/g) || []).length;
    if (segCount < 4) {
      return ['F3 green segment drop detected — broken rendered ' + segCount + ' segments (healthy = 4)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (g-1 amber upper bound → hardcoded).
  // Healthy for legacy 70/50 → "Amarelo: 50–69". T4 writes "50–99".
  // ============================================================
  function runF4_amberUpperBoundDropped(renderFn) {
    deps.resetEnv();
    deps.setStatusThresholds({
      legacy: { green: 70, amber: 50 },
      authoritative: { green: 80, amber: 65 },
      active: 'legacy'
    });
    renderFn();
    var root = deps.getMockEl('graph-legend');
    if (root.innerHTML.indexOf('Amarelo: 50–99') !== -1) {
      return ['F4 amber upper bound drop detected — broken used hardcoded 99 (healthy = g-1 = 69)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_tryCatchNetDropped,            target_id: 'T1' },
    { id: 'F2', fn: runF2_activeThresholdDropped,        target_id: 'T2' },
    { id: 'F3', fn: runF3_greenSegmentDropped,           target_id: 'T3' },
    { id: 'F4', fn: runF4_amberUpperBoundDropped,        target_id: 'T4' }
  ];
};
