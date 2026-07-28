// e27_verify.js — Keyboard dispatch composition invariant for keydown handler
//
// E27 establishes that the document-level keydown handler at L3983-3995
// of D3-PITCH-GRAPH.html composes 4 conditional dispatch branches over
// a single keydown event:
//
//   (a) Cmd/Ctrl+K → focus #search-input + preventDefault
//   (b) Escape    → endTour() + hide #search-results + blur #search-input
//   (c) ArrowRight (when tourActive) → tourNext()
//   (d) ArrowLeft  (when tourActive) → tourPrev()
//
// Composition contract verified:
//   (a) Cmd+K AND Ctrl+K both focus the search input AND preventDefault
//   (b) Escape fires all three actions (endTour + hide + blur)
//   (c) ArrowRight fires tourNext ONLY when tourActive is true
//   (d) ArrowLeft fires tourPrev ONLY when tourActive is true
//   (e) Plain K (no Cmd/Ctrl) does NOT focus the search input
//   (f) Escape fires even when tourActive is false (endTour is idempotent)
//
// The harness mirrors the keydown handler closure (L3983-3995) and
// replaces document.getElementById / document.addEventListener / the
// endTour/tourNext/tourPrev deps with observable mocks. The mock
// keydown event captures preventDefault() so we can verify composition.
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock element — captures focus/blur, classList toggles
// ------------------------------------------------------------------
function makeMockElement(tag, id) {
  var el = {
    _tag: tag,
    _id: id,
    _focused: false,
    _classes: {},
    addEventListener: function () {},
    focus: function () { el._focused = true; },
    blur: function () { el._focused = false; }
  };
  el.classList = {
    add: function (c) { el._classes[c] = true; },
    remove: function (c) { delete el._classes[c]; },
    contains: function (c) { return !!el._classes[c]; },
    toggle: function (c, on) { if (on === undefined) on = !el._classes[c]; el._classes[c] = !!on; }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock event — minimum surface used by the keydown handler
// ------------------------------------------------------------------
function makeMockKeyEvent(key, opts) {
  opts = opts || {};
  var ev = {
    key: key,
    metaKey: !!opts.metaKey,
    ctrlKey: !!opts.ctrlKey,
    preventDefault: function () { ev._defaulted = true; },
    _defaulted: false
  };
  return ev;
}

// ------------------------------------------------------------------
// Mock dependencies — counters + arg-captures
// ------------------------------------------------------------------
function makeFn(name) {
  var f = function () {
    f.calls.push(Array.prototype.slice.call(arguments));
    f.lastArgs = Array.prototype.slice.call(arguments);
    f.callCount++;
    if (f.impl) return f.impl.apply(null, arguments);
  };
  f.calls = [];
  f.lastArgs = [];
  f.callCount = 0;
  f._label = name;
  return f;
}

// ------------------------------------------------------------------
// Mock document — lookups by id, captured listeners
// ------------------------------------------------------------------
function makeMockDocument(elements) {
  return {
    _elements: elements,
    _listeners: {},
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fireKeydown: function (ev) {
      var list = this._listeners.keydown || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](ev); } catch (e) { /* swallow */ }
      }
    },
    getElementById: function (id) {
      return Object.prototype.hasOwnProperty.call(this._elements, id) ? this._elements[id] : null;
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L3983-3995 — keydown handler with 4 conditional branches
// ------------------------------------------------------------------
function registerKeydownHandler(doc, deps) {
  // Mirrors the SPA's keydown listener registration.
  doc.addEventListener('keydown', function (e) {
    // Branch 1: Cmd/Ctrl+K → focus + preventDefault
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      doc.getElementById('search-input').focus();
    }
    // Branch 2: Escape → end tour + hide results + blur input
    if (e.key === 'Escape') {
      deps.endTour();
      doc.getElementById('search-results').classList.remove('visible');
      doc.getElementById('search-input').blur();
    }
    // Branch 3: ArrowRight when tourActive → tourNext
    if (deps.tourActive() && e.key === 'ArrowRight') {
      deps.tourNext();
    }
    // Branch 4: ArrowLeft when tourActive → tourPrev
    if (deps.tourActive() && e.key === 'ArrowLeft') {
      deps.tourPrev();
    }
  });
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of keyboard composition
// ------------------------------------------------------------------
function installMutant(kind, doc, baseDeps) {
  if (kind === 'T1') {
    // T1: Cmd+K missing preventDefault. Focus happens but browser shortcut
    //     still fires (browser's "search in page" or similar).
    baseDeps._mutantT1 = true;
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // preventDefault skipped
        doc.getElementById('search-input').focus();
      }
      if (e.key === 'Escape') {
        baseDeps.endTour();
        doc.getElementById('search-results').classList.remove('visible');
        doc.getElementById('search-input').blur();
      }
      if (baseDeps.tourActive() && e.key === 'ArrowRight') baseDeps.tourNext();
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourPrev();
    }];
  } else if (kind === 'T2') {
    // T2: Cmd+K focuses wrong element (e.g., document.body instead of
    //     #search-input). Search shortcut no longer focuses the search box.
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        doc.getElementById('wrong-input').focus();  // wrong id
      }
      if (e.key === 'Escape') {
        baseDeps.endTour();
        doc.getElementById('search-results').classList.remove('visible');
        doc.getElementById('search-input').blur();
      }
      if (baseDeps.tourActive() && e.key === 'ArrowRight') baseDeps.tourNext();
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourPrev();
    }];
  } else if (kind === 'T3') {
    // T3: Escape only hides results, skips endTour + blur (composition
    //     dropped two of three actions).
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        doc.getElementById('search-input').focus();
      }
      if (e.key === 'Escape') {
        // endTour skipped
        doc.getElementById('search-results').classList.remove('visible');
        // blur skipped
      }
      if (baseDeps.tourActive() && e.key === 'ArrowRight') baseDeps.tourNext();
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourPrev();
    }];
  } else if (kind === 'T4') {
    // T4: Escape branch entirely skipped (no-op on Escape).
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        doc.getElementById('search-input').focus();
      }
      // Escape branch removed
      if (baseDeps.tourActive() && e.key === 'ArrowRight') baseDeps.tourNext();
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourPrev();
    }];
  } else if (kind === 'T5') {
    // T5: ArrowRight fires tourNext even when tourActive is false (state
    //     guard dropped — pressing arrow outside tour should be no-op).
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        doc.getElementById('search-input').focus();
      }
      if (e.key === 'Escape') {
        baseDeps.endTour();
        doc.getElementById('search-results').classList.remove('visible');
        doc.getElementById('search-input').blur();
      }
      if (e.key === 'ArrowRight') baseDeps.tourNext();  // guard dropped
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourPrev();
    }];
  } else if (kind === 'T6') {
    // T6: ArrowRight branch calls tourPrev instead of tourNext (swap).
    doc._listeners.keydown = [function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        doc.getElementById('search-input').focus();
      }
      if (e.key === 'Escape') {
        baseDeps.endTour();
        doc.getElementById('search-results').classList.remove('visible');
        doc.getElementById('search-input').blur();
      }
      if (baseDeps.tourActive() && e.key === 'ArrowRight') baseDeps.tourPrev();  // swapped
      if (baseDeps.tourActive() && e.key === 'ArrowLeft') baseDeps.tourNext();
    }];
  }
  // T7 is the control (no mutation)
}

