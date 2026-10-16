---
slug: notas-meta-d3-03-acoplamentos-gametheory
title: "Nota-Meta D3 #03 — Acoplamentos Quantitativos + Game Theory (NASH D3 vs D2)"
ueid: ikigai:nota:d3-meta-acoplamentos-gametheory:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d3, acoplamentos, couplings, game-theory, nash, h-formula, duplo-cost-shock, tornado]
custom:
  _purpose: >-
    Deep dive nos 5 Modeled Couplings primários + 15 secundários = 20
    couplings quantitativos, com fórmulas explícitas. Cobre também o
    game theory de 5 players (BYD/Stellantis/GM/VW/Geely) com NASH
    equilibrium E3 (Differentiate, Differentiate) e o duplo cost-shock
    FX+Tariff. Compara o D2 (1-shot) com o D3 (NASH + duplo-shock).
    Foco didático, sem exercícios.
  _audience: risk-officer, modelador, COO, pesquisador, CSO
  _data_sources:
    - /analise-prescritiva/reports/decision-framework/2_couplings/ (11 docs)
    - /analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md
    - /analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md
    - /analise-prescritiva/reports/decision-framework/3_recalibration/D3-INTERDEPENDENCY-S1-S2.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md
  _outputs:
    - 5-couplings-primarios-formulas
    - 15-couplings-secundarios
    - game-theory-5-players
    - duplo-cost-shock-tornado
  _success_criteria: >-
    leitor entende cada coupling (primário e secundário), conhece o
    NASH E3 (Differentiate, Differentiate), e sabe por que Tariff
    é o maior contributor VaR (29%).
---

# Nota-Meta D3 #03 — Acoplamentos Quantitativos + Game Theory

