# 02 — Exploratory Data Analysis

**Week 11.** Exploration that answers questions, not forty plots nobody reads.

---

## Table of Contents

1. [EDA has a purpose, and it is not "look at the data"](#1-eda-has-a-purpose-and-it-is-not-look-at-the-data)
2. [The first ten minutes](#2-the-first-ten-minutes)
3. [The target first, always](#3-the-target-first-always)
4. [One variable at a time](#4-one-variable-at-a-time)
5. [Two variables](#5-two-variables)
6. [Segment before you conclude](#6-segment-before-you-conclude)
7. [Time](#7-time)
8. [Automated EDA — useful, and a trap](#8-automated-eda--useful-and-a-trap)
9. [Write down what you found](#9-write-down-what-you-found)
10. [Exercise 2](#exercise-2)

---

## 1. EDA has a purpose, and it is not "look at the data"

You are answering five questions, in this order:

1. **What do I have?** Rows, columns, types, time span, units.
2. **What is broken?** Missing, impossible values, duplicates, inconsistencies.
3. **What does the target look like?** Distribution, base rate, drift over time.
4. **What relates to the target?** And is the relationship plausible or suspicious?
5. **What would a domain expert say is wrong here?** ← the one people skip

Question 5 catches more real problems than the other four combined. You *are* the
domain expert for school data — use that. A class with 400 students, an exam sat on a
Sunday, attendance above 100%: a model will happily learn from all of these.

## 2. The first ten minutes

```python
df.shape
df.info()                                  # dtypes + non-null counts
df.describe(include='all').T
df.isna().mean().sort_values(ascending=False)
df.head(20)
df.sample(20)                              # head is often sorted; sample is honest
```

`df.sample()` matters. Data arrives sorted by ID or date, so `head()` shows you one
corner. Sampling shows you the middle.

Sanity checks that should be reflexive:

```python
(df['grade'] < 0).sum(), (df['grade'] > 100).sum()
df['date'].min(), df['date'].max()          # dates in the future? before the school existed?
df['student_id'].nunique(), len(df)         # is one row one student?
```

That last line is the most valuable one-liner in this file. Knowing your **grain** —
what one row represents — prevents a whole class of aggregation errors.

## 3. The target first, always

```python
df['target'].value_counts(normalize=True)   # classification: the base rate
df['target'].describe()                     # regression
```

**The base rate determines everything downstream** — your metric, your threshold, your
resampling strategy, whether accuracy is meaningful at all
(`01-mathematics/03-PROBABILITY.md §3`).

For time-ordered data, check whether the target rate is stable:

```python
df.set_index('date').resample('M')['target'].mean().plot()
```

A base rate that shifts over time means a model trained on last year may already be
wrong, and it means a random train/test split is invalid — you must split by time.

## 4. One variable at a time

**Numeric:** histogram plus box plot. Look for skew, bimodality, spikes at round
numbers, and an impossible pile at zero.

A spike at a single value usually means a default was recorded as data — `0` for
"not measured", `1900-01-01` for "unknown date". These are missing values in disguise
and they will poison any average.

**Categorical:** `value_counts()`. Look for spelling variants, a dominant class, and
high cardinality.

## 5. Two variables

```python
sns.scatterplot(df, x='attendance', y='grade')
sns.boxplot(df, x='class', y='grade')
df.corr(numeric_only=True)
```

**Plot before trusting a correlation.** Pearson only sees straight lines — a perfect
U-shape has r ≈ 0 (`01-mathematics/02-STATISTICS.md §6`).

**A correlation above about 0.95 with the target is a red flag, not a triumph.** It
usually means leakage: a column that encodes the answer. "Final grade" predicting
"passed" is not a model, it is a restatement. `03-classical-ml/04-LEAKAGE.md` covers
this properly, but EDA is where you first notice it.

## 6. Segment before you conclude

Any relationship you find, check inside subgroups.

```python
for name, group in df.groupby('class'):
    print(name, group['attendance'].corr(group['grade']))
```

**Simpson's paradox**: a trend can reverse when groups are pooled. If overall
correlation is +0.4 but it is negative inside every class, the aggregate is telling you
about differences *between* classes, not about individual students — and an intervention
based on the aggregate would fail.

This is also the beginning of your fairness work. Performance and relationships that
differ by sex, boarding status, or district are what `07-enterprise/02` audits formally.
Noticing it during EDA is much cheaper than discovering it after deployment.

## 7. Time

```python
df.set_index('date').resample('W')['grade'].mean().plot()
```

Look for: seasonality (terms, exam periods), trend, sudden level shifts, and gaps.

**A sudden shift usually means a process change, not a real effect** — a new grading
policy, a system migration, a changed definition. Ask before modelling. A model that
learns across a definition change learns nonsense.

## 8. Automated EDA — useful, and a trap

```python
from ydata_profiling import ProfileReport
ProfileReport(df).to_file('report.html')
```

Genuinely useful as a first pass. But it answers questions 1–3 and cannot touch 4 or 5.
It will never tell you that a class of 400 is impossible, or that this column is
tomorrow's information leaking into today's prediction.

**Generating a 200-page report is not EDA.** Reading it, and then asking what a
headteacher would find absurd, is.

## 9. Write down what you found

End every EDA with a short written summary:

```markdown
## EDA — attendance dataset, 2026-09-15
- 812 students, 3 terms, Jan-Nov 2026. Grain: one row per student per term.
- 14% of grades missing, concentrated in S6 term 3 -> likely MNAR (leavers)
- 23 attendance values > 100% -> data entry, set to NaN
- attendance/grade correlation +0.34 overall, but +0.05 within class -> Simpson's
- `final_score` correlates 0.97 with target -> LEAK, must drop
- Base rate shifts from 4% to 7% across terms -> split by time, not randomly
```

Six lines that change every modelling decision. Without them, you will rediscover all
of it in week three, or worse, not at all.

---

## Exercise 2

On your synthetic dataset:

1. Answer all five questions from §1 in writing. Question 5 must have at least three
   entries drawn from your own knowledge of how schools work.
2. State your grain in one sentence, and prove it with a `nunique()` check.
3. Find a spike at a single value that is really a disguised missing value.
4. Plant a leaky column, then find it via correlation. Then explain why you would have
   caught it faster by asking "would I know this at prediction time?"
5. Construct and detect a Simpson's paradox by segmenting.
6. Resample the target over time. Is the base rate stable? What does your answer imply
   about how you must split train and test?
7. Write the EDA summary in the §9 format. Six to ten lines. This is the deliverable —
   not the notebook.
