# 03 — Model Evaluation

**Week 17.** As important as the models. Possibly more so — a wrong model with honest
evaluation is fixable; a good model with dishonest evaluation ships and fails silently.

---

## Table of Contents

1. [Three splits, three jobs](#1-three-splits-three-jobs)
2. [Cross-validation](#2-cross-validation)
3. [Classification metrics](#3-classification-metrics)
4. [ROC-AUC vs PR-AUC](#4-roc-auc-vs-pr-auc)
5. [Regression metrics](#5-regression-metrics)
6. [Choosing the metric from the cost](#6-choosing-the-metric-from-the-cost)
7. [Statistical significance of a difference](#7-statistical-significance-of-a-difference)
8. [Slice-based evaluation — the part almost everyone skips](#8-slice-based-evaluation--the-part-almost-everyone-skips)
9. [Error analysis](#9-error-analysis)
10. [Exercise 3](#exercise-3)

---

## 1. Three splits, three jobs

| Split | Used for | Touched |
|---|---|---|
| **Train** | Fitting parameters | Constantly |
| **Validation** | Choosing hyperparameters, features, models | Many times |
| **Test** | The final honest estimate | **Exactly once** |

**Every look at the test set spends it.** Tune against test, and your reported number is
fiction — you have fitted it through your own decisions, and no cross-validation will
rescue that.

The professional habit: split test off first, put it away, and do not load it until the
model is final. If you must look twice, say so when you report the number.

## 2. Cross-validation

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
cross_val_score(pipe, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=42),
                scoring='roc_auc')
```

**Report the standard deviation, not just the mean.** `0.82 ± 0.01` and `0.82 ± 0.09`
are completely different situations, and the second means your "improvement" of 0.02 is
noise.

Pick the right splitter — this is where quiet leaks live:

| Splitter | Use when |
|---|---|
| `KFold` | Independent rows, regression |
| `StratifiedKFold` | Classification — preserves the class ratio per fold |
| `GroupKFold` | **Repeated entities** — students, patients, customers |
| `TimeSeriesSplit` | Time-ordered data |
| `StratifiedGroupKFold` | Both imbalanced and grouped |

**`GroupKFold` for anything with repeated students is mandatory.** Three rows for one
student split across train and test means the model has seen that student, and your
score is inflated. This is the most common silent leak in education and health data.

**Nested CV** is the honest way to report a score when you also tuned: an inner loop
selects hyperparameters, an outer loop measures. Expensive, and the correct answer when
someone asks "is this number real?"

## 3. Classification metrics

Everything comes from the confusion matrix:

```
                 predicted
                 neg    pos
actual   neg     TN     FP     <- false alarm (Type I)
         pos     FN     TP     <- miss (Type II)
```

| Metric | Formula | Answers |
|---|---|---|
| Accuracy | (TP+TN)/all | Useless when imbalanced |
| **Precision** | TP/(TP+FP) | Of those I flagged, how many were real? |
| **Recall** | TP/(TP+FN) | Of the real ones, how many did I catch? |
| F1 | harmonic mean | Only if both matter equally |
| Specificity | TN/(TN+FP) | Of the negatives, how many did I clear? |

**Precision and recall trade off, always.** Lower the threshold: catch more (recall up),
more false alarms (precision down). There is no setting that improves both — only a
choice about which error you prefer.

**Say it in the domain's words**, never in metric names:

> "Of the 40 students we flag as at-risk, about 12 will genuinely be at risk (precision
> 30%). We will catch about 60% of the students who are actually at risk (recall). The
> other 40% we will miss."

That sentence is what a headteacher can act on. "F1 = 0.4" is not.

## 4. ROC-AUC vs PR-AUC

**ROC-AUC** — probability a random positive is ranked above a random negative.
Threshold-free, good for ranking. **Misleadingly flattering on imbalanced data**, because
the false-positive rate has an enormous denominator.

**PR-AUC** — precision against recall. **The right default for rare events.**

On a 2%-positive problem, a model can show ROC-AUC 0.90 and PR-AUC 0.15. The first says
"good"; the second says "of the students you flag, 15% are real." Only one of those is
actionable.

**The baseline differs too:** ROC-AUC's chance level is always 0.5. PR-AUC's chance level
is the positive rate — 0.02 on a 2% problem. A PR-AUC of 0.15 there is 7× chance, which
you cannot see without knowing the baseline. Always report it alongside.

## 5. Regression metrics

| Metric | Notes |
|---|---|
| **MAE** | Mean absolute error. In the target's units. Robust to outliers. |
| **RMSE** | Penalises large errors more. Same units. |
| MAPE | Percentage error — **breaks when actuals near zero** |
| R² | Fraction of variance explained. Can be negative (worse than the mean). |

**MAE or RMSE?** If one large error is much worse than several small ones, RMSE. If all
errors cost proportionally, MAE. For predicting a grade, MAE is more honest and more
interpretable: "we are off by 4 marks on average."

**R² is not a goodness certificate.** A high R² on a trivially predictable target means
nothing. Always compare against `DummyRegressor` — R² of 0 *is* the mean baseline.

## 6. Choosing the metric from the cost

The metric is a business decision, not a statistical one.

For a dropout-risk model:
- **False positive** → a conversation with a student who was fine. Cost: staff time.
- **False negative** → a child leaves school and nobody intervened.

These are not symmetric, and no default metric encodes that. Build the cost in:

```python
def expected_cost(y_true, y_prob, threshold, cost_fp=1, cost_fn=10):
    pred = y_prob >= threshold
    fp = ((pred == 1) & (y_true == 0)).sum()
    fn = ((pred == 0) & (y_true == 1)).sum()
    return fp * cost_fp + fn * cost_fn

thresholds = np.linspace(0.01, 0.99, 99)
best = thresholds[np.argmin([expected_cost(y_test, y_prob, t) for t in thresholds])]
```

**Getting the school to state the ratio is the hard and important part.** Ask "how many
false alarms would you accept to catch one more real case?" — the answer is your ratio,
and it is their decision to make, not yours.

## 7. Statistical significance of a difference

Model A scores 0.842, model B 0.851. Is B better?

**Usually you cannot tell.** Check the cross-validation spread first. If A is 0.842 ±
0.02, the difference is noise.

```python
from scipy import stats
stats.ttest_rel(scores_a, scores_b)     # paired: same folds, both models
```

Use a **paired** test — same folds for both models — which removes fold difficulty as a
source of variance and is far more sensitive.

And run multiple seeds. A difference that vanishes when you change the random seed was
never real. This is `01-mathematics/02-STATISTICS.md §5` applied to your own work, and it
is where most self-deception in ML happens.

## 8. Slice-based evaluation — the part almost everyone skips

An aggregate score hides everything.

```python
for name, idx in df.groupby('class').groups.items():
    print(name, roc_auc_score(y_test[idx], y_prob[idx]))
```

**Always evaluate per subgroup**: by class, sex, boarding status, district, and by time
period. A model at 0.85 overall may be 0.90 for day students and 0.60 for boarders —
which means it does not work for boarders, and the aggregate concealed it.

This is the technical foundation of the fairness audit in `07-enterprise/02`, and it is
also just better engineering. Find your model's failure modes before your users do.

## 9. Error analysis

Do not stop at a number. **Look at the errors.**

```python
errors = X_test[y_pred != y_test].copy()
errors['prob'] = y_prob[y_pred != y_test]
errors.sort_values('prob').head(20)     # confidently wrong — the interesting ones
```

Confidently wrong predictions are the most informative rows in your project. They reveal
mislabelled data, a missing feature, or a subpopulation the model has not learned. An
hour reading fifty errors beats a week of hyperparameter tuning, reliably.

---

## Exercise 3

1. On a dataset with repeated students, compare `KFold` and `GroupKFold`. Report both
   scores and explain the gap.
2. On a 2%-positive problem, report ROC-AUC and PR-AUC, plus PR-AUC's chance baseline.
   Write the sentence you would give a headteacher.
3. Translate your precision and recall into the plain-English paragraph from §3.
4. Implement the cost function in §6. Plot expected cost against threshold for cost
   ratios 1:1, 1:5 and 1:20. How much does the optimal threshold move?
5. Compare two models across 5 folds × 3 seeds. Run a paired t-test. Is the difference
   real, or within noise?
6. Evaluate per subgroup on at least three groupings. Find one where performance is
   materially worse. What would you do about it?
7. Pull your twenty most confidently wrong predictions and read them. Write down three
   hypotheses about why the model failed.

Exercise 7 is the one that separates people who tune from people who understand.
