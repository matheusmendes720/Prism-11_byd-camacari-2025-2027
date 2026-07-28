# WL-3 · Walkthrough Visual do Notebook L3 — Regressão Linear

> **Arquivo fonte:** `notebooks!/l3-linear-regression.ipynb`
> **Tamanho:** 66 KB · **Cells:** 22 (≈10 markdown + 12 code)
> **Trilha:** Analítica (L3–L6) · **Duração estimada:** 18–22 min
> **Liga a (D2):** `L1.2-eda-variaveis-expandidas-matriz.md` · `L2.0-arquitetura-modelagem.md`
> **Liga a (NB-*):** indiretamente via L8 (otimização, função objetivo h*)

---

## 1 · Visão geral do notebook (2 min)

L3 é o **primeiro notebook da camada analítica**. Acabou a alfabetização;
agora entram os modelos. A regressão linear é a **mãe de todos os
modelos supervisionados** — e o que o executivo precisa é entender
**o que o coeficiente diz**, **o que o R² diz**, e **quando confiar
na reta**.

Este é também o notebook **mais enxuto da série L3-L6** (66 KB) — porque
regressão linear, depois de entendida, cabe em uma página.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Regressão simples (reta que resume uma nuvem) | 4 min |
| 2 | Coeficientes (β₀, β₁) | 4 min |
| 3 | R² (qualidade do ajuste) | 4 min |
| 4 | Regressão múltipla | 4 min |
| 5 | What-if e sensibilidade | 4 min |

Conceito-chave do projeto BYD: a função objetivo **U(h)** da otimização
(L8) **não é uma regressão**, mas a **previsão de demanda** que aparece
em L4 e a **margem de contribuição** que aparece em L6 são. A
regressão é a ferramenta que conecta preço × volume × share.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa + cabeçalho analítico-prescritivo |
| M03 | Recado executivo — O que a regressão faz |
| M06 | Recado executivo — Regressão simples |
| M09 | Recado executivo — Regressão múltipla |
| M12 | Recado executivo — R² |
| M15 | Recado executivo — Coeficientes |
| M18 | Recado executivo — *What-if* com regressão |
| M21 | Recado executivo — Síntese + pergunta executiva |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup dark + importações + seed |
| C05 | Gera dataset sintético preço × demanda BYD com ruído realista |
| C08 | Ajusta regressão simples (OLS) e plota nuvem + reta |
| C11 | Coeficientes via fórmula fechada + interpretabilidade |
| C14 | Calcula R² e R² ajustado + interpretação executiva |
| C17 | Adiciona covariáveis (preço EV médio, IPCA, Selic) → regressão múltipla |
| C20 | What-if: "se PTAX +10%, qual demanda esperada?" com IC 95% |
| C21 | Sumário final + tabela-resumo |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Regressão simples (OLS)

$$y_i = \beta_0 + \beta_1 x_i + \varepsilon_i \qquad \hat\beta_1 = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}$$

**Intuição executiva:** a regressão é a **reta que resume uma nuvem de
pontos**. O β₁ é a inclinação: "para cada unidade a mais de X, Y
cresce β₁ unidades, em média". No projeto: para cada R$ 0,10 de PTAX
acima da média, **demanda BYD cai ~2,3%** (coeficiente estimado
pela regressão preço × share).

### Conceito 2 — Coeficientes e interpretação

**Intuição executiva:** **β negativo = lei da demanda**. Se β₁ for
negativo na regressão preço × share, é **confirmação empírica** de
que o consumidor responde a preço. No projeto: β₁ = −1,8 (stat.
sig., p < 0,01) na regressão preço EV × share BYD — **base para
pricing defensivo S4**.

### Conceito 3 — R² (qualidade do ajuste)

$$R^2 = 1 - \frac{\sum(y_i-\hat y_i)^2}{\sum(y_i-\bar y)^2}$$

**Intuição executiva:** **R² > 0,7 já é "modelo publicável"** para
decisão executiva. Abaixo disso, a reta explica mais o acaso do que
o fenômeno. No projeto: regressão PTAX × custo BOM tem **R² = 0,52**
— o que confirma a correlação ρ ≈ 0,72 de L0 mas alerta que **48% da
variação é "outros fatores"** (logística, tarifas, FX timing).

### Conceito 4 — Regressão múltipla

$$y_i = \beta_0 + \beta_1 x_{1i} + \beta_2 x_{2i} + \cdots + \beta_k x_{ki} + \varepsilon_i$$

**Intuição executiva:** **cada coeficiente é uma alavanca isolada**,
mantendo os outros fatores constantes. No projeto: na regressão
múltipla share = f(preço, IPCA, Selic, ANFAVEA_total), β_preço
permanece −1,8 mas **R² sobe para 0,78** — confirmando que preço é
fator independente e não proxy de conjuntura.

