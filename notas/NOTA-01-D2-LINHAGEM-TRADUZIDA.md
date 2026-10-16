---
slug: notas-d2-linhagem-traduzida
title: "Nota 01 — D2 em Linguagem de Negócio · Atlas D2 Preditivo traduzido"
ueid: ikigai:nota:d2-linhagem-traduzida:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, linhagem, didatica, leitura-expandida, atlas-preditivo, explicacao-nao-tecnica]
custom:
  _purpose: >-
    Tradução didática completa do atlas D2 Preditivo (e do relatório HTML
    /d2-econometric-vulnerability/byd-econometric-report.html) para linguagem
    de negócio. Como um analista sênior explicaria para um chefe não técnico
    o que cada métrica significa, como chegamos nela, e o que ela implica
    na prática para o programa BYD Camaçari 2025-2027. Esta nota serve como
    "leitura expandida" das fontes canônicas e ponto de entrada para
    qualquer stakeholder antes de mergulhar nos artefatos técnicos.
  _audience: ceo, conselho, head-de-area, pmo, new-joiner, analista-junior
  _data_sources:
    - /d2-econometric-vulnerability/byd-econometric-report.html
    - /analise-prescritiva/reports/atlas-d2-preditiva.html
    - /d2-econometric-vulnerability/outputs/1-pager-summary.md
    - /analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md
  _outputs:
    - leitura-didatica-d2
    - variaveis-fontes-dados
    - metricas-em-linguagem-de-negocio
    - ordem-de-relevancia
  _success_criteria: >-
    leitor não-técnico consegue entender o que cada métrica D2 mede, como é
    calculada, quais são as táticas/técnicas usadas, o que os outputs dizem
    na prática, e por que ordem de relevância. Não precisa abrir nenhum
    HTML/JSON para entender o cenário macro-econômico inicial.
---

# Nota 01 — D2 em Linguagem de Negócio

> **Quem está falando:** um analista de negócio sênior explicando ao chefe.
> **O que estamos fazendo:** destrinchar o que o **D2** (análise preditiva do programa BYD Camaçari 2025–2027) realmente fez, em ordem de relevância para o negócio.
> **Fontes canônicas traduzidas:**
> - [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) — relatório técnico Plotly (3.7 MB, 13 figuras interativas)
> - [`/analise-prescritiva/reports/atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html) — Atlas D2 white paper (66 KB, 6 sessões)
> - [`/d2-econometric-vulnerability/outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md) — sumário de 1 página
> - [`/analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md) — auditoria que motivou o D3
> - [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md) e [`EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md)

---

## §0. O quadro geral — o que é o D2 e por que ele existe

Chefe, vou começar pelo mais importante: **o D2 não é um modelo. É uma fotografia do cenário macro em que o programa BYD Camaçari vai operar entre 2025 e 2027.**

Pense nele como um raio-X que tiramos de uma situação antes de começar a tratar dela. Tiramos essa foto em duas etapas:

1. **Fase 1 (Descritiva, jul/2025):** o que está acontecendo hoje com câmbio, fornecedores, regulação e competição — sem nenhum modelo preditivo, só estatística descritiva ("média, dispersão, onde está a concentração").
2. **Fase 2 (Preditiva, jul/2026):** adicionamos modelos econométricos (GARCH, VAR, Monte Carlo) para dizer **qual é a probabilidade de cada cenário ruim acontecer** e qual seria o impacto em reais.

Em conjunto, o D2 responde uma pergunta operacional direta:

> "Se eu colocar R$ 1 nessa fábrica hoje, qual é a chance de eu perder parte desse dinheiro por causa de (a) variação do dólar, (b) ruptura de fornecedor, (c) mudança de regra do governo, ou (d) concorrente entrar agressivo?"

E a resposta num número único é o **composite score de 71,8/100** ("vulnerabilidade alta"). Esse número é o termômetro executivo do D2.

A pergunta que vem depois — "ok, e o que eu faço com isso?" — é o que motivou o D3 (framework prescritivo). Mas isso fica para a próxima nota. Aqui o foco é puramente entender o D2 como um fim em si mesmo: o que ele cobriu, o que ele encontrou, e o que ele **não** consegue responder.

---

## §1. As seis sessões analíticas — em ordem de relevância

O D2 cortou o problema em 6 sessões. Eu vou explicar cada uma na ordem de impacto no negócio, **da mais relevante para a menos**, com as métricas traduzidas.

### 🥇 Sessão 1 — CÂMBIO (peso 30%, contribuição 21,3pp ao composite)

**Por que essa é a mais relevante:** porque o **Real** é a variável que mais oscila e que mais dói no bolso quando oscila.

**A pergunta de negócio:** "Se o dólar sobe ou desce X%, quanto isso destrói da minha margem?"

#### §1.1 A variável que estamos medindo

A variável é a **PTAX venda** — a cotação do dólar comercial que o Banco Central apura todos os dias úteis às 13h30, a partir das operações reais do mercado interbancário numa janela de 10 minutos. É o número que aparece no Jornal Nacional quando dizem "o dólar fechou a R$ 5,12". **Não é cotação de turismo, não é dólar futuro, não é paralelo** — é a referência oficial para contratos de comércio exterior.

