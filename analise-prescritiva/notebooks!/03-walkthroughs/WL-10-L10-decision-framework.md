# WL-10 · Walkthrough Visual do Notebook L10 — Framework de Decisão

> **Arquivo fonte:** `notebooks!/l10-decision-framework.ipynb`
> **Tamanho:** 357 KB · **Cells:** 23 (≈9 markdown + 14 code)
> **Trilha:** Avançada (L7–L10) · **Duração estimada:** 24–28 min
> **Liga a (D2):** `L3.0-matrizes-decisao.md` + `L4.1-dashboards-executivos.md`
> **Liga a (NB-*):** NB-05/08 (composite + backtesting) — integração final

---

## 1 · Visão geral do notebook (2 min)

L10 é o **último notebook da trilha L*** e o **ponto de convergência**.
Ele **integra** tudo que veio antes: 11 dimensões, 18 células de
trigger matrix, score composto **71,8 = AMBER**, decision tree S3×S6,
backtesting 5/5 PERFEITO.

É o notebook que responde: **"e agora, o que eu faço na segunda-feira
de manhã?"** A resposta é o **workflow de 6 estágios** + **checklist
executivo** + **3 ações 90 dias**.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Workflow completo (do PTAX ao registro) | 4 min |
| 2 | 11 dimensões, 4 eixos de board | 4 min |
| 3 | Trigger matrix 18 células (6×3) | 5 min |
| 4 | Composite score 71,8 + interpretação | 4 min |
| 5 | Decision tree S3×S6 + checklist | 4 min |
| 6 | Backtesting 5/5 + 3 ações 90 dias | 5 min |

Conceito-chave do projeto: **8 notebooks, 3 camadas (medir → integrar →
validar)**. Quem pula qualquer camada **não tem framework** — tem
**relatório descritivo**.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Framework de Decisão — Integração para Executivos" |
| M02 | Abertura: medição, integração, validação |
| M04 | Diagrama 11 dimensões |
| M06 | Diagrama 4 eixos × 11 motor |
| M08 | Heatmap trigger matrix 6×3 |
| M10 | Composite gauge (71,8 = AMBER) |
| M12 | Decision tree S3×S6 |
| M14 | Backtesting 5 eventos |
| M16 | Top 6 ações por composite |
| M18 | Resumo executivo export |
| M22 | Síntese final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup + import NB-08 (modelo final consolidado) |
| C03 | **Figura 1** — Workflow 6 estágios (PTAX → registro) |
| C05 | **Figura 2** — 11 dimensões como radar chart |
| C07 | `DIM_11` ranking por composite |
| C09 | 4 dimensões do board vs. 11 do motor |
| C11 | **Figura 3** — Trigger matrix 18 células (heatmap 6×3) |
| C13 | `EV = NB["nb08"]["events"]` — 5 eventos stress backtesting |
| C15 | **Figura 4** — Top 6 ações por composite |
| C17 | `resumo = {}` — export JSON com composite 71,8 |
| C19 | **Figura 5** — Dashboard composite (gauge + radar) |
| C20 | **Figura 6** — Decision tree S3×S6 |
| C21 | **Figura 7** — Executive checklist visual |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Workflow de 6 estágios

```
PTAX (S1) → Supply (S2) → BNDES (S3) → Pricing (S4)
   → Partnerships (S5) → Macro (S6) → Trigger Matrix
   → Composite → Decision Tree → Backtesting → Action Plan
```

**Intuição executiva:** **seis estágios, do PTAX até o registro**. Se
algum estágio não tem dono ou não tem métrica, o framework **não
funciona**. Por isso o D3 inclui RACI (responsabilidade) por estágio.

### Conceito 2 — 4 dimensões no board, 11 no motor

**Intuição executiva:** **4 dimensões para o board, 11 para o motor**.
Não é inconsistência — é **redução dimensional consciente** (L7).
O Conselho opera em **4 eixos canônicos** (Câmbio, Supply, BNDES,
Macro); o motor usa 11 para granularidade operacional.

### Conceito 3 — Trigger matrix 18 células

$$T_{ij} = \{(\text{sessão}_i, \text{estado}_j) : i \in \{1..6\}, j \in \{G, A, R\}\}$$

**Intuição executiva:** **6 sessões × 3 estados (GREEN/AMBER/RED) = 18
células**. Cada célula tem **procedure** + **approval gate**. Exemplo:
célula (S3, AMBER) → procedure = "revisar ViE BNDES", approval = CFO
+ Treasurer.

### Conceito 4 — Composite score

$$\mathrm{Composite} = \sum_{i=1}^{11} w_i \cdot s_i, \quad w_i \in \{30\%, 30\%, 20\%, 20\%\}$$

**Intuição executiva:** **71,8 = AMBER = modo tensão**. Tradução
operacional: **hedge ativo, capex em revisão, comunicação a Conselho
trimestral**. O número é **semáforo**, não opinião.

