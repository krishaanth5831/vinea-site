import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Button } from "@/components/Button";
import { Clip } from "@/components/Clip";
import { Container, Label } from "@/components/Container";
import { build, learn, status } from "@/content";

export const metadata: Metadata = {
  title: build.meta.title,
  description: build.meta.description,
  alternates: { canonical: "/build" },
  openGraph: { title: build.meta.title, description: build.meta.description, url: "/build" },
  twitter: { title: build.meta.title, description: build.meta.description },
};

/* The same three loops as the home page's "How it learns", in the same order. */
const CLIPS = ["learn-record", "learn-learn", "learn-work"];

function Part({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-20 first:mt-0">
      <h2
        id={`${id}-heading`}
        className="m-0 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance"
      >
        {heading}
      </h2>
      <div className="mt-5 flex flex-col gap-5 leading-relaxed text-pretty">{children}</div>
    </section>
  );
}

function Dots({ items }: { items: ReactNode[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5">
          <span aria-hidden="true" className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-accent" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The cofounder page. A single reading column, written in the first person,
 * sent to candidates directly rather than linked from the nav. All copy is
 * in src/content/build.ts.
 */
export default function BuildPage() {
  const { intro, how, hard, now, why, who, start, me, cta } = build;

  return (
    <>
      <section aria-labelledby="build-heading">
        <Container className="pt-[clamp(5rem,14svh,9rem)]">
          <div className="mx-auto max-w-[44rem]">
            <div className="rise" style={{ "--d": "0.05s" } as React.CSSProperties}>
              <Label>{intro.eyebrow}</Label>
            </div>
            <h1 id="build-heading" className="t-display mt-7 mb-0">
              <span className="line-mask">
                <span className="line-rise" style={{ "--d": "0.1s" } as React.CSSProperties}>
                  {intro.heading}
                </span>
              </span>
            </h1>
            <div
              className="rise mt-9 flex flex-col gap-5 t-lead text-pretty"
              style={{ "--d": "0.35s" } as React.CSSProperties}
            >
              {intro.paragraphs.map((p) => (
                <p key={p} className="m-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-20 pb-section">
        <article className="mx-auto max-w-[44rem]">
          <Part id="how" heading={how.heading}>
            <p className="m-0">{how.lead}</p>
            <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
              {how.steps.map((step, i) => (
                <li key={step.label} className="min-w-0">
                  <article className="card flex h-full flex-col overflow-hidden">
                    <div className="learn-frame">
                      <Clip name={CLIPS[i]} label={learn.steps[i].alt} />
                      <span className="render-tag">{how.badge}</span>
                    </div>
                    <div className="p-4">
                      <p className="t-label m-0 text-accent">{step.label}</p>
                      <p className="mt-2 mb-0 text-[0.9375rem] leading-normal text-muted">{step.body}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
            <p className="m-0">{how.spine}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {how.modules.map((m) => (
                <li key={m.name} className="chip">
                  <span className="mr-1.5 font-medium text-fg">{m.name}</span>
                  {m.job}
                </li>
              ))}
            </ul>
            <p className="m-0">{how.flywheel}</p>
          </Part>

          <Part id="hard" heading={hard.heading}>
            <p className="m-0">{hard.lead}</p>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {hard.items.map((item) => (
                <li key={item.title} className="border-l-2 border-line-strong pl-5">
                  <strong className="block font-medium">{item.title}</strong>
                  <span className="text-muted">{item.body}</span>
                </li>
              ))}
            </ul>
          </Part>

          <Part id="now" heading={now.heading}>
            <Dots items={now.items} />
            <p className="m-0 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-muted">{now.linksLead}</span>
              {status.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="t-mono link-line text-fg"
                >
                  {link.label}
                </a>
              ))}
            </p>
          </Part>

          <Part id="why" heading={why.heading}>
            <blockquote className="m-0 border-l-[3px] border-accent pl-5 text-[clamp(1.25rem,2vw,1.5rem)] leading-snug font-medium tracking-[-0.02em]">
              {why.quote}
            </blockquote>
            {why.paragraphs.map((p) => (
              <p key={p} className="m-0">
                {p}
              </p>
            ))}
          </Part>

          <Part id="who" heading={who.heading}>
            <p className="m-0">{who.lead}</p>
            <Dots
              items={who.items.map((item) => (
                <>
                  <strong className="font-medium">{item.title}</strong>{" "}
                  <span className="text-muted">{item.body}</span>
                </>
              ))}
            />
          </Part>

          <Part id="start" heading={start.heading}>
            <div className="card p-6 sm:p-7">
              <p className="m-0">{start.lead}</p>
              <ol className="m-0 mt-5 flex list-none flex-col gap-4 p-0">
                {start.steps.map((step) => (
                  <li key={step.when} className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
                    <span className="t-label pt-[0.3em] text-accent">{step.when}</span>
                    <span className="min-w-0 text-muted">{step.body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="m-0">{start.after}</p>
          </Part>

          <Part id="me" heading={me.heading}>
            {me.paragraphs.map((p) => (
              <p key={p} className="m-0">
                {p}
              </p>
            ))}
          </Part>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8">
            <p className="m-0 t-lead">{cta.lead}</p>
            <Button cta={cta.button} />
          </div>
        </article>
      </Container>
    </>
  );
}
