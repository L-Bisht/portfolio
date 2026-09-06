import { useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SkillsData, ArchitecturalTier } from "../../data/skills";

// ─── Accent palette ───────────────────────────────────────────────────────────
const ACCENT = {
  indigo: {
    glow: "rgba(99,102,241,0.55)",
    glowHex: "#6366f1",
    glowSoft: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.35)",
    badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    chip: "hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-indigo-300",
    chipDescriptor: "text-indigo-400/80",
    connector: "from-indigo-500/40 to-transparent",
    ambientTop: "bg-indigo-500/8",
    ambientBot: "bg-indigo-600/6",
    gradientKeyword: "from-indigo-400 via-violet-400 to-cyan-400",
  },
  violet: {
    glow: "rgba(139,92,246,0.55)",
    glowHex: "#8b5cf6",
    glowSoft: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.35)",
    badge: "text-violet-400 bg-violet-500/10 border-violet-500/25",
    chip: "hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300",
    chipDescriptor: "text-violet-400/80",
    connector: "from-violet-500/40 to-transparent",
    ambientTop: "bg-violet-500/8",
    ambientBot: "bg-violet-600/6",
    gradientKeyword: "from-violet-400 via-indigo-400 to-purple-400",
  },
  cyan: {
    glow: "rgba(6,182,212,0.55)",
    glowHex: "#06b6d4",
    glowSoft: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.35)",
    badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    chip: "hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300",
    chipDescriptor: "text-cyan-400/80",
    connector: "from-cyan-500/40 to-transparent",
    ambientTop: "bg-cyan-500/8",
    ambientBot: "bg-cyan-600/6",
    gradientKeyword: "from-cyan-400 via-sky-400 to-indigo-400",
  },
} as const;

// ─── Quarter-circle arc motif ─────────────────────────────────────────────────
function QuarterCircleArc({
  corner = "tr",
  color,
  size = 88,
  opacity = 0.18,
}: {
  corner?: "tl" | "tr" | "bl" | "br";
  color: string;
  size?: number;
  opacity?: number;
}) {
  // Position map
  const posStyle: Record<string, React.CSSProperties> = {
    tr: { top: 0, right: 0 },
    tl: { top: 0, left: 0 },
    br: { bottom: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
  };
  // Rotation so the arc fills into the given corner
  const rotationMap = { tr: 0, br: 90, bl: 180, tl: 270 };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 88 88"
      fill="none"
      style={{
        position: "absolute",
        pointerEvents: "none",
        opacity,
        transform: `rotate(${rotationMap[corner]}deg)`,
        ...posStyle[corner],
      }}
    >
      {/* Outer arc */}
      <path
        d="M88 0 A88 88 0 0 0 0 88"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mid arc */}
      <path
        d="M88 18 A70 70 0 0 0 18 88"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Inner arc */}
      <path
        d="M88 36 A52 52 0 0 0 36 88"
        stroke={color}
        strokeWidth="0.75"
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
      />
    </svg>
  );
}

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
      whileHover={{ y: -2, scale: 1.03 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "relative inline-flex flex-col items-start gap-0.5",
        "px-3.5 py-2 rounded-xl cursor-default select-none",
        "border border-white/10 dark:border-white/8",
        "bg-white/5 dark:bg-white/3",
        "text-slate-300 dark:text-slate-300",
        "text-sm font-medium leading-tight",
        "transition-all duration-200",
        a.chip,
      ].join(" ")}
      style={{
        boxShadow: hovered ? `0 4px 16px ${a.glowSoft}` : "none",
      }}
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
          size={96}
          opacity={hovered ? 0.3 : 0.16}
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

// ─── Word-entrance headline variants (mirrors Contact pattern) ────────────────
const headlineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

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

  // Split the section title into words for word-entrance animation
  const titleWords = data.title.split(" ");
  const lastWordIdx = titleWords.length - 1;

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

        {/* Commanding clamp headline with word-entrance motion */}
        <div className="mb-4 perspective-[1200px]">
          <motion.h2
            variants={headlineVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-wrap gap-x-4 gap-y-1
              text-[clamp(2.2rem,5vw,5rem)] font-extrabold tracking-tight leading-[1.05]
              text-white"
          >
            {titleWords.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <motion.span
                  variants={wordVariant}
                  className={`inline-block ${
                    i === lastWordIdx
                      ? "bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.35 }}
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
