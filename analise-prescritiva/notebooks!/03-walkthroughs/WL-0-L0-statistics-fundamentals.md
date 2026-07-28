# WL-0 · Walkthrough Visual do Notebook L0 — Fundamentos de Estatística

> **Arquivo fonte:** `notebooks!/l0-statistics-fundamentals.ipynb`
> **Tamanho:** 853 KB · **Cells:** 35 (≈18 markdown + 17 code)
> **Trilha:** Fundacional (L0–L2) · **Duração estimada:** 18–22 min
> **Liga a (D2):** `L0.2-estatistica-descritiva.md` · `L0.0-glossario-metricas.md`
> **Liga a (NB-*):** nenhum direto (é pré-requisito conceitual)

---

## 1 · Visão geral do notebook (2 min)

Este é o **primeiro degrau** da trilha executiva. Sem matemática pesada, sem
código intimidante. O L0 responde a uma pergunta simples: **quando alguém
largar um número na mesa, o que perguntar antes de acreditar?**

A estrutura é rigorosamente **Narrativo-Primeiro** (Conceito → Intuição →
Matemática → Código → Recado Executivo). São **cinco blocos temáticos**
encerrados por uma página de "leitura executiva" das três PNGs geradas.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Média, mediana e moda | 4 min |
| 2 | Desvio-padrão / volatilidade | 4 min |
| 3 | Percentis e risco de cauda | 4 min |
| 4 | Correlação | 4 min |
| 5 | Visualização honesta | 3 min |

Conceito-chave do projeto BYD: a PTAX tem **média ~R$ 5,45** nos últimos
anos, mas o **P95 já tocou R$ 6,12**. A diferença entre esses dois números é
justamente o que o L0 ensina a ler.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa + cabeçalho analítico-prescritivo |
| M04 | **Bloco 1** — Média, Mediana, Moda: "o valor típico" |
| M06 | Recado executivo do Bloco 1 |
| M08 | **Bloco 2** — Desvio-padrão: a volatilidade que a média esconde |
| M10 | Recado executivo do Bloco 2 |
| M12 | **Bloco 3** — Percentis: "e se der errado?" |
| M14 | Recado executivo do Bloco 3 |
| M16 | **Bloco 4** — Correlação: o que se move junto |
| M18 | Recado executivo do Bloco 4 |
| M20 | **Bloco 5** — Visualização honesta |
| M22 | Recado executivo do Bloco 5 |
| M23 | Abertura da seção "Lendo BYD/PTAX com o olhar" |
| M24/M26/M28 | Três sub-seções de leitura dos PNGs |
| M30 | Leitura executiva consolidada das três imagens |
| M32 | Resumo executivo final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C02 | Setup: paleta dark (#0d1117), fontes, seed |
| C05 | Demonstra média vs mediana com prazos de entrega (2 semanas vs fornecedor travado) |
| C09 | Dois regimes de câmbio com mesma média, dispersões distintas |
| C13 | Reconstrução do Monte Carlo 10k cenários (cauda t-Student) |
| C17 | Três intuições de correlação + caso real câmbio × BOM |
| C21 | Eixo truncado: mesmo dado, duas leituras |
| C25 | **PNG 1** — histograma PTAX com média/mediana/moda |
| C27 | **PNG 2** — boxplot com quartis |
| C29 | **PNG 3** — scatter PTAX × impacto BOM + linha de correlação |
| C33 | Sumário numérico final (média, DP, P5/P95, ρ) |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Média, mediana e moda

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i \qquad \tilde{x} = \mathrm{mediana}$$

**Intuição executiva:** a média é uma conta, a mediana é uma posição. Se
um fornecedor demora 14 dias e outro 90, a média de 24 dias **não representa
ninguém**. A mediana de 14 é mais honesta. No caso BYD: a média PTAX 2024
foi R$ 5,12, mas a mediana foi R$ 5,08 — pequena diferença agora, enorme
em stress.

### Conceito 2 — Desvio-padrão (volatilidade)

$$\sigma = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2}$$

**Intuição executiva:** o mesmo PTAX pode caber em uma distribuição
estreita (calmo) ou larga (agitado) — **a média não distingue**. No BYD:
σ PTAX 6y = **11,2%** (recalibração empírica) vs. 14,86% em stress 2015-2016.

### Conceito 3 — Percentis (cauda)

$$P_k = \mathrm{quantil}_{k/100}(x)$$

**Intuição executiva:** planeje pelo **P5 (pior caso plausível)**, não
pela média. O P95 da PTAX 2024 foi R$ 5,78; a média foi R$ 5,12 — uma
diferença de 13% no *plano de hedge*. O VaR R$ 8,21 bi do projeto nasce
exatamente daqui.

