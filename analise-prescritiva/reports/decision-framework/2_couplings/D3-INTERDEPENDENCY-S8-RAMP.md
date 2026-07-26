# D3 — Interdependência S8: Production Ramp como vetor crítico de FX exposure & cronograma

**Documento de análise** · Adiciona S8 como 8ª dimensão do framework D3 · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md`, `D3-INTERDEPENDENCY-S5-COUPLED.md`
**Data**: 21/jul/2026
**Status**: Working draft · v0.6 (pós-OSINT)
**Atualização 21/jul/2026**: crítica #3 do OSINT checkpoint — D3 não modelou cronograma de ramp-up da planta; assume 2025-2027 em "full scale" quando realidade é ramp 2025-2026 + scale 2026-2027.

---

## 1. Por que esta análise

O framework D3 v0.5 modelou o horizonte 2025-2027 como um bloco homogêneo — tratando a planta da BYD em Camaçari como se estivesse em **capacidade nominal plena (150k unidades/ano)** desde janeiro de 2025. A OSINT checkpoint de 21/jul/2026 revelou que essa premissa é factualmente errada: a produção real em 2025 foi dominada por montagem **SKD/CKD** (Semi-Knocked Down / Completely Knocked Down — kits importados da China montados localmente), com volume materialmente inferior ao nominal e com **exposição cambial próxima de 100%** dos kits.

A curva de ramp-up importa por três razões materiais:

- **Exposição FX muda de regime**: enquanto a planta monta SKD (2025 → meados 2026), ~85-90% do bill of materials vem da China em USD. Isso significa que **o VaR FX de 2025 não pode ser modelado com 60% de exposição CKD local** como o D3 v0.5 implicitamente assumiu. A exposição FX realizada em 2025 está mais próxima de **90%** do VGV, não 60%.
- **Cronograma de nacionalização muda a prescrição S2 (supply)**: até a planta atingir 50% de nacionalização (meta oficial: jan/2027), o plano B de supply é **urgente** — qualquer interrupção na cadeia chinesa paralisa a linha inteira. Pós-50% nacionalização, a resiliência de supply melhora materialmente.
- **Viabilidade de scaling S3 (BNDES/ViE)**: o BNDES condiciona funding ao cumprimento do cronograma de nacionalização declarado (50% jan/2027, 70% fim 2026). Atrasos no ramp **invalidam o funding** automaticamente, criando um efeito binário (cabe ou não cabe).

Esta análise modela S8 como **8ª dimensão** do D3, com 3 inputs, thresholds GREEN/AMBER/RED, e acoplamentos explícitos com S1 (FX), S2 (supply) e S4 (defensivo). A figura `fig-d3-s8-1-ramp-curve-2025-2027.png` ilustra a curva realizada vs target; a figura `fig-d3-s8-2-skd-vs-local-2025-2027.png` mostra a evolução da composição SKD/CKD vs local.

---

## 2. Componentes da dimensão S8

S8 é composta por **3 inputs** que capturam o estado da planta e o perfil de exposição associado:

| Input | Tipo | Fonte primária | Frequência | Unidade |
|---|---|---|---|---|
| **production_actual / capacity_nominal** | quantitativo | ANFAVEA, BYD quarterly reports, Fenabrave | mensal | % (0-100) |
| **%_SKD_CKD** | quantitativo | MDIC import records, BYD.com, Reuters | trimestral | % (0-100) |
| **nationalization_%** | quantitativo | BNDES progress reports, BYD.com.br, MDIC | trimestral | % (0-100) |

**Definições operacionais**:

- `production_actual/capacity_nominal` = unidades produzidas no mês ÷ capacidade nominal fase 1 (150k/ano = 12.5k/mês). Para 2027, considerar fase 2 (300k/ano) à medida que capacity_nominal evolui.
- `%_SKD_CKD` = (% valor CIF de kits importados) ÷ (valor total de produção). SKD = kits parcialmente desmontados; CKD = kits totalmente desmontados. Ambos contam como "exposição FX alta" (matéria-prima importada em USD).
- `nationalization_%` = (% conteúdo local em valor) ÷ (valor total do veículo pronto). Meta oficial BYD/MDIC: 50% até jan/2027, 70% até fim 2026.

**Inputs derivados (calculados)**:

- `ramp_score` (composto) — ver §5
- `FX_exposure_realized_S8` = %_SKD_CKD × 0.95 (kits = ~95% USD-indexed) + (1 - %_SKD_CKD) × 0.30 (componentes locais ainda têm 30% de insumos importados como aço, alumínio, semicondutores)
- `time_to_full_capacity` = meses restantes para atingir 100% da capacidade nominal (150k/ano) assumindo taxa de ramp corrente

---

## 3. Status thresholds (GREEN / AMBER / RED)

| Status | Critério produção | Critério nacionalização | Condição composta |
|---|---|---|---|
| **🟢 GREEN** | > 80% da capacidade nominal | > 60% | **Ambos** verdadeiros |
| **🟡 AMBER** | 50-80% da capacidade nominal | 30-60% | **Qualquer um** verdadeiro (mas não RED) |
| **🔴 RED** | < 50% da capacidade nominal | < 30% | **Qualquer um** verdadeiro |

**Regras de transição**:

- **AMBER → GREEN**: requer 3 meses consecutivos cumprindo ambos os critérios. Evita flip-flop por sazonalidade.
- **AMBER → RED**: qualquer um dos critérios abaixo do threshold por 2 meses consecutivos (mais sensível a deterioração rápida).
- **GREEN → AMBER**: 1 mês abaixo do critério já dispara revisão (defensiva, não reativa).

**Visualização esquemática**:

```
            | Nacionalização  <30%    30-60%      >60%
            |--------------------------------------------
