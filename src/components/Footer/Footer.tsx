import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const navList = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contacts", href: "#contacts" },
];
const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-between pt-16 space-y-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-orange-400 text-shadow-lg">
        Lalit Bisht
      </h1>
      <nav className="flex flex-row items-center space-x-8">
        <ul className="flex space-x-8">
          {navList.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="hover:text-gray-400">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-row items-center justify-center space-x-4">
        <FaLinkedin />
        <FaFacebook />
        <FaInstagram />
        <FaSquareXTwitter />
      </div>
      <div className="w-full bg-stone-800 dark:bg-neutral-900 flex justify-center items-center py-4 px-8">
        <h6 className="text-white">
          &copy; {new Date().getFullYear()} All Rights Reserved, Inc
        </h6>
      </div>
    </footer>
  );
};

export default Footer;
