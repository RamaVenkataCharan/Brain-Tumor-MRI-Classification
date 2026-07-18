# Run all 6 backbones sequentially on Windows (PowerShell)
$ErrorActionPreference = "Stop"

$Models = @("xception", "mobilenetv2", "inceptionv3", "resnet50", "vgg16", "densenet121")
$Config = "configs/base.yaml"

Write-Host "=== Brain Tumor MRI Classification Benchmark ==="

foreach ($model in $Models) {
    Write-Host ""
    Write-Host ">>> Training $model..."
    python -m src.train --model $model --config $Config

    Write-Host ">>> Evaluating $model..."
    python -m src.evaluate --model $model --config $Config
}

Write-Host ""
Write-Host ">>> Aggregating comparison table and chart..."
python -m src.evaluate --aggregate

Write-Host ""
Write-Host "Done. See results/comparison.csv and results/comparison_chart.png"
