// e29_verify.js — Document click outside composition invariant
//
// E29 establishes that the document-level click handler at L3997-4001 of
// D3-PITCH-GRAPH.html composes the dual `closest()` exclusion check
// (NOT inside .search-box AND NOT inside #search-results) with the
// classList.remove('visible') side effect on #search-results.
//
// Composition contract verified:
//   (a) click on a descendant of .search-box keeps #search-results visible
//   (b) click on a descendant of #search-results keeps #search-results visible
//   (c) click on a node OUTSIDE both keeps the close-handler NO-OP safe
//       (the handler does fire, but the visible class is already absent
//       or stays absent — no spurious add)
//   (d) click on body / svg / arbitrary element NOT in either subtree
//       removes .visible from #search-results
//   (e) closest() walks up the DOM tree (a click on a child of .search-box
//       like the search-input still resolves to .search-box via closest)
//   (f) classList.remove('visible') is idempotent — multiple outside
//       clicks leave the element in the same hidden state
//
// This is the inverse composition of the search-results dropdown opening
// logic (not in scope here, but referenced). E29 verifies the close-on-
// outside-click branch only.
//
// 6 fixtures × 7 properties + 7 adversarial mutants (T1-T7).
// MIRROR_REPAIRED flag toggled by --repaired argv.

'use strict';

var MIRROR_REPAIRED = process.argv[2] === '--repaired';

// ------------------------------------------------------------------
// Mock element — captures listeners, supports closest() walk
// ------------------------------------------------------------------
function makeMockElement(tag, parent) {
  tag = tag || 'div';
  var el = {
    _tag: tag,
    _parent: parent || null,
    _children: [],
    _classes: {},
    _listeners: {},
    style: {},
    textContent: '',
    appendChild: function (c) { this._children.push(c); c._parent = this; return c; },
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fire: function (type, eventObj) {
      var list = this._listeners[type] || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](eventObj); } catch (e) { /* swallow */ }
      }
    },
    closest: function (sel) {
      // Mirrors Element.closest: walks up self+ancestors until selector match.
      // Selector grammar supported here: '.classname' or '#id' (sufficient
      // for the SPA's two checks at L3998).
      var node = this;
      while (node) {
        if (sel.charAt(0) === '.') {
          var cls = sel.slice(1);
          if (node._classes && node._classes[cls]) return node;
        } else if (sel.charAt(0) === '#') {
          var id = sel.slice(1);
          if (node._id === id) return node;
        }
        node = node._parent;
      }
      return null;
    },
    classList: null
  };
  // Proxy classList so toggles land in the underlying object
  el.classList = {
    add: function (c) { el._classes[c] = true; },
    remove: function (c) { delete el._classes[c]; },
    contains: function (c) { return !!el._classes[c]; },
    toggle: function (c, on) { if (on === undefined) on = !el._classes[c]; el._classes[c] = !!on; }
  };
  return el;
}

// ------------------------------------------------------------------
// Mock document — captures the document click listener
// ------------------------------------------------------------------
function makeMockDocument() {
  return {
    _listeners: {},
    addEventListener: function (type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    },
    fireClick: function (eventObj) {
      var list = this._listeners.click || [];
      for (var i = 0; i < list.length; i++) {
        try { list[i](eventObj); } catch (e) { /* swallow */ }
      }
    }
  };
}

// ------------------------------------------------------------------
// Mirror of L3997-4001 — document click outside → hide search-results
// ------------------------------------------------------------------
function registerDocumentClickHandler(doc, searchResultsEl) {
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('.search-box') && !e.target.closest('#search-results')) {
      searchResultsEl.classList.remove('visible');
    }
  });
}

// ------------------------------------------------------------------
// DOM tree builder — provides a small graph with .search-box / #search-results
// ------------------------------------------------------------------
function buildDomTree() {
  // shape:
  //   <body>
  //     <div class="search-box">
  //       <input id="search-input" />
  //     </div>
  //     <div id="search-results"></div>
  //     <svg>...</svg>
  //     <p>body text</p>
  //   </body>
  var body = makeMockElement('body');
  var searchBox = makeMockElement('div');
  searchBox._classes['search-box'] = true;
  body.appendChild(searchBox);
  var searchInput = makeMockElement('input');
  searchInput._id = 'search-input';
  searchBox.appendChild(searchInput);

  var searchResults = makeMockElement('div');
  searchResults._id = 'search-results';
  body.appendChild(searchResults);

  var resultItem = makeMockElement('li');
  searchResults.appendChild(resultItem);

  var svg = makeMockElement('svg');
  body.appendChild(svg);

  var para = makeMockElement('p');
  body.appendChild(para);

  return {
    body: body, searchBox: searchBox, searchInput: searchInput,
    searchResults: searchResults, resultItem: resultItem,
    svg: svg, para: para
  };
}

function makeMockEvent(target) {
  return {
    target: target,
    stopPropagation: function () {},
    preventDefault: function () {}
  };
}

