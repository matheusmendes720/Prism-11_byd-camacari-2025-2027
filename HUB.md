# 🗂️ HUB — Índice Cruzado de Documentos (Linhagem Completa)

> **Versão**: 1.0 — 25/ago/2026
> **Audiência**: qualquer pessoa chegando ao case study BYD Camaçari 2025-2027
> **Propósito**: ponto de entrada único para navegar **todos** os artefatos do projeto, organizados por tema, com índice de documentos relacionados a cada seção, links rápidos para o relatório, notebook, e outputs.
> **Companhia este hub**:
> - `HUB.html` (este mesmo índice, navegável em browser)
> - `analise-prescritiva/notebooks!/LINHAGEM.md` (linhagem técnica por fase)
> - `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md` (síntese de conclusões por versão)
> - `INDEX.md` (índice agregado dos 41+ docs)
> - `analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md` (mapa audível)

---

## §0. Como usar este HUB

**1. Quer entender o produto?** → §1 (Mapa de temas + Audiências).
**2. Quer ler um relatório curto?** → §2 (Documentos por duração).
**3. Quer explorar um tema?** → §3 (Índice cruzado: 13 temas × 60+ docs).
**4. Quer validar uma métrica?** → §4 (Números canônicos com fontes).
**5. Quer a linhagem completa?** → §5 (Cadeia D2 v1 → D3 v2.0.2 + 8 fases).
**6. Quer entender o estado atual?** → §6 (O que mudou em ago/2026).

### 🌟 NOVO: Notas-Meta (séries de meta-aprendizado)

> **Entradas didáticas recomendadas** (17 notas em `/notas/`):
> - **Série D2** (10 notas): [capa](./notas/NOTA-META-D2-INDICE-SERIE.md) — base didática L0-L6 + LAB + transversais + 3 cross-version.
> - **Série D3** (6 notas): [capa](./notas/NOTA-META-D3-INDICE-SERIE.md) — framework prescritivo: overview + 5 camadas + 11 dims + couplings + governança + calibração + CTA.
> - **Nota extra**: [`NOTA-01-D2-LINHAGEM-TRADUZIDA.md`](./notas/NOTA-01-D2-LINHAGEM-TRADUZIDA.md) — D2 em linguagem de negócio.

Para abrir qualquer documento direto, **Ctrl+Click no link** (Windows/Linux) ou **Cmd+Click no link** (Mac). Todos os caminhos são absolutos.

---

## §1. Mapa de temas (13 sessões × 60+ docs relacionados)

Cada tema abaixo lista: **O que é** + **Por que importa** + **Documentos relacionados** (relatórios `.md`, notebooks `.ipynb`, outputs `.html/.png/.json`, audio `.mp3`, dados `.csv/.json`).

### Tema 1 · Câmbio (PTAX vol, hedge, stress FX) — 6 docs relacionados

**O que é:** análise da variabilidade da taxa de câmbio USD/BRL (PTAX venda) e seu impacto na planta BYD Camaçari. Cobre σ anualizada, GARCH(1,1)-t, VaR/CVaR, e 3 cenários de stress (cenário base, tail event, regime-switching).

**Por que importa:** ~42% do BOM da planta é importado (semicondutores, células de bateria, alumínio). Cada R$ 0,10 de depreciação do BRL custa ~R$ 280M de EBIT anual. σ PTAX anualizada de 14,86% (10y BCB) significa VaR 6m de R$ 2,10 bi empírico, R$ 6,43 bi MC refresh, R$ 8,21 bi 4-shock tornado.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📊 Relatório técnico | `d2-econometric-vulnerability/byd-econometric-vulnerability.ipynb` (5 seções: PTAX, vol, stress, MC, BOM impact) |
| 📓 Notebook espelho | `d2-econometric-vulnerability/byd-econometric-vulnerability.py` |
| 📊 HTML Plotly (MC 10k paths) | `d2-econometric-vulnerability/outputs/cambio-monte-carlo.html` (105 KB) |
| 📊 HTML Plotly (stress test) | `d2-econometric-vulnerability/outputs/cambio-stress-test.html` (8.6 KB) |
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb` (NB-01) |
| 📚 Estudo didático L1.0 | `d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md` (36 KB) |
| 📚 Estudo didático L2.1 | `d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md` (31 KB) |
| 📚 Estudo didático L2.2 | `d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md` (32 KB) |
| 📚 Recalibração BCB real | `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md` (2.509 obs BCB SGS 10813) |
| 📚 Coupling S1↔S3 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md` (15 KB) |
| 🎧 Audio script | `analise-prescritiva/case-studies/docs/audio/02-dados-logica-audio-script.md` (10 min) |
| 🔢 Dados brutos | `_bcb_ptax_raw.json` em `analise-prescritiva/reports/decision-framework/_models/` |

### Tema 2 · Supply Chain (HHI, lítio, concentração) — 5 docs relacionados

**O que é:** análise de concentração de fornecedores (HHI Herfindahl-Hirschman Index) nas 6 categorias de componentes críticos. Bateria (LFP) tem HHI 4.850 (altamente concentrada, CATL 95,7%), powertrain 3.400, semicondutores 2.925.

**Por que importa:** single-source risk em LFP (CATL domina 95%). Semicondutores têm VaR de R$ 1,2 bi para 6m outage. Lítio σ 95% anualizada (10y) implica VaR de R$ 4,00 bi (real 12m), quase 2× do sintético original.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-02-supply-chain-hhi/nb-02-supply-chain-hhi.ipynb` (NB-02) |
| 📊 HTML Sankey | `d2-econometric-vulnerability/outputs/supply-chain-sankey.html` |
| 📚 Recalibração lítio | `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S2-LITHIUM-2026.md` |
| 📚 Recalibração supply real | `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S2-REAL.md` |
| 📚 Coupling S1↔S2 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md` (10 KB) |
| 📚 Estudo didático L1.1 | `d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md` (40 KB) |
| 📓 Notebook didático L7 | `analise-prescritiva/notebooks!/01-didaticos/L7-multivariate-analysis/l7-multivariate-analysis.ipynb` |

### Tema 3 · Regulatório / BNDES — 6 docs relacionados

**O que é:** análise dos 4 cenários políticos que afetam BNDES Mover, Rota 2030, e ViE (Vehicle Import Duty). Cenários: Expansão (ViE 18%, prob 75%), Continuidade (ViE 22%, prob 60%), Rollback Parcial (ViE 30%, prob 25%), Rollback Total (ViE 35%, prob 10%).

**Por que importa:** incentivos cobrem ~18% do preço de venda (Rota 2030 + BNDES). Rollback Total custa 18pp de viabilidade. Lista suja do MTE desde 07/abr/2026 ativa kill switch S7 (BNDES bloqueado).

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-03-regulatory-scenarios/nb-03-regulatory-scenarios.ipynb` (NB-03) |
| 📊 HTML cenários | `d2-econometric-vulnerability/outputs/regulatory-scenarios.html` |
| 📚 Coupling S1↔S3 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md` (h* = 30% → 91% por ViE) |
| 📚 Coupling S3↔S4 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md` (break-even ViE=10%) |
| 📚 Coupling S10 Tariff | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md` (23 KB) |
| 📚 Memo Conselho | `analise-prescritiva/case-studies/docs/CONSELHO-MEMO-2026-08-15.md` |
| 📓 Notebook didático L8 | `analise-prescritiva/notebooks!/01-didaticos/L8-optimization/l8-optimization.ipynb` |

