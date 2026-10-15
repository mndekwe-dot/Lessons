# 03 — Probability

**Weeks 7–8**, alongside statistics.

Probability is the language classifiers speak. Every model that outputs a "confidence"
is making a probability claim, and most of them are lying slightly. This file is how
you tell.

---

## Table of Contents

1. [Conditional probability](#1-conditional-probability)
2. [Bayes' theorem](#2-bayes-theorem)
3. [Base rates — the most important idea in this file](#3-base-rates--the-most-important-idea-in-this-file)
4. [Random variables and expectation](#4-random-variables-and-expectation)
5. [Likelihood — and why it is not probability](#5-likelihood--and-why-it-is-not-probability)
6. [Calibration — is your 0.8 really 0.8?](#6-calibration--is-your-08-really-08)
7. [Exercise 3](#exercise-3)

---

## 1. Conditional probability

```
P(A | B)  =  P(A and B) / P(B)
```

"Probability of A, **given that** B happened."

The whole of supervised classification is estimating `P(class | features)`. That is
literally what a logistic regression outputs.

**Independence** means `P(A | B) = P(A)` — knowing B tells you nothing about A.
Real features are almost never independent, which is why Naive Bayes is called *naive*:
it assumes they are, is therefore wrong, and works anyway more often than it should.

## 2. Bayes' theorem

```
P(A | B)  =  P(B | A) · P(A) / P(B)
```

In words: **update your belief with evidence**.

```
posterior = likelihood × prior / evidence
```

The prior is the piece people drop, and dropping it is the single most consequential
error in applied probability.

## 3. Base rates — the most important idea in this file

A screening test for a condition is 99% accurate. It comes back positive. What is the
probability you have the condition?

Most people say 99%. **The correct answer depends entirely on how common the condition
is**, and you cannot answer without that number.

Suppose 1 person in 1,000 has it. Take 100,000 people:

- 100 have it. The test correctly flags 99 of them.
- 99,900 do not. At 99% accuracy, the test **wrongly flags 999 of them.**
- Positives total 1,098. Of those, 99 are real.

```
P(condition | positive) = 99 / 1098 ≈ 9%
```

**Nine percent, from a 99%-accurate test.** Not because the test is bad — because the
condition is rare. The false positives come from a vastly larger pool.

This is not a puzzle. It is the daily reality of every rare-event classifier you will
ever build:

- Fraud detection
- Dropout risk (if 2% of students drop out)
- Disease screening — including Screening's own domain
- Anomaly detection

**Two consequences you must internalise:**

**Accuracy is meaningless on imbalanced data.** If 2% of students drop out, predicting
"nobody drops out" is 98% accurate and useless. When someone reports accuracy on a rare
event, they have told you nothing.

**Precision collapses as the base rate falls.** A model that looks excellent in
development on a balanced sample will drown in false positives in production where the
real rate is 2%. This surprises people every single time.

Go back and reread `02-STATISTICS.md §5` on Type I vs Type II errors with this in mind.
For a dropout-risk model, a false positive costs a conversation; a false negative costs
a child. That asymmetry, plus the base rate, is what actually sets your threshold — not
0.5, which is just the default.

## 4. Random variables and expectation

```
E[X] = Σ x · P(x)              # the long-run average
Var(X) = E[(X - E[X])²]        # spread
```

Two properties that get used constantly:

```
E[aX + b]  = a·E[X] + b        # expectation is linear, always
Var(aX + b) = a²·Var(X)        # variance is not — note the square, and b vanishes
```

The linearity of expectation holds **even when variables are dependent**, which makes
it far more powerful than it looks.

## 5. Likelihood — and why it is not probability

- **Probability**: parameters fixed, data varies. "Given a fair coin, P(7 heads in 10)?"
- **Likelihood**: data fixed, parameters vary. "Given 7 heads in 10, how likely is p=0.5
  versus p=0.7?"

**Maximum likelihood estimation** picks the parameters that make the observed data most
probable. It is what almost every model you will fit is doing under the hood.

And here is the connection that makes loss functions stop being arbitrary:

- Maximising likelihood under a **Gaussian** noise assumption **is** minimising
  mean squared error.
- Maximising likelihood under a **Bernoulli** assumption **is** minimising
  cross-entropy (log loss).

MSE and cross-entropy are not conventions someone chose. They fall out of an assumption
about how your data was generated. Knowing that tells you when they are the wrong choice.

In practice everyone maximises the **log**-likelihood: products of many small
probabilities underflow to zero in floating point, and logs turn products into sums.

## 6. Calibration — is your 0.8 really 0.8?

A model outputs 0.8 for a hundred students. If it is **calibrated**, about 80 of them
actually drop out. If 40 do, the number is a ranking score wearing a probability's
clothes.

```python
from sklearn.calibration import calibration_curve
prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=10)
# plot prob_pred vs prob_true — the diagonal is perfect
```

Who is and is not calibrated out of the box:

| Model | Calibrated? |
|---|---|
| Logistic regression | Usually yes |
| Random forest | Under-confident at the extremes |
| Gradient boosting | Often over-confident |
| SVM | No — the "probabilities" are a transformation |
| Neural nets | Usually over-confident, badly |

Fix with `CalibratedClassifierCV` (Platt scaling or isotonic), fitted on held-out data.

**When calibration matters:** whenever a human acts on the number. If a matron is told
"78% chance this student needs follow-up", that number must mean something. If it is
only used to rank and take the top 20, calibration is optional — ranking is preserved
by any monotonic distortion.

This distinction — *is the number a probability or a rank?* — decides whether you need
to do this work. Ask it every time.

---

## Exercise 3

Closed book:

1. Redo the base-rate calculation for a 99%-accurate test at prevalence 1%, 0.1% and
   10%. Plot P(condition | positive) against prevalence. Write one sentence on what the
   curve means for a dropout model.

2. On a 2%-positive synthetic dataset, train a classifier. Report accuracy, precision,
   recall and F1. Then report the accuracy of "always predict negative". **Explain why
   accuracy must never be the headline metric here.**

3. Show numerically that minimising MSE equals maximising Gaussian likelihood: write
   both objectives, optimise each, compare the parameters.

4. Plot a calibration curve for logistic regression, a random forest, and gradient
   boosting on the same data. Which is closest to the diagonal? Apply
   `CalibratedClassifierCV` to the worst one and re-plot.

5. Write down one decision in Imboni or Screening where a predicted probability would
   be shown to a person. Does it need calibration, or is it only a ranking? Justify it
   in two sentences.

Exercise 1 is the one worth doing carefully. Nearly every ML failure involving rare
events traces back to someone not having drawn that curve.
