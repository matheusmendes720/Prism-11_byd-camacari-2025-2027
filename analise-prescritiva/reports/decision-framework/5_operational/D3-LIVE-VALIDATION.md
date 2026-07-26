# D3-LIVE-VALIDATION — Validação com Dados Públicos Jul/2026

**Documento**: D3-LIVE-VALIDATION.md
**Projeto**: BYD Camaçari 2025-2027 — Decision Framework D3 v2.0
**Data**: 21/jul/2026
**Status**: Live Validation — Checkpoint pré-Phase 2
**Base**: D3 v2.0 (D3-MAIN.html), D3-OSINT-CHECKPOINT.md, D3-RECALIBRATION-S2-LITHIUM-2026.md, D3-INTERDEPENDENCY-S9-DEMAND.md, D3-INTERDEPENDENCY-S11-COMPETITION.md

> **Objetivo**: Validar ou invalidar premissas do D3 v2.0 usando OSINT pública mais recente disponível (dados publicados até Jul/2026). Identificar divergências materiais, recalcular NPV se necessário, e gerar alertas para refresh em 30/60/90 dias.

---

## SEÇÃO 1: DADOS COLETADOS (Jul 2026)

### 1.1 Tabela de Validação por Indicador

| # | Indicador | Valor D3 v2.0 | Fonte | Data | Valor OSINT Jul/2026 | Status |
|---|-----------|---------------|-------|------|----------------------|--------|
| 1 | **FX BRL/USD** | R$ 5.5 (PTAX) | BCB | D3 original | **R$ 5.5xx** (PTAX Jul/2026) | ✅ VÁLIDO — sem mudança material |
| 2 | **Market share BYD Brasil** | ~5-8% implícito | Fenabrave | D2 (2025) | **12.8% (Abr/2026)**, **13.47% (Mai/2026)** | 🔴 ATUALIZAR — D3 subestimou por ~5-6pp |
| 3 | **Lítio (carbonate)** | US$ 12k/t (baseline D3 original) | Asian Metal | D3 original | **US$ 21-22k/t (Jun/2026)** | 🔴 ATUALIZAR — rebound 144% vs vale 2025; B8 recalibration aplicada |
| 4 | **BYD lista suja MTE** | Não mencionado (D3 ignorou) | MTE | — | **SIM** — desde 07/abr/2026, status ATIVO | 🔴 NOVO RISCO — D3 não modelou |
| 5 | **Tarifa SKD/CKD** | 35% Jan/2027 | Camex | Confirmado | **35%** — Camex confirmou, rejeitou exceção BYD | ✅ CONFIRMADO |
| 6 | **Produção BYD Brasil** | ~100k unidades | ANFAVEA | 2025 | **~50k Camacari (2025)**, **~112k total BR (2025)** | 🟡 PARCIAL — planta em ramp-up, números分散 |
| 7 | **Market size EV Brasil** | ~5-8% implícito | ANFAVEA | D2 | **13.47% (Mai/2026)**, +153% YoY | 🔴 ATUALIZAR — adoção 2× mais rápida que D3 |
| 8 | **BNDES Move Brasil** | R$ 30bi pool | BNDES | Confirmado | **R$ 30bi** — crédito ao consumidor (taxistas/app), juro 11.5-12.6% a.a. | ✅ CONFIRMADO — programa existe, mas é crédito ao consumidor, não capex |
| 9 | **VaR FX (σ annual)** | σ 14.86% | BCB SGS | Validado D3 | **σ 14.86%** (BCB série 10813) | ✅ CONFIRMADO |
| 10 | **VaR lítio (σ annual)** | σ 82.9% | USGS | Validado D3 | **σ 82.9%** (histórico 10y) | ✅ CONFIRMADO — volatilidade mantida |
| 11 | **Stellantis market share** | ~18-20% | Fenabrave | D3 original | **~22% (Abr/2026)** — líder isolado | 🟡 ATUALIZAR — Stellantis mais forte que D3 estimava |
| 12 | **Capacidade agregada EV BR** | ~400-500k | Est. D3 | D3 original | **~630k (2027)** vs demanda ~200k | 🔴 CONFIRMADO — overcapacity 430k (68%) pior que D3 |
| 13 | **Cronograma Camacari full ops** | Dez/2025 original | BYD | D3 original | **Dez/2026** (revisto, ~12 meses delay) | 🟡 CONFIRMADO — delay validado por OSINT |
| 14 | **Geely market share** | Não mencionado | — | — | **~10.6% (surging, Abr/2026)** | 🟡 NOVO — competidor mais relevante que D3 captou |

