import { describe, it, expect, beforeAll } from "vitest";
import indexHtml from "../../../index.html?raw";

declare const process: { cwd: () => string };

describe("Master Vector Favicon & Document Head Integration (Issue 01)", () => {
  let faviconSvg = "";
  let viteSvgExists = false;
  let faviconSvgExists = false;

  beforeAll(async () => {
    const fsMod = "node:fs";
    const pathMod = "node:path";
    const fs = (await import(fsMod)) as unknown as {
      existsSync: (p: string) => boolean;
      readFileSync: (p: string, enc: string) => string;
    };
    const path = (await import(pathMod)) as unknown as {
      resolve: (...p: string[]) => string;
      join: (...p: string[]) => string;
    };

    const publicDir = path.resolve(process.cwd(), "public");
    const faviconPath = path.join(publicDir, "favicon.svg");
    const vitePath = path.join(publicDir, "vite.svg");

    faviconSvgExists = fs.existsSync(faviconPath);
    viteSvgExists = fs.existsSync(vitePath);

    if (faviconSvgExists) {
      faviconSvg = fs.readFileSync(faviconPath, "utf-8");
    }
  });

  describe("HTML Entry Document (index.html)", () => {
    it("declares primary SVG vector favicon with type image/svg+xml and href /favicon.svg", () => {
      expect(indexHtml).toMatch(
        /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/?>/
      );
    });

    it("has completely eliminated references to default Vite starter icon (/vite.svg)", () => {
      expect(indexHtml).not.toContain("vite.svg");
    });
  });

  describe("File System Cleanliness & Static Public Assets", () => {
    it("ensures public/favicon.svg exists and is non-empty", () => {
      expect(faviconSvgExists).toBe(true);
      expect(faviconSvg.trim().length).toBeGreaterThan(0);
    });

    it("ensures default Vite starter icon (public/vite.svg) is permanently purged", () => {
      expect(viteSvgExists).toBe(false);
    });
  });

  describe("Master SVG Vector Architecture & Geometry (public/favicon.svg)", () => {
    it("declares standard SVG namespace and 64x64 coordinate viewBox", () => {
      expect(faviconSvg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(faviconSvg).toContain('viewBox="0 0 64 64"');
    });

    it("renders obsidian squircle badge (#050811) with 22% corner radius (rx=14) and cyan hairline stroke", () => {
      const rectMatch = faviconSvg.match(/<rect\s+([^>]+)\/?>/);
      expect(rectMatch).not.toBeNull();
      const attrs = rectMatch?.[1] || "";
      expect(attrs).toContain('fill="#050811"');
      expect(attrs).toContain('rx="14"');
      expect(attrs).toContain('stroke="#06b6d4"');
      expect(attrs).toContain('stroke-opacity="0.25"');
    });

    it("renders 3-tone isometric polygon faces with cyan planar value hierarchy", () => {
      // Top Faces: Skyward Reflection (#22d3ee)
      expect(faviconSvg).toMatch(/<polygon[^>]*fill="#22d3ee"/);
      // Right Faces: Key Light (#38bdf8)
      expect(faviconSvg).toMatch(/<polygon[^>]*fill="#38bdf8"/);
      // Left Faces: Ambient Shadow (#0284c7)
      expect(faviconSvg).toMatch(/<polygon[^>]*fill="#0284c7"/);
    });

    it("is constructed of pure mathematical geometry without CSS classes or expensive filter primitives", () => {
      expect(faviconSvg).not.toContain("class=");
      expect(faviconSvg).not.toContain("<style");
      expect(faviconSvg).not.toContain("feGaussianBlur");
      expect(faviconSvg).not.toContain("feDropShadow");
    });
  });
});
