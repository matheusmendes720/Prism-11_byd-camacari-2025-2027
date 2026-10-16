---
slug: notas-meta-d2-07b-drift-arquitetura
title: "Nota-Meta D2 #07-B — Drift de Arquitetura · Outputs, Notebooks Canônicos e Insights Cross-Version"
ueid: ikigai:nota:d2-meta-drift-arquitetura:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, arquitetura, outputs, notebooks, insights, evolucao, cross-version, meta-aprendizado]
custom:
  _purpose: >-
    Mapear a evolução da arquitetura analítica do D2 entre as versões
    (v1 jul/2025 → v2 19/jul/2026 → v2.1 final jul/2026). Cobre: (a) os 6
    outputs HTML canônicos e como eles evoluíram, (b) os 15 notebooks
    canônicos NB-01..NB-15 e seu papel em cada fase, (c) os grandes
    insights que surgiram/desapareceram entre versões. Foco didático —
    explicar o projeto, sem exercícios.
  _audience: engenheiro-junior, analista-pleno, pesquisador
  _data_sources:
    - /d2-econometric-vulnerability/byd-econometric-report.html
    - /analise-prescritiva/reports/atlas-d2-preditiva.html
    - /d2-econometric-vulnerability/outputs/* (6 HTMLs + 11 PNGs + MDs)
    - /analise-prescritiva/notebooks!/02-canonicos/nb-* (15 notebooks)
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md
  _outputs:
    - evolucao-outputs-html
    - mapeamento-notebooks-canonicos
    - insights-cross-version
    - linhagem-outputs-notebooks-insights
  _success_criteria: >-
    leitor entende como a arquitetura analítica evoluiu de 5 dimensões
    paralelas (v1) → 8 notebooks paralelos (v2) → 11 dimensões acopladas
    (D3 v2.0+), e quais insights novos surgiram em cada upgrade.
---

# Nota-Meta D2 #07-B — Drift de Arquitetura

> **Quem está falando:** um par sênior-orientador sobre como o **"esqueleto"** do D2 evoluiu.
> **O que esta nota faz:** documenta a evolução da arquitetura analítica entre as versões do D2 — **outputs** (HTMLs/PNGs/MDs), **notebooks canônicos** (NB-01..NB-15), e **insights** (que apareceram/desapareceram).
> **Pré-requisito:** ter lido [Nota-Meta D2 #07-A — Drift de Métricas](./NOTA-META-D2-07A-DRIFT-METRICAS.md).
> **Tempo de leitura:** 30-45 min.
> **Fonte canônica:** [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md) §5 + README dos notebooks canônicos.

---

## §0. Visão geral

A pergunta: **"como a estrutura analítica do D2 mudou entre as versões, e o que isso significa para os outputs e insights?"**

A resposta tem **3 dimensões**:
1. **Outputs** (HTMLs Plotly interativos, PNGs estáticos, MDs narrativos) — o que o stakeholder **vê**.
2. **Notebooks canônicos** (NB-01..NB-15) — como o **código** produz o output.
3. **Insights** — o que o **stakeholder aprende** ao ler o output.

---

## §1. Os outputs do D2 — evolução cross-version

### §1.1 Os 6 outputs HTML canônicos

Localização: `/d2-econometric-vulnerability/outputs/`. Cada HTML é **autocontido** (Plotly inlineado, sem dependência externa).

| # | Output HTML | Função | Tamanho | Versões |
|---|---|---|---|---|
| 1 | [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) | Stress test determinístico (4 cenários PTAX) | 8.6 KB | v1 → v2 → v2.1 (estável) |
| 2 | [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) | 10k paths × 6m, GARCH-t, P5/P50/P95 | 105 KB (12× maior) | v1 (parcial) → v2 (completo) |
| 3 | [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) | HHI por categoria + Sankey disruption | 8.4 KB | v1 → v2 (reliability-adjusted) |
| 4 | [`regulatory-scenarios.html`](../../d2-econometric-vulnerability/outputs/regulatory-scenarios.html) | 4 cenários BNDES/Rota 2030 | 8.1 KB | v1 → v2.1 (probabilidades atualizadas) |
| 5 | [`competition-landscape.html`](../../d2-econometric-vulnerability/outputs/competition-landscape.html) | Market share 2026-2028 | 8.8 KB | v1 (snapshot) → v2 (projeção temporal) |
| 6 | [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html) | Radar 4 dimensões | 8.2 KB | v1 (definição) → v2 (cálculo) → v2.1 |

### §1.2 O cambio-monte-carlo.html é 12× maior — por quê?

Os outros 5 outputs são "shells" Plotly com **payload pequeno** (8-9 KB cada) — Plotly calcula o gráfico client-side. Mas o `cambio-monte-carlo.html` tem **motor MC inlineado em JavaScript** (~100 KB de código), permitindo **regeneração interativa** de paths no browser.

É o único HTML que **roda computação no cliente**. Os outros 5 são **estáticos**.

### §1.3 Evolução dos outputs entre versões

| Versão | Outputs gerados | Mudanças |
|---|---|---|
| **D2 v1** (jul/2025) | 6 HTMLs "shells" | cambio-monte-carlo com histogramas empíricos apenas |
| **D2 v2** (19/jul/2026) | 6 HTMLs refresh | cambio-monte-carlo com MC 10k paths; supply-chain com reliability-adjusted HHI |
| **D2 v2.1** (final jul/2026) | 6 HTMLs estáveis | sem mudanças; composite mantido em 71,8 |
| **D3 v2.0+** (15-18/ago/2026) | Adicionados 4 HTMLs no D3 | [`/analise-prescritiva/outputs/nb01_monte_carlo.html`](../../analise-prescritiva/outputs/nb01_monte_carlo.html), [`nb02_hhi_concentration.html`](../../analise-prescritiva/outputs/nb02_hhi_concentration.html), etc. |

### §1.4 Os 11 PNGs (capítulos visuais estáticos)

Em `/d2-econometric-vulnerability/outputs/`. Mais simples que HTMLs — plots matplotlib estáticos.

| # | PNG | Função | Tamanho |
|---|---|---|---|
| 1 | [`cap1_ptax_historia.png`](../../d2-econometric-vulnerability/outputs/cap1_ptax_historia.png) | Capa Cap1: série PTAX história | 260 KB |
| 2 | [`cap1b_volatility.png`](../../d2-econometric-vulnerability/outputs/cap1b_volatility.png) | Vol realizada rolling 30d/90d | 208 KB |
| 3 | [`cap1c_stress_test.png`](../../d2-econometric-vulnerability/outputs/cap1c_stress_test.png) | Stress test (mesmo do HTML) | 149 KB |
| 4 | [`cap2_supply_chain.png`](../../d2-econometric-vulnerability/outputs/cap2_supply_chain.png) | HHI por categoria | 177 KB |
| 5 | [`cap2b_disruption.png`](../../d2-econometric-vulnerability/outputs/cap2b_disruption.png) | Disruption scenarios | 136 KB |
| 6 | [`cap3_regulatory.png`](../../d2-econometric-vulnerability/outputs/cap3_regulatory.png) | 4 cenários BNDES | 131 KB |
| 7 | [`cap4_competition.png`](../../d2-econometric-vulnerability/outputs/cap4_competition.png) | BYD vs Tesla/VW/GM | 166 KB |
| 8 | [`cap4b_competitive_deep.png`](../../d2-econometric-vulnerability/outputs/cap4b_competitive_deep.png) | Projeção share 2026-2028 | 193 KB |
| 9 | [`cap5_composite.png`](../../d2-econometric-vulnerability/outputs/cap5_composite.png) | Radar 4 dimensões | 216 KB |
| 10 | [`cap5b_sensitivity.png`](../../d2-econometric-vulnerability/outputs/cap5b_sensitivity.png) | Tornado analysis | 113 KB |
| 11 | [`cap6_dashboard_final.png`](../../d2-econometric-vulnerability/outputs/cap6_dashboard_final.png) | Dashboard consolidado final | 343 KB |

### §1.5 Por que HTMLs E PNGs共存?

| Formato | Caso de uso | Vantagem | Limitação |
|---|---|---|---|
| **HTML interativo** | exploração, drill-down, hover tooltips | alta interatividade | requer browser moderno; arquivo pesado |
| **PNG estático** | apresentação, impressão A4, embed em slide | simples, leve, universal | sem drill-down |

A regra é: **HTML para análise, PNG para apresentação**.

### §1.6 O Atlas D2 Preditivo vs Relatório HTML

São **dois artefatos diferentes** com a mesma estrutura:

| Artefato | Localização | Função | Tamanho |
|---|---|---|---|
| [`atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html) | `/analise-prescritiva/reports/` | White paper executivo (6 sessões, capa profissional) | 66 KB |
| [`byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) | `/d2-econometric-vulnerability/` | Relatório técnico completo (13 figuras Plotly) | 3.7 MB |

O **atlas** é o **resumo para Board**; o **relatório** é o **detalhe técnico para CRO**. Mesmo conteúdo, audiências diferentes.

---

## §2. Os 15 notebooks canônicos (NB-01..NB-15)

Localização: `/analise-prescritiva/notebooks!/02-canonicos/`. Cada NB tem `.ipynb` (Jupyter) + `.py` (espelho Python).

### §2.1 Mapa dos 15 notebooks

| NB | Tema | Outputs | Conexão D2/D3 |
|---|---|---|---|
| **NB-01** | [`nb-01-ptax-garch`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) | `nb01_results.json`, 3 HTMLs (stress, vol term, MC) | S1 FX, GARCH-t |
| **NB-02** | [`nb-02-supply-chain-hhi`](../../analise-prescritiva/notebooks!/02-canonicos/nb-02-supply-chain-hhi/nb-02-supply-chain-hhi.ipynb) | `nb02_results.json`, 3 HTMLs (HHI, disruption, VaR MC), PNG | S2 Supply |
| **NB-03** | [`nb-03-regulatory-scenarios`](../../analise-prescritiva/notebooks!/02-canonicos/nb-03-regulatory-scenarios/nb-03-regulatory-scenarios.ipynb) | `nb03_results.json`, 4-cenário ViE/NPV matrix | S3 BNDES, S10 Tariff |
| **NB-04** | [`nb-04-competition-game-theory`](../../analise-prescritiva/notebooks!/02-canonicos/nb-04-competition-game-theory/nb-04-competition-game-theory.ipynb) | `nb04_results.json`, 5-player payoff matrix, NASH | S4 Pricing, S11 Competition |
| **NB-05** | [`nb-05-composite-index-radar`](../../analise-prescritiva/notebooks!/02-canonicos/nb-05-composite-index-radar/nb-05-composite-index-radar.ipynb) | `nb05_results.json`, radar/bars/gauge HTMLs | Composite, 11 dims |
| **NB-06** | [`nb-06-monte-carlo-multivariado`](../../analise-prescritiva/notebooks!/02-canonicos/nb-06-monte-carlo-multivariado/nb-06-monte-carlo-multivariado.ipynb) | `nb06_results.json`, 2 HTMLs (distribution, tornado) | VaR 4-shock, Cholesky 4×4 |
| **NB-07** | [`nb-07-interdependency-couplings`](../../analise-prescritiva/notebooks!/02-canonicos/nb-07-interdependency-couplings/nb-07-interdependency-couplings.ipynb) | `nb07_results.json`, 5 coupling PNGs | 5+15=20 couplings |
| **NB-08** | [`nb-08-backtesting-false-positives`](../../analise-prescritiva/notebooks!/02-canonicos/nb-08-backtesting-false-positives/nb-08-backtesting-false-positives.ipynb) | `nb08_results.json`, validation PNG | Backtesting 5/5, 4 fixes |
| **NB-09** | [`nb-09-game-theory`](../../analise-prescritiva/notebooks!/02-canonicos/nb-09-game-theory/nb-09-game-theory.ipynb) | `nb09_results.json`, NASH eq HTML | Game theory S11 |
| **NB-10** | [`nb-10-decision-trees`](../../analise-prescritiva/notebooks!/02-canonicos/nb-10-decision-trees/nb-10-decision-trees.ipynb) | `nb10_results.json`, decision tree HTML | 12 árvores S3×S6 |
| **NB-11** | [`nb-11-backtesting`](../../analise-prescritiva/notebooks!/02-canonicos/nb-11-backtesting/nb-11-backtesting.ipynb) | `nb11_results.json`, backtest HTML | Validação histórica |
| **NB-12** | [`nb-12-sensitivity`](../../analise-prescritiva/notebooks!/02-canonicos/nb-12-sensitivity/nb-12-sensitivity.ipynb) | `nb12_results.json`, sensitivity HTML | Tornado de sensibilidade |
| **NB-13** | [`nb-13-trigger-matrix`](../../analise-prescritiva/notebooks!/02-canonicos/nb-13-trigger-matrix/nb-13-trigger-matrix.ipynb) | `nb13_results.json`, trigger matrix HTML | 30+ triggers |
| **NB-14** | [`nb-14-npv-layer`](../../analise-prescritiva/notebooks!/02-canonicos/nb-14-npv-layer/nb-14-npv-layer.ipynb) | `nb14_results.json`, NPV HTML | NPV marginal por prescrição |
| **NB-15** | [`nb-15-final-dashboard`](../../analise-prescritiva/notebooks!/02-canonicos/nb-15-final-dashboard/nb-15-final-dashboard.ipynb) | `nb15_results.json`, dashboard final HTML | Composite 11D radar |

### §2.2 A divisão dos 15 NBs em fases

Os 15 NBs **não foram todos criados na mesma fase**. A divisão é:

| Fase | Notebooks | Função |
|---|---|---|
| **D2 v1** (jul/2025, EDA) | NB-01, NB-02, NB-03, NB-04 (parcial) | Estatística descritiva básica |
| **D2 v2** (19/jul/2026, refresh) | NB-05 (composite), NB-06 (MC), NB-07 (couplings), NB-08 (backtest) | Modelagem preditiva completa |
| **D2 v2.1** (final jul/2026) | NB-09, NB-10, NB-11, NB-12 | Operacionalização |
| **D3 v0.5+** (ago/2026) | NB-13, NB-14, NB-15 | Prescrição completa + dashboard |

### §2.3 Os 5 couplings primários (NB-07)

O **NB-07** merece destaque porque é o coração da transição D2 → D3:

| Coupling | Pergunta de decisão | Documentado em |
|---|---|---|
| **S1↔S3** | Como o sizing do hedge depende do BNDES? | [`D3-INTERDEPENDENCY-S1-S3.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md) |
| **S1↔S2** | Quando supply chain estressa junto com FX? | [`D3-INTERDEPENDENCY-S1-S2.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md) |
| **S1↔S4** | Hedge cambial vs pricing defensivo — qual? | [`D3-INTERDEPENDENCY-S1-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S4.md) |
| **S3↔S4** | Quando o defensivo deixa de fazer sentido? | [`D3-INTERDEPENDENCY-S3-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md) |
| **S6→todas** | Como macro reescala prescrições? | [`D3-INTERDEPENDENCY-S6-TRIGGERS.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md) |

A fórmula canônica: `h* = 91% - (ViE%/22%) × 61%` (hedge ótimo como função do BNDES).

---

## §3. Evolução dos insights — o que cada versão "descobriu"

### §3.1 D2 v1 — os 5 insights fundacionais

A versão v1 entregou o **baseline estatístico**:

1. **σ PTAX 14,19%** (N=1.642 obs) — base para todo VaR/CVaR futuro.
2. **HHI Bateria 4.850** (CATL 95,7%) — alerta de single-source risk.
3. **NPV regulatório R$ 12,09 bi** (4 cenários, σ R$ 4,20 bi) — exposição a policy risk.
4. **Composite-conceito definido** (câmbio 30% + regulatório 30% + supply 20% + competitivo 20%) — pesos heurísticos, sem cálculo end-to-end.
5. **Composite não calculado** — handover para v2.

### §3.2 D2 v2 — os 6 insights preditivos

A versão v2 entregou a **modelagem preditiva completa**:

6. **VaR refresh R$ 6,43 bi** vs empírico R$ 2,10 bi (3×) — VaR MC captura toda a distribuição, não só o histórico.
7. **CVaR R$ 8,04 bi** (24% acima do VaR) — cauda pesada confirmada.
8. **Composite 71,8 AMBER** — calculado end-to-end pela primeira vez.
9. **10 gaps estruturais** (D2-AUDIT) — gap #1 = interdependências não modeladas.
10. **5 couplings primários** quantificados — S1↔S3 com fórmula `h* = 91% - (ViE%/22%) × 61%`.
11. **Backtesting inicial** com 6 stress events 2020-2025 — TP 100%, mas FP 14,8%.

### §3.3 D2 v2.1 — os 4 insights operacionais

A versão v2.1 entregou **ferramentas operacionais**:

12. **15 triggers** auto-acionados em [`TRIGGER_MATRIX.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-TRIGGER-MATRIX.md) (era 6 dispersos).
13. **RACI 4-pessoa** (CFO, COO, Risk, CMO) com 4 macro-estados.
14. **3 decisões críticas destravadas** (R$ 12M advocacy + R$ 280M dual-sourcing + R$ 80M/ano defensivo).
15. **Handoff oficial D3** aceito por D3 v0.5.

### §3.4 D3 v2.0+ — os 7 insights novos (recálibração com realized risks)

A versão D3 v2.0+ entregou **5 recalibrações empíricas**:

16. **σ PTAX BCB realized 14,86%** (2.509 obs BCB SGS 10813) — base para v2.0+.
17. **VaR 4-shock tornado R$ 8,21 bi** (Cholesky 4×4) — MC multivariado supera MC 1-shock.
18. **CVaR R$ 10,14 bi** (cauda 4-shock, Tariff maior contributor 29%).
19. **Composite 50,3 RED Modo Crise** — alinhamento com realized risks (lista suja MTE, σ 16%, lítio US$ 22k, tariff 35%).
20. **11 dimensões S1-S11** (de 6) + 5 recalibrações empíricas.
21. **5/5 backtesting PERFEITO** (TP 100%, FP 0%, time-to-action 9,3d) após 4 fixes (hysteresis, carry-trade, lítio asymmetry, 5-day confirmation).
22. **Composite técnico 11D = 78** (GREEN se >80) vs stakeholder 4D = 50,3 (RED Modo Crise).

### §3.5 Os 10 insights que se mantiveram constantes (invariantes cross-version)

Certas verdades **não mudaram** entre as versões:

1. CATL 95,7% (single-source em LFP) — desde v1.
2. HHI > 2.500 = altamente concentrado — desde v1.
3. Each 1% PTAX = 0,42 pp BOM — desde v1.
4. Composite stakeholder formula (4-dim, pesos 30/30/20/20) — desde v1.
5. GARCH α + β = 0,9906 (persistência) — desde v1.
6. Half-life 73,3 dias — desde v1.
7. Lista suja MTE = kill switch S7 — desde v2.1.
8. Macro reescala tudo (S6 → all) — desde v2 (coupling #5).
9. Tariff > 30% piora o pior cenário (4-shock) — desde v2.0.
10. 5/5 backtesting PERFEITO pós-4-fixes — desde v2.0.1.

---

## §4. As grandes transições arquiteturais

### §4.1 Transição 1: 5 dims paralelas → 6 dims (D2 v2 adiciona macro)

**Antes (D2 v1):**
```
[Câmbio] [Supply] [Regulatório] [Competição] [Composite]
       ↓ paralelo, sem acoplamentos
```

**Depois (D2 v2):**
```
[Câmbio] [Supply] [Regulatório] [Competição] [Macro]
       ↓ paralelo, agregação linear simples
[Composite]
```

**Insight novo:** macro entra como **dimensão adicional** — mas ainda é tratada como paralela (sem acoplamentos).

### §4.2 Transição 2: 6 dims paralelas → 8 NBs paralelos (D2 v2 vira pipeline)

**Antes (D2 v1):** um único notebook monolítico `byd-econometric-vulnerability.ipynb`.

**Depois (D2 v2):** 8 notebooks paralelos (NB-01..NB-08), cada um com **outputs independentes** (HTML + JSON + PNG).

**Insight novo:** paralelização de outputs permite **regeneração seletiva** (atualizar NB-07 couplings sem re-rodar todo o pipeline).

### §4.3 Transição 3: 8 NBs paralelos → 11 dims acopladas (D3 v2.0+)

**Antes (D2 v2):** 8 NBs paralelos, agregação linear.

**Depois (D3 v2.0+):**
```
       ┌──── S6 Macro (governor) ────┐
       ↓           ↓          ↓    ↓ ↓
       S1          S2          S3    S4
       FX         Supply       BNDES  Pricing
       ↓           ↓          ↓    ↓
       └──► composite (renormalizado) ◄──┘
                       ↓
                decision tree
                       ↓
              action register (25 ações)
```

**Insight novo:** 5 couplings primários (S1↔S3, S1↔S2, S1↔S4, S3↔S4, S6→all) + 15 secundários = **20 couplings quantitativos** que tornam o framework **prescritivo** (sensível ao cenário).

### §4.4 Transição 4: 11 dims acopladas → 11+parC (D3 v2.0 inclui parC)

**Antes (D3 v0.6):** 11 dims S1-S11.

**Depois (D3 v2.0):** 11 dims + **parC Multivariate Sensitivity Summary** (VaR 4-shock tornado, Cholesky FX-Supply ρ=0,4).

**Insight novo:** parC é uma **metadimensão** que sintetiza o risco multivariado em um único número (VaR 95% = R$ 8,21 bi).

---

## §5. As recálibrações empíricas — onde os dados novos apareceram

### §5.1 As 5 recalibrações do D3 v2.0

| # | Recalibração | Dados usados | Impacto |
|---|---|---|---|
| **R1** | BCB PTAX 10y real | 2.509 obs SGS 10813 | σ PTAX 14,19% → 14,86% |
| **R2** | Lítio 10y real | Fastmarkets + Trading Economics | σ lítio 95% (rebound 2026) |
| **R3** | Tariff 35% Jan/2027 | Camex rejection | Tariff = #1 VaR contributor (29%) |
| **R4** | Lista suja MTE 07/abr/2026 | MPT/MTE | S7 kill switch ativo |
| **R5** | Stagflação 2025 (-11,4% BRL) | BCB IPCA + Selic | Stress event adicionado |

### §5.2 O que essas recalibrações causaram no composite

| Recalibração | Efeito no composite |
|---|---|
| R1 (σ PTAX 14,86%) | +1-2pp no composite (vol maior) |
| R2 (lítio rebound) | +2-3pp no S2 supply |
| R3 (tariff 35%) | +3-4pp no composite (S10 RED permanente) |
| R4 (lista suja) | composite fixo em 95 (S7 kill switch override) |
| R5 (stagflação 2025) | -1 a -2pp (vol AMBER, GREEN regional) |

Combinado: composite 71,8 → 50,3 RED Modo Crise.

---

## §6. Mapa final — outputs ↔ notebooks ↔ versões

```
D2 v1 (jul/2025)                    D2 v2 (19/jul/2026)
├── 6 HTMLs "shells"                  ├── 6 HTMLs refresh
├── 11 PNGs estáticos                 ├── 11 PNGs estáticos
├── NB-01 (parcial)                  ├── NB-01, NB-02, NB-03, NB-04 (completos)
├── (sem NB-02..NB-08)                ├── NB-05, NB-06, NB-07, NB-08 (novos)
└── composite n/a                     └── composite 71,8

D2 v2.1 (final jul/2026)             D3 v2.0+ (15-18/ago/2026)
├── 6 HTMLs estáveis                  ├── +4 HTMLs D3 (NB-01 a NB-04 outputs)
├── +15 triggers, RACI 4-pessoa       ├── +15 NBs restantes (NB-09..NB-15)
├── composite 71,8                    ├── 5 recalibrações empíricas
└── 10 gaps (4 RESOLVIDO, 6 OPEN)    └── composite 50,3 RED + 5/5 PERFEITO
```

---

## §7. Cross-refs e recursos

### §7.1 Outputs

- [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) — relatório técnico completo (3.7 MB, 13 figuras).
- [`/analise-prescritiva/reports/atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html) — Atlas D2 white paper (66 KB).
- 6 HTMLs canônicos: [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html), [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html), [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html), [`regulatory-scenarios.html`](../../d2-econometric-vulnerability/outputs/regulatory-scenarios.html), [`competition-landscape.html`](../../d2-econometric-vulnerability/outputs/competition-landscape.html), [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html).

### §7.2 Notebooks canônicos

- [`/analise-prescritiva/notebooks!/02-canonicos/`](../../analise-prescritiva/notebooks!/02-canonicos/) — 15 notebooks (NB-01..NB-15).
- [`/analise-prescritiva/notebooks!/INDICE.md`](../../analise-prescritiva/notebooks!/INDICE.md) — índice unificado dos notebooks.
- [`/analise-prescritiva/notebooks!/LINHAGEM.md`](../../analise-prescritiva/notebooks!/LINHAGEM.md) — linhagem técnica por fase.

### §7.3 Couplings

- [`/analise-prescritiva/reports/decision-framework/2_couplings/`](../../analise-prescritiva/reports/decision-framework/2_couplings/) — 11+ documentos de couplings.
- [`/analise-prescritiva/reports/decision-framework/3_recalibration/`](../../analise-prescritiva/reports/decision-framework/3_recalibration/) — 10 documentos de recalibração.

### §7.4 Outputs D3 (adicionados após D2 v2.1)

- [`/analise-prescritiva/outputs/nb01_monte_carlo.html`](../../analise-prescritiva/outputs/nb01_monte_carlo.html) — NB-01 MC output.
- [`/analise-prescritiva/outputs/nb02_hhi_concentration.html`](../../analise-prescritiva/outputs/nb02_hhi_concentration.html) — NB-02 HHI concentration.
- [`/analise-prescritiva/outputs/nb06_tornado_chart.html`](../../analise-prescritiva/outputs/nb06_tornado_chart.html) — NB-06 tornado.

---

## §8. Takeaways em 5 bullets

1. **6 outputs HTML canônicos** — 5 são "shells" Plotly (8-9 KB cada), 1 tem motor MC inline (105 KB, cambio-monte-carlo.html).

2. **15 notebooks canônicos** — 8 são D2 (NB-01..NB-08), 7 são D3 (NB-09..NB-15). Cada NB tem `.ipynb` + `.py` espelho + JSON de resultados.

3. **3 grandes transições:** 5 dims → 6 dims (+macro) → 8 NBs paralelos → 11 dims acopladas → 11+parC.

4. **22 insights canônicos** surgiram/desapareceram entre versões. 10 são invariantes cross-version (CATL 95,7%, fórmula composite 4-dim, etc.).

5. **5 recalibrações empíricas** (R1 BCB PTAX, R2 lítio, R3 tariff, R4 lista suja, R5 stagflação) causaram composite 71,8 → 50,3 RED.

---

*Versão 1.0 — 25/ago/2026 — escrita como nota-meta de drift de arquitetura (sem exercises).*

*Próxima: [Nota-Meta D2 #07-C — Drift de Gaps Estruturais](./NOTA-META-D2-07C-DRIFT-GAPS.md) (10 gaps D2-AUDIT → resolução no D3).*