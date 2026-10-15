# 03 — Monitoring and Drift

**Week 32.** The most important file in this phase.

> **A broken ML system does not throw a 500. It returns confident nonsense.**

Your web monitoring catches crashes, latency, and error rates. None of that fires when a
model quietly stops working. This file is how you find out anyway.

---

## Table of Contents

1. [The four things that go wrong silently](#1-the-four-things-that-go-wrong-silently)
2. [What to monitor](#2-what-to-monitor)
3. [Detecting input drift](#3-detecting-input-drift)
4. [Training/serving skew — how to actually prevent it](#4-trainingserving-skew--how-to-actually-prevent-it)
5. [Outcome monitoring — the only ground truth](#5-outcome-monitoring--the-only-ground-truth)
6. [Alerting](#6-alerting)
7. [Retraining](#7-retraining)
8. [What to log for every prediction](#8-what-to-log-for-every-prediction)
9. [Exercise 3](#exercise-3)

---

## 1. The four things that go wrong silently

**Data drift** — the inputs change. Attendance recording moves from paper to the app, so
the numbers look different. The model is unchanged; its world is not.

**Concept drift** — the *relationship* changes. What predicted dropout in 2026 does not in
2028, because the school introduced bursaries. The inputs look normal.

**Training/serving skew** — features are computed one way in your notebook and another way
in production. The model receives inputs it was never trained on. **This one is present
from day one**, unlike the other two, and it is the most common cause of "it worked in the
notebook".

**Label drift** — the base rate moves. Your calibration and threshold silently become
wrong (`01-mathematics/03-PROBABILITY.md §3`).

## 2. What to monitor

Four layers, and most teams only build the first:

| Layer | Watch | Detects |
|---|---|---|
| **Operational** | Latency, errors, throughput | Crashes — what you already monitor |
| **Input** | Feature distributions, missing rate, new categories | Data drift, pipeline breakage |
| **Output** | Prediction distribution, mean score, refusal rate | Both drifts |
| **Outcome** | Predictions vs what actually happened | The truth. **Delayed.** |

**Start with layer 3.** It is one line to log and it catches an enormous amount.

```python
RiskScore.objects.create(
    student_id=sid, score=score, model_version=MODEL_VERSION,
    features_hash=hash_features(row), scored_at=now,
)
```

If the mean predicted risk jumps from 0.08 to 0.31 overnight, something broke. You do not
need labels to know that.

## 3. Detecting input drift

```python
from scipy import stats

def psi(expected, actual, bins=10):
    """Population Stability Index. <0.1 stable, 0.1-0.25 moderate, >0.25 significant."""
    breakpoints = np.percentile(expected, np.linspace(0, 100, bins + 1))
    breakpoints[0], breakpoints[-1] = -np.inf, np.inf
    e = np.histogram(expected, breakpoints)[0] / len(expected)
    a = np.histogram(actual, breakpoints)[0] / len(actual)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return np.sum((a - e) * np.log(a / e))
```

**PSI is the industry standard** and its thresholds are conventions, not laws — calibrate
them on your own data before alerting on them.

The KS test also works, but **beware significance on large samples**: with 400,000 rows,
a trivially small distribution shift is "highly significant"
(`01-mathematics/02-STATISTICS.md §5`). Use effect size, not p-values, for drift.

Also monitor, per feature:

- **Missing rate.** A jump from 2% to 40% means an upstream pipeline broke.
- **New categorical values.** A new district your encoder has never seen.
- **Range violations.** Attendance above 100% again.

## 4. Training/serving skew — how to actually prevent it

The structural fix, in order of strength:

1. **Ship preprocessing inside the artefact** (`02-MODEL_SERVING.md §3`). Removes the
   entire class of bug for anything inside the pipeline.
2. **Compute features once**, in shared code, used by both training and serving. Never two
   implementations.
3. **Log the features you actually served**, then compare against training statistics.

```python
# The detection, when prevention was incomplete
served = ServedFeature.objects.filter(date=yesterday).to_dataframe()
for col in FEATURE_COLUMNS:
    score = psi(training_stats[col], served[col])
    if score > 0.25:
        alert(f'Feature drift on {col}: PSI={score:.3f}')
```

**The subtle version that survives all of the above:** a feature defined as "absences in
the last 30 days" computed at training time over a complete history, but at serving time
over whatever has been *entered so far*. Same code, different data availability. Only
outcome monitoring catches that.

## 5. Outcome monitoring — the only ground truth

```python
# Dropout is knowable only at end of term. Join back then.
outcomes = RiskScore.objects.filter(
    scored_at__range=(term_start, term_end)
).annotate(actual=...)
current_auc = roc_auc_score(outcomes.actual, outcomes.score)
```

**The feedback delay is the hard part.** Dropout is known months later. Your model could be
degrading for a full term before any label arrives.

So use whatever partial signal exists sooner: did a flagged student's attendance recover?
Did staff act on the flag? Did they mark it as unhelpful? A thumbs-down button on a
prediction is a cheap, immediate label — and often the only one you get.

**Beware the feedback loop.** If flagged students get support and therefore do not drop
out, your model looks wrong *because it worked*. Measuring a model whose predictions
trigger interventions requires either a holdout group who are not flagged — which is an
ethical decision, not a technical one — or accepting that your metric is confounded and
saying so.

## 6. Alerting

```yaml
- alert: PredictionDistributionShift
  expr: abs(avg_prediction_1h - avg_prediction_7d) > 0.15
  for: 30m
- alert: FeatureMissingRateSpike
  expr: feature_missing_rate > 3 * baseline_missing_rate
- alert: ModelNotScoring
  expr: time_since_last_batch_score > 26h
```

**That last one catches the most embarrassing failure**: the nightly job silently stopped
three weeks ago and the dashboard has been showing stale scores. Nothing errored.

Alert on **sustained** change, not a single spike (`for: 30m`), and add jitter to
scheduled checks — the thundering-herd lesson from system design Ch 18.

## 7. Retraining

**Triggers, in order of preference:**

1. **Performance-based** — retrain when measured performance drops. Best, needs labels.
2. **Drift-based** — retrain when PSI crosses a threshold. Good proxy when labels are slow.
3. **Scheduled** — every term. Simple, and a reasonable default for a school system whose
   rhythm is termly anyway.

**Automated retraining needs a gate.** A pipeline that retrains and deploys unattended
will one day train on corrupted data and deploy a broken model at 3 a.m.

```
retrain -> evaluate on a FIXED holdout -> compare to current production
        -> if worse, do not promote, alert a human
        -> if better, shadow deploy, then promote
```

**The fixed holdout must not be regenerated each time**, or you are comparing against a
moving target and the comparison means nothing.

## 8. What to log for every prediction

```python
{
  'prediction_id': uuid4(),
  'model_version': '2026-09-08.3',
  'training_data_hash': 'a3f21c...',
  'features': {...},            # or a hash, if privacy requires
  'prediction': 0.31,
  'threshold': 0.25,
  'school_id': 12,
  'scored_at': '...',
  'outcome': None,              # filled in later
  'acted_on': None,             # did a human do anything?
}
```

**Model version and training-data version on every prediction** is the Phase 7 checkpoint
requirement. Without it, "why was this student flagged in March?" is unanswerable — and in
a school that is a question you will be asked by someone entitled to an answer.

Mind what you log: raw features on a student are personal data, subject to your retention
policy (`07-enterprise/01`). Hash them if you only need drift detection.

---

## Exercise 3

1. Implement PSI. Compute it between your training data and a deliberately shifted copy.
   Verify it crosses 0.25 where you expect.
2. Log every prediction with the schema in §8. Backfill for a week of batch scores.
3. Build a drift report: PSI per feature, missing rates, new categories, prediction
   distribution. Schedule it weekly.
4. **Simulate training/serving skew**: scale a feature differently at serving time. Show
   predictions change materially while nothing errors. Then show the pipeline artefact
   prevents it.
5. Simulate a broken upstream: set one feature to null for 40% of rows. Does your
   monitoring catch it? How long would it have taken?
6. Write the three alerts in §6 with thresholds calibrated on your own data.
7. Answer in writing: **"The model has been live six months. How would you know if it had
   quietly stopped working?"** This is the Checkpoint 7 question.
8. Design the retraining gate, including what happens when the new model is worse.

Exercise 7 is the one that matters. If your answer is "someone would probably notice", you
have not built monitoring.
