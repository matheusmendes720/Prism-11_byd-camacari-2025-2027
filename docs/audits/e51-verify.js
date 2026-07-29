// e51-verify.js — validateDataLayer() chrome hook invariant (subset 6)
//
// Mirrors D3-PITCH-GRAPH.html L1006-1256 (validateDataLayer — E8 chrome,
// invariants 16, 17, 18). Closes the validateDataLayer chain.
//
//   16. ID_PREFIXES reservation table (E17) — 6 sub-checks:
//       16a. ID_PREFIXES is non-empty array
//       16b. Every entry has 4 required fields (prefix, owner, generator, layer)
//       16c. Prefix uniqueness (uses `in` not truthiness — index 0 is falsy)
//       16d. entry.generator must be a factory key in SVG_ID_GENERATOR
//       16e. entry.prefix in SVG_ID_TO_LAYER AND SVG_ID_TO_LAYER[prefix] === layer
//       16f. Factory output for sample: non-empty string, starts with prefix,
//            and has a suffix
//   17. Tours schema integrity (E18) — 7 sub-checks + 1 DOM badge:
//       17a. Tour required fields (id, name, duration, description)
//       17b. Step required fields (title, desc)
//       17c. Tour IDs unique globally (`in` not truthiness)
//       17d. ≥1 step per tour
//       17f. step.action_set.view ∈ VIEW_IDS (optional field)
//       17g. step.action_set.layer ∈ LAYER_IDS (optional field)
//       17h. Duration matches /^\d+\s+(?:s|min|m)$/
//       17i. DOM badge sync (#tour-selector-count) — NATURALLY SKIPPED in Node
//   18. Tour nodeId cross-reference (E19):
//       step.nodeId (when present) must resolve via resolveIdLayer() to a
//       non-null layer. Rejects "unscoped phantoms".
//
// Per-function grouping: each mutant targets ONE contract surface; each
// fixture probes ONE invariant. Pair-wise: mutant T_i should fail fixture F_i.
//
// OMITTED mutants (structurally unreachable / logically subsumed):
//   None.
//
// 13 mutants × 1 target fixture each + 14 controls (fixtures × healthy) =
// 13 + 14 = 27 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mirror module — owns mock env, healthy, and broken-mutant factory.
// Sibling file `e51-mirror.js` to keep this runner under the 500-line limit.
// ============================================================
var mirror = require('./e51-mirror.js');
var healthyValidateDataLayer = mirror.healthyValidateDataLayer;
var makeBF                   = mirror.makeBF;

// ============================================================
// Mutants — 13 broken bodies, one per target fixture
// ============================================================
var MUTANTS = [
  { id: 'T1',  fn: makeBF({ dropInv16a:     true }), target: 'F1',  drop: 'ID_PREFIXES array non-empty check (16a)' },
  { id: 'T2',  fn: makeBF({ dropInv16b:     true }), target: 'F2',  drop: 'ID_PREFIXES required-fields check (16b)' },
  { id: 'T3',  fn: makeBF({ dropInv16c:     true }), target: 'F3',  drop: 'ID_PREFIXES prefix-uniqueness check (16c)' },
  { id: 'T4',  fn: makeBF({ dropInv16d:     true }), target: 'F4',  drop: 'ID_PREFIXES generator-factory validity (16d)' },
  { id: 'T5',  fn: makeBF({ dropInv16e:     true }), target: 'F5',  drop: 'ID_PREFIXES prefix↔layer cross-check (16e)' },
  { id: 'T6',  fn: makeBF({ dropInv16f:     true }), target: 'F6',  drop: 'ID_PREFIXES factory-output shape (16f)' },
  { id: 'T7',  fn: makeBF({ dropInv17aTour: true }), target: 'F7',  drop: 'tours required-fields check (17a)' },
  { id: 'T8',  fn: makeBF({ dropInv17b:     true }), target: 'F8',  drop: 'tours steps required-fields check (17b)' },
  { id: 'T9',  fn: makeBF({ dropInv17c:     true }), target: 'F9',  drop: 'tours id-uniqueness check (17c)' },
  { id: 'T10', fn: makeBF({ dropInv17d:     true }), target: 'F10', drop: 'tours ≥1-step check (17d)' },
  { id: 'T11', fn: makeBF({ dropInv17h:     true }), target: 'F11', drop: 'tours duration regex (17h)' },
  { id: 'T12', fn: makeBF({ dropInv17fg:    true }), target: 'F12', drop: 'tours action_set view+layer chrome refs (17f+17g)' },
  { id: 'T13', fn: makeBF({ dropInv18:      true }), target: 'F13', drop: 'tour nodeId cross-reference (18)' }
];

// ============================================================
// Fixtures — sourced from e51-fixtures.js via factory + deps
// ============================================================
var fx = require('./e51-fixtures.js');
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv:               mirror.resetEnv,
  setIDPrefixes:          mirror.setIDPrefixes,
  getIDPrefixes:          mirror.getIDPrefixes,
  setSVGIdGenerator:      mirror.setSVGIdGenerator,
  getSVGIdGenerator:      mirror.getSVGIdGenerator,
  setSVGIdToLayer:        mirror.setSVGIdToLayer,
  getSVGIdToLayer:        mirror.getSVGIdToLayer,
  setTours:               mirror.setTours,
  getTours:               mirror.getTours,
  makeHealthyIDPrefixes:     mirror.makeHealthyIDPrefixes,
  makeHealthySVGIdGenerator: mirror.makeHealthySVGIdGenerator,
  makeHealthySVGIdToLayer:  mirror.makeHealthySVGIdToLayer,
  makeHealthyTours:          mirror.makeHealthyTours,
  corruptIDPrefixEntry:  mirror.corruptIDPrefixEntry,
  corruptTourEntry:       mirror.corruptTourEntry,
  corruptTourStep:        mirror.corruptTourStep,
  corruptActionSet:       mirror.corruptActionSet
});

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E51 — validateDataLayer() chrome hook invariant (subset 6) ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  mirror.resetEnv();
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-validateDataLayer, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  mirror.resetEnv();
  var issues = fix.fn(healthyValidateDataLayer);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy validateDataLayer) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
