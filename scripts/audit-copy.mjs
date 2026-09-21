/**
 * Content-rule audit against the rendered page.
 *
 * Checks the built HTML rather than /content, so anything hardcoded in JSX
 * is caught too. Run after `npm run build`.
 */
import { readFileSync } from "node:fs";

const html = readFileSync(".next/server/app/index.html", "utf8");

/* Strip everything the reader never sees, then decode entities. */
const visible = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&#x27;/g, "'")
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ");

const lines = visible
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const checks = [
  { name: "digits", re: /[0-9]/ },
  {
    name: "number words",
    re: /\b(one|two|three|four|five|six|seven|eight|nine|ten|dozen|dozens|hundred|thousand|percent)\b/i,
  },
  {
    name: "pivot language",
    re: /\b(pivot|pivoted|pivoting|previously|originally|used to|now we think)\b/i,
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
