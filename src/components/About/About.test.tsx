import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import About from "./About";
import { aboutData } from "../../data/about";

describe("About Bento Board Baseline Synchronization", () => {
  it("renders with synchronized baseline grid architecture", () => {
    const html = renderToString(<About data={aboutData} />);

    // 1. Grid container must utilize items-stretch
    expect(html).toContain("items-stretch");

    // 2. Left card (Tile 1) must NOT contain hardcoded min-h-[480px]
    expect(html).not.toContain("min-h-[480px]");

    // 3. Tile 1 must have h-full for vertical stretching
    expect(html).toContain('id="about-tile-philosophy"');
    const tile1Match = html.match(/id="about-tile-philosophy"[^>]*class="([^"]*)"/);
    expect(tile1Match).toBeTruthy();
    expect(tile1Match![1]).toContain("h-full");
    expect(tile1Match![1]).toContain("lg:col-span-1");

    // 4. Right column container must exist with h-full and span 2 columns on desktop
    expect(html).toContain('id="about-right-column"');
    const rightColMatch = html.match(/id="about-right-column"[^>]*class="([^"]*)"/);
    expect(rightColMatch).toBeTruthy();
    expect(rightColMatch![1]).toContain("h-full");
    expect(rightColMatch![1]).toContain("lg:col-span-2");

    // 5. Check semantic IDs and flex setup on Tile 2 and Tile 3
    expect(html).toContain('id="about-tile-focus"');
    expect(html).toContain('id="about-tile-stats"');

    // 6. Content renders properly — Tile 1 uses "Core Philosophy" headline per spec
    expect(html).toContain("Core Philosophy");
    expect(html).toContain(aboutData.philosophyBody);
    expect(html).toContain("What I&#x27;m Building");

    // 7. Verify all tags and stats are present
    expect(html).toContain("Domain-Driven Design");
    expect(html).toContain("AI Velocity");
    expect(html).toContain("Developer UX");
    expect(html).toContain("Years Experience");
    expect(html).toContain("Scaled Systems");
    expect(html).toContain("Projects Delivered");
  });
});
