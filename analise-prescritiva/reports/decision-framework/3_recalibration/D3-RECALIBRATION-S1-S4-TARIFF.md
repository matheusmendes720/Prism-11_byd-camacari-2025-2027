# D3 — Recalibração B7: S1 (FX) ↔ S4 (Defensivo) com Tarifa 35% Permanente

**Documento de refinamento** · Recalibração pós-OSINT para B7 · Companion de `D3-INTERDEPENDENCY-S1-S4.md`, `D3-INTERDEPENDENCY-S10-TARIFF.md`, `D3-RECALIBRATION-S1-S4.md`
**Data**: 21/jul/2026
**Status**: Working draft · pronto para integração no D3 v0.6

> **Atualização crítica 21/jul/2026**: o D3 original tratou a tarifa de 35% como **cenário pessimista** (probabilidade baixa). A realidade OSINT mostra que a tarifa **FOI APLICADA em Jan/2027** sobre kits SKD/CKD e o pedido de redução feito pela BYD foi **REJEITADO** pela Camex em jul/2025. Este documento recalibra S1 (FX) e S4 (Defensivo) com a tarifa 35% como **cenário base**, não pessimista.

---

## §1 Resumo das recalibrações

### 1.1 O que mudou desde o D3 original

| Aspecto | D3 original | D3 v0.6 (este doc) | Delta |
|---|---|---|---|
| Tarifa SKD/CKD | 14% (baseline) / 35% (pessimista) | **35% (base, Jan/2027)** | Tarifa aplicável é fato consumado |
| BYD request redução | Ignorado | **REJEITADO jul/2025** | Confirmado pelo OSINT |
| Quota BYD | Não modelada | **US$ 463M tariff-free H1/2026** | Mitigação parcial已知 |
| Exposição FX | 70% do VGV importado | **85-90% do VGV (SKD/CKD)** | SKD/CKD ~85-90% do VGV = exposição quase 100% USD |
| Tarifa como risco | Pessimista (~20% probabilidade) | **Permanente / base** | Mudança de regime |
| S4 Defensivo | Competitivo em S6 AMBER+ | **2.3× menos competitivo** (margin consumed dobra) | Tarifa comprime margem residual |

### 1.2 Nova realidadetarifária

- **SKD** = Semi-Knocked Down (kits parcialmente desmontados da China, via Tianjin/HK)
- **CKD** = Completely Knocked Down (kits totalmente desmontados, maior valor CIF por kit)
- Tarifa 35% sobre kits amplia o custo de importação em Reais, reduzindo a competitividade de preço da BYD vs montadoras com maior conteúdo local
- BYD pediu redução → **REJEITADA** pelo governo brasileiro (Camex jul/2025)
- Unica mitigaçãoobtida: quota tarifária de US$ 463M (1º semestre 2026), que se esgota antes de Jan/2027

### 1.3 Inputs OSINT validados

| Fonte | Dado | Confiança |
|---|---|---|
| Reuters (jan/2025) | Brazil to raise EV import tariffs to 35% starting July 2026 | Alta |
| Reuters (jul/2025) | BYD asks for tariff reduction → REJECTED by Camex | Alta |
| electrive.com (dez/2025) | BYD quota US$ 463M tariff-free | Alta |
| g1.globo (jan/2026) | Gecex-Camex define novo cronograma | Alta |
| scmp.com (ago/2025) | BYD's Brazil tariff challenge | Média |
| quatrorodas.abril.com.br (fev/2026) | Tarifa BEV 35% em jul/2026 confirmada | Alta |

---

## §2 S1 FX — Reestimação da exposição cambial com Tarifa 35%

### 2.1 Exposição FX recalibrada

No modelo original, a exposição FX era calculada como 70% do VGV (percentual importado). Com SKD/CKD representando **85-90% do VGV em 2025** (durante a fase de ramp-up de Camaçari), e a planta ainda em produção parcial, a exposição cambial é **quase 100% USD**.

**Parâmetros recalibrados**:

| Parâmetro | Valor original | Valor recalibrado | Justificativa |
|---|---|---|---|
| Exposição FX (% VGV) | 70% | **85-90%** | SKD/CKD = 85-90% do VGV em 2025; nacionalização 70% meta fim/2026 |
| Tarifa SKD/CKD | 14% | **35%** | Aplicada Jan/2027; rejeição BYD confirmada |
| BOM importado (R$ k) | R$ 98k | **R$ 98k** | Constante (mesmo CIF, tariff que muda) |
| Tarifa cost/unit | R$ 13.7k | **R$ 34.3k** | 35% × R$ 98k = R$ 34.3k |
| Margem residual (R$ 200k ASP) | R$ 46.3k | **R$ 25.7k** | −57% de compressão |

