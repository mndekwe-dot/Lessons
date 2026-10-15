# 07 — Time Series

**Week 19.** Data where order matters. Nearly every dataset you personally own is
temporal — Imboni attendance, Screening responses, Computer_Track usage — and almost
every standard ML habit is wrong for it.

This is the module where `train_test_split(shuffle=True)` silently destroys your
result and still reports 94% accuracy.

---

## Table of Contents

1. [What makes time series different](#1-what-makes-time-series-different)
2. [The split, and the mistake everyone makes](#2-the-split-and-the-mistake-everyone-makes)
3. [Decomposition](#3-decomposition)
4. [Stationarity](#4-stationarity)
5. [Autocorrelation](#5-autocorrelation)
6. [Baselines you must beat](#6-baselines-you-must-beat)
7. [Models, in the order to try them](#7-models-in-the-order-to-try-them)
8. [Feature engineering with lags](#8-feature-engineering-with-lags)
9. [Evaluation](#9-evaluation)
10. [Drift](#10-drift)
11. [The checklist](#11-the-checklist)
12. [Exercise 7](#exercise-7)

---

## 1. What makes time series different

Standard supervised learning assumes rows are independent and identically distributed.
Time series violates both:

- **Observations are correlated with their neighbours.** Today's attendance resembles
  yesterday's.
- **The distribution changes.** Term time differs from holidays; 2026 differs from 2024.
- **Order carries information** that shuffling destroys.
- **The future must never inform the past.** This is the one that breaks people.

## 2. The split, and the mistake everyone makes

```python
train_test_split(X, y, test_size=0.2)        # WRONG. shuffle=True by default
```

This puts future observations in your training set. The model learns from Thursday to
predict Wednesday, scores beautifully, and collapses in production. You have measured
interpolation and reported it as forecasting.

Split chronologically:

```python
cutoff = "2026-06-30"
train = df[df.date <= cutoff]
test  = df[df.date >  cutoff]
```

For cross-validation, expand the window forward:

```python
from sklearn.model_selection import TimeSeriesSplit

for train_idx, test_idx in TimeSeriesSplit(n_splits=5).split(X):
    ...     # train always precedes test, in every fold
```

Add a **gap** between train and test if your prediction horizon is more than one step.
Predicting 7 days ahead while training on data up to the day before leaks information
you would not have.

## 3. Decomposition

Most series are the sum (or product) of three parts:

- **Trend** — the long-run direction
- **Seasonality** — repeating cycles: weekly, termly, annual
- **Residual** — what is left

```python
from statsmodels.tsa.seasonal import STL
res = STL(series, period=7).fit()
res.plot()
```

Always do this first. It is five lines and it tells you what you are dealing with.
Imboni attendance will show a strong weekly cycle (Monday and Friday differ from
Wednesday) and a termly one. If you model without knowing that, every residual plot
will confuse you.

**Multiple seasonalities are normal** — day-of-week *and* term-of-year together. Simple
models handle one; you need Fourier terms or a model like Prophet for several.

## 4. Stationarity

A stationary series has constant mean and variance over time. Classical models assume
it; most real series are not.

```python
from statsmodels.tsa.stattools import adfuller
stat, pval, *_ = adfuller(series)      # p < 0.05 suggests stationary
```

To get there: **differencing** (`series.diff()`) removes trend; seasonal differencing
(`series.diff(7)`) removes a weekly cycle; a log transform stabilises variance when
the series grows multiplicatively.

Remember to invert the transform when you report. Forecasting differences and
presenting them as levels is a real and embarrassing bug.

## 5. Autocorrelation

How much does the series resemble itself at a lag?

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
plot_acf(series, lags=40)      # ACF  - total correlation at each lag
plot_pacf(series, lags=40)     # PACF - direct correlation, controlling for shorter lags
```

A spike at lag 7 in attendance data means weekly structure. The ACF/PACF pair is also
how the classical ARIMA orders are chosen, and more usefully for you, it tells you
**which lag features to build**.

## 6. Baselines you must beat

Every forecast must be compared against trivial alternatives, and a surprising number
of real models never beat them:

```python
naive          = y.shift(1)        # today = yesterday
seasonal_naive = y.shift(7)        # today = same day last week
drift          = y.shift(1) + (y.iloc[-1] - y.iloc[0]) / (len(y) - 1)
mean           = y.expanding().mean().shift(1)
```

**Seasonal naive is a strong baseline** for anything with a weekly cycle, and it is
the one to beat for Imboni attendance. A gradient-boosted model that loses to
`y.shift(7)` is not a result — and reporting it as one is the mistake the curriculum's
rule 2 exists to prevent.

## 7. Models, in the order to try them

1. **Seasonal naive** — the baseline
2. **Exponential smoothing (ETS / Holt-Winters)** — trend plus seasonality, few
   parameters, very hard to beat on short series
3. **SARIMA** — classical, powerful, needs stationarity and order selection
4. **Prophet** — handles multiple seasonalities and holidays, tolerant of missing data,
   good defaults. Well suited to school calendars.
5. **Gradient boosting with lag features** — often the best option when you have
   covariates (weather, term dates, events). Usually what wins in practice.
6. **Deep learning (LSTM, temporal fusion transformers)** — needs a lot of data and
   rarely wins on a few hundred points. See `../04-deep-learning/06-WHEN_NOT_TO_USE_DL.md`.

For a few hundred observations — which is what you have — stop at 4 or 5. Deep
learning on 300 points is a way of overfitting with extra steps.

## 8. Feature engineering with lags

For the boosting approach, build features that respect time:

```python
df["lag_1"]      = df.y.shift(1)
df["lag_7"]      = df.y.shift(7)
df["roll_7"]     = df.y.shift(1).rolling(7).mean()      # note the shift BEFORE rolling
df["dow"]        = df.date.dt.dayofweek
df["is_termtime"] = df.date.isin(term_dates)
```

The `.shift(1)` before `.rolling()` is not optional. Without it the rolling window
includes the current value, which is the target. That is leakage, it will look
excellent in validation, and it will fail completely in production.

This is the single most common bug in applied time-series work. See
`04-LEAKAGE.md` in this module for the general case.

## 9. Evaluation

```python
MAE  = (y_true - y_pred).abs().mean()                       # same units, interpretable
RMSE = ((y_true - y_pred) ** 2).mean() ** 0.5               # punishes large errors
MAPE = ((y_true - y_pred).abs() / y_true).mean() * 100      # percentage; explodes near zero
```

MAPE is popular with stakeholders and dangerous with small denominators — one day of
near-zero attendance produces an enormous number. Prefer MAE, or MASE (error relative
to the seasonal naive baseline), which has the useful property that **below 1 means you
beat the baseline**.

Evaluate with **backtesting**: repeatedly train up to time *t*, predict *t+h*, roll
forward. A single train/test split on a time series is one sample of one period.

## 10. Drift

Models decay because the world moves. School policy changes, a new catchment opens,
a pandemic happens.

- Monitor prediction error over time, not just at training
- Compare the recent input distribution against training
- Retrain on a schedule, and have a trigger for retraining early
- Keep the baseline running alongside — when your model stops beating seasonal naive,
  that is the alarm

Covered operationally in `../06-mlops/03-MONITORING_AND_DRIFT.md`.

## 11. The checklist

- [ ] Chronological split; `shuffle=False` everywhere
- [ ] `TimeSeriesSplit` for cross-validation, with a gap if forecasting ahead
- [ ] STL decomposition inspected before modelling
- [ ] Seasonal naive baseline computed and reported
- [ ] All rolling features shifted before the window
- [ ] Backtested over multiple origins, not one split
- [ ] Error reported in interpretable units, plus MASE against the baseline
- [ ] Drift monitoring planned

---

## Exercise 7

1. Take Imboni's daily attendance. Run STL with `period=7`. Describe the trend,
   the weekly pattern, and anything the residual reveals.

2. Compute all four baselines from §6 on a held-out final month. Report MAE for each.
   This is the number every later model must beat.

3. Deliberately build the leaky feature: a rolling mean without the shift. Report the
   validation score. Then fix it and report again. Write down the size of the lie.

4. Fit ETS and Prophet. Backtest both over at least five origins. Does either beat
   seasonal naive? Report honestly if not.

5. Build lag features and fit gradient boosting. Compare against (4). If it wins, say
   which features carried it; if it loses, say why.

6. Take one model from above and simulate drift: train on the first half of the year,
   evaluate month by month across the second. Plot error over time and identify when
   you would have retrained.

Exercise 3 is the one that will make you distrust every impressive time-series result
you see from now on, including your own.
