/**
 * The ROI model behind /roi, kept free of React so the page, the save route
 * and `scripts/check-roi.mjs` all run the same arithmetic.
 *
 * Shares and rates are fractions (0.29, not 29). Money is euros a year,
 * hours are hours a year, and "year one" is the year the robots start.
 *
 * The model, in one line per step:
 *   crop hours      = area × hours per hectare
 *   a job's hours   = crop hours × the job's share
 *   robot hours     = a job's hours × how much of it the robots take over
 *   labour replaced = robot hours × cost per hour
 *   rent            = labour replaced × rent share   (provisional)
 *   saving          = labour replaced − rent
 *   year k          = year one × (1 + wage growth)^(k − 1)
 *
 * Rent is set as a share of the labour it replaces, not as a price, because
 * Vinea has no price yet: it is "priced below the labour it replaces" and
 * stays provisional until after the pilot.
 */

export const MODULE_IDS = ["blush", "shear", "hoist", "raven"] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

/*
 * Crop and heating pipes do not change the arithmetic; they are asked so a
 * saved estimate says what kind of greenhouse it came from. Both start
 * "unanswered", so a record never claims an answer the reader didn't give.
 */
export const CROP_IDS = [
  "unanswered",
  "truss-tomato",
  "cherry-tomato",
  "pepper",
  "cucumber",
  "other",
] as const;
export type CropId = (typeof CROP_IDS)[number];

export const PIPE_RAIL_IDS = ["unanswered", "yes", "no", "unsure"] as const;
export type PipeRailId = (typeof PIPE_RAIL_IDS)[number];

export type ModuleInput = {
  on: boolean;
  /** Share of all crop hours this job takes. */
  share: number;
  /** How much of this job the robots take over. */
  takeover: number;
};

export type RoiInput = {
  crop: CropId;
  pipeRail: PipeRailId;
  areaHa: number;
  hoursPerHa: number;
  costPerHour: number;
  /** Rent as a share of the labour the robots replace. Provisional. */
  rentShare: number;
  wageGrowth: number;
  /** Hours one worker puts in over a year, to turn hours into people. */
  workerHours: number;
  years: number;
  modules: Record<ModuleId, ModuleInput>;
};

/*
 * Defaults. Each one is either sourced or labelled as an estimate on the
 * page; `src/content/roi.ts` carries the label that goes with it.
 *
 * - 9,450 hours per hectare a year, tomato: Woerden (2005), cited in the
 *   WUR GWorkS report. Same figure as the deck.
 * - Harvest 29% and leaf removal 26%: Van Beveren (2010), same report. These
 *   are shares of the six main crop jobs, not of every hour on the farm.
 * - Lowering 8%: an estimate. The six jobs leave 24% to clipping, lowering
 *   and truss pruning between them; a third of that each is the guess.
 * - Scouting 3%, €22 an hour, 3% wage growth, 1,800 hours a worker: estimates.
 * - Robots take over 70% of a job, rent is 70% of the labour replaced: both
 *   provisional, and both sliders the reader is expected to move.
 */
export const DEFAULT_INPUT: RoiInput = {
  crop: "unanswered",
  pipeRail: "unanswered",
  areaHa: 10,
  hoursPerHa: 9450,
  costPerHour: 22,
  rentShare: 0.7,
  wageGrowth: 0.03,
  workerHours: 1800,
  years: 5,
  modules: {
    blush: { on: true, share: 0.29, takeover: 0.7 },
    shear: { on: true, share: 0.26, takeover: 0.7 },
    hoist: { on: false, share: 0.08, takeover: 0.7 },
    raven: { on: false, share: 0.03, takeover: 0.7 },
  },
};

/** Bounds for every number, used by the inputs and again by the server. */
export const LIMITS = {
  areaHa: { min: 0.5, max: 200, step: 0.5 },
  hoursPerHa: { min: 1000, max: 20000, step: 50 },
  costPerHour: { min: 8, max: 80, step: 0.5 },
  rentShare: { min: 0.3, max: 1, step: 0.01 },
  wageGrowth: { min: 0, max: 0.15, step: 0.005 },
  workerHours: { min: 800, max: 2600, step: 10 },
  years: { min: 1, max: 10, step: 1 },
  share: { min: 0, max: 0.6, step: 0.01 },
  takeover: { min: 0, max: 1, step: 0.05 },
} as const;

export type ModuleResult = {
  id: ModuleId;
  jobHours: number;
  jobCost: number;
  robotHours: number;
  replaced: number;
  rent: number;
  saving: number;
};

export type YearResult = {
  /** One-based: the first year with robots is year one. */
  year: number;
  byHand: number;
  withVinea: number;
  saving: number;
};

export type RoiResult = {
  cropHours: number;
  cropCost: number;
  /** € per m² a year for all crop work, and for harvesting alone. */
  costPerM2: number;
  harvestPerM2: number;
  /** Sum of the module shares that are switched on. Over one is an error. */
  shareOn: number;
  modules: ModuleResult[];
  /** Year one, for the jobs that are switched on. */
  jobsCost: number;
  robotHours: number;
  replaced: number;
  rent: number;
  saving: number;
  workers: number;
  years: YearResult[];
  total: { byHand: number; withVinea: number; saving: number };
};

