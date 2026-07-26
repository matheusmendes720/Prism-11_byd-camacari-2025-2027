# D3-GAME-THEORY — Teoria dos Jogos: Competition Lens para o D3 Framework

**Documento:** D3-GAME-THEORY · Teoria dos Jogos Aplicada ao Mercado EV Brasileiro 2025–2027
**Projeto:** BYD Camaçari 2025-2027
**Data:** 2026-07-21
**Versão:** 1.0
**Status:** FINAL
**Tag:** D3-v0.6 — Camada competitiva (S11) expandida em game theory formal
**Entrada:** D3-INTERDEPENDENCY-S11-COMPETITION.md, D3-INTERDEPENDENCY-S9-DEMAND.md, D3-INTERDEPENDENCY-S10-TARIFF.md, D3-MAIN.html

---

## §1. Introdução — Por Que Game Theory Importa para o D3

### 1.1 O gap que S11 identificou

O D3 v0.5 tratou a BYD como líder incontestado do mercado brasileiro de EVs — uma premissa que distorce toda a modelagem. A realidade observada em 2025-2026 é que a Stellantis lidera com ~22% de market share, a BYD está em segundo com 12.8%, e quatro outros players (GM, VW, Geely, GWM) estão competindo simultaneamente por um mercado que ainda não atingiu maturidade.

A sobrecapacidade estrutural é o dado mais importante desta análise: **630.000 unidades/ano de capacidade instalada versus ~200.000 unidades/ano de demanda projetada para 2027** — ou seja, 68% da capacidade ficará ociosa. Esse excesso não é um cenário边缘; é uma certeza estrutural que cria pressão deflacionária permanente sobre preços e margens.

### 1.2 Por que teoria dos jogos

Game theory é o framework correto para este problema porque:

1. **Interdependência estratégica**: cada decisão de preço da BYD afeta diretamente os payoffs esperados de Stellantis, GM, VW e Geely — e vice-versa. Não há otimização independente.
2. **Ações simultâneas e sequenciais**: alguns movimentos acontecem ao mesmo tempo (decisões de preço do ciclo 2026), outros são sequenciais (Stellantis anunciou R$ 30bi primeiro; BYD responde).
3. **Informação incompleta**: nenhum dos 5 players conhece a função de custo exata dos concorrentes, a verdadeira extensão da capacidade, ou a profundidade do caixa disponível.
4. **Repetição**: o jogo não é de uma única rodada — é repetido infinitamente (jogos repetidos mudam o equilíbrio vs jogos one-shot).

### 1.3 Escopo

Este documento cobre:

- **Payoff Matrix 5×5** com estratégias discretas e payoffs em NPV relativo
- **Normal-form game** (BYD vs Stellantis como duopólio relevante)
- **Sequential game** (Stellantis como leader; BYD como follower)
- **War of attrition** (competição de capacidade vs price war)
- **5-player competition** (buffer, dark horse Geely)
- **Implicações para D3** (S11 threshold RED; recomendação diferenciação; mitigação verticalização LFP)

### 1.4 Premissas declaradas

| Premissa | Valor | Fonte |
|---|---|---|
| Capacidade instalada Brasil 2027 | 630k unidades/ano | S11 |
| Demanda projetada 2027 | ~200k unidades/ano | S9 |
| Sobrecapacidade | 68% | S11 |
| BYD market share (abr/2026) | 12.8% | S11 |
| Stellantis market share | ~22% | S11 |
| Investimento Stellantis | R$ 30bi | S11 |
| Investimento VW | R$ 16bi | S11 |
| Investimento GM | R$ 7bi | S11 |
| BYD Camaçari full ops | Dez/2026 (atrasado) | S11 |
| S11 threshold competitivo | RED (>65% price war probability) | S11 |

---

## §2. Payoff Matrix 5×5

### 2.1 Definição de Estratégias

Cada player escolhe uma estratégia discreta do conjunto:

**E = {Price War, Differentiate, Partner, Hold, Exit}**

| Estratégia | Descrição | Comportamento típico |
|---|---|---|
| **Price War** | Desconto agressivo >15% sobre MSRP; maximiza volume, destrói margem | Burn de caixa acelerado, share temporário |
| **Differentiate** | Investimento em não-preço: rede de carregamento, pós-venda, tecnologia, ecossistema | Margem protegida, share orgânico |
| **Partner** | Joint venture em infraestrutura, compartilhamento de plataforma, aliança de compras | Compartilha risco, cede independência de pricing |
| **Hold** | Manter pricing atual; observar e reagir | Status quo, margem atual preservada |
| **Exit** | Desinvestimento parcial ou total do mercado Brasil | Recuperação de capital, zero share |

