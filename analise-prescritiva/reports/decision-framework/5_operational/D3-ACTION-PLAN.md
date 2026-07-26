# D3-ACTION-PLAN — Plano de Acao Operacional
## Framework D3 v2.0 — Polo BYD Camaçari 2025–2027

**Documento**: D3-ACTION-PLAN.md
**Versão**: v1.0
**Data**: 21/jul/2026
**Status**: Plano de ação executivo — para aprovação do Conselho
**Base**: D3-MAIN.html v2.0 (Action Register 39 ações), D3-RACI.md v0.6, D3-GAME-THEORY.md (C2), D3-MULTIVARIATE-SENSITIVITY.md (C3)

---

## PARTE 1: TOP 10 AÇÕES CRÍTICAS

> **Metodologia de priorização**: As 10 ações abaixo foram selecionadas com base em 4 critérios combinados:
> 1. **Impacto no VaR** (C3 Multivariate Sensitivity — Tariff 29%, FX 22.5%, Supply 18%)
> 2. **Validação C1** (S7 CORRETO ~80%; S10 INVALIDADO; S2 INVALIDADO; S11 INVALIDADO)
> 3. **Decisão D3** (Nash Differentiate — C2 Game Theory)
> 4. **Bloqueio estrutural** (S7 kill switch impede R$ 800M+ BNDES se ativo)

### AG-001 — Resolver Lista Suja S7 (Kill Switch)
**Decisão associada**: MITIGAR → objetivo ABORTAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-001 |
| **Ação** | Resolver Lista Suja MTE — desbloqueio do kill switch S7 |
| **Dimensão** | S7 (ESG Kill Switch) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | MITIGAR (objetivo: ABORTAR o kill switch) |
| **Owner (RACI)** | Head Gov Relations (R) + CEO (A) + Monitor (CSO) |
| **Deadline** | 90 dias — 19/out/2026 (Q3 2026) |
| **Recursos** | R$ 2M (engajamento MPT/MTE) + R$ 20M (plano remediação) + R$ 3M (auditoria ESG) |
| **Dependências** | Nenhuma — ação independentes |
| **KPI de sucesso** | S7 = AMBER por 30 dias consecutivos AND fora da lista suja MTE AND auditoria ESG aprovada |
| **Status atual** | EM CURSO (AG-036 em progresso) |
| **Contingência** | Se MTE não aceitar plano em 90d: acionar decisão estratégica (AG-037) — reverter / reestruturar / hibernar. Avaliar bridge financing privado sem BNDES. |

**Detalhamento**: A Lista Suja MTE está ativa desde 07/abr/2026. Este é o bloqueador central: enquanto S7 = RED, BNDES funding (R$ 800M+) permanece inacessível e o capex novo está em pausa forçada. Ações AG-033, AG-034, AG-035, AG-036, AG-037 são todas subordinadas a este objetivo. C1 valida que S7 era o único dimension que D2 v0.6 acertou com ~80% de acurácia — o kill switch é real ebinário.

---

### AG-002 — Implementar Hedge FX 95% (Proteção NPV)
**Decisão associada**: CONTINUAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-002 |
| **Ação** | Implementar hedge cambial em 95% do exposure FX elegível |
| **Dimensão** | S1 (FX / Hedge Cambial) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR — hedge é a primeira linha de defesa |
| **Owner (RACI)** | Risk Officer (R) + CFO (A) + Head Treasury (Executor) |
| **Deadline** | 31/ago/2026 (Q3 2026) — baseline h* calculado; 31/out/2026 — 4 counterparties contratadas |
| **Recursos** | R$ 30M premium 6 meses + R$ 50k dev (constraint VaR) |
| **Dependências** | AG-001 (S7 kill switch resolve) — BNDES precisa estar acessível para constraint VaR |
| **KPI de sucesso** | Hedge coverage >= 90% do exposure FX elegível; VaR residual <= 20% da margem; 4 counterparties (BTG/Itaú/Bradesco/Santander) contratadas |
| **Status atual** | PENDENTE |
| **Contingência** | Se contraparte não confirmar: hedge com 2 counterparties (concentration risk documentado); se S7 ainda RED: hedge privado via trading desk sem BNDES backing. Recalibrar h* para 30% (Expansão) a 90.6% (Rollback Total) conforme S3. |

**Detalhamento**: S1 é o segundo maior contributor do VaR (22.5%, R$ 1.85 bi). O acoplamento S1↔S3 define h* = 30–91% conforme o cenário S3. Com S7 RED (kill switch ativo), o hedge deve saturação em 90.6% automaticamente. Stress test conjunto FX+supply (AG-004) com 12 combinações deve ser executado em paralelo.

---

