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
  /** `primary` renders as the solid pill, `secondary` as the outlined one. */
  tone: "primary" | "secondary";
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
  /** The honesty line. One sentence, stated plainly. */
  note: string;
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
