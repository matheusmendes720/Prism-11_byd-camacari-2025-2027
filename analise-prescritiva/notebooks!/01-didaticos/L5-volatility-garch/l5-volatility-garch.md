# L5 · Volatilidade e GARCH para Executivos

**Análise Prescritiva — Camada de Alfabetização de Dados (Learning)**

| Campo | Detalhe |
|---|---|
| **Notebook** | L5 · Volatility & GARCH for Executives |
| **Autor** | Matheus Mendes |
| **Data** | 27/julho/2026 |
| **Versão** | 1.0 |
| **Público-alvo** | Executivos não-técnicos — "quanto o risco pode variar?" |
| **Dependências** | numpy, pandas, plotly, scipy |
| **Fonte quantitativa** | NB-01 · PTAX + GARCH(1,1)-t (BCB SGS série 1) |

---

## Por que este notebook existe

Em **L0** você aprendeu que a média não conta a história inteira. Em **L4**
viu que uma série temporal carrega o caminho, e não apenas o último ponto. Em
**L5** juntamos as duas ideias: o câmbio pode ter a mesma média e, ainda assim,
produzir meses muito diferentes para o orçamento da BYD.

A pergunta executiva de L5 não é "qual é o PTAX médio?". É:

> **"Quanto essa variável pode variar, o risco está acelerando ou acalmando, e
> qual proteção cabe no caixa?"**

Este caderno é **narrativa-primeiro**:

> **Conceito → Intuição → Matemática → Código → Recado Executivo**

Os números são os resultados exportados pelo **NB-01 Prescriptive (GARCH)**:
1.641 observações diárias de PTAX entre 03/jan/2020 e 17/jul/2026,
Monte Carlo GARCH-t com 10.000 caminhos e horizonte de 6 meses. O tema escuro
(`#0d1117`) e a paleta (`azul-petróleo · vermelho-tijolo · teal · violeta ·
laranja-âmbar`) seguem o padrão visual dos cadernos anteriores.

### Os 6 conceitos deste caderno

| # | Conceito | Pergunta executiva |
|---|---|---|
| 1 | **Volatilidade** | Quanto os resultados se espalham ao redor do valor típico? |
| 2 | **Volatilidade como risco** | Por que a variação muda o tamanho do hedge e do caixa? |
| 3 | **GARCH(1,1)-t** | Como modelar uma volatilidade que muda com o tempo? |
| 4 | **Clustering** | Por que um choque costuma ser seguido por mais choques? |
| 5 | **VaR e CVaR** | Qual perda de cauda devemos suportar ou proteger? |
| 6 | **Tradução executiva** | Como levar “14% de volatilidade” para a reunião? |

---

## 1 · Volatilidade — não é só a média, é a variação

### ① Por que isto importa

Duas fábricas podem ter custo cambial médio de R$ 5,12/US$ e experiências
opostas. Na primeira, o PTAX oscila pouco: compras e margens são planejáveis.
Na segunda, o PTAX alterna saltos: a média termina igual, mas o caixa precisa
absorver dias de preço muito diferentes. A média responde **onde o número fica**;
a volatilidade responde **o quanto ele passeia**.

### ② Conceito, sem jargão

Volatilidade é o desvio-padrão dos retornos — a distância típica entre o
movimento observado e o movimento médio. Em finanças, anualizamos essa medida
para transformar oscilações diárias em uma régua comparável: “14% a.a.” não quer
dizer que o câmbio subirá 14%; quer dizer que a distribuição de movimentos tem
uma escala anual de aproximadamente 14%.

### ③ Intuição — o contraste observado no case BYD

No regime **Calma**, o NB-01 estima volatilidade anualizada de **7,1%**. No
regime **Turbulência**, ela chega a **25,5%** — cerca de **3,6 vezes** maior.
O PTAX atual é R$ 5,1176/US$, mas esse ponto não informa se estamos em uma
semana previsível ou em uma semana de cauda. A estatística certa para o comitê
é o nível **e** a banda de variação.

### ④ A matemática

Para retornos $r_t$ e média $\bar r$:

$$\sigma = \sqrt{\frac{1}{n-1}\sum_{t=1}^{n}(r_t-\bar r)^2}$$

