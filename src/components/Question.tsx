"use client";

import { useRef } from "react";

import { question } from "@/content";
import { ScrollTrigger, SplitText, alreadySeen, gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

import { Container, Label } from "./Container";
import { Reveal } from "./Reveal";
import { Thread } from "./Thread";

/**
 * The one question, typed out as the thread reaches it — the same square
 * cursor as the hero's, writing it down as if in the middle of a call.
 */
export function Question() {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const text = textRef.current;
    const cursor = cursorRef.current;
    const typing = typingRef.current;
    if (!text || !cursor || !typing || prefersReducedMotion() || alreadySeen(text)) return;

    const split = SplitText.create(text, { type: "words,chars" });
    const chars = split.chars as HTMLElement[];

    /*
     * The travelling cursor is absolutely positioned and moved with a
     * transform, and the resting one holds its place in the line all along,
     * so typing never reflows the heading.
     */
    const heading = text.parentElement!;
    const place = (char: HTMLElement) => {
      const box = char.getBoundingClientRect();
      const origin = heading.getBoundingClientRect();
      const size = typing.offsetHeight;
      gsap.set(typing, {
        x: box.right - origin.left + size * 0.16,
        y: box.top - origin.top + (box.height - size) * 0.74,
      });
    };

    gsap.set(chars, { opacity: 0 });
    gsap.set(cursor, { opacity: 0 });

    const step = 0.03;
    const tl = gsap.timeline({ paused: true });
    tl.set(typing, { opacity: 1 }, 0);
    chars.forEach((char, i) => {
      tl.call(() => {
        char.style.opacity = "1";
        place(char);
      }, undefined, i * step);
    });
    tl.set(typing, { opacity: 0 }, chars.length * step + 0.1);
    tl.set(cursor, { opacity: 1 }, chars.length * step + 0.1);

    const trigger = ScrollTrigger.create({
      trigger: text,
      start: "top 78%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => {
      trigger.kill();
      tl.kill();
      split.revert();
      gsap.set([cursor, typing], { clearProps: "all" });
    };
  }, []);

  return (
    <section id={question.id} aria-labelledby={`${question.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12 flex flex-col items-center text-center">
        <Reveal>
          <Label>{question.eyebrow}</Label>
        </Reveal>

        <h2 id={`${question.id}-heading`} className="t-h2 relative mt-8 mb-0 max-w-[21ch]">
          <span ref={textRef}>{question.question}</span>
          <span ref={cursorRef} aria-hidden="true" className="cursor-square" />
          <span
            ref={typingRef}
            aria-hidden="true"
            className="cursor-typing"
          />
        </h2>

        <Reveal>
          <p className="t-lead mt-10 mb-0 max-w-[34rem] text-muted">{question.body}</p>
        </Reveal>
      </Container>
    </section>
  );
}
