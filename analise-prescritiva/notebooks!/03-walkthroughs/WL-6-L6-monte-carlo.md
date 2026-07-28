# WL-6 · Walkthrough Visual do Notebook L6 — Simulação Monte Carlo

> **Arquivo fonte:** `notebooks!/l6-monte-carlo.ipynb`
> **Tamanho:** 1,27 MB · **Cells:** 19 (≈9 markdown + 10 code)
> **Trilha:** Analítica (L3–L6) · **Duração estimada:** 24–30 min
> **Liga a (D2):** `L2.2-cambio-stress-test-monte-carlo.md` (4-shock Cholesky + VaR R$ 6,43bi)
> **Liga a (NB-*):** NB-06 (Monte Carlo multivariado) — implementação canônica

---

## 1 · Visão geral do notebook (2 min)

L6 é **o notebook mais visualmente impressionante** da trilha — e o
mais pesado (1,27 MB). A razão: ele gera **10.000 caminhos** da PTAX
em horizonte 6 meses e transforma em **distribuição de outcomes**. É
a ferramenta que responde **"e se...?"** com **distribuição**,
não com ponto.

A ideia central: em vez de calcular **um** número futuro, você simula
**milhares de cenários** possíveis e deixa a distribuição falar.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | A história por trás — por que Monte Carlo existe | 4 min |
| 2 | Simulação: gerar muitos cenários | 5 min |
| 3 | Distribuição de outcomes | 4 min |
| 4 | Percentis: melhor caso, pior caso | 4 min |
| 5 | A frase dos 95% — o que o Conselho precisa saber | 5 min |

Conceito-chave do projeto BYD: o **VaR R$ 8,21 bi** (D3 v2.0.1) emerge
**diretamente** da simulação MC 10k cenários — é o percentil 5% da
distribuição de impacto financeiro. Sem MC, esse número é chute.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Simulação Monte Carlo para Executivos" |
| M01 | A história por trás dos números — por que Monte Carlo existe |
| M04 | Como ler este gráfico (linguagem executiva) — caminhos |
| M05 | Recado executivo — Simulação |
| M07 | Como ler este gráfico — distribuição |
| M08 | Recado executivo — Distribuição |
| M10 | Como ler este gráfico — percentis |
| M11 | Recado executivo — Percentis |
| M13 | Como ler este gráfico — a frase dos 95% |
| M14 | Recado executivo — A frase dos 95% |
| M17 | O que isso significa para você — a página final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C02 | Setup dark + seed + paleta |
| C03 | **Figura 1 (HEAVY)** — 140 caminhos PTAX 6m (subset de 10k para visualização) |
| C06 | **Figura 2** — Histograma da distribuição de PTAX final 6m com cenários discretos |
| C09 | **Figura 3** — Boxplot dos 10k cenários com média, mediana, P5/P95 |
| C12 | **Figura 4** — Curva de distribuição cumulativa (CDF) com VaR marcado |
| C16 | Sumário dos blocos |
| C18 | Frase final consolidada |

> **Nota técnica:** o notebook é pesado (1,27 MB) porque as figuras
> são **vetoriais de alta resolução** + 10.000 pontos no scatter.
> Renderização em browser pode demorar 3-5 segundos por figura.

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Por que Monte Carlo

**Intuição executiva:** quando o problema tem **muitas fontes de
incerteza acopladas** (PTAX + lítio + Selic + demanda + share), a
solução analítica fechada não existe. Monte Carlo **substitui fórmula
por amostragem massiva**. Foi inventado nos anos 40 (Los Alamos,
bomba atômica) e é o método padrão de precificação de derivativos,
risco de portfólio, e stress test regulatório.

### Conceito 2 — Geração de caminhos

$$X_{t+1} = X_t \cdot \exp\left((\mu - \tfrac{1}{2}\sigma_t^2)\Delta t + \sigma_t \sqrt{\Delta t}\, Z_t\right)$$

com $Z_t \sim \mathcal{N}(0,1)$ e $\sigma_t$ dado por GARCH(1,1).

**Intuição executiva:** cada caminho é **um futuro possível**. Os
parâmetros vêm do GARCH (L5) e do drift macro. No projeto: μ = drift
neutro, σ = GARCH condicional, 10.000 caminhos = 10.000 futuros
distintos.

### Conceito 3 — Distribuição de outcomes

**Intuição executiva:** **uma projeção é uma linha; o risco mora no
leque**. O caminho mediano quase sempre é o que aparece em dashboard
— **mas o P5 e o P95 é que decidem hedge**. No projeto: mediana do
PTAX 6m = R$ 5,15; P95 = R$ 6,12. A diferença de R$ 0,97 é a **base
do VaR cambial**.

