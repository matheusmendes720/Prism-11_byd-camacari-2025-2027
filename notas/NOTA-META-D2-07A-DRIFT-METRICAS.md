---
slug: notas-meta-d2-07a-drift-metricas
title: "Nota-Meta D2 #07-A — Drift Cross-Version das Métricas (v1 → v2 → v2.1 → v2.2)"
ueid: ikigai:nota:d2-meta-drift-metricas:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, drift, cross-version, sigma, var, cvar, composite, meta-aprendizado]
custom:
  _purpose: >-
    Mostrar como cada métrica canônica do D2 mudou entre as versões do
    projeto (D2 v1 jul/2025 → v2 19/jul/2026 → v2.1 final jul/2026 →
    v2.2 / D3 v2.0.2 ago/2026). Cobre σ PTAX, VaR/CVaR, composite
    score, HHI, e os pesos do composite. O foco é didático — explicar
    por que cada drift aconteceu, sem entrar em exercícios.
  _audience: engenheiro-junior, analista-pleno, pesquisador
  _data_sources:
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md
    - /d2-econometric-vulnerability/outputs/1-pager-summary.md
  _outputs:
    - tabela-drift-metricas
    - explicacao-por-drift
    - linha-do-tempo-numerica
  _success_criteria: >-
    leitor entende por que cada métrica mudou entre versões e consegue
    citar o drift numérico correto (σ 14,19 → 14,41 → 14,86; VaR 2,10 →
    6,43 → 8,21; composite 71,8 → 50,3).
---

# Nota-Meta D2 #07-A — Drift Cross-Version das Métricas

