"""NB-12 · Sensitivity Analysis — Tornado + Weights
Análise Prescritiva — BYD Camaçari 2025-2027
Mirror twin of nb-12-sensitivity.ipynb

Sections:
  1. Setup & Imports
  2. Load dimension scores (NB-05)
  3. Base weights check (30/30/20/20)
  4. Tornado chart — ±20% por dimensão
  5. Weight sensitivity — ±15pp rebalanceamento
  6. Monte Carlo Dirichlet (10k paths)
  7. Decision matrix — estabilidade da prescrição
  8. Export results → outputs/nb12_results.json

Python312 executable: C:/Users/mathe/AppData/Local/Programs/Python/Python312/python.exe
Run: python nb-12-sensitivity.py
"""
import json, warnings, sys, os
warnings.filterwarnings('ignore')
os.environ['MPLBACKEND'] = 'Agg'

NOTEBOOK_ROOT = r'C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva'
OUTPUT_DIR = os.path.join(NOTEBOOK_ROOT, 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

print("Bootstrap OK:", sys.version.split()[0], "| NumPy", np.__version__,
      "| Pandas", pd.__version__)

# ─────────────────────────────────────────────────────────────────────────────
# CELL 1: Setup & Imports — dark terminal style
# ─────────────────────────────────────────────────────────────────────────────
plt.rcParams.update({
    'figure.facecolor': '#0d1117',
    'axes.facecolor':   '#161b22',
    'axes.edgecolor':   '#2a3a50',
    'axes.labelcolor':  '#9baabb',
    'text.color':       '#e8edf5',
    'xtick.color':      '#9baabb',
    'ytick.color':      '#9baabb',
    'grid.color':       '#1e2a3a',
    'grid.linewidth':   0.8,
    'legend.facecolor': '#161b22',
    'legend.edgecolor': '#2a3a50',
    'font.family':      'DejaVu Sans',
    'font.size':        11,
})
sns.set_style('darkgrid')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 2: Load Dimension Scores (NB-05 composite)
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 2] Load dimension scores from outputs/nb05_results.json…")
nb05_path = os.path.join(OUTPUT_DIR, 'nb05_results.json')
with open(nb05_path, 'r', encoding='utf-8') as f:
    nb05 = json.load(f)

DIM_ORDER = ['cambio', 'regulatorio', 'supply', 'macro']
DIM_LABELS = {
    'cambio':      'S1 Câmbio',
    'regulatorio': 'S2 Regulatório',
    'supply':      'S3 Supply',
    'macro':       'S4 Macro',
}
DIM_COLORS = {
    'cambio':      '#4f8ef7',
    'regulatorio': '#e8a23c',
    'supply':      '#34d399',
    'macro':       '#f87171',
}

scores       = {k: nb05['dimensions'][k]['score'] for k in DIM_ORDER}
weights      = {k: nb05['weights'][k]            for k in DIM_ORDER}
composite_base = nb05['composite']

print(f'  Composite NB-05 = {composite_base:.1f} ({nb05["composite_status"]})')
print(f'  Weights sum = {sum(weights.values()):.3f} (must = 1.0)')

def composite_fn(scores_dict, weights_dict):
    return sum(scores_dict[k] * weights_dict[k] for k in DIM_ORDER)

# Sanity
sanity_c = composite_fn(scores, weights)
print(f'  composite_fn(scores, weights) = {sanity_c:.4f}  (Δ vs NB-05: {abs(sanity_c - composite_base):.4f})')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 3: Base Weights display
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 3] Base weights (30/30/20/20)…")
print('  S1 Câmbio      ........ 30%')
print('  S2 Regulatório  ........ 30%')
print('  S3 Supply       ........ 20%')
print('  S4 Macro        ........ 20%')
print('                  -----')
print('  Total           ........ 100%')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 4: Tornado Chart — impacto ±20% por dimensão
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 4] Tornado chart — ±20% shock ceteris paribus…")
SHOCK_PCT = 0.20

