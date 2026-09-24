"use client";

import { useRef } from "react";

import { ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { S } from "./Mark";

/*
 * A small drawing for each refusal, in the mark's own cells. Each one ships
 * showing its point at rest — the cut vine, the gap between runners, the one
 * busy column, the machine stalled mid-row — and plays as a loop while it is
 * on screen.
 */

type Cell = [c: number, r: number];

function Cells({ cells, className, tag }: { cells: Cell[]; className: string; tag?: string }) {
  return (
    <>
      {cells.map(([c, r]) => (
        <rect
          key={`${tag ?? className}-${c}-${r}`}
          className={className}
          data-tag={tag}
          x={c}
          y={r}
          width={S}
          height={S}
        />
      ))}
    </>
  );
}

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Too rough: the cut lands on the vine, and the truss falls. */
function Rough() {
  return (
    <>
      <Cells cells={range(0, 6).filter((r) => r !== 2).map((r) => [1, r])} className="dim" />
      <Cells cells={[[1, 2]]} className="dim" tag="cut" />
      <Cells cells={[[2, 2]]} className="dim" tag="stem" />
      <Cells
        cells={[
          [3, 2],
          [4, 2],
          [3, 3],
          [4, 3],
          [5, 3],
        ]}
        className="lit"
        tag="fruit"
      />
    </>
  );
}

/** Too slow: a person runs the row while the machine is still starting. */
function Slow() {
  return (
    <>
      <Cells cells={range(0, 6).map((c) => [c, 2])} className="dim" />
      <Cells cells={range(0, 6).map((c) => [c, 4])} className="dim" />
      <Cells cells={[[6, 2]]} className="lit" tag="person" />
      <Cells cells={[[2, 4]]} className="lit" tag="machine" />
    </>
  );
}

/** Too narrow: one column of the year is busy, and the rest sits idle. */
function Narrow() {
  const year: Cell[] = range(0, 6).flatMap((c) => range(1, 5).map((r) => [c, r] as Cell));
  return (
    <>
      <Cells cells={year.filter(([c]) => c !== 1)} className="dim" tag="idle" />
      <Cells cells={range(1, 5).map((r) => [1, r])} className="lit" tag="busy" />
    </>
  );
}

/** Too risky: the machine stops mid-row, and nobody is there to fix it. */
function Risky() {
  return (
    <>
      <Cells cells={range(0, 6).map((c) => [c, 5])} className="dim" />
      <Cells
        cells={[
          [3, 0],
          [3, 1],
          [3, 3],
        ]}
        className="lit"
        tag="alert"
      />
      <Cells cells={[[3, 5]]} className="lit" tag="machine" />
    </>
  );
}

const DRAWINGS = [Rough, Slow, Narrow, Risky];

/** Each loop, built against the drawing's own cells. */
function loop(svg: SVGSVGElement, kind: number) {
  const $ = (tag: string) => svg.querySelectorAll<SVGRectElement>(`[data-tag="${tag}"]`);
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });

  if (kind === 0) {
    tl.to($("cut"), { scale: 0, duration: 0.25, ease: "power2.in" })
      .to($("fruit"), {
        y: 5,
        rotation: () => gsap.utils.random(-120, 120),
        opacity: 0,
        duration: 0.9,
        ease: "power2.in",
        stagger: 0.07,
      })
      .to($("cut"), { scale: 1, duration: 0.3, ease: "back.out(2)" }, "+=0.3")
      .fromTo(
        $("fruit"),
        { y: -1.5, rotation: 0, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.05 },
      );
  } else if (kind === 1) {
    tl.fromTo($("person"), { x: -6 }, { x: 0, duration: 1.4, ease: "none" }, 0)
      .fromTo($("machine"), { x: -2 }, { x: 0, duration: 1.4, ease: "none" }, 0)
      .to([...$("person"), ...$("machine")], { opacity: 0, duration: 0.3 }, "+=0.7")
      .set([...$("person"), ...$("machine")], { opacity: 1 });
  } else if (kind === 2) {
    tl.fromTo(
      $("busy"),
      { opacity: 0.15 },
      { opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" },
    )
      .to($("idle"), {
        opacity: 0.35,
        duration: 0.4,
        stagger: { each: 0.03, from: "start" },
        yoyo: true,
        repeat: 1,
      }, "+=0.2")
      .to($("busy"), { opacity: 0.15, duration: 0.5 }, "+=0.4");
  } else {
    tl.fromTo($("machine"), { x: -3 }, { x: 0, duration: 1.2, ease: "power1.inOut" })
      .fromTo($("alert"), { opacity: 0 }, { opacity: 1, duration: 0.01 })
      .to([...$("alert"), ...$("machine")], {
        opacity: 0.15,
        duration: 0.01,
        repeat: 5,
        yoyo: true,
        repeatDelay: 0.22,
      })
      .to([...$("alert"), ...$("machine")], { opacity: 0, duration: 0.3 }, "+=0.5")
      .set($("machine"), { opacity: 1, x: -3 });
  }
  return tl;
}

export function Glyph({ kind }: { kind: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const Drawing = DRAWINGS[kind % DRAWINGS.length];

  useIsomorphicLayoutEffect(() => {
    const svg = ref.current;
    if (!svg || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const tl = loop(svg, kind);
      ScrollTrigger.create({
        trigger: svg,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    }, svg);

    return () => context.revert();
  }, [kind]);

  return (
    <svg
      ref={ref}
      viewBox={`-0.6 -0.6 ${6 + S + 1.2} ${6 + S + 1.2}`}
      aria-hidden="true"
      focusable="false"
      overflow="hidden"
      className="glyph block h-full w-full"
    >
      <Drawing />
    </svg>
  );
}
