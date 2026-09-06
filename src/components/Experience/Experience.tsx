import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ExperienceData, ExperienceMetric } from "../../data/experience";

// ─── Accent palette ────────────────────────────────────────────────────────────
const METRIC_ACCENT = {
  emerald: {
    tag: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    glow: "rgba(16,185,129,0.45)",
    dot: "bg-emerald-400",
  },
  indigo: {
    tag: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    glow: "rgba(99,102,241,0.45)",
    dot: "bg-indigo-400",
  },
  violet: {
    tag: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    glow: "rgba(139,92,246,0.45)",
    dot: "bg-violet-400",
  },
  amber: {
    tag: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    glow: "rgba(245,158,11,0.45)",
    dot: "bg-amber-400",
  },
  cyan: {
    tag: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    glow: "rgba(6,182,212,0.45)",
    dot: "bg-cyan-400",
  },
} as const;

// ─── Metric Tag ───────────────────────────────────────────────────────────────
function MetricTag({
  metric,
  delay,
  inView,
}: {
  metric: ExperienceMetric;
  delay: number;
  inView: boolean;
}) {
  const a = METRIC_ACCENT[metric.accent];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 6 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 6 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "border text-xs font-semibold tracking-wide whitespace-nowrap",
        "shadow-sm",
        a.tag,
      ].join(" ")}
      style={{
        boxShadow: `0 0 10px ${a.glow}`,
      }}
    >
      {/* Pulsing dot */}
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${a.dot} opacity-80`}
        aria-hidden="true"
      />
      {metric.label}
    </motion.span>
  );
}

// ─── Ledger Row ───────────────────────────────────────────────────────────────
function LedgerRow({
  item,
  index,
  inView,
  isLast,
}: {
  item: ExperienceData["items"][number];
  index: number;
  inView: boolean;
  isLast: boolean;
}) {
  const rowDelay = 0.1 + index * 0.18;

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay: rowDelay },
    },
  };

  return (
    <motion.article
      id={`exp-${item.id}`}
      variants={rowVariants}
      aria-label={`${item.role} at ${item.company}`}
      className={[
        "group relative",
        "grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0",
        "rounded-2xl overflow-hidden",
        /* Glass card surface */
        "bg-white/[0.03] dark:bg-white/[0.03]",
        "border border-white/10 dark:border-white/8",
        "backdrop-blur-xl",
        "transition-shadow duration-300",
        "hover:shadow-xl hover:shadow-indigo-500/5",
        !isLast ? "mb-5" : "",
      ].join(" ")}
    >
      {/* Hover inner-glow overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.03) 100%)",
        }}
      />

      {/* ── LEFT COLUMN — sticky metadata ─────────────────────────────────────── */}
      <div
        className={[
          "relative flex flex-col gap-2",
          /* Vertical divider on md+ */
          "md:border-r border-b md:border-b-0 border-white/8",
          /* Soft left-accent gradient */
          "bg-white/[0.02] dark:bg-white/[0.02]",
          "p-6 md:p-7 md:pr-6",
        ].join(" ")}
      >
        {/* Year stamp */}
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, delay: rowDelay + 0.05 }}
          className="text-[11px] font-bold tracking-[0.22em] uppercase text-indigo-400/80 mb-1"
        >
          {item.period}
        </motion.span>

        {/* Company */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, delay: rowDelay + 0.1 }}
          className="text-lg font-bold text-white leading-tight"
        >
          {item.company}
        </motion.p>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, delay: rowDelay + 0.15 }}
          className="text-sm font-medium text-slate-400 leading-snug"
        >
          {item.role}
        </motion.p>

        {/* Full duration */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.45, delay: rowDelay + 0.22 }}
          className="mt-auto inline-block text-[11px] font-mono text-slate-500 dark:text-slate-600 tracking-wide pt-3"
        >
          {item.duration}
        </motion.span>
      </div>

      {/* ── RIGHT COLUMN — impact ──────────────────────────────────────────────── */}
      <div className="relative p-6 md:p-7">
        {/* Metric tags */}
        <div className="flex flex-wrap gap-2 mb-6" aria-label="Key impact metrics">
          {item.metrics.map((m, i) => (
            <MetricTag
              key={m.label}
              metric={m}
              inView={inView}
              delay={rowDelay + 0.2 + i * 0.08}
            />
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-5 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(99,102,241,0.8) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Impact bullets */}
        <ul className="space-y-3" aria-label="Impact details">
          {item.impact.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
              transition={{
                duration: 0.45,
                delay: rowDelay + 0.35 + i * 0.07,
                ease: "easeOut",
              }}
              className="flex items-start gap-3 text-sm leading-relaxed text-slate-400 dark:text-slate-400"
            >
              {/* Bullet chevron */}
              <span
                className="mt-1 shrink-0 text-indigo-500/60 text-xs select-none"
                aria-hidden="true"
              >
                ▹
              </span>
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

// ─── Experience section ────────────────────────────────────────────────────────
interface ExperienceProps {
  data: ExperienceData;
}

const Experience = ({ data }: ExperienceProps) => {
  const [sectionRef, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.05 },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-violet-500/4 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px flex-1 max-w-8 bg-indigo-500/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400">
            {data.title}
          </span>
        </motion.div>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
        >
          {data.title}
        </motion.h2>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="text-slate-400 text-base mb-16 max-w-xl"
        >
          Seven years building at scale — measured in metrics that moved the needle.
        </motion.p>

        {/* Executive Ledger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col"
          role="list"
          aria-label="Career history"
        >
          {data.items.map((item, index) => (
            <LedgerRow
              key={item.id}
              item={item}
              index={index}
              inView={inView}
              isLast={index === data.items.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
