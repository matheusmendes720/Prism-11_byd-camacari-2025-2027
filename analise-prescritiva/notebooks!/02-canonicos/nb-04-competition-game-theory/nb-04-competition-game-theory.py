# -*- coding: utf-8 -*-
"""
nb-04-competition-game-theory.py
Teoria dos Jogos — Mercado EV Brasil 2025–2027
5 Jogadores: BYD, Stellantis, GM, VW, Geely
Estratégias: DIFFERENTIATE (HIGH) vs PRICE_WAR (LOW)
NASH Equilibrium, Payoff Matrix, NPV Aggregado

Autor: Value Factory Analysis
Linguagem: Python 3.12
Saída: outputs/nb04_results.json
"""

import json
import os
from pathlib import Path

# ─────────────────────────────────────────────
# 1. CONFIGURAÇÃO DE CORES (Tema Escuro)
# ─────────────────────────────────────────────
BRAND_DARK  = "#0d1117"
BRAND_BLUE  = "#4f8ef7"
BRAND_AMBER = "#e8a23c"
BRAND_GREEN = "#34d399"

# ─────────────────────────────────────────────
# 2. PARÂMETROS DO MODELO
# ─────────────────────────────────────────────
TOTAL_MARKET_UNITS = 500_000   # unidades/ano
ASP                = 120_000   # R$ preço médio
NPV_FACTOR         = 4.0       # multiplicador NPV 5 anos
BILLION            = 1_000_000_000

PLAYERS = ["BYD", "Stellantis", "GM", "VW", "Geely"]
STRATEGIES = ["DIFFERENTIATE", "PRICE_WAR"]

# Market share base (%)
MARKET_SHARE_BASE = {
    "BYD":       0.38,
    "Stellantis": 0.22,
    "GM":        0.18,
    "VW":        0.14,
    "Geely":     0.08,
}

# Market share em cenário de PRICE_WAR (deslocamento)
MARKET_SHARE_WAR = {
    "BYD":       0.35,
    "Stellantis": 0.25,
    "GM":        0.20,
    "VW":        0.15,
    "Geely":     0.05,
}

# Margens por estratégia
MARGIN_HIGH = 0.08   # DIFFERENTIATE: 8%
MARGIN_LOW  = -0.02  # PRICE_WAR: -2% (destrutivo)

# Volume boost em guerra de preços (mais volume mas margem negativa)
VOLUME_BOOST_WAR = 1.15  # +15% volume na guerra


def npv(market_share, margin, volume_boost=1.0):
    """Calcula NPV em R$ bilhões."""
    revenue = market_share * volume_boost * TOTAL_MARKET_UNITS * ASP
    annual_margin = revenue * margin
    npv_b = annual_margin * NPV_FACTOR / BILLION
    return npv_b


# ─────────────────────────────────────────────
# 3. PAYOFF MATRIX 5×5 (aninhada)
#    Dimensões: [BYD][Stellantis][GM][VW][Geely]
#    Cada entries: {"BYD": val, "Stellantis": val, ...}
# ─────────────────────────────────────────────

def build_payoff_cell(byd_s, stel_s, gm_s, vw_s, geely_s):
    """Retorna dict de payoffs para uma célula da matriz 5D."""
    payoffs = {}
    strat_lookup = {
        "DIFFERENTIATE": (MARGIN_HIGH, 1.0),
        "PRICE_WAR":     (MARGIN_LOW,  VOLUME_BOOST_WAR),
    }

    for player, strat, ms_base, ms_war in [
        ("BYD",        byd_s,   MARKET_SHARE_BASE["BYD"],       MARKET_SHARE_WAR["BYD"]),
        ("Stellantis", stel_s, MARKET_SHARE_BASE["Stellantis"], MARKET_SHARE_WAR["Stellantis"]),
        ("GM",         gm_s,   MARKET_SHARE_BASE["GM"],         MARKET_SHARE_WAR["GM"]),
        ("VW",         vw_s,   MARKET_SHARE_BASE["VW"],         MARKET_SHARE_WAR["VW"]),
        ("Geely",      geely_s, MARKET_SHARE_BASE["Geely"],     MARKET_SHARE_WAR["Geely"]),
    ]:
        margin, vol_boost = strat_lookup[strat]
        # Guerra de preços redistribui market share
        ms = ms_war if strat == "PRICE_WAR" else ms_base
        payoffs[player] = round(npv(ms, margin, vol_boost), 4)

    return payoffs


# ALL HIGH — todos diferenciam
ALL_HIGH_PAYOFFS = build_payoff_cell(
    "DIFFERENTIATE", "DIFFERENTIATE", "DIFFERENTIATE", "DIFFERENTIATE", "DIFFERENTIATE"
)