### AG-003 — Acelerar Nacionalização para 70% (Redução FX Exposure)
**Decisão associada**: CONTINUAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-003 |
| **Ação** | Acelerar nacionalização SKD→CKD→Nacional para 70% até Q4 2027 |
| **Dimensão** | S8 (Production Ramp) + S1 (FX Exposure) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR — reduz exposure FX de 60% (SKD full) para 15% (Nacional 70%) |
| **Owner (RACI)** | Head Supply (R) + COO (A) + Head Gov Relations (C para nacionalização) |
| **Deadline** | Meta intermediária: 45% nacionalização em 31/dez/2026; Meta final: 70% em 31/out/2027 |
| **Recursos** | R$ 280M (EVE qualification) + R$ 30M (safety stock) + capex nacionalização |
| **Dependências** | AG-001 (S7 resolve para destravar BNDES); AG-007 (EVE partnership formalizada) |
| **KPI de sucesso** | % Nacionalização: SKD→CKD transição (mid-2026) 25% → CKD parcial (end-2026) 45% → Nacional (2027) 70%; Exposure FX: 60% → 45% → 30% → 15%; ViE Efetivo: 0.65 → 0.72 → 0.80 → 0.88 |
| **Status atual** | EM CURSO (S8 score AMBER; VaR FX 55% maior que D2 estimou) |
| **Contingência** | Se EVE não conseguir alocar capacidade prioritária: ativar Plano B spot purchasing (AG-010); se nacionalização atrasar: renegociar meta BNDES (S3 ViE) com novo cronograma. Hedge adicional AG-002 compensa exposure residual. |

**Detalhamento**: O acoplamento S8↔S1 mostra que o exposure FX não é constante — cai de 90% (SKD 95%) para 45% (CKD 40%) conforme o ramp. VaR 2025 é 55% maior que D2 estimou porque o modelo v0.6 usava 60% de exposure default. Nacionalização a 70% reduz o VaR de S8 de R$ 0.82 bi para ~R$ 0.35 bi.

---

### AG-004 — Implementar Diferenciação de Produto (Nash Equilibrium)
**Decisão associada**: CONTINUAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-004 |
| **Ação** | Implementar diferenciação de produto (tier system + game theory layer) |
| **Dimensão** | S4 (Pricing / Defensivo) + S11 (Competition) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR — Nash Differentiate equilibrium: (Differentiate, Differentiate) |
| **Owner (RACI)** | Head Marketing + CMO (Executor, S4) + CSO + Head Strategy (Game Theory) |
| **Deadline** | Tier system: 30/set/2026; Game theory layer: 31/dez/2026; AG-DIFF-2 (tech): 30/jun/2027 |
| **Recursos** | R$ 5M dev (tier system) + R$ 1.5M dev (game theory) + R$ 200M (AG-DIFF-2: tecnologia) |
| **Dependências** | AG-001 (S7 resolve para capex de diferenciação); análise competitiva trimestral AG-019 |
| **KPI de sucesso** | Tier system 0/1/2/3 implementado com auto-scaling; Game theory layer calibrado para Nash (Differentiate, Differentiate); AG-DIFF-2: Blade Battery, DM-p/p-i, smart driving stack como percepção de premium; Market share BYD >= 40% com price premium preservado |
| **Status atual** | PENDENTE (tier system); PLANEJADO (game theory) |
| **Contingência** | Se rival iniciar price war: ativar AG-DIFF-3 (War of Attrition Hold — não responder); se defensivo targeted for insuficiente: Tier 3 (R$ 22.5M) para 5k unidades em mercados críticos (SP/RJ). NÃO implementar defensivo catalog-wide (ROI -67% conforme D2 audit). |

**Detalhamento**: C1 INVALIDOU S4 v0.6 (55% accuracy) porque usava S3 como proxy — S4 é condicionado a S11, não a S3. O equilibrium de Nash é (Differentiate, Differentiate): todos os players diferenciam, nenhum entra em guerra de preços. AG-DIFF-2 (tecnologia) cria moat estrutural: Blade Battery, DM-p/p-i, smart driving. AG-DIFF-3: não iniciar guerra de preços contra Stellantis/Geely — aceitar share sacrifice temporário.

---

### AG-005 — Criar Reserva de Lítio (Hedge Commodity)
**Decisão associada**: CONTINUAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-005 |
| **Ação** | Criar reserva estratégica de lítio + contratos LP CATL 70% locked |
| **Dimensão** | S2 (Supply Chain) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR — lítio é o maior risco de supply (VaR R$ 1.48 bi, 18%) |
| **Owner (RACI)** | Head Procurement (R) + COO (A) + Head Supply (Executor) |
| **Deadline** | CATL LP 70%: 31/ago/2026 (em negociação); EVE qualification: 31/mar/2027; Safety stock +30d: 31/dez/2026 (se S6 AMBER+) |
| **Recursos** | R$ 450M (CATL LP 70%) + R$ 280M (EVE qualification) + R$ 30M (safety stock) + R$ 80M (Plano B spot) |
| **Dependências** | AG-001 (S7 resolve para parcerias críticas); AG-003 (nacionalização libera capacidade EVE) |
| **KPI de sucesso** | CATL LP 70% locked em preço fixo; EVE qualificado como Tier 1 alternativo; 3 fornecedores Tier 1 alternativos mapeados; Safety stock +30 dias ativado se S6 = AMBER+ |
| **Status atual** | EM CURSO (AG-007 CATL LP 70% in-progress) |
| **Contingência** | Se CATL LP falhar: ativar Plano B spot (AG-010, R$ 80M); se EVE qualification atrasar: renegociar take-or-pay com CATL; se lítio > US$ 80k/t sustentado 3 meses: kill switch supply (head supply + CFO decidem freeze spot buying). |

