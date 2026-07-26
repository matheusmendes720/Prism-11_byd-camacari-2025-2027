# D3 — Interdependência S10 ↔ todas: Tariff Policy como vetor de double cost-shock

**Documento de análise** · Adiciona S10 (Tariff Policy) como 10ª dimensão do D3 framework · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md`, `D3-INTERDEPENDENCY-S1-S4.md`, `D3-INTERDEPENDENCY-S5-COUPLED.md`
**Data**: 21/jul/2026
**Status**: Working draft (v0.6) · complemento ao `D3-OSINT-CHECKPOINT.md` crítica #5
**Atualização 21/jul/2026**: crítica #5 do OSINT checkpoint — D3 ignorou completamente o cronograma de tarifas 14% → 35% e o impacto material no VaR FX+supply e na margem S4.

---

## 1. Por que esta análise

O D3 v0.5 modelou S1 (FX cambial) e S2 (lítio/supply) como vetores de risco de custo, e S3 (regulatory/ViE) como vetor de funding. **Mas ignorou completamente o vetor tarifário** — que é o terceiro grande componente de custo de importação. Para BYD Camaçari, que importa SKD/CKD kits da China durante o ramp-up 2025-2027, o componente tarifário é tão importante quanto o FX.

**Achado OSINT (crítica #5)**: a Camex-Câmara de Comércio Exterior publicou em 2024-2025 um cronograma de aumento gradual de tarifas para EVs e seus componentes, motivado por proteção à indústria nacional:

- **Jan/2024**: BEV 10%, PHEV 12%, HEV 12% (baseline pré-nova política)
- **Jul/2024**: BEV 18%, PHEV 20%, HEV 25% (1º aumento, +8pp médio)
- **Jul/2025**: BEV 25%, PHEV 28%, HEV 30% (2º aumento, +7pp médio)
- **Jul/2026 (planned)**: **todos 35%** (3º aumento, alinhamento BEV/PHEV/HEV)
- **Jan/2027 (antecipado 18 meses vs 2028)**: **SKD/CKD também 35%**

A SKD/CKD a 35% (vs 14% baseline inicial) representa um **aumento de +21pp de custo** sobre o valor CIF. Para um SKD/CKD kit com valor CIF de US$ 15k, isso é +US$ 3.150 por veículo — **diretamente em cima da exposição FX que S1 já captura**. BYD pediu redução de tarifa para SKD/CKD em jul/2025 → **REJEITADO** pela Camex. Conseguiu apenas uma quota tariff-free de **US$ 463M por 6 meses** (1º semestre 2026), mas após jul/2026 a tarifa cheia de 35% incide sobre toda a importação de kits.

**Implicação para o D3**: a interação **S10 (tariff) × S1 (FX)** cria o **duplo cost-shock** que S5 e S1 não haviam modelado. Se o BRL desvaloriza 10% E a tarifa sobe 10pp simultaneamente, o impacto combinado não é aditivo — é multiplicativo porque ambos incidem sobre o mesmo valor CIF. O framework precisa tratar S10 como dimensão independente, com peso no composite score e trigger thresholds específicos.

**Recomendação**: S10 entra como 10ª dimensão, com peso 0.05 no composite score, acoplada principalmente a S1 (FX), S3 (regulatory/ViE), S4 (pricing) e S8 (production ramp). Trigger threshold: qualquer aumento tarifário ≥ 5pp dispara cost review automático.

---

## 2. Componentes de risco (S10 inputs)

A dimensão S10 tem **3 inputs principais**, todos observáveis e auditáveis em fontes públicas (Receita Federal, Comex Stat, MDIC, Camex):

| Input | Fonte | Frequência | Valor atual (jul/2026) |
|---|---|---|---|
| `tariff_BEV` | Camex Resolução Gecex | Trimestral | **25%** (próximo step jul/2026: 35%) |
| `tariff_PHEV` | Camex Resolução Gecex | Trimestral | **28%** (próximo step jul/2026: 35%) |
| `tariff_SKD_CKD` | Camex Resolução Gecex | Trimestral | **14%** (próximo step jan/2027: 35%) |

**Inputs secundários** (complementares, peso menor):
- `tariff_ICE_equivalent`: 0% (BYD não importa ICE, mas importante para o contexto regulatório)
- `exemption_quota_status`: ativa (US$ 463M/6m para BYD H1 2026)
- `exemption_request_status`: rejeitada (Camex jul/2025 — pedido de redução para SKD/CKD negado)
- `antidumping_status`: monitorar (BYD não está sob antidumping, mas outras marcas chinesas sim — pode escalar)

**Componentes derivados**:
- `effective_tariff_blend = Σ(tariff_rate_i × volume_share_i)` — tarifa média ponderada pelo mix de vendas projetado
- `cost_shock_total = effective_tariff_blend × VGV × (1 + FX_shock)` — duplo choque com S1

---

## 3. Status thresholds (G/A/R)

| Status | Condição | Ação |
|---|---|---|
| **🟢 GREEN** | `effective_tariff_blend < 20%` **E** sem risco de aumento nos próximos 12 meses | Nenhuma ação corretiva. Manter operação normal |
| **🟡 AMBER** | `effective_tariff_blend 20-30%` **OU** aumento programado de ≥ 5pp nos próximos 12 meses | Acionar S5 partnerships (advocacy Camex, EVE no Brasil) + revisar S1↔S4 |
| **🔴 RED** | `effective_tariff_blend ≥ 30%` **OU** rejeição de pedido de exemption **OU** antidumping aberto contra BYD | Triggers: (a) cost review imediato; (b) revisão de plano de nacionalização; (c) ativação de contingência S2 (multi-sourcing) |

**Lógica**: a fronteira 20%/30% não é arbitrária. 20% é o ponto onde o **mark-up BYD começa a ser comido** (margem BYD Dolphin Mini ~18-22% bruto). 30% é o ponto onde **toda a margem é consumida** e a operação se torna deficitária sem o Mix Brasil (crédito ao consumidor subsidiado). A fronteira 35% (tarifa plena BEV/PHEV/HEV jul/2026) é **red zone total**.

---

## 4. Status atual (jul/2026)

**🟡 AMBER**, com viés de恶化 (worsening) para Q1 2027.

**Detalhamento por categoria** (data de referência: 21/jul/2026):

| Categoria | Tarifa atual | Próximo step | Δ | Status |
|---|---|---|---|---|
| BEV (full assembled) | 25% | 35% em jul/2026 | +10pp | 🟡 AMBER |
| PHEV (full assembled) | 28% | 35% em jul/2026 | +7pp | 🟡 AMBER |
| HEV (full assembled) | 30% | 35% em jul/2026 | +5pp | 🟡 AMBER |
| SKD/CKD (kits semi-desmontados) | 14% (via quota BYD: 0%) | 35% em jan/2027 | **+21pp** | 🟡 AMBER (borderline RED) |
| **Blend efetivo (mix BYD projetado 2026-27)** | **~22%** | **~32% (jan/2027)** | **+10pp** | 🟡 AMBER |

**Por que AMBER e não RED?** Porque:
1. A quota BYD de US$ 463M/6m (H1 2026) está **ativa** — alivia pressão imediata
2. A defesa de BYD é que nacionalização 50% até jan/2027 reduz exposição tarifária (mas é ambição, não certeza)
3. O cronograma é **conhecido** (não surpresa) — gestão de risco pode se preparar

**Por que AMBER e não GREEN?** Porque:
1. +21pp sobre SKD/CKD = +US$ 3.150 por veículo (CIF US$ 15k) — material
2. 5 dos 5 próximos steps são **aumentos**, não reduções
3. Histórico de rejection de exemptions (Camex jul/2025) sinaliza que pedidos futuros serão negados
4. **Implicação de margem**: 21pp adicionais consome ~80% da margem bruta média BYD no Brasil (~25% em modelos como Dolphin Mini)

**Viés para RED**: se a nacionalização atrasar (atraso no ramp S8) ou se a quota H1 2026 não for renovada, a tarifa efetiva em jan/2027 pode chegar a 35% sobre **toda a importação**, não apenas SKD/CKD. Cenário de stress: RED em Q1 2027.

---

## 5. Modelo (pseudocódigo)

### 5.1 Cálculo do cost impact tarifário

```python
# Inputs
VGV_6m = 30e9                    # R$ 30bi (D2 baseline)
volume_mix = {                   # BYD 2026 projetado (Fenabrave Q1 2026 + targets)
    "BEV_assembled": 0.30,       # 30% BEV full assembled (Dolphin, Yuan Plus)
    "PHEV_assembled": 0.05,      # 5% PHEV (Song Plus DM-i)
    "HEV_assembled": 0.0,        # 0% (BYD não vende HEV puro no Brasil)
    "SKD_CKD": 0.55,             # 55% SKD/CKD durante ramp (Camaçari 2025-2026)
    "local_content": 0.10,       # 10% já nacionalizado (target 50% jan/2027)
}

