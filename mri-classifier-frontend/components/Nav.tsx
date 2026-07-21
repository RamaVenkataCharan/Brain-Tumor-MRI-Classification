"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X, ArrowRight } from "lucide-react";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isDemoPage = pathname === "/demo";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: isDemoPage ? "/#hero" : "#hero" },
    { label: "Motivation", href: isDemoPage ? "/#motivation" : "#motivation" },
    { label: "Methodology", href: isDemoPage ? "/#methodology" : "#methodology" },
    { label: "Models", href: isDemoPage ? "/#models" : "#models" },
    { label: "Results", href: isDemoPage ? "/#results" : "#results" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-bg-deep/90 backdrop-blur-md border-b border-border-slate py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between" aria-label="Global navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-surface border border-teal-accent/20 flex items-center justify-center group-hover:border-teal-accent/50 transition-colors duration-300">
            <Activity className="w-5 h-5 text-teal-accent animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider uppercase text-text-primary font-heading">
              NeuroScan AI
            </span>
            <span className="text-[10px] text-text-muted font-medium tracking-tight">
              MRI Classifier
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-2" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-teal-accent hover:bg-surface-light/50 rounded-full transition-all duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="hidden md:block">
          {isDemoPage ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 border border-border-slate text-text-primary font-semibold text-xs rounded-full hover:bg-surface-light transition-all duration-300"
            >
              Back to Overview
            </Link>
          ) : (
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-accent text-bg-deep font-bold text-xs uppercase tracking-wider rounded-full hover:bg-teal-light shadow-md shadow-teal-accent/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Live Classifier Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-text-primary rounded-lg border border-border-slate bg-surface/50"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-bg-deep border-b border-border-slate overflow-hidden"
          >
            <ul className="px-6 py-6 space-y-2" role="list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-3 px-4 text-base font-semibold text-text-muted hover:text-teal-accent hover:bg-surface rounded-xl transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                {isDemoPage ? (
                  <Link
                    href="/"
                    onClick={() => setIsMobileOpen(false)}
                    className="block mt-4 py-3 px-4 text-center text-sm font-semibold text-text-primary border border-border-slate rounded-xl hover:bg-surface-light transition-colors"
                  >
                    Back to Overview
                  </Link>
                ) : (
                  <Link
                    href="/demo"
                    onClick={() => setIsMobileOpen(false)}
                    className="block mt-4 py-3.5 px-4 text-center text-sm font-bold bg-teal-accent text-bg-deep rounded-xl hover:bg-teal-light transition-colors"
                  >
                    Live Classifier Demo
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
