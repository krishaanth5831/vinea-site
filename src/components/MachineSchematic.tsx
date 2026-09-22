"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const INK = "var(--color-ink)";
const LINE = "var(--color-line-strong)";
const SIGNAL = "var(--color-signal)";

/** Where the plant's trusses hang, and which one the tool is reaching for. */
const TRUSSES = [200, 340, 420, 500];
const TARGET = 300;

/** A truss: a short stalk off the stem and the fruit hanging from it. */
function Truss({ y, target = false }: { y: number; target?: boolean }) {
  const stroke = target ? SIGNAL : LINE;
  const r = target ? 7 : 5.5;
  return (
    <g stroke={stroke} strokeWidth={target ? 1.4 : 1} fill="none">
      <path d={`M250 ${y} q 16 0 22 6`} />
      <circle cx={272} cy={y + 12} r={r} />
      <circle cx={272 + r * 1.7} cy={y + 8} r={r} />
      <circle cx={272 - r * 1.5} cy={y + 9} r={r} />
    </g>
  );
}

/** A plant in the row behind, drawn faint enough to read as depth. */
function FarStem({ x }: { x: number }) {
  return (
    <g stroke={LINE} strokeWidth="0.75" fill="none" opacity="0.5">
      <line x1={x} y1="572" x2={x} y2="180" />
      <path d={`M${x} 300 l 14 -10`} />
      <path d={`M${x} 380 l -14 -10`} />
      <path d={`M${x} 460 l 14 -10`} />
    </g>
  );
}

