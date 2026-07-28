# 📐 GLOSSÁRIO — Fórmulas Cross-Base (D2 + D3)

> **Single source of truth** para todas as fórmulas matemáticas usadas no case study BYD Camaçari 2025–2027
> **Data**: 27/jul/2026 · **Audiência**: engenheiro júnior/pleno/sênior consultando antes de modelar
> **Cobertura**: ~60 fórmulas, agrupadas por **categoria funcional** (não alfabética), cross-ref D2 + D3
> **Diferencial vs `ZZ-glossario-formulas.md`**: este aqui é **cross-base** (D2 + D3), enquanto o ZZ é só D2 focado em métricas

---

## §1. Por que este glossário

Existem **três fontes de fórmulas** no projeto:

1. **`d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md`** — glossário D2 (55 verbetes alfabéticos, foco em métricas de mercado)
2. **`d2-econometric-vulnerability/_study_notes/L0.*`** — fundamentos matemáticos com 14 métricas explicadas em profundidade
3. **Este `GLOSSARIO.md`** — glossário **cross-base** (D2 + D3) agrupado por **categoria funcional**

Quando você está modelando e quer lembrar a fórmula exata de **CVaR sob t-Student** (risco) ou do **composite score** (decisão) ou do **HHI** (concentração), este é o lugar. Cada verbete traz: símbolo · unidades · fórmula LaTeX · exemplo numérico do projeto (se aplicável) · cross-ref para doc que explica em profundidade.

---

## §2. Convenções (símbolos, unidades, notação)

| Símbolo | Significado | Onde aparece |
|---|---|---|
| $P_t$ | Preço no tempo $t$ (PTAX em R$/USD) | Séries temporais |
| $r_t$, $\ell_t$ | Retorno aritmético / log-retorno | L0, L1, L2, D3 |
| $\mu$, $\sigma$, $\sigma^2$ | Média / desvio-padrão / variância | Todas |
| $\sigma_t$ | Vol condicional (GARCH) | L2.1 |
| $\varepsilon_t$ | Resíduo / choque | L1, L2, D3 |
| $\alpha$, $\beta$, $\omega$, $\gamma$ | Coeficientes de modelo | GARCH, regressão |
| $\nu$ | Graus de liberdade (t-Student) | L2, L3 |
| $\rho$ | Correlação de Pearson | L1, L3 |
| $\tau$, $h$ | Defasagem / horizonte | ACF, half-life |
| $z_\alpha$ | Quantil da Normal padrão | VaR |
| $V$, $N$, $T$ | Valor exposto / amostra / horizonte (anos) | VaR, NPV |
| $w_i$ | Peso (composite, RACI) | D3 |
| $s_i$ | Score de dimensão S_i | D3 |
| $\Sigma$ | Matriz de covariância | D3, L2.2 |
| $L$ | Fator de Cholesky ($\Sigma = LL^T$) | L2.2 |

**Unidades padrão do projeto**: VaR/NPV em **R$ milhões** ou **R$ bilhões**; volatilidade em **% a.a.**; retornos em **%**; correlações em $[-1, +1]$; HHI adimensional em $[0, 10.000]$; composite em $[0, 100]$.

---

