---
slug: notas-meta-d2-l1-eda
title: "Nota-Meta D2 #03 — L1 EDA · Meta-Learning de Análise Exploratória de PTAX e Supply Chain"
ueid: ikigai:nota:d2-meta-l1-eda:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, l1, eda, ptax, supply-chain, variaveis, meta-learning, walkthrough]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre o Layer L1 da base D2 (Análise Exploratória
    Descritiva). Cobre os 10 passos da EDA de PTAX, o pipeline de supply chain
    trade balance, e a matriz de 31 variáveis V1-V31 com 5 ângulos preditivos.
    Esta nota é onde L0 (alfabeto) vira L1 (primeira leitura dos dados reais).
  _audience: engenheiro-junior, analista-pleno, pesquisador
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md
    - /d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md
    - /d2-econometric-vulnerability/_study_notes/L1.2-eda-variaveis-expandidas-matriz.md
    - /d2-econometric-vulnerability/outputs/cap1_ptax_historia.png
    - /d2-econometric-vulnerability/outputs/cap1b_volatility.png
    - /d2-econometric-vulnerability/outputs/cap1c_stress_test.png
    - /d2-econometric-vulnerability/outputs/cap2_supply_chain.png
    - /d2-econometric-vulnerability/outputs/cap2b_disruption.png
  _outputs:
    - pipeline-eda-10-passos
    - supply-chain-hhi
    - matriz-31-variaveis
    - 5-angulos-preditivos
  _success_criteria: >-
    leitor consegue reproduzir os 10 passos da EDA PTAX, interpretar HHI
    por categoria, e ler a matriz V1-V31.
---

# Nota-Meta D2 #03 — L1 EDA

