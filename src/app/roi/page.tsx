import type { Metadata } from "next";

import { Container, Label } from "@/components/Container";
import { Roi } from "@/components/roi/Roi";
import { roi } from "@/content";

export const metadata: Metadata = {
  title: roi.meta.title,
  description: roi.meta.description,
  alternates: { canonical: "/roi" },
  openGraph: { title: roi.meta.title, description: roi.meta.description, url: "/roi" },
  twitter: { title: roi.meta.title, description: roi.meta.description },
};

/**
 * The ROI calculator. The opening is prose and follows the site's no-digit
 * rule; everything below it is the calculator, marked `data-numbers`, where
 * figures are the point.
 */
export default function RoiPage() {
  const { intro } = roi;

  return (
    <>
      <section aria-labelledby="roi-heading">
        <Container className="pt-[clamp(5rem,14svh,9rem)] pb-[clamp(3rem,8svh,5rem)]">
          <div className="rise" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <Label>{intro.eyebrow}</Label>
          </div>
          <h1 id="roi-heading" className="t-display mt-7 mb-0 max-w-[16ch]">
            <span className="line-mask">
              <span className="line-rise" style={{ "--d": "0.1s" } as React.CSSProperties}>
                {intro.heading}
              </span>
            </span>
          </h1>
          <p
            className="rise t-lead mt-8 mb-0 max-w-[38rem] text-muted"
            style={{ "--d": "0.35s" } as React.CSSProperties}
          >
            {intro.lead}
          </p>
        </Container>
      </section>

      <section aria-label={intro.eyebrow} data-numbers className="pb-section">
        <Roi />
      </section>
    </>
  );
}
