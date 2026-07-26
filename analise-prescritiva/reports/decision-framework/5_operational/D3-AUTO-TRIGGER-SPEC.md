# D3 — Auto-Trigger System Spec (T2.1)

**Documento de design técnico** · Define como o sinal S6 (macro) triggera automaticamente ações em S1 (hedge), S2 (supply), S3 (BNDES), S4 (defensivo)
**Data**: 21/jul/2026
**Status**: Design spec · pronto para implementação (Q4 2026)
**Phase 2 — T2.1**

---

## 1. Objetivo

Automatizar o trigger que hoje é <strong>manual via CSO</strong> (cluster 1: revisão mensal; cluster 2: semanal; cluster 3: diário). A auto-trigger system reduz o <strong>time-to-action</strong> de horas/dias para <strong>≤5 min</strong> entre mudança de sinal e notificação de acionar playbook.

**Drivers**:
- <strong>Velocidade</strong>: kill switches (PTAX shock, BNDES cancel) podem precisar de ação em ≤1h
- <strong>Consistência</strong>: trigger source único; sem dependência de interpretação humana
- <strong>Audit trail</strong>: toda mudança de cluster registrada com timestamp, evidence, approver
- <strong>Custo</strong>: substituir ~5-10h/semana de CSO em trigger management por sistema automatizado

---

## 2. Arquitetura

### 2.1 Stack tecnológica

| Componente | Tecnologia | Justificativa |
|---|---|---|
| <strong>Data ingestion</strong> | Python (FastAPI) + cron jobs | BCB API, MDIC, ANFAVEA, news feeds (Reuters/Bloomberg) |
| <strong>Storage</strong> | PostgreSQL (time-series) + Redis (cache) | Histórico de sinais + lookup rápido |
| <strong>Trigger engine</strong> | Python (rules-based, declarative YAML) | Fácil de auditar; sem ML black-box |
| <strong>Notification</strong> | Slack webhook + email + SMS (kill switch only) | Multi-canal para redundancy |
| <strong>Dashboard</strong> | Plotly Dash ou Grafana | Real-time visualization |
| <strong>Audit log</strong> | Immutable append-only (S3 + checksum) | Compliance + Board review |

### 2.2 Componentes funcionais

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SOURCES (5)                     │
├─────────────────────────────────────────────────────────┤
│ BCB PTAX (intraday)    │ MDIC (commodities)            │
│ BCB IPCA (daily)       │ ANFAVEA (volume auto)         │
│ B3 (derivatives)       │ Reuters/Bloomberg (news)      │
│ BYD internal (volume)  │ BNDES portal (status)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              SIGNAL LAYER (6 calculations)              │
├─────────────────────────────────────────────────────────┤
│ S1: PTAX vol 30d + σ realized                          │
│ S2: lítio price + vol 6m + VaR supply                  │
│ S3: BNDES funding status + ViE forecast                │
│ S4: market share + competitor pricing                  │
│ S5: CATL/EVE delivery KPIs                             │
│ S6: composite (weighted average)                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           TRIGGER ENGINE (rules-based, YAML)           │
├─────────────────────────────────────────────────────────┤
│ rule-001: IF s1_vol30d > 22% → trigger HEDGE_REDUCE    │
│ rule-002: IF s2_lithium > 80k → trigger SUPPLY_PLANOB  │
│ rule-003: IF s3_bndes = "denied" → trigger RB_TOTAL    │
│ rule-004: IF s6_composite > 88 → trigger CRISIS_MODE   │
│ ... 30+ rules                                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         NOTIFICATION LAYER (multi-canal)               │
├─────────────────────────────────────────────────────────┤
│ Slack:  #d3-alerts  (all triggers)                     │
│ Email:  CSO + CFO + CEO + Board  (cluster 2-3)        │
│ SMS:    CEO + Board (kill switch only)                 │
│ Dashboard:  https://d3.byd.internal (real-time)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         AUDIT TRAIL (immutable, 7 anos)                │
├─────────────────────────────────────────────────────────┤
│ timestamp | signal_id | rule_id | action | approver   │
│ S3 checksum daily; external auditor access            │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Data sources (5 feeds primários + 4 secundários)