### Tema 4 · Composite (índice 0-100 + drift cross-version) — 8 docs relacionados

**O que é:** indicador agregado que sintetiza 11 dimensões S1-S11 em um score 0-100. Pesos canônicos 0,18/0,16/0,18/0,16/0,10/0,10/0,05/0,08/0,04/0,05/0,05 (sum=1,15, renormalizado para 1,00). Thresholds: ≥80 GREEN, ≥65 AMBER, <65 RED.

**Por que importa:** composite é o termômetro executivo que o Conselho acompanha mensalmente. Drift: D2 v1 (n/a) → D2 v2 (71,8 AMBER) → D3 v0.6 (71,8 GREEN) → D3 v2.0.1/v2.0.2 (50,3 RED Modo Crise) — alinhamento com realized risks, não regressão do modelo.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-05-composite-index-radar/nb-05-composite-index-radar.ipynb` (NB-05) |
| 📊 HTML radar | `d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html` |
| 📊 HTML dashboard final | `d2-econometric-vulnerability/outputs/cap6_dashboard_final.png` (343 KB) |
| 📚 SCORES (3 linhagens) | `analise-prescritiva/case-studies/docs/SCORES.md` (7 KB) |
| 📚 Composite weights v2.0.1 | `analise-prescritiva/reports/decision-framework/CLAUDE.md` (tabela §Composite Weights) |
| 📚 Drift cross-version | `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md` §4 |
| 📚 Snapshot operacional | `outputs/SNAPSHOT-OPERACIONAL.md` (50,3 hoje) |
| 📓 Notebook didático L10 | `analise-prescritiva/notebooks!/01-didaticos/L10-decision-framework/l10-decision-framework.ipynb` |

### Tema 5 · Game Theory (5 players × 2 strategies) — 4 docs relacionados

**O que é:** modelagem das interações estratégicas entre BYD, Stellantis, GM, VW, Geely no mercado EV brasileiro. Cada player tem 2 estratégias: Differentiate ou Price War. 32 combinações possíveis. Payoff = market share × margem × NPV.

**Por que importa:** NASH equilibrium E3 estável (BYD HIGH, Stel LOW, GM LOW, VW LOW, Geely HIGH). Guerra de preços é pior resultado conjunto: soma −R$ 8,6 bi em NPV agregado. Lição contraintuitiva: BYD NÃO deve responder Stellantis com desconto.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-04-competition-game-theory/nb-04-competition-game-theory.ipynb` (NB-04) |
| 📓 Notebook complementar | `analise-prescritiva/notebooks!/02-canonicos/nb-09-game-theory/nb-09-game-theory.ipynb` (NB-09) |
| 📊 HTML Nash equilibrium | `analise-prescritiva/outputs/nb09_nash_equilibrium.html` |
| 📚 Coupling S11 Competition | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md` (26 KB) |
| 📚 Quantitative Game Theory | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md` |
| 📚 Quantitative Sensitivity | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` |
| 📊 HTML competition | `d2-econometric-vulnerability/outputs/competition-landscape.html` |
| 📓 Notebook didático L9 | `analise-prescritiva/notebooks!/01-didaticos/L9-game-theory/l9-game-theory.ipynb` |

### Tema 6 · Monte Carlo Multivariado (VaR 4-shock tornado) — 6 docs relacionados

**O que é:** simulação 10.000 paths com 4 choques correlacionados (PTAX + lítio + tariff + demanda EV). Cholesky 4×4 para preservar correlações empíricas. Outputs: VaR 95% 6m, CVaR 95% 6m, distribuição de impactos.

**Por que importa:** VaR 4-shock = R$ 8,21 bi (95% confiança, 6 meses). CVaR 95% = R$ 10,14 bi. Tornado plot: Tariff 29% (R$ 2,37 bi) > Supply 25% > FX 20% > Demand 15%. Tariff é o maior contributor, não FX como intuição sugere.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-06-monte-carlo-multivariado/nb-06-monte-carlo-multivariado.ipynb` (NB-06) |
| 📓 Notebook MC alternativo | `analise-prescritiva/notebooks!/02-canonicos/nb-08-monte-carlo-multivariate/nb-08-monte-carlo-multivariate.ipynb` |
| 📊 HTML MC distrib | `analise-prescritiva/outputs/nb06_impact_distribution.html` |
| 📊 HTML tornado | `analise-prescritiva/outputs/nb06_tornado_chart.html` |
| 📚 Quantitative Sensitivity | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` |
| 📚 MC modelo | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-QUANTITATIVE-MODEL.md` |
| 📓 Notebook didático L6 | `analise-prescritiva/notebooks!/01-didaticos/L6-monte-carlo/l6-monte-carlo.ipynb` |

### Tema 7 · Backtesting + False Positives (5/5 PERFEITO) — 4 docs relacionados

**O que é:** validação histórica do framework em 5-6 stress events reais 2020-2025: COVID-19 (2020-03 a 2020-12, vol 21,8%, +15,6%), Semicondutor (2021-Q1, vol 17,0%), Election 2022 (2022-08 a 2022-11, vol 18,0%, +2,6%), Lítio spike (2022-Q2, vol 19,5%), Election 2024 (2024-08 a 2024-11, vol 12,6%, +6,8%), Stagflação 2025 (2025-01 a 2025-12, vol 10,3%, -11,4%).

**Por que importa:** v2.0.1 atingiu 5/5 PERFEITO (TP 100%, FN 0%, FP 0%, accuracy 88,9%, time-to-action 9,3d ≤14d target) após 4 fixes (hysteresis, carry-trade filter, lítio asymmetry, 5-day confirmation). Reconhece abertamente a v2.0 original tinha FP 14,8% — o framework só é confiável porque mostrou onde errou.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-08-backtesting-false-positives/nb-08-backtesting-false-positives.ipynb` (NB-08) |
| 📓 Notebook backtest completo | `analise-prescritiva/notebooks!/02-canonicos/nb-11-backtesting/nb-11-backtesting.ipynb` (NB-11) |
| 📚 Backtesting Validation | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-BACKTESTING-VALIDATION.md` |
| 📚 False Positive Fixes | `analise-prescritiva/reports/decision-framework/4_quantitative/D3-FALSE-POSITIVE-FIXES.md` |
| 📓 Notebook didático L2 | `analise-prescritiva/notebooks!/01-didaticos/L2-hypothesis-testing/l2-hypothesis-testing.ipynb` |

### Tema 8 · Couplings / Interdependências (5 primários + 15 secundários = 20 totais) — 12 docs relacionados

