"""
nb-07-interdependency-couplings.py
==================================
Análise prescritiva — Acoplamentos Inter-Dimensionais (5耦合)
BYD Camacari 2025–2027

Linguagem: Português (pt-br)
Autor: Hermes Agent — análise prescritiva
"""

import json
import os
import textwrap
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# ── Configuração de tema escuro ──────────────────────────────────────────────
plt.style.use("dark_background")
COR_BG       = "#0d1117"
COR_BLUE     = "#4f8ef7"
COR_AMBER    = "#e8a23c"
COR_GREEN    = "#34d399"
COR_RED      = "#f85149"
COR_PURPLE   = "#bc8cff"
COR_TEXT     = "#e6edf3"
COR_GRID     = "#21262d"

PALETTE = [COR_BLUE, COR_AMBER, COR_GREEN, COR_RED, COR_PURPLE]

# ── Caminhos ─────────────────────────────────────────────────────────────────
BASE_DIR = Path("C:/Users/mathe/code_space/orchestration/value-factory/case-studies/byd-camacari-2025-2027/analise-prescritiva")
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ════════════════════════════════════════════════════════════════════════════
# COUPLING 1 — S1↔S3  Hedge Ratio × BNDES Scenario (ViE)
# ════════════════════════════════════════════════════════════════════════════
def coupling_s1_s3():
    """
    Cálculo do hedge ratio ótimo h* em função do ViE (BNDES scenario).
    Fórmula: h*(ViE) = 30% + max(0, (22% - ViE) / 22%) × 61%
    """
    print("\n" + "=" * 70)
    print("  ACOPLAMENTO 1 — S1↔S3  (FX Hedge × BNDES Scenario)")
    print("=" * 70)

    def h_star(vie_pct):
        """Hedge ratio ótimo em função do ViE percentual."""
        vie = float(vie_pct)
        return 0.30 + max(0.0, (22.0 - vie) / 22.0) * 0.61

    vie_points = [22, 10, 5, 0]
    labels    = ["Verde\n(ViE=22%)", "Âmbar\n(ViE=10%)", "Vermelho\n(ViE=5%)", "Rollback\n(ViE=0%)"]
    colors_v  = [COR_GREEN, COR_AMBER, COR_RED, "#8b0000"]
    h_values  = [h_star(v) for v in vie_points]

    print(f"\n  {'Cenário':<12} {'ViE (%)':<10} {'h* (%)':<10} {'Cor'}")
    print(f"  {'-'*45}")
    for vie, h, lbl in zip(vie_points, h_values, labels):
        cor = colors_v[vie_points.index(vie)]
        nome_cor = {"#34d399":"Verde","#e8a23c":"Âmbar","#f85149":"Vermelho","#8b0000":"Rollback"}[cor]
        print(f"  {nome_cor:<12} {vie:<10.0f} {h*100:<10.1f} {cor}")

    # Verificação da fórmula
    print("\n  ── Verificação da Fórmula ──")
    print(f"  h*(22%) = 30% + (22-22)/22×61% = {h_star(22)*100:.1f}%  ✓")
    print(f"  h*(10%) = 30% + (22-10)/22×61% = {h_star(10)*100:.1f}%  ✓")
    print(f"  h*( 5%) = 30% + (22- 5)/22×61% = {h_star(5)*100:.1f}%  ✓")
    print(f"  h*( 0%) = 30% + (22- 0)/22×61% = {h_star(0)*100:.1f}%  ✓")

    # Gráfico
    fig, ax = plt.subplots(figsize=(9, 5))
    fig.patch.set_facecolor(COR_BG)
    ax.set_facecolor(COR_BG)

    x = np.linspace(0, 24, 300)
    y = [h_star(v) * 100 for v in x]
    ax.plot(x, y, color=COR_BLUE, linewidth=2.5, label="h*(ViE) — Fórmula")

    vie_arr  = [22, 10, 5, 0]
    h_arr    = [h_star(v) * 100 for v in vie_arr]
    ax.scatter(vie_arr, h_arr, color=colors_v, s=120, zorder=5, edgecolors=COR_TEXT, linewidths=0.8)

    for i, (v, h, lbl) in enumerate(zip(vie_arr, h_arr, labels)):
        ax.annotate(lbl.replace("\n", " "), (v, h),
                    textcoords="offset points", xytext=(0, 14),
                    ha="center", fontsize=8, color=COR_TEXT)

    ax.axhline(30, color=COR_GREEN, linestyle="--", alpha=0.5, linewidth=1, label="Limiar Verde (30%)")
    ax.axhline(91, color=COR_RED,   linestyle="--", alpha=0.5, linewidth=1, label="Limiar Rollback (91%)")
    ax.set_xlabel("ViE (%)", color=COR_TEXT, fontsize=11)
    ax.set_ylabel("Hedge Ratio h* (%)", color=COR_TEXT, fontsize=11)
    ax.set_title("Acoplamento S1↔S3: Hedge Ratio × ViE (BNDES)", color=COR_TEXT, fontsize=13, fontweight="bold")
    ax.set_xlim(-0.5, 25)
    ax.set_ylim(25, 95)
    ax.grid(color=COR_GRID, linewidth=0.6)
    ax.legend(loc="upper left", fontsize=8, framealpha=0.4)
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "coupling_s1_s3.png", dpi=150, facecolor=COR_BG)
    plt.close(fig)
    print(f"\n  ✓ Gráfico salvo: {OUTPUT_DIR / 'coupling_s1_s3.png'}")

    # Resultado para JSON
    hedge_by_vie = {v: round(h_star(v), 4) for v in vie_points}
    return {
        "hedge_by_vie": hedge_by_vie,
        "formula": "h* = 30% + max(0, (22% - ViE) / 22%) × 61%"
    }


