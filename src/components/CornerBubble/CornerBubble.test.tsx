import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import CornerBubble, { QuarterCircleArc } from "./CornerBubble";

describe("CornerBubble / QuarterCircleArc Component", () => {
  describe("Corner-Origin Geometry & Endpoints", () => {
    it("renders top-left (tl) with origin (0, 0), flush endpoints at distance R, and inward convex arc", () => {
      const html = renderToString(
        <CornerBubble corner="tl" color="#6366f1" size={100} opacity={0.2} />
      );

      // SVG container attributes
      expect(html).toContain('viewBox="0 0 100 100"');
      expect(html).toContain("top:0");
      expect(html).toContain("left:0");

      // Outer boundary arc: starts on horizontal edge at (100, 0), arcs clockwise to (0, 100) on vertical edge
      expect(html).toContain('d="M 100 0 A 100 100 0 0 1 0 100"');

      // Sector path: starts at corner vertex (0, 0), extends along horizontal edge to (100, 0),
      // arcs to (0, 100), and closes back along vertical edge to (0, 0)
      expect(html).toContain('d="M 0 0 L 100 0 A 100 100 0 0 1 0 100 Z"');
    });

    it("renders top-right (tr) with origin (0, 0), flush endpoints at distance R, and inward convex arc", () => {
      const html = renderToString(
        <CornerBubble corner="tr" color="#ec4899" size={88} opacity={0.18} />
      );

      // SVG container attributes
      expect(html).toContain('viewBox="-100 0 100 100"');
      expect(html).toContain("top:0");
      expect(html).toContain("right:0");

      // Outer boundary arc: starts on horizontal edge at (-100, 0), arcs counter-clockwise to (0, 100) on vertical edge
      expect(html).toContain('d="M -100 0 A 100 100 0 0 0 0 100"');

      // Sector path
      expect(html).toContain('d="M 0 0 L -100 0 A 100 100 0 0 0 0 100 Z"');
    });

    it("renders bottom-right (br) with origin (0, 0), flush endpoints at distance R, and inward convex arc", () => {
      const html = renderToString(
        <CornerBubble corner="br" color="#10b981" size={80} opacity={0.16} />
      );

      // SVG container attributes
      expect(html).toContain('viewBox="-100 -100 100 100"');
      expect(html).toContain("bottom:0");
      expect(html).toContain("right:0");

      // Outer boundary arc: starts on horizontal edge at (-100, 0), arcs clockwise to (0, -100) on vertical edge
      expect(html).toContain('d="M -100 0 A 100 100 0 0 1 0 -100"');

      // Sector path
      expect(html).toContain('d="M 0 0 L -100 0 A 100 100 0 0 1 0 -100 Z"');
    });

    it("renders bottom-left (bl) with origin (0, 0), flush endpoints at distance R, and inward convex arc", () => {
      const html = renderToString(
        <CornerBubble corner="bl" color="#8b5cf6" size={96} opacity={0.22} />
      );

      // SVG container attributes
      expect(html).toContain('viewBox="0 -100 100 100"');
      expect(html).toContain("bottom:0");
      expect(html).toContain("left:0");

      // Outer boundary arc: starts on horizontal edge at (100, 0), arcs counter-clockwise to (0, -100) on vertical edge
      expect(html).toContain('d="M 100 0 A 100 100 0 0 0 0 -100"');

      // Sector path
      expect(html).toContain('d="M 0 0 L 100 0 A 100 100 0 0 0 0 -100 Z"');
    });
  });

  describe("Concentric Hairlines & Radial Glass Gradient", () => {
    it("renders subtle concentric internal hairlines with decreasing radii and opacities", () => {
      const html = renderToString(
        <CornerBubble corner="tr" color="#6366f1" size={100} opacity={0.2} />
      );

      // Concentric hairlines at radii 72, 46, 22
      expect(html).toContain('d="M -72 0 A 72 72 0 0 0 0 72"');
      expect(html).toContain('d="M -46 0 A 46 46 0 0 0 0 46"');
      expect(html).toContain('d="M -22 0 A 22 22 0 0 0 0 22"');
    });

    it("renders radial gradient centered at (0, 0) with translucent glass stops", () => {
      const html = renderToString(
        <CornerBubble corner="tl" color="#06b6d4" size={80} opacity={0.25} />
      );

      // Defs and radialGradient centered at origin (0, 0)
      expect(html).toContain("<radialGradient");
      expect(html).toContain('cx="0"');
      expect(html).toContain('cy="0"');
      expect(html).toContain('r="100"');
      expect(html).toContain('gradientUnits="userSpaceOnUse"');

      // Stop colors tinted to provided accent
      expect(html).toContain('stop-color="#06b6d4"');

      // Sector path references the volumetric body gradient
      expect(html).toMatch(/fill="url\(#corner-bubble-body-[^"]+\)"/);

      // Specular glint arcs following spherical dome curvature
      expect(html).toContain('d="M 78 25 A 82 82 0 0 1 25 78"');

      // Floating micro-bubbles rendered
      expect(html).toContain('class="micro-bubble"');
    });
  });

  describe("Accessibility & QuarterCircleArc Backward Compatibility Alias", () => {
    it("is aria-hidden, pointer-events none, and supports QuarterCircleArc alias", () => {
      const html = renderToString(
        <QuarterCircleArc corner="tr" color="#6366f1" size={80} opacity={0.18} />
      );

      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("pointer-events:none");
      expect(html).toContain("position:absolute");
      expect(html).toContain('width="80"');
      expect(html).toContain('height="80"');
    });
  });

  describe("Section Card Integration", () => {
    it("renders bubble motifs across About, Skills, Projects, and Experience", async () => {
      const { default: About } = await import("../About/About");
      const { aboutData } = await import("../../data/about");
      const { default: Skills } = await import("../Skills/Skills");
      const { skillsData } = await import("../../data/skills");
      const { default: Projects } = await import("../Projects/Projects");
      const { projectsData } = await import("../../data/projects");
      const { default: Experience } = await import("../Experience/Experience");
      const { experienceData } = await import("../../data/experience");

      // About: uses 'tr' and 'bl'
      const aboutHtml = renderToString(<About data={aboutData} />);
      expect(aboutHtml).toContain('viewBox="-100 0 100 100"'); // tr
      expect(aboutHtml).toContain('viewBox="0 -100 100 100"');  // bl

      // Skills: uses 'tr'
      const skillsHtml = renderToString(<Skills data={skillsData} />);
      expect(skillsHtml).toContain('viewBox="-100 0 100 100"'); // tr

      // Projects: uses alternating 'tl' and 'tr'
      const projectsHtml = renderToString(<Projects data={projectsData} />);
      expect(projectsHtml).toContain('viewBox="0 0 100 100"');    // tl
      expect(projectsHtml).toContain('viewBox="-100 0 100 100"'); // tr

      // Experience: uses 'br'
      const expHtml = renderToString(<Experience data={experienceData} />);
      expect(expHtml).toContain('viewBox="-100 -100 100 100"'); // br

      // All contain radial gradients and convex arcs
      for (const markup of [aboutHtml, skillsHtml, projectsHtml, expHtml]) {
        expect(markup).toContain("<radialGradient");
        expect(markup).toContain("gradientUnits=\"userSpaceOnUse\"");
        expect(markup).toMatch(/d="M [0-9-]+ 0 A 100 100/);
      }
    });
  });
});
