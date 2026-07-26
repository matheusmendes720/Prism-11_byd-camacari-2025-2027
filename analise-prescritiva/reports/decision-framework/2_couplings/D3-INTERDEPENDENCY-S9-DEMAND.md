# D3 — Interdependencia S9: Demand Growth

**Documento de analise** | Dimensão #9 do D3 Decision Framework | Compila com S1-S8, S10, S11
**Data**: 21/jul/2026
**Status**: DRAFT v0.6 — para revisão
**OSINT checkpoint**: D3-OSINT-CHECKPOINT.md (21/jul/2026)

---

## §1. Por que esta análise

O D3 v0.5 modelava o mercado brasileiro de EV com premissas de stress downside: demanda fraca, adoção lenta, share fragmentado. Essa visão refletia 2020-2023, quando EV no Brasil era <1% do mercado e o consumidor demonstrava ceticismo legitimo — preço de entrada elevado, autonomia questionável, infraestrutura de recarga incipiente.

A realidade de 2025-2026 invalida essas premissas. O mercado brasileiro de EV cresceu de ~6% (Jan/2025) para 12.8% (Abr/2026), com expansão de +153% YoY — uma das taxas de adoção mais rapidas do mundo. O Brasil tornou-se o 6º-7º maior mercado EV global, e pela primeira vez uma marca de EV (BYD) lidera o ranking mensal de vendas no varejo brasileiro.

A consequência e inversão radical do risco: o problema material do programa BYD Camaçari 2025-2027 **nao e "BYD vende pouco"** — e sim **"a demanda cresce mais rápido que a capacidade de produção, e a janela competitiva se fecha antes da fase 2 (300k) estar construida"**. O stress e upside, nao downside.

Esta dimensão (S9) quantifica: (i) tamanho e velocidade do mercado EV brasileiro, (ii) sensibilidade ao preço do consumidor brasileiro de EV, e (iii) acoplamentos criticos com tarifa (S10), competição (S11) e credito ao consumidor BNDES (S3). Sozinha, S9 reconfigura todas as prescrições de pricing, capex e roll-back do D3.

---

## §2. Componentes de Demanda

### 2.1 Market Size EV Brasil

| Ano | Vendas totais auto (MM) | EV share estimado | EVs vendidos (k) | Cresc. YoY |
|-----|------------------------|-----------------|-------------------|------------|
| 2024 | 2.5 | 5.2% | 130k | +89% |
| 2025 | 2.8 | 8.5% | 238k | +83% |
| 2026 (proj.) | 3.0 | 13.5% | 405k | +70% |
| 2027 (proj.) | 3.2 | 18.0% | 576k | +42% |

**Benchmark**: China cruzou 13% em 2018, Europa em 2021, EUA ainda nao cruzou (estagnou em ~8%). Brasil atingiu 12.8% em Abr/2026, 17 meses depois de Jan/2025 — trajeto de 17 meses para 6→13pp versus 24-36 meses na China. Velocidade de adoção e anomalamente rapida.

**BYD isoladamente**: 12.8% de share do varejo total (Abr/2026) — primeira marca de EV a liderar ranking mensal no Brasil. Dentro do segmento EV, BYD detem 60-74% do share. Volume BYD Brasil 2025: ~100k unidades. Projecao 2026: 180-220k unidades.

### 2.2 Elasticidade-Preço do Consumidor Brasileiro de EV

O consumidor brasileiro de EV e **altamente price-sensitive** na ausencia de infraestrutura de recarga adequada. Tres fatores determinam a elasticidade:

1. **Premio de preço EV vs ICE**: o consumidor brasileiro aceita premio de ate R$ 15-20k sobre ICE equivalente quando (a) custo de combustivel e favoreavel e (b) IPVA zerado elimina custo de propriedade. Acima de R$ 25k de premio, demanda inelastica reverte para ICE.

2. **Infraestrutura de recarga**: com apenas ~3.000 estaçoes publicas no Brasil (vs 200k+ EUA, 1M+ China), a adoção e concentrada em consumidores com garagem propria (regioes Sudeste/Sul). Nordesta e Norte com <50 estaçoes cada — mercado de massa nao ealcançavel sem infraestrutura.

3. **BNDES Move Brasil (R$ 30bi)**: funding de credito ao consumidor para taxistas e motoristas de app comprarem EVs. Este e um **driver de demanda artificial** — nao e capacidade de pagamento genuína do consumidor, mas sim subsídio cruzado via BNDES. Impacto: reducao de 15-20% no preco efetivo do EV para público elegível.

