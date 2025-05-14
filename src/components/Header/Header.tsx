import { GiHamburgerMenu } from "react-icons/gi";

import Button from "../Styled/Button";
import { useState } from "react";

const navList = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact Me", href: "#contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="w-full flex items-center justify-between p-4 fixed top-0 z-10 bg-gray-100 dark:bg-stone-900 shadow-xs">
      <h1 className="text-2xl font-bold text-orange-400 text-shadow-lg">
        Lalit Bisht
      </h1>
      <nav className="flex flex-row items-center gap-x-8">
        <ul className="gap-x-8 hidden md:flex">
          {navList.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="hover:text-gray-400 dark:text-white"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <Button>Download CV</Button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-0 m-0 cursor-pointer"
        >
          <GiHamburgerMenu className="text-2xl text-gray-600 dark:text-white" />
        </button>
        {isMenuOpen && (
          <ul className="absolute top-16 right-0 w-1/4 bg-gray-100 dark:bg-stone-900 flex flex-col items-start space-y-4 p-4 shadow-md md:hidden">
            {navList.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-gray-400 dark:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