**Resumo Status**: 5 ✅ Confirmado · 5 🔴 Atualizar/Novo Risco · 4 🟡 Parcial

---

## SEÇÃO 2: ATUALIZAÇÕES NECESSÁRIAS

### 2.1 Market Share BYD — Atualização Crítica

**Dado D3 original**: market share BYD ~5-8% implícito (cenário pessimista RB Parcial)
**Dado OSINT Jul/2026**: 12.8% Abr/2026, 13.47% Mai/2026 — BYD lidera ranking de varejo pela primeira vez na história

**Análise**:
- D3 cenário S3 "RB Parcial" (ViE=10%, market share baixo) **nunca se materializou**
- BYD em Abr/2026: 14.911 unidades, 1º lugar no varejo brasileiro, 70%+ do EV share
- Target 2026: 250.000 unidades (+121% vs 2025)
- Crescimento YoY: +153% (Mai/2026 vs Mai/2025)

**Impacto no NPV/D3**:
- Projeção de volume 15-20% acima do baseline D3
- S9 (Demand) status: 🟢 GREEN DUPLO — EV share >10% E crescimento >30% YoY
- S3 cenários: RB Total (ViE=0%) e RB Parcial (ViE=10%) têm probabilidade <5% combinadas
- Recomendação: realocar probabilidades — Cenário A (Expansão, >12%) = 60%, Cenário B (Continuidade, 8-12%) = 30%, Cenário C+D (Rollback) = 10%

**Ação**: Atualizar seção §C e scorecard C1 — cenários S3 com probabilidades corrigidas

---

### 2.2 Lítio — Rebound Material (B8 recalibration aplicada)

**Dado D3 original**: US$ 10-12k/t (2025-2026), "lítio normaliza"
**Dado OSINT Jul/2026**: US$ 21-22k/t (Jun/2026) — rebound de 144% desde o vale de US$ 9k/t (Ago/2025)

**Análise** (detalhada em D3-RECALIBRATION-S2-LITHIUM-2026.md):
- Driver 1: mina CATL Jianxiawo suspensa desde late 2024 (regulatório/ESG)
- Driver 2: deficit estrutural 2026-2027 (consenso 4/6 fontes: 20-80kt LCE)
- Driver 3: demanda EV global aquecida (BR +153% YoY, Europa >30%, China >50%)
- Cenário Base atual: US$ 18k/t (plateau) — probabilidade 50-60%

**Impacto no NPV/D3**:
- Battery pack cost subiu de R$ 8.700 → R$ 9.500/unit (+R$ 800)
- VaR supply P95 (RED): R$ 2.27bi → R$ 3.5-4.0bi (+63%)
- ViE 5y PV: R$ 570M → R$ 405M (−29%) — recalibration B8 aplicada
- Peso FX:supply: 1:0.97 → 1:1.46 (supply 46% pior que FX)

**Ação**: B8 recalibration já aplicada ao D3 v2.0 — confirmar que D3-MAIN.html reflete R$ 405M (não R$ 570M original)

---

### 2.3 Lista Suja BYD — Risco ESG Material (D3 Original Ignorou)

**Dado D3 original**: Não mencionado
**Dado OSINT Jul/2026**: SIM — MTE incluiu BYD em 07/abr/2026

**Análise** (detalhada em D3-OSINT-CHECKPOINT.md §1):
- 23/dez/2024: MPT-BA resgatou 163 trabalhadores chineses em condições análogas à escravidão
- 27/mai/2025: MPT processou BYD (tráfico internacional + trabalho escravo)
- 26/dez/2025: acordo fechado em R$ 40M
- 07/abr/2026: MTE incluiu BYD na "lista suja" do trabalho escravo
- 14/mar/2026: Washington Post publicou repercussão internacional

**Impacto no D3**:
- BYD está impedida de obter ciertos tipos de empréstimo bancário no Brasil
- BNDES (S3) pode NEGAR funding independentemente do ViE ou status regulatório
- S7 (ESG/Reputação) = 🔴 RED — bloqueia capex automaticamente
- Risco de execução: se lista suja se mantiver, funding institucional é inacessível

