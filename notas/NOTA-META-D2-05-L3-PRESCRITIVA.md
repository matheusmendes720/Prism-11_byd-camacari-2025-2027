---
slug: notas-meta-d2-l3-prescritiva
title: "Nota-Meta D2 #05 — L3 Análise Prescritiva · Meta-Learning de Matrizes, Triggers e RACI"
ueid: ikigai:nota:d2-meta-l3-prescritiva:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, l3, prescritiva, matrizes-decisao, trigger-matrix, raci, action-register, meta-learning]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre o Layer L3 da base D2 (Análise Prescritiva).
    Cobre as matrizes de decisão S3×S6 (12 cells), trigger matrix (30+ regras),
    RACI 4×25 (17 personas, 9 approval gates, 7 kill gates), action register
    top 25, e risk register top 10. Esta nota é onde o modelo preditivo vira
    playbook operacional.
  _audience: engenheiro-junior, analista-pleno, risk-officer, COO
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md
    - /d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md
    - /d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-TRIGGER-MATRIX.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md
    - /analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md
  _outputs:
    - matriz-s3xs6-12-cells
    - trigger-matrix-30-regras
    - raci-17-personas
    - action-register-25-acoes
  _success_criteria: >-
    leitor entende o salto conceitual L2→L3 (previsão→prescrição), conhece as
    12 cells da matriz S3×S6, e sabe navegar a trigger matrix + RACI + action
    register para qualquer cenário.
---

# Nota-Meta D2 #05 — L3 Análise Prescritiva

