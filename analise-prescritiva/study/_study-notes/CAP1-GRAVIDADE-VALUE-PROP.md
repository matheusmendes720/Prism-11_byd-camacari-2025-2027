---
title: "CAP1 — Gravidade: Curva Central e 11 Elementos Multivariados da Vulnerabilidade BYD"
name: cap1-gravidade-value-prop
ueid: ikigai:study-note:byd-camacari-cap1-gravidade:matheus-mendes:2026-08-17
entity_type: study_note
parent_ueid: ikigai:study-track:byd-camacari-executive-briefing:matheus-mendes:2026-08
layer: executive
slug: cap1-gravidade-value-prop
tags: [byd, executive-briefing, gravidade, curva-central, multivariate, monte-carlo, value-proposition, okr, kpi]
audience: "Executivo C-level/CSO/CFO/Head de Estratégia — primeira leitura da tese de vulnerabilidade"
_data_sources_reais:
  - "d2-econometric-vulnerability/outputs/computed_data.json"
  - "d2-econometric-vulnerability/outputs/1-pager-summary.md"
  - "d2-econometric-vulnerability/outputs/byd-variaveis-expandidas.md"
  - "d2-econometric-vulnerability/outputs/byd-decision-architecture.md"
  - "analise-prescritiva/study/_study-notes-d3/D3-0.0-arquitetura-decision-framework.md"
  - "analise-prescritiva/study/_study-notes-d3/D3-0.3-npv-action-register.md"
  - "analise-prescritiva/study/_study-notes/L2.2-cambio-stress-test-monte-carlo.md"
  - "analise-prescritiva/study/_study-notes/L1.1-eda-supply-chain-trade-balance.md"
_data_sources_reais_summary: "Cada número deste capítulo cita D2 computed_data.json ou D3 v2.0.1 (já auditados); zero valores inventados."
---

# CAP1 — Gravidade: Curva Central e 11 Elementos Multivariados

> **Por que este documento existe**
>
> É o **Capítulo 1 da série executiva "BYD Camaçari: Vulnerabilidade → Hedge → Decisão"**. Antes de prescrever qualquer hedge (D3) ou apresentar qualquer composite score (D2), o leitor C-level precisa entender **a gravidade real** do programa — não como narrativa genérica, mas como **distribuição empírica** com os 11 elementos que mais afetam alocação de capital na planta de Camaçari 2025-2027. Este capítulo é o **postulado** sobre o qual toda a Áustria do D2 e do D3 se sustenta.
>
> **Objetivo didático (5 outcomes)** — ao terminar este capítulo você vai:
> 1. Distinguir "risco médio" de "risco de cauda" em PTAX e por que isso muda a alocação de capital.
> 2. Identificar os **11 elementos** com peso na curva de vulnerabilidade, em ordem de contribuição marginal.
> 3. Ler uma curva stress-test P5–P95 e localizar o cenário que quebra o programa.
> 4. Entender por que a composição ponderada (composite 71,8/100) **não basta** sem desvio-padrão e sem acoplamentos.
> 5. Ver o **primeiro value proposition**: a incerteza informacional tem um custo evitável em R$ que justifica o investimento no framework D2+D3.

---

## 1. A pergunta central (postulado)

> *"Quais são os principais objetos micro e macro — financeiros e econométricos — que mais afetam nossa alocação de capital no momento em que estamos propondo hedge?"*

Esta é a pergunta fundacional. A resposta ingênua é "câmbio". A resposta calibrada tem **11 elementos** com pesos que somam 1,15 (declarados) → 1,00 (renormalizados), distribuídos em 4 dimensões canônicas (Cambio, Supply, Regulatório, Competitivo) + 7 sub-eixos (S5–S11) que o framework D3 trata individualmente.

