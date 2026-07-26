# D3 — OSINT Checkpoint: Crítica Construtiva do Framework

**Documento de checkpoint baseado em OSINT** · Validar (ou invalidar) premissas do D3 com dados públicos da web
**Data**: 21/jul/2026
**Status**: Checkpoint pré-Phase 2 · para revisão antes de scale-up
**Fontes**: Reuters, BBC, Folha, ANFAVEA, Fenabrave, BNDES, USGS, IMARC, Mining Weekly, Automotives World, CleanTechnica, AP News, Mobility Portal, entre outros

---

## 0. Propósito deste checkpoint

Antes de seguir para Phase 2 (implementar T2.1 auto-trigger, T2.2 NPV live, T2.4 piloto), faço uma <strong>auditoria independente</strong> do framework D3 com dados públicos. Este documento lista:

- <strong>10 críticas construtivas</strong> com referência à fonte
- <strong>Premissas confirmadas</strong> pela OSINT
- <strong>Premissas refutadas ou materialmente subestimadas</strong>
- <strong>Premissas ausentes</strong> (o D3 ignorou)
- <strong>Recomendações de ajuste</strong> antes de scale-up

**Contexto**: o usuário pediu crítica construtiva antes de prosseguir. Vai usar o D3 como anexo de aplicação para vaga — então a integridade técnica do framework importa. Erros factuais ou premissas erradas seriam penalizados em revisão técnica.

---

## 1. Premissas confirmadas ✅ (a OSINT validou)

### 1.1 BYD Camaçari é o maior projeto industrial da BYD fora da China
- <strong>Fonte</strong>: Reuters (2025-05-12), China Daily (2025-10-13), BYD.com (2025-07-01), AP News
- <strong>Realidade</strong>: investimento R$ 5,5bi confirmado; capacidade fase 1 = 150k veículos/ano, fase 2 = 300k, full = 600k
- <strong>D3 status</strong>: alinhado (não modelou capacidade explicitamente, mas usou VGV R$ 30bi coerente com 150k unidades × R$ 200k ASP)

### 1.2 BNDES Mover existe e é pilar da política EV brasileira
- <strong>Fonte</strong>: BNDES.gov.br, gov.br (Medida Provisória 1.359/2026)
- <strong>Realidade</strong>: Move Brasil Táxi/Aplicativos = R$ 30bi em crédito para taxistas/motoristas de app comprarem EVs até R$ 150k
- <strong>D3 status</strong>: alinhado em princípio, mas a OSINT revelou que o <strong>BNDES Mover não financia capex de planta da BYD diretamente</strong> — ver crítica #4 abaixo

### 1.3 Lithium carbonate é commodity volátil (σ 80%+)
- <strong>Fonte</strong>: USGS Mineral Commodity Summaries 2026, IMARC, S&P Global, BMI
- <strong>Realidade</strong>: σ 80-83% está correto. Pico 2022 = US$ 80k/t; vale 2025 = US$ 9k/t; rebound 2026 = US$ 22-25k/t
- <strong>D3 status</strong>: alinhado (σ 82.9% annual é fiel à história 2015-2025)

### 1.4 BRL/USD é volátil (σ 14-16%)
- <strong>Fonte</strong>: BCB SGS série 10813 (já validado em D3-RECALIBRATION-S1-S3-REAL-BCB.md)
- <strong>Realidade</strong>: σ 14.86% annual (10 anos, 2015-2025)
- <strong>D3 status</strong>: alinhado

### 1.5 BYD lidera mercado EV brasileiro (>70% share)
- <strong>Fonte</strong>: BYD.com.br, Fenabrave, ABVE, CleanTechnica
- <strong>Realidade</strong>: 73.62% BEV market share (2025); 60-74% durante 2025-2026; #1 em vendas varejo Abril 2026 (14.911 unidades, 12.8% market share — primeira vez que marca de EV lidera no Brasil)
- <strong>D3 status</strong>: alinhado, mas a magnitude excede cenários do D3 — ver crítica #8

---

## 2. 10 críticas construtivas (achados OSINT)

### 🔴 CRÍTICA #1: D3 ignorou completamente o escândalo de trabalho escravo (ESG/Reputação)

