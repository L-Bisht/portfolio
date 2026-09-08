import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import InteractiveBackground from "./InteractiveBackground";
import { buildIsometricLattice } from "./isometricLattice";
import {
  DOT_PROX_R,
  DOT_BASE_R,
  DOT_APEX_SCALE,
  DOT_MAX_DISPLACEMENT,
  SPRING_K,
  SPRING_C,
  SPRING_SETTLE_MS,
  calculateHemisphericalElevation,
  calculateSpringFactor,
  calculateDomeDisplacement,
} from "./dotMatrixPhysics";

describe("InteractiveBackground Component & Isometric Lattice Engine", () => {
  describe("DOM Seam & Default Mode Contract", () => {
    it("renders canvas element with fixed background positioning below interactive content", () => {
      const html = renderToString(<InteractiveBackground activeSectionId="home" />);

      // Canvas must be aria-hidden, pointer-events none, z-index 0
      expect(html).toContain("<canvas");
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("position:fixed");
      expect(html).toContain("z-index:0");
      expect(html).toContain("pointer-events:none");
    });

    it("defaults to Cubes mode on initial load with floating switcher pill", () => {
      const html = renderToString(<InteractiveBackground activeSectionId="home" />);

      // Switcher pill must float at z-index 50
      expect(html).toContain('aria-label="Background pattern switcher"');
      expect(html).toContain("z-index:50");

      // Cubes button must be present and active (aria-pressed="true")
      expect(html).toContain('id="bg-switcher-cubes"');
      expect(html).toContain('aria-pressed="true"');
      expect(html).toContain("Cubes");

      // Dots button must be present and inactive (aria-pressed="false")
      expect(html).toContain('id="bg-switcher-dots"');
      expect(html).toContain('aria-pressed="false"');
      expect(html).toContain("Dots");

      // Stale blueprint grid button must be completely removed
      expect(html).not.toContain('id="bg-switcher-grid"');
      expect(html).not.toContain("Blueprint hairline grid");
    });
  });

  describe("Isometric Cubes Wireframe Geometry Contract", () => {
    const WIDTH = 800;
    const HEIGHT = 600;
    const EDGE_LEN = 38;

    it("generates non-empty arrays of edges and vertices covering the viewport", () => {
      const { edges, vertices } = buildIsometricLattice(WIDTH, HEIGHT, EDGE_LEN);

      expect(edges.length).toBeGreaterThan(50);
      expect(vertices.length).toBeGreaterThan(30);

      // Verify geometry bounds cover the viewport
      const minX = Math.min(...vertices.map(v => v.x));
      const maxX = Math.max(...vertices.map(v => v.x));
      const minY = Math.min(...vertices.map(v => v.y));
      const maxY = Math.max(...vertices.map(v => v.y));

      expect(minX).toBeLessThanOrEqual(0);
      expect(maxX).toBeGreaterThanOrEqual(WIDTH);
      expect(minY).toBeLessThanOrEqual(0);
      expect(maxY).toBeGreaterThanOrEqual(HEIGHT);
    });

    it("guarantees every edge has exact uniform edge length", () => {
      const { edges } = buildIsometricLattice(WIDTH, HEIGHT, EDGE_LEN);

      for (const edge of edges) {
        const dx = edge.x2 - edge.x1;
        const dy = edge.y2 - edge.y1;
        const len = Math.hypot(dx, dy);
        expect(Math.abs(len - EDGE_LEN)).toBeLessThan(0.01);
      }
    });

    it("guarantees all edges conform strictly to 30°, 90°, or 150° isometric orientations", () => {
      const { edges } = buildIsometricLattice(WIDTH, HEIGHT, EDGE_LEN);

      for (const edge of edges) {
        const dx = edge.x2 - edge.x1;
        const dy = edge.y2 - edge.y1;
        let deg = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI;

        // Round to nearest tenth of degree
        deg = Math.round(deg * 10) / 10;

        // In 2D plane:
        // Horizontal dx > 0, vertical dy = 0 -> 0 deg
        // dx = 0, dy != 0 -> 90 deg (vertical)
        // dx = s * cos(30), dy = s * sin(30) -> 30 deg (down-right or up-left)
        // dx = -s * cos(30), dy = s * sin(30) -> absolute atan2 is 30 deg to horizontal, or 150 deg to positive X
        const isIsometricOrientation =
          Math.abs(deg - 90) < 0.1 ||
          Math.abs(deg - 30) < 0.1;

        expect(
          isIsometricOrientation,
          `Edge angle ${deg}° not aligned to 30°/90°/150° isometric projection (dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)})`
        ).toBe(true);
      }
    });

    it("deduplicates edges and vertices with zero redundant elements", () => {
      const { edges, vertices } = buildIsometricLattice(WIDTH, HEIGHT, EDGE_LEN);

      // Check vertex uniqueness
      const vertexKeys = new Set(
        vertices.map(v => `${Math.round(v.x * 10) / 10},${Math.round(v.y * 10) / 10}`)
      );
      expect(vertexKeys.size).toBe(vertices.length);

      // Check edge uniqueness
      const edgeKeys = new Set(
        edges.map(e => {
          const k1 = `${Math.round(e.x1 * 10) / 10},${Math.round(e.y1 * 10) / 10}`;
          const k2 = `${Math.round(e.x2 * 10) / 10},${Math.round(e.y2 * 10) / 10}`;
          return k1 < k2 ? `${k1}->${k2}` : `${k2}->${k1}`;
        })
      );
      expect(edgeKeys.size).toBe(edges.length);
    });
  });

  describe("3D Hemispherical Dot Matrix Bulge & Kinetic Spring Bounce Contract", () => {
    it("adheres strictly to physical specification constants", () => {
      expect(DOT_PROX_R).toBe(180);
      expect(DOT_BASE_R).toBe(1.4);
      expect(DOT_APEX_SCALE).toBe(2.4);
      expect(DOT_MAX_DISPLACEMENT).toBe(16);
      expect(SPRING_K).toBeCloseTo(280, 0);
      expect(SPRING_C).toBeCloseTo(22, 0);
      expect(SPRING_SETTLE_MS).toBe(550);
    });

    it("verifies 3D dome calculates convex elevation and outward displacement", () => {
      const mx = 500;
      const my = 500;
      const R = DOT_PROX_R;

      // Dome apex
      const apexZ = calculateHemisphericalElevation(mx, my, mx, my, R);
      expect(apexZ).toBe(R);

      // Point at d = 100px towards positive X
      const px = mx + 100;
      const py = my;
      const z = calculateHemisphericalElevation(px, py, mx, my, R);
      expect(z).toBeGreaterThan(0);
      expect(z).toBeLessThan(R);

      const disp = calculateDomeDisplacement(px, py, mx, my, z, R, DOT_MAX_DISPLACEMENT);
      expect(disp.dx).toBeGreaterThan(0);
      expect(disp.dy).toBeCloseTo(0, 5);
      expect(disp.dx).toBeCloseTo((z / R) * 16, 4);
    });

    it("verifies spring compression depresses dome by 40% on click and settles over 550ms", () => {
      // Immediate click compression
      const initialFactor = calculateSpringFactor(0);
      expect(initialFactor).toBeCloseTo(0.60, 4);

      // Rebound over 550ms
      const reboundCross = calculateSpringFactor(195);
      expect(reboundCross).toBeCloseTo(1.0, 1);

      const overshoot = calculateSpringFactor(280);
      expect(overshoot).toBeGreaterThan(1.0);

      const settled = calculateSpringFactor(550);
      expect(settled).toBeCloseTo(1.0, 3);
    });
  });
});