**Detalhamento**: C1 INVALIDOU S2 v0.6 porque subestimava EVE partnership. LFP verticalization (AG-DIFF-1) muda a modelagem — supply chain de batteries é agora estratégico. Cholesky FX-Supply rho = 0.4 (forte correlação positiva): desvalorização cambial coincide com disrupções de supply, amplificando o risco conjunto. EVE como fornecedor alternativo reduz dependência de CATL e melhora ViE.

---

### AG-006 — Renegociar Tariff Quota com Camex
**Decisão associada**: MITIGAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-006 |
| **Ação** | Renegociar quota tariff SKD/CKD com Camex/Gecex; advocacy para exemption |
| **Dimensão** | S10 (Tariff Policy) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | MITIGAR — S10 INVALIDADO (C1), weight recalibrado 0.05→0.10, é #1 VaR contributor (29%) |
| **Owner (RACI)** | Head Gov Relations (R) + CEO (A) + CFO (C para margin compression) |
| **Deadline** | Advocacy inicial: 31/ago/2026; Renegociação formal: 31/out/2026; Decisão Camex: 31/dez/2026 |
| **Recursos** | R$ 12M advocacy baseline + R$ 12M expandido (se AMBER+); custo de oportunidade de price reduction |
| **Dependências** | AG-001 (S7 resolve para credibility institucional); AG-004 (diferenciação reduz dependência de preço) |
| **KPI de sucesso** | Tariff efetiva mantida em <= 35% OU exemption concedida para CKD nacional; S10 score <= AMBER; VaR contribution de S10 reduzido de R$ 2.38 bi para <= R$ 1.5 bi |
| **Status atual** | PENDENTE |
| **Contingência** | Se Camex manter 35%: ativar AG-003 (nacionalização acelerada) para reduzir exposure tariff; se tariff > 40%: T-MV1 trigger (4-shock stress) ativa modo crise — freeze all, CEO + Conselho 24h, bridge R$ 800M. Revisar pricing (Song Plus importado: R$ 114k vs CKD R$ 104.5k). |

**Detalhamento**: S10 INVALIDADO por C1 — v0.6 subestimava impacto tarifário por fator 3x. Tariff é #1 VaR contributor (29%, R$ 2.38 bi). Tariff schedule: 2025 +20% → 2026 H1 +35% (imposed) → 2026 H2 +35% + retaliação → 2027 +20–35% (depending on negotiation). Duplo shock FX+Tariff (acoplamento S10↔S1) é multiplicativo, não aditivo: BRL 6.0 + tariff 35% = VaR 6m P95 sobe para R$ 4.5–5.0 bi (+110% vs baseline).

---

### AG-007 — Definir Resposta Competitiva (vs Stellantis)
**Decisão associada**: CONTINUAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-007 |
| **Ação** | Definir resposta competitiva via Nash Differentiate; monitorar capacidade agregada |
| **Dimensão** | S11 (Competition) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR — C1 INVALIDOU S11 v0.6 (50% accuracy); Nash equilibrium é (Differentiate, Differentiate) |
| **Owner (RACI)** | CSO + Head Strategy (R) + CEO (A) + Advisor (consultores game theory) |
| **Deadline** | Análise competitiva trimestral: 30/set/2026 (primeira); Game theory layer AG-020: 31/dez/2026; AG-DIFF-3 (war of attrition): permanente |
| **Recursos** | R$ 2M/ano (análise competitiva) + R$ 1.5M dev (game theory) + R$ 200M (AG-DIFF-2 tech) |
| **Dependências** | AG-001 (S7 resolve para credibilidade); AG-004 (tier system + game theory) |
| **KPI de sucesso** | BYD share >= 40% do EV market; Stellantis/VW/Geely em modo Differentiate (não Price War); AG-DIFF-3: war of attrition hold mantido; Alerta de price war iminente: 0 eventos no trimestre |
| **Status atual** | PENDENTE (S11 INVALIDADO — game theory layer não implementado) |
| **Contingência** | Se Stellantis/Geely iniciar price war: NÃO responder (AG-DIFF-3); aceitar share sacrifice temporário de 5-8pp por 6-12 meses; focar em diferenciação tecnológica (AG-DIFF-2) para recuperar margin. Se price war atingir margin < 10%: ativar tier system Tier 3 (R$ 22.5M). |

**Detalhamento**: C1 INVALIDOU S11 v0.6 porque modelava como Price War — equilibrium real é (Differentiate, Differentiate). Payoff matrix: Price War gera (-60%, -55%) para ambos; Differentiate gera (+5%, +5%) para ambos. AG-DIFF-3 (war of attrition hold) é crítico: aceitar share sacrifice temporário é matematicamente superior a entrar em guerra de preços.

---

### AG-008 — Plano de Contingência Overcapacity (S11)
**Decisão associada**: MITIGAR

