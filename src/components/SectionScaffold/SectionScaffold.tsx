import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type React from "react";

// ─── Prop types ────────────────────────────────────────────────────────────

export interface SectionScaffoldProps {
  /** HTML id for the <section> element — drives anchor nav and test ids */
  id: string;
  /** Short uppercase badge label rendered above the headline */
  eyebrow: string;
  /**
   * The commanding headline text.
   * All words receive per-word entrance motion inside an overflow mask with
   * descender compensation (`pb-3 -mb-3 pt-1 -mt-1`).
   */
  headline: string;
  /**
   * Optional word inside `headline` that should receive the gradient-cyan
   * accent treatment. Must match one of the space-split tokens exactly.
   */
  accentWord?: string;
  /** Optional subtitle paragraph rendered beneath the headline */
  subtitle?: string;
  /** Page content slotted below the headline block */
  children?: React.ReactNode;
  /** Extra classes forwarded to the outer <section> */
  className?: string;
}

// ─── Animation variants ────────────────────────────────────────────────────

/** Staggered wrapper that drives all child word reveals */
const headlineContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
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

/** Fade + slide up for the eyebrow badge */
const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade + slide up for the subtitle */
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

const SectionScaffold = ({
  id,
  eyebrow,
  headline,
  accentWord,
  subtitle,
  children,
  className = "",
}: SectionScaffoldProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const words = headline.split(" ");

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-28 overflow-hidden ${className}`}
    >
      {/* ── Inner constrained container with responsive gutters ─────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* ── Eyebrow badge ─────────────────────────────────────────── */}
        <motion.div
          id={`${id}-eyebrow`}
          variants={eyebrowVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex items-center gap-3 mb-8"
        >
          {/* Leading accent hairline */}
          <span className="h-px flex-shrink-0 w-8 bg-cyan-500/70 dark:bg-cyan-400/60" />
          <span
            className="
              text-xs font-semibold tracking-[0.22em] uppercase
              text-cyan-600 dark:text-cyan-400
            "
          >
            {eyebrow}
          </span>
        </motion.div>

        {/* ── Commanding headline ───────────────────────────────────── */}
        <motion.h2
          variants={headlineContainerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          aria-label={headline}
          className="
            font-black leading-[1.05] tracking-tight
            text-slate-900 dark:text-white
            mb-6
          "
          style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}
        >
          {words.map((word, i) => {
            const isAccent = accentWord && word === accentWord;
            return (
              /*
               * Overflow mask with vertical breathing clearance.
               * pb-3 / -mb-3  → bottom padding so descenders (g j p y) are not
               *                  clipped by the mask's lower edge.
               * pt-1 / -mt-1  → top padding to keep ascender overshoot visible.
               */
              <span
                key={i}
                className="overflow-hidden inline-block pb-3 -mb-3 pt-1 -mt-1 mr-[0.25em] last:mr-0"
              >
                <motion.span
                  variants={wordVariants}
                  className="inline-block"
                  aria-hidden="true"
                >
                  {isAccent ? (
                    <span
                      data-accent="true"
                      className="
                        bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500
                        bg-clip-text text-transparent
                      "
                    >
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            );
          })}
        </motion.h2>

        {/* ── Optional subtitle ─────────────────────────────────────── */}
        {subtitle && (
          <motion.p
            data-testid="scaffold-subtitle"
            variants={subtitleVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="
              max-w-2xl text-lg leading-relaxed
              text-slate-600 dark:text-slate-400
              mb-14
            "
          >
            {subtitle}
          </motion.p>
        )}

        {/* ── Slotted page content ───────────────────────────────────── */}
        {children}
      </div>
    </section>
  );
};

export default SectionScaffold;
