import { describe, it, expect, beforeAll } from "vitest";
import { renderToString } from "react-dom/server";
declare const process: { cwd: () => string };

import App from "../../App";
import { ThemeProvider } from "../../context/ThemeContext";
import SectionScaffold from "../SectionScaffold";
import Projects from "../Projects";

import { projectsData } from "../../data/projects";

describe("Stable Section Motion Lifecycle & MotionValue Decoupling (Issue 05)", () => {
  let appSource = "";
  let sectionScaffoldSource = "";
  let aboutSource = "";
  let skillsSource = "";
  let experienceSource = "";
  let projectsSource = "";
  let contactSource = "";
  let footerSource = "";
  let filesWithTriggerOnceFalse: string[] = [];

  beforeAll(async () => {
    const fsMod = "node:fs";
    const pathMod = "node:path";
    const fs = await import(fsMod);
    const path = await import(pathMod);

    const rootDir = process.cwd();
    appSource = fs.readFileSync(path.resolve(rootDir, "src/App.tsx"), "utf-8");
    sectionScaffoldSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/SectionScaffold/SectionScaffold.tsx"),
      "utf-8"
    );
    aboutSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/About/About.tsx"),
      "utf-8"
    );
    skillsSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/Skills/Skills.tsx"),
      "utf-8"
    );
    experienceSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/Experience/Experience.tsx"),
      "utf-8"
    );
    projectsSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/Projects/Projects.tsx"),
      "utf-8"
    );
    contactSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/Contact/Contact.tsx"),
      "utf-8"
    );
    footerSource = fs.readFileSync(
      path.resolve(rootDir, "src/components/Footer/Footer.tsx"),
      "utf-8"
    );

    // Scan for any lingering triggerOnce: false in production code
    const srcDir = path.resolve(rootDir, "src");
    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "__tests__" && entry.name !== "node_modules") {
            scanDir(fullPath);
          }
        } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes("triggerOnce: false")) {
            filesWithTriggerOnceFalse.push(fullPath);
          }
        }
      }
    }
    scanDir(srcDir);
  });

  describe("Application shell: AnimatePresence simplification", () => {
    it("renders App shell without AnimatePresence wrapper around static sections", () => {
      // AnimatePresence import must be completely removed
      expect(appSource).not.toContain('import { AnimatePresence } from "framer-motion"');
      expect(appSource).not.toContain("AnimatePresence");

      // Static editorial sections must render directly inside DossierShell
      expect(appSource).toContain("<Hero data={heroData} />");
      expect(appSource).toContain("<About data={aboutData} />");
      expect(appSource).toContain("<Skills data={skillsData} />");
      expect(appSource).toContain("<Experience data={experienceData} />");
      expect(appSource).toContain("<Projects data={projectsData} />");
      expect(appSource).toContain("<Contact data={contactData} />");
      expect(appSource).toContain("<Footer />");
    });

    it("renders App without crashing into valid HTML markup within ThemeProvider", () => {
      const html = renderToString(
        <ThemeProvider>
          <App />
        </ThemeProvider>
      );
      expect(html).toContain('id="home"');
      expect(html).toContain('id="about"');
      expect(html).toContain('id="skills"');
      expect(html).toContain('id="experience"');
      expect(html).toContain('id="projects"');
      expect(html).toContain('id="contact"');
    });
  });

  describe("Major sections configure triggerOnce: true on useInView", () => {
    it("SectionScaffold explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(sectionScaffoldSource).toContain("triggerOnce: true");
      expect(sectionScaffoldSource).not.toContain("triggerOnce: false");
    });

    it("About explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(aboutSource).toContain("triggerOnce: true");
      expect(aboutSource).not.toContain("triggerOnce: false");
    });

    it("Skills explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(skillsSource).toContain("triggerOnce: true");
      expect(skillsSource).not.toContain("triggerOnce: false");
    });

    it("Experience explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(experienceSource).toContain("triggerOnce: true");
      expect(experienceSource).not.toContain("triggerOnce: false");
    });

    it("Projects explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(projectsSource).toContain("triggerOnce: true");
      expect(projectsSource).not.toContain("triggerOnce: false");
    });

    it("Contact explicitly configures triggerOnce: true for stable viewport reveal", () => {
      expect(contactSource).toContain("triggerOnce: true");
      expect(contactSource).not.toContain("triggerOnce: false");
    });

    it("zero occurrences of triggerOnce: false exist across all production components", () => {
      expect(filesWithTriggerOnceFalse).toEqual([]);
    });

    it("Footer explicitly configures viewport once: true", () => {
      expect(footerSource).toContain("viewport={{ once: true");
      expect(footerSource).not.toContain("once: false");
    });
  });

  describe("Projects 3D Tilt Decoupling (useMotionValue & useSpring)", () => {
    it("Projects source implements useMotionValue and useSpring without tilt useState", () => {
      // framer-motion imports must include useMotionValue and useSpring
      expect(projectsSource).toContain("useMotionValue");
      expect(projectsSource).toContain("useSpring");

      // Must not use local state for tilt coordinates
      expect(projectsSource).not.toContain("setTilt");
      expect(projectsSource).not.toContain("useState({ x: 0, y: 0 })");

      // Must set motion values directly in handleMouseMove outside React state cycles
      expect(projectsSource).toContain("rawTiltX.set(");
      expect(projectsSource).toContain("rawTiltY.set(");

      // Must reset motion values in handleMouseLeave
      expect(projectsSource).toContain("rawTiltX.set(0)");
      expect(projectsSource).toContain("rawTiltY.set(0)");

      // Must bind rotateX, rotateY, scale directly to style
      expect(projectsSource).toMatch(/style=\{\s*\{[^}]*rotateX[^}]*rotateY/);
    });

    it("renders project preview mockups with 3D perspective and browser chrome", () => {
      const html = renderToString(<Projects data={projectsData} />);

      // Browser chrome traffic lights
      expect(html).toContain("bg-[#ff5f57]");
      expect(html).toContain("bg-[#febc2e]");
      expect(html).toContain("bg-[#28c840]");

      // URL bar and demo links
      for (const project of projectsData.projects) {
        const cleanUrl = project.demoUrl.replace(/^https?:\/\//, "");
        expect(html).toContain(cleanUrl);
        expect(html).toContain(`alt="${project.title} preview"`);
      }

      // 3D perspective styling (CSS perspective and transform-style in server output)
      expect(html).toMatch(/perspective:\s*1000px/);
      expect(html).toMatch(/transform-style:\s*preserve-3d/);
    });
  });

  describe("Animation Choreography & Descender Protection Intact", () => {
    it("preserves descender compensation padding and negative margins on SectionScaffold word masks", () => {
      const html = renderToString(
        <SectionScaffold
          id="choreography-test"
          eyebrow="Editorial"
          headline="Engineering Craftsmanship and Quality"
          accentWord="Quality"
        />
      );

      // Word masks must have breathing room for descenders (g, j, p, y, q)
      expect(html).toContain("overflow-hidden inline-block pb-3 -mb-3 pt-1 -mt-1");
      // Accent word receives gradient styling
      expect(html).toContain('data-accent="true"');
      expect(html).toContain("Quality");
    });
  });
});
