# 09 — Your Specialization Roadmap (Data Engineering + Python BE & AI)

> **READ THIS AFTER THE ASSESSMENT.** Nothing in this file is tested on the coding
> assessment. The GCA tests general coding ability only — loops, strings, lists, dicts,
> careful implementation. Files 00–08 are your exam prep; **finish those first.**
>
> This file is for: (a) choosing between your two tracks on assessment day, and (b) knowing
> what to learn once you're in.

---

## Table of Contents

1. [The two tracks you're considering](#the-two-tracks-youre-considering)
2. [What carries over from THIS kit](#what-carries-over-from-this-kit)
3. [After the assessment: what to learn, in order](#after-the-assessment-what-to-learn-in-order)
4. [Honest advice on timing](#honest-advice-on-timing)
5. [Free resources for later (bookmark, don't open yet)](#free-resources-for-later-bookmark-dont-open-yet)

---

## The two tracks you're considering

| | **Python BE & AI App Dev** | **Data Engineering** |
|---|---|---|
| Core language | Python | Python + **SQL** |
| You build | Backend APIs, AI-powered app features | Data pipelines, warehouses, reporting |
| Key tech | Flask / Django, REST APIs, databases | SQL, ETL, AWS / Azure |
| Day-to-day | "Make the app do things" | "Move and shape data reliably" |
| Extra skill needed | Web/API concepts | SQL (the big one) + cloud |

**Both build directly on the Python you're learning now.** Neither requires you to start over.

### How to choose

Ask yourself which sentence sounds more like the work you want:

- *"I want to build applications people use — features, APIs, AI-powered functionality."*
  → **Python BE & AI App Dev**
- *"I want to work with large amounts of data — cleaning it, moving it, making it usable."*
  → **Data Engineering**

Practical notes:
- **Data Engineering** requires **SQL**, which is a second language — but it's genuinely easy
  to start and extremely employable. Data roles are in high demand.
- **Python BE & AI** is the most direct continuation of what you're studying right now — no
  new language, just new libraries.
- Neither is "harder." Pick by interest, because you'll be doing it every day.

---

## What carries over from THIS kit

Everything you're learning now is foundation for both tracks — it is not throwaway exam prep:

| From the kit | Where it's used in your track |
|---|---|
| Loops, conditions ([01b](01b-loops-guide.md), [01c](01c-conditions-guide.md)) | Everything, forever |
| Lists & strings ([02](02-strings-and-lists.md)) | Cleaning messy data, parsing files |
| **Dictionaries** ([03](03-dictionaries-and-sets.md)) | Huge — JSON, API responses, records, grouping |
| Counting / grouping patterns | Data aggregation, analytics |
| Sorting, `key=` | Ranking, ordering reports |
| The method ([00](00-how-to-solve-any-problem.md)) | How you approach every problem, forever |

> Dictionaries are the single most transferable thing in this kit. JSON — the format APIs and
> data pipelines speak — is literally nested dictionaries and lists.

---

## After the assessment: what to learn, in order

### Shared foundation (do this regardless of track)

1. **Finish core Python** — functions with default arguments, error handling
   (`try`/`except`), reading and writing files, importing modules.
2. **Git & GitHub** — branching, commits, pull requests. Required in every track.
3. **The command line** — basic Linux/terminal navigation.
4. **Virtual environments & pip** — `venv`, installing packages, `requirements.txt`.

### If you choose Python BE & AI App Dev

5. **Web basics** — what HTTP is, what a REST API is, JSON, request/response.
6. **Flask** (start here — simpler than Django) — build a small API with a few endpoints.
7. **Databases** — SQL basics, then an ORM (SQLAlchemy / Django ORM).
8. **Build a real project** — a small API with a database behind it. This matters more than
   any tutorial.
9. **AI/ML entry point** — calling an existing AI API first (far more practical than training
   models); later `pandas` → `scikit-learn` for fundamentals.

### If you choose Data Engineering

5. **SQL — this is the priority.** `SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, then `JOIN`s,
   then aggregations and subqueries. Practice on real datasets.
6. **pandas** — Python's data-manipulation library. Feels like the list/dict work you're
   doing now, at scale.
7. **ETL thinking** — Extract (pull data), Transform (clean/reshape), Load (store it).
   Understand the shape of a pipeline.
8. **A cloud platform** — AWS or Azure basics: storage, and one data service.
9. **Build a real pipeline** — pull data from a public API, clean it with pandas, store it,
   report on it. That single project teaches more than months of reading.

---

## Honest advice on timing

1. **Now until the assessment:** files 00–08 only. Nothing in this file. Your entire job is
   passing 3 of 4 questions.
2. **The week after the assessment:** pick your track, start the shared foundation above.
3. **Once in the programme:** they will teach you the specialization tech. You don't need to
   arrive knowing Flask or SQL — you need to arrive able to *program*, which is exactly what
   this kit is building.

> **Don't start SQL or Flask before the assessment.** Splitting your attention is the most
> common way capable candidates fail — not lack of ability, but studying the wrong thing at
> the wrong time.

---

## Free resources for later (bookmark, don't open yet)

**SQL:** SQLBolt (sqlbolt.com), Mode SQL Tutorial, LeetCode Database problems
**pandas:** the official "10 minutes to pandas" guide, then Kaggle's free pandas course
**Flask:** the official Flask quickstart, then the Miguel Grinberg mega-tutorial
**Cloud:** AWS Skill Builder / Microsoft Learn free tiers
**Git:** the official Git handbook, "Learn Git Branching" (interactive)
**AI:** start by calling an existing model's API; Kaggle's free intro-to-ML course after that
