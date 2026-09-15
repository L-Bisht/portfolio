/**
 * Integration Verification Suite for Animation Performance (Issue 04 / ADR 0009)
 *
 * Verifies the full compound performance and accessibility architecture:
 * 1. ADR 0009 Sync Constraints — `// See ADR 0009` cross-reference comments in:
 *    - isometricLattice.ts (geometry module at MID_DENSITY_BREAKPOINT)
 *    - dotMatrixPhysics.ts (physics constants module at mid-tier declarations)
 *    - index.css (mid-density media query blur block)
 * 2. Viewport Density Threshold Behavior:
 *    - 1366px uses mid-tier 32px spacing & reduced proximity radii
 *    - 1367px preserves full desktop 26px spacing & luxury proximity radii
 * 3. Prefers-Reduced-Motion Parity Across All Sections:
 *    - Hero, About, Skills, Experience, Projects, Contact headlines bypass motion immediately
 *    - Availability beacons in Hero and About suppress animate-ping
 * 4. Touch Device Guard (GlowCard):
 *    - Skips GlowLayer and omits whileHover elevation when (hover: hover) is false
 * 5. Navigation Rail Snap (LeftRail):
 *    - Damping is 40, eliminating oscillation cycles
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
declare const process: { cwd: () => string };
import type { TargetAndTransition } from "framer-motion";

import {
  MID_DENSITY_BREAKPOINT,
  DOT_SPACING,
  DOT_SPACING_MID,
  DOT_PROX_R,
  DOT_PROX_R_MID,
  CUBE_PROX_R,
  CUBE_PROX_R_MID,
  SPOTLIGHT_R,
  SPOTLIGHT_R_MID,
} from "../InteractiveBackground/dotMatrixPhysics";
import { buildGrid } from "../InteractiveBackground/InteractiveBackground";
import { getWordVariants } from "../Hero/heroVariants";
import { getSectionWordVariants } from "../SectionScaffold/sectionScaffoldVariants";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import GlowCard from "../GlowCard/GlowCard";
import { RAIL_SPRING } from "../DossierShell/leftRailConstants";

import { heroData } from "../../data/hero";
import { aboutData } from "../../data/about";
import { skillsData } from "../../data/skills";
import { experienceData } from "../../data/experience";
import { projectsData } from "../../data/projects";
import { contactData } from "../../data/contact";
import { ThemeProvider } from "../../context/ThemeContext";

interface WindowScope {
  window?: unknown;
}

const createMockMediaQueryList = (matches: boolean, media: string): MediaQueryList =>
  ({
    matches,
    media,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList;

describe("Animation Performance Integration Verification (Issue 04 & ADR 0009)", () => {
  const scope = globalThis as WindowScope;
  const originalWindow = scope.window;

  beforeEach(() => {
    scope.window = {
      matchMedia: vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(false, query)
      ),
    };
  });

  afterEach(() => {
    if (originalWindow !== undefined) {
      scope.window = originalWindow;
    } else {
      delete scope.window;
    }
    vi.restoreAllMocks();
  });

  describe("ADR 0009 Sync Comments Constraint", () => {
    const rootDir = process.cwd();

    it("verifies `// See ADR 0009` comment in isometricLattice.ts at MID_DENSITY_BREAKPOINT", async () => {
      const fsMod = "node:fs";
      const pathMod = "node:path";
      const fs = await import(fsMod);
      const path = await import(pathMod);
      const filePath = path.resolve(
        rootDir,
        "src/components/InteractiveBackground/isometricLattice.ts"
      );
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toMatch(
        /\/\/\s*See\s+ADR\s+0009\s*\n\s*export\s+const\s+MID_DENSITY_BREAKPOINT\s*=\s*1366;/
      );
    });

    it("verifies `// See ADR 0009` comments in dotMatrixPhysics.ts at mid-tier constant declarations", async () => {
      const fsMod = "node:fs";
      const pathMod = "node:path";
      const fs = await import(fsMod);
      const path = await import(pathMod);
      const filePath = path.resolve(
        rootDir,
        "src/components/InteractiveBackground/dotMatrixPhysics.ts"
      );
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toMatch(
        /\/\/\s*See\s+ADR\s+0009\s*\n\s*export\s+const\s+DOT_SPACING_MID\s*=\s*32;/
      );
      expect(content).toMatch(
        /\/\/\s*See\s+ADR\s+0009\s*\n\s*export\s+const\s+DOT_PROX_R_MID\s*=\s*130;/
      );
    });

    it("verifies `See ADR 0009` comment in index.css at the mid-density media query block", async () => {
      const fsMod = "node:fs";
      const pathMod = "node:path";
      const fs = await import(fsMod);
      const path = await import(pathMod);
      const filePath = path.resolve(rootDir, "src/index.css");
      const content = fs.readFileSync(filePath, "utf-8");
      const midDensityIndex = content.indexOf(
        "@media (min-width: 1024px) and (max-width: 1366px)"
      );
      expect(midDensityIndex).toBeGreaterThan(-1);

      const precedingCss = content.slice(
        Math.max(0, midDensityIndex - 200),
        midDensityIndex
      );
      expect(precedingCss).toMatch(/See\s+ADR\s+0009/);
    });
  });

  describe("Viewport Density & Geometry Tier Behavior", () => {
    it("differentiates 1366px (mid-density) vs 1367px (full desktop)", () => {
      expect(MID_DENSITY_BREAKPOINT).toBe(1366);

      // 1366px is within mid-tier
      const isMid1366 = 1366 <= MID_DENSITY_BREAKPOINT;
      const isMid1367 = 1367 <= MID_DENSITY_BREAKPOINT;
      expect(isMid1366).toBe(true);
      expect(isMid1367).toBe(false);

      const spacing1366 = isMid1366 ? DOT_SPACING_MID : DOT_SPACING;
      const spacing1367 = isMid1367 ? DOT_SPACING_MID : DOT_SPACING;
      expect(spacing1366).toBe(32);
      expect(spacing1367).toBe(26);

      // Mid-tier yields fewer dots for identical canvas area
      const grid1366 = buildGrid(1366, 768, spacing1366);
      const grid1367 = buildGrid(1366, 768, spacing1367);
      expect(grid1366.length).toBeLessThan(grid1367.length);

      // Proximity radii are stepped down
      const dotProx1366 = isMid1366 ? DOT_PROX_R_MID : DOT_PROX_R;
      const dotProx1367 = isMid1367 ? DOT_PROX_R_MID : DOT_PROX_R;
      expect(dotProx1366).toBe(130);
      expect(dotProx1367).toBe(180);

      const cubeProx1366 = isMid1366 ? CUBE_PROX_R_MID : CUBE_PROX_R;
      const cubeProx1367 = isMid1367 ? CUBE_PROX_R_MID : CUBE_PROX_R;
      expect(cubeProx1366).toBe(140);
      expect(cubeProx1367).toBe(190);

      const spotlight1366 = isMid1366 ? SPOTLIGHT_R_MID : SPOTLIGHT_R;
      const spotlight1367 = isMid1367 ? SPOTLIGHT_R_MID : SPOTLIGHT_R;
      expect(spotlight1366).toBe(260);
      expect(spotlight1367).toBe(380);
    });
  });

  describe("Prefers-Reduced-Motion Parity Across All Sections", () => {
    it("bypasses entrance motion on all section headlines when reduced motion is preferred", () => {
      // Hero word variants
      const heroReduced = getWordVariants(true);
      const heroHidden = heroReduced.hidden as TargetAndTransition;
      const heroVisible = heroReduced.visible as TargetAndTransition;
      expect(heroHidden.y).toBe("0%");
      expect(heroHidden.opacity).toBe(1);
      expect((heroVisible.transition as { duration?: number })?.duration).toBe(0);

      // SectionScaffold word variants (used by About, Skills, Experience, Projects, Contact)
      const scaffoldReduced = getSectionWordVariants(true);
      const scaffoldHidden = scaffoldReduced.hidden as TargetAndTransition;
      const scaffoldVisible = scaffoldReduced.visible as TargetAndTransition;
      expect(scaffoldHidden.y).toBe("0%");
      expect(scaffoldHidden.opacity).toBe(1);
      expect((scaffoldVisible.transition as { duration?: number })?.duration).toBe(0);
    });

    it("renders all sections with immediate visibility and no animate-ping under reduced motion", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query === "(prefers-reduced-motion: reduce)", query)
      );

      // Hero
      const heroHtml = renderToString(<Hero data={heroData} reducedMotion={true} />);
      expect(heroHtml).toContain('data-reduced-motion="true"');
      expect(heroHtml).not.toContain("animate-ping");

      // About
      const aboutHtml = renderToString(
        <ThemeProvider>
          <About data={aboutData} reducedMotion={true} />
        </ThemeProvider>
      );
      expect(aboutHtml).toContain('data-reduced-motion="true"');
      expect(aboutHtml).not.toContain("animate-ping");
      expect(aboutHtml).toContain("motion-reduce:animate-none");

      // Skills
      const skillsHtml = renderToString(
        <ThemeProvider>
          <Skills data={skillsData} />
        </ThemeProvider>
      );
      expect(skillsHtml).toContain('data-reduced-motion="true"');
      expect(skillsHtml).not.toContain("animate-ping");

      // Experience
      const expHtml = renderToString(
        <ThemeProvider>
          <Experience data={experienceData} />
        </ThemeProvider>
      );
      expect(expHtml).toContain('data-reduced-motion="true"');
      expect(expHtml).not.toContain("animate-ping");

      // Projects
      const projHtml = renderToString(
        <ThemeProvider>
          <Projects data={projectsData} />
        </ThemeProvider>
      );
      expect(projHtml).toContain('data-reduced-motion="true"');
      expect(projHtml).not.toContain("animate-ping");

      // Contact
      const contactHtml = renderToString(
        <ThemeProvider>
          <Contact data={contactData} />
        </ThemeProvider>
      );
      expect(contactHtml).toContain('data-reduced-motion="true"');
      expect(contactHtml).not.toContain("animate-ping");
    });
  });

  describe("GlowCard Touch Device Guard", () => {
    it("renders without GlowLayer when hover is unavailable (touch device emulation)", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query !== "(hover: hover)", query)
      );

      const html = renderToString(
        <GlowCard>
          <p>Touch Card</p>
        </GlowCard>
      );

      expect(html).not.toContain('data-testid="glow-layer"');
      expect(html).not.toContain("inset-[-1px]");
      expect(html).toContain("Touch Card");
    });
  });

  describe("LeftRail Decisive Snap", () => {
    it("uses damping: 40 to eliminate oscillation cycles during expand/collapse", () => {
      expect(RAIL_SPRING.damping).toBe(40);
      expect(RAIL_SPRING.stiffness).toBe(320);
      expect(RAIL_SPRING.mass).toBe(0.8);
    });
  });
});
