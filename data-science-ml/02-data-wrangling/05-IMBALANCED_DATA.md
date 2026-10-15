# 05 — Imbalanced Data

*Extra. Read with `03-classical-ml/03-MODEL_EVALUATION.md`.*

Rare-event problems are the norm, not the exception: dropout, fraud, disease, equipment
failure, anomaly. This file is what to do about them.

---

## Table of Contents

1. [First, do nothing](#1-first-do-nothing)
2. [The threshold is the decision](#2-the-threshold-is-the-decision)
3. [Class weights](#3-class-weights)
4. [Resampling — and its costs](#4-resampling--and-its-costs)
5. [Calibration after resampling](#5-calibration-after-resampling)
6. [Metrics that survive imbalance](#6-metrics-that-survive-imbalance)
7. [When the class is very rare](#7-when-the-class-is-very-rare)
8. [Exercise 5](#exercise-5)

---

## 1. First, do nothing

The most common mistake is reaching for SMOTE immediately. Try this order:

1. **Change the metric.** Accuracy is meaningless here
   (`01-mathematics/03-PROBABILITY.md §3`). Use PR-AUC, recall at a fixed precision, or
   a cost-weighted score.
2. **Move the threshold.** 0.5 is a default, not a decision.
3. **Class weights.** One parameter, no new data.
4. **Only then** resampling.

Steps 1 and 2 are free and solve most cases. Many "imbalance problems" are really
"someone used accuracy and a 0.5 threshold" problems.

## 2. The threshold is the decision

A classifier outputs a probability. Turning it into yes/no is a **business decision**,
not a modelling one.

```python
y_prob = pipe.predict_proba(X_test)[:, 1]

from sklearn.metrics import precision_recall_curve
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
```

Pick the threshold from the cost of each error, not from a default:

```python
# "flag at most 50 students a term, and I want the highest-risk 50"
k = 50
threshold = np.sort(y_prob)[-k]
```

**For a dropout model, capacity is often the real constraint.** A school can follow up
with 30 students, not 300. That number sets your threshold far more sensibly than any
statistic.

## 3. Class weights

```python
LogisticRegression(class_weight='balanced')
RandomForestClassifier(class_weight='balanced')
XGBClassifier(scale_pos_weight=(n_neg / n_pos))
```

`balanced` weights each class inversely to its frequency — errors on the rare class cost
more. **This is usually enough**, and it changes nothing about your data.

Better still, weight by real cost when you know it:

```python
# missing a genuine dropout is ~10x worse than a false alarm
class_weight={0: 1, 1: 10}
```

That single line encodes an actual policy decision, and it should be made with the
school, not by you alone.

## 4. Resampling — and its costs

| Method | What it does | Cost |
|---|---|---|
| Random undersample | Drop majority rows | Throws away real data |
| Random oversample | Duplicate minority rows | Overfits the duplicates |
| **SMOTE** | Synthesise minority points between neighbours | Invents data that never existed |

```python
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

pipe = ImbPipeline([
    ('prep', preprocess),
    ('smote', SMOTE(random_state=42)),     # training folds ONLY
    ('model', LogisticRegression()),
])
```

**Two rules that are absolute:**

**Never resample the test set.** Test must reflect reality. A model evaluated on a
balanced test set will look far better than it will ever perform.

**Resample inside the pipeline, after the split.** `imblearn`'s `Pipeline` applies
sampling only during `fit`, never during `transform`/`predict`. Using sklearn's
`Pipeline` with SMOTE, or calling SMOTE before splitting, leaks synthetic points derived
from test rows into training. This is one of the most common serious errors in published
notebooks.

**SMOTE's honest limitations:**

- It interpolates between neighbours, so it assumes the space between two minority
  points is also minority. For categorical or high-dimensional data that is often false.
- It frequently does **not** beat simple class weights. Measure, do not assume.
- It makes probabilities uncalibrated — you have changed the base rate the model sees.

## 5. Calibration after resampling

If you resample or reweight, your predicted probabilities no longer match reality: the
model was trained on a 50/50 world that does not exist.

For ranking (top 50 students), this does not matter — the order is preserved.
For a number shown to a human ("78% risk"), it matters completely
(`01-mathematics/03-PROBABILITY.md §6`).

```python
from sklearn.calibration import CalibratedClassifierCV
calibrated = CalibratedClassifierCV(pipe, method='isotonic', cv=5)
```

Fit calibration on data with the **true** base rate, not the resampled one.

## 6. Metrics that survive imbalance

| Metric | Use |
|---|---|
| **PR-AUC** | The default for rare events. Sensitive to the minority class |
| ROC-AUC | Fine for ranking, but **looks good even on useless rare-event models** |
| Recall @ fixed precision | "Of those I flag, 30% must be right. How many do I catch?" |
| Precision @ k | "I can follow up 50 students. How many are real?" |
| F1 | Only if precision and recall genuinely matter equally |

**ROC-AUC is misleadingly flattering on imbalanced data**, because the false-positive
rate has a huge denominator — thousands of false positives barely move it. PR-AUC does
not hide them. When someone reports 0.94 ROC-AUC on a 2% problem, ask for PR-AUC.

## 7. When the class is very rare

Below roughly 0.1%, reframe:

- **Anomaly detection** rather than classification (`IsolationForest`, one-class SVM)
- **Ranking** rather than a decision — hand a human a prioritised list
- **Collect more positives** before modelling. With 30 positive examples, no technique
  saves you; you have a data problem, not an algorithm problem.

That last point is worth saying plainly, because it is the honest answer more often than
people admit.

---

## Exercise 5

On a 2%-positive synthetic dataset:

1. Train with default settings. Report accuracy, precision, recall, F1, ROC-AUC, PR-AUC.
   Then report the accuracy of "always predict negative". **Write the lesson.**
2. Plot the precision-recall curve. Choose a threshold for "we can follow up 30 students
   a term" and report precision and recall there.
3. Compare: baseline, `class_weight='balanced'`, and SMOTE. Three seeds each. Does SMOTE
   actually win?
4. Build the SMOTE leak deliberately — apply it before the split — and report the
   inflated score. Then fix it with `imblearn.pipeline`. Report the gap.
5. Plot calibration curves before and after resampling. What did resampling do to the
   probabilities?
6. Compare ROC-AUC and PR-AUC for a model that is barely better than chance on the rare
   class. Which one told you the truth?

Exercise 4 is the one to do carefully — it is the single most common serious error in
imbalanced-data notebooks online, including many with thousands of upvotes.