**Elasticidade cruzada estimada**:
- Preço BYD Dolphin / Seal +10% → -8% a -12% em volume (preço-elasticidade -0.8 a -1.2)
- Combustível -20% (diesel > gasolina convergindo) → -3% demanda EV
- IPVA zerado mantido → +5% demanda EV (efeito sazonal em meses de IPVA)

### 2.3 Sazonalidade

Pico de vendas EV concentra-se em **meses de IPVA zerado** (estado de São Paulo: janeiro para veículos novos; outros estados variam). Efeito: +25-35% nas vendas EV em janeiro-fevereiro versus média mensal. Planejamento de capacidade precisa acomodar este pico sazonal.

---

## §3. Modelagem

### 3.1 Função de Demanda

```
D(P, Y, I, C) = α × (Y^β) × (I^γ) × (C^δ) × e^(−ε×P)

Onde:
P   = preço médio EV (R$) — proxy: ASP BYD Brasil
Y   = renda disponível agregada (proxy: PIB distribuído, índice de confiança do consumidor)
I   = infraestrutura de recarga (número de estações públicas × taxa de utilização)
C   = credito BNDES Move Brasil (R$ 30bi pool, taxa de utilização efectiva)
α   = intercepto (constante de normalização)
β   = elasticidade-renda (estimada: 0.6 — demanda EV cresce 0.6% para cada 1% de renda)
γ   = elasticidade-infraestrutura (estimada: 0.3 — baixa no curto prazo)
δ   = elasticidade-credito (estimada: 0.4 — sensível a disponibilidade de funding)
ε   = elasticidade-preço (estimada: -0.9 — inelasticidade moderada)
```

**Simplificação operacional** ( dashboard ):
```
EV_share(t) = f(tarifa, renda, BNDES_credito_utilizado,基础设施_expansão)
```

### 3.2 Cenários de Demanda 2026-2027

| Cenário | Prob. | EV_share 2027 | Cresc. YoY 2026-27 | Driver principal |
|---------|-------|--------------|---------------------|------------------|
| **A (Baseline)** | 45% | 17-19% | +40-55% | Demanda organica + Move Brasil ativo |
| **B (Upside)** | 25% | 20-25% | +60-80% | Novos modelos <R$ 100k BYD, infraestrutura acelera |
| **C (Downside)** | 20% | 12-15% | +15-25% | Move Brasil esgotado, recessão, tarifa 35% retrai |
| **D (Stress)** | 10% | <10% | <10% | Crise macro severa, IPVA zerado cortado |

**Observação**: a probabilidad 25% de upside (Cenário B) e significativamente maior que em países desenvolvidos — reflete o efeito inicial de curva S onde adoção começa baixa mas acelera rapidamente. A probabilidad 10% de stress (Cenário D) e baixa mas não negligível, dependente de choques macro ou políticos.

### 3.3 Elasticidade e Sensitividade

Teste de stress na função de demanda para precificação:

| Variação | Impacto em D (volumes EV/ano) | Impacto em EV_share |
|---------|------------------------------|---------------------|
| Tarifa 35% → +8% preço final | -60k a -80k (-15% a -20%) | -1.5 a -2.5pp |
| BNDES Move Brasil +50% funding | +40k a +60k (+10% a +15%) | +0.8 a +1.2pp |
| Combustível -30% (convergência diesel-gasolina) | -20k a -30k (-5% a -8%) | -0.5 a -0.8pp |
| Infraestrutura +100% (3k→6k estações) | +15k a +25k (+4% a +6%) | +0.3 a +0.6pp |

**Conclusão de elasticidade**: a tarifa de 35% (S10) e o funding BNDES (S3) sao os dois maiores determinantes de demanda no horizonte 2026-2027 — mais que preço BYD ou renda. Esto sao exatamente os acoplamentos críticos de S9.

---

## §4. Acoplamentos

S9 (Demand) conecta-se a tres dimensoes de forma assimétrica — S9 funciona como **amplificador** ou **modulador** das prescrições dessas dimensoes.

### 4.1 S9 ↔ S10 (Tarifa de Importação)

Tarifa de 35% sobre EVs chineses a partir de Jan/2027 atua diretamente no preço final do EV, comprimindo a função de demanda. O acoplamento e **negativo**: tarifa mais alta → demanda mais baixa.

