"use client";

import { useEffect, useRef, useState } from "react";

import type { RoiContent } from "@/content";
import { formatEuro, formatEuroShort } from "@/lib/format";
import { DURATION, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";
import type { ModuleId, RoiResult } from "@/lib/roi";

/**
 * A figure that counts to its new value instead of jumping, so a reader
 * moving a slider sees which way and how far the number went.
 *
 * React renders the first value and is never asked to change the text
 * again; GSAP writes every update after that, so the two never fight over
 * the same text node. Screen readers get the settled value separately.
 */
export function Counter({
  value,
  format,
  className = "",
  live = false,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  /** Announce the settled value to screen readers. */
  live?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const [first] = useState(() => format(value));
  const [settled, setSettled] = useState(first);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => {
      shown.current = value;
      el.textContent = format(value);
      if (live) setSettled(format(value));
    };
    if (prefersReducedMotion() || shown.current === value) {
      done();
      return;
    }
    const state = { n: shown.current };
    const tween = gsap.to(state, {
      n: value,
      duration: DURATION.fast,
      ease: EASE,
      onUpdate: () => {
        shown.current = state.n;
        el.textContent = format(state.n);
      },
      onComplete: done,
    });
    return () => {
      tween.kill();
    };
  }, [value, format, live]);

  return (
    <>
      <span ref={ref} aria-hidden={live || undefined} className={`tabular-nums ${className}`}>
        {first}
      </span>
      {live ? (
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {settled}
        </span>
      ) : null}
    </>
  );
}

/**
 * Each job switched on, as a bar: what the robots take over, then what is
 * still done by hand. Bars share one scale, so the biggest job is the
 * longest bar and the others read against it.
 */
export function ModuleBars({
  result,
  names,
  copy,
}: {
  result: RoiResult;
  names: Record<ModuleId, { name: string; job: string }>;
  copy: RoiContent["results"];
}) {
  const max = Math.max(1, ...result.modules.map((m) => m.jobCost));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="roi-subhead">{copy.modulesHeading}</h3>
        <Legend items={[{ label: copy.legendRobot, tone: "fg" }, { label: copy.legendHand, tone: "faint" }]} />
      </div>

      {result.modules.length === 0 ? (
        <p className="roi-help mt-6">{copy.empty}</p>
      ) : (
        <ul className="m-0 mt-6 grid list-none gap-6 p-0">
          {result.modules.map((m) => {
            const robot = m.replaced / max;
            const hand = (m.jobCost - m.replaced) / max;
            return (
              <li key={m.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="m-0 text-[0.9375rem]">
                    <span className="t-label mr-2.5 text-[0.6875rem]">{names[m.id].name}</span>
                    <span className="text-muted">{names[m.id].job}</span>
                  </p>
                  <p className="m-0 font-mono text-[0.8125rem] text-muted tabular-nums">
                    <span className="text-fg">{formatEuro(m.replaced)}</span> /{" "}
                    {formatEuro(m.jobCost - m.replaced)}
                  </p>
                </div>
                <div
                  className="roi-bar mt-2.5"
                  role="img"
                  aria-label={`${names[m.id].name}: ${copy.legendRobot} ${formatEuro(m.replaced)}, ${copy.legendHand} ${formatEuro(m.jobCost - m.replaced)}`}
                >
                  <span className="roi-bar-seg bg-fg" style={{ transform: `scaleX(${robot})` }} />
                  <span
                    className="roi-bar-seg bg-faint"
                    style={{
                      transform: `translateX(calc(${robot * 100}% + ${robot > 0 ? 2 : 0}px)) scaleX(${hand})`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Legend({ items }: { items: { label: string; tone: "fg" | "faint" }[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
      {items.map((item) => (
        <li key={item.label} className="t-mono inline-flex items-center gap-2 text-muted">
          <span aria-hidden="true" className={`size-2.5 ${item.tone === "fg" ? "bg-fg" : "bg-faint"}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Year by year: what the chosen jobs cost by hand, against what they cost
 * with Vinea doing its share. One axis, both series on it, the gap between
 * each pair is the saving. Hovering or focusing a year shows its figures.
 */
export function YearChart({ result, copy }: { result: RoiResult; copy: RoiContent["results"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...result.years.map((y) => y.byHand));
  const ticks = [1, 0.5, 0];
  const focus = hover !== null ? result.years[hover] : null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="roi-subhead">{copy.chartHeading}</h3>
        <Legend
          items={[
            { label: copy.legendByHand, tone: "faint" },
            { label: copy.legendWithVinea, tone: "fg" },
          ]}
        />
      </div>

      <div className="relative mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        {/* The axis: three labels, recessive. */}
        <div aria-hidden="true" className="relative h-48 w-12">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 font-mono text-[0.6875rem] text-faint tabular-nums"
              style={{ bottom: `calc(${t * 100}% - 0.4rem)` }}
            >
              {formatEuroShort(max * t)}
            </span>
          ))}
        </div>

        <div className="relative h-48" onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <span
              key={t}
              aria-hidden="true"
              className="absolute inset-x-0 h-px bg-line"
              style={{ bottom: `${t * 100}%` }}
            />
          ))}

          <div className="relative flex h-full items-end gap-[clamp(0.25rem,1.5vw,0.875rem)]">
            {result.years.map((y, i) => (
              <button
                key={y.year}
                type="button"
                className="roi-year group"
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${copy.yearLabel} ${y.year}: ${copy.legendByHand} ${formatEuro(y.byHand)}, ${copy.legendWithVinea} ${formatEuro(y.withVinea)}`}
              >
                <span className="roi-col bg-faint" style={{ transform: `scaleY(${y.byHand / max})` }} />
                <span className="roi-col bg-fg" style={{ transform: `scaleY(${y.withVinea / max})` }} />
              </button>
            ))}
          </div>

          {focus ? (
            <div
              aria-hidden="true"
              className="roi-tip"
              style={{
                left: `${((hover! + 0.5) / result.years.length) * 100}%`,
              }}
            >
              <p className="t-mono m-0 text-muted">
                {copy.yearLabel} {focus.year}
              </p>
              <p className="m-0 mt-1.5 flex justify-between gap-4 text-[0.8125rem] tabular-nums">
                <span className="text-muted">{copy.legendByHand}</span>
                {formatEuro(focus.byHand)}
              </p>
              <p className="m-0 flex justify-between gap-4 text-[0.8125rem] tabular-nums">
                <span className="text-muted">{copy.legendWithVinea}</span>
                {formatEuro(focus.withVinea)}
              </p>
            </div>
          ) : null}
        </div>

        <div />
        <div aria-hidden="true" className="flex gap-[clamp(0.25rem,1.5vw,0.875rem)]">
          {result.years.map((y) => (
            <span key={y.year} className="flex-1 text-center font-mono text-[0.6875rem] text-faint">
              {y.year}
            </span>
          ))}
        </div>
      </div>

      {/* The same figures as a table, for screen readers. */}
      <table className="sr-only">
        <caption>{copy.chartHeading}</caption>
        <thead>
          <tr>
            <th scope="col">{copy.yearLabel}</th>
            <th scope="col">{copy.legendByHand}</th>
            <th scope="col">{copy.legendWithVinea}</th>
          </tr>
        </thead>
        <tbody>
          {result.years.map((y) => (
            <tr key={y.year}>
              <th scope="row">{y.year}</th>
              <td>{formatEuro(y.byHand)}</td>
              <td>{formatEuro(y.withVinea)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