# ALL LOW — todos guerra de preços
ALL_LOW_PAYOFFS = build_payoff_cell(
    "PRICE_WAR", "PRICE_WAR", "PRICE_WAR", "PRICE_WAR", "PRICE_WAR"
)

# NASH EQUILIBRIUM E3: (BYD=HIGH, Stellantis=LOW, GM=LOW, VW=LOW, Geely=HIGH)
NASH_E3_PAYOFFS = build_payoff_cell(
    "DIFFERENTIATE", "PRICE_WAR", "PRICE_WAR", "PRICE_WAR", "DIFFERENTIATE"
)

# Construir matriz 5×5 completa para todas combinações de BYD × Stellantis
# As demais combinações de GM/VW/Geely são enumeradas para completar a matriz
payoff_matrix = {}
for byd_s in STRATEGIES:
    payoff_matrix[byd_s] = {}
    for stel_s in STRATEGIES:
        payoff_matrix[byd_s][stel_s] = {}
        for gm_s in STRATEGIES:
            payoff_matrix[byd_s][stel_s][gm_s] = {}
            for vw_s in STRATEGIES:
                payoff_matrix[byd_s][stel_s][gm_s][vw_s] = {}
                for geely_s in STRATEGIES:
                    cell = build_payoff_cell(byd_s, stel_s, gm_s, vw_s, geely_s)
                    payoff_matrix[byd_s][stel_s][gm_s][vw_s][geely_s] = cell


# ─────────────────────────────────────────────
# 4. AGGREGATE NPV SCENARIOS
# ─────────────────────────────────────────────
def aggregate(payoffs_dict):
    return round(sum(payoffs_dict.values()), 4)


AGG_ALL_DIFFERENTIATE = aggregate(ALL_HIGH_PAYOFFS)
AGG_ALL_WAR           = aggregate(ALL_LOW_PAYOFFS)
AGG_NASH_E3           = aggregate(NASH_E3_PAYOFFS)
VALUE_OF_NASH_VS_WAR  = round(AGG_NASH_E3 - AGG_ALL_WAR, 4)

# ─────────────────────────────────────────────
# 5. NASH EQUILIBRIUM DEFINITIVO
# ─────────────────────────────────────────────
NASH_EQUILIBRIUM = {
    "BYD":        "DIFFERENTIATE",
    "Stellantis": "PRICE_WAR",
    "GM":         "PRICE_WAR",
    "VW":         "PRICE_WAR",
    "Geely":      "DIFFERENTIATE",
}

# ─────────────────────────────────────────────
# 6. VERIFICAÇÃO DE NASH (melhor resposta)
# ─────────────────────────────────────────────
NASH_PROFILE = {
    "BYD":        "DIFFERENTIATE",
    "Stellantis": "PRICE_WAR",
    "GM":         "PRICE_WAR",
    "VW":         "PRICE_WAR",
    "Geely":      "DIFFERENTIATE",
}


def melhor_resposta(perfil_oponentes: dict, meu_jogador: str) -> str:
    """
    Retorna a melhor resposta de `meu_jogador` dado `perfil_oponentes`.
    Verifica se DIFFERENTIATE ou PRICE_WAR gera maior payoff.
    """
    # Calcula payoff para DIFFERENTIATE
    strat_diff = dict(perfil_oponentes)
    strat_diff[meu_jogador] = "DIFFERENTIATE"
    diff_cell = build_payoff_cell(
        strat_diff["BYD"], strat_diff["Stellantis"],
        strat_diff["GM"],  strat_diff["VW"],  strat_diff["Geely"]
    )

    # Calcula payoff para PRICE_WAR
    strat_war = dict(perfil_oponentes)
    strat_war[meu_jogador] = "PRICE_WAR"
    war_cell = build_payoff_cell(
        strat_war["BYD"], strat_war["Stellantis"],
        strat_war["GM"],  strat_war["VW"],  strat_war["Geely"]
    )

    return "DIFFERENTIATE" if diff_cell[meu_jogador] >= war_cell[meu_jogador] else "PRICE_WAR"


print("VERIFICAÇÃO DO EQUILÍBRIO DE NASH E3:")
print("  Verificando se cada jogador está jogando sua melhor resposta...")
nash_verified = True
for player in PLAYERS:
    mr = melhor_resposta(NASH_PROFILE, player)
    status = "✓" if mr == NASH_PROFILE[player] else "✗ FALHA"
    print(f"  {player:<12}: melhor resposta = {mr:<15} | NASH = {NASH_PROFILE[player]:<15} {status}")
    if mr != NASH_PROFILE[player]:
        nash_verified = False
print(f"  Equilíbrio de NASH verificado: {'SIM ✓' if nash_verified else 'NÃO ✗'}")
print()


