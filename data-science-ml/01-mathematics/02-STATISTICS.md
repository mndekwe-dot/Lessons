# 02 — Statistics

**Weeks 7–8.** The most important file in this course.

Statistics is where ML judgment comes from. Everything else — models, frameworks,
deployment — is machinery. This is the part that tells you whether the number your
machinery produced means anything. If you shortchange one section of the whole
curriculum, do not let it be this one.

---

## Table of Contents

1. [Describing a distribution](#1-describing-a-distribution)
2. [Distributions worth recognising](#2-distributions-worth-recognising)
3. [The Central Limit Theorem — what it actually says](#3-the-central-limit-theorem--what-it-actually-says)
4. [Sampling and standard error](#4-sampling-and-standard-error)
5. [Hypothesis testing](#5-hypothesis-testing)
6. [Correlation](#6-correlation)
7. [Exercise 2](#exercise-2)

---

## 1. Describing a distribution

```python
df['grade'].describe()
```

**The mean is not the answer.** It is one summary, and it is the wrong one whenever
the distribution has a long tail.

You met this already in your system design guide, Chapter 17: p50 vs p99 latency. If 99
requests take 50 ms and one takes 5 seconds, the mean is 100 ms and looks fine, while
one user in a hundred is having a terrible time. **Exactly the same mathematics applies
to grades, income, class sizes, and every other real distribution.**

| Statistic | Use when |
|---|---|
| Mean | Roughly symmetric, no extreme tail |
| Median | Skewed, or outliers present |
| Mode | Categorical |
| Std dev | Symmetric; interpretable alongside a mean |
| IQR | Skewed; robust to outliers |

**Always plot before summarising.** Anscombe's quartet is four datasets with identical
means, variances, and correlations, and utterly different shapes:

```python
import seaborn as sns
sns.load_dataset('anscombe')     # plot all four. Look at what the numbers hid.
```

Do this once, early. It permanently changes how much you trust a summary statistic.

## 2. Distributions worth recognising

| Distribution | Shape | Where it shows up |
|---|---|---|
| **Normal** | Symmetric bell | Measurement error, sums of many small effects |
| **Log-normal** | Right-skewed | Income, response times, file sizes, revenue |
| **Binomial** | Counts of successes | Pass/fail out of n |
| **Poisson** | Counts per interval | Absences per term, arrivals per hour |
| **Power law** | Extreme right tail | Popularity, city sizes, word frequency |

**Most real data is not normal**, and assuming it is quietly breaks things. Response
times, incomes, and school sizes are log-normal — a mean of a log-normal is dominated
by the tail, and a "±2 standard deviations" interval will include negative values that
cannot exist.

For skewed positive data, model `log(x)` and remember to transform back.

## 3. The Central Limit Theorem — what it actually says

CLT says: **the distribution of the sample mean** approaches normal as sample size
grows, whatever the population's shape.

It does **not** say your data becomes normal. That misreading is everywhere.

Why it matters practically: it is why you can put a confidence interval on an average
even when the underlying data is wildly skewed.

## 4. Sampling and standard error

Almost always you have a sample, not the population, and you want to say something
about the population.

```
standard error = std / sqrt(n)
```

Note the `sqrt`. **To halve your uncertainty you need four times the data.** This is
the single most useful piece of arithmetic in applied statistics — it tells you, in
advance, whether collecting more data is worth it.

```python
import numpy as np
se = df['grade'].std(ddof=1) / np.sqrt(len(df))
ci = (df['grade'].mean() - 1.96 * se, df['grade'].mean() + 1.96 * se)
```

**What a 95% confidence interval means:** if you repeated the whole sampling procedure
many times, 95% of the intervals so constructed would contain the true value.

**What it does not mean:** "there is a 95% probability the true value is in *this*
interval." That is the Bayesian credible interval, which is a different thing. People
say the second and mean the first constantly; know the difference for interviews and
for your own honesty.

`ddof=1` matters: numpy defaults to the population standard deviation, pandas to the
sample one. Different answers on the same data.

## 5. Hypothesis testing

The machinery:

1. **Null hypothesis (H₀)** — the boring explanation. "The new teaching method makes
   no difference."
2. **Alternative (H₁)** — what you suspect.
3. Compute a test statistic and its **p-value**.
4. If p < α (usually 0.05), reject H₀.

```python
from scipy import stats

stats.ttest_ind(group_a, group_b)          # two independent group means
stats.ttest_rel(before, after)             # paired — same students, two times
stats.chi2_contingency(table)              # two categorical variables
stats.mannwhitneyu(a, b)                   # non-parametric; no normality assumption
```

### What a p-value is not

This matters more than the machinery, and it is asked in interviews:

> **p = P(data this extreme | H₀ is true)**

- It is **not** the probability that H₀ is true.
- It is **not** the probability your result is a fluke.
- It is **not** a measure of effect size. With n = 1,000,000 a meaningless 0.01%
  difference is "highly significant."

**Significance is not importance.** Always report the effect size next to the p-value.
A statistically significant 0.3% improvement in attendance is not worth changing a
school's timetable for.

### Two errors, and which one costs you

| | H₀ actually true | H₀ actually false |
|---|---|---|
| **Reject H₀** | Type I (false positive), rate α | correct |
| **Fail to reject** | correct | Type II (false negative), rate β |

**Power** = 1 − β = your chance of detecting a real effect. Underpowered studies are
the norm and they are why so many published findings do not replicate.

Decide which error is more expensive *for your problem* before you pick α. Flagging a
student as at-risk who is not (Type I) costs a conversation. Missing a student who is
(Type II) costs a child. Those are not symmetric, and 0.05 is a convention, not a law.

### Multiple comparisons

Test 20 hypotheses at α = 0.05 and you expect **one false positive by chance**. Test
every column in your DataFrame against the target and you will certainly find
"significant" nonsense.

```python
from statsmodels.stats.multitest import multipletests
reject, p_corrected, _, _ = multipletests(p_values, method='fdr_bh')
```

This is the same trap as trying twenty models and reporting the best test score. Both
are p-hacking; the second is just less obviously so.

## 6. Correlation

```python
df.corr(numeric_only=True)                 # Pearson — LINEAR relationships only
df.corr(method='spearman')                 # rank-based — any monotonic relationship
```

**Pearson only sees straight lines.** A perfect U-shaped relationship has a Pearson
correlation near zero. Always plot the scatter before believing an r.

**Correlation is not causation** — you know the phrase; the useful version is knowing
the three explanations for any observed correlation between A and B:

1. A causes B
2. B causes A
3. **Something else (a confounder) causes both** ← almost always the interesting one

Attendance correlates with grades. Does attending cause learning? Or does a stable home
cause both attendance and grades? The answer changes what intervention would work, and
the correlation alone cannot tell you.

**Simpson's paradox** is the sharpest version: a trend that holds in every subgroup can
reverse when the groups are pooled. Always check whether an aggregate relationship
survives disaggregation.

---

## Exercise 2

Closed book:

1. Plot Anscombe's quartet. Compute mean, variance and correlation for all four. Write
   two sentences on what you now believe about summary statistics.

2. Take a skewed column from your data. Report mean and median. Which would you give a
   headteacher, and why? Now log-transform it and compare.

3. Simulate it: draw 1,000 samples of size 30 from a **log-normal** population. Plot the
   distribution of the sample means. Is it normal? Explain what CLT did and did not
   promise.

4. Compute a 95% CI for average grade. Then write, in one sentence each, the correct
   interpretation and the common wrong one.

5. Run a t-test on two groups that differ by a trivial amount, with n = 10, then
   n = 100,000. Report p and effect size (Cohen's d) for both. **State the lesson.**

6. Take a dataset and test every numeric column against the target. Count how many are
   "significant" at 0.05. Apply Benjamini-Hochberg. How many survive?

7. Construct a Simpson's paradox from synthetic Imboni-shaped data: a relationship that
   reverses when you disaggregate by class.

Exercises 5 and 7 are the two that change how you read other people's results — including
your own, six months from now.