## §3. Análise exploratória (média, variância, momentos, percentis) — 8 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 3.1 | Média aritmética | $\mu = \frac{1}{N}\sum x_i$ | $\bar{P}_{\text{PTAX}} \approx R\$\,5.08$ | L0.2 §2, L1.0, ZZ |
| 3.2 | Mediana | $\text{med}(X) = \text{valor central ordenada}$ | Med(PTAX) ≈ R$ 5,05 | L0.2 §3, L1.0 |
| 3.3 | Variância amostral | $\sigma^2 = \frac{1}{N-1}\sum (x_i - \bar{x})^2$ | $\sigma^2(\ell_t) \approx 0{,}000031$ | L0.2 §4, ZZ |
| 3.4 | Desvio-padrão | $\sigma = \sqrt{\sigma^2}$ | $\sigma_{\text{daily}} \approx 0{,}89\%$ | L0.2 §4 |
| 3.5 | Skewness | $\text{Skew} = \mathbb{E}[(X-\mu)^3]/\sigma^3$ | PTAX ≈ $-0{,}3$ (cauda esquerda) | L0.2 §5, L1.0, L6.0, ZZ |
| 3.6 | Kurtosis excesso | $\text{Kurt}_{\text{ex}} = \mathbb{E}[(X-\mu)^4]/\sigma^4 - 3$ | PTAX ≈ $+5{,}2$ (fat tails) | L0.2 §5, L1.0, ZZ |
| 3.7 | IQR | $\text{IQR} = Q_3 - Q_1$ | IQR$(\ell_t) \approx 0{,}8\%$ | L0.2 §6, L1.0 §8, ZZ |
| 3.8 | Quantil $q_\alpha$ | $q_\alpha = \inf\{x : F(x) \geq \alpha\}$ | $q_{0{,}05}(\text{PTAX}) = -1{,}5\%$ | L0.2 §6, L0.3, ZZ |

---

## §4. Time series (ACF, PACF, estacionariedade, retornos) — 8 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 4.1 | Log-retorno | $\ell_t = \ln(P_t/P_{t-1})$ | $\ln(5{,}46/5{,}20) = +4{,}88\%$ | L0.0, L0.2 §7, L1.0 §3, L2.1, 99-LAB Ex1, ZZ |
| 4.2 | Vol anualizada | $\sigma_{\text{ann}} = \sigma_{\text{daily}} \sqrt{252}$ | $0{,}89\% \cdot \sqrt{252} \approx 14{,}19\%$ | L0.0, L0.2, L1.0, L2.0, ZZ |
| 4.3 | Vol 6m | $\sigma_{6m} = \sigma_{\text{daily}} \sqrt{126}$ | $\approx 9{,}98\%$ | L2.0 |
| 4.4 | ACF$(\tau)$ | $\text{Cov}(X_t, X_{t+\tau})/\sigma^2 \in [-1,1]$ | ACF(1) PTAX $\approx -0{,}04$ | L0.2, L1.0 §6, L2.0, ZZ |
| 4.5 | PACF$(\tau)$ | $\text{Cor}(X_t, X_{t+\tau} \mid X_{t+1..t+\tau-1})$ | PACF(1) $\approx 0$ | L1.0 §6, ZZ |
| 4.6 | ADF | $\Delta y_t = \mu + \phi y_{t-1} + \sum \psi_i \Delta y_{t-i} + \varepsilon_t$ | PTAX rejeita $H_0$ (estacionário) | L0.0, L1.0 §9, L2.0, ZZ |
| 4.7 | KPSS | $\sum S_t^2/\hat{\sigma}^2$, $S_t=\sum \hat{\varepsilon}_i$ | complementar ao ADF | L0.0, L1.0, ZZ |
| 4.8 | STL decomposition | $X_t = T_t + S_t + R_t$ | PTAX sem sazonalidade mensal forte | L1.0 §10, L6.2 |

---

## §5. Volatilidade (ARCH, GARCH, GJR, EGARCH, half-life) — 6 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 5.1 | ARCH(1) | $\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2$ | rejeitado (baixa persistência) | L2.1 §2, ZZ |
| 5.2 | **GARCH(1,1)** ⭐ | $\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2$ | $\omega=0{,}452$, $\alpha=0{,}0488$, $\beta=0{,}9418$ | L0.0, L2.0, L2.1 §3, L5.0, 99-LAB Ex4, ZZ |
| 5.3 | GJR-GARCH | $\sigma_t^2 = \omega + \alpha \varepsilon^2 + \gamma \varepsilon^2 \mathbb{I}_{\varepsilon<0} + \beta \sigma^2$ | $\gamma \approx 0{,}04$ (modelo final) | L2.1 §4, ZZ |
| 5.4 | EGARCH | $\ln \sigma_t^2 = \omega + \alpha(|z|-\mathbb{E}|z|) + \gamma z + \beta \ln \sigma^2$ | testado, GJR venceu por AIC | L2.1 §5, ZZ |
| 5.5 | Half-life | $h = \ln(0{,}5)/\ln(\alpha+\beta)$ | $\approx 73{,}3$ d.u. (~3,5 meses) | L0.0, L2.1 §6, ZZ |
| 5.6 | Hull-White damping | $\sigma_{HW,t} = \sqrt{\theta \sigma_{t-1}^2 + (1-\theta) r_t^2}$ | $\theta \approx 0{,}94$ (peso efetivo ≈ 16 d) | L2.1 §7, ZZ |

