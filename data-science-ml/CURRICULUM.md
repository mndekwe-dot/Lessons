# Data Science → ML: The 37-Week Curriculum

**Starts:** after Checkpoint 12 of `engineering-curriculum/CURRICULUM.md`
**Target role:** ML Engineer — someone who can build a model *and* ship it
**Commitment:** 8–10 hours a week. Below six, stretch it rather than pretend.

---

## Table of Contents

1. [The honest shape of this](#the-honest-shape-of-this)
2. [The rules](#the-rules)
3. [Phase 0 — Baseline (before Week 1)](#phase-0--baseline-before-week-1)
4. [Phase 1 — Python Foundations (Weeks 1–4)](#phase-1--python-foundations-weeks-14)
5. [Phase 2 — Mathematics (Weeks 5–9)](#phase-2--mathematics-weeks-59)
6. [Phase 3 — Data Wrangling (Weeks 10–13)](#phase-3--data-wrangling-weeks-1013)
7. [Phase 4 — Classical ML (Weeks 14–19)](#phase-4--classical-ml-weeks-1419)
8. [Phase 5 — Deep Learning (Weeks 20–25)](#phase-5--deep-learning-weeks-2025)
9. [Phase 6 — NLP and LLMs (Weeks 26–29)](#phase-6--nlp-and-llms-weeks-2629)
10. [Phase 7 — MLOps (Weeks 30–34)](#phase-7--mlops-weeks-3034)
11. [Phase 8 — Enterprise and Governance (Weeks 35–37)](#phase-8--enterprise-and-governance-weeks-3537)
12. [Capstone](#capstone)
13. [What passing means](#what-passing-means)
14. [What it does not mean](#what-it-does-not-mean)

---

## The honest shape of this

37 weeks part-time. Roughly nine months. That is the real number for going from
"has a data science certificate" to "can build and operate an ML system somebody
depends on."

Anyone offering that in eight weeks is selling the feeling of progress. You have
bought that before — 63 guides' worth.

**Phases are gated.** You do not start `03-classical-ml/` because trees sound more
interesting than statistics. Phase 1 maths is the one people skip and it is the one
that decides whether you can tell a real result from noise for the rest of your career.

---

## The rules

**1. Every phase ends with a build, done with the material closed.** Official docs
(numpy, pandas, scikit-learn, PyTorch) are allowed. Tutorials, your own past
notebooks, and AI are not.

**2. Baseline before model, always.** Every project starts by writing down what a
trivial answer scores — majority class, predict-the-mean, or a three-line rule. A
model that does not beat that baseline is not a result, and reporting it as one is
the single most common junior mistake.

**3. Checkpoints are pass or repeat.** Same as the engineering curriculum. You chose
strict; that has not changed.

**4. You must be able to explain why it works.** Any model you cannot explain the
mechanism of is an automatic fail, however good the score.

**5. No real student or patient data until Phase 7.** Section `07-enterprise/02` is
the ethics gate, and Imboni holds children's records while Screening holds mental
health responses. Synthetic and public datasets until then. This is not a formality —
it is a legal question under Rwanda's Law No. 058/2021 before it is a technical one.

---

## Phase 0 — Baseline (before Week 1)

**The cold test, 2 hours, timed, no AI, no tutorial:**

> Take a raw public dataset you have never seen (Kaggle's Titanic is fine, or any
> CSV from data.gov). Load it. Clean it. Frame one question. Establish a baseline.
> Build something that beats the baseline. Then write one honest page on why your
> result is or is not trustworthy.

Stop at 2 hours. Do not finish it later. The unfinished state is the measurement.

**Checkpoint 0:** I tell you where your certificate actually left you — which of
pandas, statistics, evaluation, and framing are real, and which are recognition-only.

---

## Phase 1 — Python Foundations (Weeks 1–4)

**Read:** `00-python-foundations/` 01 → 05

| Week | Focus |
|---|---|
| 1 | Python for data: comprehensions, generators, typing, project layout |
| 2 | numpy: arrays, broadcasting, vectorisation |
| 3 | pandas: indexing, groupby, merge, reshape, time series |
| 4 | Plotting + SQL for data |

**Build (material closed):** Take Imboni's *schema* (not its data — generate synthetic
rows) and answer five questions a headteacher would ask, with code and five charts.

**Checkpoint 1 — PASS requires:**
- [ ] A groupby → merge → reshape chain written cold
- [ ] **Zero** `iterrows()` or row loops anywhere
- [ ] Missing data handled deliberately, with the reason written down
- [ ] Five charts with real titles, axis labels and units
- [ ] You can explain broadcasting, and name a case where it silently does the wrong thing
- [ ] One SQL query with a join and a window function, written cold

---

## Phase 2 — Mathematics (Weeks 5–9)

**Read:** `01-mathematics/` 01 → 04, then 06

The phase people skip. Do not.

| Weeks | Focus |
|---|---|
| 5–6 | Linear algebra: vectors, matrices, dot product as similarity, eigen for PCA |
| 7–8 | Statistics and probability: distributions, sampling, tests, Bayes, base rates |
| 9 | Calculus for ML: derivatives, gradients, the chain rule |
| 9 | **Experiment design**: power, sample size, guardrail metrics, why peeking invalidates a test |

**Build (two parts):**

*Part A:* Linear regression **and** logistic regression from scratch in numpy, with
gradient descent. No scikit-learn. Plot the loss curve. Show it converging.

*Part B:* A full experiment design for one real change to Imboni or Screening —
hypothesis, primary and guardrail metrics, randomisation unit, calculated sample size
and duration. Then state honestly whether your actual traffic can detect the effect
you care about.

**Checkpoint 2 — PASS requires:**
- [ ] Both models implemented from scratch, converging on real data
- [ ] The gradient of mean squared error derived on paper
- [ ] Given an experiment description, you state the null hypothesis and what would falsify it
- [ ] You can explain with numbers why 98% accuracy can be a worthless model
- [ ] You predict the output shape of five chained matrix operations before running them
- [ ] You can explain what a p-value is **not**
- [ ] A sample-size calculation you did yourself, with the MDE stated
- [ ] The peeking simulation from `01-mathematics/06` Exercise 3, with your measured
      false-positive rate

**Automatic fail:** an experiment design with more than one primary metric.

`01-mathematics/07-CAUSAL_INFERENCE.md` is *extra* and not gated — read it when you
hit a question you cannot randomise, which for education data will be soon.

---

## Phase 3 — Data Wrangling (Weeks 10–13)

**Read:** `02-data-wrangling/` 01 → 04

| Week | Focus |
|---|---|
| 10 | Cleaning: missingness mechanisms, outliers, types, duplicates |
| 11 | EDA that answers questions rather than producing 40 plots |
| 12 | Feature engineering — where tabular problems are actually won |
| 13 | Pipelines and reproducibility |

**Build:** One messy real dataset, end to end, as a **scikit-learn `Pipeline`** — no
manual preprocessing outside it. Then prove there is no leakage.

**Checkpoint 3 — PASS requires:**
- [ ] Everything inside a `Pipeline`/`ColumnTransformer`, fitted only on train
- [ ] A written leakage argument examining every feature
- [ ] Missingness diagnosed as MCAR/MAR/MNAR, with the handling justified
- [ ] Three engineered features that measurably beat the raw ones
- [ ] The whole thing reruns from a clean environment and gives identical numbers

---

## Phase 4 — Classical ML (Weeks 14–19)

**Read:** `03-classical-ml/` 01 → 05, then 07

**Most production ML is this phase.** Gradient-boosted trees win most real business
problems on tabular data — which is what your data is. Do not skip ahead.

| Weeks | Focus |
|---|---|
| 14 | Linear and logistic regression, regularisation |
| 15 | Trees, random forests |
| 16 | Gradient boosting: XGBoost / LightGBM — the industry workhorse |
| 17 | **Evaluation**: CV, metrics, calibration, thresholds |
| 18 | Leakage and imbalanced data |
| 19 | Unsupervised: k-means, hierarchical, PCA |
| 19 | **Time series**: chronological splits, decomposition, lag features, baselines |

Time series is core rather than extra because **almost every dataset you own is
temporal**. It is also the fastest way to produce a result that looks excellent and
means nothing: `train_test_split(shuffle=True)` on Imboni attendance will report a
score you cannot reproduce in production.

**Build:** A full project on a dataset you have never seen. Baseline first. Beat it.
Then deliberately introduce a leak and show your validation catches it.

**Checkpoint 4 — PASS requires:**
- [ ] Baseline established **first**, and beaten
- [ ] Metric choice justified by the real cost of a false positive vs a false negative
- [ ] A deliberately introduced leak, caught by your own validation — demonstrate both runs
- [ ] Calibration checked: does a 0.8 prediction happen 80% of the time?
- [ ] Per-subgroup performance reported, not just the aggregate
- [ ] You can explain **why** your model works, not only that it does

---

## Phase 5 — Deep Learning (Weeks 20–25)

**Read:** `04-deep-learning/` 01 → 04

| Weeks | Focus |
|---|---|
| 20–21 | Neural nets and backprop **from scratch in numpy** |
| 22 | PyTorch: tensors, autograd, training loops |
| 23 | CNNs and transfer learning |
| 24 | Sequences: RNNs briefly, then attention |
| 25 | Transformers |

**Build:** Backprop in pure numpy, working. Then fine-tune a pretrained model on your
own data and compare it honestly against your Phase 4 gradient-boosting baseline.

**Checkpoint 5 — PASS requires:**
- [ ] Backprop from scratch, training successfully
- [ ] A fine-tuned model beating the classical baseline — **or** an honest write-up of why it did not
- [ ] You can explain vanishing gradients and what residual connections do about them
- [ ] You can explain attention in plain language without using the word "query"
- [ ] **A written case for a problem where you chose *not* to use deep learning**

That last one is worth as much as the rest of the phase.

---

## Phase 6 — NLP and LLMs (Weeks 26–29)

**Read:** `05-nlp-llms/` 01 → 04

The most immediately employable section, and the one your web background transfers
into directly.

| Week | Focus |
|---|---|
| 26 | NLP fundamentals: tokenisation, TF-IDF, classical text classification |
| 27 | Embeddings and vector search — the dot product from Phase 2, doing real work |
| 28 | RAG: chunking, retrieval quality, why most RAG fails at retrieval not generation |
| 29 | LLM applications, prompt engineering as engineering, and **evals** |

**Build:** A RAG system over real documents with **measured** retrieval quality, plus a
natural-language query interface over Imboni's schema.

**Checkpoint 6 — PASS requires:**
- [ ] Retrieval quality measured, not assumed
- [ ] An eval set of ≥50 cases, and a measured before/after on one prompt change
- [ ] Cost per query calculated and stated
- [ ] A prompt injection attempt against your own system, and the defence you added
- [ ] The NL interface never emits raw SQL — it selects from pre-approved parameterised
      queries, tenant-scoped, permissions applied after generation

---

## Phase 7 — MLOps (Weeks 30–34)

**Read:** `06-mlops/` 01 → 05

**Your unfair advantage.** Most people entering ML cannot do this phase at all; you
will have already deployed Django apps with Docker and CI.

| Week | Focus |
|---|---|
| 30 | Experiment tracking and reproducibility |
| 31 | Serving: batch vs real-time, latency budgets, model-as-API |
| 32 | Monitoring, data drift, concept drift, training/serving skew |
| 33 | Pipelines and orchestration, retraining triggers |
| 34 | Enterprise patterns: feature stores, registries, shadow deploys, A/B |

**Build:** Deploy a model behind a real API, Dockerised, with CI, versioned, with drift
monitoring and a rollback plan.

**Checkpoint 7 — PASS requires:**
- [ ] Model version and training-data version recorded with **every** prediction
- [ ] Drift monitoring on ≥1 input feature with an alert threshold
- [ ] A documented, tested rollback
- [ ] A written answer to: *"it has been live six months — how would you know if it had
      quietly stopped working?"*

An ML system that is broken does not throw a 500. It returns confident nonsense.

---

## Phase 8 — Enterprise and Governance (Weeks 35–37)

**Read:** `07-enterprise/` 01 → 04

| Week | Focus |
|---|---|
| 35 | Data governance, lineage, retention, access control |
| 36 | Ethics, bias auditing, fairness metrics, contestability |
| 37 | Privacy and security (PII, anonymisation, adversarial inputs); cost at scale |

**Build:** A **model card** for one of your own models: data, limitations, per-subgroup
performance, intended and out-of-scope use, who is accountable, how a person contests
a decision.

**Checkpoint 8 — PASS requires:**
- [ ] A complete model card a non-technical headteacher could read
- [ ] Bias audit across at least two subgroups, with the numbers
- [ ] A written data-protection basis for the training data
- [ ] Cost per 1,000 predictions, and what you would cut first

---

## Capstone

> **One ML system a real school would actually use.** Deployed, monitored, versioned,
> with a model card. If it touches student data, the Phase 8 governance work is part
> of the deliverable, not an appendix.

`08-projects/` holds the project ladder — start with the ones that put nobody at risk
while you are still learning what you are doing.

---

## What passing means

You can build, ship, and operate ML systems that survive contact with real users. With
the engineering curriculum behind it, that is an ML Engineer — a genuinely employable
profile, and a rarer one than either half alone.

## What it does not mean

A research career. A shortcut past the 12 weeks. Or permission to skip Phase 2 because
maths is uncomfortable.