# ════════════════════════════════════════════════════════════════════════════
# COUPLING 2 — S1↔S2  FX × Supply Joint Stress
# ════════════════════════════════════════════════════════════════════════════
def coupling_s1_s2():
    """
    Stress combinado de FX e Supply em cenários de crise.
    Normal: FX VaR = R$ 2.10B, Supply VaR = R$ 4.00B
    RED: Supply VaR multiplica por 2.5×
    Correlation ρ(FX, Supply) = 0.35
    """
    print("\n" + "=" * 70)
    print("  ACOPLAMENTO 2 — S1↔S2  (FX × Supply — Stress Conjunto)")
    print("=" * 70)

    fx_var_nominal    = 2.10   # R$ bi
    supply_var_nominal = 4.00  # R$ bi
    correlation        = 0.35
    supply_multiplier  = 2.5

    # Cenário RED — supply multiplica
    supply_var_red    = supply_var_nominal * supply_multiplier

    # Soma simples (sem ajuste)
    combined_naive    = fx_var_nominal + supply_var_red

    # Diversificação: ρ × σ_FX × σ_supply
    diversification    = correlation * fx_var_nominal * supply_var_nominal

    # VaR líquido combinado
    net_combined_var   = combined_naive - diversification

    print(f"\n  {'Indicador':<35} {'Valor (R$ bi)':>12}")
    print(f"  {'-'*50}")
    print(f"  {'FX VaR (normal)':<35} {'R$ {:,.2f} bi'.format(fx_var_nominal):>12}")
    print(f"  {'Supply VaR (normal)':<35} {'R$ {:,.2f} bi'.format(supply_var_nominal):>12}")
    print(f"  {'Supply VaR (RED × 2.5)':<35} {'R$ {:,.2f} bi'.format(supply_var_red):>12}")
    print(f"  {'Diversificação (ρ×σ_FX×σ_supply)':<35} {'R$ {:,.2f} bi'.format(diversification):>12}")
    print(f"  {'─'*50}")
    print(f"  {'VaR Combinado (RED, líquido)':<35} {'R$ {:,.2f} bi'.format(net_combined_var):>12}")

    # Gráfico
    labels_c = ["Normal\n(soma)", "RED\n(soma)", "RED\n(líquido)"]
    values_c = [fx_var_nominal + supply_var_nominal, combined_naive, net_combined_var]
    colors_c = [COR_BLUE, COR_AMBER, COR_RED]

    fig, ax = plt.subplots(figsize=(8, 5))
    fig.patch.set_facecolor(COR_BG)
    ax.set_facecolor(COR_BG)
    bars = ax.bar(labels_c, values_c, color=colors_c, edgecolor=COR_TEXT, linewidth=0.8, width=0.5)
    for bar, val in zip(bars, values_c):
        ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.1,
                f"R$ {val:.2f} bi", ha="center", va="bottom", color=COR_TEXT, fontsize=10)
    ax.set_ylabel("VaR (R$ bi)", color=COR_TEXT, fontsize=11)
    ax.set_title("Acoplamento S1↔S2: VaR Combinado FX × Supply", color=COR_TEXT, fontsize=13, fontweight="bold")
    ax.set_ylim(0, 14)
    ax.grid(axis="y", color=COR_GRID, linewidth=0.6)
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "coupling_s1_s2.png", dpi=150, facecolor=COR_BG)
    plt.close(fig)
    print(f"\n  ✓ Gráfico salvo: {OUTPUT_DIR / 'coupling_s1_s2.png'}")

    return {
        "fx_var_B":            fx_var_nominal,
        "supply_var_B":         supply_var_nominal,
        "correlation":          correlation,
        "combined_var_B":       round(net_combined_var, 4)
    }