---

## §6. Risco (VaR, CVaR, ES, Kupiec, Christoffersen, PIT) — 10 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 6.1 | VaR paramétrico | $\text{VaR}_\alpha = V(\exp(z_\alpha \sigma \sqrt{T}) - 1)$ | $V=25\text{bi}$, $\sigma=14\%$ → R$ 5,8 bi | L0.0, L2.0, L2.2, ZZ |
| 6.2 | VaR histórico | $\text{VaR}_\alpha^{\text{hist}} = -q_{1-\alpha}(\{r_t\})$ | VaR 95% hist BOM ≈ $-4{,}5\%$ | L0.0, L2.0, L2.2, ZZ |
| 6.3 | VaR Cornish-Fisher | $\mu + \sigma[z_\alpha + (z_\alpha^2-1)s/6 + (z_\alpha^3-3z_\alpha)(k-3)/24]$ | CF 95% = $-5{,}1\%$ vs Normal $-3{,}8\%$ | L0.0, L2.2, ZZ |
| 6.4 | CVaR / ES | $\mathbb{E}[L \mid L > \text{VaR}_\alpha]$ | CVaR 95% BOM ≈ $-6{,}8$ pp | L0.0, L2.0, L2.2, L6.0, ZZ, 98-LAB Ex10 |
| 6.5 | Stress test | $\Delta V = V(\exp(-z_\alpha \sigma \sqrt{T}) - 1)$ | stress -30% PTAX → $\Delta V = -R\$\,1{,}8$ bi | L2.2, L3.0, ZZ |
| 6.6 | VaR 4-shock (D3) | $q_{0{,}95}(\Delta V_{\text{FX}} + \Delta V_{\text{lítio}} + \Delta V_{\text{tarifa}} + \Delta V_{\text{demanda}})$ | **R$ 8,21 bi** (MC Cholesky 4×4, 10k) | L2.2, D3-0.0 §7, D3-0.3 |
| 6.7 | Kupiec LR | $-2\ln[(1-p)^{n-x} p^x / ((1-\alpha)^{n-x} \alpha^x)]$ | VaR 95% 500 obs, 27 violações → LR ≈ 0,18 | L5.0, 99-LAB Ex6, ZZ |
| 6.8 | Christoffersen LRcc | $\text{LR}_{uc} + \text{LR}_{ind}$ | valida independência VaR 95% | L5.0, ZZ |
| 6.9 | PIT | $u_t = F(y_t; \theta) \sim U(0,1)$ | valida calibração GARCH-t | L2.1, L3.0, L5.0, ZZ |
| 6.10 | Marginal/Conditional VaR | $\rho_i \sigma_i V$ / $\partial\text{VaR}/\partial V_i$ | S10 (tarifa) #1 contribuidor (29%, R$ 2,38bi) | L6.0, D3-0.3 |

---

