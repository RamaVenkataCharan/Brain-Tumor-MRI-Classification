"""Shared classification head and model wrapper."""

from __future__ import annotations

from typing import Any

import torch
import torch.nn as nn

from src.models.registry import get_backbone
from src.utils.config import ModelConfig


class ClassificationHead(nn.Module):
    """Paper-style head: Dropout -> Dense(128) -> Dropout -> Dense(num_classes).

    Uses logits output for CrossEntropyLoss (PyTorch convention) instead of Softmax.
    """

    def __init__(
        self,
        in_features: int,
        num_classes: int,
        hidden_dim: int = 128,
        dropout1: float = 0.3,
        dropout2: float = 0.2,
    ) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(dropout1),
            nn.Linear(in_features, hidden_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout2),
            nn.Linear(hidden_dim, num_classes),
        )

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return self.net(features)


class BrainTumorClassifier(nn.Module):
    """Pretrained backbone + shared classification head."""

    def __init__(self, config: ModelConfig, num_classes: int = 4) -> None:
        super().__init__()
        self.config = config
        self.backbone, feature_dim = get_backbone(
            config.name,
            pretrained=config.pretrained,
            num_classes=0,
        )
        self.head = ClassificationHead(
            in_features=feature_dim,
            num_classes=num_classes,
            hidden_dim=config.head_hidden_dim,
            dropout1=config.dropout1,
            dropout2=config.dropout2,
        )
        self._configure_finetuning()

    def _configure_finetuning(self) -> None:
        """Freeze or partially unfreeze backbone layers."""
        if self.config.freeze_backbone and self.config.fine_tune_last_n_layers == 0:
            for param in self.backbone.parameters():
                param.requires_grad = False
            return

        for param in self.backbone.parameters():
            param.requires_grad = False

        if self.config.fine_tune_last_n_layers > 0:
            children = list(self.backbone.children())
            for module in children[-self.config.fine_tune_last_n_layers :]:
                for param in module.parameters():
                    param.requires_grad = True

    def forward_features(self, x: torch.Tensor) -> torch.Tensor:
        """Extract feature tensor from backbone."""
        features = self.backbone.forward_features(x)
        if features.ndim == 4:
            features = torch.flatten(features, 1)
        elif features.ndim == 3:
            features = features.mean(dim=1)
        return features

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.forward_features(x)
        return self.head(features)


def build_model(config: ModelConfig, num_classes: int = 4) -> BrainTumorClassifier:
    """Factory for BrainTumorClassifier."""
    return BrainTumorClassifier(config=config, num_classes=num_classes)
