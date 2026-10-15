# 03 — Retrieval-Augmented Generation

**Week 28.** Give the model the facts, then ask the question.

---

## Table of Contents

1. [Why RAG exists](#1-why-rag-exists)
2. [The pipeline](#2-the-pipeline)
3. [Most RAG systems fail at retrieval, not generation](#3-most-rag-systems-fail-at-retrieval-not-generation)
4. [Improving retrieval](#4-improving-retrieval)
5. [Improving generation](#5-improving-generation)
6. [Citations you can trust](#6-citations-you-can-trust)
7. [When RAG is the wrong shape](#7-when-rag-is-the-wrong-shape)
8. [In your systems](#8-in-your-systems)
9. [Exercise 3](#exercise-3)

---

## 1. Why RAG exists

A language model knows what was in its training data. It does not know your school's
attendance policy, this term's timetable, or what a matron wrote on Tuesday. And asked
about them anyway, it will produce something plausible and wrong.

RAG retrieves the relevant text first and puts it in the prompt:

```
question -> retrieve relevant chunks -> put them in the prompt -> answer from them
```

**The alternative is fine-tuning, and it is usually the wrong tool for facts.** Fine-tuning
teaches style, format and task behaviour. It is a poor way to install knowledge: expensive
to update, impossible to cite, and it still hallucinates. **When the question is "what do
my documents say", the answer is retrieval, not training.**

## 2. The pipeline

```
INGEST (offline)
  load -> clean -> chunk -> embed -> store with metadata

QUERY (per request)
  embed question -> retrieve top-k -> [rerank] -> build prompt -> generate -> cite
```

```python
import anthropic

client = anthropic.Anthropic()

def answer(question: str, school_id: int) -> str:
    chunks = retrieve(question, school_id=school_id, k=5)   # tenant-scoped, always

    context = "\n\n".join(
        f"[{i+1}] (source: {c['source']}, page {c['page']})\n{c['text']}"
        for i, c in enumerate(chunks)
    )

    response = client.messages.create(
        model="claude-opus-5",
        max_tokens=16000,
        system=(
            "Answer using ONLY the numbered context provided. "
            "Cite the number you used, like [2]. "
            "If the context does not contain the answer, say so plainly. "
            "Never use knowledge from outside the context."
        ),
        messages=[{
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {question}",
        }],
    )
    return next(b.text for b in response.content if b.type == "text")
```

Three things in that system prompt are load-bearing: **only the context**, **cite the
number**, and **say so when the answer is absent.** Without the third, the model fills the
gap.

## 3. Most RAG systems fail at retrieval, not generation

This is the single most useful sentence in this file.

When a RAG system gives a bad answer, the instinct is to blame the model and rewrite the
prompt. **Check the retrieved chunks first.** In the large majority of cases the right
passage was never retrieved, and no prompt can fix that.

**So measure retrieval separately from generation.**

```python
# Build a set of (question, id_of_chunk_that_actually_answers_it) pairs
def recall_at_k(eval_set, k=5):
    hits = sum(
        1 for q, gold_id in eval_set
        if gold_id in [c['id'] for c in retrieve(q, k=k)]
    )
    return hits / len(eval_set)
```

**If recall@5 is 0.6, your ceiling is 0.6.** Forty percent of questions cannot be answered
correctly no matter what model you use. Fix retrieval before touching the prompt.

Building 50 question-to-chunk pairs by hand takes an afternoon and is the highest-value
afternoon in the whole project.

## 4. Improving retrieval

In rough order of value for effort:

**Hybrid search.** Embeddings plus keyword, fused. The single biggest reliable win —
semantic search is bad at names, IDs and exact phrases.

**Reranking.** Retrieve 50, rerank with a cross-encoder, keep 5.

**Better chunking.** Respect document structure. Keep a heading with its section.

**Query rewriting.** "What about her?" is unretrievable. Rewrite it into a standalone
question using the conversation history before embedding.

**Contextual chunk headers.** Prepend a one-line summary of the parent document to each
chunk before embedding, so an isolated paragraph retains its context.

**Metadata filtering.** Filter by date, document type, or school *before* the vector
search. Cheaper and more precise than hoping the embedding captures it.

## 5. Improving generation

- **Put the context before the question.** It also makes the context prefix cacheable.
- **Number the chunks and demand citations.** A citation is checkable; a claim is not.
- **Give an explicit escape.** "If the context does not answer this, say so." Models are
  reluctant to admit ignorance unless permitted.
- **Order matters.** Models attend more to the beginning and end of a long context. Put
  the strongest chunk first.
- **Do not over-retrieve.** Twenty mediocre chunks are worse than five good ones —
  the signal drowns and you pay for the tokens.

**Prompt caching is a large cost lever here.** If the system prompt and a stable corpus
prefix are identical across requests, cache them:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    system=[{
        "type": "text",
        "text": STABLE_SYSTEM_PROMPT,
        "cache_control": {"type": "ephemeral"},
    }],
    messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}],
)
print(response.usage.cache_read_input_tokens)   # verify it is actually hitting
```

Caching is a **prefix match** — put stable content first and volatile content (the
question, a timestamp) after the last cache breakpoint, or nothing caches and you will not
be told.

## 6. Citations you can trust

A citation the user cannot verify is decoration. Return the source with the answer:

```python
return {
    "answer": text,
    "sources": [
        {"n": i + 1, "document": c["source"], "page": c["page"], "excerpt": c["text"][:200]}
        for i, c in enumerate(chunks)
    ],
}
```

**Then check them.** A model can cite [3] while stating something [3] does not say. For
anything consequential, verify that the cited chunk actually supports the claim — a second
cheap model call can do this, and it is what `05-EVALS.md` calls faithfulness.

## 7. When RAG is the wrong shape

- **Aggregations.** "How many students missed class last term?" is a SQL query, not a
  retrieval problem. Retrieval finds passages; it cannot count. Route these to the
  database — see `04-LLM_APPLICATIONS.md` for the safe pattern.
- **The corpus is tiny.** Under ~50 pages, put it all in the context window. Simpler,
  and no retrieval to get wrong.
- **The answer needs synthesis across many documents.** Top-5 retrieval sees five
  passages; "summarise every incident this term" needs all of them.
- **The information changes constantly.** Query the source of truth instead.

## 8. In your systems

Genuinely useful, and low risk:

- School policy and handbook Q&A for staff and parents
- Searching the user guides in `Docs/user-guides/`
- Your own documentation — 74 files of curriculum, for instance
- Screening's public health information

**Higher risk, and gated:** anything retrieving over student records or mental health
responses. That is a retrieval system with children's personal data in the index, sent to
a model, and it needs `07-enterprise/02` and `03` before it exists — including a decision
about whether the text ever leaves your infrastructure.

---

## Exercise 3

1. Build a full RAG pipeline over a real document set — the `Docs/user-guides/` folder is
   a good target. Chunk, embed, store in `pgvector`, retrieve, generate with citations.
2. **Build a 50-question evaluation set** with the id of the chunk that truly answers
   each. This is the deliverable.
3. Measure **recall@1, @3, @5, @10**. Plot it. Where is your ceiling?
4. Improve retrieval with hybrid search. Re-measure recall. Report the delta.
5. Add reranking. Re-measure. Was it worth the latency?
6. Find three questions where retrieval succeeds but the answer is still wrong. Diagnose
   each: prompt, chunk boundary, or model?
7. Ask a question the corpus cannot answer. Does your system say so, or invent something?
   Fix it in the prompt and verify.
8. Enable prompt caching. Verify `cache_read_input_tokens` is non-zero across repeated
   calls, then compute your cost per query with and without it.
9. Deliberately break caching by putting a timestamp at the start of the system prompt.
   Show the cache reads drop to zero.

Exercises 2 and 3 are the ones that make this engineering instead of guesswork.
