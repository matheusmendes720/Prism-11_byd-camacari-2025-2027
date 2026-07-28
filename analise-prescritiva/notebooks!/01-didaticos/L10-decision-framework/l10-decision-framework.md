# L10 · Framework de Decisão — Integração para Executivos
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



```python
import json
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
print(f"  TTA médio       : {BT['avg_time_to_action_d']:.1f} dias")
```

    Notebooks prescritivos carregados:
      nb01: OK
      nb02: OK
      nb03: OK
      nb04: OK
      nb05: OK
      nb06: OK
      nb07: OK
      nb08: OK
    
    FRAMEWORK DE DECISÃO BYD — estado jul/2026
      Escala          : vulnerabilidade 0-100 (maior = pior)
      Composite 4-dim : 71.8/100 -> AMBER - Modo tensao (cluster 2)
      Composite 11-dim: 78.0/100 -> AMBER - Modo tensao (cluster 2)
      VaR-95 (NB-06)  : R$ 3.11 bi | CVaR-95 R$ 3.46 bi
      Sinal (NB-08)   : 5 TP / 1 FP -> após correções 0 FP
      TTA médio       : 9.5 dias
    

---

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



```python
fig = make_subplots(
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
print("A lição é direcional: acoplamento amplifica, diversificação dilui — nunca some VaRs.")
```



    Camada 1 - MEDIR    : NB-01 câmbio | NB-02 supply | NB-03 regulatório | NB-04 competição
    Camada 2 - INTEGRAR : NB-05 composite | NB-06 Monte Carlo | NB-07 acoplamentos
    Camada 3 - VALIDAR  : NB-08 backtesting (autoriza confiar no sinal)
    
    S1 isolado          : R$ 2.10 bi
    S2 isolado          : R$ 4.00 bi
    Soma ingênua        : R$ 6.10 bi   <- o que a planilha diz
    Acoplado (NB-07)    : R$ 9.16 bi   <- o que a realidade faz (+50%)
    VaR-95 MC (NB-06)   : R$ 3.11 bi   <- 4 choques, 126 dias, percentil 5
    
    Atenção: horizontes e definições diferem entre NB-06 e NB-07.
    A lição é direcional: acoplamento amplifica, diversificação dilui — nunca some VaRs.
    

---

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



```python
fig = make_subplots(
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
print(f"Diagnóstico              : gap de {TTA_OBS_H - 120:.0f} h é aprovação, não modelagem")
```



    1 · Dado bruto             -> PTAX, spot lítio, ViE, share
    2 · Sinal / dimensão       -> score 0-100 + 🟢🟡🔴
    3 · Composite              -> 1 número = 71.8
    4 · Gatilho                -> regra pré-acordada + histerese
    5 · Ação com dono          -> R/A/C/I + custo + prazo
    6 · Registro + backtest    -> acerto/erro → recalibra
    
    Meta latência sinal→ação : 5 dias úteis (120 h)
    Observado (NB-08)        : 9.5 dias (228 h)
    Diagnóstico              : gap de 108 h é aprovação, não modelagem
    

---

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



