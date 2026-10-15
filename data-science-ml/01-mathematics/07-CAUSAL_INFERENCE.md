# 07 — Causal Inference

**Week 9.** Answering "did X cause Y?" when you cannot run an experiment. The methods
here are weaker than randomisation and far stronger than the correlation most people
report as if it were causation.

`06-EXPERIMENT_DESIGN.md` is the gold standard. This file is what you do when the gold
standard is unavailable — which, for the questions that matter most in education and
health, is usually.

---

## Table of Contents

1. [Why correlation is not causation, mechanically](#1-why-correlation-is-not-causation-mechanically)
2. [Potential outcomes](#2-potential-outcomes)
3. [Draw the DAG first](#3-draw-the-dag-first)
4. [Difference-in-differences](#4-difference-in-differences)
5. [Regression discontinuity](#5-regression-discontinuity)
6. [Instrumental variables](#6-instrumental-variables)
7. [Matching and propensity scores](#7-matching-and-propensity-scores)
8. [Synthetic control](#8-synthetic-control)
9. [Sensitivity analysis](#9-sensitivity-analysis)
10. [Writing the conclusion honestly](#10-writing-the-conclusion-honestly)
11. [The checklist](#11-the-checklist)
12. [Exercise 7](#exercise-7)

---

## 1. Why correlation is not causation, mechanically

Three structures produce correlation between X and Y:

```
X → Y          causation (what you want)
X ← Z → Y      confounding (a common cause)
X → C ← Y      collider (conditioning on C creates a spurious link)
```

**Confounding** is the familiar one. Students who attend the after-school club score
higher. Does the club cause it? Or do motivated students with supportive families both
attend the club *and* score higher? Motivation is Z.

**Colliders** are less known and trap careful people. If you only analyse students who
were *selected* for a scholarship, and selection depends on both grades and sport, you
will find a negative correlation between grades and sport among those selected — even
if none exists in the population. Conditioning on a collider manufactures correlation.

This is why "control for everything you have" is wrong advice. Controlling for a
collider makes your estimate worse.

## 2. Potential outcomes

For each student *i* there are two possible outcomes:

- `Y_i(1)` — their score **if** they attended the club
- `Y_i(0)` — their score **if** they did not

The causal effect for that student is `Y_i(1) − Y_i(0)`.

**The fundamental problem of causal inference:** you only ever observe one of them. The
other is counterfactual and permanently unavailable.

So we estimate averages instead. The **Average Treatment Effect** is
`E[Y(1) − Y(0)]`. Randomisation makes the treated and untreated groups exchangeable,
so the difference in observed means estimates it. Every method in this file is a
different strategy for approximating that exchangeability without randomising.

## 3. Draw the DAG first

A directed acyclic graph of what you believe causes what. It is not decoration — it
tells you which variables to adjust for and, crucially, which to leave alone.

```
family_income ──▶ club_attendance ──▶ exam_score
      │                                   ▲
      └───────────────────────────────────┘
```

Here income is a confounder: adjust for it.

```
club_attendance ──▶ homework_hours ──▶ exam_score
```

Here homework hours is a **mediator** — part of how the club works. Adjusting for it
removes the effect you are trying to measure.

The rule of thumb: **adjust for common causes of treatment and outcome; never adjust
for anything downstream of treatment.**

Write the DAG before you touch the data. It forces you to state assumptions you would
otherwise smuggle in.

## 4. Difference-in-differences

The workhorse when a change arrived for one group and not another.

Imboni rolls out SMS reminders to Kigali schools in March; rural schools get them in
September. Between March and August you have a natural comparison.

```
            Before    After    Change
Treated       62%      71%      +9
Control       60%      64%      +4
                              ─────
DiD estimate                   +5pp
```

The control group's change captures everything that would have happened anyway —
seasonality, national trends, the economy. Subtracting it isolates the treatment.

**The critical assumption is parallel trends**: without treatment, both groups would
have moved together. You cannot prove it, but you can support it by plotting several
periods *before* treatment. If the lines were already diverging, DiD is invalid and
the plot will show you.

Always plot the pre-period. A DiD presented without it should not be believed.

## 5. Regression discontinuity

When treatment is assigned by a sharp threshold on a continuous variable.

A scholarship goes to students scoring ≥ 70 on an entrance exam. A student at 69.5 and
one at 70.5 are essentially identical in ability — the difference between them is
noise — but one gets treatment and one does not. Comparing outcomes right at the
boundary approximates a randomised experiment.

Requirements:

- A genuinely sharp cutoff, enforced
- **No manipulation of the running variable.** If teachers nudge 69s up to 70, the
  design collapses. Test with a McCrary density test: a spike just above the threshold
  is the tell.
- Enough observations near the boundary
- Only estimates the effect **at the threshold** — it says nothing about a student
  scoring 95

This fits education data unusually well: grade boundaries, age cutoffs for school
entry, means-tested thresholds.

## 6. Instrumental variables

When an unobserved confounder is unavoidable, find a variable that affects treatment
but influences the outcome *only* through treatment.

```
distance_to_club ──▶ club_attendance ──▶ exam_score
```

Distance plausibly affects whether a child attends, and plausibly does not affect exam
scores any other way.

Two requirements:

1. **Relevance** — the instrument really does shift treatment (testable; a weak
   instrument produces wildly biased estimates)
2. **Exclusion restriction** — it affects the outcome *only* through treatment
   (**not testable**, defended by argument alone)

The exclusion restriction is where most IV analyses quietly fail. Distance to the club
might correlate with distance to the school, library and clinic — all of which affect
scores directly. State the assumption explicitly and let readers judge it.

## 7. Matching and propensity scores

Build a comparable control group by pairing each treated unit with similar untreated
ones.

**Propensity score** — the modelled probability of receiving treatment given covariates.
Match, stratify or weight on it.

```python
from sklearn.linear_model import LogisticRegression
ps = LogisticRegression().fit(X, treated).predict_proba(X)[:, 1]
```

Then **check balance**: after matching, the covariate distributions should overlap.
Report standardised mean differences before and after. Matching that does not improve
balance has done nothing.

The hard limitation, which no amount of technique removes: **matching only adjusts for
what you measured.** If motivated families both enrol and score higher, and you never
measured motivation, propensity matching will not save you. It controls for observed
confounding only, and it can look rigorous while doing nothing about the real problem.

## 8. Synthetic control

With one treated unit and several untreated, build a weighted combination of the
untreated that reproduces the treated unit's *pre-treatment* trajectory, then project
it forward as the counterfactual.

Useful for policy questions: one school adopts a programme; construct a "synthetic
school" from the others. Transparent, visual, and the pre-period fit is itself the
evidence of credibility.

## 9. Sensitivity analysis

Since the central assumptions are untestable, the professional move is to ask: **how
wrong would my assumption have to be to overturn this?**

- **E-value** — how strong an unmeasured confounder would need to be to explain away
  the effect. If a modest confounder could do it, say so.
- **Placebo tests** — apply the method to a period or an outcome where no effect is
  possible. Finding one means your design is broken.
- **Leave-one-out** — does the result survive dropping any single group?

Reporting a sensitivity analysis is the clearest signal that an analyst understands
their own limits. It is also what distinguishes a credible observational study from a
confident one.

## 10. Writing the conclusion honestly

Match the language to the design:

| Design | Honest phrasing |
|---|---|
| Randomised experiment | "X **caused** a 3pp increase" |
| DiD with good parallel trends | "X is **associated with** a 5pp increase; under the parallel-trends assumption this is causal" |
| Matching | "After adjusting for observed covariates, X is associated with…; unmeasured confounding cannot be excluded" |
| Plain correlation | "X and Y are **associated**. This analysis cannot determine direction or cause." |

The temptation is always to upgrade. Resist it, and state the assumption your causal
claim rests on in the same sentence as the claim.

## 11. The checklist

- [ ] DAG drawn before analysis
- [ ] Confounders adjusted; mediators and colliders **not**
- [ ] Identification strategy named and its key assumption stated
- [ ] Parallel trends plotted (DiD) or density tested (RDD)
- [ ] Balance reported before and after matching
- [ ] Sensitivity analysis included
- [ ] Conclusion worded to match the strength of the design

---

## Exercise 7

1. Draw the DAG for "does attending Imboni's after-school club raise exam scores?"
   Mark every confounder, mediator and collider. Say which you would adjust for.

2. Find a real threshold in Imboni's data (a grade boundary, an age cutoff). Design an
   RDD around it, including the manipulation test you would run first.

3. Simulate the collider trap: generate independent X and Y, create `C = X + Y`,
   condition on C, and show the spurious correlation appear. Explain it in words.

4. Take a before/after comparison you or someone else has made about Imboni. Redo it as
   a difference-in-differences with a plausible control group. Plot the pre-period.

5. Propose an instrument for club attendance. Then argue **against** your own exclusion
   restriction as strongly as you can.

6. Rewrite one conclusion from any past analysis of yours so its language matches the
   actual strength of the design.

Exercise 5 is the one that teaches the habit this whole file is about.
