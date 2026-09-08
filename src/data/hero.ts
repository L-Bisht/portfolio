export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroTelemetry {
  status: string;
  roleTarget: string;
  location: string;
  timezone: string;
  focus: string[];
  coreStack: string[];
}

export interface HeroData {
  eyebrow: string;
  name: string;
  title: string;
  thesis: string;
  actions: {
    primary: HeroAction;
    secondary: HeroAction;
  };
  telemetry: HeroTelemetry;
  // Backward compatibility aliases
  greeting?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

export const heroData: HeroData = {
  eyebrow: "Senior Software Engineer & Architect",
  name: "Lalit Singh Bisht",
  title: "Versatile & AI-Augmented Developer",
  thesis:
    "I architect resilient systems and high-velocity web platforms anchored in domain-driven design. Bridging deep systems architecture with AI-accelerated engineering craft to ship maintainable products at scale.",
  actions: {
    primary: {
      label: "Explore Selected Work",
      href: "#projects",
    },
    secondary: {
      label: "View Resume",
      href: "#contact",
    },
  },
  telemetry: {
    status: "Available for Work",
    roleTarget: "Senior Roles",
    location: "New Delhi, India · Global Remote",
    timezone: "UTC+5:30 (IST)",
    focus: [
      "Domain-Driven Design",
      "AI-Native Developer Tooling",
      "Resilient Distributed Systems",
    ],
    coreStack: [
      "React / Next.js",
      "TypeScript",
      "Node.js",
      "LLM Engineering",
    ],
  },
  greeting: "Senior Software Engineer & Architect",
  primaryCta: { text: "Explore Selected Work", href: "#projects" },
  secondaryCta: { text: "View Resume", href: "#contact" },
};
