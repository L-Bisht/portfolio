import type { Variants } from "framer-motion";

/**
 * Entrance Choreography & Motion Variants for the Hero Monograph and Telemetry Card.
 *
 * Provides calibrated entrance animations for standard display environments
 * while cleanly bypassing durations, delays, and transforms when reduced motion
 * preferences (`prefers-reduced-motion: reduce`) are active.
 */

/** Container: orchestrates all monograph children with a stagger */
export const getContainerVariants = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : 0.1,
      delayChildren: reduced ? 0 : 0.12,
    },
  },
});

/**
 * Headline name container: orchestrates word-by-word reveal.
 * Words stagger sequentially within descender-safe overflow masks.
 */
export const getNameContainerVariants = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : 0.12,
      delayChildren: reduced ? 0 : 0.05,
    },
  },
});

/**
 * Each word rises from beneath its overflow mask.
 * The mask uses `pb-3 -mb-3 pt-1 -mt-1` to give descenders (`g j p y`)
 * breathing room so they are never visually clipped.
 * When reduced motion is preferred, offsets and durations are completely bypassed.
 */
export const getWordVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Fade + slide up for eyebrow, role, thesis, and action bar.
 * In reduced motion mode, renders statically with 0 duration and no displacement.
 */
export const getFadeUpVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Subtle fade + scale for the Executive Telemetry Card.
 * In standard mode, scales smoothly from 0.98 to 1 with an intentional calm entrance delay.
 * In reduced motion mode, renders static immediately.
 */
export const getTelemetryVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
});
