# D3 — Interdependência S1 ↔ S2: Stress conjunto cambial + supply chain

**Documento de análise** · Complementa `D2-AUDIT.md` (gap #1) · Extends `D3-INTERDEPENDENCY-S1-S3.md`
**Data**: 21/jul/2026
**Status**: Working draft

> ⚠️ **ATUALIZAÇÃO 21/jul/2026 (1ª recalibração — sintética)**: Recalibração empírica (ver [D3-RECALIBRATION-S1-S2.md](./D3-RECALIBRATION-S1-S2.md)) com 8 supply events sintéticos calibrados 2015-2025 identificou que VaR supply baseline R$ 5.18B está **superestimado em 45%** (P95 empírico R$ 2.835B). **Weight FX:supply muda de 1:2.49 para 1:1.21**. Hedge sizing em S2 AMBER/RED cai 5-10pp. Dual-sourcing NPV cai de R$ 1.3bi para R$ 720M total.

> 🔴 **ATUALIZAÇÃO 21/jul/2026 (2ª recalibração — REAL lítio público)**: Nova passagem com **dados públicos reais de lítio carbonate** (43 obs mensais 2015-2025, US$ 6k→80k→10k, σ 82.9% annual) — ver [D3-RECALIBRATION-S1-S2-REAL.md](./D3-RECALIBRATION-S1-S2-REAL.md). **VaR supply P95: R$ 2.268M (real, −56% vs D2, −20% vs sintético)**. **Weight FX:supply agora 1:0.97** — FX e supply são quase equivalentes (FX ligeiramente > supply), revertendo o "supply domina" do D2. NPV dual-sourcing cai para R$ 0.57bi total. Gap estrutural no pior cenário cai de R$ 3.78B para R$ 905M (−76%). Hedge sizing em S2 AMBER/RED cai mais 2-3pp.

---

## 1. Por que esta análise

O documento anterior (S1↔S3) modelou o sizing do hedge cambial condicionado ao cenário regulatório. Mas o risco cambial não vive sozinho: em momentos de stress macro, o supply chain também tende a sentir (correlação FX ↔ supply). Esta análise estende o modelo para incluir:

1. **Stress adicional de supply chain** (S2 status): além do VaR cambial, há um VaR de supply (preço de fornecedores alternativos + volume)
2. **Correlação FX ↔ supply**: choques macro tendem a afetar ambos
3. **Matriz 4×3 = 12 cenários** (S3 status × S2 status) com hedge ratio ótimo para cada um

---

## 2. O modelo estendido

### 2.1 Componentes de risco

O P&L do programa tem 3 fontes de variância (no horizonte 6m):

1. **FX (S1)**: σ_PTAX × e × V × √H × z95 = **R$ 2.08B VaR_5%** (constante)
2. **Supply (S2)**: σ_supply × b × V × z95, onde σ_supply depende do S2 status:
   - S2 GREEN: 0% premium (no stress)
   - S2 AMBER: 5% premium (CATL delays, EVE ramping)
   - S2 RED: 15% premium (forced spot purchases, secondary suppliers)
3. **Correlação FX ↔ supply**: ρ = +0.3 (correlação moderada — geopolitical events tendem a afetar ambos)

### 2.2 VaR combinado (R$ B)

| S2 \ S3 | Expansão | Continuidade | RB Parcial | RB Total |
|---|---|---|---|---|
| GREEN | 2.08 | 2.08 | 2.08 | 2.08 |
| AMBER | 3.08 | 3.08 | 3.08 | 3.08 |
| RED | 6.14 | 6.14 | 6.14 | 6.14 |

**Insight**: o VaR total é o mesmo para todos os cenários S3 (porque VaR não depende de ViE, só de exposição FX + supply). O S3 afeta o **margin buffer**, não o VaR.

### 2.3 Hedge ratio ótimo (12 cenários)

| S2 \ S3 | Expansão | Continuidade | RB Parcial | RB Total |
|---|---|---|---|---|
| **GREEN** | 30% (piso) | 38.6% | 61.7% | 90.6% |
| **AMBER** | 47% | 60% | 76% | 95% (teto) |
| **RED** | 76% | 83% | 90% | 95% (teto) |

**Padrões observados**:
- **+ Supply stress → + hedge**: AMBER adiciona ~15-22pp sobre GREEN; RED adiciona ~45-46pp
- **+ Rollback regulatório → + hedge**: em GREEN, Rollback Total requer 91%; em RED, requer 95% (saturado)
- **Teto de 95%**: 3 dos 12 cenários saturam o ceiling — o constraint não-binding para h=100%
- **Saturação de GREEN/RED no Rollback Total**: o risco total é tão grande que 95% de hedge é o máximo recomendado

### 2.4 Premium do hedge (R$ M / 6m)

| S2 \ S3 | Expansão | Continuidade | RB Parcial | RB Total |
|---|---|---|---|---|
| GREEN | 9.5 | 12.1 | 19.5 | 28.6 |
| AMBER | 14.8 | 19.0 | 23.9 | 29.9 |
| RED | 23.9 | 26.2 | 28.3 | 29.9 |

**Custo total anualizado (4 cenários S3 com prob. 0.15/0.40/0.30/0.15)**:

| S2 | Ponderado h | Ponderado premium 6m |
|---|---|---|
| GREEN | 51% | R$ 15.4M |
| AMBER | 64% | R$ 20.2M |
| RED | 85% | R$ 26.7M |

**Ponderado total (média ponderada por probabilidade de S2)** = ~R$ 19.5M/6m = R$ 39M/ano.

---

## 3. As figuras

### Fig 1 — Hedge by S2 × S3 (`fig-d3-s1s2-1-hedge-by-s2s3.png`)

**O que mostra**: matriz 4×3 de hedge ratio ótimo. Cada grupo no X é um cenário S3; cada barra dentro do grupo é um status S2.

**Leitura**: o gráfico mostra que **o stress de supply tem impacto quase tão grande quanto o stress regulatório** sobre o hedge ratio. A progressão de S2 GREEN → RED adiciona ~15-45pp de hedge, comparável à progressão de S3 Expansão → RB Total (~30-60pp).

**Insight crítico**: o trigging S2 RED (e.g., CATL atrasando entregas) **automaticamente justifica mais hedge cambial**, mesmo sem mudança no cenário S3. Isso é contra-intuitivo: o problema é de supply, mas a resposta é aumentar a proteção cambial.

A razão: a correlação positiva entre stress FX e stress supply (ρ=0.3) significa que os dois choques se amplificam. Quando S2 RED acontece, é provável que S1 também esteja pior. Hedge FX extra é uma proteção contra a parte FX do double-shock.

### Fig 2 — Combined VaR decomposition (`fig-d3-s1s2-2-combined-var.png`)

**O que mostra**: decomposição do VaR total em FX VaR + Supply VaR, para cada combinação S2 × S3.

**Leitura**: o FX VaR (R$ 2.08B) é constante. O supply VaR cresce: 0 (GREEN) → R$ 1.73B (AMBER) → R$ 5.18B (RED). No caso RED, o supply VaR é 2.5× maior que o FX VaR — o supply chain é o maior risco, não o câmbio.

**Insight operacional**: em S2 RED, **o hedge cambial sozinho cobre apenas 1/3 do risco total**. A resposta primária deveria ser resolver o problema de supply (dual-sourcing, contratos alternativos), não aumentar hedge. O hedge é uma proteção parcial.

---

## 4. Implicações para D2 prescription

### 4.1 D2 prescreve "hedge 50% flat"

D2 não diferencia entre S2 status. A prescrição D3 condiciona o hedge a S2:

| S2 status | D2 prescribe | D3 prescribe (em Continuidade) | Δ |
|---|---|---|---|
| GREEN | 50% | 38.6% | −11pp (R$ 3.6M economia 6m) |
| AMBER | 50% | 60% | +10pp (R$ 3.0M custo extra 6m) |
| RED | 50% | 83% | +33pp (R$ 14.4M custo extra 6m) |

**A prescrição D2 é inadequada para S2 RED**: a sub-otimização custa R$ 14.4M por 6m em risco não-hedgeado.

### 4.2 Trigger adicional: S2 status

Adicionar ao D3 signal matrix:
- S2 GREEN: status normal
- S2 AMBER: amarelo, revisar hedge +10pp
- S2 RED: vermelho, hedge até 95% (teto) + acionar dual-sourcing emergency

**Trigger source**: feeds de ANFAVEA (volume), MDIC (preço de commodities), news (CATL delays, geopolitical)

### 4.3 Recomendação revisada (atualizada com S1↔S2)

| Status S2 | Status S3 | BNDES | Sinal macro | Ação S1 (hedge) | Ação S2 |
|---|---|---|---|---|---|
| GREEN | Continuidade | Approved | 🟢 | 38.6% | Manter baseline |
| GREEN | Continuidade | Approved | 🔴 | 50% | Acompanhar |
| AMBER | Continuidade | Approved | 🟢 | 60% | Acelerar EVE qualification |
| AMBER | Continuidade | Delayed | 🟡 | 70% | Contratos take-or-pay emergenciais |
| RED | Continuidade | Denied | 🟡 | 83% | **Acionar dual-sourcing emerg.** + bridge |
| RED | Rollback Total | Denied | 🔴 | 95% | **Modo crise supply** + hedge máximo |

---

## 5. Stress test combinado

Cenário de stress máximo (S1 RED + S2 RED + S3 RED + S6 RED):
- FX VaR: R$ 2.08B (com hedge 95% = R$ 0.10B residual)
- Supply VaR: R$ 5.18B (não hedgeável)
- VaR total residual: R$ 5.28B
- Margin buffer (5% de V): R$ 1.5B
- **Gap**: R$ 3.78B

**Esse gap é estrutural**: nem hedge cambial 100% fecha um cenário S2 RED + S3 RED + S6 RED. A solução **não é mais hedge** — é:
1. Acelerar dual-sourcing (reduz supply VaR)
2. Pedir bridge financing (preserva liquidity)
3. Cortar capex não-essencial

**Em outras palavras**: hedge é uma defesa de primeira linha, mas não substitui a ação estrutural em supply chain e regulatório.

---

## 6. Limitações e próximos passos

### 6.1 O que o modelo NÃO captura

1. **Correlação dinâmica**: ρ=0.3 fixo. Em stress real, correlação pode subir para 0.7+
2. **Volatilidade do prêmio do hedge**: em stress, prêmio pode dobrar (counterparty credit)
3. **Hedge natural via pricing pass-through**: ~30-50% da exposição FX tem hedge natural implícito
4. **Timing da degradação de S2**: gradual vs abrupta muda o urgency
5. **Cesta de moedas**: CNY vs USD vs EUR — concentração em CNY muda o hedge target

### 6.2 Próximas análises

- [ ] **S1↔S4** (próximo doc) — hedge vs pricing defensivo
- [ ] **S3↔S4** — incentivos BNDES no break-even de pricing
- [ ] **Stress test multivariado** (gap #8 do audit) — MC com PTAX × lítio × supply shock
- [ ] **S6 → S1/S2/S3/S4 auto-trigger** (gap #9) — formalizar regras de revisão

---

## 7. Acceptance criteria

Para esta análise ser incorporada ao D3:

- [ ] Validação com CSO: assumption de ρ=0.3 (pode ser maior em stress real)
- [ ] Workshop com Head de Supply Chain: cenários S2 status realistas
- [ ] Validação com CFO: budgets para 12 cenários (implica variação de 3× entre mínimo e máximo)
- [ ] Definição de trigger source para S2 (ANFAVEA, MDIC, news feed)
- [ ] Integração com S1↔S3 (matriz 4×3×3 = 36 cenários?)
- [ ] Definição de "modo crise supply" (playbook específico para S2 RED)

---

## Próximo passo

Vide `D3-INTERDEPENDENCY-S1-S4.md` (próximo gap a ser fechado).
