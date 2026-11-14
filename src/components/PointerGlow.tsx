"use client";

import { useEffect } from "react";
import { hasFinePointer } from "@/lib/gsap";

/**
 * Cards marked `data-glow` carry a soft light that sits under the pointer.
 * One listener for the whole page writes the pointer's place into the card
 * it is over; the card's own CSS draws the light from those two numbers.
 */
export function PointerGlow() {
  useEffect(() => {
    if (!hasFinePointer()) return;
    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-glow]") : null;
      if (!target) return;
      const box = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - box.left}px`);
      target.style.setProperty("--my", `${event.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