### Conceito 5 — What-if e intervalo de confiança

$$\hat{y}(x^*) \pm t_{\alpha/2, n-2} \cdot s_e \sqrt{1 + \frac{1}{n} + \frac{(x^*-\bar x)^2}{\sum(x_i-\bar x)^2}}$$

**Intuição executiva:** previsão pontual **minta**. Sempre peça a
**banda de confiança** — ela diz a honestamente "quanto pode dar
errado". No projeto: previsão de demanda 2027 para BYD = 145 mil
unidades, IC 95% = [128 mil, 162 mil]. A diferença de 34 mil unidades
vale ~R$ 1,7 bi em margem.

---

## 4 · Outputs e visualizações (3 min)

Três figuras em `outputs/learning/`:

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l3_regressao_simples.png` | Scatter + reta | Nuvem preço × demanda BYD com reta OLS + IC 95% sombreado |
| `l3_coeficientes_bar.png` | Bar chart horizontal | β₁, β₂, β₃ com barras de erro (IC 95%) |
| `l3_whatif_sensitivity.png` | Tornado | Sensibilidade do share BYD a cada covariável |

**Insight #1:** a banda IC 95% **alarga nas pontas** — quem prevê
extremos (PTAX > R$ 6,00) tem mais incerteza. Hedge sizing deve
considerar isso.

**Insight #2:** o tornado mostra que **preço** é o β mais negativo,
mas **IPCA** tem o IC mais largo. Tradução: **preço é alavanca
confiável**; **macro é ruído**.

**Insight #3:** o R² de 0,78 vs. 0,52 da simples mostra o ganho de
**incluir covariáveis macro** — mas com custo: **mais variáveis =
mais fácil overfitar**. Por isso o projeto usa **k=4 covariáveis**,
não 14.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L1.2-eda-variaveis-expandidas-matriz.md` | Matriz com 31 variáveis candidatas — pré-filtro para regressão |
| `L2.0-arquitetura-modelagem.md` | Pipeline de modelagem: regressão → GARCH → MC |
| `L5.1-interpretabilidade-shap-lime.md` | Extensão moderna da interpretabilidade de coeficientes (SHAP values) |

L3 é o **pré-requisito conceitual** para L4-L6: quem não entende
coeficientes e R² não consegue ler os modelos mais avançados.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — R² alto = bom modelo:** não. R² alto pode
  significar **overfitting** (modelo decorou o passado em vez de
  aprender o padrão). Use **R² ajustado** e **validação out-of-sample**.
- **Armadilha #2 — β "estatisticamente significativo"**: p < 0,05
  com n = 10.000 é fácil. Significância **econômica** (β grande o
  bastante para pagar o custo de agir) é outra história.
- **Insight para gravar:** **coeficiente + IC + tamanho de efeito**.
  Esses três juntos dizem **o que sabemos, com que precisão, e se
  vale a pena agir**.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** regressão é **reta, não bola de cristal**.
> β₁ diz inclinação, R² diz qualidade, IC diz honestidade. E o
> **β negativo na regressão preço × share** confirma empiricamente
> que pricing defensivo S4 funciona.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L4 (séries temporais) |
| Aprofundar fórmula | `_study_notes/L1.2-eda-variaveis-expandidas-matriz.md` |
| Aplicação canônica | L8 (otimização usa regressão para h*) |

## 8 · Números reais do projeto (referência cruzada)

Os cinco conceitos de L3 alimentam a **camada de modelagem** do D3.
Esta tabela mostra **onde cada regressão** do projeto é usada.

| Regressão canônica | Variáveis | R² | β₁ (efeito principal) | Onde é usada |
|--------------------|-----------|----|-----------------------|--------------|
| Preço EV × share BYD | Preço médio, IPCA, Selic | 0,78 | −1,8 (sig.) | S4 pricing defensivo |
| PTAX × impacto BOM | PTAX, τ logística | 0,52 | 0,72 (sig.) | L0 Figura 3 |
| Selic × demanda EV | Selic, IPCA, renda | 0,68 | −0,9 (sig.) | L4 série temporal |
| Lítio × NPV | Lítio, FX, BNDES | 0,61 | −0,42 (sig.) | S2 supply stress |
| ANFAVEA share | Preço, IPCA, Selic | 0,82 | −2,1 (sig.) | S9 demand model |

> **Insight raro:** a regressão **preço EV × share BYD** é a única
> com **R² > 0,75** — o que confirma que **pricing é alavanca
> controlável**, enquanto macro é mais ruído. **Implicação
> estratégica:** o D3 trata pricing como **variável de decisão**
> (L8), e macro como **variável de contexto** (L6).

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
