import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import MobileHeader from "./MobileHeader";
import { navData } from "../../data/nav";
import { ThemeProvider } from "../../context/ThemeContext";
import { PatternProvider } from "../../context/PatternContext";

describe("MobileHeader Component — Clean Control Surface & Pattern Toggle Purge", () => {
  it("renders accessible theme toggle and strictly omits background pattern toggle", () => {
    const html = renderToString(
      <ThemeProvider>
        <PatternProvider initialMode="cubes">
          <MobileHeader data={navData} />
        </PatternProvider>
      </ThemeProvider>
    );

    // Theme toggle button must exist
    expect(html).toContain('id="mobile-header-theme-toggle"');

    // Pattern toggle button must be completely absent from the DOM
    expect(html).not.toContain('id="mobile-header-pattern-toggle"');
    expect(html).not.toContain("Switch to Dot Matrix background");
    expect(html).not.toContain("Switch to Isometric Lattice background");

    // Only 1 circular 32px button (the theme toggle) should be present in controls
    const matches32px = html.match(/w-8 h-8[^"]*rounded-full/g);
    expect(matches32px).not.toBeNull();
    expect(matches32px!.length).toBe(1);
  });

  it("renders accessible theme toggle with proper aria-label and smooth icon", () => {
    const html = renderToString(
      <ThemeProvider>
        <MobileHeader data={navData} />
      </ThemeProvider>
    );

    // Accessible theme toggle with aria-label
    expect(html).toMatch(/aria-label="Switch to (light|dark) mode"/);
    expect(html).toContain('id="mobile-header-theme-toggle"');
  });

  it("maintains balanced identity layout with logo monogram, name, and title", () => {
    const html = renderToString(
      <ThemeProvider>
        <MobileHeader data={navData} />
      </ThemeProvider>
    );

    // Identity link anchored to #home
    expect(html).toContain('id="mobile-header-logo"');
    expect(html).toContain('href="#home"');

    // Monogram and typography
    expect(html).toContain(navData.shortName);
    expect(html).toContain(navData.name);
    expect(html).toContain("AI-Augmented Developer");
  });

  it("safely accepts deprecated patternMode and onTogglePatternMode props without rendering pattern toggle", () => {
    const onToggle = vi.fn();
    const html = renderToString(
      <ThemeProvider>
        <MobileHeader
          data={navData}
          patternMode="dots"
          onTogglePatternMode={onToggle}
        />
      </ThemeProvider>
    );

    // Even with explicit props passed, pattern toggle is completely absent
    expect(html).not.toContain('id="mobile-header-pattern-toggle"');
    expect(html).not.toContain("Switch to Isometric Lattice background");
    expect(html).not.toContain("Switch to Dot Matrix background");

    // Theme toggle remains functional and present
    expect(html).toContain('id="mobile-header-theme-toggle"');
  });

  it("renders gracefully when used without PatternProvider (safe fallback)", () => {
    const html = renderToString(
      <ThemeProvider>
        <MobileHeader data={navData} />
      </ThemeProvider>
    );

    expect(html).toContain('id="mobile-header-theme-toggle"');
    expect(html).not.toContain('id="mobile-header-pattern-toggle"');
  });
});
