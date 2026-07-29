// e96-verify.js — onSearch() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L4020-4030 (onSearch —
// filters nodes by id/label substring match).
//
// Invariants (3 sub-checks):
//   1a. Matching nodes get opacity '1'.
//   1b. Non-matching nodes get opacity '0.2'.
//   1c. Query < 2 chars: no opacity changes.
//
// 1 mutant × 1 target fixture + 2 controls = 3 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment
// ============================================================

var _nodes = {};  // id -> { opacity }

function resetEnv() {
  _nodes = {};
}

function seedNodes(nodes) {
  nodes.forEach(function (n) {
    _nodes[n.id] = { opacity: n.opacity !== undefined ? n.opacity : '1' };
  });
}

function getSnapshot() {
  var snap = {};
  Object.keys(_nodes).sort().forEach(function (id) {
    snap['nodeOpacity_' + id] = _nodes[id].opacity;
  });
  return snap;
}

// Fake DOM querySelectorAll result that acts like a real SVG DOM
function makeMockNodeGroup(id, text) {
  return {
    getAttribute: function (attr) {
      if (attr === 'data-id') return id;
      return null;
    },
    textContent: text,
    style: {
      _opacity: '1',
      get opacity() { return this._opacity; },
      set opacity(v) { this._opacity = v; _nodes[id] = { opacity: v }; }
    }
  };
}

var mockNodeGroups = [];  // live ref to mock node groups

global.document = {
  querySelectorAll: function (selector) {
    if (selector === '.node-group') return mockNodeGroups;
    return [];
  }
};

// ============================================================
// Healthy onSearch (L4020-4030)
// ============================================================
function healthyOnSearch(query) {
  try {
    if (!query || query.length < 2) return;
    var q = query.toLowerCase();
    mockNodeGroups.forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      var label = (g.textContent || '').toLowerCase();
      var match = id.toLowerCase().includes(q) || label.includes(q);
      g.style.opacity = match ? '1' : '0.2';
    });
  } catch (err) {
    // Silent
  }
}

// ============================================================
// Broken mutant — skips opacity='0.2' for non-matches
// (still applies opacity='1' to matches)
// ============================================================
function brokenOnSearch(query) {
  if (MIRROR_REPAIRED) return healthyOnSearch(query);
  try {
    if (!query || query.length < 2) return;
    var q = query.toLowerCase();
    mockNodeGroups.forEach(function (g) {
      var id = g.getAttribute('data-id') || '';
      var label = (g.textContent || '').toLowerCase();
      var match = id.toLowerCase().includes(q) || label.includes(q);
      // T1: only set opacity='1' for matches; non-matches keep default opacity.
      if (match) {
        g.style.opacity = '1';
      }
      // Missing: else branch with g.style.opacity = '0.2'
    });
  } catch (err) {
    // Silent
  }
}

var MUTANTS = [
  { id: 'T1', fn: brokenOnSearch, target: 'F0', drop: 'non-match opacity=0.2 (1b)' }
];

// ============================================================
// Fixtures
// ============================================================
var fx = require('./e96-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  seedNodes: seedNodes,
  getSnapshot: getSnapshot
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E96 — onSearch() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

MUTANTS.forEach(function (mutant) {
  resetEnv();
  // Seed 3 node-groups
  mockNodeGroups = [
    makeMockNodeGroup('S1', 'FX Signal'),
    makeMockNodeGroup('S2', 'Lithium Price'),
    makeMockNodeGroup('S3', 'BNDES Subsidy')
  ];
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

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  mockNodeGroups = [
    makeMockNodeGroup('S1', 'FX Signal'),
    makeMockNodeGroup('S2', 'Lithium Price'),
    makeMockNodeGroup('S3', 'BNDES Subsidy')
  ];
  var issues = fix.fn(healthyOnSearch);
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
