import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Pin, PinOff } from "lucide-react";
import type { NavData, NavItem } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";


// ─── Icon map (reused from FloatingDock) ─────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Profile Monogram ────────────────────────────────────────────────────────

function ProfileMonogram({ shortName }: { shortName: string }) {
  return (
    <div className="relative w-10 h-10 shrink-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20 blur-md"
      />
      <div
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs tracking-tight
                   bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25"
      >
        {shortName}
      </div>
    </div>
  );
}

// ─── Availability Beacon ─────────────────────────────────────────────────────

function AvailabilityBeacon({ available, label }: { available: boolean; label: string }) {
  return (
    <div
      aria-label={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
        ${available
          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60"
          : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60"
        }`}
    >
      <span
        className={`relative w-2 h-2 rounded-full shrink-0 ${available ? "bg-emerald-500" : "bg-amber-500"}`}
      >
        {available && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-beacon" />
        )}
      </span>
      {label}
    </div>
  );
}

// ─── Tooltip wrapper ─────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip flex items-center">
      {children}
      {/* Tooltip bubble — appears to the right, only when rail is compact */}
      <div
        role="tooltip"
        className="
          pointer-events-none absolute left-full ml-3 z-[60]
          whitespace-nowrap
          px-2.5 py-1 rounded-lg
          bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium
          shadow-xl shadow-black/20
          opacity-0 translate-x-1 scale-95
          group-hover/tip:opacity-100 group-hover/tip:translate-x-0 group-hover/tip:scale-100
          transition-all duration-150 ease-out
          after:absolute after:right-full after:top-1/2 after:-translate-y-1/2
          after:border-4 after:border-transparent after:border-r-slate-900 dark:after:border-r-slate-700
        "
      >
        {label}
      </div>
    </div>
  );
}

// ─── Nav pill (compact / icon-only) ──────────────────────────────────────────

function CompactNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Tooltip label={item.name}>
      <button
        id={`rail-toc-compact-${item.id}`}
        aria-label={`Jump to ${item.name}`}
        aria-current={isActive ? "location" : undefined}
        onClick={() => scrollTo(item.id)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer
          ${isActive
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/90 dark:bg-indigo-950/60"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
          }`}
      >
        {/* Active left border pill */}
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-indigo-500"
          animate={{ height: isActive ? "55%" : "0%" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        {ICON_MAP[item.id] ?? null}
      </button>
    </Tooltip>
  );
}

// ─── Nav item (expanded) ─────────────────────────────────────────────────────

function ExpandedNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <button
      id={`rail-toc-${item.id}`}
      aria-label={`Jump to ${item.name}`}
      aria-current={isActive ? "location" : undefined}
      onClick={() => scrollTo(item.id)}
      className={`toc-item group relative flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
        text-left transition-all duration-200 cursor-pointer
        ${isActive
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
        }`}
    >
      {/* Active left border pill */}
      <motion.span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-indigo-500"
        animate={{ height: isActive ? "60%" : "0%" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      {/* Dot */}
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-200
          ${isActive ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400"}`}
      />
      {item.name}
    </button>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────

function SocialLinks({ data }: { data: NavData }) {
  return (
    <div className="flex items-center gap-2">
      {data.social.map((link) => (
        <a
          key={link.id}
          id={`rail-social-${link.id}`}
          href={link.href}
          target={link.id !== "email" ? "_blank" : undefined}
          rel={link.id !== "email" ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-slate-500 dark:text-slate-400
                     hover:text-slate-800 dark:hover:text-slate-200
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-all duration-200 group"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          >
            <path d={link.iconPath} />
          </svg>
        </a>
      ))}
    </div>
  );
}

// ─── LeftRail ────────────────────────────────────────────────────────────────

interface LeftRailProps {
  data: NavData;
  activeSectionId: string;
  isPinned: boolean;
  togglePin: () => void;
}

// Framer Motion spring for the width animation
const RAIL_SPRING = { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.8 };

export default function LeftRail({ data, activeSectionId, isPinned, togglePin }: LeftRailProps) {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;
  const railWidth = isExpanded ? 280 : 72;

  return (
    <motion.aside
      aria-label="Dossier navigation rail"
      /* When pinned the aside participates in flow (position static via layout);
         when unpinned it's absolutely positioned against the host div so it
         floats over content without causing reflow. */
      style={{ width: railWidth }}
      animate={{ width: railWidth }}
      transition={RAIL_SPRING}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        overflow-hidden
        border-r border-slate-200/60 dark:border-slate-700/50
        py-6 gap-6
        ${isPinned
          ? /* static column — no extra shadow */
            "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl"
          : /* floating overlay — elevated glass with shadow */
            `absolute left-0 top-0 z-50
             bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl
             shadow-[4px_0_32px_rgba(0,0,0,0.10),1px_0_0_rgba(99,102,241,0.08)]
             dark:shadow-[4px_0_32px_rgba(0,0,0,0.5),1px_0_0_rgba(99,102,241,0.12)]`
        }
      `}
    >
      {/* ── Profile ──────────────────────────────────────────────── */}
      <div
        className={`flex items-center shrink-0 transition-all duration-200 ${isExpanded ? "px-5 gap-3.5" : "px-3.5 justify-center"}`}
      >
        <ProfileMonogram shortName={data.shortName} />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="profile-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="min-w-0 overflow-hidden"
            >
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                {data.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug truncate">
                {data.title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability beacon — only in expanded state */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="beacon"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="px-5 shrink-0"
          >
            <AvailabilityBeacon
              available={data.availability.available}
              label={data.availability.label}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className={`shrink-0 ${isExpanded ? "px-5" : "px-3.5"}`}>
        <hr className="border-slate-200/70 dark:border-slate-700/50" />
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav
        aria-label="Page sections"
        className={`flex flex-col shrink-0 ${isExpanded ? "px-3 gap-0.5" : "px-3.5 gap-1 items-center"}`}
      >
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.p
              key="nav-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 px-3"
            >
              Sections
            </motion.p>
          )}
        </AnimatePresence>

        <ul className={`flex flex-col ${isExpanded ? "gap-0.5 w-full" : "gap-1"}`} role="list">
          {data.items.map((item) =>
            isExpanded ? (
              <li key={item.id}>
                <ExpandedNavItem item={item} isActive={activeSectionId === item.id} />
              </li>
            ) : (
              <li key={item.id}>
                <CompactNavItem item={item} isActive={activeSectionId === item.id} />
              </li>
            )
          )}
        </ul>
      </nav>

      {/* ── Spacer ─────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Utility bar ────────────────────────────────────────── */}
      <div
        className={`flex flex-col shrink-0 gap-3 ${isExpanded ? "px-5" : "px-3.5 items-center"}`}
      >
        {/* Social links — expanded only */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.16 }}
            >
              <div className="flex items-center justify-between">
                <SocialLinks data={data} />

                {/* Theme toggle — expanded */}
                <motion.button
                  id="rail-theme-toggle"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             text-slate-500 dark:text-slate-400
                             hover:text-slate-800 dark:hover:text-slate-200
                             hover:bg-slate-100 dark:hover:bg-slate-800
                             transition-colors duration-150"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                      <motion.span
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Sun size={16} strokeWidth={1.5} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Moon size={16} strokeWidth={1.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme toggle — compact only */}
        {!isExpanded && (
          <Tooltip label={theme === "dark" ? "Light mode" : "Dark mode"}>
            <motion.button
              id="rail-theme-toggle-compact"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-xl
                         text-slate-500 dark:text-slate-400
                         hover:text-slate-800 dark:hover:text-slate-200
                         hover:bg-slate-100/80 dark:hover:bg-slate-800/60
                         transition-colors duration-150"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun-compact"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Sun size={18} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon-compact"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Moon size={18} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Tooltip>
        )}


        {/* ── Pin / Unpin toggle ─────────────────────────────────── */}
        <Tooltip label={isPinned ? "Unpin rail" : "Pin rail open"}>
          <motion.button
            id="rail-pin-toggle"
            aria-label={isPinned ? "Unpin navigation rail" : "Pin navigation rail open"}
            aria-pressed={isPinned}
            onClick={togglePin}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer
              ${isExpanded ? "w-10 h-10 self-end" : "w-10 h-10"}
              ${isPinned
                ? "text-indigo-500 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
              }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPinned ? (
                <motion.span
                  key="pinned"
                  initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <PinOff size={18} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="unpinned"
                  initial={{ rotate: 45, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -45, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pin size={18} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
