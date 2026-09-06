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
    expect(html).toContain('aria-label=');

    // Guarantee no stale placeholder link remains
    expect(html).not.toContain("lalitsinghbisht");
  });
});
