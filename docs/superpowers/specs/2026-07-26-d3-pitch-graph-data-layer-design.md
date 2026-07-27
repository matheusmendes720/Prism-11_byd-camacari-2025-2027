# D3 Pitch Graph — Data Layer Refactor (Design)

**Date:** 2026-07-26
**Branch:** `refactor/d3-pitch-graph-data-layer`
**Owner:** Matheus Mendes
**Skill context:** Brainstorming (terminal step before writing-plans)

---

## 1. Problem statement

`D3-PITCH-GRAPH.html` is a single-file SPA knowledge graph for the BYD Camaçari
D3 framework (5-layer / 11-dim / 9-view). Today, all data lives in 7 hardcoded
JavaScript dictionaries (`dimData`, `dataNodes`, `decisionTrees`, `actions`,
`couplings`, `gates`, `personas`). There is a canonical JSON source
(`D3-KNOWLEDGE-GRAPH.json`) but the HTML never reads it.

Three root causes make today’s renderer unable to consume the JSON source of
truth:

| # | Root cause | Evidence |
|---|------------|----------|
| 1 | ID prefix mismatch — renderer synthesises `D-PTAX`/`A-0`/`FW-G0`, JSON uses `PTAX`/`ACT_HEDGE`/`G0`. Lookups silently miss. | audit a2f900be |
| 2 | Field-name mismatch — `showDetail` reads `explain`/`whyItMatters`/`realImpact`/`glossary`; dicts use `whatIsIt`/`executiveSummary`/`technicalSpec`/`operationalPlaybook`/`risks`. | audit a16284f4 |
| 3 | Coverage gap — `showDetail` consults 4 of 7 dictionaries; `gates`, `personas`, `couplings` unreachable from the panel. | audit a16284f4 |

A 7th audit (HTML consumer coverage, `accb848286a0b77bf`) found the renderer
is a husk as a JSON consumer even after a data-only swap:

- 9 of 14 base envelope fields are **NO-OP** (≈64 % silent loss)
- 12 of 12 proposed section kinds are **NO-OP** (panels ignore `n.data.sections`)
- Edge `type` vocabulary 100 % collapses to neutral stroke (15 JSON types vs 6 renderer types)
- Tour step field names (`node`/`say`) do not match renderer expectations
- Build stamp hardcoded at line 405 — never re-derived from `meta.*`
- Status normalisation fails on uppercase + compound strings (`AMBER→RED jan/2027`)

The refactor must therefore redesign the data layer **and surgically rewrite
the renderer surface area** in lockstep.

---

## 2. Goals & non-goals

### Goals
- Single source of truth in `D3-KNOWLEDGE-GRAPH.json` (v2.0.1 → v3.0.0)
- HTML embeds JSON via `<script type="application/json">` (no build step)
- Schema-versioned (`schema_version: "1.0.0"` top-level)
- Per-category required/optional declarations inline (`category_schema`)
- Tiered validation: hard-stop / warn / silent
- Feature-flagged rollout (`USE_JSON_DATA`)
- Renderer becomes a generic JSON consumer; `showDetail` is a section dispatcher
- 14 + 1 edge types with distinct visual styles
- Phase gates and condition gates unified under `cat: "gate"` with `kind` discriminator
- Tours live in a separated struct (NOT under `category_schema`)

### Non-goals
- Build step, bundler, or transpiler — the SPA stays single-file
- Migration of non-D3-pitch artefacts (`D3-MAIN.html`, `D3-DASHBOARD.html` etc.)
- LLM-driven content authoring (humans remain the source of new gates/sections)
- Real-time sync between JSON edits and renderer (auto-reload is not required)

---

## 3. Design overview

