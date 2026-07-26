# Decision Framework — Sumário Executivo

**Pacote de design do D3 (análise prescritiva operacional)**
**Data**: 21/jul/2026
**Status**: Draft para revisão

---

## O que tem aqui

| Arquivo | O que é | Quando ler |
|---|---|---|
| `1_framework/D2-AUDIT.md` | Verificação do D2 + 10 gaps estruturais | Primeiro — pra entender o problema |
| `1_framework/DECISION-FRAMEWORK.md` | Arquitetura em 5 camadas + RACI + cadência | Segundo — pra entender a solução |
| `2_couplings/D3-INTERDEPENDENCY-S1-S3.md` | Modelagem quantitativa (S1↔S3) | Terceiro — sizing do hedge cambial |
| `2_couplings/D3-INTERDEPENDENCY-S1-S2.md` | Modelagem quantitativa (S1↔S2) | Quarto — stress conjunto FX + supply |
| `2_couplings/D3-INTERDEPENDENCY-S1-S4.md` | Modelagem quantitativa (S1↔S4) | Quinto — hedge vs pricing defensivo |
| `2_couplings/D3-INTERDEPENDENCY-S3-S4.md` | Modelagem quantitativa (S3↔S4) | Sexto — defensivo por ViE/BNDES |
| `2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md` | Modelagem quantitativa (S6→todas) | Sétimo — macro multiplier + trigger matrix |
| `2_couplings/D3-INTERDEPENDENCY-S5-COUPLED.md` | Modelagem quantitativa (S5↔S1/S2/S3/S4) | Oitavo — partnerships como potenciador (ROI +2099%) |
| `2_couplings/D3-DEPENDENCY-GRAPH.md` | Grafo consolidado 6×6 + 9 acoplamentos | Nono — mapa de navegação entre docs |
| `5_operational/D3-TRIGGER-MATRIX.md` | 18 cells (6×3) + 4 procedures + approval gates | **Décimo — operacional, T1.2 Phase 1** |
| `7_outputs/D3-WORKSHOP.html` | Workshop Conselho (10 slides, 30 min) | **Décimo primeiro — apresentação executiva** |
| `3_recalibration/D3-RECALIBRATION-S1-S3.md` | Refinamento empírico S1↔S3 com PTAX 6y | **Décimo segundo — pré-Phase 2** |
| `3_recalibration/D3-RECALIBRATION-APPLIED.md` | 3 ajustes aplicados (σ, thresholds, h*) + trade-off | **Décimo terceiro — atualização do modelo S1↔S3** |
| `3_recalibration/D3-RECALIBRATION-S1-S2.md` | VaR supply 5.18B → 2.835B (-45%) + weight recalibrado | **Décimo quarto — refinamento S1↔S2** |
| `3_recalibration/D3-RECALIBRATION-S3-S4.md` | Defensivo break-even com 4 estruturas; catalog-wide unviable | **Décimo quinto — refinamento S3↔S4** |
| `3_recalibration/D3-RECALIBRATION-S1-S4.md` | Ratio hedge/defensivo cai 9.4× → 5.5×; defensivo conditional S6 AMBER+ | **Décimo sexto — refinamento S1↔S4** |
| `3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md` | BCB PTAX real 10y (2015-2025) — σ 14.86%, VaR R$ 2.742M | **Décimo sétimo — recalibração FINAL com dados reais** |
| `3_recalibration/D3-RECALIBRATION-S1-S2-REAL.md` | Lítio público real 10y (2015-2025) — VaR supply R$ 2.268M, weight 1:0.97 | **Décimo oitavo — recalibração FINAL S1↔S2 com dados reais** |
| `5_operational/D3-DECISION-TREES.html` | 12 árvores S3×S6 com overlays S1/S2/S4/S5 + kill switches + escalation | **Décimo nono — operacional, T1.3 Phase 1** |
| `5_operational/D3-RACI.md` | RACI por sessão + 9 approval gates + 7 kill gates + quorum rules | **Vigésimo — operacional, T1.4 Phase 1** |
| `5_operational/D3-AUTO-TRIGGER-SPEC.md` | Auto-trigger S6 → S1/S2/S3/S4 (5 feeds + 30 regras + audit trail) | **Vigésimo primeiro — T2.1 Phase 2 design** |
| `5_operational/D3-NPV-LAYER-SPEC.md` | NPV live + sensitivity 96 cenários + ranking ROI marginal | **Vigésimo segundo — T2.2 Phase 2 design** |
| `5_operational/D3-PILOTO-PLAN.md` | Piloto end-to-end (escopo, KPIs, 5 cenários sintéticos, go/no-go) | **Vigésimo terceiro — T2.4 Phase 2 design** |
| `8_integration/D3-OSINT-CHECKPOINT.md` | Auditoria independente com dados públicos (10 críticas + 3 caminhos de re-trabalho) | **Vigésimo quarto — checkpoint pré-Phase 2** |
| `8_integration/D3-EXPANSION-PLAN.md` | Plano de expansão A + B + C paralelizado (5 waves, 11 swarm agents) | **Vigésimo quinto — orquestração expansion** |
| `2_couplings/D3-INTERDEPENDENCY-S7-ESG.md` | ESG/Reputação (lista suja, MSCI, controversies, news) | **Vigésimo sexto — S7 (Caminho B)** |
| `2_couplings/D3-INTERDEPENDENCY-S8-RAMP.md` | Production Ramp (capacidade, SKD/CKD, nacionalização) | **Vigésimo sétimo — S8 (Caminho B)** |
| `2_couplings/D3-INTERDEPENDENCY-S9-DEMAND.md` | Demand Growth (EV share, YoY, BYD share) | **Vigésimo oitavo — S9 (Caminho B)** |
| `2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md` | Tariff Policy (BEV/PHEV/HEV/SKD-CKD) | **Vigésimo nono — S10 (Caminho B)** |
| `2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md` | Competitive Intensity (5 players: Stellantis, GM, VW, Geely, BYD) | **Trigésimo — S11 (Caminho B)** |
| `3_recalibration/D3-RECALIBRATION-S3-PROBABILITIES.md` | Re-map S3 (Expansão 75% vs 15% em v0.5) | **Trigésimo primeiro — B6 (Caminho B)** |
| `3_recalibration/D3-RECALIBRATION-S1-S4-TARIFF.md` | Ratio hedge/defensivo 5.5×→9.4× pós-tariff | **Trigésimo segundo — B7 (Caminho B)** |
| `3_recalibration/D3-RECALIBRATION-S2-LITHIUM-2026.md` | VaR supply R$ 2.27→3.5-4.0bi, weight 1:0.97→1:1.46 | **Trigésimo terceiro — B8 (Caminho B)** |
| `8_integration/D3-v0.6-INTEGRATION.md` | Ponte entre 8 novos docs e D3-MAIN.html (11 dim, 20 couplings, 36 ações) | **Trigésimo quarto — D3 v0.6 integration** |
| `3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md` | Re-calibração empírica 2025-2026 (σ PTAX 11.2%, σ lítio 95%, VaR R$ 8.21bi 4-chock) | **Trigésimo quinto — C1 Caminho C** |
| `4_quantitative/D3-GAME-THEORY.md` | Game theory 5 players × 2 strategies (32 cells, NASH E3 estável) | **Trigésimo sexto — C2 Caminho C** |
| `4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` | Monte Carlo 10k paths + 4 choques simultâneos (VaR R$ 8.21bi, CVaR R$ 10.14bi) | **Trigésimo sétimo — C3 Caminho C** |
| `4_quantitative/D3-BACKTESTING-VALIDATION.md` | Backtesting 2020-2025 (100% true positive, 0% false negative, 88.9% composite) | **Trigésimo oitavo — C5 Caminho C** |
| `4_quantitative/D3-FALSE-POSITIVE-FIXES.md` | 4 correções: hysteresis, carry trade filter, lítio asymmetry, 5-day confirmation | **Quadragésimo — v2.0.1 fix pack (5/5 targets PERFEITO)** |
| `8_integration/D3-FUTURE-ROADMAP.md` | Roadmap v2.2 → v4.0 se contratado (cód, pilot, prod, expansion) | **Quadragésimo primeiro — strategic log** |
| `6_pitch/D3-PITCH-DECK.html` | SPA pitch deck 13 slides (keyboard nav, **7 SVG diagrams**, print-ready) | **Quadragésimo segundo — pitch deck SPA** |
| `6_pitch/D3-PRESENTATION-SCRIPT.md` | Roteiro de apresentação oral 30 min (slide-by-slide + Q&A antecipadas) | **Quadragésimo terceiro — pitch script** |
| `6_pitch/D3-PITCH-1PAGE.md` | Pitch executivo de 1 página (anexo de vaga, status BYD jul/2026, ROI) | **Trigésimo nono — pitch final** |

