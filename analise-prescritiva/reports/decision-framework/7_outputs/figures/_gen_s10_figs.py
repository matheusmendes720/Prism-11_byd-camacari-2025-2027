#!/usr/bin/env python3
"""
Generate 2 dark-themed chart PNGs for D3-INTERDEPENDENCY-S10-TARIFF.md
Aesthetic inspired by AntV (https://antv.vision/) — dark navy background, neon accents.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np
import os

# AntV-inspired dark palette
BG_DARK = "#0F1729"          # deep navy background
BG_PANEL = "#1A2540"         # slightly lighter panel
GRID = "#2A3650"
TEXT_PRIMARY = "#E8EEF7"     # off-white
TEXT_SECONDARY = "#9AA8C0"   # muted

# Neon accents (high contrast on dark)
ACCENT_BEV = "#5B8FF9"       # blue
ACCENT_PHEV = "#F6BD16"      # gold
ACCENT_HEV = "#E86452"       # red-orange
ACCENT_SKD = "#6F8FFF"       # light blue / sky
ACCENT_HIGHLIGHT = "#13C2C2" # teal highlight
ACCENT_RED = "#F53F3F"       # red alert

# Figure output paths
FIG_DIR = r"C:\Users\mathe\code_space\orchestration\value-factory\byd-camacari-2025-2027\reports\decision-framework\figures"
FIG_1 = os.path.join(FIG_DIR, "fig-d3-s10-1-tariff-schedule-2024-2027.png")
FIG_2 = os.path.join(FIG_DIR, "fig-d3-s10-2-cost-impact-by-category.png")

# Apply dark theme globally
plt.rcParams.update({
    "figure.facecolor": BG_DARK,
    "axes.facecolor": BG_PANEL,
    "axes.edgecolor": GRID,
    "axes.labelcolor": TEXT_PRIMARY,
    "axes.titlecolor": TEXT_PRIMARY,
    "xtick.color": TEXT_SECONDARY,
    "ytick.color": TEXT_SECONDARY,
    "grid.color": GRID,
    "grid.alpha": 0.6,
    "text.color": TEXT_PRIMARY,
    "font.family": "DejaVu Sans",
    "font.size": 11,
})

# ============================================================
# FIGURE 1: Tariff schedule evolution 2024-2027 (line chart)
# ============================================================

# Data: tariff schedule (Camex) - per category, per date
# Format: date label, BEV, PHEV, HEV, SKD/CKD
dates = ["Jan/2024", "Jul/2024", "Jul/2025", "Jul/2026", "Jan/2027"]
bev = [10, 18, 25, 35, 35]
phev = [12, 20, 28, 35, 35]
hev = [12, 25, 30, 35, 35]
skd_ckd = [14, 14, 14, 14, 35]  # SKD/CKD only caught up in Jan/2027

x = np.arange(len(dates))

fig, ax = plt.subplots(figsize=(12, 6.5))
fig.subplots_adjust(left=0.08, right=0.97, top=0.88, bottom=0.13)

# Plot lines
ax.plot(x, bev, marker="o", markersize=9, linewidth=2.6,
        color=ACCENT_BEV, label="BEV (full assembled)", zorder=5)
ax.plot(x, phev, marker="s", markersize=9, linewidth=2.6,
        color=ACCENT_PHEV, label="PHEV (full assembled)", zorder=5)
ax.plot(x, hev, marker="^", markersize=9, linewidth=2.6,
        color=ACCENT_HEV, label="HEV (full assembled)", zorder=5)
ax.plot(x, skd_ckd, marker="D", markersize=9, linewidth=2.6,
        color=ACCENT_SKD, label="SKD/CKD (kits)", linestyle="--", zorder=5)

# Highlight the +21pp jump for SKD/CKD
ax.annotate("",
            xy=(4, 35), xycoords="data",
            xytext=(4, 14), textcoords="data",
            arrowprops=dict(arrowstyle="->", color=ACCENT_HIGHLIGHT, lw=2.2))
ax.text(4.18, 24, "+21pp\n(tariff\nshock)",
        color=ACCENT_HIGHLIGHT, fontsize=10, fontweight="bold",
        ha="left", va="center",
        bbox=dict(boxstyle="round,pad=0.4", facecolor=BG_PANEL, edgecolor=ACCENT_HIGHLIGHT, lw=1.2))

# Mark the 35% line (the "red zone floor")
ax.axhline(35, color=ACCENT_RED, linestyle=":", linewidth=1.3, alpha=0.7, zorder=2)
ax.text(0.05, 35.6, "Red zone floor = 35%", color=ACCENT_RED, fontsize=9, alpha=0.85)

# Mark the AMBER threshold (20%)
ax.axhline(20, color=ACCENT_PHEV, linestyle=":", linewidth=1.3, alpha=0.6, zorder=2)
ax.text(0.05, 20.6, "AMBER threshold = 20%", color=ACCENT_PHEV, fontsize=9, alpha=0.85)

# Mark the GREEN/AMBER threshold (10%)
ax.axhline(10, color=ACCENT_BEV, linestyle=":", linewidth=1.3, alpha=0.5, zorder=2)
ax.text(0.05, 10.6, "GREEN baseline = 10%", color=ACCENT_BEV, fontsize=9, alpha=0.85)

# Shade BYD exemption quota period (H1 2026)
ax.axvspan(2.5, 3.5, color=ACCENT_HIGHLIGHT, alpha=0.08, zorder=1)
ax.text(3.0, 2.5, "BYD quota\nUS$ 463M\ntariff-free (H1 2026)",
        color=ACCENT_HIGHLIGHT, fontsize=9, ha="center", va="bottom", alpha=0.95)

# Axes formatting
ax.set_xticks(x)
ax.set_xticklabels(dates, fontsize=10)
ax.set_ylim(0, 42)
ax.set_xlim(-0.3, 4.3)
ax.set_ylabel("Tariff rate (%)", fontsize=12, fontweight="bold")
ax.set_xlabel("Date (Camex schedule)", fontsize=12, fontweight="bold")

# Title and subtitle
fig.suptitle("Brazil EV Tariff Schedule 2024–2027 (Camex)",
             fontsize=15, fontweight="bold", y=0.965, color=TEXT_PRIMARY)
ax.set_title("Linha tracejada: SKD/CKD kits. Salto de 14% → 35% em jan/2027 = +21pp de cost shock",
             fontsize=10.5, color=TEXT_SECONDARY, pad=12)

# Grid
ax.grid(True, axis="y", linestyle="--", linewidth=0.7, alpha=0.5, zorder=0)
ax.set_axisbelow(True)

# Legend
leg = ax.legend(loc="upper left", frameon=True, facecolor=BG_PANEL,
                edgecolor=GRID, fontsize=10, framealpha=0.95)
for text in leg.get_texts():
    text.set_color(TEXT_PRIMARY)

# Spines styling
for spine in ax.spines.values():
    spine.set_color(GRID)
    spine.set_linewidth(1)

# Watermark
fig.text(0.985, 0.02, "D3 v0.6 · S10 Tariff Policy · 21/jul/2026",
         ha="right", va="bottom", fontsize=8.5, color=TEXT_SECONDARY, alpha=0.7)

plt.savefig(FIG_1, dpi=150, facecolor=BG_DARK, edgecolor="none", bbox_inches="tight")
plt.close(fig)
print(f"[OK] Saved: {FIG_1}")

# ============================================================
# FIGURE 2: Cost impact by category (bar chart)
# ============================================================

# Data: cost impact in R$ per vehicle, by category, comparing 3 scenarios
# Baseline = Jan/2024, Current = Jul/2026, Scheduled = Jan/2027
# CIF baseline: US$ 15k per SKD/CKD kit
# BRL/USD: 5.30 (current)
# Tariff: per category per scenario

categories = ["BEV (full)", "PHEV (full)", "HEV (full)", "SKD/CKD (kit)"]
tariff_jan24 = [10, 12, 12, 14]
tariff_jul26 = [25, 28, 30, 14]   # SKD/CKD still at 14% (quota helped)
tariff_jan27 = [35, 35, 35, 35]

# CIF landed cost (R$/vehicle) = CIF (US$ 15k) * BRL (5.30) * (1 + tariff)
brl = 5.30
cif_brl = 15_000 * brl  # 79,500 R$

cost_jan24 = [cif_brl * (1 + t/100) for t in tariff_jan24]
cost_jul26 = [cif_brl * (1 + t/100) for t in tariff_jul26]
cost_jan27 = [cif_brl * (1 + t/100) for t in tariff_jan27]

# Bar positions
x = np.arange(len(categories))
width = 0.27

fig, ax = plt.subplots(figsize=(12, 6.5))
fig.subplots_adjust(left=0.08, right=0.97, top=0.86, bottom=0.14)

# Bars
bars1 = ax.bar(x - width, cost_jan24, width, label="Jan/2024 (baseline)",
               color="#4A5A7A", edgecolor=GRID, linewidth=0.8, zorder=3)
bars2 = ax.bar(x, cost_jul26, width, label="Jul/2026 (current)",
               color=ACCENT_BEV, edgecolor=GRID, linewidth=0.8, zorder=3)
bars3 = ax.bar(x + width, cost_jan27, width, label="Jan/2027 (scheduled)",
               color=ACCENT_RED, edgecolor=GRID, linewidth=0.8, zorder=3)

# Highlight the SKD/CKD Jan/2027 bar
for bar in bars3[3:]:
    bar.set_edgecolor(ACCENT_HIGHLIGHT)
    bar.set_linewidth(2.2)

# Value labels on each bar
for bars in [bars1, bars2, bars3]:
    for bar in bars:
        h = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, h + 1200,
                f"R$ {h/1000:.1f}k",
                ha="center", va="bottom", fontsize=8.5, color=TEXT_PRIMARY,
                fontweight="bold", zorder=4)

# Delta arrows from Jul/2026 to Jan/2027 (red arrows)
for i in range(len(categories)):
    delta = cost_jan27[i] - cost_jul26[i]
    if delta > 0:
        ax.annotate(f"+R$ {delta/1000:.1f}k",
                    xy=(i + width, cost_jan27[i]),
                    xytext=(i + width, cost_jul26[i] - 5500),
                    ha="center", va="top", fontsize=9, color=ACCENT_RED,
                    fontweight="bold",
                    arrowprops=dict(arrowstyle="->", color=ACCENT_RED, lw=1.5,
                                    connectionstyle="arc3,rad=0.0"),
                    zorder=5)

# Highlight annotation: SKD/CKD has biggest delta
ax.annotate("Maior salto:\n+R$ 16.7k/veículo",
            xy=(3 + width, cost_jan27[3]),
            xytext=(3.6, cost_jan27[3] + 6000),
            ha="left", va="center", fontsize=10, color=ACCENT_HIGHLIGHT,
            fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BG_PANEL,
                      edgecolor=ACCENT_HIGHLIGHT, lw=1.5),
            arrowprops=dict(arrowstyle="->", color=ACCENT_HIGHLIGHT, lw=1.5))

# Reference line: margem BYD média 2025 (~22% on R$ 200k ASP = R$ 44k)
margin_ref = 44_000
ax.axhline(margin_ref, color=ACCENT_HIGHLIGHT, linestyle="--",
           linewidth=1.3, alpha=0.7, zorder=2)
ax.text(3.85, margin_ref + 1500, "Margem BYD média 2025\n(~R$ 44k/veículo)",
        color=ACCENT_HIGHLIGHT, fontsize=9, ha="right", alpha=0.9)

# Axes formatting
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=10.5)
ax.set_ylim(0, 145000)
ax.set_ylabel("Custo landed (R$/veículo)", fontsize=12, fontweight="bold")
ax.set_xlabel("Categoria de importação", fontsize=12, fontweight="bold")

# Format y-axis as R$ Xk
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, p: f"R$ {v/1000:.0f}k"))

# Title and subtitle
fig.suptitle("Cost Impact por Categoria de Veículo (CIF US$ 15k × BRL 5.30)",
             fontsize=15, fontweight="bold", y=0.95, color=TEXT_PRIMARY)
ax.set_title("Comparação: baseline Jan/2024 vs atual Jul/2026 vs scheduled Jan/2027. SKD/CKD sofre +21pp",
             fontsize=10.5, color=TEXT_SECONDARY, pad=12)

# Grid
ax.grid(True, axis="y", linestyle="--", linewidth=0.7, alpha=0.5, zorder=0)
ax.set_axisbelow(True)

# Legend
leg = ax.legend(loc="upper left", frameon=True, facecolor=BG_PANEL,
                edgecolor=GRID, fontsize=10, framealpha=0.95)
for text in leg.get_texts():
    text.set_color(TEXT_PRIMARY)

# Spines styling
for spine in ax.spines.values():
    spine.set_color(GRID)
    spine.set_linewidth(1)

# Watermark
fig.text(0.985, 0.02, "D3 v0.6 · S10 Tariff Policy · 21/jul/2026",
         ha="right", va="bottom", fontsize=8.5, color=TEXT_SECONDARY, alpha=0.7)

plt.savefig(FIG_2, dpi=150, facecolor=BG_DARK, edgecolor="none", bbox_inches="tight")
plt.close(fig)
print(f"[OK] Saved: {FIG_2}")

print("\n[DONE] Both figures generated successfully.")
