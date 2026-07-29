// e85-fixtures.js — per-function probes for E85 renderGlossary
//
// Inverted mutant-detection: each fixture pre-seeds mockDocument
// (getElementById for 'glossary-root'), a mockRoot with a settable
// innerHTML, a warn counter, glossaryTexts / PALETTE_TOKENS /
// STATUS_THRESHOLDS / getCounts globals, and an escapeHtml function.
// Healthy version: catches throws → early-returns on null → assembles
// 4 blocks of HTML (layers / status / toggle / types) → writes innerHTML.
// Broken mutant drops a sub-check → distinct observable state.
//
// Source — D3-PITCH-GRAPH.html L1755-1811 (renderGlossary).
//
// Topology (4 sub-checks):
//   1a. try/catch net: wraps the whole body.
//   1b. root null guard: skip when no element in DOM.
//   1c. innerHTML write: write the assembled html string.
//   1d. Block 3 (types) loop: render the types block via forEach.
//
// Fixtures (F0..F4):
//   F0 — healthy control: 3 cases.
//        (a) Normal setup → innerHTML contains all 4 block markers,
//            no warn.
//        (b) root null → no throw, no warn (early return).
//        (c) STATUS_THRESHOLDS.active='authoritative' → second button
//            has 'active' class.
//   F1 — dropInv1a (try/catch net). getElementById throws → T1 throw
//        propagates to caller.
//   F2 — dropInv1b (root null guard). root=null → healthy returns
//        early (warn=0). T2 reads null.innerHTML (warn=1).
//   F3 — dropInv1c (innerHTML write). Normal setup → healthy writes
//        html, T3 leaves innerHTML=''.
//   F4 — dropInv1d (Block 3 types). Normal setup → healthy includes
//        'Tipos de nó no grafo' in innerHTML. T4 omits it.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 3 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) Normal setup → contains all 4 block markers, no warn.
    deps.resetEnv();
    deps.setGetElementById(function (id) {
      if (id === 'glossary-root') return deps.createMockRoot();
      return null;
    });
    renderFn();
    var root = deps.getMockRoot();
    var html = root.innerHTML;
    if (html.indexOf('O que cada camada faz') === -1) {
      issues.push('F0 (a) — missing Block 1 marker "O que cada camada faz"');
    }
    if (html.indexOf('Cores do farol') === -1) {
      issues.push('F0 (a) — missing Block 2 marker "Cores do farol"');
    }
    if (html.indexOf('Qual faixa usar') === -1) {
      issues.push('F0 (a) — missing Block 2.5 marker "Qual faixa usar"');
    }
    if (html.indexOf('Tipos de nó no grafo') === -1) {
      issues.push('F0 (a) — missing Block 3 marker "Tipos de nó no grafo"');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (a) warn — expected 0, got ' + deps.getWarnCount());
    }

    // (b) root null → no throw, no warn.
    deps.resetEnv();
    deps.setGetElementById(function (id) { return null; });
    var threwB = false;
    try { renderFn(); } catch (e) { threwB = true; }
    if (threwB) {
      issues.push('F0 (b) root null — expected no throw');
    }
    if (deps.getWarnCount() !== 0) {
      issues.push('F0 (b) warn — expected 0, got ' + deps.getWarnCount());
    }

    // (c) STATUS_THRESHOLDS.active='authoritative' → second button has
    //     'active' class, first does not. Check class within each
    //     button's substring (between its data-threshold and </button>).
    deps.resetEnv();
    deps.setStatusThresholdsActive('authoritative');
    deps.setGetElementById(function (id) {
      if (id === 'glossary-root') return deps.createMockRoot();
      return null;
    });
    renderFn();
    html = deps.getMockRoot().innerHTML;
    var legacyStart = html.indexOf('data-threshold="legacy"');
    var legacyBtnStart = html.lastIndexOf('<button', legacyStart);
    var legacyEnd = html.indexOf('</button>', legacyStart);
    var legacyBlock = html.substring(legacyBtnStart, legacyEnd);
    if (legacyBlock.indexOf('class="threshold-btn active') !== -1) {
      issues.push('F0 (c) active=authoritative — legacy button should NOT have active class');
    }
    var authStart = html.indexOf('data-threshold="authoritative"');
    var authBtnStart = html.lastIndexOf('<button', authStart);
    var authEnd = html.indexOf('</button>', authStart);
    var authBlock = html.substring(authBtnStart, authEnd);
    if (authBlock.indexOf('class="threshold-btn active') === -1) {
      issues.push('F0 (c) active=authoritative — authoritative button should have active class');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (try/catch net). getElementById throws.
  // ============================================================
  function runF1_tryCatchNetDropped(renderFn) {
    deps.resetEnv();
    deps.setGetElementById(function (id) {
      throw new Error('mock getElementById throw');
    });
    var threw = false;
    try { renderFn(); } catch (e) { threw = true; }
    if (threw) {
      return ['F1 try/catch net drop detected — broken threw out of renderGlossary (healthy catches getElementById throw)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (root null guard). root=null.
  // Healthy returns early (warn=0). T2 reads null.innerHTML
  // (TypeError → wrapper catches → warn=1).
  // ============================================================
  function runF2_rootNullGuardDropped(renderFn) {
    deps.resetEnv();
    deps.setGetElementById(function (id) { return null; });
    renderFn();
    var warn = deps.getWarnCount();
    if (warn > 0) {
      return ['F2 root null guard drop detected — broken threw TypeError reading null.innerHTML (warn=' + warn + ', healthy returns early on null with warn=0)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (innerHTML write). Normal setup.
  // Healthy writes the assembled html. T3 leaves innerHTML=''.
  // ============================================================
  function runF3_innerHtmlWriteDropped(renderFn) {
    deps.resetEnv();
    deps.setGetElementById(function (id) {
      if (id === 'glossary-root') return deps.createMockRoot();
      return null;
    });
    renderFn();
    var root = deps.getMockRoot();
    if (root.innerHTML === '') {
      return ['F3 innerHTML write drop detected — broken left innerHTML="" (healthy writes the assembled html)'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (Block 3 types loop). Normal setup.
  // Healthy includes 'Tipos de nó no grafo'. T4 omits it.
  // ============================================================
  function runF4_block3TypesDropped(renderFn) {
    deps.resetEnv();
    deps.setGetElementById(function (id) {
      if (id === 'glossary-root') return deps.createMockRoot();
      return null;
    });
    renderFn();
    var root = deps.getMockRoot();
    if (root.innerHTML.indexOf('Tipos de nó no grafo') === -1) {
      return ['F4 Block 3 types drop detected — broken omitted "Tipos de nó no grafo" marker (healthy renders the types block)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,           target_id: null },
    { id: 'F1', fn: runF1_tryCatchNetDropped,       target_id: 'T1' },
    { id: 'F2', fn: runF2_rootNullGuardDropped,     target_id: 'T2' },
    { id: 'F3', fn: runF3_innerHtmlWriteDropped,    target_id: 'T3' },
    { id: 'F4', fn: runF4_block3TypesDropped,       target_id: 'T4' }
  ];
};
