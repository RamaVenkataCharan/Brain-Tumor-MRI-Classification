"""Training-time augmentation utilities."""

from __future__ import annotations

import random

import numpy as np
from numpy.typing import NDArray

from src.utils.config import AugmentationConfig


class Augmentor:
    """Brightness/contrast jitter (paper) with optional extended augmentations."""

    def __init__(self, config: AugmentationConfig) -> None:
        self.config = config

    def __call__(self, image: NDArray[np.uint8]) -> NDArray[np.uint8]:
        """Apply random augmentations to a uint8 image."""
        augmented = image.astype(np.float32)

        brightness = random.uniform(*self.config.brightness_range)
        contrast = random.uniform(*self.config.contrast_range)
        augmented = apply_brightness_contrast(augmented, brightness, contrast)

        if self.config.extended:
            augmented = apply_extended_augmentations(augmented, self.config)

        return np.clip(augmented, 0, 255).astype(np.uint8)


def apply_brightness_contrast(
    image: NDArray[np.float32],
    brightness: float,
    contrast: float,
) -> NDArray[np.float32]:
    """Adjust brightness and contrast by multiplicative factors."""
    mean = float(np.mean(image))
    adjusted = (image - mean) * contrast + mean
    return adjusted * brightness


def apply_extended_augmentations(
    image: NDArray[np.float32],
    config: AugmentationConfig,
) -> NDArray[np.float32]:
    """Optional flips and rotation beyond the paper's baseline."""
    import cv2

    if config.horizontal_flip and random.random() < 0.5:
        image = cv2.flip(image, 1)

    if config.vertical_flip and random.random() < 0.5:
        image = cv2.flip(image, 0)

    if config.rotation_degrees > 0:
        angle = random.uniform(-config.rotation_degrees, config.rotation_degrees)
        h, w = image.shape[:2]
        matrix = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
        image = cv2.warpAffine(image, matrix, (w, h), borderMode=cv2.BORDER_REFLECT_101)

    return image
