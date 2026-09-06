import type { FC, SVGProps } from "react";

export interface SkillIconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

/**
 * Normalizes skill names for consistent dictionary lookups
 * e.g., "CSS / Tailwind" -> "csstailwind", "Next.js" -> "nextjs", "CI/CD" -> "cicd"
 */
function normalizeSkillKey(name: string): string {
  return name.toLowerCase().replace(/[\s/._-]/g, "");
}

/**
 * Permanent SVG technology brand icons for all 24 skills across 3 architectural tiers:
 * - Tier 1 (Interface): React, TypeScript, Next.js, Framer Motion, CSS/Tailwind, Vite, Figma, Node.js
 * - Tier 2 (Scale): AWS, Docker, PostgreSQL, MongoDB, Redis, CI/CD, GraphQL, Kubernetes
 * - Tier 3 (AI): LLM Integration, RAG Architecture, Vector Databases, Prompt Engineering, LangChain, Embeddings, Fine-tuning, Evals
 */
export const SkillIcon: FC<SkillIconProps> = ({
  name,
  className = "w-4 h-4 shrink-0",
  ...rest
}) => {
  const key = normalizeSkillKey(name);

  switch (key) {
    // ─── Tier 1: Interface & Experience Engine ────────────────────────────────
    case "react":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </g>
        </svg>
      );

    case "typescript":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M6 8.5h6m-3 0v8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 10c-.5-.7-1.3-1-2.2-1-1.3 0-2.1.7-2.1 1.7 0 1.2 1 1.6 2.3 2 1.4.5 2.3 1 2.3 2.2 0 1.2-1 2.1-2.4 2.1-1.2 0-2.1-.5-2.7-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "nextjs":
    case "next":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9 8v8M9 8.2l8.2 10.4M15 8v4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "framermotion":
    case "framer":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
          {...rest}
        >
          <path d="M4 3h16v6h-8z M4 9h8l8 6H4z M4 15h8v6z" />
        </svg>
      );

    case "csstailwind":
    case "tailwind":
    case "tailwindcss":
    case "css":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
          {...rest}
        >
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      );

    case "vite":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M19.8 2.8 12.6 21.6a.6.6 0 0 1-1.2 0L4.2 2.8a.7.7 0 0 1 1-1l6.2 2.4a1.8 1.8 0 0 0 1.2 0l6.2-2.4a.7.7 0 0 1 1 1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 2.5 8 11.5h3.6l-1.8 6.5 6.2-8.5h-3.8l1.3-7Z"
            fill="currentColor"
          />
        </svg>
      );

    case "figma":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
          {...rest}
        >
          <path d="M8 2h4v6H8a3 3 0 0 1 0-6zm0 6h4v6H8a3 3 0 0 1 0-6zm0 6h4v3a3 3 0 1 1-4-3zm8-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      );

    case "nodejs":
    case "node":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9L12 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8v8l5-8v8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // ─── Tier 2: Distributed Systems & Cloud Architecture ─────────────────────
    case "aws":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M17.5 13a4 4 0 0 0-1.2-7.8 5.5 5.5 0 0 0-10.4 1.8A3.5 3.5 0 0 0 6.5 14h11"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 17.5c4.5 3 11.5 3 16 0m-2 1.5 2.2-1.5-1.2-2.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "docker":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
          {...rest}
        >
          <path d="M22 11c-.4-.2-1.2-.3-1.8-.1-.1-.5-.4-1.1-.9-1.5l-.6-.4-.4.6c-.4.7-.4 1.4-.2 2.1-.6.3-1.3.3-2 .1l-.3.8c.8.3 1.6.3 2.4 0 0 .4 0 .8.1 1.2.1.5.3 1 .7 1.4-1.3 1.5-3.2 2.3-5.3 2.3-3.6 0-6.7-2.3-7.8-5.5H2v1.5c1.2 4.1 5 7 9.5 7 5.2 0 9.5-3.8 10-8.8.8-.1 1.6-.4 2.1-.9l-.6-.7z" />
          <rect x="4" y="8" width="2.2" height="2.2" rx=".3" />
          <rect x="7" y="8" width="2.2" height="2.2" rx=".3" />
          <rect x="10" y="8" width="2.2" height="2.2" rx=".3" />
          <rect x="13" y="8" width="2.2" height="2.2" rx=".3" />
          <rect x="7" y="5" width="2.2" height="2.2" rx=".3" />
          <rect x="10" y="5" width="2.2" height="2.2" rx=".3" />
          <rect x="13" y="5" width="2.2" height="2.2" rx=".3" />
        </svg>
      );

    case "postgresql":
    case "postgres":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 3.5C8.2 3.5 5 6 5 10c0 3.2 1.8 5.7 3.5 7v3.5h3V18c.3.1.7.1 1 .1 5 0 7.5-3.5 7.5-8.6C20 5.5 16.5 3.5 12 3.5z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="9.5" r="1" fill="currentColor" />
          <path
            d="M7.5 16.5c-1-1.2-1.5-2.8-1.5-4.5 0-1 .3-2.5 1-3.5M16 11c0 2-1 3.5-2.5 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case "mongodb":
    case "mongo":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 2C10.5 3 5 8 5 14c0 4 3.1 7.2 7 7.5 3.9-.3 7-3.5 7-7.5 0-6-5.5-11-7-12z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 2.5v19M12 7c2 2 3.5 4.5 3.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "redis":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 3L3.5 7.5 12 12l8.5-4.5L12 3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 12l8.5 4.5 8.5-4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 16.5l8.5 4.5 8.5-4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "cicd":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M7.5 7.5A4.5 4.5 0 0 0 3 12a4.5 4.5 0 0 0 4.5 4.5C10 16.5 11 15 12 12c1-3 2-4.5 4.5-4.5A4.5 4.5 0 0 1 21 12a4.5 4.5 0 0 1-4.5 4.5C14 16.5 13 15 12 12c-1-3-2-4.5-4.5-4.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="16.5" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );

    case "graphql":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 2.5l8.2 4.7v9.6L12 21.5 3.8 16.8V7.2L12 2.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 2.5L3.8 16.8h16.4L12 2.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="2.5" r="1.5" fill="currentColor" />
          <circle cx="20.2" cy="7.2" r="1.5" fill="currentColor" />
          <circle cx="20.2" cy="16.8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
          <circle cx="3.8" cy="16.8" r="1.5" fill="currentColor" />
          <circle cx="3.8" cy="7.2" r="1.5" fill="currentColor" />
        </svg>
      );

    case "kubernetes":
    case "k8s":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2v2.5M12 19.5V22M3.5 7.5l2.2 1.3M18.3 15.2l2.2 1.3M3.5 16.5l2.2-1.3M18.3 8.8l2.2-1.3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    // ─── Tier 3: AI Systems & Intelligence Orchestration ──────────────────────
    case "llmintegration":
    case "llm":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
          {...rest}
        >
          <path d="M10 2L12.5 8L18.5 10.5L12.5 13L10 19L7.5 13L1.5 10.5L7.5 8L10 2z" />
          <path d="M18.5 14L19.8 17.2L23 18.5L19.8 19.8L18.5 23L17.2 19.8L14 18.5L17.2 17.2L18.5 14z" />
        </svg>
      );

    case "ragarchitecture":
    case "rag":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <rect
            x="3"
            y="3"
            width="11"
            height="15"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6 7h5M6 10h5M6 13h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="15.5" r="3.8" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M19.2 18.2L22 21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 15.5h3M16.5 14v3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "vectordatabases":
    case "vectordb":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M3 3v18h18"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M3 21l6.5-6.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="1.5 2"
          />
          <circle cx="9.5" cy="14.5" r="1.8" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="2.2" fill="currentColor" />
          <circle cx="18.5" cy="15.5" r="1.8" fill="currentColor" />
          <path
            d="M9.5 14.5l6-6 3 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        </svg>
      );

    case "promptengineering":
    case "prompt":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <rect
            x="2.5"
            y="3.5"
            width="19"
            height="17"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6 8.5l4 3.5-4 3.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15.5h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18 5.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4z"
            fill="currentColor"
          />
        </svg>
      );

    case "langchain":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M9.5 14.5a4.5 4.5 0 0 0 6.36.36l3.18-3.18a4.5 4.5 0 0 0-6.36-6.36l-1.59 1.59"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 9.5a4.5 4.5 0 0 0-6.36-.36L4.96 12.32a4.5 4.5 0 0 0 6.36 6.36l1.59-1.59"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );

    case "embeddings":
    case "embedding":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <circle cx="6" cy="6" r="1.8" fill="currentColor" />
          <circle cx="12" cy="6" r="1.8" fill="currentColor" />
          <circle cx="18" cy="6" r="1.8" fill="currentColor" />
          <circle cx="6" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
          <circle cx="18" cy="12" r="1.8" fill="currentColor" />
          <circle cx="6" cy="18" r="1.8" fill="currentColor" />
          <circle cx="12" cy="18" r="1.8" fill="currentColor" />
          <circle cx="18" cy="18" r="1.8" fill="currentColor" />
          <path
            d="M6 6h12M6 12h12M6 18h12M6 6v12M12 6v12M18 6v12"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>
      );

    case "finetuning":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M4 6.5h16M4 17.5h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="8" cy="6.5" r="2.5" fill="currentColor" />
          <circle cx="16" cy="17.5" r="2.5" fill="currentColor" />
          <path
            d="M4 12h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="13" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );

    case "evals":
    case "evaluation":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          aria-hidden="true"
          {...rest}
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="17"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M9 2h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            fill="currentColor"
          />
          <path
            d="M8 12l2.5 2.5L16 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 17h8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    // Fallback: Elegant code glyph
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...rest}
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
};

export default SkillIcon;
