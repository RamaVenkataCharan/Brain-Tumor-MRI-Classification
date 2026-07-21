"use client";

import dynamic from "next/dynamic";
import AnimateOnScroll, { StaggerContainer } from "../AnimateOnScroll";

// Dynamically import the 3D pipeline flow component
const PipelineFlow = dynamic(() => import("../three/PipelineFlow"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-surface/20 border border-border-slate/40 rounded-2xl flex items-center justify-center animate-pulse">
      <span className="text-text-muted text-xs tracking-wider">
        Loading Pipeline Grapher...
      </span>
    </div>
  ),
});

interface PreprocessStep {
  name: string;
  desc: string;
}

const preprocessingSteps: PreprocessStep[] = [
  {
    name: "01. Grayscale Conversion",
    desc: "Reduces computing dimension while retaining critical structural density data.",
  },
  {
    name: "02. Gaussian Filtering",
    desc: "Smooths high-frequency sensor noise using a 5x5 kernel.",
  },
  {
    name: "03. Otsu Thresholding",
    desc: "Creates a binary mask to segment foreground brain structure from black background.",
  },
  {
    name: "04. ROI Cropping",
    desc: "Crops bounding box coordinates to isolate brain pixels and remove empty space.",
  },
  {
    name: "05. Resizing (128x128)",
    desc: "Standardizes tensor inputs for transfer learning models.",
  },
  {
    name: "06. Channel Replication",
    desc: "Replicates single-channel grayscale into 3-channel RGB for ImageNet models.",
  },
];

export default function Methodology() {
  return (
    <section id="methodology" className="py-28 md:py-36 bg-surface/10 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-16 space-y-4">
          <AnimateOnScroll type="fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-accent font-heading">
              Technical Methodology
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary font-heading">
              Preprocessing & Model Architecture
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.2}>
            <p className="text-sm text-text-muted leading-relaxed">
              Before feeding MRI scans into the convolutional neural networks, we pass them through a paper-faithful preprocessing pipeline to enhance structural segmentation and reduce noise.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Preprocessing Steps Timeline */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {preprocessingSteps.map((step, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl border border-border-slate/60 p-5 text-left transition-colors duration-300 hover:border-teal-accent/30"
            >
              <h3 className="text-xs font-bold text-teal-accent font-heading tracking-tight">
                {step.name}
              </h3>
              <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </StaggerContainer>

        {/* 3D Pipeline Scene */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 bg-surface rounded-2xl border border-border-slate p-4 shadow-xl">
            <div className="px-4 py-2 border-b border-border-slate/40 flex justify-between items-center text-[10px] uppercase text-text-dim font-heading">
              <span>CNN Stage Visualization</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-light" />
              </div>
            </div>
            <PipelineFlow />
          </div>

          <div className="lg:col-span-4 space-y-6 text-left">
            <AnimateOnScroll type="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-accent font-heading">
                Flow Explanation
              </span>
            </AnimateOnScroll>
            
            <AnimateOnScroll type="fade-up" delay={0.1}>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary font-heading">
                Classification Pipeline Sequence
              </h3>
            </AnimateOnScroll>

            <AnimateOnScroll type="fade-up" delay={0.2}>
              <div className="space-y-4 text-xs text-text-muted leading-relaxed">
                <p>
                  As shown in the 3D model, the 3-channel input MRI travels through the pre-trained backbone. Spatial correlations are compressed into robust feature maps.
                </p>
                <p>
                  A <strong>Global Average Pooling (GAP)</strong> layer flattens the maps into a 1D vector. This flows through a <strong>Dense Classification Head</strong> with Dropout regularization to produce logits, and finally Softmax outputs class probabilities.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

        </div>

      </div>
    </section>
  );
}
