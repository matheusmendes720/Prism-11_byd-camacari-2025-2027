// e55-verify.js — showTourStep() chrome hook invariant
//
// Mirrors D3-PITCH-GRAPH.html L3809-3854 (showTourStep — chrome-only).
// Writes progress dots, step counter, title/desc/hint/duration, narration/
// action display+toggle, action_set chrome ref update + rebuild, tour-target
// class toggle (deferred via setTimeout), restart visibility. No node geometry
// mutations; chrome only.
//
// Invariants (4 sub-checks):
//   1a. Progress dots DOM write (#tour-progress-bar.innerHTML) +
//       step counter write (#tour-step.textContent).
//   1b. Title/desc/hint/duration textContent writes.
//   1c. Narration/action display toggles + textContent writes (conditional on
//       step.{narration,action}).
//   1d. action_set view/layer chrome ref update + build() invocation; restart
//       button visibility toggle based on tourIdx.
//       (tour-target class toggle + setTimeout deferred callback are exercised
//       by outer chrome; the synchronous surface here captures writes 1a-1d
//       and chrome-ref recompute.)
//
// Inverted mutant pattern: each fixture pre-seeds DOM stubs with sentinel
// values. Healthy code performs the write → sentinel overwritten with step
// value. Broken mutant drops the write → sentinel survives → fixture reports
// issue → runner says PASS (in BASELINE mode) or FAIL (in REPAIRED mode, since
// REPAIRED delegates to healthy and the sentinel gets overwritten).
//
// 4 mutants × 1 target fixture + 4 controls (fixtures × healthy) = 8 reports.

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ============================================================
// Mock environment — DOM stubs + tourSteps + tour state + helpers
// ============================================================

// DOM stub factory — plain object with textContent (string) and innerHTML
// (string), plus a style.display string.
function makeTextStub() {
  return { textContent: '', innerHTML: '', style: { display: '' } };
}

// progress bar is innerHTML-bearing only; no textContent used.
function makeBarStub() {
  return { innerHTML: '', style: { display: '' } };
}

var progressBar = null;
var stepCounter = null;
var titleEl = null;
var descEl = null;
var hintEl = null;
var durationEl = null;
var narrationEl = null;
var actionEl = null;
var restartEl = null;

function getProgressBar() { return progressBar; }
function getStepCounter() { return stepCounter; }
function getTitle()       { return titleEl; }
function getDesc()        { return descEl; }
function getHint()        { return hintEl; }
function getDuration()    { return durationEl; }
function getNarration()   { return narrationEl; }
function getAction()      { return actionEl; }
function getRestart()     { return restartEl; }

// Tour state
var tours = null;
var tourSteps = null;
var tourIdx = 0;
var currentTourId = null;
var currentLayer = 'camada-1';
var currentView = '2026-2027';

function getTourSteps() { return tourSteps; }
function setTourIdx(v) { tourIdx = v; }
function getTourIdx()  { return tourIdx; }
function getTourStep() { return tourSteps[tourIdx]; }

// Build flag counters
var buildCallCount = 0;
var updateLayerButtonsCallCount = 0;
var updateViewButtonsCallCount = 0;

function getBuildCallCount() { return buildCallCount; }
function getUpdateLayerButtonsCallCount() { return updateLayerButtonsCallCount; }
function getUpdateViewButtonsCallCount() { return updateViewButtonsCallCount; }

function makeHealthyTours() {
  return [
    {
      id: 'tour-fundamentos',
      name: 'Fundamentos',
      steps: [
        {
          title: 'Visão geral',
          desc: 'Visão geral do framework D3.',
          narration: 'Esta é a narração da visão geral.',
          action: 'Clique em próximo',
          hint: 'Use as setas do teclado para navegar.',
          duration: '30s',
          action_set: { view: '2026-2027', layer: 'camada-1' },
          nodeId: 'composite'
        },
        {
          title: 'Dimensões',
          desc: 'As 11 dimensões do framework.',
          narration: null,
          action: null,
          hint: null,
          duration: '45s',
          action_set: { view: '2026-2027', layer: 'camada-1' },
          nodeId: 'S1'
        }
      ]
    }
  ];
}

function resetEnv() {
  progressBar  = makeBarStub();
  stepCounter  = makeTextStub();
  titleEl      = makeTextStub();
  descEl       = makeTextStub();
  hintEl       = makeTextStub();
  durationEl   = makeTextStub();
  narrationEl  = makeTextStub();
  actionEl     = makeTextStub();
  restartEl    = makeTextStub();
  restartEl.style.display = 'none';

  tours = makeHealthyTours();
  tourSteps = tours[0].steps;
  currentTourId = tours[0].id;
  tourIdx = 0;

  buildCallCount = 0;
  updateLayerButtonsCallCount = 0;
  updateViewButtonsCallCount = 0;
}

