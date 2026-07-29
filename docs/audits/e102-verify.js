// e102-verify.js — renderBottomBar() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1394-1431 (renderBottomBar —
// sets four bottom-bar chips: backtesting, composite, red-count, version).
//
// Invariants (2 sub-checks, targeted at bottom-version):
//   1a. #bottom-version textContent includes 'D3'.
//   1b. #bottom-version textContent includes JSON_ENVELOPE.meta_version.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================

var _versionText = '';

function resetEnv() {
  _versionText = '';
}

function getSnapshot() {
  return {
    versionText: _versionText
  };
}

var mockMetaVersion = '1.0';
var mockEnvelope = {
  meta_version: mockMetaVersion,
  build_date: '2026-07-27',
  backtesting: { perfect: 5, total: 5 }
};

var mockVerEl = {
  textContent: '',
  _setText: function (v) {
    _versionText = v;
    mockVerEl.textContent = v;
  }
};

var mockBtEl = { textContent: '', _setText: function () {} };
var mockCompEl = { textContent: '', _setText: function () {} };
var mockRedEl = { textContent: '', _setText: function () {} };

global.document = {
  getElementById: function (id) {
    if (id === 'bottom-version') return mockVerEl;
    if (id === 'bottom-backtesting') return mockBtEl;
    if (id === 'bottom-composite') return mockCompEl;
    if (id === 'bottom-red-count') return mockRedEl;
    return null;
  }
};

var JSON_ENVELOPE = mockEnvelope;

// ============================================================
// Data stubs
// ============================================================

function computeCompositeScore() {
  return 73; // mock 73/100
}

function countRedDims() {
  return 2; // mock 2 red dims
}

// ============================================================
// Healthy renderBottomBar (L1394-1431)
// ============================================================
function healthyRenderBottomBar() {
  try {
    var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
    var btEl = document.getElementById('bottom-backtesting');
    if (btEl) {
      btEl.textContent = bt
        ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
        : 'crises testadas —';
      btEl._setText(btEl.textContent);
    }
    var compEl = document.getElementById('bottom-composite');
    if (compEl) {
      var c = computeCompositeScore();
      compEl.textContent = (c === null)
        ? 'Painel geral —/100'
        : ('Painel geral ' + Math.round(c) + ' em 100');
      compEl._setText(compEl.textContent);
    }
    var redEl = document.getElementById('bottom-red-count');
    if (redEl) {
      var r = countRedDims();
      redEl.textContent = (r === null)
        ? '— alertas vermelhos ativos'
        : (r + ' alerta(s) vermelho(s) ativo(s)');
      redEl._setText(redEl.textContent);
    }
    var verEl = document.getElementById('bottom-version');
    if (verEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      var text = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
      verEl.textContent = text;
      verEl._setText(text);
    }
  } catch (e) {
    // Silent
  }
}

// ============================================================
// Broken mutant — drops verEl.textContent assignment
// ============================================================
function brokenRenderBottomBar() {
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  try {
    var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
    var btEl = document.getElementById('bottom-backtesting');
    if (btEl) {
      btEl.textContent = bt
        ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
        : 'crises testadas —';
      btEl._setText(btEl.textContent);
    }
    var compEl = document.getElementById('bottom-composite');
    if (compEl) {
      var c = computeCompositeScore();
      compEl.textContent = (c === null)
        ? 'Painel geral —/100'
        : ('Painel geral ' + Math.round(c) + ' em 100');
      compEl._setText(compEl.textContent);
    }
    var redEl = document.getElementById('bottom-red-count');
    if (redEl) {
      var r = countRedDims();
      redEl.textContent = (r === null)
        ? '— alertas vermelhos ativos'
        : (r + ' alerta(s) vermelho(s) ativo(s)');
      redEl._setText(redEl.textContent);
    }
    var verEl = document.getElementById('bottom-version');
    if (verEl) {
      // T1: drop verEl.textContent assignment — bottom-version stays blank
      // var bd = ...; var monthLabel = ...; var text = ...;
      // verEl.textContent = text;
    }
  } catch (e) {
    // Silent
  }
}

var MUTANTS = [
  { id: 'T1', fn: brokenRenderBottomBar, target: 'F0', drop: 'verEl.textContent assignment (1a, 1b)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e102-fixtures.js');
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

console.log('=== E102 — renderBottomBar() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderBottomBar, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyRenderBottomBar);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderBottomBar) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
