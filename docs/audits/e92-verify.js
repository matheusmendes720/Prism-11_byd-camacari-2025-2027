// e92-verify.js — showDetail() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4132-4195 (showDetail —
// populates the right-side detail panel with node info).
//
// Invariants (3 sub-checks):
//   1a. #detail-empty display = 'none'.
//   1b. #detail-content display = 'block'.
//   1c. #detail-content innerHTML is non-empty.
//
// 1 mutant × 1 target fixture + 1 control = 2 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================

var _detailEmpty = { style: { display: '' } };
var _detailContent = { style: { display: '' }, innerHTML: '' };
var _richBodyOverride = null;  // for getRichBody override

function setRichBodyOverride(val) { _richBodyOverride = val; }

function getSnapshot() {
  return {
    detailEmptyDisplay: _detailEmpty.style.display,
    detailContentDisplay: _detailContent.style.display,
    detailContentHTML: _detailContent.innerHTML
  };
}

function resetEnv() {
  _detailEmpty = { style: { display: '' } };
  _detailContent = { style: { display: '' }, innerHTML: '' };
  _richBodyOverride = null;
}

function makeMockSvg() {
  return {
    getElementById: function (id) {
      if (id === 'detail-empty') return _detailEmpty;
      if (id === 'detail-content') return _detailContent;
      return null;
    }
  };
}

var mockSvg = makeMockSvg();

global.document = {
  getElementById: function (id) {
    return mockSvg.getElementById(id);
  }
};

// ============================================================
// Data stubs that showDetail depends on
// ============================================================
var dimData = {
  S1: { name: 'FX Test', summary: 'Test', ntype: 'signal', status: 'amber', score: 65,
        explain: 'explain', whyItMatters: 'why', realImpact: 'impact', glossary: [] }
};
var dataNodes = {};
var decisionTrees = {};
var actions = {};

// ============================================================
// Mirror — findRichEntry (simplified for fixture)
// ============================================================
function findRichEntry(n) {
  if (!n) return null;
  if (n.id && dimData[n.id]) return dimData[n.id];
  return null;
}

// ============================================================
// Mirror — normalizeBody (simplified for fixture)
// ============================================================
function normalizeBody(entry) {
  return entry || null;
}

// ============================================================
// Mirror — getRichBody (simplified)
// ============================================================
function getRichBody(n) {
  if (_richBodyOverride !== null) return _richBodyOverride;
  var entry = findRichEntry(n);
  var body = normalizeBody(entry) || {};
  if (n) {
    if (!body._sourceKey && n.ntype) body._sourceKey = n.ntype;
    if (!body._nodeId) body._nodeId = n.id || '';
  }
  return body;
}

// ============================================================
// Mirror — healthy showDetail (L4132-4195)
// ============================================================
function healthyShowDetail(n) {
  try {
    if (!n) return;
    var empty = document.getElementById('detail-empty');
    var content = document.getElementById('detail-content');
    if (empty) empty.style.display = 'none';
    if (content) content.style.display = 'block';

    var body = getRichBody(n) || {};
    var rich = body;

    var name = body.title || (rich && rich.name) || n.name || n.label || n.id || 'Node';
    var summary = body.summary || (rich && (rich.summary || rich.desc)) || n.desc || '';
    var ntype = n.ntype || body._sourceKey || 'node';
    var status = n.status || (rich && rich.status) || '';
    var score = (typeof n.score === 'number') ? n.score : (rich && typeof rich.score === 'number' ? rich.score : null);
    var explain = body.explanation || (rich && (rich.explain || rich.whatIsIt)) || '';
    var whyItMatters = body.whyItMatters || (rich && (rich.whyItMatters || rich.whyMatters || rich.executiveSummary)) || '';
    var realImpact = body.realImpact || (rich && (rich.realImpact || rich.numerical || rich.operationalPlaybook)) || '';
    var glossary = body.glossary || (rich && rich.glossary) || [];

    var html = '<div class="detail-header">';
    html += '<div class="detail-tag">' + String(ntype).toUpperCase() + (status ? ' · ' + String(status).toUpperCase() : '') + '</div>';
    html += '<div class="detail-title">' + name + '</div>';
    if (n.id) html += '<div class="detail-sub">' + n.id + '</div>';
    if (summary) html += '<div class="detail-summary">' + summary + '</div>';
    if (score !== null) {
      html += '<div class="detail-badges">';
      var bc = (status === 'red') ? 'red' : (status === 'amber') ? 'amber' : (status === 'green') ? 'green' : 'blue';
      html += '<span class="badge ' + bc + '">Score: ' + score + '/100</span>';
      html += '</div>';
    }
    html += '</div>';

    if (explain) {
      html += '<div class="section-card"><h4>O que é</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + explain + '</div></div>';
    }
    if (whyItMatters) {
      html += '<div class="section-card"><h4>Por que importa</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + whyItMatters + '</div></div>';
    }
    if (realImpact) {
      html += '<div class="section-card"><h4>Impacto real</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + realImpact + '</div></div>';
    }
    if (glossary && glossary.length) {
      html += '<div class="section-card"><h4>Glossário</h4>';
      for (var i = 0; i < glossary.length; i++) {
        var g = glossary[i];
        html += '<div class="kv-row"><span class="kv-label">' + g.term + '</span></div>';
        html += '<div style="font-size:11px;color:var(--ink-3);margin-bottom:6px">' + g.def + '</div>';
      }
      html += '</div>';
    }

    content.innerHTML = html;
  } catch (err) {
    console.error('[D3 showDetail] error:', err);
  }
}

