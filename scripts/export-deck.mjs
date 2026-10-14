/**
 * Prints /deck to `public/vinea-deck.pdf`, one slide to a page, so the PDF
 * on the site always says what the page says.
 *
 * Reduced motion is switched on first, which leaves every slide in place
 * without waiting for an entrance; the print rules in globals.css hide the
 * header, the rail and the opening, and size each slide to a page.
 *
 *   npm run build && npm start &   # or any running server
 *   npm run export:deck -- http://localhost:3000
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = "public/vinea-deck.pdf";

const CHROME = [
  "/opt/google/chrome/chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((path) => existsSync(path));

if (!CHROME) {
  console.error("No Chrome binary found.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(`${BASE}/deck`, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: OUT,
  width: "1600px",
  height: "900px",
  printBackground: true,
  preferCSSPageSize: true,
});

const pages = await page.evaluate(() => document.querySelectorAll(".deck-slide").length);
await browser.close();
console.log(`Wrote ${OUT}: ${pages} slides.`);
