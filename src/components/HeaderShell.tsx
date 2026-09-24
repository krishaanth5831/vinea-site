"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * The header steps out of the way while the reader scrolls down and comes
 * back the moment they scroll up. A hairline along its bottom edge shows how
 * far through the page they are.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = ref.current;
    const progress = bar.current;
    if (!header || !progress) return;

    const hides = !prefersReducedMotion();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        progress.style.transform = `scaleX(${self.progress})`;
        if (!hides) return;
        /* Keyboard focus inside the header always keeps it on screen. */
        const hide =
          self.direction === 1 &&
          self.scroll() > 160 &&
          !header.contains(document.activeElement);
        header.toggleAttribute("data-hidden", hide);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <header
      ref={ref}
      className="header-shell sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md"
    >
      {children}
      <div
        ref={bar}
        aria-hidden="true"
        className="scroll-progress absolute right-0 -bottom-px left-0 h-px bg-fg"
      />
    </header>
  );
}
