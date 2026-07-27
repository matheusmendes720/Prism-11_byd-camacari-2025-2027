# D3 — Base de Estudo: Decision Framework (Camada Prescritiva)

> **Documento capa** da base de estudo progressiva em
> `analise-prescritiva/reports/decision-framework/_study_notes_d3/`
>
> **Data**: 27/jul/2026 · **Versão de referência**: D3 v2.0.1 (com roteiro de extensão v2.1)
>
> **Audiência**: cientistas de dados juniores que já passaram pela base D2
> (`d2-econometric-vulnerability/_study_notes/`, 24 docs / ~816 KB) e querem
> entender a **camada que transforma VaR predito em ação executável**.
>
> **Foco**: didática sub-atômica + matemática explícita + walkthrough real dos
> artefatos D3, com cross-references REAIS para `1_framework/`, `2_couplings/`,
> `3_recalibration/`, `4_quantitative/` e `5_operational/`.

---

## §0. Bem-vindo à camada prescritiva

O D3 é o **sistema nervoso autônomo** do programa BYD Camaçari 2025-2027.
Enquanto o **D2** é o *raio-X* (estático, mostra o estado do programa), o **D3**
é o *sistema nervoso* (percebe sinais, decide, age, aprende).

Esta base didática existe porque:

1. **O D2 terminou com 10 gaps estruturais** (ver `1_framework/D2-AUDIT.md`):
   interdependências não modeladas, prescrições sem branching condicional,
   sem NPV por prescrição, sem counterfactual, triggers dispersos, sem
   ownership, análise competitiva unidirecional, sem MC multivariado, macro
   descritivo, sem sensitivity para a pergunta de decisão.

2. **O D3 fecha esses 10 gaps com 5 camadas funcionais**
   (DATA / SIGNAL / DECISION / ACTION / LEARNING) + 11 dimensões
   prescritivas (S1–S11) + uma 12ª dimensão (S12 — drift cambial) proposta no
   v2.1 + **17 personas** com RACI completo + **30+ triggers** automáticos +
   **39 ações** no action register + **NPV live layer** com recálculo
   contínuo + **CVaR95 = R$ 10,14 bi** como métrica de provision.

3. **A complexidade é alta** (5 camadas × 12 dim × 25 ações × 96 cenários de
   sensitivity), então a leitura precisa ser **guiada**. Esta base faz isso
   em 5 documentos progressivos, replicando o formato da base D2 mas
   focando no **como decidir** (não no como modelar).

---

## §1. O que é a base D3 (decision framework vs analytical)

A diferença central é uma única palavra: **prescrição**. O D2 entrega
"aqui está o risco" (descritivo/preditivo); o D3 entrega "aqui está o que
fazer agora" (operacional/prescritivo).

| Aspecto | D2 (analytical) | D3 (decision framework) |
|---|---|---|
| Camada | Preditiva | Prescritiva |
| Outputs | VaR, composite, MC, GARCH | Decisão + ação + owner + KPI |
| Cadência | Mensal / trimestral | Diária → semanal → mensal → trimestral |
| Quem usa | Risk Officer + analytics | CEO + CFO + CSO + heads funcionais |
| Pergunta que responde | "Qual é o risco?" | "O que fazer agora, quem paga, até quando?" |
| Triggers | Dispersos em 6 sessões | Unificados em matriz 6×3 = 18 cells + 30+ regras |
| Aprovação | Relatório | RACI + 8 approval gates por valor (R$ 1M / 10M / 30M / 50M / 100M / 280M / 500M+) |
| Learning | Manual, semestral | Trimestral, com recalibração de elasticidades |

> **Chef's tip**: se você está chegando da base D2, pense no D3 como o
> "L4" (decisão executiva) do D2 elevado a **sistema operacional contínuo**.
> O D2 já tinha L3 prescritivo (matrizes de decisão); o D3 institucionaliza
> L3 + L4 + L5 num framework único com **auto-trigger**, **RACI** e
> **NPV live**.

---

## §2. Estrutura da base D3 (5 docs progressivos)