**O que é:** modelagem quantitativa dos efeitos cruzados entre dimensões. 5 couplings primários:
1. S1↔S3: h* = 30% (Expansão) → 91% (Rollback Total) — hedge sizing depende de ViE
2. S1↔S2: VaR supply 2,5× FX VaR em S2 RED — joint stress
3. S1↔S4: R$ 480/unit hedge vs R$ 4.500/unit defensive (ratio ~9×) — hedge domina defensive
4. S3↔S4: break-even ViE = 10% — defensive vira value-destructive abaixo
5. S6→all: multiplier 1,0× (GREEN) / 1,5× (AMBER) / 2,0× (RED) — macro reescala todas prescrições

**Por que importa:** acoplamentos são o Gap #1 do D2-AUDIT que motivou a transição D2 → D3. Sem acoplamentos, as 6 sessões eram tratadas como silos independentes. Com acoplamentos, o framework virou prescritivo (sensível ao cenário).

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-07-interdependency-couplings/nb-07-interdependency-couplings.ipynb` (NB-07) |
| 📚 Dependency Graph | `analise-prescritiva/reports/decision-framework/2_couplings/D3-DEPENDENCY-GRAPH.md` (13 KB, grafo 6×6 consolidado) |
| 📚 Coupling S1↔S2 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S2.md` |
| 📚 Coupling S1↔S3 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S3.md` |
| 📚 Coupling S1↔S4 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S1-S4.md` |
| 📚 Coupling S3↔S4 | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S3-S4.md` |
| 📚 Coupling S5 Coupled | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S5-COUPLED.md` |
| 📚 Coupling S6 Triggers | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S6-TRIGGERS.md` |
| 📚 Coupling S7 ESG | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S7-ESG.md` (23 KB, lista suja kill switch) |
| 📚 Coupling S8 Ramp | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S8-RAMP.md` (24 KB) |
| 📚 Coupling S9 Demand | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S9-DEMAND.md` |
| 📚 Coupling S10 Tariff | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md` |
| 📚 Coupling S11 Competition | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md` |
| 📓 Notebook didático L7 | `analise-prescritiva/notebooks!/01-didaticos/L7-multivariate-analysis/l7-multivariate-analysis.ipynb` |

### Tema 9 · Decision Trees (12 árvores S3×S6 + overlays) — 4 docs relacionados

**O que é:** 12 árvores de decisão condicionais mapeando 6 cenários BNDES × 2 cenários macro = 12 cells, cada uma com sequência completa "se X → cell Y → ação Z → owner W → gate G → SLA". Adiciona overlays S1/S2/S4/S5 para refinamento.

**Por que importa:** é o "playbook" que o COO consulta para saber qual decisão executar dado o cenário atual. Substitui o Gap #2 do D2-AUDIT ("sem branching condicional" — todas prescrições eram 'faça X', sem 'se Y, senão Z').

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-10-decision-trees/nb-10-decision-trees.ipynb` (NB-10) |
| 📊 HTML Decision Trees | `analise-prescritiva/reports/decision-framework/5_operational/D3-DECISION-TREES.html` (115 KB, 12 árvores + overlays) |
| 📚 Decision Matrix (12 cenários case-sensitive) | `analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md` (319 linhas, D-01..D-12) |
| 📓 Notebook didático L8 | `analise-prescritiva/notebooks!/01-didaticos/L8-optimization/l8-optimization.ipynb` |

### Tema 10 · Trigger Matrix (15+30 triggers, 9 approval gates) — 5 docs relacionados

**O que é:** matriz 6×3 (cenários S3 × regimes S6) com 15 triggers originais (v2.0) + 30 novos (v2.1, regras Python yaml) = 45 totais. 9 approval gates (R$ 30M → R$ 280M) + 7 kill gates. Auto-trigger S6→S1/S2/S3/S4 (5 feeds, 30 regras Python).

**Por que importa:** triggers são o "sistema nervoso" do framework — detectam automaticamente quando o cenário muda e disparam a ação correta. Substituem o Gap #5 do D2-AUDIT ("triggers dispersos em 3 sessões").

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-13-trigger-matrix/nb-13-trigger-matrix.ipynb` (NB-13) |
| 📚 Trigger Matrix | `analise-prescritiva/reports/decision-framework/5_operational/D3-TRIGGER-MATRIX.md` (17 KB) |
| 📚 Auto-Trigger Spec | `analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md` (22 KB) |
| 📚 Trigger Matrix D3 | `analise-prescritiva/case-studies/docs/TRIGGER_MATRIX.md` (5.6 KB) |
| 📚 Piloto Plan | `analise-prescritiva/reports/decision-framework/5_operational/D3-PILOTO-PLAN.md` (16 KB) |
| 📊 HTML Trigger Matrix | `analise-prescritiva/outputs/trigger-matrix.html` |
| 📚 Estudo didático L3.1 | `d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md` (51 KB) |

### Tema 11 · Action Plan + RACI (25 ações × 17 personas × 9 gates) — 6 docs relacionados

**O que é:** plano operacional com 25 prescrições executáveis distribuídas em 5 estratégicas (Conselho), 10 táticas (CSO/CFO/Heads), 10 operacionais (Risk Officer/Analysts). RACI com 17 personas, 9 approval gates, 7 kill gates. Cada ação tem owner, deadline, custo, KPI, contingência.

**Por que importa:** substitui o Gap #6 do D2-AUDIT ("sem ownership — listas custos mas ninguém responsável"). 3 ações críticas 90d: AG-001 resolver lista suja (R$ 25M, deadline 30/set/2026), AG-002 nacionalização 70% (R$ 280M, deadline 31/out/2027), AG-003 hedge FX 95% (R$ 30M, deadline 31/out/2026). ROI 200×, payback <1 mês.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📓 Notebook canônico | `analise-prescritiva/notebooks!/02-canonicos/nb-14-npv-layer/nb-14-npv-layer.ipynb` (NB-14) |
| 📚 Action Plan | `analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md` (33 KB) |
| 📚 RACI | `analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md` (28 KB) |
| 📚 Risk Register | `analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md` (57 KB) |
| 📚 Live Validation | `analise-prescritiva/reports/decision-framework/5_operational/D3-LIVE-VALIDATION.md` |
| 📚 NPV Prescriptions | `analise-prescritiva/case-studies/docs/NPV_PRESCRIPTIONS.md` |
| 📚 Estudo didático L3.2 | `d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md` (52 KB) |
| 📚 Estudo didático L3.0 | `d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md` (41 KB) |

### Tema 12 · ESG / Reputação / Lista Suja (kill switch) — 5 docs relacionados

**O que é:** S7 kill switch ativo desde 07/abr/2026 (BYD fornecedor LFP descontinuado por lista suja do MTE — 163 trabalhadores resgatados em dez/2024). R$ 800 milhões de funding BNDES bloqueados. HHI 0,355 → 0,290 em 14d. Override no composite: S7 fixo em 95 enquanto ESG RED.

