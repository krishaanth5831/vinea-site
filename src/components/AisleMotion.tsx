"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Evenly spaced plants either side of the aisle. */
const PLANTS = Array.from({ length: 19 }, (_, index) => 20 + index * 42);

const TOP_RAIL = 66;
const BOTTOM_RAIL = 154;
const AISLE = 110;

/**
 * The one moving thing on the page: a carriage travelling down an aisle
 * between two rows. Suggestion, not illustration — it is a diagram of where
 * the work happens, and it stops completely under reduced motion.
 */
export function AisleMotion() {
  const reduced = useReducedMotion() ?? false;

  return (
    <svg
      viewBox="0 0 800 220"
      role="img"
      aria-label="A carriage moving along the aisle between two rows of plants."
      className="h-auto w-full"
    >
      <defs>
        {/* Fades both ends so the row reads as continuing past the frame. */}
        <linearGradient id="aisle-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.14" stopColor="white" stopOpacity="1" />
          <stop offset="0.86" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="aisle-mask">
          <rect x="0" y="0" width="800" height="220" fill="url(#aisle-fade)" />
        </mask>
      </defs>

      <g mask="url(#aisle-mask)">
        <g stroke="var(--color-line-strong)" strokeWidth="1">
          <line x1="0" y1={TOP_RAIL} x2="800" y2={TOP_RAIL} />
          <line x1="0" y1={BOTTOM_RAIL} x2="800" y2={BOTTOM_RAIL} />
        </g>

        {/* The plants. Stems above the top rail and below the bottom one. */}
        <g stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round">
          {PLANTS.map((x) => (
            <line key={`top-${x}`} x1={x} y1={TOP_RAIL} x2={x} y2={TOP_RAIL - 40} />
          ))}
          {PLANTS.map((x) => (
            <line
              key={`bottom-${x}`}
              x1={x}
              y1={BOTTOM_RAIL}
              x2={x}
              y2={BOTTOM_RAIL + 40}
            />
          ))}
        </g>

        {/* The pipe rail the carriage runs on. */}
        <line
          x1="0"
          y1={AISLE}
          x2="800"
          y2={AISLE}
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray="3 7"
        />

        <motion.g
          initial={reduced ? { x: 300 } : { x: -60 }}
          animate={reduced ? { x: 300 } : { x: 860 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 17, repeat: Infinity, ease: "linear" }
          }
        >
          {/* What the carriage is looking at, either side of itself. */}
          <line
            x1="0"
            y1={TOP_RAIL - 6}
            x2="0"
            y2={BOTTOM_RAIL + 6}
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.32"
          />
          <rect
            x="-17"
            y={AISLE - 9}
            width="34"
            height="18"
            rx="3"
            fill="var(--color-accent)"
          />
          <circle cx="-9" cy={AISLE + 9} r="2.5" fill="var(--color-ink)" />
          <circle cx="9" cy={AISLE + 9} r="2.5" fill="var(--color-ink)" />
        </motion.g>
      </g>
    </svg>
  );
}