| Campo | Detalhe |
|---|---|
| **ID** | AG-008 |
| **Ação** | Plano de contingência para overcapacity vs demanda no mercado EV brasileiro |
| **Dimensão** | S11 (Competition) + S9 (Demand) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | MITIGAR — cenário downside (Price War, 20% probabilidade) causa -20% em volume BYD |
| **Owner (RACI)** | CSO + Head Strategy (R) + COO (A) + Head Supply (Executor) |
| **Deadline** | Plano de contingência: 31/out/2026; Revisão trimestral: 30/set/2026, 31/dez/2026, 31/mar/2027 |
| **Recursos** | R$ 0 incremental (usa estrutura existente); R$ 20M se ativado (renegociação parcerias em RED) |
| **Dependências** | AG-007 (resposta competitiva definida); S9 (demand monitoring) |
| **KPI de sucesso** | Capacidade agregada vs demanda: ratio <= 1.2x (sem overcapacity); Plano B ativado em <= 30 dias se ratio > 1.5x; Volume BYD >= 8k unidades/mês em cenário downside |
| **Status atual** | PENDENTE |
| **Contingência** | Se overcapacity atingir ratio > 1.5x E demand downside: ativar renegociar parcerias (AG-023, R$ 20M); reduzir SKD/CKD ramp temporariamente; ativar defensivo targeted Tier 2 (AG-018, R$ 15M). wind-down do programa requer unanimidade Board global + HQ China (R$ 500M+). |

**Detalhamento**: Cenário downside (T-MV5 inverso, 20% probabilidade): EV share cai para 12% em 2027, BYD volume impact -20%. BYD tem 3x monthly production em backlog (S9 GREEN), mas cenário Price War pode consumir isso em 6-9 meses. Monitorar capacidade agregada Stellantis/VW/Geely é crítico — se todos verticalizarem (AG-DIFF-1), overcapacity é estrutural.

---

### AG-009 — Setup Programa Compliance ESG
**Decisão associada**: MITIGAR → ABORTAR (kill switch)

| Campo | Detalhe |
|---|---|
| **ID** | AG-009 |
| **Ação** | Setup programa compliance ESG + auditoria externa + remediação pública |
| **Dimensão** | S7 (ESG) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | MITIGAR → ABORTAR kill switch via remediação |
| **Owner (RACI)** | CSO + Head Comms (auditoria, AG-034) + Head Gov Relations + CEO (engajamento MPT/MTE, AG-036) |
| **Deadline** | Auditoria ESG contratada: 15/set/2026; Plano remediação aprovado: 31/out/2026; MPT/MTE engajado: 30/set/2026; Decisão estratégica (reverter/reestruturar/hibernar): 19/out/2026 |
| **Recursos** | R$ 3M (auditoria Deloitte/EY/KPMG) + R$ 20M (plano remediação público) + R$ 2M (engajamento MPT/MTE) |
| **Dependências** | AG-001 (mesma ação — são as mesmas ações AG-033 a AG-037 consolidadas) |
| **KPI de sucesso** | S7 = AMBER (kill switch desativado); Lista suja MTE removida; BNDES funding R$ 800M+ desbloqueado; Auditoria ESG aprovada por auditor independente |
| **Status atual** | PLANEJADO (AG-034, AG-035); EM CURSO (AG-036) |
| **Contingência** | Se MTE/MPT não aceitar plano de remediação em 90d: escalar para decisão estratégica AG-037 (CEO + Conselho + Board global). Options: reverter (litígio), reestruturar (spin-off), hibernar (pause 12-18 meses). Avaliar privado como alternativa a BNDES. |

**Detalhamento**: S7 ESG é kill switch binário — quando ativo, sobrepõe todas as outras sessões e bloqueia BNDES funding independentemente do ViE. Passivo trabalhista estimado: R$ 15M em compensações. Reputational recovery: plano de comunicação pública + engajamento com sociedade civil. Parcerias (EVE/CATL) também têm risco reputacional se S7 cronificar.

---

### AG-010 — Monitor T-MV1 Trigger (Tariff > 40%)
**Decisão associada**: MITIGAR (se trigger) / CONTINUAR (monitoramento)

| Campo | Detalhe |
|---|---|
| **ID** | AG-010 |
| **Ação** | Monitorar e operacionalizar trigger T-MV1 (4-shock stress: FX > 6.2 AND Supply RED AND Tariff > 30% AND S7 RED simultâneos) |
| **Dimensão** | S6 (Macro Triggers) + S10 (Tariff) + S1 (FX) + S2 (Supply) + S7 (ESG) |
| **Prioridade** | CRÍTICA |
| **Decisão associada** | CONTINUAR (monitoramento); MITIGAR se trigger dispara |
| **Owner (RACI)** | CSO (Analyst, R) + Risk Officer (R) + CEO (A) + Monitor (Head ESG/Compliance) |
| **Deadline** | Auto-trigger implementado: 31/dez/2026 (AG-026); Monitoramento: contínuo (diário em RED, semanal em AMBER, mensal em GREEN) |
| **Recursos** | R$ 800k dev (auto-trigger AG-026) + R$ 600k dev (dashboard AG-029) + R$ 200k/trim (calibração trimestral) |
| **Dependências** | AG-001 (S7 resolve para evitar trigger); AG-002 (hedge FX); AG-005 (supply chain); AG-006 (tariff renegotiation) |
| **KPI de sucesso** | T-MV1 trigger: latência <= 5 minutos para 4-shock stress; T-MV2 (FX-Supply tail): <= 30 minutos; T-MV3 (Tariff jump): <= 48h; T-MV4 (CVaR95 breach): <= 24h; T-MV5 (Upside): <= 72h |
| **Status atual** | PENDENTE (auto-trigger AG-026 não implementado) |
| **Contingência** | Se T-MV1 dispara: Composite = 95 fixo; freeze all non-essential capex; CEO + Conselho reúnem em 24h; bridge financing R$ 800M ativado; head de crisis committee daily standup. Se T-MV4 dispara (CVaR95 breach > R$ 10.14 bi/quarter): emergency committee; recalibrar modelo; ativar learning loop imediato. |

