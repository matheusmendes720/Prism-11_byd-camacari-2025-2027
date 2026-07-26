# D3 — Trigger Matrix: 6 dimensões × 3 níveis = 18 cells

**Documento operacional** · T1.2 do Phase 1 (Q3 2026) · Define condições de trigger, ações, latências, owners e approval gates
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. Visão geral

O D3 trigger matrix é o sistema nervoso operacional do framework. Cada uma das 6 sessões (S1-S6) tem 3 níveis (GREEN/AMBER/RED), totalizando **18 cells**. Cada cell define:
- (a) **Trigger condition** com threshold quantitativo
- (b) **Action** a ser tomada
- (c) **Cost** estimado
- (d) **Owner** (R = Responsible, A = Accountable)
- (e) **Procedure** (passo-a-passo)
- (f) **Latency** (tempo alvo entre detecção e acionamento)

S6 é o **governor** — seu status reescala as outras 5 sessões via macro multiplier (1.0×/1.5×/2.0×).

---

## 2. Definição dos thresholds (por dimensão)

### 2.1 S1 — Hedge cambial (variável: PTAX realized + vol 30d)

| Nível | PTAX level | Vol 30d anualizada | Status |
|---|---|---|---|
| 🟢 **GREEN** | PTAX < 5.40 | Vol < 18% | Regime normal |
| 🟡 **AMBER** | 5.40 ≤ PTAX < 5.80 | 18% ≤ Vol < 25% | Stress moderado |
| 🔴 **RED** | PTAX ≥ 5.80 | Vol ≥ 25% | Crise cambial |

**Fontes de dados**: BCB SGS API (PTAX close diário, vol 30d calculada). Cadência de medição: diária (PTAX) + rolling 30d (vol).

### 2.2 S2 — Supply chain (variável: VaR supply realized ratio)

| Nível | VaR supply realized / VaR baseline | Status |
|---|---|---|
| 🟢 **GREEN** | < 0.70 (VaR realized < 70% do baseline) | Supply resiliente |
| 🟡 **AMBER** | 0.70 - 1.00 | Stress moderado (cuidado) |
| 🔴 **RED** | ≥ 1.00 (VaR realized ≥ baseline) | Supply stress materializado |

**Definição do VaR realized**: estimado mensalmente pela Head Supply Chain com base em (a) volume de entregas EVE, (b) pricing CATL, (c) lead times Tier 1, (d) estoque safety.

### 2.3 S3 — BNDES (variável: ViE — % funding BNDES preservado)

| Nível | ViE | Status BNDES |
|---|---|---|
| 🟢 **GREEN** | ViE ≥ 20% (Expansão) | BNDES funding no caminho |
| 🟡 **AMBER** | 10% ≤ ViE < 20% (Continuidade → RB Parcial) | Funding parcial, advocacy expandida |
| 🔴 **RED** | ViE < 10% (RB Total) | Funding colapsou |

**Fonte**: Head Gov Relations reporta status BNDES mensalmente. Acompanhamento direto de decisões do Conselho BNDES.

### 2.4 S4 — Pricing defensivo (variável: market share trend BYD vs OEMs)

| Nível | Δ market share 90d | Status competitivo |
|---|---|---|
| 🟢 **GREEN** | Share estável ou crescendo | Defensivo Tier 0/1 apenas |
| 🟡 **AMBER** | Share caindo 1-2pp | Defensivo sobe 1 tier |
| 🔴 **RED** | Share caindo > 2pp | Defensivo Tier 3 + comunicação |

**Fonte**: ANFAVEA mensal + tracking Tesla/VW/GM/Geely. Cadência de medição: mensal (rolling 90d).

### 2.5 S5 — Partnerships (variável: stakeholder health composite)

| Nível | Stakeholders em risco | Status partnerships |
|---|---|---|
| 🟢 **GREEN** | 0 (todos saudáveis) | Partnerships operacionais |
| 🟡 **AMBER** | 1 stakeholder em risco | Revisão de contratos |
| 🔴 **RED** | 2+ stakeholders em risco | Renegociação acelerada |

