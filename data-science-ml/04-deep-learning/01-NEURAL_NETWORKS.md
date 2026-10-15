# 01 — Neural Networks

**Weeks 20–21.** What a network actually is, before any framework hides it.

---

## Table of Contents

1. [A neuron is a linear model with a bend](#1-a-neuron-is-a-linear-model-with-a-bend)
2. [The architecture](#2-the-architecture)
3. [Activations](#3-activations)
4. [Loss functions](#4-loss-functions)
5. [Initialisation](#5-initialisation)
6. [Regularisation](#6-regularisation)
7. [The training loop](#7-the-training-loop)
8. [When a network is the wrong tool](#8-when-a-network-is-the-wrong-tool)
9. [Exercise 1](#exercise-1)

---

## 1. A neuron is a linear model with a bend

```
output = activation(w · x + b)
```

That is a logistic regression when the activation is a sigmoid. **One neuron is a model
you already understand.**

The power comes from stacking them. A linear function of a linear function is still
linear — so without the non-linear activation, a hundred layers collapse algebraically
into one. **The activation is the only reason depth means anything.**

## 2. The architecture

```
input (n_features) -> hidden (h₁) -> hidden (h₂) -> output
```

Each layer is a matrix multiply plus a bias plus an activation:

```python
h1 = relu(X @ W1 + b1)      # (n, features) @ (features, h1) -> (n, h1)
h2 = relu(h1 @ W2 + b2)
out = h2 @ W3 + b3
```

Track the shapes. `01-mathematics/01-LINEAR_ALGEBRA.md §3` — inner dimensions must match
and vanish; outer ones survive. Every "cannot multiply" error you will hit is that rule.

**The universal approximation theorem** says a network with one sufficiently wide hidden
layer can approximate any continuous function. It is often quoted and rarely useful: it
says nothing about how wide, whether you can *find* those weights by gradient descent, or
whether the result generalises. Depth beats width in practice for reasons the theorem
does not address.

## 3. Activations

| Function | Range | Notes |
|---|---|---|
| **ReLU** `max(0, x)` | [0, ∞) | The default. Fast, no vanishing gradient for positives |
| Leaky ReLU | (−∞, ∞) | Fixes "dying ReLU" — neurons stuck outputting 0 forever |
| GELU | smooth | The transformer default |
| Sigmoid | (0, 1) | **Output layer only**, binary classification |
| Tanh | (−1, 1) | Zero-centred; largely superseded |
| Softmax | sums to 1 | **Output layer only**, multi-class |

**Sigmoid and tanh saturate** — their gradient approaches zero at both extremes, so
learning stops. That is the vanishing gradient problem
(`01-mathematics/04-CALCULUS_FOR_ML.md §7`), and ReLU's flat-then-linear shape is what
largely solved it and made deep networks trainable.

**Dying ReLU:** a neuron whose input is always negative outputs zero forever, and its
gradient is zero, so it never recovers. Leaky ReLU gives a small negative slope so there
is always some gradient.

**Never put an activation on a regression output.** ReLU there makes negative predictions
impossible; sigmoid caps you at 1. The output layer is bare unless you specifically want
that constraint.

## 4. Loss functions

| Task | Loss | Why |
|---|---|---|
| Regression | MSE | Gaussian likelihood |
| Regression, outliers | Huber | MSE near zero, MAE in the tails |
| Binary classification | Binary cross-entropy | Bernoulli likelihood |
| Multi-class | Cross-entropy | Categorical likelihood |

These are not arbitrary choices — `01-mathematics/03-PROBABILITY.md §5` shows each is
maximum likelihood under an assumption about your noise. Knowing the assumption tells you
when the loss is wrong.

**A framework detail that causes real bugs:** PyTorch's `CrossEntropyLoss` applies
softmax internally. Applying softmax yourself *and* using it applies softmax twice, which
does not error — it just trains badly. Pass raw logits.

## 5. Initialisation

Not a detail. Get it wrong and the network does not train.

- **All zeros** — every neuron in a layer computes the same thing and receives the same
  gradient, forever. The layer is effectively one neuron. This is the symmetry problem.
- **Too large** — activations explode, gradients explode, loss becomes NaN.
- **Too small** — signal vanishes through the layers.

```python
nn.init.kaiming_normal_(w, nonlinearity='relu')   # He — for ReLU
nn.init.xavier_uniform_(w)                        # Glorot — for tanh/sigmoid
```

Both scale the variance by the layer's fan-in so the signal keeps roughly constant
magnitude through depth. Frameworks default to something sensible, so this mostly matters
when you build layers by hand — as you will in the next file.

## 6. Regularisation

**Dropout** — randomly zero a fraction of activations during training:

```python
nn.Dropout(p=0.5)
```

It forces redundancy: no neuron can rely on any specific other one. **Active in training,
off at inference** — `model.eval()` handles this, and forgetting it is one of the most
common PyTorch bugs. It produces the odd symptom of validation loss *below* training loss.

**Batch normalisation** — normalise each layer's inputs per mini-batch:

```python
nn.BatchNorm1d(hidden_size)
```

Stabilises and speeds up training, and allows higher learning rates. It behaves
differently in train and eval mode (batch statistics vs running averages) — another
reason `model.eval()` matters.

**LayerNorm** normalises per sample instead of per batch, so it is independent of batch
size. It is what transformers use.

**Weight decay** — L2 on the weights. **Early stopping** — the cheapest of all
(`01-mathematics/05-OPTIMISATION.md §5`).

## 7. The training loop

Every framework wraps this. Know it:

```
for each epoch:
    for each mini-batch:
        1. forward pass    -> predictions
        2. compute loss
        3. zero gradients        <- forgetting this accumulates them silently
        4. backward pass   -> gradients
        5. optimiser step  -> update weights
    evaluate on validation
```

**Step 3 is the classic omission.** PyTorch accumulates gradients by default (useful for
gradient accumulation across batches). Forget `optimizer.zero_grad()` and your gradients
are the running sum of every batch so far. It does not error; the model just trains
strangely.

## 8. When a network is the wrong tool

State this plainly, because Phase 5 makes neural networks feel like the destination:

**On tabular data of the size you have, gradient boosting usually wins.** Neural networks
earn their place on images, audio, text, and very large datasets — data with spatial,
sequential, or semantic structure that trees cannot exploit.

For Imboni's attendance and grades, a neural network is very likely the wrong answer, and
`06-WHEN_NOT_TO_USE_DL.md` argues that properly. Learn this phase so you can debug and
fine-tune, and so your refusal to use it is informed rather than ignorant.

---

## Exercise 1

Before touching PyTorch:

1. On paper, for a network with input 4, hidden 8, hidden 4, output 1: write every weight
   matrix shape and count the total parameters including biases.
2. Explain in two sentences why removing all activations makes depth pointless. Then
   demonstrate it: build a 3-layer linear-only network and show it cannot fit XOR.
3. Initialise a network to all zeros. Train it. Explain what you observe.
4. Plot ReLU, leaky ReLU, sigmoid and tanh, and their derivatives. Mark where each
   saturates. Which would you pick for a 20-layer network, and why?
5. Construct a dying-ReLU case: a neuron whose input is always negative. Show its gradient
   is zero. Fix it with leaky ReLU.
6. Write the five-step training loop from memory, in comments, then in code.
7. Deliberately omit `zero_grad()`. Plot the loss. Describe the symptom precisely enough
   that you would recognise it later.

Exercises 3, 5 and 7 all produce a failure you must be able to recognise on sight. That
recognition is what makes the next four files debuggable rather than magical.
