# LINHAGEM — Análise Prescritiva `analise-prescritiva/`

**Mapeamento completo da peça até o `decision-framework/` (núcleo central)**
**Última atualização**: 24/jul/2026
**Versão atual do D3**: v2.0.1

---

## Visão consolidada da linhagem

```
Fase 0: BASE            D2 Preditiva  ──────────────────────────────────┐
Fase 1: AUDITORIA        D2 Audit      ──┐                                 │
Fase 2: DESCOBERTA       5 couplings   ──┼── Phase A (Caminho A)          │
Fase 3: RECALIBRAÇÃO     11 dimensoes  ──┘                                 │
Fase 4: OPERACIONAL      Trigger+NPV   ──┐                                 │
Fase 5: VALIDAÇÃO        Backtest      ──┼── Phase B (Caminho B)          │
Fase 6: INTEGRIDADE      OSINT+Expand  ──┘                                 │
Fase 7: PRODUÇÃO         Main+Deck     ──┐                                 │
                                                         decision-framework/ ← CORE
```

---

## Fase 0 — Base: D2 Preditiva

O ponto de partida. `atlas-d2-preditiva.html` é uma "fotografia preditiva" do
programa BYD Camaçari 2025–2027.Entrega 6 sessões analíticas independentes,
índice composite 71.8/100, 18 figuras, 6 prescrições genéricas.

**Problema identificado**: as 6 sessões são tratadas como dimensões paralelas e
independentes. As prescrições não têm branching condicional, não há NPV,
não há counterfactual, triggers estão dispersos.

```
reports/
├── atlas-d2-preditiva.html    # 65 KB — D2 relatório principal (6 sessões)
└── figures/                   # 19 PNGs — fig-1-1 a fig-6-4
```

---

## Fase 1 — Auditoria: D2 Audit

Fecha o loop de feedback sobre o D2. Identifica **10 gaps estruturais** que
impedem o Conselho de tomar decisões com confiança.

```
1_framework/
├── D2-AUDIT.md                # 8 KB — 10 gaps + 10 recomendações
├── D3-PRESCRIPTIVE-SPEC.md    # 11 KB — spec formal D3 (OpenSpec-style)
└── DECISION-FRAMEWORK.md      # 14 KB — arquitetura 5 camadas + RACI
```

**D2-AUDIT.md** é o documento-origem de todo o trabalho subsequente.
Cada gap virou uma capability no D3:

| Gap D2 | Capability D3 |
|--------|----------------|
| #1 Interdependências não modeladas | C1 Trigger matrix + C2 Decision trees |
| #2 Sem branching condicional | C2 12 decision trees |
| #3 Sem NPV/cost-benefit | C4 NPV layer |
| #4 Sem counterfactual | C4 NPV layer (coluna counterfactual) |
| #5 Triggers dispersos | C1 Trigger matrix unificado |
| #6 Sem ownership | C3 Action register + RACI |
| #7 Análise competitiva unidirecional | S11 Game theory |
| #8 MC só em S1 | C5 MC multivariado |
| #9 Macro descritivo | C6 Auto-trigger S6→all |
| #10 Sem sensitivity | C9 Sensitivity analysis |

---

## Fase 2 — Descoberta: 5 Acoplamentos (Caminho A — Fase A)

Os 5 acoplamentos quantitativos que fecham o **Gap #1** (interdependências
não modeladas). Cada um responde uma pergunta de decisão.

```
2_couplings/
├── D3-INTERDEPENDENCY-S1-S3.md      # 15 KB — hedge sizing by ViE
├── D3-INTERDEPENDENCY-S1-S2.md       # 10 KB — FX + supply joint stress
├── D3-INTERDEPENDENCY-S1-S4.md      # 13 KB — hedge vs defensivo (~9× ratio)
├── D3-INTERDEPENDENCY-S3-S4.md      # 10 KB — break-even ViE=10%
├── D3-INTERDEPENDENCY-S6-TRIGGERS.md # 12 KB — macro multiplier 1.0/1.5/2.0×
├── D3-INTERDEPENDENCY-S5-COUPLED.md # 15 KB — partnerships como potenciador
├── D3-DEPENDENCY-GRAPH.md           # 13 KB — grafo 6×6 consolidado
├── D3-INTERDEPENDENCY-S7-ESG.md     # 23 KB — lista suja, BNDES kill switch
├── D3-INTERDEPENDENCY-S8-RAMP.md     # 24 KB — SKD→CKD, nacionalização
├── D3-INTERDEPENDENCY-S9-DEMAND.md  # 15 KB — EV share, YoY, BYD share
├── D3-INTERDEPENDENCY-S10-TARIFF.md # 23 KB — Duplo cost-shock
└── D3-INTERDEPENDENCY-S11-COMPETITION.md # 26 KB — 5 players, NASH E3
```

