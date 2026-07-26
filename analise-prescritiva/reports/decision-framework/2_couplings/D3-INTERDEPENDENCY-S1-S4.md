# D3 — Interdependência S1 ↔ S4: Hedge cambial × Pricing defensivo

**Documento de análise** · Complementa `D2-AUDIT.md` (gap #1) · Companion de `D3-INTERDEPENDENCY-S1-S3.md` e `D3-INTERDEPENDENCY-S1-S2.md`
**Data**: 21/jul/2026
**Status**: Working draft

> ⚠️ **ATUALIZAÇÃO 21/jul/2026**: Recalibração empírica (ver [D3-RECALIBRATION-S1-S4.md](./D3-RECALIBRATION-S1-S4.md)) com novo σ=16% recomputa ratio defensivo/hedge: **catalog cai de 9.4× para 5.5× (Continuidade)**, **Tier 2 cai para 3.7×**. **Recomendação operacional muda**: defensivo Tier 2 deve ser conditional em S6 AMBER+ (não S3 status alone), porque ratio 5× é proibitivo em GREEN mas aceitável em stress.

---

## 1. Por que esta análise

D2 prescreve simultaneamente:
- **S1**: hedge 50% (R$ 80M/ano) para proteger **margem** contra FX
- **S4**: pricing defensivo (R$ 320M/ano) para proteger **volume** contra Tesla Model 2

Mas os dois **não servem ao mesmo propósito**:
- Hedge FX: cobre risco de **custo** (BOM em USD sobe → margem cai)
- Pricing defensivo: cobre risco de **receita** (concorrente entra → volume cai → margem cai)

São instrumentos diferentes, com custos diferentes, com break-evens diferentes. D2 não modela a interação nem deixa claro quando cada um é o instrumento certo.

Esta análise:
1. Compara os custos por unidade de cada instrumento
2. Calcula o ROI do pricing defensivo sob diferentes premissas
3. Mapeia a matriz 2×2 (hedge level × defensivo level)
4. Define quando cada um deve ser ativado

---

## 2. A estrutura dos custos

### 2.1 Hedge cambial

- **Custo**: 100 bps/ano sobre a exposição FX coberta
- **Exposição FX** (D2 S1): 42% de BOM = 0.42 × 0.70 × V = **0.294 de V**
- **VGV 6m**: R$ 30B
- **Hedge premium 6m a 38.6%** (cenário Continuidade): R$ 24M
- **Custo por unidade** (50k units em 6m): R$ 480/unit

### 2.2 Pricing defensivo

- **Custo**: R$ 4.5k por unidade (D2 S4: 1.5% do catálogo de R$ 300k)
- **Volume protegido**: 5k unidades em 6m (D2 assume 1.5pp de share preservation)
- **Custo total 6m**: R$ 4.5k × 50k = **R$ 225M**
- **Custo por unidade** (média sobre 50k): R$ 4.500/unit

### 2.3 Comparação direta

| Instrumento | Custo/unidade | Custo total 6m | Função |
|---|---|---|---|
| Hedge FX | R$ 480 | R$ 24M | Protege margem (BOM FX) |
| Pricing defensivo | R$ 4.500 | R$ 225M | Protege volume (market share) |
| Ratio | **9.4×** | 9.4× | — |

**Insight 1**: pricing defensivo é 9.4× mais caro por unidade que hedge FX. Mas servem propósitos diferentes — não são substitutos.

**Insight 2**: defensivo custa R$ 225M para proteger 5k unidades de volume. Cada unidade protegida custa R$ 45k (5k × R$ 45k = R$ 225M, que é o custo de defensivo aplicado a todas as 50k unidades). A real pergunta é: defensivo deveria ser **catalog-wide** ou **targeted**?

### 2.4 ROI do defensivo: a estrutura importa

**Cenário A: Defensivo catalog-wide** (aplicado a todas as 50k unidades)
- Custo: R$ 4.5k × 50k = R$ 225M
- Benefício: 5k unidades × R$ 15k de margem = R$ 75M
- ROI: (R$ 75M − R$ 225M) / R$ 225M = **−67%** (destrutivo)

**Cenário B: Defensivo targeted** (aplicado apenas às 5k unidades em risco)
- Custo: R$ 4.5k × 5k = R$ 22.5M
- Benefício: 5k × R$ 15k = R$ 75M
- ROI: (R$ 75M − R$ 22.5M) / R$ 22.5M = **+233%** (muito positivo)

**Insight 3**: o ROI do defensivo varia de −67% a +233% dependendo da estrutura. D2 não distingue.

A estrutura certa depende de:
- **Cesta de modelos e trims**: nem todo modelo precisa de defensivo (e.g., trims mais altos têm margem maior)
- **Geografia**: defensivo em SP é desnecessário (BYD tem 38% share); defensivo em RJ e MG é crítico
- **Segmento de cliente**: fleet vs B2C tem elasticidade diferente
- **Timing**: defensivo Q3-Q4 2026 pré-Model 2 vs Q1 2027 pós-Model 2

### 2.5 Break-even de volume protegido

Para defensivo catalog-wide ser positivo:
- Custo = R$ 4.5k × 50k = R$ 225M
- Benefício = X unidades × R$ 15k
- Break-even: X = R$ 225M / R$ 15k = **15k unidades**

Ou seja, defensivo catalog-wide só vale a pena se proteger **mais de 15k unidades** (30% das 50k do semestre). É improvável que a ameaça competitiva justifique 30% de share preservation num único semestre.

---

## 3. A matriz 2×2 (hedge × defensivo)

A escolha entre hedge e defensivo deve considerar:
- **Se a ameaça é FX** (PTAX volátil) → hedge é a resposta certa
- **Se a ameaça é competitividade** (Tesla Model 2) → defensivo é a resposta certa
- **Se ambos** (PTAX volátil + Tesla lançando Model 2) → **ambos**

A matriz 2×2 mostra o custo total 6m de cada combinação:

| Hedge \ Defensivo | Sem defensivo | Com defensivo (catalog-wide) |
|---|---|---|
| **Baixo (0%)** | R$ 0M | R$ 225M |
| **Médio (38.6%)** | R$ 24M | R$ 249M |
| **Alto (90%)** | R$ 50M | R$ 275M |

**Observações**:
- O custo do defensivo (R$ 225M) **domina** a matriz
- Hedge é relativamente barato (R$ 24-50M)
- A diferença entre "médio + sem defensivo" e "alto + sem defensivo" é apenas R$ 26M
- Adicionar defensivo "engorda" o orçamento em ~R$ 225M, independente do nível de hedge

### 3.1 Estratégia ótima (lens puramente econômico)

| Cenário | Hedge | Defensivo | Justificativa |
|---|---|---|---|
| S1 GREEN + S4 GREEN | Baixo (0%) | Não | Nenhuma ameaça material |
| S1 RED + S4 GREEN | Alto (90%) | Não | Só FX preocupa, defensivo não ataca FX |
| S1 GREEN + S4 RED | Baixo (0%) | Targeted (R$ 22M) | Só competitividade, hedge desnecessário |
| S1 RED + S4 RED | Médio (38.6%) | Targeted (R$ 22M) | Ambos os riscos, mas defensivo targeted |

Custo total no pior caso (S1 RED + S4 RED, com defensivo targeted): R$ 24M + R$ 22M = **R$ 46M/6m**.

vs. D2 que prescreve R$ 80M (hedge médio flat) + R$ 320M (defensivo catalog-wide) = **R$ 400M/6m**.

**Diferencial**: **R$ 354M/6m = R$ 708M/ano economizado** com a estrutura certa. Isso é 5× o orçamento de advocacy regulatório (R$ 12M).

---

## 4. As figuras

### Fig 1 — Cost per unit (`fig-d3-s1s4-1-cost-per-unit.png`)

**O que mostra**: comparação direta do custo por unidade de hedge (R$ 480) vs defensivo (R$ 4.500).

**Leitura**: a barra do defensivo é 9.4× maior. Mas o gráfico deliberadamente NÃO mostra o **benefício** — porque é por unidade e diferentes unidades. O defensivo protege 5k de 50k unidades; o hedge protege 100% das unidades (todas têm BOM FX).

**Insight visual**: se você só olha para o custo por unidade, defensivo parece absurdo. Mas o **volume** protegido é diferente — defensivo foca em volume de mercado share, hedge cobre toda a base.

### Fig 2 — 2×2 matrix (`fig-d3-s1s4-2-2x2-matrix.png`)

**O que mostra**: custo total 6m para cada combinação de nível de hedge × defensivo sim/não.

**Leitura**: o gráfico visualiza que defensivo "engorda" o orçamento em R$ 225M flat. As 3 colunas (baixo/médio/alto hedge) têm custos similares quando "com defensivo", porque a variação de hedge (R$ 0-50M) é pequena comparada ao custo do defensivo (R$ 225M).

**Insight operacional**: o hedge tem elasticidade alta (pouca variação de custo cobre grande variação de risco). O defensivo tem elasticidade baixa (custo fixo alto, sem gradação). **Pricing defensivo deveria ter tiers** (básico, intermediário, agressivo) para ter gradação.

---

## 5. Recomendação revisada para S4

D2 prescreve defensivo como "pacote de serviço + wallbox incluso" custando R$ 4.5k/unit. A análise recomenda **3 mudanças**:

### 5.1 Mudar de catalog-wide para targeted

Em vez de aplicar R$ 4.5k a **todas** as 50k unidades, aplicar **apenas às 5k unidades em mercados competitivos** (SP capital, RJ, MG capital). Custo cai de R$ 225M para R$ 22.5M.

### 5.2 Adicionar tiers

- **Tier 1** (defensivo leve): R$ 2k/unit, sem wallbox, foco em price-cut. ROI positivo se share preservado ≥ 0.5pp
- **Tier 2** (defensivo médio): R$ 4.5k/unit, com wallbox. ROI positivo se share preservado ≥ 1.5pp (D2 baseline)
- **Tier 3** (defensivo agressivo): R$ 7k/unit, com wallbox + service pack. ROI positivo se share preservado ≥ 2.5pp

Permite gradação por mercado e por linha.

### 5.3 Condicionar a S6 (macro)

S4 defensivo deveria ser intensificado quando S6 vira 🔴 (PIB < 0 por 2 trimestres), porque em stress macro a demanda cai de qualquer jeito — defensivo é ainda mais importante para preservar a base que mantém a viabilidade operacional.

### 5.4 Matriz final revisada

| Status S4 | Status S6 | Defensivo | Custo 6m | Owner |
|---|---|---|---|---|
| GREEN (BYD share > 32%) | 🟢 PIB > 0 | Nenhum | R$ 0 | — |
| GREEN | 🟡 PIB ≈ 0 | Nenhum | R$ 0 | — |
| GREEN | 🔴 PIB < 0 | Tier 1 seletivo | R$ 5M | Head Comercial |
| AMBER (BYD 28-32%) | 🟢 PIB > 0 | Tier 1 (Q3) + Tier 2 (Q4) | R$ 60M | Head Comercial |
| AMBER | 🟡 PIB ≈ 0 | Tier 2 (targeted) | R$ 22.5M | Head Comercial |
| AMBER | 🔴 PIB < 0 | Tier 2 (catalog-wide) | R$ 225M | CEO + Head Comercial |
| RED (BYD < 28%) | 🟢 PIB > 0 | Tier 2 (targeted) | R$ 22.5M | CEO + Head Comercial |
| RED | 🟡 PIB ≈ 0 | Tier 3 (targeted) | R$ 35M | CEO |
| RED | 🔴 PIB < 0 | Tier 3 (catalog-wide) | R$ 350M | Board (CEO escalado) |

**Custo total do novo plano (vs D2)**:
- D2: R$ 320M/ano
- D3: R$ 50-300M/ano (varia por cenário)
- **Economia esperada** (ponderada por prob): ~R$ 130M/ano

---

## 6. Interações com S1 e S2

### 6.1 S1 × S4

- **S1 protege margem, S4 protege volume**. Não são substitutos.
- Quando S1 RED (FX volátil), defensivo é MAIS importante (precisamos preservar volume para amortizar o hedge cost)
- Quando S4 RED (concorrência agressiva), hedge é MAIS importante (volume baixo + BOM volátil = quebra de margem)
- **Ambos juntos**: cenário pior, mas protege nas duas frentes

### 6.2 S2 × S4

- S2 RED pressiona custo (CATL premium 15%), S4 RED pressiona receita (volume)
- Margem = Price - BOM - Non-BOM
- Se S2 RED aumenta BOM em 15% e S4 RED cai volume em 20%, a margem vai a zero rapidamente
- Defensivo (S4 RED) ajuda a preservar volume para amortizar o custo S2 RED
- **Pricing defensivo deveria ser condicional ao status S2**: se S2 também RED, defensivo vira prioridade #1

### 6.3 Quadro integrado

| S1 | S2 | S3 | S4 | S6 | Cenário integrado | Ação integrada |
|---|---|---|---|---|---|---|
| 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | Base case | Plano D2 baseline (R$ 80M hedge + R$ 320M defensivo) |
| 🔴 | 🟢 | 🟢 | 🟢 | 🟢 | FX volátil isolada | Hedge 90%, defensivo 0% (R$ 50M) |
| 🟢 | 🔴 | 🟢 | 🟢 | 🟢 | Supply stress isolado | Hedge 38% (mesmo), acelerar dual-sourcing (R$ 0 incremental) |
| 🟢 | 🟢 | 🔴 | 🟢 | 🟢 | Rollback regulatório | Hedge 62%, advocacy R$ 12M |
| 🟢 | 🟢 | 🟢 | 🔴 | 🟢 | Concorrência agressiva | Defensivo targeted (R$ 22.5M) |
| 🔴 | 🔴 | 🟢 | 🟢 | 🟢 | Stress macro + supply | Hedge 95%, acelerar dual-sourcing, plano B BNDES |
| 🔴 | 🟢 | 🟢 | 🔴 | 🟢 | FX + concorrência | Hedge 90% + defensivo targeted R$ 22.5M |
| 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | **Modo crise total** | Hedge 95% + dual-sourcing emerg + bridge financing + defensivo R$ 350M |

---

## 7. Limitações e próximos passos

### 7.1 O que o modelo NÃO captura

1. **Elasticidade-preço da demanda**: assumi que defensivo preserva share, mas o quanto depende da elasticidade local
2. **Reação competitiva**: se BYD faz defensivo, Tesla pode retaliar com preço mais agressivo
3. **Custo de oportunidade do capex**: R$ 350M em defensivo poderia ir para M&A defensivo
4. **Brand value**: 5k unidades preservadas têm valor de marca não capturado
5. **Volume growth**: defensivo pode acelerar market share inicial (efeito bola de neve)

### 7.2 Próximas análises

- [ ] **S3↔S4** — incentivos BNDES no break-even de pricing
- [ ] **Stress test multivariado** (gap #8) — S1+S2+S3+S4+S6 simultâneo
- [ ] **Calibração do target ratio** com Risk Officer (decisão política)
- [ ] **MC multivariado** integrado (gap #8)
- [ ] **Decision tree completa** com 12 cenários integrados

### 7.3 Acceptance criteria

Para esta análise ser incorporada ao D3:

- [ ] Validação com Head Comercial: tier structure funciona na prática
- [ ] Validação com CFO: budget aprovado para faixa R$ 50-300M/ano variável
- [ ] Análise de elasticidade-preço por mercado (geográfico)
- [ ] Stress test competitivo: reação de Tesla/VW ao defensivo
- [ ] Definição de "modo crise total" — quem aciona, com quais sinais

---

## Próximo passo

Após aprovação desta análise:

1. Incorporar ao D3-MAIN.html (relatório operacional)
2. Construir S3↔S4 (último gap #1 restante)
3. Consolidar matriz 4×3×3×3 = 36 cenários integrados (S1×S2×S3×S4)
4. Auto-trigger S6 → S1/S2/S4 (camada 2 do framework D3)
5. Workshop Conselho para validar target ratio e tiers de defensivo
