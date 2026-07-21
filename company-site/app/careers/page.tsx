"use client";

import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import AnimateOnScroll, { StaggerContainer } from "@/components/AnimateOnScroll";
import CTASection from "@/components/CTASection";
import { careersContent, jobPostings, perks } from "@/lib/content";
import { motion } from "framer-motion";

// ============================================================================
// Careers Page — Culture pitch, open roles, perks, "why work here"
// ============================================================================

export default function CareersPage() {
  return (
    <>
      <Hero
        headline={careersContent.hero.headline}
        subtext={careersContent.hero.subtext}
        cta={{ label: "See Open Roles", href: "#roles" }}
        variant="page"
      />

      {/* Why TerraForge — emotionally resonant section */}
      <section className="py-24 md:py-32 bg-charcoal overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll type="fade-up">
            <span className="text-emerald uppercase tracking-[0.3em] text-sm font-semibold">
              {careersContent.culture.headline}
            </span>
          </AnimateOnScroll>
          <div className="mt-10 space-y-6">
            {careersContent.culture.points.map((point, i) => (
              <AnimateOnScroll key={i} type="fade-up" delay={i * 0.1}>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-sand/90 leading-tight font-[family-name:var(--font-heading)]">
                  <span className="text-emerald mr-3">→</span>
                  {point}
                </p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Perks & Benefits"
            subtitle="We take care of our people so they can take care of the planet."
          />
          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="group p-6 rounded-2xl bg-sand border border-gray-200 hover:border-emerald/30 hover:shadow-md hover:shadow-emerald/5 transition-all duration-500"
              >
                <span className="text-3xl block mb-3" role="img" aria-hidden="true">
                  {perk.icon}
                </span>
                <h3 className="text-lg font-bold text-forest font-[family-name:var(--font-heading)]">
                  {perk.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Open Roles */}
      <section id="roles" className="py-24 md:py-32 bg-sand scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            title="Open Roles"
            subtitle="Don't see your role? Email us anyway — we love meeting great people."
          />
          <div className="space-y-4">
            {jobPostings.map((job, i) => (
              <AnimateOnScroll key={i} type="fade-up" delay={i * 0.08}>
                <motion.div
                  className="group p-6 md:p-8 rounded-2xl bg-white border border-gray-200 hover:border-emerald/30 hover:shadow-lg hover:shadow-emerald/5 transition-all duration-500"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-forest font-[family-name:var(--font-heading)]">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-emerald/10 text-emerald rounded-full">
                          {job.department}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {job.location}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <a
                        href={`mailto:careers@terraforge.earth?subject=Application: ${job.title}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-sand font-semibold text-sm rounded-full hover:bg-emerald transition-colors duration-300"
                      >
                        Apply
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
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Don't see the right role?"
        subtext="Send us your resume anyway. We're always looking for talented people who share our mission."
        cta={{ label: "Reach Out", href: "/contact" }}
        variant="gradient"
      />
    </>
  );
}
