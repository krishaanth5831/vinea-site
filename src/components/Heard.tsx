import { heard } from "@/content";

import { Container, Label } from "./Container";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";
import { StackCards } from "./StackCards";
import { Thread } from "./Thread";

export function Heard() {
  return (
    <section id={heard.id} aria-labelledby={`${heard.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Label>{heard.eyebrow}</Label>
          </Reveal>
          <SplitReveal id={`${heard.id}-heading`} className="t-h2 mt-7 mb-0 max-w-[16ch]">
            {heard.heading}
          </SplitReveal>
          <Reveal>
            <p className="t-lead mt-6 mb-0 text-muted">{heard.lead}</p>
          </Reveal>
        </div>

        <div className="mt-16">
          <StackCards findings={heard.findings} />
        </div>

        <p className="t-mono mt-12 mb-0 text-center text-muted">{heard.note}</p>
      </Container>
    </section>
  );
}
