import { useEffect, useRef, useState, useCallback } from "react";
import { usePattern, type PatternMode } from "../../context/PatternContext";
export type { PatternMode };

import {
  buildIsometricLattice,
  CUBE_EDGE,
  CUBE_PROX_R,
  CUBE_PROX_R2,
  type IsometricLattice,
} from "./isometricLattice";
import {
  DOT_SPACING,
  DOT_BASE_R,
  DOT_APEX_SCALE,
  DOT_MAX_DISPLACEMENT,
  DOT_PROX_R,
  DOT_PROX_R2,
  RIPPLE_WAVE_W as DOT_RIPPLE_WAVE_W,
  RIPPLE_PUSH_MAX,
  COLOR_LERP_TOLERANCE,
  calculateSpringFactor,
  calculateDotRadius,
  evaluateIdleSettle,
  partitionDots,
  type GridPoint,
  type ActiveRippleData,
} from "./dotMatrixPhysics";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ClickRipple {
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
}

// ─── section accent colors ────────────────────────────────────────────────────

const THEME_COLORS: Record<string, RGB> = {
  home:       { r: 14,  g: 165, b: 233 }, // sky-500
  about:      { r: 20,  g: 184, b: 166 }, // teal-500 / cyan
  skills:     { r: 6,   g: 182, b: 212 }, // cyan-500
  experience: { r: 16,  g: 185, b: 129 }, // emerald-500
  projects:   { r: 37,  g: 99,  b: 235 }, // cobalt / blue-600
  contact:    { r: 14,  g: 165, b: 233 }, // sky-500
};

const DEFAULT_COLOR: RGB = THEME_COLORS.home;

// ─── geometry & wave constants ────────────────────────────────────────────────

const SPOTLIGHT_R     = 380;  // px radius of the soft ambient cursor spotlight
const RIPPLE_WAVE_W   = 65;   // px thickness of the expanding ripple wavefront ring
const RIPPLE_DURATION = 1100; // ms duration of click ripple propagation


/** Build a flat array of (x, y) grid intersection points for the dot matrix renderer */
function buildGrid(w: number, h: number, spacing: number): GridPoint[] {
  const pts: GridPoint[] = [];
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;
  const offX = (w % spacing) / 2;
  const offY = (h % spacing) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push({ x: offX + c * spacing, y: offY + r * spacing });
    }
  }
  return pts;
}

/** Linear interpolation of a colour channel */
function lerpChannel(current: number, target: number, t: number): number {
  return current + (target - current) * t;
}

// ─── component ────────────────────────────────────────────────────────────────

export interface InteractiveBackgroundProps {
  activeSectionId?: string;
  patternMode?: PatternMode;
  onPatternModeChange?: (mode: PatternMode) => void;
}

