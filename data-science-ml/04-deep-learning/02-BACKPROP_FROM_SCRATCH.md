# 02 — Backpropagation From Scratch

**Week 21.** One exercise worth a month of tutorials.

You will build a working neural network in pure numpy, with no autograd. After this,
PyTorch stops being magic and becomes a convenience — and when a model does not train,
you will have a mental model of where to look.

---

## Table of Contents

1. [What you are building](#1-what-you-are-building)
2. [Forward pass](#2-forward-pass)
3. [The loss](#3-the-loss)
4. [Backward pass — the chain rule, layer by layer](#4-backward-pass--the-chain-rule-layer-by-layer)
5. [Gradient checking — the professional habit](#5-gradient-checking--the-professional-habit)
6. [The training loop](#6-the-training-loop)
7. [Prove it works](#7-prove-it-works)
8. [What the frameworks add](#8-what-the-frameworks-add)
9. [Exercise 2](#exercise-2)

---

## 1. What you are building

A two-layer network for binary classification:

```
X (n, d) -> [W1 (d, h), b1] -> ReLU -> [W2 (h, 1), b2] -> sigmoid -> ŷ (n, 1)
```

Trained with binary cross-entropy, by gradient descent, with gradients you derive
yourself.

## 2. Forward pass

```python
def forward(X, params):
    W1, b1, W2, b2 = params['W1'], params['b1'], params['W2'], params['b2']

    z1 = X @ W1 + b1            # (n, h)   pre-activation
    a1 = np.maximum(0, z1)      # (n, h)   ReLU
    z2 = a1 @ W2 + b2           # (n, 1)
    a2 = 1 / (1 + np.exp(-z2))  # (n, 1)   sigmoid

    cache = {'X': X, 'z1': z1, 'a1': a1, 'z2': z2, 'a2': a2}
    return a2, cache
```

**Keep the cache.** The backward pass needs every intermediate value; recomputing them is
the difference between backprop and something impossibly slow.

**Numerical stability:** `np.exp(-z2)` overflows for large negative `z2`. The stable form:

```python
def sigmoid(z):
    return np.where(z >= 0, 1 / (1 + np.exp(-z)), np.exp(z) / (1 + np.exp(z)))
```

Both branches are algebraically identical; each avoids overflow in its own regime. This
is the kind of detail frameworks handle for you and that you should see once.

## 3. The loss

```python
def bce(y, y_hat, eps=1e-12):
    y_hat = np.clip(y_hat, eps, 1 - eps)          # log(0) is -inf
    return -np.mean(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))
```

The clip is not optional. A single confident-and-wrong prediction gives `log(0)`, the
loss becomes `inf`, gradients become NaN, and everything downstream is poison.

## 4. Backward pass — the chain rule, layer by layer

Work backwards from the loss. Each step asks: *how does this quantity affect the loss?*

**The one that looks too simple:**

```python
dz2 = (a2 - y) / n          # (n, 1)
```

The derivative of binary cross-entropy with respect to the pre-activation `z2`, through
the sigmoid, is just `prediction − truth`. The sigmoid's derivative cancels exactly
against the loss's. This is not a coincidence — it is why this pairing is used, and it is
the same simplification you derived in
`01-mathematics/04-CALCULUS_FOR_ML.md` Exercise 2.

**Then propagate:**

```python
def backward(y, params, cache):
    n = len(y)
    X, a1, z1, a2 = cache['X'], cache['a1'], cache['z1'], cache['a2']

    dz2 = (a2 - y) / n                     # (n, 1)
    dW2 = a1.T @ dz2                       # (h, n) @ (n, 1) -> (h, 1)
    db2 = dz2.sum(axis=0)                  # (1,)

    da1 = dz2 @ params['W2'].T             # (n, 1) @ (1, h) -> (n, h)
    dz1 = da1 * (z1 > 0)                   # ReLU derivative: 1 if z>0 else 0
    dW1 = X.T @ dz1                        # (d, n) @ (n, h) -> (d, h)
    db1 = dz1.sum(axis=0)                  # (h,)

    return {'W1': dW1, 'b1': db1, 'W2': dW2, 'b2': db2}
```

**Two patterns to internalise, because they are all of backprop:**

- **A gradient with respect to a weight** is `input.T @ output_gradient`
- **A gradient flowing backwards through a layer** is `output_gradient @ weights.T`

Everything else — convolutions, attention, whatever comes next — is those two patterns
with different shapes.

**Every gradient has the same shape as the thing it is the gradient of.**
`dW1.shape == W1.shape`, always. Assert it. It catches most derivation errors instantly.

## 5. Gradient checking — the professional habit

Do not trust your derivation. **Verify it numerically.**

```python
def gradient_check(params, X, y, key, idx, h=1e-5):
    orig = params[key][idx]

    params[key][idx] = orig + h
    loss_plus = bce(y, forward(X, params)[0])

    params[key][idx] = orig - h
    loss_minus = bce(y, forward(X, params)[0])

    params[key][idx] = orig
    return (loss_plus - loss_minus) / (2 * h)      # numerical gradient
```

Compare against your analytic gradient using **relative** error:

```python
rel_err = abs(num - ana) / max(abs(num), abs(ana), 1e-8)
# < 1e-7  correct
# < 1e-5  probably fine
# > 1e-3  you have a bug
```

Use the **central** difference `(f(x+h) − f(x−h)) / 2h`, not the forward difference — it
is second-order accurate and far more reliable. And use `float64`; `float32` does not have
the precision for this check.

**This is how professionals catch derivation bugs.** Without it, a wrong gradient shows up
as "the model just does not learn very well", which you will blame on the architecture,
the learning rate, and the data — in that order, for a week.

## 6. The training loop

```python
def train(X, y, hidden=16, lr=0.1, epochs=2000, seed=42):
    rng = np.random.default_rng(seed)
    d = X.shape[1]
    params = {
        # He initialisation: scale by sqrt(2/fan_in) for ReLU
        'W1': rng.normal(0, np.sqrt(2 / d), (d, hidden)),
        'b1': np.zeros(hidden),
        'W2': rng.normal(0, np.sqrt(2 / hidden), (hidden, 1)),
        'b2': np.zeros(1),
    }

    history = []
    for epoch in range(epochs):
        y_hat, cache = forward(X, params)
        loss = bce(y, y_hat)
        grads = backward(y, params, cache)

        for k in params:
            params[k] -= lr * grads[k]

        history.append(loss)
    return params, history
```

**Plot `history`.** The loss curve is your entire diagnostic surface here, and
`01-mathematics/05-OPTIMISATION.md §6` is the table of what each shape means.

## 7. Prove it works

Train it on **XOR**. This is the classic test because XOR is not linearly separable — a
logistic regression cannot do better than chance on it, and a network with one hidden
layer can solve it exactly.

```python
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)
```

If your network learns XOR and logistic regression does not, your backprop is correct and
you have demonstrated, in your own code, why hidden layers exist.

## 8. What the frameworks add

Once this works, you have earned PyTorch. What it gives you:

- **Autodiff** — gradients derived automatically, exactly, for any graph you write
- **GPU** — the same matrix operations, hundreds of times faster
- **Layers and optimisers** — Adam, batch norm, convolutions, attention
- **Correct edge cases** — numerical stability, initialisation, mixed precision

What it does not give you is understanding of what to do when the loss goes to NaN. That
is what you just built.

---

## Exercise 2

**This is the highest-value exercise in Phase 5. Do not read a tutorial; derive it.**

1. Derive `∂L/∂z2` for BCE + sigmoid on paper. Show the cancellation explicitly.
2. Implement forward, loss, and backward. Assert every gradient's shape matches its
   parameter's.
3. Gradient-check **every** parameter at three random indices each. All relative errors
   below 1e-7. **Do not proceed until they are.**
4. Train on XOR. Plot the loss. Confirm it reaches near-zero and predicts all four rows
   correctly.
5. Train logistic regression on XOR. Show it cannot exceed chance. Write one sentence on
   what the hidden layer bought you.
6. Break it on purpose and record what each failure *looks like*:
   - remove the ReLU (use identity) — can it still solve XOR?
   - initialise all weights to zero
   - set the learning rate to 10
   - remove the `clip` in the loss and force a confident wrong prediction
7. Add a second hidden layer. Derive and implement the extra gradient step. Gradient-check
   it.
8. Re-implement the same network in PyTorch. Confirm both reach the same loss. **Then
   compare your gradients against `torch.autograd`'s** on the same weights — they should
   match to ~1e-6.

Exercise 8 is the satisfying one: your own derivation, verified against the framework.
After that, PyTorch is a tool rather than an oracle.
