import type { HeroContent } from "./types";

export const hero: HeroContent = {
  eyebrow: "Back to square one",

  heading: ["Growers liked it.", "Nobody needed it."],

  lead:
    "I pitched a glasshouse robot and walked out with polite yeses. Want, not need. So I stopped describing the robot and started over.",

  ctas: [
    {
      label: "Book a call",
      href: "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work",
      tone: "primary",
    },
    { label: "What went wrong", href: "#why", tone: "secondary" },
  ],

  note: "No hardware. No pitch. Just questions.",
};
