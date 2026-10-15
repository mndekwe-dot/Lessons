# 01 — Data Cleaning

**Week 10.** Where most of the real work is, and where almost all silent failures start.

---

## Table of Contents

1. [Missingness — the mechanism decides the fix](#1-missingness--the-mechanism-decides-the-fix)
2. [Outliers — wrong, or just rare?](#2-outliers--wrong-or-just-rare)
3. [Duplicates](#3-duplicates)
4. [Types](#4-types)
5. [Categorical consistency](#5-categorical-consistency)
6. [Text hygiene](#6-text-hygiene)
7. [Write down what you did](#7-write-down-what-you-did)
8. [Exercise 1](#exercise-1)

---

## 1. Missingness — the mechanism decides the fix

Do not reach for `fillna(mean)`. **Ask first why the value is missing**, because that
determines what is correct and whether your model will be biased.

| Mechanism | Meaning | Example | Safe to impute? |
|---|---|---|---|
| **MCAR** — missing completely at random | Missingness unrelated to anything | A sensor dropped a reading | Yes; dropping is also unbiased |
| **MAR** — missing at random | Explained by *observed* variables | Boarders' phone numbers missing more often | Yes, conditioned on those variables |
| **MNAR** — missing not at random | Explained by the *missing value itself* | Students hide low marks; sick pupils skip the survey | **No.** Imputing biases everything |

**MNAR is the dangerous one and it is common.** If low grades are missing more often,
filling with the mean pulls the distribution up, and your model learns a school that
performs better than it does.

**The MNAR move: make missingness a feature.**

```python
df['grade_missing'] = df['grade'].isna().astype(int)
df['grade'] = df['grade'].fillna(df['grade'].median())
```

Now the model can learn that *the fact of absence* carries signal — which, when the data
is MNAR, it does.

**How to diagnose:** compare rows with and without the missing value on every other
column. If they differ systematically, it is not MCAR.

```python
missing = df['grade'].isna()
df.groupby(missing).mean(numeric_only=True).T     # do the two groups look alike?
```

**The rule that survives everything:** compute any fill value on the **training set
only**. `df['x'].fillna(df['x'].median())` on the full dataset leaks test information
into training. `04-PIPELINES.md` makes this structural instead of something you must
remember.

## 2. Outliers — wrong, or just rare?

Three different things get called outliers, and they need three different responses:

1. **Data-entry error** — a grade of 950, an age of 200. **Fix or remove.**
2. **Legitimate extreme** — one genuinely brilliant student. **Keep.** Removing it is
   deleting evidence.
3. **A different population** — adult learners mixed into a children's dataset.
   **Split, do not clean.**

```python
q1, q3 = df['grade'].quantile([0.25, 0.75])
iqr = q3 - q1
mask = df['grade'].between(q1 - 1.5*iqr, q3 + 1.5*iqr)
```

The IQR rule is a *detector*, not a decision. **Look at the flagged rows.** The 1.5×IQR
convention flags about 0.7% of a normal distribution — perfectly ordinary values.

**Never delete outliers because they hurt your score.** That is fitting the data to the
model. If extremes genuinely break your model, use a robust model or a log transform,
not a delete.

For skewed positive data, `log1p` usually beats outlier removal:

```python
df['income_log'] = np.log1p(df['income'])     # log1p handles zeros; log does not
```

## 3. Duplicates

```python
df.duplicated().sum()                          # fully identical rows
df.duplicated(subset=['student_id']).sum()     # the one that matters
```

**Full-row duplicates are usually harmless; duplicate *keys* are the real problem.**
Two rows for one student mean that student is counted twice in every aggregate and may
appear in both your train and test sets — which is a leak.

```python
df.sort_values('updated_at').drop_duplicates(subset=['student_id'], keep='last')
```

Sort before dropping. `keep='first'` on unsorted data keeps an arbitrary row.

**Fuzzy duplicates** are harder and more common in school data: `"Jean Habimana"`,
`"jean habimana"`, `"Habimana Jean"`. Normalise before comparing — case-fold, strip,
collapse whitespace, sort name parts — and accept you will not catch them all.

## 4. Types

```python
df.info()      # read this after every load
```

The recurring problems:

- **IDs as numbers** — leading zeros vanish, and one NaN makes the column float, so
  `1001` prints as `1001.0` and joins fail. Load IDs as `str`.
- **Dates as strings** — every date operation silently wrong.
- **Numbers as strings** — `"1,234"`, `"45%"`, `" 67 "`.
- **Booleans as strings** — `"TRUE"`, `"yes"`, `"1"`, `"Y"` in one column.

```python
df['amount'] = (df['amount'].astype(str)
                .str.replace(',', '', regex=False)
                .str.strip()
                .pipe(pd.to_numeric, errors='coerce'))
```

`errors='coerce'` gives `NaN` instead of raising — then `.isna().sum()` tells you how
many failed, which is far better than a crash on row 40,000.

## 5. Categorical consistency

Real data spells one thing many ways.

```python
df['class'].value_counts()      # always look. Always.
```

`S3`, `s3`, `Senior 3`, `SENIOR3`, `S 3` are five categories to a computer and one to a
human. Every one becomes its own dummy column, splitting your signal five ways.

```python
df['class'] = (df['class'].str.strip().str.upper()
               .str.replace(r'\s+', '', regex=True)
               .replace({'SENIOR3': 'S3'}))
```

**Watch for high cardinality.** A "comments" column with 8,000 unique values is not
categorical — it is text, and one-hot encoding it produces 8,000 columns.

## 6. Text hygiene

```python
df['name'] = df['name'].str.strip().str.title()
```

Two encoding problems you will meet with Kinyarwanda and French data:

- **Mojibake** — `Ã©` where `é` should be. Double-decoded UTF-8. **Fix at load time**
  with the right encoding; a `.replace()` is a plaster over a wound.
- **Unicode normalisation** — `é` can be one code point or `e` + a combining accent.
  They look identical and compare unequal.

```python
import unicodedata
df['name'] = df['name'].apply(lambda s: unicodedata.normalize('NFC', s))
```

This bites when joining on names. It is invisible until it is not.

## 7. Write down what you did

```python
def clean(df: pd.DataFrame) -> pd.DataFrame:
    """
    - student_id -> str (preserve leading zeros)
    - grades outside 0-100 -> NaN (data entry errors, n=14)
    - class labels normalised to S1-S6 (5 spelling variants merged)
    - grade_missing flag added: missingness is MNAR, low grades under-reported
    """
```

**Every cleaning decision is a modelling decision.** Six months later, "why does this
model think attendance is 94%?" is answerable only if you wrote down that you dropped
rows where attendance was null. A cleaning function with a docstring is the cheapest
audit trail there is — and in Phase 8 it becomes part of your model card.

---

## Exercise 1

On a genuinely messy dataset (synthetic Imboni-shaped, or a public one — **not** real
student records):

1. For each column with missing values, diagnose MCAR / MAR / MNAR using the groupby
   comparison in §1. Write your reasoning per column.
2. Find one column you believe is MNAR. Add a missingness flag. Show whether the flag
   has predictive value.
3. Flag outliers by IQR. **Inspect every flagged row** and classify each as error,
   legitimate extreme, or different population. Report the counts.
4. Prove the leak: impute using the whole dataset's median, then using train-only.
   Compare test scores. Which is optimistic, and by how much?
5. Find a categorical column with spelling variants. Show the `value_counts()` before
   and after normalising.
6. Load a CSV with IDs, once naively and once with `dtype=str`. Show a join that
   succeeds in one case and silently returns zero rows in the other.
7. Write your `clean()` function with the docstring from §7. Someone else should be able
   to read it and know what happened to the data.

Exercises 4 and 6 are both silent failures — no error, just a wrong answer you would
have believed.