## §7. Cauda extrema (GEV, GPD, EVT, POT) — 6 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 7.1 | GEV PDF | $f(x;\xi,\mu,\sigma) = \frac{1}{\sigma}[1+\xi\frac{x-\mu}{\sigma}]^{-1/\xi-1}\exp\{-[1+\xi\frac{x-\mu}{\sigma}]^{-1/\xi}\}$ | ajusta PTAX max drawdowns | L6.0, ZZ |
| 7.2 | GEV CDF | $F(x) = \exp\{-[1+\xi\frac{x-\mu}{\sigma}]^{-1/\xi}\}$ | quantis de cauda extrema | L6.0, ZZ |
| 7.3 | GPD PDF | $f(x;\xi,\beta) = \frac{1}{\beta}(1+\xi\frac{x}{\beta})^{-1/\xi-1}$ | $\xi \approx 0{,}15$ (cauda pesada) | L6.0 §3, 99-LAB Ex7, ZZ |
| 7.4 | GPD CDF | $F(x) = 1 - (1+\xi\frac{x}{\beta})^{-1/\xi}$ | extrapola VaR acima threshold $u$ | L6.0 §3, ZZ |
| 7.5 | EVT VaR | $u + \frac{\beta}{\xi}[(\frac{N}{N_u}(1-\alpha))^{-\xi}-1]$ | EVT 99.5%=2.815%, 99.9%=3.773% | L6.0 §6, 99-LAB Ex7, 98-LAB Ex10 |
| 7.6 | EVT ES | $\text{VaR}_{\text{EVT}}/(1-\xi) + (\beta-\xi u)/(1-\xi)$ | ES 99.5%=3.411%, 99.9%=4.371% | L6.0 §6 |

---

## §8. Multivariado (Cholesky, correlação, MC) — 5 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 8.1 | Covariância | $\text{Cov}(X,Y) = \mathbb{E}[(X-\mu_X)(Y-\mu_Y)]$ | Cov(PTAX, IBOV) > 0 | L0.2, L1.0, L1.1, ZZ |
| 8.2 | Correlação Pearson | $\rho_{X,Y} = \text{Cov}(X,Y)/(\sigma_X \sigma_Y) \in [-1,1]$ | $\rho(\text{PTAX}, \text{déficit auto}) \approx +0{,}62$ | L1.0, L1.1, ZZ |
| 8.3 | Cholesky | $L = \text{chol}(\Sigma)$ tal que $\Sigma = LL^T$ | matriz 4×4 (PTAX, óleo, déficit, IBOV) → 10k cenários | L2.0, L2.2, 99-LAB Ex5, ZZ |
| 8.4 | Monte Carlo | $\bar{x}_N = \frac{1}{N}\sum f(\mathbf{z}_i)$, erro $\sigma/\sqrt{N}$ | 10k paths × 4 choques → VaR = R$ 6,43 bi | L2.2, L3.0, 99-LAB Ex5, ZZ |
| 8.5 | HHI | $\sum_i s_i^2 \times 10{,}000$ (>2.500 = concentrado) | bateria ≈ 4.850 | L0.0, L1.1, L6.0, ZZ |

---

## §9. Decisão (composite, VaR 4-shock, NPV, RACI, gates) — 10 fórmulas

| # | Nome | Fórmula | Exemplo D2/D3 | Refs |
|---|---|---|---|---|
| 9.1 | Composite score | $\text{composite} = \sum_{i=1}^{11} w_i s_i$, $\sum w_i = 1{,}00$ | $s_i = 50/70/85/95$ · composite = **71,8** | L0.1, L3.0, L5.1, D3-0.0 |
| 9.2 | Composite v2.1 renorm. | $\frac{1}{1{,}15}\sum_{i=1}^{12} w_i^{\text{v0.6}} s_i$ | corrigido ≈ 74,2 | D3-0.0 §3.2 |
| 9.3 | Macro multiplier | $m_{\text{macro}} \in \{1{,}0\times, 1{,}5\times, 2{,}0\times\}$ | AMBER=1.5×, RED=2.0× | D3-0.0 §5, D3-INTERDEPENDENCY-S6 |
| 9.4 | Cluster de risco | $\text{composite}<60$ OK · $60{-}75$ ATENÇÃO · $75{-}88$ TENSÃO · $\geq 88$ CRISE | composite = 71,8 → cluster 2 | D3-0.0 §4.3, L3.0 |
| 9.5 | NPV | $\sum_{t=0}^T \text{FC}_t/(1+r)^t$ | base R$ 4,8 bi; stress -R$ 2,1 bi | L0.0, L3.0, L4.0, D3-0.3, ZZ |
| 9.6 | NPV live layer | $f(\sigma_{\text{PTAX}}, \sigma_{\text{lítio}}, \sigma_{\text{tarifa}}, \text{demanda})$ | PTAX 4×/dia · composite ≤ 1h | D3-NPV-LAYER-SPEC, D3-0.3 §2 |
| 9.7 | ROI | $\text{NPV}_{\text{presc}}/\text{Cost}_{\text{presc}}$ | hedge=159%, supply=247%, def=213% | D3-0.3 §3 |
| 9.8 | RACI | $\text{Decisão}_j = f(R_j, A_j, C_j, I_j)$ | 17 personas · 39 ações · 663 atribuições | L3.2, D3-0.2 |
| 9.9 | Approval gates | aprovado se value $\leq$ threshold$_k$ | 8 gates: 1M/10M/100M/280M/500M/800M+ | D3-0.1 §5, D3-0.2 §3 |
| 9.10 | Trigger score | $\text{sev}_j = \text{cond}_j \wedge \text{thresh}_j \wedge \text{cooldown}_j$ | 30+ v2.0.1 + 15 v2.1 = 45 totais | L3.1, D3-0.2 §4 |

