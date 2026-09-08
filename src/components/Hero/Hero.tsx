import { motion, type Variants } from "framer-motion";
import type { HeroData } from "../../data/hero";
import { navSocialProfiles } from "../../data/social";

interface HeroProps {
  data: HeroData;
}

// ─── Animation variants ────────────────────────────────────────────────────

/** Container: orchestrates all monograph children with a stagger */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

/**
 * Each word rises from beneath its overflow mask.
 * The mask uses `pb-3 -mb-3 pt-1 -mt-1` to give descenders (`g j p y`)
 * breathing room so they are never visually clipped.
 */
const wordVariants: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade + slide up for eyebrow, role, thesis, and action bar */
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

const Hero = ({ data }: HeroProps) => {
  const eyebrowText = data.eyebrow ?? data.greeting ?? "Senior Software Engineer & Architect";
  const primaryAction = {
    label: data.actions?.primary?.label ?? data.primaryCta?.text ?? "Explore Selected Work",
    href: data.actions?.primary?.href ?? data.primaryCta?.href ?? "#projects",
  };
  const secondaryAction = {
    label: data.actions?.secondary?.label ?? data.secondaryCta?.text ?? "View Resume",
    href: data.actions?.secondary?.href ?? data.secondaryCta?.href ?? "#contact",
  };

  const nameWords = data.name.split(" ");

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      {/* ── Decorative radial glow ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Inner constrained container with standardized responsive gutters ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* ── 12-Column Responsive Grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Editorial Monograph (7-column span) ── */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Metadata Eyebrow with Leading Cyan Hairline */}
            <motion.div
              id="hero-eyebrow"
              variants={fadeUpVariants}
              className="flex items-center gap-3 mb-6 sm:mb-8"
            >
              <span className="h-px flex-shrink-0 w-8 bg-cyan-500/70 dark:bg-cyan-400/60" />
              <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-cyan-600 dark:text-cyan-400 font-mono">
                <span className="text-sky-500 dark:text-sky-400 mr-1.5">//</span>
                {eyebrowText}
              </p>
            </motion.div>

            {/* Commanding H1 with Descender Protection & Surname Cyan Accent */}
            <h1
              aria-label={data.name}
              className="font-black leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              {nameWords.map((word, i) => {
                const isSurname = i === nameWords.length - 1;
                return (
                  <span
                    key={i}
                    className="overflow-hidden inline-block pb-3 -mb-3 pt-1 -mt-1 mr-[0.25em] last:mr-0"
                  >
                    <motion.span
                      variants={wordVariants}
                      className="inline-block"
                      aria-hidden="true"
                    >
                      {isSurname ? (
                        <span
                          data-accent="true"
                          className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent"
                        >
                          {word}
                        </span>
                      ) : (
                        <span className="text-slate-900 dark:text-white">
                          {word}
                        </span>
                      )}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            {/* Professional Role Title */}
            <motion.h2
              variants={fadeUpVariants}
              aria-label={data.title}
              className="text-xl sm:text-2xl font-semibold text-slate-600 dark:text-slate-300 leading-snug mb-6 tracking-tight"
            >
              {data.title}
            </motion.h2>

            {/* Executive Engineering Thesis */}
            {data.thesis && (
              <motion.p
                variants={fadeUpVariants}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-8 sm:mb-10"
              >
                {data.thesis}
              </motion.p>
            )}

            {/* Architectural Action Row & Micro-Social Links */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-2"
            >
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href={primaryAction.href}
                  id="hero-cta-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    group inline-flex items-center gap-2 px-6 py-3.5
                    text-sm font-semibold rounded-xl
                    bg-cyan-500/10 dark:bg-cyan-400/10
                    text-cyan-700 dark:text-cyan-300
                    border border-cyan-500/30 dark:border-cyan-400/25
                    hover:bg-cyan-500/20 dark:hover:bg-cyan-400/20
                    hover:border-cyan-500/50 dark:hover:border-cyan-400/40
                    hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                    transition-all duration-200
                  "
                >
                  <span>{primaryAction.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-cyan-500 dark:text-cyan-400 transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </motion.a>

                <motion.a
                  href={secondaryAction.href}
                  id="hero-cta-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    inline-flex items-center gap-2 px-6 py-3.5
                    text-sm font-semibold rounded-xl
                    text-slate-700 dark:text-slate-300
                    bg-white/50 dark:bg-slate-900/50
                    border border-slate-200/80 dark:border-white/10
                    hover:border-sky-500 dark:hover:border-sky-400
                    hover:text-cyan-600 dark:hover:text-cyan-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                    transition-all duration-200
                  "
                >
                  <span>{secondaryAction.label}</span>
                  <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">
                    ↗
                  </span>
                </motion.a>
              </div>

              {/* Subtle vertical separator on sm+ screens */}
              <span
                className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-white/10"
                aria-hidden="true"
              />

              {/* Verified Micro-Social Links */}
              <div id="hero-social-links" className="flex items-center gap-1.5">
                {navSocialProfiles.map((profile) => (
                  <motion.a
                    key={profile.id}
                    href={profile.href}
                    target={profile.external ? "_blank" : undefined}
                    rel={profile.external ? "noopener noreferrer" : undefined}
                    aria-label={profile.ariaLabel}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      p-2.5 rounded-lg
                      text-slate-500 dark:text-slate-400
                      hover:text-cyan-600 dark:hover:text-cyan-400
                      hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10
                      border border-transparent hover:border-cyan-500/20 dark:hover:border-cyan-400/20
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                      transition-colors duration-200
                    "
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={profile.iconPath} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Reserved for Executive Telemetry Card (Issue 03) ── */}
          <div
            className="lg:col-span-5 w-full"
            data-testid="hero-telemetry-column"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
