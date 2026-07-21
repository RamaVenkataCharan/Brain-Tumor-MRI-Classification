"use client";

import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import AnimateOnScroll, { StaggerContainer } from "@/components/AnimateOnScroll";
import CTASection from "@/components/CTASection";
import { aboutContent, milestones, values, teamMembers } from "@/lib/content";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// ============================================================================
// About Page — Story, Mission/Vision, Timeline, Values, Team Preview
// ============================================================================

export default function AboutPage() {
  return (
    <>
      <Hero
        headline={aboutContent.hero.headline}
        subtext={aboutContent.hero.subtext}
        variant="page"
      />

      {/* Founding Story — split layout */}
      <FoundingStory />

      {/* Mission & Vision */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Our North Star" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimateOnScroll type="fade-up">
              <div className="p-8 md:p-10 rounded-2xl bg-forest text-sand">
                <span className="text-emerald uppercase tracking-widest text-xs font-semibold">
                  Mission
                </span>
                <p className="mt-4 text-xl md:text-2xl font-bold leading-relaxed font-[family-name:var(--font-heading)]">
                  {aboutContent.mission}
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll type="fade-up" delay={0.15}>
              <div className="p-8 md:p-10 rounded-2xl border-2 border-forest bg-sand">
                <span className="text-emerald uppercase tracking-widest text-xs font-semibold">
                  Vision
                </span>
                <p className="mt-4 text-xl md:text-2xl font-bold leading-relaxed text-forest font-[family-name:var(--font-heading)]">
                  {aboutContent.vision}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            title="Our Journey"
            subtitle="From a garage to a global team."
          />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <AnimateOnScroll key={i} type="fade-up" delay={i * 0.1}>
                  <div
                    className={`relative flex items-start gap-8 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-emerald border-4 border-sand -translate-x-1.5 md:-translate-x-1.5 mt-1.5 z-10" />

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        i % 2 === 0
                          ? "md:pr-12 md:text-right"
                          : "md:pl-12 md:text-left"
                      }`}
                    >
                      <span className="text-emerald font-bold text-sm font-[family-name:var(--font-heading)]">
                        {m.year}
                      </span>
                      <h3 className="text-xl font-bold text-forest mt-1 font-[family-name:var(--font-heading)]">
                        {m.title}
                      </h3>
                      <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="What We Stand For"
            subtitle="Not just values on a wall. Principles we ship by."
            light
          />
          <StaggerContainer
            staggerDelay={0.12}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v) => (
              <div
                key={v.title}
                className="group p-6 md:p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-emerald/30 transition-all duration-500"
              >
                <span className="text-3xl block mb-4" role="img" aria-hidden="true">
                  {v.icon}
                </span>
                <h3 className="text-lg font-bold text-sand font-[family-name:var(--font-heading)]">
                  {v.title}
                </h3>
                <p className="text-sand/60 text-sm mt-3 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeading
            title="The Humans Behind TerraForge"
            subtitle="Meet the team driving our mission forward."
          />
          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {teamMembers.slice(0, 3).map((member) => (
              <div
                key={member.name}
                className="rounded-2xl overflow-hidden bg-white border border-gray-200"
              >
                <div className="h-48 bg-gradient-to-br from-forest to-emerald flex items-center justify-center">
                  <span className="text-4xl font-bold text-sand/10 font-[family-name:var(--font-heading)] select-none">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-forest font-[family-name:var(--font-heading)]">
                    {member.name}
                  </h3>
                  <p className="text-emerald text-sm mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </StaggerContainer>
          <AnimateOnScroll type="fade-up" delay={0.4}>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 mt-10 text-emerald font-semibold hover:text-emerald-dark transition-colors duration-300"
            >
              Meet the full team
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      <CTASection
        headline="Interested in our story?"
        subtext="We'd love to share more. Let's connect."
        cta={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}

// ============================================================================
// FoundingStory — Split layout with parallax image placeholder
// ============================================================================

function FoundingStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder with parallax */}
          <AnimateOnScroll type="fade-up">
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-forest to-emerald aspect-[4/3]"
              style={{ y: imgY }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl" role="img" aria-label="Seedling">
                    🌱
                  </span>
                  <p className="text-sand/40 text-sm mt-4 font-[family-name:var(--font-heading)]">
                    Founding photo placeholder
                  </p>
                </div>
              </div>
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-bl-full" />
            </motion.div>
          </AnimateOnScroll>

          {/* Story text */}
          <div>
            <AnimateOnScroll type="fade-up" delay={0.15}>
              <span className="text-emerald uppercase tracking-widest text-xs font-semibold">
                Our Story
              </span>
            </AnimateOnScroll>
            {aboutContent.story.paragraphs.map((para, i) => (
              <AnimateOnScroll key={i} type="fade-up" delay={0.2 + i * 0.1}>
                <p className="mt-6 text-gray-600 leading-relaxed text-base md:text-lg">
                  {para}
                </p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