> **Quem está falando:** um par sênior-orientador mostrando como o VaR de L2 vira um playbook de ação.
> **O que esta nota faz:** destrincha o Layer 3 (L3) inteiro em meta-aprendizado, com foco em fixar o salto conceitual "previsão → prescrição", a matriz S3×S6, o trigger matrix, o RACI e o action register.
> **Pré-requisito:** ter lido [Nota-Meta D2 #04 — L2 Preditiva](./NOTA-META-D2-04-L2-PREDITIVA.md).
> **Tempo de leitura:** 90-120 min (com exercícios).
> **Fonte canônica:** [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §L3 + 3 docs L3.0-L3.2.

---

## §0. Por que L3 vem depois de L2 (o salto conceitual)

L3 (Análise Prescritiva) é onde o modelo preditivo **vira ação**. A pergunta operacional é: **"dado o VaR/CVaR previsto, qual decisão executar agora?"**

### §0.1 L2 vs L3 — o salto

```
L2 (PREDITIVA)         L3 (PRESCRITIVA)
─────────────────      ─────────────────
"Qual a distribuição   "O que eu faço com
 de perdas esperada?"    essa distribuição?"

Output: VaR = R$ 6,43 bi  →  Output: contratar
       CVaR = R$ 8,04 bi       NDF 6m de 60% do
       σ 6m = 14,19% a.a.      exposure FX + acelerar
       regime Hamilton 38,5%   nacionalização 70% +
       turbulência             renovar advocacy Rota
                               2030 + 5 outras ações
```

**L2 responde:** *"se o mundo se comportar como no passado, a perda tem 5% de chance de passar de R$ 6,43 bi em 6 meses."*

**L3 responde:** *"dado que existe essa chance de 5% (e probabilidades ergódicas de 38,5% de turbulência), prescrevo um conjunto de ações ordenadas por custo, latência e impacto que reduzem o VaR esperado em X%."*

### §0.2 O trade-off central

A pergunta operacional do prescritivo: **"se a probabilidade de crise é 5% (VaR) ou 38,5% (Hamilton), eu espero ou ajo?"**

| Decisão | Custo incorrido | Custo evitado |
|---|---|---|
| **Agir agora** (hedge 60%, contratar NDF) | Custo da hedge (~R$ 30M premium 6m) | Perdas no cenário adverso (R$ 1,5-2,0 bi) |
| **Esperar** (manter hedge 25%) | Custo de oportunidade (perdas se crise chegar) | Custo da hedge (R$ 30M) |

**Regra prática (Kahneman-style):**
- Se o **custo de agir** ≤ 0.1 × **custo do cenário adverso** × **probabilidade condicional**, aja.
- No D2: 30M ≪ 0.1 × 6,43 bi × 0,385 = ~247M. **Age.**

> **Chef's tip:** *"Não contrate hedge porque o modelo preditivo deu 38,5%. Contrate porque o valor esperado da perda evitada (38,5% × R$ 6,43 bi = R$ 2,48 bi) supera 100× o custo da hedge (R$ 30M ÷ R$ 2,48 bi = 1,2%)."* O prescritivo é **contabilidade atuarial**, não bravata.

### §0.3 O que L3 entrega

| Doc | Conteúdo | |
|---|---|---|
| [`L3.0-matrizes-decisao.md`](../../d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md) | Do preditivo ao prescritivo, 4 macro-estados, matriz S3×S6 (12 cells), 4D Risk Map (81 combinações), RACI resumido, action register, 5 gates | 42 KB, 688 linhas |
| [`L3.1-trigger-matrix-auto-trigger.md`](../../d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md) | 30+ triggers (D3 v2.0.1) + 15 novos (D3 v2.1), arquitetura técnica auto-trigger, NPV live layer, hysteresis, timeline real | 52 KB, 983 linhas |
| [`L3.2-raci-action-register.md`](../../d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md) | 17 personas detalhadas, RACI 4×25, approval gates por valor, action register top 25, risk register top 10, decision log audit trail | 52 KB, 832 linhas |

---

## §1. Os 4 macro-estados do L3

O L3 reduz o contínuo preditivo em **4 macro-estados discretos**:

| Macro-estado | Quando | Postura prescritiva |
|---|---|---|
| 🟢 **GREEN** | Composite < 65, sem sinais de stress | Execução base do playbook D2 |
| 🟡 **AMBER** | 65 ≤ Composite < 80, ou 1+ dimensão amarela | Defender hedge, revisar advocacy |
| 🔴 **RED** | Composite ≥ 80, ou 2+ dimensões vermelhas, ou kill switch ativo | Modo crise, comitê permanente |
| ⚫ **KILL** | S7 ESG RED (lista suja, BNDES bloqueado) | Pausar capex, revisar covenants |

**Thresholds originais do composite:**
- Composite < 65 = GREEN (operação normal).
- 65 ≤ Composite < 80 = AMBER (atenção).
- Composite ≥ 80 = RED (ação imediata).

> **Nota sobre renormalização:** os pesos originais somavam 1,15 (bug histórico). D3 v2.0.1 renormalizou para sum=1,00, dividindo cada peso por 1,15. O threshold AMBER ≥ 65 é pós-renormalização.

---

## §2. A matriz S3 × S6 — 12 cells de decisão

A célula fundamental do L3 é a matriz **S3 × S6**:

- **S3 = status regulatório BNDES** (4 cenários: Expansão, Continuidade, RB Parcial, RB Total).
- **S6 = regime macro** (3 status: GREEN, AMBER, RED).

**Total: 4 × 3 = 12 cells, cada uma com composite, hedge ratio, defensivo pricing, e custo.**

| S3 \ S6 | S6 GREEN (1.0×) | S6 AMBER (1.5×) | S6 RED (2.0×) |
|---|---|---|---|
| **Expansão** (ViE 25%) | composite 58, hedge 30%, defensivo Tier 3 catalog-wide | composite 68, hedge 40% | composite 78, hedge 50% |
| **Continuidade** (ViE 18%) | composite 65, hedge 50%, defensivo Tier 2 | composite 78, hedge 60% | composite 88, **modo crise** |
| **RB Parcial** (ViE 10%) | composite 73, hedge 70%, defensivo Tier 1 | composite 85, hedge 80% | composite 95, **modo crise** |
| **RB Total** (ViE 0%) | composite 82, hedge 90%, defensivo Tier 0 | composite 93, hedge 95% | composite 99, **modo crise + plano B** |

**Override S7 (kill switch):** se S7 = RED (lista suja MTE ativa), composite = 95 fixo, hedge 95%, defensivo mínimo — **independentemente de S3 e S6**.

### §2.1 Composite em 4 cenários canônicos

| Cenário | Composite | Modo |
|---|---|---|
| Expansão + GREEN | 58 | Execução limpa |
| Continuidade + AMBER | 78 | Modo tensão |
| RB Parcial + AMBER | 85 | Modo tensão sustentado |
| RB Total + AMBER | 93 | **Modo crise** |
| RB Total + RED | 99 | **Modo crise máximo** |

**Composite ≥ 88 = modo crise:**
- Hedge satura no teto 95% (não cobre VaR sozinho).
- Resposta deve ser **estrutural**: bridge financing R$ 800M, supply plano B, freeze capex não-essencial.
- Defensivo catalog-wide **proibido** em composite ≥ 85 (S3 RB Parcial ou pior).

### §2.2 Os 4 macro-padrões

O L3 identifica **3 padrões materialmente distintos** que se aplicam aos 12 cells:

| Padrão | Cells | Composite | Latência | Custo típico |
|---|---|---|---|---|
| **Execução limpa** | Expansão+GREEN/AMBER, Continuidade+GREEN | 58-68 | Semanal | Custo marginal |
| **Modo tensão** | Continuidade+AMBER, RB Parcial+GREEN/AMBER | 73-85 | 60 min se RED, semanal se AMBER | R$ 25-95M |
| **Modo crise** | RB Parcial+RED, RB Total+qualquer | ≥88 | 60 min, comitê CEO+Board | R$ 150-400M |

---

## §3. O Trigger Matrix — sistema nervoso do framework

A pergunta operacional: **"como eu sei se o cenário mudou?"**

Resposta: **triggers** automáticos que detectam mudanças e disparam ações.

### §3.1 Os 5 sinais base (sempre ativos)

| Sessão | 🟢 GREEN | 🟡 AMBER | 🔴 RED |
|---|---|---|---|
| S1 Câmbio (PTAX) | [4.80, 5.30] | [4.50, 4.80) ou (5.30, 5.50] | < 4.50 ou > 5.50 |
| S1 Câmbio (vol) | < 13% | 13-18% | > 18% |
| S2 Supply (HHI) | < 3.500 | 3.500-4.500 | > 4.500 |
| S3 BNDES | Rota 2030 + BNDES aprovados | BNDES pendente | Rollback parcial/total |
| S4 Competitivo (BYD share) | > 32% | 28-32% | < 28% |
| S6 Macro | PIB > 0, IPCA < 5% | PIB próximo 0, IPCA 5-6.5% | PIB < 0, IPCA > 6.5% |

### §3.2 Os 30+ triggers D3 v2.0.1

O [`L3.1-trigger-matrix-auto-trigger.md`](../../d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md) cataloga 30+ triggers. Aqui estão os **10 mais importantes**:

| Trigger | Condição | Resposta | Latência |
|---|---|---|---|
| **T-1** | PTAX > R$ 5,40 por 5 dias úteis | Ativar hedge extra (+10pp) | 24h |
| **T-2** | PTAX > R$ 5,50 por 3 dias | Subir hedge para 75% | 5 min |
| **T-3** | lítio > US$ 30k/t | Plano B supply | 24h |
| **T-4** | CATL outage confirmado | Plano B fornecedores | 24h |
| **T-5** | BNDES atrasar > 30 dias | Ativar bridge financing R$ 800M | 5 dias |
| **T-6** | PIB mensal < 0 por 2 tri | Modo tensão, freeze capex | 30 dias |
| **T-7** | BYD share < 28% | Defensivo Tier 1 | 60 dias |
| **T-8** | Vol 30d > 22% | Subir hedge para 90% | 24h |
| **T-9** | IPCA 12m > 6,5% | Replanejar volume 2027 | 90 dias |
| **T-10** | Lista suja MTE | **Kill switch S7** | 24h |

### §3.3 Os 15 novos triggers (D3 v2.1)

| Trigger | Tipo | Condição | Latência |
|---|---|---|---|
| **T-MV1** | 4-shock | FX > 6.2 AND Supply RED AND Tariff > 30% AND S7 RED simultâneos | 5 min |
| **T-MV2** | FX-Supply tail | FX > 6.0 AND S2 RED por > 20 dias consecutivos | 30 min |
| **T-MV3** | Tariff jump | Tariff SKD/CKD salta > 10pp em < 30 dias (Camex emergency) | 48h |
| **T-MV4** | CVaR breach | CVaR 95% realizado > R$ 10,14 bi em qualquer quarter | 24h |
| **T-MV5** | Upside capture | BRL < 5.0 AND Tariff exemption renovada AND S7 AMBER+ | 72h |
| T-NPV-1 | NPV critical | NPV marginal < 0 por 2 meses consecutivos | 60 dias |
| T-S7-2 | ESG critical | MSCI RepRisk BYD sobe > 20 pontos em 1 mês | 30 dias |
| T-S8-1 | Ramp critical | SKD/CKD atrasa > 3 meses vs target | 60 dias |
| T-S11-1 | Competition | Stellantis lança veículo < R$ 100k no BR | 60 dias |
| T-S7-3 | ESG kill | MPT autua BYD por trabalho análogo a escravo | 24h |
| ... | ... | ... | ... |

### §3.4 Latência de resposta

| Transição | Latência alvo | Quem decide | Procedimento |
|---|---|---|---|
| **GREEN → AMBER** | **5 min** | CSO + CFO | Revisão automática do trigger matrix, atualização de tiers S1-S4 |
| **AMBER → RED** | **60 min** | CSO + CFO + CEO + Head Supply | Comitê de crise; aprovação de bridge financing / plano B supply |
| **RED → AMBER** | **24h** | CSO + CFO | Desmobilização ordenada de instrumentos de stress; freeze de novas despesas |
| **AMBER → GREEN** | **72h** | CSO | Recalibração de baseline; corte de advocacy expandido; hedge re-otimizado |
| **S7 RED (kill switch)** | **24h** | CEO + Conselho | Kill switch protocol: pausar capex, revisar covenants, engajar MPT/MTE |

> **Princípio crítico:** a **latência importa mais que a decisão em si**. Se você decide hedge em 5 min mas a execução leva 5 dias, a decisão foi inútil. Por isso o D3 define latência alvo explícita para cada transição.

---

## §4. O RACI — quem decide o quê

A pergunta operacional: **"quem é o dono? quem aprova? quem é informado?"**

### §4.1 Os 17 personas (D3 v2.0.1)

| Persona | Função | Nível decisão |
|---|---|---|
| **CEO** | Decisor final | Estratégico |
| **CFO** | Tesouraria + funding | R$ < 50M |
| **COO** | Operações + supply chain | R$ < 100M |
| **CSO** | Estratégia + framework | R$ < 30M |
| **CRO** | Risco + VaR/CVaR | R$ < 30M |
| **Head de Sup. Chain** | Fornecedores + dual-sourcing | R$ < 80M |
| **Head de Tesouraria** | Hedge cambial | R$ < 50M |
| **Head de IR** | BNDES + advocacy | R$ < 12M |
| **Head Comercial** | Pricing defensivo | R$ < 320M/ano |
| **Risk Officer** | Triggers + matriz | R$ < 5M |
| **Head de Marketing** | Pricing + comunicação | R$ < 5M |
| **Head Jurídico** | Contratos + covenants | R$ < 5M |
| **Head de Procurement** | Contratos fornecedores | R$ < 30M |
| **Head de Strategy** | Análise competitiva | R$ < 2M |
| **Head de Comms** | Comunicação externa | R$ < 5M |
| **Head Gov Relations** | MPT/MTE/BNDES | R$ < 12M |
| **Conselho** | Aprovação de > R$ 280M | Estratégico |

### §4.2 RACI por prescrição

| Prescrição | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|---|---|---|---|---|
| **Hedge FX (S1)** | Risk Officer | CFO | CSO, Head Treasury | CEO, Conselho |
| **Dual-sourcing (S2)** | Head Supply Chain | COO | CSO, Procurement | CFO, Conselho |
| **Advocacy BNDES (S3)** | Head Gov Relations | CEO | CFO, CSO | Conselho, Board global |
| **Defensivo pricing (S4)** | Head Marketing | CMO | CFO, CSO, Sales | Conselho |
| **Kill switch S7** | Head Gov Relations + CSO | CEO | CFO, Head Comms, Legal | Conselho, MTE |
| **Trigger S6** | CSO | CEO | CFO, COO, Heads S1-S5 | Conselho, Board global |
| **Bridge financing** | CFO | CEO | CSO, Head Treasury, Banco | Board global |

### §4.3 Approval Gates por valor

| Faixa de valor | Aprovador | Latência alvo |
|---|---|---|
| < R$ 5M | Risk Officer | Imediato |
| R$ 5M – R$ 30M | CSO + CFO | 24h |
| R$ 30M – R$ 100M | CEO | 72h |
| R$ 100M – R$ 280M | Conselho local | 7 dias |
| > R$ 280M | Board global BYD | 30 dias |

---

## §5. O Action Register — top 25 ações executáveis

O [`L3.2-raci-action-register.md`](../../d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md) lista **25 ações** (D3 v2.0.1) com owner, custo, deadline, KPI. Aqui está o **top 10** ordenado por criticidade:

| # | Ação | Owner | Custo | Deadline | KPI |
|---|---|---|---|---|---|
| **AG-001** | Resolver lista suja MTE (S7) | CFO + Head Gov Relations | R$ 25M | 30/set/2026 | S7 AMBER 30d |
| **AG-002** | Acelerar nacionalização 70% | COO + Head Supply | R$ 280M | 31/out/2027 | FX exposure 90% → 15% |
| **AG-003** | Implementar hedge FX 95% | Risk Officer + Head Treasury | R$ 30M | 31/out/2026 | hedge ≥ 90% exposure |
| **AG-004** | Renovar advocacy Rota 2030 | Head Gov Relations | R$ 12M | 31/dez/2026 | Aprovação congressional |
| **AG-005** | Contratar 4 contrapartes hedge | Head Treasury | R$ 50k dev | 31/ago/2026 | BTG, Itaú, Bradesco, Santander |
| **AG-006** | Plano B fornecedores (EVE + Gotion) | Head Supply | R$ 30M | 30/jun/2027 | 25% supply não-CATL |
| **AG-007** | Bridge financing R$ 800M standby | CFO + Head Treasury | R$ 50M commitment | 30/nov/2026 | Drawable em 30 dias |
| **AG-008** | Implementar auto-trigger S6 → S1-S4 | Head Data + CSO | R$ 800k | 31/dez/2026 | Latência < 60 min AMBER→RED |
| **AG-009** | Dashboard executivo (4 telas) | Head Data | R$ 600k | 31/dez/2026 | composite, signals, actions, learning |
| **AG-010** | Workshop Conselho (2h) | CSO + CEO | R$ 100k | 30/set/2026 | Validação D3 v2.0.1 |

### §5.1 Os 4 gates de aprovação

| Gate | Threshold | Aprovador |
|---|---|---|
| **G1** | < R$ 5M | Risk Officer (24h) |
| **G2** | R$ 5M – R$ 30M | CSO + CFO (24h) |
| **G3** | R$ 30M – R$ 100M | CEO (72h) |
| **G4** | R$ 100M – R$ 280M | Conselho local (7 dias) |
| **G5** | > R$ 280M | Board global (30 dias) |

### §5.2 Os 7 kill gates (parada de emergência)

| Gate | Condição | Ação |
|---|---|---|
| **K1** | S7 = RED (lista suja) | Pausar capex novo, freeze despesas |
| **K2** | 4-shock simultâneo (T-MV1) | Composite 95 fixo, freeze all, bridge R$ 800M |
| **K3** | CVaR breach > R$ 10,14 bi | Comitê de crise 60 min |
| **K4** | BNDES funding bloqueado > 90 dias | Plano B financiamento ativado |
| **K5** | CATL outage > 30 dias | Plano B fornecedores ativado |
| **K6** | PTAX > R$ 6,20 por 5 dias | Hedge 95% saturado, bridge standby |
| **K7** | Lista suja 2ª autuação | Reverter / reestruturar / hibernar |

---

## §6. As 5 armadilhas clássicas do L3

### §6.1 Tratar "dispar" como "executar"

**Decidir ≠ executar.** L3 define latência alvo explícita. Se a decisão leva 60 min mas a execução leva 5 dias, é tarde demais. Sempre separe "decisão registrada" de "ação executada".

### §6.2 Achar que macro prescrição é óbvia

PIB mensal < 0 por 2 trimestres é um sinal. Mas o que fazer? Reduzir capex? Congelar contratação? Acelerar hedge? O L3 explicita — macro é o governor, mas a resposta é multivariada.

### §6.3 Esquecer que "kill switch" sobrepõe

S7 ESG RED sobrepõe TUDO: composite fixo em 95, BNDES funding bloqueado, capex novo em pausa. **Não tente prescrever para ESG RED — apenas ative o protocolo de kill switch.**

### §6.4 Misturar "approval gate" com "kill gate"

Approval gate = autorização para gastar. Kill gate = parada de emergência. São **opostos**. Confundir os dois é receita para desastre.

### §6.5 Esquecer o ciclo de learning

L3 fecha o ciclo com **post-mortem trimestral**: comparar previsto vs realizado, recalibrar elasticidades, atualizar thresholds. Sem isso, o framework vira "dashboard bonito que ninguém acredita".

---

## §7. Quiz de auto-avaliação L3

- [ ] Sei dizer o **trade-off central do prescritivo** (custo de agir vs custo de esperar).
- [ ] Sei citar **4 macro-estados** (GREEN/AMBER/RED/KILL) com thresholds.
- [ ] Sei mapear **12 cells da matriz S3 × S6**.
- [ ] Sei citar **3 dos 10 triggers principais** com condição e latência.
- [ ] Sei o que é o **kill switch S7** e quando ativa.
- [ ] Sei o que é **RACI** e quantas personas (17).
- [ ] Sei os **4 approval gates** por valor (R$ < 5M, 5-30M, 30-100M, 100-280M).
- [ ] Sei o que são **kill gates** vs **approval gates** (opostos).
- [ ] Sei citar **3 ações críticas 90d** (AG-001, AG-002, AG-003).
- [ ] Sei a **latência alvo** para AMBER→RED (60 min).

Se 8/10+: pronto para L4 (decisão executiva).

---

## §8. Exercícios práticos (do 99-LAB-EXERCISES)

### §8.1 Exercício 9 — Construa sua própria matriz 4×3

```python
# Monte uma matriz de decisão simplificada
matriz = {
    'GREEN': {'Expansão': 58, 'Continuidade': 65, 'RB_Parcial': 73, 'RB_Total': 82},
    'AMBER': {'Expansão': 68, 'Continuidade': 78, 'RB_Parcial': 85, 'RB_Total': 93},
    'RED':   {'Expansão': 78, 'Continuidade': 88, 'RB_Parcial': 95, 'RB_Total': 99}
}
import pandas as pd
df = pd.DataFrame(matriz)
print(df)

# Pergunta: quais cells entram em "modo crise" (composite ≥ 88)?
```

### §8.2 Exercício 10 — Desenhe 5 triggers com thresholds

```python
# Defina 5 triggers com thresholds explícitos
triggers = [
    {'id': 'T-1', 'condicao': 'PTAX > 5.40', 'janela': '5 dias úteis', 'resposta': '+10pp hedge', 'latencia': '24h'},
    {'id': 'T-2', 'condicao': 'lítio > 30k/t', 'janela': 'spot', 'resposta': 'plano B supply', 'latencia': '24h'},
    {'id': 'T-3', 'condicao': 'BNDES atrasar > 30d', 'janela': 'mensal', 'resposta': 'bridge R$ 800M', 'latencia': '5 dias'},
    {'id': 'T-4', 'condicao': 'PIB mensal < 0', 'janela': '2 trimestres', 'resposta': 'modo tensão', 'latencia': '30 dias'},
    {'id': 'T-5', 'condicao': 'lista suja MTE', 'janela': 'evento', 'resposta': 'kill switch S7', 'latencia': '24h'},
]
for t in triggers:
    print(f"{t['id']}: SE {t['condicao']} POR {t['janela']} → {t['resposta']} (latência {t['latencia']})")
```

---

## §9. Mapa de saída — onde ir depois de L3

Quando terminar L3, escolha sua trilha:

### §9.1 Se você quer entender **comunicação executiva**

→ [**Nota-Meta D2 #06 — L4-L6 + LAB**](./NOTA-META-D2-06-L4-L6-LAB.md) (L4 comunicação Conselho, L5 calibração, L6 risco cauda, LAB).

### §9.2 Se você quer **exercícios avançados**

→ [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md).

---

## §10. Recursos auxiliares para L3

### §10.1 Docs canônicos

- [`L3.0-matrizes-decisao.md`](../../d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md) — Do preditivo ao prescritivo (42 KB, 688 linhas).
- [`L3.1-trigger-matrix-auto-trigger.md`](../../d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md) — 30+ triggers + auto-trigger (52 KB, 983 linhas).
- [`L3.2-raci-action-register.md`](../../d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md) — RACI 4×25 (52 KB, 832 linhas).

### §10.2 Docs relacionados no D3

- [`D3-TRIGGER-MATRIX.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-TRIGGER-MATRIX.md) — 18 cells S1-S6 (17 KB).
- [`D3-RACI.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RACI.md) — RACI 17 personas, 8 approval gates (28 KB).
- [`D3-ACTION-PLAN.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-ACTION-PLAN.md) — 31 ações (33 KB).
- [`D3-RISK-REGISTER.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-RISK-REGISTER.md) — Risk register (57 KB).
- [`D3-AUTO-TRIGGER-SPEC.md`](../../analise-prescritiva/reports/decision-framework/5_operational/D3-AUTO-TRIGGER-SPEC.md) — auto-trigger S6 → S1/S2/S3/S4 (22 KB).

### §10.3 Notebooks para L3

- [`NB-10-decision-trees.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-10-decision-trees/nb-10-decision-trees.ipynb) — decision trees.
- [`NB-13-trigger-matrix.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-13-trigger-matrix/nb-13-trigger-matrix.ipynb) — trigger matrix.
- [`NB-14-npv-layer.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-14-npv-layer/nb-14-npv-layer.ipynb) — NPV layer.

---

## §11. Takeaways em 5 bullets (para fixar)

1. **O salto conceitual L2→L3 é "previsão → prescrição".** VaR diz "qual a perda esperada". L3 diz "o que fazer".

2. **Os 4 macro-estados** (GREEN/AMBER/RED/KILL) reduzem o contínuo em decisões discretas. Threshold AMBER ≥ 65, RED ≥ 80.

3. **Matriz S3 × S6 = 12 cells** com composite, hedge ratio, e custo. Composite ≥ 88 = modo crise.

4. **30+ triggers** detectam mudança automaticamente. Latência alvo: 5 min AMBER, 60 min RED.

5. **17 personas, 4 approval gates, 7 kill gates.** Kill switch S7 sobrepõe tudo. Latência > decisão.

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado do Layer L3.*
*Próxima: [Nota-Meta D2 #06 — L4-L6 + LAB + Transversais](./NOTA-META-D2-06-L4-L6-LAB.md).*