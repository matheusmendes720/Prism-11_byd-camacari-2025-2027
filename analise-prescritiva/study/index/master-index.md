# Master Index — BYD Camaçari Case Study

> Unified navigation across all learning content.
> Last updated: 27/jul/2026

---

## Track 1: Learning Notebooks (`../notebooks!/`)

**11 executable notebooks** · `../notebooks!/outputs/learning/` · Python 3.12

| # | File | Topic | Key output |
|---|------|-------|-----------|
| L0 | `l0-statistics-fundamentals.ipynb` | Média, DP, correlação, histogramas | 3 PNGs |
| L1 | `l1-probability-uncertainty.ipynb` | Bayes, valor esperado, distribuições | 2 PNGs |
| L2 | `l2-hypothesis-testing.ipynb` | P-valor, IC, erros tipo I/II | 2 PNGs |
| L3 | `l3-linear-regression.ipynb` | OLS, R², coeficientes | 5 PNGs |
| L4 | `l4-time-series.ipynb` | Tendência, stationaridade, forecasting | 3 PNGs |
| L5 | `l5-volatility-garch.ipynb` | GARCH(1,1)-t, half-life 73d | 3 PNGs |
| L6 | `l6-monte-carlo.ipynb` | 10k paths, VaR/CVaR | 3 PNGs |
| L7 | `l7-multivariate-analysis.ipynb` | Correlação, PCA, HHI | 3 PNGs |
| L8 | `l8-optimization.ipynb` | Função objetivo, restrições | 2 PNGs |
| L9 | `l9-game-theory.ipynb` | Nash, payoffs, BYD vs 5 players | 2 PNGs |
| L10 | `l10-decision-framework.ipynb` | Score 71.8, backtesting | 3 PNGs |

**Total: 31 PNG visualizations in `outputs/learning/`**

---

## Track 2: D2 Study Notes

Source: `../../d2-econometric-vulnerability/_study_notes/`

### By layer

| Layer | Doc | Tema |
|-------|-----|------|
| **AA** | `AA-00-tour-geral-projeto.md` | Tour guiado |
| **L0** | `L0.2-estatistica-descritiva.md` | 14 métricas, histograma |
| **L0** | `L0.3-probabilidade-distribuicoes.md` | Distribuições, Bayes |
| **L1** | `L1.0-eda-pTAX-passo-a-passo.md` | EDA PTAX 10 passos |
| **L1** | `L1.1-eda-supply-chain-trade-balance.md` | HHI, Sankey, 5 players |
| **L1** | `L1.2-eda-variaveis-expandidas-matriz.md` | 31 variáveis V1-V31 |
| **L2** | `L2.0-arquitetura-modelagem.md` | Pipeline, 5 sessões |
| **L2** | `L2.1-modelos-vol-garch-gjr.md` | GARCH/GJR, half-life 73d |
| **L2** | `L2.2-cambio-stress-test-monte-carlo.md` | VaR 6.43bi, CVaR 8.04bi |
| **L3** | `L3.0-matrizes-decisao.md` | S3×S6, 4D Risk Map |
| **L3** | `L3.1-trigger-matrix-auto-trigger.md` | 30+ triggers |
| **L3** | `L3.2-raci-action-register.md` | 17 personas, RACI |
| **L4** | `L4.0-comunicacao-conselho.md` | Template 1-pager |
| **L4** | `L4.1-dashboards-executivos.md` | 4 telas Plotly Dash |
| **L4** | `L4.2-gap-modelo-humano.md` | 4 pressupostos |
| **L5** | `L5.0-calibracao-shap-lime.md` | Calibração, explicabilidade |
| **L5** | `L5.1-sensibilidade-edge-cases.md` | Sensitivity, stress |
| **L6** | `L6.0-cauda-extrema-distribuicoes-fat-tail.md` | T-student, Stable |
| **L6** | `L6.1-stress-testing-institucional.md` | Stress test |
| **L6** | `L6.2-mesa-risco-operacional.md` | Mesa de risco |
| **ZZ** | `ZZ-glossario-formulas.md` | 50+ equações |
| **BB** | `BB-bibliografia-leituras.md` | Referências |
| **Extra** | `README.md` | Base index (24 docs, ~816 KB) |
| **CAP1** | `CAP1-GRAVIDADE-VALUE-PROP.md` | **Cap. 1 executivo (pt-br)** — curva central + 11 elementos multivariate |
| **CAP-HTML** | `CAP-VALUE-PROPOSITION.html` | **11 capítulos executivos + value prop** — A4 print-ready |

### Key D2 numbers cross-referenced in all tracks

| Métrica | Valor | Fonte |
|---------|-------|-------|
| PTAX σ annualized | 14.19% | L1.0, L5 |
| GARCH half-life | 73.3 days | L2.1, L5 |
| GARCH persistence | 0.9906 | L2.1 |
| VaR 95% 6m | R$ 2.10 bi (empírico) | L2.2 |
| VaR refresh 6m | R$ 6.43 bi (σ 14.86%) | L2.2 refresh |
| CVaR 95% | R$ 8.04 bi | L2.2 |
| HHI Baterias | 4,850 | L1.1 |
| Composite | 71.8/100 | L3.0 |

---

## Track 3: D3 Study Notes (`../study/_study-notes-d3/`)

