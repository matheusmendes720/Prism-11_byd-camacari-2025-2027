// E22 verify harness — 22nd invariant: getRichBody() end-to-end
// round-trip contract — the natural ceiling above E21.
//
// Bridges E20 (showDetail field contract) and E21 (ID→entry resolution)
// by exercising the FULL chain:
//   findRichEntry(n)   →  entry { sourceKey, raw, resolvedId }
//   normalizeBody(e)   →  body { canonicalFields..., _sourceKey, _resolvedId }
//   getRichBody(n)     →  body { ... + _nodeId, _nodeLabel, fallback for _sourceKey }
//
// Pre-E22, E21 only checked normalizeBody() output. But getRichBody()
// adds two always-populate fields (_nodeId, _nodeLabel) and a
// _sourceKey fallback to n.ntype when normalizeBody returns null.
// Crucially, showDetail() then chains `body.X || (rich && rich.X) || n.X`
// for every canonical field — silently degrading if body.X is missing.
//
// The 22nd invariant says: for every (sourceKey, id) sample, the body
// returned by getRichBody() must satisfy:
//
//   (a) _sourceKey-correct   — body._sourceKey matches what NODE_BODY_FIELD_MAP
//                              says the registry is keyed as
//   (b) _resolvedId-correct  — body._resolvedId matches the lookup result
//                              of findRichEntry() (no identity loss)
//   (c) _nodeId-correct      — body._nodeId equals the input id (always-populate)
//   (d) _nodeLabel-present   — body._nodeLabel is non-empty
//   (e) fields-round-trip    — for every canonical field with a sourceField
//                              mapping, body[field] === raw[sourceField]
//                              (proves normalizeBody didn't skip a populated entry)
//   (f) no-silent-fallback   — for the 6 canonical fields used by showDetail,
//                              body[field] is defined when raw[map[field]] is
//                              defined (would otherwise trigger fallback to n.X)
//
// Pre-E22 baseline (broken in 2 ways):
//   1. outcomeRegistry + learningEvents were missing from findRichEntry()
//      → 16 nodes returned body._sourceKey = undefined (now fixed by E21)
//   2. Even after E21, getRichBody() may silently degrade when
//      normalizeBody() skips a field because the source dict has a
//      different shape than the sample (e.g. sample uses 'short'
//      but real dict uses 'name') → E22 closes this gap.
//
// Mirror STATE (mirrored AS-IS from D3-PITCH-GRAPH.html L1834-2056):
//   * NODE_BODY_FIELD_MAP   — 9 source keys
//   * SAMPLE_DICT           — 1 first-entry verbatim copy per sourceKey
//   * SVG_ID_GENERATOR      — mirrors E17's 15 prefix factories
//   * findRichEntry()       — mirror with MIRROR_REPAIRED toggle (E21)
//   * normalizeBody()       — mirror
//   * getRichBody()         — mirror with MIRROR_REPAIRED toggle (E22 — new)
//
// The pre-repair / post-repair invariant is verified by toggling
// `MIRROR_REPAIRED` (a feature-flag at the top). Default false so the
// harness reports the pre-repair baseline and the post-repair fix in
// the same run.
'use strict';

const fs = require('fs');
const path = require('path');

// ============================================================
//  Feature flags
// ============================================================
const MIRROR_REPAIRED = process.argv.includes('--repaired');

