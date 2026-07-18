"""Experiment logging utilities (CSV/JSON + optional Weights & Biases)."""

from __future__ import annotations

import csv
import json
from dataclasses import asdict
from pathlib import Path
from typing import Any

from src.utils.config import LoggingConfig


class ExperimentLogger:
    """Simple CSV/JSON logger with optional W&B integration."""

    def __init__(self, log_dir: str | Path, config: LoggingConfig) -> None:
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.config = config
        self.csv_path = self.log_dir / "training_log.csv"
        self._csv_initialized = False
        self._wandb_run = None

        if config.use_wandb:
            self._init_wandb()

    def _init_wandb(self) -> None:
        """Initialize Weights & Biases if available and enabled."""
        try:
            import wandb

            self._wandb_run = wandb.init(
                project=self.config.wandb_project,
                name=self.config.wandb_run_name,
                reinit=True,
            )
        except ImportError as exc:
            raise ImportError(
                "wandb is not installed. Install with `pip install wandb` or disable use_wandb."
            ) from exc

    def log_epoch(self, epoch: int, metrics: dict[str, Any]) -> None:
        """Log epoch-level metrics to CSV and optionally W&B."""
        row = {"epoch": epoch, **metrics}
        self._write_csv_row(row)

        if self._wandb_run is not None:
            import wandb

            wandb.log(row, step=epoch)

    def save_json(self, filename: str, payload: dict[str, Any]) -> Path:
        """Save JSON artifact."""
        path = self.log_dir / filename
        with path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)
        return path

    def _write_csv_row(self, row: dict[str, Any]) -> None:
        fieldnames = list(row.keys())
        write_header = not self._csv_initialized and not self.csv_path.exists()
        with self.csv_path.open("a", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            if write_header:
                writer.writeheader()
            writer.writerow(row)
        self._csv_initialized = True

    def finish(self) -> None:
        """Finalize optional W&B run."""
        if self._wandb_run is not None:
            self._wandb_run.finish()
