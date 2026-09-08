import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ContactData } from "../../data/contact";
import { socialRegistry } from "../../data/social";
import { QuarterCircleArc } from "../CornerBubble";
import SectionScaffold from "../SectionScaffold/SectionScaffold";

/* ─────────────────────────── Centralized SVG Icons ─────────────────────────── */

function RegistryIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7"
    >
      <path d={path} />
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
        hover:shadow-2xl hover:shadow-sky-500/10 dark:hover:shadow-sky-400/10
        hover:border-sky-400/50 dark:hover:border-sky-500/40
        transition-all duration-500 cursor-pointer"
      style={{ textDecoration: "none" }}
      aria-label={`${label} — ${sublabel}`}
    >
      {/* Signature architectural corner bubble motif */}
      <QuarterCircleArc
        corner="tr"
        color={accent}
        size={70}
        opacity={0.14}
      />

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
          group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10
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
          className="text-base font-semibold text-slate-700 dark:text-white
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


const Contact = ({ data }: ContactProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-10% 0px -10% 0px",
  });

  const cards: ActionCardProps[] = [
    {
      label: socialRegistry.email.label,
      sublabel: data.email || socialRegistry.email.rawEmail || "",
      href: socialRegistry.email.href,
      icon: <RegistryIcon path={socialRegistry.email.iconPath} />,
      accent: socialRegistry.email.accent,
      accentDark: socialRegistry.email.accentDark,
      external: socialRegistry.email.external,
      index: 0,
    },
    {
      label: socialRegistry.linkedin.label,
      sublabel: socialRegistry.linkedin.sublabel,
      href:
        data.socialLinks.find((l) => l.icon === "linkedin")?.url ??
        socialRegistry.linkedin.url,
      icon: <RegistryIcon path={socialRegistry.linkedin.iconPath} />,
      accent: socialRegistry.linkedin.accent,
      accentDark: socialRegistry.linkedin.accentDark,
      external: socialRegistry.linkedin.external,
      index: 1,
    },
    {
      label: socialRegistry.github.label,
      sublabel: socialRegistry.github.sublabel,
      href:
        data.socialLinks.find((l) => l.icon === "github")?.url ??
        socialRegistry.github.url,
      icon: <RegistryIcon path={socialRegistry.github.iconPath} />,
      accent: socialRegistry.github.accent,
      accentDark: socialRegistry.github.accentDark,
      external: socialRegistry.github.external,
      index: 2,
    },
    {
      label: socialRegistry.resume.label,
      sublabel: socialRegistry.resume.sublabel,
      href: socialRegistry.resume.url,
      icon: <RegistryIcon path={socialRegistry.resume.iconPath} />,
      accent: socialRegistry.resume.accent,
      accentDark: socialRegistry.resume.accentDark,
      external: socialRegistry.resume.external,
      index: 3,
    },
  ];

  return (
    <SectionScaffold
      id="contact"
      eyebrow="Contact"
      headline="Let's build something extraordinary."
      accentWord="extraordinary."
      subtitle={`${data.description} Reach out through any of the channels below — I typically respond within 24 hours.`}
    >
      {/* ── Cinematic ambient backdrop ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Translucent atmospheric gradient wash allowing the background canvas lattice to shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent dark:from-transparent dark:via-sky-950/20 dark:to-transparent" />

        {/* Deep midnight navy soft veil in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050811]/30 to-transparent dark:block hidden" />

        {/* Soft Sky ambient aurora */}
        <div className="absolute -left-32 top-1/4 w-[650px] h-[650px] rounded-full
          bg-sky-400/10 dark:bg-sky-600/12 blur-[130px]" />

        {/* Soft Cyan ambient aurora */}
        <div className="absolute -right-32 bottom-1/4 w-[550px] h-[550px] rounded-full
          bg-cyan-400/8 dark:bg-cyan-600/10 blur-[110px]" />

        {/* Center ambient glow beacon */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full
          bg-sky-500/[0.04] dark:bg-sky-500/[0.07] blur-[140px]" />

        {/* Center vertical spotlight (dark mode only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-48
          bg-gradient-to-b from-transparent via-sky-500/30 dark:via-sky-400/25 to-transparent" />

        {/* Horizontal rule at top — editorial separator */}
        <div className="absolute top-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-sky-400/30 dark:via-sky-500/25 to-transparent" />
      </div>

      {/* Full-height wrapper — ref spans all content so inView tracks correctly */}
      <div ref={ref}>

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
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {data.location}
            </span>
          </span>
        </div>

        {/* Social Channels Link Row */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">Connect:</span>
          {data.socialLinks.map((link) => {
            const profile = Object.values(socialRegistry).find(
              (p) => p.id === link.icon || p.label.toLowerCase() === link.name.toLowerCase()
            );
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={profile?.ariaLabel ?? `Open ${link.name}`}
                className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200"
              >
                {profile && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d={profile.iconPath} />
                  </svg>
                )}
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      </motion.div>
      </div>{/* end full-height ref wrapper */}
    </SectionScaffold>
  );
};

export default Contact;
