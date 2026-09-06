import { motion } from "framer-motion";

const STACK_NOTES = [
  { label: "React 19", href: "https://react.dev" },
  { label: "TypeScript", href: "https://typescriptlang.org" },
  { label: "Framer Motion", href: "https://framer.com/motion" },
  { label: "Tailwind v4", href: "https://tailwindcss.com" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full overflow-hidden
        border-t border-slate-200/60 dark:border-white/[0.07]"
    >
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-white/50 dark:bg-[#050811]/60 backdrop-blur-sm" />

      {/* Top separator — editorial hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-indigo-400/25 dark:via-indigo-500/15 to-transparent"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-8"
        >
          {/* Top row: brand mark */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Brand mark */}
            <a
              href="#home"
              className="group flex items-center gap-2.5
                text-base font-bold tracking-tight
                text-slate-800 dark:text-white
                hover:text-indigo-500 dark:hover:text-indigo-400
                transition-colors duration-200"
              aria-label="Back to top"
            >
              <span
                className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                  ring-2 ring-indigo-400/30 dark:ring-indigo-500/20
                  group-hover:ring-indigo-400/60 transition-all duration-300
                  flex-shrink-0"
              />
              <span>L. Bisht</span>
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200/70 dark:bg-white/[0.06]" />

          {/* Bottom row: copyright + domain architecture */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-slate-400 dark:text-slate-600 tabular-nums">
              © {currentYear} Lalit Singh Bisht. All rights reserved.
            </p>

            {/* Domain architecture notes */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 dark:text-slate-600 mr-1">
                Built with
              </span>
              {STACK_NOTES.map((item, idx) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium
                      text-slate-500 dark:text-slate-500
                      hover:text-indigo-500 dark:hover:text-indigo-400
                      transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                  {idx < STACK_NOTES.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-700 text-xs">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