**Stakeholders monitorados**: BYD global, CATL, EVE, VW, MDIC, BCB. Cada um tem KPI próprio:
- **BYD global**: alinhamento estratégico trimestral
- **CATL**: volume entregue vs contratado
- **EVE**: progresso de qualification (meses vs 12m baseline)
- **VW**: status da PPE platform partnership
- **MDIC**: frequência de reuniões + qualidade de informação
- **BCB**: canal técnico aberto

### 2.6 S6 — Macro (variável: composite de PIB + IPCA + FGV)

| Nível | PIB YoY | IPCA 12m | FGV confiança | Status macro |
|---|---|---|---|---|
| 🟢 **GREEN** | > 0% | < 5% | > 90 | Normal |
| 🟡 **AMBER** | -1% a 0% | 5-7% | 80-90 | Stress moderado |
| 🔴 **RED** | < -1% (2+ trim consecutivos) | > 7% | < 80 | Crise |

**Transição AMBER/RED exige 2 trimestres consecutivos** (evita reaction a choque transitório). Composite = média ponderada dos 3 indicadores.

---

## 3. Matriz 18 cells — Trigger conditions + Actions + Owners

### 3.1 S1 (Hedge cambial)

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | PTAX < 5.40 ∧ vol < 18% | Baseline h* (do S3) — sem ação | R$ 0 | Risk Officer | CFO | Mensal |
| 🟡 AMBER | 5.40 ≤ PTAX < 5.80 ∧ vol 18-25% | h* × 1.5 (cap 95%); trigger de revisão | R$ 6-12M | Risk Officer | CFO | 5 min |
| 🔴 RED | PTAX ≥ 5.80 ∧ vol ≥ 25% | h* × 2.0 (satura 95%); considerar partnership hedge | R$ 12-24M | Risk Officer | CEO | 60 min |

### 3.2 S2 (Supply chain)

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | VaR supply realized < 0.70 | Baseline dual-sourcing 18m | R$ 0 | Head Supply | COO | Trimestral |
| 🟡 AMBER | 0.70 ≤ VaR realized < 1.00 | Acelerar EVE qualification (12m); +30 dias safety stock | R$ 30M | Head Supply | COO | 5 min |
| 🔴 RED | VaR realized ≥ 1.00 | Plano B: comprar spot + hedge alternativo via S5 partnerships | R$ 80M+ | Head Supply | CEO | 60 min |

### 3.3 S3 (BNDES)

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | ViE ≥ 20% (Expansão) | Advocacy baseline R$ 12M (MDIC meetings) | R$ 0 | Head Gov Relations | CEO | Mensal |
| 🟡 AMBER | 10% ≤ ViE < 20% | Dobrar advocacy (R$ 24M); +MDIC meetings | R$ 12M | Head Gov Relations | CEO | 5 min |
| 🔴 RED | ViE < 10% | **Bridge financing R$ 800M acionado** (Plano B) | R$ 50M commitment | CFO + Head Treasury | CEO + Board | 60 min |

### 3.4 S4 (Pricing defensivo)

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | Δ share ≥ 0 (estável) | Defensivo Tier 0/1 conforme S3 | R$ 0 | Head Marketing | CMO | Mensal |
| 🟡 AMBER | Share caindo 1-2pp | Defensivo sobe 1 tier (Tier 1→2 ou 2→3) | R$ 7.5-22.5M | Head Marketing | CMO | 5 min |
| 🔴 RED | Share caindo > 2pp | Defensivo Tier 3 + comunicação ao mercado | R$ 22.5M + R$ 5M marketing | CMO | CEO | 60 min |

### 3.5 S5 (Partnerships)

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | 0 stakeholders em risco | Manter baseline partnerships | R$ 0 | CSO | CEO | Trimestral |
| 🟡 AMBER | 1 stakeholder em risco | Revisar LP contracts; ativar hedge clauses | R$ 5M legal | Head Legal | COO | 5 min |
| 🔴 RED | 2+ stakeholders em risco | Renegociar parcerias; diversificar fornecedores Tier 1 | R$ 20M+ | Head Procurement | CEO | 60 min |

### 3.6 S6 (Macro) — Governor

