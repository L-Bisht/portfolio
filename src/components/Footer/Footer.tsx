import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/60 dark:border-white/10">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Brand */}
          <a
            href="#home"
            className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Portfolio
          </a>

          {/* Copy */}
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
            © {currentYear} Lalit Singh Bisht. All rights reserved.
          </p>

          {/* Built with */}
          <p className="text-xs text-slate-400 dark:text-slate-600">
            Built with{" "}
            <span className="text-indigo-500">React</span>
            {" & "}
            <span className="text-indigo-500">Framer Motion</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
