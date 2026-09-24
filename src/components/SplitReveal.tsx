"use client";

import { useRef, type ReactNode } from "react";

import { DURATION, EASE, SplitText, gsap, prefersReducedMotion, alreadySeen } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * A heading whose lines rise out of their own masks as it scrolls into view,
 * the same movement the hero heading makes on load.
 *
 * The text ships whole. It is only split, and only hidden, once JavaScript
 * has confirmed the heading is still below the fold — a heading already on
 * screen is left exactly as it is.
 */
export function SplitReveal({
  children,
  as: Tag = "h2",
  id,
  className = "",
}: {
  children: ReactNode;
  as?: "h2" | "p";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || alreadySeen(el)) return;

    const context = gsap.context(() => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: DURATION.slow,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    }, el);

    return () => context.revert();
  }, []);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
