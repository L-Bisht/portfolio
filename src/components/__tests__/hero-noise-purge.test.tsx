import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Hero from "../Hero/Hero";
import { heroData, type HeroData } from "../../data/hero";
import { ThemeProvider } from "../../context/ThemeContext";

describe("Hero Visual Noise Purge & Schema Modernization (Issue 01)", () => {
  it("purges the 22rem background ghost watermark completely", () => {
    const html = renderToString(<Hero data={heroData} />);
    // The legacy 22rem ghost watermark text "PORTFOLIO" must NOT exist in the DOM
    expect(html).not.toContain("PORTFOLIO");
  });

  it("purges the infinite 6-second gradient shimmer animation class from the name", () => {
    const html = renderToString(<Hero data={heroData} />);
    // The legacy animated gradient class must NOT exist in the DOM
    expect(html).not.toContain("hero-name-gradient");
    // High-contrast static typography classes must be applied
    expect(html).toContain("text-slate-900");
    expect(html).toContain("dark:text-white");
  });

  it("purges the bobbing SCROLL indicator and chevron arrow", () => {
    const html = renderToString(<Hero data={heroData} />);
    // The scroll label and indicator must NOT exist in the DOM
    expect(html).not.toContain('aria-label="Scroll down"');
    expect(html).not.toMatch(/>\s*Scroll\s*</i);
    // Bouncing chevron SVG path must NOT exist
    expect(html).not.toContain("M12 5v14M5 12l7 7 7-7");
  });

  it("renders structured schema fields: technical eyebrow, title, name, and thesis", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Eyebrow renders
    expect(html).toContain(heroData.eyebrow.replace(/&/g, "&amp;"));

    // Name renders inside h1
    expect(html).toContain("<h1");
    expect(html).toContain(heroData.name);

    // Title renders inside h2
    expect(html).toContain("<h2");
    expect(html).toContain(heroData.title.replace(/&/g, "&amp;"));

    // Executive thesis renders
    expect(html).toContain(heroData.thesis);
  });

  it("renders structured action links with accessible labels and valid targets", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Primary action
    expect(html).toContain(`id="hero-cta-primary"`);
    expect(html).toContain(`href="${heroData.actions.primary.href}"`);
    expect(html).toContain(heroData.actions.primary.label);

    // Secondary action
    expect(html).toContain(`id="hero-cta-secondary"`);
    expect(html).toContain(`href="${heroData.actions.secondary.href}"`);
    expect(html).toContain(heroData.actions.secondary.label);
  });

  it("heroData provides structured operational telemetry attributes", () => {
    // Assert data contract holds operational attributes for upcoming telemetry card
    expect(heroData.telemetry).toBeDefined();
    expect(heroData.telemetry.status).toBe("Available for Work");
    expect(heroData.telemetry.roleTarget).toBe("Senior Roles");
    expect(heroData.telemetry.location).toContain("New Delhi");
    expect(heroData.telemetry.timezone).toBe("UTC+5:30 (IST)");
    expect(heroData.telemetry.focus).toHaveLength(3);
    expect(heroData.telemetry.coreStack).toHaveLength(4);
  });

  it("supports backward-compatible fallback when legacy fields are supplied", () => {
    const legacyData: HeroData = {
      greeting: "Hello World",
      name: "Legacy Dev",
      title: "Full Stack Engineer",
      thesis: "",
      primaryCta: { text: "Legacy Projects", href: "#work" },
      secondaryCta: { text: "Legacy Contact", href: "#mail" },
      eyebrow: "",
      actions: {
        primary: { label: "Legacy Projects", href: "#work" },
        secondary: { label: "Legacy Contact", href: "#mail" },
      },
      telemetry: heroData.telemetry,
    };

    const html = renderToString(<Hero data={legacyData} />);
    expect(html).toContain("Legacy Dev");
    expect(html).toContain("Legacy Projects");
    expect(html).toContain("Legacy Contact");
  });

  it("renders within ThemeProvider without crashing or emitting legacy indigo/violet tokens", () => {
    const html = renderToString(
      <ThemeProvider>
        <Hero data={heroData} />
      </ThemeProvider>
    );
    expect(html).toContain('id="home"');
    expect(html).not.toMatch(/\b(indigo|violet)-\d+/);
  });
});
