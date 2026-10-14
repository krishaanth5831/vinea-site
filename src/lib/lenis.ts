"use client";

import type Lenis from "lenis";

/*
 * The page's one Lenis instance, for code that needs to scroll on purpose:
 * the deck's arrow keys and its slide rail. Null under reduced motion, where
 * Lenis is never built and the browser scrolls natively.
 */
let current: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  current = lenis;
}

/**
 * Scrolls to a position in pixels: through Lenis when it is running, so the
 * glide matches the wheel, and natively otherwise.
 */
export function scrollToY(y: number) {
  if (current) {
    current.scrollTo(y, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  window.scrollTo({ top: y });
}
