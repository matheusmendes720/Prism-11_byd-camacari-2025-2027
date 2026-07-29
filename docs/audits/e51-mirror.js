// e51-mirror.js — validateDataLayer() mirror (subset 6): invariants 16, 17, 18.
//
// Extracted from e51-verify.js so the runner stays under the 500-line limit.
// Exports healthyValidateDataLayer() and makeBF(opts) factory; consumer is
// e51-verify.js (or any other harness needing this subset).
//
// D3-PITCH-GRAPH.html L1006-1256 (validateDataLayer — E8 chrome):
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
// 13 flags total (6 for invariant 16, 6 for invariant 17, 1 for invariant 18).

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment (sourced via setter hooks from the host)
// ============================================================
var ID_PREFIXES       = [];
var SVG_ID_GENERATOR  = {};
var SVG_ID_TO_LAYER   = {};
var tours             = [];

var LAYER_IDS = ['framework', 'data', 'signal', 'decision', 'action', 'learning', 'governance'];
var VIEW_IDS  = ['overview', 'risk', 'red-flags', 'couplings', 'gates', 'personas',
                 'flow', 'timeline', 'scenario', 'cascade'];

var DURATION_RE = /^\d+\s+(?:s|min|m)$/;

function resolveIdLayer(id) {
  if (typeof id !== 'string' || id.length === 0) return null;
  for (var prefix in SVG_ID_TO_LAYER) {
    if (Object.prototype.hasOwnProperty.call(SVG_ID_TO_LAYER, prefix)) {
      if (id.indexOf(prefix) === 0) return SVG_ID_TO_LAYER[prefix];
    }
  }
  return null;
}

function makeHealthyIDPrefixes() {
  return [
    { prefix: 'D',    owner: 'data',             generator: 'data',             layer: 'framework' },
    { prefix: 'C',    owner: 'coupling',         generator: 'coupling',         layer: 'data' },
    { prefix: 'FW-G', owner: 'frameworkGate',    generator: 'frameworkGate',    layer: 'governance' },
    { prefix: 'FW-P', owner: 'frameworkPersona', generator: 'frameworkPersona', layer: 'learning' },
    { prefix: 'A',    owner: 'action',           generator: 'action',           layer: 'action' },
    { prefix: 'DC',   owner: 'decision',         generator: 'decision',         layer: 'decision' }
  ];
}

function makeHealthySVGIdGenerator() {
  return {
    data:             function (k) { return 'D-'    + k; },
    coupling:         function (i) { return 'C-'    + i; },
    frameworkGate:    function (i) { return 'FW-G'  + i; },
    frameworkPersona: function (i) { return 'FW-P'  + i; },
    action:           function (i) { return 'A-'    + i; },
    decision:         function (k) { return 'DC-'   + k; }
  };
}

function makeHealthySVGIdToLayer() {
  return {
    'D':    'framework',
    'C':    'data',
    'FW-G': 'governance',
    'FW-P': 'learning',
    'A':    'action',
    'DC':   'decision'
  };
}

function makeHealthyTours() {
  return [
    {
      id: 'tour-overview',
      name: 'Tour Overview',
      duration: '3 min',
      description: 'Overview tour of the D3 framework',
      steps: [
        { title: 'Step 1', desc: 'Desc 1', nodeId: 'D-1',    action_set: { view: 'overview', layer: 'framework' } },
        { title: 'Step 2', desc: 'Desc 2', nodeId: 'DC-1',   action_set: { view: 'risk',     layer: 'decision'  } }
      ]
    },
    {
      id: 'tour-risk',
      name: 'Tour Risk',
      duration: '5 min',
      description: 'Risk-focused tour',
      steps: [
        { title: 'Risk Step 1', desc: 'Risk desc 1', nodeId: 'A-1', action_set: { view: 'red-flags', layer: 'action' } }
      ]
    }
  ];
}

function resetEnv() {
  ID_PREFIXES      = makeHealthyIDPrefixes();
  SVG_ID_GENERATOR = makeHealthySVGIdGenerator();
  SVG_ID_TO_LAYER  = makeHealthySVGIdToLayer();
  tours            = makeHealthyTours();
}

function setIDPrefixes(v)        { ID_PREFIXES      = v; }
function getIDPrefixes()         { return ID_PREFIXES; }
function setSVGIdGenerator(v)    { SVG_ID_GENERATOR = v; }
function getSVGIdGenerator()     { return SVG_ID_GENERATOR; }
function setSVGIdToLayer(v)      { SVG_ID_TO_LAYER  = v; }
function getSVGIdToLayer()       { return SVG_ID_TO_LAYER; }
function setTours(v)             { tours            = v; }
function getTours()              { return tours; }