| Nível | Trigger condition | Action | Cost | Owner (R) | Approver (A) | Latency |
|---|---|---|---|---|---|---|
| 🟢 GREEN | PIB > 0 ∧ IPCA < 5 ∧ FGV > 90 | Monitorar cadência mensal | R$ 0 | CSO | CEO | Mensal |
| 🟡 AMBER | PIB -1 a 0% ∨ IPCA 5-7 ∨ FGV 80-90 | Composite +13; atualizar tiers S1-S4 | R$ 55-65M (rescala) | CSO | CEO | 5 min |
| 🔴 RED | PIB < -1% (2 trim) ∨ IPCA > 7 ∨ FGV < 80 | Composite +23; comitê crise; freeze despesas (exceto approved) | R$ 165-200M (rescala) | CSO | CEO + Board | 60 min |

**S6 macro multiplier**: GREEN=1.0×, AMBER=1.5×, RED=2.0× — aplicado em S1, S2, S3, S4. Ver [D3-INTERDEPENDENCY-S6-TRIGGERS.md §2](./D3-INTERDEPENDENCY-S6-TRIGGERS.md) para detalhes.

---

## 4. Procedimentos de transição (4 transições)

### 4.1 GREEN → AMBER (latência alvo: 5 min)

**Trigger**: 1 indicador cruza threshold AMBER OU 2+ indicadores simultaneamente AMBER.

**Procedimento**:
1. **Detecção automática**: trigger fires via BCB SGS API + ANFAVEA + Head Supply + Head Gov Relations
2. **Notificação (5 min)**: alerta vai para CSO + CFO + Head of affected session via Slack/Teams
3. **Revisão de tiers**: atualizar tabela de tiers (S1-S4) com novo status macro
4. **Trigger matrix update**: composite recalculado, S6 multiplier = 1.5×
5. **Comunicação**: 1-line note para CEO + Conselho (subject: "[D3] S6 AMBER trigger fired at <timestamp>")

**Não requer aprovação formal**. Execução é automática via script (T2.1).

### 4.2 AMBER → RED (latência alvo: 60 min)

**Trigger**: 1 indicador cruza threshold RED OU 2+ trimestres consecutivos AMBER (S6).

**Procedimento**:
1. **Detecção automática** (idêntica a 4.1)
2. **Notificação imediata** (15 min): CSO + CFO + CEO + Head Supply + Head Gov Relations + Head Marketing
3. **Comitê de crise convocado** (60 min): reunião física ou Zoom
4. **Decisões a tomar**:
   - Aprovar escalation de S1-S4 (cost incremental R$ 100-200M)
   - Aprovar bridge financing R$ 800M (se S3 RED simultâneo)
   - Aprovar defensivo Tier 3 + comunicação (se S4 RED simultâneo)
   - Autorizar freeze de despesas (exceto approved list)
5. **Comunicação formal**: nota para Conselho + Board global
6. **Trigger matrix update**: composite recalculado, S6 multiplier = 2.0×

**Requer aprovação CEO + Board (para R$ 800M+)**.

### 4.3 RED → AMBER (latência alvo: 24h)

**Trigger**: 1 indicador que estava RED volta para AMBER (1 trimestre de confirmação).

**Procedimento**:
1. **Confirmação trimestral**: 1 trimestre de dados mostrando que o indicador está sustentadamente AMBER
2. **Comitê de desmobilização** (24h): CSO + CFO decidem plano de desmobilização ordenada
3. **Ações**:
   - Desmobilizar bridge financing (se ativo): manter como opção, mas não usar
   - Reduzir defensivo Tier 3 → Tier 2
   - Desmobilizar plano B de supply
   - Descongelar despesas (manter review)
4. **Comunicação**: nota para Conselho confirmando mudança
5. **Trigger matrix update**: composite recalculado, S6 multiplier = 1.5×

**Requer aprovação CSO + CFO**. Não precisa de CEO se cost reduction < R$ 50M.

### 4.4 AMBER → GREEN (latência alvo: 72h)

**Trigger**: 3 indicadores macro sustentadamente GREEN por 2 trimestres consecutivos.