// ============================================================
// Broken mutant — drops detail-empty display:none
// (detail-content still shown, innerHTML still set)
// ============================================================
function makeBF(opts) {
  return function (n) {
    if (MIRROR_REPAIRED) return healthyShowDetail(n);
    try {
      if (!n) return;
      var empty = document.getElementById('detail-empty');
      var content = document.getElementById('detail-content');
      // T1: skip empty.style.display = 'none'
      if (!opts.dropEmptyHide) {
        if (empty) empty.style.display = 'none';
      }
      if (content) content.style.display = 'block';

      var body = getRichBody(n) || {};
      var rich = body;
      var name = body.title || (rich && rich.name) || n.name || n.label || n.id || 'Node';
      var summary = body.summary || (rich && (rich.summary || rich.desc)) || n.desc || '';
      var ntype = n.ntype || body._sourceKey || 'node';
      var status = n.status || (rich && rich.status) || '';
      var score = (typeof n.score === 'number') ? n.score : (rich && typeof rich.score === 'number' ? rich.score : null);
      var explain = body.explanation || (rich && (rich.explain || rich.whatIsIt)) || '';
      var whyItMatters = body.whyItMatters || (rich && (rich.whyItMatters || rich.whyMatters || rich.executiveSummary)) || '';
      var realImpact = body.realImpact || (rich && (rich.realImpact || rich.numerical || rich.operationalPlaybook)) || '';
      var glossary = body.glossary || (rich && rich.glossary) || [];

      var html = '<div class="detail-header">';
      html += '<div class="detail-tag">' + String(ntype).toUpperCase() + (status ? ' · ' + String(status).toUpperCase() : '') + '</div>';
      html += '<div class="detail-title">' + name + '</div>';
      if (n.id) html += '<div class="detail-sub">' + n.id + '</div>';
      if (summary) html += '<div class="detail-summary">' + summary + '</div>';
      if (score !== null) {
        html += '<div class="detail-badges">';
        var bc = (status === 'red') ? 'red' : (status === 'amber') ? 'amber' : (status === 'green') ? 'green' : 'blue';
        html += '<span class="badge ' + bc + '">Score: ' + score + '/100</span>';
        html += '</div>';
      }
      html += '</div>';

      if (explain) {
        html += '<div class="section-card"><h4>O que é</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + explain + '</div></div>';
      }
      if (whyItMatters) {
        html += '<div class="section-card"><h4>Por que importa</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + whyItMatters + '</div></div>';
      }
      if (realImpact) {
        html += '<div class="section-card"><h4>Impacto real</h4><div style="font-size:12px;line-height:1.6;color:var(--ink-2)">' + realImpact + '</div></div>';
      }
      if (glossary && glossary.length) {
        html += '<div class="section-card"><h4>Glossário</h4>';
        for (var i = 0; i < glossary.length; i++) {
          var g = glossary[i];
          html += '<div class="kv-row"><span class="kv-label">' + g.term + '</span></div>';
          html += '<div style="font-size:11px;color:var(--ink-3);margin-bottom:6px">' + g.def + '</div>';
        }
        html += '</div>';
      }

      content.innerHTML = html;
    } catch (err) {
      console.error('[D3 showDetail] error:', err);
    }
  };
}

var MUTANTS = [
  // T1 drops detail-empty display:none → targets F0 which checks empty display.
  { id: 'T1', fn: makeBF({ dropEmptyHide: true }), target: 'F0', drop: 'detail-empty display:none (1a)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e92-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setRichBodyOverride: setRichBodyOverride,
  getSnapshot: getSnapshot
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E92 — showDetail() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-showDetail, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyShowDetail);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy showDetail) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
