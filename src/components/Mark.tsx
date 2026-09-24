import type { SVGProps } from "react";

/**
 * The Vinea mark: a diamond of square cells on a seven-by-seven grid, with a
 * half-cell chamfer at each inner corner. Its centre is empty — that empty
 * cell is where the page's story collapses to, and grows back out of.
 */
type Shape = "sq" | "tl" | "tr" | "br" | "bl";
type Cell = { c: number; r: number; shape: Shape };

/** Cell size; the gap between cells is what is left of each unit. */
export const S = 0.88;

export const MARK_CELLS: Cell[] = [
  /* top arm, running right */
  { c: 3, r: 0, shape: "sq" },
  { c: 4, r: 1, shape: "sq" },
  { c: 5, r: 2, shape: "sq" },
  { c: 4, r: 2, shape: "tr" },
  /* right arm, running down */
  { c: 6, r: 3, shape: "sq" },
  { c: 5, r: 4, shape: "sq" },
  { c: 4, r: 5, shape: "sq" },
  { c: 4, r: 4, shape: "br" },
  /* bottom arm, running left */
  { c: 3, r: 6, shape: "sq" },
  { c: 2, r: 5, shape: "sq" },
  { c: 1, r: 4, shape: "sq" },
  { c: 2, r: 4, shape: "bl" },
  /* left arm, running up */
  { c: 0, r: 3, shape: "sq" },
  { c: 1, r: 2, shape: "sq" },
  { c: 2, r: 1, shape: "sq" },
  { c: 2, r: 2, shape: "tl" },
];

function points({ c: x, r: y, shape }: Cell): string {
  const corners = {
    tl: [x, y, x + S, y, x, y + S],
    tr: [x, y, x + S, y, x + S, y + S],
    br: [x + S, y, x + S, y + S, x, y + S],
    bl: [x, y, x, y + S, x + S, y + S],
  } as const;
  return corners[shape as keyof typeof corners].join(" ");
}

/** Where the diamond's hollow centre sits: square one. */
export const MARK_CENTRE = { c: 3, r: 3 } as const;

/**
 * Each cell is a group around its shape, so scroll motion (on the group) and
 * pointer motion (on the shape) never write to the same transform.
 */
export function Mark({ children, ...props }: SVGProps<SVGSVGElement>) {
  const size = 6 + S;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      overflow="visible"
      {...props}
    >
      {MARK_CELLS.map((cell) => (
        <g
          key={`${cell.c}-${cell.r}`}
          className="mark-cell"
          data-c={cell.c}
          data-r={cell.r}
        >
          {cell.shape === "sq" ? (
            <rect className="mark-shape" x={cell.c} y={cell.r} width={S} height={S} />
          ) : (
            <polygon className="mark-shape" points={points(cell)} />
          )}
        </g>
      ))}
      {children}
    </svg>
  );
}

/**
 * The wordmark, VINEΛ. The last letter is drawn, not typed: the brand's A has
 * no crossbar, and a Greek lambda would fall back to a system face and be
 * read aloud as "lambda".
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-baseline ${className}`}>
      <span className="tracking-[0.3em]">VINE</span>
      <svg
        viewBox="0 0 100 100"
        className="h-[0.71em] w-[0.74em] self-baseline"
        style={{ verticalAlign: "baseline" }}
      >
        <polygon
          points="0,100 42.5,0 57.5,0 100,100 85,100 50,18 15,100"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/** Mark and wordmark together, as in the header and footer. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="size-[1.375rem]" />
      <Wordmark className="text-[0.9375rem] font-medium" />
    </span>
  );
}