**Achado OSINT**: 
- <strong>23/dez/2024</strong>: MPT-BA resgata 163 trabalhadores chineses em condições análogas à escravidão na obra da BYD em Camaçari. Passaportes retidos, 60% dos salários confiscados, pagamento em moeda chinesa, camas sem colchão, 1 banheiro para 31 pessoas.
- <strong>27/mai/2025</strong>: MPT processa BYD por tráfico internacional de pessoas + trabalho escravo. Pede R$ 257M em danos morais coletivos.
- <strong>26/dez/2025</strong>: acordo fechado em R$ 40M (R$ 20M dano individual + R$ 20M dano coletivo).
- <strong>07/abr/2026</strong>: MTE inclui BYD na <strong>"lista suja"</strong> do trabalho escravo. BYD fica impedida de obter certos tipos de empréstimos bancários.
- <strong>14/mar/2026</strong>: Washington Post publica reportagem detalhada sobre "fraude consciente e sistêmica", repercussão internacional.
- <strong>Fontes</strong>: BBC, Reuters, Poder360, Heise, Wikipedia (BYD Brazil working conditions controversy), AP News, G1

**Impacto no D3**:
- <strong>Risco ESG/reputacional</strong>: BYD na lista suja = restrição de crédito bancário no Brasil. <strong>O D3 framework tratou BNDES como S3 (regulatory/ViE) e ignorou que BNDES/banco privado pode NEGAR funding para empresa na lista suja.</strong>
- <strong>Risco operacional</strong>: autorização de visto de trabalho chinês SUSPENSA pelo Ministério da Justiça. Implicação: BYD precisa trazer trabalhadores brasileiros ou de outros países. Custo de mão de obra pode subir.
- <strong>Risco de execução</strong>: caso fosse renovado (não pode, MPT vigia), paralisia total da construção por meses.
- <strong>Impacto no S3 (BNDES)</strong>: <strong>VIÉS MATERIAL</strong>. D3 estimou cenários S3 (Expansão/Continuidade/RB Parcial/RB Total) baseados em funding policy. Mas existe um vetor de risco novo: "BYD ethics/ESG status" pode trancar capex independentemente do funding policy.

**Recomendação**: 
- Adicionar <strong>S7 = ESG/Reputação</strong> no framework. Status GREEN/AMBER/RED baseado em: lista suja (status atual = RED), score MSCI/Sustainalytics, controversies count, news sentiment.
- S7 RED com lista suja ativa = trigger para <strong>block total de capex</strong> novo. Provavelmente BYD já está nesse estado.
- Re-rodar composite score com peso para S7 (ex: 5-10% do total).

**Severidade**: 🔴 ALTA. Mudança material no framework.

---

### 🔴 CRÍTICA #2: D3 subestimou dramaticamente o ritmo de ramp-up da BYD

**Achado OSINT**:
- <strong>Vendas BYD Brasil 2022</strong>: 260 unidades
- <strong>Vendas BYD Brasil 2023</strong>: ~18.000 unidades (+68×)
- <strong>Vendas BYD Brasil 2024</strong>: 76.700 unidades (+4×)
- <strong>Vendas BYD Brasil 2025</strong>: 112.915 unidades (+47%)
- <strong>Target BYD 2026</strong>: 250.000 unidades (+121% vs 2025)
- <strong>Jan 2026</strong>: 9.755 unidades (5º lugar, 7.8% share total)
- <strong>Fev 2026</strong>: 11.379 unidades
- <strong>Mar 2026</strong>: 21.768 EVs (Q1 total, 70%+ share EV)
- <strong>Abr 2026</strong>: 14.911 unidades (1º lugar varejo, 12.8% share)
- <strong>Mai 2026</strong>: Brazil EV market 13.47% share (7.7% BEV), 153% YoY growth
- <strong>Fontes</strong>: BYD.com.br, eletric-vehicles.com, Fenabrave, ABVE, focus2move, chinaevhome, abramark

