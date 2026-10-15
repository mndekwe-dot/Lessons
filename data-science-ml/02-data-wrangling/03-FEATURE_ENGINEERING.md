# 03 — Feature Engineering

**Week 12.** Where tabular problems are actually won.

On tabular data, good features beat a better algorithm nearly every time. Swapping
random forest for XGBoost might buy you 1%. A feature that encodes something real about
schools can buy you 10%.

**And this is where your domain knowledge becomes a technical advantage** that a better
modeller without it cannot replicate.

---

## Table of Contents

1. [Encoding categoricals](#1-encoding-categoricals)
2. [Numeric transformations](#2-numeric-transformations)
3. [Dates — never feed a raw date](#3-dates--never-feed-a-raw-date)
4. [Aggregation features — the highest-value kind](#4-aggregation-features--the-highest-value-kind)
5. [Interactions](#5-interactions)
6. [Domain features — where you win](#6-domain-features--where-you-win)
7. [Selection — fewer, better](#7-selection--fewer-better)
8. [Every feature has a production cost](#8-every-feature-has-a-production-cost)
9. [Exercise 3](#exercise-3)

---

## 1. Encoding categoricals

**One-hot** — the default for low cardinality:

```python
pd.get_dummies(df, columns=['class'], drop_first=True)
```

`drop_first=True` avoids the dummy trap (perfect collinearity) for linear models. Trees
do not care.

**Ordinal** — only when order is real:

```python
df['level'] = df['level'].map({'S1': 1, 'S2': 2, 'S3': 3})
```

**Never label-encode an unordered category for a linear model.** Mapping
`{'Kigali': 0, 'Huye': 1, 'Musanze': 2}` tells the model Musanze is twice Huye. Trees
tolerate it; linear models and neural nets learn nonsense from it.

**High cardinality** — target encoding, and the trap it carries:

```python
# LEAKS — every row sees its own target
df['class_te'] = df.groupby('class')['target'].transform('mean')
```

Target encoding uses the target, so it leaks by construction. It must be done
**out-of-fold**: compute the encoding on the training folds only and apply it to the
held-out fold. `category_encoders.TargetEncoder` inside a `Pipeline` does this
correctly; doing it by hand almost always leaks.

Add smoothing toward the global mean, or a category with three rows gets a wildly
confident encoding.

## 2. Numeric transformations

```python
np.log1p(x)          # right-skewed positives (income, counts). log1p handles zeros
np.sqrt(x)           # milder
x ** 2, x ** 3       # curvature, for linear models
```

**Scaling:**

| Scaler | Use when |
|---|---|
| `StandardScaler` | Roughly normal; the default |
| `MinMaxScaler` | Bounded range needed (neural nets, images) |
| `RobustScaler` | Outliers present — uses median and IQR |

**Who needs scaling:** anything distance- or gradient-based — linear/logistic
regression, SVM, kNN, k-means, PCA, neural nets.
**Who does not:** trees and tree ensembles. A split on `x > 5` is unaffected by units.

**Binning** — occasionally right, usually not:

```python
pd.cut(df['age'], bins=[0, 12, 15, 18, 100], labels=['<12','13-15','16-18','18+'])
```

Binning discards information. Do it when the relationship is genuinely stepwise (legal
age thresholds, school levels), not to "help" the model — a tree finds better splits
than you will choose.

## 3. Dates — never feed a raw date

A raw timestamp is nearly useless. Decompose it:

```python
d = df['date'].dt
df['year'], df['month'], df['dow'] = d.year, d.month, d.dayofweek
df['is_weekend'] = d.dayofweek >= 5
df['days_since_enrolment'] = (df['date'] - df['enrolled_at']).dt.days
```

**Cyclical encoding** — month 12 and month 1 are adjacent, but `12` and `1` are far
apart numerically:

```python
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
```

Both are needed — one alone is ambiguous. Same trick for day-of-week and hour.

**Durations usually beat timestamps.** "Days since last absence" is more predictive than
"date of last absence", and it does not go stale when the calendar rolls over.

## 4. Aggregation features — the highest-value kind

Most of your predictive power will come from group-relative and historical aggregates.

```python
# how a student compares to their class
df['vs_class_avg'] = df['grade'] - df.groupby('class')['grade'].transform('mean')

# their own history
df = df.sort_values(['student_id', 'term'])
df['prev_grade'] = df.groupby('student_id')['grade'].shift(1)
df['grade_delta'] = df['grade'] - df['prev_grade']
df['rolling_attendance'] = (df.groupby('student_id')['attendance']
                              .transform(lambda s: s.shift(1).rolling(3).mean()))
```

**Note the `.shift(1)` before `.rolling()`.** Without it, the rolling window includes
the current row — the model sees the present when predicting the present. This is the
most common leak in time-series feature engineering and it produces beautiful
validation scores and a useless model.

**The test for every feature: would I know this value at prediction time?**

Ask it out loud, for every single feature. "Total absences this term" is unknowable in
week 2 of that term. If your training data has it, your model has learned to use
information that will not exist when it runs.

## 5. Interactions

```python
df['attendance_x_prior'] = df['attendance'] * df['prev_grade']
```

Linear models cannot discover interactions; you must build them. Trees find them
automatically, which is one reason gradient boosting dominates tabular problems.

`PolynomialFeatures(degree=2)` generates all pairwise products — and explodes the
column count. Fine for 10 features, catastrophic for 100.

## 6. Domain features — where you win

This is the part no library gives you:

```python
df['attendance_dropping']   = df['rolling_attendance'] < df['attendance_baseline'] * 0.8
df['is_exam_term']          = df['term'] == 3
df['boarder_far_from_home'] = df['is_boarder'] & (df['home_distance_km'] > 100)
df['new_to_school']         = df['days_since_enrolment'] < 90
```

Every one encodes something you know about how schools work and a model cannot infer.
This is the highest-leverage half hour in any tabular project, and it is the half that
someone with better maths and no school experience cannot do.

## 7. Selection — fewer, better

More features is not better. Each one adds noise, overfitting risk, and something else
to break in production.

```python
from sklearn.feature_selection import mutual_info_classif
from sklearn.inspection import permutation_importance
```

**Permutation importance beats built-in importance.** Tree `feature_importances_` is
biased toward high-cardinality features. Permutation importance measures what actually
happens to the score when you shuffle a column, on held-out data.

Drop near-duplicates:

```python
corr = df.corr(numeric_only=True).abs()
# keep one of any pair correlated above ~0.95
```

**Do feature selection inside cross-validation**, not before it. Selecting on the full
dataset and then cross-validating is a leak — you have already used the test data to
choose.

## 8. Every feature has a production cost

A feature that needs a 30-second query, or data that arrives a day late, is a feature
you cannot serve in real time. **Training/serving skew** (`06-mlops/03`) is when a
feature is computed one way in your notebook and another way in production, and the
model silently receives different inputs than it was trained on.

Ask, for every feature: *can I compute this at prediction time, with the same code, in
the latency budget?* If not, it is not a feature — it is a nice idea.

---

## Exercise 3

1. Build ten features for a dropout-risk model on synthetic data. For **each one**,
   write the sentence: "At prediction time I would know this because…". Delete any you
   cannot complete.
2. Build a rolling-average feature both with and without `.shift(1)`. Compare validation
   scores. **Explain the gap.**
3. Target-encode a high-cardinality column, once naively and once out-of-fold. Compare
   test scores and explain the difference.
4. Cyclically encode month. Show that a model using sin/cos beats one using the raw
   integer on a seasonal target.
5. Compute permutation importance. Drop everything below the median importance and
   retrain. Did the score fall? What does the answer tell you?
6. Write three domain features that only someone who knows Rwandan schools would think
   of. Show whether they help.
7. For your three best features, write down how you would compute each in production
   and how long it would take.

Exercise 1 is the one that prevents the most damage. Most leaks die at that sentence.
