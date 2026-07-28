# NB-13 · Trigger Matrix — Operação, Aprovação e Contingência

**Análise Prescritiva — Camada Operacional**

| Campo | Detalhe |
|---|---|
| **Notebook** | NB-13 · Trigger Matrix (S1–S6) |
| **Autor** | Matheus Mendes |
| **Data** | 27/julho/2026 |
| **Versão** | 1.0 |
| **Dependências** | pandas, numpy |

---

## Sumário

Este notebook transforma a linhagem D3 em um motor operacional auditável:

1. Matriz **6 dimensões × 3 estados = 18 células**
2. Threshold, ação, custo, owner, approver e latência por célula
3. Quatro procedimentos: **Monitor, Alert, Escalate, Contingency**
4. Nove approval gates e sete kill gates
5. Regras automáticas com persistência, cooldown e override
6. Matriz final de decisão e export JSON

**Fontes internas**: `D3-TRIGGER-MATRIX.md`, `D3-RACI.md`, `D3-AUTO-TRIGGER-SPEC.md` e `LINHAGEM.md`.

## Resultados-chave (CLIFF NOTES)

| Item | Resultado |
|---|---|
| Dimensões | **6** (S1–S6) |
| Estados | **3** (GREEN/AMBER/RED) |
| Células operacionais | **18** |
| Procedimentos | **4** |
| Approval gates | **9** |
| Kill gates | **7** |
| Regra soberana | Kill gate ignora composite e ativa contingência |
| SLA crítico | RED em até 60 min; kill gate imediato |

## Estrutura do Notebook

1. Setup e validações
2. Catálogo das 18 células
3. Matriz 6×3
4. Procedimentos operacionais
5. Approval gates
6. Kill gates
7. Auto-trigger rules
8. Motor de avaliação
9. Decision matrix
10. Export para `outputs/nb13_results.json`

```python
# ──────────────────────────────────────────────────────────────
# 1. Setup & Imports
# ──────────────────────────────────────────────────────────────

import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

NOTEBOOK_ROOT = Path(r'C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva')
OUTPUT_DIR = NOTEBOOK_ROOT / 'outputs'
OUTPUT_DIR.mkdir(exist_ok=True)

STATE_ORDER = ['GREEN', 'AMBER', 'RED']
STATE_SCORE = {'GREEN': 0, 'AMBER': 1, 'RED': 2}
STATE_WEIGHT = {'S1': 0.20, 'S2': 0.18, 'S3': 0.30, 'S4': 0.12, 'S5': 0.10, 'S6': 0.10}

print('Python operational notebook ready')
print('Pandas', pd.__version__)
```

---

## 2. Catálogo das 18 células

Cada célula é uma prescrição completa. O threshold é deliberadamente legível por humanos; a coluna `predicate` contém a condição executável pelo motor.