function corruptIDPrefixEntry(idx, patch) {
  if (!ID_PREFIXES || !ID_PREFIXES[idx]) return;
  Object.keys(patch).forEach(function (k) { ID_PREFIXES[idx][k] = patch[k]; });
}

function corruptTourEntry(tIdx, patch) {
  if (!tours || !tours[tIdx]) return;
  Object.keys(patch).forEach(function (k) { tours[tIdx][k] = patch[k]; });
}

function corruptTourStep(tIdx, sIdx, patch) {
  if (!tours || !tours[tIdx] || !Array.isArray(tours[tIdx].steps)) return;
  if (!tours[tIdx].steps[sIdx]) return;
  Object.keys(patch).forEach(function (k) { tours[tIdx].steps[sIdx][k] = patch[k]; });
}

function corruptActionSet(tIdx, sIdx, patch) {
  if (!tours || !tours[tIdx] || !Array.isArray(tours[tIdx].steps)) return;
  if (!tours[tIdx].steps[sIdx]) return;
  if (!tours[tIdx].steps[sIdx].action_set) tours[tIdx].steps[sIdx].action_set = {};
  Object.keys(patch).forEach(function (k) { tours[tIdx].steps[sIdx].action_set[k] = patch[k]; });
}

// ============================================================
// Mirror — validateDataLayer() subset: invariants 16, 17, 18 (HEALTHY)
// ============================================================
function healthyValidateDataLayer() {
  var issues = [];
  function fail(msg) { issues.push(msg); }

  // 16. ID_PREFIXES reservation table
  try {
    if (!Array.isArray(ID_PREFIXES) || ID_PREFIXES.length === 0) {
      fail('ID_PREFIXES must be a non-empty array (got ' + (typeof ID_PREFIXES) + ')');
    } else {
      var REQUIRED_16 = ['prefix', 'owner', 'generator', 'layer'];
      ID_PREFIXES.forEach(function (entry, idx) {
        REQUIRED_16.forEach(function (field) {
          if (!entry || typeof entry[field] !== 'string' || entry[field].length === 0) {
            fail('ID_PREFIXES[' + idx + '].' + field + ' missing or empty (got ' +
                 (entry ? (typeof entry[field]) : 'entry-missing') + ')');
          }
        });
      });

      // 16c. Prefix uniqueness (use `in` — index 0 is falsy)
      var seenPrefixes = Object.create(null);
      ID_PREFIXES.forEach(function (entry, idx) {
        if (entry && entry.prefix) {
          if (entry.prefix in seenPrefixes) {
            fail('ID_PREFIXES has duplicate prefix "' + entry.prefix + '" at indices ' +
                 seenPrefixes[entry.prefix] + ' and ' + idx);
          }
          seenPrefixes[entry.prefix] = idx;
        }
      });

      // 16d/16e/16f. generator ↔ factory, prefix ↔ layer, factory output shape
      ID_PREFIXES.forEach(function (entry, idx) {
        if (!entry || !entry.generator || !entry.prefix) return;
        var fn = SVG_ID_GENERATOR[entry.generator];
        if (typeof fn !== 'function') {
          fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
               '" is not a factory key in SVG_ID_GENERATOR');
          return;
        }
        if (!(entry.prefix in SVG_ID_TO_LAYER) ||
            SVG_ID_TO_LAYER[entry.prefix] !== entry.layer) {
          fail('ID_PREFIXES[' + idx + '].prefix "' + entry.prefix +
               '" not mapped to layer "' + entry.layer + '" in SVG_ID_TO_LAYER (got ' +
               SVG_ID_TO_LAYER[entry.prefix] + ')');
        }
        var isIndexed = (entry.generator === 'action' || entry.generator === 'coupling' ||
                         entry.generator === 'frameworkGate' || entry.generator === 'frameworkPersona');
        var sample = isIndexed ? '0' : 'TEST';
        var out;
        try { out = fn(sample); } catch (e) {
          fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
               '" threw on sample "' + sample + '": ' + e.message);
          return;
        }
        if (typeof out !== 'string' || out.length === 0) {
          fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
               '" produced non-string or empty output for sample "' + sample + '"');
        } else if (out.indexOf(entry.prefix) !== 0) {
          fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
               '" output "' + out + '" does not start with declared prefix "' + entry.prefix + '"');
        } else if (out.length <= entry.prefix.length) {
          fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
               '" output "' + out + '" is just the prefix (no suffix)');
        }
      });
    }
  } catch (e) { fail('ID_PREFIXES invariant threw: ' + e.message); }

  // 17. Tours schema integrity
  try {
    if (!Array.isArray(tours) || tours.length === 0) {
      fail('tours must be a non-empty array (got ' + (typeof tours) + ')');
    } else {
      var TOUR_REQ  = ['id', 'name', 'duration', 'description'];
      var STEP_REQ  = ['title', 'desc'];
      var seenTourIds = Object.create(null);

      tours.forEach(function (t, tIdx) {
        if (!t || typeof t !== 'object') return;
        TOUR_REQ.forEach(function (field) {
          if (typeof t[field] !== 'string' || t[field].length === 0) {
            fail('tours[' + tIdx + '].' + field + ' missing or empty (got ' +
                 (typeof t[field]) + ')');
          }
        });
        if (typeof t.id === 'string' && t.id.length > 0) {
          if (t.id in seenTourIds) {
            fail('tours has duplicate id "' + t.id + '" at indices ' +
                 seenTourIds[t.id] + ' and ' + tIdx);
          }
          seenTourIds[t.id] = tIdx;
        }
        if (!Array.isArray(t.steps) || t.steps.length === 0) {
          fail('tours[' + tIdx + '].steps must be a non-empty array (got ' +
               (Array.isArray(t.steps) ? 'length=0' : typeof t.steps) + ')');
          return;
        }
        if (typeof t.duration === 'string' && t.duration.length > 0 &&
            !DURATION_RE.test(t.duration)) {
          fail('tours[' + tIdx + '].duration "' + t.duration +
               '" does not match /\\d+\\s+(?:s|min|m)$/');
        }
        t.steps.forEach(function (step, sIdx) {
          if (!step || typeof step !== 'object') return;
          STEP_REQ.forEach(function (field) {
            if (typeof step[field] !== 'string' || step[field].length === 0) {
              fail('tours[' + tIdx + '].steps[' + sIdx + '].' + field +
                   ' missing or empty (got ' + (typeof step[field]) + ')');
            }
          });
          if (typeof step.action_set !== 'undefined') {
            if (!step.action_set || typeof step.action_set !== 'object') {
              fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set is not an object');
            } else {
              if (typeof step.action_set.view !== 'string' ||
                  VIEW_IDS.indexOf(step.action_set.view) === -1) {
                fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set.view "' +
                     step.action_set.view + '" not in VIEW_IDS');
              }
              if (typeof step.action_set.layer !== 'string' ||
                  LAYER_IDS.indexOf(step.action_set.layer) === -1) {
                fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set.layer "' +
                     step.action_set.layer + '" not in LAYER_IDS');
              }
            }
          }
        });
      });

      // 17i. Badge consistency (DOM-only — naturally skipped in Node)
      try {
        if (typeof document !== 'undefined' && document && document.getElementById) {
          var badge = document.getElementById('tour-selector-count');
          if (badge && typeof badge.textContent === 'string' &&
              badge.textContent !== String(tours.length)) {
            fail('#tour-selector-count has "' + badge.textContent +
                 '" but tours.length is ' + tours.length);
          }
        }
      } catch (_) { /* no DOM — skip */ }
    }
  } catch (e) { fail('tours invariant threw: ' + e.message); }

  // 18. Tour nodeId cross-reference
  try {
    if (Array.isArray(tours)) {
      tours.forEach(function (t, tIdx) {
        if (!t || !Array.isArray(t.steps)) return;
        t.steps.forEach(function (step, sIdx) {
          if (!step || typeof step.nodeId === 'undefined' || step.nodeId === null) return;
          if (typeof step.nodeId !== 'string' || step.nodeId.trim().length === 0) {
            fail('tours[' + tIdx + '].steps[' + sIdx + '].nodeId=' +
                 JSON.stringify(step.nodeId) + ' not a non-empty string');
            return;
          }
          if (resolveIdLayer(step.nodeId) === null) {
            fail('tours[' + tIdx + '].steps[' + sIdx + '].nodeId="' + step.nodeId +
                 '" does not resolve to any known layer (unscoped phantom)');
          }
        });
      });
    }
  } catch (e) { fail('tour nodeId cross-reference invariant threw: ' + e.message); }

  return { ok: issues.length === 0, issues: issues };
}

