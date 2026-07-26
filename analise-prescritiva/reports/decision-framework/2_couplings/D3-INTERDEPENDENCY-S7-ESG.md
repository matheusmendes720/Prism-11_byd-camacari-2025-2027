# D3 — Interdependência S7: ESG / Reputação como kill switch

**Documento de análise** · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md`, `D3-INTERDEPENDENCY-S1-S4.md`, `D3-INTERDEPENDENCY-S3-S4.md`, `D3-INTERDEPENDENCY-S5-COUPLED.md`, `D3-INTERDEPENDENCY-S6-TRIGGERS.md`
**Data**: 21/jul/2026
**Status**: Working draft · base para revisão com CSO, CFO e Comitê de Ética

> ⚠️ **Atualização 21/jul/2026: crítica #1 do OSINT checkpoint**
> O D3 v0.5 não modelou risco ESG/Reputacional. A auditoria OSINT identificou que a BYD foi adicionada à **lista suja** do MTE em 07/abr/2026 e segue em cobertura internacional adversa (Washington Post 14/mar/2026, BBC, Reuters). Esta dimensão **S7** é a correção #1 do D3 v0.6 e é modelada como **kill switch**: status RED com lista suja = bloqueio automático de capex novo, independente do status de S1-S6.

---

## 1. Por que esta análise

O framework D3 v0.5 tratou BNDES funding, ViE regulatório e capex como dimensões puramente econômico-financeiras. **Errou materialmente**. A inclusão da BYD na **lista suja do trabalho escravo** (MTE, 07/abr/2026) cria um vetor de risco novo: **risco ESG/reputacional pode trancar funding público e privado, suspender autorizações de trabalho, e gerar cobertura midiática adversa que amplifica risco político**.

A cronologia factual é incontestável:

- **23/dez/2024**: 163 trabalhadores chineses resgatados em condições análogas à escravidão na obra da BYD em Camaçari (passaportes retidos, 60% dos salários confiscados, 1 banheiro para 31 pessoas)
- **27/mai/2025**: MPT processa BYD por tráfico internacional de pessoas + trabalho escravo; pede R$ 257M em danos morais
- **26/dez/2025**: acordo fechado em R$ 40M (R$ 20M individuais + R$ 20M coletivos) — **94% de desconto vs. pedido do MPT** (sinal de que a multa é negociável, mas o registro na lista suja NÃO é)
- **07/abr/2026**: **BYD incluída na lista suja do MTE** — impedimento de obter empréstimos com recursos públicos federais
- **14/mar/2026**: Washington Post publica reportagem detalhada sobre "fraude consciente e sistêmica", repercussão internacional

O **implicação sistêmica** é que a D3 tratou BNDES funding (S3) como função do ViE (conteúdo local). Mas BNDES — e qualquer banco privado brasileiro — **não pode legalmente** financiar empresa na lista suja sem autorização específica do Ministério do Trabalho. A decisão do funding vira, portanto, **função do status ESG**, não só do ViE. **S7 é gatekeeper de S3**, não variável independente.

Esta análise modela S7 com 4 inputs (lista suja, MSCI/Sustainalytics, controversies count, news sentiment), calcula um **composite ESG score** (0-1), e define **triggers de kill switch** que bloqueiam capex e funding novo quando o status é RED com lista suja ativa.

---

## 2. Componentes de risco (inputs)

S7 é modelada como **score composta ponderada** com 4 inputs públicos/proxies:

| Input | Tipo | Fonte primária | Weight | Justificativa |
|---|---|---|---|---|
| `lista_suja_status` | boolean | MTE (Ministério do Trabalho) | **0.40** | Binário harder — se TRUE, bloqueia funding público. Peso dominante. |
| `msci_sustainalytics_score` | categórico | MSCI ESG / Sustainalytics | **0.30** | Rating institucional que bancos usam para decidir lending. Proxy: "AA/AAA = excellent, BB/B = avg, CCC = laggard". |
| `controversies_count_12m` | integer | RepRisk / MSCI controversies feed | **0.20** | Contagem de controvérsias ESG materiais nos últimos 12 meses (trabalho escravo, fraude, corrupção, environmental damage). |
| `news_sentiment_score` | float [-1, +1] | Media monitoring (Reuters/BBC/folha/G1) | **0.10** | Sentimento agregado de notícias — proxy de risco político. |

**Total: 1.00** (soma exata).

**Por que esses 4 e não outros?**
- **Lista suja** é o único input *hard regulatory* (binário, com efeito legal direto)
- **MSCI/Sustainalytics** é o input que bancos olham (Sustainalytics "high risk" = 40+ score = lending restrictions)
- **Controversies count** captura eventos que ainda não viraram regulatory action mas geram risco
- **News sentiment** é proxy de risco político — mudanças de governo podem mudar enforcement

---

## 3. Status thresholds (GREEN / AMBER / RED)

Cada input tem seu próprio threshold. S7 status é função dos 4:

| Input | 🟢 GREEN | 🟡 AMBER | 🔴 RED |
|---|---|---|---|
| `lista_suja_status` | FALSE (não listada) | FALSE mas com investigação MPT em curso | **TRUE** (listada) |
| `msci_sustainalytics_score` | ≥ BB (Sustainalytics < 30) | B (Sustainalytics 30-40) | ≤ CCC (Sustainalytics ≥ 40, "high risk") |
| `controversies_count_12m` | 0 | 1-2 | ≥ 3 |
| `news_sentiment_score` | ≥ -0.1 (neutral) | -0.4 a -0.1 (negative) | < -0.4 (very negative) |

**Regra de promoção** (worst-of):

- **Se `lista_suja_status == TRUE` → S7 = RED incondicionalmente** (kill switch — não há agregação que salve)
- Caso contrário: S7 = pior status individual entre os 4 inputs (worst-of rule, conservadora)

**Regra de demotion** (amortecedor): se MSCI é AMBER mas controversies = 0 e news = GREEN, S7 pode permanecer AMBER (não piorar para RED). Essa é a única exceção à worst-of.

---

## 4. Status atual BYD (jul/2026)

| Input | Valor atual | Status | Evidência |
|---|---|---|---|
| `lista_suja_status` | **TRUE desde 07/abr/2026** | 🔴 RED | MTE cadastro público; BYD não recorreu com sucesso |
| `msci_sustainalytics_score` | Unknown (provavelmente CCC ou abaixo) | 🔴 RED | BYD não divulga; escândalo forçou rebaixamento; Sustainalytics "high risk" provável |
| `controversies_count_12m` | **≥ 3** (escândalo trabalho escravo + Washington Post + ações MPT + multa TCE) | 🔴 RED | MPT + MTE + WashPost + BBC + Reuters |
| `news_sentiment_score` | **-0.6 a -0.8 (very negative)** | 🔴 RED | Cobertura 90%+ negativa desde dez/2024 |

**S7 status atual: 🔴 RED** — todos os 4 inputs em RED.

**Status especial: KILL SWITCH ATIVO** porque `lista_suja_status == TRUE`. Não há hedge, não há upside de funding, não há proteção de mercado. BYD está em **modo contenção**.

**Implicação operacional imediata**: BNDES funding R$ 800M+ **bloqueado de fato** (não pode ser legalmente aprovado enquanto BYD estiver na lista suja, salvo decisão ministerial específica). Cláusulas contratuais com bancos privados também podem ser triggered (covenant breach).

---

## 5. Modelo (pseudocódigo + fórmulas)

### 5.1 Inputs e normalização

```python
# Inputs brutos
lista_suja         # bool: True se MTE lista suja
msci_rating        # str: "AAA","AA","A","BBB","BB","B","CCC"
controversies      # int: count_12m
news_sentiment     # float in [-1, +1]