**Impacto no D3**:
- <strong>D3 framework não modelou sales ramp</strong>. Tratou ViE (Valor de Importação Econômico) como proxy para BNDES funding only. <strong>Não capturou que BYD já está dominando o mercado mais rápido que o esperado</strong>.
- <strong>Cenário S3 RB Parcial (ViE=10%)</strong> do D3 assume cenário "pessimista" onde BYD vende pouco. Mas a realidade: <strong>BYD vende 12.8% do varejo total do Brasil em Abril 2026</strong> e 70%+ dos EVs. <strong>RB Parcial nunca aconteceu</strong>.
- <strong>Cenário S3 RB Total (ViE=0%)</strong>: também improvável no horizonte 2025-2027. BYD tem mais demanda que oferta (lista de espera para alguns modelos).

**Recomendação**:
- Re-mapear cenários S3 baseados em <strong>market share realized</strong> (não ViE proxy):
  - Cenário A (Expansão): market share > 12% — JÁ ACONTECEU
  - Cenário B (Continuidade): market share 8-12% — JÁ ACONTECEU em 2024
  - Cenário C (Rollback Parcial): market share 5-8% — improvável
  - Cenário D (Rollback Total): market share < 5% — improvável
- Provavelmente <strong>o framework deveria ser concentrado em Cenários A e B (95%+ de probabilidade), com C e D como "tail risks"</strong>.

**Severidade**: 🟡 MÉDIA-ALTA. Probabilidades dos cenários do D3 estão erradas. Mas se o usuário está fazendo o D3 como exercício de framework, isso é falha técnica, não conceitual.

---

### 🔴 CRÍTICA #3: D3 não modelou o cronograma de ramp-up da planta (delay material)

**Achado OSINT**:
- <strong>Cronograma original</strong>: início de produção março 2025
- <strong>Realidade</strong>: 
  - Dez 2024: trabalho escravo paralisa parte da obra
  - Jan 2025: 163 trabalhadores repatriados para China
  - Fev-Mar 2025: obras parcialmente suspensas
  - 01/jul/2025: primeiro carro (Dolphin Mini) sai da linha — 4 meses atrasado
  - Mai 2025: secretário da Bahia declara "fully operational only by end of 2026"
  - Jul 2025: Baldy (SVP BYD Brasil) confirma produção SKD/CKD 2025-2026, full em 2026
  - 09/out/2025: inauguração oficial (apesar de produção já em curso)
  - Dez 2025: 1.000 funcionários (vs 10.000 prometidos)
- <strong>Cronograma futuro declarado</strong>: "fully operational by Dec 2026" (capacidade 150k nominal)
- <strong>Target de nacionalização</strong>: 50% até jan/2027; 70% até fim de 2026
- <strong>Fontes</strong>: Reuters, CNN Brasil, China Daily, just-auto, BYD.com, AutoEsporte

**Impacto no D3**:
- <strong>D3 usou "2025-2027 program"</strong> como horizonte, mas a planta está em ramp-up em 2025 e só full operational em 2026. <strong>O programa 2025 tem produção muito menor do que o D3 assumiu</strong>.
- <strong>D3 não tem dimensão "production ramp curve"</strong>. Trata como se 2025 = full scale, 2026 = full scale, 2027 = full scale.
- <strong>Implicação para S2 supply</strong>: em 2025, BYD está montando SKD/CKD (kits da China) → exposição FX ainda altíssima; em 2026, nacionalização 50-70% → exposição FX cai. <strong>O D3 trata exposição FX constante</strong>.

**Recomendação**:
- Adicionar <strong>S8 = Production Ramp</strong>: GREEN (>80% capacidade nominal), AMBER (50-80%), RED (<50%)
- Atualmente (jul/2026): provavelmente AMBER (50-80%, 50k produzidos vs 150k capacidade)
- Recalibrar S1 (FX exposure) baseado em % SKD/CKD vs CKD local

**Severidade**: 🟡 MÉDIA. Não-invalida o framework, mas adiciona dimensão faltante.

---

### 🟡 CRÍTICA #4: D3 confundiu "BNDES funding" com capex direto — é mais complexo

