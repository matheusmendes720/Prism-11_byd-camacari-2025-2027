# D3 — Interdependência S6 → todas: Macro multiplier + trigger matrix

**Documento de análise** · Complementa `D2-AUDIT.md` (gap #1, #4, #6, #7) · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md`, `D3-INTERDEPENDENCY-S1-S4.md` e `D3-INTERDEPENDENCY-S3-S4.md`
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. Por que esta análise

S6 (macro) é tratado no D2 como **descritivo**: mostra correlações, IRF, FEVD. Mas o status macro (S6 GREEN/AMBER/RED) deveria ser **prescritivo** — mudar a intensidade de todas as prescrições das outras 5 sessões.

D2 não modela o coupling S6 → S1/S2/S3/S4/S5. Resultado: as prescrições D2 são estáticas, mas a realidade é dinâmica. Quando PIB vira negativo por 2 trimestres, **todas as outras sessões deveriam reagir simultaneamente** — hedge sobe, dual-sourcing acelera, advocacy expande, defensivo ativa Tier 2, partnerships renegociam.

Esta análise define:
1. **O macro multiplier** (1.0× / 1.5× / 2.0×) que calibra a intensidade de cada prescrição
2. **A trigger matrix 4×3** (4 sessões × 3 status S6) com 12 ações pré-mapeadas
3. **A evolução do composite** sob cada status S6 (65 / 78 / 88)
4. **Os tempos de resposta** (latência) aceitáveis para cada prescrição reagir

---

## 2. O macro multiplier

### 2.1 Definição

O **macro multiplier** é um escalar que amplifica a intensidade de cada prescrição conforme o regime macro:

| S6 status | Multiplier | Condição de ativação |
|---|---|---|
| 🟢 GREEN | **1.0×** | PIB > 0% YoY, IPCA < 5%, FGV confiança > 90 |
| 🟡 AMBER | **1.5×** | PIB entre −1% e 0%, IPCA 5-7%, FGV 80-90, ou 2 dos 3 triggers AMBER |
| 🔴 RED | **2.0×** | PIB < −1% YoY por 2 trimestres, IPCA > 7%, FGV < 80, ou qualquer trigger de crise |

### 2.2 Como o multiplier atua

O multiplier não muda **o que** é feito, mas **quão agressivo** cada instrumento é:

- **Hedge FX (S1)**: ratio ótimo do S3 × multiplier
- **Dual-sourcing (S2)**: meses de safety stock = baseline + 6 × (multiplier − 1)
- **Advocacy (S3)**: orçamento = R$ 12M × multiplier
- **Defensivo (S4)**: tier sobe um nível a cada step de multiplier
- **Partnerships (S5)**: cláusulas de hedge são ativadas em AMBER, renegociadas em RED

### 2.3 Por que não é linear (1.0/1.5/2.0)

Multiplicadores **lineares** (1.0/2.0/3.0) ou exponenciais (1.0/2.0/4.0) dariam:
- 1.0/2.0/3.0: RED = 3× o custo, talvez excessivo para VaR FX (saturado em 95% teto)
- 1.0/2.0/4.0: RED = 4×, claramente destrutivo (R$ 48M de advocacy)

A escolha **1.0/1.5/2.0** é pragmática:
- GREEN: estado base, sem stress
- AMBER: stress moderado, +50% em cada instrumento (cobre o stress sem dobrar custo)
- RED: stress severo, +100% (dobrar o esforço, mas cada instrumento está sujeito a tetos físicos — hedge satura em 95%, defensivo catalog-wide destrói valor em Rollback Total, etc.)

**Insight 1**: o multiplier tem **efeitos de saturação**. Em RED com Rollback Total, hedge FX está em 90.6% (S1↔S3) — o multiplier 2.0× empurra para 95% (teto), mas o VaR residual continua R$ 100M+ (inabsorvível só com hedge). A resposta em RED é **estrutural**, não só escalar instrumentos.

---

## 3. A trigger matrix 4×3

### 3.1 S1 — Hedge cambial

| S6 | Ação | Mecanismo | Custo incremental |
|---|---|---|---|
| 🟢 GREEN | Baseline (vem do S3) | h* do constraint S1↔S3 (30%-91%) | R$ 0 |
| 🟡 AMBER | +10pp hedge | Aplicar multiplier 1.5× sobre o h* baseline (cap 95%) | R$ 6-12M |
| 🔴 RED | +20pp hedge, até teto 95% | Aplicar multiplier 2.0×; satura no teto | R$ 12-24M |

**Exemplo numérico**: S3 = Continuidade (h* = 38.6%, premium R$ 24M). Em AMBER, hedge vai para 57.9% (cap respected); premium sobe para R$ 36M (+R$ 12M). Em RED, hedge vai para 77.2%; premium R$ 48M (+R$ 24M). Acima de 95% (não atinge aqui), satura.

### 3.2 S2 — Supply chain

| S6 | Ação | Mecanismo | Custo incremental |
|---|---|---|---|
| 🟢 GREEN | Baseline dual-sourcing 18m | Qualificação EVE em 18 meses | R$ 0 |
| 🟡 AMBER | Acelerar EVE qualification, +30 dias safety stock | Compressão para 12m, buffer adicional | R$ 30M |
| 🔴 RED | Plano B acionado: comprar spot, hedge alternativo | Compra spot + opção de供应 alternativo | R$ 80M+ |

**Insight 2**: em RED, supply VaR (R$ 5.18B do S1↔S2) **domina** FX VaR. A resposta em RED deveria ser estrutural (comprar spot, hedge alternativo via outro supplier), não escalar o que já não cobre.

### 3.3 S3 — Regulatory (advocacy + bridge financing)

| S6 | Ação | Mecanismo | Custo incremental |
|---|---|---|---|
| 🟢 GREEN | Advocacy baseline R$ 12M | R$ 12M em MDIC meetings, lobby | R$ 0 |
| 🟡 AMBER | Dobrar advocacy, expandir MDIC meetings | R$ 24M, contratar 2 lobbystas adicionais | R$ 12M |
| 🔴 RED | Bridge financing R$ 800M acionado (Plano B) | Ativar ACC, financing verde adicional | R$ 50M (custo de capital) |

**Nota**: bridge financing em RED é caro mas é a **única alavanca que muda S3 de Rollback Total para Parcial** se BNDES atrasa. Em GREEN, é desnecessário. **AMBER é o ponto de acionamento preventivo** — esperar RED pode ser tarde demais.

### 3.4 S4 — Pricing defensivo

| S6 | Ação | Mecanismo | Custo incremental |
|---|---|---|---|
| 🟢 GREEN | Defensivo conforme S3 status | Tier já calibrado pelo S3↔S4 | R$ 0 |
| 🟡 AMBER | Defensivo sobe um tier (Tier 1→2 ou 2→3) | Aplicar tier do S3↔S4 + 1 step | R$ 7.5-22.5M |
| 🔴 RED | Defensivo Tier 3 + comunicação ao mercado | Tier máximo + press release de "preço competitivo" | R$ 22.5M + R$ 5M marketing |

**Insight 3**: defensivo **catalog-wide** (D2 baseline R$ 225M) **nunca é acionado** na matriz S6. Em GREEN, S3 já determina o tier. Em AMBER/RED, o escalonamento é via tier system, não catalog-wide. Catalog-wide só faz sentido em Expansão (S3 GREEN + S6 GREEN), mas nesse caso o orçamento permite. **D2 prescreve catalog-wide sem condicionar a S6 — isso é a estrutura errada**.

### 3.5 Matriz consolidada

| Sessão | 🟢 GREEN | 🟡 AMBER | 🔴 RED |
|---|---|---|---|
| **S1 Hedge** | Baseline (do S3) | +10pp hedge, multiplier 1.5× | +20pp hedge, até 95% teto |
| **S2 Supply** | Baseline dual-sourcing 18m | Acelerar EVE, +30 dias safety stock | Plano B: comprar spot + hedge alternativo |
| **S3 Regulatory** | Advocacy R$ 12M | Dobrar advocacy R$ 24M, +MDIC meetings | Bridge financing R$ 800M |
| **S4 Pricing** | Defensivo conforme S3 | Defensivo sobe 1 tier | Defensivo Tier 3 + comunicação |

**Total custo incremental por status S6**:
- 🟢 GREEN: **R$ 0** (baseline)
- 🟡 AMBER: **R$ 55-65M** (mix dos 4 instrumentos)
- 🔴 RED: **R$ 165-200M** (custo máximo tolerável, mas resposta estrutural é o que salva)

---

## 4. A evolução do composite

### 4.1 Composite por status S6

O **composite vulnerability** (0-100, maior = mais vulnerável) por S6:

| S6 | Composite | Interpretação |
|---|---|---|
| 🟢 GREEN | **65** | Programa vulnerável mas administrável |
| 🟡 AMBER | **78** | Material stress; prescrições dobradas |
| 🔴 RED | **88** | Crise; resposta estrutural, não só escalar |

**Fonte**: modelo `D3-INTERDEPENDENCY-S6` (`composite_by_s6`). Ver `figures/fig-d3-s6-2-composite-by-s6.png`.

**Insight 4**: o composite **não sobe linearmente** com o stress macro. GREEN→AMBER sobe 13 pontos (65→78), mas AMBER→RED sobe só 10 pontos (78→88). A razão: GREEN→AMBER é uma transição de regime (a prescrição D2 já não é mais ótima), enquanto AMBER→RED é uma intensificação dentro do mesmo regime. **O ponto de virada é AMBER, não RED**.

### 4.2 Implicação para o framework

D3 deveria ter **triggers automáticos** que disparam revisões em ≤5min após mudança de status S6. Especificamente:
- **GREEN→AMBER**: dispara revisão de S1, S2, S3, S4 simultaneamente. Latência alvo: **5 min**.
- **AMBER→RED**: dispara comitê de crise (CSO + CFO + CEO + Head de Supply). Latência alvo: **60 min**.

A diferença de latência é intencional: GREEN→AMBER é execução de playbook; AMBER→RED é decisão de exceção.

### 4.3 Threshold de virada AMBER

Para evitar alarmes falsos, AMBER deveria exigir **2 de 3 condições**:
1. PIB YoY < 0%
2. IPCA 12m > 5%
3. FGV confiança < 90

E **2 trimestres consecutivos** para evitar reaction a choques transitórios (e.g., greve de 1 mês distorce PIB mensal mas não muda regime).

**Insight 5**: a cadência de revisão S6 deveria ser **mensal** (composite atualizado), mas o gatilho AMBER/RED é **trimestral** (precisa de 2 trimestres consecutivos). Misturar as duas cadências leva a alarmes falsos.

---

## 5. Integração com os outros modelos

### 5.1 Como S6 amplifica os outros couplings

| Coupling | Sob S6 GREEN | Sob S6 AMBER | Sob S6 RED |
|---|---|---|---|
| **S1↔S3** (hedge) | h* = 30-91% (do S3) | h* × 1.5 (cap 95%) | h* × 2.0 (cap 95%) |
| **S1↔S2** (stress) | VaR combinado baseline | VaR × 1.5 | VaR × 2.0 + stress estrutural |
| **S1↔S4** (hedge vs defensivo) | Hedge domina, defensivo target | Defensivo sobe tier, hedge baseline | Plano misto: hedge teto + defensivo Tier 3 |
| **S3↔S4** (defensivo ViE) | Defensivo conforme S3 | Defensivo sobe tier | Defensivo Tier 3 + comunicação |

**Insight 6**: S6 é o "amplificador" do D3. As 4 sessões operacionais (S1-S4) reagem ao macro de forma diferenciada — hedge satura, supply acelera, advocacy expande, defensivo sobe tier. **D2 trata S6 como input de modelo (correlação), D3 trata S6 como governor (multiplier)**.

### 5.2 Acoplamento S6 × S5 (partnerships, futuro)

S5 (partnerships) ainda não tem modelo. Sob S6 RED, cláusulas de hedge em contratos com fornecedores Tier 1 deveriam ser ativadas automaticamente. Sob S6 AMBER, contratos de longo prazo com EVE/CATL devem ser revisados. Sob S6 GREEN, manter baseline.

Esta é a próxima fronteira do D3 v0.5.

---

## 6. Pontos abertos / limitações

1. **Calibração do multiplier**: 1.0/1.5/2.0 é convencionado, não estimado. Para refinar, seria necessário backtest com dados 2015-2024 (PTAX, IPCA, BYD margins) e encontrar o multiplier que minimiza VaR ex-post vs VaR ex-ante. Sugestão: Fase 3 (Q1 2027).

2. **Independência S6 vs S3**: o modelo assume S6 (macro) é independente de S3 (BNDES). Mas se macro vira RED, é plausível que BNDES funding também atrase (governo fiscal stress). **S6 RED pode causar S3 Rollback Parcial/Total**. D3 deveria ter co-dependência S6→S3 modelada em v2.

3. **Latência de S6**: dados macro (PIB, IPCA) têm latência de 4-6 semanas. Trigger S6 em tempo real é impossível. Logo, o composite é sempre **atrasado** em ~6 semanas. O framework deveria explicitar essa latência aos decisores.

4. **Custo total em RED**: R$ 165-200M incremental é material mas absorvível. Em um evento catastrófico (RED + S2 RED simultâneo), o custo pode chegar a R$ 400M+ — exige aprovação de Board global, não Conselho local.

5. **Cenário de GREEN prolongado**: se S6 fica GREEN por 4+ trimestres, o programa pode relaxar hedge (voltar a 30% do S3 Expansão) e cortar advocacy (R$ 12M → R$ 6M). **D3 deveria ter um rebalanceamento oportunístico em GREEN longo**, não só escalada em RED.

---

## 7. Outputs do modelo (referência rápida)

**Arquivo**: `figures/fig-d3-s6-1-macro-multiplier.png` — visualização do multiplier 1.0/1.5/2.0
**Arquivo**: `figures/fig-d3-s6-2-composite-by-s6.png` — composite 65/78/88
**Arquivo**: `_model_s3s4_s6.json` (`s6_triggers`, `composite_by_s6`)

**Resumo executivo em 1 frase**: S6 é o governor do D3 — define um macro multiplier (1.0/1.5/2.0×) que escala as prescrições de S1-S4. Em GREEN, baseline. Em AMBER, +50% em cada instrumento. Em RED, dobrar + resposta estrutural (não só escalar). A virada crítica é AMBER (composite 65→78), não RED. Trigger automático deveria disparar revisão em ≤5min para AMBER e comitê de crise em ≤60min para RED.
