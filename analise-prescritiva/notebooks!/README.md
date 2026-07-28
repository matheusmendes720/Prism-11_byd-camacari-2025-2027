# 📚 Notebooks — BYD Camaçari 2025-2027

> **Capa principal** da pasta `notebooks!`
> **Data**: 28/jul/2026
> **Estrutura**: 7 sub-pastas + arquivos de navegação

---

## §0. Estrutura reorganizada (28/jul/2026)

```
notebooks!/
├── 01-didaticos/              ← L0-L10: learning progression (executivos)
├── 02-canonicos/              ← nb-01..nb-15: pipeline prescritivo
├── 03-walkthroughs/           ← WL-0..WL-10: walkthrough visual dos L*
├── 04-docs/                    ← READMEs auxiliares
├── 05-outputs/                 ← outputs vazio (l* salva em ../outputs/learning/)
├── 06-scripts/                 ← _build*, _l*, create_learning_progression
├── 99-archive/                 ← checkpoints, cache, arquivos antigos
├── INDICE.md                   ← índice remissivo
├── LINHAGEM.md                 ← linhagem completa (roteiro vídeo 23min)
└── (este README)
```

---

## §1. Como navegar

| Você quer... | Vá para... |
|---|---|
| **Aprender Data Science do zero** (júnior 2h) | `01-didaticos/L0..L3/` |
| **Ver modelos preditivos aplicados** (pleno 4h) | `01-didaticos/L4..L8/` |
| **Entender a camada decisória** (sênior 3h) | `01-didaticos/L9..L10/` |
| **Executar a pipeline prescritiva** (avaliação de risco) | `02-canonicos/nb-01..nb-15/` |
| **Ver walkthrough visual de cada L*** | `03-walkthroughs/WL-*` |
| **Entender a arquitetura de uma decisão específica** | `02-canonicos/nb-XX-{topic}/` |
| **Ver scripts de build** | `06-scripts/` |

---

## §2. Quick reference — 11 notebooks didáticos (L0-L10)

| L | Conceito | Tempo | Path |
|---|---|---|---|
| L0 | Estatística Fundamental | 20 min | `01-didaticos/L0-statistics-fundamentals/` |
| L1 | Probabilidade e Incerteza | 25 min | `01-didaticos/L1-probability-uncertainty/` |
| L2 | Teste de Hipóteses | 20 min | `01-didaticos/L2-hypothesis-testing/` |
| L3 | Regressão Linear | 30 min | `01-didaticos/L3-linear-regression/` |
| L4 | Séries Temporais | 35 min | `01-didaticos/L4-time-series/` |
| L5 | Volatilidade e GARCH | 40 min | `01-didaticos/L5-volatility-garch/` |
| L6 | Monte Carlo | 45 min | `01-didaticos/L6-monte-carlo/` |
| L7 | Análise Multivariada | 40 min | `01-didaticos/L7-multivariate-analysis/` |
| L8 | Otimização | 35 min | `01-didaticos/L8-optimization/` |
| L9 | Teoria dos Jogos | 40 min | `01-didaticos/L9-game-theory/` |
| L10 | Framework de Decisão | 50 min | `01-didaticos/L10-decision-framework/` |

**Total L0-L10**: ~6.5 horas, com walkthroughs visuais = 8 horas.

---

## §3. Quick reference — 15 notebooks canônicos (nb-01..nb-15)

| # | Tópico | Output |
|---|---|---|
| nb-01 | PTAX + GARCH-t | `sigma PTAX 14.19%, half-life 73d` |
| nb-02 | Supply Chain HHI | `HHI bateria 4850` |
| nb-03 | Cenários regulatórios (BNDES) | `4 cenários (Rollback/Expansão/Hold/Cut)` |
| nb-04 | Game Theory 5 jogadores | `NASH E3, delta R$ 11.04bi` |
| nb-05 | Composite Index Radar | `composite 71.8/100` |
| nb-06 | Monte Carlo 4-choques | `VaR 95% R$ 6.43bi, CVaR R$ 8.04bi` |
| nb-07 | Interdependency Couplings | `20 couplings quantitativos` |
| nb-08 | Backtesting False Positives | `5/5 PERFEITO, FP 0%` |
| nb-08 (alt) | Monte Carlo Multivariado | `VaR multivariado` |
| nb-09 | Game Theory (consertado) | `NASH 5 players` |
| nb-10 | Decision Trees (consertado) | `12 árvores S3×S6` |
| nb-11 | Backtesting (consertado) | `5 stress events` |
| nb-12 | Sensitivity (consertado) | `tornado analysis` |
| nb-13 | Trigger Matrix | `30+ triggers, hysteresis` |
| nb-14 | NPV Layer | `live NPV calculation` |
| nb-15 | Final Dashboard (consertado) | `consolidado 11-dim` |

---

## §4. Quick reference — Walkthroughs visuais

Em `03-walkthroughs/`, há 11 docs `WL-0 a WL-10` que descrevem cada notebook L* em linguagem executiva. Cada WL tem:
- Visão geral do notebook (2 min)
- Estrutura narrativa (3 min)
- Conceitos centrais (5 min)
- Outputs e visualizações (3 min)
- Conexão com D2 base (2 min)
- Chef's tips + cross-links

---

## §5. Conexões com o restante do projeto

- **Base D2** (`d2-econometric-vulnerability/_study_notes/`): 29 docs didáticos L0-L6 + LABs + transversais
- **Base D3** (`analise-prescritiva/reports/decision-framework/_study_notes_d3/`): 9 docs do framework de decisão
- **Outputs lidos pelos NB***: NB-* leem de `outputs/nb01_results.json` a `outputs/nb15_results.json` (em `../outputs/`)

---

## §6. Status atual (28/jul/2026)

- ✅ **11 L* notebooks**: funcionam (todos testados via nbconvert --execute)
- ✅ **15 NB* notebooks**: 3 consertados via JSON parse (nb-09, nb-10, nb-15)
- ✅ **11 walkthroughs visuais** (03-walkthroughs/)
- ✅ **14 scripts de build** (06-scripts/)
- ⚠️ **Outputs lidos**: vazios por enquanto (l* precisa re-rodar)
- ✅ **Estrutura de pastas**: reorganizada em 7 sub-pastas

---

**Versão**: 1.0 — Estrutura reorganizada
**Data**: 28/jul/2026
**Mantido por**: programa de estudo D2/D3 + extension notebooks