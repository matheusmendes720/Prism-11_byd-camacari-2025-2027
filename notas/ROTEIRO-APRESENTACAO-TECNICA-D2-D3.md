---
slug: roteiro-apresentacao-tecnica-d2-d3
title: "Roteiro de Apresentação Técnica — D2 + D3 BYD Camaçari · Da Foto Estática ao Sistema Nervoso Autônomo"
ueid: ikigai:nota:roteiro-apresentacao-d2-d3:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [roteiro, apresentacao, video, d2, d3, didatico, nao-tecnico, anti-fragil, honesto]
custom:
  _purpose: >-
    Roteiro completo de apresentação técnica do projeto BYD Camaçari
    2025-2027 (D2 + D3), em 8 capítulos progressivos. Tom de
    conversa entre analista sênior e chefe não-técnico (RH, Imprensa,
    Conselho). Linguagem simplificada mas com robustez matemática
    demonstrada, táticas e técnicas explicadas, métricas e siglas
    decodificadas, exemplos do mundo real, hipóteses falseadas
    progressivamente, e ganchos entre capítulos para manter o
    interesse.
  _audience: engenheiro-junior, analista-pleno, pesquisador, RH, Imprensa, Conselho
  _data_sources:
    - /analise-prescritiva/case-studies/docs/00-sintese-executiva.md
    - /analise-prescritiva/case-studies/docs/01-cadeia-valor-byd.md
    - /analise-prescritiva/case-studies/docs/02-dados-logica-produto.md
    - /analise-prescritiva/case-studies/docs/03-matematica-didatica.md
    - /analise-prescritiva/case-studies/docs/04-progressao-temporal.md
    - /analise-prescritiva/case-studies/docs/05-backtesting-justificativa.md
    - /analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md
    - /analise-prescritiva/case-studies/docs/07-cadeia-fabrica-byb.md
    - /analise-prescritiva/case-studies/docs/08-decision-matrix-case-sensitive.md
    - /analise-prescritiva/case-studies/docs/09-alertas-personas-stakeholders.md
    - /analise-prescritiva/case-studies/docs/10-story-notes-s1-a-s11.md
    - /analise-prescritiva/study/_study-notes-d3/D3-0.0-arquitetura-decision-framework.md
    - /analise-prescritiva/study/_study-notes-d3/D3-1.0-drilldowns-couplings.md
  _outputs:
    - 8-capitulos-progressivos
    - linguagem-rh-amigavel
    - ganchos-entre-capitulos
    - desmistificacao-conceitos
    - honestidade-intelectual
  _success_criteria: >-
    leitor consegue apresentar o projeto BYD Camaçari D2+D3 para um
    público não-técnico em 60-90 minutos, mantendo robustez técnica,
    métricas REAIS, honestidade sobre limitações, e narrativa
    envolvente com ganchos progressivos.
---

# 🎬 ROTEIRO DE APRESENTAÇÃO TÉCNICA

## D2 + D3 BYD CAMAÇARI 2025–2027

> **Da foto estática ao sistema nervoso autônomo.**
> **Duração estimada**: 60-90 minutos (8 capítulos × 7-12 min cada).
> **Audiência primária**: RH que não entende de tecnologia, Imprensa, Conselho, qualquer stakeholder.
> **Tom**: conversa analista-chefe, sem jargão sem explicação, com honestidade intelectual.
> **Skills aplicadas**: `altitude-shifter` (re-pitching para RH), `humanizer` (voz real), `doubt-driven-development` (falsear hipóteses progressivamente).

---

## 📋 ESTRUTURA GERAL

| # | Capítulo | Duração | Tema | Gancho |
|---|---|---|---|---|
| **0** | Prefácio | 5 min | Por que este vídeo existe | "O que aconteceria se o lítio explodisse amanhã?" |
| **1** | O Diagnóstico | 8 min | O problema original: D2 (foto estática) | "Mas por que esse modelo antigo falhou?" |
| **2** | A Anatomia do D3 | 10 min | 5 camadas + 11 dimensões + NPV | "Como o sistema sabe quando agir?" |
| **3** | A Matemática sem Fórmula | 10 min | GARCH, Monte Carlo, Cauda Gorda, NASH | "Mas esses números são reais ou chute?" |
| **4** | A Jornada | 8 min | 6 stress events + 5 recalibrações + 4 fixes | "Como vocês sabem que funciona?" |
| **5** | O Chão de Fábrica | 10 min | 7 estágios físicos + D3 costurado | "E na prática, como ele opera?" |
| **6** | Quem Decide | 8 min | 17 personas + 9 approval + 7 kill gates | "E quem decide o quê, em quanto tempo?" |
| **7** | A Honestidade | 8 min | 10 limitações + 5 cenários de não-implementar | "Mas o que o D3 NÃO faz?" |
| **8** | A Decisão | 7 min | CTA final: 3 decisões em 5 min | "Então o que precisa ser feito AGORA?" |

**Total: ~75 minutos.**

---

# 📖 CAPÍTULO 0 — PREFÁCIO

## Título: "Por que este vídeo existe"

**Duração**: 5 minutos.
**Tom**: empático, aterrado, com números reais.
**Recursos visuais**: 1 slide com 3 números-âncora.

---

### [00:00] Abertura — A pergunta que incomoda

> *(olhando para a câmera, sem pressa)*

"Imagine uma segunda: estamos em **julho de 2026** e o preço do **lítio** no mercado internacional sofre uma explosão brutal — salta de **9 mil dólares para 22 mil dólares a tonelada**. Em questão de dias.

*(pausa dramática)*

Num cenário desses, a vasta maioria das **montadoras** precisaria de **semanas** — reuniões de conselho, comitês de crise, comitês de compliance — só para decidir: **'qual é o tamanho do buraco?'**

*(pausa)*

Mas existe uma empresa que fez diferente. Ela construiu um **sistema matemático** que detecta esse tipo de movimento, cruza com dados macroeconômicos, dispara um **plano de ação financeira completo em 9,3 dias** — incluindo o que cada executivo faz, com que custo, e com qual aprovação.

*(pausa)*

**9,3 dias** para mover R$ 1,68 bilhão em hedge cambial, contratos de fornecedores, e preços de catálogo.

Para uma mega-corporação, isso é **tempo de resposta absurdo**.

*(olhando para o relógio)*

Esse é o tamanho da máquina que vamos dissecar hoje."

---

### [01:30] O cenário-base em 3 números

> *(projetando slide com 3 números grandes)*

"Se você só puder lembrar 3 números do projeto BYD Camaçari, lembre estes:

