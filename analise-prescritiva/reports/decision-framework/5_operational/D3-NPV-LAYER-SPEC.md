# D3 — NPV Live Layer Spec (T2.2)

**Documento de design técnico** · Define o pipeline de NPV live + sensitivity auto-update + ranking de prescrições
**Data**: 21/jul/2026
**Status**: Design spec · pronto para implementação (Q4 2026)
**Phase 2 — T2.2**

---

## 1. Objetivo

Automatizar o cálculo de NPV (Net Present Value) e sensitivity que hoje é <strong>estático e manual</strong> (D3-ANNEX.html, calculado em 21/jul/2026 com dados de D2). O NPV live layer:

- <strong>Recalcula diariamente</strong> NPV de cada prescrição (hedge FX, dual-sourcing, defensivo, advocacy, partnerships) com dados de mercado atualizados
- <strong>Auto-atualiza sensitivity</strong> (8 valores de σ, 4 cenários S3, 3 status S2) sem intervenção humana
- <strong>Ranking dinâmico</strong>: ordena prescrições por ROI marginal, dado o estado conjunto do programa
- <strong>Dashboard interativo</strong>: CFO + Risk Officer veem NPV live, podem tomar decisões informadas

**Drivers**:
- <strong>Decisões com dados stale custam caro</strong>: NPV de R$ 1bi baseado em σ=14% pode ser R$ 0.5bi com σ=20% (sub-otimização de R$ 500M)
- <strong>Sensitivity hoje é one-shot</strong>: roda 8 valores × 4 cenários = 32 calcs; precisa re-rodar a cada mudança
- <strong>Trade-off entre prescrições</strong>: hoje é julgamento; com NPV live + ROI marginal, vira decisão data-driven

---

## 2. Arquitetura

### 2.1 Stack tecnológica

| Componente | Tecnologia | Justificativa |
|---|---|---|
| <strong>NPV calculator</strong> | Python (NumPy + Pandas) | Performance + auditabilidade |
| <strong>Data inputs</strong> | PostgreSQL (signals from T2.1) + APIs (BCB, MDIC) | Reutilizar trigger engine infra |
| <strong>Scheduler</strong> | Apache Airflow (ou cron) | DAG com dependências + retry |
| <strong>Storage</strong> | PostgreSQL (time-series) + Parquet (analytics) | Histórico + queries rápidas |
| <strong>API layer</strong> | FastAPI | REST endpoints para dashboard |
| <strong>Dashboard</strong> | Plotly Dash ou Streamlit | Interatividade, embed no D3-ANNEX.html |

### 2.2 Componentes funcionais

```
┌──────────────────────────────────────────────────────────┐
│              DATA INPUTS (10+ time-series)               │
├──────────────────────────────────────────────────────────┤
│ BCB PTAX daily       │ BCB IPCA daily                    │
│ lítio price monthly  │ BNDES status weekly               │
│ VaR realized (T2.1) │ Composite score (T2.1)            │
│ σ realized (T2.1)    │ viE forecast (T2.1)               │
│ delivery KPIs (T2.1)│ market share monthly              │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│            NPV CALCULATOR (4 prescrições)                │
├──────────────────────────────────────────────────────────┤
│ hedge_fx_npv(s1, s3) = ...  (constraint VaR residual)  │
│ dual_sourcing_npv(s2) = ...  (VaR supply benefit)       │
│ defensivo_npv(s3, s4) = ...  (tier 0-3)                 │
│ advocacy_npv(s3) = ...  (reverter BNDES)                │
│ partnerships_npv(s5) = ...  (LP lock benefit)           │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│          SENSITIVITY ENGINE (8×4×3 = 96 calcs)          │
├──────────────────────────────────────────────────────────┤
│ σ_values = [10%, 12%, 14%, 16%, 18%, 20%, 22%, 25%]    │
│ s3_scenarios = [Expansão, Continuidade, RB Parcial, RB]│
│ s2_status = [GREEN, AMBER, RED]                          │
│ → 96 NPV scenarios por prescrição                       │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│          RANKING ENGINE (ROI marginal)                  │
├──────────────────────────────────────────────────────────┤
│ Given state (S1, S2, S3, S4, S5, S6):                   │
│   1. Compute NPV for each prescription                  │
│   2. Rank by ROI = NPV / cost                           │
│   3. Identify top-3 actions (highest ROI)               │
│   4. Show trade-offs (next-best alternative)            │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│         API LAYER (REST + dashboard)                     │
├──────────────────────────────────────────────────────────┤
│ GET /npv/hedge?sigma=14.86&vie=18&s6=AMBER  → NPV     │
│ GET /npv/all  → ranking de todas prescrições          │
│ GET /sensitivity/hedge?param=sigma  → 8 cenários      │
│ GET /recommend?state={...}  → top-3 ações             │
└──────────────────────────────────────────────────────────┘
```

