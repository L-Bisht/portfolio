import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useTransform, useSpring, MotionValue } from "framer-motion";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** Extra inline styles forwarded to the outer wrapper */
  style?: CSSProperties;
  /** aria-label forwarded to the wrapper */
  "aria-label"?: string;
}

/**
 * GlowCard – a premium glassmorphic card wrapper that:
 *  - elevates slightly on hover (translateY + shadow boost)
 *  - renders a radial border-glow that tracks the exact mouse position in real time
 *
 * The glow is implemented as a pseudo-border using a motion.div that sits behind
 * the card surface. Its radial gradient is driven by Framer Motion MotionValues
 * (springs), keeping all DOM style updates entirely off the React render cycle.
 */

/** Inner component that consumes the derived MotionValues. */
function GlowLayer({
  mxPct,
  myPct,
  glowOpacity,
}: {
  mxPct: MotionValue<string>;
  myPct: MotionValue<string>;
  glowOpacity: MotionValue<number>;
}) {
  const background = useTransform(
    [mxPct, myPct],
    ([x, y]: string[]) =>
      `radial-gradient(350px circle at ${x} ${y}, rgba(99,102,241,0.5), transparent 70%)`
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-[-1px] rounded-2xl"
      style={{ background, opacity: glowOpacity }}
    />
  );
}

const GlowCard = ({
  children,
  className = "",
  style,
  "aria-label": ariaLabel,
}: GlowCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse position (0–1 relative to card dimensions)
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const isHoveringMV = useMotionValue(0);

  // Spring-smooth position so the glow trails slightly
  const springConfig = { stiffness: 180, damping: 25, mass: 0.5 };
  const mx = useSpring(rawX, springConfig);
  const my = useSpring(rawY, springConfig);
  const glowOpacity = useSpring(isHoveringMV, { stiffness: 100, damping: 20 });

  // Convert 0–1 to percentage strings
  const mxPct = useTransform(mx, (v) => `${v * 100}%`);
  const myPct = useTransform(my, (v) => `${v * 100}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    isHoveringMV.set(1);
  };

  const handleMouseLeave = () => {
    isHoveringMV.set(0);
    // Return glow to centre so it exits gracefully on re-enter
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative h-full ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      {/* Dynamic glow border — sits just behind the card surface */}
      <GlowLayer mxPct={mxPct} myPct={myPct} glowOpacity={glowOpacity} />

      {/* Foreground card surface */}
      <div
        className={[
          "group relative h-full overflow-hidden rounded-2xl",
          "bg-white/60 dark:bg-white/5",
          "border border-slate-200/60 dark:border-white/10",
          "backdrop-blur-xl",
          "shadow-sm transition-shadow duration-300",
          "hover:shadow-xl dark:hover:shadow-indigo-500/10",
        ].join(" ")}
      >
        {/* Subtle inner glow overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-400/5 to-indigo-600/5"
        />
        {/* Content */}
        <div className="relative h-full">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlowCard;