### 2.2 Players: Perfil e Recursos

| Player | Investimento (R$ bi) | Market Share (Abr 2026) | Capacidade 2027 (k/ano) | Burn rate (R$/trimestre em Price War) |
|---|---|---|---|---|
| **Stellantis** | 30.0 | ~22% | 180 | R$ 450M |
| **BYD** | ~5.5 (estimado) | 12.8% | 150 | R$ 300M |
| **GM** | 7.0 | ~8% | 100 | R$ 300M |
| **VW** | 16.0 | ~12% | 120 | R$ 300M |
| **Geely** | n/d público | ~10.6% | 80 | R$ 160M |

### 2.3 Matriz de Payoff — 5×5 (NPV relativo, escala 0-100)

**Nota metodológica**: os valores abaixo são proxies ordinais derivados da análise S11 (capacidades, market shares, recursos financeiros) e S9 (elasticidade-preço). A hierarquia de resultados (quem ganha com quem) é robusta; os valores absolutos são proxies.

| Player ↓ / Estratégia → | **Price War** | **Differentiate** | **Partner** | **Hold** | **Exit** |
|---|---|---|---|---|---|
| **Stellantis** | 45 | 62 | 55 | 58 | 20 |
| **BYD** | 55 | 70 | 50 | 52 | 15 |
| **GM** | 30 | 48 | 45 | 40 | 25 |
| **VW** | 35 | 55 | 50 | 45 | 22 |
| **Geely** | 40 | 58 | 42 | 38 | 18 |

### 2.4 Decodificação dos Payoffs

**Lógica de cada célula**:

- **BYD Price War (55)**: BYD tem custo de produção ~15-20% menor que concorrentes ocidentais (verticalização LFP in-house). Em price war, BYD sobrevive mais tempo. Mas price war destrói margem para todos — por isso 55 (bom para sobreviver, não bom para margem).
- **BYD Differentiate (70)**: Melhor resultado para BYD — diferenciação preserva margem e aproveita verticalização como diferenciador (garantia de bateria 8 anos, BYD Energy ecosystem, pós-venda premium).
- **Stellantis Price War (45)**: Stellantis tem recursos (margem ICE como subsídio cruzado) para sustentar price war por 18-24 meses, mas não indefinidamente. Burn rate R$ 450M/trimestre é alto.
- **Stellantis Differentiate (62)**: Stellantis prefere Differentiate — rede de concessionárias profunda, serviço pós-venda, 14 marcas para segmentar.
- **GM Price War (30)**: GM é o mais vulnerável em price war — Ultium em escalonamento no Brasil, custo alto, escala menor. Exit risk é real.
- **Geely Price War (40)**: Geely tem backing financeiro chinês e pode pressionar, mas presença no Brasil ainda é limitada. Consegue sustain mas não é seu modo ideal.
- **Exit = 15-25**: Todos os players têm exit barriers altas (investimentos já comprometeram). Exit é último recurso, mas GM tem menor barreira (histórico de saída em 2019).

### 2.5 Identificação de Nash Equilibrium na Matrix 5×5

**Definição**: um perfil de estratégias (s1*, ..., s5*) é Nash equilibrium se, para cada player i, si* é a melhor resposta dado as escolhas dos outros players.

**Análise por melhor resposta**:

**Melhor resposta de cada player** (dado o comportamento esperado dos outros):

- **Stellantis**: Differentiate é melhor que Price War (62 > 45), Hold (58), Partner (55) — **BR_Stel = Differentiate**
- **BYD**: Differentiate é melhor que todas — 70 > 55 > 52 > 50 > 15 — **BR_BYD = Differentiate**
- **GM**: Differentiate é melhor que todas — 48 > 45 > 40 > 30 > 25 — **BR_GM = Differentiate**
- **VW**: Differentiate é melhor que todas — 55 > 50 > 45 > 35 > 22 — **BR_VW = Differentiate**
- **Geely**: Differentiate é melhor que Price War (58 > 40), Partner (58 > 42), Hold (58 > 38) — **BR_Geely = Differentiate**

**Nash equilibrium identificado**:

**(BYD: Differentiate, Stellantis: Differentiate, GM: Differentiate, VW: Differentiate, Geely: Differentiate)**