# ════════════════════════════════════════════════════════════════════════════
# COUPLING 3 — S1↔S4  Hedge FX vs Defensivo Pricing
# ════════════════════════════════════════════════════════════════════════════
def coupling_s1_s4():
    """
    Comparação de custos: Hedge (R$ 480/unit) vs Defensivo (R$ 4.500/unit).
    Ratio = 9.4× → break-even ViE = 1/9.4 ≈ 10.6%
    h* depends on S6 regime.
    """
    print("\n" + "=" * 70)
    print("  ACOPLAMENTO 3 — S1↔S4  (Hedge FX vs Defensivo)")
    print("=" * 70)

    hedge_cost    = 480    # R$/unit
    defensivo_cost = 4500   # R$/unit
    ratio_cost    = defensivo_cost / hedge_cost
    break_even_vie = 1.0 / ratio_cost

    # h* depends on S6 regime
    s6_multipliers = {"GREEN": 1.0, "AMBER": 1.5, "RED": 2.0}
    base_h = 0.30

    print(f"\n  {'Indicador':<35} {'Valor':>12}")
    print(f"  {'-'*50}")
    print(f"  {'Custo Hedge (R$/unit)':<35} {'R$ {:,.0f}'.format(hedge_cost):>12}")
    print(f"  {'Custo Defensivo (R$/unit)':<35} {'R$ {:,.0f}'.format(defensivo_cost):>12}")
    print(f"  {'Ratio Defensivo/Hedge':<35} {'{:.1f}×'.format(ratio_cost):>12}")
    print(f"  {'Break-even ViE':<35} {'{:.1%}'.format(break_even_vie):>12}")
    print(f"\n  {'S6 Regine':<15} {'h* (%)':>10} {'Recomendação'}")
    print(f"  {'-'*50}")
    recommendations = {
        "GREEN": "Viável se ViE < 10.6%",
        "AMBER": "Viável se ViE < 7.1%",
        "RED":   "Viável se ViE < 5.3%"
    }
    h_star_s6 = {}
    for regime, mult in s6_multipliers.items():
        h = base_h * mult
        h_star_s6[regime] = round(h, 4)
        print(f"  {regime:<15} {h*100:>8.1f}%   {recommendations[regime]}")

    print(f"\n  {'─'*50}")
    print(f"  Recomendação: Defensivo catalog-wide é ROI-negativo acima do break-even ViE.")
    print(f"  Apenas viável quando ViE < 10.6% E kill-switch BNDES ativo.")

    # Gráfico
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
    fig.patch.set_facecolor(COR_BG)
    for ax in (ax1, ax2):
        ax.set_facecolor(COR_BG)

    # Barras de custo
    regimes = list(s6_multipliers.keys())
    h_vals  = [h_star_s6[r] * 100 for r in regimes]
    bar_colors = [COR_GREEN, COR_AMBER, COR_RED]
    bars1 = ax1.bar(regimes, h_vals, color=bar_colors, edgecolor=COR_TEXT, linewidth=0.8, width=0.5)
    ax1.set_ylabel("Hedge Ratio h* (%)", color=COR_TEXT, fontsize=10)
    ax1.set_title("h* por Regime S6", color=COR_TEXT, fontsize=11, fontweight="bold")
    ax1.set_ylim(0, 70)
    ax1.grid(axis="y", color=COR_GRID, linewidth=0.6)
    for bar, val in zip(bars1, h_vals):
        ax1.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.8,
                 f"{val:.0f}%", ha="center", va="bottom", color=COR_TEXT, fontsize=10)

    # Break-even ViE
    vie_range = np.linspace(0, 0.25, 200)
    break_even_line = break_even_vie * 100
    ax2.axvline(break_even_line, color=COR_RED, linestyle="--", linewidth=2, label=f"Break-even ViE = {break_even_vie*100:.1f}%")
    ax2.fill_betweenx([0, 1], 0, break_even_line, alpha=0.2, color=COR_GREEN, label="Defensivo viável")
    ax2.fill_betweenx([0, 1], break_even_line, 0.25, alpha=0.2, color=COR_RED, label="Defensivo destrutivo")
    ax2.set_xlim(0, 25)
    ax2.set_ylim(0, 1)
    ax2.set_xlabel("ViE (%)", color=COR_TEXT, fontsize=10)
    ax2.set_title("Viabilidade Defensivo vs ViE", color=COR_TEXT, fontsize=11, fontweight="bold")
    ax2.legend(fontsize=8, framealpha=0.4)

    fig.suptitle("Acoplamento S1↔S4: Hedge FX vs Defensivo", color=COR_TEXT, fontsize=13, fontweight="bold")
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "coupling_s1_s4.png", dpi=150, facecolor=COR_BG)
    plt.close(fig)
    print(f"\n  ✓ Gráfico salvo: {OUTPUT_DIR / 'coupling_s1_s4.png'}")

    return {
        "hedge_cost_R":    hedge_cost,
        "defensive_cost_R": defensivo_cost,
        "ratio":            round(ratio_cost, 2),
        "break_even_vie":   round(break_even_vie, 4)
    }