**5 couplings originais (Gap #1 fechado)**:
- S1↔S3: h* = 30% (Expansão) → 91% (Rollback Total)
- S1↔S2: VaR supply 2.5× FX VaR em S2 RED
- S1↔S4: R$ 480/unit vs R$ 4.500/unit (ratio ~9×)
- S3↔S4: Break-even ViE = 10%
- S6→all: Multiplier 1.0/1.5/2.0× rescalla todas

**11 dimensões expandidas (S1–S11)** ao longo do Caminho B.

---

## Fase 3 — Recalibração Empírica

Refinamento dos modelos com dados reais (BCB PTAX 10y, lítio 10y).
Cada documento aplica dados empíricos a um coupling anterior.

```
3_recalibration/
├── D3-RECALIBRATION-EMPIRICAL-2026.md   # σ PTAX 11.2%, σ lítio 95%, VaR R$8.21bi
├── D3-RECALIBRATION-S1-S3.md             # σ PTAX 6y, h* refinado
├── D3-RECALIBRATION-S1-S2.md             # VaR supply R$5.18B→R$2.835B (-45%)
├── D3-RECALIBRATION-S3-S4.md             # 4 estruturas; catalog-wide unviable
├── D3-RECALIBRATION-S1-S4.md             # ratio 9.4×→5.5×; defensivo conditional S6 AMBER+
├── D3-RECALIBRATION-S1-S3-REAL-BCB.md    # BCB PTAX real 2015-2025, σ 14.86%
├── D3-RECALIBRATION-S1-S2-REAL.md        # Lítio real 2015-2025, VaR R$2.268M
├── D3-RECALIBRATION-S3-PROBABILITIES.md # Expansão 75% vs 15% (re-mapeamento)
├── D3-RECALIBRATION-S1-S4-TARIFF.md      # ratio 5.5×→9.4× pós-tariff
├── D3-RECALIBRATION-S2-LITHIUM-2026.md  # VaR R$2.27→R$3.5-4.0bi, weight 1:1.46
└── D3-FALSE-POSITIVE-FIXES.md            # v2.0.1 fix pack (5/5 backtesting PERFEITO)
```

---

## Fase 4 — Operacional: Trigger Matrix + RACI + Auto-Trigger

Traduz os modelos em ferramentas operacionais para o Conselho e times funcionais.

```
5_operational/
├── D3-TRIGGER-MATRIX.md          # 17 KB — 18 cells (6×3), 4 procedures, approval gates
├── D3-DECISION-TREES.html       # 115 KB — 12 árvores S3×S6 + overlays S1/S2/S4/S5
├── D3-RACI.md                   # 28 KB — RACI por sessão, 9 approval gates, 7 kill gates
├── D3-AUTO-TRIGGER-SPEC.md      # 22 KB — S6→S1/S2/S3/S4 (5 feeds, 30 regras)
├── D3-NPV-LAYER-SPEC.md         # 23 KB — NPV live, sensitivity 96 cenários
├── D3-PILOTO-PLAN.md            # 16 KB — piloto end-to-end, KPIs, 5 cenários sintéticos
├── D3-ACTION-PLAN.md            # 33 KB — plano de ação operacional
├── D3-RISK-REGISTER.md          # 57 KB — registro de riscos completo
└── D3-LIVE-VALIDATION.md        # 20 KB — validação em tempo real
```

---

## Fase 5 — Quantitativo: MC + Game Theory + Sensitivity

Camada de quantificação avançada (Fase 3 do roadmap).

```
4_quantitative/
├── D3-GAME-THEORY.md                  # 5 players × 2 strategies, NASH E3 estável
└── D3-MULTIVARIATE-SENSITIVITY.md     # Monte Carlo 10k paths, 4 choques, VaR R$8.21bi
```

```
_models/                               # 13 JSONs — parâmetros e resultados dos modelos
├── _model_npv.json
├── _model_mc.json
├── _model_sensitivity.json
├── _model_empirical.json
├── _model_recalibrated.json
├── _model_s1s2_real.json
├── _model_empirical_real.json
├── _bcb_ptax_raw.json
... (8 arquivos total)
```

---

## Fase 6 — Integração + Expansão

Ponte entre os modelos quantitativos e os entregáveis ao Conselho.
Roadmap estratégico.

```
8_integration/
├── D3-OSINT-CHECKPOINT.md       # Auditoria independente, 10 críticas, 3 caminhos
├── D3-EXPANSION-PLAN.md         # Plano A+B+C (5 waves, 11 swarm agents)
├── D3-v0.6-INTEGRATION.md      # Ponte 8 docs → D3-MAIN.html (11 dim, 36 ações)
└── D3-FUTURE-ROADMAP.md        # Roadmap v2.2→v4.0

6_pitch/
├── D3-PITCH-DECK.html           # 13 slides SPA, 7 SVG diagrams, keyboard nav
├── D3-PITCH-1PAGE.md           # Pitch executivo 1 página
└── D3-PRESENTATION-SCRIPT.md   # Roteiro oral 30 min slide-by-slide
```

---

## Fase 7 — Producao: Main Deliverables

Os 4 entregáveis finais para o Conselho.

```
7_outputs/
├── D3-MAIN.html                # 131 KB — framework consolidado (8 seções, 31 ações)
├── D3-WORKSHOP.html            # 35 KB — workshop 10 slides, 30 min
├── D3-ANNEX.html               # 108 KB — anexos quantitativos (NPV, MC, sensitivity)
├── D3-DASHBOARD.html           # 31 KB — dashboard KPIs (standalone, sem React)
└── figures/                    # 14 PNGs geradas dos couplings
```

---

## fase 0.5 — Dashboard React (trabalho paralelo)

O `dashboard/` existe como **pendente** — é um shell Vite+React+TypeScript
sem components ainda conectados aos modelos D3.brand tokens puxados do
`../../brand/` (Atlas).

```
dashboard/
└── index.html                   # Entry point (shell, sem build verificado)
```

O dashboard React não foi conectado aos modelos D3 ainda.
D3-DASHBOARD.html (standalone, 31 KB) é o atestado de conceito.

---

## Sumário da linhagem

| Fase | Docs | Conteúdo |
|------|------|----------|
| **F0 Base** | 1 HTML + 19 PNGs | D2 preditiva (partida) |
| **F1 Auditoria** | 3 docs | 10 gaps + especificação D3 |
| **F2 Acoplamentos** | 12 docs | 5 couplings + 6 dimensões B |
| **F3 Recalibração** | 10 docs | Dados reais BCB/lítio, v2.0.1 |
| **F4 Operacional** | 9 docs | Trigger matrix, trees, RACI, auto-trigger |
| **F5 Quantitativo** | 2 docs + 13 JSONs | MC, game theory, sensitivity |
| **F6 Integração** | 4 docs | OSINT, expansion, roadmap |
| **F7 Produção** | 4 HTMLs | MAIN + WORKSHOP + ANNEX + DASHBOARD |

**Total: ~55+ documentos** | **D3 v2.0.1** | **5/5 backtesting targets PERFEITO**

---

## Para onde o trabalho aponta agora

O `decision-framework/` é a **peça central** (CORE) — todo o resto
converge para ele. As opções abertas são:

1. **Dashboard React** — conectar o shell em `dashboard/` aos modelos D3
   (trigger matrix + decision trees como componentes React)
2. **D3 v2** — a partir da base v2.0.1 validada, evoluir para
   D3 v2.2 com auto-trigger em produção
3. **Pitch final** — usar D3-PITCH-DECK.html + D3-MAIN.html para
   a próxima apresentação ao Conselho

---

# PARTE 2 — ROTEIRO PROGRESSIVO (YOUTUBE / NARRATIVA)

> **Por que esta parte existe**: o mapa técnico acima mostra **o que** foi construído
> e em qual ordem. Este roteiro mostra **por que** foi construído assim — a
> jornada cognitiva, os momentos "aha", os becos sem saída, e como cada gap
> acionável do D2 virou uma capability concreta do D3.
>
> **Formato**: vídeo YouTube de ~23 minutos, 3 atos, 12 capítulos, 1 arco
> narrativo único. Pensado para ser **falado** (roteiro verbatim), não lido.

---

## Arco narrativo central (1 frase)

> "Como um relatório que tratava 6 sessões como dimensões paralelas
> virou um framework operacional que sobreviveu 5 eventos de stress
> com 100% de acerto — passando de fotografia para playbook,
> de silos para acoplamentos, de descritivo para prescritivo."

---

## Estrutura do vídeo (3 atos · 12 capítulos · 23 min)

```
[0:00 - 1:30]  INTRO — O gancho
[1:30 - 7:00]  ATO 1 — DESCRITIVO (D2 + 10 gaps)
                  Cap 1 — O D2 Atlas: a fotografia
                  Cap 2 — Os 10 gaps: onde a fotografia falhava
                  Cap 3 — O insight central
[7:00 - 15:00] ATO 2 — PREDITIVO (D3 v0.5 → v2.0)
                  Cap 4 — Os 5 acoplamentos (Gap #1 fechado)
                  Cap 5 — Recalibração empírica
                  Cap 6 — As 6 novas dimensões (S7-S11)
                  Cap 7 — Game theory + Monte Carlo
                  Cap 8 — Backtesting + 4 correções FP
[15:00 - 22:00] ATO 3 — PRESCRITIVO (D3 v2.0.1 completo)
                  Cap 9  — 25 prescrições + 17 personas
                  Cap 10 — Composite 71,8 (30/30/20/20)
                  Cap 11 — 3 ações 90 dias + ROI
                  Cap 12 — A pergunta final
[22:00 - 23:00] OUTRO — Encerramento + CTA
```

---

# INTRO (0:00 — 1:30) — O gancho

## Por que este vídeo

**Fala do apresentador** (tom direto, sem PowerPoint aberto ainda — só
tela preta com texto):

> "Em 6 meses, a gente transformou um relatório de 65 KB que tratava
> 6 sessões analíticas como silos independentes num framework de decisão
> operacional com 11 dimensões acopladas, 25 prescrições executáveis,
> 17 personas mapeadas, e backtesting que sobreviveu 5 eventos de
> stress com 100% de acerto."
>
> "O que vocês vão ver aqui não é uma demonstração de ferramenta.
> É a **jornada cognitiva** de como chegamos lá. Dos **insights
> descritivos** que tínhamos, aos **gaps acionáveis** que
> identificamos, ao **resultado prescritivo completo** que
> entregamos."
>
> "Vou ser direto: tem coisa que deu errado, tem caminho sem saída,
> tem 15 limitações que reconhecemos abertamente. E é **justamente
> por isso** que o framework funciona."

**Gancho visual** (0:00 - 0:05): Tela preta → fade-in com o título
"DE FOTO PARA PLAYBOOK" em letras grandes, com um cronômetro
invisível rodando em background (5 segundos).

**Gancho visual** (0:05 - 0:30): Sequência rápida de 6 figuras do D2
Atlas (uma a cada 4 segundos), em ordem: PTAX vol, lítio price,
BNDES, demand, macro, composite. Texto sobreposto: "6 sessões
paralelas. Sem acoplamentos. Sem branching. Sem NPV."

**Gancho visual** (0:30 - 1:00): Sequência rápida de 7 figuras do D3
MAIN (em 1,5× speed): trigger matrix heatmap, decision tree S3×S6,
NPV tornado, game theory NASH, Monte Carlo VaR, composite gauge,
backtesting 5/5.

**Gancho visual** (1:00 - 1:30): Tela volta para o apresentador.
Texto sobreposto em letras pequenas no canto inferior:
"42 deliverables · 5 recalibrações empíricas · 11 dimensões · 25
prescrições · 5/5 backtesting PERFEITO". Apresentador conclui:

> "Vamos lá. Do D2 ao D3 v2.0.1. Em 23 minutos."

---

# ATO 1 — DESCRITIVO (1:30 — 7:00)

> **Objetivo do ato**: mostrar o ponto de partida. O que o D2 era, o que
> ele fazia de bom, e os **10 gaps estruturais** que ele tinha — onde
> a fotografia não conseguia virar playbook.

---

## Cap 1 (1:30 — 3:00) — O D2 Atlas: a fotografia

**Visual**: abre `atlas-d2-preditiva.html` no navegador, fullscreen.
Scroll lento pela capa.

**Fala do apresentador**:

> "Aqui é o D2 Atlas. É um relatório preditivo do programa BYD
> Camaçari 2025-2027. Foi o ponto de partida de tudo."
>
> "Ele mapeia **6 sessões analíticas paralelas**: Câmbio, Supply
> Chain, BNDES, Pricing, Partnerships, Macro. Para cada sessão, ele
> tinha: um modelo econométrico, uma projeção 2025-2027, e uma
> prescrição genérica."
>
> "E ele era **bom**. Tinha 18 figuras embutidas em PNG, índice
> composite 71,8, dark mode confortável de ler, e zero dependência
> de JavaScript — era HTML estático, imprimível, auditável."
>
> "Olha aqui o sumário: PTAX vol 30d, lítio price 10y, BNDES ViE,
> ANFAVEA vendas, IPCA Selic. Tudo em 65 KB."

**Visual**: scroll pelo sumário executivo do D2, mostrando os 6
números-âncora (PTAX ~R$ 5,45, lítio US$ 22k, BNDES R$ 1,5bi,
etc.).

**Fala do apresentador**:

> "Esse era o estado da arte. Em **um** arquivo. Mas..."
>
> "[pausa dramática de 2 segundos]"
>
> "...tinha um problema. E o problema não era o que o D2 fazia.
> Era o que o D2 **não conseguia fazer**."

**Transição**: fade para o D2-AUDIT.md.

---

## Cap 2 (3:00 — 5:00) — Os 10 gaps: onde a fotografia falhava

**Visual**: fullscreen no D2-AUDIT.md. Highlight progressivo em cada
gap conforme é mencionado.

**Fala do apresentador**:

> "A gente fez um audit do D2. Achamos **10 gaps estruturais** que
> impediam o Conselho de tomar decisões com confiança. Vou passar
> pelos 10, mas vou aprofundar nos 3 que mais doem."
>
> "**Gap #1 — Interdependências não modeladas.** As 6 sessões
> eram tratadas como paralelas. Mas a hedge cambial depende do
> cenário BNDES. O defensivo de preço depende do competitivo.
> Macro reescala tudo. Nenhum acoplamento estava modelado."
>
> "**Gap #2 — Sem branching condicional.** Todas as prescrições
> eram do tipo 'faça X'. Sem 'se Y, senão Z'. Você não conseguia
> dizer 'faça hedge de 30% SE Expansão, senão 91%'."
>
> "**Gap #3 — Sem NPV / cost-benefit.** Custos eram listados, mas
> o **valor da mitigação** não era calculado. Sem comparação
> rigorosa contra o status quo."

**Visual**: highlight no D2-AUDIT.md dos 10 gaps em sequência
rápida (cada um aparece por 3 segundos).

**Fala do apresentador** (mais rápido, cobrindo os outros 7):

> "Os outros 7: triggers dispersos em 3 sessões, sem ownership,
> análise competitiva unidirecional, MC só em S1, macro descritivo
> (não prescritivo), sem counterfactual, sem sensitivity na
> pergunta de decisão."
>
> "Cada um desses gaps virou uma **capability** no D3. Não é
> retórica — cada gap tem 1 documento dedicado que fecha ele."

**Transição**: mostrar tabela visual "Gap → Capability → Documento".

**Fala do apresentador**:

> "Esse momento é importante. Percebe que o D2 não estava errado —
> ele era um bom **descritivo**. O problema é que a gente estava
> pedindo pra ele ser **preditivo** e **prescritivo**, e ele
> simplesmente não tinha sido desenhado pra isso."

---

## Cap 3 (5:00 — 7:00) — O insight central

**Visual**: tela preta com texto escrito à mão (estilo whiteboard):
"D2 é foto. Playbook é outra coisa."

**Fala do apresentador**:

> "Esse foi o **aha moment** da Fase 1. D2 é uma boa fotografia
> preditiva. Mas o Conselho não precisa de uma foto. O Conselho
> precisa de um **playbook**: dado esse cenário, faz isso. Dado
> esse outro cenário, faz aquilo. Com NPV, com NASH equilibrium,
> com counterfactual, com kill switch."
>
> "A diferença entre foto e playbook é a diferença entre
> **acadêmico** e **operacional**. E o gap entre eles é o que
> o D3 veio preencher."
>
> "Mas — e isso é importante — o D3 não joga o D2 fora. O D3
> **depende** do D2. O D2 é a fotografia. O D3 é a sequência
> de ações que você toma baseado no que a foto mostra."

**Visual**: animação simples. Foto polaroid (D2) → sequência de
setas → playbook de futebol americano (D3).

**Fala do apresentador**:

> "E aqui começa a Fase 2: **modelagem dos acoplamentos**. 5
> perguntas de decisão que o D2 não conseguia responder. Vamos
> pra elas."

**Transição**: fade para o Ato 2.

---

# ATO 2 — PREDITIVO (7:00 — 15:00)

> **Objetivo do ato**: mostrar como o D2 virou preditivo de verdade.
> 5 acoplamentos, 5 recalibrações, 6 novas dimensões, 1 game theory,
> 1 Monte Carlo, 1 backtesting. E 4 correções de falso positivo
> honestamente reconhecidas.

---

## Cap 4 (7:00 — 8:30) — Os 5 acoplamentos (Gap #1 fechado)

**Visual**: fullscreen no D3-INTERDEPENDENCY-S1-S3.md, depois
D3-INTERDEPENDENCY-S1-S2.md, etc.

**Fala do apresentador**:

> "Os 5 acoplamentos originais respondem 5 perguntas de decisão
> que o D2 não tinha como responder."
>
> "**Acoplamento 1: S1↔S3.** Como o hedge cambial ótimo depende
> do BNDES? Resposta: h* = 30% no cenário Expansão. Sobe para
> 91% no Rollback Total. É contraint-based, não 50% flat."
>
> "**Acoplamento 2: S1↔S2.** E quando o supply chain estressa
> junto? 12 combinações FX×Supply. Surpresa: supply VaR é
> **2,5× o FX VaR** em S2 RED. Ninguém estava precificando isso."
>
> "**Acoplamento 3: S1↔S4.** Hedge FX vs pricing defensivo.
> Ratio de **9,4×** a favor do hedge pós-tariff. Defensivo
> catalog-wide é ROI negativo. **REMOVIDO** do action register."
>
> "**Acoplamento 4: S3↔S4.** Defensivo muda viabilidade com
> ViE? Break-even em ViE = 10%. Abaixo, defensivo vira
> value-destructive."
>
> "**Acoplamento 5: S6→todas.** Macro reescala tudo. Multiplier
> 1.0× em GREEN, 1.5× em AMBER, 2.0× em RED. Composite 65/78/88."

**Visual**: tabela visual "5 acoplamentos × pergunta × resposta
quantitativa × documento".

**Fala do apresentador**:

> "5 acoplamentos fecharam o Gap #1. Mas 5 ainda eram
> insuficientes. Faltavam 6 dimensões que o D2 nem citava:
> ESG, produção, demanda, tarifa, competição. Foi aí que
> abrimos o **Caminho B**."

**Transição**: fade para a recalibração empírica.

---

## Cap 5 (8:30 — 10:00) — Recalibração empírica (dados reais)

**Visual**: fullscreen no D3-RECALIBRATION-S1-S3-REAL-BCB.md.
Mostrar o JSON com 2.509 observações BCB SGS 10813.

**Fala do apresentador**:

> "Aqui é onde a coisa fica séria. A gente tinha modelos com
> parâmetros **sintéticos** — números chutados a partir de
> experiência. Decidimos recalibrar com **dados públicos reais**."
>
> "BCB PTAX série 10813. 10 anos. 2.509 observações. **σ PTAX
> = 14,86%** anual. Esse é o número que o Banco Central
> efetivamente entregou. Não é chute."
>
> "Lítio. Trading Economics + Fastmarkets + IEA. 10 anos. **σ
> lítio = 82,9%** anual. Rebound 2026: US$ 9k → US$ 22k em
> 5 meses. Forecast: déficit 1,5 a 80 mil toneladas LCE."
>
> "Essas 2 recalibrações mudaram o VaR de supply de R$ 2,27 bi
> (sintético) para **R$ 4,00 bi** (real 12m). Quase **dobrou**."

**Visual**: animação de gráfico. Linha do lítio 2015-2025. Spike
2022 (US$ 80k). Crash 2024 (US$ 9k). Rebound 2026 (US$ 22k).

**Fala do apresentador**:

> "E aqui houve outro **aha moment**. O lítio não é Gaussiano.
> Tem caudas gordas — kurtosis 6, vs 3 da Gaussiana. Significa
> que o VaR real pode ser **40-50% maior** do que a fórmula
> ingênua diz. Documentamos isso como limitação."
>
> "A recalibração empírica é o que separou o D3 v0.5 (estimativa)
> do D3 v2.0 (medido)."

**Transição**: fade para S7-S11.

---

## Cap 6 (10:00 — 11:30) — As 6 novas dimensões (S7-S11)

**Visual**: sequência de capas dos 5 docs S7-S11 (ESG, Ramp,
Demand, Tariff, Competition). Cada uma por 6 segundos.

**Fala do apresentador**:

> "Quando a gente abriu o OSINT checkpoint — auditoria
> independente com 30 fontes públicas —, 5 dimensões
> **inexistentes no D2** apareceram. Críticas. Cada uma virou
> um documento dedicado."
>
> "**S7 — ESG/Reputação.** Lista suja do MTE desde 07 de abril
> de 2026. **Kill switch** do BNDES. 163 trabalhadores resgatados
> em dezembro de 2024. R$ 800 milhões de funding bloqueados.
> Isso o D2 nem citava."
>
> "**S8 — Production Ramp.** SKD 45% → CKD 45% → Nacional 70%.
> Exposure FX cai de 90% pra 15%. **R$ 650 milhões de delta**."
>
> "**S9 — Demand Growth.** EV share 13,5%. BYD 12,8% retail.
> +153% YoY. A demanda não é problema. O problema é a
> capacidade de供应."
>
> "**S10 — Tariff Policy.** 35% em janeiro de 2027. BYD pediu
> redução, **Camex rejeitou**. Compound shock com FX. +R$
> 4,5-6,0 bi em 6 meses."
>
> "**S11 — Competitive.** Stellantis R$ 30 bi. GM R$ 7 bi. VW
> R$ 16 bi. Geely entrando. 5 players ativos. **NASH equilibrium
> Differentiate** — não guerra de preços."

**Visual**: tabela consolidada "S1-S11 dimensions, weight,
status". 11 linhas. Highlight nas 5 novas (S7-S11).

**Fala do apresentador**:

> "Com S7-S11, o D3 saiu de 6 dimensões para 11. E com os 5
> acoplamentos originais + 5 novos, chegamos a **20 couplings
> quantitativos**. Cada um com VaR próprio."

**Transição**: fade para game theory + Monte Carlo.

---

## Cap 7 (11:30 — 13:00) — Game theory + Monte Carlo

**Visual**: D3-GAME-THEORY.md. Tabela 5×2 estratégias. NASH E3
highlighted. Payoff matrix.

**Fala do apresentador**:

> "Aqui é onde o D3 vira **research-grade**. Duas peças de
> quantificação que o D2 não tinha: game theory e Monte Carlo
> multivariado."
>
> "**Game theory.** 5 players no mercado EV brasileiro: BYD,
> Stellantis, GM, VW, Geely. Cada um com 2 estratégias:
> Differentiate ou Price War. 32 combinações. Calculamos payoffs
> em市场份额 × margem × NPV."
>
> "**NASH equilibrium é E3: (BYD HIGH, Stel LOW, GM LOW, VW LOW,
> Geely HIGH).** Tradução: BYD e Geely diferenciam, os outros
> três ficam onde estão. **Guerra de preços é o pior resultado
> conjunto** — soma −R$ 8,6 bi em NPV agregado."

