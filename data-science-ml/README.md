# Data Science → Machine Learning

**A complete Python course, beginner to enterprise-grade.** Built 7 September 2026.

---

## Table of Contents

1. [How this relates to the other two things you have](#how-this-relates-to-the-other-two-things-you-have)
2. [What "enterprise-grade" means here, and what it does not](#what-enterprise-grade-means-here-and-what-it-does-not)
3. [The folders](#the-folders)
4. [Start here](#start-here)
5. [The rule that makes or breaks this](#the-rule-that-makes-or-breaks-this)

---

## How this relates to the other two things you have

You now have three separate bodies of work. They are not duplicates and they do not
compete — but you must know which is which or you will study the wrong one.

| | What it is | When |
|---|---|---|
| `engineering-curriculum/` | 12 weeks to build production web software unaided | **Now** |
| `engineering-curriculum/08-machine-learning/01-ML_TRACK.md` | The **plan**: which ML career, what order, ~29 weeks | Read Part 0 now |
| **`data-science-ml/`** ← you are here | The **course**: the actual teaching material that plan points at | After Week 12 |

`ML_TRACK.md` is the map. This directory is the territory. The map tells you that Phase 3
is classical ML and why it matters more than deep learning for your data; `03-classical-ml/`
is where you actually learn it.

**Nothing here starts before Checkpoint 12** of the engineering curriculum. That ordering
is not arbitrary — it is the entire strategy. A data science certificate plus production
engineering is a rare and employable combination. A data science certificate plus more
data science is not.

---

## What "enterprise-grade" means here, and what it does not

It does not mean harder maths or bigger models. It means the parts that separate a
notebook from a system somebody depends on:

- Data that arrives dirty, late, or not at all
- Models that were right in March and quietly wrong by September
- Reproducibility — same data plus same code equals the same model, a year later
- Cost per prediction, and latency budgets that are someone's contractual obligation
- Governance: who may see this data, who is accountable when the model is wrong
- The ability to explain a decision to a regulator, a headteacher, or a parent

Most courses stop at "model achieves 0.94 AUC." Sections **06-mlops** and
**07-enterprise** are the half that decides whether that number ever means anything
to anyone. They are also the half your web engineering background makes you unusually
good at.

---

## The folders

| Folder | Covers | Weeks |
|---|---|---|
| `00-python-foundations/` | Python for data, numpy, pandas, plotting, SQL | 1–4 |
| `01-mathematics/` | Linear algebra, statistics, probability, calculus — only what is load-bearing | 5–9 |
| `02-data-wrangling/` | Cleaning, EDA, feature engineering, pipelines | 10–13 |
| `03-classical-ml/` | Regression, trees, ensembles, evaluation, leakage, unsupervised | 14–19 |
| `04-deep-learning/` | Neural nets from scratch, PyTorch, vision, sequences, transformers | 20–25 |
| `05-nlp-llms/` | NLP, embeddings, RAG, LLM applications, evals | 26–29 |
| `06-mlops/` | Tracking, serving, monitoring, drift, orchestration | 30–34 |
| `07-enterprise/` | Governance, ethics, privacy, security, cost at scale | 35–37 |
| `08-projects/` | Portfolio work, capstone, and your own data | throughout |

Same conventions as `engineering-curriculum/`: **numbered files are the order**, each
folder has a `README.md`, and every file is marked **core** (gated by a checkpoint) or
*extra* (real material, not gated).

---

## Start here

1. `CURRICULUM.md` — the week-by-week plan, build tasks and pass criteria
2. `PROGRESS.md` — where you record what you actually did
3. `00-python-foundations/README.md` — the first folder

## The rule that makes or breaks this

Every section ends with something you build with the material closed. Reading a notebook
someone else wrote produces the feeling of understanding and none of the substance —
that is the exact failure mode that put 63 unread guides on your disk. The checkpoints
exist to catch it.

**If you find yourself reading three files ahead instead of doing the current exercise,
stop. That is the pattern, and it is happening again.**