export default function InteractiveBackground({
  activeSectionId = "home",
  patternMode: controlledMode,
  onPatternModeChange,
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);
  const pausedRef = useRef(false);

  // Idle sleep lifecycle refs
  const isSleepingRef        = useRef(false);
  const lastPointerTimeRef   = useRef(performance.now());
  const wakeRef              = useRef<() => void>(() => {});

  // Precomputed geometry — rebuilt on resize only
  const cubeLatticeRef = useRef<IsometricLattice>({ edges: [], vertices: [] });
  const dotPointsRef   = useRef<GridPoint[]>([]);

  // Active click ripples array
  const ripplesRef = useRef<ClickRipple[]>([]);

  // Pointer click timestamp for 3D dome damped spring rebound
  const springClickTimeRef = useRef<number>(-99999);

  // Smoothly lerped accent colour
  const currentColorRef = useRef<RGB>({ ...DEFAULT_COLOR });

  // Track activeSectionId in a ref to avoid stale closures in the draw loop
  const activeSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
    wakeRef.current();
  }, [activeSectionId]);

  // Pattern mode state: synchronized with context and optional controlled prop
  const patternContext = usePattern();
  const activeMode = controlledMode ?? patternContext.patternMode;

  const [mode, setMode] = useState<PatternMode>(activeMode);
  const modeRef = useRef<PatternMode>(activeMode);

  useEffect(() => {
    modeRef.current = activeMode;
    setMode(activeMode);
    wakeRef.current();
  }, [activeMode]);

  const setPatternMode = useCallback((m: PatternMode) => {
    modeRef.current = m;
    setMode(m);
    wakeRef.current();
    if (onPatternModeChange) {
      onPatternModeChange(m);
    } else {
      patternContext.setPatternMode(m);
    }
  }, [onPatternModeChange, patternContext]);

  // ── main effect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── wake helper: resume RAF loop from idle sleep ─────────────────────────
    const wake = () => {
      if (isSleepingRef.current) {
        isSleepingRef.current = false;
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    wakeRef.current = wake;

    // ── resize: size canvas + rebuild geometry ───────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cubeLatticeRef.current = buildIsometricLattice(canvas.width, canvas.height, CUBE_EDGE);
      dotPointsRef.current   = buildGrid(canvas.width, canvas.height, DOT_SPACING);
      wake();
    };
    resize();

    // ── mouse & click tracking ────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastPointerTimeRef.current = performance.now();
      wake();
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      wake();
    };

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Exclude clicks directly on pattern switcher controls
      if (
        target &&
        target.closest(
          "#bg-switcher-cubes, #bg-switcher-dots, #mobile-header-pattern-toggle"
        )
      ) {
        return;
      }
      const now = performance.now();
      springClickTimeRef.current = now;

      const maxR = Math.max(window.innerWidth, window.innerHeight) * 0.85;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: now,
        duration: RIPPLE_DURATION,
        maxRadius: maxR,
      });
      // Cap ripples array at 5 to maintain high efficiency
      if (ripplesRef.current.length > 5) {
        ripplesRef.current.shift();
      }
      wake();
    };

    window.addEventListener("mousemove",   onMouseMove);
    window.addEventListener("mouseleave",  onMouseLeave);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize",      resize);

    // ── Theme toggle mutation observer — wake canvas when theme class changes
    let themeObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      themeObserver = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.type === "attributes" && m.attributeName === "class") {
            wake();
            break;
          }
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    // ── IntersectionObserver — pause RAF when canvas is off-screen ───────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = !entry.isIntersecting;
        if (entry.isIntersecting) {
          wake();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // ── animation loop ───────────────────────────────────────────────────────
    const draw = () => {
      if (pausedRef.current) {
        isSleepingRef.current = true;
        rafRef.current = 0;
        return;
      }

      const w     = canvas.width;
      const h     = canvas.height;
      const mouse = mouseRef.current;
      const isDark = document.documentElement.classList.contains("dark");
      const currentMode = modeRef.current;
      const now = performance.now();

      // ── ripple state management ───────────────────────────────────────────
      ripplesRef.current = ripplesRef.current.filter(r => now - r.startTime < r.duration);
      const activeRipples = ripplesRef.current;
      const activeRippleData: ActiveRippleData[] = [];
      for (let i = 0; i < activeRipples.length; i++) {
        const rip = activeRipples[i];
        const t = (now - rip.startTime) / rip.duration;
        const radius = rip.maxRadius * Math.pow(t, 0.82);
        const fade = Math.pow(1 - t, 1.3);
        activeRippleData.push({ x: rip.x, y: rip.y, radius, fade });
      }

      // ── colour lerp (section accent) with convergence snap ────────────────
      const target  = THEME_COLORS[activeSectionIdRef.current] ?? DEFAULT_COLOR;
      const col     = currentColorRef.current;
      const diffR = Math.abs(col.r - target.r);
      const diffG = Math.abs(col.g - target.g);
      const diffB = Math.abs(col.b - target.b);
      if (diffR < COLOR_LERP_TOLERANCE && diffG < COLOR_LERP_TOLERANCE && diffB < COLOR_LERP_TOLERANCE) {
        col.r = target.r;
        col.g = target.g;
        col.b = target.b;
      } else {
        col.r = lerpChannel(col.r, target.r, 0.05);
        col.g = lerpChannel(col.g, target.g, 0.05);
        col.b = lerpChannel(col.b, target.b, 0.05);
      }
      const cr = Math.round(col.r);
      const cg = Math.round(col.g);
      const cb = Math.round(col.b);

      ctx.clearRect(0, 0, w, h);

      // ── shared: balanced ambient cursor spotlight ─────────────────────────
      const mx = mouse.x;
      const my = mouse.y;
      if (mx > -1000) {
        const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, SPOTLIGHT_R);
        if (isDark) {
          spotlight.addColorStop(0,    `rgba(${cr},${cg},${cb},0.06)`);
          spotlight.addColorStop(0.45, `rgba(${cr},${cg},${cb},0.02)`);
          spotlight.addColorStop(1,    `rgba(0,0,0,0)`);
        } else {
          spotlight.addColorStop(0,    `rgba(${cr},${cg},${cb},0.04)`);
          spotlight.addColorStop(0.45, `rgba(${cr},${cg},${cb},0.015)`);
          spotlight.addColorStop(1,    `rgba(255,255,255,0)`);
        }
        ctx.fillStyle = spotlight;
        ctx.fillRect(0, 0, w, h);
      }

      // ── MODE 1: Isometric Cubes Wireframe Lattice ─────────────────────────
      if (currentMode === "cubes") {
        const lattice = cubeLatticeRef.current;
        const edges = lattice.edges;
        const vertices = lattice.vertices;

        if (edges.length === 0) {
          return;
        }

        // Balanced resting vs hovered visibility values
        const restingEdgeAlpha   = isDark ? 0.17 : 0.15;
        const peakEdgeAlpha      = isDark ? 0.70 : 0.68;
        const restingEdgeWidth   = 0.85;
        const peakEdgeWidth      = isDark ? 1.50 : 1.45;

        const restingVertexAlpha = isDark ? 0.24 : 0.20;
        const peakVertexAlpha    = isDark ? 0.80 : 0.74;
        const restingVertexR     = 1.2;
        const peakVertexR        = 2.4;

        // In light mode, deepen color tone for hovered elements so lines stand out crisply
        const hoverR = isDark ? cr : Math.round(cr * 0.72);
        const hoverG = isDark ? cg : Math.round(cg * 0.72);
        const hoverB = isDark ? cb : Math.round(cb * 0.82);

        // 1. Base resting wireframe pass (single-batch stroke)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${restingEdgeAlpha})`;
        ctx.lineWidth   = restingEdgeWidth;
        ctx.beginPath();
        for (let i = 0; i < edges.length; i++) {
          const e = edges[i];
          ctx.moveTo(e.x1, e.y1);
          ctx.lineTo(e.x2, e.y2);
        }
        ctx.stroke();

        // 2. Base resting vertex junction nodes (single-batch fill)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${restingVertexAlpha})`;
        ctx.beginPath();
        for (let i = 0; i < vertices.length; i++) {
          const v = vertices[i];
          ctx.moveTo(v.x + restingVertexR, v.y);
          ctx.arc(v.x, v.y, restingVertexR, 0, Math.PI * 2);
        }
        ctx.fill();

        // 3. Dynamic Cursor Proximity & Click Ripple Illumination
        const hasMouse   = mx > -1000;
        const hasRipples = activeRippleData.length > 0;

        if (hasMouse || hasRipples) {
          // A. Glowing proximate & ripple-energized edges
          for (let i = 0; i < edges.length; i++) {
            const e = edges[i];
            let hoverFactor = 0;
            let rippleFactor = 0;

            // Cursor proximity factor
            if (hasMouse) {
              if (!(e.maxX < mx - CUBE_PROX_R || e.minX > mx + CUBE_PROX_R || e.maxY < my - CUBE_PROX_R || e.minY > my + CUBE_PROX_R)) {
                const vx = e.x2 - e.x1;
                const vy = e.y2 - e.y1;
                const wx = mx - e.x1;
                const wy = my - e.y1;
                const c1 = wx * vx + wy * vy;
                const c2 = e.len2;
                const t = c1 <= 0 ? 0 : c1 >= c2 ? 1 : c1 / c2;
                const px = e.x1 + t * vx;
                const py = e.y1 + t * vy;
                const d2 = (mx - px) * (mx - px) + (my - py) * (my - py);

                if (d2 < CUBE_PROX_R2) {
                  const dist = Math.sqrt(d2);
                  const norm = 1 - dist / CUBE_PROX_R;
                  hoverFactor = norm * norm * (3 - 2 * norm);
                }
              }
            }

            // Click ripple factor across edge midpoint
            if (hasRipples) {
              for (let j = 0; j < activeRippleData.length; j++) {
                const rip = activeRippleData[j];
                const dRip = Math.hypot(e.midX - rip.x, e.midY - rip.y);
                const delta = Math.abs(dRip - rip.radius);
                if (delta < RIPPLE_WAVE_W) {
                  const wNorm = 1 - delta / RIPPLE_WAVE_W;
                  const wFactor = wNorm * wNorm * (3 - 2 * wNorm) * rip.fade;
                  if (wFactor > rippleFactor) {
                    rippleFactor = wFactor;
                  }
                }
              }
            }

            const intensity = Math.min(1, hoverFactor + rippleFactor * 0.85);
            if (intensity > 0.02) {
              const alpha = restingEdgeAlpha + intensity * (peakEdgeAlpha - restingEdgeAlpha);
              const lineWidth = restingEdgeWidth + intensity * (peakEdgeWidth - restingEdgeWidth);
              const er = Math.round(lerpChannel(cr, hoverR, intensity));
              const eg = Math.round(lerpChannel(cg, hoverG, intensity));
              const eb = Math.round(lerpChannel(cb, hoverB, intensity));

              ctx.strokeStyle = `rgba(${er},${eg},${eb},${alpha})`;
              ctx.lineWidth   = lineWidth;
              ctx.beginPath();
              ctx.moveTo(e.x1, e.y1);
              ctx.lineTo(e.x2, e.y2);
              ctx.stroke();
            }
          }

          // B. Glowing proximate & ripple-energized vertices
          for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            let hoverFactor = 0;
            let rippleFactor = 0;

            if (hasMouse) {
              if (!(v.x < mx - CUBE_PROX_R || v.x > mx + CUBE_PROX_R || v.y < my - CUBE_PROX_R || v.y > my + CUBE_PROX_R)) {
                const dx = v.x - mx;
                const dy = v.y - my;
                const d2 = dx * dx + dy * dy;

                if (d2 < CUBE_PROX_R2) {
                  const dist = Math.sqrt(d2);
                  const norm = 1 - dist / CUBE_PROX_R;
                  hoverFactor = norm * norm * (3 - 2 * norm);
                }
              }
            }

            if (hasRipples) {
              for (let j = 0; j < activeRippleData.length; j++) {
                const rip = activeRippleData[j];
                const dRip = Math.hypot(v.x - rip.x, v.y - rip.y);
                const delta = Math.abs(dRip - rip.radius);
                if (delta < RIPPLE_WAVE_W) {
                  const wNorm = 1 - delta / RIPPLE_WAVE_W;
                  const wFactor = wNorm * wNorm * (3 - 2 * wNorm) * rip.fade;
                  if (wFactor > rippleFactor) {
                    rippleFactor = wFactor;
                  }
                }
              }
            }

            const vIntensity = Math.min(1, hoverFactor + rippleFactor * 0.85);
            if (vIntensity > 0.02) {
              const alpha = restingVertexAlpha + vIntensity * (peakVertexAlpha - restingVertexAlpha);
              const radius = restingVertexR + vIntensity * (peakVertexR - restingVertexR);
              const vr = Math.round(lerpChannel(cr, hoverR, vIntensity));
              const vg = Math.round(lerpChannel(cg, hoverG, vIntensity));
              const vb = Math.round(lerpChannel(cb, hoverB, vIntensity));

              if (vIntensity > 0.45) {
                ctx.beginPath();
                ctx.arc(v.x, v.y, radius + 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${vr},${vg},${vb},${alpha * 0.18})`;
                ctx.fill();
              }

              ctx.beginPath();
              ctx.arc(v.x, v.y, radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${vr},${vg},${vb},${alpha})`;
              ctx.fill();
            }
          }
        }

        // C. Expanding ripple wavefront ring
        if (hasRipples) {
          for (let j = 0; j < activeRippleData.length; j++) {
            const rip = activeRippleData[j];
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hoverR},${hoverG},${hoverB},${rip.fade * (isDark ? 0.22 : 0.18)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // ── MODE 2: 3D Hemispherical Dot Matrix & Kinetic Spring Bounce ────────
      if (currentMode === "dots") {
        const dots = dotPointsRef.current;
        const baseAlpha = isDark ? 0.15 : 0.20;
        const peakAlpha = isDark ? 0.88 : 0.82;
        const baseR = DOT_BASE_R;

        // Balanced resting tone: crisp and clearly visible, but slightly deeper than active hover
        const restR = isDark ? cr : Math.round(cr * 0.65);
        const restG = isDark ? cg : Math.round(cg * 0.65);
        const restB = isDark ? cb : Math.round(cb * 0.75);

        const hoverR = isDark ? cr : Math.round(cr * 0.72);
        const hoverG = isDark ? cg : Math.round(cg * 0.72);
        const hoverB = isDark ? cb : Math.round(cb * 0.82);

        // Underdamped harmonic spring factor: 0.60 on click, rebounds over ~550ms to 1.0
        const springFactor = calculateSpringFactor(now - springClickTimeRef.current);
        const numRipples = activeRippleData.length;

        // 0. Volumetric 3D Spherical Dome Ambient Under-Glow
        if (mx > -1000) {
          const glowR = DOT_PROX_R * Math.max(0.2, springFactor);
          const domeGlow = ctx.createRadialGradient(
            mx - 18,
            my - 18,
            0,
            mx,
            my,
            glowR
          );
          if (isDark) {
            domeGlow.addColorStop(0,   `rgba(${cr},${cg},${cb},0.12)`);
            domeGlow.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.05)`);
            domeGlow.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
          } else {
            domeGlow.addColorStop(0,   `rgba(${cr},${cg},${cb},0.09)`);
            domeGlow.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.03)`);
            domeGlow.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
          }
          ctx.fillStyle = domeGlow;
          ctx.beginPath();
          ctx.arc(mx, my, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // ── TWO-PASS SPATIAL BATCHING ──────────────────────────────────────
        // Pass 1: Batch all resting dots outside proximity and ripple zones into a single GPU fill call
        // Pass 2: Dynamically calculate 3D projection, displacement, and glints for proximate/ripple dots
        const { resting, dynamic } = partitionDots(dots, mx, my, activeRippleData);

        // 1. Base resting dots pass (single-batch fill call)
        ctx.fillStyle = `rgba(${restR},${restG},${restB},${baseAlpha})`;
        ctx.beginPath();
        for (let i = 0; i < resting.length; i++) {
          const p = resting[i];
          ctx.moveTo(p.x + baseR, p.y);
          ctx.arc(p.x, p.y, baseR, 0, Math.PI * 2);
        }
        ctx.fill();

        // 2. Dynamic proximate dome & ripple-energized dots pass
        for (let i = 0; i < dynamic.length; i++) {
          const p = dynamic[i];
          let domeDx = 0;
          let domeDy = 0;
          let elevationRatio = 0;
          let spec = 0;

          // 2a. 3D Hemispherical Convex Dome Projection
          if (mx > -1000) {
            const dx = p.x - mx;
            const dy = p.y - my;
            // Bounding box test for proximity radius R = 180px
            if (Math.abs(dx) < DOT_PROX_R && Math.abs(dy) < DOT_PROX_R) {
              const d2 = dx * dx + dy * dy;
              if (d2 < DOT_PROX_R2) {
                const z = Math.sqrt(DOT_PROX_R2 - d2);
                const zEff = z * springFactor;
                elevationRatio = zEff / DOT_PROX_R;

                const d = Math.sqrt(d2);
                if (d > 0.0001) {
                  // Smooth core taper: prevents apex hollowing, maintaining convex dome integrity
                  const coreTaper = Math.min(1, d / 36);
                  const disp = (zEff / DOT_PROX_R) * coreTaper * DOT_MAX_DISPLACEMENT;
                  domeDx = (dx / d) * disp;
                  domeDy = (dy / d) * disp;
                }

                // 3D Spherical surface normal lighting: key light from top-left (-0.38, -0.48, 0.79)
                const nx = dx / DOT_PROX_R;
                const ny = dy / DOT_PROX_R;
                const nz = Math.min(1, elevationRatio);
                const dotH = Math.max(0, -0.20 * nx - 0.25 * ny + 0.95 * nz);
                spec = Math.pow(dotH, 6);
              }
            }
          }

          // 2b. Kinetic Ripple Wavefront Push
          let rippleFactor = 0;
          let waveDx = 0;
          let waveDy = 0;

          if (numRipples > 0) {
            for (let j = 0; j < numRipples; j++) {
              const rip = activeRippleData[j];
              const ripDx = p.x - rip.x;
              const ripDy = p.y - rip.y;
              const dRip = Math.hypot(ripDx, ripDy);
              const delta = Math.abs(dRip - rip.radius);

              if (delta < DOT_RIPPLE_WAVE_W) {
                const wNorm = 1 - delta / DOT_RIPPLE_WAVE_W;
                const wFactor = wNorm * wNorm * (3 - 2 * wNorm) * rip.fade;
                if (wFactor > rippleFactor) {
                  rippleFactor = wFactor;
                }
                if (dRip > 0.0001) {
                  const pushMag = wFactor * RIPPLE_PUSH_MAX;
                  waveDx += (ripDx / dRip) * pushMag;
                  waveDy += (ripDy / dRip) * pushMag;
                }
              }
            }
          }

          // 2c. Render Position & Magnification Scaling
          const renderX = p.x + domeDx + waveDx;
          const renderY = p.y + domeDy + waveDy;
          const radius = calculateDotRadius(baseR, DOT_APEX_SCALE, elevationRatio, rippleFactor) + spec * 0.35;

          // 2d. Dynamic Brightness & Alpha Scaling
          const intensity = Math.min(1, elevationRatio + rippleFactor * 0.85);
          const alpha = baseAlpha + intensity * (peakAlpha - baseAlpha);

          // Apex luminance boost: lighten colors towards luminous cyan/white at peak elevation & specular glint
          const luminanceBoost = elevationRatio * 0.38 + spec * 0.45;
          let pr = Math.round(lerpChannel(restR, hoverR, intensity));
          let pg = Math.round(lerpChannel(restG, hoverG, intensity));
          let pb = Math.round(lerpChannel(restB, hoverB, intensity));

          if (isDark && elevationRatio > 0.05) {
            pr = Math.min(255, Math.round(pr + (255 - pr) * luminanceBoost * 0.4));
            pg = Math.min(255, Math.round(pg + (255 - pg) * luminanceBoost * 0.7));
            pb = Math.min(255, Math.round(pb + (255 - pb) * luminanceBoost * 0.95));
          }

          // Soft luminous depth aura for elevated beads
          if (elevationRatio > 0.4) {
            ctx.beginPath();
            ctx.arc(renderX, renderY, radius + 2.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hoverR},${hoverG},${hoverB},${alpha * 0.22})`;
            ctx.fill();
          }

          // Main dynamic dot
          ctx.beginPath();
          ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${alpha})`;
          ctx.fill();

          // Specular micro-glint highlight on upper-left quadrant
          if (spec > 0.25 && elevationRatio > 0.55) {
            ctx.beginPath();
            ctx.arc(
              renderX - radius * 0.25,
              renderY - radius * 0.25,
              radius * 0.32,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(255,255,255,${alpha * 0.75 * spec})`;
            ctx.fill();
          }
        }

        // 3. Expanding kinetic wavefront ring stroke
        if (numRipples > 0) {
          for (let j = 0; j < numRipples; j++) {
            const rip = activeRippleData[j];
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hoverR},${hoverG},${hoverB},${rip.fade * (isDark ? 0.22 : 0.16)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // ── Settle check: suspend animation frame loop when idle ──────────────
      const settleResult = evaluateIdleSettle({
        pointerX: mouse.x,
        pointerY: mouse.y,
        lastPointerMoveTime: lastPointerTimeRef.current,
        now,
        ripplesCount: ripplesRef.current.length,
        springClickTime: springClickTimeRef.current,
        currentColor: col,
        targetColor: target,
      });

      if (settleResult.shouldSleep) {
        isSleepingRef.current = true;
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Initial frame kick-off
    isSleepingRef.current = false;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      isSleepingRef.current = true;
      if (themeObserver) {
        themeObserver.disconnect();
      }
      observer.disconnect();
      window.removeEventListener("mousemove",   onMouseMove);
      window.removeEventListener("mouseleave",  onMouseLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize",      resize);
    };
  }, []); // no deps — all mutable state accessed via refs

  // ── switcher button styles ────────────────────────────────────────────────

  const pillBase: React.CSSProperties = {
    position:        "fixed",
    bottom:          "1.5rem",
    right:           "1.5rem",
    zIndex:          50,
    alignItems:      "center",
    gap:             "2px",
    padding:         "4px",
    borderRadius:    "9999px",
    backdropFilter:  "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    background:      "rgba(15,23,42,0.45)",
    border:          "1px solid rgba(148,163,184,0.12)",
    boxShadow:       "0 2px 12px rgba(0,0,0,0.3)",
    opacity:         0.55,
    transition:      "opacity 0.25s ease",
    cursor:          "default",
  };

  const btnBase: React.CSSProperties = {
    display:         "flex",
    alignItems:      "center",
    gap:             "5px",
    padding:         "5px 10px",
    borderRadius:    "9999px",
    border:          "none",
    background:      "transparent",
    color:           "rgba(226,232,240,0.7)",
    fontSize:        "11px",
    fontFamily:      "inherit",
    letterSpacing:   "0.04em",
    cursor:          "pointer",
    transition:      "background 0.18s ease, color 0.18s ease",
  };

  const btnActive: React.CSSProperties = {
    background: "rgba(14,165,233,0.22)",
    color:      "rgba(226,232,240,1)",
  };

  return (
    <>
      {/* ── Background canvas ──────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          zIndex:        0,
        }}
      />

      {/* ── Pattern switcher pill ──────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={pillBase}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
        aria-label="Background pattern switcher"
      >
        {/* Cubes mode button */}
        <button
          id="bg-switcher-cubes"
          aria-label="Isometric cubes wireframe lattice"
          aria-pressed={mode === "cubes"}
          style={{ ...btnBase, ...(mode === "cubes" ? btnActive : {}) }}
          onClick={() => setPatternMode("cubes")}
        >
          {/* Isometric wireframe cube icon */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M6.5 1.2 L11.2 3.9 L11.2 9.1 L6.5 11.8 L1.8 9.1 L1.8 3.9 Z"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <path
              d="M6.5 6.5 L6.5 11.8 M6.5 6.5 L11.2 3.9 M6.5 6.5 L1.8 3.9"
              stroke="currentColor"
              strokeWidth="0.9"
            />
          </svg>
          Cubes
        </button>

        {/* Dots mode button */}
        <button
          id="bg-switcher-dots"
          aria-label="Geometric dot matrix"
          aria-pressed={mode === "dots"}
          style={{ ...btnBase, ...(mode === "dots" ? btnActive : {}) }}
          onClick={() => setPatternMode("dots")}
        >
          {/* Dot matrix icon */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            {[2,6.5,11].flatMap(x =>
              [2,6.5,11].map(y => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="currentColor" />
              ))
            )}
          </svg>
          Dots
        </button>
      </div>
    </>
  );
}
