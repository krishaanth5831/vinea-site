import type { Variants } from "framer-motion";

/**
 * One easing curve and one duration scale for the whole site, so every
 * movement reads as the same hand.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.28,
  base: 0.5,
  slow: 0.75,
} as const;

/** Gap between siblings in a staggered group. */
export const STAGGER = 0.07;

/**
 * Reveals fire once and never replay when the page scrolls back up.
 * `amount` keeps tall blocks from waiting until they are fully on screen.
 */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** Only opacity and transform move, so a reveal can never shift layout. */
export function riseVariants(reduced: boolean): Variants {
  return {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.base, ease: EASE },
    },
  };
}

export function groupVariants(reduced: boolean): Variants {
  return {
    hidden: {},
    shown: {
      transition: reduced
        ? {}
        : { staggerChildren: STAGGER, delayChildren: 0.04 },
    },
  };
}
