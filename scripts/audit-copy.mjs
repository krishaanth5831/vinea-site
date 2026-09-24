/**
 * Content-rule audit against the rendered page.
 *
 * Checks the built HTML rather than /content, so anything hardcoded in JSX
 * is caught too. Run after `npm run build`.
 */
import { readFileSync } from "node:fs";

const html = readFileSync(".next/server/app/index.html", "utf8");

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

/*
 * Text a screen reader speaks is text on the site, so the labelling
 * attributes are audited alongside the prose. They are collected before the
 * tags are stripped, and before <svg> is discarded, since that is where the
 * aisle diagram's description lives.
 */
const spoken = [...html.matchAll(/(?:aria-label|alt|title)="([^"]*)"/gi)]
  .map((match) => decode(match[1]))
  .filter(Boolean);

/* Strip everything the reader never sees, then decode entities. */
const visible = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
  .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, "\n")
;

const lines = [...decode(visible).split("\n"), ...spoken]
  .map((line) => line.trim())
  .filter(Boolean);

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

let flagged = 0;

for (const check of checks) {
  const hits = lines.filter((line) => check.re.test(line));
  if (hits.length === 0) {
    console.log(`PASS  ${check.name}`);
    continue;
  }
  console.log(`HITS  ${check.name} (${hits.length}) — review each:`);
  for (const hit of hits) console.log(`        ${hit}`);
  flagged += hits.length;
}

console.log(`\nVisible text blocks scanned: ${lines.length}`);
console.log(`Lines flagged for review: ${flagged}`);

/*
 * Reviewed rather than enforced. "one" reads as "a single" throughout, and
 * the traction phrases only ever appear inside denials, so hits are read
 * rather than failed on. Digits are the check that must stay at zero.
 */
const digitsClean = checks
  .filter((check) => check.name === "digits")
  .every((check) => !lines.some((line) => check.re.test(line)));

process.exit(digitsClean ? 0 : 1);