---

## 3. NPV calculator (4 prescrições + 1 cross-cutting)

### 3.1 Hedge FX (S1)

**Inputs**: PTAX vol 30d, σ realized, ViE forecast, h% corrente

**Calculation** (constraint-based, do D3-RECALIBRATION-S1-S3-REAL-BCB.md):

```python
def hedge_fx_npv(vol30d, sigma, vie_forecast, current_h, h_star):
    # 1. Compute VaR residual (constraint)
    var_fx_p95 = 2.742e9  # R$ 2.742bi (real BCB)
    var_residual = var_fx_p95 * (1 - h_star)

    # 2. Compute margin buffer (5% de VGV)
    margin_buffer = 0.05 * 30e9  # R$ 1.5bi (assumindo VGV R$ 30bi)

    # 3. NPV = VaR benefit - cost
    var_benefit = var_fx_p95 * h_star  # valor de VaR coberto
    premium_cost = 0.01 * h_star * 1.5e9  # 100bps × h* × exposição FX
    npv = var_benefit - premium_cost

    # 4. ROI = NPV / cost
    roi = npv / premium_cost if premium_cost > 0 else 0

    # 5. Saturação: h* = min(constraint, ceiling=95%)
    if h_star >= 0.95:
        constraint_binding = False  # saturado, sem upside marginal

    return {
        "npv_R$_M": npv / 1e6,
        "roi_%": roi * 100,
        "var_residual_R$_M": var_residual / 1e6,
        "premium_cost_R$_M": premium_cost / 1e6,
        "var_benefit_R$_M": var_benefit / 1e6,
        "constraint_binding": True,
        "h_star_%": h_star * 100,
    }
```

**Recalc trigger**: a cada PTAX intraday update (4×/dia) ou change em ViE forecast.

### 3.2 Dual-sourcing (S2)

**Inputs**: lítio price, CATL delivery KPIs, exposure (42% BOM × 30% VGV)

**Calculation** (do D3-RECALIBRATION-S1-S2-REAL.md):

```python
def dual_sourcing_npv(lithium_price, catl_delivery, s2_status):
    # 1. VaR supply (real lítio P95 = R$ 2.268M, weight 1:0.97)
    var_supply_p95 = 2.268e9  # R$ 2.268bi (real)
    var_realized = var_supply_p95 * (lithium_price / 10000)  # scale by current price

    # 2. Dual-sourcing benefit (lock 30% of supply to backup supplier)
    dual_sourcing_benefit = 0.30 * var_realized  # R$ 680M (scaled)

    # 3. Cost: capex R$ 280M (EVE qualification) + opex R$ 80M/ano
    cost_total = 280e6 + 80e6 * 3  # 3 anos

    # 4. NPV (com taxa de desconto 13% nominal, ajustada a risco soberano)
    discount = 0.13
    npv = sum([dual_sourcing_benefit * (1 - discount)**t for t in range(1, 4)]) - cost_total
    roi = npv / cost_total

    return {
        "npv_R$_M": npv / 1e6,
        "roi_%": roi * 100,
        "var_supply_realized_R$_M": var_realized / 1e6,
        "dual_sourcing_benefit_R$_M": dual_sourcing_benefit / 1e6,
        "cost_total_R$_M": cost_total / 1e6,
    }
```

