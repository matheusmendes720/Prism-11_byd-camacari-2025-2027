---
slug: notas-meta-d3-02-arquitetura-11d
title: "Nota-Meta D3 #02 — Arquitetura 5 Camadas + 11 Dimensões S1-S11"
ueid: ikigai:nota:d3-meta-arquitetura-11d:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d3, arquitetura, 5-camadas, 11-dimensoes, s1-s11, composite, h-formula]
custom:
  _purpose: >-
    Deep dive na arquitetura 5 camadas (Data → Signal → Decision →
    Action → Learning) do D3 framework, e nas 11 dimensões S1-S11
    com seus pesos renormalizados, status atual (jul/2026), e a
    fórmula canônica do composite. Cobre também a fórmula h* do
    coupling S1↔S3 e a renormalização sum=1,15 → 1,00. Foco
    didático, sem exercícios.
  _audience: risk-officer, modelador, COO, pesquisador
  _data_sources:
    - /analise-prescritiva/reports/decision-framework/CLAUDE.md
    - /analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md
    - /analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md
    - /analise-prescritiva/case-studies/docs/SCORES.md
  _outputs:
    - 5-camadas-detalhadas
    - 11-dimensoes-detalhadas
    - composite-3-linhagens
    - formula-h-estrela
  _success_criteria: >-
    leitor entende o que cada camada faz, cada dimensão cobre, e
    consegue citar a fórmula h* canônica.
---

# Nota-Meta D3 #02 — Arquitetura 5 Camadas + 11 Dimensões S1-S11

