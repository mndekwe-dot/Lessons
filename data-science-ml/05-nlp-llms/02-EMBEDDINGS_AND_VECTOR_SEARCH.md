# 02 — Embeddings and Vector Search

**Week 27.** Where the dot product from Phase 2 starts doing real work.

---

## Table of Contents

1. [What an embedding is](#1-what-an-embedding-is)
2. [Similarity is the dot product](#2-similarity-is-the-dot-product)
3. [Getting embeddings](#3-getting-embeddings)
4. [Storing and searching](#4-storing-and-searching)
5. [Exact vs approximate search](#5-exact-vs-approximate-search)
6. [Chunking — the decision that governs quality](#6-chunking--the-decision-that-governs-quality)
7. [Beyond plain semantic search](#7-beyond-plain-semantic-search)
8. [Uses beyond search](#8-uses-beyond-search)
9. [The honest limits](#9-the-honest-limits)
10. [Exercise 2](#exercise-2)

---

## 1. What an embedding is

A dense vector that represents meaning. Similar meanings land close together.

```
"student"  -> [0.21, -0.44, 0.07, ...]     typically 384 to 3072 dimensions
"pupil"    -> [0.19, -0.41, 0.11, ...]     close
"tractor"  -> [-0.62, 0.15, -0.33, ...]    far
```

The contrast with TF-IDF is the whole point:

| | TF-IDF | Embeddings |
|---|---|---|
| Dimensions | 50,000+, sparse | 384–3072, dense |
| "student" vs "pupil" | Unrelated | Close |
| Interpretable | Yes, per-word | No |
| Cost | Free | API call or a local model |
| Handles unseen words | Poorly | Yes, via subwords |

**TF-IDF matches words. Embeddings match meaning.** A search for "students missing class"
will not find a document that says "pupils absent from lessons" under TF-IDF, and will
under embeddings.

## 2. Similarity is the dot product

```python
import numpy as np

def cosine(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

Straight from `01-mathematics/01-LINEAR_ALGEBRA.md §2`. Cosine ignores magnitude and
compares direction, which is what you want — a 200-word and a 2,000-word document about
the same topic should be similar.

**Many embedding APIs return normalised vectors**, in which case the dot product *is* the
cosine and you can skip the division. Check; it matters for speed at scale.

## 3. Getting embeddings

**Local, free, good enough for most work:**

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
vectors = model.encode(texts, normalize_embeddings=True, batch_size=64)
```

Use a **multilingual** model for your data. English-only models produce meaningless
vectors for Kinyarwanda and mediocre ones for French. Even multilingual models are weak
on Kinyarwanda — measure before trusting.

**Hosted embedding APIs** are also available from several providers and are worth the
money when quality matters more than control. The trade is per-call cost, latency, and
sending your text to a third party — which for student or health data is a data-protection
decision, not a convenience one (`07-enterprise/03`).

## 4. Storing and searching

**Start with Postgres.** You already run it.

```sql
CREATE EXTENSION vector;

ALTER TABLE documents ADD COLUMN embedding vector(384);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

SELECT id, content, 1 - (embedding <=> %s) AS similarity
FROM documents
WHERE school_id = %s                      -- tenant scoping, ALWAYS
ORDER BY embedding <=> %s
LIMIT 10;
```

`<=>` is cosine distance. `1 - distance` is similarity.

**`pgvector` is enough for a very long time** — comfortably into millions of vectors. It
keeps your embeddings in the same transaction, the same backup, and the same access
control as the rows they describe. A separate vector database means a second system to
deploy, secure, back up, and keep consistent.

That consistency point is not theoretical: if a student's record is deleted for data
protection reasons and their embedding lives in a different store, **you have failed to
delete their data.** In Postgres, a foreign key with `ON DELETE CASCADE` handles it.

Dedicated vector databases (Qdrant, Weaviate, Milvus, pgvector's larger cousins) earn
their place at very high scale or with heavy metadata filtering. That is a later problem.

## 5. Exact vs approximate search

Exact nearest-neighbour search compares against every vector — O(n), fine to ~100k.

**ANN** (approximate nearest neighbour) trades a little recall for a lot of speed:

- **HNSW** — a navigable graph. Fast, accurate, memory-hungry. The default.
- **IVFFlat** — clusters first, searches nearby clusters. Less memory, needs training.

```sql
SET hnsw.ef_search = 100;    -- higher = better recall, slower
```

**ANN can silently miss results.** That is the deal you made. For a document search it is
fine; for anything where a missing match has consequences, measure your recall against
exact search on a sample before shipping.

## 6. Chunking — the decision that governs quality

You cannot embed a 50-page document as one vector; meaning gets averaged into mush.

| Strategy | Notes |
|---|---|
| Fixed size (e.g. 500 tokens) | Simple; cuts mid-sentence |
| Sentence/paragraph | Respects structure; variable length |
| **Recursive with overlap** | **The sensible default** |
| Semantic | Split where meaning shifts. Better, slower |
| Document-structure aware | Split on headings. Best when structure exists |

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800, chunk_overlap=100,
    separators=["\n\n", "\n", ". ", " ", ""],
)
```

**Overlap matters.** Without it, a fact spanning a boundary is in neither chunk properly.
10–20% is standard.

**Keep metadata with every chunk** — source document, page, section, and the tenant id.
You need it to cite the answer, and you need the tenant id to scope the search.

## 7. Beyond plain semantic search

**Hybrid search** — combine embeddings with keyword search. Semantic search is poor at
exact identifiers; a search for "student ID 4471" or a specific policy number needs
lexical matching. Run both and fuse the rankings (reciprocal rank fusion is the usual
method).

This is the most reliable single improvement to a retrieval system, and it is why
`01-NLP_FUNDAMENTALS.md` is not obsolete.

**Reranking** — retrieve 50 candidates cheaply, then score them with a slower
cross-encoder that reads query and document together. Costly per item, much more accurate,
and applied to only 50 items it is affordable.

## 8. Uses beyond search

- **Deduplication** — find near-identical records. Real value for your messy school data.
- **Clustering** — cluster the embeddings, not the raw text (BERTopic).
- **Classification** — embed, then a logistic regression on the vectors. Often beats
  TF-IDF with far fewer features, and needs no fine-tuning.
- **Recommendation** — similar items by cosine.

## 9. The honest limits

- **Not interpretable.** You cannot explain *why* two things are similar. If you must
  justify a decision, this is a real cost (`03-classical-ml/06-INTERPRETABILITY.md`).
- **Model-bound.** Change the embedding model and every stored vector is invalid. **You
  must re-embed everything.** Record the model name and version alongside the vectors;
  this is a schema migration in disguise.
- **They encode bias.** Embeddings learn the associations in their training data,
  including harmful ones.
- **Weak on low-resource languages**, Kinyarwanda included.
- **Similar is not relevant.** Two documents about attendance are similar; only one may
  answer the question.

---

## Exercise 2

1. Embed 20 sentences, including near-synonyms and unrelated pairs. Build the cosine
   similarity matrix. Does it match your intuition?
2. Compare a multilingual model against an English-only one on French and Kinyarwanda
   text. **Quantify how much worse the English-only model is.**
3. Set up `pgvector` in a scratch Postgres. Store 10,000 chunks with tenant metadata.
   Query with tenant scoping and verify no cross-tenant result can be returned.
4. Compare exact search against HNSW on the same 10,000 vectors. **Measure recall@10 and
   latency for both.** What did approximation cost you?
5. Chunk one long document three ways — fixed, recursive with overlap, structure-aware.
   Ask the same five questions of each. Which chunking retrieved the right passage most
   often?
6. Build hybrid search: embeddings plus TF-IDF, fused. Find a query where each method
   alone fails and the combination succeeds.
7. Classify text by embedding it and fitting a logistic regression on the vectors.
   **Compare against your TF-IDF baseline** — score, cost, and latency.
8. Change your embedding model and re-run a query without re-embedding the store.
   Describe what happens, and why nothing errors.

Exercise 8 demonstrates a failure that has taken down real production systems.