Se $\sigma_d$ é o desvio diário, a aproximação anualizada é
$\sigma_a = \sigma_d\sqrt{252}$. A raiz de 252 converte dias úteis em um ano;
não é uma previsão de direção.

### ⑤ Código — o primeiro gráfico é uma régua de regimes

```python
# ──────────────────────────────────────────────────────────────
# Setup — carrega os resultados oficiais do NB-01, sem refazer a estimação
# ──────────────────────────────────────────────────────────────
import json
from pathlib import Path
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from scipy.stats import t as student_t

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
if not (NOTEBOOK_ROOT / "outputs" / "nb01_results.json").exists():
    NOTEBOOK_ROOT = Path.cwd()
NB01_PATH = NOTEBOOK_ROOT / "outputs" / "nb01_results.json"
OUT_DIR = NOTEBOOK_ROOT / "outputs" / "learning"
OUT_DIR.mkdir(parents=True, exist_ok=True)
with NB01_PATH.open(encoding="utf-8") as f:
    NB01 = json.load(f)

BG, INK, MUTED, GRID = "#0d1117", "#e8edf5", "#9baabb", "#30363d"
AZUL, TIJOLO, TEAL = "#0284c7", "#dc2626", "#0d9488"
VIOLETA, AMBAR = "#9333ea", "#ea580c"
STATUS_GOOD = "#22c55e"

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

ptax = NB01["ptax"]
ham = NB01["hamilton"]
mc = NB01["mc"]
vol_calm = float(ham["vol_calm_ann"])
vol_turb = float(ham["vol_turb_ann"])
ratio_regimes = vol_turb / vol_calm

print(f"NB-01 carregado: PTAX R$ {ptax['current']:.4f}/US$ ({ptax['date']})")
print(f"Volatilidade histórica: {ptax['hist_vol_ann']:.2f}% a.a.")
print(f"Calma: {vol_calm:.2f}% | Turbulência: {vol_turb:.2f}% | razão: {ratio_regimes:.1f}x")

fig = go.Figure()
fig.add_bar(
    x=["Calma", "Turbulência"], y=[vol_calm, vol_turb],
    marker=dict(color=[TEAL, TIJOLO], line=dict(color=INK, width=1)),
    text=[f"{vol_calm:.1f}%", f"{vol_turb:.1f}%"], textposition="outside",
    hovertemplate="<b>%{x}</b><br>vol anualizada = %{y:.1f}%<extra></extra>",
    name="volatilidade anualizada",
)
style(fig, "1 · A média é um ponto; a volatilidade é a banda")
fig.update_yaxes(title="volatilidade anualizada (%)", range=[0, 30])
fig.update_xaxes(title="regime Hamilton do NB-01")
fig.update_layout(showlegend=False)
fig.write_html(str(OUT_DIR / "l5-01-volatility-regimes.html"), include_plotlyjs="cdn", full_html=True)
fig.show()
```

### ⑥ Recado executivo — Volatilidade

> - **Não aceite uma média sem a sua variação.** O mesmo PTAX pode caber em uma
>   semana calma ou em uma semana que consome margem.
> - A turbulência do case é **3,6×** a calma. O hedge não pode ter um tamanho
>   único para os dois regimes.
> - Sempre peça: *“Qual é a volatilidade e em qual regime estamos?”*

---

## 2 · Por que volatilidade importa para risco

### ① Por que isto importa

A BOM da BYD tem aproximadamente **42% de exposição importada**. Um movimento
cambial não fica no slide: ele atravessa o custo de peças, o preço necessário
para preservar margem e o caixa para financiar estoque. Uma média anual de 14%
não diz se o impacto vem como uma sequência absorvível ou como uma cauda que
exige decisão de emergência.

### ② Intuição — “14%” não é um orçamento de perda

O NB-01 simula 10.000 caminhos de PTAX por 6 meses. O caminho mediano muda
**−0,31%**, mas o P95 sobe **+37,21%**. Como só 42% da BOM é exposta, esses
movimentos viram impactos de aproximadamente **−11,68 pp a +15,63 pp** na BOM.
Em uma BOM hipotética de R$ 1 bilhão, +15,63 pp equivalem a **R$ 156,3 milhões**.
A média pode parecer neutra enquanto a cauda exige liquidez.

### ③ A matemática — exposição multiplica volatilidade

Uma aproximação executiva é:

$$\text{impacto na BOM (pp)} = \Delta\text{PTAX (\%)}\times\text{share importado}$$

Portanto, +10% de PTAX × 42% de exposição = **+4,2 pontos percentuais** na
BOM. Isso é uma ponte de risco, não uma causalidade completa: preços de
fornecedores, hedge e repasse podem amortecer ou ampliar o efeito.

### ④ Recado executivo — Risco

> **Risco é variação × exposição.** Antes de perguntar “qual é o câmbio?”,
> pergunte “qual é a banda plausível, qual parte da BOM está exposta e quanto
> caixa o pior trecho consome?”.

---

## 3 · GARCH — modelando a volatilidade que muda

### ① Por que isto importa

Uma volatilidade fixa trata um dia tranquilo e um dia de estresse como se
fossem igualmente informativos. O NB-01 encontrou efeitos ARCH no PTAX e usou
**GARCH(1,1)-t**: o modelo atualiza a volatilidade depois de cada retorno e
usa uma distribuição Student-t para respeitar caudas mais gordas que a Normal.

### ② Conceito, sem jargão

GARCH não tenta adivinhar se o dólar sobe ou desce. Ele estima **quão larga
deve ser a faixa** do próximo movimento. Se o último choque foi grande, a
faixa de amanhã cresce; se muitos dias foram calmos, ela encolhe lentamente.

O sufixo **“-t”** significa que o modelo admite mais ocorrências extremas do
que uma curva Normal. O ajuste do NB-01 escolheu Student-t (ν = **6,99**),
justamente porque a curtose observada é **2,30** — há mais cauda do que a
Normal assumiria.

### ③ A matemática mínima

Na forma GARCH(1,1):

$$\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta\sigma_{t-1}^2$$

- $\omega$ é o nível de base;
- $\alpha = 0,0488$ mede a reação ao choque novo;
- $\beta = 0,9418$ mede a memória da volatilidade;
- $\alpha+\beta = 0,9906$ é a persistência.

A persistência alta explica por que a volatilidade demora a voltar ao normal.
O **half-life de 73,3 dias úteis** é o tempo para um choque perder metade da
força — aproximadamente 3,5 meses.

### ④ Intuição — a term structure para decisão

O forecast do NB-01 parte de **11,0% a.a. em 1 mês**, sobe a **12,3% em 3 meses**,
**13,4% em 6 meses** e converge para **14,3% em 12 meses**. O nível de longo
prazo é **14,67% a.a.**. A janela curta aparece mais calma que a média; isso
pode ser uma janela de hedge com menor custo, não uma licença para esquecer o
risco.

```python
# ──────────────────────────────────────────────────────────────
# GARCH: a faixa aumenta com o horizonte e reverte lentamente à média
# ──────────────────────────────────────────────────────────────
term = NB01["vol_term_structure"]
horizons = ["1m", "3m", "6m", "12m"]
vols = [float(term[h]) for h in horizons]
vol_lr = float(NB01["vol_long_run_ann"])

print("Term structure GARCH(1,1)-t — anualizada:")
for horizon, vol in zip(horizons, vols):
    print(f"  {horizon:>3}: {vol:.2f}% a.a.")
print(f"Long-run: {vol_lr:.2f}% a.a.")

fig = go.Figure()
fig.add_scatter(
    x=horizons, y=vols, mode="lines+markers+text", name="forecast GARCH",
    line=dict(color=AZUL, width=3), marker=dict(color=AZUL, size=10),
    text=[f"{v:.1f}%" for v in vols], textposition="top center",
    hovertemplate="horizonte %{x}<br>vol = %{y:.2f}% a.a.<extra></extra>",
)
fig.add_hline(y=vol_lr, line=dict(color=AMBAR, width=2, dash="dash"),
              annotation_text=f"longo prazo {vol_lr:.1f}%",
              annotation_font_color=AMBAR)
style(fig, "3 · Term structure GARCH — hoje calmo não significa amanhã seguro")
fig.update_yaxes(title="volatilidade anualizada (%)", range=[0, 18])
fig.update_xaxes(title="horizonte do forecast")
fig.update_layout(showlegend=False)
fig.write_html(str(OUT_DIR / "l5-02-garch-term-structure.html"), include_plotlyjs="cdn", full_html=True)
fig.show()
```

### ⑤ Recado executivo — GARCH

