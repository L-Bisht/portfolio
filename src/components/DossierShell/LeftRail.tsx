import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import type { NavData, NavItem } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";

interface LeftRailProps {
  data: NavData;
  activeSectionId: string;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Profile Monogram ────────────────────────────────────────────────────────

function ProfileMonogram({ shortName }: { shortName: string }) {
  return (
    <div className="relative w-16 h-16 shrink-0">
      {/* Glow ring */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20 blur-md"
      />
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl tracking-tight
                   bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25"
      >
        {shortName}
      </div>
    </div>
  );
}

// ─── Availability Beacon ─────────────────────────────────────────────────────

function AvailabilityBeacon({
  available,
  label,
}: {
  available: boolean;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
        ${
          available
            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60"
            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60"
        }`}
    >
      <span
        className={`relative w-2 h-2 rounded-full shrink-0 ${
          available ? "bg-emerald-500" : "bg-amber-500"
        }`}
      >
        {available && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-beacon" />
        )}
      </span>
      {label}
    </div>
  );
}

// ─── TOC Item ────────────────────────────────────────────────────────────────

function TocItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <button
      id={`rail-toc-${item.id}`}
      aria-label={`Jump to ${item.name}`}
      aria-current={isActive ? "location" : undefined}
      onClick={() => scrollTo(item.id)}
      className={`toc-item group relative flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
        text-left transition-all duration-200 cursor-pointer
        ${
          isActive
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
                     text-slate-400 dark:text-slate-500
                     hover:text-slate-700 dark:hover:text-slate-200
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

export default function LeftRail({ data, activeSectionId }: LeftRailProps) {
  const { theme, toggleTheme } = useTheme();
  const { openPalette } = useCommandPalette();

  return (
    <aside
      aria-label="Dossier navigation rail"
      className="hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto
                 w-[280px] shrink-0
                 border-r border-slate-200/60 dark:border-slate-700/50
                 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl
                 py-8 px-6 gap-8"
    >
      {/* ── Profile ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <ProfileMonogram shortName={data.shortName} />
          <div className="min-w-0 pt-0.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {data.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              {data.title}
            </p>
          </div>
        </div>
        <AvailabilityBeacon
          available={data.availability.available}
          label={data.availability.label}
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <hr className="border-slate-200/70 dark:border-slate-700/50" />

      {/* ── Scroll-spy TOC ───────────────────────────────────────── */}
      <nav aria-label="Page sections">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-3">
          Sections
        </p>
        <ul className="flex flex-col gap-0.5" role="list">
          {data.items.map((item) => (
            <li key={item.id}>
              <TocItem
                item={item}
                isActive={activeSectionId === item.id}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Spacer ───────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Social + Theme ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SocialLinks data={data} />

          {/* Theme toggle */}
          <motion.button
            id="rail-theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-slate-400 dark:text-slate-500
                       hover:text-slate-700 dark:hover:text-slate-200
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

        {/* ── Command Palette trigger ─────────────────────────── */}
        <motion.button
          id="rail-cmd-palette-trigger"
          aria-label="Open navigation command palette (⌘K)"
          onClick={openPalette}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center justify-between gap-2 w-full px-3 py-2.5 rounded-xl
                     border border-slate-200/80 dark:border-slate-700/60
                     bg-slate-50/80 dark:bg-slate-800/50
                     text-slate-500 dark:text-slate-400
                     hover:border-indigo-300/70 dark:hover:border-indigo-600/60
                     hover:text-indigo-600 dark:hover:text-indigo-400
                     hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30
                     hover:shadow-[0_0_16px_rgba(99,102,241,0.18)]
                     transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Navigate
          </div>
          <kbd
            className="inline-flex items-center gap-0.5 rounded border border-slate-200/80 dark:border-slate-600/60
                       bg-white/70 dark:bg-slate-900/60 px-1.5 py-0.5
                       text-[10px] text-slate-400 dark:text-slate-500 font-sans"
          >
            ⌘K
          </kbd>
        </motion.button>
      </div>
    </aside>
  );
}