export function computeRoi(input: RoiInput): RoiResult {
  const cropHours = input.areaHa * input.hoursPerHa;
  const cropCost = cropHours * input.costPerHour;
  const m2 = input.areaHa * 10_000;

  const modules: ModuleResult[] = MODULE_IDS.filter((id) => input.modules[id].on).map(
    (id) => {
      const { share, takeover } = input.modules[id];
      const jobHours = cropHours * share;
      const jobCost = jobHours * input.costPerHour;
      const robotHours = jobHours * takeover;
      const replaced = robotHours * input.costPerHour;
      const rent = replaced * input.rentShare;
      return { id, jobHours, jobCost, robotHours, replaced, rent, saving: replaced - rent };
    },
  );

  const sum = (pick: (m: ModuleResult) => number) =>
    modules.reduce((total, m) => total + pick(m), 0);

  const jobsCost = sum((m) => m.jobCost);
  const robotHours = sum((m) => m.robotHours);
  const replaced = sum((m) => m.replaced);
  const rent = sum((m) => m.rent);
  const saving = replaced - rent;

  const years: YearResult[] = Array.from({ length: input.years }, (_, k) => {
    const grow = (1 + input.wageGrowth) ** k;
    const byHand = jobsCost * grow;
    const withVinea = (jobsCost - replaced + rent) * grow;
    return { year: k + 1, byHand, withVinea, saving: byHand - withVinea };
  });

  const total = years.reduce(
    (acc, y) => ({
      byHand: acc.byHand + y.byHand,
      withVinea: acc.withVinea + y.withVinea,
      saving: acc.saving + y.saving,
    }),
    { byHand: 0, withVinea: 0, saving: 0 },
  );

  return {
    cropHours,
    cropCost,
    costPerM2: m2 ? cropCost / m2 : 0,
    harvestPerM2: m2 ? (cropCost * input.modules.blush.share) / m2 : 0,
    shareOn: MODULE_IDS.reduce(
      (total, id) => total + (input.modules[id].on ? input.modules[id].share : 0),
      0,
    ),
    modules,
    jobsCost,
    robotHours,
    replaced,
    rent,
    saving,
    workers: input.workerHours ? robotHours / input.workerHours : 0,
    years,
    total,
  };
}

/**
 * Every input a reader can change, by name. The page records which of these
 * the reader actually touched, so a saved estimate can tell a chosen value
 * from a default left alone.
 */
export const INPUT_KEYS = [
  "crop",
  "pipeRail",
  "areaHa",
  "hoursPerHa",
  "costPerHour",
  "rentShare",
  "wageGrowth",
  "workerHours",
  "years",
  ...MODULE_IDS.flatMap((id) => [`${id}.on`, `${id}.share`, `${id}.takeover`]),
] as const;

/* ---- checking what comes in over the wire ----------------------------- */

function num(value: unknown, { min, max }: { min: number; max: number }): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

function oneOf<T extends string>(value: unknown, options: readonly T[]): T | null {
  return typeof value === "string" && (options as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

/**
 * Turns an untrusted object into a RoiInput, clamping every number to its
 * bounds. Returns null if anything is missing or the wrong type: the page
 * always sends a whole input, so a partial one is not from the page.
 */
export function parseRoiInput(raw: unknown): RoiInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const crop = oneOf(r.crop, CROP_IDS);
  const pipeRail = oneOf(r.pipeRail, PIPE_RAIL_IDS);
  const areaHa = num(r.areaHa, LIMITS.areaHa);
  const hoursPerHa = num(r.hoursPerHa, LIMITS.hoursPerHa);
  const costPerHour = num(r.costPerHour, LIMITS.costPerHour);
  const rentShare = num(r.rentShare, LIMITS.rentShare);
  const wageGrowth = num(r.wageGrowth, LIMITS.wageGrowth);
  const workerHours = num(r.workerHours, LIMITS.workerHours);
  const years = num(r.years, LIMITS.years);
  if (
    !crop ||
    !pipeRail ||
    areaHa === null ||
    hoursPerHa === null ||
    costPerHour === null ||
    rentShare === null ||
    wageGrowth === null ||
    workerHours === null ||
    years === null
  ) {
    return null;
  }

  const rawModules = r.modules as Record<string, unknown> | undefined;
  if (!rawModules || typeof rawModules !== "object") return null;
  const modules = {} as Record<ModuleId, ModuleInput>;
  for (const id of MODULE_IDS) {
    const m = rawModules[id] as Record<string, unknown> | undefined;
    if (!m || typeof m !== "object" || typeof m.on !== "boolean") return null;
    const share = num(m.share, LIMITS.share);
    const takeover = num(m.takeover, LIMITS.takeover);
    if (share === null || takeover === null) return null;
    modules[id] = { on: m.on, share, takeover };
  }

  return {
    crop,
    pipeRail,
    areaHa,
    hoursPerHa,
    costPerHour,
    rentShare,
    wageGrowth,
    workerHours,
    years: Math.round(years),
    modules,
  };
}
