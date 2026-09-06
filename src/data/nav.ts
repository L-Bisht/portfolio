import { navSocialProfiles } from "./social";

export interface NavItem {
  id: string;
  name: string;
  href: string;
  /** Emoji used by command palette and floating dock */
  emoji: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** SVG path data for the icon */
  iconPath: string;
}

export interface Availability {
  available: boolean;
  label: string;
}

export interface NavData {
  name: string;
  shortName: string;
  title: string;
  availability: Availability;
  items: NavItem[];
  social: SocialLink[];
}

export const navData: NavData = {
  name: "Lalit Singh Bisht",
  shortName: "LSB",
  title: "Versatile & AI-Augmented Developer",
  availability: {
    available: true,
    label: "Available for Work",
  },
  items: [
    { id: "home", name: "Home", href: "#home", emoji: "🏠" },
    { id: "about", name: "About", href: "#about", emoji: "👤" },
    { id: "skills", name: "Skills", href: "#skills", emoji: "⚡" },
    { id: "experience", name: "Experience", href: "#experience", emoji: "💼" },
    { id: "projects", name: "Projects", href: "#projects", emoji: "🚀" },
    { id: "contact", name: "Contact", href: "#contact", emoji: "✉️" },
  ],
  social: navSocialProfiles.map((profile) => ({
    id: profile.id,
    label: profile.label,
    href: profile.href,
    iconPath: profile.iconPath,
  })),
};
