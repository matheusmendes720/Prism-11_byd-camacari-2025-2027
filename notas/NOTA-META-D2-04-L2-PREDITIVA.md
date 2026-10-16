---
slug: notas-meta-d2-l2-preditiva
title: "Nota-Meta D2 #04 — L2 Modelagem Preditiva · Meta-Learning de GARCH, MC e Stress Test"
ueid: ikigai:nota:d2-meta-l2-preditiva:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, l2, garch, monte-carlo, stress-test, modelagem-preditiva, meta-learning]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre o Layer L2 da base D2 (Análise Preditiva).
    Cobre a evolução ARCH → GARCH → GJR → EGARCH, com parâmetros REAIS do
    PTAX (α=0.0488, β=0.9418, ν=6.99), e o pipeline de Monte Carlo stress
    test que produziu o VaR refresh R$ 6.43 bi e o VaR v2.0.1 R$ 8.21 bi.
    Esta nota é onde L0 (alfabeto) + L1 (dados) viram modelo preditivo.
  _audience: engenheiro-junior, analista-pleno, pesquisador, modelador
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/L2.0-arquitetura-modelagem.md
    - /d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md
    - /d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md
    - /d2-econometric-vulnerability/outputs/cambio-stress-test.html
    - /d2-econometric-vulnerability/outputs/cambio-monte-carlo.html
    - /d2-econometric-vulnerability/outputs/sensitivity-monte-carlo-bom.html
  _outputs:
    - garch-1-1-t-fit
    - mc-stress-test-10k
    - var-refresh-vs-v2-0-1
  _success_criteria: >-
    leitor consegue explicar GARCH α, β, ν, interpretar VaR vs CVaR,
    e distinguir stress test determinístico vs Monte Carlo probabilístico.
---

# Nota-Meta D2 #04 — L2 Modelagem Preditiva

