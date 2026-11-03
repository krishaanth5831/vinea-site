import { how } from "@/content";

import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Thread } from "./Thread";

/**
 * The loop, as four cards. Each carries a strip of four cells with its own
 * lit, so the order reads without a numeral.
 */
export function How() {
  return (
    <section id={how.id} aria-labelledby={`${how.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12">
        <SectionHead id={how.id} eyebrow={how.eyebrow} heading={how.heading} lead={how.lead} />

        <Reveal as="ol" stagger className="m-0 mt-16 grid list-none gap-4 p-0 md:grid-cols-2">
          {how.steps.map((step, i) => (
            <li key={step.label}>
              <article className="flex h-full flex-col rounded-[4px] border border-line bg-raised p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="t-label m-0 text-fg">{step.label}</p>
                  <span aria-hidden="true" className="flex gap-[3px]">
                    {how.steps.map((other, j) => (
                      <span
                        key={other.label}
                        className={`block size-2 ${j === i ? "bg-fg" : "bg-line-strong"}`}
                      />
                    ))}
                  </span>
                </div>
                <h3 className="mt-6 mb-0 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.15] font-medium tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className="mt-3 mb-0 text-[1rem] leading-relaxed text-pretty text-muted">
                  {step.body}
                </p>
              </article>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
