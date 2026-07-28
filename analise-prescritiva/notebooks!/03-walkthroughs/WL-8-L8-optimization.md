# WL-8 · Walkthrough Visual do Notebook L8 — Otimização

> **Arquivo fonte:** `notebooks!/l8-optimization.ipynb`
> **Tamanho:** 1,45 MB · **Cells:** 30 (≈14 markdown + 16 code)
> **Trilha:** Avançada (L7–L10) · **Duração estimada:** 26–32 min
> **Liga a (D2):** `L3.0-matrizes-decisao.md` (4D Risk Map + S3×S6)
> **Liga a (NB-*):** NB-07 (interdependências, decision trees) · NB-12 (sensitivity)

---

## 1 · Visão geral do notebook (2 min)

L8 responde: **"qual é o tamanho certo do hedge?"** Não 30% (chute da
média), não 50% (medo), não 100% (caro). O tamanho **ótimo** depende
do **regime** (Expansão/Estável/Rollback) e do **objetivo**
(maximizar U(h) = NPV − λ·Risco).

É o **notebook mais longo e mais denso** da trilha (1,45 MB · 30 cells),
porque a otimização tem 4 camadas conceituais: objetivo, restrições,
linearidade e sensibilidade — cada uma com sua própria visualização.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | A história — do chute ao ótimo rastreado | 4 min |
| 2 | Encontrar o melhor (definição) | 4 min |
| 3 | Função objetivo (escolha política disfarçada de técnica) | 5 min |
| 4 | Restrições (a cerca do pasto) | 4 min |
| 5 | Linear vs. não-linear (a forma da paisagem) | 4 min |
| 6 | Sensibilidade (o que muda o ótimo) | 5 min |
| 7 | What-if para BYD: 3 números + jornada | 4 min |

Conceito-chave do projeto: **h* = 30% (Expansão) → 77% (Vermelho) →
91% (Rollback Total)**. **Não é chute** — vem de maximização de
U(h) = NPV_h − λ·σ_h, com λ calibrado em apetite a risco do Conselho.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Otimização para Executivos" |
| M02 | A história — o executivo procurando o "tamanho certo" |
| M06 | Recado executivo — Encontrar o melhor |
| M07 | Visualização bônus — Superfície 3D de otimização |
| M11 | Recado executivo — Função objetivo |
| M14 | Recado executivo — Restrições |
| M15 | Visualização bônus — Mapa das restrições |
| M19 | Recado executivo — Linear vs. não-linear |
| M22 | Recado executivo — Sensibilidade |
| M26 | O que isso significa para BYD: 3 números + jornada |
| M29 | Síntese final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup + carregamento parâmetros S1-S3 |
| C03 | **Figura 1 (HEAVY)** — Story figure: do chute ao ótimo rastreado |
| C05 | Calcula vol PTAX (0,1417), NPV base por h |
| C08 | **Figura 2 (HEAVY)** — Superfície 3D U(h, λ) — função objetivo |
| C10 | Função `decompose(h, vie_pct, λ=0.5)` — separa payoff de risco |
| C13 | Sweep h ∈ [0, 1] para encontrar h* em cada cenário |
| C16 | **Figura 3** — Mapa de restrições (h ≥ 0, h ≤ 1, λ ≥ 0, NPV ≥ 0) |
| C18 | Compara otimização linear (LP) vs. quadrática (QP) |
| C21 | Função `h_star_pred(vie, base, delta_vie, regime_mult)` |
| C24 | Sensibilidade: varre ViE ∈ [0, 30%], δ_h*/δ_ViE |
| C28 | Ranking de sensibilidade dos parâmetros |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Função objetivo

$$\max_{h \in [0,1]} U(h) = \mathrm{NPV}(h) - \lambda \cdot \sigma(h)$$

**Intuição executiva:** **a função objetivo é uma escolha política
disfarçada de técnica**. O λ (peso do risco) **não vem dos dados** —
vem do **apetite a risco do Conselho**. λ = 0,5 (default D3) significa
"aceito perder R$ 0,5 bi em NPV para cortar 1% de volatilidade".
**Quem define λ está definindo a estratégia.**

### Conceito 2 — Restrições

$$\text{s.a. } \begin{cases} h \geq 0 \\ h \leq 1 \\ \mathrm{NPV}(h) \geq 0 \\ \text{ViE} \leq 30\% \end{cases}$$

**Intuição executiva:** **três linhas se equilibram**. O h* que vai
para a reunião é onde **a função objetivo toca a cerca das restrições**.
No projeto: o ótimo sem restrição seria h = 0% (max NPV puro), mas
com NPV ≥ 0 e ViE ≤ 30%, sobe para h* = 30%.

### Conceito 3 — Linear vs. quadrático

