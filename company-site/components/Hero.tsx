"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ============================================================================
// Hero — Full-viewport hero with bold manifesto headline and animated background
// ============================================================================

interface HeroProps {
  headline: string;
  headlineAccent?: string;
  subtext: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  variant?: "home" | "page";
}

export default function Hero({
  headline,
  headlineAccent,
  subtext,
  cta,
  ctaSecondary,
  variant = "home",
}: HeroProps) {
  const isHome = variant === "home";

  return (
    <section
      className={`relative overflow-hidden ${
        isHome ? "min-h-screen flex items-center" : "pt-32 pb-20 md:pt-40 md:pb-28"
      } bg-forest`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Large gradient orb */}
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald/15 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Small lime accent */}
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-lime/8 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(163,230,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-6 ${isHome ? "py-20" : ""}`}>
        <div className={isHome ? "max-w-4xl" : "max-w-3xl mx-auto text-center"}>
          {/* Main headline */}
          <motion.h1
            className={`font-bold tracking-tight leading-[1.1] text-sand ${
              isHome
                ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {headline}
            {headlineAccent && (
              <>
                <br />
                <span className="text-lime">{headlineAccent}</span>
              </>
            )}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className={`mt-6 md:mt-8 text-sand/70 leading-relaxed ${
              isHome
                ? "text-lg md:text-xl max-w-2xl"
                : "text-lg max-w-xl mx-auto"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {subtext}
          </motion.p>

          {/* CTAs */}
          {(cta || ctaSecondary) && (
            <motion.div
              className={`mt-10 flex flex-wrap gap-4 ${
                isHome ? "" : "justify-center"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {cta && (
                <Link
                  href={cta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-forest font-bold text-lg rounded-full hover:bg-lime-dark hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-lime/20"
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
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sand/20 text-sand font-semibold text-lg rounded-full hover:border-sand/40 hover:bg-sand/5 transition-all duration-300"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>

        {/* Scroll indicator (home only) */}
        {isHome && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-sand/40 text-xs uppercase tracking-widest">
              Scroll
            </span>
            <motion.div
              className="w-px h-8 bg-sand/20"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
