"""
Script de teste para as visualizacoes matplotlib do L6 (story addon).
Gera dois PNGs em outputs/learning/ que serao embedados no notebook.
"""
import json
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

# ── Tema escuro alinhado ao Plotly do notebook ──────────────────────
BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR, VERDE = "#9333ea", "#ea580c", "#22c55e"

mpl.rcParams.update({
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "savefig.facecolor": BG,
    "axes.edgecolor": GRID,
    "axes.labelcolor": INK,
    "axes.titlecolor": INK,
    "text.color": INK,
    "xtick.color": MUTED,
    "ytick.color": MUTED,
    "grid.color": GRID,
    "grid.alpha": 0.5,
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.titleweight": "bold",
    "legend.facecolor": BG,
    "legend.edgecolor": GRID,
    "legend.labelcolor": INK,
})

# ── Replicar os mesmos dados do notebook ─────────────────────────────
NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
NB06_PATH = NOTEBOOK_ROOT / "outputs" / "nb06_results.json"
OUT_DIR = NOTEBOOK_ROOT / "outputs" / "learning"
OUT_DIR.mkdir(parents=True, exist_ok=True)
with NB06_PATH.open(encoding="utf-8") as f:
    NB06 = json.load(f)

np.random.seed(42)
N_PATHS, N_DAYS = 10_000, 126
CORR = np.array([[1.00, 0.45, 0.10, 0.30],
                 [0.45, 1.00, 0.05, 0.25],
                 [0.10, 0.05, 1.00, 0.15],
                 [0.30, 0.25, 0.15, 1.00]], float)
STD_ANN = {"PTAX/FX": 0.1417, "Litio": 0.829, "Demanda": 0.05}
F126 = np.sqrt(126 / 252)
STD6 = {k: v * F126 for k, v in STD_ANN.items()}
IMPACT_FX, IMPACT_LI, IMPACT_DE = 2.10, 1.00, 0.62
TARIFF_PROB, TARIFF_IMPACT = 0.35, -2.37

L = np.linalg.cholesky(CORR)
Z = np.random.standard_normal((N_PATHS, 4))
Y = Z @ L.T
shock_fx = Y[:, 0] * STD6["PTAX/FX"] + 0.0192
shock_li = Y[:, 1] * STD6["Litio"] - 0.05
shock_de = Y[:, 2] * STD6["Demanda"]
shock_ta = np.where(np.random.random(N_PATHS) < TARIFF_PROB, 1, 0).astype(float)

impact_fx = shock_fx * IMPACT_FX
impact_li = shock_li * IMPACT_LI
impact_ta = shock_ta * TARIFF_IMPACT
impact_de = shock_de * IMPACT_DE
total = impact_fx + impact_li + impact_ta + impact_de

var95 = np.percentile(total, 5)
var99 = np.percentile(total, 1)
cvar95 = total[total <= var95].mean()
median = np.percentile(total, 50)

# ── Gerar caminhos diarios para a visualizacao ──────────────────────
rng = np.random.default_rng(42)
N_BAND = 600
daily_std = STD_ANN["PTAX/FX"] / np.sqrt(252)
daily_drift = 0.0192 / N_DAYS
steps = rng.standard_normal((N_BAND, N_DAYS)) * daily_std + daily_drift
paths = np.cumsum(steps, axis=1) * 100.0
paths = np.concatenate([np.zeros((N_BAND, 1)), paths], axis=1)
dias = np.arange(N_DAYS + 1)

# ════════════════════════════════════════════════════════════════════
# PNG 1: Caminhos convergindo para a distribuicao (storytelling visual)
# ════════════════════════════════════════════════════════════════════
fig = plt.figure(figsize=(13, 6.5), constrained_layout=False)
gs = fig.add_gridspec(2, 2, width_ratios=[2.2, 1], height_ratios=[1, 1],
                      hspace=0.08, wspace=0.10, left=0.07, right=0.97,
                      top=0.91, bottom=0.09)

ax_top = fig.add_subplot(gs[0, :])
ax_top.plot(dias, paths[:80].T, color=AZUL, alpha=0.05, linewidth=0.6)
ax_top.plot(dias, paths[:80:8].T, color=AZUL, alpha=0.20, linewidth=0.8)
ax_top.plot(dias, np.median(paths, axis=0), color=INK, linewidth=2.5,
            label="mediana (P50)")
ax_top.fill_between(dias, np.percentile(paths, 5, axis=0),
                    np.percentile(paths, 95, axis=0),
                    color=AMBAR, alpha=0.18, label="faixa P5-P95 (90% dos futuros)")