| # | Número | Significado |
|---|---|---|
| **1** | **Composite 50,3** de 100 | O 'termômetro corporativo' marca **modo crise**. Defesa primeiro, expansão depois. |
| **2** | **R$ 1,68 bilhão** | O orçamento para o próximo ano. Tem 6 ondas, com 25 ações e R$ 3M já investidos no sistema que decide tudo. |
| **3** | **5 de 5 PERFEITO** | O sistema passou em todos os testes contra crises reais. **Mas isso não significa 100% acerto sempre** — significa que foi testado. |

*(pausa)*

Estes 3 números são a **estrela** do nosso roteiro. Vamos voltar a eles várias vezes."

---

### [03:00] O que vamos ver hoje — o mapa da jornada

> *(projetando mapa visual com 8 estações)*

"Hoje, em **8 capítulos**, vamos fazer uma jornada — começando no problema original (como a empresa via o risco em 2025), passando pelo modelo que virou playbook operacional (o D3), chegando até o chão de fábrica (onde o sistema dispara ações) e fechando com a pergunta que **todos vocês** deveriam fazer: **vale a pena?**"

| # | Estação | Pergunta |
|---|---|---|
| 1 | O Diagnóstico | "Por que o sistema antigo era cego?" |
| 2 | A Anatomia | "Como o D3 vê o risco?" |
| 3 | A Matemática | "Os números são reais?" |
| 4 | A Jornada | "Como vocês validaram?" |
| 5 | O Chão de Fábrica | "E na prática?" |
| 6 | Quem Decide | "Quem, quando, com qual limite?" |
| 7 | A Honestidade | "O que o D3 NÃO faz?" |
| 8 | A Decisão | "Então o que precisa ser feito?" |

---

### [04:30] O aviso de honestidade intelectual

> *(tom direto, sem rodeios)*

"Antes de começar, **um aviso de honestidade intelectual**:

1. Este projeto opera com **eventos reais e sensíveis** do cenário brasileiro — BNDES, tarifas de importação, e aquela crise reputacional com a lista suja do Ministério do Trabalho.
2. Nosso objetivo hoje é **puramente analítico** — explicar como a matemática processa esses eventos como **variáveis de risco**, não fazer juízo de valor sobre eles.
3. Os documentos originais citam essas crises. **A gente vai citar também**. Sem endosso, sem julgamento, sem tomar partido.

*(pausa)*

**A matemática é cega para ideologias**. Ela só consome dados, mapeia probabilidades de ruptura, e prescreve o caminho de menor dano financeiro.

Combinado?

---

### [04:50] O que muda na sua vida

> *(olhando para a audiência, com tom de conversa de café)*

"Vou ser direto: você não precisa entender **como** o sistema calcula o VaR para entender **o que ele faz por você**.

Você só precisa saber que:

- Se o dólar disparar e o lítio explodir e a tarifa saltar e o BNDES travar, **tudo ao mesmo tempo**, o sistema te diz **em 5 minutos** o que fazer.
- Antes desse sistema, a mesma crise levava **9 dias** para ter alguma resposta. E geralmente **resposta errada**.
- O custo de **ter** o sistema é **R$ 3 milhões**. O custo de **não ter** é **R$ 200 milhões por ano** em stress evitado. **R$ 3M vs R$ 200M/ano.**

Traduzindo para o **dia a dia**:

- Você não vai mais precisar entrar em **reunião de crise** às sextas-feiras 18h.
- Você não vai mais acordar no sábado com **ligação do CEO perguntando 'e agora?'**.
- Você vai ter **resposta automática**, com **custo calculado**, e **dono da ação**.

É isso. O resto do vídeo é o **como**."

---

### [04:55] Gancho para o Capítulo 1

> *(voltando ao gancho)*

"Agora que você sabe **por que** estamos aqui, vamos começar pelo começo: **por que o sistema antigo falhava?**

A resposta vai te surpreender. Vamos lá."

**[FIM DO CAPÍTULO 0 — 5:00]**

---

# 📖 CAPÍTULO 1 — O DIAGNÓSTICO

## Título: "O sistema antigo era cego — e isso quase matou o projeto"

**Duração**: 8 minutos.
**Tom**: didático, usando analogia de saúde.
**Recursos visuais**: 2 figuras (D2 vs D3).

---

### [05:00] A analogia do exame de sangue

> *(projetando figura de exame de sangue)*

"Pra entender o que o sistema antigo fazia de errado, vou usar uma analogia médica.

Imagine que você vai ao médico, faz um **exame de sangue completo**, e o resultado volta com:

- **Colesterol**: 280 mg/dL (alto).
- **Pressão**: 14/9 (alta).
- **Glicose**: 130 mg/dL (limite).

O médico te dá um **número único de risco cardiovascular**: **71,8 em 100**. Você está numa faixa de **'tensão sustentada'**.

A ferramenta antiga da BYD — chamada **D2** — fazia exatamente isso com a fábrica: media tudo, somava tudo, e te dava um termômetro.

> **Mas o que o médico faz DEPOIS?**

Ele prescreve **ação**: 'começa a tomar estatina, reduz sal, anda 30 min por dia, e volta em 90 dias'.

O D2 antigo **NÃO fazia isso**. Ele tirava a foto, indicava o risco, e parava aí.

A utilidade morria no diagnóstico."

---

### [07:00] As 4 falhas que quase mataram o projeto

> *(projetando lista das 4 falhas)*

"Quando a equipe técnica fez auditoria honesta do D2 antigo, encontraram **4 falhas estruturais fatais**:

| # | Falha | O que aconteceu |
|---|---|---|
| 1 | **Silos de risco** | Câmbio, supply chain e regulatório eram tratados como **separados**. Mas na vida real, eles se afetam. |
| 2 | **Sem NPV** | As ações eram recomendadas, mas sem calcular se **valiam o investimento**. |
| 3 | **Triggers dispersos** | Alarmes soavam em lugares diferentes, ninguém juntava as peças. |
| 4 | **Sem owner** | O alarme tocava, mas ninguém era o **dono da resposta**. |

*(pausa)*

A 4ª falha é a mais perigosa: **'ninguém é o dono do problema'**. É a receita clássica para desastre corporativo — todo mundo olhando para o outro enquanto o navio afunda.

*(olhando para a câmera)*

Mas aí entra a **engenharia de verdade**."

---

### [09:30] A virada — o D2 virou D3

> *(projetando arquitetura D3)*