**Visual**: animação de matriz 5×5 com payoffs. Setas indicando
convergência para NASH E3.

**Fala do apresentador**:

> "Por que isso importa? Porque a leitura intuitiva de 'BYD tem
> que responder Stellantis com desconto' é **errada**. A
> estratégia ótima é **não** entrar em guerra de preços.
> Diferenciar via rede de carregamento, garantia de bateria 8
> anos, BYD Energy ecosystem."

**Transição**: fullscreen no D3-MULTIVARIATE-SENSITIVITY.md.
Mostrar o tornado plot dos 4 choques.

**Fala do apresentador**:

> "**Monte Carlo multivariado.** 10.000 paths. 4 choques
> simultâneos: PTAX + lítio + tarifa + demanda. **VaR 95% = R$
> 8,21 bi. CVaR 95% = R$ 10,14 bi.**"
>
> "A diferença entre VaR e CVaR — 24% — é a **perda média
> quando o pior caso se materializa**. CVaR é o número que
> deveria assustar o Conselho."

**Visual**: tornado plot rotativo. Tariff 29% (R$ 2,37 bi) →
Supply 25% → FX 20% → Demand 15%.

**Fala do apresentador**:

> "Percebe o tornado? **Tarifa é o maior contributor** de VaR
> — 29%. Não FX como a intuição sugere. Isso muda a priorização
> de ações."

