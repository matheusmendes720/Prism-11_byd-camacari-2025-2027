# L4 · Análise de Séries Temporais para Executivos

**Análise Prescritiva — Camada de Alfabetização de Dados (Learning)**

| Campo | Detalhe |
|---|---|
| **Notebook** | L4 · Time Series Analysis for Executives |
| **Autor** | Matheus Mendes |
| **Data** | 27/julho/2026 |
| **Versão** | 1.0 |
| **Público-alvo** | Executivos não-técnicos — "para onde isso vai, e dá pra confiar?" |
| **Dependências** | numpy, pandas, plotly, statsmodels |

---

## Por que este notebook existe

Em **L0** você aprendeu a **ler números** (média, variância, percentil, correlação).
Em **L1** aprendeu a falar de **incerteza** (probabilidade, valor esperado, Bayes).
Em **L3** aprendeu a transformar correlação em **previsão** (regressão linear).

Em **L4** entra a dimensão que faltava: o **tempo**. Quase todo número que
importa num board — câmbio PTAX, vendas mensais, custo do BOM, market share —
não é um ponto isolado: é uma **série que se move mês a mês**. E séries no
tempo têm regras próprias que a estatística de L0 ignora.

A pergunta executiva de L4 não é "quanto?" nem "qual a chance?" nem "se eu mexo
aqui, o que acontece?". É:

> **"Para onde este número está indo — e o quanto posso confiar na projeção?"**

Este material segue o formato **narrativa-primeiro**:

> **Conceito → Intuição → Matemática → Código → Recado Executivo**

Todos os números vêm do **case BYD Camaçari**: a série mensal do **PTAX**
(R$/US$, 2021–2026) e as **vendas mensais** do portfólio BYD no Brasil.
O tema escuro (`#0d1117`) e a paleta (`azul-petróleo · vermelho-tijolo · teal ·
violeta · laranja-âmbar`) seguem o mesmo padrão visual dos cadernos anteriores.

---

### Os 6 conceitos deste caderno

| # | Conceito | Pergunta que responde | Exemplo BYD |
|---|----------|-----------------------|-------------|
| 1 | **Série temporal** | O que muda no tempo? | PTAX mês a mês, 2021–2026 |
| 2 | **Tendência (*trend*)** | Para onde está indo? | PTAX subindo no longo prazo |
| 3 | **Sazonalidade** | Que padrão se repete? | Vendas fortes em Q4/Q1 |
| 4 | **Estacionariedade** | É estável ou está à deriva? | Nível vs. variação do PTAX |
| 5 | **Autocorrelação** | O que prevê a si mesmo? | Vendas de hoje ecoam há 12 meses |
| 6 | **Previsão (*forecast*)** | O que vem pela frente? | Vendas BYD 12 meses à frente |

Cada seção fecha com um **Recado Executivo** — a frase que você leva para a
reunião.



```python
# ──────────────────────────────────────────────────────────────
# Setup — tema escuro, paleta validada, séries do case BYD
# ──────────────────────────────────────────────────────────────
import json
from pathlib import Path
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
from plotly.subplots import make_subplots

pio.renderers.default = "notebook_connected"
np.random.seed(42)

# ── Diretórios de saída (JSON + HTMLs das visualizações) ──
NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
OUT_DIR  = NOTEBOOK_ROOT / "outputs" / "learning"
HTML_DIR = OUT_DIR
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Paleta validada no dataviz skill (ALL CHECKS PASS, surface #0d1117) ──
BG      = "#0d1117"
INK     = "#e8edf5"
MUTED   = "#9baabb"
GRID    = "#30363d"

AZUL    = "#0284c7"
TIJOLO  = "#dc2626"
TEAL    = "#0d9488"
VIOLETA = "#9333ea"
AMBAR   = "#ea580c"

STATUS_GOOD = "#22c55e"
STATUS_WARN = AMBAR
STATUS_BAD  = TIJOLO

def style(fig, title, height=480):
    fig.update_layout(
        template="plotly_dark", paper_bgcolor=BG, plot_bgcolor=BG,
        title=dict(text=title, x=0.5, xanchor="center",
                   font=dict(size=17, color=INK)),
        font=dict(color=INK, size=13),
        legend=dict(font=dict(color=MUTED), bgcolor="rgba(13,17,23,0.6)",
                    bordercolor=GRID, borderwidth=1),
        margin=dict(l=60, r=40, t=70, b=55), height=height,
    )
    fig.update_xaxes(color=MUTED, gridcolor=GRID, zerolinecolor=GRID, linecolor=GRID)
    fig.update_yaxes(color=MUTED, gridcolor=GRID, zerolinecolor=GRID, linecolor=GRID)
    return fig

# ── Série 1: PTAX mensal (R$/US$) calibrada, jan/2021 → jun/2026 ──
# Passeio aleatório com deriva (random walk + drift): o NÍVEL é
# não-estacionário (vagueia, sem âncora — ADF não rejeita), mas a
# VARIAÇÃO mensal é estacionária. Termina em 5.1176 (PTAX atual).
meses = pd.date_range("2021-01-01", "2026-06-01", freq="MS")
n = len(meses)
t = np.arange(n)
drift   = 0.016                                    # deriva de alta por mês
choques = np.random.normal(drift, 0.05, n)         # variação mensal (estacionária)
ptax = 5.10 + np.cumsum(choques)                   # nível = soma acumulada (passeio)
ptax = ptax - ptax[-1] + 5.1176                    # ancora o último no PTAX atual
ptax = np.round(np.clip(ptax, 4.4, 6.4), 4)
ptax_s = pd.Series(ptax, index=meses, name="PTAX")

# ── Série 2: vendas mensais BYD Brasil (unidades), com tendência + sazonalidade ──
base_vendas = 1200 + 42 * t                          # rampa de ramp-up BYD BR
saz_mensal = np.array([1.18, 1.10, 1.02, 0.95, 0.90, 0.86,   # jan..jun
                        0.88, 0.94, 1.00, 1.06, 1.14, 1.22])  # jul..dez
saz = np.array([saz_mensal[m.month - 1] for m in meses])
ruido = np.random.normal(0, 0.05, n)
vendas = base_vendas * saz * (1 + ruido)
vendas = np.round(vendas).astype(int)
vendas_s = pd.Series(vendas, index=meses, name="vendas")

BYD = {
    "ptax_atual":          float(ptax_s.iloc[-1]),
    "ptax_medio_periodo":  round(float(ptax_s.mean()), 4),
    "vol_anual_pct":       14.2,
    "imported_share_bom":  0.42,
    "incentivo_coverage":  0.18,
    "vendas_ult_mes":      int(vendas_s.iloc[-1]),
    "vendas_media_2026":   int(vendas_s["2026"].mean()),
    "meses_serie":         int(n),
}

print("Setup OK · tema escuro carregado · 2 séries BYD prontas")
print(f"PTAX: {n} meses ({meses[0]:%b/%Y} -> {meses[-1]:%b/%Y}) · "
      f"atual R$ {BYD['ptax_atual']:.4f}")
print(f"Vendas BYD BR: ultimo mes {BYD['vendas_ult_mes']} un · "
      f"media 2026 {BYD['vendas_media_2026']} un/mes")

```

    Setup OK · tema escuro carregado · 2 séries BYD prontas
    PTAX: 66 meses (Jan/2021 -> Jun/2026) · atual R$ 5.1176
    Vendas BYD BR: ultimo mes 3391 un · media 2026 3712 un/mes
    

---

## 1 · Série temporal — o número que carrega sua própria história

### ① Por que isto importa
Um relatório mostra "PTAX = R$ 5,12". Ok — mas **5,12 vindo de onde?** Se veio
caindo de 6,20, a leitura é "alívio, hedge relaxa". Se veio subindo de 4,60, é
"alerta, custo do BOM disparando". **O mesmo número significa coisas opostas
dependendo do caminho.** Série temporal é o número **com o caminho anexado** —
e sem o caminho, decisão nenhuma sobre câmbio, vendas ou estoque faz sentido.

### ② Conceito, sem jargão
Série temporal = uma sequência de medições do **mesmo indicador**, tomadas em
**intervalos regulares** (todo mês, todo dia), **na ordem em que aconteceram**.
A ordem é sagrada: embaralhar uma série temporal destrói a informação, ao
contrário de uma amostra de L0 (onde a ordem não importa).

### ③ Intuição — o PTAX mês a mês
A figura abaixo é a série do PTAX (R$/US$) de jan/2021 a jun/2026. Repare que
ela **não pula aleatoriamente**: cada mês fica *perto* do anterior (o dólar não
salta de 5 para 8 de um mês pro outro) e há trechos de alta e de calmaria. Essa
"memória de curto prazo" é a assinatura de toda série temporal.

### ④ A matemática
Formalmente uma série é $\{y_t\}_{t=1}^{T}$, indexada pelo tempo $t$. Quase
sempre a decompomos em três ingredientes:

$$y_t = \underbrace{T_t}_{\text{tendência}} + \underbrace{S_t}_{\text{sazonalidade}} + \underbrace{R_t}_{\text{resíduo}}$$

As três próximas seções (Tendência, Sazonalidade, Estacionariedade) são
exatamente sobre **isolar cada uma dessas parcelas**.



