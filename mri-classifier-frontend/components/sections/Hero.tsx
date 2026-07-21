"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle } from "lucide-react";
import AnimateOnScroll from "../AnimateOnScroll";

// Dynamically import Three.js scene with SSR disabled to optimize first paint
const SliceStackHero = dynamic(() => import("../three/SliceStackHero"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[550px] bg-surface/20 border border-border-slate/40 rounded-2xl flex items-center justify-center animate-pulse">
      <span className="text-text-muted text-xs tracking-wider">
        Loading 3D Volumetric Engine...
      </span>
    </div>
  ),
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-bg-deep overflow-hidden pt-20"
    >
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-accent/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-teal-light/2 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Content Block */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <AnimateOnScroll type="fade-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-teal-accent/20 rounded-full text-xs font-semibold text-teal-accent">
                <CheckCircle className="w-3.5 h-3.5" />
                Cancers 2025 Benchmarks Reproduced
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll type="fade-up" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-text-primary font-heading">
                AI-Assisted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-accent to-teal-light">
                  Brain Tumor
                </span> <br />
                MRI Classification
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll type="fade-up" delay={0.2}>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
                Highly precise convolutional neural networks bench-marked to classify Glioma, Meningioma, Pituitary, and healthy MR images. Replicating the state-of-the-art methodology with clinical-grade accuracy.
              </p>
            </AnimateOnScroll>

            {/* CTAs */}
            <AnimateOnScroll type="fade-up" delay={0.3} className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-accent text-bg-deep font-bold text-sm uppercase tracking-wider rounded-full hover:bg-teal-light hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-teal-accent/25"
              >
                Inference Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#results"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border-slate text-text-primary font-bold text-sm uppercase tracking-wider rounded-full hover:bg-surface-light hover:border-teal-accent/40 transition-all duration-300"
              >
                Explore Metrics
              </Link>
            </AnimateOnScroll>
          </div>

          {/* 3D Scene Block */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <AnimateOnScroll type="scale-up" delay={0.15} className="w-full">
              <SliceStackHero />
            </AnimateOnScroll>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-dim text-[10px] uppercase tracking-widest pointer-events-none">
        <span>Overview</span>
        <ChevronDown className="w-4 h-4 text-teal-accent animate-bounce" />
      </div>
    </section>
  );
}
