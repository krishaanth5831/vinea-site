import type { Cta } from "@/content";

/*
 * An arrow drawn in cells, like the mark. Each cell steps forward on hover a
 * beat after the one behind it, so the arrow moves like a pixel display.
 */
const ARROW: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 0],
  [4, 2],
  [4, 4],
  [5, 1],
  [5, 2],
  [5, 3],
  [6, 2],
];

function PixelArrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 7 5"
      width="15"
      height="11"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className="px-arrow shrink-0"
      style={down ? { rotate: "90deg" } : undefined}
    >
      {ARROW.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          x={c}
          y={r}
          width="0.84"
          height="0.84"
          style={{ "--i": c } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export function Button({ cta, small = false }: { cta: Cta; small?: boolean }) {
  return (
    <a
      href={cta.href}
      className={`btn btn-${cta.tone} ${small ? "btn-sm" : ""}`}
    >
      {cta.label}
      <PixelArrow down={cta.href.startsWith("#")} />
    </a>
  );
}
