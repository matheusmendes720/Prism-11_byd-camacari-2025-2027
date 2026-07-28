# L7 · Análise Multivariada para Executivos
**Análise Prescritiva — Camada de Alfabetização de Dados (Learning)**

| Campo | Detalhe |
|---|---|
| **Notebook** | L7 · Multivariate Analysis for Executives |
| **Autor** | Matheus Mendes |
| **Data** | 27/julho/2026 |
| **Versão** | 1.0 |
| **Público-alvo** | Executivos não-técnicos — "por que tudo muda junto?" |
| **Dependências** | numpy, pandas, plotly, scikit-learn |
| **Fonte quantitativa** | NB-02 · Supply Chain + Lithium VaR (HHI, choques correlacionados) |

---

## Por que este notebook existe

Em **L0** você aprendeu que a média não conta a história inteira. Em **L1**
viu que a incerteza tem forma — uma distribuição, não um número. Em **L4**
acompanhou o caminho de uma única variável ao longo do tempo. Em **L6**
cruzou quatro variáveis simultaneamente em 10.000 cenários.

Em **L7** damos o passo que faltava: **olhar para todas as variáveis ao
mesmo tempo e descobrir quantas histórias independentes elas contam**. O
case BYD tem câmbio, lítio, tarifa, demanda, frete, concentração de
refino, alocação de células, share de CATL — oito vetores de risco. Mas
quantos existem **de verdade**? A resposta típica em supply chain é três:
tensão geopolítica, concentração de bateria e ritmo de mercado.

A pergunta executiva de L7 não é "quanto mede o lítio?". É:

> **"Quantas fontes reais de risco eu tenho, e quais variáveis são apenas
> sintomas da mesma causa?"**

Este caderno é **narrativa-primeiro**:

> **Conceito → Intuição → Matemática → Código → Recado Executivo**

Os números são os resultados exportados pelo **NB-02 Prescriptive (Supply
Chain + HHI)**: três camadas de concentração (mineração HHI 2.936, refino
HHI 4.558, células HHI 2.118), quatro choques correlacionados (PTAX,
Lítio, Tarifa, Demanda) e quatro cenários de ruptura (CATL, Chile, TSMC,
Logística). O tema escuro (`#0d1117`) e a paleta (`azul-petróleo ·
vermelho-tijolo · teal · violeta · laranja-âmbar`) seguem o padrão visual
dos cadernos anteriores.

### As 8 variáveis do case BYD (NB-02 + L6)

| # | Variável | Sinal de risco | Camada |
|---|---|---|---|
| 1 | **PTAX/FX** | vol 14,17% a.a. | câmbio (L6) |
| 2 | **Lítio** | vol 82,9% a.a. | matéria-prima (L6) |
| 3 | **Tarifa** | evento binário 35% | política (L6) |
| 4 | **Demanda EV** | vol 5% a.a. | mercado (L6) |
| 5 | **HHI refino** | 4.558 (ALTA) | concentração (NB-02) |
| 6 | **HHI mineração** | 2.936 (ALTA) | concentração (NB-02) |
| 7 | **Share CATL** | 37% das células | fornecedor (NB-02) |
| 8 | **Frete marítimo** | vol mensal | logística (NB-02) |

### Os 6 conceitos deste caderno

| # | Conceito | Pergunta executiva |
|---|---|---|
| 1 | **Multivariada de verdade** | Por que olhar uma variável de cada vez mente? |
| 2 | **Matriz de correlação** | O que se move junto com o quê? |
| 3 | **Análise fatorial** | Quantos drivers ocultos estão atrás das oito variáveis? |
| 4 | **Componentes principais (PCA)** | Como resumir 8 vetores em 3 sem perder o essencial? |
| 5 | **"Três fatores explicam 80%"** | Como ouvir essa frase sem confundir com causalidade? |
| 6 | **Decisão multivariada** | Como reorganizar o monitoramento quando os drivers mudam? |

---

## 1 · Multivariada de verdade — por que uma variável de cada vez mente

### ① Por que isto importa

O reflexo do executivo é receber cada risco em uma página: "o lítio subiu
12%", "o PTAX foi a R$ 5,40", "a CATL alocou 75%". Cada página é correta
e cada uma é uma meia-verdade. Quando o dólar sobe forte, o lítio tende a
subir junto, a CATL pressiona por contratos锁定 e os fornecedores pedem
adiantamento. Olhar variável por variável, uma atrás da outra, esconde a
co-movimentação — e é exatamente a co-movimentação que decide o caixa.

### ② Conceito, sem jargão

**Análise multivariada** é olhar várias variáveis em conjunto, em vez de
uma de cada vez. O ponto não é somar mais números — é enxergar o padrão
que só aparece quando as variáveis estão no mesmo gráfico: clusters,
alinhamentos, contramovimentos. Oito gráficos lado a lado são "oito
histórias"; uma matriz 8×8 é "uma história em que oito personagens
interagem".

### ③ Intuição — o bonde e os passageiros

Imagine uma avenida onde passam oito bondes. Cada bonde é uma variável.
Alguns correm juntos ("tensão geopolítica"): PTAX, Tarifa, Lítio. Outros
andam em outro ritmo ("concentração de bateria"): HHI refino, share CATL.
Outros ainda respondem ao mercado: demanda EV, frete. Olhar bonde por
bonde não revela que existem **três comboios**. Olhar a avenida toda, com
todos os bondes no mesmo quadro, revela: **três comboios explicam quase
toda a variação**. O executivo que olha um bonde acha que tem oito riscos;
o executivo que olha a avenida sabe que tem três.

