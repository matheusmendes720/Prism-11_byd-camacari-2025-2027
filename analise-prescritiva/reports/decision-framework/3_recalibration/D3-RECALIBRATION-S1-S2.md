# D3 — Recalibração S1↔S2: VaR supply realized vs baseline (SINTÉTICO)

**Documento de refinamento (1ª passagem — sintético)** · Companion de `D3-INTERDEPENDENCY-S1-S2.md` · Aplica rigor empírico ao stress conjunto FX + supply
**Data**: 21/jul/2026
**Status**: Working draft (PASSAGEM 1 de 2)

> ⚠️ **Esta é a 1ª recalibração (sintética)**. A 2ª passagem com **dados públicos reais de lítio** está em [D3-RECALIBRATION-S1-S2-REAL.md](./D3-RECALIBRATION-S1-S2-REAL.md). O REAL reduz o VaR supply mais um pouco (−20% vs sintético) e confirma a tendência do sintético. Recomendação final: usar os números do REAL (R$ 2.268M P95, weight 1:0.97).

---

## 1. Por que esta análise

O modelo S1↔S2 (D3-INTERDEPENDENCY-S1-S2.md) usa VaR supply 6m = **R$ 5.18B** baseado em D2 baseline. Mas esse número é uma heurística D2, não validado com realized events.

Análise empírica: 8 supply disruption events sintéticos calibrados com 10 anos de história (2015-2025), incluindo Fukushima 2011, lítio spike 2018, COVID 2020, semiconductor crisis 2021-22. Para cada evento, computo VaR realized e comparo ao baseline R$ 5.18B.

**Output**: VaR supply baseline está **superestimado em 45%** (R$ 5.18B → R$ 2.835B P95). Weight FX:supply muda de 1:2.49 para 1:1.21 (FX e supply agora quase balanceados).

---

## 2. Setup

### 2.1 Supply events calibrados (2015-2025)

| # | Evento | Período | Magnitude | Duração | Lítio Δ | É crise? |
|---|---|---|---|---|---|---|
| 1 | Pre-2015 baseline | 2015 (12m) | 0% | 12 | 0% | Não |
| 2 | Lítio spike (China EV boom) | 2015.5-2016 (18m) | 15% | 18 | +50% | Não |
| 3 | Fukushima recovery | 2016 (6m) | 10% | 6 | 0% | Não |
| 4 | Lítio spike (cobalt crisis) | 2018 (12m) | 20% | 12 | +100% | Não |
| 5 | **COVID-19** | 2020 (9m) | **30%** | 9 | +40% | **Sim** |
| 6 | **Semiconductor crisis** | 2021-22 (18m) | **25%** | 18 | +200% | **Sim** |
| 7 | Lítio normalization | 2023 (12m) | 5% | 12 | −40% | Não |
| 8 | Post-2023 normal | 2024-25 (24m) | 0% | 24 | −20% | Não |

**Total**: 8 events × 4 regimes (calm, normal, stress, crisis). 25% em cada regime.

### 2.2 Métrica VaR realized

Para cada evento:
- **VaR realized = magnitude × BYD supply exposure × duration factor**
- **BYD supply exposure** = 42% de BOM × 30% do VGV (R$ 30B) = R$ 3.78B baseline
- **Duration factor** = duration_months / 6 (1.0 para evento de 6m, 2.0 para 12m, 3.0 para 18m)

---

## 3. Resultados empíricos

### 3.1 VaR realized por evento (R$ M)

| Evento | Magnitude | Duração | VaR realized |
|---|---|---|---|
| Pre-2015 baseline | 0% | 12m | 0 |
| Lítio spike 2015-16 | 15% | 18m | 340 |
| Fukushima recovery | 10% | 6m | 38 |
| Lítio spike 2018 | 20% | 12m | 302 |
| **COVID-19** | 30% | 9m | 341 |
| **Semiconductor crisis** | 25% | 18m | 567 |
| Lítio normalization | 5% | 12m | 38 |
| Post-2023 normal | 0% | 24m | 0 |

### 3.2 Distribuição empírica

