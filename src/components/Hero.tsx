"use client";

import { useRef } from "react";
import { hero } from "@/content";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Button } from "./Button";
import { Container } from "./Container";

/** Delay for each piece of the entrance, so they arrive in reading order. */
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

/**
 * The opening screen: where Vinea is today, what it is building and for
 * whom, over a greenhouse at night.
 *
 * There is no footage here on purpose. The backdrop is the empty aisle, the
 * part that already exists, lit by its grow lights; the robot arrives one
 * section down. Dust drifts through the light and the glow leans towards the
 * pointer. The entrance itself is CSS, so the heading never waits on
 * JavaScript to appear.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      /* The aisle sinks away and the words lift off as the reader moves on. */
      gsap.to(".hero-sky", {
        yPercent: 14,
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        y: -70,
        autoAlpha: 0,
        ease: "power1.in",
        scrollTrigger: { trigger: section, start: "15% top", end: "75% top", scrub: true },
      });
    }, section);

    /* The glow follows the pointer, a beat behind it. */
    const glow = section.querySelector<HTMLElement>(".hero-pointer");
    let removePointer = () => {};
    if (glow && hasFinePointer()) {
      const x = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
      const y = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const box = section.getBoundingClientRect();
        x(event.clientX - box.left);
        y(event.clientY - box.top);
        glow.style.opacity = "1";
      };
      const onLeave = () => (glow.style.opacity = "0");
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      removePointer = () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    }

    /* Dust in the light: slow specks, drawn only while the hero is on screen. */
    const canvas = section.querySelector<HTMLCanvasElement>(".hero-dust");
    const pen = canvas?.getContext("2d");
    let frame = 0;
    let stopDust = () => {};
    if (canvas && pen) {
      let state = 5;
      const rand = () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
      };
      const specks = Array.from({ length: 54 }, () => ({
        x: rand(),
        y: rand(),
        r: 0.6 + rand() * 1.8,
        vx: (rand() - 0.5) * 0.00018,
        vy: -0.00006 - rand() * 0.00022,
        phase: rand() * Math.PI * 2,
        violet: rand() > 0.6,
      }));
      let width = 0;
      let height = 0;
      const size = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        pen.setTransform(ratio, 0, 0, ratio, 0, 0);
      };
      size();
      window.addEventListener("resize", size);
      let running = false;
      let last = performance.now();
      const draw = (now: number) => {
        const dt = Math.min(now - last, 60);
        last = now;
        pen.clearRect(0, 0, width, height);
        for (const speck of specks) {
          speck.x += speck.vx * dt;
          speck.y += speck.vy * dt;
          if (speck.y < -0.02) speck.y = 1.02;
          if (speck.x < -0.02) speck.x = 1.02;
          if (speck.x > 1.02) speck.x = -0.02;
          const alpha = 0.16 + 0.34 * (0.5 + 0.5 * Math.sin(now * 0.0011 + speck.phase));
          pen.beginPath();
          pen.fillStyle = speck.violet
            ? `rgba(178, 140, 255, ${alpha})`
            : `rgba(255, 150, 205, ${alpha})`;
          pen.arc(speck.x * width, speck.y * height, speck.r, 0, Math.PI * 2);
          pen.fill();
        }
        if (running) frame = requestAnimationFrame(draw);
      };
      const watcher = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting;
        cancelAnimationFrame(frame);
        if (running) {
          last = performance.now();
          frame = requestAnimationFrame(draw);
        }
      });
      watcher.observe(section);
      stopDust = () => {
        running = false;
        cancelAnimationFrame(frame);
        watcher.disconnect();
        window.removeEventListener("resize", size);
      };
    }

    return () => {
      context.revert();
      removePointer();
      stopDust();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-heading" className="hero relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-sky">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/renders/aisle.webp"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          className="hero-img"
        />
        <div className="hero-lamps" />
      </div>
      <div aria-hidden="true" className="hero-shade" />
      <canvas aria-hidden="true" className="hero-dust" />
      <div aria-hidden="true" className="hero-pointer" />

      <Container className="hero-copy relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
        <p className="rise status-pill" style={at(0.05)}>
          <span aria-hidden="true" className="pulse-dot" />
          {hero.status}
        </p>

        <h1 id="hero-heading" className="t-display mt-8 mb-0">
          {hero.heading.map((line, i) => {
            const [before, after] = line.split(hero.accent);
            return (
              <span key={line} className="line-mask">
                <span className="line-rise" style={at(0.12 + i * 0.11)}>
                  {after === undefined ? (
                    line
                  ) : (
                    <>
                      {before}
                      <span className="text-lit">{hero.accent}</span>
                      {after}
                    </>
                  )}
                </span>
              </span>
            );
          })}
        </h1>

        <p className="rise t-lead mt-8 mb-0 max-w-[35rem] text-pretty text-muted" style={at(0.48)}>
          {hero.lead}
        </p>

        <div
          className="rise mt-10 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
          style={at(0.58)}
        >
          {hero.ctas.map((cta) => (
            <Button key={cta.href} cta={cta} />
          ))}
        </div>

        <p
          className="rise t-mono mt-9 mb-0 flex flex-wrap items-center gap-x-5 gap-y-2 text-muted"
          style={at(0.68)}
        >
          <span>{hero.note}</span>
          {hero.noteLinks.map((link) => (
            <a key={link.href} href={link.href} className="link-line text-fg">
              {link.label}
            </a>
          ))}
        </p>
      </Container>

      <div aria-hidden="true" className="hero-cue">
        <span />
      </div>
    </section>
  );
}