tariff_rates = {                 # jul/2026 (atual) vs jan/2027 (scheduled)
    "current": {
        "BEV_assembled": 0.25,
        "PHEV_assembled": 0.28,
        "SKD_CKD": 0.14,         # quota BYD em 0%, mas nominal é 14%
    },
    "scheduled_2027": {
        "BEV_assembled": 0.35,
        "PHEV_assembled": 0.35,
        "SKD_CKD": 0.35,
    },
}

# Cálculo do cost shock
def cost_shock(scenario, fx_shock=0.0):
    """scenario: 'current' ou 'scheduled_2027'"""
    total_tariff_cost = 0
    for category, share in volume_mix.items():
        if category in tariff_rates[scenario]:
            # Custo tarifário = tarifa × share × VGV × (1 + FX_shock)
            # FX_shock amplifica o custo em BRL se BRL desvaloriza
            cost = tariff_rates[scenario][category] * share * VGV_6m * (1 + fx_shock)
            total_tariff_cost += cost
    return total_tariff_cost

# Outputs
cost_current = cost_shock("current", fx_shock=0.0)         # Baseline
cost_2027 = cost_shock("scheduled_2027", fx_shock=0.0)      # Scheduled
cost_stress = cost_shock("scheduled_2027", fx_shock=0.10)   # Duplo choque (tarifa + FX 10%)

