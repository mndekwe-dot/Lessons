# 01 — Linear Algebra

**Weeks 5–6.** Only what is load-bearing. You need shapes and the dot product; you do
not need to invert a matrix by hand, ever.

---

## Table of Contents

1. [The three objects](#1-the-three-objects)
2. [The dot product — the most important idea here](#2-the-dot-product--the-most-important-idea-here)
3. [Matrix multiplication](#3-matrix-multiplication)
4. [Norms — measuring size](#4-norms--measuring-size)
5. [Systems of equations, and why you never invert](#5-systems-of-equations-and-why-you-never-invert)
6. [Eigenvectors and PCA](#6-eigenvectors-and-pca)
7. [What you can safely skip](#7-what-you-can-safely-skip)
8. [Exercise 1](#exercise-1)

---

## 1. The three objects

```
scalar   5                       shape ()
vector   [1, 2, 3]               shape (3,)
matrix   [[1, 2], [3, 4]]        shape (2, 2)
tensor   anything with more axes  shape (batch, channels, height, width)
```

In ML the shapes carry the meaning:

```
X  (n_samples, n_features)     your data — one row per observation
y  (n_samples,)                labels — one per row
w  (n_features,)               model weights — one per feature
```

**Think in shapes, not in numbers.** Almost every bug you will hit in the next nine
months is a shape bug, and shape fluency is what stops them.

## 2. The dot product — the most important idea here

```python
a · b = a₁b₁ + a₂b₂ + ... + aₙbₙ      # multiply pairwise, sum
np.dot(a, b)     # or  a @ b
```

Two vectors, one number out. That number is **how aligned they are**:

- Large positive → pointing the same way
- Zero → perpendicular, unrelated
- Large negative → opposite

This single idea explains, later in this course:

| Where | What the dot product is doing |
|---|---|
| Linear regression | `prediction = w · x` — weighted sum of features |
| Cosine similarity | How similar two documents are |
| Embeddings | Why "king" and "queen" are close |
| Attention in transformers | Every token asking every other token "how relevant are you?" |
| Convolution | A filter checking how well it matches a patch of image |

When you reach transformers in Phase 5 and read "scaled dot-product attention", it will
mean something because of this section. That is why the maths comes first.

**Cosine similarity** is the dot product with length divided out — it measures direction
only, ignoring magnitude:

```python
cos = (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))    # -1 to 1
```

Use it whenever "how similar" should not depend on "how big". Two documents about the
same topic are similar whether one is 200 words or 2,000.

## 3. Matrix multiplication

`(m, n) @ (n, p) -> (m, p)`

**The inner dimensions must match, and they vanish. The outer ones survive.**

```python
X = np.random.randn(100, 5)     # 100 samples, 5 features
w = np.random.randn(5)          # 5 weights
predictions = X @ w             # (100, 5) @ (5,) -> (100,)
```

That one line *is* linear regression's prediction step — one dot product per row, done
in one compiled operation instead of a Python loop.

`@` is matrix multiplication. `*` is elementwise. Confusing them is a top-three bug:

```python
A @ B      # matrix product — inner dims must match
A * B      # elementwise — shapes must broadcast
```

**Order matters.** `A @ B ≠ B @ A`, and usually one of them is a shape error while the
other silently produces nonsense.

The transpose flips axes, and exists mostly to make dimensions line up:

```python
X.T @ X        # (5,100) @ (100,5) -> (5,5)   appears everywhere in ML
```

## 4. Norms — measuring size

```python
np.linalg.norm(v)            # L2: sqrt(sum of squares) — ordinary distance
np.linalg.norm(v, ord=1)     # L1: sum of absolute values
```

You meet these again immediately as regularisation:

- **L2 (Ridge)** shrinks all weights toward zero, smoothly. Nothing reaches exactly zero.
- **L1 (Lasso)** drives some weights to *exactly* zero — so it selects features.

That difference is the whole practical distinction between Ridge and Lasso, and it
follows from the shape of the two norms.

## 5. Systems of equations, and why you never invert

Linear regression's closed-form solution is:

```
w = (XᵀX)⁻¹ Xᵀy
```

You should recognise this. You should **never compute it that way.**

```python
w = np.linalg.inv(X.T @ X) @ X.T @ y     # NO — unstable, slow
w = np.linalg.solve(X.T @ X, X.T @ y)    # better
w = np.linalg.lstsq(X, y, rcond=None)[0] # best — handles rank-deficiency
```

Explicit inversion amplifies floating-point error badly when the matrix is close to
singular — which happens whenever two features are highly correlated. `lstsq` handles
it. The general rule in all numerical computing: **solve, don't invert.**

## 6. Eigenvectors and PCA

An eigenvector of a matrix is a direction the matrix only *stretches*, without rotating.
Its eigenvalue is how much.

You need this for exactly one thing at your level: **PCA**.

PCA finds the directions of greatest variance in your data. Those directions are the
eigenvectors of the covariance matrix; the eigenvalues say how much variance each one
captures. Keeping the top few gives you fewer dimensions with most of the information.

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)
print(pca.explained_variance_ratio_)     # how much you kept
```

**PCA requires standardised inputs.** Otherwise a feature measured in metres dominates
one measured in kilometres purely through unit choice — the algorithm cannot tell
"large variance" from "large units."

**And PCA components are not interpretable.** "Component 1" is a blend of all your
original features. If you need to explain a decision to a headteacher or a regulator,
PCA has cost you that ability. Use it for compression and visualisation, not when the
explanation matters.

## 7. What you can safely skip

Determinants beyond "zero means singular." Cross products. Matrix decompositions beyond
knowing SVD exists and underlies PCA. Proving anything. Hand computation of any kind.

---

## Exercise 1

Closed book. **Predict before you run**, every time.

1. For each, state the output shape or "error", then check:
   ```python
   np.zeros((100, 5)) @ np.zeros(5)
   np.zeros((100, 5)) @ np.zeros((5, 3))
   np.zeros((100, 5)) @ np.zeros((3, 5))
   np.zeros((100, 5)).T @ np.zeros((100, 5))
   np.zeros((100, 5)) * np.zeros(5)
   ```

2. Implement cosine similarity from scratch. Use it to find the two most similar rows
   in a small dataset. Then explain, in one sentence, when cosine is right and when
   plain Euclidean distance is right.

3. Solve a linear regression three ways on the same data — `inv`, `solve`, `lstsq`.
   Compare the coefficients. Then add a feature that is a near-duplicate of another
   (`X[:, 5] = X[:, 2] + tiny_noise`) and compare again. **Which method breaks first,
   and by how much?**

4. Run PCA on a standardised dataset. How many components reach 90% explained variance?
   Now run it **without** standardising and compare. Explain the difference.

5. Write `predict(X, w)` for linear regression as a single line with `@`. Add the shape
   assertions that would catch a caller passing `w` with the wrong length.

Exercise 3 is the one that teaches something a textbook cannot: you will see numerical
instability happen, in your own output, rather than be told it exists.
