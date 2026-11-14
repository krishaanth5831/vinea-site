import type { StatusContent } from "./types";

/*
 * Where Vinea is today. Traction is stated plainly, including what hasn't
 * happened yet. No counts and no grower names: see DECISIONS.md, "Where it
 * stands". Antler is named as a residency, which is what it is; it is not
 * an investment until Antler's committee says so.
 */
export const status: StatusContent = {
  id: "now",
  eyebrow: "Where it stands",
  heading: "Early, and building in the open.",
  lead: "Vinea is me, Krishaanth Ramaraj. I'm building it in Antler's residency in Amsterdam, alongside an Electrical Engineering degree at TU/e. Before this I built drones at Degla AI, a YC-backed startup.",

  facts: ["Antler residency, Amsterdam", "Electrical Engineering, TU/e", "Before: Degla AI, YC-backed"],

  columns: [
    {
      title: "With growers",
      items: [
        "I meet Dutch tomato growers in person, and walk in with a hypothesis for them to confirm or knock down instead of a blank page.",
        "Those meetings moved the bar: growers judge a robot against their crew, not against other robots.",
        "A second meeting with a grower gave me their crew's speeds to measure a pilot against. A letter of intent for that pilot is drafted.",
        "No grower has signed a letter of intent yet.",
      ],
    },
    {
      title: "On the bench",
      items: [
        "A desktop robot arm, with a camera model that tells ripe from unripe tomatoes live, on real fruit.",
        "In simulation, the arm harvests whole trusses and cuts old leaves flush at the stem, on routes planned around everything it mustn't touch.",
        "A scripted teacher produces the demonstrations today, and the first learned skills are training on them.",
        "A scripted demo of the whole system: the base on the pipes, taking on a different module for each job.",
        "Nothing has run in a working greenhouse yet.",
      ],
    },
  ],

  links: [
    { label: "B.L.U.S.H on GitHub", href: "https://github.com/krishaanth5831/B.L.U.S.H" },
    { label: "S.H.E.A.R on GitHub", href: "https://github.com/krishaanth5831/S.H.E.A.R" },
    { label: "H.O.I.S.T on GitHub", href: "https://github.com/krishaanth5831/H.O.I.S.T" },
  ],
};
