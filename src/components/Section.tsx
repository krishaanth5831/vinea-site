import type { ReactNode } from "react";

import type { SectionMeta } from "@/content";

import { Reveal } from "./Reveal";

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

/** A mono label. Used for eyebrows, part names and column headings. */
export function Mono({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`t-mono text-muted ${className}`}>{children}</p>;
}

/** The rule-and-label header every band opens with. */
export function BandRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 border-t border-line pt-4">
      <span className="t-mono text-signal">◆</span>
      <span className="t-mono text-muted">{label}</span>
    </div>
  );
}

export function Section({
  meta,
  lead,
  children,
  raised = false,
}: {
  meta: SectionMeta;
  lead?: string;
  children: ReactNode;
  raised?: boolean;
}) {
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-heading`}
      className={`py-section ${raised ? "bg-raised" : ""}`}
    >
      <Container>
        <Reveal>
          <BandRule label={meta.eyebrow} />
        </Reveal>

        <Reveal className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <h2 id={`${meta.id}-heading`} className="t-h2 m-0 max-w-[18ch]">
            {meta.heading}
          </h2>
          {lead ? (
            <p className="t-lead m-0 max-w-measure self-end text-muted">{lead}</p>
          ) : null}
        </Reveal>

        {children}
      </Container>
    </section>
  );
}
