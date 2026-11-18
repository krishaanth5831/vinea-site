"use client";

import { useEffect, useRef } from "react";

import type { DeckFigure as Figure } from "@/content";
import { prefersReducedMotion } from "@/lib/gsap";

/*
 * The drawings beside the slides, built from the mark's own square cells.
 *
 * Nothing here moves on its own. Each piece carries a class the deck's
 * timeline looks for (`fig-cell`, `fig-lit`, `fig-seg`, `fig-node`,
 * `fig-line`, `fig-row`), so a figure assembles when its slide arrives and
 * reads as a finished drawing when JavaScript or motion is off.
 */

const pct = (share: number) => `${Math.round(share * 100)}%`;

function Cells({ figure }: { figure: Extract<Figure, { kind: "cells" }> }) {
  const big = figure.total <= 6;
  return (
    <figure className="m-0">
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${figure.columns}, minmax(0, 1fr))`,
          maxWidth: big ? "24rem" : "26rem",
        }}
        role="img"
        aria-label={`${figure.lit} of ${figure.total}`}
      >
        {Array.from({ length: figure.total }, (_, i) => (
          <span key={i} className="fig-cell relative block aspect-square bg-[var(--s-line)]">
            {i < figure.lit ? <span className="fig-lit absolute inset-0 bg-[var(--s-fg)]" /> : null}
          </span>
        ))}
      </div>
      <figcaption className="t-mono mt-4 max-w-[22rem] text-[var(--s-muted)]">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

function Split({ figure }: { figure: Extract<Figure, { kind: "split" }> }) {
  return (
    <figure className="m-0 w-full max-w-[26rem]">
      <div className="flex h-10 gap-[3px]" aria-hidden="true">
        {figure.parts.map((part) => (
          <span
            key={part.label}
            className="fig-seg block h-full origin-left"
            style={{
              width: pct(part.share),
              background: part.tag ? "var(--s-fg)" : "var(--s-line)",
            }}
          />
        ))}
      </div>
      <dl className="m-0 mt-5 grid gap-2">
        {figure.parts.map((part) => (
          <div key={part.label} className="fig-row flex items-baseline gap-3 text-[0.9375rem]">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 translate-y-px"
              style={{ background: part.tag ? "var(--s-fg)" : "var(--s-line)" }}
            />
            <dt className="m-0 min-w-0 flex-1">
              {part.label}
              {part.tag ? (
                <span className="t-label ml-2 text-[0.625rem] text-[var(--s-muted)]">
                  {part.tag}
                </span>
              ) : null}
            </dt>
            <dd className="m-0 font-mono text-[0.8125rem] tabular-nums">{pct(part.share)}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="t-mono mt-4 text-[var(--s-muted)]">{figure.caption}</figcaption>
    </figure>
  );
}

function Modules({ figure }: { figure: Extract<Figure, { kind: "modules" }> }) {
  return (
    <figure className="m-0 w-full max-w-[28rem]" aria-label={`${figure.base} and its modules`}>
      <div className="grid grid-cols-4 gap-[3px]">
        {figure.modules.map((module) => (
          <div key={module.name} className="fig-cell flex flex-col gap-2">
            <span className="block aspect-square bg-[var(--s-fg)]" aria-hidden="true" />
            <span className="t-label text-[0.6875rem]">{module.name}</span>
            <span className="text-[0.8125rem] leading-snug text-[var(--s-muted)]">
              {module.job}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <span className="fig-seg block h-3 origin-left bg-[var(--s-fg)]" aria-hidden="true" />
        <span className="t-label mt-2 block text-[0.6875rem]">{figure.base}</span>
      </div>
    </figure>
  );
}

function Steps({ figure }: { figure: Extract<Figure, { kind: "steps" }> }) {
  return (
    <ol className="relative m-0 grid w-full max-w-[26rem] list-none gap-5 p-0">
      <span
        aria-hidden="true"
        className="fig-line absolute top-1.5 bottom-1.5 left-[0.3125rem] w-px origin-top bg-[var(--s-line)]"
      />
      {figure.steps.map((step) => (
        <li key={step} className="fig-row relative flex items-center gap-4">
          <span aria-hidden="true" className="fig-node relative size-2.5 shrink-0 bg-[var(--s-fg)]" />
          <span className="text-[clamp(1rem,1.5vw,1.25rem)] leading-snug font-medium tracking-[-0.015em]">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Table({ figure }: { figure: Extract<Figure, { kind: "table" }> }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="t-mono text-[var(--s-muted)]">
          {figure.columns.map((column) => (
            <th key={column} scope="col" className="pb-3 pr-4 font-normal">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {figure.rows.map(([name, since, raised]) => (
          <tr key={name} className="fig-row border-t border-[var(--s-line)] align-baseline">
            <th
              scope="row"
              className="py-3 pr-4 text-[clamp(1rem,1.4vw,1.25rem)] font-medium tracking-[-0.015em]"
            >
              {name}
            </th>
            <td className="py-3 pr-4 font-mono text-[0.875rem] tabular-nums">{since}</td>
            <td className="py-3 text-[clamp(0.9375rem,1.2vw,1.0625rem)] text-[var(--s-muted)]">
              {raised}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Stats({ figure }: { figure: Extract<Figure, { kind: "stats" }> }) {
  return (
    <div className="fig-stats grid w-full gap-6 sm:grid-cols-3">
      {figure.stats.map((stat) => (
        <div key={stat.value} className="fig-row grid content-start gap-3">
          <p className="fig-stat-value m-0">{stat.value}</p>
          <p className="m-0 max-w-[22rem] text-[clamp(0.9375rem,1.25vw,1.125rem)] leading-snug text-[var(--s-muted)]">
            {stat.text}
          </p>
        </div>
      ))}
    </div>
  );
}

type MediaItem = Extract<Figure, { kind: "media" }>["items"][number];

/**
 * One of the deck's clips. It plays from its first frame each time its
 * slide becomes the current one, so a reader sees the whole take, and it
 * pauses when the slide is left. The stack keeps covered slides on screen,
 * so "on screen" is not enough to decide. Under reduced motion it never
 * starts on its own; the controls are shown instead, and the poster stands
 * in until someone presses play. Print gets the poster as an image.
 */
function DeckClip({ item, active }: { item: MediaItem; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.controls = true;
      return;
    }
    if (active) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <>
      <video
        ref={ref}
        className="fig-media-video"
        src={`/deck/${item.name}.mp4`}
        poster={`/deck/${item.name}.webp`}
        aria-label={item.alt}
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="fig-media-print" src={`/deck/${item.name}.webp`} alt="" aria-hidden="true" />
    </>
  );
}

function Media({ figure, active }: { figure: Extract<Figure, { kind: "media" }>; active: boolean }) {
  return (
    <div className="fig-media" data-count={figure.items.length}>
      {figure.items.map((item) => (
        <figure key={item.name} className="fig-media-item m-0" data-ratio={item.ratio}>
          <div className="fig-media-frame">
            {item.type === "video" ? (
              <DeckClip item={item} active={active} />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`/deck/${item.name}.webp`} alt={item.alt} loading="lazy" decoding="async" />
            )}
          </div>
          <figcaption className="t-mono mt-3 text-[var(--s-muted)]">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function DeckFigure({ figure, active = false }: { figure: Figure; active?: boolean }) {
  switch (figure.kind) {
    case "stats":
      return <Stats figure={figure} />;
    case "media":
      return <Media figure={figure} active={active} />;
    case "cells":
      return <Cells figure={figure} />;
    case "split":
      return <Split figure={figure} />;
    case "modules":
      return <Modules figure={figure} />;
    case "steps":
      return <Steps figure={figure} />;
    case "table":
      return <Table figure={figure} />;
  }
}
