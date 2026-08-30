import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Search, ArrowRight } from "lucide-react";
import type { NavData } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";

interface NavbarProps {
  data: NavData;
}

const Navbar = ({ data }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { openPalette } = useCommandPalette();

  return (
    <nav className="fixed w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo left | Search + Theme Toggle right */}
        <div className="flex items-center justify-between h-16">

          {/* ── Left: Logo ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <a
              href="#home"
              className="text-slate-900 dark:text-white font-bold text-xl tracking-tight"
            >
              {data.name}
            </a>
          </motion.div>

          {/* ── Right: Search + Theme Toggle ── */}
          <div className="flex items-center gap-3">

            {/* Command Palette trigger */}
            <motion.button
              id="command-palette-trigger"
              aria-label="Open navigation command palette (⌘K)"
              onClick={openPalette}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer
                         border border-indigo-300/60 dark:border-indigo-500/40
                         bg-indigo-50/80 dark:bg-indigo-950/40
                         text-indigo-600 dark:text-indigo-300
                         text-xs font-medium
                         transition-all duration-200
                         hover:border-indigo-400 dark:hover:border-indigo-400
                         hover:bg-indigo-100/90 dark:hover:bg-indigo-900/50
                         hover:shadow-[0_0_12px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_0_14px_rgba(99,102,241,0.4)]"
            >
              {/* Subtle ambient glow ring */}
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           ring-1 ring-indigo-400/30 dark:ring-indigo-400/25 blur-[2px]"
                aria-hidden="true"
              />

              <Search size={13} className="flex-shrink-0" />
              <span>Navigate</span>
              <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded border border-indigo-300/50 dark:border-indigo-600/50 bg-white/60 dark:bg-slate-800/60 px-1.5 text-[10px] text-indigo-500 dark:text-indigo-400 font-sans">
                ⌘K
              </kbd>
              {/* Arrow affordance */}
              <ArrowRight
                size={11}
                className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                aria-hidden="true"
              />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              id="theme-toggle-desktop"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={toggleTheme}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