> **GARCH mede a largura da faixa, não escolhe a direção.** A frase honesta
> para o board é: *“o forecast de 1 mês está em 11%, mas o regime de longo prazo
> é 14,67%; a memória de 73 dias faz um choque persistir”*.

---

## 4 · Clustering — alta volatilidade segue alta volatilidade

### ① Por que isto importa

Em câmbio, choques não chegam como sorteios independentes. Uma notícia fiscal,
uma crise de liquidez ou uma mudança de juros pode produzir vários dias grandes
seguidos. Se o time dimensiona hedge usando apenas a média histórica, ele
subestima justamente a sequência em que mais precisa de proteção.

### ② Conceito, sem jargão

**Clustering** é a concentração temporal da variação: períodos de calmaria se
agrupam e períodos de turbulência também. O GARCH captura esse comportamento
com a persistência $\alpha+\beta$; o Hamilton do NB-01 acrescenta uma leitura
simples de regime.

Hoje o filtro indica **Calma**, com **83,5%** de probabilidade e **16,5%** de
Turbulência. Isso é uma fotografia, não uma garantia: a probabilidade de
Turbulência sobe quando chegam retornos grandes, e a memória impede que a
faixa volte a 7% no dia seguinte.

### ③ Matemática de transição

Se $p_{00}$ é a chance de permanecer em Calma, a duração esperada é
$1/(1-p_{00})$. O NB-01 estima cerca de **4,3 dias úteis** de Calma e **1,4
 dia** de Turbulência na classificação por limiar. A duração curta da
Turbulência não significa impacto pequeno: sua volatilidade anualizada é
**25,5%**, contra **7,1%** na Calma.

```python
# ──────────────────────────────────────────────────────────────
# Clustering: regime, probabilidade atual e duração esperada
# ──────────────────────────────────────────────────────────────
ham = NB01["hamilton"]
regime_labels = ["Calma", "Turbulência"]
probabilidades = [1 - float(ham["prob_turb_today"]), float(ham["prob_turb_today"])]
duracoes = [float(ham["dur_calm_d"]), float(ham["dur_turb_d"])]

print(f"Regime atual: {ham['current_regime']}")
print(f"P(Calma): {probabilidades[0]:.1%} | P(Turbulência): {probabilidades[1]:.1%}")
print(f"Duração esperada: Calma {duracoes[0]:.1f}d | Turbulência {duracoes[1]:.1f}d")

fig = make_subplots(rows=1, cols=2,
                    subplot_titles=("Probabilidade filtrada hoje", "Duração esperada (dias úteis)"),
                    horizontal_spacing=0.14)
fig.add_bar(x=regime_labels, y=probabilidades, row=1, col=1,
            marker=dict(color=[TEAL, TIJOLO], line=dict(color=INK, width=1)),
            text=[f"{p:.1%}" for p in probabilidades], textposition="outside",
            hovertemplate="%{x}<br>P = %{y:.1%}<extra></extra>")
fig.add_bar(x=regime_labels, y=duracoes, row=1, col=2,
            marker=dict(color=[AZUL, AMBAR], line=dict(color=INK, width=1)),
            text=[f"{d:.1f}d" for d in duracoes], textposition="outside",
            hovertemplate="%{x}<br>duração = %{y:.1f} dias<extra></extra>")
style(fig, "4 · Clustering — o choque passa, mas a memória fica", height=430)
fig.update_yaxes(title="probabilidade", tickformat=".0%", range=[0, 1], row=1, col=1)
fig.update_yaxes(title="dias úteis", range=[0, 5], row=1, col=2)
fig.update_layout(showlegend=False)
fig.write_html(str(OUT_DIR / "l5-03-volatility-clustering.html"), include_plotlyjs="cdn", full_html=True)
fig.show()
```

### ④ Recado executivo — Clustering

> **Calma é um regime, não um contrato.** Use a janela calma para revisar
> hedge e liquidez, mas deixe o gatilho pronto: quando a volatilidade muda,
> vários dias de pressão podem estar concentrados no mesmo ciclo.

---

## 5 · VaR e CVaR — explicando a cauda sem jargão

### ① Por que isto importa

A média responde ao caminho típico; o comitê de risco precisa saber o que fazer
com os **5% piores caminhos**. É aqui que entram VaR e CVaR. Eles não dizem que
o pior caso absoluto ocorrerá; criam uma linguagem de tamanho de proteção,
limite de caixa e gatilho de escalada.

