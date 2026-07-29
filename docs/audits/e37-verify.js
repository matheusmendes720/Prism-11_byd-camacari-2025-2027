// e37_verify.js — showTooltip/moveTooltip/hideTooltip cluster invariant
// Mirrors D3-PITCH-GRAPH.html L4197-4253 (tooltip cluster)
// Inverted mutant-detection pattern: probes push issues when broken code
// LEAVES state unchanged (correct); per-function grouping avoids
// cross-function contamination (e.g., hideTooltip legitimately creates
// a tooltip, so it must not run through F1's "null guard" probe).
//
// 6 fixtures (F1 null guard, F2 field-resolution, F3 HTML-composition,
//              F4 moveTooltip-positioning, F5 moveTooltip-early-exit,
//              F6 hideTooltip-visibility)
// × 7 mutants (T1 null-guard-drop, T2 showTooltip-visibility-drop,
//              T3 field-fallback-drop, T4 HTML-composition-drop,
//              T5 moveTooltip-early-exit-drop, T6 moveTooltip-offset-drop,
//              T7 control-healthy)
// = 13 test reports (6 fixture-control + 7 mutant-detection).

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock DOM
// ============================================================
function makeMockTooltipEl() {
  var el = {
    id: '',
    isConnected: true,
    _innerHTML: '',
    style: {
      display: '', left: '', top: '', cssText: '', zIndex: '',
      position: '', background: '', color: '', border: '',
      borderRadius: '', padding: '', font: '', maxWidth: '',
      boxShadow: '', pointerEvents: ''
    }
  };
  Object.defineProperty(el, 'innerHTML', {
    get: function () { return el._innerHTML; },
    set: function (v) { el._innerHTML = v; }
  });
  return el;
}

// MOCK ONLY: simulate real DOM parsing of cssText into individual style
// properties. Real CSSStyleDeclaration does this automatically when cssText
// is assigned; the mirror's mock does not.
function parseCssTextIntoStyle(el) {
  var css = el.style.cssText || '';
  css.split(';').forEach(function (decl) {
    var idx = decl.indexOf(':');
    if (idx === -1) return;
    var rawKey = decl.substring(0, idx).trim();
    var val = decl.substring(idx + 1).trim();
    if (!rawKey || !val) return;
    var camelKey = rawKey.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
    if (camelKey in el.style) el.style[camelKey] = val;
  });
}

var mockDocumentBody = {
  _appendedElements: [],
  _tooltipCount: 0,
  appendChild: function (el) {
    mockDocumentBody._appendedElements.push(el);
    if (el && el.id === 'd3-node-tooltip') {
      mockDocumentBody._tooltipCount += 1;
    }
    if (el && 'isConnected' in el) el.isConnected = true;
    return el;
  },
  reset: function () {
    mockDocumentBody._appendedElements = [];
    mockDocumentBody._tooltipCount = 0;
  }
};

var mockDocument = {
  createElement: function (tag) {
    if (tag === 'div') return makeMockTooltipEl();
    return {
      tagName: tag, style: {},
      appendChild: function () { return null; }
    };
  }
};

// Expose to mirrored functions (which read as free variables)
var document = mockDocument;
var documentBody = mockDocumentBody;

// ============================================================
// Reset state between fixtures
// ============================================================
function resetTooltipState() {
  _tooltipEl = null;
  mockDocumentBody.reset();
}

// ============================================================
// Mirror — _getTooltip() L4199-4209
// ============================================================
function _getTooltip() {
  if (_tooltipEl && _tooltipEl.isConnected) return _tooltipEl;
  _tooltipEl = document.createElement('div');
  _tooltipEl.id = 'd3-node-tooltip';
  _tooltipEl.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;' +
    'background:rgba(15,23,42,0.95);color:#f1f5f9;border:1px solid #475569;' +
    'border-radius:6px;padding:8px 10px;font:12px/1.4 ui-sans-serif,system-ui,sans-serif;' +
    'max-width:280px;box-shadow:0 4px 12px rgba(0,0,0,0.4);display:none;';
  parseCssTextIntoStyle(_tooltipEl);     // MOCK ONLY: real DOM does this
  documentBody.appendChild(_tooltipEl);
  return _tooltipEl;
}
var _tooltipEl = null;

