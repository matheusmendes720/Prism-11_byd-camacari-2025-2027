# L2 · Hypothesis Testing for Executives

**Concept → Intuition → Math → Code → Executive Takeaway**

---

## WHY This Matters

Every business decision is a hypothesis: "If we do X, Y will happen." Understanding hypothesis testing lets you evaluate claims with data, distinguish signal from noise, and make decisions with confidence rather than intuition.

---

## CONCEPT: What Is a Hypothesis?

A hypothesis is a statement you want to test with data. In business:

- "Our new pricing strategy will increase revenue by 10%"
- "This supplier is more reliable than the alternative"
- "The marketing campaign drove more sales"

The key question: **Can we trust this claim, or is it just noise?**

---

## INTUITION: The Courtroom Analogy

Think of hypothesis testing like a courtroom:

1. **Null Hypothesis (H₀)** = The defendant is innocent (no effect)
2. **Alternative Hypothesis (H₁)** = The defendant is guilty (there is an effect)
3. **Evidence** = Your data
4. **Verdict** = Statistical decision

You start assuming innocence (H₀). Only with enough evidence do you convict (reject H₀).

**In business terms:**
- H₀: "Our changes made no difference"
- H₁: "Our changes actually worked"
- Evidence: The data we collected

---

## MATH: Key Formulas

### The Two Hypotheses

```
H₀: μ = μ₀        (no effect / status quo)
H₁: μ ≠ μ₀        (there is an effect)
```

### P-Value

The probability of seeing results this extreme **if H₀ were true**.

```
p-value < 0.05  →  Reject H₀  →  Statistically significant
p-value ≥ 0.05  →  Fail to reject H₀  →  Not significant
```

### Confidence Interval

The range where the true value likely falls:

```
95% CI = sample mean ± (1.96 × standard error)
```

### Types of Errors

| | Actual: No Effect | Actual: Effect Exists |
|---|---|---|
| **Decision: No Effect** | ✅ Correct | ❌ Type II (False Negative) |
| **Decision: Effect** | ❌ Type I (False Positive) | ✅ Correct |

---

## CODE: Hypothesis Testing in Python

```python
import numpy as np
from scipy import stats

# Example: Did BYD's market share actually change?
# Before: 12.8% | After campaign: 14.2%

before = np.array([12.5, 13.1, 12.2, 12.9, 13.0, 12.7, 12.4, 13.2])
after = np.array([14.1, 14.5, 13.8, 14.3, 13.9, 14.0, 14.4, 14.2])

# Two-sample t-test
t_stat, p_value = stats.ttest_ind(after, before)

print(f"T-statistic: {t_stat:.3f}")
print(f"P-value: {p_value:.6f}")
print(f"Significant at 5%? {'YES' if p_value < 0.05 else 'NO'}")
```

### Interpreting Results

```
T-statistic: 7.854
P-value: 0.000021
Significant at 5%? YES

→ We can reject the null hypothesis
→ The campaign DID increase market share
→ This result would happen by chance less than 0.002%
```

---

## Executive Takeaway

### 1. One Sentence Summary
Hypothesis testing is how we distinguish real business impacts from random variation — it tells us whether to trust a result or dismiss it as noise.

### 2. One Number to Remember
**0.05 (5%)** — The standard threshold. If p < 0.05, the result is statistically significant. If p ≥ 0.05, we can't rule out chance.

### 3. One Question to Ask Your Analytics Team
"What's is the p-value, and is it below 0.05?" — This shows you understand that statistical significance matters, not just the headline number.

---

## Common Business Applications

| Business Question | Test Type |
|------------------|-----------|
| Did sales increase after campaign? | Two-sample t-test |
| Is supplier A better than B? | Paired t-test |
| Are clicks different across 3 ad designs? | ANOVA |
| Is there a relationship between price and demand? | Correlation test |

---

## Red Flags to Watch

1. **No p-value reported** — Always ask for it
2. **"Significant" without the number** — Demand the actual p-value
3. **Small sample, big claims** — Less data = less reliable
4. **Multiple tests, one success** — If you test 20 things, one will be "significant" by chance

---

## Next Step

→ **L3: Linear Regression** — What if you want to predict outcomes, not just test differences?

---

*Part of the Executive Data Science Learning Progression*
*Links to: NB-02 Supply Chain, NB-08 Backtesting*