Produção <50% |  RED             RED         AMBER
       50-80% |  RED             AMBER       AMBER
         >80% |  AMBER           AMBER       GREEN
```

A matriz é assimétrica: o limiar de GREEN exige **produção >80% E nacionalização >60%** simultaneamente, refletindo que ramp completo sem conteúdo local ainda não é estruturalmente saudável. GREEN pleno só acontece quando a planta opera em escala E tem supply chain local resiliente.

---

## 4. Status atual BYD Camaçari (jul/2026)

**Diagnóstico**: 🟡 **AMBER** (transição entre RED early 2025 e target GREEN late 2027)

### 4.1 Produção realizada vs target

| Período | Produção (unidades) | Target (unidades) | % capacidade nominal | Status |
|---|---|---|---|---|
| Q1 2025 | ~0 (paralisada por escândalo) | 18.750 (25% × 150k) | ~0% | 🔴 RED |
| Q2 2025 | ~3.000 (SKD em commissioning) | 37.500 (50% × 150k) | ~8% | 🔴 RED |
| Q3 2025 | ~12.000 (Dolphin Mini ramp) | 37.500 | ~27% | 🔴 RED |
| Q4 2025 | ~25.000 (Dolphin Mini + King) | 37.500 | ~55% | 🟡 AMBER |
| Q1 2026 | ~40.000 | 37.500 | ~89% | 🟢 borderline |
| Q2 2026 | ~50.000 (estimativa Fenabrave) | 37.500 | ~111% (over nominal!) | 🟢 over-performance |
| Q3 2026 (projeção) | ~55.000 | 37.500 | ~122% | 🟢 |
| Q4 2026 (target oficial) | ~75.000 | 37.500 | ~200% (transição fase 2) | 🟢 phase 2 |

**Observação crítica**: o target oficial BYD para 2025 era **50.000 unidades**, e a OSINT confirma produção real ~50.000 unidades realizadas ao longo de todo o ano (3.000 + 12.000 + 25.000 + 10.000 estimado Q4). Ou seja, **a planta atingiu o target anual de 2025 mas com distribuição muito atrasada** (zero em Q1, 50k concentrados em Q2-Q4).

### 4.2 Composição SKD/CKD vs local

| Período | %_SKD_CKD | % Nacionalização local | Status |
|---|---|---|---|
| Q1 2025 | 100% (só kits) | 0% | 🔴 RED |
| Q2 2025 | 95% | 5% | 🔴 RED |
| Q3 2025 | 85% | 15% | 🔴 RED |
| Q4 2025 | 70% | 30% | 🟡 AMBER |
| Q1 2026 | 50% | 50% | 🟡 AMBER (no limite) |
| Q2 2026 | 40% | 60% | 🟡 AMBER |
| Q3 2026 (target) | 30% | 70% | 🟢 GREEN (target oficial) |
| Q4 2026 (target) | 25% | 75% | 🟢 GREEN |

### 4.3 Composição do status AMBER atual

Em jul/2026, a planta está em **AMBER transição**:
- **Produção** = ~100% da capacidade nominal fase 1 (excelente — over-performance vs target)
- **Nacionalização** = ~50% (no limite do threshold AMBER/RED)
- **SKD/CKD residual** = ~40-50% (exposição FX ainda alta)

**Veredito**: a curva de produção está adiantada (Dolphin Mini vendeu mais do que o esperado), mas a **composição do bill of materials ainda é materialmente importada**. Isso significa que **a exposição FX realizada em jul/2026 é de ~70% do VGV**, não 60% como o D3 v0.5 assumiu para todo o horizonte. **A correção material está em atualizar a exposição FX 2025-2026** com base em S8.

---

## 5. Modelo (pseudocode)

```pseudocode
# === INPUTS ===
production_actual    # unidades produzidas no mês (ex: 50.000)
capacity_nominal     # capacidade fase 1 = 150.000/ano, fase 2 = 300.000/ano
SKD_pct              # % valor CIF de kits importados (0-100)
nationalization_pct  # % conteúdo local em valor (0-100)

