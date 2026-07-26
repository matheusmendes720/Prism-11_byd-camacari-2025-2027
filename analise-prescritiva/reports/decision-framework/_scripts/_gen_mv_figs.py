#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
D3 v2.0 — Caminho C, C3: Multivariate Sensitivity (4 simultaneous shocks)
Monte Carlo simulation with Cholesky decomposition. Generates 8 figures.

Author: D3 v2.0 swarm (agent-C3)
Date: 21/jul/2026

Sign convention:
  - shock_i > 0 => bad for cost shocks (FX, Supply, Tariff), good for Demand
  - pnl_per_shock = shock * exposure * sign  (sign = -1 for costs, +1 for demand)
  - VaR(q) loss amount = -np.percentile(pnl, 100 - q)
    (i.e., VaR 95% = -P5 of P&L distribution; the 5% worst-case P&L negated)
  - CVaR(q) loss amount = -mean(pnl[pnl <= P(100-q)])
"""

import os
import json
import itertools
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import LinearSegmentedColormap

# --------------------------------------------------------------------------
# 0. Setup
# --------------------------------------------------------------------------
FIG_DIR = r"C:\Users\mathe\code_space\orchestration\value-factory\byd-camacari-2025-2027\reports\decision-framework\figures"
os.makedirs(FIG_DIR, exist_ok=True)
np.random.seed(42)

ANTV_BG       = "#14131C"
ANTV_PANEL    = "#1F1E2A"
ANTV_GRID     = "#2A2A3E"
ANTV_TEXT     = "#FFFFFF"
ANTV_TEXT_DIM = "#9CA3AF"
ANTV_BLUE     = "#5B8FF9"
ANTV_GREEN    = "#5AD8A6"
ANTV_YELLOW   = "#F6BD16"
ANTV_RED      = "#E8684A"
ANTV_CYAN     = "#6DC8EC"
ANTV_PURPLE   = "#9270CA"
ANTV_PINK     = "#FF99C3"
ANTV_ORANGE   = "#F6903D"
SHOCK_COLORS = {"FX": ANTV_BLUE, "Supply": ANTV_RED, "Tariff": ANTV_YELLOW, "Demand": ANTV_GREEN}
SHOCK_ORDER  = ["FX", "Supply", "Tariff", "Demand"]
SHOCK_PT = {
    "FX":     "FX (PTAX)",
    "Supply": "Lítio (supply)",
    "Tariff": "Tarifa",
    "Demand": "Demanda EV",
}

plt.rcParams.update({
    "figure.facecolor":  ANTV_BG, "axes.facecolor":    ANTV_PANEL,
    "axes.edgecolor":    ANTV_GRID, "axes.labelcolor":   ANTV_TEXT,
    "axes.titlecolor":   ANTV_TEXT, "xtick.color":       ANTV_TEXT,
    "ytick.color":       ANTV_TEXT, "text.color":        ANTV_TEXT,
    "font.family":       "DejaVu Sans", "font.size":       10,
    "axes.titlesize":    12, "axes.labelsize": 10, "xtick.labelsize": 9,
    "ytick.labelsize": 9, "legend.facecolor":  ANTV_PANEL,
    "legend.edgecolor":  ANTV_GRID, "legend.labelcolor": ANTV_TEXT,
    "grid.color":        ANTV_GRID, "grid.alpha":        0.4,
    "grid.linestyle":    "--", "savefig.facecolor":    ANTV_BG,
    "savefig.dpi":       150, "savefig.bbox":         "tight",
})

# --------------------------------------------------------------------------
# 1. Shocks definition
# --------------------------------------------------------------------------
N_PATHS  = 10_000
N_SHOCKS = 4

sigma_6m = {"FX": 0.112, "Supply": 0.95, "Tariff": 0.105, "Demand": 0.30}
var95_6m = {"FX": 2.74,  "Supply": 3.75, "Tariff": 5.25,  "Demand": 1.50}
exposures = {k: var95_6m[k] / (1.645 * sigma_6m[k]) for k in SHOCK_ORDER}
signs     = np.array([-1.0, -1.0, -1.0, +1.0])  # demand is upside

rho = np.array([
    [ 1.0,  0.4,  0.0, -0.2],
    [ 0.4,  1.0,  0.0,  0.0],
    [ 0.0,  0.0,  1.0, -0.3],
    [-0.2,  0.0, -0.3,  1.0],
])

L_chol = np.linalg.cholesky(rho)
Z      = np.random.standard_normal((N_PATHS, N_SHOCKS))
Z_corr = Z @ L_chol.T

sigmas_vec = np.array([sigma_6m[k] for k in SHOCK_ORDER])
shocks     = Z_corr * sigmas_vec

exp_vec        = np.array([exposures[k] for k in SHOCK_ORDER])
pnl_per_shock  = shocks * exp_vec * signs      # N_PATHS x 4
pnl_total      = pnl_per_shock.sum(axis=1)     # N_PATHS

# Helpers
def var_loss(pnl, q):
    """VaR(q) as positive loss amount."""
    return float(-np.percentile(pnl, 100 - q))
def cvar_loss(pnl, q):
    """CVaR / Expected Shortfall as positive loss amount."""
    cutoff = np.percentile(pnl, 100 - q)
    tail   = pnl[pnl <= cutoff]
    return float(-tail.mean()) if len(tail) else 0.0
def pct_pnl(pnl, q):
    """Return P&L value at q-th percentile (e.g., P5 = 5th percentile of P&L)."""
    return float(np.percentile(pnl, q))

# --------------------------------------------------------------------------
# 2. Pre-compute scenario payoffs
# --------------------------------------------------------------------------
single = {name: pnl_per_shock[:, i] for i, name in enumerate(SHOCK_ORDER)}

def pnl_combination(indices):
    idx = list(indices)
    return pnl_per_shock[:, idx].sum(axis=1) if idx else np.zeros(N_PATHS)

combos2 = [
    ((0, 1), "FX × Supply"),
    ((0, 2), "FX × Tariff"),
    ((0, 3), "FX × Demand"),
    ((1, 2), "Supply × Tariff"),
    ((1, 3), "Supply × Demand"),
    ((2, 3), "Tariff × Demand"),
]
two_shock = {name: pnl_combination(idx) for idx, name in combos2}

combos3 = [
    ((0, 1, 2), "FX × Supply × Tariff"),
    ((0, 1, 3), "FX × Supply × Demand"),
    ((0, 2, 3), "FX × Tariff × Demand"),
    ((1, 2, 3), "Supply × Tariff × Demand"),
]
three_shock = {name: pnl_combination(idx) for idx, name in combos3}

four_shock = pnl_combination((0, 1, 2, 3))

# Sim results summary
sim_results = {
    "N_paths": int(N_PATHS),
    "sigma_6m": sigma_6m,
    "var95_6m_input": var95_6m,
    "exposures_implied": exposures,
    "correlation_matrix": rho.tolist(),
    "pnl_distribution_4shock": {
        "P1_loss":  var_loss(pnl_total, 99),
        "P5_loss":  var_loss(pnl_total, 95),
        "P50_loss": var_loss(pnl_total, 50),
        "P95_loss": var_loss(pnl_total,  5),  # upside, negative loss = gain
        "P99_loss": var_loss(pnl_total,  1),
        "mean":     float(pnl_total.mean()),
        "std":      float(pnl_total.std()),
    },
    "scenario_VaR_95": {
        "FX":            var_loss(single["FX"], 95),
        "Supply":        var_loss(single["Supply"], 95),
        "Tariff":        var_loss(single["Tariff"], 95),
        "Demand":        var_loss(single["Demand"], 95),  # negative = upside
        "FX_Supply":     var_loss(two_shock["FX × Supply"], 95),
        "FX_Tariff":     var_loss(two_shock["FX × Tariff"], 95),
        "FX_Demand":     var_loss(two_shock["FX × Demand"], 95),
        "Sup_Tariff":    var_loss(two_shock["Supply × Tariff"], 95),
        "Sup_Demand":    var_loss(two_shock["Supply × Demand"], 95),
        "Tar_Demand":    var_loss(two_shock["Tariff × Demand"], 95),
        "FX_Sup_Tar":    var_loss(three_shock["FX × Supply × Tariff"], 95),
        "FX_Sup_Dem":    var_loss(three_shock["FX × Supply × Demand"], 95),
        "FX_Tar_Dem":    var_loss(three_shock["FX × Tariff × Demand"], 95),
        "Sup_Tar_Dem":   var_loss(three_shock["Supply × Tariff × Demand"], 95),
        "All4":          var_loss(four_shock, 95),
    },
    "scenario_VaR_99": {
        "FX":            var_loss(single["FX"], 99),
        "Supply":        var_loss(single["Supply"], 99),
        "Tariff":        var_loss(single["Tariff"], 99),
        "Demand":        var_loss(single["Demand"], 99),
        "All4":          var_loss(four_shock, 99),
    },
    "CVaR_4shock": {
        "P50": cvar_loss(pnl_total, 50),
        "P95": cvar_loss(pnl_total, 95),
        "P99": cvar_loss(pnl_total, 99),
    },
}
with open(os.path.join(FIG_DIR, "_mv_sim_results.json"), "w") as f:
    json.dump(sim_results, f, indent=2, default=float)

print("=" * 70)
print("D3 v2.0 C3 — Multivariate Sensitivity (Monte Carlo, 4 choques)")
print("=" * 70)
print(f"N paths: {N_PATHS}  ·  seed=42  ·  Cholesky 4x4")
print()
print("Exposures (R$ bi, VaR-implied via 1.645 * sigma):")
for k in SHOCK_ORDER:
    print(f"  {k:7s}  σ_6m={sigma_6m[k]:6.1%}  VaR95={var95_6m[k]:5.2f}bi  Exposure={exposures[k]:6.2f}bi")
print()
print("4-shock P&L distribution (R$ bi):")
print(f"  P99 loss (worst 1%)  = R$ {var_loss(pnl_total, 99):6.2f}bi  (CVaR99 = R$ {cvar_loss(pnl_total, 99):6.2f}bi)")
print(f"  P95 loss (worst 5%)  = R$ {var_loss(pnl_total, 95):6.2f}bi  (CVaR95 = R$ {cvar_loss(pnl_total, 95):6.2f}bi)")
print(f"  P50 (median)         = R$ {var_loss(pnl_total, 50):6.2f}bi")
print(f"  Mean / Std           = {pnl_total.mean():6.2f} / {pnl_total.std():5.2f} bi")

# --------------------------------------------------------------------------
# 3. FIGURE 1 — Correlation matrix heatmap
# --------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(7.5, 6.5))
im = ax.imshow(rho, cmap=LinearSegmentedColormap.from_list(
    "antv_div", [ANTV_RED, ANTV_PANEL, ANTV_GREEN]), vmin=-1, vmax=1)
ax.set_xticks(range(N_SHOCKS))
ax.set_yticks(range(N_SHOCKS))
ax.set_xticklabels([SHOCK_PT[s] for s in SHOCK_ORDER], rotation=20, ha="right")
ax.set_yticklabels([SHOCK_PT[s] for s in SHOCK_ORDER])
ax.set_title("Matriz de correlação (v2.0) — 4 choques\nCholesky input · Pearson ρ",
             color=ANTV_TEXT, pad=12)
for i in range(N_SHOCKS):
    for j in range(N_SHOCKS):
        v = rho[i, j]
        txt = f"{v:+.2f}"
        color = ANTV_TEXT if abs(v) < 0.5 else ANTV_BG
        weight = "bold" if i == j else "normal"
        ax.text(j, i, txt, ha="center", va="center", color=color,
                fontsize=12, fontweight=weight)
cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
cbar.ax.tick_params(colors=ANTV_TEXT)
cbar.set_label("ρ (correlação)", color=ANTV_TEXT)
ax.set_xticks(np.arange(N_SHOCKS) - 0.5, minor=True)
ax.set_yticks(np.arange(N_SHOCKS) - 0.5, minor=True)
ax.grid(which="minor", color=ANTV_BG, linewidth=2)
ax.tick_params(which="minor", length=0)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-1-correlation-matrix.png"))
plt.close()
print("\n[1/8] fig-d3-mv-1-correlation-matrix.png  OK")

# --------------------------------------------------------------------------
# 4. FIGURE 2 — P&L distribution (10k paths, 4-shock combined)
# --------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5.5))
counts, bins, patches = ax.hist(pnl_total, bins=80, edgecolor=ANTV_BG, linewidth=0.5)
for i, patch in enumerate(patches):
    center = (bins[i] + bins[i + 1]) / 2
    if center < 0:
        patch.set_facecolor(ANTV_RED)
    else:
        patch.set_facecolor(ANTV_GREEN)
    patch.set_alpha(0.85)
# VaR markers
p1, p5, p50, p95, p99 = np.percentile(pnl_total, [1, 5, 50, 95, 99])
markers = [
    (1,  ANTV_PURPLE, "P1",  f"VaR 99% = R$ {-p1:5.2f}bi"),
    (5,  ANTV_RED,    "P5",  f"VaR 95% = R$ {-p5:5.2f}bi"),
    (50, ANTV_YELLOW, "P50", f"Mediana = R$ {p50:5.2f}bi"),
    (95, ANTV_BLUE,   "P95", f"P95 = R$ {p95:5.2f}bi"),
    (99, ANTV_CYAN,   "P99", f"P99 = R$ {p99:5.2f}bi"),
]
for q, color, label, anno in markers:
    pv = np.percentile(pnl_total, q)
    ax.axvline(pv, color=color, linestyle="--", linewidth=1.5, alpha=0.85, label=anno)
    ax.text(pv, ax.get_ylim()[1] * 0.97, label, color=color, fontsize=8.5,
            ha="center", va="top", fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.18", facecolor=ANTV_PANEL, edgecolor=color))
ax.axvline(0, color=ANTV_TEXT, linewidth=1, alpha=0.4)
ax.set_xlabel("P&L combined 4-shock (R$ bi, 6m)  —  loss = negative, gain = positive")
ax.set_ylabel("Frequência (de 10.000 paths)")
ax.set_title("Distribuição P&L — Monte Carlo 10.000 paths · 4 choques simultâneos\n"
             "(FX, Lítio, Tarifa, Demanda) — Correlação ρ via Cholesky")
ax.legend(loc="upper right", fontsize=8.5, framealpha=0.92)
ax.grid(True, alpha=0.3)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-2-mc-distribution-pnp.png"))
plt.close()
print("[2/8] fig-d3-mv-2-mc-distribution-pnp.png  OK")

# --------------------------------------------------------------------------
# 5. FIGURE 3 — Tornado chart
# --------------------------------------------------------------------------
total_var95 = var_loss(pnl_total, 95)
var_excl = {}
for i, name in enumerate(SHOCK_ORDER):
    pnl_without = np.delete(pnl_per_shock, i, axis=1).sum(axis=1)
    var_excl[name] = var_loss(pnl_without, 95)
contribs = {name: total_var95 - var_excl[name] for name in SHOCK_ORDER}
sorted_c = sorted(contribs.items(), key=lambda x: x[1])
labels_s = [SHOCK_PT[k] for k, _ in sorted_c]
values_s = [v for _, v in sorted_c]
colors_s = [SHOCK_COLORS[k] for k, _ in sorted_c]

fig, ax = plt.subplots(figsize=(9, 5))
y_pos = np.arange(len(sorted_c))
bars  = ax.barh(y_pos, values_s, color=colors_s, edgecolor=ANTV_BG, alpha=0.92)
ax.set_yticks(y_pos)
ax.set_yticklabels(labels_s)
ax.set_xlabel("Contribuição marginal ao VaR 95% 6m (R$ bi)")
ax.set_title("Tornado — contribuição marginal de cada choque ao VaR 95% 6m\n"
             f"(VaR 95% 4-shock total = R$ {total_var95:.2f}bi)")
ax.axvline(0, color=ANTV_GRID, linewidth=0.5)
ax.grid(True, axis="x", alpha=0.3)
for b, v in zip(bars, values_s):
    ax.text(v + 0.1, b.get_y() + b.get_height() / 2, f"+R$ {v:.2f}bi",
            va="center", color=ANTV_TEXT, fontsize=10, fontweight="bold")
ax.text(0.98, 0.05, f"Total: R$ {total_var95:.2f}bi",
        transform=ax.transAxes, ha="right", va="bottom",
        bbox=dict(boxstyle="round,pad=0.3", facecolor=ANTV_PANEL, edgecolor=ANTV_YELLOW),
        color=ANTV_YELLOW, fontweight="bold")
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-3-tornado-shock-contribution.png"))
plt.close()
print("[3/8] fig-d3-mv-3-tornado-shock-contribution.png  OK")

# --------------------------------------------------------------------------
# 6. FIGURE 4 — 2D scatter
# --------------------------------------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
for ax, shock_idx, shock_name in [
    (axes[0], 0, "FX (PTAX)"),
    (axes[1], 1, "Lítio (Supply)"),
]:
    sc = ax.scatter(shocks[:, shock_idx] * 100, pnl_total,
                    c=pnl_total, cmap=LinearSegmentedColormap.from_list(
                        "antv_div2", [ANTV_RED, ANTV_PANEL, ANTV_GREEN]),
                    s=5, alpha=0.55, edgecolors="none")
    ax.axhline(0, color=ANTV_GRID, linewidth=0.5)
    ax.axvline(0, color=ANTV_GRID, linewidth=0.5)
    var95 = var_loss(pnl_total, 95)
    ax.axhline(-var95, color=ANTV_RED, linestyle="--", linewidth=1.2, alpha=0.7,
               label=f"VaR 95% = R$ {var95:.2f}bi")
    ax.set_xlabel(f"Choque {shock_name}  —  Δ%  (1σ_6m = {sigma_6m[SHOCK_ORDER[shock_idx]]*100:.1f}%)")
    ax.set_ylabel("P&L total 4-shock (R$ bi)")
    ax.set_title(f"P&L vs choque {shock_name}")
    ax.legend(loc="lower left", fontsize=9)
    ax.grid(True, alpha=0.3)
    cbar = plt.colorbar(sc, ax=ax)
    cbar.set_label("P&L (R$ bi)", color=ANTV_TEXT)
    cbar.ax.tick_params(colors=ANTV_TEXT)
plt.suptitle("2D scatter — P&L (4-shock) vs choque individual  (10.000 paths)",
             color=ANTV_TEXT, fontsize=13, y=1.02)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-4-2d-scatter-fx-supply.png"))
plt.close()
print("[4/8] fig-d3-mv-4-2d-scatter-fx-supply.png  OK")

# --------------------------------------------------------------------------
# 7. FIGURE 5 — Scenario payoffs bar chart
# --------------------------------------------------------------------------
scenarios, labels = [], []
for n in SHOCK_ORDER:
    scenarios.append(single[n])
    labels.append(SHOCK_PT[n])
for name, arr in two_shock.items():
    scenarios.append(arr)
    labels.append(name)
for name, arr in three_shock.items():
    scenarios.append(arr)
    labels.append(name)
scenarios.append(four_shock)
labels.append("4-shock (full)")

p50s  = [np.percentile(s, 50) for s in scenarios]
p95s  = [np.percentile(s, 95) for s in scenarios]   # upside tail (5% best)
p99s  = [np.percentile(s, 99) for s in scenarios]
means = [s.mean() for s in scenarios]
x = np.arange(len(labels))

fig, ax = plt.subplots(figsize=(13, 5.5))
w = 0.21
ax.bar(x - 1.5*w, means, w, color=ANTV_CYAN,   label="Mean",   edgecolor=ANTV_BG)
ax.bar(x - 0.5*w, p50s,  w, color=ANTV_BLUE,   label="P50",    edgecolor=ANTV_BG)
ax.bar(x + 0.5*w, p95s,  w, color=ANTV_YELLOW, label="P95",    edgecolor=ANTV_BG)
ax.bar(x + 1.5*w, p99s,  w, color=ANTV_RED,    label="P99",    edgecolor=ANTV_BG)
ax.axhline(0, color=ANTV_GRID, linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=35, ha="right", fontsize=9)
ax.set_ylabel("P&L (R$ bi)  —  loss = negative, gain = positive")
ax.set_title("Payoff por cenário — 4 single + 6 two-shock + 4 three-shock + 1 four-shock\n"
             "(Barras P95/P99 mostram upside — quanto maior a barra, mais upside)")
ax.legend(loc="lower right", ncol=4, fontsize=9)
ax.grid(True, axis="y", alpha=0.3)
ax.axvline(3.5,  color=ANTV_GRID, linestyle=":", linewidth=1, alpha=0.6)
ax.axvline(9.5,  color=ANTV_GRID, linestyle=":", linewidth=1, alpha=0.6)
ymax = ax.get_ylim()[1]
ax.text(2,  ymax*0.96, "Single",  ha="center", color=ANTV_TEXT_DIM, fontsize=10)
ax.text(6.5,ymax*0.96, "2-shock", ha="center", color=ANTV_TEXT_DIM, fontsize=10)
ax.text(12, ymax*0.96, "3-shock", ha="center", color=ANTV_TEXT_DIM, fontsize=10)
ax.text(14.3,ymax*0.96, "4-shock", ha="center", color=ANTV_TEXT_DIM, fontsize=10)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-5-scenario-payoffs.png"))
plt.close()
print("[5/8] fig-d3-mv-5-scenario-payoffs.png  OK")

# --------------------------------------------------------------------------
# 8. FIGURE 6 — Worst-case scenarios table
# --------------------------------------------------------------------------
all_scenarios = list(zip(labels, scenarios))
ranked_by_var95 = sorted(all_scenarios, key=lambda x: -var_loss(x[1], 95))
top5 = ranked_by_var95[:5]

fig, ax = plt.subplots(figsize=(11, 6.0))
ax.axis("off")
ax.set_title("Top 5 worst-case scenarios por VaR 95% 6m\n(Perdas em R$ bi — números positivos = loss)",
             color=ANTV_TEXT, fontsize=13, pad=12, loc="left")

table_data = []
for name, arr in top5:
    v95  = var_loss(arr, 95)
    v99  = var_loss(arr, 99)
    mean = arr.mean()
    std  = arr.std()
    table_data.append([name, f"{mean:6.2f}", f"{v95:6.2f}", f"{v99:6.2f}", f"{std:5.2f}"])

table = ax.table(
    cellText=table_data,
    colLabels=["Cenário", "Mean (R$ bi)", "VaR 95% (R$ bi)", "VaR 99% (R$ bi)", "Std (R$ bi)"],
    loc="center", cellLoc="center",
    colWidths=[0.32, 0.16, 0.18, 0.18, 0.14],
)
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 2.0)
max_v95 = max(float(r[2]) for r in table_data)
for (i, j), cell in table.get_celld().items():
    cell.set_edgecolor(ANTV_GRID)
    if i == 0:
        cell.set_facecolor(ANTV_BG)
        cell.set_text_props(color=ANTV_TEXT, fontweight="bold")
    else:
        v95_val = float(table_data[i-1][2])
        intensity = min(v95_val / max_v95, 1.0) * 0.7
        # Interpolate from panel dark to red-ish
        r = 0x1F/255 + intensity * (0xE8/255 - 0x1F/255)
        g = 0x1E/255 + intensity * (0x68/255 - 0x1E/255)
        b = 0x2A/255 + intensity * (0x4A/255 - 0x2A/255)
        cell.set_facecolor((min(r, 1.0), min(g, 1.0), min(b, 1.0), 1.0))
        cell.set_text_props(color=ANTV_TEXT)
ax.text(0.5, 0.04,
        "Fonte: Monte Carlo 10.000 paths · Cholesky decomp. · VaR 95% = loss no P5 da distribuição.",
        ha="center", color=ANTV_TEXT_DIM, fontsize=9, transform=ax.transAxes)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-6-worst-case-scenarios.png"))
plt.close()
print("[6/8] fig-d3-mv-6-worst-case-scenarios.png  OK")

# Best 5 (upside — for the report)
bottom5 = ranked_by_var95[-5:]
print("  Top 5 worst (per scenario, desc by VaR95):")
for nm, arr in top5:
    print(f"    {nm:35s} VaR95=R$ {var_loss(arr, 95):5.2f}bi  Mean=R$ {arr.mean():5.2f}bi")

# --------------------------------------------------------------------------
# 9. FIGURE 7 — Conditional VaR curve
# --------------------------------------------------------------------------
qs   = [50, 60, 70, 75, 80, 85, 90, 92, 95, 97, 99]
vars_q = [var_loss(pnl_total, q) for q in qs]
cvars  = [cvar_loss(pnl_total, q) for q in qs]

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(qs, vars_q, marker="o", color=ANTV_BLUE, linewidth=2.2,
        label="VaR (loss no percentil q)", markersize=5)
ax.plot(qs, cvars,  marker="s", color=ANTV_RED,  linewidth=2.2,
        label="CVaR / Expected Shortfall (loss dado breach VaR)", markersize=5)
ax.fill_between(qs, vars_q, cvars, color=ANTV_RED, alpha=0.15, label="Tail premium (CVaR − VaR)")
i95 = list(qs).index(95)
ax.scatter([95], [vars_q[i95]], s=140, color=ANTV_YELLOW, zorder=5, edgecolor=ANTV_BG, linewidth=2)
ax.scatter([95], [cvars[i95]],  s=140, color=ANTV_ORANGE, zorder=5, edgecolor=ANTV_BG, linewidth=2)
ax.annotate(f"VaR 95% = R$ {vars_q[i95]:.2f}bi", xy=(95, vars_q[i95]),
            xytext=(80, vars_q[i95] + 1.0), color=ANTV_YELLOW, fontsize=9, fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=ANTV_YELLOW))
ax.annotate(f"CVaR 95% = R$ {cvars[i95]:.2f}bi", xy=(95, cvars[i95]),
            xytext=(78, cvars[i95] - 1.5), color=ANTV_ORANGE, fontsize=9, fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=ANTV_ORANGE))
ax.set_xlabel("Percentil q")
ax.set_ylabel("Loss (R$ bi)")
ax.set_title("Curva VaR e CVaR (Expected Shortfall) — 4 choques combinados\n"
             "CVaR > VaR sempre — mede a loss média dado que o VaR foi violado")
ax.legend(loc="upper left", fontsize=9)
ax.grid(True, alpha=0.3)
ax.set_xticks([50, 70, 80, 90, 95, 99])
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-7-conditional-var-pdf.png"))
plt.close()
print("[7/8] fig-d3-mv-7-conditional-var-pdf.png  OK")

# --------------------------------------------------------------------------
# 10. FIGURE 8 — Stress conditional heatmap (16 subsets)
# --------------------------------------------------------------------------
n_combos = 16
cond_var = np.zeros((n_combos, 4))
combo_labels = []
for mask in itertools.product([0, 1], repeat=4):
    indices = [i for i, b in enumerate(mask) if b == 1]
    pnl = pnl_combination(indices)
    cond_var[len(combo_labels)] = [
        var_loss(pnl, 50),
        var_loss(pnl, 95),
        var_loss(pnl, 99),
        pnl.mean(),
    ]
    label = "·".join([SHOCK_ORDER[i][:1] for i in indices]) if indices else "—"
    combo_labels.append(label)
order = np.argsort(-cond_var[:, 1])
cond_sorted = cond_var[order]
combo_labels_sorted = [combo_labels[i] for i in order]

fig, ax = plt.subplots(figsize=(9, 7.5))
im = ax.imshow(cond_sorted, cmap="magma", aspect="auto")
ax.set_xticks(range(4))
ax.set_xticklabels(["P50", "P95", "P99", "Mean"])
ax.set_yticks(range(n_combos))
ax.set_yticklabels(combo_labels_sorted, fontsize=9)
ax.set_title("Stress conditional — VaR por subset de choques (R$ bi)\n"
             "Ordenado por P95 desc — 16 combinações possíveis (2⁴)",
             color=ANTV_TEXT, pad=12)
vmax = cond_sorted.max()
for i in range(n_combos):
    for j in range(4):
        val = cond_sorted[i, j]
        color = ANTV_TEXT if val < vmax * 0.55 else ANTV_BG
        ax.text(j, i, f"{val:6.2f}", ha="center", va="center",
                color=color, fontsize=8.5)
legend_elements = [
    mpatches.Patch(color=ANTV_BLUE,   label="F = FX"),
    mpatches.Patch(color=ANTV_RED,    label="S = Supply (Lítio)"),
    mpatches.Patch(color=ANTV_YELLOW, label="T = Tariff"),
    mpatches.Patch(color=ANTV_GREEN,  label="D = Demand"),
]
ax.legend(handles=legend_elements, loc="upper right", bbox_to_anchor=(1.32, 1.0),
          fontsize=9, framealpha=0.92)
cbar = fig.colorbar(im, ax=ax, fraction=0.04, pad=0.02)
cbar.ax.tick_params(colors=ANTV_TEXT)
cbar.set_label("Loss (R$ bi)", color=ANTV_TEXT)
plt.savefig(os.path.join(FIG_DIR, "fig-d3-mv-8-stress-conditional-by-shock.png"))
plt.close()
print("[8/8] fig-d3-mv-8-stress-conditional-by-shock.png  OK")

print("\n" + "=" * 70)
print("ALL 8 FIGURES + sim_results.json generated.")
print("=" * 70)
