import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Skills from "./Skills";
import { SkillIcon } from "./SkillIcon";
import { skillsData } from "../../data/skills";

describe("Skills Capability Badges with Permanent Tech Brand Icons", () => {
  it("renders all 24 capabilities with permanent SVG icons and no descriptor text", () => {
    const html = renderToString(<Skills data={skillsData} />);

    // 1. Verify all 3 tiers are rendered
    expect(html).toContain("Interface &amp; Experience Engine");
    expect(html).toContain("Distributed Systems &amp; Cloud Architecture");
    expect(html).toContain("AI Systems &amp; Intelligence Orchestration");

    // 2. Count capabilities across all tiers (should be 24)
    const allCapabilities = skillsData.tiers.flatMap((t) => t.capabilities);
    expect(allCapabilities).toHaveLength(24);

    // 3. For each capability, verify skill name is present in HTML
    for (const cap of allCapabilities) {
      expect(html).toContain(cap.name);
    }

    // Verify that the capability chips do not contain secondary descriptor markup
    expect(html).not.toContain("chipDescriptor");
    expect(html).not.toContain("overflow-hidden text-[10px]");

    // 4. Verify jitter-free horizontal layout classes on capability chips
    expect(html).toContain("inline-flex items-center gap-2");
    expect(html).not.toContain("flex-col items-start gap-0.5");

    // 5. Verify SVGs are embedded into the chips
    const svgMatches = html.match(/<svg[^>]*viewBox="0 0 24 24"[^>]*>/g);
    expect(svgMatches).not.toBeNull();
    // 24 skill icons + 3 quarter circle arcs in stratum cards = at least 27 SVGs
    expect(svgMatches!.length).toBeGreaterThanOrEqual(24);
  });

  it("SkillIcon component renders valid SVG for all 24 skills and fallback for unknown", () => {
    const allCapabilities = skillsData.tiers.flatMap((t) => t.capabilities);

    for (const cap of allCapabilities) {
      const iconHtml = renderToString(<SkillIcon name={cap.name} />);
      expect(iconHtml).toContain("<svg");
      expect(iconHtml).toContain('viewBox="0 0 24 24"');
      expect(iconHtml).toContain('aria-hidden="true"');
    }

    // Test normalization (spaces, slashes, dots, hyphens, casing)
    const nextHtml = renderToString(<SkillIcon name="next.js" />);
    expect(nextHtml).toContain("<svg");

    const tailwindHtml = renderToString(<SkillIcon name="CSS / Tailwind" />);
    expect(tailwindHtml).toContain("<svg");

    const cicdHtml = renderToString(<SkillIcon name="CI/CD" />);
    expect(cicdHtml).toContain("<svg");

    // Test fallback for unknown skill
    const fallbackHtml = renderToString(<SkillIcon name="Quantum Computing" />);
    expect(fallbackHtml).toContain("<svg");
    expect(fallbackHtml).toContain("<polyline");
  });
});
