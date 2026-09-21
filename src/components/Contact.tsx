import { contact } from "@/content";

import { Cta } from "./Cta";
import { RevealGroup, RevealItem } from "./Reveal";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section meta={contact.meta} lead={contact.lead} raised>
      <RevealGroup className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2">
        {contact.lanes.map((lane) => (
          <RevealItem
            key={lane.id}
            as="article"
            className="flex flex-col bg-paper p-8 sm:p-10"
          >
            {/* Anchor target for the "for growers" / "for investors" nav. */}
            <h3
              id={lane.id}
              className="scroll-mt-28 font-sans text-xs uppercase tracking-[0.18em] text-muted"
            >
              {lane.audience}
            </h3>

            <p className="mt-6 font-display text-[1.5rem] leading-[1.25] tracking-[-0.015em] text-pretty">
              {lane.heading}
            </p>

            <p className="mt-5 text-[0.9375rem] leading-[1.75] text-muted">
              {lane.body}
            </p>

            <p className="mt-5 text-[0.9375rem] leading-[1.75] text-ink">
              {lane.ask}
            </p>

            <div className="mt-8 pt-2">
              <Cta cta={lane.cta} />
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
