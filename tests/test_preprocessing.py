"""Tests for preprocessing pipeline."""

from __future__ import annotations

import numpy as np

from src.data.preprocessing import (
    PreprocessingPipeline,
    apply_binary_threshold,
    crop_largest_contour,
    replicate_to_rgb,
    resize_image,
    to_grayscale,
)
from src.utils.config import PreprocessingConfig


def test_to_grayscale_from_rgb() -> None:
    rgb = np.random.randint(0, 255, (64, 64, 3), dtype=np.uint8)
    gray = to_grayscale(rgb)
    assert gray.shape == (64, 64)
    assert gray.dtype == np.uint8


def test_binary_threshold() -> None:
    image = np.zeros((32, 32), dtype=np.uint8)
    image[8:24, 8:24] = 200
    thresholded = apply_binary_threshold(image, threshold_value=127)
    assert thresholded.max() == 255
    assert thresholded.min() == 0


def test_resize_image() -> None:
    image = np.random.randint(0, 255, (50, 80), dtype=np.uint8)
    resized = resize_image(image, 128)
    assert resized.shape == (128, 128)


def test_replicate_to_rgb() -> None:
    gray = np.random.randint(0, 255, (32, 32), dtype=np.uint8)
    rgb = replicate_to_rgb(gray)
    assert rgb.shape == (32, 32, 3)


def test_pipeline_output_shape() -> None:
    config = PreprocessingConfig()
    pipeline = PreprocessingPipeline(config, image_size=128)
    image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
    output = pipeline(image)
    assert output.shape == (128, 128, 3)


def test_crop_largest_contour_fallback() -> None:
    blank = np.zeros((32, 32), dtype=np.uint8)
    cropped = crop_largest_contour(blank)
    assert cropped.shape == (32, 32)