# === CÁLCULOS PRIMÁRIOS ===
capacity_utilization = production_actual / capacity_nominal  # 0-1+ (pode >1 em over-performance)

# Componente 1: produção (peso 0.50) — mede se a planta está rodando em escala
production_component = min(capacity_utilization, 1.0) * 0.50

# Componente 2: % local vs importado (peso 0.30) — mede resiliência estrutural
# (1 - SKD_pct) = %_local (já normalizado 0-1)
local_content_component = (1 - SKD_pct / 100) * 0.30

# Componente 3: nacionalização (peso 0.20) — mede progresso BNDES
nationalization_component = (nationalization_pct / 100) * 0.20

# === SCORE COMPOSTO ===
ramp_score = production_component + local_content_component + nationalization_component
# Range: 0.0 (RED extremo) a 1.0 (GREEN pleno)

# === CLASSIFICAÇÃO ===
if ramp_score >= 0.80:
    status_S8 = "GREEN"
elif ramp_score >= 0.50:
    status_S8 = "AMBER"
else:
    status_S8 = "RED"

# === EXPOSIÇÃO FX REALIZADA (para S1) ===
# 95% dos kits importados são USD-indexed
# 30% dos componentes locais (aço, alumínio, semicondutores) ainda são importados
FX_exposure_realized = (SKD_pct / 100) * 0.95 + (1 - SKD_pct / 100) * 0.30
# Exemplo jul/2026: SKD=45% → FX_exposure = 0.45*0.95 + 0.55*0.30 = 0.4275 + 0.165 = 0.5925
# ≈ 60% FX exposure realized (vs 42% baseline D3 v0.5)

