import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Contact from "./Contact";
import { contactData } from "../../data/contact";
import { socialRegistry } from "../../data/social";

describe("Contact Component Social Integration", () => {
  it("renders verified links from centralized social registry", () => {
    const html = renderToString(<Contact data={contactData} />);

    // Check all verified URLs are in rendered markup
    expect(html).toContain(`href="${socialRegistry.github.url}"`);
    expect(html).toContain(`href="${socialRegistry.linkedin.url}"`);
    expect(html).toContain(`href="${socialRegistry.twitter.url}"`);
    expect(html).toContain(`href="${socialRegistry.email.url}"`);
    expect(html).toContain(`href="${socialRegistry.resume.url}"`);

    // Verify target="_blank" and rel="noopener noreferrer" for external links
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // Verify accessibility aria-labels
    expect(html).toContain("aria-label=");

    // Guarantee no stale placeholder link remains
    expect(html).not.toContain("lalitsinghbisht");
  });

  it("consumes SVG icon paths directly from the centralized social registry", () => {
    const html = renderToString(<Contact data={contactData} />);

    // Action cards must consume the exact vector paths defined in socialRegistry
    expect(html).toContain(socialRegistry.email.iconPath);
    expect(html).toContain(socialRegistry.linkedin.iconPath);
    expect(html).toContain(socialRegistry.github.iconPath);
    expect(html).toContain(socialRegistry.resume.iconPath);

    // Connect link row must consume twitter icon from socialRegistry
    expect(html).toContain(socialRegistry.twitter.iconPath);
  });

  it("renders architectural corner bubble motifs on action cards", () => {
    const html = renderToString(<Contact data={contactData} />);

    // Corner bubble SVG elements must be rendered inside action cards
    expect(html).toContain("corner-bubble-body-");
    expect(html).toContain("corner-bubble-rim-");
  });
});

describe("Contact Section Atmosphere & Canvas Transparency", () => {
  it("eliminates opaque background washes to maintain canvas lattice visibility", () => {
    const html = renderToString(<Contact data={contactData} />);

    // Must NOT contain opaque dark fills that obscure the canvas
    expect(html).not.toContain("dark:from-slate-950");
    expect(html).not.toContain("dark:via-slate-900");
    expect(html).not.toContain("from-slate-50");

    // Must contain translucent atmospheric gradient wash
    expect(html).toContain("dark:via-sky-950/20");
    expect(html).toContain("from-transparent");
  });

  it("applies deep midnight navy styling and ambient auroras", () => {
    const html = renderToString(<Contact data={contactData} />);

    // Deep midnight navy atmospheric veil
    expect(html).toContain("#050811");

    // Ambient auroras in soft sky and cyan
    expect(html).toContain("dark:bg-sky-600/12");
    expect(html).toContain("dark:bg-cyan-600/10");
    expect(html).not.toContain("dark:bg-indigo-600/12");
    expect(html).not.toContain("dark:bg-violet-600/10");

    // Crisp typography classes
    expect(html).toContain("dark:text-white");
  });
});