**Por que importa:** ESG é o "kill switch" do framework — pode pausar tudo. Substitui o Gap #7 do D2-AUDIT ("análise competitiva unidirecional"). AG-001 (resolver lista suja) é a porta de entrada — sem ela, BNDES continua bloqueado.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 📚 Coupling S7 ESG | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S7-ESG.md` (23 KB) |
| 📚 Coupling S5 Coupled | `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S5-COUPLED.md` (15 KB, partnerships como potenciador ESG) |
| 📚 Conselho Memo | `analise-prescritiva/case-studies/docs/CONSELHO-MEMO-2026-08-15.md` (5 KB) |
| 📚 Decision Matrix §3 | `analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md` (cenário D-01 lista suja) |
| 📚 Alertas Personas §4 | `analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md` §4 (mitigação 9 cenários) |

### Tema 13 · Knowledge Graph + Narrativa Audível (110 nós, 12 MP3s) — 12 docs relacionados

**O que é:** D3-KNOWLEDGE-GRAPH.json v2.0.2 com 110 nós, 118 edges, 11 categorias (incluindo `delegation_plan` adicionada em 18/ago). 12 docs narrativos didáticos pt-br + 12 audio scripts + 12 MP3s reais (~99 min de áudio via eSpeak NG). Diagramas HTML (5 cross-linkados).

**Por que importa:** KG é a "fotografia instantânea" do framework, navegável em qualquer direção. Os 12 MP3s são áudios reais reproduzíveis offline (sem API key). Diagramas HTML são imprimíveis em A4.

**Documentos relacionados:**

| Função | Path |
|---|---|
| 🔷 KG JSON v2.0.2 | `analise-prescritiva/reports/decision-framework/6_pitch/D3-KNOWLEDGE-GRAPH.json` |
| 🔷 KG Snapshot HTML | `analise-prescritiva/reports/decision-framework/6_pitch/D3-KNOWLEDGE-GRAPH-SNAPSHOT.html` (14 KB A4 print-ready) |
| 🔷 Understand Anything | `analise-prescritiva/reports/decision-framework/6_pitch/D3-UNDERSTAND-ANYTHING.html.bak-20260818-0940` (141 KB, inline JSON) |
| 📚 Índice Narrativo | `analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md` (3 trilhas: por audiência / por tempo / por perfil) |
| 📚 Doc 00 — Síntese Executiva | `analise-prescritiva/case-studies/docs/00-sintese-executiva.md` |
| 📚 Doc 01 — Cadeia de Valor | `analise-prescritiva/case-studies/docs/01-cadeia-valor-byd.md` |
| 📚 Doc 02 — Dados e Lógica | `analise-prescritiva/case-studies/docs/02-dados-logica-produto.md` |
| 📚 Doc 03 — Matemática Didática | `analise-prescritiva/case-studies/docs/03-matematica-didatica.md` |
| 📚 Doc 04 — Progressão Temporal | `analise-prescritiva/case-studies/docs/04-progressao-temporal.md` |
| 📚 Doc 05 — Backtesting | `analise-prescritiva/case-studies/docs/05-backtesting-justificativa.md` |
| 📚 Doc 06 — Decisões e Personas | `analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md` |
| 📚 Doc 07 — Cadeia Física BYB | `analise-prescritiva/case-studies/docs/07-cadeia-fabrica-byb.md` (379 linhas) |
| 📚 Doc 08 — Decision Matrix | `analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md` (319 linhas) |
| 📚 Doc 09 — Alertas Personas | `analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md` (391 linhas) |
| 📚 Doc 10 — Story S1-S11 | `analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md` (615 linhas) |
| 📚 Linhas Gerais Comunicação | `analise-prescritiva/case-studies/docs/LINHAS-GERAIS-COMUNICACAO-PERSUASIVA.md` (427 linhas) |
| 🎧 Audio scripts (12) | `analise-prescritiva/case-studies/docs/audio/*.md` |
| 🎵 MP3s reais (12) | `analise-prescritiva/case-studies/docs/audio/mp3/*.mp3` (~99 min, ~45 MB) |

---

## §2. Documentos por duração de leitura

### Expresso (<10 min)

| Doc | Função |
|---|---|
| `outputs/SNAPSHOT-OPERACIONAL.md` (7 KB) | Raid briefing Conselho, 1 página A4 |
| `analise-prescritiva/case-studies/docs/00-sintese-executiva.md` (5 KB) | Fotografia do produto em 1 página |
| `analise-prescritiva/case-studies/docs/EXPLAINER-NAO-TECNICO.md` (10 KB) | Tudo sem matemática |
| `d2-econometric-vulnerability/outputs/1-pager-summary.md` (181 linhas) | 1-pager D2 consolidado |
| `analise-prescritiva/case-studies/docs/ONE-PAGER-EXECUTIVO.md` (8 KB) | One-pager imprimível A4 |
| `analise-prescritiva/case-studies/docs/CONSELHO-MEMO-2026-08-15.md` (5 KB) | Memo Conselho |
| `analise-prescritiva/case-studies/docs/SCORES.md` (7 KB) | 3 linhagens de score |
| `analise-prescritiva/case-studies/docs/TRIGGER_MATRIX.md` (5.6 KB) | Trigger matrix |
| `analise-prescritiva/case-studies/docs/METHODOLOGY.md` (4.9 KB) | Metodologia |
| `analise-prescritiva/case-studies/docs/GLOSSARY.md` (10 KB) | Glossário de termos |

### Curto (10-30 min)

| Doc | Função |
|---|---|
| `analise-prescritiva/case-studies/docs/01-cadeia-valor-byd.md` (8 min) | Da fábrica à decisão em 5 camadas |
| `analise-prescritiva/case-studies/docs/04-progressao-temporal.md` (9 min) | Linha do tempo do framework |
| `analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md` (12 min) | Decisões e personas |
| `analise-prescritiva/case-studies/docs/PITCH-NARRATIVE.md` (10 min) | Pitch completo 6 blocos |
| `analise-prescritiva/case-studies/docs/VOICE-OVER-GUIDE.md` (12 min) | Guia de transformação |
| `analise-prescritiva/case-studies/docs/NPV_PRESCRIPTIONS.md` (5.9 KB) | NPV das prescrições |
| `analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md` (14 KB) | Arquitetura 5 camadas + RACI |
| `analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md` (8 KB) | 10 gaps D2 → D3 |
| `INDEX.md` (raiz) (6.6 KB) | Índice agregado 41 docs |
| `WRAP-UP-ESTUDO-D2-D3.md` (14 KB) | Wrap-up D2+D3 |

### Médio (30-90 min)

| Doc | Função |
|---|---|
| `analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md` (17 KB) | Mapa de leitura audível completo |
| `analise-prescritiva/case-studies/docs/LINHAS-GERAIS-COMUNICACAO-PERSUASIVA.md` (24 KB, 427 linhas) | Sistema de tom 4 atos |
| `analise-prescritiva/case-studies/docs/02-dados-logica-produto.md` (10 min) | Mapa 11 dimensões |
| `analise-prescritiva/case-studies/docs/03-matematica-didatica.md` (11 min) | Matemática didática |
| `analise-prescritiva/case-studies/docs/05-backtesting-justificativa.md` (12 min) | Justificativa backtesting |
| `analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md` (11 KB) | Spec formal D3 (OpenSpec-style) |
| `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md` | Recalibração empírica |
| `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md` | BCB PTAX real 10y |
| `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md` (21 KB) | Síntese cross-version |

