# D3 — Expansion Plan: A + B + C paralelizado

**Documento de orquestração** · Plano completo de expansão D3 v0.5 → v0.6 (Caminho B) → v2.0 (Caminho C)
**Data**: 21/jul/2026
**Status**: Plano de execução · pronto para paralelizar
**Output alvo**: D3 v2.0 (Caminho A + B + C aplicados)

---

## 0. Contexto

O OSINT checkpoint (`D3-OSINT-CHECKPOINT.md`) identificou **10 críticas construtivas** ao D3 v0.5. Para transformar o framework num deliverable state-of-the-art (anexo de vaga + research-grade), o usuário pediu expansão combinando os 3 caminhos:

- **Caminho A** (4h) — adicionar seção "Limitações Conhecidas" + referência ao OSINT checkpoint
- **Caminho B** (20h) — 10 correções: 5 novas dimensões S7-S11, re-mapear probabilidades S3, recalibrar S1↔S4, recalibrar S2
- **Caminho C** (60h+) — re-calibração empírica 2025-2026, game theory 5 players, multivariate sensitivity 4 choques

**Saída intermediária**: D3 v0.6 (Caminhos A + B aplicados)
**Saída final**: D3 v2.0 (Caminhos A + B + C aplicados, research-grade)

---

## 1. Work breakdown structure (WBS)

### 1.1 Caminho A — Quick wins (executar NESTA sessão, ~30 min)

| Tarefa | Tempo | Dependência | Output |
|---|---|---|---|
| **A1** Adicionar seção "Limitações Conhecidas" no D3-MAIN.html | 20 min | nenhuma | `D3-MAIN.html` com nova seção entre §8 e §9 |
| **A2** Atualizar `progress.md` com checkpoint OSINT | 5 min | nenhuma | progress entry |
| **A3** Atualizar `README.md` com referência ao checkpoint | 5 min | nenhuma | 25ª linha do README |

### 1.2 Caminho B — D3 v0.6 (20h, paralelizável em 5 sub-tarefas)

| Tarefa | Tempo | Dependência | Output |
|---|---|---|---|
| **B1** Construir S7 (ESG/Reputação) | 3h | nenhuma | `D3-INTERDEPENDENCY-S7-ESG.md` + 2 figuras |
| **B2** Construir S8 (Production Ramp) | 3h | nenhuma | `D3-INTERDEPENDENCY-S8-RAMP.md` + 2 figuras |
| **B3** Construir S9 (Demand Growth) | 3h | nenhuma | `D3-INTERDEPENDENCY-S9-DEMAND.md` + 2 figuras |
| **B4** Construir S10 (Tariff Policy) | 3h | nenhuma | `D3-INTERDEPENDENCY-S10-TARIFF.md` + 2 figuras |
| **B5** Construir S11 (Competitive Intensity) | 4h | nenhuma | `D3-INTERDEPENDENCY-S11-COMPETITION.md` + 3 figuras |
| **B6** Re-mapear probabilidades S3 (market share realized) | 2h | B3 (parcial) | `D3-RECALIBRATION-S3-PROBABILITIES.md` |
| **B7** Recalibrar S1↔S4 (tariff 35% Jan/2027) | 2h | B4 | `D3-RECALIBRATION-S1-S4-TARIFF.md` |
| **B8** Recalibrar S2 (lítio rebound 2026) | 2h | nenhuma | `D3-RECALIBRATION-S2-LITHIUM-2026.md` |
| **B9** Atualizar D3-MAIN.html para v0.6 (11 dimensões) | 2h | B1-B8 | `D3-MAIN.html` v0.6 |
| **B10** Atualizar D3-ANNEX.html para v0.6 | 1h | B1-B8 | `D3-ANNEX.html` v0.6 |
| **B11** Atualizar D3-DECISION-TREES.html (4×3×11=132 cells) | 2h | B1-B5 | `D3-DECISION-TREES.html` v0.6 |
| **B12** Atualizar D3-RACI.md com novos owners | 1h | B1-B5 | `D3-RACI.md` v0.6 |

**Total B**: ~28h (paralelizável em 5 agents)

### 1.3 Caminho C — D3 v2.0 (60h+, paralelizável em 4 sub-tarefas)

