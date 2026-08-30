import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import InteractiveBackground from "./components/InteractiveBackground/InteractiveBackground";

import { navData } from "./data/nav";
import { heroData } from "./data/hero";
import { aboutData } from "./data/about";
import { skillsData } from "./data/skills";
import { experienceData } from "./data/experience";
import { projectsData } from "./data/projects";
import { contactData } from "./data/contact";
function App() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900">
      <InteractiveBackground />
      <Navbar data={navData} />
      <main className="flex flex-col">
        <AnimatePresence mode="wait">
          <Hero data={heroData} />
          <About data={aboutData} />
          <Skills data={skillsData} />
          <Experience data={experienceData} />
          <Projects data={projectsData} />
          <Contact data={contactData} />
        </AnimatePresence>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}

export default App;
