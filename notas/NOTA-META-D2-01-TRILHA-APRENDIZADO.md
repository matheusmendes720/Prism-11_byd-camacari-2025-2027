---
slug: notas-meta-d2-trilha-aprendizado
title: "Nota-Meta D2 #01 — Trilha de Meta-Learning · Como Estudar a Base D2 do BYD Camaçari"
ueid: ikigai:nota:d2-meta-trilha-aprendizado:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, meta-learning, trilha-aprendizado, pedagogia-em-camadas, como-estudar]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre COMO estudar a base D2 do BYD Camaçari
    2025-2027 (28 docs didáticos em _study_notes/, 6 camadas progressivas L0-L6,
    2 transversais AA/BB, glossário ZZ, 15 notebooks canônicos NB-01-NB-15,
    6 outputs HTML canônicos + 11 PNGs). Esta nota ensina o leitor a
    organizar seu estudo, escolher trilha por perfil, evitar armadilhas
    pedagógicas, e maximizar retenção das métricas canônicas do projeto
    (σ 14.19%, VaR R$ 6.43 bi, composite 71.8, GARCH α=0.0488 β=0.9418).
  _audience: engenheiro-junior, analista-pleno, pesquisador, new-joiner
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/README.md
    - /d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md
    - /d2-econometric-vulnerability/_study_notes/00-INDEX.md
    - /d2-econometric-vulnerability/_study_notes/00-SUMMARY.md
    - /d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md
  _outputs:
    - mapeamento-completo-base-d2
    - trilha-por-perfil
    - tecnicas-meta-learning-aplicadas
    - armadilhas-comuns
  _success_criteria: >-
    leitor sai com um plano de estudo concreto, escolha de trilha por
    perfil, e compreensão da pedagogia em camadas L0-L6.
---

# Nota-Meta D2 #01 — Trilha de Meta-Learning

