# 02 — Portfolio

What a project must show, and the five that everyone submits and nobody reads.

---

## Table of Contents

1. [The five nobody reads](#1-the-five-nobody-reads)
2. [What a reviewer is actually checking](#2-what-a-reviewer-is-actually-checking)
3. [Your unfair advantage](#3-your-unfair-advantage)
4. [Structure](#4-structure)
5. [The README](#5-the-readme)
6. [The interview conversation](#6-the-interview-conversation)
7. [What to show for ML Engineer specifically](#7-what-to-show-for-ml-engineer-specifically)
8. [Exercise 2](#exercise-2)

---

## 1. The five nobody reads

Titanic. Iris. MNIST. House prices. Movie recommendations from MovieLens.

Not because they are bad problems — they are fine for learning. But as portfolio pieces
they signal only that you completed a tutorial, because the reviewer has seen a hundred
identical notebooks and knows the dataset is clean, the answer known, and the hard parts
absent.

**What they cannot demonstrate:** framing an ambiguous question, cleaning genuinely messy
data, choosing a metric from a real cost, deploying, or noticing when something is wrong.
Which is the entire job.

## 2. What a reviewer is actually checking

Not your model choice. In order:

1. **Did you establish a baseline?** Its absence is the fastest disqualifier there is.
2. **Do you understand your data?** Missingness, outliers, grain, known issues.
3. **Is your evaluation honest?** Right split, per-subgroup, leakage argued.
4. **Did you deploy it?** Or is it a notebook?
5. **Do you know what is wrong with it?** The limitations section is read closely.
6. **Can you explain the decisions?** Why this metric, why this threshold.

**Point 5 is the differentiator.** Everyone claims their model works. Very few can say
precisely where it fails and why, and that is what distinguishes someone who has shipped.

## 3. Your unfair advantage

Most people applying alongside you have public datasets and notebooks. **You have two real
production systems, real users, and real messy data.**

Use it. A project on your own school data — properly anonymised, properly governed — is
worth five Kaggle notebooks, because it demonstrates the whole chain: a real problem, data
you had to clean yourself, a decision someone would act on, and a deployment that runs.

**And it demonstrates the governance work**, which almost nobody at entry level can show.
A model card with a per-subgroup table and a written fairness choice is a genuinely rare
artefact.

## 4. Structure

```
project/
├── README.md              ← the most important file
├── data/                  ← gitignored; document how to obtain or regenerate
├── notebooks/
│   └── 01-exploration.ipynb    ← ONE, clean, tells a story
├── src/
│   ├── data.py  features.py  train.py  evaluate.py  serve.py
├── tests/
├── models/
│   └── model_card.md
├── Dockerfile
├── requirements.txt       ← pinned
└── .github/workflows/ci.yml
```

**`src/` with tests is what separates you from a notebook portfolio.** Most data science
projects have no `src/` at all — the fact that you came from web engineering is exactly why
you can produce this, and it reads immediately.

**One clean notebook, not eleven.** `Untitled7.ipynb` in a public repo says more than you
want it to.

## 5. The README

Reviewers spend two minutes. Give them, in this order:

```markdown
# Attendance Anomaly Detection

Flags implausible attendance records for review before they reach reports.
Running in production at [scale]; catches ~40 bad records a term that
previously reached the headteacher's dashboard.

## The problem
Attendance is entered by hand across seven portals. Errors — 100%+ attendance,
duplicate entries, dates in the future — silently corrupt every downstream
average, including the reports parents see.

## Approach
Rule-based checks for the impossible, Isolation Forest for the merely unusual.
**Baseline:** the four hand-written rules alone catch 61% of records later
confirmed as errors. The model adds 18 points of recall at the same precision.

## Results
| | Precision | Recall |
|---|---|---|
| Rules only (baseline) | 0.88 | 0.61 |
| Rules + model | 0.86 | 0.79 |

Evaluated on 1,200 hand-labelled records. Flags ~15 records a week per school,
of which ~13 are genuine errors.

## Limitations
- Trained on one school's entry habits; may not transfer.
- Cannot detect a plausible-but-wrong value (85% recorded as 58%).
- Precision drops for classes under 15 students — too few comparisons.

## Run it
docker compose up
```

**Note what leads:** the problem and the outcome, not the technology. **Note the baseline
in the Approach section** — it is what makes the results meaningful. **Note that the
limitations are specific**, which is what makes the rest credible.

## 6. The interview conversation

Your project will be interrogated. Have answers ready:

- **"Why this metric?"** → from the cost of each error, in the school's terms.
- **"Why not deep learning?"** → the paragraph you wrote in
  `04-deep-learning/06-WHEN_NOT_TO_USE_DL.md §7`, with your real numbers.
- **"How do you know it isn't leaking?"** → the prediction-time argument, per feature.
- **"How would you know if it broke in production?"** → your monitoring, specifically.
- **"What would you do differently?"** → have a real answer. "Nothing" is a bad sign.

**The strongest thing you can say is what is wrong with your own work.** It reads as
experience, because it is.

## 7. What to show for ML Engineer specifically

Your target role (`ML_TRACK.md` Part 0) is engineering plus ML. So lead with the half most
candidates lack:

- It is **deployed** and reachable
- There is **CI** that runs tests
- There is **monitoring** and you can show a drift report
- There is a **rollback** you have tested
- There is a **model card**
- The code is **structured and tested**, not a notebook

**One project with all six beats four projects with none.** That is the whole strategy: not
more models, but one that is genuinely operated.

---

## Exercise 2

1. Pick your best project. Rewrite its README to the §5 structure. Lead with the problem
   and the outcome.
2. Add the baseline to the results table. **Did the model still look impressive?**
3. Write the limitations section. At least three, specific.
4. Have someone non-technical read the README. Can they say what it does and how well?
5. Prepare answers to all five §6 questions, out loud, in under 90 seconds each.
6. Audit against the §7 list. **How many of the six do you have?** Build the missing ones.
