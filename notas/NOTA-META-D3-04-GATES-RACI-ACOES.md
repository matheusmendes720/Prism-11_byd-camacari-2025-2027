---
slug: notas-meta-d3-04-gates-raci-acoes
title: "Nota-Meta D3 #04 — Gates + RACI + 40 Ações Executáveis"
ueid: ikigai:nota:d3-meta-gates-raci-acoes:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d3, gates, raci, action-register, 17-personas, 9-approval, 7-kill, 40-acoes]
custom:
  _purpose: >-
    Deep dive no sistema de governança do D3: 9 approval gates
    (R$ < 5M até Board global), 7 kill gates (paradas de emergência),
    RACI com 17 personas, e as 40 ações do action register
    (5 estratégicas + 10 táticas + 10 operacionais + 6 S7 + 3 C2
    Game Theory + 6 dimensionais). Foco didático, sem exercícios.
  _audience: COO, Conselho, CSO, risk-officer, head-de-risco
  _data_sources:
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md
    - /analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md
    - /analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md
  _outputs:
    - 9-approval-gates-por-valor
    - 7-kill-gates-parada-emergencia
    - raci-17-personas
    - 40-acoes-distribuidas
  _success_criteria: >-
    leitor entende quem decide o quê, com qual gate, em qual
    horizonte, e qual é o SLA de cada ação.
---

# Nota-Meta D3 #04 — Gates + RACI + 40 Ações Executáveis

