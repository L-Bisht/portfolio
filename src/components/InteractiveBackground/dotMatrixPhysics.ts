/**
 * Dot Matrix 3D Hemispherical Projection & Kinetic Spring Physics Engine
 *
 * Implements:
 * 1. 3D Hemispherical projection with elevation z = sqrt(max(0, R^2 - d^2))
 * 2. Radial outward displacement Delta p = (p - mouse) / d * (z / R * 16px)
 * 3. Underdamped harmonic spring compression (k = 280, c = 22) settling over ~550ms
 * 4. Expanding kinetic wavefront ring (w = 55px) radial ripple push
 * 5. Apex magnification up to 2.4x resting radius with luminance scaling
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const DOT_SPACING = 26; // px between dot centres in resting grid (desktop >= 768px)
export const DOT_SPACING_MOBILE = 38; // px between dot centres in resting grid (mobile < 768px)
export const MOBILE_BREAKPOINT = 768; // px mobile viewport breakpoint
export const DOT_BASE_R = 1.4; // px resting dot radius
export const DOT_APEX_SCALE = 2.4; // peak scale multiplier at dome apex (1.4 * 2.4 = 3.36px)
export const DOT_MAX_DISPLACEMENT = 16; // px max radial outward shift
export const DOT_PROX_R = 180; // px proximity influence radius
export const DOT_PROX_R2 = DOT_PROX_R * DOT_PROX_R; // 32400 px^2

// Spring physics constants: underdamped harmonic oscillator (m = 1)
export const SPRING_K = 280; // stiffness coefficient (rad^2/s^2)
export const SPRING_C = 22; // damping coefficient (s^-1)
export const SPRING_GAMMA = SPRING_C / 2; // 11 s^-1 (decay rate)
export const SPRING_OMEGA_D = Math.sqrt(SPRING_K - SPRING_GAMMA * SPRING_GAMMA); // sqrt(280 - 121) = sqrt(159) ~ 12.6095 rad/s
export const SPRING_INITIAL_COMPRESSION = -0.40; // -40% depression at t = 0
export const SPRING_SETTLE_MS = 550; // ms duration until fully settled

// Kinetic ripple wavefront constants
export const RIPPLE_WAVE_W = 55; // px wavefront ring thickness
export const RIPPLE_PUSH_MAX = 8; // px max outward displacement from kinetic wavefront

// Idle sleep loop constants
export const POINTER_IDLE_MS = 150; // ms threshold of stationary pointer before sleep
export const SCROLL_DEBOUNCE_MS = 150; // ms debounce upon scroll cessation before wake-and-settle
export const COLOR_LERP_TOLERANCE = 0.5; // RGB channel convergence tolerance

/**
 * Returns the dot grid spacing based on viewport width (< 768px mobile -> 38px, desktop -> 26px)
 */
export function getDotSpacing(width: number): number {
  return width < MOBILE_BREAKPOINT ? DOT_SPACING_MOBILE : DOT_SPACING;
}


// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface GridPoint {
  x: number;
  y: number;
}

export interface ActiveRippleData {
  x: number;
  y: number;
  radius: number;
  fade: number;
}

export interface IdleSettleState {
  pointerX: number;
  pointerY: number;
  lastPointerMoveTime: number;
  now: number;
  ripplesCount: number;
  springClickTime: number;
  currentColor: { r: number; g: number; b: number };
  targetColor: { r: number; g: number; b: number };
  isScrolling?: boolean;
}

export interface IdleSettleResult {
  isPointerSettled: boolean;
  isRipplesSettled: boolean;
  isSpringSettled: boolean;
  isColorConverged: boolean;
  isScrollingSettled: boolean;
  shouldSleep: boolean;
}

// ─── Mathematical Projection & Physics Functions ──────────────────────────────

/**
 * Compute the 3D spherical elevation z of a dot at (px, py) relative to cursor (mx, my).
 * When distance d < R: z = sqrt(R^2 - d^2) >= 0.
 * When d >= R: z = 0.
 */
