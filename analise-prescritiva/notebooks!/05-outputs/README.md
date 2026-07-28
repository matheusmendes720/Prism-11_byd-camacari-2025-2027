# 05-outputs — Outputs gerados pelos notebooks

Outputs HTML, PNG e JSON produzidos pelos notebooks L* e NB-*.

## Estrutura

- `learning/` — outputs HTML/PNG dos notebooks L* didáticos
  - `l9-01-strategic-vs-optimization.html`
  - `l5_payoff_heatmap.png`
  - `l10_decision_framework.html`
  - ...etc

## Status atual

⚠️ **Vazio por enquanto** — quando você re-executa os notebooks L*, eles salvam outputs aqui.

## Para popular

```bash
# Executar todos os L* para gerar outputs
cd ../
for nb in 01-didaticos/L*/l*.ipynb; do
  jupyter nbconvert --to notebook --execute "$nb" --inplace
done
```

Os notebooks salvam outputs em `05-outputs/learning/` automaticamente (path `Path.cwd() / "outputs" / "learning"`).

## Onde os outputs são consumidos

- **D3 framework** (`reports/decision-framework/_study_notes_d3/`) lê `outputs/nb01_results.json` etc.
- **D2 base didática** (`d2-econometric-vulnerability/_study_notes/`) cita números canônicos dos outputs.
- **L* walkthroughs** referenciam os HTMLs gerados.