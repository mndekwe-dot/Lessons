# 04 — Calculus for ML

**Week 9.** One week, and you need less than you fear. No integrals by hand. Ever.

You need exactly one thing: **how a small change in a parameter changes the loss.**
That is a derivative, and it is how every model in this course learns.

---

## Table of Contents

1. [The derivative as a slope](#1-the-derivative-as-a-slope)
2. [Partial derivatives and the gradient](#2-partial-derivatives-and-the-gradient)
3. [The chain rule — this *is* backpropagation](#3-the-chain-rule--this-is-backpropagation)
4. [Worked: the gradient of MSE](#4-worked-the-gradient-of-mse)
5. [Convexity — why some problems are easy](#5-convexity--why-some-problems-are-easy)
6. [Learning rate — the one hyperparameter you will always tune](#6-learning-rate--the-one-hyperparameter-you-will-always-tune)
7. [Vanishing and exploding gradients](#7-vanishing-and-exploding-gradients)
8. [Autodiff — what PyTorch is doing](#8-autodiff--what-pytorch-is-doing)
9. [Exercise 4](#exercise-4)

---

## 1. The derivative as a slope

`f'(x)` = how fast `f` changes at `x`.

- Positive → increasing → to *decrease* f, move **left**
- Negative → decreasing → to decrease f, move **right**
- Zero → flat → a minimum, maximum, or saddle

**That is the entire idea behind training.** Compute the slope of the loss with respect
to each parameter, then step in the opposite direction.

The handful of rules you actually use:

```
d/dx (xⁿ)     = n·xⁿ⁻¹
d/dx (eˣ)     = eˣ
d/dx ln(x)    = 1/x
d/dx (f + g)  = f' + g'
d/dx (f·g)    = f'g + fg'
```

## 2. Partial derivatives and the gradient

With many parameters, differentiate with respect to one at a time, holding the rest
fixed. Collect them into a vector — the **gradient**:

```
∇f = [∂f/∂w₁, ∂f/∂w₂, ..., ∂f/∂wₙ]
```

**The gradient points uphill, in the direction of steepest increase.** So to minimise,
step *against* it. That is the whole of gradient descent:

```python
w = w - learning_rate * gradient
```

Every model you train for the rest of your life is doing that, or a refinement of it.

## 3. The chain rule — this *is* backpropagation

For nested functions:

```
d/dx f(g(x)) = f'(g(x)) · g'(x)
```

Differentiate the outside, keep the inside, multiply by the inside's derivative.

A neural network is nested functions:

```
loss(activation(weights · activation(weights · input)))
```

Backpropagation is the chain rule applied from the loss backwards, layer by layer,
reusing each intermediate result instead of recomputing it. **That is all it is.**

The word "backpropagation" makes it sound like a separate algorithm. It is the chain
rule plus dynamic programming. When you implement it from scratch in
`04-deep-learning/02-BACKPROP_FROM_SCRATCH.md`, this sentence is what you are building.

## 4. Worked: the gradient of MSE

You will derive this by hand for Checkpoint 2, so here is the shape.

```
prediction:  ŷ = Xw
loss:        L = (1/n) Σ (ŷᵢ - yᵢ)²
```

Differentiating with respect to `w`, via the chain rule:

```
∂L/∂w = (2/n) Xᵀ(Xw - y)
```

In code:

```python
def gradient(X, y, w):
    n = len(y)
    error = X @ w - y                 # (n,)
    return (2 / n) * (X.T @ error)    # (n_features,)

def fit(X, y, lr=0.01, epochs=1000):
    w = np.zeros(X.shape[1])
    for _ in range(epochs):
        w -= lr * gradient(X, y, w)
    return w
```

Nine lines, and that is linear regression trained from first principles. Everything
else in machine learning is a more elaborate version of this loop.

## 5. Convexity — why some problems are easy

**Convex**: one minimum. Gradient descent will find it, from any starting point.
Linear and logistic regression are convex. This is why they are reliable.

**Non-convex**: many local minima. Where you start matters. Every neural network is
non-convex.

The reassuring fact from practice: in very high dimensions, bad local minima turn out
to be rare. Most flat points are **saddle points** — minima in some directions, maxima
in others — and momentum-based optimisers escape those. This is why deep learning works
at all despite having no convergence guarantee.

## 6. Learning rate — the one hyperparameter you will always tune

| Too small | Too large |
|---|---|
| Trains forever | Overshoots; loss oscillates or goes to NaN |

**Always plot the loss curve.** It diagnoses instantly:

- Smooth decrease, flattening → good
- Decreasing very slowly → raise the learning rate
- Spiking, oscillating, or NaN → lower it, by 10× to start
- Flat from the start → check for a bug before touching the learning rate

A NaN loss is nearly always: learning rate too high, a `log(0)`, or a division by zero.

## 7. Vanishing and exploding gradients

The chain rule multiplies derivatives across layers. Multiply many numbers below 1 and
the product vanishes; many above 1 and it explodes.

- **Vanishing** → early layers stop learning. Sigmoid saturates at both ends and is the
  classic culprit; ReLU largely fixed it.
- **Exploding** → NaN. Fixed with gradient clipping.

**Residual connections** (`output = f(x) + x`) work because the `+ x` gives the gradient
a path that is multiplied by 1. It flows straight through. That is why ResNets can be
150 layers deep and this is the answer to the Checkpoint 5 question.

## 8. Autodiff — what PyTorch is doing

You will hand-derive gradients twice, to understand them, then never again:

```python
import torch
x = torch.tensor([2.0], requires_grad=True)
y = x ** 2 + 3 * x
y.backward()
print(x.grad)      # 2x + 3 = 7
```

PyTorch records every operation into a graph, then walks it backwards applying the
chain rule. It is exact — not a numerical approximation.

Doing it by hand first is what makes the framework debuggable rather than magical. That
is the whole reason this file exists before `03-PYTORCH.md`.

---

## Exercise 4

Closed book:

1. Derive `∂L/∂w` for mean squared error, on paper. Show every chain-rule step.
2. Derive it for **logistic regression** with cross-entropy loss. It simplifies
   beautifully — the sigmoid's derivative cancels. Show why.
3. Implement gradient descent for linear regression in numpy. Plot the loss curve.
4. Run it at learning rates `0.0001, 0.001, 0.01, 0.1, 1.0`. Plot all five loss curves
   on one chart. Which diverge? Which crawl? Write the one-sentence rule you would give
   someone else.
5. Verify your hand-derived gradient numerically:
   ```
   (f(w + h) - f(w - h)) / (2h)     with h = 1e-5
   ```
   Compare against your analytic gradient. They should agree to ~6 decimal places.
   **If they do not, your derivation is wrong** — this is how you check yourself.
6. Reproduce the same result with `torch.autograd` and confirm all three agree.

Exercise 5 is the professional habit. Gradient checking is how people catch derivation
bugs that otherwise show up as "the model just does not learn well" and cost a week.
