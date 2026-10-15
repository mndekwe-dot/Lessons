# 04 — Scale and Cost

**Week 37.** What changes when the data outgrows one machine — and the honest answer about
when that happens.

---

## Table of Contents

1. [You are probably not there](#1-you-are-probably-not-there)
2. [One-machine tools that go a long way](#2-one-machine-tools-that-go-a-long-way)
3. [Chunking](#3-chunking)
4. [When you genuinely need distribution](#4-when-you-genuinely-need-distribution)
5. [Distributed training](#5-distributed-training)
6. [Build versus buy](#6-build-versus-buy)
7. [Costs at scale](#7-costs-at-scale)
8. [The conversation](#8-the-conversation)
9. [Exercise 4](#exercise-4)

---

## 1. You are probably not there

Modern hardware is enormous. A single machine with 64 GB of RAM handles tens of millions of
rows in pandas comfortably.

**Imboni at 500 schools is 400,000 students and ~80 million attendance rows a year.** In
Parquet that is a few gigabytes. **It fits on a laptop.**

The scaling order — the same instinct as system design Ch 3:

1. **Do less.** Sample, aggregate, filter, select fewer columns.
2. **Use better tools on one machine.** Parquet not CSV; Polars or DuckDB not pandas.
3. **Get a bigger machine.** Dramatically cheaper than a distributed system, in money and
   in complexity.
4. **Only then distribute.**

**Every hour spent on step 4 before finishing step 2 is wasted**, and it is the most common
self-inflicted wound in data engineering.

## 2. One-machine tools that go a long way

```python
# Parquet: columnar, compressed, typed. Reads only the columns you ask for.
df = pd.read_parquet('attendance.parquet', columns=['student_id', 'date', 'status'])

# DuckDB: SQL over files, out of core, no server
import duckdb
duckdb.sql("""
    SELECT class_id, AVG(present::INT) AS rate
    FROM 'attendance/*.parquet'
    WHERE date >= '2026-01-01'
    GROUP BY class_id
""").df()

# Polars: multi-threaded, lazy, often 5-30x faster than pandas
import polars as pl
(pl.scan_parquet('attendance/*.parquet')
   .filter(pl.col('date') >= '2026-01-01')
   .group_by('class_id').agg(pl.col('present').mean())
   .collect())
```

**DuckDB is the underrated one.** It queries Parquet files directly, streams larger-than-
memory data, and speaks SQL you already know from
`00-python-foundations/05-SQL_FOR_DATA.md`. For most "my data does not fit" problems it is
the whole answer, and it installs with pip.

`scan_parquet` + `collect()` is Polars' lazy API — it plans the whole query before reading,
so it can skip columns and rows entirely. That is where the speedup comes from.

**CSV to Parquet alone is often a 10× win** in both size and read speed. Do that first.

## 3. Chunking

```python
for chunk in pd.read_csv('huge.csv', chunksize=100_000):
    process(chunk)

# sklearn models that support incremental learning
from sklearn.linear_model import SGDClassifier
model = SGDClassifier()
for chunk in chunks:
    model.partial_fit(X_chunk, y_chunk, classes=[0, 1])
```

`partial_fit` exists on a limited set of estimators — SGD-based linear models, Naive Bayes,
some others. **Not on tree ensembles**, which is usually what you want, so chunked training
often means subsampling instead.

**Subsampling is legitimate and underrated.** A model trained on a well-chosen 10% sample is
frequently within noise of one trained on everything. **Measure the learning curve
(`03-classical-ml/01-SUPERVISED_LEARNING.md §5`) before assuming you need all the data** —
if the curve has plateaued, more rows buy nothing.

## 4. When you genuinely need distribution

Real signals, not guesses:

- One machine cannot hold the data even chunked, and the job takes days
- Training is compute-bound for hours on a large machine
- You need results faster than one machine can produce them

**Options:** Dask (pandas-like, gentlest migration), Spark/PySpark (the industry standard,
heavy), Ray (ML-focused, good for distributed training and tuning).

**The cost nobody quotes:** a distributed system is a *distributed system*. Partial
failures, stragglers, shuffle spills, cluster management, and debugging that means reading
logs from twelve machines. Everything in your system design guide's failure-modes chapter
applies, and it applies to your data pipeline now.

For one person supporting schools, that is a large ongoing cost for a problem you probably
do not have.

## 5. Distributed training

Separate from distributed data. Mostly a deep learning concern.

- **Data parallel** — same model on each GPU, different batches, gradients averaged. The
  common case.
- **Model parallel** — the model does not fit on one GPU. Rare below very large models.

```python
model = torch.nn.DataParallel(model)                    # simple, one machine
# or DistributedDataParallel — faster, multi-machine, more setup
```

**Before distributing, exhaust the free wins:** mixed precision (`torch.amp`) is often a
2× speedup for one line; gradient accumulation simulates a larger batch on one GPU; and a
smaller model or fewer epochs may cost you nothing measurable.

## 6. Build versus buy

At your scale, the calculation is not really about money.

| | Build | Buy |
|---|---|---|
| Money | Cheaper per unit | More per unit |
| **Your time** | **The real cost** | Freed |
| Control | Total | Constrained |
| Data residency | Yours | Theirs — a governance question |
| Maintenance | Forever | Theirs |

**Buy when it is not your differentiator.** You are not going to build a better vector
database, and nobody chooses Imboni because you did.

**Build when it is core, or when data residency requires it.** Sending children's records
to a third-party API is a governance decision (`03-PRIVACY_AND_SECURITY.md §4`), and
sometimes the answer is that you must run it yourself.

**Weight your own time heavily.** A managed service at $50 a month that saves you four
hours a month is obviously worth it. That comparison is the one people get wrong, in both
directions.

## 7. Costs at scale

| | At 1 school | At 500 schools |
|---|---|---|
| Batch inference | Free (existing server) | Free (existing server) |
| Training | Minutes, CPU | Hours, CPU. Still cheap |
| Storage | Megabytes | ~10 GB/year. Negligible |
| **LLM API calls** | **Small** | **Dominant** |
| Your time | The real cost | Still the real cost |

**Two rows carry everything.** LLM calls are the only line that scales badly with users —
$0.02 per call across 400,000 students is $8,000, so any per-student LLM feature needs a
business case before it needs an architecture. And your time remains the binding constraint
at every scale.

**Everything else on this list stays cheap**, which is worth saying plainly: the compute
side of ML at your scale is close to free, and the instinct to architect for cost is
usually misdirected.

## 8. The conversation

When someone asks whether it will scale:

> "The dropout model runs nightly on the servers we already have. At 500 schools it is
> about 400,000 predictions — roughly four minutes of CPU. Storage is around 10 GB a year.
> The compute is effectively free.
>
> The part that scales with cost is the LLM assistant, at about $0.02 a query. At current
> usage that is $180 a month. If every parent used it daily it would be a different
> conversation, and we would move to a cheaper model or cache aggressively before then.
>
> The real constraint is that I maintain this. That is what limits how much complexity we
> should take on, more than any cost figure."

**Numbers, the one line that actually scales, and honesty about the binding constraint.**

---

## Exercise 4

1. Convert a large CSV to Parquet. Compare file size and read time, both full and
   single-column.
2. Run the same aggregation in pandas, Polars, and DuckDB over 5 million rows. Report
   timings and memory.
3. Query a set of Parquet files larger than your RAM with DuckDB. Confirm it works.
4. Plot a learning curve on 1%, 10%, 50% and 100% of your data. **Where does it plateau?
   How much data do you actually need?**
5. Train with `partial_fit` in chunks and compare against a full in-memory fit.
6. Estimate the cost of a per-student LLM feature at 500 schools. Then design a cheaper
   version that achieves most of the value.
7. Write the §8 paragraph for your own system with real numbers.
8. Pick one component you currently build. Write the honest build-versus-buy case,
   **weighting your own time at a real hourly rate.**

Exercise 4 is the one that most often shows you do not have a scale problem at all.