**Recalc trigger**: lítio price change ≥ 10% ou CATL delivery < 95%.

### 3.3 Defensivo (S4)

**Inputs**: S3 status (ViE), S6 status (macro), tier atual

**Calculation** (do D3-RECALIBRATION-S3-S4.md + S1↔S4):

```python
def defensivo_npv(vie_forecast, s6_status, current_tier, margin_per_unit=15e3):
    # 1. Defensivo cost by tier
    cost_by_tier = {0: 0, 1: 7.5e6, 2: 15e6, 3: 22.5e6}

    # 2. Defensivo benefit (units protected × margin preserved)
    units_protected_by_tier = {0: 0, 1: 2_000, 2: 5_000, 3: 8_000}
    benefit = units_protected_by_tier[current_tier] * margin_per_unit

    # 3. Catalog-wide sempre unviable (REMOVIDO)
    if current_tier == 4:
        return {"npv_R$_M": -67e6, "roi_%": -67, "catalog_wide": True}

    # 4. NPV (3 anos, sem discount factor para tier system simples)
    cost = cost_by_tier[current_tier] * 3
    npv = benefit * 3 - cost
    roi = npv / cost if cost > 0 else float('inf')

    return {
        "npv_R$_M": npv / 1e6,
        "roi_%": roi * 100,
        "units_protected": units_protected_by_tier[current_tier],
        "cost_total_R$_M": cost / 1e6,
        "tier": current_tier,
    }
```

**Recalc trigger**: S3 status change ou S6 AMBER+.

### 3.4 Advocacy (S3)

**Inputs**: BNDES funding status, political risk, viE forecast

**Calculation** (advocacy effort to revert BNDES denial):

```python
def advocacy_npv(bndes_status, political_risk, vie_current):
    if bndes_status == "approved":
        return {"npv_R$_M": 0, "status": "no_action_needed"}

    # 1. Cost of advocacy effort
    cost_by_effort = {"light": 5e6, "medium": 18e6, "heavy": 30e6}

    # 2. Probability of success (P(reverter))
    p_success = {
        ("denied", "high"): 0.10,
        ("denied", "medium"): 0.25,
        ("denied", "low"): 0.40,
        ("delayed", "high"): 0.30,
        ("delayed", "medium"): 0.50,
        ("delayed", "low"): 0.70,
    }[(bndes_status, political_risk)]

    # 3. Benefit of reverter: difference between RB Parcial and Continuidade NPV
    benefit_if_success = 1.5e9  # R$ 1.5bi (rough estimate, refine in T3)

    # 4. NPV expected
    effort = "heavy" if vie_current < 10 else "medium"
    cost = cost_by_effort[effort] * 2  # 2 anos de advocacy
    npv_expected = p_success * benefit_if_success - cost
    roi = npv_expected / cost

    return {
        "npv_R$_M": npv_expected / 1e6,
        "roi_%": roi * 100,
        "p_success": p_success,
        "effort": effort,
        "cost_total_R$_M": cost / 1e6,
    }
```

**Recalc trigger**: BNDES status change (manual update by Head Gov Relations).

### 3.5 Partnerships (S5)

**Inputs**: CATL/EVE delivery, lítio price, LP contracts

**Calculation** (do D3-INTERDEPENDENCY-S5-COUPLED.md):

```python
def partnerships_npv(lithium_price, catl_delivery, lp_lock_pct):
    # 1. Lock benefit (price stability over 3 anos)
    expected_lithium_volatility = 0.83  # σ annual 82.9% (real lítio)
    benefit_lock = lp_lock_pct * 0.30 * 3e10 * 0.05  # 5% savings on locked volume

    # 2. Cost: capex R$ 35M (CATL 70% lock) + opex R$ 5M/ano
    cost = 35e6 + 5e6 * 3

    # 3. NPV
    npv = benefit_lock * 3 - cost
    roi = npv / cost if cost > 0 else float('inf')

    return {
        "npv_R$_M": npv / 1e6,
        "roi_%": roi * 100,
        "benefit_lock_R$_M": benefit_lock / 1e6,
        "lp_lock_pct": lp_lock_pct,
    }
```