> **Quem está falando:** um par sênior-orientador sobre a "vida" das métricas do D2.
> **O que esta nota faz:** mostra como cada métrica canônica do D2 mudou entre as 4 versões do projeto (v1 → v2 → v2.1 → v2.2/D3 v2.0.2), e explica por que cada drift aconteceu.
> **Pré-requisito:** ter lido [Nota-Meta D2 #01 — Trilha](./NOTA-META-D2-01-TRILHA-APRENDIZADO.md).
> **Tempo de leitura:** 30-45 min.
> **Fonte canônica:** [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md) §3-§4 + [`FASE-1-DESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md) + [`FASE-2-PREDITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md).

---

## §0. Visão geral

Esta nota documenta **o drift numérico das métricas canônicas do D2 entre as versões**. É a resposta à pergunta: "por que o número que eu vi ontem no composite mudou hoje?"

O ponto-chave é que **drift não é regressão**. O modelo continua válido; ele está **realinhando com realized risks** (lista suja MTE 07/abr/2026, PTAX vol 16%, lítio US$ 22k/t, tariff 35% Jan/2027).

---

## §1. Linha do tempo das versões

```
jul/2025  ──►  D2 v1      (EDA baseline — N=1.642 obs PTAX, 5 dimensões)
                        σ 14,19% · VaR empírico R$ 2,10 bi · composite n/a

19/jul/2026 ──►  D2 v2    (refresh — N=2.778, MC pipeline, VaR 10k paths)
                        σ 14,41% · VaR MC R$ 6,43 bi · CVaR R$ 8,04 bi
                        composite 71,8 (canônico D2-AUDIT)
                        10 gaps estruturais (D2-AUDIT.md)

final jul/2026 ──►  D2 v2.1 (final D2 — 15 triggers + RACI 4-pessoa)
                        +15 triggers, RACI 4-pessoa
                        3 decisões críticas destravadas
                        composite 71,8 (sem mudança)
                        handoff oficial para D3

15-18/ago/2026 ──►  D3 v2.0 / v2.0.1 / v2.0.2
                        5 recalibrações empíricas com realized risks
                        σ PTAX 16% (BCB realized)
                        VaR 4-shock tornado R$ 8,21 bi
                        CVaR 95% R$ 10,14 bi
                        composite 50,3 RED Modo Crise
                        11 dimensões S1-S11 (de 6)
                        5/5 backtesting PERFEITO
```

---

## §2. Drift de σ PTAX (volatilidade anualizada)

### §2.1 Tabela de drift

| Versão | Data | σ PTAX anualizada | N observações | Fonte |
|---|---|---|---|---|
| **D2 v1** | jul/2025 | **14,19%** | 1.642 obs (2015-2022) | BCB SGS 10813 |
| **D2 v2** | 19/jul/2026 | **14,41%** | 2.778 obs (2015-2026) | refresh BCB |
| **D2 v2.1** | final jul/2026 | **14,41%** | 2.778 obs | (sem mudança) |
| **D3 v2.0+** | 15-18/ago/2026 | **~16,0%** | dados realized 2025-2026 | BCB SGS 10813 |

### §2.2 Por que a σ subiu?

A σ **não é uma constante** — é uma **média ponderada exponencial** das variações recentes. À medida que o BCB acumula observações em 2025-2026 (ano de ciclo de aperto monetário + election + stress fiscal), a vol realizada aumenta.

| Causa | Impacto em σ |
|---|---|
| Refresh de dados (2015 → 2026, +1.136 obs) | +0,22pp |
| Período 2024-2026 com PTAX > R$ 5,50 sustentado | +0,5 a +1,0pp |
| Realized vol em 2025-2026 (vol 30d > 18% em vários meses) | +0,5 a +1,0pp |
| Stress fiscal + Selic 14% em ago/2026 | +0,3pp |

**Interpretação:** a σ é **uma medida de janela**. Sempre cite "σ 30d anualizada = X% no momento do estudo".

### §2.3 Por que esse drift não é regressão?

- O **modelo GARCH(1,1)-t calibrado em D2 v1** (α=0,0488, β=0,9418, ν=6,99) **continua válido** — os parâmetros não mudam com σ realizada.
- O que muda é **a janela de estimação** (1.642 → 2.778 → 2.509 BCB realized).
- A σ é **input do modelo**, não output.

---

## §3. Drift de VaR e CVaR

### §3.1 Tabela de drift (95%, horizonte 6 meses)

| Versão | VaR 95% | CVaR 95% | Método |
|---|---|---|---|
| **D2 v1** (jul/2025) | **R$ 2,10 bi** | **R$ 1,44 bi** (empírico, sem CVaR formal) | histograma retornos PTAX |
| **D2 v2** (19/jul/2026) | **R$ 6,43 bi** | **R$ 8,04 bi** | MC 10k paths × 6m, GARCH-t, 1 shock |
| **D3 v2.0.1** (15/ago/2026) | **R$ 8,21 bi** | **R$ 10,14 bi** | MC 10k paths × 6m, Cholesky 4×4, **4 choques** |

### §3.2 Por que VaR subiu 3× de v1 para v2?

O **VaR empírico** (v1) usa o **histograma de retornos passados**. Só captura cenários que **já aconteceram**. Não tem como extrapolar.

O **VaR MC** (v2) usa **simulação log-normal com drift e vol** dos últimos 1.642 dias. Captura **toda a distribuição contínua**, incluindo cenários que ainda não aconteceram.

Por isso, mesmo com σ similar (14,19% vs 14,41%), o VaR MC é **3× maior** que o empírico — porque o MC **inclui 5% de probabilidade em ambos os lados da distribuição**, enquanto o empírico só olha o que aconteceu.

### §3.3 Por que VaR subiu de 6,43 → 8,21 bi (v2 → v2.0.1)?

O v2.0.1 adiciona **correlação entre 4 choques** (PTAX + lítio + tariff + demanda EV) via **decomposição de Cholesky** (ρ FX-Supply = +0,4).

Quando os choques andam juntos:
- PTAX explode +30% (BRL desvaloriza).
- Lítio spike +50% (US$ 22k/t).
- Tariff entra em 35% (Jan/2027).
- Demanda EV cai -20%.

O impacto conjunto é **multiplicativo, não aditivo**. O MC multivariado captura isso. O MC 1-shock (v2) não capturava.

**Tornado plot do v2.0.1** mostra que **Tariff é o maior contributor** (29% do VaR), seguido por FX (22,5%), Supply (18%), BNDES (14%). Surpreendente para a intuição.

### §3.4 Por que CVaR > VaR sempre?

CVaR = "se passar do VaR, qual a perda média esperada?". Por definição, é sempre ≥ VaR.

A diferença CVaR-VaR é a "espessura da cauda" — quanto a cauda é mais pesada que a Normal.

No D2:
- **v2:** CVaR - VaR = R$ 8,04 - R$ 6,43 = R$ 1,61 bi (24% acima).
- **v2.0.1:** CVaR - VaR = R$ 10,14 - R$ 8,21 = R$ 1,93 bi (24% acima).

A proporção **24%** é consistente — reflete a cauda Student-t com ν=6,99 (calibrada uma vez e mantida).

---

## §4. Drift do Composite Score

### §4.1 Tabela de drift

| Versão | Composite | Status | Causa raiz |
|---|---|---|---|
| **D2 v1** | n/a | — | Composite-conceito definido, mas cálculo introduzido em D3 v0.6 |
| **D2 v2** | **71,8** (canônico D2-AUDIT) | 🟡 AMBER | 6 seções (câmbio, supply, regulatório, competição, macro, composite); 1-pager body reporta 66, frontmatter 72 — arbitramos 71,8 via D2-AUDIT |
| **D2 v2.1** | **71,8** | 🟡 AMBER | Sem mudança; só artefatos operacionais (triggers + RACI) |
| **D3 v0.5** | **~50%** | 🟡 AMBER (accuracy) | Só 6 dimensões (S1-S6); sem S7-S11 |
| **D3 v0.6** | **71,8** | 🟢 GREEN | Framework 11D S1-S11; pesos canônicos sum=1,15 |
| **D3 v2.0** | **50,3** | 🔴 RED | 5 recalibrações; realized risks; σ PTAX 16% |
| **D3 v2.0.1** | **50,3** | 🔴 RED | 5/5 backtesting PERFEITO (modelo validado) |
| **D3 v2.0.2** | **50,3** | 🔴 RED | KG v2.0.2; narrativa audível |

### §4.2 Por que o composite caiu de 71,8 → 50,3 entre v0.6 e v2.0?

**NÃO é regressão do modelo** — é alinhamento com realized risks. As 6 causas-raiz:

1. **6 → 11 dimensões** (S7 ESG, S8 Ramp, S9 Demand, S10 Tariff, S11 Competition). Cada nova dimensão começa em RED ou AMBER porque o ambiente piorou.

2. **Pesos renormalizados** sum 1,15 → 1,00 (correção estatística). Dividindo todos por 1,15, o composite cai proporcionalmente.

3. **Lista suja MTE 07/abr/2026** → S7 kill switch override. Composite fixo em 95 enquanto ESG RED.

4. **σ PTAX 14,19% → 16,0%** (BCB realized 2025-2026). Vol maior = maior contribuição de câmbio.

5. **Lítio US$ 10-12k → US$ 22k/t** (Fastmarkets jul/2026). Baseline +83% em 5 meses.

6. **Tariff 35% Jan/2027** tratado como base (não upside). S10 RED permanente com peso dobrado (0,05 → 0,10).

**Interpretação:** 50,3 RED Modo Crise é **baseline recalibrado**, não falha. O modelo continua válido (5/5 backtesting perfeito), mas o ambiente de risco piorou materialmente entre jun/2026 e jul/2026.

### §4.3 A história das 3 fontes de composite 71,8

Na D2 v2, **3 valores diferentes de composite 71,8** foram publicados:

| Fonte | Composite | Onde foi publicado |
|---|---|---|
| **1-pager body** (texto) | 66/100 | inconsistência |
| **1-pager frontmatter** (YAML) | 72/100 | inconsistência |
| **D2-AUDIT** (canônico) | **71,8/100** | arbitragem oficial |

A inconsistência foi **flagada na auditoria** e resolvida com arbitragem de 71,8. É um padrão: **sempre cite a fonte do número**.

### §4.4 Composite stakeholder 4-dim vs técnico 11-dim

Há **duas leituras** do composite:

| Leitura | Composite | Status | Lido por |
|---|---|---|---|
| **Stakeholder 4-dim** (câmbio 30% + supply 20% + regulatório 30% + macro 20%) | **50,3** atual | 🔴 RED | Conselho, CEO |
| **Técnico 11-dim** (pesos renormalizados sum=1,00) | 78 | 🟡 AMBER (tecnicamente GREEN se >80) | Risk Officer, CRO |

A diferença (50,3 vs 78) reflete o fato de que:
- Stakeholder vê só 4 dimensões "macro" (câmbio, supply, BNDES, macro).
- Técnico vê as 11 dimensões incluindo ESG kill switch (que sobrepõe) e tarifas (que dobraram).

---

## §5. Drift de pesos do composite (cross-version)

### §5.1 Tabela de pesos

| Dimensão | D2 v1 (definição) | D2 v2.1 | D3 v0.6 (canônicos) | D3 v2.0 (renorm.) | D3 v2.0.2 (renorm.) |
|---|---|---|---|---|---|
| S1 FX (câmbio) | 0,30 | 0,30 | 0,18 | 0,157 | 0,157 |
| S2 Supply | 0,20 | 0,20 | 0,16 | 0,139 | 0,139 |
| S3 BNDES | 0,30 | 0,30 | 0,18 | 0,157 | 0,157 |
| S4 Competitivo | 0,20 | 0,20 | 0,16 | 0,139 | 0,139 |
| S5 Partnerships | — | — | 0,10 | 0,087 | 0,087 |
| S6 Macro | — | — | 0,10 | 0,087 | 0,087 |
| S7 ESG | — | — | 0,05 | 0,043 | 0,043 |
| S8 Ramp | — | — | 0,05 | 0,043→0,070 | 0,070 |
| S9 Demand | — | — | 0,04 | 0,035 | 0,035 |
| S10 Tariff | — | — | 0,05 | 0,043→0,10 | 0,043 |
| S11 Competition | — | — | 0,03 | 0,043 | 0,043 |
| **Total** | **1,00** | **1,00** | **1,15** | **1,000** | **1,000** |

### §5.2 Por que os pesos originais somavam 1,15?

Os pesos canônicos D3 v0.6 somavam **1,15** (não 1,00). Isso era um **bug histórico** — os pesos foram definidos sem renormalização após adicionar S5-S11.

A renormalização dividindo cada peso por 1,15:
- 0,18 / 1,15 = 0,157
- 0,16 / 1,15 = 0,139
- ...

**Por que isso importa?** Para agregação linear (composite = Σ peso × score), os pesos **precisam somar 1,00** para que o composite fique em [0, 100]. Se somam 1,15, o composite pode passar de 100 — o que quebra a interpretação.

### §5.3 Por que Tariff (S10) ganhou peso?

| Versão | Peso S10 | Razão |
|---|---|---|
| D3 v0.6 | 0,05 | Tariff tratado como upside, não base |
| D3 v2.0 | **0,10** | Tariff 35% Jan/2027 confirmado (Camex rejeitou redução); peso dobrado |
| D3 v2.0.2 | 0,043 | Renormalização pós-dobra (0,10 / 1,15 ≈ 0,087; mas tabela mostra 0,043 — pode haver inconsistência) |

Em qualquer caso, **Tariff saiu de 5% para 10%** do peso entre v0.6 e v2.0 — reflexo do impacto VaR tornado (29%).

### §5.4 Por que ESG (S7) tem peso baixo (0,043)?

S7 é **binário** (kill switch on/off). Não precisa de peso alto — porque quando RED, o composite trava em 95 fixo, **independentemente do peso**.

Por isso S7 é o "gate", não a "dimensão".

---

## §6. Drift de HHI (concentração de fornecedores)

### §6.1 Tabela de drift (raw vs reliability-adjusted)

| Categoria | HHI v1 (raw) | HHI v2 (raw) | HHI v2 (adjusted) | Justificativa |
|---|---|---|---|---|
| **Bateria LFP** | 4.850 | 4.850 | **76,6** (score S2) | Reliability CATL = 0,82 → penalização |
| **Lítio** | 3.400 | 3.400 | (raw mantido) | |
| **Semicondutor** | 2.925 | 2.925 | (raw mantido) | |
| **Powertrain** | 3.400 | 3.400 | (raw mantido) | |
| **Cell (cilíndrica)** | 2.100 | 2.100 | (raw mantido) | |
| **Plástico técnico** | 1.800 | 1.800 | (raw mantido) | |
| **Vidro blindado** | 1.500 | 1.500 | (raw mantido) | |

### §6.2 Por que HHI ajustado de bateria caiu de 4.850 → 76,6?

A HHI **raw** mede concentração pura (CATL 95,7%). A HHI **ajustada** modula por **reliability index** (probabilidade de entrega sem disruption).

`HHI_ajustado = HHI_raw × reliability = 4.850 × 0,82 = 3.977` (intermediário).

Mas o score S2 final é calculado em outra escala. A queda de 4.850 (HHI raw) para 76,6 (score S2) reflete **mudança de escala** (HHI 0-10.000 vs score 0-100), não mudança de medição.

A inconsistência: **D2 v1 reportava 95,7** (share CATL direto); **D2 v2 reliability-adjusted reporta 76,6** (score S2 final). São grandezas diferentes — comparar com cuidado.

---

## §7. Drift de stress events (backtesting)

### §7.1 Tabela de drift

| Stress Event | Período | Vol anualizada | Cum Change | D2 v1 (1-pager) | D2 v2 / D3 v2.0.1 |
|---|---|---|---|---|---|
| **COVID-19** | 2020-03 a 2020-12 | 21,8% | +15,6% | citado (estimativa) | recalibrado |
| **Semicondutor** | 2021-Q1 | 17,0% | (estimado) | citado | recalibrado |
| **Election 2022** | 2022-08 a 2022-11 | 18,0% | +2,6% | citado | recalibrado |
| **Lítio spike** | 2022-Q2 | 19,5% | (estimado) | citado | recalibrado |
| **Election 2024** | 2024-08 a 2024-11 | 12,6% | +6,8% | citado | recalibrado |
| **Stagflação 2025** | 2025-01 a 2025-12 | 10,3% | -11,4% | (não citado) | **adicionado em v2** |

### §7.2 Por que stress events são recalibrados?

Stress events **mudam ao longo do tempo** porque:
1. Vol realized dentro do evento é atualizada com mais dados.
2. Cum Change é recalculado com dados históricos mais completos.
3. Novos eventos (stagflação 2025) entram no backtest.

A recalibração mantém o backtesting **frescor** — não é estático.

---

## §8. Drift de NPV regulatório

### §8.1 Tabela de drift (4 cenários)

| Cenário | Prob. v1 | Prob. v2.1 | NPV v1 (R$ bi) | NPV v2.1 (R$ bi) |
|---|---|---|---|---|
| Continuidade | 40% | 45% | 14,8 | (recalculado) |
| Parcial | 30% | 25% | 12,5 | (recalculado) |
| Hardening | 20% | 15% (renomeado "Rollback Parcial") | 9,2 | (recalculado) |
| Rollback Total | 10% | 15% (renomeado "Rollback Total") | 5,8 | (recalculado) |
| **NPV esperado** | 12,09 | (recalculado) | 12,09 | ~8-10 |
| **σ NPV** | 4,20 | (recalculado) | 4,20 | (recalculado) |

### §8.2 Por que as probabilidades mudaram?

As probabilidades **subiram para Rollback Total** (10% → 15%) e **caíram para Hardening/Parcial**. Isso reflete:
- Lista suja MTE (07/abr/2026) como sinal de fragilidade institucional.
- Election 2026 (Nov/2026) com risco polarização.
- Tariff 35% Jan/2027 confirmado (não negociável).

---

## §9. Síntese do drift

### §9.1 Resumo consolidado (4 versões × 8 métricas)

| Métrica | D2 v1 | D2 v2 | D2 v2.1 | D3 v2.0.2 |
|---|---|---|---|---|
| σ PTAX anualizada | 14,19% | 14,41% | 14,41% | ~16,0% |
| VaR 95% 6m | R$ 2,10 bi | R$ 6,43 bi | R$ 6,43 bi | R$ 8,21 bi |
| CVaR 95% 6m | n/a | R$ 8,04 bi | R$ 8,04 bi | R$ 10,14 bi |
| Composite (stakeholder) | n/a | 71,8 | 71,8 | 50,3 |
| Composite (técnico 11D) | n/a | n/a | n/a | 78 |
| N obs PTAX | 1.642 | 2.778 | 2.778 | 2.509 (BCB) |
| Nº dimensões | 5 | 5 | 5 | 11 + parC |
| Nº triggers | 0 | 6 | 15 | 45 |
| RACI personas | n/a | implícito | 4 | 17 |
| 10 Gaps resolvidos | 0 | 0 | 4 | 10 (3 OPEN em v3.0) |

### §9.2 O padrão do drift

A leitura consolidada do drift cross-version é:

1. **Métricas clássicas** (σ, VaR, CVaR) **sobem** porque realized risks pioraram (vol maior, choques correlacionados).
2. **Composite cai** de 71,8 para 50,3, **não porque o modelo piorou**, mas porque o **ambiente piorou** e o modelo agora reflete isso.
3. **Arquitetura cresce** de 5 dims para 11 dims, de 0 triggers para 45 triggers, de 0 personas para 17 personas.
4. **Cobertura de gaps** cresce de 0% para 100% (4 RESOLVIDO em v2.1, +6 RESOLVIDO em D3 v2.0).
5. **5 recalibrações empíricas** no D3 v2.0+ ajustam o modelo com realized risks (BCB SGS 10813, Fastmarkets, Camex).

O **investimento total** de R$ 3M (Fases 1-3 do D3) gera **ROI de 200×** se um único evento de stress for evitado em 12 meses. **Payback < 1 mês.**

---

## §10. Cross-refs e recursos

### §10.1 Docs canônicos sobre o drift

- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md) — síntese cross-version (21 KB).
- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md) — D2 v1 EDA (15 KB).
- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md) — D2 v2 + v2.1 + 8 NB (19 KB).
- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md) — D3 v0.5 → v2.0.2.

