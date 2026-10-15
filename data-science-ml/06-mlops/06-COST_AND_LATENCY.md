# 06 — Cost and Latency

*Extra.* The conversation that decides whether an ML feature survives its first budget
review.

---

## Table of Contents

1. [Know your cost per prediction](#1-know-your-cost-per-prediction)
2. [The cheapest optimisation is not doing the work](#2-the-cheapest-optimisation-is-not-doing-the-work)
3. [Model-side levers](#3-model-side-levers)
4. [LLM cost, specifically](#4-llm-cost-specifically)
5. [Latency budgets](#5-latency-budgets)
6. [Where the money actually goes](#6-where-the-money-actually-goes)
7. [Making the case](#7-making-the-case)
8. [Exercise 6](#exercise-6)

---

## 1. Know your cost per prediction

Most people cannot answer this. It is the first number anyone senior will ask for.

```python
def cost_per_1000_predictions():
    compute   = (INSTANCE_HOURLY / 3600) * SECONDS_PER_PREDICTION * 1000
    api       = LLM_COST_PER_CALL * 1000                    # if applicable
    storage   = MONTHLY_STORAGE / PREDICTIONS_PER_MONTH * 1000
    retrain   = MONTHLY_TRAINING_COST / PREDICTIONS_PER_MONTH * 1000
    return compute + api + storage + retrain
```

**Include retraining and storage.** People quote inference cost only, and then the monthly
bill is three times the estimate.

**A tree model on a CPU is essentially free.** 400,000 nightly predictions cost cents of
compute. **An LLM call is not** — at Opus 5 pricing, a 2,000-token prompt returning 500
tokens is roughly $0.02, so 400,000 of them is around $8,000. That is the difference
between a feature and a business case, and it is why `04-deep-learning/06` matters.

## 2. The cheapest optimisation is not doing the work

Before optimising the model:

- **Do you need per-request inference?** Batch is orders of magnitude cheaper
  (`02-MODEL_SERVING.md §1`).
- **Do you need to score everyone?** Score the students plausibly at risk, not all 400,000.
- **Do you need it nightly?** Weekly may be indistinguishable to the user.
- **Can you cache?** Identical inputs, identical outputs — cache them. **Include the tenant
  in the key.**

```python
@cache.memoize(timeout=3600)
def risk_score(school_id, student_id, features_hash):
    ...
```

**Batching also wins on throughput**, not only on architecture:

```python
model.predict_proba(X)             # 10,000 rows: ~50ms  — one vectorised call
[model.predict_proba(r) for r in X]  # 10,000 rows: ~30s  — 600x worse
```

Same lesson as `00-python-foundations/02-NUMPY.md §1`. The loop is the cost.

## 3. Model-side levers

In order of value for effort:

1. **A simpler model.** Logistic regression instead of a 1,000-tree ensemble is often
   within a point and 100× cheaper to serve.
2. **Fewer trees / smaller depth.** Measure the accuracy cost — it is usually tiny.
3. **Fewer features.** Each one has a fetch cost at serving time.
4. **Quantisation** (neural nets) — float32 to int8: ~4× smaller, ~2-3× faster, small
   accuracy loss.
5. **Distillation** — train a small model to imitate a large one.
6. **ONNX Runtime** — often 2-5× faster than the Python original, no accuracy change.

**Reaching for 4-6 before 1-3 is the usual mistake.** So is optimising inference when the
feature query dominates — measure first (`02-MODEL_SERVING.md §7`).

## 4. LLM cost, specifically

Current pricing, per million tokens:

| Model | Input | Output |
|---|---|---|
| Claude Opus 5 | $5.00 | $25.00 |
| Claude Sonnet 5 | $2.00 | $10.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |

**Levers in order — free ones before the ones that trade quality:**

1. **Prompt caching.** Up to ~90% off the cached prefix. Verify with
   `usage.cache_read_input_tokens`; if it is zero, something in your prefix varies.
2. **Input hygiene.** Stop sending retrieved chunks nobody reads. Twenty chunks are not
   better than five (`05-nlp-llms/03-RAG.md §5`).
3. **Output hygiene.** Output costs 5× input. Ask for less.
4. **Batch API.** 50% off for anything not latency-sensitive — overnight report generation
   is the obvious fit.
5. **Effort.** `low` for routine classification; measure before raising a default.
6. **Model choice.** Last, and measure — a cheaper model needing two attempts is not
   cheaper.

**Judge cost per completed task, not per request.**

```python
count = client.messages.count_tokens(model="claude-opus-5", messages=messages, system=system)
```

Know before you send.

## 5. Latency budgets

Set the budget from the user's experience, then allocate:

```
Budget: 300ms p95 for a dashboard widget
  network        80ms   (fixed — Rwanda to Europe; see system design Ch 2)
  auth + routing 20ms
  feature fetch  120ms  <- optimise HERE
  inference      15ms
  serialise      10ms
  headroom       55ms
```

**Feature fetching almost always dominates.** Fix the query, add the index, precompute —
before touching the model.

For anything genuinely slow, do not optimise: **make it asynchronous.** Return a job id,
poll or push the result. That is the exam-scheduler pattern from your system design
guide's worked designs, and it applies to any minutes-long ML job.

## 6. Where the money actually goes

For a system of your scale, roughly:

| | Typical share |
|---|---|
| **LLM API calls** | **Dominant, if you use them at all** |
| Training compute | Small — occasional, on CPU |
| Inference compute | Small — batch on existing servers |
| Storage | Negligible |
| **Your time** | **The real cost** |

**That last row is the honest one.** A pipeline you can maintain in an hour a month beats
one that is 20% cheaper to run and takes a day. You are a team of one — complexity is your
most expensive currency, exactly as in system design Ch 1.

## 7. Making the case

When a school or an investor asks whether it is worth it:

> "Scoring costs about $4 a month across all 500 schools — it runs on the servers we
> already have. The LLM assistant would cost roughly $180 a month at current usage, which
> is $0.36 per school. Retraining is a termly job, about an hour of compute.
>
> The dropout model flags about 30 students per school per term. If it prevents two
> genuine dropouts per school per year, at [value], it pays for itself many times over.
> That 'if' is unproven — measuring it needs outcome data we will not have for two terms,
> and I would not claim the benefit before then."

**Numbers, per-unit costs, and honesty about what is not yet demonstrated.** The last
paragraph is what makes the first two believable.

---

## Exercise 6

1. Compute cost per 1,000 predictions for your model, including retraining and storage.
2. Time `predict_proba` on a full array against a row loop over 10,000 rows. Report the
   ratio.
3. Break your latency down by stage. Which dominates? Optimise the largest and re-measure.
4. Take your RAG system. Compute cost per query with and without prompt caching. Verify
   the cache is hitting.
5. Compare full-precision against a simpler model on the same task: accuracy, latency,
   and cost. Where is the knee?
6. Run 100 documents through the Batch API. Compare cost and wall-clock against synchronous.
7. Write the §7 paragraph for one of your own features, with real numbers — including the
   sentence about what you have not yet proven.
