// e57-verify.js — onSearch() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4020-4030 (onSearch — chrome-only stub).
// Iterates .node-group elements and toggles their style.opacity to '1' (match)
// or '0.2' (no match). Substring match against id and label.
//
// Invariants (4 sub-checks):
//   1a. Query guard: !query || query.length < 2 → early-return no-op.
//   1b. querySelectorAll('.node-group') collection + query.toLowerCase().
//   1c. Per-node id/label match computation
//       (id.toLowerCase().includes(q) || label.includes(q)).
//   1d. style.opacity write ('1' for match, '0.2' for no-match).
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs or query. Healthy
// performs the operation → sentinels overwritten / expected state observed.
// Broken mutant drops the operation → sentinel survives / unexpected state
// → fixture reports issue → runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// qsaMap is mutated in-place by resetEnv() so the lazy
// document.querySelectorAll('.node-group') lookup always sees the live
// nodeGroups reference (mirrors the E56 in-place elementMap pattern).
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock env — query, .node-group stubs, qsaMap (in-place)
// ============================================================

function makeNodeStub(id, label) {
  return {
    _dataId: id,
    getAttribute: function (name) {
      if (name === 'data-id') return id;
      return '';
    },
    textContent: label || '',
    style: { opacity: '' }
  };
}

var query = '';
var nodeGroups = null;

// qsaMap is mutated in place by resetEnv() so the lazy
// document.querySelectorAll('.node-group') lookup always sees the live
// nodeGroups reference. No reassignment needed.
var qsaMap = { '.node-group': null };

function setQuery(v)              { query = v; }
function getQuery()               { return query; }
function getNodeGroups()          { return nodeGroups; }
function getMatchNodeLabel()      { return nodeGroups[0]; }
function getMatchNodeId()         { return nodeGroups[1]; }
function getNonMatchNode()        { return nodeGroups[2]; }
function getNodeId(i)             { return nodeGroups[i]._dataId; }

function resetEnv() {
  query = 'abc';
  // foo-bar: label "contains abc here" → label.includes('abc')=true
  // abc-qux: id   "abc-qux"            → id.toLowerCase().includes('abc')=true
  // xyz-zzz: id+label no 'abc'         → match=false
  nodeGroups = [
    makeNodeStub('foo-bar', 'contains abc here'),
    makeNodeStub('abc-qux', 'unrelated text'),
    makeNodeStub('xyz-zzz', 'nothing relevant')
  ];
  qsaMap['.node-group'] = nodeGroups;
}

global.document = {
  querySelectorAll: function (selector) {
    return qsaMap[selector] || [];
  }
};

// ============================================================
// Mirror — onSearch() (HEALTHY, simplified)
//
// Faithful to L4020-4030 invariants for the 4 sub-checks above. Substring
// match against id/label, opacity write '1'/'0.2', 'data-id' read via
// getAttribute.
// ============================================================
function healthyOnSearch(queryArg) {
  if (!queryArg || queryArg.length < 2) return;
  var q = queryArg.toLowerCase();
  document.querySelectorAll('.node-group').forEach(function (g) {
    var id = g.getAttribute('data-id') || '';
    var label = (g.textContent || '').toLowerCase();
    var match = id.toLowerCase().includes(q) || label.includes(q);
    g.style.opacity = match ? '1' : '0.2';
  });
}

// Mirror wrapper (parameterless — fixtures call renderFn() with no args,
// mirroring the parameterless arg in the source when bound to UI events).
var healthyWrappedOnSearch = function () {
  return healthyOnSearch(query);
};

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// When MIRROR_REPAIRED, delegate to healthyOnSearch(query) so the test runs
// against the trusted implementation and no issue is raised.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyOnSearch(query);

    // Default q = raw query so when dropInv1b drops lowercase, the raw
    // (possibly uppercase) query flows into the match expression. With q=''
    // every string.includes('') is true and T2 collapses to "match all",
    // indistinguishable from healthy.
    var q = query;
    if (!opts.dropInv1a) {
      if (!query || query.length < 2) return;
    }
    if (!opts.dropInv1b) {
      q = query.toLowerCase();
    }
    document.querySelectorAll('.node-group').forEach(function (g) {
      var match;
      if (!opts.dropInv1c) {
        var id = g.getAttribute('data-id') || '';
        var label = (g.textContent || '').toLowerCase();
        match = id.toLowerCase().includes(q) || label.includes(q);
      } else {
        match = false;
      }
      if (!opts.dropInv1d) {
        g.style.opacity = match ? '1' : '0.2';
      }
    });
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'query guard (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'QSA + lowercase (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'match computation (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'opacity write (1d)' }
];

// ============================================================
// Fixtures — sourced from e57-fixtures.js via factory + deps
// ============================================================
var fx = require('./e57-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setQuery: setQuery,
  getNodeGroups: getNodeGroups,
  getMatchNodeLabel: getMatchNodeLabel,
  getMatchNodeId: getMatchNodeId,
  getNonMatchNode: getNonMatchNode,
  getNodeId: getNodeId
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E57 — onSearch() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-onSearch, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedOnSearch);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy onSearch) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
