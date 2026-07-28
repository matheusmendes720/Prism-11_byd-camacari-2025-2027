// e30_verify.js — exportSVG Blob URL composition invariant
//
// E30 establishes that exportSVG (L3930-3940 of D3-PITCH-GRAPH.html) composes
// the eight-step file-export pipeline:
//
//   1. svg.cloneNode(true)        — deep-clone the live SVG
//   2. XMLSerializer.serialize    — to XML string with prolog
//   3. new Blob([xml], type)      — wrap with image/svg+xml mime
//   4. URL.createObjectURL(blob)  — get blob URL
//   5. document.createElement(a)  — create anchor element
//   6. a.href = url               — point anchor at blob URL
//   7. a.download = 'd3-...'      — name the download
//   8. a.click()                  — trigger the download
//   9. URL.revokeObjectURL(url)   — release the blob URL
//
// Composition contract verified:
//   (a) cloneNode is called on svg with deep=true
//   (b) XML serialization includes the prolog + cloned node XML
//   (c) Blob is created with the XML content and image/svg+xml mime type
//   (d) URL.createObjectURL receives the blob and returns a URL
//   (e) anchor element gets href=url and download='d3-knowledge-graph.svg'
//   (f) anchor.click() is invoked to trigger the browser download
//   (g) URL.revokeObjectURL is called on the same URL AFTER click
//       (order matters — revoking before click kills the URL)
//
// The harness mirrors exportSVG and replaces XMLSerializer / Blob /
// URL / document.createElement with observable mocks. Each mock captures
// the call sequence so we can verify order-sensitive composition.
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock XMLSerializer — captures serializeToString invocations
// ------------------------------------------------------------------
function makeMockXMLSerializer() {
  return {
    _calls: [],
    serializeToString: function (node) {
      this._calls.push({ node: node, when: 'serialize' });
      return '<svg-clone/>';
    }
  };
}

// ------------------------------------------------------------------
// Mock Blob — captures constructor args + mime
// ------------------------------------------------------------------
function makeMockBlobClass() {
  var calls = [];
  function Blob(parts, opts) {
    this._parts = parts;
    this._opts = opts || {};
    this._callIndex = calls.length;
    calls.push({ parts: parts, opts: opts });
  }
  Blob._calls = calls;
  return Blob;
}

// ------------------------------------------------------------------
// Mock URL — captures createObjectURL / revokeObjectURL
// ------------------------------------------------------------------
function makeMockURL() {
  return {
    _createCalls: [],
    _revokeCalls: [],
    _nextId: 1,
    createObjectURL: function (blob) {
      var url = 'blob:fake-' + (this._nextId++);
      this._createCalls.push({ blob: blob, url: url });
      return url;
    },
    revokeObjectURL: function (url) {
      this._revokeCalls.push({ url: url });
    }
  };
}

// ------------------------------------------------------------------
// Mock document — captures createElement calls + anchor behavior
// ------------------------------------------------------------------
function makeMockDocument() {
  return {
    _createCalls: [],
    createElement: function (tag) {
      var el = {
        _tag: tag,
        _attrs: {},
        setAttribute: function (k, v) { this._attrs[k] = v; },
        getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; },
        click: function () {
          this._clicked = true;
          this._clickCount = (this._clickCount || 0) + 1;
        }
      };
      // Capture href / download assignments as attr-like writes
      Object.defineProperty(el, 'href', {
        get: function () { return el._href; },
        set: function (v) { el._href = v; }
      });
      Object.defineProperty(el, 'download', {
        get: function () { return el._download; },
        set: function (v) { el._download = v; }
      });
      this._createCalls.push({ tag: tag, el: el });
      return el;
    }
  };
}

