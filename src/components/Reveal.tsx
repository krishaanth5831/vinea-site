"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { DURATION, EASE, STAGGER, alreadySeen, gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Reveal each direct child in sequence instead of the wrapper itself. */
  stagger?: boolean;
};

/**
 * Scroll-triggered reveal, fired once and never replayed.
 *
 * The markup ships visible and is hidden from JavaScript in a layout effect,
 * before the browser paints. That way the page reads correctly with no
 * JavaScript at all, and a reveal that never runs can never strand its
 * content invisible.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = (
      stagger ? Array.from(el.children) : [el]
    ) as HTMLElement[];
    if (targets.length === 0) return;

    /* Marks exactly the elements the animation owns, for testing. */
    targets.forEach((target) => {
      target.dataset.reveal = "";
    });

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    const context = gsap.context(() => {
      /*
       * Anything already in or above view when this mounts is shown without
       * animating. A reader who loaded the page and scrolled straight down
       * would otherwise outrun hydration and be left looking at blank space.
       */
      if (alreadySeen(el)) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: DURATION.base,
        ease: EASE,
        stagger: stagger ? STAGGER : 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => context.revert();
  }, [stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