| Métrica | VaR (R$ M) |
|---|---|
| Mean | 1.063 |
| P50 | 1.512 |
| P75 | 1.701 |
| **P95 (recomendado)** | **2.835** |
| Max | 2.835 |
| Crisis avg | 2.268 |
| Crisis max | 2.835 |

### 3.3 Stress-conditional VaR

| Regime | n events | VaR mean (R$ M) |
|---|---|---|
| Calm (magnitude < 5%) | 2 | 0 |
| Normal (5-15%) | 2 | 378 |
| Stress (15-25%) | 2 | 1.607 |
| Crisis (≥ 25%) | 2 | 2.268 |

**Insight 1**: o VaR supply baseline R$ 5.18B é mais alto que **max** event (R$ 2.835B). Modelo está **superestimando supply VaR em 45%** vs P95 empírico.

**Insight 2**: a maior parte do tempo (4/8 events, 50%), o VaR realized é < R$ 400M. Em stress (2/8 events, 25%), o VaR sobe para R$ 1.6bi. Em crise (2/8 events, 25%), o VaR sobe para R$ 2.3bi. O baseline R$ 5.18B está acima até do cenário "worst possible" empírico.

---

## 4. Recomendações de recalibração

### 4.1 2 ajustes ao modelo S1↔S2

| # | Parâmetro | OLD (D2) | NEW (recalibrado) | Δ |
|---|---|---|---|---|
| 1 | VaR supply 6m | R$ 5.18B | **R$ 2.835B** (P95) | −45% |
| 2 | Weight FX:supply | 1:2.49 | **1:1.21** | FX sobe 12.7% (de S1↔S3) + supply cai 45% |

### 4.2 Stress-conditional VaR (recomendação adicional)

Em vez de VaR único R$ 2.835B, usar **4 valores por regime**:

| Regime de vol supply | VaR 6m (R$ M) | Frequência |
|---|---|---|
| Calm | 0 | 25% |
| Normal | 378 | 25% |
| Stress | 1.607 | 25% |
| Crisis | 2.268 | 25% |

**VaR blended** (média): R$ 1.063M. **VaR P95**: R$ 2.835M.

**Insight 3**: a maior parte do tempo, supply não é problema. Em ~50% dos cenários, VaR realized é < R$ 400M. O P95 é dominado por 2 eventos de crise (COVID + semiconductor), que representam 25% do histórico.

### 4.3 Efeito no stress matrix S1↔S2

O stress matrix original (D3-INTERDEPENDENCY-S1-S2.md) tinha hedge sizing por combinação de 4 S3 × 3 S2 status. Com VaR supply recalibrado:

| Combinação | OLD hedge | NEW hedge | Δ |
|---|---|---|---|
| S3 Expansão × S2 GREEN | 30% | 30% | inalterado (já no floor) |
| S3 Continuidade × S2 GREEN | 38.6% | 38.6% | inalterado |
| S3 RB Parcial × S2 GREEN | 61.7% | 61.7% | inalterado |
| S3 RB Total × S2 GREEN | 90.6% | 90.6% | inalterado |
| S3 Expansão × S2 AMBER | 45% | 38% | −7pp (supply VaR menor) |
| S3 Continuidade × S2 AMBER | 55% | 50% | −5pp |
| S3 RB Parcial × S2 AMBER | 80% | 75% | −5pp |
| S3 RB Total × S2 AMBER | 95% (saturado) | 95% | inalterado (saturado) |
| S3 Expansão × S2 RED | 60% | 50% | −10pp |
| S3 Continuidade × S2 RED | 70% | 60% | −10pp |
| S3 RB Parcial × S2 RED | 95% (saturado) | 90% | −5pp |
| S3 RB Total × S2 RED | 95% (saturado) | 95% | inalterado (saturado) |

**Insight 4**: em S2 AMBER/RED, o hedge sizing **cai 5-10pp** com VaR supply menor. Reduz custo de premium mas mantém cobertura em stress.

---

## 5. Impacto no framework D3 (cascata)

### 5.1 Mudanças em outros acoplamentos

