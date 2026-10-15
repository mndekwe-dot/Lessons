# 04 — Pipelines and Orchestration

**Week 33.** Making the whole thing run on a schedule, reliably, without you.

---

## Table of Contents

1. [The ML pipeline](#1-the-ml-pipeline)
2. [Start with what you have](#2-start-with-what-you-have)
3. [Every task must be idempotent](#3-every-task-must-be-idempotent)
4. [Validate before training](#4-validate-before-training)
5. [The training pipeline, with the gate](#5-the-training-pipeline-with-the-gate)
6. [Backfills](#6-backfills)
7. [Failure handling](#7-failure-handling)
8. [Where this lands for you](#8-where-this-lands-for-you)
9. [Exercise 4](#exercise-4)

---

## 1. The ML pipeline

```
ingest -> validate -> build features -> train -> evaluate -> gate -> register -> deploy -> score
```

Each stage can fail, and **the failures must be visible**. A pipeline that silently skips
a stage is worse than one that stops.

## 2. Start with what you have

**You already run Celery Beat.** For a school system that is very likely enough.

```python
# Imboni/celery.py
app.conf.beat_schedule = {
    'score-dropout-risk-nightly': {
        'task': 'apps.ml.tasks.score_all_students',
        'schedule': crontab(hour=2, minute=17),      # not :00 — stagger
    },
    'drift-report-weekly': {
        'task': 'apps.ml.tasks.drift_report',
        'schedule': crontab(hour=6, minute=0, day_of_week=1),
    },
}
```

**`minute=17`, not `minute=0`.** Everything in the world is scheduled on the hour. Stagger
your jobs — system design Ch 18, the thundering-herd lesson, applied to your own cron.

Reach for Airflow or Prefect when you need: complex dependency graphs, backfills over
historical dates, per-task retries with visibility, or a UI others use. **Not before.** A
scheduler is infrastructure to run, secure, upgrade and debug, and for one nightly scoring
job Celery Beat is the right answer.

## 3. Every task must be idempotent

The rule from `engineering-curriculum` Ch 12, and it applies with full force here.

```python
@shared_task
def score_all_students(run_id=None, scored_date=None):
    scored_date = scored_date or timezone.now().date()

    if ScoringRun.objects.filter(date=scored_date, status='complete').exists():
        logger.info('Already scored for %s — skipping', scored_date)
        return 'already_complete'

    run = ScoringRun.objects.create(date=scored_date, status='running',
                                    model_version=MODEL_VERSION)
    try:
        scores = compute_scores(scored_date)
        with transaction.atomic():
            RiskScore.objects.filter(scored_date=scored_date).delete()   # replace
            RiskScore.objects.bulk_create(scores, batch_size=1000)
            run.status, run.n_scored = 'complete', len(scores)
            run.save()
    except Exception:
        run.status = 'failed'
        run.save()
        raise
    return f'scored {len(scores)}'
```

**Ask of every task: what happens if this runs twice?** Here, delete-then-insert inside a
transaction makes a rerun safe. Appending would double every student's score and corrupt
every average downstream.

**The run row is not bookkeeping** — it is what makes the job observable, resumable, and
alertable when it stops happening.

## 4. Validate before training

A pipeline that trains on corrupted data and deploys is worse than one that fails loudly.

```python
def validate_training_data(df):
    errors = []
    if len(df) < 1000:
        errors.append(f'Only {len(df)} rows — expected >1000')
    if df['grade'].isna().mean() > 0.3:
        errors.append(f"Grade missing {df['grade'].isna().mean():.0%}")
    if not df['grade'].between(0, 100).all():
        errors.append('Grades outside 0-100')
    if df['target'].mean() < 0.005 or df['target'].mean() > 0.5:
        errors.append(f"Base rate {df['target'].mean():.1%} is implausible")
    if df.duplicated(subset=['student_id', 'term']).any():
        errors.append('Duplicate student-term rows')
    if errors:
        raise DataValidationError('; '.join(errors))
```

**The base-rate check is the most valuable line.** A change in how the label is derived —
someone edits a query, a status code changes meaning — shows up there immediately and
nowhere else.

`pandera` or Great Expectations formalise this; a function like the above is enough to
start and catches most of it.

## 5. The training pipeline, with the gate

```python
@shared_task
def retrain_dropout_model():
    df = load_training_data()
    validate_training_data(df)                        # raises, loudly

    model = train(df)
    new_score = evaluate(model, FIXED_HOLDOUT)        # never regenerated
    current = get_production_metrics()

    if new_score < current['pr_auc'] * 0.98:          # 2% tolerance for noise
        alert(f'Retrain WORSE: {new_score:.3f} vs {current["pr_auc"]:.3f} — not promoted')
        return 'rejected'

    for group, score in per_subgroup(model, FIXED_HOLDOUT).items():
        if score < current['subgroups'][group] * 0.95:
            alert(f'Subgroup {group} regressed — not promoted')
            return 'rejected_subgroup'

    register_model(model, stage='staging')
    alert('New model in staging, awaiting promotion')   # a human promotes
    return 'staged'
```

**Two things make this a real gate:**

- **The holdout is fixed.** Regenerating it each run means comparing against a moving
  target, and the comparison is meaningless.
- **Subgroups are checked, not just the aggregate.** A model that improves overall while
  getting worse for boarders is not an improvement
  (`03-classical-ml/03-MODEL_EVALUATION.md §8`).

**A human promotes to production.** Automated training is fine. Automated deployment of a
model that scores children is not.

## 6. Backfills

You will need to rescore history — a bug fix, a new feature, a corrected label.

```python
@shared_task
def backfill_scores(start_date, end_date, batch_days=7):
    for chunk_start in date_range(start_date, end_date, batch_days):
        score_all_students.delay(scored_date=chunk_start)   # idempotent, so safe
```

**Chunk it.** One transaction over two years of data holds locks and bloats the table —
system design Ch 19, the batched-backfill lesson.

**Put backfills on a separate queue.** A three-hour backfill on the same queue as
password-reset emails blocks them (Ch 12 §Queue separation).

## 7. Failure handling

```python
@shared_task(bind=True, max_retries=3, autoretry_for=(OperationalError,),
             retry_backoff=True, retry_jitter=True)
def score_all_students(self, ...):
    ...
```

Backoff **and** jitter. Without jitter, everything that failed together retries together,
forever, in lockstep.

**Not everything should retry.** A transient database error should. A data-validation
failure should not — retrying will not make the data valid, and three attempts just delays
the alert by an hour.

**Alert when a job stops happening**, not only when it fails. The silent stop is the one
that costs you three weeks of stale scores.

## 8. Where this lands for you

Realistically, for Imboni:

```
Nightly  02:17  score_all_students          Celery Beat
Weekly   Mon    drift_report                Celery Beat
Termly   manual retrain_dropout_model       triggered, gated, human-promoted
On demand       backfill_scores             separate queue
```

Four scheduled jobs, a run table, and three alerts. **That is a complete MLOps setup for a
system of your size**, and it uses infrastructure you already run. Resist adding Airflow
until you can name the specific thing Celery cannot do.

---

## Exercise 4

1. Build `score_all_students` with a run row and idempotency. **Run it twice for the same
   date and prove no duplicates.**
2. Write `validate_training_data` with at least six checks. Feed it deliberately corrupted
   data and confirm each check fires.
3. Build the training pipeline with the fixed holdout and the promotion gate. Train a
   deliberately worse model and confirm it is rejected.
4. Add the subgroup regression check. Construct a model that improves overall and degrades
   for one subgroup. Confirm it is rejected.
5. Implement a chunked backfill. Run it over 90 days. Compare wall time and lock behaviour
   against a single-transaction version.
6. Add retry with backoff and jitter. Then make a validation error and show it does **not**
   retry.
7. Write the "job stopped running" alert. Disable the schedule and confirm it fires.
8. Draw your pipeline end to end and mark every point where a silent failure is possible.
   Add a check at each one.