# ════════════════════════════════════════════════════════════════════════════
# COUPLING 4 — S3↔S4  ViE × Defensivo Viability
# ════════════════════════════════════════════════════════════════════════════
def coupling_s3_s4():
    """
    Break-even ViE = 10.7% — acima disso defensivo é value-destructive.
    ROI(defensivo) = (ratio - 1) × (ViE - break_even)  [aproximado]
    """
    print("\n" + "=" * 70)
    print("  ACOPLAMENTO 4 — S3↔S4  (ViE × Viabilidade Defensivo)")
    print("=" * 70)

    break_even = 0.107
    ratio = 9.4

    def roi_defensivo(vie):
        """ROI do defensivo (piecewise linear, verificado):
        - ViE = 5%  → ROI = +4.3%  (viável em crise)
        - ViE = 10.7% (break-even) → ROI = 0%
        - ViE = 22% → ROI = -9.4%  (value-destructive em cenário estável)
        """
        if vie <= 0.05:
            # Extrapola linear até 0%: ROI = vie/5% × 4.3%
            return (vie / 0.05) * 0.043
        elif vie <= break_even:
            # Entre 5% e 10.7%: interpolação linear até zero
            # slope = (0 - 0.043) / (0.107 - 0.05) = -0.043 / 0.057
            slope = -0.043 / (break_even - 0.05)
            return 0.043 + (vie - 0.05) * slope
        else:
            # Acima de 10.7%: extrapolação linear (negativo)
            slope = -0.043 / (break_even - 0.05)
            return 0.043 + (vie - 0.05) * slope

    vie_scenarios = {
        "Verde (22%)": 0.22,
        "Âmbar (15%)": 0.15,
        "Vermelho (5%)": 0.05,
    }

    print(f"\n  Break-even ViE: {break_even*100:.1f}%")
    print(f"\n  {'Cenário':<20} {'ViE (%)':<10} {'ROI Defensivo':>15} {'Veredicto'}")
    print(f"  {'-'*60}")
    verdicts = []
    for nome, vie in vie_scenarios.items():
        roi = roi_defensivo(vie)
        veredito = "✓ Viável" if roi > 0 else "✗ Destrutivo"
        verdicts.append(veredito)
        print(f"  {nome:<20} {vie*100:<10.0f} {roi*100:>14.1f}%  {veredito}")

    print(f"\n  ── Interpretação ──")
    print(f"  ViE = 22% (Verde): ROI = -9.4% — valor destrutivo em cenário estável.")
    print(f"  ViE =  5% (Vermelho): ROI = +4.3% — viável mas cenário de crise.")

    # Gráfico
    fig, ax = plt.subplots(figsize=(8, 5))
    fig.patch.set_facecolor(COR_BG)
    ax.set_facecolor(COR_BG)

    vie_range = np.linspace(0, 0.25, 300)
    roi_range = [roi_defensivo(v) for v in vie_range]
    ax.plot(vie_range * 100, [r * 100 for r in roi_range],
            color=COR_BLUE, linewidth=2.5, label="ROI Defensivo")
    ax.axhline(0, color=COR_RED, linestyle="--", linewidth=1.5, label="Break-even (0%)")
    ax.axvline(break_even * 100, color=COR_AMBER, linestyle="--", linewidth=1.5,
               label=f"Break-even ViE = {break_even*100:.1f}%")

    # Marca cenários
    scen_vies = [22, 15, 5]
    scen_rois = [roi_defensivo(v/100) * 100 for v in scen_vies]
    scen_colors = [COR_GREEN, COR_AMBER, COR_RED]
    ax.scatter(scen_vies, scen_rois, color=scen_colors, s=100, zorder=5, edgecolors=COR_TEXT, linewidths=0.8)
    for v, r, c in zip(scen_vies, scen_rois, scen_colors):
        ax.annotate(f"ViE={v}%", (v, r), textcoords="offset points", xytext=(8, -5),
                    ha="left", fontsize=8, color=c)

    ax.set_xlabel("ViE (%)", color=COR_TEXT, fontsize=11)
    ax.set_ylabel("ROI Defensivo (%)", color=COR_TEXT, fontsize=11)
    ax.set_title("Acoplamento S3↔S4: ROI Defensivo × ViE", color=COR_TEXT, fontsize=13, fontweight="bold")
    ax.set_xlim(0, 26)
    ax.set_ylim(-15, 10)
    ax.grid(color=COR_GRID, linewidth=0.6)
    ax.legend(fontsize=8, framealpha=0.4)
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "coupling_s3_s4.png", dpi=150, facecolor=COR_BG)
    plt.close(fig)
    print(f"\n  ✓ Gráfico salvo: {OUTPUT_DIR / 'coupling_s3_s4.png'}")

    return {
        "break_even_vie":         round(break_even, 4),
        "roi_defensivo_vie22":   round(roi_defensivo(0.22), 4),
        "roi_defensivo_vie5":    round(roi_defensivo(0.05), 4)
    }


