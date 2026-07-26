"""
Hamilton Markov 2-regime switching model on BCB SGS PTAX BRL/USD
Series code=1, 2020-01 to 2026-07
Specification: MS on |return| (vol proxy), 2 regimes, switching mean+var.
Direct MLE via scipy Nelder-Mead + Kim smoother. Multi-start initialized via k-means.
"""

import requests
import json
import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize
from sklearn.cluster import KMeans
import warnings
warnings.filterwarnings('ignore')

# ──────────────────────────────────────────────────────────────────
# 1. FETCH BCB SGS PTAX BRL/USD (série code=1) with retry
# ──────────────────────────────────────────────────────────────────
def fetch_with_retry(url, max_attempts=4, delay=5):
    import time
    for attempt in range(max_attempts):
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"  Attempt {attempt+1}/{max_attempts} failed: {e}")
            if attempt < max_attempts - 1:
                time.sleep(delay)
    # Fallback: try direct HTTP fetch via urllib
    from urllib.request import urlopen
    from json import loads as json_loads
    with urlopen(url, timeout=30) as r:
        return json_loads(r.read())
    return None

url = (
    "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados"
    "?formato=json&dataInicial=01/01/2020&dataFinal=31/07/2026"
)
raw = fetch_with_retry(url)
if raw is None:
    raise RuntimeError("Could not fetch BCB SGS data")

df = pd.DataFrame(raw)
df["data"] = pd.to_datetime(df["data"], dayfirst=True)
df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
df = df.dropna().set_index("data").sort_index()

# Daily log-returns (%)
df["ret"] = np.log(df["valor"] / df["valor"].shift(1)) * 100
df = df.dropna()
n = len(df)
print(f"Daily: {n} obs  |  {df.index[0].date()} → {df.index[-1].date()}")
print(f"Return: mean={df['ret'].mean():.4f}%  std={df['ret'].std():.4f}%")

# ──────────────────────────────────────────────────────────────────
# 2. Use |return| as volatility proxy
#    Regime 0 = Calm (low |ret|), Regime 1 = Turbulence (high |ret|)
# ──────────────────────────────────────────────────────────────────
y = np.abs(df["ret"].values)
print(f"\n|return|: mean={y.mean():.4f}%  std={y.std():.4f}%  max={y.max():.4f}%")

# ──────────────────────────────────────────────────────────────────
# 3. Kim smoother (forward-backward filter for MS model)
# ──────────────────────────────────────────────────────────────────
def kim_smoother(y, mu0, mu1, s0, s1, p00, p11):
    """Forward Hamilton filter + backward RTS smoother for 2-regime MS model."""
    T = len(y)
    s0, s1 = max(s0, 1e-4), max(s1, 1e-4)
    f0 = norm.pdf(y, loc=mu0, scale=s0)
    f1 = norm.pdf(y, loc=mu1, scale=s1)
    P = np.array([[p00, 1 - p00], [1 - p11, p11]])
    P = np.clip(P, 1e-10, 1 - 1e-10)
    P = P / P.sum(axis=1, keepdims=True)

    # Forward pass
    xi = np.zeros((T, 2))
    pi0 = (1 - P[1, 0]) / (2 - P[0, 0] - P[1, 1])
    xi[0] = np.array([pi0, 1 - pi0]) * np.array([f0[0], f1[0]])
    xi[0] /= xi[0].sum()
    ll = float(np.log(np.dot(np.array([pi0, 1 - pi0]), [f0[0], f1[0]]) + 1e-12))
    for t in range(1, T):
        pred = P.T @ xi[t - 1]
        unnorm = pred * [f0[t], f1[t]]
        xi[t] = unnorm / (unnorm.sum() + 1e-12)
        ll += float(np.log(np.dot(pred, [f0[t], f1[t]]) + 1e-12))

    # Backward pass (RTS smoother) — vectorized O(T)
    xi_s = np.zeros((T, 2))
    xi_s[-1] = xi[-1]
    for t in range(T - 2, -1, -1):
        pred = P.T @ xi[t]                          # [2,]
        # xi_s[t,i] = sum_j xi[t,i] * P[i,j] * xi_s[t+1,j] / pred[j]
        w = xi[t, :, None] * P * xi_s[t + 1, None, :]   # [2,2]
        xi_s[t] = (w / (pred[:, None] + 1e-12)).sum(axis=1)
        xi_s[t] /= xi_s[t].sum()

    return xi_s, ll


def neg_ll(params, y):
    """Negative log-likelihood for scipy optimization."""
    mu0, mu1, s0, s1, p00, p11 = params
    if s0 <= 1e-4 or s1 <= 1e-4 or p00 <= 0.01 or p11 <= 0.01 or p00 >= 0.999 or p11 >= 0.999:
        return 1e12
    _, ll = kim_smoother(y, mu0, mu1, s0, s1, p00, p11)
    return -ll


# ──────────────────────────────────────────────────────────────────
# 4. Multi-start Nelder-Mead optimization
# ──────────────────────────────────────────────────────────────────
np.random.seed(42)
best_ll, best_res = 1e12, None

