# ──────────────────────────────────────────────────────────────
# Visualizações estáticas (PNG) — entregáveis executivos
#   (1) Série PTAX + reta de tendência
#   (2) Decomposição de sazonalidade (observado / tendência / sazonal / resíduo)
#   (3) Médias móveis sobrepostas (overlay 3m / 6m / 12m)
# ──────────────────────────────────────────────────────────────
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.ticker import FuncFormatter
from statsmodels.tsa.seasonal import seasonal_decompose

# Tema escuro + paleta validada (espelho do plotly do caderno)
plt.rcParams.update({
    # "R$" aparece em quase todo rótulo; sem isto o matplotlib casa os pares de
    # "$" e renderiza o trecho do meio como mathtext em itálico (R$/US$ -> R/US).
    'text.parse_math': False,
    'figure.facecolor': BG,
    'axes.facecolor': BG,
    'savefig.facecolor': BG,
    'axes.edgecolor': GRID,
    'axes.labelcolor': INK,
    'axes.titlecolor': INK,
    'xtick.color': MUTED,
    'ytick.color': MUTED,
    'text.color': INK,
    'grid.color': GRID,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
    'font.family': 'DejaVu Sans',
    'font.size': 11,
    'legend.facecolor': BG,
    'legend.edgecolor': GRID,
})

# Variáveis já calculadas no caderno:
#   ptax_s, vendas_s          — séries mensais (cell setup)
#   mm12, beta0, beta1, reta  — tendência do PTAX (seção 2)
#   deriva_ano                — slope anualizado
#   fator, nomes              — fator sazonal por mês (seção 3)

# Rótulos de mês em pt-br (Jan/21) sem depender de locale do SO —
# 'nomes' vem da célula de sazonalidade: ["Jan","Fev",...,"Dez"].
MES_PTBR = FuncFormatter(
    lambda v, _pos: f"{nomes[mdates.num2date(v).month - 1]}/{mdates.num2date(v):%y}"
)


def eixo_mes(ax, interval=6):
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=interval))
    ax.xaxis.set_major_formatter(MES_PTBR)
    plt.setp(ax.get_xticklabels(), rotation=35, ha='right')


# ============================================================
# (1) SÉRIE PTAX + RETA DE TENDÊNCIA
# ============================================================
fig, ax = plt.subplots(figsize=(12, 6.5))

idx = ptax_s.index
ax.plot(idx, ptax_s.values, color=AZUL, linewidth=2.0, alpha=0.9,
        label='PTAX observado (R$/US$)', zorder=3)
ax.scatter(idx, ptax_s.values, color=AZUL, s=16, alpha=0.55,
           edgecolors='none', zorder=3)

ax.plot(idx, reta, color=VIOLETA, linewidth=2.8, linestyle='--',
        label=f'Reta de tendência · β₁ = {beta1:+.4f} R$/mês ({deriva_ano:+.3f} R$/ano)',
        zorder=5)

# banda de dispersão em torno da reta (o quanto o câmbio "solta" do rumo)
desvio = ptax_s.values - reta
sigma_t = desvio.std()
ax.fill_between(idx, reta - 1.96 * sigma_t, reta + 1.96 * sigma_t,
                color=VIOLETA, alpha=0.13,
                label=f'±1.96σ em torno da tendência (±R$ {1.96*sigma_t:.2f})',
                zorder=1)

# marcos: pico, vale, atual
i_pico = int(np.argmax(ptax_s.values)); i_vale = int(np.argmin(ptax_s.values))
ax.scatter([idx[i_pico]], [ptax_s.values[i_pico]], color=TIJOLO, s=150,
           edgecolors=INK, linewidth=1.3, zorder=6, label='pico')
ax.annotate(f'pico R$ {ptax_s.values[i_pico]:.2f}\n{idx[i_pico]:%b/%Y}',
            xy=(idx[i_pico], ptax_s.values[i_pico]),
            xytext=(12, 16), textcoords='offset points',
            color=TIJOLO, fontsize=10, fontweight='bold')
