// e51-fixtures.js — per-function probes for E51 validateDataLayer (subset 6)
//
// Module pattern: exports `makeFixtures(deps)` returning the ALL_FIXTURES array.
// Each fixture is a closure that captures `deps`, so it can mutate host
// globals (ID_PREFIXES, SVG_ID_GENERATOR, SVG_ID_TO_LAYER, tours) via the
// setter functions supplied by the host. The host (e51-verify.js) defines
// those setters against its module-scope `var` bindings — which means
// fixture mutations propagate to the runner, healthyValidateDataLayer, and
// mutants.
//
// Fixtures (F0..F13):
//   F0  — healthy control
//   F1  — ID_PREFIXES = [] (empty array) → T1 (drop 16a)
//   F2  — ID_PREFIXES entry missing 'owner' → T2 (drop 16b)
//   F3  — ID_PREFIXES with duplicate prefix → T3 (drop 16c)
//   F4  — ID_PREFIXES entry.generator='phantom' (not in SVG_ID_GENERATOR) → T4 (drop 16d)
//   F5  — ID_PREFIXES entry with prefix 'X' not in SVG_ID_TO_LAYER → T5 (drop 16e)
//   F6  — ID_PREFIXES entry.generator returns wrong prefix → T6 (drop 16f)
//   F7  — tour missing 'name' → T7 (drop 17a)
//   F8  — step missing 'desc' → T8 (drop 17b)
//   F9  — two tours with same id → T9 (drop 17c)
//   F10 — tour with 0 steps → T10 (drop 17d)
//   F11 — tour.duration='2 hours' → T11 (drop 17h)
//   F12 — step.action_set.view='badview' → T12 (drop 17f+17g)
//   F13 — step.nodeId='PHANTOM_X' (unresolvable) → T13 (drop 18)
//
// Note on structurally unreachable mutants:
//   T14 (dropNodeIdShape18) — would drop the empty-string check on step.nodeId
//   before cross-ref. But the cross-ref check (resolveIdLayer) also returns
//   null for empty/non-string IDs, so the shape check is subsumed. OMITTED.
//
// 13 mutants × 1 target fixture + 14 controls = 27 reports.
'use strict';