**Por que essa variável e não outra?** Porque 42% do **BOM** (Bill of Materials — a lista de tudo que entra no carro: células de bateria importadas, semicondutores, alumínio, componentes eletrônicos) é dolarizado. Para cada R$ 0,10 que o dólar sobe, o custo de produção sobe cerca de R$ 280 milhões por ano, porque os mesmos componentes passam a custar mais reais.

**Fonte dos dados:** [`/d2-econometric-vulnerability/outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md) e [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html) §1.

#### §1.2 O que descobrimos sobre essa variável

**Média histórica (2015–2024):** R$ 3,45.
**Mediana:** R$ 3,25 (média > mediana → distribuição assimétrica com mais episódios de desvalorização).
**Mínimo:** R$ 1,65 (2015, governo Dilma).
**Máximo:** R$ 5,65 (2022, ano eleitoral).
**Volatilidade anualizada:** **14,19%** (a oscilação "típica" do ano inteiro, concentrada em dias específicos).
**Skewness:** +0,87 → BRL desvaloriza mais frequentemente do que se valoriza.
**Curtose:** 4,21 → "caudas gordas" — eventos extremos acontecem mais vezes do que uma distribuição normal sugeriria.

**Janela amostral:** 1.642 observações entre 02/01/2020 e 17/07/2026 (77 meses, ~6,5 anos).

#### §1.3 O regime atual (jul/2026)

A PTAX está em **R$ 5,1176** (cotação de 17/jul/2026). Tendência de 180 dias: **−4,68%** (o Real **se depreciou** 4,68% nos últimos 6 meses). Volatilidade 30 dias anualizada: **14,19%** — **acima** da média histórica de 12,3% (2015–2019).

Isso é importante: o Real está num regime de estresse fiscal que começou em 2022 (quando o ciclo de aperto monetário americano começou) e se intensificou em 2024–2025. **A média histórica perdeu valor preditivo** — o que significa que não dá para projetar o custo do carro usando "média de longo prazo".

#### §1.4 As 3 técnicas/táticas que usamos para traduzir "oscilação" em "risco"

**Tática 1 — Stress Test determinístico** (figura 1.3 do atlas; figura 1.3 do relatório HTML)

> "E se o dólar cair 5%, 10%, 20% ou 30%?"

Não é simulação, é aritmética: para cada cenário de PTAX, calculamos o impacto direto no BOM. Resultado:

| Cenário | PTAX | ΔBOM (pp) | Interpretação |
|---|---|---|---|
| Base | R$ 5,12 | 0,0 | Estado atual |
| Valorização −5% | R$ 4,86 | **−2,1 pp** | Redução de margem bruta moderada |
| Valorização −10% | R$ 4,61 | **−4,2 pp** | Compressão de toda a margem operacional |
| Valorização −20% | R$ 4,09 | **−8,4 pp** | Inviabiliza a estrutura de preço sem repasse |
| Valorização −30% | R$ 3,58 | **−12,6 pp** | Prejuízo operacional direto |

> **A regra de bolso resultante:** cada 1% de **valorização** do BRL custa 0,42 pp de margem bruta do veículo.

A intuição aqui é direta: se o carro custa R$ 100 mil e a margem bruta é 12%, cada 1% de valorização do Real tira 0,42 pp = R$ 420 por unidade vendida. Multiplicado por 150.000 unidades/ano (capacidade de Camaçari), é R$ 63 milhões por ano **a cada 1% de valorização**. Em cenário moderado de −10%, é R$ 630 milhões por ano.

**Tática 2 — Simulação de Monte Carlo** (figura 1.4 do atlas; figura 1.4 do relatório)

Substituímos o determinismo por uma distribuição. Usamos o modelo **Ornstein-Uhlenbeck** (OU) calibrado sobre a série histórica com **distribuição log-normal** dos retornos. Geramos 10.000 trajetórias sintéticas do PTAX em horizonte de 6 meses (126 dias úteis) e computamos o impacto sobre o BOM em cada caminho.

> "Em vez de calcular um único número para 'impacto cambial aos 6 meses', geramos 10.000 trajetórias possíveis, e olhamos: em 50% dos cenários o impacto é pior que X, em 5% é pior que Y."

Resultado (do atlas D2):

| Percentil | ΔBOM (pp) | Interpretação |
|---|---|---|
| **P5** (severo) | **−4,78** | Risco de cauda — 1 em 20 cenários |
| P10 | −3,72 | Cenário adverso plausível |
| P50 (mediana) | −0,15 | Calibração validada |
| P90 | +3,90 | Cenário favorável |
| **P95** (otimismo) | +5,19 | Reversão cambial forte |
| **Probabilidade de perda** | **53,6%** | Mais provável perder do que ganhar |

A mediana próxima de zero confirma que o modelo está calibrado. A **cauda esquerda** (P5 = −4,78 pp) é o que assusta: existe **1 chance em 20** de a perda ultrapassar 4,7 pp em apenas 6 meses.

No relatório HTML, a esperança matemática do impacto é **−0,01 pp** (viés de baixa por assimetria), P50 = −0,2 pp, e a cauda esquerda tem **P5 = −4,7 pp**. Há uma pequena diferença nos valores por causa do método (OU vs. log-normal direto), mas a conclusão é a mesma.

**Tática 3 — GARCH(1,1) para persistência da volatilidade** (figura 1.5 do atlas)

A pergunta operacional: "se o câmbio dá um salto hoje, quanto tempo leva para o mercado 'esquecer' esse salto?"

Calibramos um **GARCH(1,1)** univariado sobre os retornos logarítmicos da PTAX. O modelo canônico é:

> σ²(t) = ω + α · ε²(t−1) + β · σ²(t−1)

onde σ²(t) é a variância no tempo t, ε(t−1) é o choque de ontem, e ω, α, β são parâmetros calibrados por **máxima verossimilhança** (MLE).

| Parâmetro | Valor | Significado |
|---|---|---|
| **α** (ARCH) | **0,0488** | 5% do impacto de um choque de hoje vira volatilidade amanhã |
| **β** (GARCH) | **0,9418** | 94% da volatilidade de hoje persiste para amanhã |
| **α + β** | **0,9906** | Quase 1 (unit root) → **volatilidade é "grudentemente persistente"** |
| **Half-life** | **73,3 dias** | **~3,5 meses** para um choque decair pela metade |
| **ν (Student-t df)** | **6,99** | Caudas pesadas (Normal tem ν=∞) |

**O insight crítico:** um choque cambial leva **2 semanas úteis** para decair pela metade (half-life curto do atlas) — mas isso é em vol de curto prazo. Em termos de persistência estrutural, o regime de alta volatilidade pode durar **anos** (parâmetro β alto). Isso significa que **hedge cambial precisa ser estrutural, não pontual**.

#### §1.5 O que esses números dizem na prática

A leitura integrada dos três instrumentos:

1. **Stress test** diz: "cada 1% de valorização custa R$ 63 milhões/ano por unidade de PTAX".
2. **Monte Carlo** diz: "existe 1 chance em 20 de perder R$ 1 bilhão em 6 meses por valorização forte do Real".
3. **GARCH** diz: "a volatilidade é persistente — não dá para 'esperar passar'".

A recomendação operacional que saiu do D2:

> **Hedge cambial de 50% da exposição cambial líquida em horizonte de 6 meses**, com revisão trimestral. Instrumentos: swap cambial na B3 + NDF (Non-Deliverable Forward) offshore. Custo esperado: **80–120 bps/ano** em prêmio de seguro. Reduz o P95 de −4,78 pp para ≈ −2,4 pp.

**Gatilhos de revisão do hedge:**
- PTAX > R$ 5,40 por 5 dias úteis consecutivos.
- Volatilidade realizada 30d > 18%.
- Evento de risco soberano (NTN-B > IPCA+6,5%).

---

### 🥈 Sessão 2 — SUPPLY CHAIN (peso 30%, contribuição 28,7pp ao composite — **a maior contribuição**)

**Por que essa é a mais relevante na prática:** porque **não há fornecedor alternativo ocidental em escala de produção** para as duas categorias que definem o custo de um EV: bateria LFP e lítio.

**A pergunta de negócio:** "Se meu fornecedor principal de bateria falhar (sancão, desastre, falência), o que acontece com minha linha de produção?"

#### §2.1 A variável que estamos medindo

A variável é o **HHI** (Herfindahl-Hirschman Index) — mede concentração de mercado. É um número entre 0 e 10.000: quanto maior, mais concentrado o mercado.

**Regra regulatória americana (FTC, usada como benchmark global):**
- HHI > 2.500 → "altamente concentrado" (oligopólio / quase monopólio).
- 1.500 < HHI < 2.500 → "moderadamente concentrado".
- HHI < 1.500 → "competitivo".

**Fonte dos dados:** market share público de fornecedores (BYD/CATL/Albemarle/SQM/TSMC/Samsung), IPEADATA, announcements oficiais de capacidade. Cálculo:

> HHI = Σ (market_share_em_decimal)²
> Exemplo: 4 empresas com 50%, 20%, 20%, 10% → HHI = 0,5² + 0,2² + 0,2² + 0,1² = 2.500 + 400 + 400 + 100 = **3.400**.

#### §2.2 O que descobrimos sobre essa variável

| Categoria | HHI | Classificação | Top supplier | % share | Risco |
|---|---|---|---|---|---|
| **Bateria (LFP)** | **4.850** | Altamente concentrada | CATL | 95,7% | 🔴 Crítico |
| **Lítio** | **3.400** | Altamente concentrada | Albemarle + SQM | 50% + 30% = 80% | 🔴 Crítico |
| **Semicond.** | **2.925** | Moderadamente concentrada | TSMC + Samsung | 45% + 30% = 75% | 🟡 Alto |
| Cell (cilíndrica) | 2.100 | Moderada | LG Energy | ~35% | 🟢 Médio |
| Plástico técnico | 1.800 | Baixa-moderada | diversificado | ~30% | 🟢 Baixo |
| Vidro blindado | 1.500 | Baixa | diversificado | ~25% | 🟢 Baixo |

**Os números-âncora:** **CATL + Albemarle + SQM cobrem mais de 80% do supply crítico do programa**. Uma disrupção simultânea em duas dessas frentes (cenário "Taiwan + Chile") tem impacto de produção **imediato**, sem mitigação possível em < 12 meses.

#### §2.3 O mapa de risco geopolítico (figura 2.3 do atlas)

Conectamos fornecedor → país → categoria de risco geopolítico. Resultado: **três clusters de risco sobrepostos**.

| Cluster | Fornecedor | País | Risco |
|---|---|---|---|
| 🇨🇳 **China-Taiwan** | CATL | Fujian, China | Sanção tecnológica, bloqueio Taiwan (TSMC 45% dos chips avançados) |
| 🇨🇱 **Lithium Triangle** | Albemarle + SQM | Atacama, Chile | Nacionalização, instabilidade social Bolívia, taxação Argentina |
| 🇰🇷 **Coreia do Sul** | Samsung | Giheung | Risco secundário em semicondutores |

#### §2.4 Cenários de disrupção (figura 2.4 do atlas; §2.2 do relatório HTML)

Cada cenário considera: (a) probabilidade de ocorrência no horizonte 2026-2027, (b) duração estimada da disrupção, (c) impacto em pp de BOM, (d) custo mensal em R$ milhões para a operação de Camaçari (capacidade: 150.000 veículos/ano).

| Cenário | Prob. | Duração | ΔBOM (pp) | Custo mensal |
|---|---|---|---|---|
| CATL outage 6m | 5% | 6 meses | −3,2 pp | R$ 200M |
| Lítio Albemarle strike | 8% | 3 meses | −1,8 pp | R$ 120M |
| TSMC Taiwan bloqueio | 3% | 12 meses | −6,5 pp | R$ 420M |
| Samsung Coreia Sul disruption | 4% | 4 meses | −2,8 pp | R$ 180M |
| **Cenário combinado (Taiwan + Chile)** | **1,5%** | **9 meses** | **−10,5 pp** | **R$ 650M** |

#### §2.5 A prescrição do D2 (resumida)

**Curto prazo (6m):** Contratos take-or-pay plurianuais com CATL e Albemarle (mínimo 70% de volume) travados em PTAX forward, com cláusula de pass-through cambial simétrico.

**Médio prazo (12-18m):** Qualificar **segundo fornecedor LFP** (EVE Energy ou Gotion) com meta de 25% do supply de células até 2027. Para lítio, expandir contratos com **Tianqi** (Argentina) e **Pilbara Minerals** (Austrália).

**Longo prazo (24m+):** Investimento minoritário em refinaria de lítio no Nordeste (Cadeia Otávia/Mariana) — protege contra nacionalização sul-americana e ancora vertical integration narrativa para capex público.

**Reserva de segurança:** 60 dias de inventário de safety stock para células e lítio, equivalentes a **~R$ 280M de capital imobilizado**.

---

### 🥉 Sessão 3 — REGULATÓRIO (peso 20%, contribuição 14,4pp ao composite)

**Por que essa é relevante:** porque **o Rota 2030 e o BNDES respondem por 78% do ViE** (Valor Incentivado Estimado) do programa, e a janela de aprovação do Plano Mais Produção coincide com o início da operação.

**A pergunta de negócio:** "Se o governo mudar as regras, qual o impacto financeiro?"

#### §3.1 As variáveis que estamos medindo

**Cobertura de incentivos** (% do VGV — Valor Geral de Vendas — coberto por Rota 2030 + BNDES): cenário base **18,0%**.
**Probabilidades subjetivas** dos cenários políticos (calibradas com base em histórico de política industrial brasileira).

#### §3.2 Os 4 cenários discretos (figura 3.1 do atlas; §3.2 do relatório HTML)

A modelagem segue árvore de decisão com 4 ramos:

| Cenário | Prob. | Cobertura incentivos | Δ ViE (pp) |
|---|---|---|---|
| **Continuidade** | **45%** | 18,0% | 0 |
| **Rollback Parcial** | **25%** | 10,0% | **−8,0** |
| **Rollback Total** | **15%** | 0,0% | **−18,0** |
| **Expansão** | **15%** | 25,0% | **+7,0** |

**Probabilidade ponderada do impacto:** 0,45×0 + 0,25×(−8) + 0,15×(−18) + 0,15×(+7) = **−3,45 pp** — o cenário mais provável é perda modesta, mas com cauda longa material.

#### §3.3 O Plano Mais Produção (BNDES) é a variável binária

A diferença entre "Plano aprovado" e "Plano negado" é de **12 pp de ViE** — equivalente a toda a margem operacional projetada de um ano em regime.

Em conjunto com o Rota 2030, os dois instrumentos respondem por **78% do ViE do programa**.

**Timing:** a aprovação do Plano Mais Produção (agosto de 2026) coincide com o início da operação assistida. Atraso impacta diretamente o fluxo de caixa do primeiro ano.

#### §3.4 A prescrição do D2 (resumida)

**Advocacy técnico:** posicionar BYD como caso de sucesso de policy outcome (job creation, transferência tecnológica, verticalização) para baseline de apoio congressional em ago/2026.

**Engagement MDIC/BNDES:** reunião técnica mensal com a diretoria do BNDES para garantir slot no Plano Mais Produção.

**Cofinanciamento:** Brde + Banco do Nordeste para reduzir exposição a funding federal único.

**Plano B (contingência):** linha de bridge financing de US$ 800M com sindicato de bancos comerciais (Itaú BBA, BTG, Bradesco) — drawable em 30 dias caso o BNDES atrase além de dez/2026.

---

### 4️⃣ Sessão 4 — COMPETITIVO (peso 20%, contribuição 7,4pp ao composite — a menor)

**Por que essa é a menos relevante:** porque a BYD está entrando como **líder absoluta** (38% de share em 2026) e a erosão esperada (até 24% em 2028) é compensada parcialmente pelo **crescimento absoluto do mercado**.

**A pergunta de negócio:** "Quem são meus concorrentes e qual minha posição?"

#### §4.1 A variável que estamos medindo

**Market share de EVs no Brasil** (% de vendas por OEM). Projeção 2026-2028.

#### §4.2 O que descobrimos

| Ano | BYD | Tesla | VW | GM | Outros | Crescimento mercado |
|---|---|---|---|---|---|---|
| 2026 | **38%** | 5% | 12% | 10% | 35% | 110k unidades |
| 2027 | 31% | 12% | 14% | 12% | 31% | 165k unidades |
| 2028 | **24%** | 18% | 16% | 14% | 28% | 220k unidades |

**Decomposição da perda de 14pp da BYD no horizonte:**
- 5 pp → Tesla (efeito Model 2 a US$ 25k)
- 4 pp → VW (linha MEB+ nacionalizada em Resende)
- 3 pp → GM (Equinox EV em São Caetano)
- 2 pp → diluídos entre Outros (GWM, Caoa Chery, JAC)

**Insight crucial:** a perda de share não é equivalente a perda de volume absoluto. Com mercado crescendo ~40% ao ano, **BYD 2028 com 24% vende mais unidades do que 2026 com 38%** — desde que a operação Camaçari escale para 180k unidades/ano.

#### §4.3 Vetores de pressão competitiva

1. **Tesla Model 2 (lançamento 2027):** veículo de entrada a US$ 25k, base de custos Gigafactory Mexico, narrativa premium acessível. Triplica share em 24 meses.
2. **VW ID.3 nacionalizado** via plataforma MEB+ em Resende — captura clientes de marca established.
3. **GM Equinox EV** em São Caetano — mesmo vetor.
4. **Pressão sobre Outros":** Caoa Chery, Renault, JAC, GWM, Leapmotor via Stellantis.

**Transição de fase:** o mercado brasileiro de EVs vai passar de "competição por educação do consumidor" (2026) para "competição por share em mercado maduro" (2028).

#### §4.4 A prescrição do D2 (resumida)

**Pricing defensivo em 2026 (Q3-Q4):** travar preço de catálogo abaixo do Model 2 esperado (US$ 25k) com pacote de serviço + wallbox incluso. Custo: R$ 4.500/unidade. ROI positivo se share for preservado em 1,5 pp.

**Diferenciação LFP:** comunicar segurança + durabilidade vs. NMC da Tesla. Construir narrativa "bateria que não pega fogo" — referenciada em recall Tesla 2024.

**Verticalização como narrativa:** "Carro baiano" com 60% de conteúdo local em 2027.

**Programa de fidelização (BYD Connect):** subscription de bateria, garantía estendida, OTA updates — fidelizar primeira geração.

**Roadmap 2027-2028:** antecipar SUV compacto (X-Dream nacional) e picape elétrica leve.

---

### 5️⃣ Sessão 5 — COMPOSITE INDEX (o termômetro executivo)

**O que é:** média ponderada das 4 dimensões em score 0-100. On ** **= alta vulnerabilidade**.

**Cálculo do score 71,8:**
- Câmbio (30%) × 70,9 score = 21,3 pp
- Supply (30%) × 95,7 score = 28,7 pp
- Regulatório (20%) × 72,0 score = 14,4 pp
- Competitivo (20%) × 36,8 score = 7,4 pp
- **Total: 71,8 / 100** (vulnerabilidade alta)

**LImportza:** a redução de 10 pontos no score de supply chain (de 95,7 para 85,7) é **duas vezes mais eficiente** em reduzir o composite do que a mesma redução na dimensão competitiva (de 36,8 para 26,8). A alocação de capital de mitigação deve refletir esse retorno marginal decrescente.

#### §5.1 Retorno marginal de mitigação (figura 5.3 do atlas)

| Dimensão | Mitigação | Δ composite por R$ 100M investidos |
|---|---|---|
| Regulatório | advocacy + contingency | **−4,8 pp** (mas alavanca política) |
| Supply chain | dual-sourcing + safety stock | **−3,5 pp** |
| Câmbio | hedge 50% | **−2,1 pp** |
| Competitivo | pricing defensivo | **−0,9 pp** |

**Ordem ótima de mitigação:**
1. **Regulatório** (12m, R$ 12M): advocacy Plano Mais Produção + Rota 202. ROI político.
2. **Supply chain** (18m, R$ 280M): dual-sourcing + safety stock + investimento minoritário em lítio nacional. Maior impacto em composite.
3. **Câmbio** (contínuo, R$ 80M/ano): programa de hedge 50%. Reduz volatilidade do P&L.
4. **Competitivo** (24m+, R$ 320M/ano): pricing defensivo + diferenciação. Manutenção de posição.

---

### 6️⃣ Sessão 6 — MACRO & ECONOMETRIA (o chão do programa)

**O que é:** âncora macroeconométrica das 4 dimensões anteriores, via VAR(4) com Impulse Response Functions (IRF), Forecast Error Variance Decomposition (FEVD), e correlações contra séries do Banco Central. Objetivo: separar **vulnerabilidade do programa** (controlável) de **vulnerabilidade do ambiente** (não controlável).

#### §6.1 VAR(4) IRF — choque cambial → vendas (figura 6.1 do atlas; §6.1 do relatório)

Estimamos um VAR(4) (Vector Autoregression com 4 lags) sobre o sistema (PTAX, ANFAVEA vendas, IPCA, PIB) em frequência mensal, N = 77 observações.

> Estabilidade verificada via eigenvalues dentro do círculo unitário. Identificação por Cholesky com ordem: PTAX → IPCA → PIB → ANFAVEA (PTAX contemporaneamente exógena).

**Resultado:** um choque de **+1σ na PTAX** (depreciação do BRL) gera resposta de **ANFAVEA vendas de −204 mil unidades no lag 3** (≈ 9 meses após o choque), com bandas de confiança a 95% que não cruzam zero. Persistência: o efeito se dissipa em ≈ 6 meses.

**Confirmação da teoria:** depreciação cambial eleva preço de veículos importados (70% da oferta em 2020-2023) e desloca demanda para usados.

#### §6.2 FEVD — quem explica quem (figura 6.2 do atlas)

Decomposição da variância de ANFAVEA vendas a 12 meses:

| Variável | Contribuição | Interpretação |
|---|---|---|
| PIB | **38%** | Driver principal — ciclo macro doméstico |
| IPCA | 31% | Inflação explica mais que câmbio (via taxa de juros e crédito) |
| Choques próprios (ANFAVEA) | 23% | Inércia da própria série |
| **PTAX** | **8%** | Terceiro driver — câmbio importa, mas macro doméstica importa mais |

**Insight crítico:** **o câmbio importa, mas a macro doméstica importa mais**. A vulnerabilidade cambial é real e quantificada, mas o principal driver do programa é o ciclo de crescimento e inflação brasileiros.

#### §6.3 Correlações BCB (figura 6.3 do atlas)

| Série | Correlação (r) | Interpretação |
|---|---|---|
| PIB mensal | **+0,59** | Ciclo macro doméstico dirige o mercado |
| FGV ICG (confiança consumidor) | +0,44 | Antecipa demanda com 1-2 meses de lead |
| FGV ICC (confiança indústria) | +0,31 | Material |
| IPCA | −0,24 | Inflação comprime renda real |
| Crédito automotivo | **+0,02** | Contraintuitivo — o crédito é regulado, responde endogenamente |

#### §6.4 Trade deficit autos (figura 6.4 do atlas)

A balança comercial do setor automotivo fechou os últimos 12 meses com:
- **Importações:** US$ 906,7M/mês
- **Exportações:** US$ 322,2M/mês
- **Déficit mensal médio:** **−US$ 584,5M/mês** = **−US$ 7 bi/ano**

A narrativa de **substituição de importações** via Camaçari 2025-2027 é a alavanca política mais poderosa: cada 10% de redução no déficit mensal = US$ 700M/ano de pressão cambial aliviada. É a métrica que fala diretamente com a área econômica do governo.

---

## §2. Resumo executivo — os 5 números que importam

Para fixar o que vimos:

| # | Métrica | Valor | Por que importa |
|---|---|---|---|
| 1 | **Composite Vulnerabilidade** | **71,8 / 100** | Alta. Meta de redução: 60/100 até dez/2027. |
| 2 | **Supply chain (dimensão crítica)** | **95,7 / 100** | CATL + lítio = 80% do supply crítico. |
| 3 | **Monte Carlo P5 câmbio (cauda)** | **−4,78 pp BOM** | Risco de cauda em cenário severo (6m). |
| 4 | **BYD share 2028** | **24%** | −14 pp vs. 2026, mas mercado cresce 2×. |
| 5 | **Trade deficit autos** | **−US$ 584M/mês** | Camaçari substitui ~US$ 2 bi/ano até 2028. |

---

## §3. As técnicas estatísticas que usamos (resumo executivo)

| Técnica | Para quê | Onde aparece |
|---|---|---|
| **Estatística descritiva** (média, mediana, vol, skew, curtose) | Caracterizar a distribuição sem assumir modelo | Sessão 1, 2, 4 |
| **Stress test determinístico** | Comunicar sensibilidade linear | Sessão 1 (câmbio) |
| **Simulação de Monte Carlo** (10.000 paths × 6m) | Mapear distribuição de resultados prováveis | Sessão 1 (câmbio) |
| **GARCH(1,1)** | Medir persistência de volatilidade | Sessão 1 (câmbio) |
| **HHI (Herfindahl-Hirschman Index)** | Medir concentração de mercado | Sessão 2 (supply) |
| **Probabilidades subjetivas** (árvore de decisão) | Modelar incerteza política | Sessão 3 (regulatório) |
| **VAR(4) com IRF/FEVD** | Decompor choques e variância entre séries macro | Sessão 6 (macro) |
| **Correlações Pearson** vs. séries BCB | Mapear drivers de vendas | Sessão 6 (macro) |
| **Análise de sensibilidade** (±20% nos parâmetros) | Identificar onde mitigação gera maior retorno | Sessão 5 (composite) |

---

## §4. As fontes de dados que usamos (resumo executivo)

| Fonte | Séries | Período | Onde é citada |
|---|---|---|---|
| **BCB SGS** | PTAX (10813), IPCA (13522), Selic (13521), PIB mensal (4380) | 2015-2026 | Sessões 1, 3, 6 |
| **ANFAVEA** | Vendas de veículos, produção | 2015-2026 | Sessões 1, 4, 6 |
| **IPEADATA** | Séries macro, FGV ICG/ICC, expectativas Focus | 2015-2026 | Sessão 6 |
| **MDIC/SECEX** | Trade balance autos, importações/exportações | mensal | Sessão 6 |
| **B3** | Swap cambial, dólar futuro | diário | Sessão 1 (hedge) |
| **Bloomberg** | Capacity announcements de Tesla, VW, GM | quarterly | Sessão 4 |
| **Market share público** | CATL, BYD Energy, Albemarle, SQM, TSMC, Samsung | annual | Sessão 2 |
| **Política industrial** | Rota 2030, BNDES Plano Mais Produção, ViE | estática | Sessão 3 |
| **Notícias / announcements** | Lista suja MTE (07/abr/2026), Tesla recalls | event-based | Sessão 2 (ESG) |

---

## §5. O que o D2 **NÃO** consegue responder (e por que isso importa)

Aqui está o ponto crucial, chefe. O D2 é uma excelente fotografia. Mas ele tem **limitações estruturais** que ficaram documentadas na auditoria [`/analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md). Os 10 gaps identificados foram:

