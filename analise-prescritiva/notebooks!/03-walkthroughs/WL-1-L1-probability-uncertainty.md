# WL-1 · Walkthrough Visual do Notebook L1 — Probabilidade e Incerteza

> **Arquivo fonte:** `notebooks!/l1-probability-uncertainty.ipynb`
> **Tamanho:** 381 KB · **Cells:** 17 (≈8 markdown + 9 code)
> **Trilha:** Fundacional (L0–L2) · **Duração estimada:** 22–26 min
> **Liga a (D2):** `L0.3-probabilidade-distribuicoes.md` · `L1.1-eda-supply-chain-trade-balance.md`
> **Liga a (NB-*):** NB-01 (gatilho PTAX Bayesiano), NB-04 (payoffs condicionais)

---

## 1 · Visão geral do notebook (2 min)

Se o L0 ensinou a **ler números**, o L1 ensina a **ler incerteza**. A
pergunta-guia é direta: **"70% de chance" significa o quê, na prática?**

A estrutura repete o formato Narrativo-Primeiro em **cinco blocos**:

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Probabilidade básica | 4 min |
| 2 | Valor esperado | 5 min |
| 3 | Probabilidade condicional | 5 min |
| 4 | Teorema de Bayes | 6 min |
| 5 | Risco vs. Incerteza | 4 min |

Conceito-chave do projeto BYD: existe uma **diferença brutal** entre
"risco" (distribuição conhecida) e "incerteza" (distribuição nem
estimável). A falha regulatória inesperada de 2024 — que ninguém
modelou como "probabilidade X%" — é **incerteza knightiana**, não risco.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Probabilidade não é previsão, é régua" |
| M02 | Bloco 1 — Probabilidade básica (70% = ?) |
| M05 | Recado executivo Bloco 1 |
| M08 | Bloco 2 — Valor esperado (média ponderada pela chance) |
| M10 | Recado executivo Bloco 2 |
| M11 | Bloco 3 — Probabilidade condicional (P(Rollback \| Selic > X)) |
| M13 | Recado executivo Bloco 3 |
| M14 | Bloco 4 — Bayes: atualizar crença com evidência |
| M16 | Recado executivo Bloco 4 |
| M17 | Bloco 5 — Risco vs. Incerteza (mapa de calor) |
| M19 | Recado executivo Bloco 5 |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup visual + paleta dark |
| C03 | Visualiza 3 cenários PTAX como distribuição discreta |
| C04 | Curva normal PTAX em horizonte 6 meses (1ª figura) |
| C06 | Cálculo explícito do valor esperado por cenário |
| C07 | Decomposição visual do valor esperado (2ª figura) |
| C09 | Atualização Bayesiana: chance de PTAX alto com evidência BCB |
| C11 | Aplicação numérica ao gatilho de hedge |
| C13 | Mapa de calor Risco × Incerteza para o caso BYD |
| C15 | Sumário final dos 5 blocos |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Probabilidade frequentista vs. bayesiana

$$P(A) = \lim_{n\to\infty}\frac{n_A}{n}$$

**Intuição executiva:** "70% de chance" só faz sentido se você disser
**"70% em qual conjunto de repetições?"** No projeto, três cenários
PTAX 6m (Rollback 15%, Estável 75%, Expansão 10%) **não são apostas
esportivas** — são referência para calibrar hedge.

### Conceito 2 — Valor esperado

$$E[X] = \sum_i x_i \cdot P(x_i)$$

**Intuição executiva:** é a **única forma honesta** de comparar duas
apostas com outcomes diferentes. No projeto BYD: o valor esperado do
hedge 30% em Expansão é **R$ +2,4 bi** vs. **R$ −0,8 bi** em
Rollback Total — a média não diz isso, o desvio-padrão não diz isso,
só o E[X] ponderado diz.

### Conceito 3 — Probabilidade condicional

$$P(A|B) = \frac{P(A \cap B)}{P(B)}$$

**Intuição executiva:** toda estimativa de risco precisa de uma
**condição**. "20% de chance de quebrar" — *condicional a quê?* No
projeto: **P(Rollback | Selic > 13,75%) = 60%** vs. **P(Rollback |
Selic < 10%) = 8%**. A diferença é o que justifica o gatilho
auto-trigger S6→S1.

### Conceito 4 — Teorema de Bayes

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

**Intuição executiva:** "o alarme disparou" **não é** "o evento vai
ocorrer". Sempre atualizar a chance pela **probabilidade do próprio
alarme**. No projeto: BCB elevou Selic 50bp → P(Expansão) revisado de
10% para 23% via Bayes — recalibração S1-S3.

### Conceito 5 — Risco vs. Incerteza

