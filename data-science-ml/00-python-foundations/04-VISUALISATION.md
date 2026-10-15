# 04 — Visualisation

**Week 4.** Charts that answer a question, not charts that decorate a notebook.

---

## Table of Contents

1. [The order that makes charts good](#the-order-that-makes-charts-good)
1. [Picking the form](#1-picking-the-form)
2. [The rules that are not negotiable](#2-the-rules-that-are-not-negotiable)
3. [Colour by job](#3-colour-by-job)
4. [matplotlib mechanics](#4-matplotlib-mechanics)
5. [seaborn for statistical plots](#5-seaborn-for-statistical-plots)
6. [Labelling — the part people skip](#6-labelling--the-part-people-skip)
7. [Charts for yourself vs charts for others](#7-charts-for-yourself-vs-charts-for-others)
8. [Exercise 4](#exercise-4)

---

## The order that makes charts good

Most people pick a chart type by habit and colours by taste. Do it in this order
instead, and the result is right by construction:

1. **What job does the data have?** Magnitude, identity, polarity, change over time,
   or a single headline number.
2. **The job picks the form.** Sometimes the answer is *not a chart* — one number in
   large type beats a bar chart with one bar.
3. **Colour comes last**, and is assigned by job, not by taste.

## 1. Picking the form

| The data's job | Form |
|---|---|
| Compare magnitudes across categories | Horizontal bar (sorted) |
| Change over time | Line |
| Composition of a whole | Stacked bar — **not** a pie, past 3 slices |
| Relationship between two numbers | Scatter |
| Distribution of one number | Histogram, or box/violin for comparing groups |
| Two categoricals crossed | Heatmap |
| One headline number | **No chart.** Big number + one line of context |

**Sort your bars.** An unsorted bar chart makes the reader do the ranking themselves.
Alphabetical order is almost never the order anyone cares about.

**Horizontal over vertical** whenever category labels are words. Rotated 45° labels
are a smell.

## 2. The rules that are not negotiable

**Never use two y-axes.** The single most common serious chart mistake. Two scales on
one plot let you manufacture any apparent correlation by choosing the ranges. If you
have two measures of different scale: two charts stacked, or index both to a common
base (both start at 100).

**Bar charts start at zero.** Always. Truncating the axis exaggerates differences and
is the classic way to mislead without technically lying. Line charts may truncate,
because they encode *change*, not magnitude.

**Colour follows the entity, not its rank.** If "Senior 3" is blue, it stays blue when
a filter removes Senior 2. Repainting survivors makes charts uncomparable between views.

**Never a pie chart past three slices.** People compare angles badly. Sorted bars beat
pie almost always.

## 3. Colour by job

Four jobs, one rule each:

| Job | Rule |
|---|---|
| **Categorical** (identity: S1, S2, S3) | A fixed hue order, assigned in sequence, never cycled |
| **Sequential** (magnitude: 0→100) | **One hue**, light → dark |
| **Diverging** (polarity: −5 → 0 → +5) | Two hues + a **neutral grey** midpoint |
| **Status** (good/warn/critical) | A reserved palette, never reused as "series 4" |

**Never a rainbow for sequential data.** Rainbow (`jet`) has no perceptual ordering —
readers cannot tell which end is "more" without checking the legend, and it invents
banding that is not in the data. Use `viridis`: perceptually uniform, and readable in
greyscale.

```python
plt.imshow(matrix, cmap='viridis')     # yes
plt.imshow(matrix, cmap='jet')         # no
```

**Colourblind safety is computable — compute it.** About 8% of men have some form of
red-green colour vision deficiency. Do not eyeball whether two colours are
distinguishable; the standard check is perceptual distance under simulated CVD.
matplotlib ships safe defaults:

```python
plt.style.use('tableau-colorblind10')
# or
import seaborn as sns
sns.set_palette('colorblind')
```

**Never encode by colour alone.** With ≥2 series a legend is always present; with ≤4,
also label the lines directly at their right-hand end. Add markers or line styles so
the chart survives being printed in greyscale.

## 4. matplotlib mechanics

Use the object-oriented API. The `plt.` state machine is fine in a notebook and a
liability anywhere else.

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(x, y, linewidth=2, label='Senior 3')
ax.set_xlabel('Term')
ax.set_ylabel('Average grade (%)')
ax.set_title('Average grade by term')
ax.legend()
fig.savefig('grades.png', dpi=150, bbox_inches='tight')
```

Small multiples — often better than one crowded chart:

```python
fig, axes = plt.subplots(2, 3, figsize=(15, 8), sharey=True)
for ax, (name, group) in zip(axes.flat, df.groupby('class')):
    ax.plot(group['term'], group['grade'])
    ax.set_title(name)
fig.tight_layout()
```

`sharey=True` matters: without a shared scale the panels are not comparable, and
readers will compare them anyway.

Make the data the loudest thing on the plot:

```python
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='y', alpha=0.3)          # recessive grid, one axis only
```

## 5. seaborn for statistical plots

```python
import seaborn as sns

sns.histplot(df, x='grade', bins=30)
sns.boxplot(df, x='class', y='grade')
sns.scatterplot(df, x='attendance', y='grade', hue='class')
sns.heatmap(df.corr(numeric_only=True), cmap='RdBu_r', center=0, annot=True)
```

Note `center=0` on the correlation heatmap — correlation is **diverging** data (−1 to
+1 through zero), so it needs a diverging map centred on the neutral point. Using a
sequential map there hides the sign, which is the whole point of a correlation.

`sns.pairplot(df)` is the fastest first look at a small dataset. It does not scale past
about eight columns.

## 6. Labelling — the part people skip

Every chart you would show anyone needs:

- A **title that states the finding**, not the variables. "Attendance drops 12% in
  Term 3" beats "Attendance by term".
- Axis labels **with units**. `Grade (%)` not `grade`.
- A source and a date if it leaves your machine.

**Do not label every point.** Label the ones that carry the message — the max, the
outlier, the one you are arguing about. A number on every point is noise.

## 7. Charts for yourself vs charts for others

Exploratory charts are for you: fast, ugly, dozens of them, no titles. That is correct —
do not polish them.

Explanatory charts are for someone else: one finding, fully labelled, colour chosen
deliberately. That is a different activity, and it takes ten times longer per chart.

**Knowing which one you are making is most of the skill.** The common failure is
spending an hour styling an exploratory chart, or shipping an unlabelled exploratory
chart to a headteacher.

---

## Exercise 4

Closed book, on your synthetic Imboni-shaped data:

1. Produce **five explanatory charts** a headteacher could read without you in the room.
   Each needs a finding-title, labelled axes with units, and a deliberate colour choice.
2. Make one chart wrong on purpose in each of these ways, then fix it and write one
   sentence on what the wrong version made a reader believe:
   - a bar chart with a truncated y-axis
   - a rainbow colourmap on sequential data
   - a two-y-axis chart
3. Take a correlation heatmap and show it with a sequential map, then a diverging map
   centred on zero. Which sign information did the first one destroy?
4. Convert one crowded multi-series line chart into small multiples with `sharey=True`.
   Which version answers the question faster?
5. Convert one of your charts to greyscale (`plt.imsave` after converting, or just
   print it). Is it still readable? If not, what secondary encoding would fix it?

Exercise 5 is the accessibility test in disguise. A chart that dies in greyscale also
dies for 8% of your readers in colour.
