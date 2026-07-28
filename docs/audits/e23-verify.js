// e23_verify.js — Panel rendering safety invariant for showDetail()
//
// E23 establishes that showDetail() produces a valid, leak-free HTML
// rendering for every canonical node fixture. The harness mirrors
// the field-resolution + HTML-assembly portions of showDetail() (L3741-3813
// of D3-PITCH-GRAPH.html) and captures the assembled html string in a
// closure variable instead of writing to content.innerHTML.
//
// Invariants tested (per fixture):
//   (a) name is non-empty string, no literal 'undefined'/'null'
//   (b) ntype is string
//   (c) summary is string (can be empty)
//   (d) explain is string
//   (e) whyItMatters is string
//   (f) realImpact is string
//   (g) glossary is array; entries have string term + def
//   (h) score is null or finite number
//   (i) status is string
//   (j) html string contains no literal >undefined< or >null< tokens
//
// 7 adversarial mutants target individual failure modes.
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Type predicates
// ------------------------------------------------------------------
function isString(x) { return typeof x === 'string'; }
function isNonEmptyString(x) { return isString(x) && x.length > 0; }
function isFiniteNumber(x) { return typeof x === 'number' && isFinite(x); }
function isObjLit(x) {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function hasUndefinedLeakInHTML(html) {
  // Mirrors what a panel would visibly render: 'undefined' or 'null' as
  // visible text between > tags. Score: null/100 is also a leak.
  return (html.indexOf('>undefined<') >= 0 ||
          html.indexOf('>null<') >= 0 ||
          html.indexOf('Score: null/100') >= 0);
}

// XSS surface: showDetail writes raw body strings into innerHTML via
// concatenation (no escape). The invariant: the rendered html must not
// contain unescaped <script>, <style>, javascript:, or event-handler
// attributes sourced from registry data.
function hasXSSPattern(html) {
  return /<script|<style|javascript:|onerror=|onclick=/i.test(html);
}

// ------------------------------------------------------------------
// Mirror of showDetail() — field resolution + HTML assembly
// (no DOM writes; returns captured html + fields via closure)
// ------------------------------------------------------------------
function makeShowDetail(options) {
  options = options || {};
  var captured = { html: '', fields: null };

  function showDetail(n) {
    captured.html = '';
    captured.fields = null;
    try {
      if (!n) return;
      // (skipped: document.getElementById + style.display)

      var body = (options.getRichBody || function(_x) { return {}; })(n) || {};
      var rich = body;
      var name = body.title || (rich && rich.name) || n.name || n.label || n.id || 'Node';
      var summary = body.summary || (rich && (rich.summary || rich.desc)) || n.desc || '';
      var ntype = n.ntype || body._sourceKey || 'node';
      var status = n.status || (rich && rich.status) || '';
      var score = (typeof n.score === 'number') ? n.score
                : (rich && typeof rich.score === 'number' ? rich.score : null);
      var explain = body.explanation || (rich && (rich.explain || rich.whatIsIt)) || '';
      var whyItMatters = body.whyItMatters || (rich && (rich.whyItMatters || rich.whyMatters || rich.executiveSummary)) || '';
      var realImpact = body.realImpact || (rich && (rich.realImpact || rich.numerical || rich.operationalPlaybook)) || '';
      var glossary = body.glossary || (rich && rich.glossary) || [];

      var html = '<div class="detail-header">';
      html += '<div class="detail-tag">' + String(ntype).toUpperCase() + '</div>';
      html += '<div class="detail-title">' + name + '</div>';
      if (n.id) html += '<div class="detail-sub">' + n.id + '</div>';
      if (summary) html += '<div class="detail-summary">' + summary + '</div>';
      if (score !== null) {
        html += '<div class="detail-score">Score: ' + score + '/100</div>';
      }
      if (explain) html += '<div class="detail-section"><h4>O que é</h4><div>' + explain + '</div></div>';
      if (whyItMatters) html += '<div class="detail-section"><h4>Por que importa</h4><div>' + whyItMatters + '</div></div>';
      if (realImpact) html += '<div class="detail-section"><h4>Impacto real</h4><div>' + realImpact + '</div></div>';
      if (glossary && glossary.length) {
        html += '<div class="detail-section"><h4>Glossário</h4>';
        for (var i = 0; i < glossary.length; i++) {
          var g = glossary[i];
          html += '<div class="kv-row"><span class="kv-label">' + g.term + '</span></div>';
          html += '<div class="kv-def">' + g.def + '</div>';
        }
        html += '</div>';
      }
      html += '</div>';

      captured.html = html;
      captured.fields = {
        name: name, ntype: ntype, summary: summary, status: status,
        score: score, explain: explain, whyItMatters: whyItMatters,
        realImpact: realImpact, glossary: glossary
      };
    } catch (err) {
      // mirror: try/catch swallows (console.error in SPA)
    }
  }

  return {
    showDetail: showDetail,
    getHtml: function() { return captured.html; },
    getFields: function() { return captured.fields; }
  };
}

// ------------------------------------------------------------------
// Canonical input fixtures
// ------------------------------------------------------------------
function fixtureNode(overrides) {
  var base = {
    id: 'n1',
    name: 'fixture-node',
    ntype: 'dim',
    desc: 'fixture description',
    score: 75
  };
  if (overrides) for (var k in overrides) base[k] = overrides[k];
  return base;
}

function fixtureBody(overrides) {
  var base = {
    title: 'Fixture Title',
    summary: 'Fixture summary',
    explanation: 'Fixture explanation',
    whyItMatters: 'Fixture why',
    realImpact: 'Fixture impact',
    glossary: [
      { term: 'G1', def: 'D1' },
      { term: 'G2', def: 'D2' }
    ],
    _sourceKey: 'dimData'
  };
  if (overrides) for (var k2 in overrides) base[k2] = overrides[k2];
  return base;
}

var SOURCE_KEYS = [
  'dimData', 'dataNodes', 'decisionTrees', 'actions', 'gates',
  'personas', 'couplings', 'outcomeRegistry', 'learningEvents'
];

// ------------------------------------------------------------------
// E23 validator — 10 properties per fixture
// ------------------------------------------------------------------
function validateE23(capturedHtml, capturedFields) {
  var issues = [];

  if (!capturedFields) {
    issues.push({ kind: 'no-fields', message: 'showDetail produced no fields (early return / exception)' });
    return issues;
  }
  var f = capturedFields;

  // (a) name non-empty string
  if (!isNonEmptyString(f.name)) {
    issues.push({ kind: 'empty-name', message: 'name must be non-empty string', value: f.name });
  }
  // (b) ntype is string
  if (!isString(f.ntype)) {
    issues.push({ kind: 'non-string-ntype', message: 'ntype must be string', value: f.ntype });
  }
  // (c) summary is string
  if (!isString(f.summary)) {
    issues.push({ kind: 'non-string-summary', message: 'summary must be string', value: f.summary });
  }
  // (d) explain is string
  if (!isString(f.explain)) {
    issues.push({ kind: 'non-string-explain', message: 'explain must be string', value: f.explain });
  }
  // (e) whyItMatters is string
  if (!isString(f.whyItMatters)) {
    issues.push({ kind: 'non-string-why', message: 'whyItMatters must be string', value: f.whyItMatters });
  }
  // (f) realImpact is string
  if (!isString(f.realImpact)) {
    issues.push({ kind: 'non-string-impact', message: 'realImpact must be string', value: f.realImpact });
  }
  // (g) glossary is array; entries have string term + def
  if (!Array.isArray(f.glossary)) {
    issues.push({ kind: 'non-array-glossary', message: 'glossary must be array', value: f.glossary });
  } else {
    for (var i = 0; i < f.glossary.length; i++) {
      var g = f.glossary[i];
      if (!isObjLit(g) || !isString(g.term) || !isString(g.def)) {
        issues.push({ kind: 'glossary-malformed', message: 'glossary entry needs string term+def', index: i, entry: g });
      }
    }
  }
  // (h) score is null or finite number
  if (f.score !== null && !isFiniteNumber(f.score)) {
    issues.push({ kind: 'invalid-score', message: 'score must be null or finite number', value: f.score });
  }
  // (i) status is string
  if (!isString(f.status)) {
    issues.push({ kind: 'non-string-status', message: 'status must be string', value: f.status });
  }
  // (j) html string cleanliness — no literal undefined/null leaks
  if (hasUndefinedLeakInHTML(capturedHtml)) {
    issues.push({ kind: 'html-undefined-leak', message: 'html contains literal undefined/null token', html: capturedHtml.substring(0, 200) });
  }
  // (k) XSS surface — no raw <script> / <style> / javascript: / event-handler tags
  if (hasXSSPattern(capturedHtml)) {
    issues.push({ kind: 'xss-leak', message: 'html contains raw script/style/event-handler attribute from data', html: capturedHtml.substring(0, 200) });
  }

  return issues;
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;

  console.log('========== E23 PANEL RENDERING SAFETY INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // ----- BASELINE: 9 source keys × 1 canonical healthy fixture -----
  console.log('--- BASELINE: 9 source keys × canonical healthy fixture ---');
  for (var i = 0; i < SOURCE_KEYS.length; i++) {
    var sk = SOURCE_KEYS[i];
    var body = fixtureBody({ _sourceKey: sk });
    var node = fixtureNode({ id: 'n-' + sk, ntype: sk });
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(node);
    var issues = validateE23(sd.getHtml(), sd.getFields());
    total++;
    if (issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + sk + ': 0 issues');
    } else {
      failed++;
      console.log('  [FAIL] ' + sk + ': ' + issues.length + ' issues');
      for (var j = 0; j < issues.length; j++) {
        console.log('    - ' + issues[j].kind + ': ' + issues[j].message);
      }
    }
  }

  // ----- BASELINE: edge cases -----
  console.log('');
  console.log('--- BASELINE: edge-case fixtures ---');
  var edges = [
    { name: 'empty body, node has labels', node: fixtureNode(), body: {} },
    { name: 'empty glossary array', node: fixtureNode(), body: fixtureBody({ glossary: [] }) },
    { name: 'glossary key absent', node: fixtureNode(), body: fixtureBody({ glossary: undefined }) },
    { name: 'node without id', node: fixtureNode({ id: undefined }), body: fixtureBody() },
    { name: 'node without score', node: fixtureNode({ score: undefined }), body: fixtureBody() },
    { name: 'node with status', node: fixtureNode({ status: 'active' }), body: fixtureBody() }
  ];
  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    var edgeBody = edge.body;
    var edgeSd = makeShowDetail({ getRichBody: function() { return edgeBody; } });
    edgeSd.showDetail(edge.node);
    var edgeIssues = validateE23(edgeSd.getHtml(), edgeSd.getFields());
    total++;
    if (edgeIssues.length === 0) {
      passed++;
      console.log('  [PASS] ' + edge.name);
    } else {
      failed++;
      console.log('  [FAIL] ' + edge.name + ': ' + edgeIssues.length + ' issues');
      for (var ei = 0; ei < edgeIssues.length; ei++) {
        console.log('    - ' + edgeIssues[ei].kind + ': ' + edgeIssues[ei].message);
      }
    }
  }

  // ----- ADVERSARIAL MUTANTS (T1-T7) -----
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');

  function recordAdversarial(label, fn, expectedMinCount) {
    expectedMinCount = expectedMinCount || 1;
    total++;
    var issues = fn();
    var c = issues.length;
    var ctrl = label.indexOf('T7') === 0;
    if (ctrl) {
      if (c === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + c + ' issues (CONTROL BROKEN)');
        for (var i = 0; i < issues.length; i++) {
          console.log('    - ' + issues[i].kind + ': ' + issues[i].message);
        }
      }
    } else {
      if (c >= expectedMinCount) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + c + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + c + ' issues caught (expected ≥' + expectedMinCount + ')');
        for (var k = 0; k < issues.length; k++) {
          console.log('    - ' + issues[k].kind + ': ' + issues[k].message);
        }
      }
    }
  }

  // T1: malicious body.summary — XSS surface (raw concatenate into innerHTML)
  recordAdversarial('T1 XSS via body.summary', function() {
    var body = fixtureBody({
      summary: '<script>alert(1)</script>',
      explanation: '<img src=x onerror=alert(2)>',
      whyItMatters: 'Check out javascript:alert(3)'
    });
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(fixtureNode());
    return validateE23(sd.getHtml(), sd.getFields());
  }, 1);

  // T2: object title — body.title is an object, name becomes non-string
  recordAdversarial('T2 object title', function() {
    var body = fixtureBody({ title: { x: 1 } });
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(fixtureNode());
    return validateE23(sd.getHtml(), sd.getFields());
  }, 1);

  // T3: array title — body.title is an array, name becomes object (arrays are objects)
  recordAdversarial('T3 array title', function() {
    var body = fixtureBody({ title: ['a', 'b'] });
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(fixtureNode());
    return validateE23(sd.getHtml(), sd.getFields());
  }, 1);

  // T4: malformed glossary entries — leaks undefined in HTML
  //     (omit null to avoid throw that hides the rest of the malformed entries)
  recordAdversarial('T4 malformed glossary', function() {
    var body = fixtureBody({
      glossary: [
        { term: 'G1', def: 'D1' },
        { term: 'G2' },         // missing def → undefined leak
        { def: 'D3' },          // missing term → undefined leak
        'not-an-object'          // not an object at all
      ]
    });
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(fixtureNode());
    return validateE23(sd.getHtml(), sd.getFields());
  }, 4);

  // T5: null n — early return; no fields populated
  recordAdversarial('T5 null n', function() {
    var sd = makeShowDetail({ getRichBody: function() { return fixtureBody(); } });
    sd.showDetail(null);
    return validateE23(sd.getHtml(), sd.getFields());
  }, 1);

  // T6: NaN score — typeof NaN === 'number' but isFinite(NaN) is false
  recordAdversarial('T6 NaN score', function() {
    var node = fixtureNode({ score: NaN });
    var sd = makeShowDetail({ getRichBody: function() { return fixtureBody(); } });
    sd.showDetail(node);
    return validateE23(sd.getHtml(), sd.getFields());
  }, 1);

  // T7: control — clean healthy input
  recordAdversarial('T7 control (clean)', function() {
    var body = fixtureBody();
    var sd = makeShowDetail({ getRichBody: function() { return body; } });
    sd.showDetail(fixtureNode());
    return validateE23(sd.getHtml(), sd.getFields());
  });

  console.log('');
  console.log('========== E23 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