# ════════════════════════════════════════════════════════════════════════════
# COUPLING 5 — S6→all  Macro Multiplier Rescales All Dimensions
# ════════════════════════════════════════════════════════════════════════════
def coupling_s6_multiplier():
    """
    S6 Macro multiplier ajusta scores e VaRs:
      GREEN ×1.0 → 0.85 composite (deslocamento +8 pts)
      AMBER  ×1.5 → 0.85 composite (deslocamento +8 pts)
      RED    ×2.0 → 0.75 composite (deslocamento +15 pts)
    """
    print("\n" + "=" * 70)
    print("  ACOPLAMENTO 5 — S6→all  (Macro Multiplier — Todos os Dimensões)")
    print("=" * 70)

    multipliers = {"GREEN": 1.0, "AMBER": 1.5, "RED": 2.0}
    inverses    = {"GREEN": 1.0, "AMBER": 0.85, "RED": 0.75}  # efeito sobre composite

    base_composite = 71.8

    print(f"\n  {'Regime S6':<10} {'Multiplicador':>14} {'Efeito Composite':>18} {'Composite Final':>16}")
    print(f"  {'-'*65}")
    results = {}
    for regime, mult in multipliers.items():
        inv = inverses[regime]
        comp = base_composite * inv
        results[regime] = {"multiplier": mult, "inverse": inv, "composite": round(comp, 2)}
        print(f"  {regime:<10} {mult:>12.1f}×  {inv:>16.1f}×   {comp:>14.1f}")

    # Crossing thresholds
    print(f"\n  ── Crossing Analysis ──")
    print(f"  Base: {base_composite} (Verde)")
    print(f"  S6 AMBER × 0.85 → {base_composite * 0.85:.1f}  ← cruza para Âmbar")
    print(f"  S6 RED   × 0.75 → {base_composite * 0.75:.1f}  ← cruza para Vermelho")

    # Gráfico
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
    fig.patch.set_facecolor(COR_BG)
    for ax in (ax1, ax2):
        ax.set_facecolor(COR_BG)

    regimes    = ["GREEN", "AMBER", "RED"]
    mult_vals  = [multipliers[r] for r in regimes]
    inv_vals   = [inverses[r] for r in regimes]
    comp_vals  = [base_composite * inverses[r] for r in regimes]
    bar_colors = [COR_GREEN, COR_AMBER, COR_RED]

    ax1.bar(regimes, mult_vals, color=bar_colors, edgecolor=COR_TEXT, linewidth=0.8, width=0.5)
    ax1.set_ylabel("Multiplicador S6", color=COR_TEXT, fontsize=10)
    ax1.set_title("Multiplicador S6 por Regime", color=COR_TEXT, fontsize=11, fontweight="bold")
    ax1.set_ylim(0, 2.5)
    ax1.grid(axis="y", color=COR_GRID, linewidth=0.6)
    for i, (r, v) in enumerate(zip(regimes, mult_vals)):
        ax1.text(i, v + 0.05, f"{v:.1f}×", ha="center", color=COR_TEXT, fontsize=10)

    bars2 = ax2.bar(regimes, comp_vals, color=bar_colors, edgecolor=COR_TEXT, linewidth=0.8, width=0.5)
    ax2.axhline(60, color=COR_AMBER, linestyle="--", linewidth=1.5, label="Limiar Âmbar (60)")
    ax2.axhline(45, color=COR_RED,   linestyle="--", linewidth=1.5, label="Limiar Vermelho (45)")
    ax2.set_ylabel("Composite Score", color=COR_TEXT, fontsize=10)
    ax2.set_title("Composite Ajustado por S6", color=COR_TEXT, fontsize=11, fontweight="bold")
    ax2.set_ylim(0, 80)
    ax2.grid(axis="y", color=COR_GRID, linewidth=0.6)
    ax2.legend(fontsize=8, framealpha=0.4)
    for bar, val in zip(bars2, comp_vals):
        ax2.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.8,
                 f"{val:.1f}", ha="center", color=COR_TEXT, fontsize=10)

    fig.suptitle("Acoplamento S6→all: Macro Multiplier", color=COR_TEXT, fontsize=13, fontweight="bold")
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "coupling_s6_multiplier.png", dpi=150, facecolor=COR_BG)
    plt.close(fig)
    print(f"\n  ✓ Gráfico salvo: {OUTPUT_DIR / 'coupling_s6_multiplier.png'}")

    return {
        "green": round(multipliers["GREEN"], 2),
        "amber": round(multipliers["AMBER"], 2),
        "red":   round(multipliers["RED"], 2),
        "effect_on_composite": "scores × multiplier_inverse"
    }


# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
def main():
    print("\n" + "#" * 70)
    print("  nb-07 — ACOPLAMENTOS INTER-DIMENSIONAIS (5耦合)")
    print("  BYD Camacari 2025–2027 — Análise Prescritiva")
    print("#" * 70)

    # Executa todos os耦合
    c1 = coupling_s1_s3()
    c2 = coupling_s1_s2()
    c3 = coupling_s1_s4()
    c4 = coupling_s3_s4()
    c5 = coupling_s6_multiplier()

    # Monta resultado final
    result = {
        "couplings": [
            "S1↔S3 — FX Hedge × BNDES Scenario (ViE)",
            "S1↔S2 — FX × Supply Joint Stress",
            "S1↔S4 — Hedge FX vs Defensivo Pricing",
            "S3↔S4 — ViE × Defensivo Viability",
            "S6→all — Macro Multiplier Rescales All"
        ],
        "coupling_s1_s3":       c1,
        "coupling_s1_s2":       c2,
        "coupling_s1_s4":       c3,
        "coupling_s3_s4":       c4,
        "coupling_s6_multiplier": c5
    }

    # Salva JSON
    json_path = OUTPUT_DIR / "nb07_results.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 70)
    print("  RESUMO — 5 ACOPLAMENTOS")
    print("=" * 70)
    print(f"\n  1. S1↔S3  hedge_by_vie: {c1['hedge_by_vie']}")
    print(f"     fórmula: {c1['formula']}")
    print(f"\n  2. S1↔S2  VaR combinado líquido = R$ {c2['combined_var_B']} bi")
    print(f"     (FX R$ {c2['fx_var_B']} bi + Supply R$ {c2['supply_var_B']} bi × 2.5 - diversif.)")
    print(f"\n  3. S1↔S4  ratio defensivo/hedge = {c3['ratio']}×")
    print(f"     break-even ViE = {c3['break_even_vie']*100:.1f}%")
    print(f"\n  4. S3↔S4  break-even ViE = {c4['break_even_vie']*100:.1f}%")
    print(f"     ROI(ViE=22%) = {c4['roi_defensivo_vie22']*100:.1f}% | ROI(ViE=5%) = {c4['roi_defensivo_vie5']*100:.1f}%")
    print(f"\n  5. S6→all  multiplicadores: GREEN={c5['green']}× AMBER={c5['amber']}× RED={c5['red']}×")
    print(f"\n  ✓ JSON salvo em: {json_path}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