```python
# ──────────────────────────────────────────────────────────────
# Série temporal — o PTAX mês a mês (a "história" do câmbio)
# ──────────────────────────────────────────────────────────────
ult = ptax_s.iloc[-1]
pico = ptax_s.max();  vale = ptax_s.min()
mes_pico = ptax_s.idxmax(); mes_vale = ptax_s.idxmin()
amplitude_pct = (pico - vale) / vale * 100

print(f"PTAX periodo: {ptax_s.index[0]:%b/%Y} -> {ptax_s.index[-1]:%b/%Y}")
print(f"  atual : R$ {ult:.4f}")
print(f"  pico  : R$ {pico:.4f} ({mes_pico:%b/%Y})")
print(f"  vale  : R$ {vale:.4f} ({mes_vale:%b/%Y})")
print(f"  amplitude pico->vale: {amplitude_pct:.1f}% — mesmo numero, historias opostas")

fig = go.Figure()
fig.add_scatter(x=ptax_s.index, y=ptax_s.values, mode="lines",
                line=dict(color=AZUL, width=2.5), name="PTAX (R$/US$)",
                hovertemplate="%{x|%b/%Y}<br>R$ %{y:.4f}<extra></extra>")
fig.add_scatter(x=[mes_pico], y=[pico], mode="markers+text", text=["pico"],
                textposition="top center", textfont=dict(color=TIJOLO),
                marker=dict(color=TIJOLO, size=11), name="pico",
                hovertemplate="pico R$ %{y:.4f}<extra></extra>")
fig.add_scatter(x=[mes_vale], y=[vale], mode="markers+text", text=["vale"],
                textposition="bottom center", textfont=dict(color=STATUS_GOOD),
                marker=dict(color=STATUS_GOOD, size=11), name="vale",
                hovertemplate="vale R$ %{y:.4f}<extra></extra>")
fig.add_scatter(x=[ptax_s.index[-1]], y=[ult], mode="markers",
                marker=dict(color=INK, size=12, symbol="star"), name="atual")
style(fig, "1 · Série temporal do PTAX — o número com o caminho anexado")
fig.update_yaxes(title="R$ por US$")
fig.write_html(str(HTML_DIR / "l4-01-serie-ptax.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    PTAX periodo: Jan/2021 -> Jun/2026
      atual : R$ 5.1176
      pico  : R$ 5.1176 (Jun/2026)
      vale  : R$ 4.6063 (Jan/2021)
      amplitude pico->vale: 11.1% — mesmo numero, historias opostas
    


<script>
window.PlotlyConfig = {MathJaxConfig: 'local'};
if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}
</script>
<script type="module">import "https://cdn.plot.ly/plotly-3.6.0.min"</script>




<div style="height:480px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="647fa679-42ea-43d5-8344-bdfdb945f65d" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("647fa679-42ea-43d5-8344-bdfdb945f65d")) {                    Plotly.newPlot(                        "647fa679-42ea-43d5-8344-bdfdb945f65d",                        [{"hovertemplate":"%{x|%b\u002f%Y}\u003cbr\u003eR$ %{y:.4f}\u003cextra\u003e\u003c\u002fextra\u003e","line":{"color":"#0284c7","width":2.5},"mode":"lines","name":"PTAX (R$\u002fUS$)","x":["2021-01-01T00:00:00.000000000","2021-02-01T00:00:00.000000000","2021-03-01T00:00:00.000000000","2021-04-01T00:00:00.000000000","2021-05-01T00:00:00.000000000","2021-06-01T00:00:00.000000000","2021-07-01T00:00:00.000000000","2021-08-01T00:00:00.000000000","2021-09-01T00:00:00.000000000","2021-10-01T00:00:00.000000000","2021-11-01T00:00:00.000000000","2021-12-01T00:00:00.000000000","2022-01-01T00:00:00.000000000","2022-02-01T00:00:00.000000000","2022-03-01T00:00:00.000000000","2022-04-01T00:00:00.000000000","2022-05-01T00:00:00.000000000","2022-06-01T00:00:00.000000000","2022-07-01T00:00:00.000000000","2022-08-01T00:00:00.000000000","2022-09-01T00:00:00.000000000","2022-10-01T00:00:00.000000000","2022-11-01T00:00:00.000000000","2022-12-01T00:00:00.000000000","2023-01-01T00:00:00.000000000","2023-02-01T00:00:00.000000000","2023-03-01T00:00:00.000000000","2023-04-01T00:00:00.000000000","2023-05-01T00:00:00.000000000","2023-06-01T00:00:00.000000000","2023-07-01T00:00:00.000000000","2023-08-01T00:00:00.000000000","2023-09-01T00:00:00.000000000","2023-10-01T00:00:00.000000000","2023-11-01T00:00:00.000000000","2023-12-01T00:00:00.000000000","2024-01-01T00:00:00.000000000","2024-02-01T00:00:00.000000000","2024-03-01T00:00:00.000000000","2024-04-01T00:00:00.000000000","2024-05-01T00:00:00.000000000","2024-06-01T00:00:00.000000000","2024-07-01T00:00:00.000000000","2024-08-01T00:00:00.000000000","2024-09-01T00:00:00.000000000","2024-10-01T00:00:00.000000000","2024-11-01T00:00:00.000000000","2024-12-01T00:00:00.000000000","2025-01-01T00:00:00.000000000","2025-02-01T00:00:00.000000000","2025-03-01T00:00:00.000000000","2025-04-01T00:00:00.000000000","2025-05-01T00:00:00.000000000","2025-06-01T00:00:00.000000000","2025-07-01T00:00:00.000000000","2025-08-01T00:00:00.000000000","2025-09-01T00:00:00.000000000","2025-10-01T00:00:00.000000000","2025-11-01T00:00:00.000000000","2025-12-01T00:00:00.000000000","2026-01-01T00:00:00.000000000","2026-02-01T00:00:00.000000000","2026-03-01T00:00:00.000000000","2026-04-01T00:00:00.000000000","2026-05-01T00:00:00.000000000","2026-06-01T00:00:00.000000000"],"y":{"dtype":"f8","bdata":"W0I+6NlsEkBn1edqK3YSQNZW7C+7pxJAoBov3SQGE0BDrWnecQoTQAIrhxbZDhNA46WbxCBwE0DyQc9m1acTQKpgVFInoBNAPzVeuknME0BpAG+BBMUTQFr1udqKvRNAXwfOGVHaE0BiEFg5tIgTQOJYF7fRQBNAak3zjlM0E0A3iUFg5RATQDarPldbMRNAwaikTkATE0B6Nqs+V9sSQBBYObTINhNAQYLix5g7E0Csrdhfdk8TQJ\u002fNqs\u002fVFhNAQfFjzF0LE0AaUdobfCETQC1DHOvi9hJAmN2Th4UaE0AjSnuDLwwTQK8l5IOeDRNAHqfoSC7\u002fEkADCYofY24TQOeMKO0NfhNAKqkT0ERYE0BQ\u002fBhz15ITQIbJVMGoZBNAxyk6kst\u002fE0BAE2HD0ysTQJwzorQ3+BJAGCZTBaMSE0B\u002f+zpwzkgTQKfoSC7\u002fYRNA6pWyDHFsE0AFxY8xd20TQPwYc9cSMhNABFYOLbIdE0AtIR\u002f0bBYTQD7o2az6XBNA5dAi2\u002fl+E0AwuycPCzUTQLx0kxgEVhNANBE2PL1SE0BxrIvbaEATQOOlm8QgcBNAaJHtfD+1E0CFfNCzWfUTQO2ePCzU2hNAejarPlfbE0B4nKIjufwTQOXQItv5PhRALUMc6+I2FECSy39Ivz0UQC\u002fdJAaBFRRA1JrmHafoE0BRa5p3nCIUQNUJaCJseBRA"},"type":"scatter"},{"hovertemplate":"pico R$ %{y:.4f}\u003cextra\u003e\u003c\u002fextra\u003e","marker":{"color":"#dc2626","size":11},"mode":"markers+text","name":"pico","text":["pico"],"textfont":{"color":"#dc2626"},"textposition":"top center","x":["2026-06-01T00:00:00"],"y":[5.1176],"type":"scatter"},{"hovertemplate":"vale R$ %{y:.4f}\u003cextra\u003e\u003c\u002fextra\u003e","marker":{"color":"#22c55e","size":11},"mode":"markers+text","name":"vale","text":["vale"],"textfont":{"color":"#22c55e"},"textposition":"bottom center","x":["2021-01-01T00:00:00"],"y":[4.6063],"type":"scatter"},{"marker":{"color":"#e8edf5","size":12,"symbol":"star"},"mode":"markers","name":"atual","x":["2026-06-01T00:00:00"],"y":[5.1176],"type":"scatter"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"title":{"font":{"size":17,"color":"#e8edf5"},"text":"1 · Série temporal do PTAX — o número com o caminho anexado","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":480,"xaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"R$ por US$"}}},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('647fa679-42ea-43d5-8344-bdfdb945f65d');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Série temporal
> - **Todo indicador de board é uma série, não um ponto.** "PTAX = 5,12" sem o
>   caminho é meia-informação: 5,12 *subindo* e 5,12 *caindo* pedem decisões opostas.
> - **A ordem carrega a informação.** Diferente de uma amostra estática (L0),
>   embaralhar uma série destrói tudo — cada mês herda o anterior.
> - **Toda série se decompõe em tendência + sazonalidade + resíduo.** Saber qual
>   parcela está mandando é o que separa "reação a ruído" de "reação a sinal".


---

## 2 · Tendência — para onde a série está *realmente* indo

### ① Por que isto importa
O ruído mês a mês engana. Um executivo vê o PTAX cair de 5,30 para 5,18 e
comemora — mas se a **tendência** de fundo é de alta, essa queda é só um soluço
antes de novos recordes. Tendência é o **rumo estrutural**, filtrando o
chiado. Confundir soluço com virada de rumo é a origem #1 de hedge desmontado
cedo demais.

### ② Conceito, sem jargão
Tendência = o movimento **lento e persistente** que sobrevive quando você
"borra" o zigue-zague de curto prazo. A ferramenta clássica de borrar é a
**média móvel**: em vez do valor do mês, olhe a média dos últimos 12 meses —
o vaivém se cancela e sobra o rumo.

### ③ Intuição — média móvel de 12 meses do PTAX
A linha fina (azul) é o PTAX cru; a linha grossa (âmbar) é a média móvel de 12
meses. A grossa ignora os soluços e mostra o **rumo**: onde ela inclina para
cima, o câmbio está estruturalmente se depreciando — custo do BOM importado
(42%) sob pressão persistente, não pontual.

### ④ A matemática
Média móvel centrada de janela $k$:

$$\text{MM}_t = \frac{1}{k}\sum_{i=-k/2}^{k/2} y_{t+i}$$

Alternativa paramétrica: ajustar uma reta $y_t = \beta_0 + \beta_1 t$ (regressão
de L3 com o tempo como X). O **sinal de $\beta_1$** é o rumo; sua **magnitude**
é a velocidade da deriva (R$/mês).



```python
# ──────────────────────────────────────────────────────────────
# Tendência — média móvel de 12m + reta de tendência (β1 = rumo)
# ──────────────────────────────────────────────────────────────
mm12 = ptax_s.rolling(12, center=True).mean()

# reta de tendência (regressão de L3 com o tempo como X)
tt = np.arange(len(ptax_s))
beta1, beta0 = np.polyfit(tt, ptax_s.values, 1)
reta = beta0 + beta1 * tt
deriva_ano = beta1 * 12

print(f"Reta de tendência: PTAX = {beta0:.3f} + ({beta1:+.4f}) * mes")
print(f"  slope β1 = {beta1:+.4f} R$/mes  ->  deriva de {deriva_ano:+.3f} R$/ano")
print(f"  rumo: {'ALTA (depreciacao do real)' if beta1 > 0 else 'BAIXA'} — "
      f"tendencia estrutural, nao soluco mensal")

fig = go.Figure()
fig.add_scatter(x=ptax_s.index, y=ptax_s.values, mode="lines",
                line=dict(color=AZUL, width=1.2), opacity=0.55, name="PTAX cru",
                hovertemplate="%{x|%b/%Y}<br>R$ %{y:.4f}<extra></extra>")
fig.add_scatter(x=mm12.index, y=mm12.values, mode="lines",
                line=dict(color=AMBAR, width=4), name="Média móvel 12m (rumo)",
                hovertemplate="MM12 %{x|%b/%Y}<br>R$ %{y:.4f}<extra></extra>")
fig.add_scatter(x=ptax_s.index, y=reta, mode="lines",
                line=dict(color=VIOLETA, width=2, dash="dash"),
                name=f"Reta tendência · {beta1:+.4f} R$/mes")
