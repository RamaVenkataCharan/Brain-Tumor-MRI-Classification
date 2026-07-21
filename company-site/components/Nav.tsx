"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/content";

// ============================================================================
// Nav — Sticky header with scroll-aware styling + mobile hamburger menu
// ============================================================================

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-forest/95 backdrop-blur-md shadow-lg shadow-forest/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label={`${siteConfig.name} home`}
        >
          {/* Leaf icon */}
          <svg
            className="w-8 h-8 text-lime group-hover:rotate-12 transition-transform duration-300"
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16 2C8 2 2 10 2 18c0 2 .5 4 1.5 5.5.5.8 1.5.5 1.5-.5 0-3 2-8 6-11 4-3 9-4 13-3 1 .2 1.5-.8.8-1.5C21.5 4 18.5 2 16 2z" />
            <path
              d="M8 28c1-3 3-6 6-8s7-3 10-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-bold text-sand font-[family-name:var(--font-heading)] tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? "text-forest bg-lime"
                      : "text-sand/80 hover:text-sand hover:bg-sand/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA button (desktop) */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 bg-emerald text-sand font-semibold text-sm rounded-full hover:bg-emerald-dark transition-colors duration-300"
        >
          Get in Touch
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center text-sand"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              className="block w-6 h-0.5 bg-sand origin-center"
              animate={isMobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-sand"
              animate={isMobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-sand origin-center"
              animate={
                isMobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3 }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-forest/98 backdrop-blur-lg border-t border-sand/10 overflow-hidden"
          >
            <ul className="px-6 py-6 space-y-1" role="list">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 px-4 text-lg font-medium rounded-xl transition-colors duration-300 ${
                        isActive
                          ? "text-forest bg-lime"
                          : "text-sand/80 hover:text-sand hover:bg-sand/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <Link
                  href="/contact"
                  className="block mt-4 py-3 px-4 text-center text-lg font-bold bg-emerald text-sand rounded-xl hover:bg-emerald-dark transition-colors duration-300"
                >
                  Get in Touch
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
