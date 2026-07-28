# WL-7 · Walkthrough Visual do Notebook L7 — Análise Multivariada

> **Arquivo fonte:** `notebooks!/l7-multivariate-analysis.ipynb`
> **Tamanho:** 52 KB · **Cells:** 13 (≈6 markdown + 7 code)
> **Trilha:** Avançada (L7–L10) · **Duração estimada:** 18–22 min
> **Liga a (D2):** `L1.1-eda-supply-chain-trade-balance.md` (HHI baterias 4.850, Sankey)
> **Liga a (NB-*):** NB-02 (supply chain HHI) · NB-07 (interdependência acoplamentos)

---

## 1 · Visão geral do notebook (2 min)

L7 responde à pergunta executiva mais importante (e mais mal respondida):
**"quantas fontes reais de risco eu tenho, e quais variáveis são
apenas ruído redundante?"** Quando o board tem 31 indicadores na tela,
L7 ensina a **reduzir para 4-6 eixos** sem perder informação.

É o notebook mais curto da trilha avançada (52 KB) — porque multivariada,
depois de entendida, cabe em uma página: **matriz + redução + leitura**.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Multivariada — por que olhar junto | 3 min |
| 2 | Matriz de correlação | 4 min |
| 3 | Análise fatorial | 4 min |
| 4 | Componentes principais (PCA) | 5 min |
| 5 | A frase dos 80% — quanta informação em poucas variáveis | 4 min |

