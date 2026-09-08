import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import MobileHeader from "./MobileHeader";
import { navData } from "../../data/nav";
import { ThemeProvider } from "../../context/ThemeContext";
import { PatternProvider } from "../../context/PatternContext";

describe("MobileHeader Component — Theme & Background Pattern Controls Contract", () => {
  it("renders both theme toggle and pattern toggle with circular 32px dimensions", () => {
    const html = renderToString(
      <ThemeProvider>
        <PatternProvider initialMode="cubes">
          <MobileHeader data={navData} />
        </PatternProvider>
      </ThemeProvider>
    );

    // Theme toggle button must exist
    expect(html).toContain('id="mobile-header-theme-toggle"');

    // Pattern toggle button must exist adjacent in controls
    expect(html).toContain('id="mobile-header-pattern-toggle"');

    // Both buttons must be circular 32px (w-8 h-8 rounded-full)
    const matches32px = html.match(/w-8 h-8[^"]*rounded-full/g);
    expect(matches32px).not.toBeNull();
    // At least 2 buttons (theme and pattern toggle)
    expect(matches32px!.length).toBeGreaterThanOrEqual(2);
  });

  it("renders Cubes mode with accessible aria-label and Isometric Cube wireframe icon", () => {
    const html = renderToString(
      <ThemeProvider>
        <PatternProvider initialMode="cubes">
          <MobileHeader data={navData} />
        </PatternProvider>
      </ThemeProvider>
    );

    // Announces action to switch to Dot Matrix background
    expect(html).toContain('aria-label="Switch to Dot Matrix background"');

    // Contains cube wireframe SVG path coordinates
    expect(html).toContain("M6.5 1.2 L11.2 3.9");
    expect(html).toContain("M6.5 6.5 L6.5 11.8");
  });

  it("renders Dots mode with accessible aria-label and 3x3 Dot Grid icon", () => {
    const html = renderToString(
      <ThemeProvider>
        <PatternProvider initialMode="dots">
          <MobileHeader data={navData} />
        </PatternProvider>
      </ThemeProvider>
    );

    // Announces action to switch to Isometric Lattice background
    expect(html).toContain('aria-label="Switch to Isometric Lattice background"');

    // Contains dot grid circles
    expect(html).toContain("<circle");
  });

  it("supports controlled patternMode and onTogglePatternMode props", () => {
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

    // Prop overrides context/default
    expect(html).toContain('aria-label="Switch to Isometric Lattice background"');
  });

  it("renders gracefully when used without PatternProvider (safe fallback)", () => {
    const html = renderToString(
      <ThemeProvider>
        <MobileHeader data={navData} />
      </ThemeProvider>
    );

    expect(html).toContain('id="mobile-header-pattern-toggle"');
    expect(html).toContain('aria-label="Switch to Dot Matrix background"');
  });
});
