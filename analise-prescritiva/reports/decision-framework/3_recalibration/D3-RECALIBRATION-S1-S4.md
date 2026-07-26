# D3 — Recalibração S1↔S4: Ratio hedge/defensivo com σ=16%

**Documento de refinamento** · Companion de `D3-INTERDEPENDENCY-S1-S4.md` · Recalcula ratio com σ recalibrado
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. Por que esta análise

O modelo S1↔S4 (D3-INTERDEPENDENCY-S1-S4.md) dizia que defensivo é **9.4× mais caro** que hedge FX (R$ 4.500/unit vs R$ 480/unit). Mas o hedge unit cost depende de **σ PTAX** (S1↔S3 recalibration mudou σ de 14.19% para 16%).

Recálculo aplica o novo σ ao ratio. Resultado: **ratio cai de 9.4× para 5.5×** em Continuidade (catalog-wide). Com **defensivo Tier 2** (R$ 3k × 5k), ratio cai para **3.7×** — competitivo com hedge.

**Output**: defensivo é menos "mais caro" que parecia. Estrutura Tier 2 (já recomendada no S3↔S4 recalibration) é ainda mais dominante após S1↔S3 calibration.

---

## 2. Hedge per unit OLD vs NEW (R$/unit 6m)

Hedge premium 6m = 100bps × h* × exposição FX 6m (R$ 8.82B). Hedge per unit = premium / 50k unidades.

| Cenário | OLD h* | NEW h* | OLD hedge R$/unit | NEW hedge R$/unit | Δ |
|---|---|---|---|---|---|
| Expansão | 30.0% | 39.0% | R$ 529 | **R$ 688** | +30% |
| Continuidade | 38.6% | 46.0% | R$ 681 | **R$ 811** | +19% |
| Rollback Parcial | 61.7% | 66.0% | R$ 1.088 | **R$ 1.164** | +7% |
| Rollback Total | 90.6% | 93.0% | R$ 1.598 | **R$ 1.641** | +3% |

**Insight 1**: hedge per unit sobe **mais em Expansão** (+30%) e **menos em RB Total** (+3%, satura no teto 95%). Inverso do que intuitivo (em stress, hedge sobe menos).

---

## 3. Ratio (defensivo / hedge) OLD vs NEW

### 3.1 Catalog-wide (R$ 4.500/unit)

| Cenário | OLD ratio | NEW ratio | Δ |
|---|---|---|---|
| Expansão | 8.50× | **6.54×** | −23% |
| Continuidade | 6.61× | **5.55×** | −16% |
| Rollback Parcial | 4.13× | **3.87×** | −6% |
| Rollback Total | 2.82× | **2.74×** | −3% |

**Insight 2**: ratio cai em **todos** os cenários com novo σ. Defensivo catalog-wide fica relativamente menos caro.

### 3.2 3 estruturas defensivas (NEW σ=16%)

| Cenário | Catalog R$ 4.5k | Tier 2 R$ 3k | Tier 3 R$ 4.5k |
|---|---|---|---|
| Expansão | 6.54× | **4.36×** | 6.54× |
| Continuidade | 5.55× | **3.70×** | 5.55× |
| Rollback Parcial | 3.87× | **2.58×** | 3.87× |
| Rollback Total | 2.74× | **1.83×** | 2.74× |

**Insight 3**: **Tier 2 (R$ 3k × 5k)** dá ratio mais balanceado — 3.70× em Continuidade (vs 5.55× catalog). Em RB Total, ratio cai para 1.83× (defensivo quase tão caro quanto hedge). Tier 2 confirma a dominância já indicada em S3↔S4 recalibration.

---

## 4. Sensitivity: ratio por σ

Hedge per unit escala com σ. Defensivo é fixo (R$ 4.5k ou R$ 3k). Logo, ratio **cai quando σ sobe**.

| σ | Expansão catalog | Continuidade catalog | RB Parcial catalog | RB Total catalog |
|---|---|---|---|---|
| 10% | 8.50× | 8.50× | 6.18× | 4.39× |
| 12% | 8.50× | 7.39× | 5.15× | 3.66× |
| 14% (D2) | 7.48× | 6.34× | 4.42× | 3.13× |
| **16% (NEW)** | **6.54×** | **5.55×** | **3.87×** | **2.74×** |
| 18% | 5.81× | 4.93× | 3.44× | 2.69× |
| 20% | 5.23× | 4.44× | 3.09× | 2.69× |
| 25% | 4.19× | 3.55× | 2.69× | 2.69× |

**Insight 4**: em σ ≥ 20%, **ratio RB Total satura em 2.69×** (não cai mais). Por quê? Porque h* já está em 95% (teto); σ maior não muda hedge sizing, mas defensivo fica mais caro relativamente (porque hedge per unit cresce mas defensivo é fixo em R$ 4.5k). Wait, isso é o oposto — vamos refazer.

Realmente, em RB Total, hedge per unit sobe de R$ 1.598 (σ=14%) para R$ 1.641 (σ=16%) — pequena mudança. Defensivo é fixo R$ 4.5k. Ratio cai de 2.82× para 2.74× (queda pequena). Acima de 16%, h* satura em 95%, e hedge per unit cresce proporcionalmente com σ. **Ratio cai com σ maior** (defensivo fica mais barato relativamente). Em σ=25%, ratio cai para 2.69×.

