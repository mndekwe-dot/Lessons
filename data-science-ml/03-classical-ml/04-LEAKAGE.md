# 04 — Data Leakage

**Week 18.** Its own file because it deserves one.

**Leakage is the number one reason a model that scored 0.94 in a notebook is useless in
production.** It is silent, it looks like success, and by the time you find it you have
usually told someone the number.

---

## Table of Contents

1. [What it is](#1-what-it-is)
2. [Target leakage — a feature that encodes the answer](#2-target-leakage--a-feature-that-encodes-the-answer)
3. [Train/test contamination](#3-traintest-contamination)
4. [Temporal leakage](#4-temporal-leakage)
5. [Group leakage](#5-group-leakage)
6. [Duplicate rows](#6-duplicate-rows)
7. [Leakage through the label itself](#7-leakage-through-the-label-itself)
8. [How to find leakage](#8-how-to-find-leakage)
9. [The honest position](#9-the-honest-position)
10. [Exercise 4](#exercise-4)

---

## 1. What it is

**Any information in your training data that would not be available at prediction time.**

That is the whole definition. Every form below is a case of it.

The tell is emotional, and worth learning to notice: **a result that seems too good is
almost always leakage.** If a model predicts dropout at 0.98 AUC, you have not solved
education — you have leaked something. Treat surprise as a signal to investigate, not
to celebrate.

## 2. Target leakage — a feature that encodes the answer

```python
# predicting: will this student drop out?
features = ['attendance', 'grades', 'withdrawal_form_submitted']   # <-- the answer
```

`withdrawal_form_submitted` is only true *because* they dropped out. The model learns to
read it and scores brilliantly, and at prediction time it is always false, so the model
predicts nobody drops out.

Real examples of this shape:

- `final_grade` predicting `passed`
- `discharge_date` predicting hospital readmission
- `payment_received` predicting whether an invoice will be paid
- Anything with `total_`, `final_`, `_at_end`, `outcome_` in the name

**The test, applied to every single feature:**

> *At the moment I need this prediction, would this value exist and be known?*

Say it out loud, per feature, and write the answer down. Most leaks die here.

**A second, subtler test — the timestamp test:** for each feature, when is it *written*
in the source system? If a column is updated after the outcome occurs, it leaks, even if
it existed before.

## 3. Train/test contamination

```python
# WRONG
X = scaler.fit_transform(X)                    # learned test statistics
X_train, X_test = train_test_split(X)
```

Anything that *learns* from data — scaler, imputer, target encoder, feature selector,
PCA — must be fitted on train only. `02-data-wrangling/04-PIPELINES.md` makes this
structural rather than a thing you must remember.

The subtle version: **feature selection before cross-validation.** Selecting the top 20
features using the whole dataset, then cross-validating, is leakage — you used the
validation folds to choose. Selection belongs inside the pipeline.

## 4. Temporal leakage

Training on the future to predict the past.

```python
train_test_split(X, y, shuffle=True)     # WRONG for time-ordered data
```

A random split puts December's rows in train and June's in test. The model has seen the
future, and production will never have that.

Also temporal, and easy to miss: a rolling feature that includes the current row.

```python
df['rolling'] = df.groupby('id')['x'].transform(lambda s: s.rolling(3).mean())          # leaks
df['rolling'] = df.groupby('id')['x'].transform(lambda s: s.shift(1).rolling(3).mean()) # correct
```

The missing `.shift(1)` is the most common single leak in time-series feature work.

**And the sneakiest form:** using data that exists at prediction time but was *recorded
later*. A grade dated 1 September but entered on 15 September is not knowable on the
10th. Real systems backfill constantly; the timestamp in the row is not the timestamp it
became available. Check your source system's write behaviour, not just its date columns.

## 5. Group leakage

```python
# 3 rows per student, randomly split
X_train, X_test = train_test_split(X, ...)      # same student in both
```

The model memorises the student, not the pattern. Use `GroupKFold` on `student_id`.

The general form: **any repeated entity** — patient, customer, device, household. And in
Screening's case, a person who took the questionnaire three times is one entity, not
three independent observations.

Near-duplicate rows are the same problem: augmented images, a record copied across two
systems, a form submitted twice.

## 6. Duplicate rows

```python
df.duplicated().sum()
df.duplicated(subset=key_columns).sum()
```

Exact duplicates across the split are the crudest leak — the same row in train and test
is memorisation scored as generalisation. **Deduplicate before splitting**, never after.

## 7. Leakage through the label itself

Sometimes the *label* was constructed using information the model then receives.

Example: labelling a student "at risk" using a rule that includes attendance, then giving
the model attendance as a feature. The model recovers your rule, scores 0.99, and has
learned nothing about risk — only about your labelling function.

Ask: **how was this label created, and by whom?** If it came from a rule, your model is
predicting the rule. If it came from a human, you are predicting that human's judgment,
including their biases — which is the fairness question in `07-enterprise/02`.

## 8. How to find leakage

**Before modelling**

1. Ask the prediction-time question of every feature, in writing.
2. Ask the timestamp question — when is this column *written*?
3. Ask how the label was created.
4. Check correlations with the target. Anything above ~0.95 is a suspect.

**During modelling**

5. **Be suspicious of good results.** 0.98 on a hard human problem is a bug.
6. Drop your single most important feature and refit. If the score collapses to chance,
   that feature was doing all the work — inspect it hard.
7. Compare a random split against a temporal or grouped split. **A large gap is a leak**,
   and this comparison is the single most useful diagnostic in this file.

**After modelling**

8. Look at the errors. Leaky models fail in strange, structured ways.
9. Shadow-deploy against real incoming data and compare live performance to offline.
   A big drop means leakage — this is what `06-mlops/05` shadow deployment is for.

## 9. The honest position

**You will ship a leak at some point.** Everyone does. The professional difference is
having the checks that catch it before a headteacher acts on the output, and saying so
plainly when you find one afterwards.

A model that quietly underperforms is worse than one that visibly fails, because nobody
investigates it. And in a school context, "quietly underperforms" means real children
either flagged wrongly or missed entirely.

---

## Exercise 4

1. Take a clean dataset. **Deliberately introduce each of these**, one at a time, and
   record the inflated score:
   - a target leak (a feature derived from the label)
   - scaling before the split
   - a rolling feature without `.shift(1)`
   - a random split on time-ordered data
   - a random split with repeated students

   Then fix each and record the honest score. **Produce a table of the five gaps.** That
   table is the deliverable, and it is the most useful thing in this exercise.

2. Write the prediction-time question and answer for all ten of your dropout features.
   Delete any you cannot answer cleanly.

3. Apply diagnostic 7: score the same model under a random split and a grouped split.
   Report both.

4. Apply diagnostic 6: drop your top feature and refit. What happened?

5. Take an existing model you or someone else built — a public Kaggle notebook is fine.
   Audit it for all seven leak types. Write what you find.

Exercise 1's table is what makes leakage real rather than a warning you have read. Seeing
that your own score went from 0.94 to 0.71 is what installs the habit.