### 2.2 VaR FX com tariff叠 effects

O efeito叠 (stacked) significa que a tarifa amplifica o impacto do FX porque ambos incidem sobre o mesmo valor CIF importado. Em vez de additive, o impacto é **multiplicativo** em cenários de stress.

**Decomposição**:

```
Custo total importado = CIF (US$) × PTAX (R$/US$) × (1 + tariff_rate)

Exemplo (Jan/2027, BRL 5.30, tariff 35%):
Custo = US$ 15k × 5.30 × 1.35 = R$ 107.4k /unit

vs baseline (14% tariff):
Custo = US$ 15k × 5.30 × 1.14 = R$ 90.6k /unit

Delta tariff: +R$ 16.8k /unit
Delta FX (10% depreciação BRL 5.0 → 5.5): +R$ 9.8k /unit
Efeito叠 (simultâneo, BRL 5.5 + tariff 35%):
Custo = US$ 15k × 5.50 × 1.35 = R$ 111.4k /unit
vs baseline R$ 84.0k → +R$ 27.4k /unit
(Multiplicativo: 1.10 × 1.21 = 1.331 vs 1.35 → diferença 3pp)
```

**VaR 6m com tariff叠 (P95, BRL 5.5 + tariff 35%)**:

| Cenário | Exposição FX (R$ B) | VaR FX base | VaR tariff叠 | VaR total | vs baseline |
|---|---|---|---|---|---|
| Baseline (σ=16%, tariff 14%) | R$ 8.82B | R$ 2.27B | — | R$ 2.27B | — |
| Stress 1 (BRL 5.5, tariff 35%) | R$ 9.70B (+10%) | R$ 2.49B | R$ 1.43B | **R$ 3.92B** | **+73%** |
| Stress 2 (BRL 6.0, tariff 35%) | R$ 10.45B (+18%) | R$ 2.69B | R$ 1.93B | **R$ 4.62B** | **+104%** |
| Stress 3 (BRL 6.0 + volume −30%) | R$ 7.32B | R$ 1.88B | R$ 1.35B | **R$ 3.23B** | **+42%** |

**Nota**: VaR tariff叠 = (tariff_rate_novo − tariff_rate_antigo) × exposure. É o delta de custo devido ao hike tarifário, não hedgingable via FX.

![Tariff impact on FX exposure](./figures/fig-d3-b7-1-tariff-impact-on-fx-exposure.png)

*Figura 1: Custo total importado por unidade (R$ k) em 3 cenários: baseline (tariff 14%, BRL 5.0), stress FX (tariff 14%, BRL 5.5), e stress叠 (tariff 35%, BRL 5.5). Tarifa 35% é o maior componente do custo叠 em todos os cenários — R$ 34.3k vs R$ 9.8k de depreciação FX.*

---

## §3 S4 Defensivo — Reestimação com Tarifa 35% Permanente

### 3.1 Estratégias disponíveis: Offshore vs Onshore

A tarifa 35% permanente muda o cálculo de estratégia SKD/CKD vs nacionalização completa. Duas estratégias:

**Estratégia A: Offshore (manter SKD/CKD low-cost)**
- Manter importação de kits SKD/CKD da China
- Absorver tarifa 35% ou repassar ao consumidor
- Risco: tarifa pode subir mais (35% → 40%?) ou novas rotas (via México) também serem tariffed
- Custo por unidade (tariff 35%): R$ 34.3k /unit
- Custo de mudar de estratégia: baixo (manter status quo)

**Estratégia B: Onshore (nacionalizar)**
- Acelerar nacionalização para evitar tarifa (meta 70% até fim/2026)
- Risco: ramp de Camaçari pode atrasar (S8 status atual: ~50% capacidade)
- Custo de mudar de estratégia: alto (capex em nacionalização, prazos de fornecedor)
- Se nacionalização 70%: exposição tarifária cai de R$ 98k para R$ 42k importado

**Custo de mudar de estratégia (switching cost)**:

| Componente | Custo estimado | Observação |
|---|---|---|
| Capex fornecedores locais | R$ 200-400M | Nueva linhas em Camaçari |
| Tempo de validação local | 6-12 meses | Componentes devem ser certificados |
| Perda de escala (mix inicial) | R$ 3-5k /unit | Fornecedor local mais caro que China |
| Risco de qualidade | Alto | LTO battery cells ainda da China |
| **Total switching cost** | **R$ 250-500M** | One-time; diluído em 50k unidades = R$ 5-10k/unit |

**Insight 1**: switching cost de R$ 5-10k/unit é **recuperável em 2-3 anos** se a tarifa 35% persistir. Mas no curto prazo (12-18 meses), a estratégia offshore (absorver tarifa) pode ser preferível se a nacionalização atrasar.

### 3.2 Defensivo recalibrado (tier 0-3) pós-tariff 35%

A margem residual pós-tariff 35% cai de R$ 60k para **R$ 25.7k por unidade** (−57%). Os tiers defensivos, que consumiam 12-35% da margem original, agora consomem **27-82%** da margem residual comprimida.

| Tier | Custo/unidade (R$) | Componentes | Margin consumed (% of R$ 25.7k) | Margin consumed (% of R$ 60k baseline) |
|---|---|---|---|---|
| **Tier 0** | R$ 0 | Sem defensivo; absorver 100% da tarifa | 0% (mas margem base −57%) | 0% |
| **Tier 1** | R$ 7.000 | Price cut 1% + service pack básico | **27%** | 12% |
| **Tier 2** | R$ 14.000 | Price cut 2.5% + wallbox + service pack completo | **54%** | 23% |
| **Tier 3** | R$ 21.000 | Price cut 4% + wallbox + financing subsidy | **82%** | 35% |

**Multiplicador constante (2.3×)**: o margin consumed % dobra em todos os tiers porque a tarifa é um **multiplicador uniforme** sobre o custo de oportunidade do defensivo — não há "escape" via tier selection.

### 3.3 Ratio hedge/defensivo atualizado (4 S3 × 3 S2, post-tariff)

| S2 \ S3 | Expansão | Continuidade | RB Parcial | RB Total |
|---|---|---|---|---|
| **GREEN** | 9.8× | 8.3× | 5.8× | 4.1× |
| **AMBER** | 11.1× | **9.4×** | 6.6× | 4.7× |
| **RED** | 13.1× | 11.1× | 7.7× | 5.5× |

**vs pré-tariff (v0.5)**:

| Cenário | v0.5 ratio | v0.6 ratio (S2=AMBER) | Piora |
|---|---|---|---|
| Expansão | 6.54× | 11.1× | **+70%** |
| Continuidade | 5.55× | 9.4× | **+69%** |
| RB Parcial | 3.87× | 6.6× | **+71%** |
| RB Total | 2.74× | 4.7× | **+72%** |

**Insight 2**: ratio piora **~70% em todos os cenários**. Defensivo vira instrumento **2-3× menos competitivo** vs hedge FX após a tarifa 35%. Recomendação reforçada: hedge FX como instrumento **primário**; defensivo **secundário** (Tier 2 apenas em S6 AMBER+).

---

## §4 Impacto no NPV Layer — Reestimação com Tarifa 35% Permanente

### 4.1 NPV base (D3 v0.5, sem tariff)

D3 v0.5 estimava NPV do projeto Camaçari em **R$ 8.0-12.0 bi** (base case, 10-year horizon, WACC 12%). Inputs base:

| Input | Valor |
|---|---|
| Volume projetado | 250k unidades/ano (2026), 400k (2027) |
| ASP médio | R$ 200k |
| VGV 6m | R$ 30 bi |
| Margem bruta | 22% (Dolphin Mini ~18-22%) |
| Hedge FX | 46% (P95) |
| Tariff SKD/CKD | 14% (baseline) |
| NPV @ WACC 12% | R$ 8.0-12.0 bi |

### 4.2 NPV com Tarifa 35% permanente (cenários)

A tarifa 35% reduz a margem bruta e o VGV efetivo. Modelamos 3 cenários:

**Cenário A: Absorção total (BYD absorve tarifa)**

| Input | Base | Cenário A (absorção 100%) | Delta |
|---|---|---|---|
| Tariff SKD/CKD | 14% | 35% | +21pp |
| Margem bruta | 22% | **8-12%** | −10-14pp |
| Volume projetado | 250k | 250k (constante) | 0 |
| NPV @ WACC 12% | R$ 10.0 bi | **R$ 2.0-3.5 bi** | **−65 to −80%** |