export function calculateHemisphericalElevation(
  px: number,
  py: number,
  mx: number,
  my: number,
  radius: number = DOT_PROX_R
): number {
  const dx = px - mx;
  const dy = py - my;
  const d2 = dx * dx + dy * dy;
  const r2 = radius * radius;

  if (d2 >= r2) {
    return 0;
  }

  return Math.sqrt(r2 - d2);
}

/**
 * Evaluates the underdamped harmonic spring compression factor at elapsed milliseconds since click.
 * Initial depression y(0) = -0.40.
 * Equation: y(t) = y_0 * e^(-gamma * t) * (cos(omega_d * t) + (gamma / omega_d) * sin(omega_d * t))
 * Returns multiplier S(t) = max(0, 1.0 + y(t)).
 * Settles to 1.0 when elapsedMs >= 550ms or when elapsedMs < 0.
 */
export function calculateSpringFactor(elapsedMs: number): number {
  if (elapsedMs < 0 || elapsedMs >= SPRING_SETTLE_MS) {
    return 1.0;
  }

  const t = elapsedMs / 1000; // convert to seconds
  const decay = Math.exp(-SPRING_GAMMA * t);
  const phase = SPRING_OMEGA_D * t;
  const y =
    SPRING_INITIAL_COMPRESSION *
    decay *
    (Math.cos(phase) + (SPRING_GAMMA / SPRING_OMEGA_D) * Math.sin(phase));

  return Math.max(0, 1.0 + y);
}

/**
 * Calculates tactile radial outward displacement for a dot on the hemispherical dome.
 * Vector Delta p = ((p - mouse) / d) * ((elevation / R) * maxDisplacement)
 */
export function calculateDomeDisplacement(
  px: number,
  py: number,
  mx: number,
  my: number,
  elevation: number,
  radius: number = DOT_PROX_R,
  maxDisplacement: number = DOT_MAX_DISPLACEMENT
): { dx: number; dy: number } {
  if (elevation <= 0) {
    return { dx: 0, dy: 0 };
  }

  const dx = px - mx;
  const dy = py - my;
  const d = Math.hypot(dx, dy);

  if (d < 0.0001) {
    return { dx: 0, dy: 0 };
  }

  // Smooth core taper: prevents the apex from hollowing out while preserving convex dome curvature
  const coreTaper = Math.min(1, d / 36);
  const factor = (elevation / radius) * coreTaper * maxDisplacement;
  return {
    dx: (dx / d) * factor,
    dy: (dy / d) * factor,
  };
}

/**
 * Calculates kinetic outward push and intensity factor exerted by an expanding ripple wavefront ring.
 */
export function calculateWavePush(
  px: number,
  py: number,
  ripX: number,
  ripY: number,
  ripRadius: number,
  ripFade: number,
  waveWidth: number = RIPPLE_WAVE_W,
  maxPush: number = RIPPLE_PUSH_MAX
): { dx: number; dy: number; factor: number } {
  const dx = px - ripX;
  const dy = py - ripY;
  const d = Math.hypot(dx, dy);
  const delta = Math.abs(d - ripRadius);

  if (delta >= waveWidth || ripFade <= 0) {
    return { dx: 0, dy: 0, factor: 0 };
  }

  const wNorm = 1 - delta / waveWidth;
  // Smooth cubic ease hermite curve: 3x^2 - 2x^3
  const smoothCurve = wNorm * wNorm * (3 - 2 * wNorm);
  const factor = smoothCurve * ripFade;

  if (d < 0.0001) {
    return { dx: 0, dy: 0, factor };
  }

  const pushMag = factor * maxPush;
  return {
    dx: (dx / d) * pushMag,
    dy: (dy / d) * pushMag,
    factor,
  };
}

/**
 * Calculates dynamic dot radius up to 2.4x resting radius at the apex with ripple enhancement.
 */
