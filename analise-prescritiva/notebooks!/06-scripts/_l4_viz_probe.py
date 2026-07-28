"""Probe: replay L4 notebook setup + analysis cells, then run the new PNG viz body.

Throwaway harness — validates the viz code before it is injected into the .ipynb.
"""
import json
import os
from pathlib import Path

# Headless: never let plt.show()/fig.show() block the probe.
os.environ["MPLBACKEND"] = "Agg"
import matplotlib
matplotlib.use("Agg", force=True)
import matplotlib.pyplot as _plt
_plt.show = lambda *a, **k: None

import plotly.io as _pio
_pio.renderers.default = "json"

ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
NB = ROOT / "notebooks!" / "l4-time-series.ipynb"

nb = json.loads(NB.read_text(encoding="utf-8"))
code_cells = [c for c in nb["cells"] if c["cell_type"] == "code"]

ns = {"__name__": "__main__"}

# Replay every existing code cell except the JSON-export cell (last one),
# so all analysis variables (ptax_s, vendas_s, mm12, beta1, fator, fc, ...) exist.
for i, c in enumerate(code_cells[:-1]):
    src = "".join(c["source"])
    src = src.replace("fig.show()", "pass  # fig.show() suppressed in probe")
    exec(compile(src, f"<nb_code_cell_{i}>", "exec"), ns)

print("\n=== replay OK · vars available ===")
for k in ("ptax_s", "vendas_s", "mm12", "beta1", "beta0", "reta", "deriva_ano",
          "fator", "nomes", "mm_v", "detrend", "fc", "lo", "hi", "idx_fc", "H"):
    print(f"  {k}: {'YES' if k in ns else 'MISSING'}")

print("\n=== running viz body ===")
body = (ROOT / "_l4_viz_body.py").read_text(encoding="utf-8")
exec(compile(body, "<l4_viz_body>", "exec"), ns)
print("\n=== viz body OK ===")
