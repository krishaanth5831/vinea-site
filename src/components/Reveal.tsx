"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { VIEWPORT, groupVariants, riseVariants } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Renders as a list item when the parent is a list. */
  as?: "div" | "li" | "section" | "article";
};

/**
 * Scroll-triggered reveal. Fires once, never replays on scroll-up, and
 * resolves straight to its final state when reduced motion is requested.
 */
export function Reveal({ children, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as];

  return (
    <Component
      data-reveal
      className={className}
      variants={riseVariants(reduced)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

/**
 * Orchestrates a staggered group. Children should be `RevealItem`, which
 * inherits the animation state rather than watching the viewport itself.
 */
export function RevealGroup({ children, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={groupVariants(reduced)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as];

  return (
    <Component data-reveal className={className} variants={riseVariants(reduced)}>
      {children}
    </Component>
  );
}
