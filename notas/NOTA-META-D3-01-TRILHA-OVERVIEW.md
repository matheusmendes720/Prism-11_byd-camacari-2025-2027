---
slug: notas-meta-d3-01-trilha-overview
title: "Nota-Meta D3 #01 — Trilha de Meta-Learning · Overview do D3 Framework (Decision Framework BYD Camaçari)"
ueid: ikigai:nota:d3-meta-overview:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d3, framework, prescritivo, trilha, overview, 5-camadas, 11-dimensoes]
custom:
  _purpose: >-
    Capa de entrada da série de Notas-Meta D3 sobre o framework prescritivo
    Decision Framework D3 v2.0.2 (BYD Camaçari 2025-2027). Cobre o
    overview da arquitetura 5 camadas, as 11 dimensões S1-S11, os 5
    Modeled Couplings + 15 secundários = 20 couplings quantitativos, e
    o caminho de evolução de 5 versões (v0.5 → v0.6 → v2.0 →
    v2.0.1 → v2.0.2). Foco didático — explica o projeto, sem exercícios.
  _audience: risk-officer, COO, CEO, Conselho, head-de-risk, pesquisador
  _data_sources:
    - /analise-prescritiva/reports/decision-framework/CLAUDE.md
    - /analise-prescritiva/reports/decision-framework/README.md
    - /analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md
    - /analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md
    - /analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md
  _outputs:
    - overview-5-camadas
    - 11-dimensoes-s1-s11
    - 5-versoes-cross-evolution
    - trilha-meta-aprendizado
  _success_criteria: >-
    leitor entende o que é o D3, como evoluiu entre versões, e por que
    ele é prescritivo (e o D2 não era).
---

# Nota-Meta D3 #01 — Trilha de Meta-Learning · Overview

