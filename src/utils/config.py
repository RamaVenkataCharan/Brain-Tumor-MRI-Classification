"""Configuration loading utilities using YAML + dataclasses."""

from __future__ import annotations

from dataclasses import dataclass, field, is_dataclass
from pathlib import Path
from typing import Any, get_type_hints

import yaml


@dataclass
class DataConfig:
    raw_dir: str = "data/raw"
    train_dir: str = "data/raw/Training"
    test_dir: str = "data/raw/Testing"
    image_size: int = 128
    num_classes: int = 4
    class_names: list[str] = field(
        default_factory=lambda: ["glioma", "meningioma", "notumor", "pituitary"]
    )
    batch_size: int = 20
    num_workers: int = 4
    fast_dev_subset: int = 64


@dataclass
class PreprocessingConfig:
    enable_grayscale: bool = True
    enable_gaussian_blur: bool = True
    gaussian_kernel_size: int = 5
    gaussian_sigma: float = 0.0
    enable_threshold: bool = True
    threshold_value: int = 127
    enable_roi_crop: bool = True
    replicate_grayscale_to_rgb: bool = True


@dataclass
class AugmentationConfig:
    brightness_range: list[float] = field(default_factory=lambda: [0.8, 1.2])
    contrast_range: list[float] = field(default_factory=lambda: [0.8, 1.2])
    extended: bool = False
    horizontal_flip: bool = False
    vertical_flip: bool = False
    rotation_degrees: float = 0.0


@dataclass
class ModelConfig:
    name: str = "xception"
    pretrained: bool = True
    freeze_backbone: bool = True
    fine_tune_last_n_layers: int = 0
    dropout1: float = 0.3
    dropout2: float = 0.2
    head_hidden_dim: int = 128
    use_imagenet_norm: bool = False
    imagenet_mean: list[float] = field(default_factory=lambda: [0.485, 0.456, 0.406])
    imagenet_std: list[float] = field(default_factory=lambda: [0.229, 0.224, 0.225])


@dataclass
class TrainingConfig:
    optimizer: str = "adam"
    learning_rate: float = 1e-4
    epochs: int = 5
    early_stopping: bool = False
    early_stopping_patience: int = 3
    seed: int = 42
    device: str = "cuda"
    mixed_precision: bool = True
    fast_dev_run: bool = False
    checkpoint_dir: str = "checkpoints"
    results_dir: str = "results"


@dataclass
class LoggingConfig:
    use_wandb: bool = False
    wandb_project: str = "brain-tumor-mri"
    wandb_run_name: str | None = None
    log_every_n_steps: int = 10


@dataclass
class EvaluationConfig:
    save_confusion_matrix: bool = True
    save_comparison_chart: bool = True


@dataclass
class InferenceConfig:
    default_checkpoint: str = "checkpoints/xception/best.pt"


@dataclass
class AppConfig:
    data: DataConfig = field(default_factory=DataConfig)
    preprocessing: PreprocessingConfig = field(default_factory=PreprocessingConfig)
    augmentation: AugmentationConfig = field(default_factory=AugmentationConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    training: TrainingConfig = field(default_factory=TrainingConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)
    evaluation: EvaluationConfig = field(default_factory=EvaluationConfig)
    inference: InferenceConfig = field(default_factory=InferenceConfig)


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    """Recursively merge override dict into base dict."""
    merged = dict(base)
    for key, value in override.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _dict_to_dataclass(cls: type, data: dict[str, Any]) -> Any:
    """Convert a nested dict to a dataclass instance."""
    if not hasattr(cls, "__dataclass_fields__"):
        return data
    type_hints = get_type_hints(cls)
    kwargs: dict[str, Any] = {}
    for field_name, field_def in cls.__dataclass_fields__.items():
        if field_name not in data:
            continue
        value = data[field_name]
        field_type = type_hints.get(field_name, field_def.type)
        origin = getattr(field_type, "__origin__", None)
        if origin is list:
            kwargs[field_name] = value
        elif is_dataclass(field_type) and isinstance(value, dict):
            kwargs[field_name] = _dict_to_dataclass(field_type, value)
        else:
            kwargs[field_name] = value
    return cls(**kwargs)


def load_config(base_path: str | Path, model_path: str | Path | None = None) -> AppConfig:
    """Load base YAML config and optionally merge a model-specific override."""
    base_path = Path(base_path)
    with base_path.open("r", encoding="utf-8") as handle:
        config_dict: dict[str, Any] = yaml.safe_load(handle) or {}

    if model_path is not None:
        model_path = Path(model_path)
        with model_path.open("r", encoding="utf-8") as handle:
            model_dict: dict[str, Any] = yaml.safe_load(handle) or {}
        config_dict = _deep_merge(config_dict, model_dict)

    return _dict_to_dataclass(AppConfig, config_dict)


def update_config(config: AppConfig, overrides: dict[str, Any]) -> AppConfig:
    """Apply CLI-style dotted overrides, e.g. {'training.epochs': 10}."""
    from dataclasses import asdict

    config_dict = asdict(config)
    for key, value in overrides.items():
        parts = key.split(".")
        node = config_dict
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = value
    return _dict_to_dataclass(AppConfig, config_dict)
