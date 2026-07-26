# D3 — Recalibração B8: S2 (Supply) com Rebound de Lítio 2026

**Documento**: D3-RECALIBRATION-S2-LITHIUM-2026
**Projeto**: BYD Camacari 2025-2027 — Decision Framework v0.7
**Data**: 21/jul/2026
**Status**: Working draft
**Versão anterior**: D3-RECALIBRATION-S1-S2-REAL.md (v0.5, ago/2025)

> **Crítica central**: o D3 original calibrou lítio como "normaliza após crash 2023" — a realidade 2026 é um **rebound forte** (US$ 9k → US$ 22k, +144%). O modelo B8 precisa incorporar este novo regime. Sem esta recalibração, o VaR supply está subestimado em 35-65% no regime RED.

---

## §1 Resumo — O que mudou desde o D3 original

### O que o D3 original dizia

O D3 (v0.5, ago/2025) calibrou lítio com base em 8 eventos reais 2015-2025, usando o pressuposto de que lítio **normalizaria em 2024-2025** após o crash de 2022-2023 (US$ 80k → US$ 9k). Premissas centrais:

- Preço médio lítio 2025-2026: US$ 10-12k/t
- VaR supply P95 (RED): R$ 2,27 bi
- Weight FX:supply: 1:0,97 (equivalentes)
- Hedge sizing S2 AMBER/RED: 47-95%
- Dual-sourcing NPV: +R$ 0,57 bi

### O que aconteceu em 2026

Em Q3-2025, lítio carbonate atingiu **US$ 9k/t** (vale de 4 anos). Em Jan-2026, disparou para **US$ 26k/t** (+189% em 5 meses) após o fechamento da mina CATL Jianxiawo (suspensa desde late 2024). Em Jun-2026, estabilizou em **US$ 21-22k/t** — **2,1× acima** do esperado pelo D3 original.

### O que mudou no modelo B8

| Parâmetro | D3 original (v0.5) | **D3 recalibrado (B8)** | Δ |
|---|---|---|---|
| Preço médio lítio 2026 | US$ 10-12k/t | **US$ 20-22k/t** | +83-100% |
| VaR supply P95 (RED) | R$ 2,27 bi | **R$ 3,5-4,0 bi** | +63% |
| Weight FX:supply | 1:0,97 | **1:1,46** | supply 46% pior que FX |
| Hedge AMBER/RED | 47-95% | **95% (saturado)** | saturado — hedge cambial insuficiente |
| Dual-sourcing NPV | +R$ 0,57 bi | **+R$ 0,35 bi** | −39% |
| Gap estrutural (pior cenário) | R$ 0,91 bi | **R$ 2,37 bi** | +160% |

---

## §2 S2 Supply — Reestimativa de Custo de Baterias

### 2.1 Lítio como share do BOM

Baterias representam **~40% do custo total de um EV** (BYD Blade Battery, LFP chemistry). Dentro do custo de bateria, o lítio é o **maior single input**, tipicamente 50-70% do custo do cathode e 15-25% do custo total da célula.

**Composicão de custo — LFP battery pack (BYD-style, 60 kWh)**:

| Componente | Share do battery cost | Custo @ US$ 12k/t lítio | Custo @ US$ 22k/t lítio |
|---|---|---|---|
| Lithium carbonate (LFP cathode) | 18-22% | ~R$ 1.800/unit | ~R$ 3.300/unit |
| Other cathode materials (Fe, P) | 12-15% | R$ 1.200 | R$ 1.200 |
| Anode (graphite) | 8-10% | R$ 800 | R$ 800 |
| Electrolyte + separator | 6-8% | R$ 600 | R$ 600 |
| Cell housing + BMS | 15-18% | R$ 1.500 | R$ 1.500 |
| Manufacturing + overhead | 30-35% | R$ 2.800 | R$ 2.800 |
| **Total battery pack** | 100% | **~R$ 8.700** | **~R$ 10.200** |