### Longo (90+ min) — estudo aprofundado

| Doc | Função |
|---|---|
| `analise-prescritiva/case-studies/docs/07-cadeia-fabrica-byb.md` (22 KB, 379 linhas) | Cadeia física 7 estágios × 5 camadas × 11 dimensões |
| `analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md` (17 KB, 319 linhas) | 12 cenários nomeados |
| `analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md` (19 KB, 391 linhas) | Sistema nervoso 12 personas |
| `analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md` (22 KB, 615 linhas) | S1-S11 como micro-histórias |
| `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S7-ESG.md` (23 KB) | Lista suja, BNDES kill switch |
| `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S8-RAMP.md` (24 KB) | SKD→CKD, nacionalização |
| `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S10-TARIFF.md` (23 KB) | Duplo cost-shock |
| `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-S11-COMPETITION.md` (26 KB) | 5 players, NASH E3 |
| `analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md` | 5×2 estratégias, NASH E3 |
| `analise-prescritiva/reports/decision-framework/4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` | MC 10k paths, 4 choques |
| `analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md` (57 KB) | Registro de riscos completo |
| `analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md` (33 KB) | Plano de ação operacional |
| `analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md` (28 KB) | RACI por sessão, 9 approval gates |
| `analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md` (22 KB) | S6→S1/S2/S3/S4 (5 feeds, 30 regras) |
| `analise-prescritiva/reports/decision-framework/5_operational/D3-NPV-LAYER-SPEC.md` (23 KB) | NPV live, sensitivity 96 cenários |
| `d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md` (40 KB) | EDA supply chain completa |
| `d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md` (51 KB) | Trigger matrix auto-trigger |
| `d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md` (52 KB) | RACI action register |
| `d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md` (45 KB) | Calibração regime-switching |
| `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md` (~480 linhas) | D3 v0.5 → v2.0.2 detalhado |
| `analise-prescritiva/notebooks!/LINHAGEM.md` (42 KB, 1069 linhas) | Linhagem técnica por fase + vídeo YouTube roteiro |

---

## §3. Índice cruzado: 13 temas × 60+ docs relacionados (resumo tabular)

Para abrir um tema, ver §1 (descrição detalhada). Aqui está a tabela cruzada:

| Tema | MDs principais | Notebooks canônicos | Outputs HTML/PNG | Áudio/MP3 | Docs estudo (L*) |
|---|---|---|---|---|---|
| 1. Câmbio (PTAX) | 4 | NB-01 | 2 HTML | 1 script | L1.0, L2.1, L2.2 |
| 2. Supply Chain (HHI) | 3 | NB-02 | 1 HTML | — | L1.1 |
| 3. Regulatório / BNDES | 3 | NB-03 | 1 HTML | — | — |
| 4. Composite | 2 | NB-05 | 2 PNG | — | L10 |
| 5. Game Theory | 3 | NB-04, NB-09 | 2 HTML | — | L9 |
| 6. Monte Carlo Multivariado | 2 | NB-06, NB-08-MC | 3 HTML | — | L6 |
| 7. Backtesting | 2 | NB-08, NB-11 | — | — | L2 |
| 8. Couplings | 13 | NB-07 | — | — | L7 |
| 9. Decision Trees | 3 | NB-10 | 1 HTML | — | L8 |
| 10. Trigger Matrix | 4 | NB-13 | 1 HTML | — | L3.1 |
| 11. Action Plan + RACI | 5 | NB-14 | — | — | L3.0, L3.2 |
| 12. ESG / Lista Suja | 4 | — | — | — | — |
| 13. Knowledge Graph + Narrativa | 12 | — | 3 HTML | 12 MP3s | — |

---

## §4. Números canônicos (cross-doc, validados)

> ⚠️ **AVISO**: há pequenas inconsistências entre fontes para algumas métricas (ex.: composite = 50,3 vs 71,8 vs 78, σ PTAX = 14,19% vs 14,41% vs 14,86%). Todas são CORRETAS em seus contextos específicos (períodos/amostras/linhagens diferentes), mas exigem contextualização. Ver `outputs/SNAPSHOT-OPERACIONAL.md` §8 e `SCORES.md` §3 para reconciliação.

### Métricas PTAX (σ anualizada, 3 amostras independentes)

| Valor | Amostra | Fonte canônica | Doc que cita |
|---|---|---|---|
| **14,19%** | D2 v1 (1.642 obs, 2015-2022) | `d2-econometric-vulnerability/byd-econometric-vulnerability.ipynb` | `L0.0`, `L1.0`, `L2.0`, `99-LAB` |
| **14,41%** | D2 v2 refresh (2.778 obs, 2015-2026) | `d2-econometric-vulnerability/byd-econometric-vulnerability.py` refresh | `README`, `L1.0` |
| **14,86%** | BCB SGS série 10813 empírica (10y) | `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md` (2.509 obs) | `D3-RECALIBRATION` |

### VaR/CVaR 95% 6m (R$ bi)

| Métrica | Empírico (D2 v1) | MC refresh (D2 v2.1) | MC 4-shock (D3 v2.0.1) | EVT GPD |
|---|---|---|---|---|
| **VaR 95%** | R$ 2,10 bi | R$ 6,43 bi | **R$ 8,21 bi** | 2,815% |
| **CVaR 95%** | R$ 1,44 bi | R$ 8,04 bi | **R$ 10,14 bi** | 3,411% |
| **VaR 99%** | — | — | — | 3,773% |
| **ES 99%** | — | — | — | 4,371% |

### GARCH(1,1)-t (parâmetros estimados)

| Parâmetro | Valor | Interpretação |
|---|---|---|
| **α (ARCH)** | **0,0488** | Reação a choque de ontem (5% do impacto) |
| **β (GARCH)** | **0,9418** | Persistência autorregressiva |
| **α + β** | **0,9906** | Quase unit-root (vol muito persistente) |
| **ν (Student-t df)** | **6,99** | Caudas pesadas (Normal: ν=∞) |
| **Half-life** | **73,3 dias** | ~3,5 meses para choque decair pela metade |
| **Leverage γ** | ~0,05 | Assimetria positiva (choques negativos geram mais vol) |

### Composite (3 linhagens oficiais)

| Linhagem | Composite | Status | Lida por |
|---|---|---|---|
| **Stakeholder 4 dims** (Câmbio 30% + Supply 20% + Regulatório 30% + Macro 20%) | **50,3** (atual, 22/ago/2026) | 🔴 RED Modo Crise | Conselho, CEO |
| **Técnico 11 dims** (pesos renormalizados sum=1,00) | 78 | 🟡 AMBER (tecnicamente GREEN se >80) | Risk Officer, CRO |
| **Stakeholder 4 dims (jul/2026)** | 71,8 | 🟡 AMBER antes da recalibração 15/ago | D2-AUDIT |

