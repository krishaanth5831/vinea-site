"use client";

import { useRef } from "react";

import { tasks } from "@/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { Frame } from "./Frame";
import { Plate } from "./Plate";
import { Reveal } from "./Reveal";
import { Mono, Section } from "./Section";
import { ToolHead } from "./ToolHead";

/** The marker that runs the rail as the reader works down the list. */
function useRail(
  trackRef: React.RefObject<HTMLDivElement | null>,
  markerRef: React.RefObject<HTMLDivElement | null>,
) {
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const marker = markerRef.current;
    if (!track || !marker || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        marker,
        { y: 0 },
        {
          y: () => track.offsetHeight - marker.offsetHeight,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    }, track);

    return () => context.revert();
  }, [trackRef, markerRef]);
}

export function Tasks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  useRail(trackRef, markerRef);

  return (
    <Section meta={tasks.meta} lead={tasks.lead} raised>
      <div ref={trackRef} className="relative mt-16 lg:pl-20">
        {/* The rail, and the thing travelling down it. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-px bg-line-strong lg:block"
        />
        <div
          ref={markerRef}
          aria-hidden="true"
          className="absolute left-0 top-0 hidden lg:block"
        >
          <span className="absolute -left-[3px] top-0 block size-[7px] rounded-full bg-signal" />
          <span className="absolute left-2 top-[2px] block h-px w-6 bg-signal" />
        </div>

        <div className="flex flex-col gap-6">
          {tasks.tasks.map((task) => (
            <Reveal key={task.name} as="div">
              <Frame className="bg-paper p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <ToolHead name={task.tool} className="size-16 shrink-0" />
                      <span className="t-mono border border-line-strong px-2.5 py-1.5 text-muted">
                        {task.status}
                      </span>
                    </div>

                    <h3 className="t-h3 mt-6 mb-0">{task.name}</h3>
                    <p className="t-body mt-3 mb-0 text-muted">{task.summary}</p>

                    <Plate name={task.image} className="mt-7" />
                  </div>

                  <dl className="m-0 grid gap-8 self-start sm:grid-cols-2 lg:gap-10">
                    <div>
                      <dt className="t-mono text-muted">What growers say</dt>
                      <dd className="t-body mt-4 ml-0">{task.pain}</dd>
                    </div>
                    <div>
                      <dt className="t-mono text-muted">Why it is hard</dt>
                      <dd className="t-body mt-4 ml-0">{task.hard}</dd>
                    </div>
                  </dl>
                </div>
              </Frame>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <Reveal>
          <Mono>{tasks.discardedTitle}</Mono>
        </Reveal>
        <Reveal stagger className="mt-8 grid gap-6 md:grid-cols-2">
          {tasks.discarded.map((entry) => (
            <div key={entry.claim} className="border-t border-line-strong pt-6">
              <p className="t-h3 m-0 text-muted line-through decoration-signal/60 decoration-1">
                {entry.claim}
              </p>
              <p className="t-body mt-4 mb-0">{entry.because}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
