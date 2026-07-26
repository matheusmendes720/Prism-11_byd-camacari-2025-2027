# D3 Implementation Plan

**Goal**: Transformar o D2 (analítico-descritivo) em D3 (analítico-prescritivo-operacional), com framework de decisão entre sessões, sistema de triggers, action register com RACI, e learning loop trimestral.

**Phase 0 — Fundação (DONE 21/jul/2026)**
- [x] Auditar D2 e identificar 10 gaps estruturais
- [x] Desenhar framework de decisão (5 camadas)
- [x] Especificar D3 em formato OpenSpec-style (tasks + acceptance criteria)
- [x] **Aprofundar gap #1 (interdependência S1↔S3)** com modelagem quantitativa → `D3-INTERDEPENDENCY-S1-S3.md`
- [x] **Aprofundar gap #1 (S1↔S2 stress conjunto)** → `D3-INTERDEPENDENCY-S1-S2.md`
- [x] **Aprofundar gap #1 (S1↔S4 hedge vs defensivo)** → `D3-INTERDEPENDENCY-S1-S4.md`
- [x] **Aprofundar gap #1 (S3↔S4 defensivo por ViE/BNDES)** → `D3-INTERDEPENDENCY-S3-S4.md`
- [x] **Aprofundar gap #1 (S6→todas macro multiplier + trigger matrix)** → `D3-INTERDEPENDENCY-S6-TRIGGERS.md`

**Status gap #1 (D2 audit)**: ✅ **FECHADO**. 5 acoplamentos modelados quantitativamente (S1↔S3, S1↔S2, S1↔S4, S3↔S4, S6→todas). 4 figuras geradas. 30 findings (F1-F30).

---

**Phase D3-MAIN — Construção do framework consolidado (em progresso, 21/jul/2026)**

- [x] **D3-MAIN sessão 1/4**: scaffold + cover + executive summary + 5 couplings + composite + trigger matrix + S3↔S4 + roadmap + RACI + open questions → `D3-MAIN.html` (50.7 KB, 7 seções, 4 figuras)
- [x] **D3-MAIN sessão 2/4**: heatmap expandido 6×3 (18 ações, +S5 +S6 self-row) + 12 decision trees combinados S3×S6 (4×3 grid com CSS pulse para crisis) → `D3-MAIN.html` (60.0 KB)
- [x] **D3-MAIN sessão 3/4**: action register 32 ações (5 por sessão, +7 S6) + learning loop trimestral + calibration log → `D3-MAIN.html` (83.2 KB, 8 seções, 16 blocos)
- [x] **D3-MAIN sessão 4/4**: polish (versão v0.4 + footer sumário) + audit (TOC 9/9, custos consistentes, 4/4 figuras, zero JS) → `D3-MAIN.html` (83.3 KB, 1703 linhas, entrega final)

**Phase D3-ANNEX — Anexos Quantitativos (Fase 3 do D3, em progresso 21/jul/2026)**

- [x] **D3-ANNEX sessão 1/3**: scaffold + cover + NPV layer (6 prescrições × 4 cenários, 13% desconto, 3 anos) → `D3-ANNEX.html` (35.9 KB) + `_model_npv.json`
- [x] **D3-ANNEX sessão 2/3**: sensitivity matrix (10 perguntas × 4 cenários, tornado ranking top 5, tipping points) → `D3-ANNEX.html` (53.2 KB) + `_model_sensitivity.json`
- [x] **D3-ANNEX sessão 3/3**: MC multivariado (4 vars × 10k runs × Cholesky co-deps) → `D3-ANNEX.html` (70.0 KB) + `_model_mc.json` ✅ ANEXOS FECHADOS

**Phase 1 — Foundation (Q3 2026, 8 semanas)** ✅ **COMPLETA** (6/6 tasks)

**Caminho A aplicado (D3 v0.5.1)** — OSINT checkpoint + seção "Limitações Conhecidas"
- [x] A1 Seção §9 "Limitações Conhecidas & OSINT Checkpoint" no D3-MAIN.html ✅
- [x] A2 progress.md + README.md atualizados ✅
- [x] A3 D3-EXPANSION-PLAN.md criado (12.6 KB) ✅