### D3 v2.0.2 (research-grade)

- **11 dimensões** (S1-S11) + S12 proposta (drift cambial)
- **5 couplings originais** + 15 secundários = **20 couplings quantitativos**
- **17 personas** no RACI + 5 frentes delegação ativas
- **30+ triggers** + 15 novos (v2.1) = **45 triggers totais**
- **25 ações** no action register (5 estratégicas + 10 táticas + 10 operacionais)
- **9 approval gates** (R$ 30M → R$ 280M) + 7 kill gates
- **Investment 365d**: R$ 1,68 bi
- **E[NPV 3y]**: R$ 3,24 bi
- **Backtesting**: 5/5 PERFEITO (TP 100%, FP 0%, time-to-action 9,3d)
- **Composite atual**: 50,3 RED Modo Crise (após recalibração 15/ago/2026)

### HHI (concentração de fornecedores)

| Categoria | HHI raw | Classificação | Top supplier | % share |
|---|---|---|---|---|
| **Bateria (LFP)** | **4.850** | Altamente concentrada | CATL | 95,7% |
| **Powertrain** | **3.400** | Concentrada | Bosch | ~60% |
| **Semicond.** | **2.925** | Moderada-alta | STMicroelectronics | ~45% |

### Stress events (backtesting 5/5 PERFEITO)

| Evento | Período | Vol anualizada | Cum Change |
|---|---|---|---|
| COVID-19 | 2020-03 a 2020-12 | 21,8% | +15,6% |
| Semicondutor | 2021-Q1 | 17,0% | (estimado) |
| Election 2022 | 2022-08 a 2022-11 | 18,0% | +2,6% |
| Lítio spike | 2022-Q2 | 19,5% | (estimado) |
| Election 2024 | 2024-08 a 2024-11 | 12,6% | +6,8% |
| Stagflação 2025 | 2025-01 a 2025-12 | **10,3%** | **-11,4%** |

---

## §5. Linhagem completa: 8 versões × 14 meses

A evolução do projeto segue 3 fases metodológicas × 8 versões documentadas (D2 v1/v2/v2.1 + D3 v0.5/v0.6/v2.0/v2.0.1/v2.0.2):

### Fase 1 — Descritiva (D2 v1, jul/2025)

**Pergunta**: "Quais são as distribuições e concentrações das variáveis?"

- N=1.642 obs PTAX, σ 14,19%, VaR empírico R$ 2,10 bi
- HHI 6 categorias (Bateria 4.850, Powertrain 3.400, Semic. 2.925)
- CATL single-source 95,7%
- 4 cenários regulatórios (NPV esperado R$ 12,09 bi)
- Composite-conceito definido (cálculo virá em v0.6)

**Documentos principais:**
- `d2-econometric-vulnerability/byd-econometric-vulnerability.ipynb` v1
- `d2-econometric-vulnerability/outputs/cambio-stress-test.html`
- `d2-econometric-vulnerability/outputs/cambio-monte-carlo.html` (parcial — histogramas empíricos)
- `d2-econometric-vulnerability/outputs/supply-chain-sankey.html`
- `d2-econometric-vulnerability/outputs/regulatory-scenarios.html`
- `d2-econometric-vulnerability/outputs/competition-landscape.html`
- `d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html`
- `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md` (~430 linhas)

**Limitação chave:** EDA pura, sem modelagem preditiva. Composite não calculado ainda.

### Fase 2 — Preditiva (D2 v2 → v2.1 + NB-01..08, 19/jul/2026)

**Pergunta**: "Qual o risco quantitativo (VaR, MC, couplings)?"

- D2 v2 (19/jul/2026): refresh N=2.778, VaR MC R$ 6,43 bi, GARCH(1,1)-t
- 8 notebooks canônicos NB-01..08 (PTAX, HHI, BNDES, game theory, composite, MC, couplings, backtesting)
- Composite 71,8 AMBER (versão stakeholder 4 dims)
- VaR MC R$ 6,43 bi; CVaR R$ 8,04 bi
- D2-AUDIT identifica 10 gaps estruturais que motivam a transição para D3

**Documentos principais:**
- `d2-econometric-vulnerability/byd-econometric-vulnerability.py` (refresh)
- `analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch.ipynb` (NB-01)
- `analise-prescritiva/notebooks!/02-canonicos/nb-02-supply-chain-hhi.ipynb` (NB-02)
- `analise-prescritiva/notebooks!/02-canonicos/nb-03-regulatory-scenarios.ipynb` (NB-03)
- `analise-prescritiva/notebooks!/02-canonicos/nb-04-competition-game-theory.ipynb` (NB-04)
- `analise-prescritiva/notebooks!/02-canonicos/nb-05-composite-index-radar.ipynb` (NB-05)
- `analise-prescritiva/notebooks!/02-canonicos/nb-06-monte-carlo-multivariado.ipynb` (NB-06)
- `analise-prescritiva/notebooks!/02-canonicos/nb-07-interdependency-couplings.ipynb` (NB-07)
- `analise-prescritiva/notebooks!/02-canonicos/nb-08-backtesting-false-positives.ipynb` (NB-08)
- `analise-prescritiva/notebooks!/02-canonicos/nb-11-backtesting.ipynb` (NB-11)
- `analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md` (8 KB, 10 gaps)
- `d2-econometric-vulnerability/outputs/1-pager-summary.md` (181 linhas)
- `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md` (~410 linhas)

**Limitação chave:** 10 gaps estruturais (interdependências, branching condicional, NPV, counterfactual, triggers dispersos, sem ownership, etc.).

### Fase 3 — Prescritiva (D3 v0.5 → v2.0.2, mai/2026 → 18/ago/2026)

**Pergunta**: "Qual ação executar, quando, por quem, com qual gate?"

- **D3 v0.5** (mai/2026): gap closure D2-AUDIT — +5 dimensões S7-S11
- **D3 v0.6** (jun/2026): framework 11 dimensões S1-S11; pesos canônicos sum=1,15; Caminhos A/B/C; composite 71,8 GREEN
- **D3 v2.0** (21/jul/2026): 5 recalibrações empíricas; 4/5 backtesting; FP 14,8%; composite 50,3 RED
- **D3 v2.0.1** (15/ago/2026): 4 fixes (hysteresis, carry-trade, lítio asymmetry, 5-day); 5/5 PERFEITO; composite 50,3 RED
- **D3 v2.0.2** (18/ago/2026): KG v2.0.2 (110 nós, 118 edges); 12 docs narrativos pt-br + 12 audio scripts + 12 MP3s reais (~99 min); 14 frentes delegação × 5 ondas; DELEGATION-PLAN; SLIDE-DECK-D3; ONE-PAGER-EXECUTIVO

