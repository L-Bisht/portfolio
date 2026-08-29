import { motion } from "framer-motion";
import type { HeroData } from "../../data/hero";

interface HeroProps {
  data: HeroData;
}

const Hero = ({ data }: HeroProps) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto"
    >
      {/* Decorative background — will be replaced by the hero-sequence redesign (issue 03) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true" />

      <div className="z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sky-500 dark:text-sky-400 text-lg mb-4"
        >
          {data.greeting}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-900 dark:text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
        >
          {data.name}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-700 dark:text-slate-300 text-2xl md:text-4xl lg:text-5xl font-bold mb-8"
        >
          {data.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <a href={data.primaryCta.href} className="btn-primary">
            {data.primaryCta.text}
          </a>
          <a href={data.secondaryCta.href} className="btn-primary">
            {data.secondaryCta.text}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
