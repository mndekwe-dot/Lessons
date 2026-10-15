# 03 — The Capstone

**After Week 37.** The exit exam.

---

## Table of Contents

1. [The brief](#the-brief)
2. [The rules](#the-rules)
3. [What you must deliver](#what-you-must-deliver)
4. [Checkpoint — the questions I will ask](#checkpoint--the-questions-i-will-ask)
5. [Automatic fail](#automatic-fail)
6. [What passing means](#what-passing-means)
7. [Afterwards](#afterwards)
8. [One last honest note](#one-last-honest-note)

---

## The brief

> **Build one ML system a real school would actually use. Deploy it. Operate it.**

Not a notebook. Not a demo. A thing that runs on a schedule, is monitored, can be rolled
back, and that you could hand to a headteacher with a straight face.

**Choose from Tier A or B of the project ladder** unless you have completed the ethics gate
and have a genuine lawful basis. Tier A rung 4 — data-quality anomaly detection — is a
strong choice: immediately useful to Imboni, no personal-data exposure, and it exercises
every skill in this course.

## The rules

- **No AI assistance on the build.** Official documentation only, as with every Build Task
  in this curriculum.
- **Real or realistic data.** Synthetic is fine and often correct; it must be realistically
  messy, not clean.
- **It must run without you.** Scheduled, monitored, alerting.
- **Time:** three to four weeks part-time. This is not a weekend.

## What you must deliver

### 1. The system
- [ ] Trained model, in a pipeline artefact with metadata
- [ ] Deployed — batch on a schedule, or an API, whichever suits the problem
- [ ] Dockerised; `docker compose up` works from a clean clone
- [ ] CI running tests on every push
- [ ] Structured `src/`, not a notebook

### 2. The evaluation
- [ ] Baseline established **first**, and reported
- [ ] Metric chosen from the real cost of each error, and justified in writing
- [ ] Correct split — grouped or temporal as the data requires
- [ ] Per-subgroup performance, with confidence intervals
- [ ] A written leakage argument for **every** feature
- [ ] Held-out test set touched exactly once

### 3. The operations
- [ ] Runs on a schedule, idempotently, with a run record
- [ ] Predictions logged with model version and data version
- [ ] Drift monitoring on at least one feature, with a threshold
- [ ] At least one alert, including "the job stopped running"
- [ ] A rollback procedure you have **executed and timed**
- [ ] Retention enforced for predictions and logs

### 4. The documentation
- [ ] README to the `02-PORTFOLIO_GUIDE.md §5` structure
- [ ] Model card, complete, every section
- [ ] A runbook: how to deploy, roll back, and what to do when it breaks
- [ ] Written answers to the five interview questions

### 5. If it touches personal data — additionally
- [ ] Ethics gate completed and signed off in `PROGRESS.md`
- [ ] DPIA written, including an honest answer to "is it necessary and proportionate?"
- [ ] Bias audit with intersections
- [ ] Fairness definition chosen and defended
- [ ] Human-in-the-loop and an appeal route, both documented
- [ ] Cross-tenant access test that passes

## Checkpoint — the questions I will ask

Not "what is your AUC". These:

1. **What does a trivial baseline score, and how much did the model actually add?**
2. **Show me your leakage argument for the feature you are least sure about.**
3. **Which subgroup does it work worst for, and what did you do?**
4. **It has been live six months. How would you know if it had quietly stopped working?**
5. **Walk me through a rollback.** Have you run it?
6. **What would you do differently?**
7. **What is wrong with it that you have not fixed?**

**Questions 4 and 7 carry the most weight.** Anyone can build something that works on the
day. Knowing how it fails, and admitting what you left undone, is the difference.

## Automatic fail

- No baseline
- Test set used more than once
- A notebook with no `src/`
- Not deployed
- No per-subgroup evaluation
- Any code you cannot explain line by line
- Personal data used without the ethics gate

## What passing means

You can build, ship, and **operate** an ML system that survives contact with real users.

Combined with the engineering curriculum behind it, that is an ML Engineer — and a rarer
profile than either half alone. Most people who can train a model cannot ship one; most
people who can ship cannot train. You will be able to do both, and you will have one
artefact that proves it.

## Afterwards

1. **Write it up publicly.** A blog post on what broke and what you learned is worth more
   than the code.
2. **Keep operating it.** A system you have run for six months teaches you things no
   project can. The drift you find in month four is the real lesson.
3. **Then pick the next rung**, or go back to the engineering curriculum's open items.

---

## One last honest note

You will reach this page somewhere around mid-2027 if you sustain the whole plan. That is a
long way off, and the realistic failure mode is not that the capstone defeats you — it is
that Phase 2 maths in week seven is uncomfortable and the curriculum quietly stops.

**If that happens, the useful move is to say so out loud rather than let it decay.** A
paused plan you restart is fine. The version where you keep telling yourself you are still
doing it is the one that costs a year — and you have already spent one that way.

Come back to this page when you get here. I expect you to have found at least three things
wrong with it by then.