> **Quem está falando:** um par sênior-orientador mostrando como extrair o máximo da base D2.
> **O que esta nota faz:** mapeia toda a base, explica a pedagogia em camadas (L0 → L6 + transversais), recomenda trilhas por perfil, e dá dicas de meta-learning para fixar as métricas canônicas.
> **Fonte canônica:** [`/d2-econometric-vulnerability/_study_notes/README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) (capa oficial da base)

---

## §0. Visão geral da base D2

A base D2 é o **acervo didático completo** construído para que um engenheiro júnior de Ciência de Dados (que conhece Python, mas nunca viu séries temporais financeiras aplicadas) consiga reproduzir e auditar toda a análise econométrica de vulnerabilidade da planta BYD Camaçari.

### §0.1 Estrutura geral

```
BASE D2 (28 docs / ~880 KB / ~16.500 linhas)
├── AA + 00-INDEX + 00-SUMMARY + README  (capa + auto-navegação)
├── L0 — Fundamentos Matemáticos        (4 docs / 98 KB / 2.255 linhas)
├── L1 — EDA Descritiva                 (3 docs / 106 KB / 1.956 linhas)
├── L2 — Análise Preditiva              (3 docs / 91 KB / 2.233 linhas)
├── L3 — Análise Prescritiva            (3 docs / 146 KB / 2.503 linhas)
├── L4 — Decisão Executiva              (3 docs / 84 KB / 1.318 linhas)
├── L5 — Tópicos Avançados              (2 docs / 61 KB / 1.531 linhas)
├── L6 — Especialização                 (3 docs / 74 KB / 1.740 linhas)
├── 98-LAB-ADVANCED                     (1 doc / 22 KB / 458 linhas)
├── 99-LAB-EXERCISES                    (1 doc / 25 KB / 690 linhas)
├── ZZ — Glossário de Fórmulas          (1 doc / 15 KB / 317 linhas)
└── BB — Bibliografia                   (1 doc / 30 KB / 507 linhas)
```

### §0.2 Quanto tempo leva para ler tudo?

| Perfil | Tempo | Trilha |
|---|---|---|
| **Júnior** (engenheiro de dados, 0-2 anos) | **30-45 min** | AA → L0.0 (glossário) → L1.0 (EDA PTAX) → 99-LAB Exercício 1 |
| **Pleno** (data scientist, 2-5 anos) | **3-4 h** | AA → L0 → L1 → L2 → L3 (8h cumulativo se for também executar notebooks) |
| **Sênior** (risk officer / lead técnico) | **7-10 h** | AA → L3 → L4 → L5 → L6 → 98-LAB avançado |
| **Executivo** (Conselho, CEO, headhunter) | **15-30 min** | AA → 1-pager → `cap6_dashboard_final.png` → L4.0 (comunicação ao Conselho) |
| **Acadêmico** (pesquisador, doutorando) | **25-35 h** | Sequencial completo + LAB + 3 livros de BB |

---

## §1. A pedagogia em camadas — por que L0 → L1 → L2 → L3 → L4 → L5 → L6

A pergunta que esta seção responde: **por que a base foi organizada exatamente assim?**

### §1.1 O princípio da "complexidade marginal decrescente"

Cada camada adiciona **20-30% de complexidade nova**. Você não precisa dominar tudo:

- **L0-L1**: o vocabulário + olhar os dados (júnior).
- **L2-L3**: modelar e prescrever (pleno).
- **L4-L6**: comunicar, calibrar, especializar (sênior).

Se você parar depois de L3, já consegue ler **qualquer output de D2** e entender o que ele diz. As camadas L4-L6 são sobre **como usar com responsabilidade**.

### §1.2 O princípio da "construção sobre a anterior"

A base é deliberadamente sequencial:

| De → Para | O que você ganha | O que é pré-requisito |
|---|---|---|
| L0 → L1 | Conceitos (σ, kurt, IQR) viram olhar os dados (vol 30d, histograma, outliers) | Você sabe definir o que é uma média |
| L1 → L2 | Olhar os dados vira modelar (ACF/PACF vira ARIMA; vol clustering vira GARCH) | Você sabe dizer se a série é estacionária |
| L2 → L3 | Modelar vira prescrever (GARCH vira trigger; MC vira decision matrix) | Você sabe dizer VaR vs CVaR |
| L3 → L4 | Prescrever vira comunicar (matriz vira dashboard; RACI vira slide) | Você sabe dizer quem aprova R$ 280M |
| L4 → L5 | Comunicar vira calibrar (1-pager vira Kupiec test; dashboard vira SHAP) | Você sabe dizer "FP 14,8%" |
| L5 → L6 | Calibrar vira especializar (Kupiec vira EVT com GPD; SHAP vira mesa de risco 24/7) | Você sabe dizer "ν=6,99" (cauda pesada) |

### §1.3 O princípio da "numerologia concreta"

Toda fórmula na base vem com **exemplo numérico real do BYD Camaçari**. Se você ler uma fórmula sem número, está lendo textbook; se ler com σ=14,19%, VaR=R$ 6,43 bi, GARCH α=0,0488, está aprendendo o projeto.

> **Regra de ouro do meta-learning D2:** se você não consegue citar de cor pelo menos 10 números canônicos (σ, VaR, CVaR, composite, GARCH α/β, HHI, half-life, ν), você não internalizou a base.

---

## §2. As 14 métricas-mestre que você precisa decorar

Aqui está a lista canônica. Cada métrica é explicada em detalhe no **L0.0-glossario-metricas.md** ([`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md)) e tem exemplos numéricos concretos do projeto. Decore estas primeiro:

| # | Métrica | Valor canônico D2 | Onde é citada |
|---|---|---|---|
| 1 | σ anualizada PTAX (30d) | **14,19%** | L0.0, L1.0, L2.0 |
| 2 | σ anualizada PTAX (BCB SGS 10y) | **14,86%** | L2.1, D3 RECALIBRATION |
| 3 | VaR 95% 6m (MC refresh) | **R$ 6,43 bi** | L2.2, L3.0 |
| 4 | CVaR 95% 6m (MC refresh) | **R$ 8,04 bi** | L2.2 |
| 5 | GARCH(1,1)-t α | **0,0488** | L2.1 |
| 6 | GARCH(1,1)-t β | **0,9418** | L2.1 |
| 7 | GARCH(1,1)-t ν (df Student-t) | **6,99** | L2.1, L6.0 |
| 8 | GARCH persistence α+β | **0,9906** | L2.1 |
| 9 | Half-life do choque | **73,3 dias** (~3,5 meses) | L2.1, L5.0 |
| 10 | Composite score D2 stakeholder 4-dim | **71,8 / 100** | L3.0, INDEX |
| 12 | Skewness PTAX (2020-2026) | **+0,152** | L0.0 |
| 13 | Kurtosis PTAX | **+4,88** (fat tails) | L0.0, L0.3 |
| 14 | HHI Bateria LFP | **4.850** (altamente concentrada) | L1.1 |
| 15 | HHI Lítio | **3.400** | L1.1 |
| 16 | HHI Semicondutor | **2.925** | L1.1 |
| 17 | Composite weight câmbio | **0,30 (30%)** | L3.0, INDEX |
| 18 | Composite weight supply | **0,30 (30%)** | L3.0 |
| 19 | Composite weight regulatório | **0,20 (20%)** | L3.0 |
| 20 | Composite weight competitivo | **0,20 (20%)** | L3.0 |