Esta capa inicial tem **5 documentos** (≈ 90 KB total). A numeração segue o
padrão da base D2: `D3-X.Y-título-descritivo.md`.

| # | Arquivo | Tamanho-alvo | Tópico | Pré-requisito |
|---|---|---|---|---|
| **README** | `README.md` | 12-18 KB | Capa, navegação, métricas | nenhum |
| **D3-0.0** | `D3-0.0-arquitetura-decision-framework.md` | 18-25 KB | 5 camadas + 11 dim + 12ª S12 + composite | L2 D2 |
| **D3-0.1** | `D3-0.1-matrizes-decisao-completo.md` | 18-25 KB | Matriz S3×S6 + 4D Risk Map + 5 gates | D3-0.0 |
| **D3-0.2** | `D3-0.2-raci-trigger-matrix.md` | 18-25 KB | 17 personas + 30+ triggers + auto-trigger | D3-0.0 |
| **D3-0.3** | `D3-0.3-npv-action-register.md` | 15-22 KB | NPV live + 39 ações + investment plan 365d | D3-0.1, D3-0.2 |

**Tempo estimado de leitura sequencial**: 4-6 horas.

### Convenções

- **Tabelas grandes** usam o formato markdown padrão (compatível com GitHub).
- **Fórmulas** usam LaTeX inline (`$...$`) ou bloco (`$$...$$`) — copie para
  um renderer Markdown com KaTeX se quiser visualização matemática.
- **Cross-references** entre docs D3 usam caminho relativo (`D3-0.1-...`);
  para a base D2 use prefixo `../../../../d2-econometric-vulnerability/_study_notes/`.
- **Cross-references para artefatos D3** (em `1_framework/`, `2_couplings/`,
  etc.) usam caminho relativo ao working dir
  `analise-prescritiva/reports/decision-framework/`.
- **Boxes didáticos** usam blockquote `>` com marca `> **Chef's tip**:`,
  `> **Atenção**:` ou `> **Conexão**:`.
- **Status** do framework na data de capa:
  - D3 v2.0.1 (21/jul/2026): framework validado, 5/5 backtesting targets
    perfeitos, sensitivity 96 cenários, MC 4-shock R$ 8,21 bi VaR95.
  - D3 v2.1 (proposta, ainda não ativada): adiciona S12 (drift cambial),
    15 novos triggers (drill-downs), e roteiriza gate de **modo crise**
    formal para composite ≥ 88.

---

## §3. Mapa conceitual ASCII das 5 camadas D3

A arquitetura vertical do D3 é um pipeline de **5 camadas funcionais** com
**feedback loop trimestral**. Cada camada consome o output da anterior e
alimenta a próxima.