**Versão atual**: D3 v2.0.1 (5/5 targets backtesting PERFEITO)
| `1_framework/D3-PRESCRIPTIVE-SPEC.md` | Spec formal do D3 (OpenSpec-style) | Oitavo — pra implementar |
| `7_outputs/D3-MAIN.html` | Framework consolidado (8 seções, 4 figuras, 31 ações, 12 decision trees) | **Nono — para o Conselho ver primeiro** |
| `7_outputs/figures/` | 14 PNGs (S1↔S3, S1↔S2, S1↔S2-REAL, S1↔S4, S3↔S4, S6) | Referência visual |
| `.planning/task_plan.md` | Roadmap Fase 1-4 com 19 tasks + status | Quando for começar a executar |
| `.planning/findings.md` | 30 findings detalhados (10 audit + 6 S1↔S3 + 7 S1↔S2/S1↔S4 + 7 S3↔S4/S6) | Referência técnica |
| `7_outputs/D3-ANNEX.html` | Anexos quantitativos (NPV, sensitivity, MC) | Décimo — auditoria CFO/Risk Officer |
| `5_operational/D3-DECISION-TREES.html` | 12 árvores condicionais (S3×S6 × overlays S1/S2/S4/S5) | **Vigésimo primeiro — operacional Conselho/CSO** |
| `5_operational/D3-RACI.md` | RACI matrix + 9 approval gates + 7 kill gates | **Vigésimo segundo — operacional CFO/CEO/Board** |
| `.planning/progress.md` | Log de decisões e marcos | Atualizar durante execução |