**Documentos principais:**
- `analise-prescritiva/reports/decision-framework/7_outputs/D3-MAIN.html` (127,8 KB)
- `analise-prescritiva/reports/decision-framework/7_outputs/D3-ANNEX.html` (105,7 KB)
- `analise-prescritiva/reports/decision-framework/7_outputs/D3-WORKSHOP.html` (33,7 KB)
- `analise-prescritiva/reports/decision-framework/7_outputs/D3-DASHBOARD.html` (30 KB)
- `analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md`
- `analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md`
- `analise-prescritiva/reports/decision-framework/2_couplings/D3-INTERDEPENDENCY-*.md` (11 arquivos)
- `analise-prescritiva/reports/decision-framework/3_recalibration/D3-RECALIBRATION-*.md` (10 arquivos)
- `analise-prescritiva/reports/decision-framework/4_quantitative/D3-*.md` (4 arquivos)
- `analise-prescritiva/reports/decision-framework/5_operational/D3-*.md` (9 arquivos)
- `analise-prescritiva/reports/decision-framework/6_pitch/D3-*.md` (15+ arquivos)
- `analise-prescritiva/reports/decision-framework/6_pitch/D3-KNOWLEDGE-GRAPH.json` v2.0.2
- `analise-prescritiva/case-studies/docs/00-sintese-executiva.md` a `10-story-notes-s1-a-s11.md` (12 docs)
- `analise-prescritiva/case-studies/docs/audio/*.mp3` (12 MP3s)
- `analise-prescritiva/presentation/DELEGATION-PLAN-ANALISE-PRESCRITIVA.md` (449 linhas)
- `analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md` (~480 linhas)

**Estado atual (22/ago/2026):**
- Composite: 50,3 RED Modo Crise
- VaR 4-shock: R$ 8,21 bi
- CVaR 95%: R$ 10,14 bi
- Backtesting: 5/5 PERFEITO
- Próximo alvo: composite ≥65 AMBER até Q4/2026

### Por que 3 fases e não 1 só modelo?

A separação descritiva → preditiva → prescritiva não é gratuita. Cada fase destrava um estágio diferente do produto de dados:

1. **D2 v1 EDA descritiva** destrava o "**baseline estatístico**" — distribuições marginais, concentrações, dispersões das variáveis (sem modelagem preditiva).
2. **D2 v2/v2.1 preditiva + NB-01..08** destrava o "**diagnóstico quantitativo**" — VaR paramétrico (GARCH-t), MC 10k paths, couplings, composite index, backtesting.
3. **D3 prescritiva v0.5..v2.0.2** destrava a "**prescrição executiva**" — 5 ações 90d (AG-001..AG-003 + AG-DIFF-1/2), ROI 200×, payback <1 mês, RACI 17 personas, modo crise graduado.

Sem essa sequência, o entregável final seria um modelo único (D3) sem ancoragem estatística (sem D2 v1 EDA) e sem validação preditiva (sem D2 v2 + NB-08 backtesting).

---

## §6. O que mudou em ago/2026 (snapshot da evolução recente)

### Mudanças estruturais (15-18/ago/2026)

| Data | Mudança | Doc |
|---|---|---|
| 15/ago/2026 | Recalibração D3 v2.0 → v2.0.1 com 4 fixes (hysteresis, carry-trade, lítio asymmetry, 5-day confirmation) | `D3-FALSE-POSITIVE-FIXES.md` |
| 15/ago/2026 | Backtesting atinge 5/5 PERFEITO (TP 100%, FP 0%, time-to-action 9,3d) | `D3-BACKTESTING-VALIDATION.md` |
| 15/ago/2026 | Composite recalibrado: 71,8 → 50,3 (RED Modo Crise) — alinhamento com realized risks | `EVOLUÇÃO-VERSÕES.md` §4 |
| 15/ago/2026 | Pesos S1-S11 renormalizados de 1,15 → 1,00 | `CLAUDE.md` decision-framework |
| 18/ago/2026 | Sessão narrativa audível: 12 docs didáticos pt-br | `INDEX-NARRATIVO.md` |
| 18/ago/2026 | 12 audio scripts + 12 MP3s reais (~99 min áudio via eSpeak NG) | `audio/*.md`, `audio/mp3/*.mp3` |
| 18/ago/2026 | Knowledge Graph v2.0.2: 110 nós, 118 edges, 11 categorias | `D3-KNOWLEDGE-GRAPH.json` |
| 18/ago/2026 | DELEGATION-PLAN: 14 frentes × 5 ondas de 14 dias | `DELEGATION-PLAN-ANALISE-PRESCRITIVA.md` |
| 18/ago/2026 | SLIDE-DECK-D3 (8 slides) + ONE-PAGER-EXECUTIVO (2 pages A4) | `SLIDE-DECK-D3.pdf`, `ONE-PAGER-EXECUTIVO.pdf` |
| 18/ago/2026 | D4 tracker atualizado: 20 decision_log rows (era 6) + 16 process rows (era 12) | `d4-process-tracker/byd-tracker.db` |
| 18/ago/2026 | 4 vagas LinkedIn prontas para importar | `outputs/linkdin-recruiter-jobs-csv.csv` |

### Snapshot numérico atual (22/ago/2026)

| Métrica | Valor | Status |
|---|---|---|
| Composite stakeholder 4-dim | **50,3 / 100** | 🔴 RED Modo Crise |
| Composite técnico 11-dim | 78 / 100 | 🟡 AMBER (limiar) |
| VaR 95% 6m (4-shock tornado) | **R$ 8,21 bi** | — |
| CVaR 95% 6m | **R$ 10,14 bi** | — |
| Backtesting 5/5 | **PERFEITO** | 🟢 (5/5) |
| Cadeiras vagas | **4 (CFO, CRO, CSO, Head ESG)** | 🔴 137 dias vagas |
| Outreach executado | 0/18 | 🔴 Bloqueado por vagas |
| Investment 365d | R$ 1,68 bi | — |
| E[NPV 3y] | R$ 3,24 bi | — |
| ROI projetado | 200×, payback <1 mês | — |
| Próximo milestone | Composite ≥65 AMBER até Q4/2026 | — |

---

## §7. 14 frentes delegação (DELEGATION-PLAN)

| # | Frente | Owner | Onda | KPI |
|---|---|---|---|---|
| 1 | Hedge FX 95% | Risk+CFO | 1 | hedge ≥90% |
| 2 | Nacionalização 70% | COO | 3 | FX exposure 90%→15% |
| 3 | Resolver lista suja S7 | CFO | 1 | S7 AMBER 30d |
| 4 | Recrutar CFO | CEO+Headhunter | 1 | cadeira preenchida |
| 5 | Recrutar CRO | CEO+Headhunter | 1 | cadeira preenchida |
| 6 | Recrutar CSO | CEO+Headhunter | 2 | cadeira preenchida |
| 7 | Recrutar Head ESG | CEO+Headhunter | 2 | cadeira preenchida |
| 8 | LFP verticalization | CTO | 4 | S2 supply risk -50% |
| 9 | Technology differentiation | CMO | 3 | S4+S11 protection |
| 10 | Rules engine Python (FastAPI) | Engineering | 2 | 4 weeks piloto |
| 11 | Real-time data integration (BCB+Bacen+MTE+ANFAVEA) | Engineering | 3 | 30 regras staging |
| 12 | Knowledge Graph v3.0 | Knowledge Engineer | 4 | embedding search |
| 13 | Backtesting contínuo Q3/Q4 | CRO | 2/4 | 5/5+ mantido |
| 14 | Composite monitoring live | Coord. Risco | 2 | composite semanal |