```
┌────────────────────────────────────────────────────────────┐
│ D3-KNOWLEDGE-GRAPH.json (canonical, disk)                  │
│  schema_version, meta, categories, category_schema,       │
│  nodes[96], edges[97], personas[8], tours[4]               │
└───────────────────────┬────────────────────────────────────┘
                        │ validator (tiered)
                        ▼
┌────────────────────────────────────────────────────────────┐
│ HTML <script type="application/json">…</script>            │
│   USE_JSON_DATA gate                                       │
│   legacy dicts preserved (USE_JSON_DATA=false fallback)     │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ Renderer (this is what gets rewritten)                     │
│  getElementsForView  — unified loop over JSON nodes        │
│  showDetail          — generic sections[] dispatcher       │
│  edge dispatcher     — 15 types → 7 visual styles           │
│  status normaliser   — uppercase / compound → canonical     │
│  tour modal          — selector populated, step translator │
│  build stamp         — meta.* driven                       │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Top-level shape (v1.0.0)

```jsonc
{
  "schema_version": "1.0.0",
  "meta": {
    "version": "3.0.0",
    "date": "2026-07-26",
    "stats": {
      "nodes": 95,        // auto-recomputed; warn if drift
      "edges": 142,       // current JSON: 97 (drift to be flagged)
      "sessions": 6,
      "couplings": 20     // current JSON: 16
    }
  },
  "categories": [
    "session", "dimension", "coupling",
    "action_strategic", "action_tactical", "action_operational",
    "persona", "gate", "risk", "metric"
  ],
  "category_schema": {
    "<cat>": { "required": [...], "optional": [...] }
  },
  "nodes":    [ /* uniform envelope + cat-specific extensions */ ],
  "edges":    [ { "from": "...", "to": "...", "type": "...", "label": "?", "via": "?" } ],
  "personas": [ /* UI audience selector — NOT graph nodes */ ],
  "tours":    [ /* separated struct — NOT under category_schema */ ]
}
```

### 4.1 `tours` separation contract
Tours are validated as their own top-level array, NOT catalogued under
`category_schema`. Each tour is `{ id, title, audience[], steps[{ nodeId,
narration, action?, hint? }] }`. Field-name alignment with renderer is part
of the migration (Section 6.5).

### 4.2 `personas` separation contract
Personas (top-level) are the UI audience selector — the same array consumed by
`D3-UNDERSTAND-ANYTHING.html` lines 167–176. They are validated as
`{ level, label, detail, audience[] }`. The renderer’s `personas` *graph
nodes* (`cat: "persona"`) are a separate path inside `nodes[]`.

---

## 5. Node envelope

### 5.1 Base fields (14)

```
{ id, cat, label, size, desc, body, sections, status, score, owner,
  deadline, cost, depends_on, tags, ...cat-specific }