---

## §10. Estatística geral (t-test, χ², F, KS, Ljung-Box, ARCH-LM) — 6 fórmulas

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 10.1 | t-test | $t = (\bar{x}-\mu_0)/(s/\sqrt{n})$, df=$n-1$ | σ PTAX ≠ 14% → não rejeita | L0.2, L1.0, L5.0, ZZ |
| 10.2 | χ² | $\sum (O_i - E_i)^2/E_i$ | Kupiec/Christoffersen usam χ² | L0.3, L5.0, ZZ |
| 10.3 | F-test | $F = (\chi_1^2/\nu_1)/(\chi_2^2/\nu_2)$ | ARCH-LM Engle usa F | L0.3, L2.1 |
| 10.4 | Kolmogorov-Smirnov | $D = \sup_x |F_{\text{emp}}(x) - F_{\text{teo}}(x)|$ | PTAX vs t-Student(ν=6,99) → não rejeita | L0.3, L2.1, L5.0, ZZ |
| 10.5 | Ljung-Box Q | $Q = n(n+2)\sum_{k=1}^h \rho^2(k)/(n-k)$ | $Q(20)$ resíduos GARCH ≈ 18 (ok) | L1.0, L2.0, L2.1, L5.0, ZZ |
| 10.6 | ARCH-LM | $n \cdot R^2 \sim \chi^2_p$ | confirma heterocedasticidade em PTAX | L2.1 §3 |

---

## §11. Outras fórmulas complementares (4 fórmulas)

| # | Nome | Fórmula | Exemplo D2 | Refs |
|---|---|---|---|---|
| 11.1 | Sharpe | $(\mathbb{E}[R] - R_f)/\sigma_R$ | avaliar hedge cambial | L0.0, L4.0, ZZ |
| 11.2 | Information Ratio | $(\bar{R}_p - \bar{R}_b)/\sigma(R_p - R_b)$ | IR hedge cambial ≈ 0,8 | L0.0, L4.0 |
| 11.3 | Tracking Error | $\sigma(R_p - R_b)$ | TE hedge ≈ 3% a.a. | L0.0, L4.0 |
| 11.4 | Max Drawdown (MDD) | $\max_t(1 - P_t/\max_{s<t} P_s)$ | MDD PTAX ≈ $-22\%$ (COVID) | L0.0, L1.0, ZZ |

---

## §12. Cross-refs: onde cada fórmula é explicada em profundidade