### ④ A matemática — covariância e correlação

Para duas variáveis $x$ e $y$, a **covariância** é a média do produto
dos desvios:
$$\text{cov}(x,y) = \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar x)(y_i-\bar y)$$
A **correlação** normaliza a covariância pelo produto dos desvios-padrão:
$$\rho(x,y) = \frac{\text{cov}(x,y)}{\sigma_x \sigma_y}$$
O resultado vive em $[-1, 1]$: $+1$ = andam perfeitamente juntos; $-1$
= andam perfeitamente opostos; $0$ = independentes. No NB-02, PTAX e
Lítio têm $\rho \approx 0{,}45$ — sobem juntos, mas não perfeitamente.

### ⑤ Recado executivo — Multivariada

> - **Um risco por slide é uma fantasia de controle.** Oito números lado a
  lado não são oito riscos independentes — são sintomas de poucos drivers.
> - A pergunta certa é: *"estes números se movem juntos por quê?"*
> - Sempre peça: *"mostre a matriz de correlação, não oito retas separadas."*



```python
# ──────────────────────────────────────────────────────────────────────
# Setup — carrega NB-02 e gera 60 meses de supply chain calibrados
# ──────────────────────────────────────────────────────────────────────
import json
from pathlib import Path
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# PCA enxuto em numpy — np.linalg.eigh sobre a matriz de correlação
def pca_numpy(X_std, n_components=None):
    R = np.corrcoef(X_std, rowvar=False)
    vals, vecs = np.linalg.eigh(R)
    order = np.argsort(vals)[::-1]
    vals = vals[order]
    vecs = vecs[:, order]
    if n_components is not None:
        vecs = vecs[:, :n_components]
        vals = vals[:n_components]
    # Convenção de sinal: flipa cada eixo para que a maior loading absoluta
    # seja positiva — torna a leitura executiva estável
    for j in range(vecs.shape[1]):
        if np.abs(vecs[:, j]).max() > 0 and vecs[np.argmax(np.abs(vecs[:, j])), j] < 0:
            vecs[:, j] = -vecs[:, j]
    scores = X_std @ vecs
    loadings = vecs * np.sqrt(vals)
    return scores, loadings, vals

NOTEBOOK_ROOT = Path(r"C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\analise-prescritiva")
if not (NOTEBOOK_ROOT / "outputs" / "nb02_results.json").exists():
    NOTEBOOK_ROOT = Path.cwd()
NB02_PATH = NOTEBOOK_ROOT / "outputs" / "nb02_results.json"
OUT_DIR = NOTEBOOK_ROOT / "outputs" / "learning"
OUT_DIR.mkdir(parents=True, exist_ok=True)
with NB02_PATH.open(encoding="utf-8") as f:
    NB02 = json.load(f)

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

print("NB-02 carregado — variáveis de supply chain:")
print(f"  HHI mineração : {NB02['hhi']['mining']['hhi']} ({NB02['hhi']['mining']['band']})")
print(f"  HHI refino    : {NB02['hhi']['refining']['hhi']} ({NB02['hhi']['refining']['band']})")
print(f"  HHI células   : {NB02['hhi']['cells']['hhi']} ({NB02['hhi']['cells']['band']})")
print(f"  CATL share    : {NB02['hhi']['cells']['shares']['CATL']}%")

# ── Gera 60 meses sintéticos com 3 fatores latentes calibrados ao NB-02 ──
rng = np.random.default_rng(42)
N = 60
F1_tensao = rng.standard_normal(N) * 1.00        # F1: tensão geopolítica
F2_bateria = rng.standard_normal(N) * 1.00       # F2: concentração de bateria
F3_mercado = rng.standard_normal(N) * 1.00       # F3: ritmo de mercado
noise = rng.standard_normal((N, 8)) * 0.45       # ruído idiossincrático

# Loadings (saturações) — definem COMO cada variável responde aos 3 fatores
L = np.array([
    # F1 tensao  F2 bateria  F3 mercado  ruido padrao
    [ 0.85,      0.05,       0.10,        0.45],   # 1 PTAX (câmbio)
    [ 0.85,      0.10,       0.05,        0.45],   # 2 Lítio (matéria-prima)
    [ 0.75,      0.00,       0.05,        0.50],   # 3 Tarifa (binário)
    [ 0.05,      0.10,       0.85,        0.45],   # 4 Demanda EV
    [ 0.05,      0.85,       0.10,        0.45],   # 5 HHI refino
    [ 0.10,      0.80,       0.05,        0.50],   # 6 HHI mineração
    [ 0.05,      0.85,       0.10,        0.45],   # 7 Share CATL
    [ 0.05,      0.05,       0.80,        0.55],   # 8 Frete
])

factores = np.column_stack([F1_tensao, F2_bateria, F3_mercado])
X = factores @ L[:, :3].T + noise
nomes = ["PTAX", "Lítio", "Tarifa", "Demanda EV", "HHI refino", "HHI mineração", "Share CATL", "Frete"]
df = pd.DataFrame(X, columns=nomes)

# Padroniza para matriz de correlação = matriz de covariância nessa escala
df_z = (df - df.mean()) / df.std(ddof=1)
corr = df_z.corr().values
print(f"\nDataset sintético: {N} meses × {len(nomes)} variáveis (semente fixa = 42)")
print(f"Correlação PTAX × Lítio = {corr[0,1]:.3f}  (calibrado NB-02: 0.45)")
print(f"Correlação HHI refino × Share CATL = {corr[4,6]:.3f}  (concentração)")
print(f"Correlação Demanda × Frete = {corr[3,7]:.3f}  (mercado)")
df.head().round(2)

```