> **Meta-test:** ao final do estudo, tente escrever essas 20 métricas em uma folha em branco. Se conseguir 18+, está pronto para auditar D2. Se ficar abaixo de 12, releia L0.0 e L0.2.

---

## §3. As 5 técnicas de meta-learning aplicadas nesta base

### §3.1 "Aprender fazendo" — 99-LAB-EXERCISES

O arquivo [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) tem **7 exercícios hands-on** classificados EASY-EXPERT, com:

- Setup reproduzível em Jupyter (Python + numpy + pandas + statsmodels).
- Código comentado.
- Respostas esperadas (sem dar tudo mastigado — você precisa pensar).

**Recomendação meta-learning:** faça pelo menos os 3 primeiros (EASY) **antes** de tentar avançar para L2. Exercício 1: calcule vol 30d de PTAX com numpy. Exercício 2: plote histograma. Exercício 3: calcule VaR empírico.

### §3.2 "Pseudo-código Python" — quando a fórmula aparece, código aparece junto

Toda fórmula em L0, L1, L2 vem com um trecho NumPy/Pandas que você pode copiar. Isso elimina a abstração vazia. **Sempre rode o código** — não basta ler a fórmula.

### §3.3 "Chef's tips didáticos" — armadilhas clássicas com asterisco

Toda camada tem seções chamadas "Pegadinha", "Limitação", "Atenção", "Cuidado com...". Essas são as armadilhas que **mesmo profissionais senior caem**. Não pule.