"Em vez de só mudar números, a equipe **destruiu a lógica dos silos** e construiu algo novo: o **D3**, com **11 dimensões acopladas**.

Antes: 6 sessões isoladas que se somavam.
Depois: **11 dimensões que conversam entre si em tempo real**.

| Antes (D2) | Depois (D3) |
|---|---|
| 6 sessões paralelas | 11 dimensões acopladas |
| Foto estática | Sistema nervoso autônomo |
| Termômetro que indica | Sistema que prescreve |
| Sem owner | 17 personas com R+A+C+I |

E mais: o D3 introduziu o **NPV** (Net Present Value) em tudo. Cada ação passou a ter **custo, retorno esperado, e payback**.

*(pausa)*

Mas você pode perguntar: 'Como o sistema **sabe** quando agir? Quais são essas 11 dimensões?'

É o que vamos ver no próximo capítulo."

---

### [12:30] Gancho para o Capítulo 2

> *(fechando)*

"Mas a analogia do médico pode ir ainda mais fundo. Não basta o sistema **ter as receitas** — ele precisa ter **as ferramentas certas para executá-las** em tempo real.

A pergunta que vem é: **como o sistema enxerga as 11 dimensões? Como ele evita a falha #1 dos silos?**

Resposta: ele tem **5 camadas**. Vamos abrir a caixa preta."

**[FIM DO CAPÍTULO 1 — 8:00]**

---

# 📖 CAPÍTULO 2 — A ANATOMIA DO D3

## Título: "As 5 camadas e as 11 dimensões — o sistema nervoso autônomo"

**Duração**: 10 minutos.
**Tom**: técnico-progressivo, mas sem fórmulas.
**Recursos visuais**: 3 figuras (camadas, dimensões, NPV).

---

### [13:30] As 5 camadas — o sistema nervoso

> *(projetando diagrama de 5 camadas em pirâmide)*

"Pra entender como o D3 funciona, vou usar uma analogia do seu próprio corpo: o **sistema nervoso autônomo**.

Ele tem 5 camadas que operam continuamente:

| Camada | Função | Analogia corporal |
|---|---|---|
| **1. DATA** | Coleta automática de PTAX, lítio, BNDES, supply chain, demanda, ESG | **Sentidos** (olhos, ouvidos, pele) |
| **2. SIGNAL** | Converte dados em sinais calibrados (verde/amarelo/vermelho) | **Tálamo** (filtro sensorial) |
| **3. DECISION** | Funde os 11 sinais em 1 score com pesos 30/30/20/20 | **Córtex pré-frontal** (decisão) |
| **4. ACTION** | Seleciona 1 das 40 ações via matriz 12 cells + 4D Risk Map | **Medula espinhal** (execução) |
| **5. LEARNING** | Backtesting contra 6 eventos históricos para correção contínua | **Hipocampo** (memória) |

O fluxo é: **dados brutos** → **sinais** → **decisão** → **ação** → **aprendizado** → **loop**.

Cada camada **alimenta a seguinte**, e a Layer 5 fecha o loop voltando para a Layer 1 com **recalibração trimestral**."

---

### [16:00] As 11 dimensões — o que cada uma olha

> *(projetando lista das 11 dimensões)*

"As 11 dimensões S1-S11 são os 'olhos do sistema'. Cada uma olha para um risco diferente:

| Dim | O que olha | Peso |
|---|---|---|
| **S1 FX** | Câmbio (PTAX, vol) | 30% |
| **S2 Supply** | Cadeia de fornecedores, lítio | 20% |
| **S3 BNDES** | Financiamento público, ViE | 20% |
| **S4 Pricing** | Preço de catálogo, defensivo | 10% |
| **S5 Partnerships** | Contratos com fornecedores-chave | 5% |
| **S6 Macro** | PIB, Selic, IPCA | 5% |
| **S7 ESG** | Lista suja, MSCI RepRisk, kill switch | 5% |
| **S8 Ramp** | Produção SKD → CKD → Nacional | 5% |
| **S9 Demand** | Vendas, market share, EV penetration | 5% |
| **S10 Tariff** | Tarifa de importação (Camex) | 5% |
| **S11 Competition** | NASH 5 players (BYD/Stellantis/GM/VW/Geely) | 5% |

*(pausa)*

Mas note: as 4 primeiras (S1, S2, S3, S4) têm **80% do peso**. O sistema **prioriza** o que importa mais.

E mais: as 11 dimensões **conversam entre si**. Se o BNDES atrasar (S3), o sistema **automaticamente recalcula** o hedge cambial (S1), porque com menos caixa a empresa aguenta menos oscilação."

---

### [20:30] A chave — coupling S1↔S3 com fórmula

> *(projetando a fórmula h*)*

"Aqui está a chave do sistema. Pra cada par de dimensões que conversa, há uma **fórmula**.

A mais importante é a do **hedge cambial** (S1) dependendo do **BNDES** (S3):

> `hedge ótimo = 91% - (BNDES%/22%) × 61%`

Traduzindo: se o BNDES está saudável (cobre 22% do preço), hedge é **baixo (30%)**. Se o BNDES está em **Rollback Total** (0%), hedge sobe para **91%**.

É contraint-based hedging — o tamanho do hedge é **função da saúde do BNDES**, não um flat 50% como era antes.

E essa é **apenas uma das 20 conexões**. O sistema tem 20 acoplamentos quantitativos entre as 11 dimensões. Cada um com fórmula ou tabela."

---

### [22:30] O NPV — a estrela do sistema

> *(projetando tabela de NPV por prescrição)*

"Se você só pudesse lembrar **um número** do sistema, lembraria do **NPV** — Net Present Value, ou Valor Presente Líquido.

O NPV responde: **'Essa ação vale o investimento?'**

| Ação | Custo | NPV Marginal | Payback |
|---|---|---|---|
| Hedge cambial 50% | R$ 30M | +R$ 74M | < 1 mês |
| Dual-sourcing (CATL + EVE) | R$ 280M | +R$ 748M | < 1 mês |
| Advocacy BNDES | R$ 12M | −R$ 11M (pior caso) | depende |
| LFP verticalization | R$ 600M | +R$ 1.200M (5y) | 18 meses |

Cada ação tem **custo, retorno esperado, e payback** explícitos. Não é 'faça X' — é 'faça X porque o valor presente vale R$ Y, e você recupera em Z meses'.

E o sistema **agrega** todos os NPVs para dar um número consolidado: **NPV marginal em 365 dias = R$ 1,68 bilhão**.

*(pausa)*

Esse é o número que faz o Conselho dizer sim ou não."