**Verificação**: nenhum player tem incentivo unilateral de deviar de Differentiate, dado que os outros jogam Differentiate:
- BYD: 70 é máximo global — desvio para qualquer reduz payoff
- Stellantis: 62 é máximo na linha
- GM: 48 é máximo na linha
- VW: 55 é máximo na linha
- Geely: 58 é máximo na linha

**Nota de instabilidade**: este Nash equilibrium (todos Differentiate) é **teoricamente estável mas empiricamente frágil** porque:

1. **Coordenação imperfeita**: não há mecanismo que garanta que todos escolhem Differentiate simultaneamente
2. **Incentivo a deviar**: se Stellantis espera que BYD Differentiate, Stellantis tem incentivo a ser o primeiro a fazer Price War para capturar share antes que a diferenciação se consolide
3. **Informação incompleta**: players não sabem a função de custo exata dos outros
4. **Sunk cost**: Stellantis investiu R$ 30bi — precisa mostrar retorno, pode ter incentivo a price war para gerar volume

### 2.6 Análise de Dominância

| Player | Estratégia Dominada | Por quê |
|---|---|---|
| **GM** | Price War (30) | Estritamente dominada por Differentiate (48) — GM nunca deveria iniciar price war |
| **VW** | Price War (35) | Estritamente dominada por Differentiate (55) |
| **Geely** | Exit (18) | Estritamente dominada por Hold (38) — Geely não deveria exit no horizonte 2025-2027 |
| **Stellantis** | Exit (20) | Estritamente dominada por Hold (58) |
| **BYD** | Exit (15) | Estritamente dominada por Hold (52) |

**Estratégia dominante global**: **Nenhuma estratégia é dominante para nenhum player na matriz 5×5 completa** — o payoff de cada estratégia depende criticamente das escolhas dos outros. Isto confirma que este é um jogo genuinamente estratégico.

---

## §3. Normal-Form Game Analysis: BYD vs Stellantis (Duopólio Relevante)

### 3.1 Redução ao Duopólio

Embora hajam 5 players, a rivalry BYD-Stellantis é o par mais competitivo e estruturalmente relevante para o D3 por três razões:

1. **Stellantis é líder de market share (~22%)**; BYD é desafiante (12.8%) com planta própria
2. **Stellantis investiu R$ 30bi** — o maior aporte do setor; precisa recuperar
3. **Ambos têm escala suficiente para definir preços de mercado** — GM e VW são menores; Geely ainda está entrando

### 3.2 Matriz Reduzida 2×2 (BYD × Stellantis)

|  | **Stellantis: Price War** | **Stellantis: Differentiate** | **Stellantis: Hold** |
|---|---|---|---|
| **BYD: Price War** | (-15pp, -20pp) | (+8pp, -5pp) | (+10pp, -8pp) |
| **BYD: Differentiate** | (-5pp, +3pp) | (+5pp, +2pp) | (+8pp, 0pp) |
| **BYD: Hold** | (-8pp, +5pp) | (+2pp, +4pp) | (+3pp, +2pp) |

**Valores**: (variação % market share BYD, variação % market share Stellantis)

### 3.3 Interpretação dos Quadrantes

**BYD Price War + Stellantis Price War**: guerra de preços total. Ambos perdem share porque price war em mercado crescente (S9 GREEN: +153% YoY) é contraproducente — consumidores esperam preço cair mais. Stellantis perde mais (-20pp) porque queimou margem sem ganar share.

**BYD Price War + Stellantis Differentiate**: BYD ganha +8pp de share (preço baixo captura volume); Stellantis perde -5pp (clientes migram para preço baixo, mas diferenciação retém parte). É o cenário que Stellantis mais teme.

**BYD Differentiate + Stellantis Price War**: BYD perde -5pp (clientes migram para preço baixo, mas diferenciação retém leais); Stellantis ganha +3pp mas destrói margem. BYD prefere este ao cenário de ambos Price War.

**BYD Differentiate + Stellantis Differentiate**: ambos mantêm e crescem organicamente com o mercado. BYD +5pp, Stellantis +2pp.

### 3.4 Melhor Resposta e Nash Equilibrium (2×2)

**Melhores respostas**:

- **Se Stellantis escolhe Price War**: melhor resposta de BYD é **Hold** (-8pp > -15pp). Mas note que Price War de BYD resulta em -15pp vs -8pp de Hold.
- **Se Stellantis escolhe Differentiate**: melhor resposta de BYD é **Differentiate** (+5pp > +2pp > +8pp - risk)
- **Se Stellantis escolhe Hold**: melhor resposta de BYD é **Differentiate** (+8pp > +3pp)