### Conceito 4 — Percentis (P5, P50, P95)

$$P_k = \mathrm{quantil}_{k/100}(\{X_i\}_{i=1}^{10.000})$$

**Intuição executiva:** **a média esconde; a distribuição revela**.
O impacto médio do projeto BYD é −R$ 0,83 bi (baseline), mas o P5 é
**−R$ 8,21 bi** — uma diferença de 10×. Quem decide pela média está
**subdimensionando o risco** por uma ordem de grandeza.

### Conceito 5 — A frase dos 95%

**Intuição executiva:** "**em 95% dos cenários, o impacto está entre
−R$ 0,5 bi e +R$ 2,3 bi; em 5% dos cenários, o impacto é pior que
−R$ 2,3 bi**". Essa frase — **com números, com cauda explícita** — é
o que diferencia **projeção** de **projeção+plano de contingência**.

### Conceito 6 — Correlação nas amostras (Cholesky)

$$\mathbf{L} \cdot \mathbf{Z}, \quad \mathbf{\Sigma} = \mathbf{L}\mathbf{L}^\top$$

**Intuição executiva:** PTAX, lítio e Selic **não são independentes**.
O D3 usa **decomposição de Cholesky** para gerar cenários
**correlacionados** — sem isso, o MC subestima co-ocorrência de
stresses. No projeto: 4 choques (PTAX, lítio, BNDES, macro) com
matriz de correlação calibrada em dados BCB.

---

## 4 · Outputs e visualizações (3 min)

Quatro figuras em `outputs/learning/` (peso total ~1 MB):

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l6_mc_paths.png` | Fan chart (140 paths) | 140 dos 10.000 caminhos PTAX 6m com P5/P50/P95 sombreados |
| `l6_mc_distribution.png` | Histograma | Distribuição do PTAX final com VaR 5% e 1% marcados |
| `l6_mc_percentiles.png` | Box-plot + IC | Box-plot dos 10k outcomes + intervalo de confiança empírico |
| `l6_mc_cdf.png` | Curva CDF | Probabilidade acumulada de impacto financeiro com VaR |

**Insight #1:** o **leque de paths** abre assimetricamente — a cauda
direita (PTAX alto) é mais frequente e mais longa. Confirmação visual
de que o MC não está subdimensionando upside de stress.

**Insight #2:** a **mediana é −R$ 0,15 bi** (ligeiramente negativa),
mas a **média é −R$ 0,83 bi** — diferença de 5×. Em distribuições
assimétricas, a média **sempre** exagera o downside. Use mediana.

**Insight #3:** o P5 do impacto financeiro = **−R$ 8,21 bi** (D3
v2.0.1) — esse é o **valor de VaR** que entra no plano de
contingência. Sem MC, esse número seria chute.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L2.2-cambio-stress-test-monte-carlo.md` | 4-shock Cholesky + VaR R$ 6,43 bi (pré-recalibração) |
| `L6.0-risco-cauda-extremo.md` | Modelagem de cauda extrema (EVT, GPD) para além do VaR empírico |
| `L6.1-stress-testing-institucional.md` | Quando o MC vira peça regulatória (Basel III, ICAAP) |

L6 é **pré-requisito conceitual** para NB-06 (MC multivariado) e para
L8 (otimização sob incerteza).

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "1.000 cenários bastam":** para VaR 99% em cauda
  longa, **10.000 é o mínimo**. 1.000 dá intervalo de confiança no
  VaR de ±15%, o que é grande demais para decisão executiva.
- **Armadilha #2 — "MC resolve tudo":** MC só funciona se os
  **parâmetros de entrada** (μ, σ, ρ) forem bons. GARCH mal calibrado
  → MC inútil.
- **Insight para gravar:** **a média esconde; o percentil revela**.
  Antes de aprovar um capex baseado em "valor esperado", peça o P5
  e o P95. A diferença é o **range do seu arrepentimento**.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** Monte Carlo **transforma incerteza em
  distribuição visível**. 10.000 cenários não é exagero — é o mínimo
  para VaR honesto. E o **P5 do impacto = R$ 8,21 bi** é o número
  que dimensiona **plano de contingência**, não o orçamento base.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L7 (análise multivariada) |
| Aprofundar MC | `_study_notes/L2.2-cambio-stress-test-monte-carlo.md` |
| Aplicação canônica | NB-06 (MC multivariado) · NB-12 (sensitivity) |

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