```
                         ╔═══════════════════════════════════════════╗
                         ║  Layer 5 · LEARNING (trimestral)          ║
                         ║   post-mortem · recalibração · update     ║
                         ╚═══════════════╤═══════════════════════════╝
                                         │ feedback (90 dias)
                                         ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  Layer 4 · ACTION                                                          ║
║   39 ações · RACI · 8 approval gates · KPI tracking · status               ║
║   owners: CEO, CFO, COO, CSO, Heads funcionais                            ║
║   output: D3-ACTION-PLAN.md + action register operacional                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                         │ execução
                                         ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  Layer 3 · DECISION                                                        ║
║   12 decision trees (12 combinações materialmente distintas de sinais)     ║
║   cost-benefit por cenário · 5 gates condicionais (G1-G8)                  ║
║   output: D3-DECISION-TREES.html + D3-RACI.md                             ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                         │ acionamento por sinais
                                         ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  Layer 2 · SIGNAL (tempo real, 5 min latency)                              ║
║   30+ regras YAML · 6 dimensões × 3 níveis = 18 cells · 5 kill switches    ║
║   composite = soma ponderada · macro multiplier 1.0×/1.5×/2.0×              ║
║   output: D3-TRIGGER-MATRIX.md + D3-AUTO-TRIGGER-SPEC.md                   ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                         │ contínuo
                                         ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  Layer 1 · DATA (D2 vive aqui, inalterado)                                ║
║   BCB SGS (PTAX, IPCA) · MDIC/ANFAVEA · MDIC/ANP (lítio) · BNDES portal  ║
║   refresh: PTAX 4×/dia · macro mensal · composite recalc ≤1h              ║
║   output: 6 sessões D2 + 18 figuras + composite 71.8/100                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Camadas em uma frase cada

| Layer | Nome | Função | Cadência | Latência alvo |
|---|---|---|---|---|
| **1** | **DATA** | D2 inalterado — produz composite + VaR | Mensal | n/a (batch) |
| **2** | **SIGNAL** | 6 dimensões × 3 níveis + composite | Diária → intraday | ≤ 5 min |
| **3** | **DECISION** | 12 árvores + 5 gates | Semanal | ≤ 60 min |
| **4** | **ACTION** | 39 ações com RACI | Contínua | ≤ 5 dias úteis |
| **5** | **LEARNING** | post-mortem + recalibração | Trimestral | 90 dias |

> **Conexão D2**: a Layer 1 consome exatamente o que a base D2 produz em
> `L2.2-cambio-stress-test-monte-carlo.md` (MC 4-shock, VaR, CVaR) e em
> `L3.0-matrizes-decisao.md` (matriz S3×S6 preditiva). O D3 não substitui
> nada — ele **opera continuamente sobre** o D2.

---

## §4. As 11 dimensões (S1–S11) + 12ª proposta (S12)

O D3 v2.0.1 organiza o risco em **11 dimensões prescritivas** (S1-S11).
O D3 v2.1 (proposta) adiciona uma **12ª dimensão (S12)** que captura o
**drift cambial estrutural** (não coberto pelos triggers pontuais de S1).

| Dim | Nome | Função | Peso v0.6 | Peso v2.1 proposto | Trigger principal |
|---|---|---|---|---|---|
| **S1** | FX / Hedge cambial | PTAX level + vol 30d | 0.18 | 0.18 | PTAX 5.40 / 5.80; vol 18% / 25% |
| **S2** | Supply Chain (Lítio) | VaR supply realized / baseline | 0.16 | 0.16 | HHI 3500 / 4500; lítio > US$80k/t 3m |
| **S3** | Regulatório / BNDES / ViE | ViE preservado (% funding) | 0.18 | 0.18 | ViE 20% / 10% (RB Parcial / Total) |
| **S4** | Pricing / Defensivo | Δ market share 90d | 0.16 | 0.06 | Share −1pp / −2pp |
| **S5** | Partnerships / LP | Stakeholders em risco | 0.10 | 0.06 | 1 / 2+ stakeholders |
| **S6** | Macro Governor | PIB + IPCA + FGV | 0.10 | 0.10 | PIB 0% / −1%; IPCA 5% / 7% |
| **S7** | ESG / Reputação | Kill switch (lista suja MTE) | 0.05 | **0.10** | MTE / controversies / MSCI <B |
| **S8** | Production Ramp | % nacionalização | 0.08 | 0.08 | 25% → 45% → 70% (3 metas) |
| **S9** | Demand Growth | EV market share trend | 0.04 | 0.05 | 6% / 13% (+153% YoY realizado) |
| **S10** | Tariff Policy | Camex/Gecex tarifa efetiva | 0.05 | **0.10** | 14% / 35% (fato consumado jan/2027) |
| **S11** | Competitive Landscape | 5 players, Nash equilibrium | 0.05 | 0.10 | Price war iminente (Differentiate) |
| **S12** | **Macro Regime (v2.1)** | **Drift cambial estrutural** | — | 0.05 | σ realizado 6m > 18% sustentado 90d |

> **Nota sobre pesos**: o ajuste **S10 de 0.05 → 0.10** e **S7 de 0.05 → 0.10**
> vem da recalibração empírica C1 (`3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md`):
> tarifa 35% e lista suja ESG eram premissas ausentes que se materializaram.
> S12 (drift cambial) é uma proposta nova — ainda não validada — que captura
> o regime de **depreciação sustentada do BRL** (3+ trimestres consecutivos
> de PTAX subindo), distinto do trigger pontual de S1 (PTAX cruza threshold).

### Couplings (acoplamentos) entre dimensões

Os couplings são a **inovação central** do D3 vs D2. Onde o D2 trata as 6
sessões originais como dimensões independentes, o D3 reconhece que algumas
prescrições só fazem sentido **condicionalmente**:

| Coupling | Direção | Tipo | Quantificação |
|---|---|---|---|
| **S1↔S3** | bidirecional | sizing | h* = 30% (Expansão ViE) → 91% (Rollback Total) |
| **S1↔S2** | bidirecional | VaR conjunto | joint VaR 2.5× in RED |
| **S1↔S4** | bidirecional | break-even | hedge R$480/unit vs defensivo R$4.500/unit (~9×) |
| **S3↔S4** | unidirecional S3→S4 | break-even | defensivo break-even a ViE = 10% |
| **S6→all** | broadcast | multiplier | macro multiplier 1.0× / 1.5× / 2.0× |
| **S10↔S1** | bidirecional | duplo cost-shock | multiplicativo (1.10 × 1.21 = 1.33) |
| **S7→all** | override | kill switch | bloqueia BNDES independente do ViE |
| **S12→S1** (v2.1) | unidirecional | regime | reescala h* baseline ±10pp |

Detalhamento em `D3-0.0-arquitetura-decision-framework.md` §4.

---

## §5. Caminhos de leitura por perfil

A base D3 é **densa** (~90 KB total). Recomendamos 4 trilhas de acordo com
o objetivo do leitor.

### Trilha 1 — Executivo (CEO / Conselho) · 30 min

| Ordem | Doc | Por quê |
|---|---|---|
| 1 | `README.md` (este) | visão 1 página |
| 2 | `D3-0.1-matrizes-decisao-completo.md` §1, §6 | entender Cell R1 + VaR 6.43bi |
| 3 | `D3-0.2-raci-trigger-matrix.md` §5 | quem decide o quê, até que valor |
| 4 | `D3-0.3-npv-action-register.md` §1, §4 | o investimento de R$ 1,68 bi |

**Output**: capacidade de discutir em 1 página quais ações aprovar em
R$ 1M / 10M / 100M / 280M+, quem aprova, e qual o ROI esperado.

### Trilha 2 — CSO / Risk Officer · 2-3 horas

| Ordem | Doc | Por quê |
|---|---|---|
| 1 | `README.md` (este) | mapa geral |
| 2 | `D3-0.0-arquitetura-decision-framework.md` (todo) | as 5 camadas, 11 dim, composite |
| 3 | `D3-0.1-matrizes-decisao-completo.md` (todo) | matriz S3×S6 + 4D Risk Map |
| 4 | `D3-0.2-raci-trigger-matrix.md` (todo) | 17 personas + 30+ triggers + hysteresis |
| 5 | `D3-0.3-npv-action-register.md` (todo) | NPV live + 39 ações + investment plan |

**Output**: capacidade de operar o framework D3 end-to-end — desde o
refresh de PTAX até a aprovação de uma ação de R$ 280M.

### Trilha 3 — Head funcional (Procurement / Marketing / Gov Relations) · 1-2 horas

| Ordem | Doc | Por quê |
|---|---|---|
| 1 | `README.md` §1-§4 | contexto |
| 2 | `D3-0.2-raci-trigger-matrix.md` §2, §3 | quem decide na minha dimensão |
| 3 | `D3-0.3-npv-action-register.md` §3 | quais ações tenho que executar |
| 4 | `D3-0.1-matrizes-decisao-completo.md` §3 | quando minha dimensão entra em stress |

**Output**: clareza de ownership, deadlines, KPIs e approval gates para a
própria dimensão.

### Trilha 4 — Acadêmico / Modelador · 4-6 horas

| Ordem | Doc | Por quê |
|---|---|---|
| 1 | `README.md` (todo) | capa |
| 2 | `D3-0.0-arquitetura-decision-framework.md` (todo) | matemática e fórmulas |
| 3 | `D3-0.1-matrizes-decisao-completo.md` (todo) | decision trees |
| 4 | `D3-0.2-raci-trigger-matrix.md` (todo) | trigger engine + auto-trigger |
| 5 | `D3-0.3-npv-action-register.md` (todo) | NPV live + sensitivity |
| 6 | (re-leitura) `d2-econometric-vulnerability/_study_notes/L2.2-...` | base estatística |
| 7 | (re-leitura) `d2-econometric-vulnerability/_study_notes/L6.1-...` | stress testing institucional |

**Output**: capacidade de **estender** o framework — adicionar S13-S16,
modelar novo coupling, recalibrar pesos via backtesting, escrever regras
YAML para auto-trigger.

---

## §6. Cross-refs com a base D2 (fontes de alimentação)

A Layer 1 do D3 consome **diretamente** o que a base D2 produz. Cada doc
D3 aponta para a fonte D2 relevante:

| Conceito D3 | Fonte D2 (em `_study_notes/`) | Cálculo |
|---|---|---|
| VaR FX 6m P95 | `L1.0-eda-pTAX-passo-a-passo.md` §6 | BCB PTAX σ = 14,86% (validado) |
| MC 4-shock | `L2.2-cambio-stress-test-monte-carlo.md` §5 | Cholesky 4×4, 10.000 paths |
| VaR refresh = 6,43 bi | `L2.2-...md` §8 (atualização jul/2026) | BCB σ 14,86% × VGV R$ 8,82bi × 1,65 |
| VaR v2.0.1 = 8,21 bi | `L2.2-...md` §5 (MC completo) | 4-shock + correlação FX-Supply |
| Matriz S3×S6 | `L3.0-matrizes-decisao.md` §3 | 4 status S3 × 3 status S6 = 12 cells |
| Triggers (catálogo mestre) | `L3.1-trigger-matrix-auto-trigger.md` §3 | 30+ triggers D3 v2.0.1 |
| 17 personas + RACI | `L3.2-raci-action-register.md` §2-§3 | Sponsor, DecisionMaker, RiskOwner, ... |
| NPV live layer | `L3.1-...md` §4 + `L3.2-...md` §5 | fórmulas Python completas |
| Comunicação ao Conselho | `L4.0-comunicacao-conselho.md` (todo) | 1-pager template, linguagem Board |
| Dashboards executivos | `L4.1-dashboards-executivos.md` (todo) | stack Plotly Dash, 4 telas |
| Gap modelo-humano | `L4.2-gap-modelo-humano.md` (todo) | 4 pressupostos, cognitive biases |
| Stress test institucional | `L6.1-stress-testing-institucional.md` | cenários regulatórios |
| Mesa de risco operacional | `L6.2-mesa-risco-operacional.md` | operação contínua |

> **Chef's tip**: o leitor que vem **direto do D2** sem pular etapas vai
> notar que a base D3 **consome sem reinventar**. Toda fórmula, todo
> threshold, todo número aqui tem fonte primária na base D2 ou nos
> artefatos `4_quantitative/`.

---

## §7. Métricas-chave (estado em 27/jul/2026)

Os números que você verá repetidos ao longo da base:

### Composite & risco macro

| Métrica | Valor | Fonte |
|---|---|---|
| **Composite v0.6** | **71,8 / 100** | `1_framework/DECISION-FRAMEWORK.md` §4 |
| **Composite em stress (T-MV1)** | ≥ 88 (modo crise) | `4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` §13 |
| **Composite gatilho kill switch (S7)** | 95 fixo | `5_operational/D3-RACI.md` §4.7 |
| **σ PTAX realizado (BCB 10y)** | 14,86% | `3_recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md` |
| **VaR FX 6m P95 (baseline)** | R$ 2,74 bi | `4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` §2 |
| **VaR FX refresh (jul/2026, σ real)** | **R$ 6,43 bi** | base D2 L2.2 (refresh 27/jul) |
| **VaR 4-shock (D3 v2.0.1)** | R$ 8,21 bi | `4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md` §7 |
| **CVaR 95% 4-shock** | R$ 10,14 bi | mesma fonte §7 |
| **NPV baseline (tariff 14%, mitigação plena)** | R$ 10,0 bi | `3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md` §5.1 |
| **NPV stress (tariff 35%, sem mitigação)** | R$ 2,5 bi | mesma fonte |

### Pessoas, triggers, ações

| Métrica | Valor | Fonte |
|---|---|---|
| **Personas (RACI cast)** | 17 (8 papéis × 2+ titulares) | `5_operational/D3-RACI.md` §2 + base D2 L3.2 |
| **Triggers D3 v2.0.1** | 30+ regras YAML | `5_operational/D3-TRIGGER-MATRIX.md` §3 |
| **Triggers novos D3 v2.1** | +15 (drill-downs) | base D2 L3.1 §4 + roteiro v2.1 |
| **Ações no action register** | **39 (1 removida)** | `5_operational/D3-ACTION-PLAN.md` §2 |
| **Ações CRÍTICAS** | 15 | mesma fonte |
| **Ações condicionais (gateadas por S6)** | 8 | mesma fonte |
| **Approval gates (G1-G8)** | 8 (3 BLOQUEADOS, 2 EM NEGOCIAÇÃO, 1 ATIVO/S7) | mesma fonte §4 |
| **Investment plan 365d** | R$ 1,68 bi | base D3 §3.3 (consolidado) |
| **ROI esperado** | R$ 700M-1bi (1 evento evitado) | `5_operational/D3-ACTION-PLAN.md` §8 |
| **Decisions trees (12 combinações)** | 12 + fallback | `5_operational/D3-DECISION-TREES.html` |
| **Risk register (top risks)** | 10 | `5_operational/D3-RISK-REGISTER.md` |

### Couplings

| Coupling | Tipo | Magnitude |
|---|---|---|
| S1↔S3 (hedge sizing) | sizing | 30% → 91% conforme ViE |
| S1↔S2 (joint VaR) | VaR conjunto | 2,5× em RED |
| S1↔S4 (hedge vs defensivo) | break-even | 9× ratio (R$480 vs R$4.500/unit) |
| S3↔S4 (defensivo break-even) | break-even | ViE = 10% |
| S6→all (macro multiplier) | broadcast | 1.0× / 1.5× / 2.0× |
| S10↔S1 (duplo cost-shock) | multiplicativo | 1.10 × 1.21 = 1.33 (33% cost shock) |
| S7→all (kill switch) | override | bloqueia BNDES R$ 800M+ |

---

## §8. Status atual + roadmap de extensão

### Status em 27/jul/2026

| Componente | Status | Próximo marco |
|---|---|---|
| D3 v2.0.1 (framework validado) | ✅ 5/5 backtesting targets perfeitos | refresh mensal |
| Auto-trigger T2.1 | ⏳ Planejado Q4 2026 (8 semanas) | go-live 31/dez/2026 |
| NPV live layer T2.2 | ⏳ Planejado Q4 2026 (6 semanas) | go-live 31/dez/2026 |
| Dashboard executivo | ⏳ Planejado Q4 2026 | go-live 31/dez/2026 |
| MC multivariado | ✅ Ativo (4-shock, 10k paths) | upgrade para 100k paths Q1 2027 |
| Game theory layer | ✅ Ativo (Nash Differentiate) | refresh semestral |
| Risk register | ✅ Ativo (10 risks monitorados) | revisão trimestral |
| RACI + approval gates | ⏳ Aprovação Conselho pendente (workshop 15/set/2026) | ativação pós-workshop |
| S12 (drift cambial v2.1) | 🔵 Proposta — ainda não ativada | piloto Q1 2027 |
| 15 novos triggers v2.1 (drill-downs) | 🔵 Propostos | piloto Q1 2027 |

### Roadmap de extensão D3 v2.1 (proposta)

| Trimestre | Entrega | Owner |
|---|---|---|
| **Q3 2026 (ago-set)** | Workshop Conselho (15/set) + ativar RACI + iniciar AG-001 (S7 kill switch) | CSO + CEO |
| **Q4 2026 (out-dez)** | Auto-trigger + NPV live + dashboard + 4 contratos hedge | Head Data + Risk Officer |
| **Q1 2027 (jan-mar)** | Stress test anual + recalibração empírica C2 + S12 piloto | Analytics + CSO |
| **Q2 2027 (abr-jun)** | D3 v2.1 go-live (S12 + 15 triggers novos) | CSO + Risk Officer |
| **Q3-Q4 2027** | 5 novas dimensões (S13-S17) — ESG rating, climate, supply map, geo, cyber | CSO |
| **Anual** | Recalibração empírica (C-n) | CSO + Conselho |

---

## §9. Mapa de cross-references (quem aponta para quem)

```
                              ┌─────────────────────────┐
                              │   README.md (esta capa) │
                              └────────────┬────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              ▼                            ▼                            ▼
  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
  │ D3-0.0 arquitetura    │   │ D3-0.1 matrizes       │   │ D3-0.2 RACI+trigger   │
  │ (5 camadas, 11 dim)   │   │ (S3×S6, 4D, gates)    │   │ (17 personas, 30+)    │
  └───────────┬───────────┘   └──────────┬────────────┘   └──────────┬────────────┘
              │                          │                            │
              └──────────┬───────────────┴──────────────┬─────────────┘
                         ▼                              ▼
              ┌─────────────────────────────────────────────────────────┐
              │   D3-0.3 NPV + action register (39 ações, R$ 1,68 bi)  │
              └─────────────────────────────────────────────────────────┘
                                         │
                                         ▼
              ┌─────────────────────────────────────────────────────────┐
              │   Fontes primárias D3 (artefatos)                        │
              │   1_framework/DECISION-FRAMEWORK.md                      │
              │   1_framework/D3-PRESCRIPTIVE-SPEC.md                    │
              │   1_framework/D2-AUDIT.md                                │
              │   2_couplings/D3-INTERDEPENDENCY-*.md (8 docs)          │
              │   2_couplings/_drilldown_v2.1/ (8 drill-downs, v2.1)    │
              │   3_recalibration/D3-RECALIBRATION-EMPIRICAL-2026.md    │
              │   3_recalibration/D3-RECALIBRATION-S*.md (10 docs)       │
              │   4_quantitative/D3-MULTIVARIATE-SENSITIVITY.md          │
              │   4_quantitative/D3-BACKTESTING-VALIDATION.md            │
              │   4_quantitative/D3-FALSE-POSITIVE-FIXES.md              │
              │   4_quantitative/D3-GAME-THEORY.md                       │
              │   4_quantitative/D3-QUANTITATIVE-MODEL.md                │
              │   5_operational/D3-RACI.md                               │
              │   5_operational/D3-TRIGGER-MATRIX.md                     │
              │   5_operational/D3-ACTION-PLAN.md                        │
              │   5_operational/D3-NPV-LAYER-SPEC.md                     │
              │   5_operational/D3-AUTO-TRIGGER-SPEC.md                  │
              │   5_operational/D3-RISK-REGISTER.md                      │
              └─────────────────────────────────────────────────────────┘
```

---

## §10. Como prosseguir

**Próximo passo natural**: ler `D3-0.0-arquitetura-decision-framework.md`,
que cobre as 5 camadas em profundidade, as 11 dimensões S1-S11 + S12,
a fórmula do composite, os 5 couplings originais + 8 drill-downs v2.1,
e o workflow end-to-end com o exemplo real PTAX 5,07 → composite 71,8 →
ação AG-002 hedge 95%.

Se você é impaciente e quer **só a decisão atual** (estado jul/2026):
leia `D3-0.1-matrizes-decisao-completo.md` §6 (estudo de caso) + 
`D3-0.3-npv-action-register.md` §4 (investment plan 365d).

> **Chef's tip final**: o D3 não substitui o D2 — ele **opera sobre** ele.
> Se você ainda não passou pela base D2 (`d2-econometric-vulnerability/_study_notes/`),
> comece por lá. Caso contrário, vamos em frente.
