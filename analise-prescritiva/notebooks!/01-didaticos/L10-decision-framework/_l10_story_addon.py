"""Generate L10 story narrative PNGs for the Decision Framework notebook.

Outputs to outputs/learning/l10_*.png:
  - l10_dashboard_composite.png     Dashboard-style composite visualization
  - l10_decision_tree.png           Decision tree flowchart
  - l10_executive_checklist.png     Executive action checklist
"""
import json
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
if not (NOTEBOOK_ROOT / "outputs" / "nb01_results.json").exists():
    NOTEBOOK_ROOT = Path.cwd()

OUT = NOTEBOOK_ROOT / "outputs" / "learning"
OUT.mkdir(parents=True, exist_ok=True)

def load(tag):
    p = NOTEBOOK_ROOT / "outputs" / (tag + "_results.json")
    return json.load(p.open(encoding="utf-8")) if p.exists() else {}

NB = {tag: load(tag) for tag in ["nb01","nb02","nb03","nb04","nb05","nb06","nb07","nb08"]}

BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR, VERDE = "#9333ea", "#ea580c", "#22c55e"

COMPOSITE_4D = 71.8
TARGET = 60.0
SCORES_4D = {"cambio": 78, "regulatorio": 70, "supply": 85, "macro": 52}
WEIGHTS_4D = {"cambio": 0.30, "regulatorio": 0.30, "supply": 0.20, "macro": 0.20}

DIM_11 = [
    ("S1", "Cambio GARCH", 78, 0.18),
    ("S2", "Supply HHI", 85, 0.15),
    ("S3", "BNDES ViE", 70, 0.20),
    ("S4", "Pricing defensivo", 72, 0.08),
    ("S5", "Parcerias CATL/EVE", 85, 0.08),
    ("S6", "Macro IPCA/Selic", 70, 0.10),
    ("S7", "ESG lista suja", 92, 0.10),
    ("S8", "Ramp SKD/CKD", 77, 0.08),
    ("S9", "Demanda EV share", 72, 0.07),
    ("S10", "Tarifa 35% jan/27", 78, 0.05),
    ("S11", "Competitivo Nash", 82, 0.10),
]
SCORES_11D = {d[0]: d[2] for d in DIM_11}

plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": BG,
    "axes.edgecolor": GRID, "axes.labelcolor": MUTED,
    "xtick.color": MUTED, "ytick.color": MUTED,
    "text.color": INK, "font.family": "DejaVu Sans",
    "font.size": 11, "axes.grid": False,
})

def style_axes(ax):
    for s in ax.spines.values():
        s.set_color(GRID)
    ax.tick_params(colors=MUTED, length=0)
    ax.set_facecolor(BG)

def chip(ax, x, y, w, h, label, fc, ec="none", text_color=INK, fontsize=10, weight="bold"):
    box = FancyBboxPatch((x, y), w, h,
                         boxstyle="round,pad=0.02,rounding_size=0.10",
                         linewidth=1.2, edgecolor=ec, facecolor=fc)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2, label, ha="center", va="center",
            color=text_color, fontsize=fontsize, fontweight=weight)


