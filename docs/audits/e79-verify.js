// e79-verify.js — renderBottomBar() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1394-1431 (renderBottomBar — writes 4
// chips in .bottom-bar from JSON_ENVELOPE + computeCompositeScore +
// countRedDims so the chrome can never drift from the source scores).
//
// Invariants (4 sub-checks):
//   1a. try/catch net: wraps the whole body, falls back gracefully.
//   1b. backtesting chip: JSON_ENVELOPE.backtesting →
//       'perfect de total crises testadas e acertadas', or fallback.
//   1c. composite chip: computeCompositeScore() →
//       'Painel geral N em 100', or fallback when null.
//   1d. version chip: parse build_date YYYY-MM-DD →
//       'D3 meta_version · mon/YYYY' (or no '·' if no date).
//
// Inverted mutant pattern: each fixture pre-seeds JSON_ENVELOPE,
// dimData, and a mock DOM. Healthy version writes the right
// textContent into each chip. Broken mutant drops a sub-check →
// distinct textContent or throws. Fixture reports issue → runner
// says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — JSON_ENVELOPE, dimData, mockDocument
// ============================================================
var JSON_ENVELOPE = {};
var dimData = {};
var throwOnGetElementById = false;
var mockEls = {};

function getJSONEnvelope() { return JSON_ENVELOPE; }
function setJSONEnvelope(v) { JSON_ENVELOPE = v || {}; }
function getDimData() { return dimData; }
function setDimData(v) { dimData = v || {}; }
function getThrowOnGetElementById() { return throwOnGetElementById; }
function setThrowOnGetElementById(v) { throwOnGetElementById = !!v; }
function getMockEl(id) { return mockEls[id]; }

function resetEnv() {
  JSON_ENVELOPE = {};
  dimData = {};
  throwOnGetElementById = false;
  mockEls = {
    'bottom-backtesting': { id: 'bottom-backtesting', textContent: '' },
    'bottom-composite':   { id: 'bottom-composite',   textContent: '' },
    'bottom-red-count':   { id: 'bottom-red-count',   textContent: '' },
    'bottom-version':     { id: 'bottom-version',     textContent: '' }
  };
}

// Mock document — getElementById returns mockEl by id, or undefined.
// When throwOnGetElementById is true, throws on access.
var mockDocument = {
  getElementById: function (id) {
    if (throwOnGetElementById) throw new Error('mock DOM failure');
    return mockEls[id];
  }
};

// ============================================================
// Mirrors — computeCompositeScore() + countRedDims() (HEALTHY)
// (close to source L1350-1371 + L1376-1388, but closure-scoped
//  here so we can drive them via setDimData.)
// ============================================================
function computeCompositeScore() {
  if (typeof dimData !== 'object' || !dimData) return null;
  var num = 0, den = 0;
  Object.keys(dimData).forEach(function (k) {
    var d = dimData[k];
    if (!d) return;
    var s = (typeof d.score === 'number') ? d.score : null;
    var w = (typeof d.weight === 'number') ? d.weight : null;
    if (s === null || w === null) return;
    num += s * w;
    den += w;
  });
  if (den === 0) return null;
  return num / den;
}

function countRedDims() {
  if (typeof dimData !== 'object' || !dimData) return null;
  var n = 0;
  Object.keys(dimData).forEach(function (k) {
    if (dimData[k] && dimData[k].status === 'RED') n++;
  });
  return n;
}

// ============================================================
// Mirror — renderBottomBar() (HEALTHY, faithful to L1394-1431)
// ============================================================
var MONTH_PT = {
  '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr',
  '05': 'mai', '06': 'jun', '07': 'jul', '08': 'ago',
  '09': 'set', '10': 'out', '11': 'nov', '12': 'dez'
};

function healthyRenderBottomBar() {
  try {
    var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
    var btEl = mockDocument.getElementById('bottom-backtesting');
    if (btEl) {
      btEl.textContent = bt
        ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
        : 'crises testadas —';
    }
    var compEl = mockDocument.getElementById('bottom-composite');
    if (compEl) {
      var c = computeCompositeScore();
      compEl.textContent = (c === null)
        ? 'Painel geral —/100'
        : ('Painel geral ' + Math.round(c) + ' em 100');
    }
    var redEl = mockDocument.getElementById('bottom-red-count');
    if (redEl) {
      var r = countRedDims();
      redEl.textContent = (r === null)
        ? '— alertas vermelhos ativos'
        : (r + ' alerta(s) vermelho(s) ativo(s)');
    }
    var verEl = mockDocument.getElementById('bottom-version');
    if (verEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m ? (MONTH_PT[m[2]] || m[2]) + '/' + m[1] : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) {
    // swallow (matches source console.warn)
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderBottomBar();

    try {
      var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
      var btEl = mockDocument.getElementById('bottom-backtesting');
      if (btEl) {
        if (opts.dropInv1b) {
          // Force fallback even when bt present.
          btEl.textContent = 'crises testadas —';
        } else {
          btEl.textContent = bt
            ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
            : 'crises testadas —';
        }
      }
      var compEl = mockDocument.getElementById('bottom-composite');
      if (compEl) {
        var c = computeCompositeScore();
        if (opts.dropInv1c) {
          compEl.textContent = 'Painel geral —/100';
        } else {
          compEl.textContent = (c === null)
            ? 'Painel geral —/100'
            : ('Painel geral ' + Math.round(c) + ' em 100');
        }
      }
      var redEl = mockDocument.getElementById('bottom-red-count');
      if (redEl) {
        var r = countRedDims();
        redEl.textContent = (r === null)
          ? '— alertas vermelhos ativos'
          : (r + ' alerta(s) vermelho(s) ativo(s)');
      }
      var verEl = mockDocument.getElementById('bottom-version');
      if (verEl) {
        var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
        var m = bd.match(/^(\d{4})-(\d{2})-/);
        var monthLabel = m ? (MONTH_PT[m[2]] || m[2]) + '/' + m[1] : '';
        if (opts.dropInv1d) {
          verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version;
        } else {
          verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
            (monthLabel ? ' · ' + monthLabel : '');
        }
      }
    } catch (e) {
      if (opts.dropInv1a) throw e;  // T1: try/catch net drop → rethrow
      // else swallow
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'try/catch net (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'backtesting format (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'composite format (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'version month parse (1d)' }
];

// ============================================================
// Fixtures — sourced from e79-fixtures.js
// ============================================================
var fx = require('./e79-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setJSONEnvelope: setJSONEnvelope, getJSONEnvelope: getJSONEnvelope,
  setDimData: setDimData, getDimData: getDimData,
  setThrowOnGetElementById: setThrowOnGetElementById,
  getMockEl: getMockEl
});

var healthyWrappedRender = function () {
  return healthyRenderBottomBar();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E79 — renderBottomBar() chrome hook invariant ===');
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
  var issues = fix.fn(healthyWrappedRender);
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
