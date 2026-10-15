# 06 — Interpretability

*Extra, but read it before Phase 8.* Needed whenever a person must be told why.

In a school, "the model said so" is not an acceptable answer to a parent. This file is
how you produce a better one — and how to know when your explanation is itself unreliable.

---

## Table of Contents

1. [Two different questions](#1-two-different-questions)
2. [Interpretable by construction](#2-interpretable-by-construction)
3. [Permutation importance — the honest global measure](#3-permutation-importance--the-honest-global-measure)
4. [Partial dependence — the shape of an effect](#4-partial-dependence--the-shape-of-an-effect)
5. [SHAP](#5-shap)
6. [Counterfactuals — usually the most useful explanation](#6-counterfactuals--usually-the-most-useful-explanation)
7. [Explaining to a non-technical person](#7-explaining-to-a-non-technical-person)
8. [When explanations are unreliable](#8-when-explanations-are-unreliable)
9. [Exercise 6](#exercise-6)

---

## 1. Two different questions

**Global** — how does the model behave overall? Which features matter? (Feature
importance, partial dependence.)

**Local** — why *this* prediction, for *this* student? (SHAP, LIME, counterfactuals.)

You need both, and for different audiences. A headteacher asks the global question. A
parent asks the local one, about their child, and it is the harder question.

## 2. Interpretable by construction

Before reaching for explanation tools, ask whether you need a black box at all.

| Model | Interpretability |
|---|---|
| Linear / logistic regression | Coefficients read directly |
| Shallow decision tree | The path *is* the explanation |
| Rule lists | Human-readable rules |
| Gradient boosting | Needs SHAP |
| Neural network | Needs SHAP, and less reliably |

**The trade is usually small on tabular data.** A logistic regression at 0.83 AUC that a
parent can understand may be worth more than a boosted model at 0.86 that nobody can
explain. That is a product decision, and it should be made deliberately rather than by
defaulting to the highest score.

For a decision affecting a child's schooling, I would argue the interpretable model is
usually correct. Make that argument explicitly rather than assuming.

## 3. Permutation importance — the honest global measure

```python
from sklearn.inspection import permutation_importance
r = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)
```

Shuffle a column, see how much the score drops. Model-agnostic, computed on held-out
data, and it answers the question you actually meant — unlike built-in
`feature_importances_`, which is biased toward high-cardinality features
(`02-TREES_AND_ENSEMBLES.md §5`).

**The correlated-feature caveat:** two near-duplicate columns each appear unimportant,
because shuffling one leaves the other carrying the signal. Cluster correlated features
and permute the cluster together, or you will wrongly conclude both are useless.

## 4. Partial dependence — the shape of an effect

```python
from sklearn.inspection import PartialDependenceDisplay
PartialDependenceDisplay.from_estimator(model, X_test, ['attendance'])
```

Shows how the prediction changes across a feature's range, averaging over everything
else. It tells you the *shape* — linear, threshold, U-shaped — not just the magnitude.
Genuinely useful for a conversation: "risk rises sharply below 80% attendance and is
flat above it" is actionable.

**Two limits worth stating:**

- **PDP assumes feature independence.** Averaging over unrealistic combinations —
  attendance 30% with top grades — produces a curve for a population that does not
  exist. ICE plots (`kind='individual'`) show per-row curves and reveal when the average
  is hiding opposite effects.
- **PDP is not causal.** It describes the model, not the world. "If we raised attendance
  to 90%, risk would fall" does not follow.

## 5. SHAP

```python
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer(X_test)

shap.summary_plot(shap_values, X_test)          # global
shap.waterfall_plot(shap_values[0])             # one prediction
```

SHAP assigns each feature a contribution to a specific prediction, and the contributions
sum exactly to the prediction minus the baseline. That additivity is what makes it
trustworthy in a way LIME is not.

`TreeExplainer` is exact and fast for tree ensembles. `KernelExplainer` is model-agnostic
and slow — sample your background data or it will run for hours.

**What SHAP does not give you:**

- **Not causation.** A SHAP value says the model used this feature this way, not that
  changing it would change the outcome.
- **Correlated features share credit arbitrarily** between them.
- **It explains the model, including the model's biases.** A SHAP plot showing that
  boarding status drives the prediction tells you the model discriminates — it does not
  tell you that is right.

## 6. Counterfactuals — usually the most useful explanation

"Your application was refused" is unhelpful. "Had your attendance been 5 points higher,
it would have been approved" is actionable.

```python
# simplest useful version: perturb one feature and find the flip point
for value in np.linspace(X_row['attendance'], 100, 50):
    row = X_row.copy(); row['attendance'] = value
    if model.predict_proba([row])[0, 1] < threshold:
        print(f'flips at attendance = {value:.1f}')
        break
```

Libraries: `dice-ml`, `alibi`.

**A counterfactual must be actionable.** "If you were three years younger" is not an
explanation, it is an insult. Restrict counterfactuals to features a person can actually
change, and say which those are.

## 7. Explaining to a non-technical person

The pattern that works:

> **"We flagged Aline as needing support mainly because her attendance dropped from 92%
> to 71% this term, and her maths marks fell 18 points. Attendance is the largest factor.
> If attendance recovers above 85%, she would no longer be flagged.**
>
> **This is a suggestion for a teacher to look into, not a decision. About 3 in 10
> students we flag turn out not to need extra support."**

Four elements, and all four are needed:

1. The main drivers, in plain words with actual numbers
2. What would change the outcome
3. That it is advisory, and a human decides
4. **The error rate, stated honestly**

That last one is the one people omit, and it is what makes the explanation truthful
rather than falsely authoritative.

## 8. When explanations are unreliable

Be honest about the limits:

- SHAP and LIME can disagree on the same prediction.
- Explanations of a badly-calibrated model explain a number that is itself wrong.
- **An explanation can be gamed.** If people learn the model weights attendance heavily,
  attendance gets recorded differently — the measure stops measuring.
- A plausible explanation makes a wrong model *more* dangerous, because it manufactures
  confidence.

**A confident explanation of a bad model is worse than no explanation.** Check
calibration and per-subgroup performance (`03-MODEL_EVALUATION.md §8`) before you
explain anything to anyone.

---

## Exercise 6

1. Train a gradient-boosted model and a logistic regression on the same data. Compare
   scores. **Write the argument for shipping the interpretable one** — and then the
   argument against. Which do you believe?
2. Compute permutation importance and built-in importance. Where do they disagree, and
   why?
3. Add two highly correlated features. Show how permutation importance underrates both.
4. Produce a PDP and an ICE plot for one feature. Does the average hide opposite effects
   in subgroups?
5. Produce a SHAP waterfall for one prediction. Write the §7 paragraph for that student,
   including the honest error rate.
6. Find an actionable counterfactual for one flagged student. Then find a non-actionable
   one and explain why you would never show it.
7. Take a model with poor calibration. Produce a confident-looking SHAP explanation for
   it. Write two sentences on why that combination is dangerous.

Exercise 7 is the point of the file.
