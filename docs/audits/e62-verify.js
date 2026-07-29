// e62-verify.js — showTooltip() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4211-4231 (showTooltip — chrome-only stub).
// The mouse-enter handler that creates/retrieves the tooltip element, builds
// an innerHTML payload from the node's fields (label, id, ntype, status,
// score, description), sets style.display='block', and delegates to
// moveTooltip for positioning.
//
// Invariants (4 sub-checks):
//   1a. Node guard + _getTooltip invocation: function bails early when
//       !node (no tooltip created), otherwise retrieves the lazily-created
//       tooltip element.
//   1b. innerHTML composition + write: extracts label/id/ntype/status/score/
//       description from the node, composes the HTML, and assigns the result
//       to tt.innerHTML.
//   1c. style.display='block' write: makes the tooltip visible after the
//       payload is in place.
//   1d. moveTooltip(event) call: delegates the positioning step to
//       moveTooltip(event), which writes style.left / style.top with the
//       +14 offset.
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with
// expected value. Broken mutant drops the operation → sentinel survives →
// fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// The tooltip element is created lazily via _getTooltip() which calls
// document.createElement('div') + document.body.appendChild(). Both are
// mocked via the in-place elementMap pattern (mirroring E56-E61).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — tooltip stub + createElement + body.appendChild
// ============================================================

function makeTooltipStub() {
  return {
    id: '',
    cssText: '',
    innerHTML: '',
    isConnected: false,
    _appendedToBody: false,
    style: {
      cssText: '',
      display: '',
      left: '',
      top: ''
    }
  };
}

var _tooltipEl = null;
var CURRENT_EVENT = null;
var CURRENT_NODE = null;

function makeEvent(clientX, clientY) {
  CURRENT_EVENT = { clientX: clientX, clientY: clientY };
}

function setNode(node) {
  CURRENT_NODE = node;
}

function getTooltip() { return _tooltipEl; }

function resetEnv() {
  _tooltipEl = null;
  CURRENT_EVENT = null;
  CURRENT_NODE = null;
}

global.document = {
  createElement: function (tag) {
    if (tag === 'div') return makeTooltipStub();
    return null;
  },
  body: {
    appendChild: function (el) {
      el._appendedToBody = true;
      el.isConnected = true;
    }
  }
};

// _getTooltip mirror — lazy create + append on first call, return cached
// after. Mirrors the source pattern at L4199-4209.
function _getTooltip() {
  if (!_tooltipEl || !_tooltipEl.isConnected) {
    _tooltipEl = document.createElement('div');
    _tooltipEl.id = 'd3-node-tooltip';
    _tooltipEl.style.cssText = 'position:fixed;z-index:9999;...';
    document.body.appendChild(_tooltipEl);
  }
  return _tooltipEl;
}

// healthyMoveTooltip — sibling helper mirrors the E61 invariant set. shared
// between healthyShowTooltip and broken-mutant T4 (so that T4 can drop the
// call from showTooltip without affecting moveTooltip itself; moveTooltip
// stays a no-op from showTooltip's perspective).
function healthyMoveTooltip() {
  var tt = _getTooltip();
  if (!tt || tt.style.display === 'none') return;
  var event = CURRENT_EVENT;
  var x = (event.clientX || 0) + 14;
  var y = (event.clientY || 0) + 14;
  tt.style.left = x + 'px';
  tt.style.top  = y + 'px';
}

// ============================================================
// Mirror — showTooltip() (HEALTHY, simplified)
//
// Faithful to L4211-4231 invariants for the 4 sub-checks above. The
// try/catch wrapper is elided since the fixture surface already provides
// synchronous mocks with no error paths.
// ============================================================
function healthyShowTooltip() {
  var node = CURRENT_NODE;
  if (!node) return;
  var tt = _getTooltip();
  var id = node.id || node.dimension || '';
  var label = node.label || node.name || id;
  var ntype = node.ntype || node.type || '';
  var status = node.status || '';
  var score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
  var html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
  html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
  if (status) html += '<div>Status: <b>' + status + '</b></div>';
  if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
  if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
  tt.innerHTML = html;
  tt.style.display = 'block';
  healthyMoveTooltip();
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyShowTooltip() so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyShowTooltip();

    if (opts.dropInv1a) {
      // Drop node guard + _getTooltip → function bails immediately. Tooltip
      // is never created; payload never written; moveTooltip never called.
      return;
    }

    var node = CURRENT_NODE;
    if (!node) return;
    var tt = _getTooltip();

    var id = node.id || node.dimension || '';
    var label = node.label || node.name || id;
    var ntype = node.ntype || node.type || '';
    var status = node.status || '';
    var score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
    var html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';

    if (!opts.dropInv1b) tt.innerHTML = html;
    if (!opts.dropInv1c) tt.style.display = 'block';
    if (!opts.dropInv1d) healthyMoveTooltip();
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'node guard + _getTooltip (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'innerHTML composition + write (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'style.display=block write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'moveTooltip call (1d)' }
];

// ============================================================
// Fixtures — sourced from e62-fixtures.js via factory + deps
// ============================================================
var fx = require('./e62-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  makeEvent: makeEvent,
  setNode: setNode,
  getTooltip: getTooltip
});

var healthyWrappedShowTooltip = function () {
  return healthyShowTooltip();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E62 — showTooltip() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-showTooltip, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedShowTooltip);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy showTooltip) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