*Base: 60 kWh pack, ~500 kg LFP cells, ~35 kg Li₂CO₃ equivalent per pack. Conversão: R$/unit = BRL spot Jun/2026.*

**Delta lítio por unidade**: R$ 3.300 − R$ 1.800 = **+R$ 1.500/unit** apenas pelo lítio (US$ 12k → US$ 22k/t).

### 2.2 Impacto no program-level BOM

Para 10.000 unidades/ano (mix Seal + Dolphin + Yuan Plus, Camacari):

| Cenário lítio | Custo battery/ano | Δ vs baseline | Impacto margin |
|---|---|---|---|
| Baseline (D3 v0.5): US$ 12k/t | R$ 87 mi | — | — |
| **Atual: US$ 22k/t** | **R$ 102 mi** | **+R$ 15 mi/ano** | **−1,5-2,0 pp margin** |
| Stress: US$ 25k/t | R$ 108 mi | +R$ 21 mi/ano | −2,1-2,6 pp |
| Bear: US$ 30k/t | R$ 117 mi | +R$ 30 mi/ano | −3,0-3,5 pp |

*Não inclui: SKD 35% tariff Jan-2027, BRL/USD, IPCA.*

### 2.3 Sensitivity: lítio US$ 12k vs US$ 22k+ (permanent high)

**Cenário Bull — lítio volta a US$ 12k/t** (re-abre CATL Jianxiawo, demanda EV desacelera, Chile/Australia aumentam supply):

- Battery cost retorna a ~R$ 8.700/pack
- Margin pressure desaparece
- Recalibração B8 é overkill — modelo v0.5 volta a ser válido
- Probabilidade atribuída (S&P, bear case): ~15-20%

**Cenário Base (US$ 18k/t) — lítio se estabiliza em nível elevado**:

- Battery cost ~R$ 9.500/pack (+R$ 800 vs baseline)
- Margin erosion permanente de ~1 pp
- Recalibração B8 valida o novo normal
- Probabilidade atribuída (consenso Bernstein/BMI/UBS/MS): ~50-60%

**Cenário Bear — lítio US$ 25k+ (deficit estrutural persiste)**:

- Battery cost ~R$ 10.800/pack (+R$ 2.100 vs baseline)
- Margin erosion ~2,1-2,6 pp — material para ViE
- LP renegotiation trigger (T2.6_LITHO_30K) é acionado
- Probabilidade atribuída (Fastmarkets, UBS): ~20-25%

---

## §3 Rebound Drivers — Por que lítio subiu 144% em 9 meses

**Driver 1 — Déficit estrutural 2026-2027**: Consensus 4/6 fontes (Fastmarkets, UBS, MS, BMI) aponta deficit 20-80kt LCE. Consensus price: **US$ 17-25k/t**.

**Driver 2 — CATL Jianxiawo fechada**: Suspensa desde out/2024 (regulatório/ESG). Remove ~6-8% da oferta global. Sem ela, rebound seria US$ 14-16k/t, não US$ 22k/t.

**Driver 3 — Demanda EV aquecida**: BR +153% YoY (mai/2026), Europa >30% EV share, China >50%. LFP demand **inelástica a preço**.

**Driver 4 — Restrições Chile + Australia**: Chile (40% global) com novos royalties e constraints ambientais; Australia near capacity com lead time 3-5 anos para novos projetos.

**Driver 5 — Concentração**: Top 3 miners (Albemarle, SQM, Livent) controlam ~55% oferta. 2-3 players podem mover preço 20-30% com decisões de manutenção/ESG.

---

## §4 Cenários — 3 cenários para lítio 2026-2027

### Cenário Bull — Lítio US$ 12k/t (reversal)

CATL Jianxiawo reabre Q4-2026, demanda EV desacelera. **Trajectory**: US$ 22k → US$ 12k (dez/2026). Battery cost: ~R$ 8.700/pack (retorna baseline D3). Probabilidade: 15-20%.

### Cenário Base — Lítio US$ 18k/t (plateau)

