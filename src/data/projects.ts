export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  demoUrl: string;
  sourceUrl: string;
  category: string;
}

export interface ProjectsData {
  title: string;
  description: string;
  categories: string[];
  projects: Project[];
}

export const projectsData: ProjectsData = {
  title: "Featured Projects",
  description:
    "Here are some of my recent works. Hover over the cards to learn more.",
  categories: ["all", "frontend", "backend", "fullstack"],
  projects: [
    {
      id: 1,
      title: "Beast UI",
      description:
        "A UI component library for React. Provides a set of reusable UI components for building web applications.",
      technologies: ["React", "TypeScript", "shadcn/ui", "tailwindcss"],
      image: "/project1.jpg",
      demoUrl: "https://l-bisht.github.io/beast-ui/",
      sourceUrl: "https://github.com/L-Bisht/beast-ui",
      category: "frontend",
    },
  ],
};