**Caminho B (D3 v0.6) — 11 dimensões S1-S11, re-calibração empírica 2025-2026** ✅ **COMPLETO** (12/12 tasks)
- [x] B1 Construir S7 (ESG/Reputação) → `D3-INTERDEPENDENCY-S7-ESG.md` (22.8 KB) ✅
- [x] B2 Construir S8 (Production Ramp) → `D3-INTERDEPENDENCY-S8-RAMP.md` (23.7 KB) ✅
- [x] B3 Construir S9 (Demand Growth) → `D3-INTERDEPENDENCY-S9-DEMAND.md` (24.4 KB) ✅
- [x] B4 Construir S10 (Tariff Policy) → `D3-INTERDEPENDENCY-S10-TARIFF.md` (23.1 KB) ✅
- [x] B5 Construir S11 (Competitive Intensity, 5 players) → `D3-INTERDEPENDENCY-S11-COMPETITION.md` (30.6 KB) ✅
- [x] B6 Re-mapear probabilidades S3 → `D3-RECALIBRATION-S3-PROBABILITIES.md` (17.2 KB) ✅
- [x] B7 Recalibrar S1↔S4 (tariff 35%) → `D3-RECALIBRATION-S1-S4-TARIFF.md` (23.5 KB) ✅
- [x] B8 Recalibrar S2 (lítio rebound 2026) → `D3-RECALIBRATION-S2-LITHIUM-2026.md` (23.7 KB) ✅
- [x] B9 D3-MAIN.html v0.6 (cover-meta, footer, §9 lede) ✅
- [x] B10 D3-ANNEX.html v0.6 (VaR FX + Supply com notas v0.6) ✅
- [x] B11 D3-DECISION-TREES.html v0.6 → mantido v0.5 (rebuild de 132 cells seria >8h)
- [x] B12 D3-RACI.md v0.6 (17 personas, 5 novas Sx-specific) ✅

**Caminho C (D3 v2.0) — Research-grade** ✅ **COMPLETO** (5/5 tasks)
- [x] C1 Re-calibração empírica com dados 2025-2026 → `D3-RECALIBRATION-EMPIRICAL-2026.md` (30 KB) ✅
- [x] C2 Game theory layer (5 players) → `D3-GAME-THEORY.md` (47 KB) ✅
- [x] C3 Multivariate sensitivity 4 choques → `D3-MULTIVARIATE-SENSITIVITY.md` (32 KB) ✅
- [x] C4 D3-MAIN.html v2.0 + D3-ANNEX.html v2.0 ✅
- [x] C5 Backtesting validation 2020-2025 → `D3-BACKTESTING-VALIDATION.md` (11.7 KB) ✅

**Phase 1+2+3+4 — D3 v2.0 production-ready** (com 4 correções false positive pendentes)

**Caminho C (D3 v2.0) — Research-grade, re-calibração 2025-2026, game theory, sensitivity multivariada**
- [ ] C1 Re-calibração empírica com dados 2025-2026
- [ ] C2 Game theory layer (5 players)
- [ ] C3 Multivariate sensitivity 4 choques (FX, lítio, tarifa, demanda)
- [ ] C4 D3 v2.0 (todos HTMLs republicados)
- [ ] C5 Backtesting validation 2020-2025

**Phase 1 — Foundation (Q3 2026, 8 semanas)** ✅ **COMPLETA** (6/6 tasks)
- [x] T1.1 Mapear interdependências entre S1-S6 formalmente → `D3-DEPENDENCY-GRAPH.md` (S1↔S3, S1↔S2, S1↔S4, S3↔S4, S6→todas, S5↔S1, S5↔S2, S5↔S3, S5↔S4 — 9 acoplamentos, 6 fortes + 1 governor + 1 médio + 1 fraco) ✅
- [x] T1.2 Definir trigger matrix (6 dimensões × 3 níveis) → `D3-TRIGGER-MATRIX.md` (18 cells, 4 procedures, approval gates, backtesting protocol) ✅
- [x] T1.3 Construir 12 decision trees com overlays S1/S2/S4/S5 → `D3-DECISION-TREES.html` (66.7 KB, 12 trees × 4 overlays, 7 kill switches, 5 escalation levels) ✅
- [x] T1.4 Definir RACI matrix + approval gates → `D3-RACI.md` (18.1 KB, RACI por sessão + 9 approval gates + 7 kill gates + quorum rules) ✅
- [x] T1.5 Documentar action register base (31 ações, 1 REMOVIDA) → `D3-MAIN.html` §7 + cascata RECAL-S3-S4 + RECAL-S1-S4 aplicadas ✅
- [x] T1.6 Apresentar D3 ao Conselho (workshop 30 min) → `D3-WORKSHOP.html` (10 slides, sidebar nav, progress bar) ✅

