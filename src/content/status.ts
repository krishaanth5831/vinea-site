import type { StatusContent } from "./types";

export const status: StatusContent = {
  meta: {
    id: "where-this-stands",
    eyebrow: "Where this stands",
    heading: "Early, and specific about how early.",
  },

  lead:
    "Stating plainly what does not exist yet is not a weakness to write around. It is the only way the rest of this page stays worth reading.",

  facts: [
    { label: "Stage", value: "Discovery. Grower conversations, ongoing since August." },
    { label: "Team", value: "A solo founder." },
    { label: "Alongside", value: "Full-time study." },
    { label: "Based", value: "Westland, Netherlands — in the houses, not near them." },
  ],

  exists: {
    title: "What exists",
    items: [
      "A method, run consistently: task by task, open questions, discards recorded.",
      "A map of the candidate jobs, each with the reason it resists a machine.",
      "A conclusion that keeps surviving contact with growers — one chassis, swappable tools.",
      "Conversations that are still running, and still changing the map.",
    ],
  },

  doesNotExist: {
    title: "What does not exist",
    items: [
      "Hardware. No chassis, no tool, no prototype in an aisle.",
      "A pilot. Nothing has run in a glasshouse.",
      "Performance figures. None will be published until a machine produces its own.",
      "Design partners, letters of intent or customers. Growers here are people who answered questions.",
    ],
  },
};
