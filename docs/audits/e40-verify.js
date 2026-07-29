// e40_verify.js — renderCanvasLabels() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L1314-1343 (renderCanvasLabels — E6 chrome).
//
// renderCanvasLabels() has 2 sub-render contracts (each guarded by try/catch):
//   (1) layer-label — "<CapLayer> · <viewLabel(currentView)>" / fallback "— · <viewLabel>"
//   (2) graph-title — "D3 <meta_version> · <LAYER_IDS.length> layers · <VIEW_IDS.length> views · BYD Camaçari · <monthLabel>/<year>"
//                       with Portuguese month translation map
//
// Per-function grouping: each mutant targets ONE contract; each fixture
// probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// 7 mutants × 7 fixtures (per-function) + 7 controls = 14 reports.

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

var LAYER_IDS = ['learning', 'action', 'decision', 'signal', 'data'];
var VIEW_IDS = ['dataview', 'graphview', 'listview', 'matrixview', 'plainview', 'metaview'];

var healthyEnvelope = {
  schema_version: 2,
  meta_version: 'v2.0.1',
  build_date: '2026-07-27',
  git_commit: 'a540340'
};

var currentLayer = 'learning';
var currentView = 'dataview';

function viewLabel(v) {
  return v; // trivial pass-through for the mock
}

function resetEnv() {
  mockDocument.reset();
  currentLayer = 'learning';
  currentView = 'dataview';
  JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));
}