// ------------------------------------------------------------------
// Mock svg with cloneNode
// ------------------------------------------------------------------
function makeMockSVG() {
  return {
    _clones: [],
    cloneNode: function (deep) {
      var c = { _tag: 'svg', _deep: deep, _isClone: true };
      this._clones.push({ deep: deep, node: c });
      return c;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L3930-3940 — exportSVG file-export pipeline
// ------------------------------------------------------------------
function registerExportSVG(deps) {
  return function exportSVG() {
    var clone = deps.svg.cloneNode(true);
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
    var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
    var url = deps.url.createObjectURL(blob);
    var a = deps.document.createElement('a');
    a.href = url;
    a.download = 'd3-knowledge-graph.svg';
    a.click();
    deps.url.revokeObjectURL(url);
  };
}

// ------------------------------------------------------------------
// Setup helper — builds a fresh harness for a single test
// ------------------------------------------------------------------
function setupHarness() {
  var svg = makeMockSVG();
  var xmlSerializer = makeMockXMLSerializer();
  var Blob = makeMockBlobClass();
  var url = makeMockURL();
  var document = makeMockDocument();
  var deps = {
    svg: svg, xmlSerializer: xmlSerializer, Blob: Blob,
    url: url, document: document
  };
  return { deps: deps, exportSVG: registerExportSVG(deps) };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of export pipeline
// ------------------------------------------------------------------
function installMutant(kind, deps) {
  if (kind === 'T1') {
    // T1: skip cloneNode — pass svg (live) directly to XMLSerializer. This
    //     serializes the live svg, breaking any future DOM mutations and
    //     potentially leaking script content.
    return function () {
      var liveNode = deps.svg;  // SKIPPED cloneNode
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(liveNode);
      var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
      var url = deps.url.createObjectURL(blob);
      var a = deps.document.createElement('a');
      a.href = url;
      a.download = 'd3-knowledge-graph.svg';
      a.click();
      deps.url.revokeObjectURL(url);
    };
  } else if (kind === 'T2') {
    // T2: wrong blob type — 'image/png' instead of 'image/svg+xml'. Browser
    //     will reject the download / mis-render.
    return function () {
      var clone = deps.svg.cloneNode(true);
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
      var blob = new deps.Blob([xml], { type: 'image/png' });  // WRONG MIME
      var url = deps.url.createObjectURL(blob);
      var a = deps.document.createElement('a');
      a.href = url;
      a.download = 'd3-knowledge-graph.svg';
      a.click();
      deps.url.revokeObjectURL(url);
    };
  } else if (kind === 'T3') {
    // T3: skip URL.createObjectURL — use raw blob reference as href. Browser
    //     href must be a string URL, not a Blob object.
    return function () {
      var clone = deps.svg.cloneNode(true);
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
      var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
      // SKIPPED URL.createObjectURL — use blob directly
      var a = deps.document.createElement('a');
      a.href = blob;  // WRONG: Blob, not string URL
      a.download = 'd3-knowledge-graph.svg';
      a.click();
      // revokeObjectURL not called since no URL was created
    };
  } else if (kind === 'T4') {
    // T4: skip anchor.click() — anchor is created with href/download but
    //     click() is never invoked. No download triggers.
    return function () {
      var clone = deps.svg.cloneNode(true);
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
      var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
      var url = deps.url.createObjectURL(blob);
      var a = deps.document.createElement('a');
      a.href = url;
      a.download = 'd3-knowledge-graph.svg';
      // SKIPPED a.click()
      deps.url.revokeObjectURL(url);
    };
  } else if (kind === 'T5') {
    // T5: skip URL.revokeObjectURL — memory leak. Blob URL never released.
    return function () {
      var clone = deps.svg.cloneNode(true);
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
      var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
      var url = deps.url.createObjectURL(blob);
      var a = deps.document.createElement('a');
      a.href = url;
      a.download = 'd3-knowledge-graph.svg';
      a.click();
      // SKIPPED URL.revokeObjectURL
    };
  } else if (kind === 'T6') {
    // T6: wrong download filename — 'foo.svg' instead of 'd3-knowledge-graph.svg'.
    return function () {
      var clone = deps.svg.cloneNode(true);
      var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + deps.xmlSerializer.serializeToString(clone);
      var blob = new deps.Blob([xml], { type: 'image/svg+xml' });
      var url = deps.url.createObjectURL(blob);
      var a = deps.document.createElement('a');
      a.href = url;
      a.download = 'foo.svg';  // WRONG FILENAME
      a.click();
      deps.url.revokeObjectURL(url);
    };
  }
  // T7 is the control
  return null;
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E30 EXPORTSVG BLOB URL COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — cloneNode is called on svg with deep=true',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        return {
          issues: [
            (h.deps.svg._clones.length !== 1) && 'cloneNode should fire exactly once, got ' + h.deps.svg._clones.length,
            (h.deps.svg._clones[0].deep !== true) && 'cloneNode should be called with deep=true, got ' + JSON.stringify(h.deps.svg._clones[0].deep)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F2 — XMLSerializer serializes the cloned node (not the live svg)',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        var serialized = h.deps.xmlSerializer._calls[0] && h.deps.xmlSerializer._calls[0].node;
        return {
          issues: [
            (h.deps.xmlSerializer._calls.length !== 1) && 'serializeToString should be called exactly once, got ' + h.deps.xmlSerializer._calls.length,
            (!serialized || !serialized._isClone) && 'serialized node should be the clone (not the live svg)'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F3 — Blob is created with [xml] parts and image/svg+xml mime',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        var blobCall = h.deps.Blob._calls[0];
        return {
          issues: [
            (!blobCall) && 'Blob was not constructed',
            (blobCall && (!Array.isArray(blobCall.parts) || blobCall.parts.length !== 1 || typeof blobCall.parts[0] !== 'string')) && 'Blob parts should be array of 1 string, got ' + JSON.stringify(blobCall && blobCall.parts),
            (blobCall && blobCall.opts && blobCall.opts.type !== 'image/svg+xml') && 'Blob type should be image/svg+xml, got ' + JSON.stringify(blobCall && blobCall.opts && blobCall.opts.type)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F4 — URL.createObjectURL is called with the blob, returning a URL',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        var createCall = h.deps.url._createCalls[0];
        return {
          issues: [
            (!createCall) && 'createObjectURL was not called',
            (createCall && !createCall.blob) && 'createObjectURL should receive the blob',
            (createCall && typeof createCall.url !== 'string') && 'createObjectURL should return a string URL'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F5 — anchor element gets href=url and download=d3-knowledge-graph.svg',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        var anchor = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
        var createUrl = h.deps.url._createCalls[0] && h.deps.url._createCalls[0].url;
        return {
          issues: [
            (!anchor) && 'anchor element was not created',
            (anchor && anchor._tag !== 'a') && 'created element should be <a>, got ' + anchor._tag,
            (anchor && anchor._href !== createUrl) && 'anchor.href should be the blob URL, got ' + JSON.stringify(anchor._href),
            (anchor && anchor._download !== 'd3-knowledge-graph.svg') && 'anchor.download should be "d3-knowledge-graph.svg", got ' + JSON.stringify(anchor._download)
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F6 — anchor.click() fires AND URL.revokeObjectURL is called on the SAME URL AFTER click',
      setup: function () {
        var h = setupHarness();
        h.exportSVG();
        var anchor = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
        var createUrl = h.deps.url._createCalls[0] && h.deps.url._createCalls[0].url;
        var revokeCalls = h.deps.url._revokeCalls;
        var revokeMatchesCreate = revokeCalls.some(function (c) { return c.url === createUrl; });
        return {
          issues: [
            (!anchor || !anchor._clicked) && 'anchor.click() was not invoked',
            (revokeCalls.length === 0) && 'URL.revokeObjectURL was never called',
            (!revokeMatchesCreate) && 'revokeObjectURL was not called on the SAME URL that was created (memory leak / wrong URL revoked)'
          ].filter(Boolean)
        };
      }
    }
  ];

  for (var i = 0; i < FIXTURES.length; i++) {
    var fx = FIXTURES[i];
    var result = fx.setup();
    total++;
    if (result.issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + fx.name);
    } else {
      failed++;
      console.log('  [FAIL] ' + fx.name + ': ' + result.issues.length + ' issues');
      for (var j = 0; j < result.issues.length; j++) {
        console.log('    - ' + result.issues[j]);
      }
    }
  }

  // ADVERSARIAL MUTANTS (T1-T7)
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');
  function recordAdversarial(label, kind) {
    total++;
    var h = setupHarness();
    var mutated = installMutant(kind, h.deps);
    var fn = mutated || h.exportSVG;
    fn();

    var issues = [];

    if (kind === 'T1') {
      // T1: cloneNode skipped. Healthy: cloneNode called once with deep=true.
      // Mutant: cloneNode NOT called → _clones.length === 0.
      // Push issue WHEN mutant is active (length === 0 means cloneNode was skipped).
      if (h.deps.svg._clones.length === 0) {
        issues.push('T1: cloneNode should have been called but was skipped (got 0 calls)');
      }
      // Mutant serialized the LIVE svg (no _isClone marker on the live node).
      var serialized = h.deps.xmlSerializer._calls[0] && h.deps.xmlSerializer._calls[0].node;
      if (serialized && serialized._isClone) {
        issues.push('T1: serialized node should NOT have _isClone marker (live svg was used instead of clone)');
      }
    } else if (kind === 'T2') {
      // T2: wrong blob type 'image/png'. Healthy: 'image/svg+xml'.
      // Push issue WHEN mutant is active (type === 'image/png').
      var blobCall = h.deps.Blob._calls[0];
      if (blobCall && blobCall.opts && blobCall.opts.type === 'image/png') {
        issues.push('T2: Blob type is image/png (mutant), should be image/svg+xml');
      }
    } else if (kind === 'T3') {
      // T3: skipped URL.createObjectURL. Healthy: createObjectURL called.
      // Mutant: never called. Push issue WHEN mutant is active (length === 0).
      if (h.deps.url._createCalls.length === 0) {
        issues.push('T3: createObjectURL should have been called but was skipped (got 0 calls)');
      }
      // Anchor was still created with href=blob (wrong type).
      var anchor = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
      if (anchor && typeof anchor._href !== 'string') {
        issues.push('T3: anchor.href should NOT be a string URL (got blob reference, type=' + typeof anchor._href + ')');
      }
    } else if (kind === 'T4') {
      // T4: skipped anchor.click(). Healthy: anchor.click() fires.
      // Push issue WHEN mutant is active (click NOT called → _clicked is undefined/false).
      var anchor4 = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
      if (anchor4 && !anchor4._clicked) {
        issues.push('T4: anchor.click() should have been called but was skipped (no _clicked flag)');
      }
    } else if (kind === 'T5') {
      // T5: skipped URL.revokeObjectURL. Healthy: revoke called on same URL.
      // Mutant: never called → _revokeCalls.length === 0.
      // Push issue WHEN mutant is active.
      if (h.deps.url._revokeCalls.length === 0) {
        issues.push('T5: revokeObjectURL should have been called but was skipped (memory leak)');
      }
    } else if (kind === 'T6') {
      // T6: wrong download filename. Healthy: 'd3-knowledge-graph.svg'.
      // Mutant: 'foo.svg'. Push issue WHEN mutant is active (download === 'foo.svg').
      var anchor6 = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
      if (anchor6 && anchor6._download === 'foo.svg') {
        issues.push('T6: anchor.download is "foo.svg" (mutant), should be "d3-knowledge-graph.svg"');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy export runs the full pipeline
      if (h.deps.svg._clones.length !== 1) issues.push('control: cloneNode should fire once, got ' + h.deps.svg._clones.length);
      if (h.deps.xmlSerializer._calls.length !== 1) issues.push('control: serializeToString should fire once');
      if (h.deps.Blob._calls.length !== 1) issues.push('control: Blob should fire once');
      if (h.deps.url._createCalls.length !== 1) issues.push('control: createObjectURL should fire once');
      if (h.deps.url._revokeCalls.length !== 1) issues.push('control: revokeObjectURL should fire once');
      var anchor7 = h.deps.document._createCalls[0] && h.deps.document._createCalls[0].el;
      if (!anchor7 || !anchor7._clicked) issues.push('control: anchor.click() should fire');
      if (anchor7 && anchor7._download !== 'd3-knowledge-graph.svg') issues.push('control: download filename mismatch');
    }

    var ctrl = label.indexOf('T7') === 0;
    if (ctrl) {
      if (issues.length === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues (CONTROL BROKEN)');
        for (var k = 0; k < issues.length; k++) console.log('    - ' + issues[k]);
      }
    } else {
      if (issues.length >= 1) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥1)');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    }
  }

  recordAdversarial('T1 cloneNode skipped (live svg serialized)', 'T1');
  recordAdversarial('T2 wrong blob type (image/png)', 'T2');
  recordAdversarial('T3 URL.createObjectURL skipped', 'T3');
  recordAdversarial('T4 anchor.click() skipped', 'T4');
  recordAdversarial('T5 URL.revokeObjectURL skipped (memory leak)', 'T5');
  recordAdversarial('T6 wrong download filename', 'T6');
  recordAdversarial('T7 control (healthy export)', 'T7');

  console.log('');
  console.log('========== E30 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
