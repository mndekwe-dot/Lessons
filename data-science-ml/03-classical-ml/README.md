# Classical ML

**Weeks 14-19 of `../CURRICULUM.md`.** Read in numbered order.

Most production ML is this section. Gradient-boosted trees win most real business problems on tabular data - which is what your data is. Deep learning is later and, for your problems, usually worse.

| # | File | Core? | What it gives you |
|---|---|---|---|
| 01 | [01-SUPERVISED_LEARNING.md](01-SUPERVISED_LEARNING.md) | **core** | Linear and logistic regression, regularisation, the bias-variance trade-off. |
| 02 | [02-TREES_AND_ENSEMBLES.md](02-TREES_AND_ENSEMBLES.md) | **core** | Decision trees, random forests, then XGBoost/LightGBM - the workhorse. |
| 03 | [03-MODEL_EVALUATION.md](03-MODEL_EVALUATION.md) | **core** | Train/val/test, cross-validation, metrics, calibration, thresholds. As important as the models. |
| 04 | [04-LEAKAGE.md](04-LEAKAGE.md) | **core** | The number one reason a 0.94 notebook fails in production. Its own file because it deserves one. |
| 05 | [05-UNSUPERVISED.md](05-UNSUPERVISED.md) | **core** | k-means, hierarchical clustering, PCA, and when clustering tells you nothing. |
| 06 | [06-INTERPRETABILITY.md](06-INTERPRETABILITY.md) | *extra* | SHAP, permutation importance, partial dependence. Needed when you must explain a decision. |
| 07 | [07-TIME_SERIES.md](07-TIME_SERIES.md) | **core** | Data where order matters. Chronological splits, decomposition, lag features, and the baselines most models fail to beat. |

File 07 is core for you specifically: **almost every dataset you own is temporal** —
Imboni attendance, Screening responses, Computer_Track usage. It is also where the
habits from files 03 and 04 break, because `train_test_split(shuffle=True)` quietly
puts the future in your training set and still reports 94%.

Full plan, build tasks and pass criteria: [`../CURRICULUM.md`](../CURRICULUM.md)