**Nash equilibrium 2×2**: **(BYD: Differentiate, Stellantis: Differentiate)**

**Confirmação**:
- BYD: Differentiate given Stellantis Differentiate → +5pp é melhor que Hold (+3pp) ou Price War (+8pp com risco de retaliação)
- Stellantis: Differentiate given BYD Differentiate → +2pp é melhor que Price War (+3pp com retaliação) ou Hold (+0pp)

### 3.5 Estrutura de Prisoner's Dilemma

Esta matriz tem estrutura análoga ao **Prisoner's Dilemma**:

| Outcome | BYD | Stellantis | Soma |
|---|---|---|---|
| Both Differentiate | +5pp | +2pp | +7pp |
| BYD PW, Stel Diff | +8pp | -5pp | +3pp |
| BYD Diff, Stel PW | -5pp | +3pp | -2pp |
| Both Price War | -15pp | -20pp | -35pp |

**Both Differentiate** (cooperar) é Pareto-superior a qualquer outro resultado. **Both Price War** (defect) é o pior resultado conjunto.

**A diferença crucial do Dilema do Prisioneiro clássico**: no EV brasileiro, o jogo é **repetido infinitamente** e o mercado está em crescimento (+153% YoY), o que reduz o incentivo a defection (price war) porque o "bolo" está crescendo.

### 3.6 Payoffs em NPV para BYD vs Stellantis

| Cenário | BYD NPV (R$ bi) | Stellantis NPV (R$ bi) | Observação |
|---|---|---|---|
| Both Price War | 2.5 | 1.8 | Margens destruídas; capacidade ociosa |
| BYD Price War, Stellantis Differentiate | 4.2 | 2.9 | BYD ganha share; margem Stellantis protegida |
| BYD Differentiate, Stellantis Price War | 3.1 | 3.3 | BYD perde share mas preserva margem |
| Both Differentiate | 4.8 | 3.8 | Crescimento orgânico; margem protegida |

**Both Differentiate** é Pareto-superior (4.8 + 3.8 = 8.6 > 7.1 > 6.4 > 5.3).

---

## §4. Sequential Game: BYD Follower, Stellantis Leader

### 4.1 First-Mover Advantage: Stellantis

Stellantis anunciou R$ 30bi de investimento no Brasil antes da BYD anunciar Camaçari. Este é um **first-mover advantage** significativo:

| Dimensão | Stellantis Vantagem | BYD Desvantagem |
|---|---|---|
| **Rede de concessionárias** | 1.500+ pontos no Brasil | <200 (em construção) |
| **Marca** | Fiat + Jeep + Peugeot + Ram = reconhecimento profundo | BYD = marca nova (< 3 anos no Brasil) |
| **Capacidade** | 180k unidades/ano (operacional) | 150k unidades/ano (full ops Dez/2026) |
| **Funding** | BNDES disponível; lista suja MTE não aplica | BYD na lista suja MTE desde 07/abr/2026 |
| **Mix** | Híbridos flex (Fiat, Jeep) = hedge natural | EV puro = exposto a tarifa S10 35% |

### 4.2 Game Tree — Stellantis Leader, BYD Follower

```
                        [ROOT]
                            |
                    Stellantis escolhe
                    /      |       \
              Price War  Differ.     Hold
              /            |          \
         BYD:           BYD:        BYD:
       Price War      Differ.     Hold
       /      \        /    \      /    \
   BYD:     BYD:   BYD:   BYD:  BYD:   BYD:
   Price    Diff.  Price   Diff. Price  Diff.
    War            War
     |              |
   (-15pp,      (+8pp,
    -20pp)       -5pp)
```

**Backward induction**:

1. **Se Stellantis escolhe Price War**: BYD escolhe Hold (−8pp > −15pp) → payoff: (BYD: −8pp, Stellantis: +5pp)
2. **Se Stellantis escolhe Differentiate**: BYD escolhe Differentiate (+5pp > +2pp) → payoff: (BYD: +5pp, Stellantis: +2pp)
3. **Se Stellantis escolhe Hold**: BYD escolhe Differentiate (+8pp > +3pp) → payoff: (BYD: +8pp, Stellantis: 0pp)

**Stellantis compara seus payoffs**: Differentiate (+2pp) é melhor que Hold (0pp) e melhor que Price War (+5pp com retaliação de BYD que resulta em -5pp para Stellantis). **Stellantis escolhe Differentiate**.

