export interface Capability {
  name: string;
  /** optional short descriptor shown on hover */
  descriptor?: string;
}

export interface ArchitecturalTier {
  /** Tier number: 1 | 2 | 3 */
  tier: 1 | 2 | 3;
  /** Short badge label, e.g. "Tier 01" */
  badge: string;
  title: string;
  subtitle: string;
  /** Accent colour key for this tier */
  accent: "indigo" | "violet" | "cyan";
  capabilities: Capability[];
}

export interface SkillsData {
  sectionLabel: string;
  title: string;
  tiers: ArchitecturalTier[];
}

export const skillsData: SkillsData = {
  sectionLabel: "Expertise",
  title: "Architectural Stack",
  tiers: [
    {
      tier: 1,
      badge: "Tier 01",
      title: "Interface & Experience Engine",
      subtitle: "Pixel-perfect UIs, design systems, and real-time interactions",
      accent: "indigo",
      capabilities: [
        { name: "React", descriptor: "Component architecture" },
        { name: "TypeScript", descriptor: "Type-safe systems" },
        { name: "Next.js", descriptor: "Full-stack framework" },
        { name: "Framer Motion", descriptor: "Animation layer" },
        { name: "CSS / Tailwind", descriptor: "Design systems" },
        { name: "Vite", descriptor: "Build toolchain" },
        { name: "Figma", descriptor: "Design-to-code" },
        { name: "Node.js", descriptor: "Server runtime" },
      ],
    },
    {
      tier: 2,
      badge: "Tier 02",
      title: "Distributed Systems & Cloud Architecture",
      subtitle: "Scalable infrastructure, data pipelines, and cloud-native design",
      accent: "violet",
      capabilities: [
        { name: "AWS", descriptor: "Cloud platform" },
        { name: "Docker", descriptor: "Containerisation" },
        { name: "PostgreSQL", descriptor: "Relational data" },
        { name: "MongoDB", descriptor: "Document store" },
        { name: "Redis", descriptor: "In-memory cache" },
        { name: "CI/CD", descriptor: "Automated delivery" },
        { name: "GraphQL", descriptor: "API layer" },
        { name: "Kubernetes", descriptor: "Orchestration" },
      ],
    },
    {
      tier: 3,
      badge: "Tier 03",
      title: "AI Systems & Intelligence Orchestration",
      subtitle: "LLM pipelines, semantic retrieval, and agentic workflows",
      accent: "cyan",
      capabilities: [
        { name: "LLM Integration", descriptor: "GPT / Gemini / Claude" },
        { name: "RAG Architecture", descriptor: "Retrieval pipelines" },
        { name: "Vector Databases", descriptor: "Pinecone / Qdrant" },
        { name: "Prompt Engineering", descriptor: "Chain-of-thought" },
        { name: "LangChain", descriptor: "Agent orchestration" },
        { name: "Embeddings", descriptor: "Semantic search" },
        { name: "Fine-tuning", descriptor: "Domain adaptation" },
        { name: "Evals", descriptor: "Model assessment" },
      ],
    },
  ],
};