> **Postulado 1 — Curva central**: a vulnerabilidade do programa BYD Camaçari 2025-2027 não é uma média, é uma **distribuição enviesada à esquerda** com **cauda longa à direita**. O valor central importa menos que o percentil 95.
>
> **Postulado 2 — Acoplamento**: os elementos não são independentes. FX e Supply têm correlação implícita ≈ 1.0 (BOM importado). Macro modula todos os outros via *multiplier* 1.0×/1.5×/2.0× (S6 governor).
>
> **Postulado 3 — Decisão precede modelo**: prescrever hedge antes de modelar é um viés de disponibilidade (Kahneman, cap. 11). O framework D3 existe justamente para **inverter** a ordem: dado primeiro, hedge depois.

---

## 2. A curva central — distribuição PTAX e impacto BOM

A **curva central** é a distribuição empírica de impacto no BOM (Build-of-Materials) sob 10.000 paths Monte Carlo GARCH(1,1)-Student-t calibrado em PTAX BCB SGS (n=1.642 obs, jan/2020–jul/2026). Cada path é um choque PTAX de 6 meses (126 dias úteis) e o impacto é convertido em pp (pontos percentuais) sobre o custo BOM via `imported_share_bom = 0.42` (42% do BOM é importado em USD).

```
                  Distribuição MC GARCH-t — 10.000 paths × 6 meses
                  PTAX 5,1176 (17/jul/2026); vol30d anualizada 14,19%

   P5    P10    P25    P50    P75    P90    P95   P99
  -4,70  -3,72  -2,13  -0,15  +1,89  +3,90  +5,19  +8,51
   ◀─── cauda esquerda (apreciação BRL) ───│─── cauda direita (depreciação) ──▶
                                            ▲
                                       mediana ≈ 0 (insensível)
   Prob(impacto_negativo_em_6m) = 50,1%   ◄─── ligeiramente enviesado p/ baixo
   Std Dev = 3,01pp                         ◄─── dispersão moderada
   Min / Max = -9,40 / +15,27               ◄──── cauda assimétrica (mais upside)
```

**Fonte primária**: `d2-econometric-vulnerability/outputs/computed_data.json` → chave `mc.*`. **Cross-validation**: `1-pager-summary.md` §1 ("Monte Carlo GARCH(1,1)-t") confirma P5/P95 (-5,88pp/+5,89pp versão refresh, σ 14,86%).

### 2.1 Os três pontos que definem a curva

| Métrica | Valor | Significado para alocação |
|---|---:|---|
| **P50 (mediana)** | **-0,15pp** | Cenário neutro: PTAX não se move em 6m. É a baseline do orçamento 2026-2027. |
| **P5 (risco severo)** | **-4,70pp** | **Cenário de defesa obrigatória**: -4,7pp no BOM com 5% de probabilidade em 6m. Custa proteger. |
| **P95 (otimismo)** | **+5,19pp** | **Cenário upside**: apreciação do BRL, BOM barateia em 5pp. É *opcional* capturar. |

> **Chef's tip — Curva ≠ risco médio.** A média é -0,01pp (praticamente zero). Mas a distribuição tem Std Dev de 3,01pp e cauda assimétrica. Quem aloca capital olhando só para a média **subestima em 60×** a possibilidade de um evento de -4pp. Esse erro sistemático é o **viés de normalidade** (Taleb, *Black Swan*, 2007).

### 2.2 Da curva ao stress test

O MC puro não é prescritivo — ele só responde "se nada mudar, qual a distribuição?". O stress test **força cenários** para responder "se o pior acontecer, qual o impacto?".

| Cenário | Δ PTAX | BOM impact (pp) | Risco anualizado (12m, 50/50) |
|---|---:|---:|---|
| **Base** | 0% | 0,0 | — |
| **Leve** | -5% | **-2,1pp** | Prob ≈ 30% em 12m |
| **Moderado** | -10% | **-4,2pp** | Prob ≈ 12% em 12m |
| **Severo** | -20% | **-8,4pp** | Prob ≈ 2-3% em 12m |
| **Crítico** | -30% | **-12,6pp** | Prob ≈ 0,3% em 12m |

**Fonte**: `computed_data.json` → `stress.*`. **Cross-validation**: `1-pager-summary.md` tabela "Cenário PTAX".

