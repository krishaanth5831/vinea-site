import { platform } from "@/content";

import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";

export function Platform() {
  return (
    <Section meta={platform.meta} lead={platform.lead}>
      <Reveal stagger className="mt-16 flex flex-col gap-6">
        {platform.elements.map((element) => (
          <Frame key={element.title} className="bg-paper p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-14">
              <div>
                <h3 className="t-h3 m-0">{element.title}</h3>
                {/* The grower-side observation this element follows from. */}
                <p className="t-mono mt-4 mb-0 text-signal">{element.because}</p>
              </div>
              <p className="t-body m-0 self-center text-muted">{element.body}</p>
            </div>
          </Frame>
        ))}
      </Reveal>

      <Reveal className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-14">
        <div>
          <Mono>{platform.pricingTitle}</Mono>
          <p className="t-mono mt-5 inline-block border border-line-strong bg-signal-soft px-3 py-2 text-signal">
            {platform.pricingLabel}
          </p>
        </div>
        <div>
          <p className="t-body m-0">{platform.pricing}</p>
          <p className="t-body mt-6 mb-0 text-muted">{platform.caveat}</p>
        </div>
      </Reveal>
    </Section>
  );
}
