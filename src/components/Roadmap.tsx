"use client";

import { useRef } from "react";
import { roadmap } from "@/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/**
 * The road ahead as a track: it lights as the reader scrolls, up to the
 * stage Vinea is in, where a marker keeps beating. Past that the track stays
 * dim, because none of it has happened.
 *
 * Under it, a lane for each module shows how far that module has got through
 * the same four steps.
 */
export function Roadmap() {
  const root = useRef<HTMLElement>(null);
  const now = Math.max(
    0,
    roadmap.stages.findIndex((stage) => stage.current),
  );
  /* How far along the track the current stage's marker sits. */
  const reach = (now + 0.5) / roadmap.stages.length;

  useIsomorphicLayoutEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".road-fill",
        { "--fill": 0 },
        {
          "--fill": reach,
          ease: "none",
          scrollTrigger: { trigger: ".road", start: "top 82%", end: "top 38%", scrub: 0.7 },
        },
      );
      gsap.from(".lane-cell.is-on", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".lanes", start: "top 85%", once: true },
      });
    }, section);
    return () => context.revert();
  }, [reach]);

  return (
    <section ref={root} id={roadmap.id} aria-labelledby={`${roadmap.id}-heading`} className="section">
      <Container>
        <SectionHead id={roadmap.id} eyebrow={roadmap.eyebrow} heading={roadmap.heading} />

        <div className="road mt-16" style={{ "--reach": reach } as React.CSSProperties}>
          <div aria-hidden="true" className="road-line">
            <span className="road-fill" />
          </div>
          <Reveal as="ol" stagger className="road-stages m-0 list-none p-0">
            {roadmap.stages.map((stage, i) => (
              <li
                key={stage.label}
                aria-current={stage.current ? "step" : undefined}
                className={`road-stage ${i < now ? "is-done" : ""} ${stage.current ? "is-now" : ""}`}
              >
                <span aria-hidden="true" className="road-node" />
                {stage.current ? <p className="road-here">{roadmap.here}</p> : null}
                <p className="t-mono m-0 text-muted">
                  {stage.label} <span className="text-faint">/</span> {stage.when}
                </p>
                <h3 className="mt-3 mb-0 text-[1.25rem] leading-snug font-medium tracking-[-0.02em] text-balance">
                  {stage.title}
                </h3>
                <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
                  {stage.items.map((item) => (
                    <li key={item} className="text-[0.9375rem] leading-relaxed text-pretty text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal className="lanes card mt-16 p-6 sm:p-8">
          <h3 className="t-label m-0 text-accent">{roadmap.lanes.heading}</h3>
          <p aria-hidden="true" className="lanes-legend t-mono mt-4 mb-0 text-muted">
            {roadmap.lanes.steps.join(" / ")}
          </p>
          <div className="lanes-grid mt-7" role="table" aria-label={roadmap.lanes.heading}>
            <div className="lane lane-head" role="row">
              <span role="columnheader" className="sr-only">
                Module
              </span>
              <span aria-hidden="true" />
              {roadmap.lanes.steps.map((step) => (
                <span key={step} role="columnheader" className="t-mono text-muted">
                  {step}
                </span>
              ))}
            </div>
            {roadmap.lanes.rows.map((row) => (
              <div key={row.name} className="lane" role="row">
                <p role="rowheader" className="m-0 flex flex-col gap-0.5">
                  <span className="t-label text-fg">{row.name}</span>
                  <span className="text-[0.875rem] text-muted">{row.job}</span>
                </p>
                {roadmap.lanes.steps.map((step, i) => {
                  const on = i < row.reached;
                  const head = on && i === row.reached - 1;
                  return (
                    <span
                      key={step}
                      role="cell"
                      className={`lane-cell ${on ? "is-on" : ""} ${head ? "is-head" : ""}`}
                    >
                      <span className="sr-only">{on ? `${step}: reached` : `${step}: not yet`}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