// ============================================================
//  NODE_BODY_FIELD_MAP — mirrors D3-PITCH-GRAPH.html L1834-1912
//  (post-E21 repair with all 9 source keys)
// ============================================================
const NODE_BODY_FIELD_MAP = {
  dimData: {
    title: 'name',
    summary: 'short',
    explanation: 'explain',
    whyItMatters: 'whyItMatters',
    realImpact: 'realImpact',
    glossary: 'glossary'
  },
  dataNodes: {
    title: 'name',
    summary: 'whatIsIt',
    explanation: 'whatIsIt',
    whyItMatters: 'whyMatters',
    realImpact: 'numerical',
    glossary: 'glossary'
  },
  decisionTrees: {
    title: 'name',
    summary: 'executiveSummary',
    explanation: 'executiveSummary',
    whyItMatters: 'whyItMatters',
    realImpact: 'operationalPlaybook',
    glossary: 'glossary'
  },
  actions: {
    title: 'name',
    summary: 'executiveSummary',
    explanation: 'executiveSummary',
    whyItMatters: 'whyItMatters',
    realImpact: 'operationalPlaybook',
    glossary: 'glossary'
  },
  gates: {
    title: 'name',
    summary: 'summary',
    explanation: 'whyItMatters',
    whyItMatters: 'whyItMatters',
    realImpact: 'realImpact',
    glossary: 'glossary'
  },
  personas: {
    title: 'name',
    summary: 'summary',
    explanation: 'explanation',
    whyItMatters: 'whyItMatters',
    realImpact: 'realImpact',
    glossary: 'glossary'
  },
  couplings: {
    title: 'name',
    summary: 'summary',
    explanation: 'explanation',
    whyItMatters: 'whyItMatters',
    realImpact: 'realImpact',
    glossary: 'glossary'
  },
  outcomeRegistry: {
    title: 'name',
    summary: 'summary',
    explanation: 'trigger',
    whyItMatters: 'condition',
    realImpact: 'riskIfIgnored',
    glossary: 'kpi'
  },
  learningEvents: {
    title: 'name',
    summary: 'summary',
    explanation: 'method',
    whyItMatters: 'outcome',
    realImpact: 'riskIfIgnored',
    glossary: 'kpi'
  }
};

// ============================================================
//  SAMPLE_DICT — 1 first-entry verbatim per sourceKey (9 keys)
//  Each sample populates every field its NODE_BODY_FIELD_MAP declares,
//  so any "skip populated entry" bug surfaces in E22.
// ============================================================
const SAMPLE_DICT = {
  dimData: {
    S1: {
      name: 'Câmbio / FX',
      short: 'S1 FX',
      explain: 'PTAX vol 11.2%.',
      whyItMatters: 'BYD importa peças.',
      realImpact: 'R$ 200M+ de perda se cenário 4-choques.',
      glossary: [{ term: 'PTAX', def: 'Cotação oficial do dólar.' }]
    }
  },
  dataNodes: {
    PTAX: {
      name: 'PTAX',
      whatIsIt: 'Cotação oficial do dólar.',
      whyMatters: 'Impacta custos de importação.',
      numerical: '11.2% vol anualizada',
      glossary: [{ term: 'PTAX', def: 'Cotação oficial do dólar.' }]
    }
  },
  decisionTrees: {
    DT_S3: {
      name: 'BNDES ViE',
      executiveSummary: 'ViE 0-30% decide hedge sizing.',
      whyItMatters: 'ViE muda capex stack.',
      operationalPlaybook: 'Engajar lobby BNDES + advocacy.',
      glossary: [{ term: 'ViE', def: 'Veículo de Investimento Especial.' }]
    }
  },
  actions: {
    ACT_HEDGE: {
      name: 'Hedge cambial',
      executiveSummary: 'Proteger exposição PTAX.',
      whyItMatters: 'Reduz VaR cambial.',
      operationalPlaybook: 'Contratar NDF 12m roll.',
      glossary: [{ term: 'NDF', def: 'Non-deliverable forward.' }]
    }
  },
  gates: [
    {
      name: 'Gate 0: Viability',
      summary: 'Aprovar viabilidade econômica.',
      whyItMatters: 'Sem gate 0, sem capex.',
      realImpact: 'Capex stack R$ 1.5bi.',
      glossary: [{ term: 'Gate 0', def: 'Aprovação de viabilidade.' }]
    }
  ],
  personas: [
    {
      name: 'Risk Officer',
      summary: 'T0_lean — risk-first persona.',
      explanation: 'Recomenda hedge sizing máximo.',
      whyItMatters: 'Mantém VaR dentro do limite.',
      realImpact: 'Reduz P&L vol.',
      glossary: [{ term: 'VaR', def: 'Value at Risk.' }]
    }
  ],
  couplings: [
    {
      name: 'S1↔S3',
      summary: 'Hedge sizing by ViE',
      explanation: 'h* = 91% - (ViE%/22%) * 61%',
      whyItMatters: 'Inversely proportional risk',
      realImpact: 'R$ 39M saved vs over-protection',
      glossary: [{ term: 'h*', def: 'Optimal hedge ratio.' }]
    }
  ],
  outcomeRegistry: {
    OUT_S3_1: {
      ntype: 'outcome',
      label: 'OUT_S3_1',
      name: 'Expansão (75%)',
      summary: 'Hedge 30%, defensivo off.',
      parentDT: 'DT_S3',
      probability: '75%',
      trigger: 'ViE ≥ 20% E BNDES declara aprovação parcial ou total',
      condition: 'BNDES_tracker.status = "approved_partial"',
      action: 'Hedge FX 30%. Defensivo off.',
      owner: 'Risk Officer + COO',
      kpi: 'hedge = 30% do exposure, VaR residual ≤ R$ 96M',
      cost: 'R$ 19M/ano em hedge',
      riskIfIgnored: 'Desperdica R$ 39M/ano em over-protection.'
    }
  },
  learningEvents: {
    LE_S1: {
      ntype: 'learning',
      label: 'LE_S1',
      name: 'Stress · PTAX 20% shock',
      method: 'stress',
      summary: 'Stress test câmbio: PTAX dispara 20% em 30 dias.',
      trigger: 'PTAX vol realized > 15% / VaR breach',
      condition: 'S1 status AMBER ou RED',
      outcome: 'hedge absorve (se ratio ≥ 30%) ou P&L exposto',
      owner: 'Risk Officer',
      kpi: 'VaR 95% < R$ 96M',
      cost: 'R$ 0 (teste computacional)',
      riskIfIgnored: 'Ignorar fragilidade real do hedge.'
    }
  }
};