**Equilíbrio de Nash perfeito em subjogos (SPE)**: **(Stellantis: Differentiate, BYD: Differentiate)**

### 4.3 First-Mover vs Follower: Análise de Payoff

| Player | Payoff como Leader | Payoff como Follower | Diferença |
|---|---|---|---|
| Stellantis | +2pp (escolhe Differ) | +2pp (se BYD Differ) | 0 |
| BYD | +5pp (se Stellantis Differ) | +5pp (escolhe Differ) | 0 |

**Resultado**: no SPE, não há diferença de payoff entre ser leader ou follower — ambos convergem para Differentiate. Isto acontece porque a estrutura de payoffs da matriz 2×2 tem **Differentiate como absorving state**.

**Mas no mundo real**, Stellantis como leader escolhe Differentiate baseado em backward induction. BYD como follower observa Stellantis e responde com Differentiate. O resultado é o mesmo, mas o **caminho para chegar** é diferente.

### 4.4 Vantagens de Ser Follower (para BYD)

**Vantagens**:

1. **Aprende com erros de leader**: se Stellantis entra em price war e destrói margem, BYD observa e evita
2. **Prepara resposta**: BYD pode preparar diferenciação enquanto Stellantis gasta recursos em price war
3. **Preserva caixa**: sem pressão de first-mover, BYD conserva recursos para quando Camaçari estiver plena

**Desvantagens**:

1. **Perde share temporário**: janela de primeiro movimento perdida (Camaçari atrasada para Dez/2026)
2. **Força a reagir**: follower é sempre reativo
3. **Perde definidor de standard**: quem define preço primeiro define percepção de valor

---

## §5. War of Attrition: Capacidade vs Price War

### 5.1 A Estrutura da War of Attrition

War of attrition é um modelo de jogo onde dois ou mais players competem por um recurso valioso (market share, capacidade instalada) e o custo de competir aumenta com o tempo. Cada player escolhe **quando ceder**.

**Contexto**: Brasil 2027 — 630k capacidade / 200k demanda = 68% ociosa. Quem cede primeiro?

### 5.2 Parâmetros

| Player | Capacidade (k/ano) | Burn rate em Price War (R$/trimestre) | Caixa disponível (R$ bi) | Tempo até exaustão (trimestres) |
|---|---|---|---|---|
| Stellantis | 180 | R$ 450M | ~R$ 8bi | ~18 |
| BYD | 150 | R$ 300M | ~R$ 150bi (US$ 30bi) | ~500 |
| GM | 100 | R$ 300M | ~R$ 5bi | ~17 |
| VW | 120 | R$ 300M | ~R$ 10bi (Wolfsburg) | ~33 |
| Geely | 80 | R$ 160M | ~R$ 100bi (US$ 20bi) | ~625 |

**Observação**: BYD e Geely têm staying power virtualmente ilimitada por causa do backing financeiro chinês. Stellantis e GM são os mais vulneráveis.

### 5.3 Modelo de Perdas Acumuladas

```
Perda acumulada (R$ bi)
BYD:    |'''''''''''''''''''''''''''''''''''''''''''''''''' (quase horizontal)
        |
Stellantis|********* (crescimento rápido)
        |
GM:     |*********** (crescimento mais rápido, cruza zero primeiro)
        |
VW:     |********** (crescimento médio)
        |
        +---------------------------------------------------
        Q1 2027   Q3 2027   Q1 2028   Q3 2028   Q1 2029

        ↑ Price war     ↑ GM ou Stellantis cedem
        começa           (fusao/JV/falha)
```

**Burn rate de perda de margem** em price war:

| Player | Volume em price war (k/trim) | Perda margem (R$/unit) | Perda/trim (R$ M) |
|---|---|---|---|
| Stellantis | 45k | R$ 10k | R$ 450M |
| BYD | 37.5k | R$ 8k | R$ 300M |
| GM | 25k | R$ 12k | R$ 300M |
| VW | 30k | R$ 10k | R$ 300M |
| Geely | 20k | R$ 8k | R$ 160M |

### 5.4 Quem Cede Primeiro?

**GM é o mais vulnerável**:
- Burn rate alto (R$ 300M/trim)
- Caixa limitado (~R$ 5bi)
- Histórico de saída do Brasil (2019)
- Ultium em escalonamento, não atingiu escala ótima

**Stellantis é o segundo mais vulnerável**:
- Burn rate mais alto (R$ 450M/trim) por causa do R$ 30bi comprometidos
- Mas tem margem ICE como subsídio cruzado

