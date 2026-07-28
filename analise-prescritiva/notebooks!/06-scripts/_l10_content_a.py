"""L10 content, part A: header + setup + sections 1-3.

Cells are (cell_type, source_text) tuples. Raw strings only — the notebook
source must keep literal backslash-n sequences inside plot label strings.
"""

CELLS_A = [

("markdown", r'''# L10 · Framework de Decisão — Integração para Executivos
**Análise Prescritiva — Camada de Alfabetização de Dados (Learning)**

| Campo | Detalhe |
|---|---|
| **Notebook** | L10 · Decision Framework — Integration for Executives |
| **Autor** | Matheus Mendes |
| **Data** | 27/julho/2026 |
| **Versão** | 1.0 |
| **Público-alvo** | Executivos não-técnicos — "e agora, o que eu faço?" |
| **Dependências** | numpy, plotly, json |
| **Fonte quantitativa** | **NB-01 … NB-08** (os oito notebooks prescritivos) + NB-14 (camada NPV, referência) |

---

## Por que este notebook existe

Este é o **último caderno da série**. Ele não ensina uma técnica nova — ele
mostra **como as técnicas anteriores se juntam em uma decisão**.

Em **L0** você aprendeu que a média não conta a história inteira. Em **L1**
que a incerteza tem forma. Em **L3** que uma variável explica outra. Em
**L4** que o tempo tem tendência, sazonalidade e memória. Em **L5** que a
volatilidade se agrupa em regimes. Em **L6** que 10.000 futuros simulados
dizem mais que um cenário. Em **L7** que oito variáveis se organizam em
três drivers. Em **L8** que existe um tamanho **ótimo** de hedge dentro de
restrições. Em **L9** que o concorrente reage — e que existe um equilíbrio.

Nada disso é uma decisão. **Análise não é decisão.** Uma decisão precisa de
um dono, um limiar, um custo, um prazo e um registro. É isso que o
**framework** faz: transforma oito análises em **um número, onze sinais,
dezesseis gatilhos e vinte e cinco ações com dono**.

Este caderno é **narrativa-primeiro**:
> **Conceito → Intuição → Matemática → Código → Recado Executivo**

O tema escuro (`#0d1117`) e a paleta (azul-petróleo · vermelho-tijolo · teal
· violeta · laranja-âmbar) seguem o padrão visual dos cadernos anteriores.

### A pergunta central em uma frase

**"Como oito análises independentes — câmbio, supply, regulatório,
competição, índice composto, Monte Carlo, acoplamentos e backtesting — viram
uma única decisão defensável em uma reunião de comitê?"** A resposta é o
framework: **composite 71,8/100 = modo tensão = defensivo, não expansivo.**

### Os 7 temas deste caderno

| # | Tema | Pergunta executiva |
|---|---|---|
| 1 | **O quadro completo** | Como os oito notebooks se encaixam? |
| 2 | **De análise a decisão** | Qual é o caminho do dado até a ação? |
| 3 | **Framework de 11 dimensões** | O que exatamente estamos medindo? |
| 4 | **Composite 71,8** | O que esse número significa — e o que não significa? |
| 5 | **Gatilhos e ações** | Quando agir, quem age, quanto custa? |
| 6 | **Backtesting** | Como sabemos que isto funciona? |
| 7 | **Resumo executivo** | O que eu levo para a reunião? |

### Os oito notebooks prescritivos — o que cada um entrega

| Notebook | Pergunta que responde | Saída-chave | Vira qual dimensão |
|---|---|---|---|
| **NB-01** · PTAX + GARCH(1,1)-t | O câmbio vai estressar? | vol 12m, persistência 0,99, meia-vida 73d | S1 Câmbio |
| **NB-02** · Supply chain + HHI | O lítio/célula é concentrado? | HHI refino 4.558, VaR-95 lítio | S2 Supply · S5 Parcerias |
| **NB-03** · Cenários regulatórios | O BNDES sai? | ViE esperado 18,4%, kill switch 10% | S3 BNDES · S7 ESG |
| **NB-04** · Teoria dos jogos | O concorrente reage? | Nash E3, NPV R$ 5,52 bi | S4 Pricing · S11 Competitivo |
| **NB-05** · Índice composto | Como resumir em 1 número? | pesos 30/30/20/20 | o próprio composite |
| **NB-06** · Monte Carlo multivariado | Quanto pode dar errado junto? | VaR-95 R$ 3,11 bi, CVaR R$ 3,46 bi | S6 · S8 · S9 · S10 |
| **NB-07** · Acoplamentos | Os riscos se somam? | 5 acoplamentos, S1×S2 = R$ 9,16 bi | as arestas do grafo |
| **NB-08** · Backtesting / falsos positivos | O sinal funciona? | 6 eventos, precisão 83,3% → 100% | a validação de tudo |
'''),

("code", r'''import json
from pathlib import Path
from datetime import datetime

import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
if not (NOTEBOOK_ROOT / "outputs" / "nb01_results.json").exists():
    NOTEBOOK_ROOT = Path.cwd()
    if not (NOTEBOOK_ROOT / "outputs" / "nb01_results.json").exists():
        NOTEBOOK_ROOT = NOTEBOOK_ROOT.parent

OUT_DIR = NOTEBOOK_ROOT / "outputs" / "learning"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_nb(tag):
    path = NOTEBOOK_ROOT / "outputs" / (tag + "_results.json")
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as f:
        return json.load(f)


NB = {tag: load_nb(tag) for tag in
      ["nb01", "nb02", "nb03", "nb04", "nb05", "nb06", "nb07", "nb08"]}
NB14 = load_nb("nb14")   # camada de custo-benefício (referência, fora do escopo L10)

BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR, VERDE = "#9333ea", "#ea580c", "#22c55e"


def style(fig, title, height=440):
    fig.update_layout(
        template="plotly_dark", paper_bgcolor=BG, plot_bgcolor=BG,
        title=dict(text=title, x=0.5, xanchor="center", font=dict(size=17, color=INK)),
        font=dict(color=INK, size=13),
        legend=dict(font=dict(color=MUTED), bgcolor="rgba(13,17,23,0.6)",
                    bordercolor=GRID, borderwidth=1),
        margin=dict(l=65, r=40, t=75, b=55), height=height,
    )
    fig.update_xaxes(color=MUTED, gridcolor=GRID, zerolinecolor=GRID, linecolor=GRID)
    fig.update_yaxes(color=MUTED, gridcolor=GRID, zerolinecolor=GRID, linecolor=GRID)
    return fig


# ── Escala: VULNERABILIDADE. 0 = sem risco, 100 = crise total. Maior = pior. ──
BANDS = [(0.0, 65.0, "GREEN - Execucao limpa", VERDE),
         (65.0, 80.0, "AMBER - Modo tensao (cluster 2)", AMBAR),
         (80.0, 101.0, "RED - Modo crise", TIJOLO)]

# Visão stakeholder — 4 dimensões, pesos 30/30/20/20 (NB-05)
SCORES_4D = {"cambio": 78.0, "regulatorio": 70.0, "supply": 85.0, "macro": 52.0}
WEIGHTS_4D = {"cambio": 0.30, "regulatorio": 0.30, "supply": 0.20, "macro": 0.20}
LABEL_4D = {"cambio": "Câmbio (S1)", "regulatorio": "Regulatório (S3)",
            "supply": "Supply (S2)", "macro": "Macro (S6)"}

# Motor técnico — 11 dimensões, pesos D3 v0.6 (soma 1,19 → normalizados)
DIM_11 = [
    ("S1",  "Câmbio (PTAX/GARCH)",  78.0, 0.18, "NB-01"),
    ("S2",  "Supply (lítio/HHI)",   85.0, 0.15, "NB-02"),
    ("S3",  "BNDES / regulatório",  70.0, 0.20, "NB-03"),
    ("S4",  "Pricing defensivo",    72.0, 0.08, "NB-04"),
    ("S5",  "Parcerias CATL/EVE",   85.0, 0.08, "NB-02"),
    ("S6",  "Macro (IPCA/Selic)",   70.0, 0.10, "NB-06"),
    ("S7",  "ESG (lista suja)",     92.0, 0.10, "NB-03"),
    ("S8",  "Ramp SKD→CKD→nac.",    77.0, 0.08, "NB-06"),
    ("S9",  "Demanda EV",           72.0, 0.07, "NB-06"),
    ("S10", "Tarifa de importação", 78.0, 0.05, "NB-06"),
    ("S11", "Competitivo (Nash)",   82.0, 0.10, "NB-04"),
]
SCORES_11D = {d[0]: d[2] for d in DIM_11}
WEIGHTS_11D = {d[0]: d[3] for d in DIM_11}


def composite(scores, weights):
    """Média ponderada normalizada — pesos não precisam somar 1."""
    return round(sum(scores[k] * weights[k] for k in scores) / sum(weights.values()), 1)


def banda(value):
    for lo, hi, label, cor in BANDS:
        if lo <= value < hi:
            return label, cor
    return BANDS[-1][2], BANDS[-1][3]


COMPOSITE_4D = composite(SCORES_4D, WEIGHTS_4D)
COMPOSITE_11D = composite(SCORES_11D, WEIGHTS_11D)
assert abs(COMPOSITE_4D - 71.8) < 0.05, COMPOSITE_4D
assert abs(COMPOSITE_11D - 78.0) < 0.05, COMPOSITE_11D

# Métricas âncora vindas dos notebooks prescritivos
VOL_12M = NB["nb01"]["vol_term_structure"]["12m"]
PERSIST = NB["nb01"]["garch"]["persistence"]
HHI_REFINO = NB["nb02"]["hhi"]["refining"]["hhi"]
VIE_ESPERADO = NB["nb03"]["expected_ViE"]
KILL_PROB = NB["nb03"]["kill_switch_prob"]
NPV_NASH = NB["nb04"]["aggregate_npv_at_nash_B"]
VAR95_MC = abs(NB["nb06"]["var_95_B"])
CVAR95_MC = abs(NB["nb06"]["cvar_95_B"])
FX_VAR = NB["nb07"]["coupling_s1_s2"]["fx_var_B"]
SUPPLY_VAR = NB["nb07"]["coupling_s1_s2"]["supply_var_B"]
COMBINED_VAR = NB["nb07"]["coupling_s1_s2"]["combined_var_B"]
BT = NB["nb08"]["summary"]
BT_FIX = NB["nb08"]["after_fixes"]
ROI_3Y = NB14["roi_headline"]["roi_3y_x"] if NB14 else 200.0

print("Notebooks prescritivos carregados:")
for tag, data in NB.items():
    print("  " + tag + ": " + ("OK" if data else "AUSENTE"))
print()
print("FRAMEWORK DE DECISÃO BYD — estado jul/2026")
print("  Escala          : vulnerabilidade 0-100 (maior = pior)")
print(f"  Composite 4-dim : {COMPOSITE_4D}/100 -> {banda(COMPOSITE_4D)[0]}")
print(f"  Composite 11-dim: {COMPOSITE_11D}/100 -> {banda(COMPOSITE_11D)[0]}")
print(f"  VaR-95 (NB-06)  : R$ {VAR95_MC:.2f} bi | CVaR-95 R$ {CVAR95_MC:.2f} bi")
print(f"  Sinal (NB-08)   : {BT['tp']} TP / {BT['fp']} FP -> após correções {BT_FIX['fp']} FP")
print(f"  TTA médio       : {BT['avg_time_to_action_d']:.1f} dias")'''),

("markdown", r'''---

## 1 · O quadro completo — oito notebooks, uma decisão

### ① Por que isto importa

Cada notebook prescritivo responde **uma** pergunta bem feita. Nenhum deles
responde à pergunta do CEO, que é: **"o que eu faço na segunda-feira?"**.
Oito respostas certas e desconectadas produzem o pior resultado possível em
comitê: **paralisia com muita evidência**.

O quadro completo tem **três camadas**. A primeira mede (NB-01 a NB-04). A
segunda integra (NB-05 a NB-07). A terceira valida (NB-08). Só a terceira
camada autoriza alguém a dizer "confie neste sinal".

### ② Conceito, sem jargão

- **Camada de diagnóstico** — quatro medições independentes: câmbio, supply,
  regulatório, competição. Cada uma vira um **score 0-100**.
- **Camada de integração** — junta os scores em um número (NB-05), simula
  tudo junto (NB-06) e mede como os riscos se **contaminam** (NB-07).
- **Camada de validação** — pergunta ao passado: *se este sinal existisse em
  2020, ele teria acertado?* (NB-08).

### ③ Intuição — o painel do avião

Um piloto não olha oito instrumentos e "sente" o que fazer. Ele tem um
**painel** onde altímetro, velocímetro, combustível e horizonte artificial
convergem para uma checklist: *subir, manter, descer, abortar*. O framework
é o painel. Os oito notebooks são os instrumentos. O composite é o horizonte
artificial: um símbolo que resume atitude em uma olhada.

E, como no avião, há uma regra dura: **instrumento sem checklist não salva
ninguém.** É por isso que a camada 3 (validação) existe.

### ④ A matemática — dois fatos, uma fórmula

**Fato 1 — agregação.** O composite é uma média ponderada normalizada:

$$ C = \frac{\sum_{i} w_i \, s_i}{\sum_{i} w_i}, \qquad s_i \in [0, 100] $$

**Fato 2 — risco não soma.** Para dois riscos com desvios $\sigma_1, \sigma_2$
e correlação $\rho$:

$$ \sigma_{1+2} = \sqrt{\sigma_1^2 + \sigma_2^2 + 2\rho\,\sigma_1\sigma_2} \ne \sigma_1 + \sigma_2 $$

Quando $\rho < 1$ há **diversificação** (o todo é menor que a soma). Mas
quando há **acoplamento de regime** — câmbio em stress *e* lítio em stress ao
mesmo tempo, com multiplicador 2,5× (NB-02/NB-07) — o todo fica **maior** que
a soma. NB-07 mediu isso: R$ 2,10 bi + R$ 4,00 bi = R$ 6,10 bi somados, mas
**R$ 9,16 bi acoplados**. É a diferença entre um relatório e um framework.

### ⑤ Recado executivo — O quadro completo

> - **Oito notebooks, três camadas: medir → integrar → validar.** Quem pula
>   a terceira camada está apresentando opinião com gráfico bonito.
> - **Risco não soma linearmente.** S1 + S2 dá R$ 6,10 bi na planilha e
>   R$ 9,16 bi na realidade acoplada — **+50%**. O erro de somar riscos é
>   sempre um erro de subestimar.
> - **O composite não substitui os oito notebooks; ele os indexa.** Quando
>   alguém questionar o 71,8, a resposta é abrir a dimensão, não defender o
>   número.
'''),

("code", r'''fig = make_subplots(
    rows=1, cols=2, column_widths=[0.56, 0.44],
    subplot_titles=(
        "As 3 camadas — medir → integrar → validar",
        "Risco não soma: R$ bi em jogo (S1 × S2)",
    ),
    horizontal_spacing=0.12,
)

# ── Painel 1: grafo do pipeline ──────────────────────────────────────────────
NODES = {
    "NB-01": (0.6, 3.0, "Câmbio\nGARCH", AZUL),
    "NB-02": (1.7, 3.0, "Supply\nHHI", TIJOLO),
    "NB-03": (2.8, 3.0, "Regulatório\nViE", TEAL),
    "NB-04": (3.9, 3.0, "Competição\nNash", VIOLETA),
    "NB-05": (1.2, 2.0, "Composite\n71,8", AMBAR),
    "NB-06": (2.25, 2.0, "Monte Carlo\nVaR-95", AMBAR),
    "NB-07": (3.3, 2.0, "Acoplamentos\n5 arestas", AMBAR),
    "NB-08": (2.25, 1.0, "Backtesting\n6 eventos", VERDE),
}
EDGES = [("NB-01", "NB-05"), ("NB-01", "NB-06"), ("NB-01", "NB-07"),
         ("NB-02", "NB-05"), ("NB-02", "NB-06"), ("NB-02", "NB-07"),
         ("NB-03", "NB-05"), ("NB-03", "NB-07"),
         ("NB-04", "NB-05"), ("NB-04", "NB-07"),
         ("NB-05", "NB-08"), ("NB-06", "NB-08"), ("NB-07", "NB-08")]

for src, dst in EDGES:
    x0, y0 = NODES[src][0], NODES[src][1]
    x1, y1 = NODES[dst][0], NODES[dst][1]
    fig.add_scatter(x=[x0, x1], y=[y0 - 0.12, y1 + 0.12], mode="lines",
                    line=dict(color=GRID, width=1.4), hoverinfo="skip",
                    showlegend=False, row=1, col=1)

for tag, (x, y, sub, cor) in NODES.items():
    fig.add_scatter(
        x=[x], y=[y], mode="markers+text",
        marker=dict(size=34, color=cor, symbol="square",
                    line=dict(color=INK, width=1.4)),
        text=[tag], textposition="middle center",
        textfont=dict(color=BG, size=10, family="Arial Black"),
        hovertext=[tag + " — " + sub.replace("\n", " ")], hoverinfo="text",
        showlegend=False, row=1, col=1,
    )
    fig.add_annotation(x=x, y=y - 0.30, text=sub.replace("\n", "<br>"),
                       showarrow=False, font=dict(color=MUTED, size=9),
                       xref="x", yref="y")

for y, txt, cor in [(3.0, "1 · MEDIR", AZUL), (2.0, "2 · INTEGRAR", AMBAR),
                    (1.0, "3 · VALIDAR", VERDE)]:
    fig.add_annotation(x=-0.05, y=y, text="<b>" + txt + "</b>", showarrow=False,
                       font=dict(color=cor, size=11), xanchor="left",
                       xref="x", yref="y")

# ── Painel 2: não-aditividade do risco ───────────────────────────────────────
soma_ingenua = FX_VAR + SUPPLY_VAR
bars = [
    ("S1 câmbio<br>isolado", FX_VAR, AZUL),
    ("S2 supply<br>isolado", SUPPLY_VAR, TIJOLO),
    ("Soma ingênua<br>S1+S2", soma_ingenua, MUTED),
    ("Acoplado<br>NB-07", COMBINED_VAR, AMBAR),
    ("VaR-95 MC<br>NB-06 (4 choques)", VAR95_MC, VERDE),
]
fig.add_bar(
    x=[b[0] for b in bars], y=[b[1] for b in bars],
    marker=dict(color=[b[2] for b in bars], line=dict(color=INK, width=1.3)),
    text=[f"R$ {b[1]:.2f} bi" for b in bars], textposition="outside",
    textfont=dict(color=INK, size=11), showlegend=False, row=1, col=2,
)
fig.add_annotation(
    x=3, y=COMBINED_VAR * 1.16,
    text=f"<b>+{(COMBINED_VAR / soma_ingenua - 1) * 100:.0f}% acima da soma</b>",
    showarrow=False, font=dict(color=AMBAR, size=11), xref="x2", yref="y2",
)

style(fig, "1 - O quadro completo: oito notebooks, tres camadas, uma decisao", height=520)
fig.update_xaxes(visible=False, range=[-0.15, 4.5], row=1, col=1)
fig.update_yaxes(visible=False, range=[0.45, 3.55], row=1, col=1)
fig.update_xaxes(color=MUTED, tickfont=dict(size=10), row=1, col=2)
fig.update_yaxes(title="R$ bi", range=[0, COMBINED_VAR * 1.32], row=1, col=2)
fig.write_html(str(OUT_DIR / "l10-01-pipeline-completo.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("Camada 1 - MEDIR    : NB-01 câmbio | NB-02 supply | NB-03 regulatório | NB-04 competição")
print("Camada 2 - INTEGRAR : NB-05 composite | NB-06 Monte Carlo | NB-07 acoplamentos")
print("Camada 3 - VALIDAR  : NB-08 backtesting (autoriza confiar no sinal)")
print()
print(f"S1 isolado          : R$ {FX_VAR:.2f} bi")
print(f"S2 isolado          : R$ {SUPPLY_VAR:.2f} bi")
print(f"Soma ingênua        : R$ {soma_ingenua:.2f} bi   <- o que a planilha diz")
print(f"Acoplado (NB-07)    : R$ {COMBINED_VAR:.2f} bi   <- o que a realidade faz (+{(COMBINED_VAR/soma_ingenua-1)*100:.0f}%)")
print(f"VaR-95 MC (NB-06)   : R$ {VAR95_MC:.2f} bi   <- 4 choques, 126 dias, percentil 5")
print()
print("Atenção: horizontes e definições diferem entre NB-06 e NB-07.")
print("A lição é direcional: acoplamento amplifica, diversificação dilui — nunca some VaRs.")'''),

("markdown", r'''---

## 2 · De análise a decisão — o workflow

### ① Por que isto importa

A distância entre "temos um modelo" e "alguém agiu" é onde frameworks
morrem. A métrica de sucesso do framework BYD não é R², é **latência
sinal → ação: meta de 5 dias úteis**. O backtesting (NB-08) mediu o
observado: **9,5 dias**. O framework, hoje, tem um problema de **execução**,
não de modelo — e essa é uma das conclusões mais valiosas do projeto.

### ② Conceito, sem jargão

O workflow tem **seis estágios**, e cada um tem um artefato entregável:

| # | Estágio | Artefato | Quem |
|---|---|---|---|
| 1 | **Dado bruto** | PTAX diário, spot lítio, ViE, share | Analytics |
| 2 | **Sinal por dimensão** | score 0-100 + 🟢🟡🔴 | Analytics |
| 3 | **Composite** | 1 número (71,8) | Risk Officer |
| 4 | **Gatilho** | regra pré-acordada + histerese | Risk Officer |
| 5 | **Ação** | dono (R/A/C/I) + custo + prazo | Dono funcional |
| 6 | **Registro + backtest** | acerto/erro, recalibração | Analytics + CSO |

O estágio 4 é o que separa framework de dashboard: **a regra é acordada
antes do evento**. Decidir o limiar durante a crise é decidir com medo.

### ③ Intuição — o extintor e o alarme

Um alarme de incêndio não delibera. Ele tem um **limiar** (fumaça acima de
X), uma **ação pré-definida** (soar + chamar bombeiros) e um **dono**
(brigada). Ninguém convoca comitê para discutir se o alarme deveria soar.

Sem o estágio 4, a organização faz o contrário: detecta fumaça, marca reunião
para terça, pede mais dados, e o prédio queima com uma apresentação de 40
slides muito bem feita.

### ④ A matemática — limiar com histerese

Um gatilho ingênuo (`sinal ≥ θ → RED`) pisca no ruído. A correção é um
**gatilho de Schmitt** (dois limiares + persistência), que é exatamente o que
NB-08 implementou nas correções 1 e 4:

$$
\text{estado}_t =
\begin{cases}
\text{RED} & \text{se } x_s \ge \theta_{hi} \ \forall s \in [t-4, t] \quad (5 \text{ dias)}\\
\text{AMBER} & \text{se estado}_{t-1} = \text{RED e } x_s < \theta_{lo} \ \forall s \in [t-9, t] \quad (10 \text{ dias})\\
\text{estado}_{t-1} & \text{caso contrário}
\end{cases}
$$

Entrar é rápido (5 dias), sair é lento (10 dias úteis). A assimetria é
deliberada: **o custo de sair cedo de um regime de crise é maior que o custo
de ficar defensivo por duas semanas a mais.**

### ⑤ Recado executivo — O workflow

> - **Seis estágios, do PTAX até o registro.** Se algum estágio não tem
>   artefato e dono, o framework tem um vazamento ali.
> - **A regra é acordada antes do evento.** Limiar decidido durante a crise
>   é limiar decidido com medo.
> - **Meta 5 dias úteis, observado 9,5 dias (NB-08).** O gargalo não é o
>   modelo — é aprovação. Atacar isso vale mais que refinar o GARCH.
'''),

("code", r'''fig = make_subplots(
    rows=1, cols=2, column_widths=[0.54, 0.46],
    subplot_titles=(
        "A escada: do dado bruto ao registro",
        "Latência até a ação (escala log, horas)",
    ),
    horizontal_spacing=0.13,
)

# ── Painel 1: escada de 6 estágios ──────────────────────────────────────────
STAGES = [
    ("1 · Dado bruto", "PTAX, spot lítio, ViE, share", AZUL),
    ("2 · Sinal / dimensão", "score 0-100 + 🟢🟡🔴", TEAL),
    ("3 · Composite", f"1 número = {COMPOSITE_4D}", AMBAR),
    ("4 · Gatilho", "regra pré-acordada + histerese", VIOLETA),
    ("5 · Ação com dono", "R/A/C/I + custo + prazo", TIJOLO),
    ("6 · Registro + backtest", "acerto/erro → recalibra", VERDE),
]
for i, (nome, artefato, cor) in enumerate(STAGES):
    fig.add_bar(
        x=[i + 1], y=[i + 1], width=0.72,
        marker=dict(color=cor, line=dict(color=INK, width=1.3)),
        showlegend=False, hovertext=[nome + " — " + artefato], hoverinfo="text",
        row=1, col=1,
    )
    fig.add_annotation(x=i + 1, y=i + 1.30, text="<b>" + nome + "</b>",
                       showarrow=False, font=dict(color=cor, size=10),
                       textangle=0, xref="x", yref="y")
    fig.add_annotation(x=i + 1, y=(i + 1) / 2.0, text=artefato.replace(" ", "<br>", 1),
                       showarrow=False, font=dict(color=BG, size=9),
                       xref="x", yref="y")

# ── Painel 2: latências ─────────────────────────────────────────────────────
TTA_OBS_H = BT["avg_time_to_action_d"] * 24
LAT = [
    ("Notificação AMBER<br>(5 min)", 5 / 60.0, AMBAR),
    ("Decisão RED<br>(60 min)", 1.0, TIJOLO),
    ("Meta sinal→ação<br>(5 dias úteis)", 120.0, VERDE),
    (f"Observado NB-08<br>({BT['avg_time_to_action_d']:.1f} dias)", TTA_OBS_H, AZUL),
    ("Revisão GREEN<br>(mensal)", 720.0, MUTED),
]
fig.add_bar(
    x=[l[1] for l in LAT], y=[l[0] for l in LAT], orientation="h",
    marker=dict(color=[l[2] for l in LAT], line=dict(color=INK, width=1.3)),
    text=[f"{l[1]:.2f} h" if l[1] < 2 else f"{l[1]:.0f} h" for l in LAT],
    textposition="outside", textfont=dict(color=INK, size=10),
    showlegend=False, row=1, col=2,
)
fig.add_annotation(
    x=np.log10(TTA_OBS_H), y=3.62,
    text="<b>gap de execução: 9,5 d observado vs 5 d de meta</b>",
    showarrow=False, font=dict(color=AZUL, size=10), xref="x2", yref="y2",
)

style(fig, "2 - De analise a decisao: seis estagios e a latencia de cada um", height=500)
fig.update_xaxes(visible=False, range=[0.3, 6.8], row=1, col=1)
fig.update_yaxes(visible=False, range=[0, 7.6], row=1, col=1)
fig.update_xaxes(type="log", title="horas (log)", range=[-1.3, 3.35], row=1, col=2)
fig.update_yaxes(tickfont=dict(size=10), row=1, col=2)
fig.write_html(str(OUT_DIR / "l10-02-workflow-sinal-acao.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

for nome, artefato, _ in STAGES:
    print(f"{nome:26s} -> {artefato}")
print()
print(f"Meta latência sinal→ação : 5 dias úteis (120 h)")
print(f"Observado (NB-08)        : {BT['avg_time_to_action_d']:.1f} dias ({TTA_OBS_H:.0f} h)")
print(f"Diagnóstico              : gap de {TTA_OBS_H - 120:.0f} h é aprovação, não modelagem")'''),

("markdown", r'''---

## 3 · O framework de decisão BYD — 11 dimensões

### ① Por que isto importa

O comitê vê **4 dimensões**. O motor roda **11**. Isso não é inconsistência —
é **design de comunicação**. Quatro dimensões cabem em uma frase de abertura;
onze cabem em um sistema de alarme. Se você mostrar 11 ao board, ele discutirá
pesos por 40 minutos e não decidirá nada. Se você rodar só 4, perderá o
**kill switch de ESG** — que é o risco de maior score da carteira (92).

### ② Conceito, sem jargão

As 11 dimensões, com peso e origem:

| Dim | O que mede | Score | Peso | Fonte |
|---|---|---|---|---|
| **S1** | Câmbio — vol PTAX, regime GARCH | 78 | 0,18 | NB-01 |
| **S2** | Supply — lítio, HHI refino 4.558 | 85 | 0,15 | NB-02 |
| **S3** | BNDES — ViE, cenários regulatórios | 70 | 0,20 | NB-03 |
| **S4** | Pricing defensivo — tiers 0-3 | 72 | 0,08 | NB-04 |
| **S5** | Parcerias — lock CATL/EVE | 85 | 0,08 | NB-02 |
| **S6** | Macro — IPCA, Selic, EM stress | 70 | 0,10 | NB-06 |
| **S7** | **ESG — lista suja (kill switch)** | **92** | 0,10 | NB-03 |
| **S8** | Ramp — SKD 45% → CKD → nacional 70% | 77 | 0,08 | NB-06 |
| **S9** | Demanda EV — share, YoY | 72 | 0,07 | NB-06 |
| **S10** | Tarifa de importação — 35% em jan/2027 | 78 | 0,05 | NB-06 |
| **S11** | Competitivo — 5 players, Nash E3 | 82 | 0,10 | NB-04 |

Leitura da escala: **maior = pior**. S7 = 92 é o pior sinal da carteira; S6 e
S3 = 70 são os melhores. Nenhuma dimensão está em GREEN (< 65).

### ③ Intuição — o exame de sangue

Um hemograma tem ~20 marcadores. O médico não te dá 20 números: ele diz
"colesterol alto, resto normal". Mas ele **precisou** dos 20 para chegar a
essa frase — e o marcador que salvou sua vida pode ser o 17º, que ninguém
olha em tempo normal.

S7 (ESG / lista suja) é o 17º marcador deste caso. Peso 0,10, score 92, e um
poder que nenhuma outra dimensão tem: **ele desliga o funding do BNDES**.
Um risco pequeno em peso e enorme em consequência.

### ④ A matemática — pesos não normalizados

Os pesos D3 v0.6 somam **1,19**, não 1,00. A normalização é explícita:

$$ C_{11} = \frac{\sum_{i=1}^{11} w_i s_i}{\sum_{i=1}^{11} w_i} = \frac{92{,}85}{1{,}19} = 78{,}0 $$

A **contribuição** de cada dimensão em pontos do composite é
$c_i = \dfrac{w_i s_i}{\sum_j w_j}$, e é isso que se deve olhar — não o peso
nem o score isolados. S1 e S3 contribuem ~11,8 pontos cada; S10 contribui
3,3. Cortar 10 pontos de S10 move o composite em 0,4 — irrelevante. Cortar 10
pontos de S1 move 1,5.

**Aviso metodológico honesto:** estes pesos são **heurística de comitê, não
resultado de otimização**. Estão documentados como dívida técnica (`L12`) no
D3 v0.6. Quem apresenta o composite deve dizer isso antes de alguém perguntar.

### ⑤ Recado executivo — 11 dimensões

> - **4 dimensões para o board, 11 para o motor.** Não é inconsistência, é
>   camada de comunicação — mas a auditoria tem de conseguir ir do 4 ao 11.
> - **S7 (ESG, score 92) é o maior risco isolado e tem poder de kill switch.**
>   Peso pequeno, consequência total: ele bloqueia o funding do BNDES.
> - **Olhe contribuição, não peso.** S1 e S3 valem ~11,8 pts cada no
>   composite; S10 vale 3,3. Priorize onde a alavanca existe.
> - **Os pesos são heurística, não backtested.** Diga isso você mesmo, antes
>   que alguém descubra.
'''),

("code", r'''codes = [d[0] for d in DIM_11]
labels = [d[1] for d in DIM_11]
scores = [d[2] for d in DIM_11]
weights = [d[3] for d in DIM_11]
soma_w = sum(weights)
contrib = [w * s / soma_w for w, s in zip(weights, scores)]

fig = make_subplots(
    rows=1, cols=2, column_widths=[0.46, 0.54],
    specs=[[{"type": "polar"}, {"type": "xy"}]],
    subplot_titles=(
        "Radar das 11 dimensões (score 0-100, maior = pior)",
        "Contribuição ao composite (pontos)",
    ),
    horizontal_spacing=0.12,
)

fig.add_trace(go.Scatterpolar(
    r=scores + [scores[0]], theta=codes + [codes[0]],
    fill="toself", fillcolor="rgba(2,132,199,0.28)",
    line=dict(color=AZUL, width=2.5),
    marker=dict(size=7, color=AZUL, line=dict(color=INK, width=1)),
    name="score atual",
    hovertext=[l + f" — score {s:.0f}" for l, s in zip(labels + [labels[0]], scores + [scores[0]])],
    hoverinfo="text",
), row=1, col=1)

for limiar, cor, nome in [(65.0, VERDE, "limiar GREEN (65)"), (80.0, TIJOLO, "limiar RED (80)")]:
    fig.add_trace(go.Scatterpolar(
        r=[limiar] * (len(codes) + 1), theta=codes + [codes[0]],
        mode="lines", line=dict(color=cor, width=1.6, dash="dot"),
        name=nome, hoverinfo="skip",
    ), row=1, col=1)

order = np.argsort(contrib)
bar_cores = [TIJOLO if scores[i] >= 80 else (AMBAR if scores[i] >= 65 else VERDE) for i in order]
fig.add_bar(
    x=[contrib[i] for i in order],
    y=[codes[i] + " · " + labels[i] for i in order],
    orientation="h",
    marker=dict(color=bar_cores, line=dict(color=INK, width=1.2)),
    text=[f"{contrib[i]:.1f} pts  (peso {weights[i]:.2f} × score {scores[i]:.0f})" for i in order],
    textposition="outside", textfont=dict(color=MUTED, size=9),
    showlegend=False, row=1, col=2,
)

style(fig, f"3 - Framework de 11 dimensoes: composite tecnico {COMPOSITE_11D}/100", height=560)
fig.update_polars(bgcolor=BG,
                  radialaxis=dict(range=[0, 100], gridcolor=GRID, linecolor=GRID,
                                  tickfont=dict(color=MUTED, size=9)),
                  angularaxis=dict(gridcolor=GRID, linecolor=GRID,
                                   tickfont=dict(color=INK, size=11)))
fig.update_layout(legend=dict(x=0.02, y=-0.06, orientation="h"))
fig.update_xaxes(title="pontos do composite", range=[0, max(contrib) * 2.05], row=1, col=2)
fig.update_yaxes(tickfont=dict(size=9), row=1, col=2)
fig.write_html(str(OUT_DIR / "l10-03-framework-11-dim.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

print("11 DIMENSÕES — score, peso, contribuição")
print("-" * 68)
for i in np.argsort(contrib)[::-1]:
    faixa = banda(scores[i])[0].split(" - ")[0]
    print(f"  {codes[i]:4s} {labels[i]:24s} score {scores[i]:5.1f} [{faixa:5s}] "
          f"peso {weights[i]:.2f}  ->  {contrib[i]:5.2f} pts")
print("-" * 68)
print(f"  Soma dos pesos      : {soma_w:.2f} (não 1,00 — normalizado na fórmula)")
print(f"  Soma ponderada      : {sum(w * s for w, s in zip(weights, scores)):.2f}")
print(f"  Composite 11-dim    : {COMPOSITE_11D}/100 -> {banda(COMPOSITE_11D)[0]}")
print(f"  Top-3 contribuições : {', '.join(codes[i] for i in np.argsort(contrib)[::-1][:3])} "
      f"= {sum(sorted(contrib)[::-1][:3]):.1f} pts de {COMPOSITE_11D} "
      f"({sum(sorted(contrib)[::-1][:3]) / COMPOSITE_11D * 100:.0f}%)")'''),

]