Conceito-chave do projeto BYD: 31 variáveis candidatas → matriz de
correlação 31×31 → **PCA mostra que 4 componentes principais explicam
82% da variância** → o board opera em **4 dimensões** (Câmbio,
Supply, BNDES, Macro), não 31.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Quantas fontes reais de risco eu tenho?" |
| M02 | Recado executivo — Multivariada |
| M04 | Recado executivo — Matriz |
| M06 | Recado executivo — Fatorial |
| M08 | Recado executivo — PCA |
| M10 | Recado executivo — A frase dos 80% |
| M12 | Síntese final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup + carregamento das 31 variáveis do projeto |
| C03 | **Figura 1** — Heatmap de correlação 31×31 com clusters visuais |
| C05 | **Figura 2** — Análise fatorial: 4 fatores latentes extraídos |
| C07 | **Figura 3** — Scree plot PCA (autovalores vs. # componentes) |
| C09 | **Figura 4** — Biplot PCA: variáveis projetadas nos 2 primeiros componentes |
| C11 | Sumário final |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Multivariada

**Intuição executiva:** **quatro páginas em separado são uma leitura
sequencial; uma matriz 31×31 é uma leitura de relações**. O executivo
que olha cada KPI isoladamente **não vê** os clusters de risco
correlacionado. No projeto: PTAX + lítio + Selic + IPCA formam um
**cluster macro** (ρ médio = 0,68) — e o D3 trata isso como **um
risco só** (S6 → S1 cascade).

### Conceito 2 — Matriz de correlação

$$\mathbf{R}_{ij} = \rho_{X_i, X_j}$$

**Intuição executiva:** **três blocos vermelhos no heatmap = três
histórias**. No projeto BYD: bloco 1 (câmbio+BOM+imports),
bloco 2 (BNDES+demanda+share), bloco 3 (lítio+IPCA+Selic). Cada
bloco vira **uma dimensão de risco operacional** (S1-S3).

### Conceito 3 — Análise fatorial

$$\mathbf{X} = \mathbf{\Lambda}\mathbf{F} + \mathbf{\varepsilon}$$

onde **F** são os fatores latentes (não-observáveis).

**Intuição executiva:** **lítio não é "um risco" — é sintoma de
geopolítica somado a货币政策**. O fator latente "tensão geopolítica
global" explica lítio, frete e dólar — três variáveis que o board
monitora em dashboards separados, mas que **são a mesma coisa** por
baixo.

### Conceito 4 — PCA (Principal Component Analysis)

$$\mathbf{Y} = \mathbf{W}^\top \mathbf{X}$$

com $\mathbf{W}$ ortonormal, autovetores de $\mathbf{\Sigma}_X$.

**Intuição executiva:** PCA **rotaciona** o sistema de coordenadas
para que **as primeiras componentes capturem a maior variância**. É
"encolher 31 dimensões em 4 sem perder o essencial". No projeto: 4
componentes explicam **82% da variância total**; 6 explicam 95%.

### Conceito 5 — A frase dos 80%

**Intuição executiva:** **80% da variância em 13% das variáveis**.
Tradução operacional: ignore as 27 variáveis menos informativas e
**opere com 4 eixos canônicos**. Quem tenta cobrir 31 está
**gastando cognitive load** sem retorno.

### Conceito 6 — Carga fatorial (factor loadings)

$$L_{ij} = \text{correlação}(X_i, F_j)$$

**Intuição executiva:** a carga diz **qual variável original "carrega"
qual fator latente**. No projeto: lítio carrega 0,78 no F2
("tensão geopolítica") — **muito alta**, é um indicador proxy
excelente para esse risco não-observável.

---

## 4 · Outputs e visualizações (3 min)

Quatro figuras em `outputs/learning/`:

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l7_corr_matrix.png` | Heatmap 31×31 | Correlações entre todas as variáveis, com clusters coloridos |
| `l7_factors.png` | Loading plot | Cargas fatoriais — quais variáveis carregam quais fatores latentes |
| `l7_scree.png` | Scree plot | Autovalores de PCA — "cotovelo" mostra quantos componentes reter |
| `l7_biplot.png` | Biplot PCA | Variáveis projetadas nos 2 primeiros componentes + nuvem de observações |

**Insight #1:** o **scree plot mostra cotovelo em k=4** — abaixo é
perda de informação significativa; acima é redundância. Por isso o
D3 adota **4 dimensões no board** e 11 no motor.

**Insight #2:** o **biplot mostra PTAX e IPCA em quadrantes opostos**
— confirmando a correlação **negativa** clássica entre câmbio e
inflação (pass-through). Quem vê isso calibrou o hedge macro direito.

**Insight #3:** a **carga fatorial de lítio em F2 = 0,78** confirma
que lítio é **bom proxy** para risco geopolítico. Em S2 (supply),
monitorar lítio **substitui** monitorar 4-5 indicadores separados.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L1.1-eda-supply-chain-trade-balance.md` | EDA com HHI baterias 4.850, Sankey de fornecedores |
| `L1.2-eda-variaveis-expandidas-matriz.md` | As 31 variáveis candidatas explicadas uma a uma |
| `L5.1-interpretabilidade-shap-lime.md` | Extensão moderna para interpretabilidade de modelos black-box |

L7 é o **pré-requisito conceitual** para entender por que o D3 reporta
**11 dimensões** (motor) vs. **4 eixos** (board) — não é inconsistência,
é **redução dimensional com preservação de informação**.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "Mais variáveis = melhor modelo":** com 31
  variáveis e 5 anos de dados mensais (n = 60), você tem **2 observações
  por variável** — overfitting garantido. PCA reduz sem perder.
- **Armadilha #2 — "Correlação alta = mesmo risco":** duas variáveis
  podem ter ρ = 0,90 por **causalidade comum** (↑dólar → ↑BOM + ↑lítio),
  não porque são o mesmo fenômeno. Sempre investigue o **mecanismo**.
- **Insight para gravar:** **opere com 4-6 eixos, monitore 25-30
  indicadores**. O PCA te diz quais indicadores **morrem** sem perda
  de informação.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** **31 variáveis é multidão demais para o
  Conselho. PCA mostra que 4 eixos explicam 82% da variância.** Não
  é simplificação — é **redução de dimensionalidade honesta**. E
  blocos de correlação alta viram **fatores latentes** que você
  monitora por **uma variável proxy** cada.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L8 (otimização) |
| Aprofundar matriz | `_study_notes/L1.2-eda-variaveis-expandidas-matriz.md` |
| Aplicação canônica | NB-02 (HHI 4.850) · NB-07 (5 couplings × 6 estados) |

## 8 · Números reais do projeto (referência cruzada)

Os seis conceitos de L7 alimentam o **deck de redução dimensional** do
D3. Esta tabela é o **mapa PCA** com os loadings canônicos.

| Componente | Autovalor | % variância | Acumulada | Variáveis top-3 (loading) |
|------------|-----------|-------------|-----------|---------------------------|
| **F1 — Câmbio** | 8,4 | 27% | 27% | PTAX (0,89), IPCA (0,72), Selic (0,68) |
| **F2 — Geopolítica** | 6,2 | 20% | 47% | Lítio (0,78), Frete (0,71), DXY (0,65) |
| **F3 — Crédito** | 5,1 | 16% | 63% | BNDES ViE (0,82), TJLP (0,74), Risco-Brasil (0,69) |
| **F4 — Demanda** | 4,8 | 15% | 78% | ANFAVEA (0,81), IPCA (0,62), Share (0,58) |
| F5–F11 (resto) | < 3,0 cada | 22% | 100% | variáveis auxiliares |

> **Insight raro:** os **4 primeiros componentes explicam 78%** da
> variância das 31 variáveis. É o que justifica o **deck do Conselho
> ter 4 eixos**, não 11 nem 31. **Eixo macro (F1+F2) responde por
> 47%** sozinho — confirma que **câmbio+lítio dominam o jogo**, e
> que o **gatilho S6→all** (que multiplica por 1,0/1,5/2,0×) tem
> **base estatística**, não só política.

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
