"""
Story addon do L9 (Teoria dos Jogos para Executivos).

Gera 3 PNGs em outputs/learning/ que sao embedados no notebook:
  l9_payoff_heatmap.png     -> 32 perfis como grade 2x16: payoff da BYD
                               de cada combinacao (BYD D/W) x (16 perfis do resto)
  l9_nash_visualization.png -> tabuleiro de xadrez 5x2 com 5 jogadores,
                               peca em cada casa, estrela marcando E3
  l9_byd_strategy.png       -> cena de xadrez: BYD e a peca rainha versus
                               4 oponentes; defesa + lucro destacado

Reproduz os valores exatos do NB-04 (PAYOFF_5D, NASH, ALL_DIFF_PAYOFFS, etc.)
para que os numeros conciliem com l9_gametheory_executive.json.
"""
import json
from pathlib import Path
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.patches import (
    Rectangle, FancyArrowPatch, FancyBboxPatch, Circle, RegularPolygon,
)
from matplotlib.lines import Line2D

# ── Tema escuro alinhado ao Plotly do notebook ──────────────────────
BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR, VERDE = "#9333ea", "#ea580c", "#22c55e"
PANEL = "#1c2128"
OURO, PRATA = "#facc15", "#cbd5e1"

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
with (NOTEBOOK_ROOT / "outputs" / "nb04_results.json").open(encoding="utf-8") as f:
    NB04 = json.load(f)
with (OUT_DIR / "l9_gametheory_executive.json").open(encoding="utf-8") as f:
    L9J = json.load(f)

PLAYERS    = ["BYD", "Stellantis", "GM", "VW", "Geely"]
OTHERS     = ["Stellantis", "GM", "VW", "Geely"]
STRATEGIES = NB04["strategies"]  # ['DIFFERENTIATE', 'PRICE_WAR']
NASH       = NB04["nash_equilibrium"]
PAYOFF_5D  = NB04["payoff_matrix_5x5"]
ALL_DIFF_PAYOFFS = NB04["payoffs_all_differentiate"]
ALL_WAR_PAYOFFS  = NB04["payoffs_all_war"]
NASH_PAYOFFS     = NB04["payoffs_nash_e3"]
AGG_DIFF   = NB04["aggregate_npv_all_differentiate_B"]
AGG_WAR    = NB04["aggregate_npv_all_war_B"]
AGG_NASH   = NB04["aggregate_npv_at_nash_B"]
DELTA_NASH = NB04["value_of_nash_vs_war_B"]

P_COLORS = {"BYD": AZUL, "Stellantis": TIJOLO, "GM": TEAL, "VW": VIOLETA, "Geely": AMBAR}


def payoff_at(byd, stel, gm, vw, geely):
    """Acessa PAYOFF_5D[byd][stel][gm][vw][geely][player] -> NPV R$ bi."""
    return PAYOFF_5D[byd][stel][gm][vw][geely]


def byd_payoff_grid():
    """Gera grade 2 (BYD D ou W) x 16 (combinacoes dos outros 4 jogadores).

    Cada celula guarda o payoff de BYD em R$ bi. As 16 combinacoes dos
    outros jogadores sao ordenadas pelo numero de PRICE_WAR (0..4),
    depois pela lista lex de jogadores em PRICE_WAR.
    """
    grid = np.zeros((2, 16))
    outras = OTHERS
    combos = []
    for mask in range(16):
        perfil = {}
        for i, p in enumerate(outras):
            perfil[p] = "PRICE_WAR" if (mask >> i) & 1 else "DIFFERENTIATE"
        combos.append(perfil)
    for bi, byd_s in enumerate(STRATEGIES):
        for ci, perfil in enumerate(combos):
            cell = payoff_at(byd_s, perfil["Stellantis"], perfil["GM"],
                             perfil["VW"], perfil["Geely"])
            grid[bi, ci] = cell["BYD"]
    return grid, combos


def profit_others_byd_D():
    """Para BYD em DIFFERENTIATE: payoff agregado dos 4 outros jogadores
    para cada uma das 16 combinacoes (Stel, GM, VW, Geely)."""
    out = np.zeros(16)
    outras = OTHERS
    for ci, mask in enumerate([i for i in range(16)]):
        perfil = {p: ("PRICE_WAR" if (mask >> i) & 1 else "DIFFERENTIATE")
                  for i, p in enumerate(outras)}
        cell = payoff_at("DIFFERENTIATE", perfil["Stellantis"],
                         perfil["GM"], perfil["VW"], perfil["Geely"])
        out[ci] = sum(cell[p] for p in outras)
    return out


