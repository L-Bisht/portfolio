import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import LeftRail, { SocialLinks } from "./LeftRail";
import { navData } from "../../data/nav";
import { socialRegistry } from "../../data/social";
import { ThemeProvider } from "../../context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return renderToString(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("LeftRail Component", () => {
  describe("SocialLinks Integration", () => {
    it("renders verified social profiles from centralized registry", () => {
      const html = renderToString(<SocialLinks data={navData} />);

      // Must render links for github, linkedin, twitter, and email
      expect(html).toContain(`href="${socialRegistry.github.url}"`);
      expect(html).toContain(`href="${socialRegistry.linkedin.url}"`);
      expect(html).toContain(`href="${socialRegistry.twitter.url}"`);
      expect(html).toContain(`href="${socialRegistry.email.url}"`);

      // Verify target="_blank" and rel="noopener noreferrer" for external links
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');

      // Verify aria-label attributes
      expect(html).toContain(`aria-label="${socialRegistry.github.label}"`);
      expect(html).toContain(`aria-label="${socialRegistry.linkedin.label}"`);
      expect(html).toContain(`aria-label="${socialRegistry.twitter.label}"`);
      expect(html).toContain(`aria-label="${socialRegistry.email.label}"`);

      // Verify no stale placeholder remains
      expect(html).not.toContain("lalitsinghbisht");
    });
  });

  describe("Collapsed State (Default at 72px)", () => {
    it("renders collapsed dock at 72px with icon-only nav items and explicit expand toggle", () => {
      const html = renderWithTheme(
        <LeftRail data={navData} activeSectionId="home" isExpanded={false} />
      );

      // Width style is 72px
      expect(html).toContain("width:72px");

      // Ultra-translucent frosted glass and fixed overlay classes
      expect(html).toContain("fixed left-0 top-0 z-50");
      expect(html).toContain("bg-white/20");
      expect(html).toContain("dark:bg-slate-900/40");
      expect(html).toContain("backdrop-blur-xl");
      expect(html).toContain("border-slate-200/40");
      expect(html).toContain("dark:border-white/10");

      // Compact nav items present
      expect(html).toContain('id="rail-toc-compact-home"');
      expect(html).toContain('id="rail-toc-compact-about"');
      expect(html).toContain('id="rail-toc-compact-skills"');

      // Expanded nav items and 'Sections' header must NOT be present
      expect(html).not.toContain('id="rail-toc-home"');
      expect(html).not.toContain("Sections");

      // Expand toggle button present with accessible attributes
      expect(html).toContain('id="rail-expand-toggle"');
      expect(html).toContain('aria-label="Expand navigation rail"');
      expect(html).toContain('aria-expanded="false"');

      // Compact theme toggle present
      expect(html).toContain('id="rail-theme-toggle-compact"');

      // Pin button must be completely removed
      expect(html).not.toContain("rail-pin-toggle");
      expect(html).not.toContain("Pin rail");
      expect(html).not.toContain("Pin navigation rail");

      // "Available for work" pill must be completely dropped
      expect(html).not.toContain("Available for work");
      expect(html).not.toContain("animate-pulse-beacon");
    });
  });

  describe("Expanded State (280px Overlay)", () => {
    it("renders 280px glass overlay with icons paired with titles, verified social links, and collapse toggle", () => {
      const html = renderWithTheme(
        <LeftRail data={navData} activeSectionId="about" isExpanded={true} />
      );

      // Width style is 280px
      expect(html).toContain("width:280px");

      // Floating overlay shadow
      expect(html).toContain("shadow-[4px_0_32px_rgba(0,0,0,0.10),1px_0_0_rgba(99,102,241,0.08)]");

      // Expanded nav items present with section titles
      expect(html).toContain('id="rail-toc-home"');
      expect(html).toContain('id="rail-toc-about"');
      expect(html).toContain('id="rail-toc-skills"');
      expect(html).toContain("About");
      expect(html).toContain("Skills");
      expect(html).not.toContain("Sections");

      // Profile name and title visible
      expect(html).toContain(navData.name);
      expect(html).toContain("Versatile &amp; AI-Augmented Developer");

      // Social links present in expanded utility bar
      expect(html).toContain(`href="${socialRegistry.github.url}"`);
      expect(html).toContain(`href="${socialRegistry.linkedin.url}"`);

      // Collapse toggle button present with accessible attributes
      expect(html).toContain('id="rail-expand-toggle"');
      expect(html).toContain('aria-label="Collapse navigation rail"');
      expect(html).toContain('aria-expanded="true"');

      // Expanded theme toggle present
      expect(html).toContain('id="rail-theme-toggle"');

      // Pin button must NOT be present
      expect(html).not.toContain("rail-pin-toggle");

      // "Available for work" pill must NOT be present
      expect(html).not.toContain("Available for work");
    });
  });
});