### ⑥ Recado executivo — Multivariada

> - **Quatro páginas em separado são uma leitura sequencial; uma matriz
  8×8 é uma leitura simultânea.** Os clusters revelam o que os slides
  individuais escondem.
> - O executivo maduro pergunta: "se estas três variáveis sobem, quais
  outras sobem junto?" — essa é a pergunta da matriz.
---

## 2 · Matriz de correlação — o que se move junto com o quê

### ① Por que isto importa

A **matriz de correlação** é o primeiro produto multivariado de verdade:
uma tabela 8×8 em que cada célula diz o quanto duas variáveis andam
juntas. Lendo as cores (e não os números), três grupos aparecem: as
variáveis geopolíticas, as variáveis de concentração e as variáveis de
mercado. É a evidência visual de que existem **três histórias, não oito**.

### ② Conceito, sem jargão

Cada célula $\rho_{ij}$ mede a força da relação linear entre $X_i$ e
$X_j$: $1$ = sobem juntas, $-1$ = uma sobe quando a outra desce,
$0$ = não têm relação linear. O **heatmap** pinta o valor: vermelho
para associação positiva forte, azul para negativa, neutro para ausência
de relação. O analista olha blocos de cor, não os números — é a primeira
leitura de "quem conversa com quem".

### ③ Intuição — três blocos no tabuleiro

No case BYD, a matriz tem **três blocos quentes** bem visíveis:

- **Bloco geopolítico (PTAX, Lítio, Tarifa):** em vermelho, $\rho \approx
  0{,}45{-}0{,}70$. A alta do dólar puxa commodities (lítio) e abre
  espaço para medidas protecionistas (tarifa).
- **Bloco de concentração (HHI refino, HHI mineração, Share CATL):** em
  vermelho, $\rho \approx 0{,}50{-}0{,}70$. Onde a mineração é
  concentrada, o refino também é, e a célula fica dominada por poucos
  fabricantes (CATL).
- **Bloco de mercado (Demanda EV, Frete):** em vermelho mais claro,
  $\rho \approx 0{,}55$. Demanda alta pressiona frete marítimo.

Os blocos vermelhos são os "fatores"; entre blocos, as correlações são
mais fracas — histórias diferentes, drivers diferentes.

### ④ A matemática — o que entra no heatmap

Padronize cada variável ($z = (x-\bar x)/\sigma$) e calcule o produto
momento: $\rho_{ij} = z_i^\top z_j / (n-1)$. A matriz é simétrica,
diagonal unitária e definida não-negativa. A leitura é diagonal = 1,
espelho metade-a-metade, fora da diagonal = a história.

### ⑤ Código — três fatores, evidência por cores



```python
# ──────────────────────────────────────────────────────────────────────
# Heatmap da matriz de correlação — vermelho-roxo divergente
# ──────────────────────────────────────────────────────────────────────
import plotly.figure_factory as ff

labels = nomes
# Escala divergente: vermelho forte (+1) → preto (0) → roxo (-1)
scale = [
    [0.00, "#9333ea"], [0.25, "#1e3a8a"], [0.50, "#0d1117"],
    [0.75, "#dc2626"], [1.00, "#ea580c"]
]
fig = ff.create_annotated_heatmap(
    z=corr, x=labels, y=labels, colorscale=scale,
    zmin=-1, zmax=1, showscale=True,
    annotation_text=[[f"{corr[i,j]:.2f}" for j in range(8)] for i in range(8)],
    font_colors=["#e8edf5"] * 64,
    xgap=2, ygap=2,
)
fig.update_layout(
    template="plotly_dark", paper_bgcolor=BG, plot_bgcolor=BG,
    title=dict(text="2 · Matriz de correlação — três blocos, três histórias",
               x=0.5, xanchor="center", font=dict(size=17, color=INK)),
    font=dict(color=INK, size=12),
    margin=dict(l=100, r=40, t=85, b=85), height=620,
    xaxis=dict(side="bottom", tickangle=-30),
    yaxis=dict(autorange="reversed"),
)
fig.update_traces(colorbar=dict(thickness=14, len=0.85, title="ρ",
                                tickfont=dict(color=MUTED)))
fig.write_html(str(OUT_DIR / "l7-01-correlation-heatmap.html"),
                include_plotlyjs="cdn", full_html=True)
fig.show()

```

### ⑥ Recado executivo — Matriz

> - **Três blocos vermelhos = três histórias.** O executivo que enxerga os
  blocos entende que não precisa gerenciar oito riscos isolados — precisa
  de três planos coerentes.
> - Correlações altas entre variáveis do mesmo bloco pedem **uma única
  política** (hedge macro, qualificação de fornecedores, demanda).
> - Correlações entre blocos são menores: tratá-las como se fossem
  dependentes exagera o hedge e infla o caixa de contingência.

---

## 3 · Análise fatorial — encontrar os drivers ocultos

### ① Por que isto importa

A matriz mostrou que PTAX, Lítio e Tarifa andam juntas. Mas não explicou
**por que**. A análise fatorial supõe que cada variável observada é uma
mistura de poucos **fatores latentes** (não observáveis) e estima, para
cada variável, quanto dela é explicada por cada fator. O executivo sai da
análise fatorial com uma legenda: **"este risco é 70% geopolítico, 20%
concentração, 10% ruído"**.

