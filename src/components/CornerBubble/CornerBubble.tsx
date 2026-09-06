import { useId, type CSSProperties } from "react";

export type CornerPosition = "tl" | "tr" | "bl" | "br";

export interface CornerBubbleProps {
  /**
   * Corner placement on the card container.
   * 'tl' = top-left, 'tr' = top-right, 'bl' = bottom-left, 'br' = bottom-right.
   * Default: 'tr'
   */
  corner?: CornerPosition;
  /**
   * Accent stroke/gradient tint color.
   */
  color: string;
  /**
   * Pixel dimensions (width and height) of the corner motif container.
   * Default: 80
   */
  size?: number;
  /**
   * Overall opacity of the motif container.
   * Default: 0.18
   */
  opacity?: number;
  /**
   * Optional extra className.
   */
  className?: string;
  /**
   * Optional inline styles forwarded to the outer SVG.
   */
  style?: CSSProperties;
}

interface CornerMetrics {
  viewBox: string;
  posStyle: CSSProperties;
  signX: number;
  signY: number;
  sweep: number;
  arcPath: (r: number) => string;
  sectorPath: (r: number) => string;
  specularArc: (r: number, x1: number, y1: number, x2: number, y2: number) => string;
}

/**
 * Coordinate and path calculations where the container corner vertex acts
 * as the center origin (0, 0). Radii extend along the container edges by
 * distance R, and the convex circular arc bows inward into the card.
 */
const CORNER_CONFIG: Record<CornerPosition, CornerMetrics> = {
  tl: {
    viewBox: "0 0 100 100",
    posStyle: { top: 0, left: 0 },
    signX: 1,
    signY: 1,
    sweep: 1,
    arcPath: (r) => `M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`,
    sectorPath: (r) => `M 0 0 L ${r} 0 A ${r} ${r} 0 0 1 0 ${r} Z`,
    specularArc: (r, x1, y1, x2, y2) => `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`,
  },
  tr: {
    viewBox: "-100 0 100 100",
    posStyle: { top: 0, right: 0 },
    signX: -1,
    signY: 1,
    sweep: 0,
    arcPath: (r) => `M ${-r} 0 A ${r} ${r} 0 0 0 0 ${r}`,
    sectorPath: (r) => `M 0 0 L ${-r} 0 A ${r} ${r} 0 0 0 0 ${r} Z`,
    specularArc: (r, x1, y1, x2, y2) => `M ${-x1} ${y1} A ${r} ${r} 0 0 0 ${-x2} ${y2}`,
  },
  br: {
    viewBox: "-100 -100 100 100",
    posStyle: { bottom: 0, right: 0 },
    signX: -1,
    signY: -1,
    sweep: 1,
    arcPath: (r) => `M ${-r} 0 A ${r} ${r} 0 0 1 0 ${-r}`,
    sectorPath: (r) => `M 0 0 L ${-r} 0 A ${r} ${r} 0 0 1 0 ${-r} Z`,
    specularArc: (r, x1, y1, x2, y2) => `M ${-x1} ${-y1} A ${r} ${r} 0 0 1 ${-x2} ${-y2}`,
  },
  bl: {
    viewBox: "0 -100 100 100",
    posStyle: { bottom: 0, left: 0 },
    signX: 1,
    signY: -1,
    sweep: 0,
    arcPath: (r) => `M ${r} 0 A ${r} ${r} 0 0 0 0 ${-r}`,
    sectorPath: (r) => `M 0 0 L ${r} 0 A ${r} ${r} 0 0 0 0 ${-r} Z`,
    specularArc: (r, x1, y1, x2, y2) => `M ${x1} ${-y1} A ${r} ${r} 0 0 0 ${x2} ${-y2}`,
  },
};

/** Concentric internal hairline radii and opacities */
const CONCENTRIC_HAIRLINES = [
  { r: 72, strokeWidth: 0.85, opacity: 0.35 },
  { r: 46, strokeWidth: 0.7, opacity: 0.25 },
  { r: 22, strokeWidth: 0.55, opacity: 0.18 },
];

/** Floating micro-bubbles nestled within the bubble sector */
const MICRO_BUBBLES = [
  { cx: 36, cy: 22, r: 5, glintDx: -1.3, glintDy: -1.3 },
  { cx: 20, cy: 48, r: 3.5, glintDx: -0.9, glintDy: -0.9 },
  { cx: 66, cy: 40, r: 2.8, glintDx: -0.7, glintDy: -0.7 },
];

