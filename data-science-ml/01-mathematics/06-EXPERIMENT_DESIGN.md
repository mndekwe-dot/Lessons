# 06 — Experiment Design and A/B Testing

**Week 9.** How to find out whether a change actually worked. `02-STATISTICS.md` gives
you hypothesis testing as mathematics; this file is the engineering of running a real
experiment without fooling yourself.

This is the single most commonly interviewed applied skill for a data role, and the
one most commonly done badly in industry.

---

## Table of Contents

1. [Why you cannot just compare before and after](#1-why-you-cannot-just-compare-before-and-after)
2. [The anatomy of an experiment](#2-the-anatomy-of-an-experiment)
3. [Write the hypothesis down first](#3-write-the-hypothesis-down-first)
4. [Metrics: primary, secondary, guardrail](#4-metrics-primary-secondary-guardrail)
5. [Statistical power, and why underpowered tests waste everything](#5-statistical-power-and-why-underpowered-tests-waste-everything)
6. [Randomisation](#6-randomisation)
7. [The ways people fool themselves](#7-the-ways-people-fool-themselves)
8. [Analysing the result](#8-analysing-the-result)
9. [What a p-value does not mean](#9-what-a-p-value-does-not-mean)
10. [When you cannot run an experiment](#10-when-you-cannot-run-an-experiment)
11. [The checklist](#11-the-checklist)
12. [Exercise 6](#exercise-6)

---

## 1. Why you cannot just compare before and after

You change Imboni's notification wording on Monday. Attendance confirmations rise 8%.
Did the wording work?

You cannot know. Competing explanations:

- **Seasonality** — it was exam week
- **Trend** — confirmations were already rising
- **Other changes** — you also deployed a speed improvement
- **Novelty** — people react to anything new, then stop
- **Regression to the mean** — the previous week was unusually bad

A/B testing removes all of these at once by running both versions **simultaneously**
on **randomly assigned** users. Randomisation is what makes the groups comparable in
every respect except the one you changed — including respects you never thought of.

## 2. The anatomy of an experiment

1. **Hypothesis** — specific and falsifiable, before you start
2. **Unit of randomisation** — user, session, school, class
3. **Metric** — one primary, decided in advance
4. **Minimum effect worth detecting** — the smallest change you would act on
5. **Sample size** — calculated from (4), before launch
6. **Duration** — calculated, with a floor of one full weekly cycle
7. **Run it** — without peeking at significance
8. **Analyse once**, at the planned end
9. **Decide** — ship, kill, or iterate

Steps 4, 5 and 8 are the ones people skip, and each one separately invalidates the
result.

## 3. Write the hypothesis down first

Bad: *"The new wording will improve engagement."*

Good: *"Changing the confirmation message from X to Y will increase the 48-hour parent
confirmation rate from a baseline of 62% by at least 3 percentage points."*

The good version commits you to a metric, a baseline, an effect size and a window —
which is what makes it impossible to redefine success after seeing the data.

## 4. Metrics: primary, secondary, guardrail

**Primary** — exactly one. The thing the decision rests on. More than one primary
metric means you will pick whichever wins, which is p-hacking with extra steps.

**Secondary** — things you want to understand, not decide on.

**Guardrail** — things that must not get worse, even if the primary improves. Page load
time, error rate, unsubscribe rate. A change that raises confirmations by 3% and
doubles complaints is not a win.

Choose metrics that are **sensitive** (they move when the thing you changed matters)
and **not gameable**. "Time on page" rises when users are confused.

## 5. Statistical power, and why underpowered tests waste everything

Four quantities are locked together; fix any three and the fourth follows:

| | Meaning | Convention |
|---|---|---|
| **α** | false positive rate — saying it worked when it did not | 0.05 |
| **β** | false negative rate | 0.2 |
| **Power** = 1 − β | chance of detecting a real effect | 0.8 |
| **MDE** | minimum detectable effect | you choose |

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect = proportion_effectsize(0.62, 0.65)        # baseline 62% -> 65%
n = NormalIndPower().solve_power(effect, power=0.8, alpha=0.05, alternative="two-sided")
print(f"{n:.0f} per group")                        # ~4,200 per group
```

Two consequences people find unwelcome:

- **Small effects need enormous samples.** Detecting a 1-point lift on a 62% baseline
  needs roughly 38,000 per group. If you do not have that traffic, you cannot detect
  that effect — and running the test anyway produces noise you will misread as signal.
- **An underpowered test that shows nothing tells you nothing.** It is not evidence of
  no effect. It is evidence that you could not have seen one.

For Imboni's scale this is the binding constraint. With a few hundred parents, you can
detect large effects only. **Knowing that in advance is the point** — it stops you
running a six-week test that was never capable of answering the question.

## 6. Randomisation

- **Randomise the right unit.** If one parent has three children, randomising by child
  means the same parent sees both variants. Randomise by parent.
- **Deterministic assignment:** `hash(user_id + experiment_name) % 100`. The same user
  always lands in the same bucket, across sessions and devices, without storing state.
- **Check the balance.** After assignment, compare the groups on known covariates. If
  they differ substantially on something that matters, your randomisation is broken.
- **A/A test first** if you are building the infrastructure. Run two identical variants;
  you should find no difference. If you find one, the pipeline is lying to you.

## 7. The ways people fool themselves

**Peeking.** Checking significance daily and stopping when p < 0.05 inflates your false
positive rate to roughly 30%. If you need to monitor continuously, use a sequential
method (always-valid p-values, Bayesian bandits) — not repeated fixed-horizon tests.

**Multiple comparisons.** Twenty metrics at α = 0.05 means one false positive expected
by chance. Correct for it (Bonferroni is crude and safe; Benjamini–Hochberg is better)
or declare one primary metric and stick to it.

**Post-hoc segmentation.** "It didn't work overall, but it worked for parents of
Primary 3 girls on Android" is noise unless that segment was specified in advance.

**Stopping early on a win.** Early results are the most extreme by construction.

**Ignoring novelty and primacy.** New things get attention; habituated users resist
change. Both fade. Run at least one full weekly cycle, preferably two.

**Sample ratio mismatch.** You expected 50/50 and got 52/48. With large n that is not
chance — it means assignment or logging is broken, and the whole result is suspect.
Check it every time; it is the cheapest sanity check available.

## 8. Analysing the result

For a proportion (confirmed / not confirmed):

```python
from statsmodels.stats.proportion import proportions_ztest

count = [1_284, 1_361]      # conversions
nobs  = [2_070, 2_094]      # users
stat, pval = proportions_ztest(count, nobs)
```

For a continuous metric, a t-test — but check the distribution first. Revenue and
duration are heavily skewed; the mean is dominated by outliers. Consider a transform,
a trimmed mean, or a non-parametric test.

**Always report a confidence interval, not just a p-value.** "+2.8pp, 95% CI
[0.4, 5.2]" tells you the effect is probably real and probably small. "p = 0.03" tells
you almost nothing about magnitude, and magnitude is what decides whether to ship.

## 9. What a p-value does not mean

Worth repeating because it is the most common misreading in the field:

- It is **not** the probability the hypothesis is true
- It is **not** the probability the result was chance
- p = 0.049 and p = 0.051 are not meaningfully different
- "Not significant" is **not** "no effect"
- Statistical significance is **not** practical significance — with enough data,
  trivial effects become significant

A p-value is: *the probability of seeing data at least this extreme if there were
genuinely no effect.* Nothing more.

## 10. When you cannot run an experiment

Sometimes randomisation is impossible — ethically, legally, or practically. You cannot
randomly assign children to receive worse notifications.

That is when you reach for the quasi-experimental methods in
[`07-CAUSAL_INFERENCE.md`](07-CAUSAL_INFERENCE.md): difference-in-differences,
regression discontinuity, instrumental variables. They are weaker than a randomised
experiment and they are much better than a before/after comparison.

## 11. The checklist

- [ ] Hypothesis written before launch, with baseline and MDE
- [ ] Exactly one primary metric; guardrails defined
- [ ] Sample size calculated; duration covers a full weekly cycle
- [ ] Randomisation unit correct; assignment deterministic
- [ ] A/A test passed if the infrastructure is new
- [ ] Sample ratio checked
- [ ] No peeking; analysed once at the planned end
- [ ] Confidence interval reported, not just a p-value
- [ ] Decision rule agreed before seeing results

---

## Exercise 6

1. Imboni has 340 parents and a 62% confirmation rate. Calculate the minimum detectable
   effect at 80% power over four weeks. Then state plainly whether an A/B test is
   worth running at all, and defend the answer.

2. Write the full experiment design for one real change to Imboni or Screening: every
   item in §2. One page.

3. Simulate peeking: generate two samples from the *same* distribution, test daily for
   30 days, and record how often you would have declared significance at some point.
   Run it 1,000 times and report the false positive rate.

4. Implement deterministic bucketing with a hash. Prove with a test that the same user
   always gets the same variant and that the split is close to 50/50 over 10,000 users.

5. Take a result of "+2.1pp, p = 0.04, n = 500 per group" and write the honest
   interpretation, including the confidence interval and what you would actually do.

6. Design an A/A test for Imboni and say exactly what result would make you distrust
   your own analytics pipeline.

Exercise 3 is the one that will change how you read other people's results.
