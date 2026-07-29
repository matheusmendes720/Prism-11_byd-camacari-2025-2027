// e83-fixtures.js — per-function probes for E83 renderTourSelectorCount
//
// Inverted mutant-detection: each fixture pre-seeds mockDocument
// (getElementById for 'tour-selector-count'), a mockEl with a settable
// textContent, a global tours[] array, and a warn counter. Healthy
// version reads the element safely → early-returns on null → picks
// tours.length (fallback 0) → writes String(n) to el.textContent.
// Broken mutant drops a sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L1569-1578:
//   function renderTourSelectorCount() {
//     try {
//       const el = document.getElementById('tour-selector-count');
//       if (!el) return;
//       const n = (typeof tours !== 'undefined' && tours.length) || 0;
//       el.textContent = String(n);
//     } catch (e) {
//       console.warn('[D3 E4] renderTourSelectorCount failed:', e);
//     }
//   }
//
// Topology (4 sub-checks):
//   1a. try/catch net: wraps the whole body.
//   1b. el null guard: skip when no element in DOM.
//   1c. tours.length fallback: 0 when tours undefined/empty.
//   1d. el.textContent write: write String(n).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 cases.
//        (a) el exists, tours=[a,b,c] → textContent='3', warn=0.
//        (b) el exists, tours=[] → textContent='0', warn=0.
//        (c) el exists, tours=undefined → textContent='0', warn=0.
//        (d) el missing → no throw, no warn.
//   F1 — dropInv1a (try/catch net). el.textContent setter throws →
//        T1 throws to caller (F1 caller try/catch sees throw).
//        Healthy catches (warn=1, but fixture only checks threw).
//   F2 — dropInv1b (el null guard). getElementById returns null →
//        healthy returns early (warn=0). T2 reads null.textContent
//        (wrapper catches → warn=1).
//   F3 — dropInv1c (tours.length fallback). tours=undefined →
//        healthy picks 0 (warn=0). T3 reads undefined.length
//        (wrapper catches → warn=1).
//   F4 — dropInv1d (textContent write). tours=[a,b] → healthy sets
//        textContent='2'. T4 leaves textContent=''.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) el exists, tours=[a,b,c] → textContent='3', warn=0.
    deps.resetEnv();
    deps.setTours(['a', 'b', 'c']);
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return deps.createMockEl();
      return null;
    });
    renderFn();
    var el = deps.getMockEl();
    if (el.textContent !== '3') {
      issues.push('F0 (a) tours=[a,b,c] — expected textContent="3", got "' + el.textContent + '"');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (a) warn — expected 0, got ' + deps.getWarnCount());
    }

    // (b) el exists, tours=[] → textContent='0', warn=0.
    deps.resetEnv();
    deps.setTours([]);
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return deps.createMockEl();
      return null;
    });
    renderFn();
    el = deps.getMockEl();
    if (el.textContent !== '0') {
      issues.push('F0 (b) tours=[] — expected textContent="0", got "' + el.textContent + '"');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (b) warn — expected 0, got ' + deps.getWarnCount());
    }

    // (c) el exists, tours=undefined → textContent='0', warn=0.
    deps.resetEnv();
    deps.setTours(undefined);
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return deps.createMockEl();
      return null;
    });
    renderFn();
    el = deps.getMockEl();
    if (el.textContent !== '0') {
      issues.push('F0 (c) tours=undefined — expected textContent="0", got "' + el.textContent + '"');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (c) warn — expected 0, got ' + deps.getWarnCount());
    }

    // (d) el missing → no throw, no warn.
    deps.resetEnv();
    deps.setTours(['a']);
    deps.setGetElementById(function (id) { return null; });
    var threwD = false;
    try { renderFn(); } catch (e) { threwD = true; }
    if (threwD) {
      issues.push('F0 (d) el missing — expected no throw');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (d) warn — expected 0, got ' + deps.getWarnCount());
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (try/catch net). el.textContent setter throws.
  // ============================================================
  function runF1_tryCatchNetDropped(renderFn) {
    deps.resetEnv();
    deps.setTours(['a', 'b']);
    var throwingEl = {
      _textContent: '',
      get textContent() { return this._textContent; },
      set textContent(v) { throw new Error('mock textContent setter throw'); }
    };
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return throwingEl;
      return null;
    });
    var threw = false;
    try { renderFn(); } catch (e) { threw = true; }
    if (threw) {
      return ['F1 try/catch net drop detected — broken threw out of renderTourSelectorCount (healthy catches textContent setter throw)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (el null guard). getElementById returns null.
  // Healthy returns early (warn=0). T2 reads null.textContent
  // (TypeError → wrapper catches → warn=1).
  // ============================================================
  function runF2_elNullGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setTours(['a', 'b']);
    deps.setGetElementById(function (id) { return null; });
    renderFn();
    var warn = deps.getWarnCount();
    if (warn > 0) {
      return ['F2 el null guard drop detected — broken threw TypeError reading null.textContent (warn=' + warn + ', healthy returns early on null with warn=0)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (tours.length fallback). tours=undefined.
  // Healthy picks 0 (warn=0). T3 reads undefined.length
  // (TypeError → wrapper catches → warn=1).
  // ============================================================
  function runF3_toursLengthFallbackDropped(renderFn) {
    deps.resetEnv();
    deps.setTours(undefined);
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return deps.createMockEl();
      return null;
    });
    renderFn();
    var warn = deps.getWarnCount();
    if (warn > 0) {
      return ['F3 tours.length fallback drop detected — broken threw TypeError reading undefined.length (warn=' + warn + ', healthy picks 0 with warn=0)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (textContent write). tours=[a,b] → '2'.
  // Healthy writes textContent='2'. T4 leaves textContent=''.
  // ============================================================
  function runF4_textContentWriteDropped(renderFn) {
    deps.resetEnv();
    deps.setTours(['a', 'b']);
    deps.setGetElementById(function (id) {
      if (id === 'tour-selector-count') return deps.createMockEl();
      return null;
    });
    renderFn();
    var el = deps.getMockEl();
    if (el.textContent === '') {
      return ['F4 textContent write drop detected — broken left textContent="" (healthy writes "2")'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                    target_id: null },
    { id: 'F1', fn: runF1_tryCatchNetDropped,                target_id: 'T1' },
    { id: 'F2', fn: runF2_elNullGuardDropped,                target_id: 'T2' },
    { id: 'F3', fn: runF3_toursLengthFallbackDropped,         target_id: 'T3' },
    { id: 'F4', fn: runF4_textContentWriteDropped,            target_id: 'T4' }
  ];
};