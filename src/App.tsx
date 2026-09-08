import DossierShell from "./components/DossierShell";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import InteractiveBackground from "./components/InteractiveBackground/InteractiveBackground";

import { navData } from "./data/nav";
import { heroData } from "./data/hero";
import { aboutData } from "./data/about";
import { skillsData } from "./data/skills";
import { experienceData } from "./data/experience";
import { projectsData } from "./data/projects";
import { contactData } from "./data/contact";
import { useScrollSpy } from "./components/DossierShell/useScrollSpy";

import { PatternProvider } from "./context/PatternContext";

const SECTION_IDS = ["home", "about", "skills", "experience", "projects", "contact"];

function App() {
  const activeSectionId = useScrollSpy(SECTION_IDS);

  return (
    <PatternProvider>
      <div className="relative min-h-screen bg-slate-50 dark:bg-[#050811]">
        <InteractiveBackground activeSectionId={activeSectionId} />

      <DossierShell
        data={navData}
        activeSectionId={activeSectionId}
      >
        <Hero data={heroData} />
        <About data={aboutData} />
        <Skills data={skillsData} />
        <Experience data={experienceData} />
        <Projects data={projectsData} />
        <Contact data={contactData} />
        <Footer />
      </DossierShell>
    </div>
    </PatternProvider>
  );
}

export default App;
