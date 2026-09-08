import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ExperienceData, ExperienceMetric } from "../../data/experience";
import { QuarterCircleArc } from "../CornerBubble";
import SectionScaffold from "../SectionScaffold/SectionScaffold";

// ─── Accent palette ────────────────────────────────────────────────────────────
const METRIC_ACCENT = {
  emerald: {
    tag: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    glow: "rgba(16,185,129,0.45)",
    glowSoft: "rgba(16,185,129,0.12)",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  sky: {
    tag: "bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-400",
    glow: "rgba(14,165,233,0.45)",
    glowSoft: "rgba(14,165,233,0.12)",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
  cobalt: {
    tag: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
    glow: "rgba(37,99,235,0.45)",
    glowSoft: "rgba(37,99,235,0.12)",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  amber: {
    tag: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
    glow: "rgba(245,158,11,0.45)",
    glowSoft: "rgba(245,158,11,0.12)",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  cyan: {
    tag: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    glow: "rgba(6,182,212,0.45)",
    glowSoft: "rgba(6,182,212,0.12)",
    dot: "bg-cyan-500 dark:bg-cyan-400",
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
      whileHover={{ y: -2, scale: 1.04 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "border text-xs font-semibold tracking-wide whitespace-nowrap",
        "cursor-default",
        a.tag,
      ].join(" ")}
      style={{
        boxShadow: `0 0 10px ${a.glow}`,
        transition: "box-shadow 0.25s ease",
      }}
      onHoverStart={(e) => {
        const el = (e.target as HTMLElement);
        el.style.boxShadow = `0 0 18px ${a.glow}, 0 0 6px ${a.glowSoft}`;
      }}
      onHoverEnd={(e) => {
        const el = (e.target as HTMLElement);
        el.style.boxShadow = `0 0 10px ${a.glow}`;
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
  const [hovered, setHovered] = useState(false);
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "editorial-glass group relative",
        "grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0",
        "rounded-2xl overflow-hidden",
        /* Adaptive dual-mode glass */
        "backdrop-blur-sm lg:backdrop-blur-xl",
        "bg-white/80 dark:bg-slate-900/80",
        "lg:bg-white/20 lg:dark:bg-slate-900/40",
        "border border-slate-200/80 dark:border-white/8",
        "transition-all duration-400",
        !isLast ? "mb-5" : "",
      ].join(" ")}
      style={{
        boxShadow: hovered
          ? "0 16px 48px rgba(14,165,233,0.10), 0 0 0 1px rgba(14,165,233,0.22)"
          : "none",
        borderColor: hovered ? "rgba(14,165,233,0.28)" : undefined,
      }}
    >
      {/* Quarter-circle arc motif — bottom-right */}
      <QuarterCircleArc
        corner="br"
        color="#0ea5e9"
        size={80}
        opacity={hovered ? 0.28 : 0.14}
      />

      {/* Top-edge hairline glow */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        animate={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.7) 50%, transparent 100%)",
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Radial hover spotlight */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? "radial-gradient(ellipse at 80% 30%, rgba(14,165,233,0.07) 0%, transparent 60%)"
            : "none",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Hover inner-glow overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(6,182,212,0.03) 100%)",
        }}
      />

      {/* ── LEFT COLUMN — sticky metadata ─────────────────────────────────────── */}
      <div
        className={[
          "relative flex flex-col gap-2",
          /* Vertical divider on md+ */
          "md:border-r border-b md:border-b-0 border-slate-200/60 dark:border-white/8",
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
          className="text-[11px] font-bold tracking-[0.22em] uppercase text-sky-600 dark:text-sky-400/80 mb-1"
        >
          {item.period}
        </motion.span>

        {/* Company */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, delay: rowDelay + 0.1 }}
          className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
        >
          {item.company}
        </motion.p>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, delay: rowDelay + 0.15 }}
          className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-snug"
        >
          {item.role}
        </motion.p>

        {/* Full duration */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.45, delay: rowDelay + 0.22 }}
          className="mt-auto inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400 tracking-wide pt-3"
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
              "linear-gradient(90deg, rgba(14,165,233,0.8) 0%, transparent 70%)",
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
              className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
            >
              {/* Bullet chevron */}
              <span
                className="mt-1 shrink-0 text-sky-500/60 text-xs select-none"
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
    triggerOnce: true,
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
    <SectionScaffold
      id="experience"
      eyebrow={data.title}
      headline="Career impact, measured."
      accentWord="measured."
      subtitle="Seven years building at scale — measured in metrics that moved the needle."
    >
      {/* Full-height wrapper — ref spans all content so inView tracks correctly */}
      <div ref={sectionRef}>

      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-sky-500/6 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-cyan-500/4 blur-3xl" />
      </div>

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
      </div>{/* end full-height ref wrapper */}
    </SectionScaffold>
  );
};

export default Experience;
