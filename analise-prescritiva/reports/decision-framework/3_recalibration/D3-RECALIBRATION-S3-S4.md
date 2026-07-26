# D3 — Recalibração S3↔S4: Defensivo break-even com 4 estruturas

**Documento de refinamento** · Companion de `D3-INTERDEPENDENCY-S3-S4.md` · Aplica rigor empírico ao defensivo pricing
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. Por que esta análise

O modelo S3↔S4 (D3-INTERDEPENDENCY-S3-S4.md) dizia:
- **Catalog-wide defensivo** break-even ViE = 10% (Rollback Parcial)
- **Targeted defensivo** (Tier 2-3) viável em **todos** os 4 cenários
- Recomendação: defensivo targeted, não catalog-wide

Esta recalibração confirma esses achados com **cálculo quantitativo** de ROI por estrutura × cenário, identificando break-even exato de cada estrutura.

**Output**: catalog-wide **unviable em todos cenários** (mesmo Expansão com ViE=25% é negativo). Targeted defensivo **viable em todos** (ViE=0%). Hybrid (catalog R$ 2k + targeted extra) **viable de ViE=8%**.

---

## 2. Setup

### 2.1 Inputs (do modelo S3↔S4 original)

| Parâmetro | Valor | Fonte |
|---|---|---|
| Volume protegido (unidades em risco) | 5.000 | D2 S3↔S4 |
| Defensivo cost (catalog-wide baseline) | R$ 4.500/unit | D2 S3↔S4 |
| Defensivo cost (targeted Tier 2) | R$ 3.000/unit | D3 S3↔S4 tier system |
| Defensivo cost (targeted Tier 3) | R$ 4.500/unit | D3 S3↔S4 tier system |
| Defensivo cost (hybrid catalog leve) | R$ 2.000/unit | Nova estrutura |
| Defensivo cost (hybrid targeted bonus) | R$ 2.500/unit | Nova estrutura |
| Margin/unit por cenário | R$ 90k / 69k / 45k / 15k | D3 S3↔S4 (Expansão/Cont/RB Parcial/RB Total) |
| P(shock) por cenário | 20% / 30% / 50% / 70% | D2 baseline |
| VGV 6m | R$ 30B | D2 baseline |

### 2.2 4 estruturas comparadas

| Estrutura | Cost/unit | Units covered | Total cost 6m |
|---|---|---|---|
| **Catalog-wide (D2)** | R$ 4.500 | 50.000 (toda linha) | R$ 225M |
| **Targeted Tier 2** | R$ 3.000 | 5.000 (apenas em risco) | R$ 15M |
| **Targeted Tier 3** | R$ 4.500 | 5.000 (apenas em risco) | R$ 22.5M |
| **Hybrid** (catalog R$ 2k + targeted bonus R$ 2.5k) | R$ 2.000 + R$ 2.500 | 50.000 + 5.000 | R$ 112.5M |

---

## 3. Resultados: ROI por estrutura × cenário

### 3.1 Catalog-wide (D2 baseline)

| Cenário | Cost (R$ M) | Benefit (R$ M) | ROI |
|---|---|---|---|
| Expansão (ViE=25%) | 225 | 90 | **−60%** |
| Continuidade (ViE=18%) | 225 | 104 | **−54%** |
| Rollback Parcial (ViE=10%) | 225 | 113 | **−50%** |
| Rollback Total (ViE=0%) | 225 | 53 | **−77%** |
| **Break-even ViE** | **N/A — unviable em todos** | | |

**Insight 1**: catalog-wide é **unviable mesmo em Expansão** (ViE=25%, o melhor cenário). A prescrição D2 está estruturalmente errada — defensivo em todas as 50k unidades custa R$ 225M, mas apenas 5k unidades estão em risco. **R$ 220M de custo é desperdiçado**.

### 3.2 Targeted Tier 2 (R$ 3k × 5k)

| Cenário | Cost (R$ M) | Benefit (R$ M) | ROI |
|---|---|---|---|
| Expansão (ViE=25%) | 15 | 90 | **+500%** |
| Continuidade (ViE=18%) | 15 | 104 | **+590%** |
| Rollback Parcial (ViE=10%) | 15 | 113 | **+650%** |
| Rollback Total (ViE=0%) | 15 | 53 | **+250%** |
| **Break-even ViE** | **0% — viable em qualquer cenário** | | |