### ② Conceito, sem jargão

- **VaR 95%**: o limiar que só 5% dos cenários de perda ultrapassam. “Com 95%
de confiança, a perda não passa deste número” — com a ressalva de que os 5%
restantes podem ser muito piores.
- **CVaR 95%** (Expected Shortfall): a **média da perda dentro desses 5% piores
cenários**. Ele responde o que o VaR deixa de fora: *“se entrarmos na cauda,
qual é a perda típica?”*

Aqui usamos a orientação de custo: alta do PTAX é adversa para a BOM importada.
Assim, o P95 do impacto BOM é o VaR de custo. O P5 de −11,68 pp é favorável
para a BOM cambial, mas ainda pode afetar receitas, repasse e fornecedores —
não deve ser confundido com “bom em qualquer dimensão”.

### ③ Resultado NB-01

O Monte Carlo GARCH-t aponta **VaR95 = +15,63 pp** de impacto na BOM. Para uma
BOM de R$ 1 bilhão, isso equivale a **R$ 156,3 milhões**. Como o NB-01 exporta
os percentis, mas não a matriz de 10.000 caminhos, o CVaR desta aula é uma
**aproximação Student-t calibrada em ν = 6,99**. Ela estima **+21,41 pp** (cerca
de R$ 214,1 milhões por R$ 1 bilhão). Para o número realizado, reexecute a
célula Monte Carlo do NB-01 e faça a média dos caminhos acima do P95.

```python
# ──────────────────────────────────────────────────────────────
# VaR e CVaR: custo na cauda de alta do PTAX
# ──────────────────────────────────────────────────────────────
imported_share = 0.42
bom_p50_pp = float(mc["p50"]) * imported_share
var95_bom_pp = float(mc["bom_p95"])
var95_r1b_m = var95_bom_pp * 10.0  # 1 pp de R$1B = R$10M

# ES de Student-t: aproxima a média do tail acima do quantil de 95%.
nu = float(NB01["garch"]["nu"])
t95 = student_t.ppf(0.95, df=nu)
pdf95 = student_t.pdf(t95, df=nu)
tail_ratio = ((nu + t95**2) / (nu - 1)) * pdf95 / (0.05 * t95)
cvar95_bom_pp = var95_bom_pp * tail_ratio
cvar95_r1b_m = cvar95_bom_pp * 10.0

print(f"VaR95 (BOM):  +{var95_bom_pp:.2f} pp  | R$ {var95_r1b_m:.1f}M por R$1B")
print(f"CVaR95 aprox.: +{cvar95_bom_pp:.2f} pp  | R$ {cvar95_r1b_m:.1f}M por R$1B")
print(f"Método do CVaR: cauda Student-t (ν={nu:.2f}); não substitui paths do NB-01")

fig = go.Figure()
fig.add_bar(
    x=["P50 · mediano", "VaR95 · limiar", "CVaR95 · média da cauda"],
    y=[bom_p50_pp, var95_bom_pp, cvar95_bom_pp],
    marker=dict(color=[TEAL, AMBAR, TIJOLO], line=dict(color=INK, width=1)),
    text=[f"{bom_p50_pp:+.2f} pp", f"+{var95_bom_pp:.2f} pp", f"+{cvar95_bom_pp:.2f} pp"],
    textposition="outside",
    hovertemplate="%{x}<br>impacto BOM = %{y:+.2f} pp<extra></extra>",
)
style(fig, "5 · VaR mede a fronteira; CVaR mede o tamanho da cauda")
fig.update_yaxes(title="impacto na BOM (pontos percentuais)", range=[-4, 25])
fig.update_xaxes(title="distribuição de impacto cambial · horizonte 6 meses")
fig.update_layout(showlegend=False)
fig.write_html(str(OUT_DIR / "l5-04-var-cvar-tail.html"), include_plotlyjs="cdn", full_html=True)
fig.show()
```

### ④ Recado executivo — VaR e CVaR

> **VaR é a porta da cauda; CVaR é o que encontramos depois de atravessá-la.**
> Para a BYD, +15,63 pp é o limiar de atenção e aproximadamente R$ 156,3M por
> R$ 1B de BOM; +21,41 pp é uma aproximação do tamanho médio do tail. O hedge,
> o caixa e o plano defensivo devem ser comparados com esses números — não só
> com o PTAX mediano.

