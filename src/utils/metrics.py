"""Metrics computation and reporting utilities."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support,
)


@dataclass
class SplitMetrics:
    """Metrics for a single data split (train or test)."""

    loss: float
    accuracy: float
    per_class_precision: dict[str, float]
    per_class_recall: dict[str, float]
    per_class_f1: dict[str, float]
    per_class_support: dict[str, int]
    macro_avg: dict[str, float]
    weighted_avg: dict[str, float]
    per_class_accuracy: dict[str, float]
    confusion_matrix: list[list[int]]


@dataclass
class CombinedMetrics:
    """Train + test metrics with paper-style combined accuracy averages."""

    model_name: str
    train: SplitMetrics
    test: SplitMetrics
    # Paper reports "weighted accuracy avg" and "macro accuracy avg".
    # AMBIGUITY NOTE: exact formula not explicit in paper. We implement:
    #   weighted_accuracy_avg = (n_train*acc_train + n_test*acc_test) / (n_train + n_test)
    #   macro_accuracy_avg = (acc_train + acc_test) / 2
    # Per-class accuracy averages are also exported for reference.
    weighted_accuracy_avg: float
    macro_accuracy_avg: float
    weighted_per_class_accuracy_avg: float
    macro_per_class_accuracy_avg: float
    classification_report_text: str


def compute_split_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: list[str],
    loss: float,
) -> SplitMetrics:
    """Compute full metrics for one split."""
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, labels=list(range(len(class_names))), zero_division=0
    )
    cm = confusion_matrix(y_true, y_pred, labels=list(range(len(class_names))))

    per_class_accuracy: dict[str, float] = {}
    for idx, name in enumerate(class_names):
        class_total = cm[idx].sum()
        per_class_accuracy[name] = float(cm[idx, idx] / class_total) if class_total else 0.0

    report = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        zero_division=0,
        output_dict=True,
    )

    return SplitMetrics(
        loss=float(loss),
        accuracy=float(accuracy_score(y_true, y_pred)),
        per_class_precision={name: float(precision[i]) for i, name in enumerate(class_names)},
        per_class_recall={name: float(recall[i]) for i, name in enumerate(class_names)},
        per_class_f1={name: float(f1[i]) for i, name in enumerate(class_names)},
        per_class_support={name: int(support[i]) for i, name in enumerate(class_names)},
        macro_avg={
            "precision": float(report["macro avg"]["precision"]),
            "recall": float(report["macro avg"]["recall"]),
            "f1-score": float(report["macro avg"]["f1-score"]),
        },
        weighted_avg={
            "precision": float(report["weighted avg"]["precision"]),
            "recall": float(report["weighted avg"]["recall"]),
            "f1-score": float(report["weighted avg"]["f1-score"]),
        },
        per_class_accuracy=per_class_accuracy,
        confusion_matrix=cm.tolist(),
    )


def combine_metrics(
    model_name: str,
    train_metrics: SplitMetrics,
    test_metrics: SplitMetrics,
    class_names: list[str],
    y_true_test: np.ndarray,
    y_pred_test: np.ndarray,
) -> CombinedMetrics:
    """Combine train/test metrics with paper-style accuracy averages."""
    n_train = sum(train_metrics.per_class_support.values())
    n_test = sum(test_metrics.per_class_support.values())

    weighted_accuracy_avg = (
        n_train * train_metrics.accuracy + n_test * test_metrics.accuracy
    ) / max(n_train + n_test, 1)
    macro_accuracy_avg = (train_metrics.accuracy + test_metrics.accuracy) / 2.0

    train_pc = np.array(list(train_metrics.per_class_accuracy.values()))
    test_pc = np.array(list(test_metrics.per_class_accuracy.values()))
    macro_per_class_accuracy_avg = float(np.mean((train_pc + test_pc) / 2.0))

    weights = np.array([train_metrics.per_class_support[c] + test_metrics.per_class_support[c] for c in class_names])
    combined_pc = (train_pc * np.array(list(train_metrics.per_class_support.values())) +
                   test_pc * np.array(list(test_metrics.per_class_support.values()))) / np.maximum(weights, 1)
    weighted_per_class_accuracy_avg = float(np.average(combined_pc, weights=weights))

    report_text = classification_report(
        y_true_test,
        y_pred_test,
        target_names=class_names,
        zero_division=0,
    )

    return CombinedMetrics(
        model_name=model_name,
        train=train_metrics,
        test=test_metrics,
        weighted_accuracy_avg=weighted_accuracy_avg,
        macro_accuracy_avg=macro_accuracy_avg,
        weighted_per_class_accuracy_avg=weighted_per_class_accuracy_avg,
        macro_per_class_accuracy_avg=macro_per_class_accuracy_avg,
        classification_report_text=report_text,
    )


def metrics_to_dict(metrics: CombinedMetrics) -> dict[str, Any]:
    """Serialize CombinedMetrics to JSON-compatible dict."""
    return asdict(metrics)
