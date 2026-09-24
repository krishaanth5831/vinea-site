"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { MARK_CENTRE, Mark, S } from "./Mark";

/**
 * The bookend to the story: the thread arrives at square one, and the mark
 * grows back out of it as the reader scrolls — rebuilt, this time, from what
 * growers say.
 */
export function RebuildMark() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const cells = Array.from(el.querySelectorAll<SVGGElement>(".mark-cell"));
    const squareOne = el.querySelector(".square-one");

    const context = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "bottom 55%",
          scrub: 0.8,
        },
      });
      tl.fromTo(squareOne, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.4, duration: 0.3 }, 0.55);
      cells.forEach((cell, i) => {
        tl.fromTo(
          cell,
          {
            x: MARK_CENTRE.c - Number(cell.dataset.c),
            y: MARK_CENTRE.r - Number(cell.dataset.r),
            scale: 0.4,
            opacity: 0,
            transformOrigin: "50% 50%",
          },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" },
          0.3 + i * 0.03,
        );
      });
    }, el);

    return () => context.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="text-fg">
      <Mark className="block size-24 sm:size-28">
        <rect
          className="square-one"
          x={MARK_CENTRE.c}
          y={MARK_CENTRE.r}
          width={S}
          height={S}
          opacity="0"
        />
      </Mark>
    </div>
  );
}