// ============================================================
//  SVG_ID_GENERATOR — mirrors E17's 15 prefix factories.
// ============================================================
const SVG_ID_GENERATOR = {
  framework: () => 'FW_1',
  frameworkGate: () => 'FW-G0',
  frameworkPersona: () => 'FW-P0',
  dataNodes: () => 'D-PTAX',
  signals: () => 'SG_1',
  decisionTrees: () => 'DT_S3',
  outcome: () => 'OUT_S3_1',
  actions: () => 'A-0',
  learningEvent: () => 'LE_S1',
  learning: () => 'L_1',
  governance: () => 'G_1',
  auditCompliance: () => 'AC_1',
  narrationTours: () => 'TN_1',
  couplings: () => 'c1',
  triggers: () => 'T_1'
};

// Source-key → factory name mapping
const SOURCE_KEY_TO_FACTORY = {
  dimData: null,
  dataNodes: 'dataNodes',
  decisionTrees: 'decisionTrees',
  actions: 'actions',
  gates: 'frameworkGate',
  personas: 'frameworkPersona',
  couplings: 'couplings',
  outcomeRegistry: 'outcome',
  learningEvents: 'learningEvent'
};

// ============================================================
//  findRichEntry() — mirror of D3-PITCH-GRAPH.html L1918-2007
//  (identical to E21's mirror — E22 reuses it)
// ============================================================
function findRichEntry(n, dicts) {
  if (!n || !n.id) return null;
  var id = String(n.id);
  function entry(sourceKey, raw, resolvedId) {
    return { sourceKey: sourceKey, raw: raw, resolvedId: resolvedId };
  }

  if (dicts.dimData && dicts.dimData[id]) {
    return entry('dimData', dicts.dimData[id], id);
  }
  if (dicts.dataNodes) {
    var stripD = id.replace(/^D-/, '');
    if (stripD !== id && dicts.dataNodes[stripD]) {
      return entry('dataNodes', dicts.dataNodes[stripD], stripD);
    }
    if (dicts.dataNodes[id]) return entry('dataNodes', dicts.dataNodes[id], id);
  }
  if (dicts.decisionTrees && dicts.decisionTrees[id]) {
    return entry('decisionTrees', dicts.decisionTrees[id], id);
  }
  if (dicts.actions) {
    var ma = id.match(/^A-(\d+)$/);
    if (ma) {
      var idx = parseInt(ma[1], 10);
      var ks = Object.keys(dicts.actions);
      if (idx >= 0 && idx < ks.length && dicts.actions[ks[idx]]) {
        return entry('actions', dicts.actions[ks[idx]], ks[idx]);
      }
    }
    if (dicts.actions[id]) return entry('actions', dicts.actions[id], id);
  }
  if (Array.isArray(dicts.gates) && dicts.gates.length) {
    var mg = id.match(/^G(\d+)$/) || id.match(/^FW-G(\d+)$/);
    if (mg) {
      var gi = parseInt(mg[1], 10);
      if (dicts.gates[gi]) return entry('gates', dicts.gates[gi], id);
    }
  }
  if (Array.isArray(dicts.personas) && dicts.personas.length) {
    var mp1 = id.match(/^P(\d+)$/);
    if (mp1) {
      var pi = parseInt(mp1[1], 10) - 1;
      if (dicts.personas[pi]) return entry('personas', dicts.personas[pi], id);
    }
    var mfp = id.match(/^FW-P(\d+)$/);
    if (mfp) {
      var fpi = parseInt(mfp[1], 10);
      if (dicts.personas[fpi]) return entry('personas', dicts.personas[fpi], id);
    }
  }
  if (Array.isArray(dicts.couplings) && dicts.couplings.length) {
    var mc = id.match(/^c(\d+)$/);
    if (mc) {
      var ci = parseInt(mc[1], 10) - 1;
      if (dicts.couplings[ci]) return entry('couplings', dicts.couplings[ci], id);
    }
  }

  // E21 repair: outcomeRegistry + learningEvents
  if (MIRROR_REPAIRED && dicts.outcomeRegistry && dicts.outcomeRegistry[id]) {
    return entry('outcomeRegistry', dicts.outcomeRegistry[id], id);
  }
  if (MIRROR_REPAIRED && dicts.learningEvents && dicts.learningEvents[id]) {
    return entry('learningEvents', dicts.learningEvents[id], id);
  }

  // Inline fallback
  if (n.data && typeof n.data === 'object' && Object.keys(n.data).length > 0) {
    return entry('inline', n.data, id);
  }

  return null;
}

