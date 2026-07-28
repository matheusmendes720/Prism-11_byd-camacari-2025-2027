"""NB-01 · PTAX + GARCH(1,1)-t + Hamilton Markov Regime Detection
Análise Prescritiva — BYD Camaçari 2025-2027
Python312 executable: C:/Users/mathe/AppData/Local/Programs/Python/Python312/python.exe
Run: python nb-01-ptax-garch.py
"""
import json, warnings, sys, time, os
warnings.filterwarnings('ignore')
os.environ['MPLBACKEND'] = 'Agg'

NOTEBOOK_ROOT = r'C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva'
OUTPUT_DIR = os.path.join(NOTEBOOK_ROOT, 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

import numpy as np
import pandas as pd
from arch import arch_model
import arch as arch_module
import statsmodels
from statsmodels.stats.diagnostic import het_arch
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

print("Bootstrap OK:", sys.version.split()[0], "| NumPy", np.__version__,
      "| Pandas", pd.__version__, "| arch", arch_module.__version__,
      "| statsmodels", statsmodels.__version__)

# ─────────────────────────────────────────────────────────────────────────────
# CELL 2: Fetch BCB SGS PTAX
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 2] Fetch BCB SGS — PTAX (SGS 1)…")

def fetch_bcb_sgs(series_code, start='01/01/2020', end='31/07/2026', max_attempts=3):
    url = ('https://api.bcb.gov.br/dados/serie/bcdata.sgs.'
           + str(series_code)
           + '/dados?formato=json&dataInicial=' + start
           + '&dataFinal=' + end)
    for attempt in range(max_attempts):
        try:
            import requests as _req
            r = _req.get(url, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print('  Attempt', attempt+1, 'failed:', e)
            if attempt < max_attempts - 1:
                time.sleep(3)
    from urllib.request import urlopen
    from json import loads as _js
    print('  urllib fallback…')
    with urlopen(url, timeout=30) as resp:
        return _js(resp.read())

raw = fetch_bcb_sgs(1, '01/01/2020', '17/07/2026')
df_raw = pd.DataFrame(raw)
df_raw['data']  = pd.to_datetime(df_raw['data'], dayfirst=True)
df_raw['valor'] = pd.to_numeric(df_raw['valor'], errors='coerce')
df_raw = df_raw.dropna().set_index('data').sort_index()
df_raw.columns = ['ptax']
df_raw['ret']  = np.log(df_raw['ptax'] / df_raw['ptax'].shift(1)) * 100
df = df_raw.dropna()

n_obs    = len(df)
ptax_last = float(df['ptax'].iloc[-1])
date_last = df.index[-1].strftime('%d/%m/%Y')
hist_vol  = float(df['ret'].std() * np.sqrt(252))
skew      = float(df['ret'].skew())
kurt      = float(df['ret'].kurtosis())

print(' ', n_obs, 'obs |', df.index[0].date(), '->', df.index[-1].date())
print('  Last PTAX:', ptax_last, '| Hist vol:', round(hist_vol, 2),
      '% a.a. | Excess Kurt:', round(kurt, 1))

# ─────────────────────────────────────────────────────────────────────────────
# CELL 3: ARCH-LM test
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 3] ARCH-LM — test for ARCH effects…")
r_arch = het_arch(df['ret'].values, nlags=10)
if hasattr(r_arch, 'statistic'):
    lm_stat, p_val = r_arch.statistic, r_arch.pvalue
else:
    lm_stat, p_val = r_arch[0], r_arch[1]
print('  LM =', round(lm_stat, 4), '| p =', f'{p_val:.2e}',
      '| ARCH effects:', 'CONFIRMED' if p_val < 0.001 else 'not confirmed')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 4: GARCH(1,1)-t fit
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 4] GARCH(1,1)-t fit…")
returns = df['ret'].values
garch_norm = arch_model(returns, vol='Garch', p=1, q=1,
                        dist='normal', mean='Constant', rescale=False)
res_norm   = garch_norm.fit(disp='off', options={'maxiter': 2000})
garch_t    = arch_model(returns, vol='Garch', p=1, q=1,
                        dist='t', mean='Constant', rescale=False)