> **Quem está falando:** um par sênior-orientador sobre a "dinâmica" do D3.
> **O que esta nota faz:** deep dive nos 5 Modeled Couplings primários + 15 secundários = 20 couplings quantitativos, e no game theory de 5 players (BYD/Stellantis/GM/VW/Geely).
> **Pré-requisito:** [Nota-Meta D3 #02 — Arquitetura + 11D](./NOTA-META-D3-02-ARQUITETURA-11D.md).
> **Tempo de leitura:** 60-90 min.
> **Fonte canônica:** [`/analise-prescritiva/reports/decision-framework/2_couplings/`](../../analise-prescritiva/reports/decision-framework/2_couplings/) (11 docs) + [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md).

---

## §0. Visão geral — por que acoplamentos mudam tudo

A pergunta operacional: **"por que as dimensões não são tratadas como silos?"**

A resposta do D2 era: "porque somamos tudo no composite" (agregação linear).
A resposta do D3 é: **"porque cada dimensão afeta a outra de forma quantitativa"** (acoplamento).

O **D2 tratava as 6 sessões como paralelas**. O **D3 reconhece 20 couplings quantitativos** que tornam o framework prescritivo (sensível ao cenário). Esta nota destrinca cada um deles.

---

## §1. Os 5 Modeled Couplings primários

### §1.1 Coupling 1 — S1↔S3 (FX × BNDES)

**A pergunta que responde:** "como o sizing do hedge cambial depende do BNDES funding (ViE)?"

**A fórmula canônica:**

```
h* = 91% - (ViE%/22%) × 61%
```

**O que ela diz:** o **hedge ótimo** (h*) depende do **ViE** (Vehicle Incentive Estimate) — quando o BNDES está saudável (ViE alto), hedge é baixo; quando o BNDES está em Rollback Total (ViE 0%), hedge sobe para 91%.

| Cenário BNDES | ViE | h* calculado | Interpretação |
|---|---|---|---|
| **Expansão** | 25% | **30%** | Hedge baixo, política industrial alinhada |
| **Continuidade** | 18% | **41%** | Baseline razoável |
| **RB Parcial** | 10% | **63%** | Hedge médio, proteger exposição |
| **RB Total** | 0% | **91%** | **Hedge máximo**, cenário de ruptura |

**Por que contraint-based:** o hedge é tão maior quanto menor o ViE, porque o BNDES funding não cobre o BOM importado se o cenário for desfavorável.

**Doc canônico:** [`D3-INTERDEPENDENCY-S1-S3.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md) (15 KB).

### §1.2 Coupling 2 — S1↔S2 (FX × Supply)

**A pergunta que responde:** "e quando o supply chain estressa junto com o FX?"

**A fórmula canônica:**

```
RED:   VaR_joint = 2.5 × (VaR_FX + VaR_Supply)
AMBER: VaR_joint = 1.5 × (VaR_FX + VaR_Supply)
GREEN: VaR_joint = 1.0 × (VaR_FX + VaR_Supply)
```

**Insight contraintuitivo:** supply VaR é **2,5× o FX VaR** em cenários RED — hedge cambial cobre só 1/3 do risco total.

| Cenário | VaR FX | VaR Supply | VaR joint | Razão joint/FX+Supply |
|---|---|---|---|---|
| GREEN | R$ 0,84 bi | R$ 0,30 bi | R$ 1,14 bi | 1,0× |
| AMBER | R$ 1,50 bi | R$ 0,55 bi | R$ 3,08 bi | 1,5× |
| RED | R$ 2,10 bi | R$ 0,85 bi | R$ 7,38 bi | **2,5×** |

**Por que importa:** o stress conjunto FX + supply é o **pior cenário** (VaR 2,5×). O D2 tratava FX e supply como independentes; o D3 reconhece a correlação positiva.

**Doc canônico:** [`D3-INTERDEPENDENCY-S1-S2.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md) (10 KB) + [`D3-RECALIBRATION-S1-S2-REAL.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S2-REAL.md) (17 KB).

### §1.3 Coupling 3 — S1↔S4 (FX × Pricing)

**A pergunta que responde:** "hedge cambial vs pricing defensivo — qual é qual?"

**A fórmula canônica:**

| Cenário | Hedge (R$/unit) | Defensivo (R$/unit) | Ratio |
|---|---|---|---|
| Catalog-wide | R$ 480 | **R$ 4.500** | **9,4×** |
| Targeted (Tier 1) | R$ 480 | R$ 1.500 | 3,1× |
| Targeted (Tier 2) | R$ 480 | R$ 3.000 | 6,3× |

**Insight contraintuitivo:** defensivo de preço catalog-wide é **9,4× mais caro que hedge** (em R$/unit). Catalog-wide destrói **-67% ROI** em Rollback Total. **Foi removido** do action register em v2.0.

**Por que importa:** se o gestor preferir "defensivo" intuitivo, ele está destruindo valor. O hedge cambial é o instrumento correto; o defensivo é o último recurso.

**Doc canônico:** [`D3-INTERDEPENDENCY-S1-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S4.md) (12 KB) + [`D3-RECALIBRATION-S1-S4-TARIFF.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S4-TARIFF.md) (20 KB).

### §1.4 Coupling 4 — S3↔S4 (BNDES × Pricing)

**A pergunta que responde:** "quando o defensivo deixa de fazer sentido?"

**A fórmula canônica:**

```
Break-even: ViE = 10% (Rollback Parcial)
P(defensivo destrutivo) > 0 se ViE < 10%
```

**Insight contraintuitivo:** defensivo catalog-wide é **destrutivo** em RB Total. **Foi removido** do action register.

| Cenário | ViE | Defensivo ROI |
|---|---|---|
| **Expansão** | 25% | +233% (catalog-wide) |
| **Continuidade** | 18% | -25% a +17% |
| **RB Parcial** | 10% | -67% (catalog-wide) |
| **RB Total** | 0% | -67% (catalog-wide) |

**Por que importa:** o defensivo tem **break-even em ViE=10%** (Rollback Parcial). Abaixo, vira value-destructive.

**Doc canônico:** [`D3-INTERDEPENDENCY-S3-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md) (10 KB).

### §1.5 Coupling 5 — S6→all (Macro Governor)

**A pergunta que responde:** "como o regime macro reescala as outras prescrições?"

**A fórmula canônica:**

| Regime macro | Multiplier | Aplicação |
|---|---|---|
| 🟢 GREEN | 1.0× | Baseline |
| 🟡 AMBER | **1.5×** | Stress moderado — dobrar ação |
| 🔴 RED | **2.0×** | Stress severo — quadruplicar |

**Insight:** macro é o **governor de todo o resto**. Um PIB < 0 por 2 trimestres **multiplica por 1,5×** todos os custos de mitigação.

**Latência de transição:** GREEN→AMBER em 5 min, AMBER→RED em 60 min (comitê de crise), RED→AMBER em 24h.

**Doc canônico:** [`D3-INTERDEPENDENCY-S6-TRIGGERS.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md) (12 KB).

---

## §2. Os 15 Couplings Secundários (propagação vetorial)

Cada um dos 5 primários gera ~3 secundários por propagação. Total: **15 secundários**.

### §2.1 S1↔S3 primário → 3 secundários

| Secundário | Pergunta que responde |
|---|---|
| **S1↔S3-S9** | "FX + BNDES + Demand combinados — qual o VaR conjunto?" |
| **S1↔S3-S11** | "FX + BNDES + Competition 5-player NASH — qual o impacto no Payoff BYD?" |
| **S1↔S3-S10** | "FX + BNDES + Tariff 35% — qual o duplo cost-shock?" |

### §2.2 S1↔S2 primário → 3 secundários

| Secundário | Pergunta que responde |
|---|---|
| **S1↔S2-S7** | "FX + Supply + ESG (lista suja) — qual o stress conjunto?" |
| **S1↔S2-S4** | "FX + Supply + Pricing margin compression — qual o impacto no EBITDA?" |
| **S1↔S2-S8** | "FX + Supply + Ramp capacity — qual a exposição remanescente?" |

### §2.3 S1↔S4 primário → 3 secundários

| Secundário | Pergunta que responde |
|---|---|
| **S1↔S4-S8** | "FX + Pricing + Ramp — qual o impacto no ramp financing?" |
| **S1↔S4-S5** | "FX + Pricing + Partnerships — qual o impacto nos contratos LP?" |
| **S1↔S4-S11** | "FX + Pricing + Competition — vale entrar em guerra de preços?" |

### §2.4 S3↔S4 primário → 3 secundários

| Secundário | Pergunta que responde |
|---|---|
| **S3↔S4-S10** | "BNDES + Pricing + Tariff — qual a tripla de stress?" |
| **S3↔S4-S11** | "BNDES + Pricing + Competition — vale defender share com defensivo?" |
| **S3↔S4-S9** | "BNDES + Pricing + Demand — vale acelerar demanda mesmo com ViE baixo?" |

### §2.5 S6→all primário → 3 secundários

| Secundário | Pergunta que responde |
|---|---|
| **S6→S1** | "Macro GREEN vs AMBER — quanto aumentar hedge FX?" |
| **S6→S2** | "Macro GREEN vs AMBER — quanto acelerar safety stock supply?" |
| **S6→S3** | "Macro GREEN vs AMBER — quanto aumentar advocacy BNDES?" |

### §2.6 Total

**5 primários + 15 secundários = 20 couplings quantitativos.** É a rede neural do framework.

---

## §3. Game Theory — 5 Players, 2 Strategies, NASH E3

### §3.1 A pergunta que responde

"BYD deve responder Stellantis/Geely com guerra de preços?"

A resposta contraintuitiva do D3: **NÃO.** A guerra de preços é o pior resultado conjunto.

### §3.2 Os 5 players + market share

| Player | Market Share EV | Estratégia |
|---|---|---|
| **BYD** | ~45% | Leader (Differentiate) |
| **Stellantis** | ~20% | Follower (Differentiate) |
| **GM** | ~15% | Follower (Differentiate) |
| **VW Group** | ~12% | Follower (Differentiate) |
| **Geely/EX5** | ~8% | Aggressor (Differentiate) |

### §3.3 A payoff matrix 5×5 (resumo)

| BYD \ Rival | Price War | Differentiate | Hold |
|---|---|---|---|
| **Price War** | (-60%, -55%) | (-75%, +10%) | (-70%, 0%) |
| **Differentiate** | (+10%, -75%) | **(+5%, +5%)** ← NASH E3 | (-5%, +15%) |
| **Hold** | (0%, -70%) | (+15%, -5%) | (0%, 0%) |

**NASH equilibrium E3: (Differentiate, Differentiate)** — todos diferenciam, nenhum entra em guerra de preços.

### §3.4 Por que guerra de preços é pior para todos

- BYD entrar em Price War = **-60% retorno sobre equity (ROE)**.
- Rival entrar em Price War = **-55% ROE**.
- **Resultado conjunto: -115% ROE = destruição de valor mútua.**

Em contraste, (Differentiate, Differentiate) gera **+5%/+5% ROE** = criação de valor compartilhada.

### §3.5 O que isso significa na prática

| Decisão | Recomendação |
|---|---|
| BYD responde Stellantis com desconto de catálogo | ❌ NÃO — destrói -60% ROE |
| BYD investe em diferenciação (Blade Battery, DM-i, smart driving) | ✅ SIM — preserva margem e moat |
| BYD entra em guerra de preços para "proteger share" | ❌ NÃO — share temporário vale −R$ 8,6 bi NPV agregado |
| BYD verticaliza LFP (AG-DIFF-1) | ✅ SIM — custo marginal menor que rivais |

**3 ações de diferenciação do D3** (AG-DIFF-1/2/3):
- AG-DIFF-1: LFP verticalization (R$ 600M, deadline 31/dez/2027).
- AG-DIFF-2: Technology differentiation (R$ 200M, deadline 30/jun/2027).
- AG-DIFF-3: War of attrition hold (custo oportunidade, prioridade CRÍTICA).

### §3.6 Comparação D2 vs D3 no game theory

| Aspecto | D2 v1 (jul/2025) | D3 v2.0.2 (ago/2026) |
|---|---|---|
| **Tipo de jogo** | 1-shot (snapshot 2024) | Dinâmico (sequential + 5-year projection) |
| **Players** | 5 com 4 estratégias | 5 com 2 estratégias (Differentiate vs Price War) |
| **NASH** | E3 (BYD HIGH, Stel LOW, GM LOW, VW LOW, Geely HIGH) | E3 (Differentiate, Differentiate) |
| **Payoffs** | Heurísticos (não auditados) | Recalibrados com realized margins |
| **Insight** | "BYD consolida 55-65% share até 2027" | "Guerra de preços é −R$ 8,6 bi NPV agregado" |

### §3.7 Doc canônico

- [`D3-GAME-THEORY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md) (31 KB) — modelo completo.
- [`D3-INTERDEPENDENCY-S11-COMPETITION.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md) (26 KB) — coupling S11.

---

## §4. O duplo cost-shock FX + Tariff (S1↔S10)

### §4.1 A pergunta que responde

"E se FX explode E tarifa entra em 35% simultaneamente?"

A resposta contraintuitiva: o impacto é **multiplicativo, não aditivo**.

### §4.2 O tornado plot (D3 v2.0.1)

| Fator | Peso | Vol anual | Contribuição VaR (R$ bi) | % do VaR total |
|---|---|---|---|---|
| **S10 Tariff (Importação)** | 0,10 | 25% | **2,38** | **29%** |
| S1 FX (PTAX) | 0,15 | 18% | 1,85 | 22,5% |
| S2 Supply | 0,15 | 22% | 1,48 | 18% |
| S3 BNDES | 0,15 | 30% | 1,15 | 14% |
| S8 Ramp | 0,12 | 20% | 0,82 | 10% |
| S11 Competition | 0,12 | 15% | 0,62 | 7,5% |
| S9 Demand | 0,10 | 12% | 0,25 | 3% |
| S6 Macro | 0,05 | 10% | 0,18 | 2% |
| S7 ESG | 0,05 | 35% (binary) | 0,41 | 5% |
| S4 Pricing | 0,05 | 8% | 0,15 | 2% |
| **Total VaR 95%** | 1,00 | — | **8,21** | 100% |

**Insight contraintuitivo:** **Tariff é o maior contributor VaR (29%)** — não FX como a intuição sugere. Isso muda a priorização de ações.

### §4.3 O duplo cost-shock (T-MV1)

Cenário: **FX > 6.2 AND Supply RED AND Tariff > 30% AND S7 RED simultâneos**.

| Dimensão | Shock |
|---|---|
| PTAX | +30% (BRL desvaloriza) |
| Tariff | 35% (Camex) |
| Supply (CATL) | outage 30d |
| ESG (lista suja) | BNDES bloqueado |

**VaR conjunto: R$ 12,8 bi** (probabilidade 2%). É o pior cenário do framework.

**Resposta:** composite 95 fixo, freeze all capex, bridge R$ 800M, CEO + Conselho em 24h.

### §4.4 Por que FX e Tariff são multiplicativos, não aditivos

- FX explode: BOM importado 42% × +30% = +12,6% no custo.
- Tariff 35%: sobre o BOM importado inteiro = +35% no custo.
- **Combinado: 1,126 × 1,35 = +52% no custo** (não 1,126 × 1,35 = +52% = 1,52× base).

**Mas o efeito na margem é pior:** se a margem base é 12% do preço, e o custo sobe 52%, a margem cai para 12% - 52%×(42%/100%) = 12% - 21,8% = **-9,8%** (prejuízo direto).

Por isso o duplo cost-shock é o pior cenário.

### §4.5 Doc canônico

- [`D3-MULTIVARIATE-SENSITIVITY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md) (32 KB) — modelo quantitativo completo.
- [`D3-INTERDEPENDENCY-S10-TARIFF.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md) (23 KB) — coupling S10.

---

## §5. A h* formula em ação (D3 v2.0.2)

### §5.1 Os 4 cenários BNDES hoje (jul/2026)

| Cenário | ViE | h* Expansão original | h* recalibrado (v2.0) |
|---|---|---|---|
| **Expansão** | 25% | 30% | **35%** (+5pp) |
| **Continuidade** | 18% | 41% | **46%** |
| **RB Parcial** | 10% | 63% | **68%** |
| **RB Total** | 0% | 91% | **91%** |

### §5.2 O que a recalibração mudou

- **h* Expansão**: 30% → 35% (+5pp). Por que? Fastmarkets mostrou que lítio em cenário benigno tem σ maior que estimado.
- **Vol 30d AMBER**: 18% → 15% (-3pp). Limiar AMBER é mais conservador — aciona antes.
- **Vol 30d RED**: 25% → 30% (+5pp). Limiar RED é mais tolerante — somente em stress true.

**Implicação:** hedge na Expansão é **mais alto que se pensava** (35% em vez de 30%). Custo de hedge aumenta ~17% no caso benigno, mas protege contra downside.

### §5.3 Premium hedge 6m

| h* | Custo 6m | Para VGV R$ 30 bi/ano |
|---|---|---|
| 30% | R$ 30M | R$ 1,00M/% hedge |
| 35% | R$ 36M (+20%) | R$ 1,03M/% |
| 50% | R$ 60M (+100%) | R$ 1,20M/% |
| 91% | R$ 130M (+333%) | R$ 1,43M/% |

Custo marginal de hedge **cresce com saturação** — alugar hedge para 91% é 1,4× mais caro por % que alugar para 30%.

---

## §6. Comparação D2 vs D3 nos couplings

| Aspecto | D2 v1 | D3 v2.0.2 |
|---|---|---|
| **# couplings** | 0 (modelo aditivo) | 20 (5 primários + 15 secundários) |
| **Fórmula h*** | "50% flat" | `h* = 91% - (ViE%/22%) × 61%` |
| **VaR conjunto FX+Supply** | Independente | 2.5× in RED (correlacionado) |
| **Hedge vs Defensivo** | Ambos 50% (heurístico) | Hedge R$ 480/unit vs Defensivo R$ 4.500/unit (~9× ratio) |
| **Macro** | Descritivo (correlações, IRF, FEVD) | Prescritivo (multiplier 1.0×/1.5×/2.0×) |
| **Game theory** | 1-shot (snapshot 2024) | Dinâmico (NASH E3 estável, sequential games) |
| **Duplo cost-shock** | Não modelado | Modelado (T-MV1, 4-shock tornado, VaR R$ 12,8 bi) |
| **Defensivo break-even** | Implícito (não testado) | Explícito (ViE=10%) |
| **Tariff 35%** | Tratada como upside (D2 v1) | Tratada como base (D3 v2.0+) — peso dobrado 0,05→0,10 |

**Conclusão:** o D3 transformou o D2 de "agregação linear" para "rede neural de couplings quantitativos". Cada decisão é sensível ao cenário.

---

## §7. Cross-refs e recursos

### §7.1 Os 11 documentos de couplings

- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-DEPENDENCY-GRAPH.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-DEPENDENCY-GRAPH.md) — grafo 6×6 consolidado.
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md) (10 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md) (15 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S4.md) (12 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md) (10 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S5-COUPLED.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S5-COUPLED.md) (15 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md) (12 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S7-ESG.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S7-ESG.md) (23 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S8-RAMP.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S8-RAMP.md) (24 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S9-DEMAND.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S9-DEMAND.md) (15 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md) (23 KB).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md) (26 KB).

### §7.2 Game theory e quantitative

- [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md) (31 KB).
- [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md) (32 KB).
- [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-QUANTITATIVE-MODEL.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-QUANTITATIVE-MODEL.md) (37 KB).

### §7.3 Recalibração

- [`/analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md) (24 KB) — 5 recalibrações.
- [`/analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md) (10 KB) — BCB PTAX real.

---

## §8. Takeaways em 5 bullets

1. **5 primários + 15 secundários = 20 couplings quantitativos.** Cada acoplamento responde uma pergunta de decisão que o D2 deixava em aberto.

2. **h* = 91% - (ViE%/22%) × 61%** é a fórmula-estrela. Captura contraint-based hedging: quanto pior o ViE, mais hedge.

3. **VaR conjunto FX+Supply = 2,5× em RED** (correlação positiva). D2 tratava como independente; D3 reconhece a correlação.

4. **Hedge R$ 480/unit vs Defensivo R$ 4.500/unit (~9× ratio).** Defensivo catalog-wide destrói valor — **foi removido** do action register em v2.0.

5. **NASH E3 (Differentiate, Differentiate)** é o equilíbrio de 5 players. Guerra de preços é o pior resultado conjunto (-R$ 8,6 bi NPV agregado). Tariff é o maior contributor VaR (29%).

---

*Versão 1.0 — 25/ago/2026 — escrita como deep dive de couplings + game theory (sem exercícios).*

*Próxima: [Nota-Meta D3 #04 — Gates + RACI + 40 ações](./NOTA-META-D3-04-GATES-RACI-ACOES.md).*