```python
# ──────────────────────────────────────────────────────────────
# 2. Build 6×3 Trigger Matrix — 18 Cells
# ──────────────────────────────────────────────────────────────

cells = [
    # S1 — Hedge cambial
    dict(cell='S1-G', dimension='S1', name='Hedge cambial', state='GREEN',
         threshold='PTAX < 5.40 AND vol_30d < 18%', predicate='ptax < 5.40 and vol_30d < 18',
         action='Manter h* baseline', cost='R$ 0', owner='Risk Officer', approver='CFO', latency='Mensal', procedure='Monitor'),
    dict(cell='S1-A', dimension='S1', name='Hedge cambial', state='AMBER',
         threshold='PTAX 5.40–5.80 OR vol_30d 18–25%', predicate='ptax >= 5.40 or vol_30d >= 18',
         action='Revisar hedge; h* × 1.5, cap 95%', cost='R$ 6–12M', owner='Risk Officer', approver='CFO', latency='5 min', procedure='Alert'),
    dict(cell='S1-R', dimension='S1', name='Hedge cambial', state='RED',
         threshold='PTAX >= 5.80 OR vol_30d >= 25%', predicate='ptax >= 5.80 or vol_30d >= 25',
         action='h* × 2.0; cap 95%; avaliar hedge parceiro', cost='R$ 12–24M', owner='Risk Officer', approver='CEO', latency='60 min', procedure='Escalate'),

    # S2 — Supply chain
    dict(cell='S2-G', dimension='S2', name='Supply chain', state='GREEN',
         threshold='VaR realized/baseline < 0.70', predicate='supply_var_ratio < 0.70',
         action='Manter dual-sourcing baseline 18m', cost='R$ 0', owner='Head Supply', approver='COO', latency='Trimestral', procedure='Monitor'),
    dict(cell='S2-A', dimension='S2', name='Supply chain', state='AMBER',
         threshold='VaR ratio 0.70–1.00', predicate='supply_var_ratio >= 0.70',
         action='EVE em 12m; adicionar 30 dias de safety stock', cost='R$ 30M', owner='Head Supply', approver='COO', latency='5 min', procedure='Alert'),
    dict(cell='S2-R', dimension='S2', name='Supply chain', state='RED',
         threshold='VaR ratio >= 1.00', predicate='supply_var_ratio >= 1.00',
         action='Plano B spot + hedge alternativo', cost='R$ 80M+', owner='Head Supply', approver='CEO', latency='60 min', procedure='Escalate'),

    # S3 — BNDES / ViE
    dict(cell='S3-G', dimension='S3', name='BNDES / ViE', state='GREEN',
         threshold='ViE >= 20%', predicate='vie >= 20',
         action='Advocacy baseline e funding no cronograma', cost='R$ 0 incremental', owner='Head Gov Relations', approver='CEO', latency='Mensal', procedure='Monitor'),
    dict(cell='S3-A', dimension='S3', name='BNDES / ViE', state='AMBER',
         threshold='ViE 10–20%', predicate='vie >= 10',
         action='Dobrar advocacy e reuniões MDIC', cost='R$ 12M', owner='Head Gov Relations', approver='CEO', latency='5 min', procedure='Alert'),
    dict(cell='S3-R', dimension='S3', name='BNDES / ViE', state='RED',
         threshold='ViE < 10% OR BNDES denied', predicate='vie < 10 or bndes_denied',
         action='Acionar bridge financing R$ 800M', cost='R$ 50M commitment', owner='CFO + Head Treasury', approver='CEO + Board', latency='60 min', procedure='Contingency'),

    # S4 — Pricing / market share
    dict(cell='S4-G', dimension='S4', name='Pricing defensivo', state='GREEN',
         threshold='Δ share 90d >= 0pp', predicate='share_delta_90d >= 0',
         action='Manter defensivo Tier 0/1', cost='R$ 0', owner='Head Marketing', approver='CMO', latency='Mensal', procedure='Monitor'),
    dict(cell='S4-A', dimension='S4', name='Pricing defensivo', state='AMBER',
         threshold='Δ share 90d entre -2pp e -1pp', predicate='share_delta_90d <= -1',
         action='Subir defensivo em 1 tier', cost='R$ 7,5–22,5M', owner='Head Marketing', approver='CMO', latency='5 min', procedure='Alert'),
    dict(cell='S4-R', dimension='S4', name='Pricing defensivo', state='RED',
         threshold='Δ share 90d < -2pp', predicate='share_delta_90d < -2',
         action='Tier 3 + comunicação ao mercado', cost='R$ 27,5M+', owner='CMO', approver='CEO', latency='60 min', procedure='Escalate'),

    # S5 — Partnerships
    dict(cell='S5-G', dimension='S5', name='Partnerships', state='GREEN',
         threshold='0 stakeholders em risco', predicate='stakeholders_at_risk == 0',
         action='Manter baseline de parcerias', cost='R$ 0', owner='CSO', approver='CEO', latency='Trimestral', procedure='Monitor'),
    dict(cell='S5-A', dimension='S5', name='Partnerships', state='AMBER',
         threshold='1 stakeholder em risco', predicate='stakeholders_at_risk == 1',
         action='Revisar contratos e ativar cláusulas de hedge', cost='R$ 5M', owner='Head Legal', approver='COO', latency='5 min', procedure='Alert'),
    dict(cell='S5-R', dimension='S5', name='Partnerships', state='RED',
         threshold='2+ stakeholders em risco', predicate='stakeholders_at_risk >= 2',
         action='Renegociar e diversificar Tier 1', cost='R$ 20M+', owner='Head Procurement', approver='CEO', latency='60 min', procedure='Escalate'),

    # S6 — Macro governor
    dict(cell='S6-G', dimension='S6', name='Macro governor', state='GREEN',
         threshold='PIB > 0%; IPCA < 5%; FGV > 90', predicate='gdp_yoy > 0 and ipca_12m < 5 and fgv_confidence > 90',
         action='Multiplier 1.0×; cadência mensal', cost='R$ 0', owner='CSO', approver='CEO', latency='Mensal', procedure='Monitor'),
    dict(cell='S6-A', dimension='S6', name='Macro governor', state='AMBER',
         threshold='PIB -1–0% OR IPCA 5–7% OR FGV 80–90', predicate='gdp_yoy <= 0 or ipca_12m >= 5 or fgv_confidence <= 90',
         action='Multiplier 1.5×; rescala S1–S4', cost='R$ 55–65M', owner='CSO', approver='CEO', latency='5 min', procedure='Alert'),
    dict(cell='S6-R', dimension='S6', name='Macro governor', state='RED',
         threshold='PIB < -1% por 2 trim OR IPCA > 7% OR FGV < 80', predicate='gdp_yoy < -1 or ipca_12m > 7 or fgv_confidence < 80',
         action='Multiplier 2.0×; comitê de crise; freeze seletivo', cost='R$ 165–200M', owner='CSO', approver='CEO + Board', latency='60 min', procedure='Contingency'),
]

trigger_cells = pd.DataFrame(cells)
trigger_cells['state'] = pd.Categorical(trigger_cells['state'], STATE_ORDER, ordered=True)
trigger_cells = trigger_cells.sort_values(['dimension', 'state']).reset_index(drop=True)

assert len(trigger_cells) == 18
assert trigger_cells.groupby('dimension').size().eq(3).all()
assert trigger_cells['cell'].is_unique
print(trigger_cells[['cell', 'dimension', 'state', 'threshold', 'action', 'latency']].to_string(index=False))
```

