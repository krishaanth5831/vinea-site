import { status } from "@/content";

import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";

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
      <Mono className={tone === "exists" ? "text-ink" : "text-signal"}>
        {title}
      </Mono>
      <ul className="m-0 mt-7 flex list-none flex-col gap-4 p-0">
        {items.map((item) => (
          <li
            key={item}
            className={`t-body flex gap-4 border-t pt-4 ${
              tone === "exists" ? "border-line text-ink" : "border-line text-muted"
            }`}
          >
            <span aria-hidden="true" className="t-mono mt-1.5 text-line-strong">
              {tone === "exists" ? "◆" : "◇"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Status() {
  return (
    <Section meta={status.meta} lead={status.lead}>
      <Reveal stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {status.facts.map((fact) => (
          <Frame key={fact.label} className="bg-paper p-6">
            <dl className="m-0">
              <dt className="t-mono text-muted">{fact.label}</dt>
              <dd className="t-body mt-3 ml-0">{fact.value}</dd>
            </dl>
          </Frame>
        ))}
      </Reveal>

      <Reveal stagger className="mt-20 grid gap-14 md:grid-cols-2 md:gap-16">
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
      </Reveal>
    </Section>
  );
}
