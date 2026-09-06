import beastUiImg from "../assets/projectImages/beast-ui.png";

export interface Project {
  id: number;
  title: string;
  category: string;
  /** Short architectural problem statement (1–2 sentences) */
  problem: string;
  /** Solution / architecture summary (1–2 sentences) */
  solution: string;
  /** Brief description also used in fallback contexts */
  description: string;
  technologies: string[];
  image: string;
  demoUrl: string;
  sourceUrl: string;
}

export interface ProjectsData {
  title: string;
  subtitle: string;
  projects: Project[];
}

export const projectsData: ProjectsData = {
  title: "Featured Projects",
  subtitle: "Case studies in engineering",
  projects: [
    {
      id: 1,
      title: "Beast UI",
      category: "Component Library",
      problem:
        "Teams were copy-pasting inconsistent UI patterns across projects, causing visual drift and duplicated maintenance burden.",
      solution:
        "An opinionated, headless-first React component library built on shadcn/ui primitives with Tailwind variants, shipped as a versioned npm package.",
      description:
        "A UI component library for React. Provides a set of reusable UI components for building web applications.",
      technologies: ["React", "TypeScript", "shadcn/ui", "Tailwind CSS", "Radix UI", "Storybook"],
      image: beastUiImg,
      demoUrl: "https://l-bisht.github.io/beast-ui/",
      sourceUrl: "https://github.com/L-Bisht/beast-ui",
    },
    {
      id: 2,
      title: "Portfolio Dossier",
      category: "Design System",
      problem:
        "Most developer portfolios default to generic templates that fail to communicate engineering depth or design sensibility.",
      solution:
        "A custom editorial layout system built on Vite + React with framer-motion, featuring a sticky dossier shell, bento narrative grids, and smooth inView transitions.",
      description:
        "This very portfolio — an asymmetric editorial layout system that doubles as a live design showcase.",
      technologies: ["React", "TypeScript", "Framer Motion", "Vite", "Tailwind CSS"],
      image: beastUiImg,
      demoUrl: "https://l-bisht.github.io/",
      sourceUrl: "https://github.com/L-Bisht/portfolio",
    },
  ],
};
