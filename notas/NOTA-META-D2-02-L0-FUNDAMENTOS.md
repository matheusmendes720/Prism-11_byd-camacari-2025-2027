---
slug: notas-meta-d2-l0-fundamentos
title: "Nota-Meta D2 #02 — L0 Fundamentos · Meta-Learning de Estatística e Probabilidade para D2"
ueid: ikigai:nota:d2-meta-l0-fundamentos:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, l0, fundamentos, estatistica-descritiva, probabilidade, meta-learning]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre o Layer L0 da base D2 (Fundamentos
    Matemáticos). Cobre as 14 métricas-mestre com números REAIS do PTAX
    BYD, fixação das fórmulas canônicas via exemplos do projeto, e o
    vocabulário mínimo para ler qualquer output posterior (L1, L2, L3).
    Esta nota é o "alfabeto" do D2 — sem ela, nada depois faz sentido.
  _audience: engenheiro-junior, analista-pleno, pesquisador, new-joiner
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md
    - /d2-econometric-vulnerability/_study_notes/L0.1-glossario-notebooks.md
    - /d2-econometric-vulnerability/_study_notes/L0.2-estatistica-descritiva.md
    - /d2-econometric-vulnerability/_study_notes/L0.3-probabilidade-distribuicoes.md
    - /d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md
  _outputs:
    - vocabulário-fixo
    - 14-metricas-com-numeros
    - 5-distribuicoes-mais-usadas
    - pitfalls-classicos
  _success_criteria: >-
    leitor consegue citar 14 métricas com números canônicos, distingue
    VaR vs CVaR vs Expected Shortfall, e identifica qual distribuição
    usar em qual contexto.
---

# Nota-Meta D2 #02 — L0 Fundamentos

