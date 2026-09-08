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
  POINTER_IDLE_MS,
  COLOR_LERP_TOLERANCE,
  RIPPLE_WAVE_W,
  RIPPLE_PUSH_MAX,
  calculateHemisphericalElevation,
  calculateSpringFactor,
  calculateDomeDisplacement,
  calculateWavePush,
  calculateDotRadius,
  evaluateIdleSettle,
  partitionDots,
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

  describe("Adaptive Idle Settle Evaluation Contract (evaluateIdleSettle)", () => {
    const baseState = {
      pointerX: -9999,
      pointerY: -9999,
      lastPointerMoveTime: 1000,
      now: 2000,
      ripplesCount: 0,
      springClickTime: 500,
      currentColor: { r: 14, g: 165, b: 233 },
      targetColor: { r: 14, g: 165, b: 233 },
    };

    it("verifies idle sleep constants (POINTER_IDLE_MS = 150, COLOR_LERP_TOLERANCE = 0.5)", () => {
      expect(POINTER_IDLE_MS).toBe(150);
      expect(COLOR_LERP_TOLERANCE).toBe(0.5);
    });

    it("returns shouldSleep = true when all settle conditions are met", () => {
      const result = evaluateIdleSettle(baseState);
      expect(result.isPointerSettled).toBe(true);
      expect(result.isRipplesSettled).toBe(true);
      expect(result.isSpringSettled).toBe(true);
      expect(result.isColorConverged).toBe(true);
      expect(result.shouldSleep).toBe(true);
    });

    it("settles pointer immediately when off-screen (pointerX < -1000)", () => {
      const result = evaluateIdleSettle({
        ...baseState,
        pointerX: -1001,
        now: 1050, // elapsed only 50ms since move
        lastPointerMoveTime: 1000,
      });
      expect(result.isPointerSettled).toBe(true);
      expect(result.shouldSleep).toBe(true);
    });

    it("evaluates pointer settled based on 150ms stationary threshold when on-screen", () => {
      // Active movement (elapsed 80ms < 150ms)
      const moving = evaluateIdleSettle({
        ...baseState,
        pointerX: 400,
        pointerY: 300,
        now: 1080,
        lastPointerMoveTime: 1000,
      });
      expect(moving.isPointerSettled).toBe(false);
      expect(moving.shouldSleep).toBe(false);

      // Settled stationary (elapsed 150ms)
      const settledThreshold = evaluateIdleSettle({
        ...baseState,
        pointerX: 400,
        pointerY: 300,
        now: 1150,
        lastPointerMoveTime: 1000,
      });
      expect(settledThreshold.isPointerSettled).toBe(true);
      expect(settledThreshold.shouldSleep).toBe(true);

      // Settled stationary (elapsed 300ms > 150ms)
      const settled = evaluateIdleSettle({
        ...baseState,
        pointerX: 400,
        pointerY: 300,
        now: 1300,
        lastPointerMoveTime: 1000,
      });
      expect(settled.isPointerSettled).toBe(true);
      expect(settled.shouldSleep).toBe(true);
    });

    it("blocks sleep while active ripples exist", () => {
      const result = evaluateIdleSettle({
        ...baseState,
        ripplesCount: 1,
      });
      expect(result.isRipplesSettled).toBe(false);
      expect(result.shouldSleep).toBe(false);
    });

    it("blocks sleep while harmonic spring is actively rebounding (< 550ms)", () => {
      // 300ms since click (< 550ms)
      const rebounding = evaluateIdleSettle({
        ...baseState,
        now: 1300,
        springClickTime: 1000,
      });
      expect(rebounding.isSpringSettled).toBe(false);
      expect(rebounding.shouldSleep).toBe(false);

      // 550ms since click (settled)
      const settled = evaluateIdleSettle({
        ...baseState,
        now: 1550,
        springClickTime: 1000,
      });
      expect(settled.isSpringSettled).toBe(true);
      expect(settled.shouldSleep).toBe(true);
    });

    it("blocks sleep while section accent color lerp has not converged within 0.5 units", () => {
      // Divergent colors
      const divergent = evaluateIdleSettle({
        ...baseState,
        currentColor: { r: 14, g: 165, b: 233 },
        targetColor: { r: 16, g: 185, b: 129 },
      });
      expect(divergent.isColorConverged).toBe(false);
      expect(divergent.shouldSleep).toBe(false);

      // Channel difference 0.6 (> 0.5)
      const closeButNotConverged = evaluateIdleSettle({
        ...baseState,
        currentColor: { r: 14, g: 165, b: 233 },
        targetColor: { r: 14, g: 165.6, b: 233 },
      });
      expect(closeButNotConverged.isColorConverged).toBe(false);
      expect(closeButNotConverged.shouldSleep).toBe(false);

      // Channel difference 0.4 (< 0.5)
      const converged = evaluateIdleSettle({
        ...baseState,
        currentColor: { r: 14, g: 165, b: 233 },
        targetColor: { r: 14.3, g: 165.4, b: 232.8 },
      });
      expect(converged.isColorConverged).toBe(true);
      expect(converged.shouldSleep).toBe(true);
    });
  });

  describe("Two-Pass Dot Matrix Spatial Bounding-Box Partitioning Contract (partitionDots)", () => {
    // Generate a representative 1000x800 grid with 26px spacing (~1200 points)
    const testDots: Array<{ x: number; y: number }> = [];
    for (let y = 0; y <= 800; y += 26) {
      for (let x = 0; x <= 1000; x += 26) {
        testDots.push({ x, y });
      }
    }

    it("batches 100% of dots into resting pass when pointer is off-screen and ripples are empty", () => {
      const { resting, dynamic } = partitionDots(testDots, -9999, -9999, []);
      expect(resting.length).toBe(testDots.length);
      expect(dynamic.length).toBe(0);
    });

    it("partitions dots using 2D spatial bounding box around cursor (|dx| < 180 && |dy| < 180)", () => {
      const mx = 500;
      const my = 400;
      const { resting, dynamic } = partitionDots(testDots, mx, my, []);

      // Dynamic dots must strictly be inside the bounding box
      for (const p of dynamic) {
        expect(Math.abs(p.x - mx)).toBeLessThan(DOT_PROX_R);
        expect(Math.abs(p.y - my)).toBeLessThan(DOT_PROX_R);
      }

      // Resting dots must strictly be outside the bounding box
      for (const p of resting) {
        const outside = Math.abs(p.x - mx) >= DOT_PROX_R || Math.abs(p.y - my) >= DOT_PROX_R;
        expect(outside).toBe(true);
      }

      // Total dots must be conserved exactly
      expect(resting.length + dynamic.length).toBe(testDots.length);

      // In a 360x360 box with 26px spacing, dynamic count is roughly (360/26)^2 ~ 190 dots
      expect(dynamic.length).toBeGreaterThan(100);
      expect(dynamic.length).toBeLessThan(250);

      // Over 80% of dots are batched into the resting pass
      expect(resting.length).toBeGreaterThan(testDots.length * 0.8);
    });

    it("includes dots within active ripple wavefront zones into the dynamic pass", () => {
      const activeRipples = [
        {
          x: 200,
          y: 200,
          radius: 100,
          fade: 0.8,
        },
      ];

      // Pointer off-screen, only ripple active
      const { resting, dynamic } = partitionDots(testDots, -9999, -9999, activeRipples);

      expect(dynamic.length).toBeGreaterThan(0);
      for (const p of dynamic) {
        const d = Math.hypot(p.x - 200, p.y - 200);
        expect(Math.abs(d - 100)).toBeLessThan(RIPPLE_WAVE_W);
      }

      // Dot preservation
      expect(resting.length + dynamic.length).toBe(testDots.length);
    });
  });
});