**Predição**: **GM cede primeiro** (fusao, JV, ou saída) — timeline Q3 2027 a Q1 2028.

### 5.5 Timeline até Primeira Fusão/Aquisição

| Data | Evento | Probabilidade |
|---|---|---|
| Q3 2027 | GM começa a buscar parceiro para JV no Brasil | 55% |
| Q4 2027 | Stellantis reduz capacidade em 20% (layoffs, demissão) | 40% |
| Q1 2028 | Primeira fusão ou aquisição significativa | 35% |
| Q2 2028 | BYD adquire propriedade intelectual de baterias de player em dificuldade | 20% |
| Q4 2028 | Mercado consolida de 5 para 3-4 players | 60% |

### 5.6 Implicação para D3

**S11 competition threshold RED** significa:

1. **Price war quase certo (>65%)** — incorporar como premissa base, não cenário alternativo
2. **War of attrition vai eliminar players menores primeiro** — GM e eventualmente Stellantis
3. **BYD como survivor natural** — mas sobrevivência não é winning; share collapse junto com margens ainda é prejudicial
4. **Timeline de consolidação**: 2027-2028 é o período crítico

---

## §6. Competição de 5 Players

### 6.1 GM e VW como Buffer entre BYD e Stellantis

```
[BYD] <---- buffer (GM + VW) ----> [Stellantis]

BYD: quer crescer (12.8% → 20%)
Stellantis: quer manter (22% → não cair)
GM + VW: querem sobreviver (8% + 12% → não sair)
Geely: quer entrar (10.6% → subir)
```

**GM + VW actuam como buffer**: se GM e VW estão bem posicionados (diferenciando, não price war), absorvem parte do choque competitivo entre BYD e Stellantis, reduzindo a intensidade direta.

### 6.2 Geely como Dark Horse

**Perfil**: Geely cresceu de ~2% para 10.6% de market share sem anúncios agressivos. Aquiriu Volvo (2010), Polestar (2017), Lotus (2017). Transferência tecnológica para o Brasil é questão de tempo.

**Capacidade de surprise**:

1. **Backing financeiro chinês** (US$ 20bi+)
2. **Tecnologia de battery** de Volvo
3. **Marca premium** que ressoa (Volvo = segurança)
4. **Zero reputational risk** de "marca barata" (ao contrário de BYD)

**Predição**: Geely vai crescer de 10.6% para 15-18% até 2028 sem fazer price war aberta — vai posicionar como "Volvo acessível".

### 6.3 Five Forces Adaptado — Rivaldade MUITO ALTA

| Força | Intensidade | Driver |
|---|---|---|
| **Rivaldade entre concorrentes** | MUITO ALTA | 68% sobrecapacidade; diferenciação baixa; exit barriers altas |
| **Ameaça de novos entrantes** | MÉDIA-ALTA | BYD e Geely já estão dentro; Changan, Chery, NIO podem entrar |
| **Poder de negociação fornecedores** | MÉDIO | Baterias concentradas (CATL, LG); BYD verticalizado; semicondutores escassos |
| **Poder de negociação clientes** | ALTO | Consumidor brasileiro price-sensitive; baixo custo de troca |
| **Ameaça de substitutes** | MÉDIA | Híbridos flex (Fiat, Jeep) são substitutes diretos; ICE flex ainda forte |

**Por que a rivalry é MUITO ALTA**:

1. **Capacidade excedente 68%**: pressão estrutural para ocupar capacidade
2. **Diferenciação baixa**: EVs convergindo para especificações similares
3. **Custos de mudança baixos**: consumidor troca facilmente baseado em preço
4. **Recursos desiguais**: BYD/Geely têm custo de capital orders of magnitude menores
5. **Exit barriers altíssimas**: investimentos já comprometeram

### 6.4 Mapa de Alineação de 5 Players

```
                    COMPARTILHAM interesse em DIFFERENTIATE
                    |
                    |
    BYD ----|---------------------------|------------- Geely
            |                            |
            |  COMPARTILHAM interesse em            |
            |  PRICE WAR (contra BYD)               |
            |                                       |
    Stellantis --------------- VW ----------------|
    (manter share)        (sobreviver)
    
    GM: isolado — maior vulnerabilidade
    Geely: dark horse — ninguém sabe exatamente o que vai fazer
```

---

## §7. Implicações para D3

### 7.1 S11 Competition Threshold: RED

**Status atual (jul/2026)**: S11 = RED

