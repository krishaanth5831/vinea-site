"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { RoiContent } from "@/content";
import type { RoiInput } from "@/lib/roi";

import { PixelArrow } from "../Button";
import { Segmented } from "./Fields";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Saves the reader's estimate, and their contact details if they give any.
 *
 * Nothing is sent until the button is pressed. Every contact field is
 * optional; an email only goes with a ticked consent box, because a reply is
 * the only thing it is for. A hidden field and the time since the page
 * opened turn away the simplest bots without a captcha.
 */
export function SaveEstimate({
  input,
  changed,
  copy,
}: {
  input: RoiInput;
  /** The inputs the reader touched; everything else is still a default. */
  changed: string[];
  copy: RoiContent["save"];
}) {
  const id = useId();
  const opened = useRef(0);
  /* Unanswered until chosen, so the record never claims a default. */
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [savedFor, setSavedFor] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const snapshot = JSON.stringify({ input, role, country, name, company, email, message, consent });
  const needsConsent = email.trim() !== "" && !consent;
  const saved = status === "done" && savedFor === snapshot;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (needsConsent || status === "sending") return;

    setStatus("sending");
    try {
      const response = await fetch("/api/roi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          input,
          changed,
          contact: { role, country, name, company, email, message, consent },
          website,
          elapsed: Date.now() - opened.current,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setSavedFor(snapshot);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} noValidate className="roi-save relative" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="roi-group-title">
        {copy.heading}
      </h2>
      <p className="roi-help mt-2 mb-0">{copy.lead}</p>

      <div className="mt-7 grid gap-7">
        <Segmented legend={copy.role.label} options={copy.role.options} value={role} onChange={setRole} />

        <div className="roi-field">
          <label htmlFor={`${id}-country`} className="roi-label">
            {copy.country.label}
          </label>
          <select
            id={`${id}-country`}
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="roi-text"
          >
            <option value="">{copy.country.placeholder}</option>
            {copy.country.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <TextField id={`${id}-name`} label={copy.name} optional={copy.optional} value={name} onChange={setName} autoComplete="name" />
          <TextField
            id={`${id}-company`}
            label={copy.company}
            optional={copy.optional}
            value={company}
            onChange={setCompany}
            autoComplete="organization"
          />
        </div>

        <TextField
          id={`${id}-email`}
          label={copy.email}
          optional={copy.optional}
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
        />

        <div className="roi-field">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-message`} className="roi-label">
              {copy.message}
            </label>
            <span className="t-mono text-faint">{copy.optional}</span>
          </div>
          <textarea
            id={`${id}-message`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            maxLength={2000}
            className="roi-text min-h-24 resize-y"
          />
        </div>

        {/* For bots only: people never see or fill this. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <div className="roi-field">
          <label className="roi-check">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              aria-describedby={needsConsent && touched ? `${id}-consent-error` : undefined}
            />
            <span aria-hidden="true" className="roi-check-box" />
            <span>{copy.consent}</span>
          </label>
          {needsConsent && touched ? (
            <p id={`${id}-consent-error`} className="roi-help m-0 text-fg">
              {copy.consentNeeded}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="submit" className="btn btn-primary" disabled={status === "sending" || saved}>
            {status === "sending" ? copy.sending : copy.submit}
            <PixelArrow />
          </button>
          <p role="status" className="m-0 text-[0.9375rem] text-muted">
            {saved ? (email.trim() ? copy.doneWithEmail : copy.done) : status === "error" ? copy.error : ""}
          </p>
        </div>

        <p className="roi-help m-0 max-w-[40rem]">{copy.privacy}</p>
      </div>
    </form>
  );
}

function TextField({
  id,
  label,
  optional,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  optional: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="roi-field">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="roi-label">
          {label}
        </label>
        <span className="t-mono text-faint">{optional}</span>
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        maxLength={200}
        className="roi-text"
      />
    </div>
  );
}
