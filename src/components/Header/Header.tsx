import Button from "../Styled/Button";

const navList = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contacts", href: "#contacts" },
];
const Header = () => {
  return (
    <header className="w-full flex items-center justify-between p-4 fixed top-0 z-10 bg-gray-100 dark:bg-stone-900 shadow-xs">
      <h1 className="text-2xl font-bold text-orange-400 text-shadow-lg">
        Lalit Bisht
      </h1>
      <nav className="flex flex-row items-center space-x-8">
        <ul className="flex space-x-8">
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
      </nav>
    </header>
  );
};

export default Header;
