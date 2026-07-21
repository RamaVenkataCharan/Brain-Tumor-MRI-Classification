"use client";

import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import { StaggerContainer } from "@/components/AnimateOnScroll";
import { services } from "@/lib/content";

// ============================================================================
// Services Page — Expandable service cards with interactive details
// ============================================================================

export default function ServicesPage() {
  return (
    <>
      <Hero
        headline="What We Build"
        subtext="End-to-end sustainability solutions — from measurement to transformation. Every service backed by data, driven by impact."
        variant="page"
      />

      {/* Services Grid */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Our Services"
            subtitle="Click any service to learn more about how we deliver results."
          />
          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {services.map((service) => (
              <Card
                key={service.title}
                title={service.title}
                description={service.description}
                details={service.details}
                icon={service.icon}
                expandable
              />
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading
            title="How We Work"
            subtitle="A straightforward process built on trust and transparency."
            light
          />
          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Discover",
                description:
                  "We audit your current environmental footprint and identify the highest-impact opportunities.",
              },
              {
                step: "02",
                title: "Design",
                description:
                  "We co-create a tailored strategy with measurable targets and clear milestones.",
              },
              {
                step: "03",
                title: "Deliver",
                description:
                  "We build, deploy, and iterate — with real-time dashboards so you can see progress from day one.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-6xl font-bold text-sand/5 font-[family-name:var(--font-heading)] absolute -top-2 -left-2 select-none">
                  {item.step}
                </span>
                <div className="relative pt-8">
                  <h3 className="text-xl font-bold text-sand font-[family-name:var(--font-heading)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sand/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection
        headline="Ready to decarbonize?"
        subtext="Let's scope out a plan that fits your business and your ambition."
        cta={{ label: "Start a Conversation", href: "/contact" }}
        variant="gradient"
      />
    </>
  );
}
