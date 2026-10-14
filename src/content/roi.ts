import type { Provenance, RoiContent } from "./types";

const WUR = "https://edepot.wur.nl/176513" as const;

const wur: Provenance = { kind: "source", label: "WUR", href: WUR };
const estimate: Provenance = { kind: "estimate", label: "Your estimate" };

/**
 * Copy for /roi. The defaults themselves live with the model, in
 * `src/lib/roi.ts`; each one is labelled here as sourced, an estimate, or
 * provisional. `{years}` and `{value}` are filled in by the page.
 */
export const roi: RoiContent = {
  meta: {
    title: "Vinea — ROI calculator",
    description:
      "Work out what Vinea's robots could take off your greenhouse's hands: the hours, the people and the money, job by job.",
  },

  intro: {
    eyebrow: "ROI calculator",
    heading: "What would robots save your greenhouse?",
    lead: "Put in your greenhouse and the jobs you'd hand over. Defaults come from Wageningen research where it exists and are marked as estimates where it doesn't. Change any of them.",
  },

  greenhouse: {
    heading: "Your greenhouse",
    crop: {
      label: "Crop",
      options: [
        { id: "truss-tomato", label: "Truss tomatoes" },
        { id: "cherry-tomato", label: "Cherry and snack tomatoes" },
        { id: "pepper", label: "Peppers" },
        { id: "cucumber", label: "Cucumbers" },
        { id: "other", label: "Something else" },
      ],
    },
    area: { label: "Area under glass", unit: "ha" },
    hours: {
      label: "Crop-work hours",
      unit: "h per ha a year",
      help: "All crop work: harvesting, leaves, twisting, lowering and the rest. The default is for tomatoes; change it if your crop differs.",
      provenance: wur,
    },
    cost: {
      label: "Labour cost",
      unit: "€ per hour",
      help: "All-in: wages, agency margin, housing and travel.",
      provenance: estimate,
    },
    pipeRail: {
      label: "Heating pipes between the rows?",
      help: "SPINE rides the heating pipes already in the greenhouse.",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  },

  modules: {
    heading: "Jobs to hand over",
    lead: "SPINE is the base. Switch on the jobs you'd give the robots, and set how much of each they take.",
    spine: {
      name: "SPINE",
      job: "The base",
      body: "Rides the heating pipes and carries whichever module the job needs.",
      badge: "Always on",
    },
    shareLabel: "Share of crop hours",
    takeoverLabel: "Robots take over",
    takeoverProvenance: { kind: "provisional", label: "Your assumption" },
    items: [
      {
        id: "blush",
        name: "BLUSH",
        job: "Harvesting",
        body: "Picks ripe fruit, checks the stem before the jaws close, and wraps the fruit instead of squeezing it.",
        shareProvenance: wur,
      },
      {
        id: "shear",
        name: "SHEAR",
        job: "Deleafing",
        body: "Strips the old leaves below the trusses.",
        shareProvenance: wur,
      },
      {
        id: "hoist",
        name: "HOIST",
        job: "Lowering and rehanging",
        body: "Lowers the plants and moves the hooks along the wire.",
        shareProvenance: { kind: "estimate", label: "Estimate" },
      },
      {
        id: "raven",
        name: "RAVEN",
        job: "Scouting",
        body: "Walks the rows for pests and disease, and marks where they start.",
        shareProvenance: { kind: "estimate", label: "Estimate" },
      },
    ],
    overflowWarning:
      "These jobs add up to more than all your crop hours. Lower a share until they fit.",
  },

  assumptions: {
    heading: "Assumptions",
    rent: {
      label: "Vinea's rent, as a share of the labour it replaces",
      help: "Vinea is rented like a crew, service included, and always priced below the labour it replaces. This share is provisional until after the pilot.",
      provenance: { kind: "provisional", label: "Provisional" },
    },
    growth: {
      label: "Wage growth a year",
      help: "How much dearer labour gets each year.",
      provenance: estimate,
    },
    workerHours: {
      label: "Hours a worker puts in",
      unit: "h a year",
      help: "Turns hours into people.",
      provenance: estimate,
    },
    years: { label: "Years to look ahead", unit: "years", one: "year" },
  },

  results: {
    heading: "What it comes to",
    savingLabel: "Saved in year one",
    savingOver: "{value} over {years}",
    empty: "Switch on a job to see what the robots take over.",
    tiles: {
      hours: "Hours handed over a year",
      people: "People you no longer have to find",
      today: "These jobs by hand, a year",
      rent: "Vinea's rent a year, provisional",
    },
    modulesHeading: "Job by job",
    legendRobot: "Robots",
    legendHand: "Still by hand",
    chartHeading: "Year by year",
    legendByHand: "All by hand",
    legendWithVinea: "With Vinea",
    yearLabel: "Year",
    crossCheck:
      "Harvesting comes to {value} per m² a year here. One Westland tomato grower told us theirs costs €5.",
    rentNote: "Rent covers SPINE, the modules and their service.",
  },

  method: {
    heading: "How it's worked out",
    steps: [
      "Crop hours = area × crop-work hours per hectare.",
      "A job's hours = crop hours × that job's share.",
      "Robot hours = a job's hours × how much of it the robots take over.",
      "Labour replaced = robot hours × labour cost. Rent = labour replaced × Vinea's share. Saving = labour replaced − rent.",
      "Each later year grows by the wage growth you set. People = robot hours ÷ the hours a worker puts in.",
      "The WUR shares are for the six main crop jobs in tomato: harvesting, removing leaves, de-shooting and twisting, clipping, lowering and truss pruning. Laid over all your crop hours, they run a little high if some of those hours go to other work.",
      "Lowering and scouting have no published share. The six main jobs leave about a quarter of the hours to clipping, lowering and truss pruning, so lowering starts at a third of that. Scouting starts as a guess.",
    ],
    sourcesHeading: "Sources",
    sources: [
      {
        label: "Crop-work hours and job shares: WUR GWorkS tomato report, citing Woerden (2005) and Van Beveren (2010)",
        href: WUR,
      },
      { label: "Harvesting at €5 per m² a year: a Westland tomato grower, interviewed in 2026" },
    ],
    key: { source: "Sourced", estimate: "Your estimate", provisional: "Provisional" },
  },

  save: {
    heading: "Save this estimate",
    lead: "Saving it shows me what greenhouses like yours need. Add an email if you'd like a reply.",
    role: {
      label: "You are",
      options: [
        { id: "grower", label: "A grower" },
        { id: "adviser", label: "A grower's adviser" },
        { id: "investor", label: "An investor" },
        { id: "other", label: "Something else" },
      ],
    },
    country: {
      label: "Where you grow",
      placeholder: "Choose a country",
      options: [
        { id: "nl", label: "Netherlands" },
        { id: "be", label: "Belgium" },
        { id: "de", label: "Germany" },
        { id: "uk", label: "United Kingdom" },
        { id: "fr", label: "France" },
        { id: "es", label: "Spain" },
        { id: "elsewhere", label: "Elsewhere" },
      ],
    },
    name: "Name",
    company: "Company",
    email: "Email",
    message: "Anything I should know?",
    optional: "Optional",
    consent: "Vinea may email me about this estimate.",
    consentNeeded: "Tick this so I can reply to your email.",
    submit: "Save estimate",
    sending: "Saving",
    done: "Saved. Thank you.",
    doneWithEmail: "Saved. I'll reply from krishaanth@getvinea.nl.",
    error: "That didn't save. Try again, or email krishaanth@getvinea.nl.",
    privacy:
      "Nothing is stored until you press save: no cookies, no tracking. Vinea keeps what you enter to learn what greenhouses need, and to reply if you asked. Email krishaanth@getvinea.nl to have it deleted.",
  },
};
