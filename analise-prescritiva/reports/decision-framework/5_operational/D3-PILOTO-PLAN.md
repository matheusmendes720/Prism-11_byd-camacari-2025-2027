# D3 — Piloto End-to-End Plan (T2.4)

**Documento de design operacional** · Define escopo, success criteria, go/no-go gates e rollout do piloto do framework D3
**Data**: 21/jul/2026
**Status**: Design plan · pronto para execução (Q4 2026)
**Phase 2 — T2.4**

---

## 1. Objetivo

Validar o framework D3 <strong>end-to-end</strong> em ambiente controlado antes de ativar em produção. O piloto testa:

1. <strong>Auto-trigger system</strong> (T2.1) — feed ingestion, signal calculation, rule evaluation, notification
2. <strong>NPV live layer</strong> (T2.2) — NPV recalc, sensitivity update, ranking
3. <strong>Decision trees + RACI</strong> (T1.3, T1.4) — playbook execution, approval flow, audit trail
4. <strong>Composite score + cluster classification</strong> — trigger mudança de cluster corretamente

**Por que piloto antes de produção**:
- Validar <strong>accuracy</strong> dos triggers (≥ 80% true positive)
- Validar <strong>latency</strong> (≤ 5 min signal-to-action)
- Validar <strong>usabilidade</strong> (CFO + CSO conseguem usar sem treinamento extensivo)
- Validar <strong>audit trail</strong> (compliance OK)
- Identificar <strong>edge cases</strong> antes de ativar em ambiente crítico

---

## 2. Escopo do piloto

### 2.1 In scope

| Componente | Teste | Duração |
|---|---|---|
| <strong>Data feeds</strong> | BCB PTAX, MDIC, ANFAVEA, BNDES, BYD internal | 4 semanas |
| <strong>Signal layer</strong> | 6 signals (S1-S6) calculados corretamente | 4 semanas |
| <strong>Trigger engine</strong> | 30+ regras, backtesting com 5 anos de dados | 2 semanas |
| <strong>NPV calculator</strong> | 4 prescrições, 96 cenários de sensitivity | 2 semanas |
| <strong>Dashboard</strong> | D3-ANNEX.html v2 com 5 cards + heatmap | 2 semanas |
| <strong>Decision trees</strong> | 12 árvores × 4 overlays executam via RACI | 2 semanas |
| <strong>Audit trail</strong> | 100% de mudanças registradas | 4 semanas |

### 2.2 Out of scope (Phase 3+)

- Game theory layer (T3.3)
- Recalibração D2 v2 (T3.4)
- Integração com BYD global Board (T4.4)
- Mobile app (T4.5)

### 2.3 Duração total

<strong>8 semanas</strong> (Q4 2026 wk 9-16), alinhado com Phase 2 timeline.

---

## 3. Ambientes

### 3.1 3 ambientes separados

| Ambiente | Propósito | Dados | Uptime SLA |
|---|---|---|---|
| <strong>DEV</strong> | Desenvolvimento + unit tests | Synthetic (mock BCB, lítio) | 95% (best effort) |
| <strong>STAGING</strong> | Integration + UAT | Real feeds (BCB, MDIC, ANFAVEA) mas read-only | 99% |
| <strong>PROD (piloto)</strong> | Piloto real (este plano) | Real feeds + write to real systems (com approval gate) | 99.5% |

### 3.2 Piloto = PROD com flag

Piloto opera em <strong>PROD</strong> mas com:
- <strong>Approval gate obrigatório</strong>: toda ação de trigger engine exige aprovação humana antes de executar
- <strong>Shadow mode</strong>: roda em paralelo ao sistema manual (CSO continua monitorando); piloto é "second opinion"
- <strong>Rollback fácil</strong>: kill switch global permite desativar piloto em ≤5 min

---

## 4. Métricas de sucesso (KPIs)

### 4.1 Accuracy metrics

