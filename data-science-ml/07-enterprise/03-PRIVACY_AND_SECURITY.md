# 03 — Privacy and Security

**Week 37.** Protecting the data, and protecting the model from being turned against you.

---

## Table of Contents

1. [Anonymisation is harder than dropping the name column](#1-anonymisation-is-harder-than-dropping-the-name-column)
2. [Differential privacy, briefly](#2-differential-privacy-briefly)
3. [Models leak their training data](#3-models-leak-their-training-data)
4. [Sending data to third parties](#4-sending-data-to-third-parties)
5. [Adversarial input](#5-adversarial-input)
6. [Model supply chain](#6-model-supply-chain)
7. [Prediction endpoints are attack surface](#7-prediction-endpoints-are-attack-surface)
8. [The checklist](#8-the-checklist)
9. [Exercise 3](#exercise-3)

---

## 1. Anonymisation is harder than dropping the name column

```python
df = df.drop(columns=['name', 'national_id', 'phone'])     # NOT anonymous
```

**Re-identification works through combinations.** "The only girl in S6 boarding with three
siblings from Musanze" identifies one child without a single identifier present. Classic
research showed most people are uniquely identifiable from postcode, birth date and sex
alone.

Techniques, weakest to strongest:

| | What it does | Weakness |
|---|---|---|
| **Pseudonymisation** | Replace ids with tokens | Reversible with the mapping. **Still personal data.** |
| **Generalisation** | Age → age band | Reduces utility |
| **k-anonymity** | Every record matches ≥k others | Fails if the sensitive value is uniform in a group |
| **l-diversity** | Each group has ≥l distinct sensitive values | Better; still attackable |
| **Differential privacy** | Calibrated noise, provable guarantee | Real utility cost |

**Pseudonymisation is not anonymisation** — a legally important distinction. If you keep
the mapping, it is still personal data and still fully regulated.

```python
def k_anonymity_check(df, quasi_identifiers, k=5):
    sizes = df.groupby(quasi_identifiers).size()
    violations = sizes[sizes < k]
    return len(violations), violations.head()
```

Run this before sharing any "anonymised" extract. It usually fails the first time.

## 2. Differential privacy, briefly

Add calibrated noise so no individual's presence changes the output much.

```python
def private_count(true_count, epsilon=1.0):
    return true_count + np.random.laplace(0, 1 / epsilon)
```

Lower ε means more privacy and more noise. **The honest trade:** for aggregate statistics
over a school it is often practical; for training a model on a few thousand students the
utility cost is usually too high to be worth it. Know it exists, use it for published
aggregates, do not reach for it as a default.

## 3. Models leak their training data

This is the part people do not expect.

**Membership inference** — an attacker determines whether a specific person was in the
training set. If your model was trained on students referred for counselling, confirming
membership *is* the disclosure.

**Model inversion** — reconstructing feature values from model outputs.

**Memorisation** — neural networks, especially on small datasets, can reproduce training
examples verbatim. Language models are the notorious case.

**Defences:** do not expose raw probabilities where a coarse band would do; rate-limit
prediction endpoints (an attacker needs many queries); prefer simpler models, which
memorise less; and treat model artefacts as sensitive
(`01-DATA_GOVERNANCE.md §5`).

**The practical rule for you:** a model trained on children's records is itself sensitive
data. Do not commit it, do not put it in a public bucket, do not ship it to a client
device.

## 4. Sending data to third parties

Every LLM API call sends your data to someone else's servers.

Before any student or health text leaves your infrastructure:

- **Is there a lawful basis for this specific disclosure?** Not for processing generally —
  for this transfer.
- **What is the provider's retention?** Do they train on it? Get it in writing.
- **Where is it processed?** Cross-border transfer has its own rules.
- **Is there a processing agreement?**
- **Could you do it locally instead?** A local embedding model never leaves the building.

**Minimise before sending:**

```python
def redact(text: str) -> str:
    for student in students_in_scope:
        text = text.replace(student.full_name, f'[STUDENT_{student.pseudo_id}]')
    return text
```

Imperfect — a nickname or a misspelling escapes it — but "we redact identifiers before
transmission" is a materially different position from "we send everything", both
practically and legally.

**Where the task allows, run locally.** Sentence-transformers embeddings on your own server
mean the text never leaves. That is often the whole answer.

## 5. Adversarial input

Someone can craft input that produces a chosen output.

For a school system the realistic version is not exotic maths — it is **gaming**. If people
learn that attendance drives the risk score, attendance gets recorded differently. The
measure stops measuring, which is Goodhart's law with a model attached.

**Defences:** do not publish exact feature weights; use several correlated features so one
is not decisive; monitor for distribution shifts that look like manipulation rather than
drift (`06-mlops/03`); and keep a human in the loop who knows the students.

## 6. Model supply chain

```python
model = joblib.load('downloaded_model.pkl')      # arbitrary code execution
torch.load('checkpoint.pt')                       # same
torch.load('checkpoint.pt', weights_only=True)    # safer
```

**Pickle executes code on load.** A model file from an untrusted source is untrusted code.

Rules: only load artefacts you or a verified source produced; checksum them; prefer safer
formats (`safetensors`, ONNX); and pin and audit your dependencies — Imboni already has
`pip-audit` and `npm audit` gates in CI, and they cover this too.

## 7. Prediction endpoints are attack surface

Everything from `engineering-curriculum` Ch 16 applies, plus:

- **Rate limit per user and per tenant** — also the defence against membership inference
- **Cap input size** before inference
- **Never return more than needed** — a risk band beats a raw probability where a band
  suffices
- **Scope every request to the tenant, server-side**, never from a client-supplied value
- **Audit every access** (`01-DATA_GOVERNANCE.md §6`)

## 8. The checklist

Before any model touching personal data goes live:

- [ ] Lawful basis documented for the ML purpose specifically
- [ ] k-anonymity checked on any extract that leaves the system
- [ ] Model artefacts treated as sensitive; not in git, not public
- [ ] Third-party transfers documented, minimised, agreement in place
- [ ] Prediction endpoints rate-limited and tenant-scoped
- [ ] Access audited
- [ ] Retention enforced for predictions **and** logs
- [ ] Erasure verified to reach derived data
- [ ] Dependencies pinned and scanned
- [ ] A test proving cross-tenant access fails

**The last line is the only one that is a control rather than an intention.** Write the
test.

---

## Exercise 3

1. Take a "de-identified" extract with names dropped. **Re-identify at least one person**
   using quasi-identifiers. Then run the k-anonymity check.
2. Generalise until k=5 holds. Measure what that cost you in model performance.
3. Implement `private_count` with Laplace noise. Plot utility against ε.
4. Train a model on a small dataset, then attempt membership inference: can you tell
   training rows from held-out rows using the confidence scores?
5. Write your redaction function. Test it against nicknames, misspellings and partial
   names. **What escaped?**
6. Compare a local embedding model against a hosted one on the same task — quality, cost,
   and what leaves your infrastructure.
7. Write the two tests: cross-tenant prediction access fails, and a teacher cannot score a
   class they do not teach.
8. Work the whole §8 checklist against a real model. **Report honestly how many you fail
   today.**

Exercise 1 is the one that changes how you think about "anonymised".
