/**
 * Shapes for every piece of copy on the site.
 *
 * All prose lives in this folder. Components read from it and never inline
 * their own sentences, so the whole site can be edited from one place.
 */

export type Href =
  | `#${string}`
  | `/${string}`
  | `mailto:${string}`
  | `https://${string}`;

export type NavLink = {
  label: string;
  href: Href;
};

export type Cta = {
  label: string;
  href: Href;
  /** `primary` renders as the solid pill, `secondary` as the outlined one. */
  tone: "primary" | "secondary";
  /** Set for files: the name the browser saves the download under. */
  download?: string;
};

export type SiteContent = {
  name: string;
  metaTitle: string;
  metaDescription: string;
  url: `https://${string}`;
  email: string;
  location: string;
  person: string;
  nav: NavLink[];
  footerLinks: (NavLink & { external?: boolean })[];
};

export type HeroContent = {
  /** The line above the headline: where Vinea is today, said plainly. */
  status: string;
  /** A line each, set large. `accent` is the phrase in them that is lit. */
  heading: string[];
  accent: string;
  lead: string;
  ctas: [Cta, Cta];
  /** A short lead-in, then the two pages that say where Vinea is going. */
  note: string;
  noteLinks: [NavLink, NavLink];
};

/** One labelled part of the picture of the robot. */
export type WhatPart = {
  key: "base" | "module" | "swap";
  name: string;
  body: string;
};

/** One module the base can carry; each has its own picture. */
export type WhatModule = {
  key: "harvest" | "deleaf" | "lower";
  /** The job, as the button says it. */
  label: string;
  /** The module's name, in the label face. */
  name: string;
  line: string;
  /** What the module's still shows, for someone who can't see it. */
  alt: string;
};

/** One beat of the walk through the picture: what the robot is doing, and what to notice. */
export type WhatBeat = {
  /** Matches a beat in the rendered sequences; see `SEQ` and `WIRE` in src/lib/renders.ts. */
  key: "look" | "reach" | "carry" | "swap1" | "deleaf" | "swap2" | "lower" | "wire" | "flip";
  name: string;
  body: string;
};

export type WhatContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  /** Said on every picture: none of them is a photograph. */
  badge: string;
  /** What the scroll-scrubbed sequence shows, for someone who can't see it. */
  sequenceAlt: string;
  /** What the robot's camera says about a truss, drawn over the picture while it looks. */
  scan: { ready: string; wait: string };
  beats: WhatBeat[];
  /** The same idea in three plain lines, where the sequence isn't played. */
  parts: [WhatPart, WhatPart, WhatPart];
  modulesLabel: string;
  modules: [WhatModule, WhatModule, WhatModule];
};

export type JobStage = "sim" | "design" | "soon";

export type JobItem = {
  /** Picks the tile's picture. */
  key: "harvest" | "deleaf" | "lower" | "scout" | "base";
  name: string;
  job: string;
  body: string;
  stage: JobStage;
  /** What the tile's render shows, for someone who can't see it. */
  alt: string;
};

export type JobsContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  /** How each stage reads on the page. */
  stages: Record<JobStage, string>;
  items: JobItem[];
};

export type LearnStep = {
  /** One word. */
  label: string;
  title: string;
  body: string;
  /** What the step's loop shows, for someone who can't see it. */
  alt: string;
};

export type LearnContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  steps: [LearnStep, LearnStep, LearnStep];
  /** The label on each loop: it is a render, not footage. */
  badge: string;
  /** What has not happened yet, said under the steps. */
  note: string;
};

export type StatusContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  /** Short facts about who is building it, shown as chips. */
  facts: string[];
  columns: [
    { title: string; items: string[] },
    { title: string; items: string[] },
  ];
  links: { label: string; href: `https://${string}` }[];
};

export type RoadmapStage = {
  /** When, in words: the site carries no dates. */
  when: string;
  label: string;
  title: string;
  items: string[];
  /** The stage Vinea is in today. Exactly one should carry it. */
  current?: boolean;
};

export type RoadmapLane = {
  name: string;
  job: string;
  /** How many of the lane's steps are done, counting from the first. */
  reached: number;
};

export type RoadmapContent = {
  id: string;
  eyebrow: string;
  heading: string;
  /** The tag on the current stage. */
  here: string;
  stages: RoadmapStage[];
  lanes: {
    heading: string;
    /** The steps every module goes through, in order. */
    steps: [string, string, string, string];
    /** Screen-reader words for the table: its first column, and each cell's state. */
    moduleHeader: string;
    reachedLabel: string;
    notYetLabel: string;
    rows: RoadmapLane[];
  };
};

/** Something growers hold against robots, and what Vinea does about it. */
export type Objection = {
  title: string;
  worry: string;
  answer: string;
};

export type HeardContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  answerLabel: string;
  items: Objection[];
  note: string;
};

export type TalkContent = {
  id: string;
  eyebrow: string;
  heading: [string, string];
  lead: string;
  ctas: [Cta, Cta];
};

/* ---- pages beyond the home page -------------------------------------- */

export type PageMeta = {
  title: string;
  description: string;
};

/* ---- the deck ---------------------------------------------------------- */

