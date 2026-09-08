/**
 * Integration tests: max-w-6xl alignment lock
 *
 * Requirement (Issue 02): Every non-hero editorial section and the Footer
 * inner container must render within a `max-w-6xl` constrained wrapper.
 * These tests verify the alignment contract section-by-section.
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";
import { aboutData } from "../../data/about";
import { skillsData } from "../../data/skills";
import { experienceData } from "../../data/experience";
import { projectsData } from "../../data/projects";
import { contactData } from "../../data/contact";

describe("max-w-6xl alignment lock — every section uses SectionScaffold", () => {
  it("About section root renders within max-w-6xl", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).toContain('id="about"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    expect(html).toContain("px-4");
    expect(html).toContain("sm:px-8");
    expect(html).toContain("lg:px-12");
    // Must NOT contain the old disparate widths
    expect(html).not.toContain("max-w-5xl");
    expect(html).not.toContain("max-w-7xl");
  });

  it("Skills section root renders within max-w-6xl", () => {
    const html = renderToString(<Skills data={skillsData} />);
    expect(html).toContain('id="skills"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    // Must NOT contain the old max-w-5xl width
    expect(html).not.toContain("max-w-5xl");
  });

  it("Experience section root renders within max-w-6xl", () => {
    const html = renderToString(<Experience data={experienceData} />);
    expect(html).toContain('id="experience"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    // Must NOT contain the old max-w-5xl width
    expect(html).not.toContain("max-w-5xl");
  });

  it("Projects section root renders within max-w-6xl", () => {
    const html = renderToString(<Projects data={projectsData} />);
    expect(html).toContain('id="projects"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    expect(html).not.toContain("max-w-5xl");
    expect(html).not.toContain("max-w-7xl");
  });

  it("Contact section root renders within max-w-6xl", () => {
    const html = renderToString(<Contact data={contactData} />);
    expect(html).toContain('id="contact"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    // Old max-w-7xl must be gone
    expect(html).not.toContain("max-w-7xl");
  });

  it("Footer inner container uses max-w-6xl with standard responsive gutters", () => {
    const html = renderToString(<Footer />);
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    expect(html).toContain("px-4");
    expect(html).toContain("sm:px-8");
    expect(html).toContain("lg:px-12");
    // Old max-w-7xl must be gone
    expect(html).not.toContain("max-w-7xl");
  });
});

describe("About section — commanding headline and Tile 1 rename", () => {
  it("renders the commanding clamp headline with correct text", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).toContain("Engineering with intention.");
  });

  it("renders the gradient accent word on 'intention.'", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).toContain('data-accent="true"');
  });

  it("renders the About section subtitle", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).toContain(
      "Bridging domain boundaries, systems architecture, and AI-accelerated velocity."
    );
  });

  it("Tile 1 headline is 'Core Philosophy' (not old philosophyHeadline)", () => {
    const html = renderToString(<About data={aboutData} />);
    expect(html).toContain("Core Philosophy");
    // The old philosophyHeadline value ("Engineering with Intention") should not
    // appear as a standalone tile h2 — it is now in the section-level h2 instead.
  });
});

describe("Descender clipping remediation — SectionScaffold word masks", () => {
  it("Contact section headline words have descender-compensation mask classes", () => {
    const html = renderToString(<Contact data={contactData} />);
    // SectionScaffold applies pb-3 -mb-3 pt-1 -mt-1 on every word span
    expect(html).toContain("pb-3");
    expect(html).toContain("-mb-3");
    expect(html).toContain("pt-1");
    expect(html).toContain("-mt-1");
  });

  it("Projects section headline words have descender-compensation mask classes", () => {
    const html = renderToString(<Projects data={projectsData} />);
    expect(html).toContain("pb-3");
    expect(html).toContain("-mb-3");
    expect(html).toContain("pt-1");
    expect(html).toContain("-mt-1");
  });
});
