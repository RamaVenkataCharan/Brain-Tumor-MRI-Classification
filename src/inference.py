"""Inference utilities for single-image prediction."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from numpy.typing import NDArray

from src.data.dataset import build_normalize_fn
from src.data.preprocessing import PreprocessingPipeline
from src.models.classifier import build_model
from src.train import resolve_device
from src.utils.config import AppConfig


class BrainTumorPredictor:
    """Load a trained checkpoint and run inference on MRI images."""

    def __init__(self, checkpoint_path: str | Path, device: str | None = None) -> None:
        checkpoint_path = Path(checkpoint_path)
        device_obj = resolve_device(device or "cuda")
        payload = torch.load(checkpoint_path, map_location=device_obj, weights_only=False)
        self.config: AppConfig = payload["config"]
        self.device = device_obj
        self.model = build_model(self.config.model, num_classes=self.config.data.num_classes)
        self.model.load_state_dict(payload["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()

        self.preprocess = PreprocessingPipeline(
            self.config.preprocessing,
            self.config.data.image_size,
        )
        self.normalize_fn = build_normalize_fn(self.config)
        self.class_names = self.config.data.class_names

    def predict_from_array(self, image: NDArray[np.uint8]) -> dict:
        """Predict class and confidence from a BGR uint8 image array."""
        processed = self.preprocess(image)
        tensor = self.normalize_fn(processed).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probs = F.softmax(logits, dim=1).cpu().numpy()[0]

        pred_idx = int(np.argmax(probs))
        return {
            "class_name": self.class_names[pred_idx],
            "class_index": pred_idx,
            "confidence": float(probs[pred_idx]),
            "probabilities": {
                name: float(probs[i]) for i, name in enumerate(self.class_names)
            },
        }

    def predict_from_path(self, image_path: str | Path) -> dict:
        """Predict from an image file path."""
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Failed to read image: {image_path}")
        result = self.predict_from_array(image)
        result["image_path"] = str(image_path)
        return result
