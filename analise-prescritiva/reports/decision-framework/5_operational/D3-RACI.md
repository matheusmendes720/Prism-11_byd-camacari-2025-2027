# D3 — RACI Matrix & Approval Gates

**Documento operacional** · Define ownership, accountability, approval thresholds e escalation paths para o framework D3
**Data**: 21/jul/2026
**Versão**: v0.6 (11 dimensões, S1-S11)
**Status**: Working draft · para aprovação do Conselho

---

## 1. Propósito

O D3 framework (D3-MAIN.html v0.6) define 12 decision trees, 31 ações e 11 dimensões. Mas **quem decide o quê, e até que valor?** Este documento responde:

1. **RACI por sessão** (S1-S11): quem é Responsible, Accountable, Consulted, Informed para cada tipo de decisão
2. **RACI por nível de $**: quem aprova em cada threshold de gasto
3. **Approval gates**: gates explícitos que travam o playbook se não cumpridos
4. **Quorum rules**: quando é necessário mais de 1 aprovador
5. **Escalation paths**: níveis de escalada quando há impasse ou risco material

---

## 2. Papéis (RACI Cast)

> **v0.6 update 21/jul**: 8 papéis definidos para o framework D3 com 11 dimensões.

| Papel | Descrição | Cargo típico | Mandato |
|---|---|---|---|
| **Sponsor** | Conselho que aprova recursos e estratégia | Conselho BYD / Board | Aprova walk-away, demissões, venda ativos acima de R$ 280M |
| **DecisionMaker** | Aprova decisões operacionais e aloca recursos | CFO / Director | Aprova hedge sizing, budget allocation, freeze despesas |
| **RiskOwner** | Gerencia risco e propões mitigação | CRO / Head de Risco | Propõe hedge sizing, valida constraint VaR |
| **Analyst** | Analisa dados e gera prescrições | Estratégico / CSO | Opera signal matrix, triggera playbooks, calcula composite |
| **Monitor** | Fiscaliza compliance e marcos | Compliance / Head ESG | Monitora status, detecta triggers, reporta desvios |
| **Approver** | Aprova em thresholds regulatórios | BNDES / MDIC / Camex | Aprova funding, Tarifas, Certificações |
| **Executor** | Executa operações e implementação | Operações / COO / Heads | Executa hedge, supply, pricing, ramp-up |
| **Advisor** | Consultores externos que dão opinião especializada | Consultores / Assessores | Advoga posições, game theory, análise competitiva |

**Nota sobre mapping de papéis para pessoas reais (jul/2026)**:

| Papel | Pessoa identificada | Status |
|---|---|---|
| Sponsor | Conselho de Administração BYD | Confirmado |
| DecisionMaker | CFO | A ser nomeado |
| RiskOwner | CRO | A ser nomeado |
| Analyst | CSO | A ser nomeado |
| Monitor | Head ESG/Compliance | A ser nomeado |
| Approver | BNDES/MDIC (entidades externas) | Em negociação |
| Executor | COO + Heads funcionais | Em estruturação |
| Advisor | Consultores externos | Contratados |

---

## 3. RACI Matrix — Visão Consolidada (S1-S11)

### 3.1 Legenda

- **A** = Accountable (responde pelo resultado final)
- **R** = Responsible (executa a tarefa)
- **C** = Consulted (opinião antes da decisão)
- **I** = Informed (comunicado após a decisão)

### 3.2 Matriz Consolidada

| Dimensão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| **S1 FX / Hedge** | A | R | R | C | I | I | R | C |
| **S2 Supply Chain** | A | R | R | C | I | I | R | C |
| **S3 BNDES / ViE** | A | R | R | C | I | R | I | C |
| **S4 Pricing / Defensivo** | A | R | R | C | I | I | R | C |
| **S5 Partnerships / LP** | A | R | R | C | I | I | I | R |
| **S6 Triggers / Macro** | A | R | R | C | R | I | I | I |
| **S7 ESG** | A | R | R | C | R | I | I | R |
| **S8 Production Ramp** | A | R | R | C | I | R | R | C |
| **S9 Demand Planning** | A | R | R | R | I | I | I | C |
| **S10 Tariff Policy** | A | R | R | C | I | R | I | R |
| **S11 Competition** | A | R | R | R | I | I | I | C |