| Categoria | Fórmula principal | Onde é explicada em profundidade |
|---|---|---|
| Análise exploratória | Média, σ, skew, kurt, IQR, quantil | L0.2 §1-7, L1.0 §1, ZZ |
| Time series | Log-retorno, ACF, ADF, KPSS | L0.0, L1.0 §6-9, L2.0 |
| Volatilidade | GARCH(1,1), GJR, EGARCH, half-life | L2.1 §2-7, L0.0 |
| Risco | VaR, CVaR, Kupiec, Christoffersen | L2.2 §1-5, L5.0, L6.0 |
| Cauda extrema | GEV, GPD, EVT | L6.0 §1-6, 99-LAB Ex7, 98-LAB Ex10 |
| Multivariado | Cholesky, MC, correlação, HHI | L2.2 §3, L2.0, L1.1 |
| Decisão | Composite, NPV, RACI, gates, triggers | L3.0, L3.1, L3.2, D3-0.0/0.1/0.2/0.3 |
| Estatística geral | t, χ², F, KS, Ljung-Box | L0.3, L2.0, L2.1, L5.0 |
| Outras | Sharpe, IR, TE, MDD | L0.0, L4.0 |

---

## §13. Números canônicos consolidados (single source of truth)

**Mesmos números fluindo entre D2 + D3 + labs + relatórios.**

### §13.1 PTAX σ (vol anualizada)

| Valor | Contexto | Onde aparece |
|---|---|---|
| **14,19%** | D2 v1 (1.642 obs) | L0.0, L1.0, L2.0, 99-LAB |
| **14,41%** | D2 v2 refresh (2.778 obs, 11 anos) | README, L1.0 |
| **14,86%** | BCB SGS 10813 empírica | README, L2.2, D3-RECALIBRATION |
| **11,2%** | BCB PTAX real 10y (D3) | D3-RECALIBRATION |

### §13.2 VaR 95% 6m (R$ bi)

| Valor | Método | Onde aparece |
|---|---|---|
| **R$ 2,10 bi** | Empírico (D2 v1) | AA, L2.0, L2.1, L2.2, 99-LAB |
| **R$ 6,43 bi** | MC refresh (D2 v2.1) | L2.2, README, 00-SUMMARY |
| **R$ 8,21 bi** | MC 4-shock (D3 v2.0.1) | L3.0, L3.1, L3.2, L4.0, L4.2, README |
| **2,815%** retorno | EVT 99.5% (GPD) | L6.0 |
| **3,773%** retorno | EVT 99.9% (GPD) | L6.0 |

### §13.3 CVaR 95% 6m (R$ bi)

| Valor | Método | Onde aparece |
|---|---|---|
| **R$ 8,04 bi** | MC refresh (D2 v2.1) | L2.2, README |
| **R$ 10,14 bi** | MC 4-shock (D3 v2.0.1) | L3.0, L3.1, L3.2, L4.0, README |
| **R$ 1,44 bi** | Histórico (D2 v1) | L2.2 |
| **3,411%** retorno | EVT 99.5% (GPD ES) | L6.0 |
| **4,371%** retorno | EVT 99.9% (GPD ES) | L6.0 |

### §13.4 GARCH(1,1)-t (parâmetros)

$\alpha = \mathbf{0{,}0488}$ · $\beta = \mathbf{0{,}9418}$ · $\alpha + \beta = \mathbf{0{,}9906}$ · $\nu = \mathbf{6{,}99}$ · half-life = **73,3 d.u.** · leverage $\gamma \approx \mathbf{0{,}04}$. *Refs: L2.1 §3, L5.1, 99-LAB Ex4.*

### §13.5 Composite D2 (v0.6)

| Componente | Peso | Contribuição |
|---|---|---|
| Câmbio (S1) | 30% | 21,3 pp |
| Supply (S2) | 20% | 14,4 pp |
| Regulatório (S3) | 30% | 28,7 pp |
| Competitivo (S4) | 20% | 7,4 pp |
| **Composite total** | 100% | **71,8 / 100** (cluster TENSÃO sustained) |

### §13.6 HHI (concentração fornecedores)

Bateria LFP = **4.850** (altamente concentrada) · Powertrain = **3.400** (concentrada) · Semicondutores = **2.925** (moderada-alta).

### §13.7 Trade balance mensal (média 2015-2025)

Saldo médio = **-US$ 399,83M** · Exports = US$ 264,34M · Imports = US$ 664,16M · $\rho(\text{PTAX}, \text{saldo}) \approx -0{,}5$.

