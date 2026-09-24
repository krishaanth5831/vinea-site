import type { TalkContent } from "./types";

export const talk: TalkContent = {
  id: "talk",
  eyebrow: "Talk to me",
  heading: ["Shown a machine you didn't buy?", "Tell me why."],
  lead: "I don't have the answer yet. The next weeks are calls, notes, and growers telling me what I got wrong.",

  ctas: [
    {
      label: "Book a call",
      href: "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work",
      tone: "primary",
    },
    {
      label: "Investor? Say hello",
      href: "mailto:krishaanth@getvinea.nl?subject=Vinea%20%E2%80%94%20investor%20question",
      tone: "secondary",
    },
  ],
};
