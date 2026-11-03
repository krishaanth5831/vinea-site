import type { HeroContent } from "./types";
import { BOOK_A_CALL } from "./site";

export const hero: HeroContent = {
  eyebrow: "Greenhouse robotics",

  heading: ["Greenhouse robots,", "taught by the crew."],

  lead:
    "Vinea records how greenhouse crews do their work, turns it into robot skills, and runs them on one platform inside the greenhouses growers already have.",

  ctas: [
    { label: "Book a call", href: BOOK_A_CALL, tone: "primary" },
    { label: "How it works", href: "#how", tone: "secondary" },
  ],

  note: "Also here",
  noteLinks: [
    { label: "Read the deck", href: "/deck" },
    { label: "Run your numbers", href: "/roi" },
  ],
};
