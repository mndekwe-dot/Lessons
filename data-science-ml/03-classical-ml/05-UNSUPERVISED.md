# 05 — Unsupervised Learning

**Week 19.** No labels. Powerful, and far easier to fool yourself with than supervised
learning — because there is no test set to tell you that you are wrong.

---

## Table of Contents

1. [k-means](#1-k-means)
2. [Hierarchical clustering](#2-hierarchical-clustering)
3. [DBSCAN — density-based](#3-dbscan--density-based)
4. [PCA and dimensionality reduction](#4-pca-and-dimensionality-reduction)
5. [The honest problem with clustering](#5-the-honest-problem-with-clustering)
6. [Anomaly detection](#6-anomaly-detection)
7. [Association rules](#7-association-rules)
8. [Where unsupervised actually helps in your systems](#8-where-unsupervised-actually-helps-in-your-systems)
9. [Exercise 5](#exercise-5)

---

## 1. k-means

Partition data into k clusters, each point joining the nearest centroid.

```python
from sklearn.cluster import KMeans
km = KMeans(n_clusters=4, n_init=10, random_state=42).fit(X_scaled)
km.labels_, km.cluster_centers_
```

**Scaling is mandatory.** k-means minimises Euclidean distance, so a feature in
kilometres dominates one in metres purely by unit choice.

**What k-means assumes**, and therefore when it fails:

- Clusters are roughly **spherical** and similar in size
- Clusters are similar in **density**
- k is known in advance

It will happily split one elongated cluster in half and merge two nearby small ones. It
always returns k clusters, whether or not any structure exists.

**Choosing k:**

```python
# elbow: inertia against k — look for the bend
inertias = [KMeans(k, n_init=10).fit(X).inertia_ for k in range(2, 11)]

from sklearn.metrics import silhouette_score
silhouette_score(X, labels)     # -1 to 1; above ~0.5 is reasonable structure
```

The elbow is often ambiguous. Silhouette is more principled. **Both are secondary to
whether the clusters mean something to a domain expert** — see §5.

## 2. Hierarchical clustering

Builds a tree of nested clusters, so you choose the number *after* seeing the structure.

```python
from scipy.cluster.hierarchy import linkage, dendrogram
Z = linkage(X_scaled, method='ward')
dendrogram(Z)
```

The dendrogram is genuinely informative — it shows you whether there is nested structure
at all, which k-means cannot. Cost: O(n²) memory, so it stops being practical past a few
tens of thousands of rows.

`ward` linkage minimises within-cluster variance and is the sensible default.

## 3. DBSCAN — density-based

```python
from sklearn.cluster import DBSCAN
DBSCAN(eps=0.5, min_samples=5).fit(X_scaled)
```

Finds arbitrarily-shaped clusters and — importantly — **labels outliers as `-1` rather
than forcing them into a cluster.** k-means has no concept of "this point belongs
nowhere"; DBSCAN does.

The trade: `eps` is hard to choose and the result is very sensitive to it. Use a k-distance
plot to pick it. Struggles when clusters have different densities.

## 4. PCA and dimensionality reduction

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95)      # keep 95% of variance
X_reduced = pca.fit_transform(X_scaled)
pca.explained_variance_ratio_
```

Covered mathematically in `01-mathematics/01-LINEAR_ALGEBRA.md §6`. Practically:

- **Standardise first**, always
- **Fit on train only** — inside a pipeline
- Components are **not interpretable**; if you must explain a decision, PCA has cost you
  that

**t-SNE and UMAP** for visualisation:

```python
from sklearn.manifold import TSNE
X_2d = TSNE(n_components=2, perplexity=30).fit_transform(X)
```

A serious warning: **distances between clusters in a t-SNE plot are meaningless.** So
are cluster sizes. t-SNE preserves local neighbourhoods, not global geometry. People
routinely say "these two groups are far apart, so they are very different" — that
statement is unsupported by the method.

Never cluster *on* t-SNE output. Cluster in the real space; use t-SNE only to look.

## 5. The honest problem with clustering

**There is no test set.** No score tells you the clusters are right, because there is no
right.

Silhouette measures whether clusters are compact and separated — not whether they mean
anything. You can get an excellent silhouette on pure noise with the right k.

**The only real validation is a domain expert recognising the groups.**

```python
df.groupby('cluster')[features].mean().T     # profile every cluster
df.groupby('cluster').size()
```

Then describe each cluster in words and take it to someone who knows schools:

> Cluster 2: high attendance, low grades, mostly S4 boarders, mostly maths and physics.

If a headteacher says "yes, that's the students who show up but are struggling with
sciences" — you have found something. If they say "that's not a group we recognise", you
have found an artefact of your feature choices, however good the silhouette.

**Run it three times with different seeds and different k.** If the clusters change
completely, they were never there.

## 6. Anomaly detection

```python
from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.01, random_state=42).fit(X)
outliers = iso.predict(X) == -1
```

Isolation Forest works on the idea that anomalies are easier to isolate with random
splits — few splits needed means unusual. Fast and scales well.

`contamination` is your assumed anomaly rate, and it is a **decision**, not an estimate.
Set it from capacity: if someone can investigate 20 cases a week, set it to produce
about 20.

**When to prefer anomaly detection over classification:** when positives are very rare
(below ~0.1%), or when you have almost no labelled positives. With 30 positive examples,
no supervised technique saves you — that is a data problem, and unsupervised framing is
the honest response.

## 7. Association rules

```python
from mlxtend.frequent_patterns import apriori, association_rules
```

"Students who fail maths also tend to fail physics." Useful for discovery, and easy to
misread — a rule with high confidence and low lift is just telling you one item is
common. Always read **lift**, not confidence alone.

## 8. Where unsupervised actually helps in your systems

Honest applications for Imboni and Screening, and the ethics constraint on each:

- **Cluster classes, not students**, to guide resource allocation. Safe: no individual
  is scored.
- **Anomaly detection on data entry** — flag impossible or unusual *records* for review.
  Excellent use: it flags data, not children.
- **Anomaly detection on your own infrastructure** — unusual server load, unusual API
  patterns. No personal data at all.
- **Segment schools** (once multi-tenant) by usage pattern, for product decisions.

**Clustering students into groups that then affect how they are treated is a
consequential decision about a child**, made by an unvalidated method with no ground
truth. That needs the `07-enterprise/02` gate before it goes anywhere near production —
"the algorithm put them in the low group" is exactly the kind of unaccountable
decision-making that harms people.

---

## Exercise 5

1. Run k-means on **pure random noise** with k=4. Compute the silhouette score. Profile
   the clusters. Write one sentence on what this teaches you about clustering metrics.
2. Cluster a real dataset. Choose k by elbow and by silhouette. Do they agree?
3. Run the same clustering with five random seeds. How stable are the assignments? Use
   `adjusted_rand_score` to quantify it.
4. Profile your clusters and write a one-sentence description of each in domain language.
   Show them to someone who knows schools. What did they say?
5. Compare k-means and DBSCAN on data with a non-spherical cluster. Which found it?
6. Run PCA keeping 95% variance. How many components? Then run a supervised model on the
   reduced data versus the original. What did you lose, and what did you gain?
7. Make a t-SNE plot. Then deliberately misinterpret it — write the wrong conclusion
   about inter-cluster distance, and then the correction.
8. Run Isolation Forest on your data. Inspect the top 20 anomalies by hand. How many are
   real problems, and how many are just unusual-but-fine?

Exercise 1 is the important one. It is the fastest way to stop trusting a silhouette
score on its own.
