/**
 * Integration Tests: Asymmetric Container and Editorial Monograph (Issue 02)
 *
 * Verifies that the Hero section transitions into an editorial monograph
 * anchored on the left side of a standardized 12-column grid within max-w-6xl,
 * with H1 descender protection, surname cyan accent, and verified micro-social links.
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Hero from "../Hero/Hero";
import { heroData } from "../../data/hero";
import { navSocialProfiles } from "../../data/social";
import { ThemeProvider } from "../../context/ThemeContext";

describe("Hero Asymmetric Container and Editorial Monograph (Issue 02)", () => {
  it("aligns to the standardized max-w-6xl container with balanced responsive gutters", () => {
    const html = renderToString(<Hero data={heroData} />);

    expect(html).toContain('id="home"');
    expect(html).toContain("max-w-6xl");
    expect(html).toContain("mx-auto");
    expect(html).toContain("px-4");
    expect(html).toContain("sm:px-8");
    expect(html).toContain("lg:px-12");

    // Old centered billboard classes must NOT exist
    expect(html).not.toContain("max-w-5xl");
    expect(html).not.toContain("text-center");
  });

  it("establishes a 12-column responsive grid with a 7-column monograph allocation", () => {
    const html = renderToString(<Hero data={heroData} />);

    // 12-column responsive grid
    expect(html).toContain("grid");
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("lg:grid-cols-12");

    // Left column takes 7 columns on desktop
    expect(html).toContain("lg:col-span-7");

    // Right column takes 5 columns on desktop for upcoming telemetry card
    expect(html).toContain("lg:col-span-5");
  });

  it("renders an uppercase metadata eyebrow with a leading cyan hairline", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Eyebrow container exists
    expect(html).toContain('id="hero-eyebrow"');

    // Leading cyan hairline is present
    expect(html).toContain("h-px");
    expect(html).toMatch(/bg-cyan-(400|500)/);

    // Eyebrow text and code/metadata prefix
    expect(html).toContain("//");
    expect(html).toContain(heroData.eyebrow.replace(/&/g, "&amp;"));
    expect(html).toContain("uppercase");
  });

  it("renders developer name as an accessible h1 with descender protection and surname cyan accent", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Accessible h1 with aria-label
    expect(html).toContain("<h1");
    expect(html).toContain(`aria-label="${heroData.name}"`);

    // Descender compensation mask classes applied to word spans
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("pb-3");
    expect(html).toContain("-mb-3");
    expect(html).toContain("pt-1");
    expect(html).toContain("-mt-1");

    // Surname receives precision cyan gradient accent
    expect(html).toContain('data-accent="true"');
    expect(html).toContain("from-cyan-400");
    expect(html).toContain("via-sky-400");
    expect(html).toContain("to-blue-500");
    expect(html).toContain("bg-clip-text");
    expect(html).toContain("text-transparent");
    expect(html).toContain("Bisht");

    // Non-accent words have static high-contrast styling
    expect(html).toContain("text-slate-900");
    expect(html).toContain("dark:text-white");
    expect(html).toContain("Lalit");
    expect(html).toContain("Singh");
  });

  it("renders professional role title and 2-sentence executive engineering thesis", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Professional role title in h2
    expect(html).toContain("<h2");
    expect(html).toContain(heroData.title.replace(/&/g, "&amp;"));

    // Executive thesis paragraph
    expect(html).toContain(heroData.thesis);
  });

  it("renders understated architectural action pills with primary exploration and secondary links", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Primary CTA
    expect(html).toContain('id="hero-cta-primary"');
    expect(html).toContain(`href="${heroData.actions.primary.href}"`);
    expect(html).toContain(heroData.actions.primary.label);

    // Secondary CTA
    expect(html).toContain('id="hero-cta-secondary"');
    expect(html).toContain(`href="${heroData.actions.secondary.href}"`);
    expect(html).toContain(heroData.actions.secondary.label);
  });

  it("renders verified micro-social links from the centralized social registry", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Social links container
    expect(html).toContain('id="hero-social-links"');

    // All nav social profiles rendered with proper aria-labels and hrefs
    for (const profile of navSocialProfiles) {
      expect(html).toContain(`href="${profile.href}"`);
      expect(html).toContain(`aria-label="${profile.ariaLabel}"`);
      // Icon path present
      expect(html).toContain(profile.iconPath);
    }
  });

  it("supports ThemeProvider context and maintains zero legacy color tokens", () => {
    const html = renderToString(
      <ThemeProvider>
        <Hero data={heroData} />
      </ThemeProvider>
    );

    expect(html).toContain('id="home"');
    expect(html).not.toMatch(/\b(indigo|violet)-\d+/);
  });
});
