# 02 — Trees and Ensembles

**Weeks 15–16.** The workhorse. On tabular data, gradient boosting is the answer far
more often than anything in Phase 5.

---

## Table of Contents

1. [Decision trees](#1-decision-trees)
2. [Random forests — averaging away the variance](#2-random-forests--averaging-away-the-variance)
3. [Gradient boosting — the one that wins](#3-gradient-boosting--the-one-that-wins)
4. [Tuning, in priority order](#4-tuning-in-priority-order)
5. [Feature importance — and why the default lies](#5-feature-importance--and-why-the-default-lies)
6. [Categorical handling](#6-categorical-handling)
7. [When trees are the wrong choice](#7-when-trees-are-the-wrong-choice)
8. [Stacking](#8-stacking)
9. [Exercise 2](#exercise-2)

---

## 1. Decision trees

A tree asks yes/no questions, splitting the data to make each side purer.

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
tree = DecisionTreeClassifier(max_depth=4).fit(X_train, y_train)
plot_tree(tree, feature_names=X.columns, filled=True)
```

**How a split is chosen:** try every feature and every threshold, keep the one that most
reduces impurity.

- **Gini** — `1 − Σpᵢ²`. Faster; sklearn's default.
- **Entropy** — `−Σpᵢlog(pᵢ)`. Marginally different splits, essentially the same results.

Do not agonise over this choice; it almost never matters.

**Why trees are attractive:**

- No scaling needed — a split on `x > 5` ignores units
- Handles mixed numeric and categorical naturally
- Captures **interactions automatically** — a path down the tree *is* an interaction
- A shallow tree is genuinely readable by a non-technical person

**Why a single tree is a bad model:** it overfits catastrophically. An unconstrained
tree grows until every leaf is pure — that is a lookup table with extra steps. It is
also unstable: change a few rows and you get a completely different tree.

That instability is a weakness alone and an asset in an ensemble, which is the whole
idea behind what follows.

## 2. Random forests — averaging away the variance

Train many trees on different bootstrap samples, each considering a random subset of
features per split, then average.

```python
from sklearn.ensemble import RandomForestClassifier
RandomForestClassifier(n_estimators=500, max_features='sqrt', n_jobs=-1)
```

Two sources of randomness, and both are necessary:

- **Bootstrap sampling** — each tree sees a different sample
- **Random feature subsets** — otherwise every tree splits on the same dominant feature
  first, and the trees end up correlated. Averaging correlated models buys you nothing.

**More trees never overfit.** `n_estimators` has diminishing returns and a runtime cost,
but it does not degrade generalisation. Set it high (300–1000) and tune depth instead.

Random forests are the best "just works" model: strong with defaults, hard to break,
parallel. If you need a number in ten minutes, this is it.

## 3. Gradient boosting — the one that wins

Boosting builds trees **sequentially**, each correcting the previous ensemble's errors.
Where a forest averages independent guesses, boosting fits the residual.

```python
import lightgbm as lgb
model = lgb.LGBMClassifier(
    n_estimators=1000,
    learning_rate=0.05,
    num_leaves=31,
    subsample=0.8,
    colsample_bytree=0.8,
)
model.fit(X_train, y_train,
          eval_set=[(X_val, y_val)],
          callbacks=[lgb.early_stopping(50)])
```

| Library | Notes |
|---|---|
| **LightGBM** | Fastest, low memory. Native categorical support. **Start here.** |
| **XGBoost** | The most battle-tested. Excellent documentation. |
| **CatBoost** | Best with many categorical features; strong defaults. |

All three are close in accuracy when tuned. Pick one and learn it properly rather than
sampling all three.

**Unlike forests, boosting DOES overfit with too many trees.** This is why
`early_stopping` on a validation set is not optional — it decides `n_estimators` for you,
correctly.

**The learning rate / n_estimators trade-off:** lower rate needs more trees and
generalises slightly better. `learning_rate=0.05` with early stopping is a good default;
tune the rate last.

## 4. Tuning, in priority order

Do not grid-search everything. Tune in the order that matters:

1. **`n_estimators`** — let early stopping decide it. Free.
2. **`learning_rate`** — 0.01–0.1.
3. **Complexity** — `num_leaves` (LightGBM) or `max_depth` (XGBoost).
4. **Sampling** — `subsample`, `colsample_bytree` around 0.8.
5. **Regularisation** — `reg_alpha`, `reg_lambda`, `min_child_samples`.

```python
from sklearn.model_selection import RandomizedSearchCV
```

**Use random search, not grid search.** With the same budget, random search explores
more values of the parameters that matter, because most parameters do not matter much
and a grid wastes trials on them. `optuna` is better still for larger budgets.

**A note on honesty:** every tuning trial that touches your validation set uses it up.
Try 200 configurations and pick the best validation score, and that score is optimistic —
you have fitted the validation set. Keep a **test set you touch exactly once**.

## 5. Feature importance — and why the default lies

```python
model.feature_importances_          # biased. Do not report this.
```

Built-in importance is computed from how often and how usefully a feature was split on.
It is **biased toward high-cardinality features** — a feature with many distinct values
gets more chances to look useful, including a random ID column.

Use permutation importance on held-out data:

```python
from sklearn.inspection import permutation_importance
r = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)
```

It measures what actually happens to your score when a column is shuffled. That is the
question you meant to ask.

**Correlated features share importance.** Two near-duplicate columns each look
unimportant, because shuffling one leaves the other to carry the signal. Neither is
useless; together they matter. Cluster correlated features before interpreting.

## 6. Categorical handling

```python
# LightGBM — native, and usually best
df['class'] = df['class'].astype('category')
lgb.LGBMClassifier().fit(X, y, categorical_feature=['class'])
```

Native handling beats one-hot for high cardinality: one-hot on 500 districts creates 500
sparse columns, and trees split poorly on sparse binaries. CatBoost's ordered target
statistics are the most sophisticated approach and avoid the target-encoding leak by
construction.

## 7. When trees are the wrong choice

Trees are the default for tabular data. They are wrong for:

- **Extrapolation.** A tree can never predict outside the range of its training targets.
  For a genuine trend continuing upward, use a linear model.
- **Smooth relationships.** Trees approximate a straight line with a staircase.
- **Images, audio, raw text.** Phase 5.
- **Very high-dimensional sparse data** (raw TF-IDF). Linear models win.
- **Very small datasets** (< ~200 rows). Not enough to split on.

## 8. Stacking

```python
from sklearn.ensemble import StackingClassifier
StackingClassifier(
    estimators=[('lgb', lgb.LGBMClassifier()), ('rf', RandomForestClassifier()),
                ('lr', LogisticRegression())],
    final_estimator=LogisticRegression(), cv=5)
```

Train several models, then train a model on **their out-of-fold predictions**. It wins
Kaggle competitions and buys perhaps 1–2%.

**Be honest about the trade.** You now have four models to serve, version, and monitor,
for a gain that a single good feature would have matched. In production, that is usually
the wrong trade. Know it exists; reach for it rarely.

---

## Exercise 2

1. Fit an unconstrained decision tree. Report train and test accuracy. Then set
   `max_depth=3`. Explain the gap in both cases.
2. Plot a depth-3 tree and read three decision paths aloud as sentences a headteacher
   would understand.
3. Compare on one dataset: single tree, random forest, LightGBM — defaults, three seeds.
   Report mean and spread. **Is the difference bigger than the seed noise?**
4. Fit LightGBM without early stopping at `n_estimators=5000`. Plot train and validation
   loss. Find where validation turns up. Then add early stopping.
5. Add a random ID column to your features. Compare its rank under
   `feature_importances_` versus permutation importance. **This is the demonstration
   that matters.**
6. Add a near-duplicate of an important feature. What happens to both importances?
7. Train a tree to predict a target that increases linearly beyond the training range.
   Show it cannot extrapolate. Then show linear regression can.
8. Tune LightGBM with `RandomizedSearchCV` over 50 trials. Report best-validation and
   then test score. How much did validation flatter you?

Exercises 5 and 8 both show you a number you would otherwise have trusted.