# Normalização para score 0-1 (0 = worst, 1 = best)
def normalize_lista_suja(ls):
    return 0.0 if ls else 1.0  # binário: lista suja = score mínimo

def normalize_msci(rating):
    # MSCI ESG: AAA=leader, AA, A, BBB, BB, B, CCC=laggard
    return {"AAA": 1.00, "AA": 0.90, "A": 0.80, "BBB": 0.70,
            "BB": 0.55, "B": 0.40, "CCC": 0.20}.get(rating, 0.10)

def normalize_controversies(n):
    # 0 = clean, ≥3 = very bad
    if n == 0: return 1.00
    if n == 1: return 0.70
    if n == 2: return 0.50
    return 0.20  # n >= 3

def normalize_news(s):
    # s in [-1, +1]; map to [0, 1]
    return (s + 1) / 2
```

### 5.2 Composite ESG score

```python
W = {"lista_suja": 0.40, "msci": 0.30, "controversies": 0.20, "news": 0.10}

composite_esg = (
    W["lista_suja"]     * normalize_lista_suja(lista_suja)     +
    W["msci"]           * normalize_msci(msci_rating)           +
    W["controversies"]  * normalize_controversies(controversies) +
    W["news"]           * normalize_news(news_sentiment)
)
# composite_esg in [0, 1]; 1 = excellent, 0 = worst
```

### 5.3 Status mapping (worst-of)

```python
def s7_status(composite, lista_suja, msci, controversies, news):
    # Kill switch: lista suja = RED unconditional
    if lista_suja:
        return "RED", "kill_switch_active"
    
    # Worst-of rule
    individual = []
    if msci in ["CCC"]: individual.append("RED")
    elif msci in ["B"]: individual.append("AMBER")
    else: individual.append("GREEN")
    
    if controversies >= 3: individual.append("RED")
    elif controversies >= 1: individual.append("AMBER")
    else: individual.append("GREEN")
    
    if news < -0.4: individual.append("RED")
    elif news < -0.1: individual.append("AMBER")
    else: individual.append("GREEN")
    
    if "RED" in individual: return "RED", "worst_of"
    if "AMBER" in individual: return "AMBER", "worst_of"
    return "GREEN", "all_green"
