import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCommandPalette } from "../../context/CommandPaletteContext";

// ─── Navigation Commands ────────────────────────────────────────────────────

interface NavCommand {
  id: string;
  /** Display label shown in the list */
  label: string;
  /** Short description shown beneath the label */
  description: string;
  /** The DOM element id to scroll to */
  sectionId: string;
  /** Extra terms that should match even if absent from label */
  keywords: string[];
  /** Emoji/icon character for visual context */
  emoji: string;
}

const NAVIGATION_COMMANDS: NavCommand[] = [
  {
    id: "nav-home",
    label: "Home",
    description: "Jump to the top of the page",
    sectionId: "home",
    keywords: ["top", "start", "beginning", "intro", "welcome"],
    emoji: "🏠",
  },
  {
    id: "nav-about",
    label: "About",
    description: "Learn about who I am",
    sectionId: "about",
    keywords: ["bio", "me", "background", "story", "profile"],
    emoji: "👤",
  },
  {
    id: "nav-skills",
    label: "Skills",
    description: "Explore my technical skill set",
    sectionId: "skills",
    keywords: [
      "tech",
      "technologies",
      "stack",
      "expertise",
      "tools",
      "languages",
      "frameworks",
    ],
    emoji: "⚡",
  },
  {
    id: "nav-experience",
    label: "Experience",
    description: "View my work history and roles",
    sectionId: "experience",
    keywords: ["work", "jobs", "career", "history", "roles", "positions"],
    emoji: "💼",
  },
  {
    id: "nav-projects",
    label: "Projects",
    description: "Browse what I've built",
    sectionId: "projects",
    keywords: ["portfolio", "work", "builds", "apps", "demos", "code"],
    emoji: "🚀",
  },
  {
    id: "nav-contact",
    label: "Contact",
    description: "Get in touch with me",
    sectionId: "contact",
    keywords: ["email", "message", "hire", "connect", "reach", "touch"],
    emoji: "✉️",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Case-insensitive substring match across label, description and keywords. */
function matchesQuery(cmd: NavCommand, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    cmd.label.toLowerCase().includes(q) ||
    cmd.description.toLowerCase().includes(q) ||
    cmd.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommandPalette() {
  const { isOpen, closePalette } = useCommandPalette();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCommands = useMemo(
    () => NAVIGATION_COMMANDS.filter((cmd) => matchesQuery(cmd, query)),
    [query],
  );

  // Keep activeIndex in bounds when filtered list shrinks
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input + reset state when the palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Scroll active item into view inside the list
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (cmd: NavCommand) => {
      scrollToSection(cmd.sectionId);
      closePalette();
    },
    [closePalette],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) =>
            filteredCommands.length > 0
              ? Math.min(i + 1, filteredCommands.length - 1)
              : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            handleSelect(filteredCommands[activeIndex]);
          }
          break;
        default:
          break;
      }
    },
    [filteredCommands, activeIndex, handleSelect],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-900/60"
            onClick={closePalette}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
          >
            {/* Search input row */}
            <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <svg
                className="mr-3 h-5 w-5 shrink-0 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                id="command-palette-input"
                type="text"
                role="combobox"
                aria-expanded={filteredCommands.length > 0}
                aria-autocomplete="list"
                aria-controls="command-palette-list"
                aria-activedescendant={
                  filteredCommands[activeIndex]
                    ? `cp-item-${filteredCommands[activeIndex].id}`
                    : undefined
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100"
                placeholder="Navigate to… (e.g. skills, projects, contact)"
              />
              <div className="ml-3 hidden shrink-0 sm:flex space-x-1">
                <kbd className="inline-flex items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 font-sans text-xs font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  Esc
                </kbd>
              </div>
            </div>

            {/* Results list */}
            <div className="max-h-72 overflow-y-auto py-2">
              {filteredCommands.length > 0 ? (
                <ul
                  ref={listRef}
                  id="command-palette-list"
                  role="listbox"
                  aria-label="Navigation options"
                  className="space-y-0.5 px-2"
                >
                  {filteredCommands.map((cmd, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <li
                        key={cmd.id}
                        id={`cp-item-${cmd.id}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelect(cmd)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-100 ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/40"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        {/* Emoji icon */}
                        <span
                          className="text-lg leading-none select-none"
                          aria-hidden="true"
                        >
                          {cmd.emoji}
                        </span>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium leading-none ${
                              isActive
                                ? "text-indigo-700 dark:text-indigo-300"
                                : "text-slate-800 dark:text-slate-100"
                            }`}
                          >
                            {cmd.label}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {cmd.description}
                          </p>
                        </div>

                        {/* Active indicator: return key hint */}
                        {isActive && (
                          <kbd className="hidden shrink-0 sm:inline-flex items-center justify-center rounded border border-indigo-200 bg-indigo-100 px-1.5 font-sans text-xs font-medium text-indigo-500 dark:border-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                            ↵
                          </kbd>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No sections match{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    "{query}"
                  </span>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                <kbd className="mr-1 rounded border border-slate-200 bg-slate-100 px-1 dark:border-slate-600 dark:bg-slate-700">
                  ↑↓
                </kbd>
                navigate&nbsp;&nbsp;
                <kbd className="mr-1 rounded border border-slate-200 bg-slate-100 px-1 dark:border-slate-600 dark:bg-slate-700">
                  ↵
                </kbd>
                select&nbsp;&nbsp;
                <kbd className="mr-1 rounded border border-slate-200 bg-slate-100 px-1 dark:border-slate-600 dark:bg-slate-700">
                  Esc
                </kbd>
                close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
