import { motion, AnimatePresence } from "framer-motion";
import type { NavData, NavItem } from "../../data/nav";

interface FloatingDockProps {
  data: NavData;
  activeSectionId: string;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const ICON_MAP: Record<string, React.ReactNode> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

function DockItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <motion.button
      id={`floating-dock-${item.id}`}
      aria-label={`Jump to ${item.name}`}
      onClick={() => scrollTo(item.id)}
      whileTap={{ scale: 0.88 }}
      className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200
        ${isActive
          ? "text-sky-500 dark:text-sky-400"
          : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
    >
      {/* Active indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="dock-active-bg"
            className="absolute inset-0 rounded-xl bg-sky-50 dark:bg-sky-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">{ICON_MAP[item.id] ?? null}</span>
      <span className="relative z-10 text-[9px] font-semibold tracking-wide uppercase leading-none">
        {item.name}
      </span>
    </motion.button>
  );
}

export default function FloatingDock({ data, activeSectionId }: FloatingDockProps) {
  return (
    <div
      id="floating-bottom-dock"
      aria-label="Section navigation dock"
      className="floating-dock lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-0.5 px-2 py-1.5
                 rounded-2xl
                 editorial-glass bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                 border border-slate-200/70 dark:border-slate-700/60
                 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(14,165,233,0.06)]
                 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(14,165,233,0.1)]"
    >
      {data.items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          isActive={activeSectionId === item.id}
        />
      ))}
    </div>
  );
}
