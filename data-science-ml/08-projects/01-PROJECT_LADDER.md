# 01 — The Project Ladder

**Ordered by risk to real people, not by difficulty.**

Start at the bottom while you are still learning what you are doing. The skills at rung 1
and rung 12 are much closer than the consequences of getting them wrong.

---

## Table of Contents

1. [Tier A — Risks nobody (start here)](#tier-a--risks-nobody-start-here)
2. [Tier B — Aggregate only, no individual scoring](#tier-b--aggregate-only-no-individual-scoring)
3. [Tier C — Text and retrieval, low personal exposure](#tier-c--text-and-retrieval-low-personal-exposure)
4. [Tier D — Individual scoring (gated)](#tier-d--individual-scoring-gated)
5. [Not on the ladder — do not build](#not-on-the-ladder--do-not-build)
6. [How to choose](#how-to-choose)
7. [What each project must produce](#what-each-project-must-produce)
8. [Exercise 1](#exercise-1)

---

## Tier A — Risks nobody (start here)

**1. Server load forecasting.** Predict CPU, memory and request volume for your own
infrastructure. *Skills:* time series, feature engineering, deployment. *Data:* your
metrics. *Risk:* none — no personal data at all. Genuinely useful for capacity planning.

**2. Exam-hall demand forecasting.** How many rooms and invigilators a term needs.
*Skills:* regression, aggregation. *Data:* aggregate only. *Risk:* none — an operations
problem, no individual scoring.

**3. OCR for paper attendance sheets.** Photograph a register, extract the marks.
*Skills:* vision, transfer learning, or an existing OCR engine. *Risk:* low — it reads a
document, it does not judge anyone. **Real value for schools with patchy connectivity**,
which makes it a strong portfolio piece.

**4. Data-quality anomaly detection.** Flag impossible or unusual *records* — attendance
above 100%, a grade entered twice, a date in the future. *Skills:* Isolation Forest,
rules. *Risk:* very low — it flags data, not children. **Immediately useful to Imboni.**

## Tier B — Aggregate only, no individual scoring

**5. School-level attendance forecasting.** Predict next term's attendance per school or
per class. *Risk:* low — no individual is scored, so no individual is affected.

**6. Class clustering for resource allocation.** Group *classes* (not students) by
performance pattern. *Skills:* clustering, and the honest validation from
`03-classical-ml/05-UNSUPERVISED.md §5`. *Risk:* low, provided the unit stays the class.

**7. Timetable constraint weights.** Learn from past manual adjustments which constraints
matter most, and feed that into your CSP generator. *Skills:* preference learning.
*Risk:* none. **Directly connects to the auto-generators you already want to build.**

## Tier C — Text and retrieval, low personal exposure

**8. RAG over school policy and handbooks.** Staff and parents ask questions of the
documentation. *Skills:* the whole of `05-nlp-llms/`. *Risk:* low if the corpus is policy
documents rather than student records.

**9. Natural-language query interface.** "Which S3 students missed more than five days?"
*Skills:* tool use, the safe pattern from `05-nlp-llms/04-LLM_APPLICATIONS.md §7`.
*Risk:* **medium** — it touches student data, so tenant scoping and permissions-after-
generation are mandatory, and the tests proving it are part of the deliverable.

**10. Free-text note classification.** Categorise matron or discipline notes by type and
urgency to help triage. *Risk:* medium — real notes about real children. Use synthetic
data to build it; real data only after the Tier D conditions are met.

## Tier D — Individual scoring (gated)

**Nothing here begins before `07-enterprise/02-ETHICS_AND_BIAS.md` is complete and signed
off in `PROGRESS.md`.**

**11. Dropout risk indicator.** The running example throughout this course. *Conditions:*
anonymised or properly-based data, a full bias audit with intersections, a written fairness
choice, per-subgroup reporting, a human in the loop, an appeal route, and a model card.
**Adds support; never removes it.**

**12. Grade-trend anomaly detection.** Flag sudden changes for a teacher to look into.
*Framing matters enormously:* flag the **record** for review, not the **student** as a
problem. The same model, framed the second way, is a different and worse thing.

## Not on the ladder — do not build

- Face recognition or attendance-by-face on children
- Emotion detection from faces
- Individual mental-health diagnosis prediction
- Automated streaming, setting, or placement
- Anything scoring a child's character, potential, or worth
- Anything you could not explain calmly to that child's parent

**These are not "advanced projects for later".** They are declined regardless of skill,
accuracy, or who asks. `07-enterprise/02 §6` is where you get the argument.

---

## How to choose

**Rungs 1, 3 and 4 first.** They teach the full pipeline — data, model, evaluation,
deployment, monitoring — with nobody exposed if you get it wrong. Rung 4 in particular is
something Imboni could use next month.

Then 7 and 8, which connect to work you already want to do.

**Reach Tier D only after Phase 8**, and only with the governance work actually done rather
than intended.

## What each project must produce

Regardless of rung:

1. A **baseline** written down before the model (Rule 2 of the curriculum)
2. The model, in a **pipeline** artefact
3. Evaluation including **per-subgroup** performance
4. A written **leakage argument** for every feature
5. **Deployment** — even if that is a management command on a cron
6. **Monitoring** — at minimum, the prediction distribution logged
7. A **README a stranger could follow**

Tier C and D additionally require a **model card** and, for D, the completed ethics gate.

---

## Exercise 1

1. Pick a Tier A project. Write its one-page spec: question, data, baseline, metric, and
   what "good enough to be useful" means **in the school's terms**, not the metric's.
2. For each of the twelve, write one sentence on what could go wrong for a real person.
3. Take rung 12 and write both framings — "flag the record" and "flag the student".
   Explain in two sentences why the difference is not cosmetic.
4. Pick one project from the do-not-build list. Write the two-paragraph refusal.
5. Build rung 4. It is the fastest genuinely useful thing on this page.
