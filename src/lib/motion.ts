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
 *
 * `amount: "some"` rather than a fraction on purpose. A fraction is measured
 * against the element, so a block taller than a few screens — which is what
 * these stacked lists become at phone widths — can never show enough of
 * itself to trigger, and would stay invisible for good.
 *
 * The margin does two jobs. The negative bottom holds a reveal back until the
 * block is properly into view. The large positive top counts anything already
 * above the viewport as in view, so a reader who loads the page and flicks
 * straight down does not outrun hydration and leave whole sections that have
 * scrolled past stuck invisible for good — these fire once, so a missed
 * trigger never gets a second chance.
 */
export const VIEWPORT = {
  once: true,
  amount: "some",
  margin: "20000px 0px -80px 0px",
} as const;

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
