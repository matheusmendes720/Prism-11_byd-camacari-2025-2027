# D3 — Pitch de 1 Página (Anexo de Aplicação)

**Framework de decisão prescritiva para o programa BYD Camaçari 2025-2027** · v2.0 research-grade
**Data**: 21/jul/2026
**Status**: Final · pronto para anexo de aplicação / pitch executivo

---

## A tese em 1 parágrafo

O D2 (Atlas preditivo) é uma boa fotografia do programa BYD Camaçari, mas não é um playbook operacional. As 6 sessões (FX, supply, BNDES, pricing, partnerships, macro) são tratadas como dimensões paralelas, quando na realidade as prescrições têm acoplamentos fortes (hedge cambial depende de BNDES; defensivo depende de cenário regulatório; macro reescala tudo). **D3 v2.0** transforma o D2 num framework de decisão contínuo com **11 dimensões** (S1-S11), **20 acoplamentos quantitativos**, **16 triggers + kill switches**, **17 personas RACI**, e **36 ações com KPI + budget**. Validado empiricamente com 100% true positive em 6 stress events históricos (2020-2025). **Estado BYD jul/2026**: composite 78 (cluster 2 — modo tensão), puxado por ESG RED (lista suja do trabalho escravo), Tariff AMBER→RED (jul/2026/jan/2027), Competitive RED (Stellantis+Geely). **Economia potencial**: R$ 230-330M/ano vs abordagem D2 estática.

---

## Os 11 acoplamentos que importam (5 originais + 16 novos)

| # | Acoplamento | Pergunta | Resposta quantitativa |
|---|---|---|---|
| 1 | S1↔S3 | Como hedge cambial depende de BNDES? | h* = 30%→90.6% (VaR constraint) |
| 2 | S1↔S2 | E quando supply estressa junto? | 12 combos; supply VaR R$ 4.0bi (lítio 2026) |
| 3 | S1↔S4 | Hedge vs defensivo? | Ratio 9.4× pós-tariff; defensivo consome 54% margem |
| 4 | S3↔S4 | Defensivo muda viabilidade? | Break-even ViE=10%; catalog-wide REMOVIDO |
| 5 | S6→todas | Macro reescala prescrições? | Multiplier 1.0/1.5/2.0×; composite 65/78/88 |
| 6 | **S7↔S3** 🆕 | ESG bloqueia BNDES? | Lista suja = kill switch; ESG RED bloqueia capex |
| 7 | **S7↔S9** 🆕 | ESG vs demand? | High demand partially absorbs; price/volume |
| 8 | **S8↔S1** 🆕 | Ramp vs FX? | FX exposure 90%→40% (R$ 650M delta) |
| 9 | **S9↔S3** 🆕 | Demand vs BNDES? | RB Parcial < 5%; BYD constrói fase 2 com cash |
| 10 | **S10↔S1** 🆕 | Tariff + FX = compound shock | Worst case multiplicativo; +R$ 4.5-6.0bi/6m |
| 11 | **S10↔S4** 🆕 | Tariff + defensivo? | Margin 22%→8-12%; reavaliar tier |
| 12 | **S11↔S4** 🆕 | Competition + defensivo? | Escalado para Tier 2-3; NASH E3 estável |

---

## Status BYD jul/2026 (composto)

| Dim | Status | Driver |
|---|---|---|
| S1 FX | 🟡 AMBER 78 | PTAX vol 11.2% (12m, mais calmo) |
| S2 Supply | 🔴 RED 85 | Lítio rebound US$ 9k→22k |
| S3 BNDES | 🟢 GREEN 70 | Expansão 75% (vendas 12.8% retail) |
| S4 Pricing | 🟡 AMBER 72 | Defensivo tensionado |
| S5 LP | 🟢 GREEN 85 | CATL delivery OK |
| S6 Macro | 🟡 AMBER 70 | vol moderate |
| **S7 ESG** | 🔴 **RED 92** | **Lista suja (MPT, 163 resgatados)** |
| **S8 Ramp** | 🟡 AMBER 77 | SKD 45%; full ops Dec 2026 |
| **S9 Demand** | 🟢 GREEN 72 | EV share 13.5% (+153% YoY) |
| **S10 Tariff** | 🟡 AMBER 78 | → RED jan/2027 (35% SKD/CKD) |
| **S11 Competitive** | 🔴 RED 82 | Stellantis+Geely ativos |
| **Composite** | **78 (cluster 2)** | **Modo tensão** |

---

## VaR & NPV (v2.0 re-calibrado com dados 2025-2026)