**Procedimento**:
1. **Confirmação trimestral**: 2 trimestres de dados
2. **Recalibração oportunística** (72h): CSO avalia cortes
3. **Ações**:
   - Cortar advocacy expandida (volta para R$ 12M baseline)
   - Hedge re-otimizado (volta para h* baseline do S3)
   - Defensivo reduz 1 tier
   - Descongelar fully despesas
4. **Comunicação**: nota para Conselho

**Requer aprovação CSO + CFO + CEO (mudança significativa de política)**.

---

## 5. Auto-trigger S6 → S1-S5 (T2.1 do Phase 2)

### 5.1 Arquitetura

```
[Data sources]                    [Trigger engine]                  [Actions]
- BCB SGS API (PTAX)              ┌──────────────┐                 - Slack alert (5 min)
- ANFAVEA (market share)          │ Status check │  composite      - Tier update (auto)
- Head Supply (VaR realized)  →   │   S1-S6     │  recalc         - Composite update
- Head Gov Relations (BNDES)      │              │                 - Communication note
- BCB + IBGE (macro)              └──────────────┘                 - Action register
```

### 5.2 Implementação (Q4 2026, T2.1)

- **Stack**: Node.js + cron job + Slack webhook + database (action register)
- **Cadência**: 1× por dia (8am BRT) + on-demand (quando threshold cruza)
- **Latência alvo**: detecção → notificação ≤ 5 min
- **Backstop**: se script falhar, alerta manual via WhatsApp group (CSO + CFO + CEO)

### 5.3 Critérios de validação do auto-trigger

- False positive rate ≤ 5% (de 100 triggers, ≤ 5 são spurious)
- False negative rate ≤ 1% (≤ 1 missed trigger por trimestre)
- Latência p95 ≤ 5 min
- Recovery time após falha ≤ 1h

---

## 6. Backtesting protocol

Antes de ativar o trigger matrix em produção, é necessário validar com dados históricos (2020-2026).

### 6.1 Dados necessários

- **PTAX** daily 2020-2026 (BCB SGS)
- **IPCA, PIB, FGV** monthly 2020-2026 (IBGE, FGV)
- **Market share** mensal (ANFAVEA + dados Tesla/VW/GM)
- **VaR supply** aproximado (estimativa baseada em notícias)
- **BNDES funding** decisões públicas

### 6.2 Cenários de backtest

| Cenário | Período | Stress |
|---|---|---|
| COVID-19 (2020) | Mar-Dec 2020 | PIB -3.9%, IPCA peak 12%, PTAX > 5.70 |
| Supply chain (2021) | Q1-Q4 2021 | Disrupção semicondutores, lítio +400% |
| Election year (2022) | Q1-Q4 2022 | PIB volátil, IPCA peak 12%, PTAX > 5.20 |
| Recent normal (2023-2024) | Q1 2023 - Q4 2024 | Calibração de false positives |
| BNDES stress (2025) | Q1-Q4 2025 | Funding delays (simulado) |

### 6.3 Métricas de sucesso

- **Trigger fires corretos**: 100% dos stress reais (COVID, lítio) devem ter gerado triggers
- **False positives**: ≤ 5% dos triggers são spurious (calibração de threshold)
- **Latência média**: ≤ 24h (backtest tem 1 dia de granularidade)
- **Action efficacy**: 80% das ações tomadas pós-trigger são classificadas como "úteis" por post-mortem

### 6.4 Timeline de backtesting

- Q3 2026: coletar dados + script de backtest
- Q4 2026: rodar backtest em 5 cenários
- Q1 2027: ajustar thresholds se false positive > 5%
- Q2 2027: ativar trigger matrix em produção (Q2 2027+)

---

## 7. Approval gates (quem pode autorizar o quê)

| Decisão | Custo | Approver |
|---|---|---|
| Mudança de tier defensivo (S4) | < R$ 50M | CMO |
| Mudança de h* hedge (S1) | < R$ 50M | CFO |
| Advocacy expandida (S3) | < R$ 30M | CEO |
| Plano B supply acionado (S2 RED) | R$ 80-200M | CEO |
| **Bridge financing (S3 RED)** | **R$ 800M** | **CEO + Board global** |
| **Comitê de crise (S6 RED)** | **R$ 165-200M** | **CEO + Board global** |
| Trigger matrix update (cadência) | R$ 0 | CSO (auto) |
| Backtesting | R$ 200-300k dev | CSO + Head Data |
| Threshold recalibration | R$ 0 | CSO + Conselho |

