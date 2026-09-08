/**
 * Integration Tests: Executive Telemetry Card and Mobile Stacking (Issue 03)
 *
 * Verifies that the Hero section renders the Executive Telemetry Card
 * in the right 5-column span on desktop, wrapped in dual-mode editorial glass
 * with a QuarterCircleArc in electric cyan, live pulsing emerald beacon,
 * operational coordinates (location/timezone), active engineering focus domains,
 * and core architecture capability chips.
 *
 * Also verifies mobile single-column stacking order (monograph preceding card)
 * and lightweight glass blur step-down (backdrop-blur-sm).
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Hero from "../Hero/Hero";
import { heroData } from "../../data/hero";
import { ThemeProvider } from "../../context/ThemeContext";

describe("Executive Telemetry Card and Mobile Stacking (Issue 03)", () => {
  it("renders the Executive Telemetry Card within the right 5-column span on desktop", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Right column span
    const colMatch = html.match(/class="([^"]*lg:col-span-5[^"]*)"/);
    expect(colMatch).toBeTruthy();

    // Telemetry card element exists
    expect(html).toContain('id="hero-telemetry-card"');
  });

  it("applies dual-mode editorial glass strata with mobile blur step-down to protect GPU compositor", () => {
    const html = renderToString(<Hero data={heroData} />);

    const cardMatch = html.match(/id="hero-telemetry-card"[^>]*class="([^"]*)"/);
    expect(cardMatch).toBeTruthy();
    const classes = cardMatch![1];

    // Standardized editorial glass class
    expect(classes).toContain("editorial-glass");

    // Dual-mode glass blur: mobile 4px blur, desktop 24px blur
    expect(classes).toContain("backdrop-blur-sm");
    expect(classes).toContain("lg:backdrop-blur-xl");

    // Dual-mode opacity: balanced on mobile, ultra-translucent on desktop
    expect(classes).toContain("bg-white/80");
    expect(classes).toContain("dark:bg-slate-900/80");
    expect(classes).toContain("lg:bg-white/20");
    expect(classes).toContain("lg:dark:bg-slate-900/40");

    // Delicate border and rounded corners
    expect(classes).toContain("border-slate-200/60");
    expect(classes).toContain("dark:border-white/[0.08]");
    expect(classes).toContain("rounded-3xl");
  });

  it("integrates a quarter-circle corner bubble arc in electric cyan in the top-right corner", () => {
    const html = renderToString(<Hero data={heroData} />);

    // CornerBubble / QuarterCircleArc rendered with electric cyan color #06b6d4
    expect(html).toMatch(/id="corner-bubble-(body|rim)-/);
    expect(html).toContain("#06b6d4");
  });

  it("renders a live status module with a pulsing emerald beacon indicating senior role availability", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Emerald pulse beacon
    expect(html).toContain("animate-ping");
    expect(html).toContain("bg-emerald-400");
    expect(html).toContain("bg-emerald-500");

    // Status and role target text
    expect(html).toContain(heroData.telemetry.status);
    expect(html).toContain(heroData.telemetry.roleTarget);
    expect(html).toContain("uppercase");

    // Accessible screen reader indication
    expect(html).toMatch(/Status:\s*Available for Work/i);
  });

  it("displays verified operational coordinates (location and timezone)", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Location text
    expect(html).toContain(heroData.telemetry.location);

    // Timezone text
    expect(html).toContain(heroData.telemetry.timezone);
  });

  it("renders active engineering focus domains with clean typography and bullet indicators", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Focus header
    expect(html).toMatch(/Active Engineering Focus/i);

    // All focus domains from data schema
    for (const domain of heroData.telemetry.focus) {
      expect(html).toContain(domain);
    }
  });

  it("renders core architecture capability chips with high-contrast styling", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Core stack header
    expect(html).toMatch(/Core Architecture Anchors|Core Stack/i);

    // All core technology items
    for (const tech of heroData.telemetry.coreStack) {
      expect(html).toContain(tech);
    }
  });

  it("collapses into a single vertical column on mobile with monograph preceding telemetry card in DOM order", () => {
    const html = renderToString(<Hero data={heroData} />);

    // Grid container supports single-column stacking
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("lg:grid-cols-12");

    // Monograph (h1 developer name) must precede the telemetry card in DOM order
    const h1Index = html.indexOf("<h1");
    const telemetryCardIndex = html.indexOf('id="hero-telemetry-card"');

    expect(h1Index).toBeGreaterThan(-1);
    expect(telemetryCardIndex).toBeGreaterThan(-1);
    expect(h1Index).toBeLessThan(telemetryCardIndex);
  });

  it("maintains palette purity without legacy indigo/violet tokens under ThemeProvider", () => {
    const html = renderToString(
      <ThemeProvider>
        <Hero data={heroData} />
      </ThemeProvider>
    );

    expect(html).toContain('id="hero-telemetry-card"');
    expect(html).not.toMatch(/\b(indigo|violet)-\d+/);
  });
});
