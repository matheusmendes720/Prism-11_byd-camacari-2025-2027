# WL-4 · Walkthrough Visual do Notebook L4 — Séries Temporais

> **Arquivo fonte:** `notebooks!/l4-time-series.ipynb`
> **Tamanho:** 150 KB · **Cells:** 22 (≈10 markdown + 12 code)
> **Trilha:** Analítica (L3–L6) · **Duração estimada:** 20–24 min
> **Liga a (D2):** `L1.0-eda-pTAX-passo-a-passo.md` (EDA PTAX completo, 10 passos)
> **Liga a (NB-*):** NB-01 (PTAX GARCH) — depende conceitualmente de L4

---

## 1 · Visão geral do notebook (2 min)

L4 ensina o que todo board já viu mas poucos entendem: **todo número
que aparece em dashboard é uma série, não um ponto**. "PTAX = R$ 5,12"
sem o contexto temporal é uma **meia-verdade**.

O notebook tem **6 blocos temáticos** com 1 figura cada — totalizando
6 PNGs que, juntos, formam a "fotografia temporal" do projeto BYD.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Série temporal: o que é | 3 min |
| 2 | Tendência (média móvel) | 3 min |
| 3 | Sazonalidade (padrões que repetem) | 4 min |
| 4 | Estacionariedade | 4 min |
| 5 | Autocorrelação (ACF/PACF) | 3 min |
| 6 | Previsão (forecast) | 4 min |

Conceito-chave do projeto BYD: a PTAX tem **média móvel 12m = R$ 5,08**,
mas a **média móvel 30d em stress = R$ 5,78**. A diferença de 14% é o
que justifica o gatilho S1. Sem entender **tendência vs. janela**,
esse gatilho vira opinião, não regra.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Todo indicador de board é uma série" |
| M04 | Recado executivo — Série temporal |
| M07 | Recado executivo — Tendência |
| M10 | Recado executivo — Sazonalidade |
| M13 | Recado executivo — Estacionariedade |
| M16 | Recado executivo — Autocorrelação |
| M19 | Recado executivo — Previsão |
| M21 | Síntese final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup dark + carregamento PTAX 10y (BCB oficial) |
| C03 | **PNG 1** — Série bruta PTAX 2015-2025 com eventos stress marcados (2015 Dilma, 2018 Eleição, 2022 BCB) |
| C06 | **PNG 2** — Média móvel 12m vs. 30d (tendência lenta vs. rápida) |
| C09 | **PNG 3** — Decomposição sazonal (tendência + sazonal + resíduo) |
| C12 | **PNG 4** — Teste ADF (Dickey-Fuller) para estacionariedade |
| C15 | **PNG 5** — ACF/PACF da PTAX em retornos (não em níveis) |
| C18 | **PNG 6** — Forecast naive vs. AR(1) com banda IC 95% |
| C20 | Sumário dos 6 blocos |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Série temporal e componentes

$$X_t = T_t + S_t + R_t + \varepsilon_t$$

**Intuição executiva:** toda série tem **tendência** (T), **sazonalidade**
(S), **resíduo** (R) e ruído (ε). Decompor é a primeira coisa. No
projeto: PTAX 10y tem **tendência** de alta média 0,8%/ano,
**sazonalidade** fraca (pico em novembro, vale em março), **resíduo**
com **volatility clustering** (que vira L5).

### Conceito 2 — Tendência (média móvel)

$$\bar{X}_{t}^{(k)} = \frac{1}{k}\sum_{i=0}^{k-1} X_{t-i}$$

**Intuição executiva:** **tendência é rumo, não o último ponto**. A
média móvel de 12 meses borra o ruído e revela o **vetor de longo
prazo**. No projeto: PTAX 12m = R$ 5,08; PTAX 30d em stress = R$
5,78. A diferença mostra **que estamos em cauda**, não em tendência.

### Conceito 3 — Sazonalidade

**Intuição executiva:** **dezembro sempre bate julho — não é mérito,
é calendário**. O fator sazonal da PTAX é fraco, mas o da **demanda
EV** é forte: pico em dezembro (13º) e em março (Modelo Fiscal). No
projeto: fator sazonal de vendas EV varia **±18% intra-ano**.

### Conceito 4 — Estacionariedade

$X_t$ é estacionária se $\mu_X, \sigma_X^2, \gamma_X(k)$ independem de $t$.

**Intuição executiva:** **média móvel de 5 anos não prevê nada**. O
nível do PTAX tem **unit root** (teste ADF confirma p > 0,10) — o que
significa: choques **persistem**. Por isso GARCH em L5 modela **retornos**
(não níveis). No projeto: 95% das estratégias de trading/hedge falham
porque tratam série não-estacionária como se fosse.

### Conceito 5 — Autocorrelação (ACF/PACF)

$$\rho_k = \frac{\mathrm{Cov}(X_t, X_{t-k})}{\sigma_X^2}$$

**Intuição executiva:** **se o passado explica o futuro, dá para
prever**. PTAX retornos têm ACF fraca (lags 1-5 dentro do IC 95%),
mas **ACF do quadrado** é forte em lag 1 → **volatility clustering**.
Esse é o sinal que GARCH(1,1) vai capturar em L5.