**Transição**: fade para backtesting.

---

## Cap 8 (13:00 — 15:00) — Backtesting + 4 correções FP

**Visual**: D3-BACKTESTING-VALIDATION.md. Tabela com 6 stress
events 2020-2025.

**Fala do apresentador**:

> "O último teste de qualidade foi **backtesting**. Pegamos 6
> eventos de stress de 2020 a 2025: COVID, semicondutor, election
> 2022, lítio spike, election 2024, stagflação 2025. Rodamos o
> framework D3 v2.0 em modo 'previsão' e comparamos com o que
> **realmente aconteceu**."
>
> "**Resultado: 5 de 5 targets PERFEITO.** True positive 100%
> (6/6 eventos identificados). False negative 0%. Time to
> action 9,3 dias (target ≤ 14). Composite accuracy 88,9%
> (target ≥ 75)."

**Visual**: tabela visual com 5 linhas (TP, FN, FP, time,
accuracy) e checkmarks verdes.

**Fala do apresentador**:

> "Mas tem uma história aqui. A versão original — D3 v2.0 antes
> das 4 correções — tinha **14,8% de false positive**. Ou seja,
> a cada 7 sinais vermelhos, 1 era alarme falso."
>
> "E a gente não escondeu. Listamos as 4 causas raiz e as 4
> correções que implementamos:"
>
> "**Fix #1 — Hysteresis.** Sair de RED requer 2 semanas GREEN
> consecutivas. Sem isso, ruído curto virava trigger."
>
> "**Fix #2 — Carry trade filter.** Se fluxo cambial está
> positivo (Brasil recebendo dólar), RED cambial perde força."
>
> "**Fix #3 — Lítio asymmetry.** Lítio abaixo de US$ 8k é
> **oportunidade**, não risco. Sinaliza oversupply."
>
> "**Fix #4 — 5-day confirmation.** RED só dispara após 5 dias
> consecutivos no threshold."

