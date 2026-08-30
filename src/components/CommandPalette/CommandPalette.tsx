import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCommandPalette } from "../../context/CommandPaletteContext";

export default function CommandPalette() {
  const { isOpen, closePalette } = useCommandPalette();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the palette opens
      // Using a small timeout to ensure the element is rendered and animated
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
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
            <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <svg
                className="mr-3 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                type="text"
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100"
                placeholder="Type a command or search..."
              />
              <div className="ml-3 hidden sm:flex space-x-1">
                <kbd className="inline-flex items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 font-sans text-xs font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  Esc
                </kbd>
              </div>
            </div>
            
            {/* Placeholder for content. Later issues will fill this in. */}
            <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No recent searches
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