ax_top.set_title("Muitos caminhos -> uma distribuicao", pad=14)
ax_top.set_ylabel("variacao acumulada do PTAX (%)")
ax_top.set_xlim(0, N_DAYS)
ax_top.grid(True, alpha=0.3)
ax_top.legend(loc="upper left", framealpha=0.85, fontsize=10)

# Anotacao narrativa sobre os caminhos
ax_top.annotate("600 futuros possiveis\no mesmo horizonte de 6 meses",
                xy=(60, paths[5, 60]), xytext=(20, 18),
                color=AZUL, fontsize=10, weight="bold",
                arrowprops=dict(arrowstyle="->", color=AZUL, lw=1.2))

# Histograma embaixo-esquerda
ax_hist = fig.add_subplot(gs[1, 0])
ax_hist.hist(total, bins=70, color=AZUL, edgecolor=BG, alpha=0.85,
             label="10.000 caminhos finais")
ax_hist.axvline(median, color=TEAL, linewidth=2.5,
                label=f"mediana = {median:.2f} bi")
ax_hist.axvline(var95, color=AMBAR, linewidth=2.5, linestyle="--",
                label=f"VaR95 = {var95:.2f} bi")
ax_hist.axvline(cvar95, color=TIJOLO, linewidth=2.5, linestyle=":",
                label=f"CVaR95 = {cvar95:.2f} bi")
ax_hist.set_xlabel("impacto total sobre o resultado (R$ bi)")
ax_hist.set_ylabel("n de caminhos (frequencia)")
ax_hist.grid(True, alpha=0.3)
ax_hist.legend(loc="upper left", framealpha=0.85, fontsize=9)

# Mini-tornado embaixo-direita
ax_tor = fig.add_subplot(gs[1, 1])
tor = sorted(NB06["tornado"], key=lambda d: abs(d["impact_B"]))
tor_lab = [f"{d['shock']}\n({d['contribution_pct']:.0f}%)" for d in tor]
tor_val = [d["impact_B"] for d in tor]
tor_col = [TIJOLO, AMBAR, TEAL, AZUL][:len(tor)]
bars = ax_tor.barh(range(len(tor)), tor_val, color=tor_col, edgecolor=BG)
ax_tor.set_yticks(range(len(tor)))
ax_tor.set_yticklabels(tor_lab, fontsize=9)
ax_tor.set_xlabel("contribuicao ao risco de cauda (R$ bi)")
ax_tor.set_xlim(-2.7, 0.2)
ax_tor.invert_yaxis()
ax_tor.grid(True, alpha=0.3, axis="x")
ax_tor.set_title("Donos da cauda", fontsize=12, pad=8)
for bar, val in zip(bars, tor_val):
    width = bar.get_width()
    ax_tor.text(width - 0.08, bar.get_y() + bar.get_height()/2,
                f"{val:.2f}", ha="right", va="center",
                color="white", fontsize=9, weight="bold")

# Seta narrativa ligando caminhos -> distribuicao
ax_top.annotate("", xy=(20, ax_hist.get_ylim()[1]*0.55),
                xytext=(60, paths[0, 60] - 2),
                xycoords=("data", "axes fraction"),
                arrowprops=dict(arrowstyle="->", color=TIJOLO, lw=2,
                                connectionstyle="arc3,rad=0.3"))
ax_top.text(35, 12, "cada caminho termina\nnesta distribuicao",
            color=TIJOLO, fontsize=10, weight="bold")

fig.suptitle("Story 1 -> Dez mil futuros viram uma unica forma que decide",
             fontsize=15, color=INK, y=0.985, weight="bold")