---

### [22:00] Gancho para o Capítulo 3

> *(fechando)*

"OK, então temos um sistema com **5 camadas, 11 dimensões, 20 acoplamentos, e NPV em tudo**.

Mas a pergunta é inevitável: **'Esses números são reais ou chute?'**

Como vocês validaram que o σ PTAX de 14,19% não é só um chute sofisticado? Como vocês sabem que o sistema **prevê** o que vai acontecer, e não só **descreve** o que aconteceu?

É o que vamos ver agora — quando a matemática entra em campo."

**[FIM DO CAPÍTULO 2 — 10:00]**

---

# 📖 CAPÍTULO 3 — A MATEMÁTICA SEM FÓRMULA

## Título: "GARCH, Monte Carlo, Cauda Gorda e NASH — desmistificando os números"

**Duração**: 10 minutos.
**Tom**: explicativo, usando analogias do cotidiano.
**Recursos visuais**: 5 figuras (vol, MC, tail, payoff matrix).

---

### [22:30] GARCH — a memória da volatilidade

> *(projetando série PTAX com banda de vol)*

"Quando o D3 diz que a **volatilidade cambial é 14,19% ao ano**, o que isso significa?

Imagine que você está medindo a **velocidade** do dólar. Ontem andou devagar, hoje andou rápido, amanhã pode andar mais rápido ainda.

**Volatilidade anualizada = 14,19%** significa: olhando para o último ano, o dólar andou como se rendesse 14,19% ao ano de variação.

Mas — e isso é importante — **volatilidade não é constante**. Ela tem **memória**. Quando o mercado está nervoso, a volatilidade sobe e fica alta por semanas.

O **GARCH** (Generalized AutoRegressive Conditional Heteroskedasticity) é o modelo que captura essa memória. Ele diz: **'a volatilidade de hoje depende da vol de ontem'**.

E os parâmetros do D3 são claros:

- **α (alpha) = 0,0488**: 5% do choque de hoje vira vol amanhã.
- **β (beta) = 0,9418**: 94% da vol de hoje persiste amanhã.
- **ν (Student-t df) = 6,99**: caudas pesadas (Normal tem ν=∞).

Half-life do choque: **73,3 dias** (~3,5 meses). Isso é o tempo que um choque leva para decair pela metade.

Em mercados emergentes estressados, isso é coerente com a literatura."

---

### [25:00] Monte Carlo — 10 mil futuros possíveis

> *(projetando histograma de 10k paths)*

"Agora, quando o D3 diz **VaR 95% = R$ 6,43 bi em 6 meses** (refresh) ou **R$ 8,21 bi** (v2.0.1), como ele calcula isso?

Ele roda **10 mil simulações** de Monte Carlo — ou seja, **10 mil futuros possíveis** da PTAX em 6 meses. Cada simulação gera uma trajetória possível, com choques aleatórios mas respeitando a distribuição calibrada pelo GARCH.

Depois ele pergunta: **'em 5% dos futuros, qual é a perda máxima?'**. Essa é a VaR 95%.

E para o CVaR (Expected Shortfall): **'se passar do VaR, qual é a perda média?'**. É a cauda.

No D3 v2.0.1, com 4 choques correlacionados (PTAX + lítio + tariff + demanda), o **VaR = R$ 8,21 bi** e o **CVaR = R$ 10,14 bi**. A diferença entre eles — R$ 1,93 bi — é a 'espessura da cauda'."

---

### [27:30] Cauda Gorda — o que diferencia D3 de modelos antigos

> *(projetando distribuição com cauda gorda vs Normal)*

"Aqui está uma das peças mais importantes do D3 — e onde ele se diferencia de **90% dos modelos de risco** do mercado.

A maioria dos modelos usa a **distribuição Normal** (a 'curva de sino'). Ela diz: 'eventos a 3 sigmas têm 0,13% de chance'. Ou seja, 'isso NUNCA acontece'.

Mas isso é mentira — **para variáveis financeiras**.

O D3 usa **Student-t com ν = 6,99** (caudas pesadas). E atribui **curtose de 6** para o lítio (Normal tem curtose 0, log-normal tem 3).

O que isso significa na prática:

> **Eventos extremos — saltos de +50% no lítio, quebras de fornecedor, crises geopolíticas — acontecem 30-50% mais frequentemente do que a Normal sugere**.

O D3 alerta explicitamente no documento: 'a matemática tradicional está **subestimando** o perigo'.

É como construir um submarino pra aguentar certa pressão — mas instalar um painel avisando que a física do oceano lá fora opera com regras mais violentas."

---

### [29:00] Game Theory — NASH equilibrium com 5 players

> *(projetando payoff matrix 5x5)*

"Por fim, a peça mais contraintuitiva: como o D3 lida com **concorrência**.

Ele usa **Teoria dos Jogos** — especificamente o **equilíbrio de NASH**.

O mercado EV brasileiro tem **5 players**: BYD, Stellantis, GM, VW, Geely. Cada um pode escolher entre 2 estratégias: **Differentiate** (diferenciar produto) ou **Price War** (guerra de preços).

O NASH equilibrium é: **(Differentiate, Differentiate, Differentiate, Differentiate, Differentiate)** — todos diferenciam, ninguém entra em guerra de preços.

A contraintuição: **a BYD NÃO deve responder Stellantis com desconto**. Porque a guerra de preços destrói valor para **todos**.

ROI de guerra de preços: **-60% a -77%** (destrutivo).

*(pausa)*

É matemática, não opinião. O sistema calcula o limite racional e diz: 'aguenta, não entra em guerra'."

---

### [30:30] Gancho para o Capítulo 4

> *(fechando)*

"OK, então o sistema tem **GARCH para vol**, **Monte Carlo para distribuição**, **Student-t para caudas pesadas**, e **NASH para concorrência**.

Mas — e essa é a pergunta que todos fariam — **'como vocês sabem que esses números são reais?'**

Vocês testaram contra **eventos históricos**? Torturaram os dados até o framework quebrar? Ou só calibraram em condições calmas?

A resposta está no próximo capítulo."

**[FIM DO CAPÍTULO 3 — 10:00]**

---

# 📖 CAPÍTULO 4 — A JORNADA

## Título: "Como torturamos os dados até o framework quebrar"

**Duração**: 8 minutos.
**Tom**: storytelling + números.
**Recursos visuais**: 6 stress events + 5 recalibrações + 4 fixes.

---

### [33:00] Os 6 stress events — o tribunal do sistema

> *(projetando timeline 2020-2025 com eventos)*

