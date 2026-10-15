# 05 — Sequences and Transformers

**Weeks 24–25.** The architecture behind every LLM you will use in Phase 6.

---

## Table of Contents

1. [Why sequences are different](#1-why-sequences-are-different)
2. [RNNs — the old answer, briefly](#2-rnns--the-old-answer-briefly)
3. [Attention](#3-attention)
4. [The transformer block](#4-the-transformer-block)
5. [Three architectures](#5-three-architectures)
6. [Using them — which is what you will actually do](#6-using-them--which-is-what-you-will-actually-do)
7. [Honest limits](#7-honest-limits)
8. [Exercise 5](#exercise-5)

---

## 1. Why sequences are different

Order carries meaning. "The student passed the exam" and "the exam passed the student"
share every word. A bag-of-words model cannot tell them apart, and a fixed-size dense
layer cannot handle variable length.

## 2. RNNs — the old answer, briefly

Process one element at a time, carrying a hidden state:

```
h_t = tanh(W_h · h_{t-1} + W_x · x_t + b)
```

The hidden state is a summary of everything seen so far.

**Two fatal problems:**

**Vanishing gradients over time.** Backpropagating through 100 steps multiplies 100
derivatives (`01-mathematics/04-CALCULUS_FOR_ML.md §7`). The signal from step 1 reaching
step 100 has effectively vanished, so long-range dependencies cannot be learned.

**Sequential by construction.** Step `t` needs step `t−1`. You cannot parallelise, so you
cannot use a GPU properly, so you cannot train on internet-scale data.

**LSTM and GRU** added gates that let information flow through mostly unmodified — the
same trick as ResNet's `+ x`, applied along time. They fixed vanishing gradients well
enough to be useful for a decade. They did not fix the sequential bottleneck.

That second problem is what killed them, and it is why transformers won.

## 3. Attention

**The core idea: every position looks at every other position directly.** No walking
through intermediate steps, so no vanishing, and every position can be computed in
parallel.

Each token produces three vectors:

- **Query** — what am I looking for?
- **Key** — what do I contain?
- **Value** — what do I contribute?

```
Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V
```

Read it piece by piece:

1. `QKᵀ` — every query dotted with every key. **The dot product as similarity**, from
   `01-mathematics/01-LINEAR_ALGEBRA.md §2`. Result is (seq, seq): how relevant is each
   position to each other position.
2. `/ √d_k` — scaling. Without it, dot products in high dimensions grow large, softmax
   saturates, gradients vanish. **This is the "scaled" in scaled dot-product attention**,
   and it is not decoration.
3. `softmax` — turn scores into weights summing to 1.
4. `· V` — a weighted average of the value vectors.

That is the whole mechanism. If you can explain those four lines without the word
"query", you have met the Checkpoint 5 requirement.

```python
def attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    return torch.softmax(scores, dim=-1) @ V
```

**Multi-head attention** runs several attention operations in parallel with different
learned projections, then concatenates. Different heads specialise — some track syntax,
some track coreference. It is cheap: the dimension is split among heads rather than
multiplied.

**The cost:** attention is O(n²) in sequence length. Doubling the context quadruples the
compute and memory. This single fact drives most of the engineering in modern LLMs —
flash attention, sliding windows, and the reason long context is expensive.

## 4. The transformer block

```
x = x + MultiHeadAttention(LayerNorm(x))     # residual
x = x + FeedForward(LayerNorm(x))            # residual
```

Two sublayers, each wrapped in a residual connection and a layer norm. **Those `+ x`
terms are ResNet's contribution again** — the reason a 96-layer transformer trains at all.

Stack this block N times and you have GPT.

**Positional encoding** is required because attention is permutation-invariant — it has
no inherent notion of order. Position information is added to the embeddings, originally
with sinusoids, now usually with rotary embeddings (RoPE).

## 5. Three architectures

| Type | Attention | Good at | Examples |
|---|---|---|---|
| **Encoder-only** | Bidirectional | Understanding, classification | BERT |
| **Decoder-only** | Causal (masked) | Generation | GPT, Llama, Claude |
| Encoder–decoder | Both | Translation, summarisation | T5, BART |

**Causal masking** is what makes generation possible: position `t` may only attend to
positions ≤ `t`. Without it, the model would see the answer while predicting it — which
is leakage (`03-classical-ml/04-LEAKAGE.md`) in architectural form.

**Pretraining objectives:**

- **Masked language modelling** (BERT) — hide 15% of tokens, predict them. Bidirectional.
- **Next-token prediction** (GPT) — predict the next token. Causal, and it turns out to
  scale extraordinarily well.

## 6. Using them — which is what you will actually do

You will not pretrain a transformer. Fine-tune or prompt.

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = 'distilbert-base-multilingual-cased'      # handles EN/FR/RW-ish
tok = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

enc = tok(texts, padding=True, truncation=True, max_length=256, return_tensors='pt')
out = model(**enc, labels=labels)
out.loss.backward()
```

**Decisions that actually matter:**

- **`max_length`** — truncation silently discards the end of long inputs. Check your
  length distribution before choosing it.
- **Multilingual models for Kinyarwanda.** Kinyarwanda is low-resource; general
  multilingual models handle it poorly. Check tokenisation — if a common Kinyarwanda word
  fragments into eight subword tokens, the model has no useful representation of it, and
  no amount of fine-tuning fixes that cheaply.
- **PEFT / LoRA** — fine-tune a small number of adapter parameters instead of all of
  them. Far less memory, nearly the same result. This is how fine-tuning is done in
  practice now.

## 7. Honest limits

- **O(n²) attention** — long documents are expensive; chunk them (Phase 6 RAG).
- **No memory between calls.** A transformer is stateless; "conversation memory" is the
  history being re-sent every time, inside the context window.
- **Confident nonsense.** Trained to produce plausible continuations, not true ones.
  Nothing in the objective rewards truth.
- **Enormous training cost**, so you rent rather than build.
- **Overkill for tabular data.** Transformers for tables exist and mostly do not beat
  gradient boosting.

---

## Exercise 5

1. Implement scaled dot-product attention in numpy. Verify against PyTorch's
   `F.scaled_dot_product_attention`.
2. Remove the `/ √d_k`. Plot the softmax output distribution at `d_k = 512` with and
   without it. **Explain what saturation does to gradients.**
3. Implement causal masking. Prove position 3 cannot see position 5 by inspecting the
   attention weights.
4. Write out attention in plain language, no jargon, in under 80 words. **No use of the
   word "query".** This is the Checkpoint 5 item.
5. Build one full transformer block with residuals and layer norm. Count its parameters.
6. Take a sentence in English, French and Kinyarwanda. Tokenise each with a multilingual
   tokeniser. Compare token counts per word. What does the difference imply for cost and
   for model quality?
7. Fine-tune DistilBERT on a small text classification task. Compare against TF-IDF plus
   logistic regression — **including training time and inference latency**.
8. Train an LSTM and a small transformer on the same sequence task. Compare accuracy and
   wall-clock time per epoch.

Exercise 7 decides more real projects than people expect. TF-IDF plus logistic regression
wins often enough that skipping the comparison is negligence.