Exemplos famosos:
- "VaR subestima em 30-50% para distribuições com fat tails" ([`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) §3).
- "Stress test assume repasse de fornecedores constante — quebra em >1.5 ciclos" ([L2.2]).
- "GARCH assume normalidade condicional — quebra quando há leverage effects" ([L2.1]).
- "Composite original (CLAUDE.md) soma 1,15, não 1,00 — bug histórico" ([`L3.0-matrizes-decisao.md`](../../d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md)).

### §3.4 "Cross-refs explícitos entre camadas"

A base é um grafo, não uma sequência linear. Cada doc aponta para pré-requisitos e extensões. Exemplos:

- L1.0 (EDA PTAX) → L0.0 (definição de σ, log-retorno), L0.1 (walkthrough dos outputs HTML), L2.0 (pipeline de modelagem).
- L2.2 (MC stress test) → L1.0 (vol 30d entrada), L3.0 (decision tree usa VaR como input).
- L3.1 (trigger matrix) → L2.1 (vol prevista por GARCH alimenta trigger), L5.0 (Kupiec test valida trigger).

**Recomendação meta-learning:** ao ler um doc, sempre siga os cross-refs **antes** de avançar. O grafo de dependências está em [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §3.

### §3.5 "Trilhas por tempo disponível"

Reconhecendo que ninguém lê 25 horas de uma vez, a base define 5 perfis (júnior/pleno/sênior/executivo/acadêmico) com tempos e docs específicos. **Use isso para calibrar expectativas.**

---

## §4. Mapa de outputs — onde está cada coisa

Para que você nunca trave "onde está o gráfico X?".

### §4.1 Os 6 outputs HTML canônicos do D2

Todos em `/d2-econometric-vulnerability/outputs/`:

| # | Arquivo | Função | Aula que reconstrói |
|---|---|---|---|
| 1 | [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) | Stress test determinístico (−5%, −10%, −20%, −30%) | L2.2 |
| 2 | [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) | 10k paths × 6 meses, GARCH-t, VaR/CVaR | L2.2 |
| 3 | [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) | HHI por categoria, Sankey disruption | L1.1 |
| 4 | [`regulatory-scenarios.html`](../../d2-econometric-vulnerability/outputs/regulatory-scenarios.html) | 4 cenários BNDES/Rota 2030 | L3.0 |
| 5 | [`competition-landscape.html`](../../d2-econometric-vulnerability/outputs/competition-landscape.html) | Market share 2026-2028 | L3.0 |
| 6 | [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html) | Radar 4 dimensões | L3.0 |

### §4.2 Os 11 PNGs (capítulos visuais)

Todos em `/d2-econometric-vulnerability/outputs/`:

- `cap1_ptax_historia.png` — série PTAX história (Capa Cap1).
- `cap1b_volatility.png` — volatilidade realizada 30d/90d.
- `cap1c_stress_test.png` — stress test −5/−10/−20/−30%.
- `cap2_supply_chain.png` — HHI por categoria.
- `cap2b_disruption.png` — cenários de disrupção supply.
- `cap3_regulatory.png` — 4 cenários políticos.
- `cap4_competition.png` — BYD vs Tesla/VW/GM.
- `cap4b_competitive_deep.png` — projeção share 2026-2028.
- `cap5_composite.png` — radar 4 dimensões.
- `cap5b_sensitivity.png` — tornado analysis.
- `cap6_dashboard_final.png` — dashboard consolidado final.

### §4.3 Os 15 notebooks canônicos (NB-01 a NB-15)

Todos em `/analise-prescritiva/notebooks!/02-canonicos/`:

| NB | Tema | Conecta com |
|---|---|---|
| NB-01 | [`nb-01-ptax-garch`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) | L2.0, L2.1 |
| NB-02 | [`nb-02-supply-chain-hhi`](../../analise-prescritiva/notebooks!/02-canonicos/nb-02-supply-chain-hhi/nb-02-supply-chain-hhi.ipynb) | L1.1 |
| NB-03 | [`nb-03-regulatory-scenarios`](../../analise-prescritiva/notebooks!/02-canonicos/nb-03-regulatory-scenarios/nb-03-regulatory-scenarios.ipynb) | L3.0 |
| NB-04 | [`nb-04-competition-game-theory`](../../analise-prescritiva/notebooks!/02-canonicos/nb-04-competition-game-theory/nb-04-competition-game-theory.ipynb) | L3.0 |
| NB-05 | [`nb-05-composite-index-radar`](../../analise-prescritiva/notebooks!/02-canonicos/nb-05-composite-index-radar/nb-05-composite-index-radar.ipynb) | L3.0 |
| NB-06 | [`nb-06-monte-carlo-multivariado`](../../analise-prescritiva/notebooks!/02-canonicos/nb-06-monte-carlo-multivariado/nb-06-monte-carlo-multivariado.ipynb) | L2.2 |
| NB-07 | [`nb-07-interdependency-couplings`](../../analise-prescritiva/notebooks!/02-canonicos/nb-07-interdependency-couplings/nb-07-interdependency-couplings.ipynb) | L3.0 |
| NB-08 | [`nb-08-backtesting-false-positives`](../../analise-prescritiva/notebooks!/02-canonicos/nb-08-backtesting-false-positives/nb-08-backtesting-false-positives.ipynb) | L5.0 |
| NB-09 | [`nb-09-game-theory`](../../analise-prescritiva/notebooks!/02-canonicos/nb-09-game-theory/nb-09-game-theory.ipynb) | L3.0 |
| NB-10 | [`nb-10-decision-trees`](../../analise-prescritiva/notebooks!/02-canonicos/nb-10-decision-trees/nb-10-decision-trees.ipynb) | L3.0 |
| NB-11 | [`nb-11-backtesting`](../../analise-prescritiva/notebooks!/02-canonicos/nb-11-backtesting/nb-11-backtesting.ipynb) | L5.0 |
| NB-12 | [`nb-12-sensitivity`](../../analise-prescritiva/notebooks!/02-canonicos/nb-12-sensitivity/nb-12-sensitivity.ipynb) | L3.0 |
| NB-13 | [`nb-13-trigger-matrix`](../../analise-prescritiva/notebooks!/02-canonicos/nb-13-trigger-matrix/nb-13-trigger-matrix.ipynb) | L3.1 |
| NB-14 | [`nb-14-npv-layer`](../../analise-prescritiva/notebooks!/02-canonicos/nb-14-npv-layer/nb-14-npv-layer.ipynb) | L3.2 |
| NB-15 | [`nb-15-final-dashboard`](../../analise-prescritiva/notebooks!/02-canonicos/nb-15-final-dashboard/nb-15-final-dashboard.ipynb) | L4.1 |

### §4.4 O walkthrough visual

Em `/d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/`:

- [`D2-FIG-0.0-tour-visual.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.0-tour-visual.md) — tour visual completo da base.
- [`D2-FIG-0.1-outputs-html.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.1-outputs-html.md) — walkthrough dos 6 HTMLs.
- [`D2-FIG-0.2-pipeline-codigo.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.2-pipeline-codigo.md) — pipeline de código dos notebooks.
- [`D2-FIG-0.3-decoding-dashboard.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.3-decoding-dashboard.md) — como ler o dashboard final.

---

## §5. Trilha prática recomendada — Passo-a-passo

### §5.1 Para um júnior (30-45 min)

1. **[5 min]** [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md) — leia as 4 trilhas no §2.
2. **[15 min]** [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) — leia apenas §1 (retorno/log-retorno), §2 (vol), §3 (VaR).
3. **[15 min]** [`L1.0-eda-pTAX-passo-a-passo.md`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md) — leia §1, §2, §10 (skip ADF/KPSS/MLE por ora).
4. **[10 min]** [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — faça o **Exercício 1** (calcule vol 30d de PTAX com numpy).

### §5.2 Para um pleno (3-4 h)

1. **[30 min]** AA + L0 inteiro (glossário, glossário notebooks, estatística descritiva, probabilidade).
2. **[60 min]** L1 inteiro (EDA PTAX, EDA supply, matriz V1-V31).
3. **[90 min]** L2 inteiro (arquitetura, GARCH/GJR, MC stress test).
4. **[30 min]** L3 inteiro (matrizes, trigger, RACI) — esta é a cereja do bolo.

### §5.3 Para um sênior (7-10 h)

1. **[90 min]** L4 inteiro (comunicação Conselho, dashboards, gap modelo-humano).
2. **[120 min]** L5 inteiro (calibração regime-switching, interpretabilidade SHAP/LIME).
3. **[120 min]** L6 inteiro (risco cauda, stress test institucional, mesa operacional).
4. **[60 min]** 98-LAB-ADVANCED.
5. **[60 min]** Reler qualquer doc com atenção aos cross-refs.

### §5.4 Para um executivo (15-30 min)

1. **[5 min]** [`outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md).
2. **[5 min]** [`cap6_dashboard_final.png`](../../d2-econometric-vulnerability/outputs/cap6_dashboard_final.png) (343 KB).
3. **[10 min]** [`L4.0-comunicacao-conselho.md`](../../d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md) — especialmente §3 (1-pager template) e §5 (anti-patterns).

---

## §6. 10 armadilhas comuns ao estudar D2 (e como evitá-las)

1. **Pular L0 indo direto para GARCH.** Você não vai entender o que é "persistence 0.9906" se não sabe o que é σ.
   - **Solução:** mesmo que "já saiba estatística", leia L0.0 e L0.2 — eles têm exemplos numéricos reais do BYD que você não viu em lugar nenhum.

2. **Tratar VaR como se fosse Expected Shortfall.** VaR é o "percentil"; CVaR é a "média da cauda". Confundir os dois gera confusão séria no Conselho.
   - **Solução:** decorar VaR=P5 (percentil 5%) e CVaR=esperança da cauda (média de quem caiu abaixo do VaR).

3. **Achar que GARCH é "previsão de PTAX".** GARCH prevê **volatilidade**, não o nível da taxa. A confusão é clássica.
   - **Solução:** ao falar, sempre diga "GARCH prevê vol", nunca "GARCH prevê PTAX".

4. **Esquecer que σ=14,19% é uma medida de janela (30d), não do ano.** Em outro dia pode ser 18%, em outro 12%.
   - **Solução:** sempre fale "σ 30d anualizada = 14,19% no momento do estudo".

5. **Misturar VaR refresh (6,43 bi) com VaR v2.0.1 (8,21 bi).** São versões diferentes.
   - **Solução:** ver §4 desta nota e [`L2.2-cambio-stress-test-monte-carlo.md`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) — discrepância documentada.

6. **Achar que composite é uma "média simples".** É média **ponderada** (câmbio 30%, supply 30%, regulatório 20%, competitivo 20%) — e os pesos originais somavam 1,15 (bug histórico corrigido em v2.0.1).
   - **Solução:** ao explicar composite, sempre citar os 4 pesos e mencionar a renormalização para sum=1,00.

7. **Confundir stress test determinístico com MC probabilístico.** O primeiro dá 1 número por cenário (−10% PTAX = −4,2 pp BOM). O segundo dá distribuição.
   - **Solução:** stress test é "se X acontece, quanto custa"; MC é "qual a probabilidade de X acontecer e quanto custa em média".

8. **Tratar HHI como "quantos fornecedores tem".** HHI é o quadrado das participações somadas. 4 fornecedores com 25% cada dão HHI = 4 × 625 = 2.500.
   - **Solução:** lembrar que HHI é quadrático — duplicar market share quadruplica contribuição.

9. **Esquecer que D2 cobre jan/2020 a jul/2026.** Os 1.642 obs PTAX incluem COVID, election 2022, lítio spike, etc. — tudo mudou.
   - **Solução:** sempre que citar "1.642 obs", lembrar que é até 17/jul/2026.

10. **Crer que D2 é "modelo definitivo".** É o que tínhamos em jul/2026. Recalibrações trimestrais (regime switching) podem mudar números.
    - **Solução:** ler [`L5.0-calibracao-regime-switching.md`](../../d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md) — entender que o modelo **vive**.

---

## §7. Recursos complementares para meta-learning

### §7.1 Livros (em [`BB-bibliografia-leituras-recomendadas.md`](../../d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md))

| Livro | Por que ler | Quando |
|---|---|---|
| **Hull — Risk Management and Financial Institutions** | Cap 1-3 cobre VaR, CVaR, vol com rigor | Antes de L0.3 ou L2.2 |
| **Tsay — Analysis of Financial Time Series** | Cap 1-4 cobre séries temporais | Antes de L1.0 ou L2.0 |
| **Cont — Empirical Analysis of Financial Time Series** | Cap 8-10 cobre GARCH com profundidade | Antes de L2.1 |
| **McNeil, Frey, Embrechts — Quantitative Risk Management** | Cap 2-7 cobre VaR, EVT, copulas | Antes de L6.0 |
| **Taleb — The Black Swan** | Livro de bolso para entender caudas | Antes de L6.0 |
| **Kahneman — Thinking, Fast and Slow** | Para entender heurísticas do L4.2 e L7.1 | Quando bater o ceticismo |
| **Christoffersen — Elements of Financial Risk Management** | Cap 4 cobre Kupiec/Christoffersen test | Antes de L5.0 |

### §7.2 Papers seminais (em BB)

- **Bollerslev (1986) — GARCH**: o paper original. Leia o abstract.
- **Engle (1982) — ARCH**: anterior ao GARCH.
- **Glosten, Jagannathan, Runkle (1993) — GJR**: o "GARCH com leverage".
- **Kupiec (1995) — Techniques for Verifying VaR**: o teste que L5.0 explica.
- **Christoffersen (1998) — Testing Interval Forecasts**: complement ao Kupiec.
- **McNeil, Frey (2000) — Estimation of Tail-Related Risk Measures**: fundação do EVT.

### §7.3 Cursos online (em BB)

- Coursera: "Financial Engineering" (Columbia).
- Coursera: "Time Series" (PennState).
- DataCamp: "Quantitative Risk Management in Python".

### §7.4 Bibliotecas Python

- `pandas`, `numpy`, `statsmodels` (GARCH), `arch` (ARCH/GARCH moderno), `scipy.stats` (distribuições), `matplotlib`, `plotly` (dashboards), `scikit-learn` (PCA), `shap` (interpretabilidade).

---

## §8. Auto-avaliação: você está pronto?

Faça este teste ANTES de ir para os artefatos técnicos:

- [ ] Sei citar **σ 14,19%** de cor.
- [ ] Sei citar **VaR 95% = R$ 6,43 bi** de cor.
- [ ] Sei a diferença entre **VaR e CVaR**.
- [ ] Sei o que é **GARCH α=0,0488, β=0,9418, ν=6,99**.
- [ ] Sei o que é **HHI** e como interpretar **4.850** vs **1.500**.
- [ ] Sei o que é **composite 71,8** e seus 4 pesos.
- [ ] Sei citar **3 das 5 stress events** testadas no backtesting.
- [ ] Sei explicar a **diferença entre stress test determinístico e MC**.
- [ ] Sei dizer o que **L0, L1, L2, L3** representam.
- [ ] Sei dizer **onde está o trigger matrix**.

Se você marcou 8/10+, está pronto para abrir qualquer output do D2 e entender o que ele diz. Se marcou < 5/10, volte para L0.

---

## §9. Próximas notas-meta D2

Esta é a **Nota-Meta D2 #01 — Trilha de Meta-Learning**. As próximas notas desta série são:

- **Nota-Meta D2 #02 — L0 Fundamentos** (deep dive em estatística, probabilidade, distribuições).
- **Nota-Meta D2 #03 — L1 EDA** (PTAX passo-a-passo, supply chain trade balance, variáveis V1-V31).
- **Nota-Meta D2 #04 — L2 Modelagem Preditiva** (GARCH, GJR, MC stress test).
- **Nota-Meta D2 #05 — L3 Análise Prescritiva** (matrizes de decisão, trigger matrix, RACI).
- **Nota-Meta D2 #06 — L4-L6 + LAB** (comunicação Conselho, calibração, risco cauda, LAB avançado).
- **Nota-Meta D2 #07 — Transversais** (AA, BB, ZZ — glossário, bibliografia, fórmulas).

Cada nota-meta terá:
- Resumo executivo.
- Mapa conceitual visual.
- 5-10 takeaways principais.
- Cross-refs explícitos para os docs da base.
- 3-5 exercícios de fixação.
- Quiz de auto-avaliação.

---

## §10. Links rápidos para abrir agora

### §10.1 Capa da base

- [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) — capa oficial (24 KB).
- [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md) — tour guiado (19.9 KB, 275 linhas).
- [`00-INDEX.md`](../../d2-econometric-vulnerability/_study_notes/00-INDEX.md) — índice remissivo Ctrl+F (21.5 KB, 585 linhas).
- [`00-SUMMARY.md`](../../d2-econometric-vulnerability/_study_notes/00-SUMMARY.md) — sumário final + checklist de domínio (18.4 KB, 219 linhas).

### §10.2 Glossários transversais

- [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) — 14 métricas com fórmula + número (27.4 KB, 525 linhas).
- [`L0.1-glossario-notebooks.md`](../../d2-econometric-vulnerability/_study_notes/L0.1-glossario-notebooks.md) — walkthrough dos 6 outputs HTML (26 KB, 465 linhas).
- [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) — 50+ fórmulas em ordem alfabética (15.6 KB, 317 linhas).
- [`BB-bibliografia-leituras-recomendadas.md`](../../d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md) — 10 livros + 8 papers + 4 trilhas (30.7 KB, 507 linhas).

### §10.3 Walkthrough visual

- [`D2-FIG-0.0-tour-visual.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.0-tour-visual.md) — tour visual completo.
- [`D2-FIG-0.1-outputs-html.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.1-outputs-html.md) — walkthrough dos 6 outputs.
- [`D2-FIG-0.2-pipeline-codigo.md`](../../d2-econometric-vulnerability/_study_notes_artifacts_walkthrough/D2-FIG-0.2-pipeline-codigo.md) — pipeline de código.

### §10.4 LABs práticos

- [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios EASY-EXPERT (27.4 KB, 690 linhas).
- [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md) — LAB avançado (23.3 KB, 458 linhas).

### §10.5 Atlas e 1-pager

- [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) — relatório técnico completo (3.7 MB, 13 figuras).
- [`/analise-prescritiva/reports/atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html) — Atlas D2 white paper (66 KB).
- [`outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md) — 1-pager consolidado (181 linhas).

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado.*
*Próxima: [Nota-Meta D2 #02 — L0 Fundamentos](./NOTA-META-D2-02-L0-FUNDAMENTOS.md).*