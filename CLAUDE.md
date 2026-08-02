# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Case study `byd-camacari-2025-2027`: a 4-week (W1-W4) job-search campaign
prepared by **Matheus Mendes** (Salvador-BA, BR) targeting BYD Brasil
(Camaçari, BA — Polo Automotivo, 2025-2027 horizon) plus a Salvador/remote
portfolio fallback. Language: **Portuguese (pt-br)** for all user-facing
artefacts; English for code/comments.

Strategic shape: **BYD anchor + Salvador/remote diversification**. Do not
treat as "single-empresa focus" — `d1-greenfield-scout/` should always list
≥ 14 active BR Python/data vagas, BYD gets 1 anchor (Yueying Zhang) and
~5 Tier-1 Salvador/remote fallbacks.

## Layout (5 deliverable workstreams)

```
d1-greenfield-scout/         # Market research (markdown tables)
d2-econometric-vulnerability/ # Quant analysis (Python notebook + Plotly HTML)
d3-outreach-assets/          # Cold-outreach templates (cover letters, DMs)
d4-process-tracker/          # SQLite tracker (python stdlib, no ORM)
analise-prescritiva/         # 8 prescriptive notebooks (GARCH, HHI, game theory, MC, etc.)
```

Each `byd-*.md` artefact carries **YAML frontmatter** with `ueid`,
`entity_type` (`artifact` | `deliverable`), `parent_ueid`, `slug`, `tags`,
and a `custom._purpose` line plus optional `_data_sources` /
`_outputs` / `_success_criteria` lists. Frontmatter is the source of truth
for cross-references — preserve it on edits and use ueids verbatim when
linking.

## Common commands

All paths relative to the case-study root.

```bash
# D2 — refresh the quantitative analysis (regenerate HTML + 1-pager)
cd d2-econometric-vulnerability
jupyter nbconvert --to notebook --execute byd-econometric-vulnerability.ipynb \
  --inplace        # or run byd-econometric-vulnerability.py cell-by-cell
# outputs land in d2-econometric-vulnerability/outputs/ (6 Plotly HTMLs
# + 1-pager-summary.md)

# D4 — initialize / re-seed the outreach tracker (sqlite3 stdlib, idempotent)
cd d4-process-tracker
python byd-tracker-init.py    # creates byd-tracker.db + applies schema
python byd-tracker-seed.py    # pre-fills 6 planned outreach + process rows

# D4 — inspect the tracker
sqlite3 byd-tracker.db "SELECT * FROM outreach ORDER BY sent_at"
sqlite3 byd-tracker.db "SELECT * FROM v_weekly_summary"
```

There is **no build, no linter, no test runner** in this project. No
`package.json`, no `pyproject.toml`, no `requirements.txt`. The Python
runtime expects: `polars`, `duckdb`, `statsmodels`, `plotly`, `numpy`,
`requests`, `jupyter`. Versions documented in `1-pager-summary.md`
Methodology block (e.g. Polars 1.42, Plotly 6.8).

## D2 — econometric vulnerability notebook

The `.ipynb` and `.py` are mirror twins — keep them in sync if you edit
either. Cell order, numbering (`# In[ ]:`), and output targets are part of
the narrative; do not reorder.

Five analytical sections, each writing to a named HTML in `outputs/`:

| Section | Output file | Hypothesis |
|---------|-------------|------------|
| 1 — Câmbio stress test | `cambio-stress-test.html` | PTAX vol → BOM impact |
| 1.5 — Monte Carlo | `cambio-monte-carlo.html` | 10k paths × 6m, log-normal shocks |
| 2 — Supply chain | `supply-chain-sankey.html` | HHI concentration by category |
| 3 — Regulatório | `regulatory-scenarios.html` | 4 political scenarios |
| 4 — Competition | `competition-landscape.html` | 2026-2028 share projection |
| 5 — Composite index | `composite-vulnerability-radar.html` | weighted 0-100 rollup |

