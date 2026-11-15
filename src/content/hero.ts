import type { HeroContent } from "./types";
import { BOOK_A_CALL } from "./site";

export const hero: HeroContent = {
  status: "In simulation today. Looking for pilot growers.",

  heading: ["The night shift,", "taught by your crew."],
  accent: "your crew",

  lead:
    "Vinea is building robots that harvest trusses and cut leaves between your rows. They learn each job from recordings of your own people, and ride the heating pipes you already have.",

  ctas: [
    { label: "Book a call", href: BOOK_A_CALL, tone: "primary" },
    { label: "See what it is", href: "#what", tone: "secondary" },
  ],

  note: "Also here",
  noteLinks: [
    { label: "Read the deck", href: "/deck" },
    { label: "Run your numbers", href: "/roi" },
  ],
};