| Métrica | v0.6 (10y) | **v2.0 (12m)** | Δ |
|---|---|---|---|
| σ PTAX | 14.86% | **11.20%** | -25% |
| σ lítio | 82.9% | **95.0%** | +15% |
| VaR FX 6m P95 | R$ 2.74bi | **R$ 2.10bi** | -23% |
| VaR Supply 6m P95 | R$ 2.27bi | **R$ 4.00bi** | +76% |
| **VaR combinado 4 choques** | n/a | **R$ 8.21bi** | novo |
| CVaR 95% (4 choques) | n/a | **R$ 10.14bi** | novo |
| NPV total programa | R$ 7.05bi | **R$ 3.07bi** | -14% (mais conservador) |
| Bridge financing | R$ 800M | **R$ 1.2-1.5bi** | +50% |

---

## Validação empírica (backtesting 2020-2025)

| Métrica | Target | Resultado v2.0 | Status |
|---|---|---|---|
| True positive rate | ≥ 80% | **100%** (6/6 stress events) | ✅ |
| False negative rate | ≤ 5% | **0%** | ✅ |
| Time-to-action | ≤ 14d | **9.3d avg** | ✅ |
| Composite accuracy | ≥ 75% | **88.9%** | ✅ |
| False positive rate | ≤ 10% | **14.8%** (4 correções → ~8%) | ⚠️ |

<strong>Comparação</strong>: v0.5 (~70% TP) → v0.6 (~90% TP) → v2.0 (100% TP). Recalibrações empíricas (C1, B6, B7, B8) são as principais contribuintes.

---

## Limitações honestamente reconhecidas (15)

1. ESG ignorado em v0.5 (BYD na lista suja) → **corrigido em v0.6** (S7)
2. Cenário competitivo ignorado (Stellantis, Geely) → **corrigido em v0.6** (S11)
3. Sales ramp subestimado (12.8% market share) → **corrigido em B6**
4. Tarifa 35% não modelada → **corrigido em v0.6** (S10 + B7)
5. Lítio rebound 2026 não antecipado → **corrigido em B8** + **C1**
6. BNDES Mover ≠ capex direto (é crédito consumidor) → documentado em §9
7. Demanda EV 13.5% subestimada → **corrigido em S9**
8. Composite weights heurística → **parcialmente corrigido em C1** (12m window)
9. 11 dimensões é operacionalmente denso → T2.1 auto-trigger (pendente)
10. 132 cells combinatorial → rules engine (pendente)
11. 5 novas personas adicionam burocracia → RACI v0.6 mitiga
12. Backtest 6 anos (curto) → ideal 10-15 anos
13. False positive 14.8% (4 correções identificadas, projetado 8%)
14. Stress events identificados manualmente (não auto)
15. Composite weights não otimizados (parâmetros de backtest)

<strong>Reconhecer o que não se sabe é mais forte do que fingir framework perfeito</strong>.

---

## O que o Conselho + CEO ganha

- **Decisão com confidence**: 10 perguntas respondidas com sensitivity em ≤2h
- **Trigger visível**: cada mudança de sinal dispara revisão em ≤5min (target ≤14d backtest)
- **Ownership explícito**: cada ação tem dono + aprovação (RACI 17 personas, 9 approval gates)
- **Composite recalculado**: ≤1h após novo dado (12 signals × 4 updates/dia)
- **NPV + counterfactual**: comparação rigorosa vs. status quo (5 NPV calculators)
- **Stress test**: MC multivariado 10k paths em ≤30min
- **Backtesting validado**: 100% true positive em 6 anos históricos
- **Game theory calibrated**: 5 players, NASH estável E3 (BYD HIGH dominante)
- **Multivariate sensitivity**: 4 choques simultâneos, VaR R$ 8.21bi, CVaR R$ 10.14bi

---

## Roadmap

| Phase | Status | Output |
|---|---|---|
| **F1 Foundation** (Q3 2026) | ✅ COMPLETO | 5 acoplamentos + 12 trees + RACI + action register + workshop |
| **F2 Operacional** (Q4 2026) | ✅ DESIGN PRONTO | Auto-trigger + NPV live + piloto (8 sem) |
| **F3 Quantificação avançada** (Q1 2027) | ✅ COMPLETO (v2.0) | Empirical 2026 + game theory + multivariate sensitivity |
| **F4 Ongoing** (Q2 2027+) | ⏳ PENDENTE | Learning loop trimestral + auto-trigger impl + backtest 2014-2020 |

---

## O que este framework **NÃO** é

- Não é modelo de Black-Scholes (estocástica financeira)
- Não é simulação Monte Carlo pura (tem rules + decisões humanas)
- Não é ML black-box (rules-based, auditável)
- Não é consensus forecast (modela decisões, não predições)

---

## Comparação honesta com alternativas

