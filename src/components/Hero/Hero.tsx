import { motion, type Variants } from "framer-motion";
import type { HeroData } from "../../data/hero";

interface HeroProps {
  data: HeroData;
}

// ─── Animation variants ────────────────────────────────────────────────────

/** Container: orchestrates all children with a stagger */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

/** Each word inside the heading rises from below a clip mask */
const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade + slide up for subtitle lines and CTAs */
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Splits a string into words and wraps each in a clip container */
function AnimatedWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="hero-clip mr-[0.25em] last:mr-0">
          <motion.span
            variants={wordVariants}
            className="inline-block"
            aria-hidden="true"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

const Hero = ({ data }: HeroProps) => {
  const eyebrowText = data.eyebrow ?? data.greeting;
  const primaryAction = {
    label: data.actions?.primary?.label ?? data.primaryCta?.text ?? "Explore Selected Work",
    href: data.actions?.primary?.href ?? data.primaryCta?.href ?? "#projects",
  };
  const secondaryAction = {
    label: data.actions?.secondary?.label ?? data.secondaryCta?.text ?? "View Resume",
    href: data.actions?.secondary?.href ?? data.secondaryCta?.href ?? "#contact",
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4 sm:px-8 lg:px-16"
    >
      {/* ── Decorative radial glow ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(14,165,233,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ──────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUpVariants}
          className="text-sky-500 dark:text-sky-400 text-base sm:text-lg font-medium tracking-widest uppercase mb-6"
        >
          {eyebrowText}
        </motion.p>

        {/* Name — static high-contrast typography */}
        <h1
          className="font-black leading-none mb-6"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          <AnimatedWords
            text={data.name}
            className="text-slate-900 dark:text-white"
          />
        </h1>

        {/* Title — large, slightly muted */}
        <h2
          className="font-bold text-slate-600 dark:text-slate-300 leading-tight mb-6"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 3rem)" }}
        >
          <AnimatedWords text={data.title} />
        </h2>

        {/* Executive Thesis */}
        {data.thesis && (
          <motion.p
            variants={fadeUpVariants}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {data.thesis}
          </motion.p>
        )}

        {/* CTA row */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href={primaryAction.href}
            id="hero-cta-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary btn-glow px-8 py-4 text-base font-semibold rounded-xl"
          >
            {primaryAction.label}
          </motion.a>

          <motion.a
            href={secondaryAction.href}
            id="hero-cta-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 text-base font-semibold rounded-xl text-slate-600 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300"
          >
            {secondaryAction.label}
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