```python
codes = [d[0] for d in DIM_11]
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
      f"({sum(sorted(contrib)[::-1][:3]) / COMPOSITE_11D * 100:.0f}%)")
```



    11 DIMENSÕES — score, peso, contribuição
    --------------------------------------------------------------------
      S1   Câmbio (PTAX/GARCH)      score  78.0 [AMBER] peso 0.18  ->  11.80 pts
      S3   BNDES / regulatório      score  70.0 [AMBER] peso 0.20  ->  11.76 pts
      S2   Supply (lítio/HHI)       score  85.0 [RED  ] peso 0.15  ->  10.71 pts
      S7   ESG (lista suja)         score  92.0 [RED  ] peso 0.10  ->   7.73 pts
      S11  Competitivo (Nash)       score  82.0 [RED  ] peso 0.10  ->   6.89 pts
      S6   Macro (IPCA/Selic)       score  70.0 [AMBER] peso 0.10  ->   5.88 pts
      S5   Parcerias CATL/EVE       score  85.0 [RED  ] peso 0.08  ->   5.71 pts
      S8   Ramp SKD→CKD→nac.        score  77.0 [AMBER] peso 0.08  ->   5.18 pts
      S4   Pricing defensivo        score  72.0 [AMBER] peso 0.08  ->   4.84 pts
      S9   Demanda EV               score  72.0 [AMBER] peso 0.07  ->   4.24 pts
      S10  Tarifa de importação     score  78.0 [AMBER] peso 0.05  ->   3.28 pts
    --------------------------------------------------------------------
      Soma dos pesos      : 1.19 (não 1,00 — normalizado na fórmula)
      Soma ponderada      : 92.85
      Composite 11-dim    : 78.0/100 -> AMBER - Modo tensao (cluster 2)
      Top-3 contribuições : S1, S3, S2 = 34.3 pts de 78.0 (44%)
    

---

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



```python
dims4 = ["cambio", "regulatorio", "supply", "macro"]
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
print("  Nota: a curva 'sem mitigação' é ilustrativa (deriva linear), não previsão do modelo.")
```



    COMPOSITE STAKEHOLDER — decomposição de 71,8
    ----------------------------------------------------------------------
      Câmbio (S1)            score  78.0  x peso 0.30  =  23.40 pts   (alavanca 0.30 pt/pt)
      Regulatório (S3)       score  70.0  x peso 0.30  =  21.00 pts   (alavanca 0.30 pt/pt)
      Supply (S2)            score  85.0  x peso 0.20  =  17.00 pts   (alavanca 0.20 pt/pt)
      Macro (S6)             score  52.0  x peso 0.20  =  10.40 pts   (alavanca 0.20 pt/pt)
    ----------------------------------------------------------------------
      COMPOSITE 4-dim         71.8/100  ->  AMBER - Modo tensao (cluster 2)
      COMPOSITE 11-dim        78.0/100  ->  AMBER - Modo tensao (cluster 2)
      Divergência 4 vs 11  : 6.2 pts — MESMA faixa (ok)
    
      Meta 12 meses        : 60/100 -> exige remover 11.8 pontos
      Via câmbio/regulat.  : 39 pts de score (alavanca 0,30)
      Via supply/macro     : 59 pts de score (alavanca 0,20)
    
      Nota: a curva 'sem mitigação' é ilustrativa (deriva linear), não previsão do modelo.
    

---

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



```python
# 6 dimensões × 3 estados = 18 células (D3-TRIGGER-MATRIX.md §3)
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
print(f"  Governor S6 = AMBER -> multiplicador 1,5x aplicado em S1-S4")
```



    MATRIZ DE GATILHOS — estado vigente destacado
    ----------------------------------------------------------------------------
      S1 Câmbio      [AMBER] score   78 -> h* x 1,5 (cap 95%)              
                             R$    9.0M  dono Risk Officer     latência 5 min
      S2 Supply      [RED  ] score   85 -> spot + hedge via S5             
                             R$   80.0M  dono Head Supply      latência 60 min
      S3 BNDES       [AMBER] score   70 -> dobrar advocacy (R$ 24M)        
                             R$   12.0M  dono Head Gov Rel     latência 5 min
      S4 Pricing     [AMBER] score   72 -> defensivo +1 tier               
                             R$   15.0M  dono Head Marketing   latência 5 min
      S5 Parcerias   [RED  ] score   85 -> renegociar + diversificar       
                             R$   20.0M  dono Head Procurement latência 60 min
      S6 Macro       [AMBER] score   70 -> composite +13 (governor 1,5x)   
                             R$   60.0M  dono CSO              latência 5 min
    ----------------------------------------------------------------------------
      Custo das ações vigentes : R$ 196.0M/ano
      VaR-95 (NB-06)           : R$ 3110M  (R$ 3.11 bi)
      Custo / VaR              : 6.3% do risco
      CVaR-95 (cauda)          : R$ 3.46 bi
    
    KILL SWITCHES (ignoram o composite):
      BNDES negado           -> ação em <= 1 h
      PTAX vol>=30% 5d       -> ação em <= 1 h
      CATL atraso >60d       -> ação em <= 12 h
      Lítio >=US$80k/t 3m    -> ação em <= 24 h
    
      Governor S6 = AMBER -> multiplicador 1,5x aplicado em S1-S4
    

