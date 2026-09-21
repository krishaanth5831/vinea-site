import type { ContactContent } from "./types";

export const contact: ContactContent = {
  meta: {
    id: "talk-to-us",
    eyebrow: "Talk to us",
    heading: "Different conversations, depending on who is asking.",
  },

  lead:
    "Both of them go to the same inbox, and both get the version of the story that is on this page.",

  lanes: [
    {
      id: "for-growers",
      audience: "For growers",
      heading: "Tell me what actually goes wrong in your house.",
      body:
        "This is not a sales call. There is nothing to sell — no hardware exists, and you will not be shown a demonstration. The ask is a short, bounded conversation about the jobs in your house: which one you would hand over first, what goes wrong in it, and what would have to be true before you would let a machine near it.",
      ask:
        "Bring the job that annoyed you this week. Disagreeing with everything above is a useful outcome, and it has changed the map before.",
      cta: {
        label: "Book a call",
        href: "mailto:krishaanth@getvinea.nl?subject=Grower%20conversation",
        tone: "primary",
      },
    },
    {
      id: "for-investors",
      audience: "For investors",
      heading: "Early, pre-hardware, and this page is the whole story.",
      body:
        "There is no deck with better numbers behind this. What exists is a method, a map of the jobs in a glasshouse, and a conclusion that has kept surviving contact with the people who do those jobs. What does not exist is written down a section above.",
      ask:
        "If a discovery project that has not built anything yet is interesting rather than disqualifying, get in touch and ask the hard version of the question.",
      cta: {
        label: "Get in touch",
        href: "mailto:krishaanth@getvinea.nl?subject=Vinea%20—%20investor%20question",
        tone: "secondary",
      },
    },
  ],
};
