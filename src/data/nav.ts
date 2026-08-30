export interface NavItem {
  name: string;
  href: string;
}

export interface NavData {
  name: string;
  items: NavItem[];
}

export const navData: NavData = {
  name: "Lalit Singh Bisht",
  items: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
};