ax.scatter([idx[i_vale]], [ptax_s.values[i_vale]], color=STATUS_GOOD, s=150,
           edgecolors=INK, linewidth=1.3, zorder=6, label='vale')
ax.annotate(f'vale R$ {ptax_s.values[i_vale]:.2f}\n{idx[i_vale]:%b/%Y}',
            xy=(idx[i_vale], ptax_s.values[i_vale]),
            xytext=(12, -30), textcoords='offset points',
            color=STATUS_GOOD, fontsize=10, fontweight='bold')
ax.scatter([idx[-1]], [ptax_s.values[-1]], color=INK, s=210, marker='*',
           edgecolors=AMBAR, linewidth=1.4, zorder=7, label='atual')

rumo = 'ALTA (real depreciando)' if beta1 > 0 else 'BAIXA (real apreciando)'
ax.text(0.022, 0.965,
        f'Rumo estrutural: {rumo}\n'
        f'β₁ = {beta1:+.4f} R$/mês  →  {deriva_ano:+.3f} R$/ano\n\n'
        f'atual R$ {ptax_s.values[-1]:.4f} · n = {len(ptax_s)} meses',
        transform=ax.transAxes, va='top', ha='left',
        fontsize=10, color=INK,
        bbox=dict(boxstyle='round,pad=0.55', facecolor=BG,
                  edgecolor=VIOLETA, linewidth=1.2))

ax.set_xlabel('Mês', fontsize=12)
ax.set_ylabel('R$ por US$', fontsize=12)
ax.set_title('(1) Série temporal do PTAX + tendência\n'
             'o número com o caminho anexado — a reta mostra o rumo, não o soluço',
             fontsize=14, fontweight='bold', pad=12)
eixo_mes(ax)
ax.legend(loc='lower right', fontsize=9, labelcolor=INK, framealpha=0.85)
ax.grid(True, alpha=0.3, linestyle='--')

plt.tight_layout()
out1 = OUT_DIR / 'l4_01_ptax_trend.png'
plt.savefig(out1, dpi=150, bbox_inches='tight')
plt.show()
print(f"  salvo: {out1}")

# ============================================================
# (2) DECOMPOSIÇÃO DE SAZONALIDADE
#     vendas BYD BR = tendência × sazonal × resíduo
# ============================================================
dec = seasonal_decompose(vendas_s, model='multiplicative', period=12,
                         extrapolate_trend='freq')

fig, axes = plt.subplots(4, 1, figsize=(12.5, 11), sharex=True)
vidx = vendas_s.index

# A — observado
ax = axes[0]
ax.plot(vidx, vendas_s.values, color=AZUL, linewidth=2.0, label='observado')
ax.plot(vidx, dec.trend.values, color=AMBAR, linewidth=2.6,
        label='tendência (T)')
ax.set_ylabel('unidades', fontsize=11)
ax.set_title('OBSERVADO  =  tendência (T) × sazonal (S) × resíduo (R)',
             fontsize=12, color=INK, loc='left')
ax.legend(fontsize=9, labelcolor=INK, loc='upper left', ncol=2)

# B — tendência isolada
ax = axes[1]
ax.plot(vidx, dec.trend.values, color=AMBAR, linewidth=2.8)
tr = dec.trend.dropna()
cagr_mes = (tr.iloc[-1] / tr.iloc[0]) ** (1 / max(len(tr) - 1, 1)) - 1
ax.fill_between(vidx, dec.trend.values, tr.min(), color=AMBAR, alpha=0.12)
ax.set_ylabel('unidades', fontsize=11)
ax.set_title(f'TENDÊNCIA (T)  ·  ramp-up de {tr.iloc[0]:,.0f} → {tr.iloc[-1]:,.0f} un/mês '
             f'({cagr_mes*100:+.1f}%/mês)',
             fontsize=12, color=AMBAR, loc='left')

# C — componente sazonal
ax = axes[2]
ax.plot(vidx, dec.seasonal.values, color=TEAL, linewidth=2.0)
ax.axhline(1.0, color=MUTED, linewidth=1.6, linestyle='--')
ax.fill_between(vidx, dec.seasonal.values, 1.0,
                where=(dec.seasonal.values >= 1.0),
                color=STATUS_GOOD, alpha=0.22, interpolate=True,
                label='acima da média (alta estação)')