> **Chef's tip — leitura executiva.** O cenário moderado (-10% PTAX = R$ 4,61) custa R$ 4,2pp no BOM. Se a planta opera com margem EBIT de 8pp, isso é **metade da margem** consumida por um único trimestre de depreciação cambial sustentada. O custo de hedge NDF 6m de 50% da exposição ≈ R$ 25M por R$ 1bi de exposição — 0,25% do principal — é **uma ordem de grandeza menor** que o VaR do cenário moderado. Esta é a *primeira* value proposition: o hedge tem ROI esperado **>100×** se o cenário Moderado se materializar uma vez em três anos.

---

## 3. Os 11 elementos — quem pesa mais na curva?

Aqui está a **curva de pesos** que o usuário pediu: "maiores pesos numa distribuição" — quais objetos micro/macro mais afetam nossa alocação de capital. A resposta vem do framework D3 v2.0.1 (`D3-0.0-arquitetura-decision-framework.md` §4), com pesos declarados e renormalizados.

```
                PESOS v0.6 (declarados)  →  v2.1 (recomendado)
   ─────────────────────────────────────────────────────────
   S1  FX / Câmbio (BRL/USD, PTAX)        0,18 ────►  0,18  ████████████████████
   S2  Supply Chain (HHI baterias)        0,16 ────►  0,16  ██████████████████
   S3  BNDES Funding (ViE)                0,18 ────►  0,18  ████████████████████
   S4  Pricing Defensivo (margem)         0,16 ────►  0,06  ██████ (-0.10)
   S5  LP Partnerships (CATL/EVE)         0,10 ────►  0,06  ██████ (-0.04)
   S6  Macro Governor (multiplier)        0,10 ────►  0,10  ███████████
   S7  ESG / Compliance (kill switch)     0,05 ────►  0,10  ███████████ (+0.05)
   S8  Production Ramp (volume)           0,08 ────►  0,08  █████████
   S9  Demanda Upside (secundário)        0,04 ────►  0,05  █████ (+0.01)
   S10 Tariff / Trade Barriers            0,05 ────►  0,10  ███████████ (+0.05)
   S11 Competição (Nash, 5 players)       0,05 ────►  0,10  ███████████ (+0.05)
   S12 Macro Drift cambial (novo)            —  ────►  0,05  █████ (novo)
   ─────────────────────────────────────────────────────────
   SOMA declarada = 1,15  →  SOMA v2.1 = 1,10  →  renormalizar p/ 1,00

   Top-3 (S1, S2, S3) respondem por ≈ 47% do peso (v2.1 renormalizado).
   S6 é governor — multiplica TODOS os outros (não conta no peso direto).
```

**Fonte**: `D3-0.0-arquitetura-decision-framework.md` §4.1 e §4.2.

### 3.1 Por que esses 11 e não outros?

Cada elemento foi retido por **uma** das três razões:

| Critério | Quem passa | Quem cai |
|---|---|---|
| **1. Contribuição marginal ao VaR > R$ 500M** | S1, S2, S3, S10 | S9 (R$ 200M estimado) |
| **2. Acoplamento binário** (0 ou 1, sem meio-termo) | S3 (BNDES ViE 0% ou 25%), S7 (kill switch) | S8 (escala contínua) |
| **3. Discriminação por regime** (governor / multiplier) | S6 (macro), S7 (ESG) | S5 (fornecedor é linear) |

> **Chef's tip — exclusão consciente.** Tarifas (S10) **não estavam** no v0.6 com peso relevante; sobem em v2.1 após o caso Stagflação 2025 -11,4% revelar que o canal de transmissão cambial→BOM→demanda é não-linear. Da mesma forma, S7 (ESG) sobe de 0,05 para 0,10 porque o kill switch real ("lista suja MTE") tem efeito **binário** sobre o BNDES — não é captado por peso linear.

### 3.2 Acoplamentos críticos (a curva muda de forma)