| Métrica | Target | Hard fail |
|---|---|---|
| <strong>True positive rate</strong> (trigger correto) | ≥ 80% | < 60% |
| <strong>False positive rate</strong> (trigger incorreto) | ≤ 5% | > 15% |
| <strong>False negative rate</strong> (trigger perdido) | ≤ 2% | > 10% |
| <strong>Composite accuracy</strong> (cluster assignment) | ≥ 90% | < 70% |

### 4.2 Latency metrics

| Métrica | Target | Hard fail |
|---|---|---|
| <strong>Data ingestion latency</strong> (BCB → signal update) | ≤ 5 min | > 10 min |
| <strong>Trigger-to-notification</strong> (signal change → Slack/Email) | ≤ 1 min | > 5 min |
| <strong>NPV recalc latency</strong> (96 cenários) | ≤ 5 min | > 10 min |
| <strong>API response time</strong> (P95) | ≤ 1s | > 3s |
| <strong>Dashboard refresh</strong> | ≤ 60s | > 5 min |

### 4.3 Usability metrics

| Métrica | Target | Como medir |
|---|---|---|
| <strong>CSO time savings</strong> | ≥ 5h/semana | Self-reported + activity log |
| <strong>CFO satisfaction</strong> | ≥ 8/10 | Survey (1-10) |
| <strong>Decision accuracy</strong> (decisões tomadas com piloto) | ≥ 85% (sem rollback) | Audit trail |
| <strong>False alarm fatigue</strong> | ≤ 1 evento/semana de "ignore" | Notification log |

### 4.4 Compliance metrics

| Métrica | Target | Hard fail |
|---|---|---|
| <strong>Audit trail completeness</strong> | 100% (toda mudança registrada) | < 99% |
| <strong>RACI compliance</strong> | 100% (toda decisão tem R, A, C, I) | < 95% |
| <strong>Approval gate adherence</strong> | 100% (nenhuma ação sem aprovação) | < 99% |
| <strong>Kill switch time</strong> (desativar piloto) | ≤ 5 min | > 30 min |

---

## 5. Plano de testes (8 semanas)

### 5.1 Semana 1-2: Infraestrutura + Data feeds

| Dia | Atividade | Deliverable | Owner |
|---|---|---|---|
| D1-2 | Setup AWS (3 ambientes) | Terraform scripts, accounts criados | Eng. senior |
| D3-4 | BCB PTAX ingestion (intraday 4×/dia) | Cron job funcionando, latency testada | Eng. pleno |
| D5-7 | MDIC + ANFAVEA ingestion (daily) | 2 feeds funcionando | Eng. pleno |
| D8-10 | BYD internal + BNDES (weekly) | 2 feeds funcionando | Eng. senior |
| D11-14 | Staging deploy + smoke test | Sistema em staging com 5 feeds | Eng. senior |

**Success criteria**: 5 feeds em staging, latency ≤ 10 min, sem erros por 7 dias consecutivos.

### 5.2 Semana 3-4: Signal layer + NPV calculator

| Dia | Atividade | Deliverable | Owner |
|---|---|---|---|
| D15-17 | S1 signal (PTAX vol 30d) | Função validada contra dados históricos | Risk Officer |
| D18-20 | S2-S5 signals | 4 signals validados | CSO + Heads |
| D21-22 | S6 composite (weighted average) | Cluster assignment correto | CSO |
| D23-25 | NPV calculator (4 prescrições) | 4 funções validadas contra D3-ANNEX | CFO |
| D26-28 | Sensitivity engine (96 cenários) | Heatmap gerado para todas as prescrições | Risk Officer |

**Success criteria**: 6 signals calculando, 4 NPV functions com delta ≤ 5% vs D3-ANNEX, sensitivity heatmap funcional.

### 5.3 Semana 5-6: Trigger engine + Dashboard

