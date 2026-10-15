# 02 — NumPy

**Week 2.** The mental model everything else in this course sits on. pandas is numpy
underneath; PyTorch tensors are numpy arrays with autograd bolted on. Getting this
right once pays for the next nine months.

---

## Table of Contents

1. [The one idea: vectorisation](#1-the-one-idea-vectorisation)
2. [Arrays are not lists](#2-arrays-are-not-lists)
3. [dtypes, and the silent failures they cause](#3-dtypes-and-the-silent-failures-they-cause)
4. [Shape — the thing to think in](#4-shape--the-thing-to-think-in)
5. [Broadcasting — powerful, and the source of your worst bugs](#5-broadcasting--powerful-and-the-source-of-your-worst-bugs)
6. [Axis — the argument everyone gets backwards](#6-axis--the-argument-everyone-gets-backwards)
7. [Indexing](#7-indexing)
8. [Useful functions you will reach for constantly](#8-useful-functions-you-will-reach-for-constantly)
9. [Random numbers — the modern API](#9-random-numbers--the-modern-api)
10. [Exercise 2](#exercise-2)

---

## 1. The one idea: vectorisation

```python
import numpy as np

a = np.arange(1_000_000)

total = 0                      # ~200 ms
for x in a:
    total += x ** 2

total = (a ** 2).sum()         # ~2 ms
```

**Roughly 100× faster**, and shorter. The loop runs a Python interpreter step per
element; the vectorised version runs one compiled C loop over contiguous memory.

This is the same lesson as the ORM's N+1 problem from your system design guide, in a
different costume: *the framework makes an expensive thing look cheap*. There, an
attribute access was a network round trip. Here, a `for` loop over an array is a
million interpreter dispatches.

**If you are writing a `for` loop over a numpy array or a DataFrame, stop.** There is
almost always a vectorised form, and finding it is the skill.

## 2. Arrays are not lists

| | list | ndarray |
|---|---|---|
| Types | mixed | one dtype for all elements |
| Memory | pointers scattered on the heap | one contiguous block |
| `a * 2` | duplicates the list | multiplies every element |
| `a + b` | concatenates | adds elementwise |

That third row catches everyone once.

```python
[1, 2, 3] * 2              # [1, 2, 3, 1, 2, 3]
np.array([1, 2, 3]) * 2    # array([2, 4, 6])
```

## 3. dtypes, and the silent failures they cause

```python
np.array([1, 2, 3])            # int64
np.array([1, 2, 3.0])          # float64 — one float promotes everything
np.array([1, 2, 3], dtype=np.int8)
```

Three dtype traps worth knowing before they bite:

**Integer overflow is silent.**
```python
np.array([127], dtype=np.int8) + 1     # array([-128])  — no warning
```

**Integer division truncates.**
```python
np.array([5]) // np.array([2])         # 2, not 2.5
```

**NaN requires float.** There is no integer NaN. So the moment a column has one missing
value, pandas promotes it to float — which is why an ID column can arrive as
`1001.0` and then fail to join.

```python
np.nan == np.nan       # False. Always. Use np.isnan()
```

`float32` vs `float64` becomes a real decision in deep learning: half the memory, half
the bandwidth, and enough precision for gradients. For statistics, stay at 64.

## 4. Shape — the thing to think in

```python
a = np.zeros((3, 4))
a.shape      # (3, 4)   rows, columns
a.ndim       # 2
a.size       # 12
```

Shape conventions you will see for the rest of your career:

```
(n_samples, n_features)              tabular data
(n_samples,)                         labels — note: NOT (n_samples, 1)
(batch, channels, height, width)     images in PyTorch
(batch, sequence_length, embedding)  transformers
```

**`(n,)` and `(n, 1)` are different**, and mixing them is the most common numpy bug
there is. `(n,)` is a 1-D array; `(n, 1)` is a 2-D column. Broadcasting will happily
combine them into an `(n, n)` matrix instead of erroring — see below.

```python
a.reshape(2, 6)
a.reshape(-1, 2)      # -1 = infer this dimension
a.ravel()             # flatten to 1-D
a[:, None]            # (n,) -> (n, 1)
```

## 5. Broadcasting — powerful, and the source of your worst bugs

Rule: compare shapes from the **right**. Dimensions are compatible if they are equal,
or one of them is 1.

```
(3, 4) + (4,)      ->  (3, 4)     the (4,) is used for every row
(3, 4) + (3, 1)    ->  (3, 4)     the column is used for every column
(3, 4) + (3,)      ->  ERROR      4 vs 3 on the right
```

Legitimate and beautiful:

```python
X = np.random.randn(1000, 5)
X_scaled = (X - X.mean(axis=0)) / X.std(axis=0)     # (1000,5) - (5,)
```

And the disaster:

```python
predictions = np.array([1.0, 2.0, 3.0])       # (3,)
actuals     = np.array([[1.1], [2.1], [3.1]]) # (3, 1)

errors = predictions - actuals                # (3, 3)  !!
mse = (errors ** 2).mean()                    # a completely wrong number
```

No error. No warning. Just a silently wrong metric, and you will believe it. This is
the single most valuable paragraph in this file.

**The defence:** `assert predictions.shape == actuals.shape` before any elementwise
comparison. One line, and it converts a silent wrong answer into a loud crash.

## 6. Axis — the argument everyone gets backwards

`axis` is the dimension that gets **collapsed**.

```python
X = np.arange(12).reshape(3, 4)

X.sum()            # 66     everything
X.sum(axis=0)      # (4,)   collapsed the 3 rows -> per-column totals
X.sum(axis=1)      # (3,)   collapsed the 4 cols -> per-row totals
```

Say it as "collapse axis 0" rather than "sum over rows" and you will stop guessing.

`keepdims=True` preserves the dimension as 1, which keeps broadcasting predictable:

```python
X - X.mean(axis=1, keepdims=True)     # (3,4) - (3,1) -> (3,4)   correct
X - X.mean(axis=1)                    # (3,4) - (3,)  -> ERROR or worse
```

## 7. Indexing

```python
X[0]            # first row
X[:, 0]         # first column -> shape (3,), not (3,1)
X[1:3, 2:]      # slice both axes
X[X > 5]        # boolean mask -> always 1-D
X[[0, 2]]       # fancy indexing -> rows 0 and 2
```

**Views vs copies**, and this one causes real bugs:

```python
a = np.arange(10)
b = a[2:5]          # a VIEW — shares memory
b[0] = 99           # a is now modified too

c = a[[2, 3, 4]]    # fancy indexing — a COPY
c[0] = 0            # a unchanged
```

Basic slicing gives views; boolean and fancy indexing give copies. When in doubt,
`.copy()` explicitly. A function that quietly mutates its caller's array is a bug that
takes a day to find.

## 8. Useful functions you will reach for constantly

```python
np.where(cond, a, b)          # vectorised if/else
np.clip(x, lo, hi)
np.unique(x, return_counts=True)
np.argmax(x, axis=1)          # index of max — the classifier's prediction
np.argsort(x)
np.concatenate([a, b], axis=0)
np.stack([a, b])              # new axis
np.isnan(x), np.isfinite(x)
np.allclose(a, b)             # float comparison — never use ==
```

`np.allclose` matters: `0.1 + 0.2 == 0.3` is `False` in floating point. Comparing floats
with `==` is a bug waiting for a test suite to find.

## 9. Random numbers — the modern API

```python
rng = np.random.default_rng(seed=42)      # do this
rng.normal(0, 1, size=(100, 3))
rng.integers(0, 10, size=20)
rng.choice(data, size=50, replace=False)
rng.shuffle(arr)                          # in place
```

The old `np.random.seed()` / `np.random.rand()` global API still works but shares hidden
global state between libraries — one library's call advances your sequence. Use a
`Generator`; pass it around explicitly.

---

## Exercise 2

Closed book. Answer **before** running, then check:

1. Predict the output shape of each, then verify:
   ```python
   np.zeros((5, 3))  + np.ones(3)
   np.zeros((5, 3))  + np.ones((5, 1))
   np.zeros((5, 3))  + np.ones(5)
   np.zeros((5, 1))  + np.ones(3)
   np.zeros((5, 3)).sum(axis=1, keepdims=True) + np.ones((5, 3))
   ```
   The fourth is the interesting one. Explain in words why it does what it does.

2. Standardise a `(1000, 5)` matrix column-wise, in one line, no loop.

3. Write `mse(predictions, actuals)` that is **correct even when one input is `(n,)`
   and the other is `(n, 1)`**. Then write the assertion that would have caught the
   silent bug in section 5 instead.

4. Given `y_true` and `y_pred` as integer class labels, compute a confusion matrix using
   only numpy. No sklearn, no loops over samples.

5. Take one loop from your Imboni code that walks a list of numbers. Rewrite it in
   numpy. Time both with `timeit` on 100,000 elements and report the ratio.

6. Demonstrate the view-vs-copy trap: write a function that accidentally mutates its
   caller's array, then fix it.

Exercise 3 is the one that will save you real hours later.
