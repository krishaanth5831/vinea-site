import { contact } from "@/content";

import { Cta } from "./Cta";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";

export function Contact() {
  return (
    <Section meta={contact.meta} lead={contact.lead} raised>
      <Reveal stagger className="mt-16 grid gap-6 md:grid-cols-2">
        {contact.lanes.map((lane) => (
          <Frame key={lane.id} as="article" className="flex flex-col bg-paper p-8 sm:p-10">
            {/* Anchor target for the "for growers" / "for investors" nav. */}
            <h3 id={lane.id} className="scroll-mt-28">
              <Mono>{lane.audience}</Mono>
            </h3>

            <p className="t-h3 mt-6 mb-0">{lane.heading}</p>
            <p className="t-body mt-5 mb-0 text-muted">{lane.body}</p>
            <p className="t-body mt-5 mb-0">{lane.ask}</p>

            <div className="mt-auto pt-10">
              <Cta cta={lane.cta} />
            </div>
          </Frame>
        ))}
      </Reveal>
    </Section>
  );
}
