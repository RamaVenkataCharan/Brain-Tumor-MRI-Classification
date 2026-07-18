"""Training loop for brain tumor MRI classification."""

from __future__ import annotations

import argparse
import random
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torch.cuda.amp import GradScaler, autocast
from tqdm import tqdm

from src.data.dataset import create_dataloaders
from src.models.classifier import build_model
from src.models.registry import list_backbones
from src.utils.config import AppConfig, load_config, update_config
from src.utils.logging import ExperimentLogger


def set_seed(seed: int) -> None:
    """Set random seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


def resolve_device(device_name: str) -> torch.device:
    """Resolve torch device with CUDA fallback."""
    if device_name == "cuda" and torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def train_one_epoch(
    model: nn.Module,
    loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    device: torch.device,
    use_amp: bool,
) -> tuple[float, float]:
    """Train for one epoch; returns (avg_loss, accuracy)."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    scaler = GradScaler(enabled=use_amp)

    for images, labels in tqdm(loader, desc="Train", leave=False):
        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad(set_to_none=True)
        with autocast(enabled=use_amp):
            outputs = model(images)
            loss = criterion(outputs, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()

        running_loss += loss.item() * labels.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    return running_loss / max(total, 1), correct / max(total, 1)


@torch.no_grad()
def evaluate_epoch(
    model: nn.Module,
    loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    device: torch.device,
    use_amp: bool,
) -> tuple[float, float, np.ndarray, np.ndarray]:
    """Evaluate model; returns loss, accuracy, y_true, y_pred."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_labels: list[int] = []
    all_preds: list[int] = []

    for images, labels in tqdm(loader, desc="Eval", leave=False):
        images = images.to(device)
        labels = labels.to(device)

        with autocast(enabled=use_amp):
            outputs = model(images)
            loss = criterion(outputs, labels)

        running_loss += loss.item() * labels.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        all_labels.extend(labels.cpu().tolist())
        all_preds.extend(preds.cpu().tolist())

    avg_loss = running_loss / max(total, 1)
    accuracy = correct / max(total, 1)
    return avg_loss, accuracy, np.array(all_labels), np.array(all_preds)


def train_model(config: AppConfig) -> Path:
    """Run full training loop and save best checkpoint."""
    set_seed(config.training.seed)
    device = resolve_device(config.training.device)
    use_amp = config.training.mixed_precision and device.type == "cuda"

    train_loader, test_loader = create_dataloaders(config)
    model = build_model(config.model, num_classes=config.data.num_classes).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=config.training.learning_rate,
    )

    checkpoint_dir = Path(config.training.checkpoint_dir) / config.model.name
    results_dir = Path(config.training.results_dir) / config.model.name
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    results_dir.mkdir(parents=True, exist_ok=True)

    logger = ExperimentLogger(results_dir, config.logging)
    best_test_acc = -1.0
    best_path = checkpoint_dir / "best.pt"
    patience_counter = 0

    epochs = 1 if config.training.fast_dev_run else config.training.epochs

    for epoch in range(1, epochs + 1):
        train_loss, train_acc = train_one_epoch(
            model, train_loader, criterion, optimizer, device, use_amp
        )
        test_loss, test_acc, _, _ = evaluate_epoch(
            model, test_loader, criterion, device, use_amp
        )

        logger.log_epoch(
            epoch,
            {
                "train_loss": train_loss,
                "train_accuracy": train_acc,
                "test_loss": test_loss,
                "test_accuracy": test_acc,
            },
        )

        print(
            f"Epoch {epoch}/{epochs} | "
            f"train_loss={train_loss:.4f} acc={train_acc:.4f} | "
            f"test_loss={test_loss:.4f} acc={test_acc:.4f}"
        )

        if test_acc > best_test_acc:
            best_test_acc = test_acc
            patience_counter = 0
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "config": config,
                    "epoch": epoch,
                    "test_accuracy": test_acc,
                },
                best_path,
            )
        else:
            patience_counter += 1

        if config.training.early_stopping and patience_counter >= config.training.early_stopping_patience:
            print("Early stopping triggered.")
            break

    logger.finish()
    return best_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train brain tumor MRI classifier")
    parser.add_argument("--model", type=str, default="xception", choices=list_backbones())
    parser.add_argument("--config", type=str, default="configs/base.yaml")
    parser.add_argument("--fast-dev-run", action="store_true", help="1 epoch on subset")
    parser.add_argument("--augment-extended", action="store_true", help="Enable extended aug")
    parser.add_argument("--epochs", type=int, default=None)
    parser.add_argument("--batch-size", type=int, default=None)
    parser.add_argument("--lr", type=float, default=None)
    parser.add_argument("--device", type=str, default=None, choices=["cuda", "cpu"])
    parser.add_argument("--no-amp", action="store_true", help="Disable mixed precision")
    parser.add_argument("--use-wandb", action="store_true", help="Enable W&B logging")
    parser.add_argument("--imagenet-norm", action="store_true", help="Use ImageNet normalization")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    model_config_path = Path("configs/models") / f"{args.model}.yaml"
    config = load_config(args.config, model_config_path if model_config_path.exists() else None)
    config.model.name = args.model

    overrides: dict = {}
    if args.fast_dev_run:
        overrides["training.fast_dev_run"] = True
    if args.augment_extended:
        overrides["augmentation.extended"] = True
        overrides["augmentation.horizontal_flip"] = True
        overrides["augmentation.rotation_degrees"] = 15
    if args.epochs is not None:
        overrides["training.epochs"] = args.epochs
    if args.batch_size is not None:
        overrides["data.batch_size"] = args.batch_size
    if args.lr is not None:
        overrides["training.learning_rate"] = args.lr
    if args.device is not None:
        overrides["training.device"] = args.device
    if args.no_amp:
        overrides["training.mixed_precision"] = False
    if args.use_wandb:
        overrides["logging.use_wandb"] = True
    if args.imagenet_norm:
        overrides["model.use_imagenet_norm"] = True

    if overrides:
        config = update_config(config, overrides)

    checkpoint = train_model(config)
    print(f"Training complete. Best checkpoint: {checkpoint}")


if __name__ == "__main__":
    main()