### Conceito 4 — Correlação

$$\rho_{XY} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X \sigma_Y}$$

**Intuição executiva:** correlação forte = **alerta antecipado**. No
projeto BYD, PTAX × custo BOM importada tem ρ ≈ 0,72 — quem monitora
PTAX monitora BOM com 3-4 semanas de antecedência.

### Conceito 5 — Visualização honesta

Eixo Y **iniciado em zero** vs. **truncado**. O mesmo dataset pode
parecer calmo ou caótico dependendo de onde o eixo começa.

---

## 4 · Outputs e visualizações (3 min)

Três PNGs são gerados em `outputs/learning/`:

| PNG | Tipo | O que mostra |
|----:|------|--------------|
| `l0_ptax_distribution.png` | Histograma | Distribuição PTAX com média, mediana e moda marcadas |
| `l0_ptax_boxplot.png` | Box-plot | Quartis Q1/Q3, mediana, bigodes, outliers |
| `l0_ptax_bom_scatter.png` | Scatter | PTAX × impacto BOM + linha de regressão |

**Insight #1:** a distribuição tem **cauda direita longa** (realizations
positivas mais frequentes e mais extremas que negativas) — exatamente o
que a teoria de GARCH confirma depois em L5.

**Insight #2:** o boxplot mostra **outliers assimétricos** — o risco de
câmbio **não é simétrico**; portanto hedging "médio" não cobre.

**Insight #3:** o scatter revela inclinação positiva e **espalhamento
heterocedástico** (mais dispersão nos extremos) — a base do que vira
GARCH(1,1) em L5 e σ PTAX 14,86% em stress.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L0.0-glossario-metricas.md` | Glossário canônico das 14 métricas usadas no projeto |
| `L0.2-estatistica-descritiva.md` | Walkthrough completo das fórmulas de tendência central e dispersão |
| `L0.3-probabilidade-distribuicoes.md` | Distribuições paramétricas (Normal, t-Student, qui-quadrado) |

O L0 é o **portão de entrada**: quem termina aqui consegue ler com
fluência qualquer doc L0.*, L1.* e L2.* da base D2. Não avança para L1
sem mastigar este.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "A média é X":** nunca aceite sem perguntar o
  desvio-padrão e o tamanho da amostra. Duas distribuições com mesma
  média podem ter σ = 0,02 ou σ = 0,30.
- **Armadilha #2 — Correlação = causalidade:** ρ = 0,72 entre PTAX e
  BOM **não significa** que PTAX causa BOM. Ambos respondem ao mesmo
  fator subjacente (dólar forte global, risco-Brasil).
- **Insight para gravar:** **média + DP + P95** é o tripé mínimo de
  qualquer número que entra em decisão executiva. Se o consultor só
  traz média, peça o resto.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** um número sozinho não decide nada. Média,
> dispersão e cauda andam juntos — quem ignora um dos três está
> vendendo certeza onde só tem esperança.

| Próximo passo | Onde ir |
|---|---|
| Trilha Júnior | L1 → L2 → L3 → L4 |
| Trilha Pleno | direto a L4 (séries temporais) e depois L5/L6/L7 |
| Aprofundar fórmula | `_study_notes/L0.2-estatistica-descritiva.md` |
| Aplicação canônica | NB-01 (PTAX GARCH) usa σ, percentis e correlação |

## 8 · Números reais do projeto (referência cruzada)

Os cinco conceitos do L0 aparecem **literalmente** em vários pontos do
D3. Esta tabela serve como **índice reverso** — qual número canônico
do projeto vem de qual conceito do L0.

| Conceito L0 | Métrica | Valor no projeto | Onde aparece |
|-------------|---------|------------------|--------------|
| Média | PTAX média 10y | R$ 5,12 | NB-01 baseline |
| Desvio-padrão | σ PTAX 6y | 11,2% (calmo) / 14,86% (stress) | D3-RECALIBRATION-EMPIRICAL |
| Mediana | PTAX mediana | R$ 5,08 | NB-01 histograma |
| Percentil 5 | PTAX P5 | R$ 4,20 | VaR R$ 8,21 bi (MC) |
| Percentil 95 | PTAX P95 | R$ 6,12 | NB-12 sensitivity |
| Correlação | ρ(PTAX, BOM) | 0,72 | L0 Figura 3 |
| Moda | Distribuição PTAX | R$ 5,05–5,15 | Cluster ANFAVEA |

> **Dica para o leitor:** antes de avançar para L1, revisite esta
> tabela e **feche os olhos**: visualize cada número sem precisar
> voltar. Se não conseguir, releia a seção 3. **Sem esses 7 números
> internalizados, L1-L10 ficam abstratos.**

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
