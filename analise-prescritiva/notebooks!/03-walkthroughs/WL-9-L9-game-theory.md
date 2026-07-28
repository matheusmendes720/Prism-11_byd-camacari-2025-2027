# WL-9 · Walkthrough Visual do Notebook L9 — Teoria dos Jogos

> **Arquivo fonte:** `notebooks!/l9-game-theory.ipynb`
> **Tamanho:** 63 KB · **Cells:** 26 (≈13 markdown + 13 code)
> **Trilha:** Avançada (L7–L10) · **Duração estimada:** 22–26 min
> **Liga a (D2):** `d3/nb-04-competition-game-theory.ipynb` (5-player payoff matrix + NASH E3)
> **Liga a (NB-*):** NB-04 (game theory canônico) · NB-09 (game theory refinado)

---

## 1 · Visão geral do notebook (2 min)

L9 muda o foco de **um decisor** (L0-L8) para **múltiplos decisores
interagindo estrategicamente**. Quando o CFO pergunta "**e se o
concorrente reagir?**", a resposta está na **matriz de payoffs** e no
**equilíbrio de Nash**.

O projeto BYD modela **5 jogadores** (BYD, Stellantis, GM, VW, Geely) ×
**2 estratégias** (DIFFERENTIATE, PRICE_WAR) = **32 perfis de payoff**.
O resultado central: **equilíbrio de Nash E3** (BYD = DIFFERENTIATE,
Stellantis/GM/VW = PRICE_WAR, Geely = DIFFERENTIATE).

| Bloco | Conceito | Duração |
|------:|----------|---------|
| 1 | Decisões estratégicas — não é só matemática | 4 min |
| 2 | Jogadores e estratégias — quem faz o quê | 4 min |
| 3 | Payoffs — qual é o valor | 4 min |
| 4 | Equilíbrio de Nash — resultados estáveis | 5 min |
| 5 | Competição — BYD vs. Tesla vs. VW (e o resto) | 4 min |
| 6 | Executivo: "Nossa estratégia competitiva é diferenciação" | 3 min |

Conceito-chave do projeto: **L8 otimiza 1 decisão (h); L9 posiciona
entre 32 perfis**. Os dois são complementares — L8 te diz "quanto
hedge"; L9 te diz "onde você fica no tabuleiro competitivo".

---

## 2 · Estrutura narrativa (3 min)

### Markdown cells (narrativa)

| Cell | Título |
|-----:|--------|
| M00 | Capa — "Teoria dos Jogos para Executivos" |
| M02 | Bloco 1 — Decisões estratégicas (não é só matemática) |
| M04 | Recado executivo — Decisões estratégicas |
| M05 | Bloco 2 — Jogadores e estratégias (5 jogadores, 2 estratégias, 32 perfis) |
| M07 | Recado executivo — Jogadores e estratégias |
| M08 | Bloco 3 — Payoffs (R$ bi) |
| M10 | Recado executivo — Payoffs |
| M11 | Story PNG — 32 perfis como tabuleiro 2×16 |
| M12 | Bloco 4 — Equilíbrio de Nash (resultados estáveis) |
| M14 | Recado executivo — Equilíbrio de Nash |
| M15 | Story PNG — Tabuleiro 5×2 com Nash E3 |
| M16 | Bloco 5 — Competição BYD vs. Tesla vs. VW |
| M18 | Recado executivo — Competição |
| M19 | Bloco 6 — Executivo: "Nossa estratégia é diferenciação" |
| M22 | Recado executivo — A frase |
| M25 | Síntese final |

### Code cells (propósito)

| Cell | O que ela faz |
|-----:|---------------|
| C01 | Setup + import NB-04 (matriz payoff 5D) |
| C03 | **Figura 1** — Comparação L8 vs. L9 (otimização vs. estratégia) |
| C06 | Calcula share_base por jogador e war_delta (cenários) |
| C09 | **Figura 2** — Payoffs em 3 cenários macro (todos-DIFF, Nash E3, todos-PRICE_WAR) |
| C13 | Função `payoff_at(byd, stel, gm, vw, geely)` e `best_response` |
| C17 | **Figura 3** — Payoff BYD em todos-DIFF vs. Nash E3 (R$ bi) |
| C20 | Story PNG — Cena de xadrez executiva (BYD abre, 4 recuam) |
| C21 | **Figura 4** — Comparação visual dos 3 cenários (todos-DIFF / NASH / todos-WAR) |
| C24 | Export resumo executivo |

---

## 3 · Conceitos centrais (5 min)

### Conceito 1 — Decisão estratégica

**Intuição executiva:** L8 responde "**quanto**"; L9 responde "**onde
você fica no tabuleiro**". Ambos são necessários — um executivo que só
otimiza o **seu** h* sem considerar reação dos concorrentes está
**construindo castelo na areia**.

### Conceito 2 — 5 jogadores × 2 estratégias = 32 perfis

| Jogador | Estratégia | Payoff base |
|---------|-----------|-------------|
| BYD | DIFFERENTIATE | R$ +7,30 bi |
| Stellantis | DIFFERENTIATE | R$ +3,50 bi |
| GM | DIFFERENTIATE | R$ +2,80 bi |
| VW | DIFFERENTIATE | R$ +2,30 bi |
| Geely | DIFFERENTIATE | R$ +1,80 bi |

**Intuição executiva:** **cinco jogadores, 2 estratégias, 32 perfis**.
Esse é o tamanho do **tabuleiro competitivo** do setor EV brasileiro
2025-2027. **Não é exagero** — cada perfil corresponde a uma
realidade de mercado distinta.

### Conceito 3 — Payoffs

