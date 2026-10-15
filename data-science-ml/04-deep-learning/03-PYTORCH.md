# 03 — PyTorch

**Week 22.** Now that you have built backprop by hand, this is a convenience rather than
a mystery.

---

## Table of Contents

1. [Tensors](#1-tensors)
2. [Autograd](#2-autograd)
3. [Building a model](#3-building-a-model)
4. [Data loading](#4-data-loading)
5. [The training loop](#5-the-training-loop)
6. [Saving and loading](#6-saving-and-loading)
7. [Debugging](#7-debugging)
8. [Reproducibility](#8-reproducibility)
9. [Exercise 3](#exercise-3)

---

## 1. Tensors

A tensor is a numpy array that can live on a GPU and remember how it was computed.

```python
import torch

x = torch.tensor([1.0, 2.0, 3.0])
x = torch.from_numpy(arr)            # shares memory with numpy — no copy
x.numpy()                            # back again (CPU only)

x.shape, x.dtype, x.device
x.to('cuda')                         # or 'mps' on Apple silicon
```

Everything from `00-python-foundations/02-NUMPY.md` transfers: broadcasting, `axis` (here
called `dim`), reshape, indexing. **`dim` is numpy's `axis`** — same meaning, different
spelling.

Two differences that catch people:

- **Default dtype is `float32`**, not `float64`. Usually right for deep learning; wrong
  for the gradient checks in the last file.
- **Trailing underscore means in-place.** `x.add_(1)` mutates; `x.add(1)` returns a new
  tensor. In-place operations can break autograd — avoid them on anything requiring
  gradients.

## 2. Autograd

```python
x = torch.tensor([2.0], requires_grad=True)
y = x ** 2 + 3 * x
y.backward()
print(x.grad)          # 2x + 3 = 7
```

PyTorch records every operation into a graph and walks it backwards applying the chain
rule — exactly what you implemented by hand, generalised.

Three things worth knowing:

```python
with torch.no_grad():           # inference: no graph, less memory, faster
    preds = model(X)

x.detach()                      # a tensor cut out of the graph
loss.item()                     # a Python float — NEVER accumulate loss tensors
```

**`loss.item()` matters.** `total_loss += loss` keeps the entire computation graph alive
for every batch, and you run out of memory at epoch three for no visible reason.

**Gradients accumulate.** That is deliberate — it enables gradient accumulation across
batches — but it means `optimizer.zero_grad()` is mandatory.

## 3. Building a model

```python
import torch.nn as nn

class DropoutRiskNet(nn.Module):
    def __init__(self, n_features, hidden=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_features, hidden),
            nn.ReLU(),
            nn.BatchNorm1d(hidden),
            nn.Dropout(0.3),
            nn.Linear(hidden, hidden // 2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden // 2, 1),     # raw logits — no sigmoid here
        )

    def forward(self, x):
        return self.net(x)
```

**Output raw logits, not probabilities.** `BCEWithLogitsLoss` applies the sigmoid
internally using a numerically stable formulation — the log-sum-exp trick, which is the
same stability problem you hit by hand in the last file. Applying sigmoid yourself and
then using `BCELoss` is less stable and, with `CrossEntropyLoss`, actively wrong (double
softmax).

## 4. Data loading

```python
from torch.utils.data import TensorDataset, DataLoader

train_ds = TensorDataset(torch.tensor(X_train, dtype=torch.float32),
                         torch.tensor(y_train, dtype=torch.float32).unsqueeze(1))
train_dl = DataLoader(train_ds, batch_size=64, shuffle=True, drop_last=True)
val_dl   = DataLoader(val_ds, batch_size=256, shuffle=False)
```

- **`shuffle=True` for train, `False` for validation.** Shuffling validation changes
  nothing except your ability to compare runs.
- **`drop_last=True`** avoids a final batch of size 1, which breaks `BatchNorm1d`
  (variance of one sample is undefined). A real and confusing error.
- `num_workers > 0` parallelises loading; on Windows it needs the
  `if __name__ == '__main__'` guard.

For a custom dataset, implement `__len__` and `__getitem__`. That is the whole interface.

## 5. The training loop

```python
model = DropoutRiskNet(n_features).to(device)
criterion = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([10.0]))  # imbalance
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

for epoch in range(epochs):
    model.train()                                   # dropout ON, batchnorm uses batch stats
    for xb, yb in train_dl:
        xb, yb = xb.to(device), yb.to(device)
        optimizer.zero_grad()
        loss = criterion(model(xb), yb)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()

    model.eval()                                    # dropout OFF, batchnorm uses running stats
    val_loss = 0.0
    with torch.no_grad():
        for xb, yb in val_dl:
            val_loss += criterion(model(xb.to(device)), yb.to(device)).item() * len(xb)
    val_loss /= len(val_ds)
    scheduler.step()
```

**`model.train()` and `model.eval()` are the single most common PyTorch bug.** Forget
`eval()` and dropout stays active during validation, so your validation loss is noisy and
too high; batch norm uses batch statistics, so results depend on batch composition. The
symptom is validation numbers that will not reproduce.

`pos_weight` handles class imbalance the same way `class_weight` does in sklearn — one
argument, no resampling (`02-data-wrangling/05-IMBALANCED_DATA.md §3`).

## 6. Saving and loading

```python
torch.save({'model': model.state_dict(),
            'optimizer': optimizer.state_dict(),
            'epoch': epoch,
            'features': feature_names,
            'torch_version': torch.__version__}, 'ckpt.pt')

model.load_state_dict(torch.load('ckpt.pt', weights_only=True)['model'])
model.eval()                                        # ALWAYS after loading for inference
```

**Save `state_dict()`, not the model object.** Pickling the whole model ties the file to
your exact class definition and file layout, and it breaks the moment you refactor.

`weights_only=True` is a security control: `torch.load` on an untrusted file can execute
arbitrary code. Treat a downloaded checkpoint like downloaded code, because it is.

## 7. Debugging

| Symptom | Cause |
|---|---|
| Loss is NaN | LR too high; `log(0)`; exploding gradients — clip them |
| Loss flat from step 0 | `zero_grad()` missing, LR zero, or a `detach()` cutting the graph |
| Validation << training loss | Dropout still active — you forgot `eval()` |
| CUDA out of memory | Batch too large; accumulating loss tensors instead of `.item()` |
| "Expected all tensors on same device" | Some tensor still on CPU |
| Results change between runs | Seeds unset |

**The debugging move that works: overfit a single batch.**

```python
xb, yb = next(iter(train_dl))
for _ in range(500):
    optimizer.zero_grad()
    loss = criterion(model(xb), yb)
    loss.backward(); optimizer.step()
# loss should reach ~0
```

If a model cannot memorise eight samples, the bug is in your code — not your data, not
your architecture, not your learning rate. This test takes thirty seconds and isolates the
problem faster than anything else. Do it first, always.

## 8. Reproducibility

```python
torch.manual_seed(42)
np.random.seed(42)
random.seed(42)
torch.backends.cudnn.deterministic = True     # slower, exactly reproducible
```

Full determinism on GPU costs performance and is not always achievable. Seed anyway, and
**report results across several seeds** — a difference that vanishes with a new seed was
never real (`03-classical-ml/03-MODEL_EVALUATION.md §7`).

---

## Exercise 3

1. Reimplement your numpy XOR network in PyTorch. Confirm both reach the same loss.
2. Compare your hand-derived gradients against `autograd` on identical weights. They
   should agree to ~1e-6.
3. Build the tabular network above on your dropout data. **Compare it honestly against
   your LightGBM baseline from Phase 4.** Report both, with three seeds each.
4. Overfit a single batch to zero loss. Then break something deliberately (remove
   `zero_grad()`) and show the test failing.
5. Train once forgetting `model.eval()` during validation. Plot both curves. Describe the
   symptom precisely.
6. Trigger a NaN loss with a high learning rate. Fix it with gradient clipping.
7. Save a checkpoint, load it in a fresh process, and predict on one row. Confirm the
   prediction is identical.
8. Run the same training three times with different seeds. Report mean and spread. **Is
   your improvement over LightGBM larger than that spread?**

Exercise 8 is the one that matters. Most reported deep-learning wins on tabular data do
not survive it.