> **Quem está falando:** um par sênior-orientador sobre a "máquina" do D3.
> **O que esta nota faz:** deep dive em cada uma das 5 camadas da arquitetura e em cada uma das 11 dimensões S1-S11.
> **Pré-requisito:** [Nota-Meta D3 #01 — Trilha + Overview](./NOTA-META-D3-01-TRILHA-OVERVIEW.md).
> **Tempo de leitura:** 60-90 min.
> **Fonte canônica:** [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md) + [`/analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md`](../../analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md).

---

## §0. Visão geral — a "máquina" do D3

O D3 é uma **máquina de decisão contínua** organizada em 5 camadas. Cada camada consome output da anterior e alimenta a próxima. **Layer 5 (Learning) fecha o loop** com post-mortem trimestral que recalibra Layers 1-4.

A metáfora: D3 é como um **sistema nervoso autônomo** — Layer 1 são os dados sensoriais, Layer 2 são os sinais, Layer 3 é a decisão, Layer 4 é a ação, Layer 5 é a memória que aprende com a experiência.

---

## §1. Layer 1 — DATA (D2 vive aqui)

### §1.1 Função

A Layer 1 **não recalcula o D2**. Ela consome o D2 como insumo:
- 6 sessões D2 (câmbio, supply, regulatório, competição, macro, ESG) com refresh programado.
- Composite recomputado a cada refresh.
- Auto-pull de dados públicos via API.

### §1.2 Fontes de dados (auto-pull)

| Fonte | Séries | Latência | Onde entra |
|---|---|---|---|
| **BCB SGS** | PTAX (10813), IPCA (13522), Selic (13521), PIB (4380) | 1 dia | S1, S6 |
| **ANFAVEA** | Vendas mensais, produção | 1 mês | S4, S9, S11 |
| **MDIC/SECEX** | Trade balance autos | 1 mês | S6 |
| **B3/Bloomberg** | Vol implícita, NDF, swap rates | 1 dia | S1, S6 |
| **Fastmarkets** | Lítio, níquel, cobalto | 1 dia | S2 |
| **MSCI** | RepRisk BYD | 1 mês | S7 |
| **MPT/MTE** | Lista suja trabalho | event-driven | S7 |
| **Camex** | Tariff policy | event-driven | S10 |
| **FGV** | ICG (consumidor), ICC (indústria) | 1 mês | S6 |
| **BCB FOCUS** | Expectativas IPCA, PIB, Selic | 1 semana | S6 |

### §1.3 Cadência de refresh

| Dado | Frequência | Quem opera |
|---|---|---|
| PTAX (S1) | Diária | Analytics |
| Lítio (S2) | Semanal | Analytics |
| ViE BNDES (S3) | Mensal | CSO + Head Gov Relations |
| BYD share (S4, S11) | Mensal | Head Strategy |
| Selic/IPCA/PIB (S6) | Diária (PTAX), Mensal (macro) | Analytics |
| Lista suja (S7) | Event-driven | Head Gov Relations |
| Tariff (S10) | Event-driven | CSO + CFO |
| Composite recomputado | Trimestral | Risk Officer |

---

## §2. Layer 2 — SIGNAL (triggers detectam mudança)

### §2.1 Função

A pergunta operacional: **"como sei se o cenário mudou?"**

Resposta: **triggers** automáticos que detectam mudanças e disparam ações.

### §2.2 Os 5 sinais base (sempre ativos)

Cada uma das 11 dimensões S1-S11 emite **3 sinais**: 🟢 GREEN, 🟡 AMBER, 🔴 RED.

| Dimensão | 🟢 GREEN | 🟡 AMBER | 🔴 RED |
|---|---|---|---|
| **S1 FX (PTAX)** | [4.80, 5.30] | [4.50, 4.80) ou (5.30, 5.50] | < 4.50 ou > 5.50 |
| **S1 FX (vol)** | < 13% | 13-18% | > 18% |
| **S2 Supply (HHI)** | < 3.500 | 3.500-4.500 | > 4.500 |
| **S3 BNDES** | Rota 2030 + BNDES aprovados | BNDES pendente | Rollback parcial/total |
| **S4 Competitivo (BYD share)** | > 32% | 28-32% | < 28% |
| **S6 Macro** | PIB > 0, IPCA < 5% | PIB próximo 0, IPCA 5-6.5% | PIB < 0, IPCA > 6.5% |
| **S7 ESG** | Fora lista suja | MSCI RepRisk > threshold | Lista suja MTE (kill switch) |
| **S8 Ramp (SKD/CKD)** | Nacional 70% | CKD 45% | SKD 95% |
| **S9 Demand (EV share)** | > 18% projetado | 12-18% | < 12% |
| **S10 Tariff** | < 20% | 20-30% | > 30% |
| **S11 Competition (NASH)** | Differentiate estável | Differentiate + ruído | Price War |

### §2.3 Os 45 triggers (15 v2.0 + 15 v2.1 + 15 T-MV)

**v2.0 (15 originais):** PTAX > R$ 5,40 (5d), PTAX > R$ 5,50 (3d), lítio > US$ 30k/t, CATL outage, BNDES atrasar > 30d, PIB < 0 (2 tri), BYD share < 28%, vol 30d > 22%, IPCA 12m > 6,5%, lista suja MTE, ... (ver [`D3-TRIGGER-MATRIX.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-TRIGGER-MATRIX.md)).

**v2.1 (15 novos):** T-NPV-1 (NPV marginal < 0 por 2 meses), T-S7-2 (MSCI RepRisk > 20pp em 1 mês), T-S8-1 (SKD/CKD atrasa > 3 meses), T-S11-1 (Stellantis lança < R$ 100k), T-S7-3 (MPT autua), ... (ver [`D3-AUTO-TRIGGER-SPEC.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md)).

**T-MV (5 multivariados, v2.0.1+):** T-MV1 (4-shock stress: FX > 6.2 AND Supply RED AND Tariff > 30% AND S7 RED), T-MV2 (FX-Supply tail: FX > 6.0 AND S2 RED por > 20 dias), T-MV3 (Tariff jump: salta > 10pp em < 30 dias), T-MV4 (CVaR breach: CVaR95 realizado > R$ 10,14 bi), T-MV5 (Upside capture: BRL < 5.0 AND Tariff exemption AND S7 AMBER+).

### §2.4 Latência de resposta

| Transição | Latência alvo | Quem decide | Procedimento |
|---|---|---|---|
| **GREEN → AMBER** | **5 min** | CSO + CFO | Revisão automática do trigger matrix, atualização de tiers S1-S4 |
| **AMBER → RED** | **60 min** | CSO + CFO + CEO + Head Supply | Comitê de crise; aprovação de bridge financing / plano B supply |
| **RED → AMBER** | **24h** | CSO + CFO | Desmobilização ordenada de instrumentos de stress; freeze de novas despesas |
| **AMBER → GREEN** | **72h** | CSO | Recalibração de baseline; corte de advocacy expandido; hedge re-otimizado |
| **S7 RED (kill switch)** | **24h** | CEO + Conselho | Kill switch protocol: pausar capex, revisar covenants, engajar MPT/MTE |

> **Princípio crítico:** a **latência importa mais que a decisão em si**. Se você decide hedge em 5 min mas a execução leva 5 dias, a decisão foi inútil.

---

## §3. Layer 3 — DECISION (decision trees + cost-benefit)

### §3.1 Função

Para cada combinação de sinais materialmente distinta, há uma **decision tree** com sequência:
```
SE S1 = RED (PTAX > 5.50) E S6 = GREEN (PIB > 0)
  → Ativar hedge extra (de 50% para 75%)
  → Acelerar revisão de pricing defensivo (S4)
  → NÃO repriorizar supply chain (PIB forte sustenta demanda)
```

### §3.2 As 12 decision trees (matriz S3 × S6)

4 cenários BNDES × 3 status macro = **12 cells materialmente distintos**.

| S3 \ S6 | S6 GREEN (1.0×) | S6 AMBER (1.5×) | S6 RED (2.0×) |
|---|---|---|---|
| **Expansão** (ViE 25%) | composite 58, hedge 30%, defensivo Tier 3 | composite 68, hedge 40% | composite 78, hedge 50% |
| **Continuidade** (ViE 18%) | composite 65, hedge 50%, defensivo Tier 2 | composite 78, hedge 60% | composite 88, **modo crise** |
| **RB Parcial** (ViE 10%) | composite 73, hedge 70%, defensivo Tier 1 | composite 85, hedge 80% | composite 95, **modo crise** |
| **RB Total** (ViE 0%) | composite 82, hedge 90%, defensivo Tier 0 | composite 93, hedge 95% | composite 99, **modo crise + plano B** |

**Override S7 (kill switch):** se S7 = RED (lista suja MTE ativa), composite = 95 fixo, hedge 95%, defensivo mínimo.

### §3.3 Os 4 padrões materialmente distintos

| Padrão | Cells | Composite | Latência | Custo típico |
|---|---|---|---|---|
| **Execução limpa** | Expansão+GREEN/AMBER, Continuidade+GREEN | 58-68 | Semanal | Custo marginal |
| **Modo tensão** | Continuidade+AMBER, RB Parcial+GREEN/AMBER | 73-85 | 60 min se RED, semanal se AMBER | R$ 25-95M |
| **Modo crise** | RB Parcial+RED, RB Total+qualquer | ≥88 | 60 min, comitê CEO+Board | R$ 150-400M |
| **Kill switch S7** | Override qualquer | 95 fixo | 24h, CEO+Conselho | Pausa capex |

### §3.4 Cost-benefit com NPV

- **NPV marginal v2.0 = R$ 1,68 bi** em 365 dias.
- **E[NPV 3y] = R$ 3,24 bi**.
- **NPV base = R$ 5,4 bi**.
- **NPV adverso = R$ 7,05 bi** (com mitigação).
- **Investment 365d = R$ 1,68 bi**.

ROI: 200× (R$ 200M+/ano stress evitado ÷ R$ 1M investido em detecção + 4x R$ 30M em hedges).

### §3.5 Sensitivity 96 cenários

[`D3-MULTIVARIATE-SENSITIVITY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md) detalha 96 cenários de stress (4 dimensões × 4 amplitudes × 6 sinais macro).

---

## §4. Layer 4 — ACTION (action register + RACI)

### §4.1 Função

Toda decisão vira uma **action item** registrada com owner, custo, deadline, KPI.

### §4.2 As 40 ações (distribuição)

| Categoria | # | Ações |
|---|---|---|
| **S1 Hedge cambial** | 5 | Calcular h* baseline, implementar constraint VaR, contratar 4 contrapartes, stress test conjunto, recalibração semestral |
| **S2 Supply chain** | 5 | Qualificar EVE Tier 1, contratos LP CATL (70% lítio), mapear 3 fornecedores alternativos, safety stock 30d, plano B spot |
| **S3 Regulatory (BNDES)** | 5 | Advocacy baseline MDIC, advocacy expandido, bridge financing R$ 800M, contratar 2 lobbystas, recalibração trimestral ViE |
| **S4 Pricing defensivo** | 5 | Implementar tier system (0/1/2/3), defensivo targeted Tier 2, análise competitiva trimestral, game theory layer, defensivo catalog-wide **REMOVIDO** (-60% a -77% ROI) |
| **S5 Partnerships** | 5 | Revisão contratos LP (EVE/CATL), ativar hedge clauses AMBER, renegociar parcerias RED, diversificar fornecedores Tier 1, mapear stakeholders |
| **S6 Framework meta** | 6 | Implementar auto-trigger S6 → S1-S5, calibração trimestral, stress test anual, dashboard executivo, workshop Conselho, recalibração anual |
| **S7 ESG kill switch** | 6 | Pausar capex novo, revisar covenants, auditoria ESG externa, plano de remediação, engajar MPT/MTE, decisão estratégica 90d |
| **C2 Game Theory** | 3 | AG-DIFF-1 LFP verticalization, AG-DIFF-2 technology differentiation, AG-DIFF-3 war of attrition hold |
| **S8-S11 (dimensões B)** | 7 | Production ramp, demand calibrada, tariff policy, competition 5-player Nash |

**Total: 40 ações** (1 REMOVIDA defensivo catalog-wide).

### §4.3 RACI 17 personas (ver Nota-Meta D3 #04)

### §4.4 9 approval + 7 kill gates (ver Nota-Meta D3 #04)

---

## §5. Layer 5 — LEARNING (post-mortem trimestral)

### §5.1 Função

Fechar o loop com **memória institucional**. Sem Layer 5, o framework vira "dashboard bonito que ninguém acredita".

### §5.2 Cadência trimestral

| Trimestre | Ação |
|---|---|
| **T+0 (mensal)** | Composite refresh, KPI tracking |
| **T+90 (trimestral)** | Post-mortem: previsto vs realizado, recalibração de elasticidades |
| **T+180 (semestral)** | Recalibração GARCH(1,1)-t, h* formula, multiplier 1.0×/1.5×/2.0× |
| **T+360 (anual)** | Stress test integrado (MC 4-shock), re-ponderação S1-S11 |

### §5.3 5 recalibrações empíricas (D3 v0.6 → v2.0)

| # | Parâmetro | Antes | Depois | Δ | Fonte |
|---|---|---|---|---|---|
| 1 | σ PTAX | 14,19% | 16,0% | +1,81pp | BCB SGS 10813 (2.509 obs) |
| 2 | vol 30d AMBER | 18% | 15% | -3pp | Realized 2024-2026 |
| 3 | vol 30d RED | 25% | 30% | +5pp | Realized 2020-2024 stress |
| 4 | h* Expansão | 30% | 35% | +5pp | Fastmarkets histórico |
| 5 | Lítio baseline | US$ 10-12k | US$ 22k | +83% | Fastmarkets Jul/2026 |

### §5.4 Por que recalibração importa

A σ é **janela rolante** — não é constante. O realized de 2024-2026 é pior que o estimado 2014-2024. Sem recalibração, o modelo **subestima o VaR real**.

### §5.5 Status atual Layer 5

**Limitação importante:** Layer 5 ainda **não totalmente operacional** em D3 v2.0.2. O post-mortem trimestral foi **projetado** mas não **re-rodado mensalmente**.

---

## §6. As 11 dimensões S1-S11 (deep dive)

### §6.1 S1 — FX / Hedge (peso 0,157 — Tier 1)

**O que mede:** risco cambial PTAX (BRL/USD) e seu impacto no BOM importado (~42% dolarizado).

**Status Jul/2026:** 🟡 AMBER (BRL R$ 5,50, σ 14,86% BCB realized).

**Couplings:** S1↔S3 (h* sizing), S1↔S2 (joint VaR), S1↔S4 (hedge vs defensive).

**Trigger principal:** PTAX > R$ 5,40 (5d) → ativar hedge extra.

**Ação crítica:** AG-003 hedge FX 95% (R$ 30M, deadline 31/out/2026).

### §6.2 S2 — Supply Chain / Lithium (peso 0,139 — Tier 1)

**O que mede:** concentração de fornecedores (HHI por categoria) e risco de lítio.

**Status Jul/2026:** 🟡 AMBER (Lítio US$ 22k, +83% vs baseline).

**Couplings:** S1↔S2 (joint VaR), S5↔S2 (partnerships supply).

**Trigger principal:** CATL outage confirmado → plano B fornecedores.

**Ação crítica:** AG-002 nacionalização 70% (R$ 280M, deadline 31/out/2027).

### §6.3 S3 — BNDES / ViE (peso 0,157 — Tier 1)

**O que mede:** risco regulatório do ViE (Vehicle Incentive Estimate) via BNDES + Rota 2030.

**Status Jul/2026:** 🟡 AMBER (ViE 18%, cenário Continuidade).

**Couplings:** S1↔S3 (h*), S3↔S4 (defensivo break-even).

**Trigger principal:** BNDES atrasar > 30 dias → ativar bridge financing R$ 800M.

**Ação crítica:** AG-001 resolver lista suja MTE (R$ 25M, deadline 30/set/2026).

### §6.4 S4 — Pricing / Defensive (peso 0,139 — Tier 1)

**O que mede:** margem operacional sob pricing defensivo (redução de preço de catálogo).

**Status Jul/2026:** 🔴 RED (tariff 35% Jan/2027, margin -44,5%).

**Couplings:** S1↔S4 (hedge vs defensive ~9× ratio), S3↔S4 (break-even ViE=10%).

**Trigger principal:** BYD share < 28% → defensivo Tier 1.

**Ação crítica:** AG-DIFF-2 technology differentiation (R$ 200M, deadline 30/jun/2027).

### §6.5 S5 — Partnerships (peso 0,087 — Tier 2)

**O que mede:** qualidade dos contratos com parceiros-chave (EVE, CATL, Tier 1).

**Status Jul/2026:** 🟡 AMBER (EVE qualification em meses).

**Couplings:** S5↔S2 (partnerships supply), S5↔S7 (reputação).

**Trigger principal:** MSCI RepRisk BYD sobe > 20pp em 1 mês.

### §6.6 S6 — Macro Governor (peso 0,087 — Tier 2)

**O que mede:** estado macro (PIB, Selic, IPCA, FGV ICG/ICC, trade deficit).

**Status Jul/2026:** 🟡 AMBER (trigger 5min ativo — multi-amber signals).

**Couplings:** S6→all (multiplier 1.0×/1.5×/2.0×).

**Trigger principal:** PIB mensal < 0 por 2 trimestres → modo tensão.

**Limitação:** S6 macro é **multiplier** (reescala tudo), não trigger dedicado. O framework trata macro como **condição ambiente**, não como **evento binário**.

### §6.7 S7 — ESG / Reputação (peso 0,043 — Tier 3)

**O que mede:** risco ESG (lista suja MTE, MSCI RepRisk, controversies).

**Status Jul/2026:** 🔴 RED (kill switch ATIVO desde 07/abr/2026 — lista suja MTE).

**Couplings:** S7→S3 (kill switch — bloqueia BNDES).

**Trigger principal:** Lista suja MTE → kill switch 24h.

**Por que peso baixo:** S7 é **binário** (kill switch on/off). Quando RED, composite trava em 95 fixo, **independentemente do peso**. É o "gate", não a "dimensão".

### §6.8 S8 — Production Ramp (peso 0,070 — Tier 2)

**O que mede:** progresso do ramp SKD→CKD→Nacional (target 70% nacional até 2027).

**Status Jul/2026:** 🟡 AMBER (33% capacidade).

**Couplings:** S1↔S8 (ramp recalibra FX exposure), S5↔S8 (partnerships EVE ramp).

**Trigger principal:** SKD/CKD atrasa > 3 meses vs target.

### §6.9 S9 — Demand Growth (peso 0,035 — Tier 3)

**O que mede:** evolução da demanda EV no Brasil.

**Status Jul/2026:** 🟢 GREEN (EV share 13,5% Jul/2026, +153% YoY, BYD vende tudo que produz).

**Couplings:** S9↔S10 (demand + tariff), S9↔S11 (demand + competition).

**Trigger principal:** BYD backlog < 2× produção mensal.

### §6.10 S10 — Tariff Policy (peso 0,043 — Tier 3)

**O que mede:** regime tarifário para EVs importados (Camex).

**Status Jul/2026:** 🔴 RED (35% Jan/2027 confirmado; Camex rejeitou redução).

**Couplings:** S1↔S10 (duplo cost-shock FX + tariff), S3↔S4↔S10 (tripla).

**Trigger principal:** Tariff salta > 10pp em < 30 dias (Camex emergency).

**Ação crítica:** AG-DIFF-1 LFP verticalization (R$ 600M, deadline 31/dez/2027).

### §6.11 S11 — Competitive Landscape (peso 0,043 — Tier 3)

**O que mede:** dinâmica competitiva BYD vs Stellantis/GM/VW/Geely.

**Status Jul/2026:** 🟡 AMBER (NASH Differentiate equilíbrio E3 estável).

**Couplings:** S9↔S11, S3↔S4↔S11, S1↔S4↔S11.

**Trigger principal:** Stellantis lança veículo < R$ 100k no BR.

**Insight contraintuitivo:** BYD **NÃO** deve responder Stellantis com desconto. A guerra de preços é pior resultado conjunto (soma −R$ 8,6 bi NPV agregado).

---

## §7. A fórmula h* (estrela do coupling S1↔S3)

### §7.1 A fórmula canônica

```
h* = 91% - (ViE%/22%) × 61%
```

**O que ela diz:** o **hedge ótimo** (h*) depende do **ViE** (Vehicle Incentive Estimate) — quando o BNDES está saudável, hedge é baixo (30%); quando o BNDES está em Rollback Total, hedge sobe para 91%.

### §7.2 Validação

| Cenário | ViE | h* calculado | Interpretação |
|---|---|---|---|
| **Expansão** | 25% | 30% | Hedge baixo, política industrial alinhada |
| **Continuidade** | 18% | 41% | Baseline razoável |
| **RB Parcial** | 10% | 63% | Hedge médio, proteger exposição |
| **RB Total** | 0% | **91%** | Hedge máximo, cenário de ruptura |

### §7.3 Por que essa fórmula é a "estrela"

Ela captura o **princípio contraint-based hedging**: o hedge é tão maior quanto menor o ViE, porque o BNDES funding não cobre o BOM importado se o cenário for desfavorável.

É o **único coupling quantitativo** que tem fórmula fechada (não é tabela). Os outros 4 couplings primários (S1↔S2, S1↔S4, S3↔S4, S6→all) usam tabelas discretas.

### §7.4 Onde encontrar h* em ação

- [`D3-INTERDEPENDENCY-S1-S3.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md) (15 KB) — doc de derivação completo.
- [`D3-RECALIBRATION-S1-S3-REAL-BCB.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md) — recalibração com dados BCB.

---

## §8. Cross-refs e recursos

### §8.1 Documentos canônicos

- [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md) — fonte canônica da arquitetura.
- [`/analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md`](../../analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md) — 5-layer architecture documentada.
- [`/analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md) — OpenSpec-style spec.

### §8.2 Couplings (11 docs)

- [`/analise-prescritiva/reports/decision-framework/2_couplings/`](../../analise-prescritiva/reports/decision-framework/2_couplings/) — 11 documentos de couplings (S1-S11 + dependency-graph).
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-DEPENDENCY-GRAPH.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-DEPENDENCY-GRAPH.md) — grafo 6×6 consolidado.
- [`/analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md`](../../analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md) — derivação h*.

