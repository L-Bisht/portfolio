import { useEffect, useRef, useCallback } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
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
const MOUSE_REPEL_RADIUS = 90;
const MOUSE_REPEL_FORCE = 0.04;
const RETURN_FORCE = 0.03;
const DAMPING = 0.88;
const RIPPLE_MAX_RADIUS = 140;
const RIPPLE_EXPAND_SPEED = 3.5;
const RIPPLE_FADE_SPEED = 0.018;

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeParticle(width: number, height: number): Particle {
  const x = Math.random() * width;
  const y = Math.random() * height;
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    baseX: x,
    baseY: y,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.15,
  };
}

// ─── component ────────────────────────────────────────────────────────────────

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef<boolean>(false);

  // ── init particles ──────────────────────────────────────────────────────────
  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(width, height)
    );
  }, []);

  // ── handle click → spawn ripple ─────────────────────────────────────────────
  const handleClick = useCallback((e: MouseEvent) => {
    ripplesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: RIPPLE_MAX_RADIUS,
      opacity: 0.6,
    });
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
      isDarkRef.current = isDark;

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
        // mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
          const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
          p.vx += (dx / dist) * force * MOUSE_REPEL_FORCE * 10;
          p.vy += (dy / dist) * force * MOUSE_REPEL_FORCE * 10;
        }

        // return to base
        p.vx += (p.baseX - p.x) * RETURN_FORCE;
        p.vy += (p.baseY - p.y) * RETURN_FORCE;

        // damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(148, 163, 184, ${p.opacity})`
          : `rgba(100, 116, 139, ${p.opacity * 0.7})`;
        ctx.fill();
      }

      // ── draw connections ──────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            const alpha = (1 - dist / CONNECT_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = isDark
              ? `rgba(148, 163, 184, ${alpha})`
              : `rgba(100, 116, 139, ${alpha * 0.6})`;
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
          : `rgba(99, 102, 241, ${r.opacity})`;
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
