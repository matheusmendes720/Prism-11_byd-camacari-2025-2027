# 02-canonicos — Pipeline Prescritivo NB-01 a NB-15

15 notebooks canônicos que implementam a pipeline prescritiva completa do BYD Camaçari 2025-2027. Cada NB tem:
- `.ipynb` (executável)
- `.py` (código-fonte plain Python, gerado a partir do .ipynb)
- `.md` (apenas nb-13 tem; opcional)

## Estrutura (16 sub-pastas)

| # | Notebook | Output canônico |
|---|---|---|
| nb-01 | PTAX + GARCH-t | `sigma PTAX 14.19%, half-life 73d` |
| nb-02 | Supply Chain HHI | `HHI bateria 4850` |
| nb-03 | Cenários regulatórios (BNDES) | `4 cenários` |
| nb-04 | Game Theory 5 jogadores | `NASH E3` |
| nb-05 | Composite Index Radar | `composite 71.8/100` |
| nb-06 | Monte Carlo 4-choques | `VaR R$ 6.43bi, CVaR R$ 8.04bi` |
| nb-07 | Interdependency Couplings | `20 couplings quantitativos` |
| nb-08 (a) | Backtesting False Positives | `5/5 PERFEITO, FP 0%` |
| nb-08 (b) | Monte Carlo Multivariado | `VaR multivariado` |
| nb-09 | Game Theory (consertado) | `NASH 5 players` |
| nb-10 | Decision Trees (consertado) | `12 árvores S3×S6` |
| nb-11 | Backtesting (consertado) | `5 stress events` |
| nb-12 | Sensitivity (consertado) | `tornado analysis` |
| nb-13 | Trigger Matrix | `30+ triggers, hysteresis` |
| nb-14 | NPV Layer | `live NPV calculation` |
| nb-15 | Final Dashboard (consertado) | `consolidado 11-dim` |

## Como executar

```bash
cd 02-canonicos/nb-01-ptax-garch/
jupyter nbconvert --to notebook --execute nb-01-ptax-garch.ipynb --inplace
```

## Outputs salvos em

Cada NB salva outputs em `../../outputs/`:
- `nb01_results.json` (e similar para cada nb)
- HTMLs Plotly
- PNGs estáticos
- CSVs intermediários

## Conexões

- **Notebooks didáticos L***: `../01-didaticos/L*` (aprendizado progressivo)
- **Base D3**: `../../reports/decision-framework/` (consome outputs dos NB-*)
- **Scripts de build**: `../06-scripts/`