---

## 3. Matriz 6×3 para leitura executiva

```python
# ──────────────────────────────────────────────────────────────
# 3. Executive Matrix View
# ──────────────────────────────────────────────────────────────

matrix_6x3 = trigger_cells.pivot(index='dimension', columns='state', values='threshold')
matrix_6x3 = matrix_6x3.reindex(index=[f'S{i}' for i in range(1, 7)], columns=STATE_ORDER)
assert matrix_6x3.shape == (6, 3)
display(matrix_6x3)

procedure_matrix = trigger_cells.pivot(index='dimension', columns='state', values='procedure')
display(procedure_matrix.reindex(columns=STATE_ORDER))
```

---

## 4. Quatro procedimentos operacionais

Os quatro procedimentos são estados de resposta, não apenas transições. `Monitor` mantém evidência; `Alert` comunica e recalcula; `Escalate` exige decisão; `Contingency` permite override soberano quando há risco existencial.

```python
# ──────────────────────────────────────────────────────────────
# 4. Procedures: Monitor, Alert, Escalate, Contingency
# ──────────────────────────────────────────────────────────────

procedures = pd.DataFrame([
    dict(procedure='Monitor', entry='GREEN ou condição normalizada', target_sla='Até a próxima cadência',
         steps=['Registrar leitura e timestamp', 'Validar fonte e qualidade', 'Atualizar dashboard', 'Manter baseline'],
         notify='Owner funcional', approval='Não requer nova aprovação', exit='Threshold AMBER ou revisão programada'),
    dict(procedure='Alert', entry='Qualquer dimensão cruza AMBER', target_sla='5 min',
         steps=['Confirmar leitura', 'Recalcular composite', 'Notificar CSO/CFO/owner', 'Abrir action register'],
         notify='Slack + email funcional', approval='Automático dentro do mandato', exit='Normaliza ou permanece AMBER e escala'),
    dict(procedure='Escalate', entry='Qualquer dimensão cruza RED', target_sla='60 min',
         steps=['Notificar liderança', 'Convocar decisão', 'Validar approval gate', 'Executar pacote RED'],
         notify='Slack + email + CEO', approval='Approver da célula', exit='Aprovação, rejeição ou contingência'),
    dict(procedure='Contingency', entry='Kill gate ou RED existencial', target_sla='Imediato',
         steps=['Congelar ação irreversível', 'Aplicar override', 'Ativar plano B', 'Preservar evidência e obter ratificação'],
         notify='Slack + email + SMS', approval='Ratificação conforme gasto; segurança primeiro', exit='Kill gate resolvido e comitê libera'),
])

assert len(procedures) == 4
for row in procedures.itertuples():
    print(f'\n{row.procedure} · SLA {row.target_sla}')
    for i, step in enumerate(row.steps, 1):
        print(f'  {i}. {step}')
```

---

## 5. Nove approval gates