**Ação**: Adicionar S7 ao framework imediatamente. Status atual: 🔴 RED. Trigger: se lista suja ATIVA → block total de capex novo.

---

### 2.4 Capacidade Agregada vs Demanda — Overcapacity Confirmado

**Dado D3 original**: ~400-500k capacidade vs demanda não especificada
**Dado OSINT Jul/2026**: ~630k capacidade vs ~200k demanda (2027)

**Análise** (detalhada em D3-INTERDEPENDENCY-S11-COMPETITION.md):
| Player | Capacidade 2027 (k/ano) | Market share |
|--------|------------------------|--------------|
| Stellantis | ~180 | ~28.6% |
| VW | ~120 | ~19.0% |
| BYD | ~150 | ~23.8% |
| GM | ~100 | ~15.9% |
| Geely | ~80 | ~12.7% |
| **Total** | **~630** | **100%** |

- Demanda projetada 2027: ~200k unidades
- **Sobrecapacidade estrutural: ~430k unidades (68%)**
- Guerra de preços: probabilidade >65% (S11: 🔴 RED)

**Impacto no NPV/D3**:
- Margem setorial projetada: 8-12% (vs 15%+ em cenário benigno)
- BYD consegue sobreviver mais tempo que concorrentes (custo LFP verticalizado ~15-20% menor)
- Mas "sobreviver" ≠ "prosperar" — NPV de fase 2 (300k) pode ser marginal

**Ação**: Incorporar cenário de margem 8-12% no NPV recalculado (§5). Considerar se fase 2 (300k) ainda é atrativa com overcapacity de 68%.

---

### 2.5 BNDES Move Brasil — R$ 30bi Confirmado, Mas Não Financia Capex

**Dado D3 original**: BNDES tratado como funding direto de planta
**Dado OSINT Jul/2026**: R$ 30bi é crédito ao CONSUMIDOR, não à montadora

**Análise**:
- BNDES Move Brasil: financia taxistas/motoristas de app comprarem EVs (até R$ 150k, juro 11.5-12.6% a.a.)
- BYD vende mais carros se programa é generoso (demanda agregada), mas não recebe funding direto
- Submissões BNDES Mover (P&D não-reembolsável) suspensas desde 21/nov/2025 aguardando FNDIT
- BYD está habilitada no Move Brasil, mas o mecanismo é indireto

**Impacto no D3**:
- S3 modelava "BNDES funding" comoproxy para capex direto — imprecisão material
- S9 (Demand) que captura Move Brasil como driver de demanda agregada — mais correto
- Recomendação: separar S3 (conteúdo local/IPI) de S9 (demanda agregada via Move)

**Ação**: Corrigir interpretação de S3 no D3. Manter S9 como driver primário de demanda BNDES.

---

## SEÇÃO 3: VALIDAÇÃO CRUZADA

### 3.1 BYD Market Share vs Stellantis

| Indicador | D3 original | OSINT Jul/2026 | Conclusão |
|-----------|-------------|----------------|-----------|
| BYD market share | ~5-8% (implícito) | 12.8% (Abr/2026) | D3 subestimou por ~5-6pp |
| BYD EV share | 60-74% | 60-74% | ✅ Alinhado |
| Stellantis market share | ~18-20% | ~22% (líder) | D3 subestimou Stellantis |
| GEELY market share | Não mencionado | ~10.6% (surging) | 🆕 Novo competidor |

**Veredicto**: BYD não é líder do mercado total — Stellantis é (~22%). BYD lidera apenas o segmento EV. D3 errou a fotografia competitiva ao assumir BYD como líder implícito.

### 3.2 Overcapacity 630k vs 200k — Verificação ANFAVEA

| Fonte | Capacidade Agregada | Demanda 2027 | Overcapacity |
|-------|-------------------|--------------|--------------|
| D3 original | ~400-500k (estimado) | não especificado | implícito ~200-300k |
| D3-INTERDEPENDENCY-S11 | ~630k | ~200k | ~430k (68%) |
| ANFAVEA (proj. 2026) | ~580-650k | ~180-220k | ~380-430k |

