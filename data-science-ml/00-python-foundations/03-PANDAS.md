# 03 — pandas

**Week 3.** The workhorse. You will spend more hours here than in any other file in
this course.

---

## Table of Contents

1. [The two objects](#1-the-two-objects)
2. [Loading real data](#2-loading-real-data)
3. [Selection — `loc` and `iloc`](#3-selection--loc-and-iloc)
4. [groupby — the split-apply-combine engine](#4-groupby--the-split-apply-combine-engine)
5. [Merging](#5-merging)
6. [Reshaping](#6-reshaping)
7. [Missing data](#7-missing-data)
8. [Dates](#8-dates)
9. [Performance](#9-performance)
10. [Exercise 3](#exercise-3)

---

## 1. The two objects

```python
import pandas as pd

s  = pd.Series([1, 2, 3], index=['a', 'b', 'c'])   # 1-D + an index
df = pd.DataFrame({'name': [...], 'grade': [...]})  # 2-D, dict of Series
```

**The index is the thing that makes pandas different from a spreadsheet**, and the
thing that causes most confusion. Operations align on the index automatically:

```python
a = pd.Series([1, 2, 3], index=[0, 1, 2])
b = pd.Series([10, 20, 30], index=[2, 1, 0])
a + b        # 11, 22, 33 — aligned by index, NOT by position
```

That is a feature, and it is also how you get `NaN` rows appearing from nowhere after
an arithmetic operation between two Series with different indexes. When that happens,
check `.index` on both.

`df.reset_index(drop=True)` after filtering is a habit worth having — otherwise your
index has holes and positional assumptions start failing.

## 2. Loading real data

```python
df = pd.read_csv(
    path,
    encoding='utf-8-sig',           # strips the BOM Excel adds
    parse_dates=['enrolled_at'],
    dtype={'student_id': str},      # IDs are strings, not numbers
    na_values=['', 'N/A', 'NULL', '-', 'n/a'],
)
```

Four things that are always worth setting explicitly:

- **IDs as `str`.** A student ID read as int64 loses leading zeros, and with one missing
  value becomes `float64` and prints as `1001.0`. Then your join silently matches nothing.
- **`parse_dates`.** Otherwise dates are strings and every date operation is wrong.
- **`na_values`.** Real files spell missing a dozen ways.
- **`encoding`.** See `01-PYTHON_FOR_DATA.md` §6.

Always follow a load with:

```python
df.info()            # dtypes and non-null counts — read this every single time
df.describe()
df.head()
df.isna().sum()
```

`df.info()` catches the "why is my ID a float" bug in five seconds.

## 3. Selection — `loc` and `iloc`

```python
df['grade']                    # a column -> Series
df[['name', 'grade']]          # columns -> DataFrame

df.loc[3, 'grade']             # by LABEL
df.iloc[3, 2]                  # by POSITION

df.loc[df['grade'] >= 60]                          # boolean mask
df.loc[df['grade'] >= 60, ['name', 'grade']]       # mask + columns
df.loc[(df['grade'] >= 60) & (df['class'] == 'S3')] # note the parentheses
```

Two rules that prevent most beginner errors:

**Use `&` `|` `~`, not `and` `or` `not`.** And parenthesise every condition — `&` binds
tighter than `>=`, so leaving them off gives a confusing error at best.

**Never chain assignment.**

```python
df[df['grade'] < 0]['grade'] = 0     # WRONG — silently does nothing
df.loc[df['grade'] < 0, 'grade'] = 0 # RIGHT
```

The first operates on a temporary copy. Older pandas raised `SettingWithCopyWarning`;
pandas 3 with copy-on-write just silently discards it. **This is the single most common
way a data cleaning step does nothing at all**, and nothing tells you.

## 4. groupby — the split-apply-combine engine

```python
df.groupby('class')['grade'].mean()

df.groupby('class').agg(
    avg_grade=('grade', 'mean'),
    n=('grade', 'size'),
    worst=('grade', 'min'),
)

df.groupby(['class', 'term'])['grade'].mean().unstack()
```

Named aggregation (the second form) is worth adopting: it produces flat, readable
column names instead of a MultiIndex you then have to flatten.

**`transform` vs `agg`** — the distinction that unlocks a lot:

```python
df.groupby('class')['grade'].mean()        # one row per class
df.groupby('class')['grade'].transform('mean')  # one row per ORIGINAL row

# so this works:
df['grade_vs_class_avg'] = df['grade'] - df.groupby('class')['grade'].transform('mean')
```

`transform` broadcasts the group result back to every member row. It is how most useful
group-relative features get built.

**`size` vs `count`:** `size` counts rows; `count` counts non-null values. When they
differ, you have missing data — that difference is a free diagnostic.

## 5. Merging

```python
pd.merge(students, classes, on='class_id', how='left')
pd.merge(a, b, left_on='id', right_on='student_id', how='inner')
```

| how | keeps |
|---|---|
| `inner` | only matching rows — **silently drops non-matches** |
| `left` | all left rows, NaN where no match |
| `outer` | everything |

**Always check row counts before and after a merge.**

```python
before = len(students)
merged = students.merge(classes, on='class_id', how='left')
assert len(merged) == before, f"merge changed rows: {before} -> {len(merged)}"
```

A left join that *grows* means duplicate keys on the right — a one-to-many you did not
expect, and now every downstream aggregate is inflated. This is one of the most common
sources of quietly wrong analysis, and the assertion above catches all of it.

`validate='one_to_one'` / `'one_to_many'` makes pandas check for you and raise:

```python
students.merge(classes, on='class_id', how='left', validate='many_to_one')
```

Use it. It turns a silent data corruption into an exception.

`indicator=True` adds a `_merge` column showing which side each row came from — the
fastest way to diagnose a join that lost rows.

## 6. Reshaping

```python
df.pivot_table(index='student', columns='term', values='grade', aggfunc='mean')

df.melt(id_vars=['student'], var_name='term', value_name='grade')   # wide -> long
```

**Long ("tidy") format is what you want for modelling and plotting**: one row per
observation, one column per variable. Wide format is for humans reading a table.
`melt` and `pivot_table` convert between them, and knowing which one a library wants
saves a lot of confusion.

## 7. Missing data

```python
df.isna().sum()
df.isna().mean().sort_values(ascending=False)   # proportion missing per column
df.dropna(subset=['grade'])
df['grade'].fillna(df['grade'].median())
```

**Do not reflexively fill with the mean.** *Why* the value is missing decides what is
correct — `02-data-wrangling/01-DATA_CLEANING.md` covers MCAR/MAR/MNAR properly.

The critical rule, stated here because it is easy to get wrong early: **compute the
fill value on the training set only.** Filling with the median of the whole dataset
leaks test information into training. Section `02-data-wrangling/04-PIPELINES.md`
makes this structural rather than a thing you remember.

## 8. Dates

```python
df['enrolled_at'] = pd.to_datetime(df['enrolled_at'], errors='coerce')
df['enrolled_at'].dt.year
df['enrolled_at'].dt.dayofweek
df.set_index('date').resample('M')['grade'].mean()
```

`errors='coerce'` turns unparseable dates into `NaT` instead of raising — then
`df['enrolled_at'].isna().sum()` tells you how many failed. Far better than a crash
on row 40,000 of a load.

Beware `dayfirst`: `03/04/2026` is April 3rd in Rwanda and March 4th to pandas'
default. Pass `dayfirst=True` or, better, get ISO format out of the database.

## 9. Performance

```python
df.apply(lambda r: r['a'] * r['b'], axis=1)    # slow — a Python call per row
df['a'] * df['b']                              # fast — vectorised
```

`apply(axis=1)` is a `for` loop wearing a costume. It is occasionally unavoidable, but
if it is in your hot path, look for the vectorised form first. `np.where`, `.map`,
`.clip`, and boolean masks cover most cases.

For memory: `category` dtype for low-cardinality strings can cut a DataFrame's footprint
by 90%.

```python
df['class'] = df['class'].astype('category')
df.memory_usage(deep=True).sum()
```

---

## Exercise 3

Closed book, on a real messy CSV (generate synthetic Imboni-shaped data — do **not**
use real student records; see `07-enterprise/02`):

1. Load it correctly: IDs as strings, dates parsed, missing values recognised. Prove it
   with `df.info()`.
2. Write one `groupby().agg()` producing per-class average grade, count, and worst
   grade, with flat readable column names.
3. Add a column: each student's grade minus their class average. Use `transform`.
4. Merge students with classes. **Assert the row count is unchanged.** Then deliberately
   introduce a duplicate key on the right and show the assertion firing.
5. Convert a wide term-by-term grade table to long format and back.
6. Find a column where `size` and `count` differ in a groupby. Explain what that means.
7. Take the chained-assignment example in §3, run both forms, and show that one silently
   does nothing.
8. Time `apply(axis=1)` against the vectorised equivalent on 100,000 rows. Report the ratio.

Exercises 4 and 7 both demonstrate silent failures. Those are the ones worth your time —
loud failures find themselves.
