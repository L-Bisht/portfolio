import { describe, it, expect, beforeAll } from "vitest";
import { renderToString } from "react-dom/server";
declare const process: { cwd: () => string };
import About from "../About/About";
import Skills from "../Skills/Skills";
import Experience from "../Experience/Experience";
import Contact from "../Contact/Contact";
import LeftRail from "../DossierShell/LeftRail";
import FloatingDock from "../DossierShell/FloatingDock";
import { aboutData } from "../../data/about";
import { skillsData } from "../../data/skills";
import { experienceData } from "../../data/experience";
import { contactData } from "../../data/contact";
import { navData } from "../../data/nav";
import { ThemeProvider } from "../../context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return renderToString(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Dual-Mode Editorial Glass Strata Architecture (ADR 0005 & Issue 04)", () => {
  describe("Centralized .editorial-glass Utility Specification in index.css", () => {
    let cssContent = "";

    beforeAll(async () => {
      const fsMod = "node:fs";
      const pathMod = "node:path";
      const fs = await import(fsMod);
      const path = await import(pathMod);
      cssContent = fs.readFileSync(
        path.resolve(process.cwd(), "src/index.css"),
        "utf-8"
      );
    });

    it("declares .editorial-glass in index.css with mobile 4px blur and balanced opacity", () => {
      expect(cssContent).toContain(".editorial-glass {");
      expect(cssContent).toMatch(/backdrop-filter:\s*blur\(4px\)/);
      expect(cssContent).toMatch(/background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.8\)/);
    });

    it("configures dark mode balanced opacity for mobile viewports", () => {
      expect(cssContent).toMatch(/:is\(\.dark,\s*\.dark\s*\*?\s*\)\s*\.editorial-glass/);
      expect(cssContent).toMatch(/background-color:\s*rgba\(15,\s*23,\s*42,\s*0\.8\)/);
    });

    it("declares desktop media query (>= 1024px) stepping up to 24px blur and ultra-translucent opacity", () => {
      expect(cssContent).toContain("@media (min-width: 1024px)");
      expect(cssContent).toMatch(/backdrop-filter:\s*blur\(24px\)/);
      expect(cssContent).toMatch(/background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.2\)/);
      expect(cssContent).toMatch(/background-color:\s*rgba\(15,\s*23,\s*42,\s*0\.4\)/);
    });
  });

  describe("About Component Glass Strata & Motifs", () => {
    const html = renderWithTheme(<About data={aboutData} />);

    it("applies .editorial-glass and dual-mode responsive classes to Tile 1 (Philosophy)", () => {
      const tile1Match = html.match(/id="about-tile-philosophy"[^>]*class="([^"]*)"/);
      expect(tile1Match).toBeTruthy();
      const classes = tile1Match![1];

      expect(classes).toContain("editorial-glass");
      expect(classes).toContain("backdrop-blur-sm");
      expect(classes).toContain("lg:backdrop-blur-xl");
      expect(classes).toContain("bg-white/80");
      expect(classes).toContain("dark:bg-slate-900/80");
      expect(classes).toContain("lg:bg-white/20");
      expect(classes).toContain("lg:dark:bg-slate-900/40");
    });

    it("applies .editorial-glass and dual-mode responsive classes to Tile 2 (Focus)", () => {
      const tile2Match = html.match(/id="about-tile-focus"[^>]*class="([^"]*)"/);
      expect(tile2Match).toBeTruthy();
      const classes = tile2Match![1];

      expect(classes).toContain("editorial-glass");
      expect(classes).toContain("backdrop-blur-sm");
      expect(classes).toContain("lg:backdrop-blur-xl");
      expect(classes).toContain("bg-white/80");
      expect(classes).toContain("dark:bg-slate-900/80");
      expect(classes).toContain("lg:bg-white/20");
      expect(classes).toContain("lg:dark:bg-slate-900/40");
    });

    it("applies .editorial-glass and dual-mode responsive classes to Tile 3 Stat Cards", () => {
      expect(html).toContain('id="about-tile-stats"');
      // All 3 stat cards should have editorial-glass and responsive classes
      const occurrences = (html.match(/editorial-glass/g) || []).length;
      // Tile 1 + Tile 2 + 3 Stat cards = at least 5
      expect(occurrences).toBeGreaterThanOrEqual(5);
    });

    it("preserves QuarterCircleArc corner bubble motifs without visual regression", () => {
      // SVGs representing corner bubble arcs
      const svgMatches = html.match(/id="corner-bubble-[^"]*"/g);
      expect(svgMatches).not.toBeNull();
      expect(svgMatches!.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Skills Component Glass Strata & Motifs", () => {
    const html = renderWithTheme(<Skills data={skillsData} />);

    it("applies .editorial-glass and dual-mode responsive classes to Stratum Cards", () => {
      expect(html).toContain("editorial-glass");
      expect(html).toContain("backdrop-blur-sm");
      expect(html).toContain("lg:backdrop-blur-xl");
      expect(html).toContain("bg-white/80");
      expect(html).toContain("dark:bg-slate-900/80");
      expect(html).toContain("lg:bg-white/20");
      expect(html).toContain("lg:dark:bg-slate-900/40");
    });

    it("preserves corner bubble motifs, hairline top glow, and radial hover spotlights", () => {
      // Stratum cards must render QuarterCircleArc
      const svgMatches = html.match(/id="corner-bubble-[^"]*"/g);
      expect(svgMatches).not.toBeNull();
      expect(svgMatches!.length).toBeGreaterThanOrEqual(skillsData.tiers.length);
      // Ambient glow behind cards
      expect(html).toContain("pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl");
      // Hairline top glow
      expect(html).toContain("absolute top-0 left-0 right-0 h-px");
    });
  });

  describe("Experience Component Glass Strata & Motifs", () => {
    const html = renderWithTheme(<Experience data={experienceData} />);

    it("applies .editorial-glass and dual-mode responsive classes to Experience timeline cards", () => {
      for (const item of experienceData.items) {
        expect(html).toContain(`id="exp-${item.id}"`);
      }
      expect(html).toContain("editorial-glass");
      expect(html).toContain("backdrop-blur-sm lg:backdrop-blur-xl");
      expect(html).toContain("bg-white/80 dark:bg-slate-900/80");
      expect(html).toContain("lg:bg-white/20 lg:dark:bg-slate-900/40");
    });

    it("preserves QuarterCircleArc corner motifs on timeline cards", () => {
      const svgMatches = html.match(/id="corner-bubble-[^"]*"/g);
      expect(svgMatches).not.toBeNull();
      expect(svgMatches!.length).toBeGreaterThanOrEqual(experienceData.items.length);
    });
  });

  describe("LeftRail Dossier Shell Component Glass Strata", () => {
    const html = renderWithTheme(
      <LeftRail data={navData} activeSectionId="home" isExpanded={false} />
    );

    it("applies .editorial-glass and preserves desktop luxury blur and translucent surfaces", () => {
      expect(html).toContain("editorial-glass");
      expect(html).toContain("backdrop-blur-sm");
      expect(html).toContain("lg:backdrop-blur-xl");
      expect(html).toContain("bg-white/20");
      expect(html).toContain("dark:bg-slate-900/40");
    });
  });

  describe("FloatingDock Mobile Shell Blur Optimization", () => {
    const html = renderWithTheme(
      <FloatingDock data={navData} activeSectionId="home" />
    );

    it("steps down mobile floating dock to lightweight 4px blur (backdrop-blur-sm)", () => {
      expect(html).toContain("editorial-glass");
      expect(html).toContain("backdrop-blur-sm");
      expect(html).not.toContain("backdrop-blur-xl");
    });
  });

  describe("Contact Component Glass Strata", () => {
    const html = renderWithTheme(<Contact data={contactData} />);

    it("applies .editorial-glass and responsive dual-mode glass classes to Contact cards", () => {
      expect(html).toContain("editorial-glass");
      expect(html).toContain("backdrop-blur-sm");
      expect(html).toContain("lg:backdrop-blur-xl");
      expect(html).toContain("bg-white/80");
      expect(html).toContain("dark:bg-slate-900/80");
      expect(html).toContain("lg:bg-white/20");
      expect(html).toContain("lg:dark:bg-slate-900/40");
    });
  });
});
