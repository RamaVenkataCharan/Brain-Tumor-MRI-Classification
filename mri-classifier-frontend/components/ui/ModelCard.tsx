"use client";

import { motion } from "framer-motion";
import { Cpu, Award, ZoomIn, Layers } from "lucide-react";
import { ModelMetrics } from "@/lib/modelResults";

interface ModelCardProps {
  model: ModelMetrics;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const modelInfoMap: Record<string, { params: string; desc: string; type: string }> = {
  Xception: {
    params: "22.9M",
    desc: "Modified depthwise separable convolution layers, excelling at capturing spatial correlations efficiently.",
    type: "Separable CNN",
  },
  DenseNet121: {
    params: "8.0M",
    desc: "Dense connectivity loops where each layer receives input from all preceding layers, reducing vanishing gradients.",
    type: "Dense Block CNN",
  },
  InceptionV3: {
    params: "23.8M",
    desc: "Factorized convolutions and auxiliary classifiers. Captures multi-scale features in parallel filters.",
    type: "Multi-scale CNN",
  },
  MobileNetV2: {
    params: "3.4M",
    desc: "Inverted residuals and linear bottlenecks. Ultra-lightweight structure optimized for edge deployment.",
    type: "Mobile CNN",
  },
  ResNet50: {
    params: "25.6M",
    desc: "Residual skip connections bypass layers to train deep networks, avoiding degradation issues.",
    type: "Residual CNN",
  },
  VGG16: {
    params: "138M",
    desc: "Classical deep architecture using simple 3x3 convolution stacks, serving as an important baseline.",
    type: "Sequential CNN",
  },
};

export default function ModelCard({ model, index, isActive, onClick }: ModelCardProps) {
  const info = modelInfoMap[model.name] || { params: "Unknown", desc: "No description available", type: "Standard CNN" };
  const accuracyPercentage = (model.accuracy * 100).toFixed(2);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group cursor-pointer rounded-2xl border p-6 text-left transition-all duration-300 ${
        isActive
          ? "bg-surface-light border-teal-accent shadow-lg shadow-teal-accent/5"
          : "bg-surface border-border-slate hover:border-surface-light hover:bg-surface-light/30"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${
            isActive ? "bg-teal-accent/10 border-teal-accent/20 text-teal-accent" : "bg-bg-deep border-border-slate text-text-muted group-hover:text-teal-accent"
          } transition-colors`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-text-dim uppercase tracking-widest font-semibold">
              {info.type}
            </span>
            <h3 className="text-lg font-bold text-text-primary font-heading leading-tight mt-0.5">
              {model.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-text-dim uppercase font-semibold block">
            Accuracy
          </span>
          <span className="text-lg font-bold text-teal-accent font-heading">
            {accuracyPercentage}%
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted leading-relaxed mt-4 h-12 overflow-hidden text-ellipsis">
        {info.desc}
      </p>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border-slate/40 text-[10px] text-text-dim">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-accent/50" />
          <span>Params: <strong className="text-text-muted">{info.params}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-teal-accent/50" />
          <span>F1 Score: <strong className="text-text-muted">{(model.macroAvg.f1Score).toFixed(3)}</strong></span>
        </div>
      </div>

      {/* Select button */}
      <div className="mt-5 flex items-center justify-between text-xs font-semibold">
        <span className={`${isActive ? "text-teal-accent" : "text-text-dim group-hover:text-text-muted"} transition-colors`}>
          {isActive ? "Selected Backbone" : "View Matrix Details"}
        </span>
        <ZoomIn className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-teal-accent rotate-90" : "text-text-dim group-hover:text-text-muted"}`} />
      </div>
    </motion.div>
  );
}
