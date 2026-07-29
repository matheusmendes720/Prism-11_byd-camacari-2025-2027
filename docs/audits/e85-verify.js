// e85-verify.js — renderGlossary() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L1755-1811 (renderGlossary — assembles
// 4 blocks of HTML into a string and writes to #glossary-root.innerHTML).
//
// Invariants (4 sub-checks):
//   1a. try/catch net: wraps the whole body (single try/catch — no
//       outer escape hatch like renderCanvasLegend).
//   1b. root null guard: skip when no element in DOM.
//   1c. innerHTML write: write the assembled html string.
//   1d. Block 3 (types) loop: render the types block via forEach.
//
// Inverted mutant pattern: each fixture pre-seeds mockDocument
// (getElementById for 'glossary-root'), a mockRoot with settable
// innerHTML, glossaryTexts / PALETTE_TOKENS / STATUS_THRESHOLDS /
// getCounts, an escapeHtml function, and a warn counter. Healthy
// version: catch safely → early return on null → assemble 4 blocks →
// write innerHTML. Broken mutant drops a sub-check → distinct
// observable state.
//
// Detection channels:
//   F1 (dropInv1a — try/catch net) — caller-level try/catch on renderFn
//        sees throw propagation from getElementById.
//   F2 (dropInv1b — root null guard) — warn count. root=null → healthy
//        returns early (warn=0), T2 reads null.innerHTML (warn=1).
//   F3 (dropInv1c — innerHTML write) — innerHTML side effect.
//        T3 leaves innerHTML=''.
//   F4 (dropInv1d — Block 3 types) — innerHTML lacks 'Tipos de nó no
//        grafo' marker.
//
// Note: because the entire body is INSIDE the single try/catch (no
// renderCanvasLegend-style escape hatch like e82), dropInv1b
// detection requires the wrapper to also call mockConsoleWarn —
// otherwise throws get swallowed silently with no observable side
// effect. The body wrapper below mirrors healthy's console.warn by
// incrementing warnCount.
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports. Plus F0 has
// 3 sub-cases (treated as one report) = 9 reports total.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — glossaryTexts, PALETTE_TOKENS, STATUS_THRESHOLDS,
// getCounts, escapeHtml, mockGetElementById, mockRoot, warnCount.
// ============================================================

// Minimal escapeHtml (matches E84 healthy).
function healthyEscapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

var glossaryTexts = {
  layers: [
    { layer: 'framework', label: 'Framework', role: 'O QUE mostrar',
      summary: function (c) { return 'painel geral'; } }
  ],
  statuses: [
    { label: 'GREEN', css: '--green',
      ranges: [
        { source: 'legacy',        label: '≥70' },
        { source: 'authoritative', label: '≥80' }
      ]
    }
  ],
  types: [
    { label: 'Decision', shape: 'square', css: '--blue', count: 11 }
  ]
};

var PALETTE_TOKENS = {
  layers: { framework: '--blue' }
};

var STATUS_THRESHOLDS = {
  legacy: { green: 70, amber: 50 },
  authoritative: { green: 80, amber: 65 },
  active: 'legacy'
};

function getCounts() {
  return { dimensions: 11, couplings: 5, frameworkGates: 7 };
}

var mockGetElementById;
var _mockRoot = null;
function createMockRoot() {
  _mockRoot = {
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(v) { this._innerHTML = v; }
  };
  return _mockRoot;
}
function getMockRoot() { return _mockRoot; }
function setGetElementById(fn) { mockGetElementById = fn; }
function getGetElementById() { return mockGetElementById; }
function setStatusThresholdsActive(v) { STATUS_THRESHOLDS.active = v; }

var warnCount = 0;
function getWarnCount() { return warnCount; }
function setWarnCount(v) { warnCount = v; }
function mockConsoleWarn(msg, err) { warnCount++; }