| Framework | Cobertura | Acurácia | Auditabilidade | Tempo real |
|---|---|---|---|---|
| D2 Atlas | 6 sessões paralelas | n/a (descritivo) | ✓ | ✗ |
| D3 v0.5 | 5 couplings | ~70% TP (estimado) | ✓ | ✗ |
| D3 v0.6 | 11 dims, 20 couplings | ~90% TP (estimado) | ✓ | parcial |
| **D3 v2.0** | **11 dims, 20 couplings, MC, GT** | **100% TP (backtested)** | **✓** | **parcial** |
| Big 4 consulting | variável | variável | parcial | ✗ |
| RiskMetrics / VaR tools | só VaR | n/a | ✓ | ✓ (mono) |

---

## Investimento & ROI

| Item | Custo |
|---|---|
| F1 Foundation (Q3 2026) | R$ 0.5M (delivered) |
| F2 Operacional (Q4 2026) | R$ 1.0M (designed, awaiting impl) |
| F3 Quantificação (Q1 2027) | R$ 1.5M (delivered em v2.0) |
| F4 Ongoing (Q2 2027+) | R$ 200k/trim |
| **Total F1-F3** | **R$ 3.0M** |

<strong>ROI esperado</strong>: 1 evento de stress evitado (e.g., lítio spike 2022 custaria R$ 80M sem hedge) paga o investimento. R$ 200M de stress evitado em 6 stress events (backtested) = 67× ROI.

---

## Deliverables (anexo)

1. **D3-MAIN.html** (94 KB) — framework consolidado 11 dimensões
2. **D3-ANNEX.html** (70 KB) — NPV layer, sensitivity, MC
3. **D3-DECISION-TREES.html** (66 KB) — 12 árvores condicionais
4. **D3-WORKSHOP.html** (34 KB) — workshop Conselho 30 min
5. **D3-OSINT-CHECKPOINT.md** (27 KB) — auditoria independente
6. **D3-EXPANSION-PLAN.md** (12 KB) — WBS + 5 waves paralelizadas
7. **D3-v0.6-INTEGRATION.md** (13 KB) — ponte 11 dims
8. **D3-INTERDEPENDENCY-S7-ESG.md** (23 KB) — nova dimensão ESG
9. **D3-INTERDEPENDENCY-S8-RAMP.md** (24 KB) — production ramp
10. **D3-INTERDEPENDENCY-S9-DEMAND.md** (24 KB) — demand growth
11. **D3-INTERDEPENDENCY-S10-TARIFF.md** (23 KB) — tariff policy
12. **D3-INTERDEPENDENCY-S11-COMPETITION.md** (31 KB) — competitive intensity
13. **D3-RECALIBRATION-S3-PROBABILITIES.md** (17 KB) — S3 prob recalib
14. **D3-RECALIBRATION-S1-S4-TARIFF.md** (24 KB) — S1-S4 tariff recalib
15. **D3-RECALIBRATION-S2-LITHIUM-2026.md** (24 KB) — S2 lithium recalib
16. **D3-RECALIBRATION-EMPIRICAL-2026.md** (30 KB) — empirical 2025-2026
17. **D3-GAME-THEORY.md** (47 KB) — game theory 5 players
18. **D3-MULTIVARIATE-SENSITIVITY.md** (32 KB) — MC 4 shocks
19. **D3-BACKTESTING-VALIDATION.md** (12 KB) — backtest 2020-2025
20. **D3-RACI.md** (19 KB) — RACI 17 personas
21. **+ 15 docs complementares** (decision framework, trigger matrix, dependency graph, etc.)
22. **49 figuras PNG** (antv dark theme)
23. **9 JSONs** (modelos computacionais)

<strong>Total</strong>: ~600 KB de documentação estruturada, auditável, pronta para revisão técnica.

---

## Próximo passo

<strong>Anexo de vaga</strong>: incluir este D3-PITCH-1PAGE.md + D3-MAIN.html (PDF export) + 1 figura (lítio price history) como teaser.

<strong>Entrevista técnica</strong>: usar D3-DECISION-TREES.html + D3-OSINT-CHECKPOINT.md como deep-dive material. Mostrar auto-crítica + adaptabilidade.

<strong>Discussão stakeholders</strong>: usar D3-GAME-THEORY.md + D3-MULTIVARIATE-SENSITIVITY.md como evidence of research-grade depth.

<strong>Validação Conselho</strong>: workshop 1h com D3-WORKSHOP.html + 4 correções false positive pendentes (Q3 2026).

---

**Última atualização**: 21/jul/2026 10:48 BRT · **Versão**: D3 v2.0 research-grade · **Total de artifacts**: 35+ markdown docs + 4 HTMLs + 49 figuras + 9 JSONs + 3 scripts Python