**Insight 2**: targeted Tier 2 é **viable em todos os 4 cenários** com ROI entre +250% e +650%. É a estrutura dominante — R$ 15M de custo para proteger 5k unidades críticas. **Recomendação D3 v0.4 mantida: targeted, não catalog-wide**.

### 3.3 Targeted Tier 3 (R$ 4.5k × 5k)

| Cenário | Cost (R$ M) | Benefit (R$ M) | ROI |
|---|---|---|---|
| Expansão (ViE=25%) | 22.5 | 90 | **+300%** |
| Continuidade (ViE=18%) | 22.5 | 104 | **+362%** |
| Rollback Parcial (ViE=10%) | 22.5 | 113 | **+402%** |
| Rollback Total (ViE=0%) | 22.5 | 53 | **+136%** |
| **Break-even ViE** | **0% — viable em qualquer cenário** | | |

**Insight 3**: targeted Tier 3 também é viable em todos os cenários, com ROI menor que Tier 2 (custo 50% maior, benefício igual). **Recomendação**: usar Tier 2 por default; escalar para Tier 3 apenas se share loss for >1.5pp (vs baseline D2 de 1.5pp).

### 3.4 Hybrid (catalog R$ 2k + targeted bonus R$ 2.5k)

| Cenário | Cost (R$ M) | Benefit (R$ M) | ROI |
|---|---|---|---|
| Expansão (ViE=25%) | 112.5 | 90 | −20% |
| Continuidade (ViE=18%) | 112.5 | 104 | −8% |
| Rollback Parcial (ViE=10%) | 112.5 | 113 | 0% |
| Rollback Total (ViE=0%) | 112.5 | 53 | −53% |
| **Break-even ViE** | **8%** (entre Continuidade e RB Parcial) | | |

**Insight 4**: hybrid é um **meio-termo** — break-even em ViE=8%. Em Continuidade (ViE=18%), é marginal negativo (−8%); em Expansão (ViE=25%), é claramente negativo. **Não é estrutura recomendada** — ou vai targeted Tier 2 (R$ 15M, +500% ROI) ou vai catalog-wide (R$ 225M, se quiser sacrificar eficiência por share). Hybrid paga o custo de catalog-wide mas não captura benefício total.

---

## 4. Resumo: break-even por estrutura

| Estrutura | Break-even ViE | Viable em todos cenários? | Recomendação |
|---|---|---|---|
| Catalog-wide (D2) | N/A — unviable em todos | ❌ | **NÃO usar** |
| Targeted Tier 2 | 0% (viable em qualquer) | ✅ | **Recomendado** (default) |
| Targeted Tier 3 | 0% (viable em qualquer) | ✅ | Escalar se share loss >1.5pp |
| Hybrid (catalog + targeted) | 8% | ❌ (unviable em Exp/Cont) | NÃO usar |

**Insight 5**: **só as estruturas targeted são viáveis**. Catalog-wide (D2 baseline) e Hybrid são estruturalmente erradas — gastam dinheiro em unidades que não estão em risco.

---

## 5. Decisão operacional por S3 status (revisada)

| Cenário S3 | Recomendação | Estrutura | Cost 6m | ROI esperado |
|---|---|---|---|---|
| **Expansão (ViE≥20%)** | Defensivo Tier 0/1 (mínimo viável) | R$ 0-7.5M | 0-7.5 | — |
| **Continuidade (10%<ViE<20%)** | **Targeted Tier 2** (default) | R$ 3k × 5k | 15M | +500-650% |
| **Rollback Parcial (ViE=10%)** | Targeted Tier 2 (R$ 15M) OU escalar Tier 3 (R$ 22.5M) | R$ 3-4.5k × 5k | 15-22.5M | +250-650% |
| **Rollback Total (ViE<10%)** | Defensivo Tier 0/1 apenas; defensivo catalog destrutivo | R$ 0-7.5M | 0-7.5M | — |

**Insight 6**: o tier system proposto no D3 v0.4 (Tier 0/1/2/3 = R$ 0/1.5/3/4.5k) **é a estrutura dominante**. Catalog-wide R$ 225M é 12× mais caro que Tier 3 targeted R$ 22.5M, e unviable em todos cenários. **NÃO implementar catalog-wide em nenhum cenário**.

