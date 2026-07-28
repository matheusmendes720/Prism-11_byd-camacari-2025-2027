# Índice unificado dos notebooks — BYD Camaçari 2025–2027

> **Escopo:** `analise-prescritiva/notebooks!/`  
> **Atualização:** julho de 2026  
> **Função:** conectar a progressão didática **L0–L10**, a implementação canônica **NB-01–NB-15** e a base de estudo aprofundada **D2**.

---

## 1. Visão geral dos dois sistemas

A pasta reúne dois sistemas complementares. Eles não são versões concorrentes nem devem ser lidos como uma única sequência de 26 passos.

### Sistema L* — aprender o raciocínio

Os 11 notebooks `l0-...` a `l10-...` formam uma progressão pedagógica. Cada volume parte da intuição, apresenta a matemática necessária, mostra código e fecha com uma interpretação executiva. A pergunta central é: **“como pensar sobre esse tipo de problema?”** O percurso vai de estatística e probabilidade à integração em um framework de decisão.

### Sistema NB-* — reproduzir a análise canônica

Os 15 notebooks `nb-01-...` a `nb-15-...` são artefatos aplicados do case. A pergunta central é: **“como esta análise foi implementada no caso BYD Camaçari?”** Eles cobrem risco cambial, concentração de fornecedores, cenários regulatórios, competição, índice composto, simulação, interdependências, validação, sensibilidade, gatilhos, NPV e dashboard final.

| Critério | L0–L10 didático | NB-01–NB-15 canônico |
|---|---|---|
| Porta de entrada | conceito e intuição | pergunta de negócio |
| Ordem | cumulativa, do básico ao avançado | pipeline analítico/prescritivo |
| Código | demonstrativo, comentado | implementação aplicada |
| Melhor uso | formação e revisão | reprodução, auditoria e extensão |
| Profundidade textual | curta a intermediária | complementada por D2/D3 |
| Resultado | repertório mental | evidência e decisão do case |

**Regra prática:** se um NB parecer uma “caixa-preta”, volte ao L* correspondente. Se um L* parecer abstrato, avance ao NB correspondente. Para derivações, limitações e contexto metodológico, abra os study notes D2. Para regras de decisão, triggers, acoplamentos e governança, consulte a base D3 em `analise-prescritiva/reports/decision-framework/`.

---

## 2. Mapa conceitual L* — a progressão didática

| Nível | Notebook | Conceitos centrais | Ao concluir, o leitor consegue… |
|---|---|---|---|
| **L0** | `l0-statistics-fundamentals.ipynb` | média, mediana, dispersão, percentis, correlação, histogramas e boxplots | resumir uma distribuição sem confundir centro, variabilidade e associação |
| **L1** | `l1-probability-uncertainty.ipynb` | probabilidade, valor esperado, condicional, Bayes, risco versus incerteza | expressar cenários em probabilidades e atualizar crenças com evidência |
| **L2** | `l2-hypothesis-testing.ipynb` | hipótese nula, p-valor, intervalo de confiança, erros I/II, poder | avaliar se um sinal pode ser ruído e questionar significância |
| **L3** | `l3-linear-regression.ipynb` | regressão simples/múltipla, coeficientes, resíduos, R², associação versus causalidade | interpretar drivers e limites de um modelo linear |
| **L4** | `l4-time-series.ipynb` | tendência, sazonalidade, estacionariedade, autocorrelação, forecast | reconhecer dependência temporal e preparar a leitura da PTAX |
| **L5** | `l5-volatility-garch.ipynb` | clustering, heterocedasticidade, GARCH, VaR, CVaR, meia-vida | explicar por que risco muda no tempo e ler previsões de volatilidade |
| **L6** | `l6-monte-carlo.ipynb` | amostragem, paths, percentis, correlação, cenários e cauda | transformar premissas em distribuição de resultados e stress |
| **L7** | `l7-multivariate-analysis.ipynb` | covariância, matriz de correlação, fatores, PCA e dependência | analisar múltiplas dimensões sem tratá-las como riscos isolados |
| **L8** | `l8-optimization.ipynb` | função objetivo, restrições, trade-offs, solução e sensibilidade | formular uma escolha prescritiva e testar sua robustez |
| **L9** | `l9-game-theory.ipynb` | jogadores, estratégias, payoffs, melhores respostas, equilíbrio de Nash | antecipar reações competitivas e evitar decisões unilateralmente ingênuas |
| **L10** | `l10-decision-framework.ipynb` | score composto, dimensões, estados, backtesting, triggers e governança | integrar sinais em decisão auditável, com ação e responsável |