---

## 6 · Tradução executiva — “Nosso modelo mostra 14% de volatilidade”

A frase **“nosso modelo mostra 14% de volatilidade”** é correta, mas incompleta.
A tradução que cabe em um comitê é:

1. **O que é:** 14% a.a. é a escala esperada de variação do PTAX, não uma
   previsão de alta de 14%.
2. **De onde vem:** a série BCB tem 1.641 observações; o GARCH(1,1)-t captura
   clustering e caudas Student-t.
3. **Quanto persiste:** a persistência é 0,9906; um choque perde metade da força
   em aproximadamente 73 dias úteis.
4. **Onde estamos:** Hamilton aponta Calma com 83,5% de probabilidade hoje, mas
   o regime de turbulência chega a 25,5% a.a.
5. **O que fazer:** o forecast de 1 mês está em 11,0%, uma janela para revisar
   hedge; o horizonte longo converge para 14,67%, portanto a proteção não deve
   ser desmontada sem gatilho.

### As 5 perguntas para levar à reunião

1. *Qual é a volatilidade — e qual é a média que ela está escondendo?*
2. *O PTAX está em Calma ou em Turbulência? Qual a probabilidade de mudar?*
3. *Qual o VaR95 da BOM exposta, em pontos e em reais?*
4. *Se entrarmos na cauda, qual é o CVaR e quanto caixa sobrevive?*
5. *Qual gatilho aumenta hedge antes que o clustering apareça no caixa?*

---

## Resumo executivo — exportação

O bloco abaixo consolida os resultados do NB-01 e salva
`outputs/learning/l5_volatility_executive.json`.

