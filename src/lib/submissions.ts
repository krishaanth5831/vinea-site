import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { get, list, put } from "@vercel/blob";

import { computeRoi, MODULE_IDS, type RoiInput } from "./roi";

/*
 * Where ROI estimates are kept.
 *
 * In production: a private Vercel Blob store, one JSON file per estimate
 * under `roi/`. Private means nothing is reachable by URL; the only way to
 * read them back is the export route, behind a password.
 *
 * In development, without Blob credentials: a JSON-lines file in `.data/`,
 * which git ignores, so a local run never writes to the live store.
 */

export type Contact = {
  role: string;
  country: string;
  name: string;
  company: string;
  email: string;
  message: string;
  consent: boolean;
};

export type Submission = {
  id: string;
  receivedAt: string;
  input: RoiInput;
  /** Inputs the reader touched; every other input is still its default. */
  changed: string[];
  /** Recomputed on the server from `input`, so it matches what was shown. */
  result: ReturnType<typeof summarise>;
  contact: Contact;
};

const LOCAL_FILE = path.join(process.cwd(), ".data", "roi-submissions.jsonl");

export const hasBlob = () =>
  Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

/** The figures worth keeping from a result: year one and the totals. */
export function summarise(input: RoiInput) {
  const r = computeRoi(input);
  return {
    cropHours: Math.round(r.cropHours),
    cropCost: Math.round(r.cropCost),
    jobsCost: Math.round(r.jobsCost),
    robotHours: Math.round(r.robotHours),
    replaced: Math.round(r.replaced),
    rent: Math.round(r.rent),
    saving: Math.round(r.saving),
    workers: Number(r.workers.toFixed(1)),
    totalSaving: Math.round(r.total.saving),
  };
}

export async function saveSubmission(submission: Submission): Promise<void> {
  const body = JSON.stringify(submission);

  if (hasBlob()) {
    const stamp = submission.receivedAt.replace(/[:.]/g, "-");
    await put(`roi/${stamp}-${submission.id}.json`, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("No Blob store is connected, so there is nowhere to save.");
  }

  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await appendFile(LOCAL_FILE, `${body}\n`, "utf8");
}

export async function loadSubmissions(): Promise<Submission[]> {
  if (!hasBlob()) {
    try {
      const text = await readFile(LOCAL_FILE, "utf8");
      return text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as Submission);
    } catch {
      return [];
    }
  }

  const found: Submission[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "roi/", cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const file = await get(blob.pathname, { access: "private" });
      if (!file || file.statusCode !== 200) continue;
      const text = await new Response(file.stream).text();
      try {
        found.push(JSON.parse(text) as Submission);
      } catch {
        /* A file that is not ours, or half written: skip it. */
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return found.sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
}

/* ---- CSV ---------------------------------------------------------------- */

const cell = (value: unknown) => {
  const text = value === undefined || value === null ? "" : String(value);
  /* Quote everything; neutralise cells a spreadsheet would run as formulas. */
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function toCsv(rows: Submission[]): string {
  const moduleHeads = MODULE_IDS.flatMap((id) => [`${id}_on`, `${id}_share`, `${id}_takeover`]);
  const head = [
    "received_at",
    "id",
    "role",
    "country",
    "name",
    "company",
    "email",
    "consent",
    "message",
    "crop",
    "pipe_rail",
    "area_ha",
    "hours_per_ha",
    "cost_per_hour",
    ...moduleHeads,
    "rent_share",
    "wage_growth",
    "worker_hours",
    "years",
    "changed",
    "jobs_cost_year_one",
    "robot_hours",
    "labour_replaced",
    "rent",
    "saving_year_one",
    "workers",
    "saving_total",
  ];

  const lines = rows.map((s) => {
    const { input: i, contact: c, result: r } = s;
    return [
      s.receivedAt,
      s.id,
      c.role,
      c.country,
      c.name,
      c.company,
      c.email,
      c.consent,
      c.message,
      i.crop,
      i.pipeRail,
      i.areaHa,
      i.hoursPerHa,
      i.costPerHour,
      ...MODULE_IDS.flatMap((id) => [i.modules[id].on, i.modules[id].share, i.modules[id].takeover]),
      i.rentShare,
      i.wageGrowth,
      i.workerHours,
      i.years,
      (s.changed ?? []).join(" "),
      r.jobsCost,
      r.robotHours,
      r.replaced,
      r.rent,
      r.saving,
      r.workers,
      r.totalSaving,
    ]
      .map(cell)
      .join(",");
  });

  return [head.map(cell).join(","), ...lines].join("\r\n") + "\r\n";
}