### §8.3 Recalibração (11 docs)

- [`/analise-prescritiva/reports/decision-framework/3_recalibration/`](../../analise-prescritiva/reports/decision-framework/3_recalibration/) — 11 documentos de recalibração.
- [`/analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md`](../../analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md) — 5 recalibrações completas.

### §8.4 Doc narrativo

- [`/analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md`](../../analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md) — 11 dimensões S1-S11 contadas como micro-histórias (615 linhas).
- [`/analise-prescritiva/case-studies/docs/SCORES.md`](../../analise-prescritiva/case-studies/docs/SCORES.md) — 3 linhagens do composite (10 KB).

### §8.5 Quantitative

- [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-QUANTITATIVE-MODEL.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-QUANTITATIVE-MODEL.md) — modelo quantitativo completo.
- [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md) — 96 cenários.

---

## §9. Takeaways em 5 bullets

1. **5 camadas = sistema nervoso autônomo.** Layer 1 (DATA) consome D2. Layer 2 (SIGNAL) detecta mudança. Layer 3 (DECISION) prescreve. Layer 4 (ACTION) executa. Layer 5 (LEARNING) fecha o loop.

2. **11 dimensões S1-S11** com **20 couplings quantitativos** (5 primários + 15 secundários). Composite 50,3 RED Modo Crise (não regressão — alinhamento com realized risks).

3. **h* = 91% - (ViE%/22%) × 61%** é a fórmula-estrela do coupling S1↔S3. Captura contraint-based hedging.

4. **S7 ESG kill switch** sobrepõe tudo: quando lista suja MTE ativa (07/abr/2026), composite trava em 95 fixo, BNDES funding bloqueado, capex novo em pausa.

5. **Layer 5 (LEARNING) ainda não totalmente operacional** — re-backtesting projetado, não re-rodado mensalmente. Limitação conhecida (ver Nota-Meta D3 #06).

---

*Versão 1.0 — 25/ago/2026 — escrita como deep dive da arquitetura D3 (sem exercícios).*

*Próxima: [Nota-Meta D3 #03 — Acoplamentos + Game Theory](./NOTA-META-D3-03-ACOPLAMENTOS-GAMETHEORY.md).*