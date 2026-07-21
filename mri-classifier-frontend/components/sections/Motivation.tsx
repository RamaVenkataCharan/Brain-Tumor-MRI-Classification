"use client";

import AnimateOnScroll, { StaggerContainer } from "../AnimateOnScroll";
import { Brain, ShieldCheck, Heart, BarChart3 } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  desc: string;
}

const stats: StatItem[] = [
  {
    icon: <Brain className="w-6 h-6 text-teal-accent" />,
    value: "7,023",
    label: "MRI Dataset Images",
    desc: "Rigorous training dataset across four classifications.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-teal-accent" />,
    value: "4 Class",
    label: "Diagnostic Scope",
    desc: "Glioma, Meningioma, Pituitary, and healthy scans.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-teal-accent" />,
    value: "99.12%",
    label: "Peak Performance",
    desc: "Outstanding accuracy benchmark matching the 2025 paper.",
  },
  {
    icon: <Heart className="w-6 h-6 text-teal-accent" />,
    value: "6 Models",
    label: "Deep Learning Backbones",
    desc: "Robust benchmark of leading convolutional networks.",
  },
];

export default function Motivation() {
  return (
    <section id="motivation" className="py-28 md:py-36 bg-bg-deep border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Headline block */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <AnimateOnScroll type="fade-up">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-accent font-heading">
                Clinical Context
              </span>
            </AnimateOnScroll>
            
            <AnimateOnScroll type="fade-up" delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary font-heading">
                Why Automated MRI Classification Matters
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll type="fade-up" delay={0.2}>
              <div className="space-y-4 text-sm text-text-muted leading-relaxed">
                <p>
                  Early detection and categorization of brain tumors are critical steps in clinical oncology. Manual MRI analysis requires expert radiologists, making it time-intensive and subject to inter-observer variability in complex cases.
                </p>
                <p>
                  Leveraging advanced Deep Convolutional Neural Networks (CNNs) as clinical support systems assists medical professionals by providing rapid, objective secondary opinions. This speeds up diagnostics and enables timely, personalized treatment planning.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-7">
            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-border-slate p-6 text-left hover:border-surface-light transition-all duration-300 select-none glow-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-bg-deep border border-border-slate/85 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold text-text-primary font-heading tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-teal-accent font-heading mt-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-text-dim mt-2 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