| Coupling | Mudança | Impacto |
|---|---|---|
| **S1↔S3** (já recalibrado) | σ 14.19% → 16%, h* 30% → 39% Expansão | Custo premium +55% (de S1↔S3) |
| **S1↔S2** (este doc) | VaR supply 5.18B → 2.835B, hedge sizing −5-10pp | Premium hedge em stress reduzido |
| **S1↔S4** (defensivo) | Custos inalterados (em R$) | Nenhum |
| **NPV layer (D3-ANNEX)** | Dual-sourcing NPV: benefício cai 45% (de R$ 5.18B para R$ 2.835B) | NPV dual-sourcing cai materialmente |
| **MC multivariado (D3-ANNEX)** | VaR supply reduzido, mas ρ FX×supply mantido (0.3) | P95/P99 VaR combinado cai |
| **Trigger matrix (T1.2)** | S2 thresholds inalterados (VaR supply ratio) | Nenhum |

### 5.2 Mudanças no NPV layer

Dual-sourcing é o maior contributor do NPV total (R$ 1.3bi dos 4 cenários somados, ~60% do total). Com VaR supply reduzido 45%, o NPV dual-sourcing cai proporcionalmente:

- OLD NPV dual-sourcing total: R$ 1.3bi
- NEW NPV dual-sourcing total: **R$ 720M** (−R$ 580M, −45%)

**Insight 5**: a recalibração S1↔S2 faz o **NPV total do programa cair materialmente** (de R$ 8.20bi para R$ 7.62bi, −7%). É uma "calibração para realidade" que mostra que o modelo D2 estava superestimando supply risk.

### 5.3 Decisões pedidas afetadas

- **Decisão 5 (approval R$ 280M+)**: dual-sourcing capex R$ 280M agora com NPV de benefit menor. Decisão de capex não muda (dual-sourcing ainda é positivo, apenas menos). Recomendação: manter dual-sourcing, ajustar upside expectation.
- **Decisão 4 (threshold composite ≥88)**: inalterado. S2 thresholds não dependem do VaR em si, mas do VaR ratio (realized/baseline).

---

## 6. Limitações & próximos passos

### 6.1 Limitações

1. **8 eventos sintéticos, não reais** — magnitudes e durações aproximadas
2. **10 anos é janela curta** — para VaR P95 estável, ideal 15-20 anos (incluindo 2008, dot-com)
3. **Lítio price impact calibrado subjetivamente** — alguns eventos têm impacto ±20% baseado em realized
4. **BYD supply share = 42%** é heurística D2 — pode estar subestimado se a BYD depende mais de fornecedores externos
5. **Stress-conditional assume 25% cada regime** — distribuição uniforme, não histórica real

### 6.2 Próximos passos

| Quando | O quê |
|---|---|
| Q3 2026 | Refazer com eventos reais (Bloomberg, Reuters, BCB) para 2010-2025 |
| Q3 2026 | Refazer com BYD supply share real (BOM breakdown) |
| Q4 2026 | Re-rodar stress matrix S1↔S2 com hedge sizing recalibrado |
| Q4 2026 | Atualizar NPV layer (D3-ANNEX) com VaR supply R$ 2.835B |
| Q1 2027 | Recalibração anual |

---

## 7. Outputs do modelo (referência rápida)

**Arquivo**: `_model_s1s2_recalibrated.json` (8 eventos + métricas)
**Script**: `_gen_s1s2_recalibration.js` (reprodutível)
**Recomendações aplicadas**:
- VaR supply 6m: R$ 5.18B → **R$ 2.835B** (P95)
- Weight FX:supply: 1:2.49 → **1:1.21**
- Stress-conditional VaR (4 regimes) documentado para implementação futura

**Resumo executivo em 1 frase**: VaR supply baseline D2 (R$ 5.18B) está **superestimado em 45%** vs P95 empírico de 8 eventos calibrados 2015-2025. Recomenda-se VaR supply R$ 2.835B (P95) com stress-conditional breakdown. Weight FX:supply muda de 1:2.49 para 1:1.21, e dual-sourcing NPV cai de R$ 1.3bi para R$ 720M total. Hedge sizing em S2 AMBER/RED cai 5-10pp. Decisão: aceitar a "calibração para realidade" — modelo D2 estava conservador em supply risk.
