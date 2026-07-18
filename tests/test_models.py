"""Tests for model registry and classifier."""

from __future__ import annotations

import torch

from src.models.classifier import BrainTumorClassifier, ClassificationHead, build_model
from src.models.registry import BACKBONES, get_backbone, list_backbones
from src.utils.config import ModelConfig


def test_registry_lists_six_backbones() -> None:
    names = list_backbones()
    assert len(names) == 6
    assert "xception" in names
    assert "densenet121" in names


def test_get_backbone_feature_dim() -> None:
    backbone, feature_dim = get_backbone("xception", pretrained=False)
    assert feature_dim > 0
    dummy = torch.randn(2, 3, 128, 128)
    features = backbone.forward_features(dummy)
    assert features.ndim in (2, 4)


def test_classification_head_output_shape() -> None:
    head = ClassificationHead(in_features=512, num_classes=4)
    x = torch.randn(4, 512)
    out = head(x)
    assert out.shape == (4, 4)


def test_build_model_forward() -> None:
    config = ModelConfig(name="mobilenetv2", pretrained=False)
    model = build_model(config, num_classes=4)
    model.eval()
    x = torch.randn(2, 3, 128, 128)
    with torch.no_grad():
        out = model(x)
    assert out.shape == (2, 4)


def test_all_backbones_instantiate() -> None:
    for name in BACKBONES:
        config = ModelConfig(name=name, pretrained=False)
        model = BrainTumorClassifier(config, num_classes=4)
        x = torch.randn(1, 3, 128, 128)
        with torch.no_grad():
            logits = model(x)
        assert logits.shape == (1, 4)
