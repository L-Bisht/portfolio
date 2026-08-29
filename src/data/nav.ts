export interface NavItem {
  name: string;
  href: string;
}

export interface NavData {
  items: NavItem[];
}

export const navData: NavData = {
  items: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
};
