"""
Hamilton Markov 2-regime switching — FAST version
Uses Hamilton filter directly (no backward smoother) for speed.
Regime 0 = Calm (low |return|), Regime 1 = Turbulence (high |return|).
Transitions estimated via regime transition counts.
"""
import json
import numpy as np
import pandas as pd
import urllib.request
from scipy.stats import norm

# ── 1. Fetch PTAX ──────────────────────────────────────────────
url = ("https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados"
       "?formato=json&dataInicial=01/01/2020&dataFinal=31/07/2026")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=20) as resp:
    raw = json.loads(resp.read().decode())

df = pd.DataFrame(raw)
df['data'] = pd.to_datetime(df['data'], dayfirst=True)
df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
df = df.dropna().set_index('data').sort_index()

# Daily log-returns (%)
df['ret'] = np.log(df['valor'] / df['valor'].shift(1)) * 100
df = df.dropna()
n = len(df)
print(f"Daily obs: {n}  |  {df.index[0].date()} → {df.index[-1].date()}")
print(f"Return: mean={df['ret'].mean():.4f}%  std={df['ret'].std():.4f}%")

y = np.abs(df['ret'].values)

# ── 2. Classify regimes using 75th percentile threshold ────────
# Simple threshold: above 75th percentile = turbulence
threshold = np.percentile(y, 75)
print(f"\n|return| threshold (75th pct): {threshold:.4f}%")

# Assign hard regime labels
regime_hard = (y > threshold).astype(int)
pct_turb = float(regime_hard.mean() * 100)
print(f"% time in turbulence: {pct_turb:.1f}%")

# ── 3. Estimate transition matrix from hard labels ───────────────
def estimate_P(regimes):
    """MLE transition matrix from regime sequence."""
    P = np.zeros((2, 2))
    for i in range(2):
        for j in range(2):
            mask = (regimes[:-1] == i) & (regimes[1:] == j)
            P[i, j] = mask.sum() / max((regimes[:-1] == i).sum(), 1)
    return P

P_est = estimate_P(regime_hard)
P00, P11 = P_est[0, 0], P_est[1, 1]
P01 = 1 - P00
P10 = 1 - P11

dur_calm = 1.0 / max(P01, 1e-6)
dur_turb = 1.0 / max(P10, 1e-6)
max_diag = max(P00, P11)
half_life = round(float(np.log(2) / np.log(1.0 / max_diag)), 1)

print(f"\nEstimated transition matrix (hard-threshold classification):")
print(f"              -> Calma    -> Turbulencia")
print(f"De Calma      [{P00:.4f}    {P01:.4f}]")
print(f"De Turbul.    [{P10:.4f}    {P11:.4f}]")
print(f"\nDuracao esperada (dias uteis):")
print(f"  Calma:        {dur_calm:.1f} dias ({dur_calm/5:.1f} semanas)")
print(f"  Turbulencia:  {dur_turb:.1f} dias ({dur_turb/5:.1f} semanas)")
print(f"  Half-life:    {half_life} dias uteis")

# ── 4. Hamilton filter for smooth regime probabilities ───────────
# Estimate regime parameters from hard labels
y0 = y[regime_hard == 0]; y1 = y[regime_hard == 1]
mu0 = float(y0.mean()); s0 = float(y0.std())
mu1 = float(y1.mean()); s1 = float(y1.std())
print(f"\nRegime params (from hard labels):")
print(f"  Regime 0 (Calma):        mean(|ret|)={mu0:.4f}%  std={s0:.4f}%")
print(f"  Regime 1 (Turbulencia):  mean(|ret|)={mu1:.4f}%  std={s1:.4f}%")

# Hamilton filter with estimated P and params
T = len(y)
xi = np.zeros((T, 2))
pi0 = 0.5  # prior
f0 = norm.pdf(y, loc=mu0, scale=max(s0, 1e-4))
f1 = norm.pdf(y, loc=mu1, scale=max(s1, 1e-4))
P = np.array([[P00, P01], [P10, P11]])

xi[0] = np.array([pi0, 1 - pi0]) * np.array([f0[0], f1[0]])
xi[0] /= xi[0].sum()
for t in range(1, T):
    pred = P.T @ xi[t - 1]
    unnorm = pred * [f0[t], f1[t]]
    xi[t] = unnorm / (unnorm.sum() + 1e-12)