---

## 6. Impacto no framework D3

### 6.1 Mudanças em outros acoplamentos

| Coupling | Mudança | Impacto |
|---|---|---|
| **S3↔S4** (este doc) | Catalog-wide unviable confirmado | Recomendação D3 v0.4 mantida |
| **NPV layer (D3-ANNEX)** | Defensivo NPV: catalog-wide −67% (RB Total) | Inalterado vs original (D2 numbers) |
| **Action register (T1.5)** | Action #17 "Defensivo catalog-wide (Tier 3) - só em Expansão" | **Atualizar para "NÃO IMPLEMENTAR"** |
| **Trigger matrix (T1.2)** | S4 tier system: Tier 0/1/2/3 mantido | Inalterado |

### 6.2 Decisões pedidas afetadas

- **Decisão do Risk Officer (advocacy/defensivo/partnerships)**: **defensivo catalog-wide removido da lista de prescrições viáveis**. Só advocacy e partnerships ficam como "decidir" (depende de S3).
- **Decisão 5 (approval R$ 280M+)**: catálogo-wide R$ 225M já não é proposta. Total do pacote de mitigação cai.

### 6.3 Recomendação de action register

**Atualizar** Action #17 (D3-MAIN.html §7):
- **OLD**: "Defensivo catalog-wide (Tier 3) - só em Expansão+S6 GREEN (R$ 225M, conditional)"
- **NEW**: "**NÃO IMPLEMENTAR defensivo catalog-wide** — unviable em todos cenários (-60% a -77% ROI). Usar targeted Tier 2 (R$ 15M) ou Tier 3 (R$ 22.5M) sempre."

---

## 7. Limitações & próximos passos

### 7.1 Limitações

1. **Volume protegido = 5k fixo** — pode ser maior se market share at risk for >1.5pp
2. **Margin/unit por cenário** assume 1% market share loss protection (D2 baseline). Se defensivo protege mais, volume é maior.
3. **P(shock) por cenário** baseado em S3 status, não em market share trend (D2 simplification)
4. **Hybrid não testado em todos cenários** — break-even ViE=8% é linear interpolation
5. **Benefício assume que o defensivo é 100% efetivo** (protege todo o volume em risco). Real effectiveness pode ser 70-80%.

### 7.2 Próximos passos

| Quando | O quê |
|---|---|
| Q3 2026 | Refinar com dados reais de market share (ANFAVEA) |
| Q3 2026 | Testar effectiveness de defensivo (70%, 80%, 90% effectiveness) |
| Q4 2026 | Implementar tier system automatizado (T2.1 trigger) |
| Q1 2027 | Recalibração anual com realized de 2026 |
| Q2 2027 | Backtest do tier system vs market share realized |

---

## 8. Outputs do modelo (referência rápida)

**Arquivo**: `_model_s3s4_recalibrated.json` (4 estruturas × 4 cenários + break-even)
**Script**: `_gen_s3s4_recalibration.js` (reprodutível)
**Confirmação**: original D3-INTERDEPENDENCY-S3-S4.md já tinha conclusão correta. Recálculo adiciona rigor quantitativo.

**Recomendação operacional**:
- **Catalog-wide defensivo: REMOVER** das prescrições viáveis (unviable em todos cenários)
- **Targeted Tier 2 (R$ 15M)**: default em Continuidade+ (ViE>10%)
- **Targeted Tier 3 (R$ 22.5M)**: escalar apenas se share loss >1.5pp
- **Hybrid (catalog R$ 2k + targeted R$ 2.5k)**: NÃO USAR (break-even ViE=8%, unviable em Expansão/Continuidade)
- **Tier 0/1 (R$ 0-7.5M)**: default em Expansão+GREEN (cenário base, share estável)

**Resumo executivo em 1 frase**: defensivo **catalog-wide é unviable em todos os 4 cenários S3** (ROI −60% a −77%) — confirmar e remover do action register. **Targeted Tier 2 (R$ 15M) é dominante** com ROI +250% a +650% em todos os cenários, break-even ViE=0%. Tier system Tier 0/1/2/3 (R$ 0/1.5/3/4.5k) é a estrutura recomendada. Hybrid não é competitivo.