// Mock document.getElementById — keyed by element id, returns our stub.
var elementMap = {};
global.document = {
  getElementById: function (id) { return elementMap[id] || null; },
  querySelectorAll: function (_selector) { return []; }
};

function rebuildElementMap() {
  elementMap = {
    'tour-progress-bar': progressBar,
    'tour-step':         stepCounter,
    'tour-title':        titleEl,
    'tour-desc':         descEl,
    'tour-hint':         hintEl,
    'tour-duration':     durationEl,
    'tour-narration':    narrationEl,
    'tour-narration-text': narrationEl,
    'tour-action':       actionEl,
    'tour-action-text':  actionEl,
    'tour-restart':      restartEl
  };
}

// ============================================================
// Mirror — showTourStep() (HEALTHY, simplified)
//
// Faithful to L3809-3854 invariants for the 4 sub-checks above. Skips the
// 100ms-deferred tour-target class toggle (setTimeout) since the synchronous
// fixture surface captures the 4 chrome invariants; tour-target is part of
// the outer chrome layer exercised elsewhere.
// ============================================================
function healthyShowTourStep() {
  var bar = document.getElementById('tour-progress-bar');
  // 1a. Progress dots
  bar.innerHTML = tourSteps.map(function (_, i) {
    var cls = 'tour-progress-dot';
    if (i < tourIdx) cls += ' done';
    else if (i === tourIdx) cls += ' current';
    return '<div class="' + cls + '"></div>';
  }).join('');
  document.getElementById('tour-step').textContent =
    'PASSO ' + (tourIdx + 1) + ' DE ' + tourSteps.length +
    ' · ' + tours.find(function (t) { return t.id === currentTourId; }).name.toUpperCase();

  // 1b. Title / desc / hint / duration
  var step = tourSteps[tourIdx];
  document.getElementById('tour-title').textContent = step.title;
  document.getElementById('tour-desc').textContent  = step.desc;

  // 1c. Narration / action display toggles + text
  if (step.narration) {
    document.getElementById('tour-narration').style.display = 'block';
    document.getElementById('tour-narration-text').textContent = step.narration;
  } else {
    document.getElementById('tour-narration').style.display = 'none';
  }
  if (step.action) {
    document.getElementById('tour-action').style.display = 'flex';
    document.getElementById('tour-action-text').textContent = step.action;
  } else {
    document.getElementById('tour-action').style.display = 'none';
  }

  document.getElementById('tour-hint').textContent     = step.hint ? '💡 ' + step.hint : '';
  document.getElementById('tour-duration').textContent = step.duration || '';

  // 1d. action_set chrome ref update + rebuild
  if (step.action_set) {
    if (step.action_set.layer) {
      currentLayer = step.action_set.layer;
      updateLayerButtonsCallCount++;
    }
    if (step.action_set.view) {
      currentView = step.action_set.view;
      updateViewButtonsCallCount++;
    }
    buildCallCount++;
  }

  // Restart visibility
  if (tourIdx === tourSteps.length - 1) {
    document.getElementById('tour-restart').style.display = 'inline-block';
  } else {
    document.getElementById('tour-restart').style.display = 'none';
  }
}

// ============================================================
// Broken mutants — 4 boolean flags (one per invariant).
// ============================================================
function makeBF(opts) {
  return function () {
    if (MIRROR_REPAIRED) return healthyShowTourStep();

    var bar = document.getElementById('tour-progress-bar');
    var step = tourSteps[tourIdx];

    // 1a — progress dots + step counter
    if (!opts.dropInv1a) {
      bar.innerHTML = tourSteps.map(function (_, i) {
        var cls = 'tour-progress-dot';
        if (i < tourIdx) cls += ' done';
        else if (i === tourIdx) cls += ' current';
        return '<div class="' + cls + '"></div>';
      }).join('');
      document.getElementById('tour-step').textContent =
        'PASSO ' + (tourIdx + 1) + ' DE ' + tourSteps.length +
        ' · ' + tours.find(function (t) { return t.id === currentTourId; }).name.toUpperCase();
    }

    // 1b — title/desc/hint/duration
    if (!opts.dropInv1b) {
      document.getElementById('tour-title').textContent    = step.title;
      document.getElementById('tour-desc').textContent     = step.desc;
      document.getElementById('tour-hint').textContent     = step.hint ? '💡 ' + step.hint : '';
      document.getElementById('tour-duration').textContent = step.duration || '';
    }

    // 1c — narration + action display toggles + text
    if (!opts.dropInv1c) {
      if (step.narration) {
        document.getElementById('tour-narration').style.display = 'block';
        document.getElementById('tour-narration-text').textContent = step.narration;
      } else {
        document.getElementById('tour-narration').style.display = 'none';
      }
      if (step.action) {
        document.getElementById('tour-action').style.display = 'flex';
        document.getElementById('tour-action-text').textContent = step.action;
      } else {
        document.getElementById('tour-action').style.display = 'none';
      }
    }

    // 1d — action_set chrome ref update + build() + restart visibility
    if (!opts.dropInv1d) {
      if (step.action_set) {
        if (step.action_set.layer) {
          currentLayer = step.action_set.layer;
          updateLayerButtonsCallCount++;
        }
        if (step.action_set.view) {
          currentView = step.action_set.view;
          updateViewButtonsCallCount++;
        }
        buildCallCount++;
      }
      if (tourIdx === tourSteps.length - 1) {
        document.getElementById('tour-restart').style.display = 'inline-block';
      } else {
        document.getElementById('tour-restart').style.display = 'none';
      }
    }
  };
}