def build_dashboard():
    fig = plt.figure(figsize=(14, 9), facecolor=BG)
    gs = fig.add_gridspec(3, 4, hspace=0.55, wspace=0.32,
                          left=0.05, right=0.97, top=0.90, bottom=0.05)

    fig.suptitle("L10 . Decision Framework - Composite Dashboard",
                 fontsize=18, fontweight="bold", color=INK, y=0.965)
    fig.text(0.5, 0.915,
             "Stakeholder composite 71,8 (AMBER - modo tensao) - leitura unica para a reuniao",
             ha="center", va="center", fontsize=10.5, color=MUTED)

    kpis = [
        ("Composite", "71,8", "AMBER . modo tensao", AMBAR),
        ("VaR-95", "R$ 3,11 bi", "Pior cenario mensal", TIJOLO),
        ("Gargalo execucao", "9,5 d", "Meta 5 d . atrasado", VIOLETA),
        ("Backtest", "100%", "5 TP . 1 FP . 0 FN", VERDE),
    ]
    for i, (label, value, sub, color) in enumerate(kpis):
        ax = fig.add_subplot(gs[0, i])
        ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
        style_axes(ax)
        chip(ax, 0.02, 0.05, 0.96, 0.92, "", "#161b22", ec=color, text_color=INK)
        ax.text(0.5, 0.85, label, ha="center", va="center",
                color=MUTED, fontsize=10.5, fontweight="bold")
        ax.text(0.5, 0.50, value, ha="center", va="center",
                color=color, fontsize=22, fontweight="bold")
        ax.text(0.5, 0.18, sub, ha="center", va="center",
                color=MUTED, fontsize=9)

    ax_g = fig.add_subplot(gs[1, :2])
    ax_g.set_xlim(0, 100); ax_g.set_ylim(-0.6, 1.0); ax_g.axis("off")
    ax_g.add_patch(patches.Rectangle((0, 0), 65, 0.45, color=VERDE, alpha=0.55))
    ax_g.add_patch(patches.Rectangle((65, 0), 15, 0.45, color=AMBAR, alpha=0.65))
    ax_g.add_patch(patches.Rectangle((80, 0), 20, 0.45, color=TIJOLO, alpha=0.65))
    ax_g.add_patch(patches.Rectangle((COMPOSITE_4D - 0.4, -0.18), 0.8, 0.82,
                                     color=INK, alpha=0.95))
    ax_g.text(0, -0.32, "GREEN\n0-65", ha="center", color=VERDE, fontsize=9, fontweight="bold")
    ax_g.text(65, -0.32, "AMBER\n65-80", ha="center", color=AMBAR, fontsize=9, fontweight="bold")
    ax_g.text(80, -0.32, "RED\n80-100", ha="center", color=TIJOLO, fontsize=9, fontweight="bold")
    ax_g.text(COMPOSITE_4D, 0.95, f"{COMPOSITE_4D}", ha="center",
              color=AMBAR, fontsize=18, fontweight="bold")
    ax_g.text(COMPOSITE_4D, 0.72, "composite atual", ha="center", color=MUTED, fontsize=9)
    ax_g.text(TARGET, -0.42, f"meta 12m: {TARGET}", ha="center",
              color=VERDE, fontsize=9, style="italic")
    ax_g.set_title("Composite stakeholder . faixa operacional",
                   color=INK, fontsize=11, loc="left", pad=10)

    ax_d = fig.add_subplot(gs[1, 2:])
    dims = list(SCORES_4D.keys())
    s = [SCORES_4D[d] for d in dims]
    w = [WEIGHTS_4D[d] for d in dims]
    contrib = [a*b for a,b in zip(s, w)]
    cores = [AZUL, TEAL, TIJOLO, VIOLETA]
    bars = ax_d.barh(dims, contrib, color=cores, edgecolor=INK, linewidth=1.0)
    for bar, c, sc, wt in zip(bars, contrib, s, w):
        ax_d.text(bar.get_width()+0.4, bar.get_y()+bar.get_height()/2,
                  f"{c:.1f} pts  (peso {wt:.2f} x score {sc:.0f})",
                  va="center", color=MUTED, fontsize=9)
    style_axes(ax_d)
    ax_d.set_xlim(0, 30)
    ax_d.set_title("Decomposicao do composite - contribuicao por dimensao",
                   color=INK, fontsize=11, loc="left", pad=10)
    ax_d.invert_yaxis()

    ax_r = fig.add_subplot(gs[2, :2], projection="polar")
    codes = [d[0] for d in DIM_11]
    scores = [d[2] for d in DIM_11]
    n = len(codes)
    angles = [c/float(n)*2*np.pi for c in range(n)] + [0]
    r = scores + [scores[0]]
    ax_r.plot(angles, r, color=AZUL, linewidth=2.2)
    ax_r.fill(angles, r, color=AZUL, alpha=0.30)
    ax_r.set_xticks(angles[:-1])
    ax_r.set_xticklabels(codes, color=MUTED, fontsize=9)
    ax_r.set_yticks([65, 80])
    ax_r.set_yticklabels(["65", "80"], color=MUTED, fontsize=8)
    ax_r.set_ylim(0, 100)
    ax_r.tick_params(colors=MUTED)
    ax_r.grid(color=GRID, linewidth=0.7, alpha=0.6)
    ax_r.spines["polar"].set_color(GRID)
    ax_r.set_title("Radar das 11 dimensoes (maior = pior)",
                   color=INK, fontsize=11, pad=18)

    ax_t = fig.add_subplot(gs[2, 2:])
    ax_t.set_xlim(0, 4); ax_t.set_ylim(0, 7); ax_t.axis("off")
    style_axes(ax_t)
    states = ["GREEN", "AMBER", "RED"]
    state_cols = [VERDE, AMBAR, TIJOLO]
    dims_short = ["S1 Cambio","S2 Supply","S3 BNDES","S4 Pricing","S5 Parcerias","S6 Macro"]
    state_now = []
    for d, sc in zip(dims_short, [SCORES_11D["S1"], SCORES_11D["S2"],
                                  SCORES_11D["S3"], SCORES_11D["S4"],
                                  SCORES_11D["S5"], SCORES_11D["S6"]]):
        state_now.append("RED" if sc>=80 else ("AMBER" if sc>=65 else "GREEN"))
    ax_t.text(2.0, 6.6, "Estado atual por dimensao (gatilho)",
              ha="center", color=INK, fontsize=11, fontweight="bold")
    col_x = [0.6, 1.7, 2.8]
    for i, (st, col) in enumerate(zip(states, state_cols)):
        ax_t.text(col_x[i], 6.0, st, ha="center", color=col,
                  fontsize=10, fontweight="bold")
    for r_idx, dim in enumerate(dims_short):
        y = 5.2 - r_idx*0.78
        ax_t.text(0.0, y, dim, ha="left", color=MUTED, fontsize=9, va="center")
        for i, col in enumerate(state_cols):
            fc = col if state_now[r_idx]==states[i] else "#1c2128"
            ec = col if state_now[r_idx]==states[i] else GRID
            chip(ax_t, col_x[i]-0.4, y-0.27, 0.85, 0.55, "o", fc, ec=ec,
                 text_color=BG if state_now[r_idx]==states[i] else MUTED, fontsize=11)

    plt.savefig(OUT / "l10_dashboard_composite.png",
                dpi=140, facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def build_decision_tree():
    fig, ax = plt.subplots(figsize=(12, 7), facecolor=BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 7); ax.axis("off")
    style_axes(ax)

    fig.suptitle("L10 . Decision Tree - Sinal -> Acao (Kill Switch + Composite)",
                 fontsize=15, fontweight="bold", color=INK, y=0.98)
    fig.text(0.5, 0.935,
             "Fluxograma pre-acordado: 4 kill switches (binarios) + composite (gradual) -> acoes",
             ha="center", va="center", fontsize=10, color=MUTED)

    def node(x, y, w, h, label, fc, ec=INK, tc=INK, fs=9, weight="bold"):
        box = FancyBboxPatch((x-w/2, y-h/2), w, h,
                             boxstyle="round,pad=0.04,rounding_size=0.15",
                             linewidth=1.4, edgecolor=ec, facecolor=fc)
        ax.add_patch(box)
        ax.text(x, y, label, ha="center", va="center",
                color=tc, fontsize=fs, fontweight=weight)

    def arrow(x0, y0, x1, y1, color=MUTED, lw=1.4, ls="-"):
        ax.add_patch(FancyArrowPatch((x0, y0), (x1, y1),
                                     arrowstyle="-|>", mutation_scale=12,
                                     color=color, linewidth=lw,
                                     linestyle=ls))

    node(6.0, 6.1, 5.4, 0.5,
         "Evento novo . PTAX / litio / BNDES / ESG / supply / macro",
         "#1c2128", ec=AZUL, fs=9.5)

    node(2.5, 5.2, 3.4, 0.45, "1 . Kill switch disparou?", "#161b22", ec=TIJOLO, fs=9)
    node(9.5, 5.2, 3.4, 0.45, "2 . Composite mudou de faixa?", "#161b22", ec=AZUL, fs=9)

    arrow(5.0, 6.0, 3.6, 5.4, color=TIJOLO)
    arrow(7.0, 6.0, 8.4, 5.4, color=AZUL)

    ks = [
        ("PTAX vol 30d >= 30% (5 d)", "hedge 100% . 1h", TIJOLO),
        ("BNDES funding negado", "bridge R$ 800M . 1h", TIJOLO),
        ("CATL atraso > 60 d", "EVE backup . 12h", TIJOLO),
        ("Litio >= US$ 80k/t (3 m)", "spot + hedge S5 . 24h", TIJOLO),
    ]
    for i, (cond, act, col) in enumerate(ks):
        y = 4.3 - i*0.85
        node(2.5, y, 3.0, 0.42, cond, "#161b22", ec=col, fs=8.5)
        arrow(2.5, 4.95, 2.5, y+0.25, color=col, lw=1.0)
        node(5.4, y, 2.7, 0.42, act, "#0d1117", ec=col, fs=8.5)
        arrow(4.05, y, 4.0, y, color=col, lw=1.2)

    states_tree = [
        ("GREEN (< 65) . Monitorar . R$ 0", VERDE),
        ("AMBER (65-80) . Hedge ativo . 5 min", AMBAR),
        ("RED (>= 80) . Comite . 60 min", TIJOLO),
    ]
    for i, (cond, col) in enumerate(states_tree):
        y = 4.1 - i*0.85
        node(9.5, y, 3.6, 0.42, cond, "#161b22", ec=col, fs=8.5)
        arrow(9.5, 4.95, 9.5, y+0.25, color=col, lw=1.0)

    footer_y = 0.30
    chip(ax, 0.5, footer_y, 11.0, 0.55,
         "Regra soberana: kill switch ignora composite. "
         "Histerese: 5 d para entrar em RED, 14 d para sair.",
         "#1c2128", ec=AMBAR, text_color=AMBAR, fontsize=9.5, weight="bold")

    plt.savefig(OUT / "l10_decision_tree.png",
                dpi=140, facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def build_checklist():
    import textwrap
    fig, ax = plt.subplots(figsize=(14, 8), facecolor=BG)
    ax.set_xlim(0, 14); ax.set_ylim(0, 8); ax.axis("off")
    style_axes(ax)

    fig.suptitle("L10 . Executive Action Checklist - O que levar para a reuniao",
                 fontsize=16, fontweight="bold", color=INK, y=0.97)
    fig.text(0.5, 0.93,
             "Estado atual: 71,8 (AMBER) . custo R$ 196M/ano . VaR-95 R$ 3,11 bi",
             ha="center", va="center", fontsize=10.5, color=AMBAR, fontweight="bold")

    sections = [
        ("AGORA . 72h", AMBAR, [
            ("Convocar Risk Officer - revisao do composite 71,8",
             "CEO . R$ 0 . 24h"),
            ("Ativar hedge cambial: PTAX vol 30d em zona AMBER",
             "Risk Officer . R$ 18M . 5 min"),
            ("Briefing CFO: bridge financing R$ 800M standby",
             "CFO . R$ 0 (facility) . 60 min"),
        ]),
        ("CURTO PRAZO . 2 sem", AZUL, [
            ("Renegociar contrato CATL - atraso > 60 d ameaca S5",
             "Head Procurement . R$ 5M . 14 d"),
            ("Validar lista suja ESG - score 92 = kill switch BNDES",
             "Head Gov Rel . R$ 12M . 10 d"),
            ("Recalibrar gatilho S6 (macro) com filtro carry trade",
             "Risk Officer . R$ 0 . 7 d"),
        ]),
        ("MEDIO PRAZO . 90 d", TEAL, [
            ("Implementar dashboard (sinal -> acao < 5 d)",
             "CIO + Risk Officer . R$ 8M . 90 d"),
            ("Diversificar fornecedores de litio - HHI refino 4.558",
             "Head Supply . R$ 45M . 6 m"),
            ("Acelerar nacionalizacao SKD 45% -> CKD 70%",
             "COO . R$ 120M . 12 m"),
        ]),
        ("CONTINUO", VERDE, [
            ("Backtesting mensal - manter 0 FN mesmo com algum FP",
             "Analytics . R$ 1M/mes . recorrente"),
            ("Revisao trimestral dos 11 pesos do framework D3",
             "CSO . R$ 0 . trimestral"),
            ("Atualizar S7 ESG em tempo real (lista suja + DD)",
             "Compliance . R$ 2M/mes . continuo"),
        ]),
    ]

    y_top = 7.4
    col_x = [0.30, 3.75, 7.20, 10.65]
    col_w = 3.30

    for i, (title, col, items) in enumerate(sections):
        x = col_x[i]
        chip(ax, x, y_top - 0.13, col_w, 0.5, title, col, ec="none",
             text_color=BG, fontsize=11)
        y_cursor = y_top - 0.95
        for j, (task, meta) in enumerate(items):
            h_task = 1.45
            box = FancyBboxPatch((x, y_cursor - h_task), col_w, h_task,
                                 boxstyle="round,pad=0.04,rounding_size=0.10",
                                 linewidth=1.1, edgecolor=GRID, facecolor="#161b22")
            ax.add_patch(box)
            cb = FancyBboxPatch((x + 0.10, y_cursor - 0.30), 0.30, 0.30,
                                boxstyle="round,pad=0.01,rounding_size=0.04",
                                linewidth=1.2, edgecolor=col, facecolor=BG)
            ax.add_patch(cb)
            ax.text(x + 0.25, y_cursor - 0.15, "v",
                    ha="center", va="center", color=col, fontsize=10, fontweight="bold")
            task_lines = textwrap.wrap(task, width=32)
            meta_lines = textwrap.wrap(meta, width=38)
            ax.text(x + 0.55, y_cursor - 0.25, "\n".join(task_lines),
                    color=INK, fontsize=8.5, fontweight="bold", va="top")
            ax.text(x + 0.55, y_cursor - 0.85, "\n".join(meta_lines),
                    color=MUTED, fontsize=8, va="top", style="italic")
            y_cursor -= h_task + 0.20

    foot = FancyBboxPatch((0.30, 0.20), 13.65, 0.65,
                          boxstyle="round,pad=0.04,rounding_size=0.10",
                          linewidth=1.4, edgecolor=AMBAR, facecolor="#1c2128")
    ax.add_patch(foot)
    ax.text(7.125, 0.52,
            'Frase de abertura: "71,8 sobre 100 - modo tensao, nao crise. '
            'VaR-95 R$ 3,11 bi. ESG = 92 desliga BNDES. '
            'Zero falso negativo em 6 eventos. Gargalo: 9,5 d para agir (meta 5 d)."',
            ha="center", va="center", color=AMBAR, fontsize=9.5, fontweight="bold")

    plt.savefig(OUT / "l10_executive_checklist.png",
                dpi=140, facecolor=BG, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    build_dashboard()
    build_decision_tree()
    build_checklist()
    print("OK")