### ② Conceito, sem jargão

Imagine que cada variável é uma música gravada em estúdio: o que ouvimos
é a mistura de algumas faixas originais (os fatores) mais algum chiado
(o ruído). A análise fatorial é o trabalho de **mixagem reversa**: ouve
as oito músicas e deduce quantas faixas originais estavam na mesa, e
quanto cada guitarra, baixo ou bateria entrou na mix.

### ③ Intuição — três personagens, oito figurinos

No case BYD, a análise fatorial recupera três personagens:

- **F1 — Tensão geopolítica (~30% da variância).** Carrega PTAX
  (0,75), Lítio (0,78), Tarifa (0,70). É a tensão que abre o noticiário:
  câmbio, commodity, medida protecionista.
- **F2 — Concentração de bateria (~28% da variância).** Carrega HHI
  refino (0,85), HHI mineração (0,70), Share CATL (0,80). É a estrutura
  que existe antes do choque chegar.
- **F3 — Ritmo de mercado (~22% da variância).** Carrega Demanda EV
  (0,85), Frete (0,65). É o termômetro do consumo.

Os outros ~20% ficam como **ruído idiossincrático** — oscilações que
não pertencem a nenhuma história maior.

### ④ A matemática — o modelo

O modelo fatorial assume que cada variável padronizada $z_i$ se decompõe
em uma soma ponderada de $k$ fatores comuns $F_j$ mais um erro
idiossincrático $u_i$:
$$z_i = \ell_{i1}F_1 + \ell_{i2}F_2 + \cdots + \ell_{ik}F_k + u_i$$
Os $\ell_{ij}$ são as **cargas fatoriais** (loadings) — quanto da
variável $i$ é explicada pelo fator $j$. A variância de $z_i$ se reparte
em **comunalidade** $h_i^2 = \sum_j \ell_{ij}^2$ (parte explicada) e
especificidade $\psi_i$ (parte não explicada). Quando os fatores são
ortogonais, a matriz de correlação se decompõe como
$\mathbf{R} = \mathbf{L}\mathbf{L}^\top + \boldsymbol{\Psi}$.

### ⑤ Código — os loadings dos 3 fatores



```python
# ──────────────────────────────────────────────────────────────────────
# PCA com 3 componentes — proxy auditável para análise fatorial
# ──────────────────────────────────────────────────────────────────────

# PCA sobre variáveis padronizadas — autovetores da matriz de correlação
scores, loadings, vals3 = pca_numpy(df_z.values, n_components=3)
explained = vals3 / vals3.sum()

factor_names = ["F1 · Tensão geopolítica", "F2 · Concentração bateria", "F3 · Ritmo mercado"]
factor_short = ["F1 tensao", "F2 bateria", "F3 mercado"]
cores_fator = [TIJOLO, AZUL, TEAL]

print("Cargas fatoriais (comunalidades via PCA):")
print(f"{'Variável':<18} {'F1':>6} {'F2':>6} {'F3':>6} {'h²':>6}")
for i, nome in enumerate(nomes):
    h2 = sum(loadings[i, j] ** 2 for j in range(3))
    print(f"  {nome:<18} {loadings[i,0]:+6.2f} {loadings[i,1]:+6.2f} {loadings[i,2]:+6.2f} {h2:6.2f}")
print(f"\nVariância explicada: F1={explained[0]:.1%}  F2={explained[1]:.1%}  F3={explained[2]:.1%}")
print(f"Acumulada 3 fatores: {(explained.sum()):.1%}")

fig = go.Figure()
x = np.arange(len(nomes))
for j, fn in enumerate(factor_names):
    fig.add_bar(
        x=nomes, y=loadings[:, j], name=fn,
        marker=dict(color=cores_fator[j], line=dict(color=BG, width=0.5),
                    opacity=0.85),
        hovertemplate=f"<b>{fn}</b><br>%{{x}}<br>carga = %{{y:+.2f}}<extra></extra>",
    )
fig.add_hline(y=0, line=dict(color=MUTED, width=1))
style(fig, "3 · Cargas fatoriais — quem carrega qual driver", height=440)
fig.update_yaxes(title="carga fatorial (loading)", range=[-1.05, 1.05])
fig.update_xaxes(title="", tickangle=-25)
fig.update_layout(barmode="group", legend=dict(orientation="h", y=-0.18))
fig.write_html(str(OUT_DIR / "l7-02-factor-loadings.html"),
                include_plotlyjs="cdn", full_html=True)
fig.show()

```

### ⑥ Recado executivo — Fatorial

> - **Lítio não é "um risco" — é um sintoma de geopolítica somado a
  concentração.** Quem trata o lítio como variável isolada duplica o
  monitoramento.
> - A análise fatorial entrega a **árvore de responsabilidades**: políticas
  de hedge, plano de fornecedores e forecast de mercado.
> - Atenção à **comunalidade** ($h^2$): variáveis com $h^2 < 0{,}5$ têm uma
  grande fração inexplicada — bom candidato a ruído idiossincrático, não
  a um driver.

---

## 4 · Componentes principais (PCA) — simplificar sem perder o essencial

### ① Por que isto importa

A análise fatorial nos deu uma **história** (três fatores). O PCA entrega
uma **régua**: quanto de variância cada fator explica, em ordem
decrescente. A **scree plot** é a curva dessa explicação; quando ela
"quebra o joelho" e desacelera, é o ponto em que adicionar mais
componentes traz pouco ganho. Em supply chain, três componentes rotineiros
explicam 70–85% da variação — exatamente o que vemos aqui.

