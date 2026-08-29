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
  description: "Here are some of my recent works. Hover over the cards to learn more.",
  categories: ["all", "frontend", "backend", "fullstack"],
  projects: [
    {
      id: 1,
      title: "Project 1",
      description:
        "Description of project 1. Add details about the project, its features, and your role.",
      technologies: ["React", "TypeScript", "Node.js"],
      image: "/project1.jpg",
      demoUrl: "https://demo1.com",
      sourceUrl: "https://github.com/yourusername/project1",
      category: "frontend",
    },
    // Add more projects here
  ],
};