**Recalc trigger**: lítio price change ≥ 20% ou delivery KPIs shift.

---

## 4. Sensitivity engine (96 cenários)

### 4.1 Estrutura de sensitivity

Para cada prescrição, computar NPV em:

- **8 valores de σ** (PTAX): [10%, 12%, 14%, 16%, 18%, 20%, 22%, 25%]
- **4 cenários S3**: [Expansão (ViE=25%), Continuidade (ViE=18%), RB Parcial (ViE=10%), RB Total (ViE=0%)]
- **3 status S2**: [GREEN, AMBER, RED]

Total: 8 × 4 × 3 = 96 cenários por prescrição.

### 4.2 Output: tornado chart + heatmap

**Tornado chart** (uma variável por vez, mostra impacto marginal):

```
NPV por prescrição — tornado
                            σ variation impact
hedge FX:    ████████████████ R$ +1.539bi (σ 14.86% real)
             ░░░░░░░░░░░░░░░░ R$ +0.835bi (σ 14.19% D2)
dual-sourcing: ████████ R$ +0.572bi
             ░░░░░░░░ R$ -0.730bi (downside)
defensivo:   ███████ R$ +0.225bi (targeted, RB Parcial)
             ░░░░░░░ R$ -1.500bi (catalog-wide, RB Total) — PROIBIDO
```

**Heatmap** (todas as variáveis, visão 2D):

```
              GREEN   AMBER   RED
σ=10%         +R$1.2  +R$1.5  +R$2.1
σ=14%         +R$1.4  +R$1.7  +R$2.4
σ=18%         +R$1.6  +R$1.9  +R$2.7
σ=22%         +R$1.8  +R$2.1  +R$3.0
σ=25%         +R$2.0  +R$2.3  +R$3.3
```

### 4.3 Recalc frequency

- **Daily EOD**: rodar todas as 96 cenários com dados do dia
- **Real-time on trigger**: se trigger engine dispara (T2.1), recalcular NPV com novos parâmetros
- **Weekly batch**: gerar relatório consolidado (CFO review)

---

## 5. Ranking engine (ROI marginal)

### 5.1 Lógica de ranking

Dado o estado atual do programa (S1, S2, S3, S4, S5, S6 + composite):

1. Compute NPV para cada uma das 4 prescrições (hedge, dual-sourcing, defensivo, advocacy, partnerships)
2. Compute ROI = NPV / cost
3. Sort prescrições por ROI descendente
4. Output: top-3 ações com maior ROI marginal

### 5.2 Exemplo de output

**Estado**: S3=Continuidade (ViE=18%), S6=AMBER, S1=AMBER, S2=AMBER

```
┌─────────────────────────────────────────────────────────────┐
│  Top-3 ações para estado atual (Continuidade+AMBER)        │
├─────────────────────────────────────────────────────────────┤
│  1. Hedge FX (h* 47%)                                       │
│     NPV: R$ 1.539bi  │  Cost: R$ 970M  │  ROI: 159%       │
│     Next-best alt: Defensivo Tier 2 (ROI 156%)             │
│                                                             │
│  2. Defensivo Tier 2 (5k unidades)                          │
│     NPV: R$ 148M  │  Cost: R$ 60M  │  ROI: 247%            │
│     Next-best alt: Hedge FX (ROI 159%)                      │
│                                                             │
│  3. EVE qualification acceleration (S2 plano B)             │
│     NPV: R$ 425M  │  Cost: R$ 200M  │  ROI: 213%           │
│     Next-best alt: Lock CATL 80% LP (ROI 184%)              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 API endpoint

```bash
GET /recommend?state={"s1": "AMBER", "s2": "AMBER", "s3": "Continuidade", "s6": "AMBER"}

