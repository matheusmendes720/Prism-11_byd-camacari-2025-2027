"""
NB-06: Simulação Monte Carlo Multivariada — BYD Camacari 2025–2027
=================================================================
Análise de risco com 4 choques simultâneos:
  1. PTAX/FX (R$/US$)        — correlação com Lithium e Demand
  2. Preço do Lítio          — correlação com FX
  3. Tarifa de Importação    — binária (35% por Jan/2027)
  4. Demanda EV (market share)— correlação com FX

Gerencia: outputs/nb06_results.json
Autor:   Equipe Value Factory
"""

import json
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────
# 0. CONFIGURAÇÕES E CONSTANTES
# ─────────────────────────────────────────────
np.random.seed(42)
N_PATHS    = 10_000
N_DAYS     = 126          # ~6 meses úteis
OUTPUT_DIR = "outputs"

# Matriz de correlação (FX, Lithium, Tariff, Demand)
CORR_MATRIX = np.array([
    [1.00, 0.45, 0.10, 0.30],
    [0.45, 1.00, 0.05, 0.25],
    [0.10, 0.05, 1.00, 0.15],
    [0.30, 0.25, 0.15, 1.00]
], dtype=float)

SHOCK_NAMES = ["PTAX/FX", "Lítio", "Tarifa", "Demanda"]

# Desvio-padrão anualizado → desvio para 6 meses (126 dias)
STD_ANN = {
    "PTAX/FX": 0.1417,   # 14.17% a.a.
    "Lítio":   0.829,    # 82.9% a.a.
    "Demanda": 0.05       # 5% crescimento incerto
}
# Para 126 dias: std_6m = std_ann / sqrt(252) * sqrt(126)
FACTOR_126 = np.sqrt(126 / 252)   # = sqrt(0.5)
STD_6M = {k: v * FACTOR_126 for k, v in STD_ANN.items()}

# Impactos base (R$ bi)
IMPACT_FX       = 2.10    # bi — coupling S1↔S2
IMPACT_LITHIUM  = 1.00    # bi — weight 1:1.46 vs FX
IMPACT_DEMAND   = 0.62    # bi

# Tarifa: prob=0.35, impacto=-R$2.37 bi
TARIFF_PROB  = 0.35
TARIFF_IMPACT = -2.37

# ─────────────────────────────────────────────
# 1. DECOMPOSIÇÃO DE CHOLESKY
# ─────────────────────────────────────────────
print("=" * 60)
print("NB-06 — SIMULAÇÃO MONTE CARLO MULTIVARIADA")
print("BYD Camacari 2025–2027 | Análise Prescritiva")
print("=" * 60)
print(f"\n[n_paths={N_PATHS:,} | n_days={N_DAYS}]")

L = np.linalg.cholesky(CORR_MATRIX)
print("\n[✓] Decomposição de Cholesky aplicada.")
print("    Matriz de correlação decomposta com sucesso.")

# ─────────────────────────────────────────────
# 2. SIMULAÇÃO DOS CHOQUES CORRELACIONADOS
# ─────────────────────────────────────────────
# Geração de normais independentes
Z = np.random.standard_normal((N_PATHS, 4))
# Aplicar Cholesky → normais correlacionadas
Y = Z @ L.T

# Choques para 6 meses (anuais / sqrt(2))
shock_fx       = Y[:, 0] * STD_6M["PTAX/FX"] + 0.0192   # mean=+1.92%
shock_lithium  = Y[:, 1] * STD_6M["Lítio"]   - 0.05     # mean=-5%
shock_demand   = Y[:, 2] * STD_6M["Demanda"]

# Tarifa: Bernoulli(p=0.35)
shock_tariff = np.where(np.random.random(N_PATHS) < TARIFF_PROB, 1, 0).astype(float)

print("\n[✓] Choques gerados:")
print(f"    FX       : média={shock_fx.mean():.4f}  | std={shock_fx.std():.4f}")
print(f"    Lítio    : média={shock_lithium.mean():.4f}  | std={shock_lithium.std():.4f}")
print(f"    Tarifa   : prob={TARIFF_PROB}  | impacto={TARIFF_IMPACT}R$ bi")
print(f"    Demanda  : média={shock_demand.mean():.4f}  | std={shock_demand.std():.4f}")