> **Quem está falando:** um par sênior-orientador mostrando como os dados de L1 viram modelos preditivos em L2.
> **O que esta nota faz:** destrincha o Layer 2 (L2) inteiro em meta-aprendizado, com foco em fixar GARCH(1,1)-t calibrado em PTAX, MC stress test 10k paths, e VaR/CVaR refresh.
> **Pré-requisito:** ter lido [Nota-Meta D2 #03 — L1 EDA](./NOTA-META-D2-03-L1-EDA.md).
> **Tempo de leitura:** 90-120 min (com exercícios).
> **Fonte canônica:** [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §L2 + 3 docs L2.0-L2.2.

---

## §0. Por que L2 vem depois de L1

L2 (Análise Preditiva) é onde os dados viram **modelo**. A pergunta operacional é: "se as condições atuais continuarem (ou piorarem), o que vai acontecer com a vulnerabilidade da planta?".

### §0.1 O que L2 entrega

| Doc | Conteúdo | | |
|---|---|---|---|
| [`L2.0-arquitetura-modelagem.md`](../../d2-econometric-vulnerability/_study_notes/L2.0-arquitetura-modelagem.md) | Por que modelar retornos (não níveis), pipeline 6 etapas, modelos MÉDIA vs VOLATILIDADE | 27 KB, 599 linhas |
| [`L2.1-modelos-vol-garch-gjr.md`](../../d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md) | ARCH → GARCH → GJR → EGARCH, formulação completa, parâmetros D2 | 32 KB, 798 linhas |
| [`L2.2-cambio-stress-test-monte-carlo.md`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) | Stress test vs backtest vs forecast, MC 4-shock Cholesky, VaR vs CVaR | 32 KB, 836 linhas |

### §0.2 Mapa conceitual visual

```
L0 (alfabeto) → L1 (EDA dados) → L2 (modelagem preditiva)
                                      ↓
                          ┌───────────────────────────┐
                          │ L2.0: Arquitetura (6 etapas)│
                          │   ↓                          │
                          │ L2.1: GARCH/GJR (vol modelo)│
                          │   ↓                          │
                          │ L2.2: MC + Stress Test (VaR)│
                          └───────────────────────────┘
                                            ↓
                              L3 (análise prescritiva)
```

### §0.3 Os 2 outputs canônicos do L2

| Output | Função |
|---|---|
| [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) | Stress test determinístico (cenários −5/−10/−20/−30%) |
| [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) | 10k paths × 6 meses, GARCH-t (P5/P50/P95, VaR/CVaR) |

---

## §1. L2.0 — Arquitetura de modelagem: por que retornos, não níveis

A pergunta operacional: **o que modelar**? Resposta: **log-retornos**, não PTAX em nível.

### §1.1 Por que retornos (não níveis)

| Argumento | Por quê |
|---|---|
| **Estacionariedade** | PTAX em nível tem tendência (não-estacionário). Log-retornos são estacionários. Modelos assumem estacionariedade. |
| **Aditividade temporal** | Log-retorno é **aditivo** no tempo. $\N_{2020→2026} = \sum_i \ell_i$. Nível não é. |
| **Simetria** | Log-retorno de +5% é simétrico ao de −5% (em magnitude). Para ativos, isso é propriedade desejável. |
| **Propriedades estatísticas superiores** | Distribuição de log-retornos é mais próxima de Normal/t-Student. Modelagem é tratável. |

### §1.2 Pipeline 6 etapas

```
[1] Import + clean     (1.642 obs PTAX)
[2] Log-retorno        (1.641 obs)
[3] Testes estatísticos (ADF, KPSS, Ljung-Box)
[4] Modelo da média    (ARIMA ou constante)
[5] Modelo da vol      (GARCH/GJR)
[6] Diagnóstico        (ARCH-LM, normality tests)
```

**Princípio fundamental:** L2 **separa** o que modela a **média** (ARIMA) do que modela a **volatilidade** (GARCH). É a "decomposição em dois estágios" da modelagem financeira moderna.

---

## §2. L2.1 — GARCH(1,1) Student-t: o coração do D2

### §2.1 A observação que motivou ARCH (1982)

O economista Robert Engle (Nobel 2003) notou: **volatilidade não é constante — vem em clusters**. Períodos de alta vol tendem a persistir; períodos de calma tendem a persistir.

```text
|retorno diário| (em %)
0.030 |                                    *
0.025 |                                    *   *
0.020 |                              *  *  *   *   *
0.015 |                          *  *  *  *   *   *
0.010 |              *  *  *  *  *  *  *  *   *
0.005 |*  *  *  *  *  *  *  *  *  *  *  *  *   *
0.000 |*  *  *  *  *  *  *  *  *  *  *  *  *   *
└──────────────────────────────────────────────── tempo
     2020    2021    2022    2023    2024    2025    2026
     [CALMA]  [INSTA-   [VOL ALTA  [CALMA   [VOL SUBINDO]
                BILIDADE]  COVID+    RELATIVA]
                           ELEIÇÃO]
```

> **Cluster visível:** 2020-2022 (COVID + eleição) tem vol alta agrupada; 2023-2024 tem vol suprimida.

### §2.2 A evolução ARCH → GARCH → GJR → EGARCH

**ARCH(1) — Engle (1982):**
$$\sigma^2_t = \omega + \alpha \cdot \varepsilon^2_{t-1}$$
- Vol de hoje depende do choque quadrado de ontem.

**GARCH(1,1) — Bollerslev (1986):**
$$\sigma^2_t = \omega + \alpha \cdot \varepsilon^2_{t-1} + \beta \cdot \sigma^2_{t-1}$$
- Vol de hoje depende do choque quadrado de ontem **E** da vol de ontem.
- Persistence = α + β. Estacionário se α + β < 1.

**GJR-GARCH(1,1) — Glosten-Jagannathan-Runkle (1993):**
$$\sigma^2_t = \omega + \alpha \cdot \varepsilon^2_{t-1} + \gamma \cdot \varepsilon^2_{t-1} \cdot \mathbb{1}_{\varepsilon_{t-1}<0} + \beta \cdot \sigma^2_{t-1}$$
- Adiciona **leverage effect**: choques negativos aumentam vol mais que choques positivos.

**EGARCH — Nelson (1991):**
$$\ln(\sigma^2_t) = \omega + \alpha \cdot |z_{t-1}| + \gamma \cdot z_{t-1} + \beta \cdot \ln(\sigma^2_{t-1})$$
- Modela log(vol), garantindo positividade. Captura leverage assimétrico.

### §2.3 Os parâmetros REAIS do D2 (calibrados em PTAX 2020-2026)

| Parâmetro | Valor | Interpretação |
|---|---|---|
| **α (ARCH)** | **0,0488** | Reação a choque: 5% do choque de hoje vira vol amanhã |
| **β (GARCH)** | **0,9418** | Persistência: 94% da vol de hoje persiste amanhã |
| **α + β** (persistence) | **0,9906** | Quase unit root — vol é "grudenta" |
| **ν (Student-t df)** | **6,99** | Caudas pesadas (Normal tem ν=∞) |
| **Half-life** | **73,3 dias** (~3,5 meses) | Tempo para choque decair pela metade |

**Por que esses parâmetros importam para a BYD:**

1. **β = 0,94** → cada novo dia herda 94% da vol do dia anterior. **Hedge cambial precisa ser estrutural, não pontual.** Um dia calmo não é motivo para reduzir hedge.

2. **Half-life = 73 dias** → um choque leva **3,5 meses** para decair pela metade. Isso é mais lento que mercados desenvolvidos (~30 dias) — coerente com mercado emergente sob estresse fiscal.

3. **ν = 6,99** → distribuição com caudas pesadas. VaR paramétrico Normal **subestima** em ~30-50%. Use GARCH-t (já calibrado) ou EVT (L6.0).

### §2.4 Pseudo-código Python

```python
from arch import arch_model

# Fit GARCH(1,1) Student-t
model = arch_model(log_ret, mean='Constant', vol='GARCH', p=1, q=1, dist='t')
result = model.fit(disp='off')

print(result.summary())
# α (alpha[1])    = 0.0488
# β (beta[1])     = 0.9418
# ν (nu)          = 6.99
# persistence     = 0.9906
# half-life       = 73.3 dias
```

### §2.5 Diagnóstico

Para validar o modelo, use 3 testes:

1. **ARCH-LM test** (Ljung-Box nos resíduos²): rejeita H0 → ainda há ARCH effect → modelo ruim.
2. **Normality test** (Jarque-Bera): rejeita H0 → resíduos não são normais → use t-Student (já feito).
3. **Stability test** (eigenvalues dentro do círculo unitário): confirma que α+β<1.

---

## §3. L2.2 — Monte Carlo, Stress Test e VaR

### §3.1 Stress Test determinístico (simples)

A forma mais simples de comunicar sensibilidade. Mantenha o mix de componentes dolarizados (42%) constante e varie PTAX em saltos discretos.

| Cenário | PTAX | ΔBOM (pp) | Interpretação |
|---|---|---|---|
| Base | R$ 5,12 | 0,0 | Estado atual |
| Valorização −5% | R$ 4,86 | **−2,1 pp** | Redução de margem moderada |
| Valorização −10% | R$ 4,61 | **−4,2 pp** | Compressão da margem operacional |
| Valorização −20% | R$ 4,09 | **−8,4 pp** | Inviabiliza estrutura de preço sem repasse |
| Valorização −30% | R$ 3,58 | **−12,6 pp** | Prejuízo operacional direto |

**Regra de bolso:** cada 1% de valorização do BRL custa **0,42 pp** de margem bruta. Para VGV de R$ 30 bi/ano, isso é **R$ 63M por 1% de PTAX**.

**Limitação:** assume repasse de fornecedores ≤ 1,5 ciclos. Em stress agudo (≥ 20% PTAX), essa hipótese quebra.

**Output canônico:** [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html).

### §3.2 Monte Carlo probabilístico (10k paths × 6 meses)

Substitui determinismo por **distribuição**. Gera 10.000 trajetórias sintéticas de PTAX em 6 meses usando GARCH-t calibrado.

```python
n_paths = 10000
horizon = 126  # 6 meses em dias úteis
simulated_paths = result.forecast(horizon=horizon, method='simulation', simulations=n_paths)
```

**Resultado do D2 (10k paths × 6m):**

| Percentil | ΔBOM (pp) | Interpretação |
|---|---|---|
| **P5** (severo) | **−4,78** | Risco de cauda — 1 em 20 |
| P10 | −3,72 | Cenário adverso plausível |
| **P50** (mediana) | −0,15 | Calibração validada |
| P90 | +3,90 | Cenário favorável |
| **P95** (otimismo) | +5,19 | Reversão cambial forte |
| **Prob. (ΔBOM < 0)** | **53,6%** | Mais provável perder do que ganhar |

> **Visualização canônica:** [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) (105 KB — Plotly interativo).

### §3.3 VaR e CVaR (as duas métricas de risco)

**VaR 95% = R$ 6,43 bi** (refresh jul/2026).

**CVaR 95% = R$ 8,04 bi** (refresh jul/2026).

**Interpretação operacional:**

- **VaR:** "existe 5% de chance de a perda ultrapassar R$ 6,43 bi em 6 meses".
- **CVaR:** "se passar do VaR, a perda média esperada é R$ 8,04 bi".

A diferença CVaR-VaR (R$ 1,61 bi) é a "espessura da cauda" — o que está além do percentil.

### §3.4 A discrepância VaR refresh vs VaR v2.0.1

Aqui está uma fonte de confusão importante. O **VaR mudou** entre refresh e v2.0.1:

| Versão | VaR 95% | CVaR 95% | Fonte |
|---|---|---|---|
| **Refresh jul/2026** (MC simples, GARCH-t, 1 shock) | **R$ 6,43 bi** | **R$ 8,04 bi** | [`L2.2`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) |
| **v2.0.1 ago/2026** (MC 4-shock tornado) | **R$ 8,21 bi** | **R$ 10,14 bi** | D3 v2.0.1 (parC Multivariate Sensitivity Summary) |

**Por que discrepam?**

A v2.0.1 usa **MC multivariado com 4 choques correlacionados** (PTAX + lítio + tariff + demanda EV) via **decomposição de Cholesky** (ρ FX-Supply = 0,4). O refresh jul/2026 era só câmbio. Ao adicionar mais choques correlacionados, o VaR aumenta — porque choques simultâneos têm impacto combinado maior.

**Qual usar?**

- Para risco cambial **puro**: VaR R$ 6,43 bi (refresh).
- Para risco **composto** (cenário 4-shock): VaR R$ 8,21 bi (v2.0.1).

### §3.5 O tornado plot (sensibilidade por fator)

Em v2.0.1, o tornado identifica **qual fator mais contribui** para o VaR total:

| Fator | Weight | Vol anual | Contribuição VaR (R$ bi) | % do VaR |
|---|---|---|---|---|
| **Tariff (S10)** | 0,10 | 25% | **2,38** | **29%** |
| FX (S1) | 0,15 | 18% | 1,85 | 22,5% |
| Supply (S2) | 0,15 | 22% | 1,48 | 18% |
| BNDES (S3) | 0,15 | 30% | 1,15 | 14% |
| Ramp (S8) | 0,12 | 20% | 0,82 | 10% |
| Competition (S11) | 0,12 | 15% | 0,62 | 7,5% |
| Demand (S9) | 0,10 | 12% | 0,25 | 3% |
| Macro (S6) | 0,05 | 10% | 0,18 | 2% |
| ESG (S7) | 0,05 | 35% (binary) | 0,41 | 5% |
| Pricing (S4) | 0,05 | 8% | 0,15 | 2% |

> **Insight contraintuitivo:** tariff é o **maior** contributor (29%) — não FX como a intuição sugere. Isso muda a priorização de ações.

---

## §4. As 5 armadilhas clássicas do L2

### §4.1 Esquecer de validar se o GARCH "realmente cabe"

Sempre cheque: α+β < 1 (estacionariedade), ARCH-LM nos resíduos (sem ARCH residual), normality test.

### §4.2 Usar VaR paramétrico Normal em séries com fat tails

PTAX tem kurt=4,88. VaR Normal **subestima** em 30-50%. Use sempre GARCH-t ou EVT.

### §4.3 Confundir stress test determinístico com MC

Stress test = "se X, quanto custa". MC = "qual a probabilidade de X e quanto custa em média". São complementares.

### §4.4 Esquecer a correlação entre choques em MC multivariado

Cholesky com ρ=0,4 entre FX-Supply **amplifica** o impacto conjunto (não soma). Use matriz de covariância empírica.

### §4.5 Não recalibrar trimestralmente

GARCH é calibrado em janelas rolantes. Após eventos extremos (election, lítio spike), os parâmetros mudam. Recalibre a cada 30-90 dias.

---

## §5. Quiz de auto-avaliação L2

- [ ] Sei a **evolução ARCH → GARCH → GJR → EGARCH** e quando cada uma é útil.
- [ ] Sei dizer o que **α = 0,0488, β = 0,9418, ν = 6,99** significam para o PTAX.
- [ ] Sei explicar **half-life = 73,3 dias** e por que hedge deve ser estrutural.
- [ ] Sei a diferença entre **stress test determinístico e MC probabilístico**.
- [ ] Sei citar **VaR refresh R$ 6,43 bi vs v2.0.1 R$ 8,21 bi** e explicar a discrepância.
- [ ] Sei por que **tariff é o maior contributor VaR (29%)** — não FX.
- [ ] Sei o que é **CVaR** e por que é ≥ VaR sempre.
- [ ] Sei dizer o que é **Cholesky decomposition** e por que ρ=0,4 importa.
- [ ] Sei o que é **VaR 95% empírico** vs **VaR paramétrico**.
- [ ] Sei por que **GARCH-t é melhor que GARCH-Normal** para PTAX.

Se 8/10+: pronto para L3 (prescritiva).

---

## §6. Exercícios práticos (do 99-LAB-EXERCISES)

### §6.1 Exercício 7 — Fit GARCH(1,1)-t em PTAX

```python
import pandas as pd
import numpy as np
from arch import arch_model

# Carregar PTAX
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados?formato=json&dataInicial=01/01/2020&dataFinal=17/07/2026"
ptax = pd.DataFrame(requests.get(url).json())
ptax['data'] = pd.to_datetime(ptax['data'], format='%d/%m/%Y')
ptax['valor'] = ptax['valor'].astype(float)
ptax = ptax.set_index('data')['valor'].sort_index()

# Log-retorno
log_ret = np.log(ptax / ptax.shift(1)).dropna() * 100  # em %

# Fit GARCH(1,1) Student-t
model = arch_model(log_ret, mean='Constant', vol='GARCH', p=1, q=1, dist='t')
result = model.fit(disp='off')
print(result.summary())

# Perguntas:
# - Qual é α e β?
# - Qual é ν (Student-t df)?
# - α + β < 1? (estacionário?)
# - Calcule half-life: half_life = log(0.5) / log(α + β)
```

### §6.2 Exercício 8 — MC stress test

```python
# Simular 10k paths × 126 dias (6 meses)
sim = result.forecast(horizon=126, method='simulation', simulations=10000)

# Extrair paths finais
paths = sim.simulations.values  # shape (1, 126, 10000)

# Calcular percentis de impacto BOM
bom_impact = (paths[0].T / 100) * 0.42  # 42% importado share
p5 = np.percentile(bom_impact, 5)
p50 = np.percentile(bom_impact, 50)
p95 = np.percentile(bom_impact, 95)

print(f"P5: {p5:.4f} pp BOM")
print(f"P50: {p50:.4f} pp BOM")
print(f"P95: {p95:.4f} pp BOM")

# Compare com VaR refresh oficial:
# P5 = -4.78 pp BOM ≈ VaR 95% empírico
```

---

## §7. Mapa de saída — onde ir depois de L2

Quando terminar L2, escolha sua trilha:

### §7.1 Se você quer ir para **decisão executiva**

→ [**Nota-Meta D2 #05 — L3 Análise Prescritiva**](./NOTA-META-D2-05-L3-PRESCRITIVA.md) (matrizes de decisão, trigger matrix, RACI).

### §7.2 Se você quer ir para **comunicação Conselho**

→ L4 (comunicação, dashboards, gap modelo-humano).

### §7.3 Se você quer **exercícios hands-on avançados**

→ [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md).

---

## §8. Recursos auxiliares para L2

### §8.1 Docs canônicos

- [`L2.0-arquitetura-modelagem.md`](../../d2-econometric-vulnerability/_study_notes/L2.0-arquitetura-modelagem.md) — pipeline 6 etapas (27 KB, 599 linhas).
- [`L2.1-modelos-vol-garch-gjr.md`](../../d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md) — ARCH/GARCH/GJR/EGARCH (32 KB, 798 linhas).
- [`L2.2-cambio-stress-test-monte-carlo.md`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) — stress test + MC (32 KB, 836 linhas).

### §8.2 Outputs canônicos

- [`cambio-stress-test.html`](../../d2-econometric-vulnerability/outputs/cambio-stress-test.html) — stress test determinístico (8.6 KB).
- [`cambio-monte-carlo.html`](../../d2-econometric-vulnerability/outputs/cambio-monte-carlo.html) — MC 10k paths (105 KB).
- [`cap1_ptax_historia.png`](../../d2-econometric-vulnerability/outputs/cap1_ptax_historia.png) — série PTAX história (260 KB).
- [`cap1b_volatility.png`](../../d2-econometric-vulnerability/outputs/cap1b_volatility.png) — vol 30d/90d (208 KB).
- [`cap15_monte_carlo.png`](../../d2-econometric-vulnerability/outputs/cap15_monte_carlo.png) — histograma MC (674 KB).

### §8.3 Notebooks para L2

- [`NB-01-ptax-garch.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) — entrada PTAX + GARCH.
- [`NB-06-monte-carlo-multivariado.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-06-monte-carlo-multivariado/nb-06-monte-carlo-multivariado.ipynb) — MC multivariado 4-shock.

### §8.4 Saídas de sensitivity (sensitivity-monte-carlo-bom.html, etc.)

- [`sensitivity-monte-carlo-bom.html`](../../d2-econometric-vulnerability/outputs/sensitivity-monte-carlo-bom.html) — sensitivity MC do BOM.
- [`sensitivity-ptax-imp-share.html`](../../d2-econometric-vulnerability/outputs/sensitivity-ptax-imp-share.html) — sensitivity de PTAX × import share.
- [`sensitivity-scenario-tornado.html`](../../d2-econometric-vulnerability/outputs/sensitivity-scenario-tornado.html) — tornado de cenários.

---

## §9. Takeaways em 5 bullets (para fixar)

1. **Modele log-retornos, não PTAX em nível.** Estacionariedade + aditividade temporal + propriedades estatísticas superiores.

2. **GARCH(1,1)-t com α=0,0488, β=0,9418, ν=6,99.** β alto = vol persistente (94% se carrega para o dia seguinte). ν baixo = cauda pesada (use t-Student, não Normal).

3. **VaR refresh R$ 6,43 bi vs VaR v2.0.1 R$ 8,21 bi.** Diferença = MC multivariado 4-shock (Cholesky) vs MC simples 1-shock. v2.0.1 é o número operacional atual.

4. **Tariff é o maior contributor VaR (29%), não FX.** Contraintuitivo — mas o tornado mostra. Muda priorização de ações.

5. **Stress test determinístico ≠ MC.** Stress test = "se X, quanto custa". MC = "qual probabilidade de X". São complementares.

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado do Layer L2.*
*Próxima: [Nota-Meta D2 #05 — L3 Análise Prescritiva](./NOTA-META-D2-05-L3-PRESCRITIVA.md).*