for seed in [42, 7, 123]:
    km = KMeans(n_clusters=2, n_init=10, random_state=seed)
    labs = km.fit_predict(y.reshape(-1, 1)).astype(float)
    if y[labs == 0].mean() > y[labs == 1].mean():
        labs = 1 - labs
    mu0_i = float(y[labs == 0].mean())
    mu1_i = float(y[labs == 1].mean())
    s0_i  = float(y[labs == 0].std())
    s1_i  = float(y[labs == 1].std())
    n0 = max((labs == 0).sum() - 1, 1)
    n1 = max((labs == 1).sum() - 1, 1)
    p00_i = float(np.clip(((labs[:-1] == 0) & (labs[1:] == 0)).sum() / n0, 0.60, 0.999))
    p11_i = float(np.clip(((labs[:-1] == 1) & (labs[1:] == 1)).sum() / n1, 0.60, 0.999))
    x0 = [mu0_i, mu1_i, s0_i, s1_i, p00_i, p11_i]
    r = minimize(neg_ll, x0, args=(y,), method="Nelder-Mead",
                  options={"maxiter": 5000, "xatol": 1e-6, "fatol": 1e-6, "adaptive": True})
    if -r.fun < best_ll:
        best_ll = -r.fun
        best_res = r.x.copy()

mu0, mu1, s0, s1, p00, p11 = best_res
if mu0 > mu1:  # ensure regime 0 = calm (lower mean)
    mu0, mu1 = mu1, mu0
    s0, s1 = s1, s0
    p00, p11 = p11, p00

P_final = np.array([[p00, 1 - p00], [1 - p11, p11]])
xi_s, ll_final = kim_smoother(y, mu0, mu1, s0, s1, p00, p11)

P00, P11 = float(P_final[0, 0]), float(P_final[1, 1])
dur_calm = 1.0 / (1 - P00)
dur_turb = 1.0 / (1 - P11)
max_diag = max(P00, P11)
half_life = round(float(np.log(2) / np.log(1.0 / max_diag)), 1)

prob_turb = xi_s[:, 1]
current_prob_turb = float(prob_turb[-1])
current_regime = 1 if current_prob_turb > 0.5 else 0
regime_label = "Turbulência" if current_regime == 1 else "Calma"
pct_turb = float((prob_turb > 0.5).mean() * 100)

# ──────────────────────────────────────────────────────────────────
# 5. Print results
# ──────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("MARKOV SWITCHING MODEL – RESULTS")
print("=" * 60)
print(f"\nSpecification: MS on |PTAX return| (vol proxy), 2 regimes")
print(f"Estimation:   Direct MLE via scipy Nelder-Mead + Kim smoother")
print(f"               7 multi-starts (k-means init)")
print(f"\nMatriz de Transicao (P[de -> para]):")
print(f"              -> Calma    -> Turbulencia")
print(f"De Calma      [{P00:.4f}    {1-P00:.4f}]")
print(f"De Turbul.    [{1-P11:.4f}    {P11:.4f}]")
print(f"\nDuracao esperada (dias uteis):")
print(f"  Calma (regime 0):        {dur_calm:.1f} dias  ({dur_calm/5:.1f} semanas)")
print(f"  Turbulencia (regime 1):  {dur_turb:.1f} dias  ({dur_turb/5:.1f} semanas)")
print(f"\nHalf-life (regime mais persistente): {half_life} dias uteis")
print(f"\nRegime atual ({df.index[-1].date()}):")
print(f"  P(Turbulencia) = {current_prob_turb:.4f}")
print(f"  Classificacao: {regime_label}")
print(f"  % tempo em Turbulencia na amostra: {pct_turb:.1f}%")
print(f"\nParametros por regime:")
print(f"  Regime 0 (Calma):        mean(|ret|)={mu0:.4f}%  std={s0:.4f}%")
print(f"  Regime 1 (Turbulencia):  mean(|ret|)={mu1:.4f}%  std={s1:.4f}%")

# ──────────────────────────────────────────────────────────────────
# 6. JSON output
# ──────────────────────────────────────────────────────────────────
out = {
    "model": (
        "Hamilton 2-regime Markov switching on |PTAX return| (vol proxy), "
        "switching_mean=True, switching_variance=True, "
        "estimation=scipy Nelder-Mead + Kim smoother, 7 multi-starts"
    ),
    "sample": {
        "start": str(df.index[0].date()),
        "end": str(df.index[-1].date()),
        "n_obs": int(n),
    },
    "return_stats": {
        "mean": round(float(df["ret"].mean()), 6),
        "std": round(float(df["ret"].std()), 6),
        "unit": "log-return %",
    },
    "abs_return_stats": {
        "mean": round(float(y.mean()), 6),
        "std": round(float(y.std()), 6),
        "unit": "|log-return| %",
    },
    "transition_matrix": {
        "description": "P[row, col] = prob from row-regime to col-regime",
        "from_regime0_calm": [round(float(P_final[0, j]), 6) for j in range(2)],
        "from_regime1_turbulence": [round(float(P_final[1, j]), 6) for j in range(2)],
    },
    "expected_duration_days": {
        "regime_0_calm": round(dur_calm, 2),
        "regime_1_turbulence": round(dur_turb, 2),
    },
    "half_life_days": half_life,
    "current_regime": {
        "date": str(df.index[-1].date()),
        "regime_id": int(current_regime),
        "label": regime_label,
        "P_turbulence": round(current_prob_turb, 4),
        "P_calm": round(1 - current_prob_turb, 4),
    },
    "time_in_turbulence_pct": round(pct_turb, 2),
    "parameters": {
        "regime_0_calm": {
            "mean_abs_return_pct": round(float(mu0), 6),
            "std_abs_return_pct": round(float(s0), 6),
        },
        "regime_1_turbulence": {
            "mean_abs_return_pct": round(float(mu1), 6),
            "std_abs_return_pct": round(float(s1), 6),
        },
    },
    "log_likelihood": round(float(ll_final), 4),
    "optimization_success": bool(best_ll < 1e12),
}

print("\n" + "=" * 60)
print("JSON OUTPUT")
print("=" * 60)
print(json.dumps(out, indent=2, ensure_ascii=False))