### Encadeamento lógico

```text
Descrever dados        Quantificar incerteza       Modelar dinâmica
L0 ──► L1 ──► L2 ──► L3 ──► L4 ──► L5 ──► L6
                                      │             │
                                      └──────┬──────┘
                                             ▼
                              Dependência e escolha
                              L7 ──► L8 ──► L9 ──► L10
```

L0–L2 constroem alfabetização estatística; L3–L6 formam o núcleo quantitativo; L7–L10 migram de previsão para prescrição. O salto mais importante é entre **L6 (“o que pode acontecer?”)** e **L8/L10 (“o que faremos, sob quais restrições e com qual governança?”)**.

---

## 3. Mapa conceitual NB-* — pipeline canônico

| ID | Notebook | Tópico canônico | Papel no pipeline | Pré-requisito L* recomendado |
|---|---|---|---|---|
| **NB-01** | `nb-01-ptax-garch.ipynb` | PTAX, retornos, volatilidade e GARCH | estima dinâmica cambial e risco condicional | L4, L5 |
| **NB-02** | `nb-02-supply-chain-hhi.ipynb` | supply chain e HHI | mede concentração e fragilidade de fornecimento | L0, L7 |
| **NB-03** | `nb-03-regulatory-scenarios.ipynb` | cenários regulatórios | estrutura estados e impactos de política | L1, L6, L8 |
| **NB-04** | `nb-04-competition-game-theory.ipynb` | competição e teoria dos jogos | representa estratégias, payoffs e respostas rivais | L9 |
| **NB-05** | `nb-05-composite-index-radar.ipynb` | índice composto e radar | normaliza dimensões e sintetiza risco | L0, L7, L10 |
| **NB-06** | `nb-06-monte-carlo-multivariado.ipynb` | Monte Carlo multivariado | propaga choques correlacionados em cenários | L6, L7 |
| **NB-07** | `nb-07-interdependency-couplings.ipynb` | acoplamentos entre dimensões | explicita efeitos cruzados e não independência | L7, L8 |
| **NB-08** | `nb-08-backtesting-false-positives.ipynb` | backtesting e falsos positivos | mede qualidade dos alertas e erros operacionais | L2, L10 |
| **NB-09** | `nb-09-game-theory.ipynb` | jogos estratégicos ampliados | aprofunda decisões competitivas do NB-04 | L9 |
| **NB-10** | `nb-10-decision-trees.ipynb` | árvores de decisão | converte cenários e sinais em caminhos de ação | L8, L10 |
| **NB-11** | `nb-11-backtesting.ipynb` | validação histórica | testa estabilidade e desempenho fora da narrativa | L2, L5, L10 |
| **NB-12** | `nb-12-sensitivity.ipynb` | análise de sensibilidade | identifica premissas dominantes e fragilidade | L3, L8 |
| **NB-13** | `nb-13-trigger-matrix.ipynb` | matriz de gatilhos | liga thresholds, estados e respostas | L8, L10 |
| **NB-14** | `nb-14-npv-layer.ipynb` | camada de NPV | traduz risco e resposta em valor econômico | L3, L6, L8 |
| **NB-15** | `nb-15-final-dashboard.ipynb` | dashboard final | comunica estado, evidência, ação e rastreabilidade | L10 |

> **Nota de inventário:** há artefatos legados/alternativos (`nb-08-monte-carlo-multivariate.ipynb`) e espelhos `.py` de parte dos notebooks. Para navegação canônica, use a sequência funcional acima; trate duplicatas como material de compatibilidade ou reprodução.

---

## 4. Crosswalk L* ↔ NB-*

A relação é muitos-para-muitos: um L* pode fundamentar vários notebooks canônicos, enquanto um NB geralmente combina mais de uma competência.