```

`desc` (≤ 200 char headline) and `body` (1–3 paragraph pitch) are kept as
**separate envelope fields** — dimData carries two distinct text registers,
collapsing loses coupling hints.

### 5.2 `category_schema` requirements (per category)

| Category | Required | Optional |
|----------|----------|----------|
| `session` | id, cat, label, size, desc | body, sections, status, owner, deadline, tags |
| `dimension` | + score, status, weight | body, sections, branches, cost, depends_on |
| `coupling` | + kind (`multiplicative\|boolean\|ratio\|qualitative`) | multiplier (only when multiplicative), body, sections, depends_on |
| `action_*` (E/T/O) | + owner, deadline, cost | body, sections, depends_on, tags, risk, score |
| `persona` | + level (`board\|executive\|operational\|external`) | role, sections, actions |
| `gate` | + kind (`phase\|condition`), criteria | owner, timeline, value, satisfied_by, enables, sections |
| `risk` | + severity, likelihood (`certain\|high\|medium\|low`) | kill_switch, trigger, probability, sections |
| `metric` | + target, value | body, sections, formula, parameters, frequency |

### 5.3 ID prefixes (already conformant in JSON)

`S_` session · `D_` dimension · `C_` coupling · `A_E/A_T/A_O` action ·
`P_` persona · `G_` gate · `R_` risk · `M_` metric. **Zero migration on
prefixes.** Renderer must drop the legacy `D-PTAX` / `A-0` / `FW-G0`
transform.

---

## 6. Section kinds (12)

Sub-payloads nest inside each kind. Sub-payloads are validated through the
`category_schema` and treated as opaque to the dispatch loop.

| Kind | Sub-payload (nested) |
|------|---------------------|
| `what-it-is` | `{ summary }` |
| `why-it-matters` | `{ stakes }` |
| `real-impact` | `{ narrative }` |
| `executive-summary` | `{ narration, say }` |
| `technical-spec` | `{ formula, parameters, numerical }` |
| `operational-playbook` | `{ frequency, systemStack, inputs, outputs, dependencies }` |
| `risks` | `{ items: [ {desc, severity} ] }` |
| `branches` | `{ items: [ {label, desc} ] }` |
| `glossary` | `{ items: [ {term, def} ] }` |
| `data-sources` | `{ items: [ {src, type} ] }` — `type: "audit"` flags an audit-trail row |
| `success-metric` | `{ metric, roiCalculation }` |
| `rollback-plan` | `{ failureMode, contingency }` |

> Tours are not a section kind. They are a sub-structure of the `tour[]`
> envelope (Section 9).

---

## 7. Edge types (15)

The renderer currently knows 6 visual styles. The schema declares 15 types
(`session` confirmed 15th — currently emitted 6× in JSON, was missing from
the original 14-type list):

### 7.1 Mapping table

| JSON `type` | Renderer visual style |
|-------------|----------------------|
| `session`   | primary |
| `contains`  | primary |
| `composes`  | primary |
| `via`       | critical |
| `risk`      | critical |
| `blocks`    | critical |
| `unlocks`   | gate |
| `enables`   | gate |
| `satisfies` | gate |
| `informs`   | secondary |
| `mitigates` | secondary |
| `input`     | data |
| `feeds`     | data |
| `supports`  | data |
| `owned-by`  | persona |

Add `arr-risk` arrowhead marker for `type: "risk"` edges (currently silent
fallthrough).

---

## 8. Gate discriminator

`cat: "gate"` with `kind: "phase" | "condition"` discriminator.

- **Phase gates** (`G_PHASE_0`…`G_PHASE_3`) — currently HTML-only, must be
  authored into the JSON. Drive the left rail.
- **Condition gates** (`G_G1`…`G_G9`) — currently JSON-only, must be
  rendered on rail 2.

**Structural gap to flag in `decision-framework/CLAUDE.md`:** the
5-layer/11-dim framework describes no gate dimension. The D3 pitch graph
treats gates as a 12th dimension that exists outside the 11-dim composite.
This is a known structural drift, not a defect of this refactor.

---

## 9. Tours (separated struct)

Top-level `tours[]`, validated independently from `nodes[]`. Field-name
alignment with renderer is part of the migration contract:

| Concept | JSON field (target) | Renderer current field |
|---------|---------------------|------------------------|
| Step target | `nodeId` | `nodeId` (renderer) — **rename in JSON** |
| Voice-over | `narration` | `desc` (renderer fallback) + `narration` |
| Show-and-tell action | `action` | `action` |
| Hint chip | `hint` | — (new) |

Renderer expects `step.nodeId`/`step.desc`/`step.narration`/`step.action`.
JSON today emits `step.node`/`step.say` — that mismatch is fatal and is
addressed in migration step 14.

---

## 10. Validation (tiered)

1. **Hard-stop** — malformed JSON, missing required fields, dangling edge
   endpoints, broken `via` refs.
2. **Warn** — optional-field drift, `meta.stats` count drift
   (auto-recompute + warn).
3. **Silent** — advisory only (deprecation, soft conventions).

Validator is invoked at HTML boot, **before** the first render — never
mid-render.

---

## 11. Feature flag

`USE_JSON_DATA` (boolean) defaults to `false` during transition. Legacy
hardcoded dicts remain the live renderer until step 9 of the migration
passes end-to-end verification. Flipping the flag too early would break
the detail panel — see Section 12 for ordering.

---

## 12. Migration mapping (HIGH/MEDIUM/LOW confidence)

The 7 fan-out audits are the load-bearing evidence. Each migration step cites
the audit it depends on.

### 12.1 HIGH confidence (mechanical, low blast radius)

1. **Embed canonical JSON** — `<script type="application/json">` block in
   `<head>`, parsed once at boot. (audit a8878a67 confirms JSON is
   parseable; no data fix needed.)
2. **Feature flag** — `USE_JSON_DATA = false` default. Legacy path wired
   unchanged. (Sets up the kill switch.)
3. **`normaliseStatus(s)`** — lowercase, strip `*`, strip
   `→RED <month/year>` suffix. Returns canonical `{green|amber|red|null}`.
4. **Wire `meta.*` to build stamp (line 405)** — replace hardcoded string
   with `meta.version + meta.date + byte size`.
5. **Validator auto-recomputes `meta.stats`** — runs a node/edge/session/
   coupling count and warns on drift (today meta says 95/142/6/20, JSON
   has 96/97/7/16 — drift in 4 of 6 counters).

### 12.2 MEDIUM confidence (renderer surgery, tested per edit)

6. **Generic `sections[]` dispatcher** in `showDetail` — replace 5 fixed
   wrappers (header / O que é / Por que importa / Impacto real / Glossário)
   with `n.data.sections.map(s => renderSection(s.kind, s.payload))`.
   Mapping table maps the 12 section kinds to renderer wrappers. **Without
   this step, no JSON node renders richly.** (audit accb84828 §6)
7. **cat → ntype mapping + unified `getElementsForView`** — iterate over
   JSON nodes once; map `cat` to view-layer / ntype; preserve the
   `ntype` enum (`session`/`dimension`/`data`/`tree`/`action`/`coupling`/
   `gate`/`persona`/`risk`/`metric`). (audit accb84828 §5)
8. **Edge type → visual mapping** — 15 → 7 styles; add `arr-risk`
   arrowhead. (audit aead5f36 + accb84828 §4)
9. **Drop ID prefix transform** — `n.id` is now the JSON-derived ID; drop
   `D-` / `A-` / `FW-G` prefixes. Fix `showDetail` lookups across
   `dataNodes`/`actions`/`gates`. (audit a2f900be + accb84828 §1)

### 12.3 LOW confidence (content authoring + render)

10. **Author 4 phase gate nodes** (`G_PHASE_0`…`G_PHASE_3`) with sections.
11. **Author condition gate sections** for the 9 `G_G*` condition nodes
    (criteria, satisfied-by, enables, branches).
12. **Add phase→phase sequence edges** (`G_PHASE_0 → 1 → 2 → 3`).
13. **Tour step field translator + populate `#tour-selector-grid`** —
    renderer's tour modal currently reads only `tours[0].id`. Step 13
    wires the selector and translates `node`→`nodeId`, `say`→
    `desc+narration`. (audit accb84828 §1.4, §1.5)