**Cenário B: Pass-through parcial (50% repasso)**

| Input | Base | Cenário B (pass-through 50%) | Delta |
|---|---|---|---|
| Tariff SKD/CKD | 14% | 35% | +21pp |
| Margem bruta | 22% | **15-17%** | −5-7pp |
| Volume projetado | 250k | 230k (−8% vol) | −8% |
| NPV @ WACC 12% | R$ 10.0 bi | **R$ 4.5-6.5 bi** | **−35 to −55%** |

**Cenário C: Scaling + nacionalização (mitigação)**

| Input | Base | Cenário C (scaling + 70% nacionalização) | Delta |
|---|---|---|---|
| Tariff sobre importado | 14% | 35% × 30% = 10.5% efetivo | −3.5pp |
| Margem bruta | 22% | **18-20%** | −2-4pp |
| Volume projetado | 250k | 300k (+20% scaling) | +20% |
| NPV @ WACC 12% | R$ 10.0 bi | **R$ 7.0-9.0 bi** | **−10 to −30%** |

### 4.3 NPV sensitivity: tariff × volume × hedge

| Tariff \ Volume | 200k (−20%) | 250k (base) | 300k (+20%) |
|---|---|---|---|
| **14% (baseline)** | R$ 5.5 bi | R$ 10.0 bi | R$ 14.5 bi |
| **35% (Jan/2027)** | R$ −1.5 bi | R$ 2.5 bi | R$ 6.5 bi |
| **35% + hedge 95%** | R$ 0.5 bi | R$ 4.5 bi | R$ 8.5 bi |
| **35% + nacionalização 70%** | R$ 3.5 bi | R$ 7.5 bi | R$ 11.5 bi |
| **35% + hedge 95% + nac 70%** | R$ 5.5 bi | R$ 9.5 bi | R$ 13.5 bi |

**Insight 3**: NPV permanece **positivo em todos os cenários com mitigação combinada** (hedge 95% + nacionalização 70%). Sem mitigação, NPV pode ir para **negativo** em cenário de volume 200k + tarifa 35% + absorção total (−R$ 1.5 bi).

**Insight 4**: a combinação **hedge + nacionalização** é mais eficaz que qualquer medida isolada. NPV com ambas: R$ 9.5 bi (quase igual ao baseline de R$ 10.0 bi com tariff 14%).

![NPV with tariff scenarios](./figures/fig-d3-b7-2-npv-with-tariff-scenarios.png)

*Figura 2: NPV (R$ bi, WACC 12%, 10-year) em 4 cenários tariff × mitigação. Cenário base (tariff 14%, sem mitigação) = R$ 10.0 bi. Com tariff 35% permanente, NPV cai para R$ 2.5 bi (sem mitigação). Hedge 95% + nacionalização 70% recupera para R$ 9.5 bi — quase baseline. O ponto de inflexão é o volume: abaixo de 200k unidades com tariff 35%, NPV vira negativo mesmo com mitigação.*

### 4.4 Break-even analysis

**Break-even volume com tariff 35% + nacionalização 70%**:

```
Margem efetiva = 22% − (35% × 30% importado) = 22% − 10.5% = 11.5%
Volume break-even = Capex fixo / margem unitária
Capex Camaçari = R$ 3.0 bi (estimado)
Margem unitária = 11.5% × R$ 200k = R$ 23k /unit
Break-even = R$ 3.0 bi / R$ 23k = 130k unidades/ano
```

**Break-even com tariff 35% + 0% nacionalização (cenário stress puro)**:

```
Margem efetiva = 22% − 35% = −13% (deficitário)
Break-even = impossível (margem negativa)
→ Necessário pass-through ou nacionalização para ser viável
```

---

## §5 Implicações

### 5.1 Mudança na recomendação D3 v0.5

| Aspecto | v0.5 (tariff 14%) | v0.6 (tariff 35% permanente) |
|---|---|---|
| Tarifa como risco | Pessimista (~20% probabilidade) | **Base / permanente** |
| S4 Defensivo Tier 2 default | S6 AMBER+ | **S6 AMBER+ + trigger tariff ≥ 5pp** |
| Tier 2 margin consumed | 23% (of R$ 60k) | **54%** (of R$ 25.7k) |
| Ratio hedge/defensivo (Continuidade) | 5.55× | **9.4×** (S2 AMBER) |
| S4 Tier 3 recomendado? | RB Total + S6 RED | **Raramente — apenas "salvar tier de mercado"** |
| S1 VaR 6m P95 | R$ 2.27 bi | **R$ 3.92 bi (+73%)** |
| NPV base | R$ 10.0 bi | **R$ 2.5 bi (sem mitigação)** → R$ 9.5 bi (com mitigação) |

