/**
 * Integration Tests: Hero Entrance Choreography and Accessibility Hardening (Issue 04)
 *
 * Verifies:
 * 1. Single page-level <h1> with aria-label and semantic heading hierarchy.
 * 2. Staggered entrance motion orchestration with word-by-word reveal on developer name.
 * 3. Immediate static resting layout when prefers-reduced-motion is active (duration: 0, delay: 0).
 * 4. Live status beacon with role="status", aria-live="polite", and accessible screen-reader text.
 * 5. High-contrast focus rings and accessible labels on all interactive action pills and micro-social links.
 * 6. Full ADR-0006 and palette purity compliance.
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import type { TargetAndTransition } from "framer-motion";
import Hero from "../Hero/Hero";
import {
  getContainerVariants,
  getNameContainerVariants,
  getWordVariants,
  getFadeUpVariants,
  getTelemetryVariants,
} from "../Hero/heroVariants";
import { heroData } from "../../data/hero";
import { navSocialProfiles } from "../../data/social";
import { ThemeProvider } from "../../context/ThemeContext";

type TransitionWithStagger = {
  staggerChildren?: number;
  delayChildren?: number;
  duration?: number;
  delay?: number;
};

describe("Hero Entrance Choreography & Accessibility Hardening (Issue 04)", () => {
  describe("Heading Hierarchy & Document Semantics", () => {
    it("renders strictly ONE page-level <h1> containing the developer's name", () => {
      const html = renderToString(<Hero data={heroData} />);

      // Count <h1> tags in rendered output
      const h1Matches = html.match(/<h1[\s>]/g);
      expect(h1Matches).not.toBeNull();
      expect(h1Matches?.length).toBe(1);

      // The <h1> must provide an aria-label with the developer's full name
      expect(html).toContain(`<h1 aria-label="${heroData.name}"`);
    });

    it("renders subordinate heading levels semantically (<h2> for role)", () => {
      const html = renderToString(<Hero data={heroData} />);

      // Role title rendered as h2
      expect(html).toContain("<h2");
      expect(html).toContain(heroData.title.replace(/&/g, "&amp;"));

      // No h3 or deeper headings inappropriately in the monograph
      const h3Matches = html.match(/<h3[\s>]/g);
      expect(h3Matches).toBeNull();
    });

    it("protects descenders on name words while maintaining aria-hidden on animated spans", () => {
      const html = renderToString(<Hero data={heroData} />);

      // Overflow mask classes applied to word spans
      expect(html).toContain("overflow-hidden");
      expect(html).toContain("pb-3 -mb-3 pt-1 -mt-1");

      // Animated inner word spans must have aria-hidden to prevent assistive tech double-reading
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("Lalit");
      expect(html).toContain("Singh");
      expect(html).toContain("Bisht");
    });
  });

  describe("Entrance Choreography Animation Variants", () => {
    it("exports motion variants that orchestrate staggered reveals in standard mode", () => {
      const container = getContainerVariants(false);
      const nameContainer = getNameContainerVariants(false);
      const word = getWordVariants(false);
      const fadeUp = getFadeUpVariants(false);
      const telemetry = getTelemetryVariants(false);

      const containerVisible = container.visible as TargetAndTransition;
      const containerTransition = containerVisible.transition as TransitionWithStagger;
      expect(containerTransition.staggerChildren).toBeGreaterThan(0);

      const nameVisible = nameContainer.visible as TargetAndTransition;
      const nameTransition = nameVisible.transition as TransitionWithStagger;
      expect(nameTransition.staggerChildren).toBeGreaterThan(0);

      const wordHidden = word.hidden as TargetAndTransition;
      const wordVisible = word.visible as TargetAndTransition;
      const wordTransition = wordVisible.transition as TransitionWithStagger;
      expect(wordHidden.y).toBe("115%");
      expect(wordHidden.opacity).toBe(0);
      expect(wordVisible.y).toBe("0%");
      expect(wordVisible.opacity).toBe(1);
      expect(wordTransition.duration).toBeGreaterThan(0);

      const fadeUpHidden = fadeUp.hidden as TargetAndTransition;
      const fadeUpVisible = fadeUp.visible as TargetAndTransition;
      expect(fadeUpHidden.opacity).toBe(0);
      expect(Number(fadeUpHidden.y)).toBeGreaterThan(0);
      expect(fadeUpVisible.opacity).toBe(1);
      expect(fadeUpVisible.y).toBe(0);

      const telemetryHidden = telemetry.hidden as TargetAndTransition;
      const telemetryVisible = telemetry.visible as TargetAndTransition;
      const telemetryTransition = telemetryVisible.transition as TransitionWithStagger;
      expect(telemetryHidden.opacity).toBe(0);
      expect(Number(telemetryHidden.scale)).toBeLessThan(1);
      expect(telemetryVisible.opacity).toBe(1);
      expect(telemetryVisible.scale).toBe(1);
      expect(telemetryTransition.delay).toBeGreaterThan(0);
    });

    it("bypasses animation durations and delays when reduced motion is preferred", () => {
      const container = getContainerVariants(true);
      const nameContainer = getNameContainerVariants(true);
      const word = getWordVariants(true);
      const fadeUp = getFadeUpVariants(true);
      const telemetry = getTelemetryVariants(true);

      const containerVisible = container.visible as TargetAndTransition;
      const containerTransition = containerVisible.transition as TransitionWithStagger;
      expect(containerTransition.staggerChildren).toBe(0);

      const nameVisible = nameContainer.visible as TargetAndTransition;
      const nameTransition = nameVisible.transition as TransitionWithStagger;
      expect(nameTransition.staggerChildren).toBe(0);
      expect(nameTransition.delayChildren).toBe(0);

      const wordHidden = word.hidden as TargetAndTransition;
      const wordVisible = word.visible as TargetAndTransition;
      const wordTransition = wordVisible.transition as TransitionWithStagger;
      expect(wordHidden.y).toBe("0%");
      expect(wordHidden.opacity).toBe(1);
      expect(wordVisible.y).toBe("0%");
      expect(wordVisible.opacity).toBe(1);
      expect(wordTransition.duration).toBe(0);

      const fadeUpHidden = fadeUp.hidden as TargetAndTransition;
      const fadeUpVisible = fadeUp.visible as TargetAndTransition;
      const fadeUpTransition = fadeUpVisible.transition as TransitionWithStagger;
      expect(fadeUpHidden.opacity).toBe(1);
      expect(fadeUpHidden.y).toBe(0);
      expect(fadeUpVisible.opacity).toBe(1);
      expect(fadeUpVisible.y).toBe(0);
      expect(fadeUpTransition.duration).toBe(0);

      const telemetryHidden = telemetry.hidden as TargetAndTransition;
      const telemetryVisible = telemetry.visible as TargetAndTransition;
      const telemetryTransition = telemetryVisible.transition as TransitionWithStagger;
      expect(telemetryHidden.opacity).toBe(1);
      expect(telemetryHidden.scale).toBe(1);
      expect(telemetryVisible.opacity).toBe(1);
      expect(telemetryVisible.scale).toBe(1);
      expect(telemetryTransition.duration).toBe(0);
      expect(telemetryTransition.delay).toBe(0);
    });
  });

  describe("Reduced Motion Handling in Rendered Component", () => {
    it("renders with data-reduced-motion='false' in standard mode and includes animate-ping beacon", () => {
      const html = renderToString(<Hero data={heroData} reducedMotion={false} />);

      expect(html).toContain('data-reduced-motion="false"');
      expect(html).toContain("animate-ping");
      expect(html).toContain("motion-reduce:animate-none");
    });

    it("disables animate-ping and sets data-reduced-motion='true' when reducedMotion is active", () => {
      const html = renderToString(<Hero data={heroData} reducedMotion={true} />);

      expect(html).toContain('data-reduced-motion="true"');
      // The ping animation class is bypassed in reduced motion
      expect(html).not.toContain("animate-ping");
      expect(html).toContain("motion-reduce:animate-none");
    });
  });

  describe("Accessibility Hardening & Screen Reader Semantics", () => {
    it("renders live status beacon with role='status', aria-live='polite', and accessible screen-reader text", () => {
      const html = renderToString(<Hero data={heroData} />);

      // role="status" and aria-live="polite" present
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');

      // Accessible screen-reader text
      expect(html).toContain("sr-only");
      expect(html).toMatch(/Status:\s*Available for Work/i);
      expect(html).toMatch(/Target:\s*Senior Roles/i);
    });

    it("provides high-contrast focus rings and accessible labels for all action buttons", () => {
      const html = renderToString(<Hero data={heroData} />);

      // Primary CTA
      expect(html).toContain('id="hero-cta-primary"');
      expect(html).toContain(`aria-label="${heroData.actions.primary.label}"`);
      expect(html).toContain("focus-visible:ring-2");
      expect(html).toContain("focus-visible:ring-cyan-500");
      expect(html).toContain("focus-visible:ring-offset-2");

      // Secondary CTA
      expect(html).toContain('id="hero-cta-secondary"');
      expect(html).toContain(`aria-label="${heroData.actions.secondary.label}"`);
      expect(html).toContain("focus-visible:ring-2");
      expect(html).toContain("focus-visible:ring-cyan-500");
      expect(html).toContain("focus-visible:ring-offset-2");
    });

    it("provides high-contrast focus rings, accessible labels, and focusable='false' on micro-social links", () => {
      const html = renderToString(<Hero data={heroData} />);

      for (const profile of navSocialProfiles) {
        expect(html).toContain(`href="${profile.href}"`);
        expect(html).toContain(`aria-label="${profile.ariaLabel}"`);
      }

      // Micro-social container focus rings
      expect(html).toContain("focus-visible:ring-2 focus-visible:ring-cyan-500");
      expect(html).toContain("focus-visible:ring-offset-2");

      // Decorative SVG icons have focusable="false" and aria-hidden="true"
      expect(html).toContain('focusable="false"');
      expect(html).toContain('aria-hidden="true"');
    });

    it("decorates telemetry focus domains and stack chips with semantic list and aria labels", () => {
      const html = renderToString(<Hero data={heroData} />);

      expect(html).toContain('aria-label="Active engineering focus areas"');
      expect(html).toContain('aria-label="Core technology stack"');
    });
  });

  describe("ADR-0006 Layout Compliance & Palette Purity", () => {
    it("conforms to ADR-0006 container guide (max-w-6xl) and 12-column asymmetric split", () => {
      const html = renderToString(<Hero data={heroData} />);

      expect(html).toContain("max-w-6xl");
      expect(html).toContain("grid-cols-1");
      expect(html).toContain("lg:grid-cols-12");
      expect(html).toContain("lg:col-span-7");
      expect(html).toContain("lg:col-span-5");
    });

    it("maintains palette purity without deprecated indigo or violet classes", () => {
      const html = renderToString(
        <ThemeProvider>
          <Hero data={heroData} />
        </ThemeProvider>
      );

      expect(html).not.toMatch(/\b(indigo|violet)-\d+/);
    });
  });
});
