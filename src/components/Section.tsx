import type { ReactNode } from "react";

import type { SectionMeta } from "@/content";

import { Reveal } from "./Reveal";

/** Horizontal shell. Every full-width band uses it, so the gutters agree. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-shell px-gutter ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
      {children}
    </p>
  );
}

/**
 * A page section: the shared vertical rhythm, a rule at the top, and the
 * eyebrow/heading/lead pattern used by every one of them.
 */
export function Section({
  meta,
  lead,
  children,
  raised = false,
}: {
  meta: SectionMeta;
  lead?: string;
  children: ReactNode;
  /** Tints the band, used to break up a long scroll. */
  raised?: boolean;
}) {
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-heading`}
      className={`border-t border-line py-section ${raised ? "bg-raised" : ""}`}
    >
      <Container>
        <Reveal>
          <div className="max-w-measure">
            <Eyebrow>{meta.eyebrow}</Eyebrow>
            <h2
              id={`${meta.id}-heading`}
              className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] tracking-[-0.015em] text-balance"
            >
              {meta.heading}
            </h2>
            {lead ? (
              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-muted">
                {lead}
              </p>
            ) : null}
          </div>
        </Reveal>

        {children}
      </Container>
    </section>
  );
}