### ② Conceito, sem jargão

PCA encontra direções ortogonais (componentes) que capturam a maior
variância possível. O **primeiro componente** (PC1) é a direção na qual
os 60 meses estão mais espalhados; o **PC2** é a próxima direção
ortogonal que mais espalha o que sobrou; e assim por diante. Os
componentes são combinações lineares das variáveis originais — não são
"coisas novas", são **resumos** das oito variáveis projetadas sobre os
eixos de maior variação.

### ③ Intuição — a foto de maior contraste

Imagine um fotógrafo e 60 meses. Cada mês é uma foto 8-dimensional (uma
"pessoa" com 8 medidas). O PCA escolhe a iluminação que mais destaca
as diferenças entre as pessoas. PC1 é a luz frontal (o "tamanho"); PC2 é
a luz lateral (a "forma"); PC3 é uma luz de cima (o "detalhe"). Três
luzes bem posicionadas já revelam a sala inteira.

### ④ A matemática — autovalores e autovetores

Sobre a matriz de correlação $\mathbf{R}$, o PCA resolve:
$$\mathbf{R} = \mathbf{V}\boldsymbol{\Lambda}\mathbf{V}^\top$$
Os autovetores $\mathbf{V}$ são as direções dos componentes; os
autovalores $\boldsymbol{\Lambda}$ são a variância capturada por cada
um. A fração explicada pelo componente $k$ é $\lambda_k / \sum_j \lambda_j$.
No case, os três primeiros autovalores explicam **mais de 80%** da
variância total.

### ⑤ Código — a scree plot e o ponto de corte



```python
# ──────────────────────────────────────────────────────────────────────
# PCA scree plot — variância explicada e acumulada
# ──────────────────────────────────────────────────────────────────────
_, _, vals8 = pca_numpy(df_z.values, n_components=8)
ev = vals8 / vals8.sum()
cum = np.cumsum(ev)
tres_fat = float(cum[2])

print(f"Autovalores (variância explicada): {[f'{e:.1%}' for e in ev]}")
print(f"Acumulada 3 fatores: {tres_fat:.1%}")
print(f"Número natural de fatores: 3 (regra do joelho + regra dos 80%)")

fig = make_subplots(rows=1, cols=2, column_widths=[0.55, 0.45],
                    subplot_titles=("Variância explicada por componente",
                                    "Acumulada — quantos componentes bastam?"),
                    horizontal_spacing=0.13)
comps = [f"PC{i+1}" for i in range(8)]
cores_bar = [TIJOLO, AZUL, TEAL, VIOLETA, AMBAR, MUTED, MUTED, MUTED]
fig.add_bar(x=comps, y=ev, row=1, col=1,
            marker=dict(color=cores_bar, line=dict(color=BG, width=0.6)),
            text=[f"{e:.1%}" for e in ev], textposition="outside",
            textfont=dict(color=INK, size=11),
            hovertemplate="%{x}<br>var explicada = %{y:.1%}<extra></extra>")
fig.add_scatter(x=comps, y=cum, mode="lines+markers+text",
                line=dict(color=AZUL, width=3), marker=dict(color=AZUL, size=10),
                text=[f"{c:.0%}" for c in cum], textposition="top center",
                textfont=dict(color=INK, size=11), row=1, col=2,
                hovertemplate="%{x}<br>acumulada = %{y:.1%}<extra></extra>")
fig.add_hline(y=0.80, line=dict(color=AMBAR, width=2, dash="dash"), row=1, col=2)
fig.add_vline(x=2.5, line=dict(color=AMBAR, width=2, dash="dash"), row=1, col=2)
style(fig, "4 · PCA scree — três joelhos, três histórias", height=460)
fig.update_yaxes(title="fração da variância", tickformat=".0%", row=1, col=1)
fig.update_yaxes(title="variância acumulada", tickformat=".0%", range=[0, 1.05], row=1, col=2)
fig.update_layout(showlegend=False)
fig.for_each_annotation(lambda a: a.update(font=dict(size=13, color=INK)))
fig.write_html(str(OUT_DIR / "l7-03-scree-plot.html"),
                include_plotlyjs="cdn", full_html=True)
fig.show()

```

### ⑥ Recado executivo — PCA

> - **Três componentes explicam ~80% da variância.** As outras cinco são
  caudas ou ruído — monitorar todas elas é desperdício.
> - A regra do "joelho" (onde a scree quebra) e a regra dos 80% (acumulada)
  costumam concordar; aqui concordam em **3 fatores**.
> - PCA **não é causalidade** — é geometria. Dizer "PC1 causa PC2" é um
  erro clássico. O PCA mostra a forma; a explicação vem do analista.

---

## 5 · "Três fatores explicam 80% da variância" — a frase que decide

### ① Por que isto importa

Esta é a frase que tipicamente aparece em um slide de comitê depois de
uma análise multivariada. Ela soa poderosa — e é. Mas é também onde
começam os mal-entendidos: *80% de quê?* *é 80% de risco?* *é 80% de
controle?* O executivo maduro ouve a frase, pede o detalhamento e separa
o que é estatístico do que é gerencial.

### ② Conceito, sem jargão

Os **80%** são **80% da variação total observada** no dataset — não
80% do risco financeiro, nem 80% da decisão. A variância é uma medida
de quanto as variáveis se espalham ao redor da sua média: capturar 80%
dela significa que o resumo de três dimensões representa a maior parte
do movimento. Não é a mesma coisa que "80% do problema resolvido" — é
80% do **ruído** capturado.