Source: `../../reports/decision-framework/_study_notes_d3/`
D3 v2.0.1 · 5 documentos · ~90 KB · 27/jul/2026

### By doc

| # | File | Tema | Tempo |
|---|------|------|-------|
| — | `README.md` | Capa + navegação + métricas | 10 min |
| 1 | `D3-0.0-arquitetura-decision-framework.md` | 5 camadas, 11 dim, composite, couplings | 45-60 min |
| 2 | `D3-0.1-matrizes-decisao-completo.md` | Matriz S3×S6, 4D Risk Map, 5 gates | 40-50 min |
| 3 | `D3-0.2-raci-trigger-matrix.md` | 17 personas, 30+ triggers, auto-trigger | 40-50 min |
| 4 | `D3-0.3-npv-action-register.md` | NPV live, 39 ações, R$ 1,68 bi plan | 40-50 min |

### D3 coupling map

```
S1 (FX)  ←→  S3 (BNDES)    h* = 30%→91% conforme ViE
S1 (FX)  ←→  S2 (Supply)   joint VaR 2.5× RED
S1 (FX)  ←→  S4 (Pricing)  hedge R$480 vs defensivo R$4.500 (~9×)
S3 (BNDES) → S4 (Pricing)  defensivo break-even ViE=10%
S6 (Macro) →  all           multiplier 1.0×/1.5×/2.0×
S7 (ESG)  →  all           kill switch — bloqueia BNDES
S10(Tariff) ↔ S1 (FX)      duplo cost-shock 1.33×
```

### D3 key numbers

| Métrica | Valor | Nota |
|---------|-------|------|
| Composite | **71.8 / 100** | AMBER — tensão moderada |
| VaR 4-shock | **R$ 8.21 bi** | P95, MC 10k paths |
| CVaR 95% | **R$ 10.14 bi** | provisioned loss |
| Investment 365d | **R$ 1.68 bi** | 39 ações |
| ROI esperado | R$ 700M-1bi | por evento evitado |
| Approval gates | **8** (G1-G8) | até R$ 500M+ |
| Personas | **17** | RACI completo |
| Triggers | **30+** | YAML, auto-trigger ready |
| Backtesting | **5/5 targets** | D3 v2.0.1 |

### D3 5-layer architecture

```
Layer 5: LEARNING  ── post-mortem trimestral + recalibração
Layer 4: ACTION    ── 39 ações · RACI · 8 gates · KPI tracking
Layer 3: DECISION  ── 12 decision trees · cost-benefit · 96 cenários
Layer 2: SIGNAL    ── 30+ regras · 6×3 matrix · composite
Layer 1: DATA      ── D2 inalterado · BCB/ANFAVEA/ANP · refresh ≤1h
```

---

## Journey Narrative — D2 → D3

Start here to understand the full arc before diving into tracks:

| File | What it is | Time |
|------|-----------|------|
| `../../LINHAGEM.md` | Full story: 7 phases, 42 deliverables, 12-chapter video script (23 min) | 30 min read |

**Quick orientation**: LINHAGEM.md Part 1 = technical lineage (what was built and why).
Part 2 = full YouTube narration script (what to say presenting it).

These numbers appear across all three tracks — they are the same real data:

| Métrica | Valor | Tracks |
|---------|-------|--------|
| PTAX σ annualized | 14.19% | L2.1, L5, D3 |
| GARCH half-life | 73.3 days | L2.1, L5 |
| VaR 95% 6m (empírico) | R$ 2.10 bi | L2.2, L6, D3 |
| VaR 95% 6m (refresh) | R$ 6.43 bi | L2.2, D3 |
| VaR 4-shock (D3 v2.0.1) | R$ 8.21 bi | D3 only |
| **CVaR 95%** | R$ 8.04 bi (empírico) / R$ 10.14 bi (D3) | L2.2, D3 |
| **CAP-HTML** | **11 capítulos + value prop** | CAP-VALUE-PROPOSITION.html (17/ago/2026) |
| **CAP1-MD** | **Capítulo 1 pt-br (didático)** | CAP1-GRAVIDADE-VALUE-PROP.md (17/ago/2026) |
| HHI Baterias | 4,850 | L1.1, L7 |
| Composite score | 71.8/100 | L3.0, L10, D3 |

---

## Reading paths by objective

### I want to understand the whole project (2-4 hours)
```
notebooks!/L0 → L1 → L2 → L3 → L4 → L5 → L6
                            ↓
d2-econometric-vulnerability/_study_notes/ (layer L2.1, L2.2, L3.0)
                            ↓
study/_study-notes-d3/README.md → D3-0.0 → D3-0.1 → D3-0.2 → D3-0.3
```

### I want the GARCH / volatility deep-dive
```
notebooks!/L5 (notebook) → _study-notes/L2.1 (formula derivation)
```

### I want to understand VaR / Monte Carlo
```
notebooks!/L6 (notebook) → _study-notes/L2.2 (4-shock, Cholesky)
```

### I want to understand the decision framework
```
notebooks!/L9 → L10 → study/_study-notes-d3/D3-0.1 → D3-0.2 → D3-0.3
```

---

*Unified index — Matheus Mendes — Salvador-BA, BR — 27/jul/2026*
