import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

// ============================================================================
// CTASection — Full-width call-to-action block
// ============================================================================

interface CTASectionProps {
  headline: string;
  subtext?: string;
  cta: { label: string; href: string };
  variant?: "dark" | "gradient";
}

export default function CTASection({
  headline,
  subtext,
  cta,
  variant = "dark",
}: CTASectionProps) {
  const bgStyles =
    variant === "gradient"
      ? "bg-gradient-to-br from-forest via-emerald-dark to-forest"
      : "bg-forest";

  return (
    <section className={`${bgStyles} py-24 md:py-32 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <AnimateOnScroll type="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sand tracking-tight leading-tight">
            {headline}
          </h2>
        </AnimateOnScroll>

        {subtext && (
          <AnimateOnScroll type="fade-up" delay={0.15}>
            <p className="mt-6 text-lg md:text-xl text-sand/70 max-w-2xl mx-auto leading-relaxed">
              {subtext}
            </p>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll type="fade-up" delay={0.3}>
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-lime text-forest font-bold text-lg rounded-full hover:bg-lime-dark hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-lime/20"
          >
            {cta.label}
            <svg
              className="w-5 h-5"
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
  );
}
