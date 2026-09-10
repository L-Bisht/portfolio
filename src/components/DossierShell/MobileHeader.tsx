import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import type { NavData } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";
import type { PatternMode } from "../../context/PatternContext";

interface MobileHeaderProps {
  data: NavData;
  /** @deprecated Obsolete pattern toggle prop; mobile header no longer switches background patterns. */
  patternMode?: PatternMode;
  /** @deprecated Obsolete pattern toggle prop; mobile header no longer switches background patterns. */
  onTogglePatternMode?: () => void;
}

export default function MobileHeader({
  data,
}: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14
                 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md
                 border-b border-slate-200/60 dark:border-slate-700/50"
    >
      {/* Identity */}
      <a
        href="#home"
        id="mobile-header-logo"
        className="flex items-center gap-2.5 group"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {/* Monogram */}
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black text-white
                     bg-gradient-to-br from-sky-500 to-cyan-500 shrink-0 tracking-tight"
        >
          {data.shortName}
        </span>
        <div className="leading-none">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
            {data.name}
          </p>
          <p className="text-[10px] text-sky-500 dark:text-sky-400 font-medium mt-0.5 truncate max-w-[140px]">
            {data.title}
          </p>
        </div>
      </a>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <motion.button
          id="mobile-header-theme-toggle"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center rounded-full
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
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
    </header>
  );
}