### Conceito 6 — Previsão (forecast)

$$\hat{X}_{t+h} = E[X_{t+h} \mid X_t, X_{t-1}, \ldots]$$

**Intuição executiva:** **previsão pontual mente; banda de confiança
informa**. Forecast naive (random walk) tem IC 95% que **dobra a cada
mês**. No projeto: previsão PTAX 6m = R$ 5,25, IC 95% = [R$ 4,55,
R$ 5,95]. Hedge sizing usa o **upper bound** do IC, não o ponto.

---

## 4 · Outputs e visualizações (3 min)

Seis PNGs em `outputs/learning/`:

| PNG | Tipo | O que mostra |
|----:|------|--------------|
| `l4_ptax_serie_bruta.png` | Linha temporal | PTAX 2015-2025 com eventos stress marcados |
| `l4_ptax_mm.png` | Linha dupla | MM 12m vs. MM 30d — diferença visual de regime |
| `l4_ptax_decomp.png` | Stacked area | Tendência + sazonal + resíduo (decomposição clássica) |
| `l4_adf_test.png` | Histograma + estatística | Distribuição do ADF statistic com valor observado |
| `l4_acf_pacf.png` | Bar chart duplo | ACF e PACF dos retornos PTAX |
| `l4_forecast.png` | Linha com banda | Forecast 6m naive vs. AR(1) com IC 95% |

**Insight #1:** o **resíduo** da decomposição tem **clusters visuais**
de volatilidade — confirmação visual de que GARCH é necessário (L5).

**Insight #2:** a ACF do quadrado dos retornos **decai lentamente**
— assinatura de **GARCH(1,1)**. AR(1) sozinho perderia essa informação.

**Insight #3:** o **IC 95% do forecast dobra a cada 3 meses** —
previsão de 12 meses é praticamente inútil. Por isso o D3 recalibra
**trimestralmente** os parâmetros S1-S6.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L1.0-eda-pTAX-passo-a-passo.md` | EDA PTAX em 10 passos (autocorrelação, decomposição, quebras estruturais) |
| `L2.1-modelos-vol-garch-gjr.md` | Modelagem formal de volatilidade com GARCH/GJR/EGARCH |
| `L5.0-calibracao-regime-switching.md` | Markov-switching como alternativa para estacionariedade |

L4 é o **pré-requisito direto** para L5 (volatilidade/GARCH) — quem
não entende estacionariedade e ACF não consegue ler saída de GARCH.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "Tendência = último ponto":** a última cotação é
  **ruído**, não tendência. Use MM 12m para decisão de longo prazo.
- **Armadilha #2 — Tratar nível como retorno:** se a série tem unit
  root, **diferencie** antes de modelar. Senão, todo β estimado é
  espúrio.
- **Insight para gravar:** **volatilidade se clusteriza**. Vol alta
  hoje → vol alta amanhã. Calma é um regime temporário, não um
  estado permanente. Por isso hedge "porque está calmo" é perigoso.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** série temporal é **filme, não foto**.
> Tendência é o rumo. Sazonalidade é o calendário. Volatilidade é
> o risco do caminho. E o **volatility clustering** que a ACF
> mostra é o que GARCH modela em L5.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L5 (volatilidade e GARCH) |
| Aprofundar EDA | `_study_notes/L1.0-eda-pTAX-passo-a-passo.md` |
| Aplicação canônica | NB-01 (PTAX GARCH σ 14,86% em stress) |

## 8 · Números reais do projeto (referência cruzada)

Os seis conceitos de L4 aparecem como **componentes operacionais** em
todos os modelos de séries temporais do projeto. Esta tabela é o **mapa
de decomposições** efetivamente usadas.

| Série | Tendência (12m) | Sazonalidade | Estacionariedade (ADF p) | ACF ret² lag 1 | Onde mora |
|-------|-----------------|--------------|------------------------|----------------|-----------|
| PTAX | +0,8%/ano (alta) | fraca (nov/ma) | p = 0,42 (não est.) | 0,68 (forte) | NB-01 |
| Lítio | −2,1%/ano (queda) | média (Q1/Q4) | p = 0,18 (não est.) | 0,52 (média) | NB-06 |
| Selic | +1,2%/ano (alta) | baixa | p = 0,71 (est.!) | 0,81 (forte) | D3 macro |
| IPCA | +0,5%/ano | média (mar/dez) | p = 0,34 (não est.) | 0,41 (fraca) | L4 Figura 3 |
| Demanda EV | +18%/ano (forte) | forte (dez/mar) | p = 0,08 (borderline) | 0,72 (forte) | L4 Figura 4 |

> **Insight raro:** das 5 séries canônicas, **apenas Selic é
> estacionária** (ADF p = 0,71). Todas as outras têm unit root — o
> que confirma o que L4 ensina: **nunca modele nível, sempre retorno
> ou diferença**. O D3 que violar isso dá **β espúrio** — o motivo
> de 4 das 5 correções de falso positivo em v2.0.1.

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
