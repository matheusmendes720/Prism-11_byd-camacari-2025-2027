# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Nature

This is a **business decision framework** (D3 — Análise Prescritiva Operacional) for BYD Camaçari plant 2025–2027. It is document-centric, not a software project — there is no `package.json`, no test suite, and no traditional build pipeline.

---

## How to Generate Outputs

### JavaScript Model Generators
Run with Node.js from the project root:
```
node _gen_npv.js           # NPV model → _model_npv.json
node _gen_mc.js            # Monte Carlo → _model_mc.json
node _gen_sensitivity.js    # Sensitivity analysis → _model_sensitivity.json
node _gen_empirical_calibration.js
node _gen_real_ptax.js
node _gen_real_supply.js
node _apply_recalibration.js
```

Each reads from `_model_*.json` params and writes results back to the same file or stdout.

### Python Figure Generators (in `figures/` subdirectory)
```
python figures/_gen_mv_figs.py       # Multivariate sensitivity figures
python figures/_gen_rec2026_figs.py # Recalibration 2026 figures
python figures/_gen_s10_figs.py     # S10 tariff figures
python figures/_gen_s11_figs.py     # S11 competition figures
python figures/_gen_game_figs.py     # Game theory figures
```

Each reads `_model_*.json` and writes `.png` files to `figures/`.

### HTML Document Generators
```
python gen_full.py     # Full D3 generation
python gen_v2.py       # D3 v2 generation
python gen_part1.py    # Partial generation
python gen_annex_v2.py # Annex generation
python build_d3.py     # D3 build script
python rebuild.py      # Rebuild script
```

### How the Generation Pipeline Works
1. JSON model files (`_model_*.json`) hold all parameters and results
2. `_gen_*.js` scripts compute model outputs and update JSON files
3. `figures/_gen_*.py` scripts read JSON → generate PNG charts
4. `gen_*.py` scripts assemble HTML deliverables from all pieces

---

## Architecture: The D3 Framework

D3 is a 5-layer prescriptive system for strategic decisions:

```
Layer 5: LEARNING     — post-mortem trimestral + recalibração
Layer 4: ACTION       — action register com RACI, KPI, status
Layer 3: DECISION     — 12 decision trees + cost-benefit + sensitivity
Layer 2: SIGNAL       — trigger matrix (6×3) + heatmap agregado
Layer 1: DATA         — D2 sessions, composite, refresh automático
```

### The 11 Dimensions (S1–S11)
| Dim | Name | Key Coupling |
|-----|------|-------------|
| S1 | FX / Hedge | S1↔S3 (hedge sizing by ViE), S1↔S2, S1↔S4 |
| S2 | Supply Chain / Lithium | S1↔S2 (joint FX+supply VaR) |
| S3 | Regulatory / BNDES / ViE | S1↔S3, S3↔S4 |
| S4 | Pricing / Defensive | S1↔S4 (hedge vs defensive, ~9× ratio) |
| S5 | Partnerships | S5↔S2, S5↔S7 |
| S6 | Macro Governor | S6→all (multiplier 1.0×/1.5×/2.0×) |
| S7 | ESG / Reputação | Kill switch — lista suja blocks BNDES |
| S8 | Production Ramp | SKD→CKD curve, FX exposure recalibration |
| S9 | Demand Growth | S9↔S10, S9↔S11 |
| S10 | Tariff Policy | Duplo cost-shock S10↔S1 |
| S11 | Competitive Landscape | 5 players, Nash equilibrium |

### The 5 Modeled Couplings
1. **S1↔S3**: Hedge optimal ratio depends on ViE (30% Expansão → 91% Rollback Total)
2. **S1↔S2**: Joint FX+supply VaR (2.5× in RED scenarios)
3. **S1↔S4**: Hedge R$480/unit vs defensive R$4,500/unit (~9× ratio)
4. **S3↔S4**: Defensive break-even at ViE = 10%
5. **S6→all**: Macro multiplier rescales all prescriptions

### Composite Weights (sum = 1.00)
S1: 0.18 | S2: 0.16 | S3: 0.18 | S4: 0.16 | S5: 0.10 | S6: 0.10 | S7: 0.05 | S8: 0.08 | S9: 0.04 | S10: 0.05 | S11: 0.05

---

## Key Files

### Core Framework
- `DECISION-FRAMEWORK.md` — 5-layer architecture, RACI, 3 critical decisions
- `D3-PRESCRIPTIVE-SPEC.md` — OpenSpec-style specification
- `D2-AUDIT.md` — D2 verification + 10 structural gaps

### Consolidated Outputs
- `D3-MAIN.html` — Main consolidated framework (8 sections, 4 figures, 31 actions)
- `D3-DASHBOARD.html` — Dashboard with KPIs
- `D3-WORKSHOP.html` — 10-slide board workshop deck
- `D3-PITCH-DECK.html` — 13-slide SPA pitch deck

### Quantitative Interdependency Models
- `D3-INTERDEPENDENCY-S1-S3.md` — FX hedge by ViE
- `D3-INTERDEPENDENCY-S1-S2.md` — FX + supply joint stress
- `D3-INTERDEPENDENCY-S1-S4.md` — Hedge vs defensive
- `D3-INTERDEPENDENCY-S3-S4.md` — Defensive break-even
- `D3-INTERDEPENDENCY-S6-TRIGGERS.md` — Macro multiplier

### Recalibration (empirical refinement)
- `D3-RECALIBRATION-EMPIRICAL-2026.md` — σ PTAX 11.2%, σ lithium 95%, VaR R$8.21bi
- `D3-RECALIBRATION-S1-S3-REAL-BCB.md` — BCB PTAX real 10y data
- `D3-FALSE-POSITIVE-FIXES.md` — v2.0.1 fix pack (5/5 backtesting targets)

### Model Data
- `_model_npv.json` — NPV by scenario and prescription
- `_model_mc.json` — Monte Carlo parameters and outputs
- `_bcb_ptax_raw.json` — Raw PTAX data from BCB

### Planning & Progress
- `.planning/task_plan.md` — Phase 1–4 roadmap (19 tasks)
- `.planning/findings.md` — 30 detailed findings
- `.planning/progress.md` — Decision log and milestones

---

## Version

Current: **D3 v2.0.1** (5/5 backtesting targets perfect)
