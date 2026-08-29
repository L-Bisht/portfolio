export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
}

export const heroData: HeroData = {
  greeting: "Hi, my name is",
  name: "Lalit Singh Bisht",
  title: "Versatile & AI-Augmented Developer",
  primaryCta: { text: "View Projects", href: "#projects" },
  secondaryCta: { text: "Contact Me", href: "#contact" },
};