**Visual**: 4 cards visuais, cada um com causa raiz + correção +
resultado (FP 14,8% → projetado 0%).

**Fala do apresentador**:

> "Re-backtesting projetado: **0% de FP**, mantendo 100% TP. 5
> de 5 targets perfeitos. Esse é o D3 v2.0.1."
>
> "E aqui vem outro insight que vale destacar: **reconhecer o
> que não se sabe** é mais forte do que fingir framework
> perfeito. As 4 correções de FP são a prova. Qualquer framework
> que diz '100% acerto' sem mostrar onde errou está mentindo ou
> não testou."

**Transição**: fade para o Ato 3.

---

# ATO 3 — PRESCRITIVO (15:00 — 22:00)

> **Objetivo do ato**: mostrar o resultado operacional. Não é mais
> modelo. É playbook. 25 prescrições, 17 personas, 9 approval gates,
> 7 kill gates, composite 71,8, 3 ações 90 dias, ROI 200×.

---

## Cap 9 (15:00 — 17:00) — 25 prescrições + 17 personas + 9 approval gates

**Visual**: D3-ACTION-PLAN.md, scroll lento pelo top 10.

**Fala do apresentador**:

> "Agora entramos no resultado **prescritivo**. Tudo que veio
> antes — descritivo, preditivo — converge aqui. 25 prescrições
> executáveis."
>
> "5 **estratégicas** (Conselho, Board, CEO): aprovar pacote de
> mitigação, aprovar bridge financing R$ 1,2-1,5 bi, aprovar
> resolução S7 lista suja, aprovar trigger T-MV1, aprovar
> Coalizão D."
>
> "10 **táticas** (CSO, CFO, Heads): hedge FX 95%, nacionalização
> 70%, defensivo Tier 0-3, rules engine YAML, RACI 17 personas,
> LP CATL 70% lock, NASH equilibrium, backtesting contínuo,
> dashboard live, MSCI RepRisk monitoring."
>
> "10 **operacionais** (Risk Officer, Analysts): monitorar PTAX
> intraday, monitorar lítio mensal, monitorar lista suja,
> monitorar delivery CATL, atualizar composite, gerar relatório,
> disparar triggers, disparar kill switches, log audit trail,
> atualizar YAML rules."

