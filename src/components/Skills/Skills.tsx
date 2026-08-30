import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SkillsData } from "../../data/skills";
import GlowCard from "../GlowCard";

interface SkillsProps {
  data: SkillsData;
}

const Skills = ({ data }: SkillsProps) => {
  const [ref, inView] = useInView({ 
    triggerOnce: false, 
    threshold: 0,
    rootMargin: "-20% 0px -20% 0px"
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      ref={ref}
      id="skills"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-indigo-400/8 dark:bg-indigo-600/6 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px flex-1 max-w-8 bg-indigo-500/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500">
            Expertise
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-16"
        >
          {data.title}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {data.categories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
            >
              <GlowCard aria-label={`${category.title} skills`}>
                <div className="p-7">
                  <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-indigo-500 mb-6">
                    {category.title}
                  </h3>

                  <div className="flex flex-wrap gap-2.5">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-full hover:border-indigo-500/30 dark:hover:border-indigo-400/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-400/10 transition-colors cursor-default"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
