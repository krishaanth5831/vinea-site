/**
 * A line-art tool head per candidate job. These are the things that would come
 * off the arm — drawn as the page's only other machine, so the claim that the
 * tool is what changes has something to point at.
 *
 * Kept deliberately blunt: each one has to read at the size of a thumbnail.
 */

export type ToolName = "cutter" | "deleafer" | "scout" | "gripper" | "fork";

type Shape = {
  /** Drawn in ink: the tool itself. */
  paths: string[];
  /** Drawn in the signal colour: what the tool is acting on. */
  accent: string[];
};

const SHAPES: Record<ToolName, Shape> = {
  /* Secateurs, open, about to take a stem. */
  cutter: {
    paths: [
      "M10 14 L30 29",
      "M10 50 L30 35",
      "M30 29 L52 20",
      "M30 35 L52 44",
      "M8 10 a5 5 0 1 0 4 6",
      "M8 54 a5 5 0 1 1 4 -6",
    ],
    accent: ["M44 32 L58 32", "M32 32 a2.5 2.5 0 1 0 0.1 0"],
  },
  /* A blade taking leaf off the stem. */
  deleafer: {
    paths: [
      "M46 8 L46 56",
      "M46 30 q -18 -2 -26 -14 q 18 -4 26 14 z",
      "M46 44 q -12 -1 -18 -9",
    ],
    accent: ["M14 14 L36 40", "M36 40 l -2 -7 M36 40 l -7 -2"],
  },
  /* A camera and the cone it sees down the row. */
  scout: {
    paths: [
      "M12 22 h24 v20 h-24 z",
      "M22 22 v-5 h6 v5",
      "M24 32 a6 6 0 1 0 0.1 0",
      "M18 46 v5 M32 46 v5 M14 51 h24",
    ],
    accent: ["M40 32 L58 20", "M40 32 L58 44"],
  },
  /* Soft fingers closing around fruit. */
  gripper: {
    paths: [
      "M6 24 v16 M6 32 h10",
      "M16 24 L28 27 q 9 5 9 13",
      "M16 40 L28 37 q 9 -5 9 -13",
    ],
    accent: ["M45 32 a11 11 0 1 0 0.1 0", "M45 21 q 4 -5 9 -5"],
  },
  /* A fork taking a crate off the aisle. */
  fork: {
    paths: [
      "M10 8 L10 54",
      "M10 40 L52 40",
      "M10 48 L46 48",
      "M20 16 h26 v22 h-26 z",
      "M20 27 h26 M33 16 v22",
    ],
    accent: ["M52 40 l -6 -4 M52 40 l -6 4"],
  },
};

export function ToolHead({
  name,
  className = "",
}: {
  name: ToolName;
  className?: string;
}) {
  const shape = SHAPES[name];
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <g stroke="var(--color-ink)">
        {shape.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="var(--color-signal)">
        {shape.accent.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
