# -*- coding: utf-8 -*-
"""
NB-03 — Cenários Regulatórios BNDES
Análise Prescritiva — BYD Camacari 2025-2027

Autor: Hermes Agent (Nous Research)
Data: 2026-07-26
Linguagem: Português (pt-br)
"""

import json
import os
import textwrap
from pathlib import Path

# ═══════════════════════════════════════════════════════════════
# CONFIGURAÇÃO DE DIRETÓRIOS E PATHS
# ═══════════════════════════════════════════════════════════════

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PYEXEC = "C:/Users/mathe/AppData/Local/Programs/Python/Python312/python.exe"

# Paleta de cores — brand tokens BYD
COLOR_DARK   = "#0d1117"
COLOR_BLUE   = "#4f8ef7"
COLOR_AMBER  = "#e8a23c"
COLOR_GREEN  = "#34d399"
COLOR_RED    = "#f85149"

# ═══════════════════════════════════════════════════════════════
# DEFNIÇÃO DOS 4 CENÁRIOS REGULATÓRIOS BNDES
# ═══════════════════════════════════════════════════════════════

scenarios = [
    {
        "id": "A",
        "nome": "Expansão GREEN",
        "status": "GREEN",
        "prob": 0.75,
        "vie": 0.22,
        "incentive_coverage": 0.90,
        "BNDES_kill_switch": False,
        "NPV_incentive_B": 1.5,
        "cost_delay_B": 0,
        "delay_months": 0,
        "decision": "Aprovar expansão, hedge 30%",
        "kill_trigger": None,
    },
    {
        "id": "B",
        "nome": "Tensão AMBER",
        "status": "AMBER",
        "prob": 0.15,
        "vie": 0.10,
        "incentive_coverage": 0.50,
        "BNDES_kill_switch": False,
        "NPV_incentive_B": 0.8,
        "cost_delay_B": 0.05,
        "delay_months": 3,
        "decision": "Expansão condicional, hedge 60%, preparar contingência",
        "kill_trigger": None,
    },
    {
        "id": "C",
        "nome": "Crise RED (kill switch)",
        "status": "RED",
        "prob": 0.08,
        "vie": 0.05,
        "incentive_coverage": 0.18,
        "BNDES_kill_switch": True,
        "NPV_incentive_B": 0.0,
        "cost_delay_B": 0.20,
        "delay_months": 6,
        "decision": "Congelar capex não-essencial, hedge 90%, ativar protocolo de crise",
        "kill_trigger": (
            "Lista suja MTE ativa desde 07/abr/2026 — "
            "163 trabalhadores resgatados dez/2024 — "
            "R$ 800M em financiamento bloqueado"
        ),
    },
    {
        "id": "D",
        "nome": "Rollback Total",
        "status": "RED",
        "prob": 0.02,
        "vie": 0.00,
        "incentive_coverage": 0.00,
        "BNDES_kill_switch": True,
        "NPV_incentive_B": 0.0,
        "cost_delay_B": 0.50,
        "delay_months": 12,
        "decision": "Freeze total, invocar cláusula kill switch",
        "kill_trigger": (
            "Programa integralmente bloqueado — "
            "todas as tranches BNDES suspensas"
        ),
    },
]

# ═══════════════════════════════════════════════════════════════
# CÁLCULOS DE MÉTRICAS ESPERADAS
# ═══════════════════════════════════════════════════════════════

expected_ViE = sum(s["prob"] * s["vie"] for s in scenarios)
expected_incentive_coverage = sum(s["prob"] * s["incentive_coverage"] for s in scenarios)
expected_NPV_B = sum(s["prob"] * s["NPV_incentive_B"] for s in scenarios)
kill_switch_prob = sum(s["prob"] for s in scenarios if s["BNDES_kill_switch"])
break_even_ViE = 0.10

# ═══════════════════════════════════════════════════════════════
# RESULTADO ESTRUTURADO (JSON)
# ═══════════════════════════════════════════════════════════════

results = {
    "scenarios": scenarios,
    "expected_ViE":                round(expected_ViE,               4),
    "expected_incentive_coverage": round(expected_incentive_coverage, 4),
    "expected_NPV_B": round(expected_NPV_B, 4),
    "kill_switch_prob": round(kill_switch_prob, 4),
    "break_even_ViE": break_even_ViE,
    "metadata": {
        "analise": "Análise Prescritiva — Cenários Regulatórios BNDES",
        "projeto": "BYD Camacari 2025-2027",
        "data": "2026-07-26",
        "python": PYEXEC,
        "notebook": "nb-03-regulatory-scenarios.ipynb",
    },
}

OUTPUT_JSON = OUTPUT_DIR / "nb03_results.json"
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("=" * 70)
print("NB-03 — CENÁRIOS REGULATÓRIOS BNDES")
print("=" * 70)
print()
print(f"📁 Saída JSON: {OUTPUT_JSON}")
print()
print("─" * 70)
print("4 CENÁRIOS DEFINIDOS:")
print("─" * 70)

status_icon = {"GREEN": "🟢", "AMBER": "🟡", "RED": "🔴"}

for s in scenarios:
    icon = status_icon.get(s["status"], "⚪")
    print(f"\n  [{s['id']}] {icon} {s['nome']}")
    print(f"      Status    : {s['status']}")
    print(f"      Probabilidade: {s['prob']*100:.0f}%")
    print(f"      ViE        : {s['vie']*100:.0f}%")
    print(f"      Cobertura  : {s['incentive_coverage']*100:.0f}%")
    print(f"      NPV incentivo: R$ {s['NPV_incentive_B']:.1f}B")
    print(f"      Custo atraso: R$ {s['cost_delay_B']:.2f}B ({s['delay_months']} meses)")
    print(f"      Kill switch : {'SIM ⚠️' if s['BNDES_kill_switch'] else 'NÃO'}")
    if s["kill_trigger"]:
        print(f"      Gatilho     : {s['kill_trigger']}")
    print(f"      Decisão    : {s['decision']}")

print()
print("─" * 70)
print("MÉTRICAS ESPERADAS (VALOR ESPERADO):")
print("─" * 70)
print(f"  ViE esperado            : {expected_ViE*100:.1f}%  (break-even: {break_even_ViE*100:.0f}%)")
print(f"  Cobertura incentivos    : {expected_incentive_coverage*100:.1f}%")
print(f"  NPV esperado            : R$ {expected_NPV_B:.3f}B")
print(f"  Prob. kill switch       : {kill_switch_prob*100:.0f}%  (cenários C + D)")

# Validação — valores matematicamente corretos
# ViE: 0.75×22 + 0.15×10 + 0.08×5 + 0.02×0 = 16.5+1.5+0.4+0 = 18.4%
# Cobertura: 0.75×0.90 + 0.15×0.50 + 0.08×0.18 + 0.02×0.00 = 0.675+0.075+0.0144+0 = 0.7644
# NPV: 0.75×1.5 + 0.15×0.8 + 0.08×0 + 0.02×0 = 1.125+0.12+0+0 = 1.245
# Kill switch: 0.08+0.02 = 0.10
assert abs(expected_ViE - 0.184) < 1e-6, "ViE esperado divergente"
assert abs(expected_incentive_coverage - 0.7644) < 1e-4, "Cobertura esperada divergente"
assert abs(expected_NPV_B - 1.245) < 1e-6, "NPV esperado divergente"
assert abs(kill_switch_prob - 0.10) < 1e-6, "Prob. kill switch divergente"

print()
print("✅ Validação OK — todos os valores esperados conferem.")
print("=" * 70)
print(f"\n💾 JSON gerado em: {OUTPUT_JSON}")
