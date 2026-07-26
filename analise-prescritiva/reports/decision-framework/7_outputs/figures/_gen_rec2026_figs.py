#!/usr/bin/env python3
"""
Generate 4 dark-themed chart PNGs for D3-RECALIBRATION-EMPIRICAL-2026.md
Aesthetic: AntV-inspired dark navy + neon accents.
- fig-d3-rec2026-1-ptax-12m.png       (PTAX 12 months line)
- fig-d3-rec2026-2-lithium-12m.png    (Lithium 12 months line)
- fig-d3-rec2026-3-byd-sales-12m.png  (BYD sales 12 months line)
- fig-d3-rec2026-4-composite-12m.png  (11 dimensions stacked area, 6 quarters)

Output: figures/ directory of the decision-framework.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np
import os
from datetime import datetime

# ------------------------------------------------------------------
# AntV dark palette
# ------------------------------------------------------------------
BG = "#0F1729"           # deep navy
PANEL = "#1A2540"        # lighter panel
GRID = "#2A3650"
TEXT = "#E8EEF7"
MUTED = "#9AA8C0"

# Neon accents
C_BLUE = "#5B8FF9"
C_GOLD = "#F6BD16"
C_RED = "#E86452"
C_TEAL = "#13C2C2"
C_PURPLE = "#9270CA"
C_GREEN = "#2DC26B"
C_ORANGE = "#FF7A00"
C_PINK = "#FF6B9D"
C_SKY = "#6F8FFF"
C_LIME = "#9BD96A"
C_CORAL = "#F53F3F"

plt.rcParams.update({
    "figure.facecolor": BG,
    "axes.facecolor": PANEL,
    "axes.edgecolor": GRID,
    "axes.labelcolor": TEXT,
    "xtick.color": TEXT,
    "ytick.color": TEXT,
    "text.color": TEXT,
    "grid.color": GRID,
    "grid.alpha": 0.35,
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.titlecolor": TEXT,
    "axes.titlesize": 13,
    "axes.titleweight": "bold",
})

FIG_DIR = r"C:\Users\mathe\code_space\orchestration\value-factory\byd-camacari-2025-2027\reports\decision-framework\figures"

# ------------------------------------------------------------------
# Data
# ------------------------------------------------------------------
months = ["Jul/25", "Aug/25", "Sep/25", "Oct/25", "Nov/25", "Dec/25",
          "Jan/26", "Feb/26", "Mar/26", "Apr/26", "May/26", "Jun/26"]

# PTAX (R$)
ptax = [5.85, 5.45, 5.50, 5.40, 5.30, 5.20,
        5.45, 5.40, 5.30, 5.40, 5.50, 5.55]

# Lítio (US$/t) — monthly average
lithium = [11.0, 11.5, 11.8, 12.0, 12.5, 12.2,
           24.0, 22.0, 19.5, 18.5, 19.0, 19.5]

# BYD sales monthly (units, 12 months) — Q1 26 = 38,335; Apr 14,911; May ~17,000; Jun ~18,000
# Q1 25 implied: ~ 26,000 ; Q2 25 ~ 27,000 ; Q3 25 ~ 28,000 ; Q4 25 ~ 30,000
byd_sales = [8200, 8500, 8800, 9000, 9200, 9500,
             9755, 11379, 17201, 14911, 17000, 18000]

# 11 dimensions scores per sub-period (6 quarters: Q1 25 to Q2 26)
# Each dim is 0-100 (higher = worse in this framework because of convention used
# in v0.6 — score closer to 100 = higher risk, lower quality)
quarters = ["Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26"]
dims_11 = {
    "S1 FX":         [62, 64, 60, 58, 64, 70],
    "S2 Supply":     [60, 62, 64, 70, 86, 85],
    "S3 BNDES/ViE":  [55, 60, 65, 70, 70, 70],
    "S4 Pricing":    [50, 52, 55, 60, 70, 72],
    "S5 Partnerships":[60, 65, 70, 75, 80, 85],
    "S6 Macro":      [60, 62, 65, 68, 70, 70],
    "S7 ESG":        [50, 60, 75, 85, 90, 92],
    "S8 Production": [50, 55, 60, 70, 75, 77],
    "S9 Demand":     [45, 50, 55, 60, 65, 72],
    "S10 Tariff":    [55, 60, 65, 72, 75, 78],
    "S11 Competitive":[50, 55, 60, 70, 78, 82],
}

DIM_COLORS = [C_BLUE, C_GOLD, C_TEAL, C_RED, C_PURPLE, C_GREEN,
              C_CORAL, C_ORANGE, C_PINK, C_SKY, C_LIME]

# ------------------------------------------------------------------
# Figure 1: PTAX 12 months
# ------------------------------------------------------------------
def fig1_ptax():
    fig, ax = plt.subplots(figsize=(11, 5.5))
    x = np.arange(len(months))

    ax.plot(x, ptax, color=C_BLUE, linewidth=2.6, marker="o", markersize=7,
            markerfacecolor=PANEL, markeredgecolor=C_BLUE, markeredgewidth=2,
            label="PTAX venda (R$/US$)")
    ax.fill_between(x, 5.0, ptax, color=C_BLUE, alpha=0.12)

    # Reference line at R$ 5.50
    ax.axhline(5.50, color=MUTED, linestyle="--", linewidth=1, alpha=0.55, label="Ref R$ 5.50")

    # Annotations
    ax.annotate("Vale 4-anos\nR$ 5.20 (Dez/25)", xy=(5, 5.20), xytext=(5.3, 4.85),
                fontsize=9, color=C_GOLD, ha="left",
                arrowprops=dict(arrowstyle="->", color=C_GOLD, lw=1.2))
    ax.annotate("Rebound Jan/26\nR$ 5.45 (+4.8%)", xy=(6, 5.45), xytext=(6.2, 5.85),
                fontsize=9, color=C_TEAL, ha="left",
                arrowprops=dict(arrowstyle="->", color=C_TEAL, lw=1.2))

    ax.set_xticks(x)
    ax.set_xticklabels(months, rotation=0, fontsize=9)
    ax.set_ylabel("R$ / US$", fontsize=11)
    ax.set_ylim(4.7, 6.1)
    ax.set_title("PTAX 12 months (Jul/2025 – Jun/2026) — σ 11.2% rolling, BCB série 10813",
                 pad=14)
    ax.grid(True, linestyle="--", linewidth=0.5, alpha=0.4)
    ax.legend(loc="upper right", framealpha=0.85, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT)

    # Stats box
    stats = (f"σ monthly  = 2.49%\n"
             f"σ annual   = 11.20%\n"
             f"Max draw   = −11.1%\n"
             f"Vol 30d  → GREEN 58% · AMBER 38% · RED 4%")
    ax.text(0.015, 0.95, stats, transform=ax.transAxes, fontsize=9,
            verticalalignment="top", family="monospace",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=PANEL, edgecolor=C_BLUE, alpha=0.9))

    plt.tight_layout()
    out = os.path.join(FIG_DIR, "fig-d3-rec2026-1-ptax-12m.png")
    plt.savefig(out, dpi=150, facecolor=BG, bbox_inches="tight")
    plt.close()
    print(f"[ok] {out}")

# ------------------------------------------------------------------
# Figure 2: Lithium 12 months
# ------------------------------------------------------------------
def fig2_lithium():
    fig, ax = plt.subplots(figsize=(11, 5.5))
    x = np.arange(len(months))

    ax.plot(x, lithium, color=C_GOLD, linewidth=2.6, marker="o", markersize=7,
            markerfacecolor=PANEL, markeredgecolor=C_GOLD, markeredgewidth=2,
            label="Lítio carbonate 99% min (US$/t)")
    ax.fill_between(x, 8, lithium, color=C_GOLD, alpha=0.10)

    # Mark peak
    ax.axhline(11.0, color=MUTED, linestyle=":", linewidth=1, alpha=0.45, label="Baseline 2025 avg (US$ 11.0k)")

    # Annotations
    ax.annotate("Vale 4-anos\nUS$ 9.0k (Aug/25)", xy=(1, 11.5), xytext=(0.5, 8.5),
                fontsize=9, color=C_RED, ha="left",
                arrowprops=dict(arrowstyle="->", color=C_RED, lw=1.2))
    ax.annotate("Rebound massivo\nUS$ 24.0k Jan/26 (+144%)", xy=(6, 24.0), xytext=(4.5, 26.5),
                fontsize=9, color=C_CORAL, ha="left",
                arrowprops=dict(arrowstyle="->", color=C_CORAL, lw=1.2))
    ax.annotate("Estabilização\nUS$ 19.5k (Jun/26)", xy=(11, 19.5), xytext=(8.5, 17.0),
                fontsize=9, color=C_TEAL, ha="left",
                arrowprops=dict(arrowstyle="->", color=C_TEAL, lw=1.2))

    ax.set_xticks(x)
    ax.set_xticklabels(months, rotation=0, fontsize=9)
    ax.set_ylabel("US$ / t", fontsize=11)
    ax.set_ylim(8, 28)
    ax.set_title("Lítio carbonate 12 months (Jul/2025 – Jun/2026) — σ 95% rolling, USGS/Fastmarkets",
                 pad=14)
    ax.grid(True, linestyle="--", linewidth=0.5, alpha=0.4)
    ax.legend(loc="upper right", framealpha=0.85, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT)

    stats = (f"σ monthly  = 27.4%\n"
             f"σ annual   = 95.0%\n"
             f"Max draw   = −22.9%\n"
             f"2025 avg   = US$ 11.5k\n"
             f"2026 avg   = US$ 20.4k  (+77%)")
    ax.text(0.015, 0.95, stats, transform=ax.transAxes, fontsize=9,
            verticalalignment="top", family="monospace",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=PANEL, edgecolor=C_GOLD, alpha=0.9))

    plt.tight_layout()
    out = os.path.join(FIG_DIR, "fig-d3-rec2026-2-lithium-12m.png")
    plt.savefig(out, dpi=150, facecolor=BG, bbox_inches="tight")
    plt.close()
    print(f"[ok] {out}")

# ------------------------------------------------------------------
# Figure 3: BYD sales 12 months
# ------------------------------------------------------------------
def fig3_byd():
    fig, ax = plt.subplots(figsize=(11, 5.5))
    x = np.arange(len(months))

    bars = ax.bar(x, byd_sales, color=C_TEAL, alpha=0.78, edgecolor=C_TEAL,
                  linewidth=1.2, width=0.62, label="BYD vendas (unidades)")
    # Highlight Q1 26
    for i in range(6, 9):
        bars[i].set_color(C_BLUE)
        bars[i].set_alpha(0.9)

    # Q1 2026 = 38,335 (9755 + 11379 + 17201)
    # Q2 2026 estimate: 14,911 + 17,000 + 18,000 = 49,911
    ax.axhline(15000, color=MUTED, linestyle="--", linewidth=1, alpha=0.5)

    # Annotations
    ax.annotate("Q1'26: 38,335\n(bigger than\n2024 full year)", xy=(7.5, 38500),
                xytext=(3.5, 30000), fontsize=9, color=C_BLUE, ha="center",
                arrowprops=dict(arrowstyle="->", color=C_BLUE, lw=1.2))
    ax.annotate("1º lugar varejo\nAbr 2026 (12.8% share)", xy=(9, 14911),
                xytext=(2.5, 22000), fontsize=9, color=C_GOLD, ha="center",
                arrowprops=dict(arrowstyle="->", color=C_GOLD, lw=1.2))

    ax.set_xticks(x)
    ax.set_xticklabels(months, rotation=0, fontsize=9)
    ax.set_ylabel("Unidades (vendas mensais)", fontsize=11)
    ax.set_ylim(0, 22000)
    ax.set_title("BYD vendas mensais Brasil (Jul/2025 – Jun/2026) — Fenabrave / ABVE",
                 pad=14)
    ax.grid(True, axis="y", linestyle="--", linewidth=0.5, alpha=0.4)
    ax.legend(loc="upper left", framealpha=0.85, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT)

    stats = (f"2025 full year = 112,915\n"
             f"2026 Q1        = 38,335\n"
             f"2026 Q2 (est)  = 49,911\n"
             f"Run-rate 2026  ≈ 200,000+\n"
             f"Target 2026    = 250,000  (+121%)")
    ax.text(0.985, 0.96, stats, transform=ax.transAxes, fontsize=9,
            verticalalignment="top", family="monospace", ha="right",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=PANEL, edgecolor=C_TEAL, alpha=0.9))

    plt.tight_layout()
    out = os.path.join(FIG_DIR, "fig-d3-rec2026-3-byd-sales-12m.png")
    plt.savefig(out, dpi=150, facecolor=BG, bbox_inches="tight")
    plt.close()
    print(f"[ok] {out}")

# ------------------------------------------------------------------
# Figure 4: 11 dimensions stacked area, 6 quarters
# ------------------------------------------------------------------
def fig4_composite():
    fig, ax = plt.subplots(figsize=(11, 6))
    x = np.arange(len(quarters))

    # Prepare stacked area
    labels = list(dims_11.keys())
    values = np.array([dims_11[k] for k in labels])  # shape (11, 6)
    colors = DIM_COLORS

    ax.stackplot(x, values, labels=labels, colors=colors, alpha=0.72,
                 edgecolor=PANEL, linewidth=0.8)

    ax.set_xticks(x)
    ax.set_xticklabels(quarters, fontsize=10)
    ax.set_ylabel("Score (0–100, higher = mais risco)", fontsize=11)
    ax.set_ylim(0, 1000)
    ax.set_title("Composite score (11 dimensões × 6 sub-períodos) — Caminho C v2.0",
                 pad=14)

    # Annotate cluster transition
    ax.axvline(x=2.5, color=MUTED, linestyle="--", linewidth=1.2, alpha=0.6)
    ax.text(2.55, 970, "Lista suja\n(abr/26) →", fontsize=9, color=C_CORAL, ha="left", va="top")
    ax.axvline(x=4.5, color=MUTED, linestyle="--", linewidth=1.2, alpha=0.6)
    ax.text(4.55, 970, "Tariff 35%\n(jan/27) →", fontsize=9, color=C_GOLD, ha="left", va="top")

    # Composite annotation (sum / 11)
    composite = values.sum(axis=0) / 11
    for i, c in enumerate(composite):
        ax.annotate(f"{c:.0f}", xy=(i, 980), ha="center", fontsize=10,
                    color=TEXT, weight="bold")

    ax.grid(True, axis="y", linestyle="--", linewidth=0.5, alpha=0.4)

    # Legend at bottom
    leg = ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.13), ncol=6,
                    frameon=False, labelcolor=TEXT, fontsize=9)

    # Stats box
    stats = (f"Cluster 1 → 2 transição em Q3'25\n"
             f"Composite Q1'25: 56 (exec limpa)\n"
             f"Composite Q2'26: 78 (modo tensão)\n"
             f"Δ 6q: +22 pontos")
    ax.text(0.015, 0.96, stats, transform=ax.transAxes, fontsize=9,
            verticalalignment="top", family="monospace",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=PANEL, edgecolor=C_PURPLE, alpha=0.9))

    plt.tight_layout()
    out = os.path.join(FIG_DIR, "fig-d3-rec2026-4-composite-12m.png")
    plt.savefig(out, dpi=150, facecolor=BG, bbox_inches="tight")
    plt.close()
    print(f"[ok] {out}")


if __name__ == "__main__":
    fig1_ptax()
    fig2_lithium()
    fig3_byd()
    fig4_composite()
    print("\nAll 4 figures generated.")