**Achado OSINT**:
- <strong>BNDES Mover (programa prioritário)</strong>: foca em <strong>P&D não-reembolsável</strong> para descarbonização (baterias, powertrain híbrido, biocombustíveis, aço verde). Mínimo R$ 10M por projeto. Até 80% do valor financiável (90% se Nordeste). <strong>Submissões suspensas desde 21/11/2025</strong> aguardando FNDIT.
- <strong>Move Brasil Táxi/Aplicativos</strong>: <strong>crédito ao consumidor final</strong> (taxistas/motoristas de app), não à montadora. R$ 30bi de crédito, juro 12.6% a.a. (homens) / 11.5% (mulheres), até 72 meses, carência 6 meses. Limite R$ 150k/veículo.
- <strong>BYD está habilitada no Move Brasil</strong>: GWM, VW, Fiat, Renault, GM, Honda, Hyundai, Nissan, Peugeot, Toyota, BMW também.
- <strong>Fontes</strong>: BNDES.gov.br (programa Mover + Move Motoristas), gov.br, byd.com.br, g1.globo, canalve

**Impacto no D3**:
- <strong>D3 framework tratou "BNDES funding" como financiamento direto de capex da planta</strong>. O Move Motoristas é <strong>crédito ao consumidor</strong>, não à BYD. A BYD vende mais carros se o programa é generoso (proxy: mais demanda agregada), mas não recebe funding direto.
- <strong>ViE (Valor de Importação Econômico)</strong> é um critério de <strong>conteúdo local</strong> usado pelo MDIC para reduzir IPI. Não é "BNDES funding" per se. O D3 usou ViE como proxy de BNDES, o que é razoável mas não rigoroso.
- <strong>FNDIT (Fundo Nacional de Desenvolvimento Industrial e Tecnológico)</strong>: o dinheiro real do BNDES Mover virá do FNDIT. Submissões suspensas = <strong>atraso material</strong> no programa. Risco para o framework D3.

**Recomendação**:
- Separar S3 (regulatory/conteúdo local / IPI) de S8 (BNDES funding direto) de S9 (demanda agregada via Move Motoristas).
- Modelar demanda como S9, não como efeito de S3.
- Adicionar <strong>FNDIT status</strong> como signal dentro de S3: GREEN se FNDIT ativo, RED se FNDIT suspenso (atualmente RED).

**Severidade**: 🟡 MÉDIA. Framework funciona, mas a modelagem econômica pode estar errada. Se o usuário está vendendo o framework, o rigor importa.

---

### 🟡 CRÍTICA #5: D3 ignorou o impacto do aumento de tarifa de importação (35% em 2027)

**Achado OSINT**:
- <strong>Cronograma de tarifas</strong>:
  - Jan/2024: BEV 10%, PHEV 12%, HEV 12%
  - Jul/2024: BEV 18%, PHEV 20%, HEV 25%
  - Jul/2025: BEV 25%, PHEV 28%, HEV 30%
  - Jul/2026 (planned): <strong>todos 35%</strong>
  - Jan/2027: SKD/CKD <strong>também 35%</strong> (antecipado em 18 meses, era 2028)
- <strong>BYD havia pedido redução de tarifa para SKD/CKD</strong>: <strong>REJEITADO</strong> por Camex em jul/2025.
- <strong>BYD conseguiu exceção</strong>: quota tariff-free de US$ 463M por 6 meses (1º semestre 2026).
- <strong>Fontes</strong>: Reuters, electrive.com, g1.globo, quatrorodas.abril.com.br, scmp.com

**Impacto no D3**:
- <strong>D3 não modelou o impacto de tarifas no S1 (FX) e S2 (supply)</strong>. O framework trata exposição FX como função do câmbio, mas o componente tarifário é separado.
- <strong>Impacto material</strong>: tarifa de 14% → 35% em SKD/CKD = +21pp de custo. Para BYD, isso afeta o ASP (preço de venda) e a margem. Se BYD absorver, margem cai; se passar para consumidor, demanda cai.
- <strong>Cenário S3 RB Total</strong> do D3 assume "BYD vende pouco por causa de tarifa/regulatory". Mas a realidade mostra que a <strong>tarifa subiu E vendas subiram</strong> (250k target 2026 vs 113k 2025). <strong>D3 subestimou a resiliência da demanda</strong>.

**Recomendação**:
- Adicionar <strong>componente tarifário</strong> ao S1 (FX/tarifas) ou criar S10 (Tarifa Policy).
- Recalibrar sensibilidade: tarifa 35% + BRL 5.5 = cenário de stress real (não apenas FX).
- Provavelmente <strong>o D3 está otimista demais sobre margem em stress</strong> — faltou modelar o duplo choque (FX + tarifa).

