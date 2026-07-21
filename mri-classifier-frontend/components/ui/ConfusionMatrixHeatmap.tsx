"use client";

import { motion } from "framer-motion";

interface ConfusionMatrixHeatmapProps {
  matrix: number[][];
  classNames: string[];
  classLabels: Record<string, string>;
  modelName: string;
}

export default function ConfusionMatrixHeatmap({
  matrix,
  classNames,
  classLabels,
  modelName,
}: ConfusionMatrixHeatmapProps) {
  // Find max value in matrix (excluding diagonal or overall) to normalize intensities
  let maxVal = 1;
  matrix.forEach((row) => {
    row.forEach((val) => {
      if (val > maxVal) maxVal = val;
    });
  });

  // Calculate totals per class for row accuracy (Recall)
  const rowTotals = matrix.map((row) => row.reduce((a, b) => a + b, 0));

  return (
    <div className="bg-surface rounded-2xl border border-border-slate p-6">
      <div className="mb-4">
        <h4 className="text-sm font-bold tracking-wider uppercase text-teal-accent font-heading">
          {modelName} Confusion Matrix
        </h4>
        <p className="text-xs text-text-muted mt-1">
          Rows represent actual classes; columns represent predicted classes.
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[400px] grid grid-cols-5 gap-1.5 text-center items-center text-xs">
          {/* Top-left empty cell */}
          <div></div>

          {/* Predicted labels header */}
          {classNames.map((c) => (
            <div key={`p-h-${c}`} className="font-semibold text-text-muted truncate pb-2 uppercase tracking-wider text-[10px]">
              {classLabels[c] ? classLabels[c].split(" ")[0] : c}
            </div>
          ))}

          {/* Grid rows */}
          {classNames.map((actualClass, rowIndex) => (
            <div key={`row-${actualClass}`} className="contents">
              {/* Actual label (left side) */}
              <div className="font-semibold text-text-muted text-left pr-2 uppercase tracking-wider text-[10px] truncate">
                {classLabels[actualClass] ? classLabels[actualClass].split(" ")[0] : actualClass}
              </div>

              {/* Matrix cells */}
              {matrix[rowIndex].map((value, colIndex) => {
                const isDiagonal = rowIndex === colIndex;
                const total = rowTotals[rowIndex];
                const percentage = total > 0 ? (value / total) * 100 : 0;
                
                // Color intensity logic: diagonal gets teal-accent, errors get deep slate
                const intensity = value / maxVal;
                
                let bgStyle = {};
                let textColor = "text-text-muted";

                if (isDiagonal) {
                  bgStyle = {
                    backgroundColor: `rgba(45, 212, 191, ${0.1 + intensity * 0.85})`,
                  };
                  textColor = intensity > 0.4 ? "text-bg-deep font-bold" : "text-teal-accent font-semibold";
                } else if (value > 0) {
                  // Non-diagonal errors get a dim alert-red tone
                  bgStyle = {
                    backgroundColor: `rgba(248, 113, 113, ${0.05 + intensity * 0.4})`,
                  };
                  textColor = "text-alert-red font-medium";
                } else {
                  bgStyle = {
                    backgroundColor: "rgba(27, 38, 64, 0.2)",
                  };
                  textColor = "text-text-dim/50";
                }

                return (
                  <motion.div
                    key={`cell-${rowIndex}-${colIndex}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (rowIndex * 4 + colIndex) * 0.02 }}
                    style={bgStyle}
                    className={`aspect-square flex flex-col justify-center items-center rounded-lg border border-border-slate/40 p-1 select-none transition-all duration-300 hover:scale-105 hover:z-10 cursor-help ${textColor}`}
                    title={`Actual: ${actualClass}, Predicted: ${classNames[colIndex]} (${value} samples, ${percentage.toFixed(1)}%)`}
                  >
                    <span className="text-sm font-bold">{value}</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{percentage.toFixed(0)}%</span>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-4 text-[10px] text-text-dim pt-4 border-t border-border-slate/40">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-teal-accent/20 border border-teal-accent/30" />
          <span>Diagonal (Correct predictions)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-alert-red/20 border border-alert-red/30" />
          <span>Off-diagonal (Classification errors)</span>
        </div>
      </div>
    </div>
  );
}
