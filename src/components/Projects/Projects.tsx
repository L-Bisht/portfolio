import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ProjectsData, Project } from "../../data/projects";

// ─── Quarter-circle arc motif ─────────────────────────────────────────────────
function QuarterCircleArc({
  corner = "tr",
  color,
  size = 80,
  opacity = 0.16,
}: {
  corner?: "tl" | "tr" | "bl" | "br";
  color: string;
  size?: number;
  opacity?: number;
}) {
  const posStyle: Record<string, React.CSSProperties> = {
    tr: { top: 0, right: 0 },
    tl: { top: 0, left: 0 },
    br: { bottom: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
  };
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
      <path
        d="M88 0 A88 88 0 0 0 0 88"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M88 18 A70 70 0 0 0 18 88"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
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

// ─── Tech Chip ────────────────────────────────────────────────────────────────
function TechChip({ label }: { label: string }) {
  return (
    <motion.span
      whileHover={{ y: -2, scale: 1.05 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border
        bg-indigo-500/8 border-indigo-500/20 text-indigo-700 dark:text-indigo-400
        hover:bg-indigo-500/14 hover:border-indigo-400/40 hover:shadow-indigo-500/20
        transition-all duration-200 cursor-default"
      style={{
        willChange: "transform",
      }}
    >
      {label}
    </motion.span>
  );
}

// ─── Browser Frame Mockup ─────────────────────────────────────────────────────
function BrowserMockup({
  project,
  inView,
  delay,
}: {
  project: Project;
  inView: boolean;
  delay: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 24 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 24 }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Depth glow behind the frame */}
      <div
        className="absolute inset-0 rounded-2xl blur-3xl transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.35) 0%, transparent 70%)",
          opacity: isHovering ? 0.9 : 0.45,
        }}
        aria-hidden="true"
      />

      {/* 3-D tilt shell */}
      <motion.div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovering ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovering
            ? "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.25)"
            : "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Browser chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1b2e] border-b border-white/8">
          {/* Traffic-light dots */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          {/* URL bar */}
          <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/8">
            <svg
              className="w-3 h-3 text-slate-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-[10px] text-slate-500 truncate font-mono">
              {project.demoUrl.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </div>

        {/* Screenshot / preview */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover"
          />
          {/* Subtle reflection at top */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Case Study Row ───────────────────────────────────────────────────────────
function CaseStudyRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "-8% 0px -8% 0px",
  });
  const [hovered, setHovered] = useState(false);

  const isEven = index % 2 === 0; // even = content left, preview right
  const baseDelay = 0.1;

  // Accent color alternates per project for visual rhythm
  const arcColor = isEven ? "#6366f1" : "#8b5cf6";
  const arcCorner = isEven ? "tl" : "tr";

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: isEven ? -32 : 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.75, delay: baseDelay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const Content = (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col justify-center h-full"
    >
      {/* Category tag */}
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.45, delay: baseDelay - 0.05 }}
        className="inline-flex items-center gap-2 mb-5 self-start"
      >
        <span className="h-px w-6 bg-indigo-500/60" />
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-indigo-600 dark:text-indigo-400">
          {project.category}
        </span>
      </motion.span>

      {/* Title */}
      <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
        {project.title}
      </h3>

      {/* Problem / Solution narrative */}
      <div className="space-y-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-rose-600 dark:text-rose-400/80 mb-1.5">
            The Problem
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.problem}</p>
        </div>
        <div
          className="w-full h-px opacity-20"
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.7) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-emerald-700 dark:text-emerald-400/80 mb-1.5">
            The Solution
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.solution}</p>
        </div>
      </div>

      {/* Tech chips */}
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Technologies used">
        {project.technologies.map((tech) => (
          <TechChip key={tech} label={tech} />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <a
          id={`project-${project.id}-demo`}
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Live Demo
        </a>
        <a
          id={`project-${project.id}-source`}
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white text-sm font-semibold border border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.138 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View Source
        </a>
      </div>
    </motion.div>
  );

  const Preview = (
    <BrowserMockup
      project={project}
      inView={inView}
      delay={baseDelay + 0.12}
    />
  );

  return (
    <article
      ref={ref}
      id={`project-${project.id}`}
      aria-label={project.title}
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glass case-study surface wrapper */}
      <div
        className={`
          relative overflow-hidden rounded-3xl
          grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center
          py-16 px-10 lg:px-14
          bg-white/[0.03] dark:bg-white/[0.02]
          border border-slate-200/80 dark:border-white/[0.07]
          backdrop-blur-sm
          transition-all duration-500
          ${index > 0 ? "mt-6" : ""}
        `}
        style={{
          boxShadow: hovered
            ? `0 24px 64px rgba(99,102,241,0.08), 0 0 0 1px ${arcColor}33`
            : "none",
          borderColor: hovered ? `${arcColor}22` : undefined,
        }}
      >
        {/* Quarter-circle arc motif */}
        <QuarterCircleArc
          corner={arcCorner}
          color={arcColor}
          size={96}
          opacity={hovered ? 0.28 : 0.14}
        />

        {/* Top-edge hairline glow */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
          animate={{
            opacity: hovered ? 1 : 0,
            background: `linear-gradient(90deg, transparent 0%, ${arcColor}99 50%, transparent 100%)`,
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
              ? `radial-gradient(ellipse at ${isEven ? "20%" : "80%"} 30%, ${arcColor}0d 0%, transparent 60%)`
              : "none",
          }}
          transition={{ duration: 0.4 }}
        />

        {isEven ? (
          <>
            <div>{Content}</div>
            <div>{Preview}</div>
          </>
        ) : (
          <>
            {/* Mobile: preview first, then content */}
            <div className="order-2 lg:order-1">{Preview}</div>
            <div className="order-1 lg:order-2">{Content}</div>
          </>
        )}
      </div>
    </article>
  );
}

// ─── Word-entrance headline variants ─────────────────────────────────────────
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

// ─── Projects section ─────────────────────────────────────────────────────────
interface ProjectsProps {
  data: ProjectsData;
}

const Projects = ({ data }: ProjectsProps) => {
  const [sectionRef, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const titleWords = data.title.split(" ");
  const lastWordIdx = titleWords.length - 1;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-indigo-600/4 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-8 bg-indigo-500/60" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400">
              Work
            </span>
          </motion.div>

          {/* Commanding clamp headline with word-entrance motion */}
          <div className="mb-3 perspective-[1200px]">
            <motion.h2
              variants={headlineVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-x-4 gap-y-1
                text-[clamp(2.2rem,5vw,5rem)] font-extrabold tracking-tight leading-[1.05]
                text-slate-900 dark:text-white"
            >
              {titleWords.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                  <motion.span
                    variants={wordVariant}
                    className={`inline-block ${
                      i === lastWordIdx
                        ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-500 dark:to-indigo-400 bg-clip-text text-transparent"
                        : ""
                    }`}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-slate-600 dark:text-slate-400 text-base"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Case study rows */}
        <div className="mt-10 flex flex-col gap-4">
          {data.projects.map((project, index) => (
            <CaseStudyRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
