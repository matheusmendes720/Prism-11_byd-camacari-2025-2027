# D3 — Recalibração S3: Probabilidades re-mapeadas por market share realized

**Documento de recalibração** · Companion de `D3-INTERDEPENDENCY-S3-S4.md` e `D3-OSINT-CHECKPOINT.md` (críticas #2 e #7)
**Data**: 21/jul/2026
**Status**: Working draft — D3 v0.6
**Atualização 21/jul/2026**: crítica #2 e #7 do OSINT checkpoint

---

## 1. Por que esta recalibração

O D3 v0.5 calibrou as probabilidades dos quatro cenários S3 (Expansão / Continuidade / Rollback Parcial / Rollback Total) usando o **ViE (Valor de Importação Econômico) como proxy de funding policy**, sem olhar para **market share realized**. Isso gerou uma distribuição enviesada: o cenário "Rollback Total" recebeu 15% de probabilidade, "Rollback Parcial" 30%, e "Expansão" apenas 15%.

A **OSINT checkpoint (D3-OSINT-CHECKPOINT.md, 21/jul/2026)** revelou que essa calibração está materialmente errada. Crítica #2 documenta que a BYD escalou de **260 unidades em 2022 para 112.915 em 2025**, atingindo **12,8% de market share total em abril/2026** (1º lugar no varejo brasileiro pela primeira vez na história). Crítica #7 confirma que o **mercado EV brasileiro saiu de 6% (2025) para 13,47% (mai/2026), com crescimento YoY de 153%**.

Em outras palavras, o **Cenário Expansão já é o caso base realizado** — não um cenário de 15% de probabilidade. A BYD não está mais em fase de "testar se consegue vender"; ela está em fase de "não consegue produzir o suficiente para atender a demanda". Os cenários Rollback Parcial e Rollback Total, que juntos somavam 45% no D3 v0.5, são **improváveis no horizonte 2025-2027** dado o backlog de demanda e a lista de espera de modelos como Dolphin Mini e Yuan Plus.

Esta recalibração **re-mapeia as probabilidades** com base em market share realized (não ViE proxy), ajusta os thresholds de cada cenário para faixas coerentes com a realidade 2025-2026, e atualiza o action register para refletir a nova distribuição de probabilidade.

---

## 2. Setup: real data 2022-2026

**Premissa**: market share realized é o melhor proxy para "sucesso de mercado" — captura simultaneamente demanda, pricing, distribuição, e resiliência tarifária/regulatória.

**Fontes primárias** (audíveis no OSINT checkpoint §6):
- Vendas mensais: Fenabrave, BYD.com.br, eletric-vehicles.com
- Market share mensal: Fenabrave, ABVE, focus2move, chinaevhome, abramark
- EV market share Brasil: cleantechnica, ANFAVEA, Reuters
- Síntese analítica: D3-OSINT-CHECKPOINT.md §1.5, §2 (crítica #2 e #7)

**Janela de análise**: 2022 (entrada BYD) → mai/2026 (último dado disponível). 2026 é ano incompleto (5 meses); projeção anual usa run-rate de mai/26 + target declarado BYD HQ.

**Premissa de projeção 2026**: 14.911 unidades/mês (run-rate abril) × 12 = ~180k. Target BYD HQ = 250k (otimista). Cenário base = 200k (entre run-rate e target). Esta faixa é o que alimenta a tabela §4.

---

## 3. Market share realized (2022-2026)

| Ano | BYD units (vendas) | Total mercado Brasil | BYD market share | EV market share Brasil | BYD share dentro de EV | Status |
|---|---:|---:|---:|---:|---:|---|
| 2022 | 260 | ~2,1M | **0,01%** | ~0,5% | ~3% | Entrada de mercado |
| 2023 | 18.000 | ~2,3M | **0,8%** | ~1,5% | ~52% | Ramp inicial |
| 2024 | 76.700 | ~2,6M | **2,9%** | ~3,5% | ~84% | Domínio EV |
| 2025 | 112.915 | ~2,8M | **4,0%** | ~6,0% | ~67% | Leader consolidado |
| 2026 (jan-mai) | 57.000+ | — | 8-12% (mensal) | **13,47%** (mai) | **70%+** (Q1) | #1 varejo em abril |
| 2026 (projeção base) | 200.000 | ~3,0M | **6,7%** | **13,5%** | ~50% | Leader absoluto |

**Insights**:
1. **Crescimento 434× em 4 anos** (260 → 112.915). Compound annual growth rate (CAGR) ≈ 360%/ano (geometricamente insustentável, mas retrata a magnitude da ramp).
2. **EV market share Brasil dobrou em 12 meses** (6% → 13,5% entre 2025 e mai/2026).
3. **BYD share dentro de EV**: 52% (2023) → 84% (2024) → 67% (2025, diluição por entrada de Geely/GWM) → 70%+ (Q1 2026).
4. **Cenário Expansão (market share > 12%)**: **JÁ OBSERVADO em abril/2026** (12,8% share total, 70%+ EV share).
5. **Cenário Continuidade (market share 8-12%)**: observado em fev-mar 2026 mensalizado.

![fig 1: BYD Brasil — Vendas & Market Share Realized 2022-2026](figures/fig-d3-recals3-1-market-share-2022-2026.png)

*Figura 1*: dual-axis mostrando BYD units (esquerda, vendas anuais) e market share % (direita, share total Brasil). O salto 2024→2025→2026 evidencia que a dominância de mercado não é projeção: é realização.

---

## 4. Projeção 2026-2027 (base para cenariização)

| Variável | 2025 (realized) | 2026 (projeção base) | 2027 (projeção base) | Fonte |
|---|---:|---:|---:|---|
| BYD units | 112.915 | **200.000** (faixa: 180-250k) | **300.000** (faixa: 250-400k) | Run-rate + target BYD HQ |
| BYD market share | 4,0% | **6,7%** (faixa: 6-8%) | **10%** (faixa: 8-13%) | Denominador ANFAVEA ~3M |
| BYD share dentro de EV | 67% | **50%** (faixa: 45-70%) | **40%** (faixa: 35-55%) | Diluição por Geely/GWM/Leapmotor |
| EV market share Brasil | 6% | **13,5%** | **20%** (faixa: 18-25%) | Crescimento YoY +153% → desaceleração |
| Capacidade Camaçari | 50k (parcial) | 150k (nominal fase 1) | 300k (fase 2 expansão) | Reuters, BYD Baldy |

**Premissas da projeção base**:
- **2026**: run-rate anualizado de 14.911/mês (abr) = 179k. Target BYD HQ 250k é upside (assume que Dolphin Mini + King + Seal preenchem mix). 200k = base.
- **2027**: assume ramp fase 2 (300k capacidade) + nacionalização 70% + tarifa 35% estabilizada. Geely/GWM captam ~20% do crescimento EV; BYD mantém liderança mas com share dentro de EV caindo para ~40%.
- **Stress downside 2027**: se nacionalização atrasar e/ou tarifa 35% for estendida para SKD, capacidade efetiva pode ficar em 200k, e market share pode estagnar em 6-7%. Esse é o "RB Parcial re-emergente" que monitoramos em Q3-Q4 2026.

---

## 5. Recálculo de probabilidades S3

A tabela abaixo mostra a transição do **D3 v0.5 (calibrado em ViE proxy)** para **D3 v0.6 (calibrado em market share realized)**. Onde a v0.5 tratava ViE como variável primária, a v0.6 trata market share realized como primária e ViE como secundária (proxy de funding/capacidade).

### 5.1 Tabela de probabilidades recalibradas

| Cenário S3 | Faixa ViE (proxy funding) | Faixa market share (primário) | D3 v0.5 (ViE proxy) | **D3 v0.6 (market share realized)** | Δ | Justificativa |
|---|---|---|---:|---:|---:|---|
| **S3 Expansão** | ViE = 20-25% | share > 10% | 15% | **70-80%** (mid: 75%) | **+60pp** | **JÁ OBSERVADO** em abr/2026 (12,8% share) e Q1 2026 (70%+ EV). Domínio de mercado é o caso base, não um cenário. |
| **S3 Continuidade** | ViE = 15-20% | share 8-10% | 40% | **15-20%** (mid: 17%) | **−23pp** | Observado fev-mar 2026 mensalizado. Ainda é provável, mas já foi o caso base e foi superado. |
| **S3 RB Parcial** | ViE = 10-15% | share 5-8% | 30% | **5-10%** (mid: 7%) | **−23pp** | Improvável no horizonte 2025-2027. Re-emergiria apenas se (a) tarifa 35% travar SKD, (b) Geely/GWM capturarem > 30% do EV, (c) produção Camaçari atrasar 12+ meses. |
| **S3 RB Total** | ViE < 10% | share < 5% | 15% | **1-3%** (mid: 1%) | **−14pp** | Altamente improvável. BYD tem backlog, lista de espera, e dominance de rede de concessionárias. RB Total só por choque extremo (sancao, recall massivo, escândalo ESG paralisa produção). |
| **TOTAL** | — | — | 100% | **100%** | — | — |

### 5.2 Por que essa inversão?

A v0.5 cometeu **erro de calibração estrutural**: usou ViE (proxy de funding/capacidade) como se fosse a variável que determina market share. Mas **market share é primariamente função de demanda e pricing**, não de funding. A BYD conseguiu:

1. **Demanda explosiva** (mercado EV crescendo 153% YoY, críticas #7) — não capturado em v0.5.
2. **Pricing competitivo** (Dolphin Mini a R$ 75k, abaixo de vários ICEs equivalentes) — não modelado em v0.5.
3. **Rede de concessionárias** (120+ pontos em 2026, vs < 30 em 2024) — dimensão ignorada.
4. **Mix de produto** (Dolphin Mini, King, Seal, Yuan Plus, Dolphin Plus) cobrindo R$ 75k-300k — variabilidade de mix não capturada.

A v0.5 acertou que **ViE alto (20-25%) correlaciona com cenário positivo**, mas errou a **magnitude da probabilidade condicional**. Em vez de P(Expansão | ViE=25%) ≈ 15%, o realized mostra que P(Expansão | share>10%) ≈ 75%+.

### 5.3 Stress test de cada cenário

| Cenário | Trigger conditions (v0.6) | Prob. condicional | Ação default |
|---|---|---:|---|
| **Expansão (75%)** | share>10% ∧ ranking top-3 ∧ backlog>30k | 0.70-0.80 | Expandir produção Camaçari fase 2 (300k); advocacy agressivo para tarifa例外; defender market share via pricing power |
| **Continuidade (17%)** | share 8-10% ∧ ranking top-5 ∧ backlog<30k | 0.15-0.20 | Manter fase 1; targeted defensivo em Tier 2; monitorar Geely/GWM |
| **RB Parcial (7%)** | share 5-8% ∧ ranking 5-10 ∧ tarifa 35% SKD | 0.05-0.10 | Defensivo Tier 2/3; renegociar tarifa; acelerar nacionalização 70% |
| **RB Total (1%)** | share<5% ∧ ranking>10 ∧ escândalo ESG paralisa | 0.01-0.03 | Halt expansion; advocacia para desbloqueio ESG; pivot para PHEV/híbrido |

---

## 6. Sensitivity: 3 cenários alternativos

Para capturar a incerteza sobre a magnitude da recalibração, definimos 3 cenários alternativos:

| Cenário alternativo | Expansão | Continuidade | RB Parcial | RB Total | Premissa subjacente |
|---|---:|---:|---:|---:|---|
| **Otimista** (upside) | **85%** | 10% | 4% | 1% | BYD atinge 300k+ em 2027, Geely/GWM ficam em 15% share combinado, mercado EV cresce 30% YoY em 2026-27 |
| **BASE (recomendado)** | **75%** | 17% | 7% | 1% | BYD 200-250k em 2026, 300k em 2027, mercado EV desacelera para 50% YoY, Geely/GWM captam 25% |
| **Pessimista** (downside) | **50%** | 30% | 17% | 3% | BYD 150-180k em 2026 (atraso Camaçari fase 1), tarifa 35% comprimindo margem, Geely/GWM captam 35% em 2027 |

**Leitura**:
- Mesmo no cenário **pessimista**, Expansão ainda é o mais provável (50%). Continuidade tem peso material (30%), mas Expansão domina.
- O **range 50-85% para Expansão** é o que alimenta a análise de stress no NPV layer. O caso base 75% é o ponto de partida; upside e downside geram bandas de confiança.
- **RB Total continua < 5% em todos os cenários alternativos** — confirma que o "tail risk" é improvável dado o market share realized.

![fig 2: S3 — Probabilidades D3 v0.5 vs v0.6](figures/fig-d3-recals3-2-probability-comparison.png)

*Figura 2*: comparação direta das probabilidades S3 entre D3 v0.5 (ViE proxy) e D3 v0.6 (market share realized). Expansão salta de 15% para 75%; RB Parcial+Total colapsa de 45% para 8%. Inversão completa da distribuição.

---

## 7. Implicações: re-priorizar action register

A inversão das probabilidades tem **cascata em 5 ações** do action register do D3 v0.5:

### 7.1 Ações a serem **reforçadas** (Cenário Expansão dominante)

| Action # | Descrição | OLD budget | NEW budget | Justificativa |
|---|---|---:|---:|---|
| **#4** | Expandir fase 2 Camaçari (300k) | conditional | **R$ 2,5bi prioritário** | Expansão 75% = caso base, fase 2 deve ser accelerated não conditional |
| **#7** | Defensivo Tier 2/3 (Targeted) | R$ 15-22M | R$ 15-22M (mantido) | ROI +500% mantido; v0.5 já acertou aqui |
| **#12** | Advocacia para tarifa例外 SKD | R$ 5M | **R$ 15M** | Com 250k target 2026, bloqueio tarifário = R$ 500M+/ano de margem. Advocacia vira prioridade alta. |
| **#19** | Acelerar nacionalização 70% até Q4 2026 | R$ 200M | **R$ 400M** | Nacionalização rápida = hedge contra tarifa 35% Jan/2027. Probabilidade de "Expansão sem nacionalização" é < 10%. |

### 7.2 Ações a serem **re-desenhadas** (Cenário Continuidade relevante)

| Action # | OLD description | NEW description |
|---|---|---|
| **#8** | Defensivo catalog-wide | **REMOVIDO** (já estava em D3-RECALIBRATION-S3-S4.md como "NÃO IMPLEMENTAR"; v0.6 confirma) |
| **#15** | Geely/GWM early warning | **AMPLIADO** para "monitoramento competitivo mensal" (Geely surging, GWM lançando 2026) |
| **#17** | Dual-sourcing lítio (Chile + Austrália) | **MANTIDO** com urgency tier alta (lítio rebound 2026, crítico #8) |

### 7.3 Ações a serem **despriorizadas** (RB Total improvável)

| Action # | Descrição | Status v0.6 |
|---|---|---|
| **#22** | Plano de contingência para recall massivo | **MANTER** (custo baixo, valor de opção alto) |
| **#25** | Pivot para PHEV/híbrido se RB Total | **MANTER como tail-risk plan** (probabilidade 1%, mas se acontecer impacto é -R$ 5bi) |

### 7.4 Novas ações recomendadas para v0.6

| Action # | Descrição | Budget | Trigger |
|---|---|---:|---|
| **#28** | **Programa de aceleração fase 2 (300k → 600k full)** | R$ 3bi (capex) | Share > 10% por 2 trimestres consecutivos |
| **#29** | **Hub de exportação LatAm via Camaçari** (Argentina, Chile, Colômbia) | R$ 200M | Share Brasil > 15% ∧ mercado externo endereçável > 500k |
| **#30** | **Defensive moat contra Geely** (lock-in fornecedores, exclusive dealer agreements) | R$ 80M | Geely share > 15% no Brasil |

---

## 8. Limitações

1. **2026 incompleto**: usamos 5 meses de dados (jan-mai 2026) para projetar o ano inteiro. Run-rate anualizado pode superestimar se houver sazonalidade (1º semestre tipicamente mais forte que 2º em carros).
2. **Target 250k não confirmado**: o número é declaração da BYD HQ, não entrega contracted. Se a fase 1 da Camaçari atrasar, target cai.
3. **Market share total inclui ICE**: comparamos share total Brasil (12,8% abr/2026) que é o sinal mais amplo. Se usarmos share **dentro de EV**, o número é 70%+ (mais极端, mas menos comparável historicamente).
4. **Geely/GWM podem acelerar**: o upside deles não está totalmente capturado. Se capturarem 25% do crescimento EV em 2027, share BYD pode estagnar em 6-7% mesmo com produção OK — isso é o "RB Parcial re-emergente" que monitoramos.
5. **Tarifa 35% Jan/2027 SKD/CKD** pode forçar reestruturação de supply chain que não capturamos: se nacionalização atrasar, ViE pode cair para 15% e mercado responder com alta de preços, comprimindo volume.
6. **Lista suja ESG (crítica #1)**: BYD na lista suja desde abr/2026 pode bloquear financiamento BNDES/Banco do Brasil. Não capturamos como probabilidade condicional de "Funding trava → produção trava". Próxima iteração do D3 deve cruzar S3 com S7 (ESG) explicitamente.
7. **Cenário competitivo (S11)**: este doc recalibra S3 isoladamente. Quando S11 (Competitive Intensity) for construído (Agent-B5), devemos re-rodar com coupling S3↔S11.

---

## 9. Fontes

### 9.1 Vendas BYD Brasil (mensal e anual)
- BYD.com.br (corporate announcements, 2022-2026)
- eletric-vehicles.com (tracker mensal, 2023-2026)
- Fenabrave (Federação Nacional da Distribuição de Veículos Automotores)
- ABVE (Associação Brasileira do Veículo Elétrico)
- focus2move (Brasil auto market 2022-2026)
- chinaevhome (China EV global tracker)
- abramark (Brasil automotive monthly)

### 9.2 EV market share Brasil
- cleantechnica (Brasil EV market 2024-2026)
- ANFAVEA (Associação Nacional dos Fabricantes de Veículos Automotores)
- Reuters (Brasil EV market 2026)
- Eletric-vehicles.com (monthly tracker)

### 9.3 Síntese analítica
- D3-OSINT-CHECKPOINT.md (próprio framework, 21/jul/2026), §1.5 (premissas confirmadas) e §2 (críticas #2 e #7)
- D3-INTERDEPENDENCY-S3-S4.md (template de recalibração)
- D3-RECALIBRATION-S3-S4.md (recalibração anterior, defensivo break-even)

### 9.4 Documentos relacionados (D3 v0.6)
- D3-INTERDEPENDENCY-S7-ESG.md (em construção, Agent-B1)
- D3-INTERDEPENDENCY-S8-RAMP.md (em construção, Agent-B2)
- D3-INTERDEPENDENCY-S9-DEMAND.md (em construção, Agent-B3) — base para §4 deste doc
- D3-INTERDEPENDENCY-S10-TARIFF.md (em construção, Agent-B4)
- D3-INTERDEPENDENCY-S11-COMPETITION.md (em construção, Agent-B5) — coupling futuro com S3

---

## 10. Resumo executivo em 1 parágrafo

D3 v0.5 atribuiu 15% ao cenário S3 Expansão (ViE=25%) e 45% combinado aos cenários Rollback Parcial + Total, calibrando em ViE proxy. A OSINT checkpoint revelou que essa calibração está invertida: **BYD já atingiu 12,8% market share total em abril/2026 (1º lugar no varejo)** e **70%+ share dentro de EV no Q1 2026**, com mercado EV brasileiro crescendo de 6% (2025) para 13,47% (mai/2026, +153% YoY). Recalibração v0.6 re-mapeia as probabilidades para **Expansão 70-80%** (mid 75%), **Continuidade 15-20%** (mid 17%), **RB Parcial 5-10%** (mid 7%), **RB Total 1-3%** (mid 1%) — uma inversão completa. Cascata no action register: reforçar ações de expansão (fase 2, advocacia tarifária, nacionalização); re-desenhar ações de Continuidade (monitoramento competitivo Geely/GWM); manter tail-risk plans de RB Total. **Recomendação**: atualizar D3-MAIN.html §6 (S3 cenários) com essas probabilidades, republicar como D3 v0.6, e cruzar com S7 (ESG) e S11 (Competição) na próxima iteração.
