# WL-5 · Walkthrough Visual do Notebook L5 — Volatilidade e GARCH

> **Arquivo fonte:** `notebooks!/l5-volatility-garch.ipynb`
> **Tamanho:** 131 KB · **Cells:** 12 (≈5 markdown + 7 code)
> **Trilha:** Analítica (L3–L6) · **Duração estimada:** 20–24 min
> **Liga a (D2):** `L2.1-modelos-vol-garch-gjr.md` (GARCH/GJR/EGARCH + half-life 73d)
> **Liga a (NB-*):** NB-01 (PTAX GARCH) — uso direto dos conceitos

---

## 1 · Visão geral do notebook (2 min)

L5 é **o notebook onde a estatística encontra o risco financeiro**.
L4 mostrou que volatilidade se clusteriza. L5 ensina **como medir isso
formalmente** com GARCH e como transformar volatilidade em **números
acionáveis**: VaR e CVaR.

É o notebook que respira **números reais do projeto**: σ PTAX = 14,67%
(na narrativa introdutória), σ lítio = 95% (anualizada), VaR PTAX
recalculado = R$ 8,21 bi, half-life do shock = 73 dias.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Volatilidade ≠ desvio-padrão fixo | 4 min |
| 2 | GARCH(1,1) — a largura que muda | 5 min |
| 3 | Clustering — calma é regime, não contrato | 3 min |
| 4 | VaR e CVaR — o tamanho da cauda | 5 min |
| 5 | Half-life — quando a ferida sara | 4 min |

Conceito-chave do projeto BYD: a σ PTAX **não é constante**. Em stress
(2015-2016) saltou para 14,86%; em calmaria (2017-2019) ficou em 7,2%.
Modelar isso com GARCH é a **diferença entre hedge que cobre e hedge
que não cobre**.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Não aceite uma média sem a sua variação" |
| M02 | Recado executivo — Volatilidade |
| M04 | Recado executivo — GARCH (mede largura, não direção) |
| M06 | Recado executivo — Clustering |
| M08 | Recado executivo — VaR e CVaR |
| M11 | Síntese final ("L5 concluído") |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup + carregamento PTAX BCB 10y (série real) |
| C03 | **Figura 1** — Volatilidade rolling 30d vs. 252d (visualização do clustering) |
| C05 | **Figura 2** — Ajuste GARCH(1,1) + σ condicional vs. σ incondicionada |
| C07 | **Figura 3** — Volatility clustering: regimes identificados por Markov-switching |
| C09 | **Figura 4** — VaR histórico 1d, 5d, 21d com níveis 95% e 99% |
| C10 | **Figura 5** — CVaR (Expected Shortfall) vs. VaR — diferença visual |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Volatilidade condicional vs. incondicionada

$$\sigma_t^2 \neq \sigma^2_{\text{incondicional}}$$

**Intuição executiva:** o mesmo PTAX pode caber em uma distribuição
estreita (calmo, σ = 7%) ou larga (agitado, σ = 18%). **A média não
distingue**; o GARCH distingue. No projeto: σ incondicionada 10y PTAX =
11,2% (recalibração empírica); σ condicional em maio 2025 = **17,8%**.

### Conceito 2 — GARCH(1,1)

$$\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2$$

$$\alpha + \beta < 1 \text{ (estacionariedade)}$$

**Intuição executiva:** **GARCH mede a largura da faixa, não a
direção**. A frase honesta para o board é "a **incerteza** sobre o
PTAX hoje é de ±X%, e essa incerteza **persistirá** por Y dias". No
projeto BYD: α = 0,08, β = 0,89, persistência = 0,97 → **half-life
de 73 dias** (volatilidade leva ~2,5 meses para normalizar após shock).

### Conceito 3 — Clustering de volatilidade

**Intuição executiva:** **calma é um regime, não um contrato**. Use a
janela calma para revisar hedge e limites — **não para relaxá-los**. No
projeto: o período 2017-2019 (σ = 7,2%) foi seguido por 2020-2022
(σ = 14,8%) — exatamente o oposto do "a.calmou" que algumas pessoas
concluem de uma janela curta.

### Conceito 4 — VaR (Value at Risk)

$$\mathrm{VaR}_\alpha(X) = \inf\{x : P(X \leq x) \geq 1-\alpha\}$$

**Intuição executiva:** **VaR é a porta da cauda**. Em 1 dia, com
95% de confiança, o pior que pode acontecer é perder **mais que VaR**.
No projeto: VaR 1d 99% PTAX = **R$ 480 milhões**; VaR 21d 99% =
**R$ 2,25 bilhões**. Dimensionamento de **colchão de liquidez**.

### Conceito 5 — CVaR (Expected Shortfall)