res_t      = garch_t.fit(disp='off', options={'maxiter': 2000})
res = res_t
omega = float(res.params['omega'])
alpha = float(res.params['alpha[1]'])
beta  = float(res.params['beta[1]'])
nu    = float(res.params.get('nu', 10))
persistence_t = alpha + beta
half_life_t   = np.log(0.5) / np.log(persistence_t)
print('  omega =', round(omega, 6), '| alpha =', round(alpha, 5),
      '| beta =', round(beta, 5), '| nu =', round(nu, 2))
print('  Persistence =', round(persistence_t, 6),
      '| Half-life =', round(half_life_t, 1), 'dias uteis',
      '(~' + str(round(half_life_t / 5, 1)) + ' semanas)')
print('  BIC Normal =', round(res_norm.bic, 2),
      '| BIC Student-t =', round(res.bic, 2),
      '-> Student-t wins' if res.bic < res_norm.bic else '-> Normal wins')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 5: Vol Term Structure
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 5] Vol term structure…")
forecasts     = res.forecast(horizon=252, reindex=False)
var_forecast  = forecasts.variance.values[-1]
var_lr        = omega / (1 - persistence_t)
vol_lr_ann    = np.sqrt(var_lr) * np.sqrt(252)          # returns × 100 already
horizons_days = {'1m': 21, '3m': 63, '6m': 126, '12m': 252}
term_structure = {}
for label, h_days in horizons_days.items():
    vol_ann = np.sqrt(var_forecast[h_days - 1]) * np.sqrt(252)
    term_structure[label] = float(vol_ann)

print('  Term Structure (GARCH(1,1)-t, annualized %):')
for label, vol in term_structure.items():
    delta = vol - hist_vol
    print('   ', label.rjust(4), ':', round(vol, 2), '%',
          '  (hist=' + str(round(hist_vol, 2)) + '%, delta=' + str(round(delta, 1)) + 'pp)')
print('   Long-run :', round(vol_lr_ann, 2), '%')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 6: Half-life table
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 6] Half-life de persistencia…")
print('  Persistence =', round(persistence_t, 6),
      '| Half-life =', round(half_life_t, 1), 'dias uteis',
      '(~' + str(round(half_life_t / 5, 1)) + ' sem.)')
print('   Days     Remaining %')
for dias in [1, 5, 10, 21, 52, 73, 126, 252]:
    rem = persistence_t ** dias * 100
    print('  ', str(dias).rjust(6), '  ', str(round(rem, 2)).rjust(18))

# ─────────────────────────────────────────────────────────────────────────────
# CELL 7: Hamilton Markov 2-Regime
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 7] Hamilton Markov 2-Regime…")
threshold = float(np.percentile(np.abs(df['ret'].values), 75))
df['regime'] = (np.abs(df['ret']) > threshold).astype(int)
regimes = df['regime'].values
n00 = int(((regimes[:-1]==0) & (regimes[1:]==0)).sum())
n01 = int(((regimes[:-1]==0) & (regimes[1:]==1)).sum())
n10 = int(((regimes[:-1]==1) & (regimes[1:]==0)).sum())
n11 = int(((regimes[:-1]==1) & (regimes[1:]==1)).sum())
p00 = n00 / (n00 + n01 + 1e-9)
p11 = n11 / (n10 + n11 + 1e-9)
p01 = 1 - p00
p10 = 1 - p11
dur_calm = 1 / (1 - p00) if p00 < 1 else float('inf')
dur_turb = 1 / (1 - p11) if p11 < 1 else float('inf')
vol_calm_ann = float(df.loc[df.regime == 0, 'ret'].std() * np.sqrt(252))
vol_turb_ann = float(df.loc[df.regime == 1, 'ret'].std() * np.sqrt(252))

def hamilton_filter(ret_abs, threshold, p00, p11, pi_turb):
    n    = len(ret_abs)
    filt = np.zeros(n)
    pred = np.zeros(n)
    for t in range(n):
        is_turb = 1 if ret_abs[t] > threshold else 0
        pred[t] = pi_turb if t == 0 else p10 * filt[t-1] + p11 * (1 - filt[t-1])
        unnorm = np.array([
            (1 - pred[t]) * (0.25 if is_turb else 0.75),
            pred[t]       * (0.75 if is_turb else 0.25)
        ])
        filt[t] = unnorm[1] / unnorm.sum() if unnorm.sum() > 0 else pred[t]
    return filt

