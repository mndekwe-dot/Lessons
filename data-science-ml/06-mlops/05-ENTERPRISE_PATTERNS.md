# 05 — Enterprise Patterns

**Week 34.** The patterns that appear once more than one model, one team, or one customer
is involved.

Read this to know what these terms mean and when they start to earn their cost — not as a
list to implement.

---

## Table of Contents

1. [Feature stores](#1-feature-stores)
2. [Model registry](#2-model-registry)
3. [Shadow deployment](#3-shadow-deployment)
4. [Canary and A/B](#4-canary-and-ab)
5. [Multi-model and multi-tenant](#5-multi-model-and-multi-tenant)
6. [CI/CD for models](#6-cicd-for-models)
7. [What to actually build, in order](#7-what-to-actually-build-in-order)
8. [Exercise 5](#exercise-5)

---

## 1. Feature stores

**The problem they solve:** the same feature computed in two places drifts apart. A
notebook computes "absences in 30 days" one way; the serving code computes it another. That
is training/serving skew (`03-MONITORING_AND_DRIFT.md §4`), and at scale it happens
constantly because different people write the two implementations.

**The idea:** define each feature once. An offline store serves training (historical,
point-in-time correct); an online store serves inference (current values, low latency).

```
feature definition (one place)
    ├── offline store (warehouse) -> training
    └── online store (Redis)      -> serving
```

**Point-in-time correctness** is the hard part and the real value. Building a training set
for a student scored on 1 March must use the feature values *as they were* on 1 March —
not today's. Doing that by hand is where temporal leakage creeps back in
(`03-classical-ml/04-LEAKAGE.md §4`).

**When you need one:** several models sharing features, several people building them, or
features expensive enough to be worth precomputing. Tools: Feast (open source), or your
cloud's managed offering.

**When you do not:** one model, one person. **A shared `features.py` used by both training
and serving gives you most of the benefit for none of the cost.** Write that first.

## 2. Model registry

Covered in `01-EXPERIMENT_TRACKING.md §9`. What it adds beyond a versioned file:

- One place that answers *what is in production*
- Stage transitions with an audit trail (who promoted, when, on what evidence)
- Lineage back to the run, the data, the commit
- The previous version, ready to restore

**Once a model affects real people, "what was deployed on 3 March and who approved it" is a
question you will be asked.** A registry answers it in seconds.

## 3. Shadow deployment

Run the new model alongside the old, on live traffic. **Serve the old one's output; log
both.**

```python
def predict(features):
    result = production_model.predict_proba(features)[0, 1]
    try:
        candidate = shadow_model.predict_proba(features)[0, 1]
        log_shadow(features_hash, result, candidate)
    except Exception:
        logger.warning('shadow failed', exc_info=True)      # never break production
    return result
```

**The safest way to validate a model**, because it sees real production inputs with no risk
to users. It catches exactly what offline evaluation cannot: skew, unexpected input
distributions, latency under real load, and crashes on data your test set never contained.

Note the `try/except`. The shadow model must never be able to break the real path.

**Run it for at least one full business cycle.** For a school, a term — a week tells you
nothing about exam period.

## 4. Canary and A/B

**Canary** — send 5% of traffic to the new model, watch, increase. This is about *safety*.

**A/B test** — split traffic and measure which produces better **outcomes**. This is about
*value*, and it is a different question.

Model A having higher AUC does not mean it produces better outcomes. What matters is
whether flagged students actually get support and stay in school. **Offline metrics are a
proxy; outcomes are the thing.**

**And here it becomes an ethics question, not a statistics one.** An A/B test where one
group of children receives support and the other does not is a randomised trial on minors.
That needs the `07-enterprise/02` gate, informed consent from the school, and probably
ethical review. **Do not run it because it is technically easy.**

The honest alternative: A/B test the *interface* (does a clearer explanation make staff act
more often?) rather than withholding support from a control group.

## 5. Multi-model and multi-tenant

At 500 schools you face a real design choice:

| Approach | Trade |
|---|---|
| **One global model** | Simple; learns across all schools; may fit none well |
| **One model per school** | Tailored; 500 models to train, monitor, version. Small schools have too little data |
| **Global + school features** | **Usually right.** One model, school characteristics as features |
| Global + per-school threshold | One model, locally-tuned decisions. Cheap and effective |

**Start global with school-level features.** The last row is the underrated one: a single
model with a threshold tuned per school captures much of the benefit of local models at
almost none of the cost, because the threshold is the decision anyway
(`02-data-wrangling/05-IMBALANCED_DATA.md §2`).

**Whatever you choose, the tenant scoping rules from `05-nlp-llms/06-LLM_SECURITY.md §2`
still apply**: training data, features, predictions and caches all scoped by `school_id`.

## 6. CI/CD for models

```yaml
on: [pull_request]
jobs:
  ml-checks:
    steps:
      - run: pytest tests/test_features.py          # transformations
      - run: python -m src.validate_data            # schema and ranges
      - run: python -m src.train --quick            # trains at all?
      - run: python -m src.evaluate --holdout       # meets a floor?
      - run: python -m src.check_subgroups          # no group regressed
```

**Two things differ from normal CI:**

- **It is slow and expensive.** Train on a subsample in CI; full training on merge.
- **The tests are about the pipeline, not the model's accuracy.** Assert that features
  compute correctly, that the model trains, that it beats a floor — never assert an exact
  score, which will flake.

## 7. What to actually build, in order

For a system of your size, honestly:

1. **`features.py` shared by training and serving.** Free; removes the biggest bug class.
2. **A model registry** (MLflow). A day; answers the accountability questions.
3. **Shadow deployment.** Twenty lines; the safest validation available.
4. **Per-school thresholds.** Cheap; most of the value of per-school models.
5. **A feature store** — only when several models share features.
6. **A/B testing** — only with the ethics work done first.

**Items 1 through 4 are a complete, professional setup for your scale.** Items 5 and 6 are
where teams spend a year and get little back.

---

## Exercise 5

1. Write `features.py` used by both your training script and your serving code. Add a test
   that both produce identical output for the same input row.
2. Set up an MLflow registry. Promote a model, then answer from the registry alone: what is
   in production, which run made it, and what was the previous version?
3. Implement shadow deployment. Run both models over a week of real inputs. **How often do
   they disagree, and on which cases?**
4. Show that a crashing shadow model does not break production.
5. Compare one global model against per-school models on synthetic multi-school data.
   Include a school with only 50 students. Which approach wins, and where?
6. Implement per-school thresholds tuned on each school's own capacity. Compare against one
   global threshold.
7. Write the ML CI workflow. Make it fail on a subgroup regression.
8. Write two paragraphs on why you would *not* A/B test a dropout-support intervention
   without ethical review. This is a Phase 8 rehearsal.