> **Quem está falando:** um par sênior-orientador sobre o alfabeto D2.
> **O que esta nota faz:** destrincha o Layer 0 (L0) inteiro em meta-aprendizado, com foco em fixar as 14 métricas-mestre + as 5 distribuições mais usadas.
> **Pré-requisito:** saber Python básico (numpy, pandas).
> **Tempo de leitura:** 60-90 min (com exercícios).
> **Fonte canônica:** [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §L0 + 4 docs L0.0-L0.3.

---

## §0. Por que L0 vem antes de qualquer coisa

O L0 é o **alfabeto** da base D2. Ele não é opcional — sem ele, ler L1 (EDA) ou L2 (Preditiva) é como ler Hamlet sem saber inglês.

### §0.1 O que L0 entrega

| Doc | Conteúdo | O que você ganha |
|---|---|---|
| [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) | 14 métricas com fórmula + número | Vocabulário técnico |
| [`L0.1-glossario-notebooks.md`](../../d2-econometric-vulnerability/_study_notes/L0.1-glossario-notebooks.md) | Walkthrough dos 6 outputs HTML | Capacidade de ler visualizações |
| [`L0.2-estatistica-descritiva.md`](../../d2-econometric-vulnerability/_study_notes/L0.2-estatistica-descritiva.md) | Média, mediana, σ, skew, kurt, IQR | Descrever distribuições |
| [`L0.3-probabilidade-distribuicoes.md`](../../d2-econometric-vulnerability/_study_notes/L0.3-probabilidade-distribuicoes.md) | Normal, t-Student, log-normal, exponencial, χ², F | Escolher modelo certo |

### §0.2 Mapa conceitual visual

```
L0.0 Glossário métricas (σ, VaR, GARCH...)
  ↓ define
L0.2 Estatística descritiva (média, σ, skew, kurt)
  ↓ fundamenta
L0.3 Distribuições de probabilidade (Normal, t-Student, log-normal)
  ↓ aplica em
L1.x (EDA) → L2.x (Preditiva) → L3.x (Prescritiva)
```

**Princípio:** L0 é consumido antes, mas é referenciado durante. Você sempre volta a L0 quando encontra uma métrica nova em L2/L3.

---

## §1. As 14 métricas-mestre (com números REAIS do PTAX)

Esta é a lista canônica. Toda métrica aparece nos artefatos D2 e tem exemplo numérico concreto do projeto BYD Camaçari. **Decore estas.**

### §1.1 Retorno e log-retorno

**Métrica #1: Retorno aritmético simples** $r_t = \frac{P_t - P_{t-1}}{P_{t-1}}$

- **No D2:** PTAX ontem R$ 5,20 → hoje R$ 5,46 → r = +5,0% (BRL desvalorizou 5%).
- **Limitação:** retornos aritméticos **não são aditivos** no tempo.
- **Onde calcular:** `ptax.pct_change()` em pandas.

**Métrica #2: Log-retorno** $\ell_t = \ln(P_t / P_{t-1})$

- **No D2:** PTAX 5,20 → 5,46 → ℓ = ln(1,05) = +4,88% (vs +5,00% do simples — diferença de 12 pontos-base).
- **Por que importa:** GARCH, VaR, CVaR usam log-retorno. É **aditivo** no tempo.
- **Onde calcular:** `np.log(ptax / ptax.shift(1))` em numpy.

> **Regra de bolso:** se |r| < 5%, log-retorno ≈ retorno simples. Se |r| > 20%, a aproximação quebra (relevante em stress de −30%).

### §1.2 Volatilidade (σ)

**Métrica #3: σ anualizada** $\sigma_{anual} = \sigma_{daily} \times \sqrt{252}$

- **No D2:**
  - `vol30_annualized: 14,19%` (vol 30 dias úteis, anualizada).
  - `vol90_annualized: 14,19%` (vol 90 dias úteis).
  - **Vol histórica (1.642 obs, 2020-2026): 14,17%.**
- **Pegadinha:** "252" é convenção americana. Para 24/7 crypto usa 365. Para câmbio mensal usa √12. **Esquecer de anualizar e reportar vol diária como anual** é o erro clássico.
- **Onde calcular:** `log_ret.std() * np.sqrt(252)`.

**Métrica #4: σ PTAX BCB SGS série 10813 (10 anos)**

- **Valor:** **14,86%** (2.509 observações, jan/2015-dez/2025).
- **Por que importa:** é o número do Banco Central efetivo, usado na recalibração D3 v2.0.1 (BCB real).
- **Fonte:** [`D3-RECALIBRATION-S1-S3-REAL-BCB.md`](../../analise-prescritiva/reports/decision-framework/3-recalibration/D3-RECALIBRATION-S1-S3-REAL-BCB.md) (2.509 obs).

### §1.3 Risco de cauda — VaR e CVaR

**Métrica #5: VaR (Value at Risk)** — "quanto posso perder com X% de confiança em Y dias"

- **Fórmula paramétrica (Normal):** $\text{VaR}_\alpha = -(\mu - z_\alpha \cdot \sigma) \approx z_\alpha \cdot \sigma$
- **Versão empírica (sem assumir distribuição):** percentil α da distribuição de P&L.
- **No D2 (Monte Carlo 10k paths × 6 meses, GARCH-t):**
  - **VaR 95% = P5 = −5,88pp de impacto BOM** (5% chance de perda pior que isso em 6m).
  - **VaR refresh (jul/2026): R$ 6,43 bi**.
  - **VaR v2.0.1 (4-shock tornado): R$ 8,21 bi**.
- **Interpretação para BYD:** "existe 5% de chance do impacto cambial ser pior que −5,88% em 6m" = R$ 12,6 bi × 5,88% = **R$ 741 milhões de exposição extrema**.
- **Pegadinha grande:**
  1. VaR **não é coerente** (subaditividade falha: VaR(A+B) pode ser > VaR(A)+VaR(B)).
  2. Para distribuições com **fat tails** (kurt > 3), VaR Normal **subestima** a perda real em **30-50%** — ver L0.3.
  3. Não diz nada sobre o que acontece **além** do VaR.

**Métrica #6: CVaR (Conditional Value at Risk / Expected Shortfall)** — "se o pior caso (além do VaR) acontecer, qual o tamanho médio da perda?"

- **Fórmula:** $\text{CVaR}_\alpha = -\mathbb{E}[X \mid X \leq -\text{VaR}_\alpha]$
- **Intuição:** enquanto VaR dá o "limite" (percentil), CVaR dá a **média do que acontece** quando você cruza esse limite. **CVaR ≥ VaR sempre.**
- **No D2:**
  - **CVaR 95% (MC refresh): R$ 8,04 bi**.
  - **CVaR 95% (4-shock v2.0.1): R$ 10,14 bi**.
- **Por que é melhor que VaR:**
  1. **Coerente** (subaditivo): CVaR(A+B) ≤ CVaR(A)+CVaR(B).
  2. **Sensível à cauda** — não só o percentil, mas o que está além.
  3. É o que Basileia (FRTB) **recomenda** desde 2016 para risco de mercado.

> **Distinção importante:** VaR diz "qual o limite". CVaR diz "se passar do limite, qual o tamanho médio da queda". Em stress, CVaR é a métrica que assusta.

### §1.4 Forma da distribuição — Skewness e Kurtosis

**Métrica #7: Skewness (assimetria)** $\text{skew} = \frac{1}{N}\sum_i \left(\frac{x_i - \bar{x}}{\sigma}\right)^3$

- **No D2 (PTAX 2020-2026):** **+0,152** (slight appreciation bias — leve assimetria positiva).
- **Interpretação:** skew > 0 = cauda direita longa (ganha grande raramente). skew < 0 = cauda esquerda longa (perde grande raramente).
- **Por que importa para BYD:** a BYD importa componentes — exposição a skew **negativa** do PTAX (BRL desvalorizando) é pior. A skew +0,152 é boa notícia marginal (movimentos extremos são mais pra cima que pra baixo).

**Métrica #8: Kurtosis (caudas)** $\text{kurt} = \frac{1}{N}\sum_i \left(\frac{x_i - \bar{x}}{\sigma}\right)^4 - 3$ (excess kurtosis; 0 = Normal)

- **No D2 (PTAX 2020-2026):** **+4,88** (fat tails pesadas; Normal tem kurt=0, log-normal tem kurt=3, distribuições financeiras empíricas têm kurt=4-8).
- **Implicação:** VaR Normal **subestima** a perda real em 30-50%. Use GARCH-t (ν=6,99) ou EVT (L6.0) para corrigir.

> **Distinção importante:** skew mede **simetria**, kurt mede **caudas**. Uma distribuição pode ter skew=0 (simétrica) e kurt=10 (caudas muito pesadas) — como a t-Student com ν=3.

### §1.5 Forma temporal — ACF, PACF, IQR

**Métrica #9: ACF (autocorrelation function)** mede correlação entre observações separadas por k lags.

- **No D2:** ACF dos log-retornos PTAX cai rapidamente (1 lag ≈ 0,05, 5 lags ≈ 0,02) — quase sem memória, **exceto** nos quadrados (vol clustering).
- **Por que importa:** ACF dos retornos² é o que justifica GARCH (L2.1).

**Métrica #10: PACF (partial autocorrelation)** mede correlação direta, descontada a contribuição de lags intermediários.

- **No D2:** PACF dos log-retornos PTAX cai a zero após lag 1 — modelo de ordem 1 (AR(1)) basta para a média condicional.

**Métrica #11: IQR (interquartile range)** $IQR = P_{75} - P_{25}$

- **Uso:** detectar outliers com regra 1,5×IQR (Tukey fence).
- **No D2:** PTAX tem poucos outliers formais, mas eventos como eleción 2022 e lítio spike produzem |z| > 3.

### §1.7 Concentração de mercado — HHI

**Métrica #12: HHI (Herfindahl-Hirschman Index)** $\text{HHI} = \sum_i s_i^2$ onde $s_i$ é market share em decimal.

- **No D2 (supply chain):**
  - **HHI Bateria LFP: 4.850** (altamente concentrada, CATL 95,7%).
  - **HHI Lítio: 3.400** (Albemarle 50% + SQM 30%).
  - **HHI Semicondutor: 2.925** (TSMC 45% + Samsung 30%).
- **Regra regulatória (FTC):** HHI > 2.500 = altamente concentrado.
- **Pegadinha:** HHI é **quadrático** — duplicar market share quadruplica contribuição. 4 fornecedores com 25% cada → HHI = 4 × 0,25² = 2.500.

### §1.8 Volatilidade condicional — GARCH

**Métrica #13: GARCH(1,1) α + β (persistence)**

- **No D2:** α = **0,0488**, β = **0,9418**, α + β = **0,9906** (quase unit root).
- **Interpretação:** β alto = vol muito persistente. Cada novo dia herda 94% da vol de ontem. Requer hedge **estrutural**, não pontual.

**Métrica #14: GARCH(1,1)-t ν (degrees of freedom)** mede a "cauda" do Student-t.

- **No D2:** ν = **6,99** (caudas pesadas; Normal tem ν = ∞).
- **Implicação:** distribuições com ν baixo têm caudas mais pesadas — alinhar com EVT em L6.0 para VaR extremo (99,5%, 99,9%).

---

## §2. As 5 distribuições mais usadas (e quando cada uma)

A pergunta "que distribuição usar?" é o coração de L0.3. Aqui está o guia operacional.

### §2.1 Normal (Gaussiana)

- **Quando usar:** retornos diários de ações em mercado eficiente (1960-2000), erros de regressão, base do VaR paramétrico.
- **Quando NÃO usar:** retornos cambiais em mercados emergentes (PTAX tem kurt=4,88 — Normal subestima cauda em 30-50%).
- **Fórmula densidade:** $f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$

### §2.2 t-Student

- **Quando usar:** retornos financeiros com caudas pesadas (a maioria). Base do **GARCH-t** usado em D2 (ν=6,99).
- **Por que:** tem cauda mais pesada que Normal, mantendo forma de sino. Para ν → ∞, converge para Normal.
- **Fórmula densidade:** $f(x) = \frac{\Gamma((\nu+1)/2)}{\sqrt{\nu\pi}\,\Gamma(\nu/2)}\left(1 + \frac{x^2}{\nu}\right)^{-(\nu+1)/2}$

### §2.3 Log-normal

- **Quando usar:** preços de ativos (que são sempre > 0), retornos compostos em horizonte longo.
- **Por que:** se ℓ = log(P_t/P_{t-1}) é Normal, então P_t é log-normal. Garantia de não-negatividade.
- **No D2:** log-normal é usado no Monte Carlo de stress test (figura 1.4 do atlas).

### §2.4 Exponencial

- **Quando usar:** tempo até evento (default, falha, gap), distribuições de cauda pesada sem forma de sino.
- **No D2:** EVT (L6.0) usa Generalized Pareto Distribution (GPD), que tem exponencial como caso particular.

### §2.5 χ² (qui-quadrado)

- **Quando usar:** testes de aderência, variância amostral, ARCH-LM test (L1.0).
- **No D2:** teste ARCH-LM (Ljung-Box nos retornos²) usa χ² — rejeitar H0 = há efeito ARCH (justifica GARCH).

---

## §3. As 7 armadilhas clássicas do L0

### §3.1 Tratar VaR como Expected Shortfall

VaR = percentil. CVaR = média da cauda. Confundir os dois é a falha mais comum em apresentações para Conselho. **Sempre escreva VaR E CVaR juntos** no slide.

### §3.2 Esquecer que σ=14,19% é uma janela (30d)

A σ muda diariamente. Sempre fale "σ 30d anualizada = 14,19% no momento do estudo". Não cite como se fosse uma constante universal.

### §3.3 Achar que GARCH prevê PTAX

GARCH prevê **volatilidade**, não o nível da taxa. A confusão é clássica. Em qualquer comunicação, diga "GARCH prevê vol".

### §3.4 Misturar log-retorno com retorno aritmético

Log-retorno é **aditivo** no tempo; retorno aritmético não. Para VaR/GARCH/MC, use log-retorno. Para stress test direto (BOM × Δ%), use aritmético.

### §3.5 Tratar Normal como default

Para mercados emergentes e câmbio, Normal **subestima caudas em 30-50%**. Use sempre t-Student (ν entre 4-8) ou EVT.

### §3.6 Calcular σ sem anualizar

σ_daily = 0,89%. σ_anual = 14,19%. **Erro clássico:** esquecer de multiplicar por √252.

### §3.7 Esquecer a regra √T

Para horizontes intermediários, vol escala com √T. VaR 1 mês = VaR 1 dia × √21. VaR 6 meses = VaR 1 dia × √126.

---

## §4. Quiz de auto-avaliação L0

- [ ] Sei definir **log-retorno** e por que ele é usado em GARCH.
- [ ] Sei calcular **σ anualizada** a partir de σ diária (√252).
- [ ] Sei distinguir **VaR vs CVaR** com exemplo numérico.
- [ ] Sei citar **σ PTAX = 14,19%** e **HHI bateria LFP = 4.850**.
- [ ] Sei dizer o que é **GARCH α=0,0488, β=0,9418, ν=6,99** significam.
- [ ] Sei explicar por que **Normal subestima VaR** em 30-50% para PTAX.
- [ ] Sei por que **HHI é quadrático**.
- [ ] Sei por que **CVaR ≥ VaR** sempre.
- [ ] Sei dizer qual **distribuição usar em qual contexto** (5 principais).
- [ ] Sei a regra **√T** para escalar vol entre horizontes.

Se 8/10+: pronto para L1.

---

## §5. Exercícios práticos (do 99-LAB-EXERCISES)

Para fixar L0, faça estes 3 exercícios do [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md):

### §5.1 Exercício 1 — Calcule vol 30d de PTAX

```python
import pandas as pd
import numpy as np

# Carregar PTAX do BCB SGS
ptax = pd.read_csv('bcb_series_scout.csv')['ptax'].dropna()
log_ret = np.log(ptax / ptax.shift(1)).dropna()

# 1. σ diária
sigma_d = log_ret.std()

# 2. σ anualizada
sigma_a = sigma_d * np.sqrt(252)

# 3. Compare com valor esperado
print(f"σ diária: {sigma_d*100:.4f}%")
print(f"σ anualizada: {sigma_a*100:.4f}%")
print(f"Esperado: ~14.19%")
```

### §5.2 Exercício 2 — Plote histograma de log-retornos

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 6))
ax.hist(log_ret, bins=100, density=True, alpha=0.6, label='PTAX log-retorno')
ax.set_xlabel('log-retorno diário')
ax.set_ylabel('densidade')
ax.set_title('Distribuição empírica vs Normal')
ax.legend()
plt.show()