14. **Persona viewer rewrite** — read JSON `nodes[]` of `cat: "persona"`
    (currently `level`/`label`/`detail` only) and the separated
    top-level `personas[]` (UI audience selector) on different paths.
    (audit accb84828 §1.4)

### 12.4 Dependency graph

- Steps 6–9 require steps 1–5 first (otherwise no JSON to render).
- Steps 10–12 (gate content) are independent writes — can land in any
  order.
- Step 13 depends on step 6 (generic section dispatcher handles
  `executive-summary`-flavored tour narration).
- Step 14 is independent of steps 6–9 but reuses the cat→ntype mapping
  pattern from step 7.

### 12.5 Rollout gate

Renderer surgery steps 6–9 cannot ship without steps 1–5 in place. Feature
flag flips to `true` ONLY after step 9 verified end-to-end: all 95 nodes
render with category-agnostic panels, 14+1 edge types render distinct
strokes, status colours normalised, tour modal functional.

### 12.6 Validation criteria per rollout stage

| Stage | Steps | Pass criteria |
|-------|-------|---------------|
| Stage 1 — embedded data | 1–5 | HTML loads JSON without errors; `USE_JSON_DATA=false` preserves legacy render; build stamp updates from `meta.*` |
| Stage 2 — data layer live | 6–9 | All 95 nodes render with category-agnostic panels; 14+1 edge types distinct strokes; status colours normalised; `showDetail` opens rich panel for all 10 cats |
| Stage 3 — content authored | 10–12 | Phase gates visible on left rail; condition gates visible on rail 2; phase→phase sequence navigable |
| Stage 4 — tours/perso | 13–14 | Tour modal selector populates 4 tours; persona context menus render `level`/`audience[]` from JSON |