**Detalhamento**: T-MV1 é o cenário 4-shock stress: FX > 6.2 AND Supply = RED AND Tariff > 30% AND S7 = RED simultâneos. Probabilidade: ~2%. Perda estimada: R$ 12.8 bi (pior que VaR 95% de R$ 8.21 bi). T-MV4 (CVaR95 breach) é o trigger operacional — ativa o kill switch de liquidity quando CVaR realizado > R$ 10.14 bi em qualquer quarter.

---

## PARTE 2: TODAS AS 37+ AÇÕES — TABELA CONSOLIDADA

> **Nota**: Ação #17 (Defensivo catalog-wide) foi **REMOVIDA** do D3 v2.0 porque o ROI era -67% em todos os cenários. É substituída pelo tier system targeted (AG-016, AG-018). Contagem total: 39 ações activas (1 REMOVIDA, 40 originais).

### Legenda de Status
- **PENDENTE**: ação definida mas não iniciada
- **EM CURSO**: ação em execução
- **BLOQUEADO**: ação travada por dependência externa
- **CONDICIONAL**: ação ativa apenas se trigger específico (S6 AMBER/RED, etc.)
- **ATIVO**: ação contínua/permanente

### Tabela Consolidada (Ordenada por Dimensão + Prioridade)

| ID | Ação | Dim | Prioridade | Owner | Deadline | Status |
|---|---|---|---|---|---|---|
| AG-001 | Resolver lista suja S7 (kill switch) | S7 | CRÍTICA | Head Gov Relations + CEO | 19/out/2026 | EM CURSO |
| AG-002 | Implementar hedge FX 95% | S1 | CRÍTICA | Risk Officer + CFO | 31/ago/2026 | PENDENTE |
| AG-003 | Acelerar nacionalização 70% | S8 | CRÍTICA | Head Supply + COO | 31/out/2027 | EM CURSO |
| AG-004 | Implementar diferenciação (tier + game theory) | S4/S11 | CRÍTICA | Head Marketing + CSO | 31/dez/2026 | PENDENTE |
| AG-005 | Reserva lítio + CATL LP 70% | S2 | CRÍTICA | Head Procurement + COO | 31/ago/2026 | EM CURSO |
| AG-006 | Renegociar tariff quota Camex | S10 | CRÍTICA | Head Gov Relations + CEO | 31/out/2026 | PENDENTE |
| AG-007 | Definir resposta competitiva (Nash) | S11 | CRÍTICA | CSO + Head Strategy | 30/set/2026 | PENDENTE |
| AG-008 | Plano contingência overcapacity | S11 | CRÍTICA | CSO + COO | 31/out/2026 | PENDENTE |
| AG-009 | Setup compliance ESG + auditoria | S7 | CRÍTICA | CSO + Head Comms | 15/set/2026 | PLANEJADO |
| AG-010 | Monitor T-MV1 (tariff >40%) | S6 | CRÍTICA | CSO + Risk Officer | 31/dez/2026 | PENDENTE |
| AG-011 | Calcular h* baseline (constraint-based) | S1 | ALTA | Risk Officer | 15/ago/2026 | PENDENTE |
| AG-012 | Implementar constraint VaR <= 20% margin | S1 | ALTA | Risk Officer + CFO | 31/ago/2026 | PENDENTE |
| AG-013 | Contratar 4 counterparties hedge | S1 | ALTA | Head Treasury | 31/out/2026 | PENDENTE |
| AG-014 | Stress test FX+supply (12 combinações) | S1 | ALTA | CSO + Risk Officer | 30/nov/2026 | PENDENTE |
| AG-015 | Recalibração semestral vol implícita | S1 | MÉDIA | Risk Officer | 30/jun/2027 | CONTÍNUO |
| AG-016 | Implementar tier system 0/1/2/3 | S4 | ALTA | Head Marketing + CMO | 30/set/2026 | PENDENTE |
| AG-017 | ~~Defensivo catalog-wide~~ | S4 | — | — | — | **REMOVIDO** |
| AG-018 | Defensivo targeted Tier 2 (5k und) | S4 | ALTA | Head Marketing | CONDICIONAL | — |
| AG-019 | Análise competitiva trimestral | S4/S11 | ALTA | Head Strategy | 30/set/2026 | CONTÍNUO |
| AG-020 | Game theory layer (Nash Differentiate) | S4/S11 | ALTA | CSO + Head Strategy | 31/dez/2026 | PENDENTE |
| AG-021 | Qualificar EVE Tier 1 (12m) | S2 | ALTA | Head Supply | 31/mar/2027 | PENDENTE |
| AG-022 | Contratos CATL LP 70% locked | S2 | CRÍTICA | Head Procurement | 31/ago/2026 | EM CURSO |
| AG-023 | Mapear 3 fornecedores alternativos | S2 | MÉDIA | Head Supply | 30/nov/2026 | PENDENTE |
| AG-024 | Safety stock +30 dias (S6 AMBER+) | S2 | MÉDIA | Head Supply | CONDICIONAL | — |
| AG-025 | Plano B spot purchasing (S6 RED) | S2 | ALTA | Head Procurement | CONDICIONAL | — |
| AG-026 | Auto-trigger S6 → S1/S2/S3/S4/S5 | S6 | ALTA | Head Data + CSO | 31/dez/2026 | PENDENTE |
| AG-027 | Calibração trimestral elasticidades | S6 | MÉDIA | CSO + Head Data | TRIMESTRAL | CONTÍNUO |
| AG-028 | Stress test anual integrado | S6 | MÉDIA | CSO + Risk Officer | 31/mar/2027 | PLANEJADO |
| AG-029 | Dashboard executivo (4 telas) | S6 | ALTA | Head Data | 31/dez/2026 | PENDENTE |
| AG-030 | Workshop Conselho D3 v2.0 | S6 | ALTA | CSO + CEO | 15/set/2026 | PLANEJADO |
| AG-031 | Recalibração anual framework | S6 | MÉDIA | CSO + Conselho | 31/mar/2027 | PLANEJADO |
| AG-032 | Kill switch: pausar capex (S7 RED) | S7 | CRÍTICA | CEO + CFO | ATIVO | **ATIVO** |
| AG-033 | Revisar covenants financiamentos | S7 | ALTA | CFO + Head Legal | 31/ago/2026 | PENDENTE |
| AG-034 | Auditoria ESG externa | S7 | CRÍTICA | CSO + Head Comms | 15/set/2026 | PLANEJADO |
| AG-035 | Plano remediação público | S7 | CRÍTICA | Head Gov Relations + CSO | 31/out/2026 | PLANEJADO |
| AG-036 | Engajar MPT/MTE (saída lista suja) | S7 | CRÍTICA | Head Gov Relations + CEO | 30/set/2026 | EM CURSO |
| AG-037 | Decisão estratégica 90d (reverter/reestruturar/hibernar) | S7 | CRÍTICA | CEO + Conselho + Board global | 19/out/2026 | PENDENTE |
| AG-038 | Advocacy baseline MDIC (12 reun / ano) | S3 | MÉDIA | Head Gov Relations | CONTÍNUO | EM CURSO |
| AG-039 | Advocacy expandido +2 lobistas (S6 AMBER+) | S3 | ALTA | Head Gov Relations | CONDICIONAL | — |
| AG-040 | Bridge financing R$ 800M (S6 RED) | S3 | CRÍTICA | CFO + Head Treasury | CONDICIONAL | — |
| AG-041 | Contratar 2 lobistas BNDES | S3 | MÉDIA | Head Gov Relations | 31/ago/2026 | PLANEJADO |
| AG-042 | Recalibração trimestral ViE efetivo | S3 | MÉDIA | CSO + CFO | TRIMESTRAL | CONTÍNUO |
| AG-043 | Revisão LP contratos EVE/CATL/Tier1 (S6 AMBER+) | S5 | MÉDIA | Head Legal + Procurement | CONDICIONAL | — |
| AG-044 | Ativar hedge clauses (S6 AMBER) | S5 | ALTA | Head Legal | CONDICIONAL | — |
| AG-045 | Renegociar parcerias (S6 RED) | S5 | ALTA | Head Procurement | CONDICIONAL | — |
| AG-046 | Diversificar fornecedores Tier 1 | S5 | MÉDIA | Head Supply | 31/mar/2027 | PLANEJADO |
| AG-047 | Mapear stakeholders críticos | S5 | BAIXA | CSO | 31/ago/2026 | PLANEJADO |
| AG-048 | AG-DIFF-1: LFP verticalization (R$ 600M) | C2 | CRÍTICA | CEO + CFO + Head Supply | 31/dez/2027 | PLANEJADO |
| AG-049 | AG-DIFF-2: Technology differentiation (R$ 200M) | C2 | ALTA | Head R&D + CMO | 30/jun/2027 | PLANEJADO |
| AG-050 | AG-DIFF-3: War of attrition hold | C2 | CRÍTICA | CEO + Head Strategy | CONTÍNUO | PLANEJADO |