> **Quem está falando:** um par sênior-orientador sobre o "sistema nervoso" do D3.
> **O que esta nota faz:** deep dive no sistema de governança — 9 approval gates, 7 kill gates, 17 personas RACI, e as 40 ações executáveis do action register.
> **Pré-requisito:** [Nota-Meta D3 #03 — Acoplamentos + Game Theory](./NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY.md).
> **Tempo de leitura:** 60-90 min.
> **Fonte canônica:** [`/analise-prescritiva/reports/decision-framework/5_operational/`](../../analise-prescritiva/reports/decision-framework/5_operational/) (10 docs).

---

## §0. Visão geral — a governança D3

A pergunta operacional: **"quem decide o quê, com qual gate, em qual horizonte?"**

A resposta do D3 é um **sistema de governança em 3 camadas**:
1. **Approval gates** (9 níveis) — autorizam gasto.
2. **Kill gates** (7 paradas) — bloqueiam emergência.
3. **RACI** (17 personas) — atribuem responsabilidade.

Juntos, esses 3 elementos transformam o framework em **ação executável**.

---

## §1. Os 9 Approval Gates (autorização por valor)

### §1.1 Função

Approval gates respondem: **"quem pode aprovar R$ X?"**

A regra é simples: **quanto maior o valor, mais alto na hierarquia**.

### §1.2 Tabela completa

| Faixa de valor | Gate | Aprovador | Latência alvo | Quem submete |
|---|---|---|---|---|
| < R$ 5M | **G1** | Risk Officer | Imediato | Risk Officer + CSO |
| R$ 5M – R$ 30M | **G2** | CSO + CFO | 24h | CSO |
| R$ 30M – R$ 100M | **G3** | CEO | 72h | CEO |
| R$ 100M – R$ 280M | **G4** | Conselho local (Brasil) | 7 dias | Conselho |
| > R$ 280M | **G5** | Board global BYD | 30 dias | CEO + Conselho |

### §1.3 Por que 9 e não 5

Em D3 v0.5 eram **5 gates** (R$ 5M / 30M / 100M / 280M / Board). Em v2.0 foram **adicionados 4 sub-gates** (G6 a G9) para casos especiais:

- **G6**: Bridge financing standby (R$ 800M) — exige aprovação dupla CEO + Conselho.
- **G7**: AG-DIFF-1 LFP verticalization (R$ 600M) — exige Board global.
- **G8**: Lista suja MTE (kill switch) — exige resposta 24h CEO + Conselho.
- **G9**: Recalibração trimestral de pesos — Risk Officer + CFO.

### §1.4 Onde encontrar

- [`D3-RACI.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md) (28 KB) — RACI com 17 personas e 8 approval gates.
- [`D3-ACTION-PLAN.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md) (33 KB) — 31 ações com gates.

---

## §2. Os 7 Kill Gates (paradas de emergência)

### §2.1 Função

Kill gates respondem: **"quando parar tudo?"**

A regra é: **approval gates autorizam; kill gates bloqueiam**. São opostos.

### §2.2 Tabela completa

| Gate | Condição de ativação | Ação | Latência | Quem decide |
|---|---|---|---|---|
| **K1** | S7 = RED (lista suja) | Pausar capex novo, freeze despesas | 24h | CEO + Conselho |
| **K2** | 4-shock simultâneo (T-MV1) | Composite 95 fixo, freeze all | 5 min | CSO + CFO |
| **K3** | CVaR breach > R$ 10,14 bi | Comitê de crise | 24h | CRO |
| **K4** | BNDES funding bloqueado > 90 dias | Plano B financiamento ativado | 30 dias | CFO + Conselho |
| **K5** | CATL outage > 30 dias | Plano B fornecedores ativado | 30 dias | Head Supply + COO |
| **K6** | PTAX > R$ 6,20 por 5 dias | Hedge 95% saturado, bridge standby | 24h | Risk Officer + CFO |
| **K7** | Lista suja 2ª autuação | Reverter / reestruturar / hibernar | 24h | CEO + Conselho + Board global |

### §2.3 Por que kill gates importam

Sem kill gates, o framework continua executando ações em cenários onde deveria **parar tudo**. Por exemplo, durante a lista suja (S7 RED), AG-DIFF-1 (LFP verticalization R$ 600M) deve estar **pausado** até a situação ESG ser resolvida.

### §2.4 O caso S7 (kill switch ativo desde 07/abr/2026)

Desde **07/abr/2026**, **K1 está ativo**. Isso significa:
- **Pausa de capex novo** (AG-DIFF-1 e AG-DIFF-2 suspensos até S7 AMBER).
- **BNDES funding bloqueado** (R$ 800M+ inacessíveis).
- **Plano de remediação ESG** ativo (head Gov Relations + CSO).
- **Decisão estratégica 90d** triggered (reverter / reestruturar / hibernar).

**Implicação:** o **AG-001 (resolver lista suja)** é a **porta de entrada** — sem ele, K1 não desativa, e o programa fica congelado.

### §2.5 Onde encontrar

- [`D3-RACI.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md) (28 KB) — RACI com 7 kill gates.
- [`D3-ACTION-PLAN.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md) (33 KB) — 31 ações com kill gates.
- [`D3-RISK-REGISTER.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md) (57 KB) — risk register completo.

---

## §3. O RACI com 17 Personas

### §3.1 Função

RACI = **R**esponsible (executa), **A**ccountable (aprovador final), **C**onsulted (consultado), **I**nformed (informado).

A pergunta: **"quem é o dono?"**

### §3.2 As 17 personas (D3 v2.0.2)

| Persona | Função | Nível decisão | Faixa de aprovação |
|---|---|---|---|
| **CEO** | Decisor final | Estratégico | > R$ 280M (Board global) |
| **CFO** | Tesouraria + funding | R$ < 100M | R$ 30-100M |
| **COO** | Operações + supply chain | R$ < 100M | R$ 30-100M |
| **CSO** | Estratégia + framework | R$ < 30M | R$ 5-30M |
| **CRO** | Risco + VaR/CVaR | R$ < 30M | R$ 5-30M |
| **Head de Sup. Chain** | Fornecedores + dual-sourcing | R$ < 100M | R$ 30-100M |
| **Head de Tesouraria** | Hedge cambial | R$ < 50M | R$ 5-50M |
| **Head de IR (Gov Relations)** | BNDES + advocacy | R$ < 12M | R$ 5-12M |
| **Head Comercial** | Pricing defensivo | R$ < 320M/ano | R$ 30-100M |
| **Risk Officer** | Triggers + matriz | R$ < 5M | < R$ 5M |
| **Head de Marketing** | Pricing + comunicação | R$ < 5M | < R$ 5M |
| **Head Jurídico** | Contratos + covenants | R$ < 5M | < R$ 5M |
| **Head de Procurement** | Contratos fornecedores | R$ < 30M | R$ 5-30M |
| **Head de Strategy** | Análise competitiva | R$ < 2M | < R$ 5M |
| **Head de Comms** | Comunicação externa | R$ < 5M | < R$ 5M |
| **Head Gov Relations** | MPT/MTE/BNDES | R$ < 12M | R$ 5-12M |
| **Conselho** | Aprovação > R$ 280M | Estratégico | > R$ 280M |

### §3.3 RACI por prescrição (resumo)

| Prescrição | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|---|---|---|---|---|
| **Hedge FX (S1)** | Risk Officer | CFO | CSO, Head Treasury | CEO, Conselho |
| **Dual-sourcing (S2)** | Head Supply Chain | COO | CSO, Procurement | CFO, Conselho |
| **Advocacy BNDES (S3)** | Head Gov Relations | CEO | CFO, CSO | Conselho, Board global |
| **Defensivo pricing (S4)** | Head Marketing | CMO | CFO, CSO, Sales | Conselho |
| **Kill switch S7** | Head Gov Relations + CSO | CEO | CFO, Head Comms, Legal | Conselho, MTE |
| **Trigger S6** | CSO | CEO | CFO, COO, Heads S1-S5 | Conselho, Board global |
| **Bridge financing (RED)** | CFO | CEO | CSO, Head Treasury, Banco | Board global |

### §3.4 O que acontece quando o CEO está ausente

A cadeia de aprovação: **CEO → CFO + COO (joint) → CSO + CRO (joint)**.

A regra: **2 dos 4 C-level** podem aprovar em R$ 30-100M. Em R$ > R$ 280M, precisa Conselho + Board.

### §3.5 Onde encontrar

- [`D3-RACI.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md) (28 KB) — RACI completo.
- [`/analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md`](../../analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md) (9 KB) — mapa de decisões por persona.
- [`/analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md`](../../analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md) (20 KB) — sistema de alertas.

---

## §4. As 40 Ações Executáveis (D3 v2.0.2)

### §4.1 Função

O **action register** lista as 40 ações distribuídas em 6 grupos, com owner, custo, deadline, KPI, gate, SLA.

### §4.2 Distribuição por grupo

| Grupo | # Ações | Foco |
|---|---|---|
| **S1 Hedge cambial** | 5 | Cobertura FX (S1↔S3 com h* formula) |
| **S2 Supply chain** | 5 | Dual-sourcing + safety stock + LP CATL |
| **S3 Regulatory (BNDES)** | 5 | Advocacy + bridge financing + 2 lobbystas |
| **S4 Pricing defensivo** | 5 | Tier system 0-3 + analysis (catalog-wide REMOVIDO) |
| **S5 Partnerships** | 5 | LP contracts + hedge clauses + diversify |
| **S6 Framework meta** | 6 | Auto-trigger + calibração + dashboard + workshop |
| **S7 ESG kill switch** | 6 | Pausa capex + auditoria + remediação + MPT/MTE |
| **C2 Game Theory** | 3 | AG-DIFF-1/2/3 (LFP + tech differentiation + war hold) |
| **S8-S11 dimensionais** | 7 | Production ramp + demand + tariff + competition |
| **Total** | **45** | 5 estratégicas + 10 táticas + 10 operacionais + 6 S7 + 3 C2 + 11 S8-S11 |

(**Nota:** algumas fontes dizem 40, outras 45. A diferença: 5 ações de "triggers operacionais" que são counted ou não dependendo do critério. Usamos 40 para o "core" e 45 para o "completo".)

### §4.3 As 5 ações 90 dias (3 críticas + 2 game theory)

| # | Ação | Owner | Custo | Deadline | Gate | KPI |
|---|---|---|---|---|---|---|
| **AG-001** | Resolver lista suja MTE (S7) | CFO + Head Gov Relations | R$ 25M | **30/set/2026** | G2 (CSO+CFO) | S7 AMBER 30d + fora lista + ESG aprovado |
| **AG-002** | Acelerar nacionalização 70% (S2) | COO + Head Supply | R$ 280M | **31/out/2027** | G4 (Conselho) | FX exposure 90% → 15% |
| **AG-003** | Implementar hedge FX 95% (S1) | Risk Officer + Head Treasury | R$ 30M | **31/out/2026** | G3 (CEO) | hedge ≥90% exposure |
| **AG-DIFF-1** | LFP verticalization (S2 + C2) | CEO + CFO + Head Supply | R$ 600M | **31/dez/2027** | G5 (Board global) | S2 supply risk -50% |
| **AG-DIFF-2** | Technology differentiation (S4 + S11) | Head R&D + CMO | R$ 200M | **30/jun/2027** | G4 (Conselho) | S4+S11 protection |

### §4.4 As 6 ações S7 (kill switch protocol)

| # | Ação | Owner | Custo | Status |
|---|---|---|---|---|
| 1 | Pausar capex novo (S2, S4, S5) | CEO + CFO | R$ 0 (freeze) | **ATIVO** desde 07/abr/2026 |
| 2 | Revisar covenants de financiamentos existentes | CFO + Head Legal | R$ 0 | Pendente |
| 3 | Auditoria ESG externa (Deloitte/EY/KPMG) | CSO + Head Comms | R$ 3M | Pendente |
| 4 | Plano de remediação público (workers compensation) | Head Gov Relations + CSO | R$ 20M | Pendente |
| 5 | Engajar MPT/MTE para definir plano de saída da lista suja | Head Gov Relations + CEO | R$ 2M | **Em andamento** |
| 6 | Decisão estratégica 90d (reverter / reestruturar / hibernar) | CEO + Conselho + Board global | TBD | Pendente (deadline 19/out/2026) |

### §4.5 As 3 ações C2 Game Theory (NASH E3)

| # | Ação | Owner | Custo | Prioridade |
|---|---|---|---|---|
| **AG-DIFF-1** | LFP verticalization (S2 + C2) | CEO + CFO + Head Supply | R$ 600M | **CRÍTICA** |
| **AG-DIFF-2** | Technology differentiation (S4 + S11) | Head R&D + CMO | R$ 200M | ALTA |
| **AG-DIFF-3** | War of attrition hold (S11) | CEO + Head Strategy | Custo oportunidade | **CRÍTICA** |

**Insight:** AG-DIFF-3 tem **custo oportunidade** (não monetário) — é a decisão de **NÃO entrar em guerra de preços**. Aceitar share sacrifice temporário para preservar margem.

### §4.6 ROI agregado das 5 ações críticas

| Métrica | Valor |
|---|---|
| Custo total 90 dias (AG-001 + AG-003) | R$ 35M |
| Custo total 18 meses (5 ações) | R$ 1,135M |
| Stress evitado por ano | R$ 200M+ |
| **ROI** | **200×** |
| **Payback** | **< 1 mês** |

Detalhamento dos stress events que pagam o investimento:

| Evento | Período | R$ evitado |
|---|---|---|
| COVID-19 | 2020-03 a 2020-12 | R$ 50M |
| Semicondutor | 2021-Q1 | R$ 30M |
| Election 2022 | 2022-08 a 2022-11 | R$ 20M |
| Lítio spike | 2022-Q2 | R$ 80M |
| Election 2024 | 2024-08 a 2024-11 | R$ 15M |
| Stagflação 2025 | 2025-01 a 2025-12 | R$ 5M |
| **Total** | **2020-2025** | **R$ 200M+** |

### §4.7 Onde encontrar

- [`D3-ACTION-PLAN.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md) (33 KB) — 31 ações com gates.
- [`D3-RISK-REGISTER.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md) (57 KB) — risk register completo.
- [`D3-NPV-LAYER-SPEC.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-NPV-LAYER-SPEC.md) (23 KB) — NPV layer.

---

## §5. Comparação D2 vs D3 na governança

| Aspecto | D2 v1 | D3 v2.0.2 |
|---|---|---|
| **Approval gates** | Implícito (R$ < R$ sem owner) | 9 gates explícitos (R$ < 5M até Board global) |
| **Kill gates** | Inexistentes | 7 kill gates (parada de emergência) |
| **Personas** | 4 (CFO, COO, Risk, CMO) | 17 (cobre todas as decisões) |
| **# Ações** | 5 prescrições genéricas | 40 ações executáveis com owner + KPI + gate |
| **Owner** | Implícito | Explícito (cada ação tem R+A+C+I) |
| **Deadline** | "Q3 2026" (genérico) | Data específica (ex.: 30/set/2026) |
| **KPI** | Implícito | Explícito (ex.: "S7 AMBER 30d + fora lista") |
| **Custo** | Listado | Custo + ROI + payback |
| **Hierarquia** | Binária (CEO vs operacional) | 9 níveis (G1 a G9) |

**Conclusão:** o D2 era **prescritivo em intenção**, o D3 é **prescritivo em execução**. Cada ação tem dono, custo, prazo, KPI, e gate de aprovação.

---

## §6. Os 14 Frentes Delegação (DELEGATION-PLAN)

### §6.1 Função

O **DELEGATION-PLAN** (449 linhas, [`/analise-prescritiva/presentation/DELEGATION-PLAN-ANALISE-PRESCRITIVA.md`](../../analise-prescritiva/presentation/DELEGATION-PLAN-ANALISE-PRESCRITIVA.md)) distribui **14 frentes × 5 ondas de 14 dias = 70 dias** de execução.

### §6.2 As 14 frentes (resumo)

| # | Frente | Owner | Onda |
|---|---|---|---|
| 1 | Hedge FX 95% | Risk + CFO | Onda 1 |
| 2 | Nacionalização 70% | COO | Onda 3 |
| 3 | Resolver lista suja S7 | CFO | Onda 1 |
| 4 | Recrutar CFO | CEO+Headhunter | Onda 1 |
| 5 | Recrutar CRO | CEO+Headhunter | Onda 1 |
| 6 | Recrutar CSO | CEO+Headhunter | Onda 2 |
| 7 | Recrutar Head ESG | CEO+Headhunter | Onda 2 |
| 8 | LFP verticalization | CTO | Onda 4 |
| 9 | Technology differentiation | CMO | Onda 3 |
| 10 | Rules engine Python (FastAPI) | Engineering | Onda 2 |
| 11 | Real-time data integration | Engineering | Onda 3 |
| 12 | Knowledge Graph v3.0 | Knowledge Engineer | Onda 4 |
| 13 | Backtesting contínuo Q3/Q4 | CRO | Onda 2/4 |
| 14 | Composite monitoring live | Coord. Risco | Onda 2 |

### §6.3 As 5 ondas (cronograma)

| Onda | Quando | Marco | NPV liberado |
|---|---|---|---|
| **1** | 22-ago → 04-set | 3 CTAs + Wave 1 outreach + 4 vagas LinkedIn | R$ 1,5M/45min outreach + R$ 168M hedge |
| **2** | 06-set → 19-set | Recrutar Head ESG + 1º stress test + hedge contratado | R$ 200-400M NPV/mês recuperado |
| **3** | 20-set → 04-out | Recrutar CSO + matriz pricing + Wave 2 outreach | R$ 200M upside (demanda +20%) |
| **4** | 04-out → 18-out | 1º Backtesting Q3 + 2º stress test + Conselho 2/3 | Manter 5/5+, 87-92% SLAs |
| **5** | 15-nov | Composite ≥ 65 AMBER + 18/18 outreach + 1+ offer | Composite alvo atingido |

**Total:** cronograma 70 dias (22-ago → 30-nov/2026) com meta de composite sair de RED (50,3) para AMBER (≥ 65).

### §6.4 Status atual (22-ago-2026)

- **Onda 1 em andamento** (CTAs preparados, vagas LinkedIn publicadas).
- **4 cadeiras vagas há 137 dias**: CFO, CRO, CSO, Head ESG (gargalo crítico).
- **0/18 outreach enviado** — bloqueado pelas cadeiras vagas.
- **Plano R$ 1,68 bi parado** por falta de execução.

---

## §7. Cross-refs e recursos

### §7.1 Documentos canônicos D3

- [`/analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md) (28 KB) — RACI completo.
- [`/analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md) (33 KB) — action plan.
- [`/analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md) (57 KB) — risk register.
- [`/analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md) (22 KB) — auto-trigger.

### §7.2 NPV layer

- [`/analise-prescritiva/reports/decision-framework/5_operational/D3-NPV-LAYER-SPEC.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-NPV-LAYER-SPEC.md) (23 KB) — NPV live layer.
- [`/analise-prescritiva/case-studies/docs/NPV_PRESCRIPTIONS.md`](../../analise-prescritiva/case-studies/docs/NPV_PRESCRIPTIONS.md) (5.9 KB) — NPV por prescrição.

### §7.3 Docs narrativos

- [`/analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md`](../../analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md) (9 KB) — mapa de decisões.
- [`/analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md`](../../analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md) (20 KB) — sistema nervoso.

### §7.4 Plano de execução

- [`/analise-prescritiva/presentation/DELEGATION-PLAN-ANALISE-PRESCRITIVA.md`](../../analise-prescritiva/presentation/DELEGATION-PLAN-ANALISE-PRESCRITIVA.md) (449 linhas) — 14 frentes × 5 ondas.
- [`/outputs/SNAPSHOT-OPERACIONAL.md`](../../outputs/SNAPSHOT-OPERACIONAL.md) (7 KB) — raid briefing Conselho 22-ago-2026.

---

## §8. Takeaways em 5 bullets

1. **9 approval gates** por valor: < R$ 5M (Risk Officer) → > R$ 280M (Board global). Quanto maior o valor, mais alta a hierarquia.

2. **7 kill gates** são opostos dos approval gates — bloqueiam emergência (lista suja, CVaR breach, 4-shock stress). K1 (S7 lista suja) está ATIVO desde 07/abr/2026.

3. **17 personas RACI** cobrem todas as decisões (vs 4 em D2 v1). Cada ação tem R+A+C+I explícitos.

4. **40 ações executáveis** vs 5 prescrições genéricas em D2. Cada ação tem owner + custo + deadline + KPI + gate + SLA.

5. **ROI 200×, payback < 1 mês.** R$ 1,135M de investimento em 18 meses → R$ 200M+/ano stress evitado. **4 cadeiras vagas (CFO, CRO, CSO, Head ESG) há 137 dias** são o gargalo crítico.

---

*Versão 1.0 — 25/ago/2026 — escrita como deep dive de governança D3 (sem exercícios).*

*Próxima: [Nota-Meta D3 #05 — Calibração + Backtesting 5/5](./NOTA-META-D3-05-CALIBRACAO-BACKTESTING.md).*