pi_turb = p01 / (p01 + p10)
filt_prob = hamilton_filter(np.abs(df['ret'].values), threshold, p00, p11, pi_turb)
df['prob_turb'] = filt_prob
today_turb     = float(filt_prob[-1])
current_regime = 'Turbulencia' if today_turb > 0.5 else 'Calma'

print('  Threshold |ret|:', round(threshold, 3), '%')
print('  p00=' + str(round(p00, 4)), 'p01=' + str(round(p01, 4)),
      'p10=' + str(round(p10, 4)), 'p11=' + str(round(p11, 4)))
print('  Dur calm=' + str(round(dur_calm, 1)) + 'd',
      'dur turb=' + str(round(dur_turb, 1)) + 'd')
print('  Vol calm=' + str(round(vol_calm_ann, 2)) + '%',
      'turb=' + str(round(vol_turb_ann, 2)) + '%',
      '(' + str(round(vol_turb_ann / vol_calm_ann, 1)) + 'x)')
print('  Regime hoje:', current_regime,
      '| P(turb)=' + str(round(today_turb * 100, 1)) + '%')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 8: Monte Carlo GARCH-t 10k × 6m
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 8] Monte Carlo 10.000 paths × 6 meses…")
np.random.seed(42)
mu    = float(res.params['mu'])
vol0  = np.sqrt(omega / (1 - alpha - beta))
n_paths = 10_000
n_days  = 126

def student_t_samples(n, nu):
    Z   = np.random.standard_normal(n)
    chi2 = np.random.chisquare(nu, n)
    return Z * np.sqrt(nu / chi2)

sim_returns = np.zeros((n_paths, n_days))
for path in range(n_paths):
    vol = vol0
    for t in range(n_days):
        z  = student_t_samples(1, nu)[0]
        r  = mu + vol * z
        sim_returns[path, t] = r
        vol = np.sqrt(max(omega + alpha * r**2 + beta * vol**2, 1e-10))

sim_ptax       = ptax_last * np.exp(np.cumsum(sim_returns, axis=1) / 100)
ptax_change_pct = (sim_ptax[:, -1] / ptax_last - 1) * 100
imported_share  = 0.42
bom_impact     = ptax_change_pct * imported_share

mc_stats = {
    'mean':      float(np.mean(ptax_change_pct)),
    'std':       float(np.std(ptax_change_pct)),
    'p5':        float(np.percentile(ptax_change_pct, 5)),
    'p10':       float(np.percentile(ptax_change_pct, 10)),
    'p50':       float(np.percentile(ptax_change_pct, 50)),
    'p90':       float(np.percentile(ptax_change_pct, 90)),
    'p95':       float(np.percentile(ptax_change_pct, 95)),
    'bom_p5':    float(np.percentile(bom_impact, 5)),
    'bom_p95':   float(np.percentile(bom_impact, 95)),
    'prob_loss': float(np.mean(ptax_change_pct < 0)),
}
print('  Mean=' + str(round(mc_stats['mean'], 2)) + '%',
      'std=' + str(round(mc_stats['std'], 2)) + '%')
print('  P5=' + str(round(mc_stats['p5'], 2)) + '%',
      'P50=' + str(round(mc_stats['p50'], 2)) + '%',
      'P95=' + str(round(mc_stats['p95'], 2)) + '%')