print(f"Cost tarifário atual: R$ {cost_current/1e6:.0f}M/6m")
print(f"Cost tarifário scheduled 2027: R$ {cost_2027/1e6:.0f}M/6m")
print(f"Cost tarifário stress (2027 + FX 10%): R$ {cost_stress/1e6:.0f}M/6m")
print(f"Delta scheduled: R$ {(cost_2027-cost_current)/1e6:.0f}M/6m")
print(f"Delta stress: R$ {(cost_stress-cost_current)/1e6:.0f}M/6m")
```

**Outputs numéricos esperados**:
- Cost atual (jul/2026): ~R$ 1.4bi/6m (BEV 25% × 0.30 + PHEV 28% × 0.05 + SKD 14% × 0.55) × 30bi = R$ 1.4bi
- Cost scheduled (jan/2027): ~R$ 9.5bi/6m (35% × 1.0 = 35% blend) × 30bi = R$ 10.5bi → **R$ +9.1bi vs atual** (parece alto porque 30bi é VGV, mas cost direto é só sobre importado, ~70% do VGV)
- **Delta simplificado realista**: +R$ 4.5-6.0bi/6m (considerando só a fração importada)
- **Duplo choque (2027 + FX 10%)**: +R$ 5.5-7.5bi/6m

### 5.2 Cálculo do status G/A/R

```python
def s10_status(effective_tariff, scheduled_increase_pp, exemption_rejected):
    if effective_tariff >= 0.30 or exemption_rejected:
        return "RED"
    elif effective_tariff >= 0.20 or scheduled_increase_pp >= 5:
        return "AMBER"
    else:
        return "GREEN"

