"use client";

import { useState, FormEvent } from "react";
import Hero from "@/components/Hero";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { siteConfig } from "@/lib/content";
import { motion } from "framer-motion";

// ============================================================================
// Contact Page — Form with client-side validation + info sidebar
// ============================================================================

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Hero
        headline="Let's Talk"
        subtext="Have a question, a project in mind, or just want to say hello? We'd love to hear from you."
        variant="page"
      />

      <section className="py-24 md:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimateOnScroll type="fade-up">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 md:p-12 rounded-2xl bg-white border border-gray-200 text-center"
                  >
                    <span className="text-5xl block mb-4">✅</span>
                    <h2 className="text-2xl font-bold text-forest font-[family-name:var(--font-heading)]">
                      Message Sent!
                    </h2>
                    <p className="mt-3 text-gray-500">
                      Thanks for reaching out. We&apos;ll get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 text-emerald font-semibold hover:text-emerald-dark transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-8 md:p-12 rounded-2xl bg-white border border-gray-200 space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-forest font-[family-name:var(--font-heading)] mb-2">
                      Send us a message
                    </h2>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-charcoal mb-2"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-xl border bg-sand text-charcoal placeholder:text-gray-400 focus:ring-2 focus:ring-emerald focus:border-emerald transition-all duration-300 ${
                          errors.name ? "border-ember" : "border-gray-200"
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-ember">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-semibold text-charcoal mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-xl border bg-sand text-charcoal placeholder:text-gray-400 focus:ring-2 focus:ring-emerald focus:border-emerald transition-all duration-300 ${
                          errors.email ? "border-ember" : "border-gray-200"
                        }`}
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-ember">{errors.email}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-charcoal mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl border bg-sand text-charcoal placeholder:text-gray-400 focus:ring-2 focus:ring-emerald focus:border-emerald transition-all duration-300 resize-y ${
                          errors.message ? "border-ember" : "border-gray-200"
                        }`}
                        placeholder="Tell us about your project or question..."
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-sm text-ember">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit error */}
                    {submitError && (
                      <div className="p-4 rounded-xl bg-ember/10 border border-ember/20 text-ember text-sm">
                        {submitError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-forest text-sand font-bold text-lg rounded-xl hover:bg-emerald-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            className="inline-block w-5 h-5 border-2 border-sand/30 border-t-sand rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </AnimateOnScroll>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2">
              <AnimateOnScroll type="fade-up" delay={0.15}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Email
                    </h3>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-forest font-semibold text-lg hover:text-emerald transition-colors duration-300"
                    >
                      {siteConfig.email}
                    </a>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Phone
                    </h3>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-forest font-semibold text-lg hover:text-emerald transition-colors duration-300"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Address
                    </h3>
                    <p className="text-forest font-medium leading-relaxed">
                      {siteConfig.address}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      {Object.entries(siteConfig.socials).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-emerald hover:text-sand transition-all duration-300"
                            aria-label={platform}
                          >
                            <span className="text-xs font-bold uppercase">
                              {platform[0]}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-forest/5 to-emerald/5 border border-gray-200 aspect-[4/3] flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl" role="img" aria-label="Map pin">
                        📍
                      </span>
                      <p className="text-gray-400 text-sm mt-3">
                        Portland, Oregon
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        Map placeholder
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
