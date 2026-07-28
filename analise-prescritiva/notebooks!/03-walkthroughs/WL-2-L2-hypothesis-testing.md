# WL-2 · Walkthrough Visual do Notebook L2 — Teste de Hipóteses

> **Arquivo fonte:** `notebooks!/l2-hypothesis-testing.ipynb`
> **Tamanho:** 269 KB · **Cells:** 5 (≈2 markdown + 3 code)
> **Trilha:** Fundacional (L0–L2) · **Duração estimada:** 16–20 min
> **Liga a (D2):** `L2.2-cambio-stress-test-monte-carlo.md` (stress test + VaR/CVaR)
> **Liga a (NB-*):** NB-08 (backtesting, falsos positivos)

---

## 1 · Visão geral do notebook (2 min)

L2 é o **notebook mais curto** da trilha L* — e propositalmente. Ele
existe para responder a uma única pergunta de board: **"esse resultado
que o analytics acabou de apresentar é real ou é barulho?"**

O formato aqui é **diferente** dos outros L*: é mais enxuto (5 cells),
com ênfase em **três figuras diagnósticas** que mostram visualmente o
que é um p-valor, um intervalo de confiança e um erro tipo I/II.

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Hipótese nula vs. alternativa | 4 min |
| 2 | P-valor e significância | 5 min |
| 3 | Erros tipo I e tipo II | 5 min |
| 4 | Visual intuition: três figuras diagnósticas | 4 min |

Conceito-chave do projeto: o **backtesting v2.0.1** do D3 reportou 5/5
acertos contra 5 eventos de stress, mas a **probabilidade de obter 5/5
por puro acaso** é p = 0,03125 (binomial, sob H₀). Significativo ao
nível 5%. É o tipo de cálculo que L2 ensina.

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Hypothesis Testing for Executives" |
| M02 | Seção "Visual Intuition: Three Diagnostic Pictures" |
| M04 | Seção "Interpreting Results" — quando confiar num resultado |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | **Setup pesado** — geração de 3 figuras diagnósticas (PNG embutidos em base64 no próprio notebook, 269 KB). Mostra: (a) histograma da estatística de teste sob H₀ com valor observado marcado, (b) curva de poder estatístico 1−β vs. tamanho de efeito, (c) matriz de confusão Tipo I × Tipo II |
| C03 | **Cálculo numérico** do p-valor do backtesting BYD: binomial(n=5, k=5) sob H₀ p=0,5 → p = 0,03125 |
| C05 | Sumário final + frase-executiva: "Estatisticamente significativo ≠ economicamente significativo" |

Diferente dos outros L*, este notebook **carrega as figuras embutidas**
no JSON (por isso 269 KB). Quem quiser os PNGs separados precisa
re-executar.

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Hipótese nula H₀ vs. alternativa H₁

$$H_0: \mu = \mu_0 \qquad H_1: \mu \neq \mu_0$$

**Intuição executiva:** H₀ é o **"nada mudou"**. Você só rejeita H₀
quando a evidência é forte o suficiente — e "forte o suficiente" tem
uma definição formal (α = 5%, bilateral). No projeto: H₀ = "o hedge
de 30% é tão bom quanto o de 91%". Rejeitar H₀ = "as estratégias
têm payoff materialmente diferente".

### Conceito 2 — P-valor e significância

$$p = P(\text{observar } T \geq T_{\text{obs}} \mid H_0)$$

**Intuição executiva:** p-valor **não é** "probabilidade de H₀ ser
verdadeiro". É a **probabilidade de observar este resultado (ou mais
extremo) assumindo H₀**. Confundir isso é o erro #1 em apresentações
de board. No projeto: o backtesting 5/5 com p = 0,03125 nos diz que
**se** o framework fosse puro chute, a chance de 5/5 seria 3,1%. Como
observamos 5/5, **rejeitamos H₀** ao nível 5%.

### Conceito 3 — Erros tipo I e tipo II

| | H₀ verdadeira | H₀ falsa |
|---|---|---|
| Rejeita H₀ | **Erro tipo I** (α) | Acerto |
| Não rejeita | Acerto | **Erro tipo II** (β) |

**Intuição executiva:** tipo I é "falso positivo" (gastar com hedge
desnecessário). Tipo II é "falso negativo" (não proteger quando deveria).
O **poder** do teste é 1−β. No projeto: erro tipo I calibrado em 5%
para os gatilhos S1–S6; tipo II aceito até 20% para trade-off com
custo de revisão.

### Conceito 4 — Tamanho de efeito vs. significância

Significância estatística (p < 0,05) **não implica** significância
econômica. Uma diferença de R$ 0,01 bi pode ter p = 0,001 com n = 1
milhão — e ser **irrelevante** para o caixa.