### §13.8 Stress events (backtesting 5/5 PERFEITO)

| Evento | Período | Vol | Cum Change |
|---|---|---|---|
| COVID-19 | 2020-03 a 2020-12 | **21,8%** | +15,6% |
| Semicondutor | 2021-Q1 | 17,0% | (est.) |
| Election 2022 | 2022-08 a 2022-11 | 18,0% | +2,6% |
| Lítio spike | 2022-Q2 | 19,5% | (est.) |
| Election 2024 | 2024-08 a 2024-11 | 12,6% | +6,8% |
| Stagflação 2025 | 2025-01 a 2025-12 | **10,3%** | **-11,4%** |

### §13.9 Framework D3 (v2.0.1)

**11 dimensões** (S1–S11) + S12 proposta · **5 couplings originais** + 8 drill-downs = 20 · **17 personas** · **30+ triggers** v2.0.1 + 15 v2.1 = 45 · **8 approval gates** (G1–G8) · **39 ações** · **Investment 365d** = R$ 1,68 bi · **E[NPV 3a]** = R$ 3,24 bi · **NPV base** = R$ 5,4 bi · **NPV adverso** = R$ 7,05 bi (mitigado) · **NPV stress severo** = R$ 2-3 bi (pause fase 2).

---

## §14. Constantes estatísticas (referência rápida)

| Símbolo | Valor | Uso |
|---|---|---|
| $\pi$ | 3,14159 | PDFs gaussianas |
| $e$ | 2,71828 | log-retorno, exp |
| $\gamma$ (Euler-Mascheroni) | 0,5772 | Aproximações assintóticas |
| $\Gamma(1/2)$ | $\sqrt{\pi}$ | t-Student |
| $\sqrt{252}$ | 15,875 | Anualização (d.u.) |
| $\sqrt{126}$ | 11,225 | 6 meses |
| $\sqrt{21}$ | 4,583 | 1 mês |

### Quantis da Normal padrão $z_\alpha$

| $\alpha$ | $z_\alpha$ | Uso |
|---|---|---|
| 90% | 1,282 | Margem 90% |
| 95% | **1,645** | **VaR 95%** |
| 97,5% | 1,960 | IC 95% |
| 99% | 2,326 | VaR 99% |
| 99,5% | 2,576 | Basileia |
| 99,9% | 3,090 | Cauda extrema |

---

## §15. Como usar este glossário

1. **Modelando?** Vá direto para §5 (volatilidade) ou §6 (risco). L2.1 (GARCH) é o coração.
2. **Calculando VaR?** §6 cobre paramétrico (§6.1), histórico (§6.2), CF (§6.3), 4-shock (§6.6).
3. **Apresentando ao Conselho?** §13 traz todos os números canônicos consolidados; §9 (decisão) explica composite + RACI + gates.
4. **Travou em fórmula?** Busque por categoria (§3-§11) — agrupamento funcional é mais rápido que alfabético.
5. **Precisa de explicação em profundidade?** Vá para a cross-ref em §12, depois para o doc L0–L6 ou D3-0.X correspondente.
6. **Auditando números?** §13 é single source of truth — qualquer divergência entre docs deve ser justificada.

---

> **Versão**: 1.0 — GLOSSARIO cross-base
> **Data**: 27/jul/2026
> **Status**: ✅ **CONCLUÍDO**
> **Mantenedor**: ao adicionar fórmula nova em D2/D3, registre aqui + atualizar §13 se for número canônico.
> **Próxima revisão**: trimestral (out/2026)

> **Para navegar a partir daqui**:
> - Sumário agregador → `WRAP-UP-ESTUDO-D2-D3.md`
> - Timeline + métricas → `PROGRESS.md` (este dir)
> - Glossário D2 focado em métricas → `d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md`
> - Base exploratória → `d2-econometric-vulnerability/_study_notes/00-INDEX.md`
> - Base decisória → `analise-prescritiva/reports/decision-framework/_study_notes_d3/README.md`
