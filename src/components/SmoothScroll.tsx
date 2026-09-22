"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis, driving the page's scroll, with ScrollTrigger reading from it.
 *
 * The wiring order matters: Lenis tells ScrollTrigger to update on every
 * scroll, GSAP's ticker drives Lenis's own loop rather than Lenis running a
 * second requestAnimationFrame of its own, and lag smoothing is off so a
 * stalled frame does not make the page jump when it recovers.
 *
 * Under reduced motion Lenis is never constructed, so scrolling is whatever
 * the browser does natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      autoRaf: false,
      /* Same-page hash links are handed to Lenis instead of jumping. */
      anchors: { offset: -80 },
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
