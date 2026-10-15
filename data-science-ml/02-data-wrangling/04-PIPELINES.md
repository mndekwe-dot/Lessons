# 04 — Pipelines

**Week 13.** The structural defence against leakage.

Every rule in the last three files — fit the imputer on train only, target-encode
out-of-fold, select features inside cross-validation — is something you must *remember*.
Pipelines make them things you cannot forget.

---

## Table of Contents

1. [The problem](#1-the-problem)
2. [The fix](#2-the-fix)
3. [Different columns need different treatment](#3-different-columns-need-different-treatment)
4. [Cross-validation, done correctly](#4-cross-validation-done-correctly)
5. [Custom steps](#5-custom-steps)
6. [Time series needs a different split](#6-time-series-needs-a-different-split)
7. [Save the pipeline, not the model](#7-save-the-pipeline-not-the-model)
8. [The reproducibility test](#8-the-reproducibility-test)
9. [Exercise 4](#exercise-4)

---

## 1. The problem

```python
# WRONG — and it looks completely reasonable
X = scaler.fit_transform(X)                       # fitted on ALL data
X_train, X_test = train_test_split(X, ...)
model.fit(X_train, y_train)
model.score(X_test, y_test)                       # optimistic. Silently.
```

The scaler saw the test set's mean and standard deviation. That information is now in
your training features. The score is too good, and you will only discover it in
production.

The same applies to imputation, target encoding, feature selection, and PCA — anything
that *learns* from the data.

## 2. The fix

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ('impute', SimpleImputer(strategy='median')),
    ('scale',  StandardScaler()),
    ('model',  LogisticRegression()),
])

pipe.fit(X_train, y_train)      # every step fits on train only
pipe.score(X_test, y_test)      # every step only transforms
```

**`fit` on train, `transform` on test — enforced by the object, not by your memory.**
That is the entire point.

## 3. Different columns need different treatment

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

numeric     = ['grade', 'attendance', 'age']
categorical = ['class', 'district']

preprocess = ColumnTransformer([
    ('num', Pipeline([
        ('impute', SimpleImputer(strategy='median')),
        ('scale',  StandardScaler()),
    ]), numeric),
    ('cat', Pipeline([
        ('impute', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore')),
    ]), categorical),
])

pipe = Pipeline([('prep', preprocess), ('model', LogisticRegression())])
```

**`handle_unknown='ignore'` is not optional.** Production will hand you a category that
was not in training — a new district, a renamed class. Without it, your model raises at
inference time, in production, at 08:00 on a Monday.

## 4. Cross-validation, done correctly

```python
from sklearn.model_selection import cross_val_score
cross_val_score(pipe, X, y, cv=5, scoring='roc_auc')
```

Because the whole pipeline is passed in, preprocessing is refitted **inside each fold**.
Scale before cross-validating and every fold has seen every other fold's statistics.

Same for hyperparameter search:

```python
from sklearn.model_selection import GridSearchCV

grid = GridSearchCV(pipe, {
    'prep__num__impute__strategy': ['median', 'mean'],
    'model__C': [0.01, 0.1, 1, 10],
}, cv=5, scoring='roc_auc')
```

Note the `__` naming: `step__substep__parameter`. You can tune preprocessing choices as
hyperparameters, which is the right way to decide between mean and median imputation —
by measurement, not by preference.

## 5. Custom steps

```python
from sklearn.base import BaseEstimator, TransformerMixin

class SchoolFeatures(BaseEstimator, TransformerMixin):
    """Domain features. Learns nothing, so fit is a no-op."""

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()                          # never mutate the caller's frame
        X['vs_class'] = X['grade'] - X['class_avg']
        X['is_new']   = X['days_enrolled'] < 90
        return X
```

If a transformer **learns** anything (a mean, a category list, an encoding), it must be
stored in `fit` and only applied in `transform`. That split is what makes it leak-proof.

```python
class GroupMeanImputer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        self.means_ = X.groupby('class')['grade'].mean()   # learned on TRAIN only
        return self

    def transform(self, X):
        X = X.copy()
        X['grade'] = X['grade'].fillna(X['class'].map(self.means_))
        return X
```

The trailing underscore on `means_` is the sklearn convention for "learned during fit".
Follow it — it tells the next reader what is state and what is configuration.

## 6. Time series needs a different split

`train_test_split` shuffles. For time-ordered data that is a leak: you train on
December and test on June, so the model has seen the future.

```python
from sklearn.model_selection import TimeSeriesSplit
cross_val_score(pipe, X, y, cv=TimeSeriesSplit(n_splits=5))
```

Each fold trains on the past and tests on the future, as production will.

**Also use grouped splits when rows are not independent:**

```python
from sklearn.model_selection import GroupKFold
cross_val_score(pipe, X, y, groups=df['student_id'], cv=GroupKFold(5))
```

If one student has three rows and a random split puts two in train and one in test, the
model has effectively seen that student. `GroupKFold` keeps all of a student's rows on
one side. **For any dataset with repeated entities — students, patients, customers —
this is mandatory, not optional.**

## 7. Save the pipeline, not the model

```python
import joblib
joblib.dump(pipe, 'model.joblib')            # preprocessing travels with it
```

Saving only the estimator means reimplementing preprocessing at serving time — and any
difference between the two implementations is **training/serving skew**
(`06-mlops/03`), a silent failure where the model receives inputs it was never trained
on.

Record the versions alongside it. A pipeline pickled under scikit-learn 1.5 may not load
under 1.7, and that failure arrives months later.

```python
joblib.dump({'pipeline': pipe, 'sklearn_version': sklearn.__version__,
             'trained_at': datetime.now(timezone.utc).isoformat(),
             'features': list(X.columns)}, 'model.joblib')
```

## 8. The reproducibility test

```bash
# from a clean checkout and a fresh environment
python -m src.train --seed 42
# same metrics, to the last decimal?
```

If not, something is unseeded, something depends on dict ordering, or something reads a
file that changed. Find it now — in Phase 7 this becomes a requirement, and by then the
cause will be much harder to locate.

---

## Exercise 4

1. Build the leak: scale before splitting, record the test score. Then do it inside a
   pipeline. Report both numbers and the gap.
2. Build a full `ColumnTransformer` for a mixed dataset. Everything inside the pipeline —
   no preprocessing outside it.
3. Write a custom transformer that **learns** something in `fit` (a per-group mean) and
   applies it in `transform`. Prove it does not leak by checking that the learned values
   come only from the training fold.
4. Run `GridSearchCV` tuning both a preprocessing choice and a model hyperparameter.
5. Split a time-ordered dataset randomly and then with `TimeSeriesSplit`. Compare
   scores. Which is honest?
6. Take a dataset with repeated student rows. Compare `KFold` against `GroupKFold` on
   `student_id`. **Explain the difference in scores.**
7. Save a pipeline with metadata, load it in a fresh process, and predict on one row.
8. Run your training script twice from clean. Do the metrics match exactly?

Exercises 1, 5 and 6 all quantify a leak in your own numbers. Seeing the size of the gap
is what makes the rule stick.