**Severidade**: 🟡 MÉDIA-ALTA. Mudança material no VaR FX realized e no modelo S1↔S4.

---

### 🔴 CRÍTICA #6: D3 ignorou o cenário competitivo (Stellantis, GM, VW, Geely, GWM)

**Achado OSINT**:
- <strong>Stellantis</strong>: R$ 30bi investidos 2025-2030 (largest ever na história do setor brasileiro). Bio-Hybrid (etanol + elétrico). Goiana (PE) foco em eletrificação.
- <strong>GM</strong>: R$ 7bi investidos. Lançou Spark EUV em Ceará (Dez 2025). Captiva EV em 2026. Parceria com Comexport/PACE.
- <strong>VW</strong>: R$ 16bi (R$ 9bi + R$ 7bi anteriores). Plataforma flex-ethanol. Lançará 27 modelos na década.
- <strong>Toyota</strong>: US$ 2.2bi. Híbrido + SUV no Brasil.
- <strong>Geely</strong>: surging 2026 (segunda colocada no EV, 10.6% share)
- <strong>GWM</strong>: lançando 2026 (silver medal em alguns meses)
- <strong>Leapmotor</strong>: parceira da Stellantis, entrando 2026
- <strong>Fontes</strong>: Reuters, electrive.com, WardsAuto, automotive-technology, Bloomberglinea, clubalfa, valorinternacional

**Impacto no D3**:
- <strong>D3 framework trata S4 (Pricing) como se BYD fosse monopolista ou única EV no Brasil</strong>. <strong>Não há menção a Stellantis, GM, VW, Geely, GWM.</strong>
- <strong>Realidade</strong>: 11 marcas chinesas (BYD, Geely, GWM, Leapmotor, etc.) + 4 ocidentais (Stellantis/Fiat, GM, VW, Toyota) competindo. <strong>Defensivo pricing não é BYD-only — é setorial</strong>.
- <strong>Cenário S4 defensivo</strong>: D3 modela "tier 0-3" baseado em S3 status alone. Mas a <strong>competitividade</strong> (preço médio do mercado, market share realized, ações dos concorrentes) deveria ser variável independente.

**Recomendação**:
- Adicionar <strong>S11 = Competitive intensity</strong>: GREEN (BYD > 60% EV share), AMBER (40-60%), RED (<40% ou guerra de preços).
- S4 defensivo deveria ser função de S3 + S11 (não só S3).
- Modelar <strong>preço médio do mercado</strong> como variável (BYD vs Stellantis vs GM).

**Severidade**: 🔴 ALTA. O framework é específico demais para BYD; ignora dinâmica competitiva.

---

### 🟡 CRÍTICA #7: D3 subestimou a taxa de adoção de EV no Brasil (13.5% em maio 2026)

**Achado OSINT**:
- <strong>EV market share Brasil 2025</strong>: ~6% (BEV 4.4%, PHEV 5.6%)
- <strong>EV market share Brasil Mai/2026</strong>: 13.47% (BEV 7.7%, PHEV 5.7%)
- <strong>Crescimento YoY 2026</strong>: +153% (vs +77% Dez/2024)
- <strong>EV market global 2026</strong>: Brasil é 6º-7º maior mercado EV do mundo (atrás de China, US, Alemanha, França, UK, talvez Coreia do Sul)
- <strong>Fontes</strong>: cleantechnica, focus2move, ANFAVEA, Reuters

**Impacto no D3**:
- <strong>D3 usou "R$ 30bi VGV"</strong> como referência, mas isso assume market share modesto. A realidade 2026 mostra Brasil crescendo 153% YoY.
- <strong>Stress scenarios</strong>: D3 modelou "low demand" como RB Total. Mas a realidade mostra demanda crescendo. <strong>Stress é upside, não downside de demanda</strong> (não conseguir produzir o suficiente para atender).
- <strong>Implicação para S4 (defensivo)</strong>: se o mercado está crescendo, a necessidade de defensivo pricing é MENOR (preço vende sozinho). Mas D3 assume que mais S3 RED = mais defensivo. <strong>Pode estar errado na direção</strong>.

