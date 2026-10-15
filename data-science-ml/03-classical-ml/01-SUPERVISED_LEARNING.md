# 01 — Supervised Learning

**Week 14.** The models everything else is measured against.

---

## Table of Contents

1. [The setup](#1-the-setup)
2. [Linear regression](#2-linear-regression)
3. [Logistic regression](#3-logistic-regression)
4. [Regularisation](#4-regularisation)
5. [The bias–variance trade-off](#5-the-biasvariance-trade-off)
6. [k-Nearest Neighbours](#6-k-nearest-neighbours)
7. [Support Vector Machines](#7-support-vector-machines)
8. [Naive Bayes](#8-naive-bayes)
9. [Always start with a baseline](#9-always-start-with-a-baseline)
10. [Exercise 1](#exercise-1)

---

## 1. The setup

You have `X` (features) and `y` (labels), and you want a function that maps one to the
other on data it has never seen. That last clause is the whole difficulty — fitting the
training data is trivial, and a lookup table does it perfectly.

- **Regression** — `y` is continuous. Grade, price, days until.
- **Classification** — `y` is a category. Dropout yes/no, which class, which disease.

## 2. Linear regression

```
ŷ = w₀ + w₁x₁ + w₂x₂ + ... = Xw
```

Fit by minimising mean squared error. You derived the gradient in
`01-mathematics/04-CALCULUS_FOR_ML.md` and implemented it in nine lines.

```python
from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X_train, y_train)
model.coef_, model.intercept_
```

**Reading a coefficient:** "holding all other features constant, a one-unit increase in
`x₁` is associated with a `w₁` change in `y`."

Three qualifiers on that sentence, all of which matter:

- **"Holding others constant"** is fiction when features are correlated. If attendance
  and homework completion move together, you cannot change one alone, and the individual
  coefficients become unstable and uninterpretable.
- **"Associated with"**, not "causes". Coefficients are not causal effects
  (`01-mathematics/02-STATISTICS.md §6`).
- **Coefficients are only comparable if features are scaled.** Otherwise their size
  reflects units, not importance.

**Assumptions**, in the order they get violated: linearity, independent errors, constant
error variance (homoscedasticity), normally-distributed errors. Check by plotting
residuals against predictions — you want a shapeless cloud. A funnel means the variance
grows with the prediction; a curve means you are missing non-linearity.

## 3. Logistic regression

For classification. It puts a linear model through a sigmoid to produce a probability:

```
p = 1 / (1 + e^(-Xw))
```

Trained by minimising cross-entropy, which — per `01-mathematics/03-PROBABILITY.md §5` —
*is* maximising Bernoulli likelihood. Not a convention someone chose.

```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000).fit(X_train, y_train)
model.predict_proba(X_test)[:, 1]      # use this, not predict()
```

**Use `predict_proba`, not `predict`.** `predict` silently applies a 0.5 threshold, and
0.5 is almost never the right threshold for a real decision
(`02-data-wrangling/05-IMBALANCED_DATA.md §2`).

**Reading coefficients:** they are in log-odds. `exp(w)` gives an odds ratio — `exp(0.7)
≈ 2` means the odds double per unit. Reporting log-odds to a headteacher is useless;
report odds ratios, or better, predicted probabilities at concrete values.

**Why logistic regression is still worth knowing well:** it is fast, calibrated out of
the box, and interpretable. When you must explain a decision about a child to their
parent, that combination is worth more than two points of AUC.

## 4. Regularisation

Unconstrained models fit noise. Add a penalty:

| | Penalty | Effect | Use when |
|---|---|---|---|
| **Ridge (L2)** | `λΣw²` | Shrinks all weights smoothly | Many correlated features |
| **Lasso (L1)** | `λΣ\|w\|` | Drives some weights to **exactly** zero | You want feature selection |
| **Elastic net** | Both | Compromise | Many correlated features *and* selection |

```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet
Ridge(alpha=1.0)          # higher alpha = more regularisation
LogisticRegression(C=0.1) # sklearn's C is INVERSE: lower C = more regularisation
```

That inconsistency — `alpha` up means more, `C` up means less — trips everyone at least
once.

**Regularisation requires scaled features.** The penalty is on coefficient magnitude, so
a feature in metres and one in kilometres get penalised completely differently for no
real reason.

The geometry behind why L1 zeroes coefficients and L2 does not is in
`01-mathematics/05-OPTIMISATION.md §5`.

## 5. The bias–variance trade-off

- **Bias** — error from the model being too simple. Underfits. A straight line through
  a curve.
- **Variance** — error from the model being too sensitive to the training sample.
  Overfits. It learned the noise.

```
total error = bias² + variance + irreducible noise
```

| Symptom | Diagnosis | Fix |
|---|---|---|
| Train bad, validation bad | High bias | More capacity, better features, train longer |
| Train great, validation bad | High variance | More data, regularise, simpler model |
| Both good, close together | Well fitted | Ship it |
| Validation *better* than train | Suspicious | Dropout active in train only — or a leak |

**The single most informative plot in machine learning** is training and validation loss
on the same axes. The gap between them tells you which of two opposite actions to take.

```python
from sklearn.model_selection import learning_curve
```

A learning curve — score against training-set size — answers the question people ask
constantly: *would more data help?* If the validation curve is still rising, yes. If both
curves have plateaued close together, no — more data will not help, and you need better
features or a different model. That answer is worth real money.

## 6. k-Nearest Neighbours

```python
from sklearn.neighbors import KNeighborsClassifier
KNeighborsClassifier(n_neighbors=5)
```

No training — it memorises and compares at prediction time. Useful as a baseline and as
an idea (it is the ancestor of embedding search in Phase 6).

Its weaknesses are instructive: prediction is slow and scales with dataset size,
it demands scaling, and it degrades badly in high dimensions.

**The curse of dimensionality**: as dimensions grow, all points become roughly
equidistant, so "nearest" stops meaning anything. This is why you will see PCA or
embeddings before kNN on wide data — and why it matters that embeddings are *dense and
low-dimensional*.

## 7. Support Vector Machines

Finds the boundary with the widest margin between classes. The **kernel trick** lets it
draw non-linear boundaries without ever computing the high-dimensional coordinates.

```python
from sklearn.svm import SVC
SVC(kernel='rbf', C=1.0, probability=True)
```

Honest assessment: SVMs were dominant, and gradient boosting has largely displaced them
on tabular data. They scale poorly past ~100k rows, and their `probability=True` output
is a fitted transformation, not a real probability. Know what they are; reach for them
rarely.

## 8. Naive Bayes

Assumes all features are conditionally independent given the class — which is nearly
always false, hence "naive".

```python
from sklearn.naive_bayes import MultinomialNB
```

It works far better than it should, is extremely fast, and remains a genuinely strong
baseline for text classification. Try it before a transformer; sometimes it wins, and it
costs you ten seconds to find out.

## 9. Always start with a baseline

```python
from sklearn.dummy import DummyClassifier, DummyRegressor
DummyClassifier(strategy='most_frequent').fit(X_train, y_train).score(X_test, y_test)
DummyRegressor(strategy='mean')
```

**Rule 2 of this curriculum.** Then a simple real model — logistic or linear regression.
That is your reference point. Anything more complex must justify itself against it, and
"more complex" includes every deep learning model in Phase 5.

On tabular data, a well-tuned logistic regression with good features beats a badly-used
neural network more often than anyone admits.

---

## Exercise 1

1. Fit linear regression on a real dataset. Plot residuals against predictions. Is the
   cloud shapeless? If not, what does the shape tell you?
2. Report coefficients unscaled and scaled. Which are comparable, and why?
3. Fit logistic regression. Report coefficients as odds ratios and write one sentence a
   headteacher would understand.
4. Compare Ridge and Lasso across `alpha` in `[0.001, 0.01, 0.1, 1, 10, 100]`. Plot the
   coefficient paths. Count exact zeros under each. Explain the difference.
5. Deliberately overfit: fit a degree-15 polynomial to 20 points. Plot train and
   validation error. Then regularise until it generalises.
6. Plot a learning curve. Answer, with evidence: **would more data help?**
7. Build the full ladder on one dataset — Dummy → logistic → kNN → SVM → all with
   default settings. Report test scores in a table. How much did complexity actually buy?

Exercise 7 is the habit. Most of the time the answer is "surprisingly little", and
knowing that stops you reaching for a neural network by reflex.
