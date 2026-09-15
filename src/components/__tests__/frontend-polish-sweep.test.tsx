/**
 * Tests for Issue 03: Frontend Polish Sweep — CSS, Accessibility & Interaction
 *
 * Covers:
 * 1. SectionScaffold reduced motion parity (useReducedMotion + matchMedia cross-check, y: "0%", opacity: 1)
 * 2. About beacon motion-reduce:animate-none class & ping suppression under reduced motion
 * 3. GlowCard (hover: hover) guard (GlowLayer omitted, whileHover omitted when false)
 * 4. LeftRail spring damping raised to 40
 * 5. Projects section card styles using explicit transition property list
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import type { TargetAndTransition } from "framer-motion";
import SectionScaffold from "../SectionScaffold";
import { getSectionWordVariants } from "../SectionScaffold/sectionScaffoldVariants";
import About from "../About/About";
import GlowCard from "../GlowCard/GlowCard";
import { RAIL_SPRING } from "../DossierShell/leftRailConstants";
import Projects from "../Projects/Projects";
import { aboutData } from "../../data/about";
import { projectsData } from "../../data/projects";
import { ThemeProvider } from "../../context/ThemeContext";

interface WindowScope {
  window?: unknown;
}

type TransitionWithDuration = {
  duration?: number;
};

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

describe("Frontend Polish Sweep (Issue 03)", () => {
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

  describe("SectionScaffold Reduced-Motion Parity", () => {
    it("exports word variants where hidden state is { y: '0%', opacity: 1 } and duration is 0 when reduced", () => {
      const standardVariants = getSectionWordVariants(false);
      const reducedVariants = getSectionWordVariants(true);

      const standardHidden = standardVariants.hidden as TargetAndTransition;
      const standardVisible = standardVariants.visible as TargetAndTransition;
      expect(standardHidden.y).toBe("115%");
      expect(standardHidden.opacity).toBe(0);
      expect(standardVisible.y).toBe("0%");
      expect(standardVisible.opacity).toBe(1);

      const reducedHidden = reducedVariants.hidden as TargetAndTransition;
      const reducedVisible = reducedVariants.visible as TargetAndTransition;
      expect(reducedHidden.y).toBe("0%");
      expect(reducedHidden.opacity).toBe(1);
      expect(reducedVisible.y).toBe("0%");
      expect(reducedVisible.opacity).toBe(1);
      const reducedTransition = reducedVisible.transition as TransitionWithDuration;
      expect(reducedTransition?.duration).toBe(0);
    });

    it("renders SectionScaffold with data-reduced-motion='true' when prefers-reduced-motion is active", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query === "(prefers-reduced-motion: reduce)", query)
      );

      const html = renderToString(
        <SectionScaffold id="test-rm" eyebrow="Test" headline="Reduced Motion Test" />
      );

      expect(html).toContain('data-reduced-motion="true"');
    });

    it("renders SectionScaffold with data-reduced-motion='false' in standard mode", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(false, query)
      );

      const html = renderToString(
        <SectionScaffold id="test-rm-standard" eyebrow="Test" headline="Standard Motion Test" />
      );

      expect(html).toContain('data-reduced-motion="false"');
    });
  });

  describe("About Beacon Accessibility & Reduced Motion", () => {
    it("carries motion-reduce:animate-none Tailwind guard class on availability beacon", () => {
      const html = renderToString(
        <ThemeProvider>
          <About data={aboutData} />
        </ThemeProvider>
      );

      expect(html).toContain("motion-reduce:animate-none");
    });

    it("includes animate-ping in standard mode", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(false, query)
      );

      const html = renderToString(
        <ThemeProvider>
          <About data={aboutData} reducedMotion={false} />
        </ThemeProvider>
      );

      expect(html).toContain("animate-ping");
      expect(html).toContain("motion-reduce:animate-none");
    });

    it("lacks animate-ping class when reduced motion is active", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query === "(prefers-reduced-motion: reduce)", query)
      );

      const html = renderToString(
        <ThemeProvider>
          <About data={aboutData} reducedMotion={true} />
        </ThemeProvider>
      );

      expect(html).not.toContain("animate-ping");
      expect(html).toContain("motion-reduce:animate-none");
    });
  });

  describe("GlowCard Touch Guard", () => {
    it("skips rendering GlowLayer when (hover: hover) does not match", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query !== "(hover: hover)", query)
      );

      const html = renderToString(
        <GlowCard>
          <div>Card Content</div>
        </GlowCard>
      );

      expect(html).not.toContain('data-testid="glow-layer"');
      expect(html).not.toContain("inset-[-1px]");
      expect(html).toContain("Card Content");
    });

    it("renders GlowLayer when (hover: hover) matches", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) =>
        createMockMediaQueryList(query === "(hover: hover)", query)
      );

      const html = renderToString(
        <GlowCard>
          <div>Card Content</div>
        </GlowCard>
      );

      expect(html).toContain("inset-[-1px]");
      expect(html).toContain("Card Content");
    });
  });

  describe("LeftRail Spring Damping", () => {
    it("has spring damping of 40 to eliminate oscillation cycles (ADR 0009)", () => {
      expect(RAIL_SPRING.damping).toBe(40);
      expect(RAIL_SPRING.stiffness).toBe(320);
      expect(RAIL_SPRING.mass).toBe(0.8);
    });
  });

  describe("Projects Section Transition Properties", () => {
    it("uses explicit transition property list on case-study card wrapper, not transition-all", () => {
      const html = renderToString(
        <ThemeProvider>
          <Projects data={projectsData} />
        </ThemeProvider>
      );

      expect(html).toContain(
        "transition-[opacity,box-shadow,border-color,background-color] duration-500"
      );
      expect(html).not.toContain("transition-all duration-500");
    });
  });
});
