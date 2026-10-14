/**
 * Checks that the ROI model's numbers add up.
 *
 * Exists because the calculator this one was modelled on shows totals that
 * do not reconcile with its own lines, and a grower who adds the numbers up
 * by hand should always get the total on the page. Transpiles the model
 * with TypeScript and imports it, so there is nothing to build first.
 *
 *   npm run check:roi
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/roi.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { computeRoi, parseRoiInput, DEFAULT_INPUT, MODULE_IDS } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const close = (a, b, label) =>
  assert.ok(Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${label}: ${a} ≠ ${b}`);

function reconcile(input, label) {
  const r = computeRoi(input);

  /* Per module: what the robots take over splits into rent and saving. */
  for (const m of r.modules) {
    close(m.replaced, m.rent + m.saving, `${label} ${m.id} replaced = rent + saving`);
    close(m.robotHours * input.costPerHour, m.replaced, `${label} ${m.id} hours × rate`);
    assert.ok(m.robotHours <= m.jobHours + 1e-9, `${label} ${m.id} robots ≤ job`);
  }

  /* Year one is the sum of the modules. */
  close(r.replaced, r.modules.reduce((s, m) => s + m.replaced, 0), `${label} replaced`);
  close(r.saving, r.replaced - r.rent, `${label} saving`);
  close(r.years[0].saving, r.saving, `${label} year one saving`);

  /* Every year, and the totals, add up. */
  for (const y of r.years) {
    close(y.byHand - y.withVinea, y.saving, `${label} year ${y.year}`);
  }
  close(r.total.byHand, r.years.reduce((s, y) => s + y.byHand, 0), `${label} total by hand`);
  close(r.total.withVinea, r.years.reduce((s, y) => s + y.withVinea, 0), `${label} total with`);
  close(r.total.saving, r.total.byHand - r.total.withVinea, `${label} total saving`);
  assert.equal(r.years.length, input.years, `${label} years`);
  return r;
}

/* The defaults, worked by hand, so a change to the model shows up here. */
const d = reconcile(DEFAULT_INPUT, "defaults");
close(d.cropHours, 10 * 9450, "crop hours");
close(d.jobsCost, 10 * 9450 * (0.29 + 0.26) * 22, "jobs cost");
close(d.replaced, 10 * 9450 * (0.29 + 0.26) * 0.7 * 22, "replaced");
close(d.saving, d.replaced * 0.3, "saving");
close(d.workers, (10 * 9450 * 0.55 * 0.7) / 1800, "workers");
close(d.total.saving, d.saving * [0, 1, 2, 3, 4].reduce((s, k) => s + 1.03 ** k, 0), "growth");

/* Edges: nothing switched on, everything switched on, no growth. */
const none = structuredClone(DEFAULT_INPUT);
for (const id of MODULE_IDS) none.modules[id].on = false;
const n = reconcile(none, "none");
assert.equal(n.saving, 0);
assert.equal(n.total.byHand, 0);

const all = structuredClone(DEFAULT_INPUT);
for (const id of MODULE_IDS) all.modules[id].on = true;
all.wageGrowth = 0;
all.years = 10;
const a = reconcile(all, "all");
close(a.total.saving, a.saving * 10, "flat growth");

/* The server's parser clamps, rejects partial input, and keeps good input. */
assert.deepEqual(parseRoiInput(DEFAULT_INPUT), DEFAULT_INPUT);
assert.equal(parseRoiInput({ ...DEFAULT_INPUT, crop: "banana" }), null);
assert.equal(parseRoiInput({ ...DEFAULT_INPUT, modules: {} }), null);
assert.equal(parseRoiInput({ ...DEFAULT_INPUT, areaHa: "10" }), null);
assert.equal(parseRoiInput({ ...DEFAULT_INPUT, areaHa: 1e9 }).areaHa, 200);
assert.equal(parseRoiInput({ ...DEFAULT_INPUT, years: 3.6 }).years, 4);

console.log("PASS  the ROI model reconciles");
console.log(
  `      defaults: saving €${Math.round(d.saving).toLocaleString("en-GB")} a year, ` +
    `€${Math.round(d.total.saving).toLocaleString("en-GB")} over ${DEFAULT_INPUT.years} years, ` +
    `${d.workers.toFixed(1)} workers`,
);