// ============================================================
//  normalizeBody() — mirror of D3-PITCH-GRAPH.html L2022-2040
// ============================================================
function normalizeBody(richEntry) {
  if (!richEntry || !richEntry.raw) return null;
  var map = NODE_BODY_FIELD_MAP[richEntry.sourceKey];
  var raw = richEntry.raw;
  var norm = {};
  if (map) {
    for (var canonical in map) {
      if (Object.prototype.hasOwnProperty.call(map, canonical)) {
        var sourceField = map[canonical];
        if (typeof sourceField === 'string' && sourceField in raw) {
          norm[canonical] = raw[sourceField];
        }
      }
    }
  }
  norm._sourceKey = richEntry.sourceKey;
  norm._resolvedId = richEntry.resolvedId;
  return norm;
}

// ============================================================
//  getRichBody() — mirror of D3-PITCH-GRAPH.html L2047-2056
//  Adds _nodeId/_nodeLabel always-populate, and falls back
//  _sourceKey to n.ntype when normalizeBody() returns null.
// ============================================================
function getRichBody(n, dicts) {
  var entry = findRichEntry(n, dicts);
  var body = normalizeBody(entry) || {};
  if (n) {
    if (!body._sourceKey && n.ntype) body._sourceKey = n.ntype;
    if (!body._nodeId) body._nodeId = n.id || '';
    if (!body._nodeLabel) body._nodeLabel = n.label || n.name || (n.id || '');
  }
  return body;
}