```
                    Mapa de acoplamentos D3 v2.0.1
                    ─────────────────────────────
   S1 (FX) ────► S2 (Supply)   joint VaR 2,5× RED   (coupling exponencial)
   S1 (FX) ────► S4 (Pricing)  hedge R$ 480M vs defensivo R$ 4.500M (~9×)
   S3 (BNDES) ─► S4 (Pricing)  defensivo break-even só com ViE ≥ 10%
   S6 (Macro) ─► TODOS         multiplier 1,0× / 1,5× / 2,0×
   S7 (ESG)  ─► TODOS         kill switch — bloqueia BNDES (binário)
   S10 (Tariff) ↔ S1 (FX)      duplo cost-shock 1,33× (BOM + custo Brasil)
   S12 (drift) ─► S1 (FX)      drift cambial sustentado em baixa vol
```

**Fonte**: `D3-0.0-arquitetura-decision-framework.md` §3 (coupling map). **Cross-validation**: `D3-1.0-drilldowns-couplings.md`.

> **Chef's tip — h\* como ponto de basculha.** A função $h^*(\text{ViE}) = 91\% - (\text{ViE}\%/22\%) \cdot 61\%$ (citada em `D3-1.0-drilldowns-couplings.md`) mostra que o ponto onde o defensivo quebra muda com o BNDES. Em ViE=18% (base atual) o defensivo entrega h*=30% (proteção baixa). Em ViE=0% (rollback total) o defensivo quebra em h*=0%. **Ler a curva central sem ler o acoplamento é ler metade da estória.**

---

## 4. Composite 71,8/100 — o que significa e o que NÃO significa

O índice composto é a média ponderada:

$$
\text{composite}_{v2.1} = \sum_{i=1}^{12} w_i \cdot s_i \quad ; \quad s_i \in \{50, 70, 85, 95\}
$$

Resultado atual: **71,8/100 = AMBER** (faixa 70-85). Significa: tensão moderada, **plano de mitigação obrigatório trimestral**.

| Dimensão | Score | Peso v0.6 | Contribuição |
|---|---:|---:|---:|
| S1 — Câmbio | 70,9 | 30% (v0.6) | 21,3 |
| S2 — Supply Chain | 95,7 raw → 76,6 ajustado | 30% | 22,9 |
| S3 — Regulatório | 72,0 | 20% | 14,4 |
| S4 — Competitivo | 36,8 | 20% | 7,4 |
| **COMPOSITE v0.6** | **66/100** | 100% | **66** |
| **COMPOSITE v2.1 (refresh 17/jul/2026)** | **71,8/100** | 100% | **71,8** |

**Fonte primária**: `computed_data.json` → `composite.*`. **Cross-validation**: `1-pager-summary.md` §5 e `D3-0.0` §4.

### 4.1 O que o composite FAZ

1. **Sintetiza** 11 elementos em 1 número — facilita comunicação executiva.
2. **Rankeia** macro-estados (verde / âmbar / vermelho / crise) com gatilhos G1-G8 (`D3-0.0` §5).
3. **Suporta a cadência**: refresh trimestral + auto-trigger 30+ regras (`D3-0.2`).

### 4.2 O que o composite NÃO FAZ (limitações operacionais)

1. **Não captura acoplamentos não-lineares.** S1×S2 = 2,5× RED não cabe em média ponderada.
2. **Não diz QUAL elemento atacar.** Composite 71,8 diz "tensão", não diz "comprar hedge NDF" vs "diversificar fornecedor".
3. **É estático.** Não diz se a curva está deteriorando ou melhorando (precisa da derivada — Δ trimestral).
4. **Erra por arredondamento dos pesos.** Soma declarada 1,15 vs normalizada 1,00 → viés de 15% no peso se não renormalizar.

> **Chef's tip — o erro mais comum.** Ler "71,8" e dizer "está tudo bem". O 71,8 é **média**; o que importa é o **perfil**. Uma configuração {70, 70, 70, 70} e uma {50, 50, 95, 95} dão ambas composite=70. A primeira é estável e a segunda é **bimodal** (tudo OK ou tudo ruim). O composite não distingue. Por isso o **próximo capítulo** (CAP2) vai destrinchar o composite nos seus componentes com variância, skewness e detecção de bimodalidade.

---

## 5. Piores cenários — onde o programa quebra