1. **Interdependências não modeladas.** As 6 sessões são tratadas como paralelas, mas hedge cambial depende do cenário BNDES. Macro reescala tudo.
2. **Sem branching condicional.** Todas prescrições são "faça X". Não há "se cenário Y, senão Z".
3. **Sem NPV/cost-benefit.** Custos são listados, mas o **valor da mitigação** não é calculado.
4. **Sem counterfactual.** "Se não fizéssemos nada, o que aconteceria?"
5. **Triggers dispersos.** Gatilhos espalhados por 3 sessões, sem matriz unificada.
6. **Sem ownership.** Custos listados, mas ninguém é responsável.
7. **Análise competitiva unidirecional.** Sem teoria dos jogos (NASH equilibrium).
8. **MC só em S1 (câmbio).** Não há MC multivariado cruzando PTAX+lítio+tariff+demanda.
9. **Macro descritivo, não prescritivo.** S6 não dispara ação automaticamente.
10. **Sem sensitivity na pergunta de decisão.** Não há tornado plot priorizando ações.

Essas 10 limitações são o motivo pelo qual o D3 existe. Mas antes de chegarmos lá (próxima nota), vale a pena você guardar na cabeça:

> **O D2 é a fotografia. O D3 é a sequência de ações que você toma baseado no que a foto mostra.**

