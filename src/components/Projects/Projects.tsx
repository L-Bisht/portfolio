import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ProjectsData, Project } from "../../data/projects";
import GlowCard from "../GlowCard";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <GlowCard aria-label={project.title}>
        {/* Outer wrapper is `relative` so the overlay can cover the full card height */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          {/* image */}
          <div className="aspect-video overflow-hidden">
            <motion.img
              src={project.image}
              alt={project.title}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* bottom info bar (always visible, fades out on hover) */}
          <motion.div
            className="p-4 border-t border-slate-200/60 dark:border-white/10"
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {project.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {project.technologies.slice(0, 3).join(" · ")}
            </p>
          </motion.div>

          {/* hover overlay — glass panel covering the full card */}
          <motion.div
            className={`absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent backdrop-blur-sm ${
              isHovered ? "pointer-events-auto" : "pointer-events-none"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 12, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 text-xs font-medium bg-white/15 text-white/90 rounded-full border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200"
                >
                  Live Demo
                </a>
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors duration-200"
                >
                  Source
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </GlowCard>
    </motion.div>
  );
};

interface ProjectsProps {
  data: ProjectsData;
}

const Projects = ({ data }: ProjectsProps) => {
  const [ref, inView] = useInView({ 
    triggerOnce: false, 
    threshold: 0,
    rootMargin: "-20% 0px -20% 0px"
  });
  const [filter, setFilter] = useState("all");

  const projects = data.projects;
  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative py-28 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-400/8 dark:bg-indigo-600/6 blur-3xl" />
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
            Work
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            {data.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            {data.description}
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-2 mb-12 flex-wrap"
        >
          {data.categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === category
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-sm"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
