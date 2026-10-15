# 06 — Notebooks and Tooling

*Extra.* Short, and it prevents a specific category of wasted week.

---

## Table of Contents

1. [The notebook problem](#1-the-notebook-problem)
2. [The split that actually works](#2-the-split-that-actually-works)
3. [Environments](#3-environments)
4. [Code quality tooling](#4-code-quality-tooling)
5. [A pre-commit hook](#5-a-pre-commit-hook)
6. [Data does not go in git](#6-data-does-not-go-in-git)
7. [Useful notebook habits](#7-useful-notebook-habits)
8. [Exercise 6](#exercise-6)

---

## 1. The notebook problem

A Jupyter notebook has **hidden state**. Cells can be run in any order, and the output
you are looking at may have been produced by code you have since edited or deleted.

The failure mode is specific and common: your notebook works, you send it to someone,
it fails on their machine. Or you come back in a month, run it top to bottom, and it
breaks — because it only ever worked in the order you happened to execute it.

**The discipline:**

- **Restart & Run All before you trust any result.** If it does not survive that, it
  is not a result.
- Do it before every commit, and before showing anyone anything.
- Never edit a cell above output you intend to keep without re-running downstream.

## 2. The split that actually works

```
notebooks/     exploration, throwaway, messy — this is fine
src/           anything that has to run twice
```

The moment a cell matters, move it into a function in `src/` and import it back:

```python
%load_ext autoreload
%autoreload 2

from src.features import build_features   # edits to src/ take effect without restarting
```

This is the habit from `01-PYTHON_FOR_DATA.md` §5, and it is the single biggest thing
your web-engineering background gives you over someone arriving from a certificate.
Most data scientists never learn it, and their work cannot be handed to anyone.

**Notebooks in git:** they diff terribly — output and execution counts change every run.
Either strip output before committing (`nbstripout`, installable as a git filter) or
keep the real logic in `src/` where diffs are readable.

## 3. Environments

One environment per project. Always.

```bash
uv venv                      # fast; or python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
uv pip install pandas scikit-learn
uv pip freeze > requirements.txt
```

`uv` is a drop-in replacement for pip that is an order of magnitude faster. If you
prefer the standard tools, `python -m venv` and `pip` do the same job.

**Pin your versions.** `pandas==2.3.1`, not `pandas`. A model trained under one
scikit-learn version can fail to unpickle under another — and that failure arrives
six months later, in production, with no warning. Reproducibility is the whole point
of Phase 7; it starts here.

## 4. Code quality tooling

```bash
uv pip install ruff pytest
ruff check .          # lint
ruff format .         # format
pytest                # tests
```

`ruff` replaces flake8, isort, and black in one fast tool. Set it up once per project
and stop thinking about formatting.

**Yes, you test data code.** Not the model's accuracy — the transformations:

```python
def test_grade_normalisation_handles_missing():
    df = pd.DataFrame({'grade': [50, None, 100]})
    out = normalise_grades(df)
    assert out['grade'].isna().sum() == 0
    assert out['grade'].between(0, 1).all()
```

The bugs worth catching are in cleaning and feature code, and they are silent — a
wrong transformation does not raise, it just produces a slightly worse model that you
then blame on the algorithm.

## 5. A pre-commit hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.14.0
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/kynan/nbstripout
    rev: 0.8.1
    hooks:
      - id: nbstripout
```

```bash
uv pip install pre-commit && pre-commit install
```

Ten minutes, once, and formatting and notebook-output noise stop being things you
think about.

## 6. Data does not go in git

```gitignore
data/
*.csv
*.parquet
*.pkl
.ipynb_checkpoints/
.venv/
```

Two reasons, and the second is the serious one:

- Git stores every version of a binary forever; the repo becomes enormous
- **A committed dataset of student records is a data breach that survives deletion.**
  Removing the file in a later commit does not remove it from history.

You have already met the git-history version of this problem — `REMOVE_COMMITTED_ENV.md`
in `engineering-curriculum/02-backend/12-` is the procedure if it ever happens.

For real datasets: keep them out of the repo and record *where they came from and how
to regenerate them* in the README. A `make data` target beats a committed CSV.

## 7. Useful notebook habits

```python
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 200)

%time  expr        # time one statement
%timeit expr       # time it properly, repeated
%debug             # post-mortem into the last traceback
```

`%debug` immediately after an exception drops you into the frame where it broke, with
all the variables live. It is faster than adding print statements, and almost nobody
uses it.

---

## Exercise 6

1. Take any existing notebook you have. Restart & Run All. Did it survive? If not,
   that notebook was never a result.
2. Set up a project with `.venv`, pinned `requirements.txt`, `ruff`, and `pre-commit`.
3. Move one real function out of a notebook into `src/`, import it back with
   `autoreload`, and write a `pytest` test for it that would fail if the logic broke.
4. Add a `.gitignore` that excludes data. Then check whether any CSV is already in your
   history: `git log --all --diff-filter=A --name-only | grep -i csv`.
5. Deliberately raise an exception in a notebook and use `%debug` to inspect the frame.
