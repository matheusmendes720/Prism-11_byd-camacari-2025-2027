// e79-fixtures.js — per-function probes for E79 renderBottomBar
//
// Inverted mutant-detection: each fixture pre-seeds JSON_ENVELOPE,
// dimData, and a mockDocument whose getElementById returns either a
// sentinel {textContent:''} element or undefined. Healthy version
// writes the right textContent into each of 4 chips. Broken mutant
// drops a sub-check → distinct textContent or throws.
//
// Source — D3-PITCH-GRAPH.html L1394-1431:
//   function renderBottomBar() {
//     try {
//       const bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
//       const btEl = document.getElementById('bottom-backtesting');
//       if (btEl) {
//         btEl.textContent = bt
//           ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
//           : 'crises testadas —';
//       }
//       const compEl = document.getElementById('bottom-composite');
//       if (compEl) {
//         const c = computeCompositeScore();
//         compEl.textContent = (c === null)
//           ? 'Painel geral —/100'
//           : ('Painel geral ' + Math.round(c) + ' em 100');
//       }
//       const redEl = document.getElementById('bottom-red-count');
//       if (redEl) {
//         const r = countRedDims();
//         redEl.textContent = (r === null)
//           ? '— alertas vermelhos ativos'
//           : (r + ' alerta(s) vermelho(s) ativo(s)');
//       }
//       const verEl = document.getElementById('bottom-version');
//       if (verEl) {
//         const bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
//         const m = bd.match(/^(\d{4})-(\d{2})-/);
//         const monthLabel = m
//           ? ({'01':'jan','02':'fev',...}[m[2]] || m[2]) + '/' + m[1]
//           : '';
//         verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
//           (monthLabel ? ' · ' + monthLabel : '');
//       }
//     } catch (e) { console.warn(...); }
//   }
//
// Topology (4 sub-checks):
//   1a. try/catch net: covers validate + safe DOM write fallback.
//   1b. backtesting chip: reads JSON_ENVELOPE.backtesting, formats
//       'perfect de total crises testadas e acertadas', or fallback.
//   1c. composite chip: reads computeCompositeScore(), formats
//       'Painel geral N em 100', or fallback when null.
//   1d. version chip: parses build_date YYYY-MM-DD into month/year
//       label, concatenates with meta_version.
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 cases.
//        (a) full envelope + dimData → btEl='5 de 7 crises...',
//            compEl='Painel geral 67 em 100', redEl='3 alerta(s)...',
//            verEl='D3 2.0.1 · jul/2026'.
//        (b) envelope with no backtesting → btEl='crises testadas —'.
//        (c) dimData empty → composite chip falls back 'Painel geral
//            —/100'.
//        (d) build_date absent → version chip 'D3 2.0.1' (no month).
//   F1 — dropInv1a (try/catch net). mock getElementById throws.
//        Healthy → catches → no throw. T1 → throws to caller.
//   F2 — dropInv1b (backtesting format). T2 falls back to
//        'crises testadas —' even with bt present. Healthy
//        produces '5 de 7 crises testadas e acertadas'.
//   F3 — dropInv1c (composite format). T3 forces '—/100' even
//        when computeCompositeScore returns 67.
//   F4 — dropInv1d (version month parse). T4 returns
//        'D3 2.0.1' (no ' · jul/2026'). Healthy appends month.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) full envelope + dimData: all 4 chips correct.
    deps.resetEnv();
    deps.setJSONEnvelope({
      meta_version: '2.0.1',
      build_date: '2026-07-15',
      backtesting: { perfect: 5, total: 7 }
    });
    deps.setDimData({
      s1: { score: 60, weight: 0.5, status: 'AMBER' },
      s2: { score: 70, weight: 0.3, status: 'RED' },
      s3: { score: 80, weight: 0.2, status: 'RED' }
    });
    renderFn();
    var btEl  = deps.getMockEl('bottom-backtesting');
    var coEl  = deps.getMockEl('bottom-composite');
    var rdEl  = deps.getMockEl('bottom-red-count');
    var veEl  = deps.getMockEl('bottom-version');
    if (btEl.textContent !== '5 de 7 crises testadas e acertadas') {
      issues.push('F0 (a) btEl — expected "5 de 7 crises testadas e acertadas", got "' + btEl.textContent + '"');
    }
    if (coEl.textContent !== 'Painel geral 67 em 100') {
      issues.push('F0 (a) compEl — expected "Painel geral 67 em 100", got "' + coEl.textContent + '"');
    }
    if (rdEl.textContent !== '2 alerta(s) vermelho(s) ativo(s)') {
      issues.push('F0 (a) redEl — expected "2 alerta(s) vermelho(s) ativo(s)", got "' + rdEl.textContent + '"');
    }
    if (veEl.textContent !== 'D3 2.0.1 · jul/2026') {
      issues.push('F0 (a) verEl — expected "D3 2.0.1 · jul/2026", got "' + veEl.textContent + '"');
    }

    // (b) envelope with no backtesting → fallback 'crises testadas —'.
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '' });
    deps.setDimData({});
    renderFn();
    btEl = deps.getMockEl('bottom-backtesting');
    if (btEl.textContent !== 'crises testadas —') {
      issues.push('F0 (b) btEl fallback — expected "crises testadas —", got "' + btEl.textContent + '"');
    }

    // (c) empty dimData → composite chip fallback.
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '2026-07-15' });
    deps.setDimData({});
    renderFn();
    coEl = deps.getMockEl('bottom-composite');
    if (coEl.textContent !== 'Painel geral —/100') {
      issues.push('F0 (c) compEl fallback — expected "Painel geral —/100", got "' + coEl.textContent + '"');
    }

    // (d) no build_date → version chip without month suffix.
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '' });
    deps.setDimData({});
    renderFn();
    veEl = deps.getMockEl('bottom-version');
    if (veEl.textContent !== 'D3 2.0.1') {
      issues.push('F0 (d) verEl no-month — expected "D3 2.0.1", got "' + veEl.textContent + '"');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (try/catch net). Force mock DOM to throw.
  // Healthy → caught, returns normally. T1 → throws to caller.
  // ============================================================
  function runF1_tryCatchNetDropped(renderFn) {
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '2026-07-15' });
    deps.setDimData({});
    deps.setThrowOnGetElementById(true);
    var threw = false;
    try {
      renderFn();
    } catch (e) {
      threw = true;
    }
    deps.setThrowOnGetElementById(false);
    if (threw) {
      return ['F1 try/catch net drop detected — broken threw out of renderBottomBar (healthy catches DOM error)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (backtesting chip format drop → always fallback).
  // Healthy produces "5 de 7 crises testadas e acertadas".
  // T2 always sets "crises testadas —".
  // ============================================================
  function runF2_backtestingFormatDropped(renderFn) {
    deps.resetEnv();
    deps.setJSONEnvelope({
      meta_version: '2.0.1',
      build_date: '2026-07-15',
      backtesting: { perfect: 5, total: 7 }
    });
    deps.setDimData({});
    renderFn();
    var btEl = deps.getMockEl('bottom-backtesting');
    if (btEl.textContent === 'crises testadas —') {
      return ['F2 backtesting format drop detected — broken fell back to "crises testadas —" (healthy = "5 de 7 crises testadas e acertadas")'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (composite chip format drop → always fallback).
  // Healthy produces "Painel geral 67 em 100" (c=67).
  // T3 always sets "Painel geral —/100".
  // ============================================================
  function runF3_compositeFormatDropped(renderFn) {
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '2026-07-15' });
    deps.setDimData({
      s1: { score: 60, weight: 0.5, status: 'AMBER' },
      s2: { score: 70, weight: 0.3, status: 'RED' },
      s3: { score: 80, weight: 0.2, status: 'RED' }
    });
    renderFn();
    var coEl = deps.getMockEl('bottom-composite');
    if (coEl.textContent === 'Painel geral —/100') {
      return ['F3 composite format drop detected — broken fell back to "Painel geral —/100" (healthy = "Painel geral 67 em 100")'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (version month parse drop → no ' · jul/2026').
  // Healthy produces "D3 2.0.1 · jul/2026" for build_date "2026-07-15".
  // T4 produces "D3 2.0.1" (no month suffix).
  // ============================================================
  function runF4_versionMonthParseDropped(renderFn) {
    deps.resetEnv();
    deps.setJSONEnvelope({ meta_version: '2.0.1', build_date: '2026-07-15' });
    deps.setDimData({});
    renderFn();
    var veEl = deps.getMockEl('bottom-version');
    if (veEl.textContent === 'D3 2.0.1') {
      return ['F4 version month parse drop detected — broken wrote "D3 2.0.1" without " · jul/2026" (healthy parses build_date)'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_tryCatchNetDropped,            target_id: 'T1' },
    { id: 'F2', fn: runF2_backtestingFormatDropped,      target_id: 'T2' },
    { id: 'F3', fn: runF3_compositeFormatDropped,        target_id: 'T3' },
    { id: 'F4', fn: runF4_versionMonthParseDropped,      target_id: 'T4' }
  ];
};
