/**
 * Responsive and motion check against a running server.
 *
 * Exists because the two worst bugs this site has had were both invisible in
 * source review: scroll reveals that never fired and left whole sections
 * blank at phone width, and content stranded when a reader outran hydration.
 * Both are caught here.
 *
 * On the overflow assertion: `body` carries `overflow-x: clip`, which raises
 * the fair question of whether it hides the overflow this is looking for. It
 * does not — planting a wide element takes documentElement.scrollWidth from
 * the viewport width to the element's width, so the check discriminates.
 * Measuring children's right edges instead would be worse: the crop field and
 * the schematic both legitimately extend past the viewport under the clip, so
 * that version reports an overflow on a clean page.
 *
 *   npm run build && npm start &   # or any running server
 *   npm run check:responsive -- http://localhost:3000
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";

const CHROME = [
  "/opt/google/chrome/chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((path) => existsSync(path));

if (!CHROME) {
  console.log("No Chrome binary found — skipping.");
  process.exit(0);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

/**
 * @param settleMs 0 scrolls the moment the page loads, which is how a reader
 * outruns hydration. Both cases have to pass.
 */
async function scan(width, height, label, settleMs, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (reducedMotion) {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  }
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(URL, { waitUntil: "networkidle0" });
  if (settleMs) await new Promise((r) => setTimeout(r, settleMs));

  if (!reducedMotion) {
    const height_ = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height_; y += Math.floor(height / 2)) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 1800));
  }

  const result = await page.evaluate(() => {
    const revealed = [...document.querySelectorAll("[data-reveal]")];
    const body = document.body.cloneNode(true);
    body.querySelectorAll("script,style,noscript,svg").forEach((n) => n.remove());
    const spoken = [...document.querySelectorAll("[aria-label],[alt],[title]")]
      .map((e) => e.getAttribute("aria-label") ?? e.getAttribute("alt") ?? e.getAttribute("title") ?? "")
      .join(" ");
    const digits = `${body.innerText ?? ""} ${spoken}`.match(/\d/g);
    return {
      reveals: revealed.length,
      hidden: revealed.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.95).length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      cls: Number(window.__cls.toFixed(4)),
      digits: digits ? digits.length : 0,
    };
  });

  const bad =
    result.hidden > 0 || result.overflow || result.cls > 0.01 || result.digits > 0;
  console.log(
    `${bad ? "FAIL" : "ok  "}  ${label.padEnd(30)} reveals ${result.reveals}` +
      `  hidden ${result.hidden}  overflow ${result.overflow}` +
      `  CLS ${result.cls}  digits ${result.digits}`,
  );
  await page.close();
  return bad;
}

const failures = [
  await scan(390, 844, "mobile, scrolled at once", 0),
  await scan(390, 844, "mobile, hydration settled", 2500),
  await scan(1440, 900, "desktop", 0),
  await scan(390, 844, "mobile, reduced motion", 1500, true),
].filter(Boolean);

await browser.close();
console.log(failures.length ? "\nFAIL" : "\nPASS");
process.exit(failures.length ? 1 : 0);