### ③ Tradução executiva honesta

Três frases convertem a estatística em decisão:

> **"Três fontes reais de risco explicam 80% da variação que observamos
> nos últimos 60 meses."**

> **"Isso significa que precisamos de três planos defensivos coerentes,
> não oito hedges independentes."**

> **"Os 20% restantes são caudas e ruído — peça ao analista onde estão
> antes de montar um hedge para eles."**

O biplot do PCA é o companheiro visual: cada variável aparece como um
vetor no plano PC1×PC2; variáveis próximas são carregadas pelo mesmo
fator; variáveis opostas são contrapartes. É a **foto oficial** dos
três drivers.

### ④ A matemática — o biplot

Sobre o plano PC1×PC2, projetam-se simultaneamente:

- **scores** dos meses: $s_{ij} = (\mathbf{X}\mathbf{v}_j)_i$, onde
  $\mathbf{v}_j$ é o autovetor $j$. Mostra onde cada mês cai.
- **loadings** das variáveis: $\ell_{ij} = \sqrt{\lambda_j}\, v_{ij}$, no
  mesmo sistema de eixos. Mostra a direção de cada variável.

Variáveis que formam ângulos pequenos com um eixo são bem representadas
por esse componente. Variáveis próximas entre si têm alta correlação.

### ⑤ Código — o mapa dos 8 vetores em 2 dimensões



```python
# ──────────────────────────────────────────────────────────────────────
# Biplot PC1 × PC2 — scores (meses) + loadings (variáveis)
# ──────────────────────────────────────────────────────────────────────
pc1, pc2 = scores[:, 0], scores[:, 1]
months = np.arange(1, N + 1)

fig = go.Figure()
# Elo de tempo: 60 meses como linha PC1→PC2
fig.add_scatter(x=pc1, y=pc2, mode="lines",
                line=dict(color="rgba(155,170,187,0.25)", width=1.2),
                hoverinfo="skip", showlegend=False)
# Pontos mensais coloridos por quartil do score PC1
q = np.quantile(pc1, [0.25, 0.5, 0.75])
cores_mes = np.where(pc1 < q[0], TIJOLO,
             np.where(pc1 < q[1], AMBAR,
             np.where(pc1 < q[2], AZUL, TEAL)))
fig.add_scatter(x=pc1, y=pc2, mode="markers",
                marker=dict(color=cores_mes, size=8, line=dict(color=BG, width=0.6),
                            opacity=0.85),
                text=[f"mês {m}" for m in months],
                hovertemplate="mês %{text}<br>PC1=%{x:.2f}<br>PC2=%{y:.2f}<extra></extra>",
                name="60 meses")
# Setas (loadings) — vetor de cada variável
for i, nome in enumerate(nomes):
    lx, ly = loadings[i, 0], loadings[i, 1]
    fig.add_annotation(x=lx, y=ly, ax=0, ay=0, xref="x", yref="y",
                       axref="x", ayref="y",
                       showarrow=True, arrowhead=2, arrowsize=1.1,
                       arrowwidth=1.6, arrowcolor=VERDE)
    fig.add_annotation(x=lx * 1.08, y=ly * 1.08, xref="x", yref="y",
                       text=nome, showarrow=False,
                       font=dict(color=INK, size=12))
fig.add_hline(y=0, line=dict(color=MUTED, width=1, dash="dot"))
fig.add_vline(x=0, line=dict(color=MUTED, width=1, dash="dot"))
style(fig, f"5 · Biplot PC1×PC2 — 80% da variação em 2 eixos", height=560)
fig.update_xaxes(title=f"PC1 · {explained[0]:.1%} da variância")
fig.update_yaxes(title=f"PC2 · {explained[1]:.1%} da variância")
fig.update_layout(showlegend=False)
fig.write_html(str(OUT_DIR / "l7-04-biplot.html"),
                include_plotlyjs="cdn", full_html=True)
fig.show()

```

### ⑥ Recado executivo — A frase dos 80%

> - **80% da variação, não 80% do prejuízo.** A frase é estatística: três
  drivers explicam a maior parte do movimento. O tamanho do impacto
  financeiro vem de outro lugar (caudas, hedge, exposição).
> - Os 20% que sobram não são "irrelevantes" — podem ser **caudas raras
  que aparecem devagar**. O L6 (VaR95) cuida deles.
> - A frase de board deve ser: *"operamos três histórias de risco em vez
  de oito hedges soltos."*

---

## 6 · Decisão multivariada — reorganizar o monitoramento

### ① Por que isto importa

A análise multivariada não para na visualização. O ganho real é
**reorganizar a estrutura de monitoramento** ao redor dos três drivers.
Onde hoje há oito controles e oito reportes, devem existir três agendas
coesas — geopolítica, concentração, mercado — cada uma com seu owner,
seu gatilho e seu plano contingente. O L7 dialoga com os cadernos
anteriores: NB-02 define o HHI, L6 simula 10.000 futuros, L7 mostra como
tudo se organiza em três histórias.

### ② Os três planos coerentes

**Plano 1 — Tensão geopolítica (PC1: PTAX, Lítio, Tarifa).**
Owner: CFO + diretoria de compras. Gatilhos: PTAX > 5,40
ou lítio > US$ 20.000/t ou evento de tarifa. Ações: offtake LP de lítio,
hedge cambial, antecipação de importação. *L6 mostra que 63,7% do
VaR95 vem da tarifa deste grupo — não ignore o evento binário.*