# Current regime
current_prob_turb = float(xi[-1, 1])
current_regime = 1 if current_prob_turb > 0.5 else 0
regime_label = "Turbulencia" if current_regime == 1 else "Calma"
pct_turb_smooth = float((xi[:, 1] > 0.5).mean() * 100)

print(f"\nHamilton filter result:")
print(f"  Date: {df.index[-1].date()}")
print(f"  P(Turbulencia) = {current_prob_turb:.4f}")
print(f"  Classification: {regime_label}")

# ── 5. Regime-specific vol estimates ──────────────────────────────
# Map smooth probs to daily vol
regime_indicator = xi[:, 1]  # P(turbulence)
# Expected vol: E[sigma] = P(calm)*sigma_calm + P(turb)*sigma_turb
sigma_calm_daily = s0 / 100 * np.sqrt(1/252)  # annualised back
sigma_turb_daily = s1 / 100 * np.sqrt(1/252)
# Actually simpler: regime volatility proxy is |ret| itself
# Expected daily vol proxy = xi[:,0]*y0_mean + xi[:,1]*y1_mean... no, just |ret|
expected_abs_ret = xi[:, 0] * mu0 + xi[:, 1] * mu1

print(f"\nRegime-specific annualized vol (|ret| proxy):")
print(f"  E[|ret|_annualised | calm]:     {mu0 * np.sqrt(252):.2f}%")
print(f"  E[|ret|_annualised | turbul]:   {mu1 * np.sqrt(252):.2f}%")
print(f"  Current weighted expected vol:   {expected_abs_ret[-1] * np.sqrt(252):.2f}%")

# ── 6. JSON output ───────────────────────────────────────────────
out = {
    "model": (
        "Hamilton 2-regime Markov switching on |PTAX return| (vol proxy), "
        "threshold-based classification, Hamilton filter, "
        "transition matrix from regime counts"
    ),
    "sample": {
        "start": str(df.index[0].date()),
        "end": str(df.index[-1].date()),
        "n_obs": int(n),
    },
    "return_stats": {
        "mean": round(float(df['ret'].mean()), 6),
        "std": round(float(df['ret'].std()), 6),
        "unit": "log-return %",
    },
    "abs_return_stats": {
        "mean": round(float(y.mean()), 6),
        "std": round(float(y.std()), 6),
        "unit": "|log-return| %",
    },
    "threshold_pct": round(float(threshold), 4),
    "transition_matrix": {
        "description": "P[row, col] = prob from row-regime to col-regime",
        "from_regime0_calm": [round(float(P_est[0, j]), 4) for j in range(2)],
        "from_regime1_turbulence": [round(float(P_est[1, j]), 4) for j in range(2)],
    },
    "expected_duration_days": {
        "regime_0_calm": round(float(dur_calm), 2),
        "regime_1_turbulence": round(float(dur_turb), 2),
    },
    "half_life_days": half_life,
    "current_regime": {
        "date": str(df.index[-1].date()),
        "regime_id": int(current_regime),
        "label": regime_label,
        "P_turbulence": round(float(current_prob_turb), 4),
        "P_calm": round(float(1 - current_prob_turb), 4),
    },
    "time_in_turbulence_pct": round(float(pct_turb), 2),
    "time_in_turbulence_smooth_pct": round(float(pct_turb_smooth), 2),
    "parameters": {
        "regime_0_calm": {
            "mean_abs_return_pct": round(float(mu0), 4),
            "std_abs_return_pct": round(float(s0), 4),
            "annualised_vol_pct": round(float(mu0 * np.sqrt(252)), 2),
        },
        "regime_1_turbulence": {
            "mean_abs_return_pct": round(float(mu1), 4),
            "std_abs_return_pct": round(float(s1), 4),
            "annualised_vol_pct": round(float(mu1 * np.sqrt(252)), 2),
        },
    },
    "regime_vol_annualised_pct": {
        "current_weighted": round(float(expected_abs_ret[-1] * np.sqrt(252)), 2),
    },
}

print("\n" + "=" * 60)
print("JSON OUTPUT")
print("=" * 60)
print(json.dumps(out, indent=2, ensure_ascii=False))