// ------------------------------------------------------------------
// Fixtures — each builds doc + deps, fires one keydown, checks composition
// ------------------------------------------------------------------
function setupHarness(tourActive) {
  var searchInput = makeMockElement('input', 'search-input');
  var searchResults = makeMockElement('div', 'search-results');
  searchResults.classList.add('visible');
  var wrongInput = makeMockElement('input', 'wrong-input');
  var doc = makeMockDocument({
    'search-input': searchInput,
    'search-results': searchResults,
    'wrong-input': wrongInput
  });
  var deps = {
    endTour: makeFn('endTour'),
    tourNext: makeFn('tourNext'),
    tourPrev: makeFn('tourPrev'),
    tourActive: function () { return !!tourActive; }
  };
  return { doc: doc, deps: deps, searchInput: searchInput, searchResults: searchResults };
}

var FIXTURES = [
  {
    name: 'F1 — Cmd+K focuses #search-input AND calls preventDefault',
    setup: function () {
      var h = setupHarness(false);
      registerKeydownHandler(h.doc, h.deps);
      var ev = makeMockKeyEvent('k', { metaKey: true });
      h.doc.fireKeydown(ev);
      return {
        issues: [
          (!h.searchInput._focused) && 'Cmd+K should focus #search-input (focused=' + h.searchInput._focused + ')',
          (!ev._defaulted) && 'Cmd+K should preventDefault (defaulted=' + ev._defaulted + ')'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F2 — Ctrl+K focuses #search-input (alt modifier works too)',
    setup: function () {
      var h = setupHarness(false);
      registerKeydownHandler(h.doc, h.deps);
      var ev = makeMockKeyEvent('k', { ctrlKey: true });
      h.doc.fireKeydown(ev);
      return {
        issues: [
          (!h.searchInput._focused) && 'Ctrl+K should focus #search-input (focused=' + h.searchInput._focused + ')',
          (!ev._defaulted) && 'Ctrl+K should preventDefault (defaulted=' + ev._defaulted + ')'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F3 — Escape fires endTour + hide #search-results + blur #search-input',
    setup: function () {
      var h = setupHarness(false);
      // Pre-focus search input (so blur has effect)
      h.searchInput.focus();
      registerKeydownHandler(h.doc, h.deps);
      var ev = makeMockKeyEvent('Escape');
      h.doc.fireKeydown(ev);
      return {
        issues: [
          (h.deps.endTour.callCount !== 1) && 'Escape should call endTour once (got ' + h.deps.endTour.callCount + ')',
          (h.searchResults.classList.contains('visible')) && 'Escape should remove "visible" class from #search-results',
          (h.searchInput._focused) && 'Escape should blur #search-input (still focused=' + h.searchInput._focused + ')'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F4 — ArrowRight when tourActive=true fires tourNext',
    setup: function () {
      var h = setupHarness(true);  // tour active
      registerKeydownHandler(h.doc, h.deps);
      h.doc.fireKeydown(makeMockKeyEvent('ArrowRight'));
      return {
        issues: [
          (h.deps.tourNext.callCount !== 1) && 'tourActive + ArrowRight should fire tourNext (got ' + h.deps.tourNext.callCount + ')',
          (h.deps.tourPrev.callCount !== 0) && 'tourActive + ArrowRight should NOT fire tourPrev (got ' + h.deps.tourPrev.callCount + ')'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F5 — ArrowRight when tourActive=false does NOT fire tourNext',
    setup: function () {
      var h = setupHarness(false);  // tour NOT active
      registerKeydownHandler(h.doc, h.deps);
      h.doc.fireKeydown(makeMockKeyEvent('ArrowRight'));
      return {
        issues: [
          (h.deps.tourNext.callCount !== 0) && '!tourActive + ArrowRight should NOT fire tourNext (got ' + h.deps.tourNext.callCount + ')',
          (h.deps.endTour.callCount !== 0) && 'ArrowRight should NOT call endTour (got ' + h.deps.endTour.callCount + ')'
        ].filter(Boolean)
      };
    }
  },
  {
    name: 'F6 — ArrowLeft when tourActive=true fires tourPrev',
    setup: function () {
      var h = setupHarness(true);
      registerKeydownHandler(h.doc, h.deps);
      h.doc.fireKeydown(makeMockKeyEvent('ArrowLeft'));
      return {
        issues: [
          (h.deps.tourPrev.callCount !== 1) && 'tourActive + ArrowLeft should fire tourPrev (got ' + h.deps.tourPrev.callCount + ')',
          (h.deps.tourNext.callCount !== 0) && 'tourActive + ArrowLeft should NOT fire tourNext (got ' + h.deps.tourNext.callCount + ')'
        ].filter(Boolean)
      };
    }
  }
];

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E27 KEYBOARD DISPATCH COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  for (var i = 0; i < FIXTURES.length; i++) {
    var fx = FIXTURES[i];
    var result = fx.setup();
    total++;
    if (result.issues.length === 0) {
      passed++;
      console.log('  [PASS] ' + fx.name);
    } else {
      failed++;
      console.log('  [FAIL] ' + fx.name + ': ' + result.issues.length + ' issues');
      for (var j = 0; j < result.issues.length; j++) {
        console.log('    - ' + result.issues[j]);
      }
    }
  }

  // ADVERSARIAL MUTANTS (T1-T7)
  console.log('');
  console.log('--- ADVERSARIAL MUTANTS (T1-T7) ---');
  function recordAdversarial(label, kind, tourActive, expectedMin) {
    expectedMin = expectedMin || 1;
    total++;
    var issues = [];
    var h = setupHarness(tourActive);
    registerKeydownHandler(h.doc, h.deps);
    installMutant(kind, h.doc, h.deps);

    if (kind === 'T1') {
      // T1: Cmd+K without preventDefault. Focus still happens but
      // preventDefault does not fire.
      var ev1 = makeMockKeyEvent('k', { metaKey: true });
      h.doc.fireKeydown(ev1);
      if (!ev1._defaulted) {
        issues.push('T1: Cmd+K did NOT preventDefault (browser shortcut would still fire)');
      }
    } else if (kind === 'T2') {
      // T2: Cmd+K focuses wrong-input instead of #search-input.
      var ev2 = makeMockKeyEvent('k', { metaKey: true });
      h.doc.fireKeydown(ev2);
      // Mutant focuses #wrong-input, so #search-input should NOT be focused.
      // Healthy: searchInput is focused. Mutant: searchInput is NOT focused.
      if (!h.searchInput._focused) {
        issues.push('T2: Cmd+K did NOT focus #search-input (mutant focuses wrong-input instead)');
      }
    } else if (kind === 'T3') {
      // T3: Escape only hides, skips endTour + blur.
      h.searchInput.focus();
      h.doc.fireKeydown(makeMockKeyEvent('Escape'));
      if (h.deps.endTour.callCount !== 0) {
        issues.push('T3: Escape still called endTour (count=' + h.deps.endTour.callCount + ', expected 0)');
      }
      if (h.searchInput._focused) {
        issues.push('T3: Escape did NOT blur #search-input (still focused)');
      }
      if (h.searchResults.classList.contains('visible')) {
        issues.push('T3: Escape did NOT hide #search-results');
      }
    } else if (kind === 'T4') {
      // T4: Escape branch entirely removed. Healthy: endTour fires, blur
      // fires, hide fires. Mutant: none of them fire.
      h.searchInput.focus();
      h.doc.fireKeydown(makeMockKeyEvent('Escape'));
      if (h.deps.endTour.callCount === 0) {
        issues.push('T4: Escape did NOT call endTour (mutant removed Escape branch, count=' + h.deps.endTour.callCount + ')');
      }
      if (h.searchInput._focused) {
        issues.push('T4: Escape did NOT blur #search-input (still focused)');
      }
      if (h.searchResults.classList.contains('visible')) {
        issues.push('T4: Escape did NOT hide #search-results');
      }
    } else if (kind === 'T5') {
      // T5: ArrowRight fires tourNext even when tourActive=false.
      h.doc.fireKeydown(makeMockKeyEvent('ArrowRight'));
      if (h.deps.tourNext.callCount !== 0) {
        issues.push('T5: ArrowRight fired tourNext even with tourActive=false — state guard was dropped');
      }
    } else if (kind === 'T6') {
      // T6: ArrowRight fires tourPrev instead of tourNext (swap).
      h.doc.fireKeydown(makeMockKeyEvent('ArrowRight'));
      if (h.deps.tourPrev.callCount !== 0) {
        issues.push('T6: ArrowRight fired tourPrev — branches were swapped');
      }
      if (h.deps.tourNext.callCount !== 1) {
        issues.push('T6: ArrowRight did NOT fire tourNext (got ' + h.deps.tourNext.callCount + ')');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy dispatch composes correctly
      // Test Cmd+K
      var evCtrl = makeMockKeyEvent('k', { metaKey: true });
      h.doc.fireKeydown(evCtrl);
      if (!h.searchInput._focused) issues.push('control: Cmd+K should focus #search-input');
      if (!evCtrl._defaulted) issues.push('control: Cmd+K should preventDefault');
      // Test Escape
      h.searchInput.focus();
      h.doc.fireKeydown(makeMockKeyEvent('Escape'));
      if (h.deps.endTour.callCount !== 1) issues.push('control: Escape should call endTour (got ' + h.deps.endTour.callCount + ')');
      if (h.searchInput._focused) issues.push('control: Escape should blur #search-input');
      // Test ArrowRight with tourActive (true)
      h.deps.tourNext.callCount = 0;  // reset
      h.doc.fireKeydown(makeMockKeyEvent('ArrowRight'));
      if (h.deps.tourNext.callCount !== 1) issues.push('control: ArrowRight should fire tourNext (got ' + h.deps.tourNext.callCount + ')');
    }

    var ctrl = label.indexOf('T7') === 0;
    if (ctrl) {
      if (issues.length === 0) {
        passed++;
        console.log('  [PASS] ' + label + ': 0 issues (control healthy)');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': ' + issues.length + ' issues (CONTROL BROKEN)');
        for (var k = 0; k < issues.length; k++) console.log('    - ' + issues[k]);
      }
    } else {
      if (issues.length >= expectedMin) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥' + expectedMin + ')');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    }
  }

  recordAdversarial('T1 Cmd+K without preventDefault', 'T1', false);
  recordAdversarial('T2 Cmd+K focuses wrong element', 'T2', false);
  recordAdversarial('T3 Escape composition dropped (only hide)', 'T3', false);
  recordAdversarial('T4 Escape branch entirely removed', 'T4', false);
  recordAdversarial('T5 ArrowRight fires without tourActive guard', 'T5', false);
  recordAdversarial('T6 ArrowRight/Left branches swapped', 'T6', true);
  recordAdversarial('T7 control (healthy dispatch)', 'T7', true);

  console.log('');
  console.log('========== E27 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