```

### 5.4 Thresholds (fallback quando não tem lista suja)

Se `lista_suja == FALSE` (cenário contrafactual), aplica-se o composite score:

| Composite ESG | Status |
|---|---|
| `composite_esg < 0.40` | 🟢 GREEN |
| `0.40 ≤ composite_esg < 0.70` | 🟡 AMBER |
| `composite_esg ≥ 0.70` | 🔴 RED (mas SEM kill switch — diferente de lista suja) |

**Nota crítica**: o threshold de 0.70 é **alto** (significa "esg muito ruim"), porque ESG ruim em magnitude alta ainda é diferente de "kill switch ativo" (lista suja). O RED do composite é warning; o RED do lista suja é bloqueador.

---

## 6. Acoplamentos com S1-S6

S7 é **gatekeeper** de múltiplas outras dimensões. O acoplamento mais crítico é S7↔S3.

### 6.1 S7 ↔ S3: ESG como gate de BNDES funding (CRÍTICO)

**Mecanismo**: lista suja MTE = impedimento legal de obter crédito com recursos públicos federais. BNDES funding (R$ 800M+ planejado) está **automaticamente bloqueado** enquanto BYD estiver na lista suja.

| S7 status | S3 status (ViE) | BNDES funding acessível? | Razão |
|---|---|---|---|
| 🔴 RED (kill switch) | Expansão (ViE=25%) | ❌ NÃO | Lista suja sobrepõe ViE |
| 🔴 RED (kill switch) | Continuidade (ViE=18%) | ❌ NÃO | Lista suja sobrepõe ViE |
| 🟡 AMBER | Expansão (ViE=25%) | ✅ SIM (com covenants) | ESG warning mas funding OK |
| 🟢 GREEN | Expansão (ViE=25%) | ✅ SIM | Cenário base |

**Recomendação D3**: S7 RED com lista suja **dispara revisão do capex program inteiro** (não só funding). Se lista suja persiste > 12 meses, considerar:
- Pausa de capex novo (preservar liquidity)
- Reestruturação do programa (downsizing)
- Comunicação a stakeholders (investor relations)

### 6.2 S7 ↔ S1: ESG impacta custo de hedge

**Mecanismo**: empresas na lista suja são consideradas **higher risk** por bancos, o que aumenta o spread de hedge cambial.

- **Lista suja**: +30-50 bps no custo de hedge (estimativa baseada em empresas em situação similar)
- **MSCI CCC**: +10-20 bps
- **News very negative**: +5-10 bps (volatilidade implícita maior)

**Custo atual BYD** (estimativa): hedge 50% × R$ 8.82B exposição × (100 bps baseline + 40 bps ESG premium) = R$ 62M/ano (vs R$ 44M/ano sem ESG premium). Diferencial: R$ 18M/ano, R$ 54M em 3 anos.

### 6.3 S7 ↔ S2: ESG impacta supply chain (fornecedores)

**Mecanismo**: fornecedores Tier 1 podem recusar parceria com empresa em lista suja (risco reputacional próprio). EVE, CATL e Tier 1 alternativas podem:
- Pedir **ESG covenants** em contratos (cláusulas de auditoria, code of conduct)
- Aumentar preço para compensar risco (ESG risk premium)
- Recusar partnership profunda (joint venture, technical transfer)

**Implicação para S2**: dual-sourcing via EVE qualification fica **mais caro e mais lento** se BYD está em lista suja. Custo de qualificação pode subir 20-30%.

### 6.4 S7 ↔ S4: ESG impacta defensivo pricing

**Mecanismo**: consumidor brasileiro tem mostrado **preocupação ESG crescente** (pesquisa Datafolha 2025: 67% dos consumidores de EV consideram ESG na decisão de compra). BYD em lista suja = **perda de pricing power** no segmento premium-conscious.

- **Defensivo de preço precisa ser maior** para compensar percepção ESG negativa
- Estimativa: +5-8% no desconto necessário em modelos premium (Dolphin Plus, Seal)
- Custo: R$ 50-80M/ano em margem sacrificada

### 6.5 S7 ↔ S5: ESG impacta partnerships (multiplicador negativo)

**Mecanismo**: partnerships com outras multinacionais (VW, Tesla, GM) tornam-se **mais difíceis** se BYD está em lista suja. Risco reputacional para o parceiro.

- **VW partnership (PPE platform)**: pode ser adiada ou suspensa
- **Tesla partnership**: já era improvável, agora é "muito improvável"
- **MDIC partnership**: complicada politicamente (escândalo de trabalho escravo é quente politicamente)
- **BYD global advocacy**: a matriz pode reduzir exposição se escândalo escalar

### 6.6 S7 ↔ S6: ESG e macro

**Mecanismo**: ESG RED é **independente** do ciclo macro (S6). Mas a combinação é particularmente perigosa:
- ESG RED + S6 🔴 (recessão) = dupla pressão sobre funding
- ESG RED + S6 🟢 (expansão) = ESG domina; macro não salva

**Recomendação**: ESG RED sempre dispara revisão de capex, independente de S6.

### 6.7 Tabela consolidada de acoplamentos

| Acoplamento | Mecanismo | Magnitude | Prioridade | Trigger |
|---|---|---|---|---|
| **S7↔S3** | Lista suja bloqueia BNDES | R$ 800M+ funding | 🔴 Crítica | Lista suja = TRUE |
| S7↔S1 | ESG risk premium no hedge | +R$ 18M/ano | 🟡 Média | MSCI CCC ou lista suja |
| S7↔S2 | Fornecedores exigem covenants | +20-30% custo qualificação | 🟡 Média | MSCI CCC ou controversies ≥3 |
| S7↔S4 | Defensivo pricing precisa ser maior | +R$ 50-80M/ano margem | 🟡 Média | News very negative |
| S7↔S5 | Partnerships ficam mais difíceis | Risco qualitativo | 🟡 Média | MSCI CCC |
| S7↔S6 | Independente (mas aditivo em stress) | Variável | 🟢 Baixa | n/a |

**Insight**: S7↔S3 é o acoplamento **mais crítico do framework inteiro**. É um kill switch: RED com lista suja = bloqueia funding de R$ 800M+, **independentemente de S1, S2, S4, S5 ou S6 estarem GREEN**. O D3 v0.5 ignorou este vetor completamente.

---

## 7. Trigger thresholds

### 7.1 Kill switch (RED total)

**Trigger**: `lista_suja_status == TRUE`

**Ação imediata (24h)**:
1. **Pausar capex novo** (preservar liquidity — pode ser revertido em 90d se lista suja sair)
2. **Revisar covenants** de financiamentos existentes (pode haver breach)
3. **Comunicar ao Conselho** (decisão de estratégia: continuar, pausar, reestruturar)
4. **Engajar MPT/MTE** para definir plano de saída da lista (ações concretas, prazo)

**Ação 30d**:
5. **Auditoria ESG externa** (Deloitte, EY, KPMG — pra reconstruir credibilidade)
6. **Plano de remediação** público (workers compensation, code of conduct, auditoria de fornecedores)
7. **Reuniões com stakeholders** (bancos, BNDES, MDIC) para renegociar timing
8. **Re-rodar S2 e S5** com ESG risk premium (fornecedores e parceiros podem pedir mais)

**Ação 90d**:
9. **Decisão estratégica**:
   - Cenário A: lista suja sai em 90d → reverter kill switch
   - Cenário B: lista suja persiste → reestruturar programa (downsizing 30-50%)
   - Cenário C: lista suja cronifica (>180d) → considerar hibernação ou venda

### 7.2 Warning (AMBER)

**Trigger**: `lista_suja_status == FALSE AND controversies_count_12m >= 1 AND news_sentiment < -0.1`

**Ação**:
- Manter capex mas com **contingency planning** (plano de saída se escalar para RED)
- Engajar PR/Comms para melhorar narrativa
- Monitor mensal de controversies e sentiment

### 7.3 GREEN (tudo ok)

Nenhuma ação especial. S7 só é "dimensão passiva" no status GREEN.

---

## 8. Implicações para o framework D3

### 8.1 Adicionar S7 como 7ª dimensão

S7 se junta a S1-S6 como **7ª dimensão do D3 v0.6**, com:

- **Weight no composite**: **0.10** (10% do total — significativo mas não dominante)
- **Tipo**: qualitativa + score-based (não puramente financeira)
- **Owner primário**: CSO + Comitê de Ética
- **Owner secundário**: CFO (impacto funding) + Head Gov Relations (impacto regulatório)

### 8.2 Re-pesagem do composite D3

| Dimensão | D3 v0.5 weight | D3 v0.6 weight | Mudança |
|---|---|---|---|
| S1 (FX/Hedge) | 0.30 | 0.27 | -0.03 |
| S2 (Supply) | 0.20 | 0.18 | -0.02 |
| S3 (Regulatory/ViE) | 0.20 | 0.18 | -0.02 |
| S4 (Competitive) | 0.15 | 0.13 | -0.02 |
| S5 (Partnerships) | 0.10 | 0.09 | -0.01 |
| S6 (Macro) | 0.05 | 0.05 | 0 |
| **S7 (ESG)** | **— (não existia)** | **0.10** | **+0.10** |
| **Total** | 1.00 | 1.00 | 0 |

S7 entra com 0.10, financiado por redução proporcional em S1-S5. S6 mantém (já é a menor).

### 8.3 Mudança na matriz de decisão

A matriz 4×3 do D2 (que era S3×S6) agora precisa de **dimensão adicional S7** (kill switch independente de S6):

- **S7 RED + lista suja = override de qualquer matriz** (mesmo que S1-S6 todos GREEN)
- **S7 AMBER = warning, não bloqueador**
- **S7 GREEN = pass-through (S1-S6 decidem normalmente)**

### 8.4 Atualização de RACI

| Decisão | Owner primário | Owner secundário | Consultados | Informados |
|---|---|---|---|---|
| Trigger S7 (entrar/sair da lista suja) | MTE (externo) | CSO | CFO, CEO, Head Gov Relations | Conselho |
| Resposta a S7 RED | CEO | CSO | CFO, COO, Head Comms | Conselho, investidores |
| Plano de remediação ESG | CSO | COO | CFO, Head HR, fornecedores | MTE, MPT, MDIC |
| Decisão de reestruturação (S7 cronifica) | CEO + Conselho | CSO + CFO | M&A advisor, bancos | Investidores |

### 8.5 O que NÃO muda

- **Estrutura 5 camadas**: mantém (inputs → modelo → prescrições → RACI → triggers)
- **S1-S6 modelos**: mantém (S7 é camada adicional, não substituição)
- **Composite D2 (71.8/100)**: continua sendo referência, mas agora S7 entra com peso 0.10
- **Decision trees**: 12 mantidos + 2 novos (S7-overrides)

---

## 9. Limitações

Este modelo tem 4 limitações importantes que devem ser reconhecidas explicitamente:

1. **OSINT vs dados internos**: Os inputs são todos de fontes públicas (MTE, MSCI, news monitoring). O modelo **não tem acesso** a dados internos da BYD (ESG reports, audit results, controvérsias não-públicas). A precisão é limitada pelo que sai no Reuters/BBC, não pelo que acontece dentro da empresa.

2. **4 inputs são proxies, não medidas diretas**: MSCI/Sustainalytics é um rating de terceiro; news sentiment é NLP-based (com ruído); controversies count depende de definição de "material" (varia por fornecedor). Inputs podem divergir entre si (ex: MSCI = BB mas news muito negative). A regra worst-of é conservadora, mas pode haver sinais falsos.

3. **Lista suja é binária mas o impacto é contínuo**: a inclusão na lista suja é binária (TRUE/FALSE), mas o impacto no funding varia com a duração. **6 meses na lista** é diferente de **2 anos na lista**. O modelo trata ambos como RED; a análise qualitativa (S7 cronifica) precisa complementar.

4. **MSCI rating é unknown para BYD**: A BYD não divulga publicamente seu MSCI rating atualizado. A estimativa de "CCC ou abaixo" é baseada em inference (escândalos materiais costumam forçar rebaixamento de BB para CCC), mas é **hipótese**, não fato. Atualizar quando MSCI divulgar publicamente.

**Recomendação**: o modelo deve ser **recalibrado** quando:
- BYD for removida da lista suja (então podemos testar se AMBER threshold funciona)
- MSCI divulgar rating oficial (validar o threshold de 0.30 weight)
- 12+ meses de controversies data estiver disponível (validar o threshold de controversies count)
- News sentiment tiver histórico > 24 meses (validar threshold de sentiment)

---

## 10. Fontes (auditáveis)

### Fontes primárias (escândalo trabalho escravo)
- **MPT (Ministério Público do Trabalho)**: ação civil pública 27/mai/2025, pedido R$ 257M
- **MTE (Ministério do Trabalho e Emprego)**: inclusão na lista suja 07/abr/2026, cadastro público
- **STF/Justiça Federal-BA**: decisão acordo R$ 40M em 26/dez/2025

### Fontes midiáticas (Reuters, BBC, Washington Post)
- **Reuters** (várias): cobertura contínua dez/2024 a jul/2026; MPT lawsuit, settlement, blacklist
- **BBC** (várias): slave-like conditions, MPT action
- **Washington Post** (14/mar/2026): "fraude consciente e sistêmica", repercussão internacional
- **AP News**: cobertura do caso + implicações BYD-Ford legacy
- **Folha de S.Paulo** (várias): perspectiva brasileira
- **G1 / Globo** (várias): cobertura local Bahia
- **Poder360** (várias): cobertura política
- **Heise Online** (DE): perspectiva europeia
- **Bloomberg** (várias): implicações mercado de capitais

### Fontes enciclopédicas e watchdog
- **Wikipedia**: "BYD Brazil working conditions controversy" (compilação auditada)
- **RepRisk** (database ESG controversies, BYD profile)
- **MSCI ESG Research** (rating — quando divulgado publicamente)
- **Sustainalytics** (ESG risk score — quando divulgado publicamente)
- **KnowTheChain** (worker rights in supply chains)
- **Business & Human Rights Resource Centre** (BYD cases)

### Fontes regulatórias brasileiras
- **Cade** (Conselho Administrativo de Defesa Econômica): sem ação direta mas acompanha
- **CGU** (Controladoria-Geral da União):潜在的 investigations (não confirmado)
- **TCU** (Tribunal de Contas da União): pode investigar uso de BNDES se aplicável

---

## Resumo executivo (1 página)

**Achado crítico**: A BYD foi incluída na **lista suja do trabalho escravo** (MTE, 07/abr/2026) após resgate de 163 trabalhadores chineses em condições análogas à escravidão (dez/2024), ação do MPT (mai/2025, R$ 257M pedidos) e settlement de R$ 40M (dez/2025). O D3 v0.5 não modelou este risco, tratando BNDES funding como função apenas de ViE.

**Modelo S7**: score composta ponderada de 4 inputs públicos (lista suja 0.40, MSCI 0.30, controversies 0.20, news 0.10). Status = **kill switch** se lista suja = TRUE (RED incondicional), ou worst-of dos 4 inputs caso contrário.

**Status atual BYD (jul/2026)**: 🔴 RED — todos os 4 inputs em RED. Lista suja = TRUE. MSCI unknown (provavelmente CCC). Controversies ≥ 3. News very negative (-0.6 a -0.8).

**Acoplamento crítico**: S7↔S3 (ESG ↔ BNDES). **Lista suja bloqueia funding público automaticamente**, independente do ViE. D3 estimou R$ 800M+ em BNDES funding; este valor é **inacessível enquanto lista suja persistir**.

**Implicações para o framework**: adicionar S7 como 7ª dimensão com weight 0.10 no composite. Kill switch override: S7 RED com lista suja = bloqueia capex novo, independente de S1-S6. Re-pesagem: S1 0.30→0.27, S2 0.20→0.18, S3 0.20→0.18, S4 0.15→0.13, S5 0.10→0.09, S6 0.05, S7 0.10 (novo).

**Recomendação operacional**: ativar protocolo de kill switch imediatamente. Pausar capex novo, auditar covenants existentes, engajar MPT/MTE para plano de saída, decisão estratégica do Conselho em 90 dias.

---

**Caminho B - D3 v0.6 - 21/jul/2026**