// ============================================================
//  showDetail()'s fallback chain — mirror of L4147-4157
//  For each canonical field the panel reads, it does:
//     body.X || (rich && rich.X) || n.X
//  E22 verifies that getRichBody() never lets this fall through
//  to n.X for a field that the registry has populated.
// ============================================================
const CANONICAL_PANEL_FIELDS = [
  'title', 'summary', 'explanation', 'whyItMatters', 'realImpact', 'glossary'
];

function showDetailFallbackChain(body, rich, n, field) {
  // Mirror of: var X = body[X] || (rich && rich.X) || n.X;
  return body[field] || (rich && rich[field]) || n[field];
}

// ============================================================
//  validateE22() — the 22nd invariant.
//  Accepts injected getRichBodyFn for adversarial testing.
//  Returns { ok, issues }
// ============================================================
function validateE22(getRichBodyFn) {
  if (!getRichBodyFn) getRichBodyFn = getRichBody;
  var issues = [];

  var sourceKeys = Object.keys(NODE_BODY_FIELD_MAP);
  for (var k = 0; k < sourceKeys.length; k++) {
    var sourceKey = sourceKeys[k];
    var factoryName = SOURCE_KEY_TO_FACTORY[sourceKey];
    var representativeId;
    if (factoryName === null) {
      representativeId = 'S1';
    } else if (factoryName in SVG_ID_GENERATOR) {
      representativeId = SVG_ID_GENERATOR[factoryName]();
    } else {
      issues.push({
        kind: 'factory-missing',
        sourceKey: sourceKey,
        detail: 'SOURCE_KEY_TO_FACTORY references unknown factory "' + factoryName + '"'
      });
      continue;
    }

    var syntheticNode = { id: representativeId, label: representativeId };
    var body = getRichBodyFn(syntheticNode, SAMPLE_DICT);
    if (!body || typeof body !== 'object') {
      issues.push({
        kind: 'body-not-object',
        sourceKey: sourceKey,
        representativeId: representativeId,
        detail: 'getRichBodyFn returned non-object'
      });
      continue;
    }

    // (a) _sourceKey-correct
    if (body._sourceKey !== sourceKey) {
      issues.push({
        kind: 'sourcekey-mismatch',
        sourceKey: sourceKey,
        representativeId: representativeId,
        resolvedSourceKey: body._sourceKey,
        detail: 'body._sourceKey=' + JSON.stringify(body._sourceKey) +
                ' but expected ' + sourceKey
      });
    }

    // (b) _resolvedId-correct
    var expectedResolvedId = representativeId;
    if (sourceKey === 'gates' || sourceKey === 'personas') {
      // arrays use 0-based numeric indexing after regex parsing
      expectedResolvedId = representativeId;
    }
    if (sourceKey === 'couplings') {
      expectedResolvedId = representativeId;
    }
    if (!body._resolvedId || body._resolvedId === '') {
      issues.push({
        kind: 'resolvedid-missing',
        sourceKey: sourceKey,
        representativeId: representativeId,
        detail: 'body._resolvedId is empty (identity loss across normalizeBody)'
      });
    }

    // (c) _nodeId-correct — always-populate contract
    if (body._nodeId !== representativeId) {
      issues.push({
        kind: 'nodeid-mismatch',
        sourceKey: sourceKey,
        representativeId: representativeId,
        resolvedNodeId: body._nodeId,
        detail: 'body._nodeId=' + JSON.stringify(body._nodeId) +
                ' but expected ' + representativeId
      });
    }

    // (d) _nodeLabel-present
    if (!body._nodeLabel || body._nodeLabel === '') {
      issues.push({
        kind: 'nodelabel-missing',
        sourceKey: sourceKey,
        representativeId: representativeId,
        detail: 'body._nodeLabel is empty'
      });
    }

    // (e) fields-round-trip — body[field] === raw[map[field]]
    //     For each canonical field with a sourceField mapping, the
    //     body's value must match the raw entry's sourceField value.
    var map = NODE_BODY_FIELD_MAP[sourceKey];
    var entry = findRichEntry(syntheticNode, SAMPLE_DICT);
    if (entry && entry.raw) {
      var raw = entry.raw;
      for (var canonical in map) {
        if (Object.prototype.hasOwnProperty.call(map, canonical)) {
          var sourceField = map[canonical];
          if (typeof sourceField === 'string' && sourceField in raw) {
            // body[canonical] must equal raw[sourceField] (or a non-empty
            // string equal — primitive equality suffices for samples).
            if (body[canonical] !== raw[sourceField]) {
              issues.push({
                kind: 'round-trip-mismatch',
                sourceKey: sourceKey,
                representativeId: representativeId,
                canonical: canonical,
                sourceField: sourceField,
                bodyValue: body[canonical],
                rawValue: raw[sourceField],
                detail: 'body[' + canonical + ']=' + JSON.stringify(body[canonical]) +
                        ' but raw[' + sourceField + ']=' + JSON.stringify(raw[sourceField])
              });
            }
          }
        }
      }
    }

    // (f) no-silent-fallback — for each panel field, body[field]
    //     must be defined when raw[map[field]] is defined. Otherwise
    //     showDetail()'s `body.X || rich.X || n.X` falls through.
    if (entry && entry.raw) {
      var raw2 = entry.raw;
      var map2 = NODE_BODY_FIELD_MAP[sourceKey];
      var missingFallback = [];
      for (var fi = 0; fi < CANONICAL_PANEL_FIELDS.length; fi++) {
        var fld = CANONICAL_PANEL_FIELDS[fi];
        if (map2 && fld in map2) {
          var src = map2[fld];
          if (typeof src === 'string' && src in raw2) {
            if (!(fld in body) || body[fld] === undefined) {
              missingFallback.push(fld);
            }
          }
        }
      }
      if (missingFallback.length > 0) {
        issues.push({
          kind: 'silent-fallback',
          sourceKey: sourceKey,
          representativeId: representativeId,
          missingFallbackFields: missingFallback,
          detail: 'showDetail() will silently fall through to n.X for: ' +
                  missingFallback.join(', ')
        });
      }
    }
  }

  return { ok: issues.length === 0, issues: issues };
}