---

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



```python
EV = NB["nb08"]["events"]
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
print("  100% é teto in-sample. Validação honesta = out-of-sample com regras congeladas.")
```



    BACKTESTING — 6 eventos de stress (2020-2025)
    ------------------------------------------------------------------------------
      [OK ] 2020-03  COVID-19 Crash                 PTAX  +42.7% Li  +75.0%  RED   TP TTA  7d
      [OK ] 2021-01  Semicondutor Chip Shortage     PTAX   +0.0% Li  +53.8%  RED   TP TTA 12d
      [OK ] 2022-06  Spike Lítio                    PTAX   +0.0% Li +900.0%  RED   TP TTA  9d
      [OK ] 2022-09  Eleição 2022 Risco             PTAX   +9.4% Li  +17.6%  RED   TP TTA  8d
      [ERR] 2024-10  Eleição 2024                   PTAX  +10.9% Li   +8.3%  RED   FP TTA 10d
      [OK ] 2025-01  Estagflação 2025               PTAX   +7.9% Li  +18.2%  AMBER TP TTA 11d
    ------------------------------------------------------------------------------
      Antes das correções : 5 TP · 1 FP · 0 FN -> precisão 83.3% · recall 100,0%
      Depois das correções: 5 TP · 0 FP · 0 FN -> precisão 100.0% · recall 100,0%
      TTA médio           : 9.5 dias (meta 5) — 0/6 eventos dentro da meta
    
      Ressalva metodológica: as 4 correções foram calibradas nos MESMOS 6 eventos.
      100% é teto in-sample. Validação honesta = out-of-sample com regras congeladas.
    

---

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



```python
top = sorted(DIM_11, key=lambda d: d[2], reverse=True)[:6]
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
print("=" * 78)
```



    ==============================================================================
    RESUMO EXECUTIVO — FRAMEWORK DE DECISÃO BYD CAMAÇARI (jul/2026)
    ==============================================================================
      1. Estado          : composite 71.8/100 -> AMBER - Modo tensao (cluster 2)
                           (motor técnico 11-dim: 78.0/100, mesma faixa)
      2. Risco           : VaR-95 R$ 3.11 bi | CVaR-95 R$ 3.46 bi
      3. Acoplamento     : S1+S2 somados R$ 6.10 bi -> acoplados R$ 9.16 bi (+50%)
      4. Pior sinal      : S7 ESG score 92 — kill switch do BNDES (prob. 10%)
      5. Validação       : 5 TP · 1 FP · 0 FN -> 100% pós-correção
      6. Gargalo         : TTA 9.5 d vs meta 5 d (aprovação, não modelagem)
      7. Economia        : R$ 196M/ano protegendo R$ 3.110M (6.3%)
    ------------------------------------------------------------------------------
      DECISÃO: modo tensão -> defensivo, não expansivo.
      Hedge ativo, capex sob revisão, cadência semanal, kill switches armados.
    ==============================================================================
    

---

## Resumo executivo — exportação

O bloco abaixo consolida os oito notebooks prescritivos (NB-01 … NB-08) com a
leitura executiva do framework e salva
`outputs/learning/l10_framework_executive.json`.



