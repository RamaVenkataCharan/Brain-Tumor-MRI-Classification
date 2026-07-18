"""Visualization utilities for confusion matrices and model comparison charts."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


def plot_confusion_matrix(
    cm: np.ndarray | list[list[int]],
    class_names: list[str],
    output_path: str | Path,
    title: str = "Confusion Matrix",
) -> None:
    """Save a confusion matrix heatmap PNG."""
    cm_array = np.array(cm)
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm_array,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
    )
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()


def plot_comparison_bar_chart(
    comparison_df: pd.DataFrame,
    output_path: str | Path,
    metric_column: str = "weighted_accuracy_avg",
    title: str = "Model Comparison (Weighted Accuracy Avg)",
) -> None:
    """Save a bar chart comparing models (mirrors paper Figure 2 style)."""
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    sorted_df = comparison_df.sort_values(metric_column, ascending=False)
    plt.figure(figsize=(10, 6))
    sns.barplot(data=sorted_df, x="model_name", y=metric_column, palette="viridis")
    plt.xticks(rotation=30, ha="right")
    plt.ylabel(metric_column.replace("_", " ").title())
    plt.title(title)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()


def build_comparison_row(metrics_dict: dict) -> dict:
    """Extract comparison table row from serialized metrics."""
    return {
        "model_name": metrics_dict["model_name"],
        "train_accuracy": metrics_dict["train"]["accuracy"],
        "test_accuracy": metrics_dict["test"]["accuracy"],
        "train_loss": metrics_dict["train"]["loss"],
        "test_loss": metrics_dict["test"]["loss"],
        "weighted_accuracy_avg": metrics_dict["weighted_accuracy_avg"],
        "macro_accuracy_avg": metrics_dict["macro_accuracy_avg"],
        "test_macro_f1": metrics_dict["test"]["macro_avg"]["f1-score"],
        "test_weighted_f1": metrics_dict["test"]["weighted_avg"]["f1-score"],
    }