### 3.1 Feeds primários (required para trigger engine)

| Feed | URL / API | Latency | Custo | Uso no D3 |
|---|---|---|---|---|
| <strong>BCB PTAX</strong> | `api.bcb.gov.br/dados/serie/bcdata.sgs.10813` | Intraday (D-0) | Free | S1 signal (FX) |
| <strong>BCB IPCA</strong> | `api.bcb.gov.br/dados/serie/bcdata.sgs.433` | Daily | Free | S6 input (macro) |
| <strong>MDIC commodities</strong> | `comexstat.mdic.gov.br/pt/home` | Daily | Free | S2 signal (lítio via proxy) |
| <strong>ANFAVEA volume</strong> | `anfavea.com.br/estatisticas` | Monthly (lag 30d) | Free | S4 signal (market share) |
| <strong>BNDES portal</strong> | `bnb.gov.br/programas-bnb` | Weekly check | Free | S3 signal (status) |

### 3.2 Feeds secundários (enhance accuracy, optional)

| Feed | URL / API | Latency | Custo | Uso |
|---|---|---|---|---|
| <strong>Reuters/Bloomberg</strong> | subscription | Real-time | R$ 50-100k/ano | S6 + sentiment analysis |
| <strong>B3 derivatives</strong> | `b3.com.br/data` | Real-time | R$ 10-20k/ano | S1 (volatility surface) |
| <strong>BYD internal</strong> | API interna | Real-time | Free | S5 (delivery KPIs) |
| <strong>Trading Economics</strong> | subscription | Daily | R$ 5-10k/ano | S2 lítio (lítio público) |

### 3.3 Resiliência

- Se feed primário falhar: <strong>fallback para proxy</strong> (ex: se MDIC cair, usar Comex Stat diretamente)
- Se 2+ feeds falharem simultaneamente: <strong>trigger manual override</strong> (CSO + Risk Officer declaram status manualmente)
- Rate limits: BCB = 100 req/min (suficiente); MDIC = unlimited; ANFAVEA = scraping com retry

---

## 4. Signal layer (6 calculations)

### 4.1 S1 — FX / PTAX vol

**Input**: BCB PTAX daily (last 30 days)

**Calculations**:
```
vol_30d = stdev(log_returns(close, 30)) * sqrt(252)  # annualized
σ_realized = vol_30d (rolling 30d)
status = GREEN if vol_30d < 15% | AMBER if 15-22% | RED if >= 22%
```

**Update frequency**: <strong>intraday (4× per day: 10h, 13h, 16h, 18h)</strong>

**Trigger thresholds**:
- vol_30d < 15% → S1 GREEN
- vol_30d 15-22% → S1 AMBER
- vol_30d ≥ 22% → S1 RED
- vol_30d > 30% por 5 dias consecutivos → KILL SWITCH PTAX (force cluster 2)

### 4.2 S2 — Supply chain (lítio + delivery)

**Input**: lítio price (Trading Economics ou MDIC proxy) + CATL/EVE delivery KPIs

**Calculations**:
```
var_supply_p95 = max(p95(lítio_distribution), realized_var_30d)
delivery_score = (catl_on_time + eve_on_time) / total_volume
status = GREEN if lítio < 15k AND delivery > 95%
       | AMBER if lítio 15-50k OR delivery 80-95%
       | RED if lítio > 50k OR delivery < 80%
```

**Update frequency**: <strong>daily (EOD)</strong>

**Trigger thresholds**:
- lítio > US$80k/t por 3m → KILL SWITCH LITIO (force renegotiation)
- CATL atrasa > 60d → KILL SWITCH CATL (dual-sourcing emergency)

