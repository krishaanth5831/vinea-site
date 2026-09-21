import { method } from "@/content";

import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Section } from "./Section";

export function Method() {
  return (
    <Section meta={method.meta} lead={method.lead}>
      <RevealGroup className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2">
        {method.steps.map((step) => (
          <RevealItem key={step.title} className="bg-paper p-8">
            <h3 className="font-display text-xl tracking-[-0.01em]">
              {step.title}
            </h3>
            <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted">
              {step.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
        {method.columns.map((column) => (
          <RevealItem key={column.title}>
            <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
              {column.title}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="border-t border-line pt-4 text-[0.9375rem] leading-[1.65] text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal>
        <p className="mt-20 max-w-[48ch] font-display text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.3] tracking-[-0.015em] text-pretty">
          {method.conclusion}
        </p>
      </Reveal>
    </Section>
  );
}