```python
resumo = {
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
print(f"   problema real é que levamos {BT['avg_time_to_action_d']:.1f} dias para agir quando a meta é 5.'")
```

    Resumo executivo salvo em:
      C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva\outputs\learning\l10_framework_executive.json
      12.107 bytes · 7 conceitos · 15 frases executivas · 7 visualizações
    
    Frase de abertura para a reunião:
      'Estamos em 71.8 sobre 100 — modo tensão, não crise. O risco medido
       é R$ 3.11 bi de VaR-95, e ele acopla: câmbio com supply juntos valem
       50% mais que somados. O pior sinal é ESG (92), porque ele desliga o
       BNDES. O sinal foi validado em 6 eventos reais com zero falso negativo.
       Estamos gastando ~R$ 196M/ano para proteger R$ 3.11 bi — e o único
       problema real é que levamos 9.5 dias para agir quando a meta é 5.'
    

---

## 8 · A história completa — como oito cadernos viram uma decisão

### ① Por que uma narrativa agora

Você acabou de ler sete capítulos analíticos. Cada um mostrou um instrumento,
uma conta, uma tabela. Mas o que une L0 a L10 não é técnica: é **a história
de um problema de negócio** que foi refinado camada a camada até virar um
veredito de uma linha. Esta seção tece a narrativa completa — começo, meio e
fim — para que, ao fechar este caderno, você não se lembre de fórmulas, mas
da **cadeia de decisões que as fórmulas sustentam**.

### ② O começo — "temos um problema"

Em **L0** abrimos com um fato inconveniente: a média do PTAX em 2024 foi
R$ 5,20, mas em três meses do ano ela passou de R$ 5,80 e em outros três
ficou abaixo de R$ 4,90. Quem olha só a média toma decisão errada — porque
a variação **dentro** do ano foi maior que a variação **entre** anos. A
primeira lição é esta: **olhe a distribuição, não o ponto**.

Em **L1**, mostramos que a incerteza não é "número grande", é **forma**:
a distribuição PTAX tem caudas gordas (vol 30d em pico de 4,8% ao ano,
mas no COVID chegou a 12%). Probabilidade não é opinião — é área sob
uma curva que se pode calibrar e perguntar.

Em **L2**, aprendemos que correlação não é causalidade: PTAX e lítio
subiram juntos no COVID por causa do dólar, não por causalidade direta.
E que o p-valor sozinho mente sem o **tamanho de efeito** ao lado.

Em **L3**, mostramos que uma regressão linear é poderosa quando a relação
é limpa, mas BYD-2025 não é limpa: o lítio quebra o modelo em 2022.

### ③ O meio — "o problema tem mais de uma causa"

Em **L4**, o tempo entrou como personagem: tendência, sazonalidade,
autocorrelação. Em **L5**, a volatilidade deixou de ser número e virou
**regime** — o GARCH(1,1)-t mostrou que PTAX agrupa crises, e isso muda
a forma de fazer hedge. Em **L6**, 10.000 futuros simulados deram a
resposta que um cenário pontual nunca daria: **VaR-95 = R$ 3,11 bi**.

Em **L7**, juntamos oito variáveis e descobrimos que três explicam 78%
da variância — mas o resíduo importa mais que a média para risco de cauda.

Em **L8**, mostramos que existe um **tamanho ótimo de hedge** dentro das
restrições (custo, balanço, governança), e que ele não é "100%" nem "0%".

Em **L9**, o concorrente entrou no jogo: cada movimento da BYD provoca
reação. O equilíbrio de Nash E3 mostrou que **agressão defensiva gera
guerra de preços, e contenção gera coalizão**.

### ④ O fim — "agora temos um framework"

Em **L10**, as oito histórias viraram **uma decisão**. O composite 71,8
não é uma média: é o **ponto de equilíbrio entre o que sabemos, o que
medimos, o que simulamos e o que validamos no passado**. Os 11 sinais
são os alarmes; os 4 kill switches são os disjuntores; as 18 células
são os contratos pré-acordados com a realidade.