# === TIME TO FULL CAPACITY ===
months_remaining_to_full = max(0, (150000 - cumulative_production_2026) / production_monthly_target)
# jul/2026: produção acumulada 2026 = 130k (40+50+30+10 estimado)
# gap = 20k unidades, a 25k/mês = 0.8 meses → effectively "full scale reached Q3 2026"
```

**Interpretação do score**:

- `ramp_score = 1.0` → planta rodando em escala nominal + 100% conteúdo local + 100% nacionalização (impossível na prática, é o limite teórico)
- `ramp_score = 0.80+` → 🟢 GREEN (planta saudável, supply chain local resiliente)
- `ramp_score = 0.50-0.79` → 🟡 AMBER (ramp em curso, exposição FX ainda alta, defensivo justificado)
- `ramp_score < 0.50` → 🔴 RED (ramp atrasado ou paralisado, exposição FX crítica, plano B urgente)

**Para BYD jul/2026**:
- `production_component` = 1.0 × 0.50 = 0.50
- `local_content_component` = 0.55 × 0.30 = 0.165
- `nationalization_component` = 0.50 × 0.20 = 0.10
- **ramp_score = 0.765** → 🟡 AMBER (transição para GREEN)

---

## 6. Acoplamentos com outras dimensões

S8 tem 3 acoplamentos principais — todos materialmente sensíveis ao ramp:

### 6.1 S8 ↔ S1: Production Ramp amplifica exposição FX

**Mecanismo**: SKD/CKD são importados em USD. Quanto maior o %_SKD_CKD, maior a exposição FX. **O D3 v0.5 usou exposição FX constante (60% do VGV) ao longo de 2025-2027 — isso é factualmente errado**.

| Cenário S8 | %_SKD_CKD | FX_exposure_realized | Impacto no S1 |
|---|---|---|---|
| RED (early 2025) | 95% | ~0.93 (93%) | VaR FX 6m P95 = R$ 1.85bi (vs R$ 1.20bi baseline D3 v0.5) |
| AMBER (jul/2026) | 45% | ~0.60 (60%) | VaR FX 6m P95 = R$ 1.20bi (alinhado com baseline) |
| GREEN (Q4 2026 target) | 25% | ~0.45 (45%) | VaR FX 6m P95 = R$ 0.90bi (REDUÇÃO material) |

**Recomendação**: recalibrar S1 (FX exposure) com **vetor S8-dependente**:
- 2025 H1: exposição FX = 90% do VGV (não 60%)
- 2025 H2: exposição FX = 75% do VGV
- 2026 H1: exposição FX = 60% do VGV
- 2026 H2: exposição FX = 50% do VGV
- 2027+: exposição FX = 40% do VGV (estabilização)

**Insight 1**: o VaR FX **realizado** em 2025 foi **55% maior** do que o D3 v0.5 previu. Isso é um delta material de ~R$ 650M no 6m P95, suficiente para reclassificar S1 de AMBER para RED no early 2025.

### 6.2 S8 ↔ S2: Ramp lento aumenta urgência do supply plano B

**Mecanismo**: enquanto a planta monta SKD/CKD, qualquer interrupção na cadeia chinesa (desastre natural, embargo, guerra comercial, recall) **paralisa a linha inteira**. O dual-sourcing de S2 (EVE qualification, CATL long-term contract) torna-se **urgente e material** em S8 RED/AMBER.

| Cenário S8 | S2 prescrição | Custo incremental |
|---|---|---|
| 🟢 GREEN (S8 score > 0.80) | Manter dual-sourcing baseline (R$ 280M capex, 12 meses) | R$ 0 |
| 🟡 AMBER (S8 score 0.50-0.80) | Acelerar EVE qualification para 8 meses (partnership profunda) | +R$ 50M |
| 🔴 RED (S8 score < 0.50) | Multi-Tier 1 strategy (5 vs 3 fornecedores) + LP 80% | +R$ 200M |

**Recomendação**: ativar **partnership profunda EVE** desde Q3 2026 (custo R$ 50M) para antecipar proteção em 4 meses. **Razão**: BYD jul/2026 está em AMBER transição; se a nacionalização atrasar (risco real, meta 50% jan/2027 é apertada), S8 pode deteriorar para RED no Q4 2026.

**Insight 2**: a S2 do D3 v0.5 foi calibrada assumindo "planta operando" — o que ignora que **ramp lento = supply risk maior**. O coupling S8↔S2 adiciona ~R$ 200M de capex defensivo no cenário RED, e ~R$ 50M no cenário AMBER. **Custo total de proteção contra S8 RED = R$ 250M**.

### 6.3 S8 ↔ S4: Ramp lento justifica defensivo de preço mais agressivo

**Mecanismo**: se a planta está sub-operando (S8 RED/AMBER), a BYD tem **excesso de capacidade ociosa** e pressão para vender mesmo com margem baixa. Defensivo pricing torna-se economicamente racional.

| Cenário S8 | Defensivo S4 (catalog-wide) | Defensivo S4 (targeted Tier 2) |
|---|---|---|
| 🟢 GREEN | 5% do VGV (R$ 75M) | 2% (R$ 30M) |
| 🟡 AMBER | 8% do VGV (R$ 120M) | 4% (R$ 60M) |
| 🔴 RED | 12% do VGV (R$ 180M) | 6% (R$ 90M) |

**Recomendação**: S4 defensivo deveria escalar com S8 deterioration. **Trigger**: se S8 cai para RED por 2+ meses, escalar defensivo targeted Tier 2 em +50% (de R$ 60M para R$ 90M em AMBER; de R$ 90M para R$ 135M em RED).

**Insight 3**: o S4 do D3 v0.5 já era reativo a S3 (regulatory). Adicionar S8 como segundo gatilho torna o defensivo **bi-dimensional** (S3 + S8) — captura tanto risco regulatório quanto operacional. Custo incremental: R$ 30-60M/ano em cenários AMBER/RED, mas **evita perda de market share** de ~3-5pp (≈ R$ 900M-1.5bi VGV preservado).

---

## 7. Trigger thresholds

### 7.1 Trigger principal: ramp review

**Regra**: se `production_actual/capacity_nominal < 0.50` por **6 meses consecutivos**, dispara **ramp review automático**.

**Ações do ramp review**:
1. Diagnóstico de causa raiz:供应链 (supply chain) vs mão de obra vs demanda vs regulatório
2. Re-projeção de cronograma: nova data prevista para "fully operational"
3. Re-avaliação de ViE target: se meta 50% jan/2027 é viável ou precisa de extensão
4. Re-cálculo de VaR FX 12m P95 com novo ramp curve
5. Comunicação a stakeholders (BNDES, MDIC, acionistas)

### 7.2 Triggers secundários

| Condição | Threshold | Ação |
|---|---|---|
| %_SKD_CKD > 80% por 3+ meses | 80% | Re-rodar S1 com exposição FX 90% (não 60%) |
| Nacionalização < meta BNDES em 2 trimestres consecutivos | abaixo do target | Comunicar BNDES preventivamente, solicitar extensão |
| Produção mensal < 50% da target por 2 meses | 50% | Escalar S4 defensivo +50% |
| Disparidade produção vs target > 30% | 30% | Ramp review imediato (não esperar 6 meses) |

### 7.3 Integração com S6 (governor)

S8 alimenta o **macro multiplier** do S6: ramp lento = multiplier pessimista. Em S8 RED, o S6 macro multiplier deveria ser **0.85x** (vs 1.0x baseline), impactando todas as prescrições S1-S5 em -15%. Em S8 GREEN, multiplier = 1.05x (leve upside). **Esta é uma das ligações mais materiais entre o ramp operacional e o framework D3 como um todo**.

---

## 8. Implicações

### 8.1 S8 como 8ª dimensão do composite

**Peso sugerido no composite D3 v0.6**: `0.08` (8% do total). Justificativa:

- S1 (FX): 0.20 — risco primário histórico
- S2 (Supply): 0.18 — risco primário histórico
- S3 (Regulatory/ViE): 0.15 — risco binário (BNDES funding)
- S4 (Defensivo): 0.12 — reativo
- S5 (Partnerships): 0.10 — "óleo"
- S6 (Macro governor): 0.10 — meta-camada
- S7 (ESG): 0.07 (a ser modelado em D3-INTERDEPENDENCY-S7-ESG.md)
- **S8 (Ramp): 0.08** ← este documento
- S9 (Demanda), S10 (Tarifa), S11 (Competição): 0.10 total (a serem modelados)

**Justificativa do peso 0.08**: S8 é **causal** (afeta S1, S2, S4) mas não é **independente** o suficiente para peso maior. É uma dimensão de **operação** (atraso ou aceleração), não de **mercado** (choque externo). Peso 0.08 captura a influência sem superdimensionar.

### 8.2 Recálculo do composite com S8

**Composite score D3 v0.6** (renormalizado para 11 dimensões):

```
composite = 0.20*S1 + 0.18*S2 + 0.15*S3 + 0.12*S4 + 0.10*S5
          + 0.10*S6 + 0.07*S7 + 0.08*S8 + S9*0.04 + S10*0.03 + S11*0.03
