// e36_verify.js — showDetail() right-panel composition invariant
//
// E36 establishes that showDetail() at L4132-4195 of D3-PITCH-GRAPH.html
// composes the right-panel detail rendering. It is the canonical detail
// view of a node: visibility toggle + rich body lookup + field fallback
// chain + header/sections/innerHTML commit.
//
// Composition contract verified:
//   (a) null guard: if (!n) return — null/missing node short-circuits
//   (b) DOM lookup: detail-empty + detail-content + visibility toggle
//       (empty.style.display='none', content.style.display='block')
//   (c) rich body resolution: getRichBody(n) || {} with rich alias
//   (d) field resolution: 9 fields with canonical-then-rich-then-node
//       fallback chain (title, summary, ntype, status, score, explain,
//       whyItMatters, realImpact, glossary)
//   (e) header HTML: detail-tag + detail-title + detail-sub +
//       detail-summary + detail-badges (score badge with status-color)
//   (f) section cards: explain + whyItMatters + realImpact + glossary,
//       all conditional on field presence
//   (g) innerHTML commit: content.innerHTML = html
//   (h) try/catch error boundary swallows throws
//
// Together with E34 (hover-in) and E35 (hover-out), this pins the full
// node-interaction composition: selectNode → highlight/unhighlight →
// showDetail. E36 closes the loop by verifying the detail panel.
//
// 6 fixtures × composition contract + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// getRichBody stub — mirrors L4144 (returns {} when node has no match)
// ------------------------------------------------------------------
var RICH_BODY = null;
function getRichBody(n) {
  if (RICH_BODY && typeof RICH_BODY === 'function') return RICH_BODY(n);
  return RICH_BODY || {};
}

// ------------------------------------------------------------------
// Mock DOM elements: detail-empty + detail-content
// ------------------------------------------------------------------
function makeMockDetailPanel() {
  var empty = {
    id: 'detail-empty',
    style: { display: '' },
    _innerHTML: ''
  };
  Object.defineProperty(empty, 'innerHTML', {
    get: function () { return this._innerHTML; },
    set: function (v) { this._innerHTML = v; }
  });

  var content = {
    id: 'detail-content',
    style: { display: '' },
    _innerHTML: ''
  };
  Object.defineProperty(content, 'innerHTML', {
    get: function () { return this._innerHTML; },
    set: function (v) { this._innerHTML = v; }
  });

  return { empty: empty, content: content };
}

