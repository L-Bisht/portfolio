import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { AboutData } from "../../data/about";

interface AboutProps {
  data: AboutData;
}

const About = ({ data }: AboutProps) => {
  const calculateExperience = () => {
    const startDate = data.startDate;
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    const totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    if (displayMonths === 0) return `${displayYears} years`;
    if (displayYears === 0) return `${displayMonths} months`;
    return `${displayYears} years and ${displayMonths} months`;
  };

  const calculateYearsOnly = () => {
    const startDate = data.startDate;
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    const totalMonths = years * 12 + months;
    return `${Math.floor(totalMonths / 12)}`;
  };

  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const stats = data.stats.map((stat) => ({
    label: stat.label,
    value: stat.valueTemplate.replace("{years}", calculateYearsOnly()),
  }));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      id="about"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sky-400/10 dark:bg-sky-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-400/10 dark:bg-violet-500/8 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px flex-1 max-w-8 bg-sky-400/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-400 dark:text-sky-400">
            About
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start"
        >
          {/* Left — text */}
          <div className="space-y-6">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {data.title}
            </motion.h2>

            <div className="space-y-4">
              {data.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  variants={itemVariants}
                  className="text-base leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {p.replace("{experience}", calculateExperience())}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right — stat cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`
                  group relative overflow-hidden rounded-2xl p-6
                  bg-white/60 dark:bg-white/5
                  border border-slate-200/60 dark:border-white/10
                  backdrop-blur-xl
                  shadow-sm hover:shadow-lg dark:hover:shadow-sky-500/10
                  transition-shadow duration-300
                  ${index === stats.length - 1 ? "col-span-2" : ""}
                `}
              >
                {/* subtle inner glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-sky-400/5 to-violet-400/5" />

                <div className="relative">
                  <div className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
