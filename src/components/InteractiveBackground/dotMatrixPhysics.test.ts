import { describe, it, expect } from "vitest";
import {
  DOT_PROX_R,
  DOT_BASE_R,
  DOT_APEX_SCALE,
  DOT_MAX_DISPLACEMENT,
  SPRING_K,
  SPRING_C,
  SPRING_INITIAL_COMPRESSION,
  SPRING_SETTLE_MS,
  RIPPLE_WAVE_W,
  RIPPLE_PUSH_MAX,
  calculateHemisphericalElevation,
  calculateSpringFactor,
  calculateDomeDisplacement,
  calculateWavePush,
  calculateDotRadius,
} from "./dotMatrixPhysics";

describe("Dot Matrix 3D Hemispherical Projection & Kinetic Spring Physics", () => {
  describe("Hemispherical Elevation Geometry Contract", () => {
    const R = DOT_PROX_R; // 180px

    it("verifies R = 180px proximity radius constant", () => {
      expect(R).toBe(180);
    });

    it("evaluates maximum elevation z = R at the dome apex (d = 0)", () => {
      const mx = 300;
      const my = 400;
      const z = calculateHemisphericalElevation(mx, my, mx, my, R);
      expect(z).toBeCloseTo(180, 5);
    });

    it("evaluates zero elevation at the boundary rim (d = R)", () => {
      const mx = 300;
      const my = 400;
      const zEast = calculateHemisphericalElevation(mx + R, my, mx, my, R);
      const zNorth = calculateHemisphericalElevation(mx, my - R, mx, my, R);

      expect(zEast).toBeCloseTo(0, 5);
      expect(zNorth).toBeCloseTo(0, 5);
    });

    it("evaluates exact spherical Pythagorean elevation at intermediate distance (d = R / 2)", () => {
      const mx = 200;
      const my = 200;
      // At d = 90px: z = sqrt(180^2 - 90^2) = sqrt(32400 - 8100) = sqrt(24300) = 90 * sqrt(3) ~ 155.88457
      const expectedZ = Math.sqrt(R * R - 90 * 90);
      const z = calculateHemisphericalElevation(mx + 90, my, mx, my, R);

      expect(z).toBeCloseTo(expectedZ, 4);
      expect(z).toBeCloseTo(155.8846, 3);
    });

    it("strictly returns 0 for points outside proximity radius R", () => {
      const mx = 100;
      const my = 100;
      const zOutside1 = calculateHemisphericalElevation(mx + 181, my, mx, my, R);
      const zOutside2 = calculateHemisphericalElevation(mx + 300, my + 300, mx, my, R);

      expect(zOutside1).toBe(0);
      expect(zOutside2).toBe(0);
    });

    it("guarantees elevation non-negativity across arbitrary coordinates", () => {
      const mx = -500;
      const my = 1000;
      for (let dx = -250; dx <= 250; dx += 25) {
        for (let dy = -250; dy <= 250; dy += 25) {
          const z = calculateHemisphericalElevation(mx + dx, my + dy, mx, my, R);
          expect(z).toBeGreaterThanOrEqual(0);
          expect(Number.isFinite(z)).toBe(true);
        }
      }
    });
  });

  describe("Damped Harmonic Spring Oscillation & Rebound Contract", () => {
    it("conforms to physical parameters (k ~ 280, c ~ 22, settle ~ 550ms, initial -40%)", () => {
      expect(SPRING_K).toBeCloseTo(280, 0);
      expect(SPRING_C).toBeCloseTo(22, 0);
      expect(SPRING_INITIAL_COMPRESSION).toBeCloseTo(-0.40, 2);
      expect(SPRING_SETTLE_MS).toBe(550);
    });

    it("returns equilibrium factor 1.0 when no click or negative elapsed time", () => {
      expect(calculateSpringFactor(-10)).toBe(1.0);
      expect(calculateSpringFactor(-99999)).toBe(1.0);
    });

    it("depresses dome by exactly 40% at t = 0ms (factor = 0.60)", () => {
      const factorAtZero = calculateSpringFactor(0);
      expect(factorAtZero).toBeCloseTo(0.60, 4);
    });

    it("crosses equilibrium around t ~ 195ms", () => {
      // Harmonic oscillator crossing zero displacement
      const factorBefore = calculateSpringFactor(150);
      const factorNearCross = calculateSpringFactor(195);
      const factorAfter = calculateSpringFactor(240);

      expect(factorBefore).toBeLessThan(1.0);
      expect(factorNearCross).toBeCloseTo(1.0, 1);
      expect(factorAfter).toBeGreaterThan(1.0);
    });

    it("reaches elastic rebound overshoot (factor > 1.0) around t ~ 260-300ms", () => {
      const factorOvershoot = calculateSpringFactor(280);
      expect(factorOvershoot).toBeGreaterThan(1.0);
      expect(factorOvershoot).toBeLessThan(1.15); // bounded underdamped rebound
    });

    it("settles smoothly to equilibrium 1.0 at t >= 550ms", () => {
      const factorAtSettle = calculateSpringFactor(550);
      const factorAfterSettle = calculateSpringFactor(600);
      const factorLate = calculateSpringFactor(1200);

      expect(factorAtSettle).toBeCloseTo(1.0, 3);
      expect(factorAfterSettle).toBe(1.0);
      expect(factorLate).toBe(1.0);
    });
  });

  describe("Tactile Radial Outward Displacement Contract", () => {
    const R = DOT_PROX_R; // 180px

    it("produces zero displacement at apex (d = 0) without division by zero", () => {
      const mx = 250;
      const my = 250;
      const elevation = calculateHemisphericalElevation(mx, my, mx, my, R);
      const disp = calculateDomeDisplacement(mx, my, mx, my, elevation, R, DOT_MAX_DISPLACEMENT);

      expect(disp.dx).toBe(0);
      expect(disp.dy).toBe(0);
    });

    it("displaces radially outward away from cursor along cardinal directions", () => {
      const mx = 200;
      const my = 200;

      // East dot (px > mx, py = my)
      const zEast = calculateHemisphericalElevation(mx + 90, my, mx, my, R);
      const dispEast = calculateDomeDisplacement(mx + 90, my, mx, my, zEast, R, DOT_MAX_DISPLACEMENT);
      expect(dispEast.dx).toBeGreaterThan(0);
      expect(dispEast.dy).toBeCloseTo(0, 5);

      // West dot (px < mx, py = my)
      const zWest = calculateHemisphericalElevation(mx - 90, my, mx, my, R);
      const dispWest = calculateDomeDisplacement(mx - 90, my, mx, my, zWest, R, DOT_MAX_DISPLACEMENT);
      expect(dispWest.dx).toBeLessThan(0);
      expect(dispWest.dy).toBeCloseTo(0, 5);

      // South dot (px = mx, py > my)
      const zSouth = calculateHemisphericalElevation(mx, my + 90, mx, my, R);
      const dispSouth = calculateDomeDisplacement(mx, my + 90, mx, my, zSouth, R, DOT_MAX_DISPLACEMENT);
      expect(dispSouth.dx).toBeCloseTo(0, 5);
      expect(dispSouth.dy).toBeGreaterThan(0);

      // North dot (px = mx, py < my)
      const zNorth = calculateHemisphericalElevation(mx, my - 90, mx, my, R);
      const dispNorth = calculateDomeDisplacement(mx, my - 90, mx, my, zNorth, R, DOT_MAX_DISPLACEMENT);
      expect(dispNorth.dx).toBeCloseTo(0, 5);
      expect(dispNorth.dy).toBeLessThan(0);
    });

    it("displacement magnitude matches exact formula (z / R) * 16px", () => {
      const mx = 100;
      const my = 100;
      const px = mx + 90;
      const py = my;
      const z = calculateHemisphericalElevation(px, py, mx, my, R);
      const disp = calculateDomeDisplacement(px, py, mx, my, z, R, 16);

      const expectedMag = (z / R) * 16;
      const actualMag = Math.hypot(disp.dx, disp.dy);

      expect(actualMag).toBeCloseTo(expectedMag, 4);
    });

    it("returns zero displacement when elevation is zero or point is outside R", () => {
      const mx = 100;
      const my = 100;
      const dispZeroElevation = calculateDomeDisplacement(mx + 50, my + 50, mx, my, 0, R, 16);
      expect(dispZeroElevation.dx).toBe(0);
      expect(dispZeroElevation.dy).toBe(0);

      const dispOutside = calculateDomeDisplacement(mx + 250, my + 250, mx, my, 0, R, 16);
      expect(dispOutside.dx).toBe(0);
      expect(dispOutside.dy).toBe(0);
    });
  });

  describe("Kinetic Wavefront Ripple Contract", () => {
    it("conforms to ripple wavefront width w = 55px", () => {
      expect(RIPPLE_WAVE_W).toBe(55);
    });

    it("yields zero displacement and zero factor for points outside the wavefront ring", () => {
      const ripX = 100;
      const ripY = 100;
      const ripRadius = 200;
      const ripFade = 0.8;

      // Point at distance 100 (diff = 100 > 55)
      const pushFarInside = calculateWavePush(ripX + 100, ripY, ripX, ripY, ripRadius, ripFade, RIPPLE_WAVE_W, RIPPLE_PUSH_MAX);
      expect(pushFarInside.factor).toBe(0);
      expect(pushFarInside.dx).toBe(0);
      expect(pushFarInside.dy).toBe(0);

      // Point at distance 300 (diff = 100 > 55)
      const pushFarOutside = calculateWavePush(ripX + 300, ripY, ripX, ripY, ripRadius, ripFade, RIPPLE_WAVE_W, RIPPLE_PUSH_MAX);
      expect(pushFarOutside.factor).toBe(0);
      expect(pushFarOutside.dx).toBe(0);
      expect(pushFarOutside.dy).toBe(0);
    });

    it("pushes points on the wavefront outward away from click origin", () => {
      const ripX = 200;
      const ripY = 200;
      const ripRadius = 150;
      const ripFade = 0.75;

      // Dot directly on the wavefront ring towards the right
      const push = calculateWavePush(ripX + 150, ripY, ripX, ripY, ripRadius, ripFade, RIPPLE_WAVE_W, RIPPLE_PUSH_MAX);

      expect(push.factor).toBeGreaterThan(0.7);
      expect(push.dx).toBeGreaterThan(0);
      expect(push.dy).toBeCloseTo(0, 5);
      expect(Math.hypot(push.dx, push.dy)).toBeCloseTo(push.factor * RIPPLE_PUSH_MAX, 3);
    });
  });

  describe("Apex Magnification & Dynamic Scaling Contract", () => {
    it("scales radius up to 2.4x resting radius at the dome apex", () => {
      const restingRadius = calculateDotRadius(DOT_BASE_R, DOT_APEX_SCALE, 0, 0);
      expect(restingRadius).toBeCloseTo(DOT_BASE_R, 4);
      expect(restingRadius).toBeCloseTo(1.4, 2);

      const apexRadius = calculateDotRadius(DOT_BASE_R, DOT_APEX_SCALE, 1.0, 0);
      expect(apexRadius).toBeCloseTo(DOT_BASE_R * DOT_APEX_SCALE, 4);
      expect(apexRadius).toBeCloseTo(1.4 * 2.4, 4);
      expect(apexRadius).toBeCloseTo(3.36, 2);
    });

    it("smoothly scales intermediate elevation ratios between 1.0x and 2.4x", () => {
      const midRadius = calculateDotRadius(DOT_BASE_R, DOT_APEX_SCALE, 0.5, 0);
      expect(midRadius).toBeGreaterThan(1.4);
      expect(midRadius).toBeLessThan(3.36);
      expect(midRadius).toBeCloseTo(1.4 * (1 + 1.4 * 0.5), 4);
    });
  });
});
