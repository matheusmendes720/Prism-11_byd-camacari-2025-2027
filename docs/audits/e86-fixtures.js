// e86-fixtures.js — per-function probes for E86 exportSVG
//
// Inverted mutant-detection: each fixture pre-seeds a mock SVG with
// cloneNode returning a sentinel stringy-clone, a captured Blob, an
// anchor element whose click() records into a clicks counter, and
// mock URL/document shims. Healthy version: clone SVG → prepend XML
// declaration → Blob with image/svg+xml → anchor href+download+click →
// revokeObjectURL. Broken mutant drops a sub-check → distinct
// observable state.
//
// Source — D3-PITCH-GRAPH.html L3930-3940 (exportSVG).
//
// Topology (4 sub-checks):
//   1a. cloneNode(true): call svg.cloneNode(true) on the live SVG.
//   1b. XML declaration: prefix '<?xml version="1.0" encoding="UTF-8"?>\n'.
//   1c. Blob MIME type: 'image/svg+xml'.
//   1d. download attribute: 'd3-knowledge-graph.svg'.
//
// Fixtures (F0..F4):
//   F0 — healthy control: 4 sub-checks.
//        (a) cloneNode called once (clones >= 1).
//        (b) Blob parts[0] starts with '<?xml version'.
//        (c) Blob options.type === 'image/svg+xml'.
//        (d) anchor.download === 'd3-knowledge-graph.svg'.
//   F1 — dropInv1a (cloneNode). cloneNode NOT called.
//   F2 — dropInv1b (XML declaration). Blob parts[0] lacks prefix.
//   F3 — dropInv1c (MIME type). Blob options.type === '' or wrong.
//   F4 — dropInv1d (download filename). anchor.download === '' or wrong.

'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control. 4 cases.
  // ============================================================
  function runF0_healthyControl(exportFn) {
    var issues = [];

    // (a) cloneNode called once.
    deps.resetEnv();
    exportFn();
    if (deps.getCloneCount() < 1) {
      issues.push('F0 (a) — cloneNode NOT called (healthy calls svg.cloneNode(true))');
    }

    // (b) Blob parts[0] starts with '<?xml version'.
    deps.resetEnv();
    exportFn();
    var parts = deps.getBlobParts();
    if (parts.length === 0) {
      issues.push('F0 (b) — no Blob created');
    } else if (typeof parts[0] !== 'string' || parts[0].indexOf('<?xml version') !== 0) {
      issues.push('F0 (b) — Blob parts[0] does not start with "<?xml version"');
    }

    // (c) Blob options.type === 'image/svg+xml'.
    deps.resetEnv();
    exportFn();
    var opts = deps.getBlobOptions();
    if (!opts || opts.type !== 'image/svg+xml') {
      issues.push('F0 (c) — Blob options.type expected "image/svg+xml", got "' + (opts && opts.type) + '"');
    }

    // (d) anchor.download === 'd3-knowledge-graph.svg'.
    deps.resetEnv();
    exportFn();
    var dl = deps.getDownload();
    if (dl !== 'd3-knowledge-graph.svg') {
      issues.push('F0 (d) — anchor.download expected "d3-knowledge-graph.svg", got "' + dl + '"');
    }

    return issues;
  }

  // ============================================================
  // F1 — dropInv1a (cloneNode). cloneNode NOT called.
  // Healthy: clones >= 1. T1: clones === 0.
  // ============================================================
  function runF1_cloneNodeDropped(exportFn) {
    deps.resetEnv();
    exportFn();
    if (deps.getCloneCount() === 0) {
      return ['F1 cloneNode drop detected — broken did NOT call svg.cloneNode(true) (healthy clones once)'];
    }
    return [];
  }

  // ============================================================
  // F2 — dropInv1b (XML declaration). Blob parts[0] lacks prefix.
  // Healthy: parts[0] starts with '<?xml version'. T2: missing.
  // ============================================================
  function runF2_xmlDeclarationDropped(exportFn) {
    deps.resetEnv();
    exportFn();
    var parts = deps.getBlobParts();
    if (parts.length === 0 || typeof parts[0] !== 'string' || parts[0].indexOf('<?xml version') !== 0) {
      return ['F2 XML declaration drop detected — broken Blob parts[0] missing "<?xml version" prefix (healthy prepends it)'];
    }
    return [];
  }

  // ============================================================
  // F3 — dropInv1c (MIME type). Blob options.type === '' or wrong.
  // Healthy: 'image/svg+xml'. T3: ''.
  // ============================================================
  function runF3_mimeTypeDropped(exportFn) {
    deps.resetEnv();
    exportFn();
    var opts = deps.getBlobOptions();
    if (!opts || opts.type !== 'image/svg+xml') {
      return ['F3 MIME type drop detected — broken Blob options.type is "' + (opts && opts.type) + '" (healthy is "image/svg+xml")'];
    }
    return [];
  }

  // ============================================================
  // F4 — dropInv1d (download filename). anchor.download === '' or wrong.
  // Healthy: 'd3-knowledge-graph.svg'. T4: ''.
  // ============================================================
  function runF4_downloadFilenameDropped(exportFn) {
    deps.resetEnv();
    exportFn();
    var dl = deps.getDownload();
    if (dl !== 'd3-knowledge-graph.svg') {
      return ['F4 download filename drop detected — broken anchor.download is "' + dl + '" (healthy is "d3-knowledge-graph.svg")'];
    }
    return [];
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,            target_id: null },
    { id: 'F1', fn: runF1_cloneNodeDropped,          target_id: 'T1' },
    { id: 'F2', fn: runF2_xmlDeclarationDropped,     target_id: 'T2' },
    { id: 'F3', fn: runF3_mimeTypeDropped,           target_id: 'T3' },
    { id: 'F4', fn: runF4_downloadFilenameDropped,   target_id: 'T4' }
  ];
};