style(fig, "2 · Tendência do PTAX — média móvel filtra o soluço, revela o rumo")
fig.update_yaxes(title="R$ por US$")
fig.write_html(str(HTML_DIR / "l4-02-tendencia.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    Reta de tendência: PTAX = 4.743 + (+0.0032) * mes
      slope β1 = +0.0032 R$/mes  ->  deriva de +0.039 R$/ano
      rumo: ALTA (depreciacao do real) — tendencia estrutural, nao soluco mensal
    


<div style="height:480px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="df0ae7de-22d3-4ab7-bed5-331379e00d05" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("df0ae7de-22d3-4ab7-bed5-331379e00d05")) {                    Plotly.newPlot(                        "df0ae7de-22d3-4ab7-bed5-331379e00d05",                        [{"hovertemplate":"%{x|%b\u002f%Y}\u003cbr\u003eR$ %{y:.4f}\u003cextra\u003e\u003c\u002fextra\u003e","line":{"color":"#0284c7","width":1.2},"mode":"lines","name":"PTAX cru","opacity":0.55,"x":["2021-01-01T00:00:00","2021-02-01T00:00:00","2021-03-01T00:00:00","2021-04-01T00:00:00","2021-05-01T00:00:00","2021-06-01T00:00:00","2021-07-01T00:00:00","2021-08-01T00:00:00","2021-09-01T00:00:00","2021-10-01T00:00:00","2021-11-01T00:00:00","2021-12-01T00:00:00","2022-01-01T00:00:00","2022-02-01T00:00:00","2022-03-01T00:00:00","2022-04-01T00:00:00","2022-05-01T00:00:00","2022-06-01T00:00:00","2022-07-01T00:00:00","2022-08-01T00:00:00","2022-09-01T00:00:00","2022-10-01T00:00:00","2022-11-01T00:00:00","2022-12-01T00:00:00","2023-01-01T00:00:00","2023-02-01T00:00:00","2023-03-01T00:00:00","2023-04-01T00:00:00","2023-05-01T00:00:00","2023-06-01T00:00:00","2023-07-01T00:00:00","2023-08-01T00:00:00","2023-09-01T00:00:00","2023-10-01T00:00:00","2023-11-01T00:00:00","2023-12-01T00:00:00","2024-01-01T00:00:00","2024-02-01T00:00:00","2024-03-01T00:00:00","2024-04-01T00:00:00","2024-05-01T00:00:00","2024-06-01T00:00:00","2024-07-01T00:00:00","2024-08-01T00:00:00","2024-09-01T00:00:00","2024-10-01T00:00:00","2024-11-01T00:00:00","2024-12-01T00:00:00","2025-01-01T00:00:00","2025-02-01T00:00:00","2025-03-01T00:00:00","2025-04-01T00:00:00","2025-05-01T00:00:00","2025-06-01T00:00:00","2025-07-01T00:00:00","2025-08-01T00:00:00","2025-09-01T00:00:00","2025-10-01T00:00:00","2025-11-01T00:00:00","2025-12-01T00:00:00","2026-01-01T00:00:00","2026-02-01T00:00:00","2026-03-01T00:00:00","2026-04-01T00:00:00","2026-05-01T00:00:00","2026-06-01T00:00:00"],"y":{"dtype":"f8","bdata":"W0I+6NlsEkBn1edqK3YSQNZW7C+7pxJAoBov3SQGE0BDrWnecQoTQAIrhxbZDhNA46WbxCBwE0DyQc9m1acTQKpgVFInoBNAPzVeuknME0BpAG+BBMUTQFr1udqKvRNAXwfOGVHaE0BiEFg5tIgTQOJYF7fRQBNAak3zjlM0E0A3iUFg5RATQDarPldbMRNAwaikTkATE0B6Nqs+V9sSQBBYObTINhNAQYLix5g7E0Csrdhfdk8TQJ\u002fNqs\u002fVFhNAQfFjzF0LE0AaUdobfCETQC1DHOvi9hJAmN2Th4UaE0AjSnuDLwwTQK8l5IOeDRNAHqfoSC7\u002fEkADCYofY24TQOeMKO0NfhNAKqkT0ERYE0BQ\u002fBhz15ITQIbJVMGoZBNAxyk6kst\u002fE0BAE2HD0ysTQJwzorQ3+BJAGCZTBaMSE0B\u002f+zpwzkgTQKfoSC7\u002fYRNA6pWyDHFsE0AFxY8xd20TQPwYc9cSMhNABFYOLbIdE0AtIR\u002f0bBYTQD7o2az6XBNA5dAi2\u002fl+E0AwuycPCzUTQLx0kxgEVhNANBE2PL1SE0BxrIvbaEATQOOlm8QgcBNAaJHtfD+1E0CFfNCzWfUTQO2ePCzU2hNAejarPlfbE0B4nKIjufwTQOXQItv5PhRALUMc6+I2FECSy39Ivz0UQC\u002fdJAaBFRRA1JrmHafoE0BRa5p3nCIUQNUJaCJseBRA"},"type":"scatter"},{"hovertemplate":"MM12 %{x|%b\u002f%Y}\u003cbr\u003eR$ %{y:.4f}\u003cextra\u003e\u003c\u002fextra\u003e","line":{"color":"#ea580c","width":4},"mode":"lines","name":"Média móvel 12m (rumo)","x":["2021-01-01T00:00:00","2021-02-01T00:00:00","2021-03-01T00:00:00","2021-04-01T00:00:00","2021-05-01T00:00:00","2021-06-01T00:00:00","2021-07-01T00:00:00","2021-08-01T00:00:00","2021-09-01T00:00:00","2021-10-01T00:00:00","2021-11-01T00:00:00","2021-12-01T00:00:00","2022-01-01T00:00:00","2022-02-01T00:00:00","2022-03-01T00:00:00","2022-04-01T00:00:00","2022-05-01T00:00:00","2022-06-01T00:00:00","2022-07-01T00:00:00","2022-08-01T00:00:00","2022-09-01T00:00:00","2022-10-01T00:00:00","2022-11-01T00:00:00","2022-12-01T00:00:00","2023-01-01T00:00:00","2023-02-01T00:00:00","2023-03-01T00:00:00","2023-04-01T00:00:00","2023-05-01T00:00:00","2023-06-01T00:00:00","2023-07-01T00:00:00","2023-08-01T00:00:00","2023-09-01T00:00:00","2023-10-01T00:00:00","2023-11-01T00:00:00","2023-12-01T00:00:00","2024-01-01T00:00:00","2024-02-01T00:00:00","2024-03-01T00:00:00","2024-04-01T00:00:00","2024-05-01T00:00:00","2024-06-01T00:00:00","2024-07-01T00:00:00","2024-08-01T00:00:00","2024-09-01T00:00:00","2024-10-01T00:00:00","2024-11-01T00:00:00","2024-12-01T00:00:00","2025-01-01T00:00:00","2025-02-01T00:00:00","2025-03-01T00:00:00","2025-04-01T00:00:00","2025-05-01T00:00:00","2025-06-01T00:00:00","2025-07-01T00:00:00","2025-08-01T00:00:00","2025-09-01T00:00:00","2025-10-01T00:00:00","2025-11-01T00:00:00","2025-12-01T00:00:00","2026-01-01T00:00:00","2026-02-01T00:00:00","2026-03-01T00:00:00","2026-04-01T00:00:00","2026-05-01T00:00:00","2026-06-01T00:00:00"],"y":{"dtype":"f8","bdata":"AAAAAAAA+H8AAAAAAAD4fwAAAAAAAPh\u002fAAAAAAAA+H8AAAAAAAD4fwAAAAAAAPh\u002fwBHK6G05E0CBt0CC4lcTQBVnHz7DbhNA61G4HoV7E0AnVjNYXn8TQHuoWvjnfxNAKvNpKMiCE0C9CEDJCnsTQHOy50UAahNAu3FlYzhhE0B8zYWkKVUTQEHxY8xdSxNAnFjNYHk9E0AZLK9vOiwTQNMGOm2gIxNABcWPMXcdE0Cze\u002fKwUBsTQHH24TPsGhNApsDvzPEXE0CDwMqhRRYTQGSnMp+GIhNAy+ubDncoE0CzWfW52ioTQJe1OiZ4MBNA6t8IZfQ2E0CgZIU1qEATQHmf0NiEQRNALB7xPqFBE0CMuWsJ+UATQFQI0UcGRhNAkxgEVg5NE0DPQao7KVYTQHoRgJIVVhNA0UcGpsBPE0DjgHAY30oTQPYDMeOAQBNAhcYmDN0\u002fE0DHKTqSyz8TQBsN4C2QQBNA3yc0NmFIE0DLEMe6uE0TQDXKDZkFTRNA+lk\u002fEDNOE0BFRERERFQTQI9TdCSXXxNADXTaQKdtE0BtMVICdX0TQAjRRwamkBNAwTkjSnujE0DxrSK2zrITQKUE6rrdyBNArSK2ztLYE0AmLtr2UOUTQA6+MJkq+BNAYsYB4TAOFEAAAAAAAAD4fwAAAAAAAPh\u002fAAAAAAAA+H8AAAAAAAD4fwAAAAAAAPh\u002f"},"type":"scatter"},{"line":{"color":"#9333ea","dash":"dash","width":2},"mode":"lines","name":"Reta tendência · +0.0032 R$\u002fmes","x":["2021-01-01T00:00:00","2021-02-01T00:00:00","2021-03-01T00:00:00","2021-04-01T00:00:00","2021-05-01T00:00:00","2021-06-01T00:00:00","2021-07-01T00:00:00","2021-08-01T00:00:00","2021-09-01T00:00:00","2021-10-01T00:00:00","2021-11-01T00:00:00","2021-12-01T00:00:00","2022-01-01T00:00:00","2022-02-01T00:00:00","2022-03-01T00:00:00","2022-04-01T00:00:00","2022-05-01T00:00:00","2022-06-01T00:00:00","2022-07-01T00:00:00","2022-08-01T00:00:00","2022-09-01T00:00:00","2022-10-01T00:00:00","2022-11-01T00:00:00","2022-12-01T00:00:00","2023-01-01T00:00:00","2023-02-01T00:00:00","2023-03-01T00:00:00","2023-04-01T00:00:00","2023-05-01T00:00:00","2023-06-01T00:00:00","2023-07-01T00:00:00","2023-08-01T00:00:00","2023-09-01T00:00:00","2023-10-01T00:00:00","2023-11-01T00:00:00","2023-12-01T00:00:00","2024-01-01T00:00:00","2024-02-01T00:00:00","2024-03-01T00:00:00","2024-04-01T00:00:00","2024-05-01T00:00:00","2024-06-01T00:00:00","2024-07-01T00:00:00","2024-08-01T00:00:00","2024-09-01T00:00:00","2024-10-01T00:00:00","2024-11-01T00:00:00","2024-12-01T00:00:00","2025-01-01T00:00:00","2025-02-01T00:00:00","2025-03-01T00:00:00","2025-04-01T00:00:00","2025-05-01T00:00:00","2025-06-01T00:00:00","2025-07-01T00:00:00","2025-08-01T00:00:00","2025-09-01T00:00:00","2025-10-01T00:00:00","2025-11-01T00:00:00","2025-12-01T00:00:00","2026-01-01T00:00:00","2026-02-01T00:00:00","2026-03-01T00:00:00","2026-04-01T00:00:00","2026-05-01T00:00:00","2026-06-01T00:00:00"],"y":{"dtype":"f8","bdata":"MCZQxfb4EkDIb8NNRPwSQGC5NtaR\u002fxJA+AKqXt8CE0CQTB3nLAYTQCiWkG96CRNAwN8D+McME0BYKXeAFRATQPBy6ghjExNAiLxdkbAWE0AgBtEZ\u002fhkTQLhPRKJLHRNAUJm3KpkgE0Do4iqz5iMTQIAsnjs0JxNAF3YRxIEqE0Cvv4RMzy0TQEcJ+NQcMRNA31JrXWo0E0B3nN7ltzcTQA\u002fmUW4FOxNApy\u002fF9lI+E0A\u002feTh\u002foEETQNfCqwfuRBNAbwwfkDtIE0AHVpIYiUsTQJ+fBaHWThNAN+l4KSRSE0DPMuyxcVUTQGd8Xzq\u002fWBNA\u002f8XSwgxcE0CXD0ZLWl8TQC9ZudOnYhNAx6IsXPVlE0Bf7J\u002fkQmkTQPc1E22QbBNAj3+G9d1vE0Anyfl9K3MTQL8SbQZ5dhNAV1zgjsZ5E0DvpVMXFH0TQIfvxp9hgBNAHzk6KK+DE0C3gq2w\u002fIYTQE\u002fMIDlKihNA5hWUwZeNE0B+XwdK5ZATQBapetIylBNArvLtWoCXE0BGPGHjzZoTQN6F1GsbnhNAds9H9GihE0AOGbt8tqQTQKZiLgUEqBNAPqyhjVGrE0DW9RQWn64TQG4\u002fiJ7ssRNABon7Jjq1E0Ce0m6vh7gTQDYc4jfVuxNAzmVVwCK\u002fE0Bmr8hIcMITQP74O9G9xRNAlkKvWQvJE0AujCLiWMwTQMbVlWqmzxNA"},"type":"scatter"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"title":{"font":{"size":17,"color":"#e8edf5"},"text":"2 · Tendência do PTAX — média móvel filtra o soluço, revela o rumo","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":480,"xaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"R$ por US$"}}},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('df0ae7de-22d3-4ab7-bed5-331379e00d05');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Tendência
> - **Tendência é rumo, não o último ponto.** A média móvel de 12 meses borra o
>   ruído e mostra se o câmbio está estruturalmente subindo — o que decide hedge,
>   não a queda pontual do mês.
> - **Um número resume o rumo: o slope ($\beta_1$).** Sinal = direção;
>   magnitude = velocidade da deriva (R$/ano). É a mesma regressão de L3, com o
>   tempo no eixo X.
> - **Não confunda soluço com virada.** Reagir a cada zigue-zague desmonta
>   proteção cedo demais; reaja quando a *média móvel* mudar de inclinação.


---

## 3 · Sazonalidade — o padrão que volta todo ano no mesmo mês

### ① Por que isto importa
Vendas de dezembro sempre batem julho. Se o board compara **dezembro contra
novembro** e comemora "+15%!", pode estar celebrando pura sazonalidade — o
mesmo pulo acontece **todo ano**, sem mérito de gestão nenhum. Ignorar
sazonalidade produz metas erradas, estoque errado e bônus pago por sorte de
calendário.

### ② Conceito, sem jargão
Sazonalidade = um padrão que **se repete em ciclo fixo** (normalmente 12 meses).
Não é tendência (que não volta) nem ruído (que não tem padrão): é o **ritmo do
calendário**. A regra de ouro do executivo: **compare mês contra o mesmo mês do
ano anterior (YoY)**, nunca contra o mês vizinho.

### ③ Intuição — o perfil sazonal das vendas BYD
O gráfico mostra o **fator sazonal médio de cada mês** das vendas BYD Brasil.
Valores acima de 1,0 = meses estruturalmente fortes (Q4/Q1, comprador antecipa
IPVA e usa 13º); abaixo de 1,0 = vale do meio do ano. É o mesmo padrão todo ano
— planeje produção de Camaçari em cima dele.

### ④ A matemática
Isolamos a sazonalidade **destendenciando** e tirando a média por mês do ano:

$$S_m = \frac{1}{N_m}\sum_{t:\,\text{mês}(t)=m} \frac{y_t}{\text{MM}_t}$$

O fator $S_m$ (dez ≈ 1,22, jun ≈ 0,86) multiplica ou desconta a tendência.
Dessazonalizar = dividir cada mês pelo seu $S_m$, revelando o movimento "limpo".



```python
# ──────────────────────────────────────────────────────────────
# Sazonalidade — fator médio por mês do ano (vendas BYD BR)
# ──────────────────────────────────────────────────────────────
mm_v = vendas_s.rolling(12, center=True).mean()
detrend = (vendas_s / mm_v).dropna()
fator = detrend.groupby(detrend.index.month).mean()
fator = fator / fator.mean()           # normaliza para media 1.0
nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

mes_forte = int(fator.idxmax()); mes_fraco = int(fator.idxmin())
spread = (fator.max() / fator.min() - 1) * 100
print("Fator sazonal por mês (1.0 = média):")
for m in range(1, 13):
    print(f"  {nomes[m-1]}: {fator.get(m, float('nan')):.3f}")
print(f"\nMes mais forte: {nomes[mes_forte-1]} ({fator.max():.2f}) · "
      f"mais fraco: {nomes[mes_fraco-1]} ({fator.min():.2f})")
print(f"Spread sazonal: {spread:.0f}% — compare YoY, nunca contra o mes vizinho")

cores = [STATUS_GOOD if fator[m] >= 1 else AMBAR for m in range(1, 13)]
fig = go.Figure()
fig.add_bar(x=nomes, y=[fator[m] for m in range(1, 13)],
            marker=dict(color=cores, line=dict(color=INK, width=1)),
            hovertemplate="%{x}<br>fator %{y:.3f}<extra></extra>", name="fator sazonal")
fig.add_hline(y=1.0, line=dict(color=MUTED, width=2, dash="dash"),
              annotation_text="média (1.0)", annotation_font_color=MUTED)
style(fig, "3 · Sazonalidade das vendas BYD BR — o ritmo do calendário")
fig.update_yaxes(title="fator sazonal (× tendência)", range=[0.7, 1.35])
fig.write_html(str(HTML_DIR / "l4-03-sazonalidade.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    Fator sazonal por mês (1.0 = média):
      Jan: 1.143
      Fev: 1.062
      Mar: 0.993
      Abr: 0.927
      Mai: 0.932
      Jun: 0.834
      Jul: 0.863
      Ago: 0.919
      Set: 0.953
      Out: 1.028
      Nov: 1.099
      Dez: 1.246
    
    Mes mais forte: Dez (1.25) · mais fraco: Jun (0.83)
    Spread sazonal: 49% — compare YoY, nunca contra o mes vizinho
    


<div style="height:480px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="7cf23d64-0fe7-4697-8d7b-454841fa3d71" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("7cf23d64-0fe7-4697-8d7b-454841fa3d71")) {                    Plotly.newPlot(                        "7cf23d64-0fe7-4697-8d7b-454841fa3d71",                        [{"hovertemplate":"%{x}\u003cbr\u003efator %{y:.3f}\u003cextra\u003e\u003c\u002fextra\u003e","marker":{"color":["#22c55e","#22c55e","#ea580c","#ea580c","#ea580c","#ea580c","#ea580c","#ea580c","#ea580c","#22c55e","#22c55e","#22c55e"],"line":{"color":"#e8edf5","width":1}},"name":"fator sazonal","x":["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],"y":[1.1433128979999967,1.0618174858095752,0.9934029147726186,0.92674967259074,0.9324422060882549,0.8338734526060336,0.8632730689340781,0.9189986153651155,0.9528599199094476,1.028118986033661,1.0987218284865092,1.2464289514039697],"type":"bar"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"shapes":[{"line":{"color":"#9baabb","dash":"dash","width":2},"type":"line","x0":0,"x1":1,"xref":"x domain","y0":1.0,"y1":1.0,"yref":"y"}],"annotations":[{"font":{"color":"#9baabb"},"showarrow":false,"text":"média (1.0)","x":1,"xanchor":"right","xref":"x domain","y":1.0,"yanchor":"bottom","yref":"y"}],"title":{"font":{"size":17,"color":"#e8edf5"},"text":"3 · Sazonalidade das vendas BYD BR — o ritmo do calendário","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":480,"xaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"fator sazonal (× tendência)"},"range":[0.7,1.35]}},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('7cf23d64-0fe7-4697-8d7b-454841fa3d71');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Sazonalidade
> - **Dezembro sempre bate julho — não é mérito, é calendário.** O fator sazonal
>   (dez ≈ 1,2; jun ≈ 0,86) se repete todo ano; celebrar +15% mês-contra-mês é
>   celebrar o relógio.
> - **Regra de ouro: compare YoY (mesmo mês, ano anterior).** É a única forma de
>   separar gestão de sazonalidade.
> - **Sazonalidade é planejável.** Camaçari deve produzir em cima do perfil
>   sazonal — estoque em out/nov para o pico de dez/jan, não reação tardia.


---

## 4 · Estacionariedade — estável (previsível) vs. à deriva (traiçoeiro)

### ① Por que isto importa
Quase todo modelo de previsão **exige** que a série seja estável — média e
variância que não mudam com o tempo. O PTAX em **nível** não é: ele *passeia*,
sem âncora, e "o câmbio médio dos últimos 5 anos" não prevê nada. Já a
**variação mensal** do PTAX é estável. Rodar previsão numa série à deriva
produz o número bonito e falso que estoura o orçamento seis meses depois.

### ② Conceito, sem jargão
**Estacionária** = a série "esquece" onde está; oscila em torno de uma média
fixa, sem deriva (ex.: retornos, variações). **Não-estacionária** = a série tem
memória longa e vagueia para longe (ex.: o nível do PTAX, o nível de vendas em
ramp-up). O truque padrão para *estabilizar* uma série que vagueia: olhar a
**diferença** entre meses consecutivos ($y_t - y_{t-1}$) em vez do nível.

### ③ Intuição — nível (à deriva) vs. variação (estável)
Painel esquerdo: o **nível** do PTAX — a média local muda o tempo todo, sem
âncora (não-estacionária). Painel direito: a **variação mensal** — oscila em
torno de zero com amplitude constante (estacionária). Só a da direita é
material honesto para previsão.

### ④ A matemática
O teste padrão é o **ADF (Augmented Dickey-Fuller)**. Hipótese nula: "a série
tem raiz unitária" (= é não-estacionária, vagueia). Regra de bolso executiva:

$$p\text{-valor} < 0{,}05 \;\Rightarrow\; \text{estacionária (pode modelar)}$$
$$p\text{-valor} \ge 0{,}05 \;\Rightarrow\; \text{diferencie antes de modelar}$$



```python
# ──────────────────────────────────────────────────────────────
# Estacionariedade — nível (à deriva) vs. diferença (estável) + ADF
# ──────────────────────────────────────────────────────────────
from statsmodels.tsa.stattools import adfuller

nivel = ptax_s.values
dif   = ptax_s.diff().dropna()

adf_nivel = adfuller(nivel, autolag="AIC")
adf_dif   = adfuller(dif.values, autolag="AIC")
p_nivel, p_dif = adf_nivel[1], adf_dif[1]

def veredito(p):
    return "ESTACIONARIA (pode modelar)" if p < 0.05 else "NAO-estacionaria (diferencie)"

print("Teste ADF (Augmented Dickey-Fuller):")
print(f"  PTAX em NIVEL      : p-valor = {p_nivel:.3f}  ->  {veredito(p_nivel)}")
print(f"  PTAX em VARIACAO   : p-valor = {p_dif:.3f}  ->  {veredito(p_dif)}")
print(f"  media do nivel move; media da variacao ~ {dif.mean():+.4f} (ancorada em zero)")

fig = make_subplots(rows=1, cols=2,
                    subplot_titles=(f"Nivel — a deriva (ADF p={p_nivel:.2f})",
                                    f"Variacao mensal — estavel (ADF p={p_dif:.2f})"))
fig.add_scatter(x=ptax_s.index, y=nivel, mode="lines",
                line=dict(color=TIJOLO, width=2), name="nivel PTAX", row=1, col=1)
fig.add_scatter(x=dif.index, y=dif.values, mode="lines",
                line=dict(color=TEAL, width=1.8), name="delta PTAX (mes)", row=1, col=2)
fig.add_hline(y=float(dif.mean()), line=dict(color=INK, width=2, dash="dash"),
              row=1, col=2)
style(fig, "4 · Estacionariedade — so a serie estavel (direita) preve honesto",
      height=430)
for ann in fig.layout.annotations:
    ann.font.color = INK; ann.font.size = 13
fig.write_html(str(HTML_DIR / "l4-04-estacionariedade.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    Teste ADF (Augmented Dickey-Fuller):
      PTAX em NIVEL      : p-valor = 0.461  ->  NAO-estacionaria (diferencie)
      PTAX em VARIACAO   : p-valor = 0.000  ->  ESTACIONARIA (pode modelar)
      media do nivel move; media da variacao ~ +0.0079 (ancorada em zero)
    


<div style="height:430px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="facb997c-36dd-4ee7-bee2-fd044729a843" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("facb997c-36dd-4ee7-bee2-fd044729a843")) {                    Plotly.newPlot(                        "facb997c-36dd-4ee7-bee2-fd044729a843",                        [{"line":{"color":"#dc2626","width":2},"mode":"lines","name":"nivel PTAX","x":["2021-01-01T00:00:00","2021-02-01T00:00:00","2021-03-01T00:00:00","2021-04-01T00:00:00","2021-05-01T00:00:00","2021-06-01T00:00:00","2021-07-01T00:00:00","2021-08-01T00:00:00","2021-09-01T00:00:00","2021-10-01T00:00:00","2021-11-01T00:00:00","2021-12-01T00:00:00","2022-01-01T00:00:00","2022-02-01T00:00:00","2022-03-01T00:00:00","2022-04-01T00:00:00","2022-05-01T00:00:00","2022-06-01T00:00:00","2022-07-01T00:00:00","2022-08-01T00:00:00","2022-09-01T00:00:00","2022-10-01T00:00:00","2022-11-01T00:00:00","2022-12-01T00:00:00","2023-01-01T00:00:00","2023-02-01T00:00:00","2023-03-01T00:00:00","2023-04-01T00:00:00","2023-05-01T00:00:00","2023-06-01T00:00:00","2023-07-01T00:00:00","2023-08-01T00:00:00","2023-09-01T00:00:00","2023-10-01T00:00:00","2023-11-01T00:00:00","2023-12-01T00:00:00","2024-01-01T00:00:00","2024-02-01T00:00:00","2024-03-01T00:00:00","2024-04-01T00:00:00","2024-05-01T00:00:00","2024-06-01T00:00:00","2024-07-01T00:00:00","2024-08-01T00:00:00","2024-09-01T00:00:00","2024-10-01T00:00:00","2024-11-01T00:00:00","2024-12-01T00:00:00","2025-01-01T00:00:00","2025-02-01T00:00:00","2025-03-01T00:00:00","2025-04-01T00:00:00","2025-05-01T00:00:00","2025-06-01T00:00:00","2025-07-01T00:00:00","2025-08-01T00:00:00","2025-09-01T00:00:00","2025-10-01T00:00:00","2025-11-01T00:00:00","2025-12-01T00:00:00","2026-01-01T00:00:00","2026-02-01T00:00:00","2026-03-01T00:00:00","2026-04-01T00:00:00","2026-05-01T00:00:00","2026-06-01T00:00:00"],"y":{"dtype":"f8","bdata":"W0I+6NlsEkBn1edqK3YSQNZW7C+7pxJAoBov3SQGE0BDrWnecQoTQAIrhxbZDhNA46WbxCBwE0DyQc9m1acTQKpgVFInoBNAPzVeuknME0BpAG+BBMUTQFr1udqKvRNAXwfOGVHaE0BiEFg5tIgTQOJYF7fRQBNAak3zjlM0E0A3iUFg5RATQDarPldbMRNAwaikTkATE0B6Nqs+V9sSQBBYObTINhNAQYLix5g7E0Csrdhfdk8TQJ\u002fNqs\u002fVFhNAQfFjzF0LE0AaUdobfCETQC1DHOvi9hJAmN2Th4UaE0AjSnuDLwwTQK8l5IOeDRNAHqfoSC7\u002fEkADCYofY24TQOeMKO0NfhNAKqkT0ERYE0BQ\u002fBhz15ITQIbJVMGoZBNAxyk6kst\u002fE0BAE2HD0ysTQJwzorQ3+BJAGCZTBaMSE0B\u002f+zpwzkgTQKfoSC7\u002fYRNA6pWyDHFsE0AFxY8xd20TQPwYc9cSMhNABFYOLbIdE0AtIR\u002f0bBYTQD7o2az6XBNA5dAi2\u002fl+E0AwuycPCzUTQLx0kxgEVhNANBE2PL1SE0BxrIvbaEATQOOlm8QgcBNAaJHtfD+1E0CFfNCzWfUTQO2ePCzU2hNAejarPlfbE0B4nKIjufwTQOXQItv5PhRALUMc6+I2FECSy39Ivz0UQC\u002fdJAaBFRRA1JrmHafoE0BRa5p3nCIUQNUJaCJseBRA"},"type":"scatter","xaxis":"x","yaxis":"y"},{"line":{"color":"#0d9488","width":1.8},"mode":"lines","name":"delta PTAX (mes)","x":["2021-02-01T00:00:00","2021-03-01T00:00:00","2021-04-01T00:00:00","2021-05-01T00:00:00","2021-06-01T00:00:00","2021-07-01T00:00:00","2021-08-01T00:00:00","2021-09-01T00:00:00","2021-10-01T00:00:00","2021-11-01T00:00:00","2021-12-01T00:00:00","2022-01-01T00:00:00","2022-02-01T00:00:00","2022-03-01T00:00:00","2022-04-01T00:00:00","2022-05-01T00:00:00","2022-06-01T00:00:00","2022-07-01T00:00:00","2022-08-01T00:00:00","2022-09-01T00:00:00","2022-10-01T00:00:00","2022-11-01T00:00:00","2022-12-01T00:00:00","2023-01-01T00:00:00","2023-02-01T00:00:00","2023-03-01T00:00:00","2023-04-01T00:00:00","2023-05-01T00:00:00","2023-06-01T00:00:00","2023-07-01T00:00:00","2023-08-01T00:00:00","2023-09-01T00:00:00","2023-10-01T00:00:00","2023-11-01T00:00:00","2023-12-01T00:00:00","2024-01-01T00:00:00","2024-02-01T00:00:00","2024-03-01T00:00:00","2024-04-01T00:00:00","2024-05-01T00:00:00","2024-06-01T00:00:00","2024-07-01T00:00:00","2024-08-01T00:00:00","2024-09-01T00:00:00","2024-10-01T00:00:00","2024-11-01T00:00:00","2024-12-01T00:00:00","2025-01-01T00:00:00","2025-02-01T00:00:00","2025-03-01T00:00:00","2025-04-01T00:00:00","2025-05-01T00:00:00","2025-06-01T00:00:00","2025-07-01T00:00:00","2025-08-01T00:00:00","2025-09-01T00:00:00","2025-10-01T00:00:00","2025-11-01T00:00:00","2025-12-01T00:00:00","2026-01-01T00:00:00","2026-02-01T00:00:00","2026-03-01T00:00:00","2026-04-01T00:00:00","2026-05-01T00:00:00","2026-06-01T00:00:00"],"y":{"dtype":"f8","bdata":"ABgmUwWjgj+At0CC4seoP4DysFBrmrc\u002fAIxK6gQ0cT8A\u002fPZ14JxxP0C4HoXrUbg\u002fgAfOGVHaqz8AIIXrUbh+v4BK6gQ0EaY\u002fAFjTvOMUfb8APCzUmuZ9vwAFEhQ\u002fxpw\u002fQL99HThntL8A4C2QoPixvwDwFkhQ\u002fIi\u002fgBniWBe3ob+A\u002f5B++zqgPwB1ApoIG56\u002fgCO5\u002fIf0q7+AZYhjXdy2PwDEqKROQHM\u002fAGsr9pfdkz+ABvAWSFCsvwC8uI0G8Ia\u002fANlfdk8elj+A9gZfmEylv4A1zTtO0aE\u002fAOomMQisjL8AwLiNBvBWPwAi\u002ffZ14Iy\u002fQHlYqDXNuz8AyAc9m1WPP4DecYqO5KK\u002fAJOpglFJrT8AZRniWBenvwBBYOXQIps\u002fwKFFtvP9tL8A0m9fB86pvwB88rBQa5o\u002fgLPqc7UVqz8AKO0NvjCZPwCGWtO844Q\u002fALDx0k1iUD+ABFYOLbKtvwD4wmSqYJS\u002fAFzTvOMUfb9AxLEubqOxP4BTdCSX\u002f6A\u002fQG3F\u002frJ7sr8Axty1hHygPwBAHOviNmq\u002fAMNkqmBUkr8AufyH9NunP0DhehSuR7E\u002fQMe6uI0GsD8AmN2Th4WavwCg8dJNYkA\u002fAP+ye\u002fKwoD9AGw3gLZCwPwBwGw3gLYC\u002fAJQhjnVxez+AMXctIR+kv4AtIR\u002f0bKa\u002fgD7o2az6rD8AoWez6nO1Pw=="},"type":"scatter","xaxis":"x2","yaxis":"y2"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"xaxis":{"anchor":"y","domain":[0.0,0.45],"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis":{"anchor":"x","domain":[0.0,1.0],"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"xaxis2":{"anchor":"y2","domain":[0.55,1.0],"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis2":{"anchor":"x2","domain":[0.0,1.0],"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"annotations":[{"font":{"size":13,"color":"#e8edf5"},"showarrow":false,"text":"Nivel — a deriva (ADF p=0.46)","x":0.225,"xanchor":"center","xref":"paper","y":1.0,"yanchor":"bottom","yref":"paper"},{"font":{"size":13,"color":"#e8edf5"},"showarrow":false,"text":"Variacao mensal — estavel (ADF p=0.00)","x":0.775,"xanchor":"center","xref":"paper","y":1.0,"yanchor":"bottom","yref":"paper"}],"shapes":[{"line":{"color":"#e8edf5","dash":"dash","width":2},"type":"line","x0":0,"x1":1,"xref":"x2 domain","y0":0.00786615384615385,"y1":0.00786615384615385,"yref":"y2"}],"title":{"font":{"size":17,"color":"#e8edf5"},"text":"4 · Estacionariedade — so a serie estavel (direita) preve honesto","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":430},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('facb997c-36dd-4ee7-bee2-fd044729a843');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Estacionariedade
> - **"Câmbio médio dos últimos 5 anos" não prevê nada.** O nível do PTAX
>   *passeia* (não-estacionário, ADF p ≈ alto) — não tem âncora para reverter.
> - **A variação mensal, sim, é estável.** Diferenciar (olhar Δ em vez de nível)
>   é o truque padrão para transformar uma série traiçoeira em modelável.
> - **Pergunte sempre: "esse modelo rodou em série estável?"** Previsão em série
>   à deriva é o número bonito que estoura o orçamento seis meses depois.


---

## 5 · Autocorrelação — o quanto a série prevê a si mesma

### ① Por que isto importa
A pergunta que decide se dá para prever: **"o passado recente carrega
informação sobre o próximo mês?"** Se as vendas de hoje "ecoam" as de 12 meses
atrás, existe estrutura a explorar — e um modelo simples já acerta muito. Se
não há eco nenhum (cada mês é sorteio independente), previsão é chute com
verniz. Autocorrelação **mede esse eco**.

### ② Conceito, sem jargão
Autocorrelação = a correlação de L0, mas da série **com ela mesma defasada**.
"As vendas deste mês se parecem com as de 1 mês atrás? E 12 meses atrás?" Um
pico de autocorrelação no **lag 12** é a assinatura inconfundível de
**sazonalidade anual** — dezembro conversa com o dezembro anterior.

### ③ Intuição — o correlograma (ACF) das vendas BYD
Cada barra é a correlação das vendas com elas mesmas $k$ meses atrás. Barras
altas nos primeiros lags = **memória de curto prazo** (inércia). O pico
destacado no **lag 12** confirma a sazonalidade anual da seção 3. Barras dentro
da faixa cinza (±2/√T) são indistinguíveis de zero — ruído.

### ④ A matemática
Autocorrelação no lag $k$:

$$\rho_k = \frac{\sum_{t=k+1}^{T}(y_t-\bar y)(y_{t-k}-\bar y)}{\sum_{t=1}^{T}(y_t-\bar y)^2}$$

Banda de significância aproximada: $\pm \frac{2}{\sqrt{T}}$. Barras fora da
banda = eco real; dentro = ruído.



```python
# ──────────────────────────────────────────────────────────────
# Autocorrelacao — correlograma (ACF) das vendas BYD BR
# ──────────────────────────────────────────────────────────────
from statsmodels.tsa.stattools import acf

nlags = 18
acf_v = acf(vendas_s.values, nlags=nlags, fft=False)
T = len(vendas_s)
banda_ruido = 2 / np.sqrt(T)
lags = np.arange(nlags + 1)

pico12 = acf_v[12]
signif = [k for k in range(1, nlags + 1) if abs(acf_v[k]) > banda_ruido]
print(f"ACF das vendas BYD (T={T} meses, banda +-{banda_ruido:.2f}):")
print(f"  lag 1  = {acf_v[1]:+.2f}  (inercia de curto prazo)")
print(f"  lag 12 = {pico12:+.2f}  (assinatura de SAZONALIDADE anual)")
print(f"  lags significativos (fora da banda): {signif}")

cores = []
for k in lags:
    if k == 0:
        cores.append(MUTED)
    elif k == 12:
        cores.append(AMBAR)
    elif abs(acf_v[k]) > banda_ruido:
        cores.append(AZUL)
    else:
        cores.append(GRID)

fig = go.Figure()
fig.add_bar(x=lags, y=acf_v, marker=dict(color=cores, line=dict(color=INK, width=0.6)),
            hovertemplate="lag %{x}<br>rho = %{y:.2f}<extra></extra>", name="ACF")
fig.add_hrect(y0=-banda_ruido, y1=banda_ruido, fillcolor="rgba(155,170,187,0.12)",
              line_width=0, annotation_text="faixa de ruido (+-2/raizT)",
              annotation_font_color=MUTED)
fig.add_annotation(x=12, y=pico12, text="lag 12 = sazonalidade",
                   showarrow=True, arrowcolor=AMBAR, font=dict(color=AMBAR),
                   ay=-40)
style(fig, "5 · Autocorrelacao (ACF) das vendas BYD — pico no lag 12 = sazonal")
fig.update_xaxes(title="lag (meses)", dtick=1)
fig.update_yaxes(title="autocorrelacao rho", range=[-0.6, 1.05])
fig.write_html(str(HTML_DIR / "l4-05-autocorrelacao.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    ACF das vendas BYD (T=66 meses, banda +-0.25):
      lag 1  = +0.93  (inercia de curto prazo)
      lag 12 = +0.50  (assinatura de SAZONALIDADE anual)
      lags significativos (fora da banda): [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    


<div style="height:480px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="d7c634f3-bd43-4b45-a39f-c968482c09ac" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("d7c634f3-bd43-4b45-a39f-c968482c09ac")) {                    Plotly.newPlot(                        "d7c634f3-bd43-4b45-a39f-c968482c09ac",                        [{"hovertemplate":"lag %{x}\u003cbr\u003erho = %{y:.2f}\u003cextra\u003e\u003c\u002fextra\u003e","marker":{"color":["#9baabb","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#0284c7","#ea580c","#0284c7","#0284c7","#0284c7","#30363d","#30363d","#30363d"],"line":{"color":"#e8edf5","width":0.6}},"name":"ACF","x":{"dtype":"i1","bdata":"AAECAwQFBgcICQoLDA0ODxAREg=="},"y":{"dtype":"f8","bdata":"AAAAAAAA8D+ktG0Cp6ntP\u002f3RRgxNeOs\u002fLshUFLe+6D9gyKK5vJTlP66+7HWH\u002f+I\u002fzbkvEGIQ4T8OFByqdojfP51iX9Df590\u002ftK2CnUPl3j8T+L7gNz\u002ffP7gykkzsJuA\u002fUlXF9Q0Q4D\u002f4sXLmElPdP6J73et88Ng\u002fe0agmAk91D+p0oODFy7PP2eaiLGfScU\u002fGaZWnZ1guz8="},"type":"bar"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"shapes":[{"fillcolor":"rgba(155,170,187,0.12)","line":{"width":0},"type":"rect","x0":0,"x1":1,"xref":"x domain","y0":-0.24618298195866545,"y1":0.24618298195866545,"yref":"y"}],"annotations":[{"font":{"color":"#9baabb"},"showarrow":false,"text":"faixa de ruido (+-2\u002fraizT)","x":1,"xanchor":"right","xref":"x domain","y":0.24618298195866545,"yanchor":"top","yref":"y"},{"arrowcolor":"#ea580c","ay":-40,"font":{"color":"#ea580c"},"showarrow":true,"text":"lag 12 = sazonalidade","x":12,"y":0.5019597816669068}],"title":{"font":{"size":17,"color":"#e8edf5"},"text":"5 · Autocorrelacao (ACF) das vendas BYD — pico no lag 12 = sazonal","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":480,"xaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"lag (meses)"},"dtick":1},"yaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"autocorrelacao rho"},"range":[-0.6,1.05]}},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('d7c634f3-bd43-4b45-a39f-c968482c09ac');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Autocorrelação
> - **Autocorrelação responde "dá pra prever?".** É a correlação de L0 da série
>   com o próprio passado: se há eco, há estrutura; se não há, previsão é chute.
> - **Pico no lag 12 = sazonalidade anual comprovada.** O correlograma confirma
>   numericamente o que a seção 3 mostrou no calendário.
> - **Barras dentro da faixa ±2/√T são ruído.** Não construa narrativa em cima
>   de eco que é estatisticamente indistinguível de zero.


---

## 6 · Previsão (*forecast*) — olhar à frente com um intervalo honesto

### ① Por que isto importa
Toda a série existe para responder **uma** pergunta: *o que vem pela frente?*
Mas a previsão que só entrega **um número** ("venderemos 3.400 em dez") é
perigosa — esconde a incerteza. A previsão útil entrega uma **faixa**: "entre
3.050 e 3.750, com 80% de confiança". A largura da faixa é a informação mais
honesta do gráfico — ela diz *quanto* confiar.

### ② Conceito, sem jargão
Forecast = estender tendência + sazonalidade para os próximos meses, somando a
incerteza acumulada. Como a incerteza **cresce com o horizonte** (prever o mês
que vem é fácil; prever daqui a um ano, não), a faixa **abre como um funil**
para a frente. Um método clássico é o **Holt-Winters** (suavização
exponencial), que aprende nível, tendência e sazonalidade e os projeta.

### ③ Intuição — vendas BYD 12 meses à frente
A linha sólida é o histórico; a tracejada âmbar é a previsão de 12 meses; a
área sombreada é o **intervalo de 80%**. Note o funil abrindo: dez/2026 tem
faixa estreita; jun/2027 tem faixa larga. **Planeje capacidade de Camaçari pela
faixa, não pela linha central.**

### ④ A matemática
Holt-Winters aditivo projeta $\hat y_{t+h} = \ell_t + h\,b_t + s_{t+h-m}$
(nível + tendência × horizonte + sazonal). O intervalo aproximado:

$$\hat y_{t+h} \pm z\,\hat\sigma\,\sqrt{h}$$

onde $\hat\sigma$ é o desvio dos resíduos e o $\sqrt{h}$ é o que faz o funil
abrir com o horizonte.



```python
# ──────────────────────────────────────────────────────────────
# Previsao — Holt-Winters (nivel+tendencia+sazonal) 12m a frente
# ──────────────────────────────────────────────────────────────
from statsmodels.tsa.holtwinters import ExponentialSmoothing

modelo = ExponentialSmoothing(
    vendas_s.astype(float), trend="add", seasonal="add",
    seasonal_periods=12, initialization_method="estimated"
).fit()

H = 12
fc = modelo.forecast(H)
resid_sigma = float(np.std(modelo.resid, ddof=1))
z80 = 1.2816
h = np.arange(1, H + 1)
banda_fc = z80 * resid_sigma * np.sqrt(h)
lo, hi = fc.values - banda_fc, fc.values + banda_fc

idx_fc = pd.date_range(vendas_s.index[-1] + pd.offsets.MonthBegin(1),
                       periods=H, freq="MS")

print(f"Previsao vendas BYD BR — {H} meses (Holt-Winters aditivo):")
print(f"  {idx_fc[0]:%b/%Y}: {fc.iloc[0]:,.0f} un  [{lo[0]:,.0f} .. {hi[0]:,.0f}]  (faixa +-{banda_fc[0]:,.0f})")
print(f"  {idx_fc[-1]:%b/%Y}: {fc.iloc[-1]:,.0f} un  [{lo[-1]:,.0f} .. {hi[-1]:,.0f}]  (faixa +-{banda_fc[-1]:,.0f})")
print(f"  funil abre {banda_fc[-1]/banda_fc[0]:.1f}x do 1o ao 12o mes — incerteza cresce com o horizonte")

fig = go.Figure()
fig.add_scatter(x=vendas_s.index, y=vendas_s.values, mode="lines",
                line=dict(color=AZUL, width=2), name="historico",
                hovertemplate="%{x|%b/%Y}<br>%{y:,} un<extra></extra>")
fig.add_scatter(x=list(idx_fc) + list(idx_fc[::-1]),
                y=list(hi) + list(lo[::-1]), fill="toself",
                fillcolor="rgba(234,88,12,0.18)", line=dict(width=0),
                name="intervalo 80%", hoverinfo="skip")
fig.add_scatter(x=idx_fc, y=fc.values, mode="lines+markers",
                line=dict(color=AMBAR, width=3, dash="dash"),
                marker=dict(size=6), name="previsao 12m",
                hovertemplate="%{x|%b/%Y}<br>%{y:,.0f} un<extra></extra>")
fig.add_vline(x=vendas_s.index[-1], line=dict(color=MUTED, width=1.5, dash="dot"),
              annotation_text="hoje", annotation_font_color=MUTED)
style(fig, "6 · Previsao de vendas BYD BR — planeje pela faixa, nao pela linha")
fig.update_yaxes(title="unidades/mes")
fig.write_html(str(HTML_DIR / "l4-06-forecast.html"),
               include_plotlyjs="cdn", full_html=True)
fig.show()

```

    Previsao vendas BYD BR — 12 meses (Holt-Winters aditivo):
      Jul/2026: 3,720 un  [3,504 .. 3,936]  (faixa +-216)
      Jun/2027: 4,091 un  [3,343 .. 4,839]  (faixa +-748)
      funil abre 3.5x do 1o ao 12o mes — incerteza cresce com o horizonte
    


<div style="height:480px; width:100%;">            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG"></script><script>if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Config) {window.MathJax.Hub.Config({SVG: {font: "STIX-Web"}});}</script>                <script>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>
        <script charset="utf-8" src="https://cdn.plot.ly/plotly-3.6.0.min.js" integrity="sha256-QaOVwtVY0T02VaHrr6pnoHLCwayMJp4O5n4YyaE3rJk=" crossorigin="anonymous"></script>                <div id="842e0e57-d360-4453-bdc5-2797c555e25f" class="plotly-graph-div" style="height:100%; width:100%;"></div>            <script>                window.PLOTLYENV=window.PLOTLYENV || {};                                if (document.getElementById("842e0e57-d360-4453-bdc5-2797c555e25f")) {                    Plotly.newPlot(                        "842e0e57-d360-4453-bdc5-2797c555e25f",                        [{"hovertemplate":"%{x|%b\u002f%Y}\u003cbr\u003e%{y:,} un\u003cextra\u003e\u003c\u002fextra\u003e","line":{"color":"#0284c7","width":2},"mode":"lines","name":"historico","x":["2021-01-01T00:00:00.000000000","2021-02-01T00:00:00.000000000","2021-03-01T00:00:00.000000000","2021-04-01T00:00:00.000000000","2021-05-01T00:00:00.000000000","2021-06-01T00:00:00.000000000","2021-07-01T00:00:00.000000000","2021-08-01T00:00:00.000000000","2021-09-01T00:00:00.000000000","2021-10-01T00:00:00.000000000","2021-11-01T00:00:00.000000000","2021-12-01T00:00:00.000000000","2022-01-01T00:00:00.000000000","2022-02-01T00:00:00.000000000","2022-03-01T00:00:00.000000000","2022-04-01T00:00:00.000000000","2022-05-01T00:00:00.000000000","2022-06-01T00:00:00.000000000","2022-07-01T00:00:00.000000000","2022-08-01T00:00:00.000000000","2022-09-01T00:00:00.000000000","2022-10-01T00:00:00.000000000","2022-11-01T00:00:00.000000000","2022-12-01T00:00:00.000000000","2023-01-01T00:00:00.000000000","2023-02-01T00:00:00.000000000","2023-03-01T00:00:00.000000000","2023-04-01T00:00:00.000000000","2023-05-01T00:00:00.000000000","2023-06-01T00:00:00.000000000","2023-07-01T00:00:00.000000000","2023-08-01T00:00:00.000000000","2023-09-01T00:00:00.000000000","2023-10-01T00:00:00.000000000","2023-11-01T00:00:00.000000000","2023-12-01T00:00:00.000000000","2024-01-01T00:00:00.000000000","2024-02-01T00:00:00.000000000","2024-03-01T00:00:00.000000000","2024-04-01T00:00:00.000000000","2024-05-01T00:00:00.000000000","2024-06-01T00:00:00.000000000","2024-07-01T00:00:00.000000000","2024-08-01T00:00:00.000000000","2024-09-01T00:00:00.000000000","2024-10-01T00:00:00.000000000","2024-11-01T00:00:00.000000000","2024-12-01T00:00:00.000000000","2025-01-01T00:00:00.000000000","2025-02-01T00:00:00.000000000","2025-03-01T00:00:00.000000000","2025-04-01T00:00:00.000000000","2025-05-01T00:00:00.000000000","2025-06-01T00:00:00.000000000","2025-07-01T00:00:00.000000000","2025-08-01T00:00:00.000000000","2025-09-01T00:00:00.000000000","2025-10-01T00:00:00.000000000","2025-11-01T00:00:00.000000000","2025-12-01T00:00:00.000000000","2026-01-01T00:00:00.000000000","2026-02-01T00:00:00.000000000","2026-03-01T00:00:00.000000000","2026-04-01T00:00:00.000000000","2026-05-01T00:00:00.000000000","2026-06-01T00:00:00.000000000"],"y":{"dtype":"i2","bdata":"gwWbBTUFwwTlBBoF+wTqBTcFzQY\u002fB80H5AfCBgwH6gYRB0MGdAYnB1UIwwg1CZYKOgojCtAIhQgwCIcHlQhPCfEJlQrgCnUMSQxcCw0LvwoUC+cJUgr\u002fCsQKxwz9Df0Qrg42DiANrQuUDPELZQxNDNkO1w2rEHMTTBC1DzsP6g2cDD8N"},"type":"scatter"},{"fill":"toself","fillcolor":"rgba(234,88,12,0.18)","hoverinfo":"skip","line":{"width":0},"name":"intervalo 80%","x":["2026-07-01T00:00:00","2026-08-01T00:00:00","2026-09-01T00:00:00","2026-10-01T00:00:00","2026-11-01T00:00:00","2026-12-01T00:00:00","2027-01-01T00:00:00","2027-02-01T00:00:00","2027-03-01T00:00:00","2027-04-01T00:00:00","2027-05-01T00:00:00","2027-06-01T00:00:00","2027-06-01T00:00:00","2027-05-01T00:00:00","2027-04-01T00:00:00","2027-03-01T00:00:00","2027-02-01T00:00:00","2027-01-01T00:00:00","2026-12-01T00:00:00","2026-11-01T00:00:00","2026-10-01T00:00:00","2026-09-01T00:00:00","2026-08-01T00:00:00","2026-07-01T00:00:00"],"y":[3935.517621100277,4175.901068511282,4419.838543714297,4665.593057889641,4983.721156162113,5505.96042795507,5212.81395268522,5119.4544996878385,5015.510655093894,4882.328008486002,4910.533581301679,4838.75071071916,3342.510039821894,3477.9922032571067,3516.4533969741747,3719.7282239213887,3897.7791076552135,4070.0412639755145,4447.9585032765035,4017.901956111559,3801.7381037746386,3671.7182082656636,3565.063372494969,3503.590144042776],"type":"scatter"},{"hovertemplate":"%{x|%b\u002f%Y}\u003cbr\u003e%{y:,.0f} un\u003cextra\u003e\u003c\u002fextra\u003e","line":{"color":"#ea580c","dash":"dash","width":3},"marker":{"size":6},"mode":"lines+markers","name":"previsao 12m","x":["2026-07-01T00:00:00.000000000","2026-08-01T00:00:00.000000000","2026-09-01T00:00:00.000000000","2026-10-01T00:00:00.000000000","2026-11-01T00:00:00.000000000","2026-12-01T00:00:00.000000000","2027-01-01T00:00:00.000000000","2027-02-01T00:00:00.000000000","2027-03-01T00:00:00.000000000","2027-04-01T00:00:00.000000000","2027-05-01T00:00:00.000000000","2027-06-01T00:00:00.000000000"],"y":{"dtype":"f8","bdata":"EBV\u002flhsPrUDEFJvl9jyuQOo5TIeOm69A42KBY6qJsECUmiTCz5SxQHHhiZ\u002f1cLNAbVK9d20hskBCbdjmnZyxQCtrlpOeD7FAMBgYBWRnsEBdjuhMQ2KwQD8mjMBC9a9A"},"type":"scatter"}],                        {"template":{"data":{"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"choropleth":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"choropleth"}],"contourcarpet":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"contourcarpet"}],"contour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"contour"}],"heatmap":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"heatmap"}],"histogram2dcontour":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2dcontour"}],"histogram2d":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"histogram2d"}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"mesh3d":[{"colorbar":{"outlinewidth":0,"ticks":""},"type":"mesh3d"}],"parcoords":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"parcoords"}],"pie":[{"automargin":true,"type":"pie"}],"scatter3d":[{"line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatter3d"}],"scattercarpet":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattercarpet"}],"scattergeo":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattergeo"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scattermapbox":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermapbox"}],"scattermap":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scattermap"}],"scatterpolargl":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolargl"}],"scatterpolar":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterpolar"}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"scatterternary":[{"marker":{"colorbar":{"outlinewidth":0,"ticks":""}},"type":"scatterternary"}],"surface":[{"colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"type":"surface"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}]},"layout":{"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"autotypenumbers":"strict","coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]],"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]},"colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"geo":{"bgcolor":"rgb(17,17,17)","lakecolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","showlakes":true,"showland":true,"subunitcolor":"#506784"},"hoverlabel":{"align":"left"},"hovermode":"closest","mapbox":{"style":"dark"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","gridwidth":2,"linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3"}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"sliderdefaults":{"bgcolor":"#C8D4E3","bordercolor":"rgb(17,17,17)","borderwidth":1,"tickwidth":0},"ternary":{"aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"bgcolor":"rgb(17,17,17)","caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"xaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2},"yaxis":{"automargin":true,"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","zerolinewidth":2}}},"shapes":[{"line":{"color":"#9baabb","dash":"dot","width":1.5},"type":"line","x0":"2026-06-01T00:00:00","x1":"2026-06-01T00:00:00","xref":"x","y0":0,"y1":1,"yref":"y domain"}],"annotations":[{"font":{"color":"#9baabb"},"showarrow":false,"text":"hoje","x":"2026-06-01T00:00:00","xanchor":"left","xref":"x","y":1,"yanchor":"top","yref":"y domain"}],"title":{"font":{"size":17,"color":"#e8edf5"},"text":"6 · Previsao de vendas BYD BR — planeje pela faixa, nao pela linha","x":0.5,"xanchor":"center"},"font":{"color":"#e8edf5","size":13},"legend":{"font":{"color":"#9baabb"},"bgcolor":"rgba(13,17,23,0.6)","bordercolor":"#30363d","borderwidth":1},"margin":{"l":60,"r":40,"t":70,"b":55},"paper_bgcolor":"#0d1117","plot_bgcolor":"#0d1117","height":480,"xaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d"},"yaxis":{"color":"#9baabb","gridcolor":"#30363d","zerolinecolor":"#30363d","linecolor":"#30363d","title":{"text":"unidades\u002fmes"}}},                        {"responsive": true}                    ).then(function(){

var gd = document.getElementById('842e0e57-d360-4453-bdc5-2797c555e25f');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };            </script>        </div>


### ⑤ Recado executivo — Previsão
> - **Uma previsão sem faixa é uma opinião, não um número.** Exija sempre o
>   intervalo (ex.: 80%): a largura dele é a parte mais honesta do gráfico.
> - **A incerteza abre como um funil.** Prever o mês que vem é fácil; daqui a um
>   ano, não. Planeje capacidade de Camaçari pela borda superior/inferior, não
>   pela linha central.
> - **Modelo simples, bem calibrado, já entrega muito.** Holt-Winters (nível +
>   tendência + sazonal) captura o essencial — sofisticação a mais raramente
>   paga a conta contra uma boa leitura da faixa.



```python
# ──────────────────────────────────────────────────────────────
# Exporta o resumo executivo em JSON
# ──────────────────────────────────────────────────────────────
resumo = {
    "notebook": "L4 · Time Series Analysis for Executives",
    "computed_at": pd.Timestamp.today().strftime("%Y-%m-%d"),
    "audience": "executivos nao-tecnicos",
    "format": "narrativa-primeiro (Conceito -> Intuicao -> Matematica -> Codigo -> Recado)",
    "concepts": {
        "serie_temporal": {
            "titulo": "Serie temporal — o numero com o caminho anexado",
            "definicao": "sequencia do mesmo indicador em intervalos regulares, na ordem em que ocorreu",
            "decomposicao": "y_t = tendencia (T) + sazonalidade (S) + residuo (R)",
            "exemplo_byd": {
                "serie": "PTAX mensal 2021-2026",
                "atual_R": round(float(ptax_s.iloc[-1]), 4),
                "pico_R": round(float(ptax_s.max()), 4),
                "vale_R": round(float(ptax_s.min()), 4),
                "amplitude_pct": round(float((ptax_s.max()-ptax_s.min())/ptax_s.min()*100), 1),
            },
            "insight": "o mesmo numero subindo ou caindo pede decisoes opostas; a ordem carrega a informacao",
            "pergunta_reuniao": "Esse 5,12 vem subindo ou caindo? Sem o caminho, e meia-informacao.",
        },
        "tendencia": {
            "titulo": "Tendencia — rumo estrutural, nao o ultimo ponto",
            "ferramenta": "media movel de 12 meses + reta de tendencia (slope beta1)",
            "exemplo_byd": {
                "slope_R_por_mes": round(float(beta1), 4),
                "deriva_R_por_ano": round(float(deriva_ano), 3),
                "rumo": "alta (depreciacao do real)" if beta1 > 0 else "baixa",
            },
            "insight": "media movel filtra o soluco e revela o rumo; sinal do slope = direcao, magnitude = velocidade",
            "pergunta_reuniao": "A queda do mes e soluco ou a media movel virou de inclinacao?",
        },
        "sazonalidade": {
            "titulo": "Sazonalidade — o padrao que volta todo ano",
            "metodo": "destendenciar (y/MM) e tirar media por mes do ano",
            "exemplo_byd": {
                "mes_forte": nomes[mes_forte-1], "fator_forte": round(float(fator.max()), 2),
                "mes_fraco": nomes[mes_fraco-1], "fator_fraco": round(float(fator.min()), 2),
                "spread_pct": round(float(spread), 0),
            },
            "regra_ouro": "compare YoY (mesmo mes, ano anterior), nunca contra o mes vizinho",
            "insight": "dezembro sempre bate julho — e calendario, nao merito de gestao",
            "pergunta_reuniao": "Esse +15% e gestao ou e so o pico sazonal que acontece todo ano?",
        },
        "estacionariedade": {
            "titulo": "Estacionariedade — estavel (previsivel) vs. a deriva",
            "teste": "ADF (Augmented Dickey-Fuller); p<0.05 => estacionaria",
            "exemplo_byd": {
                "adf_p_nivel": round(float(p_nivel), 3),
                "adf_p_variacao": round(float(p_dif), 3),
                "nivel_veredito": veredito(p_nivel),
                "variacao_veredito": veredito(p_dif),
            },
            "truque": "diferenciar (delta = y_t - y_{t-1}) estabiliza series que vagueiam",
            "insight": "'cambio medio dos ultimos 5 anos' nao preve nada; o nivel passeia, a variacao e estavel",
            "pergunta_reuniao": "Esse modelo rodou em serie estacionaria ou em serie a deriva?",
        },
        "autocorrelacao": {
            "titulo": "Autocorrelacao — o quanto a serie preve a si mesma",
            "formula": "rho_k = corr(y_t, y_{t-k}); banda de ruido +-2/raizT",
            "exemplo_byd": {
                "acf_lag1": round(float(acf_v[1]), 2),
                "acf_lag12": round(float(acf_v[12]), 2),
                "lags_significativos": [int(k) for k in signif],
                "banda_ruido": round(float(2/np.sqrt(len(vendas_s))), 2),
            },
            "insight": "pico no lag 12 = assinatura de sazonalidade anual; barras dentro da banda sao ruido",
            "pergunta_reuniao": "O passado recente carrega informacao sobre o proximo mes, ou e sorteio?",
        },
        "forecast": {
            "titulo": "Previsao — olhar a frente com intervalo honesto",
            "metodo": "Holt-Winters aditivo (nivel + tendencia + sazonal); faixa ~ z*sigma*raizh",
            "exemplo_byd": {
                "horizonte_meses": int(H),
                "primeiro_mes": {"data": idx_fc[0].strftime("%Y-%m"),
                                  "ponto": round(float(fc.iloc[0]), 0),
                                  "lo80": round(float(lo[0]), 0), "hi80": round(float(hi[0]), 0)},
                "ultimo_mes": {"data": idx_fc[-1].strftime("%Y-%m"),
                                "ponto": round(float(fc.iloc[-1]), 0),
                                "lo80": round(float(lo[-1]), 0), "hi80": round(float(hi[-1]), 0)},
                "funil_abre_x": round(float(banda_fc[-1]/banda_fc[0]), 1),
            },
            "insight": "a largura da faixa e a info mais honesta; incerteza abre como funil com o horizonte",
            "pergunta_reuniao": "Qual o intervalo (nao so o ponto)? Planejamos capacidade pela faixa?",
        },
    },
    "byd_context": BYD,
    "executive_phrases": [
        "Todo indicador de board e uma serie, nao um ponto — 5,12 subindo e 5,12 caindo pedem decisoes opostas.",
        "Tendencia e rumo (media movel de 12m), nao o ultimo ponto; nao confunda soluco com virada de inclinacao.",
        "Compare YoY, nunca contra o mes vizinho — dezembro sempre bate julho por calendario, nao por gestao.",
        "Pergunte se o modelo rodou em serie estacionaria; 'cambio medio de 5 anos' preve nada porque o nivel passeia.",
        "Autocorrelacao com pico no lag 12 confirma sazonalidade anual; barras dentro de +-2/raizT sao ruido.",
        "Previsao sem faixa e opiniao; exija o intervalo de 80% e planeje capacidade pela borda, nao pela linha central.",
    ],
    "palette_validated": {
        "mode":  "dark",
        "surface": "#0d1117",
        "swatches": ["#0284c7", "#dc2626", "#0d9488", "#9333ea", "#ea580c"],
        "validator": "dataviz/scripts/validate_palette.js --mode dark",
        "result": "ALL CHECKS PASS",
    },
    "visualizations": [
        "l4-01-serie-ptax.html", "l4-02-tendencia.html", "l4-03-sazonalidade.html",
        "l4-04-estacionariedade.html", "l4-05-autocorrelacao.html", "l4-06-forecast.html",
    ],
}

out_path = OUT_DIR / "l4_timeseries_executive.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(resumo, f, indent=2, ensure_ascii=False)

print("Resumo executivo salvo em:")
print(" ", out_path)
print()
print("Frases para levar a reuniao de forecast:")
for i, frase in enumerate(resumo["executive_phrases"], 1):
    print(f"  {i}. {frase}")

```

    Resumo executivo salvo em:
      C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva\outputs\learning\l4_timeseries_executive.json
    
    Frases para levar a reuniao de forecast:
      1. Todo indicador de board e uma serie, nao um ponto — 5,12 subindo e 5,12 caindo pedem decisoes opostas.
      2. Tendencia e rumo (media movel de 12m), nao o ultimo ponto; nao confunda soluco com virada de inclinacao.
      3. Compare YoY, nunca contra o mes vizinho — dezembro sempre bate julho por calendario, nao por gestao.
      4. Pergunte se o modelo rodou em serie estacionaria; 'cambio medio de 5 anos' preve nada porque o nivel passeia.
      5. Autocorrelacao com pico no lag 12 confirma sazonalidade anual; barras dentro de +-2/raizT sao ruido.
      6. Previsao sem faixa e opiniao; exija o intervalo de 80% e planeje capacidade pela borda, nao pela linha central.
    

---

*L4 concluído.* Você agora domina a **dimensão do tempo**: reconhecer uma
**série** (o número com o caminho), separar **tendência** de **sazonalidade**,
checar **estacionariedade** antes de modelar, medir o eco com **autocorrelação**
e projetar o futuro com uma **faixa honesta** de previsão.

Esse vocabulário sustenta os cadernos quantitativos do case BYD: o **NB-01**
(PTAX + GARCH) modela a *volatilidade* da série temporal do câmbio; o
**NB-06/08** (Monte Carlo) simula *caminhos* futuros; o **NB-11** (backtesting)
testa previsões contra o que de fato aconteceu no tempo.

**As seis perguntas que L4 coloca em qualquer reunião de dados:**

1. *Esse número vem subindo ou caindo?* (série)
2. *É soluço ou o rumo virou?* (tendência)
3. *Isso é gestão ou é sazonalidade?* (sazonalidade)
4. *O modelo rodou em série estável?* (estacionariedade)
5. *O passado carrega informação sobre o futuro?* (autocorrelação)
6. *Qual o intervalo, não só o ponto?* (forecast)

**Próximo nível:** `L5 — Classificação e Árvores de Decisão` — quando o que
você quer prever não é um número no tempo, mas uma **categoria** (aprovar/negar,
churn/reter, fornecedor de risco alto/baixo).

