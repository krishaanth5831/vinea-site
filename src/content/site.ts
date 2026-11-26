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

/* A real booking page (cal.com, thirty minutes) since 2026-11-26. It is an
 * https link, so Button opens it in a new tab. */
export const BOOK_A_CALL = "https://cal.com/krishaanthramaraj5831/30min" as const;
export const INVESTOR_HELLO = mailto("Vinea — investor question");

export const site: SiteContent = {
  name: "Vinea",
  metaTitle: "Vinea — greenhouse robots taught by your crew",
  metaDescription:
    "Vinea is building robots that harvest trusses and cut leaves in the greenhouse you already have. They learn each job from recordings of your own crew and ride the heating pipes between your rows.",
  url: "https://getvinea.nl",
  email: EMAIL,
  location: "Amsterdam-based. Serving growers all over the Netherlands.",
  person: "Krishaanth Ramaraj",

  /*
   * Absolute, so they work from /deck and /roi too. On the home page Lenis
   * still catches them as same-page anchors and glides there.
   */
  nav: [
    { label: "What it is", href: "/#what" },
    { label: "How it learns", href: "/#how" },
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
