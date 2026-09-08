import { motion, useReducedMotion } from "framer-motion";
import type { HeroData } from "../../data/hero";
import { navSocialProfiles } from "../../data/social";
import { QuarterCircleArc } from "../CornerBubble";
import { SkillIcon } from "../Skills";
import {
  getContainerVariants,
  getNameContainerVariants,
  getWordVariants,
  getFadeUpVariants,
  getTelemetryVariants,
} from "./heroVariants";

export interface HeroProps {
  data: HeroData;
  reducedMotion?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────

const Hero = ({ data, reducedMotion }: HeroProps) => {
  const systemReducedMotion = useReducedMotion();
  const isReducedMotion =
    reducedMotion ??
    (Boolean(systemReducedMotion) ||
      (typeof window !== "undefined" &&
        Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)));

  const containerVariants = getContainerVariants(isReducedMotion);
  const nameContainerVariants = getNameContainerVariants(isReducedMotion);
  const wordVariants = getWordVariants(isReducedMotion);
  const fadeUpVariants = getFadeUpVariants(isReducedMotion);
  const telemetryVariants = getTelemetryVariants(isReducedMotion);

  const eyebrowText = data.eyebrow ?? data.greeting ?? "Senior Software Engineer & Architect";
  const primaryAction = {
    label: data.actions?.primary?.label ?? data.primaryCta?.text ?? "Explore Selected Work",
    href: data.actions?.primary?.href ?? data.primaryCta?.href ?? "#projects",
  };
  const secondaryAction = {
    label: data.actions?.secondary?.label ?? data.secondaryCta?.text ?? "View Resume",
    href: data.actions?.secondary?.href ?? data.secondaryCta?.href ?? "#contact",
  };

  const telemetry = data.telemetry ?? {
    status: "Available for Work",
    roleTarget: "Senior Roles",
    location: "New Delhi, India · Global Remote",
    timezone: "UTC+5:30 (IST)",
    focus: [
      "Domain-Driven Design",
      "AI-Native Developer Tooling",
      "Resilient Distributed Systems",
    ],
    coreStack: [
      "React / Next.js",
      "TypeScript",
      "Node.js",
      "LLM Engineering",
    ],
  };

  const nameWords = data.name.split(" ");

  return (
    <section
      id="home"
      data-reduced-motion={isReducedMotion ? "true" : "false"}
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
            initial={isReducedMotion ? false : "hidden"}
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
            <motion.h1
              aria-label={data.name}
              variants={nameContainerVariants}
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
            </motion.h1>

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
                  aria-label={primaryAction.label}
                  whileHover={isReducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={isReducedMotion ? undefined : { scale: 0.98 }}
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
                    focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
                    motion-reduce:transition-none
                    transition-all duration-200
                  "
                >
                  <span>{primaryAction.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-cyan-500 dark:text-cyan-400 motion-reduce:transform-none transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </motion.a>

                <motion.a
                  href={secondaryAction.href}
                  id="hero-cta-secondary"
                  aria-label={secondaryAction.label}
                  whileHover={isReducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={isReducedMotion ? undefined : { scale: 0.98 }}
                  className="
                    inline-flex items-center gap-2 px-6 py-3.5
                    text-sm font-semibold rounded-xl
                    text-slate-700 dark:text-slate-300
                    bg-white/50 dark:bg-slate-900/50
                    border border-slate-200/80 dark:border-white/10
                    hover:border-sky-500 dark:hover:border-sky-400
                    hover:text-cyan-600 dark:hover:text-cyan-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                    focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
                    motion-reduce:transition-none
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
                    whileHover={isReducedMotion ? undefined : { scale: 1.08 }}
                    whileTap={isReducedMotion ? undefined : { scale: 0.95 }}
                    className="
                      p-2.5 rounded-lg
                      text-slate-500 dark:text-slate-400
                      hover:text-cyan-600 dark:hover:text-cyan-400
                      hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10
                      border border-transparent hover:border-cyan-500/20 dark:hover:border-cyan-400/20
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                      focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
                      motion-reduce:transition-none
                      transition-colors duration-200
                    "
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={profile.iconPath} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Executive Telemetry Card (5-column span) ── */}
          <motion.div
            className="lg:col-span-5 w-full"
            data-testid="hero-telemetry-column"
            variants={telemetryVariants}
            initial={isReducedMotion ? false : "hidden"}
            animate="visible"
          >
            <div
              id="hero-telemetry-card"
              data-testid="hero-telemetry-card"
              className="
                group relative overflow-hidden rounded-3xl p-6 sm:p-8
                editorial-glass
                backdrop-blur-sm lg:backdrop-blur-xl
                bg-white/80 dark:bg-slate-900/80
                lg:bg-white/20 lg:dark:bg-slate-900/40
                border border-slate-200/60 dark:border-white/[0.08]
                shadow-sm hover:shadow-xl dark:hover:shadow-cyan-500/10
                motion-reduce:transition-none
                transition-all duration-500
              "
            >
              {/* Corner bubble motif — top-right corner, electric cyan */}
              <QuarterCircleArc
                corner="tr"
                color="#06b6d4"
                size={80}
                opacity={0.18}
              />

              {/* Top edge hairline glow */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none"
              />

              {/* Hover ambient spotlight */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 motion-reduce:transition-none transition-opacity duration-700 bg-gradient-to-br from-cyan-400/8 via-transparent to-blue-500/6 pointer-events-none"
              />

              <div className="relative z-10 flex flex-col space-y-6">
                {/* ── 1. Live Status & Header ── */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    role="status"
                    aria-live="polite"
                    className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20"
                  >
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none ${
                          isReducedMotion ? "" : "animate-ping"
                        }`}
                      />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400"
                    >
                      {telemetry.status} {telemetry.roleTarget ? `/ ${telemetry.roleTarget}` : ""}
                    </span>
                    <span className="sr-only">
                      {`Status: ${telemetry.status}, Target: ${telemetry.roleTarget}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 select-none">
                    TELEMETRY // 01
                  </span>
                </div>

                {/* ── 2. Operational Coordinates (Location & Timezone) ── */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 21c-4.418-4.418-7-8.5-7-12a7 7 0 1114 0c0 3.5-2.582 7.582-7 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {telemetry.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 font-mono text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pl-6.5">
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{telemetry.timezone}</span>
                  </div>
                </div>

                {/* ── 3. Active Engineering Focus ── */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-mono font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                      Active Engineering Focus
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      DOMAINS
                    </span>
                  </div>
                  <ul className="space-y-2" aria-label="Active engineering focus areas">
                    {telemetry.focus.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 dark:bg-cyan-400/80 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── 4. Core Architecture Capability Chips ── */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-mono font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                      Core Architecture Anchors
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      STACK
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2" aria-label="Core technology stack">
                    {telemetry.coreStack.map((tech) => (
                      <div
                        key={tech}
                        className="
                          inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                          text-xs font-medium
                          bg-white/60 dark:bg-white/[0.04]
                          text-slate-700 dark:text-slate-200
                          border border-slate-200/80 dark:border-white/[0.08]
                          hover:border-cyan-500/40 dark:hover:border-cyan-400/30
                          hover:bg-cyan-500/5 dark:hover:bg-cyan-400/5
                          motion-reduce:transition-none
                          transition-colors duration-150 select-none
                        "
                      >
                        <SkillIcon
                          name={tech}
                          className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0"
                        />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