$$\text{LP: } \max c^\top h \quad\quad \text{QP: } \max c^\top h - h^\top \Sigma h$$

**Intuição executiva:** **linear** assume que o risco cresce
proporcionalmente a h. **Quadrático** reconhece que o risco tem
**covariância** entre os hedges. No projeto: o QP é mais honesto
porque correlação FX×BOM (ρ = 0,72) é **grande**. QP dá h* menor que
LP (proteção contra concentrações).

### Conceito 4 — Sensibilidade

$$\frac{\partial h^*}{\partial \theta_i} = \text{?}$$

**Intuição executiva:** **sensibilidade é o que mata a robustez do
ótimo**. Se o h* muda 10pp quando o ViE muda 1pp, o "ótimo" não é
confiável. No projeto: ranking de sensibilidade mostra que **λ** é
o parâmetro mais sensível (1pp λ → 2,3pp h*); depois **ViE BNDES**.

### Conceito 5 — Regime-dependent optimum

$$h^*(S) = \begin{cases} 30\% & S = \text{Expansão} \\ 50\% & S = \text{Estável} \\ 91\% & S = \text{Rollback Total} \end{cases}$$

**Intuição executiva:** **verde → 30% / vermelho → 77% / rollback →
91%**. A mesma curva de U(h), **três regimes diferentes**, três
h* diferentes. É o acoplamento S1×S3 em forma de otimização.

### Conceito 6 — O tradeoff λ

**Intuição executiva:** λ = peso do risco na função objetivo. **Maior
λ = menor h*** (mais proteção, menos NPV). O Conselho precisa **escolher
λ antes** de calcular h*. **Não existe "ótimo único"** sem antes
definir **quanto você paga para dormir tranquilo**.

---

## 4 · Outputs e visualizações (3 min)

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l8_story_chute_otimo.png` | Scatter com reta | Do chute (h=50%) ao ótimo rastreado (h*=30%) |
| `l8_superficie_3d.png` | Surface 3D | U(h, λ) — função objetivo em duas dimensões |
| `l8_restriction_map.png` | Mapa 2D | Cerca das restrições vista de cima (região factível) |
| `l8_sensitivity_tornado.png` | Tornado | Ranking de ∂h*/∂θ_i para todos os parâmetros |
| `l8_h_by_regime.png` | Bar chart | h* por regime (Verde/Amarelo/Vermelho/Rollback) |

**Insight #1:** a **superfície 3D** mostra que **U(h, λ) tem
sela** — não é convexo puro. Isso significa que **múltiplos ótimos
locais** existem; o D3 usa solver global (differential evolution) para
garantir que找到了 o **global**.

**Insight #2:** o **tornado de sensibilidade** mostra λ no topo, ViE
em segundo, σ PTAX em terceiro. **Implicação prática**: se você
discutir o **apetite a risco (λ)** com o Conselho, **mais importante**
que recalibrar volatilidade.

**Insight #3:** o **mapa de restrições** tem formato de L invertido —
a região factível (ViE ≤ 30% e NPV ≥ 0) **elimina** h > 91% em
qualquer regime. Por isso o cap de 91% (não 100%) — **proteção
total** custaria inviabilidade do BNDES.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L3.0-matrizes-decisao.md` | 4D Risk Map (S1×S3×S6) — espaço onde h* vive |
| `L3.1-trigger-matrix-auto-trigger.md` | Trigger matrix que **ativa** o swap de h* por regime |
| `L2.0-arquitetura-modelagem.md` | Pipeline: regressão (L3) → GARCH (L5) → MC (L6) → otimização (L8) |

L8 é **o ponto onde tudo se encontra**: regressão dá parâmetros,
GARCH dá σ, MC dá distribuições, e **L8 escolhe h***.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "Existe um ótimo único":** não. **O ótimo depende
  de λ** (apetite a risco). Quem apresenta "o ótimo" sem antes definir
  λ está fazendo política sem admitir.
- **Armadilha #2 — "Sensibilidade baixa = robusto":** um h* pouco
  sensível a parâmetros **pode estar sub-ótimo** para o regime atual.
  Robustez ≠ qualidade.
- **Insight para gravar:** **três linhas se equilibram** (função
  objetivo, restrições, regime). Mude uma, e o h* muda. Por isso o
  D3 recalibra **trimestralmente**.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** "30% de hedge" é chute. **h* = 30% é
  ótimo.** A diferença entre os dois é: **função objetivo** + **
  restrições** + **regime**. **λ é política, σ é técnica, regime é
  contexto**. Quem não entende os três não entende o número.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L9 (teoria dos jogos) |
| Aprofundar modelo | `_study_notes/L3.0-matrizes-decisao.md` |
| Aplicação canônica | NB-07 (S1×S3 coupling) · NB-12 (sensitivity 96 cenários) |

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
