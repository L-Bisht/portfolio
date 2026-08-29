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
  description: "Have a question or want to work together? Feel free to reach out!",
  socialLinks: [
    { name: "GitHub", url: "https://github.com/yourusername" },
    { name: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
    { name: "Twitter", url: "https://twitter.com/yourusername" },
  ],
  email: "your.email@example.com",
  location: "Your City, Country",
};
