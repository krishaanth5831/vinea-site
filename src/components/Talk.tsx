import { site, talk } from "@/content";

import { Button } from "./Button";
import { Container, Label } from "./Container";
import { RebuildMark } from "./RebuildMark";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";
import { Thread } from "./Thread";

export function Talk() {
  return (
    <section id={talk.id} aria-labelledby={`${talk.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-10 flex flex-col items-center text-center">
        <RebuildMark />

        <Reveal className="mt-12">
          <Label>{talk.eyebrow}</Label>
        </Reveal>

        <SplitReveal id={`${talk.id}-heading`} className="t-h2 mt-7 mb-0 max-w-[18ch]">
          {talk.heading[0]} {talk.heading[1]}
        </SplitReveal>

        <Reveal stagger className="flex flex-col items-center">
          <p className="t-lead mt-7 mb-0 max-w-[32rem] text-muted">{talk.lead}</p>

          <div className="mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            {talk.ctas.map((cta) => (
              <Button key={cta.href} cta={cta} />
            ))}
          </div>

          <a
            href={`mailto:${site.email}`}
            className="mt-8 font-mono text-[0.8125rem] tracking-[0.04em] text-muted transition-colors duration-200 hover:text-fg"
          >
            {site.email}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
