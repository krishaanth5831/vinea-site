import { loadSubmissions, toCsv } from "@/lib/submissions";

/*
 * Every saved estimate as a spreadsheet, for Vinea only, with no password.
 *
 * It answers only on the project's own *.vercel.app addresses, which Vercel
 * Deployment Protection (Settings → Deployment Protection, Standard) puts
 * behind a Vercel login, and on localhost for development. On getvinea.nl,
 * the one public address, it does not exist. So: open
 *
 *   https://vinea-site-krishaanth-ramaraj.vercel.app/api/roi/export
 *
 * while logged in to Vercel, and the CSV downloads. Add ?format=json for the
 * raw records.
 *
 * ⚠️ This leans entirely on Deployment Protection. If it is ever switched
 * off, or widened to "none", these addresses become public and so does
 * this route. Turn the route off first.
 */

export const dynamic = "force-dynamic";

function servedHere(request: Request): boolean {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") return true;
  return host.endsWith(".vercel.app");
}

export async function GET(request: Request) {
  if (!servedHere(request)) return new Response("Not found", { status: 404 });

  const rows = await loadSubmissions();
  const headers = { "cache-control": "no-store", "x-robots-tag": "noindex" };

  if (new URL(request.url).searchParams.get("format") === "json") {
    return Response.json(rows, { headers });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(toCsv(rows), {
    headers: {
      ...headers,
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="vinea-roi-estimates-${stamp}.csv"`,
    },
  });
}
