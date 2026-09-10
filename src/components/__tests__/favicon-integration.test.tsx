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
      faviconSvg = fs.readFileSync(faviconPath, "utf-8") as string;
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

describe("Fallback Raster Asset Pipeline & Touch Icon Integration (Issue 02)", () => {
  let appleTouchIconExists = false;
  let appleTouchIconBytes: Uint8Array | null = null;
  let faviconIcoExists = false;
  let faviconIcoBytes: Uint8Array | null = null;

  beforeAll(async () => {
    const fsMod = "node:fs";
    const pathMod = "node:path";
    const fs = (await import(fsMod)) as unknown as {
      existsSync: (p: string) => boolean;
      readFileSync: (p: string) => Uint8Array;
    };
    const path = (await import(pathMod)) as unknown as {
      resolve: (...p: string[]) => string;
      join: (...p: string[]) => string;
    };

    const publicDir = path.resolve(process.cwd(), "public");
    const touchPath = path.join(publicDir, "apple-touch-icon.png");
    const icoPath = path.join(publicDir, "favicon.ico");

    appleTouchIconExists = fs.existsSync(touchPath);
    faviconIcoExists = fs.existsSync(icoPath);

    if (appleTouchIconExists) {
      appleTouchIconBytes = new Uint8Array(fs.readFileSync(touchPath));
    }
    if (faviconIcoExists) {
      faviconIcoBytes = new Uint8Array(fs.readFileSync(icoPath));
    }
  });

  describe("HTML Entry Document Head Fallback Links", () => {
    it("declares fallback ICO icon with rel='icon', type='image/x-icon', href='/favicon.ico', and sizes='any'", () => {
      expect(indexHtml).toMatch(
        /<link\s+rel="icon"\s+type="image\/x-icon"\s+href="\/favicon\.ico"\s+sizes="any"\s*\/?>/
      );
    });

    it("declares Apple Touch icon with rel='apple-touch-icon' and href='/apple-touch-icon.png'", () => {
      expect(indexHtml).toMatch(
        /<link\s+rel="apple-touch-icon"\s+href="\/apple-touch-icon\.png"\s*\/?>/
      );
    });
  });

  describe("Raster Fallback Static Assets (public/)", () => {
    it("ensures public/apple-touch-icon.png exists and is non-empty", () => {
      expect(appleTouchIconExists).toBe(true);
      expect(appleTouchIconBytes).not.toBeNull();
      expect(appleTouchIconBytes!.length).toBeGreaterThan(0);
    });

    it("verifies public/apple-touch-icon.png is a valid PNG with 180x180 dimensions", () => {
      expect(appleTouchIconBytes).not.toBeNull();
      const bytes = appleTouchIconBytes!;

      // PNG signature: 89 50 4E 47 0D 0A 1A 0A
      expect(bytes[0]).toBe(0x89);
      expect(bytes[1]).toBe(0x50);
      expect(bytes[2]).toBe(0x4e);
      expect(bytes[3]).toBe(0x47);
      expect(bytes[4]).toBe(0x0d);
      expect(bytes[5]).toBe(0x0a);
      expect(bytes[6]).toBe(0x1a);
      expect(bytes[7]).toBe(0x0a);

      // Read dimensions from IHDR chunk (offset 16 for width, offset 20 for height, 32-bit big-endian)
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const width = view.getUint32(16, false);
      const height = view.getUint32(20, false);
      expect(width).toBe(180);
      expect(height).toBe(180);
    });

    it("ensures public/favicon.ico exists and is non-empty", () => {
      expect(faviconIcoExists).toBe(true);
      expect(faviconIcoBytes).not.toBeNull();
      expect(faviconIcoBytes!.length).toBeGreaterThan(0);
    });

    it("verifies public/favicon.ico is a valid multi-resolution ICO file containing 16x16, 32x32, and 48x48 icon resources", () => {
      expect(faviconIcoBytes).not.toBeNull();
      const bytes = faviconIcoBytes!;
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

      // ICO signature: reserved=0, type=1 (ICO)
      const reserved = view.getUint16(0, true);
      const type = view.getUint16(2, true);
      const imageCount = view.getUint16(4, true);

      expect(reserved).toBe(0);
      expect(type).toBe(1);
      expect(imageCount).toBeGreaterThanOrEqual(3);

      // Collect resolutions from directory entries (each entry is 16 bytes)
      const resolutions: { width: number; height: number }[] = [];
      for (let i = 0; i < imageCount; i++) {
        const entryOffset = 6 + i * 16;
        const width = view.getUint8(entryOffset) || 256;
        const height = view.getUint8(entryOffset + 1) || 256;
        resolutions.push({ width, height });
      }

      expect(resolutions).toContainEqual({ width: 16, height: 16 });
      expect(resolutions).toContainEqual({ width: 32, height: 32 });
      expect(resolutions).toContainEqual({ width: 48, height: 48 });
    });
  });
});