| L* | Aprofunda principalmente | Conexões secundárias | O que procurar no NB |
|---|---|---|---|
| **L0 Estatística** | NB-02, NB-05 | NB-01, NB-11, NB-12 | distribuição, escala, dispersão, correlação, normalização e HHI |
| **L1 Probabilidade** | NB-03, NB-06 | NB-10, NB-14 | probabilidades de cenário, valor esperado e atualização de premissas |
| **L2 Hipóteses** | NB-08, NB-11 | NB-01, NB-12 | significância, cobertura, erro I/II, falso alerta e validação |
| **L3 Regressão** | NB-12, NB-14 | NB-01, NB-05 | drivers, elasticidades, sensitividade e impacto marginal no valor |
| **L4 Séries temporais** | NB-01 | NB-08, NB-11, NB-13 | retornos, autocorrelação, estacionariedade e janelas históricas |
| **L5 GARCH** | NB-01 | NB-06, NB-08, NB-11 | volatilidade condicional, persistência, VaR/CVaR e backtest |
| **L6 Monte Carlo** | NB-06 | NB-03, NB-07, NB-12, NB-14 | paths, percentis, choques, correlação e distribuição de NPV |
| **L7 Multivariada** | NB-02, NB-06, NB-07 | NB-05, NB-12 | matriz de dependência, fatores comuns, concentração e acoplamentos |
| **L8 Otimização** | NB-07, NB-10, NB-12, NB-14 | NB-03, NB-13 | objetivo, restrições, solução robusta e custo das ações |
| **L9 Jogos** | NB-04, NB-09 | NB-03, NB-10 | payoff, reação competitiva, equilíbrio e movimentos sequenciais |
| **L10 Framework** | NB-05, NB-08, NB-10, NB-13, NB-15 | NB-11, NB-14 | score, estados, validação, gatilho, decisão, dono e comunicação |

### Crosswalk inverso: onde buscar fundamento

- **NB-01:** comece em L4, avance a L5 e use L2 para entender validação.
- **NB-02:** L0 explica HHI e estatística; L7 explica visão multivariada da cadeia.
- **NB-03:** L1 dá linguagem probabilística; L6 cria cenários; L8 estrutura escolha.
- **NB-04/NB-09:** L9 é o fundamento direto; L10 mostra como incorporar o resultado ao framework.
- **NB-05:** L0 esclarece escala; L7 trata dependência; L10 integra o score.
- **NB-06:** L6 ensina simulação; L7 impede assumir independência indevida.
- **NB-07:** L7 explica acoplamento; L8 converte interação em restrição ou decisão.
- **NB-08/NB-11:** L2 explica erros; L5 o risco temporal; L10 a consequência operacional.
- **NB-10/NB-13:** L8 estrutura alternativas; L10 fornece estados, gatilhos e governança.
- **NB-12:** L3 ajuda a ler efeitos marginais; L8 testa robustez da solução.
- **NB-14:** L1/L6 tratam incerteza; L8 formula trade-offs; L10 governa a decisão.
- **NB-15:** L10 é o núcleo; os demais NBs fornecem evidências que o painel sintetiza.

---

## 5. Crosswalk L* ↔ D2 base study notes

Os arquivos abaixo ficam em `../../d2-econometric-vulnerability/_study_notes/` a partir desta pasta. O notebook L* é a aula interativa; o L-doc D2 é o capítulo de aprofundamento.

| L* | D2 principal | D2 complementar | Por que abrir |
|---|---|---|---|
| **L0** | `L0.2-estatistica-descritiva.md` | `L0.0-glossario-metricas.md`, `ZZ-glossario-formulas.md` | definições, fórmulas, unidades, limitações e exemplos do case |
| **L1** | `L0.3-probabilidade-distribuicoes.md` | `L1.1-eda-supply-chain-trade-balance.md` | distribuições, caudas e incerteza aplicada à cadeia |
| **L2** | `L0.2-estatistica-descritiva.md` | `L5.0-calibracao-regime-switching.md` | testes, erros, calibração, Kupiec/Christoffersen e falsos positivos |
| **L3** | `L1.2-eda-variaveis-expandidas-matriz.md` | `L2.0-arquitetura-modelagem.md`, `L5.1-interpretabilidade-shap-lime.md` | seleção de variáveis, arquitetura e explicação de drivers |
| **L4** | `L1.0-eda-pTAX-passo-a-passo.md` | `L2.0-arquitetura-modelagem.md` | walkthrough temporal, retornos, ACF/PACF, ADF/KPSS e regimes |
| **L5** | `L2.1-modelos-vol-garch-gjr.md` | `L5.0-calibracao-regime-switching.md`, `L6.0-risco-cauda-extremo.md` | GARCH/GJR/EGARCH, persistência, calibração e caudas pesadas |
| **L6** | `L2.2-cambio-stress-test-monte-carlo.md` | `L6.1-stress-testing-institucional.md` | Cholesky, choques, VaR/CVaR e desenho institucional do stress |
| **L7** | `L1.1-eda-supply-chain-trade-balance.md` | `L1.2-eda-variaveis-expandidas-matriz.md`, `L2.2-cambio-stress-test-monte-carlo.md` | HHI, relações entre variáveis e correlação multivariada |
| **L8** | `L3.0-matrizes-decisao.md` | `L3.2-raci-action-register.md` | matriz prescritiva, restrições, prioridades, responsáveis e gates |
| **L9** | `L3.0-matrizes-decisao.md` | D3 + NB-04/NB-09 | D2 dá a ponte decisória; o conteúdo de jogos vive sobretudo nos NBs/D3 |
| **L10** | `L3.1-trigger-matrix-auto-trigger.md` | `L3.0-matrizes-decisao.md`, `L3.2-raci-action-register.md`, `L4.1-dashboards-executivos.md` | detecção, decisão, governança, registro e comunicação executiva |

