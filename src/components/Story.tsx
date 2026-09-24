"use client";

import { useRef } from "react";

import { hero, why } from "@/content";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { Button } from "./Button";
import { Container, Label } from "./Container";
import { MARK_CELLS, MARK_CENTRE, Mark, S } from "./Mark";

/** Delay for each piece of the entrance, so they arrive in reading order. */
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

/**
 * Must match the gate on `.story` in globals.css, which decides the layout
 * before paint. The two have to agree or the stage and its motion disagree.
 */
const STAGED = "(prefers-reduced-motion: no-preference) and (min-height: 37.5rem)";
const WIDE = "(min-width: 64rem)";

/*
 * Where each cell flies when the mark comes apart. Seeded, so a resize that
 * rebuilds the timeline scatters the cells to the same places.
 */
function scatter() {
  let state = 11;
  const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  return MARK_CELLS.map((cell) => {
    const dx = cell.c - MARK_CENTRE.c;
    const dy = cell.r - MARK_CENTRE.r;
    const reach = 1.6 + rand() * 2.4;
    return {
      x: dx * reach * 0.6 + (rand() - 0.5) * 3,
      y: dy * reach * 0.6 + (rand() - 0.5) * 3,
      rotation: (rand() - 0.5) * 220,
      opacity: 0.25 + rand() * 0.45,
    };
  });
}

