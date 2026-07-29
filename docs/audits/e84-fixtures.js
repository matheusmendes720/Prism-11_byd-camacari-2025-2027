// e84-fixtures.js — per-function probes for E84 escapeHtml
//
// Inverted mutant-detection: each fixture provides a single input
// string to escapeHtml(). Healthy version: null/undefined → '';
// otherwise apply 5 chained .replace() (in order: & < > " ').
// Broken mutant drops a sub-check → distinct output.
//
// Source — D3-PITCH-GRAPH.html L1675-1683:
//   function escapeHtml(s) {
//     if (s == null) return '';
//     return String(s)
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;');
//   }
//
// Topology (4 sub-checks):
//   1a. null/undefined guard: empty string on null/undefined.
//   1b. &  → &amp;
//   1c. <  → &lt;
//   1d. >  → &gt;
// (1e "&quot;) and (1f "&#39;") are also covered by F0 (d).
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 cases.
//        (a) input=null          → ''.
//        (b) input=undefined     → ''.
//        (c) input='plain'       → 'plain'.
//        (d) input='a<b>c&d"e\'f' → 'a&lt;b&gt;c&amp;d&quot;e&#39;f'.
//   F1 — dropInv1a (null guard). input=null → healthy returns '',
//        T1 calls String(null) = 'null' (output='null').
//   F2 — dropInv1b (& replacement). input='a&b' → 'a&amp;b',
//        T2 returns 'a&b'.
//   F3 — dropInv1c (< replacement). input='a<b' → 'a&lt;b',
//        T3 returns 'a<b'.
//   F4 — dropInv1d (> replacement). input='a>b' → 'a&gt;b',
//        T4 returns 'a>b'.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    var issues = [];

    // (a) input=null → ''.
    var r = renderFn(null);
    if (r !== '') {
      issues.push('F0 (a) input=null — expected "", got "' + r + '"');
    }

    // (b) input=undefined → ''.
    r = renderFn(undefined);
    if (r !== '') {
      issues.push('F0 (b) input=undefined — expected "", got "' + r + '"');
    }

    // (c) input='plain' → 'plain'.
    r = renderFn('plain');
    if (r !== 'plain') {
      issues.push('F0 (c) input="plain" — expected "plain", got "' + r + '"');
    }

    // (d) input='a<b>c&d"e\'f' → 'a&lt;b&gt;c&amp;d&quot;e&#39;f'.
    r = renderFn('a<b>c&d"e\'f');
    var expected = 'a&lt;b&gt;c&amp;d&quot;e&#39;f';
    if (r !== expected) {
      issues.push('F0 (d) input mixed — expected "' + expected + '", got "' + r + '"');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (null/undefined guard). input=null.
  // Healthy returns ''; T1 calls String(null) = 'null'.
  // ============================================================
  function runF1_nullGuardDropped(renderFn) {
    var r = renderFn(null);
    if (r !== '') {
      return ['F1 null guard drop detected — input=null returned "' + r + '" (healthy returns "")'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (& replacement). input='a&b'.
  // Healthy 'a&amp;b'; T2 'a&b'.
  // ============================================================
  function runF2_ampReplacementDropped(renderFn) {
    var r = renderFn('a&b');
    if (r !== 'a&amp;b') {
      return ['F2 & replacement drop detected — input="a&b" returned "' + r + '" (healthy returns "a&amp;b")'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (< replacement). input='a<b'.
  // Healthy 'a&lt;b'; T3 'a<b'.
  // ============================================================
  function runF3_ltReplacementDropped(renderFn) {
    var r = renderFn('a<b');
    if (r !== 'a&lt;b') {
      return ['F3 < replacement drop detected — input="a<b" returned "' + r + '" (healthy returns "a&lt;b")'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (> replacement). input='a>b'.
  // Healthy 'a&gt;b'; T4 'a>b'.
  // ============================================================
  function runF4_gtReplacementDropped(renderFn) {
    var r = renderFn('a>b');
    if (r !== 'a&gt;b') {
      return ['F4 > replacement drop detected — input="a>b" returned "' + r + '" (healthy returns "a&gt;b")'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,                target_id: null },
    { id: 'F1', fn: runF1_nullGuardDropped,              target_id: 'T1' },
    { id: 'F2', fn: runF2_ampReplacementDropped,         target_id: 'T2' },
    { id: 'F3', fn: runF3_ltReplacementDropped,          target_id: 'T3' },
    { id: 'F4', fn: runF4_gtReplacementDropped,          target_id: 'T4' }
  ];
};