---

## §6. Glossário mínimo (para leitura confortável)

Para você não se perder nos termos técnicos quando ler os artefatos:

| Termo | Significado em linguagem de negócio |
|---|---|
| **PTAX** | Cotação oficial do dólar que o BCB apura todos os dias |
| **BOM** (Bill of Materials) | Lista e custo de tudo que entra no carro |
| **HHI** | Índice de concentração de mercado (0 a 10.000) |
| **Vol anualizada** | Oscilação "típica" do ano concentrada em dias específicos |
| **P5, P10, P50, P95** | Percentis de uma distribuição ("em X% dos cenários o impacto é pior que Y") |
| **GARCH** | Modelo que diz por quanto tempo a oscilação fica "grudada" |
| **VAR(4)** | Modelo que diz como 4 séries macro se influenciam mutuamente |
| **IRF** | Resposta de uma variável a um choque em outra (lag 3 = 9 meses) |
| **FEVD** | Decomposição de "quem explica quem" em uma série |
| **Composite score** | Média ponderada de 4 dimensões = termômetro executivo |
| **Take-or-pay** | Contrato em que você paga mesmo se não consumir (proteção de fornecedor) |
| **NDF** (Non-Deliverable Forward) | Contrato de proteção cambial sem entrega física do dólar |
| **VGV** | Valor Geral de Vendas (faturamento total da operação) |
| **ViE** | Valor Incentivado Estimado (benefício fiscal em R$) |
| **Capex** | Capital expenditure (investimento em ativo físico) |
| **LFP** | Lithium Iron Phosphate — tipo de bateria (vs. NMC) |
| **CKD/SKD** | Completely/Semi-Knocked Down (montagem a partir de peças importadas) |