**Regras**:
- Custo < R$ 50M: 1 approver (CFO ou CMO ou CEO, conforme sessão)
- R$ 50M - R$ 200M: 2 approvers (CEO + Board local)
- R$ 200M+: 3 approvers (CEO + Board global)
- Decisões de R$ 800M+ (bridge financing): exige aprovação Board global da BYD

---

## 8. Failure modes & recovery

### 8.1 False positive (trigger fires when shouldn't)

**Exemplo**: PTAX spike 1 dia, vol 30d não cruza threshold mas sistema dispara AMBER.

**Recovery**:
- CSO revisa em 24h, downgrade se confirmado false positive
- Thresholds ajustados se padrão recurrente
- Log em action register para audit trail

### 8.2 False negative (trigger should fire but didn't)

**Exemplo**: Supply stress materializa mas VaR realized não é detectado a tempo.

**Recovery**:
- Head Supply reporta manualmente
- Trigger forced via Slack command (CSO autoriza)
- Investigação de root cause (data lag, API error)
- Adicionar fallback data source se padrão recurrente

### 8.3 Script failure (auto-trigger quebra)

**Exemplo**: BCB API fora do ar, script não roda.

**Recovery**:
- Alerta via WhatsApp group em 1h
- CSO aciona manualmente via Slack command
- Investigação de root cause em 24h
- Switch para fallback data source se necessário

### 8.4 Approver unavailable (CEO viajando, S6 RED)

**Recovery**:
- Pre-delegation: CEO delega para CFO + Board Chair em cenários RED
- Backup approver: CFO tem authority de até R$ 200M (cobre committee crisis)
- Emergency: comitê pode decidir com quorum de 3/5 (CEO ausente é OK)

---

## 9. Cadência de revisão

| Cadência | Owner | Output |
|---|---|---|
| Diária (8am BRT) | Auto-trigger script | Composite update, alert if transition |
| Semanal | CSO | Quick review de status S1-S6 |
| Mensal | CSO + Conselho | Composite report, 5 páginas |
| Trimestral | CSO + CFO + CEO | Calibration log update, 1-3 recalibrações |
| Anual | CSO + Conselho | Stress test integrado, framework review |

---

## 10. Pontos abertos / limitações

1. **Threshold para S2 (VaR realized ratio) é heurístico**. Pode precisar calibração após 6-12 meses de operação
2. **S5 stakeholder health** é qualitativo. Pode virar quantitativo com KPI objetivos após primeiro ano
3. **S6 transição AMBER/RED exige 2 trimestres** — pode ser tarde para crises rápidas (ex: falência de banco em 1 semana)
4. **Backtesting** depende de dados de 2020-2026 que podem ter lacunas (especialmente VaR supply)
5. **Approval gates** precisam ser validados com Conselho + Board antes de ativar
6. **Auto-trigger** é T2.1 do Phase 2 (Q4 2026). Até lá, trigger é manual via Slack/WhatsApp

---

## 11. Outputs do modelo (referência rápida)

**Arquivo**: `D3-TRIGGER-MATRIX.md` (este documento, 18 cells + 4 procedures + 5 outras seções)
**Documentos complementares**:
- [D3-INTERDEPENDENCY-S6-TRIGGERS.md](./D3-INTERDEPENDENCY-S6-TRIGGERS.md) — macro multiplier
- [D3-DEPENDENCY-GRAPH.md](./D3-DEPENDENCY-GRAPH.md) — onde S6 governor se encaixa
- [D3-MAIN.html §4](./D3-MAIN.html#sec-4) — visual 6×3 heatmap

**Resumo executivo em 1 frase**: trigger matrix 6×3 = 18 cells, 4 procedures de transição (latência 5min/60min/24h/72h), approval gates escalonados por custo (R$ 0-50M / 50-200M / 200M+), backtesting obrigatório em 5 cenários 2020-2026 antes de ativar produção. T2.1 (auto-trigger) previsto para Q4 2026.
