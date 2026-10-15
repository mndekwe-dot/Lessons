# 01 — NLP Fundamentals

**Week 26.** The classical methods, which are still the right answer surprisingly often.

Do not skip this to get to LLMs. A TF-IDF plus logistic regression baseline that runs in
two seconds and costs nothing beats a language model on plenty of real classification
tasks — and when it does not, you need it to prove the expensive option was worth it.

---

## Table of Contents

1. [Text is not tabular](#1-text-is-not-tabular)
2. [Tokenisation](#2-tokenisation)
3. [Normalisation](#3-normalisation)
4. [Bag of words and TF-IDF](#4-bag-of-words-and-tf-idf)
5. [The baseline you must always build](#5-the-baseline-you-must-always-build)
6. [Classical NLP tasks](#6-classical-nlp-tasks)
7. [Topic modelling](#7-topic-modelling)
8. [Exercise 1](#exercise-1)

---

## 1. Text is not tabular

A document has no fixed length, no columns, and its meaning depends on order. Every
technique here is a way of turning that into something a model can consume.

## 2. Tokenisation

Splitting text into units. Harder than it looks, and the choice matters.

```python
"Don't split-hairs, please."
# whitespace:  ["Don't", "split-hairs,", "please."]
# word:        ["Do", "n't", "split", "hairs", ",", "please", "."]
# subword:     ["Don", "'", "t", "split", "-", "hairs", ",", "please", "."]
```

**Subword tokenisation (BPE, WordPiece, SentencePiece) is what modern models use.** It
keeps common words whole and splits rare ones into pieces, so the vocabulary stays finite
and unknown words never break it.

**This matters directly for Kinyarwanda.** Kinyarwanda is agglutinative — meaning is built
by attaching prefixes and suffixes to a stem — and it is low-resource, so tokenisers
trained mostly on English fragment it badly. A word that is one token in English may be
six or eight in Kinyarwanda.

Two consequences, both practical:

- **Cost.** You pay per token. The same sentence in Kinyarwanda can cost several times
  what it costs in English.
- **Quality.** A word shattered into fragments has no coherent representation, so the
  model's grasp of it is weak regardless of how you prompt.

**Measure this before building anything multilingual.** Count tokens per word for a real
sample in all three of your languages. That number decides your budget and sets your
expectations.

## 3. Normalisation

```python
text = text.lower().strip()
```

Standard steps, and when each is wrong:

| Step | Skip it when |
|---|---|
| Lowercasing | Case carries meaning (named entities, acronyms) |
| Punctuation removal | Punctuation is signal (questions, negation) |
| Stopword removal | **Usually.** "not" is a stopword, and it inverts meaning |
| Stemming (`running` → `run`) | You need real words back out |
| Lemmatisation (`better` → `good`) | Speed matters — it is slower but correct |

**Removing stopwords is a habit worth breaking.** It was necessary when memory was
scarce. Modern methods handle them, and "not good" versus "good" is exactly the
distinction you cannot afford to lose in a screening questionnaire.

Unicode normalisation matters again here — see `02-data-wrangling/01-DATA_CLEANING.md §6`.
French accents and Kinyarwanda text can carry combining characters that look identical and
compare unequal.

## 4. Bag of words and TF-IDF

**Bag of words** counts occurrences and throws away order.

**TF-IDF** weights each term by how distinctive it is:

```
tfidf(t, d) = tf(t, d) × log(N / df(t))
```

A word appearing in every document has `log(N/N) = 0` — it carries no information. A word
appearing in three documents out of ten thousand is highly distinctive. This is
stopword removal done properly, by arithmetic rather than by a fixed list.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vec = TfidfVectorizer(
    ngram_range=(1, 2),      # unigrams and bigrams — bigrams catch "not good"
    min_df=2,                # ignore terms in fewer than 2 documents
    max_df=0.9,              # ignore terms in over 90% (de facto stopwords)
    sublinear_tf=True,       # log-scale counts; 10 mentions is not 10x one mention
)
X = vec.fit_transform(train_texts)
```

**`ngram_range=(1, 2)` is the single highest-value setting here.** Unigrams alone cannot
represent negation. Bigrams capture "not good", "no support", "never attends".

TF-IDF produces a sparse, very high-dimensional matrix. **Linear models handle this well;
trees do not** (`03-classical-ml/02-TREES_AND_ENSEMBLES.md §7`).

## 5. The baseline you must always build

```python
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

baseline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=2, sublinear_tf=True)),
    ('clf', LogisticRegression(max_iter=1000, class_weight='balanced')),
])
baseline.fit(train_texts, y_train)
```

Seconds to train, milliseconds to predict, no GPU, no API bill, fully interpretable —
you can read the coefficients and see exactly which words drive a decision.

**Every LLM approach in this folder must beat this, measurably, before you ship it.**
State the comparison including cost and latency, not accuracy alone.

## 6. Classical NLP tasks

```python
import spacy
nlp = spacy.load('en_core_web_sm')
doc = nlp("Aline Uwimana enrolled at Green Hills Academy in January 2026.")

for ent in doc.ents:
    print(ent.text, ent.label_)     # PERSON, ORG, DATE
```

**Named entity recognition** is genuinely useful to you — extracting names, dates and
organisations from scanned forms or free-text notes.

**A caution:** spaCy's models are trained on Western text. They will miss Rwandan names
and place names at a much higher rate than the reported accuracy suggests. **Measure on
your own data**, not on the model card's benchmark. This is the same aggregate-hides-the-
subgroup problem as `03-classical-ml/03-MODEL_EVALUATION.md §8`, in a new place.

**Sentiment analysis** with an off-the-shelf lexicon is usually poor on domain text.
"The student was quiet today" is not negative sentiment; in a matron's notes it might be
important. Train on your own labels or do not do it.

## 7. Topic modelling

```python
from sklearn.decomposition import LatentDirichletAllocation
lda = LatentDirichletAllocation(n_components=10, random_state=42)
```

Same honesty problem as clustering (`03-classical-ml/05-UNSUPERVISED.md §5`): there is no
ground truth, the number of topics is a guess, and you can always produce topics from
noise. **Validation is a domain expert recognising them.** Modern practice increasingly
uses embedding-based clustering (BERTopic) instead, which is the next file.

---

## Exercise 1

1. Take real text in English, French and Kinyarwanda. Tokenise with a multilingual
   tokeniser. **Report tokens-per-word for each language.** What does the ratio imply for
   your API costs and for model quality on Kinyarwanda?
2. Build the TF-IDF + logistic regression baseline on a text classification task. Record
   accuracy, training time, and inference latency per document.
3. Compare `ngram_range=(1,1)` against `(1,2)`. Construct three examples where negation
   makes the difference.
4. Remove stopwords and measure the effect on a task where negation matters. Was it an
   improvement?
5. Inspect your logistic regression's largest positive and negative coefficients. Do the
   words make sense? Any that reveal a leak or a bias?
6. Run spaCy NER over text containing Rwandan names and places. **Count what it misses.**
   Compare against the model's published accuracy.
7. Save your baseline's score, cost and latency somewhere permanent. Everything in the
   next five files gets compared against it.

Exercise 7 is the point of this file.
