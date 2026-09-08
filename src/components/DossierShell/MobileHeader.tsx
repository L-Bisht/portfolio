import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import type { NavData } from "../../data/nav";
import { useTheme } from "../../context/ThemeContext";
import { usePattern, type PatternMode } from "../../context/PatternContext";

interface MobileHeaderProps {
  data: NavData;
  patternMode?: PatternMode;
  onTogglePatternMode?: () => void;
}

export default function MobileHeader({
  data,
  patternMode: controlledPatternMode,
  onTogglePatternMode: controlledToggle,
}: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const patternContext = usePattern();

  const currentPatternMode = controlledPatternMode ?? patternContext.patternMode;
  const handleTogglePattern = controlledToggle ?? patternContext.togglePatternMode;

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
        {/* Pattern switcher toggle */}
        <motion.button
          id="mobile-header-pattern-toggle"
          aria-label={
            currentPatternMode === "cubes"
              ? "Switch to Dot Matrix background"
              : "Switch to Isometric Lattice background"
          }
          onClick={handleTogglePattern}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center rounded-full
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
        >
          <AnimatePresence mode="wait" initial={false}>
            {currentPatternMode === "cubes" ? (
              <motion.span
                key="cubes"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {/* Isometric Cube wireframe SVG */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 1.2 L11.2 3.9 L11.2 9.1 L6.5 11.8 L1.8 9.1 L1.8 3.9 Z"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M6.5 6.5 L6.5 11.8 M6.5 6.5 L11.2 3.9 M6.5 6.5 L1.8 3.9"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="dots"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {/* 3x3 Dot Grid SVG */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden="true"
                >
                  {[2, 6.5, 11].flatMap((x) =>
                    [2, 6.5, 11].map((y) => (
                      <circle
                        key={`${x}-${y}`}
                        cx={x}
                        cy={y}
                        r="1.2"
                        fill="currentColor"
                      />
                    ))
                  )}
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

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
