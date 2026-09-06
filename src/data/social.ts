/**
 * Centralized Social Registry & Link Standardization
 *
 * Canonical single source of truth for developer social profiles, contact
 * destinations, and verified external credentials shared across navigation,
 * contact, and editorial dossier components.
 */

export type SocialPlatformId =
  | "github"
  | "linkedin"
  | "twitter"
  | "email"
  | "resume";

export interface SocialProfile {
  id: SocialPlatformId;
  label: string;
  sublabel: string;
  url: string;
  href: string;
  rawEmail?: string;
  iconPath: string;
  accent: string;
  accentDark: string;
  external: boolean;
  ariaLabel: string;
}

export const socialRegistry = {
  github: {
    id: "github",
    label: "GitHub",
    sublabel: "github.com/l-bisht",
    url: "https://github.com/l-bisht",
    href: "https://github.com/l-bisht",
    iconPath:
      "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    accent: "#a78bfa",
    accentDark: "#c4b5fd",
    external: true,
    ariaLabel: "GitHub profile: l-bisht",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    sublabel: "lalit-bisht-8b4b82152",
    url: "https://linkedin.com/in/lalit-bisht-8b4b82152/",
    href: "https://linkedin.com/in/lalit-bisht-8b4b82152/",
    iconPath:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    accent: "#0ea5e9",
    accentDark: "#38bdf8",
    external: true,
    ariaLabel: "LinkedIn profile: Lalit Bisht",
  },
  twitter: {
    id: "twitter",
    label: "X / Twitter",
    sublabel: "@lbisht1996",
    url: "https://x.com/lbisht1996",
    href: "https://x.com/lbisht1996",
    iconPath:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    accent: "#38bdf8",
    accentDark: "#7dd3fc",
    external: true,
    ariaLabel: "X (Twitter) profile: @lbisht1996",
  },
  email: {
    id: "email",
    label: "Email",
    sublabel: "lbisht1996@gmail.com",
    rawEmail: "lbisht1996@gmail.com",
    url: "mailto:lbisht1996@gmail.com",
    href: "mailto:lbisht1996@gmail.com",
    iconPath:
      "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z",
    accent: "#6366f1",
    accentDark: "#818cf8",
    external: false,
    ariaLabel: "Send email to lbisht1996@gmail.com",
  },
  resume: {
    id: "resume",
    label: "Resume",
    sublabel: "Download PDF",
    url: "/resume.pdf",
    href: "/resume.pdf",
    iconPath:
      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zm-6 9h10v1.5H7V13zm0 3h10v1.5H7V16zm0-6h5v1.5H7V10z",
    accent: "#10b981",
    accentDark: "#34d399",
    external: true,
    ariaLabel: "Download Resume PDF",
  },
} as const satisfies Record<SocialPlatformId, SocialProfile>;

/** Canonical ordered list of all developer profiles */
export const socialProfilesList: SocialProfile[] = [
  socialRegistry.github,
  socialRegistry.linkedin,
  socialRegistry.twitter,
  socialRegistry.email,
  socialRegistry.resume,
];

/** External profiles configured for navigation drawer & dock */
export const navSocialProfiles: SocialProfile[] = [
  socialRegistry.github,
  socialRegistry.linkedin,
  socialRegistry.twitter,
  socialRegistry.email,
];