"Para validar o sistema, a equipe fez o que chamamos de **'tortura dos dados'**: pegou **6 eventos reais** de estresse entre 2020 e 2025, e testou se o framework teria detectado cada um **antes** de acontecer.

| # | Evento | Período | Vol anual |
|---|---|---|---|
| 1 | **COVID-19** | 2020-03 a 2020-12 | 21,8% |
| 2 | **Semicondutor** | 2021-Q1 | 17,0% |
| 3 | **Election 2022** | 2022-08 a 2022-11 | 18,0% |
| 4 | **Lítio spike** | 2022-Q2 | 19,5% |
| 5 | **Election 2024** | 2024-08 a 2024-11 | 12,6% |
| 6 | **Stagflação 2025** | 2025-01 a 2025-12 | 10,3% |

E os resultados?

**5 de 5 PERFEITO.**

**TP 100%** (detectou todos os 6 eventos).
**FP 0%** (zero alarmes falsos).
**FN 0%** (zero eventos perdidos).
**Time-to-action 9,3 dias** (target era 14).

Mas — honestidade intelectual — isso foi **após** os 4 fixes. Antes, o sistema tinha **FP 14,8%** (1 em 7 alarmes era falso)."

---

### [35:30] Os 4 fixes — quando o sistema errou e como aprendeu

> *(projetando lista dos 4 fixes)*

"Aqui está a parte que me impressiona mais — e onde o sistema mostrou **anti-fragilidade**.

Quando os engenheiros identificaram que o **FP era 14,8%** (1 em cada 7 alarmes era falso), em vez de esconder, eles **documentaram** as 4 causas-raiz e implementaram 4 fixes:

| # | Fix | O que corrigiu | Categoria |
|---|---|---|---|
| 1 | **Hysteresis** | Sair de RED agora requer 2 semanas GREEN (não 1 dia) | Estrutural |
| 2 | **Carry-trade filter** | Se Brasil está recebendo dólar, RED cambial perde força | Operacional |
| 3 | **Lítio asymmetry** | Lítio abaixo de US$ 8k é **oportunidade** (BYD é compradora) | Domínio |
| 4 | **5-day confirmation** | RED só dispara após 5 dias consecutivos no threshold | Temporal |

Resultado: **FP 14,8% → 0%**.

E sabe o que é mais legal? O documento **lista abertamente** as 15 limitações que ainda existem. Não fingem perfeição.

A frase guia: **'qualquer framework que diz 100% acerto sem mostrar onde errou está mentindo ou não testou'**.

O D3 **mostra** os 4 erros que corrigiu. É o que dá credibilidade."

---

### [37:30] As 5 recalibrações — quando os dados atualizaram o modelo

> *(projetando tabela das 5 recalibrações)*

"Mas há outro detalhe crucial: **o modelo também foi recalibrado 5 vezes** com dados empíricos.

Entre jun/2026 e ago/2026, quando os dados públicos saíram, o framework foi atualizado:

| # | Parâmetro | Antes | Depois | Fonte |
|---|---|---|---|---|
| 1 | σ PTAX | 14,19% | **16,0%** | BCB SGS (10y, 2.509 obs) |
| 2 | vol 30d AMBER | 18% | **15%** | Realized 2024-2026 |
| 3 | vol 30d RED | 25% | **30%** | Realized 2020-2024 |
| 4 | h* Expansão | 30% | **35%** | Fastmarkets |
| 5 | Lítio baseline | US$ 10-12k | **US$ 22k** | Fastmarkets Jul/2026 |

E o efeito agregado: o **composite caiu de 71,8 para 50,3** — não porque o modelo piorou, mas porque o ambiente piorou. **O modelo agora reflete os realized risks**.

*(pausa)*

**Anti-fragilidade** em ação: o sistema **absorve** o stress empírico e fica mais preciso."

---

### [40:30] Gancho para o Capítulo 5

> *(fechando)*

"Então temos um sistema que passou em **6 stress events reais**, foi **5 vezes recalibrado** com dados públicos, e corrigiu **4 erros sistemáticos**.

Mas — e essa é a pergunta de **toda operação de chão de fábrica** — **'na prática, como isso funciona?'**

O sistema dispara ações no PowerPoint, ou **no chão da fábrica, em tempo real?**

É o que vamos ver agora."

**[FIM DO CAPÍTULO 4 — 8:00]**

---

# 📖 CAPÍTULO 5 — O CHÃO DE FÁBRICA

## Título: "Os 7 estágios físicos — onde o D3 toca o chão"

**Duração**: 10 minutos.
**Tom**: storytelling industrial, sem perder o rigor.
**Recursos visuais**: 7 estágios + mapeamento camadas.

---

### [41:30] A cadeia física — do porto ao cliente

> *(projetando fluxo dos 7 estágios)*

"Toda peça que sai do porto de Shanghai, e todo carro que chega ao cliente em Salvador-BA, passa por **7 estágios físicos**. Em cada estágio, o D3 toca o chão:

```
ESTÁGIO 1 — Porto de origem (Shanghai/Rotterdam)
  └─ contêiner 40HC, 26 toneladas, 45-60 dias porto-a-porto
   ↓
ESTÁGIO 2 — Recebimento + qualidade (Camaçari)
  └─ inspeção inbound, balança, scanner
   ↓
ESTÁGIO 3 — Armazenagem + kitting
  └─ WMS (Warehouse Management System) → kit por ordem de produção
   ↓
ESTÁGIO 4 — Sub-montagem SKD → CKD progressivo
  └─ Battery Pack → Powertrain → Body-in-White → Pintura → Trim
   ↓
ESTÁGIO 5 — Teste EOL (End-of-Line) + inspeção QA
  └─ OEE, downtime log, dyno test, water leak test
   ↓
ESTÁGIO 6 — Expedição + pátio de veículos
  └─ transporte para dealer regional (Salvador, Recife, Aracaju)
   ↓
ESTÁGIO 7 — Dealer → cliente final + pós-venda 24m
  └─ venda, financiamento, garantia, recall loop
   ↓
[LOOP] — Dados de campo voltam para a Layer 1 (telemetria, recalls)
```

O D3 não é só um sistema que opera **nessa cadeia** — ele **aprende** com ela. O loop final (Layer 5 LEARNING) recolhe telemetria e recalls que alimentam o modelo."

---

### [44:00] Caso real 14/jul — lítio explode

> *(projetando timeline 14/jul/2026 com eventos)*

"Vamos ver um caso real. **14 de julho de 2026**, terça-feira, 09:00.

