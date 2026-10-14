"use client";

import { useId, useState, type ReactNode } from "react";

import type { Provenance } from "@/content";

/**
 * Where a number comes from, said next to it: a source to click through to,
 * the reader's own estimate, or a provisional figure.
 */
export function ProvenanceTag({ provenance }: { provenance: Provenance }) {
  const base = "roi-tag t-mono";
  if (provenance.kind === "source" && provenance.href) {
    return (
      <a
        href={provenance.href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${base} roi-tag-source`}
      >
        {provenance.label}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }
  return <span className={`${base} roi-tag-${provenance.kind}`}>{provenance.label}</span>;
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  /** Shown after the number: "ha", "€ per hour". */
  unit?: string;
  /** The stored value is a fraction, shown and typed as a percentage. */
  percent?: boolean;
  help?: string;
  provenance?: Provenance;
  /** Hide the label visually, for fields inside a card that names them. */
  compact?: boolean;
};

const roundTo = (value: number, step: number) => {
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number((Math.round(value / step) * step).toFixed(decimals));
};

/**
 * A number with a slider under it. The box takes exact values, the slider
 * takes quick ones, and both write to the same state. While the box has
 * focus it shows what the reader typed, so clearing it to retype does not
 * snap it to a bound; it settles to the clamped value on blur or Enter.
 */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  percent = false,
  help,
  provenance,
  compact = false,
}: NumberFieldProps) {
  const id = useId();
  const scale = percent ? 100 : 1;
  const shown = roundTo(value * scale, percent ? 0.1 : step);
  const [draft, setDraft] = useState<string | null>(null);

  const parse = (raw: string) => {
    const parsed = Number(raw.replace(",", ".")) / scale;
    return raw.trim() === "" || !Number.isFinite(parsed) ? null : parsed;
  };

  /* Typing commits as it goes, but only values already inside the bounds. */
  const onType = (raw: string) => {
    setDraft(raw);
    const parsed = parse(raw);
    if (parsed !== null && parsed >= min && parsed <= max) onChange(parsed);
  };

  const settle = (raw: string) => {
    const parsed = parse(raw);
    if (parsed !== null) onChange(Math.min(max, Math.max(min, parsed)));
    setDraft(null);
  };

  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="roi-field">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className={compact ? "roi-label-compact" : "roi-label"}>
          {label}
        </label>
        {provenance ? <ProvenanceTag provenance={provenance} /> : null}
      </div>

      <div className="roi-input">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft ?? String(shown)}
          onFocus={() => setDraft(String(shown))}
          onChange={(event) => onType(event.target.value)}
          onBlur={(event) => settle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              settle(event.currentTarget.value);
              setDraft(null);
              event.currentTarget.select();
            }
          }}
          aria-describedby={help ? `${id}-help` : undefined}
        />
        <span className="roi-unit">{percent ? "%" : unit}</span>
      </div>

      <input
        type="range"
        className="roi-range"
        aria-label={`${label}, slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      {help ? (
        <p id={`${id}-help`} className="roi-help">
          {help}
        </p>
      ) : null}
    </div>
  );
}

/** A row of square options, one chosen: a radio group dressed as a switch. */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  help,
}: {
  legend: string;
  options: { id: string; label: string }[];
  value: T;
  onChange: (value: T) => void;
  help?: string;
}) {
  const name = useId();
  return (
    <fieldset className="roi-field m-0 min-w-0 border-0 p-0">
      <legend className="roi-label float-left w-full">{legend}</legend>
      <div className="roi-segmented clear-both">
        {options.map((option) => (
          <label key={option.id} className="roi-segment">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id as T)}
              className="sr-only"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {help ? <p className="roi-help">{help}</p> : null}
    </fieldset>
  );
}

/** An on/off switch with square corners, like the mark's cells. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="roi-switch"
    >
      <span aria-hidden="true" className="roi-switch-knob" />
    </button>
  );
}

/** A titled group of inputs. */
export function Group({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="roi-group">
      <h2 className="roi-group-title">{title}</h2>
      {lead ? <p className="roi-help mt-2 mb-0">{lead}</p> : null}
      <div className="mt-7 grid gap-7">{children}</div>
    </section>
  );
}
