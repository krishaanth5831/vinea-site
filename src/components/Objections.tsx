import type { Blocker } from "@/content";
import { objections } from "@/content";

import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";

function BlockerList({
  title,
  items,
  listClassName = "flex flex-col gap-7",
}: {
  title: string;
  items: Blocker[];
  listClassName?: string;
}) {
  return (
    <div>
      <Mono>{title}</Mono>
      <ul className={`m-0 mt-7 list-none p-0 ${listClassName}`}>
        {items.map((item) => (
          <li key={item.title} className="border-t border-line pt-5">
            <p className="t-h3 m-0">{item.title}</p>
            <p className="t-body mt-3 mb-0 text-muted">{item.body}</p>
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
        Deliberately not a testimonial: no name, no photograph, no company, no
        quotation styling. It is evidence, set in the page's own voice.
      */}
      <Reveal className="mt-16">
        <div className="max-w-[46rem] border-l-2 border-signal pl-7 sm:pl-10">
          <p className="t-quote m-0">{objections.objection}</p>
          <p className="t-body mt-7 mb-0 text-muted">{objections.objectionNote}</p>
        </div>
      </Reveal>

      <Reveal stagger className="mt-24 grid gap-14 md:grid-cols-2 md:gap-16">
        <BlockerList title={objections.answeredTitle} items={objections.answered} />
        <BlockerList
          title={objections.unansweredTitle}
          items={objections.unanswered}
        />
      </Reveal>

      <Reveal className="mt-24 border-t border-ink pt-12">
        <BlockerList
          title={objections.blockersTitle}
          items={objections.blockers}
          listClassName="grid gap-8 sm:grid-cols-2 md:gap-x-16"
        />
      </Reveal>
    </Section>
  );
}