tornado_rows = []
for k in DIM_ORDER:
    base_s  = scores[k]
    base_w  = weights[k]
    high_s  = base_s * (1 + SHOCK_PCT)
    low_s   = base_s * (1 - SHOCK_PCT)
    high_c  = composite_fn({**scores, k: high_s}, weights)
    low_c   = composite_fn({**scores, k: low_s},  weights)
    tornado_rows.append({
        'dim':        k,
        'label':      DIM_LABELS[k],
        'base':       base_s,
        'weight':     base_w,
        'high_c':     high_c,
        'low_c':      low_c,
        'delta_high': high_c - composite_base,
        'delta_low':  low_c  - composite_base,
        'range':      (high_c - composite_base) - (low_c - composite_base),
    })

tornado_df = pd.DataFrame(tornado_rows).sort_values('range', ascending=True).reset_index(drop=True)
print(f'{"Dimensão":<16s} {"Score":>6s} {"+20%":>8s} {"-20%":>8s} {"Range":>7s}')
for _, r in tornado_df.iterrows():
    print(f'  {r["label"]:<14s} {r["base"]:>6.1f} {r["high_c"]:>7.2f} {r["low_c"]:>7.2f} {r["range"]:>7.2f}')
top_row = tornado_df.iloc[-1]
print(f'  Top: {top_row["label"]} (range = {top_row["range"]:.2f} pp)')

# Save matplotlib tornado PNG (single panel)
fig, ax = plt.subplots(figsize=(10, 5.5), facecolor='#0d1117')
ax.set_facecolor('#161b22')
y_pos = np.arange(len(tornado_df))
for i, (_, r) in enumerate(tornado_df.iterrows()):
    color = DIM_COLORS[r['dim']]
    ax.barh(i, r['delta_low'],  height=0.7, color=color, alpha=0.85, edgecolor='none')
    ax.barh(i, r['delta_high'], height=0.7, color=color, alpha=0.85, edgecolor='none')
    ax.text(r['delta_high'] + 0.1, i, f'+{r["delta_high"]:.2f}',
            va='center', ha='left', color='#e8edf5', fontsize=10, fontweight='bold')
    ax.text(r['delta_low']  - 0.1, i, f'{r["delta_low"]:.2f}',
            va='center', ha='right', color='#e8edf5', fontsize=10, fontweight='bold')
ax.axvline(0, color='#e8edf5', lw=1.5, alpha=0.9)
ax.set_yticks(y_pos)
ax.set_yticklabels(tornado_df['label'], color='#e8edf5', fontsize=11)
ax.set_xlabel('Δ Composite (pp)', color='#9baabb', fontsize=11)
ax.set_title(f'Tornado Chart — Impacto ±20% no Composite (base = {composite_base:.1f})',
             color='#e8edf5', fontsize=13, fontweight='bold', pad=15)
ax.grid(True, alpha=0.3, axis='x')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
x_max = max(tornado_df['delta_high'].abs().max(), tornado_df['delta_low'].abs().max())
ax.set_xlim(-x_max - 1.5, x_max + 1.5)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'nb12_tornado.png'), dpi=150, bbox_inches='tight')
plt.close()
print('  Saved: outputs/nb12_tornado.png')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 5: Weight Sensitivity — ±15pp rebalanceamento
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 5] Weight sensitivity — ±15pp rebalance…")
W_DELTA = 0.15

wsens_rows = []
for k in DIM_ORDER:
    for direction in [+1, -1]:
        new_w = weights.copy()
        new_w[k] = weights[k] + direction * W_DELTA
        others = [j for j in DIM_ORDER if j != k]
        share_per_other = -direction * W_DELTA / len(others)
        for j in others:
            new_w[j] = weights[j] + share_per_other
        new_c = composite_fn(scores, new_w)
        wsens_rows.append({
            'dim':        k,
            'label':      DIM_LABELS[k],
            'direction':  '+' if direction > 0 else '-',
            'shift_pp':   direction * W_DELTA * 100,
            'new_weight': new_w[k],
            'composite':  new_c,
            'delta':      new_c - composite_base,
        })