# ─────────────────────────────────────────────
# 3. IMPACTO TOTAL POR CAMINHO
# ─────────────────────────────────────────────
impact_fx_b      = shock_fx      * IMPACT_FX
impact_lithium_b = shock_lithium  * IMPACT_LITHIUM
impact_tariff_b  = shock_tariff   * TARIFF_IMPACT
impact_demand_b  = shock_demand   * IMPACT_DEMAND

total_impact = (impact_fx_b + impact_lithium_b +
                impact_tariff_b + impact_demand_b)

print(f"\n[✓] Impacto total simulado em {N_PATHS:,} caminhos.")
print(f"    Distribuição do impacto total (R$ bi):")
print(f"      Mínimo : {total_impact.min():.2f}")
print(f"      Máximo : {total_impact.max():.2f}")
print(f"      Média  : {total_impact.mean():.2f}")
print(f"      Median : {np.median(total_impact):.2f}")

# ─────────────────────────────────────────────
# 4. VaR E CVaR
# ─────────────────────────────────────────────
var_95   = np.percentile(total_impact, 5)
var_99   = np.percentile(total_impact, 1)
cvar_95  = total_impact[total_impact <= var_95].mean()
var_90   = np.percentile(total_impact, 10)
var_50   = np.percentile(total_impact, 50)

print(f"\n[✓] Métricas de Risco:")
print(f"    VaR  99% : R$ {var_99:.2f} bi  (pior 1%)")
print(f"    VaR  95% : R$ {var_95:.2f} bi  (pior 5%)")
print(f"    VaR  90% : R$ {var_90:.2f} bi  (pior 10%)")
print(f"    CVaR 95% : R$ {cvar_95:.2f} bi  (média do pior 5%)")
print(f"    VaR  50% : R$ {var_50:.2f} bi  (mediana)")

# Percentis adicionais
percentile_table = {}
for p in [1, 5, 10, 25, 50, 75, 90, 95, 99]:
    percentile_table[str(p)] = round(float(np.percentile(total_impact, 100 - p)), 2)

# ─────────────────────────────────────────────
# 5. TORNADO CHART — CONTRIBUIÇÃO POR CHOQUE
# ─────────────────────────────────────────────
# Contribución de cada choque ao VaR 95%
contributions = np.array([
    np.percentile(impact_fx_b,      5),   # negativo na cauda
    np.percentile(impact_lithium_b, 5),
    np.percentile(impact_tariff_b,  5),
    np.percentile(impact_demand_b,  5)
])
abs_contributions = np.abs(contributions)
total_abs = abs_contributions.sum()
pct_contrib = (abs_contributions / total_abs * 100).round(1)

tornado_data = []
for i, name in enumerate(SHOCK_NAMES):
    tornado_data.append({
        "shock": name,
        "impact_B": round(float(contributions[i]), 2),
        "contribution_pct": float(pct_contrib[i])
    })
# Ordenar por contribuição absoluta (maior primeiro)
tornado_data.sort(key=lambda x: abs(x["impact_B"]), reverse=True)

print(f"\n[✓] Tornado Chart — Contribuição ao VaR 95%:")
for item in tornado_data:
    sign = "+" if item["impact_B"] >= 0 else ""
    print(f"    {item['shock']:<12}: {sign}{item['impact_B']:.2f} R$ bi  ({item['contribution_pct']:.1f}%)")

# ─────────────────────────────────────────────
# 6. GRÁFICO TORNADO (Plotly)
# ─────────────────────────────────────────────
tornado_labels  = [d["shock"] for d in tornado_data]
tornado_impacts = [d["impact_B"] for d in tornado_data]
tornado_colors  = ["#e8a23c" if v < 0 else "#4f8ef7" for v in tornado_impacts]

