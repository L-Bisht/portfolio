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
    { name: "GitHub", url: "https://github.com/l-bisht", icon: "github" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/lalit-bisht-8b4b82152/",
      icon: "linkedin",
    },
    { name: "X / Twitter", url: "https://x.com/lbisht1996", icon: "twitter" },
  ],
  email: "lbisht1996@gmail.com",
  location: "New Delhi, India",
};