$$u_i(s_1, s_2, \ldots, s_n)$$

**Intuição executiva:** **BYD é indiferente à escolha dos outros em
DIFFERENTIATE (R$ +7,30 bi sempre)**. Mas em PRICE_WAR, depende: se
todos brigam, BYD cai para R$ −1,2 bi; se só alguns, sobe. **O payoff
não é absoluto — é relativo ao tabuleiro**.

### Conceito 4 — Equilíbrio de Nash

$$s_i^* \in \arg\max_{s_i} u_i(s_i, s_{-i}^*)$$

**Intuição executiva:** **E3 é o resultado de quatro jogadores forçados
a PRICE_WAR e dois (BYD e Geely) a DIFFERENTIATE**. Nenhum jogador tem
incentivo a **unilateralmente** mudar de estratégia — todos estão
**presos no seu canto do tabuleiro**. É estável **por definição**, não
por bondade.

### Conceito 5 — Best response

$$BR_i(s_{-i}) = \arg\max_{s_i} u_i(s_i, s_{-i})$$

**Intuição executiva:** dado o que os outros fazem, **qual é a
melhor resposta para mim**? No projeto: se 3 dos 4 concorrentes estão
em PRICE_WAR, a BR de Stellantis é **manter PRICE_WAR** (perderia
mais voltando para DIFFERENTIATE). Nash = **todos jogando BR
simultaneamente**.

### Conceito 6 — Dominação estratégica

$$u_i(s_i^A, s_{-i}) > u_i(s_i^B, s_{-i}) \quad \forall s_{-i}$$

**Intuição executiva:** estratégia **dominada** nunca é jogada (em
equilíbrio). No projeto: PRICE_WAR para GM é **dominada** quando os
outros 4 estão em DIFFERENTIATE — por isso GM nunca lidera guerra,
mas pode ser forçado a ela.

---

## 4 · Outputs e visualizações (3 min)

| Figura | Tipo | O que mostra |
|-------:|------|--------------|
| `l9_l8_vs_l9.png` | Diagrama conceitual | Otimização (1 decisão) vs. Estratégia (32 perfis) |
| `l9_payoffs_3scenarios.png` | Bar chart | Payoffs em 3 cenários: todos-DIFF / Nash E3 / todos-PRICE_WAR |
| `l9_board_2x16.png` | Tabuleiro 2D | 32 perfis como matriz visual 2×16 |
| `l9_nash_e3.png` | Tabuleiro 5×2 | Posição do Nash E3 com setas indicando BR de cada jogador |
| `l9_xadrez_story.png` | Ilustração | Cena executiva — BYD abre (DIFFERENTIATE), 4 recuam (PRICE_WAR) |

**Insight #1:** **no Nash E3, BYD ganha R$ +7,30 bi** — o **mesmo** que
ganharia em todos-DIFF. Diferenciação é **estável** mesmo com
concorrentes em guerra. É a posição **vencedora** do projeto.

**Insight #2:** **VW tem o menor payoff absoluto** (R$ +2,30 bi) entre
DIFFERENTIATE, mas **sobrevive** no Nash E3 porque a guerra mata a
margem de todos os outros. **Sobreviver já é vitória quando o setor
briga**.

**Insight #3:** **o tabuleiro 5×2 mostra que Nash E3 NÃO é único** —
existem outros Nash (e.g., todos-PRICE_WAR), mas E3 é o de **maior
payoff para BYD** entre os estáveis. **Estabilidade ≠ otimalidade** —
o D3 escolhe E3 **e** monitora migração para outros Nash.

---

## 5 · Conexão com a base D2 (2 min)

| Cross-ref D2 | Aprofundamento |
|---|---|
| `d3/nb-04-competition-game-theory.ipynb` | Implementação canônica da matriz 5×2 + NASH |
| `D3-INTERDEPENDENCY-S11-COMPETITION.md` | 5 players, 32 perfis, Nash E3 estável |
| `D3-GAME-THEORY.md` | Documento de governança — leitura executiva do NASH |

L9 é a **porta executiva** para o NB-04 (game theory canônico). Quem
entende L9 consegue ler o NB-04 com fluência.

---

## 6 · Chef's tips didáticos (1 min)

- **Armadilha #1 — "Nash = bom para todos":** não. Nash é **estável**,
  não **ótimo social**. Pode ter payoffs ruins para todos (dilema do
  prisioneiro).
- **Armadilha #2 — "Reação do concorrente é irracional":** a **melhor
  resposta** dele **faz sentido dado o que ele vê**. Você não precisa
  "convencê-lo" — você precisa **mudar o tabuleiro** (preço,
  diferenciação, regulação).
- **Insight para gravar:** **estabilidade ≠ vitória**. No D3, o Nash E3
  é escolhido porque é **melhor para BYD entre os estáveis**. Monitorar
  **migração** entre Nash é tão importante quanto escolher o atual.

---

## 7 · Conclusão + cross-link (1 min)

> **Leve para a reunião:** "**Nossa estratégia competitiva é
  diferenciação**" vem do NB-04, do Nash E3, do payoff R$ +7,30 bi
  em todos os cenários estáveis. **Não é opinião — é equilíbrio**.
  Mas Nash **não é eterno**; migração para todos-PRICE_WAR é o
  **risco competitivo #1** a monitorar.

| Próximo passo | Onde ir |
|---|---|
| Próximo na trilha | L10 (framework de decisão) |
| Aprofundar NASH | `d3/nb-04-competition-game-theory.ipynb` |
| Aplicação canônica | NB-04 (5 jogadores × 2 estratégias) |

*Parte da trilha Executive Data Science Learning Progression · BYD Camaçari 2025-2027*
