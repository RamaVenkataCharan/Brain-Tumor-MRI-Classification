"""Evaluation and reporting for trained models."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.cuda.amp import autocast

from src.data.dataset import create_dataloaders
from src.models.classifier import build_model
from src.models.registry import list_backbones
from src.train import evaluate_epoch, resolve_device
from src.utils.config import AppConfig, load_config, update_config
from src.utils.metrics import combine_metrics, compute_split_metrics, metrics_to_dict
from src.utils.visualization import build_comparison_row, plot_comparison_bar_chart, plot_confusion_matrix


def load_checkpoint(checkpoint_path: Path, device: torch.device) -> tuple[torch.nn.Module, AppConfig]:
    """Load model from checkpoint."""
    payload = torch.load(checkpoint_path, map_location=device, weights_only=False)
    config: AppConfig = payload["config"]
    model = build_model(config.model, num_classes=config.data.num_classes)
    model.load_state_dict(payload["model_state_dict"])
    model.to(device)
    model.eval()
    return model, config


def evaluate_model(config: AppConfig, checkpoint_path: Path | None = None) -> dict:
    """Evaluate model on train and test splits; save metrics and plots."""
    device = resolve_device(config.training.device)
    use_amp = config.training.mixed_precision and device.type == "cuda"

    if checkpoint_path is None:
        checkpoint_path = Path(config.training.checkpoint_dir) / config.model.name / "best.pt"

    model, config = load_checkpoint(checkpoint_path, device)
    train_loader, test_loader = create_dataloaders(config)
    criterion = nn.CrossEntropyLoss()

    train_loss, _, y_train, y_train_pred = evaluate_epoch(
        model, train_loader, criterion, device, use_amp
    )
    test_loss, _, y_test, y_test_pred = evaluate_epoch(
        model, test_loader, criterion, device, use_amp
    )

    train_metrics = compute_split_metrics(
        y_train, y_train_pred, config.data.class_names, train_loss
    )
    test_metrics = compute_split_metrics(
        y_test, y_test_pred, config.data.class_names, test_loss
    )
    combined = combine_metrics(
        config.model.name,
        train_metrics,
        test_metrics,
        config.data.class_names,
        y_test,
        y_test_pred,
    )

    results_dir = Path(config.training.results_dir) / config.model.name
    results_dir.mkdir(parents=True, exist_ok=True)

    metrics_dict = metrics_to_dict(combined)
    metrics_path = results_dir / "metrics.json"
    with metrics_path.open("w", encoding="utf-8") as handle:
        json.dump(metrics_dict, handle, indent=2)

    if config.evaluation.save_confusion_matrix:
        plot_confusion_matrix(
            test_metrics.confusion_matrix,
            config.data.class_names,
            results_dir / "confusion_matrix.png",
            title=f"{config.model.name} - Test Confusion Matrix",
        )

    print(combined.classification_report_text)
    print(f"Weighted accuracy avg: {combined.weighted_accuracy_avg:.4f}")
    print(f"Macro accuracy avg: {combined.macro_accuracy_avg:.4f}")
    print(f"Metrics saved to {metrics_path}")

    return metrics_dict


def aggregate_comparison(results_dir: Path, output_csv: Path) -> pd.DataFrame:
    """Aggregate per-model metrics.json into comparison.csv."""
    rows: list[dict] = []
    for metrics_path in sorted(results_dir.glob("*/metrics.json")):
        with metrics_path.open("r", encoding="utf-8") as handle:
            metrics_dict = json.load(handle)
        rows.append(build_comparison_row(metrics_dict))

    if not rows:
        raise FileNotFoundError(f"No metrics.json files found under {results_dir}")

    df = pd.DataFrame(rows).sort_values("weighted_accuracy_avg", ascending=False)
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_csv, index=False)
    return df


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate brain tumor MRI classifier")
    parser.add_argument("--model", type=str, default="xception", choices=list_backbones())
    parser.add_argument("--config", type=str, default="configs/base.yaml")
    parser.add_argument("--checkpoint", type=str, default=None)
    parser.add_argument("--aggregate", action="store_true", help="Build comparison.csv from all models")
    parser.add_argument("--fast-dev-run", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.aggregate:
        results_dir = Path("results")
        df = aggregate_comparison(results_dir, results_dir / "comparison.csv")
        plot_comparison_bar_chart(df, results_dir / "comparison_chart.png")
        print(df.to_string(index=False))
        print(f"Comparison saved to {results_dir / 'comparison.csv'}")
        return

    model_config_path = Path("configs/models") / f"{args.model}.yaml"
    config = load_config(args.config, model_config_path if model_config_path.exists() else None)
    config.model.name = args.model

    overrides: dict = {}
    if args.fast_dev_run:
        overrides["training.fast_dev_run"] = True
    if overrides:
        config = update_config(config, overrides)

    checkpoint = Path(args.checkpoint) if args.checkpoint else None
    evaluate_model(config, checkpoint)


if __name__ == "__main__":
    main()
