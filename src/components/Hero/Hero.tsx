import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
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

/** Slower fade-in for the scroll indicator */
const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.1 },
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
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax — ghost background word drifts up as you scroll,
  // keeping the experience alive without locking scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const ghostY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [0.05, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4 sm:px-8 lg:px-16"
    >
      {/* ── Ghost background word (parallax) ───────────────────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        style={{ y: ghostY, opacity: ghostOpacity }}
      >
        <span
          className="font-black text-slate-900 dark:text-white uppercase tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 25vw, 22rem)",
            lineHeight: 1,
          }}
        >
          PORTFOLIO
        </span>
      </motion.div>

      {/* ── Decorative radial glow ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ──────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.p
          variants={fadeUpVariants}
          className="text-indigo-500 dark:text-indigo-400 text-base sm:text-lg font-medium tracking-widest uppercase mb-6"
        >
          {data.greeting}
        </motion.p>

        {/* Name — massive gradient heading */}
        <h1
          className="font-black leading-none mb-6"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          <AnimatedWords
            text={data.name}
            className="hero-name-gradient"
          />
        </h1>

        {/* Title — large, slightly muted */}
        <h2
          className="font-bold text-slate-600 dark:text-slate-300 leading-tight mb-10"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 3rem)" }}
        >
          <AnimatedWords text={data.title} />
        </h2>

        {/* CTA row */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href={data.primaryCta.href}
            id="hero-cta-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary btn-glow px-8 py-4 text-base font-semibold rounded-xl"
          >
            {data.primaryCta.text}
          </motion.a>

          <motion.a
            href={data.secondaryCta.href}
            id="hero-cta-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 text-base font-semibold rounded-xl text-slate-600 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300"
          >
            {data.secondaryCta.text}
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase text-slate-400 dark:text-slate-500">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400 dark:text-slate-500"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