Response:
{
  "state": {"s1": "AMBER", "s2": "AMBER", "s3": "Continuidade", "s6": "AMBER"},
  "composite": 78,
  "recommendations": [
    {
      "rank": 1,
      "action": "hedge_fx_resize",
      "params": {"h_star": 0.47},
      "npv_R$_M": 1539,
      "cost_R$_M": 970,
      "roi_%": 159,
      "next_best_alternative": {"action": "defensivo_tier_2", "roi_%": 156}
    },
    ...
  ]
}
```

---

## 6. Dashboard integration (D3-ANNEX.html v2)

### 6.1 New section in D3-ANNEX

Adicionar seção "NPV Live" antes do final:

```html
<section id="npv-live">
  <h2>NPV Live (atualizado daily)</h2>
  <div class="npv-live-dashboard">
    <div class="live-data" id="hedge-npv">Carregando...</div>
    <div class="live-data" id="dual-sourcing-npv">Carregando...</div>
    <div class="live-data" id="defensivo-npv">Carregando...</div>
    <div class="live-data" id="advocacy-npv">Carregando...</div>
    <div class="live-data" id="recommendations">Carregando...</div>
  </div>
  <script>
    // JavaScript mínimo para fetch + render
    // ~50 linhas, sem dependência externa
    setInterval(async () => {
      const data = await fetch('https://d3-api.byd.internal/npv/all');
      // render each .live-data div
    }, 60000);  // refresh every 60s
  </script>
