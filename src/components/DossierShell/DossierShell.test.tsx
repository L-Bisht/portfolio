import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import DossierShell from "./DossierShell";
import { navData } from "../../data/nav";
import { ThemeProvider } from "../../context/ThemeContext";

describe("DossierShell Component Layout Stability", () => {
  it("locks desktop rail host permanently to 72px width to guarantee zero CLS on editorial canvas", () => {
    const html = renderToString(
      <ThemeProvider>
        <DossierShell data={navData} activeSectionId="home">
          <div id="test-child-content">Editorial Article Body</div>
        </DossierShell>
      </ThemeProvider>
    );

    // Rail host must be permanently fixed at 72px width
    expect(html).toContain("w-[72px]");
    expect(html).toContain("shrink-0");

    // Editorial canvas must exist and wrap children without being offset
    expect(html).toContain('id="editorial-canvas"');
    expect(html).toContain("Editorial Article Body");

    // Ensure no dynamic width animation is present on the rail host container
    expect(html).not.toContain('animate="[object Object]"');
  });
});