/** A monospace annotation with a leader line back to the part it names. */
function Callout({
  x,
  y,
  to,
  label,
  anchor = "start",
}: {
  x: number;
  y: number;
  to: [number, number];
  label: string;
  anchor?: "start" | "end";
}) {
  const from: [number, number] = [anchor === "start" ? x - 8 : x + 8, y - 4];
  return (
    <g className="callout">
      <path
        d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`}
        stroke={LINE}
        strokeWidth="0.75"
        fill="none"
      />
      <circle cx={to[0]} cy={to[1]} r="2" fill={LINE} />
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fill="var(--color-muted)"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </text>
    </g>
  );
}

/**
 * The machine, drawn as a side elevation: a chassis on the pipe rail with a
 * tool on the end of an arm, reaching a truss. The annotations name the parts
 * the argument on this page rests on — the shared chassis, the tool that comes
 * off, the vision stack, the aisle it all happens in.
 *
 * The drawing ships complete. Its dashed, undrawn state is set from JavaScript
 * and only when motion is allowed, so it is never a blank frame.
 */
export function MachineSchematic() {
  const ref = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const svg = ref.current;
    if (!svg || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGGeometryElement>(".draw *");
      strokes.forEach((node) => {
        const length = typeof node.getTotalLength === "function" ? node.getTotalLength() : 0;
        if (!length) return;
        gsap.set(node, { strokeDasharray: length, strokeDashoffset: length });
      });

      const timeline = gsap.timeline({ delay: 0.15 });
      timeline
        .to(strokes, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "none",
          stagger: { each: 0.012, from: "start" },
        })
        .from(".callout", { opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.45")
        .set(strokes, { strokeDasharray: "none" });

      /*
       * Rotation origins are given in the drawing's own units. A CSS
       * transform-box on an SVG group is not reliable here — it moved the
       * bogies clean out of frame.
       */
      gsap.to(".arm", {
        rotation: -3.2,
        svgOrigin: "698 310",
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.4,
      });

      gsap.utils.toArray<SVGGElement>(".wheel").forEach((wheel) => {
        gsap.to(wheel, {
          rotation: 360,
          svgOrigin: wheel.dataset.origin,
          duration: 9,
          ease: "none",
          repeat: -1,
        });
      });
    }, svg);

    return () => context.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 112 1200 516"
      role="img"
      aria-label="A side elevation of the platform: a chassis running on the glasshouse pipe rail, a mast carrying a camera, and an arm reaching a truss on the plant beside it."
      className="schematic h-auto w-full overflow-visible"
    >
      <g className="draw" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[40, 96, 152, 208].map((x) => (
          <FarStem key={x} x={x} />
        ))}
        {[960, 1016, 1072, 1128, 1184].map((x) => (
          <FarStem key={x} x={x} />
        ))}

        {/* The plant being worked. */}
        <g stroke={INK} strokeWidth="1.25">
          <line x1="250" y1="572" x2="250" y2="130" />
          <path d="M250 240 l 22 -14" />
          <path d="M250 380 l -24 -14" />
          <path d="M250 470 l 22 -14" />
          <path d="M250 160 l -20 -12" />
        </g>
        {TRUSSES.map((y) => (
          <Truss key={y} y={y} />
        ))}
        <Truss y={TARGET} target />

        {/* The pipe rail the whole house runs on. */}
        <g stroke={INK} strokeWidth="1.25">
          <line x1="0" y1="572" x2="1200" y2="572" />
          <line x1="0" y1="580" x2="1200" y2="580" />
        </g>

        {/* Chassis. */}
        <g stroke={INK} strokeWidth="1.5">
          <rect x="470" y="470" width="280" height="70" rx="5" />
        </g>
        <g stroke={LINE} strokeWidth="1">
          <line x1="470" y1="505" x2="750" y2="505" />
          <line x1="500" y1="470" x2="500" y2="540" />
          <line x1="720" y1="470" x2="720" y2="540" />
        </g>

        {/* Bogies on the rail. */}
        <g stroke={INK} strokeWidth="1.25">
          <line x1="520" y1="540" x2="520" y2="550" />
          <line x1="700" y1="540" x2="700" y2="550" />
          <g className="wheel" data-origin="520 562">
            <circle cx="520" cy="562" r="17" />
            <line x1="520" y1="548" x2="520" y2="576" />
            <line x1="506" y1="562" x2="534" y2="562" />
          </g>
          <g className="wheel" data-origin="700 562">
            <circle cx="700" cy="562" r="17" />
            <line x1="700" y1="548" x2="700" y2="576" />
            <line x1="686" y1="562" x2="714" y2="562" />
          </g>
        </g>

        {/* Crate on the deck. */}
        <g stroke={INK} strokeWidth="1.25">
          <rect x="482" y="412" width="92" height="58" rx="3" />
        </g>
        <g stroke={LINE} strokeWidth="0.85">
          <line x1="482" y1="430" x2="574" y2="430" />
          <line x1="482" y1="450" x2="574" y2="450" />
          <line x1="512" y1="412" x2="512" y2="470" />
          <line x1="544" y1="412" x2="544" y2="470" />
        </g>

        {/* Mast, and the camera looking down the row. */}
        <g stroke={INK} strokeWidth="1.4">
          <line x1="690" y1="470" x2="690" y2="248" />
          <line x1="706" y1="470" x2="706" y2="248" />
          <line x1="690" y1="248" x2="706" y2="248" />
        </g>
        <g stroke={LINE} strokeWidth="0.85">
          <line x1="690" y1="330" x2="706" y2="300" />
          <line x1="690" y1="400" x2="706" y2="370" />
          <line x1="690" y1="440" x2="706" y2="410" />
        </g>
        <g stroke={INK} strokeWidth="1.25">
          <line x1="706" y1="245" x2="728" y2="245" />
          <rect x="728" y="228" width="34" height="34" rx="3" />
          <circle cx="745" cy="245" r="7" />
        </g>

        {/* The arm, and the tool on the end of it. */}
        <g className="arm" stroke={INK} strokeWidth="1.5">
          <circle cx="698" cy="310" r="8" />
          <line x1="698" y1="310" x2="560" y2="358" />
          <circle cx="560" cy="358" r="7" />
          <line x1="560" y1="358" x2="400" y2="305" />
          <circle cx="400" cy="305" r="6" />
          {/* Tool mount, then the jaws that take the stem. */}
          <path d="M400 305 l -22 -7" />
          <path d="M378 298 l -16 -12 M378 298 l -12 14" stroke={SIGNAL} />
          <path d="M362 286 l -18 -4 M366 312 l -18 2" stroke={SIGNAL} />
        </g>
      </g>

      {/* Annotations. These name the parts the page's argument rests on. */}
      <Callout x={800} y={250} to={[766, 245]} label="vision" />
      <Callout x={800} y={512} to={[754, 508]} label="one chassis" />
      <Callout x={800} y={604} to={[760, 580]} label="pipe rail" />
      <Callout x={452} y={404} to={[478, 424]} label="crate" anchor="end" />
      <Callout x={432} y={246} to={[404, 297]} label="tool, swappable" />
    </svg>
  );
}