| Hora | Evento |
|---|---|
| 09:00 | Lítio spot salta para US$ 22k/t (+83% vs baseline). |
| 09:01 | **Layer 1** ingere dado. |
| 09:02 | **Layer 2 SIGNAL** dispara threshold. |
| 09:05 | **Layer 3 DECISION** recalcula VaR conjunto S2×S10. |
| 09:10 | **Layer 4 ACTION** seleciona contra-medida (T-MV2). |
| 09:30 | **Head Supply + CFO** recebem alerta com NPV da ação. |
| 09:45 | Decisão executada — compra antecipada de lítio. |
| 14:00 | **Layer 5 LEARNING** atualiza baseline. |

Tempo total: **5 horas** da detecção à execução. Não 5 dias, não 5 semanas. **5 horas.**

Compare com a média histórica de **9,3 dias** entre detecção e ação.

A diferença: o sistema **obrigou** uma estrutura de decisão que antes não existia."

---

### [47:30] Caso real 07/abr — S7 kill switch

> *(projetando timeline 07/abr/2026)*

"Agora outro caso, mais dramático. **7 de abril de 2026**.

A BYD é incluída na **lista suja do Ministério do Trabalho** (MTE) após o resgate de 163 trabalhadores em dezembro de 2024.

A dimensão **S7 ESG dispara RED na hora**. E aqui está o poder do sistema:

**O composite trava em 95, fixo.**

Não importa se o câmbio está excelente, se a demanda está batendo recorde, se a tarifa está caindo. **S7 sobrepõe tudo.**

Consequência prática imediata:
- **R$ 800M+ de financiamento BNDES ficam inacessíveis** (lista suja bloqueia crédito público).
- **Plano R$ 1,68 bi é colocado em espera** até resolução.
- **AG-001** (resolver lista suja) vira **porta de entrada** obrigatória.

O sistema não estava preparado para evitar a crise — mas estava preparado para **detectar, classificar, e prescrever a resposta certa em horas**.

É o que se chama de **anti-fragilidade**: o sistema ganha com o caos, em vez de quebrar."

---

### [50:30] Gancho para o Capítulo 6

> *(fechando)*

"Então temos um sistema que detecta em **segundos**, decide em **minutos**, e executa em **horas**. Com **kill switch** para crises que sobrepõem tudo.

Mas — e essa é a pergunta organizacional — **quem decide o quê, em quanto tempo, com qual limite de gasto?**

Porque se o sistema dispara 'comprar R$ 100M em lítio', quem assina? O Risk Officer? O CFO? O Conselho? **Em quanto tempo?**

É o que vamos ver no próximo capítulo."

**[FIM DO CAPÍTULO 5 — 10:00]**

---

# 📖 CAPÍTULO 6 — QUEM DECIDE

## Título: "17 personas, 9 approval gates, 7 kill gates"

**Duração**: 8 minutos.
**Tom**: organizacional, claro.
**Recursos visuais**: Tabela RACI + gates.

---

### [51:30] As 17 personas — quem são e o que decidem

> *(projetando lista das 17 personas)*

"O D3 distribui responsabilidade entre **17 personas** mapeadas:

| Persona | Faixa de aprovação | Latência SLA |
|---|---|---|
| **CEO** | > R$ 280M (Board global) | 30 dias |
| **Conselho local** | R$ 100-280M | 7 dias |
| **CEO + Conselho** | > R$ 280M + S7 RED | 24h |
| **CFO** | R$ 30-100M | 72h |
| **CSO + CRO** | R$ 5-30M | 24h |
| **Risk Officer** | < R$ 5M | Imediato |

Note a **hierarquia clara**: quanto maior o valor, mais alta a aprovação.

E mais: cada persona tem **R+A+C+I** (RACI):
- **R**esponsible (executa).
- **A**ccountable (aprovador final).
- **C**onsulted (consultado).
- **I**nformed (informado).

Nada fica vago."

---

### [54:00] Os 9 approval gates — quem aprova quanto

> *(projetando tabela dos 9 gates)*

"Os **9 approval gates** organizam o fluxo:

| Gate | Valor | Aprovador | Latência |
|---|---|---|---|
| G1 | < R$ 5M | Risk Officer | Imediato |
| G2 | R$ 5-30M | CSO + CFO | 24h |
| G3 | R$ 30-100M | CEO | 72h |
| G4 | R$ 100-280M | Conselho local | 7 dias |
| G5 | > R$ 280M | Board global | 30 dias |
| G6-G9 | Casos especiais (bridge financing, LFP, lista suja, recalibração) | CEO + Conselho | 24h |

Cada decisão tem **dono, custo, deadline, KPI, gate, e SLA**. Nada fica 'em aberto'."

---

### [56:00] Os 7 kill gates — quando parar tudo

> *(projetando tabela dos 7 kill gates)*

"E os **7 kill gates** — são opostos dos approval gates. Eles **bloqueiam** ações em cenários extremos:

| Gate | Condição | Ação |
|---|---|---|
| **K1** | S7 RED (lista suja) | Pausar capex novo, freeze despesas |
| **K2** | 4-shock simultâneo (T-MV1) | Composite 95 fixo, freeze all |
| **K3** | CVaR breach > R$ 10,14 bi | Comitê de crise |
| **K4** | BNDES funding bloqueado > 90 dias | Plano B financiamento |
| **K5** | CATL outage > 30 dias | Plano B fornecedores |
| **K6** | PTAX > R$ 6,20 por 5 dias | Hedge 95% saturado |
| **K7** | Lista suja 2ª autuação | Reverter/reestruturar/hibernar |

K1 está **ATIVO desde 07/abr/2026** (lista suja). Bloqueia R$ 800M+ BNDES, e coloca AG-DIFF-1 e AG-DIFF-2 em espera."

---

### [58:30] Gancho para o Capítulo 7

> *(fechando)*

"Então temos um sistema de governança completo: **17 personas, 9 approval gates, 7 kill gates, e 25 ações** no action register.

Mas — e essa é a pergunta de honestidade intelectual — **o que esse sistema NÃO faz?**

Quais são as **limitações** que ele mesmo reconhece? O que ele **não cobre**?

Porque se a resposta for 'ele cobre tudo', desconfie. **Sistema que cobre tudo é sistema que não foi testado**.

Vamos ver."

**[FIM DO CAPÍTULO 6 — 8:00]**

---

# 📖 CAPÍTULO 7 — A HONESTIDADE

## Título: "10 limitações honestas — o que o D3 NÃO faz"