/**
 * The hero and the pivot, on one sticky stage.
 *
 * The reader scrolls: the hero steps back, the mark takes the middle, comes
 * apart while the story is told in three beats, and collapses into the empty
 * cell at its own centre — square one. A thread then falls from that square
 * into the rest of the page.
 *
 * Where the stage is not used (see `.story` in globals.css) the same markup
 * is a plain stack: the hero, the mark, and the beats as lines of text.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);
  const words = hero.heading[1].split(" ");
  const last = words.pop();
  const rest = words.join(" ");

  useIsomorphicLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const q = <T extends Element>(selector: string) =>
      Array.from(section.querySelectorAll<T>(selector));

    const shapes = q<SVGElement>(".mark-shape");

    if (prefersReducedMotion()) {
      gsap.set(shapes, { opacity: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    /* The mark assembles itself, cell by cell, as the page opens. */
    mm.add("all", () => {
      gsap.fromTo(
        shapes,
        { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: 0.04,
          delay: 0.3,
        },
      );
    });

    /* The mark leans towards the pointer: outer cells travel furthest. */
    mm.add("(pointer: fine)", () => {
      if (!hasFinePointer()) return;
      const stage = section.querySelector<HTMLElement>(".story-stage");
      const mark = section.querySelector<SVGSVGElement>(".story-mark svg");
      if (!stage || !mark) return;

      const movers = shapes.map((shape) => {
        const cell = shape.parentElement!;
        const depth =
          Math.hypot(
            Number(cell.dataset.c) - MARK_CENTRE.c,
            Number(cell.dataset.r) - MARK_CENTRE.r,
          ) / 3;
        return {
          depth,
          x: gsap.quickTo(shape, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(shape, "y", { duration: 0.8, ease: "power3.out" }),
        };
      });

      const onMove = (event: PointerEvent) => {
        const box = mark.getBoundingClientRect();
        const nx = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
        const ny = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
        for (const mover of movers) {
          mover.x(nx * mover.depth * 0.9);
          mover.y(ny * mover.depth * 0.9);
        }
      };
      const onLeave = () => movers.forEach((mover) => (mover.x(0), mover.y(0)));

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    });

    /* The story itself, scrubbed to the scroll. */
    mm.add({ staged: STAGED, wide: WIDE }, (context) => {
      const { staged, wide } = context.conditions as { staged: boolean; wide: boolean };
      if (!staged) return;

      const heroCopy = section.querySelector(".story-hero-copy");
      const markBox = section.querySelector<HTMLElement>(".story-mark");
      const label = section.querySelector(".story-label");
      const beats = q<HTMLElement>(".story-beat");
      const ticks = q<HTMLElement>(".story-tick");
      const tickRow = section.querySelector(".story-ticks");
      const cells = q<SVGGElement>(".mark-cell");
      const squareOne = section.querySelector(".square-one");
      const thread = section.querySelector(".story-thread");
      if (!heroCopy || !markBox || !label || !tickRow || !squareOne || !thread) return;

      const flung = scatter();

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      /* The hero, and where the mark waits beside it. */
      if (wide) {
        tl.fromTo(
          markBox,
          {
            x: () => section.clientWidth * 0.27,
            y: () => -window.innerHeight * 0.07,
            scale: 0.8,
          },
          { x: 0, y: 0, scale: 1, duration: 1.2 },
          0,
        );
      } else {
        tl.fromTo(markBox, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1 }, 0.3);
      }
      /* autoAlpha, not opacity: the hidden buttons must stop taking taps and focus. */
      tl.to(heroCopy, { y: -90, autoAlpha: 0, duration: 1, ease: "power2.in" }, 0);

      /* Beat one: the polite yes. The mark is whole. */
      tl.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 1);
      tl.fromTo(tickRow, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1);
      tl.fromTo(beats[0], { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1);
      tl.to(ticks[0], { opacity: 1, duration: 0.2 }, 1.1);
      tl.to(beats[0], { opacity: 0, y: -36, duration: 0.5 }, 2.6);

      /* Beat two: it was politeness. The mark comes apart. */
      cells.forEach((cell, i) => {
        tl.to(
          cell,
          {
            x: flung[i].x,
            y: flung[i].y,
            rotation: flung[i].rotation,
            opacity: flung[i].opacity,
            transformOrigin: "50% 50%",
            duration: 1.6,
            ease: "power3.inOut",
          },
          2.5 + (i % 5) * 0.06,
        );
      });
      tl.fromTo(beats[1], { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6 }, 3);
      tl.to(ticks[1], { opacity: 1, duration: 0.2 }, 3);
      tl.to(beats[1], { opacity: 0, y: -36, duration: 0.5 }, 4.7);

      /* Beat three: back to square one. Every cell falls into the centre. */
      cells.forEach((cell) => {
        const c = Number(cell.dataset.c);
        const r = Number(cell.dataset.r);
        tl.to(
          cell,
          {
            x: MARK_CENTRE.c - c,
            y: MARK_CENTRE.r - r,
            rotation: 0,
            scale: 0.4,
            opacity: 0,
            duration: 1.5,
            ease: "power3.inOut",
          },
          4.6,
        );
      });
      tl.fromTo(
        squareOne,
        { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" },
        5.8,
      );
      tl.fromTo(beats[2], { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6 }, 5.1);
      tl.to(ticks[2], { opacity: 1, duration: 0.2 }, 5.1);

      /* The thread falls from square one into the rest of the page. */
      tl.to(thread, { scaleY: 1, duration: 1.4, ease: "none" }, 6.5);
      tl.to({}, { duration: 0.4 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-heading" className="story relative">
      {/* Where "What went wrong" lands: the first beat, fully in view. */}
      <span id={why.id} aria-hidden="true" className="story-anchor" />

      <div className="story-stage">
        <div className="story-hero">
          <Container className="story-hero-copy">
            <div className="rise" style={at(0.05)}>
              <Label>{hero.eyebrow}</Label>
            </div>

            <h1 id="hero-heading" className="t-display mt-7 mb-0">
              <span className="line-mask">
                <span className="line-rise" style={at(0.1)}>
                  {hero.heading[0]}
                </span>
              </span>
              <span className="line-mask">
                <span className="line-rise" style={at(0.22)}>
                  {rest}{" "}
                  {/* The cursor never wraps away from the last word. */}
                  <span className="whitespace-nowrap">
                    {last}
                    <span aria-hidden="true" className="cursor-square" />
                  </span>
                </span>
              </span>
            </h1>

            <p className="rise t-lead mt-8 mb-0 max-w-[31rem] text-muted" style={at(0.45)}>
              {hero.lead}
            </p>

            <div
              className="rise mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
              style={at(0.55)}
            >
              {hero.ctas.map((cta) => (
                <Button key={cta.href} cta={cta} />
              ))}
            </div>

            <p className="rise t-mono mt-8 mb-0 text-muted" style={at(0.65)}>
              {hero.note}
            </p>
          </Container>
        </div>

        <div className="story-mark mark-assemble text-fg">
          <Mark className="story-mark-svg block">
            <rect
              className="square-one"
              x={MARK_CENTRE.c}
              y={MARK_CENTRE.r}
              width={S}
              height={S}
              opacity="0"
            />
          </Mark>
        </div>

        <div aria-hidden="true" className="story-thread" />

        <div className="story-after">
          <Container className="flex flex-col items-center">
            <h2 className="story-label t-label m-0 inline-flex items-center gap-2.5 text-muted">
              <span aria-hidden="true" className="size-1.5 bg-fg" />
              {why.eyebrow}
            </h2>
            <div className="story-beats t-beat mt-6 max-w-[21ch]">
              {why.beats.map((beat) => (
                <p key={beat} className="story-beat">
                  {beat}
                </p>
              ))}
            </div>
            <div aria-hidden="true" className="story-ticks mt-7 gap-2">
              {why.beats.map((beat) => (
                <span key={beat} className="story-tick size-1.5 bg-fg opacity-20" />
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