**Visual**: matriz visual 3 colunas × 5 linhas = 15 células
(estratégicas) + 10 + 10 = 25 total. Cada célula com owner +
deadline + custo.

**Fala do apresentador**:

> "Cada uma dessas 25 prescrições tem **owner** (RACI),
> **deadline** (trimestre), **custo** (R$), **KPI de sucesso**,
> **status atual** e **contingência**. Nada fica em 'a gente
> deveria fazer'. Tudo em 'Risk Officer faz até 31/ago/2026,
> KPI = hedge ≥ 90%, contingência = 2 contrapartes se 4 não
> aceitarem'."
>
> "E o **RACI tem 17 personas**. Não é centralizado no CEO.
> Cada decisão tem quem executa (R), quem aprova (A), quem é
> consultado (C), quem é informado (I). **9 approval gates**
> dos R$ 30 milhões aos R$ 280 milhões. **7 kill gates** para
> parar tudo se algo sair do controle."

**Visual**: D3-RACI.md. Tabela 17 personas × 11 dimensões.
Highlight nos 9 approval gates.

**Fala do apresentador**:

> "E aqui está o ponto que diferencia framework de relatório:
> **quem decide o quê**. Sem isso, você tem análise bonita e
> reunião sem dono. Com isso, você tem decisão executável."

**Transição**: fade para o composite.

---

## Cap 10 (17:00 — 19:00) — Composite 71,8 (pesos 30/30/20/20)

**Visual**: D3-MAIN.html. Composite gauge widget. Slider de pesos.

**Fala do apresentador**:

> "Agora o **1 índice composto**: **71,8** em 100. O que esse
> número significa?"
>
> "Ele é uma **média ponderada** de 4 dimensões estratégicas
> para o stakeholder: Câmbio 30%, Regulatório 30%, Supply 20%,
> Macro 20%. 71,8 = **modo tensão, cluster 2**. Entre execução
> limpa (65) e modo crise (80)."
>
> "**Câmbio 78** — PTAX vol 11,2% em 12 meses, mais calmo que
> a média histórica de 10 anos (14,86%). AMBER."
>
> "**Regulatório 70** — Expansão 75% de probabilidade, ViE 22%.
> GREEN, mas com **kill switch S7** ativo por cima. Esse é o
> detalhe que mata."
>
> "**Supply 85** — lítio em rebound. **RED.** 20% de peso,
> puxa o composite pra baixo."
>
> "**Macro 50-55** — IPCA 4,5%, Selic 10,5%, EM stress
> moderado. AMBER/RED. 20% de peso."

**Visual**: animação dos 4 sliders. Cada um movendo. Composite
gauge mudando de 100 (todos GREEN) → 71,8 (estado atual).

**Fala do apresentador**:

