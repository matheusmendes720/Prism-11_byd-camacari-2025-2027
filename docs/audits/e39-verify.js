// e39_verify.js — renderBottomBar() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L1394-1431 (renderBottomBar — E7 chrome).
//
// renderBottomBar() has 4 sub-render contracts (each guarded by try/catch):
//   (1) bottom-backtesting — "X de Y crises testadas e acertadas" / fallback "crises testadas —"
//   (2) bottom-composite   — "Painel geral N em 100" / fallback "Painel geral —/100"
//   (3) bottom-red-count   — "N alerta(s) vermelho(s) ativo(s)" / fallback "— alertas vermelhos ativos"
//   (4) bottom-version     — "D3 <meta_version> · <monthLabel>/<year>" with month translation
//
// Per-function grouping: each mutant targets ONE contract; each fixture
// probes ONE sub-render invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 1 control × 7 fixtures (control
// runs against all healthy probes) = 7 + 7 = 14 reports.
//
// Inverted mutant-detection: probes push issues when broken code LEAVES
// state unchanged (correct behavior omitted).

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================
var mockDocument = {
  _els: {},
  getElementById: function (id) {
    if (!this._els[id]) this._els[id] = { textContent: '' };
    return this._els[id];
  },
  reset: function () { this._els = {}; }
};

// JSON envelope fixtures
var healthyEnvelope = {
  schema_version: 2,
  meta_version: 'v2.0.1',
  build_date: '2026-07-21',
  backtesting: { perfect: 5, total: 5 }
};

// Score/Red counters
var mockCompositeScore = 75;
var mockRedCount = 2;
function computeCompositeScore() { return mockCompositeScore; }
function countRedDims() { return mockRedCount; }

// Mock console
var _origConsole = { warn: console.warn };
function mockConsole() {
  var logs = [];
  console.warn = function () { logs.push(Array.from(arguments)); };
  return { logs: logs, restore: function () { console.warn = _origConsole.warn; } };
}

// ============================================================
// Reset state
// ============================================================
function resetEnv() {
  mockDocument.reset();
  mockCompositeScore = 75;
  mockRedCount = 2;
  // Reset envelope to healthy
  JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));
}