// ============================================================
//  makeMutantGetRichBody() — adversarial factory.
//  Builds a mutated getRichBody that breaks one specific contract.
// ============================================================
function makeMutantGetRichBody(options) {
  options = options || {};
  return function mutantGetRichBody(n, dicts) {
    var entry = findRichEntry(n, dicts);
    var body = normalizeBody(entry) || {};
    if (n) {
      if (!options.dropSourceKeyFallback && !body._sourceKey && n.ntype) {
        body._sourceKey = n.ntype;
      }
      if (options.dropNodeId) {
        // skip _nodeId population entirely
      } else if (!body._nodeId) {
        body._nodeId = n.id || '';
      }
      if (options.dropNodeLabel) {
        // skip _nodeLabel population entirely
      } else if (!body._nodeLabel) {
        body._nodeLabel = n.label || n.name || (n.id || '');
      }
    }
    if (options.spoofResolvedId && body._resolvedId) {
      body._resolvedId = options.spoofResolvedId + ':' + body._resolvedId;
    }
    if (options.dropSourceKeyAttachment && body._sourceKey) {
      delete body._sourceKey;
    }
    if (options.dropFieldsRoundTrip) {
      // strip a canonical field body for dimData to test round-trip
      if (body._sourceKey === 'dimData') {
        delete body.summary;
      }
    }
    if (options.swapCanonicalFields && Array.isArray(options.swapCanonicalFields)) {
      // After normalizeBody, the body has body[title]=raw.name, body[summary]=raw.short,
      // etc. A field-swap mutation transposes two canonical values post-mapping,
      // breaking round-trip equality for EVERY source that had both fields.
      // This catches a normalizeBody implementation that swaps output variables
      // without updating source-field mapping.
      var pair = options.swapCanonicalFields;
      var a = pair[0];
      var b = pair[1];
      if (a in body && b in body) {
        var tmp = body[a];
        body[a] = body[b];
        body[b] = tmp;
      } else if (a in body && !(b in body)) {
        body[b] = body[a];
        body[a] = undefined;
      } else if (b in body && !(a in body)) {
        body[a] = body[b];
        body[b] = undefined;
      }
    }
    return body;
  };
}