# ════════════════════════════════════════════════════════════════════
# PNG 1 — Payoff matrix: 2 (BYD escolha) x 16 (combinacoes dos outros)
# ════════════════════════════════════════════════════════════════════
grid, combos = byd_payoff_grid()
others_profit_D = profit_others_byd_D()
n_war_per_col = np.array([sum(1 for p in OTHERS if combos[ci][p] == "PRICE_WAR")
                          for ci in range(16)])

fig = plt.figure(figsize=(15.2, 9.0))
gs = fig.add_gridspec(2, 2, width_ratios=[3.2, 1], height_ratios=[1, 1],
                      hspace=0.32, wspace=0.18,
                      left=0.055, right=0.965, top=0.86, bottom=0.10)

# (a) Heatmap principal
ax_h = fig.add_subplot(gs[:, 0])
vmax = float(np.abs(grid).max())
cmap_h = mpl.colors.LinearSegmentedColormap.from_list(
    "l9_div", [(0.00, AMBAR), (0.30, "#7c2d12"), (0.50, BG),
               (0.70, "#1e3a8a"), (1.00, VERDE)])
im = ax_h.imshow(grid, cmap=cmap_h, vmin=-vmax, vmax=vmax, aspect="auto")

# Eixos: x = n_outros em PRICE_WAR, y = escolha da BYD
ax_h.set_yticks([0, 1])
ax_h.set_yticklabels(["BYD = DIFFERENTIATE\n(margem 8%, marca)",
                      "BYD = PRICE_WAR\n(margem -2%, guerra)"],
                     fontsize=11)
ax_h.set_xticks(range(16))
ax_h.set_xticklabels([f"{n_war_per_col[ci]}" for ci in range(16)],
                     fontsize=10)
ax_h.set_xlabel("nº de adversarios em PRICE_WAR (entre Stellantis, GM, VW, Geely)",
                fontsize=11)

# Marca NASH (BYD=DIFF, todos os outros em WAR = mask 15)
nash_col = int(np.argmax([(15 - n_war_per_col[ci]) for ci in range(16)]) if False else 15)
# Melhor: encontrar a coluna que corresponde ao perfil Nash:
# (Stel=WAR=1, GM=WAR=1, VW=WAR=1, Geely=DIFF=0) -> mask = (1<<0)|(1<<1)|(1<<2)|0 = 7
# Mas ordem de OTHERS = [Stellantis, GM, VW, Geely] -> bit 0=Stel, bit 1=GM, bit 2=VW, bit 3=Geely
# Nash: Stel=WAR (bit0=1), GM=WAR (bit1=1), VW=WAR (bit2=1), Geely=DIFF (bit3=0)
# mask = 0b0111 = 7
nash_col = 7
nash_row = 0  # BYD=DIFF
ax_h.add_patch(Rectangle((nash_col - 0.5, nash_row - 0.5), 1, 1,
                         fill=False, edgecolor=OURO, linewidth=4.0, zorder=6))
# Estrela marcador Nash
ax_h.scatter([nash_col], [nash_row], marker="*", s=850,
             color=OURO, edgecolor=INK, linewidth=1.4, zorder=7)
ax_h.text(nash_col, nash_row + 0.62, "E3 ★", ha="center", va="bottom",
          fontsize=12, weight="bold", color=OURO, zorder=8)

# Destacar todos-DIFF (mask=0, 0 outros em WAR)
diff_col = 0
ax_h.add_patch(Rectangle((diff_col - 0.5, 0 - 0.5), 1, 1,
                         fill=False, edgecolor=VERDE, linewidth=2.6,
                         linestyle="--", zorder=5))

# Destacar todos-WAR (BYD=DIFF coluna nao existe; usamos BYD=WAR col 15 = WAR,15)
war_col = 15
ax_h.add_patch(Rectangle((war_col - 0.5, 1 - 0.5), 1, 1,
                         fill=False, edgecolor=TIJOLO, linewidth=2.6,
                         linestyle="--", zorder=5))
