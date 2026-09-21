import type { HeroContent } from "./types";

export const hero: HeroContent = {
  eyebrow: "Westland, Netherlands",

  heading: "Every job in a Dutch glasshouse moves down the same aisle, one plant at a time.",

  lead:
    "Harvesting, deleafing, scouting, crop work, moving crates. Different jobs, same rail, same rows, same person walking them. Since August, Vinea has gone through the house task by task and asked growers what actually hurts — asked open, without steering anyone toward an answer we had already picked.",

  disclaimer:
    "There is no hardware. Nothing has run in a glasshouse. No performance figures appear on this site, and none will until a machine produces its own.",

  ctas: [
    {
      label: "Book a call",
      href: "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work",
      tone: "primary",
    },
    { label: "How we work", href: "#how-we-work", tone: "secondary" },
  ],
};