var MUTANTS = [
  { id: 'T1', fn: makeBF({ dropInv1a: true }), target: 'F1', drop: 'progress dots + step counter (1a)' },
  { id: 'T2', fn: makeBF({ dropInv1b: true }), target: 'F2', drop: 'title/desc/hint/duration writes (1b)' },
  { id: 'T3', fn: makeBF({ dropInv1c: true }), target: 'F3', drop: 'narration/action display+text (1c)' },
  { id: 'T4', fn: makeBF({ dropInv1d: true }), target: 'F4', drop: 'action_set rebuild + restart visibility (1d)' }
];

// ============================================================
// Fixtures — sourced from e55-fixtures.js via factory + deps
// ============================================================
var fx = require('./e55-fixtures.js');

// Every resetEnv() rebuilds DOM stubs, so the elementMap must be rebuilt
// after each resetEnv call. The wrapper below threads that.
var ALL_FIXTURES = fx.makeFixtures({
  resetEnv: function () { resetEnv(); rebuildElementMap(); },
  getProgressBar: getProgressBar,
  getStepCounter: getStepCounter,
  getTitle: getTitle,
  getDesc: getDesc,
  getHint: getHint,
  getDuration: getDuration,
  getNarration: getNarration,
  getAction: getAction,
  getRestart: getRestart,
  getTourStep: getTourStep,
  getTourSteps: getTourSteps,
  setTourIdx: setTourIdx
});

// Patch fixtures to rebuild the element map after each resetEnv().
// We do this by wrapping each fixture.fn with a rebuilder outer layer.
ALL_FIXTURES.forEach(function (fix) {
  var inner = fix.fn;
  fix.fn = function (renderFn) {
    rebuildElementMap();
    return inner(renderFn);
  };
});

// Wrap healthyShowTourStep with the rebuildElementMap call so the same
// mapping update applies.
var healthyWrappedShowTourStep = function () {
  rebuildElementMap();
  return healthyShowTourStep();
};

// ============================================================
// Runner
// ============================================================
var totalReports = 0;
var totalPassed = 0;
var totalFailed = 0;

console.log('=== E55 — showTourStep() chrome hook invariant ===');
console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
console.log('');

// --- Per-mutant reports ---
MUTANTS.forEach(function (mutant) {
  rebuildElementMap();
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
  console.log('[' + marker + '] ' + mutant.id + ' (broken-showTourStep, target=' + mutant.target + ', drop=' + mutant.drop + ') — issues=' + mutantIssues.length);
  if (!pass && detected) {
    mutantIssues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

// --- Per-fixture reports (control × healthy) ---
console.log('');
console.log('--- fixture × control (healthy) ---');
ALL_FIXTURES.forEach(function (fix) {
  rebuildElementMap();
  var issues = fix.fn(healthyWrappedShowTourStep);
  totalReports++;
  var passed = issues.length === 0;
  if (passed) totalPassed++; else totalFailed++;
  var marker = passed ? 'PASS' : 'FAIL';
  console.log('[' + marker + '] ' + fix.id + ' (control × healthy showTourStep) — issues=' + issues.length);
  if (!passed) {
    issues.forEach(function (iss) { console.log('         - ' + iss); });
  }
});

console.log('');
console.log('Total: ' + totalReports + ' | Passed: ' + totalPassed + ' | Failed: ' + totalFailed);
process.exit(totalFailed === 0 ? 0 : 1);