**Recomendação**:
- Re-rodar sensitivity com market share realized 12-14% (vs D2 baseline implícito ~5-8%).
- Adicionar <strong>S9 = Demand Growth</strong>: GREEN (>15% YoY), AMBER (5-15%), RED (<5%).
- Defensivo deveria ser função de S3 + S9 (não S3 alone).

**Severidade**: 🟡 MÉDIA. Probabilidades dos cenários S4 do D3 estão enviesadas.

---

### 🟡 CRÍTICA #8: D3 superestimou o downside de lítio (rebound material em 2025-2026)

**Achado OSINT**:
- <strong>Lítio 2022</strong>: US$ 80k/t (peak)
- <strong>Lítio Aug/2025</strong>: US$ 9k/t (vale, 4-year low)
- <strong>Lítio Jan/2026</strong>: US$ 26k/t (+95% em 1 mês, +189% em 5 meses)
- <strong>Lítio Feb/2026</strong>: US$ 17k/t (Northeast Asia spot)
- <strong>Lítio Mar/2026</strong>: US$ 18k/t
- <strong>Lítio Jun/2026</strong>: US$ 21.4/kg = US$ 21.4k/t
- <strong>Forecast 2026</strong>: deficit 1.5kt (Fastmarkets) a 80kt LCE (Morgan Stanley). Preço médio 2026 esperado: US$ 17-25k/t (Bernstein US$ 17k, BMI US$ 17k, mais alto que 2025 US$ 10k).
- <strong>CATL Jianxiawo mine</strong>: suspensa desde late 2024, contribuindo para tightness.
- <strong>Fontes</strong>: USGS, IMARC, S&P Global, BMI/Fitch, Mining Weekly, ChemAnalyst, INN, Carbon Credits, Gasgoo, Investing.com

**Impacto no D3**:
- <strong>D3 usou σ 82.9% lítio annual</strong>: correto em magnitude, mas o cenário "lítio normalize 2024-25" do script sintético estava <strong>ERRADO</strong>. Lítio <strong>NÃO normalizou</strong> — houve rebound massivo em 2025-2026.
- <strong>VaR supply 6m P95 = R$ 2.268M (real lítio)</strong>: é uma média. Em stress real (lítio > US$50k), o VaR realized em 2026 seria <strong>muito maior</strong> (~R$ 3.5-4.0bi) do que o baseline histórico 2015-2025.
- <strong>Implicação para S2</strong>: o framework S1↔S2 do D3 está calibrado para um lítio que normaliza. Mas a realidade é que 2026 vai ser <strong>tight supply / deficit</strong>. Modelo deveria ser re-ponderado.

**Recomendação**:
- Recalibrar S2 com projeção 2026 (lítio ~US$ 20-25k, deficit esperado) como <strong>novo baseline</strong>, não cenário.
- Stress-conditional VaR deveria incluir cenário "Lítio spike 2026" (já acontecendo): VaR 6m P95 sobe para ~R$ 3.5-4.5bi (não R$ 2.27bi).
- Atualizar <strong>D3-RECALIBRATION-S1-S2-REAL.md</strong> com Q2-Q3 2026 data.

**Severidade**: 🟡 MÉDIA. Framework ainda funciona, mas está calibrado em "lítio normaliza" e a realidade é "lítio aperta".

---

### 🟢 CRÍTICA #9: D3 acertou em cheio o VaR FX (σ 14.86% real BCB)

**Achado OSINT**: BCB SGS série 10813 (PTAX venda, 2015-2025) — validado em D3-RECALIBRATION-S1-S3-REAL-BCB.md.
- σ annual = 14.86% (real)
- Max drawdown = -27.27%
- Vol 30d realized: GREEN 66.2% / AMBER 33.4% / RED 0.4%

**Status**: 🟢 CONFIRMADO. A real BCB recalibration foi o melhor aspecto técnico do D3. Não muda.

**Severidade**: 🟢 NENHUMA. A OSINT confirma o trabalho.

---

### 🟡 CRÍTICA #10: D3 acertou a estrutura conceitual mas falhou no dimensionamento

**Achado OSINT**: o framework D3 tem 5 camadas, 12 decision trees, 31 ações, 6 recalibrações empíricas, RACI 9-gates. Conceitualmente sólido.