| S9 Status | S10 Tarifa 35% | Efeito combinado | Recomendação |
|-----------|---------------|-----------------|--------------|
| GREEN (+153% YoY) | Ativada Jan/2027 | Demanda ainda cresce, mas com +50k volume menor vs baseline | BYD absoreve 60-70% do impacto via eficiência de custo; preço final BYD Dolphin sobe ~R$ 8-12k |
| AMBER (30-50% YoY) | Ativada Jan/2027 | Crescimento moderado; tarifa pode empurrar para RED | Defensive pricing seletivo em modelos de entrada |
| RED (<10% YoY) | Ativada Jan/2027 | Demanda estagna; risco de share ICE recuperar | Defensivo full em toda a linha BYD |

**Mecanismo**: BYD tem vantagem de custo de produção na China que permite absorver parte da tarifa sem repassar 100% ao consumidor. Estimativa: BYD pode absorver R$ 8-12k do impacto de R$ 20-25k (35% sobre ASP de R$ 70-80k) mantendomargem positiva. Concorrentes ocidentais (GM, Stellantis, VW) com custo de produção local maiores absorvem menos — BYD ganha share relativo mesmo com tarifa.

**Descrever figura**: `fig-d3-s9-1-demand-curve.png`
Curva de demanda de EV no Brasil 2024-2027, mostrando três linhas: (i) demanda baseline sem tarifa, (ii) demanda com tarifa 35% aplicada em Jan/2027, (iii) demanda com tarifa 35% + BNDES Move Brasil ampliado. Eixo X = meses (Jan/2024 a Dez/2027); Eixo Y = volume EV vendas mensais (k unidades). Queda abrupta em Jan/2027 visível na curva com tarifa; offset parcial pela linha BNDES.

### 4.2 S9 ↔ S11 (Competição)

BYD detem 60-74% do EV share no Brasil em 2026. O acoplamento S9↔S11 opera em duas direções: (i) se demanda total cresce, newcomers tem mais espaço para ganhar share sem tirar de BYD; (ii) se demanda estagna, competição pelo share existente se intensifica.

| S9 Status | S11 Competição | Efeito | Risco |
|------------|----------------|--------|-------|
| GREEN | 11 marcas chinesas + 4 ocidentais entrando | BYD mantem 55-65% do EV share; volume total cresce 2-3× | Perda de share ~5-10pp, mas volume BYD cresce 30-50% |
| AMBER | Concorrentesganham tração (Geely 10.6%, GWM 2026) | BYD share cai para 45-55%; pressão de preço | Risco de guerra de preço em entrada de gama |
| RED | Concorrentes capturam share aceleradamente | BYD share <45%; risco de commoditização | Guerra de preço em toda a linha |

**Insight**: em GREEN, BYD pode perder share absoluto (de 70% para 55%) mas seu **volume cresce** porque o bolo cresce 3×. A guerra de preço só se torna destrutiva se S9 RED simultâneo com S11 RED — condição onde todos perdem volume.

**Descrever figura**: `fig-d3-s9-2-market-share-timeline.png`
Linha do tempo de market share EV Brasil 2024-2027, mostrando BYD (linha principal, 60-70% em 2025 caindo para 50-60% em 2027), Geely (subindo de 5% para 12-15%), GWM/MG/Stellantis (participação combinada crescendo de 5% para 15-20%), outros (fragmentados, caindo). Taxa de crescimento do mercado total mostrada como área sombreada no fundo (baseline 40% YoY, slowdown para 25% em 2027).

### 4.3 S9 ↔ S3 (BNDES Move Brasil — Crédito ao Consumidor)

BNDES Move Brasil (R$ 30bi) financia credito ao consumidor para taxistas e motoristas de app comprarem EVs. Este e um **driver de demanda artific al** que nao reflete capacidade de pagamento genuina — e subsídio cruzado via BNDES. O acoplamento S9↔S3 e o mais direto: funding ativo → demanda sobe; funding cortado → demanda cai.

| S3 Status (BNDES) | S9 Impacto | Magnitude |
|--------------------|------------|-----------|
| GREEN (Move Brasil ativo, R$ 30bi disponíveis) | +15-20% volume EV vs baseline | +60-80k unidades/ano |
| AMBER (Move Brasil parcialmente disponível, R$ 15-20bi) | +5-10% volume EV vs baseline | +20-40k unidades/ano |
| RED (Move Brasil suspenso/fundos esgotados) | -10-15% volume EV vs baseline | -40-60k unidades/ano |

**Risco de descontinuidade**: Move Brasil foi suspenso em Nov/2025 (FNDIT) e relançado via Medida Provisória 1.359/2026. Continuidade dependente de (i) gestao governamental pos-eleicao 2026 e (ii) disponibilidade orçamentária. Se Move Brasil for descontinuado, o crescimento YoY de 153% deve moderar para 40-60% (ainda GREEN, mas menos exuberante).