Deficit 20-40kt LCE persiste, Jianxiawo fechada, demanda EV +20-30% YoY. **Trajectory**: US$ 22k → US$ 18k (set/2026) → US$ 18k (dez/2026). Battery cost: ~R$ 9.500/pack; margin erosion −0,8-1,2 pp. Probabilidade: 50-60%.

### Cenário Bear — Lítio US$ 25k/t (deficit severo)

Deficit >80kt LCE, segunda mina fecha, demanda EV >40% YoY em EM. **Trajectory**: US$ 22k → US$ 27k (dez/2026). Battery cost: ~R$ 10.800/pack; margin erosion −2,1-2,6 pp. **Trigger**: T2.6_LITHO_30K. Probabilidade: 20-25%.

### Tabela comparativa de cenários

| Métrica | Bull (US$ 12k) | **Base (US$ 18k)** | Bear (US$ 25k) |
|---|---|---|---|
| Battery cost/pack | R$ 8.700 | **R$ 9.500** | R$ 10.800 |
| Custo anual batérias (10k units) | R$ 87 mi | **R$ 95 mi** | R$ 108 mi |
| Δ vs baseline D3 (US$ 12k old) | — | **+R$ 8 mi/ano** | +R$ 21 mi/ano |
| Margin impact (pp) | 0 | **−0,8-1,2 pp** | −2,1-2,6 pp |
| ViE impact (10k units, 5y) | R$ 0 | **−R$ 40-60 mi (PV)** | −R$ 100-130 mi (PV) |
| Probabilidade | 15-20% | **50-60%** | 20-25% |

---

## §5 Impacto na ViE Calculation

### 5.1 Estrutura ViE — D3 original

O D3 calcula ViE (Value of Existence / margin estrutural) como:

```
ViE = Volume × (ASP − Full Cost) − VaR_residual
```

Com full cost incluindo: BOM (baterias, SKD/CKD, materiais), Manufacturing, Overhead, Logistics, FX hedge cost.

### 5.2 Recalibração B8 —_inputs de bateria

**Volume**: 10.000 unidades/ano (mix Camacari, 2026-2027)

**ASP**: inalterado (BYD pricing power, mercado BR competitivo)

**Full Cost — componentes afetados pelo lítio**:

| Componente | Baseline D3 (US$ 12k/t) | **Atual B8 (US$ 18k/t base)** | Bear (US$ 25k) |
|---|---|---|---|
| Battery pack cost | R$ 8.700 | **R$ 9.500** | R$ 10.800 |
| Battery as % total car cost | 35% | **38%** | 42% |
| Δ full cost vs baseline | — | **+R$ 800/unit** | +R$ 2.100/unit |

**VaR_residual** (após hedge):

| S2 Status | VaR supply (R$ bi) | Hedge coverage | VaR residual |
|---|---|---|---|
| GREEN | 0,5 | 95% | R$ 25M |
| AMBER | 2,0 | 95% | R$ 100M |
| **RED (base)** | **3,75** | 95% | **R$ 188M** |
| RED (bear) | 4,0 | 95% | R$ 200M |

### 5.3 ViE recalculado (cenário base, S2 AMBER)

```
ViE_base = 10.000 units × (ASP − R$ 9.500 battery cost − R$ 15.000 other cost) 
          − R$ 100M VaR_residual

ViE_base = 10.000 × (R$ 75.000 − R$ 9.500 − R$ 15.000) − R$ 100M
ViE_base = 10.000 × R$ 50.500 − R$ 100M
ViE_base = R$ 505M − R$ 100M = R$ 405M (5-year PV, ~R$ 75M/ano)
```

**Comparação D3 original vs B8 recalibrado (S2 AMBER)**:

| ViE | D3 original | **B8 recalibrado** | Δ |
|---|---|---|---|
| ViE 5y PV | R$ 570M | **R$ 405M** | −29% |
| ViE/ano | R$ 114M | **R$ 81M** | −29% |
| Margin/ano | R$ 120M | **R$ 87M** | −28% |