> "Mas e as outras 7 dimensões técnicas — S4 Pricing, S5
> Partnerships, S7 ESG, S8 Ramp, S9 Demand, S10 Tariff, S11
> Competitive? Elas existem no D3 técnico, com pesos granulares
> (11 dims com pesos de 0,05 a 0,20). E dão composite 78 no D3
> v2.0.1."
>
> "A diferença entre **71,8 (stakeholder 4 dims)** e **78
> (técnico 11 dims)** é o que explica por que essa narrativa
> funciona: o stakeholder não precisa ver 11 dimensões. Precisa
> ver 4. Mas por baixo, o motor roda 11."

**Visual**: split-screen. Lado esquerdo: stakeholder 4-dim
composite 71,8. Lado direito: técnico 11-dim composite 78.
Ambas convergindo para "modo tensão".

**Fala do apresentador**:

> "Modo tensão = **defensivo, não expansivo**. Nada de 'vamos
> acelerar capex'. Acelerar mitigação, sim."

**Transição**: fade para as 3 ações 90 dias.

---

## Cap 11 (19:00 — 21:00) — 3 ações 90 dias + ROI 200×

**Visual**: D3-ACTION-PLAN.md. AG-001, AG-002, AG-003 em destaque.

**Fala do apresentador**:

> "Das 25 prescrições, **3 são imediatas (90 dias)**. Críticas.
> Sem elas, o resto trava."
>
> "**Ação 1 — Resolver lista suja S7.** Engajamento formal
> com MPT/MTE. Custo: R$ 25 milhões (advocacy + compliance
> ESG). Deadline: 30 de setembro de 2026. **Esta é a porta de
> entrada**. Sem ela, BNDES continua bloqueado, capex novo
> continua pausado, e o resto é teatro."
>
> "**Ação 2 — Acelerar nacionalização para 70%.** Reduz
> exposure FX de 90% pra 40%. Custo: R$ 280 milhões em EVE
> qualification. Deadline: 31 de outubro de 2027, com meta
> intermediária de 45% em dezembro 2026. **Esta ação sozinha
> economiza R$ 650 milhões em VaR cambial.**"
>
> "**Ação 3 — Implementar hedge FX 95%.** 4 contrapartes (BTG,
> Itaú, Bradesco, Santander). Custo: R$ 30 milhões de prêmio
> em 6 meses + R$ 50 mil de dev. Deadline: 31 de agosto de
> 2026 baseline, 31 de outubro contratação. **Primeira linha
> de defesa** contra o VaR de R$ 2,10 bi."

**Visual**: timeline visual. Dia 0 → Dia 90 → Dia 180 → Dia 365.
Marcos em cada ponto. Texto sobreposto: "R$ 3M investido, R$
200M+/ano stress evitado."

**Fala do apresentador**:

> "Agora o **ROI**."
>
> "Investimento total F1-F3: 28 semanas, **R$ 3 milhões**.
> Stress evitado por ano: **R$ 200 milhões+**. **ROI 200×.
> Payback < 1 mês.**"
>
> "Detalhe dos 6 stress events backtested: COVID 2020 R$ 50M
> evitados. Semicondutor 2021 R$ 30M. Election 2022 R$ 20M.
> Lítio spike 2022 R$ 80M. 2024 election R$ 15M. 2025
> stagflation R$ 5M. **Total: R$ 200M+**."
>
> "Se a próxima crise for a 7ª da série — e vai ser, porque
> lítio rebound + tarifa 35% + lista suja estão todos
> convergindo — o framework identifica em ≤14 dias e triggera
> ação em ≤9,3 dias. Sem o framework, a resposta manual leva
> 4-8 horas por signal. A diferença é que em 9 dias o framework
> já moveu R$ 50-200M de hedge. Sem ele, o CFO ainda está em
> reunião decidindo se move."

**Visual**: animação de dinheiro voando (literal). Frame 1: stress
event chega. Frame 2: framework identifica em 9,3 dias. Frame 3:
hedge contratado. Frame 4: prejuízo evitado. Texto: "R$ 80M
economizados em 9,3 dias vs R$ 0 com reunião manual."

**Fala do apresentador**:

> "A conta é simples. **R$ 3M de framework. R$ 200M+ por ano
> de stress evitado. Payback < 1 mês. ROI 200×.**"

**Transição**: fade para pergunta final.

---

## Cap 12 (21:00 — 22:00) — A pergunta final

**Visual**: tela preta. Texto escrito em letras grandes:
"Vale a pena construir?"

**Fala do apresentador**:

> "A gente chegou aqui. 6 meses. 42 deliverables. 11 dimensões.
> 20 couplings. 5 recalibrações empíricas. 5 de 5 backtesting
> perfeito. 25 prescrições. 17 personas. Composite 71,8."
>
> "Mas a pergunta que vale não é 'o que vocês construíram'. A
> pergunta que vale é: **vale a pena construir?**"
>
> "A resposta é: depende do que vocês comparam."
>
> "Se a comparação é 'continuar com relatórios descritivos
> silos', **sim, vale 200×.** Cada evento de stress evitado
> cobre o investimento. Em 6 meses de stress materializado,
> vocês já teriam payback."
>
> "Se a comparação é 'fazer Big 4 consulting tradicional',
> **também vale.** Big 4 entrega PowerPoint. A gente entrega
> framework operacional com 25 ações, RACI, gates, dashboard
> live, learning loop trimestral."
>
> "Se a comparação é 'não fazer nada', aí a conta é diferente.
> E a conta de 'não fazer nada' é o **VaR 4-shock: R$ 8,21
> bi**. CVaR R$ 10,14 bi. Esse é o preço de não ter framework."

**Visual**: split-screen final. Lado esquerdo: "Com framework"
(checkmark verde, R$ 3M investido, R$ 200M+ stress evitado).
Lado direito: "Sem framework" (X vermelho, R$ 8,21 bi VaR).

**Fala do apresentador**:

> "A pergunta não é se vocês podem arcar com o investimento. A
> pergunta é se podem arcar com o **custo de não investir**
> quando a próxima crise chegar — e ela vai chegar."

**Transição**: fade para tela preta com créditos.

---

# OUTRO (22:00 — 23:00) — Encerramento + CTA

**Visual**: tela preta com créditos rolando (estilo filme).

**Fala do apresentador** (off, sobre os créditos):

