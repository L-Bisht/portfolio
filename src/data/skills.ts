export interface Skill {
  name: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface SkillsData {
  title: string;
  categories: SkillCategory[];
}

export const skillsData: SkillsData = {
  title: "Skills & Technologies",
  categories: [
    {
      title: "Core Engineering",
      skills: [
        { name: "React" },
        { name: "TypeScript" },
        { name: "Next.js" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "Git" },
      ],
    },
    {
      title: "Cloud & Architecture",
      skills: [
        { name: "AWS" },
        { name: "Docker" },
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "CI/CD" },
      ],
    },
    {
      title: "AI & Emerging Tech",
      skills: [
        { name: "LLM Integration" },
        { name: "Prompt Engineering" },
        { name: "Vector Databases" },
        { name: "RAG Architecture" },
      ],
    },
  ],
};
