export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  impact: string[];
}

export interface ExperienceData {
  title: string;
  items: ExperienceItem[];
}

export const experienceData: ExperienceData = {
  title: "Experience",
  items: [
    {
      id: "spglobal",
      role: "Senior Software Engineer",
      company: "S&P Global",
      duration: "2021 - Present",
      impact: [
        "Led the migration of legacy monolith to microservices architecture, reducing deployment time by 40%.",
        "Mentored junior developers and established best practices for React and TypeScript development.",
        "Implemented real-time data streaming features using WebSockets for financial dashboards."
      ]
    },
    {
      id: "amdocs",
      role: "Software Engineer",
      company: "Amdocs",
      duration: "2019 - 2021",
      impact: [
        "Developed billing management UIs using React and Redux.",
        "Optimized database queries, improving API response times by 30%.",
        "Collaborated with cross-functional teams to deliver critical features on schedule."
      ]
    },
    {
      id: "wipro",
      role: "Associate Software Engineer",
      company: "Wipro",
      duration: "2017 - 2019",
      impact: [
        "Built responsive web applications for various enterprise clients.",
        "Participated in agile ceremonies and contributed to sprint planning.",
        "Wrote comprehensive unit and integration tests."
      ]
    }
  ]
};