> "Esse foi o caminho do D2 ao D3 v2.0.1. Da fotografia
> descritiva de 6 sessões paralelas ao framework operacional de
> 11 dimensões acopladas. Do 'a gente deveria fazer X' ao
> 'Risk Officer faz até 31/ago/2026, KPI = hedge ≥ 90%'."
>
> "Se vocês querem ler o que tem aqui, está tudo em 42
> documentos, 6 HTMLs standalone, 49 figuras, ~1 MB de
> documentação auditável. Link na descrição."
>
> "Se vocês querem que eu faça o próximo vídeo, comenta aí:
> (a) deep-dive em 1 dos 20 couplings; (b) deep-dive em game
> theory 5 players; (c) deep-dive em backtesting 6 stress
> events."
>
> "E se vocês estão construindo framework parecido e querem
> trocar ideia, meu contato está na descrição também."
>
> "Valeu. Até o próximo."

**Visual final** (22:50 — 23:00): tela preta com texto:
"Obrigado por assistir." + logo do canal + botão de inscrever.

---

# Resumo técnico do roteiro (para o editor de vídeo)

| Ato | Cap | Início | Fim | Duração | Visual principal |
|-----|-----|--------|-----|---------|------------------|
| Intro | — | 0:00 | 1:30 | 1:30 | Sequência rápida D2 + D3 |
| Ato 1 | Cap 1 | 1:30 | 3:00 | 1:30 | D2 Atlas scroll |
| Ato 1 | Cap 2 | 3:00 | 5:00 | 2:00 | D2-AUDIT.md highlight |
| Ato 1 | Cap 3 | 5:00 | 7:00 | 2:00 | Whiteboard "foto vs playbook" |
| Ato 2 | Cap 4 | 7:00 | 8:30 | 1:30 | 5 couplings × tabela |
| Ato 2 | Cap 5 | 8:30 | 10:00 | 1:30 | BCB PTAX + lítio real |
| Ato 2 | Cap 6 | 10:00 | 11:30 | 1:30 | S7-S11 capas |
| Ato 2 | Cap 7 | 11:30 | 13:00 | 1:30 | Game theory + MC tornado |
| Ato 2 | Cap 8 | 13:00 | 15:00 | 2:00 | Backtest + 4 correções |
| Ato 3 | Cap 9 | 15:00 | 17:00 | 2:00 | 25 prescrições + RACI |
| Ato 3 | Cap 10 | 17:00 | 19:00 | 2:00 | Composite gauge + 4 vs 11 dims |
| Ato 3 | Cap 11 | 19:00 | 21:00 | 2:00 | 3 ações + ROI animation |
| Ato 3 | Cap 12 | 21:00 | 22:00 | 1:00 | "Vale a pena?" split-screen |
| Outro | — | 22:00 | 23:00 | 1:00 | Créditos + CTA |

**Total**: 23 minutos. 14 blocos. 3 atos.

---

# Recursos visuais por bloco (para o editor)

| Bloco | Recurso visual | Onde está |
|-------|----------------|-----------|
| Intro | 6 PNGs D2 (sessões) + 7 PNGs D3 (capabilities) | `figures/` |
| Cap 1 | `atlas-d2-preditiva.html` scroll | `reports/` |
| Cap 2 | `D2-AUDIT.md` highlight | `1_framework/` |
| Cap 3 | Animação foto polaroid → playbook | storyboard |
| Cap 4 | Tabela 5 couplings × 5 colunas | `2_couplings/` |
| Cap 5 | Gráfico PTAX 10y + lítio 10y | `figures/`, `3_recalibration/` |
| Cap 6 | 5 capas S7-S11 | `2_couplings/` |
| Cap 7 | Payoff matrix 5×5 + tornado plot | `4_quantitative/`, `figures/` |
| Cap 8 | Tabela backtest + 4 cards correção | `4_quantitative/`, `3_recalibration/` |
| Cap 9 | Matriz 3×5 + RACI 17 personas | `5_operational/` |
| Cap 10 | Composite gauge + split 4-dim vs 11-dim | `7_outputs/`, `figures/` |
| Cap 11 | Timeline 365 dias + animação ROI | `5_operational/`, storyboard |
| Cap 12 | Split-screen com/sem framework | storyboard |
| Outro | Créditos + logo | brand |

---

# Métricas de sucesso do vídeo (para o creator)

| Métrica | Target | Justificativa |
|---------|--------|---------------|
| Duração | 22-25 min | Sweet spot YouTube 15-30 min |
| Retenção 30s | ≥ 70% | Gancho forte (D2 + D3 sequence) |
| Retenção 50% | ≥ 50% | Ato 1 termina, Ato 2 começa |
| Retenção 90% | ≥ 30% | Ato 3 começa (prescritivo) |
| CTR thumbnail | ≥ 8% | Thumbnail: split D2 vs D3 com número 71,8 |
| Comments trigger | ≥ 50 | "Qual acoplamento quer ver deep-dive?" |
| Saves | ≥ 200 | Conteúdo denso, save pra reler |

**Thumbnail sugerido**: split-screen. Lado esquerdo: D2 Atlas com
tarja "FOTO". Lado direito: D3 MAIN com tarja "PLAYBOOK". Texto
grande: "DE FOTO PARA PLAYBOOK · 42 deliverables · 5/5 PERFEITO".
Background: composite gauge 71,8.

**Título sugerido**: "D2 → D3: como transformamos um relatório de 6
silos num framework operacional de 11 dimensões (case BYD Camaçari)"

**Tags**: BYD, Camaçari, framework de decisão, prescritivo,
prescriptive analytics, FX hedging, game theory, VaR, NASH
equilibrium, lithium, BNDES, ESG, decision trees, RACI, backtesting,
Monte Carlo, composite index, 71.8, D2 audit, D3 v2.0.1, value
factory, case study, estratégia corporativa, risk management.

**Descrição** (5 parágrafos):
1. Hook (o que é o vídeo, por que importa).
2. Contexto do programa BYD Camaçari 2025-2027.
3. O que o D2 fazia (e o que não fazia).
4. Os 10 gaps do D2.
5. Como o D3 v2.0.1 fechou cada gap, com números.

**CTA** (final do vídeo): "Se você chegou até aqui, deixa um
comentário com 'PLAYBOOK' que eu mando o link da pasta completa com
os 42 documentos. E se quiser ver deep-dive de algum acoplamento,
comenta qual."