# Pergunta: a distribuição tem caudas pesadas? Compare com Normal teórico.
```

### §5.3 Exercício 3 — Calcule VaR empírico

```python
# VaR 95% empírico = percentil 5 dos log-retornos × exposição
notional = 12_600_000_000  # R$ 12,6 bi (BOM importado BYD)

var_95_emp = -np.percentile(log_ret, 5) * notional
print(f"VaR 95% empírico (1 dia): R$ {var_95_emp/1e6:.2f} milhões")

# Escale para 6 meses com regra √T
var_95_6m = var_95_emp * np.sqrt(126)
print(f"VaR 95% empírico (6 meses): R$ {var_95_6m/1e9:.2f} bilhões")
```

**Respostas esperadas:**
- σ diária ≈ 0,89%, σ anualizada ≈ 14,19%.
- Histograma: caudas pesadas visíveis (mais observações nas caudas que Normal prevê).
- VaR 95% 1 dia ≈ R$ 220M. VaR 95% 6 meses ≈ R$ 2,5 bi (vs VaR refresh oficial R$ 6,43 bi — a diferença é a t-Student, MC, etc.).

---

## §6. Mapa de saída — onde ir depois de L0

Quando terminar L0, escolha sua trilha:

### §6.1 Se você quer entender **os dados** antes de modelar

→ [**Nota-Meta D2 #03 — L1 EDA**](./NOTA-META-D2-03-L1-EDA.md) (PTAX passo-a-passo, supply chain, matriz V1-V31).

### §6.2 Se você quer ir direto para **modelagem preditiva**

→ Pule para L2 (mas volte a L1 para entender os dados).

### §6.3 Se você quer entender a **interface com o negócio**

→ Pule para L4 (comunicação Conselho, dashboards).

### §6.4 Se você quer **exercícios hands-on**

→ [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios EASY-EXPERT.

---

## §7. Recursos auxiliares para L0

### §7.1 Glossários e fórmulas

- [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md) — 14 métricas com fórmula + número (27.4 KB, 525 linhas).
- [`L0.1-glossario-notebooks.md`](../../d2-econometric-vulnerability/_study_notes/L0.1-glossario-notebooks.md) — walkthrough dos 6 outputs HTML (26 KB, 465 linhas).
- [`L0.2-estatistica-descritiva.md`](../../d2-econometric-vulnerability/_study_notes/L0.2-estatistica-descritiva.md) — média, mediana, σ, skew, kurt, IQR (22.3 KB, 598 linhas).
- [`L0.3-probabilidade-distribuicoes.md`](../../d2-econometric-vulnerability/_study_notes/L0.3-probabilidade-distribuicoes.md) — Normal, t-Student, log-normal, exponencial, χ², F (26.2 KB, 682 linhas).
- [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) — 50+ fórmulas em ordem alfabética (15.6 KB, 317 linhas).

### §7.2 Notebooks para L0

- [`NB-01-ptax-garch.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) — ponto de partida prático (não roda L0 mas é referenciado).
- [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios práticos.

### §7.3 Outputs HTML do D2 (que você vai aprender a ler)

- [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) — stress test determinístico.
- [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) — 10k paths MC.
- [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html) — radar 4 dimensões.
- [`supply-chain-sankey.html`](../../d2-econometric-vulnerability/outputs/supply-chain-sankey.html) — HHI Sankey.

### §7.4 Bibliografia canônica para L0

- Hull, "Risk Management and Financial Institutions", Cap 1-3 (VaR, CVaR, vol).
- Tsay, "Analysis of Financial Time Series", Cap 1-4 (séries temporais).
- Cont, "Empirical Analysis of Financial Time Series", Cap 8-10 (GARCH).

---

## §8. Takeaways em 5 bullets (para fixar)

1. **σ 14,19% anualizada = √252 × σ_daily.** É a "velocidade" típica do PTAX. Sempre cite a janela (30d, 90d, 10y).

2. **VaR = percentil; CVaR = média da cauda.** CVaR ≥ VaR sempre. Use CVaR em Basileia FRTB desde 2016.

3. **GARCH α=0,0488, β=0,9418, ν=6,99.** α mede reação a choque; β mede persistência; ν mede cauda (ν baixo = cauda pesada).

4. **HHI = Σ s_i². Quadrático.** HHI > 2.500 = altamente concentrado.

5. **PTAX tem kurt=4,88 (fat tails).** Normal subestima VaR em 30-50%. Use t-Student ou EVT.

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado do Layer L0.*
*Próxima: [Nota-Meta D2 #03 — L1 EDA](./NOTA-META-D2-03-L1-EDA.md).*