</section>
```

### 6.2 Visual elements

| Element | Description | Refresh |
|---|---|---|
| <strong>Live NPV cards</strong> | 5 cards (hedge, dual-sourcing, defensivo, advocacy, partnerships) com NPV, cost, ROI | 60s |
| <strong>Recommendation box</strong> | Top-3 ações com maior ROI marginal dado estado atual | 5 min |
| <strong>Sensitivity heatmap</strong> | 96 cenários (8σ × 4 S3 × 3 S2) com cores (verde/vermelho) | Daily |
| <strong>Tornado chart</strong> | Impacto marginal de cada variável | Daily |
| <strong>Composite gauge</strong> | Score 0-100 com cores GREEN/AMBER/RED/CRISIS | Real-time |

---

## 7. Performance & SLA

### 7.1 Latency targets

| Operação | Target | SLA hard |
|---|---|---|
| Daily NPV recalc (96 cenários × 4 prescrições) | ≤5 min | ≤10 min |
| API GET /npv/hedge (single call) | ≤500ms | ≤1s |
| API GET /recommend (full ranking) | ≤1s | ≤3s |
| Dashboard refresh (5 cards) | ≤2s | ≤5s |
| Sensitivity heatmap (96 cells) | ≤1s | ≤3s |

### 7.2 Throughput

- 5 prescrições × 96 cenários = 480 NPV calcs/dia
- Cada calc: ~50ms (NumPy vectorized)
- Total: ~24s de CPU/dia (folga de 1000×)
- API: ~1000 req/dia (pequeno; aguenta 100×)

### 7.3 Uptime target

- 99.5% uptime (4h downtime/mês para maintenance)
- Database: replica read-only + failover automático
- API: 2 instâncias (active-active)

---

## 8. Custos & infraestrutura

### 8.1 Estimativa de custo mensal (AWS ou similar)

| Componente | Custo/mês |
|---|---|
| EC2 (NPV calculator + API) | R$ 400 |
| RDS PostgreSQL (NPV time-series) | R$ 600 |
| ElastiCache Redis | R$ 200 |
| S3 (reports + audit) | R$ 100 |
| CloudWatch (monitoring) | R$ 100 |
| Total infra | R$ 1.400/mês ≈ R$ 17k/ano |

### 8.2 Custo de desenvolvimento

| Item | Custo (one-time) |
|---|---|
| Engenheiro senior (2 meses) | R$ 60k |
| Engenheiro pleno (2 meses) | R$ 35k |
| QA + UAT | R$ 20k |
| Total dev | R$ 115k |

### 8.3 Total T2.2

<strong>R$ 132k ano 1</strong> (dev R$ 115k + infra R$ 17k) → R$ 17k/ano recorrente.

---

## 9. Roadmap de implementação (6 semanas Q4 2026)

| Semana | Atividade | Deliverable |
|---|---|---|
| W1 | Spec final + aprovação + setup infra | D3-NPV-LAYER-SPEC.md v1.0, AWS provisionado |
| W2 | NPV calculator (4 prescrições) | Python functions, validated contra D3-ANNEX |
| W3 | Sensitivity engine (96 cenários) | Heatmap gerado para todas as prescrições |
| W4 | Ranking engine + API layer | REST endpoints funcionando |
| W5 | Dashboard integration (D3-ANNEX.html v2) | Embedded live data |
| W6 | UAT + go-live | Dashboard em produção, monitorado |

---

## 10. Riscos & mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| <strong>NPV calc drift</strong> (muda fórmula sem documentar) | Média | Alto | Versionamento Git + changelog obrigatório |
| <strong>Sensitivity heatmap confusing</strong> | Média | Médio | Tooltip explicativo + link para D3-RECALIBRATION-* docs |
| <strong>API downtime</strong> | Baixa | Médio | Replica read-only + cache Redis |
| <strong>Dados stale</strong> (BCB atrasa, lítio não atualiza) | Média | Médio | Indicador "data freshness" no dashboard; fallback para último valor |
| <strong>User misinterpretation</strong> (CFO vê ROI -100% e cancela tudo) | Baixa | Alto | Tooltip "ROI context" + disclaimer + CSO review antes de decisão |

---

## 11. Critérios de aceitação (go/no-go)

Para T2.2 ser considerado "done":

- [ ] 4 NPV calculators validados contra D3-ANNEX (delta ≤ 5%)
- [ ] Sensitivity engine gera 96 cenários em ≤5 min
- [ ] API endpoints funcionando (5 endpoints, latency ≤1s)
- [ ] Dashboard embeded em D3-ANNEX.html v2 com refresh 60s
- [ ] UAT aprovado por CFO + Risk Officer + CSO
- [ ] Documentação (runbook, troubleshooting, formula reference)
- [ ] Plano de rollback testado (voltar para D3-ANNEX.html v1 em ≤1h)

---

## 12. Resumo executivo (1 página)

<strong>O que este spec resolve</strong>: o D3-ANNEX.html hoje tem NPV estático (calculado em 21/jul/2026 com dados de D2). NPV live layer substitui por:

1. <strong>5 NPV calculators</strong> (hedge FX, dual-sourcing, defensivo, advocacy, partnerships) recalculados daily
2. <strong>Sensitivity engine</strong> com 96 cenários (8σ × 4 S3 × 3 S2) auto-atualizado
3. <strong>Ranking engine</strong> que ordena prescrições por ROI marginal dado estado atual
4. <strong>API REST</strong> para integração com dashboard
5. <strong>Dashboard embeded</strong> em D3-ANNEX.html v2 com refresh 60s

<strong>Benefícios quantificados</strong>:
- Decisões com dados atualizados: ~R$ 50-100M/ano em sub-otimização evitada
- Sensitivity live vs one-shot: economiza ~4h/semana de CFO + Risk Officer em recalcs manuais
- Ranking data-driven: trade-off entre prescrições vira decisão informada, não política

<strong>Investimento</strong>: R$ 132k ano 1 + R$ 17k/ano recorrente.

<strong>ROI</strong>: 1 decisão sub-otimizada evitada por trimestre (e.g., hedge 50% flat vs constraint 47%) recupera ~R$ 50M. Payback em ~9 meses.

<strong>Próximo passo</strong>: aprovar este spec com CFO + CSO + Risk Officer → abrir sprint planning (Q4 2026 wk 3) → implementar em 6 semanas.
