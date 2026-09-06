import { socialRegistry } from "./social";

export type SocialIcon = "github" | "linkedin" | "twitter";

export interface SocialLink {
  name: string;
  url: string;
  icon: SocialIcon;
}

export interface ContactData {
  title: string;
  description: string;
  socialLinks: SocialLink[];
  email: string;
  location: string;
}

export const contactData: ContactData = {
  title: "Get In Touch",
  description:
    "Have a question or want to work together? Feel free to reach out!",
  socialLinks: [
    {
      name: socialRegistry.github.label,
      url: socialRegistry.github.url,
      icon: "github",
    },
    {
      name: socialRegistry.linkedin.label,
      url: socialRegistry.linkedin.url,
      icon: "linkedin",
    },
    {
      name: socialRegistry.twitter.label,
      url: socialRegistry.twitter.url,
      icon: "twitter",
    },
  ],
  email: socialRegistry.email.rawEmail ?? "lbisht1996@gmail.com",
  location: "New Delhi, India",
};

