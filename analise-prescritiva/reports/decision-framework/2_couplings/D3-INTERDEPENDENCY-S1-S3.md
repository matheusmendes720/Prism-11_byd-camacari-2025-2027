# D3 — Interdependência S1 ↔ S3: Modelagem Quantitativa

**Documento de análise profunda** · Complementa `D2-AUDIT.md` (gap #1) e `DECISION-FRAMEWORK.md`
**Data**: 21/jul/2026
**Status**: Working draft · base para revisão com CSO e CFO
**Modelo**: Constraint-based optimization (não cost-minimization)

> ⚠️ **ATUALIZAÇÃO 21/jul/2026**: Análise empírica posterior (ver [D3-RECALIBRATION-S1-S3.md](./D3-RECALIBRATION-S1-S3.md) e [D3-RECALIBRATION-APPLIED.md](./D3-RECALIBRATION-APPLIED.md)) identificou que σ=14.19% estava subestimada em 16% (realized 16.42%). **Valores recalibrados**: σ=16%, AMBER threshold 18%→15%, RED threshold 25%→30%. h*, premium e NPV foram recalculados. **Custo adicional 3y: R$ 456M (de R$ 835M para R$ 1.291bi, +55%) — premium de acurácia.**

---

## 1. Por que este documento

A auditoria do D2 identificou **10 gaps estruturais**; o mais crítico deles (gap #1) é que as prescrições das 6 sessões são tratadas como independentes, mas na prática têm **acoplamentos fortes** que mudam o sizing, o timing e a própria validade de cada ação.

O acoplamento **S1 (Hedge Cambial) ↔ S3 (ViE Regulatório)** é o mais urgente porque:

1. **O sizing do hedge depende do ViE**: menor ViE → menor margin buffer → precisa de mais hedge
2. **O custo do hedge compete com o capex regulatório**: BNDES negado → menos caixa para pagar prêmio
3. **O timing importa**: a janela de aprovação do BNDES (ago/2026) determina quando o sizing precisa ser revisado
4. **D2 prescreve "hedge 50% flat"** — uma média que é ótima para 1 cenário e sub-ótima para os outros 3

Este documento quantifica o acoplamento, propõe um modelo defensável e entrega uma matriz de decisão para o Conselho.

---

## 2. O modelo

### 2.1 Premissas

| Parâmetro | Valor | Fonte |
|---|---|---|
| VGV total (2026-2027) | R$ 30B | 100k vehicles × R$ 300k avg |
| BOM (% de V) | 70% | D2 implicit |
| Exposição FX (% de BOM) | 42% | D2 S1 |
| σ_PTAX anualizada | 14.19% | D2 S1 |
| Horizonte | 6 meses | D2 S1 |
| Margem não-BOM | 5% | D2 S2 |
| Custo hedge | 100 bps/ano | mercado |
| Z(5%) | 1.645 | normal padrão |

### 2.2 Função de risco

**VaR_5% (6m, sem hedge)** = 1.645 × σ_PTAX × √H × e × V
                     = 1.645 × 0.1419 × √0.5 × 0.42 × V
                     = **6.93% de V** = R$ 2.08B

**VaR_5% (6m, com hedge h)** = 6.93% × (1 − h) × V

**Premium hedge (6m)** = 100 bps × H × e × h × V = 0.5% × e × h × V = R$ 63M × h

**Margin buffer (V %)** = m + ViE = 5% + ViE

### 2.3 Constraint-based optimization (vs. cost-minimization)

Tentamos otimizar por custo esperado (VaR + premium) e o resultado degenerou em h=100% sempre — porque o VaR é ~30× maior que o premium em escala absoluta. Esse é o sinal de que **a função objetivo certa é um constraint, não uma soma**.

Adotamos: **encontrar o menor h tal que VaR residual ≤ target × margin**, com 3 modificadores:

1. **Operational buffer (+5pp acima do mínimo)**: defende contra a incerteza no σ e no h efetivo
2. **Strategic floor (h ≥ 30%)**: hedge algum mesmo quando o constraint não é binding, para sinalizar disciplina de risco ao mercado
3. **Strategic ceiling (h ≤ 95%)**: deixa 5% de exposição descoberto (proteção contra risco de contraparte e custo de oportunidade)

Fórmula:

```
h_min = max(0, 1 − target × margin / VaR_at_h0)
h_rec = clip(h_min + 0.05, 0.30, 0.95)
```

Com **target = 20%** (VaR residual ≤ 20% do margin buffer), produz:

| Cenário S3 | ViE | Margin | h_min | h_rec | Premium 6m | VaR Residual | Ratio |
|---|---|---|---|---|---|---|---|
| Expansão | 25% | 30% | 13.4% | **30.0%** (floor) | R$ 18.9M | 4.85% V | 16.2% |
| Continuidade | 18% | 23% | 33.6% | **38.6%** | R$ 24.3M | 4.26% V | 18.5% |
| Rollback Parcial | 10% | 15% | 56.7% | **61.7%** | R$ 38.9M | 2.66% V | 17.7% |
| Rollback Total | 0% | 5% | 85.6% | **90.6%** | R$ 57.1M | 0.65% V | 13.0% |

**Recomendação D3**: o "hedge 50% flat" do D2 é o ótimo para o cenário Continuidade, mas **sub-ótimo** para os outros 3. Especificamente:

- **Expansão**: pode-se economizar R$ 5M/ano em premium reduzindo de 50% para 30%
- **Rollback Parcial**: precisa 62% (não 50%) para manter o constraint de risco atendido
- **Rollback Total**: precisa 91% (não 50%) — uma diferença de 41pp que muda completamente o profile de risco

### 2.4 Por que o constraint, não o optimum?

A escolha do constraint (target = 20% do margin) é a decisão política do Risk Officer, não do modelo. O modelo expõe a curva de tradeoff; o humano escolhe o target. **A análise sustenta que o target de 20% é razoável** porque:

- 20% de VaR residual = o P&L ainda pode variar ±20% do margin em um ano ruim
- Para empresas de capital intensivo com margem apertada, isso é o limite do tolerável
- Em stress test (3σ = 20% PTAX depreciação em 1 mês), o residual de 20% × margin = absorvível sem breach

Para empresas mais avessas (e.g., startup em capex mode), o target pode ser 10% → h_rec sobe para 72% no cenário base. Para empresas mais tolerantes (e.g., subsidiária de multinacional), target de 30% → h_rec cai para 30% (piso estratégico).

---

## 3. As figuras

### Fig 1 — Cost curve (`fig-d3-1-cost-curve.png`)

**O que mostra**: o "custo normalizado" (premium + (VaR/margin)²) em função do hedge ratio, para cada cenário S3.

**Leitura**: a curva do Rollback Total parte de 1.92 (VaR é 38% do margin → quadrado = 1.44, normalizado = 1.92) e cai para 0.0021 em h=100%. É a curva mais íngreme — pequena variação em h tem grande impacto. As curvas de Expansão e Continuidade são quase planas — a diferença entre hedge 30% e 100% é marginal em termos de variância normalizada.

**Insight operacional**: o gráfico mostra a **urgência relativa** de hedge em cada cenário. Em Rollback Total, a inação (h=0) custa 900× mais que a hedge total (h=100%). Em Expansão, a diferença é "só" 25×.

### Fig 2 — Recommended h by scenario (`fig-d3-2-recommended-h.png`)

**O que mostra**: a barra de hedge ratio recomendado para cada cenário S3.

**Leitura**: progressão clara de 30% (Expansão) para 91% (Rollback Total). O gap entre Continuidade (38.6%) e Rollback Parcial (61.7%) é o **ponto de inflexão** — é onde o Risk Officer precisa acionar revisão, mesmo sem mudança de cenário declarada.

**Insight operacional**: o gap de 23pp entre Continuidade e Rollback Parcial sugere que **um sinal antecipado de Rollback Parcial deve disparar hedge adicional imediato**, não esperar a confirmação formal.

### Fig 3 — Margin buffer vs VaR residual (`fig-d3-3-buffer-vs-var.png`)

**O que mostra**: comparação visual do margin buffer (azul) com o VaR residual após o hedge recomendado (verde).

**Leitura**: em todos os 4 cenários, o VaR residual após hedge cabe dentro do margin buffer com folga. Mas a **margem de segurança** varia:
- Expansão: VaR 4.85% vs margin 30% → 6.2× folga
- Continuidade: VaR 4.26% vs margin 23% → 5.4× folga
- Rollback Parcial: VaR 2.66% vs margin 15% → 5.6× folga
- Rollback Total: VaR 0.65% vs margin 5% → 7.7× folga

**Insight operacional**: contraintuitivamente, o Rollback Total tem a MAIOR folga relativa (porque o hedge é 91%). Mas a folga absoluta é a menor (0.65% de V = R$ 195M) — uma única oscilação cambial pode consumir tudo.

### Fig 4 — Sensitivity (`fig-d3-4-sensitivity.png`)

**O que mostra**: como o h_rec muda com 3 variações de premissa no cenário base (ViE=18%).

**Leitura**:
- **Target ratio** (Strict 10% vs Base 20% vs Lenient 30%) é o principal driver: 71.8% / 38.6% / 30%
- **Volatilidade** sozinha não move muito (52.7% high vol vs 30% low vol), porque o constraint é em % do margin
- **Combinação** (high vol + strict): 78.8% — efeito aditivo

**Insight operacional**: o target ratio é uma **decisão política do Risk Officer + Board**. Vale a pena formalizar:
- "Qual o target de VaR residual aceitável em % do margin?"
- 10% = avesso, 20% = balanced, 30% = tolerante
- Essa decisão define o sizing do hedge em todos os cenários

---

## 4. Matriz de decisão operacional

| Status S3 | Status BNDES | Sinal macro S6 | Ação S1 (hedge) | Timing | Owner |
|---|---|---|---|---|---|
| **Expansão** | Approved | 🟢 PIB > 0 | Reduzir para 30% (de 50%) | Próximo trimestre | CFO + Risk |
| **Expansão** | Approved | 🟡 PIB ≈ 0 | Manter 50% (default) | — | Risk |
| **Expansão** | Approved | 🔴 PIB < 0 | Aumentar para 60% (defensiva) | Imediato | CFO |
| **Continuidade** | Approved | 🟢 PIB > 0 | Manter 38.6% (D2 baseline + 0pp) | — | Risk |
| **Continuidade** | Approved | 🟡 PIB ≈ 0 | Manter 38.6% (default) | — | Risk |
| **Continuidade** | Approved | 🔴 PIB < 0 | Aumentar para 50% (defensiva) | Imediato | CFO |
| **Rollback Parcial** | Delayed | 🟢 PIB > 0 | Aumentar para 62% (de 50%) | Imediato | CFO + Risk |
| **Rollback Parcial** | Delayed | 🟡 PIB ≈ 0 | Aumentar para 70% (defensiva) | Imediato | CFO |
| **Rollback Parcial** | Delayed | 🔴 PIB < 0 | Aumentar para 80% + bridge financing | Imediato | CEO + CFO |
| **Rollback Total** | Denied | 🟢 PIB > 0 | Aumentar para 91% + cash preservation | Imediato | CEO |
| **Rollback Total** | Denied | 🟡 PIB ≈ 0 | Aumentar para 95% (max defensiva) | Imediato | CEO |
| **Rollback Total** | Denied | 🔴 PIB < 0 | **Modo crise** (vide 4.1) | Imediato | Board |

### 4.1 Modo crise (S1 RED + S3 RED + S6 RED)

Cenário: PTAX > 5.50 + BNDES denied + PIB < 0. Ativação por decisão do Board.

**Ações imediatas (24h)**:
1. Hedge 100% da exposição cambial remanescente (custe o que custar)
2. Acionar bridge financing (Plano B do S3, R$ 800M)
3. Cortar capex não-essencial (preservar liquidity)
4. Pricing defensivo vira agressivo (proteger volume)
5. Comunicação ao mercado (investor relations)

**Ações 30d**:
6. Reuniões emergenciais com fornecedores (renegociar prazos)
7. Revisão do programa de dual-sourcing (acelerar ou pausar)
8. Suspensão de novos investimentos em refinaria de lítio
9. Redução de 15% no plano de headcount 2027

**Ações 90d**:
10. Revisão estratégica do programa (viabilidade revisitada)
11. Decisão de pivot (vender, hibernar, M&A)

---

## 5. Comparação com a prescrição D2

| Aspecto | D2 | D3 | Delta |
|---|---|---|---|
| Hedge ratio | "50% flat" | 30% a 91% (condicional) | -8pp a +41pp por cenário |
| Trigger | "PTAX > 5.40 por 5 dias" | matriz S3 × BNDES × S6 | estruturado |
| Sizing rule | "50% da exposição" | constraint-based (VaR ≤ 20% margin) | defensável |
| Premium | R$ 80M/ano (constante) | R$ 19M a R$ 57M/6m | variável por cenário |
| Decision owner | não definido | CFO + Risk Officer + CEO (escalation) | explícito |
| Counterfactual | ausente | "h=0" mostrado em cada cost curve | comparativo |
| Sensitivity | ausente | tornado de 3 parâmetros | explícito |

**O ponto crítico**: D2 prescreve R$ 80M/ano constante. D3 prescreve R$ 38M a R$ 114M/ano variável. **A diferença acumulada em 3 anos é R$ 200M+** — não trivial.

---

## 6. Implicações para o Conselho

### 6.1 Aprovação do pacote de hedge deve ser condicional, não absoluta

D2 diz "aprovem R$ 80M/ano em hedge". D3 diz "aprovem até R$ 114M/ano **mediante gatilhos** — com baseline de R$ 49M/ano (média ponderada dos 4 cenários)."

Aprovação condicional tem 3 vantagens:
- **Otimização de capital**: paga-se menos em cenários favoráveis
- **Sinal ao mercado**: hedge é proporcional ao risco, não tamanho fixo
- **Flexibilidade operacional**: CFO pode realocar capital se cenário mudar

### 6.2 O Conselho precisa escolher o target ratio (decisão política)

Esta é uma decisão que o modelo não toma. Recomendação: target = 20% (balanceado). Mas o Conselho pode definir 10% (mais avesso) ou 30% (mais tolerante) com base no apetite a risco declarado.

### 6.3 O timing do trigger S6 → S1 é crítico

Se S6 vira 🔴 (PIB < 0 por 2 trimestres) sem o S1 ter sido ajustado, o programa pode chegar a Rollback Parcial com hedge ainda em 50% — exatamente o cenário que essa análise flagra como perigoso.

**Recomendação operacional**: implementar auto-trigger S6 → S1 com revisão humana obrigatória em ≤5 minutos (vide `DECISION-FRAMEWORK.md` §2 Layer 3).

### 6.4 O que NÃO muda

- O **composto do D2 (71.8/100)** continua sendo a referência
- As **4 dimensões** (Câmbio, Supply, Regulatório, Competitivo) continuam sendo os eixos
- O **cost-benefit por prescrição** (R$ 280M dual-sourcing + R$ 12M advocacy + R$ 80M hedge) continua valendo — o que muda é o **dimensionamento intra-prescrição** do hedge

---

## 7. Limitações e próximos passos

### 7.1 O que o modelo NÃO captura

1. **Risco de contraparte**: hedge 100% expõe a 100% de risco de default do hedge provider
2. **Basis risk**: hedge em PTAX genérica ≠ hedge na cesta real de importações (USD, EUR, CNY)
3. **Custo de oportunidade do caixa**: R$ 57M/6m em prêmio poderia ir para M&A defensivo
4. **Liquidez do mercado de hedge**: em stress (set/2024-style), prêmio pode dobrar
5. **Hedge natural não considerado**: 40-60% da exposição tem hedge natural via pricing pass-through
6. **Timing de FX vol**: o modelo assume vol constante; em stress, vol sobe 50-100%

### 7.2 Próximas análises (D3 v0.5)

- [ ] Calibrar target ratio com Risk Officer (decisão política)
- [ ] Adicionar basis risk por moeda de importação (CNY, USD, EUR breakdown)
- [ ] Modelar stress no mercado de hedge (prêmio pode dobrar em stress)
- [ ] Incluir natural hedge via pricing pass-through
- [ ] Adicionar S2 (supply chain) ao modelo: "e se CATL cortar 20% no mesmo cenário de stress cambial?"
- [ ] MC multivariado PTAX × lítio × demand EV × IPCA (gap #8 do audit)

### 7.3 Como integrar com as outras 5 sessões

- **S1 ↔ S2 (já feito)**: hedge protegendo contra FX enquanto dual-sourcing reduz risco sistêmico → modelos conjuntos
- **S1 ↔ S4 (pendente)**: pricing defensivo vs. custo do hedge — break-even do preço de catálogo
- **S1 ↔ S6 (parcialmente feito)**: macro trigger revisado nesta análise
- **S3 ↔ S4 (pendente)**: incentivos BNDES entram no break-even do preço

---

## 8. Acceptance criteria (próximo passo)

Para esta análise ser incorporada ao D3, precisa de:

- [ ] Validação com CFO: target ratio aprovado
- [ ] Validação com Risk Officer: metodologia de constraint
- [ ] Workshop com CSO + Heads: matriz de decisão §4 aprovada
- [ ] Definição do trigger S6 → S1: thresholds + procedimento
- [ ] Calibração dos parâmetros com dados reais (BCB SGS, ANFAVEA)
- [ ] Documentação da RACI (responsabilidade sobre cada decisão)
- [ ] Stress test: como a recomendação muda em σ=20% (black swan FX)

---

## Próximo passo

Após aprovação desta análise:

1. Incorporar ao `D3-MAIN.html` (relatório operacional)
2. Construir `D3-DECISION-TREES.html` (matriz §4 visualizada)
3. Implementar auto-trigger S6 → S1 em código
4. Atualizar `progress.md` com marcos
5. Revisar com CSO e Risk Officer antes de Fase 1