### 5.2 Plano de mitigação prioritário

**Tier 1: Ações de curto prazo (0-6 meses)**
1. Hedge FX: aumentar de 46% para **80-95%** em S6 AMBER+
2. Quota BYD: maximizar uso da quota US$ 463M (H1/2026) antes de Jul/2026
3. Pass-through parcial: repassar 30-50% da tarifa ao consumidor (mix shift para trims mais altos)

**Tier 2: Ações de médio prazo (6-18 meses)**
4. Nacionalização: acelerar para 70% até fim/2026 (meta BYD) — reduz tariff exposure em 57%
5. S8 ramp: maximizar capacidade Camaçari para diluir capex fixo

**Tier 3: Ações estratégicas (18-36 meses)**
6. Mix shift: priorizar modelos com maior conteúdo local (minimizar tariff exposure)
7. Advocacy: manter pressão política via EVE,ABIBA (setorial) — mas sem expectativa de reversão

### 5.3 Trigger matrix revisado (B7: S1↔S4↔S10)

| Status S6 | Status S3 | Variação tariff (30d) | S4 Defensivo recommendation |
|---|---|---|---|
| GREEN | Expansão | < 5pp | **NÃO** — hedge 10× mais barato, defensivo 12× |
| GREEN | Continuidade | < 5pp | **NÃO** — hedge 8× mais barato |
| GREEN | RB Parcial | < 5pp | SIM marginal — defensivo 6× (vs 2.6× pre-tariff) |
| AMBER | RB Parcial | < 5pp | SIM — defensivo competitivo (6.6× S2 AMBER) |
| AMBER | RB Total | ≥ 5pp | SIM — defensivo 4.7× + re-rodar §4 NPV |
| AMBER | qualquer | ≥ 10pp | SIM + escala para CFO review |
| RED | qualquer | ≥ 5pp | **SIM obrigatório** + Board escalation |
| RED | qualquer | ≥ 20pp | **Tier 3 only se "salvar tier de mercado"** |

### 5.4 Implicação para B7 (projecto BYD Camaçari)

A tarifa 35% permanente **não inviabiliza** o projeto Camaçari, mas muda fundamentalmente o perfil de retorno:

- **Pré-tariff**: NPV R$ 10 bi, IRR ~28%, payback ~4 anos
- **Pós-tariff (sem mitigação)**: NPV R$ 2.5 bi, IRR ~14%, payback ~6 anos
- **Pós-tariff (com hedge 95% + nacionalização 70%)**: NPV R$ 9.5 bi, IRR ~26%, payback ~4.5 anos

**Conclusão**: o projeto permanece viável, mas a **margem de segurança cai significativamente**. A mitigação (hedge + nacionalização) é **obrigatória**, não opcional.

---

## §6 Limitações

### 6.1 O que o modelo NÃO captura

1. **Absorção de tarifa pela BYD** (scaling + vertical integration): o modelo assume 50% absorção, mas o range real é 30-70%. Em scaling agressivo (300k+ unidades/ano 2027), absorção pode chegar a 70%, deixando NPV mais próximo do Cenário C.

2. **Nacionalização 70% como meta, não como fato**: BYD pode atingir 50-60% em vez de 70%. Se nacionalização ficar em 50%, o tariff exposure efetivo é 35% × 50% = 17.5%, não 10.5% — NPV piora em R$ 1-2 bi.

3. **Elasticidade-preço da demanda brasileira**: se BYD repassar 100% da tarifa (R$ 20.6k/unit), a demanda pode cair 15-25% (vs 5-10% assumido). Isso reduz volume e NPV simultaneamente.

4. **Reação competitiva** (Stellantis, GM, VW, Geely, GWM): se todas repassam tarifa similar, competitividade relativa se mantém. Se apenas BYD repassa, perde market share. Se ninguém repassa (guerra de preços), margem setorial cai.

5. **Antidumping investigation**: outras montadoras chinesas já sob investigação. BYD pode ser adicionada. Risco **tail** mas existente — não modelado.