---

## §7. Próxima nota

Chefe, agora que você entende o D2 como um raio-X do cenário macro, a próxima nota ([`NOTA-02-D2-PARA-D3-AUDITORIA-E-TRANSICAO.md`](./NOTA-02-D2-PARA-D3-AUDITORIA-E-TRANSICAO.md)) faz a **transição**: audita o que o D2 deixou de responder (os 10 gaps acima), explica como o D3 veio preencher cada um deles, e traduz o que cada artefato HTML do D3 significa em prática.

**Você vai sair da Nota 02 com entender:**
- Por que o composite caiu de 71,8 para 50,3 (e por que isso **não é regressão**).
- O que são as 11 dimensões S1-S11 e os 20 couplings quantitativos.
- Como a matriz de triggers funciona (sistema nervoso do framework).
- O que são as 25 ações do action register e por que 3 delas são críticas nos próximos 90 dias.
- Por que o backtesting atingiu 5/5 PERFEITO.

Para abrir agora os artefatos canônicos que sustentam esta nota, clique abaixo:

- **Relatório técnico D2 (HTML, 3.7 MB, 13 figuras):** [`/d2-econometric-vulnerability/byd-econometric-report.html`](../../d2-econometric-vulnerability/byd-econometric-report.html)
- **Atlas D2 Preditivo (HTML, 66 KB, white paper):** [`/analise-prescritiva/reports/atlas-d2-preditiva.html`](../../analise-prescritiva/reports/atlas-d2-preditiva.html)
- **1-pager D2 consolidado:** [`/d2-econometric-vulnerability/outputs/1-pager-summary.md`](../../d2-econometric-vulnerability/outputs/1-pager-summary.md)
- **Outputs HTML individuais (capítulos):**
  - [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) — stress test determinístico
  - [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) — 10k paths MC
  - [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) — fluxo fornecedor→país
  - [`regulatory-scenarios.html`](../../d2-econometric-vulnerability/outputs/regulatory-scenarios.html) — 4 cenários políticos
  - [`competition-landscape.html`](../../d2-econometric-vulnerability/outputs/competition-landscape.html) — share 2026-2028
  - [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html) — radar 0-100
