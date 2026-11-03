import type { SiteContent } from "./types";

/*
 * The one address on the site. Every mailto link is built from it, so it
 * can't drift between pages again. It's the founder's personal inbox,
 * because the getvinea.nl mailbox stopped receiving mail (2026-11-03).
 *
 * It holds digits, so the copy checks exempt email-shaped text from the
 * digit rule; see DECISIONS.md, "The email address".
 */
export const EMAIL = "krishaanth2007@gmail.com" as const;

export const mailto = (subject: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` as const;

export const BOOK_A_CALL = mailto("Talking about greenhouse work");
export const INVESTOR_HELLO = mailto("Vinea — investor question");

export const site: SiteContent = {
  name: "Vinea",
  metaTitle: "Vinea — greenhouse robots taught by the crew",
  metaDescription:
    "Vinea turns the way greenhouse crews work into robot skills, and runs them on one platform inside the greenhouses growers already have. How it works, where it stands, and what comes next.",
  url: "https://getvinea.nl",
  email: EMAIL,
  location: "Westland, Netherlands",
  person: "Krishaanth Ramaraj",

  /*
   * Absolute, so they work from /deck and /roi too. On the home page Lenis
   * still catches them as same-page anchors and glides there.
   */
  nav: [
    { label: "How it works", href: "/#how" },
    { label: "Where it stands", href: "/#now" },
    { label: "Roadmap", href: "/#roadmap" },
    { label: "The deck", href: "/deck" },
    { label: "ROI calculator", href: "/roi" },
  ],

  footerLinks: [
    { label: "The deck", href: "/deck" },
    { label: "ROI calculator", href: "/roi" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/krishaanth-ramaraj-230046282",
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
