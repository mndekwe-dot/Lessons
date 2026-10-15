# 01 — Python for Data

**Week 1.** The Python a data role assumes you already have, and the parts that are
genuinely different from the Python you write in Django.

---

## Table of Contents

1. [Why this file exists](#why-this-file-exists)
1. [Comprehensions, and when they stop being clearer](#1-comprehensions-and-when-they-stop-being-clearer)
2. [Generators — the memory idea](#2-generators--the-memory-idea)
3. [Unpacking](#3-unpacking)
4. [Type hints](#4-type-hints)
5. [Project layout — not a notebook](#5-project-layout--not-a-notebook)
6. [Paths, encodings, and the boring things that break](#6-paths-encodings-and-the-boring-things-that-break)
7. [Randomness and reproducibility](#7-randomness-and-reproducibility)
8. [Exercise 1](#exercise-1)

---

## Why this file exists

You write Python daily in Imboni. So the temptation is to skip this. Don't — data
Python leans on a different subset of the language. Django code is mostly classes,
methods and ORM calls. Data code is mostly transformations over sequences, and the
idioms that make it readable are ones you may never have needed.

There is also a performance model here that has no equivalent in web work: in Django,
a slow loop is usually a slow *query*. In data code, a slow loop is a slow loop, and
the fix is to stop looping.

---

## 1. Comprehensions, and when they stop being clearer

```python
squares = [x**2 for x in numbers]
evens   = [x for x in numbers if x % 2 == 0]
pairs   = {name: len(name) for name in names}
unique  = {word.lower() for word in words}
```

The rule: **one transformation and at most one filter.** Past that, a loop reads better.

```python
# Unreadable — and you will misread it in three months
result = [f(x) for row in matrix for x in row if g(x) and h(x)]

# Fine
result = []
for row in matrix:
    for x in row:
        if g(x) and h(x):
            result.append(f(x))
```

Nested comprehensions read outermost-loop-first, which is the opposite of how people
expect, and is a reliable source of bugs.

## 2. Generators — the memory idea

A list comprehension builds everything. A generator yields one at a time.

```python
sum([x**2 for x in range(10_000_000)])   # builds a 10M-element list first
sum(x**2 for x in range(10_000_000))     # constant memory
```

This matters the first time a dataset does not fit in RAM. It is the same instinct as
streaming a large queryset with `.iterator()` instead of loading it — you have met the
idea, just in a different costume.

```python
def read_large_csv(path):
    with open(path) as f:
        next(f)                       # header
        for line in f:
            yield line.rstrip().split(',')
```

**The catch:** a generator is exhausted after one pass. Iterating twice silently gives
you nothing the second time, with no error. That surprises everyone once.

## 3. Unpacking

```python
first, *rest = [1, 2, 3, 4]          # 1, [2, 3, 4]
a, b = b, a                          # swap
head, *middle, tail = values

def train(X, y, *, epochs=10, lr=0.01):   # keyword-only after *
    ...
```

Keyword-only arguments are worth adopting deliberately. `train(X, y, 10, 0.01)` at a
call site tells the reader nothing; `train(X, y, epochs=10, lr=0.01)` tells them
everything. ML functions accumulate parameters fast, and this is what keeps them
readable.

## 4. Type hints

Not enforced at runtime, but they are how you read code six months later.

```python
from typing import Iterable
import numpy as np
import pandas as pd

def normalise(values: np.ndarray) -> np.ndarray:
    return (values - values.mean()) / values.std()

def load_students(path: str, columns: list[str] | None = None) -> pd.DataFrame:
    ...
```

In data code the useful information is usually the **shape**, which the type system
cannot express. Put it in the docstring, and treat that as non-optional:

```python
def predict(X: np.ndarray) -> np.ndarray:
    """
    X: (n_samples, n_features) float64
    returns: (n_samples,) float64 in [0, 1]
    """
```

Shape mismatches are the most common bug in all of ML. Writing the shapes down is the
cheapest defence that exists.

## 5. Project layout — not a notebook

The single habit that separates people whose work survives:

```
project/
├── data/
│   ├── raw/          # never edited, never committed
│   └── processed/    # generated, reproducible, also not committed
├── notebooks/        # exploration only
├── src/
│   ├── data.py       # loading and cleaning
│   ├── features.py   # feature engineering
│   ├── model.py      # train and predict
│   └── evaluate.py
├── tests/
├── pyproject.toml
└── README.md
```

**Notebooks are for exploring. `src/` is for anything that has to run twice.** The
moment a notebook cell matters, move it into a function in `src/` and import it back
into the notebook. Otherwise you end up with a 300-cell notebook that only works if
you run the cells in an order nobody wrote down — the single most common way data work
becomes unreproducible.

You already know this instinct from web work. It transfers directly, and most people
coming into data science from a certificate do not have it. It is worth more than it
looks.

## 6. Paths, encodings, and the boring things that break

```python
from pathlib import Path

DATA = Path(__file__).parent.parent / 'data'
df = pd.read_csv(DATA / 'raw' / 'students.csv')      # not 'data/raw/students.csv'
```

Relative string paths break the moment someone runs the script from a different
directory. `pathlib` from the start costs nothing.

On encodings: real CSVs from real schools arrive as Windows-1252 or UTF-8-with-BOM.
`pd.read_csv(path, encoding='utf-8-sig')` handles the BOM. When a column of names comes
back with `Ã©` in it, that is a double-decoded UTF-8, and the fix is upstream, not a
`.replace()`.

## 7. Randomness and reproducibility

```python
import random, numpy as np

SEED = 42
random.seed(SEED)
np.random.seed(SEED)
```

Anything with a random component — train/test splits, initialisation, shuffling,
sampling — must be seeded, or you cannot tell an improvement from noise between two
runs. This is not tidiness; it is the difference between an experiment and a guess.

**The trap:** a seed makes a result *reproducible*, not *correct*. If your model only
looks good on seed 42, you do not have a model — you have a coincidence. Check across
several seeds before believing anything.

---

## Exercise 1

With this file closed:

1. Write a generator that reads a CSV and yields only rows where a given column exceeds
   a threshold. Never load the whole file.
2. Rewrite this without a loop, then say in one sentence why the rewrite is clearer —
   or admit it isn't:
   ```python
   result = []
   for s in students:
       if s['grade'] >= 60:
           result.append({'name': s['name'].title(), 'passed': True})
   ```
3. Take one function you wrote in Imboni that transforms a list. Add type hints and a
   shape/contract docstring. Would a stranger now know what to pass it?
4. Set up the project layout above for a scratch project. Put one real function in
   `src/` and import it into a notebook.
5. Write a function whose result changes between runs. Then seed it. Then run it under
   five different seeds and report the spread. **That spread is the number you must beat
   before calling any improvement real.**

Question 5 is the one that matters. Most people never do it, and then spend a week
chasing an improvement that was noise all along.
