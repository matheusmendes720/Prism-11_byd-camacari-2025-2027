"""L10 assembler — concatena Parts A, B e C em l10-decision-framework.ipynb.

Mantem a metadata compativel com L8 / L9 e a contagem de cells documentada
no caderno (header + setup + 8 sections + export + closing = 18 cells
no nivel narrativo; uma celula extra por section de plot).
"""

import json
from pathlib import Path

from _l10_content_a import CELLS_A
from _l10_content_b import CELLS_B
from _l10_content_c import CELLS_C

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
OUT_PATH = NOTEBOOK_ROOT / "learning" / "l10-decision-framework.ipynb"
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)


def to_nb(cells_in):
    """Converte (cell_type, source) tuples para o schema do notebook (nbformat 4)."""
    out = []
    for ctype, src in cells_in:
        cell = {"cell_type": ctype, "metadata": {}, "source": src.splitlines(keepends=True)}
        if ctype == "code":
            cell["execution_count"] = None
            cell["outputs"] = []
        out.append(cell)
    return out


cells = to_nb(CELLS_A) + to_nb(CELLS_B) + to_nb(CELLS_C)

notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {
            "name": "python",
            "version": "3.11",
            "mimetype": "text/x-python",
            "file_extension": ".py",
            "pygments_lexer": "ipython3",
        },
    },
    "nbformat": 4,
    "nbformat_minor": 5,
}

with OUT_PATH.open("w", encoding="utf-8") as f:
    json.dump(notebook, f, indent=1, ensure_ascii=False)

md = sum(1 for c in cells if c["cell_type"] == "markdown")
code = sum(1 for c in cells if c["cell_type"] == "code")
print(f"L10 assembled -> {OUT_PATH}")
print(f"  {len(cells)} cells ({md} markdown · {code} code)")
print(f"  tamanho: {OUT_PATH.stat().st_size:,} bytes".replace(",", "."))