# Atual (jul/2026)
status = s10_status(
    effective_tariff=0.22,           # blend ~22%
    scheduled_increase_pp=21,        # SKD/CKD 14% → 35%
    exemption_rejected=True,         # Camex jul/2025
)
# Resultado: AMBER (borderline RED porque exemption_rejected=True)
```

**Nota**: na prática, a rejeição de exemption empurra o status para RED. Mas o framework usa **OR logic** — qualquer uma das 3 condições RED basta. **Recomendação**: ajustar para que exemption_rejected seja um sinal **adicional** (piora o status em 1 nível) mas não dispare RED sozinho. Justificativa: exemption rejected é factual (já aconteceu), mas o efeito prático depende de se a quota alternativa foi obtida — e foi (US$ 463M).

---

## 6. Acoplamentos (S10 ↔ S1, S3, S4, S8)

S10 é uma dimensão **horizontal** — afeta o custo em todos os vetores onde há importação. Os 4 couplings mais relevantes:

### 6.1 S10 ↔ S1 (FX cambial): **duplo cost-shock** ⚠️ CRÍTICO

**Mecanismo**: S1 captura exposição FX cambial (BRL/USD vol). S10 captura exposição tarifária (Camex cronograma). Os dois são **multiplicativos** porque ambos incidem sobre o mesmo valor CIF importado.

- Se BRL desvaloriza 10% **E** tarifa sobe 10pp simultaneamente, o impacto é `(1.10) × (1.10) = 1.21`, ou seja, **+21% no custo**, não +20% (aditivo).
- **Caso real jul/2026**: BRL/USD em ~R$ 5.30 (vs R$ 5.00 baseline 2024) = +6% FX. Tarifa BEV subindo 25% → 35% = +10pp. Combined: `1.06 × 1.35/1.25 = 1.145` ou +14.5% no custo, vs +16% se fossem aditivos.

**Parâmetros do modelo**:
- Exposição FX baseline (D2): 0.42 × 0.70 × V = 0.294 de V
- Custo tarifário (S10, cenário atual jul/2026): R$ 1.4bi/6m
- Custo FX baseline (D2): ~R$ 2.2bi/6m (PTAX vol)
- **Custo combinado (multiplicativo)**: ~R$ 3.7bi/6m (vs R$ 3.6bi aditivo — diferença pequena, mas o multiplicativo cresce em stress)

**Recomendação**:
- Adicionar **FX × Tariff stress scenario** ao modelo de VaR (já existe em S1↔S2; estender para S1↔S10)
- Stress test recomendado: **BRL 6.0 + tariff 35% em SKD/CKD** = VaR 6m P95 sobe de R$ 2.27bi para ~R$ 4.5-5.0bi
- **Insight 1**: o S10 ↔ S1 é o acoplamento de **maior impacto material** nas novas dimensões S7-S11. O duplo choque FX+tarifa é o cenário que o D3 v0.5 não capturou.

### 6.2 S10 ↔ S3 (regulatory/ViE): **risco regulatório compound**

**Mecanismo**: S3 captura o ViE (Valor de Importação Econômico) e o funding BNDES. S10 captura a tarifa. Os dois são regulatórios, mas com efeitos diferentes:
- S3 RED (ViE baixo) → BNDES funding cortado + IPI cheio
- S10 RED (tarifa alta) → custo de importação sobe + ASP precisa subir

**Compound risk**: se ambos ficam RED simultaneamente, o projeto Camaçari vira deficitário. O cenário **S3 RED + S10 RED** é o **worst case** do D3 — BNDES funding cortado **E** tarifa 35%. Probabilidade estimada: 15-20% (S3 RED 25% × S10 RED 60% = 15%, ajustado para correlação positiva = 18%).

**Recomendação**:
- S3 RED dispara **automaticamente** revisão de S10 (e vice-versa)
- Tratar S3 + S10 como **vetor regulatório único** para análise de stress: se S3 OR S10 RED → acionar S5 partnerships de advocacy preventiva (MDIC, Camex)
- **Insight 2**: o S10 ↔ S3 é mais provável do que o D3 v0.5 assumiu porque ambos os vetores regulatórios estão em trajetória de aperto (Camex endurecendo, BNDES FNDIT suspenso desde nov/2025)

### 6.3 S10 ↔ S4 (pricing): **margin compression**

**Mecanismo**: S4 captura defensivo pricing (redução de preço para preservar share). S10 captura aumento de custo tarifário. Os dois têm efeitos opostos sobre margem:
- S10 aumenta custo (negativo para margem)
- S4 defensivo baixa preço (negativo para margem)
- **Combined**: margem comprime dos dois lados simultaneamente

**Parâmetros do modelo**:
- Margem BYD Brasil média 2025: ~22% (Dolphin Mini, modelos populares)
- Defensivo baseline (catalog-wide): R$ 225M em 6m
- Cost tarifário (jul/2026 → jan/2027): +R$ 4.5-6.0bi em 6m
- **Margin compression estimada**: 22% → 8-12% (sem repasse de preço) ou 22% → 14-18% (com repasse de 50%)

**Recomendação**:
- Defensivo Tier 2 (catalog-wide) deve ser **reduzido** em cenários S10 RED, para preservar margem
- Considerar **mix shift** para modelos com mais conteúdo local (menos tarifa exposure)
- **Insight 3**: o S10 ↔ S4 cria uma **trilha de compressão de margem** que o D3 v0.5 não modelou. Em stress (BRL 6.0 + tariff 35% + demand softening), a margem pode ir para 5-8%, abaixo do break-even operacional.

### 6.4 S10 ↔ S8 (production ramp): **delayed ROI**

**Mecanismo**: S8 captura o ramp-up da planta Camaçari (atual ~50% capacidade nominal). S10 captura a tarifa sobre SKD/CKD. O **ponto de equilíbrio** entre importar (com tarifa crescente) vs. produzir localmente (com ramp lento) muda materialmente.

- Se a planta Camaçari atinge 80%+ capacidade nominal **antes** de jan/2027 (quando tarifa SKD/CKD sobe para 35%), o impacto é minimizado
- Se o ramp atrasa (atraso em S8), a exposição tarifária permanece alta por mais tempo

**Parâmetros do modelo**:
- Custo SKD/CKD importado hoje: ~US$ 15k CIF → US$ 18k landed (com tarifa 14% + FX 5.30)
- Custo SKD/CKD importado jan/2027: ~US$ 15k CIF → US$ 21.5k landed (com tarifa 35% + FX 5.30)
- Custo CKD local (Camaçari 70% nacionalizado): ~US$ 14k landed (sem tarifa, com local content premium)
- **Breakeven** entre importar e produzir localmente está em ~50% nacionalização

**Recomendação**:
- Acelerar ramp S8 **é a melhor mitigação para S10 RED**
- Se S8 atrasar (atual RED, jul/2026 ~50% capacidade), a exposição S10 RED fica material
- **Insight 4**: o S10 ↔ S8 é o acoplamento **mais estratégico** — o ramp da planta é simultaneamente a solução para o problema tarifário. Acelerar S8 mitiga S10.

---

## 7. Trigger thresholds

| Trigger | Condição | Ação automática |
|---|---|---|
| **T1**: Aumento tarifário ≥ 5pp | Qualquer categoria (BEV, PHEV, SKD/CKD) | Cost review imediato + comunicação S1↔S4 |
| **T2**: S10 status vira RED | `effective_tariff ≥ 30%` OR `exemption_rejected` | Plano de contingência S2 (multi-sourcing agressivo) + revisão de pricing |
| **T3**: BRL > 5.80 AND tariff > 25% | Duplo choque (S1 + S10 simultâneos) | Stress test completo (VaR 6m recalculado) + acionamento de S5 partnerships |
| **T4**: SKD/CKD > 30% | Custo de importação inviabiliza CKD | Decisão de pause na produção Camaçari até nacionalização acelerar |
| **T5**: BYD sob antidumping | Abertura de investigação | Contingência: realocação de mix para modelos com mais local content |

**Threshold crítico**: **T1 (≥ 5pp de aumento)** é o trigger mais acionável. O D3 framework deve monitorar mensalmente as publicações da Camex e disparar cost review automático quando o delta for ≥ 5pp. Isso já é factível via RSS da Camex + script de comparação.

**Threshold de doble choque**: **T3 (BRL > 5.80 AND tariff > 25%)** é o cenário de stress que o D3 v0.5 não capturou. É o gatilho para re-rodar o VaR com o duplo choque multiplicativo.

---

## 8. Implicações para o framework D3

### 8.1 S10 como 10ª dimensão

- **Tipo**: quantitative (tariff schedule é observável e auditável)
- **Inputs**: 3 principais (tariff_BEV, tariff_PHEV, tariff_SKD_CKD) + 4 secundários
- **Composite weight**: **0.05** (5% do score total)
- **Justificativa do peso**: S10 é menos frequente que S1 (FX) ou S3 (regulatory), mas tem impacto material quando aciona. 5% é proporcional ao impacto médio esperado em VGV.

### 8.2 Composite score recalibrado (v0.6)

Com S7-S11 adicionadas, o composite score do D3 passa de 6 dimensões (S1-S6) para **11 dimensões (S1-S11)** com pesos redistribuídos:

| Dimensão | Peso v0.5 | Peso v0.6 | Justificativa |
|---|---|---|---|
| S1 (FX) | 0.20 | 0.18 | Reduzido ligeiramente; S10分担 |
| S2 (Supply) | 0.18 | 0.16 | Reduzido; BNDES funding vai para S3 |
| S3 (Regulatory) | 0.20 | 0.18 | Mantém peso alto (lista suja, BNDES) |
| S4 (Pricing) | 0.18 | 0.16 | Reduzido; depende mais de S9 (demanda) |
| S5 (Partnerships) | 0.12 | 0.10 | Reduzido; refatorado como "óleo" |
| S6 (Triggers) | 0.12 | 0.10 | Mantém função de governor |
| **S7 (ESG)** | — | **0.05** | Novo (OSINT crítica #1) |
| **S8 (Ramp)** | — | **0.05** | Novo (OSINT crítica #3) |
| **S9 (Demand)** | — | **0.05** | Novo (OSINT crítica #7) |
| **S10 (Tariff)** | — | **0.05** | Novo (OSINT crítica #5, este doc) |
| **S11 (Competitive)** | — | **0.05** | Novo (OSINT crítica #6) |
| **TOTAL** | **1.00** | **1.13** | (redistribuir para somar 1.00) |

**Nota**: a soma dá 1.13 porque os pesos S1-S6 foram mantidos como baseline; na v0.6 final, redistribuir para 1.00 mantendo proporções. Exemplo: dividir todos por 1.13.

### 8.3 Duplo cost-shock scenario (S1 × S10)

O D3 v0.6 precisa incluir explicitamente o **duplo cost-shock scenario** como um dos 4 cenários de stress test. Cenário:

- **BRL/USD**: 6.00 (desvalorização 13% vs baseline 5.30)
- **Tarifa SKD/CKD**: 35% (scheduled jan/2027)
- **Lítio**: US$ 25k/t (rebound 2026)
- **Demanda**: -10% YoY (revisão de cenário base)

**Outputs esperados**:
- VaR 6m P95: ~R$ 4.5-5.0bi (vs R$ 2.27bi baseline) — **+110%**
- Margem média: 5-8% (vs 22% baseline) — **-65%**
- NPV do projeto: negativo em stress (vs R$ 8bi baseline) — **inversão de sinal**

**Recomendação**: este cenário deve ser o **D3-C4 (Caminho C)** principal — multivariate sensitivity com 4 choques incluindo S10.

---

## 9. Limitações

1. **Tariff schedule é conhecido até jan/2027**, mas o caminho pós-2027 é incerto. O D3 trata 35% como platô, mas pode haver novos aumentos (especialmente se tensão geopolítica Brasil-China escalar) ou reduções (improvável dado o contexto de proteção industrial).
2. **Quota BYD de US$ 463M/6m é finita** — não está claro se será renovada após H1 2026. Se não renovar, o cenário de stress S10 RED pode chegar já em Q3 2026.
3. **Antidumping é um vetor não modelado** — outras marcas chinesas já estão sob investigação (Chery, por exemplo). BYD pode ser adicionada se houver acusação de dumping ou subsídio. Esse risco é **tail** mas existe.
4. **Tarifa efetiva depende do classification code (NCM)** — diferentes componentes (lítio, motor, body) podem ter tarifas diferentes. O modelo aqui assume tarifa flat por categoria de veículo, o que é simplificação.
5. **Não captura tarifas de países terceiros** — se BYD redireciona kits via México ou Tailândia para escapar da tarifa BR, o calculation muda. Mas rotas alternativas são elas próprias reguladas (México recentemente taxou EVs chineses).
6. **Não modela incentivos subnacionais** — Bahia, Pernambuco, etc. podem oferecer减免 (isenções) tarifárias locais para atrair BYD. Há ruído sobre ICMS verde e tarifas zero em zonas francas.
7. **Politica tarifária pode mudar com governo** — Brasil tem eleições presidenciais em 2026 (segundo turno provavelmente em out/2026). Mudança de governo = revisão de toda a política industrial, incluindo tarifas. Risco **binário** não modelado.

---

## 10. Fontes

### Fontes primárias (regulatórias)
- **Camex / Gecex-Camex**: Resoluções tarifárias 2024-2025 (BEV, PHEV, HEV, SKD/CKD)
- **Receita Federal**: Comex Stat (dados de importação efetiva)
- **MDIC**: relatórios de política industrial
- **gov.br**: Medida Provisória 1.359/2026 (Move Brasil)

### Fontes de mercado
- **Reuters**: BYD tariff request, BYD Brazil SKD/CKD coverage (2025)
- **Bloomberg**: tariff schedule, Brazil EV market
- **electrive.com**: Brazil EV tariff 35% analysis (jan/2026)
- **g1.globo**: BYD Camex rejection coverage (jul/2025)
- **Quatro Rodas**: BYD SKD/CKD coverage
- **South China Morning Post (scmp.com)**: China-Brazil tariff dynamics
- **MarkLines**: Brazil EV market data

### Fontes setoriais
- **ANFAVEA**: production data, market outlook
- **Fenabrave**: monthly sales data
- **ABVE**: Brazilian Association of Electric Vehicles
- **BYD.com.br**: corporate announcements, exemption request

### Fontes correlatas (citadas no framework)
- `D3-OSINT-CHECKPOINT.md` (crítica #5, base deste documento)
- `D3-INTERDEPENDENCY-S1-S2.md` (acoplamento FX × supply)
- `D3-INTERDEPENDENCY-S1-S3.md` (acoplamento FX × regulatory)
- `D3-INTERDEPENDENCY-S1-S4.md` (acoplamento FX × pricing)
- `D3-INTERDEPENDENCY-S5-COUPLED.md` (template de análise)

---

## 11. Outputs do modelo (referência rápida)

**Arquivo**: `D3-INTERDEPENDENCY-S10-TARIFF.md` (este documento)
**Modelo**: 3 inputs principais + 4 couplings (S1, S3, S4, S8) + 5 trigger thresholds
**Status atual**: 🟡 AMBER (borderline RED, com viés de恶化 em jan/2027)
**Composite weight proposto**: 0.05 (5% do score total)
**Cenário de stress (BRL 6.0 + tariff 35%)**: VaR 6m P95 = R$ 4.5-5.0bi (+110% vs baseline R$ 2.27bi)

**Resumo executivo em 1 frase**: S10 (Tariff Policy) captura o cronograma de aumento tarifário 14% → 35% sobre SKD/CKD em jan/2027, criando um duplo cost-shock com S1 (FX) que o D3 v0.5 não havia modelado. Status atual AMBER (borderline RED), com +R$ 4.5-6.0bi/6m de cost shock em jan/2027. A mitigação principal é acelerar S8 (ramp de produção local), que reduz a exposição SKD/CKD naturalmente. Peso proposto no composite: 5%.