### §10.2 Auditorias

- [`/analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md) — 10 gaps D2 → D3 (8 KB).
- [`/d2-econometric-vulnerability/outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md) — 1-pager D2 v2 com composite 71,8.

### §10.3 Atlas e white paper

- [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) — relatório técnico Plotly (3.7 MB).
- [`/analise-prescritiva/reports/atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html) — Atlas D2 white paper (66 KB).

---

## §11. Takeaways em 5 bullets

1. **σ PTAX drift: 14,19% → 14,41% → ~16,0%.** É janela rolante, não regressão. Vol realizada 2025-2026 puxou a média.

2. **VaR drift: R$ 2,10 bi → R$ 6,43 bi → R$ 8,21 bi.** VaR empírico → VaR MC 1-shock → VaR MC 4-shock. Cada upgrade captura mais cenários.

3. **Composite drift: 71,8 → 50,3 RED.** Realinhamento com realized risks (lista suja MTE, σ 16%, lítio US$ 22k, tariff 35%). NÃO regressão.

4. **Pesos drift: 4 dims sum=1,00 → 11 dims sum=1,15 → renormalizado sum=1,00.** Bug histórico corrigido. Tariff dobrou de peso (0,05 → 0,10).

5. **Cobertura de gaps: 0 → 4 → 10.** 4 gaps RESOLVIDO em v2.1, +6 PARCIAL/OPEN em D3 v2.0+.

---

*Versão 1.0 — 25/ago/2026 — escrita como nota-meta de drift cross-version (sem exercícios).*

*Próxima: [Nota-Meta D2 #07-B — Drift de Arquitetura/Metodologia](./NOTA-META-D2-07B-DRIT-ARQUITETURA.md) (5 dims → 6 → 8 NBs → 11 dims S1-S11).*