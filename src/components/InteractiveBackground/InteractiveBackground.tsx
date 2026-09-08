import { useEffect, useRef, useState, useCallback } from "react";

import {
  buildIsometricLattice,
  CUBE_EDGE,
  CUBE_PROX_R,
  CUBE_PROX_R2,
  type IsometricLattice,
} from "./isometricLattice";

// ─── types ────────────────────────────────────────────────────────────────────

export type PatternMode = "cubes" | "dots";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface GridPoint {
  x: number;
  y: number;
}

interface ClickRipple {
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
}

interface ActiveRippleData {
  x: number;
  y: number;
  radius: number;
  fade: number;
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

// Dot matrix constants
const DOT_SPACING     = 26;   // px between dot centres
const DOT_BASE_R      = 1.4;  // resting dot radius
const DOT_MAX_R       = 3.2;  // max radius under cursor
const DOT_PROX_R      = 160;  // px proximity influence radius
const DOT_PROX_R2     = DOT_PROX_R * DOT_PROX_R;

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

interface InteractiveBackgroundProps {
  activeSectionId?: string;
}

export default function InteractiveBackground({
  activeSectionId = "home",
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);
  const pausedRef = useRef(false);

  // Precomputed geometry — rebuilt on resize only
  const cubeLatticeRef = useRef<IsometricLattice>({ edges: [], vertices: [] });
  const dotPointsRef   = useRef<GridPoint[]>([]);

  // Active click ripples array
  const ripplesRef = useRef<ClickRipple[]>([]);

  // Smoothly lerped accent colour
  const currentColorRef = useRef<RGB>({ ...DEFAULT_COLOR });

  // Track activeSectionId in a ref to avoid stale closures in the draw loop
  const activeSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
  }, [activeSectionId]);

  // Mode state defaults to "cubes" per spec
  const [mode, setMode] = useState<PatternMode>("cubes");
  const modeRef = useRef<PatternMode>("cubes");
  const setPatternMode = useCallback((m: PatternMode) => {
    modeRef.current = m;
    setMode(m);
  }, []);

  // ── main effect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── resize: size canvas + rebuild geometry ───────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cubeLatticeRef.current = buildIsometricLattice(canvas.width, canvas.height, CUBE_EDGE);
      dotPointsRef.current   = buildGrid(canvas.width, canvas.height, DOT_SPACING);
    };
    resize();

    // ── mouse & click tracking ────────────────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = ()              => { mouseRef.current = { x: -9999, y: -9999 }; };

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Exclude clicks directly on the bottom pattern switcher pill
      if (target && target.closest("#bg-switcher-cubes, #bg-switcher-dots")) {
        return;
      }
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 0.85;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now(),
        duration: RIPPLE_DURATION,
        maxRadius: maxR,
      });
      // Cap ripples array at 5 to maintain high efficiency
      if (ripplesRef.current.length > 5) {
        ripplesRef.current.shift();
      }
    };

    window.addEventListener("mousemove",   onMouseMove);
    window.addEventListener("mouseleave",  onMouseLeave);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize",      resize);

    // ── IntersectionObserver — pause RAF when canvas is off-screen ───────────
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // ── animation loop ───────────────────────────────────────────────────────
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (pausedRef.current) return;

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

      // ── colour lerp (section accent) ──────────────────────────────────────
      const target  = THEME_COLORS[activeSectionIdRef.current] ?? DEFAULT_COLOR;
      const col     = currentColorRef.current;
      col.r = lerpChannel(col.r, target.r, 0.05);
      col.g = lerpChannel(col.g, target.g, 0.05);
      col.b = lerpChannel(col.b, target.b, 0.05);
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

        // Balanced resting vs hovered visibility values (darker, richer hover definition)
        const restingEdgeAlpha   = isDark ? 0.20 : 0.16;
        const peakEdgeAlpha      = isDark ? 0.70 : 0.68;
        const restingEdgeWidth   = 0.85;
        const peakEdgeWidth      = isDark ? 1.50 : 1.45;

        const restingVertexAlpha = isDark ? 0.28 : 0.24;
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

      // ── MODE 2: Geometric Dot Matrix ──────────────────────────────────────
      if (currentMode === "dots") {
        const dots = dotPointsRef.current;
        const baseAlpha = isDark ? 0.22 : 0.18;
        const peakAlpha = isDark ? 0.70 : 0.65;
        const baseR = DOT_BASE_R;
        const maxR = DOT_MAX_R;
        const hoverR = isDark ? cr : Math.round(cr * 0.72);
        const hoverG = isDark ? cg : Math.round(cg * 0.72);
        const hoverB = isDark ? cb : Math.round(cb * 0.82);

        for (let i = 0; i < dots.length; i++) {
          const p = dots[i];
          let hoverFactor = 0;
          let rippleFactor = 0;

          if (mx > -1000) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < DOT_PROX_R2) {
              const norm = 1 - Math.sqrt(d2) / DOT_PROX_R;
              hoverFactor = norm * norm * (3 - 2 * norm);
            }
          }

          if (activeRippleData.length > 0) {
            for (let j = 0; j < activeRippleData.length; j++) {
              const rip = activeRippleData[j];
              const dRip = Math.hypot(p.x - rip.x, p.y - rip.y);
              const delta = Math.abs(dRip - rip.radius);
              if (delta < 55) {
                const wNorm = 1 - delta / 55;
                const wFactor = wNorm * wNorm * (3 - 2 * wNorm) * rip.fade;
                if (wFactor > rippleFactor) {
                  rippleFactor = wFactor;
                }
              }
            }
          }

          const intensity = Math.min(1, hoverFactor + rippleFactor * 0.85);
          const radius = baseR + intensity * (maxR - baseR);
          const alpha = baseAlpha + intensity * (peakAlpha - baseAlpha);
          const pr = Math.round(lerpChannel(cr, hoverR, intensity));
          const pg = Math.round(lerpChannel(cg, hoverG, intensity));
          const pb = Math.round(lerpChannel(cb, hoverB, intensity));

          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${alpha})`;
          ctx.fill();
        }

        if (activeRippleData.length > 0) {
          for (let j = 0; j < activeRippleData.length; j++) {
            const rip = activeRippleData[j];
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hoverR},${hoverG},${hoverB},${rip.fade * (isDark ? 0.20 : 0.15)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
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
    display:         "flex",
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