ax_h.text(war_col, 1 + 0.62, "catastrofe", ha="center", va="bottom",
          fontsize=10, weight="bold", color=TIJOLO)

# Anotar payoff em cada celula
for i in range(2):
    for j in range(16):
        v = grid[i, j]
        cor_texto = INK if abs(v) < 0.5 * vmax else BG
        ax_h.text(j, i, f"{v:+.2f}", ha="center", va="center",
                  fontsize=9.5, color=cor_texto,
                  weight="bold" if (i == nash_row and j == nash_col) else "normal")

# Ranhuras entre celulas
ax_h.set_xticks(np.arange(-0.5, 16, 1), minor=True)
ax_h.set_yticks(np.arange(-0.5, 2, 1), minor=True)
ax_h.grid(which="minor", color=BG, linewidth=2.5)
ax_h.tick_params(which="minor", length=0)
ax_h.set_title("Story 1 · 32 perfis, dois eixos: o que BYD faz (linha)\n"
               "vs. quantos adversarios guerreiam (coluna)",
               fontsize=13.5, pad=12)

# Colorbar
cb = fig.colorbar(im, ax=ax_h, fraction=0.04, pad=0.012)
cb.set_label("Payoff BYD (R$ bi NPV)", color=MUTED, fontsize=10)
cb.ax.tick_params(colors=MUTED)
cb.outline.set_edgecolor(GRID)

# (b) Barra lateral — payoff agregado dos OUTROS jogadores por coluna,
#     apenas com BYD=DIFF (linha de cima) — para enxergar a dependencia do
#     "lado de la" do jogo
ax_r = fig.add_subplot(gs[0, 1])
bars = ax_r.barh(range(16), others_profit_D,
                 color=[VERDE if v >= 0 else TIJOLO for v in others_profit_D],
                 edgecolor=GRID, linewidth=0.6, height=0.78)
ax_r.axvline(0, color=MUTED, linewidth=1)
ax_r.set_yticks(range(16))
ax_r.set_yticklabels([f"{n_war_per_col[ci]} adversario(s) em WAR" for ci in range(16)],
                    fontsize=9)
ax_r.invert_yaxis()
ax_r.set_title("Soma dos 4 adversarios (R$ bi)\nquando BYD = DIFFERENTIATE",
               fontsize=11, pad=8)
for b, v in zip(bars, others_profit_D):
    ax_r.text(b.get_width() + (0.25 if v >= 0 else -0.25),
              b.get_y() + b.get_height() / 2,
              f"{v:+.2f}", va="center",
              ha="left" if v >= 0 else "right",
              fontsize=9, color=INK)
ax_r.spines["top"].set_visible(False)
ax_r.spines["right"].set_visible(False)
ax_r.grid(True, alpha=0.20, axis="x")
ax_r.set_xlim(min(others_profit_D) - 2, max(others_profit_D) + 4)

# (c) Histograma de "quanto BYD ganha vs quantos adversarios vao a guerra"
ax_c = fig.add_subplot(gs[1, 1])
byd_in_diff = grid[0]
cores_pontos = [OURO if ci == nash_col else INK for ci in range(16)]
ax_c.scatter(range(16), byd_in_diff, s=70,
             c=cores_pontos, edgecolor=GRID, linewidth=0.8, zorder=3)
ax_c.axhline(7.296, color=VERDE, linewidth=1.8, linestyle="--",
             label="DIFF payoff constante (+7,30)")
ax_c.axhline(NASH_PAYOFFS["BYD"], color=OURO, linewidth=1.2, linestyle=":",
             label=f"Nash E3 (+{NASH_PAYOFFS['BYD']:.2f})")
ax_c.set_xticks(range(16))
ax_c.set_xticklabels([f"{n_war_per_col[ci]}" for ci in range(16)], fontsize=9)
ax_c.set_xlabel("adversarios em PRICE_WAR")
ax_c.set_ylabel("Payoff BYD (R$ bi)")
ax_c.set_title("Independencia estrategica: BYD em DIFFERENTIATE\n"
               "rende o mesmo independente do que os outros fazem",
               fontsize=10.5, pad=8)
ax_c.spines["top"].set_visible(False)
ax_c.spines["right"].set_visible(False)
ax_c.grid(True, alpha=0.25)
ax_c.legend(loc="lower right", fontsize=8.5, framealpha=0.85)

