import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
declare const process: { cwd: () => string };
import indexHtml from "../../../index.html?raw";
import {
  applyTheme,
  THEME_COLORS,
  type Theme,
} from "../../context/themeUtils";

describe("Mobile Pull-to-Refresh & Overscroll Configuration (Issue 01)", () => {
  let indexCss = "";

  beforeAll(async () => {
    const fsMod = "node:fs";
    const pathMod = "node:path";
    const fs = await import(fsMod);
    const path = await import(pathMod);
    indexCss = fs.readFileSync(
      path.resolve(process.cwd(), "src/index.css"),
      "utf-8"
    );
  });

  describe("CSS Architecture & Overscroll Rules (src/index.css)", () => {
    it("eliminates all occurrences of overscroll-behavior: none on html and body", () => {
      expect(indexCss).not.toMatch(/html\s*\{[^}]*overscroll-behavior:\s*none/);
      expect(indexCss).not.toMatch(/body\s*\{[^}]*overscroll-behavior:\s*none/);
    });

    it("configures horizontal overscroll to none to block back/forward history navigation", () => {
      // html rule
      const htmlBlock = indexCss.match(/html\s*\{([^}]+)\}/)?.[1] || "";
      expect(htmlBlock).toMatch(/overscroll-behavior-x:\s*none;/);

      // body rule
      const bodyBlock = indexCss.match(/body\s*\{([^}]+)\}/)?.[1] || "";
      expect(bodyBlock).toMatch(/overscroll-behavior-x:\s*none;/);
    });

    it("restores vertical overscroll to auto for native mobile pull-to-refresh & elastic bounce", () => {
      const htmlBlock = indexCss.match(/html\s*\{([^}]+)\}/)?.[1] || "";
      expect(htmlBlock).toMatch(/overscroll-behavior-y:\s*auto;/);

      const bodyBlock = indexCss.match(/body\s*\{([^}]+)\}/)?.[1] || "";
      expect(bodyBlock).toMatch(/overscroll-behavior-y:\s*auto;/);
    });

    it("establishes seamless elastic bounce background colors (#f8fafc light, #050811 dark)", () => {
      // html light
      expect(indexCss).toMatch(/html\s*\{[^}]*background-color:\s*#f8fafc;/);
      // html dark
      expect(indexCss).toMatch(/html\.dark\s*\{[^}]*background-color:\s*#050811;/);
      // body light
      expect(indexCss).toMatch(/body\s*\{[^}]*background-color:\s*#f8fafc;/);
      // body dark
      expect(indexCss).toMatch(/background-color:\s*#050811;/);
    });
  });

  describe("HTML Document & Meta Configuration (index.html)", () => {
    it("defines viewport meta tag configured for responsive mobile scaling", () => {
      expect(indexHtml).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    });

    it("defines theme-color meta tags matching both light (#f8fafc) and dark (#050811) palettes", () => {
      expect(indexHtml).toContain('<meta name="theme-color"');
      expect(indexHtml).toContain("#f8fafc");
      expect(indexHtml).toContain("#050811");
    });
  });

  describe("ThemeContext & theme-color Synchronization", () => {
    let mockElement: {
      classList: {
        add: (c: string) => void;
        remove: (c: string) => void;
        contains: (c: string) => boolean;
      };
    };
    let mockHead: {
      appendChild: (el: unknown) => void;
    };
    let metaTags: Array<{
      name: string;
      content: string;
      setAttribute: (k: string, v: string) => void;
      getAttribute: (k: string) => string;
    }>;

    const savedGlobalDocument = globalThis.document;

    beforeEach(() => {
      const classes = new Set<string>();
      mockElement = {
        classList: {
          add: vi.fn((c: string) => classes.add(c)),
          remove: vi.fn((c: string) => classes.delete(c)),
          contains: (c: string) => classes.has(c),
        },
      };

      metaTags = [
        {
          name: "theme-color",
          content: "#050811",
          setAttribute(k: string, v: string) {
            if (k === "content") this.content = v;
          },
          getAttribute(k: string) {
            return k === "content" ? this.content : "";
          },
        },
      ];

      mockHead = {
        appendChild: vi.fn((el: unknown) => {
          metaTags.push(el as typeof metaTags[0]);
        }),
      };

      (globalThis as unknown as { document: unknown }).document = {
        documentElement: mockElement,
        head: mockHead,
        querySelectorAll: vi.fn((selector: string) => {
          if (selector === 'meta[name="theme-color"]') {
            return metaTags;
          }
          return [];
        }),
        createElement: vi.fn((tagName: string) => {
          const attributes: Record<string, string> = { tagName };
          return {
            setAttribute: (k: string, v: string) => {
              attributes[k] = v;
            },
            getAttribute: (k: string) => attributes[k] || "",
            get name() {
              return attributes.name;
            },
            get content() {
              return attributes.content;
            },
          };
        }),
      };
    });

    afterEach(() => {
      (globalThis as unknown as { document: unknown }).document = savedGlobalDocument;
    });

    it("exports precision light and dark theme background hex values", () => {
      expect(THEME_COLORS.light).toBe("#f8fafc");
      expect(THEME_COLORS.dark).toBe("#050811");
    });

    it("applies dark theme by adding .dark class and updating meta theme-color to #050811", () => {
      applyTheme("dark");

      expect(mockElement.classList.add).toHaveBeenCalledWith("dark");
      expect(mockElement.classList.remove).not.toHaveBeenCalled();
      expect(metaTags[0].content).toBe("#050811");
    });

    it("applies light theme by removing .dark class and updating meta theme-color to #f8fafc", () => {
      applyTheme("light");

      expect(mockElement.classList.remove).toHaveBeenCalledWith("dark");
      expect(metaTags[0].content).toBe("#f8fafc");
    });

    it("creates and appends meta theme-color tag dynamically if missing from document.head", () => {
      metaTags = [];
      ((globalThis as unknown as { document: { querySelectorAll: (s: string) => unknown[] } }).document).querySelectorAll = vi.fn(() => []);

      applyTheme("light" as Theme);

      expect(mockHead.appendChild).toHaveBeenCalled();
      expect(metaTags.length).toBe(1);
      expect(metaTags[0].getAttribute("name")).toBe("theme-color");
      expect(metaTags[0].getAttribute("content")).toBe("#f8fafc");
    });
  });
});
