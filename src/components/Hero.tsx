import { hero } from "@/content";
import { STAGGER } from "@/lib/motion";

import { AisleMotion } from "./AisleMotion";
import { Cta } from "./Cta";
import { Container, Eyebrow } from "./Section";

/** Same stagger as the scroll reveals, expressed as a CSS delay. */
function step(index: number) {
  return { animationDelay: `${(index * STAGGER).toFixed(3)}s` };
}

/**
 * Above the fold, so it stays a server component and animates in with CSS.
 * Nothing here waits for JavaScript before it is painted.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="py-section">
      <Container>
        <div className="rise" style={step(0)}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </div>

        <h1
          id="hero-heading"
          className="rise mt-6 max-w-[19ch] font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.02em] text-balance"
          style={step(1)}
        >
          {hero.heading}
        </h1>

        <p
          className="rise mt-8 max-w-measure text-[1.0625rem] leading-[1.75] text-muted"
          style={step(2)}
        >
          {hero.lead}
        </p>

        <div
          className="rise mt-10 flex flex-wrap items-center gap-3"
          style={step(3)}
        >
          {hero.ctas.map((cta) => (
            <Cta key={cta.href} cta={cta} />
          ))}
        </div>

        {/* The honesty note, stated rather than tucked away. */}
        <p
          className="rise mt-12 max-w-measure border-l-2 border-accent pl-5 text-[0.9375rem] leading-[1.7] text-muted"
          style={step(4)}
        >
          {hero.disclaimer}
        </p>

        <div className="rise mt-16 sm:mt-20" style={step(5)}>
          <AisleMotion />
        </div>
      </Container>
    </section>
  );
}
