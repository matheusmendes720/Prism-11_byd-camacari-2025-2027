# D2 Audit — Verificação & Gap Analysis

**Documento**: Atlas D2 — Análise Preditiva Consolidada (`atlas-d2-preditiva.html`)
**Auditado em**: 21/jul/2026
**Auditor**: Mavis (Mavis / mavis)
**Status**: Working draft

---

## 1. Resumo executivo

O D2 cumpre bem o papel de **fotografia preditiva** do programa: estabelece o regime de risco, calibra distribuições, e entrega um composite index (71.8/100) defensável. Mas ele para exatamente onde a decisão começa. Há uma **lacuna estrutural** entre "o que sabemos" e "o que fazer", que é o que o D3 precisa preencher.

**Veredito**: D2 é uma boa **âncora de diagnóstico**, mas é um **playbook fraco**. A prescrição final do D2 (5 números + roadmap por horizonte) é mais um **statement de intenções** do que um **plano operacional**.

---

## 2. Inventário do D2 — o que existe

### 2.1 Estrutura analítica
- **6 sessões paralelas**: Câmbio, Supply Chain, Regulatório, Competitivo, Composite, Macro
- **1 índice composto** (71.8) com pesos 30/30/20/20
- **18 figuras** (PTAX time series, stress test, MC distribution, GARCH, HHI, share, Sankey, cenários regulatórios, ViE, market share, BYD trajectory, radar, contrib, mitigação, IRF, FEVD, correlações, trade)
- **6 prescrições** (1 por sessão, no formato "ação + métrica + custo")
- **Síntese executiva** com 5 números âncora e roadmap por horizonte

### 2.2 Pontos fortes (manter)
- **Calibração numérica honesta** — percentis do MC batem com a documentação
- **Decomposição aditiva** do composite (contribuição por dimensão) — facilita priorização
- **Eficiência de mitigação por R$ investido** — quantifica a fronteira de Pareto
- **Sankey de 3 tiers** (Fornecedor → País → Risco) — primeira visualização geopolítica
- **PTAX + vol proxy** na mesma escala — boa leitura de regime

### 2.3 Pontos fracos (tratar em D3)
Vide §3 abaixo.

---

## 3. Gap Analysis — onde D2 falha

### 3.1 Interdependências entre sessões **NÃO modeladas**

As 6 sessões são tratadas como **dimensões paralelas** que se somam no composite. Mas na prática, as prescrições têm acoplamentos fortes:

| Prescrição A | Depende de | Tipo de acoplamento |
|---|---|---|
| S1 — Hedge 50% | S3 — Aprovação Rota 2030/BNDES | Se ViE cai 18pp (rollback total), o hedge precisa cobrir uma base menor — sizing errado |
| S2 — Dual-sourcing | S6 — Trade deficit / narrativa MF | A narrativa de substituição de importações é o que **financia politicamente** o investimento em refinaria de lítio nacional |
| S4 — Pricing defensivo | S1 + S3 | Custo do hedge e dos incentivos entram no break-even do preço de catálogo |
| S5 — Sequência mitigação | S2 + S3 | Se dual-sourcing trava, supply chain cai de 95.7 para ~75, e câmbio se torna o gargalo |
| S6 — Macro monitoring | S1, S4 | Um trigger macro (PIB < 0 por 2 tri) deveria **automaticamente** revisar o programa de hedge e pricing |

**D2 não modela nada disso.** As prescrições são um "cardápio", não um "sistema".

### 3.2 Prescrições **sem branching condicional**

| D2 prescreve | Mas não diz |
|---|---|
| "Hedge 50% da exposição" | E se PTAX cai pra 4.50? (reduz o hedge? quando?) |
| "Dual-sourcing em 18m" | E se CATL cortar preço 20% em troca de exclusivity? (acelera? pivota?) |
| "Pricing defensivo 2026 Q3-Q4" | E se Tesla Model 2 atrasar pra 2029? (o preço defensivo vira presente grego) |
| "Advocacy BNDES R$ 12M" | E se Congresso entrar em recesso branco? (o que muda?) |
| "Safety stock 60 dias" | E se working capital ficar caro? (reduz stock, paga hedge maior) |

**D2 entrega uma prescrição para o cenário base. D3 precisa entregar uma prescrição para cada cenário.**

### 3.3 Sem análise de **custo-benefício** por prescrição

D2 lista **custos** (R$ 80M/ano hedge, R$ 280M dual-sourcing, R$ 12M advocacy, R$ 320M/ano pricing) mas **não calcula**:

- **NPV** da mitigação vs. status quo (qual é o valor presente da redução de risco?)
- **Payback** (em que mês o custo se paga pela perda evitada?)
- **Custo de oportunidade** (esse R$ 280M em supply chain rende mais do que em hedge?)
- **Curva de mitigação marginal** (o 3.5pp de composite reduction por R$ 100M em supply chain — isso é linear até onde?)