describe("Domain Glossary & Architectural Decision Record Integration (Issue 03)", () => {
  let contextMdExists = false;
  let contextMdContent = "";
  let adrExists = false;
  let adrContent = "";

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

    const rootDir = process.cwd();
    const contextPath = path.resolve(rootDir, "CONTEXT.md");
    const adrPath = path.resolve(rootDir, "docs/adr/0008-isometric-monogram-favicon.md");

    contextMdExists = fs.existsSync(contextPath);
    if (contextMdExists) {
      contextMdContent = fs.readFileSync(contextPath, "utf-8") as string;
    }

    adrExists = fs.existsSync(adrPath);
    if (adrExists) {
      adrContent = fs.readFileSync(adrPath, "utf-8") as string;
    }
  });

  describe("Domain Glossary (CONTEXT.md)", () => {
    it("ensures CONTEXT.md exists and is non-empty", () => {
      expect(contextMdExists).toBe(true);
      expect(contextMdContent.trim().length).toBeGreaterThan(0);
    });

    it("registers the canonical Isometric Monogram Favicon domain concept", () => {
      expect(contextMdContent).toContain("**Isometric Monogram Favicon**");
    });

    it("documents the squircle badge geometry, 3-tone planar lighting, and 16px legibility", () => {
      const entry = contextMdContent.slice(
        contextMdContent.indexOf("**Isometric Monogram Favicon**")
      );
      expect(entry).toMatch(/obsidian/i);
      expect(entry).toContain("#050811");
      expect(entry).toContain('rx="14"');
      expect(entry).toMatch(/3-tone planar/i);
      expect(entry).toContain("#22d3ee");
      expect(entry).toContain("#38bdf8");
      expect(entry).toContain("#0284c7");
      expect(entry).toMatch(/16×16|16x16/);
    });
  });

  describe("Architectural Decision Record (docs/adr/0008-isometric-monogram-favicon.md)", () => {
    it("ensures docs/adr/0008-isometric-monogram-favicon.md exists and is non-empty", () => {
      expect(adrExists).toBe(true);
      expect(adrContent.trim().length).toBeGreaterThan(0);
    });

    it("documents standard architectural decision sections (Context, Decision Drivers, Decision, Consequences)", () => {
      expect(adrContent).toMatch(/^#\s+0008[\s.:]/m);
      expect(adrContent).toMatch(/##\s+Context/i);
      expect(adrContent).toMatch(/##\s+Decision Drivers/i);
      expect(adrContent).toMatch(/##\s+Decision/i);
      expect(adrContent).toMatch(/##\s+Consequences/i);
    });

    it("articulates key decision drivers: 16px tab legibility, planar lighting, and solid badge vs. transparent", () => {
      expect(adrContent).toMatch(/16px\s+(?:tab\s+)?legibility/i);
      expect(adrContent).toMatch(/planar\s+lighting/i);
      expect(adrContent).toMatch(/solid\s+badge\s+vs\.?\s+transparent/i);
    });

    it("details the 3-tone color hierarchy (#22d3ee, #38bdf8, #0284c7) and obsidian squircle contrast guarantee", () => {
      expect(adrContent).toContain("#22d3ee");
      expect(adrContent).toContain("#38bdf8");
      expect(adrContent).toContain("#0284c7");
      expect(adrContent).toContain("#050811");
    });
  });
});

