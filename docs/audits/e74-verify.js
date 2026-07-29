// e74-verify.js — viewLabel(v) chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3404-3406 (viewLabel — maps a view key
// to its pt-br display label, with fallback to the input verbatim).
//
// Invariants (4 targeted sub-checks of 11 keys + fallback):
//   1a. 'red-flags' → 'Alertas vermelhos'.
//   1b. 'risk'      → 'Caderno de riscos'.
//   1c. 'gates'     → 'Travas de aprovação'.
//   1d. fallback (`|| v`) — unknown key returns input verbatim.
//
// Inverted mutant pattern: each fixture pre-seeds `v` with a view key.
// Healthy code returns the matching label or fallback. Broken mutant
// drops a mapping → falls through → fixture reports issue → runner
// says PASS (BASELINE) or FAIL (REPAIRED).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — view key string
// ============================================================
var v = '';
function getV() { return v; }
function setV(val) { v = val; }

function resetEnv() { v = ''; }

// ============================================================
// Mirror — viewLabel() (HEALTHY, faithful to L3404-3406)
// ============================================================
function healthyViewLabel() {
  return {overview:'Visão geral', 'red-flags':'Alertas vermelhos',
          couplings:'Conexões entre frentes', gates:'Travas de aprovação',
          personas:'Pessoas-chave', flow:'Caminho do sinal à ação',
          risk:'Caderno de riscos', timeline:'Cronograma 18 meses',
          scenario:'Cenários políticos',
          cascade:'Como uma crise vira desastre'}[v] || v;
}

// ============================================================
// Broken mutants — 4 boolean flags.
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyViewLabel();

    var table = {overview:'Visão geral'};
    if (!opts.dropInv1a) table['red-flags'] = 'Alertas vermelhos';
    if (!opts.dropInv1b) table.risk = 'Caderno de riscos';
    if (!opts.dropInv1c) table.gates = 'Travas de aprovação';
    table.couplings = 'Conexões entre frentes';
    table.personas = 'Pessoas-chave';
    table.flow = 'Caminho do sinal à ação';
    table.timeline = 'Cronograma 18 meses';
    table.scenario = 'Cenários políticos';
    table.cascade = 'Como uma crise vira desastre';

    var mapped = table[v];
    if (mapped !== undefined) return mapped;
    if (opts.dropInv1d) return undefined;
    return v;
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }),             target: 'F1', drop: "'red-flags' mapping (1a)" },
  { id: 'T2', fn: makeBF({ dropInv1b: true }),             target: 'F2', drop: "'risk' mapping (1b)" },
  { id: 'T3', fn: makeBF({ dropInv1c: true }),             target: 'F3', drop: "'gates' mapping (1c)" },
  { id: 'T4', fn: makeBF({ dropInv1d: true }),             target: 'F4', drop: "fallback || v (1d)" }
];

// ============================================================
// Fixtures — sourced from e74-fixtures.js
// ============================================================
var fx = require('./e74-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: resetEnv,
  setV: setV,
  getV: getV
});

var healthyWrappedViewLabel = function () {
  return healthyViewLabel();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E74 — viewLabel() chrome hook invariant ===');
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-viewLabel, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  resetEnv();
  var issues = fix.fn(healthyWrappedViewLabel);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy viewLabel) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);