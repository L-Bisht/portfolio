import type { Variants } from "framer-motion";

/** Staggered wrapper that drives all child word reveals */
export const getSectionHeadlineContainerVariants = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : 0.09,
      delayChildren: reduced ? 0 : 0.15,
    },
  },
});

/**
 * Each word rises from beneath its overflow mask.
 * The mask uses `pb-3 -mb-3 pt-1 -mt-1` to give descenders (`g j p y`)
 * breathing room so they are never visually clipped.
 * Under reduced motion, hidden state is { y: "0%", opacity: 1 } so headlines appear instantly.
 */
export const getSectionWordVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

/** Fade + slide up for the eyebrow badge */
export const getSectionEyebrowVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
});

/** Fade + slide up for the subtitle */
export const getSectionSubtitleVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduced
      ? { duration: 0, delay: 0 }
      : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
});