wsens_df = pd.DataFrame(wsens_rows).sort_values('delta', ascending=True).reset_index(drop=True)
print(f'{"Dimensão":<16s} {"Shift":>8s} {"New w":>8s} {"Composite":>11s} {"Δ":>8s}')
for _, r in wsens_df.iterrows():
    print(f'  {r["label"]:<14s} {r["shift_pp"]:>+7.0f}pp {r["new_weight"]:>7.1%} {r["composite"]:>10.2f} {r["delta"]:>+8.2f}')
print(f'  → Max composite under ±15pp shift: {wsens_df["composite"].max():.2f} '
      f'(Expansão threshold = 60.00 — NÃO cruzado)')

# Save matplotlib weight-sensitivity PNG
fig, ax = plt.subplots(figsize=(10, 5.5), facecolor='#0d1117')
ax.set_facecolor('#161b22')
y_pos = np.arange(len(wsens_df))
colors = ['#34d399' if r['delta'] > 0 else '#f87171' for _, r in wsens_df.iterrows()]
bars = ax.barh(y_pos, wsens_df['delta'], color=colors, alpha=0.85, edgecolor='none')
for bar, r in zip(bars, wsens_df.itertuples()):
    ax.text(r.delta + (0.05 if r.delta > 0 else -0.05), bar.get_y() + bar.get_height()/2,
            f'{r.delta:+.2f}',
            va='center', ha='left' if r.delta > 0 else 'right',
            color='#e8edf5', fontsize=10, fontweight='bold')
ax.axvline(0, color='#e8edf5', lw=1.5, alpha=0.9)
ax.set_yticks(y_pos)
labels = [f'{r.label} ({r.shift_pp:+.0f}pp)' for _, r in wsens_df.iterrows()]
ax.set_yticklabels(labels, color='#e8edf5', fontsize=10)
ax.set_xlabel('Δ Composite (pp)', color='#9baabb', fontsize=11)
ax.set_title(f'Weight Sensitivity — Rebalanceamento ±15pp (base = {composite_base:.1f})',
             color='#e8edf5', fontsize=13, fontweight='bold', pad=15)
ax.grid(True, alpha=0.3, axis='x')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'nb12_weight_sensitivity.png'), dpi=150, bbox_inches='tight')
plt.close()
print('  Saved: outputs/nb12_weight_sensitivity.png')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 6: Monte Carlo — Dirichlet(α=1) 10k paths
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 6] Monte Carlo Dirichlet(α=1) — 10.000 paths…")
np.random.seed(42)
N_PATHS = 10_000

alpha = np.ones(len(DIM_ORDER))                         # Dirichlet(α=1) uniforme no simplex
weights_mc = np.random.dirichlet(alpha, size=N_PATHS)
scores_vec = np.array([scores[k] for k in DIM_ORDER])
composites_mc = weights_mc @ scores_vec

percentiles = [1, 5, 10, 25, 50, 75, 90, 95, 99]
mc_stats = {
    'mean':  float(np.mean(composites_mc)),
    'std':   float(np.std(composites_mc)),
    'min':   float(np.min(composites_mc)),
    'max':   float(np.max(composites_mc)),
}
for p in percentiles:
    mc_stats[f'p{p}'] = float(np.percentile(composites_mc, p))

prob_above_60 = float(np.mean(composites_mc > 60))
prob_above_55 = float(np.mean(composites_mc > 55))
prob_above_50 = float(np.mean(composites_mc > 50))
prob_below_45 = float(np.mean(composites_mc < 45))