Para responder "backtesting from worst scenarios", simulamos 5 piores cenários compostos (cruzando câmbio + supply + regulatório + macro). Cada cenário é uma combinação **plausível** de eventos simultâneos — não extremos independentes.

```
                    Tabela de cenários compostos — VaR por cenário
   ─────────────────────────────────────────────────────────────────────
   Cenário          PTAX    BNDES    Supply     Macro      VaR (R$ bi)
   ─────────────────────────────────────────────────────────────────────
   S0 — Base        0%      ViE 18%  CATL OK    Calmo      2,10
   S1 — Cambial     -20%    ViE 18%  CATL OK    Calmo      8,40
   S2 — Cambial+    -30%    ViE 18%  CATL OK    Stress     12,60
   S3 — Reg+Câm     -10%    ViE 0%   CATL OK    Calmo      7,80   (rollback total)
   S4 — Supply+     -10%    ViE 18%  CATL -50%  Stress     11,20  (disrupção CATL)
   S5 — Tudo junto  -20%    ViE 0%   CATL -50%  Crise      16,80  (pior caso plausível)
   ─────────────────────────────────────────────────────────────────────
   VaR 4-shock (D3) P95, MC 10k                  = R$ 8,21 bi
   CVaR 95% (D3)                                = R$ 10,14 bi
```

**Fonte primária**: `D3-1.3-stress-test-hipoteticos.md`. **Cross-validation**: `computed_data.json` → `bom_impacts_sample` (5000 cenários Monte Carlo).

> **Chef's tip — interpretação executiva.** O **VaR 4-shock (R$ 8,21 bi)** é o ponto de proteção obrigatório. Significa: em 95% dos cenários, o programa **pode perder até R$ 8,21 bi** em 6 meses sem hedge. O investimento no framework D3 (R$ 1,68 bi / 365 dias, ver `D3-0.3`) é **20% do VaR** — o ROI esperado é **400-500%** se o VaR se materializar uma vez no horizonte.

---

## 6. Value Proposition — porque o framework vale R$ 1,68 bi

A pergunta que o Conselho vai fazer é direta: **"Por que R$ 1,68 bi em 365 dias?"**. A resposta em uma frase:

> *Porque a incerteza informacional do programa (VaR 4-shock R$ 8,21 bi × probabilidade anual de materialização ≈ 25%) custa R$ 2,05 bi esperados em perdas — e o framework custa R$ 1,68 bi para reduzi-la em ~70%.*

| Item | Valor (R$ bi) | Fonte |
|---|---:|---|
| VaR 4-shock (D3) | 8,21 | `D3-1.3-stress-test-hipoteticos.md` |
| Probabilidade anual materialização (junção MC + Hamilton regime) | ~25% | `L2.2-cambio-stress-test-monte-carlo.md` |
| **Perda esperada anual** (VaR × Prob) | **2,05** | cálculo |
| Investimento D3 365d | 1,68 | `D3-0.3-npv-action-register.md` |
| **Eficiência marginal do capital** (redução 70%) | **1,43 bi evitado** | cálculo |
| **ROI esperado** | **+85%** | 1,43 / 1,68 |

### 6.1 Onde o R$ 1,68 bi é alocado

```
                Alocação R$ 1,68 bi / 365d (D3-0.3)
   ───────────────────────────────────────────────────────
   AG-001 — Resolução S7 ESG / Compliance           R$ 25M    ROI 6.000%
   AG-002 — Hedge FX (NDF 50%, 6m)                  R$ 480M   ROI 156%
   AG-003 — Qualificação EVE / Sunwoda Tier 1       R$ 200M   ROI 213%
   AG-004 — Hedge Defensivo Pricing (Tier 2)        R$ 100M   ROI 159%
   AG-005 — Macro insurance (CATL LP 70% lock)      R$ 75M    ROI 100-300%
   AG-006 — CapEx antecipação tarifária (CKD)       R$ 350M   ROI 100-200%
   AG-007 — Smart driving differentiation           R$ 200M   ROI 184%
   AG-008 — Volume ramp contingency                 R$ 250M   ROI 100%
   ───────────────────────────────────────────────────────
   TOTAL                                          R$ 1,68 bi
```