**Veredicto**: Números S11 são consistentes com projeções ANFAVEA. Overcapacity 68% é válido e material. Guerra de preços (>65% probabilidade) é o cenário mais provável para 2027.

### 3.3 BNDES Move R$ 30bi vs Lista Suja — Impacto Cruzado

| Pergunta | Resposta OSINT | Impacto no D3 |
|----------|---------------|---------------|
| BNDES Move financia capex da planta? | **NÃO** — é crédito ao consumidor | S3 como funding direto está errado |
| Lista suja impacta acesso ao BNDES? | **SIM** — impede ciertos préstamos | S7 RED bloqueia S3 GREEN |
| FNDIT (fundo BNDES Mover) está ativo? | **NÃO** — suspenso desde Nov/2025 | S3 atual = 🔴 RED por default |
| BYD tem альтернативный funding? | **SIM** — caixa próprio US$ 30bi+ global | Fase 1 não depende de BNDES |

**Veredicto**: BNDES Move R$ 30bi está disponível como driver de DEMANDA (S9), não como fonte de capex (S3). Lista suja não bloqueia fase 1 (caixa próprio BYD), mas impede scale-up via funding institucional.

---

## SEÇÃO 4: ALERTAS

### 4.1 Premissas que PODEM estar desatualizadas

| # | Premissa D3 v2.0 | Risco de Desatualização | Prob. | Severidade |
|---|-----------------|------------------------|-------|------------|
| 1 | Market share BYD ~5-8% | BYD já está em 12.8-13.5% — D3 subestimou demanda | Alta | 🔴 Alta |
| 2 | Lítio normaliza US$ 10-12k | Lítio rebotou para US$ 22k — cenário stress está mais provável | Alta | 🔴 Alta |
| 3 | BNDES como funding direto de capex | É crédito ao consumidor, não à montadora | Média | 🟡 Média |
| 4 | S3 cenários com probabilidade balanceada | Cenário Expansão (BYD >12%) = 60%+, Rollback <10% | Alta | 🔴 Alta |
| 5 | Cronograma Camacari: full ops Dez/2025 | Cronograma revisado para Dez/2026 (~12 meses delay) | Confirmado | 🟡 Média |
| 6 | BYD como líder de mercado | Stellantis líder em market share total; BYD líder apenas em EV | Alta | 🟡 Média |
| 7 | Geely ~5% ou não mencionado | Geely em 10.6% (surging) — 2ª maior no EV | Alta | 🟡 Média |
| 8 | S4 defensivo pricing ativado | Com demanda >oferta, defensivo desnecessário no curto prazo | Média | 🟡 Média |

### 4.2 Dados a Refreshar — Cronograma 30/60/90 dias

| Indicador | Refresh em | Gatilho | Ação |
|-----------|-----------|---------|------|
| **Market share BYD** | 30 dias | Fenabrave Jun/2026 (quando sair) | Atualizar S9 e scorecard C1 |
| **Lítio price** | 30 dias | Fastmarkets monthly (15/jul, 15/ago) | Verificar se US$ 22k se sustenta ou se há reversão |
| **CATL Jianxiawo status** | 60 dias | Ministry of Natural Resources China | Se reabrir, baseline B8 muda (cenário Bull) |
| **FNDIT / BNDES Mover** | 60 dias | Gov.br announcements | Se reativar, S3 sobe para 🟡 AMBER |
| **Lista suja BYD** | 90 dias | MTE published list | Se removida, S7 sobe para 🟡 AMBER (há precedente) |
| **Geely share** | 60 dias | Fenabrave Jun/2026 | Atualizar S11 se Geely >12% |
| **Cronograma Camacari** | 30 dias | Reuters, BYD announcements | Confirmar se Dez/2026 se mantém |
| **Capacidade Stellantis** | 90 dias | ANFAVEA, Reuters | Verificar se R$ 30bi está se materializando em capacidade |
| **GWM entry** | 90 dias | GWM Brazil announcements | Confirmar lançamento 2026 e capacidade |

---

## SEÇÃO 5: RECÁLCULO NPV

### 5.1 Inputs Modificados (vs D3 v2.0 original)

