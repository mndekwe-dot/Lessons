# 02 — Model Serving

**Week 31.** Getting the model to where users are. This is Django and Docker again — you
have done this part before.

---

## Table of Contents

1. [Batch or real-time?](#1-batch-or-real-time)
2. [Real-time serving](#2-real-time-serving)
3. [Package the pipeline, never the estimator](#3-package-the-pipeline-never-the-estimator)
4. [Where the model file lives](#4-where-the-model-file-lives)
5. [Health checks](#5-health-checks)
6. [Versioning the API contract](#6-versioning-the-api-contract)
7. [Latency](#7-latency)
8. [Rollback](#8-rollback)
9. [Exercise 2](#exercise-2)

---

## 1. Batch or real-time?

The first question, and people default to real-time when they do not need it.

| | Batch | Real-time |
|---|---|---|
| When | Overnight, hourly | Per request |
| Latency | Minutes to hours | Milliseconds |
| Complexity | **Low** | Higher |
| Cost | Low | Higher |
| Serves | A precomputed table | A live API |

**For a dropout-risk model, batch is almost certainly correct.** Scores computed nightly,
written to a table, read by the dashboard. No serving infrastructure, no latency budget,
trivially cacheable, and a school does not need a risk score recomputed the instant an
attendance mark changes.

```python
# management/commands/score_dropout_risk.py
class Command(BaseCommand):
    def handle(self, *args, **opts):
        model = joblib.load(settings.MODEL_PATH)
        students = build_features(Student.objects.filter(is_active=True))
        scores = model.predict_proba(students)[:, 1]
        RiskScore.objects.bulk_create([
            RiskScore(student_id=sid, score=s,
                      model_version=MODEL_VERSION, scored_at=now)
            for sid, s in zip(students.index, scores)
        ], batch_size=1000)
```

Note `bulk_create` — the same lesson as
`engineering-curriculum/06-system-design/01-ADVANCED_SYSTEM_DESIGN.md §2`. Looping
`.save()` over 400,000 students is 400,000 transactions.

Run it from Celery Beat. **You already have that infrastructure in Imboni.**

**Choose real-time only when the input does not exist until the request** — a form being
submitted, a query being typed, an image being uploaded.

## 2. Real-time serving

```python
# apps/ml/services.py
from functools import lru_cache
import joblib

@lru_cache(maxsize=1)
def get_model():
    """Loaded once per process, not per request."""
    bundle = joblib.load(settings.MODEL_PATH)
    return bundle['pipeline'], bundle['version'], bundle['features']


class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pipeline, version, features = get_model()

        df = pd.DataFrame([request.data])[features]      # column ORDER matters
        prob = float(pipeline.predict_proba(df)[0, 1])

        return Response({
            'probability': round(prob, 4),
            'model_version': version,          # always return this
            'threshold': settings.RISK_THRESHOLD,
        })
```

**Three things in that snippet are load-bearing:**

- **Load once, not per request.** Deserialising a model per request adds hundreds of
  milliseconds and is the most common serving mistake.
- **Select columns by the stored feature list.** A DataFrame with columns in a different
  order produces silently wrong predictions — no error, just nonsense.
- **Return the model version.** You cannot debug a prediction you cannot attribute.

**Remember Gunicorn's worker model** (system design Ch 3): a synchronous worker serves one
request at a time. A 300 ms model call ties up a worker for 300 ms. Four workers means
roughly 13 predictions per second, and one slow model can starve your whole site. Measure
before assuming it fits.

## 3. Package the pipeline, never the estimator

```python
joblib.dump({
    'pipeline': pipe,                        # preprocessing INCLUDED
    'version': '2026-09-08.3',
    'features': list(X_train.columns),
    'sklearn_version': sklearn.__version__,
    'trained_at': datetime.now(timezone.utc).isoformat(),
    'training_data_hash': data_hash,
    'threshold': chosen_threshold,
}, 'model.joblib')
```

If preprocessing lives outside the artefact, you must reimplement it at serving time — and
any difference between the two implementations is **training/serving skew**, the subject
of the next file. Shipping the pipeline makes that class of bug impossible.

## 4. Where the model file lives

| Option | Trade |
|---|---|
| In the image | Simple, immutable, versioned with code. Big images. **Start here.** |
| Object storage, fetched at start | Smaller images, decoupled. A startup dependency |
| Fetched per request | Never do this |
| Model registry at start | Cleanest at scale |

**Baking it into the image is right for you.** One artefact, one version, rollback is a
container rollback — which you already know how to do.

## 5. Health checks

```python
class MLHealthView(APIView):
    def get(self, request):
        try:
            pipeline, version, features = get_model()
            pipeline.predict_proba(pd.DataFrame([SMOKE_ROW])[features])
        except Exception:
            return Response({'status': 'unhealthy'}, status=503)
        return Response({'status': 'ok', 'model_version': version})
```

**Predict on a fixed row rather than just checking the file loads.** A model that loads and
then throws on the first real input is a health check that lies.

Cache the result for a few seconds — a load balancer polling every two seconds should not
run inference every two seconds (system design Ch 10 §Health checks).

## 6. Versioning the API contract

```
POST /imboni/ml/dropout-risk/v1/
```

**Version the endpoint, not just the model.** A new model that returns a different field,
or the same field with different semantics, breaks callers. Run v1 and v2 side by side
until callers migrate.

Changing what a score *means* while keeping its name is worse than changing the name.
A "risk score" that shifts from a probability to a percentile silently invalidates every
threshold anyone set.

## 7. Latency

Budget it explicitly:

```
Total 200ms  =  feature fetch 80  +  preprocess 20  +  inference 15  +  serialise 5  +  network 80
```

**Feature fetching usually dominates**, not inference. A tree model predicts in
microseconds; the database query behind its features takes 80 ms. Optimise the query, not
the model.

If you need speed: precompute features, cache them, use a smaller model, or move to batch —
in that order. Reaching for ONNX or quantisation before checking where the time actually
goes is the ML version of optimising the wrong thing.

## 8. Rollback

```python
MODEL_VERSION = config('MODEL_VERSION', default='2026-09-08.3')
```

**The rollback question, asked before every deploy:** if this model is wrong, how do I
revert, and how long does it take? If the answer is "retrain it", you do not have a
rollback.

Keep the previous model artefact. Keep a documented, *tested* procedure. Same discipline
as system design Ch 19 — and note that unlike code, a model rollback does not undo the
predictions already written to your database. Decide in advance what happens to those.

---

## Exercise 2

1. Build a batch scoring management command for a real model. Run it with `bulk_create`
   and with a `.save()` loop. Report the time difference on 10,000 rows.
2. Schedule it with Celery Beat. Confirm it runs and is idempotent — running twice must
   not double-write.
3. Build a real-time endpoint. Measure p50 and p99 latency under load.
4. Deliberately load the model per request instead of once. Measure the difference.
5. Pass a DataFrame with columns in the wrong order. **Show that it predicts, wrongly, with
   no error.** Then add the guard that prevents it.
6. Break down your latency budget by stage. Which stage dominates? Was it inference?
7. Write and **test** a rollback: deploy v2, roll back to v1, confirm predictions change
   back. Time it.
8. Write the health check. Then break the model file and confirm the check returns 503.