---

## PARTE 3: CALENDÁRIO DE DECISÕES

### Timeline: Jul/2026 → Dez/2027

| Mês | Decisão | Dimensão | Status | Prioridade |
|---|---|---|---|---|
| **Jul/2026** | Kill switch S7 ACTIVE | S7 | ATIVO | CRÍTICA |
| Jul/2026 | Calcular h* baseline | S1 | A FAZER | CRÍTICA |
| Jul/2026 | Workshop Conselho D3 v2.0 (AG-030) | S6 | PLANEJADO | ALTA |
| Jul/2026 | Decisão estratégica S7 (reverter/reestruturar/hibernar) | S7 | URGENTE | CRÍTICA |
| **Ago/2026** | Implementar hedge FX 95% (AG-002) | S1 | PENDENTE | CRÍTICA |
| Ago/2026 | CATL LP 70% locked (AG-022) | S2 | EM CURSO | CRÍTICA |
| Ago/2026 | Engajar MPT/MTE (AG-036) | S7 | EM CURSO | CRÍTICA |
| Ago/2026 | Revisar covenants (AG-033) | S7 | PENDENTE | ALTA |
| Ago/2026 | Contratar 2 lobistas BNDES (AG-041) | S3 | PLANEJADO | MÉDIA |
| Ago/2026 | Mapear stakeholders críticos (AG-047) | S5 | PLANEJADO | BAIXA |
| **Set/2026** | Implementar tier system 0/1/2/3 (AG-016) | S4 | PENDENTE | ALTA |
| Set/2026 | Auditoria ESG contratada (AG-034) | S7 | PLANEJADO | CRÍTICA |
| Set/2026 | Análise competitiva trimestral (AG-019) | S11 | CONTÍNUO | ALTA |
| Set/2026 | Auto-trigger S6 baseline (AG-026) | S6 | PLANEJADO | ALTA |
| **Out/2026** | Nacionalização 25% → 45% (AG-003) | S8 | EM CURSO | CRÍTICA |
| Out/2026 | Renegociação tariff Camex (AG-006) | S10 | PENDENTE | CRÍTICA |
| Out/2026 | Plano remediação público (AG-035) | S7 | PLANEJADO | CRÍTICA |
| Out/2026 | Contratar 4 counterparties (AG-013) | S1 | PENDENTE | ALTA |
| Out/2026 | Plano contingência overcapacity (AG-008) | S11 | PENDENTE | CRÍTICA |
| **Nov/2026** | Stress test FX+supply 12 combos (AG-014) | S1 | PENDENTE | ALTA |
| Nov/2026 | Mapear 3 fornecedores alternativos (AG-023) | S2 | PENDENTE | MÉDIA |
| **Dez/2026** | Game theory layer (AG-020) | S4/S11 | PENDENTE | ALTA |
| Dez/2026 | Dashboard executivo (AG-029) | S6 | PENDENTE | ALTA |
| Dez/2026 | Safety stock +30d ativado (se S6 AMBER+) | S2 | CONDICIONAL | MÉDIA |
| Jan/2027 | Tariff 35% applied (scheduled) | S10 | CERTO | CRÍTICA |
| Jan/2027 | EVE qualification 50% (AG-021) | S2 | EM CURSO | ALTA |
| **Q1 2027** | Recalibração ViE trimestral | S3 | CONTÍNUO | MÉDIA |
| Q1/2027 | Stress test anual integrado (AG-028) | S6 | PLANEJADO | MÉDIA |
| Q1/2027 | Recalibração anual framework (AG-031) | S6 | PLANEJADO | MÉDIA |
| **Jun/2027** | AG-DIFF-2: Technology differentiation | C2 | PLANEJADO | ALTA |
| **Set/2027** | Análise competitiva trimestral | S11 | CONTÍNUO | ALTA |
| **Out/2027** | Nacionalização 70% (meta final) | S8 | META | CRÍTICA |
| Dez/2027 | AG-DIFF-1: LFP verticalization (R$ 600M) | C2 | PLANEJADO | CRÍTICA |

