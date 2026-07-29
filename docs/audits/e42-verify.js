// e42_verify.js — renderCanvasLegend() chrome hook invariant
// Mirrors D3-PITCH-GRAPH.html L1460-1476 (renderCanvasLegend — E12 chrome).
//
// renderCanvasLegend() has 1 sub-render contract guarded by try/catch:
//   (1) graph-legend — 4 inline-styled chips (Verde/Amarelo/Vermelho/Coupling)
//       built from STATUS_THRESHOLDS[STATUS_THRESHOLDS.active].{green,amber}
//
// Per-function grouping: each mutant targets ONE contract surface; each fixture
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
    if (!this._els[id]) this._els[id] = { innerHTML: '' };
    return this._els[id];
  },
  reset: function () { this._els = {}; }
};

var STATUS_THRESHOLDS = {
  active: 'authoritative',
  authoritative: { green: 80, amber: 65 },
  legacy: { green: 70, amber: 50 }
};

function resetEnv(mode) {
  mockDocument.reset();
  STATUS_THRESHOLDS.active = mode || 'authoritative';
}

// ============================================================
// Mirror — renderCanvasLegend() L1460-1476 (HEALTHY)
// ============================================================
function healthyRenderCanvasLegend() {
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) {
    console.warn('[D3 E12] renderCanvasLegend failed:', e);
  }
}

// ============================================================
// Broken mutants — each drops ONE contract surface
// ============================================================
function brokenT1_renderCanvasLegend() {
  // T1: drop the entire graph-legend sub-render (root.innerHTML never set).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  // No-op
}

function brokenT2_renderCanvasLegend() {
  // T2: drop the green chip (Verde: ≥ g).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

function brokenT3_renderCanvasLegend() {
  // T3: drop the amber chip (Amarelo: a–g-1).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

function brokenT4_renderCanvasLegend() {
  // T4: drop the red chip (Vermelho: < a).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

function brokenT5_renderCanvasLegend() {
  // T5: drop the coupling chip.
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

function brokenT6_renderCanvasLegend() {
  // T6: hardcode green/amber (drop STATUS_THRESHOLDS.active lookup).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    var root = mockDocument.getElementById('graph-legend');
    if (!root) return;
    // Bypass active lookup — always use authoritative values
    var g = 80;
    var a = 65;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

function brokenT7_renderCanvasLegend() {
  // T7: drop the !root return guard (would throw if root missing).
  if (MIRROR_REPAIRED) return healthyRenderCanvasLegend();
  try {
    // Skip getElementById — root is undefined; the .innerHTML assignment throws
    var t = STATUS_THRESHOLDS[STATUS_THRESHOLDS.active];
    var g = t.green;
    var a = t.amber;
    var root = undefined;
    var html =
      '<div class="g"><div class="dot" style="background:var(--good)"></div>Verde: ≥ ' + g + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--warn)"></div>Amarelo: ' + a + '–' + (g - 1) + '</div>' +
      '<div class="g"><div class="dot" style="background:var(--bad)"></div>Vermelho: &lt; ' + a + '</div>' +
      '<div class="g" style="margin-top:4px;padding-top:4px;border-top:1px solid var(--line)"><div class="dot" style="background:var(--accent)"></div>Coupling</div>';
    root.innerHTML = html;
  } catch (e) { console.warn('[D3 E12] renderCanvasLegend failed:', e); }
}

// ============================================================
// Fixtures (per-function probes)
// ============================================================
function runF1_legendPopulated(renderFn) {
  // F1: graph-legend element populated (innerHTML not empty).
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F1 legend-populated violated — #graph-legend element never created');
  } else if (!el.innerHTML || el.innerHTML.length === 0) {
    issues.push('F1 legend-populated violated — #graph-legend innerHTML is empty');
  }
  return issues;
}

function runF2_legendGreenChip(renderFn) {
  // F2: innerHTML contains green chip "Verde: ≥ 80" (authoritative mode).
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F2 legend-green-chip violated — #graph-legend element never created');
  } else if (el.innerHTML.indexOf('Verde: ≥ 80') === -1) {
    issues.push('F2 legend-green-chip violated — expected innerHTML to contain "Verde: ≥ 80", got "' + el.innerHTML + '"');
  }
  return issues;
}

function runF3_legendAmberChip(renderFn) {
  // F3: innerHTML contains amber chip "Amarelo: 65–79" (authoritative mode).
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F3 legend-amber-chip violated — #graph-legend element never created');
  } else if (el.innerHTML.indexOf('Amarelo: 65–79') === -1) {
    issues.push('F3 legend-amber-chip violated — expected innerHTML to contain "Amarelo: 65–79", got "' + el.innerHTML + '"');
  }
  return issues;
}

function runF4_legendRedChip(renderFn) {
  // F4: innerHTML contains red chip "Vermelho: &lt; 65" (authoritative mode).
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F4 legend-red-chip violated — #graph-legend element never created');
  } else if (el.innerHTML.indexOf('Vermelho: &lt; 65') === -1) {
    issues.push('F4 legend-red-chip violated — expected innerHTML to contain "Vermelho: &lt; 65", got "' + el.innerHTML + '"');
  }
  return issues;
}