export function calculateDotRadius(
  baseR: number = DOT_BASE_R,
  apexScale: number = DOT_APEX_SCALE,
  elevationRatio: number = 0,
  rippleFactor: number = 0
): number {
  const clampedElevationRatio = Math.max(0, Math.min(1, elevationRatio));
  const domeScale = 1 + (apexScale - 1) * clampedElevationRatio;
  const rippleBonus = rippleFactor * 0.8;
  return baseR * domeScale + rippleBonus;
}

/**
 * Evaluates whether the canvas background rendering engine has settled into an idle state.
 * Settle criteria:
 * 1. Pointer has been stationary for >= 150ms or is off-screen (pointerX < -1000).
 * 2. Active click ripples array is empty (ripplesCount === 0).
 * 3. Damped harmonic spring compression has settled (now - springClickTime >= 550ms).
 * 4. Section accent color linear interpolation has converged within 0.5 units on all RGB channels.
 * 5. Window is not in an active scroll gesture (!isScrolling).
 */
export function evaluateIdleSettle(state: IdleSettleState): IdleSettleResult {
  const isPointerSettled =
    state.pointerX < -1000 ||
    state.now - state.lastPointerMoveTime >= POINTER_IDLE_MS;

  const isRipplesSettled = state.ripplesCount === 0;

  const isSpringSettled =
    state.now - state.springClickTime >= SPRING_SETTLE_MS;

  const diffR = Math.abs(state.currentColor.r - state.targetColor.r);
  const diffG = Math.abs(state.currentColor.g - state.targetColor.g);
  const diffB = Math.abs(state.currentColor.b - state.targetColor.b);
  const isColorConverged =
    diffR < COLOR_LERP_TOLERANCE &&
    diffG < COLOR_LERP_TOLERANCE &&
    diffB < COLOR_LERP_TOLERANCE;

  const isScrollingSettled = !state.isScrolling;

  const shouldSleep =
    isPointerSettled &&
    isRipplesSettled &&
    isSpringSettled &&
    isColorConverged &&
    isScrollingSettled;

  return {
    isPointerSettled,
    isRipplesSettled,
    isSpringSettled,
    isColorConverged,
    isScrollingSettled,
    shouldSleep,
  };
}

/**
 * Partitions grid intersection dots into resting dots and dynamic dots using a 2D spatial bounding box.
 * - Resting dots: outside cursor proximity bounding box (|dx| >= R or |dy| >= R) and outside active ripple wavefronts.
 * - Dynamic dots: inside cursor proximity bounding box (|dx| < R and |dy| < R) or within active ripple wavefront zones.
 */
export function partitionDots(
  dots: GridPoint[],
  mouseX: number,
  mouseY: number,
  activeRipples: ActiveRippleData[] = [],
  proxR: number = DOT_PROX_R,
  waveWidth: number = RIPPLE_WAVE_W
): { resting: GridPoint[]; dynamic: GridPoint[] } {
  const resting: GridPoint[] = [];
  const dynamic: GridPoint[] = [];

  const hasMouse = mouseX > -1000;
  const numRipples = activeRipples.length;

  for (let i = 0; i < dots.length; i++) {
    const p = dots[i];
    let isDynamic = false;

    // Bounding box test around cursor: |dx| < R and |dy| < R
    if (
      hasMouse &&
      Math.abs(p.x - mouseX) < proxR &&
      Math.abs(p.y - mouseY) < proxR
    ) {
      isDynamic = true;
    } else if (numRipples > 0) {
      for (let j = 0; j < numRipples; j++) {
        const rip = activeRipples[j];
        const d = Math.hypot(p.x - rip.x, p.y - rip.y);
        if (Math.abs(d - rip.radius) < waveWidth) {
          isDynamic = true;
          break;
        }
      }
    }

    if (isDynamic) {
      dynamic.push(p);
    } else {
      resting.push(p);
    }
  }

  return { resting, dynamic };
}