**Total**: 14 frentes × 5 ondas de 14 dias = cronograma 70 dias (22/ago → 30/nov/2026).

---

## §8. Áudio real (12 MP3s reproduzíveis)

Todos os MP3s foram gerados offline via eSpeak NG pt-br + ffmpeg libmp3lame 64k. Workflow: `audio/generate-mp3s-espeak.py`. Reproduzível sem API key.

| # | Áudio | Duração | Audiência prioritária |
|---|---|---|---|
| 00 | `00-sintese-executiva.mp3` (4 min) | 4 min | Conselho |
| 01 | `01-cadeia-valor.mp3` (6 min) | 6 min | Onboarding |
| 02 | `02-dados-logica.mp3` (10 min) | 10 min | Novo analista |
| 03 | `03-matematica.mp3` (11 min) | 11 min | Investidor curioso |
| 04 | `04-progressao.mp3` (10 min) | 10 min | Novo Conselho |
| 05 | `05-backtesting.mp3` (14 min) | 14 min | Conselho pré-G5 |
| 06 | `06-decisoes.mp3` (12 min) | 12 min | Recém-chegado COO/CRO |
| 07 | `07-cadeia-fabrica.mp3` (14 min) | 14 min | Diretor industrial + COO |
| 08 | `08-decision-matrix.mp3` (13 min) | 13 min | Novo COO/CRO/Head Área |
| 09 | `09-alertas-personas.mp3` (12 min) | 12 min | Coordenador Risco 24/7 |
| guia | `guia-comunicacao.mp3` (12 min) | 12 min | Apresentador C-level + Marketing |
| Reescrita | `00-sintese-REESCRITA-v2.mp3` (5:10 min) | 5 min | Versão persuasiva |

**Total**: ~118 minutos (~45 MB). Playlists por trilha:
- **Trilha Conselho (1h):** 00-sintese + 06-decisoes + guia-comunicacao
- **Trilha COO (1h20):** 01-cadeia + 07-fabrica + 08-decision-matrix + 09-alertas
- **Trilha CFO (50 min):** 02-dados + 03-matematica + 08-decision-matrix
- **Trilha New joiner (3h30):** todos os 12 áudio em ordem 00→09 + guia-comunicacao

---

## §9. Como começar (3 trilhas)

### Trilha A — Executivo / Headhunter / Imprensa (15 min)

1. **`outputs/SNAPSHOT-OPERACIONAL.md`** (5 min) — raid briefing Conselho
2. **`analise-prescritiva/case-studies/docs/00-sintese-executiva.md`** (5 min) — fotografia 1 página
3. **`analise-prescritiva/case-studies/docs/EXPLAINER-NAO-TECNICO.md`** (5 min) — sem matemática

### Trilha B — Técnico / Risk Officer / Analista (4 h)

1. **`HUB.md`** (este, 20 min) — mapa cruzado
2. **`analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md`** (45 min) — síntese cross-version
3. **`analise-prescritiva/notebooks!/LINHAGEM.md`** (60 min) — linhagem técnica
4. **`analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`** (60 min) — D3 v0.5 → v2.0.2
5. **`analise-prescritiva/reports/decision-framework/7_outputs/D3-MAIN.html`** (60 min) — relatório principal consolidado

### Trilha C — Auditor / COO / Engenheiro (8 h)

1. **Trilha A + B** (4 h)
2. **`d2-econometric-vulnerability/byd-econometric-vulnerability.ipynb`** (90 min) — notebook D2 espelho
3. **`analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch.ipynb`** a `nb-15-final-dashboard.ipynb`** (90 min) — 15 notebooks canônicos
4. **`d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md`** a `L6.2-mesa-risco-operacional.md`** (90 min) — 29 docs didáticos D2

---

## §10. Próximas evoluções (roadmap)

### Curto prazo (90 dias — até 30/nov/2026)

- ✅ Composite sair de RED (50,3) para AMBER (≥65)
- ✅ Resolver lista suja MTE (AG-001)
- ✅ Hedge FX 95% contratado (AG-003)
- ✅ 1 stress test mensal (NB-06 seed=42)
- ✅ Recrutar CFO + CRO + CSO + Head ESG
- ✅ Wave 1+2 outreach (8/18 vagas)

### Médio prazo (Q1-Q4 2027)

- Q1 2027: composite ≥75 (implementar AG-DIFF-2 technology differentiation)
- Q3 2027: composite ≥80 GREEN (aceleração nacionalização 70%)
- Q4 2027: composite ≥85 (AG-DIFF-1 LFP verticalization)
- Fechar Gap 3.4 (counterfactual) em v3.0 Q2 2027
- Fechar Gap 3.7 (game theory full S11 NASH 5-player) Q3 2027
- Fechar Gap 3.9 (S6 macro prescriptive trigger automático) Q4 2027

### Longo prazo (2028+)

- Rules engine Python FastAPI produção
- Real-time data integration (BCB + Bacen + MTE + Fastmarkets + ANFAVEA + CCEE)
- Knowledge Graph v3.0 com embedding search
- Dashboard React conectado aos modelos D3 (work-in-progress)

---

## §11. Metadata e manutenção

- **Versão deste HUB**: 1.0 — 25/ago/2026
- **Total docs indexados**: ~250+ (12 narrativos + 12 MP3s + 15 notebooks + 11 outputs HTML + 6 outputs PNG + 8 study notes + 30+ decision-framework + 30+ couplings/recalibration/quantitative/operational/pitch + d1-d5 + diagrams + outputs)
- **Próxima revisão sugerida**: pós-AG-001 (30/set/2026) ou pós-v3.0
- **Cross-refs validados**: validator Python em `d2-econometric-vulnerability/_study_notes/_validate_xrefs.py` (v2, detecta refs quebradas)
- **Companhia**: `HUB.html` (navegável em browser, Ctrl+F para busca rápida), `INDEX.md` (índice agregado 41 docs), `LINHAGEM.md` (linhagem técnica), `EVOLUÇÃO-VERSÕES.md` (síntese cross-version)

---

**Conclusão em 1 frase**: este HUB consolida toda a documentação do case study BYD Camaçari 2025-2027 em 13 temas × 60+ docs relacionados, com leitura cruzada por duração, número canônico, versão, e delegação — para que qualquer stakeholder encontre o caminho de leitura certo em ≤2 minutos.

**Para entrar no projeto AGORA:** comece pelo `outputs/SNAPSHOT-OPERACIONAL.md` (1 página) → escolha trilha §9 → abra o tema §1 desejado.