# 06-scripts — Scripts de build

Scripts Python usados para construir os notebooks L* e NB-* (geradores, montadores, story addons).

## Lista de scripts (14 arquivos)

| Script | Tamanho | Função |
|---|---|---|
| `_build_l7.py` | 60 KB | Builder para L7 (multivariate) |
| `_build_nb12.py` | 31 KB | Builder para NB-12 (sensitivity) |
| `_l10_assemble.py` | 2 KB | Assembler para L10 |
| `_l10_content_a.py` | 30 KB | Conteúdo parte A de L10 |
| `_l10_content_b.py` | 21 KB | Conteúdo parte B de L10 |
| `_l10_content_c.py` | 38 KB | Conteúdo parte C de L10 |
| `_l10_story_addon.py` | 16 KB | Story addon para L10 |
| `_l4_probe.log` | 3 KB | Log de probe L4 |
| `_l4_viz_body.py` | 13 KB | Viz body para L4 |
| `_l4_viz_probe.py` | 2 KB | Viz probe para L4 |
| `_l6_story_addon.py` | 12 KB | Story addon para L6 |
| `_l7_story_addon.py` | 18 KB | Story addon para L7 |
| `_l9_story_addon.py` | 25 KB | Story addon para L9 |
| `create_learning_progression.py` | 11 KB | Cria a learning progression L0-L10 |

## Status

**Não essenciais** para executar os notebooks já construídos. Se você quiser **modificar** um notebook, edite o `.ipynb` diretamente ou use `jupytext` para round-trip.

## Como usar para rebuild (avançado)

```bash
cd ../
python 06-scripts/create_learning_progression.py  # regenera L0-L10
python 06-scripts/_build_l7.py                    # regenera só L7
```