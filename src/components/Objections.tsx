import type { Blocker } from "@/content";
import { objections } from "@/content";

import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Section } from "./Section";

function BlockerList({
  title,
  items,
  listClassName = "flex flex-col gap-6",
}: {
  title: string;
  items: Blocker[];
  listClassName?: string;
}) {
  return (
    <div>
      <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
        {title}
      </h3>
      <ul className={`mt-6 ${listClassName}`}>
        {items.map((item) => (
          <li key={item.title} className="border-t border-line pt-5">
            <p className="font-display text-lg leading-[1.3] tracking-[-0.01em]">
              {item.title}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Objections() {
  return (
    <Section meta={objections.meta} lead={objections.lead} raised>
      {/*
        Deliberately not a testimonial: no name, no photograph, no company,
        no quotation styling. It is evidence, set in the page's own voice.
      */}
      <Reveal>
        <div className="mt-14 max-w-[52ch] border-l-2 border-accent pl-6 sm:pl-8">
          <p className="font-display text-[clamp(1.375rem,2.8vw,1.875rem)] leading-[1.35] tracking-[-0.015em] text-pretty">
            {objections.objection}
          </p>
          <p className="mt-6 text-[0.9375rem] leading-[1.7] text-muted">
            {objections.objectionNote}
          </p>
        </div>
      </Reveal>

      <RevealGroup className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <RevealItem>
          <BlockerList
            title={objections.answeredTitle}
            items={objections.answered}
          />
        </RevealItem>
        <RevealItem>
          <BlockerList
            title={objections.unansweredTitle}
            items={objections.unanswered}
          />
        </RevealItem>
      </RevealGroup>

      <Reveal>
        <div className="mt-20 border-t border-line-strong pt-12">
          <BlockerList
            title={objections.blockersTitle}
            items={objections.blockers}
            listClassName="grid gap-8 sm:grid-cols-2 md:gap-x-16"
          />
        </div>
      </Reveal>
    </Section>
  );
}