The composite `ONEPAGER` markdown block is the source of the
`outputs/1-pager-summary.md` file — regenerate it after running the notebook.
`imported_share_bom = 0.42` and `incentive_coverage_base = 0.18` are the two
main tunable knobs (top of section 1 and section 3).

## D4 — process tracker schema

Four tables + two views. All IDs are ueids (`ikigai:<type>:<uuid8>:<hash8>`).
Stage enum for `process`: `discovered → applied → screening →
interview_phone → interview_tech → interview_onsite → offer | rejected |
ghosted`. Channel enum for `outreach`: `linkedin_connect | linkedin_message
| email | easy_apply`. Persona enum: `T0_lean | T1_polite | T2_followup |
T3_email`.

`byd-tracker.db` is checked in; `byd-tracker-init.py` / `byd-tracker-seed.py`
are idempotent (use `INSERT OR IGNORE`), so re-running is safe.

## Anti-bot / rate-limit conventions

Enforced at the application layer, not in code:
- ≤ 5 LinkedIn connection requests per day (free tier cap)
- ≤ 2 emails per day per company
- ≥ 2 working days between messages to the same person

Templates in `d3-outreach-assets/` are pre-sized to cold-outreach best
practice (≤ 300 char body per message). When drafting new templates, match
this constraint and reference the D2 1-pager as the technical hook.

## Analise Prescritiva — 8 Notebooks

`analise-prescritiva/` contains 8 prescriptive notebooks (mirror `.ipynb` + `.py` pairs)
plus an `outputs/` directory with Plotly HTML results.

Python312: `C:/Users/mathe/AppData/Local/Programs/Python/Python312/python.exe`
Output dir: `analise-prescritiva/outputs/`

| Notebook | Topic | Key outputs |
|----------|-------|-------------|
| NB-01 | PTAX + GARCH(1,1)-t | `nb01_results.json`, 3 HTMLs (stress, vol term, MC) |
| NB-02 | Supply Chain HHI | `nb02_results.json`, 3 HTMLs (HHI, disruption, VaR MC), PNG |
| NB-03 | BNDES Regulatory Scenarios | `nb03_results.json`, 4-scenario ViE/NPV matrix |
| NB-04 | Competition Game Theory | `nb04_results.json`, 5-player payoff matrix, NASH |
| NB-05 | Composite Index + Radar | `nb05_results.json`, radar/bars/gauge HTMLs |
| NB-06 | Monte Carlo Multivariado | `nb06_results.json`, 2 HTMLs (distribution, tornado) |
| NB-07 | Interdependency Couplings | `nb07_results.json`, 5 coupling PNGs |
| NB-08 | Backtesting + False Positives | `nb08_results.json`, validation PNG |

Scores range 0-100; composite threshold: ≥80 GREEN, ≥65 AMBER, <65 RED.
NB-05 is the master fusion: weights {cambio:0.30, regulatorio:0.30, supply:0.20, macro:0.20}.
NB-07 coupling formula: `h* = 91% - (ViE%/22%) * 61%` (h*(18%)=30%, h*(0%)=91%).

Known Plotly quirks on this host:
- `gauge.axis` does NOT support `linecolor` or `title_font` — strip them
- `height` belongs in `update_layout()`, not in `go.Indicator()`
- Use `marker_line_color/width` instead of `marker.line=dict(...)` (Python 3.12)

## MCP servers enabled

`.claude/settings.local.json` enables `claude-flow`, `ruv-swarm`, and
`flow-nexus`. Use them when working on multi-step research/coordination
tasks; the SQLite tracker + markdown artefacts are the project ground truth,
so persist any new findings into them rather than only into transient
session memory.

## Related files outside this case study

This case study is one of several under `orchestration/value-factory/case-studies/`.
Sibling case studies share the d1-d4 workstream shape but are otherwise
independent — do not assume conventions transfer.
