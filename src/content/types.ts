/**
 * Shapes for every piece of copy on the site.
 *
 * All prose lives in this folder. Components read from it and never inline
 * their own sentences, so the whole site can be edited from one place.
 */

export type Href = `#${string}` | `mailto:${string}` | `https://${string}`;

export type NavLink = {
  label: string;
  href: Href;
};

export type Cta = {
  label: string;
  href: Href;
  /** `primary` renders as the filled accent button, `secondary` as the quiet one. */
  tone: "primary" | "secondary";
};

export type SectionMeta = {
  /** Anchor target. Also what the nav links to. */
  id: string;
  /** Small label above the heading. */
  eyebrow: string;
  heading: string;
};

export type HeroContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  /** The honesty note. Stated plainly, not hidden in a footnote. */
  disclaimer: string;
  ctas: Cta[];
};

export type MethodStep = {
  /** The discipline, named as an instruction. */
  title: string;
  body: string;
};

export type MethodColumn = {
  title: string;
  items: string[];
};

export type MethodContent = {
  meta: SectionMeta;
  lead: string;
  steps: MethodStep[];
  columns: MethodColumn[];
  conclusion: string;
};

/** Whether a candidate job is still being looked at, or has been set aside. */
export type TaskStatus = "under evaluation" | "ruled out";

export type Task = {
  name: string;
  /** What the job actually is, in the words a grower would use. */
  summary: string;
  /** What growers say hurts about it. */
  pain: string;
  /** Why the job resists a machine. */
  hard: string;
  status: TaskStatus;
};

export type TasksContent = {
  meta: SectionMeta;
  lead: string;
  tasks: Task[];
  discardedTitle: string;
  discarded: { claim: string; because: string }[];
};

export type PlatformElement = {
  title: string;
  /** The grower-side observation this element follows from. */
  because: string;
  body: string;
};

export type PlatformContent = {
  meta: SectionMeta;
  lead: string;
  elements: PlatformElement[];
  pricingTitle: string;
  pricing: string;
  pricingLabel: string;
  caveat: string;
};

export type Blocker = {
  title: string;
  body: string;
};

export type ObjectionsContent = {
  meta: SectionMeta;
  lead: string;
  /** The grower objection, paraphrased. Not a testimonial, not attributed. */
  objection: string;
  objectionNote: string;
  answeredTitle: string;
  answered: Blocker[];
  unansweredTitle: string;
  unanswered: Blocker[];
  blockersTitle: string;
  blockers: Blocker[];
};

export type StatusContent = {
  meta: SectionMeta;
  lead: string;
  facts: { label: string; value: string }[];
  exists: { title: string; items: string[] };
  doesNotExist: { title: string; items: string[] };
};

export type ContactLane = {
  id: string;
  audience: string;
  heading: string;
  body: string;
  ask: string;
  cta: Cta;
};

export type ContactContent = {
  meta: SectionMeta;
  lead: string;
  lanes: ContactLane[];
};

export type FooterLink = {
  label: string;
  href: Href;
  external?: boolean;
};

export type SiteContent = {
  name: string;
  tagline: string;
  /** Used for <title> and social cards. */
  metaTitle: string;
  metaDescription: string;
  url: string;
  email: string;
  location: string;
  person: string;
  nav: NavLink[];
  footerLinks: FooterLink[];
};