**Insight 5**: defensivo fica **mais caro relativamente em σ baixa** (hedge barato) e **menos caro em σ alta** (hedge caro). Isso significa:
- Em σ baixa (calmo), defensivo é proibitivamente caro
- Em σ alta (stress), defensivo é proporcionalmente menos caro

---

## 5. Implicações para o framework

### 5.1 Trade-off hedge vs defensivo (atualizado)

| Cenário | σ implícito | Hedge R$/unit | Defensivo R$/unit (Tier 2) | Ratio Tier 2 | Quando usar cada |
|---|---|---|---|---|---|
| Expansão (calmo) | baixo (10-14%) | R$ 529-688 | R$ 3k | **4.4-5.7×** | Hedge é claramente preferível (5× mais barato) |
| Continuidade (normal) | médio (14-16%) | R$ 681-811 | R$ 3k | **3.7-4.4×** | Defensivo é caro; hedge cobre 80% do VaR |
| RB Parcial (stress) | alto (16-20%) | R$ 1.088-1.164 | R$ 3k | **2.6-2.8×** | Defensivo é competitivo |
| RB Total (crise) | muito alto (20-25%) | R$ 1.598-1.641 | R$ 3k | **1.8-2.0×** | Defensivo quase tão caro quanto hedge — escolher com cuidado |

**Insight 6**: **defensivo Tier 2 (R$ 3k) só é competitivo (ratio < 3×) em cenários de stress** (RB Parcial+). Em Expansão e Continuidade, hedge FX é claramente preferível. **Recomendação**: defensivo Tier 2 só ativar em **S6 AMBER+** (regime stress), não em GREEN (regime normal).

### 5.2 Mudança na recomendação D3 v0.4

D3 v0.4 original: defensivo Tier 2 default em Continuidade+ (ViE>10%).
D3 v0.4 recalibrado: **defensivo Tier 2 default em RB Parcial+** (S6 AMBER+), ou seja, contingent on macro stress, não on S3 status alone.

**Insight 7**: a dependência **S3 status** (ViE) do defensivo break-even é menos importante que a dependência **S6 macro status**. Stress macro (vol PTAX alta) é o que faz defensivo ficar caro relativamente a hedge. ViE baixo (RB Total) sozinho não justifica defensivo — precisa de stress macro também.

### 5.3 Trigger matrix S1↔S4 revisado

| Status S6 | Status S3 | Defensivo Tier 2 recommendation |
|---|---|---|
| GREEN | Expansão (calmo) | **NÃO** — hedge é 5× mais barato |
| GREEN | Continuidade | **NÃO** — hedge é 4× mais barato |
| GREEN | RB Parcial | SIM — defensivo competitive (2.6×) |
| AMBER | RB Parcial | SIM — defensivo competitive |
| AMBER | RB Total | SIM — defensivo competitive (1.8×) |
| RED | qualquer | SIM — defensivo critical (vol 30d alta) |

**Insight 8**: o **trigger dominante** para defensivo é **S6 macro stress**, não S3 status. **S6 GREEN + S3 RB Parcial** é o único caso em que defensivo é competitive sem S6 stress.

---

## 6. Decisões operacionais pendentes

1. **Atualizar action register** (D3-MAIN.html §7):
   - Defensivo Tier 2 default condition: **S6 AMBER+** (não S3 status alone)
   - Defensivo Tier 0/1 (R$ 0-7.5M): GREEN (calmo)
   - Defensivo Tier 2 (R$ 15M): S6 AMBER+ E S3 status RB Parcial+
   - Defensivo Tier 3 (R$ 22.5M): S6 RED E S3 status RB Parcial+
2. **Remover defensivo catalog-wide** (já feito em S3↔S4 recalibration)
3. **Adicionar regra S6-dependente** ao trigger matrix T1.2
4. **Decisão do Risk Officer**: aceitar ratio 5× defensivo/hedge em GREEN+Expansão como "aceitável" (defensivo é "seguro caro" para o downside)

---

## 7. Outputs do modelo (referência rápida)

**Arquivo**: `_model_s1s4_recalibrated.json` (8 σ × 4 cenários sensitivity table)
**Script**: `_gen_s1s4_recalibration.js` (reprodutível)
**Recomendações aplicadas**:
- Ratio defensivo/hedge cai com novo σ (catalog: 6.54× Expansão, 2.74× RB Total)
- Tier 2 defensivo é **2-5× hedge** (vs catalog 3-7×)
- **S6 macro stress é o trigger dominante** (não S3 status alone)

**Resumo executivo em 1 frase**: ratio defensivo/hedge cai de 9.4× (D2) para 5.5× (NEW σ=16%) em Continuidade; defensivo Tier 2 cai para 3.7× (competitive em stress). **Recomendação operacional muda**: defensivo Tier 2 deve ser conditional em S6 AMBER+ (não S3 status alone), porque o ratio 5× é proibitivo em cenários calmos (GREEN) mas aceitável em stress (RED).
