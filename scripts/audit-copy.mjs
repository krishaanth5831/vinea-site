/**
 * Content-rule audit against the rendered pages.
 *
 * Checks the built HTML rather than /content, so anything hardcoded in JSX
 * is caught too. Run after `npm run build`.
 *
 * The site carries no digits, with one deliberate exception: the deck's
 * slides and the ROI calculator, where figures are the point. Those regions
 * are marked `data-numbers` in the markup and are cut out before checking,
 * so the rule still binds every other line of every page, including the
 * opening prose of /deck and /roi.
 */
import { readFileSync } from "node:fs";

const PAGES = [
  { route: "/", file: ".next/server/app/index.html" },
  { route: "/deck", file: ".next/server/app/deck.html" },
  { route: "/roi", file: ".next/server/app/roi.html" },
];

function decode(text) {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

const VOID = new Set(["area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/**
 * Removes every element carrying `data-numbers`, with all it contains.
 * Walks the tags and counts depth for the element's own tag name, which is
 * enough for the server-rendered markup React produces.
 */
function stripNumberRegions(html) {
  let out = html;
  for (;;) {
    const open = /<([a-zA-Z][\w-]*)\b[^>]*\sdata-numbers(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?[^>]*>/.exec(out);
    if (!open) return out;
    const tag = open[1].toLowerCase();
    const start = open.index;
    if (VOID.has(tag) || open[0].endsWith("/>")) {
      out = out.slice(0, start) + out.slice(start + open[0].length);
      continue;
    }
    const scanner = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    scanner.lastIndex = start + open[0].length;
    let depth = 1;
    let end = out.length;
    for (let m = scanner.exec(out); m; m = scanner.exec(out)) {
      if (m[0].endsWith("/>")) continue;
      depth += m[1] ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    out = out.slice(0, start) + " " + out.slice(end);
  }
}

function linesOf(raw) {
  /* Scripts first: the RSC payload repeats every string on the page. */
  const html = stripNumberRegions(
    raw
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " "),
  );

  /*
   * Text a screen reader speaks is text on the site, so the labelling
   * attributes are audited alongside the prose. They are collected before
   * <svg> is discarded, since that is where a drawing's description lives.
   */
  const spoken = [...html.matchAll(/(?:aria-label|alt|title)="([^"]*)"/gi)]
    .map((match) => decode(match[1]))
    .filter(Boolean);

  const visible = html
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, "\n");

  return [...decode(visible).split("\n"), ...spoken]
    .map((line) => line.trim())
    .filter(Boolean);
}

const checks = [
  { name: "digits", re: /[0-9]/ },
  {
    name: "number words",
    re: /\b(one|two|three|four|five|six|seven|eight|nine|ten|dozen|dozens|hundred|thousand|percent)\b/i,
  },
  {
    name: "load-bearing adjectives",
    re: /\b(efficien\w*|sustainab\w*|impact\w*|innovat\w*|cutting[- ]edge|revolutionis\w*|revolutioniz\w*)\b/i,
  },
  {
    name: "fake traction",
    re: /\b(validated with growers|grower[- ]backed|design partners?|letters? of intent)\b/i,
  },
];

let digitsClean = true;
let flagged = 0;
let scanned = 0;

for (const page of PAGES) {
  const lines = linesOf(readFileSync(page.file, "utf8"));
  scanned += lines.length;
  console.log(`\n${page.route}`);

  for (const check of checks) {
    const hits = lines.filter((line) => check.re.test(line));
    if (hits.length === 0) {
      console.log(`  PASS  ${check.name}`);
      continue;
    }
    console.log(`  HITS  ${check.name} (${hits.length}) — review each:`);
    for (const hit of hits) console.log(`          ${hit}`);
    flagged += hits.length;
    if (check.name === "digits") digitsClean = false;
  }
}

console.log(`\nVisible text blocks scanned: ${scanned}`);
console.log(`Lines flagged for review: ${flagged}`);

/*
 * Reviewed rather than enforced. "one" reads as "a single" throughout, and
 * the traction phrases only ever appear inside denials, so hits are read
 * rather than failed on. Digits outside the marked regions are the check
 * that must stay at zero.
 */
process.exit(digitsClean ? 0 : 1);
