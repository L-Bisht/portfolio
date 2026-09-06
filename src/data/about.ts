export interface AboutStat {
  label: string;
  value: string;
  /** Icon name to resolve inside the component */
  icon: "layers" | "zap" | "box";
  glowColor: string;
}

export interface FocusItem {
  label: string;
  tag: string;
}

export interface AboutData {
  title: string;
  philosophyHeadline: string;
  philosophyBody: string;
  currentFocusHeadline: string;
  currentFocusItems: FocusItem[];
  stats: AboutStat[];
  startDate: Date;
}

export const aboutData: AboutData = {
  title: "About Me",

  philosophyHeadline: "Engineering with Intention",
  philosophyBody:
    "I architect software around domain boundaries, not technical layers. " +
    "Domain-Driven Design keeps complexity legible as systems scale, while AI-augmented " +
    "tooling compresses the feedback loop between intent and working code. " +
    "The result: teams that ship confident, maintainable products — fast.",

  currentFocusHeadline: "What I'm Building",
  currentFocusItems: [
    { label: "AI-native developer tooling", tag: "LLM Agents" },
    { label: "Event-sourced CQRS pipelines", tag: "System Design" },
    { label: "Real-time collaborative UIs", tag: "React / WebSockets" },
    { label: "Adaptive RAG retrieval systems", tag: "ML Infra" },
  ],

  stats: [
    {
      label: "Years Experience",
      value: "{years}+",
      icon: "layers",
      glowColor: "rgba(99,102,241,0.35)",
    },
    {
      label: "Scaled Systems",
      value: "12+",
      icon: "zap",
      glowColor: "rgba(139,92,246,0.35)",
    },
    {
      label: "Projects Delivered",
      value: "50+",
      icon: "box",
      glowColor: "rgba(168,85,247,0.30)",
    },
  ],

  startDate: new Date(2019, 9), // October 2019
};