Knight (1921): **risco** = distribuição estimável · **incerteza** =
distribuição **nem estimável** (parâmetros未知).

**Intuição executiva:** confundir os dois é a fonte #1 de desastres
estratégicos. O risco PTAX é estimável (GARCH); o risco de ruptura
diplomática China-Brasil em 2026 **não é** — e isso muda o tipo de
mitigação (hedge vs. opção real).

---

## 4 · Outputs e visualizações (3 min)

Três figuras são geradas em `outputs/learning/`:

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l1_ptax_normal_curve.png` | Curva de densidade | Distribuição normal da PTAX 6m com cenários discretos sobrepostos |
| `l1_valor_esperado_bar.png` | Barras empilhadas | Decomposição do E[X] por cenário de PTAX |
| `l1_risco_incerteza_heatmap.png` | Heatmap 2D | Mapa Risco × Incerteza com sessões do projeto |

**Insight #1:** a curva normal **não cobre** a cauda esquerda (PTAX
< R$ 4,20) — o VaR de **R$ 8,21 bi** emerge justamente da cauda que
essa curva subestima.

**Insight #2:** o valor esperado ponderado é **R$ +0,42 bi** no
baseline, mas a **mediana** é −R$ 0,15 bi — sinal claro de
**assimetria à direita**. Tome decisões pela mediana em cauda longa.

**Insight #3:** o heatmap mostra que **S6 (Macro)** é o único quadrante
"incerteza pura" — todas as outras sessões têm risco modelável. É por
isso que o auto-trigger S6→all tem **regra especial de revisão
trimestral**.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L0.3-probabilidade-distribuicoes.md` | Teoria de distribuições: Normal, t, qui-quadrado, F |
| `L1.1-eda-supply-chain-trade-balance.md` | EDA que sustenta P(Crise \| contexto) usado em Bayes |
| `L2.2-cambio-stress-test-monte-carlo.md` | Aplicação direta de Bayes + condicional ao shock PTAX |

Quem absorve L1 consegue ler com fluência a tabela de Bayes em qualquer
D2 doc e a **matriz de payoffs condicionais** que aparece em L9.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "Probabilidade de sucesso":** sempre pergunte
  *condicional a quê?* Sem condição, é frase de palestra motivacional.
- **Armadilha #2 — Bayes sem base:** atualizar crença exige uma
  *evidência* (likelihood) confiável. Sem P(B|A) medido, Bayes vira
  chute sofisticado.
- **Insight para gravar:** **risco tem preço, incerteza tem opção**.
  Hedge cobre risco; opção real (expandir/postergar) cobre incerteza.
  Não confunda os dois no orçamento.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** probabilidade é **régua**, não bola de
> cristal. Valor esperado é a **média honesta**. Condicional é
> **pergunta obrigatória**. Bayes é o único método para atualizar
> crença sem mentir. E risco ≠ incerteza — trata cada um com a
> ferramenta certa.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L2 (teste de hipóteses) |
| Aprofundar fórmula | `_study_notes/L0.3-probabilidade-distribuicoes.md` |
| Aplicação canônica | NB-04 (5 jogadores, payoff condicional) · NB-08 (backtesting) |

## 8 · Números reais do projeto (referência cruzada)

Os cinco conceitos de L1 alimentam **diretamente** as prescrições D3.
Cada um aparece em uma sessão ou coupling específico — esta tabela é
o mapa de onde cada probabilidade canônica mora.

| Conceito L1 | Probabilidade canônica | Onde mora no D3 |
|-------------|------------------------|-----------------|
| Probabilidade básica | P(Expansão) = 10%, P(Estável) = 75%, P(Rollback) = 15% | NB-01 (cenários PTAX) |
| Valor esperado | E[NPV(h=30%) \| Expansão] = +R$ 2,4 bi | NB-04 (payoff esperado) |
| Condicional | P(Rollback \| Selic > 13,75%) = 60% | D3-AUTO-TRIGGER S6→S1 |
| Bayes | P(Expansão \| BCB+50bp) revisado 10% → 23% | D3-RECALIBRATION-S1-S3 |
| Risco vs. Incerteza | S6 (Macro) = quadrante "incerteza pura" | D3-AUTO-TRIGGER revisão trimestral |

> **Insight raro:** os **15% de chance de Rollback Total** não são
> opinião — são **consenso entre 3 vetos** (Bayes atualizado, Fama-
> French fator risco-Brasil, e survey FGV de expectativas). Quando
> 3 métodos independentes convergem para o mesmo número, **a
> confiança na probabilidade sobe de 60% para 85%** (probabilidade
> de consenso, não Bayesiana).

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