A frase final do projeto é esta: **análise não é decisão** — mas sem
análise, decisão é chute. O L10 fechou o ciclo: mostrou que um framework
não substitui o julgamento humano, **amplifica o julgamento humano**,
fazendo com que a próxima decisão do comitê (a aprovação de 9,5 para 5
dias) seja tomada com 71,8 de evidência em cima da mesa, e não com um
palpite.

> *"A diferença entre uma empresa que sobrevive a 2027 e uma que não, não
> é quem tem mais dados. É quem age em cima deles antes da crise."*

### ⑤ O que você leva para casa

Três coisas, em ordem de prioridade:

1. **O número e a faixa, sempre juntos.** 71,8 não decide nada; "71,8 = modo
   tensão" decide. A faixa é o que dispara a ação.
2. **O custo da ação ao lado do risco que ela mitiga.** R$ 196M/ano vs
   R$ 3,11 bi de VaR-95 é o que aprova orçamento. Risco sem custo assusta;
   risco com custo convence.
3. **O gargalo é execução, não modelo.** Você tem um sinal que acerta 5 em
   6 vezes no passado. Leva 9,5 dias para virar ação. Isso não é falha de
   analytics: é falha de processo. A próxima decisão do comitê não é
   trocar o GARCH — é encurtar a aprovação.

---

## 9 · Anexos visuais — três PNGs para a reunião

Esta seção produz três imagens **estáticas (PNG)** prontas para colar em
slide ou PDF executivo:

| Arquivo | Conteúdo | Quando usar |
|---|---|---|
| `outputs/learning/l10_dashboard_composite.png` | Dashboard: 4 KPIs + faixa + decomposição + radar + gatilhos | Slide 1 (estado atual) |
| `outputs/learning/l10_decision_tree.png` | Fluxograma kill switch + composite | Slide 2 (quem age quando) |
| `outputs/learning/l10_executive_checklist.png` | 12 ações em 4 prazos com dono + custo | Slide 3 (o que levar) |

Os três são gerados a partir dos mesmos dados do composite e substituem as
versões HTML para contextos onde Plotly não roda (PowerPoint, PDF,
WhatsApp). As próximas três células de código geram essas três figuras.



```python
# Dashboard composite — gera outputs/learning/l10_dashboard_composite.png
# Sao 4 KPIs (composite 71,8 . VaR-95 . gargalo 9,5 d . backtest 100%) +
# faixa GREEN/AMBER/RED + decomposicao por dimensao + radar 11D + matriz
# de gatilhos 6x3. Tudo numa unica figura dark-theme para slide executivo.
import sys
sys.path.insert(0, ".")
from _l10_story_addon import build_dashboard
build_dashboard()
print("OK . l10_dashboard_composite.png")

```

    OK . l10_dashboard_composite.png
    


```python
# Decision tree — gera outputs/learning/l10_decision_tree.png
# Fluxograma bifurcado: 4 kill switches binarios (PTAX, BNDES, CATL,
# litio) com prazo de acao, vs 3 estados do composite (GREEN/AMBER/RED)
# com latencia. Regra soberana em destaque: kill switch ignora composite.
import sys
sys.path.insert(0, ".")
from _l10_story_addon import build_decision_tree
build_decision_tree()
print("OK . l10_decision_tree.png")

```

    OK . l10_decision_tree.png
    


```python
# Executive checklist — gera outputs/learning/l10_executive_checklist.png
# 12 acoes organizadas em 4 prazos (AGORA 72h . CURTO 2 sem . MEDIO 90 d
# . CONTINUO) com dono, custo e prazo por item. Footer com frase de
# abertura para a reuniao.
import sys
sys.path.insert(0, ".")
from _l10_story_addon import build_checklist
build_checklist()
print("OK . l10_executive_checklist.png")

```

    OK . l10_executive_checklist.png
    

---

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

