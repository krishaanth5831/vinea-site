import { platform } from "@/content";

import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Platform() {
  return (
    <Section meta={platform.meta} lead={platform.lead}>
      <div className="mt-16 flex flex-col gap-px border border-line bg-line">
        {platform.elements.map((element) => (
          <Reveal key={element.title} className="bg-paper p-8 sm:p-10">
            <div className="grid gap-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-12">
              <div>
                <h3 className="font-display text-[1.375rem] leading-[1.25] tracking-[-0.015em]">
                  {element.title}
                </h3>
                {/* The grower-side reason this element exists at all. */}
                <p className="mt-3 text-[0.875rem] leading-[1.6] text-accent">
                  {element.because}
                </p>
              </div>
              <p className="text-[0.9375rem] leading-[1.75] text-muted">
                {element.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-16 max-w-measure border-t border-line pt-10">
          <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
            {platform.pricingTitle}
          </h3>
          <p className="mt-6 text-[0.9375rem] leading-[1.75] text-ink">
            {platform.pricing}
          </p>
          <p className="mt-5 inline-block border border-line-strong bg-accent-soft px-3 py-1 text-xs uppercase tracking-[0.14em] text-accent">
            {platform.pricingLabel}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-12 max-w-measure text-[0.9375rem] leading-[1.7] text-muted">
          {platform.caveat}
        </p>
      </Reveal>
    </Section>
  );
}
