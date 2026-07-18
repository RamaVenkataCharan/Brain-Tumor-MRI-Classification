#!/usr/bin/env bash
# Train and evaluate all 6 backbones sequentially, then build comparison table/chart.
set -euo pipefail

MODELS=(xception mobilenetv2 inceptionv3 resnet50 vgg16 densenet121)
CONFIG="configs/base.yaml"

echo "=== Brain Tumor MRI Classification Benchmark ==="
echo "Models: ${MODELS[*]}"

for model in "${MODELS[@]}"; do
  echo ""
  echo ">>> Training ${model}..."
  python -m src.train --model "${model}" --config "${CONFIG}"

  echo ">>> Evaluating ${model}..."
  python -m src.evaluate --model "${model}" --config "${CONFIG}"
done

echo ""
echo ">>> Aggregating comparison table and chart..."
python -m src.evaluate --aggregate

echo ""
echo "Done. See results/comparison.csv and results/comparison_chart.png"