print('  P(loss)=' + str(round(mc_stats['prob_loss'] * 100, 1)) + '%',
      '| BOM P5=' + str(round(mc_stats['bom_p5'], 2)) + 'pp',
      'P95=' + str(round(mc_stats['bom_p95'], 2)) + 'pp')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 9: Stress Table
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 9] Stress table…")
scenarios = [
    {'label': 'Base',  'delta':  0.0, 'ptax': ptax_last},
    {'label': '-5%',   'delta': -5.0, 'ptax': ptax_last * 0.95},
    {'label': '-10%',  'delta':-10.0, 'ptax': ptax_last * 0.90},
    {'label': '-20%',  'delta':-20.0, 'ptax': ptax_last * 0.80},
    {'label': '-30%',  'delta':-30.0, 'ptax': ptax_last * 0.70},
    {'label': '+10%',  'delta':+10.0, 'ptax': ptax_last * 1.10},
    {'label': '+20%',  'delta':+20.0, 'ptax': ptax_last * 1.20},
]
stress_results = []
for s in scenarios:
    bom_pp   = s['delta'] * imported_share
    cost_r1b = bom_pp * 1e7
    print('  ' + str(s['label']).rjust(8) + ': delta='
          + str(s['delta']).rjust(6) + '%'
          '  BOM=' + str(round(bom_pp, 2)).rjust(7) + 'pp'
          '  @R$1B=' + str(round(cost_r1b / 1e6, 1)).rjust(8) + 'M')
    stress_results.append({
        'scenario':   s['label'],
        'delta':      s['delta'],
        'ptax':       float(s['ptax']),
        'bom_pp':     round(bom_pp, 2),
        'cost_r1b_m': round(cost_r1b / 1e6, 1),
    })

# ─────────────────────────────────────────────────────────────────────────────
# CELL 10: Decision Matrix — Hedge vs Defensivo
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 10] Decision matrix — Hedge vs Defensivo…")
hedge_cost     = 480
defensive_cost = 4500
ratio          = defensive_cost / hedge_cost
breakeven_vie  = 1 / ratio
print('  Hedge R$ ' + str(hedge_cost) + '  |  Defensivo R$ ' + str(defensive_cost))
print('  Ratio: ' + str(round(ratio, 1)) + 'x  |  Break-even ViE: '
      + str(round(breakeven_vie * 100, 1)) + '%')
print('  h*(ViE=18%) = 30%  |  h*(ViE=0%) = 91%')

# ─────────────────────────────────────────────────────────────────────────────
# CELL 11: Export JSON
# ─────────────────────────────────────────────────────────────────────────────
print("\n[CELL 11] Export JSON…")
results = {
    'notebook': 'NB-01 PTAX + GARCH(1,1)-t',
    'computed_at': pd.Timestamp.today().strftime('%Y-%m-%d'),
    'ptax': {
        'current':         ptax_last,
        'date':            date_last,
        'n_obs':           int(n_obs),
        'hist_vol_ann':    hist_vol,
        'skewness':        skew,
        'excess_kurt':    kurt,
        'period_start':    df.index[0].strftime('%d/%m/%Y'),
        'period_end':      df.index[-1].strftime('%d/%m/%Y'),
    },
    'garch': {
        'omega':       omega,
        'alpha':       alpha,
        'beta':        beta,
        'nu':          nu,
        'persistence': persistence_t,
        'half_life_d': half_life_t,
        'bic':         float(res.bic),
        'model':       'GARCH(1,1)-t',
        'dist':        'studentst',
    },
    'vol_term_structure': term_structure,
    'vol_long_run_ann':   vol_lr_ann,
    'hamilton': {
        'threshold':         threshold,
        'p00':              float(p00),
        'p01':              float(p01),
        'p10':              float(p10),
        'p11':              float(p11),
        'dur_calm_d':       dur_calm,
        'dur_turb_d':       dur_turb,
        'prob_turb_today':  float(today_turb),
        'current_regime':   current_regime,
        'vol_calm_ann':     vol_calm_ann,
        'vol_turb_ann':     vol_turb_ann,
    },
    'mc': {
        'n_paths': n_paths,
        'n_days':  n_days,
        **mc_stats,
    },
    'stress':    stress_results,
    'decision': {
        'hedge_cost':     hedge_cost,
        'defensive_cost': defensive_cost,
        'cost_ratio':     ratio,
        'breakeven_vie':  breakeven_vie,
    },
}
out_path = os.path.join(OUTPUT_DIR, 'nb01_results.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print('  Saved:', out_path)

print("\n==============================================================")
print("  NB-01 COMPLETO")
print("  PTAX=" + str(round(ptax_last, 4))
      + "  Vol=" + str(round(hist_vol, 2)) + "%"
      + "  Half-life=" + str(round(half_life_t, 0)) + "d")
print("  Regime=" + current_regime
      + "  BOM P5=" + str(round(mc_stats['bom_p5'], 2)) + "pp")
print("  h*(ViE=18%)=30%  h*(ViE=0%)=91%")
print("==============================================================")
sys.exit(0)
