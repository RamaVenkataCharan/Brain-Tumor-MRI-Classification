import AnimateOnScroll from "./AnimateOnScroll";

// ============================================================================
// SectionHeading — Consistent section title + optional subtitle
// ============================================================================

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean; // true = white text (for dark backgrounds)
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <AnimateOnScroll type="fade-up" className="mb-12 md:mb-16">
      <div className={align === "center" ? "text-center" : "text-left"}>
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
            light ? "text-sand" : "text-forest"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-4 text-lg md:text-xl max-w-2xl leading-relaxed ${
              align === "center" ? "mx-auto" : ""
            } ${light ? "text-sand/70" : "text-gray-500"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AnimateOnScroll>
  );
}