fig.suptitle(
    "L9 Story · Os 32 perfis da matriz 5D — payoff da BYD em cada um",
    fontsize=15.5, weight="bold", color=INK, y=0.965)
fig.text(0.5, 0.012,
         "Linha de cima (BYD=DIFFERENTIATE) é verde na maioria das colunas — "
         "a escolha da BYD é robusta. Linha de baixo (BYD=PRICE_WAR) "
         "só não é vermelha quando TODOS os adversários também vão à guerra.",
         ha="center", fontsize=10.5, color=MUTED, style="italic")

fig.savefig(OUT_DIR / "l9_payoff_heatmap.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l9_payoff_heatmap.png")


# ════════════════════════════════════════════════════════════════════
# PNG 2 — Tabuleiro 5x2 com peca xadrez + estrela NASH
# ════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13.5, 7.4))
ax.set_xlim(-0.5, 4.6); ax.set_ylim(-2.0, 6.4)
ax.set_aspect("equal"); ax.axis("off")

# "Casas" do tabuleiro (5 jogadores x 2 estrategias)
W = 1.6  # largura da casa
H = 1.6  # altura da casa
pos = {}  # pos[(player, strategy)] = (x, y)

for ci, p in enumerate(PLAYERS):
    cor = P_COLORS[p]
    for ri, s in enumerate(STRATEGIES):
        x = ci * W
        # Estrategia PRICE_WAR (mais agressiva) no topo (y maior)
        y = 1 if s == "DIFFERENTIATE" else 0
        ax.add_patch(Rectangle(
            (x - W/2, y * H - H/2), W, H,
            facecolor=PANEL, edgecolor=cor, linewidth=1.6, zorder=1))
        # Pintar de cinza claro quando é o perfil Nash
        if NASH[p] == s:
            ax.add_patch(Rectangle(
                (x - W/2, y * H - H/2), W, H,
                facecolor=cor, alpha=0.18, edgecolor=cor, linewidth=2.6,
                zorder=2))
        pos[(p, s)] = (x, y * H)

# Simbolos xadrez: K=DIFFERENTIATE (rainha/peao forte), W=PRICE_WAR (peao)
SYMBOL = {"DIFFERENTIATE": "♛", "PRICE_WAR": "♟"}
for p in PLAYERS:
    cor = P_COLORS[p]
    for s in STRATEGIES:
        cx, cy = pos[(p, s)]
        is_nash = NASH[p] == s
        size = 1100 if is_nash else 700
        peso_letra = "bold" if is_nash else "normal"
        ax.text(cx, cy, SYMBOL[s], ha="center", va="center",
                fontsize=size * 0.08, color=cor,
                weight=peso_letra, zorder=4)
        # Rotulo pequeno
        ax.text(cx, cy + 0.82,
                f"{p}={'DIFF' if s == 'DIFFERENTIATE' else 'WAR'}",
                ha="center", va="bottom", fontsize=9.5, color=cor)

# Rotulos dos jogadores embaixo
for ci, p in enumerate(PLAYERS):
    ax.text(ci * W, -0.9, p, ha="center", fontsize=14, weight="bold",
            color=P_COLORS[p])
    base_share = next(b["base_share"] for b in NB04["players"] if b["name"] == p)
    ax.text(ci * W, -1.32, f"share base {base_share:.0%}",
            ha="center", fontsize=9.5, color=MUTED, style="italic")

# Rotulos das estrategias à esquerda
ax.text(-W/2 - 0.35, H, "DIFFERENTIATE", ha="right", fontsize=12,
        weight="bold", color=VERDE)
ax.text(-W/2 - 0.35, 0, "PRICE_WAR", ha="right", fontsize=12,
        weight="bold", color=TIJOLO)
ax.text(-W/2 - 0.35, H/2, "estrategia",
        ha="right", fontsize=9.5, color=MUTED, style="italic",
        rotation=90, va="center")

# Linha do Nash — conecta as 5 casas selecionadas (uma por jogador)
nash_pts = [pos[(p, NASH[p])] for p in PLAYERS]
nash_xs = [p[0] for p in nash_pts]
nash_ys = [p[1] for p in nash_pts]
ax.plot(nash_xs, nash_ys, color=OURO, linewidth=3.2, alpha=0.85, zorder=3)
# Estrelas em cada casa Nash
for (x, y), p in zip(nash_pts, PLAYERS):
    ax.scatter([x], [y], marker="*", s=520, color=OURO, edgecolor=INK,
               linewidth=1.2, zorder=5)

