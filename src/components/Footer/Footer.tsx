import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-textSecondary">
            © {currentYear} Your Name. All rights reserved.
          </p>
          <p className="text-textSecondary mt-2">
            Built with React, TypeScript, and Framer Motion
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