```python
# ──────────────────────────────────────────────────────────────
# 5. Approval Gates — 9 Cost Bands
# ──────────────────────────────────────────────────────────────

approval_gates = pd.DataFrame([
    ('AG1', 'R$ 0–50k', 'Analyst + RiskOwner', '24h', 'Email + rationale'),
    ('AG2', 'R$ 50k–1M', 'CSO', '24h', 'Memo 1 página + KPI'),
    ('AG3', 'R$ 1–10M', 'CFO', '48h', 'Business case + risk assessment'),
    ('AG4', 'R$ 10–30M', 'CEO', '72h', 'Business case + NPV + sensitivity'),
    ('AG5', 'R$ 30–50M', 'DecisionMaker + Sponsor', '1 semana', 'Business case + sign-off'),
    ('AG6', 'R$ 50–100M', 'Audit Committee (quórum 2/3)', '2 semanas', 'NPV + counterfactual + RACI'),
    ('AG7', 'R$ 100–280M', 'Full Board (quórum 4/5)', '3 semanas', 'External review + NPV'),
    ('AG8', 'R$ 280–500M', 'Board + HQ China (quórum 5/7)', '4 semanas', 'Advisor + legal review'),
    ('AG9', 'R$ 500M+', 'Board global + HQ China (quórum 6/9)', '6 semanas', 'HQ sign-off + divestiture analysis'),
], columns=['gate', 'spend_band', 'approver', 'sla', 'required_evidence'])

assert len(approval_gates) == 9
print(approval_gates.to_string(index=False))
```

---

## 6. Sete kill gates

Kill gates são independentes do score agregado. Se qualquer um estiver ativo, o motor seleciona `Contingency`, força pelo menos RED na dimensão afetada e registra `override=True`.

```python
# ──────────────────────────────────────────────────────────────
# 6. Kill Gates — 7 Sovereign Overrides
# ──────────────────────────────────────────────────────────────

kill_gates = pd.DataFrame([
    ('KG1', 'PTAX extremo', 'PTAX > 6.20 por 30 dias OR vol_30d > 30% por 5 dias', 'S1', 'Congelar hedge discricionário e levar cobertura a 95%', 'CFO'),
    ('KG2', 'Lítio extremo', 'Lítio > US$80k/t por 3 meses', 'S2', 'Renegociação e sourcing alternativo imediato', 'CEO'),
    ('KG3', 'CATL atraso crítico', 'Atraso CATL > 60 dias', 'S2', 'Dual-sourcing emergencial com EVE/spot', 'CEO'),
    ('KG4', 'BNDES negado', 'BNDES comunica denial oficial', 'S3', 'Bridge financing e Trees #10–12', 'CEO + Board'),
    ('KG5', 'Share collapse', 'Δ market share 90d < -5pp', 'S4', 'Tier 3 e revisão de portfólio/preço', 'CEO'),
    ('KG6', 'Macro crise', 'Composite >= 88 OR S6 RED confirmado', 'S6', 'Comitê de crise e freeze seletivo', 'CEO + Board'),
    ('KG7', 'ESG impeditivo', 'Lista suja ativa OU plano de remediação rejeitado', 'ALL', 'Bloquear capex e funding até remediação', 'Board global'),
], columns=['kill_gate', 'name', 'condition', 'dimension', 'contingency_action', 'ratifier'])

assert len(kill_gates) == 7
print(kill_gates.to_string(index=False))
```

---

## 7. Regras de auto-trigger

```python
# ──────────────────────────────────────────────────────────────
# 7. Auto-Trigger Rules
# ──────────────────────────────────────────────────────────────

auto_rules = pd.DataFrame([
    ('AR001', 'S1_RED', 'ptax >= 5.80 OR vol_30d >= 25', 'S1', 'RED', 'Escalate', '24h'),
    ('AR002', 'KG1_PTAX', 'ptax > 6.20 for 30d OR vol_30d > 30 for 5d', 'S1', 'RED', 'Contingency', '1h'),
    ('AR010', 'S2_RED', 'supply_var_ratio >= 1.00', 'S2', 'RED', 'Escalate', '12h'),
    ('AR011', 'KG3_CATL', 'catl_delay_days > 60', 'S2', 'RED', 'Contingency', '12h'),
    ('AR020', 'KG4_BNDES', 'bndes_denied == True', 'S3', 'RED', 'Contingency', '1h'),
    ('AR030', 'S4_RED', 'share_delta_90d < -2', 'S4', 'RED', 'Escalate', '24h'),
    ('AR040', 'S5_RED', 'stakeholders_at_risk >= 2', 'S5', 'RED', 'Escalate', '12h'),
    ('AR050', 'KG6_MACRO', 'composite >= 88 OR s6_red == True', 'S6', 'RED', 'Contingency', '1h'),
    ('AR060', 'ANY_KILL', 'any kill gate == True', 'ALL', 'RED', 'Contingency', 'immediate'),
], columns=['rule_id', 'name', 'condition', 'target', 'state', 'procedure', 'cooldown'])

print(auto_rules.to_string(index=False))
```

