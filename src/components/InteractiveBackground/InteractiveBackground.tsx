import { useEffect, useRef, useState, useCallback } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

type PatternMode = "grid" | "dots";

interface RGB {
  r: number;
  g: number;
  b: number;
}

/** A precomputed grid point used by both renderers */
interface GridPoint {
  x: number;
  y: number;
}

// ─── section accent colors ────────────────────────────────────────────────────

const THEME_COLORS: Record<string, RGB> = {
  home:       { r: 99,  g: 102, b: 241 }, // indigo-500
  about:      { r: 99,  g: 102, b: 241 }, // indigo-500
  skills:     { r: 6,   g: 182, b: 212 }, // cyan-500
  experience: { r: 16,  g: 185, b: 129 }, // emerald-500
  projects:   { r: 139, g: 92,  b: 246 }, // violet-500
  contact:    { r: 99,  g: 102, b: 241 }, // indigo-500
};

const DEFAULT_COLOR: RGB = THEME_COLORS.home;

// ─── grid constants ───────────────────────────────────────────────────────────

const GRID_CELL       = 28;   // px between grid lines
const JUNCTION_ARM    = 3;    // px each side of the + crosshair
const SPOTLIGHT_R     = 420;  // px radius of the ambient cursor spotlight

// ─── dot constants ────────────────────────────────────────────────────────────

const DOT_SPACING     = 26;   // px between dot centres
const DOT_BASE_R      = 1.4;  // resting dot radius
const DOT_MAX_R       = 3.6;  // max radius under cursor
const DOT_PROX_R      = 170;  // px proximity influence radius
const DOT_PROX_R2     = DOT_PROX_R * DOT_PROX_R; // squared, avoids sqrt in loop

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Build a flat array of (x, y) grid intersection points for the canvas size. */
function buildGrid(w: number, h: number, spacing: number): GridPoint[] {
  const pts: GridPoint[] = [];
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;
  // Offset so the grid tiles seamlessly
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
  const gridPointsRef = useRef<GridPoint[]>([]);
  const dotPointsRef  = useRef<GridPoint[]>([]);

  // Smoothly lerped accent colour
  const currentColorRef = useRef<RGB>({ ...DEFAULT_COLOR });

  // Track activeSectionId in a ref to avoid stale closures in the draw loop
  const activeSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
  }, [activeSectionId]);

  const [mode, setMode] = useState<PatternMode>("grid");
  const modeRef = useRef<PatternMode>("grid");
  // Keep modeRef in sync so the RAF loop reads the latest value without re-subscribing
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
      gridPointsRef.current = buildGrid(canvas.width, canvas.height, GRID_CELL);
      dotPointsRef.current  = buildGrid(canvas.width, canvas.height, DOT_SPACING);
    };
    resize();

    // ── mouse tracking ───────────────────────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = ()              => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize",     resize);

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

      // ── shared: ambient cursor spotlight ─────────────────────────────────
      const mx = mouse.x;
      const my = mouse.y;
      if (mx > -1000) {
        const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, SPOTLIGHT_R);
        if (isDark) {
          spotlight.addColorStop(0,    `rgba(${cr},${cg},${cb},0.12)`);
          spotlight.addColorStop(0.40, `rgba(${cr},${cg},${cb},0.05)`);
          spotlight.addColorStop(1,    `rgba(0,0,0,0)`);
        } else {
          spotlight.addColorStop(0,    `rgba(${cr},${cg},${cb},0.08)`);
          spotlight.addColorStop(0.40, `rgba(${cr},${cg},${cb},0.03)`);
          spotlight.addColorStop(1,    `rgba(255,255,255,0)`);
        }
        ctx.fillStyle = spotlight;
        ctx.fillRect(0, 0, w, h);
      }

      // ── MODE 1: Blueprint Hairline Grid ───────────────────────────────────
      if (currentMode === "grid") {
        const lineAlpha    = isDark ? 0.10 : 0.07;
        const junctionAlpha = isDark ? 0.22 : 0.14;

        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${lineAlpha})`;
        ctx.lineWidth   = 0.75;

        // Draw grid lines column by column and row by row using the
        // precomputed intersection points. We extract unique x/y values from
        // the flat grid to draw full-viewport lines rather than segments.
        const pts   = gridPointsRef.current;
        if (pts.length === 0) {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        // Collect unique x positions (columns) and y positions (rows)
        const xSet = new Set<number>();
        const ySet = new Set<number>();
        for (const p of pts) { xSet.add(p.x); ySet.add(p.y); }

        ctx.beginPath();
        for (const x of xSet) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (const y of ySet) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Draw + junction marks at each intersection
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${junctionAlpha})`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        for (const p of pts) {
          // horizontal arm
          ctx.moveTo(p.x - JUNCTION_ARM, p.y);
          ctx.lineTo(p.x + JUNCTION_ARM, p.y);
          // vertical arm
          ctx.moveTo(p.x, p.y - JUNCTION_ARM);
          ctx.lineTo(p.x, p.y + JUNCTION_ARM);
        }
        ctx.stroke();
      }

      // ── MODE 2: Geometric Dot Matrix ──────────────────────────────────────
      if (currentMode === "dots") {
        const dots = dotPointsRef.current;
        const mx2  = mouse.x;
        const my2  = mouse.y;

        for (const p of dots) {
          const dx   = p.x - mx2;
          const dy   = p.y - my2;
          const dist2 = dx * dx + dy * dy;

          let radius  = DOT_BASE_R;
          let alpha   = isDark ? 0.18 : 0.12;

          if (dist2 < DOT_PROX_R2) {
            // 0 at edge of influence, 1 at cursor
            const t  = 1 - Math.sqrt(dist2) / DOT_PROX_R;
            radius   = DOT_BASE_R + (DOT_MAX_R - DOT_BASE_R) * t;
            // Brighter + coloured near cursor
            alpha    = isDark
              ? 0.18 + 0.62 * t
              : 0.12 + 0.48 * t;

            // Coloured glow fill for proximate dots
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.fill();
          } else {
            // Resting neutral dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark
              ? `rgba(148,163,184,${alpha})`   // slate-400
              : `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.fill();
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize",     resize);
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
    background: "rgba(99,102,241,0.22)",
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
        {/* Grid mode button */}
        <button
          id="bg-switcher-grid"
          aria-label="Blueprint hairline grid"
          aria-pressed={mode === "grid"}
          style={{ ...btnBase, ...(mode === "grid" ? btnActive : {}) }}
          onClick={() => setPatternMode("grid")}
        >
          {/* Blueprint grid icon */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <line x1="0" y1="4.5"  x2="13" y2="4.5"  stroke="currentColor" strokeWidth="0.9" />
            <line x1="0" y1="8.5"  x2="13" y2="8.5"  stroke="currentColor" strokeWidth="0.9" />
            <line x1="4.5" y1="0"  x2="4.5" y2="13"  stroke="currentColor" strokeWidth="0.9" />
            <line x1="8.5" y1="0"  x2="8.5" y2="13"  stroke="currentColor" strokeWidth="0.9" />
          </svg>
          Grid
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