6. **Mudança de governo (2026)**: eleição presidencial em out/2026 pode reverter política industrial. Tarifa pode ser reduzida ou eliminada (cenário upside) ou aumentada (downside). Não modelado.

### 6.2 Sensitivities não testadas

- **Tariff stack** (BEV 35% jul/2026 + SKD/CKD 35% jan/2027): modelados juntos em alguns cenários, mas timing importa
- **Compound: tariff 35% + lítio spike (S2 RED) simultâneo**: NPV pode cair para R$ 0-1 bi
- **Compound: tariff 35% + BRL 6.5+**: NPV vira negativo sem mitigação
- **Nacionalização abaixo da meta** (50% em vez de 70%): NPV piora 40%

### 6.3 Dependências de validação externa

- **Risk Officer**: calibração do target ratio (9-11× em Continuidade é "aceitável" como seguro de volume?)
- **CFO**: budget de defensivo de R$ 50-300M/ano — pós-tariff o range effective é R$ 75-450M/ano
- **Head Comercial**: tier structure funciona na prática (targeted vs catalog-wide)?
- **S10 agent (B4)**: construir dimensionamento completo de S10 (Tariff Policy)

---

## Fontes

### OSINT primárias (tarifa)
- Reuters: "Brazil to raise EV import tariffs to 35% starting July 2026" (jan/2025)
- Reuters: "BYD asks for tariff reduction on SKD/CKD" (mai/2025); "Brazil rejects BYD tariff reduction request" (jul/2025)
- electrive.com: "Brazil confirms 35% EV tariff for 2026" (jan/2025); "BYD quota US$ 463M tariff-free" (dez/2025)
- g1.globo: "Gecex-Camex define novo cronograma de tarifas" (jan/2026)
- quatrorodas.abril.com.br: "Tarifa BEV 35% em jul/2026" (fev/2026)
- scmp.com: "BYD's Brazil tariff challenge" (ago/2025)

### OSINT margin compression
- Boston Consulting Group: "How Tariffs Affect Automotive Margins" (2024) — regra 3-5% margin per 10pp
- McKinsey & Company: "Global Automotive Margin Pool 2025"
- IHS Markit / S&P Global: "Tariff impact on EV margins in Latin America" (2025)
- Reuters: "BYD margin guidance 2026" — absorção 30-50% de tarifa

### Documentos D3 referenciados
- `D3-EXPANSION-PLAN.md` (linha B7: "Recalibrar S1↔S4 (tariff 35% Jan/2027)")
- `D3-OSINT-CHECKPOINT.md` (crítica #5)
- `D3-INTERDEPENDENCY-S10-TARIFF.md` (S10 como dimensão, couplings S1↔S10, S4↔S10)
- `D3-INTERDEPENDENCY-S1-S4.md` (modelo base hedge vs defensivo)
- `D3-RECALIBRATION-S1-S4.md` (recalibração σ=16%, ratio 9.4× → 5.5×)
- `D3-NPV-LAYER-SPEC.md` (spec do NPV layer, Inputs: VGV 30B, margin 22%, WACC 12%)

---

## Próximos passos

1. **Integrar este doc ao D3 v0.6** — atualizar `D3-INTERDEPENDENCY-S1-S4.md` com nova matriz ratio e trigger matrix B7
2. **Construir S10 (Tariff Policy)** (B4 agent) — usar este doc como input
3. **Adicionar trigger tariff ≥ 5pp** ao D3-ACTION-REGISTER
4. **Workshop Risk Officer + CFO** para validar: (a) target ratio defensivo/hedge; (b) budget defensivo pós-tariff; (c) switching cost de offshore → onshore
5. **NPV model validation**: conferir inputs com team de FP&A da BYD Brasil

**Resumo executivo em 1 frase**: a tarifa 35% SKD/CKD (Jan/2027, rejeição BYD confirmada) é **fato consumado**, não cenário pessimista — o NPV do projeto Camaçari cai de R$ 10.0 bi para R$ 2.5 bi sem mitigação, mas pode ser recuperado para R$ 9.5 bi com hedge FX 95% + nacionalização 70%. O ratio defensivo/hedge piora 70% (de 5.5× para 9.4× em Continuidade), tornando defensivo Tier 2 **ainda mais restritivo** (margin consumed sobe de 23% para 54%). A mitigação combinada é obrigatória, não opcional.
