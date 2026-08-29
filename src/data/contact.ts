export interface SocialLink {
  name: string;
  url: string;
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
    { name: "GitHub", url: "https://github.com/l-bisht" },
    { name: "LinkedIn", url: "https://linkedin.com/in/lalit-bisht-8b4b82152/" },
    { name: "Twitter", url: "https://x.com/lbisht1996" },
  ],
  email: "lbisht1996@gmail.com",
  location: "New Delhi, India",
};