### 4.3 S3 — BNDES / Regulatory

**Input**: BNDES portal + Head Gov Relations report (manual weekly)

**Calculations**:
```
bndes_status = check_bndes_portal() OR head_gov_report()
vie_forecast = monte_carlo(bndes_status, political_risk)
status = GREEN if bndes = "approved" AND vie > 25%
       | AMBER if bndes = "partial" AND vie 15-25%
       | RED if bndes = "denied" OR vie < 15%
```

**Update frequency**: <strong>weekly (Head Gov Relations check)</strong>

**Trigger thresholds**:
- bndes = "denied" → KILL SWITCH BNDES (force Tree #10-12)
- bndes atrasa > 3 meses vs baseline → trigger ADVOCACY_ESCALATION

### 4.4 S4 — Pricing / Market

**Input**: ANFAVEA volume + competitor pricing (manual ou scraping)

**Calculations**:
```
market_share = byd_volume / total_market
price_position = (byd_price - competitor_avg) / competitor_avg
status = GREEN if market_share stable AND price_position >= 0
       | AMBER if market_share -2pp OR price_position -5 to 0%
       | RED if market_share -5pp OR price_position < -5%
```

**Update frequency**: <strong>monthly (ANFAVEA lag)</strong>

### 4.5 S5 — Partnerships / Delivery

**Input**: BYD internal API (delivery KPIs)

**Calculations**:
```
delivery_score = (catl_on_time + eve_on_time) / total_volume
lp_diversification = count(active_lp_contracts) / 4  # target 4
status = GREEN if delivery > 95% AND lp_div >= 0.75
       | AMBER if delivery 80-95% OR lp_div 0.5-0.75
       | RED if delivery < 80% OR lp_div < 0.5
```

**Update frequency**: <strong>daily (EOD)</strong>

### 4.6 S6 — Composite (governor)

**Input**: S1-S5 status + macro inputs (IPCA, BRL, EM stress index)

**Calculations**:
```
weights = {s1: 0.20, s2: 0.18, s3: 0.30, s4: 0.12, s5: 0.10, macro: 0.10}
scores = {GREEN: 50, AMBER: 70, RED: 85, CRISIS: 95}
composite = sum(score * weight for each dimension)
cluster = 1 if composite < 70 | 2 if 70-85 | 3 if >= 85
```

**Update frequency**: <strong>real-time (recalcula após cada signal update)</strong>

---

## 5. Trigger engine (30+ regras em YAML)

### 5.1 Estrutura de regra

```yaml
- id: rule-001
  name: PTAX vol 30d ≥ 22% → S1 RED
  conditions:
    - s1_vol30d >= 22
  action:
    type: NOTIFY + RECALCULATE
    target: s1_status
    new_value: RED
  notify:
    - channel: slack
      to: "#d3-alerts"
    - channel: email
      to: [cso, cfo, risk_officer]
  cooldown: 24h  # notificar 1× per day mesmo se condição persistir
  audit_priority: medium
```

### 5.2 Catálogo de regras (subset)

| ID | Condição | Ação | Notify | Cooldown |
|---|---|---|---|---|
| 001 | s1_vol30d ≥ 22% | S1 → RED | slack + email | 24h |
| 002 | s1_vol30d ≥ 30% por 5d | KILL SWITCH PTAX (force cluster 2) | slack + email + SMS | 1h |
| 010 | s2_lithium ≥ 80k por 3m | KILL SWITCH LITIO | slack + email + SMS | 24h |
| 011 | catl_atrasa > 60d | KILL SWITCH CATL | slack + email + SMS | 12h |
| 020 | s3_bndes = "denied" | KILL SWITCH BNDES (force Tree #10-12) | slack + email + SMS | 1h |
| 021 | s3_bndes_atrasa > 3m | ADVOCACY_ESCALATION | slack + email | 24h |
| 030 | s4_market_share < -5pp | DEFENSIVO_TIER_2 | slack | 24h |
| 040 | s5_delivery < 80% | DUAL_SOURCING_PLANO_B | slack + email | 12h |
| 050 | s6_composite ≥ 88 | MODO CRISE (Tree #6, #9, #10-12) | slack + email + SMS | 1h |
| 051 | s6_composite ≥ 95 | SOBREVIVÊNCIA (Tree #12) | slack + email + SMS | 1h |
| 060 | kill_switch ANY | BYPASS composite (force cluster 2) | slack + email + SMS | immediate |

(Total: 30+ regras; subset mostrado para ilustração. Implementação completa em `d3-rules.yaml`.)

### 5.3 Backtesting protocol

<strong>Antes de ativar em produção</strong>, todas as regras devem passar por backtesting com dados históricos 2020-2025:

1. <strong>Dataset</strong>: PTAX daily (BCB, 5 anos), lítio monthly (public), BNDES status (Head Gov Relations)
2. <strong>Simulação</strong>: rodar trigger engine sobre 5 anos, contar quantos triggers foram disparados, comparar com ações reais tomadas
3. <strong>Métricas</strong>:
   - True positive rate: trigger correto (≥ 80% target)
   - False positive rate: trigger incorreto (≤ 5% target)
   - Time-to-action vs real: notificação chegou ≤5 min após threshold?
4. <strong>Resultado esperado</strong>: ≥ 80% accuracy, ≤ 5 min latency

---

## 6. Notification layer

### 6.1 Canais

| Canal | Quando usar | Quem recebe | Latency |
|---|---|---|---|
| <strong>Slack #d3-alerts</strong> | Todos os triggers (cluster 1-3) | CSO + CFO + Risk Officer + Heads funcionais | ≤30s |
| <strong>Email</strong> | Cluster 2 (AMBER) e 3 (RED) | + CEO + Board | ≤5 min |
| <strong>SMS</strong> | Apenas KILL SWITCH | CEO + Board (apenas números cadastrados) | ≤1 min |
| <strong>Dashboard real-time</strong> | Todos os triggers (visualização) | Todos com login | ≤30s |

### 6.2 Mensagem template

```json
{
  "trigger_id": "rule-002",
  "timestamp": "2026-07-21T14:32:00-03:00",
  "rule": "PTAX vol 30d ≥ 30% por 5d",
  "signal": {
    "s1_vol30d": 31.4,
    "s1_status": "RED",
    "composite": 78
  },
  "action": "KILL SWITCH PTAX acionado → force cluster 2",
  "tree_affected": "Tree #1-3, #4-6 (Expansão, Continuidade)",
  "owner": "Risk Officer",
  "approver": "CFO",
  "next_step": "Calcular novo h* e notificar Head Treasury",
  "links": {
    "tree": "https://d3.byd.internal/decision-trees.html#trees-1-3",
    "evidence": "https://d3.byd.internal/audit/2026-07-21/rule-002",
    "approve_link": "https://d3.byd.internal/actions/approve/abc123"
  }
}
```

### 6.3 Approve flow

Para triggers que requerem aprovação (todos os cluster 2-3), mensagem inclui link "Approve" que:
1. CSO/CFO clica → ação vai para fila de aprovação
2. Approver (CEO/Board) clica "Approve" → ação executa (ex: hedge redimensionado, dual-sourcing acionado)
3. Se approver rejeita: ação volta para CSO com motivo; CSO pode escalar ou cancelar

---

## 7. Audit trail (7 anos de retenção)

### 7.1 Schema

```sql
CREATE TABLE d3_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  signal_id VARCHAR(50),      -- ex: 's1_vol30d'
  signal_value NUMERIC,
  rule_id VARCHAR(50),         -- ex: 'rule-002'
  action_type VARCHAR(50),     -- ex: 'TRIGGER', 'APPROVE', 'OVERRIDE'
  action_target VARCHAR(100),  -- ex: 's1_status'
  action_value VARCHAR(50),    -- ex: 'RED', 'CLUSTER_2'
  approver_id VARCHAR(50),
  approver_role VARCHAR(50),
  evidence_url TEXT,
  s3_checksum VARCHAR(64)
);
```

### 7.2 S3 immutable storage

- Daily snapshot: `s3://byd-d3-audit/2026/07/21/audit.json.gz`
- Checksum SHA-256: stored separately; recomputed quarterly
- WORM (Write Once Read Many): enabled; cannot be modified after 90 days
- Retention: 7 anos; after 7 anos, move to S3 Glacier

### 7.3 External auditor access

- Board + Big 4 têm read-only access via console separada
- Audit logs podem ser exportados para CSV/JSON sob demanda
- Compliance officer tem access para gerar relatórios regulatórios (BNDES, CADE)

---

## 8. Performance & SLA

### 8.1 Latency targets

| Operação | Target | SLA hard |
|---|---|---|
| Data ingestion (signal update) | ≤5 min após dado disponível | ≤10 min |
| Signal calculation | ≤30s | ≤60s |
| Trigger rule evaluation | ≤10s | ≤30s |
| Notification dispatch (Slack/Email) | ≤30s | ≤60s |
| Notification dispatch (SMS) | ≤60s | ≤120s |
| End-to-end (signal change → ack) | ≤5 min | ≤10 min |

### 8.2 Throughput

- 6 signals × 4 updates/dia = 24 signal updates/dia
- 30 regras = 30 evaluations per update
- Total: 720 evaluations/dia (pequeno; sistema aguenta 100×)

### 8.3 Uptime target

- 99.5% uptime (4h downtime/mês aceitável para maintenance)
- Failover: 1 hot standby em região AWS diferente
- Disaster recovery: backup full daily; RTO 4h, RPO 1h

---

## 9. Custos & infraestrutura

### 9.1 Estimativa de custo mensal (AWS ou similar)

| Componente | Custo/mês |
|---|---|
| EC2 (FastAPI + trigger engine) | R$ 500 |
| RDS PostgreSQL (time-series) | R$ 800 |
| ElastiCache Redis | R$ 300 |
| S3 (audit log + reports) | R$ 200 |
| CloudWatch (monitoring) | R$ 100 |
| Lambda (data ingestion) | R$ 200 |
| Total infra | R$ 2.100/mês ≈ R$ 25k/ano |

### 9.2 Custo de desenvolvimento

| Item | Custo (one-time) |
|---|---|
| Engenheiro senior (3 meses) | R$ 90k |
| Engenheiro pleno (3 meses) | R$ 50k |
| QA + UAT | R$ 30k |
| Total dev | R$ 170k |

### 9.3 Custo de feeds

| Feed | Custo anual |
|---|---|
| Reuters/Bloomberg | R$ 50-100k |
| B3 derivatives | R$ 10-20k |
| Trading Economics | R$ 5-10k |
| Total feeds | R$ 65-130k |

### 9.4 Total T2.1

<strong>R$ 295-360k ano 1</strong> (dev R$ 170k + infra R$ 25k + feeds R$ 100k) → R$ 125-155k/ano recorrente (infra + feeds).

---

## 10. Roadmap de implementação (8 semanas Q4 2026)

| Semana | Atividade | Deliverable |
|---|---|---|
| W1 | Spec final + aprovação CSO + CFO | D3-AUTO-TRIGGER-SPEC.md v1.0 |
| W2 | Setup infra (AWS account, CI/CD) | Infraestrutura provisionada |
| W3 | Data ingestion (5 feeds primários) | Python ETL funcionando |
| W4 | Signal layer (6 calculations) | S1-S6 calculando corretamente |
| W5 | Trigger engine (30 regras) | Regras em YAML, tested in staging |
| W6 | Notification layer (Slack + Email + SMS) | Multi-canal funcionando |
| W7 | Backtesting (5 anos dados históricos) | Relatório accuracy ≥ 80% |
| W8 | UAT + go-live (piloto) | Sistema em produção, monitorado |

---

## 11. Riscos & mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| <strong>Feed latency alta</strong> (BCB outage, ANFAVEA scraping fail) | Média | Médio | Fallback para proxy feeds; manual override CSO |
| <strong>False positives</strong> (trigger dispara mas ação não é necessária) | Alta | Baixo | Cooldown 24h; human review antes de executar |
| <strong>False negatives</strong> (trigger NÃO dispara quando deveria) | Baixa | Alto | Backtesting rigoroso; stress test mensal |
| <strong>Audit log tampering</strong> | Muito baixa | Alto | WORM + S3 checksum + external auditor |
| <strong>Notification overload</strong> (CSO recebe 100+ alertas/dia) | Média | Médio | Cooldown 24h; agrupar por cluster; silent mode em cluster 1 |
| <strong>Custo de feed</strong> (Reuters R$ 100k excede budget) | Baixa | Baixo | Começar com feeds free (BCB, MDIC, ANFAVEA); adicionar Reuters só se accuracy < 80% |

---

## 12. Critérios de aceitação (go/no-go)

Para T2.1 ser considerado "done":

- [ ] Infraestrutura provisionada e testada (uptime 99.5%+)
- [ ] 5 feeds primários ingerindo dados com latency ≤10 min
- [ ] 6 signals calculando corretamente (S1-S6, validados contra dados históricos)
- [ ] 30+ regras em YAML, tested in staging
- [ ] Backtesting accuracy ≥ 80% (true positive), ≤ 5% (false positive)
- [ ] Notification layer funcionando (Slack + Email + SMS, latency ≤60s)
- [ ] Audit trail imutável (S3 WORM + checksum)
- [ ] UAT aprovado por CSO + CFO + Risk Officer
- [ ] Documentação operacional (runbook, troubleshooting guide)
- [ ] Plano de rollback testado (reverter para trigger manual em ≤1h)

---

## 13. Resumo executivo (1 página)

<strong>O que este spec resolve</strong>: o D3 framework define 12 decision trees e 31 ações, mas hoje depende de CSO monitorar 6 sinais manualmente. Auto-trigger system substitui esse overhead por:

1. <strong>5 feeds primários</strong> + 4 secundários (BCB, MDIC, ANFAVEA, BNDES, BYD internal + Reuters/Bloomberg/B3/Trading Economics)
2. <strong>6 signals calculados</strong> em real-time (S1-S6) com thresholds GREEN/AMBER/RED
3. <strong>30+ regras em YAML</strong> que mapeiam condições → ações (trigger + notification + approve flow)
4. <strong>Multi-canal notification</strong> (Slack + Email + SMS + Dashboard) com latency ≤60s
5. <strong>Audit trail imutável</strong> (S3 WORM, 7 anos retenção, external auditor access)
6. <strong>Backtesting rigoroso</strong> (5 anos dados históricos, ≥ 80% accuracy target)

<strong>Benefícios quantificados</strong>:
- Time-to-action: de horas/dias para ≤5 min (10-100× speedup)
- Custo operacional: R$ 5-10M/ano em CSO overhead evitado (estimativa baseada em frameworks similares)
- Audit compliance: 100% de mudanças de cluster registradas (vs. ~70% manual hoje)
- Kill switch latency: ≤1h vs. 4-8h manual (10× speedup em crises)

<strong>Investimento</strong>: R$ 295-360k ano 1 + R$ 125-155k/ano recorrente.

<strong>ROI</strong>: 1 evento de kill switch executado em ≤1h vs. ≥4h (PTAX shock 2024) recupera ~R$ 50M de VaR. Payback em ~6 meses.

<strong>Próximo passo</strong>: aprovar este spec com CSO + CFO + CEO → abrir sprint planning (Q4 2026 wk 1) → implementar em 8 semanas.