# Anotacao principal do Nash
ax.text(4.0, 5.4, "★ NASH E3 ★",
        ha="right", fontsize=14, weight="bold", color=OURO)
ax.text(4.0, 4.85,
        "BYD=DIFF · Stel=WAR · GM=WAR · VW=WAR · Geely=DIFF\n"
        f"Payoff agregado = R$ {AGG_NASH:.2f} bi",
        ha="right", fontsize=10.5, color=INK)

# Painel canto inferior: payoffs do Nash
for ci, p in enumerate(PLAYERS):
    cx = ci * W
    payoff_val = NASH_PAYOFFS[p]
    cor = VERDE if payoff_val >= 0 else TIJOLO
    ax.text(cx, -1.75, f"R$ {payoff_val:+.2f} bi",
            ha="center", fontsize=11, weight="bold", color=cor)

# Legenda pecas + simbolos
ax.text(4.0, 3.65, "LEGENDA", ha="right", fontsize=10, weight="bold",
        color=MUTED)
ax.text(4.0, 3.30, "♛ = diferenciar (marca, margem 8%)",
        ha="right", fontsize=9, color=VERDE)
ax.text(4.0, 3.0, "♟ = guerra (preço, margem -2%)",
        ha="right", fontsize=9, color=TIJOLO)
ax.text(4.0, 2.7, "★ = casa do Equilíbrio de Nash",
        ha="right", fontsize=9, color=OURO)
ax.text(4.0, 2.4,
        "Linha dourada = perfil estável\nninguém ganha trocando sozinho",
        ha="right", fontsize=9, color=INK, style="italic")

# Setas "best response" — para Stellantis em particular, mostrar que
# dado BYD em DIFF, a melhor resposta é WAR (move-se)
br_arrow_start = pos[("Stellantis", "DIFFERENTIATE")]
br_arrow_end = pos[("Stellantis", "PRICE_WAR")]
ax.add_patch(FancyArrowPatch(
    br_arrow_start, br_arrow_end,
    arrowstyle="-|>", mutation_scale=22, color=TIJOLO,
    linewidth=2.4, alpha=0.95,
    connectionstyle="arc3,rad=-0.4"))
ax.text(br_arrow_start[0] - 0.05,
        (br_arrow_start[1] + br_arrow_end[1]) / 2,
        "BR: DIFF → WAR\n(payoff: −1,38 bi é melhor que −1,38 bi? na verdade\n"
        "o adversario perde em ambos, mas WAR é menos pior)",
        ha="right", va="center", fontsize=8.5, color=TIJOLO,
        bbox=dict(boxstyle="round,pad=0.3", facecolor=PANEL,
                  edgecolor=TIJOLO, linewidth=1.0))

fig.suptitle("L9 Story · Tabuleiro de xadrez 5×2 — onde está o Equilíbrio de Nash E3",
             fontsize=15.5, weight="bold", color=INK, y=0.965)
fig.text(0.5, 0.02,
         "Cada casa é uma escolha de UM jogador; a linha dourada une as 5 "
         "escolhas simultâneas que formam o Equilíbrio de Nash E3 do NB-04. "
         "Nenhum dos cinco jogadores melhora mudando sozinho de casa.",
         ha="center", fontsize=10.5, color=MUTED, style="italic")

fig.savefig(OUT_DIR / "l9_nash_visualization.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l9_nash_visualization.png")


# ════════════════════════════════════════════════════════════════════
# PNG 3 — CENA DE XADREZ: BYD rainha vs 4 oponentes
# ════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13.8, 8.6))
ax.set_xlim(-1.0, 14.0); ax.set_ylim(-1.0, 10.0)
ax.set_aspect("equal"); ax.axis("off")