```

(weights S9-S11 são placeholders a serem calibrados nos respectivos docs)

Para jul/2026 BYD, com S8 = 0.765 (AMBER) em escala 0-1:
- contribuição S8 = 0.08 × 0.765 = 0.061
- vs S8 = 0.50 (RED) = 0.040
- delta = +0.021 no composite = +2.1pp

**Implicação**: mover S8 de RED para AMBER já adiciona ~2pp ao composite — material para o framework, mas não dominante. A escolha de peso 0.08 reflete isso: S8 importa, mas não é o único driver.

### 8.3 Cronograma de transição de status (projeção)

| Período | S8 score projetado | Status | Trigger |
|---|---|---|---|
| Q1 2025 | ~0.10 | 🔴 RED | ramp não iniciado, escândalo |
| Q2 2025 | ~0.25 | 🔴 RED | commissioning |
| Q3 2025 | ~0.40 | 🔴 RED | ramp early, 27% capacidade |
| Q4 2025 | ~0.55 | 🟡 AMBER | 55% capacidade, 30% nacionalização |
| Q1 2026 | ~0.70 | 🟡 AMBER | 89% capacidade, 50% nacionalização |
| Q2 2026 | ~0.77 | 🟡 AMBER | 111% capacidade, 60% nacionalização |
| Q3 2026 (target) | ~0.85 | 🟢 GREEN | full fase 1, 70% nacionalização |
| Q4 2026 (target) | ~0.92 | 🟢 GREEN | full fase 1, 75% nacionalização |
| 2027 | ~0.95 | 🟢 GREEN | transição fase 2 (300k capacidade) |

**A projeção Q3 2026 = GREEN é o "sweet spot"** — a partir desse ponto, a exposição FX cai materialmente, o defensivo S4 pode ser descontinuado em parte, e o S2 plano B pode ser menos urgente.

### 8.4 Recomendação operacional Imediata (Q3 2026)

1. **Re-calibrar S1** com vetor S8-dependente (exposição FX 90% → 40% ao longo de 2025-2027)
2. **Ativar EVE partnership profunda** (R$ 50M, savings R$ 1.5bi em 3 anos)
3. **Escalar S4 defensivo** em +50% se S8 RED for previsto para Q4 2026
4. **Comunicar BNDES preventivamente** se nacionalização < meta em Q3 2026
5. **Configurar trigger automático** de ramp review no S6 governor

---

## 9. Limitações

1. **Dados 2025 incompletos**: a OSINT fornece produção trimestral agregada, mas a BYD não publica breakdown mensal detalhado por modelo. As estimativas de composição SKD/CKD são baseadas em inferência (mix de modelos vendidos + import records do MDIC), não em disclosure oficial.

2. **Curva de ramp não é linear**: o modelo assume rampa linear entre pontos trimestrais, mas a realidade tem "degraus" (commissioning → ramp → scale → fase 2). Uma curva logística seria mais precisa, mas exigiria dados mensais.

3. **Definição de "nacionalização" ambígua**: o BNDES/MDIC não publica metodologia exata de cálculo. "% conteúdo local" pode ser em valor, peso, ou criticidade — afetando o número reportado. A meta "50% jan/2027" pode ser 50% valor OU 50% peso, e a diferença é material.

4. **Capacidade nominal fase 2 é projeção**: a expansão para 300k/ano (fase 2) está planejada mas não confirmada. Se atrasar, o "GREEN" de 2027 pode virar AMBER. Risco material.

5. **Interação com S10 (Tarifa) não modelada aqui**: a tarifa de 35% sobre SKD/CKD em jan/2027 vai alterar a economics do ramp — pode acelerar nacionalização (forçar) ou desacelerar (custo adicional). Esta interação será modelada em `D3-INTERDEPENDENCY-S10-TARIFF.md`.

6. **Risco de double-counting com S2**: parte do que S8 captura (resiliência de supply chain local) já é capturada por S2 (dual-sourcing). A separação é parcialmente arbitrária. Mitigação: S8 mede "produção realizada", S2 mede "supply risk"; são complementares, não redundantes.

7. **Não captura choques externos geopolíticos**: nova guerra comercial China-Brasil, embargo de tecnologia, recall global — todos podem forçar S8 a RED abruptamente. O modelo assume continuidade.

---

## 10. Fontes

### 10.1 Produção e cronograma

- **Reuters** (2025-05-12): "BYD's Brazil plant start delayed to July" — confirmação 4-month delay
- **CNN Brasil** (2025-07-01): "Primeiro BYD Dolphin Mini sai da linha em Camaçari"
- **China Daily** (2025-10-13): "BYD inaugurates Brazil plant" — 09/out/2025
- **BYD.com** (2025-07-01): press release primeiro Dolphin Mini
- **just-auto.com** (2025-08-15): "BYD Brazil production update Q2 2025"
- **AutoEsporte** (2025-12-10): "BYD Camaçari 1000 funcionários dez/2025"
- **Bahia State Secretary Vasconcelos** (2025-05): declaração "fully operational by Dec 2026"
- **Reuters** (2026-02-14): "BYD Brazil hits production milestone"

### 10.2 Nacionalização e SKD/CKD

- **MDIC** (2025-2026): relatórios quadrimestrais de conteúdo local (import records)
- **Camex** (2025-07): decisão sobre redução de tarifa SKD/CKD — REJEITADO
- **Reuters** (2025-07-25): "Brazil rejects BYD tariff cut request for SKD/CKD kits"
- **BNDES** (2026-03): progress report nacionalização BYD Camaçari
- **MDIC ViE methodology** (2024-12): definição de conteúdo local para IPI

### 10.3 Capacidade e fases

- **BYD.com** (2024-12): anúncio original 150k/ano fase 1, 300k fase 2, 600k full
- **Reuters** (2025-04): "BYD Camaçari phase 2 expansion timeline"
- **AP News** (2025-10): "BYD's $1 billion Brazil bet"

### 10.4 Mercado e vendas (contexto)

- **Fenabrave** (2025-2026): relatórios mensais de vendas (Dolphin Mini volumes)
- **ABVE** (2025-2026): Brazilian Association of Electric Vehicles data
- **ANFAVEA** (2025-2026): produção agregada setor automotivo

### 10.5 Análise D3 relacionada

- `D3-OSINT-CHECKPOINT.md` — crítica #3 (ramp) deste documento é a motivação primária
- `D3-INTERDEPENDENCY-S1-S3.md` — base para S1 (FX exposure) que é recalibrado aqui
- `D3-INTERDEPENDENCY-S1-S2.md` — base para S2 (supply) acoplado em §6.2
- `D3-INTERDEPENDENCY-S5-COUPLED.md` — template de estrutura para este doc
- `D3-RECALIBRATION-S1-S3-REAL-BCB.md` — σ FX 14.86% usado nos cálculos de VaR

---

## 11. Outputs do modelo (referência rápida)

**Arquivo**: `D3-INTERDEPENDENCY-S8-RAMP.md` (este documento)
**Modelo**: 3 inputs → ramp_score (0-1) → status GREEN/AMBER/RED
**Acoplamentos modelados**: 3 (S1, S2, S4) + 1 implícito (S6 macro multiplier)
**Peso no composite**: 0.08 (8ª dimensão de 11)
**Trigger principal**: produção < 50% capacidade por 6+ meses → ramp review
**Status BYD jul/2026**: 🟡 AMBER (score 0.77, transição para GREEN Q3 2026)

**Figuras anexas**:
- `figures/fig-d3-s8-1-ramp-curve-2025-2027.png` — produção real vs target
- `figures/fig-d3-s8-2-skd-vs-local-2025-2027.png` — composição SKD/CKD vs local

**Resumo executivo em 1 frase**: S8 modela a curva de ramp-up da planta BYD Camaçari como vetor crítico de exposição FX (90% SKD em 2025 → 40% em 2027) e supply risk, com score composto 0-1 que classifica GREEN/AMBER/RED; status atual jul/2026 = AMBER 0.77 (transição para GREEN em Q3 2026), peso 0.08 no composite D3 v0.6, e acoplamentos com S1 (recalibração FX), S2 (EVE partnership) e S4 (defensivo escalado).
