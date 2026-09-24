"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/* Registered once, in the browser only. */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

/**
 * The page's one motion vocabulary. Everything that enters rises into place
 * on the same curve, at the same pace, so the page reads as one movement
 * rather than a set of effects.
 */
export const EASE = "expo.out";

export const DURATION = {
  fast: 0.45,
  base: 1,
  slow: 1.4,
} as const;

/** Gap between siblings in a staggered group. */
export const STAGGER = 0.08;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** A touch screen has no pointer to follow, so pointer effects stand down. */
export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine)").matches
  );
}

/** Whether an element is already on screen, or scrolled past, right now. */
export function alreadySeen(el: Element, threshold = 0.9): boolean {
  return el.getBoundingClientRect().top < window.innerHeight * threshold;
}
