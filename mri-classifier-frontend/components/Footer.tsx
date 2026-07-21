import Link from "next/link";
import { Activity, ShieldAlert, Award, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-deep border-t border-border-slate text-text-muted" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand/System */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface border border-teal-accent/20 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-teal-accent" />
              </div>
              <span className="text-base font-bold text-text-primary uppercase tracking-wider font-heading">
                NeuroScan AI
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-md text-text-muted/80">
              An advanced deep learning classification platform benchmarked on transfer learning models (Xception, MobileNetV2, InceptionV3, ResNet50, VGG16, DenseNet121) for accurate brain tumor categorization from MRI scans.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com"
                className="w-10 h-10 rounded-lg bg-surface border border-border-slate flex items-center justify-center hover:bg-surface-light hover:text-teal-accent hover:border-teal-accent/30 transition-all duration-300"
                aria-label="GitHub Repository"
              >
                <svg
                  className="w-4.5 h-4.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Core Citation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-accent" />
              Academic Reference & Dataset
            </h3>
            <div className="space-y-4 text-xs">
              <blockquote className="border-l-2 border-teal-accent/30 pl-4 py-1 italic leading-relaxed text-text-muted/90">
                &ldquo;Advanced Brain Tumor Classification in MR Images Using Transfer Learning and Pre-Trained Deep CNN Models&rdquo;
                <span className="block mt-1 font-semibold text-text-primary">
                  — Disci, Gurcan & Soylu, Cancers 2025, 17, 121
                </span>
              </blockquote>
              <div className="flex items-start gap-2 text-text-muted/70">
                <Award className="w-4 h-4 text-teal-accent flex-shrink-0 mt-0.5" />
                <p>
                  Trained and evaluated on the public <strong>Kaggle Brain Tumor MRI Dataset</strong> (by Masoud Nickparvar) containing 7,023 high-quality brain MRI scans categorized across Glioma, Meningioma, Pituitary, and No Tumor.
                </p>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-text-dim">
                <ShieldAlert className="w-4 h-4 text-alert-red/70 flex-shrink-0" />
                <p>
                  Disclaimer: This system is a research demonstration project and a portfolio showcase. It is not intended for primary clinical diagnostics, medical consultation, or therapeutic decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border-slate/55 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {currentYear} NeuroScan AI. All rights reserved.
          </p>
          <p className="text-text-dim">
            Research-grade Portfolio Showcase 🔬
          </p>
        </div>
      </div>
    </footer>
  );
}