---

## PARTE 4: GATES DE APROVAÇÃO (bloqueios do playBook)

| Gate | Pré-requisito | Threshold | Se não cumprido | Status |
|---|---|---|---|---|
| **G1** | RiskOwner nomeado | Pessoa designada | Framework não opera | **BLOQUEADO** |
| **G2** | Taxa de desconto validada | Conselho aprova | Usar 13% nominal fallback | A FAZER |
| **G3** | Composite threshold >= 88 validado | Conselho aprova | Usar 85 como fallback | A FAZER |
| **G4** | Approval authority matrix | Conselho aprova | Todas decisões R$ 10M+ escaladas | A FAZER |
| **G5** | 4 contrapartes hedge confirmadas | BTG/Itaú/Bradesco/Santander | Hedge em 1-2 contrapartes (concentration risk) | A FAZER |
| **G6** | CATL LP 70% assinado | Contrato executado | Risco supply shift para EVE-only (+R$ 100M capex) | EM NEGOCIAÇÃO |
| **G7** | BNDES funding partial (R$ 1.5bi) | Funding aprovado | S3 = Continuidade ou pior; trigger Tree #7-12 | **BLOQUEADO POR S7** |
| **G8** | Status ESG válido | Lista suja resolvida OU plano remediação aprovado | Kill switch ativo; capex bloqueado | **ATIVO (S7 RED)** |

---

## PARTE 5: MATRIZ DE DEPENDÊNCIAS (CRÍTICA PATH)

```
AG-001 (S7 lista suja)
    ├── AG-002 (hedge FX 95%) — desbloqueia BNDES
    │       └── AG-014 (stress test FX+supply)
    ├── AG-003 (nacionalização 70%)
    │       └── AG-021 (EVE qualification)
    ├── AG-005 (CATL LP 70%)
    │       └── AG-025 (Plano B supply)
    ├── AG-006 (tariff renegotiation)
    ├── AG-007 (resposta competitiva)
    └── AG-009 (compliance ESG)
            └── AG-037 (decisão estratégica 90d)

Gate G1 (RiskOwner) → AG-002, AG-011, AG-012, AG-013, AG-014
Gate G5 (4 contrapartes) → AG-013
Gate G6 (CATL LP) → AG-005
Gate G7 (BNDES funding) → AG-003, AG-040
Gate G8 (S7 válido) → G7, AG-001, AG-002, AG-003, AG-005
```

---

## PARTE 6: KPIs DE MONITORAMENTO TRIMESTRAL

