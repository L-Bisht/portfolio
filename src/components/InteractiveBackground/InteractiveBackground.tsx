import { useEffect, useRef, useCallback } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  /** Velocity accumulated from mouse repulsion (decays each frame) */
  vx: number;
  vy: number;
  /** Ambient drift speed components — constant, unaffected by repulsion */
  driftVx: number;
  driftVy: number;
  radius: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

// ─── constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 80;
const CONNECT_DISTANCE = 120;

// Drift — each particle autonomously drifts upward + slightly sideways
const DRIFT_SPEED_MIN = 0.12; // px/frame upward
const DRIFT_SPEED_MAX = 0.38;
const DRIFT_LATERAL_MAX = 0.15; // px/frame left/right wobble

// Mouse repulsion
const MOUSE_REPEL_RADIUS = 100;
const MOUSE_REPEL_FORCE = 0.05;
const REPEL_DAMPING = 0.90; // velocity decay per frame

// Click burst
const RIPPLE_MAX_RADIUS = 160;
const RIPPLE_EXPAND_SPEED = 3.5;
const RIPPLE_FADE_SPEED = 0.016;
const BURST_RADIUS = 180; // particles within this dist get kicked outward
const BURST_FORCE = 4.0;

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    // Spread particles across the full height; some start below so they
    // drift in from the bottom on load — randomise y uniformly.
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    // Upward drift: negative vy (canvas y increases downward)
    driftVy: -(Math.random() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN) + DRIFT_SPEED_MIN),
    driftVx: (Math.random() * 2 - 1) * DRIFT_LATERAL_MAX,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.2,
  };
}

/** Wrap a particle that has drifted off-screen back to the opposite edge. */
function wrapParticle(p: Particle, w: number, h: number) {
  const margin = 10;
  if (p.y < -margin) {
    // Went off the top — reappear at the bottom with a fresh x position
    p.y = h + margin;
    p.x = Math.random() * w;
  }
  if (p.x < -margin) p.x = w + margin;
  if (p.x > w + margin) p.x = -margin;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);

  // ── init particles ──────────────────────────────────────────────────────────
  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(width, height)
    );
  }, []);

  // ── handle click → spawn ripple + burst nearby particles ───────────────────
  const handleClick = useCallback((e: MouseEvent) => {
    ripplesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: RIPPLE_MAX_RADIUS,
      opacity: 0.65,
    });

    // Kick particles outward from the click point
    for (const p of particlesRef.current) {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < BURST_RADIUS && dist > 0) {
        const strength = (1 - dist / BURST_RADIUS) * BURST_FORCE;
        p.vx += (dx / dist) * strength;
        p.vy += (dy / dist) * strength;
      }
    }
  }, []);

  // ── main effect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();

    // track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", resize);

    // ── animation loop ──────────────────────────────────────────────────────
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, w, h);

      // ── spotlight gradient ────────────────────────────────────────────────
      if (mouse.x > 0) {
        const spotlight = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          340
        );
        if (isDark) {
          spotlight.addColorStop(0, "rgba(99, 102, 241, 0.10)");
          spotlight.addColorStop(0.45, "rgba(99, 102, 241, 0.04)");
          spotlight.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          spotlight.addColorStop(0, "rgba(99, 102, 241, 0.07)");
          spotlight.addColorStop(0.45, "rgba(99, 102, 241, 0.025)");
          spotlight.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = spotlight;
        ctx.fillRect(0, 0, w, h);
      }

      // ── update + draw particles ───────────────────────────────────────────
      const particles = particlesRef.current;
      for (const p of particles) {
        // ── 1. Mouse repulsion (adds to transient velocity vx/vy) ─────────
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
          const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
          p.vx += (dx / dist) * force * MOUSE_REPEL_FORCE * 12;
          p.vy += (dy / dist) * force * MOUSE_REPEL_FORCE * 12;
        }

        // ── 2. Decay transient velocity ────────────────────────────────────
        p.vx *= REPEL_DAMPING;
        p.vy *= REPEL_DAMPING;

        // ── 3. Apply drift + transient velocity ────────────────────────────
        p.x += p.driftVx + p.vx;
        p.y += p.driftVy + p.vy;

        // ── 4. Wrap around canvas edges ────────────────────────────────────
        wrapParticle(p, w, h);

        // ── 5. Draw dot ────────────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(148, 163, 184, ${p.opacity})`           // slate-400
          : `rgba(67, 56, 202, ${p.opacity * 0.75})`;     // indigo-700 — deeper + visible
        ctx.fill();
      }

      // ── draw connections ──────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const cdx = a.x - b.x;
          const cdy = a.y - b.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < CONNECT_DISTANCE) {
            const alpha = (1 - cdist / CONNECT_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = isDark
              ? `rgba(148, 163, 184, ${alpha})`
              : `rgba(67, 56, 202, ${alpha * 0.65})`; // indigo-700 connections
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // ── draw ripples ──────────────────────────────────────────────────────
      ripplesRef.current = ripplesRef.current.filter((r) => r.opacity > 0);
      for (const r of ripplesRef.current) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(129, 140, 248, ${r.opacity})`
          : `rgba(67, 56, 202, ${r.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        r.radius += RIPPLE_EXPAND_SPEED;
        r.opacity -= RIPPLE_FADE_SPEED;
        if (r.radius > r.maxRadius) r.opacity = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, [initParticles, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
