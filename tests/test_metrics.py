"""Tests for metrics computation."""

from __future__ import annotations

import numpy as np

from src.utils.metrics import combine_metrics, compute_split_metrics


def test_compute_split_metrics_perfect_prediction() -> None:
    y_true = np.array([0, 1, 2, 3, 0, 1])
    y_pred = y_true.copy()
    class_names = ["glioma", "meningioma", "notumor", "pituitary"]
    metrics = compute_split_metrics(y_true, y_pred, class_names, loss=0.01)
    assert metrics.accuracy == 1.0
    assert metrics.per_class_support["glioma"] == 2


def test_combine_metrics_weighted_and_macro_accuracy() -> None:
    class_names = ["glioma", "meningioma", "notumor", "pituitary"]
    y_train = np.array([0, 1, 2, 3])
    y_test = np.array([0, 1, 2, 3])
    train = compute_split_metrics(y_train, y_train, class_names, loss=0.1)
    test = compute_split_metrics(y_test, y_test, class_names, loss=0.2)

    combined = combine_metrics("xception", train, test, class_names, y_test, y_test)
    assert combined.weighted_accuracy_avg == 1.0
    assert combined.macro_accuracy_avg == 1.0


def test_combine_metrics_mixed_accuracy() -> None:
    class_names = ["a", "b"]
    y_train = np.array([0, 1, 0, 1])
    y_train_pred = np.array([0, 1, 0, 1])  # acc=1.0
    y_test = np.array([0, 1, 0, 1])
    y_test_pred = np.array([0, 0, 0, 1])  # acc=0.75

    train = compute_split_metrics(y_train, y_train_pred, class_names, loss=0.1)
    test = compute_split_metrics(y_test, y_test_pred, class_names, loss=0.2)
    combined = combine_metrics("m", train, test, class_names, y_test, y_test_pred)

    expected_weighted = (4 * 1.0 + 4 * 0.75) / 8
    expected_macro = (1.0 + 0.75) / 2
    assert abs(combined.weighted_accuracy_avg - expected_weighted) < 1e-6
    assert abs(combined.macro_accuracy_avg - expected_macro) < 1e-6