function runF5_legendCouplingChip(renderFn) {
  // F5: innerHTML contains coupling chip "Coupling".
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F5 legend-coupling-chip violated — #graph-legend element never created');
  } else if (el.innerHTML.indexOf('Coupling') === -1) {
    issues.push('F5 legend-coupling-chip violated — expected innerHTML to contain "Coupling", got "' + el.innerHTML + '"');
  }
  return issues;
}

function runF6_legendLegacyMode(renderFn) {
  // F6: with STATUS_THRESHOLDS.active = 'legacy', innerHTML reflects legacy values (green=70, amber=50).
  resetEnv('legacy');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F6 legend-legacy-mode violated — #graph-legend element never created');
  } else {
    var html = el.innerHTML;
    if (html.indexOf('Verde: ≥ 70') === -1) {
      issues.push('F6 legend-legacy-mode violated — expected innerHTML to contain "Verde: ≥ 70" (legacy mode), got "' + html + '"');
    }
    if (html.indexOf('Amarelo: 50–69') === -1) {
      issues.push('F6 legend-legacy-mode violated — expected innerHTML to contain "Amarelo: 50–69" (legacy mode), got "' + html + '"');
    }
    if (html.indexOf('Vermelho: &lt; 50') === -1) {
      issues.push('F6 legend-legacy-mode violated — expected innerHTML to contain "Vermelho: &lt; 50" (legacy mode), got "' + html + '"');
    }
  }
  return issues;
}

function runF7_legendAuthoritativeMode(renderFn) {
  // F7: with STATUS_THRESHOLDS.active = 'authoritative', innerHTML reflects authoritative values (green=80, amber=65).
  resetEnv('authoritative');
  renderFn();
  var issues = [];
  var el = mockDocument._els['graph-legend'];
  if (!el) {
    issues.push('F7 legend-authoritative-mode violated — #graph-legend element never created');
  } else {
    var html = el.innerHTML;
    if (html.indexOf('Verde: ≥ 80') === -1) {
      issues.push('F7 legend-authoritative-mode violated — expected innerHTML to contain "Verde: ≥ 80" (authoritative mode), got "' + html + '"');
    }
    if (html.indexOf('Amarelo: 65–79') === -1) {
      issues.push('F7 legend-authoritative-mode violated — expected innerHTML to contain "Amarelo: 65–79" (authoritative mode), got "' + html + '"');
    }
    if (html.indexOf('Vermelho: &lt; 65') === -1) {
      issues.push('F7 legend-authoritative-mode violated — expected innerHTML to contain "Vermelho: &lt; 65" (authoritative mode), got "' + html + '"');
    }
  }
  return issues;
}

// ============================================================
// Test matrix — per-function pairing
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenT1_renderCanvasLegend, target: 'F1', drop: 'graph-legend sub-render' },
  { id: 'T2', fn: brokenT2_renderCanvasLegend, target: 'F2', drop: 'green chip (Verde: ≥ g)' },
  { id: 'T3', fn: brokenT3_renderCanvasLegend, target: 'F3', drop: 'amber chip (Amarelo: a–g-1)' },
  { id: 'T4', fn: brokenT4_renderCanvasLegend, target: 'F4', drop: 'red chip (Vermelho: < a)' },
  { id: 'T5', fn: brokenT5_renderCanvasLegend, target: 'F5', drop: 'coupling chip' },
  { id: 'T6', fn: brokenT6_renderCanvasLegend, target: 'F6', drop: 'STATUS_THRESHOLDS.active lookup (hardcoded)' },
  { id: 'T7', fn: brokenT7_renderCanvasLegend, target: 'F7', drop: '!root return guard' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_legendPopulated,         target_id: 'T1' },
  { id: 'F2', fn: runF2_legendGreenChip,         target_id: 'T2' },
  { id: 'F3', fn: runF3_legendAmberChip,         target_id: 'T3' },
  { id: 'F4', fn: runF4_legendRedChip,           target_id: 'T4' },
  { id: 'F5', fn: runF5_legendCouplingChip,      target_id: 'T5' },
  { id: 'F6', fn: runF6_legendLegacyMode,        target_id: 'T6' },
  { id: 'F7', fn: runF7_legendAuthoritativeMode, target_id: 'T7' }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E42 — renderCanvasLegend() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  resetEnv('authoritative');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderCanvasLegend, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv('authoritative');
  var args = [healthyRenderCanvasLegend];
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderCanvasLegend) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);