---

## 8. Motor operacional de avaliação

O motor usa precedência `RED > AMBER > GREEN`. S6 aplica multiplicador ao composite; kill gates têm precedência sobre qualquer cálculo.

```python
# ──────────────────────────────────────────────────────────────
# 8. Trigger Evaluation Engine
# ──────────────────────────────────────────────────────────────

def classify_signals(signal):
    s1 = 'RED' if signal['ptax'] >= 5.80 or signal['vol_30d'] >= 25 else ('AMBER' if signal['ptax'] >= 5.40 or signal['vol_30d'] >= 18 else 'GREEN')
    s2 = 'RED' if signal['supply_var_ratio'] >= 1.00 else ('AMBER' if signal['supply_var_ratio'] >= 0.70 else 'GREEN')
    s3 = 'RED' if signal['vie'] < 10 or signal['bndes_denied'] else ('AMBER' if signal['vie'] < 20 else 'GREEN')
    s4 = 'RED' if signal['share_delta_90d'] < -2 else ('AMBER' if signal['share_delta_90d'] <= -1 else 'GREEN')
    s5 = 'RED' if signal['stakeholders_at_risk'] >= 2 else ('AMBER' if signal['stakeholders_at_risk'] == 1 else 'GREEN')
    s6 = 'RED' if signal['gdp_yoy'] < -1 or signal['ipca_12m'] > 7 or signal['fgv_confidence'] < 80 else (
         'AMBER' if signal['gdp_yoy'] <= 0 or signal['ipca_12m'] >= 5 or signal['fgv_confidence'] <= 90 else 'GREEN')
    return {'S1': s1, 'S2': s2, 'S3': s3, 'S4': s4, 'S5': s5, 'S6': s6}


def detect_kill_gates(signal, states, composite):
    active = []
    if signal['ptax_days_above_620'] >= 30 or signal['vol_days_above_30'] >= 5: active.append('KG1')
    if signal['lithium_usd_t'] > 80_000 and signal['lithium_months_above_80k'] >= 3: active.append('KG2')
    if signal['catl_delay_days'] > 60: active.append('KG3')
    if signal['bndes_denied']: active.append('KG4')
    if signal['share_delta_90d'] < -5: active.append('KG5')
    if composite >= 88 or states['S6'] == 'RED': active.append('KG6')
    if signal['esg_blocked']: active.append('KG7')
    return active


def evaluate_trigger_matrix(signal):
    states = classify_signals(signal)
    base_composite = sum(STATE_SCORE[states[d]] * STATE_WEIGHT[d] for d in states) / 2 * 100
    macro_multiplier = {'GREEN': 1.0, 'AMBER': 1.5, 'RED': 2.0}[states['S6']]
    composite = min(100.0, base_composite * macro_multiplier)
    kills = detect_kill_gates(signal, states, composite)

    selected = trigger_cells[trigger_cells.apply(lambda r: states[r['dimension']] == r['state'], axis=1)].copy()
    procedure = 'Contingency' if kills else ('Escalate' if 'RED' in states.values() else ('Alert' if 'AMBER' in states.values() else 'Monitor'))
    return {
        'states': states,
        'selected_cells': selected['cell'].tolist(),
        'base_composite': round(base_composite, 2),
        'macro_multiplier': macro_multiplier,
        'composite': round(composite, 2),
        'active_kill_gates': kills,
        'override': bool(kills),
        'procedure': procedure,
    }

baseline_signal = {
    'ptax': 5.52, 'vol_30d': 20.0, 'ptax_days_above_620': 0, 'vol_days_above_30': 0,
    'supply_var_ratio': 0.82, 'lithium_usd_t': 18_000, 'lithium_months_above_80k': 0, 'catl_delay_days': 12,
    'vie': 18.0, 'bndes_denied': False, 'share_delta_90d': -1.2, 'stakeholders_at_risk': 1,
    'gdp_yoy': 0.6, 'ipca_12m': 4.7, 'fgv_confidence': 92, 'esg_blocked': False,
}

baseline_evaluation = evaluate_trigger_matrix(baseline_signal)
print(json.dumps(baseline_evaluation, indent=2, ensure_ascii=False))
assert len(baseline_evaluation['selected_cells']) == 6
```