---

## A tese em 1 parágrafo

D2 é uma boa fotografia preditiva, mas é um playbook fraco. As 6 sessões são tratadas como dimensões paralelas, mas as prescrições têm acoplamentos fortes (hedge depende de BNDES, dual-sourcing depende de narrativa de importação, etc.). D3 preenche essa lacuna com **5 camadas funcionais** (Data, Signal, Decision, Action, Learning) que transformam o D2 em sistema operacional contínuo. **Gap #1 do D2 audit (interdependências não modeladas) está fechado** com 5 acoplamentos quantitativos: S1↔S3, S1↔S2, S1↔S4, S3↔S4, S6→todas. Economia potencial D3 vs D2: R$ 230-330M/ano (R$ 700M-1bi em 3 anos).

---

## Os 10 gaps do D2 (resumo)

1. **Interdependências não modeladas** — 6 sessões paralelas, prescrições acopladas
2. **Sem branching condicional** — todas as prescrições são "faça X" sem "se Y, senão Z"
3. **Sem NPV / cost-benefit** — custos listados, valor da mitigação não calculado
4. **Sem counterfactual** — "e se não fizéssemos nada?" ausente
5. **Triggers dispersos** — em 3 sessões diferentes, sem sistema unificado
6. **Sem ownership** — quem decide cada prescrição?
7. **Análise competitiva unidirecional** — BYD reage, mas concorrentes também
8. **MC só em S1** — composite é multivariado, MC deveria ser também
9. **Macro descritivo, não prescritivo** — S6 mostra correlações, não aciona ações
10. **Sem sensitivity na pergunta de decisão** — resposta "sim" sem pontos de reversão

---

## A arquitetura D3 (5 camadas)

```
Layer 5: LEARNING     — post-mortem trimestral + recalibração
Layer 4: ACTION       — action register com RACI, KPI, status
Layer 3: DECISION     — 12 decision trees + cost-benefit + sensitivity
Layer 2: SIGNAL       — trigger matrix (6×3) + heatmap agregado
Layer 1: DATA         — D2 sessions, composite, refresh automático
```

---

## Os 5 acoplamentos modelados (gap #1 fechado)

| Coupling | Pergunta | Resumo quantitativo | Doc |
|---|---|---|---|
| **S1↔S3** | Como o hedge cambial ótimo depende do BNDES? | h* = 30% (Expansão) → 91% (Rollback Total) | [S1↔S3](./2_couplings/D3-INTERDEPENDENCY-S1-S3.md) |
| **S1↔S2** | E quando supply chain estressa junto? | 12 combinações; supply VaR 2.5× FX VaR em S2 RED | [S1↔S2](./2_couplings/D3-INTERDEPENDENCY-S1-S2.md) |
| **S1↔S4** | Hedge FX vs pricing defensivo? | R$ 480/unit vs R$ 4.500/unit (9.4× ratio) | [S1↔S4](./2_couplings/D3-INTERDEPENDENCY-S1-S4.md) |
| **S3↔S4** | Defensivo muda viabilidade com ViE? | Break-even ViE=10%; catalog-wide destrutivo em RB Total | [S3↔S4](./2_couplings/D3-INTERDEPENDENCY-S3-S4.md) |
| **S6→todas** | Como macro reescala as prescrições? | Multiplier 1.0/1.5/2.0×; composite 65/78/88 | [S6→todas](./2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md) |

**Economia D3 vs D2**: R$ 230-330M/ano (R$ 700M-1bi em 3 anos) através de (a) hedge constraint-based em vez de 50% flat, (b) defensivo targeted em vez de catalog-wide, (c) resposta macro calibrada em vez de playbook estático.

---

## O que o Conselho ganha com D3