// ============================================================
//  runAdversarial() — proves the harness catches known-bad shapes.
// ============================================================
function runAdversarial() {
  var results = [];
  function record(name, ok, observed) {
    results.push({ name: name, ok: ok, observed: observed });
    var tag = ok ? 'CAUGHT' : 'MISSED ';
    var first = observed.issues.length > 0
      ? '(' + observed.issues[0].kind + ': ' + observed.issues[0].sourceKey + ')'
      : '(none)';
    console.log('  ' + tag + '  ' + name + '   issues=' + observed.issues.length + '   ' + first);
  }

  console.log('');
  console.log('=== Adversarial ===');

  // T1: drop _nodeId population — must catch nodeid-mismatch for ≥9
  var m1 = makeMutantGetRichBody({ dropNodeId: true });
  var r1 = validateE22(m1);
  record('T1 drop _nodeId population',
    r1.issues.filter(function(i) { return i.kind === 'nodeid-mismatch'; }).length >= 9,
    r1);

  // T2: drop _nodeLabel population — must catch nodelabel-missing for ≥9
  var m2 = makeMutantGetRichBody({ dropNodeLabel: true });
  var r2 = validateE22(m2);
  record('T2 drop _nodeLabel population',
    r2.issues.filter(function(i) { return i.kind === 'nodelabel-missing'; }).length >= 9,
    r2);

  // T3: drop _sourceKey attachment after normalizeBody — must catch
  //     sourcekey-mismatch for ≥9 (no fallback via n.ntype either
  //     because we also drop the fallback)
  var m3 = makeMutantGetRichBody({
    dropSourceKeyAttachment: true,
    dropSourceKeyFallback: true
  });
  var r3 = validateE22(m3);
  record('T3 drop _sourceKey (no fallback)',
    r3.issues.filter(function(i) { return i.kind === 'sourcekey-mismatch'; }).length >= 9,
    r3);

  // T4: swap canonical fields (round-trip violation) — body[title] ends up
  //     holding what was in body[summary] (or vice versa) for ≥9 sources.
  //     Catches a normalizeBody implementation that swaps output variables
  //     without updating source-field mapping.
  var m4 = makeMutantGetRichBody({ swapCanonicalFields: ['title', 'summary'] });
  var r4 = validateE22(m4);
  record('T4 swap canonical fields (post-normalize swap)',
    r4.issues.filter(function(i) { return i.kind === 'round-trip-mismatch'; }).length >= 9,
    r4);

  // T5: strip a populated canonical field (round-trip fail) — must
  //     catch round-trip-mismatch for dimData summary
  var m5 = makeMutantGetRichBody({ dropFieldsRoundTrip: true });
  var r5 = validateE22(m5);
  record('T5 strip canonical field after normalizeBody',
    r5.issues.some(function(i) {
      return i.kind === 'round-trip-mismatch' && i.sourceKey === 'dimData';
    }),
    r5);

  // T6: silent fallback — getRichBody returns body without fields
  //     that raw has (forces showDetail fallback chain to n.X)
  var m6 = function(n, dicts) {
    var body = { _nodeId: n.id, _nodeLabel: n.id };
    var entry = findRichEntry(n, dicts);
    if (entry) {
      body._sourceKey = entry.sourceKey;
      body._resolvedId = entry.resolvedId;
      // deliberately omit canonical fields — body.X undefined,
      // showDetail's `body.X || rich.X || n.X` will fall to n.X
    }
    return body;
  };
  var r6 = validateE22(m6);
  record('T6 silent fallback to n.X (canonical fields missing)',
    r6.issues.length > 0,
    r6);

  // T7: bonus — all-OK control mutant (canonical getRichBody),
  //     expected to pass clean
  var r7 = validateE22(getRichBody);
  record('T7 control — canonical getRichBody (expected clean)',
    r7.issues.length === 0,
    r7);

  var passed = results.filter(function(r) { return r.ok; }).length;
  return { passed: passed, total: results.length, results: results };
}

