"""Tests for configuration loading."""

from __future__ import annotations

from src.utils.config import load_config, update_config


def test_load_base_config() -> None:
    config = load_config("configs/base.yaml")
    assert config.model.name == "xception"
    assert config.training.epochs == 5
    assert config.data.batch_size == 20


def test_load_model_override() -> None:
    config = load_config("configs/base.yaml", "configs/models/resnet50.yaml")
    assert config.model.name == "resnet50"


def test_update_config_dotted_override() -> None:
    config = load_config("configs/base.yaml")
    updated = update_config(config, {"training.epochs": 10, "data.batch_size": 32})
    assert updated.training.epochs == 10
    assert updated.data.batch_size == 32