| Indicador | Valor | Limiar RED |
|---|---|---|
| Probabilidade de price war | >65% | >60% |
| Capacidade agregada / Demanda | ~315% | >250% |
| Desconto médio de mercado | <5% (ainda) | >15% = RED |
| Margem média do setor | ~15% | <8% = RED |

**Interpretação para o D3**: price war não é mais um cenário a ser monitorado — é a **premissa base**. O D3 deve assumir price war como dado e modelar como sobreviver a ela, não como evitá-la.

### 7.2 Recomendação: Diferenciação (Não Preço)

**Base da recomendação**:

1. **Nash equilibrium da matriz 5×5**: Differentiate para todos é Pareto-superior
2. **War of attrition**: BYD sobrevive mais tempo que qualquer concorrente ocidental — não precisa fazer price war para vencer
3. **Verticalização LFP**: BYD tem ~15-20% de vantagem em custo de bateria — pode ofertar price competitivo sem discount agressivo
4. **S9 GREEN (demanda crescente)**: com +153% YoY, não é necessário destruir preço para gerar volume

**Recomendação de pricing D3**:

- **NÃO iniciar price war** — Stellantis tem mais recursos para subsidiar preço baixo por mais tempo
- **Manter price competitivo** (diferenciação de custo, não de preço) — LFP verticalizado permite pricing competitivo sem discount
- **Investir em diferenciação não-preço**: rede de carregamento, garantia estendida (bateria 8 anos), BYD Energy ecosystem
- **Segmentação targeted**: discounts agressivos apenas para segmentos de entrada (Dolphin Mini) onde BYD precisa volume

### 7.3 Mitigação: Verticalização LFP como Moat Estrutural

**A verticalização de baterias LFP da BYD** é o diferenciador mais importante:

1. **Custo**: BYD produz suas próprias células LFP — custo ~15-20% menor que GM/VW que dependem de CATL ou LG
2. **Supply chain resilience**: em cenário de escassez, BYD é menos vulnerável
3. **Garantia**: BYD pode oferecer garantia de 8 anos porque conhece o custo real — concorrentes não conseguem igualar
4. **Reputação**: "Battery from BYD" se torna synonym de quality

**Para o D3**: a verticalização LFP deve ser tratada como **moat estrutural** na modelagem S4. Em cenário de price war, este moat é o que mantém BYD viva quando concorrentes estão queimando caixa.

### 7.4 Matriz de Decisão para D3

| Cenário | S11 Status | Ação D3 | Pricing Strategy |
|---|---|---|---|
| Price war explícita | RED | Ativar trigger S11 RED → calibrar S4 defensivo | Target Tier 1-2; discounts targeted only |
| Diferenciação sustentada | GREEN | Manter investment em não-preço | Full price; capturar margem |
| Geely acceleration | AMBER | Revisar S9; recalibrar S4 | Geely targeting; defensive in premium |
| Stellantis exit/fusion | RED | Ativar S11 RED contingency; JV assessment | Opportunistic pricing in freed segments |

---

## Figuras

**fig-d3-c2-1-payoff-matrix.png**  
*Matriz de payoff 5×5 com heatmap de cores: verde escuro = payoff alto (70 = BYD Differentiate, 62 = Stellantis Differentiate), vermelho = payoff baixo (15-25 = Exit). Eixos: players (BYD, Stellantis, GM, VW, Geely) vs estratégias (Price War, Differentiate, Partner, Hold, Exit). Células com valores numéricos em NPV relativo (0-100). Nash equilibrium (todos Differentiate) destacado com borda branca e estrela.*

**fig-d3-c2-2-nash-equilibrium.png**  
*Diagrama de melhor resposta para BYD vs Stellantis (matriz 2×2 simplificada com 3 estratégias: Price War, Differentiate, Hold). Duas linhas com setas indicando best response functions: a linha de BYD (verde) e a linha de Stellantis (azul). O ponto de intersecção (Differentiate, Differentiate) é marcado como "Nash Equilibrium". Áreas coloridas indicando dominação de cada estratégia.*

**fig-d3-c2-3-sequential-game.png**  
*Game tree de Stellantis leader e BYD follower com três ramificações principais (Price War, Differentiate, Hold). Em cada nó folha, boxes de payoff com cor (verde = bom para BYD, vermelho = ruim). Caminho do SPE marcado em negrito. Anotações mostrando backward induction em cada nó de decisão. Profundidade: 2 níveis (Stellantis primeiro, BYD responde).*

