"""
Generate S11 (Competitive Intensity) figures in dark theme (AntV-style).
Output: 3 PNGs in figures/ directory.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

# Dark theme palette (AntV-inspired)
BG = "#1a1a2e"
PANEL = "#0f3460"
TEXT = "#e0e0e0"
GRID = "#3a3a5c"

# Player brand colors
C_BYD = "#d62b2b"        # red (BYD brand)
C_STELLANTIS = "#1f4e8c"  # navy blue
C_GM = "#ffb800"         # gold/yellow
C_VW = "#00a0e1"         # blue
C_TOYOTA = "#eb0a1e"     # toyota red
C_GEELY = "#7b2cbf"      # purple
C_GWM = "#2dc26b"        # green
C_LEAPMOTOR = "#ff7a00"  # orange

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.edgecolor": GRID,
    "axes.labelcolor": TEXT,
    "axes.titlecolor": TEXT,
    "xtick.color": TEXT,
    "ytick.color": TEXT,
    "axes.facecolor": PANEL,
    "figure.facecolor": BG,
    "savefig.facecolor": BG,
    "text.color": TEXT,
    "grid.color": GRID,
    "grid.alpha": 0.3,
})


def fig1_capex_by_player():
    """Bar chart: capex committed (R$ bi) by 5 main players + BYD reference."""
    players = ["Stellantis", "VW", "GM", "BYD", "Toyota", "Geely", "GWM"]
    capex = [30.0, 16.0, 7.0, 5.5, 11.0, 0.0, 0.0]  # R$ bi
    # Geely/GWM capex not disclosed in BR, but global $5-8bi each.
    # Use global capex as proxy: Geely ~$5bi (R$ 25bi) global, GWM ~$3bi (R$ 15bi).
    # But the prompt says "no capex disclosed" for Geely — keep at 0 in BR.
    colors = [C_STELLANTIS, C_VW, C_GM, C_BYD, C_TOYOTA, C_GEELY, C_GWM]

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(players, capex, color=colors, edgecolor="white", linewidth=0.6, width=0.65)

    # Highlight BYD in the panel
    for i, p in enumerate(players):
        if capex[i] > 0:
            ax.text(i, capex[i] + 0.6, f"R$ {capex[i]:.1f}bi",
                    ha="center", va="bottom", color=TEXT, fontsize=10, fontweight="bold")
        else:
            ax.text(i, 0.4, "n/d", ha="center", va="bottom", color="#888", fontsize=9, style="italic")

    # Threshold lines per D3 spec
    x_span = np.arange(-0.5, len(players) - 0.5, 0.01)
    ax.axhline(15, color="#ff6b6b", linestyle="--", linewidth=1.2, alpha=0.8, label="RED threshold = R$ 15bi")
    ax.axhline(5, color="#ffd166", linestyle="--", linewidth=1.2, alpha=0.8, label="AMBER threshold = R$ 5bi")
    ax.fill_between(x_span, 0, 5, color="#06d6a0", alpha=0.07)
    ax.fill_between(x_span, 5, 15, color="#ffd166", alpha=0.07)
    ax.fill_between(x_span, 15, 35, color="#ff6b6b", alpha=0.07)

    ax.set_ylim(0, 35)
    ax.set_ylabel("Capex committed (R$ bilhões, 2025-2030)", fontsize=11, color=TEXT)
    ax.set_title("S11 — Capex committed by player in Brazil 2025-2030",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)
    ax.legend(loc="upper right", frameon=True, facecolor=PANEL, edgecolor=GRID, labelcolor=TEXT, fontsize=9)
    ax.grid(axis="y", linestyle="--", alpha=0.25)
    ax.set_axisbelow(True)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)

    # Footer note
    fig.text(0.5, 0.015,
             "Fonte: Reuters, Bloomberg, ANFAVEA, press releases (jul/2026). BYD = R$ 5.5bi Camaçari. Geely/GWM = não divulgado no Brasil.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-s11-1-capex-by-player.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig2_models_launched():
    """Bar chart: number of new models launched 2025-2027 per player."""
    players = ["Stellantis", "VW", "BYD", "Geely", "GM", "GWM", "Toyota", "Leapmotor"]
    models = [40, 27, 8, 5, 4, 4, 3, 3]  # 40+ for Stellantis (rounded); BYD 8 incl. facelifts
    colors = [C_STELLANTIS, C_VW, C_BYD, C_GEELY, C_GM, C_GWM, C_TOYOTA, C_LEAPMOTOR]

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(players, models, color=colors, edgecolor="white", linewidth=0.6, width=0.65)

    for i, m in enumerate(models):
        ax.text(i, m + 0.7, str(m), ha="center", va="bottom", color=TEXT, fontsize=10, fontweight="bold")

    # Thresholds
    x_span = np.arange(-0.5, len(players) - 0.5, 0.01)
    ax.axhline(8, color="#ff6b6b", linestyle="--", linewidth=1.2, alpha=0.8, label="RED threshold = 8 models")
    ax.axhline(3, color="#ffd166", linestyle="--", linewidth=1.2, alpha=0.8, label="AMBER threshold = 3 models")
    ax.fill_between(x_span, 0, 3, color="#06d6a0", alpha=0.07)
    ax.fill_between(x_span, 3, 8, color="#ffd166", alpha=0.07)
    ax.fill_between(x_span, 8, 45, color="#ff6b6b", alpha=0.07)

    ax.set_ylim(0, 45)
    ax.set_ylabel("New models launched 2025-2027 (#)", fontsize=11, color=TEXT)
    ax.set_title("S11 — New models launched 2025-2027 by player",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)
    ax.legend(loc="upper right", frameon=True, facecolor=PANEL, edgecolor=GRID, labelcolor=TEXT, fontsize=9)
    ax.grid(axis="y", linestyle="--", alpha=0.25)
    ax.set_axisbelow(True)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)

    fig.text(0.5, 0.015,
             "Fonte: Reuters, electrive.com, ANFAVEA, WardsAuto, focus2move (jul/2026). Stellantis = 40+ (incl. facelifts).",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-s11-2-models-launched-2025-2027.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig3_ev_market_share():
    """Pie chart: EV market share April 2026 in Brazil."""
    # Real Apr 2026 numbers (Brazilian EV market)
    labels = [
        "BYD\n(12.8% retail)",
        "Geely\n(10.6%)",
        "GWM\n(8.2%)",
        "Stellantis (BEV)\n(6.4%)",
        "VW (BEV)\n(4.1%)",
        "GM (BEV)\n(2.0%)",
        "Leapmotor\n(3.5%)",
        "Outros (Toyota,\nChery, etc.)",
    ]
    sizes = [12.8, 10.6, 8.2, 6.4, 4.1, 2.0, 3.5, 52.4]  # rest of EV market
    colors = [C_BYD, C_GEELY, C_GWM, C_STELLANTIS, C_VW, C_GM, C_LEAPMOTOR, "#4a4a6a"]
    explode = (0.06, 0.04, 0.02, 0, 0, 0, 0, 0)  # emphasize BYD

    fig, ax = plt.subplots(figsize=(10, 7))
    wedges, texts, autotexts = ax.pie(
        sizes, labels=labels, colors=colors, autopct="%1.1f%%",
        startangle=90, explode=explode, pctdistance=0.78,
        textprops={"color": TEXT, "fontsize": 10},
        wedgeprops={"edgecolor": BG, "linewidth": 2},
    )
    for at in autotexts:
        at.set_color("white")
        at.set_fontsize(9)
        at.set_fontweight("bold")

    # Donut hole for clarity
    centre_circle = plt.Circle((0, 0), 0.45, fc=BG)
    ax.add_artist(centre_circle)
    ax.text(0, 0.05, "EV Market\nBrazil\nApr 2026", ha="center", va="center",
            color=TEXT, fontsize=12, fontweight="bold")
    ax.text(0, -0.15, "100%", ha="center", va="center",
            color="#888", fontsize=10)

    ax.set_title("S11 — EV market share in Brazil (April 2026)",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)

    fig.text(0.5, 0.015,
             "Fonte: Fenabrave, ABVE, focus2move (abr/2026). BYD = 12.8% varejo total (1º lugar). EV market = 13.47% do total Brasil.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-s11-3-ev-market-share-apr-2026.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


if __name__ == "__main__":
    print("Generating S11 figures...")
    f1 = fig1_capex_by_player()
    print(f"  ✓ {f1}")
    f2 = fig2_models_launched()
    print(f"  ✓ {f2}")
    f3 = fig3_ev_market_share()
    print(f"  ✓ {f3}")
    print("Done.")
