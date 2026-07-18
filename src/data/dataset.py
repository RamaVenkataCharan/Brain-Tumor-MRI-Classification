"""Dataset and DataLoader utilities for brain tumor MRI images."""

from __future__ import annotations

from pathlib import Path
from typing import Callable

import cv2
import numpy as np
import torch
from numpy.typing import NDArray
from torch.utils.data import DataLoader, Dataset

from src.data.augmentation import Augmentor
from src.data.preprocessing import PreprocessingPipeline
from src.utils.config import AppConfig


class BrainTumorDataset(Dataset):
    """Load MRI images from class-labeled folder structure."""

    IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}

    def __init__(
        self,
        root_dir: str | Path,
        class_names: list[str],
        preprocess: PreprocessingPipeline,
        augment: Augmentor | None = None,
        normalize_fn: Callable[[NDArray[np.uint8]], torch.Tensor] | None = None,
        max_samples: int | None = None,
    ) -> None:
        self.root_dir = Path(root_dir)
        self.class_names = class_names
        self.class_to_idx = {name: idx for idx, name in enumerate(class_names)}
        self.preprocess = preprocess
        self.augment = augment
        self.normalize_fn = normalize_fn or default_normalize
        self.samples: list[tuple[Path, int]] = self._collect_samples(max_samples)

    def _collect_samples(self, max_samples: int | None) -> list[tuple[Path, int]]:
        samples: list[tuple[Path, int]] = []
        for class_name in self.class_names:
            class_dir = self.root_dir / class_name
            if not class_dir.exists():
                continue
            for path in sorted(class_dir.iterdir()):
                if path.suffix.lower() in self.IMAGE_EXTENSIONS:
                    samples.append((path, self.class_to_idx[class_name]))

        if max_samples is not None:
            samples = samples[:max_samples]
        if not samples:
            raise FileNotFoundError(
                f"No images found under {self.root_dir}. "
                "Expected subfolders: {class_names}"
            )
        return samples

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, int]:
        path, label = self.samples[index]
        image = cv2.imread(str(path))
        if image is None:
            raise ValueError(f"Failed to read image: {path}")

        processed = self.preprocess(image)
        if self.augment is not None:
            processed = self.augment(processed)

        tensor = self.normalize_fn(processed)
        return tensor, label


def default_normalize(image: NDArray[np.uint8]) -> torch.Tensor:
    """Normalize uint8 image to [0, 1] float tensor CHW (paper scheme)."""
    array = image.astype(np.float32) / 255.0
    if array.ndim == 2:
        array = np.stack([array, array, array], axis=0)
    else:
        array = np.transpose(array, (2, 0, 1))
    return torch.from_numpy(array)


def imagenet_normalize(
    image: NDArray[np.uint8],
    mean: list[float],
    std: list[float],
) -> torch.Tensor:
    """Apply ImageNet mean/std normalization (deviates from paper's [0,1] scheme)."""
    tensor = default_normalize(image)
    mean_tensor = torch.tensor(mean).view(3, 1, 1)
    std_tensor = torch.tensor(std).view(3, 1, 1)
    return (tensor - mean_tensor) / std_tensor


def build_normalize_fn(config: AppConfig) -> Callable[[NDArray[np.uint8]], torch.Tensor]:
    """Select normalization function based on config."""
    if config.model.use_imagenet_norm:

        def _normalize(image: NDArray[np.uint8]) -> torch.Tensor:
            return imagenet_normalize(
                image,
                config.model.imagenet_mean,
                config.model.imagenet_std,
            )

        return _normalize
    return default_normalize


def create_dataloaders(config: AppConfig) -> tuple[DataLoader, DataLoader]:
    """Create train and test dataloaders from config."""
    preprocess = PreprocessingPipeline(config.preprocessing, config.data.image_size)
    normalize_fn = build_normalize_fn(config)
    max_samples = config.data.fast_dev_subset if config.training.fast_dev_run else None

    train_dataset = BrainTumorDataset(
        root_dir=config.data.train_dir,
        class_names=config.data.class_names,
        preprocess=preprocess,
        augment=Augmentor(config.augmentation),
        normalize_fn=normalize_fn,
        max_samples=max_samples,
    )
    test_dataset = BrainTumorDataset(
        root_dir=config.data.test_dir,
        class_names=config.data.class_names,
        preprocess=preprocess,
        augment=None,
        normalize_fn=normalize_fn,
        max_samples=max_samples,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=config.data.batch_size,
        shuffle=True,
        num_workers=config.data.num_workers,
        pin_memory=True,
    )
    test_loader = DataLoader(
        test_dataset,
        batch_size=config.data.batch_size,
        shuffle=False,
        num_workers=config.data.num_workers,
        pin_memory=True,
    )
    return train_loader, test_loader


def count_samples_by_class(root_dir: str | Path, class_names: list[str]) -> dict[str, int]:
    """Count images per class in a directory tree."""
    root = Path(root_dir)
    counts: dict[str, int] = {}
    for class_name in class_names:
        class_dir = root / class_name
        if not class_dir.exists():
            counts[class_name] = 0
            continue
        counts[class_name] = sum(
            1
            for path in class_dir.iterdir()
            if path.suffix.lower() in BrainTumorDataset.IMAGE_EXTENSIONS
        )
    return counts
