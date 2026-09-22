import { hero } from "@/content";

import { CropField } from "./CropField";
import { Cta } from "./Cta";
import { Frame } from "./Frame";
import { MachineSchematic } from "./MachineSchematic";
import { Container, Mono } from "./Section";

/** The same stagger as the scroll reveals, expressed as a CSS delay. */
function step(index: number) {
  return { animationDelay: `${(index * 0.08).toFixed(3)}s` };
}

/**
 * Above the fold, so it stays a server component and animates in with CSS.
 * Nothing here waits for JavaScript before it is painted.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      {/* The house, written out behind everything. */}
      <CropField className="absolute inset-x-0 top-16 -z-10 flex flex-col items-center" />

      <Container className="pt-[clamp(3.5rem,9vw,7rem)] pb-[clamp(2rem,5vw,3.5rem)]">
        <div className="flex flex-col items-center text-center">
          <div className="rise" style={step(0)}>
            <Mono>
              {hero.eyebrow} <span className="px-2 text-line-strong">/</span> discovery
              project
            </Mono>
          </div>

          <h1
            id="hero-heading"
            className="rise t-h1 mx-auto mt-8 mb-0 max-w-[17ch]"
            style={step(1)}
          >
            {hero.heading}
          </h1>

          <p
            className="rise t-lead mx-auto mt-8 mb-0 max-w-measure text-muted"
            style={step(2)}
          >
            {hero.lead}
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={step(3)}
          >
            {hero.ctas.map((cta) => (
              <Cta key={cta.href} cta={cta} />
            ))}
          </div>
        </div>
      </Container>

      {/* The drawing, full width. */}
      <div className="rise mt-[clamp(2rem,4vw,3.5rem)]" style={step(4)}>
        <Container>
          <MachineSchematic />
        </Container>
      </div>

      {/*
        Put immediately under the drawing on purpose: the machine above is a
        drawing, and the next thing the page does is say so.
      */}
      <Container className="pb-section">
        <div className="rise mt-[clamp(2.5rem,5vw,4rem)]" style={step(5)}>
          <Frame className="mx-auto max-w-[62ch] bg-paper p-8">
            <Mono className="text-signal">What does not exist yet</Mono>
            <p className="t-body mt-4 mb-0 text-muted">{hero.disclaimer}</p>
          </Frame>
        </div>
      </Container>
    </section>
  );
}
