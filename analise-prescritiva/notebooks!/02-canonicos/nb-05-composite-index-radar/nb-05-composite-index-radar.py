"""NB-05 · Composite Index + Radar — Fusão 4 Dimensões
Análise Prescritiva — BYD Camaçari 2025-2027
"""
import json, os, sys, warnings
warnings.filterwarnings('ignore')
os.environ['MPLBACKEND'] = 'Agg'

NOTEBOOK_ROOT = r'C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva'
OUTPUT_DIR = os.path.join(NOTEBOOK_ROOT, 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

import numpy as np
import pandas as pd
import plotly.graph_objects as go

print("Bootstrap OK")

# ── Load upstream JSONs ────────────────────────────────────────────────────
def load_json(name):
    path = os.path.join(OUTPUT_DIR, name)
    if os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    return None

nb01 = load_json('nb01_results.json')
nb02 = load_json('nb02_results.json')
nb03 = load_json('nb03_results.json')

print("NB-01:", nb01['notebook'] if nb01 else "MISSING")
print("NB-02:", list(nb02.keys())[:4] if nb02 else "MISSING")
print("NB-03:", list(nb03.keys())[:4] if nb03 else "MISSING")

# ── Score helpers ─────────────────────────────────────────────────────────
def vol_to_score(vol_pct):
    return float(max(0, min(100, 100 - (vol_pct - 8) / (20 - 8) * 100)))

def vie_to_score(vie_pct):
    return float(max(0, min(100, vie_pct / 30 * 100)))

def hhi_to_score(hhi):
    return float(max(0, min(100, 100 - (hhi - 0.15) / (0.40 - 0.15) * 100)))

# ── D1: Câmbio (NB-01) ──────────────────────────────────────────────────
if nb01:
    vol_hist    = nb01['ptax']['hist_vol_ann']
    vol_lr      = nb01['vol_long_run_ann']
    mc_p5       = nb01['mc']['p5']
    bom_p95     = nb01['mc']['bom_p95']
    ptax_last   = nb01['ptax']['current']
    cambio_regime = nb01['hamilton']['current_regime']
    cambio_prob_turb = nb01['hamilton']['prob_turb_today']
else:
    vol_hist=14.17; vol_lr=14.67; mc_p5=-27.82; bom_p95=15.63; ptax_last=5.1176
    cambio_regime='Calma'; cambio_prob_turb=0.165

cambio_score = round(vol_to_score(vol_hist), 1)
cambio_status = 'GREEN' if cambio_score > 80 else ('AMBER' if cambio_score > 60 else 'RED')
print(f"\nD1 Câmbio: score={cambio_score}/100 status={cambio_status}")

# ── D2: Regulatório / BNDES (NB-03) ─────────────────────────────────────
if nb03:
    exp_vie   = nb03.get('expected_ViE', 0.184)   # 0.184 = 18.4%
    ks_prob   = nb03.get('kill_switch_prob', 0.10)
    exp_npv   = nb03.get('expected_NPV_B', 1.245)
else:
    exp_vie=0.184; ks_prob=0.10; exp_npv=1.245

vie_score = vie_to_score(exp_vie * 100)
kill_penalty = ks_prob * 50
regulatorio_score = round(max(0, vie_score - kill_penalty), 1)
regulatorio_status = 'GREEN' if regulatorio_score > 80 else ('AMBER' if regulatorio_score > 60 else 'RED')
print(f"D2 Regulatório: E[ViE]={exp_vie*100:.1f}% score={regulatorio_score}/100 status={regulatorio_status}")

# ── D3: Supply Chain (NB-02) ─────────────────────────────────────────────
if nb02:
    weighted_hhi = nb02.get('weighted_hhi', nb02.get('hhi', {}).get('weighted_hhi', 0.285))
    var_supply_B = nb02.get('var_supply_r1b', nb02.get('var', {}).get('total_r1b', 4.0))
    hhi_cats = nb02.get('hhi_by_category', nb02.get('hhi', {}).get('by_category', {}))
else:
    weighted_hhi=0.285; var_supply_B=4.0
    hhi_cats={'battery_cells':0.2725,'steel':0.3400,'electronics':0.2550,'lithium':0.2250,'wiring_harness':0.3550}

supply_score = round(hhi_to_score(weighted_hhi), 1)
supply_status = 'GREEN' if supply_score > 80 else ('AMBER' if supply_score > 60 else 'RED')
print(f"D3 Supply: HHI={weighted_hhi:.3f} score={supply_score}/100 status={supply_status}")

# ── D4: Macro ─────────────────────────────────────────────────────────────
macro_data = {'ipca':4.5, 'selic':10.5, 'embi_plus':280, 'pmi':52.1, 'commodity':105}
embi_score = max(0, min(100, 100 - (macro_data['embi_plus'] - 150) / (400 - 150) * 100))
ipca_penalty = max(0, (macro_data['ipca'] - 8) / (12 - 8) * 30)
macro_score = round(max(0, embi_score - ipca_penalty), 1)
macro_status = 'GREEN' if macro_score > 80 else ('AMBER' if macro_score > 60 else 'RED')
print(f"D4 Macro: EMBI+={macro_data['embi_plus']} score={macro_score}/100 status={macro_status}")

# ── Composite Index ───────────────────────────────────────────────────────
WEIGHTS = {'cambio': 0.30, 'regulatorio': 0.30, 'supply': 0.20, 'macro': 0.20}

composite = (cambio_score      * WEIGHTS['cambio']
            + regulatorio_score * WEIGHTS['regulatorio']
            + supply_score      * WEIGHTS['supply']
            + macro_score       * WEIGHTS['macro'])
composite = round(composite, 1)

if composite >= 80:   status_label = 'GREEN — Execução Limpa'
elif composite >= 65:  status_label = 'AMBER — Modo Tensão'
else:                  status_label = 'RED — Modo Crise'

print(f"\n╔══════════════════════════════════════════╗")
print(f"║  COMPOSITE: {composite}/100  |  {status_label:<22s}║")
print(f"╚══════════════════════════════════════════╝")
for dim, score in [('Câmbio (S1)', cambio_score), ('Regulatório (S3)', regulatorio_score),
                    ('Supply (S2)', supply_score), ('Macro (S6)', macro_score)]:
    bar = '█' * int(score/5) + '░' * (20 - int(score/5))
    print(f"  {dim:22s}: {score:5.1f}/100  {bar}")

# ── Radar chart ─────────────────────────────────────────────────────────
categories = ['Câmbio\n(S1)', 'Regulatório\n(S3)', 'Supply\n(S2)', 'Macro\n(S6)']
scores = [cambio_score, regulatorio_score, supply_score, macro_score]
closed_scores = scores + [scores[0]]
closed_cats   = categories + [categories[0]]

fig_radar = go.Figure()
fig_radar.add_trace(go.Scatterpolar(
    r=closed_scores, theta=closed_cats,
    fill='toself', fillcolor='rgba(79,142,247,0.25)',
    line=dict(color='#4f8ef7', width=2), marker=dict(size=8, color='#4f8ef7'),
    name='Score Atual',
    hovertemplate='%{theta}: %{r:.1f}<extra></extra>',
))
fig_radar.add_trace(go.Scatterpolar(
    r=[100]*5, theta=closed_cats, mode='lines',
    line=dict(color='#34d399', width=1, dash='dash'), marker=dict(size=4, color='#34d399'),
    name='Benchmark GREEN',
))
fig_radar.add_trace(go.Scatterpolar(
    r=[60]*5, theta=closed_cats, mode='lines',
    line=dict(color='#f87171', width=1, dash='dash'), marker=dict(size=4, color='#f87171'),
    name='Threshold RED',
))
fig_radar.update_layout(
    template='plotly_dark', paper_bgcolor='#0d1117', plot_bgcolor='#0d1117',
    title=dict(text=f'Índice Composto — Radar 4D  |  Score: {composite}/100  |  {status_label}', x=0.5, font=dict(size=16, color='#e8edf5')),
    polar=dict(bgcolor='#161b22',
        angularaxis=dict(color='#9baabb', tickfont=dict(color='#9baabb'), linecolor='#30363d'),
        radialaxis=dict(range=[0,100], color='#9baabb', tickfont=dict(color='#9baabb'),
                       gridcolor='#30363d', linecolor='#30363d', dtick=20)),
    legend=dict(orientation='h', yanchor='bottom', y=-0.15, xanchor='center', x=0.5,
                font=dict(color='#9baabb'), bgcolor='rgba(13,17,23,0.8)'),
    height=520, margin=dict(l=60, r=60, t=80, b=100),
)
radar_path = os.path.join(OUTPUT_DIR, 'nb05_composite_radar.html')
fig_radar.write_html(radar_path, include_plotlyjs='cdn')
print(f"\nSaved: {radar_path}")

# ── Bar chart ──────────────────────────────────────────────────────────────
colors = ['#4f8ef7' if s >= 80 else '#e8a23c' if s >= 60 else '#f87171' for s in scores]
fig_bar = go.Figure(go.Bar(
    x=categories, y=scores, marker_color=colors,
 marker_line_color='rgba(255,255,255,0.1)',
 marker_line_width=1,
    text=[f'{s:.1f}' for s in scores], textposition='outside',
    textfont=dict(color='#e8edf5', size=13),
    hovertemplate='%{x}: %{y:.1f}/100<extra></extra>',
))
fig_bar.update_layout(
    template='plotly_dark', paper_bgcolor='#0d1117', plot_bgcolor='#0d1117',
    title=dict(text=f'Score por Dimensão  |  COMPOSITE = {composite}/100 ({status_label.split(" — ")[0]})', x=0.5, font=dict(size=15, color='#e8edf5')),
    yaxis=dict(range=[0,110], dtick=20, title='Score 0-100', gridcolor='#30363d', linecolor='#30363d',
               tickfont=dict(color='#9baabb'), title_font=dict(color='#9baabb')),
    xaxis=dict(linecolor='#30363d', tickfont=dict(color='#9baabb')),
    height=380, showlegend=False, margin=dict(l=50, r=50, t=70, b=60),
)
for val, color, label in [(80,'#34d399','GREEN ≥80'),(60,'#e8a23c','AMBER ≥60')]:
    fig_bar.add_hline(y=val, line=dict(color=color, width=1, dash='dash'),
                      annotation_text=label, annotation_font_color=color)
bar_path = os.path.join(OUTPUT_DIR, 'nb05_composite_bars.html')
fig_bar.write_html(bar_path, include_plotlyjs='cdn')
print(f"Saved: {bar_path}")

# ── Gauge chart ────────────────────────────────────────────────────────────
gauge_color = '#34d399' if composite >= 80 else ('#e8a23c' if composite >= 65 else '#f87171')
fig_gauge = go.Figure(go.Indicator(
    mode='gauge+number+delta',
    value=composite,
    number=dict(valueformat='.1f', font=dict(size=52, color='#e8edf5')),
    delta=dict(reference=75, increasing=dict(color='#34d399'), decreasing=dict(color='#f87171')),
    gauge=dict(
        axis=dict(range=[0,100], ticks='outside', tickcolor='#30363d', tickwidth=2,
                  tickfont=dict(color='#9baabb')),
        bar=dict(color=gauge_color, thickness=0.25),
        bgcolor='#161b22', bordercolor='#30363d', borderwidth=2,
        steps=[
            dict(range=[0,60],  color='rgba(248,113,113,0.15)'),
            dict(range=[60,80], color='rgba(232,162,60,0.15)'),
            dict(range=[80,100],color='rgba(52,211,153,0.15)'),
        ],
        threshold=dict(line=dict(color='#e8edf5', width=3), value=composite, thickness=1.0),
    ),
    title=dict(text=f'Índice Composto  |  {status_label}', font=dict(size=14, color='#9baabb')),
))
fig_gauge.update_layout(template='plotly_dark', paper_bgcolor='#0d1117', height=380, margin=dict(l=30,r=30,t=80,b=30))
gauge_path = os.path.join(OUTPUT_DIR, 'nb05_composite_gauge.html')
fig_gauge.write_html(gauge_path, include_plotlyjs='cdn')
print(f"Saved: {gauge_path}")

# ── Sensitivity ────────────────────────────────────────────────────────────
print("\nSensibilidade do Composite ±20pp por dimensão:")
for dim_name, w, s in [
    ('Câmbio',      WEIGHTS['cambio'], cambio_score),
    ('Regulatório',  WEIGHTS['regulatorio'], regulatorio_score),
    ('Supply',       WEIGHTS['supply'], supply_score),
    ('Macro',        WEIGHTS['macro'], macro_score),
]:
    for delta in [-20, +20]:
        new_s = max(0, min(100, s + delta))
        new_c = composite - s * w + new_s * w
        print(f"  {dim_name:15s} {delta:+3d}pp → Score {new_s:5.1f} → Composite {new_c:5.1f} (Δ={new_c-composite:+.1f})")
    print()

# ── Export JSON ────────────────────────────────────────────────────────────
results = {
    'notebook': 'NB-05 Composite Index + Radar',
    'computed_at': pd.Timestamp.today().strftime('%Y-%m-%d'),
    'composite': composite,
    'composite_status': status_label,
    'weights': WEIGHTS,
    'dimensions': {
        'cambio':      {'score': cambio_score,      'status': cambio_status,      'weight': WEIGHTS['cambio']},
        'regulatorio': {'score': regulatorio_score, 'status': regulatorio_status, 'weight': WEIGHTS['regulatorio']},
        'supply':      {'score': supply_score,      'status': supply_status,      'weight': WEIGHTS['supply']},
        'macro':       {'score': macro_score,       'status': macro_status,       'weight': WEIGHTS['macro']},
    },
    'macro_inputs': macro_data,
}
out_path = os.path.join(OUTPUT_DIR, 'nb05_results.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(f"Saved: {out_path}")

print("\n══════════════════════════════════════════════════")
print(f"  NB-05 COMPLETO — COMPOSITE: {composite}/100  |  {status_label}")
print(f"  Câmbio={cambio_score}  Reg={regulatorio_score}  Supply={supply_score}  Macro={macro_score}")
print("══════════════════════════════════════════════════")
sys.exit(0)
