import { heard } from "@/content";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/**
 * What growers hold against robots, each with what Vinea does about it. The
 * worry is in the grower's words; a line draws across the card and the
 * answer sits under it.
 */
export function Heard() {
  return (
    <section id={heard.id} aria-labelledby={`${heard.id}-heading`} className="section">
      <Container>
        <SectionHead id={heard.id} eyebrow={heard.eyebrow} heading={heard.heading} lead={heard.lead} />
        <Reveal as="ul" stagger className="m-0 mt-16 grid list-none gap-4 p-0 md:grid-cols-2">
          {heard.items.map((item) => (
            <li key={item.title}>
              <article data-glow className="card worry flex h-full flex-col p-6 sm:p-8">
                <h3 className="m-0 text-[clamp(1.5rem,2.4vw,1.875rem)] leading-[1.1] font-medium tracking-[-0.035em]">
                  {item.title}
                </h3>
                <p className="mt-3 mb-0 max-w-[40ch] leading-relaxed text-pretty text-muted">{item.worry}</p>
                <div aria-hidden="true" className="worry-rule" />
                <p className="t-label m-0 text-accent">{heard.answerLabel}</p>
                <p className="mt-3 mb-0 max-w-[44ch] text-[1.0625rem] leading-relaxed text-pretty">
                  {item.answer}
                </p>
              </article>
            </li>
          ))}
        </Reveal>
        <Reveal>
          <p className="note-line mx-auto mt-10 mb-0">{heard.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