// ============================================================
// Mirror — renderBottomBar() L1394-1431 (HEALTHY)
// ============================================================
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
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) {
    console.warn('[D3 E7] renderBottomBar failed:', e);
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_renderBottomBar() {
  // T1: drop the entire bottom-backtesting sub-render (the if-block is removed).
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
  try {
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
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT2_renderBottomBar() {
  // T2: drop the bt-fallback (when bt=null, the ternary short-circuits to false-y path
  //     that produces "undefined de undefined crises testadas e acertadas").
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
  try {
    var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
    var btEl = mockDocument.getElementById('bottom-backtesting');
    if (btEl) {
      // Fallback DROPPED — always interpolate bt.perfect/total (may be undefined)
      btEl.textContent = bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas';
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
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT3_renderBottomBar() {
  // T3: drop the entire bottom-composite sub-render.
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
  try {
    var bt = JSON_ENVELOPE && JSON_ENVELOPE.backtesting;
    var btEl = mockDocument.getElementById('bottom-backtesting');
    if (btEl) {
      btEl.textContent = bt
        ? (bt.perfect + ' de ' + bt.total + ' crises testadas e acertadas')
        : 'crises testadas —';
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
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT4_renderBottomBar() {
  // T4: drop the computeCompositeScore fallback (when c=null, sets "null/100").
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
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
      // Fallback DROPPED — always interpolate Math.round(c)
      compEl.textContent = 'Painel geral ' + Math.round(c) + ' em 100';
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
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT5_renderBottomBar() {
  // T5: drop the countRedDims fallback (when r=null, sets "null alerta(s) ...").
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
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
      // Fallback DROPPED — always interpolate r
      redEl.textContent = r + ' alerta(s) vermelho(s) ativo(s)';
    }
    var verEl = mockDocument.getElementById('bottom-version');
    if (verEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT6_renderBottomBar() {
  // T6: drop the entire bottom-version sub-render (version not populated).
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
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
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

function brokenT7_renderBottomBar() {
  // T7: drop the month-label translation (use raw YYYY-MM-DD instead of "jan/2026").
  if (MIRROR_REPAIRED) return healthyRenderBottomBar();
  var mc = mockConsole();
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
      // Translation DROPPED — use raw YYYY-MM-DD
      verEl.textContent = 'D3 ' + JSON_ENVELOPE.meta_version +
        (JSON_ENVELOPE.build_date ? ' · ' + JSON_ENVELOPE.build_date : '');
    }
  } catch (e) { console.warn('[D3 E7] renderBottomBar failed:', e); }
  mc.restore();
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_backtestingPresent(renderFn) {
  // F1: with bt present, bottom-backtesting shows "X de Y crises testadas e acertadas".
  resetEnv();
  // healthyEnvelope already has backtesting = { perfect: 5, total: 5 }
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-backtesting'];
  var expected = '5 de 5 crises testadas e acertadas';
  if (!el) {
    issues.push('F1 backtesting-present violated — #bottom-backtesting element never created');
  } else if (el.textContent !== expected) {
    issues.push('F1 backtesting-present violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF2_backtestingFallback(renderFn) {
  // F2: with bt absent, bottom-backtesting shows fallback "crises testadas —".
  resetEnv();
  JSON_ENVELOPE.backtesting = null;
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-backtesting'];
  var expected = 'crises testadas —';
  if (!el) {
    issues.push('F2 backtesting-fallback violated — #bottom-backtesting element never created');
  } else if (el.textContent !== expected) {
    issues.push('F2 backtesting-fallback violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF3_compositePresent(renderFn) {
  // F3: with score present, bottom-composite shows "Painel geral N em 100".
  resetEnv();
  mockCompositeScore = 75;
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-composite'];
  var expected = 'Painel geral 75 em 100';
  if (!el) {
    issues.push('F3 composite-present violated — #bottom-composite element never created');
  } else if (el.textContent !== expected) {
    issues.push('F3 composite-present violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF4_compositeFallback(renderFn) {
  // F4: with score null, bottom-composite shows "Painel geral —/100".
  resetEnv();
  mockCompositeScore = null;
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-composite'];
  var expected = 'Painel geral —/100';
  if (!el) {
    issues.push('F4 composite-fallback violated — #bottom-composite element never created');
  } else if (el.textContent !== expected) {
    issues.push('F4 composite-fallback violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF5_redFallback(renderFn) {
  // F5: with red null, bottom-red-count shows "— alertas vermelhos ativos".
  resetEnv();
  mockRedCount = null;
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-red-count'];
  var expected = '— alertas vermelhos ativos';
  if (!el) {
    issues.push('F5 red-fallback violated — #bottom-red-count element never created');
  } else if (el.textContent !== expected) {
    issues.push('F5 red-fallback violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF6_versionMonthLabel(renderFn) {
  // F6: with build_date "2026-07-21", bottom-version translates to "· jul/2026".
  resetEnv();
  // healthyEnvelope has build_date '2026-07-21'
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-version'];
  var expected = 'D3 v2.0.1 · jul/2026';
  if (!el) {
    issues.push('F6 version-month-label violated — #bottom-version element never created');
  } else if (el.textContent !== expected) {
    issues.push('F6 version-month-label violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF7_versionPresent(renderFn) {
  // F7: with build_date "2026-07-21", bottom-version starts with "D3 v2.0.1" (presence check).
  resetEnv();
  // healthyEnvelope has meta_version 'v2.0.1' and build_date '2026-07-21'
  renderFn();
  var issues = [];
  var el = mockDocument._els['bottom-version'];
  if (!el) {
    issues.push('F7 version-present violated — #bottom-version element never created');
  } else if (el.textContent.indexOf('D3 v2.0.1') !== 0) {
    issues.push('F7 version-present violated — expected text starting with "D3 v2.0.1", got "' + el.textContent + '"');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// Each mutant targets ONE contract; each fixture probes ONE invariant.
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_renderBottomBar, kind: 'broken', target: 'F1', drop: 'backtesting sub-render' },
  { id: 'T2', fn: brokenT2_renderBottomBar, kind: 'broken', target: 'F2', drop: 'backtesting fallback' },
  { id: 'T3', fn: brokenT3_renderBottomBar, kind: 'broken', target: 'F3', drop: 'composite sub-render' },
  { id: 'T4', fn: brokenT4_renderBottomBar, kind: 'broken', target: 'F4', drop: 'composite fallback' },
  { id: 'T5', fn: brokenT5_renderBottomBar, kind: 'broken', target: 'F5', drop: 'red fallback' },
  { id: 'T6', fn: brokenT6_renderBottomBar, kind: 'broken', target: 'F7', drop: 'version sub-render' },
  { id: 'T7', fn: brokenT7_renderBottomBar, kind: 'broken', target: 'F6', drop: 'month-label translation' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_backtestingPresent,    target_id: 'T1' },
  { id: 'F2', fn: runF2_backtestingFallback,   target_id: 'T2' },
  { id: 'F3', fn: runF3_compositePresent,      target_id: 'T3' },
  { id: 'F4', fn: runF4_compositeFallback,     target_id: 'T4' },
  { id: 'F5', fn: runF5_redFallback,            target_id: 'T5' },
  { id: 'F6', fn: runF6_versionMonthLabel,      target_id: 'T7' },
  { id: 'F7', fn: runF7_versionPresent,         target_id: 'T6' }
];

// ============================================================
// Runner
// ============================================================
// JSON_ENVELOPE is the global read by renderBottomBar; provide a default.
var JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));

var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E39 — renderBottomBar() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv();
  var mutantIssues = [];
  var fix = ALL_FIXTURES.find(function (f) { return f.id === mutant.target; });
  if (fix) {
    var args = [mutant.fn];
    var issues = fix.fn.apply(null, args);
    mutantIssues = mutantIssues.concat(issues);
  }
  totalReports++;
  var detected = mutantIssues.length > 0;
  var pass;
  if (MIRROR_REPAIRED) {
    pass = !detected;
  } else {
    pass = detected;
  }
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderBottomBar, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var args = [healthyRenderBottomBar];
  var issues = fix.fn.apply(null, args);
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