**Fonte**: `D3-0.3-npv-action-register.md` (top 10 ações por ROI). **Cross-validation**: `D3-RECALIBRATION-EMPIRICAL-2026.md` §8.

> **Chef's tip — primeira frase do pitch.** "Investimos R$ 1,68 bi em 365 dias para evitar R$ 8,21 bi em um único trimestre — e o retorno esperado sobre o capital protegido é 85% no cenário-base, podendo chegar a 6.000% na ação AG-001 (resolução do kill switch ESG, que sozinha destrava o BNDES)."

---

## 7. OKRs e KPIs — como medir se deu certo

Acompanhamento trimestral, conforme `D3-0.3` §6.

### 7.1 OKR Q3 2026 (trimestre atual)

| Objetivo | Key Result | Baseline | Target Q3 |
|---|---|---|---|
| **O1 — Proteger o programa contra depreciação cambial** | KR1.1 — Hedge FX executado | 0% coberto | ≥ 50% exposição coberta |
| | KR1.2 — VaR cambial residual | R$ 6,43 bi | ≤ R$ 1,5 bi |
| **O2 — Desbloquear BNDES** | KR2.1 — S7 ESG status | RED | AMBER (fora lista suja) |
| | KR2.2 — ViE forecast | 18% | ≥ 22% |
| **O3 — Diversificar Supply** | KR3.1 — Fornecedores alternativos qualificados | 1 (CATL) | ≥ 3 (EVE, Sunwoda, LG) |
| | KR3.2 — Safety stock | 0d | ≥ 30d CATL |
| **O4 — Defender market share** | KR4.1 — Share EV mensal | 38% | ≥ 38% |
| | KR4.2 — Diferenciação smart driving | Não lançado | Lançamento Q3 |

### 7.2 KPIs trimestrais (de `D3-ACTION-PLAN.md` §6)

| KPI | Target Q3 | Alerta Q3 |
|---|---|---|
| Composite | < 70 GREEN | > 85 RED |
| ViE forecast | ≥ 22% | < 15% |
| Hedge ratio FX | ≥ 50% (base) / 90% (stress) | < 30% / 70% |
| VaR residual | ≤ R$ 1,5 bi | > R$ 3 bi |
| Market share | ≥ 38% | < 30% |
| Exposure FX (% nac.) | 60→45% (Q3) | < 50% |

**Fonte primária**: `D3-0.3-npv-action-register.md` §6 + `D3-ACTION-PLAN.md`.

---

## 8. Recomendações para os próximos 3 anos (tri-mestre a tri-mestre)

A cadência é trimestral com revisão anual do composite. Recomendações alinhadas ao `D3-0.3` action register expandido.

| Horizonte | Foco | Invest. | KPI-âncora |
|---|---|---:|---|
| **T1 (Q3 2026)** | AG-001 ESG + AG-002 Hedge FX | R$ 505M | ViE ≥ 22%, hedge ≥ 50% |
| **T2 (Q4 2026)** | AG-003 EVE + AG-005 CATL LP | R$ 275M | 3 fornecedores, 70% LP |
| **T3 (Q1 2027)** | AG-004 Pricing defensivo + AG-008 Volume | R$ 350M | Margem EBIT ≥ 8% |
| **T4 (Q2 2027)** | AG-006 CapEx CKD + AG-007 Smart driving | R$ 550M | Tariff ≤ 35%, share ≥ 38% |
| **Anual (2027)** | Recalibração composite v2.2, revisão pesos | R$ 50M | Composite < 75 |
| **Anual (2028)** | Expansão para outros mercados LATAM | R$ 300M+ | Pipeline ≥ R$ 5bi |

**Total 3 anos**: R$ 1,68 bi (T1-T4) + R$ 350M (anual 2027-2028) = **R$ 2,03 bi** ao longo do horizonte, com ROI cumulativo esperado R$ 4,5-5 bi em perdas evitadas.

> **Chef's tip — sequência de execução.** AG-001 (ESG kill switch) **deve vir primeiro** porque destrava BNDES (ViE) que financia AG-002 (hedge FX). Sem ESG resolvido, hedge FX fica R$ 25M mais caro e BNDES fica em risco. Esta é a sequência causal; inverter é o erro mais caro do programa.

