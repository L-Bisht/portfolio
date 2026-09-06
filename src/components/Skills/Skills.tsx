import { useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SkillsData, ArchitecturalTier } from "../../data/skills";

// ─── Accent palette ───────────────────────────────────────────────────────────
const ACCENT = {
  indigo: {
    glow: "rgba(99,102,241,0.55)",
    glowSoft: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.35)",
    badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    chip: "hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-indigo-300 hover:shadow-indigo-500/20",
    chipDescriptor: "text-indigo-400/80",
    connector: "from-indigo-500/40 to-transparent",
    ambientTop: "bg-indigo-500/8",
    ambientBot: "bg-indigo-600/6",
  },
  violet: {
    glow: "rgba(139,92,246,0.55)",
    glowSoft: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.35)",
    badge: "text-violet-400 bg-violet-500/10 border-violet-500/25",
    chip: "hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300 hover:shadow-violet-500/20",
    chipDescriptor: "text-violet-400/80",
    connector: "from-violet-500/40 to-transparent",
    ambientTop: "bg-violet-500/8",
    ambientBot: "bg-violet-600/6",
  },
  cyan: {
    glow: "rgba(6,182,212,0.55)",
    glowSoft: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.35)",
    badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    chip: "hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-cyan-500/20",
    chipDescriptor: "text-cyan-400/80",
    connector: "from-cyan-500/40 to-transparent",
    ambientTop: "bg-cyan-500/8",
    ambientBot: "bg-cyan-600/6",
  },
} as const;

// ─── Chip ─────────────────────────────────────────────────────────────────────
function CapabilityChip({
  name,
  descriptor,
  accent,
}: {
  name: string;
  descriptor?: string;
  accent: keyof typeof ACCENT;
}) {
  const [hovered, setHovered] = useState(false);
  const a = ACCENT[accent];

  return (
    <motion.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "relative inline-flex flex-col items-start gap-0.5",
        "px-3.5 py-2 rounded-xl cursor-default select-none",
        "border border-white/10 dark:border-white/8",
        "bg-white/5 dark:bg-white/3",
        "text-slate-300 dark:text-slate-300",
        "text-sm font-medium leading-tight",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200",
        a.chip,
      ].join(" ")}
      aria-label={descriptor ? `${name}: ${descriptor}` : name}
    >
      <span>{name}</span>
      <AnimatePresence>
        {hovered && descriptor && (
          <motion.span
            key="descriptor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-[10px] font-normal leading-none overflow-hidden ${a.chipDescriptor}`}
          >
            {descriptor}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

// ─── Stratum card ─────────────────────────────────────────────────────────────
function StratumCard({
  tier,
  inView,
  index,
}: {
  tier: ArchitecturalTier;
  inView: boolean;
  index: number;
}) {
  const a = ACCENT[tier.accent];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.14,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative group"
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: a.glowSoft }}
      />

      {/* Glass stratum surface */}
      <div
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 group-hover:shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          borderColor: a.border,
          boxShadow: `0 0 0 1px ${a.border}, 0 1px 0 rgba(255,255,255,0.06) inset`,
        }}
      >
        {/* Top edge glow line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${a.glow} 50%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div className="p-7 md:p-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              {/* Tier badge */}
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase border mb-3 ${a.badge}`}
              >
                {tier.badge}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-1.5">
                {tier.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tier.subtitle}
              </p>
            </div>

            {/* Tier number watermark */}
            <div
              aria-hidden="true"
              className="shrink-0 text-6xl font-black leading-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 mt-1"
              style={{ color: a.glow }}
            >
              {String(tier.tier).padStart(2, "0")}
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px mb-6 opacity-30"
            style={{
              background: `linear-gradient(90deg, ${a.glow} 0%, transparent 80%)`,
            }}
          />

          {/* Capability chips */}
          <div className="flex flex-wrap gap-2">
            {tier.capabilities.map((cap, i) => (
              <motion.div
                key={cap.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.14 + 0.3 + i * 0.045,
                  ease: "easeOut",
                }}
              >
                <CapabilityChip
                  name={cap.name}
                  descriptor={cap.descriptor}
                  accent={tier.accent}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────
interface SkillsProps {
  data: SkillsData;
}

const Skills = ({ data }: SkillsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.05 },
    },
  };

  return (
    <section
      ref={ref}
      id="skills"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-cyan-500/4 blur-3xl" />
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
            {data.sectionLabel}
          </span>
        </motion.div>

        {/* Title */}
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
          Three layers of craft — from pixel to model.
        </motion.p>

        {/* Strata */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col gap-5"
        >
          {data.tiers.map((tier, index) => (
            <StratumCard
              key={tier.tier}
              tier={tier}
              inView={inView}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