### A ponte completa L* → NB → D2

| Objetivo | Aula L* | Aplicação NB | Capítulo D2 |
|---|---|---|---|
| entender risco cambial dinâmico | L4 + L5 | NB-01 | L1.0 + L2.1 |
| medir concentração de cadeia | L0 + L7 | NB-02 | L1.1 |
| construir cenário correlacionado | L1 + L6 + L7 | NB-06 | L2.2 |
| validar alertas | L2 + L5 + L10 | NB-08/NB-11 | L5.0 + L4.2 |
| transformar sinal em ação | L8 + L10 | NB-10/NB-13 | L3.0 + L3.1 + L3.2 |
| traduzir risco em valor | L3 + L6 + L8 | NB-12/NB-14 | L2.2 + L3.0 |
| comunicar ao decisor | L10 | NB-15 | L4.0 + L4.1 + L4.2 |

---

## 6. Trilhas de leitura por perfil

### Trilha Júnior — alfabetização e confiança (aprox. 2h)

**Para quem:** primeiro contato com analytics, risco ou o case.

1. Leia as seções 1–2 deste índice (10 min).
2. Execute **L0 → L1 → L2** (65 min).
3. Execute **L4** para ver dados no tempo (25 min).
4. Abra **NB-01** apenas para reconhecer o pipeline aplicado (10 min).
5. Consulte D2 `L0.0-glossario-metricas.md` e `L1.0-eda-pTAX-passo-a-passo.md` por busca, não de ponta a ponta (10 min).

**Resultado esperado:** distinguir média de risco, correlação de causalidade, sinal de ruído e previsão de cenário. Perguntas de saída: “qual é a distribuição?”, “qual período?”, “qual incerteza?” e “como foi validado?”.

### Trilha Pleno — implementação ponta a ponta (aprox. 4h)

**Para quem:** analista/data scientist que precisa reproduzir ou estender.

1. Revisão rápida **L4 → L5 → L6 → L7** (100 min).
2. Aplicação **NB-01 → NB-02 → NB-05 → NB-06 → NB-07** (90 min).
3. Prescrição **L8 → L10**, seguida de **NB-12 → NB-13 → NB-14** (55 min).
4. Validação **NB-08/NB-11** e consulta a D2 `L5.0-calibracao-regime-switching.md` (15 min).

**Resultado esperado:** rastrear dado → transformação → modelo → cenário → score → trigger → valor. Ao final, o leitor deve saber onde alterar uma premissa e quais downstreams precisam ser recalculados.

### Trilha Sênior — challenge, governança e decisão (aprox. 3h)

**Para quem:** líder técnico, risco, estratégia, auditoria ou sponsor executivo.

1. Leia este índice e **L10** (35 min).
2. Inspecione **NB-05, NB-08/NB-11, NB-12, NB-13, NB-14 e NB-15** (75 min).
3. Faça challenge metodológico com D2 `L5.0`, `L6.0`, `L6.1` e `L4.2` (45 min).
4. Revise em D3 as matrizes, acoplamentos, thresholds, NPV e governança (25 min).

**Resultado esperado:** julgar se a decisão é robusta, explicável, economicamente material e operacionalizável. Perguntas de saída: “qual premissa domina?”, “qual falso positivo toleramos?”, “quem pode sobrescrever o trigger?”, “qual ação preserva mais NPV?” e “qual evidência chega ao Conselho?”.

---

### Convenções e manutenção

- **L*** em minúsculas refere-se aos notebooks didáticos desta pasta.
- **NB-*** refere-se à sequência canônica aplicada.
- **L-doc D2** refere-se aos markdowns em `d2-econometric-vulnerability/_study_notes/`; não confundir sua numeração pedagógica interna com a série de notebooks L*.
- **D3** refere-se à base prescritiva/decision framework; é a continuação natural quando a pergunta deixa de ser “quanto risco?” e passa a ser “qual ação, quando e por quem?”.
- Ao adicionar um notebook, atualize primeiro o mapa correspondente, depois o crosswalk e, por último, as trilhas.

**Próximo passo recomendado:** escolha seu perfil, execute a trilha e use este documento como mapa de retorno — não como obrigação de leitura linear.
