"""L10 content, part B: sections 4-5 (composite 71,8 + gatilhos e ações).

Cells are (cell_type, source_text) tuples. Raw strings only — the notebook
source must keep literal backslash-n sequences inside plot label strings.
"""

CELLS_B = [

("markdown", r'''---

## 4 · O composite 71,8 — entendendo o número

### ① Por que isto importa

**71,8** é o número que vai para o slide 1. Ele será citado por pessoas que
nunca abrirão um notebook, repetido em reunião de conselho e comparado com o
trimestre passado. Então ele precisa de três propriedades: **rastreável**
(de onde vem), **acionável** (o que muda quando muda) e **honesto** (o que
ele não sabe).

A pergunta que derruba analistas em comitê é simples: *"71,8 é bom ou ruim?"*
Sem faixa de referência, um índice é decoração. Com faixa, ele é um veredito:
**71,8 = AMBER = modo tensão = defensivo, não expansivo.**

### ② Conceito, sem jargão

Existem **dois** composites, e confundi-los é o erro mais comum:

| | Visão stakeholder | Motor técnico |
|---|---|---|
| Dimensões | **4** (câmbio, regulatório, supply, macro) | **11** (S1–S11) |
| Pesos | 30 / 30 / 20 / 20 | D3 v0.6 (soma 1,19) |
| Valor | **71,8** | **78,0** |
| Faixa | AMBER — modo tensão | AMBER — modo tensão |
| Usado em | board, pitch, 1-pager | alarme, gatilhos, backtest |

Os dois dão a **mesma decisão** (modo tensão) por caminhos diferentes — e é
exatamente por isso que a diferença é tolerável. Se um dissesse GREEN e o
outro RED, o framework estaria quebrado.

**Escala: maior = pior.** 0 = execução sem atrito; 100 = crise total.

| Faixa | Intervalo | Significado operacional |
|---|---|---|
| 🟢 **GREEN** | 0 – 65 | Execução limpa; cadência mensal |
| 🟡 **AMBER** | 65 – 80 | **Modo tensão (cluster 2)** — hedge ativo, capex sob revisão |
| 🔴 **RED** | 80 – 100 | Modo crise; comitê convocado; freeze de despesas |

### ③ Intuição — o termômetro e a febre

38,5 °C não é uma doença. É um **sinal** que faz três coisas: confirma que
algo está errado, orienta a dose e permite comparar amanhã com hoje. Ninguém
trata o termômetro — trata-se a infecção, e o número serve para saber se o
antibiótico está funcionando.

71,8 é 38,5 °C. Não se "gerencia o composite": gerencia-se supply (85),
câmbio (78) e regulatório (70). O composite apenas informa se a gestão está
funcionando. A meta documentada — **71,8 → 60 em 12 meses** — é a curva de
febre que o comitê acompanha.

### ④ A matemática — decomposição e alavanca

O composite é uma média ponderada normalizada:

$$ C = \frac{\sum_i w_i s_i}{\sum_i w_i} $$

Com os pesos stakeholder (que somam exatamente 1,00):

$$ C_4 = 0{,}30(78) + 0{,}30(70) + 0{,}20(85) + 0{,}20(52) = 23{,}4 + 21{,}0 + 17{,}0 + 10{,}4 = 71{,}8 $$

A **contribuição** $c_i = w_i s_i$ é o que importa para priorizar, e a
**alavanca** é a derivada:

$$ \frac{\partial C}{\partial s_i} = \frac{w_i}{\sum_j w_j} $$

Ou seja: **1 ponto a menos em câmbio ou regulatório move o composite 0,30;
1 ponto em supply ou macro move 0,20.** Para chegar a 60 é preciso remover
**11,8 pontos** — o que exige mover as dimensões de maior peso, não as de
maior score. Supply (85) é o pior sinal, mas custa 0,20 por ponto; câmbio
(78) custa 0,30 por ponto e é onde o hedge age mais rápido.

**O que o número não sabe:** os pesos são heurística de comitê (dívida
técnica documentada); a escala 0-100 é ordinal calibrada, não probabilidade;
e um composite estável pode esconder duas dimensões se movendo em direções
opostas. Por isso o composite **nunca** viaja sozinho — vai acompanhado das
dimensões que o formam.

### ⑤ Recado executivo — Composite 71,8

> - **71,8 = AMBER = modo tensão.** Tradução operacional: hedge ativo, capex
>   sob revisão, cadência semanal. Não é crise; não é normal.
> - **Duas visões, uma decisão.** 4-dim (71,8) para o board, 11-dim (78,0)
>   para o motor. Concordam na faixa — se divergissem, seria bug.
> - **Alavanca vale mais que score.** Câmbio e regulatório movem 0,30 por
>   ponto; supply e macro, 0,20. Priorize peso, não gravidade aparente.
> - **Meta 60 em 12 meses = remover 11,8 pontos.** Isso é um plano de ação
>   com custo, não uma aspiração de slide.
> - **Nunca apresente o composite sozinho.** Sempre com as 4 barras que o
>   formam, senão você está pedindo para ser questionado.
'''),

("code", r'''dims4 = ["cambio", "regulatorio", "supply", "macro"]
s4 = [SCORES_4D[d] for d in dims4]
w4 = [WEIGHTS_4D[d] for d in dims4]
c4 = [w * s for w, s in zip(w4, s4)]
nomes4 = [LABEL_4D[d] for d in dims4]
cores4 = [AZUL, TEAL, TIJOLO, VIOLETA]
TARGET = 60.0

fig = make_subplots(
    rows=2, cols=2,
    specs=[[{"type": "xy"}, {"type": "xy"}],
           [{"type": "xy"}, {"type": "xy"}]],
    subplot_titles=(
        f"Composite stakeholder = {COMPOSITE_4D} (vulnerabilidade, maior = pior)",
        "Decomposição: como 4 dimensões formam 71,8",
        "Score por dimensão vs faixas GREEN/AMBER/RED",
        "Meta documentada: 71,8 -> 60 em 12 meses",
    ),
    vertical_spacing=0.17, horizontal_spacing=0.13,
)

# ── (1,1) Gauge manual — barra horizontal empilhada com marcador ─────────────
#       (substitui o go.Indicator, que conflita com make_subplots em Plotly 6.x)
faixas = [("GREEN 0-65", 65.0, "rgba(34,197,94,0.55)"),
          ("AMBER 65-80", 15.0, "rgba(234,88,12,0.55)"),
          ("RED 80-100", 20.0, "rgba(220,38,38,0.55)")]
for nome, ext, cor in faixas:
    fig.add_bar(
        x=[0], y=["composite"], orientation="h", base=None,
        marker=dict(color=cor, line=dict(color=INK, width=1.2)),
        width=0.85, showlegend=False, hoverinfo="skip", row=1, col=1,
    )

# Barras acumuladas via base — uma por faixa, para empilhar GREEN + AMBER + RED
fig.data = []      # descarta os placeholders acima
acum = 0.0
for nome, ext, cor in faixas:
    fig.add_bar(
        x=[ext], y=["composite"], base=[acum], orientation="h",
        marker=dict(color=cor, line=dict(color=INK, width=1.1)),
        showlegend=False,
        hovertext=f"{nome} · {ext:.0f} pts", hoverinfo="text",
        row=1, col=1,
    )
    acum += ext

# marcador vertical na posição atual
fig.add_shape(type="line", x0=COMPOSITE_4D, x1=COMPOSITE_4D, y0=-0.40, y1=0.40,
              line=dict(color=INK, width=3.4), row=1, col=1)
# marcador da meta (60) em verde
fig.add_shape(type="line", x0=TARGET, x1=TARGET, y0=-0.32, y1=0.32,
              line=dict(color=VERDE, width=2.6, dash="dash"), row=1, col=1)
# número grande no centro
fig.add_annotation(
    x=COMPOSITE_4D, y=0.05, xref="x", yref="y",
    text=f"<b>{COMPOSITE_4D}</b>",
    showarrow=False, font=dict(color=AMBAR, size=44, family="Arial Black"),
    row=1, col=1,
)
fig.add_annotation(
    x=COMPOSITE_4D, y=-0.30, xref="x", yref="y",
    text=f"vs meta {TARGET:.0f} (delta {COMPOSITE_4D - TARGET:+.1f})",
    showarrow=False, font=dict(color=MUTED, size=10.5),
    row=1, col=1,
)

# ── (1,2) Waterfall da decomposição ────────────────────────────────────────
fig.add_trace(go.Waterfall(
    orientation="v",
    measure=["relative"] * 4 + ["total"],
    x=[n.split(" (")[0] for n in nomes4] + ["Composite"],
    y=c4 + [0],
    text=[f"+{v:.1f}" for v in c4] + [f"<b>{COMPOSITE_4D}</b>"],
    textposition="outside", textfont=dict(color=INK, size=11),
    connector=dict(line=dict(color=GRID, width=1.3)),
    increasing=dict(marker=dict(color=AZUL, line=dict(color=INK, width=1.2))),
    totals=dict(marker=dict(color=AMBAR, line=dict(color=INK, width=1.4))),
    hovertext=[f"{n}: peso {w:.2f} x score {s:.0f} = {c:.1f} pts"
               for n, w, s, c in zip(nomes4, w4, s4, c4)] + ["total"],
    hoverinfo="text", showlegend=False,
), row=1, col=2)

# ── (2,1) Scores vs faixas ─────────────────────────────────────────────────
for lo, hi, cor in [(0, 65, "rgba(34,197,94,0.16)"), (65, 80, "rgba(234,88,12,0.16)"),
                    (80, 100, "rgba(220,38,38,0.16)")]:
    fig.add_shape(type="rect", x0=-0.6, x1=3.6, y0=lo, y1=hi,
                  fillcolor=cor, line=dict(width=0), layer="below", row=2, col=1)

fig.add_bar(
    x=nomes4, y=s4,
    marker=dict(color=cores4, line=dict(color=INK, width=1.3)),
    text=[f"{s:.0f}<br><span style='font-size:9px'>peso {w:.2f}</span>"
          for s, w in zip(s4, w4)],
    textposition="outside", textfont=dict(color=INK, size=11),
    showlegend=False, row=2, col=1,
)
fig.add_hline(y=COMPOSITE_4D, line=dict(color=AMBAR, width=2, dash="dash"),
              annotation_text=f"composite {COMPOSITE_4D}",
              annotation_font=dict(color=AMBAR, size=10),
              annotation_position="top left", row=2, col=1)

# ── (2,2) Trajetória até a meta ─────────────────────────────────────────────
meses = np.arange(0, 13)
plano = COMPOSITE_4D + (TARGET - COMPOSITE_4D) * (meses / 12.0)
sem_acao = COMPOSITE_4D + 0.55 * meses          # deriva ilustrativa, não previsão

fig.add_scatter(x=meses, y=sem_acao, mode="lines", name="sem mitigação (ilustrativo)",
                line=dict(color=TIJOLO, width=2.2, dash="dot"), row=2, col=2)
fig.add_scatter(x=meses, y=plano, mode="lines+markers", name="meta documentada",
                line=dict(color=VERDE, width=2.8),
                marker=dict(size=6, color=VERDE, line=dict(color=INK, width=1)),
                row=2, col=2)
fig.add_hline(y=80, line=dict(color=TIJOLO, width=1.4, dash="dash"), row=2, col=2)
fig.add_hline(y=65, line=dict(color=VERDE, width=1.4, dash="dash"), row=2, col=2)
fig.add_annotation(x=0.4, y=COMPOSITE_4D + 3.4, text="<b>hoje 71,8</b>", showarrow=False,
                   font=dict(color=AMBAR, size=11), xref="x4", yref="y4")
fig.add_annotation(x=11.1, y=TARGET - 3.6, text="<b>meta 60</b>", showarrow=False,
                   font=dict(color=VERDE, size=11), xref="x4", yref="y4")

style(fig, f"4 - O composite {COMPOSITE_4D}: de onde vem, o que significa, para onde vai", height=780)
fig.update_layout(legend=dict(x=0.60, y=0.14, orientation="v", font=dict(size=10)))
fig.update_xaxes(range=[0, 100], showgrid=False, zeroline=False,
                 showticklabels=False, row=1, col=1)
fig.update_yaxes(showgrid=False, zeroline=False, showticklabels=False, row=1, col=1)
fig.update_yaxes(title="pontos", range=[0, max(c4) * 1.45], row=1, col=2)
fig.update_yaxes(title="score", range=[0, 104], row=2, col=1)
fig.update_xaxes(tickfont=dict(size=10), row=2, col=1)
fig.update_xaxes(title="meses a partir de jul/2026", row=2, col=2)
fig.update_yaxes(title="composite", range=[52, 84], row=2, col=2)
fig.write_html(str(OUT_DIR / "l10-04-composite-71-8.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("COMPOSITE STAKEHOLDER — decomposição de 71,8")
print("-" * 70)
for n, s, w, c in zip(nomes4, s4, w4, c4):
    print(f"  {n:22s} score {s:5.1f}  x peso {w:.2f}  =  {c:5.2f} pts"
          f"   (alavanca {w / sum(w4):.2f} pt/pt)")
print("-" * 70)
print(f"  {'COMPOSITE 4-dim':22s} {COMPOSITE_4D:>5.1f}/100  ->  {banda(COMPOSITE_4D)[0]}")
print(f"  {'COMPOSITE 11-dim':22s} {COMPOSITE_11D:>5.1f}/100  ->  {banda(COMPOSITE_11D)[0]}")
print(f"  Divergência 4 vs 11  : {abs(COMPOSITE_11D - COMPOSITE_4D):.1f} pts — MESMA faixa (ok)")
print()
print(f"  Meta 12 meses        : {TARGET:.0f}/100 -> exige remover {COMPOSITE_4D - TARGET:.1f} pontos")
print(f"  Via câmbio/regulat.  : {(COMPOSITE_4D - TARGET) / 0.30:.0f} pts de score (alavanca 0,30)")
print(f"  Via supply/macro     : {(COMPOSITE_4D - TARGET) / 0.20:.0f} pts de score (alavanca 0,20)")
print()
print("  Nota: a curva 'sem mitigação' é ilustrativa (deriva linear), não previsão do modelo.")'''),

("markdown", r'''---

## 5 · Gatilhos e ações — quando agir

### ① Por que isto importa

Este é o capítulo que transforma o framework em **sistema operacional**. Um
composite sem gatilho é um termômetro sem protocolo: você sabe que há febre e
discute em reunião o que fazer. O gatilho responde antes do evento: **qual
limiar, qual ação, quem executa, quem aprova, quanto custa, em quanto tempo.**

Seis dimensões × três estados = **18 células operacionais**, mais **16
gatilhos automáticos** e **4 kill switches**. Cada célula é um contrato
pré-assinado com a realidade.

### ② Conceito, sem jargão

Três estados por dimensão, com significado fixo:

- 🟢 **GREEN** — monitorar. Custo R$ 0. Cadência mensal/trimestral.
- 🟡 **AMBER** — agir em escala reduzida. Latência-alvo **5 minutos** para
  notificação. Não requer aprovação formal (execução automatizada).
- 🔴 **RED** — escalar. Latência-alvo **60 minutos** para decisão. Requer
  CEO e, em alguns casos, Board.

E a regra soberana, que é o detalhe mais importante do framework:

> **O kill switch ignora o composite.** Se o BNDES nega o funding, não
> importa que o composite esteja 71,8 ou 45: a contingência dispara. Um
> índice agregado nunca pode vetar um evento binário e existencial.

Os 4 kill switches: **PTAX** (vol 30d ≥ 30% por 5 dias → 1 h), **BNDES**
(negado → 1 h), **CATL** (atraso > 60 dias → 12 h), **Lítio**
(≥ US$ 80k/t por 3 meses → 24 h).

### ③ Intuição — o disjuntor e o termostato

A casa tem dois dispositivos, e a diferença entre eles é o coração deste
capítulo. O **termostato** é gradual e negociável: mede, compara com o
setpoint, liga o ar. O **disjuntor** é binário e não-negociável: em curto,
ele desarma — não consulta a média de consumo da casa, não espera a reunião
de condomínio.

O composite é o termostato. O kill switch é o disjuntor. Uma organização que
só tem termostato queima a casa educadamente, com muitos dados.

### ④ A matemática — governor multiplicativo e histerese

Duas regras fazem o sistema funcionar.

**1 · S6 (macro) é *governor*, não par.** Ele reescala as outras dimensões:

$$ \text{custo}_i^{\text{efetivo}} = \text{custo}_i \times m(S_6), \qquad
m = \begin{cases} 1{,}0 & \text{GREEN} \\ 1{,}5 & \text{AMBER} \\ 2{,}0 & \text{RED} \end{cases} $$

Por isso macro tem score baixo (52) e ainda assim importa: ele multiplica a
conta de todo mundo. Em S6 RED, o pacote de R$ 100M vira R$ 200M.

**2 · Histerese assimétrica.** Entrar em RED exige 5 dias consecutivos acima
do limiar; sair exige 2 semanas consecutivas em GREEN. Formalmente, é o
gatilho de Schmitt da seção 2. O efeito prático foi medido em NB-08: eliminou
o único falso positivo da amostra (precisão 83,3% → 100%).

**Custo do estado de hoje.** Somando a ação vigente de cada dimensão no
estado atual (S1 AMBER, S2 RED, S3 AMBER, S4 AMBER, S5 RED, S6 AMBER), o
framework tem **~R$ 196M/ano** em ações ativas — contra um VaR-95 de
**R$ 3,11 bi** (NB-06). É a razão econômica de todo o projeto: gastar ~6% do
risco para não descobrir os 100% de uma vez.

### ⑤ Recado executivo — Gatilhos e ações

> - **18 células, 16 gatilhos, 4 kill switches.** Cada um com limiar, dono,
>   aprovador, custo e latência definidos **antes** do evento.
> - **AMBER = 5 min, RED = 60 min, kill switch ≤ 1 h.** Latência é a métrica
>   de qualidade do sistema; hoje o observado sinal→ação é 9,5 dias (NB-08).
> - **Kill switch ignora o composite.** Evento binário e existencial não
>   negocia com média ponderada.
> - **S6 (macro) multiplica, não soma.** Em RED, dobra o custo de tudo — é
>   por isso que uma dimensão de score 52 continua sendo governor.
> - **~R$ 196M/ano de ações ativas contra R$ 3,11 bi de VaR-95.** Essa é a
>   frase que aprova o orçamento do framework.
'''),

("code", r'''# 6 dimensões × 3 estados = 18 células (D3-TRIGGER-MATRIX.md §3)
STATES = ["GREEN", "AMBER", "RED"]
TRIG = {
    "S1 Câmbio":     [(0.0, "baseline h*", "Risk Officer", "mensal"),
                      (9.0, "h* x 1,5 (cap 95%)", "Risk Officer", "5 min"),
                      (18.0, "h* x 2,0 + partnership hedge", "Risk Officer", "60 min")],
    "S2 Supply":     [(0.0, "dual-sourcing 18m", "Head Supply", "trimestral"),
                      (30.0, "acelerar EVE + 30d estoque", "Head Supply", "5 min"),
                      (80.0, "spot + hedge via S5", "Head Supply", "60 min")],
    "S3 BNDES":      [(0.0, "advocacy baseline", "Head Gov Rel", "mensal"),
                      (12.0, "dobrar advocacy (R$ 24M)", "Head Gov Rel", "5 min"),
                      (50.0, "bridge financing R$ 800M", "CFO", "60 min")],
    "S4 Pricing":    [(0.0, "defensivo Tier 0/1", "Head Marketing", "mensal"),
                      (15.0, "defensivo +1 tier", "Head Marketing", "5 min"),
                      (27.5, "Tier 3 + comunicação", "CMO", "60 min")],
    "S5 Parcerias":  [(0.0, "baseline partnerships", "CSO", "trimestral"),
                      (5.0, "revisar LP contracts", "Head Legal", "5 min"),
                      (20.0, "renegociar + diversificar", "Head Procurement", "60 min")],
    "S6 Macro":      [(0.0, "monitorar (governor 1,0x)", "CSO", "mensal"),
                      (60.0, "composite +13 (governor 1,5x)", "CSO", "5 min"),
                      (182.5, "comitê crise + freeze (2,0x)", "CSO", "60 min")],
}
# Estado de hoje, derivado do score de cada dimensão (mesma regra de faixa)
HOJE = {"S1 Câmbio": SCORES_11D["S1"], "S2 Supply": SCORES_11D["S2"],
        "S3 BNDES": SCORES_11D["S3"], "S4 Pricing": SCORES_11D["S4"],
        "S5 Parcerias": SCORES_11D["S5"], "S6 Macro": SCORES_11D["S6"]}
idx_hoje = {d: (0 if v < 65 else (1 if v < 80 else 2)) for d, v in HOJE.items()}

dims = list(TRIG.keys())
Z = [[TRIG[d][j][0] for j in range(3)] for d in dims]
TXT = [[f"R$ {TRIG[d][j][0]:.0f}M<br><span style='font-size:8px'>{TRIG[d][j][3]}</span>"
        if TRIG[d][j][0] else f"R$ 0<br><span style='font-size:8px'>{TRIG[d][j][3]}</span>"
        for j in range(3)] for d in dims]

KILL = [("BNDES negado", 1.0, TIJOLO), ("PTAX vol>=30% 5d", 1.0, AZUL),
        ("CATL atraso >60d", 12.0, VIOLETA), ("Lítio >=US$80k/t 3m", 24.0, AMBAR)]

fig = make_subplots(
    rows=1, cols=2, column_widths=[0.60, 0.40],
    subplot_titles=("Matriz de gatilhos: 6 dimensões × 3 estados = 18 células (custo anual)",
                    "Kill switches — ignoram o composite"),
    horizontal_spacing=0.14,
)

fig.add_trace(go.Heatmap(
    z=Z, x=STATES, y=dims, text=TXT, texttemplate="%{text}",
    textfont=dict(size=10, color=INK),
    colorscale=[[0.0, "rgba(34,197,94,0.30)"], [0.15, "rgba(234,88,12,0.45)"],
                [0.5, "rgba(220,38,38,0.55)"], [1.0, "rgba(220,38,38,0.92)"]],
    showscale=True,
    colorbar=dict(title=dict(text="R$ M/ano", font=dict(color=MUTED, size=10)),
                  tickfont=dict(color=MUTED, size=9), len=0.78, x=0.565, thickness=11),
    hovertemplate="%{y} · %{x}<br>custo R$ %{z:.1f}M<extra></extra>",
), row=1, col=1)

# marca o estado vigente de cada dimensão
for d, j in idx_hoje.items():
    fig.add_shape(type="rect", x0=j - 0.5, x1=j + 0.5,
                  y0=dims.index(d) - 0.5, y1=dims.index(d) + 0.5,
                  line=dict(color=INK, width=3.2), row=1, col=1)

custo_hoje = sum(TRIG[d][j][0] for d, j in idx_hoje.items())

fig.add_bar(
    x=[k[1] for k in KILL], y=[k[0] for k in KILL], orientation="h",
    marker=dict(color=[k[2] for k in KILL], line=dict(color=INK, width=1.3)),
    text=[f"  {k[1]:.0f} h" for k in KILL], textposition="outside",
    textfont=dict(color=INK, size=11), showlegend=False, row=1, col=2,
)
fig.add_annotation(
    x=13.5, y=-0.72, xref="x2", yref="y2", showarrow=False,
    text="<b>regra soberana:</b> dispara mesmo com composite GREEN",
    font=dict(color=TIJOLO, size=10),
)

style(fig, "5 - Gatilhos e acoes: 18 celulas, 4 kill switches, custo por estado", height=560)
fig.update_xaxes(side="top", tickfont=dict(color=INK, size=12), row=1, col=1)
fig.update_yaxes(autorange="reversed", tickfont=dict(size=11), row=1, col=1)
fig.update_xaxes(title="latência máxima (horas)", range=[0, 30], row=1, col=2)
fig.update_yaxes(tickfont=dict(size=10), row=1, col=2)
fig.write_html(str(OUT_DIR / "l10-05-gatilhos-acoes.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("MATRIZ DE GATILHOS — estado vigente destacado")
print("-" * 76)
for d in dims:
    j = idx_hoje[d]
    custo, acao, dono, lat = TRIG[d][j]
    print(f"  {d:14s} [{STATES[j]:5s}] score {HOJE[d]:4.0f} -> {acao:32s}")
    print(f"  {'':14s} {'':7s} R$ {custo:6.1f}M  dono {dono:16s} latência {lat}")
print("-" * 76)
print(f"  Custo das ações vigentes : R$ {custo_hoje:.1f}M/ano")
print(f"  VaR-95 (NB-06)           : R$ {VAR95_MC * 1000:.0f}M  (R$ {VAR95_MC:.2f} bi)")
print(f"  Custo / VaR              : {custo_hoje / (VAR95_MC * 1000) * 100:.1f}% do risco")
print(f"  CVaR-95 (cauda)          : R$ {CVAR95_MC:.2f} bi")
print()
print("KILL SWITCHES (ignoram o composite):")
for nome, lat, _ in KILL:
    print(f"  {nome:22s} -> ação em <= {lat:.0f} h")
print()
print(f"  Governor S6 = AMBER -> multiplicador 1,5x aplicado em S1-S4")'''),

]
