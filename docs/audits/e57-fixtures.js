// e57-fixtures.js — per-function probes for E57 onSearch
//
// Inverted mutant-detection: each fixture PRE-SEEDS DOM stubs or query. The
// healthy mirror performs the operation and OVERWRITES the sentinel with the
// expected post-call value. The broken mutant drops the operation → sentinel
// survives OR expected value never materializes → fixture reports issue →
// runner says PASS (BASELINE) or FAIL (REPAIRED).
//
// Fixtures (F0..F4):
//   F0 — healthy control: query='abc', label-match-node 'foo-bar' (label has
//        "abc") + id-match-node 'abc-qux' (id has "abc") both get opacity='1';
//        no-match 'xyz-zzz' gets '0.2'.
//   F1 — query='' (empty string). All nodes pre-seeded opacity='OLD_UNTOUCHED'.
//        Healthy early-return → all OLD_UNTOUCHED intact → 0 issues. T1 (drop
//        guard) iterates with q='' → every string includes '' → all match →
//        at least one node overwritten to '1' (or '0.2') → issue raised.
//   F2 — query='abc', all 3 nodes pre-seeded with role-suffixed stale sentinels
//        (STALE_LABEL, STALE_ID, STALE_NONE). Healthy iterates and writes
//        '1'/'1'/'0.2' → sentinels overwritten. T2 (drop QSA) doesn't iterate
//        → all 3 stale sentinels survive → 3 issues.
//   F3 — query='abc', no pre-seed. Healthy writes label-match opacity='1'
//        AND id-match opacity='1'. T3 (drop match → match=false default)
//        writes '0.2' to both → F3 expects '1' → 2 issues.
//   F4 — query='abc', label-match and id-match pre-seeded with OLD_VAL_*. T4
//        (drop opacity write) iterates + computes match but doesn't write →
//        both still OLD_VAL_* → F4 expects '1' → 2 issues.
//   (NOTE: T1 in BASELINE drops guard; with default query='abc' the guard
//    would have allowed, so T1 in F2/F3/F4 is identical to healthy and is not
//    detected — which is the desired behaviour.)
//
// 4 mutants × 1 target fixture + 4 controls = 8 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control: all 4 op groups perform correctly.
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    renderFn();
    var issues = [];
    var labelMatch = deps.getMatchNodeLabel();
    var idMatch    = deps.getMatchNodeId();
    var noMatch    = deps.getNonMatchNode();

    if (labelMatch.style.opacity !== '1') {
      issues.push('F0 label-match violated — expected "1" for id="foo-bar" (label matches), got ' + JSON.stringify(labelMatch.style.opacity));
    }
    if (idMatch.style.opacity !== '1') {
      issues.push('F0 id-match violated — expected "1" for id="abc-qux" (id matches), got ' + JSON.stringify(idMatch.style.opacity));
    }
    if (noMatch.style.opacity !== '0.2') {
      issues.push('F0 no-match violated — expected "0.2" for id="xyz-zzz" (no match), got ' + JSON.stringify(noMatch.style.opacity));
    }
    return issues;
  }

  // ============================================================
  // F1 — query='' (empty). All nodes pre-seed 'OLD_UNTOUCHED' → T1 (drop 1a).
  // Healthy early-returns → all stale intact → 0 issues.
  // T1 (drop guard) iterates with q='' → every string includes '' → all
  // match → at least one node overwritten → issue raised.
  // ============================================================
  function runF1_guardDropped(renderFn) {
    deps.resetEnv();
    deps.setQuery('');
    var nodes = deps.getNodeGroups();
    nodes.forEach(function (g) { g.style.opacity = 'OLD_UNTOUCHED'; });
    renderFn();
    var issues = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].style.opacity !== 'OLD_UNTOUCHED') {
        issues.push('F1 guard-violated — node id="' + deps.getNodeId(i) + '" opacity was overwritten from "OLD_UNTOUCHED" to "' + nodes[i].style.opacity + '" despite empty query (guard dropped — T1)');
        return issues;
      }
    }
    return issues;
  }

  // ============================================================
  // F2 — query='ABC' (uppercase). No pre-seed. T2 (drop 1b — lowercase +
  // QSA). The query has uppercase letters so dropping .toLowerCase() yields
  // q='ABC' against the lowercase id/label — match=false for every node.
  // Healthy applies .toLowerCase() → q='abc' → label-match & id-match
  // get opacity='1', no-match gets '0.2'.
  // Broken T2 (no lowercase) → all 3 nodes get opacity='0.2'.
  // Detection: match nodes got '0.2' instead of '1'.
  // ============================================================
  function runF2_noLowercase(renderFn) {
    deps.resetEnv();
    deps.setQuery('ABC');
    renderFn();
    var issues = [];
    var labelMatch = deps.getMatchNodeLabel();
    var idMatch    = deps.getMatchNodeId();
    if (labelMatch.style.opacity !== '1') {
      issues.push('F2 lowercase-violated — label-match-node (id="foo-bar") expected "1" (healthy lowercase matches label), got ' + JSON.stringify(labelMatch.style.opacity) + ' (lowercase dropped — T2)');
    }
    if (idMatch.style.opacity !== '1') {
      issues.push('F2 lowercase-violated — id-match-node (id="abc-qux") expected "1" (healthy lowercase matches id), got ' + JSON.stringify(idMatch.style.opacity));
    }
    return issues;
  }

  // ============================================================
  // F3 — query='abc', no pre-seed → T3 (drop 1c).
  // Healthy writes label-match opacity='1' AND id-match opacity='1'.
  // T3 (drop match → match=false default) writes '0.2' to both → 2 issues.
  // ============================================================
  function runF3_matchMissing(renderFn) {
    deps.resetEnv();
    deps.setQuery('abc');
    renderFn();
    var issues = [];
    var labelMatch = deps.getMatchNodeLabel();
    var idMatch    = deps.getMatchNodeId();
    if (labelMatch.style.opacity !== '1') {
      issues.push('F3 match-violated — label-match-node (id="foo-bar") expected "1", got ' + JSON.stringify(labelMatch.style.opacity) + ' (match computation dropped — T3)');
    }
    if (idMatch.style.opacity !== '1') {
      issues.push('F3 match-violated — id-match-node (id="abc-qux") expected "1", got ' + JSON.stringify(idMatch.style.opacity));
    }
    return issues;
  }

  // ============================================================
  // F4 — query='abc', label-match + id-match pre-seeded OLD_VAL_* → T4 (drop 1d).
  // Healthy writes '1' to both. T4 (drop opacity write) iterates + computes
  // match correctly but doesn't write → both stay OLD_VAL_* → 2 issues.
  // ============================================================
  function runF4_opacityNotWritten(renderFn) {
    deps.resetEnv();
    deps.setQuery('abc');
    var labelMatch = deps.getMatchNodeLabel();
    var idMatch    = deps.getMatchNodeId();
    labelMatch.style.opacity = 'OLD_VAL_LABEL';
    idMatch.style.opacity    = 'OLD_VAL_ID';
    renderFn();
    var issues = [];
    if (labelMatch.style.opacity !== '1') {
      issues.push('F4 opacity-write-violated — label-match-node expected "1", got ' + JSON.stringify(labelMatch.style.opacity) + ' (opacity write dropped — T4)');
    }
    if (idMatch.style.opacity !== '1') {
      issues.push('F4 opacity-write-violated — id-match-node expected "1", got ' + JSON.stringify(idMatch.style.opacity));
    }
    return issues;
  }

  return [
    { id: 'F0', fn: runF0_healthyControl,    target_id: null },
    { id: 'F1', fn: runF1_guardDropped,      target_id: 'T1' },
    { id: 'F2', fn: runF2_noLowercase,       target_id: 'T2' },
    { id: 'F3', fn: runF3_matchMissing,      target_id: 'T3' },
    { id: 'F4', fn: runF4_opacityNotWritten, target_id: 'T4' }
  ];
};
