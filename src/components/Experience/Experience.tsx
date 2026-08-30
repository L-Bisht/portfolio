import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ExperienceData } from "../../data/experience";

interface ExperienceProps {
  data: ExperienceData;
}

const Experience = ({ data }: ExperienceProps) => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "-20% 0px -20% 0px",
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-blue-500/8 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px flex-1 max-w-8 bg-indigo-500/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 dark:text-indigo-400">
            Experience
          </span>
          <span className="h-px flex-1 bg-slate-200/60 dark:bg-white/10" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center sm:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.title}
            </h2>
          </motion.div>

          {/* Timeline Items */}
          <div className="relative border-l border-slate-200 dark:border-white/10 ml-3 sm:ml-0">
            {data.items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="mb-10 ml-8 relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 z-10 transition-transform duration-300 group-hover:scale-125" />

                <div
                  aria-label={`${item.role} at ${item.company}`}
                  className="group overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-shadow duration-300"
                >
                  <div className="p-6 sm:p-8">
                    {/* subtle inner glow on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-400/5 to-indigo-600/5" />

                    <div className="relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {item.role}
                          </h3>
                          <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                            {item.company}
                          </p>
                        </div>
                        <span className="mt-2 sm:mt-0 inline-block px-3 py-1 text-sm font-semibold rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                          {item.duration}
                        </span>
                      </div>

                      <ul className="space-y-3 mt-6">
                        {item.impact.map((point, i) => (
                          <li key={i} className="flex text-base leading-relaxed text-slate-600 dark:text-slate-400">
                            <span className="mr-3 text-indigo-400 mt-1.5 opacity-60">▹</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
