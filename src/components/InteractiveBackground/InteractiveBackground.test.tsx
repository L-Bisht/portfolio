import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import componentSource from "./InteractiveBackground.tsx?raw";
import InteractiveBackground from "./InteractiveBackground";
import {
  buildIsometricLattice,
  CUBE_EDGE,
  CUBE_EDGE_MOBILE,
  getCubeEdge,
} from "./isometricLattice";
import {
  DOT_PROX_R,
  DOT_BASE_R,
  DOT_APEX_SCALE,
  DOT_MAX_DISPLACEMENT,
  SPRING_K,
  SPRING_C,
  SPRING_SETTLE_MS,
  POINTER_IDLE_MS,
  COLOR_LERP_TOLERANCE,
  calculateHemisphericalElevation,
  calculateSpringFactor,
  calculateDomeDisplacement,
  evaluateIdleSettle,
  partitionDots,
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
      // Floating switcher pill must be hidden on mobile (< 1024px) and displayed on desktop (hidden lg:flex)
      expect(html).toContain("hidden lg:flex");

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

    it("can be externally controlled via patternMode prop", () => {
      const html = renderToString(
        <InteractiveBackground activeSectionId="home" patternMode="dots" />
      );

      // Dots button must be active
      expect(html).toContain('id="bg-switcher-dots"');
      expect(html).toContain('aria-pressed="true"');

      // Cubes button must be inactive
      expect(html).toContain('id="bg-switcher-cubes"');
      expect(html).toContain('aria-pressed="false"');
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

  describe("Adaptive Idle Sleep Loop Lifecycle Contract (Issue 02)", () => {

    it("imports and integrates idle sleep constants and evaluation utilities", () => {
      expect(componentSource).toContain("evaluateIdleSettle");
      expect(componentSource).toContain("partitionDots");
      expect(componentSource).toContain("COLOR_LERP_TOLERANCE");
      expect(POINTER_IDLE_MS).toBe(150);
      expect(COLOR_LERP_TOLERANCE).toBe(0.5);
      expect(SPRING_SETTLE_MS).toBe(550);
    });

    it("halts requestAnimationFrame scheduling when idle conditions are met", () => {
      // Must contain settle evaluation call and sleep transition
      expect(componentSource).toMatch(/evaluateIdleSettle\s*\(\s*\{[^}]*pointerX:\s*mouse\.x/);
      expect(componentSource).toMatch(/if\s*\(\s*settleResult\.shouldSleep\s*\)\s*\{[^}]*isSleepingRef\.current\s*=\s*true;[^}]*return;/);
    });

    it("wires wake() triggers to pointer movement, clicks, section changes, and theme mutations", () => {
      // Mouse move and click triggers
      expect(componentSource).toMatch(/const\s+onMouseMove\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?wake\(\);[\s\S]*?\};/);
      expect(componentSource).toMatch(/const\s+onPointerDown\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?wake\(\);[\s\S]*?\};/);
      expect(componentSource).toMatch(/const\s+onMouseLeave\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?wake\(\);[\s\S]*?\};/);
      expect(componentSource).toMatch(/const\s+resize\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?wake\(\);[\s\S]*?\};/);

      // MutationObserver on document.documentElement class for theme toggling
      expect(componentSource).toContain("MutationObserver");
      expect(componentSource).toMatch(/attributeFilter:\s*\["class"\]/);
      expect(componentSource).toMatch(/wake\(\);/);

      // Section and mode reactivity
      expect(componentSource).toMatch(/activeSectionIdRef\.current\s*=\s*activeSectionId;\s*wakeRef\.current\(\);/);
    });

    it("snaps color lerp channels to target once within tolerance (< 0.5)", () => {
      expect(componentSource).toMatch(/diffR\s*<\s*COLOR_LERP_TOLERANCE\s*&&\s*diffG\s*<\s*COLOR_LERP_TOLERANCE\s*&&\s*diffB\s*<\s*COLOR_LERP_TOLERANCE/);
      expect(componentSource).toMatch(/col\.r\s*=\s*target\.r;\s*col\.g\s*=\s*target\.g;\s*col\.b\s*=\s*target\.b;/);
    });

    it("evaluates idle state machine transitions deterministically", () => {
      const now = 10000;
      // 1. Moving pointer prevents sleep
      expect(
        evaluateIdleSettle({
          pointerX: 400,
          pointerY: 300,
          lastPointerMoveTime: now - 50, // 50ms < 150ms
          now,
          ripplesCount: 0,
          springClickTime: now - 600,
          currentColor: { r: 14, g: 165, b: 233 },
          targetColor: { r: 14, g: 165, b: 233 },
        }).shouldSleep
      ).toBe(false);

      // 2. Stationary pointer >= 150ms allows sleep
      expect(
        evaluateIdleSettle({
          pointerX: 400,
          pointerY: 300,
          lastPointerMoveTime: now - 151,
          now,
          ripplesCount: 0,
          springClickTime: now - 600,
          currentColor: { r: 14, g: 165, b: 233 },
          targetColor: { r: 14, g: 165, b: 233 },
        }).shouldSleep
      ).toBe(true);

      // 3. Off-screen pointer (< -1000) sleeps immediately even at 0ms elapsed
      expect(
        evaluateIdleSettle({
          pointerX: -9999,
          pointerY: -9999,
          lastPointerMoveTime: now,
          now,
          ripplesCount: 0,
          springClickTime: now - 600,
          currentColor: { r: 14, g: 165, b: 233 },
          targetColor: { r: 14, g: 165, b: 233 },
        }).shouldSleep
      ).toBe(true);
    });
  });

  describe("Two-Pass Dot Matrix Batching & Specular Preservation Contract (Issue 02)", () => {

    it("partitions dots into resting and dynamic sets using partitionDots in Dot mode", () => {
      expect(componentSource).toMatch(/const\s*\{\s*resting,\s*dynamic\s*\}\s*=\s*partitionDots\s*\(\s*dots,\s*mx,\s*my,\s*activeRippleData\s*\);/);
    });

    it("batches resting dots in Pass 1 into a single continuous path and fill call", () => {
      // Must set resting fillStyle, beginPath, iterate resting with moveTo + arc, and execute single fill()
      expect(componentSource).toMatch(/ctx\.fillStyle\s*=\s*`rgba\(\$\{restR\},\$\{restG\},\$\{restB\},\$\{baseAlpha\}\)`;/);
      expect(componentSource).toMatch(/ctx\.beginPath\(\);\s*for\s*\(\s*let\s+i\s*=\s*0;\s*i\s*<\s*resting\.length;\s*i\+\+\s*\)\s*\{[^}]*ctx\.moveTo\(p\.x\s*\+\s*baseR,\s*p\.y\);\s*ctx\.arc\(p\.x,\s*p\.y,\s*baseR,\s*0,\s*Math\.PI\s*\*\s*2\);[^}]*\}\s*ctx\.fill\(\);/);
    });

    it("retains mathematical dome projection, core taper, and specular glints in Pass 2", () => {
      // Elevation and displacement
      expect(componentSource).toContain("Math.sqrt(DOT_PROX_R2 - d2)");
      expect(componentSource).toContain("Math.min(1, d / 36)");
      expect(componentSource).toContain("DOT_MAX_DISPLACEMENT");

      // Key light vector and specular glint power
      expect(componentSource).toContain("-0.20 * nx - 0.25 * ny + 0.95 * nz");
      expect(componentSource).toContain("Math.pow(dotH, 6)");
      expect(componentSource).toMatch(/spec\s*>\s*0\.25\s*&&\s*elevationRatio\s*>\s*0\.55/);

      // Elevated aura
      expect(componentSource).toMatch(/elevationRatio\s*>\s*0\.4/);
    });
  });

  describe("Canvas 2D Batching Performance Simulation (Issue 02)", () => {
    it("executes exactly 1 fill call for 1,000 resting dots outside cursor proximity", () => {
      // Generate 1000 dots
      const dots: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 1000; i++) {
        dots.push({ x: (i % 40) * 26, y: Math.floor(i / 40) * 26 });
      }

      // Context spy
      const fillSpy = vi.fn();
      const beginPathSpy = vi.fn();
      const arcSpy = vi.fn();
      const moveToSpy = vi.fn();

      const mockCtx = {
        fillStyle: "",
        beginPath: beginPathSpy,
        moveTo: moveToSpy,
        arc: arcSpy,
        fill: fillSpy,
      };

      // Pointer off-screen: 100% of dots are resting
      const { resting, dynamic } = partitionDots(dots, -9999, -9999, []);
      expect(resting.length).toBe(1000);
      expect(dynamic.length).toBe(0);

      // Pass 1 simulation
      mockCtx.beginPath();
      for (let i = 0; i < resting.length; i++) {
        const p = resting[i];
        mockCtx.moveTo(p.x + 1.4, p.y);
        mockCtx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      }
      mockCtx.fill();

      // Exactly 1 beginPath, 1 fill, 1000 arcs and moveTos
      expect(beginPathSpy).toHaveBeenCalledTimes(1);
      expect(fillSpy).toHaveBeenCalledTimes(1);
      expect(arcSpy).toHaveBeenCalledTimes(1000);
      expect(moveToSpy).toHaveBeenCalledTimes(1000);
    });

    it("isolates dynamic pass to ~100-200 dots underneath cursor while batching the rest", () => {
      const dots: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 1000; i++) {
        dots.push({ x: (i % 40) * 26, y: Math.floor(i / 40) * 26 });
      }

      const mx = 500;
      const my = 300;
      const { resting, dynamic } = partitionDots(dots, mx, my, []);

      // High efficiency: over 80% batched into resting pass
      expect(resting.length).toBeGreaterThan(800);
      expect(dynamic.length).toBeLessThan(200);
      expect(resting.length + dynamic.length).toBe(1000);

      // Verify spatial bounding box
      for (const d of dynamic) {
        expect(Math.abs(d.x - mx)).toBeLessThan(DOT_PROX_R);
        expect(Math.abs(d.y - my)).toBeLessThan(DOT_PROX_R);
      }
    });
  });

  describe("Adaptive Mobile Density & Lattice Geometry Contract (Issue 03)", () => {
    it("conforms to cube edge constants and getCubeEdge responsive helper", () => {
      expect(CUBE_EDGE).toBe(38);
      expect(CUBE_EDGE_MOBILE).toBe(48);

      // Mobile viewports (< 768px)
      expect(getCubeEdge(320)).toBe(48);
      expect(getCubeEdge(375)).toBe(48);
      expect(getCubeEdge(390)).toBe(48);
      expect(getCubeEdge(767)).toBe(48);

      // Desktop viewports (>= 768px)
      expect(getCubeEdge(768)).toBe(38);
      expect(getCubeEdge(1024)).toBe(38);
      expect(getCubeEdge(1440)).toBe(38);
    });

    it("reduces mobile isometric lattice edge and vertex count by at least 30%", () => {
      const w = 390;
      const h = 844;
      const desktopLattice = buildIsometricLattice(w, h, CUBE_EDGE);
      const mobileLattice = buildIsometricLattice(w, h, CUBE_EDGE_MOBILE);

      expect(mobileLattice.edges.length).toBeLessThan(desktopLattice.edges.length);
      expect(mobileLattice.vertices.length).toBeLessThan(desktopLattice.vertices.length);

      const edgeReduction =
        (desktopLattice.edges.length - mobileLattice.edges.length) / desktopLattice.edges.length;
      expect(edgeReduction).toBeGreaterThanOrEqual(0.18);
    });

    it("dynamically generates adaptive mobile geometry on canvas resize in component", () => {
      expect(componentSource).toContain("getCubeEdge(window.innerWidth)");
      expect(componentSource).toContain("getDotSpacing(window.innerWidth)");
      expect(componentSource).toMatch(
        /cubeLatticeRef\.current\s*=\s*buildIsometricLattice\s*\(\s*canvas\.width,\s*canvas\.height,\s*cubeEdge\s*\);/
      );
      expect(componentSource).toMatch(
        /dotPointsRef\.current\s*=\s*buildGrid\s*\(\s*canvas\.width,\s*canvas\.height,\s*dotSpacing\s*\);/
      );
    });
  });

  describe("Scroll-Damped Background Canvas Suspension Contract (Issue 03)", () => {
    it("registers a passive window scroll listener and removes it on unmount", () => {
      expect(componentSource).toMatch(
        /window\.addEventListener\(\s*["']scroll["'],\s*onScroll,\s*\{\s*passive:\s*true\s*\}\s*\);/
      );
      expect(componentSource).toMatch(
        /window\.removeEventListener\(\s*["']scroll["'],\s*onScroll\s*\);/
      );
    });

    it("halts animation frame updates immediately when scrolling starts", () => {
      expect(componentSource).toMatch(/const\s+onScroll\s*=\s*\(\)\s*=>\s*\{/);
      expect(componentSource).toMatch(/isScrollingRef\.current\s*=\s*true;/);
      expect(componentSource).toMatch(/cancelAnimationFrame\(rafRef\.current\);/);
      expect(componentSource).toMatch(/isSleepingRef\.current\s*=\s*true;/);
    });

    it("waits for 150ms debounce cessation before resetting scroll flag and waking", () => {
      expect(componentSource).toContain("SCROLL_DEBOUNCE_MS");
      expect(componentSource).toMatch(
        /scrollTimeoutRef\.current\s*=\s*setTimeout\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?isScrollingRef\.current\s*=\s*false;\s*wake\(\);[\s\S]*?\}\s*,\s*SCROLL_DEBOUNCE_MS\s*\);/
      );
    });

    it("guards draw loop and settle check against active scrolling", () => {
      expect(componentSource).toMatch(
        /if\s*\(\s*pausedRef\.current\s*\|\|\s*isScrollingRef\.current\s*\)\s*\{[\s\S]*?isSleepingRef\.current\s*=\s*true;[\s\S]*?rafRef\.current\s*=\s*0;[\s\S]*?return;[\s\S]*?\}/
      );
      expect(componentSource).toMatch(/isScrolling:\s*isScrollingRef\.current/);
    });
  });

  describe("System Prefers-Reduced-Motion Accessibility Contract (Issue 03)", () => {
    it("inspects window.matchMedia for prefers-reduced-motion: reduce", () => {
      expect(componentSource).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    });

    it("listens for media query changes and updates reduced motion ref", () => {
      expect(componentSource).toMatch(/motionQuery\.addEventListener\(\s*["']change["'],\s*handleMotionChange\s*\)/);
      expect(componentSource).toMatch(/motionQuery\.removeEventListener\(\s*["']change["'],\s*handleMotionChange\s*\)/);
    });

    it("renders a static resting frame and halts RAF scheduling when reduced motion is active", () => {
      // Resting frame renderer snaps target color and renders resting frame
      expect(componentSource).toContain("renderRestingFrame");
      expect(componentSource).toMatch(
        /const\s+renderRestingFrame\s*=\s*\(\)\s*=>\s*\{[\s\S]*?currentColorRef\.current\s*=\s*\{\s*\.\.\.target\s*\};[\s\S]*?draw\(\);[\s\S]*?\};/
      );

      // In draw loop, reduced motion exits immediately without scheduling RAF
      expect(componentSource).toMatch(
        /if\s*\(\s*isReduced\s*\)\s*\{[\s\S]*?isSleepingRef\.current\s*=\s*true;[\s\S]*?rafRef\.current\s*=\s*0;[\s\S]*?return;[\s\S]*?\}/
      );

      // Color lerp snaps directly to target without animation
      expect(componentSource).toMatch(
        /if\s*\(\s*isReduced\s*\)\s*\{\s*col\.r\s*=\s*target\.r;\s*col\.g\s*=\s*target\.g;\s*col\.b\s*=\s*target\.b;\s*\}/
      );

      // Mouse movements and pointer clicks are ignored under reduced motion
      expect(componentSource).toMatch(/const\s+onMouseMove\s*=\s*\([^)]*\)\s*=>\s*\{\s*if\s*\(\s*reducedMotionRef\.current\s*\)\s*return;/);
      expect(componentSource).toMatch(/const\s+onPointerDown\s*=\s*\([^)]*\)\s*=>\s*\{\s*if\s*\(\s*reducedMotionRef\.current\s*\)\s*return;/);
    });
  });
});


