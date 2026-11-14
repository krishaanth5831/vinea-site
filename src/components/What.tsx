"use client";

import { useRef, useState } from "react";
import { what, type WhatBeat } from "@/content";
import { ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToY } from "@/lib/lenis";
import { SEQ } from "@/lib/renders";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Container } from "./Container";
import { Render } from "./Render";
import { SectionHead } from "./SectionHead";

/**
 * Must match the gate on `.what-track` in globals.css, which decides the
 * layout before paint. The two have to agree or the stage and its motion
 * disagree.
 */
const STAGED =
  "(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 40rem)";

/** How far through the scroll the rendered frames run; past it, the view cuts to the crop wire. */
const WIRE_AT = 0.93;

/** Which module is on the base, or on its way to it, in each beat. */
const MODULE_OF: Record<WhatBeat["key"], number> = {
  look: 0,
  reach: 0,
  carry: 0,
  swap1: 1,
  deleaf: 1,
  swap2: 2,
  lower: 2,
  wire: 2,
};

/** The frame each module's button goes to. */
const MODULE_FRAME = [SEQ.beats.reach, SEQ.beats.deleaf, SEQ.beats.lower];

/** The stills that stand in for the sequence where it isn't played. */
const STILLS = ["what-harvest", "what-deleaf", "hoist"];

const BEAT_STARTS = what.beats.map((beat) =>
  beat.key === "wire" ? Number.POSITIVE_INFINITY : SEQ.beats[beat.key],
);

/**
 * What the robot is, shown.
 *
 * On a wide screen the picture holds still and the reader scrolls through a
 * rendered sequence: the robot looks along the row, reaches in, cuts a truss
 * and carries it to the crate; then the module lifts off the base and the
 * next one comes down, twice. The frames are a still background with only
 * the moving parts drawn over it, which is what makes that many of them
 * light enough to load.
 *
 * On a phone, or with motion turned down, three stills stand in and the
 * buttons under them change the module.
 */