> **Quem está falando:** um par sênior-orientador mostrando o primeiro encontro do analista com os dados reais do projeto.
> **O que esta nota faz:** destrincha o Layer 1 (L1) inteiro em meta-aprendizado, com foco em fixar o pipeline EDA de PTAX, o mapa de supply chain, e a matriz de 31 variáveis.
> **Pré-requisito:** ter lido [Nota-Meta D2 #02 — L0 Fundamentos](./NOTA-META-D2-02-L0-FUNDAMENTOS.md).
> **Tempo de leitura:** 90-120 min (com exercícios).
> **Fonte canônica:** [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §L1 + 3 docs L1.0-L1.2.

---

## §0. Por que EDA vem antes de qualquer modelo

O L1 (Exploratory Data Analysis) é o **primeiro encontro com os dados reais**. É onde L0 (alfabeto) vira L1 (leitura do projeto BYD).

### §0.1 O que L1 entrega

| Doc | Conteúdo | O que você ganha |
|---|---|---|
| [`L1.0-eda-pTAX-passo-a-passo.md`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md) | 10 passos EDA de PTAX (886 linhas) | Reproduzir EDA canônica |
| [`L1.1-eda-supply-chain-trade-balance.md`](../../d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md) | Saldo comercial + HHI + Sankey disruption (639 linhas) | Entender dependência de fornecedores |
| [`L1.2-eda-variaveis-expandidas-matriz.md`](../../d2-econometric-vulnerability/_study_notes/L1.2-eda-variaveis-expandidas-matriz.md) | 31 variáveis V1-V31 + 5 ângulos preditivos (481 linhas) | Saber quais variáveis entram em qual modelo |

### §0.2 O princípio "olhar antes de modelar"

Regra de ouro do L1: **nunca pule EDA e vá direto para GARCH**. Pular EDA é receita para modelo com viés silencioso — ninguém percebe até confrontar com a realidade.

```text
PIPELINE EDA — PTAX BYD CAMACARI
═══════════════════════════════════════════════════════
 [1] Importar BCB ──► [2] Limpar ──► [3] Log-retorno
 [4] Histograma   ──► [5] ACF/PACF ──► [6] Rolling vol 30/60d
 [7] Skew/Kurt    ──► [8] Outliers  ──► [9] ADF/KPSS
 [10] Decomposição sazonal (STL: trend + seasonal + resid)
═══════════════════════════════════════════════════════════► input para L2.x (GARCH, MC, Hamilton)
```

---

## §1. Os 10 passos da EDA de PTAX

### §1.1 Passo 1 — Importar PTAX do Banco Central

**Fonte primária:** BCB SGS série **10813** ("Dólar americano (venda)"), daily, fechamento.

| Atributo | Valor |
|---|---|
| Código BCB SGS | 10813 |
| Janela | 2020-01-02 → 2026-07-17 |
| N observações | **1.642** |
| URL API | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json` |
| Última PTAX | R$ 5,1176 (17/jul/2026) |

**Por que PTAX venda (e não PTAX compra):** PTAX venda é a referência para **contratos de exportação e importação**. Como a BYD importa ~42% do BOM, PTAX venda é a cotação que afeta o custo.

**Código de importação (8 linhas Python, exato do notebook D2):**

```python
import requests
def fetch_bcb_ptax(start="01/01/2020", end="08/07/2026"):
    """Fetch PTAX (BRL/USD) daily from BCB SGS. Expects DD/MM/YYYY."""
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial={start}&dataFinal={end}"
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.json()
```

> **Chef's tip:** sempre valide o retorno da API. BCB às vezes retorna `[]` em janelas muito antigas. Use `raise_for_status()` e `if not data: raise ValueError(...)`.

### §1.2 Passo 2 — Limpar e validar a série

O que limpar:

1. **NAs**: PTAX não tem NAs práticos (BCB publica todo dia útil), mas o dataframe importado pode ter gaps por mudança de calendário. Use `.dropna()`.
2. **Outliers técnicos**: valores absurdos (>R$ 10 ou <R$ 2) são erros de API. Remova ou interpole.
3. **Duplicatas**: PTAX é indexada por data — cheque `.duplicated().sum() == 0`.

```python
ptax = pd.DataFrame(fetch_bcb_ptax())
ptax['data'] = pd.to_datetime(ptax['data'], format='%d/%m/%Y')
ptax['valor'] = ptax['valor'].astype(float)
ptax = ptax.drop_duplicates(subset='data').set_index('data').sort_index()
ptax = ptax[(ptax['valor'] > 2) & (ptax['valor'] < 10)]  # sanity filter
```

### §1.3 Passo 3 — Calcular log-retorno

**Por que log-retorno (não nível ou retorno aritmético):** GARCH, VaR, e MC usam log-retorno porque é **aditivo** no tempo e tem propriedades estatísticas superiores.

```python
import numpy as np
log_ret = np.log(ptax['valor'] / ptax['valor'].shift(1)).dropna()
```

**Caracterização D2 (1.642 obs, 2020-2026):**
- Média diária: +0,015% (tendência secular de leve apreciação).
- σ diária: 0,89%.
- σ anualizada: 14,19%.

### §1.4 Passo 4 — Histograma de log-retornos

O histograma é a "fotografia" da distribuição empírica.

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(10, 6))
ax.hist(log_ret, bins=100, density=True, alpha=0.6, label='PTAX log-retorno')
# Sobreponha Normal teórica para comparar
from scipy.stats import norm
x = np.linspace(log_ret.min(), log_ret.max(), 100)
ax.plot(x, norm.pdf(x, log_ret.mean(), log_ret.std()), 'r--', label='Normal teórica')
ax.legend()
plt.show()
```

**O que você observa no D2:**
- Caudas pesadas (visíveis): muito mais observações nas caudas que a Normal prevê.
- Pico levemente mais alto e estreito (leptocurtose).

**Implicação:** VaR Normal **subestima** o risco real em 30-50%. Use t-Student ou EVT.

### §1.5 Passo 5 — ACF e PACF

**ACF (autocorrelation function)** mede correlação entre observações separadas por k lags.

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
plot_acf(log_ret, lags=40, ax=axes[0])
plot_pacf(log_ret, lags=40, ax=axes[1])
plt.show()
```

**O que você observa no D2:**
- ACF dos retornos cai rapidamente (1 lag ≈ 0,05, 5 lags ≈ 0,02) — quase sem memória na média condicional.
- PACF cai a zero após lag 1 — modelo AR(1) basta para a média.
- **ACF dos retornos²** (não mostrado aqui) tem caudas longas — **isso é o que justifica GARCH**.

### §1.6 Passo 6 — Volatilidade rolante (rolling vol)

A volatilidade **não é constante**. Calcule vol em janelas rolantes de 30, 60, 90 dias.

```python
rolling_vol_30 = log_ret.rolling(30).std() * np.sqrt(252)
rolling_vol_90 = log_ret.rolling(90).std() * np.sqrt(252)
```

**O que você observa no D2:**
- Vol 30d varia entre 9% e 22% ao longo do período.
- Picos de vol coincidem com eventos políticos (election 2022, fiscal stress 2024).
- **Vol clustering**: períodos de alta vol agrupados (justifica GARCH).

**Output canônico:** `vol30_annualized: 14,19%` (momento atual, jul/2026).

### §1.7 Passo 7 — Skewness e Kurtosis

```python
from scipy.stats import skew, kurtosis
print(f"Skewness: {skew(log_ret):.3f}")     # +0.152
print(f"Kurtosis: {kurtosis(log_ret):.3f}")  # +4.88 (excess kurtosis)
```

**Interpretação D2:**
- **Skewness +0,152:** leve assimetria positiva (apreciação do BRL é um pouco mais frequente/forte).
- **Kurtosis +4,88:** caudas muito pesadas (Normal=0, log-normal=3). Eventos extremos são 30-50% mais frequentes que a Normal prevê.

> **Pegadinha:** VaR paramétrico Normal assume kurt=3. Para PTAX (kurt=4,88), o VaR real é ~30-50% maior.

### §1.8 Passo 8 — Detecção de outliers

Use **regra 1,5×IQR** (Tukey fence) ou **z-score > 3**.

```python
Q1, Q3 = log_ret.quantile([0.25, 0.75])
IQR = Q3 - Q1
outliers = log_ret[(log_ret < Q1 - 1.5*IQR) | (log_ret > Q3 + 1.5*IQR)]

# Z-score
z = (log_ret - log_ret.mean()) / log_ret.std()
outliers_z = log_ret[abs(z) > 3]
```

**Outliers formais no D2:** poucos, mas eventos como election 2022 e lítio spike produzem |z| > 3.

**Decisão sobre outliers:** **não remova** a priori. Em séries financeiras, outliers são sinal de cauda pesada — não erros. Use EVT (L6.0) para modelar a cauda.

### §1.9 Passo 9 — Testes de estacionariedade (ADF e KPSS)

**ADF (Augmented Dickey-Fuller)** testa H0: "série tem raiz unitária" (não-estacionária).
**KPSS** testa H0: "série é estacionária".

São **complementares**:
- ADF rejeita H0 → estacionária.
- KPSS rejeita H0 → não-estacionária.

```python
from statsmodels.tsa.stattools import adfuller, kpss
adf_stat, adf_p, *_ = adfuller(log_ret)
kpss_stat, kpss_p, *_ = kpss(log_ret, regression='c')
print(f"ADF stat={adf_stat:.3f}, p-value={adf_p:.4f}")
print(f"KPSS stat={kpss_stat:.3f}, p-value={kpss_p:.4f}")
```

**Resultado esperado para log-retornos:** ADF rejeita (estacionária), KPSS não rejeita (estacionária). **Log-retornos são estacionários** — eles têm média e variância constantes no tempo.

> **Pegadinha:** a série em **nível** (PTAX direta) **não é estacionária** — ela tem tendência. Por isso modelamos **retornos**, não níveis.

### §1.10 Passo 10 — Decomposição sazonal (STL)

STL = Seasonal + Trend decomposition using LOESS.

```python
from statsmodels.tsa.seasonal import STL
# Em log-retornos, sazonalidade é fraca
stl = STL(log_ret, period=21, robust=True)  # 21 dias úteis ~ 1 mês
result = stl.fit()
result.plot()
plt.show()
```

**O que você observa no D2:**
- **Tendência:** leve drift negativo (apreciação do BRL no longo prazo, consistente com carry trade positivo).
- **Sazonalidade:** fraca em log-retornos; mais visível em **vol** (ver [`L1.0`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md) §10).
- **Resíduo:** ~70% da variância; tem ARCH effects (vol clustering).

---

## §2. Supply chain — HHI, top players, e Sankey disruption

A segunda metade do L1 é sobre o **lado real da economia**: de quem a BYD depende, e o que acontece se a dependência quebrar.

### §2.1 HHI por categoria (métrica canônica do L1.1)

| Categoria | HHI raw | Classificação | Top supplier | % share | Risco |
|---|---|---|---|---|---|
| **Bateria (LFP)** | **4.850** | Altamente concentrada | CATL | 95,7% | 🔴 Crítico |
| **Lítio** | **3.400** | Altamente concentrada | Albemarle + SQM | 50% + 30% = 80% | 🔴 Crítico |
| **Semicond.** | **2.925** | Moderadamente concentrada | TSMC + Samsung | 45% + 30% = 75% | 🟡 Alto |
| Cell (cilíndrica) | 2.100 | Moderada | LG Energy | ~35% | 🟢 Médio |
| Plástico técnico | 1.800 | Baixa-moderada | diversificado | ~30% | 🟢 Baixo |
| Vidro blindado | 1.500 | Baixa | diversificado | ~25% | 🟢 Baixo |

> **Visualização canônica:** [`cap2_supply_chain.png`](../../d2-econometric-vulnerability/outputs/cap2_supply_chain.png) (177 KB).

### §2.2 Mapa de risco geopolítico (3 clusters)

| Cluster | Fornecedor | País | Risco geopolítico |
|---|---|---|---|
| 🇨🇳 **China-Taiwan** | CATL | Fujian, China | Sanção tecnológica, bloqueio Taiwan (TSMC 45% chips avançados) |
| 🇨🇱 **Lithium Triangle** | Albemarle + SQM | Atacama, Chile | Nacionalização, instabilidade Bolívia, taxação Argentina |
| 🇰🇷 **Coreia do Sul** | Samsung | Giheung | Risco secundário em semicondutores |

### §2.3 Cenários de disrupção

| Cenário | Prob. | Duração | ΔBOM (pp) | Custo mensal |
|---|---|---|---|---|
| CATL outage 6m | 5% | 6 meses | −3,2 pp | R$ 200M |
| Lítio Albemarle strike | 8% | 3 meses | −1,8 pp | R$ 120M |
| TSMC Taiwan bloqueio | 3% | 12 meses | −6,5 pp | R$ 420M |
| Samsung Coreia disruption | 4% | 4 meses | −2,8 pp | R$ 180M |
| **Combinado (Taiwan + Chile)** | **1,5%** | **9 meses** | **−10,5 pp** | **R$ 650M** |

> **Visualização canônica:** [`cap2b_disruption.png`](../../d2-econometric-vulnerability/outputs/cap2b_disruption.png) (136 KB) + [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) (Sankey interativo).

### §2.4 Saldo comercial auto BR × PTAX

A correlação entre PTAX e déficit comercial auto é **positiva e forte**: quando o Real desvaloriza, importações de veículos ficam mais caras (em R$), e o déficit aumenta.

- **Importações médias 12m:** US$ 906,7M/mês.
- **Exportações médias 12m:** US$ 322,2M/mês.
- **Déficit mensal médio:** −US$ 584,5M = **−US$ 7 bi/ano**.

A operação Camaçari (150k veículos/ano, 60% conteúdo local até 2027) pode **substituir ~US$ 2 bi/ano** desse déficit — narrativa poderosa para a área econômica do governo.

---

## §3. A matriz V1-V31 e os 5 ângulos preditivos (L1.2)

A terceira metade do L1 é o **catálogo de variáveis** que podem entrar nos modelos. São **31 variáveis V1-V31** organizadas em 5 ângulos preditivos.

### §3.1 Os 5 ângulos preditivos (A-E)

| Ângulo | Foco | Variáveis típicas |
|---|---|---|
| **A — Volatilidade cambial** | PTAX spot, realized vol, implied vol | V1, V2, V3 |
| **B — Supply stress** | HHI por categoria, lítio price, capacity utilization | V4-V9 |
| **C — Regulatório** | ViE efetivo, BNDES funding status, regulatory score | V10-V14 |
| **D — Demanda EV** | ANFAVEA vendas, BYD share, EV penetration | V15-V20 |
| **E — Macro** | IPCA, Selic, PIB, FGV ICG/ICC, FOCUS expectations | V21-V31 |

### §3.2 As 31 variáveis (V1-V31)

| ID | Variável | Fonte | Uso primário |
|---|---|---|---|
| V1 | PTAX spot (fechamento) | BCB SGS 10813 | S1 câmbio |
| V2 | vol realizada 30d (anualizada) | calculada | S1, S3 |
| V3 | vol implícita 1m (NDF offshore) | B3 / Bloomberg | S1 hedge |
| V4 | HHI Bateria LFP | BYD/CATL market share | S2 supply |
| V5 | HHI Lítio | Albemarle/SQM | S2 supply |
| V6 | HHI Semicondutor | TSMC/Samsung | S2 supply |
| V7 | Lítio price (US$/t LCE) | Fastmarkets | S2 |
| V8 | CATL capacity utilization | BYD supply chain | S2 |
| V9 | Safety stock dias | BYD ops | S2 |
| V10 | ViE efetivo (Rota 2030 + BNDES) | MDIC + BNDES | S3 |
| V11 | BNDES Plano Mais Produção status | BNDES | S3 |
| V12 | Lista suja MTE (BYD) | MPT/MTE | S7 ESG |
| V13 | MSCI RepRisk BYD | MSCI | S7 ESG |
| V14 | Auditoria ESG externa status | auditor independente | S7 ESG |
| V15 | ANFAVEA vendas mensais | ANFAVEA | S4, S6 |
| V16 | BYD share EV mercado BR | ANFAVEA | S4 |
| V17 | EV share total mercado BR | ANFAVEA | S9 |
| V18 | BYD backlog (meses de produção) | BYD ops | S9 |
| V19 | Tesla Model 2 launch status | Tesla announcements | S11 |
| V20 | Stellantis VW GM capacity | ANFAVEA + anúncios | S11 |
| V21 | IPCA 12m | BCB SGS 13522 | S6 macro |
| V22 | Selic meta | BCB SGS 13521 | S6 macro |
| V23 | PIB mensal | BCB SGS 4380 | S6 macro |
| V24 | FGV ICG (confiança consumidor) | FGV | S6 |
| V25 | FGV ICC (confiança indústria) | FGV | S6 |
| V26 | FOCUS expectativas IPCA 12m | BCB | S6 |
| V27 | Trade balance autos | MDIC | S6 |
| V28 | Credit auto volume | BCB SGS 2071 | S6 |
| V29 | NTN-B 10y real | ANBIMA | S6 |
| V30 | DXY (dólar index) | Bloomberg | S1, S6 |
| V31 | Copper, nickel, cobalt prices | LME | S2 |

### §3.3 Fontes primárias

- **BCB SGS:** PTAX, IPCA, Selic, PIB, FOCUS — séries temporais oficiais.
- **ANFAVEA:** vendas mensais, produção, market share.
- **MDIC/SECEX:** trade balance.
- **B3/Bloomberg:** vol implícita, NDF, swap rates.
- **Fastmarkets:** lítio, níquel, cobalto.
- **MSCI:** RepRisk ESG.
- **MPT/MTE:** lista suja trabalho escravo.

---

## §4. As 5 armadilhas clássicas do L1

### §4.1 Pular EDA e ir direto para GARCH

Cria viés silencioso — ninguém percebe até confrontar com a realidade. Sempre rode os 10 passos antes.

### §4.2 Remover outliers achando que são "erros"

Em séries financeiras, outliers são sinal de cauda pesada — não erros. Use EVT (L6.0) para modelar.

### §4.3 Modelar PTAX em **nível** em vez de retornos

Níveis têm raiz unitária (não-estacionários). Retornos são estacionários. GARCH assume estacionariedade.

### §4.4 Tratar HHI como "quantos fornecedores tem"

HHI é quadrático. 4 fornecedores com 25% cada → HHI = 2.500. 2 fornecedores com 50% cada → HHI = 5.000.

### §4.5 Esquecer o **lag temporal** entre PTAX e ANFAVEA

Granger test no D2 (NB-01) mostra PTAX → ANFAVEA com **lag de 4 meses** (1 trimestre). Reação de demanda a choque cambial não é imediata.

---

## §5. Quiz de auto-avaliação L1

- [ ] Sei os 10 passos da EDA de PTAX em ordem.
- [ ] Sei citar **HHI bateria LFP = 4.850** e **HHI lítio = 3.400**.
- [ ] Sei dizer o que é **kurt=4,88** e por que VaR Normal subestima.
- [ ] Sei dizer que **PTAX Granger-cause ANFAVEA com lag 4 meses**.
- [ ] Sei interpretar **ACF dos retornos²** como evidência de GARCH.
- [ ] Sei citar **3 dos 5 ângulos preditivos** com exemplo de variável.
- [ ] Sei a diferença entre **estacionariedade de nível vs retorno**.
- [ ] Sei dizer qual teste usar (ADF vs KPSS) para confirmar estacionariedade.
- [ ] Sei o que significa **déficit mensal médio −US$ 584M**.
- [ ] Sei mapear **3 clusters de risco geopolítico** (China-Taiwan, Lithium Triangle, Coreia).

Se 8/10+: pronto para L2 (modelagem preditiva).

---

## §6. Exercícios práticos (do 99-LAB-EXERCISES)

Para fixar L1, faça estes 3 exercícios do [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md):

### §6.1 Exercício 4 — Pipeline EDA completo

```python
import pandas as pd
import numpy as np
import requests
from statsmodels.tsa.stattools import adfuller
from scipy.stats import skew, kurtosis

# 1. Importar
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial=01/01/2020&dataFinal=17/07/2026"
data = requests.get(url).json()
ptax = pd.DataFrame(data)
ptax['data'] = pd.to_datetime(ptax['data'], format='%d/%m/%Y')
ptax['valor'] = ptax['valor'].astype(float)
ptax = ptax.set_index('data')['valor'].sort_index()

# 2. Limpar
ptax = ptax.dropna()
ptax = ptax[(ptax > 2) & (ptax < 10)]

# 3. Log-retorno
log_ret = np.log(ptax / ptax.shift(1)).dropna()

# 4-10. (você continua com histograma, ACF, rolling vol, etc.)

# Perguntas:
# - σ anualizada?
# - Skewness?
# - Kurtosis?
# - A série em log-retorno é estacionária (ADF)?
```

### §6.2 Exercício 5 — Calcule HHI hipotético

```python
# Suponha 3 fornecedores com market share 60%, 25%, 15%
shares = [0.60, 0.25, 0.15]
hhi = sum(s**2 for s in shares) * 10000
print(f"HHI: {hhi:.0f}")
# Resposta esperada: 3600 + 625 + 225 = 4450
```

### §6.3 Exercício 6 — Identifique outliers

```python
# Outliers formais (1.5×IQR)
Q1, Q3 = log_ret.quantile([0.25, 0.75])
IQR = Q3 - Q1
outliers = log_ret[(log_ret < Q1 - 1.5*IQR) | (log_ret > Q3 + 1.5*IQR)]
print(f"N outliers: {len(outliers)}")
print(f"Datas: {outliers.head().index.tolist()}")
# Pergunta: qual evento político/econômico essas datas coincidem?
```

---

## §7. Mapa de saída — onde ir depois de L1

Quando terminar L1, escolha sua trilha:

### §7.1 Se você quer ir direto para **modelagem preditiva**

→ [**Nota-Meta D2 #04 — L2 Modelagem Preditiva**](./NOTA-META-D2-04-L2-PREDITIVA.md) (GARCH, MC, stress test).

### §7.2 Se você quer entender **decisão executiva**

→ L4 (comunicação Conselho, dashboards).

### §7.3 Se você quer **exercícios hands-on**

→ [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios EASY-EXPERT.

### §7.4 Se você quer se tornar **sênior**

→ L5 + L6 + 98-LAB-ADVANCED (calibração, interpretabilidade, risco de cauda, mesa operacional).

---

## §8. Recursos auxiliares para L1

### §8.1 Docs canônicos

- [`L1.0-eda-pTAX-passo-a-passo.md`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md) — 10 passos da EDA PTAX (37.4 KB, 886 linhas).
- [`L1.1-eda-supply-chain-trade-balance.md`](../../d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md) — saldo comercial + HHI + Sankey (41.4 KB, 639 linhas).
- [`L1.2-eda-variaveis-expandidas-matriz.md`](../../d2-econometric-vulnerability/_study_notes/L1.2-eda-variaveis-expandidas-matriz.md) — 31 variáveis V1-V31 (29.4 KB, 481 linhas).

### §8.2 Outputs visuais

- [`cap1_ptax_historia.png`](../../d2-econometric-vulnerability/outputs/cap1_ptax_historia.png) — série PTAX história (260 KB).
- [`cap1b_volatility.png`](../../d2-econometric-vulnerability/outputs/cap1b_volatility.png) — vol realizada 30d/90d (208 KB).
- [`cap1c_stress_test.png`](../../d2-econometric-vulnerability/outputs/cap1c_stress_test.png) — stress test (149 KB).
- [`cap2_supply_chain.png`](../../d2-econometric-vulnerability/outputs/cap2_supply_chain.png) — HHI por categoria (177 KB).
- [`cap2b_disruption.png`](../../d2-econometric-vulnerability/outputs/cap2b_disruption.png) — disruption scenarios (136 KB).
- [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) — Sankey interativo (8.4 KB).

### §8.3 Notebooks para L1

- [`NB-01-ptax-garch.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) — entrada PTAX + GARCH.
- [`NB-02-supply-chain-hhi.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-02-supply-chain-hhi/nb-02-supply-chain-hhi.ipynb) — HHI por categoria.

### §8.4 Outputs auxiliares para L1

- [`auto-trade-balance-scatter.html`](../../d2-econometric-vulnerability/outputs/auto-trade-balance-scatter.html) — PTAX × déficit comercial (4.9 MB).
- [`auto-trade-timeseries.html`](../../d2-econometric-vulnerability/outputs/auto-trade-timeseries.html) — série temporal trade balance (4.9 MB).
- [`scatter-ptax-anfavea.html`](../../d2-econometric-vulnerability/outputs/scatter-ptax-anfavea.html) — scatter PTAX × ANFAVEA.

---

## §9. Takeaways em 5 bullets (para fixar)

1. **Os 10 passos da EDA** são a "receita" para qualquer série temporal financeira. Pular é receita para viés silencioso.

2. **PTAX tem kurt=4,88 (fat tails pesadas).** Normal subestima VaR em 30-50%. Use t-Student (GARCH-t com ν=6,99).

3. **HHI é quadrático.** HHI bateria LFP = 4.850 (CATL 95,7%) é o maior risco de supply chain. CATL + Albemarle + SQM cobrem > 80% do supply crítico.

4. **ACF dos retornos² é a evidência de GARCH.** ACF dos retornos cai rápido (sem memória na média), ACF dos retornos² tem caudas longas (vol persistente).

5. **31 variáveis V1-V31 em 5 ângulos** (A=vol, B=supply, C=regulatório, D=demanda, E=macro). Cada modelo D2 consome um subconjunto específico.

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado do Layer L1.*
*Próxima: [Nota-Meta D2 #04 — L2 Modelagem Preditiva](./NOTA-META-D2-04-L2-PREDITIVA.md).*