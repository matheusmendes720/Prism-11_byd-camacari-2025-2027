# -*- coding: utf-8 -*-
"""
nb-02-supply-chain-hhi.py
=========================
Análise de Cadeia de Suprimentos — Índice Herfindahl-Hirschman (HHI)
e Cenários de Disrupção para BYD Camacari 2025–2027.

Autor:   Value Factory Analytics
Versão:  1.0
Data:    2026-07-26
"""

import json
import os
from pathlib import Path

# ── Configuração de caminhos ──────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PYEXEC = Path(r"C:\Users\mathe\AppData\Local\Programs\Python\Python312\python.exe")

# ── Branding / tema escuro ────────────────────────────────────────────────────
BRAND_DARK   = "#0d1117"
BRAND_BLUE   = "#4f8ef7"
BRAND_AMBER  = "#e8a23c"
BRAND_GREEN  = "#34d399"

# ── 1. HHI por categoria ─────────────────────────────────────────────────────
# Fontes: LINHAGEM.md — concentrações de mercado por insumo
hhi_raw = {
    "battery_cells": {
        "participacoes": {"Geely": 0.35, "CATL": 0.25, "LG": 0.20, "others": 0.20},
        "weight": 0.40,   # peso no spend total
    },
    "steel": {
        "participacoes": {"CSA": 0.40, "Arcelor": 0.30, "others": 0.30},
        "weight": 0.25,
    },
    "electronics": {
        "participacoes": {"Bosch": 0.30, "Continental": 0.25, "Denso": 0.20, "others": 0.25},
        "weight": 0.20,
    },
    "lithium": {
        "participacoes": {"SQM": 0.30, "Albemarle": 0.25, "Livent": 0.20, "Ganfeng": 0.15, "others": 0.10},
        "weight": 0.10,
    },
    "wiring_harness": {
        "participacoes": {"Yazaki": 0.45, "Leoni": 0.30, "others": 0.25},
        "weight": 0.05,
    },
}

def calc_hhi(participacoes: dict) -> float:
    """Calcula HHI = Σ s_i² a partir de um dicionário {fornecedor: participação}."""
    return sum(v ** 2 for v in participacoes.values())

hhi_by_category = {}
for cat, data in hhi_raw.items():
    hhi_by_category[cat] = round(calc_hhi(data["participacoes"]), 4)

# ── 2. HHI ponderado composto ────────────────────────────────────────────────
weighted_hhi = round(
    sum(hhi_by_category[cat] * data["weight"] for cat, data in hhi_raw.items()),
    4,
)

# ── 3. Cenários de disrupção ─────────────────────────────────────────────────
disruption_scenarios = [
    {
        "label": "S2 — VERDE (normal)",
        "probability": 0.70,
        "impact_pct": -0.02,
        "duration_days": 5,
        "var_r1b_m": -2.0,
        "risk_score": round(0.70 * abs(-0.02) * 5, 4),
    },
    {
        "label": "S2 — ÂMBAR (tensão)",
        "probability": 0.20,
        "impact_pct": -0.08,
        "duration_days": 15,
        "var_r1b_m": -8.0,
        "risk_score": round(0.20 * abs(-0.08) * 15, 4),
    },
    {
        "label": "S2 — VERMELHO (crise)",
        "probability": 0.10,
        "impact_pct": -0.20,
        "duration_days": 30,
        "var_r1b_m": -20.0,
        "risk_score": round(0.10 * abs(-0.20) * 30, 4),
    },
]

# ── 4. VaR Supply ────────────────────────────────────────────────────────────
var_supply_r1b = 4.00   # R$ 4,00 Bi (recalibrado real 12m)
stress_multipliers = [1.0, 1.5, 2.0, 2.5]
var_supply_stress = [round(var_supply_r1b * m, 2) for m in stress_multipliers]

# ── 5. Monta resultado ────────────────────────────────────────────────────────
result = {
    "hhi_by_category": hhi_by_category,
    "weighted_hhi": weighted_hhi,
    "disruption_scenarios": disruption_scenarios,
    "var_supply_r1b": var_supply_r1b,
    "var_supply_stress": var_supply_stress,
    "stress_multipliers": stress_multipliers,
    "metadata": {
        "brand_dark": BRAND_DARK,
        "brand_blue": BRAND_BLUE,
        "brand_amber": BRAND_AMBER,
        "brand_green": BRAND_GREEN,
        "hhi_interpretation": {
            "0.0_0.15": "Mercado competitivo / fragmentado",
            "0.15_0.25": "Concentração moderada",
            ">0.25": "Alta concentração — risco sistêmico",
        },
    },
}

OUTPUT_JSON = OUTPUT_DIR / "nb02_results.json"
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("=" * 60)
print("  nb-02-supply-chain-hhi — Análise de Cadeia de Suprimentos")
print("=" * 60)
print()
print("📊 HHI POR CATEGORIA")
print("-" * 40)
for cat, hhi in hhi_by_category.items():
    interp = (
        "⚠️  ALTA CONCENTRAÇÃO"
        if hhi > 0.25
        else "🔹 MODERADA"
        if hhi > 0.15
        else "🟢 COMPETITIVO"
    )
    print(f"  {cat:<20s} HHI = {hhi:.4f}  [{interp}]")

print()
print("📐 HHI COMPOSTO PONDERADO")
print("-" * 40)
print(f"  weighted_hhi = {weighted_hhi:.4f}")
interp_total = (
    "⚠️  ALTA CONCENTRAÇÃO GERAL"
    if weighted_hhi > 0.25
    else "🔹 MODERAÇÃO"
    if weighted_hhi > 0.15
    else "🟢 COMPETITIVO"
)
print(f"  [{interp_total}]")

print()
print("🔴 CENÁRIOS DE DISRUPCÃO (VaR Supply)")
print("-" * 40)
for s in disruption_scenarios:
    print(
        f"  {s['label']}"
        f"  prob={s['probability']:.0%}"
        f"  impacto={s['impact_pct']:.0%}"
        f"  duração={s['duration_days']}d"
        f"  VaR=R$ {abs(s['var_r1b_m']):.1f}M"
        f"  risk_score={s['risk_score']:.4f}"
    )

print()
print(f"💰 VaR SUPPLY BASE ....... R$ {var_supply_r1b:.2f} Bi")
print(f"💰 VaR SUPPLY STRESS multipliers: {stress_multipliers}")
for mult, val in zip(stress_multipliers, var_supply_stress):
    print(f"    ×{mult:.1f} → R$ {val:.2f} Bi")

print()
print(f"✅ Resultados exportados para: {OUTPUT_JSON}")
print("=" * 60)
