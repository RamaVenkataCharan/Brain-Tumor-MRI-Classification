"use client";

import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import AnimateOnScroll, { StaggerContainer } from "@/components/AnimateOnScroll";
import { homeContent, testimonials } from "@/lib/content";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ============================================================================
// Home Page — Hero, Manifesto, Offerings, Social Proof, CTA
// ============================================================================

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        headline={homeContent.hero.headline}
        headlineAccent={homeContent.hero.headlineAccent}
        subtext={homeContent.hero.subtext}
        cta={homeContent.hero.cta}
        ctaSecondary={homeContent.hero.ctaSecondary}
        variant="home"
      />

      {/* Manifesto Section — Full-bleed dark section with scroll-triggered type */}
      <ManifestoSection />

      {/* Key Offerings */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="What we do"
            subtitle="Three pillars of impact — from measurement to action."
          />
          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {homeContent.offerings.map((offering) => (
              <Card
                key={offering.title}
                title={offering.title}
                description={offering.description}
                icon={offering.icon}
                variant="outlined"
              />
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-24 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll type="fade-up">
            <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-12">
              {homeContent.socialProof.heading}
            </p>
          </AnimateOnScroll>

          {/* Logo ticker */}
          <StaggerContainer
            staggerDelay={0.08}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {homeContent.socialProof.logos.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center px-6 py-3 rounded-lg bg-gray-100 text-gray-500 font-semibold text-sm font-[family-name:var(--font-heading)] hover:bg-emerald/5 hover:text-emerald transition-colors duration-300"
              >
                {logo}
              </div>
            ))}
          </StaggerContainer>

          {/* Testimonials */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimateOnScroll key={i} type="fade-up" delay={i * 0.1}>
                <blockquote className="relative p-6 md:p-8 rounded-2xl bg-sand border border-gray-200">
                  {/* Quote mark */}
                  <span className="absolute -top-3 left-6 text-4xl text-emerald/30 font-serif leading-none">
                    &ldquo;
                  </span>
                  <p className="text-charcoal text-sm md:text-base leading-relaxed">
                    {t.quote}
                  </p>
                  <footer className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-forest font-semibold text-sm">{t.author}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {t.role}, {t.company}
                    </p>
                  </footer>
                </blockquote>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <CTASection
        headline={homeContent.ctaFooter.headline}
        subtext={homeContent.ctaFooter.subtext}
        cta={homeContent.ctaFooter.cta}
        variant="gradient"
      />
    </>
  );
}

// ============================================================================
// ManifestoSection — The "unconventional" section
// Full-bleed dark background, large scroll-triggered typography with
// asymmetric layout. Each line fades in as user scrolls.
// ============================================================================

function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-charcoal overflow-hidden"
    >
      {/* Parallax background accent */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald/5 blur-3xl"
        style={{ y: bgY }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Prelude */}
        <AnimateOnScroll type="fade-up">
          <p className="text-emerald uppercase tracking-[0.3em] text-sm font-semibold mb-12 md:mb-16">
            {homeContent.manifesto.prelude}
          </p>
        </AnimateOnScroll>

        {/* Manifesto lines — asymmetric, staggered */}
        <div className="space-y-4 md:space-y-6">
          {homeContent.manifesto.lines.map((line, i) => {
            // Alternate alignment for asymmetry
            const isIndented = i % 3 === 1;
            const isAccented = i === homeContent.manifesto.lines.length - 1;

            return (
              <AnimateOnScroll key={i} type="fade-up" delay={i * 0.08}>
                <p
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight font-[family-name:var(--font-heading)] transition-colors duration-300 ${
                    isIndented ? "md:pl-16 lg:pl-24" : ""
                  } ${isAccented ? "text-lime" : "text-sand/90"}`}
                >
                  {line}
                </p>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Decorative line */}
        <AnimateOnScroll type="fade-in" delay={0.6}>
          <div className="mt-16 md:mt-20 w-20 h-1 bg-gradient-to-r from-emerald to-lime rounded-full" />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