| Dimensão | KPI | Target | Alerta |
|---|---|---|---|
| **S1 FX Hedge** | Hedge coverage | >= 90% | < 75% |
| **S1 FX Hedge** | VaR residual | <= 20% margin | > 25% |
| **S2 Supply** | CATL LP % locked | 70% | < 50% |
| **S2 Supply** | EVE Tier 1 status | Qualificado | Em auditoria |
| **S3 BNDES** | ViE efetivo | >= 15% | < 10% |
| **S4 Pricing** | Tier system implemented | Tier 0-3 operacional | Só Tier 0 ativo |
| **S6 Triggers** | Composite score | < 88 | >= 88 (modo crise) |
| **S7 ESG** | Status lista suja | FORA da lista | Na lista |
| **S8 Ramp** | % Nacionalização | 45% (Dez/2026) | < 35% |
| **S10 Tariff** | Tarifa efetiva | <= 35% | > 35% |
| **S11 Competition** | BYD EV market share | >= 40% | < 35% |
| **VaR Total** | CVaR 95% quarterly | <= R$ 10.14 bi | > R$ 10.14 bi |

---

## PARTE 7: CONTINGÊNCIAS POR CENÁRIO

### Cenário A: S7 KILL SWITCH DESATIVADO (S7 → AMBER)
**Probabilidade**: 60% | **Impacto**: Positivo

Ações a ativar:
- AG-002: Implementar hedge FX 95% (BNDES backing disponível)
- AG-003: Acelerar nacionalização (BNDES funding parcial R$ 1.5bi)
- AG-005: CATL LP 70% formalizado
- AG-037: Decisão estratégica = REVERTER (litígio + remediação plena)
- G7 (BNDES funding) desbloqueado

### Cenário B: S7 MANTÉM RED (Kill Switch ativo)
**Probabilidade**: 25% | **Impacto**: Negativo grave

Ações a ativar:
- AG-032: Manter pause capex (ATIVE)
- AG-040: Bridge financing privado R$ 800M (sem BNDES)
- AG-037: Decisão estratégica = REESTRUTURAR ou HIBERNAR
- Reduzir exposure: hedge FX máximo via private banking
- Plano B supply: spot purchasing (AG-025)

### Cenário C: T-MV1 TRIGGER (4-shock stress)
**Probabilidade**: 2% | **Impacto**: Crítico (R$ 12.8 bi perda)

Trigger: FX > 6.2 AND Supply = RED AND Tariff > 30% AND S7 = RED

Ações imediatas (< 5 minutos):
- Composite = 95 fixo
- Freeze all non-essential capex
- CEO + Conselho: reunião em 24h
- Bridge financing R$ 800M: ativado
- Head de crisis committee: daily standup

### Cenário D: T-MV5 UPSIDE (BRL < 5.0 + Tariff exemption + S7 = AMBER+)
**Probabilidade**: 15% | **Impacto**: Positivo (R$ 2.5 bi gain)

Ações a ativar:
- Capturar upside: expandir capex
- Acelerar ramp (SKD→Nacional)
- Opportunistic hedge reduction (hedge coverage: 90% → 50%)
- Avaliar antecipar AG-DIFF-1 (LFP verticalization)

---

## PARTE 8: RESUMO EXECUTIVO

### Números-Chave do D3-ACTION-PLAN

| Métrica | Valor |
|---|---|
| Total ações ativas | 39 |
| Ações CRÍTICAS | 15 |
| Ações ALTA prioridade | 14 |
| Ações CONDICIONAIS | 8 |
| Investimento total (3 anos) | ~R$ 1.8 bi |
| ROI esperado | R$ 700M–1 bi (1 evento evitado paga o framework) |
| Custo framework (Fases 1-3) | R$ 3.0M |
| VaR 95% (C3) | R$ 8.21 bi |
| CVaR 95% (C3) | R$ 10.14 bi |
| Gate G1-G8 | 3 BLOQUEADOS, 2 EM NEGOCIAÇÃO, 1 ATIVO |

### Ações que Desbloqueiam o Programa

1. **AG-001 (CRÍTICA)**: Resolver lista suja S7 → desbloqueia BNDES R$ 800M+
2. **AG-002 (CRÍTICA)**: Implementar hedge FX 95% → protege NPV
3. **AG-003 (CRÍTICA)**: Nacionalização 70% → reduz FX exposure de 60% para 15%
4. **AG-022 (CRÍTICA)**: CATL LP 70% → segurança de supply chain
5. **AG-006 (CRÍTICA)**: Renegociação tariff Camex → reduz VaR de R$ 2.38 bi para ~R$ 1.5 bi

### Prioridade Imediata (Julho 2026)

| # | Ação | Deadline | Status |
|---|---|---|---|
| 1 | Workshop Conselho D3 v2.0 | 15/jul/2026 | PLANEJADO |
| 2 | Nomear RiskOwner (G1) | 15/jul/2026 | **URGENTE** |
| 3 | Engajar MPT/MTE (AG-036) | 30/set/2026 | EM CURSO |
| 4 | Decisão estratégica S7 | 19/out/2026 | PENDENTE |
| 5 | Implementar hedge FX baseline | 31/ago/2026 | PENDENTE |

---

**Arquivo**: D3-ACTION-PLAN.md
**Versão**: v1.0
**Data**: 21/jul/2026
**Projeto**: BYD Camaçari 2025–2027
**Base**: D3-MAIN.html v2.0 | D3-RACI.md v0.6 | D3-GAME-THEORY.md (C2) | D3-MULTIVARIATE-SENSITIVITY.md (C3)