// ============================================================
// Mirror — showTooltip L4211-4231 (HEALTHY)
// ============================================================
function healthyShowTooltip(event, node) {
  try {
    if (!node) return;
    const tt = _getTooltip();
    const id = node.id || node.dimension || '';
    const label = node.label || node.name || id;
    const ntype = node.ntype || node.type || '';
    const status = node.status || '';
    const score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
    let html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
    tt.innerHTML = html;
    tt.style.display = 'block';
    moveTooltip(event);
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Mirror — moveTooltip L4233-4244 (HEALTHY)
// swap-able alias: production calls moveTooltip(event) as a free variable.
// Tests can swap moveTooltip to the broken variant before invoking.
var moveTooltip = healthyMoveTooltip;

function healthyMoveTooltip(event) {
  try {
    const tt = _getTooltip();
    if (!tt || tt.style.display === 'none') return;
    const x = (event.clientX || 0) + 14;
    const y = (event.clientY || 0) + 14;
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Mirror — hideTooltip L4246-4253 (HEALTHY)
// ============================================================
function healthyHideTooltip() {
  try {
    const tt = _getTooltip();
    if (tt) tt.style.display = 'none';
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Broken mutants
// ============================================================
// T1 — drop null guard `if (!node) return;` in showTooltip.
//      Broken path: node=null still calls _getTooltip() and tries to read
//      node.id, which throws TypeError; caught by try/catch. Net effect:
//      tooltip element gets created even when node is null.
function brokenShowT1(event, node) {
  if (MIRROR_REPAIRED) return healthyShowTooltip(event, node);
  try {
    // null guard dropped — fall through regardless of node
    const tt = _getTooltip();
    const id = (node && (node.id || node.dimension)) || '';
    const label = (node && (node.label || node.name)) || id;
    const ntype = (node && (node.ntype || node.type)) || '';
    const status = (node && node.status) || '';
    const score = (node && typeof node.score === 'number') ? node.score.toFixed(0) : '';
    let html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    if (node && node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
    tt.innerHTML = html;
    tt.style.display = 'block';
    moveTooltip(event);
  } catch (err) {
    // Silent
  }
}

// T2 — drop `tt.style.display = 'block';` in showTooltip.
//      Broken path: tooltip innerHTML is committed but display stays 'none'.
function brokenShowT2(event, node) {
  if (MIRROR_REPAIRED) return healthyShowTooltip(event, node);
  try {
    if (!node) return;
    const tt = _getTooltip();
    const id = node.id || node.dimension || '';
    const label = node.label || node.name || id;
    const ntype = node.ntype || node.type || '';
    const status = node.status || '';
    const score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
    let html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
    tt.innerHTML = html;
    // tt.style.display = 'block';  // dropped — visibility toggle skipped
    moveTooltip(event);
  } catch (err) {
    // Silent
  }
}

// T3 — drop field-resolution fallbacks (|| chains) in showTooltip.
//      Broken path: for a minimal node {id:'S1'}, label/ntype become
//      `undefined`, which serialise to the literal string "undefined".
function brokenShowT3(event, node) {
  if (MIRROR_REPAIRED) return healthyShowTooltip(event, node);
  try {
    if (!node) return;
    const tt = _getTooltip();
    const id = node.id;                                  // fallback dropped
    const label = node.label;                            // fallback dropped
    const ntype = node.ntype;                            // fallback dropped
    const status = node.status;
    const score = (typeof node.score === 'number') ? node.score.toFixed(0) : '';
    let html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    if (status) html += '<div>Status: <b>' + status + '</b></div>';
    if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
    tt.innerHTML = html;
    tt.style.display = 'block';
    moveTooltip(event);
  } catch (err) {
    // Silent
  }
}

// T4 — drop HTML composition: status/score/description conditional appends.
//      Broken path: with full node, innerHTML lacks the conditional blocks.
function brokenShowT4(event, node) {
  if (MIRROR_REPAIRED) return healthyShowTooltip(event, node);
  try {
    if (!node) return;
    const tt = _getTooltip();
    const id = node.id || node.dimension || '';
    const label = node.label || node.name || id;
    const ntype = node.ntype || node.type || '';
    let html = '<div style="font-weight:600;color:#e2e8f0;margin-bottom:4px;">' + label + '</div>';
    html += '<div style="opacity:0.7;font-size:11px;margin-bottom:4px;">' + id + ' · ' + ntype + '</div>';
    // all three conditional appends dropped:
    //   if (status) html += '<div>Status: <b>' + status + '</b></div>';
    //   if (score) html += '<div>Score: <b>' + score + '/100</b></div>';
    //   if (node.description) html += '<div style="margin-top:4px;opacity:0.85;">' + node.description + '</div>';
    tt.innerHTML = html;
    tt.style.display = 'block';
    moveTooltip(event);
  } catch (err) {
    // Silent
  }
}

// T5 — drop moveTooltip early-exit `if (!tt || tt.style.display === 'none') return;`.
//      Broken path: hidden tooltip (display='none') gets its left/top updated
//      on every mousemove, polluting the state.
function brokenMoveT5(event) {
  if (MIRROR_REPAIRED) return healthyMoveTooltip(event);
  try {
    const tt = _getTooltip();
    // early-exit dropped — fall through even when display='none'
    const x = (event.clientX || 0) + 14;
    const y = (event.clientY || 0) + 14;
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  } catch (err) {
    // Silent
  }
}

// T6 — drop `+ 14` offset in moveTooltip.
//      Broken path: tooltip is positioned AT the cursor (no breathing room).
function brokenMoveT6(event) {
  if (MIRROR_REPAIRED) return healthyMoveTooltip(event);
  try {
    const tt = _getTooltip();
    if (!tt || tt.style.display === 'none') return;
    const x = event.clientX || 0;                        // +14 dropped
    const y = event.clientY || 0;                        // +14 dropped
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  } catch (err) {
    // Silent
  }
}

// T7 — CONTROL: healthy hideTooltip. As a control baseline, T7 is run
//      against F6 with the healthy function. When --repaired, all mutants
//      delegate to healthy, so all fixture-control reports should PASS.
function healthyHideTooltipControl() {
  return healthyHideTooltip();
}

// ============================================================
// Fixtures
// ============================================================
var FIX_FULL_NODE = {
  id: 'S1', label: 'FX/Hedge', ntype: 'DATA',
  status: 'GREEN', score: 75, description: 'FX exposure analysis'
};
var FIX_MINIMAL_NODE = { id: 'S1' };
var FIX_EVT_ZERO = { clientX: 0, clientY: 0 };
var FIX_EVT_100_200 = { clientX: 100, clientY: 200 };

// ============================================================
// Probe runners (per-function probes — only run on target fixtures)
// ============================================================
function runF1_nullGuard(fn, node) {
  resetTooltipState();
  fn(FIX_EVT_ZERO, node);
  // Inverted probe: push issue if tooltip was created despite null node.
  // Healthy: null guard → no tooltip created.
  // T1 broken: null guard dropped → tooltip created.
  var issues = [];
  if (_tooltipEl !== null || mockDocumentBody._tooltipCount > 0) {
    issues.push('F1 null guard violated — showTooltip(' + JSON.stringify(FIX_EVT_ZERO) + ', null) created tooltip (el=' + (_tooltipEl !== null) + ', count=' + mockDocumentBody._tooltipCount + ')');
  }
  return issues;
}

function runF2_fieldResolution(fn, node) {
  resetTooltipState();
  fn(FIX_EVT_ZERO, node);
  // Inverted probe: push issue if innerHTML contains "undefined" (the broken
  // path's signature when fallback chains are dropped).
  // Healthy: with minimal node {id:'S1'}, label falls back to 'S1' and
  //          ntype falls back to '' — no "undefined" literal.
  // T3 broken: label/ntype come back as undefined → string "undefined".
  var issues = [];
  var html = _tooltipEl ? _tooltipEl.innerHTML : '';
  if (html.indexOf('undefined') !== -1) {
    issues.push('F2 field-resolution violated — innerHTML contains "undefined" (fallback chain dropped)');
  }
  return issues;
}

function runF3_htmlComposition(fn, node) {
  resetTooltipState();
  fn(FIX_EVT_ZERO, node);
  // Inverted probe: push issue if any of the 5 expected sections is missing.
  // Healthy: full node yields all 5 (label, id+ntype, Status, Score, description).
  // T4 broken: conditional appends dropped → missing Status/Score/description.
  var issues = [];
  var html = _tooltipEl ? _tooltipEl.innerHTML : '';
  if (html.indexOf('FX/Hedge') === -1) issues.push('F3 HTML-composition violated — missing label section ("FX/Hedge")');
  if (html.indexOf('S1 · DATA') === -1) issues.push('F3 HTML-composition violated — missing id+ntype section ("S1 · DATA")');
  if (html.indexOf('Status:') === -1) issues.push('F3 HTML-composition violated — missing Status section');
  if (html.indexOf('Score:') === -1) issues.push('F3 HTML-composition violated — missing Score section');
  if (html.indexOf('FX exposure') === -1) issues.push('F3 HTML-composition violated — missing description section');
  // Post-show visibility probe — also catch T2 (visibility toggle dropped).
  // Healthy: display='block'. T2 broken: display='' (still 'none' from cssText).
  if (_tooltipEl && _tooltipEl.style.display !== 'block') {
    issues.push('F3 HTML-composition violated — post-show display="' + _tooltipEl.style.display + '" (want "block", visibility toggle dropped)');
  }
  return issues;
}

function runF4_moveTooltipPositioning(fn, evt) {
  resetTooltipState();
  // Pre-show so display='block' and moveTooltip doesn't early-exit.
  healthyShowTooltip({ clientX: 0, clientY: 0 }, FIX_FULL_NODE);
  fn(evt);
  // Inverted probe: push issue if left/top do not match +14 offset.
  // Healthy: clientX=100,clientY=200 → left='114px', top='214px'.
  // T6 broken: +14 dropped → left='100px', top='200px'.
  var issues = [];
  var tt = _tooltipEl;
  if (!tt) {
    issues.push('F4 moveTooltip-positioning violated — tooltip element missing');
    return issues;
  }
  if (tt.style.left !== '114px') {
    issues.push('F4 moveTooltip-positioning violated — left="' + tt.style.left + '" (want "114px", +14 offset dropped)');
  }
  if (tt.style.top !== '214px') {
    issues.push('F4 moveTooltip-positioning violated — top="' + tt.style.top + '" (want "214px", +14 offset dropped)');
  }
  return issues;
}

function runF5_moveTooltipEarlyExit(fn, evt) {
  resetTooltipState();
  // Force tooltip into existence via _getTooltip() — display stays 'none'.
  _getTooltip();
  // Snapshot left/top BEFORE calling the move fn.
  var preLeft = _tooltipEl.style.left;
  var preTop = _tooltipEl.style.top;
  fn(evt);
  // Inverted probe: push issue if hidden tooltip was repositioned.
  // Healthy: early-exit triggered → left/top unchanged.
  // T5 broken: early-exit dropped → left='14px', top='14px' (from clientX=0).
  var issues = [];
  if (_tooltipEl.style.left !== preLeft || _tooltipEl.style.top !== preTop) {
    issues.push('F5 moveTooltip-early-exit violated — hidden tooltip was moved (left "' + preLeft + '"→"' + _tooltipEl.style.left + '", top "' + preTop + '"→"' + _tooltipEl.style.top + '")');
  }
  return issues;
}

function runF6_hideTooltipVisibility(fn) {
  resetTooltipState();
  // Pre-show so display='block'.
  healthyShowTooltip(FIX_EVT_ZERO, FIX_FULL_NODE);
  var preDisplay = _tooltipEl.style.display;
  fn();
  // Inverted probe: push issue if display did not transition to 'none'.
  // Healthy: display goes 'block' → 'none'.
  // T7 broken (in this harness called as the broken hideTooltip): display stays 'block'.
  var issues = [];
  if (preDisplay !== 'block') {
    issues.push('F6 hideTooltip-visibility violated — pre-show display="' + preDisplay + '" (expected "block")');
  }
  if (_tooltipEl.style.display !== 'none') {
    issues.push('F6 hideTooltip-visibility violated — display="' + _tooltipEl.style.display + '" after hideTooltip (want "none")');
  }
  return issues;
}

// ============================================================
// Test matrix — per-function grouping
// Each mutant runs only against fixtures for its target function;
// each fixture control runs only against the healthy function.
// ============================================================
var MUTANTS = [
  { id: 'T1', fn: brokenShowT1,        kind: 'broken', target: 'show', drop: 'null-guard in showTooltip' },
  { id: 'T2', fn: brokenShowT2,        kind: 'broken', target: 'show', drop: 'visibility-toggle in showTooltip' },
  { id: 'T3', fn: brokenShowT3,        kind: 'broken', target: 'show', drop: 'field-resolution fallbacks' },
  { id: 'T4', fn: brokenShowT4,        kind: 'broken', target: 'show', drop: 'HTML composition (status/score/description)' },
  { id: 'T5', fn: brokenMoveT5,        kind: 'broken', target: 'move', drop: 'moveTooltip early-exit' },
  { id: 'T6', fn: brokenMoveT6,        kind: 'broken', target: 'move', drop: 'moveTooltip +14 offset' },
  { id: 'T7', fn: healthyHideTooltipControl, kind: 'control', target: 'hide', drop: '(control — healthy hideTooltip)' }
];

var ALL_FIXTURES = [
  { id: 'F1', fn: runF1_nullGuard,            target: 'show', args: [null] },
  { id: 'F2', fn: runF2_fieldResolution,      target: 'show', args: [FIX_MINIMAL_NODE] },
  { id: 'F3', fn: runF3_htmlComposition,      target: 'show', args: [FIX_FULL_NODE] },
  { id: 'F4', fn: runF4_moveTooltipPositioning, target: 'move', args: [FIX_EVT_100_200] },
  { id: 'F5', fn: runF5_moveTooltipEarlyExit, target: 'move', args: [FIX_EVT_ZERO] },
  { id: 'F6', fn: runF6_hideTooltipVisibility, target: 'hide', args: [] }
];

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E37 — tooltip cluster invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// Per-mutant report: run this mutant against ONLY fixtures for its target fn.
MUTANTS.forEach(function (mutant) {
  resetTooltipState();
  // Swap moveTooltip alias if this is a move-mutant. For show/hide mutants,
  // moveTooltip stays healthy so internal calls don't double-bias.
  if (mutant.id === 'T5') moveTooltip = brokenMoveT5;
  else if (mutant.id === 'T6') moveTooltip = brokenMoveT6;
  else moveTooltip = healthyMoveTooltip;

  var mutantIssues = [];
  var relevantFixtures = ALL_FIXTURES.filter(function (f) { return f.target === mutant.target; });
  relevantFixtures.forEach(function (fix) {
    var args = [mutant.fn].concat(fix.args);
    var issues = fix.fn.apply(null, args);
    mutantIssues = mutantIssues.concat(issues);
  });
  totalReports++;
  // Verdict logic:
  //   BASELINE: broken mutants should trigger probes (issues>0=PASS, 0=FAIL).
  //             Control mutants should NOT trigger (issues=0=PASS, >0=FAIL).
  //   REPAIRED: all mutants (broken + control) delegate to healthy fn, so
  //             none should trigger probes (issues=0=PASS, >0=FAIL).
  var detected = mutantIssues.length > 0;
  var isControl = mutant.kind === 'control';
  var pass;
  if (MIRROR_REPAIRED) {
    pass = !detected;
  } else {
    pass = isControl ? !detected : detected;
  }
  var marker = pass ? 'PASS' : 'FAIL';
  if (pass) totalPassed++; else totalFailed++;
  var roleLabel = mutant.target === 'show' ? 'broken-show' :
                  mutant.target === 'move' ? 'broken-move' :
                  mutant.target === 'hide' ? 'control-hide' : 'unknown';
  console.log('[' + marker + '] ' + mutant.id + ' (' + roleLabel + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length + ' / ' + relevantFixtures.length + ' fixtures');
  if (!pass) {
    relevantFixtures.forEach(function (fix) {
      console.log('         - ' + fix.id + ': invariant ' + (isControl ? 'was triggered unexpectedly' : 'held (no issue)'));
    });
  }
});

// Per-fixture report (control): run this fixture with the healthy function.
console.log('');
console.log('--- fixture × control (healthy) ---');
moveTooltip = healthyMoveTooltip;     // restore healthy for control runs
ALL_FIXTURES.forEach(function (fix) {
  resetTooltipState();
  var healthyFn;
  if (fix.target === 'show') healthyFn = healthyShowTooltip;
  else if (fix.target === 'move') healthyFn = healthyMoveTooltip;
  else if (fix.target === 'hide') healthyFn = healthyHideTooltip;
  var args = [healthyFn].concat(fix.args);
  var issues = fix.fn.apply(null, args);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy ' + fix.target + ') — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);