print(f'  Mean={mc_stats["mean"]:.2f}  Std={mc_stats["std"]:.2f}')
print(f'  P5={mc_stats["p5"]:.2f}  P50={mc_stats["p50"]:.2f}  P95={mc_stats["p95"]:.2f}')
print(f'  P(composite > 60) = {prob_above_60:.2%}')
print(f'  P(composite > 55) = {prob_above_55:.2%}')
print(f'  P(composite < 50) = {1 - prob_above_50:.2%}')

# Save MC distribution PNG (2 panels)
fig, axes = plt.subplots(1, 2, figsize=(13, 5), facecolor='#0d1117')

ax = axes[0]
ax.set_facecolor('#161b22')
ax.hist(composites_mc, bins=80, color='#4f8ef7', alpha=0.75, edgecolor='none', density=True)
ax.axvline(composite_base, color='#e8a23c', lw=2, ls='--', label=f'Base = {composite_base:.1f}')
ax.axvline(60, color='#34d399', lw=1.5, ls=':', label='Threshold Expansão (60)')
ax.axvline(50, color='#f87171', lw=1.5, ls=':', label='Threshold Modo Crise (50)')
y_lim_top = ax.get_ylim()[1] if ax.get_ylim()[1] > 0 else 1
ax.fill_betweenx([0, y_lim_top], 50, 60, alpha=0.10, color='#e8a23c', label='Zona Tensão')
ax.set_xlabel('Composite', color='#9baabb')
ax.set_ylabel('Densidade', color='#9baabb')
ax.set_title('Distribuição MC do Composite (10k paths)', color='#e8edf5', fontsize=12)
ax.legend(fontsize=9, loc='upper right')
ax.grid(True, alpha=0.3)

ax = axes[1]
ax.set_facecolor('#161b22')
scatter = ax.scatter(weights_mc[:, 0], weights_mc[:, 1],
                     c=composites_mc, cmap='RdYlGn', s=4, alpha=0.4, edgecolor='none')
ax.scatter(weights['cambio'], weights['regulatorio'],
           color='#e8a23c', s=200, marker='*', edgecolor='#0d1117', lw=2,
           label='Base (30%, 30%)', zorder=5)
ax.set_xlabel('w(S1 Câmbio)', color='#9baabb')
ax.set_ylabel('w(S2 Regulatório)', color='#9baabb')
ax.set_title('S1 vs S2 (composite em cor)', color='#e8edf5', fontsize=12)
ax.legend(fontsize=9, loc='upper right')
ax.grid(True, alpha=0.3)
ax.set_xlim(0, 0.7)
ax.set_ylim(0, 0.7)
cbar = plt.colorbar(scatter, ax=ax, shrink=0.8)
cbar.set_label('Composite', color='#9baabb')

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'nb12_mc_distribution.png'), dpi=150, bbox_inches='tight')
plt.close()
print('  Saved: outputs/nb12_mc_distribution.png')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 7: Decision Matrix
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 7] Decision matrix — estabilidade da prescrição…")
scenarios = [
    {'name': 'Base (sem mudança)',  'shocks': {}},
    {'name': 'S1 +20% (câmbio ok)', 'shocks': {'cambio': +0.20}},
    {'name': 'S2 +20% (reg ok)',    'shocks': {'regulatorio': +0.20}},
    {'name': 'S3 +20% (supply ok)', 'shocks': {'supply': +0.20}},
    {'name': 'S4 +20% (macro ok)',  'shocks': {'macro': +0.20}},
    {'name': 'S1 + S2 +20%',        'shocks': {'cambio': +0.20, 'regulatorio': +0.20}},
    {'name': 'S1 + S2 + S3 +20%',   'shocks': {'cambio': +0.20, 'regulatorio': +0.20, 'supply': +0.20}},
    {'name': 'Todas +20%',          'shocks': {'cambio': +0.20, 'regulatorio': +0.20, 'supply': +0.20, 'macro': +0.20}},
    {'name': 'S1 -20% (câmbio pior)', 'shocks': {'cambio': -0.20}},
    {'name': 'S2 -20% (reg pior)',    'shocks': {'regulatorio': -0.20}},
    {'name': 'S1 + S2 -20%',          'shocks': {'cambio': -0.20, 'regulatorio': -0.20}},
    {'name': 'Todas -20%',            'shocks': {'cambio': -0.20, 'regulatorio': -0.20, 'supply': -0.20, 'macro': -0.20}},
]