- **PNGs estáticos** (`/d2-econometric-vulnerability/outputs/`): cap1_ptax_historia.png, cap1b_volatility.png, cap1c_stress_test.png, cap2_supply_chain.png, cap2b_disruption.png, cap3_regulatory.png, cap4_competition.png, cap4b_competitive_deep.png, cap5_composite.png, cap5b_sensitivity.png, cap6_dashboard_final.png
- **Documentação didática complementar** (`/d2-econometric-vulnerability/_study_notes/`):
  - [`00-INDEX.md`](../../d2-econometric-vulnerability/_study_notes/00-INDEX.md) — índice remissivo da base D2
  - [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) — glossário de métricas
  - [`L1.0-eda-pTAX-passo-a-passo.md`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md) — EDA PTAX detalhada
  - [`L1.1-eda-supply-chain-trade-balance.md`](../../d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md) — EDA supply chain
  - [`L2.1-modelos-vol-garch-gjr.md`](../../d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md) — GARCH/GJR explicados
  - [`L2.2-cambio-stress-test-monte-carlo.md`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) — MC câmbio
  - [`L5.0-calibracao-regime-switching.md`](../../d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md) — calibração Hamilton Markov
  - [`L6.0-risco-cauda-extremo.md`](../../d2-econometric-vulnerability/_study_notes/L6.0-risco-cauda-extremo.md) — risco de cauda extrema
  - [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios hands-on
- **Linhagem técnica:**
  - [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-1-DESCRITIVA.md) — D2 v1 (EDA)
  - [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-2-PREDITIVA.md) — D2 v2/v2.1 + 8 NB
  - [`/analise-prescritiva/notebooks!/LINHAGEM.md`](../../analise-prescritiva/notebooks!/LINHAGEM.md) — mapa técnico por fase

---

*Versão 1.0 — 25/ago/2026 — escrita como conversa analista-chefe.*
*Próxima: [Nota 02 — D2 para D3: auditoria e transição](./NOTA-02-D2-PARA-D3-AUDITORIA-E-TRANSICAO.md).*