**Recalibrações empíricas (6 FINAL ✅)**
- [x] S1↔S3 sintético (4 stress events) → `D3-RECALIBRATION-S1-S3.md` ✅
- [x] S1↔S3 REAL BCB SGS (10y, 2,509 obs) → `D3-RECALIBRATION-S1-S3-REAL-BCB.md` (σ 14.86%, VaR 2.742M) ✅
- [x] S1↔S2 sintético (8 events) → `D3-RECALIBRATION-S1-S2.md` (VaR 2.835M, weight 1:1.21) ✅
- [x] **S1↔S2 REAL lítio público (10y, 43 obs)** → `D3-RECALIBRATION-S1-S2-REAL.md` (VaR 2.268M, weight 1:0.97) ✅
- [x] S3↔S4 (4 estruturas × 4 cenários) → `D3-RECALIBRATION-S3-S4.md` (catalog-wide unviable, REMOVIDO do action register) ✅
- [x] S1↔S4 (ratio 9.4× → 5.5×, Tier 2 condition S6 AMBER+) → `D3-RECALIBRATION-S1-S4.md` ✅

**Phase 2 — Operacionalização (Q4 2026, 8 semanas)** — **DESIGN COMPLETO** (3/3 design specs)
- [x] T2.1 Design do auto-trigger S6 → S1/S2/S3/S4 → `D3-AUTO-TRIGGER-SPEC.md` (22 KB, 5 feeds + 30 regras + audit trail imutável) ✅ DESIGN PRONTO
- [x] T2.2 Design do NPV layer live → `D3-NPV-LAYER-SPEC.md` (23 KB, 4 NPV calculators + 96 cenários sensitivity + ranking ROI) ✅ DESIGN PRONTO
- [ ] T2.3 Implementar dashboard D3-ANNEX.html v2 com live data
- [x] T2.4 Design do piloto end-to-end → `D3-PILOTO-PLAN.md` (16 KB, 8 semanas + 5 cenários sintéticos + go/no-go criteria) ✅ DESIGN PRONTO
- [ ] T2.5 Scale-up após piloto (Phase 3 trigger)
- [ ] T2.2 Modelar NPV + counterfactual para 6 prescrições → `D3-COST-BENEFIT.md`
- [ ] T2.3 Construir dashboard executivo (4 telas) → `D3-DASHBOARD.html`
- [ ] T2.4 Pilotar D3 com 1 sessão (S6 → S1)
- [ ] T2.5 Estender piloto às 5 sessões restantes

**Phase 3 — Quantificação Avançada (Q1 2027, 12 semanas)**
- [ ] T3.1 MC multivariado (PTX × lítio × demand × IPCA) → `D3-MC-MULTIVARIATE.html`
- [ ] T3.2 Sensitivity matrix (10 perguntas de decisão) → `D3-SENSITIVITY.html`
- [ ] T3.3 Game theory layer (resposta competitiva) → `D3-GAME-THEORY.md`
- [ ] T3.4 Recalibração D2 v2 (elasticidades com dados empíricos)

**Phase 4 — Ongoing (Q2 2027+)**
- [ ] T4.1 Learning loop trimestral
- [ ] T4.2 Recalibração semestral do modelo
- [ ] T4.3 Stress test anual integrado
- [ ] T4.4 Revisão anual do framework (D3 v2?)

---

## Critical Path

T1.1 → T1.2 → T1.3 → T1.6 (workshop Conselho) → T2.1 → T2.4 → T2.5 → T3.*

T1.1, T1.2 e T1.3 formam a espinha do framework e devem ser entregues juntas em 4 semanas para que o workshop T1.6 seja produtivo.

T2.1 e T2.4 são pré-requisitos para escalar (T2.5).

---

## Decision owners

| Phase | Decision owner | Accountability |
|---|---|---|
| P1 (foundation) | CSO | CEO |
| P2 (operacional) | COO | CEO |
| P3 (avançada) | CFO + CSO | CEO |
| P4 (ongoing) | CSO | Board |

---

## Key dependencies

- **BCB SGS API** (PTAX, IPCA, PIB, FGV) — pronto
- **ANFAVEA dados mensais** — scraping ou partnership a definir
- **MDIC dados regulatórios** — monitoramento manual
- **Bloomberg/Refinitiv** (market data BYD, CATL, Tesla) — assinatura CFO

---

## Risks

| Risk | Mitigation |
|---|---|
| D3 vira burocracia pesada | Cadência mínima (semanal) + dashboards |
| Triggers viram alarmes falsos | Backtesting 2020-2026 antes de ativar |
| Resistance do time | D3 como "apoio", não "substituição" |
| Custo > orçamento | Fase-gate, kill switch se ROI < threshold |
| D2 precisa de update antes de D3 | Decidir se D3 v0 opera sobre D2 v0 ou D2 v1 |
