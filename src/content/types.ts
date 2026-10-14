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
  eyebrow: string;
  /** Two lines, set large. */
  heading: [string, string];
  lead: string;
  ctas: [Cta, Cta];
  /** A short lead-in, then the two pages that say where Vinea is going. */
  note: string;
  noteLinks: [NavLink, NavLink];
};

export type WhyContent = {
  id: string;
  eyebrow: string;
  /**
   * Read one at a time as the mark comes apart: the polite yes, what it
   * really was, and square one.
   */
  beats: [string, string, string];
};

export type QuestionContent = {
  id: string;
  eyebrow: string;
  /** The one question every call now turns on. */
  question: string;
  body: string;
};

export type Finding = {
  /** Short, and doubles as the legend label under the mark. */
  title: string;
  body: string;
};

export type HeardContent = {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  /** Exactly four: each has its own pixel drawing, in this order. */
  findings: [Finding, Finding, Finding, Finding];
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
  | { kind: "table"; columns: [string, string, string]; rows: [string, string, string][] };

export type Slide = {
  /** Anchor for the slide, and the key the rail links to. */
  id: string;
  /** The small label above the headline. */
  kicker: string;
  /** Top right of the slide: where its figures come from, or the byline. */
  corner?: { label: string; href?: `https://${string}` };
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
