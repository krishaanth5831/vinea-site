"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { roi } from "@/content";
import { formatEuro, formatEuroCents, formatTenth, formatWhole } from "@/lib/format";
import {
  DEFAULT_INPUT,
  LIMITS,
  computeRoi,
  type CropId,
  type ModuleId,
  type ModuleInput,
  type PipeRailId,
  type RoiInput,
} from "@/lib/roi";

import { Container } from "../Container";
import { Group, NumberField, ProvenanceTag, Segmented, Toggle } from "./Fields";
import { Counter, ModuleBars, YearChart } from "./Results";
import { SaveEstimate } from "./SaveEstimate";

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

const years = (n: number) =>
  `${n} ${n === 1 ? roi.assumptions.years.one : roi.assumptions.years.unit}`;

/**
 * The calculator: the greenhouse and the jobs on the left, what it comes to
 * on the right, held in view while the inputs scroll. Below, the same
 * result job by job and year by year, then the save form and the method.
 *
 * All arithmetic is `computeRoi` in `src/lib/roi.ts`, which the save route
 * runs again on the server, so what is stored is what the reader saw.
 */
export function Roi() {
  const [input, setInput] = useState<RoiInput>(DEFAULT_INPUT);
  const result = useMemo(() => computeRoi(input), [input]);
  const inputsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [dock, setDock] = useState(false);
  /* Which inputs the reader touched, so a saved record can tell them apart. */
  const [changed, setChanged] = useState<string[]>([]);
  const touch = (...keys: string[]) =>
    setChanged((current) => {
      const fresh = keys.filter((key) => !current.includes(key));
      return fresh.length ? [...current, ...fresh] : current;
    });

  const set = <K extends keyof RoiInput>(key: K, value: RoiInput[K]) => {
    touch(key);
    setInput((current) => ({ ...current, [key]: value }));
  };

  const setModule = (id: ModuleId, patch: Partial<ModuleInput>) => {
    touch(...Object.keys(patch).map((key) => `${id}.${key}`));
    setInput((current) => ({
      ...current,
      modules: { ...current.modules, [id]: { ...current.modules[id], ...patch } },
    }));
  };

  /*
   * On a phone the summary sits below the inputs, out of sight while they
   * are being changed. A small bar at the foot of the screen carries the
   * headline figure until the summary itself comes into view.
   */
  useEffect(() => {
    const inputs = inputsRef.current;
    const summary = summaryRef.current;
    if (!inputs || !summary || typeof IntersectionObserver === "undefined") return;
    let inputsVisible = false;
    let summaryVisible = false;
    const update = () => setDock(inputsVisible && !summaryVisible);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === inputs) inputsVisible = entry.isIntersecting;
        if (entry.target === summary) summaryVisible = entry.isIntersecting;
      }
      update();
    });
    observer.observe(inputs);
    observer.observe(summary);
    return () => observer.disconnect();
  }, []);

  const copy = roi;
  const names = Object.fromEntries(
    copy.modules.items.map((item) => [item.id, { name: item.name, job: item.job }]),
  ) as Record<ModuleId, { name: string; job: string }>;

  return (
    <>
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div ref={inputsRef} className="grid gap-14">
          <Group title={copy.greenhouse.heading}>
            <Segmented<CropId>
              legend={copy.greenhouse.crop.label}
              options={copy.greenhouse.crop.options}
              value={input.crop}
              onChange={(crop) => set("crop", crop)}
            />
            <div className="grid gap-7 sm:grid-cols-2">
              <NumberField
                label={copy.greenhouse.area.label}
                unit={copy.greenhouse.area.unit}
                value={input.areaHa}
                onChange={(v) => set("areaHa", v)}
                {...LIMITS.areaHa}
              />
              <NumberField
                label={copy.greenhouse.cost.label}
                unit={copy.greenhouse.cost.unit}
                value={input.costPerHour}
                onChange={(v) => set("costPerHour", v)}
                help={copy.greenhouse.cost.help}
                provenance={copy.greenhouse.cost.provenance}
                {...LIMITS.costPerHour}
              />
            </div>
            <NumberField
              label={copy.greenhouse.hours.label}
              unit={copy.greenhouse.hours.unit}
              value={input.hoursPerHa}
              onChange={(v) => set("hoursPerHa", v)}
              help={copy.greenhouse.hours.help}
              provenance={copy.greenhouse.hours.provenance}
              {...LIMITS.hoursPerHa}
            />
            <Segmented<PipeRailId>
              legend={copy.greenhouse.pipeRail.label}
              options={copy.greenhouse.pipeRail.options}
              value={input.pipeRail}
              onChange={(pipeRail) => set("pipeRail", pipeRail)}
              help={copy.greenhouse.pipeRail.help}
            />
          </Group>

          <Group title={copy.modules.heading} lead={copy.modules.lead}>
            <div className="roi-module" data-on="">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-label m-0">{copy.modules.spine.name}</p>
                  <p className="m-0 mt-1.5 text-[0.9375rem] text-muted">{copy.modules.spine.job}</p>
                </div>
                <span className="roi-tag roi-tag-source t-mono">{copy.modules.spine.badge}</span>
              </div>
              <p className="roi-help mt-3 mb-0">{copy.modules.spine.body}</p>
            </div>

            {copy.modules.items.map((item) => {
              const m = input.modules[item.id];
              return (
                <div key={item.id} className="roi-module" data-on={m.on ? "" : undefined}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="t-label m-0">{item.name}</p>
                      <p className="m-0 mt-1.5 text-[0.9375rem] text-muted">{item.job}</p>
                    </div>
                    <Toggle
                      checked={m.on}
                      onChange={(on) => setModule(item.id, { on })}
                      label={`${item.name}, ${item.job}`}
                    />
                  </div>
                  <p className="roi-help mt-3 mb-0">{item.body}</p>
                  <div className="roi-module-fields" inert={!m.on}>
                    <NumberField
                      compact
                      percent
                      label={copy.modules.shareLabel}
                      value={m.share}
                      onChange={(share) => setModule(item.id, { share })}
                      provenance={item.shareProvenance}
                      {...LIMITS.share}
                    />
                    <NumberField
                      compact
                      percent
                      label={copy.modules.takeoverLabel}
                      value={m.takeover}
                      onChange={(takeover) => setModule(item.id, { takeover })}
                      provenance={copy.modules.takeoverProvenance}
                      {...LIMITS.takeover}
                    />
                  </div>
                </div>
              );
            })}

            {result.shareOn > 1 ? (
              <p role="alert" className="roi-warning">
                {copy.modules.overflowWarning}
              </p>
            ) : null}
          </Group>

          <Group title={copy.assumptions.heading}>
            <NumberField
              percent
              label={copy.assumptions.rent.label}
              value={input.rentShare}
              onChange={(v) => set("rentShare", v)}
              help={copy.assumptions.rent.help}
              provenance={copy.assumptions.rent.provenance}
              {...LIMITS.rentShare}
            />
            <div className="grid gap-7 sm:grid-cols-2">
              <NumberField
                percent
                label={copy.assumptions.growth.label}
                value={input.wageGrowth}
                onChange={(v) => set("wageGrowth", v)}
                help={copy.assumptions.growth.help}
                provenance={copy.assumptions.growth.provenance}
                {...LIMITS.wageGrowth}
              />
              <NumberField
                label={copy.assumptions.workerHours.label}
                unit={copy.assumptions.workerHours.unit}
                value={input.workerHours}
                onChange={(v) => set("workerHours", v)}
                help={copy.assumptions.workerHours.help}
                provenance={copy.assumptions.workerHours.provenance}
                {...LIMITS.workerHours}
              />
            </div>
            <NumberField
              label={copy.assumptions.years.label}
              unit={copy.assumptions.years.unit}
              value={input.years}
              onChange={(v) => set("years", Math.round(v))}
              {...LIMITS.years}
            />
          </Group>
        </div>

        <div className="lg:relative">
          <aside
            ref={summaryRef}
            id="summary"
            aria-labelledby="summary-heading"
            className="roi-summary lg:sticky lg:top-24"
          >
            <h2 id="summary-heading" className="t-label m-0 inline-flex items-center gap-2.5 text-muted">
              <span aria-hidden="true" className="size-1.5 bg-fg" />
              {copy.results.heading}
            </h2>

            <p className="t-mono mt-8 mb-0 text-muted">{copy.results.savingLabel}</p>
            <p className="roi-hero m-0 mt-3">
              <Counter value={result.saving} format={formatEuro} live />
            </p>
            <p className="m-0 mt-3 text-[0.9375rem] text-muted">
              {fill(copy.results.savingOver, {
                value: formatEuro(result.total.saving),
                years: years(input.years),
              })}
            </p>

            <dl className="m-0 mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line">
              <Tile label={copy.results.tiles.hours}>
                <Counter value={result.robotHours} format={formatWhole} />
              </Tile>
              <Tile label={copy.results.tiles.people}>
                <Counter value={result.workers} format={formatTenth} />
              </Tile>
              <Tile label={copy.results.tiles.today}>
                <Counter value={result.jobsCost} format={formatEuro} />
              </Tile>
              <Tile label={copy.results.tiles.rent}>
                <Counter value={result.rent} format={formatEuro} />
              </Tile>
            </dl>

            <p className="roi-help mt-6 mb-0">
              {fill(copy.results.crossCheck, { value: formatEuroCents(result.harvestPerM2) })}
            </p>
            <p className="roi-help mt-2 mb-0">{copy.results.rentNote}</p>

            <a href="#save" className="roi-link mt-6 inline-flex">
              {copy.save.heading}
              <span aria-hidden="true">↓</span>
            </a>
          </aside>
        </div>
      </Container>

      <Container className="mt-[clamp(5rem,10vw,8rem)] grid grid-cols-[minmax(0,1fr)] gap-x-[clamp(2rem,5vw,5rem)] gap-y-16 lg:grid-cols-2">
        <ModuleBars result={result} names={names} copy={copy.results} />
        <YearChart result={result} copy={copy.results} />
      </Container>

      <Container className="mt-[clamp(5rem,10vw,8rem)] grid grid-cols-[minmax(0,1fr)] gap-x-[clamp(2rem,5vw,5rem)] gap-y-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div id="save">
          <SaveEstimate input={input} changed={changed} copy={copy.save} />
        </div>
        <section aria-labelledby="method-heading" className="roi-method">
          <h2 id="method-heading" className="roi-group-title">
            {copy.method.heading}
          </h2>
          <ol className="m-0 mt-6 grid list-none gap-3 p-0">
            {copy.method.steps.map((step) => (
              <li key={step} className="roi-help m-0 flex gap-3">
                <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-faint" />
                {step}
              </li>
            ))}
          </ol>
          <h3 className="roi-subhead mt-10">{copy.method.sourcesHeading}</h3>
          <ul className="m-0 mt-4 grid list-none gap-3 p-0">
            {copy.method.sources.map((source) => (
              <li key={source.label} className="roi-help m-0">
                {source.href ? (
                  <a href={source.href} target="_blank" rel="noreferrer noopener" className="roi-link">
                    {source.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ) : (
                  source.label
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <ProvenanceTag provenance={{ kind: "source", label: copy.method.key.source }} />
            <ProvenanceTag provenance={{ kind: "estimate", label: copy.method.key.estimate }} />
            <ProvenanceTag provenance={{ kind: "provisional", label: copy.method.key.provisional }} />
          </div>
        </section>
      </Container>

      <a href="#summary" className="roi-dock lg:hidden" data-show={dock ? "" : undefined} aria-hidden={!dock} tabIndex={dock ? 0 : -1}>
        <span className="t-mono text-muted">{copy.results.savingLabel}</span>
        <span className="text-[1.0625rem] font-medium tabular-nums">{formatEuro(result.saving)}</span>
      </a>
    </>
  );
}

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 bg-bg p-4 sm:p-5">
      <dt className="text-[0.8125rem] leading-snug text-muted">{label}</dt>
      <dd className="m-0 text-[clamp(1.25rem,2.2vw,1.625rem)] font-medium tracking-[-0.02em]">{children}</dd>
    </div>
  );
}
