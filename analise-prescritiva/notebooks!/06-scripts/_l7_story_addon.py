"""
Story addon do L7 (Analise Multivariada).

Gera 3 PNGs em outputs/learning/ que sao embedados no notebook:
  l7_why_one_factor_fails.png  -> por que olhar um fator so nao basta
  l7_correlation_heatmap.png   -> matriz de correlacao com os 3 blocos
  l7_pca_explained.png         -> PCA explicado para executivos (8 -> 3)

Reproduz exatamente o dataset sintetico da setup cell do L7 (seed 42),
para que os numeros das figuras conciliem com l7_multivariate_executive.json.
"""
import json
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch

# ── Tema escuro alinhado ao Plotly do notebook ──────────────────────
BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR, VERDE = "#9333ea", "#ea580c", "#22c55e"
PANEL = "#1c2128"

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

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
OUT_DIR = NOTEBOOK_ROOT / "outputs" / "learning"
OUT_DIR.mkdir(parents=True, exist_ok=True)
with (NOTEBOOK_ROOT / "outputs" / "nb02_results.json").open(encoding="utf-8") as f:
    NB02 = json.load(f)


def pca_numpy(X_std, n_components=None):
    """PCA sobre a matriz de correlacao — identico ao helper do notebook."""
    R = np.corrcoef(X_std, rowvar=False)
    vals, vecs = np.linalg.eigh(R)
    order = np.argsort(vals)[::-1]
    vals, vecs = vals[order], vecs[:, order]
    if n_components is not None:
        vecs, vals = vecs[:, :n_components], vals[:n_components]
    for j in range(vecs.shape[1]):
        if np.abs(vecs[:, j]).max() > 0 and vecs[np.argmax(np.abs(vecs[:, j])), j] < 0:
            vecs[:, j] = -vecs[:, j]
    return X_std @ vecs, vecs * np.sqrt(vals), vals


# ── Mesmo dataset da setup cell (seed 42, 60 meses, 8 variaveis) ────
rng = np.random.default_rng(42)
N = 60
F1_tensao = rng.standard_normal(N) * 1.00
F2_bateria = rng.standard_normal(N) * 1.00
F3_mercado = rng.standard_normal(N) * 1.00
noise = rng.standard_normal((N, 8)) * 0.45

L = np.array([
    [0.85, 0.05, 0.10, 0.45],
    [0.85, 0.10, 0.05, 0.45],
    [0.75, 0.00, 0.05, 0.50],
    [0.05, 0.10, 0.85, 0.45],
    [0.05, 0.85, 0.10, 0.45],
    [0.10, 0.80, 0.05, 0.50],
    [0.05, 0.85, 0.10, 0.45],
    [0.05, 0.05, 0.80, 0.55],
])
factores = np.column_stack([F1_tensao, F2_bateria, F3_mercado])
X = factores @ L[:, :3].T + noise
nomes = ["PTAX", "Lítio", "Tarifa", "Demanda EV", "HHI refino",
         "HHI mineração", "Share CATL", "Frete"]
df = pd.DataFrame(X, columns=nomes)
df_z = (df - df.mean()) / df.std(ddof=1)
corr = df_z.corr().values

scores, loadings, vals3 = pca_numpy(df_z.values, n_components=3)
_, _, vals8 = pca_numpy(df_z.values, n_components=8)
ev = vals8 / vals8.sum()
cum = np.cumsum(ev)
meses = np.arange(1, N + 1)

# Ordem por bloco: geopolitica (0,1,2) | bateria (4,5,6) | mercado (3,7)
BLOCOS = [
    ("Geopolítica", [0, 1, 2], TIJOLO),
    ("Concentração", [4, 5, 6], AZUL),
    ("Mercado", [3, 7], TEAL),
]
ordem = [i for _, idxs, _ in BLOCOS for i in idxs]

# ════════════════════════════════════════════════════════════════════
# PNG 1 — Por que olhar UM fator nao basta
# ════════════════════════════════════════════════════════════════════
fig = plt.figure(figsize=(13.5, 7.6))
gs = fig.add_gridspec(3, 3, width_ratios=[1, 1, 1.35],
                      hspace=0.55, wspace=0.28,
                      left=0.06, right=0.975, top=0.86, bottom=0.075)

