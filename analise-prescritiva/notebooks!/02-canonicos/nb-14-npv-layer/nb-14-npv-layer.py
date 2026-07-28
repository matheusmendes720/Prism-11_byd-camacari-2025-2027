"""NB-14 · NPV Layer — Cost-Benefit das 25 Prescrições
Análise Prescritiva — Camada Operacional — BYD Camaçari 2025-2027
Python312 executable: C:/Users/mathe/AppData/Local/Programs/Python/Python312/python.exe
Run: python nb-14-npv-layer.py

Expande o _model_npv.json (5 prescrições) para o registro operacional
completo de 25 ações (AG-001..AG-026, AG-017 REMOVIDA). Calcula custo,
benefício esperado, NPV @ 13%/3y, counterfactual, ROI 200x, tornado,
ranking e decision matrix. Exporta outputs/nb14_results.json.
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
import plotly.graph_objects as go

print("Bootstrap OK:", sys.version.split()[0], "| NumPy", np.__version__, "| Pandas", pd.__version__)

# ─────────────────────────────────────────────────────────────────────────────
# CELL 1: Discount params (herdados de _model_npv.json)
# ─────────────────────────────────────────────────────────────────────────────
R = 0.13            # taxa de desconto nominal (NTN-B 10y ~11% + 200bps soberano)
H = 3               # horizonte 3 anos
ANNUITY = sum(1 / (1 + R) ** t for t in range(1, H + 1))   # 2.361153...
print(f"\n[CELL 1] r={R:.0%} | horizonte={H}a | fator anuidade={ANNUITY:.4f}")


def npv(capex, opex, benefit, r=R, h=H):
    """NPV = -capex + Σ (benefit - opex) / (1+r)^t."""
    return -capex + sum((benefit - opex) / (1 + r) ** t for t in range(1, h + 1))


def cost_pv(capex, opex, r=R, h=H):
    """Valor presente do custo total (capex + opex descontado)."""
    return capex + sum(opex / (1 + r) ** t for t in range(1, h + 1))


# ─────────────────────────────────────────────────────────────────────────────
# CELL 2: As 25 ações com custos (AG-001..AG-026, AG-017 REMOVIDA)
# Primitivos auditáveis: var_exp (exposição R$M), cov (cobertura), p (prob anual)
# benefit_anual esperado = var_exp × cov × p
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 2] Catálogo das 25 ações + custos…")

# fields: ag, name, dim, prio, capex, opex, var_exp, cov, p, cond, status
ACTIONS = [
    dict(ag='AG-001', name='Resolver lista suja S7 (kill switch)', dim='S7', prio='CRÍTICA',
         capex=25.0, opex=0.0, var_exp=800, cov=0.60, p=0.30, cond=False, status='EM CURSO'),
    dict(ag='AG-002', name='Implementar hedge FX 95%', dim='S1', prio='CRÍTICA',
         capex=0.0, opex=48.6, var_exp=2100, cov=0.47, p=0.12, cond=False, status='PENDENTE'),
    dict(ag='AG-003', name='Acelerar nacionalização 70%', dim='S8', prio='CRÍTICA',
         capex=150.0, opex=10.0, var_exp=650, cov=0.85, p=0.40, cond=False, status='EM CURSO'),
    dict(ag='AG-004', name='Diferenciação (tier + game theory)', dim='S4/S11', prio='CRÍTICA',
         capex=6.5, opex=0.0, var_exp=500, cov=0.40, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-005', name='Reserva lítio + safety stock', dim='S2', prio='CRÍTICA',
         capex=30.0, opex=0.0, var_exp=400, cov=0.25, p=0.40, cond=False, status='EM CURSO'),
    dict(ag='AG-006', name='Renegociar tariff quota Camex', dim='S10', prio='CRÍTICA',
         capex=24.0, opex=0.0, var_exp=2380, cov=0.35, p=0.35, cond=False, status='PENDENTE'),
    dict(ag='AG-007', name='Definir resposta competitiva (Nash)', dim='S11', prio='CRÍTICA',
         capex=6.0, opex=0.0, var_exp=300, cov=0.30, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-008', name='Plano contingência overcapacity', dim='S11/S9', prio='CRÍTICA',
         capex=4.0, opex=0.0, var_exp=200, cov=0.30, p=0.20, cond=True, status='PENDENTE'),
    dict(ag='AG-009', name='Setup compliance ESG + auditoria', dim='S7', prio='CRÍTICA',
         capex=0.0, opex=0.0, var_exp=200, cov=0.40, p=0.30, cond=False, status='PLANEJADO',
         note='custo consolidado em AG-001 (mesmas ações AG-033..AG-037)'),
    dict(ag='AG-010', name='Monitor T-MV1 (4-shock stress)', dim='S6', prio='CRÍTICA',
         capex=1.4, opex=0.8, var_exp=12800, cov=0.10, p=0.02, cond=False, status='PENDENTE'),
    dict(ag='AG-011', name='Calcular h* baseline (constraint)', dim='S1', prio='ALTA',
         capex=0.05, opex=0.0, var_exp=2100, cov=0.03, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-012', name='Constraint VaR ≤ 20% da margem', dim='S1', prio='ALTA',
         capex=0.05, opex=0.0, var_exp=1500, cov=0.05, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-013', name='Contratar 4 counterparties hedge', dim='S1', prio='ALTA',
         capex=0.0, opex=0.0, var_exp=2100, cov=0.02, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-014', name='Stress test FX+supply (12 combos)', dim='S1', prio='ALTA',
         capex=0.5, opex=0.0, var_exp=1850, cov=0.02, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-015', name='Recalibração semestral vol implícita', dim='S1', prio='MÉDIA',
         capex=0.0, opex=0.3, var_exp=2100, cov=0.01, p=0.30, cond=False, status='CONTÍNUO'),
    dict(ag='AG-016', name='Implementar tier system 0/1/2/3', dim='S4', prio='ALTA',
         capex=5.0, opex=33.5, var_exp=400, cov=0.29, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-018', name='Defensivo targeted Tier 2 (5k und)', dim='S4', prio='ALTA',
         capex=15.0, opex=0.0, var_exp=300, cov=0.25, p=0.25, cond=True, status='CONDICIONAL'),
    dict(ag='AG-019', name='Análise competitiva trimestral', dim='S4/S11', prio='ALTA',
         capex=0.0, opex=2.0, var_exp=300, cov=0.15, p=0.30, cond=False, status='CONTÍNUO'),
    dict(ag='AG-020', name='Game theory layer (Nash Differentiate)', dim='S4/S11', prio='ALTA',
         capex=1.5, opex=0.0, var_exp=500, cov=0.20, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-021', name='Qualificar EVE Tier 1 (12m)', dim='S2', prio='ALTA',
         capex=280.0, opex=0.0, var_exp=1480, cov=0.30, p=0.40, cond=False, status='PENDENTE'),
    dict(ag='AG-022', name='Contratos CATL LP 70% locked', dim='S2', prio='CRÍTICA',
         capex=340.0, opex=60.0, var_exp=1480, cov=0.85, p=0.45, cond=False, status='EM CURSO'),
    dict(ag='AG-023', name='Mapear 3 fornecedores alternativos', dim='S2', prio='MÉDIA',
         capex=0.5, opex=0.0, var_exp=400, cov=0.05, p=0.30, cond=False, status='PENDENTE'),
    dict(ag='AG-024', name='Safety stock +30 dias (S6 AMBER+)', dim='S2', prio='MÉDIA',
         capex=30.0, opex=0.0, var_exp=400, cov=0.15, p=0.35, cond=True, status='CONDICIONAL'),
    dict(ag='AG-025', name='Plano B spot purchasing (S6 RED)', dim='S2', prio='ALTA',
         capex=80.0, opex=0.0, var_exp=1480, cov=0.20, p=0.30, cond=True, status='CONDICIONAL'),
    dict(ag='AG-026', name='Auto-trigger S6 → S1/S2/S3/S4/S5', dim='S6', prio='ALTA',
         capex=0.8, opex=0.0, var_exp=8210, cov=0.03, p=0.30, cond=False, status='PENDENTE'),
]

assert len(ACTIONS) == 25, f"esperado 25 ações, obtido {len(ACTIONS)}"
assert len({a['ag'] for a in ACTIONS}) == 25, "IDs duplicados"
assert 'AG-017' not in {a['ag'] for a in ACTIONS}, "AG-017 (catalog-wide) foi REMOVIDA"
print(f"  25 ações carregadas | AG-017 REMOVIDA (ROI -67%) | críticas="
      f"{sum(a['prio'] == 'CRÍTICA' for a in ACTIONS)} | condicionais="
      f"{sum(a['cond'] for a in ACTIONS)}")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 3: Benefício esperado + NPV + ROI por ação
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 3] Benefício esperado, NPV e ROI por ação…")

rows = []
for a in ACTIONS:
    benefit = a['var_exp'] * a['cov'] * a['p']            # benefício anual esperado
    cost3y = a['capex'] + a['opex'] * H
    cpv = cost_pv(a['capex'], a['opex'])
    action_npv = npv(a['capex'], a['opex'], benefit)
    roi = (action_npv / cpv * 100) if cpv > 0 else float('inf')
    rows.append({
        'ag': a['ag'], 'name': a['name'], 'dim': a['dim'], 'prio': a['prio'],
        'cond': a['cond'], 'status': a['status'],
        'var_exp': a['var_exp'], 'cov': a['cov'], 'p': a['p'],
        'benefit_anual': round(benefit, 2),
        'benefit_3y': round(benefit * H, 2),
        'capex': a['capex'], 'opex': a['opex'], 'cost_3y': round(cost3y, 2),
        'cost_pv': round(cpv, 2),
        'npv': round(action_npv, 2),
        'roi_pct': round(roi, 1) if np.isfinite(roi) else None,
        'note': a.get('note', ''),
    })

df = pd.DataFrame(rows)
portfolio_npv = float(df['npv'].sum())
portfolio_npv_base = float(df.loc[~df['cond'], 'npv'].sum())     # sem condicionais
total_capex = float(df['capex'].sum())
total_cost3y = float(df['cost_3y'].sum())
print(f"  NPV portfólio (25 ações):        R$ {portfolio_npv:,.1f}M")
print(f"  NPV portfólio (base, sem cond.): R$ {portfolio_npv_base:,.1f}M")
print(f"  Capex total:                     R$ {total_capex:,.1f}M")
print(f"  Custo total 3y:                  R$ {total_cost3y:,.1f}M")
print(f"  Ações NPV+ : {int((df['npv'] > 0).sum())}/25 | NPV- : {int((df['npv'] <= 0).sum())}/25")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 4: Counterfactual — Com Framework vs Sem Framework
# 6 stress events backtested (LINHAGEM Cap 11)
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 4] Counterfactual — Com vs Sem framework…")

stress_events = [
    {'event': 'COVID 2020',           'year': 2020, 'avoided_rsm': 50},
    {'event': 'Semicondutor 2021',    'year': 2021, 'avoided_rsm': 30},
    {'event': 'Eleição 2022',         'year': 2022, 'avoided_rsm': 20},
    {'event': 'Spike lítio 2022',     'year': 2022, 'avoided_rsm': 80},
    {'event': 'Eleição 2024',         'year': 2024, 'avoided_rsm': 15},
    {'event': 'Stagflation 2025',     'year': 2025, 'avoided_rsm': 5},
]
stress_avoided_total = sum(e['avoided_rsm'] for e in stress_events)   # R$ 200M+

counterfactual = {
    'com_framework': {
        'framework_cost_rsm': 3.0,
        'stress_avoided_rsm_ano': stress_avoided_total,
        'deteccao_dias': 14.0,
        'resposta_dias': 9.3,
        'var_residual_note': 'VaR mitigado via hedge/dual-sourcing/triggers',
    },
    'sem_framework': {
        'framework_cost_rsm': 0.0,
        'stress_avoided_rsm_ano': 0.0,
        'resposta_horas_por_signal': '4-8h manual, decisão em semanas',
        'var_4shock_rbi': 8.21,      # R$ 8.21bi VaR 95% 4-shock
        'cvar_95_rbi': 10.14,        # R$ 10.14bi CVaR 95%
    },
    'delta_ano_rsm': stress_avoided_total,
}
for e in stress_events:
    print(f"  {e['event']:<22} evitado R$ {e['avoided_rsm']:>3}M")
print(f"  {'TOTAL/ano':<22} evitado R$ {stress_avoided_total:>3}M+")
print(f"  Sem framework: exposição VaR 4-shock R$ 8,21 bi | CVaR R$ 10,14 bi | resposta manual 4-8h/signal")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 5: ROI headline — R$3M investido, R$200M+/ano evitado, ROI 200x
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 5] ROI headline do framework…")

framework_cost = 3.0                                # R$ 3M (F1-F3, 28 semanas)
avoided_per_year = float(stress_avoided_total)       # R$ 200M+/ano
avoided_3y = avoided_per_year * H                    # R$ 600M em 3 anos
roi_3y_x = avoided_3y / framework_cost               # 600/3 = 200x
roi_anual_x = avoided_per_year / framework_cost      # 200/3 = 66.7x
payback_meses = framework_cost / (avoided_per_year / 12.0)
framework_npv = npv(framework_cost, 0.0, avoided_per_year)

roi_headline = {
    'framework_cost_rsm': framework_cost,
    'avoided_per_year_rsm': avoided_per_year,
    'avoided_3y_rsm': avoided_3y,
    'roi_3y_x': round(roi_3y_x, 1),
    'roi_anual_x': round(roi_anual_x, 1),
    'payback_meses': round(payback_meses, 2),
    'framework_npv_rsm': round(framework_npv, 1),
}
print(f"  Investimento framework:  R$ {framework_cost:.0f}M (F1-F3, 28 semanas)")
print(f"  Stress evitado:          R$ {avoided_per_year:.0f}M+/ano  →  R$ {avoided_3y:.0f}M em 3 anos")
print(f"  ROI (3 anos):            {roi_3y_x:.0f}x   |  ROI anual: {roi_anual_x:.1f}x")
print(f"  Payback:                 {payback_meses:.2f} meses (< 1 mês)")
print(f"  NPV framework (3y@13%):  R$ {framework_npv:,.1f}M")
assert round(roi_3y_x) == 200, "ROI 3y deve ser 200x"

# ─────────────────────────────────────────────────────────────────────────────
# CELL 6: NPV Tornado — sensibilidade do NPV do portfólio aos drivers globais
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 6] NPV Tornado — drivers globais…")


def portfolio_npv_with(r=R, p_mult=1.0, cov_mult=1.0, var_mult=1.0, opex_mult=1.0, capex_mult=1.0):
    total = 0.0
    for a in ACTIONS:
        benefit = (a['var_exp'] * var_mult) * min(a['cov'] * cov_mult, 1.0) * min(a['p'] * p_mult, 1.0)
        total += npv(a['capex'] * capex_mult, a['opex'] * opex_mult, benefit, r=r)
    return total


base_np = portfolio_npv_with()
drivers = [
    ('Taxa de desconto r (±3pp)',      dict(r=R + 0.03),        dict(r=R - 0.03)),
    ('Prob. shock p (±30%)',           dict(p_mult=0.70),       dict(p_mult=1.30)),
    ('Cobertura cov (±20%)',           dict(cov_mult=0.80),     dict(cov_mult=1.20)),
    ('Exposição VaR (±25%)',           dict(var_mult=0.75),     dict(var_mult=1.25)),
    ('Opex recorrente (±30%)',         dict(opex_mult=1.30),    dict(opex_mult=0.70)),
    ('Capex (±20%)',                   dict(capex_mult=1.20),   dict(capex_mult=0.80)),
]
tornado = []
for label, low_kw, high_kw in drivers:
    low = portfolio_npv_with(**low_kw)
    high = portfolio_npv_with(**high_kw)
    tornado.append({'driver': label, 'low': low, 'high': high,
                    'swing': abs(high - low)})
tornado = sorted(tornado, key=lambda d: d['swing'], reverse=True)
print(f"  NPV base do portfólio: R$ {base_np:,.1f}M")
for t in tornado:
    print(f"   {t['driver']:<28} low=R${t['low']:>8,.0f}M  high=R${t['high']:>8,.0f}M  swing=R${t['swing']:>7,.0f}M")

# Tornado chart (matplotlib PNG)
fig, ax = plt.subplots(figsize=(10, 5.5))
ypos = np.arange(len(tornado))
for i, t in enumerate(tornado):
    lo, hi = sorted([t['low'], t['high']])
    ax.barh(i, hi - lo, left=lo, color='#3b82f6', edgecolor='#1e3a8a', height=0.6)
ax.axvline(base_np, color='#ef4444', ls='--', lw=1.5, label=f'NPV base R${base_np:,.0f}M')
ax.set_yticks(ypos)
ax.set_yticklabels([t['driver'] for t in tornado])
ax.invert_yaxis()
ax.set_xlabel('NPV do portfólio (R$ M)')
ax.set_title('NB-14 · NPV Tornado — sensibilidade aos drivers globais', fontweight='bold')
ax.legend(loc='lower right')
ax.grid(axis='x', alpha=0.3)
fig.tight_layout()
png_tornado = os.path.join(OUTPUT_DIR, 'nb14_tornado.png')
fig.savefig(png_tornado, dpi=130)
plt.close(fig)

# Tornado chart (plotly HTML)
figp = go.Figure()
for t in tornado:
    lo, hi = sorted([t['low'], t['high']])
    figp.add_trace(go.Bar(y=[t['driver']], x=[hi - lo], base=lo, orientation='h',
                          marker_color='#3b82f6', showlegend=False,
                          hovertemplate=f"{t['driver']}<br>low R${t['low']:,.0f}M<br>high R${t['high']:,.0f}M<extra></extra>"))
figp.add_vline(x=base_np, line_dash='dash', line_color='#ef4444',
               annotation_text=f'base R${base_np:,.0f}M')
figp.update_layout(title='NB-14 · NPV Tornado — drivers globais', xaxis_title='NPV portfólio (R$ M)',
                   template='plotly_white', height=430, margin=dict(l=220, r=40, t=60, b=40))
html_tornado = os.path.join(OUTPUT_DIR, 'nb14_tornado.html')
figp.write_html(html_tornado, include_plotlyjs='cdn')
print(f"  Salvos: {png_tornado} | {html_tornado}")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 7: Ranking por NPV
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 7] Ranking por NPV…")
ranked = df.sort_values('npv', ascending=False).reset_index(drop=True)
ranked.insert(0, 'rank', ranked.index + 1)
print(ranked[['rank', 'ag', 'name', 'dim', 'npv', 'roi_pct', 'cost_3y']]
      .to_string(index=False, max_colwidth=38))

# Ranking chart (matplotlib PNG)
fig, ax = plt.subplots(figsize=(11, 8))
colors = ['#16a34a' if v > 0 else '#dc2626' for v in ranked['npv']]
ax.barh(ranked['ag'] + ' ' + ranked['name'].str.slice(0, 26), ranked['npv'], color=colors)
ax.invert_yaxis()
ax.axvline(0, color='#334155', lw=1)
ax.set_xlabel('NPV (R$ M)')
ax.set_title('NB-14 · Ranking das 25 ações por NPV (3y @ 13%)', fontweight='bold')
ax.grid(axis='x', alpha=0.3)
ax.tick_params(axis='y', labelsize=8)
fig.tight_layout()
png_rank = os.path.join(OUTPUT_DIR, 'nb14_ranking.png')
fig.savefig(png_rank, dpi=130)
plt.close(fig)

figp2 = go.Figure(go.Bar(
    x=ranked['npv'], y=ranked['ag'] + ' ' + ranked['name'].str.slice(0, 30),
    orientation='h', marker_color=colors,
    hovertemplate='%{y}<br>NPV R$%{x:.1f}M<extra></extra>'))
figp2.update_layout(title='NB-14 · Ranking das 25 ações por NPV', xaxis_title='NPV (R$ M)',
                    template='plotly_white', height=720, yaxis=dict(autorange='reversed'),
                    margin=dict(l=280, r=40, t=60, b=40))
html_rank = os.path.join(OUTPUT_DIR, 'nb14_ranking.html')
figp2.write_html(html_rank, include_plotlyjs='cdn')
print(f"  Salvos: {png_rank} | {html_rank}")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 8: Decision Matrix
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 8] Decision matrix…")


def decide(r):
    if r['npv'] <= 0:
        return 'MONITORAR / REAVALIAR'
    if r['cond']:
        return 'CONDICIONAL (trigger)'
    if r['prio'] == 'CRÍTICA':
        return 'EXECUTAR JÁ (90d)'
    return 'EXECUTAR'


dm = ranked.copy()
dm['decisao'] = dm.apply(decide, axis=1)

# Linha de referência: AG-017 catalog-wide REMOVIDA (contraprova de ação ruim)
ref_removed = {
    'rank': None, 'ag': 'AG-017', 'name': 'Defensivo catalog-wide (REMOVIDA)',
    'dim': 'S4', 'prio': '—', 'cond': False, 'status': 'REMOVIDO',
    'npv': -67.0, 'roi_pct': -67.0, 'cost_3y': 100.0, 'decisao': 'REJEITAR (ROI -67%)',
}

decision_cols = ['rank', 'ag', 'name', 'dim', 'prio', 'npv', 'roi_pct', 'decisao']
decision_matrix = dm[decision_cols].to_dict(orient='records')
decision_matrix.append({k: ref_removed[k] for k in decision_cols})

summary_decisao = dm['decisao'].value_counts().to_dict()
print(dm[decision_cols].to_string(index=False, max_colwidth=36))
print(f"\n  Resumo decisões: {summary_decisao}")
print(f"  + REJEITAR: AG-017 catalog-wide (ROI -67%, contraprova)")

# ─────────────────────────────────────────────────────────────────────────────
# CELL 9: Export JSON
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 9] Export JSON…")
results = {
    'notebook': 'NB-14 NPV Layer — Cost-Benefit das 25 prescrições',
    'computed_at': pd.Timestamp.today().strftime('%Y-%m-%d'),
    'params': {'r': R, 'horizon': H, 'annuity_factor': round(ANNUITY, 6),
               'discount_note': 'NTN-B 10y (~11%) + 200bps spread soberano = 13% nominal'},
    'n_actions': len(ACTIONS),
    'actions': df.to_dict(orient='records'),
    'portfolio': {
        'npv_total_rsm': round(portfolio_npv, 1),
        'npv_base_rsm': round(portfolio_npv_base, 1),
        'capex_total_rsm': round(total_capex, 1),
        'cost_3y_total_rsm': round(total_cost3y, 1),
        'n_npv_positive': int((df['npv'] > 0).sum()),
        'n_npv_negative': int((df['npv'] <= 0).sum()),
    },
    'counterfactual': counterfactual,
    'stress_events': stress_events,
    'roi_headline': roi_headline,
    'tornado': {'base_npv_rsm': round(base_np, 1), 'drivers': [
        {'driver': t['driver'], 'low': round(t['low'], 1), 'high': round(t['high'], 1),
         'swing': round(t['swing'], 1)} for t in tornado]},
    'ranking': ranked[['rank', 'ag', 'name', 'dim', 'npv', 'roi_pct', 'cost_3y']].to_dict(orient='records'),
    'decision_matrix': decision_matrix,
    'decision_summary': summary_decisao,
    'outputs': {
        'tornado_png': 'nb14_tornado.png', 'tornado_html': 'nb14_tornado.html',
        'ranking_png': 'nb14_ranking.png', 'ranking_html': 'nb14_ranking.html',
    },
}
out_path = os.path.join(OUTPUT_DIR, 'nb14_results.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print('  Saved:', out_path)

print("\n==============================================================")
print("  NB-14 COMPLETO — NPV LAYER")
print(f"  25 ações | NPV portfólio R$ {portfolio_npv:,.0f}M | capex R$ {total_capex:,.0f}M")
print(f"  Framework R$ 3M → R$ 200M+/ano evitado → ROI {roi_3y_x:.0f}x (3y) | payback {payback_meses:.2f} mês")
print(f"  Top-1 NPV: {ranked.iloc[0]['ag']} {ranked.iloc[0]['name']} (R$ {ranked.iloc[0]['npv']:,.0f}M)")
print(f"  Sem framework: VaR 4-shock R$ 8,21 bi | CVaR R$ 10,14 bi")
print("==============================================================")
sys.exit(0)
