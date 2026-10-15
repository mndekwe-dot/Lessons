# 05 — Optimisation

*Extra. Read after 04.* How the descent step is actually taken in practice.

---

## Table of Contents

1. [Three flavours of gradient descent](#1-three-flavours-of-gradient-descent)
2. [Momentum](#2-momentum)
3. [Adaptive methods, and Adam](#3-adaptive-methods-and-adam)
4. [Learning rate schedules](#4-learning-rate-schedules)
5. [Regularisation, viewed as optimisation](#5-regularisation-viewed-as-optimisation)
6. [Diagnosing from the loss curve](#6-diagnosing-from-the-loss-curve)
7. [Exercise 5](#exercise-5)

---

## 1. Three flavours of gradient descent

| Variant | Gradient computed on | Trade-off |
|---|---|---|
| **Batch** | The whole dataset | Accurate, stable, slow; needs all data in memory |
| **Stochastic (SGD)** | One sample | Fast, very noisy, can escape shallow minima |
| **Mini-batch** | 32–512 samples | **What everyone actually uses** |

Mini-batch wins for a reason that is hardware, not mathematics: a batch of 256 is one
matrix multiply the GPU parallelises, while 256 single samples are 256 small ones.

**Batch size effects worth knowing:**

- Larger → smoother gradients, better hardware use, more memory
- Smaller → noisier, and that noise acts as a mild regulariser
- Change batch size and you usually must change learning rate. A rough rule: scale the
  learning rate linearly with batch size.

An **epoch** is one pass over the data. A **step** is one parameter update. With 10,000
samples and batch size 100, one epoch is 100 steps.

## 2. Momentum

Plain SGD zigzags across narrow valleys — steep in one direction, shallow in another.
Momentum accumulates a velocity, damping the oscillation and accelerating along the
consistent direction.

```
v = β·v + (1-β)·gradient        # β typically 0.9
w = w - lr·v
```

The physical analogy is exact: a ball rolling downhill keeps some of its previous
motion instead of responding only to the current slope.

## 3. Adaptive methods, and Adam

Different parameters deserve different step sizes. A feature appearing in 1% of samples
should not get the same step as one appearing in every sample.

- **AdaGrad** — divides by accumulated squared gradients. The accumulator only grows,
  so the learning rate decays to zero and learning stops.
- **RMSprop** — uses a moving average instead, fixing that.
- **Adam** — RMSprop **plus** momentum. The default for almost everything.

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
```

**Defaults worth memorising:** `lr=1e-3`, `β₁=0.9`, `β₂=0.999`. Adam at `1e-3` is the
correct first thing to try for a neural network, essentially always.

**AdamW** decouples weight decay from the gradient update and is the better default for
transformers. Use it there.

**The honest caveat:** well-tuned SGD with momentum still beats Adam on some vision
tasks, generalising slightly better. Adam is the best *default*, not the best possible.

## 4. Learning rate schedules

A constant learning rate is rarely optimal — you want large steps early and fine ones
late.

```python
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5)
```

- **Step decay** — multiply by 0.1 every N epochs. Simple, effective.
- **Cosine annealing** — smooth decay to near zero. The modern default.
- **Reduce on plateau** — drop when validation stops improving. Robust when you have no
  intuition for the schedule.
- **Warmup** — start tiny and ramp up over the first few hundred steps. Essential for
  transformers, which are unstable at full learning rate from step one.

**Finding a learning rate empirically** — the LR range test: train for a few hundred
steps while increasing the learning rate exponentially, and plot loss against it. Pick
roughly an order of magnitude below where the loss starts rising. Ten minutes, and it
beats guessing.

## 5. Regularisation, viewed as optimisation

Adding a penalty term changes what you are optimising:

```
L = data_loss + λ · penalty
```

- **L2 / weight decay** — `λ·Σw²`. Shrinks all weights smoothly toward zero.
- **L1** — `λ·Σ|w|`. Drives some weights to exactly zero; performs feature selection.
- **Elastic net** — both.

The connection to `01-LINEAR_ALGEBRA.md §4`: the geometry of the two norms is *why* L1
zeroes coefficients and L2 does not. The L1 constraint region has corners on the axes;
the optimum lands on a corner, and a corner means a coordinate is exactly zero.

**Early stopping** is regularisation too, and the cheapest kind: stop when validation
loss stops improving, keep the best checkpoint. Always worth having.

```python
if val_loss < best:
    best, patience_counter = val_loss, 0
    torch.save(model.state_dict(), 'best.pt')
else:
    patience_counter += 1
    if patience_counter >= patience:
        break
```

**Restore the best checkpoint afterwards.** Stopping the loop leaves you holding the
*worst* of the last few epochs — a mistake that is easy to make and quietly costs you
performance.

## 6. Diagnosing from the loss curve

| Symptom | Likely cause |
|---|---|
| Loss flat from step 0 | Bug — a detached gradient, zero LR, or wrong loss |
| Loss → NaN | LR too high; `log(0)`; division by zero |
| Loss oscillates wildly | LR too high |
| Loss decreases painfully slowly | LR too low, or bad initialisation |
| Train falls, validation rises | Overfitting — regularise or stop earlier |
| Both plateau high | Underfitting — bigger model, better features, train longer |
| Validation *below* training | Usually dropout being active in train only. Or a leak. |

**Always plot both curves together.** The gap between them is the single most
informative picture in machine learning, and it tells you which of two completely
opposite actions to take.

---

## Exercise 5

1. Implement mini-batch gradient descent yourself. Compare convergence at batch sizes
   1, 32, and full-batch on the same data. Plot all three.
2. Add momentum to your implementation. Show a case where it visibly beats plain SGD.
3. Run the LR range test on a small network. Plot loss against learning rate and pick
   one from the curve. Then train with it and with a value 10× larger.
4. Train the same model with SGD, SGD+momentum, and Adam. Plot all three. Do not
   conclude "Adam is best" from one run — try three seeds.
5. Add L1 and L2 regularisation to a linear model. Count how many coefficients are
   **exactly** zero under each. Explain the difference using the geometry from
   `01-LINEAR_ALGEBRA.md §4`.
6. Implement early stopping with checkpoint restore. Then implement it **without** the
   restore and show that the final model is worse.