| Tarefa | Tempo | Dependência | Output |
|---|---|---|---|
| **C1** Re-calibração empírica com dados 2025-2026 (Q1-Q2 2026) | 16h | nenhuma | `D3-RECALIBRATION-EMPIRICAL-2026.md` + 4 figuras |
| **C2** Game theory layer (5 players) | 20h | C1 | `D3-GAME-THEORY.md` + 6 figuras |
| **C3** Multivariate sensitivity 4 choques | 16h | C1 | `D3-MULTIVARIATE-SENSITIVITY.md` + 8 figuras |
| **C4** Consolidar D3 v2.0 (todos os docs + HTMLs) | 12h | C1-C3 | `D3-MAIN.html` v2.0 + `D3-ANNEX.html` v2.0 + `D3-DECISION-TREES.html` v2.0 |
| **C5** Validar com backtesting empírico (2020-2025) | 8h | C1-C4 | `D3-BACKTESTING-VALIDATION.md` |

**Total C**: ~72h (paralelizável em 4 agents)

### 1.4 Total expansion

| Caminho | Tempo | Output |
|---|---|---|
| A | 0.5h | D3 v0.5.1 (limitações adicionadas) |
| B | 28h | D3 v0.6 (11 dimensões) |
| C | 72h | D3 v2.0 (research-grade) |
| **Total** | **~100h** | **D3 v2.0** |

---

## 2. Estratégia de paralelização (swarm agents)

### 2.1 Wave 1 (paralelo, ~3h) — Quick foundation

Executar **5 agents em paralelo** construindo as 5 novas dimensões S7-S11:

| Agent | Tarefa | Input | Output |
|---|---|---|---|
| **Agent-B1** | S7 ESG/Reputação | OSINT checkpoint #1 + Wikipedia BYD Brazil | `D3-INTERDEPENDENCY-S7-ESG.md` |
| **Agent-B2** | S8 Production Ramp | OSINT checkpoint #3 + Reuters delays | `D3-INTERDEPENDENCY-S8-RAMP.md` |
| **Agent-B3** | S9 Demand Growth | OSINT checkpoint #7 + ANFAVEA data | `D3-INTERDEPENDENCY-S9-DEMAND.md` |
| **Agent-B4** | S10 Tariff Policy | OSINT checkpoint #5 + Reuters tariff | `D3-INTERDEPENDENCY-S10-TARIFF.md` |
| **Agent-B5** | S11 Competitive | OSINT checkpoint #6 + Stellantis/GM/VW/Geely | `D3-INTERDEPENDENCY-S11-COMPETITION.md` |

**Inputs compartilhados**:
- `D3-OSINT-CHECKPOINT.md` (análise crítica)
- `D3-INTERDEPENDENCY-S5-COUPLED.md` (template de doc analítico)
- Schema JSON para outputs estruturados

**Output contract** (cada agent):
```yaml
output:
  file: "D3-INTERDEPENDENCY-S{X}-{Y}.md"
  size_target: "8-12 KB"
  sections:
    - "Por que esta análise" (~200 palavras)
    - "Componentes de risco" (tabela 3-5 linhas)
    - "Modelo" (fórmulas em pseudocódigo)
    - "Acoplamentos" (com S1-S6 já existentes)
    - "Trigger thresholds" (GREEN/AMBER/RED)
    - "Implicações" (3-5 bullets)
    - "Limitações" (~150 palavras)
  figures:
    - "fig-d3-s{X}-{N}-*.png" (2 figuras via antv API)
```

### 2.2 Wave 2 (paralelo, ~2h) — Recalibrações

Executar **3 agents em paralelo** recalibrando modelos existentes:

| Agent | Tarefa | Output |
|---|---|---|
| **Agent-B6** | Re-map S3 probabilities | `D3-RECALIBRATION-S3-PROBABILITIES.md` |
| **Agent-B7** | Recalibrar S1↔S4 (tariff) | `D3-RECALIBRATION-S1-S4-TARIFF.md` |
| **Agent-B8** | Recalibrar S2 (lítio 2026) | `D3-RECALIBRATION-S2-LITHIUM-2026.md` |

### 2.3 Wave 3 (sequencial, ~6h) — Integration

Re-publicar D3 v0.6 (B1-B8 aplicados) + validar com stakeholder review simulado.