**Mas**:
- <strong>Probabilidades dos cenários</strong> estão enviesadas (S3 RB Total improvável; S3 Expansão é o caso base)
- <strong>Dimensões faltantes</strong>: S7 (ESG), S8 (Ramp), S9 (Demanda), S10 (Tarifa), S11 (Competição)
- <strong>Calibração econômica</strong>: lítio subestimado, tarifa ignorada, market share subestimado
- <strong>Stress test</strong>: precisa de atualização para refletir 2026 realidade (lítio rebound, tarifas, demanda explosiva)

**Status**: 🟡 O framework é robusto em estrutura, mas precisa de <strong>recalibração material</strong> em 4-5 parâmetros antes de ser levado a sério por stakeholders.

**Severidade**: 🟡 MÉDIA. Re-trabalho antes de scale-up é factível, mas material.

---

## 3. Resumo de gaps por severidade

| # | Crítica | Severidade | Re-trabalho estimado |
|---|---|---|---|
| 1 | ESG / lista suja (BYD) | 🔴 Alta | 4h (adicionar S7 + S7 status) |
| 2 | Sales ramp (BYD >12% share) | 🟡 Média-alta | 2h (re-mapear probabilidades S3) |
| 3 | Production ramp | 🟡 Média | 2h (adicionar S8) |
| 4 | BNDES = crédito ao consumidor, não capex | 🟡 Média | 1h (clarificar S3 vs S8 vs S9) |
| 5 | Tarifa 35% Jan/2027 | 🟡 Média-alta | 3h (adicionar S10, recalibrar S1↔S4) |
| 6 | Cenário competitivo ignorado | 🔴 Alta | 4h (adicionar S11) |
| 7 | Demanda 13.5% Mai/2026 | 🟡 Média | 1h (atualizar sensitivities) |
| 8 | Lítio rebound 2026 | 🟡 Média | 2h (atualizar S2 baseline) |
| 9 | VaR FX (BCB real) | 🟢 OK | 0h (validado) |
| 10 | Estrutura vs dimensionamento | 🟡 Média | 2h (atualizar probabilidades) |
| | | | |
| | <strong>TOTAL re-trabalho</strong> | | <strong>~20h</strong> |

**Conclusão**: o framework é <strong>conceitualmente sólido mas materialmente desatualizado</strong>. Re-trabalho de ~20h antes de scale-up.

---

## 4. Recomendações práticas (3 caminhos)

### 4.1 Caminho A: Mínimo (recomendado para anexo de vaga) — 4h

Reconhecer limitações explicitamente em uma seção "Limitações do D3 v0.5" do D3-MAIN.html:

- "O D3 foi construído com base em D2 (Atlas preditivo, 21/jul/2026). Subsequente a essa data, eventos materiais ocorreram: (a) escândalo de trabalho escravo na BYD, (b) tarifação de 35%, (c) lítio rebound, (d) BYD já com 12.8% market share. <strong>Recomenda-se re-calibração antes de Phase 2</strong>."
- <strong>Não esconde</strong>, mas <strong>faz o framework honesto</strong>
- <strong>Vantagem</strong>: mostra maturidade intelectual; reviewer técnico vai gostar
- <strong>Para vaga</strong>: mostra que você sabe o que sabe e o que não sabe

### 4.2 Caminho B: Médio (recomendado para entrega a stakeholders) — 20h

Aplicar as correções listadas:
- Adicionar S7 (ESG), S8 (Ramp), S10 (Tarifa), S11 (Competição)
- Re-mapear probabilidades S3 baseado em market share realized
- Recalibrar S2 com lítio rebound 2026
- Recalibrar S1↔S4 com tarifa 35%
- Adicionar nota explícita sobre lista suja BYD
- Atualizar D3-MAIN.html, D3-ANNEX.html, D3-DECISION-TREES.html
- <strong>Vantagem</strong>: framework atualizado e defensável
- <strong>Para vaga</strong>: mostra capacidade de auto-crítica e adaptação

### 4.3 Caminho C: Máximo (research-grade) — 60h+

Construir D3 v2.0 com:
- 11 dimensões (S1-S11) em vez de 6 (S1-S6)
- Re-calibração empírica com dados 2025-2026 (não 2015-2025)
- Game theory layer com 5 players (BYD, Stellantis, GM, VW, Geely)
- Sensitivity multivariada com 4 choques simultâneos (FX, lítio, tarifa, demanda)
- <strong>Vantagem</strong>: framework state-of-the-art, research-grade
- <strong>Para vaga</strong>: impressionante mas overkill

