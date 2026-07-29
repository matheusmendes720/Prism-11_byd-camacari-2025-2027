// e86-verify.js — exportSVG() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3930-3940 (exportSVG — clones the live
// SVG, prepends an XML declaration, packages as a Blob with
// image/svg+xml MIME type, anchors it to d3-knowledge-graph.svg,
// triggers download via anchor.click(), and revokes the object URL).
//
// Invariants (4 sub-checks):
//   1a. cloneNode(true): clone the live SVG once.
//   1b. XML declaration: prefix '<?xml version="1.0" encoding="UTF-8"?>\n'.
//   1c. Blob MIME type: 'image/svg+xml'.
//   1d. download filename: 'd3-knowledge-graph.svg'.
//
// Inverted mutant pattern: each fixture seeds a mock SVG (with
// cloneNode returning a sentinel clone), a Blob constructor that
// captures parts+options, an anchor element recording click() and
// download/href, URL.createObjectURL/revokeObjectURL, and a shim for
// document.createElement. Healthy version: clone → prepend XML →
// Blob with image/svg+xml → set href/download/click → revokeObjectURL.
// Broken mutant drops a sub-check → distinct observable state.
//
// Note: there is no try/catch net in the source — exportSVG is a
// best-effort download trigger and lets throws propagate to the
// caller. Drop detection is direct: a side-effect that simply
// isn't there. No warn-count gymnastics needed.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. Plus F0 has
// 4 sub-cases (treated as one report) = 9 reports total.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — svg, XMLSerializer, Blob, URL, document.
// ============================================================

var _cloneCount = 0;
var _blobParts = [];
var _blobOptions = null;
var _clickCount = 0;
var _href = '';
var _download = '';
var _revokeCount = 0;
var _objectUrl = 'blob:mock-export-url-001';

function getCloneCount() { return _cloneCount; }
function getBlobParts() { return _blobParts; }
function getBlobOptions() { return _blobOptions; }
function getClickCount() { return _clickCount; }
function getDownload() { return _download; }
function getHref() { return _href; }
function getRevokeCount() { return _revokeCount; }

// Mock SVG with cloneNode returning a sentinel clone whose
// serializeToString returns a known SVG string.
var mockSvg = {
  _cloneStr: '<svg xmlns="http://www.w3.org/2000/svg"><g/></svg>',
  cloneNode: function (deep) {
    _cloneCount++;
    return { _isClone: true, _deep: deep };
  }
};

function healthyXMLSerializer() {
  return {
    serializeToString: function (node) {
      // Return a representative SVG body for healthy. T2-broken
      // (no XML prefix) still ends up calling serializeToString; only
      // the prefix concatenation is the violation.
      return node && node._isClone ? mockSvg._cloneStr : '<root/>';
    }
  };
}

function MockBlob(parts, options) {
  _blobParts = parts;
  _blobOptions = options;
  this.size = (parts && parts[0] && parts[0].length) || 0;
  this.type = (options && options.type) || '';
}

function mockCreateObjectURL(blob) {
  return _objectUrl;
}
function mockRevokeObjectURL(url) {
  _revokeCount++;
  return undefined;
}

function mockCreateElement(tag) {
  if (tag !== 'a') {
    return { tagName: tag.toUpperCase() };
  }
  return {
    tagName: 'A',
    _href: '',
    _download: '',
    _clicked: 0,
    get href() { return this._href; },
    set href(v) { this._href = v; _href = v; },
    get download() { return this._download; },
    set download(v) { this._download = v; _download = v; },
    click: function () { this._clicked++; _clickCount++; }
  };
}

function resetEnv() {
  _cloneCount = 0;
  _blobParts = [];
  _blobOptions = null;
  _clickCount = 0;
  _href = '';
  _download = '';
  _revokeCount = 0;
}

// ============================================================
// Mock document. (Note: source uses `const svg` — a closed-over
// reference to the live d3-svg element. We model the healthy
// mirror's svg reference as a local var, not document.getElementById,
// so the source-faithful mirror doesn't need a DOM. The verify
// harness routes `document.createElement` through mockCreateElement
// only for the anchor element.)
// ============================================================
global.document = {
  createElement: mockCreateElement
};
global.Blob = MockBlob;
global.URL = {
  createObjectURL: mockCreateObjectURL,
  revokeObjectURL: mockRevokeObjectURL
};
global.XMLSerializer = healthyXMLSerializer;

// ============================================================
// Mirror — exportSVG() (HEALTHY, faithful to L3930-3940)
// ============================================================
var svg = mockSvg;

function healthyExportSVG() {
  const clone = svg.cloneNode(true);
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'd3-knowledge-graph.svg';
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// Broken mutants — 4 boolean flags.
// dropInv1a: no cloneNode(true).
// dropInv1b: no XML declaration prefix.
// dropInv1c: no MIME type / wrong type.
// dropInv1d: no / wrong download filename.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyExportSVG();

    let clone;
    if (opts.dropInv1a) {
      // No cloneNode — use the live svg directly. Will still go
      // through XMLSerializer but the side-effect counter won't
      // tick. Also serializes the live svg (which still has
      // serializeToString via the same mock).
      clone = svg;
    } else {
      clone = svg.cloneNode(true);
    }
    let xml;
    if (opts.dropInv1b) {
      xml = new XMLSerializer().serializeToString(clone);
    } else {
      xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
    }
    let blobOpts;
    if (opts.dropInv1c) {
      blobOpts = { type: '' };
    } else {
      blobOpts = { type: 'image/svg+xml' };
    }
    const blob = new Blob([xml], blobOpts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if (opts.dropInv1d) {
      a.download = '';
    } else {
      a.download = 'd3-knowledge-graph.svg';
    }
    a.click();
    URL.revokeObjectURL(url);
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'cloneNode(true) (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'XML declaration (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'MIME type (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'download filename (1d)' }
];

// ============================================================
// Fixtures — sourced from e86-fixtures.js
// ============================================================
var fx = require('./e86-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getCloneCount: getCloneCount,
  getBlobParts: getBlobParts,
  getBlobOptions: getBlobOptions,
  getClickCount: getClickCount,
  getDownload: getDownload,
  getHref: getHref,
  getRevokeCount: getRevokeCount
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E86 — exportSVG() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
  resetEnv();
  var mutantIssues = [];
  var fix = ALL_FIXTURES.find(function (f) { return f.id === mutant.target; });
  if (fix) {
    var issues = fix.fn(mutant.fn);
    mutantIssues = mutantIssues.concat(issues);
  }
  totalReports++;
  var detected = mutantIssues.length > 0;
  var pass = MIRROR_REPAIRED ? !detected : detected;
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (broken-exportSVG, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyExportSVG);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy exportSVG) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);