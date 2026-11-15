"use client";

import { useRef, useState } from "react";
import { what, type WhatBeat } from "@/content";
import { ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToY } from "@/lib/lenis";
import { SEQ, WIRE } from "@/lib/renders";
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

/** How far through the scroll the first sequence runs; past it, the view is at the crop wire. */
const WIRE_AT = SEQ.frames / (SEQ.frames + WIRE.frames * 1.6);

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
  flip: 2,
};

/** The frame each module's button goes to. */
const MODULE_FRAME = [SEQ.beats.reach, SEQ.beats.deleaf, SEQ.beats.lower];

/** The stills that stand in for the sequence where it isn't played. */
const STILLS = ["what-harvest", "what-deleaf", "hoist"];

/** Each beat's start, counted in frames straight through both sequences. */
const BEAT_STARTS = what.beats.map((beat) =>
  beat.key === "wire" || beat.key === "flip" ? SEQ.frames + WIRE.beats[beat.key] : SEQ.beats[beat.key],
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
      const pen = canvas?.getContext("2d", { alpha: false });
      if (!figure || !canvas || !pen) return;
      setStaged(true);

      /*
       * Every picture is decoded ahead of time, off the main thread, and
       * kept as a bitmap. Drawing a frame is then a copy, so the scroll
       * never waits on an image.
       */
      const plates: (ImageBitmap | undefined)[] = [undefined, undefined];
      const frames: (ImageBitmap | undefined)[] = [];
      const total = SEQ.frames + WIRE.frames;
      let want = 0;
      let drawn = -2;
      let stopped = false;

      const fit = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.min(1600, Math.round(canvas.clientWidth * ratio));
        if (width === 0 || width === canvas.width) return;
        canvas.width = width;
        canvas.height = Math.round((width * 9) / 16);
        drawn = -2;
      };

      /*
       * Draws the frame the scroll is on, or the nearest one of the same
       * sequence that has arrived. Frames count straight through: the
       * aisle first, then the crop wire.
       */
      const draw = () => {
        const second = want >= SEQ.frames;
        const plate = plates[second ? 1 : 0];
        if (!plate) return;
        const lo = second ? SEQ.frames : 0;
        const hi = second ? total : SEQ.frames;
        let f = want;
        while (f >= lo && !frames[f]) f--;
        if (f < lo) {
          f = want;
          while (f < hi && !frames[f]) f++;
          if (f >= hi) f = -1;
        }
        const key = f < 0 ? -1 - (second ? 1 : 0) * 2 : f;
        if (key === drawn) return;
        drawn = key;
        const { width, height } = canvas;
        pen.drawImage(plate, 0, 0, width, height);
        const layer = f >= 0 ? frames[f] : undefined;
        if (layer) {
          const { left, right, top, bottom } = second ? WIRE.crop : SEQ.crop;
          pen.drawImage(layer, left * width, top * height, (right - left) * width, (bottom - top) * height);
        }
      };

      const fetchBitmap = (url: string) =>
        fetch(url)
          .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(url))))
          .then((blob) => createImageBitmap(blob));

      fit();
      const sized = new ResizeObserver(() => {
        fit();
        draw();
      });
      sized.observe(canvas);

      ["/renders/seq/plate.webp", "/renders/wire/plate.webp"].forEach((url, i) => {
        fetchBitmap(url)
          .then((bitmap) => {
            if (stopped) return bitmap.close();
            plates[i] = bitmap;
            drawn = -2;
            draw();
          })
          .catch(() => {});
      });

      /* The frames load in order, a few at a time, once the section is near. */
      let next = 0;
      const load = () => {
        if (stopped || next >= total) return;
        const i = next++;
        const url =
          i < SEQ.frames
            ? `/renders/seq/${String(i).padStart(3, "0")}.webp`
            : `/renders/wire/${String(i - SEQ.frames).padStart(3, "0")}.webp`;
        fetchBitmap(url)
          .then((bitmap) => {
            if (stopped) return bitmap.close();
            frames[i] = bitmap;
            if (Math.abs(i - want) < 6) {
              drawn = -2;
              draw();
            }
          })
          .catch(() => {})
          .finally(load);
      };
      const near = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          near.disconnect();
          for (let k = 0; k < 6; k++) load();
        },
        { rootMargin: "200% 0px" },
      );
      near.observe(el);

      /* Where the scroll is, eased a little so the frames run on instead of jumping. */
      const state = { p: 0 };
      const apply = () => {
        const p = state.p;
        /* The aisle fills the first part of the scroll, the crop wire the rest. */
        const frame =
          p < WIRE_AT
            ? Math.round((p / WIRE_AT) * (SEQ.frames - 1))
            : SEQ.frames + Math.round(((p - WIRE_AT) / (1 - WIRE_AT)) * (WIRE.frames - 1));
        if (frame !== want) {
          want = frame;
          draw();
        }
        /* A short dip through dark covers the change of camera. */
        const cut = Math.max(0, 1 - Math.abs(p - WIRE_AT) / 0.012);
        figure.style.setProperty("--cut", cut.toFixed(3));

        let b = 0;
        BEAT_STARTS.forEach((start, i) => {
          if (frame >= start) b = i;
        });
        setBeat((prev) => (prev === b ? prev : b));

        /* While it looks: first every truss is framed, then the ready one is picked out. */
        const level = frame < 3 || frame > SEQ.beats.reach + 5 ? 0 : frame < 10 ? 1 : 2;
        setScan((prev) => (prev === level ? prev : level));
      };
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: apply,
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.35 },
      });
      trigger.current = tween.scrollTrigger ?? null;

      return () => {
        stopped = true;
        near.disconnect();
        sized.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
        trigger.current = null;
        plates.forEach((bitmap) => bitmap?.close());
        frames.forEach((bitmap) => bitmap?.close());
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
                  aria-label="A rendered sequence: the robot looks along the row, cuts a ripe truss and carries it to its crate; its module is swapped for the deleafing module and then for the lowering module, whose head rests on the crop wire, turns a plant's winding hook and lets the plant down."
                />
                <span aria-hidden="true" className="what-cut" />
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
