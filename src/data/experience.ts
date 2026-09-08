export interface ExperienceMetric {
  label: string;
  /** Tailwind-compatible accent colour key — drives the tag's tint */
  accent: "emerald" | "sky" | "cobalt" | "amber" | "cyan";
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  /** Full tenure string shown in the left column */
  duration: string;
  /** Short year-range rendered as the sticky date stamp */
  period: string;
  /** Quantifiable headline metrics — rendered as coloured callout tags */
  metrics: ExperienceMetric[];
  /** Impact-driven bullet points beneath the metric tags */
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
      duration: "Jan 2021 – Present",
      period: "2021–Now",
      metrics: [
        { label: "40% deployment time reduction", accent: "emerald" },
        { label: "Real-time WebSocket streaming", accent: "sky" },
        { label: "Microservices migration lead", accent: "cobalt" },
      ],
      impact: [
        "Led the migration of a legacy monolith to microservices architecture, slashing deployment time by 40% and enabling independent team releases.",
        "Designed and shipped real-time financial dashboards with WebSocket streaming, reducing data latency from seconds to under 100 ms.",
        "Established React + TypeScript best practices across four squads; mentored six junior engineers to independent feature ownership.",
      ],
    },
    {
      id: "amdocs",
      role: "Software Engineer",
      company: "Amdocs",
      duration: "Jun 2019 – Dec 2020",
      period: "2019–2021",
      metrics: [
        { label: "30% API response speedup", accent: "emerald" },
        { label: "Billing management UI", accent: "cyan" },
        { label: "Cross-functional delivery", accent: "amber" },
      ],
      impact: [
        "Optimised critical database queries powering billing workflows, improving median API response times by 30% at peak load.",
        "Built billing management UIs with React and Redux for a Tier-1 telecom client serving 12 M+ subscribers.",
        "Collaborated across product, QA, and DevOps teams to hit every sprint commitment across a 9-month engagement.",
      ],
    },
    {
      id: "wipro",
      role: "Associate Software Engineer",
      company: "Wipro",
      duration: "Aug 2017 – May 2019",
      period: "2017–2019",
      metrics: [
        { label: "Enterprise-grade responsive UIs", accent: "sky" },
        { label: "Agile delivery cadence", accent: "cobalt" },
        { label: "Full test coverage foundation", accent: "amber" },
      ],
      impact: [
        "Delivered responsive web applications for enterprise clients across three industry verticals, each passing stakeholder UAT on first review.",
        "Participated actively in agile ceremonies — sprint planning, retrospectives, and backlog refinement — across a 24-month engagement.",
        "Authored unit and integration test suites that became the template for test coverage standards across the division.",
      ],
    },
  ],
};