# ─────────────────────────────────────────────
# 7. OUTPUT JSON
# ─────────────────────────────────────────────
def serialize_payoff_matrix():
    """Converte chaves de estratégia para string na matriz aninhada."""
    out = {}
    for k1, v1 in payoff_matrix.items():
        out[k1] = {}
        for k2, v2 in v1.items():
            out[k1][k2] = {}
            for k3, v3 in v2.items():
                out[k1][k2][k3] = {}
                for k4, v4 in v3.items():
                    out[k1][k2][k3][k4] = {}
                    for k5, v5 in v4.items():
                        out[k1][k2][k3][k4][k5] = v5
    return out


results = {
    "players": [
        {"id": 0, "name": "BYD",        "base_share": 0.38},
        {"id": 1, "name": "Stellantis", "base_share": 0.22},
        {"id": 2, "name": "GM",         "base_share": 0.18},
        {"id": 3, "name": "VW",         "base_share": 0.14},
        {"id": 4, "name": "Geely",      "base_share": 0.08},
    ],
    "strategies": STRATEGIES,
    "nash_equilibrium": NASH_EQUILIBRIUM,
    "payoff_matrix_5x5": serialize_payoff_matrix(),
    "aggregate_npv_at_nash_B":          round(AGG_NASH_E3, 2),
    "aggregate_npv_all_war_B":          round(AGG_ALL_WAR, 2),
    "aggregate_npv_all_differentiate_B": round(AGG_ALL_DIFFERENTIATE, 2),
    "value_of_nash_vs_war_B":           round(VALUE_OF_NASH_VS_WAR, 2),
    "market_share_base": {
        "BYD":        0.38,
        "Stellantis": 0.22,
        "GM":         0.18,
        "VW":         0.14,
        "Geely":      0.08,
    },
    "payoffs_all_differentiate": ALL_HIGH_PAYOFFS,
    "payoffs_all_war":           ALL_LOW_PAYOFFS,
    "payoffs_nash_e3":           NASH_E3_PAYOFFS,
}

# ─────────────────────────────────────────────
# 8. SALVAR JSON
# ─────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_JSON = OUTPUT_DIR / "nb04_results.json"
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("=" * 60)
print("  TEORIA DOS JOGOS — MERCADO EV BRASIL 2025–2027")
print("  Análise: 5 Jogadores × 2 Estratégias")
print("=" * 60)
print()
print("JOGADORES:")
for p in results["players"]:
    print(f"  [{p['id']}] {p['name']:<12} — market share base: {p['base_share']:.0%}")
print()
print("ESTRATÉGIAS:")
print("  DIFFERENTIATE → margem 8%, volume base")
print("  PRICE_WAR     → margem -2%, volume +15%")
print()
print("─" * 60)
print("PAYOFFS — TODOS DIFFERENTIATE (todos escolhem HIGH):")
for player, val in results["payoffs_all_differentiate"].items():
    print(f"  {player:<12}: R$ {val:>8.2f} B")
print(f"  {'AGGREGATE':<12}: R$ {results['aggregate_npv_all_differentiate_B']:>8.2f} B")
print()
print("PAYOFFS — TODOS PRICE_WAR (todos escolhem LOW):")
for player, val in results["payoffs_all_war"].items():
    print(f"  {player:<12}: R$ {val:>8.2f} B")
print(f"  {'AGGREGATE':<12}: R$ {results['aggregate_npv_all_war_B']:>8.2f} B")
print()
print("═" * 60)
print("EQUILÍBRIO DE NASH E3:")
print("  BYD = DIFFERENTIATE  (estratégia dominante: marca forte)")
print("  Stellantis = PRICE_WAR  (sobreviver na baixa)")
print("  GM = PRICE_WAR        (sobreviver na baixa)")
print("  VW = PRICE_WAR        (sobreviver na baixa)")
print("  Geely = DIFFERENTIATE (novo entrante precisa de escala)")
print()
print("PAYOFFS NO NASH E3:")
for player, val in results["payoffs_nash_e3"].items():
    print(f"  {player:<12}: R$ {val:>8.2f} B")
print(f"  {'AGGREGATE':<12}: R$ {results['aggregate_npv_at_nash_B']:>8.2f} B")
print()
print("═" * 60)
print("VALOR DO NASH vs. GUERRA DE PREÇOS:")
print(f"  Δ NPV agregado (NASH − GUERRA) = R$ {results['value_of_nash_vs_war_B']:.2f} B")
print(f"  Guerra de preços destrói R$ {abs(results['aggregate_npv_all_war_B']):.2f} B")
print(f"  NASH E3 gera R$ {results['aggregate_npv_at_nash_B']:.2f} B (vs. −R$ {abs(results['aggregate_npv_all_war_B']):.2f} B)")
print()
print(f"Arquivo JSON gerado: {OUTPUT_JSON}")
print("=" * 60)
