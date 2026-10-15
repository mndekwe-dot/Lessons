# 05 — Evals

**Week 29.** How you know a change made things better.

This is the rarest skill in the whole LLM field and the most valuable. Almost everyone
building with language models is changing prompts and judging the result by reading two
outputs and feeling good about it. That is not measurement.

---

## Table of Contents

1. [Why this is hard](#1-why-this-is-hard)
2. [What an eval set is](#2-what-an-eval-set-is)
3. [Four ways to grade](#3-four-ways-to-grade)
4. [What to measure for RAG](#4-what-to-measure-for-rag)
5. [The runner](#5-the-runner)
6. [Interpreting a change](#6-interpreting-a-change)
7. [Regression evals](#7-regression-evals)
8. [Wiring it in](#8-wiring-it-in)
9. [Exercise 5](#exercise-5)

---

## 1. Why this is hard

With a classifier you have labels and a metric. With generation there is no single right
answer, outputs vary between runs, and quality is partly subjective.

So people fall back on vibes: change the prompt, try it once, "yeah that seems better",
ship. **Then the next change silently breaks the thing the last change fixed**, and nobody
notices because nobody is measuring.

An eval is a test suite for behaviour that has no exact expected output.

## 2. What an eval set is

A fixed collection of inputs, each with something that lets you score the output.

```python
EVAL_SET = [
    {
        "id": "attendance_001",
        "input": "How many days can a student miss before we contact the parents?",
        "expected_facts": ["3 consecutive days", "parent contacted"],
        "must_cite": True,
    },
    {
        "id": "refusal_001",
        "input": "What is Aline Uwimana's home address?",
        "expected_behaviour": "refuse_or_no_answer",
    },
]
```

**Rules that decide whether the eval is worth anything:**

- **At least 50 cases**, or the noise swamps the signal.
- **Drawn from real usage**, not invented at your desk. Your imagination is not the
  distribution.
- **Include the hard cases**: ambiguous questions, questions the corpus cannot answer,
  adversarial input, and every bug you have already fixed.
- **Split it.** Develop against one part, keep a held-out part you score rarely. Tuning
  against the whole set fits it, exactly as with a test set
  (`03-classical-ml/03-MODEL_EVALUATION.md §1`).
- **Version it in git.** It is code.

## 3. Four ways to grade

**Exact / programmatic** — for anything checkable.

```python
def grade_structured(output, case):
    return output["category"] == case["expected_category"]
```

Cheap, deterministic, no ambiguity. **Use it wherever you can**, which is more places than
people assume — did it return valid JSON? did it cite a source? did it stay under the word
limit? did it refuse when it should?

**Keyword / fact presence** — crude but useful for factual answers.

```python
def grade_facts(output, case):
    return all(f.lower() in output.lower() for f in case["expected_facts"])
```

**LLM-as-judge** — a model grades the output against a rubric.

```python
JUDGE_RUBRIC = """You are grading an answer from a school assistant.

Question: {question}
Context provided: {context}
Answer: {answer}

Score each 1-5:
- faithfulness: is every claim supported by the context?
- relevance: does it answer the question asked?
- completeness: is anything important missing?

Return JSON only."""

judgement = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    output_config={"format": {"type": "json_schema", "schema": JUDGE_SCHEMA}},
    messages=[{"role": "user", "content": JUDGE_RUBRIC.format(...)}],
)
```

**Judges have known biases, and you must account for them:** they prefer longer answers,
they prefer their own family's style, and position matters when comparing two outputs
(swap the order and average). **Validate the judge against human labels on 30 cases
before trusting it.** If the judge agrees with you 70% of the time, its scores are worth
roughly that much.

**Human** — the ground truth. Expensive, so spend it where it counts: validating the
judge, and on the cases the judge is least confident about.

## 4. What to measure for RAG

Separate the stages, because they fail for different reasons:

| Metric | Question |
|---|---|
| **Recall@k** | Was the answering chunk retrieved? *(the ceiling)* |
| **Faithfulness** | Is every claim supported by the retrieved context? |
| **Relevance** | Does it answer what was asked? |
| **Citation accuracy** | Does the cited chunk actually say that? |
| **Refusal rate** | Does it decline when the context is insufficient? |

**Faithfulness is the one that matters most** for a school assistant. An answer that is
fluent, relevant and unsupported is exactly the failure that gets a parent told something
false about their child.

**Track refusal rate in both directions.** A system that never says "I don't know" is
hallucinating. One that always says it is useless. Both are failures, and only tracking
one of them hides the other.

## 5. The runner

```python
import json, time
from pathlib import Path

def run_eval(system_under_test, eval_set, version: str):
    results = []
    for case in eval_set:
        t0 = time.time()
        output = system_under_test(case["input"])
        results.append({
            "id": case["id"],
            "output": output["answer"],
            "passed": grade(output, case),
            "latency_s": round(time.time() - t0, 2),
            "input_tokens": output["usage"].input_tokens,
            "output_tokens": output["usage"].output_tokens,
        })

    passed = sum(r["passed"] for r in results)
    summary = {
        "version": version,
        "pass_rate": passed / len(results),
        "p50_latency": sorted(r["latency_s"] for r in results)[len(results)//2],
        "cost_usd": estimate_cost(results),
    }
    Path(f"evals/runs/{version}.json").write_text(
        json.dumps({"summary": summary, "results": results}, indent=2))
    return summary
```

**Record cost and latency alongside quality, always.** A change that improves pass rate
from 0.81 to 0.83 and triples the cost is usually a bad change, and you cannot see that
from a quality number alone.

**Save every run.** The history is what lets you answer "when did this regress?"

## 6. Interpreting a change

Model outputs are non-deterministic. **A pass rate moving 0.81 → 0.83 on 50 cases is
probably noise.**

```python
# rough 95% interval for a proportion
import math
def ci(p, n):
    se = math.sqrt(p * (1 - p) / n)
    return p - 1.96*se, p + 1.96*se

ci(0.81, 50)     # roughly (0.70, 0.92)  <- that is a wide interval
```

Fifty cases cannot detect a two-point improvement. Either grow the eval set, or accept
that only large changes are visible to it. This is
`01-mathematics/02-STATISTICS.md §4` — halving your uncertainty needs four times the data.

**Always look at what changed, not only the score.** Two prompts scoring 0.82 can fail on
completely different cases, and the diff tells you more than the number.

## 7. Regression evals

**Every bug you fix becomes a permanent eval case.**

```python
REGRESSION_CASES = [
    {"id": "reg_001", "input": "...",
     "note": "2026-10-03: invented a policy that does not exist",
     "must_not_contain": ["Section 7.4"]},
]
```

This is the same discipline as a failing test that you fix and keep. Over a year it
becomes the most valuable part of your eval set, because it encodes every way your system
has actually been wrong.

## 8. Wiring it in

Run the eval in CI on any change to prompts, retrieval, or the model. Block the merge on a
drop.

**But note the difference from a normal test suite: an eval run costs real money.** Budget
it. A 200-case eval at $0.02 a case is $4 per run, which is fine for a merge gate and not
fine for every push. Run the full set on merge and a 30-case smoke subset on push.

**When you change the model**, rerun everything. Prompts tuned for one model are not
automatically right for another — that is a real and frequently underestimated migration
cost.

---

## Exercise 5

1. Build a **50-case eval set** for your RAG system from file 03. Include at least five
   unanswerable questions and five adversarial ones. Version it in git.
2. Implement programmatic grading for everything checkable — valid JSON, citation present,
   length, refusal behaviour.
3. Implement an LLM judge for faithfulness and relevance. **Then hand-label 30 of the same
   cases yourself and measure the judge's agreement with you.** Report the number.
4. Run the eval. Record pass rate, cost, and p50 latency as your baseline.
5. Make one prompt change. Re-run. Compute the confidence interval on the difference.
   **Can you actually tell whether it helped?**
6. Make a change you are confident is worse. Does the eval detect it? If not, your eval is
   too small or your grader too lenient.
7. Split into dev and held-out. Tune five times against dev, then score the held-out set.
   **How much did you overfit?**
8. Add a regression case for a real failure you have seen. Confirm it fails before your
   fix and passes after.
9. Wire a 30-case smoke eval into CI.

Exercise 7 is the one that surprises people. Tuning against a small eval set fits it, and
the held-out number is the honest one.
