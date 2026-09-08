import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";
import LeftRail from "../DossierShell/LeftRail";
import FloatingDock from "../DossierShell/FloatingDock";
import MobileHeader from "../DossierShell/MobileHeader";
import { heroData } from "../../data/hero";
import { aboutData } from "../../data/about";
import { skillsData } from "../../data/skills";
import { experienceData } from "../../data/experience";
import { projectsData } from "../../data/projects";
import { contactData } from "../../data/contact";
import { navData } from "../../data/nav";
import { ThemeProvider } from "../../context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return renderToString(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Palette Purity Contract — Zero Legacy Indigo/Violet in Primary Interactive Components", () => {
  const legacyColorPattern = /\b(indigo|violet)-\d+/;

  it("Hero component: zero indigo/violet classes, adopts electric sky tokens", () => {
    const html = renderToString(<Hero data={heroData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("text-sky-500");
    expect(html).toContain("dark:text-sky-400");
    expect(html).toContain("hover:border-sky-500");
  });

  it("About component: zero indigo/violet classes, adopts sky & cyan tokens", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("bg-sky-400/10");
    expect(html).toContain("bg-cyan-400/8");
    expect(html).toContain("text-sky-600");
    expect(html).toContain("text-cyan-600");
    expect(html).not.toContain("#6366f1");
    expect(html).not.toContain("#8b5cf6");
  });

  it("Skills component: zero indigo/violet classes, adopts sky, cobalt & cyan tier tokens", () => {
    const html = renderToString(<Skills data={skillsData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("text-sky-600");
    expect(html).toContain("text-blue-600");
    expect(html).toContain("text-cyan-700");
    expect(html).not.toContain("#6366f1");
    expect(html).not.toContain("#8b5cf6");
  });

  it("Experience component: zero indigo/violet classes, adopts sky & cobalt metrics", () => {
    const html = renderToString(<Experience data={experienceData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("text-sky-600");
    expect(html).toContain("bg-sky-500/10");
    expect(html).toContain("bg-blue-500/10");
    expect(html).toContain("text-sky-500/60");
    expect(html).not.toContain("#6366f1");
  });

  it("Projects component: zero indigo/violet classes, adopts Deep Electric Cobalt (#2563eb / #3b82f6)", () => {
    const html = renderToString(<Projects data={projectsData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("text-blue-600");
    expect(html).toContain("bg-blue-600");
    expect(html).toContain("#2563eb");
    expect(html).toContain("#3b82f6");
    expect(html).not.toContain("#6366f1");
    expect(html).not.toContain("#8b5cf6");
  });

  it("Contact component: zero indigo/violet classes, adopts sky & cyan atmospheric auroras", () => {
    const html = renderToString(<Contact data={contactData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("dark:bg-sky-600/12");
    expect(html).toContain("dark:bg-cyan-600/10");
    expect(html).toContain("dark:via-sky-950/20");
    expect(html).toContain("hover:text-sky-600");
  });

  it("Footer component: zero indigo/violet classes, adopts sky & cyan branding", () => {
    const html = renderToString(<Footer />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("from-sky-500");
    expect(html).toContain("to-cyan-500");
    expect(html).toContain("hover:text-sky-500");
  });

  it("LeftRail component: zero indigo/violet classes, active indicator uses sky", () => {
    const htmlExpanded = renderWithTheme(
      <LeftRail data={navData} activeSectionId="about" isExpanded={true} />
    );
    expect(htmlExpanded).not.toMatch(legacyColorPattern);
    expect(htmlExpanded).toContain("from-sky-500");
    expect(htmlExpanded).toContain("to-cyan-500");
    expect(htmlExpanded).toContain("text-sky-600");
    expect(htmlExpanded).toContain("bg-sky-500");

    const htmlCollapsed = renderWithTheme(
      <LeftRail data={navData} activeSectionId="about" isExpanded={false} />
    );
    expect(htmlCollapsed).not.toMatch(legacyColorPattern);
    expect(htmlCollapsed).toContain("bg-sky-500");
  });

  it("FloatingDock component: zero indigo/violet classes, active state uses sky", () => {
    const html = renderToString(
      <FloatingDock data={navData} activeSectionId="about" />
    );
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("text-sky-500");
    expect(html).toContain("bg-sky-50");
  });

  it("MobileHeader component: zero indigo/violet classes, adopts sky & cyan monogram", () => {
    const html = renderWithTheme(<MobileHeader data={navData} />);
    expect(html).not.toMatch(legacyColorPattern);
    expect(html).toContain("from-sky-500");
    expect(html).toContain("to-cyan-500");
    expect(html).toContain("text-sky-500");
  });
});
