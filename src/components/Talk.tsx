import { site, talk } from "@/content";
import { Button } from "./Button";
import { Container, Label } from "./Container";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

/** The ask, in the light of the grow lamps. */
export function Talk() {
  return (
    <section id={talk.id} aria-labelledby={`${talk.id}-heading`} className="section">
      <Container>
        <div className="talk relative isolate flex flex-col items-center overflow-hidden text-center">
          <div aria-hidden="true" className="talk-glow" />
          <Reveal>
            <Label>{talk.eyebrow}</Label>
          </Reveal>
          <SplitReveal id={`${talk.id}-heading`} className="t-h2 mt-7 mb-0 max-w-[18ch]">
            {talk.heading[0]} {talk.heading[1]}
          </SplitReveal>
          <Reveal stagger className="flex flex-col items-center">
            <p className="t-lead mt-7 mb-0 max-w-[34rem] text-pretty text-muted">{talk.lead}</p>
            <div className="mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              {talk.ctas.map((cta) => (
                <Button key={cta.href} cta={cta} />
              ))}
            </div>
            <a
              href={`mailto:${site.email}`}
              className="link-line mt-8 font-mono text-[0.8125rem] tracking-[0.04em] text-muted"
            >
              {site.email}
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
