"""Backbone registry for timm pretrained models."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

import timm

# Maps logical model names to timm model identifiers and optional kwargs.
BACKBONES: dict[str, dict[str, Any]] = {
    "xception": {"model_name": "xception", "features_only": False},
    "mobilenetv2": {"model_name": "mobilenetv2_100", "features_only": False},
    "inceptionv3": {"model_name": "inception_v3", "features_only": False},
    "resnet50": {"model_name": "resnet50", "features_only": False},
    "vgg16": {"model_name": "vgg16", "features_only": False},
    "densenet121": {"model_name": "densenet121", "features_only": False},
}


def list_backbones() -> list[str]:
    """Return registered backbone names."""
    return sorted(BACKBONES.keys())


def get_backbone(
    name: str,
    pretrained: bool = True,
    num_classes: int = 0,
) -> tuple[Any, int]:
    """Load a timm backbone with classifier removed (num_classes=0 -> features).

    Returns:
        Tuple of (backbone module, feature dimension).
    """
    if name not in BACKBONES:
        raise ValueError(f"Unknown backbone '{name}'. Available: {list_backbones()}")

    spec = BACKBONES[name]
    model = timm.create_model(
        spec["model_name"],
        pretrained=pretrained,
        num_classes=num_classes,
    )

    if num_classes == 0:
        feature_dim = _infer_feature_dim(model, spec["model_name"])
        return model, feature_dim

    return model, num_classes


def _infer_feature_dim(model: Any, model_name: str) -> int:
    """Infer flattened feature dimension by running a dummy forward pass."""
    import torch

    model.eval()
    size = 299 if "inception" in model_name else 128
    dummy = torch.randn(1, 3, size, size)
    with torch.no_grad():
        features = model.forward_features(dummy)
        if features.ndim == 4:
            features = torch.flatten(features, 1)
        elif features.ndim == 3:
            features = features.mean(dim=1)
    return int(features.shape[1])


def register_backbone(name: str, model_name: str, **kwargs: Any) -> None:
    """Register a new backbone for extensibility (EfficientNet, ViT, etc.)."""
    BACKBONES[name] = {"model_name": model_name, **kwargs}
