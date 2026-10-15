# 04 — LLM Applications

**Week 29.** Building with a language model as a component, not a magic box.

---

## Table of Contents

1. [Pick the simplest tier that works](#1-pick-the-simplest-tier-that-works)
2. [The basic call](#2-the-basic-call)
3. [Thinking and effort](#3-thinking-and-effort)
4. [Structured output — do not parse prose](#4-structured-output--do-not-parse-prose)
5. [Prompting that holds up](#5-prompting-that-holds-up)
6. [Tool use](#6-tool-use)
7. [The natural-language query interface — and the hard rule](#7-the-natural-language-query-interface--and-the-hard-rule)
8. [Cost and latency](#8-cost-and-latency)
9. [Failure modes to design for](#9-failure-modes-to-design-for)
10. [Exercise 4](#exercise-4)

---

## 1. Pick the simplest tier that works

| Need | Use |
|---|---|
| Classify, summarise, extract, answer | **One API call** |
| Multi-step, but you control the order | **Workflow** — your code calls the model N times |
| Open-ended, the model decides the steps | **Agent** — tool use in a loop |

**Default to the top row.** Most production LLM features are a single call with a good
prompt. Agents are for tasks that genuinely cannot be specified in advance, and they cost
more, fail in stranger ways, and are harder to test.

Before building an agent, check all four: is the task genuinely hard to specify? Does the
value justify the cost and latency? Is the model capable at it? **And can errors be caught
and recovered?** If any answer is no, drop a tier.

## 2. The basic call

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    system="You are a school administration assistant. Be concise and factual.",
    messages=[{"role": "user", "content": prompt}],
)
text = next(b.text for b in response.content if b.type == "text")
```

A few defaults worth knowing:

- **`max_tokens` is a hard ceiling that truncates mid-sentence.** Do not lowball it.
  ~16000 for normal non-streaming calls; ~256 for classification where you want a short
  answer anyway.
- **Stream anything long**, or you risk HTTP timeouts:
  ```python
  with client.messages.stream(model="claude-opus-5", max_tokens=64000, messages=[...]) as s:
      response = s.get_final_message()
  ```
- **Check `stop_reason` before reading content.** `max_tokens` means you were truncated;
  `refusal` means the model declined and `content` may not hold what you expect.

## 3. Thinking and effort

For anything requiring reasoning, turn on adaptive thinking:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},     # low | medium | high | xhigh | max
    messages=[{"role": "user", "content": prompt}],
)
```

**`effort` is your main quality-versus-cost dial**, and it is the first lever to reach for
after caching. `high` is the default and usually the sweet spot. Drop to `low` for
classification and other routine, high-volume work; raise to `xhigh` or `max` only when
measurement shows headroom.

Tune it **per route**, not globally. A classification endpoint and a report-writing
endpoint have no reason to share a setting.

## 4. Structured output — do not parse prose

Asking for JSON in the prompt and parsing the reply is fragile. Constrain the format
instead:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=4096,
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "category": {"type": "string",
                                 "enum": ["academic", "behaviour", "health", "other"]},
                    "urgency": {"type": "integer", "minimum": 1, "maximum": 5},
                    "summary": {"type": "string"},
                },
                "required": ["category", "urgency", "summary"],
                "additionalProperties": False,
            },
        }
    },
    messages=[{"role": "user", "content": note}],
)
```

An `enum` means you get one of four values or an error — never "Academic (probably)". For
any output your code consumes, this is the difference between a feature and a source of
exceptions.

## 5. Prompting that holds up

- **Be specific about the output.** "Return three bullet points, each under 15 words"
  beats "be concise".
- **Give examples** for anything with a format or a judgement call. Two or three
  input/output pairs outperform a paragraph of description.
- **Put long context first, the instruction last.** Better attention, and it makes the
  long part cacheable.
- **Say what to do, not what to avoid.** "Answer only from the context" beats "don't make
  things up".
- **Prompts are code.** Version them, review them, and never edit one in production
  without running the eval (`05-EVALS.md`).

**Do not over-instruct.** Long, prescriptive prompts written for older models often reduce
output quality on current ones. Start minimal and add only what an eval shows you need.

## 6. Tool use

When the model needs to *do* something — query a database, call an API:

```python
tools = [{
    "name": "get_attendance_summary",
    "description": "Attendance stats for one class over a date range.",
    "input_schema": {
        "type": "object",
        "properties": {
            "class_id": {"type": "integer"},
            "start_date": {"type": "string", "format": "date"},
            "end_date": {"type": "string", "format": "date"},
        },
        "required": ["class_id", "start_date", "end_date"],
        "additionalProperties": False,
    },
    "strict": True,      # guarantees the arguments validate against the schema
}]
```

The loop: call the API, and while `stop_reason == "tool_use"`, execute the requested tools,
append **all** results in a single user message, and call again.

**The tool description is the prompt.** A vague description produces wrong calls far more
often than a badly-named parameter does. Write it for someone who has never seen your
database.

**Return all parallel tool results in one message.** Splitting them across several messages
silently trains the model to stop making parallel calls.

## 7. The natural-language query interface — and the hard rule

This is the obvious Imboni feature: "Which S3 students missed more than five days last
month?"

**The model must never emit SQL that you execute.** That is SQL injection with a language
model as the attacker, and it is worse than the classic kind because the input is designed
to be open-ended.

The safe pattern:

1. Define a **fixed set of parameterised queries** as tools, with typed parameters.
2. The model selects one and fills the parameters.
3. **Your code** validates the parameters, applies the tenant scope, applies the user's
   permissions, and runs the query.
4. The model formats the returned rows into prose.

```python
def run_attendance_summary(class_id: int, start_date: str, end_date: str, *, user):
    if not user.can_view_class(class_id):          # permissions AFTER generation
        raise PermissionDenied()
    return AttendanceRecord.objects.filter(        # ORM, parameterised, tenant-scoped
        school_class_id=class_id,
        date__range=(start_date, end_date),
    ).aggregate(...)
```

Note the ordering: **generation, then validation, then permissions, then execution.** The
model chooses *what to ask*; it never decides *what it is allowed to see*.

## 8. Cost and latency

Current pricing, per million tokens:

| Model | Input | Output |
|---|---|---|
| Claude Opus 5 | $5.00 | $25.00 |
| Claude Sonnet 5 | $2.00 | $10.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |

**Levers, in order — free ones before the ones that trade quality:**

1. **Prompt caching.** Up to ~90% off the cached prefix. Do this first.
2. **Input hygiene.** Stop sending context nobody reads.
3. **Output hygiene.** Output costs 5× input. Ask for less.
4. **Batch API** — 50% off for anything not latency-sensitive. Overnight report
   generation is the obvious fit.
5. **Effort.** Drop to `low` where quality holds.
6. **Model choice.** Last, and measure.

```python
count = client.messages.count_tokens(model="claude-opus-5", messages=messages, system=system)
print(count.input_tokens)     # know before you send
```

**Judge cost per completed task, not per request.** A cheaper model that needs three
attempts is not cheaper.

For latency: stream so the user sees output immediately. Perceived speed is dominated by
time-to-first-token, not total time.

## 9. Failure modes to design for

- **It will be wrong sometimes.** Design the UI so a wrong answer is recoverable and
  visibly provisional.
- **It will be slow sometimes.** Timeouts, retries with backoff and jitter, and a
  circuit breaker (`engineering-curriculum` Ch 18 — the same patterns).
- **The API will be down sometimes.** What does the page do then? Degrade, do not 500.
- **It can refuse.** Check `stop_reason == "refusal"` and handle it.
- **Never let a model be the only guard on a destructive action.** A human confirms
  anything irreversible.

---

## Exercise 4

1. Build a single-call classifier for free-text notes using `output_config` with a JSON
   schema and an enum. Verify the output always validates.
2. **Compare it against your TF-IDF baseline** from file 01 — accuracy, cost per 1,000
   documents, and latency. Write the honest recommendation.
3. Run the same task at effort `low`, `medium` and `high`. Plot quality against cost.
   Where is the knee?
4. Add prompt caching. Verify `cache_read_input_tokens` is non-zero. Recompute cost.
5. Build the NL query interface with three parameterised query tools. **Write a test that
   proves a user cannot retrieve another school's data**, and one that proves a teacher
   cannot query a class they do not teach.
6. Try to make your own interface return data it should not. Document what you tried and
   what stopped it.
7. Run 100 documents through the Batch API. Compare cost and wall-clock against the
   synchronous version.
8. Simulate the API being down. Does your page degrade gracefully, or 500?

Exercise 5 is not optional if you ever point this at real data.
