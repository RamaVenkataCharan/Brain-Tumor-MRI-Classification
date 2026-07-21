"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// Card — Multi-purpose card with hover interactions and optional expansion
// ============================================================================

interface CardProps {
  title: string;
  description: string;
  details?: string;
  icon?: string;
  variant?: "default" | "dark" | "outlined";
  expandable?: boolean;
}

export default function Card({
  title,
  description,
  details,
  icon,
  variant = "default",
  expandable = false,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const baseStyles =
    "group relative rounded-2xl p-6 md:p-8 transition-all duration-500 cursor-default";

  const variantStyles = {
    default:
      "bg-white border border-gray-200 hover:border-emerald/30 hover:shadow-lg hover:shadow-emerald/5",
    dark: "bg-forest text-sand border border-forest-light hover:border-emerald/40 hover:shadow-lg hover:shadow-emerald/10",
    outlined:
      "bg-transparent border-2 border-gray-200 hover:border-emerald hover:bg-white/50",
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => expandable && setIsExpanded(!isExpanded)}
      role={expandable ? "button" : undefined}
      tabIndex={expandable ? 0 : undefined}
      onKeyDown={(e) => {
        if (expandable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      aria-expanded={expandable ? isExpanded : undefined}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald/5 to-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {icon && (
          <span className="text-3xl md:text-4xl block mb-4" role="img" aria-hidden="true">
            {icon}
          </span>
        )}
        <h3
          className={`text-xl md:text-2xl font-bold mb-3 font-[family-name:var(--font-heading)] ${
            variant === "dark" ? "text-sand" : "text-forest"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-base leading-relaxed ${
            variant === "dark" ? "text-sand/70" : "text-gray-500"
          }`}
        >
          {description}
        </p>

        {/* Expandable details */}
        {expandable && details && (
          <>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={`mt-4 pt-4 border-t text-sm leading-relaxed ${
                      variant === "dark"
                        ? "text-sand/60 border-sand/10"
                        : "text-gray-400 border-gray-200"
                    }`}
                  >
                    {details}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className={`mt-4 text-sm font-medium flex items-center gap-1 ${
                variant === "dark" ? "text-lime" : "text-emerald"
              }`}
            >
              {isExpanded ? "Show less" : "Learn more"}
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                ↓
              </motion.span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
