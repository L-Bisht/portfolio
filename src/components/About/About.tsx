import { motion } from "framer-motion";
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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = data.stats.map(stat => ({
    label: stat.label,
    value: stat.valueTemplate.replace("{years}", calculateYearsOnly()),
  }));

  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-8 lg:px-16 bg-slate-100 dark:bg-slate-800/50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              {data.title}
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              {data.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.replace("{experience}", calculateExperience())}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${index === stats.length - 1 ? "col-span-2" : ""
                  }`}
              >
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
