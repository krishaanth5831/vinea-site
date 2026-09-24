"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * A length of the thread that runs down the page from square one: a hairline
 * drawn as the reader scrolls, ending in a cell that lights when the line
 * reaches it. Each section opens with one, so the page reads as one line.
 */
export function Thread({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const line = el.querySelector(".thread-line");
    const node = el.querySelector(".thread-node");

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        })
        .fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 })
        .fromTo(
          node,
          { scale: 0, rotation: 45 },
          { scale: 1, rotation: 0, ease: "back.out(3)", duration: 0.3 },
        );
    }, el);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`flex flex-col items-center ${className}`}
    >
      <div className="thread-line h-[clamp(4rem,12svh,8rem)] w-px origin-top" />
      <div className="thread-node" />
    </div>
  );
}