fig_tornado = go.Figure()
fig_tornado.add_trace(go.Bar(
    x=tornado_impacts,
    y=tornado_labels,
    orientation="h",
    marker_color=tornado_colors,
    text=[f"{v:.2f} R$ bi" for v in tornado_impacts],
    textposition="outside",
    textfont=dict(color="white", size=11),
    hovertemplate="<b>%{y}</b><br>Impacto: %{x:.2f} R$ bi<extra></extra>"
))
fig_tornado.update_layout(
    title=dict(
        text="Tornado Chart — Contribuição ao VaR 95% (R$ bi)",
        font=dict(color="white", size=16),
        x=0.5
    ),
    xaxis_title="Impacto (R$ bi)",
    yaxis_title="",
    plot_bgcolor="#0d1117",
    paper_bgcolor="#0d1117",
    font=dict(color="white"),
    height=400,
    margin=dict(l=120, r=40, t=60, b=40),
    xaxis=dict(
        zeroline=True, zerolinecolor="#4f8ef7", zerolinewidth=2,
        gridcolor="#1e2533", tickfont=dict(color="white")
    ),
    yaxis=dict(
        tickfont=dict(color="white"),
        gridcolor="#1e2533"
    ),
    showlegend=False
)
fig_tornado.write_html("outputs/nb06_tornado_chart.html")
print("\n[✓] Gráfico tornado salvo: outputs/nb06_tornado_chart.html")

# ─────────────────────────────────────────────
# 7. DISTRIBUIÇÃO DO IMPACTO TOTAL (Plotly)
# ─────────────────────────────────────────────
fig_dist = go.Figure()
fig_dist.add_trace(go.Histogram(
    x=total_impact,
    nbinsx=80,
    marker_color="#4f8ef7",
    opacity=0.85,
    name="Impacto Total"
))
# Linha VaR 95%
fig_dist.add_vline(
    x=var_95, line_dash="dash", line_color="#e8a23c", line_width=2,
    annotation_text=f"VaR 95% = {var_95:.2f} R$ bi",
    annotation_position="top",
    annotation_font_color="#e8a23c"
)
# Linha CVaR 95%
fig_dist.add_vline(
    x=cvar_95, line_dash="dot", line_color="#34d399", line_width=2,
    annotation_text=f"CVaR 95% = {cvar_95:.2f} R$ bi",
    annotation_position="bottom",
    annotation_font_color="#34d399"
)
fig_dist.update_layout(
    title=dict(text="Distribuição do Impacto Total — Monte Carlo (10k caminhos)", font=dict(color="white", size=14), x=0.5),
    xaxis_title="Impacto (R$ bi)",
    yaxis_title="Frequência",
    plot_bgcolor="#0d1117",
    paper_bgcolor="#0d1117",
    font=dict(color="white"),
    height=400,
    margin=dict(l=60, r=40, t=60, b=60),
    xaxis=dict(gridcolor="#1e2533", tickfont=dict(color="white")),
    yaxis=dict(gridcolor="#1e2533", tickfont=dict(color="white")),
    showlegend=False
)
fig_dist.write_html("outputs/nb06_impact_distribution.html")
print("[✓] Distribuição salva: outputs/nb06_impact_distribution.html")

# ─────────────────────────────────────────────
# 8. EXPORTAR JSON
# ─────────────────────────────────────────────
results = {
    "n_paths": N_PATHS,
    "n_days": N_DAYS,
    "var_95_B": round(float(var_95), 2),
    "cvar_95_B": round(float(cvar_95), 2),
    "var_99_B": round(float(var_99), 2),
    "var_90_B": round(float(var_90), 2),
    "var_50_B": round(float(var_50), 2),
    "tornado": tornado_data,
    "percentile_table": percentile_table,
    "correlation_matrix": CORR_MATRIX.tolist(),
    "shock_params": {
        "fx_std_ann":      STD_ANN["PTAX/FX"],
        "lithium_std_ann": STD_ANN["Lítio"],
        "demand_std_ann":  STD_ANN["Demanda"],
        "tariff_prob":     TARIFF_PROB,
        "tariff_impact_B": TARIFF_IMPACT
    }
}

with open("outputs/nb06_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\n[✓] Resultados exportados: outputs/nb06_results.json")
print("\n" + "=" * 60)
print("SIMULAÇÃO CONCLUÍDA COM SUCESSO")
print("=" * 60)
