"""L10 content, part C: sections 6-7 + export do resumo executivo + fechamento.

Cells are (cell_type, source_text) tuples. Raw strings only — the notebook
source must keep literal backslash-n sequences inside plot label strings.
"""

CELLS_C = [

("markdown", r'''---

## 6 · Backtesting — validando a abordagem

### ① Por que isto importa

Todo framework parece inteligente no PowerPoint. A pergunta que separa
consultoria de engenharia é: **"se este sinal existisse em 2020, ele teria
acertado?"** Sem essa resposta, o composite é uma opinião com decimais.

NB-08 aplicou os gatilhos de hoje a **6 eventos de stress reais (2020–2025)**
e contou acertos e erros. É a única seção do framework que pode **reprovar**
o framework — e é por isso que ela existe.

### ② Conceito, sem jargão

O vocabulário mínimo, com o custo de cada erro:

| Resultado | O que é | Custo real |
|---|---|---|
| **TP** (verdadeiro positivo) | sinal disparou, crise veio | ✅ o framework pagou |
| **FP** (falso positivo) | sinal disparou, nada aconteceu | 💸 hedge desnecessário + credibilidade |
| **FN** (falso negativo) | sinal calado, crise veio | ☠️ o erro que mata a empresa |

Os 6 eventos testados:

| # | Evento | Δ PTAX | Δ Lítio | Sinal | Resultado | TTA |
|---|---|---|---|---|---|---|
| 1 | COVID-19 (mar/2020) | +42,7% | +75% | 🔴 RED | ✅ TP | 7 d |
| 2 | Escassez de chips (2021) | 0% | +53,8% | 🔴 RED | ✅ TP | 12 d |
| 3 | Eleição 2022 | +9,4% | +17,6% | 🔴 RED | ✅ TP | 8 d |
| 4 | Spike do lítio (jun/2022) | 0% | +900% | 🔴 RED | ✅ TP | 9 d |
| 5 | **Eleição 2024** | +10,9% | +8,3% | 🔴 RED | ❌ **FP** | 10 d |
| 6 | Estagflação 2025 | +7,9% | +18,2% | 🟡 AMBER | ✅ TP | 11 d |

**5 TP, 1 FP, 0 FN → precisão 83,3%.** O evento 5 é o mais instrutivo do
projeto: o PTAX subiu 10,9% e o sinal gritou RED, mas **não houve crise** —
era fluxo de *carry trade* entrando no Brasil, não fuga de capital. Mesma
variação, significado oposto.

As **4 correções** derivadas dos erros:

1. **Histerese** — exige 2 semanas em GREEN para sair de RED (mata flip-flop).
2. **Filtro de carry trade** — se fluxo de capital BR > 0, sinal FX × 0,5
   (RED → AMBER). *Esta é a correção que elimina o FP do evento 5.*
3. **Assimetria do lítio** — Li < US$ 8k/t é **sinal de compra**, não risco.
4. **Confirmação de 5 dias** — RED exige 5 dias consecutivos no limiar.

Resultado após correções: **1 FP → 0 FP, precisão 83,3% → 100%.**

### ③ Intuição — o detector de metais e a ressalva honesta

Um detector calibrado para achar toda moeda também apita em cada tampinha.
Um calibrado para nunca apitar em falso deixa passar o anel de ouro. A
calibragem é uma **escolha de negócio**, não um parâmetro técnico: aqui,
0 FN foi priorizado sobre 0 FP, porque perder a crise custa bilhões e um
hedge desnecessário custa milhões.

E a ressalva que deve ser dita em voz alta antes de alguém perguntar:
**as correções foram desenhadas olhando os mesmos 6 eventos que elas
corrigem.** Isso é *in-sample fitting*. Os 100% são um teto otimista, não uma
promessa. A validação honesta é *out-of-sample*: aplicar estas regras
congeladas aos próximos 6 eventos, sem tocar em nada. Amostra de 6 também é
pequena — o intervalo de confiança em torno de 83,3% é largo.

### ④ A matemática — precisão, recall e o que ainda não sabemos

$$ \text{Precisão} = \frac{TP}{TP+FP} = \frac{5}{5+1} = 83{,}3\% \quad\longrightarrow\quad \frac{5}{5+0} = 100\% $$

$$ \text{Recall} = \frac{TP}{TP+FN} = \frac{5}{5+0} = 100\% $$

Recall 100% é a métrica que mais importa aqui: **nenhuma crise passou
despercebida**. Mas atenção — recall só é mensurável sobre os eventos que
alguém rotulou como crise. FNs verdadeiros são invisíveis por construção: se
o framework nunca apitou e ninguém chamou de crise, o evento não entra na
tabela. É o ponto cego estrutural de qualquer backtest de sinal.

E a métrica que reprova o framework mesmo com precisão 100%:

$$ \text{TTA médio} = 9{,}5 \text{ dias} \qquad \text{vs} \qquad \text{meta} = 5 \text{ dias úteis} $$

O sinal está certo e **chega tarde**. Nos 6 eventos, o TTA variou de 7 a 12
dias e **nunca** bateu a meta. Um sinal correto entregue com 9,5 dias de
atraso captura uma fração do valor de um sinal correto entregue em 2.

### ⑤ Recado executivo — Backtesting

> - **5 TP, 1 FP, 0 FN em 6 eventos reais (2020–2025).** Precisão 83,3%,
>   recall 100% — nenhuma crise passou.
> - **As 4 correções levam a precisão a 100%** — mas foram ajustadas nos
>   mesmos 6 eventos. É teto otimista, não promessa. O teste real é
>   *out-of-sample*, congelado.
> - **O FP mais instrutivo: eleição 2024.** +10,9% de PTAX com *carry trade*
>   entrando ≠ crise. Direção sem contexto de fluxo engana.
> - **0 falso negativo é a métrica que protege a empresa.** Preferimos apitar
>   à toa a perder a crise — e isso é escolha de negócio, não de modelo.
> - **O problema não é o modelo, é o relógio: 9,5 d vs meta de 5 d.** Nenhum
>   dos 6 eventos bateu a meta. Corrigir aprovação vale mais que refinar
>   qualquer parâmetro.
'''),

("code", r'''EV = NB["nb08"]["events"]
ev_ord = sorted(EV, key=lambda e: e["date"])
x_lbl = [e["date"][:7] for e in ev_ord]
ptax = [e["ptax_delta_pct"] for e in ev_ord]
lit = [e["lithium_delta_pct"] for e in ev_ord]
tta = [e["time_to_action_d"] for e in ev_ord]
is_fp = [e["tp_fp"] == "FP" for e in ev_ord]
nomes = [e["name"] for e in ev_ord]

fig = make_subplots(
    rows=2, cols=2, column_widths=[0.60, 0.40], row_heights=[0.56, 0.44],
    subplot_titles=("6 eventos de stress reais (2020-2025) — sinal vs realidade",
                    "Antes × depois das 4 correções",
                    "Tempo até a ação (TTA) por evento vs meta de 5 dias úteis",
                    "As 4 correções e o erro que cada uma mata"),
    vertical_spacing=0.19, horizontal_spacing=0.13,
)

# ── (1,1) timeline dos eventos ───────────────────────────────────────────────
sizes = [14 + 26 * (min(l, 200.0) / 200.0) ** 0.5 for l in lit]
for fp_flag, cor, simb, nome in [(False, VERDE, "circle", "TP — sinal correto"),
                                 (True, TIJOLO, "x", "FP — falso positivo")]:
    ii = [i for i in range(len(ev_ord)) if is_fp[i] == fp_flag]
    if not ii:
        continue
    fig.add_scatter(
        x=[x_lbl[i] for i in ii], y=[ptax[i] for i in ii], mode="markers",
        marker=dict(size=[sizes[i] for i in ii], color=cor, symbol=simb,
                    line=dict(color=INK, width=1.6), opacity=0.92),
        name=nome,
        hovertext=[f"{nomes[i]}<br>PTAX {ptax[i]:+.1f}% · Lítio {lit[i]:+.0f}%"
                   f"<br>sinal {ev_ord[i]['trigger']} · {ev_ord[i]['tp_fp']}"
                   f"<br>TTA {tta[i]} d" for i in ii],
        hoverinfo="text", row=1, col=1,
    )
fig.add_annotation(x="2024-10", y=ptax[x_lbl.index("2024-10")] + 9.5,
                   text="<b>FP: carry trade,<br>não crise</b>", showarrow=True,
                   arrowcolor=TIJOLO, arrowhead=2, ax=0, ay=-26,
                   font=dict(color=TIJOLO, size=10), xref="x", yref="y")
fig.add_annotation(x="2022-06", y=6.0, text="Lítio +900%<br>(bolha marca o lítio)",
                   showarrow=False, font=dict(color=MUTED, size=9), xref="x", yref="y")

# ── (1,2) antes × depois ────────────────────────────────────────────────────
metricas = ["Precisão (%)", "Falsos positivos", "Recall (%)"]
antes = [BT["accuracy_pct"], BT["fp"], 100.0]
depois = [BT_FIX["accuracy_pct"], BT_FIX["fp"], 100.0]
fig.add_bar(x=metricas, y=antes, name="antes das correções",
            marker=dict(color=AMBAR, line=dict(color=INK, width=1.2)),
            text=[f"{v:.1f}" if v > 5 else f"{v:.0f}" for v in antes],
            textposition="outside", textfont=dict(color=INK, size=10), row=1, col=2)
fig.add_bar(x=metricas, y=depois, name="depois das correções",
            marker=dict(color=VERDE, line=dict(color=INK, width=1.2)),
            text=[f"{v:.1f}" if v > 5 else f"{v:.0f}" for v in depois],
            textposition="outside", textfont=dict(color=INK, size=10), row=1, col=2)

# ── (2,1) TTA por evento ────────────────────────────────────────────────────
fig.add_bar(
    x=x_lbl, y=tta,
    marker=dict(color=[TIJOLO if f else AZUL for f in is_fp],
                line=dict(color=INK, width=1.2)),
    text=[f"{t} d" for t in tta], textposition="outside",
    textfont=dict(color=MUTED, size=10), showlegend=False, row=2, col=1,
)
fig.add_hline(y=5.0, line=dict(color=VERDE, width=2, dash="dash"),
              annotation_text="meta 5 dias úteis", annotation_position="top left",
              annotation_font=dict(color=VERDE, size=10), row=2, col=1)
fig.add_hline(y=BT["avg_time_to_action_d"], line=dict(color=AMBAR, width=1.8, dash="dot"),
              annotation_text=f"média {BT['avg_time_to_action_d']:.1f} d",
              annotation_position="top right",
              annotation_font=dict(color=AMBAR, size=10), row=2, col=1)

# ── (2,2) as 4 correções ────────────────────────────────────────────────────
FIXES = [("1 · Histerese", "flip-flop no ruído", 2.0, VIOLETA),
         ("2 · Filtro carry trade", "FP da eleição 2024", 3.0, VERDE),
         ("3 · Assimetria lítio", "preço baixo lido como risco", 1.0, TEAL),
         ("4 · Confirmação 5 dias", "spike de 1 dia", 2.0, AZUL)]
fig.add_bar(
    x=[f[2] for f in FIXES], y=[f[0] for f in FIXES], orientation="h",
    marker=dict(color=[f[3] for f in FIXES], line=dict(color=INK, width=1.2)),
    text=["  mata: " + f[1] for f in FIXES], textposition="inside",
    insidetextanchor="start", textfont=dict(color=BG, size=9),
    showlegend=False, row=2, col=2,
)

style(fig, "6 - Backtesting: o sinal funciona? 5 TP, 1 FP, 0 FN em 6 eventos reais", height=800)
fig.update_layout(legend=dict(x=0.62, y=1.06, orientation="h", font=dict(size=10)),
                  barmode="group")
fig.update_yaxes(title="Δ PTAX (%)", range=[-6, 52], row=1, col=1)
fig.update_xaxes(tickfont=dict(size=10), row=1, col=1)
fig.update_yaxes(range=[0, 118], row=1, col=2)
fig.update_yaxes(title="dias", range=[0, 15], row=2, col=1)
fig.update_xaxes(visible=False, range=[0, 3.4], row=2, col=2)
fig.update_yaxes(tickfont=dict(size=10), row=2, col=2)
fig.write_html(str(OUT_DIR / "l10-06-backtesting.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("BACKTESTING — 6 eventos de stress (2020-2025)")
print("-" * 78)
for e in ev_ord:
    marca = "OK " if e["tp_fp"] == "TP" else "ERR"
    print(f"  [{marca}] {e['date'][:7]}  {e['name']:30s} PTAX {e['ptax_delta_pct']:+6.1f}% "
          f"Li {e['lithium_delta_pct']:+6.1f}%  {e['trigger']:5s} {e['tp_fp']:2s} "
          f"TTA {e['time_to_action_d']:2d}d")
print("-" * 78)
print(f"  Antes das correções : {BT['tp']} TP · {BT['fp']} FP · 0 FN -> "
      f"precisão {BT['accuracy_pct']:.1f}% · recall 100,0%")
print(f"  Depois das correções: {BT_FIX['tp']} TP · {BT_FIX['fp']} FP · 0 FN -> "
      f"precisão {BT_FIX['accuracy_pct']:.1f}% · recall 100,0%")
print(f"  TTA médio           : {BT['avg_time_to_action_d']:.1f} dias (meta 5) — "
      f"{sum(1 for t in tta if t <= 5)}/{len(tta)} eventos dentro da meta")
print()
print("  Ressalva metodológica: as 4 correções foram calibradas nos MESMOS 6 eventos.")
print("  100% é teto in-sample. Validação honesta = out-of-sample com regras congeladas.")'''),

("markdown", r'''---

## 7 · Resumo executivo — o que levar para a reunião

### ① Por que isto importa

Se o executivo esquecer tudo deste caderno e lembrar de **uma tela**, que seja
esta. O painel abaixo é o formato em que o framework realmente circula:
quatro KPIs no topo, o ranking de risco no meio, o orçamento em ação embaixo.

### ② As sete coisas que sobrevivem à reunião

| # | O que lembrar | Número | Fonte |
|---|---|---|---|
| 1 | O estado atual tem nome e faixa | **71,8 = AMBER (modo tensão)** | NB-05 |
| 2 | O risco tem tamanho | **VaR-95 R$ 3,11 bi · CVaR R$ 3,46 bi** | NB-06 |
| 3 | Risco não soma — acopla | **S1×S2: R$ 6,10 bi → R$ 9,16 bi (+50%)** | NB-07 |
| 4 | O pior sinal é ESG, e ele desliga o funding | **S7 = 92 · kill switch BNDES** | NB-03 |
| 5 | O sinal foi validado no passado | **5 TP · 1 FP · 0 FN → 100% pós-correção** | NB-08 |
| 6 | O gargalo é execução, não modelo | **9,5 d observado vs 5 d de meta** | NB-08 |
| 7 | O framework se paga | **~R$ 196M/ano em ações vs R$ 3,11 bi de VaR** | D3 |

### ③ A frase de abertura

> *"Estamos em **71,8 sobre 100** — modo tensão, não crise. O risco medido é
> **R$ 3,11 bi de VaR-95**, e ele **acopla**: câmbio com supply juntos valem
> 50% mais que somados. O pior sinal é **ESG (92)**, porque ele desliga o
> BNDES. O sinal foi validado em **6 eventos reais com zero falso negativo**.
> Estamos gastando **~R$ 196M/ano** para proteger **R$ 3,11 bi** — e o único
> problema real é que levamos **9,5 dias** para agir quando a meta é 5."*

Cinco números, uma decisão, nenhum jargão. É isto que o framework entrega.

### ④ Recado executivo — final

> - **Diga a faixa, não só o número.** "71,8" não decide nada; "modo tensão"
>   decide.
> - **Sempre traga o custo ao lado do risco.** R$ 196M vs R$ 3,11 bi é o
>   argumento que aprova orçamento.
> - **Declare as limitações antes da pergunta.** Pesos heurísticos, amostra de
>   6 eventos, correções in-sample. Quem antecipa a crítica mantém a
>   credibilidade.
> - **Termine com o gargalo, não com o gráfico.** A próxima decisão do comitê
>   não é sobre o GARCH — é sobre encurtar a aprovação de 9,5 para 5 dias.
'''),

("code", r'''top = sorted(DIM_11, key=lambda d: d[2], reverse=True)[:6]
custo_hoje_M = sum(TRIG[d][j][0] for d, j in idx_hoje.items())
var_M = VAR95_MC * 1000

fig = make_subplots(
    rows=3, cols=4,
    specs=[[{"type": "xy"}, {"type": "xy"}, {"type": "xy"}, {"type": "xy"}],
           [{"type": "xy", "colspan": 2}, None, {"type": "xy", "colspan": 2}, None],
           [{"type": "xy", "colspan": 4}, None, None, None]],
    row_heights=[0.24, 0.40, 0.36],
    subplot_titles=("", "", "", "",
                    "Top-6 dimensões por score (maior = pior)",
                    "Custo da proteção vs risco protegido (R$ M)",
                    "Onde estão os R$ {:.0f}M/ano — ação vigente, dono e latência".format(custo_hoje_M)),
    vertical_spacing=0.13, horizontal_spacing=0.14,
)

# ── Fita de KPIs ────────────────────────────────────────────────────────────
#       Cartoes construidos com annotations (substitui go.Indicator,
#       que conflita com make_subplots em Plotly 6.x).
KPIS = [
    (COMPOSITE_4D, "Composite", "AMBER · modo tensão", AMBAR, "/100", TARGET,
     f"{(COMPOSITE_4D-TARGET):+.1f} vs meta 60"),
    (VAR95_MC, "VaR-95 (NB-06)", f"CVaR-95 R$ {CVAR95_MC:.2f} bi", TIJOLO, " bi", None,
     "Moeda: R$ bilhões · horizonte 126 d"),
    (BT_FIX["accuracy_pct"], "Precisão pós-correção", "0 falso negativo",
     VERDE, "%", BT["accuracy_pct"],
     f"depois das 4 correções (NB-08) · era {BT['accuracy_pct']:.1f}%"),
    (BT["avg_time_to_action_d"], "TTA observado", "meta 5 dias úteis",
     AZUL, " d", 5.0, f"gap de {BT['avg_time_to_action_d']-5.0:.1f} d — aprovação, não modelo"),
]
for i, (val, titulo, sub, cor, suf, ref, delta_txt) in enumerate(KPIS):
    col = i + 1
    fig.add_shape(type="rect", x0=0, x1=1, y0=0, y1=1,
                  fillcolor="rgba(255,255,255,0.04)",
                  line=dict(color=GRID, width=1.2), row=1, col=col)
    fig.add_bar(x=[0], y=[0], marker=dict(color="rgba(0,0,0,0)"),
                showlegend=False, hoverinfo="skip", row=1, col=col)
    fmt = ".0f" if val >= 100 else ".1f"
    fig.add_annotation(x=0.5, y=0.62, xref=f"x{i+1}", yref=f"y{i+1}",
                       text=f"<b>{val:{fmt}}{suf}</b>",
                       showarrow=False, font=dict(color=cor, size=30, family="Arial Black"),
                       row=1, col=col)
    fig.add_annotation(x=0.5, y=0.30, xref=f"x{i+1}", yref=f"y{i+1}",
                       text=f"<b>{titulo}</b>",
                       showarrow=False, font=dict(color=INK, size=12),
                       row=1, col=col)
    fig.add_annotation(x=0.5, y=0.12, xref=f"x{i+1}", yref=f"y{i+1}",
                       text=f"{sub}",
                       showarrow=False, font=dict(color=MUTED, size=10),
                       row=1, col=col)
    fig.add_annotation(x=0.5, y=-0.05, xref=f"x{i+1}", yref=f"y{i+1}",
                       text=f"<i>{delta_txt}</i>",
                       showarrow=False, font=dict(color=cor if ref is not None else MUTED, size=9.5),
                       row=1, col=col)
    fig.update_xaxes(visible=False, range=[-0.05, 1.05], row=1, col=col)
    fig.update_yaxes(visible=False, range=[-0.15, 1.10], row=1, col=col)

# ── (2,1) Top-6 riscos ──────────────────────────────────────────────────────
fig.add_bar(
    x=[d[2] for d in top][::-1], y=[d[0] + " · " + d[1] for d in top][::-1],
    orientation="h",
    marker=dict(color=[TIJOLO if d[2] >= 80 else AMBAR for d in top][::-1],
                line=dict(color=INK, width=1.2)),
    text=[f" {d[2]:.0f}  ({d[4]})" for d in top][::-1], textposition="outside",
    textfont=dict(color=MUTED, size=10), showlegend=False, row=2, col=1,
)
fig.add_vline(x=80, line=dict(color=TIJOLO, width=1.6, dash="dash"), row=2, col=1)
fig.add_annotation(x=93.5, y=5.55, text="<b>S7 ESG: kill switch<br>do BNDES</b>",
                   showarrow=False, font=dict(color=TIJOLO, size=9.5),
                   xref="x", yref="y")

# ── (2,3) Custo vs risco ────────────────────────────────────────────────────
comp = [("Ações vigentes<br>(custo/ano)", custo_hoje_M, VERDE),
        ("VaR-95<br>(risco 126d)", var_M, AMBAR),
        ("CVaR-95<br>(cauda)", CVAR95_MC * 1000, TIJOLO)]
fig.add_bar(
    x=[c[0] for c in comp], y=[c[1] for c in comp],
    marker=dict(color=[c[2] for c in comp], line=dict(color=INK, width=1.3)),
    text=[f"R$ {c[1]:,.0f}M".replace(",", ".") for c in comp],
    textposition="outside", textfont=dict(color=INK, size=11),
    showlegend=False, row=2, col=3,
)
fig.add_annotation(
    x=0, y=var_M * 0.55,
    text=f"<b>{custo_hoje_M / var_M * 100:.1f}% do VaR</b><br>protege o resto",
    showarrow=False, font=dict(color=VERDE, size=10), xref="x2", yref="y2",
)

# ── (3,1) Onde está o dinheiro ──────────────────────────────────────────────
dim_ord = sorted(dims, key=lambda d: TRIG[d][idx_hoje[d]][0], reverse=True)
cor_estado = {0: VERDE, 1: AMBAR, 2: TIJOLO}
fig.add_bar(
    x=[TRIG[d][idx_hoje[d]][0] for d in dim_ord],
    y=[f"{d}  [{STATES[idx_hoje[d]]}]" for d in dim_ord],
    orientation="h",
    marker=dict(color=[cor_estado[idx_hoje[d]] for d in dim_ord],
                line=dict(color=INK, width=1.2)),
    text=[f"  R$ {TRIG[d][idx_hoje[d]][0]:.0f}M · {TRIG[d][idx_hoje[d]][1]}"
          f" · {TRIG[d][idx_hoje[d]][2]} · {TRIG[d][idx_hoje[d]][3]}" for d in dim_ord],
    textposition="outside", textfont=dict(color=MUTED, size=9.5),
    showlegend=False, row=3, col=1,
)

style(fig, "7 - Resumo executivo: uma tela, cinco numeros, uma decisao", height=1000)
fig.update_xaxes(title="score", range=[0, 108], row=2, col=1)
fig.update_yaxes(tickfont=dict(size=9.5), row=2, col=1)
fig.update_yaxes(title="R$ M", range=[0, var_M * 1.30], row=2, col=3)
fig.update_xaxes(tickfont=dict(size=9.5), row=2, col=3)
fig.update_xaxes(title="R$ M/ano", range=[0, 320], row=3, col=1)
fig.update_yaxes(tickfont=dict(size=10), row=3, col=1)
fig.write_html(str(OUT_DIR / "l10-07-resumo-executivo.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("=" * 78)
print("RESUMO EXECUTIVO — FRAMEWORK DE DECISÃO BYD CAMAÇARI (jul/2026)")
print("=" * 78)
print(f"  1. Estado          : composite {COMPOSITE_4D}/100 -> {banda(COMPOSITE_4D)[0]}")
print(f"                       (motor técnico 11-dim: {COMPOSITE_11D}/100, mesma faixa)")
print(f"  2. Risco           : VaR-95 R$ {VAR95_MC:.2f} bi | CVaR-95 R$ {CVAR95_MC:.2f} bi")
print(f"  3. Acoplamento     : S1+S2 somados R$ {FX_VAR + SUPPLY_VAR:.2f} bi -> "
      f"acoplados R$ {COMBINED_VAR:.2f} bi (+{(COMBINED_VAR/(FX_VAR+SUPPLY_VAR)-1)*100:.0f}%)")
print(f"  4. Pior sinal      : S7 ESG score {SCORES_11D['S7']:.0f} — kill switch do BNDES "
      f"(prob. {KILL_PROB*100:.0f}%)")
print(f"  5. Validação       : {BT['tp']} TP · {BT['fp']} FP · 0 FN -> "
      f"{BT_FIX['accuracy_pct']:.0f}% pós-correção")
print(f"  6. Gargalo         : TTA {BT['avg_time_to_action_d']:.1f} d vs meta 5 d "
      f"(aprovação, não modelagem)")
print(f"  7. Economia        : R$ {custo_hoje_M:.0f}M/ano protegendo R$ {var_M:,.0f}M "
      f"({custo_hoje_M/var_M*100:.1f}%)".replace(",", "."))
print("-" * 78)
print("  DECISÃO: modo tensão -> defensivo, não expansivo.")
print("  Hedge ativo, capex sob revisão, cadência semanal, kill switches armados.")
print("=" * 78)'''),

("markdown", r'''---

## Resumo executivo — exportação

O bloco abaixo consolida os oito notebooks prescritivos (NB-01 … NB-08) com a
leitura executiva do framework e salva
`outputs/learning/l10_framework_executive.json`.
'''),

("code", r'''resumo = {
    "notebook": "L10 - Decision Framework: Integration for Executives",
    "computed_at": datetime.now().strftime("%Y-%m-%d"),
    "audience": "executivos nao-tecnicos",
    "format": "narrativa-primeiro (Conceito -> Intuicao -> Matematica -> Codigo -> Recado)",
    "role": "sintese final da serie de aprendizado L0-L10",
    "sources": {
        "prescriptive_notebooks": {
            "NB-01": {"tema": "PTAX + GARCH(1,1)-t", "entrega": "vol 12m, persistencia, meia-vida",
                      "vol_12m": VOL_12M, "persistencia": PERSIST, "dimensao": "S1"},
            "NB-02": {"tema": "Supply chain + HHI", "entrega": "HHI refino, VaR litio",
                      "hhi_refino": HHI_REFINO, "dimensao": "S2 / S5"},
            "NB-03": {"tema": "Cenarios regulatorios", "entrega": "ViE esperado, kill switch",
                      "vie_esperado_pct": VIE_ESPERADO, "kill_switch_prob": KILL_PROB,
                      "dimensao": "S3 / S7"},
            "NB-04": {"tema": "Teoria dos jogos", "entrega": "Nash E3, NPV agregado",
                      "npv_nash_B": NPV_NASH, "dimensao": "S4 / S11"},
            "NB-05": {"tema": "Indice composto", "entrega": "pesos 30/30/20/20",
                      "composite_4d": COMPOSITE_4D, "dimensao": "o proprio composite"},
            "NB-06": {"tema": "Monte Carlo multivariado", "entrega": "VaR-95, CVaR-95",
                      "var95_B": VAR95_MC, "cvar95_B": CVAR95_MC,
                      "dimensao": "S6 / S8 / S9 / S10"},
            "NB-07": {"tema": "Acoplamentos", "entrega": "5 acoplamentos quantificados",
                      "s1_isolado_B": FX_VAR, "s2_isolado_B": SUPPLY_VAR,
                      "acoplado_B": COMBINED_VAR, "dimensao": "arestas do grafo"},
            "NB-08": {"tema": "Backtesting / falsos positivos",
                      "entrega": "6 eventos, precisao 83,3% -> 100%",
                      "tp": BT["tp"], "fp": BT["fp"],
                      "accuracy_antes_pct": BT["accuracy_pct"],
                      "accuracy_depois_pct": BT_FIX["accuracy_pct"],
                      "dimensao": "validacao de tudo"}
        },
        "path": "analise-prescritiva/outputs/nb0*_results.json"
    },
    "conceitos": {
        "quadro_completo": {
            "titulo": "O quadro completo - oito notebooks, tres camadas",
            "camada_1_medir": ["NB-01 cambio", "NB-02 supply", "NB-03 regulatorio", "NB-04 competicao"],
            "camada_2_integrar": ["NB-05 composite", "NB-06 Monte Carlo", "NB-07 acoplamentos"],
            "camada_3_validar": ["NB-08 backtesting"],
            "insight": "risco nao soma linearmente - S1+S2 = R$ 6,10 bi somados mas R$ 9,16 bi acoplados (+50%)",
            "pergunta_reuniao": "Como os oito notebooks se encaixam em uma decisao?"
        },
        "workflow": {
            "titulo": "De analise a decisao - o workflow de 6 estagios",
            "estagios": ["dado bruto", "sinal por dimensao", "composite", "gatilho",
                         "acao com dono (R/A/C/I)", "registro + backtest"],
            "meta_latencia_dias_uteis": 5,
            "observado_latencia_dias": BT["avg_time_to_action_d"],
            "insight": "o estagio 4 (gatilho pre-acordado) separa framework de dashboard",
            "pergunta_reuniao": "Qual e o caminho do dado ate a acao - e quem age?"
        },
        "framework_11_dimensoes": {
            "titulo": "O framework de decisao BYD - 11 dimensoes",
            "dimensoes": [{"cod": d[0], "nome": d[1], "score": d[2], "peso": d[3], "fonte": d[4]}
                          for d in DIM_11],
            "composite_11d": COMPOSITE_11D,
            "soma_pesos": round(sum(d[3] for d in DIM_11), 2),
            "visao_stakeholder_4d": COMPOSITE_4D,
            "insight": "4 dimensoes para o board, 11 para o motor - concordam na faixa (AMBER)",
            "aviso_metodologico": "os pesos sao heuristica de comite, nao resultado de otimizacao (divida tecnica L12)",
            "pergunta_reuniao": "O que exatamente estamos medindo - e com que peso?"
        },
        "composite_71_8": {
            "titulo": "O composite 71,8 - entendendo o numero",
            "valor": COMPOSITE_4D,
            "faixa": banda(COMPOSITE_4D)[0],
            "escala": "vulnerabilidade 0-100, maior = pior",
            "bandas": {"GREEN": "0-65 execucao limpa", "AMBER": "65-80 modo tensao (cluster 2)",
                       "RED": "80-100 modo crise"},
            "decomposicao": {LABEL_4D[d]: {"score": SCORES_4D[d], "peso": WEIGHTS_4D[d],
                                           "contribuicao_pts": round(SCORES_4D[d] * WEIGHTS_4D[d], 2),
                                           "alavanca_pt_por_pt": WEIGHTS_4D[d]}
                             for d in ["cambio", "regulatorio", "supply", "macro"]},
            "meta_12m": TARGET,
            "pontos_a_remover": round(COMPOSITE_4D - TARGET, 1),
            "insight": "alavanca vale mais que score - cambio/regulatorio movem 0,30 por ponto; supply/macro 0,20",
            "limitacoes": ["pesos heuristicos", "escala ordinal calibrada, nao probabilidade",
                           "composite estavel pode esconder dimensoes em direcoes opostas"],
            "pergunta_reuniao": "71,8 e bom ou ruim - e o que muda quando muda?"
        },
        "gatilhos_acoes": {
            "titulo": "Gatilhos e acoes - quando agir",
            "celulas_operacionais": 18,
            "dimensoes_operacionais": 6,
            "estados": STATES,
            "gatilhos_automaticos": 16,
            "acoes_registradas": 25,
            "personas_raci": 17,
            "latencia_alvo": {"GREEN": "mensal/trimestral", "AMBER": "5 min", "RED": "60 min"},
            "kill_switches": [{"nome": k[0], "latencia_h": k[1]} for k in KILL],
            "regra_soberana": "kill switch ignora o composite - evento binario e existencial nao negocia com media ponderada",
            "governor_s6": {"GREEN": 1.0, "AMBER": 1.5, "RED": 2.0},
            "custo_estado_atual_M": custo_hoje_M,
            "estado_atual_por_dimensao": {d: STATES[j] for d, j in idx_hoje.items()},
            "insight": "histerese assimetrica - entrar em RED leva 5 dias, sair leva 2 semanas",
            "pergunta_reuniao": "Quando agir, quem age, quanto custa, em quanto tempo?"
        },
        "backtesting": {
            "titulo": "Backtesting - validando a abordagem",
            "eventos_testados": BT["total_events"],
            "janela": "2020-2025",
            "tp": BT["tp"], "fp": BT["fp"], "fn": 0,
            "precisao_antes_pct": BT["accuracy_pct"],
            "precisao_depois_pct": BT_FIX["accuracy_pct"],
            "recall_pct": 100.0,
            "tta_medio_dias": BT["avg_time_to_action_d"],
            "tta_meta_dias_uteis": 5,
            "eventos": [{"data": e["date"][:7], "nome": e["name"],
                         "ptax_delta_pct": e["ptax_delta_pct"],
                         "litio_delta_pct": e["lithium_delta_pct"],
                         "sinal": e["trigger"], "resultado": e["tp_fp"],
                         "tta_d": e["time_to_action_d"]} for e in ev_ord],
            "correcoes": [{"id": f["id"], "nome": f["name"], "descricao": f["description"]}
                          for f in NB["nb08"]["fixes"]],
            "fp_instrutivo": "eleicao 2024 - PTAX +10,9% era carry trade entrando, nao fuga de capital",
            "insight": "0 falso negativo e a metrica que protege a empresa - escolha de negocio, nao de modelo",
            "ressalva": "as 4 correcoes foram calibradas nos MESMOS 6 eventos (in-sample); 100% e teto otimista, nao promessa",
            "pergunta_reuniao": "Como sabemos que isto funciona?"
        },
        "resumo_executivo": {
            "titulo": "Resumo executivo - o que levar para a reuniao",
            "sete_coisas": [
                f"estado: composite {COMPOSITE_4D}/100 = AMBER modo tensao",
                f"risco: VaR-95 R$ {VAR95_MC:.2f} bi | CVaR-95 R$ {CVAR95_MC:.2f} bi",
                f"acoplamento: S1xS2 R$ {FX_VAR + SUPPLY_VAR:.2f} bi somados -> R$ {COMBINED_VAR:.2f} bi acoplados",
                f"pior sinal: S7 ESG {SCORES_11D['S7']:.0f} com kill switch do BNDES",
                f"validacao: {BT['tp']} TP, {BT['fp']} FP, 0 FN -> {BT_FIX['accuracy_pct']:.0f}% pos-correcao",
                f"gargalo: TTA {BT['avg_time_to_action_d']:.1f} d vs meta 5 d - aprovacao, nao modelagem",
                f"economia: R$ {custo_hoje_M:.0f}M/ano protegendo R$ {var_M:.0f}M de VaR"
            ],
            "decisao": "modo tensao -> defensivo, nao expansivo (hedge ativo, capex sob revisao, cadencia semanal)",
            "pergunta_reuniao": "O que eu levo para a reuniao?"
        }
    },
    "byd_context": {
        "estado_jul_2026": "cluster 2 - modo tensao",
        "composite_stakeholder": COMPOSITE_4D,
        "composite_tecnico": COMPOSITE_11D,
        "faixa": "AMBER",
        "decisao": "defensivo, nao expansivo",
        "pior_dimensao": "S7 ESG (92) - lista suja do trabalho escravo, kill switch do BNDES",
        "melhor_dimensao": "S3 BNDES / S6 macro (70)",
        "custo_protecao_ano_M": custo_hoje_M,
        "var95_protegido_M": round(var_M, 1),
        "meta_composite_12m": TARGET
    },
    "executive_phrases": [
        "Oito notebooks, tres camadas: medir -> integrar -> validar. Quem pula a validacao apresenta opiniao com grafico bonito.",
        "Risco nao soma: S1+S2 da R$ 6,10 bi na planilha e R$ 9,16 bi na realidade acoplada (+50%).",
        "Analise nao e decisao: decisao tem dono, limiar, custo, prazo e registro.",
        "A regra e acordada antes do evento - limiar decidido durante a crise e limiar decidido com medo.",
        "71,8 = AMBER = modo tensao: hedge ativo, capex sob revisao, cadencia semanal.",
        "Quatro dimensoes para o board, onze para o motor - concordam na faixa; se divergissem, seria bug.",
        "Alavanca vale mais que score: cambio e regulatorio movem 0,30 por ponto; supply e macro, 0,20.",
        "S7 (ESG, score 92) e peso pequeno e consequencia total - ele desliga o funding do BNDES.",
        "O kill switch ignora o composite: evento binario e existencial nao negocia com media ponderada.",
        "S6 (macro) multiplica, nao soma - em RED dobra o custo de todas as outras dimensoes.",
        "5 TP, 1 FP, 0 FN em 6 eventos reais: nenhuma crise passou despercebida.",
        "As correcoes levam a precisao a 100%, mas foram calibradas nos mesmos 6 eventos - teto in-sample, nao promessa.",
        "O gargalo nao e o modelo, e o relogio: 9,5 dias observados contra meta de 5.",
        "R$ 196M/ano de protecao contra R$ 3,11 bi de VaR-95 - 6% do risco para nao descobrir os 100% de uma vez.",
        "Nunca apresente o composite sozinho: sempre com as dimensoes que o formam."
    ],
    "learning_series": {
        "L0": "estatistica - a media nao conta a historia inteira",
        "L1": "probabilidade - a incerteza tem forma",
        "L3": "regressao linear - uma variavel explica outra",
        "L4": "series temporais - tendencia, sazonalidade e memoria",
        "L5": "volatilidade GARCH - a vol se agrupa em regimes",
        "L6": "Monte Carlo - 10.000 futuros dizem mais que um cenario",
        "L7": "analise multivariada - 8 variaveis, 3 drivers",
        "L8": "otimizacao - existe um tamanho otimo dentro de restricoes",
        "L9": "teoria dos jogos - o concorrente reage, existe equilibrio",
        "L10": "framework de decisao - as tecnicas viram UMA decisao (este caderno)"
    },
    "visualizations": [
        "l10-01-pipeline-completo.html",
        "l10-02-workflow-sinal-acao.html",
        "l10-03-framework-11-dim.html",
        "l10-04-composite-71-8.html",
        "l10-05-gatilhos-acoes.html",
        "l10-06-backtesting.html",
        "l10-07-resumo-executivo.html"
    ],
    "palette_validated": {
        "mode": "dark",
        "surface": BG,
        "swatches": [AZUL, TIJOLO, TEAL, VIOLETA, AMBAR],
        "validator": "dataviz/scripts/validate_palette.js --mode dark",
        "result": "ALL CHECKS PASS"
    },
    "reference_to_prescriptive": {
        "section": "NB-01 a NB-08 - o pipeline prescritivo completo",
        "purpose": ("Para a implementacao das oito analises que este framework integra: "
                    "GARCH(1,1)-t no cambio (NB-01), HHI e VaR de supply (NB-02), cenarios "
                    "regulatorios e ViE (NB-03), matriz de payoffs 5x5 e Nash (NB-04), pesos "
                    "do composite (NB-05), Monte Carlo multivariado e VaR/CVaR (NB-06), os 5 "
                    "acoplamentos quantificados (NB-07) e o backtesting dos 6 eventos com as "
                    "4 correcoes de falso positivo (NB-08).")
    }
}

out_path = OUT_DIR / "l10_framework_executive.json"
with out_path.open("w", encoding="utf-8") as f:
    json.dump(resumo, f, indent=2, ensure_ascii=False)

print("Resumo executivo salvo em:")
print(" ", out_path)
print(f"  {len(json.dumps(resumo, ensure_ascii=False)):,} bytes · "
      f"{len(resumo['conceitos'])} conceitos · "
      f"{len(resumo['executive_phrases'])} frases executivas · "
      f"{len(resumo['visualizations'])} visualizações".replace(",", "."))
print()
print("Frase de abertura para a reunião:")
print(f"  'Estamos em {COMPOSITE_4D} sobre 100 — modo tensão, não crise. O risco medido")
print(f"   é R$ {VAR95_MC:.2f} bi de VaR-95, e ele acopla: câmbio com supply juntos valem")
print(f"   50% mais que somados. O pior sinal é ESG ({SCORES_11D['S7']:.0f}), porque ele desliga o")
print(f"   BNDES. O sinal foi validado em {BT['total_events']} eventos reais com zero falso negativo.")
print(f"   Estamos gastando ~R$ {custo_hoje_M:.0f}M/ano para proteger R$ {VAR95_MC:.2f} bi — e o único")
print(f"   problema real é que levamos {BT['avg_time_to_action_d']:.1f} dias para agir quando a meta é 5.'")'''),

("markdown", r'''---

## Fechamento da série

*L10 concluído — e com ele, a série L0–L10.*

Você agora sabe que **o quadro completo** tem três camadas (medir → integrar →
validar) e que pular a validação transforma análise em opinião ilustrada; que
o **workflow** vai do PTAX até o registro em seis estágios, e que o gatilho
pré-acordado é o que separa framework de dashboard; que o **framework de 11
dimensões** roda por trás das 4 que o board vê; que o **composite 71,8** é
AMBER — modo tensão, com alavanca de 0,30 em câmbio e regulatório e meta de
60 em 12 meses; que os **gatilhos** são 18 células, 16 regras automáticas e 4
kill switches que ignoram o composite; que o **backtesting** validou o sinal
em 6 eventos reais com 0 falso negativo — e que as correções que levam a
precisão a 100% foram calibradas in-sample, o que é um teto, não uma promessa;
e que o **resumo executivo** cabe em cinco números e uma decisão: **modo
tensão → defensivo, não expansivo.**

O gargalo real não é estatístico. É organizacional: **9,5 dias entre o sinal
e a ação, contra uma meta de 5.** Nenhum GARCH melhor resolve isso.

Para a implementação completa de cada peça, consulte os oito notebooks
prescritivos — **NB-01** (PTAX + GARCH), **NB-02** (supply + HHI), **NB-03**
(cenários regulatórios), **NB-04** (teoria dos jogos + Nash), **NB-05**
(índice composto), **NB-06** (Monte Carlo multivariado), **NB-07**
(acoplamentos) e **NB-08** (backtesting + correções de falso positivo).

---

> ### You now understand what our analytics team does.
>
> *Você agora entende o que o nosso time de analytics faz.*
'''),

]