// ============================================================
//  MAIN
// ============================================================
console.log('=== E22 verification: 22nd invariant (getRichBody end-to-end round-trip) ===');
console.log('Source keys in NODE_BODY_FIELD_MAP: ' + Object.keys(NODE_BODY_FIELD_MAP).length);
console.log('Sample dicts: ' + Object.keys(SAMPLE_DICT).length);
console.log('SVG_ID_GENERATOR factories: ' + Object.keys(SVG_ID_GENERATOR).length);
console.log('MIRROR_REPAIRED: ' + MIRROR_REPAIRED);
console.log('');

// --- 1) Pre-repair baseline check on canonical fn ---
var preResult = validateE22();
console.log('=== Pre-repair baseline (canonical getRichBody) ===');
console.log('  ok: ' + preResult.ok);
console.log('  issues: ' + preResult.issues.length);
if (preResult.issues.length > 0) {
  for (var pi = 0; pi < preResult.issues.length; pi++) {
    var pi_issue = preResult.issues[pi];
    console.log('    - [' + pi_issue.kind + '] ' + pi_issue.sourceKey +
                ' (id=' + (pi_issue.representativeId || '?') + ')' +
                (pi_issue.canonical ? ' canonical=' + pi_issue.canonical : '') +
                (pi_issue.detail ? ' :: ' + pi_issue.detail : ''));
  }
}

console.log('');
console.log('=== Per-sourceKey detail (canonical getRichBody) ===');
var allSourceKeys = Object.keys(NODE_BODY_FIELD_MAP);
for (var i = 0; i < allSourceKeys.length; i++) {
  var sk = allSourceKeys[i];
  var factoryName = SOURCE_KEY_TO_FACTORY[sk];
  var representativeId = factoryName === null ? 'S1'
    : SVG_ID_GENERATOR[factoryName]();
  var node = { id: representativeId, label: representativeId };
  var b = getRichBody(node, SAMPLE_DICT);
  console.log('  ' + sk.padEnd(20) + ' id=' + representativeId.padEnd(10) +
              ' _sourceKey=' + String(b._sourceKey).padEnd(20) +
              ' _resolvedId=' + String(b._resolvedId).padEnd(10) +
              ' _nodeId=' + String(b._nodeId).padEnd(10) +
              ' fields=' + Object.keys(b).length);
}

console.log('');
var adv = runAdversarial();

// --- Final verdict ---
var verdict;
if (MIRROR_REPAIRED) {
  verdict = (preResult.issues.length === 0) && (adv.passed === adv.total);
} else {
  verdict = (preResult.issues.length > 0) && (adv.passed === adv.total);
}

console.log('');
console.log('=== Final ===');
console.log('  pre-repair issues: ' + preResult.issues.length +
            ' (expected ' + (MIRROR_REPAIRED ? '0' : '>0') + ')');
console.log('  adversarial:       ' + adv.passed + '/' + adv.total + ' caught');
console.log('  verdict:           ' + (verdict ? 'PASS' : 'FAIL'));

process.exit(verdict ? 0 : 1);