export function What() {
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [staged, setStaged] = useState(false);
  const [beat, setBeat] = useState(0);
  const [scan, setScan] = useState(0);
  const [tab, setTab] = useState(0);
  const now = what.beats[beat];
  const moduleIndex = staged ? MODULE_OF[now.key] : tab;
  const mod = what.modules[moduleIndex];

  useIsomorphicLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();

    mm.add(STAGED, () => {
      const figure = el.querySelector<HTMLElement>(".what-figure");
      const canvas = el.querySelector<HTMLCanvasElement>(".what-canvas");
      const pen = canvas?.getContext("2d");
      if (!figure || !canvas || !pen) return;
      setStaged(true);

      canvas.width = 1600;
      canvas.height = 900;
      const plate = new Image();
      const frames: HTMLImageElement[] = [];
      const ready: boolean[] = [];
      let want = 0;

      /* Draws the frame the scroll is on, or the nearest one that has arrived. */
      const draw = () => {
        if (!plate.complete || plate.naturalWidth === 0) return;
        let f = want;
        while (f >= 0 && !ready[f]) f--;
        if (f < 0) {
          f = want;
          while (f < SEQ.frames && !ready[f]) f++;
        }
        const { width, height } = canvas;
        pen.drawImage(plate, 0, 0, width, height);
        if (f < SEQ.frames && ready[f]) {
          const { left, right, top, bottom } = SEQ.crop;
          pen.drawImage(frames[f], left * width, top * height, (right - left) * width, (bottom - top) * height);
        }
      };
      plate.onload = draw;
      plate.src = "/renders/seq/plate.webp";

      /* The frames load in order, a few at a time, once the section is near. */
      let next = 0;
      let stopped = false;
      const load = () => {
        if (stopped || next >= SEQ.frames) return;
        const i = next++;
        const image = new Image();
        image.onload = () => {
          ready[i] = true;
          if (Math.abs(i - want) < 4) draw();
          load();
        };
        image.onerror = load;
        image.src = `/renders/seq/${String(i).padStart(3, "0")}.webp`;
        frames[i] = image;
      };
      const near = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          near.disconnect();
          for (let k = 0; k < 6; k++) load();
        },
        { rootMargin: "150% 0px" },
      );
      near.observe(el);

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          const p = self.progress;
          const frame = Math.round(Math.min(1, p / WIRE_AT) * (SEQ.frames - 1));
          if (frame !== want) {
            want = frame;
            draw();
          }
          const wire = Math.max(0, Math.min(1, (p - (WIRE_AT - 0.02)) / 0.035));
          figure.style.setProperty("--wire", wire.toFixed(3));

          let b = 0;
          BEAT_STARTS.forEach((start, i) => {
            if (frame >= start) b = i;
          });
          if (p >= WIRE_AT) b = what.beats.length - 1;
          setBeat((prev) => (prev === b ? prev : b));

          /* While it looks: first every truss is framed, then the ready one is picked out. */
          const level = frame < 3 || frame > SEQ.beats.reach + 5 ? 0 : frame < 10 ? 1 : 2;
          setScan((prev) => (prev === level ? prev : level));
        },
      });
      trigger.current = st;

      return () => {
        stopped = true;
        near.disconnect();
        st.kill();
        trigger.current = null;
        setStaged(false);
      };
    });

    /* The picture opens up as it comes into view. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const figure = el.querySelector(".what-figure");
      if (!figure) return;
      gsap.fromTo(
        figure,
        { scale: 0.9, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: figure, start: "top 96%", end: "top 38%", scrub: 0.6 },
        },
      );
    });

    return () => mm.revert();
  }, []);

  /* A click goes where the scroll would have: the stage never fights the reader. */
  const go = (index: number) => {
    const st = trigger.current;
    if (!st) {
      setTab(index);
      return;
    }
    const progress = ((MODULE_FRAME[index] + 3) / (SEQ.frames - 1)) * WIRE_AT;
    scrollToY(st.start + (st.end - st.start) * progress);
  };

  return (
    <section id={what.id} aria-labelledby={`${what.id}-heading`} className="section">
      <Container>
        <SectionHead id={what.id} eyebrow={what.eyebrow} heading={what.heading} lead={what.lead} />
      </Container>

      <div ref={track} className="what-track mt-14">
        <div className="what-sticky">
          <Container className="flex flex-col items-center">
            <figure className="what-figure">
              <div className="what-frame" data-scan={scan}>
                {what.modules.map((m, i) => (
                  <Render
                    key={m.key}
                    name={STILLS[i]}
                    alt={
                      i === moduleIndex
                        ? `A concept render of the Vinea base on the heating pipes between two rows of tomato plants at night, with the ${m.label.toLowerCase()} module.`
                        : ""
                    }
                    className={`what-layer ${i === moduleIndex ? "is-on" : ""}`}
                  />
                ))}
                <canvas
                  className="what-canvas"
                  role="img"
                  aria-label="A rendered sequence: the robot looks along the row, cuts a ripe truss and carries it to its crate, then its module is swapped for the deleafing module and then for the lowering module."
                />
                <Render name="hoist" alt="" className="what-wire" />
                <span className="render-tag">{what.badge}</span>

                <span aria-hidden="true" className="what-scanline" />
                {SEQ.marks.map((mark) => (
                  <span
                    key={mark.y}
                    aria-hidden="true"
                    className={`what-mark ${mark.ready ? "is-ready" : ""}`}
                    style={{
                      left: `${mark.x * 100}%`,
                      top: `${mark.y * 100}%`,
                      height: `${mark.h * 100}%`,
                    }}
                  >
                    <span className="what-mark-tag">{mark.ready ? what.scan.ready : what.scan.wait}</span>
                  </span>
                ))}
              </div>

              <figcaption className="what-panel" aria-live="polite">
                <div key={now.key} className="panel-in">
                  <p className="t-label m-0 text-accent">{now.name}</p>
                  <p className="mt-2.5 mb-0 text-[1.0625rem] leading-snug text-pretty">{now.body}</p>
                </div>
              </figcaption>

              <div className="what-switch" role="group" aria-label={what.modulesLabel}>
                <p className="t-mono m-0 text-muted">{what.modulesLabel}</p>
                <div className="what-tabs" style={{ "--i": moduleIndex } as React.CSSProperties}>
                  <span aria-hidden="true" className="what-thumb" />
                  {what.modules.map((m, i) => (
                    <button
                      key={m.key}
                      type="button"
                      aria-pressed={i === moduleIndex}
                      onClick={() => go(i)}
                      className="what-tab"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <p key={mod.key} className="panel-in m-0 text-[0.9375rem] leading-snug text-pretty text-muted">
                  <span className="t-label mr-2 text-fg">{mod.name}</span>
                  {mod.line}
                </p>
              </div>
            </figure>

            <div aria-hidden="true" className="what-pips">
              {what.beats.map((item, i) => (
                <span key={item.key} className={i <= beat ? "is-on" : ""} />
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* The same idea as plain text, where the sequence isn't played. */}
      <Container className="what-list">
        <ul className="m-0 mt-10 grid list-none gap-4 p-0 sm:grid-cols-3">
          {what.parts.map((item) => (
            <li key={item.key} className="card p-6">
              <p className="t-label m-0 text-accent">{item.name}</p>
              <p className="mt-3 mb-0 leading-relaxed text-pretty text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
