import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ContactData } from "../../data/contact";
import { socialRegistry } from "../../data/social";

/* ─────────────────────────── SVG Icons ─────────────────────────── */

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ───────────────────────── Action Card ─────────────────────────── */

interface ActionCardProps {
  label: string;
  sublabel: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
  accentDark: string;
  external?: boolean;
  index: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function ActionCard({
  label,
  sublabel,
  href,
  icon,
  accent,
  accentDark,
  external = false,
  index,
}: ActionCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      variants={cardVariants}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col gap-5 p-7 rounded-2xl overflow-hidden
        bg-white/70 dark:bg-white/[0.04]
        border border-slate-200/80 dark:border-white/[0.08]
        backdrop-blur-xl shadow-sm
        hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10
        hover:border-indigo-400/50 dark:hover:border-indigo-500/40
        transition-all duration-500 cursor-pointer"
      style={{ textDecoration: "none" }}
      aria-label={`${label} — ${sublabel}`}
    >
      {/* Animated glow fill on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? `radial-gradient(ellipse at 30% 50%, ${accent}14 0%, transparent 70%)`
            : "none",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Accent top-line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        animate={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Icon */}
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-xl
          bg-slate-100 dark:bg-white/[0.06]
          group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10
          transition-colors duration-300"
        style={{
          color: hovered ? accent : undefined,
        }}
      >
        <motion.div
          animate={{ color: hovered ? accent : accentDark }}
          transition={{ duration: 0.3 }}
          className="dark:[--icon-color:var(--tw-text-opacity)]"
        >
          {icon}
        </motion.div>
      </div>

      {/* Text */}
      <div className="relative flex-1">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1.5">
          {label}
        </div>
        <div
          className="text-base font-semibold text-slate-700 dark:text-slate-300 
            group-hover:text-slate-900 dark:group-hover:text-white
            transition-colors duration-300 break-all leading-snug"
        >
          {sublabel}
        </div>
      </div>

      {/* Arrow indicator */}
      <motion.div
        className="relative self-end text-slate-300 dark:text-slate-600"
        animate={{
          color: hovered ? accent : undefined,
          x: hovered ? 2 : 0,
          y: hovered ? -2 : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        <ArrowUpRightIcon />
      </motion.div>
    </motion.a>
  );
}

/* ─────────────────────────── Contact ───────────────────────────── */

interface ContactProps {
  data: ContactData;
}

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

const HEADLINE_WORDS = ["Let's", "build", "something", "extraordinary."];

const Contact = ({ data }: ContactProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.05,
    rootMargin: "-5% 0px -5% 0px",
  });

  const cards: ActionCardProps[] = [
    {
      label: socialRegistry.email.label,
      sublabel: data.email || socialRegistry.email.rawEmail || "",
      href: `mailto:${data.email || socialRegistry.email.rawEmail}`,
      icon: <EmailIcon />,
      accent: socialRegistry.email.accent,
      accentDark: socialRegistry.email.accentDark,
      external: false,
      index: 0,
    },
    {
      label: socialRegistry.linkedin.label,
      sublabel: socialRegistry.linkedin.sublabel,
      href:
        data.socialLinks.find((l) => l.icon === "linkedin")?.url ??
        socialRegistry.linkedin.url,
      icon: <LinkedInIcon />,
      accent: socialRegistry.linkedin.accent,
      accentDark: socialRegistry.linkedin.accentDark,
      external: true,
      index: 1,
    },
    {
      label: socialRegistry.github.label,
      sublabel: socialRegistry.github.sublabel,
      href:
        data.socialLinks.find((l) => l.icon === "github")?.url ??
        socialRegistry.github.url,
      icon: <GitHubIcon />,
      accent: socialRegistry.github.accent,
      accentDark: socialRegistry.github.accentDark,
      external: true,
      index: 2,
    },
    {
      label: socialRegistry.resume.label,
      sublabel: socialRegistry.resume.sublabel,
      href: socialRegistry.resume.url,
      icon: <ResumeIcon />,
      accent: socialRegistry.resume.accent,
      accentDark: socialRegistry.resume.accentDark,
      external: true,
      index: 3,
    },
  ];

  return (
    <section
      ref={ref}
      id="contact"
      className="relative w-full overflow-hidden"
    >
      {/* ── Cinematic ambient backdrop ───────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep base wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />

        {/* Left aurora */}
        <div className="absolute -left-32 top-1/4 w-[600px] h-[600px] rounded-full
          bg-indigo-400/10 dark:bg-indigo-600/8 blur-[120px]" />

        {/* Right aurora */}
        <div className="absolute -right-32 bottom-1/4 w-[500px] h-[500px] rounded-full
          bg-violet-400/8 dark:bg-violet-600/6 blur-[100px]" />

        {/* Center vertical spotlight (dark mode only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40
          bg-gradient-to-b from-transparent via-indigo-500/30 dark:via-indigo-400/20 to-transparent" />

        {/* Horizontal rule at top — editorial separator */}
        <div className="absolute top-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-indigo-400/30 dark:via-indigo-500/20 to-transparent" />
      </div>

      {/* ── Inner content ──────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-32 lg:py-44">

        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-indigo-500/60" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-indigo-500">
            Contact
          </span>
        </motion.div>

        {/* Commanding headline */}
        <div className="mb-20 lg:mb-24 perspective-[1200px]">
          <motion.h2
            variants={headlineVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-wrap gap-x-5 gap-y-2
              text-[clamp(2.8rem,7vw,7rem)] font-extrabold tracking-tight leading-[1.05]
              text-slate-900 dark:text-white"
          >
            {HEADLINE_WORDS.map((word) => (
              <span key={word} className="overflow-hidden inline-block">
                <motion.span
                  variants={wordVariant}
                  className={`inline-block ${
                    word === "extraordinary."
                      ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-500 dark:via-violet-500 dark:to-indigo-400 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed"
          >
            {data.description} Reach out through any of the channels below — I
            typically respond within 24 hours.
          </motion.p>
        </div>

        {/* Communication cards grid */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0 } } }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {cards.map((card) => (
            <ActionCard key={card.label} {...card} />
          ))}
        </motion.div>

        {/* Availability signal & Direct Social Channels */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500">
              Available for new opportunities ·{" "}
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {data.location}
              </span>
            </span>
          </div>

          {/* Social Channels Link Row */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="text-slate-400 dark:text-slate-600">Connect:</span>
            {data.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.name}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