module.exports = {
  healthyValidateDataLayer: healthyValidateDataLayer,
  makeBF: makeBF,
  resetEnv: resetEnv,
  setIDPrefixes: setIDPrefixes,
  getIDPrefixes: getIDPrefixes,
  setSVGIdGenerator: setSVGIdGenerator,
  getSVGIdGenerator: getSVGIdGenerator,
  setSVGIdToLayer: setSVGIdToLayer,
  getSVGIdToLayer: getSVGIdToLayer,
  setTours: setTours,
  getTours: getTours,
  makeHealthyIDPrefixes: makeHealthyIDPrefixes,
  makeHealthySVGIdGenerator: makeHealthySVGIdGenerator,
  makeHealthySVGIdToLayer: makeHealthySVGIdToLayer,
  makeHealthyTours: makeHealthyTours,
  corruptIDPrefixEntry: corruptIDPrefixEntry,
  corruptTourEntry: corruptTourEntry,
  corruptTourStep: corruptTourStep,
  corruptActionSet: corruptActionSet
};

// ============================================================
// Broken mutants — factory pattern.
// Each broken body is built from boolean flags; when MIRROR_REPAIRED is
// true, the factory falls through to healthyValidateDataLayer().
// 13 flags total (6 for invariant 16, 6 for invariant 17, 1 for invariant 18).
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyValidateDataLayer();
    var issues = [];
    function fail(msg) { issues.push(msg); }

    // 16. ID_PREFIXES reservation table
    if (!opts.dropInv16Scan) {
      try {
        if (!opts.dropInv16a && (!Array.isArray(ID_PREFIXES) || ID_PREFIXES.length === 0)) {
          fail('ID_PREFIXES must be a non-empty array (got ' + (typeof ID_PREFIXES) + ')');
        } else {
          if (!opts.dropInv16b) {
            var REQUIRED_16 = ['prefix', 'owner', 'generator', 'layer'];
            ID_PREFIXES.forEach(function (entry, idx) {
              REQUIRED_16.forEach(function (field) {
                if (!entry || typeof entry[field] !== 'string' || entry[field].length === 0) {
                  fail('ID_PREFIXES[' + idx + '].' + field + ' missing or empty (got ' +
                       (entry ? (typeof entry[field]) : 'entry-missing') + ')');
                }
              });
            });
          }
          if (!opts.dropInv16c) {
            var seenPrefixes = Object.create(null);
            ID_PREFIXES.forEach(function (entry, idx) {
              if (entry && entry.prefix) {
                if (entry.prefix in seenPrefixes) {
                  fail('ID_PREFIXES has duplicate prefix "' + entry.prefix + '" at indices ' +
                       seenPrefixes[entry.prefix] + ' and ' + idx);
                }
                seenPrefixes[entry.prefix] = idx;
              }
            });
          }
          // 16d/16e/16f combined
          ID_PREFIXES.forEach(function (entry, idx) {
            if (!entry || !entry.generator || !entry.prefix) return;
            if (!opts.dropInv16d) {
              var fn = SVG_ID_GENERATOR[entry.generator];
              if (typeof fn !== 'function') {
                fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
                     '" is not a factory key in SVG_ID_GENERATOR');
                return;
              }
            }
            if (!opts.dropInv16e) {
              if (!(entry.prefix in SVG_ID_TO_LAYER) ||
                  SVG_ID_TO_LAYER[entry.prefix] !== entry.layer) {
                fail('ID_PREFIXES[' + idx + '].prefix "' + entry.prefix +
                     '" not mapped to layer "' + entry.layer + '" in SVG_ID_TO_LAYER (got ' +
                     SVG_ID_TO_LAYER[entry.prefix] + ')');
              }
            }
            if (!opts.dropInv16f) {
              var fn2 = SVG_ID_GENERATOR[entry.generator];
              if (typeof fn2 !== 'function') return;
              var isIndexed = (entry.generator === 'action' || entry.generator === 'coupling' ||
                               entry.generator === 'frameworkGate' || entry.generator === 'frameworkPersona');
              var sample = isIndexed ? '0' : 'TEST';
              var out;
              try { out = fn2(sample); } catch (e) {
                fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
                     '" threw on sample "' + sample + '": ' + e.message);
                return;
              }
              if (typeof out !== 'string' || out.length === 0) {
                fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
                     '" produced non-string or empty output for sample "' + sample + '"');
              } else if (out.indexOf(entry.prefix) !== 0) {
                fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
                     '" output "' + out + '" does not start with declared prefix "' + entry.prefix + '"');
              } else if (out.length <= entry.prefix.length) {
                fail('ID_PREFIXES[' + idx + '].generator="' + entry.generator +
                     '" output "' + out + '" is just the prefix (no suffix)');
              }
            }
          });
        }
      } catch (e) { fail('ID_PREFIXES invariant threw: ' + e.message); }
    }

    // 17. Tours schema integrity
    if (!opts.dropInv17Scan) {
      try {
        if (!opts.dropInv17a && (!Array.isArray(tours) || tours.length === 0)) {
          fail('tours must be a non-empty array (got ' + (typeof tours) + ')');
        } else {
          var seenTourIds = Object.create(null);
          tours.forEach(function (t, tIdx) {
            if (!t || typeof t !== 'object') return;
            if (!opts.dropInv17aTour) {
              var TOUR_REQ = ['id', 'name', 'duration', 'description'];
              TOUR_REQ.forEach(function (field) {
                if (typeof t[field] !== 'string' || t[field].length === 0) {
                  fail('tours[' + tIdx + '].' + field + ' missing or empty (got ' +
                       (typeof t[field]) + ')');
                }
              });
            }
            if (!opts.dropInv17c) {
              if (typeof t.id === 'string' && t.id.length > 0) {
                if (t.id in seenTourIds) {
                  fail('tours has duplicate id "' + t.id + '" at indices ' +
                       seenTourIds[t.id] + ' and ' + tIdx);
                }
                seenTourIds[t.id] = tIdx;
              }
            }
            if (!opts.dropInv17d) {
              if (!Array.isArray(t.steps) || t.steps.length === 0) {
                fail('tours[' + tIdx + '].steps must be a non-empty array (got ' +
                     (Array.isArray(t.steps) ? 'length=0' : typeof t.steps) + ')');
                return;
              }
            }
            if (!opts.dropInv17h && typeof t.duration === 'string' && t.duration.length > 0 &&
                !DURATION_RE.test(t.duration)) {
              fail('tours[' + tIdx + '].duration "' + t.duration +
                   '" does not match /\\d+\\s+(?:s|min|m)$/');
            }
            if (Array.isArray(t.steps)) {
              t.steps.forEach(function (step, sIdx) {
                if (!step || typeof step !== 'object') return;
                if (!opts.dropInv17b) {
                  var STEP_REQ = ['title', 'desc'];
                  STEP_REQ.forEach(function (field) {
                    if (typeof step[field] !== 'string' || step[field].length === 0) {
                      fail('tours[' + tIdx + '].steps[' + sIdx + '].' + field +
                           ' missing or empty (got ' + (typeof step[field]) + ')');
                    }
                  });
                }
                if (!opts.dropInv17fg && typeof step.action_set !== 'undefined') {
                  if (!step.action_set || typeof step.action_set !== 'object') {
                    fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set is not an object');
                  } else {
                    if (typeof step.action_set.view !== 'string' ||
                        VIEW_IDS.indexOf(step.action_set.view) === -1) {
                      fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set.view "' +
                           step.action_set.view + '" not in VIEW_IDS');
                    }
                    if (typeof step.action_set.layer !== 'string' ||
                        LAYER_IDS.indexOf(step.action_set.layer) === -1) {
                      fail('tours[' + tIdx + '].steps[' + sIdx + '].action_set.layer "' +
                           step.action_set.layer + '" not in LAYER_IDS');
                    }
                  }
                }
              });
            }
          });

          // 17i. Badge consistency (DOM-only — naturally skipped in Node)
          try {
            if (typeof document !== 'undefined' && document && document.getElementById) {
              var badge = document.getElementById('tour-selector-count');
              if (badge && typeof badge.textContent === 'string' &&
                  badge.textContent !== String(tours.length)) {
                fail('#tour-selector-count has "' + badge.textContent +
                     '" but tours.length is ' + tours.length);
              }
            }
          } catch (_) { /* no DOM — skip */ }
        }
      } catch (e) { fail('tours invariant threw: ' + e.message); }
    }

    // 18. Tour nodeId cross-reference
    if (!opts.dropInv18) {
      try {
        if (Array.isArray(tours)) {
          tours.forEach(function (t, tIdx) {
            if (!t || !Array.isArray(t.steps)) return;
            t.steps.forEach(function (step, sIdx) {
              if (!step || typeof step.nodeId === 'undefined' || step.nodeId === null) return;
              if (typeof step.nodeId !== 'string' || step.nodeId.trim().length === 0) {
                fail('tours[' + tIdx + '].steps[' + sIdx + '].nodeId=' +
                     JSON.stringify(step.nodeId) + ' not a non-empty string');
                return;
              }
              if (resolveIdLayer(step.nodeId) === null) {
                fail('tours[' + tIdx + '].steps[' + sIdx + '].nodeId="' + step.nodeId +
                     '" does not resolve to any known layer (unscoped phantom)');
              }
            });
          });
        }
      } catch (e) { fail('tour nodeId cross-reference invariant threw: ' + e.message); }
    }

    return { ok: issues.length === 0, issues: issues };
  };
}