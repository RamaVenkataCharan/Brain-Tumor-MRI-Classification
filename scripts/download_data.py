"""Download and validate the Brain Tumor MRI dataset from Kaggle."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

# Allow running as `python scripts/download_data.py` from project root.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data.dataset import count_samples_by_class

# Kaggle dataset: Masoud Nickparvar - Brain Tumor MRI Dataset
KAGGLE_DATASET = "masoudnickparvar/brain-tumor-mri-dataset"
EXPECTED_CLASSES = ["glioma", "meningioma", "notumor", "pituitary"]


def download_with_kagglehub(output_dir: Path) -> Path:
    """Download dataset using kagglehub."""
    import kagglehub

    print(f"Downloading {KAGGLE_DATASET} via kagglehub...")
    downloaded_path = Path(kagglehub.dataset_download(KAGGLE_DATASET))
    print(f"Downloaded to cache: {downloaded_path}")
    return downloaded_path


def setup_directory_structure(source_dir: Path, target_dir: Path) -> None:
    """Copy/link dataset into expected data/raw/{Training,Testing}/ layout."""
    target_dir.mkdir(parents=True, exist_ok=True)

    # Kaggle dataset typically has Training/ and Testing/ at top level.
    for split in ("Training", "Testing"):
        src_split = source_dir / split
        dst_split = target_dir / split
        if src_split.exists():
            if dst_split.exists():
                shutil.rmtree(dst_split)
            shutil.copytree(src_split, dst_split)
            print(f"Copied {split} -> {dst_split}")
        else:
            print(f"Warning: split folder not found: {src_split}")


def validate_dataset(data_dir: Path) -> bool:
    """Validate folder structure and print per-class counts."""
    print("\n=== Dataset Validation ===")
    ok = True
    for split in ("Training", "Testing"):
        split_dir = data_dir / split
        print(f"\n{split} ({split_dir}):")
        if not split_dir.exists():
            print("  MISSING split directory")
            ok = False
            continue

        counts = count_samples_by_class(split_dir, EXPECTED_CLASSES)
        for class_name, count in counts.items():
            status = "ok" if count > 0 else "MISSING/EMPTY"
            print(f"  {class_name}: {count} [{status}]")
            if count == 0:
                ok = False

        total = sum(counts.values())
        print(f"  Total: {total}")

    return ok


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download Brain Tumor MRI dataset")
    parser.add_argument(
        "--output-dir",
        type=str,
        default="data/raw",
        help="Target directory for dataset",
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Only validate existing dataset structure",
    )
    parser.add_argument(
        "--skip-download",
        action="store_true",
        help="Skip download; only setup/validate from existing cache",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir)

    if args.validate_only:
        valid = validate_dataset(output_dir)
        raise SystemExit(0 if valid else 1)

    if not args.skip_download:
        source = download_with_kagglehub(output_dir)
        setup_directory_structure(source, output_dir)
    else:
        print("Skipping download. Validating existing data only.")

    valid = validate_dataset(output_dir)
    if valid:
        print("\nDataset is ready.")
    else:
        print(
            "\nDataset validation failed. "
            "Ensure Kaggle credentials are configured (~/.kaggle/kaggle.json) "
            "or manually place data under data/raw/{Training,Testing}/{class}/*.jpg"
        )
        raise SystemExit(1)


if __name__ == "__main__":
    main()