function resetEnv() {
  glossaryTexts = {
    layers: [
      { layer: 'framework', label: 'Framework', role: 'O QUE mostrar',
        summary: function (c) { return 'painel geral'; } }
    ],
    statuses: [
      { label: 'GREEN', css: '--green',
        ranges: [
          { source: 'legacy',        label: '≥70' },
          { source: 'authoritative', label: '≥80' }
        ]
      }
    ],
    types: [
      { label: 'Decision', shape: 'square', css: '--blue', count: 11 }
    ]
  };
  PALETTE_TOKENS = { layers: { framework: '--blue' } };
  STATUS_THRESHOLDS = {
    legacy: { green: 70, amber: 50 },
    authoritative: { green: 80, amber: 65 },
    active: 'legacy'
  };
  mockGetElementById = function (id) {
    if (id === 'glossary-root') return createMockRoot();
    return null;
  };
  _mockRoot = null;
  warnCount = 0;
}

// ============================================================
// Mirror — renderGlossary() (HEALTHY, faithful to L1755-1811)
// ============================================================
function healthyRenderGlossary() {
  try {
    var root = document.getElementById('glossary-root');
    if (!root) return;
    var counts = getCounts();

    // Block 1 · layers prose
    var html = '<div class="section">';
    html += '<div class="section-title">O que cada camada faz</div>';
    html += '<div style="font-size:10.5px;color:var(--ink-3);line-height:1.65;padding:0 14px">';
    glossaryTexts.layers.forEach(function (entry) {
      var token = PALETTE_TOKENS.layers[entry.layer] || '--neutral';
      var text = entry.summary(counts);
      html += '<div style="margin-bottom:6px"><strong style="color:var(' + token + ')">' + healthyEscapeHtml(entry.label) + '</strong> ';
      html += '<span style="color:var(--ink-4)">— ' + healthyEscapeHtml(entry.role) + ':</span> ';
      html += '<span style="color:var(--ink-2)">' + healthyEscapeHtml(text) + '</span></div>';
    });
    html += '</div></div>';

    // Block 2 · status legend
    html += '<div class="sidebar-legend">';
    html += '<div class="legend-title">Cores do farol (status)</div>';
    glossaryTexts.statuses.forEach(function (s) {
      var active = s.ranges.find(function (r) { return r.source === STATUS_THRESHOLDS.active; }) || s.ranges[0];
      var alt = s.ranges.find(function (r) { return r.source !== STATUS_THRESHOLDS.active; });
      html += '<div class="legend-row"><div class="swatch circle" style="background:var(' + s.css + ')"></div>';
      html += healthyEscapeHtml(s.label) + ' · ' + healthyEscapeHtml(active.label);
      if (alt) html += ' <span style="opacity:0.55;font-size:9.5px">(' + healthyEscapeHtml(alt.label) + ' autoritativo)</span>';
      html += '</div>';
    });

    // Block 2.5 · threshold toggle
    var activeThreshold = (typeof STATUS_THRESHOLDS !== 'undefined' && STATUS_THRESHOLDS && STATUS_THRESHOLDS.active) || 'legacy';
    html += '<div class="threshold-toggle" data-role="threshold-toggle">';
    html += '<div class="threshold-toggle-label">Qual faixa usar?</div>';
    html += '<div class="threshold-toggle-buttons">';
    html += '<button type="button" class="threshold-btn' + (activeThreshold === 'legacy' ? ' active' : '') + '" data-threshold="legacy">Mais sensível (50/70)</button>';
    html += '<button type="button" class="threshold-btn' + (activeThreshold === 'authoritative' ? ' active' : '') + '" data-threshold="authoritative">Mais conservadora (65/80)</button>';
    html += '</div></div>';

    // Block 3 · types
    html += '<div class="legend-title" style="margin-top:10px">Tipos de nó no grafo (' + glossaryTexts.types.length + ')</div>';
    glossaryTexts.types.forEach(function (t) {
      var shapeClass = t.shape === 'square' ? '' : 'circle';
      var radius = t.shape === 'square' ? 'border-radius:0' : '';
      html += '<div class="legend-row"><div class="swatch ' + shapeClass + '" style="background:var(' + t.css + ');' + radius + '"></div>';
      html += healthyEscapeHtml(t.label) + ' (' + t.count + ')</div>';
    });
    html += '</div>';

    root.innerHTML = html;
  } catch (e) {
    mockConsoleWarn('[D3 E2] renderGlossary failed:', e);
  }
}

