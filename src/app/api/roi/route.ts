import { INPUT_KEYS, parseRoiInput } from "@/lib/roi";
import { saveSubmission, summarise, type Contact } from "@/lib/submissions";

/*
 * Saves one ROI estimate. The page posts the reader's inputs and whatever
 * contact details they chose to give; the result is worked out again here
 * rather than trusted from the browser.
 *
 * No IP address, user agent or cookie is stored. Spam is turned away by a
 * hidden field people never fill, a minimum time on the page, and a size
 * cap, which is enough for a form that sends nothing anywhere.
 */

const MAX_BYTES = 16_000;
const MIN_MS_ON_PAGE = 2_500;

const ROLES = ["grower", "adviser", "investor", "other"];
const COUNTRIES = ["nl", "be", "de", "uk", "fr", "es", "elsewhere"];

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES) {
    return Response.json({ ok: false, error: "too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "not json" }, { status: 400 });
  }

  /* Bots: answer as if it worked, and keep nothing. */
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (text(body.website, 200) !== "" || elapsed < MIN_MS_ON_PAGE) {
    return Response.json({ ok: true });
  }

  const input = parseRoiInput(body.input);
  if (!input) {
    return Response.json({ ok: false, error: "bad input" }, { status: 422 });
  }

  const c = (body.contact ?? {}) as Record<string, unknown>;
  const email = text(c.email, 200);
  const consent = c.consent === true;
  if (email && (!EMAIL.test(email) || !consent)) {
    return Response.json({ ok: false, error: "email needs consent" }, { status: 422 });
  }

  /* Anything not chosen from the list is stored as unanswered, never guessed. */
  const contact: Contact = {
    role: ROLES.includes(text(c.role, 20)) ? text(c.role, 20) : "unanswered",
    country: COUNTRIES.includes(text(c.country, 20)) ? text(c.country, 20) : "unanswered",
    name: text(c.name, 200),
    company: text(c.company, 200),
    email,
    message: text(c.message, 2000),
    consent,
  };

  const known: readonly string[] = INPUT_KEYS;
  const changed = Array.isArray(body.changed)
    ? [...new Set(body.changed.filter((key): key is string => known.includes(key as string)))]
    : [];

  try {
    await saveSubmission({
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      input,
      changed,
      result: summarise(input),
      contact,
    });
  } catch (error) {
    console.error("[roi] save failed", error);
    return Response.json({ ok: false, error: "not saved" }, { status: 503 });
  }

  return Response.json({ ok: true });
}