| Dia | Atividade | Deliverable | Owner |
|---|---|---|---|
| D29-31 | 30+ regras em YAML | Rules file + tested in staging | Risk Officer |
| D32-34 | Backtesting (5 anos dados) | Relatório accuracy ≥ 80% | Risk Officer |
| D35-37 | Notification layer (Slack + Email + SMS) | Multi-canal funcionando | Eng. pleno |
| D38-40 | Dashboard integration (D3-ANNEX.html v2) | 5 cards + heatmap + recommendation box | Eng. senior |
| D41-42 | UAT (CSO + CFO + Risk Officer) | Sign-off por todas as personas | CSO |

**Success criteria**: triggers com accuracy ≥ 80%, notification latency ≤ 60s, dashboard carrega em ≤ 2s, UAT aprovado.

### 5.4 Semana 7-8: Piloto PROD + RACI flow

| Dia | Atividade | Deliverable | Owner |
|---|---|---|---|
| D43-44 | Piloto go-live (com approval gate) | Sistema em PROD, shadow mode | CSO |
| D45-50 | 5 cenários sintéticos injetados (1 por cluster) | Trigger executado corretamente | CSO + CFO |
| D51-53 | RACI flow testado (CSO → CFO → CEO → Board) | Approval flow funcionando | CSO + CEO |
| D54-55 | Audit trail revisão (100% compliance) | Compliance report | Risk Officer |
| D56 | Go/no-go decision | Aprovação para scale-up | CEO + Board |

**Success criteria**: 5 cenários sintéticos triggaram corretamente, RACI flow testado em todos os níveis, audit trail 100% compliance, go/no-go aprovado.

---

## 6. Cenários sintéticos para piloto (5 testes)

### 6.1 Cenário 1 — Expansão + S6 GREEN (cluster 1)

**Setup**: Injetar dados sintéticos que produzem S3=Expansão (ViE=25%) + S6=GREEN (PTAX vol 12%, IPCA 4%).

**Resultado esperado**:
- Composite = 58 (cluster 1)
- Trigger engine: <strong>nenhuma ação</strong> (cluster 1 = baseline)
- CSO recebe notificação "Daily status: GREEN, no action"
- CFO vê NPV: hedge 30% (R$ 1.165bi), defensivo R$ 0M, advocacy R$ 0M

**Success criteria**: trigger NÃO dispara ação (porque cluster 1 = baseline), CSO recebe daily status corretamente.

### 6.2 Cenário 2 — Continuidade + S6 AMBER (cluster 2)

**Setup**: S3=Continuidade (ViE=18%) + S6=AMBER (PTAX vol 18%, IPCA 5%).

**Resultado esperado**:
- Composite = 78 (cluster 2)
- Trigger engine: <strong>dispara ação de tensão</strong> (hedge resize 47%, defensivo Tier 2)
- CSO + CFO recebem notificação "Cluster changed to 2, recommend hedge 47%"
- Approval flow: CSO propõe → CFO aprova (R$ 65M cost) → ação executa (hedge redimensionado, defensivo Tier 2 ativado)

**Success criteria**: trigger dispara, notification enviada, approval flow completo, ação executada, audit trail registra 4 eventos.

### 6.3 Cenário 3 — RB Parcial + S6 AMBER (cluster 2)

**Setup**: S3=RB Parcial (ViE=10%) + S6=AMBER (PTAX vol 20%, lítio US$30k).

**Resultado esperado**:
- Composite = 85 (cluster 2, perto da fronteira)
- Trigger engine: <strong>dispara targeted + bridge preventivo</strong>
- CEO entra no approval flow (CFO → CEO)
- Ação: hedge 73%, defensivo Tier 2-3, EVE acceleration

**Success criteria**: trigger dispara, escalation CSO → CFO → CEO funciona, ação executada, audit trail 5+ eventos.

### 6.4 Cenário 4 — RB Parcial + S6 RED (cluster 3, modo crise)

**Setup**: S3=RB Parcial + S6=RED (PTAX vol 25%, lítio US$60k).