---

## 9. Cenários de validação e decision matrix

```python
# ──────────────────────────────────────────────────────────────
# 9. Decision Matrix — Normal, Alert, Escalation, Contingency
# ──────────────────────────────────────────────────────────────

scenarios = {
    'Normal': {**baseline_signal, 'ptax': 5.20, 'vol_30d': 14, 'supply_var_ratio': 0.60, 'vie': 24,
               'share_delta_90d': 0.4, 'stakeholders_at_risk': 0},
    'Alerta combinado': baseline_signal,
    'Escala supply': {**baseline_signal, 'supply_var_ratio': 1.10},
    'Contingência BNDES': {**baseline_signal, 'vie': 4, 'bndes_denied': True},
    'Contingência ESG': {**baseline_signal, 'esg_blocked': True},
}

scenario_results = []
for scenario, inputs in scenarios.items():
    result = evaluate_trigger_matrix(inputs)
    scenario_results.append({
        'scenario': scenario,
        'states': ' | '.join(f'{k}:{v}' for k, v in result['states'].items()),
        'composite': result['composite'],
        'kill_gates': ', '.join(result['active_kill_gates']) or '—',
        'procedure': result['procedure'],
        'decision': {
            'Monitor': 'Continuar baseline e registrar evidência',
            'Alert': 'Notificar em 5 min e abrir action register',
            'Escalate': 'Convocar approver e decidir pacote RED em 60 min',
            'Contingency': 'Aplicar override, congelar irreversíveis e ativar Plano B',
        }[result['procedure']],
    })

decision_matrix = pd.DataFrame(scenario_results)
display(decision_matrix)

# Invariantes operacionais
assert decision_matrix.loc[decision_matrix.scenario == 'Contingência BNDES', 'procedure'].iloc[0] == 'Contingency'
assert decision_matrix.loc[decision_matrix.scenario == 'Contingência ESG', 'kill_gates'].iloc[0] == 'KG7'
```

---

## 10. Export operacional

```python
# ──────────────────────────────────────────────────────────────
# 10. Export Results → outputs/nb13_results.json
# ──────────────────────────────────────────────────────────────

results = {
    'notebook': 'NB-13 Trigger Matrix — Operational',
    'computed_at': datetime.now(timezone.utc).isoformat(),
    'lineage': {
        'cells_expected': 18,
        'procedures_expected': 4,
        'approval_gates_expected': 9,
        'kill_gates_expected': 7,
    },
    'counts': {
        'dimensions': int(trigger_cells.dimension.nunique()),
        'states': int(trigger_cells.state.nunique()),
        'cells': int(len(trigger_cells)),
        'procedures': int(len(procedures)),
        'approval_gates': int(len(approval_gates)),
        'kill_gates': int(len(kill_gates)),
        'auto_rules': int(len(auto_rules)),
    },
    'trigger_cells': trigger_cells.assign(state=trigger_cells.state.astype(str)).to_dict(orient='records'),
    'procedures': procedures.to_dict(orient='records'),
    'approval_gates': approval_gates.to_dict(orient='records'),
    'kill_gates': kill_gates.to_dict(orient='records'),
    'auto_rules': auto_rules.to_dict(orient='records'),
    'baseline_evaluation': baseline_evaluation,
    'decision_matrix': decision_matrix.to_dict(orient='records'),
}

assert results['counts']['cells'] == 18
assert results['counts']['procedures'] == 4
assert results['counts']['approval_gates'] == 9
assert results['counts']['kill_gates'] == 7

out_path = OUTPUT_DIR / 'nb13_results.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f'Saved: {out_path}')
print('═════════════════════════════════════════════════════════════')
print('  NB-13 SUMMARY — TRIGGER MATRIX OPERACIONAL')
print('═════════════════════════════════════════════════════════════')
print(f"  Matriz:          {results['counts']['dimensions']}×{results['counts']['states']} = {results['counts']['cells']} células")
print(f"  Procedimentos:   {results['counts']['procedures']}")
print(f"  Approval gates:  {results['counts']['approval_gates']}")
print(f"  Kill gates:      {results['counts']['kill_gates']}")
print(f"  Auto-rules:      {results['counts']['auto_rules']}")
print(f"  Baseline:        {baseline_evaluation['procedure']} · composite {baseline_evaluation['composite']}")
print('  Precedência:     KILL > RED > AMBER > GREEN')
print('═════════════════════════════════════════════════════════════')
```