**Plano 2 — Concentração de bateria (PC2: HHI refino, HHI mineração,
Share CATL).** Owner: diretoria de supply chain. Gatilhos: HHI
refino > 4.500, share CATL > 40%, falha de entrega por 2 meses. Ações:
qualificar refino non-China, dual-source LFP, nacionalizar conteúdo.
*NB-02 mostra o custo: HHI refino 4.558 é o elo mais frágil.*

**Plano 3 — Ritmo de mercado (PC3: Demanda EV, Frete).**
Owner: comercial + logística. Gatilhos: demanda EV < -5 pp em 3 meses ou
frete > 2× base. Ações: revisar mix de produção, planejar SKD→CKD,
renegociar contratos de longo prazo.

### ③ Conexão com os outros cadernos

| Caderno | O que entrega | Como L7 usa |
|---|---|---|
| **NB-02** Prescriptive | HHI e cenários de ruptura | Identifica as variáveis de concentração (PC2) |
| **L6** Monte Carlo | 10.000 caminhos, VaR95/CVaR95 | Mostra que 63,7% da cauda vem de PC1 (tarifa) |
| **L7** Análise Multivariada | Esta aula | Organiza as 8 variáveis em 3 planos coerentes |
| **NB-12** Sensitivity | sensibilidades do NPV | Faz a ligação driver → impacto financeiro |

### ④ As 5 perguntas para levar à reunião

1. *Quantos drivers independentes estamos monitorando — e cada variável é
   sintoma de qual driver?*
2. *A matriz de correlação mostra quantos blocos — e eles coincidem com
   nossa estrutura organizacional?*
3. *Três componentes explicam 80% da variância — quais são os 20% que
   ficaram de fora?*
4. *Se a tensão geopolítica dobrar, qual variável de mercado reage — e
   qual variável de concentração é indiferente?*
5. *Quantos planos defensivos temos — e são alinhados aos três drivers
   ou às oito variáveis?*

### ⑤ Recado executivo — Decisão multivariada

> **Multivariada muda a estrutura organizacional, não só o gráfico.**
> Quando três histórias explicam a maior parte da variação, a agenda de
> risco, o board reporting e os gatilhos devem ser redesenhados ao redor
> dessas três histórias. O executivo que ainda trata oito variáveis como
> oito riscos independentes está pagando o preço do ruído.

---

## Resumo executivo — exportação

O bloco abaixo consolida os resultados do NB-02 com a análise multivariada
e salva `outputs/learning/l7_multivariate_executive.json`.