### Conceito 5 — Decision tree

**Intuição executiva:** árvore binária (sim/não) que **ramifica** a
decisão. No projeto: **S3 × S6 = 12 árvores** (3 estados de S3 × 4
estados de S6). Cada folha da árvore = **uma ação concreta**.

### Conceito 6 — Backtesting

**Intuição executiva:** **validação honesta do framework**. Os 5
eventos stress do projeto (2015 Dilma, 2018 Eleição, 2020 COVID, 2022
BCB, 2024 Regulação) foram **retroprojetados** no framework. Resultado:
**5/5 = PERFEITO** (significância p = 0,031, L2).

### Conceito 7 — Ações 90 dias

**Intuição executiva:** **três ações, uma janela, ROI claro**. O D3
define: **Ação 1** (revisar hedge sizing), **Ação 2** (fechar parceria
S5), **Ação 3** (escalar S6 macro). Cada uma tem **responsável**,
**prazo** e **métrica de sucesso**.

---

## 4 · Outputs e visualizações (3 min)

Sete figuras em `outputs/learning/`:

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l10_workflow_6stages.png` | Diagrama de fluxo | 6 estágios do PTAX ao registro |
| `l10_11d_radar.png` | Radar chart | 11 dimensões com pesos 30/30/20/20 |
| `l10_trigger_matrix.png` | Heatmap 6×3 | 18 células com procedures anotadas |
| `l10_composite_gauge.png` | Gauge | Velocímetro 0-100 com 71,8 = AMBER |
| `l10_top6_actions.png` | Treemap | Top 6 ações por composite contribution |
| `l10_decision_tree.png` | Árvore binária | S3 × S6 com folhas de ação |
| `l10_executive_checklist.png` | Checklist visual | 12 itens para a próxima reunião |

**Insight #1:** o **radar 11D** mostra S1 (Câmbio) com peso 30% e
score atual 65 — **maior contribuição absoluta** para o 71,8. Se S1
cair para 40, o composite cai para ~58 (RED).

**Insight #2:** a **trigger matrix 6×3** tem **7 células AMBER** e
**2 RED** no baseline — exatamente os pontos onde o Conselho precisa
de **approval gate** explícito.

**Insight #3:** o **decision tree S3×S6** mostra que **S3=AMBER +
S6=AMBER** (probabilidade estimada 35%) é o caminho mais provável.
A folha dessa combinação = **ação 1: revisar hedge sizing**. Por
isso essa é a **primeira das 3 ações 90 dias**.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L3.0-matrizes-decisao.md` | Arquitetura completa da matriz de decisão 4D |
| `L3.1-trigger-matrix-auto-trigger.md` | Especificação técnica da trigger matrix |
| `L4.1-dashboards-executivos.md` | Como apresentar o composite no dashboard do Conselho |
| `L4.0-comunicacao-conselho.md` | Linguagem executiva — como falar 71,8 = AMBER |

L10 é o **fechamento** da trilha L* e a **porta** para NB-05
(composite) + NB-08 (backtesting) + MAIN.html (framework completo).

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "71,8 = OK":** AMBER **não é** verde. Significa
  **operação em modo tensão**. Hedge ativo, capex em revisão,
  comunicação **trimestral** ao Conselho. Tratar AMBER como verde é o
  erro #1 de gestão.
- **Armadilha #2 — "Backtesting garante futuro":** não. Garante que o
  framework **teria funcionado** em 5 eventos passados. O 6º evento
  (2026) é o teste real.
- **Insight para gravar:** **3 camadas, não 1**: medir (L3-L6),
  integrar (L7-L9), validar (L10). Quem pula camadas tem **relatório
  descritivo**, não framework.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** **8 notebooks, 3 camadas, 11 dimensões, 18
  células, 71,8 = AMBER, 5/5 backtesting PERFEITO, 3 ações 90
  dias**. Esse é o **framework integrado** do projeto BYD Camaçari.
  Quem entende esse número toma **decisão executiva com confiança**;
  quem não entende, **volta para o dashboard descritivo**.

| Próximo passo | Onde ir |
|---|---|
| Fim da trilha L* | Implementação: NB-05 / NB-08 → MAIN.html |
| Aprofundar framework | `_study_notes/L3.0-matrizes-decisao.md` |
| Aplicação canônica | D3-MAIN.html (131 KB, framework consolidado) |

---

### 🎯 Mapa final da trilha L* — 11 notebooks em 4 atos

```
ATO 1 · FUNDACIONAL (L0-L2)      — Alfabetização: ler números, ler incerteza
ATO 2 · ANALÍTICA (L3-L6)        — Modelos: regressão, série, vol, MC
ATO 3 · AVANÇADA (L7-L10)        — Decisão: multivariada, otimização, jogos, integração
ATO 4 · PRODUÇÃO (L10 → NB-*)    — Implementação no framework D3
```

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
