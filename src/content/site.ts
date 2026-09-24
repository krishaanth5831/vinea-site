import type { SiteContent } from "./types";

const BOOK_A_CALL =
  "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work" as const;

export const site: SiteContent = {
  name: "Vinea",
  metaTitle: "Vinea — back to square one",
  metaDescription:
    "I pitched a glasshouse robot and got polite yeses. Now I ask growers one thing: what automation have you already been shown, and why didn't you buy it?",
  url: "https://getvinea.nl",
  email: "krishaanth@getvinea.nl",
  location: "Westland, Netherlands",
  person: "Krishaanth Ramaraj",

  nav: [
    { label: "What went wrong", href: "#why" },
    { label: "The question", href: "#question" },
    { label: "Refusals", href: "#refusals" },
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

/** The header's own call to action. */
export const navCta = {
  label: "Book a call",
  href: BOOK_A_CALL,
  tone: "primary",
} as const;