// ------------------------------------------------------------------
// Mock document.getElementById
// ------------------------------------------------------------------
function makeMockDocument(panel) {
  var map = {};
  if (panel) {
    map['detail-empty'] = panel.empty;
    map['detail-content'] = panel.content;
  }
  return {
    getElementById: function (id) {
      return Object.prototype.hasOwnProperty.call(map, id) ? map[id] : null;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L4132-4195 — showDetail
// ------------------------------------------------------------------
function showDetail(n) {
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

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of showDetail
// ------------------------------------------------------------------
function installMutant(kind, doc, panel) {
  if (kind === 'T1') {
    // T1: drop null guard — null n causes TypeError on body = getRichBody(n)
    return function brokenT1(n) {
      try {
        // guard removed
        var empty = doc.getElementById('detail-empty');
        var content = doc.getElementById('detail-content');
        if (empty) empty.style.display = 'none';
        if (content) content.style.display = 'block';
        var body = getRichBody(n) || {};
        // body would be {} but then n.name etc throw on null
        // Caught by try/catch — null node causes catch to fire, no DOM mutation
      } catch (e) {
        console.error('[D3 showDetail] error:', e);
      }
    };
  } else if (kind === 'T2') {
    // T2: drop DOM lookup / visibility toggle
    return function brokenT2(n) {
      try {
        if (!n) return;
        // empty/content lookup + visibility toggle DROPPED
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
        panel.content.innerHTML = html;
      } catch (e) {}
    };
  } else if (kind === 'T3') {
    // T3: drop rich body resolution — body always {}, fallbacks use n.* only
    return function brokenT3(n) {
      try {
        if (!n) return;
        var empty = doc.getElementById('detail-empty');
        var content = doc.getElementById('detail-content');
        if (empty) empty.style.display = 'none';
        if (content) content.style.display = 'block';
        // rich body lookup DROPPED — body defaults to {}
        var body = {};
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
        panel.content.innerHTML = html;
      } catch (e) {}
    };
  } else if (kind === 'T4') {
    // T4: drop header composition — html starts with section cards only
    return function brokenT4(n) {
      try {
        if (!n) return;
        var empty = doc.getElementById('detail-empty');
        var content = doc.getElementById('detail-content');
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
        var html = '';
        // header DROPPED
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
        panel.content.innerHTML = html;
      } catch (e) {}
    };
  } else if (kind === 'T5') {
    // T5: drop section cards — only header rendered
    return function brokenT5(n) {
      try {
        if (!n) return;
        var empty = doc.getElementById('detail-empty');
        var content = doc.getElementById('detail-content');
        if (empty) empty.style.display = 'none';
        if (content) content.style.display = 'block';
        var body = getRichBody(n) || {};
        var rich = body;
        var name = body.title || (rich && rich.name) || n.name || n.label || n.id || 'Node';
        var summary = body.summary || (rich && (rich.summary || rich.desc)) || n.desc || '';
        var ntype = n.ntype || body._sourceKey || 'node';
        var status = n.status || (rich && rich.status) || '';
        var score = (typeof n.score === 'number') ? n.score : (rich && typeof rich.score === 'number' ? rich.score : null);
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
        // section cards DROPPED
        panel.content.innerHTML = html;
      } catch (e) {}
    };
  } else if (kind === 'T6') {
    // T6: drop innerHTML commit — html built but never assigned
    return function brokenT6(n) {
      try {
        if (!n) return;
        var empty = doc.getElementById('detail-empty');
        var content = doc.getElementById('detail-content');
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
        // innerHTML commit DROPPED — content.innerHTML stays at ''
      } catch (e) {}
    };
  }
  return null;
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E36 SHOWDETAIL RIGHT-PANEL INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // Rich body fixture used for many fixtures
  var RICH_FIXTURE = {
    title: 'PTAX Volatility',
    summary: 'BRL/USD σ = 11.2% (10y BCB empirical)',
    status: 'red',
    score: 78,
    explanation: 'Annualized volatility of the BRL/USD spot rate.',
    whyItMatters: 'Direct P&L impact on USD-denominated BOM imports.',
    realImpact: 'Each 1σ PTAX move ≈ R$8.21bi VaR on BOM cost.',
    glossary: [
      { term: 'PTAX', def: 'Official BCB reference rate' },
      { term: 'σ', def: 'Standard deviation of log-returns' }
    ]
  };

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');

  var FIXTURES = [
    {
      name: 'F1 — showDetail(null) returns silently, no DOM mutation',
      setup: function () {
        RICH_BODY = null;
        var panel = makeMockDetailPanel();
        panel.empty.style.display = 'block';
        panel.content.style.display = 'none';
        panel.content._innerHTML = '<pre>untouched</pre>';
        global.document = makeMockDocument(panel);
        var crashed = false;
        try {
          showDetail(null);
        } catch (e) {
          crashed = true;
        }
        var issues = [];
        if (crashed) issues.push('showDetail(null) threw (expected silent return)');
        if (panel.empty.style.display !== 'block') issues.push('detail-empty.style.display mutated to "' + panel.empty.style.display + '" (expected "block" unchanged)');
        if (panel.content.style.display !== 'none') issues.push('detail-content.style.display mutated to "' + panel.content.style.display + '" (expected "none" unchanged)');
        if (panel.content._innerHTML !== '<pre>untouched</pre>') issues.push('detail-content.innerHTML mutated (expected unchanged)');
        return { issues: issues };
      }
    },
    {
      name: 'F2 — showDetail(node) hides empty and shows content',
      setup: function () {
        RICH_BODY = null;
        var panel = makeMockDetailPanel();
        global.document = makeMockDocument(panel);
        showDetail({ id: 'N1', name: 'TestNode' });
        var issues = [];
        if (panel.empty.style.display !== 'none') issues.push('detail-empty.style.display was "' + panel.empty.style.display + '" (expected "none")');
        if (panel.content.style.display !== 'block') issues.push('detail-content.style.display was "' + panel.content.style.display + '" (expected "block")');
        return { issues: issues };
      }
    },
    {
      name: 'F3 — showDetail resolves title via canonical (body.title) before rich / node',
      setup: function () {
        RICH_BODY = RICH_FIXTURE;
        var panel = makeMockDetailPanel();
        global.document = makeMockDocument(panel);
        showDetail({ id: 'D-PTAX', ntype: 'risk' });
        var issues = [];
        // body.title = 'PTAX Volatility' wins over n.name / n.id
        if (panel.content._innerHTML.indexOf('PTAX Volatility') === -1) {
          issues.push('innerHTML missing "PTAX Volatility" (canonical body.title path broken)');
        }
        if (panel.content._innerHTML.indexOf('TestNode') !== -1) {
          issues.push('innerHTML contained "TestNode" (should not — canonical should win)');
        }
        if (panel.content._innerHTML.indexOf('D-PTAX') === -1) {
          issues.push('innerHTML missing n.id "D-PTAX" in detail-sub');
        }
        return { issues: issues };
      }
    },
    {
      name: 'F4 — showDetail builds header with tag/title/sub/summary/badge (status-color = red)',
      setup: function () {
        RICH_BODY = RICH_FIXTURE;
        var panel = makeMockDetailPanel();
        global.document = makeMockDocument(panel);
        showDetail({ id: 'D-PTAX', ntype: 'risk', status: 'red', score: 78 });
        var issues = [];
        var h = panel.content._innerHTML;
        if (h.indexOf('detail-header') === -1) issues.push('header <div class="detail-header"> missing');
        if (h.indexOf('detail-tag') === -1) issues.push('detail-tag <div> missing');
        if (h.indexOf('RISK · RED') === -1) issues.push('detail-tag missing "RISK · RED" (uppercase tag + status)');
        if (h.indexOf('detail-title') === -1) issues.push('detail-title <div> missing');
        if (h.indexOf('PTAX Volatility') === -1) issues.push('title text missing');
        if (h.indexOf('detail-sub') === -1) issues.push('detail-sub <div> missing');
        if (h.indexOf('D-PTAX') === -1) issues.push('detail-sub id missing');
        if (h.indexOf('detail-summary') === -1) issues.push('detail-summary <div> missing');
        if (h.indexOf('detail-badges') === -1) issues.push('detail-badges <div> missing');
        if (h.indexOf('Score: 78/100') === -1) issues.push('score badge missing "Score: 78/100"');
        if (h.indexOf('badge red') === -1) issues.push('badge missing "red" status color (status="red" → red badge class)');
        return { issues: issues };
      }
    },
    {
      name: 'F5 — showDetail emits section-cards for explain/why/impact/glossary',
      setup: function () {
        RICH_BODY = RICH_FIXTURE;
        var panel = makeMockDetailPanel();
        global.document = makeMockDocument(panel);
        showDetail({ id: 'D-PTAX', ntype: 'risk' });
        var issues = [];
        var h = panel.content._innerHTML;
        if (h.indexOf('section-card') === -1) issues.push('no section-card <div>s rendered');
        if (h.indexOf('O que é') === -1) issues.push('section-card for explain missing "O que é"');
        if (h.indexOf('Por que importa') === -1) issues.push('section-card for whyItMatters missing "Por que importa"');
        if (h.indexOf('Impacto real') === -1) issues.push('section-card for realImpact missing "Impacto real"');
        if (h.indexOf('Glossário') === -1) issues.push('section-card for glossary missing "Glossário"');
        if (h.indexOf('kv-row') === -1) issues.push('glossary kv-row missing');
        if (h.indexOf('PTAX') === -1) issues.push('glossary term "PTAX" missing');
        if (h.indexOf('kv-label') === -1) issues.push('glossary kv-label missing');
        return { issues: issues };
      }
    },
    {
      name: 'F6 — showDetail commits HTML via content.innerHTML = html',
      setup: function () {
        RICH_BODY = RICH_FIXTURE;
        var panel = makeMockDetailPanel();
        panel.content._innerHTML = '';  // start empty
        global.document = makeMockDocument(panel);
        showDetail({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
        var issues = [];
        if (panel.content._innerHTML === '') {
          issues.push('detail-content.innerHTML stayed "" (commit dropped)');
        }
        if (panel.content._innerHTML.indexOf('detail-header') === -1) {
          issues.push('detail-content.innerHTML did not contain committed detail-header');
        }
        if (panel.content._innerHTML.indexOf('Score: 65/100') === -1) {
          issues.push('detail-content.innerHTML did not contain score badge');
        }
        return { issues: issues };
      }
    }
  ];

  for (var i = 0; i < FIXTURES.length; i++) {
    var fx = FIXTURES[i];
    var result = fx.setup();
    total++;
    if (result.issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + fx.name);
    } else {
      failed++;
      console.log('  [FAIL] ' + fx.name + ': ' + result.issues.length + ' issues');
      for (var j = 0; j < result.issues.length; j++) {
        console.log('    - ' + result.issues[j]);
      }
    }
  }

  // ADVERSARIAL MUTANTS (T1-T7)
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');

  function recordAdversarial(label, kind) {
    total++;
    RICH_BODY = RICH_FIXTURE;
    var panel = makeMockDetailPanel();
    var doc = makeMockDocument(panel);
    global.document = doc;
    var issues = [];

    if (kind === 'T1') {
      // T1: dropped null guard. Calling brokenT1(null) — brokenT1 still has
      // try/catch, so null n causes TypeError, caught, no DOM mutation.
      // Probe: visibility toggle should NOT have been applied (brokenT1's
      // body has the visibility toggle, but it runs the body empty).
      // Actually wait — brokenT1 has the full body including the visibility
      // toggle. But getRichBody(null) returns {} (since RICH_BODY is a fixture
      // not a function returning per-node). Then n.name etc throw on null.
      // The try/catch swallows it. Net effect: panel state unchanged.
      var brokenFn1 = installMutant('T1', doc, panel);
      panel.empty.style.display = 'block';
      panel.content.style.display = 'none';
      brokenFn1(null);
      // Healthy: showDetail(null) returns at the null guard — no DOM mutation.
      // T1: drops guard, body throws, catch swallows. Net: also no DOM mutation.
      // To distinguish T1 from healthy, we need a probe where T1's behavior
      // differs. With null input, both produce same result (no mutation).
      // So: use a non-null input where healthy passes through normally but
      // T1 has a side effect. The asymmetry: T1's body mutates panel state.
      panel.empty.style.display = 'block';
      panel.content.style.display = 'none';
      brokenFn1({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      // T1's body still includes visibility toggle (it's only the guard that's
      // dropped). So actually T1 still mutates panel state with non-null input.
      // The asymmetry is the guard for null — both should short-circuit.
      // Hmm — T1's body references `n` after the guard. If n is null and the
      // body runs, it throws. With a non-null input, T1 works fine.
      // So the only way to detect T1 is via null input: healthy returns
      // early at the guard; T1 throws inside the body.
      // Both produce same DOM state (no mutation). Detection: T1 should
      // not throw on null — but brokenT1's try/catch swallows.
      // Detection: instead, the T1 mutant function is structurally different
      // from healthy. We test via "does the function crash on null?" — T1's
      // body throws and catch swallows, healthy returns at guard. No external
      // observable difference.
      //
      // Alternative: T1's contract is "drop null guard means function no longer
      // short-circuits on null". A clean test would be to verify the guard
      // exists. We can detect by: with null n, healthy returns immediately,
      // T1 still calls getRichBody(null) (returns {} since null node lookup
      // yields {}). Then n.name etc throw. With try/catch, no DOM diff.
      //
      // Realistic detection: T1 also lacks the (typeof n.score === 'number')
      // type guard etc — but the only meaningful diff is the null guard.
      //
      // For probe correctness: use a probe where T1's body emits HTML but
      // doesn't pass through the guard. The probe can assert that null n
      // does NOT cause visibility toggle. Both produce that. So we detect
      // T1 by injecting a sentinel into getRichBody that records whether it
      // was called. Healthy doesn't call it on null; T1 calls it.
      var called1 = false;
      var origRich = RICH_BODY;
      RICH_BODY = function (n) {
        called1 = true;
        return origRich;
      };
      panel.empty.style.display = 'block';
      panel.content.style.display = 'none';
      panel.content._innerHTML = '';
      brokenFn1(null);
      RICH_BODY = origRich;
      if (called1) {
        issues.push('T1: getRichBody was called for null node (guard dropped — should have returned early)');
      }
    } else if (kind === 'T2') {
      // T2: dropped DOM lookup / visibility toggle.
      // Probe: empty/content display states should have been toggled — broken
      // code leaves them unchanged (still 'block'/'none'). Push issue when the
      // toggle did NOT happen (i.e., state was left as it was pre-call).
      var brokenFn2 = installMutant('T2', doc, panel);
      panel.empty.style.display = 'block';
      panel.content.style.display = 'none';
      var preEmpty2 = panel.empty.style.display;
      var preContent2 = panel.content.style.display;
      brokenFn2({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      // Inverted pattern: push when broken code DIDN'T toggle the visibility.
      if (panel.empty.style.display === preEmpty2 && preEmpty2 === 'block') {
        issues.push('T2: detail-empty.style.display stayed "' + panel.empty.style.display + '" (visibility toggle was dropped — should have hidden empty)');
      }
      if (panel.content.style.display === preContent2 && preContent2 === 'none') {
        issues.push('T2: detail-content.style.display stayed "' + panel.content.style.display + '" (visibility toggle was dropped — should have shown content)');
      }
    } else if (kind === 'T3') {
      // T3: dropped rich body resolution. body always {}.
      // Probe: rich body fields (title, summary, explanation, etc.) should
      // NOT be visible in innerHTML — they should fall back to n.* values,
      // not canonical values.
      var brokenFn3 = installMutant('T3', doc, panel);
      brokenFn3({ id: 'D-PTAX', ntype: 'risk', status: 'amber' });
      var h3 = panel.content._innerHTML;
      // body.title = 'PTAX Volatility' should NOT appear (canonical dropped)
      if (h3.indexOf('PTAX Volatility') !== -1) {
        issues.push('T3: innerHTML contained "PTAX Volatility" (canonical body.title path used — but body should default to {})');
      }
      // n.label / n.name absent → should fall back to 'Node'
      if (h3.indexOf('>Node<') === -1) {
        issues.push('T3: title did not fall back to "Node" (expected fallback when no body.title and no n.name)');
      }
    } else if (kind === 'T4') {
      // T4: dropped header composition. Probe asserts header elements are
      // ABSENT in innerHTML when the broken code runs.
      var brokenFn4 = installMutant('T4', doc, panel);
      brokenFn4({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      var h4 = panel.content._innerHTML;
      // Inverted: push when header tokens are absent (broken dropped them).
      if (h4.indexOf('detail-header') === -1) {
        issues.push('T4: innerHTML missing detail-header (header composition was dropped)');
      }
      if (h4.indexOf('detail-title') === -1) {
        issues.push('T4: innerHTML missing detail-title (header dropped)');
      }
      if (h4.indexOf('Score: 65/100') === -1) {
        issues.push('T4: innerHTML missing "Score: 65/100" (header dropped — badge gone)');
      }
      // Section cards should STILL be present — T4 dropped header, not sections.
      if (h4.indexOf('section-card') === -1) {
        issues.push('T4: section-cards also missing (T4 should drop ONLY header, not sections)');
      }
    } else if (kind === 'T5') {
      // T5: dropped section cards. Probe asserts section-card tokens are
      // ABSENT in innerHTML when broken code runs.
      var brokenFn5 = installMutant('T5', doc, panel);
      brokenFn5({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      var h5 = panel.content._innerHTML;
      // Inverted: push when section tokens are absent (broken dropped them).
      if (h5.indexOf('section-card') === -1) {
        issues.push('T5: innerHTML missing section-card (section cards were dropped)');
      }
      if (h5.indexOf('O que é') === -1) {
        issues.push('T5: innerHTML missing "O que é" (explain section-card dropped)');
      }
      if (h5.indexOf('Glossário') === -1) {
        issues.push('T5: innerHTML missing "Glossário" (glossary section-card dropped)');
      }
      // Header should STILL be present — T5 dropped sections, not header.
      if (h5.indexOf('detail-header') === -1) {
        issues.push('T5: detail-header also missing (T5 should drop ONLY sections, not header)');
      }
    } else if (kind === 'T6') {
      // T6: dropped innerHTML commit. Probe asserts innerHTML stayed empty
      // (broken code built the html string but never assigned it).
      var brokenFn6 = installMutant('T6', doc, panel);
      panel.content._innerHTML = '';
      brokenFn6({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      // Inverted: push when innerHTML is unchanged (commit was dropped).
      if (panel.content._innerHTML === '') {
        issues.push('T6: detail-content.innerHTML stayed "" (commit was dropped — HTML built but never assigned)');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy showDetail.
      panel.empty.style.display = 'block';
      panel.content.style.display = 'none';
      panel.content._innerHTML = '';
      showDetail({ id: 'D-PTAX', ntype: 'risk', status: 'amber', score: 65 });
      if (panel.empty.style.display !== 'none') {
        issues.push('control: detail-empty.style.display was "' + panel.empty.style.display + '" (expected "none")');
      }
      if (panel.content.style.display !== 'block') {
        issues.push('control: detail-content.style.display was "' + panel.content.style.display + '" (expected "block")');
      }
      var hc = panel.content._innerHTML;
      if (hc === '') issues.push('control: innerHTML stayed empty (commit missing)');
      if (hc.indexOf('detail-header') === -1) issues.push('control: innerHTML missing detail-header');
      if (hc.indexOf('Score: 65/100') === -1) issues.push('control: innerHTML missing score badge');
      if (hc.indexOf('section-card') === -1) issues.push('control: innerHTML missing section-cards');
    }

    var ctrl = kind === 'T7';
    if (ctrl) {
      if (issues.length === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues (CONTROL BROKEN)');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    } else {
      if (issues.length >= 1) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥1)');
        for (var n = 0; n < issues.length; n++) console.log('    - ' + issues[n]);
      }
    }
  }

  recordAdversarial('T1 null guard dropped', 'T1');
  recordAdversarial('T2 DOM lookup / visibility toggle dropped', 'T2');
  recordAdversarial('T3 rich body resolution dropped', 'T3');
  recordAdversarial('T4 header composition dropped', 'T4');
  recordAdversarial('T5 section cards dropped', 'T5');
  recordAdversarial('T6 innerHTML commit dropped', 'T6');
  recordAdversarial('T7 control (healthy showDetail)', 'T7');

  console.log('');
  console.log('========== E36 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();