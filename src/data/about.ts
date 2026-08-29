export interface AboutStat {
  label: string;
  valueTemplate: string; // e.g., "{years}+"
}

export interface AboutData {
  title: string;
  paragraphs: string[];
  stats: AboutStat[];
  startDate: Date;
}

export const aboutData: AboutData = {
  title: "About Me",
  paragraphs: [
    "Hello! I'm Lalit Singh Bisht, a versatile and AI-augmented developer. Over the past {experience}, I have focused on building robust architectures, deeply integrating Domain-Driven Design (DDD), and crafting exceptional Developer Experiences (DX).",
    "I leverage modern AI tools to accelerate development, improve code quality, and solve complex architectural challenges. By combining strong engineering principles with AI capabilities, I deliver scalable and maintainable solutions rapidly.",
    "When I'm not architecting systems, you can find me exploring the latest advancements in AI and software engineering. I believe in continuous learning and adapting to the ever-evolving tech landscape.",
  ],
  stats: [
    { label: "Years Experience", valueTemplate: "{years}+" },
    { label: "Projects Completed", valueTemplate: "50+" },
  ],
  startDate: new Date(2019, 9), // October 2019
};