---

## 5. Recomendação do checkpoint

<strong>Para anexo de vaga, ir com Caminho A (4h)</strong>:
1. Adicionar seção "Limitações conhecidas" no D3-MAIN.html
2. Citar este documento `D3-OSINT-CHECKPOINT.md` como referência
3. Mostrar que você <strong>sabe o que não sabe</strong>

A honestidade intelectual é mais valorizada em entrevistas técnicas do que framework "perfeito". O D3 v0.5 já é um deliverable técnico forte (16 docs + 4 HTMLs + 14 figuras + 6 recalibrações empíricas). Adicionar a auto-crítica o torna <strong>imune</strong> a questionamento técnico agressivo.

<strong>Para entrega a stakeholders (Conselho, BYD HQ), ir com Caminho B (20h)</strong>:
1. Aplicar as 10 correções
2. Re-publicar como D3 v0.6
3. Adicionar nota de "v0.6 — re-calibrado pós-OSINT 21/jul/2026"

---

## 6. Anexo: lista de fontes OSINT (auditáveis)

### Fontes primárias (reuters, BBC, AP)
- Reuters: BYD plant delayed, BYD China workers, BYD labor blacklist, BYD begins Brazil
- BBC: BYD factory slavery shutdown, BYD Brazil workers
- AP News: BYD Ford legacy Brazil
- Washington Post: BYD slavery allegations (paywall)
- Bloomberg: Stellantis Brazil investment

### Fontes regulatórias (BNDES, gov.br, Camex)
- BNDES.gov.br: programa Mover, Move Motoristas
- gov.br: Medida Provisória 1.359/2026
- Gecex-Camex: tarifas de importação
- ANFAVEA: production data, market outlook

### Fontes de mercado (Fenabrave, ABVE, BYD.com.br)
- Fenabrave: monthly sales data
- ABVE: Brazilian Association of Electric Vehicles
- BYD.com.br: corporate announcements

### Fontes commodity (USGS, IMARC, S&P, BMI)
- USGS Mineral Commodity Summaries 2026
- IMARC lithium pricing report
- S&P Global Commodities 2026
- BMI/Fitch Solutions lithium forecast
- ChemAnalyst, INN, Carbon Credits, Gasgoo

### Fontes concorrentes
- Stellantis: R$ 30bi investment, Bio-Hybrid
- GM: R$ 7bi, Spark EUV launch
- VW: R$ 16bi, ethanol platform
- Toyota: $2.2bi

---

## 7. Resumo executivo (1 página)

<strong>OSINT checkpoint</strong> revelou que o D3 framework, embora conceitualmente sólido, está materialmente desatualizado em 10 pontos. As correções são factíveis (~4-20h de trabalho) e elevam a credibilidade do framework para apresentação a stakeholders técnicos.

<strong>Pontos críticos</strong>:
1. 🔴 BYD na lista suja do trabalho escravo (risco ESG/financiamento) — D3 ignorou
2. 🔴 Cenário competitivo ignorado (Stellantis, GM, VW, Geely) — D3 trata BYD como monopolista
3. 🟡 Sales ramp 12.8% (Abr 2026) vs D3 assumia ViE baixo — probabilidades S3 invertidas
4. 🟡 Lítio rebound 2026 (US$ 9k → 22k) — D3 calibrado em "lítio normaliza"
5. 🟡 Tarifa 35% Jan/2027 — D3 não modelou

<strong>Pontos validados</strong>:
- 🟢 VaR FX real BCB (σ 14.86%) — confirmado
- 🟢 Lítio σ 82.9% — confirmado
- 🟢 Estrutura 5 camadas + 12 decision trees + RACI — confirmado

<strong>Recomendação</strong>: ir com Caminho A (adicionar seção de limitações, 4h) para anexo de vaga. Reconhecer o que o framework não captura é mais forte do que fingir que captura tudo.

<strong>Ação</strong>: Apresentar este checkpoint ao usuário; perguntar qual caminho seguir (A/B/C); atualizar framework se aprovado.
