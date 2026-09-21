import { status } from "@/content";

import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Section } from "./Section";

function Ledger({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "exists" | "absent";
}) {
  return (
    <div>
      <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
        {title}
      </h3>
      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item}
            className={`border-t pt-4 text-[0.9375rem] leading-[1.7] ${
              tone === "exists"
                ? "border-accent/35 text-ink"
                : "border-line text-muted"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Status() {
  return (
    <Section meta={status.meta} lead={status.lead}>
      <RevealGroup className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {status.facts.map((fact) => (
          <RevealItem key={fact.label} className="bg-paper p-6">
            <dl>
              <dt className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
                {fact.label}
              </dt>
              <dd className="mt-3 text-[0.9375rem] leading-[1.6] text-ink">
                {fact.value}
              </dd>
            </dl>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          <Ledger
            title={status.exists.title}
            items={status.exists.items}
            tone="exists"
          />
          <Ledger
            title={status.doesNotExist.title}
            items={status.doesNotExist.items}
            tone="absent"
          />
        </div>
      </Reveal>
    </Section>
  );
}