$$\mathrm{CVaR}_\alpha(X) = E[X \mid X \leq \mathrm{VaR}_\alpha]$$

**Intuição executiva:** **CVaR é o que encontramos depois de
atravessar a porta**. Para o board: **use CVaR, não VaR**, porque VaR
ignora o tamanho do desastre. No projeto: CVaR 99% 21d = **R$ 3,1 bi**
— 38% maior que o VaR. É o número que dimensiona o **plano de
contingência**, não apenas o colchão.

---

## 4 · Outputs e visualizações (3 min)

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l5_vol_rolling.png` | Linha dupla | σ rolling 30d vs. 252d — visualização do clustering |
| `l5_garch_fit.png` | Linha temporal | σ condicional GARCH(1,1) sobre PTAX com choques marcados |
| `l5_regimes.png` | Heatmap temporal | Probabilidade de regime (calmo/agitado) — Markov-switching |
| `l5_var_levels.png` | Linha multi-nível | VaR 1d, 5d, 21d em níveis 95% e 99% |
| `l5_cvar_tail.png` | Histograma com tail | Distribuição de retornos com VaR e CVaR marcados |

**Insight #1:** a σ condicional **antecipa** o choque. No gráfico, a
σ começa a subir 5-7 dias **antes** do pico do PTAX — isso é a
informação que o gatilho S1 consome.

**Insight #2:** o **half-life de 73 dias** significa que, mesmo após
um choque, a volatilidade demora ~2,5 meses para normalizar. Por
isso o D3 mantém o hedge **ativo por 90 dias após o trigger**, não
revisa imediatamente.

**Insight #3:** o **CVaR é 38% maior que o VaR** — quem reporta só
VaR está **subestimando a cauda**. Em evento extremo (1% dos dias), o
prejuízo real é 38% maior do que o "limite de 99%" sugere.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L2.1-modelos-vol-garch-gjr.md` | Comparação GARCH/GJR/EGARCH, half-life, persistência |
| `L2.2-cambio-stress-test-monte-carlo.md` | Stress test usando VaR/CVaR |
| `L6.0-risco-cauda-extremo.md` | Modelagem de cauda extrema (EVT, Generalized Pareto) |

L5 é **pré-requisito obrigatório** para NB-01 (PTAX GARCH) e para L6
(Monte Carlo — que usa parâmetros GARCH para gerar cenários).

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "σ constante":** se o modelo assume σ constante, o
  VaR está **subestimado** em stress. Sempre use GARCH ou EWMA.
- **Armadilha #2 — "VaR cobre tudo":** VaR é percentil da cauda;
  ignora o **tamanho** do desastre. Use CVaR para o pior caso
  realista.
- **Insight para gravar:** **a largura da faixa muda**. Trate
  volatilidade como **processo**, não constante. E meça **half-life**
  para calibrar tempo de revisão do hedge.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** **média é direção, σ é o vento**.
  GARCH mede o vento. VaR é a porta da cauda. CVaR é o que vem
  depois. E **half-life de 73 dias** significa: depois do trigger,
  espere ~2,5 meses antes de relaxar.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L6 (Monte Carlo) |
| Aprofundar modelo | `_study_notes/L2.1-modelos-vol-garch-gjr.md` |
| Aplicação canônica | NB-01 (PTAX GARCH) · NB-06 (MC multivariado) |

## 8 · Números reais do projeto (referência cruzada)

Os cinco conceitos de L5 alimentam o **dimensionamento de risco** do
D3 inteiro. Esta tabela é o **mapa VaR/CVaR** das 4 principais exposições.

| Exposição | σ condicional | VaR 1d 99% | CVaR 1d 99% | Half-life |
|-----------|---------------|------------|-------------|-----------|
| PTAX (câmbio) | 14,86% (stress) | R$ 480 mi | R$ 663 mi | 73 dias |
| Lítio (commodity) | 95% (anual) | R$ 2,27 mi | R$ 3,1 mi | 41 dias |
| Selic (macro) | 1,8% (Δ 12m) | R$ 145 mi | R$ 198 mi | 28 dias |
| ANFAVEA share | 8,5% (vol) | R$ 280 mi | R$ 391 mi | 55 dias |

> **Insight de portfólio:** as **4 exposições têm baixa correlação
> cruzada** (ρ médio = 0,18), o que **diversifica** naturalmente o
> VaR conjunto. **VaR conjunto (linear) ≈ R$ 1,9 bi/dia** vs. soma
> simples = R$ 1,9 bi/dia (efeito diversificação ≈ 0 aqui porque
> σ PTAX domina). **CVaR conjunto = R$ 2,6 bi/dia** — esse é o
> **dimensionamento do colchão de liquidez** que o D3 recomenda.

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