```python
# ──────────────────────────────────────────────────────────────
# Exporta o resumo executivo em JSON
# ──────────────────────────────────────────────────────────────
resumo = {
    "notebook": "L5 · Volatility and GARCH for Executives",
    "computed_at": pd.Timestamp.today().strftime("%Y-%m-%d"),
    "audience": "executivos nao-tecnicos",
    "format": "narrativa-primeiro (Conceito -> Intuicao -> Matematica -> Codigo -> Recado)",
    "source": {
        "notebook": "NB-01 PTAX + GARCH(1,1)-t",
        "path": "analise-prescritiva/outputs/nb01_results.json",
        "observations": int(ptax["n_obs"]),
        "period": f"{ptax['period_start']} -> {ptax['period_end']}",
        "mc_paths": int(mc["n_paths"]),
        "mc_horizon_days": int(mc["n_days"]),
    },
    "concepts": {
        "volatilidade": {
            "titulo": "Volatilidade — a variação ao redor da média",
            "historical_ann_pct": round(float(ptax["hist_vol_ann"]), 2),
            "calm_ann_pct": round(vol_calm, 2),
            "turbulent_ann_pct": round(vol_turb, 2),
            "turbulent_to_calm_ratio": round(ratio_regimes, 2),
            "insight": "a média é um ponto; a volatilidade é a banda de resultados",
            "pergunta_reuniao": "Qual é a variação e em qual regime estamos?",
        },
        "risco_cambial": {
            "titulo": "Exposição transforma variação em risco de caixa",
            "imported_share_bom": imported_share,
            "ptax_current": round(float(ptax["current"]), 4),
            "mc_ptax_p5_pct": round(float(mc["p5"]), 2),
            "mc_ptax_p50_pct": round(float(mc["p50"]), 2),
            "mc_ptax_p95_pct": round(float(mc["p95"]), 2),
            "mc_bom_p5_pp": round(float(mc["bom_p5"]), 2),
            "mc_bom_p95_pp": round(var95_bom_pp, 2),
            "insight": "42% de exposição faz um movimento cambial atravessar a BOM",
            "pergunta_reuniao": "Qual faixa de PTAX o caixa consegue absorver?",
        },
        "garch": {
            "titulo": "GARCH(1,1)-t — volatilidade que atualiza e reverte",
            "model": NB01["garch"]["model"],
            "alpha": round(float(NB01["garch"]["alpha"]), 6),
            "beta": round(float(NB01["garch"]["beta"]), 6),
            "nu_student_t": round(nu, 2),
            "persistence": round(float(NB01["garch"]["persistence"]), 6),
            "half_life_business_days": round(float(NB01["garch"]["half_life_d"]), 1),
            "term_structure_ann_pct": {k: round(float(v), 2) for k, v in term.items()},
            "long_run_ann_pct": round(vol_lr, 2),
            "insight": "o modelo mede a largura da faixa, não a direção do PTAX",
            "pergunta_reuniao": "A janela curta está calma ou o choque ainda está na memória?",
        },
        "clustering": {
            "titulo": "Alta volatilidade segue alta volatilidade",
            "current_regime": ham["current_regime"],
            "prob_calm_today": round(1 - float(ham["prob_turb_today"]), 4),
            "prob_turbulent_today": round(float(ham["prob_turb_today"]), 4),
            "expected_calm_days": round(float(ham["dur_calm_d"]), 1),
            "expected_turbulent_days": round(float(ham["dur_turb_d"]), 1),
            "insight": "calma é um regime, não uma garantia; memória mantém o choque vivo",
            "pergunta_reuniao": "Qual gatilho detecta a mudança antes do caixa?",
        },
        "var_cvar": {
            "titulo": "VaR95 e CVaR95 — fronteira e tamanho da cauda",
            "orientation": "alta do PTAX = perda para BOM importada",
            "var95_bom_pp": round(var95_bom_pp, 2),
            "var95_r1b_m": round(var95_r1b_m, 1),
            "cvar95_bom_pp": round(cvar95_bom_pp, 2),
            "cvar95_r1b_m": round(cvar95_r1b_m, 1),
            "cvar_method": "aproximação da cauda Student-t calibrada em nu; reexecutar paths NB-01 para ES observado",
            "insight": "VaR marca a porta dos 5% piores; CVaR estima a perda média depois da porta",
            "pergunta_reuniao": "Se entrarmos na cauda, qual perda média devemos financiar?",
        },
    },
    "byd_context": {
        "ptax_current": round(float(ptax["current"]), 4),
        "vol_historical_ann_pct": round(float(ptax["hist_vol_ann"]), 2),
        "vol_garch_long_run_ann_pct": round(vol_lr, 2),
        "imported_share_bom": imported_share,
        "hamilton_current_regime": ham["current_regime"],
        "mc_bom_p5_pp": round(float(mc["bom_p5"]), 2),
        "mc_bom_p95_pp": round(var95_bom_pp, 2),
    },
    "executive_phrases": [
        "A média é um ponto; a volatilidade é a banda de resultados.",
        "Nosso modelo mostra 14% de volatilidade: não é previsão de alta, é a escala anual da variação.",
        "Persistência 0,9906 mantém um choque vivo por cerca de 73 dias úteis.",
        "Calma hoje (83,5%) é uma janela de decisão, não uma garantia contra clustering.",
        "VaR95 é +15,63 pp na BOM; CVaR95 aproxima +21,41 pp na cauda Student-t.",
    ],
    "visualizations": [
        "l5-01-volatility-regimes.html",
        "l5-02-garch-term-structure.html",
        "l5-03-volatility-clustering.html",
        "l5-04-var-cvar-tail.html",
    ],
    "palette_validated": {
        "mode": "dark",
        "surface": BG,
        "swatches": [AZUL, TIJOLO, TEAL, VIOLETA, AMBAR],
        "validator": "dataviz/scripts/validate_palette.js --mode dark",
        "result": "ALL CHECKS PASS",
    },
}

out_path = OUT_DIR / "l5_volatility_executive.json"
with out_path.open("w", encoding="utf-8") as f:
    json.dump(resumo, f, indent=2, ensure_ascii=False)

print("Resumo executivo salvo em:")
print(" ", out_path)
print("Frase para a reunião: Nosso modelo mostra 14% de volatilidade —")
print("isso é a escala da variação, não uma previsão de alta.")
```

---

*L5 concluído.* Você agora sabe diferenciar **nível** de **variação**, entende
por que risco muda quando a volatilidade muda, reconhece que GARCH mede a
largura da faixa, identifica clustering e consegue pedir VaR e CVaR sem cair no
jargão. O próximo passo é usar essa régua no **NB-01 Prescriptive**: os números
de L5 não substituem o modelo completo; tornam o modelo explicável para quem
decide hedge, caixa e contingência.