# Fundo do tabuleiro 6x4 (visual) — não precisa ser xadrez real, é uma
# cena narrativa
TAB_X0, TAB_Y0 = 0.4, 0.4
TAB_W, TAB_H = 13.2, 8.0
n_sq_x, n_sq_y = 6, 4
sq_w, sq_h = TAB_W / n_sq_x, TAB_H / n_sq_y
for i in range(n_sq_x):
    for j in range(n_sq_y):
        x = TAB_X0 + i * sq_w
        y = TAB_Y0 + j * sq_h
        cor = "#f8fafc" if (i + j) % 2 == 0 else "#475569"
        ax.add_patch(Rectangle((x, y), sq_w, sq_h, facecolor=cor,
                               edgecolor=BG, linewidth=1.2, zorder=1))

# Borda do tabuleiro
ax.add_patch(Rectangle((TAB_X0, TAB_Y0), TAB_W, TAB_H,
                       fill=False, edgecolor=OURO, linewidth=3.4, zorder=2))

# Posicionar pecas
pecas = {
    # BYD rainha no centro alto
    "BYD_queen": (3.0, 6.6, "♛", AZUL, "estratégia dominante"),
    # Stellantis cavalo (knight) abaixo-frente
    "Stellantis_knight": (1.2, 2.6, "♞", TIJOLO, "forçado a PRICE_WAR"),
    # GM peão
    "GM_pawn": (3.0, 1.4, "♟", TEAL, "também em PRICE_WAR"),
    # VW torre
    "VW_rook": (4.4, 1.8, "♜", VIOLETA, "PRICE_WAR defensiva"),
    # Geely bispo (entrou no time da diferenciacao)
    "Geely_bishop": (5.4, 5.6, "♗", AMBAR, "aliado eventual em DIFF"),
}
for key, (x, y, sym, cor, papel) in pecas.items():
    ax.text(x, y, sym, ha="center", va="center",
            fontsize=56, color=cor, zorder=5)
    ax.text(x, y - 0.45, papel, ha="center", va="top",
            fontsize=9.5, color=cor, weight="bold", zorder=5)

# Anotacao principal: BYD rainha
ax.text(3.0, 7.6, "BYD", ha="center", fontsize=18, weight="bold",
        color=AZUL)
ax.text(3.0, 7.25, f"R$ {NASH_PAYOFFS['BYD']:+.2f} bi NPV",
        ha="center", fontsize=11.5, color=AZUL,
        bbox=dict(boxstyle="round,pad=0.35", facecolor=PANEL,
                  edgecolor=AZUL, linewidth=1.5))

# Seta da rainha "atacando" mostrando que ela captura mercado
for end_x, end_y, label in [
    (4.6, 5.0, "+15% share captado"),
    (1.0, 4.4, "Stellantis -3% share"),
    (3.0, 2.4, "GM capturado em volume"),
    (4.7, 2.8, "VW sai do BEV puro"),
    (5.6, 6.6, "Geely compartilha faixa premium"),
]:
    cor_seta = VERDE if end_y > 4.0 else MUTED
    ax.add_patch(FancyArrowPatch(
        (3.4, 6.45), (end_x, end_y),
        arrowstyle="-|>", mutation_scale=18, color=cor_seta,
        linewidth=1.6, alpha=0.85,
        connectionstyle="arc3,rad=0.18"))
    ax.text(end_x + 0.05, end_y + 0.15, label,
            ha="left", va="bottom", fontsize=9, color=cor_seta)

# Setas dos adversarios (vermelho) tentando atacar mas recuando
for end_x, end_y, label in [
    (1.0, 2.6, f"R$ {ALL_WAR_PAYOFFS['Stellantis']:+.2f} bi"),
    (3.0, 1.4, f"R$ {ALL_WAR_PAYOFFS['GM']:+.2f} bi"),
    (4.4, 1.8, f"R$ {ALL_WAR_PAYOFFS['VW']:+.2f} bi"),
]:
    ax.add_patch(FancyArrowPatch(
        (end_x + 0.4, end_y + 0.4), (end_x + 0.05, end_y + 0.05),
        arrowstyle="-|>", mutation_scale=14, color=TIJOLO,
        linewidth=1.2, alpha=0.65))

# Caixa "Resultado final"
res_box_x, res_box_y = 8.0, 7.5
ax.add_patch(FancyBboxPatch((res_box_x, res_box_y - 0.6), 4.9, 1.4,
                             boxstyle="round,pad=0.08",
                             facecolor=PANEL, edgecolor=OURO, linewidth=1.8,
                             zorder=4))
