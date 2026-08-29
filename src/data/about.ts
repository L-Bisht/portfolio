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
    "Hello! I'm Lalit Singh Bisht, a passionate full-stack developer with a keen interest in building exceptional digital experiences. With a background in computer science and years of hands-on experience, I specialize in creating efficient, scalable, and user-friendly applications.",
    "My journey in web development started {experience} ago, and since then, I've had the privilege of working with various technologies and frameworks. I love tackling complex problems and turning them into simple, beautiful solutions.",
    "When I'm not coding, you can find me playing Video Games. I believe in continuous learning and staying updated with the latest tech trends.",
  ],
  stats: [
    { label: "Years Experience", valueTemplate: "{years}+" },
    { label: "Projects Completed", valueTemplate: "50+" },
  ],
  startDate: new Date(2019, 9), // October 2019
};