**Resultado esperado**:
- Composite = 95 (cluster 3, MODO CRISE)
- Trigger engine: <strong>dispara modo crise</strong> (Tree #9)
- <strong>Board global + HQ China</strong> entram no approval flow
- Ação: hedge 88%, dual-sourcing emergency, bridge R$ 800M, defensivo Tier 3, freeze despesas

**Success criteria**: trigger dispara, escalation até Board global, bridge aprovado, ação executada, audit trail 8+ eventos.

### 6.5 Cenário 5 — Kill switch (override de composite)

**Setup**: Composite 65 (cluster 1) mas PTAX shock → vol 35% por 5 dias consecutivos.

**Resultado esperado**:
- Composite = 65 (cluster 1) MAS kill switch PTAX ativo
- Trigger engine: <strong>force cluster 2</strong> (override)
- Notification: "KILL SWITCH: PTAX vol 35% > 30% threshold. Force cluster 2."
- CSO + CFO + CEO + Risk Officer recebem

**Success criteria**: kill switch override funciona, mesmo com composite baixo, notification enviada para todos, action set cluster 2 entra em vigor.

---

## 7. Go/no-go criteria (decisão final)

### 7.1 Go criteria (todos devem ser TRUE)

- [ ] Accuracy ≥ 80% (true positive), ≤ 5% (false positive), ≤ 2% (false negative)
- [ ] Latency ≤ 5 min (signal-to-action) para ≥ 95% dos triggers
- [ ] UAT aprovado por CSO + CFO + Risk Officer + CEO
- [ ] Audit trail 100% compliance (todas mudanças registradas)
- [ ] RACI flow testado em 4 níveis (CSO, CFO, CEO, Board)
- [ ] Rollback testado (kill switch ≤ 5 min)
- [ ] 5 cenários sintéticos executados corretamente
- [ ] Documentação operacional completa (runbook, troubleshooting)
- [ ] Custos dentro do orçamento (≤ R$ 360k ano 1 T2.1 + R$ 132k T2.2 = R$ 492k total)

### 7.2 No-go criteria (qualquer um = NO-GO)

- [ ] Accuracy < 60% (sistema não confiável)
- [ ] Latency > 10 min para ≥ 10% dos triggers
- [ ] Audit trail < 99% compliance
- [ ] Custo > 1.5× orçamento
- [ ] Falha em kill switch (não desativa em ≤ 30 min)
- [ ] CSO ou CFO vetam explicitamente

### 7.3 Decisão

- <strong>GO</strong>: CSO + CFO + CEO + Board aprovam scale-up (Phase 3, Q1 2027)
- <strong>NO-GO</strong>: voltar para DEV, corrigir gaps, re-pilotar em Q1 2027

---

## 8. Rollout pós-piloto (se GO)

### 8.1 Phase 3 scale-up (Q1 2027, 12 semanas)

| Semana | Atividade |
|---|---|
| W1-2 | Game theory layer (T3.3) |
| W3-4 | D2 v2 recalibração (T3.4) |
| W5-8 | Sensitivity live + heatmap interativo |
| W9-10 | Mobile dashboard (CSO on-the-go) |
| W11-12 | Integração com BYD global Board |

### 8.2 Phase 4 ongoing (Q2 2027+)

- Learning loop trimestral
- Recalibração semestral
- Stress test anual integrado
- Revisão anual do framework (D3 v2?)

---

## 9. Riscos do piloto & mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| <strong>Feed outage</strong> (BCB fora do ar 24h) | Média | Médio | Fallback para proxy feeds; manual override CSO |
| <strong>False positive excessivo</strong> (triggers dispara sem necessidade) | Alta | Baixo | Cooldown 24h; CSO review antes de executar |
| <strong>CEO indisponível</strong> para approval em cluster 2 | Média | Médio | Backup approver (CFO + Head Strategy) por 30 dias |
| <strong>CFO override</strong> (rejeita todas as recomendações) | Baixa | Alto | Pilot metrics: se rejeição > 50%, recalibrar thresholds |
| <strong>Audit trail gap</strong> (1 evento perdido) | Baixa | Alto | S3 WORM + checksum diário; external auditor review |
| <strong>Piloto scope creep</strong> (adicionar features durante piloto) | Alta | Médio | Change control: CSO approval para qualquer adição |

---

## 10. Custos do piloto

### 10.1 Infra (já incluído em T2.1 + T2.2)

- AWS 3 ambientes: R$ 3.500/mês
- Storage + compute extra: R$ 1.000/mês
- <strong>Total infra piloto (8 semanas)</strong>: ~R$ 8k

### 10.2 Pessoas (allocated)

- Eng. senior: 50% alocado por 8 semanas = R$ 30k
- Eng. pleno: 50% alocado por 8 semanas = R$ 17k
- CSO + CFO + Risk Officer: 10% alocado por 8 semanas = R$ 40k
- QA: 25% alocado por 4 semanas = R$ 10k
- <strong>Total pessoas piloto</strong>: ~R$ 97k

### 10.3 Total piloto

<strong>R$ 105k</strong> (infra R$ 8k + pessoas R$ 97k).

Adicionado ao T2.1 (R$ 295-360k) + T2.2 (R$ 132k), total Phase 2 = <strong>R$ 532-597k ano 1</strong>.

---

## 11. Critérios de aceitação finais (deliverable acceptance)

Para T2.4 ser considerado "done":

- [ ] 8 semanas de execução sem incidentes críticos
- [ ] 5 cenários sintéticos executados com success criteria cumprido
- [ ] 4 go criteria TRUE (accuracy, latency, UAT, audit, RACI, rollback, costs)
- [ ] 0 no-go criteria TRUE
- [ ] Decisão GO formal por CEO + Board
- [ ] Documentação final: runbook operacional + troubleshooting + RACI flow + decision log
- [ ] Plano de Phase 3 aprovado
- [ ] Custos dentro do orçamento (≤ R$ 105k piloto + R$ 492k T2.1+T2.2)

---

## 12. Resumo executivo (1 página)

<strong>O que este plano resolve</strong>: o framework D3 tem 5 camadas, 12 decision trees, 31 ações, 6 recalibrações. Mas como sabemos que <strong>funciona em produção</strong>? Este plano define:

1. <strong>Escopo do piloto</strong> (in/out of scope, 8 semanas)
2. <strong>3 ambientes</strong> (DEV, STAGING, PROD com approval gate)
3. <strong>KPIs de sucesso</strong> (accuracy ≥ 80%, latency ≤ 5 min, audit 100%)
4. <strong>Plano de testes</strong> semana-a-semana (5 cenários sintéticos no final)
5. <strong>Go/no-go criteria</strong> (9 go + 6 no-go, decisão CEO + Board)
6. <strong>Rollout pós-piloto</strong> (Phase 3 Q1 2027, Phase 4 ongoing)

<strong>Por que piloto é crítico</strong>:
- Validar <strong>accuracy</strong>: triggers corretos em ≥ 80% dos casos
- Validar <strong>latency</strong>: ≤ 5 min entre signal change e action (vs horas/dias manual)
- Validar <strong>audit trail</strong>: 100% compliance (regulatory requirement)
- Identificar <strong>edge cases</strong>: 5 cenários sintéticos cobrem 90% dos casos reais
- <strong>ROI</strong>: 1 trigger correto em cluster 3 (modo crise) economiza ~R$ 50-100M vs erro humano. Piloto custa R$ 105k → payback em ~1 mês.

<strong>Investimento</strong>: R$ 105k (8 semanas) + T2.1 R$ 295-360k + T2.2 R$ 132k = <strong>R$ 532-597k ano 1</strong>.

<strong>Próximo passo</strong>: aprovar este plan com CSO + CFO + CEO → abrir sprint planning (Q4 2026 wk 9) → executar piloto em 8 semanas → decisão GO/NO-GO no fim.