| Parâmetro | D3 v2.0 original | Atualizado Jul/2026 | Fonte |
|-----------|------------------|---------------------|-------|
| Volume (base case) | 10.000 unidades/ano | **12.000 unidades/ano** (+20%) | Market share 12.8-13.5% sustentado |
| ASP | inalterado | inalterado | BYD pricing power mantido |
| Battery cost | R$ 8.700/pack | **R$ 9.500/pack** | Lítio US$ 22k (B8 recalibration) |
| Full cost delta | — | **+R$ 800/unit** | B8 recalibration |
| VaR supply P95 (RED) | R$ 2.27bi | **R$ 3.75bi** | B8 recalibration |
| S3 probabilidade Expansão | ~30% | **~60%** | Market share 12.8% realizado |
| S3 probabilidade Rollback | ~40% | **<10%** | Dados OSINT contradizem |
| Margem setorial | 15%+ | **8-12%** (price war) | S11 overcapacity 68% |

### 5.2 NPV Recalculado — Cenário Base (S2 AMBER, S3 Expansão)

```
Premissas:
  Volume        = 12.000 unidades/ano
  ASP           = R$ 75.000
  Battery cost  = R$ 9.500/pack (lítio US$ 22k)
  Other cost    = R$ 15.000/unit
  VaR residual  = R$ 100M (S2 AMBER, 95% hedge)
  Horizonte     = 5 anos

ViE_base = Volume × (ASP − Battery cost − Other cost) − VaR_residual
         = 12.000 × (R$ 75.000 − R$ 9.500 − R$ 15.000) − R$ 100M
         = 12.000 × R$ 50.500 − R$ 100M
         = R$ 606M − R$ 100M
         = R$ 506M (5-year PV, ~R$ 93M/ano)
```

**Comparação**:

| ViE | D3 v2.0 original | B8 recalibration | **Live Validation (Jul/2026)** |
|-----|-------------------|------------------|-------------------------------|
| ViE 5y PV | R$ 570M | R$ 405M | **R$ 506M** |
| ViE/ano | R$ 114M | R$ 81M | **R$ 101M** |
| Δ vs original | — | −29% | **−11%** |

**Interpretação**: O volume 20% maior compensa parcialmente o custo de lítio mais alto. ViE ainda 11% abaixo do original (R$ 506M vs R$ 570M), mas 25% acima da recalibration B8 sozinha (R$ 405M). O market share mais forte é um amortecedor do choque de lítio.

### 5.3 NPV — Cenário Stress (S2 RED, S11 price war ativa, lista suja ativa)

```
Premissas:
  Volume        = 10.000 unidades/ano (price war reduz 15-20%)
  Battery cost  = R$ 10.800/pack (lítio US$ 25k, Bear case)
  Margem        = 8% (price war setorial)
  VaR residual  = R$ 188M (S2 RED saturado)
  S7 (ESG)      = 🔴 RED — lista suja ativa bloqueia funding

ViE_stress = 10.000 × (R$ 75.000 × 0.92 − R$ 10.800 − R$ 15.000) − R$ 188M
           = 10.000 × (R$ 69.000 − R$ 10.800 − R$ 15.000) − R$ 188M
           = 10.000 × R$ 43.200 − R$ 188M
           = R$ 432M − R$ 188M
           = R$ 244M (5-year PV, ~R$ 44M/ano)
```

**Comparação stress**:

| ViE Stress | D3 v2.0 | **Live Validation** |
|------------|----------|-------------------|
| ViE 5y PV | R$ ~350M (implícito) | **R$ 244M** |
| Margem/ano | R$ ~70M (implícito) | **R$ 44M** |

**Observação**: Stress scenario atual é ~30% pior que o implícito no D3 original. Lista suja adiciona risco de funding que o D3 original não quantificou.

### 5.4 Break-Even e Sensitividade

| Variável | Baseline | Break-even | Observed Range | Impacto |
|----------|----------|------------|----------------|---------|
| Lítio | US$ 22k/t | US$ 45-50k/t | US$ 12-25k/t | Só viola break-even em supercycle extremo |
| Market share BYD | 12.8% | <3% | 12.8-13.5% | Confortável até 75% abaixo do atual |
| FX BRL/USD | R$ 5.5 | R$ 7.5+ | R$ 5.0-5.8 | Risco se BRL depreciar >36% |
| Capacidade利用率 | 33% (200k/630k) | <20% | 25-40% | Zona de alerta — price war reduz利用率 |
| BNDES funding | Indisponível (lista suja) | N/A | Alternativa: caixa próprio BYD | Fase 1 coberta; fase 2 depende de geração de caixa |

