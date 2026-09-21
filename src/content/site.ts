import type { SiteContent } from "./types";

export const site: SiteContent = {
  name: "Vinea",
  tagline: "Starting from what growers say goes wrong.",
  metaTitle: "Vinea — starting from what growers say goes wrong",
  metaDescription:
    "Vinea is a discovery project in Dutch glasshouses: going task by task, asking growers what actually hurts, and following where the answers lead. No hardware yet, and no performance figures until a machine produces its own.",
  url: "https://getvinea.nl",
  email: "krishaanth@getvinea.nl",
  location: "Westland, Netherlands",
  person: "Krishaanth Ramaraj",

  /**
   * Five labels, seven sections. The three that carry the argument — the
   * method, the task map and the pushback — are reached by scrolling and by
   * the hero's second call to action, so the nav stays at the labels asked for.
   */
  nav: [
    { label: "what we're building", href: "#what-that-points-to" },
    { label: "for growers", href: "#for-growers" },
    { label: "for investors", href: "#for-investors" },
    { label: "about", href: "#where-this-stands" },
  ],

  footerLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/krishaanth-ramaraj/",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/krishaanth5831",
      external: true,
    },
  ],
};

/** The nav's own call to action, kept separate so it renders as a button. */
export const navCta = {
  label: "book a call",
  href: "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work",
  tone: "primary",
} as const;
