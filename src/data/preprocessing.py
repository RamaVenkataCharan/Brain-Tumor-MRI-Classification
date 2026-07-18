"""MRI image preprocessing pipeline matching the paper's composable stages."""

from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np
from numpy.typing import NDArray

from src.utils.config import PreprocessingConfig


@dataclass
class PreprocessingPipeline:
    """Composable preprocessing stages for brain MRI images."""

    config: PreprocessingConfig
    image_size: int = 128

    def __call__(self, image: NDArray[np.uint8]) -> NDArray[np.uint8]:
        """Apply enabled preprocessing stages in paper order."""
        processed = image.copy()

        if self.config.enable_grayscale:
            processed = to_grayscale(processed)

        if self.config.enable_gaussian_blur:
            processed = apply_gaussian_blur(
                processed,
                kernel_size=self.config.gaussian_kernel_size,
                sigma=self.config.gaussian_sigma,
            )

        if self.config.enable_threshold:
            processed = apply_binary_threshold(processed, self.config.threshold_value)

        if self.config.enable_roi_crop:
            processed = crop_largest_contour(processed)

        processed = resize_image(processed, self.image_size)

        if self.config.replicate_grayscale_to_rgb and processed.ndim == 2:
            # Paper pipeline is grayscale; ImageNet backbones expect 3-channel input.
            processed = replicate_to_rgb(processed)

        return processed


def to_grayscale(image: NDArray[np.uint8]) -> NDArray[np.uint8]:
    """Convert RGB/BGR or grayscale image to single-channel grayscale."""
    if image.ndim == 2:
        return image
    if image.shape[2] == 1:
        return image[:, :, 0]
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


def apply_gaussian_blur(
    image: NDArray[np.uint8],
    kernel_size: int = 5,
    sigma: float = 0.0,
) -> NDArray[np.uint8]:
    """Apply Gaussian blur for denoising."""
    k = kernel_size if kernel_size % 2 == 1 else kernel_size + 1
    return cv2.GaussianBlur(image, (k, k), sigma)


def apply_binary_threshold(
    image: NDArray[np.uint8],
    threshold_value: int = 127,
) -> NDArray[np.uint8]:
    """Apply binary thresholding; returns single-channel uint8 mask-like image."""
    if image.ndim == 3:
        image = to_grayscale(image)
    _, thresholded = cv2.threshold(image, threshold_value, 255, cv2.THRESH_BINARY)
    return thresholded


def crop_largest_contour(image: NDArray[np.uint8]) -> NDArray[np.uint8]:
    """Detect largest contour and crop to its bounding box (ROI)."""
    if image.ndim == 3:
        gray = to_grayscale(image)
    else:
        gray = image

    contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return image

    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)
    if w == 0 or h == 0:
        return image

    if image.ndim == 2:
        return image[y : y + h, x : x + w]
    return image[y : y + h, x : x + w, :]


def resize_image(image: NDArray[np.uint8], size: int) -> NDArray[np.uint8]:
    """Resize image to square size x size."""
    return cv2.resize(image, (size, size), interpolation=cv2.INTER_AREA)


def replicate_to_rgb(image: NDArray[np.uint8]) -> NDArray[np.uint8]:
    """Replicate single-channel image across 3 channels."""
    if image.ndim == 3 and image.shape[2] == 3:
        return image
    return cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
