import { method } from "@/content";

import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";

export function Method() {
  return (
    <Section meta={method.meta} lead={method.lead}>
      <Reveal stagger className="mt-16 grid gap-6 md:grid-cols-2">
        {method.steps.map((step) => (
          <Frame key={step.title} className="bg-paper p-8">
            <h3 className="t-h3 m-0">{step.title}</h3>
            <p className="t-body mt-4 mb-0 text-muted">{step.body}</p>
          </Frame>
        ))}
      </Reveal>

      <Reveal stagger className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
        {method.columns.map((column) => (
          <div key={column.title}>
            <Mono>{column.title}</Mono>
            <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="t-body border-t border-line pt-4 text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-24 border-t border-ink pt-10">
        <p className="t-h2 m-0 max-w-[26ch]">{method.conclusion}</p>
      </Reveal>
    </Section>
  );
}