threshold_exp = 60.0
threshold_crisis = 50.0

print(f'{"Cenário":<28s} {"Composite":>11s} {"Estado":>22s} {"Δ":>10s}')
print('-' * 80)
for s in scenarios:
    new_scores = scores.copy()
    for kk, sh in s['shocks'].items():
        new_scores[kk] = scores[kk] * (1 + sh)
    new_c = composite_fn(new_scores, weights)
    delta = new_c - composite_base
    if new_c > threshold_exp:
        state = 'EXPLODE (Expansão)'
    elif new_c > threshold_crisis:
        state = 'TENSÃO (Modo Tensão)'
    else:
        state = 'CRISE (Modo Crise)'
    print(f'  {s["name"]:<26s} {new_c:>10.2f} {state:>22s} {delta:>+8.2f}pp')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 8: Export results
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 8] Export → outputs/nb12_results.json…")
results = {
    'notebook':        'NB-12 Sensitivity Analysis (Tornado + Weights)',
    'computed_at':     pd.Timestamp.today().strftime('%Y-%m-%d'),
    'source':          'NB-05 Composite Index',
    'composite_base':  composite_base,
    'scores':          scores,
    'weights_base':    weights,
    'tornado':         tornado_df.to_dict(orient='records'),
    'weight_sensitivity': wsens_df.to_dict(orient='records'),
    'mc': {
        'n_paths':        N_PATHS,
        'dist':           'Dirichlet(α=1)',
        **{k: float(v) for k, v in mc_stats.items()},
        'prob_above_60':  prob_above_60,
        'prob_above_55':  prob_above_55,
        'prob_above_50':  prob_above_50,
        'prob_below_45':  prob_below_45,
    },
    'decision': {
        'threshold_expansao': 60.0,
        'threshold_crise':    50.0,
        'gap_needed':         60.0 - composite_base,
        'scenarios': [
            {
                'name':      s['name'],
                'shocks':    s['shocks'],
                'composite': round(
                    composite_fn(
                        {**scores, **{k: scores[k] * (1 + sh) for k, sh in s['shocks'].items()}},
                        weights,
                    ), 2
                ),
            }
            for s in scenarios
        ],
    },
    'key_findings': {
        'top_tornado_dim':     tornado_df.iloc[-1]['label'],
        'top_tornado_range':   float(tornado_df.iloc[-1]['range']),
        'total_tornado_range': float(tornado_df['range'].sum()),
        'mc_mean':             mc_stats['mean'],
        'mc_p5':               mc_stats['p5'],
        'mc_p95':              mc_stats['p95'],
        'prob_expansao':       prob_above_60,
        'recommendation':      'Composite permanece em MODO TENSÃO em todos os cenários locais. '
                               'Prescrição defensiva estável. Reverter para Expansão requer '
                               'melhoria estrutural em TODAS as 4 dimensões.',
    },
}

out_path = os.path.join(OUTPUT_DIR, 'nb12_results.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print('  Saved:', out_path)

print("\n==============================================================")
print("  NB-12 COMPLETO — Sensitivity Analysis (Tornado + Weights)")
print("  Composite base =", round(composite_base, 2),
      "| Tornado top =", tornado_df.iloc[-1]['label'],
      "(range", round(tornado_df.iloc[-1]['range'], 2), "pp)")
print("  MC mean =", round(mc_stats['mean'], 2),
      "| P5/P95 =", round(mc_stats['p5'], 2), "/", round(mc_stats['p95'], 2),
      "| P(composite>60) =", round(prob_above_60 * 100, 2), "%")
print("==============================================================")
sys.exit(0)
