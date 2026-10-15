# 01 — Experiment Tracking and Reproducibility

**Week 30.** Same data plus same code equals the same model — a year later, on a different
machine.

---

## Table of Contents

1. [The problem](#1-the-problem)
2. [What must be recorded](#2-what-must-be-recorded)
3. [MLflow](#3-mlflow)
4. [Data versioning](#4-data-versioning)
5. [Seeds are necessary and not sufficient](#5-seeds-are-necessary-and-not-sufficient)
6. [Pin the environment](#6-pin-the-environment)
7. [Naming and organisation](#7-naming-and-organisation)
8. [The reproducibility test](#8-the-reproducibility-test)
9. [Model registry](#9-model-registry)
10. [Exercise 1](#exercise-1)

---

## 1. The problem

Six months in you have run four hundred experiments. Someone asks which model is in
production and why. You have: a folder of notebooks, `model_final_v3_actually_final.pkl`,
and a memory that the good one used more trees.

Worse, you cannot rebuild it. The data has changed, the library version moved, and the
seed was never set.

**Reproducibility is not tidiness.** It is the difference between an asset and an artefact
you happen to possess.

## 2. What must be recorded

For every run, all six:

| | Why |
|---|---|
| **Code version** | Git commit — and whether the tree was dirty |
| **Data version** | A hash or snapshot id. Data changes silently |
| **Parameters** | Every hyperparameter, including the defaults you did not set |
| **Metrics** | All of them, per subgroup, not just the headline |
| **Environment** | Library versions, Python version, hardware |
| **Artefacts** | The model file, plots, the feature list |

**The data version is the one people miss**, and it is the one that breaks reproduction.
A query against a live database returns different rows every day. `SELECT * FROM results`
in March and in September are different datasets with the same name.

## 3. MLflow

```python
import mlflow, mlflow.sklearn, subprocess, hashlib

mlflow.set_experiment('dropout-risk')

with mlflow.start_run(run_name='lgbm-with-attendance-trend'):
    mlflow.log_params(params)
    mlflow.set_tags({
        'git_commit': subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),
        'git_dirty': bool(subprocess.check_output(['git','status','--porcelain'])),
        'data_hash': hashlib.sha256(X.to_csv().encode()).hexdigest()[:16],
        'data_snapshot': '2026-09-08',
    })

    model.fit(X_train, y_train)

    mlflow.log_metrics({'roc_auc': auc, 'pr_auc': pr_auc, 'recall_at_30': r30})
    for group, score in per_subgroup_scores.items():          # always log these
        mlflow.log_metric(f'auc_{group}', score)

    mlflow.sklearn.log_model(model, 'model', input_example=X_train.head())
    mlflow.log_artifact('feature_importance.png')
```

`mlflow ui` gives you a searchable, sortable table of every run. That alone repays the
setup cost within a week.

**`git_dirty` is worth the extra line.** A run from an uncommitted working tree is not
reproducible, and you want to know that at the time rather than later.

## 4. Data versioning

Three options, in increasing rigour:

**Snapshot with a date and hash** — dump the exact training set to Parquet, hash it,
record both. Simple; costs disk.

```python
X.to_parquet(f'data/snapshots/train_{date}.parquet')
```

**DVC** — git for large files. The repo holds a pointer; the data lives in object storage.
Fits naturally if you already think in git.

**A query with an as-of timestamp** — the most elegant, if your schema supports it:

```sql
SELECT * FROM results WHERE created_at <= '2026-09-08'
```

This requires that rows are never updated in place, only appended. Most systems, including
Imboni, do update in place — so this option is unavailable unless you design for it, which
is worth knowing before you need it.

## 5. Seeds are necessary and not sufficient

```python
SEED = 42
random.seed(SEED); np.random.seed(SEED); torch.manual_seed(SEED)
```

A seed makes a run repeatable. It does not make the result *real* — a model that only
looks good on seed 42 is a coincidence
(`03-classical-ml/03-MODEL_EVALUATION.md §7`). Report across several seeds.

**Other sources of non-determinism** that catch people:

- GPU operations (`torch.backends.cudnn.deterministic = True`, at a performance cost)
- Parallelism — thread scheduling changes float summation order
- Python dict/set iteration order across versions
- Anything reading "now"

## 6. Pin the environment

```
scikit-learn==1.7.2
lightgbm==4.6.0
pandas==2.3.1
numpy==2.3.4
```

**A model pickled under one scikit-learn version may not load under another** — and that
failure arrives months later, in production, at the worst moment. This is the same lesson
as `02-data-wrangling/04-PIPELINES.md §7`: save the environment with the model.

Better still, containerise. A Dockerfile is a reproducible environment, and you already
know how to write one — `engineering-curriculum/05-deployment/01-DOCKER_GUIDE.md`.

## 7. Naming and organisation

```
runs/2026-09-08_lgbm_attendance-trend_a3f21c/
    params.json
    metrics.json
    model.joblib
    features.txt
    notes.md
```

Date, model, what was tried, commit hash. **Never `final`, `v2`, or `new`.** In three
months every one of those names is meaningless, and you will have two of them.

`notes.md` — one paragraph on *why* you tried this and what you expected. When you revisit
a run, the reasoning is what you have lost, not the numbers.

## 8. The reproducibility test

```bash
git checkout <commit>
docker build -t exp . && docker run exp python -m src.train --seed 42 --data-snapshot 2026-09-08
# identical metrics?
```

**Run this deliberately, once, before you need it.** Something will fail. Finding out now
costs an afternoon; finding out when a school asks how a decision about their student was
made costs your credibility.

## 9. Model registry

```python
mlflow.register_model(f'runs:/{run_id}/model', 'dropout-risk')
client.transition_model_version_stage('dropout-risk', version=3, stage='Production')
```

The registry answers, in one place: what is deployed, what run produced it, who approved
it, and what the previous version was. That last one is your rollback.

**Every prediction should be able to name the model version that produced it.** That is
the Phase 7 checkpoint requirement, and it starts here.

---

## Exercise 1

1. Set up MLflow. Log ten real runs with all six categories from §2, including
   per-subgroup metrics and `git_dirty`.
2. Snapshot and hash your training data. Record the hash with each run.
3. Take a run from a week ago and reproduce it exactly. **Did the metrics match to the
   last decimal?** If not, find out why — that is the exercise.
4. Deliberately break reproducibility: leave a seed unset. Run three times, report the
   spread. Is your last "improvement" bigger than that?
5. Pin your environment. Then load a model pickled under an older library version. What
   happens?
6. Register a model and promote it. Then roll back to the previous version and confirm the
   rollback works.
7. Write the `notes.md` for your best run. Six months from now, would it tell you why you
   tried it?