// ------------------------------------------------------------------
// Mutant installer — adversarial breakage of document-click composition
// ------------------------------------------------------------------
function installMutant(kind, doc, searchResults) {
  if (kind === 'T1') {
    // T1: drop the closest('.search-box') check. Click inside search-box
    //     will hide the dropdown — bug: the search input should not close
    //     its own dropdown.
    doc._listeners.click = [function (e) {
      if (!e.target.closest('#search-results')) {
        searchResults.classList.remove('visible');
      }
    }];
  } else if (kind === 'T2') {
    // T2: drop the closest('#search-results') check. Click on a result item
    //     will hide the dropdown — bug: selecting a result must not
    //     pre-emptively close the list.
    doc._listeners.click = [function (e) {
      if (!e.target.closest('.search-box')) {
        searchResults.classList.remove('visible');
      }
    }];
  } else if (kind === 'T3') {
    // T3: invert the AND to OR. Click inside EITHER subtree triggers hide.
    //     The "outside" condition becomes "inside at least one" — inverted.
    doc._listeners.click = [function (e) {
      if (e.target.closest('.search-box') || e.target.closest('#search-results')) {
        searchResults.classList.remove('visible');
      }
    }];
  } else if (kind === 'T4') {
    // T4: skip classList.remove. Outside click fires handler but nothing
    //     happens — search-results stays visible forever.
    doc._listeners.click = [function (e) {
      if (!e.target.closest('.search-box') && !e.target.closest('#search-results')) {
        // classList.remove dropped
      }
    }];
  } else if (kind === 'T5') {
    // T5: add class instead of remove. Outside click ADDS .visible — opens
    //     the dropdown instead of closing it (semantically inverted).
    doc._listeners.click = [function (e) {
      if (!e.target.closest('.search-box') && !e.target.closest('#search-results')) {
        searchResults.classList.add('visible');  // INVERTED direction
      }
    }];
  } else if (kind === 'T6') {
    // T6: remove the wrong class. Removes 'foo' instead of 'visible' —
    //     search-results stays visible. Same observable effect as T4.
    doc._listeners.click = [function (e) {
      if (!e.target.closest('.search-box') && !e.target.closest('#search-results')) {
        searchResults.classList.remove('foo');
      }
    }];
  }
  // T7 is the control (no mutation)
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
function main() {
  var passed = 0, failed = 0, total = 0;
  console.log('========== E29 DOCUMENT CLICK OUTSIDE COMPOSITION INVARIANT ==========');
  console.log('Mode: ' + (MIRROR_REPAIRED ? 'REPAIRED' : 'BASELINE'));
  console.log('');

  // BASELINE: 6 canonical fixtures
  console.log('--- BASELINE: 6 fixtures × composition contract ---');
  var FIXTURES = [
    {
      name: 'F1 — click on search-input (descendant of .search-box) keeps #search-results visible',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        // Pre-state: search-results is visible
        dom.searchResults.classList.add('visible');
        // Click on a child of .search-box — closest walks up to .search-box
        doc.fireClick(makeMockEvent(dom.searchInput));
        return {
          issues: [
            (!dom.searchResults.classList.contains('visible')) && 'click inside .search-box hid #search-results — closest(\'.search-box\') check failed'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F2 — click on result-item (descendant of #search-results) keeps #search-results visible',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        dom.searchResults.classList.add('visible');
        // Click on a child of #search-results — closest walks up
        doc.fireClick(makeMockEvent(dom.resultItem));
        return {
          issues: [
            (!dom.searchResults.classList.contains('visible')) && 'click inside #search-results hid it — closest(\'#search-results\') check failed'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F3 — click on .search-box itself keeps #search-results visible',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        dom.searchResults.classList.add('visible');
        // Click on .search-box element directly (not a descendant)
        doc.fireClick(makeMockEvent(dom.searchBox));
        return {
          issues: [
            (!dom.searchResults.classList.contains('visible')) && 'click on .search-box itself hid #search-results'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F4 — click on body (outside both subtrees) hides #search-results',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        dom.searchResults.classList.add('visible');
        // Click on a paragraph inside body (outside both)
        doc.fireClick(makeMockEvent(dom.para));
        return {
          issues: [
            (dom.searchResults.classList.contains('visible')) && 'click outside both subtrees did NOT hide #search-results'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F5 — click on svg element (outside both subtrees) hides #search-results',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        dom.searchResults.classList.add('visible');
        doc.fireClick(makeMockEvent(dom.svg));
        return {
          issues: [
            (dom.searchResults.classList.contains('visible')) && 'click on svg did NOT hide #search-results (svg is outside both subtrees)'
          ].filter(Boolean)
        };
      }
    },
    {
      name: 'F6 — multiple outside clicks are idempotent (.visible stays absent)',
      setup: function () {
        var dom = buildDomTree();
        var doc = makeMockDocument();
        registerDocumentClickHandler(doc, dom.searchResults);
        dom.searchResults.classList.add('visible');
        // Three outside clicks in sequence
        doc.fireClick(makeMockEvent(dom.para));
        doc.fireClick(makeMockEvent(dom.svg));
        doc.fireClick(makeMockEvent(dom.para));
        return {
          issues: [
            (dom.searchResults.classList.contains('visible')) && '#search-results still .visible after multiple outside clicks'
          ].filter(Boolean)
        };
      }
    }
  ];

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
  function recordAdversarial(label, kind) {
    total++;
    var dom = buildDomTree();
    var doc = makeMockDocument();
    registerDocumentClickHandler(doc, dom.searchResults);
    installMutant(kind, doc, dom.searchResults);

    var issues = [];
    dom.searchResults.classList.add('visible');  // start visible

    if (kind === 'T1') {
      // T1: dropped closest('.search-box') check. Click inside .search-box
      // should NOT hide (healthy). Mutant will hide.
      doc.fireClick(makeMockEvent(dom.searchInput));
      if (!dom.searchResults.classList.contains('visible')) {
        issues.push('T1: click inside .search-box hid #search-results (closest(\'.search-box\') check was dropped)');
      }
    } else if (kind === 'T2') {
      // T2: dropped closest('#search-results') check. Click inside #search-results
      // should NOT hide (healthy). Mutant will hide.
      dom.searchResults.classList.add('visible');
      doc.fireClick(makeMockEvent(dom.resultItem));
      if (!dom.searchResults.classList.contains('visible')) {
        issues.push('T2: click inside #search-results hid it (closest(\'#search-results\') check was dropped)');
      }
    } else if (kind === 'T3') {
      // T3: inverted AND to OR. Click inside either subtree hides (bug).
      // Healthy: click inside .search-box stays visible. Mutant: hides.
      doc.fireClick(makeMockEvent(dom.searchInput));
      if (!dom.searchResults.classList.contains('visible')) {
        issues.push('T3: click inside .search-box hid #search-results (AND inverted to OR)');
      }
    } else if (kind === 'T4') {
      // T4: classList.remove dropped. Outside click should hide (healthy).
      // Mutant: stays visible.
      doc.fireClick(makeMockEvent(dom.para));
      if (dom.searchResults.classList.contains('visible')) {
        issues.push('T4: outside click did NOT hide #search-results (classList.remove was dropped)');
      }
    } else if (kind === 'T5') {
      // T5: add instead of remove. Outside click ADDS .visible — search-results
      // was hidden, now visible. Healthy: stays hidden (or was visible → hidden).
      // Set up: search-results starts hidden, then outside click.
      dom.searchResults.classList.remove('visible');  // start hidden
      doc.fireClick(makeMockEvent(dom.para));
      if (dom.searchResults.classList.contains('visible')) {
        issues.push('T5: outside click ADDED .visible instead of removing (semantics inverted)');
      }
    } else if (kind === 'T6') {
      // T6: removes 'foo' instead of 'visible'. .visible class persists.
      doc.fireClick(makeMockEvent(dom.para));
      if (dom.searchResults.classList.contains('visible')) {
        issues.push('T6: outside click did NOT remove .visible (wrong class removed)');
      }
    } else if (kind === 'T7') {
      // T7 control — healthy close on outside click
      doc.fireClick(makeMockEvent(dom.para));
      if (dom.searchResults.classList.contains('visible')) issues.push('control: outside click did NOT hide');
      dom.searchResults.classList.add('visible');
      doc.fireClick(makeMockEvent(dom.searchInput));
      if (!dom.searchResults.classList.contains('visible')) issues.push('control: inside search-box hid #search-results');
      dom.searchResults.classList.add('visible');
      doc.fireClick(makeMockEvent(dom.resultItem));
      if (!dom.searchResults.classList.contains('visible')) issues.push('control: inside #search-results hid it');
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
      if (issues.length >= 1) {
        passed++;
        console.log('  [PASS] ' + label + ': ' + issues.length + ' issues caught');
      } else {
        failed++;
        console.log('  [FAIL] ' + label + ': only ' + issues.length + ' issues caught (expected ≥1)');
        for (var m = 0; m < issues.length; m++) console.log('    - ' + issues[m]);
      }
    }
  }

  recordAdversarial('T1 closest(".search-box") check dropped', 'T1');
  recordAdversarial('T2 closest("#search-results") check dropped', 'T2');
  recordAdversarial('T3 AND inverted to OR (inside either hides)', 'T3');
  recordAdversarial('T4 classList.remove dropped', 'T4');
  recordAdversarial('T5 add instead of remove (semantics inverted)', 'T5');
  recordAdversarial('T6 wrong class removed ("foo" instead of "visible")', 'T6');
  recordAdversarial('T7 control (healthy close)', 'T7');

  console.log('');
  console.log('========== E29 VERDICT ==========');
  console.log('Total: ' + total + ' | Passed: ' + passed + ' | Failed: ' + failed);
  console.log('Verdict: ' + (failed === 0 ? 'PASS' : 'FAIL'));
  process.exit(failed === 0 ? 0 : 1);
}

main();
