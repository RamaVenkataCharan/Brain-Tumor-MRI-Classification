"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AnimateOnScroll from "../AnimateOnScroll";
import ResultsTable from "../ui/ResultsTable";
import ConfusionMatrixHeatmap from "../ui/ConfusionMatrixHeatmap";
import { ModelMetrics, classNames, classLabels } from "@/lib/modelResults";
import { Check, Info } from "lucide-react";

// Dynamically import the 3D bar chart scene
const ResultsBarChart3D = dynamic(() => import("../three/ResultsBarChart3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-surface/20 border border-border-slate/40 rounded-2xl flex items-center justify-center animate-pulse">
      <span className="text-text-muted text-xs tracking-wider">
        Loading 3D Visualizer Engine...
      </span>
    </div>
  ),
});

interface ResultsProps {
  models: ModelMetrics[];
  activeModel: string;
  onSelectModel: (name: string) => void;
}

export default function Results({ models, activeModel, onSelectModel }: ResultsProps) {
  const currentModelData = models.find((m) => m.name === activeModel) || models[0];

  return (
    <section id="results" className="py-28 md:py-36 bg-surface/10 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <AnimateOnScroll type="fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-accent font-heading">
              Benchmark Results
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary font-heading">
              Quantitative Model Evaluation
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.2}>
            <p className="text-sm text-text-muted leading-relaxed">
              Below are the training performance results. Select different architectures by clicking on the cards above, rows in the table below, or bars in the 3D visualizer to analyze class-specific recalls and confusion heatmaps.
            </p>
          </AnimateOnScroll>
        </div>

        {/* 3D Visualizer & Heatmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* 3D Bar Chart Visualizer */}
          <div className="lg:col-span-6 bg-surface rounded-2xl border border-border-slate p-4 shadow-xl text-left">
            <div className="px-4 py-2 border-b border-border-slate/40 flex justify-between items-center text-[10px] uppercase text-text-dim font-heading">
              <span>3D Accuracy Comparison</span>
              <span className="text-text-muted italic">Click bars to inspect model</span>
            </div>
            <ResultsBarChart3D
              activeModel={activeModel}
              onSelectModel={onSelectModel}
            />
          </div>

          {/* Active Model Details & Confusion Matrix */}
          <div className="lg:col-span-6 space-y-6">
            <ConfusionMatrixHeatmap
              matrix={currentModelData.confusionMatrix}
              classNames={classNames}
              classLabels={classLabels}
              modelName={currentModelData.name}
            />
            
            {/* Per-class Metrics Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {classNames.map((c) => {
                const classData = currentModelData.classes[c as keyof typeof currentModelData.classes];
                return (
                  <div key={c} className="bg-surface/60 rounded-xl border border-border-slate/40 p-3.5 text-center">
                    <p className="text-[10px] text-text-dim font-semibold uppercase tracking-wider">
                      {classLabels[c] ? classLabels[c].split(" ")[0] : c}
                    </p>
                    <p className="text-sm font-bold text-text-primary mt-1 font-heading">
                      {(classData.f1Score * 100).toFixed(1)}%
                    </p>
                    <p className="text-[8px] text-text-muted mt-0.5">
                      F1-Score
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Accessible Results Table */}
        <AnimateOnScroll type="fade-up" className="w-full">
          <ResultsTable
            models={models}
            activeModel={activeModel}
            onSelectModel={onSelectModel}
          />
        </AnimateOnScroll>

      </div>
    </section>
  );
}
