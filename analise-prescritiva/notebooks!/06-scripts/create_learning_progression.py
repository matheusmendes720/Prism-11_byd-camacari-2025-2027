"""
Learning Progression Summary Visualization
Shows all 11 levels (L0-L10) of the prescriptive analysis curriculum
from Statistics Fundamentals to Decision Framework.
Dark theme, sequential color ramp, snake/zigzag layout.
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib.colors import LinearSegmentedColormap, to_hex
import numpy as np

# ---------------------------------------------------------------------------
# Level definitions
# ---------------------------------------------------------------------------
LEVELS = [
    ("L0", "Statistics\nFundamentals",   "mean, median, std",      "percentiles, correlation"),
    ("L1", "Probability &\nDistributions", "normal, t, chi-square",   "expected value, outcomes"),
    ("L2", "Hypothesis\nTesting",        "p-value, t-stat, CIs",     "type I vs II error"),
    ("L3", "Linear\nRegression",         "OLS, R-squared",          "residuals, diagnostics"),
    ("L4", "Time Series\nAnalysis",      "ARIMA, stationarity",     "trend, seasonality"),
    ("L5", "Volatility &\nGARCH",        "conditional variance",    "VaR, CVaR, tail risk"),
    ("L6", "Monte Carlo\nSimulation",    "random sampling",         "scenarios, percentiles"),
    ("L7", "Multivariate /\nPCA",        "factor analysis",         "correlation heatmap"),
    ("L8", "Optimization",               "constraints, objectives", "tornado, sensitivity"),
    ("L9", "Game Theory",                "Nash equilibrium",        "payoff matrices"),
    ("L10", "Decision\nFramework",       "Bayesian decisions",      "action triggers, KPIs"),
]

# ---------------------------------------------------------------------------
# Sequential palette: cool deep-blue -> cyan -> teal -> emerald (dark theme)
# Foundation (L0) = cool/dark; Decision (L10) = warmer/advanced
# ---------------------------------------------------------------------------
PALETTE = [
    "#1e3a8a",  # L0  - navy      (foundation)
    "#1d4ed8",  # L1  - royal blue
    "#2563eb",  # L2  - blue
    "#0284c7",  # L3  - sky
    "#0891b2",  # L4  - cyan
    "#0e7490",  # L5  - dark cyan
    "#0d9488",  # L6  - teal
    "#059669",  # L7  - emerald
    "#10b981",  # L8  - green
    "#16a34a",  # L9  - bright green
    "#65a30d",  # L10 - lime (decision)
]

BG       = "#0b1220"   # outer background
SURFACE  = "#111a2e"   # card surface
EDGE     = "#1f2a44"   # card edge
TEXT     = "#e6edf3"   # primary text
MUTED    = "#9aa6bd"   # secondary text
ACCENT   = "#f8fafc"   # arrow ink

# ---------------------------------------------------------------------------
# Figure & layout — snake: 6 on top, 5 on bottom (right-to-left), then arrow up to L10
# Snake: 1-2-3-4-5-6 (top, L->R) -> drop -> 7-8-9-10-11 (bottom, R->L)
# We'll do: top row 6 cells (L0-L5), bottom row 5 cells (L6-L10)
# ---------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(20, 12), dpi=140)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

# Grid: top row cols 0..5, bottom row cols 5..1 (right-to-left) so the snake
# forms an "S". Bottom row only has 5 cells.
top_n    = 6
bot_n    = 5
top_y    = 0.65
bot_y    = 0.25
box_w    = 0.13
box_h    = 0.20
x_start  = 0.04
x_end    = 1.0 - 0.04
gap      = (x_end - x_start - box_w * top_n) / (top_n - 1)

# Compute box centers
centers = []
for i in range(top_n):
    cx = x_start + box_w / 2 + i * (box_w + gap)
    centers.append((cx, top_y, i))               # top row index i = L0..L5

# bottom row: right-to-left so visual flow snakes
# L6 sits under L5, L7 under L4, ... L10 under L1
# Right edge of bottom row aligns with right edge of top row
bot_x_start = x_start + (box_w + gap) * 1   # align left of L10 with left of L1
bot_centers_x = [bot_x_start + box_w / 2 + i * (box_w + gap) for i in range(bot_n)]
# We want L10 (i=0) to be under L1 and L6 (i=4) to be under L5.
# So rightmost-bottom cell aligns with rightmost-top cell (L5).
# Compute bottom positions in a way that preserves the snake flow.
right_edge_top = x_start + box_w + 5 * (box_w + gap)   # right edge of L5
left_edge_bot  = right_edge_top - (box_w + gap) * (bot_n - 1) - box_w
bot_centers_x = [left_edge_bot + box_w / 2 + i * (box_w + gap) for i in range(bot_n)]

for i in range(bot_n):
    centers.append((bot_centers_x[i], bot_y, top_n + i))   # indices 6..10

# ---------------------------------------------------------------------------
# Draw boxes
# ---------------------------------------------------------------------------
for idx, (cx, cy, _) in enumerate(centers):
    lvl, title, key1, key2 = LEVELS[idx]
    color = PALETTE[idx]

    # Card
    card = FancyBboxPatch(
        (cx - box_w / 2, cy - box_h / 2),
        box_w, box_h,
        boxstyle="round,pad=0.005,rounding_size=0.012",
        linewidth=1.6,
        edgecolor=color,
        facecolor=SURFACE,
        zorder=2,
    )
    ax.add_patch(card)

    # Color band on left edge
    band = mpatches.Rectangle(
        (cx - box_w / 2, cy - box_h / 2),
        0.012, box_h,
        facecolor=color, edgecolor="none", zorder=3,
    )
    ax.add_patch(band)

    # Level tag (small chip top-left)
    chip = FancyBboxPatch(
        (cx - box_w / 2 + 0.018, cy + box_h / 2 - 0.034),
        0.05, 0.026,
        boxstyle="round,pad=0.002,rounding_size=0.008",
        linewidth=0, facecolor=color, zorder=4,
    )
    ax.add_patch(chip)
    ax.text(cx - box_w / 2 + 0.043, cy + box_h / 2 - 0.021,
            lvl, ha="center", va="center", fontsize=9,
            fontweight="bold", color="#0b1220", zorder=5)

    # Title
    ax.text(cx, cy + 0.045, title,
            ha="center", va="center", fontsize=10.5,
            fontweight="bold", color=TEXT, zorder=5)

    # Key concept lines
    ax.text(cx, cy - 0.025, key1,
            ha="center", va="center", fontsize=8.5,
            color=MUTED, zorder=5)
    ax.text(cx, cy - 0.055, key2,
            ha="center", va="center", fontsize=8.5,
            color=MUTED, zorder=5)


# ---------------------------------------------------------------------------
# Connecting arrows
# Top row L0 -> L1 -> ... -> L5  (left to right)
# Curve down from L5 to L6
# Bottom row L6 -> L7 -> ... -> L10 (RIGHT to LEFT, snake)
# ---------------------------------------------------------------------------
def arrow(p1, p2, color=ACCENT, lw=2.0, rad=0.0, zorder=1):
    a = FancyArrowPatch(
        p1, p2,
        arrowstyle="-|>",
        mutation_scale=18,
        linewidth=lw,
        color=color,
        connectionstyle=f"arc3,rad={rad}",
        zorder=zorder,
    )
    ax.add_patch(a)


# Top row arrows (L0->L1->...->L5)
for i in range(top_n - 1):
    x1, y1, _ = centers[i]
    x2, y2, _ = centers[i + 1]
    arrow((x1 + box_w / 2 - 0.005, y1), (x2 - box_w / 2 + 0.005, y2), rad=0.0)

# Down arrow: L5 (top-right) -> L6 (bottom-right under L5)
x_top_right, y_top_right, _ = centers[top_n - 1]
x_bot_right, y_bot_right, _ = centers[top_n]   # L6
arrow((x_top_right, y_top_right - box_h / 2),
      (x_bot_right, y_bot_right + box_h / 2 + 0.04),
      rad=0.30, color=ACCENT, lw=2.6)
# small drop above L6 so arrowhead isn't covered
arrow((x_bot_right, y_bot_right + box_h / 2 + 0.04),
      (x_bot_right, y_bot_right + box_h / 2 + 0.005),
      rad=0.0, lw=2.6)

# Bottom row arrows: L6 -> L7 -> ... -> L10, going LEFT
# centers 6,7,8,9,10 are stored in that order along bottom row
# but their visual x positions are bot_centers_x[0..4]
# bot_centers_x[0] = leftmost  = L10
# bot_centers_x[4] = rightmost = L6
# So the flow is L6 -> L7 -> L8 -> L9 -> L10, i.e. from rightmost to leftmost
for i in range(bot_n - 1):
    # i indexes the bottom row position; visual flow is right-to-left
    idx_from = top_n + (bot_n - 1 - i)       # rightmost first
    idx_to   = top_n + (bot_n - 1 - (i + 1)) # leftmost last
    x1, y1, _ = centers[idx_from]
    x2, y2, _ = centers[idx_to]
    arrow((x1 - box_w / 2 + 0.005, y1), (x2 + box_w / 2 - 0.005, y2), rad=0.0)


# ---------------------------------------------------------------------------
# Headers & annotations
# ---------------------------------------------------------------------------
# Title block
ax.text(0.5, 0.97,
        "Learning Progression: Statistics -> Decision Framework",
        ha="center", va="center", fontsize=20, fontweight="bold",
        color=TEXT)

ax.text(0.5, 0.925,
        "11 levels (L0-L10) | BYD Camaçari Prescriptive Analysis curriculum",
        ha="center", va="center", fontsize=11, color=MUTED)

# Section labels
ax.text(x_start + box_w / 2, top_y + box_h / 2 + 0.07,
        "FOUNDATIONS", ha="center", va="center",
        fontsize=9.5, fontweight="bold", color=PALETTE[0], alpha=0.9)
ax.text((x_start + (x_end - box_w)) / 2, top_y + box_h / 2 + 0.07,
        "RISK & SIMULATION", ha="center", va="center",
        fontsize=9.5, fontweight="bold", color=PALETTE[4], alpha=0.9)
ax.text(x_end - box_w / 2, top_y + box_h / 2 + 0.07,
        "DECISION SCIENCE", ha="center", va="center",
        fontsize=9.5, fontweight="bold", color=PALETTE[10], alpha=0.9)

# Stage markers on left margin
stages = [
    (top_y, "Statistics",         PALETTE[0]),
    (bot_y, "Decision Framework", PALETTE[10]),
]
for y, label, color in stages:
    ax.text(0.012, y, label, rotation=90, ha="center", va="center",
            fontsize=10, fontweight="bold", color=color, alpha=0.9)

# Legend / palette ramp at bottom
ramp_y = 0.08
ramp_h = 0.018
n = len(PALETTE)
seg_w = (x_end - x_start) / n
for i, c in enumerate(PALETTE):
    ax.add_patch(mpatches.Rectangle(
        (x_start + i * seg_w, ramp_y), seg_w, ramp_h,
        facecolor=c, edgecolor="none", zorder=2,
    ))
ax.text(x_start, ramp_y - 0.022, "L0", ha="center", va="top",
        fontsize=8.5, color=MUTED)
ax.text(x_start + seg_w * (n / 2), ramp_y - 0.022,
        f"Progression ramp: foundation -> advanced (level {n - 1})",
        ha="center", va="top", fontsize=9, color=MUTED)
ax.text(x_end, ramp_y - 0.022, f"L{n - 1}", ha="center", va="top",
        fontsize=8.5, color=MUTED)

# Footer note
ax.text(0.5, 0.015,
        "Each level builds on the previous.  "
        "Skip ahead and you'll lack the intuition to interpret later results.",
        ha="center", va="center", fontsize=9.5, style="italic",
        color=MUTED)

# ---------------------------------------------------------------------------
# Final layout
# ---------------------------------------------------------------------------
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_aspect("auto")
ax.axis("off")

# ---------------------------------------------------------------------------
# Save
# ---------------------------------------------------------------------------
out_dir = r"C:/Users/mathe/code_space/orchestration/value-factory/case-studies/byd-camacari-2025-2027/analise-prescritiva/outputs/learning"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "learning_progression_summary.png")

plt.savefig(out_path, dpi=140, facecolor=BG, bbox_inches="tight",
            pad_inches=0.25)
plt.close()
print(f"Saved: {out_path}")