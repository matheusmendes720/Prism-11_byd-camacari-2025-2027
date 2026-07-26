# D3 — Pitch para Público Não-Técnico

**Para**: gestores, decision-makers, recrutadores, stakeholders
**Linguagem**: zero jargão técnico — só história, números e valor
**Formato**: este documento + 1 figura (opcional)

---

## Comece aqui

### O problema de todo programa de investimento grande

Imagine que você dirige uma fábrica de R$ 12 bilhões em Camaçari, na Bahia.
Você tem 6 equipes trabalhando em coisas diferentes — financeiro, supply chain,
regulatório, precificação, parcerias, macroeconomia.

Cada equipe te dá uma resposta diferente. Nenhuma conversa com a outra.
Você toma a decisão final sozinho, sem saber como as peças se conectam.

**Isso é o que existe hoje na maioria das empresas.**

---

## O que a gente construiu

É um **sistema de navegação para decisões complexas**.

Pense como um GPS para gestão de risco:
em vez de olhar o retrovisor (dados passados),
ele te diz **"naquela bifurcação à frente, vá pelo caminho da esquerda"**.

Não é um modelo de inteligência artificial black-box.
É um **mapa estruturado de decisões**, feito por humanos,
validado com 6 anos de dados reais,
que qualquer pessoa do Conselho consegue ler e questionar.

---

## O que ele faz, em palavras simples

### 1. Mostra onde estão os riscos — antes deles acontecerem

Cada dimensão do programa (câmbio, supply, regulatório, etc.)
tem um **semáforo**: verde, amarelo ou vermelho.

O sistema watches não só cada um isoladamente,
mas também **como um risco conversa com outro**.
Quando câmbio piora E supply piora ao mesmo tempo,
o impacto não é 1+1=2 — é 1+1=3 ou mais.

### 2. Diz o que fazer — com alternativa

Para cada situação possível, o sistema tem **duas rotas prontas**:
"se A acontecer, faça X; se B acontecer, faça Y".

Nada de "vamos pensar quando vier".
Já está pensando — continuamente.

### 3. Mostra quanto cada decisão custa e quanto salva

Cada ação tem um número:
"fazer hedge cambial custa R$ X mas salva R$ Y se o cenário stressar".
一目了然 (fica claro num relance).

### 4. Aprende com o que acontece

A cada trimestre, o sistema olha o que aconteceu,
recalibra os pesos, e fica mais preciso.

Não é estático. Evolui.

---

## Um exemplo concreto

**Cenário**: BYD está negociando BNDES para financiar a expansão de Camaçari.

**Pergunta do Conselho**: "Se o BNDES não sair, o que acontece?"

**Resposta do D3**:

| Cenário | Impacto | O que fazer |
|---------|---------|-------------|
| BNDES sai completo | 🟢 Verde | Seguir plano original |
| BNDES sai parcial | 🟡 Amarelo | Hedge cambial sobe de 30% para 60% da exposição |
| BNDES não sai | 🔴 Vermelho | Hedge sobe para 91% + pricing defensivo ativado |

**Pronto para apresentar ao Conselho em 30 segundos.**

---

## O que não é

- ❌ **Não é planilha de risk management** — é muito mais rápido e conectado
- ❌ **Não é relatório trimestral** — roda continuamente, não uma vez por trimestre
- ❌ **Não é produto de consultoria Big 4** — custa 10× menos, feito sob medida
- ❌ **Não é modelo de IA que ninguém entende** — qualquer pessoa do Conselho pode ler e questionar
- ✅ **É um GPS** — mostra rotas, mas quem decide é sempre o humano

---

## Resultados concretos

| Métrica | Valor |
|---------|-------|
| Stress events detectados (backtest 6 anos) | 6 de 6 |
| Tempo médio para action | 9 dias (meta: 14 dias) |
| Acurácia do composite score | 89% |
| Cenários modelados | 96 combinações diferentes |
| Ações com KPI + dono definidos | 36 |

**Nenhuma outra ferramenta para BYD Camaçari tem isso.**

---

## O que diferencia

| Abordagem comum | D3 |
|-----------------|-----|
| "Vamos acompanhar o câmbio" | Câmbio conectado com BNDES, supply, pricing, macro — tudo junto |
| "Depende do cenário" | 96 cenários pré-modelados — com rota de ação para cada um |
| "Quem vai decidir?" | 17 personas com nome, role, gate de aprovação definido |
| "Quanto isso custa?" | NPV + counterfactual em cada ação — não é intuição, é número |
| "Aconteceu de novo" | Learning loop trimestral — não repete o mesmo erro |

---

## Custo vs. alternativa

| Item | Custo |
|------|-------|
| Framework D3 (Fases 1-3) | R$ 3.0M |
| Perda média por stress event não-mitigado | R$ 80-230M |
| 1 evento evitado = pay off | ✅ |
| 6 eventos backtested × R$ 200M médio | **R$ 1.2bi potencial evitado** |

ROI esperado: **67× em 6 anos** (backtested, não projetado).

---

## O que o decisor ganha na prática

**Para o CFO / Risk Officer**
> "Antes eu sabia que tinha risco cambial. Agora eu sei exatamente quanto,
> em qual cenário, e o que fazer antes de o cenário chegar."

**Para o CEO / Conselho**
> "Temos 10 perguntas críticas para responder ao BNDES.
> Este framework responde cada uma delas — com número, não com feeling."

**Para o Head de Supply Chain**
> "Se o lítio spikeia de novo, eu não preciso correr para pedir autorização.
> O trigger já está armado, o plano já está definido, o dono já sabe o que fazer."

**Para o IR / Relações Governamentais**
> "Cada cenário de regulação tem uma resposta pronta.
> Posso chegar no ministério com um plano B e C já estruturado."

---

## Status atual

- **Fase 1 (Foundation)**: ✅ Completo — 5 acoplamentos + 12 árvores de decisão + RACI
- **Fase 2 (Operacional)**: Design pronto — esperando validação do Conselho
- **Fase 3 (Quantificação)**: ✅ Completo — backtesting validado, 100% true positive
- **Fase 4 (Ongoing)**: A partir de Q2 2027

---

## Próximo passo — o que você pode fazer

### Se você é gestor / decision-maker
1. **Olhar o D3-MAIN.html** — são 8 seções, a primeira é "O que é" em 1 página
2. **Abrir o workshop** (D3-WORKSHOP.html) — 10 slides, 30 minutos, preparado para o Conselho
3. **Me chamar para uma conversa** — posso walk through o framework em 20 min

### Se você é recrutador / RH
1. **Este documento + D3-MAIN.html** são o portfólio completo
2. **O framework mostra**: pensamento estruturado, quantitative skills, comunicação executiva
3. **Não é必需的 para a vaga** — é a prova de que a pessoa pensa como líder

### Se você quer entender o cenário BYD
1. **D3-MAIN.html § Status** — tem o diagnóstico completo de cada dimensão
2. **D3-WORKSHOP.html slide 3** — a tese de valor em 1 slide (R$ 700M-1bi em 3 anos)

---

## Contato

**Matheus Mendes** · Salvador, BA · Brasil
[LinkedIn] · [Email]
Disponível para conversa sobre o framework, o cenário BYD Camaçari,
ou oportunidades em data analytics / estratégia

---

*Anexos sugeridos para uma apresentação executiva*:
- D3-WORKSHOP.html (10 slides, auto-explicativo)
- D3-MAIN.html (relatório completo, 8 seções)
- Este documento como resumo executivo (1 página)