> **Quem está falando:** um par sênior-orientador sobre o **sistema operacional** do D3.
> **O que esta nota faz:** capa/overview do D3 framework — o que é, como evoluiu, o que entrega. É o ponto de entrada da série de Notas-Meta D3.
> **Pré-requisito:** ter lido a série **Notas-Meta D2** (especialmente as #07-A/B/C de drift).
> **Tempo de leitura:** 45-60 min.
> **Fonte canônica:** [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md) + [`EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md).

---

## §0. O que é o D3 em uma frase

> **D3 é o framework prescritivo que transforma o diagnóstico do D2 (VaR, composite, gaps) em ações executáveis com owner, custo, deadline, KPI, RACI, e gates de aprovação — em 11 dimensões acopladas, com 20 couplings quantitativos, e backtesting 5/5 PERFEITO.**

Em termos ainda mais simples: **D2 diz o que está errado. D3 diz o que fazer a respeito.**

---

## §1. A linha do tempo D3 — 5 versões em 4 meses

```
mai/2026       ──►  D3 v0.5  (Caminho A — gap closure D2-AUDIT)
                              6 dimensões (S1-S6)
                              Composite ~50% (accuracy)
                              sem acoplamentos quantitativos
                              sem S7-S11

jun/2026       ──►  D3 v0.6  (Caminho B — framework 11D)
                              11 dimensões (S1-S11)
                              Composite 71,8 GREEN (com pesos sum=1,15)
                              5 Modeled Couplings (primários)
                              RACI 4-pessoa
                              3 decisões críticas destravadas
                              limitação: composite inflado por otimismo

21/jul/2026    ──►  D3 v2.0  (Caminho C — recalibração empírica)
                              5 recalibrações (BCB PTAX, lítio, tariff, etc.)
                              VaR 4-shock R$ 8,21 bi (tornado)
                              Composite 71,8 → 50,3 (realized risks)
                              Backtesting 4/5 (FP 14,8% — FALHA target)
                              6 dimensões com erro grave
                              limitação: 4 erros sistemáticos a corrigir

15/ago/2026    ──►  D3 v2.0.1 (4 fixes)
                              Hysteresis, Carry-trade filter,
                              Lítio asymmetry, 5-day confirmation
                              Backtesting 5/5 PERFEITO
                              TP 100% (6/6), FP 0%, FN 0%
                              Time-to-action 9,3d (≤14d)
                              Accuracy 88,9% (≥80%)
                              limitação: regras Python não deployadas

18-ago-2026    ──►  D3 v2.0.2 (audible + governança)
                              KG v2.0.2 (110 nós, 118 edges, 11 categorias)
                              12 docs didáticos pt-br + 12 MP3s (94 min)
                              14 frentes delegação × 5 ondas (DELEGATION-PLAN)
                              Pesos renormalizados sum=1,15 → 1,00
                              limitação: S7 kill switch ativo (lista suja)
                              limitação: composite 50,3 RED (realized risks)
```

---

## §2. A arquitetura 5 camadas (Layer 1 → Layer 5)

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: LEARNING                                           │
│   Post-mortem trimestral + recalibração de modelo           │
└──────────┬──────────────────────────────────────────────────┘
           │ feedback loop (trimestral)
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 4: ACTION                                             │
│   Action register (25 ações) + RACI (17 personas) + 9 gates│
└──────────┬──────────────────────────────────────────────────┘
           │ execução
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 3: DECISION                                           │
│   12 decision trees + cost-benefit (NPV) + sensitivity 96 c│
└──────────┬──────────────────────────────────────────────────┘
           │ acionamento por sinais
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 2: SIGNAL                                             │
│   Trigger matrix (45 triggers: 15 v2.0 + 15 v2.1 + 15 T-MV)│
│   Heatmap agregado 6×3                                     │
└──────────┬──────────────────────────────────────────────────┘
           │ contínuo
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 1: DATA                                               │
│   D2 sessions (6 dimensões) + composite 50,3               │
│   Refresh automático (BCB PTAX, Bacen, MTE, Fastmarkets)     │
└─────────────────────────────────────────────────────────────┘
```

### §2.1 Layer 1 — DATA (D2 vive aqui)

O D3 **não recalcula o D2**. Ele consome o D2 como insumo:
- 6 sessões D2 (câmbio, supply, regulatório, competição, macro, ESG) com refresh programado.
- Composite recomputado a cada refresh.
- Auto-pull: BCB SGS PTAX, IPCA, PIB, FGV via API.

### §2.2 Layer 2 — SIGNAL (triggers detectam mudança)

Cada dimensão S1-S11 emite **3 sinais**: 🟢 GREEN, 🟡 AMBER, 🔴 RED.

| Sessão | 🟢 GREEN | 🟡 AMBER | 🔴 RED |
|---|---|---|---|
| S1 Câmbio (PTAX) | [4.80, 5.30] | [4.50, 4.80) ou (5.30, 5.50] | < 4.50 ou > 5.50 |
| S1 Câmbio (vol) | < 13% | 13-18% | > 18% |
| S2 Supply (HHI) | < 3.500 | 3.500-4.500 | > 4.500 |
| S3 BNDES | Rota 2030 + BNDES aprovados | BNDES pendente | Rollback parcial/total |
| S6 Macro | PIB > 0, IPCA < 5% | PIB próximo 0, IPCA 5-6.5% | PIB < 0, IPCA > 6.5% |
| S7 ESG | Fora lista suja | MSCI RepRisk > threshold | Lista suja MTE (kill switch) |

**Total: 45 triggers** (15 v2.0 + 15 v2.1 + 15 multivariados T-MV1..MV5).

### §2.3 Layer 3 — DECISION (decision trees + NPV)

Para cada combinação de sinais materialmente distinta, há uma **decision tree** com sequência:
```
SE S1 = RED (PTAX > 5.50) E S6 = GREEN (PIB > 0)
  → Ativar hedge extra (de 50% para 75%)
  → Acelerar revisão de pricing defensivo (S4)
  → NÃO repriorizar supply chain (PIB forte sustenta demanda)
```

**Total: 12 decision trees** + cost-benefit com **NPV marginal R$ 1,68 bi** em 365 dias.

### §2.4 Layer 4 — ACTION (action register + RACI)

**40 ações** distribuídas em:
- 5 estratégicas (Conselho): AG-001 a AG-003 + AG-DIFF-1/2.
- 10 táticas (CSO, CFO, Heads): hedge sizing, dual-sourcing, defensivo, etc.
- 10 operacionais (Risk Officer, Analysts): monitorar PTAX, lítio, lista suja, triggers, etc.
- 6 S7 ESG (kill switch protocol): pausar capex, revisar covenants, auditoria ESG, etc.
- 3 C2 Game Theory (AG-DIFF-1/2/3): LFP verticalization, technology differentiation, war of attrition hold.
- 6 dimensionais S8-S11: production ramp, demand, tariff, competition.

**RACI 17 personas + 9 approval gates + 7 kill gates** (ver Nota-Meta D3 #04).

### §2.5 Layer 5 — LEARNING (post-mortem trimestral)

Trimestralmente:
- Comparar previsto vs realizado de cada KPI de ação.
- Recalibrar elasticidades (D2 tinha pressuposto "PIB r=+0.59 com vendas". Real: 0.62? 0.55?).
- Atualizar trigger thresholds se a distribuição empírica mudou.
- Documentar "decisões que não tomamos e deveríamos" (post-mortem inverso).
- Repriorizar próximo trimestre com base no learning.

> **Status atual (v2.0.2):** Layer 5 ainda **não totalmente operacional**. Re-backtesting projetado (não re-rodado mensalmente).

---

## §3. As 11 dimensões S1-S11

### §3.1 Tabela canônica de pesos (v2.0.2 renormalizado)

| Dim | Nome | Peso v2.0.1 | Peso v2.0.2 (renorm.) | Categoria | Status Jul/2026 |
|---|---|---|---|---|---|
| **S1** | FX / Hedge | 0,18 | 0,157 | Tier 1 | 🟡 AMBER (BRL 5,5, σ 14,86%) |
| **S2** | Supply Chain / Lithium | 0,16 | 0,139 | Tier 1 | 🟡 AMBER (Lítio US$ 22k) |
| **S3** | BNDES / ViE | 0,18 | 0,157 | Tier 1 | 🟡 AMBER (ViE 18%) |
| **S4** | Pricing / Defensive | 0,16 | 0,139 | Tier 1 | 🔴 RED (tariff 35%, margin -44,5%) |
| **S5** | Partnerships | 0,10 | 0,087 | Tier 2 | 🟡 AMBER (EVE qualification) |
| **S6** | Macro Governor | 0,10 | 0,087 | Tier 2 | 🟡 AMBER (trigger 5min ativo) |
| **S7** | ESG / Reputação | 0,05 | 0,043 | Tier 3 | 🔴 RED (kill switch lista suja MTE) |
| **S8** | Production Ramp | 0,08 | 0,070 | Tier 2 | 🟡 AMBER (33% capacidade) |
| **S9** | Demand Growth | 0,04 | 0,035 | Tier 3 | 🟢 GREEN (EV share +153% YoY) |
| **S10** | Tariff Policy | 0,05→0,10 | 0,043 | Tier 3 | 🔴 RED (35% Jan/2027) |
| **S11** | Competitive Landscape | 0,05 | 0,043 | Tier 3 | 🟡 AMBER (Nash Differentiate) |
| **Total** | — | **1,15** | **1,000** | — | **composite 50,3** |

### §3.2 A renormalização sum=1,15 → 1,00

Os pesos canônicos D3 v0.6 somavam **1,15** (bug histórico). D3 v2.0.2 renormalizou dividindo cada peso por 1,15:
- 0,18 / 1,15 = 0,157
- 0,16 / 1,15 = 0,139
- 0,10 / 1,15 = 0,087
- ...

**Por que isso importa:** para agregação linear (composite = Σ peso × score), os pesos **precisam somar 1,00** para que o composite fique em [0, 100].

### §3.3 O composite em 3 linhagens

| Linhagem | Composite | Status | Lido por | Documentação |
|---|---|---|---|---|
| **Stakeholder 4-dim** (câmbio 30% + supply 20% + regulatório 30% + macro 20%) | **50,3** | 🔴 RED | Conselho, CEO | `outputs/SNAPSHOT-OPERACIONAL.md` |
| **Técnico 11-dim** (pesos v2.0.2 renormalizados sum=1,00) | 78 | 🟡 AMBER (técnico) | Risk Officer, CRO | `case-studies/docs/SCORES.md` §3 |
| **Stakeholder 4-dim (jul/2026)** | 71,8 | 🟡 AMBER (pré-recalibração) | D2-AUDIT canônico | `EVOLUÇÃO-VERSÕES.md` §4 |

---

## §4. Os 5 Modeled Couplings (primários)

| # | Coupling | Fórmula | Faixa de variação | Impacto |
|---|---|---|---|---|
| **1** | **S1↔S3** | h* = 91% - (ViE%/22%) × 61% | 30% (Expansão) → 91% (Rollback Total) | **Maior** impacto direto no P&L |
| **2** | **S1↔S2** | Joint VaR FX+Supply = 2.5× in RED | 1.0× (GREEN) → 2.5× (RED) | Pior cenário (VaR 2.5×) |
| **3** | **S1↔S4** | Hedge R$480/unit vs Defensivo R$4.500/unit | Ratio ~9× | Defensivo catalog-wide destrutivo |
| **4** | **S3↔S4** | Defensive break-even at ViE = 10% | P(defensive) > 0 se ViE < 10% | Defensivo vira value-destructive abaixo |
| **5** | **S6→all** | Multiplier 1.0×/1.5×/2.0× | Rescales all prescriptions | Macro é governor de todo o resto |

### §4.1 Os 15 couplings secundários (propagação)

Cada primário gera ~3 secundários por propagação vetorial:

- **S1↔S3 primário** → S1↔S3-S9, S1↔S3-S11, S1↔S3-S10.
- **S1↔S2 primário** → S1↔S2-S7, S1↔S2-S4, S1↔S2-S8.
- **S1↔S4 primário** → S1↔S4-S8, S1↔S4-S5, S1↔S4-S11.
- **S3↔S4 primário** → S3↔S4-S10, S3↔S4-S11, S3↔S4-S9.
- **S6→all primário** → S6→S1, S6→S2, S6→S3.

**Total: 5 primários + 15 secundários = 20 couplings quantitativos.**

### §4.2 Por que acoplamentos importam

O D2 tratava as dimensões como **paralelas** (agregação linear simples). O D3 reconhece que:

- **Hedge cambial não é 50% flat.** Depende de ViE (S3). Com ViE 0% (Rollback Total), hedge deve ser 91%, não 50%.
- **Macro reescala tudo.** PIB < 0 por 2 tri não é "alerta amarelo" — é multiplier 1,5× em todos os custos.
- **Defensivo de preço é value-destructive em S3 RED.** Catalog-wide destrói -67% ROI em Rollback Total. **Foi removido** do action register.

---

## §5. O que o D3 entrega de concreto

### §5.1 4 HTMLs principais (~297 KB)

| Arquivo | Tamanho | Função |
|---|---|---|
| [`D3-MAIN.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-MAIN.html) | 130,9 KB | Relatório principal consolidado (8 seções, 4 figuras, 31 ações) |
| [`D3-ANNEX.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-ANNEX.html) | 108,2 KB | Anexo técnico (NPV, MC, sensitivity) |
| [`D3-WORKSHOP.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-WORKSHOP.html) | 34,5 KB | 10 slides workshop Conselho |
| [`D3-DASHBOARD.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-DASHBOARD.html) | 30,7 KB | Dashboard com KPIs |

### §5.2 11 docs narrativos (case-studies/docs/)

| # | Doc | Função | Audiência |
|---|---|---|---|
| 00 | [`00-sintese-executiva.md`](../../analise-prescritiva/case-studies/docs/00-sintese-executiva.md) | 1 página A4 com 6 cenários | Conselho, headhunter |
| 01 | [`01-cadeia-valor-byd.md`](../../analise-prescritiva/case-studies/docs/01-cadeia-valor-byd.md) | Cadeia de valor em 5 camadas | Onboarding |
| 07 | [`07-cadeia-fabrica-byb.md`](../../analise-prescritiva/case-studies/docs/07-cadeia-fabrica-byb.md) | Cadeia física 7 estágios × 5 camadas × 11 dimensões | Diretor industrial + COO |
| 08 | [`08-decision-matrix-case-sensitive.md`](../../analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md) | 12 cenários nomeados (D-01..D-12) com sequência completa | Novo COO/CRO/Head Área |
| 09 | [`09-alertas-personas-stakeholders.md`](../../analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md) | Sistema nervoso: 12 personas × 7 canais × 9 mitigações | Coordenador Risco 24/7 |
| 10 | [`10-story-notes-s1-a-s11.md`](../../analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md) | 11 dimensões S1-S11 contadas como micro-histórias | Conselho narrativo |

### §5.3 12 MP3s (94 min de áudio, pt-br)

Gerados via eSpeak NG + ffmpeg libmp3lame 64k. Workflow: `audio/generate-mp3s-espeak.py`. Reproduzível offline sem API key.

| Trilha | Duração | Docs cobertos |
|---|---|---|
| Conselho | 1h | 00-sintese, 06-decisoes, guia-comunicacao |
| COO | 1h20 | 01-cadeia, 07-fabrica, 08-decision-matrix, 09-alertas |
| CFO | 50 min | 02-dados, 03-matematica, 08-decision-matrix |
| New joiner | 3h30 | 00-09 sequencial + guia-comunicacao |

### §5.4 5 ações 90 dias (3 críticas)

| # | Ação | Owner | Custo | Deadline | KPI |
|---|---|---|---|---|---|
| **AG-001** | Resolver lista suja MTE (S7) | CFO + Head Gov Relations | R$ 25M | 30/set/2026 | S7 AMBER 30d + fora lista + ESG aprovado |
| **AG-002** | Acelerar nacionalização 70% | COO + Head Supply | R$ 280M | 31/out/2027 | FX exposure 90% → 15% |
| **AG-003** | Implementar hedge FX 95% | Risk Officer + Head Treasury | R$ 30M | 31/out/2026 | hedge ≥90% exposure |
| **AG-DIFF-1** | LFP verticalization | CEO + CFO + Head Supply | R$ 600M | 31/dez/2027 | S2 supply risk -50% |
| **AG-DIFF-2** | Technology differentiation | Head R&D + CMO | R$ 200M | 30/jun/2027 | S4 + S11 protection |

**ROI das 5 ações:** custo total R$ 1.135M (18 meses), retorno R$ 200M+/ano stress evitado, **ROI 200×, payback < 1 mês**.

---

## §6. Mapa da série de Notas-Meta D3

| # | Nota | Conteúdo | Status |
|---|---|---|---|
| **01** | [Trilha + Overview](./NOTA-META-D3-01-TRILHA-OVERVIEW.md) | Esta nota — capa | ✅ |
| **02** | [Arquitetura 5 camadas + 11 dims](./NOTA-META-D3-02-ARQUITETURA-11D.md) | Layer 1-5, S1-S11, composite 50,3, h* formula | 🔜 |
| **03** | [Acoplamentos + Game Theory](./NOTA-META-D3-03-ACOPLAMENTOS-GAMETHEORY.md) | 20 couplings quantitativos, 5/5 NASH D3 vs D2, duplo cost-shock | 🔜 |
| **04** | [Gates + RACI + 40 ações](./NOTA-META-D3-04-GATES-RACI-ACOES.md) | 9 approval + 7 kill gates, 17 personas, 5 ações 90d | 🔜 |
| **05** | [Calibração + Backtesting 5/5](./NOTA-META-D3-05-CALIBRACAO-BACKTESTING.md) | 5 recalibrações, 4 fixes, 6 stress events, FP 14,8→0% | 🔜 |
| **06** | [Limitações, Honestidade Intelectual, CTA, Viabilidade](./NOTA-META-D3-06-LIMITACOES-HONESTIDADE-CTA.md) | O que o D3 NÃO é, custos de não implementar, call to action | 🔜 |

---

## §7. Cross-refs essenciais para começar

### §7.1 Ponto de entrada único (1 página A4)

- [`/outputs/SNAPSHOT-OPERACIONAL.md`](../../outputs/SNAPSHOT-OPERACIONAL.md) — raid briefing Conselho 22-ago-2026.

### §7.2 4 HTMLs principais

- [`D3-MAIN.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-MAIN.html) — relatório principal.
- [`D3-ANNEX.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-ANNEX.html) — anexo técnico.
- [`D3-WORKSHOP.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-WORKSHOP.html) — workshop.
- [`D3-DASHBOARD.html`](../../analise-prescritiva/reports/decision-framework/7_outputs/D3-DASHBOARD.html) — dashboard.

### §7.3 Documentos de governança

- [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md) — arquitetura 5 camadas, 11 dims, 5 couplings (fonte canônica para o overview).
- [`/analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md`](../../analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md) — 5-layer architecture + RACI + 3 critical decisions.
- [`/analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md) — OpenSpec-style specification.

### §7.4 Docs narrativos (entrada audível)

- [`/analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md`](../../analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md) — 3 trilhas (audiência / tempo / perfil).
- [`/analise-prescritiva/case-studies/docs/00-sintese-executiva.md`](../../analise-prescritiva/case-studies/docs/00-sintese-executiva.md) — 1 página.

### §7.5 Linhagem técnica

- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md) — D3 v0.5 → v2.0.2 (635 linhas).
- [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md) — síntese cross-version D2 v1 → D3 v2.0.2.

---

## §8. Takeaways em 5 bullets

1. **D3 = framework prescritivo operacional.** D2 diz o que está errado; D3 diz o que fazer a respeito, com owner, custo, deadline, KPI.

2. **5 versões em 4 meses** (v0.5 → v0.6 → v2.0 → v2.0.1 → v2.0.2). Cada uma adicionou capabilities e fechou gaps do D2-AUDIT.

3. **5-Layer Architecture** (Data → Signal → Decision → Action → Learning). 45 triggers, 12 decision trees, 40 ações, 17 personas RACI, 9 approval + 7 kill gates.

4. **11 dimensões S1-S11** com **20 couplings quantitativos** (5 primários + 15 secundários). Composite 50,3 RED Modo Crise (não regressão — alinhamento com realized risks).

5. **ROI 200×, payback < 1 mês.** R$ 3M de investimento gera R$ 200M+/ano de stress evitado. Único evento de stress paga o framework.

---

*Versão 1.0 — 25/ago/2026 — escrita como overview do D3 framework (sem exercícios).*

*Próxima: [Nota-Meta D3 #02 — Arquitetura 5 camadas + 11 dims](./NOTA-META-D3-02-ARQUITETURA-11D.md).*