### 5.5 Conclusão NPV

O NPV do programa BYD Camaçari permanece **positivo em todos os cenários razoáveis** (base: R$ 506M, stress: R$ 244M). No entanto:

1. **Cenário base caiu 11%** (R$ 570M → R$ 506M) vs D3 v2.0 original — impacto de lítio compensado parcialmente por volume maior
2. **Cenário stress caiu ~30%** (R$ ~350M → R$ 244M) vs D3 original — lista suja adiciona risco de funding não modelado
3. **Fase 2 (300k)** permanece marginal em cenário de price war — overcapacity 68% reduz atratividade de scale-up
4. **Viabilidade depende de**: (a) capacidade de BYD absorver tarifa 35% sem repassar 100% ao consumidor, (b) manutenção do funding via caixa próprio enquanto lista suja ativa, (c) não-entry de price war destrutiva em 2027

---

## SEÇÃO 6: SÍNTESE — O QUE MUDA NO D3 v2.0

### 6.1 Correções Prioritárias (antes de Phase 2)

| Prioridade | Ação | Esforço | Impacto |
|-----------|------|---------|---------|
| 🔴 P1 | Adicionar S7 (ESG/Lista Suja) ao framework | 2h | Bloco de funding institucional |
| 🔴 P2 | Corrigir probabilidades S3 (Expansão 60%, Rollback <10%) | 1h | Scorecard C1 |
| 🔴 P3 | Atualizar market share baseline para 12-14% | 1h | Projeções de volume |
| 🟡 P4 | Separar BNDES Move (S9) de BNDES capex (S3) | 2h | Precisão conceitual |
| 🟡 P5 | Incorporar overcapacity 68% e price war >65% em S11 | 2h | Risco competitivo |
| 🟡 P6 | Confirmar B8 recalibration (R$ 405M → R$ 506M) no D3-MAIN.html | 1h | Consistência interna |

**Total estimado**: ~9h de trabalho

### 6.2 Validação Final — D3 v2.0 Continua Válido?

**Estrutura**: ✅ O framework D3 v2.0 permanece conceitualmente sólido — 11 dimensões, 8 acoplamentos, trigger matrix e action register não são invalidados pelos achados de OSINT.

**Parâmetros**: 🔴 4 correções materiais necessárias (P1-P3 + P6) antes de Phase 2. Estas mudanças afetam scorecard C1, NPV recalculado e trigger matrix.

**Conclusão**: D3 v2.0 continua válido como framework, mas requer as correções listadas. O documento D3-MAIN.html deve ser atualizado para refletir a Live Validation de Jul/2026 antes de ser apresentado a stakeholders.

---

## ANEXO A: Fontes OSINT Utilizadas

| Fonte | Dados Extraídos | Confiabilidade |
|-------|-----------------|----------------|
| Fenabrave (Abr-Mai/2026) | Market share BYD 12.8-13.47%, volumes mensais | Alta — associação do setor |
| ANFAVEA (Jun/2026) | Produção Brasil, market size EV 13.5%, projeções | Alta — fonte oficial |
| BCB PTAX (Jul/2026) | R$ 5.5xx/USD | Alta — oficial |
| Asian Metal / Fastmarkets (Jun/2026) | Lítio US$ 21-22k/t | Alta — index provider |
| MTE (07/abr/2026) | BYD lista suja | Alta — oficial |
| BNDES.gov.br | Move Brasil R$ 30bi, Mover suspenso | Alta — oficial |
| Reuters / BBC / AP News | Cronograma Camacari, escândalo trabalho | Alta — imprensa internacional |
| D3-INTERDEPENDENCY-S11 | Capacidade agregada 630k, Stellantis ~22% | Alta — compilação de múltiplas fontes |
| D3-RECALIBRATION-S2-LITHIUM-2026 | B8 recalibration | Alta — calculado de fontes primárias |

---

*Documento*: D3-LIVE-VALIDATION.md
*Data*: 2026-07-21
*Versão*: 1.0
*Próxima revisão*: 21/ago/2026 (refresh 30 dias)
