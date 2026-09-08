import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SkillsData, ArchitecturalTier } from "../../data/skills";
import { QuarterCircleArc } from "../CornerBubble";
import { SkillIcon } from "./SkillIcon";
import SectionScaffold from "../SectionScaffold/SectionScaffold";

// ─── Accent palette ───────────────────────────────────────────────────────────
const ACCENT = {
  sky: {
    glow: "rgba(14,165,233,0.55)",
    glowHex: "#0ea5e9",
    glowSoft: "rgba(14,165,233,0.12)",
    border: "rgba(14,165,233,0.35)",
    badge: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25",
    chip: "hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-300",
    iconActive: "text-sky-600 dark:text-sky-400",
    connector: "from-sky-500/40 to-transparent",
    ambientTop: "bg-sky-500/8",
    ambientBot: "bg-sky-600/6",
    gradientKeyword: "from-sky-600 via-cyan-600 to-blue-600 dark:from-sky-400 dark:via-cyan-400 dark:to-blue-400",
  },
  cobalt: {
    glow: "rgba(37,99,235,0.55)",
    glowHex: "#2563eb",
    glowSoft: "rgba(37,99,235,0.12)",
    border: "rgba(37,99,235,0.35)",
    badge: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25",
    chip: "hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-300",
    iconActive: "text-blue-600 dark:text-blue-400",
    connector: "from-blue-500/40 to-transparent",
    ambientTop: "bg-blue-500/8",
    ambientBot: "bg-blue-600/6",
    gradientKeyword: "from-blue-600 via-sky-600 to-cyan-600 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400",
  },
  cyan: {
    glow: "rgba(6,182,212,0.55)",
    glowHex: "#06b6d4",
    glowSoft: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.35)",
    badge: "text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    chip: "hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-300",
    iconActive: "text-cyan-600 dark:text-cyan-400",
    connector: "from-cyan-500/40 to-transparent",
    ambientTop: "bg-cyan-500/8",
    ambientBot: "bg-cyan-600/6",
    gradientKeyword: "from-cyan-600 via-sky-600 to-blue-600 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400",
  },
} as const;

// ─── Chip ─────────────────────────────────────────────────────────────────────
function CapabilityChip({
  name,
  accent,
}: {
  name: string;
  accent: keyof typeof ACCENT;
}) {
  const [hovered, setHovered] = useState(false);
  const a = ACCENT[accent];

  return (
    <motion.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "relative inline-flex items-center gap-2",
        "px-3.5 py-2 rounded-xl cursor-default select-none",
        "border border-slate-200 dark:border-white/8",
        "bg-slate-50 dark:bg-white/3",
        "text-slate-700 dark:text-slate-300",
        "text-sm font-medium leading-none",
        "transition-colors duration-200",
        a.chip,
      ].join(" ")}
      style={{
        boxShadow: hovered
          ? `0 4px 16px ${a.glowSoft}, 0 0 0 1px ${a.border}`
          : "none",
      }}
      aria-label={name}
    >
      <SkillIcon
        name={name}
        className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
          hovered ? a.iconActive : "text-slate-400 dark:text-slate-400"
        }`}
      />
      <span>{name}</span>
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
  const [hovered, setHovered] = useState(false);
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: a.glowSoft }}
      />

      {/* Glass stratum surface */}
      <div
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-400 group-hover:shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
          borderColor: hovered
            ? a.border.replace("0.35", "0.55")
            : a.border,
          boxShadow: hovered
            ? `0 0 0 1px ${a.border}, 0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px ${a.glowSoft}`
            : `0 0 0 1px ${a.border}, 0 1px 0 rgba(255,255,255,0.06) inset`,
        }}
      >
        {/* Quarter-circle arc motif — top-right corner */}
        <QuarterCircleArc
          corner="tr"
          color={a.glowHex}
          size={180}
          opacity={hovered ? 0.32 : 0.18}
        />

        {/* Top edge hairline glow */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          animate={{
            opacity: hovered ? 1 : 0.5,
            background: `linear-gradient(90deg, transparent 0%, ${a.glow} 50%, transparent 100%)`,
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
              ? `radial-gradient(ellipse at 30% 30%, ${a.glowSoft} 0%, transparent 65%)`
              : "none",
          }}
          transition={{ duration: 0.4 }}
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
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1.5">
                {tier.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {tier.subtitle}
              </p>
            </div>

            {/* Tier number watermark */}
            <div
              aria-hidden="true"
              className="shrink-0 text-6xl font-black leading-none select-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 mt-1"
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
    <SectionScaffold
      id="skills"
      eyebrow={data.sectionLabel}
      headline={data.title}
      accentWord="Stack"
      subtitle="Three layers of craft — from pixel to model."
    >
      {/* Full-height wrapper — ref spans all content so inView tracks correctly */}
      <div ref={ref}>

      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-cyan-500/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-blue-500/4 blur-3xl" />
      </div>

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
      </div>{/* end full-height ref wrapper */}
    </SectionScaffold>
  );
};

export default Skills;
