"use client";

import { useRef } from "react";

import type { Finding } from "@/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { Glyph } from "./Glyph";

/**
 * The refusals as a stack. Each card holds under the header while the next
 * slides up over it, and the one underneath settles back and dims.
 */
export function StackCards({ findings }: { findings: Finding[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useIsomorphicLayoutEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".stack-card"));

    const context = gsap.context(() => {
      cards.slice(0, -1).forEach((card, i) => {
        const next = cards[i + 1];
        const inner = card.querySelector(".stack-inner");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(card, { scale: 0.94, ease: "none" }, 0)
          .to(inner, { opacity: 0.25, ease: "none" }, 0);
      });
    }, list);

    return () => context.revert();
  }, []);

  return (
    <ol ref={ref} className="m-0 flex list-none flex-col gap-6 p-0">
      {findings.map((finding, i) => (
        <li
          key={finding.title}
          className="stack-card"
          style={{ "--i": i } as React.CSSProperties}
        >
          <article className="rounded-[4px] border border-line bg-raised">
            <div className="stack-inner grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-14 md:p-12">
              <div className="aspect-square w-28 rounded-[3px] border border-line bg-bg p-3 sm:w-36 md:w-full md:p-5">
                <Glyph kind={i} />
              </div>
              <div>
                <h3 className="t-h3 m-0">{finding.title}</h3>
                <p className="t-lead mt-4 mb-0 max-w-[36ch] text-pretty text-muted">
                  {finding.body}
                </p>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
