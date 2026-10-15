# 05 — SQL for Data

**Week 4.** Most real data starts in a database, and yours does — Imboni and Screening
are both Postgres. Pulling 400,000 rows into pandas to compute a group average is the
wrong shape of work.

---

## Table of Contents

1. [Why this file is here](#why-this-file-is-here)
1. [Order of execution — the thing that unlocks SQL](#1-order-of-execution--the-thing-that-unlocks-sql)
2. [Joins](#2-joins)
3. [NULL behaves unlike anything else](#3-null-behaves-unlike-anything-else)
4. [Window functions — the thing that separates levels](#4-window-functions--the-thing-that-separates-levels)
5. [CTEs — write queries people can read](#5-ctes--write-queries-people-can-read)
6. [Getting SQL results into Python](#6-getting-sql-results-into-python)
7. [Reading a query plan](#7-reading-a-query-plan)
8. [Exercise 5](#exercise-5)

---

## Why this file is here

You already write Django ORM queries. That is not the same as knowing SQL, and the gap
shows up in exactly two places:

1. **Aggregation belongs in the database.** The database has indexes, statistics, a
   query planner, and C. pandas has none of that until the rows are already over the
   network.
2. **Data roles interview on SQL, heavily.** Often more than on Python.

The rule of thumb: **filter and aggregate in SQL, model in Python.** Pull the smallest
result set that answers the question.

## 1. Order of execution — the thing that unlocks SQL

You write it in one order; it runs in another:

```
written:   SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT
executed:  FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
```

Two consequences that explain most beginner errors:

- **You cannot use a `SELECT` alias in `WHERE`.** `WHERE` runs before `SELECT` exists.
- **`WHERE` filters rows; `HAVING` filters groups.** `WHERE` runs before grouping, so it
  cannot see aggregates.

```sql
-- students with average grade above 70
SELECT class_id, AVG(grade) AS avg_grade
FROM results
WHERE term = 3              -- filters ROWS, before grouping
GROUP BY class_id
HAVING AVG(grade) > 70      -- filters GROUPS, after
ORDER BY avg_grade DESC;    -- ORDER BY runs after SELECT, so the alias works here
```

## 2. Joins

```sql
SELECT s.first_name, s.last_name, c.name AS class_name
FROM students s
LEFT JOIN classes c ON c.id = s.class_id;
```

| Join | Keeps |
|---|---|
| `INNER` | only matching rows — **silently drops non-matches** |
| `LEFT` | all left rows, NULL where no match |
| `FULL OUTER` | everything |

The same discipline as the pandas merge rule: **check your row count**. A `LEFT JOIN`
that increases the row count means duplicate keys on the right, and every downstream
average is now wrong.

```sql
SELECT COUNT(*) FROM students;                    -- 812
SELECT COUNT(*) FROM students s LEFT JOIN ...;    -- must still be 812
```

**`LEFT JOIN` + `WHERE` on the right table silently becomes an `INNER JOIN`:**

```sql
-- BROKEN: the WHERE drops the NULL rows the LEFT JOIN just created
FROM students s LEFT JOIN results r ON r.student_id = s.id
WHERE r.term = 3

-- CORRECT: put the condition in the join
FROM students s LEFT JOIN results r ON r.student_id = s.id AND r.term = 3
```

That one catches nearly everyone, and it fails silently — you just get fewer rows than
you should.

## 3. NULL behaves unlike anything else

```sql
NULL = NULL        -- NULL, not TRUE
NULL <> 5          -- NULL, not TRUE
WHERE x = NULL     -- matches nothing, ever. Use IS NULL.

COUNT(*)           -- counts rows
COUNT(column)      -- counts NON-NULL values  <- the difference is a free diagnostic
AVG(column)        -- IGNORES NULLs (does not treat them as zero)
```

`AVG` ignoring NULLs is usually what you want and occasionally a disaster: the average
grade of a class where half the results are missing is the average of *the half that
exists*, and it will look fine.

```sql
COALESCE(grade, 0)                    -- treat missing as zero, if that is right
NULLIF(denominator, 0)                -- avoid division by zero
```

## 4. Window functions — the thing that separates levels

An aggregate collapses rows. A **window function keeps every row** and adds a value
computed over a related set. This is `groupby().transform()` from pandas, and it is
what most SQL interview questions are actually testing.

```sql
SELECT
    student_id,
    grade,
    AVG(grade)   OVER (PARTITION BY class_id)               AS class_avg,
    grade - AVG(grade) OVER (PARTITION BY class_id)         AS vs_class,
    RANK()       OVER (PARTITION BY class_id ORDER BY grade DESC) AS rank_in_class,
    LAG(grade)   OVER (PARTITION BY student_id ORDER BY term)     AS prev_term_grade
FROM results;
```

Four you will use constantly:

- `ROW_NUMBER()` — 1, 2, 3, 4 (no ties)
- `RANK()` — 1, 2, 2, 4 (ties share, then skip)
- `DENSE_RANK()` — 1, 2, 2, 3 (ties share, no skip)
- `LAG()` / `LEAD()` — the previous / next row's value, for period-over-period change

**The classic pattern: "top N per group."** Cannot be done with `GROUP BY` alone.

```sql
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY class_id ORDER BY grade DESC) AS rn
    FROM results
) ranked
WHERE rn <= 3;
```

The subquery is required — you cannot filter on a window function in `WHERE`, because
windows are computed after `WHERE` runs.

## 5. CTEs — write queries people can read

```sql
WITH term_3 AS (
    SELECT * FROM results WHERE term = 3
),
class_averages AS (
    SELECT class_id, AVG(grade) AS avg_grade
    FROM term_3
    GROUP BY class_id
)
SELECT c.name, ca.avg_grade
FROM class_averages ca
JOIN classes c ON c.id = ca.class_id
ORDER BY ca.avg_grade DESC;
```

A CTE is a named subquery. Three nested subqueries are unreadable; three CTEs read
top to bottom like a paragraph. **Prefer CTEs to nesting, always.**

## 6. Getting SQL results into Python

```python
import pandas as pd
from sqlalchemy import create_engine, text

engine = create_engine('postgresql+psycopg://user:pass@host/db')

df = pd.read_sql(
    text("SELECT class_id, AVG(grade) AS avg_grade FROM results "
         "WHERE term = :term GROUP BY class_id"),
    engine,
    params={'term': 3},
)
```

**Parameterise. Never f-string a value into SQL.** You know this from Django; it is the
same SQL injection, and in a data role it usually shows up as someone building a query
from a filename or a dashboard filter.

For results too big for memory:

```python
for chunk in pd.read_sql(query, engine, chunksize=50_000):
    process(chunk)
```

## 7. Reading a query plan

Same skill as Chapter 4 of your system design guide, and it transfers directly:

```sql
EXPLAIN ANALYZE SELECT ... ;
```

Watch for `Seq Scan` on a large table, and for `rows=1000 ... actual rows=248000` —
a bad planner estimate, which usually means stale statistics (`ANALYZE`) and causes
bad plan choices downstream.

---

## Exercise 5

Against a real Postgres — spin up Imboni's local database, or `docker run postgres`
with synthetic data:

1. Write, cold: average grade per class for term 3, only classes averaging above 60,
   sorted descending.
2. Write a query using a window function to give each student their rank within their
   class, and their grade minus the class average.
3. Write "top 3 students per class." Explain why `GROUP BY` alone cannot do it.
4. Take one of your Django ORM queries that loads rows and aggregates in Python.
   Rewrite it as SQL that aggregates in the database. Time both.
5. Demonstrate the `LEFT JOIN` + `WHERE` trap: write the broken form, show it returns
   fewer rows than it should, then fix it by moving the condition into the `ON`.
6. Find a table where `COUNT(*)` and `COUNT(column)` differ. What does that tell you,
   and what does it mean for any `AVG` over that column?
7. Run `EXPLAIN ANALYZE` on your slowest query. Find one `Seq Scan` on a table over
   10,000 rows. Predict the index that fixes it **before** creating it.

Exercises 5 and 6 are both silent failures. Those are the ones worth the time.
