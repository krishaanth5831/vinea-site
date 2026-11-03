import { roadmap } from "@/content";

import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Thread } from "./Thread";

/**
 * The stages in order, on one line: across the page from `md` up, down it
 * on a phone. The current stage's cell is lit and the ones ahead are open.
 */
export function Roadmap() {
  const now = Math.max(
    0,
    roadmap.stages.findIndex((stage) => stage.current),
  );

  return (
    <section id={roadmap.id} aria-labelledby={`${roadmap.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12">
        <SectionHead id={roadmap.id} eyebrow={roadmap.eyebrow} heading={roadmap.heading} />

        <Reveal
          as="ol"
          stagger
          className="relative m-0 mt-16 grid list-none gap-10 p-0 md:grid-cols-4 md:gap-6"
        >
          {roadmap.stages.map((stage, i) => (
            <li
              key={stage.label}
              aria-current={stage.current ? "step" : undefined}
              className="relative border-l border-line pl-6 md:border-t md:border-l-0 md:pt-7 md:pl-0"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 -left-[0.3125rem] block size-2.5 md:-top-[0.3125rem] md:left-0 ${
                  i <= now ? "bg-fg" : "border border-line-strong bg-bg"
                }`}
              />
              <p className={`t-label m-0 ${stage.current ? "text-fg" : "text-muted"}`}>
                {stage.label}
              </p>
              <h3 className="mt-3 mb-0 text-[1.25rem] leading-snug font-medium tracking-[-0.02em] text-balance">
                {stage.title}
              </h3>
              <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
                {stage.items.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-relaxed text-pretty text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