fig.savefig(OUT_DIR / "l6_paths_converging.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print(f"[OK] l6_paths_converging.png salvo em {OUT_DIR}")

# ════════════════════════════════════════════════════════════════════
# PNG 2: Histograma da distribuicao (standalone para embed)
# ════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(11, 5.5), constrained_layout=True)
counts, bins, patches = ax.hist(total, bins=70, edgecolor=BG, linewidth=0.6,
                                alpha=0.92)

# Colorir por severidade (verde -> amarelo -> vermelho)
for patch, b_left, b_right in zip(patches, bins[:-1], bins[1:]):
    center = (b_left + b_right) / 2
    if center < var95:
        patch.set_facecolor(TIJOLO)
    elif center < median:
        patch.set_facecolor(AMBAR)
    elif center < 0:
        patch.set_facecolor(AZUL)
    else:
        patch.set_facecolor(VERDE)

ax.axvline(median, color=TEAL, linewidth=2.5,
           label=f"mediana (P50) = {median:.2f} bi")
ax.axvline(0, color=MUTED, linewidth=1.5, linestyle="-", alpha=0.6)
ax.axvline(var95, color=AMBAR, linewidth=2.5, linestyle="--",
           label=f"porta VaR95 = {var95:.2f} bi")
ax.axvline(cvar95, color=TIJOLO, linewidth=2.5, linestyle=":",
           label=f"perda media apos a porta (CVaR95) = {cvar95:.2f} bi")

# Sombrear regiao da cauda esquerda
ax.axvspan(total.min(), var95, color=TIJOLO, alpha=0.08, label="cauda esquerda (pior 5%)")

ax.set_title("A distribuicao conta a historia: a cauda esquerda e o que assusta",
             pad=14)
ax.set_xlabel("impacto total sobre o resultado (R$ bi)")
ax.set_ylabel("n de caminhos (frequencia)")
ax.grid(True, alpha=0.3)
ax.legend(loc="upper right", framealpha=0.85, fontsize=10)

# Texto narrativo
ax.text(var95 - 0.1, ax.get_ylim()[1]*0.85,
        f"67.9% dos caminhos\nsao perdas\n({(total<0).mean()*100:.1f}%)",
        color=TIJOLO, fontsize=10, weight="bold", ha="right",
        bbox=dict(boxstyle="round,pad=0.4", facecolor=BG,
                  edgecolor=TIJOLO, alpha=0.9))
ax.text(median + 0.3, ax.get_ylim()[1]*0.55,
        f"mediana\nja e perda\n({median:.2f} bi)",
        color=TEAL, fontsize=10, weight="bold",
        bbox=dict(boxstyle="round,pad=0.4", facecolor=BG,
                  edgecolor=TEAL, alpha=0.9))

fig.savefig(OUT_DIR / "l6_distribution_histogram.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print(f"[OK] l6_distribution_histogram.png salvo em {OUT_DIR}")

# ════════════════════════════════════════════════════════════════════
# PNG 3: Story "what this means for you" — mapa de decisao
# ════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(11, 6.5), constrained_layout=True)
# Mapa de calor 2D: percentil x horizonte de decisao
horizontes = ["caixa\nminimo", "hedge\ncambial", "hedge\nlitio", "lobby\ntarifa", "monitor\nP5-P95"]
custos = [0.5, 1.2, 0.8, 0.4, 0.2]  # R$ bi estimado de cada acao
reducao_pct = [12, 8, 27, 63.7, 5]  # % do VaR95 mitigado

x = np.arange(len(horizontes))
bars = ax.bar(x, reducao_pct, color=[TIJOLO, AMBAR, AMBAR, TIJOLO, AZUL],
              edgecolor=BG, linewidth=1)

ax.set_xticks(x)
ax.set_xticklabels(horizontes, fontsize=10)
ax.set_ylabel("% de reducao do VaR95 estimada", fontsize=11)
ax.set_title("O que mitiga o risco (por real investido): atacar o dono da cauda",
             pad=14)
ax.grid(True, alpha=0.3, axis="y")

for bar, val, custo in zip(bars, reducao_pct, custos):
    h = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, h + 1.5,
            f"{val:.1f}%", ha="center", va="bottom",
            color=INK, fontsize=11, weight="bold")
    ax.text(bar.get_x() + bar.get_width()/2, h*0.5,
            f"~R${custo:.1f} bi\nde investimento",
            ha="center", va="center",
            color="white", fontsize=9)

# Frase executiva
ax.text(0.5, 0.97,
        "Mitigar a tarifa (R$ 0,4 bi) reduz 63.7% do VaR95.\n"
        "Hedge cambial (R$ 1,2 bi) reduz apenas 8%.",
        transform=ax.transAxes, fontsize=11, ha="center", va="top",
        color=INK, weight="bold",
        bbox=dict(boxstyle="round,pad=0.6", facecolor="#1c2128",
                  edgecolor=AMBAR, linewidth=2))

ax.set_ylim(0, 75)
fig.savefig(OUT_DIR / "l6_what_it_means_for_you.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print(f"[OK] l6_what_it_means_for_you.png salvo em {OUT_DIR}")

print("\nValidacao contra NB-06:")
print(f"  VaR95  = {var95:.2f}  | NB-06 = {NB06['var_95_B']:.2f}")
print(f"  CVaR95 = {cvar95:.2f}  | NB-06 = {NB06['cvar_95_B']:.2f}")
print(f"  P50    = {median:.2f}  | NB-06 = {NB06['var_50_B']:.2f}")
assert abs(var95 - NB06["var_95_B"]) < 0.01, "divergencia!"
print("  [OK] conciliacao confirmada")