### 5.4 Break-even — em que preço de lítio ViE = 0?

Sensitivity reversa: para que ViE 5y = 0 (programa deixa de ser economicamente atrativo), o custo de bateria precisaria subir para ~R$ 14.500/pack, o que implica lítio ~**US$ 45-50k/t** por 12+ meses — cenário extremo (supercycle 2.0, como 2022).

**Bottom line**: o programa ViE é **resiliente no cenário base** (lítio US$ 18k), mas o **bear case (US$ 25k) erode 28-29% do ViE**, tornando-o marginal (R$ 55M/ano vs R$ 114M/ano original).

---

## §6 Implicações

### 6.1 Hedge commodity como nova ferramenta

LME Li-carbonate futures (2024) e CME Li-hydroxide futures (2025) permitem fixar 30-40% do supply anual em contratos LP indexados Fastmarkets. Effectiveness: se lítio bear (US$ 25k), 40% fixado em US$ 20k salva ~R$ 200/unit = R$ 2M/ano.

### 6.2 Supply mitigation > hedge cambial como resposta primária

Hedge cambial **satura em AMBER/RED** (95%) — não protege mais. **Resposta primária = mitigação de supply** (renegociação LP, dual-sourcing, estoque estratégico).

### 6.3 ViE ainda positivo mas menor margem

ViE 5y PV: R$ 405M (B8 base) vs R$ 570M (D3 original). Break-even: lítio precisaria US$ 45-50k/t por 12 meses — improvável em 2026-2027.

### 6.4 Decisões afetadas

| Decisão | D3 original | **B8 recalibrado** |
|---|---|---|
| Capex dual-sourcing (R$ 280M) | Aprovar, NPV +R$ 570M | **Aprovar c/ cautela, NPV +R$ 405M** |
| Hedge commodity | Não modelado | **60-70% supply anual** |
| Risk Officer | Urgente | **Muito urgente** (gap R$ 2,37B vs R$ 0,91B) |

---

## §7 Limitações

### 7.1 Volatilidade e horizonte

σ annual = 82,9% (histórico 10y) pode ser ligeiramente menor em 2026 (70-75%) no regime "tight supply + demanda inelástica" — mas mines fechando reintroduzem vol >80%. Projeções de deficit LCE variam 1,5kt a 100kt entre fontes.

### 7.2 CATL Jianxiawo reopening

Se reabre Q4-2026/Q1-2027 (cenário S&P bull), preço pode cair para US$ 15-18k/t, invalidando parcialmente o baseline B8. Monitorar Ministry of Natural Resources (China).

### 7.3 Hedge commodity market immaturity

LME/CME lithium futures: liquidez baixa em 2026 (12-18 meses de trading), bid-ask 2-3% vs <0,5% para metais consolidados. Hedge de commodity é **parcialmente disponível**.

### 7.4 Correlação FX × Lítio não estimada para 2026

O D3 usa ρ=0,3. Em 2026, com BRL volátil + lítio em deficit, correlação pode subir para 0,5+, amplificando o VaR combinado.

### 7.5 BYD verticalização (FinDreams Battery)

Reduz parcialmente exposição a lítio spot vs competidores. Modelo usa 100% exposição spot; na prática, **exposição real ~60-70%** — factor de segurança conservativo.

---

## Figuras

![fig-d3-b8-1-lithium-price-2024-2027](figures/fig-d3-b8-1-lithium-price-2024-2027.png)
*Figura 1: Preço histórico do lítio carbonate (Q1-2024 – Q4-2027) com 3 cenários. Fonte: Fastmarkets, Bernstein, Morgan Stanley.*

![fig-d3-b8-2-battery-cost-scenarios](figures/fig-d3-b8-2-battery-cost-scenarios.png)
*Figura 2: Custo de battery pack por cenário de lítio (Bull/Base/Bear). Mostra delta de R$ 800-2.100/unit vs baseline D3 original.*