### Conceito 5 — Testes múltiplos

Quando você roda 100 testes com α = 5%, ~5 serão "significativos" por
acaso. **Correção de Bonferroni** ou **FDR** é obrigatória. No
projeto: a matriz 18-células (6×3) do trigger matrix usa FDR para
não inflar falsos positivos.

---

## 4 · Outputs e visualizações (3 min)

As três figuras ficam embutidas no notebook (269 KB inclui base64). Em
uma re-execução, vão para `outputs/learning/`:

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l2_test_statistic_distribution.png` | Histograma + estatística de teste | Distribuição da estatística T sob H₀, com valor observado destacado na cauda |
| `l2_power_curve.png` | Curva 1−β vs. d | Poder estatístico em função do tamanho de efeito — visualiza por que amostras pequenas não detectam nada |
| `l2_error_matrix.png` | Matriz 2×2 | Diagrama Tipo I × Tipo II com regiões α e β sombreadas |

**Insight #1:** o valor observado do backtesting cai na **cauda
direita** da distribuição nula (p < 0,05) — o que **ancora
matematicamente** a credibilidade do framework D3.

**Insight #2:** a curva de poder mostra que com n = 5 (número de
eventos stress no backtest), mesmo um efeito grande (d = 1,0) só tem
poder ~50%. Por isso o **próximo passo é expandir n** (incluir 2020
COVID como 6º evento).

**Insight #3:** a matriz de erro lembra que **β depende de n**. O
gatilho S3×S6 com taxa de disparo 8% em 12 meses tem poder estimado
em 35% — abaixo do ideal de 80%. Próxima iteração: aumentar
observações ou afrouxar α.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `L2.2-cambio-stress-test-monte-carlo.md` | Stress test formal com α = 5% e VaR/CVaR |
| `L6.1-stress-testing-institucional.md` | Quando o stress test vira institucional vs. acadêmico |
| `L3.1-trigger-matrix-auto-trigger.md` | FDR aplicado à matriz 18-células |

L2 é **pré-requisito conceitual** para entender por que o D3 reporta
"5/5 backtesting PERFEITO" e o que isso significa **e o que não
significa**.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "p = 0,049 ⇒ verdade":** um p-valor marginal não é
  "resultado confirmado"; é "evidência fraca". Repita a medição.
- **Armadilha #2 — "p = 0,51 ⇒ falso":** ausência de evidência **não
  é** evidência de ausência. Poder do teste pode ser baixo.
- **Insight para gravar:** **significância estatística ≠ significância
  prática**. Antes de decidir com base em p < 0,05, pergunte: "o
  tamanho do efeito **paga** o custo da ação?".

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** p < 0,05 é **evidência**, não **veredito**.
> Erro tipo I custa dinheiro (hedge desnecessário); tipo II custa mais
  (não proteger quando devia). E o backtesting 5/5 do D3 é
  significativo — mas com poder limitado.

| Próximo passo | Onde ir |
|---|---|
| Fim da trilha Fundacional | L3 (regressão linear) |
| Aprofundar teste | `_study_notes/L2.2-cambio-stress-test-monte-carlo.md` |
| Aplicação canônica | NB-08 (backtesting com correções FP) |

## 8 · Números reais do projeto (referência cruzada)

O D3 reporta **"5/5 backtesting PERFEITO"**. L2 dá o ferramental para
entender **o que isso significa** (e o que **não** significa).

| Evento stress | Ano | Resultado framework | p-valor (sob H₀ chute) |
|---------------|-----|---------------------|------------------------|
| Dilma impeachment | 2015 | ✅ Prescreveu hedge 91% | 0,03125 (5/5 binomial) |
| Eleição polarizada | 2018 | ✅ Prescreveu hedge 77% | 0,03125 (5/5 binomial) |
| COVID-19 | 2020 | ✅ Prescreveu defensivo S4 | 0,03125 (5/5 binomial) |
| BCB ciclo alta | 2022 | ✅ Prescreveu h* 50% | 0,03125 (5/5 binomial) |
| Regulação inesperada | 2024 | ✅ Trigger BNDES kill switch | 0,03125 (5/5 binomial) |

> **Limitação honesta (L2-style):** com n = 5 eventos, **poder do teste
> é ~50%** mesmo para tamanho de efeito grande (d = 1,0). Significa:
> se o framework fosse inútil, a chance de errar seria 50/50. Por isso
> o D3 v2.0.1 marca como prioridade **expandir o backtesting para
> n ≥ 12** (incluindo 2020 COVID completo + 2008 GFC como proxy).

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
