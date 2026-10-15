# 06 — When Not to Use Deep Learning

*Extra. The shortest file in this course and the most senior.*

You have just spent six weeks on neural networks. This file exists so that you do not
now reach for them by reflex.

---

## Table of Contents

1. [The default is wrong](#1-the-default-is-wrong)
2. [Use trees when](#2-use-trees-when)
3. [Use neural networks when](#3-use-neural-networks-when)
4. [The costs nobody puts in the comparison](#4-the-costs-nobody-puts-in-the-comparison)
5. [When to use neither](#5-when-to-use-neither)
6. [The decision, in order](#6-the-decision-in-order)
7. [What to say when asked](#7-what-to-say-when-asked)
8. [Exercise 6](#exercise-6)

---

## 1. The default is wrong

After learning deep learning, everything looks like a deep learning problem. It is not.

**For the data you actually have — attendance, grades, screening responses, tabular rows
in a Postgres database — gradient boosting is very likely the better model.** Not
marginally. Reliably.

There are two large, repeated findings in the literature comparing tree ensembles against
neural networks on tabular data. Trees usually win on medium-sized tables, and when
neural networks do win, the margin is small and the tuning cost is large.

## 2. Use trees when

- **Tabular data under ~1 million rows.** Which is all of your data.
- **Features are heterogeneous** — mixed types, different scales, categoricals.
- **You need it working this week.** LightGBM with defaults beats a badly-tuned network.
- **You must explain a decision.** SHAP on trees is exact and fast
  (`03-classical-ml/06-INTERPRETABILITY.md`).
- **Training must be cheap and repeatable.** Minutes on a laptop, not hours on a GPU.
- **The dataset is small.** Under a few thousand rows, a network has nothing to learn from.

## 3. Use neural networks when

- **Data has spatial structure** — images, video. Convolutions exploit it; trees cannot.
- **Data has sequential/semantic structure** — text, audio, time series with long-range
  dependencies.
- **The input is raw and high-dimensional** — pixels, waveforms, tokens.
- **You have a lot of data** — hundreds of thousands of examples upward.
- **A pretrained model exists for your domain.** This is the strongest single reason, and
  it is why NLP and vision are neural: you are not training, you are fine-tuning someone
  else's 14-million-image or trillion-token investment.
- **You need embeddings** for similarity or retrieval (Phase 6).

## 4. The costs nobody puts in the comparison

When you compare "0.86 vs 0.85 AUC" you are comparing one column of a much wider table:

| | LightGBM | Neural network |
|---|---|---|
| Training time | Minutes, CPU | Hours, GPU |
| Tuning burden | Small; good defaults | Large; defaults rarely work |
| Inference latency | Sub-millisecond | Milliseconds, or GPU-bound |
| Serving cost | Cheap | GPU or an expensive API |
| Explainability | Exact SHAP | Approximate, contested |
| Reproducibility | High | Lower — nondeterminism on GPU |
| Debugging | Feature importance, tree paths | Loss curves and hope |
| People who can maintain it | Many | Few |
| Dependency footprint | One library | CUDA, drivers, versions |

**That last row matters more than any of the metrics.** If you build a neural pipeline for
Imboni and step away, who maintains it? For a solo developer supporting schools, a model
you can retrain in two minutes on a laptop is worth more than one point of AUC.

This is the same argument as complexity being your most expensive currency, from Chapter 1
of your system design guide. It applies identically here.

## 5. When to use neither

Sometimes the answer is not machine learning at all:

- **A rule works.** "Flag any student below 70% attendance" may capture most of the value,
  be perfectly explainable, need no training, and never drift. **Try the rule first and
  measure it.** It is your real baseline.
- **You have fewer than a few hundred labelled examples.** Collect more data; no algorithm
  rescues you.
- **The relationship is known.** If physics or policy gives you the formula, use it.
- **You cannot get the data at prediction time.** No model fixes that
  (`03-classical-ml/04-LEAKAGE.md`).
- **The decision should not be automated.** Some decisions about children should be made
  by a person who is accountable for them, regardless of how good the model is
  (`07-enterprise/02`).

That last one is not a technical limitation. It is a judgment, and it is yours to make
and defend.

## 6. The decision, in order

1. Can a **rule** solve it? Measure the rule. → Often stop here.
2. Is it **tabular**? → Gradient boosting. Stop unless it clearly underperforms.
3. Is it **images, audio, or text**? → Pretrained network, fine-tuned.
4. Do you have **millions of rows** and a plateaued tree model? → Then try a network.
5. Does it need **embeddings or generation**? → Phase 6.

**Steps 1 and 2 cover the overwhelming majority of real business problems, including
every one in Imboni.**

## 7. What to say when asked

You will be asked "why didn't you use deep learning?" — in an interview, or by someone
who has read about AI. The answer that lands:

> "I tried gradient boosting first because the data is tabular with 40,000 rows, and on
> that shape trees are the stronger baseline. It reached 0.86 AUC in four minutes on a
> laptop. I then tried a neural network; it reached 0.85 across three seeds, took an hour
> on a GPU, and I could not explain individual predictions as reliably. The tree model
> also retrains in two minutes when the data shifts, which matters because I am the only
> person maintaining it."

**Numbers, a comparison actually run, and the operational cost.** That answer marks you as
someone who has shipped something. "I used a neural network because it's state of the art"
marks you as someone who has not.

---

## Exercise 6

1. On your dropout dataset, build all four: a rule, logistic regression, LightGBM, and a
   neural network. Report for each — test score, training time, inference latency, and
   lines of code.
2. **How much did the rule get you?** Write down the fraction of the best model's
   performance that a single threshold achieved.
3. Run the neural network across three seeds. Is its difference from LightGBM larger than
   the seed spread?
4. Write the §7 paragraph for your own project, with your real numbers.
5. Find one problem in Imboni or Screening where a neural network genuinely *is* the right
   tool. Justify it against all five steps in §6.
6. Find one where the honest answer is "this should not be automated at all." Write why.

Exercise 6 is the one that will matter most in your career, and it is the one no course
usually asks for.