module.exports.makeFixtures = function (deps) {
  // ============================================================
  // F0 — healthy control (no mutation; relies on resetEnv's healthy defaults)
  // ============================================================
  function runF0_healthyControl(renderFn) {
    deps.resetEnv();
    var result = renderFn();
    var issues = [];
    if (!result.ok) {
      issues.push('F0 healthy-control violated — expected ok=true, got ok=false (issues=' + JSON.stringify(result.issues) + ')');
    }
    return issues;
  }

  // ============================================================
  // F1 — ID_PREFIXES = [] (empty array) — probes T1 (drop 16a)
  // ============================================================
  function runF1_idPrefixesEmpty(renderFn) {
    deps.resetEnv();
    deps.setIDPrefixes([]);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F1 ID_PREFIXES-empty violated — expected ok=false (ID_PREFIXES=[]), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F2 — ID_PREFIXES entry missing 'owner' — probes T2 (drop 16b)
  // ============================================================
  function runF2_idPrefixesMissingField(renderFn) {
    deps.resetEnv();
    deps.corruptIDPrefixEntry(0, { owner: '' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F2 ID_PREFIXES-missing-field violated — expected ok=false (entry[0].owner empty), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F3 — ID_PREFIXES with duplicate prefix — probes T3 (drop 16c)
  // ============================================================
  function runF3_idPrefixesDuplicate(renderFn) {
    deps.resetEnv();
    var prefixes = deps.getIDPrefixes();
    // Clone first entry and append as duplicate of 'D'.
    prefixes.push({
      prefix: 'D',
      owner: 'dupOwner',
      generator: 'data',
      layer: 'framework'
    });
    deps.setIDPrefixes(prefixes);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F3 ID_PREFIXES-duplicate-prefix violated — expected ok=false (duplicate "D"), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F4 — ID_PREFIXES entry.generator='phantomGen' (not in factories) — T4
  // ============================================================
  function runF4_idPrefixesPhantomGenerator(renderFn) {
    deps.resetEnv();
    deps.corruptIDPrefixEntry(0, { generator: 'phantomGen' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F4 ID_PREFIXES-phantom-generator violated — expected ok=false (entry[0].generator=phantomGen), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F5 — ID_PREFIXES entry.prefix='D' but layer='wronglayer' (mismatch) — T5
  // Design: prefix is in SVG_ID_TO_LAYER but maps to a DIFFERENT layer than
  // the entry declares. This case is caught ONLY by 16e (prefix↔layer check)
  // and NOT by 16f (factory output shape) — because the factory 'data'
  // returns 'D-TEST' which DOES start with prefix 'D'. So dropping 16e lets
  // the bug slip through silently.
  // ============================================================
  function runF5_idPrefixesPrefixNotInLayerMap(renderFn) {
    deps.resetEnv();
    deps.corruptIDPrefixEntry(0, { prefix: 'D', layer: 'wronglayer' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F5 ID_PREFIXES-prefix-not-in-layer-map violated — expected ok=false (entry[0].layer=wronglayer, SVG_ID_TO_LAYER[D]=framework), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F6 — ID_PREFIXES entry.generator returns wrong prefix — T6
  // ============================================================
  function runF6_idPrefixesFactoryWrongOutput(renderFn) {
    deps.resetEnv();
    // Corrupt the 'coupling' factory to return "XXX-" + i instead of "C-" + i.
    var gen = deps.getSVGIdGenerator();
    gen.coupling = function (i) { return 'XXX-' + i; };
    deps.setSVGIdGenerator(gen);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F6 ID_PREFIXES-factory-wrong-output violated — expected ok=false (coupling factory returns XXX-0, not C-0), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F7 — tour missing 'name' — probes T7 (drop 17a)
  // ============================================================
  function runF7_tourMissingName(renderFn) {
    deps.resetEnv();
    deps.corruptTourEntry(0, { name: '' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F7 tour-missing-name violated — expected ok=false (tour[0].name empty), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F8 — step missing 'desc' — probes T8 (drop 17b)
  // ============================================================
  function runF8_stepMissingDesc(renderFn) {
    deps.resetEnv();
    deps.corruptTourStep(0, 0, { desc: '' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F8 step-missing-desc violated — expected ok=false (tour[0].steps[0].desc empty), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F9 — two tours with same id — probes T9 (drop 17c)
  // ============================================================
  function runF9_tourDuplicateId(renderFn) {
    deps.resetEnv();
    var t = deps.getTours();
    t.push({
      id: 'tour-overview', // same id as first tour
      name: 'Tour Overview Duplicate',
      duration: '2 min',
      description: 'Duplicate id tour',
      steps: [
        { title: 'Dup Step', desc: 'Dup desc', nodeId: 'D-9', action_set: { view: 'overview', layer: 'framework' } }
      ]
    });
    deps.setTours(t);
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F9 tour-duplicate-id violated — expected ok=false (duplicate "tour-overview"), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F10 — tour with 0 steps — probes T10 (drop 17d)
  // ============================================================
  function runF10_tourZeroSteps(renderFn) {
    deps.resetEnv();
    deps.corruptTourEntry(0, { steps: [] });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F10 tour-zero-steps violated — expected ok=false (tour[0].steps=[]), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F11 — tour.duration='2 hours' — probes T11 (drop 17h)
  // ============================================================
  function runF11_tourDurationBadFormat(renderFn) {
    deps.resetEnv();
    deps.corruptTourEntry(0, { duration: '2 hours' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F11 tour-duration-bad-format violated — expected ok=false (tour[0].duration="2 hours" doesn\'t match regex), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F12 — step.action_set.view='badview' — probes T12 (drop 17f+17g)
  // ============================================================
  function runF12_stepActionSetBadView(renderFn) {
    deps.resetEnv();
    deps.corruptActionSet(0, 0, { view: 'badview' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F12 step-action-set-bad-view violated — expected ok=false (step[0].action_set.view="badview" not in VIEW_IDS), got ok=true');
    }
    return issues;
  }

  // ============================================================
  // F13 — step.nodeId='PHANTOM_X' — probes T13 (drop 18)
  // ============================================================
  function runF13_stepNodeIdPhantom(renderFn) {
    deps.resetEnv();
    deps.corruptTourStep(0, 0, { nodeId: 'PHANTOM_X' });
    var result = renderFn();
    var issues = [];
    if (result.ok) {
      issues.push('F13 step-nodeId-phantom violated — expected ok=false (step[0].nodeId="PHANTOM_X" does not resolve to any known layer), got ok=true');
    }
    return issues;
  }

  return [
    { id: 'F0',  fn: runF0_healthyControl,                  target_id: null  },
    { id: 'F1',  fn: runF1_idPrefixesEmpty,                 target_id: 'T1'  },
    { id: 'F2',  fn: runF2_idPrefixesMissingField,          target_id: 'T2'  },
    { id: 'F3',  fn: runF3_idPrefixesDuplicate,              target_id: 'T3'  },
    { id: 'F4',  fn: runF4_idPrefixesPhantomGenerator,      target_id: 'T4'  },
    { id: 'F5',  fn: runF5_idPrefixesPrefixNotInLayerMap,   target_id: 'T5'  },
    { id: 'F6',  fn: runF6_idPrefixesFactoryWrongOutput,    target_id: 'T6'  },
    { id: 'F7',  fn: runF7_tourMissingName,                 target_id: 'T7'  },
    { id: 'F8',  fn: runF8_stepMissingDesc,                 target_id: 'T8'  },
    { id: 'F9',  fn: runF9_tourDuplicateId,                 target_id: 'T9'  },
    { id: 'F10', fn: runF10_tourZeroSteps,                  target_id: 'T10' },
    { id: 'F11', fn: runF11_tourDurationBadFormat,          target_id: 'T11' },
    { id: 'F12', fn: runF12_stepActionSetBadView,           target_id: 'T12' },
    { id: 'F13', fn: runF13_stepNodeIdPhantom,              target_id: 'T13' }
  ];
};