---

## 4. RACI Detalhado por Dimensão

### 4.1 S1 · FX / Hedge Cambial

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Calcular h* baseline (constraint-based) | A | R | R | C | I | — | — | C |
| Implementar constraint VaR ≤ 20% margin | A | R | R | C | I | — | R | — |
| Contratar contrapartes hedge (4 banks) | A | R | C | I | — | I | R | — |
| Stress test conjunto FX+supply (12 combinações) | A | R | R | C | — | — | — | C |
| Reavaliar contrapartes (rating downgrade) | A | R | R | C | I | — | R | C |
| Kill switch: PTAX > R$ 6.20 sustentado 30d | A | R | R | C | I | — | — | — |
| Hedge sizing em tree #1-12 (operacional) | A | R | R | C | — | — | — | — |

**Justificativa S1**:
- **Sponsor (A)**: FX hedge tem impacto >R$ 100M no P&L, requer aprovação do Conselho
- **DecisionMaker (R)**: CFO é o accountable natural por decisões de tesouraria
- **RiskOwner (R)**: Risk Officer propões e valida sizing do hedge
- **Advisor (C)**: Consultores externos validam pricing de opções e contrapartes

### 4.2 S2 · Supply Chain (Lítio + Fornecedores)

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Monitorar lítio (PTAX + vol 30d) | A | R | R | C | I | — | R | C |
| Acionar EVE qualification acceleration | A | R | C | C | — | I | R | — |
| Plano B dual-sourcing emergency | A | R | R | C | — | I | R | C |
| Renegociar CATL LP take-or-pay | A | R | C | I | — | I | R | C |
| Kill switch: lítio > US$80k/t sustentado 3m | A | R | R | C | I | — | R | — |
| Walk-away contracts (penalty) | A | R | C | — | — | I | R | C |
| Plano B wind-down supply (tree #12) | A | R | R | C | — | I | R | C |

**Justificativa S2**:
- **Executor (R)**: Head Procurement executa supply chain operations
- **DecisionMaker (R)**: CFO aprova contratos >R$ 50M
- **RiskOwner (C)**: Valida exposure de supply e contraparte risk
- **Approver (I)**: BNDES informado sobre supply chain changes que afetam ViE

### 4.3 S3 · BNDES / Regulatory (ViE)

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Monitorar status BNDES (cronograma) | A | R | C | C | I | — | — | C |
| Advocacy BNDES (operacional R$ 0-18M) | A | R | — | C | I | R | — | C |
| Advocacy R$ 30M (tree #10) | A | R | C | C | — | R | — | C |
| Kill switch: BNDES officially denies | A | R | R | C | I | R | — | C |
| Renegociar termos ViE (se autorizado) | A | R | — | C | — | R | I | C |
| Ativar Tree #10-12 (RB Total) sob trigger | A | R | R | C | — | — | R | — |

**Justificativa S3**:
- **Approver (R)**: BNDES/MDIC são os aprobadores formais do funding e ViE
- **Executor (I)**: Operações são informadas quando regulatory muda
- **Monitor (I)**: Compliance acompanha status regulatório
- **S7 ESG override**: Lista suja MTE bloqueia BNDES independentemente do ViE (ver S7)

### 4.4 S4 · Pricing / Defensivo

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Tier 0 (sem defensivo) — baseline | A | R | C | C | — | — | R | — |
| Tier 1 (R$ 7.5M marketing) | A | R | C | C | — | — | R | — |
| Tier 2 (R$ 15M, 5k unidades) | A | R | C | C | — | — | R | — |
| Tier 3 (R$ 22.5M, 5k + comunicação) | A | R | C | C | — | — | R | C |
| Decisão de pricing (preço base) | A | R | C | C | — | — | R | C |
| Game theory layer (resposta competitiva) | A | R | C | C | — | — | — | R |
| Kill switch: defensivo catalog-wide | A | R | R | C | — | — | — | — |

**Justificativa S4**:
- **Executor (R)**: Head Marketing executa pricing e defensivo
- **DecisionMaker (R)**: CFO aprova discounts >R$ 1M
- **Advisor (R para game theory)**: Consultores de game theory orientam resposta competitiva
- **RiskOwner (C)**: Valida que defensivo não compromete VaR ou margem

### 4.5 S5 · Partnerships / LP

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Lock CATL LP 70% volume a preço fixo | A | R | C | I | — | I | R | C |
| Qualificar EVE backup (R$ 30M) | A | R | C | C | — | I | R | — |
| Renegociação take-or-pay | A | R | C | — | — | I | R | C |
| Diversificação emergencial Tier 1 | A | R | C | C | — | I | R | — |
| Walk-away contracts (penalty R$ 50M) | A | R | C | — | — | I | R | C |
| Monitorar delivery KPIs (CATL/EVE) | A | R | R | C | I | — | R | — |

**Justificativa S5**:
- **Advisor (R para renegociar)**: Consultores externos lideram negociação de contratos complexos
- **Executor (R)**: Head Procurement executa contratos
- **Monitor (I)**: Compliance monitora covenants e compliance

### 4.6 S6 · Macro Triggers (Governor de todas as outras)

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Monitorar PTAX vol 30d (signal S6) | A | R | R | C | R | — | — | — |
| Calcular composite score (11 dimensões) | A | R | R | C | R | — | — | — |
| Triggar mudança de cluster (1→2→3) | A | R | R | C | I | — | — | — |
| Comitê permanente (cluster 3, daily standup) | A | R | R | C | I | — | R | — |
| Kill switch: σ PTAX > 22% anualizada | A | R | R | C | R | — | — | — |
| Macro multiplier (1.0/1.5/2.0×) | A | R | R | C | I | — | — | — |

**Justificativa S6**:
- **Monitor (R para monitorar)**: Head ESG/Compliance monitora sinais e reporta triggers
- **RiskOwner (R)**: Valida thresholds e dispara alertas
- **Analyst (C)**: CSO calcula composite e determina prescrições
- **Executor (R em комитете)**: COO executa decisões do comitê de crise

### 4.7 S7 · ESG (Kill Switch)

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Trigger S7: status lista suja MTE | A | R | R | C | R | I | — | — |
| Resposta a S7 RED (kill switch ativo) | A | R | R | C | R | — | R | R |
| Plano de remediação ESG | A | R | C | C | R | — | R | C |
| Auditoria ESG externa | A | R | C | C | R | — | — | C |
| Decisão de reestruturação (S7 cronifica) | A | R | C | C | I | — | — | R |
| Engajar MPT/MTE para saída da lista suja | A | R | C | C | R | R | R | C |

**Justificativa S7**:
- **Monitor (R)**: Head ESG monitora status lista suja e controversies — papel crítico porque S7 é kill switch
- **Sponsor (A)**: Conselho aprova decisões de reestruturação >R$ 280M
- **DecisionMaker (R)**: CEO/CFO decidem resposta operacional ao kill switch
- **Approver (R para MTE)**: MTE é o aprovador externo que determina saída da lista suja
- **Advisor (R para reestruturação)**: Consultores externos orientam decisão estratégica

**Risco**: S7 RED (kill switch ativo) sobrepõe qualquer combinação S1-S6 — composite = 95 fixo, BNDES funding bloqueado, capex em pausa.

### 4.8 S8 · Production Ramp

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Monitorar produção vs capacidade nominal | A | R | C | C | I | — | R | — |
| Trigger ramp review (< 50% por 6 meses) | A | R | R | C | R | — | R | — |
| Plano de aceleração (EVE partnership) | A | R | C | C | — | R | R | C |
| Revisão de nacionalização (meta BNDES) | A | R | C | C | I | R | R | — |
| Decisão de pause produção (S10 RED) | A | R | R | C | — | — | R | C |
| Comunicação a stakeholders (BNDES, MDIC) | A | R | — | C | — | R | — | — |

**Justificativa S8**:
- **Executor (R)**: Head Operations coordena ramp-up da planta
- **Approver (R para nacionalização)**: BNDES aprova progress reports de nacionalização
- **RiskOwner (R para trigger)**: Dispara ramp review quando necessário
- **Advisor (C para aceleração)**: Consultores orientam estratégia de qualificação EVE

### 4.9 S9 · Demand Planning

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Calcular market share realized | A | R | — | R | I | — | — | C |
| Projeção de demanda (EV share, cresc. YoY) | A | R | — | R | — | — | — | C |
| Cenários de demanda (baseline/upside/downside) | A | R | C | R | — | — | — | C |
| Decisão de capex fase 2 (antecipar/confirmar) | A | R | C | R | I | — | R | C |
| Recomendação de defensivo baseada em demanda | A | R | — | R | — | — | R | C |
| Monitorar BNES Move Brasil (subsídio) | A | R | — | C | I | — | — | — |

**Justificativa S9**:
- **Analyst (R para projeção)**: CSO/Head Demand Planning calculam projeções de demanda
- **RiskOwner (R para cenários)**: Valida cenários de stress para demanda
- **Advisor (C)**: Consultores externos validam metodologia de projeção
- **Executor (R para capex)**: Head Operations executa decisões de capacidade

### 4.10 S10 · Tariff Policy

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Monitorar tarifa efetiva (Camex/Gecex) | A | R | R | C | I | — | — | C |
| Cost review (aumento ≥ 5pp) | A | R | R | C | — | — | — | C |
| Decisão de nacionalização acelerada | A | R | C | C | — | R | R | C |
| Advocacy Camex (pedido de exemption) | A | R | — | C | — | R | — | C |
| Revisão de pricing (margin compression) | A | R | R | C | — | — | R | — |
| Duplo cost-shock: FX + tariff response | A | R | R | C | — | — | R | R |

**Justificativa S10**:
- **Approver (R para nacionalização/advocacy)**: Camex/MDIC aprovam exemption e validam nacionalização
- **RiskOwner (R para cost review)**: Valida impacto de tariff increase no VaR
- **Advisor (R para duplo shock)**: Consultores de trade policy orientam resposta
- **Executor (R para pricing)**: Head Marketing ajusta preços em resposta a tariff

### 4.11 S11 · Competition

| Decisão | Sponsor | DecisionMaker | RiskOwner | Analyst | Monitor | Approver | Executor | Advisor |
|---|---|---|---|---|---|---|---|---|
| Análise competitiva trimestral (5 players) | A | R | — | R | I | — | — | C |
| Game theory: resposta a guerra de preço | A | R | C | R | — | — | — | R |
| Monitorar capacidade agregada vs demanda | A | R | R | C | I | — | — | C |
| Decisão de diferenciação (não-preço) | A | R | — | R | — | — | R | C |
| Recomendação de pricing competitivo | A | R | C | R | — | — | R | C |
| Alerta de price war iminente | A | R | R | C | R | — | — | — |

**Justificativa S11**:
- **Analyst (R para game theory)**: CSO/Head Competitive Strategy calculam Nash equilibrium e respostas
- **Advisor (R para resposta competitiva)**: Consultores de estratégia lideram game theory analysis
- **RiskOwner (R para alerta)**: Valida probabilidade de price war e triggers
- **Monitor (R para capacidade)**: Head ESG/Compliance monitora sinais competitivos

---

## 5. RACI por Nível de $ (Approval Gates)

### 5.1 Thresholds & Aprovador Único

| Faixa de gasto (R$) | Aprovador único | SLA | Documentação requerida |
|---|---|---|---|
| **R$ 0 - 50k** | Analyst + RiskOwner | 24h | Email approval + rationale |
| **R$ 50k - 1M** | Analyst (CSO) | 24h | Memo 1 página + KPI |
| **R$ 1M - 10M** | DecisionMaker (CFO) | 48h | Business case + risk assessment |
| **R$ 10M - 30M** | DecisionMaker (CEO) | 72h | Business case + NPV + sensitivity |
| **R$ 30M - 50M** | DecisionMaker + Sponsor | 1 semana | Business case + NPV + sensitivity + sign-off |
| **R$ 50M - 100M** | Sponsor (Audit Committee) | 2 semanas | Full business case + NPV + counterfactual + RACI |
| **R$ 100M - 280M** | Sponsor (Full Board) | 3 semanas | Full business case + external review + NPV |
| **R$ 280M - 500M** | Sponsor + Board global | 4 semanas | Full + external advisor + legal review |
| **R$ 500M+** | Sponsor + Board global + HQ China | 6 semanas | Full + HQ China sign-off + divestiture analysis |

### 5.2 Quorum Rules (Decisões Colegiadas)

| Faixa | Aprovadores requeridos | Quorum mínimo |
|---|---|---|
| R$ 50M - 100M | Audit Committee (3 membros) | 2/3 |
| R$ 100M - 280M | Board (5-7 membros) | 4/5 (incluindo CEO) |
| R$ 280M - 500M | Board + 1 representante HQ China | 5/7 (incluindo HQ) |
| R$ 500M+ | Board global + HQ China + CEO + CFO | 6/9 (unanimity for wind-down) |

**Regra de unanimidade**: wind-down do programa requer unanimidade de Board global + HQ China. Sem unanimidade, programa continua em modo tensão até próxima revisão trimestral.

### 5.3 Approval Gates (Gates que Travam o Playbook)

| # | Gate | Threshold | Se não cumprido |
|---|---|---|---|
| **G1** | RiskOwner nombrado | Existe pessoa designada | Framework não pode operar; Analyst acumula |
| **G2** | Taxa de desconto ajustada a risco soberano definida | Conselho aprova valor | NPV layer em standby; usar 13% nominal como fallback |
| **G3** | Threshold composite ≥ 88 validado | Conselho aprova valor | Usar 85 como fallback |
| **G4** | Approval authority matrix aprovado | Conselho aprova RACI | Escalar todas as decisões R$ 10M+ para DecisionMaker |
| **G5** | Contrapartes hedge confirmadas (4 banks) | BTG/Itaú/Bradesco/Santander comprometidos | Hedge trava em 1-2 contrapartes (concentration risk) |
| **G6** | CATL LP 70% assinado | Contrato executado | Risco de supply shift para EVE-only (capex +R$ 100M) |
| **G7** | BNDES funding partial (R$ 1.5bi) | Funding aprovado em cronograma | S3 vira Continuidade ou pior; trigger Tree #7-12 |
| **G8** | Status ESG válido (S7) | Lista suja resolvida OU plano de remediação aprovado | Kill switch ativo; capex bloqueado |

---

## 6. Conflict Resolution & Escalation

### 6.1 Quando há Conflito entre R e A

| Step | Ação | SLA |
|---|---|---|
| 1 | R e A tentam resolver em 1:1 | 24h |
| 2 | Escalation para Analyst (C) como mediador | 48h |
| 3 | Se não resolvido, escalation para DecisionMaker | 72h |
| 4 | Decisão final DecisionMaker (vinculante) | 1 semana |

### 6.2 Quando R e A Concordam, mas Advisor/Executor Discordam

| Step | Ação | SLA |
|---|---|---|
| 1 | Advisor apresenta evidência em 24h | 24h |
| 2 | Se R e A mantêm posição: rebaixar para I (não bloqueia) | 48h |
| 3 | Dissent registrado no action register; revisado em quarterly | contínua |

### 6.3 Quando Gate G1-G8 Dispara Impasse

| Step | Ação | SLA |
|---|---|---|
| 1 | Analyst + RiskOwner apresentam gap report ao DecisionMaker | 48h |
| 2 | DecisionMaker aprova plano de remediação | 1 semana |
| 3 | Sponsor aprova contingência (se > R$ 100M) | 3 semanas |
| 4 | Plano de remediação vira parte permanente do playbook | contínua |

### 6.4 Quando Override de Composite é Necessário

| Step | Ação | SLA |
|---|---|---|
| 1 | RiskOwner declara kill switch ativo | Imediato |
| 2 | Analyst força reclassificação (mesmo com composite baixo) | 1h |
| 3 | DecisionMaker valida reclassificação (assinatura) | 4h |
| 4 | Action set entra em vigor | Imediato |

---

## 7. Decision Calendar (Cadência de Revisão)

| Decisão | Cadência | Owner (R) | Approver | Próxima revisão |
|---|---|---|---|---|
| Composite score (11 dimensões) | Mensal (cluster 1), Semanal (cluster 2), Diário (cluster 3) | Analyst | DecisionMaker | contínua |
| Stress test (12 combinações) | Trimestral | RiskOwner | DecisionMaker | Q3 2026, Q4 2026 |
| Recalibração empírica (σ, VaR, h*) | Trimestral | Analyst + RiskOwner | DecisionMaker | contínua |
| Approval matrix (este documento) | Anual | Analyst | Sponsor | Q1 2027 |
| NPV layer (atualização de benefit) | Trimestral | Analyst + DecisionMaker | DecisionMaker | contínua |
| Action register (status, KPI) | Mensal | Analyst | DecisionMaker | contínua |
| S7 ESG status (kill switch) | Mensal / contínuo | Monitor | Sponsor | contínua |
| S8 Production ramp review | Trimestral | Executor | DecisionMaker | Q3 2026 |
| S9 Demand projection | Trimestral | Analyst | DecisionMaker | Q3 2026 |
| S10 Tariff monitoring | Mensal | RiskOwner | DecisionMaker | contínua |
| S11 Competitive analysis | Trimestral | Analyst | DecisionMaker | Q3 2026 |
| Workshop Conselho (D3) | Trimestral | Analyst | DecisionMaker | Q3 2026 |
| Board review (D3 quarterly) | Trimestral | DecisionMaker | Sponsor | contínua |

---

## 8. Limitações & Próximos Passos

### 8.1 Limitações Atuais

1. **Pessoas não nomeadas**: este documento assume DecisionMaker, RiskOwner, Analyst, Monitor existem. Se não, quem assume?
2. **Board global + HQ China**: dependência de governance BYD global — pode atrasar decisões em janelas críticas
3. **Quorum rules rígidos**: podem ser inflexíveis em janelas de crise (exige revisão ad-hoc)
4. **S7 ESG dependency**: kill switch S7 bloqueia todas as outras decisões se ativo
5. **CATL dependency**: kill switch G6 ainda não validado em contrato real
6. **BNDES dependency**: kill switch G7 ainda não testado em cenário real

### 8.2 Próximos Passos

| Quando | O quê | Owner |
|---|---|---|
| **Q3 2026 (wk 1)** | Validar RACI com Conselho (workshop 1h) | Analyst |
| **Q3 2026 (wk 2)** | Nomear RiskOwner formalmente | DecisionMaker + Sponsor |
| **Q3 2026 (wk 3)** | Aprovar approval matrix (este doc) | Sponsor |
| **Q3 2026 (wk 4)** | Iniciar Q3 com D3 v0.6 + RACI v0.6 | Analyst + DecisionMaker |
| **Q4 2026** | Audit interno (RACI compliance) | RiskOwner + Monitor |
| **Q1 2027** | Recalibração anual (atualizar RACI para lições aprendidas) | Analyst |
| **Q2 2027+** | Integração com Board global BYD (alinhamento governance) | DecisionMaker + Sponsor |

---

## 9. Versão HTML Embbebedable

Abaixo, versão HTML com CSS inline para embed em relatórios ou portais:

```html
<!-- D3-RACI Matrix v0.6 — Inline CSS for embedding -->
<style>
.raci-table{width:100%;border-collapse:collapse;font-family:Inter,system-ui,sans-serif;font-size:13px}
.raci-table th,.raci-table td{padding:8px 10px;border:1px solid #262b35;text-align:center}
.raci-table th{background:#161a21;color:#b0b6c2;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.raci-table td{background:#0e1014;color:#e6e8ec}
.raci-table tr:hover td{background:#1a1f2a}
.raci-a{color:#6b95f0;font-weight:700}
.raci-r{color:#4ade80;font-weight:700}
.raci-c{color:#e0a45e}
.raci-i{color:#7a818f}
.raci-dim{text-align:left;font-weight:600;background:#161a21!important;color:#e6e8ec}
</style>

<table class="raci-table">
  <thead>
    <tr>
      <th>Dimensão</th>
      <th>Sponsor</th>
      <th>DecisionMaker</th>
      <th>RiskOwner</th>
      <th>Analyst</th>
      <th>Monitor</th>
      <th>Approver</th>
      <th>Executor</th>
      <th>Advisor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="raci-dim">S1 FX / Hedge</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S2 Supply Chain</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S3 BNDES / ViE</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S4 Pricing / Defensivo</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S5 Partnerships / LP</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
    </tr>
    <tr>
      <td class="raci-dim">S6 Triggers / Macro</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
    </tr>
    <tr style="background:rgba(255,107,99,0.08)">
      <td class="raci-dim" style="color:#ff6b63">S7 ESG (kill switch)</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
    </tr>
    <tr>
      <td class="raci-dim">S8 Production Ramp</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S9 Demand Planning</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-c">C</td>
    </tr>
    <tr>
      <td class="raci-dim">S10 Tariff Policy</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-c">C</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-r">R</td>
    </tr>
    <tr>
      <td class="raci-dim">S11 Competition</td>
      <td class="raci-a">A</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-r">R</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-i">I</td>
      <td class="raci-c">C</td>
    </tr>
  </tbody>
</table>
<p style="font-size:11px;color:#7a818f;margin-top:8px">
  <strong>Legenda:</strong> <span class="raci-a">A</span>=Accountable · <span class="raci-r">R</span>=Responsible · <span class="raci-c">C</span>=Consulted · <span class="raci-i">I</span>=Informed · D3-RACI.md v0.6 · 21/jul/2026
</p>
```

---

## 10. Resumo Executivo

**O que este doc resolve**: o D3-MAIN.html v0.6 define 11 dimensões e 12 decision trees, mas não diz quem decide o quê. Este documento preenche:

1. **8 papéis definidos** (Sponsor, DecisionMaker, RiskOwner, Analyst, Monitor, Approver, Executor, Advisor)
2. **RACI por dimensão** (S1-S11): 80+ decisões mapeadas com R, A, C, I explícitos
3. **Approval gates** (9 níveis de $): quem aprova R$ 0-50k até R$ 500M+
4. **8 kill gates** (G1-G8): travas do playbook se prerequisitos não cumpridos (incluindo S7 ESG)
5. **Escalation paths**: 4 chains (R-A conflict, R-A vs Advisor, gate failure, composite override)
6. **Versão HTML embedded**: tabela com CSS inline para replicação em portais

**Decisões pendentes do Conselho**:
- **Quem é o DecisionMaker (CFO)?** Sem essa definição, framework trava em G1
- **Quem é o RiskOwner?** Sem isso, hedge sizing fica sem dono
- **Quem é o Analyst (CSO)?** Sem isso, composite score não tem dono
- **Quem é o Monitor (Head ESG/Compliance)?** Papel novo, crítico para S7
- **Qual a taxa de desconto ajustada a risco soberano?** Afeta todos os NPV (gate G2)
- **S7 ESG kill switch**: BYD está na lista suja MTE desde 07/abr/2026 — ação imediata requerida

**Próximo passo imediato**: validar este RACI com Conselho + CEO + CFO + Heads funcionais em workshop de 1h.

**Custo deste documento**: zero (apenas alinhamento de pessoas e processos existentes).

---

*Arquivo: D3-RACI.md · Versão: v0.6 · Data: 21/jul/2026 · Projeto: BYD Camaçari 2025-2027*
