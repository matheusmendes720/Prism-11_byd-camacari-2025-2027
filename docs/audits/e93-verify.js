// e93-verify.js — showTooltip() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4211-4231 (showTooltip —
// shows tooltip near mouse cursor with node info).
//
// Invariants (2 sub-checks):
//   1a. tooltip display = 'block'.
//   1b. tooltip innerHTML is non-empty.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================

var _tooltipEl = null;
var _tooltipCreated = false;
var _tooltipDisplay = 'none';
var _tooltipHTML = '';

function resetEnv() {
  _tooltipEl = null;
  _tooltipCreated = false;
  _tooltipDisplay = 'none';
  _tooltipHTML = '';
}

// _getTooltip mirror — lazy-creates a singleton tooltip element.
function getTooltipEl() {
  if (_tooltipEl && _tooltipEl._isConnected) return _tooltipEl;
  _tooltipCreated = true;
  _tooltipEl = {
    _isConnected: true,
    id: 'd3-node-tooltip',
    style: {
      _display: 'none',
      get display() { return this._display; },
      set display(v) { this._display = v; _tooltipDisplay = v; },
      left: '0px',
      top: '0px'
    },
    innerHTML: '',
    get innerHTML() { return _tooltipHTML; },
    set innerHTML(v) { _tooltipHTML = v; }
  };
  return _tooltipEl;
}

function getSnapshot() {
  return {
    tooltipCreated: _tooltipCreated,
    tooltipDisplay: _tooltipDisplay,
    tooltipHTML: _tooltipHTML
  };
}

global.document = {
  createElement: function (tag) {
    return {
      id: '',
      style: {},
      innerHTML: '',
      appendChild: function () {}
    };
  },
  body: {
    appendChild: function () {}
  }
};

// ============================================================
// Broken mutant — drops tooltip display='block' (still sets innerHTML)
// ============================================================
function makeBF(opts) {
  return function (event, node) {
    if (MIRROR_REPAIRED) {
      // healthy path
      var tt = getTooltipEl();
      if (!node) return;
      var id = node.id || node.dimension || '';
      var label = node.label || node.name || id;
      var ntype = node.ntype || node.type || '';
      var status = node.status || '';
      var score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
      var html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
      html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
      if (status) html += '<div>Status: <b>' + status + '</b></div>';
      if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
      tt.innerHTML = html;
      tt.style.display = 'block';
      var x = (event && event.clientX || 0) + 14;
      var y = (event && event.clientY || 0) + 14;
      tt.style.left = x + 'px';
      tt.style.top = y + 'px';
      return;
    }
    try {
      if (!node) return;
      var tt = getTooltipEl();
      var nid = node.id || node.dimension || '';
      var nlabel = node.label || node.name || nid;
      var nntype = node.ntype || node.type || '';
      var nstatus = node.status || '';
      var nscore = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
      var thtml = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + nlabel + '</div>';
      thtml += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + nid + ' · ' + nntype + '</div>';
      if (nstatus) thtml += '<div>Status: <b>' + nstatus + '</b></div>';
      if (nscore) thtml += '<div>Score: <b>' + nscore + '/100</b></div>';
      tt.innerHTML = thtml;
      // T1: drop display='block' — tooltip stays hidden.
      if (!opts.dropDisplayBlock) {
        tt.style.display = 'block';
      }
      var mx = (event && event.clientX || 0) + 14;
      var my = (event && event.clientY || 0) + 14;
      tt.style.left = mx + 'px';
      tt.style.top = my + 'px';
    } catch (err) {
      console.error('[D3 showTooltip] error:', err);
    }
  };
}

var MUTANTS = [
  // T1 drops display='block' → tooltip stays at display='none'.
  { id: 'T1', fn: makeBF({ dropDisplayBlock: true }), target: 'F0', drop: 'tooltip display=block (1a)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e93-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  getSnapshot: getSnapshot
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E93 — showTooltip() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-showTooltip, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  // Use a proper healthy showTooltip that calls getTooltipEl properly.
  var healthyFn = function(event, node) {
    var tt = getTooltipEl();
    if (!node) return;
    var id = node.id || node.dimension || '';
    var label = node.label || node.name || id;
    var ntype = node.ntype || node.type || '';
    var status = node.status || '';
    var score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
    var html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    tt.innerHTML = html;
    tt.style.display = 'block';
    var x = (event && event.clientX || 0) + 14;
    var y = (event && event.clientY || 0) + 14;
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  };
  var issues = fix.fn(healthyFn);
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
