import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { SocialLinks } from "./LeftRail";
import { navData } from "../../data/nav";
import { socialRegistry } from "../../data/social";

describe("LeftRail SocialLinks Integration", () => {
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
