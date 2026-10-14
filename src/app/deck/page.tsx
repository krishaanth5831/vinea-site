import type { Metadata } from "next";

import { Button } from "@/components/Button";
import { Container, Label } from "@/components/Container";
import { Deck } from "@/components/deck/Deck";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { Thread } from "@/components/Thread";
import { deck } from "@/content";

export const metadata: Metadata = {
  title: deck.meta.title,
  description: deck.meta.description,
  alternates: { canonical: "/deck" },
  openGraph: { title: deck.meta.title, description: deck.meta.description, url: "/deck" },
  twitter: { title: deck.meta.title, description: deck.meta.description },
};

/**
 * The pitch deck as a page: a short opening, the slides as a stack the
 * reader scrolls through, and a way on to the calculator.
 *
 * The slides carry figures, which the rest of the site does not; the whole
 * list is marked `data-numbers` so the copy checks know it is meant.
 */
export default function DeckPage() {
  const { intro, outro } = deck;

  return (
    <>
      <section aria-labelledby="deck-heading" className="deck-intro">
        <Container className="pt-[clamp(5rem,14svh,9rem)] pb-[clamp(3rem,8svh,5rem)]">
          <div className="rise" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <Label>{intro.eyebrow}</Label>
          </div>
          <h1 id="deck-heading" className="t-display mt-7 mb-0 max-w-[14ch]">
            <span className="line-mask">
              <span className="line-rise" style={{ "--d": "0.1s" } as React.CSSProperties}>
                {intro.heading}
              </span>
            </span>
          </h1>
          <p
            className="rise t-lead mt-8 mb-0 max-w-[34rem] text-muted"
            style={{ "--d": "0.35s" } as React.CSSProperties}
          >
            {intro.lead}
          </p>
          <div
            className="rise mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
            style={{ "--d": "0.45s" } as React.CSSProperties}
          >
            {intro.ctas.map((cta) => (
              <Button key={cta.href} cta={cta} />
            ))}
          </div>
          <p
            className="rise t-mono mt-8 mb-0 hidden text-muted lg:block"
            style={{ "--d": "0.55s" } as React.CSSProperties}
          >
            {intro.hint}
          </p>
        </Container>
      </section>

      <section aria-label="Slides" data-numbers>
        <Deck slides={deck.slides} />
      </section>

      <section aria-labelledby="deck-next" className="deck-outro pb-section">
        <Thread />
        <Container className="mt-10 flex flex-col items-center text-center">
          <Reveal>
            <Label>{outro.eyebrow}</Label>
          </Reveal>
          <SplitReveal id="deck-next" className="t-h2 mt-7 mb-0 max-w-[18ch]">
            {outro.heading}
          </SplitReveal>
          <Reveal stagger className="flex flex-col items-center">
            <p className="t-lead mt-7 mb-0 max-w-[32rem] text-muted">{outro.lead}</p>
            <div className="mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              {outro.ctas.map((cta) => (
                <Button key={cta.href} cta={cta} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