| Tarefa | Tempo | Dependência |
|---|---|---|
| **B9** D3-MAIN.html v0.6 | 2h | B1-B8 |
| **B10** D3-ANNEX.html v0.6 | 1h | B1-B8 |
| **B11** D3-DECISION-TREES.html v0.6 | 2h | B1-B5 |
| **B12** D3-RACI.md v0.6 | 1h | B1-B5 |

### 2.4 Wave 4 (paralelo, ~16h) — Caminho C

Executar **3 agents em paralelo** para D3 v2.0:

| Agent | Tarefa | Output |
|---|---|---|
| **Agent-C1** | Re-calibração empírica 2025-2026 | `D3-RECALIBRATION-EMPIRICAL-2026.md` + 4 figuras |
| **Agent-C2** | Game theory (5 players) | `D3-GAME-THEORY.md` + 6 figuras |
| **Agent-C3** | Multivariate sensitivity 4 choques | `D3-MULTIVARIATE-SENSITIVITY.md` + 8 figuras |

### 2.5 Wave 5 (sequencial, ~20h) — Caminho C integration + validation

| Tarefa | Tempo | Dependência |
|---|---|---|
| **C4** D3 v2.0 (todos HTMLs) | 12h | C1-C3 |
| **C5** Backtesting validation 2020-2025 | 8h | C4 |

---

## 3. Output contracts (templates para swarm agents)

### 3.1 Schema JSON para dimensão Sx

```json
{
  "dimension_id": "S7",
  "name": "ESG / Reputação",
  "type": "qualitative + score-based",
  "inputs": [
    "lista_suja_status",
    "msci_score",
    "controversies_count",
    "news_sentiment_score"
  ],
  "weights": { "lista_suja": 0.40, "msci": 0.30, "controversies": 0.20, "news": 0.10 },
  "status_thresholds": {
    "GREEN": {"lista_suja": false, "msci": ">=BB", "controversies": 0, "news": "neutral"},
    "AMBER": {"lista_suja": false, "msci": "B", "controversies": "1-2", "news": "negative"},
    "RED": {"lista_suja": true, "msci": "<=CCC", "controversies": ">=3", "news": "very_negative"}
  },
  "current_status_BYD": "RED (lista suja desde abr/2026, MSCI rating unknown, controversies >=3)",
  "composite_weight": 0.10,
  "coupling": {
    "with_S3": "AMBER+ if lista suja OR controversies >=3 (block BNDES funding)",
    "with_S6": "no coupling (independent dimension)",
    "with_S7_S8_S9_S10_S11": "see B1-B5 docs"
  }
}
```

### 3.2 Schema JSON para acoplamento Sx↔Sy

```json
{
  "coupling_id": "S7_S3",
  "primary_dim": "S7",
  "secondary_dim": "S3",
  "question": "Como o status ESG afeta o acesso a funding BNDES?",
  "quantitative_impact": {
    "if_S7_RED_and_S3_GREEN": {
      "BNDES_funding_p_blocked": 0.95,
      "rationale": "Lista suja impede acesso a crédito público, mesmo com BNDES aprovado"
    }
  },
  "trigger_recommendation": "S7 RED triggers automatic BNDES funding block, regardless of S3 status"
}
```

---

## 4. Cronograma de execução

### 4.1 Esta sessão (root session)

| Bloco | Tempo | O quê |
|---|---|---|
| Setup | 5 min | Ler OSINT checkpoint + existing docs |
| **A1** | 20 min | D3-MAIN.html seção "Limitações Conhecidas" |
| **A2-A3** | 10 min | Update progress.md + README |
| **Wave 1 launch** | 5 min | Disparar 5 agents B1-B5 (background) |
| **Wave 2 launch** | 5 min | Disparar 3 agents B6-B8 (background) |
| **Wave 1 integration** | 30 min | Após B1-B5 voltarem, ler outputs, validar |
| **B9-B12** | 6h | Atualizar D3-MAIN.html v0.6, D3-ANNEX.html, D3-DECISION-TREES, RACI |
| **Wave 4 launch** | 5 min | Disparar 3 agents C1-C3 (background, ~16h) |
| **C4-C5** | 20h | Após C1-C3 voltarem, consolidar D3 v2.0 |
| **TOTAL** | **~28h** | D3 v2.0 pronto |

### 4.2 Agents paralelos (background)

