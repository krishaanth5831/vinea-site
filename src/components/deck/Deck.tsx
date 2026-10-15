"use client";

import { useCallback, useRef, useState } from "react";

import { site, type Slide } from "@/content";
import { DURATION, EASE, ScrollTrigger, STAGGER, gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToY } from "@/lib/lenis";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { Button } from "../Button";
import { Mark, Wordmark } from "../Mark";
import { DeckFigure } from "./DeckFigure";

/**
 * Must match the gate on `.deck` in globals.css, which lays the slides out
 * as a sticky stack before paint. Below it the same markup is a plain run of
 * full-bleed slides. The two have to agree or the motion and layout differ.
 */
const STAGED =
  "(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 37.5rem)";

/** Ink and paper alternate, so no two neighbouring slides share a colour. */
const tone = (i: number) => (i % 2 === 0 ? "ink" : "paper");

function SlideCard({ slide, index }: { slide: Slide; index: number }) {
  const titleId = `${slide.id}-title`;
  const layout = slide.layout ?? "content";
  const hasBody = slide.body.length > 0 || Boolean(slide.links?.length) || layout === "end";

  return (
    <article className="slide" data-tone={tone(index)} data-layout={layout} aria-labelledby={titleId}>
      <div className="slide-top">
        <p className="slide-kicker t-label m-0 inline-flex items-center gap-2.5">
          <span aria-hidden="true" className="size-1.5 bg-[var(--s-fg)]" />
          {slide.kicker}
        </p>
        {slide.corner ? (
          <p className="slide-kicker t-mono m-0 text-right text-[var(--s-muted)]">
            {slide.corner.href ? (
              <a
                href={slide.corner.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-[var(--s-line)] underline-offset-4 transition-colors duration-200 hover:text-[var(--s-fg)] hover:decoration-[var(--s-fg)]"
              >
                {slide.corner.label}
              </a>
            ) : (
              slide.corner.label
            )}
          </p>
        ) : null}
      </div>

      {layout === "cover" ? (
        <h2 id={titleId} className="slide-cover m-0">
          <span className="sr-only">{slide.title[0]}</span>
          <span className="line-mask" aria-hidden="true">
            <span className="slide-line block">
              <Wordmark className="slide-wordmark" />
            </span>
          </span>
        </h2>
      ) : (
        <h2 id={titleId} className="slide-title m-0">
          {slide.title.map((line) => (
            <span key={line} className="line-mask">
              <span className="slide-line block">{line}</span>
            </span>
          ))}
        </h2>
      )}

      <div
        className={`slide-foot ${slide.figure && hasBody ? "has-figure" : ""} ${
          slide.figure?.kind === "table" ? "has-table" : ""
        }`}
      >
        {hasBody ? (
        <div className="slide-body">
          {slide.body.map((paragraph) => (
            <p key={paragraph} className="slide-reveal m-0">
              {paragraph}
            </p>
          ))}
          {slide.links?.length ? (
            <div className="slide-reveal flex flex-col gap-3 sm:flex-row">
              {slide.links.map((cta) => (
                <Button key={cta.href} cta={cta} />
              ))}
            </div>
          ) : null}
          {layout === "end" ? (
            <div className="slide-reveal t-mono flex flex-wrap justify-between gap-4 text-[var(--s-muted)]">
              <a href={`mailto:${site.email}`} className="transition-colors duration-200 hover:text-[var(--s-fg)]">
                {site.email}
              </a>
              <span>getvinea.nl</span>
            </div>
          ) : null}
        </div>
        ) : null}

        {layout === "cover" ? (
          <div className="slide-figure slide-mark" aria-hidden="true">
            <Mark className="block size-[clamp(7rem,22svh,14rem)]" />
          </div>
        ) : null}

        {slide.figure ? (
          <div className="slide-figure">
            <DeckFigure figure={slide.figure} />
          </div>
        ) : null}
      </div>

      {/* Darkens a slide as the next one covers it. */}
      <div aria-hidden="true" className="slide-shade" />
    </article>
  );
}

/**
 * The deck as a stack: each slide holds the screen while the next rises
 * over it, and the one underneath settles back into the dark. A slide's
 * headline rises out of its masks, its text follows, and its drawing
 * assembles from cells when it arrives — the same vocabulary as the home
 * page. A rail on the right shows where you are and jumps between slides,
 * and the arrow keys step through them.
 *
 * Where the stack is not used (see `.deck` in globals.css), the slides are a
 * plain run of full-bleed panels that reveal as they scroll in.
 */
export function Deck({ slides }: { slides: Slide[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /** Where slide `i` sits on the page when it fills the screen. */
  const slideY = useCallback((i: number) => {
    const list = listRef.current;
    if (!list) return 0;
    const top = list.getBoundingClientRect().top + window.scrollY;
    if (window.matchMedia(STAGED).matches) return top + i * window.innerHeight;
    const item = list.children[i] as HTMLElement | undefined;
    return item ? item.getBoundingClientRect().top + window.scrollY : top;
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, i));
      scrollToY(slideY(next));
    },
    [slides.length, slideY],
  );

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > .deck-slide"));

    const setCurrent = (i: number) => {
      if (i === activeRef.current) return;
      activeRef.current = i;
      setActive(i);
    };

    /* Marks exactly the elements the animation owns, for testing. */
    list.querySelectorAll<HTMLElement>(".slide-reveal, .slide-kicker").forEach((el) => {
      el.dataset.reveal = "";
    });

    /*
     * Left and right step through the slides while the deck is on screen.
     * The slide counted as current is the one nearest the middle of the
     * screen, so a key press always moves one slide from what you see.
     */
    const current = () => {
      const middle = window.innerHeight / 2;
      let i = 0;
      items.forEach((item, k) => {
        const box = item.getBoundingClientRect();
        if (box.top <= middle) i = k;
      });
      return window.matchMedia(STAGED).matches ? activeRef.current : i;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      const box = list.getBoundingClientRect();
      if (box.top > window.innerHeight * 0.5 || box.bottom < window.innerHeight * 0.5) return;
      event.preventDefault();
      go(current() + (event.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("keydown", onKey);
    }

    /* Each slide's entrance, built once and played the first time it arrives. */
    const entrances = items.map((item) => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });

      /* Adds a step for the pieces this slide has; most have only some. */
      const step = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars, at: number) => {
        const targets = item.querySelectorAll(selector);
        if (targets.length) tl.fromTo(targets, from, to, at);
      };

      step(".slide-line", { yPercent: 105 }, { yPercent: 0, duration: DURATION.slow, stagger: 0.1 }, 0);
      step(".slide-kicker", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.05);
      step(
        ".slide-reveal",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DURATION.base, stagger: STAGGER },
        0.25,
      );

      /* The drawings: cells assemble, bars draw, steps light in order. */
      const cells = { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" };
      const pop = { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2.2)" };
      step(".slide-mark .mark-shape", { ...cells, scale: 0.3 }, { ...pop, stagger: 0.04 }, 0.2);
      step(".fig-cell", cells, { ...pop, stagger: 0.025 }, 0.3);
      step(
        ".fig-lit",
        { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.4)", stagger: 0.12 },
        0.75,
      );
      step(".fig-seg", { scaleX: 0 }, { scaleX: 1, duration: DURATION.base, stagger: 0.12 }, 0.35);
      step(".fig-line", { scaleY: 0 }, { scaleY: 1, duration: DURATION.slow }, 0.35);
      step(
        ".fig-row",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: DURATION.base, stagger: STAGGER },
        0.45,
      );
      step(
        ".fig-node",
        { scale: 0.3, rotation: 45 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.14 },
        0.5,
      );
      return { tl, played: false };
    });

    const play = (i: number, instantly = false) => {
      const entrance = entrances[i];
      if (!entrance || entrance.played) return;
      entrance.played = true;
      if (instantly) entrance.tl.progress(1);
      else entrance.tl.play();
    };

    /* Slides already on screen, or scrolled past, are shown as they are. */
    const seen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.75;

    const mm = gsap.matchMedia();

    /*
     * A conditions object only runs its callback while one of them matches,
     * so "any" is always true: the callback runs everywhere and runs again
     * whenever the stage turns on or off.
     */
    mm.add({ staged: STAGED, any: "all" }, (context) => {
      const { staged } = context.conditions as { staged: boolean };
      const last = items.length - 1;

      if (!staged) {
        items.forEach((item, i) => {
          if (seen(item)) {
            play(i, true);
            return;
          }
          entrances[i].tl.progress(0);
          ScrollTrigger.create({
            trigger: item,
            start: "top 75%",
            once: true,
            onEnter: () => play(i),
          });
        });
        ScrollTrigger.create({
          trigger: list,
          start: "top 60%",
          end: "bottom 40%",
          onUpdate() {
            const middle = window.innerHeight / 2;
            let i = 0;
            items.forEach((item, k) => {
              if (item.getBoundingClientRect().top < middle) i = k;
            });
            setCurrent(i);
          },
        });
        return;
      }

      /*
       * The stack is measured off the list, not the slides: a slide that is
       * stuck reports where it is stuck, not where it sits in the flow. Each
       * slide is a screen tall, so the list's progress maps straight onto
       * slide indexes, and covering slide i happens between i and i + 1.
       */
      const cover = gsap.timeline({ defaults: { ease: "none" } });
      items.slice(0, -1).forEach((item, i) => {
        const card = item.querySelector(".slide");
        const shade = item.querySelector(".slide-shade");
        cover.fromTo(card, { scale: 1 }, { scale: 0.92, duration: 1, transformOrigin: "50% 0%" }, i);
        cover.fromTo(shade, { opacity: 0 }, { opacity: 0.72, duration: 1 }, i);
      });

      const position = () => {
        const top = list.getBoundingClientRect().top;
        return -top / window.innerHeight;
      };

      /* Everything already passed on load is shown at once. */
      const start = position();
      items.forEach((_, i) => {
        if (start > i - 0.6) play(i, true);
        else entrances[i].tl.progress(0);
      });

      ScrollTrigger.create({
        trigger: list,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        animation: cover,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const at = self.progress * last;
          /* A slide arrives once it is about two fifths of the way up. */
          const i = Math.min(last, Math.floor(at + 0.6));
          for (let k = 0; k <= i; k++) play(k);
          setCurrent(i);
        },
      });

      /* The first slide arrives before the stack starts moving. */
      ScrollTrigger.create({
        trigger: list,
        start: "top 65%",
        once: true,
        onEnter: () => play(0),
      });

      /* The rail is only there while the deck is. */
      const rail = railRef.current;
      if (rail) {
        ScrollTrigger.create({
          trigger: list,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => rail.toggleAttribute("data-visible", self.isActive),
        });
      }

      return () => rail?.removeAttribute("data-visible");
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      mm.revert();
      entrances.forEach(({ tl }) => tl.revert());
    };
  }, [go]);

  return (
    <div className="deck">
      <ol ref={listRef} className="deck-list m-0 list-none p-0">
        {slides.map((slide, i) => (
          <li key={slide.id} id={slide.id} className="deck-slide">
            <SlideCard slide={slide} index={i} />
          </li>
        ))}
      </ol>

      <nav ref={railRef} aria-label="Slides" className="deck-rail">
        <ol className="m-0 flex list-none flex-col gap-1 p-0">
          {slides.map((slide, i) => (
            <li key={slide.id}>
              <button
                type="button"
                className="deck-rail-button"
                aria-current={i === active ? "true" : undefined}
                aria-label={slide.title.join(" ")}
                onClick={() => go(i)}
              >
                <span className="deck-rail-label">{slide.title.join(" ")}</span>
                <span aria-hidden="true" className="deck-rail-tick" />
              </button>
            </li>
          ))}
        </ol>
        <p className="t-mono m-0 mt-4 text-right text-muted tabular-nums" data-numbers aria-hidden="true">
          {String(active + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
        </p>
      </nav>
    </div>
  );
}
