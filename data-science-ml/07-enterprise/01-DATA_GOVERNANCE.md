# 01 — Data Governance

**Week 35.** Who may see what, for how long, and how you prove it.

Unglamorous, and it is what makes the difference between a system a school can adopt and a
prototype they cannot.

---

## Table of Contents

1. [Know what you hold](#1-know-what-you-hold)
2. [The legal frame](#2-the-legal-frame)
3. [Lineage](#3-lineage)
4. [Retention](#4-retention)
5. [Access control](#5-access-control)
6. [Auditability](#6-auditability)
7. [Cataloguing](#7-cataloguing)
8. [A data protection impact assessment](#8-a-data-protection-impact-assessment)
9. [Exercise 1](#exercise-1)

---

## 1. Know what you hold

You cannot govern data you have not inventoried.

| Data | Sensitivity | Where |
|---|---|---|
| Names, DOB, contact | Personal | Imboni `students`, `authentication_user` |
| Grades, attendance | Personal, **children's** | Imboni `results`, `attendance` |
| Discipline records | Personal, sensitive | Imboni `behavior` |
| Health / sick bay | **Special category** | Imboni `matron` |
| Mental health responses | **Special category** | Screening |
| Model predictions | **Derived personal data** | Wherever you write scores |

**That last row is the one people forget.** A risk score about a named child is personal
data you created. It is subject to the same rules as the data it was derived from —
retention, access, correction, and the right to know it exists.

## 2. The legal frame

Rwanda's **Law No. 058/2021** on the protection of personal data and privacy is the one
that binds you. The concepts you need:

- **Controller** — decides why and how data is processed. The school, usually. Possibly you
  jointly, for a SaaS product — **this needs to be written down in your contract**, not
  assumed.
- **Processor** — processes on the controller's instructions. That is you, for Imboni.
- **Lawful basis** — you need one. Consent, contract, legal obligation, or legitimate
  interest.
- **Purpose limitation** — data collected to run a school may not be repurposed for
  something else without a fresh basis.

**Purpose limitation is the clause that governs your ML work.** Attendance was collected to
run a school. Using it to train a dropout-prediction model is a *new purpose*. That is a
legal question, answered before any technical one.

**Children's data attracts additional protection** in essentially every framework. Consent
generally comes from a parent or guardian, and the bar for "necessary" is higher.

**This is not legal advice.** For a real deployment, get a Rwandan data protection lawyer
to review it. What this file gives you is enough to ask the right questions and to know
when you need one.

## 3. Lineage

For any prediction, you must be able to trace: which model → which training run → which
data → which source records.

```python
class RiskScore(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    score = models.FloatField()
    model_version = models.CharField(max_length=50)
    training_data_hash = models.CharField(max_length=64)
    feature_snapshot = models.JSONField()      # what the model actually saw
    scored_at = models.DateTimeField(auto_now_add=True)
```

**`on_delete=models.CASCADE` is doing real work here.** When a student's record is deleted
under a retention policy or an erasure request, their derived scores go with it. If those
scores lived in a separate store — a vector database, a CSV, a dashboard cache — **you
would not have deleted their data**, and you would probably not realise.

Keep everything derived from personal data inside the same database, behind the same
foreign key, or track it explicitly.

## 4. Retention

Data kept forever is a liability that grows.

```python
RETENTION = {
    'attendance': timedelta(days=7*365),      # statutory record
    'risk_scores': timedelta(days=365),       # derived — short
    'prediction_logs': timedelta(days=90),    # operational
    'model_artefacts': timedelta(days=3*365), # for auditability
}
```

**Derived data should have a shorter retention than its source.** A risk score from three
years ago has no operational use and every legal risk.

**Retention must be enforced, not documented.** A policy nobody automated is not a policy.

```python
@shared_task
def enforce_retention():
    for table, period in RETENTION.items():
        deleted = purge(table, older_than=timezone.now() - period)
        AuditLog.objects.create(action='retention_purge', table=table, count=deleted)
```

Imboni already has `erase_user_data` — extend it to cover model artefacts and prediction
logs, or the erasure is incomplete.

## 5. Access control

Two questions, and both must be answered:

**Who can see the data?** Role-based, already built into Imboni. Extend it to predictions:
a teacher sees their own class's scores, a DOS sees the school's, nobody sees another
school's.

**Who can see the model?** Less obvious and more subtle. A model trained on personal data
**can leak it** — memorisation is real, particularly for neural networks on small datasets.
Treat model artefacts as sensitive: do not commit them, do not put them in a public bucket,
control who can download them.

```python
class RiskScoreView(APIView):
    def get(self, request, student_id):
        student = get_object_or_404(Student, pk=student_id)
        if not request.user.can_view_student(student):
            raise PermissionDenied()
        AuditLog.objects.create(user=request.user, action='view_risk_score',
                                object_id=student_id)
        ...
```

**Log every access to a prediction.** "Who has seen the risk score for my child?" is a
question a parent is entitled to ask.

## 6. Auditability

Record, for every consequential event: who, what, when, why, and what changed.

- Prediction made → student, model version, features, score
- Prediction viewed → user, timestamp
- Prediction acted on → what the staff member did
- Model promoted → who approved it, on what evidence
- Data exported → who, what, where to

**"Prediction acted on" is the one that matters most**, and the one nobody logs. It tells
you whether the model is used at all, whether it is trusted, and — eventually — whether it
works. It is also your only defence when someone claims a decision was made by an
algorithm: you can show what a human actually did.

## 7. Cataloguing

Once there is more than one dataset, write down what each one is:

```yaml
dataset: student_attendance
owner: DOS office
source: Imboni attendance module
grain: one row per student per school day
pii: student_id (pseudonymous), no direct identifiers
lawful_basis: contract (school administration)
ml_use: permitted for aggregate reporting; individual prediction REQUIRES review
retention: 7 years
known_issues: |
  Pre-2026 data recorded on paper, entered in batches — timestamps unreliable.
  Attendance >100% appears in 23 rows (data entry).
```

**`known_issues` is the most valuable field.** It is where the knowledge from
`02-data-wrangling/02-EDA.md` goes so it is not rediscovered by the next person, or by you
in a year.

`ml_use` makes the permission explicit at the dataset level, which is where it belongs.

## 8. A data protection impact assessment

For high-risk processing — and profiling children is high-risk — write one before you
build:

1. **What are you doing, and why?**
2. **Is it necessary and proportionate?** Could a simpler method achieve it?
3. **What are the risks to people?** Not to you — to them.
4. **How are they mitigated?**
5. **Who is accountable, and how does someone contest a decision?**

**Question 2 is the one that will stop projects, and should.** If a rule flagging students
below 70% attendance achieves most of the benefit, then a model profiling every child is
neither necessary nor proportionate — and `04-deep-learning/06-WHEN_NOT_TO_USE_DL.md §5`
told you to try the rule first anyway.

---

## Exercise 1

1. Inventory every table in Imboni and Screening holding personal data. Classify each by
   sensitivity. **How many did you not expect?**
2. For your dropout model, write down: lawful basis, controller, processor, and whether
   the purpose differs from collection.
3. Trace one prediction end to end — score → model version → training run → data snapshot →
   source rows. Where does the chain break?
4. Write the retention policy. Implement the purge task. Prove it deletes and logs.
5. Delete a test student. **Verify every derived artefact went with them** — scores, logs,
   caches, exports. What survived?
6. Add access logging to prediction views. Then answer, from the log alone: who has viewed
   this student's score?
7. Write a catalogue entry for one real dataset, including `known_issues` and `ml_use`.
8. Write the DPIA for the dropout model. **Answer question 2 honestly** — and be prepared
   for the answer to be no.

Exercise 5 finds something in almost every system.