ax.text(res_box_x + 0.2, res_box_y + 0.55,
        "Resultado do jogo: NASH E3",
        fontsize=12.5, weight="bold", color=OURO)
ax.text(res_box_x + 0.2, res_box_y + 0.18,
        f"• BYD  (rainha):     R$ {NASH_PAYOFFS['BYD']:+.2f} bi",
        fontsize=10.5, color=AZUL, family="monospace")
ax.text(res_box_x + 0.2, res_box_y - 0.12,
        f"• Stel/GM/VW (recua): R$ {NASH_PAYOFFS['Stellantis']:+.2f} / {NASH_PAYOFFS['GM']:+.2f} / {NASH_PAYOFFS['VW']:+.2f} bi",
        fontsize=10.5, color=TIJOLO, family="monospace")
ax.text(res_box_x + 0.2, res_box_y - 0.42,
        f"• Geely (aliado):     R$ {NASH_PAYOFFS['Geely']:+.2f} bi",
        fontsize=10.5, color=AMBAR, family="monospace")

# Frase executiva canto inferior direito
frase_box_x, frase_box_y = 8.0, 2.4
ax.add_patch(FancyBboxPatch((frase_box_x, frase_box_y - 1.1), 4.9, 1.7,
                             boxstyle="round,pad=0.08",
                             facecolor="#1f2937", edgecolor=AZUL, linewidth=2.0,
                             zorder=4))
ax.text(frase_box_x + 0.2, frase_box_y + 0.4,
        "Frase executiva", fontsize=11, weight="bold", color=AZUL)
ax.text(frase_box_x + 0.2, frase_box_y,
        '"Nossa estratégia competitiva é',
         fontsize=10, color=INK)
ax.text(frase_box_x + 0.2, frase_box_y - 0.25,
        ' diferenciação: em Nash E3 (NB-04),',
         fontsize=10, color=INK)
ax.text(frase_box_x + 0.2, frase_box_y - 0.5,
        f' nosso payoff é R$ +7,30 bi independente do',
         fontsize=10, color=INK)
ax.text(frase_box_x + 0.2, frase_box_y - 0.75,
        ' que os outros fizerem."',
         fontsize=10, weight="bold", color=VERDE)

# Comparativo com a utopia (todos-DIFF)
ax.text(7.0, 0.7,
        f"utopia (todos-DIFF) R$ {AGG_DIFF:+.2f} bi    →    "
        f"Nash E3 R$ {AGG_NASH:+.2f} bi    →    "
        f"catastrofe (todos-WAR) R$ {AGG_WAR:+.2f} bi",
        ha="center", fontsize=11.5, weight="bold", color=INK,
        bbox=dict(boxstyle="round,pad=0.45", facecolor=PANEL,
                  edgecolor=AMBAR, linewidth=1.6))

fig.suptitle("L9 Story · Xadrez executvo: BYD abre com diferenciação e Stellantis/GM/VW recuam",
             fontsize=15, weight="bold", color=INK, y=0.975)

fig.savefig(OUT_DIR / "l9_byd_strategy.png", dpi=140,
            bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("[OK] l9_byd_strategy.png")

# ── Conciliacao ──────────────────────────────────────────────────────
print("\nConciliacao com l9_gametheory_executive.json:")
print(f"  AGG_DIFF (utopia)         : R$ {AGG_DIFF:.2f} bi   | JSON = {L9J['aggregate_npv']['todos_differentiate_B']:.2f}")
print(f"  AGG_NASH (Nash E3)        : R$ {AGG_NASH:.2f} bi   | JSON = {L9J['aggregate_npv']['nash_e3_B']:.2f}")
print(f"  AGG_WAR  (catastrofe)     : R$ {AGG_WAR:.2f} bi   | JSON = {L9J['aggregate_npv']['todos_price_war_B']:.2f}")
print(f"  BYD payoff em Nash        : R$ {NASH_PAYOFFS['BYD']:+.2f} bi | JSON = {L9J['byd_context']['payoff_B']}")
print(f"  Nash BYD                  : {NASH['BYD']:<13}    | JSON = {L9J['nash_equilibrium']['BYD']}")
assert abs(AGG_NASH - L9J["aggregate_npv"]["nash_e3_B"]) < 0.01
assert NASH["BYD"] == "DIFFERENTIATE"
print("  [OK] conciliacao confirmada")
