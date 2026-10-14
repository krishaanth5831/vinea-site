import { timingSafeEqual } from "node:crypto";

import { loadSubmissions, toCsv } from "@/lib/submissions";

/*
 * Every saved estimate as a spreadsheet, for Vinea only.
 *
 * Open /api/roi/export in a browser and it asks for a password: any user
 * name, and the value of ROI_EXPORT_KEY as the password. Add ?format=json
 * for the raw records. With no key set, the route does not exist.
 */

export const dynamic = "force-dynamic";

function authorised(request: Request, key: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const password = decoded.slice(decoded.indexOf(":") + 1);
  const a = Buffer.from(password);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const key = process.env.ROI_EXPORT_KEY;
  if (!key) return new Response("Not found", { status: 404 });

  if (!authorised(request, key)) {
    return new Response("Password required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Vinea ROI estimates", charset="UTF-8"' },
    });
  }

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
