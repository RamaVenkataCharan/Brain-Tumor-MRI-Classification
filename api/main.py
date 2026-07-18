"""FastAPI inference service for brain tumor MRI classification."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from src.inference import BrainTumorPredictor
from src.utils.config import load_config

app = FastAPI(
    title="Brain Tumor MRI Classification API",
    description="Predict glioma, meningioma, pituitary, or no tumor from MRI images.",
    version="0.1.0",
)

# Mount static files directory
static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


_predictor: BrainTumorPredictor | None = None


class PredictionResponse(BaseModel):
    class_name: str
    class_index: int
    confidence: float
    probabilities: dict[str, float]


def get_predictor() -> BrainTumorPredictor:
    """Lazy-load predictor from default checkpoint path."""
    global _predictor
    if _predictor is None:
        config = load_config("configs/base.yaml")
        checkpoint = Path(config.inference.default_checkpoint)
        if not checkpoint.exists():
            raise HTTPException(
                status_code=503,
                detail=f"Checkpoint not found at {checkpoint}. Train a model first.",
            )
        _predictor = BrainTumorPredictor(checkpoint)
    return _predictor


@app.get("/health")
def health() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/")
def index():
    """Serve the web UI."""
    return FileResponse(static_dir / "index.html")



@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)) -> PredictionResponse:
    """Predict tumor class from an uploaded MRI image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload must be an image file.")

    contents = await file.read()
    image_array = np.frombuffer(contents, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image.")

    predictor = get_predictor()
    result = predictor.predict_from_array(image)
    return PredictionResponse(**result)