export const CornerBubble = ({
  corner = "tr",
  color,
  size = 80,
  opacity = 0.22,
  className = "",
  style,
}: CornerBubbleProps) => {
  const rawId = useId();
  const safeId = rawId.replace(/[:]/g, "");
  const bodyGradId = `corner-bubble-body-${safeId}`;
  const rimGradId = `corner-bubble-rim-${safeId}`;
  const specularGradId = `corner-bubble-specular-${safeId}`;
  const glowFilterId = `corner-bubble-glow-${safeId}`;

  const config = CORNER_CONFIG[corner];

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={config.viewBox}
      fill="none"
      className={className}
      style={{
        position: "absolute",
        pointerEvents: "none",
        opacity,
        ...config.posStyle,
        ...style,
      }}
    >
      <defs>
        {/* Volumetric glass bubble gradient with Fresnel edge highlight */}
        <radialGradient
          id={bodyGradId}
          cx="0"
          cy="0"
          r="100"
          gradientUnits="userSpaceOnUse"
        >
          {/* Clear glass core near the corner origin */}
          <stop offset="0%" stopColor={color} stopOpacity={0.03} />
          <stop offset="40%" stopColor={color} stopOpacity={0.08} />
          {/* Volumetric density buildup towards perimeter */}
          <stop offset="72%" stopColor={color} stopOpacity={0.18} />
          <stop offset="88%" stopColor={color} stopOpacity={0.32} />
          {/* Luminous Fresnel inner rim reflection */}
          <stop offset="96%" stopColor="#ffffff" stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>

        {/* Luminous iridescent rim gradient */}
        <linearGradient
          id={rimGradId}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.7} />
          <stop offset="38%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="68%" stopColor={color} stopOpacity={0.85} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.55} />
        </linearGradient>

        {/* Specular reflection gradient: bright white in crest, fading to transparent */}
        <linearGradient
          id={specularGradId}
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
          <stop offset="35%" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="65%" stopColor={color} stopOpacity={0.65} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
        </linearGradient>

        {/* Soft atmospheric glow filter for the bubble membrane */}
        <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Volumetric glass bubble body with Fresnel edge concentration */}
      <path
        d={config.sectorPath(100)}
        fill={`url(#${bodyGradId})`}
        stroke="none"
      />

      {/* Soft luminous membrane halo along outer arc */}
      <path
        d={config.arcPath(100)}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity={0.35}
        filter={`url(#${glowFilterId})`}
      />

      {/* Primary outer boundary arc: crisp glass rim with iridescent glint */}
      <path
        d={config.arcPath(100)}
        stroke={`url(#${rimGradId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Primary curved specular glint arc following bubble dome curvature */}
      <path
        d={config.specularArc(82, 78, 25, 25, 78)}
        stroke={`url(#${specularGradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Secondary subtle inner reflection arc */}
      <path
        d={config.specularArc(64, 58, 26, 26, 58)}
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity={0.32}
      />

      {/* Specular pinpoint light gleams */}
      <circle
        cx={config.signX * 58}
        cy={config.signY * 34}
        r="2.2"
        fill="#ffffff"
        opacity={0.95}
      />
      <circle
        cx={config.signX * 58}
        cy={config.signY * 34}
        r="4.5"
        fill="#ffffff"
        opacity={0.35}
        filter={`url(#${glowFilterId})`}
      />
      <circle
        cx={config.signX * 34}
        cy={config.signY * 58}
        r="1.4"
        fill="#ffffff"
        opacity={0.8}
      />

      {/* Subtle concentric thin-film hairlines */}
      {CONCENTRIC_HAIRLINES.map((h) => (
        <path
          key={h.r}
          d={config.arcPath(h.r)}
          stroke={color}
          strokeWidth={h.strokeWidth}
          strokeLinecap="round"
          opacity={h.opacity}
        />
      ))}

      {/* Floating micro-bubbles nestled in the bubble sector */}
      {MICRO_BUBBLES.map((mb, idx) => {
        const cx = config.signX * mb.cx;
        const cy = config.signY * mb.cy;
        return (
          <g key={idx} className="micro-bubble">
            {/* Subtle soft glow */}
            <circle
              cx={cx}
              cy={cy}
              r={mb.r + 1}
              fill={color}
              fillOpacity={0.15}
              filter={`url(#${glowFilterId})`}
            />
            {/* Translucent bubble sphere */}
            <circle
              cx={cx}
              cy={cy}
              r={mb.r}
              fill={color}
              fillOpacity={0.18}
              stroke={`url(#${rimGradId})`}
              strokeWidth={0.85}
            />
            {/* Inner rim highlight */}
            <circle
              cx={cx}
              cy={cy}
              r={mb.r * 0.65}
              fill="none"
              stroke="#ffffff"
              strokeWidth={0.4}
              strokeOpacity={0.4}
            />
            {/* Specular gleam */}
            <circle
              cx={cx + config.signX * mb.glintDx}
              cy={cy + config.signY * mb.glintDy}
              r={mb.r * 0.3}
              fill="#ffffff"
              opacity={0.95}
            />
          </g>
        );
      })}
    </svg>
  );
};

/** Backward-compatible alias for existing imports */
export const QuarterCircleArc = CornerBubble;

export default CornerBubble;