- **Decisão com confidence**: 10 perguntas respondidas com sensitivity em ≤2h
- **Trigger visível**: cada mudança de sinal dispara revisão em ≤5min
- **Ownership explícito**: cada ação tem dono + aprovação
- **Composite recalculado**: ≤1h após novo dado
- **NPV + counterfactual**: comparação rigorosa vs. status quo
- **Stress test**: MC multivariado em ≤30min
- **Learning**: cada trimestre vira insight acionável

---

## Custo & timeline

| Fase | Quando | Custo | Output |
|---|---|---|---|
| F1 Foundation | Q3 2026 (8 sem) | R$ 0.5M | Decision trees, trigger matrix, RACI, action register base |
| F2 Operacionalização | Q4 2026 (8 sem) | R$ 1.0M | Auto-trigger, NPV layer, dashboard, piloto completo |
| F3 Quantificação avançada | Q1 2027 (12 sem) | R$ 1.5M | MC multivariado, sensitivity, game theory, D2 v2 |
| F4 Ongoing | Q2 2027+ | R$ 200k/trim | Learning loop, recalibração, stress test anual |
| **Total F1-F3** | | **R$ 3.0M** | D3 completo |

**ROI esperado**: 1 evento material evitado (e.g., supply chain disruption 6m) paga o investimento.

---

## Próximo passo imediato

1. **Revisar este pacote** com CSO + CFO + Heads funcionais
2. **Validar arquitetura** (5 camadas) ou propor ajustes
3. **Decidir open questions** (resolvidas em `D3-RACI.md` §10):
   - Quem é o CSO e o Risk Officer? (RACI §3 define personas)
   - Qual a taxa de desconto ajustada a risco soberano para NPV? (gate G2 — fallback 13% nominal)
   - Quem aprova R$ 280M+? (RACI §4.1: Board global + HQ China, quorum 5/7)
4. **Se aprovado**, abrir Fase 1 — T1.1 ✅, T1.2 ✅, T1.3 ✅ (D3-DECISION-TREES.html), T1.4 ✅ (D3-RACI.md), T1.5 ✅, T1.6 ✅
5. **Próximas opções**:
   - **(A) Sumário integrado**: consolidar os 5 acoplamentos em um único D3-INTERDEPENDENCY-SUMMARY.md (1 página para Conselho)
   - **(B) D3 v0**: construir D3-MAIN.html com trigger matrix visual + decision tree interativa (PNG-based, sem JS) — **✅ ENTREGUE (D3 v0.5, 83.3 KB, 8 seções, 4 figuras, 12 decision trees, 31 ações, 1 REMOVIDA)**
   - **(C) Workshop deck**: preparar apresentação para Conselho — **✅ ENTREGUE (D3-WORKSHOP.html, 10 slides, 30 min)**
   - **(D) Decision trees standalone**: 12 árvores com overlays S1/S2/S4/S5 — **✅ ENTREGUE (D3-DECISION-TREES.html, 66.7 KB)**
   - **(E) RACI matrix**: ownership + approval gates + escalation — **✅ ENTREGUE (D3-RACI.md, 18.1 KB)**
   - **(F) Phase 2 prep**: T2.1 (auto-trigger), T2.2 (NPV layer live), T2.4 (piloto) — **✅ ENTREGUE: D3-AUTO-TRIGGER-SPEC.md (22 KB), D3-NPV-LAYER-SPEC.md (23 KB), D3-PILOTO-PLAN.md (16 KB)**

---

## Quick links

- [D3 v0 framework (HTML)](./7_outputs/D3-MAIN.html) — **página-mãe do framework, abre primeiro**
- [D2 report principal](../atlas-d2-preditiva.html)
- [D2 audit](./1_framework/D2-AUDIT.md)
- [Decision framework](./1_framework/DECISION-FRAMEWORK.md)
- [D3 spec](./1_framework/D3-PRESCRIPTIVE-SPEC.md)
- [Planning files](./.planning/)

---

## Apresentações Visuais (6_pitch/)

| Arquivo | Descrição |
|---------|-----------|
| `6_pitch/D3-PITCH-GRAPH.html` | **Grafo interativo D3** — 11 dimensões, 28 couplings, 4 gates, 5 personas. Visualização principal. |
| `6_pitch/D3-INDEX-TECHNICAL-SUMMARY.md` | **Sumário técnico de índice** — referência rápida em português para apresentações. |
| `6_pitch/D3-EXECUTIVE-BRIEF.md` | Brief executivo do framework. |
| `6_pitch/D3-PITCH-1PAGE.md` | Pitch de 1 página para anexos de vaga. |
| `../../../../Screen Recording 2026-07-25 201415.mp4` | Vídeo de apresentação do projeto. |