# Esquerda: 6 mini-paineis "cada um olhando so o seu numero"
mini_idx = [0, 1, 4, 6, 3, 7]
for k, vi in enumerate(mini_idx):
    ax = fig.add_subplot(gs[k // 2, k % 2])
    cor = next(c for _, idxs, c in BLOCOS if vi in idxs)
    ax.plot(meses, df_z.values[:, vi], color=MUTED, linewidth=1.1, alpha=0.9)
    ax.axhline(0, color=GRID, linewidth=0.8)
    ax.set_title(nomes[vi], fontsize=10, pad=4, color=cor)
    ax.set_xticks([]); ax.set_yticks([])
    ax.set_ylim(-3.2, 3.2)
    for s in ax.spines.values():
        s.set_color(GRID)

fig.text(0.235, 0.895, "Como o comitê vê hoje: um slide por variável",
         ha="center", fontsize=12, weight="bold", color=MUTED)
fig.text(0.235, 0.028,
         "Cada painel parece ruído independente.\n"
         "Oito donos, oito relatórios, nenhuma leitura conjunta.",
         ha="center", fontsize=10, color=MUTED, style="italic")

# Direita: as mesmas series sobrepostas, coloridas por bloco
ax_r = fig.add_subplot(gs[:, 2])
for label, idxs, cor in BLOCOS:
    for n_i, vi in enumerate(idxs):
        ax_r.plot(meses, df_z.values[:, vi], color=cor, linewidth=1.3,
                  alpha=0.55, label=label if n_i == 0 else None)
    media_bloco = df_z.values[:, idxs].mean(axis=1)
    ax_r.plot(meses, media_bloco, color=cor, linewidth=3.0, alpha=0.95)

ax_r.axhline(0, color=GRID, linewidth=1)
ax_r.set_title("A mesma coisa, empilhada: três comboios, não oito trens",
               fontsize=12, pad=10)
ax_r.set_xlabel("mês (60 meses sintéticos, semente 42)")
ax_r.set_ylabel("desvio-padrão em relação à média (z)")
ax_r.set_xlim(1, N)
ax_r.grid(True, alpha=0.28)
ax_r.legend(loc="upper left", fontsize=10, framealpha=0.9, ncol=3)

# Anotar um mes em que os tres blocos divergem
pico = int(np.argmax(np.abs(df_z.values[:, [0, 1, 2]].mean(axis=1)))) + 1
ax_r.axvline(pico, color=AMBAR, linewidth=1.6, linestyle="--", alpha=0.85)
ax_r.annotate(f"mês {pico}: PTAX, Lítio e Tarifa\nsobem JUNTOS — não é coincidência,\né o mesmo driver por trás",
              xy=(pico, df_z.values[pico - 1, [0, 1, 2]].mean()),
              xytext=(pico + 4, 2.45),
              fontsize=9.5, weight="bold", color=AMBAR,
              arrowprops=dict(arrowstyle="->", color=AMBAR, lw=1.4),
              bbox=dict(boxstyle="round,pad=0.35", facecolor=PANEL,
                        edgecolor=AMBAR, alpha=0.92))

# Seta narrativa ligando os dois lados
arrow = FancyArrowPatch((0.435, 0.47), (0.512, 0.47),
                        transform=fig.transFigure, figure=fig,
                        arrowstyle="-|>", mutation_scale=26,
                        color=VIOLETA, linewidth=2.6)
fig.patches.append(arrow)
fig.text(0.4735, 0.525, "multivariada", ha="center", fontsize=10,
         weight="bold", color=VIOLETA)

fig.suptitle("Story 1 · Por que olhar um fator por vez engana o comitê",
             fontsize=15.5, weight="bold", color=INK, y=0.965)
fig.savefig(OUT_DIR / "l7_why_one_factor_fails.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l7_why_one_factor_fails.png")

# ════════════════════════════════════════════════════════════════════
# PNG 2 — Heatmap da matriz de correlacao (blocos destacados)
# ════════════════════════════════════════════════════════════════════
corr_ord = corr[np.ix_(ordem, ordem)]
labels_ord = [nomes[i] for i in ordem]

cmap = mpl.colors.LinearSegmentedColormap.from_list(
    "l7_div", [(0.00, VIOLETA), (0.25, "#1e3a8a"), (0.50, BG),
               (0.75, TIJOLO), (1.00, AMBAR)])

fig, (ax, ax_cb) = plt.subplots(
    1, 2, figsize=(11.6, 8.6), gridspec_kw={"width_ratios": [30, 1]},
    constrained_layout=True)

im = ax.imshow(corr_ord, cmap=cmap, vmin=-1, vmax=1)
ax.set_xticks(range(8), labels_ord, rotation=32, ha="right", fontsize=10.5)
ax.set_yticks(range(8), labels_ord, fontsize=10.5)

# Anotar cada celula
for i in range(8):
    for j in range(8):
        v = corr_ord[i, j]
        ax.text(j, i, f"{v:.2f}", ha="center", va="center",
                fontsize=10, color=INK,
                weight="bold" if (abs(v) >= 0.5 and i != j) else "normal")

# Grade fina entre celulas
ax.set_xticks(np.arange(-0.5, 8, 1), minor=True)
ax.set_yticks(np.arange(-0.5, 8, 1), minor=True)
ax.grid(which="minor", color=BG, linewidth=2.5)
ax.tick_params(which="minor", length=0)

# Contornar os tres blocos
pos = 0
for label, idxs, cor in BLOCOS:
    k = len(idxs)
    ax.add_patch(Rectangle((pos - 0.5, pos - 0.5), k, k, fill=False,
                           edgecolor=cor, linewidth=3.2, zorder=5))
    ax.text(pos + k / 2 - 0.5, pos - 0.72, label, ha="center", va="bottom",
            fontsize=11, weight="bold", color=cor, zorder=6)
    pos += k

# Colorir os rotulos por bloco
cores_lab = [next(c for _, idxs, c in BLOCOS if i in idxs) for i in ordem]
for tick, cor in zip(ax.get_xticklabels(), cores_lab):
    tick.set_color(cor)
for tick, cor in zip(ax.get_yticklabels(), cores_lab):
    tick.set_color(cor)

ax.set_title("Story 2 · Matriz de correlação — três blocos quentes,\n"
             "três histórias que o board precisa gerenciar",
             fontsize=14, pad=26)

cb = fig.colorbar(im, cax=ax_cb)
cb.set_label("correlação ρ", color=MUTED, fontsize=11)
cb.ax.tick_params(colors=MUTED)
cb.outline.set_edgecolor(GRID)

rho_geo = corr[0, 1]
rho_bat = corr[4, 6]
rho_mer = corr[3, 7]
rho_cruz = float(np.mean([abs(corr[i, j]) for _, a, _ in BLOCOS
                          for i in a for _, b, _ in BLOCOS for j in b
                          if not set(a) == set(b)]))
ax.text(0.5, -0.155,
        f"Dentro dos blocos: PTAX×Lítio = {rho_geo:.2f}   |   "
        f"HHI refino×Share CATL = {rho_bat:.2f}   |   "
        f"Demanda EV×Frete = {rho_mer:.2f}\n"
        f"Entre blocos a correlação média cai para {rho_cruz:.2f} — "
        "é essa queda que define onde um bloco termina e o outro começa.",
        transform=ax.transAxes, ha="center", va="top", fontsize=10.5,
        color=INK,
        bbox=dict(boxstyle="round,pad=0.55", facecolor=PANEL,
                  edgecolor=AMBAR, linewidth=1.8))

fig.savefig(OUT_DIR / "l7_correlation_heatmap.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l7_correlation_heatmap.png")

# ════════════════════════════════════════════════════════════════════
# PNG 3 — PCA explicado para executivos (8 -> 3)
# ════════════════════════════════════════════════════════════════════
fig = plt.figure(figsize=(14, 8.2))
gs = fig.add_gridspec(2, 2, height_ratios=[1, 1.05], width_ratios=[1, 1],
                      hspace=0.42, wspace=0.24,
                      left=0.065, right=0.975, top=0.875, bottom=0.085)

# (a) Scree — variancia por componente
ax_a = fig.add_subplot(gs[0, 0])
comps = [f"PC{i+1}" for i in range(8)]
cores_bar = [TIJOLO, AZUL, TEAL] + [MUTED] * 5
bars = ax_a.bar(comps, ev * 100, color=cores_bar, edgecolor=BG, linewidth=1)
for b, e in zip(bars, ev):
    ax_a.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.7,
              f"{e:.1%}", ha="center", va="bottom", fontsize=9.5, color=INK)
ax_a.axvspan(-0.5, 2.5, color=VERDE, alpha=0.07)
ax_a.text(1.0, ev[0] * 100 * 0.62, "guardar\nestes 3", ha="center",
          fontsize=10.5, weight="bold", color=VERDE)
ax_a.text(5.5, ev[0] * 100 * 0.62, "descartar:\ncauda / ruído", ha="center",
          fontsize=10, color=MUTED)
ax_a.set_title("(a) Quanta informação cada componente carrega", fontsize=12, pad=8)
ax_a.set_ylabel("% da variância explicada")
ax_a.set_ylim(0, ev[0] * 100 * 1.28)
ax_a.grid(True, alpha=0.28, axis="y")

# (b) Acumulada — a regra dos 80%
ax_b = fig.add_subplot(gs[0, 1])
ax_b.plot(range(1, 9), cum * 100, color=AZUL, linewidth=2.8,
          marker="o", markersize=8)
for i, c in enumerate(cum):
    ax_b.annotate(f"{c:.0%}", (i + 1, c * 100), textcoords="offset points",
                  xytext=(0, 11), ha="center", fontsize=9.5, color=INK)
ax_b.axhline(80, color=AMBAR, linewidth=2, linestyle="--")
ax_b.text(8.0, 82, "régua dos 80%", ha="right", fontsize=10,
          weight="bold", color=AMBAR)
ax_b.axvline(3, color=VERDE, linewidth=2, linestyle="--")
ax_b.annotate(f"3 componentes = {cum[2]:.1%}\ndo movimento total",
              xy=(3, cum[2] * 100), xytext=(4.15, 48),
              fontsize=10, weight="bold", color=VERDE,
              arrowprops=dict(arrowstyle="->", color=VERDE, lw=1.4),
              bbox=dict(boxstyle="round,pad=0.35", facecolor=PANEL,
                        edgecolor=VERDE, alpha=0.92))
ax_b.set_title("(b) Onde parar de adicionar componentes", fontsize=12, pad=8)
ax_b.set_xlabel("nº de componentes mantidos")
ax_b.set_ylabel("% acumulado da variância")
ax_b.set_ylim(20, 116)
ax_b.set_xlim(0.6, 8.4)
ax_b.grid(True, alpha=0.28)

# (c) A traducao executiva: 8 variaveis -> 3 planos
ax_c = fig.add_subplot(gs[1, :])
ax_c.set_xlim(0, 10); ax_c.set_ylim(0, 10)
ax_c.axis("off")
ax_c.set_title("(c) O que o PCA entrega ao executivo: 8 relatórios viram 3 planos com dono",
               fontsize=12.5, pad=12)

# Coluna esquerda: 8 variaveis
for k, vi in enumerate(ordem):
    y = 9.1 - k * 1.12
    cor = next(c for _, idxs, c in BLOCOS if vi in idxs)
    ax_c.add_patch(Rectangle((0.15, y - 0.42), 2.15, 0.84,
                             facecolor=PANEL, edgecolor=cor, linewidth=1.6))
    ax_c.text(1.225, y, nomes[vi], ha="center", va="center",
              fontsize=10, color=INK)
ax_c.text(1.225, 9.95, "8 variáveis monitoradas", ha="center",
          fontsize=11, weight="bold", color=MUTED)

# Coluna direita: 3 planos
planos = [
    ("F1 · Tensão geopolítica", f"{ev[0]:.0%} da variância",
     "PTAX · Lítio · Tarifa", "dono: CFO + Compras", TIJOLO, 7.7),
    ("F2 · Concentração de bateria", f"{ev[1]:.0%} da variância",
     "HHI refino · HHI mineração · Share CATL",
     f"dono: Supply Chain (HHI refino {NB02['hhi']['refining']['hhi']:.0f})", AZUL, 5.0),
    ("F3 · Ritmo de mercado", f"{ev[2]:.0%} da variância",
     "Demanda EV · Frete", "dono: Comercial + Logística", TEAL, 2.3),
]
for titulo, var, membros, dono, cor, yc in planos:
    ax_c.add_patch(Rectangle((5.0, yc - 1.12), 4.85, 2.24,
                             facecolor=PANEL, edgecolor=cor, linewidth=2.4))
    ax_c.text(5.2, yc + 0.72, titulo, fontsize=11.5, weight="bold", color=cor)
    ax_c.text(9.65, yc + 0.72, var, fontsize=10.5, weight="bold",
              color=INK, ha="right")
    ax_c.text(5.2, yc + 0.02, membros, fontsize=10, color=INK)
    ax_c.text(5.2, yc - 0.68, dono, fontsize=10, color=MUTED, style="italic")

# Setas dos blocos para os planos
alvo_y = {0: 7.7, 1: 5.0, 2: 2.3}
for bi, (_, idxs, cor) in enumerate(BLOCOS):
    for vi in idxs:
        k = ordem.index(vi)
        y0 = 9.1 - k * 1.12
        ax_c.add_patch(FancyArrowPatch((2.42, y0), (4.9, alvo_y[bi]),
                                       arrowstyle="-|>", mutation_scale=15,
                                       color=cor, linewidth=1.7, alpha=0.75,
                                       connectionstyle="arc3,rad=0.12"))
ax_c.text(3.66, 0.55, "PCA\n(rotação de eixos)", ha="center", fontsize=10.5,
          weight="bold", color=VIOLETA,
          bbox=dict(boxstyle="round,pad=0.35", facecolor=PANEL,
                    edgecolor=VIOLETA, linewidth=1.8))

fig.suptitle("Story 3 · PCA em linguagem de comitê: menos painéis, mais decisão",
             fontsize=15.5, weight="bold", color=INK, y=0.955)
fig.text(0.5, 0.018,
         f"PCA não cria variáveis novas do nada: ele gira os eixos para que as "
         f"correlações virem direções. Três direções bastam ({cum[2]:.1%}); "
         "as outras cinco somam ruído, não informação decisória.",
         ha="center", fontsize=10.5, color=MUTED, style="italic")

fig.savefig(OUT_DIR / "l7_pca_explained.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l7_pca_explained.png")

# ── Conciliacao com o JSON executivo ────────────────────────────────
JSON_PATH = OUT_DIR / "l7_multivariate_executive.json"
with JSON_PATH.open(encoding="utf-8") as f:
    L7J = json.load(f)
print("\nConciliacao com l7_multivariate_executive.json:")
print(f"  cumulativa 3 fatores : {cum[2]*100:.1f}%  | JSON = {L7J['variancia_acumulada_3fatores_pct']}%")
print(f"  ev por componente    : {[round(e*100,1) for e in ev]}")
print(f"  JSON explained       : {L7J['concepts']['pca']['explained_variance_pct']}")
print(f"  rho PTAX x Litio     : {rho_geo:.2f}  | JSON = {L7J['concepts']['correlacao']['rho_ptax_lithium']}")
print(f"  rho refino x CATL    : {rho_bat:.2f}  | JSON = {L7J['concepts']['correlacao']['rho_hhi_refino_catl']}")
print(f"  rho Demanda x Frete  : {rho_mer:.2f}  | JSON = {L7J['concepts']['correlacao']['rho_demanda_frete']}")
assert abs(cum[2] * 100 - L7J["variancia_acumulada_3fatores_pct"]) < 0.15
assert abs(rho_geo - L7J["concepts"]["correlacao"]["rho_ptax_lithium"]) < 0.01
print("  [OK] conciliacao confirmada")
