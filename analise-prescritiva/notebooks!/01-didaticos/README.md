# 01-didaticos — Learning Progression L0-L10

11 notebooks didáticos projetados para ensinar Ciência de Dados aplicada ao caso BYD Camaçari 2025-2027 para **executivos**.

## Estrutura

| Pasta | Conceito | Duração estimada |
|---|---|---|
| `L0-statistics-fundamentals/` | Média, variância, percentis, correlação | 20 min |
| `L1-probability-uncertainty/` | Probabilidade, valor esperado, Bayes | 25 min |
| `L2-hypothesis-testing/` | P-valor, intervalos de confiança, A/B | 20 min |
| `L3-linear-regression/` | Coeficientes, R², regressão múltipla | 30 min |
| `L4-time-series/` | Tendência, sazonalidade, stationarity | 35 min |
| `L5-volatility-garch/` | Vol clustering, GARCH(1,1), VaR/CVaR | 40 min |
| `L6-monte-carlo/` | Simulação, paths, distribuições | 45 min |
| `L7-multivariate-analysis/` | Correlação, PCA, fatores | 40 min |
| `L8-optimization/` | Função objetivo, restrições, ótimo | 35 min |
| `L9-game-theory/` | Players, payoffs, NASH equilibrium | 40 min |
| `L10-decision-framework/` | Composite score, triggers, NPV | 50 min |

## Formato narrativo

Cada notebook segue o template:
1. Conceito (linguagem executiva)
2. Intuição (analogia do cotidiano)
3. Matemática (fórmula + explicação)
4. Código (executável)
5. Recado executivo (1 frase + 1 número + 1 pergunta)

## Como executar

Para executar um notebook individual:
```bash
cd 01-didaticos/L5-volatility-garch/
jupyter nbconvert --to notebook --execute l5-volatility-garch.ipynb --inplace
```

Ou abrir com Jupyter Lab:
```bash
jupyter lab
```

## Outputs

Os notebooks salvam outputs em `../../outputs/learning/` (HTML interativos + PNGs estáticos).

## Conexões

- **Walkthrough visual**: `../03-walkthroughs/WL-0` a `WL-10` (docs narrativos)
- **Base D2 didática**: `../../../d2-econometric-vulnerability/_study_notes/` (mais profundo)
- **Notebooks canônicos**: `../02-canonicos/nb-*` (implementações finais)