ax.fill_between(vidx, dec.seasonal.values, 1.0,
                where=(dec.seasonal.values < 1.0),
                color=AMBAR, alpha=0.22, interpolate=True,
                label='abaixo da média (baixa estação)')
sz = dec.seasonal
m_forte = nomes[int(sz.groupby(sz.index.month).mean().idxmax()) - 1]
m_fraco = nomes[int(sz.groupby(sz.index.month).mean().idxmin()) - 1]
spread_dec = (sz.max() / sz.min() - 1) * 100
ax.set_ylabel('× tendência', fontsize=11)
ax.set_title(f'SAZONAL (S)  ·  o mesmo padrão repete todo ano  —  '
             f'forte {m_forte} ({sz.max():.2f}) vs fraco {m_fraco} ({sz.min():.2f}) '
             f'= spread {spread_dec:.0f}%',
             fontsize=12, color=TEAL, loc='left')
ax.legend(fontsize=9, labelcolor=INK, loc='upper left', ncol=2)

# D — resíduo
ax = axes[3]
res = dec.resid
ax.plot(vidx, res.values, color=MUTED, linewidth=1.0, alpha=0.7)
ax.scatter(vidx, res.values, color=TIJOLO, s=26, alpha=0.8, edgecolors='none')
ax.axhline(1.0, color=AMBAR, linewidth=1.8, linestyle='--')
rs = res.dropna()
banda = 2 * rs.std()
ax.fill_between(vidx, 1 - banda, 1 + banda, color=TIJOLO, alpha=0.12,
                label=f'±2σ = ±{banda*100:.1f}%')
ax.set_ylabel('× (T×S)', fontsize=11)
ax.set_xlabel('Mês', fontsize=12)
ax.set_title(f'RESÍDUO (R)  ·  o que sobra depois de T e S  —  σ = {rs.std()*100:.1f}% '
             f'(ruído, não gestão)',
             fontsize=12, color=TIJOLO, loc='left')
ax.legend(fontsize=9, labelcolor=INK, loc='upper left')

eixo_mes(axes[3])
for a in axes:
    a.grid(True, alpha=0.3, linestyle='--')

fig.suptitle('(2) Decomposição de sazonalidade · vendas BYD BR\n'
             'separe o mérito de gestão (T) do relógio do calendário (S)',
             fontsize=15, fontweight='bold', color=INK, y=0.995)
plt.tight_layout(rect=(0, 0, 1, 0.975))
out2 = OUT_DIR / 'l4_02_seasonal_decomposition.png'
plt.savefig(out2, dpi=150, bbox_inches='tight')
plt.show()
print(f"  salvo: {out2}")

# ============================================================
# (3) MÉDIAS MÓVEIS SOBREPOSTAS (OVERLAY)
# ============================================================
mm3  = ptax_s.rolling(3).mean()
mm6  = ptax_s.rolling(6).mean()
mm12_t = ptax_s.rolling(12).mean()          # trailing (decisão em tempo real)
std12  = ptax_s.rolling(12).std()

fig, axes = plt.subplots(2, 1, figsize=(12.5, 9), sharex=True,
                         gridspec_kw={'height_ratios': [2.2, 1]})

# Painel A — overlay das médias móveis
ax = axes[0]
ax.plot(idx, ptax_s.values, color=MUTED, linewidth=1.1, alpha=0.65,
        label='PTAX cru (ruído mês a mês)', zorder=2)
ax.fill_between(idx, (mm12_t - std12).values, (mm12_t + std12).values,
                color=AZUL, alpha=0.13, zorder=1,
                label='MM12 ± 1σ (envelope de normalidade)')
ax.plot(idx, mm3.values,  color=TEAL,   linewidth=1.9, label='MM 3m (rápida)',  zorder=4)
ax.plot(idx, mm6.values,  color=AMBAR,  linewidth=2.3, label='MM 6m (média)',   zorder=5)
ax.plot(idx, mm12_t.values, color=AZUL, linewidth=3.2, label='MM 12m (rumo)',   zorder=6)