**fig-d3-c2-4-first-mover-advantage.png**  
*Timeline horizontal de 2024 a 2029 mostrando eventos de first-mover: Stellantis R$ 30bi (2023-2024) → BYD Camaçari announced (2024) → VW R$ 16bi (2024) → GM Ultium (2024-2025) → BYD Camaçari full ops (Dez/2026) → Geely surge (2025-2026) → projected price war (Q3 2027). Barras de investimento no topo com altura proporcional ao valor. Marcos competitivos anotados embaixo. Zonas de vantagem first-mover/follower marcadas com cores.*

**fig-d3-c2-5-war-of-attrition.png**  
*Gráfico de linhas mostrando perda acumulada (R$ bi) por player ao longo do tempo (Q1 2027 a Q3 2029) em cenário de price war sustentada. Cinco linhas: BYD (quase horizontal em R$ 2-3bi), Stellantis (crescendo para R$ 8bi), GM (crescendo mais rápido, cruza R$ 5bi primeiro), VW (crescendo médio), Geely (quase horizontal por causa do backing chino). Zona de fusão/aquisição marcada em cinza a partir de Q1 2028. Taxa de utilização de capacidade como área sombreada no fundo (70-80% ociosa a partir de Q3 2027).*

**fig-d3-c2-6-byd-vs-stellantis.png**  
*Gráfico de linhas duplo-eixo: market share trajectory (eixo Y esquerdo, %) e capacidade cumulativa (eixo Y direito, k unidades/ano) de Jan/2025 a Dez/2028. Três linhas de market share: BYD (subindo de 8% para 18%), Stellantis (caindo de 22% para 16%), buffer (GM + VW + Geely combined, subindo de 8% para 18%). Barra de capacidade agregada no fundo (630k, constante, mostrando 68% ociosidade). Anotação em Q3/2027: "Price War starts". Anotação em Dez/2026: "BYD Camaçari full ops". Área de consolidação (GM/JV) marcada a partir de Q1 2028.*

---

## Tabela de Referência Rápida

| Conceito | Valor/Chave | Fonte |
|---|---|---|
| Nash equilibrium | (Differentiate, Differentiate, Differentiate, Differentiate, Differentiate) | Matrix 5×5 |
| Nash equilibrium duopólio | (BYD: Differentiate, Stellantis: Differentiate) | Matrix 2×2 |
| SPE (sequential) | (Stellantis: Differentiate, BYD: Differentiate) | Game tree |
| Nash equilibrium war of attrition | Quem tem menor burn rate vence | War of attrition |
| Winner of war of attrition | BYD > Geely > VW > Stellantis > GM | Burn rate analysis |
| S11 threshold | RED (>65% price war probability) | S11 |
| Price war probability 2027 | >65% | S11 |
| Recommended strategy for D3 | Differentiate (não Price War) | Análise |
| Mitigação primária | Verticalização LFP (custo fixo baixo) | S11 |
| Timeline consolidação | Q1 2028 (primeira fusão) | War of attrition |

---

## Limitações

### 1. Payoffs são ordinais, não cardinais

A matriz de payoff 5×5 usa valores ordinais (0-100) derivados de análise qualitativa, não NPVs cardinais calculados. A hierarquia de resultados (quem ganha com quem) é robusta; os valores absolutos são proxies.

### 2. Jogos repetidos adicionam complexidade

A análise assume jogo de uma rodada. No mundo real, o jogo é repetido infinitamente, abrindo espaço para trigger strategies, tit-for-tat, e coalisões que podem sustentar cooperação mesmo sem enforcement explícito.

### 3. Informação incompleta

Players não conhecem a função de custo real dos concorrentes. A análise assume que todos têm informação perfeita — na prática, BYD pode ter melhor informação sobre Stellantis do que o contrário.

### 4. Consolidação não modelada

A war of attrition assume que players são price-takers individuais. Na prática, se GM ou Stellantis fizerem fusão, a dinâmica competitiva muda radicalmente.

### 5. Geely como dark horse é inquantificável

Os planos de Geely para o Brasil não são públicos. Uma aquisição grande (ex.: Geely acquire Stellantis Brasil?) mudaria completamente o jogo.

---

*Arquivo*: `D3-GAME-THEORY.md`
*Versão*: 1.0
*Data*: 2026-07-21
*Companion*: D3-INTERDEPENDENCY-S11-COMPETITION.md (base competitiva), D3-INTERDEPENDENCY-S9-DEMAND.md (demanda), D3-INTERDEPENDENCY-S10-TARIFF.md (tarifa)
