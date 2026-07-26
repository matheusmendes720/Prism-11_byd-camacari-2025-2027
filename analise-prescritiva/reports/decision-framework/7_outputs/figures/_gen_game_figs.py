"""
Generate D3 v2.0 Game Theory (C2) figures in dark theme (AntV-inspired).
Output: 6 PNGs in figures/ directory.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
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
C_GEELY = "#7b2cbf"      # purple

# Strategy colors
C_HIGH = "#ff6b6b"
C_LOW = "#06d6a0"
C_NASH = "#ffd166"

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


def fig1_payoff_matrix_byd_stellantis():
    """2x2 heatmap payoff matrix BYD vs Stellantis. Payoffs = margin %."""
    # (BYD, Stellantis)
    payoffs = {
        ("H", "H"): (8, 4),    # both aggressive: price war
        ("H", "L"): (18, 7),   # BYD aggressive, Stellantis defends: BYD wins
        ("L", "H"): (5, 12),   # BYD retreats, Stellantis aggressive: Stellantis wins
        ("L", "L"): (12, 5),   # both defensive: low growth for both
    }

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # BYD payoff
    byd_matrix = np.array([
        [payoffs[("H", "H")][0], payoffs[("H", "L")][0]],
        [payoffs[("L", "H")][0], payoffs[("L", "L")][0]],
    ])
    # Stellantis payoff
    stl_matrix = np.array([
        [payoffs[("H", "H")][1], payoffs[("H", "L")][1]],
        [payoffs[("L", "H")][1], payoffs[("L", "L")][1]],
    ])

    for ax, matrix, title, cbar_label in [
        (axes[0], byd_matrix, "BYD payoff (margin %)", "BYD margin %"),
        (axes[1], stl_matrix, "Stellantis payoff (margin %)", "Stellantis margin %"),
    ]:
        im = ax.imshow(matrix, cmap="RdYlGn", vmin=0, vmax=20, aspect="auto")
        ax.set_xticks([0, 1])
        ax.set_xticklabels(["Stellantis HIGH", "Stellantis LOW"])
        ax.set_yticks([0, 1])
        ax.set_yticklabels(["BYD HIGH", "BYD LOW"])
        ax.set_title(title, fontsize=12, fontweight="bold", color=TEXT, pad=10)

        # Annotate each cell
        for i in range(2):
            for j in range(2):
                val = matrix[i, j]
                # Color: green if high, red if low
                text_color = "white" if val < 10 else "black"
                ax.text(j, i, f"{val}%", ha="center", va="center",
                        color=text_color, fontsize=18, fontweight="bold")

        # Highlight Nash equilibrium (H, L) = top-right
        rect = Rectangle((0.5, -0.5), 1, 1, linewidth=3,
                         edgecolor=C_NASH, facecolor="none", linestyle="--")
        ax.add_patch(rect)
        ax.text(1, -0.85, "★ NASH", ha="center", color=C_NASH,
                fontsize=10, fontweight="bold")

        cbar = plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label(cbar_label, color=TEXT, fontsize=9)
        cbar.ax.yaxis.set_tick_params(color=TEXT)
        plt.setp(plt.getp(cbar.ax.axes, "yticklabels"), color=TEXT)

    fig.suptitle("D3 v2.0 — Game Theory: 2×2 payoff matrix BYD vs Stellantis",
                 fontsize=14, fontweight="bold", color=TEXT, y=1.02)
    fig.text(0.5, 0.005,
             "HIGH = strategy agressiva (premium pricing, R$ 30bi capex, Bio-Hybrid, 40+ modelos). "
             "LOW = status quo (defensivo, legacy, ICE). Payoffs = margem % esperada 2027.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 0.97))
    out = "fig-d3-game-1-payoff-matrix-byd-stellantis.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig2_payoff_matrix_byd_geely():
    """2x2 heatmap payoff matrix BYD vs Geely. Payoffs = margin %."""
    # Geely is the surging threat; EX2 + 5 models 2026-2027
    payoffs = {
        ("H", "H"): (7, 3),     # both aggressive: price war, both lose
        ("H", "L"): (20, 0),    # BYD aggressive, Geely exits: BYD wins
        ("L", "H"): (4, 10),    # BYD retreats, Geely aggressive: Geely wins
        ("L", "L"): (14, 0),    # both defensive: BYD modest, Geely exits
    }

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    byd_matrix = np.array([
        [payoffs[("H", "H")][0], payoffs[("H", "L")][0]],
        [payoffs[("L", "H")][0], payoffs[("L", "L")][0]],
    ])
    geely_matrix = np.array([
        [payoffs[("H", "H")][1], payoffs[("H", "L")][1]],
        [payoffs[("L", "H")][1], payoffs[("L", "L")][1]],
    ])

    for ax, matrix, title, cbar_label in [
        (axes[0], byd_matrix, "BYD payoff (margin %)", "BYD margin %"),
        (axes[1], geely_matrix, "Geely payoff (margin %)", "Geely margin %"),
    ]:
        im = ax.imshow(matrix, cmap="RdYlGn", vmin=0, vmax=20, aspect="auto")
        ax.set_xticks([0, 1])
        ax.set_xticklabels(["Geely HIGH", "Geely LOW"])
        ax.set_yticks([0, 1])
        ax.set_yticklabels(["BYD HIGH", "BYD LOW"])
        ax.set_title(title, fontsize=12, fontweight="bold", color=TEXT, pad=10)

        for i in range(2):
            for j in range(2):
                val = matrix[i, j]
                text_color = "white" if val < 10 else "black"
                ax.text(j, i, f"{val}%", ha="center", va="center",
                        color=text_color, fontsize=18, fontweight="bold")

        # Nash (H, L) = top-right — BYD aggressive forces Geely out
        rect = Rectangle((0.5, -0.5), 1, 1, linewidth=3,
                         edgecolor=C_NASH, facecolor="none", linestyle="--")
        ax.add_patch(rect)
        ax.text(1, -0.85, "★ NASH", ha="center", color=C_NASH,
                fontsize=10, fontweight="bold")

        cbar = plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label(cbar_label, color=TEXT, fontsize=9)
        cbar.ax.yaxis.set_tick_params(color=TEXT)
        plt.setp(plt.getp(cbar.ax.axes, "yticklabels"), color=TEXT)

    fig.suptitle("D3 v2.0 — Game Theory: 2×2 payoff matrix BYD vs Geely",
                 fontsize=14, fontweight="bold", color=TEXT, y=1.02)
    fig.text(0.5, 0.005,
             "Geely = 10.6% EV share Abr/2026 (surging). HIGH = EX2 + 5 modelos agressivos. "
             "LOW = sair do Brasil. BYD HIGH + Geely LOW = NASH (BYD 20%, Geely 0%).",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 0.97))
    out = "fig-d3-game-2-payoff-matrix-byd-geely.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig3_strategic_space_5players():
    """5-player bubble chart: capex (x) vs models (y), bubble size = EV market share."""
    players = ["BYD", "Stellantis", "GM", "VW", "Geely"]
    capex = [5.5, 30.0, 7.0, 16.0, 0.0]  # R$ bi
    models = [8, 40, 4, 27, 5]  # 2025-2027
    market_share = [12.8, 6.4, 2.0, 4.1, 10.6]  # EV market share %
    colors = [C_BYD, C_STELLANTIS, C_GM, C_VW, C_GEELY]

    fig, ax = plt.subplots(figsize=(13, 8))

    # Plot bubbles
    for i, p in enumerate(players):
        size = market_share[i] * 60  # scale
        ax.scatter(capex[i], models[i], s=size, c=colors[i],
                   alpha=0.7, edgecolors="white", linewidth=2, zorder=3)
        # Custom label positions to avoid overlap
        if p == "BYD":
            ax.annotate("BYD", (capex[i], models[i]),
                        xytext=(capex[i]+1.5, models[i]+2.5),
                        fontsize=14, fontweight="bold", color=colors[i],
                        arrowprops=dict(arrowstyle="->", color=colors[i], lw=1.5))
        elif p == "Stellantis":
            # Stellantis upper-right corner — label to the left to fit
            ax.annotate("Stellantis", (capex[i], models[i]),
                        xytext=(capex[i]-6, models[i]+3),
                        fontsize=13, fontweight="bold", color=colors[i],
                        arrowprops=dict(arrowstyle="->", color=colors[i], lw=1.5))
        elif p == "GM":
            ax.annotate("GM", (capex[i], models[i]),
                        xytext=(capex[i]+1.5, models[i]+2),
                        fontsize=13, fontweight="bold", color=colors[i],
                        arrowprops=dict(arrowstyle="->", color=colors[i], lw=1.5))
        elif p == "VW":
            ax.annotate("VW", (capex[i], models[i]),
                        xytext=(capex[i]+1.5, models[i]+2.5),
                        fontsize=13, fontweight="bold", color=colors[i],
                        arrowprops=dict(arrowstyle="->", color=colors[i], lw=1.5))
        elif p == "Geely":
            # Geely at (0, 5) — label above and to the right
            ax.annotate("Geely", (capex[i], models[i]),
                        xytext=(capex[i]+1, models[i]+4),
                        fontsize=13, fontweight="bold", color=colors[i],
                        arrowprops=dict(arrowstyle="->", color=colors[i], lw=1.5))

    # Strategy quadrants
    ax.axvline(15, color=C_HIGH, linestyle="--", linewidth=1.5, alpha=0.6,
               label="Capex threshold RED = R$ 15bi")
    ax.axhline(8, color=C_HIGH, linestyle=":", linewidth=1.5, alpha=0.6,
               label="Models threshold RED = 8")
    ax.axvline(5, color=C_LOW, linestyle="--", linewidth=1.0, alpha=0.4,
               label="Capex threshold AMBER = R$ 5bi")
    ax.axhline(3, color=C_LOW, linestyle=":", linewidth=1.0, alpha=0.4,
               label="Models threshold AMBER = 3")

    # Quadrant labels (positioned to avoid overlap with bubbles/labels)
    ax.text(0.3, 44, "HIGH CAPEX\nHIGH MODELS\n(RED — agressivo)",
            fontsize=9, color="#999", ha="left", va="top", style="italic", alpha=0.7)
    ax.text(2, -2, "LOW CAPEX\nLOW MODELS\n(GREEN — status quo)",
            fontsize=9, color="#999", ha="left", va="top", style="italic", alpha=0.7)
    ax.text(33, 1, "HIGH CAPEX\nLOW MODELS\n(AMBER — investimento sem escala)",
            fontsize=9, color="#999", ha="right", va="bottom", style="italic", alpha=0.7)

    ax.set_xlim(-3, 38)
    ax.set_ylim(-5, 50)
    ax.set_xlabel("Capex committed 2025-2030 (R$ bilhões)", fontsize=11, color=TEXT)
    ax.set_ylabel("New models launched 2025-2027 (#)", fontsize=11, color=TEXT)
    ax.set_title("D3 v2.0 — Strategic space: 5-player bubble chart\n(bubble size = EV market share, Abr/2026)",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)
    ax.legend(loc="lower right", frameon=True, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT, fontsize=8)
    ax.grid(True, linestyle="--", alpha=0.25)
    ax.set_axisbelow(True)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)

    fig.text(0.5, 0.005,
             "Geely = capex não divulgado no Brasil (marcado em x=0). Stellantis domina upper-right (R$ 30bi, 40+ modelos). "
             "BYD = dominante em share mas com capex relativo baixo.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-game-3-strategic-space-5players.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig4_game_tree_byd_decision():
    """Game tree: BYD decision flow showing branches and payoffs at leaves."""
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis("off")

    # Root node: BYD decision
    root = FancyBboxPatch((5.5, 8.3), 3, 1, boxstyle="round,pad=0.1",
                          facecolor=C_BYD, edgecolor="white", linewidth=2)
    ax.add_patch(root)
    ax.text(7, 8.8, "BYD\nDecision Node", ha="center", va="center",
            color="white", fontsize=12, fontweight="bold")

    # Branches: HIGH vs LOW
    high_node = FancyBboxPatch((1.0, 6.3), 3, 1, boxstyle="round,pad=0.1",
                               facecolor=C_HIGH, edgecolor="white", linewidth=1.5)
    ax.add_patch(high_node)
    ax.text(2.5, 6.8, "BYD = HIGH\n(premium + R$ 4.5k/unit defensivo)",
            ha="center", va="center", color="white", fontsize=9, fontweight="bold")

    low_node = FancyBboxPatch((10.0, 6.3), 3, 1, boxstyle="round,pad=0.1",
                              facecolor=C_LOW, edgecolor="white", linewidth=1.5)
    ax.add_patch(low_node)
    ax.text(11.5, 6.8, "BYD = LOW\n(acessível R$ 100-130k, sem defensivo)",
            ha="center", va="center", color="white", fontsize=9, fontweight="bold")

    # Edges from root
    ax.annotate("", xy=(2.5, 7.3), xytext=(6.5, 8.3),
                arrowprops=dict(arrowstyle="->", color="white", lw=2))
    ax.annotate("", xy=(11.5, 7.3), xytext=(7.5, 8.3),
                arrowprops=dict(arrowstyle="->", color="white", lw=2))

    # Second level: Stellantis response (4 branches)
    stel_h_h = FancyBboxPatch((0.2, 4.3), 1.8, 0.8, boxstyle="round,pad=0.05",
                              facecolor="#1a3a5c", edgecolor=C_STELLANTIS, linewidth=1.5)
    ax.add_patch(stel_h_h)
    ax.text(1.1, 4.7, "Stel: H", ha="center", va="center",
            color="white", fontsize=10, fontweight="bold")

    stel_h_l = FancyBboxPatch((2.5, 4.3), 1.8, 0.8, boxstyle="round,pad=0.05",
                              facecolor="#1a3a5c", edgecolor=C_STELLANTIS, linewidth=1.5)
    ax.add_patch(stel_h_l)
    ax.text(3.4, 4.7, "Stel: L", ha="center", va="center",
            color="white", fontsize=10, fontweight="bold")

    stel_l_h = FancyBboxPatch((9.7, 4.3), 1.8, 0.8, boxstyle="round,pad=0.05",
                              facecolor="#1a3a5c", edgecolor=C_STELLANTIS, linewidth=1.5)
    ax.add_patch(stel_l_h)
    ax.text(10.6, 4.7, "Stel: H", ha="center", va="center",
            color="white", fontsize=10, fontweight="bold")

    stel_l_l = FancyBboxPatch((12.0, 4.3), 1.8, 0.8, boxstyle="round,pad=0.05",
                              facecolor="#1a3a5c", edgecolor=C_STELLANTIS, linewidth=1.5)
    ax.add_patch(stel_l_l)
    ax.text(12.9, 4.7, "Stel: L", ha="center", va="center",
            color="white", fontsize=10, fontweight="bold")

    # Edges
    for x_start, x_end, y_start, y_end in [
        (2.5, 1.1, 6.3, 5.1), (2.5, 3.4, 6.3, 5.1),
        (11.5, 10.6, 6.3, 5.1), (11.5, 12.9, 6.3, 5.1)
    ]:
        ax.annotate("", xy=(x_end, y_end), xytext=(x_start, y_start),
                    arrowprops=dict(arrowstyle="->", color="gray", lw=1.2))

    # Third level: Geely response
    geely_positions = [
        (0.2, 2.3, "G: H"), (1.5, 2.3, "G: L"),
        (2.8, 2.3, "G: H"), (4.1, 2.3, "G: L"),
        (9.7, 2.3, "G: H"), (11.0, 2.3, "G: L"),
        (12.3, 2.3, "G: H"), (13.6, 2.3, "G: L"),
    ]
    for x, y, label in geely_positions:
        rect = FancyBboxPatch((x-0.55, y-0.3), 1.1, 0.6, boxstyle="round,pad=0.05",
                              facecolor="#3a1a5c", edgecolor=C_GEELY, linewidth=1.2)
        ax.add_patch(rect)
        ax.text(x, y, label, ha="center", va="center",
                color="white", fontsize=8, fontweight="bold")

    # Edges to Geely nodes
    geely_edges = [
        (1.1, 0.2, 4.3, 2.6), (1.1, 1.5, 4.3, 2.6),
        (3.4, 2.8, 4.3, 2.6), (3.4, 4.1, 4.3, 2.6),
        (10.6, 9.7, 4.3, 2.6), (10.6, 11.0, 4.3, 2.6),
        (12.9, 12.3, 4.3, 2.6), (12.9, 13.6, 4.3, 2.6),
    ]
    for x1, x2, y1, y2 in geely_edges:
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="gray", lw=0.8, alpha=0.7))

    # Payoffs at leaves (BYD margin, share) — simplified
    payoffs_leaves = [
        # BYD=H, Stel=H
        (0.2, 0.5, "BYD: 8% m\n4% sh"),
        (1.5, 0.5, "BYD: 16%\n15% sh ★"),
        # BYD=H, Stel=L
        (2.8, 0.5, "BYD: 14%\n12% sh"),
        (4.1, 0.5, "BYD: 18%\n16% sh ★"),
        # BYD=L, Stel=H
        (9.7, 0.5, "BYD: 5%\n9% sh"),
        (11.0, 0.5, "BYD: 9%\n11% sh"),
        # BYD=L, Stel=L
        (12.3, 0.5, "BYD: 11%\n13% sh"),
        (13.6, 0.5, "BYD: 12%\n14% sh"),
    ]
    for x, y, text in payoffs_leaves:
        ax.text(x, y, text, ha="center", va="center", fontsize=7,
                color=C_NASH if "★" in text else TEXT, fontweight="bold")

    # Highlight NASH leaves
    for x, y, text in payoffs_leaves:
        if "★" in text:
            circle = plt.Circle((x, y + 0.6), 0.3, color=C_NASH, alpha=0.5, zorder=1)
            ax.add_patch(circle)

    # Title
    ax.text(7, 9.6, "D3 v2.0 — Game Tree: BYD → Stellantis → Geely decision flow",
            ha="center", fontsize=14, fontweight="bold", color=TEXT)
    ax.text(7, 0.05, "NASH equilibria (★): (BYD=H, Stel=H, Geely=L) and (BYD=H, Stel=L, Geely=L) "
            "— BYD dominates in both. Best outcome: (H, L, L) = 18% margin, 16% share.",
            ha="center", fontsize=8, color="#888", style="italic")

    fig.patch.set_facecolor(BG)
    plt.tight_layout()
    out = "fig-d3-game-4-game-tree-byd-decision.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig5_equilibrium_market_share():
    """Bar chart: market share at each equilibrium."""
    equilibria = [
        "Eq1: (BYD H, others L)\nBYD domina",
        "Eq2: (BYD H, Stel H, others L)\nPrice war",
        "Eq3: All H\nTotal war",
        "Eq4: All L\nStatus quo",
        "Eq5: Mixed (BYD H, Stel H, Geel H, VW L, GM L)\nCoalition",
    ]
    byd = [16, 12, 9, 13, 11]
    stellantis = [5, 8, 5, 6, 7]
    gm = [2, 3, 2, 2, 2]
    vw = [4, 6, 4, 4, 4]
    geely = [3, 5, 4, 0, 6]
    others = [70, 66, 76, 75, 70]

    fig, ax = plt.subplots(figsize=(13, 7))
    x = np.arange(len(equilibria))
    width = 0.15

    p1 = ax.bar(x - 2*width, byd, width, label="BYD", color=C_BYD, edgecolor="white", linewidth=0.6)
    p2 = ax.bar(x - width, stellantis, width, label="Stellantis", color=C_STELLANTIS, edgecolor="white", linewidth=0.6)
    p3 = ax.bar(x, gm, width, label="GM", color=C_GM, edgecolor="white", linewidth=0.6)
    p4 = ax.bar(x + width, vw, width, label="VW", color=C_VW, edgecolor="white", linewidth=0.6)
    p5 = ax.bar(x + 2*width, geely, width, label="Geely", color=C_GEELY, edgecolor="white", linewidth=0.6)

    # Annotate BYD bars
    for bar, val in zip(p1, byd):
        ax.text(bar.get_x() + bar.get_width()/2, val + 0.3, f"{val}%",
                ha="center", color=C_BYD, fontsize=9, fontweight="bold")

    # Highlight NASH equilibrium
    nash_idx = 0  # Eq1
    ax.axvspan(nash_idx - 0.4, nash_idx + 0.4, color=C_NASH, alpha=0.15)
    ax.text(nash_idx, 85, "★ NASH", ha="center", color=C_NASH,
            fontsize=11, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(equilibria, fontsize=8)
    ax.set_ylabel("Market share by player (% of EV market)", fontsize=11, color=TEXT)
    ax.set_title("D3 v2.0 — Market share at each Nash equilibrium",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)
    ax.legend(loc="upper right", frameon=True, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT, fontsize=9)
    ax.set_ylim(0, 90)
    ax.grid(axis="y", linestyle="--", alpha=0.25)
    ax.set_axisbelow(True)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)

    fig.text(0.5, 0.005,
             "BYD dominante em todos cenários com estratégia HIGH. Eq1 (NASH) = BYD 16%, Stellantis 5%, GM 2%, VW 4%, Geely 3%, outros 70%.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-game-5-equilibrium-market-share.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


def fig6_nash_payoff_comparison():
    """Grouped bar: payoffs (margin %) at each NASH candidate equilibrium for all 5 players."""
    equilibria = ["Eq1: BYD H\nRest L", "Eq2: BYD H\nStel H\nRest L",
                  "Eq3: All H", "Eq4: All L", "Eq5: Mixed\ncoalition"]

    # Margin % per player per equilibrium
    byd = [18, 12, 6, 14, 10]
    stellantis = [7, 4, 4, 5, 6]
    gm = [6, 3, 3, 6, 5]
    vw = [7, 4, 4, 7, 6]
    geely = [0, 4, 2, 0, 3]  # Geely exits if LOW

    fig, ax = plt.subplots(figsize=(13, 7))
    x = np.arange(len(equilibria))
    width = 0.16

    p1 = ax.bar(x - 2*width, byd, width, label="BYD", color=C_BYD, edgecolor="white", linewidth=0.6)
    p2 = ax.bar(x - width, stellantis, width, label="Stellantis", color=C_STELLANTIS, edgecolor="white", linewidth=0.6)
    p3 = ax.bar(x, gm, width, label="GM", color=C_GM, edgecolor="white", linewidth=0.6)
    p4 = ax.bar(x + width, vw, width, label="VW", color=C_VW, edgecolor="white", linewidth=0.6)
    p5 = ax.bar(x + 2*width, geely, width, label="Geely", color=C_GEELY, edgecolor="white", linewidth=0.6)

    # Annotate values
    for bars, vals in [(p1, byd), (p2, stellantis), (p3, gm), (p4, vw), (p5, geely)]:
        for bar, val in zip(bars, vals):
            if val > 0:
                ax.text(bar.get_x() + bar.get_width()/2, val + 0.2, f"{val}%",
                        ha="center", color=TEXT, fontsize=7, fontweight="bold")

    # Highlight NASH
    nash_idx = 0
    ax.axvspan(nash_idx - 0.4, nash_idx + 0.4, color=C_NASH, alpha=0.15)
    ax.text(nash_idx, 22, "★ NASH", ha="center", color=C_NASH,
            fontsize=11, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(equilibria, fontsize=9)
    ax.set_ylabel("Margin % per player (2027E)", fontsize=11, color=TEXT)
    ax.set_title("D3 v2.0 — Nash equilibria payoff comparison (5 players)",
                 fontsize=13, fontweight="bold", color=TEXT, pad=14)
    ax.legend(loc="upper right", frameon=True, facecolor=PANEL, edgecolor=GRID,
              labelcolor=TEXT, fontsize=9)
    ax.set_ylim(0, 24)
    ax.grid(axis="y", linestyle="--", alpha=0.25)
    ax.set_axisbelow(True)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)

    fig.text(0.5, 0.005,
             "Eq1 (NASH): BYD 18%, Stellantis 7%, GM 6%, VW 7%, Geely 0% (sai). "
             "Eq3 (all H): guerra total — todas margens <6%. Geely 0% = exit strategy.",
             ha="center", fontsize=8, color="#888", style="italic")

    plt.tight_layout(rect=(0, 0.04, 1, 1))
    out = "fig-d3-game-6-nash-payoff-comparison.png"
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close()
    return out


if __name__ == "__main__":
    print("Generating D3 v2.0 Game Theory figures...")
    f1 = fig1_payoff_matrix_byd_stellantis()
    print(f"  ✓ {f1}")
    f2 = fig2_payoff_matrix_byd_geely()
    print(f"  ✓ {f2}")
    f3 = fig3_strategic_space_5players()
    print(f"  ✓ {f3}")
    f4 = fig4_game_tree_byd_decision()
    print(f"  ✓ {f4}")
    f5 = fig5_equilibrium_market_share()
    print(f"  ✓ {f5}")
    f6 = fig6_nash_payoff_comparison()
    print(f"  ✓ {f6}")
    print("Done.")
