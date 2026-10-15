# 02 — Ethics and Bias

**Week 36. This file is the gate.**

**Do not train on real student or patient records until you have read this and completed
its exercise.** Not a formality — Imboni holds children's education records and Screening
holds mental health responses, and the failure modes here harm actual children rather than
degrading a metric.

---

## Table of Contents

1. [The question that comes before the model](#1-the-question-that-comes-before-the-model)
2. [Bias is in the data before it is in the model](#2-bias-is-in-the-data-before-it-is-in-the-model)
3. [Fairness has several definitions and they conflict](#3-fairness-has-several-definitions-and-they-conflict)
4. [Measuring it](#4-measuring-it)
5. [Mitigation](#5-mitigation)
6. [The non-negotiables for a children's system](#6-the-non-negotiables-for-a-childrens-system)
7. [Screening specifically](#7-screening-specifically)
8. [Write it down](#8-write-it-down)
9. [Exercise 2 — the gate](#exercise-2--the-gate)

---

## 1. The question that comes before the model

Not "how accurate is it?" but:

> **What happens to a real child when this is wrong?**

Not in aggregate. One named 14-year-old, flagged as a dropout risk, who was not.

- Who sees the flag?
- What do they do differently?
- Does the child know? Does the family?
- Can they contest it? To whom?
- What is the record, and how long does it follow them?

**If you cannot answer all five, the model is not ready**, however good the AUC.

## 2. Bias is in the data before it is in the model

A model learns the patterns in its training data, including the unfair ones. It cannot tell
a real relationship from a historical injustice — both are just correlation.

Concretely, for a school:

- If teachers historically marked boarders more harshly, a model predicting grades learns
  to predict lower grades for boarders.
- If girls were historically discouraged from sciences, a subject-recommendation model
  learns to discourage them.
- If a district's schools were under-resourced, a model learns that district predicts poor
  outcomes — and recommends less investment there.

**The model then presents this as objective**, which is worse than a biased human, because
a human can be argued with and a number appears neutral. This is the mechanism by which ML
systems make historical unfairness durable and harder to challenge.

**Removing the sensitive attribute does not fix it.** Drop `sex` and the model finds
proxies — subject choices, sports, boarding status. Drop `district` and it uses distance
from school. **Proxies are the rule, not the exception**, and blindness prevents you from
measuring the problem while doing nothing about it.

## 3. Fairness has several definitions and they conflict

There is no single "fair". These are the main ones, and they are **mathematically
incompatible** except in trivial cases:

| Definition | Means |
|---|---|
| **Demographic parity** | Equal flag *rates* across groups |
| **Equal opportunity** | Equal *recall* — you catch the same share of true cases in each group |
| **Equalised odds** | Equal recall *and* equal false-positive rate |
| **Calibration within groups** | A 0.8 means 0.8 in every group |

**You cannot satisfy calibration and equalised odds simultaneously when base rates
differ** — this is a proven impossibility, not an engineering shortfall. So you must
**choose**, and defend the choice.

**For a support-allocation model, equal opportunity is usually the right one.** If 10% of
boarders and 5% of day students are genuinely at risk, demographic parity would force you
to flag them at equal rates — under-serving boarders. What you want is to catch the same
*proportion of those genuinely at risk* in each group.

Making that choice explicitly, and writing down why, is the work.

## 4. Measuring it

```python
def fairness_report(y_true, y_pred, y_prob, groups):
    rows = []
    for g in groups.unique():
        m = groups == g
        rows.append({
            'group': g,
            'n': m.sum(),
            'base_rate': y_true[m].mean(),
            'flag_rate': y_pred[m].mean(),          # demographic parity
            'recall': recall_score(y_true[m], y_pred[m]),      # equal opportunity
            'fpr': ((y_pred[m] == 1) & (y_true[m] == 0)).sum() / (y_true[m] == 0).sum(),
            'precision': precision_score(y_true[m], y_pred[m]),
            'auc': roc_auc_score(y_true[m], y_prob[m]),
        })
    return pd.DataFrame(rows)
```

**Run this for every group you can identify**: sex, boarding status, district, class,
language, age band, and disability status if recorded.

**Small groups produce unstable estimates.** With 30 students in a group, recall has a very
wide confidence interval (`01-mathematics/02-STATISTICS.md §4`). Report the interval, and
do not act on a difference you cannot distinguish from noise — in either direction.

**Intersections matter and are usually skipped.** A model can be fine for girls and fine
for boarders while failing badly for girls who board. Check at least the pairwise
intersections of your largest groups.

## 5. Mitigation

| Stage | Approach | Note |
|---|---|---|
| **Pre-processing** | Reweight, resample, repair features | Changes the data |
| **In-processing** | Fairness constraint in the objective | Changes the model |
| **Post-processing** | **Per-group thresholds** | Changes the decision |

**Per-group thresholds are the most practical**, and they are transparent — you can write
down exactly what you did.

```python
# equal opportunity: choose each group's threshold to hit the same recall
thresholds = {g: threshold_for_recall(y_true[m], y_prob[m], target=0.70)
              for g, m in group_masks.items()}
```

**And be honest that this is affirmative action in code.** Different thresholds by group
means treating people differently based on group membership. That may be exactly right —
it is how you correct for an unequal base rate — but it is a **policy decision belonging to
the school**, not a parameter you tune quietly. Put it in the model card. Say it out loud.

## 6. The non-negotiables for a children's system

**1. A human decides.** The model suggests; a person acts, sees the reasoning, and can
overrule. Never an automated decision affecting a child's education.

**2. There is an appeal.** A named route for a family to contest. If the answer is "the
algorithm said so", you have built something indefensible.

**3. The subject is told.** Being profiled without knowing is not acceptable, whatever the
law's minimum.

**4. It only ever adds support, never removes it.** A model that allocates extra help is
defensible. One that streams children into lower sets, denies opportunities, or triggers
discipline is not — the same score, used subtractively, becomes a different thing entirely.

**5. Never optimise a proxy for a child's worth.** Predict "would benefit from support",
not "will succeed".

**6. Some things you do not build**, regardless of accuracy or who asks:

- Face recognition or emotion detection on children
- Predicting mental health *diagnoses* for individuals
- Anything scoring a child's character, potential, or worth
- Anything you could not explain, calmly, to the child's parent

## 7. Screening specifically

Mental health data is a different tier again. A false positive stigmatises a child; a false
negative gives false reassurance to someone who needed help. Neither error is recoverable
by a later correction.

**Do not build individual mental-health prediction as a learning exercise.** If you want a
project in that space, model something **operational**: appointment no-shows, demand for
counselling capacity, resource planning. Same skills, no individual clinical inference.

Anything touching individual clinical prediction needs genuine ethical review — not your
own judgment, however careful.

## 8. Write it down

Every model that touches people gets a model card
(`05-MODEL_CARDS.md`). The ethics-specific sections:

- The fairness definition you chose, and **why you chose it over the alternatives**
- Per-subgroup performance, with confidence intervals
- Known limitations and populations where it performs worse
- Intended use — and explicit **out-of-scope** uses
- Who is accountable
- How a person contests a decision

**If you cannot write that page, you do not understand your own system well enough to be
running it on children.**

---

## Exercise 2 — the gate

Complete this before touching real records. Record the date in `PROGRESS.md`.

1. For your dropout model, answer all five questions in §1, in writing.
2. Build the fairness report across at least four groupings **plus two intersections**.
   Include confidence intervals.
3. Find a subgroup where the model performs materially worse. **What would you do?**
4. Demonstrate proxy discrimination: remove `sex`, then show a model can still predict it
   from the remaining features above chance.
5. Choose a fairness definition. Write two paragraphs defending it against the
   alternatives.
6. Implement per-group thresholds for equal opportunity. Report the effect on overall
   performance — **there will be a cost; state it.**
7. Write the paragraph you would give a parent whose child was flagged: the drivers, what
   would change it, that a human decides, and the honest error rate.
8. Write the **refusal** you would send if a school asked you to build automatic streaming
   by predicted performance. Two paragraphs, respectful, and clear that the answer is no.
9. Write your data-protection basis for the training data (`01-DATA_GOVERNANCE.md §2`).

**Exercise 8 is the one you will actually need.** Somebody will ask. Having written it
before the moment is what makes it possible to say.
