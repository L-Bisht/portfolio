// Framer Motion spring for the LeftRail width animation (damping: 40 eliminates oscillation cycles, see ADR 0009)
export const RAIL_SPRING = { type: "spring" as const, stiffness: 320, damping: 40, mass: 0.8 };