**Cenário-chave**: S9 GREEN + S3 RED simultâneos = "demanda estrutural forte mas funding artificial cortado". BYD ainda vende, mas o mercado cresce 30-40% em vez de 70-80%. Fase 2 (300k) ainda justificada, mas com 6-12 meses de atraso.

---

## §5. Status Thresholds

### 5.1 Definição de Status

| Status | EV_share | Cresc. YoY | Interpretação |
|--------|----------|------------|---------------|
| 🟢 **GREEN** | >10% | >30% | Fase de scaling rapido; demanda supera oferta |
| 🟡 **AMBER** | 5-10% | 10-30% | Adoção media; mercado em transição |
| 🔴 **RED** | <5% | <10% | Demanda estagnada ou em contração |

**Critério de decisão**: GREEN = prosegue plano (capex fase 2 garantido); AMBER = cautela (fase 2 condicional); RED = revisão (roll-back parcial).

### 5.2 Status Atual (Jul/2026)

| Indicador | Valor (Abr-Mai/2026) | Status |
|-----------|---------------------|--------|
| EV market share | **12.8%** | 🟢 GREEN |
| Crescimento YoY | **+153%** | 🟢 GREEN |
| BYD share dentro EV | 60-74% | neutro |

**Status composto: 🟢 GREEN DUPLO** — ambos indicadores no verde com folga. O mercado brasileiro de EV está em trajetória de 13%→18% até Dez/2027. Este e o único vetor inequivocamente positivo do programa BYD Camaçari no horizonte 2026-2027.

---

## §6. Implicações para Decisão

### 6.1 Capex e Capacidade

**S9 GREEN implica**: fase 1 (150k) de Camaçari sera saturada antes de 2027. Fase 2 (300k) deve ser **acelerada**, não condicional. Decisão: antecipar FID da fase 2 para H1/2027 (vs planejamento original H2/2027).

**S9 AMBER implica**: fase 1 suficiente até 2027; fase 2 em standby até visibilidade de demanda >15% sustained. Decisão: capex fase 2 emhold.

**S9 RED implica**: fase 1 em risco de ociosidade; roll-back parcial. Decisão: rever timeline de ramp-up, possivelmente redimensionar para 100k (vs 150k).

### 6.2 Pricing e Defensivo

Com S9 GREEN, a necessidade de discount promocional e reduzida — a demanda supera a oferta. Implicação direta: **catalog defensivo pode ser cortado em 40-60%** versus cenário RED. Saving estimado: R$ 80-135M em 6 meses vs defensivo full.

### 6.3 Roll-back Probability

| Combinação | Prob. Roll-back Parcial | Prob. Roll-back Total |
|------------|------------------------|----------------------|
| S3 RED + S9 GREEN | <5% | <1% |
| S3 RED + S9 AMBER | 20-25% | 5-10% |
| S3 RED + S9 RED | 40-50% | 15-20% |
| S3 GREEN + S9 GREEN | <1% | <1% |

**Conclusão**: S9 GREEN reduz drasticamente a probabilidad de roll-back, mesmo com S3 RED. BYD financia fase 2 com caixa proprio (US$ 30bi+ de caixa global) ou funding alternativo se BNDES estiver indisponível.

---

## §7. Limitações

A modelagem de demanda S9 apresenta três limitações críticas. Primeiro, o mercado EV brasileiro, embora rapido em taxa de adoção, e ainda pequeno em volume absoluto — 400k EVs/ano versus 10M+ na China. Projeções de curva S podem estar superestimadas se a base de 2024-2025 for insuficiente para sustentar momentum. Segundo, a entrada coordenada de 11 marcas chinesas no Brasil em 2026-2027 cria fragmentação de share que o modelo atual não captura em granularidade — a elasticidade cruzada entre marcas chinesas e entre marcas ocidentais tem parâmetros distintos e insufficientemente estimados para o mercado brasileiro. Terceiro, infraestrutura de recarga permanece como gargalo físico invisível: com apenas ~3.000 estações públicas, a adoção além de 18-20% do mercado depende de investimento em infraestrutura que não está-modelado nesta dimensão. Se a curva de infraestrutura não acelerar junto, a demanda efetiva satura em 18-20% independentemente de preço ou funding BNDES — limitando o upside real do mercado.

---

*Arquivo*: `D3-INTERDEPENDENCY-S9-DEMAND.md`
*Versão*: draft v0.6
*Data*: 21/jul/2026
*Proxima revisão*: 21/ago/2026 (recalibrar com dados Fenabrave Jun/2026)