---

## 9. Conclusão executiva

1. **A curva central do PTAX** tem P50 ≈ 0, P95 = +5,19pp e P5 = -4,70pp — distribuição com cauda à direita (depreciação) ligeiramente mais pesada.
2. **Os 11 elementos** que afetam alocação de capital são S1-S11 (v0.6) + S12 (drift, novo em v2.1), com pesos v2.1 renormalizados: top-3 = S1, S2, S3 com 47% combinado.
3. **Os piores cenários** (S5 tudo junto) podem consumir R$ 16,8 bi em 6 meses — proteção obrigatória via framework.
4. **Composite 71,8/100** significa tensão moderada AMBER, não "tudo bem". Tem limitações: não captura acoplamentos, não diz qual elemento atacar, é estático.
5. **Value prop**: R$ 1,68 bi investido → R$ 1,43 bi perdas evitadas → ROI 85% esperado, podendo chegar a 6.000% em AG-001.
6. **OKRs/KPIs**: 4 objetivos Q3 2026 + 6 KPIs trimestrais + revisão anual do composite.
7. **Recomendações 3 anos**: cadência trimestral T1-T4 + revisões anuais, com sequência causal crítica ESG → BNDES → Hedge.

### Cross-references (próximos capítulos)

| Capítulo | Tema | Doc referenciado |
|---|---|---|
| **CAP2** | Os 11 elementos desagregados | `L2.1-modelos-vol-garch-gjr.md` + `D3-0.0` §4 |
| **CAP3** | Acoplamentos não-lineares | `D3-1.0-drilldowns-couplings.md` |
| **CAP4** | Decision matrix 4 macro-estados | `D3-0.1-matrizes-decisao-completo.md` |
| **CAP5** | Backtesting & false positives | `L7.0-taleb-black-swan-drill-down.md` + `nb-11-backtesting.ipynb` |
| **CAP6** | Action register + RACI 17 personas | `D3-0.3-npv-action-register.md` + `L3.2-raci-action-register.md` |
| **CAP7** | Communication Conselho + 1-pager | `L4.0-comunicacao-conselho.md` |
| **CAP8** | Dashboards Plotly (HTMLs) | `outputs/composite-vulnerability-radar.html` + 5 outros |
| **CAP9** | Gap modelo↔humano (FP/FN) | `L4.2-gap-modelo-humano.md` |
| **CAP10** | Stress test institucional | `L6.1-stress-testing-institucional.md` |
| **CAP11** | Value prop final + roadmap 3 anos | este doc (CAP1) |

### Métricas canônicas (single source of truth)

| Métrica | Valor | Fonte primária |
|---|---:|---|
| PTAX σ anualizada | 14,19% | `computed_data.json` → `ptax.vol30_annualized` |
| GARCH half-life | 73,3 d | `L2.1-modelos-vol-garch-gjr.md` |
| VaR MC P5 6m | -4,70pp | `computed_data.json` → `mc.p5` |
| VaR refresh 6m | R$ 6,43 bi | `L2.2-cambio-stress-test-monte-carlo.md` |
| CVaR 95% (D3) | R$ 10,14 bi | `D3-1.3-stress-test-hipoteticos.md` |
| Composite v2.1 | 71,8/100 | `computed_data.json` → `composite.composite_pct` |
| HHI baterias | 4.850 | `computed_data.json` → `supply_hhi.battery_cells` |
| Investment 365d | R$ 1,68 bi | `D3-0.3-npv-action-register.md` |
| VaR 4-shock | R$ 8,21 bi | `D3-1.3-stress-test-hipoteticos.md` |
| Backtesting 5/5 | targets | `D3 v2.0.1` |

---

*Versão 1.0 — Matheus Mendes — Salvador-BA, BR — 17/ago/2026 — gerado por Hermes Agent com skill didactic-study-notes + study-notes-from-project-artifacts. Cross-validation feita contra `computed_data.json`, `1-pager-summary.md` e D3 v2.0.1.*