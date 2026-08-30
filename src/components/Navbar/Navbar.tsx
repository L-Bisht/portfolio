import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import type { NavData } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";

interface NavbarProps {
  data: NavData;
}

const Navbar = ({ data }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { openPalette } = useCommandPalette();

  const navItems = data.items;

  return (
    <nav className="fixed w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Developer name / logo */}
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                {item.name}
              </motion.a>
            ))}

            {/* AI Co-pilot trigger */}
            <motion.button
              id="ai-copilot-trigger"
              aria-label="Open AI Co-pilot command palette (⌘K)"
              onClick={openPalette}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg
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

              <Sparkles size={13} className="flex-shrink-0 animate-pulse" />
              <span>AI Co-pilot</span>
              <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded border border-indigo-300/50 dark:border-indigo-600/50 bg-white/60 dark:bg-slate-800/60 px-1.5 text-[10px] text-indigo-500 dark:text-indigo-400 font-sans">
                ⌘K
              </kbd>
            </motion.button>

            {/* Theme toggle — desktop */}
            <motion.button
              id="theme-toggle-desktop"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={toggleTheme}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (navItems.length + 1) * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
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

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile AI trigger (icon-only) */}
            <button
              id="ai-copilot-trigger-mobile"
              aria-label="Open AI Co-pilot command palette"
              onClick={openPalette}
              className="p-2 rounded-md text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors duration-200"
            >
              <Sparkles size={20} strokeWidth={1.5} className="animate-pulse" />
            </button>

            <button
              id="theme-toggle-mobile"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={toggleTheme}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun-mobile"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <Sun size={20} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon-mobile"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <Moon size={20} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {isOpen ? (
                <X size={24} strokeWidth={1.75} />
              ) : (
                <Menu size={24} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-link block px-3 py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