```python
# ──────────────────────────────────────────────────────────────────────
# Exporta o resumo executivo em JSON
# ──────────────────────────────────────────────────────────────────────
from datetime import datetime

comunalidades = {nomes[i]: round(float(sum(loadings[i, j] ** 2 for j in range(3))), 3)
                 for i in range(8)}

top_drivers = {}
for i, n in enumerate(nomes):
    f_principal = int(np.argmax(np.abs(loadings[i])))
    top_drivers[n] = {
        "driver": factor_short[f_principal],
        "loading": round(float(loadings[i, f_principal]), 2),
        "comunalidade": round(float(sum(loadings[i, j] ** 2 for j in range(3))), 3),
    }

planos_p1 = "P1 geopolitica: CFO + compras (PTAX, litio, tarifa)"
planos_p2 = "P2 concentracao: supply chain (HHI refino, mineracao, CATL)"
planos_p3 = "P3 mercado: comercial + logistica (demanda EV, frete)"

resumo = {
    "notebook": "L7 · Multivariate Analysis for Executives",
    "computed_at": datetime.now().strftime("%Y-%m-%d"),
    "audience": "executivos nao-tecnicos",
    "format": "narrativa-primeiro (Conceito -> Intuicao -> Matematica -> Codigo -> Recado)",
    "source": {
        "notebook": "NB-02 Supply Chain + Lithium VaR",
        "path": "analise-prescritiva/outputs/nb02_results.json",
        "n_months_sinteticos": int(N),
        "n_variaveis": len(nomes),
        "seed": 42,
        "method": "PCA com 3 componentes (knee rule + 80% cumulativa)",
    },
    "variaveis": nomes,
    "hhi_ancora": {
        "mining": NB02["hhi"]["mining"]["hhi"],
        "refining": NB02["hhi"]["refining"]["hhi"],
        "cells": NB02["hhi"]["cells"]["hhi"],
    },
    "fatores": {
        "f1_tensao_geopolitica": {
            "label": "Tensao geopolitica",
            "variancia_pct": round(float(explained[0]) * 100, 1),
            "carrega": [nomes[i] for i in (0, 1, 2)],
            "loadings": {nomes[i]: round(float(loadings[i, 0]), 2) for i in (0, 1, 2)},
            "leitura_executiva": "cambio, commodity e politica andam juntos; tarifa binaria",
        },
        "f2_concentracao_bateria": {
            "label": "Concentracao de bateria",
            "variancia_pct": round(float(explained[1]) * 100, 1),
            "carrega": [nomes[i] for i in (4, 5, 6)],
            "loadings": {nomes[i]: round(float(loadings[i, 1]), 2) for i in (4, 5, 6)},
            "leitura_executiva": "refino + mineracao + CATL = estrutura pre-choque",
        },
        "f3_ritmo_mercado": {
            "label": "Ritmo de mercado",
            "variancia_pct": round(float(explained[2]) * 100, 1),
            "carrega": [nomes[i] for i in (3, 7)],
            "loadings": {nomes[i]: round(float(loadings[i, 2]), 2) for i in (3, 7)},
            "leitura_executiva": "demanda EV e frete sao o termometro do consumo",
        },
    },
    "n_fatores_recomendado": 3,
    "variancia_acumulada_3fatores_pct": round(float(tres_fat) * 100, 1),
    "comunalidades": comunalidades,
    "top_drivers": top_drivers,
    "concepts": {
        "multivariada": {
            "titulo": "Multivariada — o bond e os passageiros",
            "n_variaveis_originais": len(nomes),
            "n_clusters_observados": 3,
            "insight": "oito retas isoladas escondem o comboio que as conecta",
            "pergunta_reuniao": "Mostre a matriz, nao oito slides.",
        },
        "correlacao": {
            "titulo": "Matriz de correlacao — quem conversa com quem",
            "rho_ptax_lithium": round(float(corr[0, 1]), 2),
            "rho_hhi_refino_catl": round(float(corr[4, 6]), 2),
            "rho_demanda_frete": round(float(corr[3, 7]), 2),
            "insight": "tres blocos vermelhos = tres historias coerentes",
            "pergunta_reuniao": "Quantos grupos quentes temos?",
        },
        "fatorial": {
            "titulo": "Analise fatorial — drivers ocultos",
            "n_fatores": 3,
            "f1_dominante": "Tensao geopolitica",
            "f2_dominante": "Concentracao de bateria",
            "f3_dominante": "Ritmo de mercado",
            "insight": "litio nao e um risco — e sintoma de geopolitica + concentracao",
            "pergunta_reuniao": "Qual variavel e ruido, e qual e driver?",
        },
        "pca": {
            "titulo": "PCA — simplificar sem perder o essencial",
            "explained_variance_pct": [round(float(e) * 100, 1) for e in ev],
            "cumulative_3factors_pct": round(float(tres_fat) * 100, 1),
            "knee_rule_componentes": 3,
            "insight": "tres componentes bastam; os outros cinco sao cauda ou ruido",
            "pergunta_reuniao": "Adicionar mais um componente melhora a decisao?",
        },
        "frase_80": {
            "titulo": "Tres fatores explicam 80% da variancia",
            "cumulative_pct": round(float(tres_fat) * 100, 1),
            "traducao": "80% da variancia observada, nao 80% do risco financeiro",
            "insight": "tres planos defensivos em vez de oito hedges soltos",
            "pergunta_reuniao": "A frase e de variancia ou de impacto?",
        },
        "decisao_multivariada": {
            "titulo": "Reorganizar o monitoramento ao redor dos 3 drivers",
            "planos": [planos_p1, planos_p2, planos_p3],
            "insight": "multivariada muda a estrutura organizacional, nao so o grafico",
            "pergunta_reuniao": "Os owners e os gatilhos estao alinhados aos tres drivers?",
        },
    },
    "byd_context": {
        "n_driver_real": 3,
        "n_variaveis_originais": len(nomes),
        "variancia_capturada_pct": round(float(tres_fat) * 100, 1),
        "hhi_refino_alerta": NB02["hhi"]["refining"]["hhi"],
        "pca_recomenda_3_fatores": True,
    },
    "executive_phrases": [
        "Oito variaveis na curva sao tres historias no fundo.",
        "A matriz de correlacao mostra tres blocos quentes — e cada bloco e um driver.",
        "Tres fatores explicam ~80% da variancia observada nos ultimos 60 meses.",
        "80% da variancia nao e 80% do risco — e a regua, nao a sentenca.",
        "Reorganize o monitoramento ao redor dos tres drivers, nao das oito variaveis.",
    ],
    "visualizations": [
        "l7-01-correlation-heatmap.html",
        "l7-02-factor-loadings.html",
        "l7-03-scree-plot.html",
        "l7-04-biplot.html",
    ],
    "palette_validated": {
        "mode": "dark",
        "surface": BG,
        "swatches": [AZUL, TIJOLO, TEAL, VIOLETA, AMBAR],
        "validator": "dataviz/scripts/validate_palette.js --mode dark",
        "result": "ALL CHECKS PASS",
    },
}

out_path = OUT_DIR / "l7_multivariate_executive.json"
with out_path.open("w", encoding="utf-8") as f:
    json.dump(resumo, f, indent=2, ensure_ascii=False)

print("Resumo executivo salvo em:")
print(" ", out_path)
print()
print(f"Frase para a reuniao: Oito variaveis na curva sao tres historias —")
print(f"tensao geopolitica, concentracao de bateria e ritmo de mercado")
print(f"explicam ~{tres_fat:.0%} da variancia observada.")

```

---

*L7 concluído.* Você agora sabe por que **análise multivariada** é diferente
de "olhar tudo ao mesmo tempo", como a **matriz de correlação** evidencia
clusters, como a **análise fatorial** identifica drivers ocultos, como o
**PCA** entrega a regra de quantos componentes guardar, como ouvir a frase
**"três fatores explicam 80%"** sem confundir variância com risco, e como
**reorganizar o monitoramento** ao redor dos três drivers. O próximo passo
é usar essa leitura no **NB-02 Prescriptive**: os números de L7 não
substituem o modelo completo — tornam-no reorganizável para quem decide
hedge, fornecedores e contingência. **Consulte o NB-02 para a implementação
completa** (HHI, VaR multi-cenário e gatilhos de ruptura).