// ============================================================
// Mirror — renderCanvasLabels() L1314-1343 (HEALTHY)
// ============================================================
function healthyRenderCanvasLabels() {
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) {
    console.warn('[D3 E6] renderCanvasLabels failed:', e);
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_renderCanvasLabels() {
  // T1: drop the entire layer-label sub-render.
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT2_renderCanvasLabels() {
  // T2: drop the currentLayer fallback (when undefined, charAt throws).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      // Fallback DROPPED — charAt would throw on undefined
      var layerCap = currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1);
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT3_renderCanvasLabels() {
  // T3: drop the currentLayer capitalization (use lowercase).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT4_renderCanvasLabels() {
  // T4: drop the entire graph-title sub-render.
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT5_renderCanvasLabels() {
  // T5: drop the LAYER_IDS.length + ' layers' suffix in graph-title.
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT6_renderCanvasLabels() {
  // T6: drop the 'BYD Camaçari' suffix in graph-title.
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      var bd = (JSON_ENVELOPE && JSON_ENVELOPE.build_date) || '';
      var m = bd.match(/^(\d{4})-(\d{2})-/);
      var monthLabel = m
        ? ({'01':'jan','02':'fev','03':'mar','04':'abr','05':'mai','06':'jun',
            '07':'jul','08':'ago','09':'set','10':'out','11':'nov','12':'dez'}[m[2]] || m[2]) + '/' + m[1]
        : '';
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        (monthLabel ? ' · ' + monthLabel : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

function brokenT7_renderCanvasLabels() {
  // T7: drop the month-label translation in graph-title (use raw YYYY-MM-DD).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLabels();
  try {
    var layerEl = mockDocument.getElementById('layer-label');
    if (layerEl) {
      var layerCap = (typeof currentLayer === 'string' && currentLayer)
        ? currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)
        : '—';
      layerEl.textContent = layerCap + ' · ' + viewLabel(currentView);
    }
    var titleEl = mockDocument.getElementById('graph-title');
    if (titleEl) {
      // Translation DROPPED — use raw build_date
      titleEl.textContent =
        'D3 ' + JSON_ENVELOPE.meta_version +
        ' · ' + LAYER_IDS.length + ' layers' +
        ' · ' + VIEW_IDS.length  + ' views' +
        ' · BYD Camaçari' +
        (JSON_ENVELOPE.build_date ? ' · ' + JSON_ENVELOPE.build_date : '');
    }
  } catch (e) { console.warn('[D3 E6] renderCanvasLabels failed:', e); }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_layerLabelPresent(renderFn) {
  // F1: with currentLayer='learning', layer-label shows "Learning · dataview".
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['layer-label'];
  var expected = 'Learning · dataview';
  if (!el) {
    issues.push('F1 layer-label-present violated — #layer-label element never created');
  } else if (el.textContent !== expected) {
    issues.push('F1 layer-label-present violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF2_layerLabelFallback(renderFn) {
  // F2: with currentLayer undefined, layer-label shows fallback "— · dataview".
  resetEnv();
  currentLayer = undefined;
  renderFn();
  var issues = [];
  var el = mockDocument._els['layer-label'];
  var expected = '— · dataview';
  if (!el) {
    issues.push('F2 layer-label-fallback violated — #layer-label element never created');
  } else if (el.textContent !== expected) {
    issues.push('F2 layer-label-fallback violated — expected "' + expected + '", got "' + el.textContent + '"');
  }
  return issues;
}

function runF3_layerLabelCapitalized(renderFn) {
  // F3: with currentLayer='learning', layer-label first letter is uppercase.
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['layer-label'];
  if (!el) {
    issues.push('F3 layer-label-capitalized violated — #layer-label element never created');
  } else {
    var text = el.textContent || '';
    var firstChar = text.charAt(0);
    if (firstChar !== firstChar.toUpperCase() || !/[A-Z]/.test(firstChar)) {
      issues.push('F3 layer-label-capitalized violated — expected first char to be uppercase, got "' + text + '"');
    }
  }
  return issues;
}

function runF4_titlePrefix(renderFn) {
  // F4: graph-title starts with "D3 v2.0.1".
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-title'];
  if (!el) {
    issues.push('F4 title-prefix violated — #graph-title element never created');
  } else if (el.textContent.indexOf('D3 v2.0.1') !== 0) {
    issues.push('F4 title-prefix violated — expected text starting with "D3 v2.0.1", got "' + el.textContent + '"');
  }
  return issues;
}

function runF5_titleLayersCount(renderFn) {
  // F5: graph-title contains "5 layers" (LAYER_IDS.length).
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-title'];
  if (!el) {
    issues.push('F5 title-layers-count violated — #graph-title element never created');
  } else if (el.textContent.indexOf('5 layers') === -1) {
    issues.push('F5 title-layers-count violated — expected text to contain "5 layers", got "' + el.textContent + '"');
  }
  return issues;
}

function runF6_titlePlantSuffix(renderFn) {
  // F6: graph-title contains "BYD Camaçari".
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-title'];
  if (!el) {
    issues.push('F6 title-plant-suffix violated — #graph-title element never created');
  } else if (el.textContent.indexOf('BYD Camaçari') === -1) {
    issues.push('F6 title-plant-suffix violated — expected text to contain "BYD Camaçari", got "' + el.textContent + '"');
  }
  return issues;
}

function runF7_titleMonthLabel(renderFn) {
  // F7: graph-title contains month translation "jul/2026" (from build_date "2026-07-27").
  resetEnv();
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-title'];
  if (!el) {
    issues.push('F7 title-month-label violated — #graph-title element never created');
  } else if (el.textContent.indexOf('jul/2026') === -1) {
    issues.push('F7 title-month-label violated — expected text to contain "jul/2026", got "' + el.textContent + '"');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_renderCanvasLabels, target: 'F1', drop: 'layer-label sub-render' },
  { id: 'T2', fn: brokenT2_renderCanvasLabels, target: 'F2', drop: 'currentLayer fallback' },
  { id: 'T3', fn: brokenT3_renderCanvasLabels, target: 'F3', drop: 'currentLayer capitalization' },
  { id: 'T4', fn: brokenT4_renderCanvasLabels, target: 'F4', drop: 'graph-title sub-render' },
  { id: 'T5', fn: brokenT5_renderCanvasLabels, target: 'F5', drop: 'layers-count suffix' },
  { id: 'T6', fn: brokenT6_renderCanvasLabels, target: 'F6', drop: 'BYD Camaçari suffix' },
  { id: 'T7', fn: brokenT7_renderCanvasLabels, target: 'F7', drop: 'month-label translation' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_layerLabelPresent,     target_id: 'T1' },
  { id: 'F2', fn: runF2_layerLabelFallback,    target_id: 'T2' },
  { id: 'F3', fn: runF3_layerLabelCapitalized,   target_id: 'T3' },
  { id: 'F4', fn: runF4_titlePrefix,             target_id: 'T4' },
  { id: 'F5', fn: runF5_titleLayersCount,         target_id: 'T5' },
  { id: 'F6', fn: runF6_titlePlantSuffix,         target_id: 'T6' },
  { id: 'F7', fn: runF7_titleMonthLabel,          target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var JSON_ENVELOPE = JSON.parse(JSON.stringify(healthyEnvelope));

var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E40 — renderCanvasLabels() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderCanvasLabels, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var args = [healthyRenderCanvasLabels];
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderCanvasLabels) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);