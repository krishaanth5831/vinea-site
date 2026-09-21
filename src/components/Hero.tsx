"use client";

import { motion, useReducedMotion } from "framer-motion";

import { hero } from "@/content";
import { groupVariants, riseVariants } from "@/lib/motion";

import { AisleMotion } from "./AisleMotion";
import { Cta } from "./Cta";
import { Container, Eyebrow } from "./Section";

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const group = groupVariants(reduced);
  const item = riseVariants(reduced);

  return (
    <section aria-labelledby="hero-heading" className="py-section">
      <Container>
        <motion.div variants={group} initial="hidden" animate="shown">
          <motion.div variants={item} data-reveal>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            data-reveal
            id="hero-heading"
            className="mt-6 max-w-[19ch] font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.02em] text-balance"
          >
            {hero.heading}
          </motion.h1>

          <motion.p
            variants={item}
            data-reveal
            className="mt-8 max-w-measure text-[1.0625rem] leading-[1.75] text-muted"
          >
            {hero.lead}
          </motion.p>

          <motion.div
            variants={item}
            data-reveal
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {hero.ctas.map((cta) => (
              <Cta key={cta.href} cta={cta} />
            ))}
          </motion.div>

          {/* The honesty note, stated rather than tucked away. */}
          <motion.p
            variants={item}
            data-reveal
            className="mt-12 max-w-measure border-l-2 border-accent pl-5 text-[0.9375rem] leading-[1.7] text-muted"
          >
            {hero.disclaimer}
          </motion.p>

          <motion.div
            variants={item}
            data-reveal
            className="mt-16 sm:mt-20"
            aria-hidden={false}
          >
            <AisleMotion />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
