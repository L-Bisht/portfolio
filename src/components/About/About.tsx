import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { AboutData } from "../../data/about";
import { QuarterCircleArc } from "../CornerBubble";
import SectionScaffold from "../SectionScaffold/SectionScaffold";

interface AboutProps {
  data: AboutData;
}

const About = ({ data }: AboutProps) => {
  const calculateYearsOnly = () => {
    const startDate = data.startDate;
    const currentDate = new Date();
    const totalMonths =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());
    return `${Math.floor(totalMonths / 12)}`;
  };

  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const stats = data.stats.map((stat) => ({
    ...stat,
    value: stat.value.replace("{years}", calculateYearsOnly()),
  }));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const tileVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const iconMap: Record<string, React.ReactElement> = {
    layers: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    zap: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    box: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
    ),
  };

  return (
    <SectionScaffold
      id="about"
      eyebrow="About"
      headline="Engineering with intention."
      accentWord="intention."
      subtitle="Bridging domain boundaries, systems architecture, and AI-accelerated velocity."
    >
      {/* Full-height wrapper — ref spans all content so inView stays true
          while any part of the section is on screen */}
      <div ref={sectionRef}>

      {/* Ambient background blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sky-400/10 dark:bg-sky-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-cyan-400/8 dark:bg-cyan-600/6 blur-3xl" />
        <div className="absolute top-1/2 left-3/4 w-64 h-64 rounded-full bg-sky-300/6 dark:bg-sky-400/5 blur-2xl" />
      </div>

      {/* ── Bento Board ──────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={sectionInView ? "visible" : "hidden"}
        className="grid gap-4 grid-cols-1 lg:grid-cols-3 items-stretch"
      >
        {/* ── Tile 1: Core Philosophy ───────────────────────────────────── */}
        <motion.div
          id="about-tile-philosophy"
          variants={tileVariants}
          className="
            group relative overflow-hidden rounded-3xl p-8
            bg-white/60 dark:bg-white/[0.04]
            border border-slate-200/60 dark:border-white/[0.08]
            backdrop-blur-xl
            shadow-sm hover:shadow-xl dark:hover:shadow-sky-500/10
            transition-shadow duration-500
            lg:col-span-1 h-full
            flex flex-col justify-between
          "
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
              bg-gradient-to-br from-sky-400/8 via-transparent to-cyan-500/6"
          />
          {/* Quarter-circle arc motif — top-right, sky */}
          <QuarterCircleArc corner="tr" color="#0ea5e9" size={100} opacity={0.2} />

          <div className="relative flex flex-col h-full justify-between gap-6">
            {/* Icon badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-600/20 border border-sky-400/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 my-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Core Philosophy
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                {data.philosophyBody}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-2 shrink-0">
              {["Domain-Driven Design", "AI Velocity", "Developer UX"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide
                    bg-sky-500/10 dark:bg-sky-400/10
                    text-sky-600 dark:text-sky-300
                    border border-sky-300/30 dark:border-sky-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Right Column: Focus + Stats ─────────────────────────────── */}
        <motion.div
          id="about-right-column"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="lg:col-span-2 h-full flex flex-col gap-4 justify-between"
        >
          {/* ── Tile 2: Current Focus ─────────────────────────────────────── */}
          <motion.div
            id="about-tile-focus"
            variants={tileVariants}
            className="
              group relative overflow-hidden rounded-3xl p-7
              bg-white/60 dark:bg-white/[0.04]
              border border-slate-200/60 dark:border-white/[0.08]
              backdrop-blur-xl
              shadow-sm hover:shadow-xl dark:hover:shadow-cyan-500/10
              transition-shadow duration-500
              flex-1 flex flex-col justify-between
            "
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
                bg-gradient-to-br from-cyan-400/6 via-transparent to-sky-500/6"
            />

            {/* Quarter-circle arc motif — bottom-left, cyan */}
            <QuarterCircleArc corner="bl" color="#06b6d4" size={80} opacity={0.16} />

            <div className="relative flex flex-col h-full justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                  {data.currentFocusHeadline}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-center">
                {data.currentFocusItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                      bg-slate-50/80 dark:bg-white/[0.04]
                      border border-slate-200/50 dark:border-white/[0.06]
                      hover:border-cyan-300/50 dark:hover:border-cyan-400/20
                      transition-colors duration-300"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full
                      bg-cyan-500/10 dark:bg-cyan-400/10
                      text-cyan-600 dark:text-cyan-300
                      border border-cyan-300/25 dark:border-cyan-400/15
                      whitespace-nowrap">
                      {item.tag}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Tile 3: Stat Cards ────────────────────────────────────────── */}
          <motion.div
            id="about-tile-stats"
            variants={tileVariants}
            className="shrink-0"
          >
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="
                    group relative overflow-hidden rounded-3xl p-5
                    bg-white/60 dark:bg-white/[0.04]
                    border border-slate-200/60 dark:border-white/[0.08]
                    backdrop-blur-xl
                    shadow-sm hover:shadow-xl
                    transition-shadow duration-500
                    flex flex-col gap-3 h-full justify-between
                  "
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(ellipse at 30% 0%, ${stat.glowColor}, transparent 70%)`,
                    }}
                  />

                  {/* Quarter-circle arc motif — top-right, tinted to stat accent */}
                  <QuarterCircleArc
                    corner="tr"
                    color={stat.glowColor.replace(/,\s*[\d.]+\)$/, ", 1)")}
                    size={56}
                    opacity={0.2}
                  />

                  <div className="relative flex flex-col gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: stat.glowColor.replace(/[\d.]+\)$/, "0.14)") }}
                    >
                      <span className="text-sky-500 dark:text-sky-400">
                        {iconMap[stat.icon]}
                      </span>
                    </div>

                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                      {stat.value}
                    </div>

                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>{/* end full-height ref wrapper */}
    </SectionScaffold>
  );
};

export default About;