# cruzamentos MM3 × MM12 — sinal de virada de regime
d = (mm3 - mm12_t).dropna()
sig = np.sign(d.values)
cruz = [d.index[i] for i in range(1, len(sig)) if sig[i] != 0 and sig[i] != sig[i-1]]
for j, c in enumerate(cruz):
    ax.axvline(c, color=VIOLETA, linewidth=1.2, linestyle=':', alpha=0.8,
               zorder=3, label='cruzamento MM3×MM12' if j == 0 else None)
if cruz:
    ax.annotate(f'{len(cruz)} cruzamentos\n(MM3 × MM12)',
                xy=(cruz[-1], ptax_s.max()),
                xytext=(-95, -6), textcoords='offset points',
                color=VIOLETA, fontsize=9.5, fontweight='bold')

ult_mm3, ult_mm12 = float(mm3.iloc[-1]), float(mm12_t.iloc[-1])
estado = 'MM3 > MM12 → pressão de alta' if ult_mm3 > ult_mm12 else 'MM3 < MM12 → alívio'
ax.text(0.022, 0.965,
        f'Quanto mais longa a janela, mais lisa a linha\n'
        f'(e mais atrasado o sinal)\n\n'
        f'MM3 = R$ {ult_mm3:.3f} · MM12 = R$ {ult_mm12:.3f}\n'
        f'{estado}',
        transform=ax.transAxes, va='top', ha='left',
        fontsize=10, color=INK,
        bbox=dict(boxstyle='round,pad=0.55', facecolor=BG,
                  edgecolor=AZUL, linewidth=1.2))

ax.set_ylabel('R$ por US$', fontsize=12)
ax.set_title('Overlay de médias móveis · 3m / 6m / 12m sobre o PTAX cru',
             fontsize=12.5, color=INK, loc='left')
ax.legend(loc='lower right', fontsize=9, labelcolor=INK, ncol=2, framealpha=0.85)
ax.grid(True, alpha=0.3, linestyle='--')

# Painel B — volatilidade móvel (o quanto o envelope respira)
ax = axes[1]
ax.plot(idx, std12.values, color=TIJOLO, linewidth=2.4,
        label='desvio-padrão móvel 12m')
ax.fill_between(idx, 0, std12.values, color=TIJOLO, alpha=0.18)
med_std = float(std12.mean())
ax.axhline(med_std, color=MUTED, linewidth=1.6, linestyle='--',
           label=f'média do período (R$ {med_std:.3f})')
i_max = int(np.nanargmax(std12.values))
ax.scatter([idx[i_max]], [std12.values[i_max]], color=AMBAR, s=130,
           edgecolors=INK, linewidth=1.2, zorder=5)
ax.annotate(f'pico de turbulência\n{idx[i_max]:%b/%Y} · R$ {std12.values[i_max]:.3f}',
            xy=(idx[i_max], std12.values[i_max]),
            xytext=(10, -34), textcoords='offset points',
            color=AMBAR, fontsize=9.5, fontweight='bold')
ax.set_ylabel('σ móvel (R$)', fontsize=11)
ax.set_xlabel('Mês', fontsize=12)
ax.set_title('Dispersão móvel 12m · quando o envelope abre, o hedge fica mais caro',
             fontsize=12, color=TIJOLO, loc='left')
ax.legend(loc='upper left', fontsize=9, labelcolor=INK)
ax.grid(True, alpha=0.3, linestyle='--')
eixo_mes(ax)

fig.suptitle('(3) Médias móveis sobrepostas · filtrar o soluço sem perder o rumo',
             fontsize=15, fontweight='bold', color=INK, y=0.995)
plt.tight_layout(rect=(0, 0, 1, 0.975))
out3 = OUT_DIR / 'l4_03_rolling_average.png'
plt.savefig(out3, dpi=150, bbox_inches='tight')
plt.show()
print(f"  salvo: {out3}")

print("\n3 PNGs executivos gerados em outputs/learning/:")
for p in (out1, out2, out3):
    print(f"  · {p.name}")
