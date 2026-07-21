"use client";

import AnimateOnScroll, { StaggerContainer } from "../AnimateOnScroll";
import ModelCard from "../ui/ModelCard";
import { ModelMetrics } from "@/lib/modelResults";

interface ModelsGridProps {
  models: ModelMetrics[];
  activeModel: string;
  onSelectModel: (name: string) => void;
}

export default function ModelsGrid({ models, activeModel, onSelectModel }: ModelsGridProps) {
  return (
    <section id="models" className="py-28 md:py-36 bg-bg-deep border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <AnimateOnScroll type="fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-accent font-heading">
              Transfer Learning Backbones
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary font-heading">
              Benchmarked CNN Architectures
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll type="fade-up" delay={0.2}>
            <p className="text-sm text-text-muted leading-relaxed">
              We compared six state-of-the-art deep convolutional networks pre-trained on ImageNet. Each backbone presents unique structural trade-offs between speed, parameters, and classification accuracy.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Grid of Model Cards */}
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {models.map((model, index) => (
            <ModelCard
              key={model.name}
              model={model}
              index={index}
              isActive={model.name === activeModel}
              onClick={() => onSelectModel(model.name)}
            />
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