- 5 agents B1-B5 rodando em paralelo, ~3h cada
- 3 agents B6-B8 rodando em paralelo, ~2h cada
- 3 agents C1-C3 rodando em paralelo, ~16h cada

---

## 5. Riscos & mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Agent outputs inconsistentes | Média | Médio | Schema JSON estrito + review |
| Latência alta (15+ min para background) | Média | Baixo | Pode prosseguir com Wave 2/3 em paralelo |
| Output duplicado entre agents | Baixa | Baixo | Cada agent escreve em arquivo único |
| Conflito de edição no D3-MAIN.html | Alta | Alto | B9 só edita após B1-B8 completarem |
| Falta de dados 2026 (alguns) | Média | Médio | Documentar limitações explicitamente |
| Caminho C exige 16h+ por agent | Alta | Médio | Caminho C é opcional; v0.6 (sem C) já é bom |

---

## 6. Métricas de sucesso (definition of done)

### 6.1 Para Caminho A
- [ ] D3-MAIN.html tem seção "Limitações Conhecidas" visível
- [ ] D3-OSINT-CHECKPOINT.md referenciado
- [ ] progress.md + README atualizados

### 6.2 Para D3 v0.6 (Caminho B)
- [ ] 5 novos docs INTERDEPENDENCY criados (S7-S11)
- [ ] 3 novos docs RECALIBRATION criados (S3 prob, S1↔S4 tariff, S2 lítio 2026)
- [ ] D3-MAIN.html republicado com 11 dimensões
- [ ] D3-ANNEX.html republicado
- [ ] D3-DECISION-TREES.html republicado (4×3 com overlays S7-S11)
- [ ] D3-RACI.md republicado com novos owners
- [ ] Total: 5 + 3 = 8 novos docs + 4 HTMLs atualizados

### 6.3 Para D3 v2.0 (Caminho C)
- [ ] Re-calibração 2025-2026 com dados Q1-Q2 2026
- [ ] Game theory com 5 players (BYD, Stellantis, GM, VW, Geely)
- [ ] Multivariate sensitivity com 4 choques (FX, lítio, tarifa, demanda)
- [ ] Backtesting 2020-2025 com accuracy ≥ 80%
- [ ] D3-MAIN.html v2.0 + D3-ANNEX.html v2.0 + D3-DECISION-TREES.html v2.0
- [ ] Total: 3 novos docs + 4 figuras + 3 HTMLs atualizados

---

## 7. Resumo executivo (1 página)

<strong>Objetivo</strong>: transformar D3 v0.5 (já robusto em estrutura) em D3 v2.0 (research-grade) aplicando 10 correções OSINT + 5 novas dimensões + game theory + sensitivity multivariada.

<strong>Estratégia</strong>: paralelizar via 11 swarm agents (5 B + 3 B + 3 C) em 5 waves. Cada agent tem output contract estrito (schema JSON + template de doc). Root session integra outputs e republica HTMLs.

<strong>Timeline</strong>:
- Wave 1 (3h, paralelo): 5 agents B1-B5 (S7-S11)
- Wave 2 (2h, paralelo): 3 agents B6-B8 (recalibrações)
- Wave 3 (6h, sequencial): B9-B12 (integração v0.6)
- Wave 4 (16h, paralelo): 3 agents C1-C3 (game theory, sensitivity, empirical 2026)
- Wave 5 (20h, sequencial): C4-C5 (v2.0 + backtesting)
- <strong>Total wall time</strong>: ~28h (com paralelização) vs ~100h (sequencial)

<strong>Investimento</strong>:
- Caminho A: 0.5h (esta sessão) → D3 v0.5.1
- Caminho B: 28h total (10h root + 18h agents) → D3 v0.6
- Caminho C: 36h (12h root + 24h agents) → D3 v2.0

<strong>Outputs</strong>:
- v0.5.1: D3-MAIN.html com limitações reconhecidas
- v0.6: 5 novos docs S7-S11 + 3 recalibrações + 4 HTMLs atualizados
- v2.0: 3 novos docs research-grade + backtesting validado

<strong>Próximo passo</strong>: executar Caminho A (30 min) → lançar Wave 1 (5 agents em background) → integrar em v0.6 (6h) → lançar Wave 4 (3 agents) → v2.0 (20h).