/**
 * A drawing beside a slide's text, made of the mark's own cells. Each kind
 * carries its figures as data, so the drawing and its caption can never
 * disagree.
 */
export type DeckFigure =
  /** A row of cells, some lit: "a third", "four in five". */
  | { kind: "cells"; total: number; lit: number; columns: number; caption: string }
  /** One bar split into shares that add up to a whole. */
  | {
      kind: "split";
      parts: { label: string; share: number; tag?: string }[];
      caption: string;
    }
  /** SPINE with the four modules that ride on it. */
  | { kind: "modules"; base: string; modules: { name: string; job: string }[] }
  /** Steps in order, joined by the thread. */
  | { kind: "steps"; steps: string[] }
  /** Competitors as rows, rather than a paragraph. */
  | { kind: "table"; columns: [string, string, string]; rows: [string, string, string][] }
  /** Three headline figures side by side, each with what it counts. */
  | { kind: "stats"; stats: { value: string; text: string }[] }
  /**
   * A clip or a still from the deck, one or two stacked. Clips play only
   * while their slide is the current one; `caption` says what the picture
   * is (concept illustration, simulation, mock-up), as every picture must.
   */
  | {
      kind: "media";
      items: {
        /** File name in `public/deck/`, without extension. */
        name: string;
        type: "video" | "image";
        /** Width over height. */
        ratio: "16/9" | "8/9";
        /** What a screen reader hears. */
        alt: string;
        caption: string;
      }[];
    };

export type Slide = {
  /** Anchor for the slide, and the key the rail links to. */
  id: string;
  /** The small label above the headline. */
  kicker: string;
  /**
   * Top right of the slide: where its figures come from, or the byline.
   * A slide with several sources lists the rest in `more`, each linked.
   */
  corner?: {
    label: string;
    href?: `https://${string}`;
    more?: { label: string; href: `https://${string}` }[];
  };
  /** Set in capitals, one or two lines. */
  title: [string] | [string, string];
  /** Paragraphs. Empty when a figure carries the slide on its own. */
  body: string[];
  figure?: DeckFigure;
  /** The first, the talk and the last slides are laid out on their own. */
  layout?: "cover" | "talk" | "end";
  /** Links set under the body, for the closing slides. */
  links?: Cta[];
};

export type DeckContent = {
  meta: PageMeta;
  intro: {
    eyebrow: string;
    heading: string;
    lead: string;
    ctas: [Cta, Cta];
    hint: string;
  };
  pdf: { href: `/${string}`; filename: string };
  slides: Slide[];
  outro: {
    eyebrow: string;
    heading: string;
    lead: string;
    ctas: [Cta, Cta];
  };
};

/* ---- the ROI calculator ----------------------------------------------- */

/** Where a default comes from: a source, or the reader's own estimate. */
export type Provenance =
  | { kind: "source"; label: string; href?: `https://${string}` }
  | { kind: "estimate"; label: string }
  | { kind: "provisional"; label: string };

export type RoiModuleCopy = {
  id: "blush" | "shear" | "hoist" | "raven";
  name: string;
  job: string;
  body: string;
  shareProvenance: Provenance;
};

export type RoiContent = {
  meta: PageMeta;
  intro: { eyebrow: string; heading: string; lead: string };
  greenhouse: {
    heading: string;
    crop: { label: string; options: { id: string; label: string }[] };
    area: { label: string; unit: string };
    hours: { label: string; unit: string; help: string; provenance: Provenance };
    cost: { label: string; unit: string; help: string; provenance: Provenance };
    pipeRail: { label: string; help: string; options: { id: string; label: string }[] };
  };
  modules: {
    heading: string;
    lead: string;
    spine: { name: string; job: string; body: string; badge: string };
    shareLabel: string;
    takeoverLabel: string;
    takeoverProvenance: Provenance;
    items: RoiModuleCopy[];
    overflowWarning: string;
  };
  assumptions: {
    heading: string;
    rent: { label: string; help: string; provenance: Provenance };
    growth: { label: string; help: string; provenance: Provenance };
    workerHours: { label: string; unit: string; help: string; provenance: Provenance };
    years: { label: string; unit: string; one: string };
  };
  results: {
    heading: string;
    savingLabel: string;
    savingOver: string;
    empty: string;
    tiles: { hours: string; people: string; today: string; rent: string };
    modulesHeading: string;
    legendRobot: string;
    legendHand: string;
    chartHeading: string;
    legendByHand: string;
    legendWithVinea: string;
    yearLabel: string;
    crossCheck: string;
    rentNote: string;
  };
  method: {
    heading: string;
    steps: string[];
    sourcesHeading: string;
    sources: { label: string; href?: `https://${string}` }[];
    /** The three kinds of tag, shown together as a key. */
    key: { source: string; estimate: string; provisional: string };
  };
  save: {
    heading: string;
    lead: string;
    role: { label: string; options: { id: string; label: string }[] };
    country: { label: string; placeholder: string; options: { id: string; label: string }[] };
    name: string;
    company: string;
    email: string;
    message: string;
    optional: string;
    consent: string;
    consentNeeded: string;
    submit: string;
    sending: string;
    done: string;
    doneWithEmail: string;
    error: string;
    privacy: string;
  };
};
