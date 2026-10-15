# 05 — Model Cards

*Extra. The template you fill in for the capstone.*

A model card is one page that answers, for anyone who has to trust or challenge your model:
what it does, how well, for whom it works less well, and who is accountable.

**If you cannot write it, you do not understand your own system well enough to be running
it on children.**

---

## Table of Contents

1. [The template](#the-template)
2. [Notes on filling it in](#notes-on-filling-it-in)
3. [Exercise 5](#exercise-5)

---

## The template

Copy this. Fill in every section. An empty section is a finding, not an omission.

```markdown
# Model Card — Dropout Risk Indicator

**Version:** 2026-09-08.3
**Owner:** [name, contact]
**Status:** production / staging / retired
**Last reviewed:** 2026-09-08
**Next review due:** end of Term 1

## 1. What it does
One paragraph, no jargon. A headteacher must understand it.

> Estimates which students may be at risk of leaving school, so staff can offer
> support earlier. It produces a score from 0 to 1 and flags the highest-scoring
> students, up to the number of follow-ups the school says it can handle.

## 2. Intended use
- **Intended:** helping staff decide who to check on first.
- **Users:** DOS and head of discipline. Not teachers, not parents, not students.
- **Out of scope — explicitly NOT for:**
  - streaming, setting, or any placement decision
  - disciplinary action
  - anything shown to a student or family as a prediction about them
  - admissions

## 3. Data
- **Source:** Imboni attendance, results, discipline. Terms 1-3, 2024-2026.
- **Size:** 12,400 student-terms across 8 schools.
- **Label:** left school before completing the year, from enrolment records.
- **Base rate:** 3.2%.
- **Lawful basis:** [basis]. Controller: [school]. Processor: [you].
- **Known issues:** pre-2026 attendance entered in batches, timestamps unreliable.
  One school's discipline records start mid-2025.

## 4. Features
| Feature | Known at prediction time because... |
|---|---|
| rolling 30-day attendance | computed from records entered before the scoring date |
| grade change vs last term | previous term is closed |
| ... | ... |

**Deliberately excluded:** sex, district. See section 7.

## 5. Performance
Held-out test set, n=2,100, single evaluation.

| Metric | Value |
|---|---|
| PR-AUC | 0.31 (chance = 0.032) |
| ROC-AUC | 0.79 |
| Recall @ 30 flags/school | 0.58 |
| Precision @ 30 flags/school | 0.29 |
| Calibration | within 0.04 across deciles |

**In plain words:** of 30 students flagged, about 9 genuinely leave. We catch a
little under 60% of those who do. We miss about 40%.

**Baseline:** flagging everyone below 70% attendance gives recall 0.44,
precision 0.21. The model is better, not transformatively so.

## 6. Where it works less well
| Group | n | Recall | Precision | Note |
|---|---|---|---|---|
| Day students | 1,640 | 0.61 | 0.30 | |
| Boarders | 460 | 0.42 | 0.24 | **Materially worse** |
| Girls | 1,020 | 0.57 | 0.28 | |
| Boys | 1,080 | 0.59 | 0.29 | |
| Girls who board | 210 | 0.38 | 0.22 | **Worst; wide CI** |

**Fairness definition chosen:** equal opportunity (equal recall across groups),
because the aim is to catch the same proportion of genuinely at-risk students in
each group. Per-group thresholds are applied to achieve this; this costs 0.03
overall recall and is a school policy decision, recorded [here].

## 7. Limitations
- Trained on 8 schools; may not transfer to very different contexts.
- Boarder performance is materially worse; the likely cause is fewer
  attendance signals for students already on site.
- Cannot see anything outside the system — family circumstances, illness,
  finances — which are plausibly the largest real causes.
- Sex and district were excluded, but proxies remain. See the bias audit.
- Base rate shifts between terms; recalibrate termly.

## 8. Ethical review
- **What happens when it is wrong?** A false positive means an unnecessary
  conversation. A false negative means a student who needed help was not
  prioritised — but was not *denied* anything, because the model only adds support.
- **Human decision:** yes. Staff see the reasoning and decide.
- **Subject informed:** [yes/no, and how].
- **Appeal route:** [named person and process].
- **DPIA:** completed [date], reviewed by [who].

## 9. Operations
- **Scored:** nightly, 02:17, Celery Beat.
- **Retrained:** termly, gated on a fixed holdout, human-promoted.
- **Monitoring:** PSI per feature weekly; prediction distribution daily;
  outcome comparison each term.
- **Rollback:** set MODEL_VERSION to the previous release; tested [date],
  takes ~4 minutes. Note: predictions already written are not reverted.
- **Retention:** scores 1 year, prediction logs 90 days.

## 10. Accountability
- **Model owner:** [name]
- **Data controller:** [school]
- **Who to contact:** [email]
- **A parent contests a decision by:** [process]
```

---

## Notes on filling it in

**Section 5 must include the plain-words paragraph.** "PR-AUC 0.31" tells a headteacher
nothing. "Of 30 flagged, about 9 genuinely leave" tells them everything, including that the
model is often wrong — which they need to know before acting on it.

**Section 5 must include the baseline.** Without it, no reader can judge whether the model
earned its complexity. Often it barely did, and that is worth knowing.

**Section 6 is not optional and it is not a formality.** The worst-performing subgroup goes
in the table even when — especially when — it is embarrassing. A card that reports only
aggregate performance is marketing.

**Section 2's out-of-scope list is the most protective thing on the page.** Models get
repurposed. Somebody will eventually suggest using the risk score for streaming. The
written "explicitly NOT for" is what you point at.

**Review it on a schedule.** A card describing a model retrained three times since is worse
than none, because it is confidently wrong. Put the review date in the card and hold to it.

---

## Exercise 5

1. Write the complete card for one of your own models. Every section.
2. Give it to someone non-technical. **Can they say what it does and how often it is
   wrong?** Fix what they could not follow.
3. Which section was hardest to fill honestly? That is where your system is weakest.
4. Write the out-of-scope list before anyone asks. At least four entries.
5. Put the card in version control next to the model. Add a CI check that fails if the
   model version changes and the card does not.