// ============================================================
// Broken mutants — 4 boolean flags.
// dropInv1a: no outer try/catch net (throws propagate).
// dropInv1b: no root null guard.
// dropInv1c: no innerHTML write.
// dropInv1d: no Block 3 types forEach.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyRenderGlossary();

    function body() {
      var root = document.getElementById('glossary-root');
      if (!opts.dropInv1b) {
        if (!root) return;
      }
      var counts = getCounts();

      // Block 1
      var html = '<div class="section">';
      html += '<div class="section-title">O que cada camada faz</div>';
      html += '<div>';
      glossaryTexts.layers.forEach(function (entry) {
        var token = PALETTE_TOKENS.layers[entry.layer] || '--neutral';
        var text = entry.summary(counts);
        html += '<div><strong>' + healthyEscapeHtml(entry.label) + '</strong> ';
        html += '<span>— ' + healthyEscapeHtml(entry.role) + ':</span> ';
        html += '<span>' + healthyEscapeHtml(text) + '</span></div>';
      });
      html += '</div></div>';

      // Block 2
      html += '<div class="sidebar-legend">';
      html += '<div class="legend-title">Cores do farol (status)</div>';
      glossaryTexts.statuses.forEach(function (s) {
        var active = s.ranges.find(function (r) { return r.source === STATUS_THRESHOLDS.active; }) || s.ranges[0];
        var alt = s.ranges.find(function (r) { return r.source !== STATUS_THRESHOLDS.active; });
        html += '<div class="legend-row"><div class="swatch"></div>';
        html += healthyEscapeHtml(s.label) + ' · ' + healthyEscapeHtml(active.label);
        if (alt) html += ' (' + healthyEscapeHtml(alt.label) + ')';
        html += '</div>';
      });

      // Block 2.5
      var activeThreshold = (typeof STATUS_THRESHOLDS !== 'undefined' && STATUS_THRESHOLDS && STATUS_THRESHOLDS.active) || 'legacy';
      html += '<div data-role="threshold-toggle">';
      html += '<div>Qual faixa usar?</div>';
      html += '<div>';
      html += '<button class="threshold-btn' + (activeThreshold === 'legacy' ? ' active' : '') + '" data-threshold="legacy">L</button>';
      html += '<button class="threshold-btn' + (activeThreshold === 'authoritative' ? ' active' : '') + '" data-threshold="authoritative">A</button>';
      html += '</div></div>';

      // Block 3
      if (!opts.dropInv1d) {
        html += '<div class="legend-title">Tipos de nó no grafo (' + glossaryTexts.types.length + ')</div>';
        glossaryTexts.types.forEach(function (t) {
          html += '<div class="legend-row">' + healthyEscapeHtml(t.label) + ' (' + t.count + ')</div>';
        });
      }
      html += '</div>';

      if (!opts.dropInv1c) {
        root.innerHTML = html;
      }
    }

    if (opts.dropInv1a) {
      body();  // No outer try/catch net — throws propagate.
    } else {
      try { body(); } catch (e) { mockConsoleWarn('[D3 E2] simulated', e); }
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'try/catch net (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'root null guard (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'innerHTML write (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'Block 3 types (1d)' }
];

// ============================================================
// Fixtures — sourced from e85-fixtures.js
// ============================================================
var fx = require('./e85-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setGetElementById: setGetElementById,
  createMockRoot: createMockRoot,
  getMockRoot: getMockRoot,
  getWarnCount: getWarnCount,
  setWarnCount: setWarnCount,
  setStatusThresholdsActive: setStatusThresholdsActive
});

// ============================================================
// Mock document.getElementById routing.
// ============================================================
function documentShim(id) {
  if (typeof mockGetElementById === 'function') return mockGetElementById(id);
  return null;
}
global.document = { getElementById: documentShim };

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E85 — renderGlossary() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-renderGlossary, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyRenderGlossary);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy renderGlossary) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