**Duração**: 8 minutos.
**Tom**: direto, sem rodeios.
**Recursos visuais**: lista das 10 limitações + cenários de não-implementar.

---

### [59:30] As 10 limitações que o D2-AUDIT documentou

> *(projetando lista das 10 limitações)*

"Antes de decidir se o D3 vale a pena, você precisa saber o que ele **NÃO** faz. **Honestidade intelectual** é a primeira coisa.

| # | Limitação | O que o D3 NÃO cobre |
|---|---|---|
| 1 | Não prevê o futuro | Detecta mudança, não prevê eventos |
| 2 | Cobertura em condições normais | Não cobre black swans (eventos fora da distribuição histórica) |
| 3 | 6 stress events é subamostrado | Estatisticamente ≥ 30 eventos para 95% de confiança |
| 4 | Dados públicos, não primários | Usa BCB, Fastmarkets, MSCI — não dados internos BYD |
| 5 | Composite é média ponderada | Não captura interações complexas de ordem 3+ |
| 6 | Game theory simplificado | NASH é 5 players × 2 strategies, sem sequential games |
| 7 | Macro é multiplier, não trigger | S6 reescala tudo, mas não dispara ações dedicadas |
| 8 | Layer 5 não totalmente operacional | Re-backtesting projetado, não re-rodado mensalmente |
| 9 | Counterfactual ainda OPEN | Não modela 'se não fizéssemos nada' (Gap 3.4) |
| 10 | S7 kill switch é decisão política | Sistema detecta, mas resolver depende de ação humana |

*(pausa)*

**Sistema perfeito não existe.** Mas sistema que documenta abertamente suas limitações é confiável."

---

### [62:30] Os 5 cenários de NÃO implementar

> *(projetando tabela de custos de inércia)*

"A pergunta que vem é: **'E se a gente NÃO implementar?'** Quanto custa a inércia?

| Cenário | Custo esperado |
|---|---|
| **Stress event material** (VaR 4-shock) | R$ 164M/ano (2% probabilidade × R$ 8,21 bi) |
| **Lista suja permanente** (cadeira Head ESG vaga há 137 dias) | R$ 200-400M/mês × 12 = R$ 2,4-4,8 bi/ano |
| **Hedge subdimensionado** (sem S1↔S3) | R$ 144M/ano |
| **Pricing defensivo sem break-even** (sem S3↔S4) | R$ 45M/ano |
| **War of attrition perdido** (sem NASH) | R$ 3-4 bi (NPV agregado) |
| **TOTAL de não-implementar** | **R$ 2,8 a 5,2 bi por ano esperado** |

Compare com o **investimento**: R$ 3M (Fases 1-3 do D3) + R$ 800k/ano operacional.

**ROI: 200×**. **Payback: menos de 1 mês** — um único evento médio paga o investimento inteiro."

---

### [65:30] A verdade sobre 5/5 PERFEITO

> *(projetando slide de honestidade)*

"E aqui está a verdade que **ninguém** fala quando diz '5/5 PERFEITO':

**5/5 PERFEITO NÃO significa 100% acerto sempre.**

Significa:
- O framework é **bem calibrado dentro do range testado**.
- **6 stress events** foram cobertos corretamente.
- **TP, FP, FN, time-to-action, accuracy** atingem target.

**Não significa**:
- Black swans estão cobertos (Pandemia global nova, guerra comercial total — não está).
- 6 eventos é estatisticamente robusto (rule of thumb pede ≥ 30 para 95% confiança).
- O sistema substitui julgamento humano.

A frase guia: **'qualquer framework que diz 100% acerto sem mostrar onde errou está mentindo ou não testou.'**

O D3 **mostra** os 4 erros que corrigiu — e lista as 10 limitações que tem. **Isso é o que dá credibilidade.**"

---

### [67:00] Gancho para o Capítulo 8

> *(fechando)*

"Então temos um sistema **limitado mas honesto**, com **ROI 200×** se implementado, e **R$ 2,8-5,2 bi/ano de custo de inércia** se não implementado.

Mas — e essa é a pergunta que move o Conselho — **'o que precisa ser feito AGORA?'**

Não 'o que o D3 faz'. **O que NÓS precisamos fazer.**

Vamos ver."

**[FIM DO CAPÍTULO 7 — 8:00]**

---

# 📖 CAPÍTULO 8 — A DECISÃO

## Título: "3 decisões em 5 minutos — o call to action"

**Duração**: 7 minutos.
**Tom**: executivo, decisivo.
**Recursos visuais**: CTA visual + cronograma 90 dias.

---

### [67:30] A pergunta certa

> *(olhando para a câmera, sem PowerPoint)*

"Chegamos ao fim. E a pergunta certa — a pergunta que move o Conselho — é:

> **'Vale a pena aprovar o D3?'**

A resposta é **sim, mas condicional**.

Sim, **porque**:
- R$ 3M investidos → R$ 200M+/ano de stress evitado → **ROI 200×**.
- **Payback < 1 mês** — um único evento médio paga.
- Backtesting 5/5 PERFEITO em 6 stress events reais.
- Honestidade intelectual sobre limitações dá credibilidade.

**Condicional a**:
- 4 cadeiras vagas serem preenchidas (CFO, CRO, CSO, Head ESG).
- Recalibração trimestral acontecer.
- Triggers serem automáticos (não manuais).

Se essas 3 condições forem verdade, **sim, vale a pena**."

---

### [69:00] As 3 decisões para o Conselho

> *(projetando tabela de 3 decisões)*

"O Conselho precisa decidir **3 coisas em 5 minutos**:

| # | Decisão | Custo | Benefício | Gate | Owner | SLA |
|---|---|---|---|---|---|---|
| **1** | **AG-001** Resolver lista suja MTE | R$ 25M | Destrava BNDES R$ 800M + tira kill switch | G2 | CFO | 30/set/2026 |
| **2** | **AG-003** Implementar hedge FX 95% | R$ 30M | Protege R$ 168M EBIT + VaR R$ 480M | G3 | CFO + Risk | 31/out/2026 |
| **3** | **Stress test mensal** (NB-06 seed=42) | R$ 0 | Mantém 5/5+ backtesting, ground-truth composite | G3 | Coord. Risco | Mensal |

**Custo total das 3**: R$ 55M.
**Benefício estimado**: R$ 200M+/ano de stress evitado.
**Payback**: < 1 mês."

---

### [71:00] O cronograma 90 dias

> *(projetando timeline de 6 ondas)*

"Se as 3 forem aprovadas, **6 ondas de 14 dias** até 30/nov/2026:

| Onda | Quando | Marco | NPV liberado |
|---|---|---|---|
| 1 | 22-ago → 04-set | 3 CTAs + Wave 1 outreach + 4 vagas LinkedIn | R$ 1,5M/45min + R$ 168M hedge |
| 2 | 06-set → 19-set | Recrutar Head ESG + 1º stress test + hedge contratado | R$ 200-400M NPV/mês recuperado |
| 3 | 20-set → 04-out | Recrutar CSO + matriz pricing + Wave 2 outreach | R$ 200M upside (demanda +20%) |
| 4 | 04-out → 18-out | 1º Backtesting Q3 + 2º stress test + Conselho 2/3 | Manter 5/5+, 87-92% SLAs |
| 5 | 15-nov | **Composite ≥ 65 AMBER** + 18/18 outreach + 1+ offer | Composite alvo atingido |
| 6 | 30-nov | Conselho 3/3 + 3 ships externos | Credibilidade externa |

A meta: **composite sai de RED (50,3) para AMBER (≥ 65) em 90 dias**."

---

### [73:00] A pergunta final

> *(olhando para a câmera)*

"A pergunta que vale a pena fazer não é 'vale a pena investir R$ 3M?' — essa resposta é **óbvia**.

A pergunta que vale a pena fazer é:

> **'Vale a pena correr o risco de NÃO investir, sabendo que cada mês sem o framework custa R$ 200-400M em valor destruído?'**

E a verdade é: **não ter o sistema é mais caro do que tê-lo**.

Se a próxima crise global estourar — e ela vai estourar, porque sempre estoura — sem o framework, a resposta é lenta, burocrática, sem owner. Com o framework, a resposta é **5 minutos, com custo calculado, com decisão rastreável**.

*(pausa)*

**A pergunta não é se vocês podem arcar com os R$ 3M. A pergunta é se vocês podem arcar com o impacto de R$ 8,21 bi sem o D3 lá pra defender a operação.**

É isso. A decisão é de vocês."

---

### [74:30] Encerramento

> *(projetando slide final com 5 números)*

"Muito obrigado por chegar até aqui. Esse foi o caminho do D2 ao D3 v2.0.2 — da fotografia estática ao sistema nervoso autônomo.

Se vocês quiserem se aprofundar, todos os documentos estão em **/analise-prescritiva/reports/decision-framework/** e a base didática está em **/d2-econometric-vulnerability/_study_notes/**.

Lembrem-se dos 5 números:

> **50,3** · **R$ 1,68 bi** · **5/5** · **R$ 3M → R$ 200M** · **9,3 dias**.

E lembrem-se da frase:

> **'Qualquer framework que diz 100% acerto sem mostrar onde errou está mentindo ou não testou.'**

Boa sorte, bons números, e até a próxima."

**[FIM DO ROTEIRO — 75 MINUTOS]**

---

# 🎯 APÊNDICE — Notas de Produção

## Skills aplicadas

| Skill | Onde foi usada | O que mudou |
|---|---|---|
| **`altitude-shifter`** | Cap 1 (analogia do exame de sangue), Cap 5 (analogia do submarino) | Re-pitching para RH sem perder rigor |
| **`humanizer`** | Tom geral, Cap 7 (honestidade) | Strip AI-isms, voz real |
| **`doubt-driven-development`** | Cap 4 (4 fixes), Cap 7 (5/5 não é 100%) | Falsear hipóteses progressivamente |

## Frases-chave a memorizar

1. "O D2 tirava a foto. O D3 decide o que fazer com ela." — Princípio central.
2. "Qualquer framework que diz 100% acerto sem mostrar onde errou está mentindo ou não testou." — Honestidade.
3. "5 de 5 PERFEITO NÃO significa 100% acerto sempre." — Calibração vs certeza.
4. "R$ 3M investidos vs R$ 2,8-5,2 bi/ano de inércia." — Custo de não-implementar.
5. "9,3 dias vs 60 minutos." — Tempo de resposta.

## Recursos visuais por capítulo

| Cap | Visual principal |
|---|---|
| 0 | 3 números-âncora + mapa de 8 estações |
| 1 | D2 vs D3 tabela + 4 falhas |
| 2 | 5 camadas + 11 dimensões + NPV table |
| 3 | GARCH band + MC histogram + payoff matrix |
| 4 | 6 stress events timeline + 4 fixes table |
| 5 | 7 estágios fluxo + caso real 14/jul |
| 6 | RACI table + 9 approval gates + 7 kill gates |
| 7 | 10 limitações + 5 cenários de não-implementar |
| 8 | CTA visual + cronograma 90 dias |

## Métricas canônicas a repetir

- **σ PTAX**: 14,19% (v1) / 14,41% (v2) / 14,86% (BCB 10y) / 16,0% (v2.0+ realized)
- **VaR 95% 6m**: R$ 2,10 bi (v1 empírico) / R$ 6,43 bi (v2 refresh) / **R$ 8,21 bi (v2.0.1 4-shock)**
- **CVaR 95% 6m**: R$ 1,44 bi (v1) / R$ 8,04 bi (v2) / **R$ 10,14 bi (v2.0.1)**
- **GARCH α/β/ν**: 0,0488 / 0,9418 / 6,99
- **Composite**: 71,8 (v2) → **50,3** (v2.0.2, RED Modo Crise)
- **NASH E3**: (Differentiate, Differentiate, Differentiate, Differentiate, Differentiate)
- **ROI**: 200×, payback < 1 mês
- **Backtesting**: **5/5 PERFEITO** (TP 100%, FP 0%, FN 0%, time-to-action 9,3d, accuracy 88,9%)

---

*Versão 1.0 — 25/ago/2026 — escrita como roteiro de apresentação técnica com 8 capítulos progressivos, ganchos entre seções, e honestidade intelectual.*

*Este roteiro usa as skills `altitude-shifter`, `humanizer`, e `doubt-driven-development` para garantir linguagem palatável ao RH sem perder robustez técnica.*

*Para executar como apresentação: usar como storyboard do slide deck + teleprompter.*

*Próximas etapas sugeridas:*
1. Criar **slides visuais** para cada capítulo (pode usar `frontend-slides`).
2. Gerar **audio narrado** para cada capítulo (pode usar `tts-audio-content` ou `mambo-tts`).
3. Criar **vídeo final** (pode usar `manim-video` para animações matemáticas).
4. Distribuir como **playlists separadas** por stakeholder (Conselho, COO, CFO, CRO, RH, Imprensa).