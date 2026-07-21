"use client";

import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMemberCard";
import CTASection from "@/components/CTASection";
import { StaggerContainer } from "@/components/AnimateOnScroll";
import { teamMembers } from "@/lib/content";

// ============================================================================
// Team Page — Full team grid with hover-reveal passion quotes
// ============================================================================

export default function TeamPage() {
  return (
    <>
      <Hero
        headline="Our Team"
        subtext="Diverse backgrounds, shared conviction. Meet the people building TerraForge."
        variant="page"
      />

      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="The Humans Behind the Mission"
            subtitle="Hover over any card to see what drives them."
          />
          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection
        headline="Want to join this team?"
        subtext="We're always looking for passionate, talented people who want to make a difference."
        cta={{ label: "View Open Roles", href: "/careers" }}
      />
    </>
  );
}