### 3.4 Sem **counterfactual** ("e se não fizéssemos nada?")

D2 diz "faz X" mas **não diz "se não fizer, o que acontece"**. Sem counterfactual, a prescrição não tem prioridade justificável.

Exemplo: a recomendação de R$ 280M em dual-sourcing precisa ser comparada com "deixar como está e absorver o risco de supply chain em 95.7". Quanto custa absorver? É maior ou menor que R$ 280M?

### 3.5 Sem **triggers formalizados** como sistema de controle

D2 menciona **triggers** em vários lugares:
- S1: "PTAX > 5.40 por 5 dias"
- S3: "BNDES atrasar além de dez/2026"
- S6: "PIB mensal < 0 por 2 trimestres"

Mas eles estão **dispersos no texto**, sem:
- Tabela-mestra unificada
- Limites de autoridade (quem decide quando o trigger é confirmado?)
- Procedimento operacional (o que acontece nas primeiras 24h após trigger?)
- Fallback se o trigger falha (rede de segurança)

### 3.6 **Sem ownership** das decisões

D2 diz "advocacy" e "engagement", mas não diz:
- Quem é o **decision owner**? (CFO? Head de IR? Head de Supply Chain?)
- Qual é o **approval threshold**? (R$ X precisa de board, R$ Y precisa de CEO)
- Qual é a **freqüência de revisão**? (semanal? mensal? trimestral?)

### 3.7 **Análise competitiva é unidirecional**

S4 projeta market share BYD caindo 38→24%. Mas:
- Assume **resposta passiva** da BYD ao share loss
- Não modela **resposta competitiva** de Tesla/VW/GM à estratégia defensiva BYD
- Não modela **second-mover advantage** (BYD escala primeiro, depois outros copiam)
- Não modela **game theory** (preço-olume)

### 3.8 **Sem simulação de Monte Carlo integrada**

D2 faz MC só no câmbio (S1). Mas a vulnerabilidade do composite é um **problema multivariado**:
- PTAX + lítio price + demand EV podem se mover juntos em stress
- Sem MC integrado, não sabemos qual é a **correlação** das prescrições
- E se o hedge protege contra PTAX mas a CATL cortar volume? O que sobra?

### 3.9 **Macro é descritivo, não prescritivo**

S6 mostra correlações (PIB r=+0.59, IPCA r=-0.24) e IRF/FEVD, mas não usa isso para:
- **Acionar automaticamente** revisões em S1, S2, S4
- **Recomendar postura defensiva** quando PIB começa a cair
- **Sincronizar** o calendário de advocacy regulatório com o ciclo macro

### 3.10 **Não responde a pergunta de decisão**

A pergunta que move o Conselho:
> "Devemos aprovar R$ 12M + R$ 280M + R$ 80M/ano agora?"

D2 termina com "a resposta precisa ser sim, e a janela é Q3 2026". Mas não tem:
- Sensibilidade dessa resposta aos pressupostos
- Pontos de reversão da recomendação
- Plano B se a resposta for "não" (qual a perda esperada? quanto de composite?)

---

## 4. Resumo dos gaps

| # | Gap | Severidade | Cobre em D3? |
|---|---|---|---|
| 3.1 | Interdependências entre sessões | Alta | Sim — grafo de dependências |
| 3.2 | Branching condicional nas prescrições | Alta | Sim — decision trees |
| 3.3 | Custo-benefício / NPV por prescrição | Alta | Sim — finance layer |
| 3.4 | Counterfactual por prescrição | Média | Sim — baseline + alternative |
| 3.5 | Triggers formalizados | Alta | Sim — control plane |
| 3.6 | Ownership & approval gates | Alta | Sim — RACI matrix |
| 3.7 | Resposta competitiva modelada | Média | Sim — game theory layer |
| 3.8 | MC integrado multivariado | Alta | Sim — risk simulator |
| 3.9 | Macro prescritivo (não descritivo) | Alta | Sim — auto-trigger system |
| 3.10 | Pergunta de decisão com sensitivity | Alta | Sim — decision memo |

**Todos os 10 gaps são tratáveis em D3 com a arquitetura certa.**

---

## 5. Recomendações de prioridade para D3

1. **P0 (essencial)**: Decision framework inter-session (gap 3.1, 3.5, 3.6, 3.9) — sem isso, D3 vira "D2 com mais números"
2. **P0**: Cost-benefit layer com NPV + counterfactual (gap 3.3, 3.4)
3. **P1 (importante)**: Decision trees por cenário (gap 3.2)
4. **P1**: MC integrado multivariado (gap 3.8)
5. **P2 (nice-to-have)**: Game theory layer (gap 3.7) — pode ser v2

---

## 6. Próximo passo

Vide `DECISION-FRAMEWORK.md` (arquitetura) e `D3-PRESCRIPTIVE-SPEC.md` (spec detalhado).