---

## 13. Renderer surgical edits (audit §8)

These 8 surgical renderer edits are inseparable from the data layer refactor.
Each is individually sufficient to falsify the design claim if applied alone.

| # | Edit | Audit citation |
|---|------|---------------|
| E1 | Generic `sections[]` dispatcher in `showDetail` | accb84828 §6 |
| E2 | Unified `getElementsForView` loop with cat→ntype map | accb84828 §5 |
| E3 | `normaliseStatus(s)` helper (uppercase, compound) | accb84828 §3 |
| E4 | Edge-type map (15 JSON → 7 renderer styles) + `arr-risk` marker | aead5f36 + accb84828 §4 |
| E5 | Tour step field translator (`node`→`nodeId`, `say`→`desc+narration`) + `#tour-selector-grid` population | accb84828 §1.4, §1.5 |
| E6 | Meta-driven build stamp (line 405) | accb84828 §10 |
| E7 | Persona lookup via `cat` (not legacy dict key) | accb84828 §1.4 |
| E8 | Drop ID prefix transform — `n.id` is JSON-derived; remove legacy `D-` / `A-` / `FW-G` synthesis | accb84828 §1, §2; a2f900be |

---

## 14. Open questions

1. **Lock JSON to schema v1.0.0 immediately, or roll forward to v2 with
   full content authoring?** Current JSON is v2.0.1 (27 KB, 96 nodes).
   Recommendation: bump to v3.0.0 at the same time as step 10–12
   (content authoring) — single commit, no drift.
2. **Should the legacy `USE_JSON_DATA=false` path survive past Stage 2?**
   Today: keep it as a back-stop. Tomorrow: deprecate once Stage 2
   ships to a real client.
3. **Whose ownership of the `meta.stats` auto-recompute — JSON file
   author or HTML validator?** Recommendation: HTML validator runs it at
   boot, ignores stale meta values. JSON file remains a hand-edited
   artefact.

---

## 15. References

### Files
- `analise-prescritiva/reports/decision-framework/6_pitch/D3-PITCH-GRAPH.html`
- `analise-prescritiva/reports/decision-framework/6_pitch/D3-KNOWLEDGE-GRAPH.json`
- `analise-prescritiva/reports/decision-framework/CLAUDE.md`

### Fan-out audits (7)
| # | Audit | Task ID |
|---|-------|---------|
| 1 | HTML data dicts | `a16284f42ce8328bf` |
| 2 | HTML consumer coverage | `accb848286a0b77bf` |
| 3 | sections[] kinds vocabulary | `a6d9fa0c3de349ea0` |
| 4 | Edge schema | `aead5f36398d88a6d` |
| 5 | JSON schema conformance | `a8878a670729c0b3a` |
| 6 | ID prefix conformance | `a2f900be3c3b440bd` |
| 7 | Phase vs condition gates | `a46213561436b68d6` |

### Memory anchors
- [[atlas-brand]] — brand tokens / theme validators
- [[dashboard-layout-must-be-elaborate]] — KPI cards, gauges, control rails
